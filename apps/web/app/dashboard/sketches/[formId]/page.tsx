"use client";

import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  Controls,
  useNodesState,
  useEdgesState,
  useReactFlow,
  Handle,
  Position,
  Panel,
  Node,
  Edge
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
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
  ChevronLeft,
  Settings,
  Trash2,
  Lock,
  Unlock,
  Maximize2,
  Sparkles,
  CloudLightning,
  Check,
  Eye,
  Share2,
  Plus,
  Minus
} from "lucide-react";
import {
  useGetForm,
  useListFormFields,
  useCreateFormField,
  useUpdateFormField,
  useDeleteFormField,
  usePublishForm
} from "~/hooks/api/form";
import { toast } from "sonner";
import { useTheme } from "next-themes";

// Define field metadata for the left sidebar
const AVAILABLE_FIELDS = [
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
  { type: "TOGGLE", label: "Toggle", icon: ToggleLeft, description: "Switch switch toggle" }
];

// Helper to get matching icon for field type
const getFieldIcon = (type: string) => {
  const match = AVAILABLE_FIELDS.find(f => f.type === type);
  return match ? match.icon : Type;
};

// Helper to get matching choices array
const getFieldOptionsArray = (field: any): string[] => {
  if (Array.isArray(field.options)) {
    return field.options;
  }
  if (field.options && typeof field.options === "object" && Array.isArray(field.options.choices)) {
    return field.options.choices;
  }
  return ["Option 1", "Option 2"]; // default fallback
};

