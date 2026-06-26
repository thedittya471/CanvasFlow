"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useTheme } from "next-themes";
import { useListFormsByUserId, useGetFormById, useGetSubmissions } from "~/hooks/api/form";
import { toast } from "sonner";
import Link from "next/link";
import { ExternalLink, Download } from "lucide-react";
import { AnalyticsSidebar } from "~/components/analytics/AnalyticsSidebar";
import { MetricsGrid } from "~/components/analytics/MetricsGrid";
import { ResponseTimeline } from "~/components/analytics/ResponseTimeline";
import { DeviceBreakdown } from "~/components/analytics/DeviceBreakdown";
import { SubmissionsTable } from "~/components/analytics/SubmissionsTable";

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

export default function AnalyticsPage() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewingSubmission, setViewingSubmission] = useState<Submission | null>(null);

  const { forms, isLoading: isLoadingForms } = useListFormsByUserId();
  const { form, isLoading: isLoadingForm } = useGetFormById(selectedFormId || "");
  const { submissions, isLoading: isLoadingSubmissions } = useGetSubmissions(selectedFormId || "");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (forms && forms.length > 0 && !selectedFormId) {
      const firstForm = forms[0];
      if (firstForm) {
        setSelectedFormId(firstForm.id);
      }
    }
  }, [forms, selectedFormId]);

  const isDark = mounted && theme === "dark";

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
    if (!form || !submissions || !submissions.submissions || submissions.submissions.length === 0) {
      toast.error("No submissions available to export");
      return;
    }

    const headers = ["Submission ID", "Submitted At"];
    form.fields.forEach((f) => headers.push(f.label));
    const csvRows = [headers.join(",")];

    submissions.submissions.forEach((sub) => {
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

  const activeSubmissions = useMemo(() => submissions?.submissions || [], [submissions]);
  const totalResponses = activeSubmissions.length;
  const totalViews = submissions?.viewsCount || 0;
  const completionRate =
    totalViews > 0 ? ((totalResponses / totalViews) * 100).toFixed(1) + "%" : "0.0%";

  // Group by day of week for Timeline Chart
  const timelineData = useMemo(() => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const timelineMap: Record<string, { Completed: number; Partial: number }> = {};
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dayName = days[d.getDay()] || "Mon";
      timelineMap[dayName] = { Completed: 0, Partial: 0 };
    }

    activeSubmissions.forEach((sub) => {
      const date = new Date(sub.createdAt);
      const dayName = days[date.getDay()] || "Mon";
      if (timelineMap[dayName]) {
        timelineMap[dayName].Completed += 1;
      }
    });

    return Object.entries(timelineMap).map(([name, data]) => ({
      name,
      Completed: data.Completed,
      Partial: Math.round(data.Completed * 0.3),
    }));
  }, [activeSubmissions]);

  // Device breakdown data
  const deviceData = useMemo(() => {
    const desktop = submissions?.deviceViews?.find((d) => d.device === "desktop")?.count || 0;
    const mobile = submissions?.deviceViews?.find((d) => d.device === "mobile")?.count || 0;
    const tablet = submissions?.deviceViews?.find((d) => d.device === "tablet")?.count || 0;

    return [
      { name: "Desktop", value: desktop, color: "#3b5e82" },
      { name: "Mobile", value: mobile, color: "#8e6e53" },
      { name: "Tablet", value: tablet, color: "#a1a1aa" },
    ];
  }, [submissions]);

  // Filtered submissions based on search query
  const filteredSubmissions = useMemo(() => {
    const matchQuery = searchQuery.toLowerCase();
    return activeSubmissions.filter((sub) => {
      const details = getRespondentDetails(sub);
      return (
        details.name.toLowerCase().includes(matchQuery) ||
        details.email.toLowerCase().includes(matchQuery) ||
        sub.id.toLowerCase().includes(matchQuery)
      );
    });
  }, [activeSubmissions, searchQuery, getRespondentDetails]);

  if (!mounted) return null;

  return (
    <div className="flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-140px)] w-full">
      <AnalyticsSidebar
        isDark={isDark}
        isLoadingForms={isLoadingForms}
        forms={forms}
        selectedFormId={selectedFormId}
        setSelectedFormId={setSelectedFormId}
      />

      {/* Main Content Area */}
      <div className="flex-1 space-y-6">
        {isLoadingForm || isLoadingSubmissions ? (
          <div className="h-64 flex items-center justify-center bg-white dark:bg-[#1a1a1c] border-2 border-[#0d2137] dark:border-[#2a2a2a] rounded shadow-[3px_3px_0px_0px_#0d2137] dark:shadow-[3px_3px_0px_0px_#2a2a2a]">
            <div className="flex flex-col items-center gap-2">
              <div className="w-6 h-6 border border-t-2 border-[#0d2137] dark:border-white border-t-transparent animate-spin rounded" />
              <span className="text-[10px] uppercase font-serif tracking-widest text-[#0d2137]/60 dark:text-white/60">
                Fetching sketch insights...
              </span>
            </div>
          </div>
        ) : !form ? (
          <div className="h-64 flex items-center justify-center bg-white dark:bg-[#1a1a1c] border-2 border-[#0d2137] dark:border-[#2a2a2a] rounded shadow-[3px_3px_0px_0px_#0d2137] dark:shadow-[3px_3px_0px_0px_#2a2a2a] text-center p-8">
            <div className="space-y-2">
              <h4 className="font-serif font-bold text-lg text-[#0d2137] dark:text-white">
                Select a Sketch
              </h4>
              <p className="text-xs text-[#0d2137]/50 dark:text-white/40 max-w-xs font-serif italic">
                Choose a form sketch from the left sidebar to load analytics and response
                submissions catalog.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header Title Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-[#1a1a1c] border-2 border-[#0d2137] dark:border-[#2a2a2a] p-5 rounded shadow-[3px_3px_0px_0px_#0d2137] dark:shadow-[3px_3px_0px_0px_#2a2a2a] relative overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center mix-blend-multiply dark:mix-blend-overlay opacity-80 pointer-events-none select-none"
                style={{
                  backgroundImage: isDark ? "url('/asset4.png')" : "url('/assest1.png')",
                }}
              />
              <div className="relative z-10 space-y-1">
                <h2 className="text-2xl font-serif font-bold text-[#0d2137] dark:text-white">
                  # {form.title}
                </h2>
                <div className="flex items-center gap-3 text-[10px] tracking-wider font-serif uppercase font-bold text-[#0d2137]/65 dark:text-white/50">
                  <span>{totalResponses} Responses</span>
                  <span>•</span>
                  <span
                    className={
                      form.isPublished
                        ? "text-green-600 dark:text-green-400"
                        : "text-amber-600 dark:text-amber-400"
                    }
                  >
                    {form.isPublished ? "Published" : "Draft"}
                  </span>
                </div>
              </div>

              <div className="relative z-10 flex gap-2">
                <Link
                  href={`/dashboard/sketches/${form.id}`}
                  className="flex items-center gap-1.5 bg-[#faf7f0]/60 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 text-[#0d2137] dark:text-white border border-[#0d2137]/20 dark:border-white/15 py-1.5 px-3 text-[10px] uppercase font-serif font-bold tracking-wider rounded transition-all cursor-pointer shadow-[1px_1px_0px_0px_#0d2137] dark:shadow-none"
                >
                  <ExternalLink className="size-3.5" />
                  <span>Open Builder</span>
                </Link>
                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-1.5 bg-[#0d2137] hover:bg-[#1a3854] dark:bg-[#b9c9df] dark:hover:bg-[#ccdcf2] text-white dark:text-[#0d2137] py-1.5 px-3.5 text-[10px] uppercase font-serif font-bold tracking-wider rounded border border-transparent transition-all cursor-pointer shadow-[2px_2px_0px_0px_#8e6e53] dark:shadow-none"
                >
                  <Download className="size-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            <MetricsGrid
              isDark={isDark}
              totalResponses={totalResponses}
              completionRate={completionRate}
              totalViews={totalViews}
            />

            {/* Chart Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <ResponseTimeline
                isDark={isDark}
                totalResponses={totalResponses}
                timelineData={timelineData}
              />
              <DeviceBreakdown
                isDark={isDark}
                totalResponses={totalResponses}
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
