"use client";

import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  useReactFlow,
  Panel,
  Node,
  Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Lock, Unlock, Maximize2, Plus, Minus } from "lucide-react";
import {
  useGetForm,
  useListFormFields,
  useCreateFormField,
  useUpdateFormField,
  useDeleteFormField,
  usePublishForm,
  useDeleteForm,
} from "~/hooks/api/form";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import { useDashboard } from "~/providers/dashboard-provider";
import { nodeTypes, getFieldOptionsArray } from "~/components/builder/FormFieldNode";
import { FieldSidebar } from "~/components/builder/FieldSidebar";
import { FieldInspector } from "~/components/builder/FieldInspector";
import { BuilderHeader } from "~/components/builder/BuilderHeader";
import { UnsavedDialog } from "~/components/builder/UnsavedDialog";
import { DeleteFormDialog } from "~/components/builder/DeleteFormDialog";

// Main Builder Canvas Component
function BuilderCanvas() {
  const params = useParams();
  const router = useRouter();
  const formId = params.formId as string;
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  // tRPC Hooks
  const { form, isLoading: formLoading, refetch: refetchForm } = useGetForm(formId);
  const { fields, isLoading: fieldsLoading } = useListFormFields(formId);

  const { setIsCreatingForm } = useDashboard();
  useEffect(() => {
    if (!formLoading && !fieldsLoading) {
      setIsCreatingForm(false);
    }
  }, [formLoading, fieldsLoading, setIsCreatingForm]);

  const { createFormField } = useCreateFormField();
  const { updateFormField } = useUpdateFormField();
  const { deleteFormField } = useDeleteFormField();
  const { publishForm, isPending: publishPending } = usePublishForm();
  const { deleteFormAsync, isPending: deletePending } = useDeleteForm();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // ─── Local draft state ────────────────────────────────────────────────────
  type LocalField = NonNullable<typeof fields>[number] & { _isNew?: boolean };
  const [localFields, setLocalFields] = useState<LocalField[]>([]);
  const [dirtyIds, setDirtyIds] = useState<Set<string>>(new Set());
  const [pendingDeletes, setPendingDeletes] = useState<Set<string>>(new Set());
  const [isSaving, setIsSaving] = useState(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const pendingNavRef = useRef<string | null>(null);
  const isDirtyRef = useRef(false);

  const isDirty = dirtyIds.size > 0 || pendingDeletes.size > 0;

  useEffect(() => {
    isDirtyRef.current = isDirty;
  }, [isDirty]);

  useEffect(() => {
    if (fields && localFields.length === 0) {
      setLocalFields(fields as LocalField[]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields]);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirtyRef.current) { e.preventDefault(); e.returnValue = ""; }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);

  // ─── Save all pending changes ─────────────────────────────────────────────
  const handleSave = useCallback(async () => {
    if (!isDirty || isSaving) return;
    setIsSaving(true);
    try {
      const ops: Promise<unknown>[] = [];

      localFields
        .filter((f) => f._isNew && !pendingDeletes.has(f.id))
        .forEach((f) => {
          ops.push(
            new Promise<void>((resolve, reject) => {
              createFormField(
                {
                  formId,
                  label: f.label,
                  type: f.type as any,
                  isRequired: f.isRequired,
                  placeholder: f.placeholder ?? undefined,
                  description: f.description ?? undefined,
                  options: f.options ?? undefined,
                  index: f.index ? parseFloat(String(f.index)) : undefined,
                },
                { onSuccess: () => resolve(), onError: (e) => reject(e) }
              );
            })
          );
        });

      localFields
        .filter((f) => !f._isNew && dirtyIds.has(f.id) && !pendingDeletes.has(f.id))
        .forEach((f) => {
          ops.push(
            new Promise<void>((resolve, reject) => {
              updateFormField(
                {
                  id: f.id,
                  label: f.label,
                  placeholder: f.placeholder ?? undefined,
                  description: f.description ?? undefined,
                  isRequired: f.isRequired,
                  options: f.options ?? undefined,
                  index: f.index ? String(f.index) : undefined,
                },
                { onSuccess: () => resolve(), onError: (e) => reject(e) }
              );
            })
          );
        });

      localFields
        .filter((f) => !f._isNew && pendingDeletes.has(f.id))
        .forEach((f) => {
          ops.push(
            new Promise<void>((resolve, reject) => {
              deleteFormField(
                { id: f.id },
                { onSuccess: () => resolve(), onError: (e) => reject(e) }
              );
            })
          );
        });

      await Promise.all(ops);
      setDirtyIds(new Set());
      setPendingDeletes(new Set());
      setLocalFields((prev) =>
        prev.filter((f) => !pendingDeletes.has(f.id)).map((f) => ({ ...f, _isNew: false }))
      );
      toast.success("Blueprint saved");
    } catch {
      toast.error("Some changes failed to save — please retry");
    } finally {
      setIsSaving(false);
    }
  }, [isDirty, isSaving, localFields, dirtyIds, pendingDeletes, formId, createFormField, updateFormField, deleteFormField]);

  // ─── Helper: mark a local field as dirty ─────────────────────────────────
  const updateLocal = useCallback((id: string, patch: Partial<LocalField>) => {
    setLocalFields((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)));
    setDirtyIds((prev) => new Set(prev).add(id));
  }, []);

  // ─── React Flow state ─────────────────────────────────────────────────────
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false);

  // Inspector controlled inputs
  const [label, setLabel] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [isRequired, setIsRequired] = useState(false);
  const [description, setDescription] = useState("");
  const [optionsList, setOptionsList] = useState<string[]>([]);

  const { screenToFlowPosition, zoomIn, zoomOut, fitView } = useReactFlow();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Sync localFields → React Flow nodes/edges
  useEffect(() => {
    const visible = localFields.filter((f) => !pendingDeletes.has(f.id));
    setNodes(
      visible.map((field, idx) => {
        const p =
          (typeof field.options === "object" && field.options
            ? (field.options as any)
            : {}
          ).position || { x: 300, y: idx * 170 + 80 };
        return { id: field.id, type: "formField", position: p, data: { field } };
      })
    );
    const mappedEdges: Edge[] = [];
    for (let i = 0; i < visible.length - 1; i++) {
      const s = visible[i];
      const t = visible[i + 1];
      if (s && t)
        mappedEdges.push({
          id: `e-${s.id}-${t.id}`,
          source: s.id,
          target: t.id,
          animated: true,
          style: {
            stroke: isDark ? "#d4af37" : "#3b5e82",
            strokeWidth: 1.5,
            strokeDasharray: "4,4",
          },
        });
    }
    setEdges(mappedEdges);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localFields, pendingDeletes, isDark]);

  const selectedField = useMemo(
    () => localFields.find((f) => f.id === selectedNodeId) ?? null,
    [localFields, selectedNodeId]
  );

  useEffect(() => {
    if (selectedField) {
      setLabel(selectedField.label);
      setPlaceholder(selectedField.placeholder || "");
      setIsRequired(selectedField.isRequired);
      setDescription(selectedField.description || "");
      setOptionsList(getFieldOptionsArray(selectedField));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedField?.id]);

  // ─── Drag & Drop ──────────────────────────────────────────────────────────
  const onDragStart = (event: React.DragEvent, type: string) => {
    event.dataTransfer.setData("application/reactflow", type);
    event.dataTransfer.effectAllowed = "move";
  };

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData("application/reactflow");
      if (!type || !reactFlowWrapper.current) return;
      const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });
      const tempId = `new-${Date.now()}`;
      const nextIndex = (
        localFields.filter((f) => !pendingDeletes.has(f.id)).length + 1
      ).toFixed(2);
      const newField = {
        id: tempId,
        formId,
        label: "",
        labelKey: "field",
        placeholder: null,
        isRequired: false,
        index: nextIndex,
        type: type as any,
        options: { position },
        description: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        _isNew: true,
      };
      setLocalFields((prev) => [...prev, newField]);
      setDirtyIds((prev) => new Set(prev).add(tempId));
      setSelectedNodeId(tempId);
    },
    [screenToFlowPosition, localFields, pendingDeletes, formId]
  );

  const onNodeClick = useCallback((_: React.MouseEvent, node: any) => {
    setSelectedNodeId(node.id);
  }, []);

  const onPaneClick = useCallback(() => setSelectedNodeId(null), []);

  // ─── Node drag: update position locally ───────────────────────────────────
  const onNodeDragStop = useCallback(
    (_event: any, node: Node) => {
      const currentField = localFields.find((f) => f.id === node.id);
      if (!currentField) return;
      const currentOpts =
        typeof currentField.options === "object" && currentField.options
          ? currentField.options
          : {};
      const sortedNodes = [...nodes];
      const idx = sortedNodes.findIndex((n) => n.id === node.id);
      if (idx !== -1) sortedNodes[idx] = { ...sortedNodes[idx]!, position: node.position };
      sortedNodes.sort((a, b) => a.position.y - b.position.y);
      const originalOrder = localFields
        .filter((f) => !pendingDeletes.has(f.id))
        .map((f) => f.id);
      const newOrder = sortedNodes.map((n) => n.id);
      const orderChanged = JSON.stringify(originalOrder) !== JSON.stringify(newOrder);

      let newIndex: string = String(currentField.index);
      if (orderChanged) {
        const newIdx = sortedNodes.findIndex((n) => n.id === node.id);
        if (newIdx === 0) {
          const below = (sortedNodes[1]?.data as any)?.field;
          if (below) newIndex = (parseFloat(below.index) / 2).toFixed(2);
        } else if (newIdx === sortedNodes.length - 1) {
          const above = (sortedNodes[newIdx - 1]?.data as any)?.field;
          if (above) newIndex = (parseFloat(above.index) + 1.0).toFixed(2);
        } else {
          const above = (sortedNodes[newIdx - 1]?.data as any)?.field;
          const below = (sortedNodes[newIdx + 1]?.data as any)?.field;
          if (above && below)
            newIndex = (
              (parseFloat(above.index) + parseFloat(below.index)) / 2
            ).toFixed(2);
        }
      }
      updateLocal(node.id, {
        index: newIndex,
        options: { ...(currentOpts as any), position: node.position },
      });
    },
    [localFields, pendingDeletes, nodes, updateLocal]
  );

  const handleRequiredChange = useCallback(
    (checked: boolean) => {
      if (!selectedField) return;
      setIsRequired(checked);
      updateLocal(selectedField.id, { isRequired: checked });
    },
    [selectedField, updateLocal]
  );

  const handleDeleteField = useCallback(() => {
    if (!selectedNodeId) return;
    setPendingDeletes((prev) => new Set(prev).add(selectedNodeId));
    setDirtyIds((prev) => new Set(prev).add(selectedNodeId));
    setSelectedNodeId(null);
    toast("Field removed — save to confirm", { duration: 2000 });
  }, [selectedNodeId]);

  if (formLoading || fieldsLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#faf7f0] dark:bg-[#121212]">
        <div className="w-8 h-8 border-2 border-[#0d2137] dark:border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!form) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#faf7f0] dark:bg-[#121212]">
        <div className="text-center space-y-4">
          <h3 className="text-xl font-serif font-bold text-[#0d2137] dark:text-white">
            Blueprint not found
          </h3>
          <Link
            href="/dashboard/sketches"
            className="text-xs uppercase font-serif tracking-wider font-bold text-[#8e6e53] dark:text-[#d4af37] hover:underline"
          >
            Back to Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex flex-col bg-[#faf7f0] dark:bg-[#121212] font-sans transition-colors duration-300">
      <BuilderHeader
        form={form}
        formId={formId}
        isDirty={isDirty}
        isSaving={isSaving}
        publishPending={publishPending}
        handleSave={handleSave}
        setShowDeleteConfirm={setShowDeleteConfirm}
        publishForm={publishForm}
        pendingNavRef={pendingNavRef}
        setShowUnsavedDialog={setShowUnsavedDialog}
        onPublishSuccess={() => {
          void refetchForm();
        }}
      />

      {/* Main Workspace split */}
      <div className="flex-1 flex overflow-hidden">
        <FieldSidebar onDragStart={onDragStart} />

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
            <Background
              variant={BackgroundVariant.Dots}
              color={isDark ? "rgba(255, 255, 255, 0.25)" : "rgba(13, 33, 55, 0.3)"}
              gap={16}
              size={1.5}
            />

            <Panel
              position="bottom-left"
              className="bg-white dark:bg-[#1c1c1e] border-2 border-[#0d2137]/15 dark:border-white/10 rounded-md p-1 shadow-[2px_2px_0px_0px_rgba(13,33,55,0.05)] flex flex-col gap-1 z-10"
            >
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

        <FieldInspector
          selectedField={selectedField}
          label={label}
          setLabel={setLabel}
          placeholder={placeholder}
          setPlaceholder={setPlaceholder}
          description={description}
          setDescription={setDescription}
          isRequired={isRequired}
          handleRequiredChange={handleRequiredChange}
          optionsList={optionsList}
          setOptionsList={setOptionsList}
          updateLocal={updateLocal}
          handleDeleteField={handleDeleteField}
        />
      </div>

      <DeleteFormDialog
        show={showDeleteConfirm}
        formTitle={form.title}
        deletePending={deletePending}
        onCancel={() => setShowDeleteConfirm(false)}
        onConfirm={async () => {
          try {
            isDirtyRef.current = false;
            await deleteFormAsync({ id: formId });
            toast.success("Blueprint deleted");
            router.push("/dashboard/sketches");
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to delete");
            setShowDeleteConfirm(false);
          }
        }}
      />

      <UnsavedDialog
        show={showUnsavedDialog}
        onCancel={() => setShowUnsavedDialog(false)}
        onDiscard={() => {
          isDirtyRef.current = false;
          setDirtyIds(new Set());
          setPendingDeletes(new Set());
          setShowUnsavedDialog(false);
          if (pendingNavRef.current) window.location.href = pendingNavRef.current;
        }}
        onSaveAndLeave={async () => {
          await handleSave();
          isDirtyRef.current = false;
          setDirtyIds(new Set());
          setPendingDeletes(new Set());
          setShowUnsavedDialog(false);
          if (pendingNavRef.current) window.location.href = pendingNavRef.current;
        }}
      />
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
