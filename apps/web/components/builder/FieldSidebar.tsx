"use client";

import React from "react";
import { AVAILABLE_FIELDS } from "./FormFieldNode";

interface FieldSidebarProps {
  onDragStart: (event: React.DragEvent, type: string) => void;
}

export function FieldSidebar({ onDragStart }: FieldSidebarProps) {
  return (
    <aside className="w-64 bg-white dark:bg-[#1c1c1e] border-r border-[#0d2137]/15 dark:border-white/10 flex flex-col">
      <div className="p-4 border-b border-[#0d2137]/10 dark:border-white/10">
        <h2 className="text-[11px] font-serif uppercase tracking-widest text-[#0d2137] dark:text-white font-bold">
          Blueprint Fields
        </h2>
        <p className="text-[10px] text-[#0d2137]/50 dark:text-white/40 font-serif italic mt-0.5">
          Drag elements onto grid canvas
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {AVAILABLE_FIELDS.map((f) => {
          const Icon = f.icon;
          return (
            <div
              key={f.type}
              draggable
              onDragStart={(e) => onDragStart(e, f.type)}
              className="flex items-center gap-3 p-3 bg-[#faf8f5] dark:bg-[#2c2c2e]/45 border border-[#0d2137]/10 dark:border-white/5 hover:border-[#0d2137]/20 dark:hover:border-white/10 hover:-translate-y-px hover:shadow-[1px_2px_4px_rgba(13,33,55,0.03)] cursor-grab active:cursor-grabbing rounded transition-all select-none group"
            >
              <div className="p-1.5 bg-white dark:bg-[#222224] border border-[#0d2137]/10 dark:border-white/5 rounded text-[#0d2137]/75 dark:text-white/70 group-hover:text-[#8e6e53] dark:group-hover:text-[#d4af37] transition-colors">
                <Icon className="size-4" />
              </div>
              <div>
                <h4 className="text-xs font-serif font-bold text-[#0d2137] dark:text-white leading-tight">
                  {f.label}
                </h4>
                <p className="text-[9px] text-[#0d2137]/45 dark:text-white/40 leading-none mt-0.5">
                  {f.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
