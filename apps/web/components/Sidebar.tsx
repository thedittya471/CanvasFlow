"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Plus,
  Compass,
  PencilRuler,
  FileText,
  BarChart3,
  ChevronDown,
  X,
  Settings,
  Box,
  LayoutTemplate
} from "lucide-react";

import { useDashboard } from "~/providers/dashboard-provider";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { openCreateFormModal } = useDashboard();

  const links = [
    { href: "/dashboard", label: "Studio", icon: Compass },
    { href: "/dashboard/sketches", label: "My Sketches", icon: PencilRuler },
    { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/dashboard/archive", label: "Archive", icon: Box },
    { href: "/dashboard/templates", label: "Templates", icon: LayoutTemplate },
    { href: "/dashboard/settings", label: "Settings", icon: Settings }
  ];

  return (
    <aside className={`fixed inset-y-0 left-0 z-50 w-64 h-screen bg-[#f3ebd8] dark:bg-[#1a1a1c] border-r-2 border-[#0d2137] dark:border-[#2a2a2a] flex flex-col justify-between p-6 transform transition-transform duration-300 md:translate-x-0 md:sticky md:top-0 overflow-hidden ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg border-2 border-[#0d2137] dark:border-[#b9c9df] flex items-center justify-center font-serif font-bold bg-[#faf7f0] dark:bg-[#2c2c2e]">
              CF
            </div>
            <div>
              <h1 className="font-serif font-semibold text-lg leading-tight tracking-tight text-[#0d2137] dark:text-white">CanvasFlow</h1>
              <p className="text-[9px] tracking-widest text-[#0d2137]/60 dark:text-[#faf7f0]/60 uppercase font-bold">Workspace</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button className="md:hidden p-1 text-[#0d2137] dark:text-[#faf7f0]" onClick={onClose}>
              <X className="size-5" />
            </button>
          </div>
        </div>

        <button
          onClick={openCreateFormModal}
          className="w-full bg-[#0d2137] dark:bg-[#b9c9df] text-[#faf7f0] dark:text-[#0d2137] py-3 px-4 rounded border-2 border-[#0d2137] dark:border-[#b9c9df] hover:bg-[#1a3854] dark:hover:bg-[#ccdcf2] active:bg-[#071321] transition-all flex items-center justify-center gap-2 font-serif text-sm font-semibold uppercase tracking-wider shadow-[3px_3px_0px_0px_#8e6e53] dark:shadow-[3px_3px_0px_0px_#d4af37] hover:shadow-[1px_1px_0px_0px_#8e6e53] dark:hover:shadow-[1px_1px_0px_0px_#d4af37] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
        >
          <Plus className="size-4" />
          <span>New Sketch</span>
        </button>

        <nav className="space-y-1">
          {links.map(item => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-serif font-semibold rounded transition-all border-2 ${isActive ? "bg-[#0d2137] dark:bg-[#b9c9df] text-[#faf7f0] dark:text-[#0d2137] border-[#0d2137] dark:border-[#b9c9df] shadow-[2px_2px_0px_0px_#8e6e53] dark:shadow-[2px_2px_0px_0px_#d4af37]" : "text-[#0d2137]/80 dark:text-[#faf7f0]/80 border-transparent hover:bg-[#faf7f0]/50 dark:hover:bg-[#2c2c2e]/50"}`}
              >
                <Icon className="size-4.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-[#0d2137]/15 dark:border-[#faf7f0]/15 pt-4 mt-auto">
        <div className="flex items-center justify-between p-2 rounded-lg hover:bg-[#faf7f0]/40 dark:hover:bg-[#2c2c2e]/40 transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-[#0d2137] dark:border-[#faf7f0] bg-[#faf7f0] dark:bg-[#2c2c2e] flex items-center justify-center font-serif font-bold text-sm">
              DM
            </div>
            <div className="text-left overflow-hidden">
              <p className="font-serif text-sm font-bold truncate">Dittya Maity</p>
              <p className="text-[10px] text-[#0d2137]/60 dark:text-[#faf7f0]/60 truncate">dittyamity@gmail.com</p>
            </div>
          </div>
          <ChevronDown className="size-4 text-[#0d2137]/60 dark:text-[#faf7f0]/60 shrink-0" />
        </div>
      </div>
    </aside>
  );
}
