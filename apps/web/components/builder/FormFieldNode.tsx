"use client";

import React from "react";
import { Handle, Position } from "@xyflow/react";
import {
  Type,
  AlignLeft,
  Mail,
  Binary,
  Phone,
  Link2,
  List,
  CheckSquare,
  Star,
  Calendar,
  Clock,
  ToggleLeft,
} from "lucide-react";

// Define field metadata for the left sidebar
export const AVAILABLE_FIELDS = [
  { type: "TEXT", label: "Short Text", icon: Type, description: "Single line input" },
  { type: "TEXTAREA", label: "Long Text", icon: AlignLeft, description: "Multi-line input" },
  { type: "EMAIL", label: "Email", icon: Mail, description: "Email address input" },
  { type: "NUMBER", label: "Number", icon: Binary, description: "Numeric value input" },
  { type: "PHONE", label: "Phone", icon: Phone, description: "Telephone number input" },
  { type: "URL", label: "URL", icon: Link2, description: "Website link input" },
  { type: "SELECT", label: "Single Select", icon: List, description: "Dropdown menu" },
  { type: "CHECKBOX", label: "Checkbox", icon: CheckSquare, description: "Multiple checkboxes" },
  { type: "RATING", label: "Rating", icon: Star, description: "Star selection" },
  { type: "DATE", label: "Date", icon: Calendar, description: "Calendar selection" },
  { type: "TIME", label: "Time", icon: Clock, description: "Time selection" },
  { type: "TOGGLE", label: "Toggle", icon: ToggleLeft, description: "Switch switch toggle" },
];

// Helper to get matching icon for field type
export const getFieldIcon = (type: string) => {
  const match = AVAILABLE_FIELDS.find((f) => f.type === type);
  return match ? match.icon : Type;
};

// Helper to get matching choices array
export const getFieldOptionsArray = (field: any): string[] => {
  if (Array.isArray(field.options)) {
    return field.options;
  }
  if (field.options && typeof field.options === "object" && Array.isArray(field.options.choices)) {
    return field.options.choices;
  }
  return ["Option 1", "Option 2"]; // default fallback
};

