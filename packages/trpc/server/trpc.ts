import { initTRPC, TRPCError } from "@trpc/server";
import { OpenApiMeta } from "trpc-to-openapi";
import type { } from "express-serve-static-core";
import type { } from "qs";

import { createContext } from "./context";
import { auth } from "./auth";

export const tRPCContext = initTRPC
  .meta<OpenApiMeta>()
  .context<typeof createContext>()
  .create({});

export const router = tRPCContext.router;

export const publicProcedure = tRPCContext.procedure;

export const authenticatedProcedure = tRPCContext.procedure.use(async options => {
  const { ctx } = options

  const session = await auth.api.getSession({
    headers: new Headers(ctx.req.headers as Record<string, string>),
  })

  if (!session) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User is not logged in",
    })
  }

  return options.next({
    ctx: {
      ...ctx,
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
      }
    }
  })
})
