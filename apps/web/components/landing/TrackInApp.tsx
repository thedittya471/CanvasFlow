"use client";

import React from "react";
import Image from "next/image";

/**
 * "Track every submission" section — Daylight's "Track it all in the app" twin.
 *  - Cream background, centered serif headline
 *  - A right-hand "phone" mockup that hosts a tiny live-dashboard preview
 *  - Bottom area is intentionally airy (paper-like), like the reference
 */
export function TrackInApp() {
  return (
    <section
      className="relative bg-[color:var(--cf-cream)] text-[color:var(--cf-ink)]"
    >
      <div className="relative mx-auto w-full max-w-[1320px] px-0 border-t border-[color:var(--cf-line)]">
        <div className="grid grid-cols-3 gap-0">
          {/* left: empty paper column */}
          <div className="aspect-[4/3] border-r border-[color:var(--cf-line)]" />

          {/* center: text */}
          <div className="aspect-[4/3] border-r border-[color:var(--cf-line)] flex flex-col items-center justify-center text-center px-8">
            <p className="cf-eyebrow text-[color:var(--cf-ink-soft)]">Control</p>
            <h2 className="mt-5 cf-display text-[36px] sm:text-[46px] leading-[1.04]">
              Track it all in the
              <span className="block">CanvasFlow app</span>
            </h2>
          </div>

          {/* right: phone */}
          <div className="relative aspect-[4/3] overflow-hidden bg-[#d8c4a4]">
            <Image
              src="/asset5.png"
              alt=""
              fill
              sizes="(min-width: 1024px) 33vw, 100vw"
              className="object-cover"
            />
            <PhoneMockup />
          </div>
        </div>

        {/* a quieter under-row to keep the airy paper feel */}
        <div className="grid grid-cols-3 gap-0 border-t border-[color:var(--cf-line)]">
          <div className="aspect-[5/2] border-r border-[color:var(--cf-line)]" />
          <div className="aspect-[5/2] border-r border-[color:var(--cf-line)]" />
          <div className="aspect-[5/2]" />
        </div>
      </div>
    </section>
  );
}

function PhoneMockup() {
  return (
    <div className="absolute right-6 sm:right-10 bottom-[-30%] w-[58%] aspect-[9/19]">
      <div className="relative w-full h-full rounded-[34px] bg-black p-2 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)] ring-1 ring-black/40">
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-b-2xl z-10" />
        <div className="w-full h-full rounded-[26px] overflow-hidden bg-[color:var(--cf-cream)]">
          {/* tiny dashboard */}
          <div className="h-full w-full p-3 text-[color:var(--cf-ink)]">
            <p className="text-[9px] font-mono opacity-60 mt-3">Good Morning</p>
            <p className="cf-display text-[12px] leading-tight mt-1">
              Your form is now <span className="text-[color:var(--cf-orange)]">100%</span> live.
              Submissions are streaming in.
            </p>
            <div className="mt-3 rounded-md bg-white ring-1 ring-black/5 p-2">
              <p className="text-[8px] opacity-60 font-mono">Responses</p>
              <p className="text-[14px] cf-display">2,418</p>
              <div className="mt-1.5 flex items-end gap-0.5 h-7">
                {[22, 30, 26, 38, 42, 50, 36, 44, 32].map((h, i) => (
                  <span
                    key={i}
                    className="flex-1 rounded-sm bg-[color:var(--cf-orange)]/80"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
            <div className="mt-2 rounded-md bg-white ring-1 ring-black/5 p-2">
              <p className="text-[8px] opacity-60 font-mono">Conversion</p>
              <p className="text-[12px] cf-display">92%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