// Custom Node Component to match sketches theme
export const FormFieldNode = ({ data, selected }: { data: any; selected: boolean }) => {
  const { field } = data;
  const IconComponent = getFieldIcon(field.type);

  return (
    <div
      className={`w-72 bg-[#faf8f5] border-2 rounded transition-all select-none duration-200 cursor-pointer shadow-[3px_3px_0px_0px_rgba(13,33,55,0.05)] ${
        selected
          ? "border-[#3b5e82] ring-1 ring-[#3b5e82]/20 shadow-[5px_5px_0px_0px_#3b5e82]"
          : "border-[#0d2137]/15 hover:border-[#0d2137]/30"
      }`}
    >
      {/* Top Dotted DND Handle Indicator */}
      <div
        className="h-1.5 bg-cover opacity-30 border-b border-[#0d2137]/10"
        style={{
          backgroundImage: "radial-gradient(#0d2137 1px, transparent 1px)",
          backgroundSize: "4px 4px",
        }}
      />

      <div className="p-4 space-y-3">
        {/* Node Header */}
        <div className="flex justify-between items-center text-[9px] font-serif uppercase tracking-widest text-[#0d2137]/50 font-bold">
          <div className="flex items-center gap-1.5">
            <IconComponent className="size-3" />
            <span>{field.type.replace("_", " ")} Node</span>
          </div>
          {field.isRequired && (
            <span className="bg-[#244f75]/10 text-[#244f75] px-1.5 py-0.5 rounded border border-[#244f75]/20 text-[8px] font-bold">
              Req
            </span>
          )}
        </div>

        {/* Node Body */}
        <div className="space-y-1.5">
          <h4 className="font-serif font-bold text-[#0d2137] text-[14px] leading-snug line-clamp-2">
            {field.label || `Untitled ${field.type.replace("_", " ").toLowerCase()}`}
          </h4>

          {field.description && (
            <p className="text-[10px] text-[#0d2137]/50 leading-relaxed font-serif italic">
              {field.description}
            </p>
          )}

          {/* Simulated Input Field (Sketches Style) */}
          <div className="pt-1">
            {field.type === "SELECT" ? (
              <div className="flex flex-col gap-1.5 mt-1 border border-[#0d2137]/10 p-2 rounded bg-white/40">
                {getFieldOptionsArray(field)
                  .slice(0, 3)
                  .map((opt, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-[10px] font-serif text-[#0d2137]/65"
                    >
                      <span>{opt}</span>
                      <span className="text-[8px] opacity-40">▼</span>
                    </div>
                  ))}
                {getFieldOptionsArray(field).length > 3 && (
                  <div className="text-[8px] font-serif italic text-center text-[#0d2137]/45 pt-0.5">
                    + {getFieldOptionsArray(field).length - 3} more options
                  </div>
                )}
              </div>
            ) : field.type === "CHECKBOX" ? (
              <div className="flex flex-col gap-1.5 mt-1">
                {getFieldOptionsArray(field)
                  .slice(0, 3)
                  .map((opt, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-[10px] font-serif text-[#0d2137]/65"
                    >
                      <div className="size-3 border border-[#0d2137]/25 rounded-sm" />
                      <span>{opt}</span>
                    </div>
                  ))}
                {getFieldOptionsArray(field).length > 3 && (
                  <div className="text-[8px] font-serif italic text-[#0d2137]/45 pl-5 pt-0.5">
                    + {getFieldOptionsArray(field).length - 3} more options
                  </div>
                )}
              </div>
            ) : field.type === "RATING" ? (
              <div className="flex items-center gap-1 mt-1">
                {Array.from({ length: (field.options as any)?.max || 5 }).map((_, i) => (
                  <Star key={i} className="size-3.5 text-[#0d2137]/25 fill-transparent" />
                ))}
              </div>
            ) : field.type === "DATE" ? (
              <div className="border-b border-[#0d2137]/15 py-1 text-[11px] font-serif text-[#0d2137]/65 tracking-wide select-none flex justify-between items-center">
                <span>
                  {(field.options as any)?.minDate || (field.options as any)?.maxDate ? (
                    <span className="italic text-[10px] opacity-85">
                      {(field.options as any)?.minDate
                        ? `From ${(field.options as any).minDate}`
                        : ""}
                      {(field.options as any)?.maxDate
                        ? ` to ${(field.options as any).maxDate}`
                        : ""}
                    </span>
                  ) : (
                    field.placeholder || "Select a date..."
                  )}
                </span>
                <Calendar className="size-3.5 opacity-40 shrink-0" />
              </div>
            ) : field.type === "TIME" ? (
              <div className="border-b border-[#0d2137]/15 py-1 text-[11px] font-serif text-[#0d2137]/65 tracking-wide select-none flex justify-between items-center">
                <span>
                  {(field.options as any)?.minTime || (field.options as any)?.maxTime ? (
                    <span className="italic text-[10px] opacity-85">
                      {(field.options as any)?.minTime
                        ? `From ${(field.options as any).minTime}`
                        : ""}
                      {(field.options as any)?.maxTime
                        ? ` to ${(field.options as any).maxTime}`
                        : ""}
                    </span>
                  ) : (
                    field.placeholder || "Select a time..."
                  )}
                </span>
                <Clock className="size-3.5 opacity-40 shrink-0" />
              </div>
            ) : field.type === "TOGGLE" ? (
              <div className="flex items-center justify-between py-1.5 text-[11px] font-serif text-[#0d2137]/65">
                <span
                  className={
                    !(field.options as any)?.defaultValue
                      ? "font-bold text-[#8e6e53]"
                      : "opacity-50"
                  }
                >
                  {(field.options as any)?.inactiveLabel || "No"}
                </span>

                <div
                  className={`relative inline-flex h-4.5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors duration-250 ease-in-out ${
                    (field.options as any)?.defaultValue
                      ? "bg-[#3b5e82]"
                      : "bg-[#0d2137]/15"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block size-3.5 transform rounded-full bg-white shadow ring-0 transition duration-250 ease-in-out ${
                      (field.options as any)?.defaultValue ? "translate-x-4.5" : "translate-x-0"
                    }`}
                  />
                </div>

                <span
                  className={
                    (field.options as any)?.defaultValue
                      ? "font-bold text-[#3b5e82]"
                      : "opacity-50"
                  }
                >
                  {(field.options as any)?.activeLabel || "Yes"}
                </span>
              </div>
            ) : (
              <div className="border-b border-[#0d2137]/15 py-1 text-[11px] font-caveat italic text-[#0d2137]/40 tracking-wide select-none">
                {field.placeholder || "Draft answer here..."}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Top}
        style={{ width: "8px", height: "8px", background: "#3b5e82", border: "2px solid #faf8f5" }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ width: "8px", height: "8px", background: "#3b5e82", border: "2px solid #faf8f5" }}
      />
    </div>
  );
};

// Node type registry
export const nodeTypes = {
  formField: FormFieldNode,
};
