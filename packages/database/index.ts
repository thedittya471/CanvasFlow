import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "./env";

// Explicitly configured connection pool (instead of node-postgres defaults).
// Shared by the app queries and Better Auth's drizzle adapter.
const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 10_000,
});

export const db = drizzle(pool);
export * from "drizzle-orm";
export * from "./schema";
export default db;
