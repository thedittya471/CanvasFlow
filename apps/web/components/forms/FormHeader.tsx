"use client";

import React from "react";

const DraftingCompass = () => (
  <svg
    className="size-6 text-[#0d2137] transition-colors"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.2"
  >
    <path d="M12 3v3M9 8.5L5 21M15 8.5L19 21M9 14h6M12 6a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
  </svg>
);

interface FormHeaderProps {
  progressPercent: number;
  submitted: boolean;
  formCode: string;
}

export function FormHeader({ progressPercent, submitted, formCode }: FormHeaderProps) {
  return (
    <header className="w-full max-w-6xl flex justify-between items-start z-10 text-[10px] tracking-[0.25em] font-serif uppercase font-bold text-[#0d2137]/45">
      <div className="pt-2 flex flex-col gap-1.5">
        <div>SURVEY PROGRESS: {submitted ? "100" : progressPercent}%</div>
        <div className="w-24 h-0.5 bg-[#0d2137]/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#0d2137]/40 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${submitted ? 100 : progressPercent}%` }}
          />
        </div>
      </div>

      <div className="flex flex-col items-center gap-1.5 text-right">
        <div>{formCode}</div>
        <div className="pt-2 flex flex-col items-center">
          <DraftingCompass />
          <span className="text-[7px] tracking-[0.2em] font-serif uppercase font-bold text-[#0d2137]/50 mt-1.5">
            CANVASFLOW FORMS
          </span>
        </div>
      </div>
    </header>
  );
}
