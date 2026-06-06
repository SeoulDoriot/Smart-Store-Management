"use client";

import { useState, useEffect, useRef, type ReactNode } from "react";
import Link from "next/link";
import {
  Sparkles, ShieldCheck, Truck, Lock, MessageCircle,
  RefreshCw, ShoppingBag, ArrowRight, Search, Layers, ChevronRight,
} from "lucide-react";
import { HomeProductCard } from "@/components/home/HomeProductCard";
import { HomeFooter } from "@/components/home/HomeFooter";
import { PaymentSection } from "@/components/home/PaymentSection";
import { MOCK_PRODUCTS, MOCK_BRANDS } from "@/lib/mock-data";

// ─── Scroll-reveal helper ─────────────────────────────────────────────────────

function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function FadeIn({
  children, delay = 0, className = "",
}: {
  children: ReactNode; delay?: number; className?: string;
}) {
  const { ref, visible } = useFadeIn();
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
      } ${className}`}
    >
      {children}
    </div>
  );
}

// ─── Shared data helpers ──────────────────────────────────────────────────────

const BEST_SELLERS = MOCK_PRODUCTS.filter(p => p.is_best_seller).slice(0, 5);
function bname(id: string) {
  return MOCK_BRANDS.find(b => b.id === id)?.name ?? "";
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function HomeSections() {
  return (
    <div>
      <FeaturedFlow />
      <SkinTypes />
      <BestSellers />
      <AIAdvisorPreview />
      <DigitalShelf />
      <HowItWorks />
      <PaymentSection />
      <TrustBadges />
      <FinalCTA />
      <HomeFooter />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section 1: Featured Product Flow
// ─────────────────────────────────────────────────────────────────────────────

const FLOW_CARDS = [
  {
    step: "01",
    icon: "🧴",
    title: "Cleanse",
    desc: "Clear the slate. A gentle, low-pH formula prepares your skin for everything that follows.",
    gradient: "from-[#F0D5CC] to-[#FAF0EC]",
    accent: "text-[#8A5048]",
    href: "/skincare?sub=Cleansers",
  },
  {
    step: "02",
    icon: "✨",
    title: "Treat",
    desc: "Target your concern. Concentrated serums work when skin is clean and primed to absorb.",
    gradient: "from-[#D4CCF0] to-[#EEEAFA]",
    accent: "text-[#6A5A9A]",
    href: "/skincare?sub=Serums",
  },
  {
    step: "03",
    icon: "☀️",
    title: "Protect",
    desc: "Seal the routine. SPF every morning, moisturizer every night — the step most people skip.",
    gradient: "from-[#C4DAD2] to-[#E8F2EE]",
    accent: "text-[#3A7A6A]",
    href: "/skincare?sub=Sunscreens",
  },
];

function FeaturedFlow() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <FadeIn>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-textgray">
            Your Routine, Simplified
          </p>
          <h2 className="mt-2 font-serif text-3xl font-normal text-[#111111] md:text-4xl">
            Start with what your skin needs.
          </h2>
          <p className="mt-2 text-sm text-textgray">
            A thoughtful routine begins with three essential steps.
          </p>
        </FadeIn>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {FLOW_CARDS.map(({ step, icon, title, desc, gradient, accent, href }, i) => (
            <FadeIn key={title} delay={i * 100}>
              <Link href={href} className="group block h-full">
                <div
                  className={`h-full rounded-[24px] bg-gradient-to-b ${gradient} p-7 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg`}
                >
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-[16px] bg-white/40 text-2xl backdrop-blur-sm">
                    {icon}
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#111111]/35">
                    {step}
                  </p>
                  <h3 className="mt-1 font-serif text-2xl font-normal text-[#111111]">
                    {title}
                  </h3>
                  <p className="mt-3 text-[13px] leading-relaxed text-[#111111]/55">
                    {desc}
                  </p>
                  <div className={`mt-5 flex items-center gap-1 text-[12px] font-semibold ${accent} transition-all group-hover:gap-1.5`}>
                    Shop {title}
                    <ChevronRight size={12} />
                  </div>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section 2: Shop by Skin Type
// ─────────────────────────────────────────────────────────────────────────────

const SKIN_TYPES = [
  { label: "Dry",         icon: "🌵", desc: "Deep moisture" },
  { label: "Oily",        icon: "💧", desc: "Balance sebum" },
  { label: "Combination", icon: "⚖️",  desc: "Dual-zone care" },
  { label: "Sensitive",   icon: "🌸", desc: "Soothe & calm" },
  { label: "Acne-Prone",  icon: "🍃", desc: "Clear & heal" },
  { label: "Normal",      icon: "✨", desc: "Maintain glow" },
];

function SkinTypes() {
  return (
    <section className="bg-[#FAFAF7] py-20">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <FadeIn>
          <h2 className="font-serif text-3xl font-normal text-[#111111] md:text-4xl">
            Shop by Skin Type
          </h2>
          <p className="mt-2 text-sm text-textgray">
            Find what works best for your unique skin.
          </p>
        </FadeIn>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {SKIN_TYPES.map(({ label, icon, desc }, i) => (
            <FadeIn key={label} delay={i * 60}>
              <Link
                href="/skincare"
                className="flex flex-col items-center gap-2.5 rounded-[20px] border border-[#EBEBEB] bg-white px-3 py-6 text-center transition-all duration-200 hover:-translate-y-0.5 hover:border-[#111111] hover:shadow-sm"
              >
                <span className="text-2xl">{icon}</span>
                <span className="text-[13px] font-semibold text-[#111111]">{label}</span>
                <span className="text-[11px] text-textgray">{desc}</span>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section 3: Best Sellers Preview
// ─────────────────────────────────────────────────────────────────────────────

function BestSellers() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <FadeIn>
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-serif text-3xl font-normal text-[#111111] md:text-4xl">
                Best Sellers
              </h2>
              <p className="mt-2 text-sm text-textgray">
                The products our customers keep coming back for.
              </p>
            </div>
            <Link
              href="/skincare"
              className="flex items-center gap-1 text-sm text-textgray transition-colors hover:text-[#111111]"
            >
              View all <ArrowRight size={13} />
            </Link>
          </div>
        </FadeIn>

        <div className="mt-8 grid grid-cols-2 gap-2.5 lg:grid-cols-5">
          {BEST_SELLERS.map((p, i) => (
            <FadeIn key={p.id} delay={i * 80}>
              <HomeProductCard
                product={p}
                brandName={bname(p.brand_id)}
                index={i}
              />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section 4: AI Advisor Preview
// ─────────────────────────────────────────────────────────────────────────────

const AI_PREVIEW_STEPS = [
  { label: "Skin Type", selected: "Oily" },
  { label: "Concern",   selected: "Acne" },
  { label: "Budget",    selected: "$10–$20" },
];

function AIAdvisorPreview() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActiveStep(p => (p + 1) % 3), 2200);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="bg-[#111111] py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="grid items-center gap-12 md:grid-cols-2">

          {/* Left — copy */}
          <FadeIn>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 px-3.5 py-1.5">
              <Sparkles size={12} className="text-white/50" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
                AI Beauty Advisor
              </span>
            </div>
            <h2 className="font-serif text-3xl font-normal text-white md:text-4xl">
              Skincare advice,
              <br />
              <span className="text-white/35">built around you.</span>
            </h2>
            <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-white/50">
              Answer 5 quick questions about your skin type, main concern, and
              budget. We&apos;ll recommend exactly what works for you.
            </p>
            <Link
              href="/ai-advisor"
              className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-white px-7 text-sm font-semibold text-[#111111] transition-opacity hover:opacity-90"
            >
              <Sparkles size={14} />
              Ask AI Advisor
            </Link>
          </FadeIn>

          {/* Right — animated quiz preview */}
          <FadeIn delay={150}>
            <div className="rounded-[24px] border border-white/10 bg-white/[0.05] p-6">

              {/* Progress bar */}
              <div className="mb-5 flex gap-1.5">
                {AI_PREVIEW_STEPS.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                      i <= activeStep ? "bg-white" : "bg-white/15"
                    }`}
                  />
                ))}
              </div>

              {/* Step rows */}
              <div className="space-y-2.5">
                {AI_PREVIEW_STEPS.map((s, i) => {
                  const isActive = i === activeStep;
                  const isDone   = i < activeStep;
                  return (
                    <div
                      key={s.label}
                      className={`flex items-center justify-between rounded-[14px] px-4 py-3.5 transition-all duration-500 ${
                        isActive
                          ? "bg-white"
                          : isDone
                          ? "bg-white/10"
                          : "bg-white/[0.04]"
                      }`}
                    >
                      <span
                        className={`text-[13px] font-medium ${
                          isActive ? "text-[#111111]" : "text-white/40"
                        }`}
                      >
                        {s.label}
                      </span>
                      {(isActive || isDone) && (
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold transition-all duration-300 ${
                            isActive
                              ? "bg-[#111111] text-white"
                              : "bg-white/15 text-white/50"
                          }`}
                        >
                          {s.selected}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              <p className="mt-4 text-center text-[11px] text-white/25">
                Step {activeStep + 1} of 5 · AI analysing your skin…
              </p>
            </div>
          </FadeIn>

        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section 5: Digital Shelf Preview
// ─────────────────────────────────────────────────────────────────────────────

const SHELVES = [
  {
    title: "Morning Ritual",
    desc: "Cleanser → Toner → Serum → SPF",
    meta: "4 products · from $8",
    gradient: "from-[#FEF5E4] to-[#FDF9F0]",
    titleColor: "text-[#7A6020]",
    floatAnim: "animate-float",
    bars: ["h-11", "h-14", "h-10"],
    barColor: "bg-[#E8D5A0]/70",
  },
  {
    title: "Night Recovery",
    desc: "Oil Cleanser → Ampoule → Moisturizer",
    meta: "3 products · from $18",
    gradient: "from-[#EDE5F8] to-[#F7F4FD]",
    titleColor: "text-[#5A4898]",
    floatAnim: "animate-float-slow",
    bars: ["h-12", "h-10", "h-14"],
    barColor: "bg-[#C4B8E8]/70",
  },
  {
    title: "Glow Edit",
    desc: "Niacinamide · Propolis · AHA/BHA",
    meta: "3 products · from $8",
    gradient: "from-[#F5E8D8] to-[#FDF5EE]",
    titleColor: "text-[#8A4820]",
    floatAnim: "animate-float-slower",
    bars: ["h-10", "h-12", "h-11"],
    barColor: "bg-[#D4A888]/70",
  },
];

function DigitalShelf() {
  return (
    <section className="bg-gradient-to-b from-[#F5F2EC] to-white py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-5 md:px-8">

        <FadeIn>
          <div className="flex items-end justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-textgray">
                <Layers size={11} />
                Digital Shelf
              </div>
              <h2 className="font-serif text-3xl font-normal text-[#111111] md:text-4xl">
                Explore the Digital Shelf
              </h2>
              <p className="mt-2 text-sm text-textgray">
                Pre-curated routines — pick a shelf, order the whole set.
              </p>
            </div>
          </div>
        </FadeIn>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {SHELVES.map(({ title, desc, meta, gradient, titleColor, floatAnim, bars, barColor }, i) => (
            <FadeIn key={title} delay={i * 100}>
              <div
                className={`${floatAnim} h-full rounded-[24px] bg-gradient-to-br ${gradient} p-7 shadow-sm`}
              >
                {/* Abstract product visuals */}
                <div className="mb-6 flex items-end gap-2.5">
                  {bars.map((h, j) => (
                    <div
                      key={j}
                      className={`${h} flex-1 rounded-[10px] ${barColor}`}
                    />
                  ))}
                </div>
                <h3 className={`font-serif text-xl font-normal ${titleColor}`}>
                  {title}
                </h3>
                <p className="mt-1.5 text-sm text-textgray">{desc}</p>
                <p className="mt-4 text-[11px] font-medium text-textgray/60">{meta}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={200}>
          <div className="mt-8 flex justify-center">
            <Link
              href="/digital-shelf"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-[#111111]/15 bg-white px-7 text-sm font-medium text-[#111111] transition-colors hover:border-[#111111]/30 hover:bg-[#FAFAF7]"
            >
              Enter Showroom
              <ArrowRight size={14} />
            </Link>
          </div>
        </FadeIn>

      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section 6: How It Works
// ─────────────────────────────────────────────────────────────────────────────

const HOW_STEPS = [
  {
    icon: Search,
    step: "01",
    title: "Browse Products",
    desc: "Explore our curated collection of authentic, dermatologist-trusted skincare.",
  },
  {
    icon: Sparkles,
    step: "02",
    title: "Get AI Advice",
    desc: "Answer 5 questions. Our AI finds what fits your skin type, concern, and budget.",
  },
  {
    icon: ShoppingBag,
    step: "03",
    title: "Place Your Order",
    desc: "Add to bag, confirm your details, and choose how to pay.",
  },
  {
    icon: Truck,
    step: "04",
    title: "Track Delivery",
    desc: "Real-time updates. Same-day delivery in Phnom Penh.",
  },
];

function HowItWorks() {
  return (
    <section className="bg-white py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-5 md:px-8">

        <FadeIn className="text-center">
          <h2 className="font-serif text-3xl font-normal text-[#111111] md:text-4xl">
            How it works.
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-textgray">
            From discovery to doorstep — simple, quick, and personalised.
          </p>
        </FadeIn>

        <div className="mt-12 grid grid-cols-2 gap-8 lg:grid-cols-4">
          {HOW_STEPS.map(({ icon: Icon, step, title, desc }, i) => (
            <FadeIn key={step} delay={i * 100}>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-[56px] w-[56px] items-center justify-center rounded-full bg-[#111111]">
                  <Icon size={20} className="text-white" />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-textgray">
                  {step}
                </p>
                <h3 className="mt-1.5 font-serif text-[15px] font-normal text-[#111111]">
                  {title}
                </h3>
                <p className="mt-2 text-[12px] leading-relaxed text-textgray">
                  {desc}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>

      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section 7: Trust Section
// ─────────────────────────────────────────────────────────────────────────────

const TRUST_ITEMS = [
  {
    icon: ShieldCheck,
    title: "Authentic Products",
    desc: "100% genuine, source-verified",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    desc: "Same-day in Phnom Penh",
  },
  {
    icon: MessageCircle,
    title: "Telegram Receipt",
    desc: "Instant order confirmation",
  },
  {
    icon: RefreshCw,
    title: "Easy Order Tracking",
    desc: "Live delivery status updates",
  },
  {
    icon: Lock,
    title: "Secure Payment",
    desc: "ABA · Wing · Bakong",
  },
];

function TrustBadges() {
  return (
    <section className="bg-[#FAFAF7] py-16">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-5">
          {TRUST_ITEMS.map(({ icon: Icon, title, desc }, i) => (
            <FadeIn key={title} delay={i * 70}>
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#111111]">
                  <Icon size={17} className="text-white" />
                </div>
                <p className="text-[13px] font-semibold text-[#111111]">{title}</p>
                <p className="text-[11px] leading-relaxed text-textgray">{desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section 8: Final CTA
// ─────────────────────────────────────────────────────────────────────────────

function FinalCTA() {
  return (
    <section className="bg-gradient-to-b from-white to-[#F5EEE8] py-24 md:py-32">
      <div className="mx-auto max-w-2xl px-5 text-center">
        <FadeIn>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-textgray">
            Get Started
          </p>
          <h2 className="mt-3 font-serif text-3xl font-normal text-[#111111] md:text-[2.6rem] md:leading-tight">
            Ready to find what fits
            <br className="hidden sm:block" />
            your skin?
          </h2>
          <p className="mx-auto mt-4 max-w-sm text-[14px] leading-relaxed text-textgray">
            Browse curated skincare, get AI-powered advice, and order with
            confidence — delivered to your door.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/home"
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#111111] px-8 text-sm font-semibold text-white transition-opacity hover:opacity-80 sm:w-auto"
            >
              Get Started
              <ArrowRight size={15} />
            </Link>
            <Link
              href="/ai-advisor"
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full border border-[#111111]/15 bg-white px-8 text-sm font-medium text-[#111111] transition-colors hover:border-[#111111]/30 sm:w-auto"
            >
              <Sparkles size={14} className="text-[#9055A2]" />
              Ask AI Advisor
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
