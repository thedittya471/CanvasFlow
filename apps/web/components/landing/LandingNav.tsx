"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

interface LandingNavProps {
  isLoggedIn: boolean;
}

export function LandingNav({ isLoggedIn }: LandingNavProps) {
  return (
    <nav className="border-b-2 border-[#0d2137]/15 px-8 py-5 flex items-center justify-between max-w-7xl mx-auto">
      <div className="flex items-center gap-3">
        <Image
          src="/logo-removebg-preview.png"
          alt="CanvasFlow Logo"
          width={40}
          height={40}
          className="rounded-lg object-contain"
        />
        <span className="font-serif font-bold text-lg tracking-tight">CanvasFlow</span>
      </div>

      <div className="flex items-center gap-8">
        <Link
          href="/dashboard"
          className="text-xs font-serif font-semibold hover:text-[#8e6e53] transition-colors"
        >
          Builder
        </Link>
        <Link
          href="/dashboard"
          className="text-xs font-serif font-semibold hover:text-[#8e6e53] transition-colors"
        >
          Templates
        </Link>
        <Link
          href="/dashboard/pricing"
          className="text-xs font-serif font-semibold hover:text-[#8e6e53] transition-colors flex items-center gap-1"
        >
          Pricing
        </Link>
        <Link
          href={isLoggedIn ? "/dashboard" : "/signUp"}
          className="px-4 py-2 bg-[#0d2137] text-[#faf7f0] border-2 border-[#0d2137] rounded font-serif font-bold text-xs shadow-[3px_3px_0px_0px_#8e6e53] hover:shadow-[1px_1px_0px_0px_#8e6e53] hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer"
        >
          {isLoggedIn ? "Dashboard" : "Start Building"}
        </Link>
      </div>
    </nav>
  );
}
