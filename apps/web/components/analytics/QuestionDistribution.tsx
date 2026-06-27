"use client";

import React from "react";
import { Star } from "lucide-react";

interface OptionCount { value: string; count: number; percent: number; }
interface ToggleCounts { yes: number; no: number; }
interface RatingDistItem { rating: number; count: number; percent: number; }

interface QuestionItem {
  fieldId: string;
  fieldLabel: string;
  fieldType: string;
  totalAnswered: number;
  optionCounts?: OptionCount[];
  averageRating?: number;
  ratingDistribution?: RatingDistItem[];
  toggleCounts?: ToggleCounts;
  textSamples?: string[];
}

interface QuestionDistributionProps {
  questionDistribution: QuestionItem[];
}

const CHOICE_TYPES = ["SELECT", "RADIO", "CHECKBOX"];
const TEXT_TYPES = ["TEXT", "TEXTAREA", "EMAIL", "NUMBER", "PHONE", "URL", "DATE", "TIME"];

function FieldTypePill({ type }: { type: string }) {
  return (
    <span className="text-[8px] uppercase tracking-widest font-serif font-bold px-1.5 py-0.5 rounded border border-[#0d2137]/15 text-[#0d2137]/45">
      {type.toLowerCase()}
    </span>
  );
}

function ChoiceBar({ option }: { option: OptionCount }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center text-[10px] font-serif">
        <span className="text-[#0d2137] truncate pr-2">{option.value}</span>
        <span className="text-[#0d2137]/55 shrink-0 tabular-nums">
          {option.count} <span className="opacity-60">({option.percent}%)</span>
        </span>
      </div>
      <div className="h-2 bg-[#0d2137]/8 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${option.percent}%`, background: "#3b5e82"}}
        />
      </div>
    </div>
  );
}

function RatingStars({ avg }: { avg: number }) {
  const full = Math.floor(avg);
  const frac = avg - full;
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i < full ? 1 : i === full && frac > 0 ? frac : 0;
          return (
            <div key={i} className="relative size-4">
              <Star className="size-4 text-[#0d2137]/15 fill-current absolute inset-0" />
              <div className="absolute inset-0 overflow-hidden" style={{ width: `${filled * 100}%` }}>
                <Star className="size-4 fill-[#d4af37] text-[#d4af37]" />
              </div>
            </div>
          );
        })}
      </div>
      <span className="text-sm font-serif font-bold text-[#0d2137]">{avg.toFixed(1)}</span>
      <span className="text-[9px] text-[#0d2137]/45 font-serif">avg rating</span>
    </div>
  );
}

function RatingDistBar({ dist }: { dist: RatingDistItem[] }) {
  return (
    <div className="space-y-1.5 mt-2">
      {dist.map(d => (
        <div key={d.rating} className="flex items-center gap-2 text-[9px] font-serif">
          <span className="w-3 text-[#0d2137]/55 text-right tabular-nums">{d.rating}</span>
          <Star className="size-3 fill-[#d4af37] text-[#d4af37] shrink-0" />
          <div className="flex-1 h-1.5 bg-[#0d2137]/8 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{ width: `${d.percent}%`, background: "#8e6e53"}}
            />
          </div>
          <span className="w-6 text-right text-[#0d2137]/45 tabular-nums">{d.count}</span>
        </div>
      ))}
    </div>
  );
}

