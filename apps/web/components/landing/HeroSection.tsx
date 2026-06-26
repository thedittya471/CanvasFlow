"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface HeroSectionProps {
  isLoggedIn: boolean;
}

export function HeroSection({ isLoggedIn }: HeroSectionProps) {
  return (
    <section className="max-w-6xl mx-auto px-6 pt-20 pb-24 text-center space-y-8 relative">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f3ebd8] border border-[#0d2137]/15 text-[10px] font-sans font-bold uppercase tracking-wider text-[#0d2137]/70">
        <span className="w-1.5 h-1.5 rounded-full bg-[#8e6e53] animate-ping" />
        <span>Now in v2.0 Release</span>
      </div>

      <div className="relative max-w-3xl mx-auto">
        <h1 className="text-5xl sm:text-6xl font-serif font-bold tracking-tight leading-[1.08] text-[#0d2137]">
          Forms, but <span className="text-[#8e6e53]">faster.</span>
        </h1>

        {/* Floating blueprint robot mascot on the right */}
        <div
          className="absolute -right-32 top-4 hidden lg:block animate-bounce"
          style={{ animationDuration: "4s" }}
        >
          <div className="bg-[#faf8f5] border-2 border-[#0d2137] rounded-2xl p-4 flex flex-col items-center shadow-[4px_4px_0px_0px_#8e6e53] relative w-24">
            <div className="w-12 h-8 bg-[#f3ebd8] rounded-full flex items-center justify-center gap-2 relative border-2 border-[#0d2137]">
              <div className="size-2 rounded-full bg-[#8e6e53]" />
              <div className="size-2 rounded-full bg-[#8e6e53]" />
              <div className="absolute -bottom-1.5 w-6 h-2 border-b-2 border-[#0d2137] rounded-full" />
            </div>
            <div className="w-6 h-1 bg-[#8e6e53]/40 mt-1 rounded" />
            <div className="w-16 h-10 bg-[#faf8f5] border-2 border-[#0d2137] rounded-lg mt-3 flex items-center justify-center relative">
              <span className="text-[7px] font-mono font-bold text-[#0d2137]">CF v2.0</span>
            </div>
          </div>
        </div>
      </div>

      <p className="max-w-xl mx-auto text-sm text-[#0d2137]/75 leading-relaxed font-sans font-medium">
        Create, publish, and analyze dynamic forms from one community-native workspace. Built for
        developers who value performance and clean data.
      </p>

      <div className="flex items-center justify-center gap-4 pt-2">
        <Link
          href={isLoggedIn ? "/dashboard" : "/signUp"}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#0d2137] text-[#faf7f0] border-2 border-[#0d2137] rounded font-serif font-bold text-xs shadow-[4px_4px_0px_0px_#8e6e53] hover:shadow-[1px_1px_0px_0px_#8e6e53] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
        >
          <span>{isLoggedIn ? "Go to Dashboard" : "Start Building"}</span>
          <ArrowRight className="size-4" />
        </Link>
        <Link
          href={isLoggedIn ? "/dashboard" : "/signUp"}
          className="px-6 py-3 border-2 border-[#0d2137] hover:bg-[#f3ebd8]/30 text-[#0d2137] rounded font-serif font-bold text-xs transition-all shadow-[2px_2px_0px_0px_#8e6e53]"
        >
          Explore Templates
        </Link>
      </div>
    </section>
  );
}
