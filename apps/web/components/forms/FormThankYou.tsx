"use client";

import React from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";

interface FormThankYouProps {
  siteRating: number | null;
  setSiteRating: (rating: number) => void;
}

export function FormThankYou({ siteRating, setSiteRating }: FormThankYouProps) {
  return (
    <div className="max-w-xl w-full border border-white/30 p-12 md:p-14 rounded-lg bg-white/45 backdrop-blur-xl shadow-[0px_10px_35px_rgba(13,33,55,0.06)] text-center space-y-6 animate-card -translate-y-14">
      <div className="mx-auto size-20 bg-green-500/10 text-green-600 border border-green-500/20 rounded-full flex items-center justify-center animate-pop">
        <svg className="size-10" viewBox="0 0 52 52" fill="none">
          <circle
            className="check-circle-anim"
            cx="26"
            cy="26"
            r="23"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            className="check-mark-anim"
            d="M16 26l7 7 13-13"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="space-y-3">
        <h2
          className="text-3xl font-bold text-[#0d2137] tracking-wide"
          style={{ fontFamily: "var(--font-garamond)" }}
        >
          Thank You
        </h2>
        <p
          className="text-lg text-[#0d2137]/65 leading-relaxed italic max-w-sm mx-auto"
          style={{ fontFamily: "var(--font-caveat)" }}
        >
          Your response has been submitted and stored in the catalog.
        </p>
      </div>

      {/* Interactive Rating Section */}
      <div className="space-y-3 pt-6 border-t border-[#0d2137]/10">
        <span className="text-[10px] uppercase tracking-widest font-serif font-bold text-[#0d2137]/60 block">
          {siteRating ? "Thank you for your rating!" : "Rate your experience on our site"}
        </span>
        <div className="flex items-center justify-center gap-2">
          {[1, 2, 3, 4, 5].map((score) => {
            const isStarred = siteRating !== null && siteRating >= score;
            return (
              <button
                key={score}
                type="button"
                onClick={() => {
                  setSiteRating(score);
                  toast.success("Thank you for your feedback!");
                }}
                className="text-[#0d2137] hover:scale-110 transition-transform cursor-pointer"
              >
                <Star
                  className={`size-6 ${
                    isStarred
                      ? "text-[#8e6e53] fill-[#8e6e53]"
                      : "opacity-25"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Account Creation Call To Action */}
      <div className="space-y-4 pt-6 border-t border-[#0d2137]/10">
        <div className="space-y-1">
          <h4 className="text-xs uppercase tracking-widest font-serif font-bold text-[#0d2137]">
            Design Your Own CanvasFlow Forms
          </h4>
          <p
            className="text-sm text-[#0d2137]/55 italic"
            style={{ fontFamily: "var(--font-caveat)" }}
          >
            If you enjoyed this form builder style, sign up to start drafting today!
          </p>
        </div>
        <a
          href="/signUp"
          className="inline-block bg-[#0d2137] hover:bg-[#1a3854] text-white py-3 px-8 text-[9px] uppercase font-bold tracking-widest transition-all shadow-[0_4px_12px_rgba(13,33,55,0.15)] rounded-none animate-pop"
          style={{ fontFamily: "var(--font-garamond)" }}
        >
          Create a Free Account
        </a>
      </div>
    </div>
  );
}
