"use client";

import React from "react";

export function FormLoadingState() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#faf7f0] dark:bg-[#121212] transition-colors duration-300">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded border border-t-2 border-[#0d2137] dark:border-white border-t-transparent animate-spin" />
        <span className="text-xs uppercase tracking-widest font-serif font-bold text-[#0d2137]/60 dark:text-white/60">
          Fetching Form Blueprint...
        </span>
      </div>
    </div>
  );
}
