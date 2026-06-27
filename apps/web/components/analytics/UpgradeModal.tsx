"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, X, TrendingUp, BarChart3, Target, Zap } from "lucide-react";

interface UpgradeModalProps {
  onClose: () => void;
}

const proFeatures = [
  { icon: BarChart3, label: "Per-question response distribution" },
  { icon: TrendingUp, label: "30 / 60 / 90 day trend comparison" },
  { icon: Target, label: "Response velocity (first 24h spike)" },
  { icon: Zap, label: "Day-of-week engagement breakdown" },
];

export function UpgradeModal({ onClose }: UpgradeModalProps) {
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-[#0d2137]/55 backdrop-blur-sm">
      <div className="bg-white border-2 border-[#0d2137] rounded shadow-[8px_8px_0px_0px_#8e6e53] max-w-md w-full mx-4 overflow-hidden">

        {/* Header */}
        <div className="relative bg-[#0d2137] px-6 py-5">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-white/50 hover:text-white cursor-pointer transition-colors"
          >
            <X className="size-4.5" />
          </button>
          <div className="flex items-center gap-2.5">
            <Sparkles className="size-5 text-[#d4af37] fill-[#d4af37]" />
            <div>
              <p className="text-[9px] uppercase tracking-widest font-serif font-bold text-[#d4af37]">
                Pro+ Feature
              </p>
              <h3 className="text-xl font-serif font-bold text-white leading-tight">
                Detailed Analytics
              </h3>
            </div>
          </div>
          <p className="text-sm text-white/60 font-serif mt-2 leading-relaxed">
            Available on Pro+ and Business plans — unlock deeper per-question insights and engagement breakdowns.
          </p>
        </div>

        {/* Features */}
        <div className="px-6 py-5 space-y-3">
          <p className="text-[10px] uppercase tracking-widest font-serif font-bold text-[#0d2137]/55">
            What you&apos;ll get
          </p>
          {proFeatures.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="flex items-center gap-3">
                <div className="p-1.5 bg-[#d4af37]/10 border border-[#d4af37]/25 rounded">
                  <Icon className="size-3.5 text-[#8e6e53]" />
                </div>
                <span className="text-xs font-serif text-[#0d2137]">
                  {f.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="px-6 pb-6 flex gap-3">
          <Link
            href="/dashboard/pricing"
            onClick={onClose}
            className="flex-1 text-center bg-[#0d2137] text-white py-2.5 text-xs font-serif font-bold uppercase tracking-wider rounded border-2 border-[#0d2137] shadow-[3px_3px_0px_0px_#8e6e53] hover:shadow-[1px_1px_0px_0px_#8e6e53] hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer"
          >
            Upgrade to Pro
          </Link>
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-serif font-bold uppercase tracking-wider border-2 border-[#0d2137]/20 rounded text-[#0d2137]/60 hover:bg-[#0d2137]/5 cursor-pointer"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
}
