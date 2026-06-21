import { httpLink, httpBatchStreamLink } from "@repo/trpc/client";
import { env } from "~/env.js";

interface CreateTRPCHttpBatchClientClientOpts {
  enableStreaming?: boolean;
}

export const createTRPCHttpBatchClientClient = (opts?: CreateTRPCHttpBatchClientClientOpts) => {
  const c = opts?.enableStreaming ? httpBatchStreamLink : httpLink;
  
  let url = env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/trpc";
  if (url && !url.endsWith("/trpc")) {
    url = `${url.replace(/\/$/, "")}/trpc`;
  }

  return c({
    url,
    fetch(fetchUrl, options) {
      const match = typeof document !== "undefined" && document.cookie.match(new RegExp('(^| )authentication-token=([^;]+)'));
      const token = match ? match[2] : null;

      const headers = new Headers(options?.headers);
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return fetch(fetchUrl, {
        ...options,
        headers,
        credentials: "include",
      });
    },
  });
};
