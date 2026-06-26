"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useGetFormById, useSubmitForm, useRecordView } from "~/hooks/api/form";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import { EB_Garamond, Caveat } from "next/font/google";
import { FormLoadingState } from "~/components/forms/FormLoadingState";
import { FormErrorState } from "~/components/forms/FormErrorState";
import { FormThankYou } from "~/components/forms/FormThankYou";
import { FormQuestion } from "~/components/forms/FormQuestion";
import { FormHeader } from "~/components/forms/FormHeader";
import { FormFooter } from "~/components/forms/FormFooter";

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-garamond",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
});

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
    setAnswers((prev) => ({ ...prev, [fieldId]: value }));
  };

  const currentField = form?.fields?.[currentQuestionIndex];
  const totalQuestions = form?.fields?.length || 0;

  const answeredCount =
    form?.fields?.filter((field) => {
      const val = answers[field.id];
      if (field.type === "TOGGLE") return val !== undefined;
      if (Array.isArray(val)) return val.length > 0;
      return val !== undefined && val !== null && val !== "";
    }).length || 0;

  const progressPercent =
    totalQuestions > 0
      ? Math.round((Math.max(currentQuestionIndex, answeredCount) / totalQuestions) * 100)
      : 0;

  const handleNext = () => {
    if (!currentField) return;

    const value = answers[currentField.id];
    if (
      currentField.isRequired &&
      (value === undefined || value === "" || (Array.isArray(value) && value.length === 0))
    ) {
      toast.error(`Please answer the required field: "${currentField.label}"`);
      return;
    }

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      const payloadValues = Object.entries(answers).map(([fieldId, value]) => ({
        formFieldId: fieldId,
        value,
      }));

      submitForm(
        { formId, values: payloadValues },
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

  if (isLoading) return <FormLoadingState />;
  if (error || !form) return <FormErrorState type="blueprint-mismatch" />;
  if (!form.isPublished) return <FormErrorState type="draft-mode" />;

  const formCode = form.slug.substring(0, 7).toUpperCase();

  return (
    <div
      className={`${ebGaramond.variable} ${caveat.variable} min-h-screen w-full bg-[#faf7f0] dark:bg-[#121212] flex flex-col justify-between items-center p-8 md:p-12 relative select-none overflow-hidden transition-colors duration-300 font-sans`}
    >
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

      <FormHeader progressPercent={progressPercent} submitted={submitted} formCode={formCode} />

      <main className="w-full flex-1 flex flex-col items-center justify-start z-10 pt-16 md:pt-20 pb-6">
        {submitted ? (
          <FormThankYou siteRating={siteRating} setSiteRating={setSiteRating} />
        ) : totalQuestions === 0 ? (
          <div className="max-w-xl w-full border border-white/30 dark:border-white/10 p-16 rounded-lg bg-white/45 dark:bg-black/35 backdrop-blur-xl shadow-[0px_10px_35px_rgba(13,33,55,0.06)] text-center space-y-3 -translate-y-14">
            <h3
              className="text-xl font-bold text-[#0d2137] dark:text-white"
              style={{ fontFamily: "var(--font-garamond)" }}
            >
              Empty Canvas
            </h3>
            <p
              className="text-sm text-[#0d2137]/50 dark:text-white/40 italic"
              style={{ fontFamily: "var(--font-caveat)" }}
            >
              This form does not contain any draft fields.
            </p>
          </div>
        ) : (
          <FormQuestion
            currentField={currentField}
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={totalQuestions}
            answers={answers}
            isPending={isPending}
            handleFieldChange={handleFieldChange}
            handleNext={handleNext}
            handleBack={handleBack}
          />
        )}
      </main>

      <FormFooter />
    </div>
  );
}
