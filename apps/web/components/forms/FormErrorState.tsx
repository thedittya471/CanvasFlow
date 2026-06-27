"use client";

import React from "react";

interface FormErrorStateProps {
  type: "blueprint-mismatch" | "draft-mode";
}

export function FormErrorState({ type }: FormErrorStateProps) {
  if (type === "draft-mode") {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#faf7f0] p-6 transition-colors duration-300 font-sans">
        <div className="max-w-md w-full bg-white border-2 border-amber-500/20 p-8 rounded-lg shadow-[4px_4px_0px_0px_rgba(245,158,11,0.1)] text-center space-y-4">
          <h2 className="text-xl font-serif font-bold text-amber-600">Draft Mode</h2>
          <p className="text-xs text-[#0d2137]/60 font-serif leading-relaxed">
            This form is currently a draft and has not been commissioned for public submission yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#faf7f0] p-6 transition-colors duration-300">
      <div className="max-w-md w-full bg-white border-2 border-red-500/20 p-8 rounded-lg shadow-[4px_4px_0px_0px_rgba(239,68,68,0.1)] text-center space-y-4">
        <h2 className="text-xl font-serif font-bold text-red-600">Blueprint Mismatch</h2>
        <p className="text-xs text-[#0d2137]/60 font-serif leading-relaxed">
          The requested form cannot be located or is not currently open for responses.
        </p>
      </div>
    </div>
  );
}
