"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Sun,
  Leaf,
  PackageOpen,
  BotMessageSquare,
  ShieldCheck,
  Truck,
  ScanLine,
  Trophy,
  Droplet,
  Star,
  Zap,
} from "lucide-react";

// ── Slide data ────────────────────────────────────────────────────────────────

const SLIDES = [
  {
    id: "sunscreen",
    eyebrow: "Daily Glow Drop",
    icon: Sun,
    title: "Fresh sunscreen,",
    highlight: "made for layering.",
    body: "Soft SPF, hydrating serum, and clean finish products picked for Cambodia's warm weather.",
    cta: "Shop Sunscreen",
    ctaHref: "/skincare?sub=sunscreen",
    visualGradient: "from-[#F8E0B8] to-[#FFF3D6]",
    letterColor: "text-[#C89438]",
    letter: "S",
    bgGradient: "from-[#FFFBF2] via-white to-[#FFF6E4]",
    tags: [
      { label: "New Drop",      icon: Sparkles, style: "dark"  },
      { label: "SPF Ready",     icon: Sun,      style: "light" },
      { label: "No White Cast", icon: Droplet,  style: "light" },
      { label: "Daily Use",     icon: Zap,      style: "green" },
    ],
  },
  {
    id: "calm-skin",
    eyebrow: "Sensitive Edit",
    icon: Leaf,
    title: "Calm skin,",
    highlight: "clearer days.",
    body: "Gentle cleansers, barrier creams, and soothing essentials for reactive and sensitive skin.",
    cta: "Find My Product",
    ctaHref: "/ai-advisor",
    visualGradient: "from-[#D8E8E1] to-[#F2FAF6]",
    letterColor: "text-[#72A391]",
    letter: "C",
    bgGradient: "from-[#F4FAF7] via-white to-[#EDF7F2]",
    tags: [
      { label: "Cica Care",      icon: Leaf,    style: "dark"  },
      { label: "Sensitive Safe",  icon: ShieldCheck, style: "light" },
      { label: "Hydration",      icon: Droplet, style: "light" },
      { label: "Barrier Repair", icon: Zap,     style: "green" },
    ],
  },
  {
    id: "new-arrivals",
    eyebrow: "Just Landed",
    icon: PackageOpen,
    title: "New arrivals",
    highlight: "just landed.",
    body: "The latest K-beauty drops, trending serums, and fresh formulas — added to Lumière this week.",
    cta: "Browse New",
    ctaHref: "/new",
    visualGradient: "from-[#EED4CB] to-[#FAF0EC]",
    letterColor: "text-[#C98A7E]",
    letter: "N",
    bgGradient: "from-[#FDF8F6] via-white to-[#F7EEE6]",
    tags: [
      { label: "This Week",    icon: Star,       style: "dark"  },
      { label: "Best Seller",  icon: Trophy,     style: "light" },
      { label: "K-Beauty",     icon: Sparkles,   style: "light" },
      { label: "In Stock",     icon: Zap,        style: "green" },
    ],
  },
  {
    id: "ai-advisor",
    eyebrow: "AI Advisor",
    icon: BotMessageSquare,
    title: "Build your routine",
    highlight: "with AI.",
    body: "Answer a few questions and let Lumière's AI suggest a complete routine matched to your skin type and concerns.",
    cta: "Ask AI Advisor",
    ctaHref: "/ai-advisor",
    visualGradient: "from-[#D5D0EE] to-[#EEEAF8]",
    letterColor: "text-[#8B7DC0]",
    letter: "A",
    bgGradient: "from-[#F6F4FC] via-white to-[#EEEAF8]",
    tags: [
      { label: "AI Matched",    icon: Sparkles,      style: "dark"  },
      { label: "Personalized",  icon: BotMessageSquare, style: "light" },
      { label: "Skin Quiz",     icon: Star,          style: "light" },
      { label: "Free",          icon: Zap,           style: "green" },
    ],
  },
] as const;

const AUTOPLAY_MS = 6000;

// ── Framer variants ───────────────────────────────────────────────────────────

const copyVariants = {
  enter: (dir: number) => ({
    opacity: 0,
    x: dir > 0 ? 40 : -40,
    filter: "blur(6px)",
  }),
  center: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
  exit: (dir: number) => ({
    opacity: 0,
    x: dir > 0 ? -30 : 30,
    filter: "blur(4px)",
    transition: { duration: 0.4, ease: "easeOut" as const },
  }),
};

