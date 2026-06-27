"use client";

import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as ChartTooltip, Cell } from "recharts";

interface DowBreakdownProps {
  dowBreakdown: Array<{ day: string; count: number }>;
}

export function DowBreakdown({ dowBreakdown }: DowBreakdownProps) {
  const max = Math.max(...dowBreakdown.map(d => d.count), 1);

  return (
    <div className="relative overflow-hidden bg-white border-2 border-[#0d2137] p-5 rounded shadow-[3px_3px_0px_0px_#0d2137] min-h-60">
      <div className="absolute inset-0 bg-cover bg-center mix-blend-multiply opacity-80 pointer-events-none select-none"
        style={{ backgroundImage: "url('/assest1.png')"}} />
      <div className="relative z-10 space-y-4 flex flex-col h-full">
        <div className="space-y-0.5">
          <h4 className="text-sm font-serif font-bold text-[#0d2137] uppercase tracking-wider">Day of Week</h4>
          <p className="text-[9px] font-serif text-[#0d2137]/45 italic">When do people respond?</p>
        </div>
        <div className="flex-1 w-full h-40" style={{ isolation: "isolate" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dowBreakdown}>
              <XAxis dataKey="day" stroke={"#0d2137"} opacity={0.5} tick={{ fontSize: 10 }} />
              <YAxis stroke={"#0d2137"} opacity={0.5} tick={{ fontSize: 9 }} width={20} />
              <ChartTooltip
                contentStyle={{ background: "#fff", borderColor: "#0d2137", color: "#0d2137", fontFamily: "var(--font-garamond)", fontSize: 11 }}
              />
              <Bar dataKey="count" radius={[3, 3, 0, 0]}>
                {dowBreakdown.map((entry, i) => (
                  <Cell key={i}
                    fill={entry.count === max && max > 0 ? ("#8e6e53") : ("#3b5e82")}
                    fillOpacity={entry.count === max && max > 0 ? 1 : 0.65}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
