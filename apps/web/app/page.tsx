"use client";

import React from "react";
import { authClient } from "~/lib/auth-client";
import { LandingNavSunset } from "~/components/landing/LandingNavSunset";
import { HeroSunset } from "~/components/landing/HeroSunset";
import { HowItWorks } from "~/components/landing/HowItWorks";
import { CutDropOff } from "~/components/landing/CutDropOff";
import { TrackInApp } from "~/components/landing/TrackInApp";
import { ArticleTrio } from "~/components/landing/ArticleTrio";
import { NetworkSection } from "~/components/landing/NetworkSection";
import { StepIntoCanvasFlow } from "~/components/landing/StepIntoCanvasFlow";
import { FooterSunset } from "~/components/landing/FooterSunset";

export default function LandingPage() {
  const { data: session } = authClient.useSession();
  const isLoggedIn = !!session;

  return (
    <div className="cf-landing min-h-screen antialiased overflow-x-clip">
      <LandingNavSunset isLoggedIn={isLoggedIn} />
      <HeroSunset isLoggedIn={isLoggedIn} />
      <HowItWorks isLoggedIn={isLoggedIn} />
      <CutDropOff />
      <TrackInApp />
      <ArticleTrio />
      <NetworkSection isLoggedIn={isLoggedIn} />
      <StepIntoCanvasFlow isLoggedIn={isLoggedIn} />
      <FooterSunset />
    </div>
  );
}
