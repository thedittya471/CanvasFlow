import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { getCookieFactory, createCookieFactory, clearCookieFactory } from "./utils/cookie";

export interface TRPCContext {
    getCookie: ReturnType<typeof getCookieFactory>
    createCookie: ReturnType<typeof createCookieFactory>
    clearCookie: ReturnType<typeof clearCookieFactory>
}

export async function createContext({req, res}: CreateExpressContextOptions): Promise<TRPCContext> {
    const ctx: TRPCContext = {
        createCookie: createCookieFactory(res),
        getCookie: getCookieFactory(req),
        clearCookie: clearCookieFactory(res)
    }

    return ctx
}
export type Context = Awaited<ReturnType<typeof createContext>>;
