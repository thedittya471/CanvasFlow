/**
 * Standalone migration runner.
 *
 * Why this exists: `drizzle-kit migrate` (used by `pnpm db:migrate`)
 * pulls in the full drizzle-kit dev dependency, ~30MB of code we don't
 * want on a production VM. The `migrate()` function from
 * `drizzle-orm/node-postgres/migrator` only needs `drizzle-orm` + `pg`,
 * both of which are already runtime deps of @repo/database.
 *
 * Invoked by `scripts/release.sh` after `rsync`-ing a release to the
 * VM and BEFORE flipping the `current` symlink — so a failed migration
 * never reaches live traffic.
 */
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("[migrate] DATABASE_URL is not set");
  process.exit(1);
}

const pool = new Pool({ connectionString: DATABASE_URL });
const db = drizzle(pool);

try {
  console.log("[migrate] applying pending migrations…");
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("[migrate] done.");
} catch (err) {
  console.error("[migrate] failed:", err);
  process.exit(1);
} finally {
  await pool.end();
}
