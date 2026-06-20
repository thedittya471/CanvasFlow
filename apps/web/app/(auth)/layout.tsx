"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import { EB_Garamond, Caveat } from "next/font/google";
import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-garamond",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
});

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isSignIn = pathname ? pathname.includes("signIn") : true;
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && theme === "dark";

  return (
    <div className={`${ebGaramond.variable} ${caveat.variable} min-h-screen w-full bg-[#faf7f0] dark:bg-[#141414] text-[#0d2137] dark:text-[#faf7f0] flex font-sans transition-colors duration-300 selection:bg-[#0d2137] dark:selection:bg-[#faf7f0] selection:text-white dark:selection:text-[#0d2137]`}>
      
      {/* Theme Toggle Button */}
      {mounted && (
        <button
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className="fixed top-6 right-6 z-50 p-2.5 rounded-full border-2 border-[#0d2137] dark:border-[#faf7f0] bg-[#faf7f0] dark:bg-[#141414] text-[#0d2137] dark:text-[#faf7f0] hover:bg-[#0d2137] dark:hover:bg-[#faf7f0] hover:text-[#faf7f0] dark:hover:text-[#0d2137] transition-all cursor-pointer shadow-[3px_3px_0px_0px_#0d2137] dark:shadow-[3px_3px_0px_0px_#faf7f0] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#0d2137]"
          title="Toggle Theme"
        >
          {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </button>
      )}

      {/* Outer framing container */}
      <div className="relative w-full min-h-screen h-screen overflow-hidden flex flex-row">
        
        {/* Background panel (watercolor drawing) */}
        <div 
          className="absolute top-0 bottom-0 left-0 w-1/2 h-full z-20 transition-transform duration-700 ease-in-out hidden md:block overflow-hidden border-r-2 border-[#0d2137] dark:border-[#2a2a2a]"
          style={{
            transform: isSignIn ? "translateX(0%)" : "translateX(100%)",
          }}
        >
          <div className="relative w-full h-full bg-[#faf7f0] dark:bg-[#141414]">
            {mounted && (
              <Image 
                src={isDark ? "/dark-backgrounf-image.png" : "/background-image.png"} 
                alt="Blueprint Forms Studio" 
                fill 
                priority
                className="object-cover opacity-95 transition-all duration-500"
              />
            )}
            {/* Dark blueprint gradient overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-[#0d2137]/35 via-transparent to-[#0d2137]/10" />
            
            {/* Branding title and subtitle */}
            <div className="absolute bottom-10 left-10 text-[#faf7f0] select-none">
              <h2 className="text-4xl font-bold tracking-tight font-serif italic text-white drop-shadow-md">
                CanvasFlow
              </h2>
              <p className="text-[10px] tracking-[0.25em] text-[#faf7f0]/90 uppercase font-sans mt-2 drop-shadow-sm font-semibold">
                Architectural Integrity Guaranteed
              </p>
            </div>
          </div>
        </div>

        {/* Form panel container (swaps placement) */}
        <div 
          style={{
            "--form-translate-x": isSignIn ? "100%" : "0%",
          } as React.CSSProperties}
          className="absolute top-0 bottom-0 left-0 w-full md:w-1/2 h-full z-10 transition-transform duration-700 ease-in-out flex flex-col justify-between p-8 md:p-12 bg-[#faf7f0] dark:bg-[#141414] md:translate-x-(--form-translate-x)"
        >
          {children}
        </div>
      </div>
    </div>
  );
}
