"use client";

import React from "react";
import { Star, Calendar, Clock } from "lucide-react";

interface FormField {
  id: string;
  type: string;
  label: string;
  placeholder?: string | null;
  description?: string | null;
  isRequired: boolean;
  options?: any;
}

interface FormQuestionProps {
  currentField: FormField | undefined;
  currentQuestionIndex: number;
  totalQuestions: number;
  answers: Record<string, any>;
  isPending: boolean;
  handleFieldChange: (fieldId: string, value: any) => void;
  handleNext: () => void;
  handleBack: () => void;
}

export function FormQuestion({
  currentField,
  currentQuestionIndex,
  totalQuestions,
  answers,
  isPending,
  handleFieldChange,
  handleNext,
  handleBack,
}: FormQuestionProps) {
  return (
    <div className="w-full flex flex-col items-center gap-6">
      <div
        key={currentQuestionIndex}
        className="max-w-xl w-full border border-white/35 p-16 rounded-lg bg-white/45 backdrop-blur-2xl shadow-[0px_15px_35px_rgba(13,33,55,0.06)] flex flex-col justify-between min-h-115 animate-card text-center relative -translate-y-14"
      >
        {/* Question Number */}
        <div className="space-y-4 select-none">
          <span
            className="text-lg text-[#0d2137]/60 block mt-2 italic"
            style={{ fontFamily: "var(--font-caveat)" }}
          >
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </span>
          <h2
            className="text-2xl md:text-3xl font-bold text-[#0d2137] leading-snug tracking-wide"
            style={{ fontFamily: "var(--font-garamond)" }}
          >
            {currentField?.label}
          </h2>
        </div>

        {/* Improved Input Area with translucent boxes and shadows */}
        <div className="py-6 flex flex-col justify-center">
          {currentField?.type === "TEXT" && (
            <input
              type="text"
              placeholder={currentField.placeholder || "Type response here..."}
              value={answers[currentField.id] || ""}
              onChange={(e) => handleFieldChange(currentField.id, e.target.value)}
              className="w-full max-w-sm mx-auto text-center bg-white/30 border border-[#0d2137]/15 p-3.5 text-2xl text-[#0d2137] placeholder-[#0d2137]/35 focus:outline-none focus:border-[#0d2137]/45 rounded-md transition-all shadow-sm"
              style={{ fontFamily: "var(--font-caveat)" }}
            />
          )}

          {currentField?.type === "TEXTAREA" && (
            <textarea
              placeholder={currentField.placeholder || "Type response here..."}
              value={answers[currentField.id] || ""}
              onChange={(e) => handleFieldChange(currentField.id, e.target.value)}
              rows={2}
              className="w-full max-w-sm mx-auto text-center bg-white/30 border border-[#0d2137]/15 p-3.5 text-2xl text-[#0d2137] placeholder-[#0d2137]/25 focus:outline-none focus:border-[#0d2137]/45 rounded-md transition-all shadow-sm resize-none"
              style={{ fontFamily: "var(--font-caveat)" }}
            />
          )}

          {currentField?.type === "EMAIL" && (
            <input
              type="email"
              placeholder={currentField.placeholder || "name@domain.com"}
              value={answers[currentField.id] || ""}
              onChange={(e) => handleFieldChange(currentField.id, e.target.value)}
              className="w-full max-w-sm mx-auto text-center bg-white/30 border border-[#0d2137]/15 p-3.5 text-2xl text-[#0d2137] placeholder-[#0d2137]/25 focus:outline-none focus:border-[#0d2137]/45 rounded-md transition-all shadow-sm"
              style={{ fontFamily: "var(--font-caveat)" }}
            />
          )}

          {currentField?.type === "NUMBER" && (
            <input
              type="number"
              placeholder={currentField.placeholder || "0.00"}
              value={answers[currentField.id] || ""}
              onChange={(e) => handleFieldChange(currentField.id, e.target.value)}
              className="w-full max-w-xs mx-auto text-center bg-white/30 border border-[#0d2137]/15 p-3.5 text-2xl text-[#0d2137] placeholder-[#0d2137]/25 focus:outline-none focus:border-[#0d2137]/45 rounded-md transition-all shadow-sm"
              style={{ fontFamily: "var(--font-caveat)" }}
            />
          )}

          {currentField?.type === "PHONE" && (
            <input
              type="tel"
              placeholder={currentField.placeholder || "+1 (555) 000-0000"}
              value={answers[currentField.id] || ""}
              onChange={(e) => handleFieldChange(currentField.id, e.target.value)}
              className="w-full max-w-sm mx-auto text-center bg-white/30 border border-[#0d2137]/15 p-3.5 text-2xl text-[#0d2137] placeholder-[#0d2137]/25 focus:outline-none focus:border-[#0d2137]/45 rounded-md transition-all shadow-sm"
              style={{ fontFamily: "var(--font-caveat)" }}
            />
          )}

          {currentField?.type === "URL" && (
            <input
              type="url"
              placeholder={currentField.placeholder || "https://domain.com"}
              value={answers[currentField.id] || ""}
              onChange={(e) => handleFieldChange(currentField.id, e.target.value)}
              className="w-full max-w-sm mx-auto text-center bg-white/30 border border-[#0d2137]/15 p-3.5 text-2xl text-[#0d2137] placeholder-[#0d2137]/25 focus:outline-none focus:border-[#0d2137]/45 rounded-md transition-all shadow-sm"
              style={{ fontFamily: "var(--font-caveat)" }}
            />
          )}

          {currentField?.type === "SELECT" && (
            <select
              value={answers[currentField.id] || ""}
              onChange={(e) => handleFieldChange(currentField.id, e.target.value)}
              className="mx-auto w-64 bg-white/30 border border-[#0d2137]/15 p-3 text-sm text-center text-[#0d2137] focus:outline-none font-serif rounded-md transition-all shadow-sm"
            >
              <option value="">Select choice...</option>
              {(
                Array.isArray(currentField.options)
                  ? currentField.options
                  : (currentField.options as any)?.choices || []
              ).map((opt: string, i: number) => (
                <option key={i} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          )}

          {currentField?.type === "CHECKBOX" && (
            <div className="flex flex-col items-start gap-2 max-w-50 mx-auto text-left">
              {(
                Array.isArray(currentField.options)
                  ? currentField.options
                  : (currentField.options as any)?.choices || []
              ).map((opt: string, i: number) => {
                const selectedChoices = answers[currentField.id] || [];
                const isChecked = selectedChoices.includes(opt);

                return (
                  <label
                    key={i}
                    className="flex items-center gap-2.5 text-xs font-serif text-[#0d2137]/80 cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {
                        const nextChoices = isChecked
                          ? selectedChoices.filter((c: string) => c !== opt)
                          : [...selectedChoices, opt];
                        handleFieldChange(currentField.id, nextChoices);
                      }}
                      className="size-3.5 border-2 border-[#0d2137]/20 rounded bg-transparent text-[#0d2137]"
                    />
                    <span>{opt}</span>
                  </label>
                );
              })}
            </div>
          )}

          {currentField?.type === "RATING" && (
            <div className="flex items-center justify-center gap-2 select-none">
              {Array.from({ length: (currentField.options as any)?.max || 5 }).map((_, i) => {
                const score = i + 1;
                const isStarred = (answers[currentField.id] || 0) >= score;

                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleFieldChange(currentField.id, score)}
                    className="text-[#0d2137] hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`size-7 ${
                        isStarred
                          ? "text-[#8e6e53] fill-[#8e6e53]"
                          : "opacity-20"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          )}

          {currentField?.type === "DATE" && (
            <div className="mx-auto w-64 relative">
              <input
                type="date"
                min={(currentField.options as any)?.minDate || undefined}
                max={(currentField.options as any)?.maxDate || undefined}
                value={answers[currentField.id] || ""}
                onChange={(e) => handleFieldChange(currentField.id, e.target.value)}
                className="w-full text-center bg-white/35 border border-[#0d2137]/15 p-3 pr-10 text-xs text-[#0d2137] rounded-md focus:outline-none font-serif transition-all shadow-sm"
              />
              <Calendar className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-[#0d2137]/40 pointer-events-none" />
            </div>
          )}

          {currentField?.type === "TIME" && (
            <div className="mx-auto w-64 relative">
              <input
                type="time"
                min={(currentField.options as any)?.minTime || undefined}
                max={(currentField.options as any)?.maxTime || undefined}
                value={answers[currentField.id] || ""}
                onChange={(e) => handleFieldChange(currentField.id, e.target.value)}
                className="w-full text-center bg-white/35 border border-[#0d2137]/15 p-3 pr-10 text-xs text-[#0d2137] rounded-md focus:outline-none font-serif transition-all shadow-sm"
              />
              <Clock className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-[#0d2137]/40 pointer-events-none" />
            </div>
          )}

          {currentField?.type === "TOGGLE" && (
            <div className="flex items-center justify-center gap-4 py-1.5 text-xs font-serif text-[#0d2137]/80 select-none">
              <span
                className={
                  !answers[currentField.id]
                    ? "font-bold text-[#8e6e53]"
                    : "opacity-50"
                }
              >
                {(currentField.options as any)?.inactiveLabel || "No"}
              </span>
              <button
                type="button"
                onClick={() => handleFieldChange(currentField.id, !answers[currentField.id])}
                className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-250 ease-in-out focus:outline-none ${
                  answers[currentField.id]
                    ? "bg-[#3b5e82]"
                    : "bg-[#0d2137]/10"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block size-4 transform rounded-full bg-white shadow transition duration-250 ease-in-out ${
                    answers[currentField.id] ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
              <span
                className={
                  answers[currentField.id]
                    ? "font-bold text-[#3b5e82]"
                    : "opacity-50"
                }
              >
                {(currentField.options as any)?.activeLabel || "Yes"}
              </span>
            </div>
          )}

          {/* Sub-label description below input */}
          {currentField?.description && (
            <p
              className="text-sm text-[#0d2137]/50 text-center leading-relaxed mt-4 max-w-[320px] mx-auto"
              style={{ fontFamily: "var(--font-caveat)" }}
            >
              {currentField.description}
            </p>
          )}
        </div>

        {/* Bottom Actions inside Card */}
        <div className="space-y-4 pt-4 text-center">
          <button
            onClick={handleNext}
            disabled={isPending}
            className="mx-auto bg-[#0d2137] hover:bg-[#1a3854] text-white py-3.5 px-10 text-[10px] uppercase font-bold tracking-widest rounded-none transition-all cursor-pointer flex items-center justify-center gap-1 shadow-[0_4px_12px_rgba(13,33,55,0.15)] disabled:opacity-50"
            style={{ fontFamily: "var(--font-garamond)" }}
          >
            <span>
              {currentQuestionIndex === totalQuestions - 1
                ? isPending
                  ? "SUBMITTING..."
                  : "SUBMIT"
                : "NEXT"}
            </span>
          </button>

          {currentQuestionIndex > 0 ? (
            <button
              type="button"
              onClick={handleBack}
              className="text-[10px] uppercase tracking-wider font-bold text-[#0d2137]/50 hover:text-[#0d2137] transition-colors cursor-pointer block mx-auto mt-2"
              style={{ fontFamily: "var(--font-garamond)" }}
            >
              Back
            </button>
          ) : (
            <div className="h-3.5" />
          )}
        </div>
      </div>

      {/* Middle Atelier separator and text */}
      <div className="flex flex-col items-center gap-2 select-none z-10 pt-4">
        <div className="w-16 border-t border-[#0d2137]/10" />
        <div className="text-[8px] tracking-[0.25em] font-serif uppercase font-bold text-[#0d2137]/45">
          ESTABLISHED 1924 | ATELIER STUDIO
        </div>
      </div>
    </div>
  );
}
