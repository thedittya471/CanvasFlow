"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Compass } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSignUp } from "~/hooks/api/auth";
import { authClient } from "~/lib/auth-client";
import { toast } from "sonner";

const createUserWithEmailAndPasswordInputModel = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type SignUpValues = z.infer<typeof createUserWithEmailAndPasswordInputModel>;

export default function SignUpPage() {
  const router = useRouter();
  const { createUserWithEmailAndPassword, isPending } = useSignUp();
  const [isSocialPending, setIsSocialPending] = React.useState(false);

  const handleSocialSignIn = async (provider: "google" | "github") => {
    setIsSocialPending(true);
    try {
      await authClient.signIn.social({
        provider,
        callbackURL: window.location.origin + "/auth/callback",
      });
    } catch (err: any) {
      toast.error(err.message || "Failed to initiate social login.");
      setIsSocialPending(false);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpValues>({
    resolver: zodResolver(createUserWithEmailAndPasswordInputModel),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });


  const onSubmit = async (data: SignUpValues) => {
    try {
      await createUserWithEmailAndPassword(data);
      toast.success("Account created successfully! Welcome to the Studio.");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to create account. Please try again.");
    }
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
              Create your Account
            </h1>
            <p className="text-xl font-caveat text-[#8e6e53] dark:text-[#d4af37] mt-2 italic">
              Begin your apprenticeship, Architect.
            </p>
          </div>

          {/* Form Fields */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#0d2137]/70 dark:text-[#faf7f0]/70 font-semibold mb-2 font-serif">
                <User className="size-3.5" />
                Full Name
              </label>
              <input
                type="text"
                placeholder="Leonardo da Vinci"
                {...register("fullName")}
                className="w-full bg-[#faf7f0] dark:bg-[#2c2c2e] border-2 border-[#0d2137] dark:border-[#3a3a3c] p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#8e6e53] dark:focus:ring-[#d4af37] text-[#0d2137] dark:text-white font-serif rounded transition-colors duration-300"
              />
              {errors.fullName && (
                <p className="text-[11px] text-[#e11d48] font-serif mt-1.5 ml-1">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#0d2137]/70 dark:text-[#faf7f0]/70 font-semibold mb-2 font-serif">
                <Mail className="size-3.5" />
                Email Address
              </label>
              <input
                type="email"
                placeholder="apprentice@studio.com"
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
              <label className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#0d2137]/70 dark:text-[#faf7f0]/70 font-semibold mb-2 font-serif">
                <Lock className="size-3.5" />
                Password
              </label>
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
              className="w-full bg-[#0d2137] dark:bg-[#b9c9df] text-[#faf7f0] dark:text-[#0d2137] p-3 font-serif hover:bg-[#1a3854] dark:hover:bg-[#ccdcf2] active:bg-[#071321] transition-colors border-2 border-[#0d2137] dark:border-[#b9c9df] shadow-[3px_3px_0px_0px_#8e6e53] dark:shadow-[3px_3px_0px_0px_#d4af37] hover:shadow-[1px_1px_0px_0px_#8e6e53] dark:hover:shadow-[1px_1px_0px_0px_#d4af37] flex items-center justify-center gap-2 font-semibold uppercase tracking-wider text-xs rounded disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isPending ? "Registering..." : "Register Apprentice Å"}
              <Compass className={`size-4 ${isPending ? "animate-spin" : "animate-spin-slow"}`} />
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8 text-center">
            <hr className="border-[#0d2137]/20 dark:border-[#faf7f0]/20 border-dashed" />
            <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-[#1c1c1e] px-4 text-[10px] uppercase tracking-widest text-[#0d2137]/60 dark:text-[#faf7f0]/60 font-semibold font-serif transition-colors duration-300">
              Or continue with
            </span>
          </div>

          {/* Social Login */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => handleSocialSignIn("google")}
              disabled={isSocialPending}
              className="flex-1 flex items-center justify-center gap-2 p-3 border-2 border-[#0d2137] dark:border-[#3a3a3c] rounded font-serif font-semibold text-xs hover:bg-[#f3ebd8]/30 dark:hover:bg-[#2c2c2e] transition-colors cursor-pointer disabled:opacity-50"
            >
              <svg className="size-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Google
            </button>
            <button
              type="button"
              onClick={() => handleSocialSignIn("github")}
              disabled={isSocialPending}
              className="flex-1 flex items-center justify-center gap-2 p-3 border-2 border-[#0d2137] dark:border-[#3a3a3c] rounded font-serif font-semibold text-xs hover:bg-[#f3ebd8]/30 dark:hover:bg-[#2c2c2e] transition-colors cursor-pointer disabled:opacity-50"
            >
              <svg className="size-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
              GitHub
            </button>
          </div>

          {/* Footer Link */}
          <p className="text-center text-sm font-serif text-[#0d2137]/85 dark:text-[#faf7f0]/85 mt-6">
            Already an Apprentice?{" "}
            <Link
              href="/signIn"
              className="text-[#8e6e53] dark:text-[#d4af37] hover:underline font-bold"
            >
              Sign In
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