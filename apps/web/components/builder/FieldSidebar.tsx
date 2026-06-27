"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import { AVAILABLE_FIELDS } from "./FormFieldNode";

interface FieldSidebarProps {
  onDragStart: (event: React.DragEvent, type: string) => void;
}

const CATEGORIES = [
  {
    label: "Text",
    types: ["TEXT", "TEXTAREA", "EMAIL", "PHONE", "URL"],
  },
  {
    label: "Numbers",
    types: ["NUMBER"],
  },
  {
    label: "Choice",
    types: ["SELECT", "CHECKBOX"],
  },
  {
    label: "Interactive",
    types: ["RATING", "TOGGLE"],
  },
  {
    label: "Date & Time",
    types: ["DATE", "TIME"],
  },
];

export function FieldSidebar({ onDragStart }: FieldSidebarProps) {
  const [query, setQuery] = useState("");

  const filtered = query.trim()
    ? AVAILABLE_FIELDS.filter(
        (f) =>
          f.label.toLowerCase().includes(query.toLowerCase()) ||
          f.description.toLowerCase().includes(query.toLowerCase())
      )
    : null;

  return (
    <aside className="w-64 bg-[#faf8f5] dark:bg-[#141416] border-r border-[#0d2137]/10 dark:border-white/8 flex flex-col shrink-0">
      {/* Header */}
      <div className="px-4 pt-3 pb-2.5 border-b border-[#0d2137]/8 dark:border-white/6">
        <p className="text-[10px] font-serif font-bold uppercase tracking-widest text-[#0d2137]/50 dark:text-white/40 mb-2">
          Fields
        </p>
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-3 text-[#0d2137]/30 dark:text-white/30 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search…"
            className="w-full pl-6 pr-2 py-1.5 text-[10px] font-serif bg-white dark:bg-[#1c1c1e] border border-[#0d2137]/12 dark:border-white/8 rounded text-[#0d2137] dark:text-white placeholder:text-[#0d2137]/30 dark:placeholder:text-white/25 focus:outline-none focus:border-[#8e6e53] dark:focus:border-[#d4af37] transition-colors"
          />
        </div>
      </div>

      {/* Field list */}
      <div className="flex-1 overflow-y-auto py-2.5 space-y-3.5 px-2.5">
        {filtered ? (
          // Flat search results
          filtered.length > 0 ? (
            <div className="space-y-1">
              {filtered.map((f) => (
                <FieldItem key={f.type} field={f} onDragStart={onDragStart} />
              ))}
            </div>
          ) : (
            <p className="text-[9px] font-serif italic text-[#0d2137]/40 dark:text-white/30 text-center py-4">
              No fields match &ldquo;{query}&rdquo;
            </p>
          )
        ) : (
          // Categorized
          CATEGORIES.map((cat) => {
            const catFields = AVAILABLE_FIELDS.filter((f) => cat.types.includes(f.type));
            if (catFields.length === 0) return null;
            return (
              <div key={cat.label}>
                <p className="text-[9px] font-serif font-bold uppercase tracking-widest text-[#0d2137]/35 dark:text-white/30 px-1 mb-1.5">
                  {cat.label}
                </p>
                <div className="space-y-0.5">
                  {catFields.map((f) => (
                    <FieldItem key={f.type} field={f} onDragStart={onDragStart} />
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer hint */}
      <div className="px-4 py-2.5 border-t border-[#0d2137]/8 dark:border-white/6">
        <p className="text-[9px] font-serif italic text-[#0d2137]/35 dark:text-white/25 text-center">
          Drag onto canvas to add
        </p>
      </div>
    </aside>
  );
}

function FieldItem({
  field,
  onDragStart,
}: {
  field: (typeof AVAILABLE_FIELDS)[number];
  onDragStart: (e: React.DragEvent, type: string) => void;
}) {
  const Icon = field.icon;
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, field.type)}
      className="flex items-center gap-2.5 px-2.5 py-2.5 rounded cursor-grab active:cursor-grabbing select-none group hover:bg-white dark:hover:bg-[#222224] hover:shadow-[0_1px_3px_rgba(13,33,55,0.06)] transition-all"
    >
      <div className="shrink-0 p-2 rounded bg-white dark:bg-[#222224] border border-[#0d2137]/10 dark:border-white/8 group-hover:border-[#0d2137]/20 dark:group-hover:border-white/15 group-hover:text-[#8e6e53] dark:group-hover:text-[#d4af37] text-[#0d2137]/55 dark:text-white/50 transition-colors">
        <Icon className="size-3.5" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-serif font-bold text-[#0d2137] dark:text-white leading-tight truncate">
          {field.label}
        </p>
        <p className="text-[9px] font-serif text-[#0d2137]/40 dark:text-white/35 truncate mt-0.5">
          {field.description}
        </p>
      </div>
    </div>
  );
}
