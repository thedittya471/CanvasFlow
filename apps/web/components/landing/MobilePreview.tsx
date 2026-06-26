"use client";

import React from "react";
import { Smartphone } from "lucide-react";

export function MobilePreview() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center border-t border-[#0d2137]/10">
      <div className="lg:col-span-5 space-y-6 text-left">
        <div className="inline-flex items-center gap-2 p-1.5 bg-[#f3ebd8] border border-[#0d2137]/15 rounded text-[10px] font-sans font-bold uppercase tracking-wider">
          <Smartphone className="size-3.5 text-[#8e6e53]" />
          <span>Responsive Blueprints</span>
        </div>
        <h2 className="text-3xl font-serif font-bold text-[#0d2137] tracking-tight">
          Perfect Client Rendering
        </h2>
        <p className="text-xs text-[#0d2137]/75 font-sans leading-relaxed">
          Every structural draft designed in the editor translates into a clean, mobile-responsive
          layout for your clients. We build form controls that align with modern web access standards
          automatically.
        </p>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded bg-[#f3ebd8] border border-[#0d2137] flex items-center justify-center font-bold text-[10px] text-[#0d2137] shrink-0">
              ✓
            </div>
            <p className="text-xs text-[#0d2137]/80 font-sans">
              <strong className="font-serif">Adaptive Layouts</strong>: Fully responsive grids
              fitting mobile, tablet, and desktop viewports.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded bg-[#f3ebd8] border border-[#0d2137] flex items-center justify-center font-bold text-[10px] text-[#0d2137] shrink-0">
              ✓
            </div>
            <p className="text-xs text-[#0d2137]/80 font-sans">
              <strong className="font-serif">Semantic HTML</strong>: Built in compliance with
              accessibility guidelines and form validations.
            </p>
          </div>
        </div>
      </div>

      {/* Mock Device Container */}
      <div className="lg:col-span-7 flex justify-center">
        <div className="w-[300px] h-[500px] bg-[#faf8f5] border-4 border-[#0d2137] rounded-[36px] shadow-[8px_8px_0px_0px_#8e6e53] overflow-hidden p-6 relative flex flex-col justify-between">
          <div className="w-20 h-4 bg-[#0d2137] rounded-full mx-auto mb-4" />

          <div className="flex-1 space-y-5 text-left pt-4">
            <div className="space-y-1">
              <h4 className="font-serif font-bold text-lg text-[#0d2137]">Anime Fan Survey</h4>
              <p className="text-[10px] text-[#0d2137]/60 font-sans">
                Please fill out the layout draft below.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#0d2137] font-serif uppercase tracking-wider">
                  Your Name
                </label>
                <input
                  type="text"
                  placeholder="Type name here..."
                  className="w-full bg-[#f3ebd8]/20 border border-[#0d2137]/25 p-2 text-xs rounded focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#0d2137] font-serif uppercase tracking-wider">
                  Fav Genre
                </label>
                <div className="space-y-1">
                  <label className="flex items-center gap-2 text-xs text-[#0d2137]/80 bg-[#f3ebd8]/40 border border-[#0d2137]/15 p-2 rounded cursor-pointer">
                    <input type="radio" name="mock-r" className="accent-[#0d2137]" /> Action
                  </label>
                  <label className="flex items-center gap-2 text-xs text-[#0d2137]/80 bg-[#f3ebd8]/40 border border-[#0d2137]/15 p-2 rounded cursor-pointer">
                    <input type="radio" name="mock-r" className="accent-[#0d2137]" /> Adventure
                  </label>
                </div>
              </div>
            </div>
          </div>

          <button className="w-full bg-[#0d2137] text-[#faf7f0] border-2 border-[#0d2137] py-3 rounded font-serif font-bold uppercase tracking-wider text-xs shadow-[4px_4px_0px_0px_#8e6e53] hover:shadow-[1px_1px_0px_0px_#8e6e53] hover:translate-x-0.5 hover:translate-y-0.5 transition-all">
            Submit Survey
          </button>
        </div>
      </div>
    </section>
  );
}
