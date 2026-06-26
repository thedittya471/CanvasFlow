"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, Save, Eye, Share2, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface BuilderHeaderProps {
  form: { title: string; description?: string | null; isPublished: boolean } | null | undefined;
  formId: string;
  isDirty: boolean;
  isSaving: boolean;
  publishPending: boolean;
  handleSave: () => Promise<void>;
  setShowDeleteConfirm: (val: boolean) => void;
  publishForm: (args: { id: string }, callbacks: { onSuccess: () => void; onError: (err: any) => void }) => void;
  pendingNavRef: React.MutableRefObject<string | null>;
  setShowUnsavedDialog: (val: boolean) => void;
}

export function BuilderHeader({
  form,
  formId,
  isDirty,
  isSaving,
  publishPending,
  handleSave,
  setShowDeleteConfirm,
  publishForm,
  pendingNavRef,
  setShowUnsavedDialog,
}: BuilderHeaderProps) {
  return (
    <header className="h-16 px-6 border-b border-[#0d2137]/15 dark:border-white/10 flex items-center justify-between bg-white dark:bg-[#1c1c1e] z-10">
      {/* Left Actions */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/sketches"
          onClick={(e) => {
            if (isDirty) {
              e.preventDefault();
              pendingNavRef.current = "/dashboard/sketches";
              setShowUnsavedDialog(true);
            }
          }}
          className="flex items-center gap-1 text-xs font-serif font-bold uppercase tracking-wider text-[#0d2137]/65 dark:text-white/65 hover:text-[#0d2137] dark:hover:text-white transition-colors cursor-pointer pr-3 border-r border-[#0d2137]/15 dark:border-white/10"
        >
          <ChevronLeft className="size-4" />
          <span>Catalog</span>
        </Link>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-serif font-bold text-[#0d2137] dark:text-white leading-none">
              {form?.title}
            </h1>
            <span className="text-[9px] font-serif uppercase tracking-widest font-bold px-2 py-0.5 border border-[#0d2137]/20 dark:border-white/20 text-[#0d2137]/60 dark:text-white/60 rounded">
              {form?.isPublished ? "Commissioned" : "Drafting"}
            </span>
          </div>
          {form?.description && (
            <p className="text-[10px] text-[#0d2137]/50 dark:text-white/40 font-serif italic line-clamp-1 mt-0.5">
              {form.description}
            </p>
          )}
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {isDirty && (
          <span className="text-[10px] font-serif text-[#8e6e53] dark:text-[#d4af37] font-bold uppercase tracking-widest animate-pulse">
            Unsaved changes
          </span>
        )}

        <button
          onClick={handleSave}
          disabled={!isDirty || isSaving}
          className="flex items-center gap-1.5 bg-[#faf7f0]/50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 text-[#0d2137] dark:text-white border border-[#0d2137]/20 dark:border-white/15 py-1.5 px-3 text-[10px] uppercase font-serif font-bold tracking-wider rounded transition-all cursor-pointer disabled:opacity-40"
        >
          <Save className="size-3.5" />
          <span>{isSaving ? "Saving..." : "Save"}</span>
        </button>

        <button className="flex items-center gap-1.5 bg-[#faf7f0]/50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 text-[#0d2137] dark:text-white border border-[#0d2137]/20 dark:border-white/15 py-1.5 px-3 text-[10px] uppercase font-serif font-bold tracking-wider rounded transition-all cursor-pointer">
          <Eye className="size-3.5" />
          <span>Preview</span>
        </button>

        <button
          onClick={() => {
            const url = `${window.location.origin}/forms/${formId}`;
            navigator.clipboard.writeText(url);
            toast.success("Share link copied to clipboard!");
          }}
          className="flex items-center gap-1.5 bg-[#faf7f0]/50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 text-[#0d2137] dark:text-white border border-[#0d2137]/20 dark:border-white/15 py-1.5 px-3 text-[10px] uppercase font-serif font-bold tracking-wider rounded transition-all cursor-pointer"
        >
          <Share2 className="size-3.5" />
          <span>Share</span>
        </button>

        <button
          onClick={() => setShowDeleteConfirm(true)}
          title="Delete this blueprint"
          className="flex items-center gap-1.5 border border-red-500/30 hover:border-red-500/60 bg-red-500/5 hover:bg-red-500/10 text-red-600 dark:text-red-400 py-1.5 px-3 text-[10px] uppercase font-serif font-bold tracking-wider rounded transition-all cursor-pointer"
        >
          <Trash2 className="size-3.5" />
          <span>Delete</span>
        </button>

        <button
          onClick={async () => {
            if (isDirty) await handleSave();
            publishForm(
              { id: formId },
              {
                onSuccess: () => toast.success("Form published successfully"),
                onError: (err) => toast.error(err.message || "Failed to publish form"),
              }
            );
          }}
          disabled={publishPending}
          className="bg-[#0d2137] dark:bg-[#b9c9df] hover:bg-[#1a3854] dark:hover:bg-[#ccdcf2] text-white dark:text-[#0d2137] border border-[#0d2137] dark:border-[#b9c9df] py-1.5 px-4 text-[10px] uppercase font-serif font-bold tracking-widest rounded transition-all cursor-pointer disabled:opacity-50"
        >
          {publishPending ? "Publishing..." : "Publish"}
        </button>
      </div>
    </header>
  );
}
