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
      {/* Latest Responses Section */}
      <div className="relative overflow-hidden bg-white border-2 border-[#0d2137] p-5 rounded shadow-[3px_3px_0px_0px_#0d2137]">
        <div
          className="absolute inset-0 bg-cover bg-center mix-blend-multiply opacity-80 pointer-events-none select-none"
          style={{ backgroundImage: "url('/assest1.png')" }}
        />
        <div className="relative z-10 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h4 className="text-sm font-serif font-bold text-[#0d2137] uppercase tracking-wider">
              Latest Responses
            </h4>
            <div className="w-full sm:w-64 relative">
              <input
                type="text"
                placeholder="Search responses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#faf7f0]/60 border border-[#0d2137]/20 p-2 pl-8 text-xs font-serif text-[#0d2137] placeholder-[#0d2137]/35 rounded focus:outline-none focus:border-[#0d2137]/45"
              />
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-[#0d2137]/35" />
            </div>
          </div>

          {filteredSubmissions.length === 0 ? (
            <div className="py-12 text-center text-xs font-serif italic text-[#0d2137]/50 border border-dashed border-[#0d2137]/15 rounded">
              No submissions found matching the query.
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left font-serif text-xs">
                <thead>
                  <tr className="border-b border-[#0d2137]/10 text-[#0d2137]/65 text-[10px] uppercase tracking-widest font-bold">
                    <th className="pb-3 font-semibold">Respondent</th>
                    <th className="pb-3 font-semibold text-center">Status</th>
                    <th className="pb-3 font-semibold">Date</th>
                    <th className="pb-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubmissions.map((sub) => {
                    const details = getRespondentDetails(sub);
                    const initials = details.name.substring(0, 2).toUpperCase();

                    return (
                      <tr
                        key={sub.id}
                        className="border-b border-[#0d2137]/5 hover:bg-[#faf7f0]/30 transition-colors"
                      >
                        <td className="py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full border border-[#0d2137]/25 bg-[#faf7f0] flex items-center justify-center font-bold text-[#8e6e53] text-[10px] shrink-0">
                              {initials}
                            </div>
                            <div className="overflow-hidden">
                              <div className="font-bold text-[#0d2137] truncate">
                                {details.name}
                              </div>
                              <div className="text-[10px] text-[#0d2137]/55 truncate">
                                {details.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 text-center">
                          <span className="inline-block bg-green-500/10 text-green-700 border border-green-500/20 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">
                            Completed
                          </span>
                        </td>
                        <td className="py-3 text-[#0d2137]/65">
                          {new Date(sub.createdAt).toLocaleString()}
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => setViewingSubmission(sub)}
                            className="p-1.5 hover:bg-[#faf7f0] rounded border border-[#0d2137]/15 text-[#0d2137] cursor-pointer transition-colors"
                            title="View details"
                          >
                            <Eye className="size-4" />
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

      {/* Submission Detail Modal overlay */}
      {viewingSubmission && form && (
        <div className="fixed inset-0 bg-[#0d2137]/45 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded border-2 border-[#0d2137] shadow-[6px_6px_0px_0px_#0d2137] max-w-lg w-full relative transition-colors duration-300">
            <button
              onClick={() => setViewingSubmission(null)}
              className="absolute right-4 top-4 p-1 rounded hover:bg-[#faf7f0] text-[#0d2137]/50 cursor-pointer"
            >
              <X className="size-4.5" />
            </button>

            <div className="space-y-4">
              <div className="space-y-1 pr-6">
                <span className="text-[8px] uppercase tracking-widest font-serif font-bold text-[#8e6e53]">
                  Submission Blueprint
                </span>
                <h4 className="text-xl font-serif font-bold text-[#0d2137] truncate">
                  {getRespondentDetails(viewingSubmission).name}
                </h4>
                <p className="text-[10px] text-[#0d2137]/55 italic font-serif">
                  Submitted: {new Date(viewingSubmission.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="border-t border-[#0d2137]/10 pt-4 max-h-75 overflow-y-auto space-y-4 pr-1">
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
                    <div key={field.id} className="space-y-1 font-serif">
                      <span className="text-[9px] uppercase tracking-widest font-bold text-[#0d2137]/55 block">
                        Q: {field.label}
                      </span>
                      <div className="p-3 bg-[#faf7f0]/60 border border-[#0d2137]/15 rounded font-serif italic text-[#0d2137] text-xs">
                        {displayVal}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-[#0d2137]/10 pt-4 flex justify-end">
                <button
                  onClick={() => setViewingSubmission(null)}
                  className="bg-[#0d2137] hover:bg-[#1a3854] text-white py-2 px-6 text-[10px] uppercase font-bold tracking-widest transition-all cursor-pointer rounded-none border border-transparent shadow-[2px_2px_0px_0px_#8e6e53]"
                  style={{ fontFamily: "var(--font-garamond)" }}
                >
                  Close Blueprint
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
