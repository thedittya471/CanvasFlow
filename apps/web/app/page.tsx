"use client";

import React from "react";
import { authClient } from "~/lib/auth-client";
import { LandingNav } from "~/components/landing/LandingNav";
import { HeroSection } from "~/components/landing/HeroSection";
import { EditorMockup } from "~/components/landing/EditorMockup";
import { TechStackBanner } from "~/components/landing/TechStackBanner";
import { PhilosophySection } from "~/components/landing/PhilosophySection";
import { MobilePreview } from "~/components/landing/MobilePreview";
import { FeaturesGrid } from "~/components/landing/FeaturesGrid";
import { FaqSection } from "~/components/landing/FaqSection";
import { LandingFooter } from "~/components/landing/LandingFooter";

export default function LandingPage() {
  const { data: session } = authClient.useSession();
  const isLoggedIn = !!session;

  return (
    <div className="min-h-screen bg-[#faf7f0] text-[#0d2137] selection:bg-[#0d2137] selection:text-[#faf7f0] transition-colors duration-300">
      <LandingNav isLoggedIn={isLoggedIn} />
      <HeroSection isLoggedIn={isLoggedIn} />
      <EditorMockup />
      <TechStackBanner />
      <PhilosophySection />
      <MobilePreview />
      <FeaturesGrid />
      <FaqSection />
      <LandingFooter />
    </div>
  );
}