// Custom Node Component to match sketches theme
const FormFieldNode = ({ data, selected }: { data: any; selected: boolean }) => {
  const { field } = data;
  const IconComponent = getFieldIcon(field.type);

  return (
    <div className={`w-72 bg-[#faf8f5] dark:bg-[#1c1c1e] border-2 rounded transition-all select-none duration-200 cursor-pointer shadow-[3px_3px_0px_0px_rgba(13,33,55,0.05)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.02)] ${selected ? 'border-[#3b5e82] dark:border-[#d4af37] ring-1 ring-[#3b5e82]/20 dark:ring-[#d4af37]/20 shadow-[5px_5px_0px_0px_#3b5e82] dark:shadow-[5px_5px_0px_0px_#d4af37]' : 'border-[#0d2137]/15 dark:border-white/10 hover:border-[#0d2137]/30 dark:hover:border-white/20'}`}>

      {/* Top Dotted DND Handle Indicator */}
      <div className="h-1.5 bg-cover opacity-30 border-b border-[#0d2137]/10 dark:border-white/10" style={{ backgroundImage: "radial-gradient(#0d2137 1px, transparent 1px)", backgroundSize: "4px 4px" }} />

      <div className="p-4 space-y-3">
        {/* Node Header */}
        <div className="flex justify-between items-center text-[9px] font-serif uppercase tracking-widest text-[#0d2137]/50 dark:text-white/50 font-bold">
          <div className="flex items-center gap-1.5">
            <IconComponent className="size-3" />
            <span>{field.type.replace("_", " ")} Node</span>
          </div>
          {field.isRequired && (
            <span className="bg-[#244f75]/10 dark:bg-[#d4af37]/15 text-[#244f75] dark:text-[#d4af37] px-1.5 py-0.5 rounded border border-[#244f75]/20 dark:border-[#d4af37]/25 text-[8px] font-bold">
              Req
            </span>
          )}
        </div>

        {/* Node Body */}
        <div className="space-y-1.5">
          <h4 className="font-serif font-bold text-[#0d2137] dark:text-white text-[14px] leading-snug line-clamp-2">
            {field.label || `Untitled ${field.type.replace("_", " ").toLowerCase()}`}
          </h4>

          {field.description && (
            <p className="text-[10px] text-[#0d2137]/50 dark:text-white/40 leading-relaxed font-serif italic">
              {field.description}
            </p>
          )}

          {/* Simulated Input Field (Sketches Style) */}
          <div className="pt-1">
            {field.type === "SELECT" ? (
              <div className="flex flex-col gap-1.5 mt-1 border border-[#0d2137]/10 dark:border-white/5 p-2 rounded bg-white/40 dark:bg-black/10">
                {getFieldOptionsArray(field).slice(0, 3).map((opt, i) => (
                  <div key={i} className="flex items-center justify-between text-[10px] font-serif text-[#0d2137]/65 dark:text-white/60">
                    <span>{opt}</span>
                    <span className="text-[8px] opacity-40">▼</span>
                  </div>
                ))}
                {getFieldOptionsArray(field).length > 3 && (
                  <div className="text-[8px] font-serif italic text-center text-[#0d2137]/45 dark:text-white/35 pt-0.5">
                    + {getFieldOptionsArray(field).length - 3} more options
                  </div>
                )}
              </div>
            ) : field.type === "CHECKBOX" ? (
              <div className="flex flex-col gap-1.5 mt-1">
                {getFieldOptionsArray(field).slice(0, 3).map((opt, i) => (
                  <div key={i} className="flex items-center gap-2 text-[10px] font-serif text-[#0d2137]/65 dark:text-white/60">
                    <div className="size-3 border border-[#0d2137]/25 dark:border-white/20 rounded-sm" />
                    <span>{opt}</span>
                  </div>
                ))}
                {getFieldOptionsArray(field).length > 3 && (
                  <div className="text-[8px] font-serif italic text-[#0d2137]/45 dark:text-white/35 pl-5 pt-0.5">
                    + {getFieldOptionsArray(field).length - 3} more options
                  </div>
                )}
              </div>
            ) : field.type === "RATING" ? (
              <div className="flex items-center gap-1 mt-1">
                {Array.from({ length: (field.options as any)?.max || 5 }).map((_, i) => (
                  <Star key={i} className="size-3.5 text-[#0d2137]/25 dark:text-white/20 fill-transparent" />
                ))}
              </div>
            ) : field.type === "DATE" ? (
              <div className="border-b border-[#0d2137]/15 dark:border-white/15 py-1 text-[11px] font-serif text-[#0d2137]/65 dark:text-white/50 tracking-wide select-none flex justify-between items-center">
                <span>
                  {(field.options as any)?.minDate || (field.options as any)?.maxDate ? (
                    <span className="italic text-[10px] opacity-85">
                      {(field.options as any)?.minDate ? `From ${(field.options as any).minDate}` : ""}
                      {(field.options as any)?.maxDate ? ` to ${(field.options as any).maxDate}` : ""}
                    </span>
                  ) : (
                    field.placeholder || "Select a date..."
                  )}
                </span>
                <Calendar className="size-3.5 opacity-40 shrink-0" />
              </div>
            ) : field.type === "TIME" ? (
              <div className="border-b border-[#0d2137]/15 dark:border-white/15 py-1 text-[11px] font-serif text-[#0d2137]/65 dark:text-white/50 tracking-wide select-none flex justify-between items-center">
                <span>
                  {(field.options as any)?.minTime || (field.options as any)?.maxTime ? (
                    <span className="italic text-[10px] opacity-85">
                      {(field.options as any)?.minTime ? `From ${(field.options as any).minTime}` : ""}
                      {(field.options as any)?.maxTime ? ` to ${(field.options as any).maxTime}` : ""}
                    </span>
                  ) : (
                    field.placeholder || "Select a time..."
                  )}
                </span>
                <Clock className="size-3.5 opacity-40 shrink-0" />
              </div>
            ) : field.type === "TOGGLE" ? (
              <div className="flex items-center justify-between py-1.5 text-[11px] font-serif text-[#0d2137]/65 dark:text-white/60">
                <span className={!(field.options as any)?.defaultValue ? "font-bold text-[#8e6e53] dark:text-[#d4af37]" : "opacity-50"}>
                  {(field.options as any)?.inactiveLabel || "No"}
                </span>

                <div className={`relative inline-flex h-4.5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors duration-250 ease-in-out ${(field.options as any)?.defaultValue ? 'bg-[#3b5e82] dark:bg-[#d4af37]' : 'bg-[#0d2137]/15 dark:bg-white/10'}`}>
                  <span className={`pointer-events-none inline-block size-3.5 transform rounded-full bg-white shadow ring-0 transition duration-250 ease-in-out ${(field.options as any)?.defaultValue ? 'translate-x-4.5' : 'translate-x-0'}`} />
                </div>

                <span className={(field.options as any)?.defaultValue ? "font-bold text-[#3b5e82] dark:text-[#d4af37]" : "opacity-50"}>
                  {(field.options as any)?.activeLabel || "Yes"}
                </span>
              </div>
            ) : (
              <div className="border-b border-[#0d2137]/15 dark:border-white/15 py-1 text-[11px] font-caveat italic text-[#0d2137]/40 dark:text-white/30 tracking-wide select-none">
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
const nodeTypes = {
  formField: FormFieldNode
};

// Main Builder Canvas Component
function BuilderCanvas() {
  const params = useParams();
  const router = useRouter();
  const formId = params.formId as string;
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  // tRPC Hooks
  const { form, isLoading: formLoading } = useGetForm(formId);
  const { fields, isLoading: fieldsLoading } = useListFormFields(formId);

  const { createFormField } = useCreateFormField();
  const { updateFormField } = useUpdateFormField();
  const { deleteFormField } = useDeleteFormField();
  const { publishForm, isPending: publishPending } = usePublishForm();

  // Local React Flow Nodes / Edges State
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false);

  // Inspector local form states
  const [label, setLabel] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [isRequired, setIsRequired] = useState(false);
  const [description, setDescription] = useState("");
  const [optionsList, setOptionsList] = useState<string[]>([]);

  const { screenToFlowPosition, zoomIn, zoomOut, fitView } = useReactFlow();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Sync database fields to React Flow workspace
  useEffect(() => {
    if (fields) {
      const mappedNodes = fields.map((field, idx) => {
        const fieldOptions = typeof field.options === "object" && field.options ? field.options : {};
        const pos = (fieldOptions as any).position || { x: 300, y: idx * 170 + 80 };

        return {
          id: field.id,
          type: "formField",
          position: pos,
          data: { field }
        };
      });

      setNodes(mappedNodes);

      // Create sequence edges
      const mappedEdges: Edge[] = [];
      for (let i = 0; i < fields.length - 1; i++) {
        const sourceField = fields[i];
        const targetField = fields[i + 1];
        if (sourceField && targetField) {
          mappedEdges.push({
            id: `e-${sourceField.id}-${targetField.id}`,
            source: sourceField.id,
            target: targetField.id,
            animated: true,
            style: { stroke: isDark ? "#d4af37" : "#3b5e82", strokeWidth: 1.5, strokeDasharray: "4,4" }
          });
        }
      }
      setEdges(mappedEdges);
    }
  }, [fields, isDark, setNodes, setEdges]);

  // Sync selected node data to inspector local states
  const selectedField = useMemo(() => {
    return fields?.find(f => f.id === selectedNodeId) || null;
  }, [fields, selectedNodeId]);

  useEffect(() => {
    if (selectedField) {
      setLabel(selectedField.label);
      setPlaceholder(selectedField.placeholder || "");
      setIsRequired(selectedField.isRequired);
      setDescription(selectedField.description || "");
      setOptionsList(getFieldOptionsArray(selectedField));
    }
  }, [selectedField]);

  // Handle Drag & Drop creation
  const onDragStart = (event: React.DragEvent, type: string) => {
    event.dataTransfer.setData("application/reactflow", type);
    event.dataTransfer.effectAllowed = "move";
  };

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(async (event: React.DragEvent) => {
    event.preventDefault();

    const type = event.dataTransfer.getData("application/reactflow");
    if (!type) return;

    if (!reactFlowWrapper.current) return;

    const rect = reactFlowWrapper.current.getBoundingClientRect();
    const position = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    const defaultLabel = `Untitled ${type.replace("_", " ").toLowerCase()}`;

    createFormField(
      {
        formId,
        label: "",
        type: type as any,
        isRequired: false,
        options: { position }
      },
      {
        onSuccess: (newField) => {
          setSelectedNodeId(newField.id);
          toast.success("Field added to canvas");
        },
        onError: (err) => {
          toast.error(err.message || "Failed to add field");
        }
      }
    );
  }, [screenToFlowPosition, createFormField, formId]);

  // Handle Node selection
  const onNodeClick = useCallback((_: React.MouseEvent, node: any) => {
    setSelectedNodeId(node.id);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  // Save node position after drag ends and calculate fractional index if order changed
  const onNodeDragStop = useCallback(async (event: any, node: Node) => {
    if (!fields) return;
    const currentField = fields.find(f => f.id === node.id);
    if (!currentField) return;

    const currentOpts = typeof currentField.options === "object" && currentField.options ? currentField.options : {};

    // Get the updated list of nodes including the dragged node's new position
    const sortedNodes = [...nodes];
    const draggedNodeIdx = sortedNodes.findIndex(n => n.id === node.id);
    const draggedNode = sortedNodes[draggedNodeIdx];
    if (draggedNodeIdx !== -1 && draggedNode) {
      sortedNodes[draggedNodeIdx] = {
        ...draggedNode,
        position: node.position
      };
    }
    // Sort all nodes vertically by y coordinate
    sortedNodes.sort((a, b) => a.position.y - b.position.y);

    const originalOrder = fields.map(f => f.id);
    const newOrder = sortedNodes.map(n => n.id);
    const orderChanged = JSON.stringify(originalOrder) !== JSON.stringify(newOrder);

    if (orderChanged) {
      const newIdx = sortedNodes.findIndex(n => n.id === node.id);
      let newIndex = currentField.index;

      if (newIdx === 0) {
        // Dragged to top
        const belowField = (sortedNodes[1]?.data as any)?.field;
        if (belowField) {
          newIndex = (parseFloat(belowField.index) / 2).toFixed(2);
        }
      } else if (newIdx === sortedNodes.length - 1) {
        // Dragged to bottom
        const aboveField = (sortedNodes[newIdx - 1]?.data as any)?.field;
        if (aboveField) {
          newIndex = (parseFloat(aboveField.index) + 1.00).toFixed(2);
        }
      } else {
        // Dragged between two fields
        const aboveField = (sortedNodes[newIdx - 1]?.data as any)?.field;
        const belowField = (sortedNodes[newIdx + 1]?.data as any)?.field;
        if (aboveField && belowField) {
          newIndex = ((parseFloat(aboveField.index) + parseFloat(belowField.index)) / 2).toFixed(2);
        }
      }

      updateFormField({
        id: node.id,
        index: newIndex,
        options: {
          ...currentOpts,
          position: node.position
        }
      });
    } else {
      // Order didn't change, just update position
      updateFormField({
        id: node.id,
        options: {
          ...currentOpts,
          position: node.position
        }
      });
    }
  }, [fields, nodes, updateFormField]);

  // Save changes on input Blur
  const handleInputBlur = useCallback((fieldKey: "label" | "placeholder" | "description", val: string) => {
    if (!selectedField) return;
    if (selectedField[fieldKey] === val) return;

    updateFormField(
      {
        id: selectedField.id,
        [fieldKey]: val
      },
      {
        onError: (err) => {
          toast.error(err.message || "Failed to update field");
        }
      }
    );
  }, [selectedField, updateFormField]);

  const handleRequiredChange = useCallback((checked: boolean) => {
    if (!selectedField) return;
    setIsRequired(checked);

    updateFormField(
      {
        id: selectedField.id,
        isRequired: checked
      },
      {
        onError: (err) => {
          toast.error(err.message || "Failed to update field");
        }
      }
    );
  }, [selectedField, updateFormField]);

  // Delete field
  const handleDeleteField = useCallback(() => {
    if (!selectedNodeId) return;

    deleteFormField(
      { id: selectedNodeId },
      {
        onSuccess: () => {
          setSelectedNodeId(null);
          toast.success("Field removed from canvas");
        },
        onError: (err) => {
          toast.error(err.message || "Failed to delete field");
        }
      }
    );
  }, [selectedNodeId, deleteFormField]);

  if (formLoading || fieldsLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#faf7f0] dark:bg-[#121212]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded border border-t-2 border-[#0d2137] dark:border-white border-t-transparent animate-spin" />
          <span className="text-xs uppercase tracking-widest font-serif font-bold text-[#0d2137]/60 dark:text-white/60">Loading Studio Draftsman...</span>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#faf7f0] dark:bg-[#121212]">
        <div className="text-center space-y-4">
          <h3 className="text-xl font-serif font-bold text-[#0d2137] dark:text-white">Blueprint not found</h3>
          <Link href="/dashboard/sketches" className="text-xs uppercase font-serif tracking-wider font-bold text-[#8e6e53] dark:text-[#d4af37] hover:underline">
            Back to Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex flex-col bg-[#faf7f0] dark:bg-[#121212] font-sans transition-colors duration-300">

      {/* Dynamic Top Bar Header */}
      <header className="h-16 px-6 border-b border-[#0d2137]/15 dark:border-white/10 flex items-center justify-between bg-white dark:bg-[#1c1c1e] z-10">

        {/* Left Actions */}
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/sketches"
            className="flex items-center gap-1 text-xs font-serif font-bold uppercase tracking-wider text-[#0d2137]/65 dark:text-white/65 hover:text-[#0d2137] dark:hover:text-white transition-colors cursor-pointer pr-3 border-r border-[#0d2137]/15 dark:border-white/10"
          >
            <ChevronLeft className="size-4" />
            <span>Catalog</span>
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-serif font-bold text-[#0d2137] dark:text-white leading-none">
                {form.title}
              </h1>
              <span className="text-[9px] font-serif uppercase tracking-widest font-bold px-2 py-0.5 border border-[#0d2137]/20 dark:border-white/20 text-[#0d2137]/60 dark:text-white/60 rounded">
                {form.isPublished ? "Commissioned" : "Drafting"}
              </span>
            </div>
            {form.description && (
              <p className="text-[10px] text-[#0d2137]/50 dark:text-white/40 font-serif italic line-clamp-1 mt-0.5">
                {form.description}
              </p>
            )}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-serif uppercase tracking-widest text-[#0d2137]/40 dark:text-white/40 font-bold flex items-center gap-1.5">
            <CloudLightning className="size-3.5" />
            <span>Auto Synced</span>
          </span>

          <button className="flex items-center gap-1.5 bg-[#faf7f0]/50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 text-[#0d2137] dark:text-white border border-[#0d2137]/20 dark:border-white/15 py-1.5 px-3 text-[10px] uppercase font-serif font-bold tracking-wider rounded transition-all cursor-pointer">
            <Eye className="size-3.5" />
            <span>Preview</span>
          </button>

          <button
            onClick={() => {
              const url = `${window.location.origin}/forms/${formId}`;
              navigator.clipboard.writeText(url);
              toast.success("Share link copied to clipboard!");
            }}
            className="flex items-center gap-1.5 bg-[#faf7f0]/50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 text-[#0d2137] dark:text-white border border-[#0d2137]/20 dark:border-white/15 py-1.5 px-3 text-[10px] uppercase font-serif font-bold tracking-wider rounded transition-all cursor-pointer"
          >
            <Share2 className="size-3.5" />
            <span>Share</span>
          </button>

          <button
            onClick={() => {
              publishForm(
                { id: formId },
                {
                  onSuccess: () => {
                    toast.success("Form published successfully");
                  },
                  onError: (err) => {
                    toast.error(err.message || "Failed to publish form");
                  }
                }
              );
            }}
            disabled={publishPending}
            className="bg-[#0d2137] dark:bg-[#b9c9df] hover:bg-[#1a3854] dark:hover:bg-[#ccdcf2] text-white dark:text-[#0d2137] border border-[#0d2137] dark:border-[#b9c9df] py-1.5 px-4 text-[10px] uppercase font-serif font-bold tracking-widest rounded transition-all cursor-pointer disabled:opacity-50"
          >
            {publishPending ? "Publishing..." : "Publish"}
          </button>
        </div>
      </header>

      {/* Main Workspace split */}
      <div className="flex-1 flex overflow-hidden">

        {/* Left Side Panel (FIELDS list) */}
        <aside className="w-64 bg-white dark:bg-[#1c1c1e] border-r border-[#0d2137]/15 dark:border-white/10 flex flex-col">
          <div className="p-4 border-b border-[#0d2137]/10 dark:border-white/10">
            <h2 className="text-[11px] font-serif uppercase tracking-widest text-[#0d2137] dark:text-white font-bold">
              Blueprint Fields
            </h2>
            <p className="text-[10px] text-[#0d2137]/50 dark:text-white/40 font-serif italic mt-0.5">
              Drag elements onto grid canvas
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {AVAILABLE_FIELDS.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.type}
                  draggable
                  onDragStart={(e) => onDragStart(e, f.type)}
                  className="flex items-center gap-3 p-3 bg-[#faf8f5] dark:bg-[#2c2c2e]/45 border border-[#0d2137]/10 dark:border-white/5 hover:border-[#0d2137]/20 dark:hover:border-white/10 hover:-translate-y-px hover:shadow-[1px_2px_4px_rgba(13,33,55,0.03)] cursor-grab active:cursor-grabbing rounded transition-all select-none group"
                >
                  <div className="p-1.5 bg-white dark:bg-[#222224] border border-[#0d2137]/10 dark:border-white/5 rounded text-[#0d2137]/75 dark:text-white/70 group-hover:text-[#8e6e53] dark:group-hover:text-[#d4af37] transition-colors">
                    <Icon className="size-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-serif font-bold text-[#0d2137] dark:text-white leading-tight">
                      {f.label}
                    </h4>
                    <p className="text-[9px] text-[#0d2137]/45 dark:text-white/40 leading-none mt-0.5">
                      {f.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </aside>

        {/* Middle Canvas Area */}
        <main
          ref={reactFlowWrapper}
          className="flex-1 h-full relative"
          onDragOver={onDragOver}
          onDrop={onDrop}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            onNodeDragStop={onNodeDragStop}
            fitView
            minZoom={0.5}
            maxZoom={1.5}
            nodesDraggable={!isLocked}
            panOnDrag={!isLocked}
            zoomOnScroll={!isLocked}
            preventScrolling={isLocked}
            proOptions={{ hideAttribution: true }}
          >
            {/* Custom Grid Background styling */}
            <Background
              variant={BackgroundVariant.Dots}
              color={isDark ? "rgba(255, 255, 255, 0.25)" : "rgba(13, 33, 55, 0.3)"}
              gap={16}
              size={1.5}
            />

            {/* Custom Controls panel styled to match design */}
            <Panel position="bottom-left" className="bg-white dark:bg-[#1c1c1e] border-2 border-[#0d2137]/15 dark:border-white/10 rounded-md p-1 shadow-[2px_2px_0px_0px_rgba(13,33,55,0.05)] flex flex-col gap-1 z-10">
              <button
                onClick={() => zoomIn()}
                title="Zoom In"
                className="p-1.5 hover:bg-[#faf8f5] dark:hover:bg-white/5 text-[#0d2137] dark:text-white rounded cursor-pointer transition-colors flex items-center justify-center"
              >
                <Plus className="size-3.5" />
              </button>
              <button
                onClick={() => zoomOut()}
                title="Zoom Out"
                className="p-1.5 hover:bg-[#faf8f5] dark:hover:bg-white/5 text-[#0d2137] dark:text-white rounded cursor-pointer transition-colors flex items-center justify-center"
              >
                <Minus className="size-3.5" />
              </button>
              <button
                onClick={() => fitView({ duration: 400 })}
                title="Fit View"
                className="p-1.5 hover:bg-[#faf8f5] dark:hover:bg-white/5 text-[#0d2137] dark:text-white rounded cursor-pointer transition-colors flex items-center justify-center"
              >
                <Maximize2 className="size-3.5" />
              </button>
              <button
                onClick={() => setIsLocked(!isLocked)}
                title={isLocked ? "Unlock Canvas" : "Lock Canvas"}
                className="p-1.5 hover:bg-[#faf8f5] dark:hover:bg-white/5 text-[#0d2137] dark:text-white rounded cursor-pointer transition-colors flex items-center justify-center border-t border-[#0d2137]/10 dark:border-white/10 pt-1.5 mt-0.5"
              >
                {isLocked ? (
                  <Lock className="size-3.5 text-[#8e6e53] dark:text-[#d4af37]" />
                ) : (
                  <Unlock className="size-3.5 opacity-60" />
                )}
              </button>
            </Panel>
          </ReactFlow>
        </main>

        {/* Right Side Panel (Inspector / Settings) */}
        <aside className="w-80 bg-white dark:bg-[#1c1c1e] border-l border-[#0d2137]/15 dark:border-white/10 flex flex-col justify-between">
          {selectedField ? (
            <>
              {/* Active selection settings */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">

                {/* Section Header */}
                <div className="flex justify-between items-center pb-4 border-b border-[#0d2137]/10 dark:border-white/10">
                  <div className="flex items-center gap-2">
                    <Settings className="size-4 text-[#8e6e53] dark:text-[#d4af37]" />
                    <h2 className="text-[13px] font-serif uppercase tracking-wider text-[#0d2137] dark:text-white font-bold">
                      Field Inspector
                    </h2>
                  </div>
                  <span className="text-[9px] font-serif font-bold uppercase bg-[#0d2137]/5 dark:bg-white/10 px-2 py-0.5 rounded text-[#0d2137]/60 dark:text-white/60">
                    {selectedField.type}
                  </span>
                </div>

                {/* Form Input: Label */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-serif uppercase tracking-wider text-[#0d2137]/60 dark:text-white/60 font-bold">
                    Field Label
                  </label>
                  <input
                    type="text"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    onBlur={() => handleInputBlur("label", label)}
                    className="w-full bg-[#faf8f5] dark:bg-[#2c2c2e]/60 border border-[#0d2137]/15 dark:border-white/10 p-2.5 text-xs text-[#0d2137] dark:text-white focus:outline-none focus:border-[#8e6e53] dark:focus:border-[#d4af37] font-serif rounded transition-colors"
                  />
                </div>

                {/* Form Input: Placeholder */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-serif uppercase tracking-wider text-[#0d2137]/60 dark:text-white/60 font-bold">
                    Placeholder Hint
                  </label>
                  <input
                    type="text"
                    value={placeholder}
                    onChange={(e) => setPlaceholder(e.target.value)}
                    onBlur={() => handleInputBlur("placeholder", placeholder)}
                    className="w-full bg-[#faf8f5] dark:bg-[#2c2c2e]/60 border border-[#0d2137]/15 dark:border-white/10 p-2.5 text-xs text-[#0d2137] dark:text-white focus:outline-none focus:border-[#8e6e53] dark:focus:border-[#d4af37] font-serif rounded transition-colors"
                  />
                </div>

                {/* Form Input: Description */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-serif uppercase tracking-wider text-[#0d2137]/60 dark:text-white/60 font-bold">
                    Description / Help Text
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    onBlur={() => handleInputBlur("description", description)}
                    rows={2}
                    className="w-full bg-[#faf8f5] dark:bg-[#2c2c2e]/60 border border-[#0d2137]/15 dark:border-white/10 p-2.5 text-xs text-[#0d2137] dark:text-white focus:outline-none focus:border-[#8e6e53] dark:focus:border-[#d4af37] font-serif rounded transition-colors resize-none"
                  />
                </div>

                {/* Form Input: Required Switch Toggle */}
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <h4 className="text-xs font-serif font-bold text-[#0d2137] dark:text-white">Required Input</h4>
                    <p className="text-[9px] text-[#0d2137]/50 dark:text-white/40 font-serif italic leading-none mt-0.5">Require responders to answer</p>
                  </div>

                  <button
                    onClick={() => handleRequiredChange(!isRequired)}
                    className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-250 ease-in-out focus:outline-none ${isRequired ? 'bg-[#3b5e82] dark:bg-[#d4af37]' : 'bg-[#0d2137]/10 dark:bg-white/10'}`}
                  >
                    <span
                      className={`pointer-events-none inline-block size-4 transform rounded-full bg-white shadow ring-0 transition duration-250 ease-in-out ${isRequired ? 'translate-x-5' : 'translate-x-0'}`}
                    />
                  </button>
                </div>

                {/* Choice List Editor for dropdowns/checkboxes */}
                {(selectedField.type === "SELECT" || selectedField.type === "CHECKBOX") && (
                  <div className="space-y-3 pt-4 border-t border-[#0d2137]/10 dark:border-white/10">
                    <label className="block text-[10px] font-serif uppercase tracking-wider text-[#0d2137]/60 dark:text-white/60 font-bold">
                      Menu Choices
                    </label>
                    <div className="space-y-2">
                      {optionsList.map((opt, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => {
                              const next = [...optionsList];
                              next[idx] = e.target.value;
                              setOptionsList(next);
                            }}
                            onBlur={() => {
                              const original = getFieldOptionsArray(selectedField);
                              if (JSON.stringify(original) !== JSON.stringify(optionsList)) {
                                updateFormField({ id: selectedField.id, options: optionsList });
                              }
                            }}
                            className="flex-1 bg-[#faf8f5] dark:bg-[#2c2c2e]/60 border border-[#0d2137]/15 dark:border-white/10 p-2 text-xs text-[#0d2137] dark:text-white focus:outline-none focus:border-[#8e6e53] dark:focus:border-[#d4af37] font-serif rounded"
                          />
                          <button
                            onClick={() => {
                              const next = optionsList.filter((_, i) => i !== idx);
                              setOptionsList(next);
                              updateFormField({ id: selectedField.id, options: next });
                            }}
                            disabled={optionsList.length <= 1}
                            className="p-1.5 text-red-500/70 hover:text-red-500 hover:bg-red-500/5 rounded disabled:opacity-30 cursor-pointer"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => {
                        const next = [...optionsList, `Choice ${optionsList.length + 1}`];
                        setOptionsList(next);
                        updateFormField({ id: selectedField.id, options: next });
                      }}
                      className="w-full py-1.5 border-2 border-dashed border-[#0d2137]/20 dark:border-white/10 hover:border-[#8e6e53] dark:hover:border-[#d4af37] text-xs font-serif font-bold text-[#0d2137]/70 dark:text-white/70 hover:text-[#8e6e53] dark:hover:text-[#d4af37] text-center rounded transition-colors cursor-pointer"
                    >
                      + Add Choice
                    </button>
                  </div>
                )}

                {/* Rating Limit Scale */}
                {selectedField.type === "RATING" && (
                  <div className="space-y-3 pt-4 border-t border-[#0d2137]/10 dark:border-white/10">
                    <label className="block text-[10px] font-serif uppercase tracking-wider text-[#0d2137]/60 dark:text-white/60 font-bold">
                      Rating Scale Limit
                    </label>
                    <select
                      value={(selectedField.options as any)?.max || 5}
                      onChange={(e) => {
                        updateFormField({
                          id: selectedField.id,
                          options: {
                            ...(selectedField.options as any || {}),
                            max: parseInt(e.target.value)
                          }
                        });
                      }}
                      className="w-full bg-[#faf8f5] dark:bg-[#2c2c2e]/60 border border-[#0d2137]/15 dark:border-white/10 p-2 text-xs text-[#0d2137] dark:text-white focus:outline-none focus:border-[#8e6e53] dark:focus:border-[#d4af37] font-serif rounded"
                    >
                      <option value={3}>3 Stars (Small)</option>
                      <option value={5}>5 Stars (Standard)</option>
                      <option value={10}>10 Stars (Detailed)</option>
                    </select>
                  </div>
                )}

                {/* Date Bounds Options */}
                {selectedField.type === "DATE" && (
                  <div className="space-y-4 pt-4 border-t border-[#0d2137]/10 dark:border-white/10">
                    <label className="block text-[10px] font-serif uppercase tracking-wider text-[#0d2137]/60 dark:text-white/60 font-bold">
                      Date Range Settings
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[8px] font-serif text-[#0d2137]/50 dark:text-white/40 uppercase">Min Date</label>
                        <input
                          type="date"
                          value={(selectedField.options as any)?.minDate || ""}
                          onChange={(e) => {
                            updateFormField({
                              id: selectedField.id,
                              options: {
                                ...(selectedField.options as any || {}),
                                minDate: e.target.value
                              }
                            });
                          }}
                          className="w-full bg-[#faf8f5] dark:bg-[#2c2c2e]/60 border border-[#0d2137]/15 dark:border-white/10 p-1.5 text-[10px] text-[#0d2137] dark:text-white focus:outline-none rounded font-serif"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[8px] font-serif text-[#0d2137]/50 dark:text-white/40 uppercase">Max Date</label>
                        <input
                          type="date"
                          value={(selectedField.options as any)?.maxDate || ""}
                          onChange={(e) => {
                            updateFormField({
                              id: selectedField.id,
                              options: {
                                ...(selectedField.options as any || {}),
                                maxDate: e.target.value
                              }
                            });
                          }}
                          className="w-full bg-[#faf8f5] dark:bg-[#2c2c2e]/60 border border-[#0d2137]/15 dark:border-white/10 p-1.5 text-[10px] text-[#0d2137] dark:text-white focus:outline-none rounded font-serif"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Time Bounds Options */}
                {selectedField.type === "TIME" && (
                  <div className="space-y-4 pt-4 border-t border-[#0d2137]/10 dark:border-white/10">
                    <label className="block text-[10px] font-serif uppercase tracking-wider text-[#0d2137]/60 dark:text-white/60 font-bold">
                      Time Range Settings
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[8px] font-serif text-[#0d2137]/50 dark:text-white/40 uppercase">Min Time</label>
                        <input
                          type="time"
                          value={(selectedField.options as any)?.minTime || ""}
                          onChange={(e) => {
                            updateFormField({
                              id: selectedField.id,
                              options: {
                                ...(selectedField.options as any || {}),
                                minTime: e.target.value
                              }
                            });
                          }}
                          className="w-full bg-[#faf8f5] dark:bg-[#2c2c2e]/60 border border-[#0d2137]/15 dark:border-white/10 p-1.5 text-[10px] text-[#0d2137] dark:text-white focus:outline-none rounded font-serif"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[8px] font-serif text-[#0d2137]/50 dark:text-white/40 uppercase">Max Time</label>
                        <input
                          type="time"
                          value={(selectedField.options as any)?.maxTime || ""}
                          onChange={(e) => {
                            updateFormField({
                              id: selectedField.id,
                              options: {
                                ...(selectedField.options as any || {}),
                                maxTime: e.target.value
                              }
                            });
                          }}
                          className="w-full bg-[#faf8f5] dark:bg-[#2c2c2e]/60 border border-[#0d2137]/15 dark:border-white/10 p-1.5 text-[10px] text-[#0d2137] dark:text-white focus:outline-none rounded font-serif"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Toggle Configuration */}
                {selectedField.type === "TOGGLE" && (
                  <div className="space-y-4 pt-4 border-t border-[#0d2137]/10 dark:border-white/10">
                    <label className="block text-[10px] font-serif uppercase tracking-wider text-[#0d2137]/60 dark:text-white/60 font-bold">
                      Toggle Configuration
                    </label>

                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-serif text-[#0d2137]/70 dark:text-white/60 font-bold">Default Value</span>
                      <button
                        onClick={() => {
                          const currentVal = !!(selectedField.options as any)?.defaultValue;
                          updateFormField({
                            id: selectedField.id,
                            options: {
                              ...(selectedField.options as any || {}),
                              defaultValue: !currentVal
                            }
                          });
                        }}
                        className={`relative inline-flex h-4 w-8 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${(selectedField.options as any)?.defaultValue ? 'bg-[#3b5e82] dark:bg-[#d4af37]' : 'bg-[#0d2137]/10 dark:bg-white/10'}`}
                      >
                        <span
                          className={`pointer-events-none inline-block size-3 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${(selectedField.options as any)?.defaultValue ? 'translate-x-4' : 'translate-x-0'}`}
                        />
                      </button>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[8px] font-serif text-[#0d2137]/50 dark:text-white/40 uppercase">Active State Label</label>
                      <input
                        type="text"
                        defaultValue={(selectedField.options as any)?.activeLabel || "Yes"}
                        onBlur={(e) => {
                          updateFormField({
                            id: selectedField.id,
                            options: {
                              ...(selectedField.options as any || {}),
                              activeLabel: e.target.value || "Yes"
                            }
                          });
                        }}
                        className="w-full bg-[#faf8f5] dark:bg-[#2c2c2e]/60 border border-[#0d2137]/15 dark:border-white/10 p-2 text-xs text-[#0d2137] dark:text-white focus:outline-none rounded font-serif"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[8px] font-serif text-[#0d2137]/50 dark:text-white/40 uppercase">Inactive State Label</label>
                      <input
                        type="text"
                        defaultValue={(selectedField.options as any)?.inactiveLabel || "No"}
                        onBlur={(e) => {
                          updateFormField({
                            id: selectedField.id,
                            options: {
                              ...(selectedField.options as any || {}),
                              inactiveLabel: e.target.value || "No"
                            }
                          });
                        }}
                        className="w-full bg-[#faf8f5] dark:bg-[#2c2c2e]/60 border border-[#0d2137]/15 dark:border-white/10 p-2 text-xs text-[#0d2137] dark:text-white focus:outline-none rounded font-serif"
                      />
                    </div>
                  </div>
                )}

              </div>

              {/* Delete button wrapper */}
              <div className="p-6 border-t border-[#0d2137]/10 dark:border-white/10 bg-[#faf8f5]/30">
                <button
                  onClick={handleDeleteField}
                  className="w-full flex items-center justify-center gap-2 p-2.5 border border-red-500/25 hover:border-red-500/50 bg-red-500/5 hover:bg-red-500/10 text-red-600 dark:text-red-400 rounded text-xs font-serif font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  <Trash2 className="size-4" />
                  <span>Delete Field</span>
                </button>
              </div>
            </>
          ) : (
            /* Empty state inspector */
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3 select-none">
              <div className="p-3 bg-[#faf8f5] dark:bg-[#2c2c2e]/45 border border-[#0d2137]/10 dark:border-white/5 rounded text-[#0d2137]/45 dark:text-white/40">
                <Settings className="size-6 animate-pulse" />
              </div>
              <div>
                <h4 className="text-xs font-serif font-bold text-[#0d2137] dark:text-white uppercase tracking-wider">
                  No Selection
                </h4>
                <p className="text-[10px] text-[#0d2137]/50 dark:text-white/40 leading-relaxed font-serif italic max-w-45 mx-auto mt-1">
                  Click on any node to view and configure its blueprint parameters.
                </p>
              </div>
            </div>
          )}
        </aside>

      </div>

    </div>
  );
}

export default function BuilderPage() {
  return (
    <ReactFlowProvider>
      <BuilderCanvas />
    </ReactFlowProvider>
  );
}
