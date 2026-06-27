"use client";

import React from "react";
import { TrendingUp, Clock, Layers } from "lucide-react";

interface MetricsGridProps {
  isDark: boolean;
  totalResponses: number;
  completionRate: string;
  totalViews: number;
}

export function MetricsGrid({ isDark, totalResponses, completionRate, totalViews }: MetricsGridProps) {
  const stats = [
    { title: "Total Responses", val: totalResponses, icon: Layers },
    { title: "Completion Rate", val: completionRate, icon: TrendingUp },
    { title: "Total Views", val: totalViews, icon: Clock },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className="relative overflow-hidden bg-white dark:bg-[#1a1a1c] border-2 border-[#0d2137] dark:border-[#2a2a2a] p-5 rounded shadow-[3px_3px_0px_0px_#0d2137] dark:shadow-[3px_3px_0px_0px_#2a2a2a]"
          >
            <div
              className="absolute inset-0 bg-cover bg-center mix-blend-multiply dark:mix-blend-overlay opacity-80 pointer-events-none select-none"
              style={{ backgroundImage: isDark ? "url('/asset4.png')" : "url('/assest1.png')" }}
            />
            <div className="relative z-10 flex flex-col justify-between space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-[9px] uppercase tracking-wider font-serif font-bold text-[#0d2137]/65 dark:text-white/60">
                  {stat.title}
                </span>
                <Icon className="size-4 text-[#8e6e53] dark:text-[#d4af37]" />
              </div>
              <h3 className="text-3xl md:text-4xl font-serif font-bold text-[#0d2137] dark:text-white tracking-tight">
                {stat.val}
              </h3>
            </div>
          </div>
        );
      })}
    </div>
  );
}
