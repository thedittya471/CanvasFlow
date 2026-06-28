#!/usr/bin/env bash
#
# One-time VM setup. Run as a user with sudo (NOT as the deploy user).
# Idempotent — safe to re-run if you change something.
#
#   curl -fsSL https://raw.githubusercontent.com/<owner>/<repo>/main/scripts/bootstrap.sh | bash
#
# Or, if you've already cloned the repo:
#   bash scripts/bootstrap.sh
#
set -euo pipefail

DEPLOY_USER="${DEPLOY_USER:-deploy}"
DEPLOY_HOME="/home/${DEPLOY_USER}"
APP_DIR="${DEPLOY_HOME}/canvasflow"

echo "==> Updating apt + base packages"
sudo apt update
sudo apt install -y curl ca-certificates gnupg rsync build-essential ufw fail2ban

# ─── Swap file (4GB) ─────────────────────────────────────────────────
# Required on a 4GB box: `next build` can spike past 2GB. Without this,
# the OOM killer takes node out silently and CI's deploy step succeeds
# while leaving you with a partial release.
if [ ! -f /swapfile ]; then
  echo "==> Creating 4GB swap file"
  sudo fallocate -l 4G /swapfile
  sudo chmod 600 /swapfile
  sudo mkswap /swapfile
  sudo swapon /swapfile
  echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
  sudo sysctl vm.swappiness=10
fi

# ─── Firewall ────────────────────────────────────────────────────────
# Defence in depth on top of the Azure NSG.
echo "==> Configuring ufw"
sudo ufw --force reset
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

# ─── Node 20 + pnpm 9 + pm2 ──────────────────────────────────────────
if ! command -v node >/dev/null 2>&1; then
  echo "==> Installing Node 20 LTS"
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt install -y nodejs
fi

echo "==> Enabling pnpm 9 + installing pm2"
sudo corepack enable
sudo corepack prepare pnpm@9 --activate
sudo npm install -g pm2

# ─── Nginx + certbot ─────────────────────────────────────────────────
# These are installed for you here; the actual site configs are managed
# manually on the VM (not shipped from the repo). See README for the
# canonical commands to drop into /etc/nginx/sites-available/ and run
# certbot.
echo "==> Installing nginx + certbot"
sudo apt install -y nginx certbot python3-certbot-nginx

# ─── Deploy user ─────────────────────────────────────────────────────
if ! id "${DEPLOY_USER}" >/dev/null 2>&1; then
  echo "==> Creating user '${DEPLOY_USER}'"
  sudo useradd -m -s /bin/bash "${DEPLOY_USER}"
  sudo mkdir -p "${DEPLOY_HOME}/.ssh"
  sudo chmod 700 "${DEPLOY_HOME}/.ssh"
  sudo touch "${DEPLOY_HOME}/.ssh/authorized_keys"
  sudo chmod 600 "${DEPLOY_HOME}/.ssh/authorized_keys"
  sudo chown -R "${DEPLOY_USER}:${DEPLOY_USER}" "${DEPLOY_HOME}"
  echo "  ┌─ ACTION REQUIRED ────────────────────────────────────────"
  echo "  │ Paste the GitHub Actions deploy key public part into:    "
  echo "  │   ${DEPLOY_HOME}/.ssh/authorized_keys                    "
  echo "  └──────────────────────────────────────────────────────────"
fi

# ─── App directory layout ───────────────────────────────────────────
# Flat layout — each deploy overwrites web/, api/, db/, and the
# ecosystem file. The .env at the root is written by the GitHub Actions
# deploy workflow from the PROD_ENV repo secret on every run; no need
# to nano it on the VM by hand.
echo "==> Preparing ${APP_DIR}"
sudo -u "${DEPLOY_USER}" mkdir -p "${APP_DIR}"

# ─── PM2 boot ───────────────────────────────────────────────────────
echo "==> Configuring pm2 to start on boot (as ${DEPLOY_USER})"
sudo env PATH="$PATH:/usr/bin" /usr/lib/node_modules/pm2/bin/pm2 startup \
  systemd -u "${DEPLOY_USER}" --hp "${DEPLOY_HOME}" || true

# ─── Nginx site configs (templates) ─────────────────────────────────
# Nginx site configs are managed manually on the VM (intentionally not
# in the repo). After your first release lands, write two server
# blocks under /etc/nginx/sites-available/ — one for each subdomain —
# enable them, and run certbot. See the project README's
# "Deployment → First-time VM setup" section for the full commands.

echo
echo "✅ Bootstrap done. Next steps:"
echo "   1. Paste the GH Actions deploy key public part into:"
echo "        ${DEPLOY_HOME}/.ssh/authorized_keys"
echo "   2. Configure the PROD_ENV GitHub secret (the full .env file content)."
echo "   3. Push to main — GH Actions will deploy."
echo "   4. After the first deploy, set up nginx + TLS manually on the VM:"
echo "      - write two server blocks under /etc/nginx/sites-available/"
echo "      - enable them with ln -sf into /etc/nginx/sites-enabled/"
echo "      - sudo nginx -t && sudo systemctl reload nginx"
echo "      - sudo certbot --nginx -d <web-subdomain> -d <api-subdomain>"
