"use client";

import React from "react";
import { Eye, Search, X } from "lucide-react";

interface SubmissionValue {
  formFieldId: string;
  value: any;
}

interface Submission {
  id: string;
  formId: string;
  values: SubmissionValue[];
  createdAt: string;
}

interface FormField {
  id: string;
  label: string;
  type: string;
}

interface SubmissionsTableProps {
  filteredSubmissions: Submission[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  getRespondentDetails: (sub: Submission) => { name: string; email: string };
  setViewingSubmission: (sub: Submission | null) => void;
  viewingSubmission: Submission | null;
  form: { fields: FormField[] } | null | undefined;
}

export function SubmissionsTable({
  filteredSubmissions,
  searchQuery,
  setSearchQuery,
  getRespondentDetails,
  setViewingSubmission,
  viewingSubmission,
  form,
}: SubmissionsTableProps) {
  return (
    <>
      <div className="bg-[color:var(--cf-cream-2)] rounded-xl ring-1 ring-[color:var(--cf-line)] p-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="cf-eyebrow text-[color:var(--cf-ink-soft)]">Latest</p>
            <h4 className="mt-2 cf-display text-[20px] leading-tight">
              Responses
            </h4>
          </div>
          <div className="w-full sm:w-72 relative">
            <input
              type="text"
              placeholder="Search responses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[color:var(--cf-cream)] rounded-md ring-1 ring-[color:var(--cf-line)] focus:ring-2 focus:ring-[color:var(--cf-orange)] focus:outline-none pl-9 pr-3 h-[38px] text-[13px] text-[color:var(--cf-ink)] placeholder:text-[color:var(--cf-ink-soft)]/55 transition-shadow"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-[color:var(--cf-ink-soft)]" />
          </div>
        </div>

        <div className="mt-5">
          {filteredSubmissions.length === 0 ? (
            <div className="py-12 text-center text-[13px] text-[color:var(--cf-ink-soft)] bg-[color:var(--cf-cream)] rounded-lg ring-1 ring-dashed ring-[color:var(--cf-line-strong)]">
              No submissions found.
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left text-[13px]">
                <thead>
                  <tr className="border-b border-[color:var(--cf-line)]">
                    <th className="pb-3 font-mono text-[11px] uppercase tracking-wider text-[color:var(--cf-ink-soft)] font-medium">
                      Respondent
                    </th>
                    <th className="pb-3 font-mono text-[11px] uppercase tracking-wider text-[color:var(--cf-ink-soft)] font-medium">
                      Status
                    </th>
                    <th className="pb-3 font-mono text-[11px] uppercase tracking-wider text-[color:var(--cf-ink-soft)] font-medium">
                      Date
                    </th>
                    <th className="pb-3 font-mono text-[11px] uppercase tracking-wider text-[color:var(--cf-ink-soft)] font-medium text-right">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubmissions.map((sub) => {
                    const details = getRespondentDetails(sub);
                    const initials = details.name
                      .substring(0, 2)
                      .toUpperCase();

                    return (
                      <tr
                        key={sub.id}
                        className="border-b border-[color:var(--cf-line)] last:border-b-0 hover:bg-[color:var(--cf-cream)]/60 transition-colors"
                      >
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[color:var(--cf-ink)] text-white flex items-center justify-center text-[11px] font-medium shrink-0">
                              {initials || "?"}
                            </div>
                            <div className="overflow-hidden">
                              <div className="font-medium text-[color:var(--cf-ink)] truncate">
                                {details.name}
                              </div>
                              <div className="text-[11px] text-[color:var(--cf-ink-soft)] truncate font-mono">
                                {details.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 pr-4">
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-[color:var(--cf-ink-soft)]">
                            <span className="size-1.5 rounded-full bg-[color:var(--cf-orange)]" />
                            Completed
                          </span>
                        </td>
                        <td className="py-3 pr-4 text-[12px] font-mono text-[color:var(--cf-ink-soft)]">
                          {new Date(sub.createdAt).toLocaleString()}
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => setViewingSubmission(sub)}
                            className="p-2 rounded-md ring-1 ring-[color:var(--cf-line-strong)] hover:bg-[color:var(--cf-cream)] text-[color:var(--cf-ink)] transition-colors cursor-pointer"
                            title="View details"
                            aria-label="View submission details"
                          >
                            <Eye className="size-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Submission detail modal */}
      {viewingSubmission && form && (
        <div className="fixed inset-0 bg-[color:var(--cf-ink)]/45 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[color:var(--cf-cream-2)] rounded-2xl ring-1 ring-[color:var(--cf-line-strong)] max-w-lg w-full relative shadow-[0_40px_80px_-30px_rgba(22,19,17,0.4)] flex flex-col max-h-[90vh]">
            <div className="px-6 pt-6 pb-4 border-b border-[color:var(--cf-line)] relative">
              <button
                onClick={() => setViewingSubmission(null)}
                className="absolute right-4 top-4 p-1.5 text-[color:var(--cf-ink-soft)] hover:text-[color:var(--cf-ink)] rounded-md hover:bg-[color:var(--cf-cream)] cursor-pointer transition-colors"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>

              <p className="cf-eyebrow text-[color:var(--cf-ink-soft)]">
                Submission
              </p>
              <h4 className="mt-2 cf-display text-[22px] leading-tight pr-8 truncate">
                {getRespondentDetails(viewingSubmission).name}
              </h4>
              <p className="mt-1 text-[12px] font-mono text-[color:var(--cf-ink-soft)]">
                {new Date(viewingSubmission.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="px-6 py-5 overflow-y-auto flex-1 space-y-4">
              {form.fields.map((field) => {
                const answer = viewingSubmission.values.find(
                  (v) => v.formFieldId === field.id
                );
                let displayVal = "No answer provided";
                if (
                  answer?.value !== undefined &&
                  answer?.value !== null &&
                  answer?.value !== ""
                ) {
                  if (Array.isArray(answer.value)) {
                    displayVal = answer.value.join(", ");
                  } else if (typeof answer.value === "boolean") {
                    displayVal = answer.value ? "Yes" : "No";
                  } else {
                    displayVal = String(answer.value);
                  }
                }

                return (
                  <div key={field.id} className="space-y-1.5">
                    <p className="cf-eyebrow text-[color:var(--cf-ink-soft)]">
                      {field.label}
                    </p>
                    <div className="text-[13px] text-[color:var(--cf-ink)] bg-[color:var(--cf-cream)] ring-1 ring-[color:var(--cf-line)] rounded-md px-3 py-2.5">
                      {displayVal}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="px-6 pb-6 pt-4 border-t border-[color:var(--cf-line)] flex justify-end">
              <button
                onClick={() => setViewingSubmission(null)}
                className="px-5 py-2 text-[13px] font-medium rounded-full bg-[color:var(--cf-ink)] hover:bg-black text-white transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
