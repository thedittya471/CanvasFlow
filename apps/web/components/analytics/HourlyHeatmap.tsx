"use client";

import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as ChartTooltip,
  Cell,
} from "recharts";

interface HourlyDistributionPoint {
  hour: number;
  count: number;
}

interface HourlyHeatmapProps {
  hourlyDistribution: HourlyDistributionPoint[];
  peakHour: number | null;
}

function formatHourLabel(hour: number): string {
  if (hour === 0) return "12a";
  if (hour === 6) return "6a";
  if (hour === 12) return "12p";
  if (hour === 18) return "6p";
  return "";
}

export function HourlyHeatmap({ hourlyDistribution, peakHour }: HourlyHeatmapProps) {
  // Build full 24-hour array, filling missing hours with 0
  const distributionMap = new Map(hourlyDistribution.map((d) => [d.hour, d.count]));
  const chartData = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    count: distributionMap.get(i) ?? 0,
  }));

  const totalCount = chartData.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="relative overflow-hidden bg-white border-2 border-[#0d2137] p-5 rounded shadow-[3px_3px_0px_0px_#0d2137] min-h-72">
      <div
        className="absolute inset-0 bg-cover bg-center mix-blend-multiply opacity-80 pointer-events-none select-none"
        style={{ backgroundImage: "url('/assest1.png')"}}
      />
      <div className="relative z-10 space-y-4 h-full flex flex-col">
        <div className="space-y-0.5">
          <h4 className="text-sm font-serif font-bold text-[#0d2137] uppercase tracking-wider">
            Submission Hours
          </h4>
          <p className="text-[9px] font-serif text-[#0d2137]/45 italic">
            When your audience responds
          </p>
        </div>

        {totalCount === 0 ? (
          <div className="flex-1 flex items-center justify-center text-xs font-serif italic text-[#0d2137]/40">
            No submissions recorded.
          </div>
        ) : (
          <div className="flex-1 w-full h-52 text-[9px] font-serif" style={{ isolation: "isolate" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barCategoryGap="10%">
                <XAxis
                  dataKey="hour"
                  stroke={"#0d2137"}
                  opacity={0.5}
                  tick={{ fontSize: 9 }}
                  tickFormatter={formatHourLabel}
                />
                <YAxis
                  stroke={"#0d2137"}
                  opacity={0.5}
                  tick={{ fontSize: 9 }}
                  width={24}
                />
                <ChartTooltip
                  formatter={(value: number, _name: string, props: any) => {
                    const hour = props.payload?.hour as number;
                    const label =
                      hour === 0
                        ? "12am"
                        : hour < 12
                        ? `${hour}am`
                        : hour === 12
                        ? "12pm"
                        : `${hour - 12}pm`;
                    return [value, label];
                  }}
                  contentStyle={{
                    background: "#ffffff",
                    borderColor: "#0d2137",
                    color: "#0d2137",
                    fontFamily: "var(--font-garamond)",
                    fontSize: 11,
                  }}
                />
                <Bar dataKey="count" radius={[2, 2, 0, 0]}>
                  {chartData.map((entry) => {
                    const isPeak = peakHour !== null && entry.hour === peakHour;
                    return (
                      <Cell
                        key={`cell-${entry.hour}`}
                        fill={
                          isPeak
                            ? "#8e6e53"
                            : "#3b5e82"}
                        fillOpacity={isPeak ? 1 : 0.75}
                      />
                    );
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
