"use client";

import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface DeviceData {
  name: string;
  value: number;
  color: string;
}

interface DeviceBreakdownProps {
  isDark: boolean;
  totalResponses: number;
  deviceData: DeviceData[];
}

export function DeviceBreakdown({ isDark, totalResponses, deviceData }: DeviceBreakdownProps) {
  return (
    <div className="relative overflow-hidden bg-white dark:bg-[#1a1a1c] border-2 border-[#0d2137] dark:border-[#2a2a2a] p-5 rounded shadow-[3px_3px_0px_0px_#0d2137] dark:shadow-[3px_3px_0px_0px_#2a2a2a] min-h-75">
      <div
        className="absolute inset-0 bg-cover bg-center mix-blend-multiply dark:mix-blend-overlay opacity-80 pointer-events-none select-none"
        style={{ backgroundImage: isDark ? "url('/asset4.png')" : "url('/assest1.png')" }}
      />
      <div className="relative z-10 space-y-4 h-full flex flex-col justify-between">
        <h4 className="text-sm font-serif font-bold text-[#0d2137] dark:text-white uppercase tracking-wider">
          Device Breakdown
        </h4>

        {totalResponses === 0 ? (
          <div className="flex-1 flex items-center justify-center text-xs font-serif italic text-[#0d2137]/40 dark:text-white/30">
            No responses recorded.
          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-center items-center gap-4">
            <div className="size-28 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={36}
                    outerRadius={48}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col justify-center items-center">
                <span className="text-lg font-serif font-bold text-[#0d2137] dark:text-white">100%</span>
                <span className="text-[7px] text-[#0d2137]/50 dark:text-white/40 uppercase tracking-widest font-serif font-bold">
                  Total
                </span>
              </div>
            </div>

            <div className="w-full space-y-1.5">
              {deviceData.map((dev, idx) => {
                const pct =
                  totalResponses > 0 ? ((dev.value / totalResponses) * 100).toFixed(0) : "0";
                return (
                  <div
                    key={idx}
                    className="flex justify-between items-center text-[10px] font-serif uppercase tracking-wider text-[#0d2137] dark:text-[#b9c9df]"
                  >
                    <div className="flex items-center gap-1.5">
                      <span
                        className="size-2 rounded-full"
                        style={{ backgroundColor: dev.color }}
                      />
                      <span>{dev.name}</span>
                    </div>
                    <span className="font-bold">
                      {dev.value} ({pct}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
