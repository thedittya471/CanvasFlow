"use client";

import React from "react";

interface FormItem {
  id: string;
  title: string;
  isPublished: boolean;
}

interface AnalyticsSidebarProps {
  isDark: boolean;
  isLoadingForms: boolean;
  forms: FormItem[] | undefined;
  selectedFormId: string | null;
  setSelectedFormId: (id: string) => void;
}

export function AnalyticsSidebar({
  isDark,
  isLoadingForms,
  forms,
  selectedFormId,
  setSelectedFormId,
}: AnalyticsSidebarProps) {
  return (
    <aside className="w-full lg:w-64 shrink-0 bg-white dark:bg-[#1a1a1c] border-2 border-[#0d2137] dark:border-[#2a2a2a] p-5 rounded shadow-[3px_3px_0px_0px_#0d2137] dark:shadow-[3px_3px_0px_0px_#2a2a2a] relative overflow-hidden flex flex-col gap-4">
      <div
        className="absolute inset-0 bg-cover bg-center mix-blend-multiply dark:mix-blend-overlay opacity-85 pointer-events-none select-none"
        style={{ backgroundImage: isDark ? "url('/asset4.png')" : "url('/assest1.png')" }}
      />

      <div className="relative z-10 space-y-1">
        <h3 className="text-xl font-serif font-bold text-[#0d2137] dark:text-white">Analytics</h3>
        <p className="text-[10px] tracking-wider text-[#0d2137]/50 dark:text-white/40 uppercase font-serif font-bold">
          Select form for insights
        </p>
      </div>

      <div className="relative z-10 border-t border-[#0d2137]/10 dark:border-[#2a2a2a] pt-3">
        <span className="text-[9px] uppercase tracking-widest font-serif font-bold text-[#8e6e53] dark:text-[#d4af37] block mb-2">
          My Sketches
        </span>
        {isLoadingForms ? (
          <div className="py-8 text-center text-xs font-serif italic text-[#0d2137]/50 dark:text-white/45">
            Loading...
          </div>
        ) : !forms || forms.length === 0 ? (
          <div className="py-8 text-center text-xs font-serif italic text-[#0d2137]/50 dark:text-white/45">
            No sketches found.
          </div>
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
                  <span
                    className={`size-1.5 rounded-full shrink-0 ${
                      f.isPublished ? "bg-green-500" : "bg-amber-500"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
}
