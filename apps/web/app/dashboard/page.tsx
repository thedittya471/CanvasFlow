"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Layers, 
  FileText, 
  TrendingUp, 
  PencilRuler, 
  DraftingCompass,
  Inbox
} from "lucide-react";
import { useTheme } from "next-themes";
import { useDashboard } from "~/providers/dashboard-provider";

export default function DashboardPage() {
  const { openCreateFormModal } = useDashboard();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && theme === "dark";

  return (
    <div className="space-y-8">
      {/* Hero Welcome */}
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <h2 className="text-4xl md:text-5xl font-serif text-[#0d2137] dark:text-white font-bold tracking-tight">
            Good morning, Architect.
          </h2>
          <p className="text-lg md:text-xl font-caveat text-[#8e6e53] dark:text-[#d4af37] mt-2 italic">
            Here's what's happening in your studio today.
          </p>
        </div>
        <div className="hidden lg:block text-right text-[10px] tracking-[0.2em] font-serif font-semibold text-[#0d2137]/40 dark:text-[#faf7f0]/40 uppercase select-none leading-relaxed">
          Studio Report
          <br />
          CanvasFlow • 2026
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Total Sketches",
            val: "1",
            sub: "0 published",
            footer: "Forms Created",
            icon: DraftingCompass
          },
          {
            title: "Active Sketches",
            val: "0",
            sub: "0% of all forms",
            footer: "Currently Published",
            icon: PencilRuler
          },
          {
            title: "Total Responses",
            val: "0",
            sub: "No prior month data",
            footer: "Across All Forms",
            icon: Layers
          },
          {
            title: "This Month",
            val: "0",
            sub: "No responses last month",
            footer: "Responses Collected",
            icon: TrendingUp
          }
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div 
              key={i} 
              className="relative overflow-hidden bg-white dark:bg-[#1a1a1c] border-2 border-[#0d2137] dark:border-[#2a2a2a] p-6 rounded shadow-[4px_4px_0px_0px_#0d2137] dark:shadow-[4px_4px_0px_0px_#2a2a2a] group hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#0d2137] dark:hover:shadow-[6px_6px_0px_0px_#2a2a2a] transition-all duration-300"
            >
              {/* Paper texture overlay */}
              <div className="absolute inset-0 bg-cover bg-center mix-blend-multiply dark:mix-blend-overlay opacity-80 pointer-events-none select-none" style={{ backgroundImage: isDark ? "url('/asset4.png')" : "url('/assest1.png')" }} />
              
              <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] tracking-wider font-serif font-bold uppercase text-[#0d2137]/65 dark:text-[#faf7f0]/65">{stat.title}</span>
                  <Icon className="size-4.5 text-[#8e6e53] dark:text-[#d4af37]" />
                </div>
                <div>
                  <h3 className="text-4xl md:text-5xl font-serif font-bold tracking-tight text-[#0d2137] dark:text-white leading-none">{stat.val}</h3>
                  <p className="text-xs text-[#0d2137]/50 dark:text-[#faf7f0]/50 mt-1 font-serif">{stat.sub}</p>
                </div>
                <div className="border-t border-[#0d2137]/10 dark:border-[#faf7f0]/10 pt-2 text-[9px] uppercase tracking-widest font-serif font-bold text-[#8e6e53] dark:text-[#d4af37]/80">
                  {stat.footer}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Response Trends Card */}
      <div className="bg-[#faf7f0] dark:bg-[#1a1a1c] border-2 border-[#0d2137] dark:border-[#2a2a2a] rounded overflow-hidden shadow-[6px_6px_0px_0px_#0d2137] dark:shadow-[6px_6px_0px_0px_#2a2a2a] transition-colors duration-300">
        {/* Header section */}
        <div className="p-6 border-b border-[#0d2137]/15 dark:border-[#faf7f0]/15 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-[#1c1c1e]">
          <div>
            <span className="text-[9px] uppercase tracking-widest font-serif font-bold text-[#8e6e53] dark:text-[#d4af37]">— Analytics</span>
            <h3 className="text-2xl font-serif font-bold text-[#0d2137] dark:text-white mt-0.5">Response Trends</h3>
            <p className="text-xs text-[#0d2137]/60 dark:text-[#faf7f0]/60 font-serif">Submissions over time</p>
          </div>
          
          {/* View selectors */}
          <div className="flex bg-[#faf7f0] dark:bg-[#2c2c2e] p-1 border-2 border-[#0d2137] dark:border-[#3a3a3c] rounded text-[10px] font-serif font-bold uppercase tracking-wider select-none shrink-0">
            {["3 Months", "30 Days", "7 Days"].map((tab, idx) => (
              <button 
                key={tab}
                className={`px-3 py-1.5 rounded transition-all cursor-pointer ${idx === 0 ? "bg-[#0d2137] dark:bg-[#b9c9df] text-[#faf7f0] dark:text-[#0d2137] font-semibold" : "text-[#0d2137]/60 dark:text-[#faf7f0]/60 hover:text-[#0d2137] dark:hover:text-[#faf7f0]"}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Blueprint Display panel */}
        <div className="relative h-96 w-full flex items-center justify-center overflow-hidden bg-[#244f75] dark:bg-[#1a3854]">
          {/* Blueprint background image */}
          <div className="absolute inset-0 opacity-40 dark:opacity-20 pointer-events-none select-none bg-cover bg-center mix-blend-luminosity" style={{ backgroundImage: isDark ? "url('/asset3.png')" : "url('/asset2.png')" }} />
          
          {/* Blueprint grid lines overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.075)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.075)_1px,transparent_1px)] bg-size-[24px_24px] pointer-events-none" />

          {/* Blueprint Blueprint Specs overlay */}
          <div className="absolute top-6 left-6 text-white/50 border border-white/20 p-2.5 rounded font-mono text-[9px] uppercase leading-relaxed select-none tracking-wider bg-[#0d2137]/20 backdrop-blur-sm pointer-events-none">
            Fig. 01 — Flow Analysis
            <br />
            Scale: 1:100
            <br />
            Section A-A
            <br />
            Elevation North
          </div>

          {/* Centered Empty Overlay Card */}
          <div className="relative z-10 bg-white dark:bg-[#1c1c1e] p-8 max-w-sm mx-4 text-center border-2 border-[#0d2137] dark:border-[#2a2a2a] shadow-[4px_4px_0px_0px_#0d2137] dark:shadow-[4px_4px_0px_0px_#2a2a2a] rounded">
            <div className="w-12 h-12 rounded-full border border-[#0d2137]/15 dark:border-[#faf7f0]/15 flex items-center justify-center mx-auto mb-4 bg-[#faf7f0] dark:bg-[#2c2c2e]">
              <Inbox className="size-6 text-[#8e6e53] dark:text-[#d4af37]" />
            </div>
            <h4 className="text-xs uppercase tracking-widest font-serif font-bold text-[#0d2137] dark:text-white">Awaiting Input Data</h4>
            <p className="text-xs text-[#0d2137]/60 dark:text-[#faf7f0]/60 font-serif mt-2 leading-relaxed">
              Publish your first sketch to begin tracking audience engagement and architectural metrics.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Blueprints */}
      <div className="space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-[#0d2137]/10 dark:border-[#faf7f0]/10">
          <h3 className="text-2xl font-serif font-bold text-[#0d2137] dark:text-white">Recent Blueprints</h3>
          <button className="text-[10px] font-serif font-bold uppercase tracking-wider text-[#8e6e53] dark:text-[#d4af37] hover:underline cursor-pointer flex items-center gap-1">
            <span>View All</span>
            <span>→</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Blueprint Item 1 */}
          <div className="bg-white dark:bg-[#1a1a1c] border-2 border-[#0d2137] dark:border-[#2a2a2a] p-5 rounded shadow-[4px_4px_0px_0px_#0d2137] dark:shadow-[4px_4px_0px_0px_#2a2a2a] flex items-center justify-between hover:-translate-y-0.5 transition-all duration-300">
            <div className="flex items-center gap-4">
              {/* Draft Badge icon */}
              <div className="w-14 h-16 border border-[#0d2137]/15 dark:border-[#faf7f0]/15 bg-[#faf7f0] dark:bg-[#2c2c2e] rounded flex flex-col items-center justify-center p-2 text-center select-none shrink-0">
                <FileText className="size-5 text-[#8e6e53] dark:text-[#d4af37] mb-1" />
                <span className="text-[8px] font-bold tracking-widest text-[#0d2137]/50 dark:text-[#faf7f0]/50 uppercase font-sans">Draft</span>
              </div>
              <div>
                <h4 className="font-serif font-bold text-lg text-[#0d2137] dark:text-white">Quarterly Feedback Loop</h4>
                <p className="text-xs text-[#0d2137]/50 dark:text-[#faf7f0]/50 font-serif mt-0.5">Created January 24, 2026</p>
              </div>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full border border-[#0d2137] dark:border-white bg-[#0d2137] text-white dark:bg-[#2c2c2e] flex items-center justify-center font-bold text-[9px]">
                  DM
                </div>
                <span className="text-[10px] font-serif font-bold uppercase tracking-wider text-[#0d2137]/70 dark:text-[#faf7f0]/70">0 Responses</span>
              </div>
            </div>
          </div>

          {/* Start New Blueprint Item */}
          <button 
            onClick={openCreateFormModal}
            className="relative overflow-hidden bg-[#faf7f0] dark:bg-[#1c1c1e] border-2 border-dashed border-[#0d2137]/40 dark:border-[#faf7f0]/40 p-5 rounded shadow-[4px_4px_0px_0px_#0d2137]/15 dark:shadow-[4px_4px_0px_0px_#2a2a2a]/15 flex items-center justify-center min-h-23 group hover:border-[#0d2137] dark:hover:border-white transition-all duration-300 cursor-pointer"
          >
            {/* Paper overlay */}
            <div className="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none select-none" style={{ backgroundImage: isDark ? "url('/asset4.png')" : "url('/assest1.png')" }} />
            
            <div className="flex flex-col items-center justify-center gap-2 relative z-10">
              <div className="w-8 h-8 rounded-full border border-[#0d2137]/25 dark:border-[#faf7f0]/25 flex items-center justify-center bg-white dark:bg-[#2c2c2e] group-hover:scale-105 transition-transform">
                <Plus className="size-4 text-[#8e6e53] dark:text-[#d4af37]" />
              </div>
              <span className="text-xs uppercase tracking-widest font-serif font-bold text-[#8e6e53] dark:text-[#d4af37]">Start New Blueprint</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
