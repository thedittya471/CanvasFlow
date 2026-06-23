import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import db from "@repo/database";
import { usersTable, sessionsTable, accountsTable, verificationsTable } from "@repo/database/models/auth";

export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:8000",
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: {
            user: usersTable,
            session: sessionsTable,
            account: accountsTable,
            verification: verificationsTable,
        },
    }),
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID || "placeholder_google_client_id",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "placeholder_google_client_secret",
        },
        github: {
            clientId: process.env.GITHUB_CLIENT_ID || "placeholder_github_client_id",
            clientSecret: process.env.GITHUB_CLIENT_SECRET || "placeholder_github_client_secret",
        },
    },
    trustedOrigins: [
        "http://localhost:3000",
        "https://canvas-flow-web.vercel.app",
        "https://canvas-flow-web-git-main-dittya-maitys-projects.vercel.app"
    ],
    advanced: {
        cookiePrefix: "better-auth",
        useSecureCookies: true,
        defaultCookieAttributes: {
            sameSite: "none",
            secure: true,
        }
    },
});

export type Auth = ReturnType<typeof betterAuth>
export type Session = Auth["$Infer"]["Session"]
