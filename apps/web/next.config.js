import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Produces a self-contained build at `.next/standalone/` we can ship to
  // a VM and run with `node apps/web/server.js`. No `node_modules` or
  // source needed on the box at runtime.
  output: "standalone",
  // Critical for a Turborepo/pnpm-workspace setup: tell Next's file
  // tracer to walk up to the workspace root so internal `@repo/*`
  // packages are pulled into the standalone bundle. Without this you'll
  // get "Cannot find module '@repo/trpc'" at runtime.
  outputFileTracingRoot: path.join(__dirname, "../.."),
};

export default nextConfig;
