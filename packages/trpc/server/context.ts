import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { Request } from "express";
import { getCookieFactory, createCookieFactory, clearCookieFactory } from "./utils/cookie";

export interface TRPCCtxUser {
    id: string
}

export interface TRPCContext {
    getCookie: ReturnType<typeof getCookieFactory>
    createCookie: ReturnType<typeof createCookieFactory>
    clearCookie: ReturnType<typeof clearCookieFactory>
    req: Request

    user?: TRPCCtxUser
}

export async function createContext({req, res}: CreateExpressContextOptions): Promise<TRPCContext> {
    const ctx: TRPCContext = {
        createCookie: createCookieFactory(res),
        getCookie: getCookieFactory(req),
        clearCookie: clearCookieFactory(res),
        req,
        user: undefined
    }

    return ctx
}
export type Context = Awaited<ReturnType<typeof createContext>>;
