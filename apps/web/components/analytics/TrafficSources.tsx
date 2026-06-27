"use client";

import React from "react";
import { Globe, Tag } from "lucide-react";

interface TrafficSourcesProps {
  topReferrers: Array<{ referrer: string; count: number }>;
  utmSources: Array<{ source: string; count: number }>;
}

function SourceBar({ label, count, max }: { label: string; count: number; max: number }) {
  const pct = max > 0 ? Math.round((count / max) * 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center text-[10px] font-serif">
        <span className="text-[#0d2137] truncate pr-2">{label}</span>
        <span className="text-[#0d2137]/55 tabular-nums shrink-0">{count}</span>
      </div>
      <div className="h-1.5 bg-[#0d2137]/8 rounded-full overflow-hidden">
        <div className="h-full rounded-full"
          style={{ width: `${pct}%`, background: "#3b5e82"}} />
      </div>
    </div>
  );
}

export function TrafficSources({ topReferrers, utmSources }: TrafficSourcesProps) {
  const refMax = Math.max(...topReferrers.map(r => r.count), 1);
  const utmMax = Math.max(...utmSources.map(u => u.count), 1);
  const hasReferrers = topReferrers.length > 0;
  const hasUtm = utmSources.length > 0;

  if (!hasReferrers && !hasUtm) {
    return (
      <div className="relative overflow-hidden bg-white border-2 border-[#0d2137] p-5 rounded shadow-[3px_3px_0px_0px_#0d2137]">
        <div className="absolute inset-0 bg-cover bg-center mix-blend-multiply opacity-80 pointer-events-none select-none"
          style={{ backgroundImage: "url('/assest1.png')"}} />
        <div className="relative z-10 space-y-1">
          <h4 className="text-sm font-serif font-bold text-[#0d2137] uppercase tracking-wider">Traffic Sources</h4>
          <p className="text-xs font-serif italic text-[#0d2137]/45">
            No referrer data yet. Attribution is collected when visitors open the form via a link.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {hasReferrers && (
        <div className="relative overflow-hidden bg-white border-2 border-[#0d2137] p-5 rounded shadow-[3px_3px_0px_0px_#0d2137]">
          <div className="absolute inset-0 bg-cover bg-center mix-blend-multiply opacity-80 pointer-events-none select-none"
            style={{ backgroundImage: "url('/assest1.png')"}} />
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-2">
              <Globe className="size-4 text-[#8e6e53]" />
              <h4 className="text-sm font-serif font-bold text-[#0d2137] uppercase tracking-wider">Top Referrers</h4>
            </div>
            <div className="space-y-2.5">
              {topReferrers.map((r, i) => (
                <SourceBar key={i} label={r.referrer} count={r.count} max={refMax} />
              ))}
            </div>
          </div>
        </div>
      )}

      {hasUtm && (
        <div className="relative overflow-hidden bg-white border-2 border-[#0d2137] p-5 rounded shadow-[3px_3px_0px_0px_#0d2137]">
          <div className="absolute inset-0 bg-cover bg-center mix-blend-multiply opacity-80 pointer-events-none select-none"
            style={{ backgroundImage: "url('/assest1.png')"}} />
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-2">
              <Tag className="size-4 text-[#8e6e53]" />
              <h4 className="text-sm font-serif font-bold text-[#0d2137] uppercase tracking-wider">UTM Sources</h4>
            </div>
            <div className="space-y-2.5">
              {utmSources.map((u, i) => (
                <SourceBar key={i} label={u.source} count={u.count} max={utmMax} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
