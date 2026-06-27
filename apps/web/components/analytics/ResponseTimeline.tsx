"use client";

import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  XAxis,
  YAxis,
  Tooltip as ChartTooltip,
  Area,
} from "recharts";

interface TrendPoint {
  date: string;
  count: number;
}

interface ResponseTimelineProps {
  totalResponses: number;
  trends: TrendPoint[];
}

export function ResponseTimeline({ totalResponses, trends }: ResponseTimelineProps) {
  const chartData = trends.map((t) => ({ name: t.date, Responses: t.count }));

  return (
    <div className="relative overflow-hidden bg-white border-2 border-[#0d2137] p-5 rounded shadow-[3px_3px_0px_0px_#0d2137] lg:col-span-2 min-h-75">
      <div
        className="absolute inset-0 bg-cover bg-center mix-blend-multiply opacity-80 pointer-events-none select-none"
        style={{ backgroundImage: "url('/assest1.png')"}}
      />
      <div className="relative z-10 space-y-4 h-full flex flex-col">
        <div className="flex justify-between items-center">
          <div className="space-y-0.5">
            <h4 className="text-sm font-serif font-bold text-[#0d2137] uppercase tracking-wider">
              Response Timeline
            </h4>
            <p className="text-[9px] font-serif text-[#0d2137]/45 italic">
              Last 30 days
            </p>
          </div>
          <div className="flex gap-4 text-[9px] font-serif uppercase tracking-widest font-bold">
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded bg-blue-500" /> Responses
            </div>
          </div>
        </div>

        {totalResponses === 0 ? (
          <div className="flex-1 flex items-center justify-center text-xs font-serif italic text-[#0d2137]/40">
            No responses recorded.
          </div>
        ) : (
          <div className="flex-1 w-full h-50 text-[10px] font-serif" style={{ isolation: "isolate" }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <XAxis
                  dataKey="name"
                  stroke={"#0d2137"}
                  opacity={0.5}
                  tick={{ fontSize: 9 }}
                />
                <YAxis stroke={"#0d2137"} opacity={0.5} tick={{ fontSize: 9 }} />
                <ChartTooltip
                  contentStyle={{
                    background: "#ffffff",
                    borderColor: "#0d2137",
                    color: "#0d2137",
                    fontFamily: "var(--font-garamond)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="Responses"
                  stroke="#3b5e82"
                  fill="#3b5e82"
                  fillOpacity={0.15}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
