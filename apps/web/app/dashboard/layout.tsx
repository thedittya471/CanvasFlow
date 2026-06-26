"use client";

import React, { useState } from "react";
import { EB_Garamond, Caveat } from "next/font/google";
import Image from "next/image";
import Sidebar from "~/components/Sidebar";
import { Menu, X, Compass, Sparkles } from "lucide-react";
import { DashboardProvider } from "~/providers/dashboard-provider";
import { useCreateForm } from "~/hooks/api/form";
import { toast } from "sonner";
import { useRouter, usePathname } from "next/navigation";

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-garamond",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
});

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [activePlan, setActivePlan] = useState("Free");

  React.useEffect(() => {
    const updatePlan = () => {
      setActivePlan(localStorage.getItem("cf-active-plan") || "Free");
    };
    updatePlan();
    window.addEventListener("activePlanChanged", updatePlan);
    window.addEventListener("storage", updatePlan);
    return () => {
      window.removeEventListener("activePlanChanged", updatePlan);
      window.removeEventListener("storage", updatePlan);
    };
  }, []);
  
  const isBuilderPage = pathname.includes("/dashboard/sketches/") && pathname !== "/dashboard/sketches";
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [slug, setSlug] = useState("");
  // isCreatingForm lives here (outside route boundary) so the overlay
  // persists through navigation until the builder signals it's ready.
  const [isCreatingForm, setIsCreatingForm] = useState(false);

  const { createFormAsync } = useCreateForm();

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug) {
      toast.error("Please enter a title and slug.");
      return;
    }

    const savedTitle = title;
    const savedSlug = slug;
    const savedDesc = description;

    // Close modal and show fullscreen loading immediately
    setCreateModalOpen(false);
    setTitle("");
    setDescription("");
    setSlug("");
    setIsCreatingForm(true);

    createFormAsync({ title: savedTitle, description: savedDesc || undefined, slug: savedSlug })
      .then((data) => {
        router.push(`/dashboard/sketches/${data.id}`);
        // Overlay is hidden by the builder page via setIsCreatingForm(false)
        // once its data has loaded (see BuilderCanvas useEffect).
      })
      .catch((err) => {
        toast.error(err.message || "Failed to create blueprint sketch.");
        setTitle(savedTitle);
        setDescription(savedDesc);
        setSlug(savedSlug);
        setCreateModalOpen(true);
        setIsCreatingForm(false);
      });
  };

  if (isBuilderPage) {
    return (
      <DashboardProvider value={{ openCreateFormModal: () => setCreateModalOpen(true), isCreatingForm, setIsCreatingForm }}>
        {/* Overlay persists on builder page until data is ready */}
        {isCreatingForm && (
          <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#faf7f0] dark:bg-[#121212]">
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-2 border-[#0d2137] dark:border-white border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-serif font-bold uppercase tracking-widest text-[#0d2137]/70 dark:text-white/70">
                Drafting Blueprint...
              </p>
            </div>
          </div>
        )}
        <div className={`${ebGaramond.variable} ${caveat.variable} font-sans min-h-screen bg-[#faf7f0] dark:bg-[#121212] text-[#0d2137] dark:text-[#faf7f0] transition-colors duration-300`}>
          {children}
        </div>
      </DashboardProvider>
    );
  }

  return (
    <DashboardProvider value={{ openCreateFormModal: () => setCreateModalOpen(true), isCreatingForm, setIsCreatingForm }}>
      <div className={`${ebGaramond.variable} ${caveat.variable} font-sans min-h-screen bg-[#faf7f0] dark:bg-[#121212] text-[#0d2137] dark:text-[#faf7f0] flex flex-col md:flex-row transition-colors duration-300`}>

        {/* Fullscreen loading overlay while a new sketch is being created */}
        {isCreatingForm && (
          <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#faf7f0] dark:bg-[#121212]">
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-2 border-[#0d2137] dark:border-white border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-serif font-bold uppercase tracking-widest text-[#0d2137]/70 dark:text-white/70">
                Drafting Blueprint...
              </p>
            </div>
          </div>
        )}
        
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-[#0d2137]/15 dark:border-[#faf7f0]/15 bg-[#faf7f0] dark:bg-[#121212] z-40">
          <div className="flex items-center gap-2">
            <Image
              src="/logo-removebg-preview.png"
              alt="CanvasFlow Logo"
              width={40}
              height={40}
              className="rounded object-contain"
            />
            <span className="font-serif font-semibold text-lg tracking-tight">CanvasFlow</span>
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 cursor-pointer">
            {sidebarOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </header>

        {/* Shared Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
          <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto max-w-7xl mx-auto w-full">
            {/* Shared Top Navbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#0d2137]/10 dark:border-[#faf7f0]/10 pb-4 gap-4 w-full">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setSidebarOpen(true)} 
                  className="p-1 hover:bg-[#faf7f0] dark:hover:bg-[#1c1c1e] rounded border border-[#0d2137]/15 dark:border-[#faf7f0]/15 md:hidden cursor-pointer"
                >
                  <Menu className="size-5" />
                </button>
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-serif font-semibold text-[#0d2137]/60 dark:text-[#faf7f0]/60">
                  <span className="border-b-2 border-[#0d2137] dark:border-white pb-1 pr-1">Overview</span>
                  <span>/</span>
                  <span>CanvasFlow</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3 self-end sm:self-auto">
                <span className="text-xs font-serif italic text-[#0d2137]/60 dark:text-[#faf7f0]/60">Studio Report 2026</span>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-[#d4af37]/15 text-[#8e6e53] dark:text-[#d4af37] border border-[#d4af37]/35 rounded-full text-[10px] font-serif font-bold uppercase tracking-wider">
                  <Sparkles className="size-3 fill-current" />
                  <span>{activePlan} Workspace</span>
                </div>
              </div>
            </div>
            
            {/* Page Content */}
            <div className="w-full">
              {children}
            </div>
          </main>
        </div>

        {/* Create Sketch Modal */}
        {createModalOpen && (
          <div className="fixed inset-0 bg-[#0d2137]/45 dark:bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#1c1c1e] p-8 rounded border-2 border-[#0d2137] dark:border-[#2a2a2a] shadow-[6px_6px_0px_0px_#0d2137] dark:shadow-[6px_6px_0px_0px_#2a2a2a] max-w-md w-full relative transition-colors duration-300">
              
              {/* Close Button */}
              <button 
                onClick={() => setCreateModalOpen(false)} 
                className="absolute top-4 right-4 text-[#0d2137]/65 dark:text-[#faf7f0]/65 hover:text-[#0d2137] dark:hover:text-white cursor-pointer"
              >
                <X className="size-5" />
              </button>

              {/* Modal Header */}
              <div className="mb-6">
                <h3 className="text-3xl font-serif text-[#0d2137] dark:text-white font-semibold tracking-tight">
                  Draft New Sketch
                </h3>
                <p className="text-lg font-caveat text-[#8e6e53] dark:text-[#d4af37] mt-1.5 italic">
                  Define the structural draft, Architect.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleFormSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#0d2137]/70 dark:text-[#faf7f0]/70 font-semibold mb-2 font-serif">
                    Sketch Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="E.g., Quarterly Feedback Loop"
                    value={title}
                    onChange={handleTitleChange}
                    className="w-full bg-[#faf7f0] dark:bg-[#2c2c2e] border-2 border-[#0d2137] dark:border-[#3a3a3c] p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#8e6e53] dark:focus:ring-[#d4af37] text-[#0d2137] dark:text-white font-serif rounded transition-colors duration-300"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#0d2137]/70 dark:text-[#faf7f0]/70 font-semibold mb-2 font-serif">
                    Unique Draft Slug
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3.5 text-xs text-[#0d2137]/50 dark:text-[#faf7f0]/50 font-serif">/</span>
                    <input
                      type="text"
                      required
                      placeholder="quarterly-feedback-loop"
                      value={slug}
                      onChange={handleSlugChange}
                      className="w-full bg-[#faf7f0] dark:bg-[#2c2c2e] border-2 border-[#0d2137] dark:border-[#3a3a3c] p-3 pl-6 text-sm focus:outline-none focus:ring-1 focus:ring-[#8e6e53] dark:focus:ring-[#d4af37] text-[#0d2137] dark:text-white font-serif rounded transition-colors duration-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#0d2137]/70 dark:text-[#faf7f0]/70 font-semibold mb-2 font-serif">
                    Description
                  </label>
                  <textarea
                    placeholder="Brief description of the blueprint draft's intent..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full bg-[#faf7f0] dark:bg-[#2c2c2e] border-2 border-[#0d2137] dark:border-[#3a3a3c] p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#8e6e53] dark:focus:ring-[#d4af37] text-[#0d2137] dark:text-white font-serif rounded transition-colors duration-300 resize-none"
                  />
                </div>

                {/* Submit Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setCreateModalOpen(false)}
                    className="px-4 py-2 border-2 border-[#0d2137]/25 dark:border-[#faf7f0]/25 rounded text-xs uppercase tracking-wider font-serif font-bold text-[#0d2137]/70 dark:text-[#faf7f0]/70 hover:bg-[#0d2137]/5 dark:hover:bg-white/5 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreatingForm}
                    className="bg-[#0d2137] dark:bg-[#b9c9df] text-[#faf7f0] dark:text-[#0d2137] px-5 py-2.5 font-serif hover:bg-[#1a3854] dark:hover:bg-[#ccdcf2] active:bg-[#071321] border-2 border-[#0d2137] dark:border-[#b9c9df] shadow-[3px_3px_0px_0px_#8e6e53] dark:shadow-[3px_3px_0px_0px_#d4af37] hover:shadow-[1px_1px_0px_0px_#8e6e53] dark:hover:shadow-[1px_1px_0px_0px_#d4af37] flex items-center gap-1.5 font-bold uppercase tracking-wider text-xs rounded cursor-pointer disabled:opacity-50"
                  >
                    {isCreatingForm ? "Drafting..." : "Create Sketch"}
                    <Compass className={`size-3.5 ${isCreatingForm ? "animate-spin" : ""}`} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardProvider>
  );
}
