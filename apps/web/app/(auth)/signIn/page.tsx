"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Compass } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSignIn } from "~/hooks/api/auth";
import { toast } from "sonner";
import { SignInUserWithEmailAndPasswordInputModel } from "@repo/trpc/client";

type SignInValues = z.infer<typeof SignInUserWithEmailAndPasswordInputModel>;

export default function SignInPage() {
  const router = useRouter();
  const { signInUserWithEmailAndPassword, isPending } = useSignIn();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInValues>({
    resolver: zodResolver(SignInUserWithEmailAndPasswordInputModel),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: SignInValues) => {
    signInUserWithEmailAndPassword(data, {
      onSuccess: () => {
        toast.success("Signed in successfully! Welcome back.");
        router.push("/dashboard");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to sign in. Please try again.");
      },
    });
  };

  return (
    <div className="flex flex-col justify-between h-full w-full">
      {/* Top spacer or header */}
      <div className="flex justify-between items-center select-none opacity-0 md:opacity-100">
        <span className="text-xs uppercase tracking-widest text-[#0d2137]/60 dark:text-[#faf7f0]/60 font-semibold">
          Studio Portal
        </span>
      </div>

      {/* Main Form Content */}
      <div className="my-auto py-8">
        <div className="bg-white dark:bg-[#1c1c1e] p-8 md:p-10 rounded border-2 border-[#0d2137] dark:border-[#2a2a2a] shadow-[6px_6px_0px_0px_#0d2137] dark:shadow-[6px_6px_0px_0px_#2a2a2a] max-w-md mx-auto w-full transition-colors duration-300">
          {/* Form Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-serif text-[#0d2137] dark:text-white font-semibold tracking-tight">
              Sign in to your Studio
            </h1>
            <p className="text-xl font-caveat text-[#8e6e53] dark:text-[#d4af37] mt-2 italic">
              Welcome back, Architect.
            </p>
          </div>

          {/* Form Fields */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#0d2137]/70 dark:text-[#faf7f0]/70 font-semibold mb-2 font-serif">
                <Mail className="size-3.5" />
                Email Address
              </label>
              <input
                type="email"
                placeholder="master@studio.com"
                {...register("email")}
                className="w-full bg-[#faf7f0] dark:bg-[#2c2c2e] border-2 border-[#0d2137] dark:border-[#3a3a3c] p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#8e6e53] dark:focus:ring-[#d4af37] text-[#0d2137] dark:text-white font-serif rounded transition-colors duration-300"
              />
              {errors.email && (
                <p className="text-[11px] text-[#e11d48] font-serif mt-1.5 ml-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#0d2137]/70 dark:text-[#faf7f0]/70 font-semibold font-serif">
                  <Lock className="size-3.5" />
                  Password
                </label>
                <Link
                  href="#"
                  className="text-xs font-serif text-[#8e6e53] dark:text-[#d4af37] hover:underline"
                >
                  Forgotten Draft?
                </Link>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                {...register("password")}
                className="w-full bg-[#faf7f0] dark:bg-[#2c2c2e] border-2 border-[#0d2137] dark:border-[#3a3a3c] p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#8e6e53] dark:focus:ring-[#d4af37] text-[#0d2137] dark:text-white rounded transition-colors duration-300"
              />
              {errors.password && (
                <p className="text-[11px] text-[#e11d48] font-serif mt-1.5 ml-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#0d2137] dark:bg-[#b9c9df] text-[#faf7f0] dark:text-[#0d2137] p-3 font-serif hover:bg-[#1a3854] dark:hover:bg-[#ccdcf2] active:bg-[#071321] transition-colors border-2 border-[#0d2137] dark:border-[#b9c9df] shadow-[3px_3px_0px_0px_#8e6e53] dark:shadow-[3px_3px_0px_0px_#d4af37] hover:shadow-[1px_1px_0px_0px_#8e6e53] dark:hover:shadow-[1px_1px_0px_0px_#d4af37] flex items-center justify-center gap-2 font-semibold uppercase tracking-wider text-xs rounded cursor-pointer disabled:opacity-50"
            >
              {isPending ? "Opening..." : "Open Studio Å"}
              <Compass className={`size-4 ${isPending ? "animate-spin" : "animate-spin-slow"}`} />
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8 text-center">
            <hr className="border-[#0d2137]/20 dark:border-[#faf7f0]/20 border-dashed" />
            <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-[#1c1c1e] px-4 text-[10px] uppercase tracking-widest text-[#0d2137]/60 dark:text-[#faf7f0]/60 font-semibold font-serif transition-colors duration-300">
              The Foundry
            </span>
          </div>

          {/* Footer Link */}
          <p className="text-center text-sm font-serif text-[#0d2137]/85 dark:text-[#faf7f0]/85">
            New Apprentice?{" "}
            <Link
              href="/signUp"
              className="text-[#8e6e53] dark:text-[#d4af37] hover:underline font-bold"
            >
              Create an Account
            </Link>
          </p>
        </div>
      </div>

      {/* Footer bottom right */}
      <div className="flex justify-between items-center text-[10px] text-[#0d2137]/60 dark:text-[#faf7f0]/60 font-serif select-none">
        <span>© 1892 Blueprint & Artisan Co.</span>
        <span className="hidden md:inline">Draft v1.0.0</span>
      </div>
    </div>
  );
}