import { z } from "zod";

const envSchema = z.object({
  PORT: z.string().optional(),
  NODE_ENV: z.string().default("development"),
  BASE_URL: z.string().default("http://localhost:8000"),
  // Comma-separated list of additional origins to allow for CORS and
  // Better Auth's `trustedOrigins`. Set this on the VM via .env so the
  // production web subdomain can talk to the API.
  //   TRUSTED_ORIGINS=https://canvasflow.dittya.dev
  TRUSTED_ORIGINS: z.string().optional(),
  // Cookie domain shared between the web and api subdomains so the
  // Better Auth session cookie set by /api/auth/* on `api.canvasflow.…`
  // is readable from `canvasflow.…`. Leading dot is conventional but
  // not required by RFC 6265.
  //   COOKIE_DOMAIN=.canvasflow.dittya.dev
  COOKIE_DOMAIN: z.string().optional(),
});

function createEnv(env: NodeJS.ProcessEnv) {
  const safeParseResult = envSchema.safeParse(env);
  if (!safeParseResult.success) throw new Error(safeParseResult.error.message);
  return safeParseResult.data;
}

export const env = createEnv(process.env);
