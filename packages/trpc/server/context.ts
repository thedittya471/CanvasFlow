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
    setHeaders: (headers: Headers) => void

    user?: TRPCCtxUser
}

export async function createContext({req, res}: CreateExpressContextOptions): Promise<TRPCContext> {
    const ctx: TRPCContext = {
        createCookie: createCookieFactory(res),
        getCookie: getCookieFactory(req),
        clearCookie: clearCookieFactory(res),
        req,
        setHeaders: (headers: Headers) => {
            headers.forEach((value, key) => {
                if (key.toLowerCase() === "set-cookie") {
                    res.append("Set-Cookie", value);
                } else {
                    res.setHeader(key, value);
                }
            });
        },
        user: undefined
    }

    return ctx
}
export type Context = Awaited<ReturnType<typeof createContext>>;
