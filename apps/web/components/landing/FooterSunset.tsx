"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

/**
 * Daylight-style footer:
 *  - Cream paper background
 *  - Big bracket-style link list across the top
 *  - Logo + huge serif "More Forms" wordmark
 *  - Social row on the right
 */
const LINKS = [
  { label: "Blog", href: "#" },
  { label: "Brand Kit", href: "#brand" },
  { label: "Careers", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Support", href: "#" },
];

const SOCIAL = [
  { label: "X", href: "#" },
  { label: "Linkedin", href: "#" },
  { label: "Instagram", href: "#" },
];

export function FooterSunset() {
  return (
    <footer className="bg-[color:var(--cf-cream)] text-[color:var(--cf-ink)] border-t border-[color:var(--cf-line)]">
      <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 md:px-8 pt-16 pb-10">
        <div className="flex flex-col gap-12">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10">
            <div className="flex items-center gap-3">
              <Image
                src="/logo-removebg-preview.png"
                alt="CanvasFlow"
                width={36}
                height={36}
                className="object-contain"
              />
              <span className="cf-display text-[26px] leading-none">
                CanvasFlow
              </span>
            </div>

            <ul className="flex flex-wrap gap-x-7 gap-y-3 text-[14px]">
              {LINKS.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-[color:var(--cf-ink)] hover:text-[color:var(--cf-orange)] transition-colors"
                  >
                    <span className="text-[color:var(--cf-ink-soft)]">[</span>{" "}
                    {l.label}{" "}
                    <span className="text-[color:var(--cf-ink-soft)]">]</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-end justify-between gap-6">
            <h2 className="cf-display text-[80px] sm:text-[140px] md:text-[180px] leading-[0.85] text-[color:var(--cf-ink)]">
              More Forms
            </h2>
            <ul className="flex items-center gap-5 pb-6 text-[13px]">
              {SOCIAL.map((s) => (
                <li key={s.label}>
                  <Link
                    href={s.href}
                    aria-label={s.label}
                    className="text-[color:var(--cf-ink-soft)] hover:text-[color:var(--cf-ink)] transition-colors"
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-[12px] text-[color:var(--cf-ink-soft)]/70 border-t border-[color:var(--cf-line)] pt-6">
            &copy; 2026 CanvasFlow Studio. Built for makers of beautiful data.
          </p>
        </div>
      </div>
    </footer>
  );
}
