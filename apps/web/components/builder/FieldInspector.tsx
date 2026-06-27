"use client";

import React from "react";
import { SlidersHorizontal, Trash2, MousePointerClick } from "lucide-react";
import { getFieldOptionsArray, getFieldIcon } from "./FormFieldNode";

interface FieldInspectorProps {
  selectedField: any;
  label: string;
  setLabel: (val: string) => void;
  placeholder: string;
  setPlaceholder: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  isRequired: boolean;
  handleRequiredChange: (checked: boolean) => void;
  optionsList: string[];
  setOptionsList: (opts: string[]) => void;
  updateLocal: (id: string, patch: Record<string, any>) => void;
  handleDeleteField: () => void;
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[10px] font-serif font-bold uppercase tracking-widest text-[#0d2137]/45 mb-1.5">
      {children}
    </label>
  );
}

function Input({ value, onChange, placeholder: ph, type = "text" }: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={ph}
      className="w-full bg-[#faf8f5] border border-[#0d2137]/12 px-3 py-2 text-xs font-serif text-[#0d2137] placeholder:text-[#0d2137]/30 focus:outline-none focus:border-[#8e6e53] rounded transition-colors"
    />
  );
}

function Section({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <div className="space-y-3.5">
      {title && (
        <p className="text-[9px] font-serif font-bold uppercase tracking-widest text-[#0d2137]/30 border-b border-[#0d2137]/8 pb-1.5">
          {title}
        </p>
      )}
      {children}
    </div>
  );
}

