"use client";

import React, { useCallback } from "react";
import Image from "next/image";
import {
  ReactFlow,
  Background,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type Connection,
  addEdge,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Compass } from "lucide-react";

// Custom node rendering matching the architectural paper theme
const CustomInputNode = ({
  data,
}: {
  data: { type: string; label: string; placeholder?: string; options?: string[] };
}) => {
  return (
    <div className="bg-[#faf8f5] border-2 border-[#0d2137] rounded p-2.5 w-[140px] text-left space-y-1.5 font-serif shadow-[2px_2px_0px_0px_#8e6e53]">
      <div className="flex items-center justify-between text-[7px] uppercase tracking-wider font-extrabold text-[#8e6e53] font-sans">
        <span>{data.type}</span>
      </div>
      <div className="text-[10px] font-bold text-[#0d2137] truncate">{data.label}</div>
      {data.options ? (
        <div className="space-y-1 font-sans">
          {data.options.map((opt, i) => (
            <div
              key={i}
              className="flex items-center gap-1 text-[8px] text-[#0d2137]/80 bg-[#f3ebd8]/55 px-1.5 py-0.5 rounded border border-[#0d2137]/10"
            >
              <span className="text-[7px] text-[#8e6e53]">●</span> {opt}
            </div>
          ))}
        </div>
      ) : (
        <div className="h-5 w-full bg-[#f3ebd8]/40 border border-[#0d2137]/10 rounded text-[8px] px-1.5 flex items-center text-[#0d2137]/50 font-sans">
          {data.placeholder}
        </div>
      )}
    </div>
  );
};

const CustomSubmitNode = ({ data }: { data: { label: string } }) => {
  return (
    <div className="bg-[#0d2137] border-2 border-[#0d2137] rounded p-2.5 w-[125px] text-center space-y-1 font-serif shadow-[2px_2px_0px_0px_#8e6e53]">
      <div className="text-[8px] uppercase tracking-wider font-extrabold text-[#faf7f0]/60 font-sans">
        Action / Submit
      </div>
      <button
        disabled
        className="w-full bg-[#faf8f5] text-[#0d2137] py-1 text-[9px] font-bold uppercase rounded border border-[#0d2137]"
      >
        {data.label}
      </button>
    </div>
  );
};

const nodeTypes = {
  inputField: CustomInputNode,
  submitNode: CustomSubmitNode,
  formField: CustomInputNode,
};

const initialNodes: Node[] = [
  {
    id: "landing-n1",
    type: "inputField",
    position: { x: 30, y: 15 },
    data: { type: "Short Text", label: "Your Name", placeholder: "Type name here..." },
  },
  {
    id: "landing-n2",
    type: "inputField",
    position: { x: 30, y: 125 },
    data: { type: "Single Select", label: "Fav Genre", options: ["Shonen", "Seinen"] },
  },
  {
    id: "landing-n4",
    type: "submitNode",
    position: { x: 260, y: 80 },
    data: { label: "Submit Survey" },
  },
];

