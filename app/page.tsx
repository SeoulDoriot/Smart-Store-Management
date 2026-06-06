"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  ScanLine,
} from "lucide-react";
import AuthNavbar from "@/components/auth/AuthNavbar";
import { HomeSections } from "@/components/home/HomeSections";

export default function WelcomePage() {
  const router = useRouter();
  const leavingRef = useRef(false);
  const [mounted, setMounted] = useState(false);
  const [leaving, setLeaving] = useState(false);

  function navigateTo(path: string) {
    if (leavingRef.current) return;
    leavingRef.current = true;
    setLeaving(true);
    setTimeout(() => router.push(path), 350);
  }

  useEffect(() => {
    const mountTimer = setTimeout(() => setMounted(true), 60);

    return () => {
      clearTimeout(mountTimer);
    };
  }, []);

  return (
    <div
      className={`transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        leaving ? "opacity-0 scale-[0.998] blur-[2px]" : "opacity-100 scale-100 blur-0"
      }`}
    >
      {/* ── Hero with its own gradient bg — overflow-x-hidden here only, so sticky sections below work ── */}
      <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-[#FDFCFA] via-white to-[#F7EEE6]">
      <AuthNavbar />
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center gap-14 px-6 pb-28 pt-20 md:flex-row md:gap-12 md:py-0 lg:gap-20">

        {/* ── LEFT: copy + actions ── */}
        <div
          className={`w-full transition-all duration-1000 md:flex-1 ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
          }`}
        >
          {/* Small wordmark */}
          <p className="mb-5 font-serif text-xl font-semibold tracking-wide text-[#111111]">
            Lumière
          </p>

          {/* Badge */}
          <div className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-[#111111] px-3.5 py-1.5">
            <Sparkles size={11} className="text-white/70" />
            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/85">
              AI Beauty Store
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-[2.6rem] font-normal leading-[1.15] text-[#111111] md:text-5xl lg:text-[3.5rem]">
            Beauty shopping,
            <br />
            <span className="text-[#111111]/50">softly personalized.</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-textgray">
            Browse trusted skincare and beauty products, ask our AI advisor,
            and find what fits your skin, budget, and routine.
          </p>

          {/* Buttons */}
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => navigateTo("/home")}
              className="flex h-12 items-center gap-2 rounded-full bg-[#111111] px-7 text-sm font-semibold text-white transition-opacity hover:opacity-80"
            >
              Enter Store
              <ArrowRight size={15} />
            </button>
            <button
              onClick={() => navigateTo("/ai-advisor")}
              className="flex h-12 items-center gap-2 rounded-full border border-[#111111]/15 bg-white px-7 text-sm font-medium text-textdark shadow-sm transition-colors hover:border-[#111111]/30 hover:bg-offwhite"
            >
              <Sparkles size={14} className="text-[#9055A2]" />
              Ask AI Advisor
            </button>
            <button
              onClick={() => navigateTo("/admin")}
              className="flex h-12 items-center gap-2 rounded-full border border-[#111111]/15 bg-white px-7 text-sm font-medium text-textdark shadow-sm transition-colors hover:border-[#111111]/30 hover:bg-offwhite"
            >
              <ShieldCheck size={14} className="text-[#111111]" />
              Admin
            </button>
          </div>

          {/* Trust points */}
          <div className="mt-8 flex flex-col gap-2.5 sm:flex-row sm:gap-7">
            {[
              { icon: ShieldCheck, label: "Authentic products" },
              { icon: Truck,       label: "Fast delivery" },
              { icon: ScanLine,    label: "Easy order tracking" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2">
                <Icon size={14} className="shrink-0 text-textgray" />
                <span className="text-sm text-textgray">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT: product visual ── */}
        <div
          className={`shrink-0 transition-all duration-1000 delay-200 ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
          }`}
        >
          <ProductVisual />
        </div>
      </section>
      </div>{/* end hero gradient wrapper */}

      {/* ── Scroll sections ── */}
      <HomeSections />
    </div>
  );
}

/* ─── Product Visual (right-side card + floating tags) ─── */
function ProductVisual() {
  return (
    <div className="relative h-[400px] w-[280px] md:h-[460px] md:w-[320px]">

      {/* ── Main card ── */}
      <div className="absolute inset-0 overflow-hidden rounded-[32px] bg-gradient-to-b from-[#F0D5CC] to-[#FAF0EC] shadow-[0_20px_60px_rgba(0,0,0,0.10)]">
        {/* Brand initial watermark */}
        <div className="flex h-full items-center justify-center">
          <span
            className="select-none font-serif text-[130px] font-light leading-none text-[#C98A7E] opacity-[0.15]"
            aria-hidden="true"
          >
            L
          </span>
        </div>

        {/* Product name placeholder lines */}
        <div className="absolute bottom-8 left-6 right-6 space-y-2">
          <div className="h-2 w-14 rounded-full bg-white/40" />
          <div className="h-3 w-44 rounded-full bg-white/55" />
          <div className="h-3 w-32 rounded-full bg-white/45" />
        </div>
      </div>

      {/* ── Floating tag: AI Pick (top-right) ── */}
      <div className="animate-float absolute -right-4 top-8 z-10">
        <div className="flex items-center gap-1.5 rounded-2xl bg-[#111111] px-3.5 py-2.5 shadow-xl">
          <Sparkles size={12} className="text-white/75" />
          <span className="text-[11px] font-semibold text-white">AI Pick</span>
        </div>
      </div>

      {/* ── Floating tag: Best Seller (left, upper) ── */}
      <div className="animate-float-slow absolute -left-7 top-[28%] z-10">
        <div className="flex items-center gap-2 rounded-2xl border border-bordergray bg-white px-3.5 py-2.5 shadow-lg">
          <span className="text-base leading-none">🏆</span>
          <span className="text-[11px] font-semibold text-textdark">Best Seller</span>
        </div>
      </div>

      {/* ── Floating tag: For Oily Skin (right, lower) ── */}
      <div className="animate-float-slower absolute -right-7 bottom-32 z-10">
        <div className="flex items-center gap-2 rounded-2xl border border-bordergray bg-white px-3.5 py-2.5 shadow-lg">
          <span className="text-base leading-none">💧</span>
          <span className="text-[11px] font-medium text-textdark">For Oily Skin</span>
        </div>
      </div>

      {/* ── Floating tag: In Stock (bottom-left) ── */}
      <div className="animate-float-slowest absolute -left-5 bottom-14 z-10">
        <div className="flex items-center gap-2 rounded-xl bg-[#DDEFE3] px-3 py-2 shadow-md">
          <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
          <span className="text-[11px] font-semibold text-green-700">In Stock</span>
        </div>
      </div>
    </div>
  );
}
