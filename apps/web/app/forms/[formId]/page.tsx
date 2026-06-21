"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useGetFormById, useSubmitForm, useRecordView } from "~/hooks/api/form";
import { Star, Calendar, Clock } from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import { EB_Garamond, Caveat } from "next/font/google";

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-garamond",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
});

const DraftingCompass = () => (
  <svg 
    className="size-6 text-[#0d2137] dark:text-[#b9c9df] transition-colors" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.2"
  >
    <path d="M12 3v3M9 8.5L5 21M15 8.5L19 21M9 14h6M12 6a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
  </svg>
);

export default function PublicFormPage() {
  const params = useParams();
  const formId = params.formId as string;
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const { form, isLoading, error } = useGetFormById(formId);
  const { submitForm, isPending } = useSubmitForm();
  const { recordView } = useRecordView();

  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [siteRating, setSiteRating] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
    if (formId) {
      const ua = window.navigator.userAgent.toLowerCase();
      let deviceType = "desktop";
      if (/tablet|ipad|playbook|silk/i.test(ua)) {
        deviceType = "tablet";
      } else if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile|webos/i.test(ua)) {
        deviceType = "mobile";
      }
      recordView({ formId, deviceType });
    }
  }, [formId, recordView]);

  const isDark = mounted && theme === "dark";

  // Set default values for toggles from field options
  useEffect(() => {
    if (form?.fields) {
      const defaults: Record<string, any> = {};
      form.fields.forEach((field) => {
        if (field.type === "TOGGLE") {
          defaults[field.id] = !!(field.options as any)?.defaultValue;
        }
      });
      setAnswers((prev) => ({ ...defaults, ...prev }));
    }
  }, [form]);

  const handleFieldChange = (fieldId: string, value: any) => {
    setAnswers((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const currentField = form?.fields?.[currentQuestionIndex];
  const totalQuestions = form?.fields?.length || 0;

  const answeredCount = form?.fields?.filter((field) => {
    const val = answers[field.id];
    if (field.type === "TOGGLE") return val !== undefined;
    if (Array.isArray(val)) return val.length > 0;
    return val !== undefined && val !== null && val !== "";
  }).length || 0;

  const progressPercent = totalQuestions > 0 
    ? Math.round((Math.max(currentQuestionIndex, answeredCount) / totalQuestions) * 100)
    : 0;

  const handleNext = () => {
    if (!currentField) return;

    // Validation check for required fields
    const value = answers[currentField.id];
    if (currentField.isRequired && (value === undefined || value === "" || (Array.isArray(value) && value.length === 0))) {
      toast.error(`Please answer the required field: "${currentField.label}"`);
      return;
    }

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Final submission
      const payloadValues = Object.entries(answers).map(([fieldId, value]) => ({
        formFieldId: fieldId,
        value,
      }));

      submitForm(
        {
          formId,
          values: payloadValues,
        },
        {
          onSuccess: () => {
            setSubmitted(true);
            toast.success("Submission successfully registered");
          },
          onError: (err) => {
            toast.error(err.message || "Failed to submit form");
          },
        }
      );
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#faf7f0] dark:bg-[#121212] transition-colors duration-300">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded border border-t-2 border-[#0d2137] dark:border-white border-t-transparent animate-spin" />
          <span className="text-xs uppercase tracking-widest font-serif font-bold text-[#0d2137]/60 dark:text-white/60">
            Fetching Form Blueprint...
          </span>
        </div>
      </div>
    );
  }

  if (error || !form) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#faf7f0] dark:bg-[#121212] p-6 transition-colors duration-300">
        <div className="max-w-md w-full bg-white dark:bg-[#1c1c1e] border-2 border-red-500/20 p-8 rounded-lg shadow-[4px_4px_0px_0px_rgba(239,68,68,0.1)] text-center space-y-4">
          <h2 className="text-xl font-serif font-bold text-red-600 dark:text-red-400">
            Blueprint Mismatch
          </h2>
          <p className="text-xs text-[#0d2137]/60 dark:text-white/50 font-serif leading-relaxed">
            The requested form cannot be located or is not currently open for responses.
          </p>
        </div>
      </div>
    );
  }

  if (!form.isPublished) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#faf7f0] dark:bg-[#121212] p-6 transition-colors duration-300 font-sans">
        <div className="max-w-md w-full bg-white dark:bg-[#1c1c1e] border-2 border-amber-500/20 p-8 rounded-lg shadow-[4px_4px_0px_0px_rgba(245,158,11,0.1)] text-center space-y-4">
          <h2 className="text-xl font-serif font-bold text-amber-600 dark:text-amber-400">
            Draft Mode
          </h2>
          <p className="text-xs text-[#0d2137]/60 dark:text-white/50 font-serif leading-relaxed">
            This form is currently a draft and has not been commissioned for public submission yet.
          </p>
        </div>
      </div>
    );
  }

  const formCode = form.slug.substring(0, 7).toUpperCase();

  return (
    <div className={`${ebGaramond.variable} ${caveat.variable} min-h-screen w-full bg-[#faf7f0] dark:bg-[#121212] flex flex-col justify-between items-center p-8 md:p-12 relative select-none overflow-hidden transition-colors duration-300 font-sans`}>
      <style>{`
        @keyframes drawCheck {
          to { stroke-dashoffset: 0; }
        }
        @keyframes checkPop {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes cardSlideIn {
          from { transform: translateY(15px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .check-circle-anim {
          stroke-dasharray: 150;
          stroke-dashoffset: 150;
          animation: drawCheck 0.8s ease-in-out forwards;
        }
        .check-mark-anim {
          stroke-dasharray: 50;
          stroke-dashoffset: 50;
          animation: drawCheck 0.5s ease-in-out 0.6s forwards;
        }
        .animate-card {
          animation: cardSlideIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-pop {
          animation: checkPop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      `}</style>

      {/* Blueprint Parchment Main Page Background Image */}
      {mounted && (
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <Image
            src={isDark ? "/dark-card-background.png" : "/card-background.png"}
            alt="Main Page Background"
            fill
            priority
            className="object-cover opacity-[0.95] transition-all duration-300"
          />
        </div>
      )}

      {/* Header Info */}
      <header className="w-full max-w-6xl flex justify-between items-start z-10 text-[10px] tracking-[0.25em] font-serif uppercase font-bold text-[#0d2137]/45 dark:text-white/40">
        <div className="pt-2 flex flex-col gap-1.5">
          <div>SURVEY PROGRESS: {submitted ? "100" : progressPercent}%</div>
          <div className="w-24 h-0.5 bg-[#0d2137]/10 dark:bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#0d2137]/40 dark:bg-white/35 rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${submitted ? 100 : progressPercent}%` }}
            />
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-1.5 text-right">
          <div>{formCode}</div>
          <div className="pt-2 flex flex-col items-center">
            <DraftingCompass />
            <span className="text-[7px] tracking-[0.2em] font-serif uppercase font-bold text-[#0d2137]/50 dark:text-white/45 mt-1.5">CANVASFLOW FORMS</span>
          </div>
        </div>
      </header>

      {/* Main Content Area: Shifted to justify-start and pt-16 md:pt-20 to move card upward */}
      <main className="w-full flex-1 flex flex-col items-center justify-start z-10 pt-16 md:pt-20 pb-6">
        {submitted ? (
          /* Thank You Screen with Card Background Image */
          <div 
            className="max-w-xl w-full border border-white/30 dark:border-white/10 p-12 md:p-14 rounded-lg bg-white/45 dark:bg-black/35 backdrop-blur-xl shadow-[0px_10px_35px_rgba(13,33,55,0.06)] dark:shadow-[0px_10px_35px_rgba(0,0,0,0.25)] text-center space-y-6 animate-card -translate-y-14"
          >
            <div className="mx-auto size-20 bg-green-500/10 dark:bg-green-400/5 text-green-600 dark:text-green-400 border border-green-500/20 dark:border-green-400/25 rounded-full flex items-center justify-center animate-pop">
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
              <h2 className="text-3xl font-bold text-[#0d2137] dark:text-white tracking-wide" style={{ fontFamily: "var(--font-garamond)" }}>
                Thank You
              </h2>
              <p className="text-lg text-[#0d2137]/65 dark:text-white/50 leading-relaxed italic max-w-sm mx-auto" style={{ fontFamily: "var(--font-caveat)" }}>
                Your response has been submitted and stored in the catalog.
              </p>
            </div>

            {/* Interactive Rating Section */}
            <div className="space-y-3 pt-6 border-t border-[#0d2137]/10 dark:border-white/10">
              <span className="text-[10px] uppercase tracking-widest font-serif font-bold text-[#0d2137]/60 dark:text-white/50 block">
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
                      className="text-[#0d2137] dark:text-white hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Star 
                        className={`size-6 ${isStarred ? "text-[#8e6e53] dark:text-[#d4af37] fill-[#8e6e53] dark:fill-[#d4af37]" : "opacity-25"}`} 
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Account Creation Call To Action */}
            <div className="space-y-4 pt-6 border-t border-[#0d2137]/10 dark:border-white/10">
              <div className="space-y-1">
                <h4 className="text-xs uppercase tracking-widest font-serif font-bold text-[#0d2137] dark:text-white">
                  Design Your Own CanvasFlow Forms
                </h4>
                <p className="text-sm text-[#0d2137]/55 dark:text-white/40 italic" style={{ fontFamily: "var(--font-caveat)" }}>
                  If you enjoyed this form builder style, sign up to start drafting today!
                </p>
              </div>
              <a
                href="/signUp"
                className="inline-block bg-[#0d2137] hover:bg-[#1a3854] dark:bg-[#b9c9df] dark:hover:bg-[#ccdcf2] text-white dark:text-[#0d2137] py-3 px-8 text-[9px] uppercase font-bold tracking-widest transition-all shadow-[0_4px_12px_rgba(13,33,55,0.15)] rounded-none animate-pop"
                style={{ fontFamily: "var(--font-garamond)" }}
              >
                Create a Free Account
              </a>
            </div>
          </div>
        ) : totalQuestions === 0 ? (
          <div 
            className="max-w-xl w-full border border-white/30 dark:border-white/10 p-16 rounded-lg bg-white/45 dark:bg-black/35 backdrop-blur-xl shadow-[0px_10px_35px_rgba(13,33,55,0.06)] text-center space-y-3 -translate-y-14"
          >
            <h3 className="text-xl font-bold text-[#0d2137] dark:text-white" style={{ fontFamily: "var(--font-garamond)" }}>Empty Canvas</h3>
            <p className="text-sm text-[#0d2137]/50 dark:text-white/40 italic" style={{ fontFamily: "var(--font-caveat)" }}>This form does not contain any draft fields.</p>
          </div>
        ) : (
          /* Step-By-Step Question Card as Translucent Glassmorphism Overlay */
          <div className="w-full flex flex-col items-center gap-6">
            <div 
              key={currentQuestionIndex} 
              className="max-w-xl w-full border border-white/35 dark:border-white/10 p-16 rounded-lg bg-white/45 dark:bg-black/40 backdrop-blur-2xl shadow-[0px_15px_35px_rgba(13,33,55,0.06)] dark:shadow-[0px_15px_35px_rgba(0,0,0,0.3)] flex flex-col justify-between min-h-115 animate-card text-center relative -translate-y-14"
            >
              {/* Question Number */}
              <div className="space-y-4 select-none">
                <span 
                  className="text-lg text-[#0d2137]/60 dark:text-white/40 block mt-2 italic"
                  style={{ fontFamily: "var(--font-caveat)" }}
                >
                  Question {currentQuestionIndex + 1} of {totalQuestions}
                </span>
                <h2 
                  className="text-2xl md:text-3xl font-bold text-[#0d2137] dark:text-white leading-snug tracking-wide"
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
                    className="w-full max-w-sm mx-auto text-center bg-white/30 dark:bg-black/15 border border-[#0d2137]/15 dark:border-white/10 p-3.5 text-2xl text-[#0d2137] dark:text-white placeholder-[#0d2137]/35 dark:placeholder-white/20 focus:outline-none focus:border-[#0d2137]/45 dark:focus:border-white/40 rounded-md transition-all shadow-sm"
                    style={{ fontFamily: "var(--font-caveat)" }}
                  />
                )}

                {currentField?.type === "TEXTAREA" && (
                  <textarea
                    placeholder={currentField.placeholder || "Type response here..."}
                    value={answers[currentField.id] || ""}
                    onChange={(e) => handleFieldChange(currentField.id, e.target.value)}
                    rows={2}
                    className="w-full max-w-sm mx-auto text-center bg-white/30 dark:bg-black/15 border border-[#0d2137]/15 dark:border-white/10 p-3.5 text-2xl text-[#0d2137] dark:text-white placeholder-[#0d2137]/25 dark:placeholder-white/20 focus:outline-none focus:border-[#0d2137]/45 dark:focus:border-white/40 rounded-md transition-all shadow-sm resize-none"
                    style={{ fontFamily: "var(--font-caveat)" }}
                  />
                )}

                {currentField?.type === "EMAIL" && (
                  <input
                    type="email"
                    placeholder={currentField.placeholder || "name@domain.com"}
                    value={answers[currentField.id] || ""}
                    onChange={(e) => handleFieldChange(currentField.id, e.target.value)}
                    className="w-full max-w-sm mx-auto text-center bg-white/30 dark:bg-black/15 border border-[#0d2137]/15 dark:border-white/10 p-3.5 text-2xl text-[#0d2137] dark:text-white placeholder-[#0d2137]/25 dark:placeholder-white/20 focus:outline-none focus:border-[#0d2137]/45 dark:focus:border-white/40 rounded-md transition-all shadow-sm"
                    style={{ fontFamily: "var(--font-caveat)" }}
                  />
                )}

                {currentField?.type === "NUMBER" && (
                  <input
                    type="number"
                    placeholder={currentField.placeholder || "0.00"}
                    value={answers[currentField.id] || ""}
                    onChange={(e) => handleFieldChange(currentField.id, e.target.value)}
                    className="w-full max-w-xs mx-auto text-center bg-white/30 dark:bg-black/15 border border-[#0d2137]/15 dark:border-white/10 p-3.5 text-2xl text-[#0d2137] dark:text-white placeholder-[#0d2137]/25 dark:placeholder-white/20 focus:outline-none focus:border-[#0d2137]/45 dark:focus:border-white/40 rounded-md transition-all shadow-sm"
                    style={{ fontFamily: "var(--font-caveat)" }}
                  />
                )}

                {currentField?.type === "PHONE" && (
                  <input
                    type="tel"
                    placeholder={currentField.placeholder || "+1 (555) 000-0000"}
                    value={answers[currentField.id] || ""}
                    onChange={(e) => handleFieldChange(currentField.id, e.target.value)}
                    className="w-full max-w-sm mx-auto text-center bg-white/30 dark:bg-black/15 border border-[#0d2137]/15 dark:border-white/10 p-3.5 text-2xl text-[#0d2137] dark:text-white placeholder-[#0d2137]/25 dark:placeholder-white/20 focus:outline-none focus:border-[#0d2137]/45 dark:focus:border-white/40 rounded-md transition-all shadow-sm"
                    style={{ fontFamily: "var(--font-caveat)" }}
                  />
                )}

                {currentField?.type === "URL" && (
                  <input
                    type="url"
                    placeholder={currentField.placeholder || "https://domain.com"}
                    value={answers[currentField.id] || ""}
                    onChange={(e) => handleFieldChange(currentField.id, e.target.value)}
                    className="w-full max-w-sm mx-auto text-center bg-white/30 dark:bg-black/15 border border-[#0d2137]/15 dark:border-white/10 p-3.5 text-2xl text-[#0d2137] dark:text-white placeholder-[#0d2137]/25 dark:placeholder-white/20 focus:outline-none focus:border-[#0d2137]/45 dark:focus:border-white/40 rounded-md transition-all shadow-sm"
                    style={{ fontFamily: "var(--font-caveat)" }}
                  />
                )}

                {currentField?.type === "SELECT" && (
                  <select
                    value={answers[currentField.id] || ""}
                    onChange={(e) => handleFieldChange(currentField.id, e.target.value)}
                    className="mx-auto w-64 bg-white/30 dark:bg-black/15 border border-[#0d2137]/15 dark:border-white/10 p-3 text-sm text-center text-[#0d2137] dark:text-white focus:outline-none font-serif rounded-md transition-all shadow-sm"
                  >
                    <option value="">Select choice...</option>
                    {(Array.isArray(currentField.options) ? currentField.options : (currentField.options as any)?.choices || []).map((opt: string, i: number) => (
                      <option key={i} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                )}

                {currentField?.type === "CHECKBOX" && (
                  <div className="flex flex-col items-start gap-2 max-w-50 mx-auto text-left">
                    {(Array.isArray(currentField.options) ? currentField.options : (currentField.options as any)?.choices || []).map((opt: string, i: number) => {
                      const selectedChoices = answers[currentField.id] || [];
                      const isChecked = selectedChoices.includes(opt);

                      return (
                        <label key={i} className="flex items-center gap-2.5 text-xs font-serif text-[#0d2137]/80 dark:text-white/70 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              const nextChoices = isChecked
                                ? selectedChoices.filter((c: string) => c !== opt)
                                : [...selectedChoices, opt];
                              handleFieldChange(currentField.id, nextChoices);
                            }}
                            className="size-3.5 border-2 border-[#0d2137]/20 dark:border-white/20 rounded bg-transparent text-[#0d2137] dark:text-[#b9c9df]"
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
                          className="text-[#0d2137] dark:text-white hover:scale-110 transition-transform"
                        >
                          <Star className={`size-7 ${isStarred ? "text-[#8e6e53] dark:text-[#d4af37] fill-[#8e6e53] dark:fill-[#d4af37]" : "opacity-20"}`} />
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
                      className="w-full text-center bg-white/35 dark:bg-black/20 border border-[#0d2137]/15 dark:border-white/10 p-3 pr-10 text-xs text-[#0d2137] dark:text-white rounded-md focus:outline-none font-serif transition-all shadow-sm"
                    />
                    <Calendar className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-[#0d2137]/40 dark:text-white/30 pointer-events-none" />
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
                      className="w-full text-center bg-white/35 dark:bg-black/20 border border-[#0d2137]/15 dark:border-white/10 p-3 pr-10 text-xs text-[#0d2137] dark:text-white rounded-md focus:outline-none font-serif transition-all shadow-sm"
                    />
                    <Clock className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-[#0d2137]/40 dark:text-white/30 pointer-events-none" />
                  </div>
                )}

                {currentField?.type === "TOGGLE" && (
                  <div className="flex items-center justify-center gap-4 py-1.5 text-xs font-serif text-[#0d2137]/80 dark:text-white/70 select-none">
                    <span className={!answers[currentField.id] ? "font-bold text-[#8e6e53] dark:text-[#d4af37]" : "opacity-50"}>
                      {(currentField.options as any)?.inactiveLabel || "No"}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleFieldChange(currentField.id, !answers[currentField.id])}
                      className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-250 ease-in-out focus:outline-none ${answers[currentField.id] ? 'bg-[#3b5e82] dark:bg-[#d4af37]' : 'bg-[#0d2137]/10 dark:bg-white/10'}`}
                    >
                      <span className={`pointer-events-none inline-block size-4 transform rounded-full bg-white shadow transition duration-250 ease-in-out ${answers[currentField.id] ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                    <span className={answers[currentField.id] ? "font-bold text-[#3b5e82] dark:text-[#d4af37]" : "opacity-50"}>
                      {(currentField.options as any)?.activeLabel || "Yes"}
                    </span>
                  </div>
                )}

                {/* Sub-label description below input */}
                {currentField?.description && (
                  <p 
                    className="text-sm text-[#0d2137]/50 dark:text-white/40 text-center leading-relaxed mt-4 max-w-[320px] mx-auto"
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
                  className="mx-auto bg-[#0d2137] hover:bg-[#1a3854] dark:bg-[#b9c9df] dark:hover:bg-[#ccdcf2] text-white dark:text-[#0d2137] py-3.5 px-10 text-[10px] uppercase font-bold tracking-widest rounded-none transition-all cursor-pointer flex items-center justify-center gap-1 shadow-[0_4px_12px_rgba(13,33,55,0.15)] disabled:opacity-50"
                  style={{ fontFamily: "var(--font-garamond)" }}
                >
                  <span>{currentQuestionIndex === totalQuestions - 1 ? (isPending ? "SUBMITTING..." : "SUBMIT") : "NEXT"}</span>
                </button>
                
                {currentQuestionIndex > 0 ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="text-[10px] uppercase tracking-wider font-bold text-[#0d2137]/50 dark:text-white/40 hover:text-[#0d2137] dark:hover:text-white transition-colors cursor-pointer block mx-auto mt-2"
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
              <div className="w-16 border-t border-[#0d2137]/10 dark:border-white/10" />
              <div className="text-[8px] tracking-[0.25em] font-serif uppercase font-bold text-[#0d2137]/45 dark:text-white/40">ESTABLISHED 1924 | ATELIER STUDIO</div>
            </div>
          </div>
        )}
      </main>

      {/* Footer Info */}
      <footer className="w-full max-w-5xl z-10 flex flex-col md:flex-row justify-between items-center gap-3 text-[9px] font-serif uppercase tracking-widest text-[#0d2137]/45 dark:text-white/40 text-center md:text-left">
        <div>© 2024 CANVASFLOW FORMS ARCHITECTURAL STUDIO</div>
        <div className="flex gap-4">
          <span className="hover:underline cursor-pointer">PRIVACY PARCHMENT</span>
          <span className="hover:underline cursor-pointer">TERMS OF DRAFT</span>
        </div>
      </footer>
    </div>
  );
}
