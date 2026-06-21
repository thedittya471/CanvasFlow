"use client";

import React, { useState } from "react";
import { Check, Sparkles, Building2, User, Zap, Flame } from "lucide-react";
import { toast } from "sonner";

interface Plan {
  name: string;
  price: string;
  period: string;
  submissions: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  borderColor: string;
  buttonClass: string;
  features: string[];
  popular?: boolean;
}

export default function SettingsPricingPage() {
  const [activePlan, setActivePlan] = useState<string>("Free");

  React.useEffect(() => {
    const saved = localStorage.getItem("cf-active-plan");
    if (saved === "Free") {
      setActivePlan(saved);
    } else {
      localStorage.setItem("cf-active-plan", "Free");
      setActivePlan("Free");
      window.dispatchEvent(new Event("activePlanChanged"));
    }
  }, []);

  const plans: Plan[] = [
    {
      name: "Free",
      price: "₹0",
      period: "forever",
      submissions: "100 submissions / mo",
      description: "Ideal for testing forms and personal projects.",
      icon: User,
      color: "text-[#0d2137]",
      bgColor: "bg-[#faf8f5]",
      borderColor: "border-[#0d2137]/15",
      buttonClass: "border-2 border-[#0d2137] text-[#0d2137] hover:bg-[#0d2137] hover:text-[#faf7f0]",
      features: [
        "100 Submissions per month",
        "5 Forms per month"
      ]
    },
    {
      name: "Pro",
      price: "₹49.99",
      period: "month",
      submissions: "1,000 submissions / mo",
      description: "Great for freelancers and growing creators.",
      icon: Zap,
      color: "text-[#8e6e53]",
      bgColor: "bg-[#faf8f5]",
      borderColor: "border-[#8e6e53]/30",
      buttonClass: "border-2 border-[#8e6e53] text-[#8e6e53] hover:bg-[#8e6e53] hover:text-[#faf7f0]",
      features: [
        "1,000 Submissions per month",
        "15 Forms per month",
        "Basic data analytics"
      ]
    },
    {
      name: "Pro+",
      price: "₹119",
      period: "month",
      submissions: "5,000 submissions / mo",
      description: "Perfect for active teams and high traffic forms.",
      icon: Flame,
      color: "text-[#d4af37]",
      bgColor: "bg-[#fffdf9]",
      borderColor: "border-[#d4af37]",
      buttonClass: "bg-[#d4af37] text-[#0d2137] hover:bg-[#c29e2f] border-2 border-[#d4af37]",
      popular: true,
      features: [
        "5,000 Submissions per month",
        "30 Forms per month",
        "Basic data analytics"
      ]
    },
    {
      name: "Business",
      price: "₹499",
      period: "month",
      submissions: "25,000 submissions / mo",
      description: "Built for companies requiring scale and security.",
      icon: Building2,
      color: "text-[#0d2137]",
      bgColor: "bg-[#faf8f5]",
      borderColor: "border-[#0d2137]/30",
      buttonClass: "bg-[#0d2137] text-[#faf7f0] hover:bg-[#1a3854] border-2 border-[#0d2137]",
      features: [
        "25,000 Submissions per month",
        "Unlimited forms",
        "Basic data analytics"
      ]
    }
  ];

  const handleSelectPlan = (planName: string) => {
    setActivePlan(planName);
    localStorage.setItem("cf-active-plan", planName);
    window.dispatchEvent(new Event("activePlanChanged"));
    toast.success(`Switched to the ${planName} Plan!`);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12 bg-[#faf7f0] min-h-screen">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f3ebd8] border border-[#0d2137]/15 text-xs font-serif font-semibold text-[#0d2137]">
          <Sparkles className="size-3.5 text-[#8e6e53]" />
          <span>Flexible Plans for Everyone</span>
        </div>
        <h1 className="text-4xl font-serif font-bold text-[#0d2137] tracking-tight md:text-5xl">
          Simple, Transparent Pricing
        </h1>
        <p className="max-w-2xl mx-auto text-sm text-[#0d2137]/70 font-sans leading-relaxed">
          Unlock high-fidelity form designs, real-time submission metrics, and unlimited responses tailored to your project scaling.
        </p>
      </div>

      {/* Grid Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
        {plans.map((plan) => {
          const IconComponent = plan.icon;
          const isCurrent = activePlan === plan.name;

          return (
            <div
              key={plan.name}
              className={`relative flex flex-col justify-between p-6 rounded-xl border-2 transition-all duration-300 ${plan.bgColor} ${
                isCurrent 
                  ? "border-[#0d2137] shadow-[6px_6px_0px_0px_#8e6e53] scale-[1.02]" 
                  : `${plan.borderColor} hover:shadow-[4px_4px_0px_0px_#8e6e53]/35 hover:scale-[1.01]`
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#d4af37] text-[#0d2137] text-[10px] font-sans font-bold uppercase tracking-wider">
                  Popular
                </div>
              )}

              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-lg bg-[#f3ebd8] ${plan.color}`}>
                      <IconComponent className="size-5" />
                    </div>
                    <span className="font-serif font-bold text-lg text-[#0d2137]">{plan.name}</span>
                  </div>
                  {isCurrent && (
                    <span className="px-2 py-0.5 rounded bg-[#0d2137] text-[#faf7f0] text-[9px] font-sans uppercase font-bold tracking-wider">
                      Active
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-serif font-bold text-[#0d2137]">{plan.price}</span>
                    <span className="text-xs text-[#0d2137]/60">/{plan.period}</span>
                  </div>
                  <p className="text-xs font-serif font-semibold text-[#8e6e53]">{plan.submissions}</p>
                </div>

                <p className="text-xs text-[#0d2137]/70 font-sans leading-relaxed min-h-[40px]">
                  {plan.description}
                </p>

                <hr className="border-[#0d2137]/10" />

                <ul className="space-y-2.5">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-[#0d2137]/80">
                      <Check className="size-4 text-[#8e6e53] shrink-0 mt-0.5" />
                      <span className="font-sans leading-tight">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 mt-auto">
                <button
                  disabled={plan.name !== "Free"}
                  onClick={() => handleSelectPlan(plan.name)}
                  className={`w-full py-2.5 px-4 rounded text-xs font-serif font-semibold uppercase tracking-wider transition-all duration-200 ${
                    plan.name !== "Free"
                      ? "bg-[#faf8f5] text-[#0d2137]/45 border-2 border-[#0d2137]/10 cursor-not-allowed"
                      : plan.buttonClass
                  }`}
                >
                  {isCurrent ? "Current Plan" : plan.name === "Free" ? "Select Plan" : "Coming Soon"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