const initialEdges: Edge[] = [
  {
    id: "e1-4",
    source: "landing-n1",
    target: "landing-n4",
    animated: true,
    style: { stroke: "#0d2137", strokeWidth: 1.5 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#0d2137" },
  },
  {
    id: "e2-4",
    source: "landing-n2",
    target: "landing-n4",
    animated: true,
    style: { stroke: "#8e6e53", strokeWidth: 1.5 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#8e6e53" },
  },
];

export function EditorMockup() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(initialEdges);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <section className="max-w-6xl mx-auto px-6 pb-20">
      <div className="bg-[#faf8f5] border-2 border-[#0d2137] rounded-2xl overflow-hidden shadow-[6px_6px_0px_0px_#8e6e53] grid grid-cols-12 h-[480px] relative">
        {/* Mock Sidebar */}
        <div className="col-span-3 border-r-2 border-[#0d2137] bg-[#f3ebd8] p-4 flex flex-col justify-between">
          <div className="space-y-6 text-left">
            <div className="flex items-center gap-2 text-[#0d2137] font-serif font-bold text-xs">
              <Image
                src="/logo-removebg-preview.png"
                alt="CanvasFlow Logo"
                width={28}
                height={28}
                className="rounded object-contain"
              />
              <span>CanvasFlow</span>
            </div>
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="px-2 py-1.5 text-[9px] uppercase tracking-wider text-[#0d2137]/60 font-extrabold">
                  navigation
                </div>
                <div className="px-2 py-1.5 rounded text-[10px] text-[#0d2137] flex items-center gap-2 bg-[#faf8f5]/65 border border-[#0d2137]/15">
                  <Compass className="size-3 text-[#8e6e53]" /> Studio
                </div>
              </div>
              <div className="space-y-1">
                <div className="px-2 py-1.5 text-[9px] uppercase tracking-wider text-[#0d2137]/60 font-extrabold">
                  forms
                </div>
                <div className="px-2 py-1.5 rounded text-[10px] text-[#faf7f0] flex items-center gap-2 bg-[#0d2137] border-2 border-[#0d2137] font-serif font-bold shadow-[2px_2px_0px_0px_#8e6e53]">
                  # Anime Survey
                </div>
                <div className="px-2 py-1.5 rounded text-[10px] text-[#0d2137] flex items-center gap-2 hover:bg-[#faf8f5]/40 transition-colors">
                  # Feedback
                </div>
                <div className="px-2 py-1.5 rounded text-[10px] text-[#0d2137] flex items-center gap-2 hover:bg-[#faf8f5]/40 transition-colors">
                  # Gaming
                </div>
              </div>
            </div>
          </div>
          <div className="text-[9px] text-[#0d2137]/50 text-left border-t border-[#0d2137]/15 pt-3 font-serif font-semibold">
            Free Workspace
          </div>
        </div>

        {/* Interactive React Flow Canvas (Center Workspace) */}
        <div className="col-span-6 bg-[#faf8f5] relative overflow-hidden flex flex-col">
          <div className="border-b border-[#0d2137]/15 p-3 flex items-center justify-between bg-[#f3ebd8]/55">
            <div className="flex items-center gap-2 font-serif">
              <span className="text-[10px] font-bold text-[#0d2137]">Anime Fan Survey</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-700 text-[8px] font-bold border border-emerald-500/20 font-sans">
                Published
              </span>
            </div>
            <div className="flex gap-2">
              <button className="px-2 py-1 bg-[#faf8f5] hover:bg-[#f3ebd8]/30 border border-[#0d2137]/20 text-[#0d2137] rounded text-[9px] font-serif font-bold">
                Share
              </button>
              <button className="px-2 py-1 bg-[#0d2137] text-[#faf7f0] rounded text-[9px] font-serif font-bold">
                Publish
              </button>
            </div>
          </div>

          <div className="flex-1 relative">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              fitView
              fitViewOptions={{ padding: 0.4 }}
            >
              <Background color="#0d2137" gap={16} />
            </ReactFlow>
          </div>
        </div>

        {/* Mock Settings panel */}
        <div className="col-span-3 border-l-2 border-[#0d2137] bg-[#f3ebd8] p-4 text-left space-y-4 font-serif">
          <h3 className="font-bold text-xs text-[#0d2137] border-b border-[#0d2137]/15 pb-2">
            Settings
          </h3>
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-wider text-[#0d2137]/60 font-bold font-sans">
                Label
              </label>
              <input
                disabled
                type="text"
                defaultValue="Fav Genre"
                className="w-full bg-[#faf8f5] border border-[#0d2137]/25 p-1.5 text-[10px] text-[#0d2137] rounded focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-wider text-[#0d2137]/60 font-bold font-sans">
                Type
              </label>
              <select
                disabled
                className="w-full bg-[#faf8f5] border border-[#0d2137]/25 p-1.5 text-[10px] text-[#0d2137]/70 rounded focus:outline-none"
              >
                <option>Single Select</option>
              </select>
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="text-[10px] text-[#0d2137] font-semibold">Required Field</span>
              <div className="w-8 h-4 bg-[#0d2137] rounded-full flex items-center justify-end px-0.5">
                <div className="size-3 bg-[#faf7f0] rounded-full" />
              </div>
            </div>
            <div className="space-y-1 pt-1">
              <label className="text-[9px] uppercase tracking-wider text-[#0d2137]/60 font-bold font-sans">
                Options
              </label>
              <div className="space-y-1">
                <div className="bg-[#faf8f5] border border-[#0d2137]/20 px-2 py-1 text-[9px] text-[#0d2137] rounded">
                  Action
                </div>
                <div className="bg-[#faf8f5] border border-[#0d2137]/20 px-2 py-1 text-[9px] text-[#0d2137] rounded">
                  Adventure
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Real-time Analytics Widget */}
        <div className="absolute right-6 bottom-6 bg-[#faf8f5] border-2 border-[#0d2137] rounded-lg p-3 shadow-[3px_3px_0px_0px_#8e6e53] flex items-center gap-3 text-left z-20 font-serif">
          <div className="space-y-0.5">
            <span className="text-[8px] uppercase tracking-wider text-[#0d2137]/60 font-bold font-sans block">
              Real-time Analytics
            </span>
            <div className="w-16 h-1.5 bg-[#f3ebd8] rounded-full overflow-hidden border border-[#0d2137]/15">
              <div className="w-[82%] h-full bg-[#0d2137]" />
            </div>
          </div>
          <div className="text-sm font-bold text-emerald-600">+12.4%</div>
        </div>
      </div>
    </section>
  );
}
