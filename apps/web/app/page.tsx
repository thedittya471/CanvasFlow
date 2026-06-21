"use client";

import React, { useState, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type Connection,
  addEdge,
  MarkerType
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  BarChart3,
  MousePointerClick,
  Compass,
  Wallet,
  Check,
  ChevronDown,
  Layout,
  Cpu,
  MonitorCheck,
  Database,
  ArrowRightLeft,
  Smartphone,
  Info
} from "lucide-react";

// Custom node rendering matching the architectural paper theme
const CustomInputNode = ({ data }: { data: { type: string; label: string; placeholder?: string; options?: string[] } }) => {
  return (
    <div className="bg-[#faf8f5] border-2 border-[#0d2137] rounded p-2.5 w-[140px] text-left space-y-1.5 font-serif shadow-[2px_2px_0px_0px_#8e6e53]">
      <div className="flex items-center justify-between text-[7px] uppercase tracking-wider font-extrabold text-[#8e6e53] font-sans">
        <span>{data.type}</span>
      </div>
      <div className="text-[10px] font-bold text-[#0d2137] truncate">{data.label}</div>
      {data.options ? (
        <div className="space-y-1 font-sans">
          {data.options.map((opt, i) => (
            <div key={i} className="flex items-center gap-1 text-[8px] text-[#0d2137]/80 bg-[#f3ebd8]/55 px-1.5 py-0.5 rounded border border-[#0d2137]/10">
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
      <button disabled className="w-full bg-[#faf8f5] text-[#0d2137] py-1 text-[9px] font-bold uppercase rounded border border-[#0d2137]">
        {data.label}
      </button>
    </div>
  );
};

const nodeTypes = {
  inputField: CustomInputNode,
  submitNode: CustomSubmitNode,
  formField: CustomInputNode
};

const initialNodes: Node[] = [
  {
    id: "landing-n1",
    type: "inputField",
    position: { x: 30, y: 15 },
    data: { type: "Short Text", label: "Your Name", placeholder: "Type name here..." }
  },
  {
    id: "landing-n2",
    type: "inputField",
    position: { x: 30, y: 125 },
    data: { type: "Single Select", label: "Fav Genre", options: ["Shonen", "Seinen"] }
  },
  {
    id: "landing-n4",
    type: "submitNode",
    position: { x: 260, y: 80 },
    data: { label: "Submit Survey" }
  }
];

const initialEdges: Edge[] = [
  {
    id: "e1-4",
    source: "landing-n1",
    target: "landing-n4",
    animated: true,
    style: { stroke: "#0d2137", strokeWidth: 1.5 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#0d2137" }
  },
  {
    id: "e2-4",
    source: "landing-n2",
    target: "landing-n4",
    animated: true,
    style: { stroke: "#8e6e53", strokeWidth: 1.5 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#8e6e53" }
  }
];

export default function LandingPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(initialEdges);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const faqs = [
    {
      q: "What is an architectural node canvas?",
      a: "Instead of traditional linear form builders, CanvasFlow uses a drag-and-drop workspace layout. Form fields are treated as interactive components mapped on a structural layout, giving you full control over design layout positioning."
    },
    {
      q: "Are the label keys truly immutable?",
      a: "Yes. When a field is renamed for the first time by the creator, the system generates a unique slugified identifier. This label key is locked permanently, ensuring submission payloads don't break if you adjust client labels later."
    },
    {
      q: "Is there a limit on how many forms I can create?",
      a: "On the Free tier, you can create up to 5 forms per month and receive up to 100 submissions per month. Our Pro, Pro+, and Business plan limits will scale further soon."
    }
  ];

  return (
    <div className="min-h-screen bg-[#faf7f0] text-[#0d2137] selection:bg-[#0d2137] selection:text-[#faf7f0] transition-colors duration-300">
      
      {/* Top Navbar */}
      <nav className="border-b-2 border-[#0d2137]/15 px-8 py-5 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <Image
            src="/logo-removebg-preview.png"
            alt="CanvasFlow Logo"
            width={40}
            height={40}
            className="rounded-lg object-contain"
          />
          <span className="font-serif font-bold text-lg tracking-tight">CanvasFlow</span>
        </div>

        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="text-xs font-serif font-semibold hover:text-[#8e6e53] transition-colors">
            Builder
          </Link>
          <Link href="/dashboard" className="text-xs font-serif font-semibold hover:text-[#8e6e53] transition-colors">
            Templates
          </Link>
          <Link href="/dashboard/pricing" className="text-xs font-serif font-semibold hover:text-[#8e6e53] transition-colors flex items-center gap-1">
            Pricing
          </Link>
          <Link href="/signIn" className="text-xs font-serif font-semibold hover:text-[#8e6e53] transition-colors">
            Log In
          </Link>
          <Link
            href="/signIn"
            className="px-4 py-2 bg-[#0d2137] text-[#faf7f0] border-2 border-[#0d2137] rounded font-serif font-bold text-xs shadow-[3px_3px_0px_0px_#8e6e53] hover:shadow-[1px_1px_0px_0px_#8e6e53] hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer"
          >
            Start Building
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-24 text-center space-y-8 relative">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f3ebd8] border border-[#0d2137]/15 text-[10px] font-sans font-bold uppercase tracking-wider text-[#0d2137]/70">
          <span className="w-1.5 h-1.5 rounded-full bg-[#8e6e53] animate-ping" />
          <span>Now in v2.0 Release</span>
        </div>
        
        <div className="relative max-w-3xl mx-auto">
          <h1 className="text-5xl sm:text-6xl font-serif font-bold tracking-tight leading-[1.08] text-[#0d2137]">
            Forms, but <span className="text-[#8e6e53]">faster.</span>
          </h1>
          
          {/* Floating blueprint robot mascot on the right */}
          <div className="absolute -right-32 top-4 hidden lg:block animate-bounce" style={{ animationDuration: '4s' }}>
            <div className="bg-[#faf8f5] border-2 border-[#0d2137] rounded-2xl p-4 flex flex-col items-center shadow-[4px_4px_0px_0px_#8e6e53] relative w-24">
              <div className="w-12 h-8 bg-[#f3ebd8] rounded-full flex items-center justify-center gap-2 relative border-2 border-[#0d2137]">
                <div className="size-2 rounded-full bg-[#8e6e53]" />
                <div className="size-2 rounded-full bg-[#8e6e53]" />
                <div className="absolute -bottom-1.5 w-6 h-2 border-b-2 border-[#0d2137] rounded-full" />
              </div>
              <div className="w-6 h-1 bg-[#8e6e53]/40 mt-1 rounded" />
              <div className="w-16 h-10 bg-[#faf8f5] border-2 border-[#0d2137] rounded-lg mt-3 flex items-center justify-center relative">
                <span className="text-[7px] font-mono font-bold text-[#0d2137]">CF v2.0</span>
              </div>
            </div>
          </div>
        </div>

        <p className="max-w-xl mx-auto text-sm text-[#0d2137]/75 leading-relaxed font-sans font-medium">
          Create, publish, and analyze dynamic forms from one community-native workspace. Built for developers who value performance and clean data.
        </p>

        <div className="flex items-center justify-center gap-4 pt-2">
          <Link
            href="/signIn"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#0d2137] text-[#faf7f0] border-2 border-[#0d2137] rounded font-serif font-bold text-xs shadow-[4px_4px_0px_0px_#8e6e53] hover:shadow-[1px_1px_0px_0px_#8e6e53] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
          >
            <span>Start Building</span>
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/signIn"
            className="px-6 py-3 border-2 border-[#0d2137] hover:bg-[#f3ebd8]/30 text-[#0d2137] rounded font-serif font-bold text-xs transition-all shadow-[2px_2px_0px_0px_#8e6e53]"
          >
            Explore Templates
          </Link>
        </div>
      </section>

      {/* Editor Mockup Wrapper */}
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
                  <div className="px-2 py-1.5 text-[9px] uppercase tracking-wider text-[#0d2137]/60 font-extrabold">navigation</div>
                  <div className="px-2 py-1.5 rounded text-[10px] text-[#0d2137] flex items-center gap-2 bg-[#faf8f5]/65 border border-[#0d2137]/15">
                    <Compass className="size-3 text-[#8e6e53]" /> Studio
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="px-2 py-1.5 text-[9px] uppercase tracking-wider text-[#0d2137]/60 font-extrabold">forms</div>
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
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-700 text-[8px] font-bold border border-emerald-500/20 font-sans">Published</span>
              </div>
              <div className="flex gap-2">
                <button className="px-2 py-1 bg-[#faf8f5] hover:bg-[#f3ebd8]/30 border border-[#0d2137]/20 text-[#0d2137] rounded text-[9px] font-serif font-bold">Share</button>
                <button className="px-2 py-1 bg-[#0d2137] text-[#faf7f0] rounded text-[9px] font-serif font-bold">Publish</button>
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
              >
                <Background color="#0d2137" gap={16} />
              </ReactFlow>
            </div>
          </div>

          {/* Mock Settings panel */}
          <div className="col-span-3 border-l-2 border-[#0d2137] bg-[#f3ebd8] p-4 text-left space-y-4 font-serif">
            <h3 className="font-bold text-xs text-[#0d2137] border-b border-[#0d2137]/15 pb-2">Settings</h3>
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-wider text-[#0d2137]/60 font-bold font-sans">Label</label>
                <input disabled type="text" value="Fav Genre" className="w-full bg-[#faf8f5] border border-[#0d2137]/25 p-1.5 text-[10px] text-[#0d2137] rounded focus:outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-wider text-[#0d2137]/60 font-bold font-sans">Type</label>
                <select disabled className="w-full bg-[#faf8f5] border border-[#0d2137]/25 p-1.5 text-[10px] text-[#0d2137]/70 rounded focus:outline-none">
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
                <label className="text-[9px] uppercase tracking-wider text-[#0d2137]/60 font-bold font-sans">Options</label>
                <div className="space-y-1">
                  <div className="bg-[#faf8f5] border border-[#0d2137]/20 px-2 py-1 text-[9px] text-[#0d2137] rounded">Action</div>
                  <div className="bg-[#faf8f5] border border-[#0d2137]/20 px-2 py-1 text-[9px] text-[#0d2137] rounded">Adventure</div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Real-time Analytics Widget relocated to the right settings panel corner */}
          <div className="absolute right-6 bottom-6 bg-[#faf8f5] border-2 border-[#0d2137] rounded-lg p-3 shadow-[3px_3px_0px_0px_#8e6e53] flex items-center gap-3 text-left z-20 font-serif">
            <div className="space-y-0.5">
              <span className="text-[8px] uppercase tracking-wider text-[#0d2137]/60 font-bold font-sans block">Real-time Analytics</span>
              <div className="w-16 h-1.5 bg-[#f3ebd8] rounded-full overflow-hidden border border-[#0d2137]/15">
                <div className="w-[82%] h-full bg-[#0d2137]" />
              </div>
            </div>
            <div className="text-sm font-bold text-emerald-600">+12.4%</div>
          </div>
        </div>
      </section>

      {/* Tech Stack Integrations Showcase */}
      <section className="bg-[#f3ebd8]/20 border-y-2 border-[#0d2137]/10 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-left space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#8e6e53] font-sans">compatibility engine</span>
            <h3 className="font-serif font-bold text-lg text-[#0d2137]">Engineered for Modern Web Architectures</h3>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-xs font-serif font-semibold text-[#0d2137]/60">
            <span className="px-3 py-1.5 rounded bg-[#faf8f5] border border-[#0d2137]/15 shadow-[2px_2px_0px_0px_#8e6e53] flex items-center gap-1.5"><Cpu className="size-3.5" /> Next.js 16</span>
            <span className="px-3 py-1.5 rounded bg-[#faf8f5] border border-[#0d2137]/15 shadow-[2px_2px_0px_0px_#8e6e53] flex items-center gap-1.5"><Database className="size-3.5" /> Drizzle ORM</span>
            <span className="px-3 py-1.5 rounded bg-[#faf8f5] border border-[#0d2137]/15 shadow-[2px_2px_0px_0px_#8e6e53] flex items-center gap-1.5"><ArrowRightLeft className="size-3.5" /> tRPC Client</span>
          </div>
        </div>
      </section>

      {/* Philosophy Callout Section */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center space-y-6">
        <div className="text-sm font-sans font-bold uppercase tracking-widest text-[#8e6e53]">The Philosophy of Data Design</div>
        <blockquote className="font-serif italic text-2xl md:text-3xl text-[#0d2137] leading-relaxed">
          &ldquo;Form building is not about stacking fields. It is about sketching the schema that routes digital experiences. Every layout is a blueprint, every field an ink line.&rdquo;
        </blockquote>
        <div className="w-12 h-1 bg-[#8e6e53] mx-auto rounded" />
      </section>

      {/* Live Form Mockup Preview Section */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center border-t border-[#0d2137]/10">
        <div className="lg:col-span-5 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 p-1.5 bg-[#f3ebd8] border border-[#0d2137]/15 rounded text-[10px] font-sans font-bold uppercase tracking-wider">
            <Smartphone className="size-3.5 text-[#8e6e53]" />
            <span>Responsive Blueprints</span>
          </div>
          <h2 className="text-3xl font-serif font-bold text-[#0d2137] tracking-tight">
            Perfect Client Rendering
          </h2>
          <p className="text-xs text-[#0d2137]/75 font-sans leading-relaxed">
            Every structural draft designed in the editor translates into a clean, mobile-responsive layout for your clients. We build form controls that align with modern web access standards automatically.
          </p>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded bg-[#f3ebd8] border border-[#0d2137] flex items-center justify-center font-bold text-[10px] text-[#0d2137] shrink-0">✓</div>
              <p className="text-xs text-[#0d2137]/80 font-sans"><strong className="font-serif">Adaptive Layouts</strong>: Fully responsive grids fitting mobile, tablet, and desktop viewports.</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded bg-[#f3ebd8] border border-[#0d2137] flex items-center justify-center font-bold text-[10px] text-[#0d2137] shrink-0">✓</div>
              <p className="text-xs text-[#0d2137]/80 font-sans"><strong className="font-serif">Semantic HTML</strong>: Built in compliance with accessibility guidelines and form validations.</p>
            </div>
          </div>
        </div>

        {/* Mock Device Container */}
        <div className="lg:col-span-7 flex justify-center">
          <div className="w-[300px] h-[500px] bg-[#faf8f5] border-4 border-[#0d2137] rounded-[36px] shadow-[8px_8px_0px_0px_#8e6e53] overflow-hidden p-6 relative flex flex-col justify-between">
            <div className="w-20 h-4 bg-[#0d2137] rounded-full mx-auto mb-4" />
            
            <div className="flex-1 space-y-5 text-left pt-4">
              <div className="space-y-1">
                <h4 className="font-serif font-bold text-lg text-[#0d2137]">Anime Fan Survey</h4>
                <p className="text-[10px] text-[#0d2137]/60 font-sans">Please fill out the layout draft below.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#0d2137] font-serif uppercase tracking-wider">Your Name</label>
                  <input type="text" placeholder="Type name here..." className="w-full bg-[#f3ebd8]/20 border border-[#0d2137]/25 p-2 text-xs rounded focus:outline-none" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#0d2137] font-serif uppercase tracking-wider">Fav Genre</label>
                  <div className="space-y-1">
                    <label className="flex items-center gap-2 text-xs text-[#0d2137]/80 bg-[#f3ebd8]/40 border border-[#0d2137]/15 p-2 rounded cursor-pointer">
                      <input type="radio" name="mock-r" className="accent-[#0d2137]" /> Action
                    </label>
                    <label className="flex items-center gap-2 text-xs text-[#0d2137]/80 bg-[#f3ebd8]/40 border border-[#0d2137]/15 p-2 rounded cursor-pointer">
                      <input type="radio" name="mock-r" className="accent-[#0d2137]" /> Adventure
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <button className="w-full bg-[#0d2137] hover:bg-[#1a3854] text-[#faf7f0] py-2.5 rounded font-serif font-bold uppercase tracking-wider text-xs shadow-[2px_2px_0px_0px_#8e6e53] transition-all">
              Submit Survey
            </button>
          </div>
        </div>
      </section>

      {/* Feature Details Grid Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 border-t border-[#0d2137]/10">
        <div className="text-center space-y-3 mb-16">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#8e6e53] font-sans">core architecture</span>
          <h2 className="text-3xl font-serif font-bold text-[#0d2137]">Crafted for Schema Stability</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="flex items-start gap-4 text-left">
            <div className="p-3 bg-[#f3ebd8] border-2 border-[#0d2137] rounded shadow-[2px_2px_0px_0px_#8e6e53] shrink-0">
              <Zap className="size-5 text-[#8e6e53]" />
            </div>
            <div className="space-y-2">
              <h4 className="font-serif font-bold text-base text-[#0d2137]">Durable Schema Keys</h4>
              <p className="text-xs text-[#0d2137]/75 font-sans leading-relaxed">
                When fields are added to the canvas, they initialize with clean, safe schemas. First-time updates slugify the user label into an immutable DB identifier. Your endpoints and webhook consumers will never suffer database structural errors during subsequent renames.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 text-left">
            <div className="p-3 bg-[#f3ebd8] border-2 border-[#0d2137] rounded shadow-[2px_2px_0px_0px_#8e6e53] shrink-0">
              <ShieldCheck className="size-5 text-[#8e6e53]" />
            </div>
            <div className="space-y-2">
              <h4 className="font-serif font-bold text-base text-[#0d2137]">Plan-Based Limitations</h4>
              <p className="text-xs text-[#0d2137]/75 font-sans leading-relaxed">
                We count user drafts and active submission endpoints dynamically matching database allocations. The backend actively controls schema counts and responses in compliance with workspace limits (e.g. 5 forms/month for the Free tier).
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 text-left">
            <div className="p-3 bg-[#f3ebd8] border-2 border-[#0d2137] rounded shadow-[2px_2px_0px_0px_#8e6e53] shrink-0">
              <BarChart3 className="size-5 text-[#8e6e53]" />
            </div>
            <div className="space-y-2">
              <h4 className="font-serif font-bold text-base text-[#0d2137]">Conversion Metrics</h4>
              <p className="text-xs text-[#0d2137]/75 font-sans leading-relaxed">
                Integrated tracking logs view counts and user-agent classifications immediately. Your dashboard provides a simple device distribution breakdown, submission growth rates, and sketch stats.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 text-left">
            <div className="p-3 bg-[#f3ebd8] border-2 border-[#0d2137] rounded shadow-[2px_2px_0px_0px_#8e6e53] shrink-0">
              <Info className="size-5 text-[#8e6e53]" />
            </div>
            <div className="space-y-2">
              <h4 className="font-serif font-bold text-base text-[#0d2137]">Compact Canvas Controls</h4>
              <p className="text-xs text-[#0d2137]/75 font-sans leading-relaxed">
                Connect fields, position nodes dynamically, and edit attributes in the inspector drawer. Our editor maps canvas positions cleanly to output nodes, making design configurations quick and painless.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-[#f3ebd8]/20 border-t border-[#0d2137]/15 py-20 px-6">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-2xl font-serif font-bold text-[#0d2137]">Frequently Asked Questions</h2>
            <p className="text-xs text-[#0d2137]/65">Got questions? We have compiled explanations about the architectural canvas builder.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={index} className="bg-[#faf8f5] border-2 border-[#0d2137] rounded-lg overflow-hidden transition-all duration-300 shadow-[2px_2px_0px_0px_#8e6e53]">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left font-serif font-bold text-sm text-[#0d2137] hover:bg-[#f3ebd8]/20 transition-colors focus:outline-none cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`size-4 text-[#8e6e53] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 border-t border-[#0d2137]/10 text-xs text-[#0d2137]/80 leading-relaxed font-sans">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#0d2137]/15 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Image
              src="/logo-removebg-preview.png"
              alt="CanvasFlow Logo"
              width={40}
              height={40}
              className="rounded-lg object-contain shadow-[2px_2px_0px_0px_#8e6e53]"
            />
            <span className="font-serif font-bold text-sm text-[#0d2137]">CanvasFlow</span>
          </div>
          <p className="text-[10px] text-[#0d2137]/50 font-sans">
            &copy; 2026 CanvasFlow Studio. Built for architects of digital data.
          </p>
        </div>
      </footer>
    </div>
  );
}
