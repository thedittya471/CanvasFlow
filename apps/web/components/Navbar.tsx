"use client";

import React from "react";
import { Menu, Sparkles } from "lucide-react";

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#0d2137]/10 dark:border-[#faf7f0]/10 pb-4 gap-4 w-full">
      <div className="flex items-center gap-3">
        <button 
          onClick={onMenuClick} 
          className="p-1 hover:bg-[#faf7f0] dark:hover:bg-[#1c1c1e] rounded border border-[#0d2137]/15 dark:border-[#faf7f0]/15 md:hidden cursor-pointer"
        >
          <Menu className="size-5" />
        </button>
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-serif font-semibold text-[#0d2137]/60 dark:text-[#faf7f0]/60">
          <span className="border-b-2 border-[#0d2137] dark:border-white pb-1 pr-1">Overview</span>
          <span>/</span>
          <span>CanvasFlow</span>
        </div>
      </div>
      
      <div className="flex items-center gap-3 self-end sm:self-auto">
        <span className="text-xs font-serif italic text-[#0d2137]/60 dark:text-[#faf7f0]/60">Studio Report 2026</span>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-[#d4af37]/15 text-[#8e6e53] dark:text-[#d4af37] border border-[#d4af37]/35 rounded-full text-[10px] font-serif font-bold uppercase tracking-wider">
          <Sparkles className="size-3 fill-current" />
          <span>Pro Workspace</span>
        </div>
      </div>
    </div>
  );
}
