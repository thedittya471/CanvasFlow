import express from "express";
import { logger } from "@repo/logger";
import cors from "cors";

import * as trpcExpress from "@trpc/server/adapters/express";
import { generateOpenApiDocument, createOpenApiExpressMiddleware } from "trpc-to-openapi";
import cookieParser from 'cookie-parser'

import { serverRouter, createContext } from "@repo/trpc/server";
import { auth } from "@repo/trpc/server/auth";
import { toNodeHandler } from "better-auth/node";

import { env } from "./env";

export const app = express();

const openApiDocument = generateOpenApiDocument(serverRouter, {
  title: "CanvasFlow OpenAPI",
  version: "1.0.0",
  baseUrl: env.BASE_URL.concat("/api"),
});

const allowedOrigins = [
  "http://localhost:3000",
  "https://canvas-flow-web.vercel.app",
  "https://canvas-flow-web-git-main-dittya-maitys-projects.vercel.app",
];

// CORS must run before every handler, including the better-auth handler.
// Express v5 note: middleware registered with app.use() runs for ALL routes.
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (server-to-server, curl, etc.)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"],
    // Cache preflight for 2 hours — eliminates the ~700ms OPTIONS round-trip
    // on every cross-origin request after the first.
    maxAge: 7200,
  }),
);

app.use(cookieParser());

// Better Auth handler must be mounted BEFORE express.json().
// Express v5 wildcard syntax: "*splat" (not "{*splat}" which is v4).
// Per the better-auth Express docs, do NOT use express.json() before this.
app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

app.get("/", (req, res) => {
  return res.json({ message: "CanvasFlow is up and running..." });
});

app.get("/health", (req, res) => {
  return res.json({ message: "CanvasFlow server is healthy", healthy: true });
});

// Diagnostic: confirm which social providers are active (safe — no secrets)
app.get("/api/auth/providers", (req, res) => {
  const providers = [];
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) providers.push("google");
  if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) providers.push("github");
  return res.json({ providers, baseURL: process.env.BETTER_AUTH_URL || "not set" });
});

logger.debug(`openapi.json: ${env.BASE_URL}/openapi.json`);
app.get("/openapi.json", (req, res) => {
  return res.json(openApiDocument);
});

logger.debug(`docs: ${env.BASE_URL}/docs`);
app.use("/docs", async (req, res, next) => {
  try {
    const { apiReference } = await import("@scalar/express-api-reference");
    (apiReference({ url: "/openapi.json" }) as unknown as express.RequestHandler)(req, res, next);
  } catch (error) {
    next(error);
  }
});

app.use(
  "/api",
  createOpenApiExpressMiddleware({
    router: serverRouter,
    createContext,
  }),
);

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: serverRouter,
    createContext,
  }),
);

export default app;
