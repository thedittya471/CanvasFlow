"use client";

import React from "react";
import { ShieldCheck, Zap, BarChart3, Info } from "lucide-react";

export function FeaturesGrid() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20 border-t border-[#0d2137]/10">
      <div className="text-center space-y-3 mb-16">
        <span className="text-[10px] uppercase font-bold tracking-widest text-[#8e6e53] font-sans">
          core architecture
        </span>
        <h2 className="text-3xl font-serif font-bold text-[#0d2137]">
          Crafted for Schema Stability
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="flex items-start gap-4 text-left">
          <div className="p-3 bg-[#f3ebd8] border-2 border-[#0d2137] rounded shadow-[2px_2px_0px_0px_#8e6e53] shrink-0">
            <Zap className="size-5 text-[#8e6e53]" />
          </div>
          <div className="space-y-2">
            <h4 className="font-serif font-bold text-base text-[#0d2137]">Durable Schema Keys</h4>
            <p className="text-xs text-[#0d2137]/75 font-sans leading-relaxed">
              When fields are added to the canvas, they initialize with clean, safe schemas.
              First-time updates slugify the user label into an immutable DB identifier. Your
              endpoints and webhook consumers will never suffer database structural errors during
              subsequent renames.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 text-left">
          <div className="p-3 bg-[#f3ebd8] border-2 border-[#0d2137] rounded shadow-[2px_2px_0px_0px_#8e6e53] shrink-0">
            <ShieldCheck className="size-5 text-[#8e6e53]" />
          </div>
          <div className="space-y-2">
            <h4 className="font-serif font-bold text-base text-[#0d2137]">Plan-Based Limitations</h4>
            <p className="text-xs text-[#0d2137]/75 font-sans leading-relaxed">
              We count user drafts and active submission endpoints dynamically matching database
              allocations. The backend actively controls schema counts and responses in compliance
              with workspace limits (e.g. 5 forms/month for the Free tier).
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 text-left">
          <div className="p-3 bg-[#f3ebd8] border-2 border-[#0d2137] rounded shadow-[2px_2px_0px_0px_#8e6e53] shrink-0">
            <BarChart3 className="size-5 text-[#8e6e53]" />
          </div>
          <div className="space-y-2">
            <h4 className="font-serif font-bold text-base text-[#0d2137]">Conversion Metrics</h4>
            <p className="text-xs text-[#0d2137]/75 font-sans leading-relaxed">
              Integrated tracking logs view counts and user-agent classifications immediately. Your
              dashboard provides a simple device distribution breakdown, submission growth rates, and
              sketch stats.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 text-left">
          <div className="p-3 bg-[#f3ebd8] border-2 border-[#0d2137] rounded shadow-[2px_2px_0px_0px_#8e6e53] shrink-0">
            <Info className="size-5 text-[#8e6e53]" />
          </div>
          <div className="space-y-2">
            <h4 className="font-serif font-bold text-base text-[#0d2137]">Compact Canvas Controls</h4>
            <p className="text-xs text-[#0d2137]/75 font-sans leading-relaxed">
              Connect fields, position nodes dynamically, and edit attributes in the inspector
              drawer. Our editor maps canvas positions cleanly to output nodes, making design
              configurations quick and painless.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
