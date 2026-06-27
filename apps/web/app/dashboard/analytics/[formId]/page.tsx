"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useTheme } from "next-themes";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft, Sparkles, TrendingUp, TrendingDown, Minus,
  Layers, Activity, Clock, Timer, Users, Zap
} from "lucide-react";
import { useGetFormById } from "~/hooks/api/form";
import { useGetProAnalytics, useGetFormAnalytics } from "~/hooks/api/analytics";
import { useGetMe } from "~/hooks/api/user";
import { UpgradeModal } from "~/components/analytics/UpgradeModal";
import { DowBreakdown } from "~/components/analytics/DowBreakdown";
import { QuestionDistribution } from "~/components/analytics/QuestionDistribution";
import { ResponseTimeline } from "~/components/analytics/ResponseTimeline";
import { DeviceBreakdown } from "~/components/analytics/DeviceBreakdown";
import { FieldCompletionRates } from "~/components/analytics/FieldCompletionRates";
import { TrafficSources } from "~/components/analytics/TrafficSources";

// ─── Shared helpers ────────────────────────────────────────────────────────────

function TextureOverlay({ isDark }: { isDark: boolean }) {
  return (
    <div
      className="absolute inset-0 bg-cover bg-center mix-blend-multiply dark:mix-blend-overlay opacity-80 pointer-events-none select-none"
      style={{ backgroundImage: isDark ? "url('/asset4.png')" : "url('/assest1.png')" }}
    />
  );
}

function StatCard({ label, value, sub, icon: Icon, isDark, accent }: {
  label: string; value: string | number; sub?: string;
  icon?: React.ElementType; isDark: boolean; accent?: boolean;
}) {
  return (
    <div className={`relative overflow-hidden bg-white dark:bg-[#1a1a1c] border-2 ${accent ? "border-[#8e6e53] dark:border-[#d4af37]" : "border-[#0d2137] dark:border-[#2a2a2a]"} p-5 rounded shadow-[3px_3px_0px_0px_#0d2137] dark:shadow-[3px_3px_0px_0px_#2a2a2a]`}>
      <TextureOverlay isDark={isDark} />
      <div className="relative z-10 flex flex-col justify-between space-y-4">
        <div className="flex justify-between items-start">
          <span className="text-[9px] uppercase tracking-wider font-serif font-bold text-[#0d2137]/65 dark:text-white/60">{label}</span>
          {Icon && <Icon className={`size-4 ${accent ? "text-[#d4af37]" : "text-[#8e6e53] dark:text-[#d4af37]"}`} />}
        </div>
        <div>
          <p className="text-3xl md:text-4xl font-serif font-bold text-[#0d2137] dark:text-white tracking-tight">{value}</p>
          {sub && <p className="text-[9px] font-serif text-[#0d2137]/45 dark:text-white/35 mt-1">{sub}</p>}
        </div>
      </div>
    </div>
  );
}

function PeriodCard({ label, newCount, total, isDark, isFirst }: {
  label: string; newCount: number; total: number; isDark: boolean; isFirst?: boolean;
}) {
  const TrendIcon = newCount > 0 ? TrendingUp : newCount < 0 ? TrendingDown : Minus;
  const trendColor = newCount > 0 ? "text-green-600 dark:text-green-400"
    : newCount < 0 ? "text-red-500 dark:text-red-400"
    : "text-[#0d2137]/40 dark:text-white/30";
  return (
    <div className="relative overflow-hidden bg-white dark:bg-[#1a1a1c] border-2 border-[#0d2137] dark:border-[#2a2a2a] p-5 rounded shadow-[3px_3px_0px_0px_#0d2137] dark:shadow-[3px_3px_0px_0px_#2a2a2a]">
      <TextureOverlay isDark={isDark} />
      <div className="relative z-10 space-y-2">
        <p className="text-[9px] uppercase tracking-wider font-serif font-bold text-[#0d2137]/55 dark:text-white/50">{label}</p>
        <p className="text-3xl font-serif font-bold text-[#0d2137] dark:text-white tabular-nums">{total}</p>
        <p className="text-[9px] font-serif text-[#0d2137]/45 dark:text-white/35">total responses</p>
        {isFirst ? (
          <div className="flex items-center gap-1 text-[10px] font-serif font-bold text-[#8e6e53] dark:text-[#d4af37]">
            <TrendingUp className="size-3" /><span>most recent window</span>
          </div>
        ) : (
          <div className={`flex items-center gap-1 text-[10px] font-serif font-bold ${trendColor}`}>
            <TrendIcon className="size-3" />
            <span>{newCount > 0 ? "+" : ""}{newCount} new vs prior period</span>
          </div>
        )}
      </div>
    </div>
  );
}