const visualVariants = {
  enter: (dir: number) => ({
    opacity: 0,
    x: dir > 0 ? 60 : -60,
    scale: 0.92,
    filter: "blur(8px)",
  }),
  center: {
    opacity: 1,
    x: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: "easeOut" as const, delay: 0.08 },
  },
  exit: (dir: number) => ({
    opacity: 0,
    x: dir > 0 ? -40 : 40,
    scale: 0.95,
    filter: "blur(6px)",
    transition: { duration: 0.4, ease: "easeOut" as const },
  }),
};

// ── Component ─────────────────────────────────────────────────────────────────

export function HeroSection() {
  const [[page, direction], setPage] = useState([0, 0]);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const active = ((page % SLIDES.length) + SLIDES.length) % SLIDES.length;
  const slide = SLIDES[active];

  const go = useCallback(
    (next: number, dir: number) => setPage([next, dir]),
    [],
  );

  const goNext = useCallback(() => {
    go(active + 1, 1);
  }, [active, go]);

  const goPrev = useCallback(() => {
    go(active - 1 + SLIDES.length, -1);
  }, [active, go]);

  // Autoplay
  useEffect(() => {
    if (paused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(goNext, AUTOPLAY_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, goNext]);

  // Reset progress bar animation on slide change
  useEffect(() => {
    const el = progressRef.current;
    if (!el) return;
    el.style.animation = "none";
    // Force reflow
    void el.offsetWidth;
    el.style.animation = "";
  }, [active]);

  return (
    <section
      className={`relative overflow-hidden bg-gradient-to-br ${slide.bgGradient} transition-colors duration-1000`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mx-auto max-w-6xl px-4 py-5 md:px-6 md:py-7 lg:py-8">
        <div className="grid items-center gap-4 md:grid-cols-[1fr_minmax(200px,270px)] lg:gap-10">

          {/* ── Left: Copy ── */}
          <div className="relative min-h-[240px] md:min-h-[260px]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={slide.id}
                custom={direction}
                variants={copyVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                {/* Wordmark */}
                <p className="mb-2 font-serif text-base font-semibold tracking-tight text-[#111]">
                  Lumière
                </p>

                {/* Eyebrow badge */}
                <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-[#111] px-3 py-1 shadow-[0_16px_34px_rgba(17,17,17,0.10)]">
                  <slide.icon size={11} className="text-white/75" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/85">
                    {slide.eyebrow}
                  </span>
                </div>

                {/* Headline */}
                <h1 className="font-serif text-[1.8rem] font-normal leading-[1.08] tracking-tight text-[#111] md:text-[2.4rem] lg:text-[2.8rem]">
                  {slide.title}
                  <br />
                  <span className="text-[#111]/40">{slide.highlight}</span>
                </h1>

                {/* Body */}
                <p className="mt-2.5 max-w-lg text-[13px] leading-relaxed text-[#888] md:text-[14px]">
                  {slide.body}
                </p>

                {/* CTA */}
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    href={slide.ctaHref}
                    className="inline-flex h-10 items-center gap-2 rounded-full bg-[#111] px-5 text-[12px] font-semibold text-white shadow-[0_4px_20px_rgba(0,0,0,0.12)] transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.18)] hover:brightness-110"
                  >
                    {slide.cta}
                    <ChevronRight size={13} />
                  </Link>
                </div>

                {/* Trust row */}
                <div className="mt-3.5 flex flex-col gap-1.5 text-[#AAA] sm:flex-row sm:gap-4">
                  {[
                    { icon: ShieldCheck, label: "Authentic products" },
                    { icon: Truck,       label: "Fast delivery" },
                    { icon: ScanLine,    label: "Easy tracking" },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-1.5">
                      <Icon size={12} className="shrink-0" />
                      <span className="text-[11px]">{label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── Right: Product visual ── */}
          <div className="relative min-h-[220px] md:min-h-[250px]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={slide.id + "-visual"}
                custom={direction}
                variants={visualVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="flex items-center justify-center"
              >
                <SlideVisual slide={slide} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ── Controls bar ── */}
        <div className="mt-4 flex items-center justify-between md:mt-5">
          {/* Arrows */}
          <div className="flex gap-2">
            <button
              onClick={goPrev}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E8E8E8] bg-white/80 text-[#888] shadow-sm backdrop-blur-sm transition-all hover:border-[#CCC] hover:text-[#333]"
              aria-label="Previous slide"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={goNext}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E8E8E8] bg-white/80 text-[#888] shadow-sm backdrop-blur-sm transition-all hover:border-[#CCC] hover:text-[#333]"
              aria-label="Next slide"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Indicators — line style */}
          <div className="flex items-center gap-2" aria-label="Slide indicators">
            {SLIDES.map((s, i) => (
              <button
                key={s.id}
                onClick={() => go(i, i > active ? 1 : -1)}
                className="group/dot relative flex h-6 items-center"
                aria-label={`Go to slide ${i + 1}`}
              >
                <span
                  className={`block rounded-full transition-all duration-500 ${
                    i === active
                      ? "h-[3px] w-8 bg-[#111]/15"
                      : "h-[3px] w-3 bg-[#111]/10 group-hover/dot:bg-[#111]/25"
                  }`}
                />
                {i === active && (
                  <span
                    ref={progressRef}
                    className="hero-carousel-progress absolute left-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-[#111]"
                  />
                )}
              </button>
            ))}
            <span className="ml-2 text-[11px] tabular-nums text-[#BBB]">
              {String(active + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Slide visual (product card + floating tags) ──────────────────────────────

type SlideData = (typeof SLIDES)[number];

function SlideVisual({ slide }: { slide: SlideData }) {
  return (
    <div className="relative mx-auto h-[200px] w-[160px] md:h-[230px] md:w-[190px]">
      {/* Main card */}
      <div
        className={`absolute inset-0 overflow-hidden rounded-[24px] bg-gradient-to-b ${slide.visualGradient} shadow-[0_20px_50px_rgba(68,45,34,0.10)]`}
      >
        <div className="flex h-full items-center justify-center">
          <span
            className={`select-none font-serif text-[72px] font-light leading-none ${slide.letterColor} opacity-[0.14] md:text-[86px]`}
            aria-hidden="true"
          >
            {slide.letter}
          </span>
        </div>
        <div className="absolute bottom-5 left-4 right-4 space-y-1.5">
          <div className="h-1 w-10 rounded-full bg-white/35" />
          <div className="h-1.5 w-28 max-w-full rounded-full bg-white/50" />
          <div className="h-1.5 w-20 max-w-full rounded-full bg-white/40" />
        </div>
      </div>

      {/* Floating tags */}
      {(() => { const Tag0 = slide.tags[0].icon; return (
        <div className="animate-float absolute -right-3 top-4 z-10">
          <div className="flex items-center gap-1 rounded-xl bg-[#111] px-2.5 py-1.5 shadow-xl">
            <Tag0 size={10} className="text-white/70" />
            <span className="text-[9px] font-semibold text-white">
              {slide.tags[0].label}
            </span>
          </div>
        </div>
      ); })()}
      {(() => { const Tag1 = slide.tags[1].icon; return (
        <div className="animate-float-slow absolute -left-5 top-[28%] z-10">
          <div className="flex items-center gap-1.5 rounded-xl border border-[#F0F0F0] bg-white px-2.5 py-1.5 shadow-lg">
            <Tag1 size={12} className="text-[#C98A2E]" />
            <span className="text-[9px] font-semibold text-[#333]">
              {slide.tags[1].label}
            </span>
          </div>
        </div>
      ); })()}
      {(() => { const Tag2 = slide.tags[2].icon; return (
        <div className="animate-float-slower absolute -right-5 bottom-16 z-10">
          <div className="flex items-center gap-1.5 rounded-xl border border-[#F0F0F0] bg-white px-2.5 py-1.5 shadow-lg">
            <Tag2 size={12} className="text-[#5EA7E8]" />
            <span className="text-[9px] font-medium text-[#333]">
              {slide.tags[2].label}
            </span>
          </div>
        </div>
      ); })()}
      {(() => { return (
        <div className="animate-float-slowest absolute -left-4 bottom-6 z-10">
          <div className="flex items-center gap-1.5 rounded-lg bg-[#DDEFE3] px-2 py-1 shadow-md">
            <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
            <span className="text-[9px] font-semibold text-green-700">
              {slide.tags[3].label}
            </span>
          </div>
        </div>
      ); })()}
    </div>
  );
}