function ToggleBar({ counts }: { counts: ToggleCounts }) {
  const total = counts.yes + counts.no;
  const yesPct = total > 0 ? Math.round((counts.yes / total) * 100) : 0;
  const noPct = 100 - yesPct;
  return (
    <div className="space-y-2">
      <div className="h-3 rounded-full overflow-hidden flex">
        <div
          className="h-full transition-all duration-500"
          style={{ width: `${yesPct}%`, background: "#16a34a"}}
        />
        <div
          className="h-full transition-all duration-500"
          style={{ width: `${noPct}%`, background: "#d1d5db"}}
        />
      </div>
      <div className="flex gap-6 text-[10px] font-serif">
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-green-600" />
          <span className="text-[#0d2137] font-bold">Yes</span>
          <span className="text-[#0d2137]/55 tabular-nums">{counts.yes} ({yesPct}%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-gray-300" />
          <span className="text-[#0d2137] font-bold">No</span>
          <span className="text-[#0d2137]/55 tabular-nums">{counts.no} ({noPct}%)</span>
        </div>
      </div>
    </div>
  );
}

function TextSamples({ samples, totalAnswered }: { samples: string[]; totalAnswered: number }) {
  const shown = samples.slice(0, 3);
  const remaining = totalAnswered - shown.length;
  return (
    <div className="space-y-1.5">
      {shown.map((s, i) => (
        <div
          key={i}
          className="text-[10px] font-serif text-[#0d2137]/75 bg-[#0d2137]/5 rounded px-2.5 py-1.5 truncate"
          title={s}
        >
          {s.length > 60 ? s.slice(0, 60) + "…" : s}
        </div>
      ))}
      {remaining > 3 && (
        <p className="text-[9px] font-serif italic text-[#0d2137]/40 pl-1">
          +{remaining - shown.length > 0 ? remaining : totalAnswered - shown.length} more response{(totalAnswered - shown.length) !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}

function QuestionCard({ q }: { q: QuestionItem }) {
  const isChoice = CHOICE_TYPES.includes(q.fieldType);
  const isText = TEXT_TYPES.includes(q.fieldType);
  const isRating = q.fieldType === "RATING";
  const isToggle = q.fieldType === "TOGGLE";

  return (
    <div className="border border-[#0d2137]/10 rounded-md overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-[#faf7f0]/60 flex items-start justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <p className="text-xs font-serif font-bold text-[#0d2137] leading-snug">
            {q.fieldLabel}
          </p>
          <div className="flex items-center gap-2">
            <FieldTypePill type={q.fieldType} />
            <span className="text-[9px] font-serif text-[#0d2137]/45 tabular-nums">
              {q.totalAnswered} response{q.totalAnswered !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-4 py-3 space-y-2">
        {q.totalAnswered === 0 ? (
          <p className="text-[10px] font-serif italic text-[#0d2137]/35">
            0 responses for this field
          </p>
        ) : (
          <>
            {isChoice && q.optionCounts && (
              <div className="space-y-2">
                {q.optionCounts.map((opt, i) => (
                  <ChoiceBar key={i} option={opt} />
                ))}
              </div>
            )}

            {isRating && (
              <div className="space-y-2">
                {q.averageRating !== undefined && <RatingStars avg={q.averageRating} />}
                {q.ratingDistribution && <RatingDistBar dist={q.ratingDistribution} />}
              </div>
            )}

            {isToggle && q.toggleCounts && (
              <ToggleBar counts={q.toggleCounts} />
            )}

            {isText && (
              <div className="space-y-1.5">
                <p className="text-[9px] font-serif uppercase tracking-wider font-bold text-[#0d2137]/45 mb-1">
                  Recent answers
                </p>
                {q.textSamples && q.textSamples.length > 0 ? (
                  <TextSamples samples={q.textSamples} totalAnswered={q.totalAnswered} />
                ) : (
                  <p className="text-[10px] font-serif italic text-[#0d2137]/35">
                    {q.totalAnswered} answer{q.totalAnswered !== 1 ? "s" : ""} recorded
                  </p>
                )}
              </div>
            )}

            {!isChoice && !isRating && !isToggle && !isText && (
              <p className="text-[10px] font-serif italic text-[#0d2137]/45">
                {q.totalAnswered} answer{q.totalAnswered !== 1 ? "s" : ""} recorded
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export function QuestionDistribution({ questionDistribution }: QuestionDistributionProps) {
  return (
    <div className="relative overflow-hidden bg-white border-2 border-[#0d2137] p-5 rounded shadow-[3px_3px_0px_0px_#0d2137]">
      <div
        className="absolute inset-0 bg-cover bg-center mix-blend-multiply opacity-80 pointer-events-none select-none"
        style={{ backgroundImage: "url('/assest1.png')"}}
      />
      <div className="relative z-10 space-y-4">
        <div className="space-y-0.5">
          <h4 className="text-sm font-serif font-bold text-[#0d2137] uppercase tracking-wider">
            Question Breakdown
          </h4>
          <p className="text-[9px] font-serif text-[#0d2137]/45 italic">
            How respondents answered each question
          </p>
        </div>

        {questionDistribution.length === 0 ? (
          <p className="text-xs font-serif italic text-[#0d2137]/45">
            No fields found for this form.
          </p>
        ) : (
          <div className="space-y-3">
            {questionDistribution.map(q => (
              <QuestionCard key={q.fieldId} q={q} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
