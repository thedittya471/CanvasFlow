"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

/**
 * Daylight-style floating navigation:
 *   - Centered white pill, 8px radius, soft shadow + 1px hairline ring
 *   - Plain text links (no underline / no chips)
 *   - Single flat solid-orange "Get started" CTA on the right
 */
export function LandingNavSunset({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <header className="fixed top-4 inset-x-0 z-50 flex justify-center px-4">
      <nav
        aria-label="Primary"
        className="flex items-center gap-10 bg-white rounded-lg pl-5 pr-1.5 py-1.5 shadow-[0_10px_30px_-12px_rgba(22,19,17,0.18)] ring-1 ring-[color:var(--cf-line-strong)]"
      >
        <Link href="/" className="flex items-center gap-2.5" aria-label="Home">
          <Image
            src="/logo-removebg-preview.png"
            alt=""
            width={22}
            height={22}
            className="object-contain"
          />
          <span className="cf-display text-[19px] leading-none text-[color:var(--cf-ink)]">
            CanvasFlow
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {[
            { label: "Product", href: "#how-it-works" },
            { label: "Story", href: "#story" },
            { label: "About", href: "#about" },
            { label: "Brand", href: "#brand" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-[14px] text-[color:var(--cf-ink)] hover:opacity-70 transition-opacity"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <Link
          href={isLoggedIn ? "/dashboard" : "/signUp"}
          className="inline-flex items-center justify-center h-[42px] px-6 bg-[color:var(--cf-orange)] hover:bg-[color:var(--cf-orange-hover)] text-white rounded-[6px] text-[14px] font-medium tracking-tight transition-colors"
        >
          {isLoggedIn ? "Dashboard" : "Get started"}
        </Link>
      </nav>
    </header>
  );
}
