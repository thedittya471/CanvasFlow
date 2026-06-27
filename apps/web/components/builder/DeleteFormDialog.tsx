"use client";

import React from "react";
import { Trash2 } from "lucide-react";

interface DeleteFormDialogProps {
  show: boolean;
  formTitle: string;
  deletePending: boolean;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
}

export function DeleteFormDialog({
  show,
  formTitle,
  deletePending,
  onCancel,
  onConfirm,
}: DeleteFormDialogProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-[#0d2137]/50 backdrop-blur-sm">
      <div className="bg-white border-2 border-[#0d2137] p-8 rounded shadow-[6px_6px_0px_0px_#0d2137] max-w-sm w-full mx-4 space-y-4">
        <div className="space-y-1">
          <span className="text-[9px] uppercase tracking-widest font-serif font-bold text-red-500 block">
            — Permanent Action
          </span>
          <h3 className="text-xl font-serif font-bold text-[#0d2137]">Delete Blueprint?</h3>
          <p className="text-sm text-[#0d2137]/70 font-serif leading-relaxed">
            <span className="font-bold text-[#0d2137]">&ldquo;{formTitle}&rdquo;</span> and all
            its fields and submissions will be permanently removed. This cannot be undone.
          </p>
        </div>
        <div className="flex gap-3 justify-end pt-2">
          <button
            onClick={onCancel}
            disabled={deletePending}
            className="px-4 py-2 text-xs font-serif font-bold uppercase tracking-wider border-2 border-[#0d2137]/20 rounded text-[#0d2137]/70 hover:bg-[#0d2137]/5 cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={deletePending}
            className="px-4 py-2 text-xs font-serif font-bold uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white rounded cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
          >
            <Trash2 className="size-3.5" />
            {deletePending ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
