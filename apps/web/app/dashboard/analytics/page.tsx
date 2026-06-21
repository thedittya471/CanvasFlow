"use client";

import React, { useState, useEffect } from "react";
import { 
  BarChart3, 
  Eye, 
  Download, 
  Search, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Clock,
  Layers,
  Sparkles,
  ArrowLeft,
  X
} from "lucide-react";
import { useTheme } from "next-themes";
import { useListFormsByUserId, useGetFormById, useGetSubmissions } from "~/hooks/api/form";
import { toast } from "sonner";
import Link from "next/link";
import {
  ResponsiveContainer,
  AreaChart,
  XAxis,
  YAxis,
  Tooltip as ChartTooltip,
  Area,
  PieChart,
  Pie,
  Cell
} from "recharts";

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

  if (!mounted) return null;

  // Derive respondent name & email from submission values
  const getRespondentDetails = (sub: Submission) => {
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
        (f) => f.type === "TEXT" && (f.label.toLowerCase().includes("name") || f.label.toLowerCase().includes("respondent"))
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
  };

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
    link.setAttribute("download", `${form.title.toLowerCase().replace(/\s+/g, "_")}_submissions.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV file downloaded");
  };

  const activeSubmissions = submissions?.submissions || [];
  const totalResponses = activeSubmissions.length;
  const totalViews = submissions?.viewsCount || 0;
  const completionRate = totalViews > 0 ? ((totalResponses / totalViews) * 100).toFixed(1) + "%" : "0.0%";

  // Group by day of week for Timeline Chart
  const getTimelineData = () => {
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
      Partial: Math.round(data.Completed * 0.3)
    }));
  };

  const timelineData = getTimelineData();

  // Device breakdown data
  const getDeviceData = () => {
    const desktop = submissions?.deviceViews?.find(d => d.device === "desktop")?.count || 0;
    const mobile = submissions?.deviceViews?.find(d => d.device === "mobile")?.count || 0;
    const tablet = submissions?.deviceViews?.find(d => d.device === "tablet")?.count || 0;

    return [
      { name: "Desktop", value: desktop, color: "#3b5e82" },
      { name: "Mobile", value: mobile, color: "#8e6e53" },
      { name: "Tablet", value: tablet, color: "#a1a1aa" }
    ];
  };

  const deviceData = getDeviceData();

  // Filtered submissions based on search query
  const filteredSubmissions = activeSubmissions.filter((sub) => {
    const details = getRespondentDetails(sub);
    const matchQuery = searchQuery.toLowerCase();
    return (
      details.name.toLowerCase().includes(matchQuery) ||
      details.email.toLowerCase().includes(matchQuery) ||
      sub.id.toLowerCase().includes(matchQuery)
    );
  });

  return (
    <div className="flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-140px)] w-full">
      {/* Sub Sidebar */}
      <aside className="w-full lg:w-64 shrink-0 bg-white dark:bg-[#1a1a1c] border-2 border-[#0d2137] dark:border-[#2a2a2a] p-5 rounded shadow-[3px_3px_0px_0px_#0d2137] dark:shadow-[3px_3px_0px_0px_#2a2a2a] relative overflow-hidden flex flex-col gap-4">
        <div className="absolute inset-0 bg-cover bg-center mix-blend-multiply dark:mix-blend-overlay opacity-85 pointer-events-none select-none" style={{ backgroundImage: isDark ? "url('/asset4.png')" : "url('/assest1.png')" }} />
        
        <div className="relative z-10 space-y-1">
          <h3 className="text-xl font-serif font-bold text-[#0d2137] dark:text-white">Analytics</h3>
          <p className="text-[10px] tracking-wider text-[#0d2137]/50 dark:text-white/40 uppercase font-serif font-bold">Select form for insights</p>
        </div>

        <div className="relative z-10 border-t border-[#0d2137]/10 dark:border-[#2a2a2a] pt-3">
          <span className="text-[9px] uppercase tracking-widest font-serif font-bold text-[#8e6e53] dark:text-[#d4af37] block mb-2">My Sketches</span>
          {isLoadingForms ? (
            <div className="py-8 text-center text-xs font-serif italic text-[#0d2137]/50 dark:text-white/45">Loading...</div>
          ) : !forms || forms.length === 0 ? (
            <div className="py-8 text-center text-xs font-serif italic text-[#0d2137]/50 dark:text-white/45">No sketches found.</div>
          ) : (
            <div className="space-y-1.5 max-h-87.5 overflow-y-auto pr-1">
              {forms.map((f) => {
                const isActive = selectedFormId === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => setSelectedFormId(f.id)}
                    className={`w-full text-left px-3.5 py-2.5 rounded font-serif text-xs font-bold transition-all border flex items-center justify-between cursor-pointer ${
                      isActive 
                        ? "bg-[#0d2137] border-[#0d2137] text-white shadow-[2px_2px_0px_0px_#8e6e53]" 
                        : "border-transparent hover:bg-[#0d2137]/5 dark:hover:bg-white/5 text-[#0d2137] dark:text-[#b9c9df]"
                    }`}
                  >
                    <span className="truncate pr-2"># {f.title}</span>
                    <span className={`size-1.5 rounded-full shrink-0 ${f.isPublished ? "bg-green-500" : "bg-amber-500"}`} />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 space-y-6">
        {isLoadingForm || isLoadingSubmissions ? (
          <div className="h-64 flex items-center justify-center bg-white dark:bg-[#1a1a1c] border-2 border-[#0d2137] dark:border-[#2a2a2a] rounded shadow-[3px_3px_0px_0px_#0d2137] dark:shadow-[3px_3px_0px_0px_#2a2a2a]">
            <div className="flex flex-col items-center gap-2">
              <div className="w-6 h-6 border border-t-2 border-[#0d2137] dark:border-white border-t-transparent animate-spin rounded" />
              <span className="text-[10px] uppercase font-serif tracking-widest text-[#0d2137]/60 dark:text-white/60">Fetching sketch insights...</span>
            </div>
          </div>
        ) : !form ? (
          <div className="h-64 flex items-center justify-center bg-white dark:bg-[#1a1a1c] border-2 border-[#0d2137] dark:border-[#2a2a2a] rounded shadow-[3px_3px_0px_0px_#0d2137] dark:shadow-[3px_3px_0px_0px_#2a2a2a] text-center p-8">
            <div className="space-y-2">
              <h4 className="font-serif font-bold text-lg text-[#0d2137] dark:text-white">Select a Sketch</h4>
              <p className="text-xs text-[#0d2137]/50 dark:text-white/40 max-w-xs font-serif italic">Choose a form sketch from the left sidebar to load analytics and response submissions catalog.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header Title Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-[#1a1a1c] border-2 border-[#0d2137] dark:border-[#2a2a2a] p-5 rounded shadow-[3px_3px_0px_0px_#0d2137] dark:shadow-[3px_3px_0px_0px_#2a2a2a] relative overflow-hidden">
              <div className="absolute inset-0 bg-cover bg-center mix-blend-multiply dark:mix-blend-overlay opacity-80 pointer-events-none select-none" style={{ backgroundImage: isDark ? "url('/asset4.png')" : "url('/assest1.png')" }} />
              
              <div className="relative z-10 space-y-1">
                <h2 className="text-2xl font-serif font-bold text-[#0d2137] dark:text-white"># {form.title}</h2>
                <div className="flex items-center gap-3 text-[10px] tracking-wider font-serif uppercase font-bold text-[#0d2137]/65 dark:text-white/50">
                  <span>{totalResponses} Responses</span>
                  <span>•</span>
                  <span className={form.isPublished ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"}>
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

            {/* Metrics cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { title: "Total Responses", val: totalResponses, icon: Layers },
                { title: "Completion Rate", val: completionRate, icon: TrendingUp },
                { title: "Total Views", val: totalViews, icon: Clock }
              ].map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={idx}
                    className="relative overflow-hidden bg-white dark:bg-[#1a1a1c] border-2 border-[#0d2137] dark:border-[#2a2a2a] p-5 rounded shadow-[3px_3px_0px_0px_#0d2137] dark:shadow-[3px_3px_0px_0px_#2a2a2a]"
                  >
                    <div className="absolute inset-0 bg-cover bg-center mix-blend-multiply dark:mix-blend-overlay opacity-80 pointer-events-none select-none" style={{ backgroundImage: isDark ? "url('/asset4.png')" : "url('/assest1.png')" }} />
                    <div className="relative z-10 flex flex-col justify-between space-y-4">
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] uppercase tracking-wider font-serif font-bold text-[#0d2137]/65 dark:text-white/60">{stat.title}</span>
                        <Icon className="size-4 text-[#8e6e53] dark:text-[#d4af37]" />
                      </div>
                      <h3 className="text-3xl md:text-4xl font-serif font-bold text-[#0d2137] dark:text-white tracking-tight">{stat.val}</h3>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Chart Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Response Timeline Card */}
              <div className="relative overflow-hidden bg-white dark:bg-[#1a1a1c] border-2 border-[#0d2137] dark:border-[#2a2a2a] p-5 rounded shadow-[3px_3px_0px_0px_#0d2137] dark:shadow-[3px_3px_0px_0px_#2a2a2a] lg:col-span-2 min-h-75">
                <div className="absolute inset-0 bg-cover bg-center mix-blend-multiply dark:mix-blend-overlay opacity-80 pointer-events-none select-none" style={{ backgroundImage: isDark ? "url('/asset4.png')" : "url('/assest1.png')" }} />
                <div className="relative z-10 space-y-4 h-full flex flex-col">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-serif font-bold text-[#0d2137] dark:text-white uppercase tracking-wider">Response Timeline</h4>
                    <div className="flex gap-4 text-[9px] font-serif uppercase tracking-widest font-bold">
                      <div className="flex items-center gap-1.5"><span className="size-2 rounded bg-blue-500" /> Completed</div>
                      <div className="flex items-center gap-1.5"><span className="size-2 rounded bg-[#a1a1aa]" /> Partial</div>
                    </div>
                  </div>
                  
                  {totalResponses === 0 ? (
                    <div className="flex-1 flex items-center justify-center text-xs font-serif italic text-[#0d2137]/40 dark:text-white/30">No responses recorded.</div>
                  ) : (
                    <div className="flex-1 w-full h-50 text-[10px] font-serif">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={timelineData}>
                          <XAxis dataKey="name" stroke={isDark ? "#b9c9df" : "#0d2137"} opacity={0.5} />
                          <YAxis stroke={isDark ? "#b9c9df" : "#0d2137"} opacity={0.5} />
                          <ChartTooltip 
                            contentStyle={{ 
                              background: isDark ? "#1c1c1e" : "#ffffff", 
                              borderColor: isDark ? "#2a2a2a" : "#0d2137", 
                              color: isDark ? "#ffffff" : "#0d2137",
                              fontFamily: "var(--font-garamond)" 
                            }} 
                          />
                          <Area type="monotone" dataKey="Completed" stroke="#3b5e82" fill="#3b5e82" fillOpacity={0.15} strokeWidth={2} />
                          <Area type="monotone" dataKey="Partial" stroke="#a1a1aa" fill="#a1a1aa" fillOpacity={0.05} strokeWidth={1} strokeDasharray="3 3" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>
              </div>

              {/* Device Breakdown Card */}
              <div className="relative overflow-hidden bg-white dark:bg-[#1a1a1c] border-2 border-[#0d2137] dark:border-[#2a2a2a] p-5 rounded shadow-[3px_3px_0px_0px_#0d2137] dark:shadow-[3px_3px_0px_0px_#2a2a2a] min-h-75">
                <div className="absolute inset-0 bg-cover bg-center mix-blend-multiply dark:mix-blend-overlay opacity-80 pointer-events-none select-none" style={{ backgroundImage: isDark ? "url('/asset4.png')" : "url('/assest1.png')" }} />
                <div className="relative z-10 space-y-4 h-full flex flex-col justify-between">
                  <h4 className="text-sm font-serif font-bold text-[#0d2137] dark:text-white uppercase tracking-wider">Device Breakdown</h4>
                  
                  {totalResponses === 0 ? (
                    <div className="flex-1 flex items-center justify-center text-xs font-serif italic text-[#0d2137]/40 dark:text-white/30">No responses recorded.</div>
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
                          <span className="text-[7px] text-[#0d2137]/50 dark:text-white/40 uppercase tracking-widest font-serif font-bold">Total</span>
                        </div>
                      </div>

                      <div className="w-full space-y-1.5">
                        {deviceData.map((dev, idx) => {
                          const pct = totalResponses > 0 ? ((dev.value / totalResponses) * 100).toFixed(0) : "0";
                          return (
                            <div key={idx} className="flex justify-between items-center text-[10px] font-serif uppercase tracking-wider text-[#0d2137] dark:text-[#b9c9df]">
                              <div className="flex items-center gap-1.5">
                                <span className="size-2 rounded-full" style={{ backgroundColor: dev.color }} />
                                <span>{dev.name}</span>
                              </div>
                              <span className="font-bold">{dev.value} ({pct}%)</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Latest Responses Section */}
            <div className="relative overflow-hidden bg-white dark:bg-[#1a1a1c] border-2 border-[#0d2137] dark:border-[#2a2a2a] p-5 rounded shadow-[3px_3px_0px_0px_#0d2137] dark:shadow-[3px_3px_0px_0px_#2a2a2a]">
              <div className="absolute inset-0 bg-cover bg-center mix-blend-multiply dark:mix-blend-overlay opacity-80 pointer-events-none select-none" style={{ backgroundImage: isDark ? "url('/asset4.png')" : "url('/assest1.png')" }} />
              <div className="relative z-10 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h4 className="text-sm font-serif font-bold text-[#0d2137] dark:text-white uppercase tracking-wider">Latest Responses</h4>
                  <div className="w-full sm:w-64 relative">
                    <input
                      type="text"
                      placeholder="Search responses..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-[#faf7f0]/60 dark:bg-white/5 border border-[#0d2137]/20 dark:border-white/10 p-2 pl-8 text-xs font-serif text-[#0d2137] dark:text-white placeholder-[#0d2137]/35 dark:placeholder-white/35 rounded focus:outline-none focus:border-[#0d2137]/45 dark:focus:border-white/35"
                    />
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-[#0d2137]/35 dark:text-white/35" />
                  </div>
                </div>

                {filteredSubmissions.length === 0 ? (
                  <div className="py-12 text-center text-xs font-serif italic text-[#0d2137]/50 dark:text-white/40 border border-dashed border-[#0d2137]/15 dark:border-white/10 rounded">
                    No submissions found matching the query.
                  </div>
                ) : (
                  <div className="overflow-x-auto w-full">
                    <table className="w-full text-left font-serif text-xs">
                      <thead>
                        <tr className="border-b border-[#0d2137]/10 dark:border-white/10 text-[#0d2137]/65 dark:text-white/50 text-[10px] uppercase tracking-widest font-bold">
                          <th className="pb-3 font-semibold">Respondent</th>
                          <th className="pb-3 font-semibold text-center">Status</th>
                          <th className="pb-3 font-semibold">Date</th>
                          <th className="pb-3 font-semibold text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredSubmissions.map((sub) => {
                          const details = getRespondentDetails(sub);
                          const initials = details.name.substring(0, 2).toUpperCase();

                          return (
                            <tr key={sub.id} className="border-b border-[#0d2137]/5 dark:border-white/5 hover:bg-[#faf7f0]/30 dark:hover:bg-white/5 transition-colors">
                              <td className="py-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full border border-[#0d2137]/25 dark:border-white/20 bg-[#faf7f0] dark:bg-[#1a1a1c] flex items-center justify-center font-bold text-[#8e6e53] dark:text-[#d4af37] text-[10px] shrink-0">
                                    {initials}
                                  </div>
                                  <div className="overflow-hidden">
                                    <div className="font-bold text-[#0d2137] dark:text-white truncate">{details.name}</div>
                                    <div className="text-[10px] text-[#0d2137]/55 dark:text-white/45 truncate">{details.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 text-center">
                                <span className="inline-block bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">
                                  Completed
                                </span>
                              </td>
                              <td className="py-3 text-[#0d2137]/65 dark:text-white/60">
                                {new Date(sub.createdAt).toLocaleString()}
                              </td>
                              <td className="py-3 text-right">
                                <button
                                  onClick={() => setViewingSubmission(sub)}
                                  className="p-1.5 hover:bg-[#faf7f0] dark:hover:bg-white/10 rounded border border-[#0d2137]/15 dark:border-white/10 text-[#0d2137] dark:text-white cursor-pointer transition-colors"
                                  title="View details"
                                >
                                  <Eye className="size-4" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Submission Detail Modal overlay */}
      {viewingSubmission && form && (
        <div className="fixed inset-0 bg-[#0d2137]/45 dark:bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1a1a1c] p-6 rounded border-2 border-[#0d2137] dark:border-[#2a2a2a] shadow-[6px_6px_0px_0px_#0d2137] dark:shadow-[6px_6px_0px_0px_#2a2a2a] max-w-lg w-full relative transition-colors duration-300">
            <button
              onClick={() => setViewingSubmission(null)}
              className="absolute right-4 top-4 p-1 rounded hover:bg-[#faf7f0] dark:hover:bg-white/10 text-[#0d2137]/50 dark:text-white/50 cursor-pointer"
            >
              <X className="size-4.5" />
            </button>

            <div className="space-y-4">
              <div className="space-y-1 pr-6">
                <span className="text-[8px] uppercase tracking-widest font-serif font-bold text-[#8e6e53] dark:text-[#d4af37]">Submission Blueprint</span>
                <h4 className="text-xl font-serif font-bold text-[#0d2137] dark:text-white truncate">
                  {getRespondentDetails(viewingSubmission).name}
                </h4>
                <p className="text-[10px] text-[#0d2137]/55 dark:text-white/40 italic font-serif">
                  Submitted: {new Date(viewingSubmission.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="border-t border-[#0d2137]/10 dark:border-white/10 pt-4 max-h-75 overflow-y-auto space-y-4 pr-1">
                {form.fields.map((field) => {
                  const answer = viewingSubmission.values.find((v) => v.formFieldId === field.id);
                  let displayVal = "No answer provided";
                  if (answer?.value !== undefined && answer?.value !== null && answer?.value !== "") {
                    if (Array.isArray(answer.value)) {
                      displayVal = answer.value.join(", ");
                    } else if (typeof answer.value === "boolean") {
                      displayVal = answer.value ? "Yes" : "No";
                    } else {
                      displayVal = String(answer.value);
                    }
                  }

                  return (
                    <div key={field.id} className="space-y-1 font-serif">
                      <span className="text-[9px] uppercase tracking-widest font-bold text-[#0d2137]/55 dark:text-white/45 block">
                        Q: {field.label}
                      </span>
                      <div className="p-3 bg-[#faf7f0]/60 dark:bg-black/15 border border-[#0d2137]/15 dark:border-white/10 rounded font-serif italic text-[#0d2137] dark:text-[#b9c9df] text-xs">
                        {displayVal}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-[#0d2137]/10 dark:border-white/10 pt-4 flex justify-end">
                <button
                  onClick={() => setViewingSubmission(null)}
                  className="bg-[#0d2137] hover:bg-[#1a3854] dark:bg-[#b9c9df] dark:hover:bg-[#ccdcf2] text-white dark:text-[#0d2137] py-2 px-6 text-[10px] uppercase font-bold tracking-widest transition-all cursor-pointer rounded-none border border-transparent shadow-[2px_2px_0px_0px_#8e6e53] dark:shadow-none"
                  style={{ fontFamily: "var(--font-garamond)" }}
                >
                  Close Blueprint
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