function formatDuration(ms: number | null): string {
  if (ms === null || ms === 0) return "—";
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return rem > 0 ? `${m}m ${rem}s` : `${m}m`;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function ProAnalyticsPage() {
  const params = useParams();
  const router = useRouter();
  const formId = params.formId as string;
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const { hasDetailedAnalytics, isLoading: meLoading } = useGetMe();
  const { form, isLoading: formLoading } = useGetFormById(formId);

  // Only fetch pro analytics if user actually has access — avoids unnecessary
  // FORBIDDEN errors and lets us show the upgrade modal before any API call.
  const { proAnalytics, isLoading: proLoading } = useGetProAnalytics(formId);
  const { analytics, isLoading: analyticsLoading } = useGetFormAnalytics(formId);

  useEffect(() => { setMounted(true); }, []);
  const isDark = mounted && theme === "dark";

  // useMemo must be before any early returns (Rules of Hooks)
  const deviceData = useMemo(() => {
    const dv = analytics?.deviceViews ?? [];
    return [
      { name: "Desktop", value: dv.find(d => d.device === "desktop")?.count ?? 0, color: "#3b5e82" },
      { name: "Mobile",  value: dv.find(d => d.device === "mobile")?.count ?? 0,  color: "#8e6e53" },
      { name: "Tablet",  value: dv.find(d => d.device === "tablet")?.count ?? 0,  color: "#a1a1aa" },
    ];
  }, [analytics]);

  // Wait for plan check to resolve
  if (meLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf7f0] dark:bg-[#121212]">
        <div className="w-8 h-8 border-2 border-[#0d2137] dark:border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Plan check done — user is not eligible, show upgrade modal immediately
  // (no analytics API call was made for ineligible users)
  if (!hasDetailedAnalytics) {
    return (
      <div className="min-h-screen bg-[#faf7f0] dark:bg-[#121212]">
        <UpgradeModal onClose={() => router.push(`/dashboard/analytics?form=${formId}`)} />
      </div>
    );
  }

  if (proLoading || formLoading || analyticsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf7f0] dark:bg-[#121212]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#0d2137] dark:border-white border-t-transparent rounded-full animate-spin" />
          <span className="text-xs uppercase tracking-widest font-serif font-bold text-[#0d2137]/60 dark:text-white/60">
            Loading detailed analytics...
          </span>
        </div>
      </div>
    );
  }

  if (!proAnalytics || !form) return null;

  const {
    dowBreakdown, trend30d, trend60d, trend90d, velocityFirst24h,
    questionDistribution, medianResponseTime, returningRate, peakDay,
    fieldCompletionRates, avgTimeSpentMs, topReferrers, utmSources,
  } = proAnalytics;

  const new31_60 = trend60d - trend30d;
  const new61_90 = trend90d - trend60d;

  const totalResponses = analytics?.totalResponses ?? trend30d;
  const totalViews = analytics?.totalViews ?? 0;
  const completionRate = analytics?.completionRate != null ? analytics.completionRate.toFixed(1) + "%" : "—";
  const avgPerDay = analytics?.avgSubmissionsPerDay ?? 0;
  const dailyTrends = analytics?.dailyTrends ?? [];

  return (
    <div className="space-y-8">
      {/* Back nav */}
      <Link href={`/dashboard/analytics?form=${formId}`}
        className="inline-flex items-center gap-1.5 text-xs font-serif font-bold uppercase tracking-wider text-[#0d2137]/60 dark:text-white/60 hover:text-[#0d2137] dark:hover:text-white transition-colors">
        <ChevronLeft className="size-3.5" />Back to Overview
      </Link>

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="size-4 text-[#8e6e53] dark:text-[#d4af37] fill-current" />
          <span className="text-[9px] uppercase tracking-widest font-serif font-bold text-[#8e6e53] dark:text-[#d4af37]">Pro+ Analytics</span>
        </div>
        <h2 className="text-3xl font-serif font-bold text-[#0d2137] dark:text-white"># {form.title}</h2>
        <p className="text-sm font-serif text-[#0d2137]/55 dark:text-white/45 mt-1 italic">
          {form.isPublished ? "Published" : "Draft"} · {totalResponses} total response{totalResponses !== 1 ? "s" : ""}
        </p>
      </div>

      {/* ─── Row 1: Core metrics ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard label="Total Responses" value={totalResponses} icon={Layers} isDark={isDark} />
        <StatCard label="Completion Rate" value={completionRate} icon={TrendingUp} isDark={isDark} />
        <StatCard label="Total Views" value={totalViews} icon={Clock} isDark={isDark} />
        <StatCard label="Avg / Day" value={avgPerDay.toFixed(1)} icon={Activity} isDark={isDark} />
        <StatCard label="Avg Time Spent" value={formatDuration(avgTimeSpentMs)} sub="from open to submit" icon={Timer} isDark={isDark} accent />
        <StatCard label="Returning Rate" value={`${returningRate}%`} sub="repeat respondents (est.)" icon={Users} isDark={isDark} accent />
      </div>

      {/* ─── Row 2: Period comparison + Velocity + Peak Day ─────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <PeriodCard label="Last 30 days" newCount={trend30d} total={trend30d} isDark={isDark} isFirst />
        <PeriodCard label="Days 31–60" newCount={new31_60} total={trend60d} isDark={isDark} />
        <PeriodCard label="Days 61–90" newCount={new61_90} total={trend90d} isDark={isDark} />

        {/* Velocity */}
        <div className="relative overflow-hidden bg-white dark:bg-[#1a1a1c] border-2 border-[#0d2137] dark:border-[#2a2a2a] p-5 rounded shadow-[3px_3px_0px_0px_#0d2137] dark:shadow-[3px_3px_0px_0px_#2a2a2a]">
          <TextureOverlay isDark={isDark} />
          <div className="relative z-10 space-y-2">
            <div className="flex justify-between items-start">
              <p className="text-[9px] uppercase tracking-wider font-serif font-bold text-[#0d2137]/55 dark:text-white/50">Launch Velocity</p>
              <Zap className="size-4 text-[#8e6e53] dark:text-[#d4af37]" />
            </div>
            <p className="text-3xl font-serif font-bold text-[#0d2137] dark:text-white tabular-nums">{velocityFirst24h}</p>
            <p className="text-[9px] font-serif text-[#0d2137]/45 dark:text-white/35">responses in first 24h</p>
          </div>
        </div>

        {/* Peak Day */}
        <div className="relative overflow-hidden bg-white dark:bg-[#1a1a1c] border-2 border-[#0d2137] dark:border-[#2a2a2a] p-5 rounded shadow-[3px_3px_0px_0px_#0d2137] dark:shadow-[3px_3px_0px_0px_#2a2a2a]">
          <TextureOverlay isDark={isDark} />
          <div className="relative z-10 space-y-2">
            <p className="text-[9px] uppercase tracking-wider font-serif font-bold text-[#0d2137]/55 dark:text-white/50">Peak Day</p>
            <p className="text-2xl font-serif font-bold text-[#0d2137] dark:text-white">{peakDay ?? "—"}</p>
            <p className="text-[9px] font-serif text-[#0d2137]/45 dark:text-white/35">
              {medianResponseTime != null ? `Median response: ${medianResponseTime < 60 ? `${medianResponseTime}min` : `${(medianResponseTime / 60).toFixed(1)}hr`} after publish` : "No publish date"}
            </p>
          </div>
        </div>
      </div>

      {/* ─── Row 3: Timeline + Device ────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ResponseTimeline isDark={isDark} totalResponses={totalResponses} trends={dailyTrends} />
        <DeviceBreakdown isDark={isDark} totalViews={totalViews} deviceData={deviceData} />
      </div>

      {/* ─── Row 4: Day of week + Field completion ───────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DowBreakdown isDark={isDark} dowBreakdown={dowBreakdown} />
        <FieldCompletionRates isDark={isDark} fieldCompletionRates={fieldCompletionRates} />
      </div>

      {/* ─── Row 5: Traffic sources ──────────────────────────────────────── */}
      <TrafficSources isDark={isDark} topReferrers={topReferrers} utmSources={utmSources} />

      {/* ─── Row 6: Question distribution ───────────────────────────────── */}
      <QuestionDistribution isDark={isDark} questionDistribution={questionDistribution} />
    </div>
  );
}

export default function ProAnalyticsPageWrapper() {
  return <Suspense><ProAnalyticsPage /></Suspense>;
}
