"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, Save, Eye, Share2, Trash2, CheckCircle2, Circle } from "lucide-react";
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
  onPublishSuccess?: () => void;
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
  onPublishSuccess,
}: BuilderHeaderProps) {
  const isPublished = form?.isPublished ?? false;

  return (
    <header className="h-14 px-4 border-b border-[#0d2137]/12 dark:border-white/8 flex items-center justify-between bg-white/95 dark:bg-[#141416]/95 backdrop-blur-sm z-20 shrink-0">
      {/* Left: back + title */}
      <div className="flex items-center gap-3 min-w-0">
        <Link
          href="/dashboard/sketches"
          onClick={(e) => {
            if (isDirty) {
              e.preventDefault();
              pendingNavRef.current = "/dashboard/sketches";
              setShowUnsavedDialog(true);
            }
          }}
          className="flex items-center gap-1 text-[10px] font-serif font-bold uppercase tracking-wider text-[#0d2137]/50 dark:text-white/50 hover:text-[#0d2137] dark:hover:text-white transition-colors shrink-0"
        >
          <ChevronLeft className="size-3.5" />
          <span>Catalog</span>
        </Link>

        <div className="w-px h-4 bg-[#0d2137]/15 dark:bg-white/10" />

        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm font-serif font-bold text-[#0d2137] dark:text-white truncate max-w-[200px]">
            {form?.title}
          </span>
          <span className={`shrink-0 inline-flex items-center gap-1 text-[9px] font-serif font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full ${
            isPublished
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
              : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
          }`}>
            {isPublished
              ? <><CheckCircle2 className="size-2.5" />Live</>
              : <><Circle className="size-2.5" />Draft</>
            }
          </span>
        </div>

        {isDirty && (
          <span className="hidden sm:inline-flex shrink-0 text-[9px] font-serif font-bold uppercase tracking-widest text-[#8e6e53] dark:text-[#d4af37] bg-[#d4af37]/8 border border-[#d4af37]/20 px-2 py-0.5 rounded-full">
            Unsaved
          </span>
        )}
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* Save */}
        <button
          onClick={handleSave}
          disabled={!isDirty || isSaving}
          title="Save changes"
          className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-serif font-bold uppercase tracking-wider rounded border border-[#0d2137]/15 dark:border-white/10 text-[#0d2137]/70 dark:text-white/70 hover:bg-[#faf7f0] dark:hover:bg-white/5 disabled:opacity-35 transition-all cursor-pointer disabled:cursor-not-allowed"
        >
          <Save className="size-3.5" />
          <span className="hidden sm:inline">{isSaving ? "Saving…" : "Save"}</span>
        </button>

        {/* Preview */}
        <Link
          href={`/forms/${formId}`}
          target="_blank"
          title="Preview form"
          className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-serif font-bold uppercase tracking-wider rounded border border-[#0d2137]/15 dark:border-white/10 text-[#0d2137]/70 dark:text-white/70 hover:bg-[#faf7f0] dark:hover:bg-white/5 transition-all cursor-pointer"
        >
          <Eye className="size-3.5" />
          <span className="hidden sm:inline">Preview</span>
        </Link>

        {/* Share */}
        <button
          onClick={() => {
            const url = `${window.location.origin}/forms/${formId}`;
            navigator.clipboard.writeText(url);
            toast.success("Link copied to clipboard");
          }}
          title="Copy share link"
          className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-serif font-bold uppercase tracking-wider rounded border border-[#0d2137]/15 dark:border-white/10 text-[#0d2137]/70 dark:text-white/70 hover:bg-[#faf7f0] dark:hover:bg-white/5 transition-all cursor-pointer"
        >
          <Share2 className="size-3.5" />
          <span className="hidden sm:inline">Share</span>
        </button>

        <div className="w-px h-5 bg-[#0d2137]/12 dark:bg-white/8 mx-0.5" />

        {/* Delete */}
        <button
          onClick={() => setShowDeleteConfirm(true)}
          title="Delete blueprint"
          className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-serif font-bold uppercase tracking-wider rounded border border-red-400/20 dark:border-red-500/20 text-red-500/70 dark:text-red-400/70 hover:bg-red-50 dark:hover:bg-red-500/8 hover:text-red-600 dark:hover:text-red-400 hover:border-red-400/40 transition-all cursor-pointer"
        >
          <Trash2 className="size-3.5" />
          <span className="hidden sm:inline">Delete</span>
        </button>

        {/* Publish */}
        <button
          onClick={async () => {
            if (isDirty) await handleSave();
            publishForm(
              { id: formId },
              {
                onSuccess: () => {
                  toast.success("Form published successfully");
                  onPublishSuccess?.();
                },
                onError: (err) => toast.error(err.message || "Failed to publish"),
              }
            );
          }}
          disabled={publishPending || isPublished}
          className="flex items-center gap-1.5 px-4 py-1.5 text-[10px] font-serif font-bold uppercase tracking-widest rounded bg-[#0d2137] dark:bg-[#b9c9df] hover:bg-[#1a3854] dark:hover:bg-[#ccdcf2] text-white dark:text-[#0d2137] border border-[#0d2137] dark:border-[#b9c9df] shadow-[2px_2px_0px_0px_#8e6e53] dark:shadow-[2px_2px_0px_0px_#d4af37] hover:shadow-[1px_1px_0px_0px_#8e6e53] dark:hover:shadow-[1px_1px_0px_0px_#d4af37] hover:translate-x-px hover:translate-y-px disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          {publishPending ? "Publishing…" : isPublished ? "Published" : "Publish"}
        </button>
      </div>
    </header>
  );
}
