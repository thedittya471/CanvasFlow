"use client";

import React from "react";
import { Cpu, Database, ArrowRightLeft } from "lucide-react";

export function TechStackBanner() {
  return (
    <section className="bg-[#f3ebd8]/20 border-y-2 border-[#0d2137]/10 py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="text-left space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#8e6e53] font-sans">
            compatibility engine
          </span>
          <h3 className="font-serif font-bold text-lg text-[#0d2137]">
            Engineered for Modern Web Architectures
          </h3>
        </div>
        <div className="flex flex-wrap items-center gap-6 text-xs font-serif font-semibold text-[#0d2137]/60">
          <span className="px-3 py-1.5 rounded bg-[#faf8f5] border border-[#0d2137]/15 shadow-[2px_2px_0px_0px_#8e6e53] flex items-center gap-1.5">
            <Cpu className="size-3.5" /> Next.js 16
          </span>
          <span className="px-3 py-1.5 rounded bg-[#faf8f5] border border-[#0d2137]/15 shadow-[2px_2px_0px_0px_#8e6e53] flex items-center gap-1.5">
            <Database className="size-3.5" /> Drizzle ORM
          </span>
          <span className="px-3 py-1.5 rounded bg-[#faf8f5] border border-[#0d2137]/15 shadow-[2px_2px_0px_0px_#8e6e53] flex items-center gap-1.5">
            <ArrowRightLeft className="size-3.5" /> tRPC Client
          </span>
        </div>
      </div>
    </section>
  );
}
