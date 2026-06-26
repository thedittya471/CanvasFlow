"use client";

import React from "react";
import { Settings, Trash2 } from "lucide-react";
import { getFieldOptionsArray } from "./FormFieldNode";

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
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3 select-none">
        <div className="p-3 bg-[#faf8f5] dark:bg-[#2c2c2e]/45 border border-[#0d2137]/10 dark:border-white/5 rounded text-[#0d2137]/45 dark:text-white/40">
          <Settings className="size-6 animate-pulse" />
        </div>
        <div>
          <h4 className="text-xs font-serif font-bold text-[#0d2137] dark:text-white uppercase tracking-wider">
            No Selection
          </h4>
          <p className="text-[10px] text-[#0d2137]/50 dark:text-white/40 leading-relaxed font-serif italic max-w-45 mx-auto mt-1">
            Click on any node to view and configure its blueprint parameters.
          </p>
        </div>
      </div>
    );
  }

  return (
    <aside className="w-80 bg-white dark:bg-[#1c1c1e] border-l border-[#0d2137]/15 dark:border-white/10 flex flex-col justify-between">
      {/* Active selection settings */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Section Header */}
        <div className="flex justify-between items-center pb-4 border-b border-[#0d2137]/10 dark:border-white/10">
          <div className="flex items-center gap-2">
            <Settings className="size-4 text-[#8e6e53] dark:text-[#d4af37]" />
            <h2 className="text-[13px] font-serif uppercase tracking-wider text-[#0d2137] dark:text-white font-bold">
              Field Inspector
            </h2>
          </div>
          <span className="text-[9px] font-serif font-bold uppercase bg-[#0d2137]/5 dark:bg-white/10 px-2 py-0.5 rounded text-[#0d2137]/60 dark:text-white/60">
            {selectedField.type}
          </span>
        </div>

        {/* Form Input: Label */}
        <div className="space-y-2">
          <label className="block text-[10px] font-serif uppercase tracking-wider text-[#0d2137]/60 dark:text-white/60 font-bold">
            Field Label
          </label>
          <input
            type="text"
            value={label}
            onChange={(e) => {
              setLabel(e.target.value);
              updateLocal(selectedField.id, { label: e.target.value });
            }}
            className="w-full bg-[#faf8f5] dark:bg-[#2c2c2e]/60 border border-[#0d2137]/15 dark:border-white/10 p-2.5 text-xs text-[#0d2137] dark:text-white focus:outline-none focus:border-[#8e6e53] dark:focus:border-[#d4af37] font-serif rounded transition-colors"
          />
        </div>

        {/* Form Input: Placeholder */}
        <div className="space-y-2">
          <label className="block text-[10px] font-serif uppercase tracking-wider text-[#0d2137]/60 dark:text-white/60 font-bold">
            Placeholder Hint
          </label>
          <input
            type="text"
            value={placeholder}
            onChange={(e) => {
              setPlaceholder(e.target.value);
              updateLocal(selectedField.id, { placeholder: e.target.value });
            }}
            className="w-full bg-[#faf8f5] dark:bg-[#2c2c2e]/60 border border-[#0d2137]/15 dark:border-white/10 p-2.5 text-xs text-[#0d2137] dark:text-white focus:outline-none focus:border-[#8e6e53] dark:focus:border-[#d4af37] font-serif rounded transition-colors"
          />
        </div>

        {/* Form Input: Description */}
        <div className="space-y-2">
          <label className="block text-[10px] font-serif uppercase tracking-wider text-[#0d2137]/60 dark:text-white/60 font-bold">
            Description / Help Text
          </label>
          <textarea
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              updateLocal(selectedField.id, { description: e.target.value });
            }}
            rows={2}
            className="w-full bg-[#faf8f5] dark:bg-[#2c2c2e]/60 border border-[#0d2137]/15 dark:border-white/10 p-2.5 text-xs text-[#0d2137] dark:text-white focus:outline-none focus:border-[#8e6e53] dark:focus:border-[#d4af37] font-serif rounded transition-colors resize-none"
          />
        </div>

        {/* Form Input: Required Switch Toggle */}
        <div className="flex items-center justify-between pt-2">
          <div>
            <h4 className="text-xs font-serif font-bold text-[#0d2137] dark:text-white">Required Input</h4>
            <p className="text-[9px] text-[#0d2137]/50 dark:text-white/40 font-serif italic leading-none mt-0.5">
              Require responders to answer
            </p>
          </div>

          <button
            onClick={() => handleRequiredChange(!isRequired)}
            className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-250 ease-in-out focus:outline-none ${
              isRequired ? "bg-[#3b5e82] dark:bg-[#d4af37]" : "bg-[#0d2137]/10 dark:bg-white/10"
            }`}
          >
            <span
              className={`pointer-events-none inline-block size-4 transform rounded-full bg-white shadow ring-0 transition duration-250 ease-in-out ${
                isRequired ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Choice List Editor for dropdowns/checkboxes */}
        {(selectedField.type === "SELECT" || selectedField.type === "CHECKBOX") && (
          <div className="space-y-3 pt-4 border-t border-[#0d2137]/10 dark:border-white/10">
            <label className="block text-[10px] font-serif uppercase tracking-wider text-[#0d2137]/60 dark:text-white/60 font-bold">
              Menu Choices
            </label>
            <div className="space-y-2">
              {optionsList.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-2">
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
                    className="flex-1 bg-[#faf8f5] dark:bg-[#2c2c2e]/60 border border-[#0d2137]/15 dark:border-white/10 p-2 text-xs text-[#0d2137] dark:text-white focus:outline-none focus:border-[#8e6e53] dark:focus:border-[#d4af37] font-serif rounded"
                  />
                  <button
                    onClick={() => {
                      const next = optionsList.filter((_, i) => i !== idx);
                      setOptionsList(next);
                      updateLocal(selectedField.id, { options: next });
                    }}
                    disabled={optionsList.length <= 1}
                    className="p-1.5 text-red-500/70 hover:text-red-500 hover:bg-red-500/5 rounded disabled:opacity-30 cursor-pointer"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                const next = [...optionsList, `Choice ${optionsList.length + 1}`];
                setOptionsList(next);
                updateLocal(selectedField.id, { options: next });
              }}
              className="w-full py-1.5 border-2 border-dashed border-[#0d2137]/20 dark:border-white/10 hover:border-[#8e6e53] dark:hover:border-[#d4af37] text-xs font-serif font-bold text-[#0d2137]/70 dark:text-white/70 hover:text-[#8e6e53] dark:hover:text-[#d4af37] text-center rounded transition-colors cursor-pointer"
            >
              + Add Choice
            </button>
          </div>
        )}

        {/* Rating Limit Scale */}
        {selectedField.type === "RATING" && (
          <div className="space-y-3 pt-4 border-t border-[#0d2137]/10 dark:border-white/10">
            <label className="block text-[10px] font-serif uppercase tracking-wider text-[#0d2137]/60 dark:text-white/60 font-bold">
              Rating Scale Limit
            </label>
            <select
              value={(selectedField.options as any)?.max || 5}
              onChange={(e) => {
                updateLocal(selectedField.id, {
                  options: { ...((selectedField.options as any) || {}), max: parseInt(e.target.value) },
                });
              }}
              className="w-full bg-[#faf8f5] dark:bg-[#2c2c2e]/60 border border-[#0d2137]/15 dark:border-white/10 p-2 text-xs text-[#0d2137] dark:text-white focus:outline-none focus:border-[#8e6e53] dark:focus:border-[#d4af37] font-serif rounded"
            >
              <option value={3}>3 Stars (Small)</option>
              <option value={5}>5 Stars (Standard)</option>
              <option value={10}>10 Stars (Detailed)</option>
            </select>
          </div>
        )}

        {/* Date Bounds Options */}
        {selectedField.type === "DATE" && (
          <div className="space-y-4 pt-4 border-t border-[#0d2137]/10 dark:border-white/10">
            <label className="block text-[10px] font-serif uppercase tracking-wider text-[#0d2137]/60 dark:text-white/60 font-bold">
              Date Range Settings
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[8px] font-serif text-[#0d2137]/50 dark:text-white/40 uppercase">Min Date</label>
                <input
                  type="date"
                  value={(selectedField.options as any)?.minDate || ""}
                  onChange={(e) => {
                    updateLocal(selectedField.id, {
                      options: { ...((selectedField.options as any) || {}), minDate: e.target.value },
                    });
                  }}
                  className="w-full bg-[#faf8f5] dark:bg-[#2c2c2e]/60 border border-[#0d2137]/15 dark:border-white/10 p-1.5 text-[10px] text-[#0d2137] dark:text-white focus:outline-none rounded font-serif"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[8px] font-serif text-[#0d2137]/50 dark:text-white/40 uppercase">Max Date</label>
                <input
                  type="date"
                  value={(selectedField.options as any)?.maxDate || ""}
                  onChange={(e) => {
                    updateLocal(selectedField.id, {
                      options: { ...((selectedField.options as any) || {}), maxDate: e.target.value },
                    });
                  }}
                  className="w-full bg-[#faf8f5] dark:bg-[#2c2c2e]/60 border border-[#0d2137]/15 dark:border-white/10 p-1.5 text-[10px] text-[#0d2137] dark:text-white focus:outline-none rounded font-serif"
                />
              </div>
            </div>
          </div>
        )}

        {/* Time Bounds Options */}
        {selectedField.type === "TIME" && (
          <div className="space-y-4 pt-4 border-t border-[#0d2137]/10 dark:border-white/10">
            <label className="block text-[10px] font-serif uppercase tracking-wider text-[#0d2137]/60 dark:text-white/60 font-bold">
              Time Range Settings
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[8px] font-serif text-[#0d2137]/50 dark:text-white/40 uppercase">Min Time</label>
                <input
                  type="time"
                  value={(selectedField.options as any)?.minTime || ""}
                  onChange={(e) => {
                    updateLocal(selectedField.id, {
                      options: { ...((selectedField.options as any) || {}), minTime: e.target.value },
                    });
                  }}
                  className="w-full bg-[#faf8f5] dark:bg-[#2c2c2e]/60 border border-[#0d2137]/15 dark:border-white/10 p-1.5 text-[10px] text-[#0d2137] dark:text-white focus:outline-none rounded font-serif"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[8px] font-serif text-[#0d2137]/50 dark:text-white/40 uppercase">Max Time</label>
                <input
                  type="time"
                  value={(selectedField.options as any)?.maxTime || ""}
                  onChange={(e) => {
                    updateLocal(selectedField.id, {
                      options: { ...((selectedField.options as any) || {}), maxTime: e.target.value },
                    });
                  }}
                  className="w-full bg-[#faf8f5] dark:bg-[#2c2c2e]/60 border border-[#0d2137]/15 dark:border-white/10 p-1.5 text-[10px] text-[#0d2137] dark:text-white focus:outline-none rounded font-serif"
                />
              </div>
            </div>
          </div>
        )}

        {/* Toggle Configuration */}
        {selectedField.type === "TOGGLE" && (
          <div className="space-y-4 pt-4 border-t border-[#0d2137]/10 dark:border-white/10">
            <label className="block text-[10px] font-serif uppercase tracking-wider text-[#0d2137]/60 dark:text-white/60 font-bold">
              Toggle Configuration
            </label>

            <div className="flex items-center justify-between">
              <span className="text-[10px] font-serif text-[#0d2137]/70 dark:text-white/60 font-bold">Default Value</span>
              <button
                onClick={() => {
                  const currentVal = !!(selectedField.options as any)?.defaultValue;
                  updateLocal(selectedField.id, {
                    options: { ...((selectedField.options as any) || {}), defaultValue: !currentVal },
                  });
                }}
                className={`relative inline-flex h-4 w-8 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  (selectedField.options as any)?.defaultValue
                    ? "bg-[#3b5e82] dark:bg-[#d4af37]"
                    : "bg-[#0d2137]/10 dark:bg-white/10"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block size-3 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    (selectedField.options as any)?.defaultValue ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-[8px] font-serif text-[#0d2137]/50 dark:text-white/40 uppercase">
                Active State Label
              </label>
              <input
                type="text"
                defaultValue={(selectedField.options as any)?.activeLabel || "Yes"}
                onBlur={(e) => {
                  updateLocal(selectedField.id, {
                    options: { ...((selectedField.options as any) || {}), activeLabel: e.target.value || "Yes" },
                  });
                }}
                className="w-full bg-[#faf8f5] dark:bg-[#2c2c2e]/60 border border-[#0d2137]/15 dark:border-white/10 p-2 text-xs text-[#0d2137] dark:text-white focus:outline-none rounded font-serif"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[8px] font-serif text-[#0d2137]/50 dark:text-white/40 uppercase">
                Inactive State Label
              </label>
              <input
                type="text"
                defaultValue={(selectedField.options as any)?.inactiveLabel || "No"}
                onBlur={(e) => {
                  updateLocal(selectedField.id, {
                    options: {
                      ...((selectedField.options as any) || {}),
                      inactiveLabel: e.target.value || "No",
                    },
                  });
                }}
                className="w-full bg-[#faf8f5] dark:bg-[#2c2c2e]/60 border border-[#0d2137]/15 dark:border-white/10 p-2 text-xs text-[#0d2137] dark:text-white focus:outline-none rounded font-serif"
              />
            </div>
          </div>
        )}
      </div>

      {/* Delete button wrapper */}
      <div className="p-6 border-t border-[#0d2137]/10 dark:border-white/10 bg-[#faf8f5]/30">
        <button
          onClick={handleDeleteField}
          className="w-full flex items-center justify-center gap-2 p-2.5 border border-red-500/25 hover:border-red-500/50 bg-red-500/5 hover:bg-red-500/10 text-red-600 dark:text-red-400 rounded text-xs font-serif font-bold uppercase tracking-wider transition-colors cursor-pointer"
        >
          <Trash2 className="size-4" />
          <span>Delete Field</span>
        </button>
      </div>
    </aside>
  );
}
