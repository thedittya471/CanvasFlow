"use client";

import React from "react";

export function PhilosophySection() {
  return (
    <section className="max-w-4xl mx-auto px-6 py-24 text-center space-y-6">
      <div className="text-sm font-sans font-bold uppercase tracking-widest text-[#8e6e53]">
        The Philosophy of Data Design
      </div>
      <blockquote className="font-serif italic text-2xl md:text-3xl text-[#0d2137] leading-relaxed">
        &ldquo;Form building is not about stacking fields. It is about sketching the schema that
        routes digital experiences. Every layout is a blueprint, every field an ink line.&rdquo;
      </blockquote>
      <div className="w-12 h-1 bg-[#8e6e53] mx-auto rounded" />
    </section>
  );
}
