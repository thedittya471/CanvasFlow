"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "What is an architectural node canvas?",
    a: "Instead of traditional linear form builders, CanvasFlow uses a drag-and-drop workspace layout. Form fields are treated as interactive components mapped on a structural layout, giving you full control over design layout positioning.",
  },
  {
    q: "Are the label keys truly immutable?",
    a: "Yes. When a field is renamed for the first time by the creator, the system generates a unique slugified identifier. This label key is locked permanently, ensuring submission payloads don't break if you adjust client labels later.",
  },
  {
    q: "Is there a limit on how many forms I can create?",
    a: "On the Free tier, you can create up to 5 forms per month and receive up to 100 submissions per month. Our Pro, Pro+, and Business plan limits will scale further soon.",
  },
];

export function FaqSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <section className="bg-[#f3ebd8]/20 border-t border-[#0d2137]/15 py-20 px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-2xl font-serif font-bold text-[#0d2137]">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-[#0d2137]/65">
            Got questions? We have compiled explanations about the architectural canvas builder.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="bg-[#faf8f5] border-2 border-[#0d2137] rounded-lg overflow-hidden transition-all duration-300 shadow-[2px_2px_0px_0px_#8e6e53]"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left font-serif font-bold text-sm text-[#0d2137] hover:bg-[#f3ebd8]/20 transition-colors focus:outline-none cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`size-4 text-[#8e6e53] transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 border-t border-[#0d2137]/10 text-xs text-[#0d2137]/80 leading-relaxed font-sans">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
