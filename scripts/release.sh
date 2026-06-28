#!/usr/bin/env bash
#
# Flat-layout release script. Runs on the VM during a deploy, invoked
# over SSH by GitHub Actions.
#
# Layout it operates on:
#   /home/deploy/canvasflow/
#     ├── .env                  (prod secrets, never overwritten)
#     ├── web/                  (Next.js standalone — replaced each deploy)
#     ├── api/                  (api bundle — replaced each deploy)
#     ├── db/                   (migrations + migrate.mjs — replaced)
#     └── ecosystem.config.cjs  (replaced)
#
# What it does:
#   1. Extract the just-uploaded tarball into a temp dir.
#   2. Run DB migrations from the new bundle BEFORE swapping files —
#      if migrations fail, the running processes keep serving the old code.
#   3. rsync the temp dir over the deploy dir (excluding .env).
#   4. Symlink .env into each app's cwd so dotenv finds it.
#   5. pm2 reload (zero-downtime).
#
set -euo pipefail

DEPLOY_DIR="/home/deploy/canvasflow"
TARBALL="${1:-/tmp/canvasflow-release.tar.gz}"

if [ ! -f "${TARBALL}" ]; then
  echo "[release] tarball missing: ${TARBALL}" >&2
  exit 1
fi
if [ ! -f "${DEPLOY_DIR}/.env" ]; then
  echo "[release] ${DEPLOY_DIR}/.env missing — run scripts/bootstrap.sh first" >&2
  exit 1
fi

INCOMING="$(mktemp -d -t canvasflow-incoming.XXXXXX)"
trap 'rm -rf "${INCOMING}"' EXIT

echo "[release] extracting tarball"
tar -xzf "${TARBALL}" -C "${INCOMING}"

# ─── 1. Migrations ───────────────────────────────────────────────────
# Run from the NEW bundle so a forgotten migration breaks the deploy
# instead of leaving production half-migrated. The running processes
# keep serving the old code until pm2 reload below.
echo "[release] applying migrations"
(
  set -a
  # shellcheck disable=SC1090
  . "${DEPLOY_DIR}/.env"
  set +a
  cd "${INCOMING}/db"
  node migrate.mjs
)

# ─── 2. Swap files ───────────────────────────────────────────────────
# rsync with --delete cleans up files that no longer exist in the new
# bundle (e.g. removed packages). The top-level .env is preserved via
# --exclude. The brief window during rsync is not a real concern
# because pm2 has the old code already loaded in memory; processes
# only re-read disk on the reload below.
echo "[release] swapping files into ${DEPLOY_DIR}"
rsync -a --delete --exclude='.env' "${INCOMING}/" "${DEPLOY_DIR}/"

# ─── 3. .env wiring ──────────────────────────────────────────────────
# Both processes read .env from their cwd (dotenv defaults). Symlinks
# point each cwd's .env at the canonical one at the deploy-dir root.
ln -sf "${DEPLOY_DIR}/.env" "${DEPLOY_DIR}/api/.env"
ln -sf "${DEPLOY_DIR}/.env" "${DEPLOY_DIR}/web/apps/web/.env"
ln -sf "${DEPLOY_DIR}/.env" "${DEPLOY_DIR}/db/.env"

# ─── 4. Reload PM2 ───────────────────────────────────────────────────
cd "${DEPLOY_DIR}"
if pm2 describe canvasflow-api >/dev/null 2>&1; then
  echo "[release] reloading pm2 processes"
  pm2 reload "${DEPLOY_DIR}/ecosystem.config.cjs" --update-env
else
  echo "[release] first deploy — starting pm2 processes"
  pm2 start "${DEPLOY_DIR}/ecosystem.config.cjs"
  pm2 save
fi

# Clean the uploaded tarball — we don't keep release artifacts.
rm -f "${TARBALL}"

echo "✅ deployed"
