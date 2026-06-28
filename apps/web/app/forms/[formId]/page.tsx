"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

import { useGetFormById, useSubmitForm } from "~/hooks/api/form";
import { useRecordView, useRecordFieldAnswer } from "~/hooks/api/analytics";
import { FormLoadingState } from "~/components/forms/FormLoadingState";
import { FormErrorState } from "~/components/forms/FormErrorState";
import { FormThankYou } from "~/components/forms/FormThankYou";
import { FormQuestion } from "~/components/forms/FormQuestion";
import { FormHeader } from "~/components/forms/FormHeader";
import { FormFooter } from "~/components/forms/FormFooter";

export default function PublicFormPage() {
  const params = useParams();
  const formId = params.formId as string;

  const { form, isLoading, error } = useGetFormById(formId);
  const { submitForm, isPending } = useSubmitForm();
  const { recordView } = useRecordView();
  const { recordFieldAnswer } = useRecordFieldAnswer();

  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [siteRating, setSiteRating] = useState<number | null>(null);

  const formOpenedAtRef = React.useRef<number>(Date.now());
  const viewRecordedRef = React.useRef(false);

  useEffect(() => {
    formOpenedAtRef.current = Date.now();
    if (formId && !viewRecordedRef.current) {
      viewRecordedRef.current = true;
      const ua = window.navigator.userAgent.toLowerCase();
      let deviceType = "desktop";
      if (/tablet|ipad|playbook|silk/i.test(ua)) {
        deviceType = "tablet";
      } else if (
        /mobile|iphone|ipod|android|blackberry|opera mini|iemobile|webos/i.test(
          ua
        )
      ) {
        deviceType = "mobile";
      }

      // Per-form visitor UUID kept in localStorage so reloads dedup on the
      // server. Scoped per form so we can't cross-track between forms.
      const storageKey = `cf_vid_${formId}`;
      let visitorId: string | null = null;
      try {
        visitorId = window.localStorage.getItem(storageKey);
        if (!visitorId) {
          visitorId =
            typeof crypto !== "undefined" && "randomUUID" in crypto
              ? crypto.randomUUID()
              : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
          window.localStorage.setItem(storageKey, visitorId);
        }
      } catch {
        // localStorage can throw in privacy modes / disabled storage — fall
        // back to no visitorId, which means no dedup (acceptable).
        visitorId = null;
      }

      const urlParams = new URLSearchParams(window.location.search);
      recordView({
        formId,
        visitorId,
        deviceType,
        referrer: document.referrer || null,
        utmSource: urlParams.get("utm_source"),
        utmMedium: urlParams.get("utm_medium"),
        utmCampaign: urlParams.get("utm_campaign"),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formId]);

  // default values for toggles
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
      ? Math.round(
          (Math.max(currentQuestionIndex, answeredCount) / totalQuestions) * 100
        )
      : 0;

  const handleNext = () => {
    if (!currentField) return;

    const value = answers[currentField.id];
    if (
      currentField.isRequired &&
      (value === undefined ||
        value === "" ||
        (Array.isArray(value) && value.length === 0))
    ) {
      toast.error(
        `Please answer the required field: "${currentField.label}"`
      );
      return;
    }

    const hasAnswer =
      value !== undefined &&
      value !== null &&
      value !== "" &&
      !(Array.isArray(value) && value.length === 0);
    if (hasAnswer || currentField.type === "TOGGLE") {
      recordFieldAnswer({ formId, fieldId: currentField.id, value });
    }

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      const payloadValues = Object.entries(answers).map(
        ([fieldId, value]) => ({
          formFieldId: fieldId,
          value,
        })
      );

      submitForm(
        {
          formId,
          values: payloadValues,
          referrer: document.referrer || null,
          utmSource: new URLSearchParams(window.location.search).get(
            "utm_source"
          ),
          utmMedium: new URLSearchParams(window.location.search).get(
            "utm_medium"
          ),
          utmCampaign: new URLSearchParams(window.location.search).get(
            "utm_campaign"
          ),
          timeSpentMs: Date.now() - formOpenedAtRef.current,
        },
        {
          onSuccess: () => {
            setSubmitted(true);
            toast.success("Thanks — your response was submitted");
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
  if (error || !form) return <FormErrorState type="not-found" />;
  if (!form.isPublished) return <FormErrorState type="draft-mode" />;

  const formCode = form.slug.substring(0, 7).toUpperCase();

  return (
    <div className="cf-landing min-h-screen w-full bg-[color:var(--cf-cream)] text-[color:var(--cf-ink)] flex flex-col items-center px-6 sm:px-10 py-6 sm:py-8 relative overflow-hidden">
      <style>{`
        @keyframes cf-card-in {
          from { transform: translateY(12px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes cf-draw-check {
          to { stroke-dashoffset: 0; }
        }
        @keyframes cf-check-pop {
          0% { transform: scale(0.85); opacity: 0; }
          60% { transform: scale(1.06); }
          100% { transform: scale(1); opacity: 1; }
        }
        .cf-animate-card {
          animation: cf-card-in 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .cf-animate-pop {
          animation: cf-check-pop 0.55s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
        }
        .cf-check-circle {
          stroke-dasharray: 150;
          stroke-dashoffset: 150;
          animation: cf-draw-check 0.7s ease-in-out forwards;
        }
        .cf-check-mark {
          stroke-dasharray: 50;
          stroke-dashoffset: 50;
          animation: cf-draw-check 0.5s ease-in-out 0.55s forwards;
        }
      `}</style>

      <FormHeader
        progressPercent={progressPercent}
        submitted={submitted}
        formCode={formCode}
        formTitle={form.title}
      />

      <main className="w-full max-w-2xl flex-1 flex flex-col items-center justify-center py-10 sm:py-14">
        {submitted ? (
          <FormThankYou
            siteRating={siteRating}
            setSiteRating={setSiteRating}
          />
        ) : totalQuestions === 0 ? (
          <div className="w-full max-w-md text-center space-y-3 cf-animate-card">
            <p className="cf-eyebrow text-[color:var(--cf-ink-soft)]">
              Empty form
            </p>
            <h3 className="cf-display text-[28px] leading-tight">
              Nothing to fill out yet
            </h3>
            <p className="text-[14px] text-[color:var(--cf-ink-soft)] leading-relaxed">
              The author hasn&apos;t added any questions to this form.
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
