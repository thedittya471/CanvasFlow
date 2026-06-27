"use client";

import React from "react";
import { Calendar, BarChart2, CheckCircle, Zap, RefreshCw } from "lucide-react";

interface StatsRowProps {
  isDark: boolean;
  peakDay: string | null;
  avgPerWeek: number;
  completionRate: number;
  velocityFirst24h?: number;
  returningRate?: number;
}

interface ChipDef {
  label: string;
  value: string;
  icon: React.ElementType;
}

export function StatsRow({
  isDark,
  peakDay,
  avgPerWeek,
  completionRate,
  velocityFirst24h,
  returningRate,
}: StatsRowProps) {
  const chips: ChipDef[] = [
    { label: "Peak Day", value: peakDay ?? "—", icon: Calendar },
    { label: "Avg / Week", value: avgPerWeek.toFixed(1), icon: BarChart2 },
    { label: "Completion", value: completionRate > 0 ? completionRate.toFixed(1) + "%" : "—", icon: CheckCircle },
    ...(velocityFirst24h !== undefined ? [{ label: "Launch Velocity", value: velocityFirst24h.toLocaleString(), icon: Zap }] : []),
    ...(returningRate !== undefined ? [{ label: "Returning", value: returningRate > 0 ? returningRate.toFixed(1) + "%" : "—", icon: RefreshCw }] : []),
  ];

  return (
    <div className="relative overflow-hidden bg-white dark:bg-[#1a1a1c] border-2 border-[#0d2137] dark:border-[#2a2a2a] px-5 py-3.5 rounded shadow-[3px_3px_0px_0px_#0d2137] dark:shadow-[3px_3px_0px_0px_#2a2a2a]">
      <div
        className="absolute inset-0 bg-cover bg-center mix-blend-multiply dark:mix-blend-overlay opacity-80 pointer-events-none select-none"
        style={{ backgroundImage: isDark ? "url('/asset4.png')" : "url('/assest1.png')" }}
      />
      <div className="relative z-10 flex flex-wrap gap-3 items-center">
        {chips.map((chip, idx) => {
          const Icon = chip.icon;
          return (
            <div
              key={idx}
              className="flex items-center gap-2.5 border border-[#0d2137]/15 dark:border-white/10 bg-[#faf7f0]/50 dark:bg-white/5 px-3.5 py-2 rounded"
            >
              <Icon className="size-3 text-[#8e6e53] dark:text-[#d4af37] shrink-0" />
              <span className="text-[9px] uppercase tracking-widest font-serif font-bold text-[#0d2137]/55 dark:text-white/45">
                {chip.label}
              </span>
              <span className="text-sm font-serif font-bold text-[#0d2137] dark:text-white">
                {chip.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
