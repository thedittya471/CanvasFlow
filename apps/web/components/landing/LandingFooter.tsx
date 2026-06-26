"use client";

import React from "react";
import Image from "next/image";

export function LandingFooter() {
  return (
    <footer className="border-t border-[#0d2137]/15 py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <Image
            src="/logo-removebg-preview.png"
            alt="CanvasFlow Logo"
            width={40}
            height={40}
            className="rounded-lg object-contain shadow-[2px_2px_0px_0px_#8e6e53]"
          />
          <span className="font-serif font-bold text-sm text-[#0d2137]">CanvasFlow</span>
        </div>
        <p className="text-[10px] text-[#0d2137]/50 font-sans">
          &copy; 2026 CanvasFlow Studio. Built for architects of digital data.
        </p>
      </div>
    </footer>
  );
}
