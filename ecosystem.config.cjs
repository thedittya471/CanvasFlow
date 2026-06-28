/**
 * PM2 process file for the production VM (flat layout — no releases).
 *
 *   /home/deploy/canvasflow/
 *     ├── .env                  (prod secrets)
 *     ├── ecosystem.config.cjs  ← this file
 *     ├── web/apps/web/server.js
 *     ├── api/dist/index.js
 *     └── db/{drizzle/,migrate.mjs}
 *
 * Both processes bind to 127.0.0.1 only — Nginx (443) terminates TLS
 * and reverse-proxies into them. NEVER bind these to 0.0.0.0; the Azure
 * NSG should only have 22/80/443 open externally.
 */

const BASE = "/home/deploy/canvasflow";

module.exports = {
  apps: [
    {
      name: "canvasflow-api",
      cwd: `${BASE}/api`,
      script: "./dist/index.js",
      // pm2 inherits the process env; our code reads .env via
      // `dotenv/config`, which reads from cwd. release.sh symlinks
      // the canonical .env into each cwd.
      env: {
        NODE_ENV: "production",
        PORT: "8000",
      },
      instances: 1,
      exec_mode: "fork",
      max_memory_restart: "400M",
      max_restarts: 10,
      min_uptime: "10s",
    },
    {
      name: "canvasflow-web",
      // Next.js standalone places the server at this nested path
      // because tracing preserves the workspace layout.
      cwd: `${BASE}/web/apps/web`,
      script: "./server.js",
      env: {
        NODE_ENV: "production",
        PORT: "3000",
        // Bind to loopback only — nginx proxies into it.
        HOSTNAME: "127.0.0.1",
      },
      instances: 1,
      exec_mode: "fork",
      max_memory_restart: "500M",
      max_restarts: 10,
      min_uptime: "10s",
    },
  ],
};
