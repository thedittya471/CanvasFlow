"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  ChevronDown,
  Plus,
  ArrowLeft,
  ArrowRight,
  Share2,
  Pin,
  Trash2
} from "lucide-react";
import { useListFormsByUserId, useDeleteForm } from "~/hooks/api/form";
import { useDashboard } from "~/providers/dashboard-provider";
import { useTheme } from "next-themes";
import { toast } from "sonner";

const formatDate = (dateStr: string) => {
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric"
    });
  } catch { return "Jan 1, 2026"; }
};

const getRelativeTime = (dateStr: string) => {
  try {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return `${diffMins || 1} Min${diffMins === 1 ? "" : "s"} Ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} Hour${diffHours === 1 ? "" : "s"} Ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} Day${diffDays === 1 ? "" : "s"} Ago`;
  } catch { return "2 Hours Ago"; }
};

export default function SketchesPage() {
  const { forms, isLoading } = useListFormsByUserId();
  const { openCreateFormModal } = useDashboard();
  const { deleteFormAsync, isPending: isDeleting } = useDeleteForm();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("createdAt");
  const [filter, setFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  // Confirm-delete state
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && theme === "dark";

  const processedForms = useMemo(() => {
    if (!forms) return [];
    let result = [...forms];

    if (filter === "DRAFTS") {
      result = result.filter(f => !f.isPublished);
    } else if (filter === "PUBLISHED") {
      result = result.filter(f => f.isPublished);
    } else if (filter === "ARCHIVED") {
      result = result.filter(f => f.isArchived);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(f =>
        f.title.toLowerCase().includes(q) ||
        f.description?.toLowerCase().includes(q) ||
        f.slug.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      if (sort === "createdAt") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sort === "title") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

    return result;
  }, [forms, filter, search, sort]);

  const totalPages = Math.ceil(processedForms.length / itemsPerPage) || 1;
  const paginatedForms = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return processedForms.slice(start, start + itemsPerPage);
  }, [processedForms, page]);

  const handleDelete = async (formId: string) => {
    try {
      await deleteFormAsync({ id: formId });
      toast.success("Blueprint deleted from catalog");
      setConfirmDeleteId(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete form");
    }
  };

  const getRefNo = (id: string, title: string) => {
    const letters = title.split(" ").map(w => w[0]).filter(Boolean).join("").slice(0, 3).toUpperCase();
    return `REF. NO: ${id.slice(0, 4).toUpperCase()}-${letters || "SK"}`;
  };

  const getIllustration = (title: string, index: number) => {
    const t = title.toLowerCase();
    if (t.includes("bridge")) return "/card4.png";
    if (t.includes("skyline") || t.includes("city")) return "/card3.png";
    if (t.includes("art") || t.includes("annex")) return "/card2.png";
    if (t.includes("heritage") || t.includes("survey") || t.includes("site")) return "/card-1.png";
    const num = (index % 4) + 1;
    return num === 1 ? "/card-1.png" : `/card${num}.png`;
  };

  const confirmDeleteForm = forms?.find(f => f.id === confirmDeleteId);

  return (
    <div className="space-y-8">
      {/* Confirm delete dialog */}
      {confirmDeleteId && confirmDeleteForm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#0d2137]/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1c1c1e] border-2 border-[#0d2137] dark:border-[#2a2a2a] p-8 rounded shadow-[6px_6px_0px_0px_#0d2137] dark:shadow-[6px_6px_0px_0px_#2a2a2a] max-w-sm w-full mx-4 space-y-4">
            <div className="space-y-1">
              <span className="text-[9px] uppercase tracking-widest font-serif font-bold text-red-500 block">
                — Permanent Action
              </span>
              <h3 className="text-xl font-serif font-bold text-[#0d2137] dark:text-white">
                Delete Blueprint?
              </h3>
              <p className="text-sm text-[#0d2137]/70 dark:text-white/60 font-serif leading-relaxed">
                <span className="font-bold text-[#0d2137] dark:text-white">&ldquo;{confirmDeleteForm.title}&rdquo;</span> and all its fields and submissions will be permanently removed. This cannot be undone.
              </p>
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <button
                onClick={() => setConfirmDeleteId(null)}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-serif font-bold uppercase tracking-wider border-2 border-[#0d2137]/20 dark:border-white/20 rounded text-[#0d2137]/70 dark:text-white/70 hover:bg-[#0d2137]/5 cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDeleteId)}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-serif font-bold uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white rounded cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                <Trash2 className="size-3.5" />
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-serif font-bold text-[#0d2137]/60 dark:text-[#faf7f0]/60">
            <span>Studio</span>
            <span className="text-[#0d2137]/30 dark:text-[#faf7f0]/30 font-sans">›</span>
            <span className="text-[#0d2137] dark:text-[#faf7f0] border-b border-[#0d2137]/30 dark:border-[#faf7f0]/30 pb-0.5">My Sketches</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif text-[#0d2137] dark:text-white font-bold tracking-tight mt-2.5">
            Drafting Table
          </h2>
          <p className="text-lg font-caveat text-[#8e6e53] dark:text-[#d4af37] mt-1 italic">
            Reviewing {forms?.length || 0} active architectural forms...
          </p>
        </div>

        <button
          onClick={openCreateFormModal}
          className="bg-[#0d2137] dark:bg-[#b9c9df] text-[#faf7f0] dark:text-[#0d2137] py-3 px-5 rounded border-2 border-[#0d2137] dark:border-[#b9c9df] hover:bg-[#1a3854] dark:hover:bg-[#ccdcf2] active:bg-[#071321] transition-all flex items-center justify-center gap-2 font-serif text-xs font-bold uppercase tracking-wider shadow-[3px_3px_0px_0px_#8e6e53] dark:shadow-[3px_3px_0px_0px_#d4af37] hover:shadow-[1px_1px_0px_0px_#8e6e53] dark:hover:shadow-[1px_1px_0px_0px_#d4af37] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer self-start sm:self-auto"
        >
          <span className="flex items-center justify-center border border-current rounded-full p-0.5 size-4">
            <Plus className="size-2.5 stroke-[3px]" />
          </span>
          <span>New Sketch</span>
        </button>
      </div>

      <div className="bg-[#f5ebd7] dark:bg-[#1c1c1e]/60 border border-[#0d2137]/10 dark:border-white/10 p-3 rounded-lg flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm backdrop-blur-xs">
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-3.5 size-4 text-[#0d2137]/40 dark:text-[#faf7f0]/40" />
          <input
            type="text"
            placeholder="Search archives..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full bg-white/60 dark:bg-[#2c2c2e]/60 border border-[#0d2137]/10 dark:border-[#3a3a3c]/60 p-2.5 pl-10 text-sm focus:outline-none focus:ring-1 focus:ring-[#8e6e53] dark:focus:ring-[#d4af37] text-[#0d2137] dark:text-white font-serif rounded-md transition-colors"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6 w-full md:w-auto">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-[10px] font-serif font-bold uppercase tracking-wider text-[#0d2137]/50 dark:text-[#faf7f0]/50 shrink-0">Sort:</span>
            <div className="relative w-full sm:w-auto">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full sm:w-auto bg-transparent border-0 py-2.5 pl-0 pr-6 text-xs font-serif font-bold uppercase tracking-wider text-[#0d2137] dark:text-white rounded appearance-none focus:outline-none cursor-pointer"
              >
                <option value="createdAt" className="bg-[#f5ebd7] dark:bg-[#1c1c1e]">Date Created</option>
                <option value="title" className="bg-[#f5ebd7] dark:bg-[#1c1c1e]">Title</option>
              </select>
              <ChevronDown className="absolute right-0 top-3.5 size-3 text-[#0d2137]/60 dark:text-[#faf7f0]/60 pointer-events-none" />
            </div>
          </div>

          <div className="h-5 w-px bg-[#0d2137]/10 dark:bg-white/10 hidden sm:block" />

          <div className="flex bg-[#faf7f0]/60 dark:bg-[#2c2c2e]/60 p-1 border border-[#0d2137]/10 dark:border-white/10 rounded-full text-[10px] font-serif font-bold uppercase tracking-wider select-none w-full sm:w-auto justify-between sm:justify-start gap-1">
            {["ALL", "DRAFTS", "PUBLISHED", "ARCHIVED"].map((tab) => (
              <button
                key={tab}
                onClick={() => { setFilter(tab); setPage(1); }}
                className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${filter === tab ? "bg-[#d3c8b4] dark:bg-[#b9c9df]/20 text-[#0d2137] dark:text-[#b9c9df] font-bold" : "text-[#0d2137]/50 dark:text-[#faf7f0]/50 hover:text-[#0d2137] dark:hover:text-[#faf7f0]"}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <div className="w-10 h-10 border-2 border-[#0d2137] dark:border-[#b9c9df] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-serif italic text-[#8e6e53] dark:text-[#d4af37]">Reading Atelier Records...</p>
        </div>
      ) : paginatedForms.length === 0 ? (
        <div className="bg-white/40 dark:bg-[#1a1a1c]/40 border border-dashed border-[#0d2137]/20 dark:border-[#faf7f0]/20 p-12 text-center rounded-lg max-w-lg mx-auto space-y-4 backdrop-blur-xs">
          <h3 className="text-sm uppercase tracking-widest font-serif font-bold text-[#0d2137] dark:text-white">No Drawings Cataloged</h3>
          <p className="text-xs text-[#0d2137]/60 dark:text-[#faf7f0]/60 font-serif leading-relaxed max-w-sm mx-auto">
            We couldn&apos;t find any blueprint drafts matching your query. Initiate a new draft to begin.
          </p>
          <button
            onClick={openCreateFormModal}
            className="text-xs font-serif font-bold uppercase tracking-wider text-[#8e6e53] dark:text-[#d4af37] hover:underline cursor-pointer inline-flex items-center gap-1.5"
          >
            <span>Start a Blueprint</span>
            <span>→</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedForms.map((form, index) => {
            const isPublished = form.isPublished;
            const illustration = getIllustration(form.title, index);
            const responses = form.submissionsCount ?? 0;
            const isSecondCard = index % 3 === 1;
            const isThirdCard = index % 3 === 2;

            return (
              <div
                key={form.id}
                className="relative overflow-visible bg-[#faf8f5] dark:bg-[#1a1a1c] border border-[#0d2137]/10 dark:border-white/5 p-4 rounded shadow-[0_1px_2px_rgba(13,33,55,0.05)] group hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(13,33,55,0.06)] transition-all duration-250 flex flex-col justify-between min-h-90 max-w-[320px] w-full mx-auto"
              >
                <div
                  className="absolute inset-0 rounded bg-cover bg-center mix-blend-multiply dark:mix-blend-overlay opacity-80 pointer-events-none select-none"
                  style={{ backgroundImage: isDark ? "url('/dark-card-background.png')" : "url('/card-background.png')" }}
                />

                {isPublished && isThirdCard && (
                  <div className="absolute top-3 right-3 z-20 text-[#8e6e53] dark:text-[#d4af37] pointer-events-none">
                    <Pin className="size-4.5 rotate-45 fill-current" />
                  </div>
                )}

                <div className="relative z-10 space-y-4">
                  <div className="h-32 w-full border border-[#0d2137]/10 dark:border-white/10 rounded overflow-hidden relative bg-[#faf7f0] dark:bg-[#2c2c2e]">
                    <div className="absolute inset-0 bg-cover bg-center opacity-70 dark:opacity-30 mix-blend-luminosity group-hover:scale-103 transition-transform duration-500" style={{ backgroundImage: `url('${illustration}')` }} />
                    {isPublished && isSecondCard && (
                      <div className="absolute top-2 left-2 z-20 text-[#244f75] dark:text-[#b9c9df] font-caveat font-bold text-lg -rotate-12 select-none pointer-events-none tracking-wide">
                        Top Secret
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-serif font-bold text-xl text-[#0d2137] dark:text-white group-hover:text-[#8e6e53] dark:group-hover:text-[#d4af37] transition-colors line-clamp-1">
                        {form.title}
                      </h3>

                      {/* Delete button — always visible */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmDeleteId(form.id);
                        }}
                        title="Delete blueprint"
                        className="text-[#0d2137]/30 dark:text-white/30 hover:text-red-500 dark:hover:text-red-400 p-0.5 rounded cursor-pointer shrink-0 transition-colors"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                    <p className="text-[9px] text-[#0d2137]/50 dark:text-[#faf7f0]/50 tracking-wider font-serif uppercase font-bold">
                      {isPublished ? getRefNo(form.id, form.title) : "STATUS: DRAFTING"}
                    </p>
                  </div>

                  <div className="border-t border-b border-[#0d2137]/10 dark:border-white/10 py-3 space-y-2 text-xs font-serif">
                    <div className="flex justify-between text-[#0d2137]/65 dark:text-[#faf7f0]/65">
                      <span className="italic">{isPublished ? "Commissioned" : "Last Modified"}</span>
                      <span className="font-bold text-[#0d2137] dark:text-[#faf7f0]">
                        {isPublished ? formatDate(form.publishedAt || form.createdAt) : getRelativeTime(form.updatedAt)}
                      </span>
                    </div>
                    <div className="flex justify-between text-[#0d2137]/65 dark:text-[#faf7f0]/65">
                      <span className="italic">Correspondence</span>
                      <span className="font-bold text-[#0d2137] dark:text-[#faf7f0]">
                        {responses} Response{responses === 1 ? "" : "s"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 flex gap-2 mt-5">
                  {isPublished ? (
                    <>
                      <Link href={`/dashboard/sketches/${form.id}`} className="flex-1 bg-[#0d2137] dark:bg-[#b9c9df] hover:bg-[#1a3854] dark:hover:bg-[#ccdcf2] text-[#faf7f0] dark:text-[#0d2137] border border-[#0d2137] dark:border-[#b9c9df] py-2 px-3 text-[10px] uppercase font-serif font-bold tracking-widest rounded-md transition-colors cursor-pointer text-center">
                        Open Sketch
                      </Link>
                      <button className="border border-[#0d2137]/20 dark:border-white/20 hover:border-[#0d2137] dark:hover:border-white text-[#0d2137] dark:text-[#faf7f0] p-2 rounded-md transition-colors cursor-pointer">
                        <Share2 className="size-3.5" />
                      </button>
                    </>
                  ) : (
                    <Link href={`/dashboard/sketches/${form.id}`} className="w-full bg-[#3b5e82] hover:bg-[#4a729c] text-white border border-[#3b5e82] py-2 px-3 text-[10px] uppercase font-serif font-bold tracking-widest rounded-md transition-colors cursor-pointer text-center">
                      Continue Drawing
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!isLoading && processedForms.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center border-t border-[#0d2137]/10 dark:border-white/10 pt-6 gap-4">
          <div className="text-sm font-serif italic text-[#0d2137]/70 dark:text-[#faf7f0]/70 select-none">
            Page {page} of {totalPages} <span className="font-sans not-italic text-[10px] mx-1">•</span> Cataloged in Atelier Records
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="bg-[#faf7f0]/50 dark:bg-[#1a1a1c]/50 hover:bg-white dark:hover:bg-[#2c2c2e] text-[#0d2137] dark:text-[#faf7f0] border border-[#0d2137]/15 dark:border-white/15 p-2 rounded-md transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="size-4" />
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="bg-[#faf7f0]/50 dark:bg-[#1a1a1c]/50 hover:bg-white dark:hover:bg-[#2c2c2e] text-[#0d2137] dark:text-[#faf7f0] border border-[#0d2137]/15 dark:border-white/15 p-2 rounded-md transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