export function FieldInspector({
  selectedField,
  label,
  setLabel,
  placeholder,
  setPlaceholder,
  description,
  setDescription,
  isRequired,
  handleRequiredChange,
  optionsList,
  setOptionsList,
  updateLocal,
  handleDeleteField,
}: FieldInspectorProps) {
  if (!selectedField) {
    return (
      <aside className="w-72 bg-[#faf8f5] border-l border-[#0d2137]/10 flex flex-col items-center justify-center gap-3 select-none shrink-0">
        <div className="p-3.5 rounded-full bg-white border border-[#0d2137]/10 text-[#0d2137]/25">
          <MousePointerClick className="size-5" />
        </div>
        <div className="text-center space-y-1 px-6">
          <p className="text-xs font-serif font-bold text-[#0d2137]/50 uppercase tracking-wider">
            No field selected
          </p>
          <p className="text-[10px] font-serif italic text-[#0d2137]/35 leading-relaxed">
            Click a field on the canvas to inspect and configure it
          </p>
        </div>
      </aside>
    );
  }

  const FieldIcon = getFieldIcon(selectedField.type);

  return (
    <aside className="w-72 bg-[#faf8f5] border-l border-[#0d2137]/10 flex flex-col shrink-0">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#0d2137]/8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="size-3.5 text-[#8e6e53]" />
          <span className="text-xs font-serif font-bold uppercase tracking-wider text-[#0d2137]">
            Inspector
          </span>
        </div>
        <div className="flex items-center gap-1.5 bg-white border border-[#0d2137]/10 px-2 py-0.5 rounded-full">
          <FieldIcon className="size-3 text-[#0d2137]/50" />
          <span className="text-[9px] font-serif font-bold uppercase tracking-wider text-[#0d2137]/50">
            {selectedField.type.replace("_", " ")}
          </span>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">

        {/* Core fields */}
        <Section title="General">
          <div>
            <Label>Label</Label>
            <Input
              value={label}
              onChange={(v) => {
                setLabel(v);
                updateLocal(selectedField.id, { label: v });
              }}
              placeholder="Enter field label…"
            />
          </div>

          <div>
            <Label>Placeholder</Label>
            <Input
              value={placeholder}
              onChange={(v) => {
                setPlaceholder(v);
                updateLocal(selectedField.id, { placeholder: v });
              }}
              placeholder="Hint text…"
            />
          </div>

          <div>
            <Label>Help text</Label>
            <textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                updateLocal(selectedField.id, { description: e.target.value });
              }}
              placeholder="Optional description…"
              rows={2}
              className="w-full bg-[#faf8f5] border border-[#0d2137]/12 px-3 py-2 text-xs font-serif text-[#0d2137] placeholder:text-[#0d2137]/30 focus:outline-none focus:border-[#8e6e53] rounded transition-colors resize-none"
            />
          </div>
        </Section>

        {/* Validation */}
        <Section title="Validation">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-serif font-bold text-[#0d2137]">Required</p>
              <p className="text-[10px] font-serif text-[#0d2137]/40">
                Force an answer
              </p>
            </div>
            <button
              onClick={() => handleRequiredChange(!isRequired)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus:outline-none ${
                isRequired ? "bg-[#3b5e82]" : "bg-[#0d2137]/12"
              }`}
            >
              <span
                className={`pointer-events-none inline-block size-4 mt-0.5 transform rounded-full bg-white shadow transition-transform duration-200 ${
                  isRequired ? "translate-x-4" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        </Section>

        {/* Type-specific options */}
        {(selectedField.type === "SELECT" || selectedField.type === "CHECKBOX") && (
          <Section title="Options">
            <div className="space-y-1.5">
              {optionsList.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <div className="size-3 shrink-0 rounded-sm border border-[#0d2137]/15 text-[#0d2137]/25" />
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => {
                      const next = [...optionsList];
                      next[idx] = e.target.value;
                      setOptionsList(next);
                    }}
                    onBlur={() => {
                      const original = getFieldOptionsArray(selectedField);
                      if (JSON.stringify(original) !== JSON.stringify(optionsList)) {
                        updateLocal(selectedField.id, { options: optionsList });
                      }
                    }}
                    className="flex-1 min-w-0 bg-white border border-[#0d2137]/10 px-2.5 py-2 text-xs font-serif text-[#0d2137] focus:outline-none focus:border-[#8e6e53] rounded transition-colors"
                  />
                  <button
                    onClick={() => {
                      const next = optionsList.filter((_, i) => i !== idx);
                      setOptionsList(next);
                      updateLocal(selectedField.id, { options: next });
                    }}
                    disabled={optionsList.length <= 1}
                    className="shrink-0 p-1 text-[#0d2137]/30 hover:text-red-500 hover:bg-red-50 rounded disabled:opacity-20 cursor-pointer transition-colors"
                  >
                    <Trash2 className="size-3" />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                const next = [...optionsList, `Option ${optionsList.length + 1}`];
                setOptionsList(next);
                updateLocal(selectedField.id, { options: next });
              }}
              className="w-full py-2 border border-dashed border-[#0d2137]/15 hover:border-[#8e6e53] text-[10px] font-serif font-bold uppercase tracking-wider text-[#0d2137]/40 hover:text-[#8e6e53] rounded transition-colors cursor-pointer"
            >
              + Add option
            </button>
          </Section>
        )}

        {selectedField.type === "RATING" && (
          <Section title="Rating Scale">
            <div>
              <Label>Max stars</Label>
              <select
                value={(selectedField.options as any)?.max || 5}
                onChange={(e) =>
                  updateLocal(selectedField.id, {
                    options: { ...((selectedField.options as any) || {}), max: parseInt(e.target.value) },
                  })
                }
                className="w-full bg-[#faf8f5] border border-[#0d2137]/12 px-2.5 py-2 text-xs font-serif text-[#0d2137] focus:outline-none focus:border-[#8e6e53] rounded transition-colors"
              >
                <option value={3}>3 — Small</option>
                <option value={5}>5 — Standard</option>
                <option value={10}>10 — Detailed</option>
              </select>
            </div>
          </Section>
        )}

        {selectedField.type === "DATE" && (
          <Section title="Date Range">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Min date</Label>
                <input
                  type="date"
                  value={(selectedField.options as any)?.minDate || ""}
                  onChange={(e) =>
                    updateLocal(selectedField.id, {
                      options: { ...((selectedField.options as any) || {}), minDate: e.target.value },
                    })
                  }
                  className="w-full bg-[#faf8f5] border border-[#0d2137]/12 px-2 py-1.5 text-[10px] font-serif text-[#0d2137] focus:outline-none rounded"
                />
              </div>
              <div>
                <Label>Max date</Label>
                <input
                  type="date"
                  value={(selectedField.options as any)?.maxDate || ""}
                  onChange={(e) =>
                    updateLocal(selectedField.id, {
                      options: { ...((selectedField.options as any) || {}), maxDate: e.target.value },
                    })
                  }
                  className="w-full bg-[#faf8f5] border border-[#0d2137]/12 px-2 py-1.5 text-[10px] font-serif text-[#0d2137] focus:outline-none rounded"
                />
              </div>
            </div>
          </Section>
        )}

        {selectedField.type === "TIME" && (
          <Section title="Time Range">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Min time</Label>
                <input
                  type="time"
                  value={(selectedField.options as any)?.minTime || ""}
                  onChange={(e) =>
                    updateLocal(selectedField.id, {
                      options: { ...((selectedField.options as any) || {}), minTime: e.target.value },
                    })
                  }
                  className="w-full bg-[#faf8f5] border border-[#0d2137]/12 px-2 py-1.5 text-[10px] font-serif text-[#0d2137] focus:outline-none rounded"
                />
              </div>
              <div>
                <Label>Max time</Label>
                <input
                  type="time"
                  value={(selectedField.options as any)?.maxTime || ""}
                  onChange={(e) =>
                    updateLocal(selectedField.id, {
                      options: { ...((selectedField.options as any) || {}), maxTime: e.target.value },
                    })
                  }
                  className="w-full bg-[#faf8f5] border border-[#0d2137]/12 px-2 py-1.5 text-[10px] font-serif text-[#0d2137] focus:outline-none rounded"
                />
              </div>
            </div>
          </Section>
        )}

        {selectedField.type === "TOGGLE" && (
          <Section title="Toggle">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-serif font-bold text-[#0d2137]">Default on</p>
              <button
                onClick={() => {
                  const cur = !!(selectedField.options as any)?.defaultValue;
                  updateLocal(selectedField.id, {
                    options: { ...((selectedField.options as any) || {}), defaultValue: !cur },
                  });
                }}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus:outline-none ${
                  (selectedField.options as any)?.defaultValue
                    ? "bg-[#3b5e82]"
                    : "bg-[#0d2137]/12"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block size-4 mt-0.5 transform rounded-full bg-white shadow transition-transform duration-200 ${
                    (selectedField.options as any)?.defaultValue ? "translate-x-4" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Active label</Label>
                <input
                  type="text"
                  defaultValue={(selectedField.options as any)?.activeLabel || "Yes"}
                  onBlur={(e) =>
                    updateLocal(selectedField.id, {
                      options: { ...((selectedField.options as any) || {}), activeLabel: e.target.value || "Yes" },
                    })
                  }
                  className="w-full bg-[#faf8f5] border border-[#0d2137]/12 px-2 py-1.5 text-[10px] font-serif text-[#0d2137] focus:outline-none rounded"
                />
              </div>
              <div>
                <Label>Inactive label</Label>
                <input
                  type="text"
                  defaultValue={(selectedField.options as any)?.inactiveLabel || "No"}
                  onBlur={(e) =>
                    updateLocal(selectedField.id, {
                      options: { ...((selectedField.options as any) || {}), inactiveLabel: e.target.value || "No" },
                    })
                  }
                  className="w-full bg-[#faf8f5] border border-[#0d2137]/12 px-2 py-1.5 text-[10px] font-serif text-[#0d2137] focus:outline-none rounded"
                />
              </div>
            </div>
          </Section>
        )}
      </div>

      {/* Delete footer */}
      <div className="px-4 py-3 border-t border-[#0d2137]/8">
        <button
          onClick={handleDeleteField}
          className="w-full flex items-center justify-center gap-2 py-2.5 text-[10px] font-serif font-bold uppercase tracking-widest border border-red-400/20 hover:border-red-400/50 bg-transparent hover:bg-red-50 text-red-500/60 hover:text-red-600 rounded transition-all cursor-pointer"
        >
          <Trash2 className="size-3.5" />
          <span>Remove Field</span>
        </button>
      </div>
    </aside>
  );
}
