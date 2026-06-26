"use client";

import React from "react";

interface UnsavedDialogProps {
  show: boolean;
  onCancel: () => void;
  onDiscard: () => void;
  onSaveAndLeave: () => Promise<void>;
}

export function UnsavedDialog({ show, onCancel, onDiscard, onSaveAndLeave }: UnsavedDialogProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-[#0d2137]/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#1c1c1e] border-2 border-[#0d2137] dark:border-[#2a2a2a] p-8 rounded shadow-[6px_6px_0px_0px_#0d2137] dark:shadow-[6px_6px_0px_0px_#2a2a2a] max-w-sm w-full mx-4 space-y-4">
        <div>
          <h3 className="text-xl font-serif font-bold text-[#0d2137] dark:text-white">Unsaved Changes</h3>
          <p className="text-sm text-[#0d2137]/70 dark:text-white/60 font-serif mt-1">
            You have unsaved changes. Save before leaving or discard them?
          </p>
        </div>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-xs font-serif font-bold uppercase tracking-wider border-2 border-[#0d2137]/25 dark:border-white/25 rounded text-[#0d2137]/70 dark:text-white/70 hover:bg-[#0d2137]/5 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onDiscard}
            className="px-4 py-2 text-xs font-serif font-bold uppercase tracking-wider border-2 border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-500/5 rounded cursor-pointer"
          >
            Discard
          </button>
          <button
            onClick={onSaveAndLeave}
            className="px-4 py-2 text-xs font-serif font-bold uppercase tracking-wider bg-[#0d2137] dark:bg-[#b9c9df] text-white dark:text-[#0d2137] rounded cursor-pointer"
          >
            Save &amp; Leave
          </button>
        </div>
      </div>
    </div>
  );
}
