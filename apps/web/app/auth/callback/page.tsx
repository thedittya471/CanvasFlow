"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    document.cookie = `cf_session=1; path=/; max-age=${60 * 60 * 24 * 7}; secure; samesite=lax`;
    router.replace("/dashboard");
  }, [router]);

  return null;
}
