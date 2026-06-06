"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  MessageCircle,
  ShieldCheck,
  Zap,
  Heart,
} from "lucide-react";

// ── Animated quiz preview steps ──────────────────────────────────────────────

const QUIZ_STEPS = [
  { label: "Skin Type",  answer: "Oily",      emoji: "💧" },
  { label: "Concern",    answer: "Acne",      emoji: "🌿" },
  { label: "Budget",     answer: "$10 – $20", emoji: "💰" },
  { label: "Preference", answer: "K-Beauty",  emoji: "✨" },
];

const FEATURES = [
  {
    icon: Zap,
    title: "Instant match",
    desc: "Get results in under 30 seconds",
  },
  {
    icon: MessageCircle,
    title: "English & Khmer",
    desc: "Ask in the language you prefer",
  },
  {
    icon: ShieldCheck,
    title: "Science-backed",
    desc: "Matched to real ingredient data",
  },
  {
    icon: Heart,
    title: "Personalized",
    desc: "Tailored to your unique skin",
  },
];

export function AIAdvisorBanner() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const t = setInterval(
      () => setActiveStep((prev) => (prev + 1) % QUIZ_STEPS.length),
      2000,
    );
    return () => clearInterval(t);
  }, []);

  return (
    <section className="bg-[#111111] py-14 md:py-16">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
          {/* ── Left: Copy + features ── */}
          <div>
            {/* Badge */}
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 px-3.5 py-1.5">
              <Sparkles size={12} className="text-[#9055A2]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">
                AI Beauty Advisor
              </span>
            </div>

            {/* Headline */}
            <h2 className="font-serif text-3xl font-normal leading-tight text-white md:text-4xl">
              Not sure where
              <br />
              <span className="text-white/35">to start?</span>
            </h2>

            {/* Body */}
            <p className="mt-3 max-w-md text-[14px] leading-relaxed text-white/45">
              Answer a few quick questions about your skin type, main concern,
              and budget. Our AI recommends the perfect products — personalised
              just for you, in English or Khmer.
            </p>

            {/* Feature grid */}
            <div className="mt-7 grid grid-cols-2 gap-x-6 gap-y-4">
              {FEATURES.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/[0.07]">
                    <Icon size={14} className="text-white/50" />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-white/80">
                      {title}
                    </p>
                    <p className="text-[11px] leading-snug text-white/30">
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/ai-advisor"
                className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-7 text-sm font-semibold text-[#111111] transition-opacity hover:opacity-90"
              >
                <Sparkles size={14} className="text-[#9055A2]" />
                Ask AI Advisor
              </Link>
              <Link
                href="/ai-advisor"
                className="inline-flex h-11 items-center gap-2 rounded-full border border-white/20 px-7 text-sm font-medium text-white/70 transition-all hover:border-white/40 hover:text-white"
              >
                Take the Quiz
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* ── Right: Animated quiz card ── */}
          <div className="flex justify-center md:justify-end">
            <div className="w-full max-w-[340px] rounded-[24px] border border-white/[0.08] bg-white/[0.04] p-6 backdrop-blur-sm">
              {/* Card header */}
              <div className="mb-5 flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#9055A2]/20">
                  <Sparkles size={15} className="text-[#C490D4]" />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-white/80">
                    Skin Analysis
                  </p>
                  <p className="text-[10px] text-white/30">
                    4 quick questions
                  </p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-5 flex gap-1.5">
                {QUIZ_STEPS.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                      i <= activeStep ? "bg-white" : "bg-white/10"
                    }`}
                  />
                ))}
              </div>

              {/* Step rows */}
              <div className="space-y-2">
                {QUIZ_STEPS.map((step, i) => {
                  const isActive = i === activeStep;
                  const isDone = i < activeStep;
                  return (
                    <div
                      key={step.label}
                      className={`flex items-center justify-between rounded-[14px] px-4 py-3 transition-all duration-500 ${
                        isActive
                          ? "bg-white shadow-[0_4px_20px_rgba(255,255,255,0.08)]"
                          : isDone
                            ? "bg-white/[0.08]"
                            : "bg-white/[0.03]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">{step.emoji}</span>
                        <span
                          className={`text-[13px] font-medium ${
                            isActive ? "text-[#111]" : "text-white/35"
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                      {(isActive || isDone) && (
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold transition-all duration-300 ${
                            isActive
                              ? "bg-[#111] text-white"
                              : "bg-white/15 text-white/45"
                          }`}
                        >
                          {step.answer}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-4">
                <p className="text-[11px] text-white/25">
                  Step {activeStep + 1} of {QUIZ_STEPS.length}
                </p>
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#C490D4]">
                  <Sparkles size={10} />
                  AI analyzing…
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
