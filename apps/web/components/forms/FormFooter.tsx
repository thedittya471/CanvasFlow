"use client";

import React from "react";

export function FormFooter() {
  return (
    <footer className="w-full max-w-5xl z-10 flex flex-col md:flex-row justify-between items-center gap-3 text-[9px] font-serif uppercase tracking-widest text-[#0d2137]/45 dark:text-white/40 text-center md:text-left">
      <div>© 2024 CANVASFLOW FORMS ARCHITECTURAL STUDIO</div>
      <div className="flex gap-4">
        <span className="hover:underline cursor-pointer">PRIVACY PARCHMENT</span>
        <span className="hover:underline cursor-pointer">TERMS OF DRAFT</span>
      </div>
    </footer>
  );
}
