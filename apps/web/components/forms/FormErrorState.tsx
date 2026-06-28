"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface FormErrorStateProps {
  type: "not-found" | "draft-mode";
}

export function FormErrorState({ type }: FormErrorStateProps) {
  const config =
    type === "draft-mode"
      ? {
          eyebrow: "Not live",
          title: "This form is still a draft",
          body: "The author hasn't published it yet, so it isn't accepting responses.",
        }
      : {
          eyebrow: "Not found",
          title: "We can't find this form",
          body: "The form may have been deleted, or the link is incorrect. Double-check the URL.",
        };

  return (
    <div className="cf-landing min-h-screen w-full flex items-center justify-center bg-[color:var(--cf-cream)] p-6">
      <div className="w-full max-w-sm bg-[color:var(--cf-cream-2)] rounded-2xl ring-1 ring-[color:var(--cf-line)] p-8 text-center space-y-4">
        <p className="cf-eyebrow text-[color:var(--cf-orange)]">
          {config.eyebrow}
        </p>
        <h2 className="cf-display text-[24px] leading-tight text-[color:var(--cf-ink)]">
          {config.title}
        </h2>
        <p className="text-[13.5px] text-[color:var(--cf-ink-soft)] leading-relaxed">
          {config.body}
        </p>
        <Link
          href="/"
          className="group inline-flex items-center gap-1.5 h-[40px] px-5 rounded-full bg-[color:var(--cf-orange)] hover:bg-[color:var(--cf-orange-hover)] text-white text-[13px] font-medium tracking-tight transition-colors"
        >
          Visit CanvasFlow
          <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </div>
  );
}
