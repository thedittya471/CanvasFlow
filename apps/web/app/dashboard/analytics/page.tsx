"use client";

import React, { useState, useEffect, useMemo, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useListFormsByUserId, useGetFormById } from "~/hooks/api/form";
import { useGetFormAnalytics, useGetSubmissions } from "~/hooks/api/analytics";
import { useGetMe } from "~/hooks/api/user";
import { toast } from "sonner";
import Link from "next/link";
import { ExternalLink, Download, BarChart3 } from "lucide-react";
import { UpgradeModal } from "~/components/analytics/UpgradeModal";
import { AnalyticsSidebar } from "~/components/analytics/AnalyticsSidebar";
import { MetricsGrid } from "~/components/analytics/MetricsGrid";
import { ResponseTimeline } from "~/components/analytics/ResponseTimeline";
import { DeviceBreakdown } from "~/components/analytics/DeviceBreakdown";
import { SubmissionsTable } from "~/components/analytics/SubmissionsTable";
import { StatsRow } from "~/components/analytics/StatsRow";
interface SubmissionValue {
  formFieldId: string;
  value: any;
}

interface Submission {
  id: string;
  formId: string;
  values: SubmissionValue[];
  createdAt: string;
}

export function AnalyticsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewingSubmission, setViewingSubmission] = useState<Submission | null>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);

  // Persist selected form in the URL so reloads restore the same view
  const selectedFormId = searchParams.get("form");

  const setSelectedFormId = (id: string) => {
    router.replace(`/dashboard/analytics?form=${id}`, { scroll: false });
  };

  const { forms, isLoading: isLoadingForms } = useListFormsByUserId();
  const { form, isLoading: isLoadingForm } = useGetFormById(selectedFormId || "");
  const { analytics, isLoading: isLoadingAnalytics } = useGetFormAnalytics(selectedFormId || "");
  const { submissions, isLoading: isLoadingSubmissions } = useGetSubmissions(selectedFormId || "");
  // Check plan — used to gate the "View Detailed Analytics" button
  const { hasDetailedAnalytics: isFreeTier } = useGetMe();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-select the first form only if none is in the URL
  useEffect(() => {
    if (forms && forms.length > 0 && !selectedFormId) {
      const firstForm = forms[0];
      if (firstForm) setSelectedFormId(firstForm.id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forms, selectedFormId]);

  // Derive respondent name & email from submission values
  const getRespondentDetails = useCallback(
    (sub: Submission) => {
      let name = "Anonymous Guest";
      let email = "no-email@anonymous.com";

      if (form?.fields) {
        const emailField = form.fields.find(
          (f) => f.type === "EMAIL" || f.label.toLowerCase().includes("email")
        );
        if (emailField) {
          const val = sub.values.find((v) => v.formFieldId === emailField.id);
          if (val?.value) {
            email = String(val.value);
          }
        }

        const nameField = form.fields.find(
          (f) =>
            f.type === "TEXT" &&
            (f.label.toLowerCase().includes("name") ||
              f.label.toLowerCase().includes("respondent"))
        );
        if (nameField) {
          const val = sub.values.find((v) => v.formFieldId === nameField.id);
          if (val?.value) {
            name = String(val.value);
          }
        } else if (email && email !== "no-email@anonymous.com") {
          name = email.split("@")[0] || "Anonymous Guest";
        }
      }
      return { name, email };
    },
    [form]
  );

  // CSV Export
  const handleExportCSV = () => {
    if (!form || !submissions || submissions.length === 0) {
      toast.error("No submissions available to export");
      return;
    }

    const headers = ["Submission ID", "Submitted At"];
    form.fields.forEach((f) => headers.push(f.label));
    const csvRows = [headers.join(",")];

    submissions.forEach((sub) => {
      const row = [sub.id, new Date(sub.createdAt).toLocaleString()];
      form.fields.forEach((f) => {
        const answer = sub.values.find((v) => v.formFieldId === f.id);
        let valStr = "";
        if (answer?.value !== undefined && answer?.value !== null) {
          if (Array.isArray(answer.value)) {
            valStr = `"${answer.value.join("; ")}"`;
          } else {
            valStr = `"${String(answer.value).replace(/"/g, '""')}"`;
          }
        }
        row.push(valStr);
      });
      csvRows.push(row.join(","));
    });

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `${form.title.toLowerCase().replace(/\s+/g, "_")}_submissions.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV file downloaded");
  };

  // Metrics from analytics endpoint
  const totalResponses = analytics?.totalResponses ?? 0;
  const totalViews = analytics?.totalViews ?? 0;
  const completionRate =
    (analytics?.completionRate != null ? analytics.completionRate.toFixed(1) : "0.0") + "%";
  const avgPerDay = analytics?.avgSubmissionsPerDay ?? 0;
  const avgPerWeek = analytics?.avgSubmissionsPerWeek ?? 0;
  const peakDay = analytics?.peakDay ?? null;

  // Device breakdown from analytics
  const deviceData = useMemo(() => {
    const deviceViews = analytics?.deviceViews ?? [];
    const desktop = deviceViews.find((d) => d.device === "desktop")?.count ?? 0;
    const mobile = deviceViews.find((d) => d.device === "mobile")?.count ?? 0;
    const tablet = deviceViews.find((d) => d.device === "tablet")?.count ?? 0;

    return [
      { name: "Desktop", value: desktop, color: "#3b5e82" },
      { name: "Mobile", value: mobile, color: "#8e6e53" },
      { name: "Tablet", value: tablet, color: "#a1a1aa" },
    ];
  }, [analytics]);

  // Daily trends from analytics (server-computed 30-day data)
  const dailyTrends = analytics?.dailyTrends ?? [];


  // Filtered submissions based on search query
  const filteredSubmissions = useMemo(() => {
    const matchQuery = searchQuery.toLowerCase();
    return submissions.filter((sub) => {
      const details = getRespondentDetails(sub);
      return (
        details.name.toLowerCase().includes(matchQuery) ||
        details.email.toLowerCase().includes(matchQuery) ||
        sub.id.toLowerCase().includes(matchQuery)
      );
    });
  }, [submissions, searchQuery, getRespondentDetails]);

  if (!mounted) return null;

  const isLoading = isLoadingForm || isLoadingAnalytics || isLoadingSubmissions;

  return (
    <div className="flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-140px)] w-full">
      <AnalyticsSidebar
        isLoadingForms={isLoadingForms}
        forms={forms}
        selectedFormId={selectedFormId}
        setSelectedFormId={setSelectedFormId}
      />

      {/* Main Content Area */}
      <div className="flex-1 space-y-6">
        {isLoading ? (
          <div className="h-64 flex items-center justify-center bg-white border-2 border-[#0d2137] rounded shadow-[3px_3px_0px_0px_#0d2137]">
            <div className="flex flex-col items-center gap-2">
              <div className="w-6 h-6 border border-t-2 border-[#0d2137] border-t-transparent animate-spin rounded" />
              <span className="text-[10px] uppercase font-serif tracking-widest text-[#0d2137]/60">
                Fetching sketch insights...
              </span>
            </div>
          </div>
        ) : !form ? (
          <div className="h-64 flex items-center justify-center bg-white border-2 border-[#0d2137] rounded shadow-[3px_3px_0px_0px_#0d2137] text-center p-8">
            <div className="space-y-2">
              <h4 className="font-serif font-bold text-lg text-[#0d2137]">
                Select a Sketch
              </h4>
              <p className="text-xs text-[#0d2137]/50 max-w-xs font-serif italic">
                Choose a form sketch from the left sidebar to load analytics and response
                submissions catalog.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header Title Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border-2 border-[#0d2137] p-5 rounded shadow-[3px_3px_0px_0px_#0d2137] relative overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center mix-blend-multiply opacity-80 pointer-events-none select-none"
                style={{
                  backgroundImage: "url('/assest1.png')",
                }}
              />
              <div className="relative z-10 space-y-1">
                <h2 className="text-2xl font-serif font-bold text-[#0d2137]">
                  # {form.title}
                </h2>
                <div className="flex items-center gap-3 text-[10px] tracking-wider font-serif uppercase font-bold text-[#0d2137]/65">
                  <span>{totalResponses} Responses</span>
                  <span>•</span>
                  <span
                    className={
                      form.isPublished
                        ? "text-green-600"
                        : "text-amber-600"
                    }
                  >
                    {form.isPublished ? "Published" : "Draft"}
                  </span>
                </div>
              </div>

              <div className="relative z-10 flex flex-wrap gap-2">
                {/* View Detailed Analytics — Pro+ feature */}
                {!isFreeTier ? (
                  <button
                    onClick={() => setShowUpgrade(true)}
                    className="flex items-center gap-1.5 bg-[#d4af37]/10 hover:bg-[#d4af37]/20 text-[#8e6e53] border border-[#d4af37]/40 py-1.5 px-3 text-[10px] uppercase font-serif font-bold tracking-wider rounded transition-all cursor-pointer"
                  >
                    <BarChart3 className="size-3.5" />
                    <span>Detailed Analytics</span>
                    <span className="text-[8px] border border-[#d4af37]/50 px-1 py-0.5 rounded font-bold">PRO+</span>
                  </button>
                ) : (
                  <Link
                    href={`/dashboard/analytics/${form.id}`}
                    className="flex items-center gap-1.5 bg-[#d4af37]/10 hover:bg-[#d4af37]/20 text-[#8e6e53] border border-[#d4af37]/40 py-1.5 px-3 text-[10px] uppercase font-serif font-bold tracking-wider rounded transition-all cursor-pointer"
                  >
                    <BarChart3 className="size-3.5" />
                    <span>Detailed Analytics</span>
                  </Link>
                )}
                <Link
                  href={`/dashboard/sketches/${form.id}`}
                  className="flex items-center gap-1.5 bg-[#faf7f0]/60 hover:bg-white text-[#0d2137] border border-[#0d2137]/20 py-1.5 px-3 text-[10px] uppercase font-serif font-bold tracking-wider rounded transition-all cursor-pointer shadow-[1px_1px_0px_0px_#0d2137]"
                >
                  <ExternalLink className="size-3.5" />
                  <span>Open Builder</span>
                </Link>
                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-1.5 bg-[#0d2137] hover:bg-[#1a3854] text-white py-1.5 px-3.5 text-[10px] uppercase font-serif font-bold tracking-wider rounded border border-transparent transition-all cursor-pointer shadow-[2px_2px_0px_0px_#8e6e53]"
                >
                  <Download className="size-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Upgrade modal */}
            {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}

            <MetricsGrid
              totalResponses={totalResponses}
              completionRate={completionRate}
              totalViews={totalViews}
              avgPerDay={avgPerDay}
            />

            <StatsRow
              peakDay={peakDay}
              avgPerWeek={avgPerWeek}
              completionRate={analytics?.completionRate ?? 0}
            />

            {/* Chart Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <ResponseTimeline
                totalResponses={totalResponses}
                trends={dailyTrends}
              />
              <DeviceBreakdown
                totalViews={totalViews}
                deviceData={deviceData}
              />
            </div>

            <SubmissionsTable
              filteredSubmissions={filteredSubmissions as Submission[]}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              getRespondentDetails={getRespondentDetails}
              setViewingSubmission={setViewingSubmission}
              viewingSubmission={viewingSubmission}
              form={form}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default function AnalyticsPageWrapper() {
  return (
    <Suspense>
      <AnalyticsPage />
    </Suspense>
  );
}
