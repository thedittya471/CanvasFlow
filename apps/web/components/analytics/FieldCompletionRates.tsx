"use client";

import React from "react";

interface FieldRate { fieldId: string; fieldLabel: string; rate: number; }

interface FieldCompletionRatesProps {
  fieldCompletionRates: FieldRate[];
}

export function FieldCompletionRates({ fieldCompletionRates }: FieldCompletionRatesProps) {
  if (fieldCompletionRates.length === 0) {
    return null;
  }

  return (
    <div className="relative overflow-hidden bg-white border-2 border-[#0d2137] p-5 rounded shadow-[3px_3px_0px_0px_#0d2137]">
      <div className="absolute inset-0 bg-cover bg-center mix-blend-multiply opacity-80 pointer-events-none select-none"
        style={{ backgroundImage: "url('/assest1.png')"}} />
      <div className="relative z-10 space-y-4">
        <div className="space-y-0.5">
          <h4 className="text-sm font-serif font-bold text-[#0d2137] uppercase tracking-wider">
            Field Completion
          </h4>
          <p className="text-[9px] font-serif text-[#0d2137]/45 italic">
            Of all visitors who opened the form, % who answered each field
          </p>
        </div>
        <div className="space-y-3">
          {fieldCompletionRates.map(field => (
            <div key={field.fieldId} className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-serif text-[#0d2137] truncate pr-3 font-medium">
                  {field.fieldLabel}
                </span>
                <span className="text-[10px] font-serif font-bold tabular-nums shrink-0"
                  style={{ color: field.rate >= 80 ? ("#16a34a") : field.rate >= 50 ? ("#8e6e53") : ("#dc2626") }}>
                  {field.rate}%
                </span>
              </div>
              <div className="h-1.5 bg-[#0d2137]/8 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${field.rate}%`,
                    background: field.rate >= 80
                      ? ("#16a34a")
                      : field.rate >= 50
                      ? ("#8e6e53")
                      : ("#dc2626"),
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
