"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, ShieldCheck, ArrowLeft, ShoppingBag, Check, ChevronRight,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import type { Product, Brand } from "@/types/product";

// ─── Gradient palette ─────────────────────────────────────────────────────────

const GRADIENTS = [
  "from-[#EDD0CA] to-[#B8877E]",
  "from-[#C4DAD2] to-[#7EAB9C]",
  "from-[#CEC7EE] to-[#9082C8]",
  "from-[#EAD8C5] to-[#B8906A]",
];

// ─── Quiz step config ─────────────────────────────────────────────────────────

const STEP_META = [
  {
    field: "skinType" as const,
    title: "What's your skin type?",
    subtitle: "Choose the one that best describes your skin.",
    cols: 2 as 2 | 3,
    opts: [
      { v: "Dry",         e: "🌵", d: "Tight, flaky, or dull" },
      { v: "Oily",        e: "✨", d: "Shiny, prone to breakouts" },
      { v: "Combination", e: "⚖️", d: "Oily T-zone, dry cheeks" },
      { v: "Sensitive",   e: "🌸", d: "Easily irritated or red" },
    ],
  },
  {
    field: "concern" as const,
    title: "Your main skin concern?",
    subtitle: "Pick one concern to focus your routine around.",
    cols: 2 as 2 | 3,
    opts: [
      { v: "Acne",           e: "🔴", d: "Breakouts & blemishes" },
      { v: "Redness",        e: "🌿", d: "Irritation & flushing" },
      { v: "Dark Spots",     e: "🌙", d: "Uneven tone & pigment" },
      { v: "Hydration",      e: "💧", d: "Thirsty & dehydrated" },
      { v: "Brightening",    e: "☀️", d: "Dull, lack of glow" },
      { v: "Sun Protection", e: "🛡️", d: "UV defence every day" },
    ],
  },
  {
    field: "budget" as const,
    title: "What's your budget?",
    subtitle: "Per product, not the whole routine.",
    cols: 2 as 2 | 3,
    opts: [
      { v: "Under $10", e: "💚", d: "Wallet-friendly picks" },
      { v: "$10–$20",   e: "💛", d: "Best bang for your buck" },
      { v: "$20–$50",   e: "🧡", d: "Premium but worth it" },
      { v: "Above $50", e: "💜", d: "Luxury, no compromise" },
    ],
  },
  {
    field: "productType" as const,
    title: "Which product type?",
    subtitle: "Choose what you want to add to your routine.",
    cols: 3 as 2 | 3,
    opts: [
      { v: "Cleanser",     e: "🧴", d: "Start fresh" },
      { v: "Toner",        e: "💦", d: "Balance & hydrate" },
      { v: "Serum",        e: "✨", d: "Targeted treatment" },
      { v: "Moisturizer",  e: "🌿", d: "Seal in hydration" },
      { v: "Sunscreen",    e: "☀️", d: "Daily UV protection" },
      { v: "Full Routine", e: "📦", d: "Complete routine" },
    ],
  },
] as const;

// ─── Types ────────────────────────────────────────────────────────────────────

type QuizAnswers = {
  skinType:    string;
  concern:     string;
  budget:      string;
  productType: string;
  customNote:  string;
};

type Result = { product: Product; reason: string; brandName: string };

// ─── Recommendation engine ────────────────────────────────────────────────────

const CAT_MAP: Record<string, string> = {
  Cleanser: "c1", Toner: "c2", Serum: "c3", Moisturizer: "c4", Sunscreen: "c5",
};

const CONCERN_NOTE: Record<string, string> = {
  "Acne":           "targets breakouts and controls excess oil",
  "Redness":        "soothes irritation and reduces visible redness",
  "Dark Spots":     "fades uneven tone and brightens over time",
  "Hydration":      "delivers deep, long-lasting moisture",
  "Brightening":    "boosts radiance and improves skin clarity",
  "Sun Protection": "shields your skin from daily UV damage",
};

const SKIN_NOTE: Record<string, string> = {
  "Oily":        "lightweight, non-comedogenic formula",
  "Dry":         "rich, barrier-supporting formula",
  "Sensitive":   "gentle, fragrance-free formula",
  "Combination": "balancing formula for mixed-zone skin",
};

function makeReason(p: Product, skinType: string, concern: string): string {
  const skinMatch = (p.skin_types as string[]).includes(skinType);
  const skinNote  = skinMatch ? (SKIN_NOTE[skinType] ?? "") : "";
  const cnote     = CONCERN_NOTE[concern] ?? "supports your skin goals";
  if (skinNote) {
    return `${skinNote.charAt(0).toUpperCase()}${skinNote.slice(1)} that ${cnote}.`;
  }
  return `Recommended to ${cnote}.`;
}

function recommend(a: QuizAnswers, products: Product[], brands: Brand[]): Result[] {
  const maxPrice =
    a.budget === "Under $10" ? 10 :
    a.budget === "$10–$20"   ? 20 :
    a.budget === "$20–$50"   ? 50 : Infinity;

  const catId = CAT_MAP[a.productType]; // undefined = "Full Routine"

  function score(p: Product) {
    let s = 0;
    if ((p.skin_types as string[]).includes(a.skinType))    s += 3;
    if ((p.skin_concerns as string[]).includes(a.concern))  s += 3;
    if (p.is_best_seller) s += 1;
    return s;
  }

  function buildPool(withCat: boolean) {
    return products.filter(p => {
      if (!p.is_ai_recommendable) return false;
      if (a.budget !== "Above $50" && p.price > maxPrice) return false;
      if (withCat && catId && p.category_id !== catId) return false;
      return true;
    });
  }

  let pool = buildPool(true);
  if (pool.length < 2) pool = buildPool(false);
  if (pool.length < 2) pool = products.filter(p => p.is_ai_recommendable);

  const limit = catId ? 3 : 4;
  return [...pool]
    .sort((x, y) => score(y) - score(x))
    .slice(0, limit)
    .map(p => ({
      product:   p,
      reason:    makeReason(p, a.skinType, a.concern),
      brandName: brands.find(b => b.id === p.brand_id)?.name ?? "",
    }));
}

// ─── Thinking sequence ────────────────────────────────────────────────────────

const THINKING_STEPS = [
  "Analyzing your skin…",
  "Matching products…",
  "Building your routine…",
];

// ─── Main component ───────────────────────────────────────────────────────────

type Props = { products: Product[]; brands: Brand[] };
type Phase = "quiz" | "thinking" | "results";

const EMPTY: QuizAnswers = {
  skinType: "", concern: "", budget: "", productType: "", customNote: "",
};

export function AIAdvisorClient({ products, brands }: Props) {
  const { addToCart } = useStore();

  const [phase, setPhase]         = useState<Phase>("quiz");
  const [step, setStep]           = useState(1);
  const [answers, setAnswers]     = useState<QuizAnswers>(EMPTY);
  const [results, setResults]     = useState<Result[]>([]);
  const [addedIds, setAddedIds]   = useState<string[]>([]);
  const [thinkIdx, setThinkIdx]   = useState(0);

  // Drive the "AI thinking" sequence, then reveal results.
  useEffect(() => {
    if (phase !== "thinking") return;
    setThinkIdx(0);
    const t1 = setTimeout(() => setThinkIdx(1), 850);
    const t2 = setTimeout(() => setThinkIdx(2), 1700);
    const t3 = setTimeout(() => setPhase("results"), 2650);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [phase]);

  function pick(field: keyof QuizAnswers, value: string) {
    setAnswers(prev => ({ ...prev, [field]: value }));
  }

  const canNext = step === 5 ? true : answers[STEP_META[step - 1].field] !== "";

  const progress =
    phase === "results" ? 100 :
    phase === "thinking" ? 100 :
    ((step - 1) / 5) * 100;

  function goNext() {
    if (step < 5) {
      setStep(step + 1);
    } else {
      setResults(recommend(answers, products, brands));
      setPhase("thinking");
    }
  }

  function goBack() {
    setStep(step - 1);
  }

  function restart() {
    setStep(1);
    setAnswers(EMPTY);
    setResults([]);
    setAddedIds([]);
    setPhase("quiz");
  }

  function handleAdd(id: string) {
    addToCart(id);
    setAddedIds(prev => [...prev, id]);
    setTimeout(() => setAddedIds(prev => prev.filter(x => x !== id)), 2200);
  }

  const headerLabel =
    phase === "results" ? "Complete ✓" :
    phase === "thinking" ? "Almost there…" :
    `Step ${step} of 5`;

  return (
    <main className="min-h-screen bg-[#FAFAF7]">

      {/* ── Hero ── */}
      <div className="relative overflow-hidden border-b border-[#F0F0F0] bg-gradient-to-br from-[#CEC7EE]/20 via-white to-[#EDD0CA]/15 py-10 text-center">
        <SparkleIcon />
        <h1 className="mt-4 font-serif text-[1.9rem] font-normal text-[#111111]">
          AI Beauty Advisor
        </h1>
        <p className="mx-auto mt-2 max-w-sm px-4 text-sm leading-relaxed text-textgray">
          Answer 5 quick questions and we&apos;ll find the perfect products for your skin.
        </p>
      </div>

      {/* ── Quiz card ── */}
      <div className="mx-auto max-w-xl px-4 py-8">
        <div className="relative">
          {/* Soft animated glow behind the card */}
          <CardGlow phase={phase} />

          <div className="relative overflow-hidden rounded-[28px] border border-[#EBEBEB] bg-white shadow-sm">

            {/* Progress row */}
            <div className="px-6 pt-6">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-textgray">
                  {headerLabel}
                </span>
                {phase === "quiz" && step > 1 && (
                  <button
                    onClick={goBack}
                    className="flex items-center gap-1 text-[11px] text-textgray transition-colors hover:text-[#111111]"
                  >
                    <ArrowLeft size={11} /> Back
                  </button>
                )}
                {phase === "results" && (
                  <button
                    onClick={restart}
                    className="text-[11px] text-textgray transition-colors hover:text-[#111111]"
                  >
                    Retake quiz
                  </button>
                )}
              </div>
              {/* Progress bar */}
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#F0F0F0]">
                <motion.div
                  className="h-full rounded-full bg-[#111111]"
                  initial={false}
                  animate={{ width: `${progress}%` }}
                  transition={{ type: "spring", stiffness: 120, damping: 20 }}
                />
              </div>
            </div>

            {/* Animated content — keyed remount fades/slides each view in */}
            <motion.div
              key={phase === "quiz" ? `quiz-${step}` : phase}
              initial={{ opacity: 0, x: phase === "quiz" ? 24 : 0, y: phase === "quiz" ? 0 : 10 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {phase === "quiz" ? (
                step <= 4 ? (
                  <StepOptions step={step} answers={answers} onPick={pick} />
                ) : (
                  <StepFive
                    note={answers.customNote}
                    onChange={v => pick("customNote", v)}
                  />
                )
              ) : phase === "thinking" ? (
                <ThinkingView idx={thinkIdx} />
              ) : (
                <ResultsView
                  results={results}
                  answers={answers}
                  addedIds={addedIds}
                  onAdd={handleAdd}
                />
              )}
            </motion.div>

            {/* Next / submit button — quiz only */}
            {phase === "quiz" && (
              <div className="border-t border-[#F0F0F0] px-6 py-4">
                <motion.button
                  onClick={goNext}
                  disabled={!canNext}
                  // Subtle "now active" pop when an answer is selected
                  animate={
                    canNext
                      ? { scale: [1, 1.025, 1], boxShadow: "0 8px 24px -8px rgba(17,17,17,0.45)" }
                      : { scale: 1, boxShadow: "0 0 0 0 rgba(0,0,0,0)" }
                  }
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  whileTap={canNext ? { scale: 0.97 } : undefined}
                  className="flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-[#111111] text-sm font-semibold text-white transition-opacity hover:opacity-80 disabled:opacity-25"
                >
                  {step < 5 ? "Continue" : "See My Recommendations"}
                  <ChevronRight size={15} />
                </motion.button>
              </div>
            )}
          </div>
        </div>

        {/* Safety note */}
        <div className="mt-4 flex gap-3 rounded-[16px] border border-[#F0F0F0] bg-white p-4">
          <ShieldCheck size={15} className="mt-0.5 shrink-0 text-textgray" />
          <p className="text-[11px] leading-relaxed text-textgray">
            AI gives skincare suggestions only, not medical advice. For serious skin
            irritation, allergic reactions, or painful conditions, please consult a licensed
            dermatologist.
          </p>
        </div>
      </div>
    </main>
  );
}

// ─── Hero icon with sparkle field ─────────────────────────────────────────────

function SparkleIcon() {
  // Decorative sparkles orbiting the AI icon.
  const sparks = [
    { x: -26, y: -14, s: 10, delay: 0 },
    { x: 28,  y: -18, s: 8,  delay: 0.6 },
    { x: 30,  y: 16,  s: 11, delay: 1.1 },
    { x: -30, y: 18,  s: 7,  delay: 1.6 },
  ];
  return (
    <div className="relative mx-auto h-[52px] w-[52px]">
      <motion.div
        className="flex h-full w-full items-center justify-center rounded-[16px] bg-[#111111]"
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <Sparkles size={22} className="text-white" />
      </motion.div>
      {sparks.map((sp, i) => (
        <motion.span
          key={i}
          className="absolute left-1/2 top-1/2 text-[#9082C8]"
          style={{ x: sp.x, y: sp.y }}
          animate={{ opacity: [0, 1, 0], scale: [0.4, 1, 0.4], rotate: [0, 90, 0] }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            delay: sp.delay,
            ease: "easeInOut",
          }}
        >
          <Sparkles size={sp.s} />
        </motion.span>
      ))}
    </div>
  );
}

// ─── Soft glow behind the card ────────────────────────────────────────────────

function CardGlow({ phase }: { phase: Phase }) {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute -inset-6 -z-0 rounded-[40px] blur-3xl"
      style={{
        background:
          "radial-gradient(60% 60% at 30% 20%, rgba(206,199,238,0.55), transparent 70%), radial-gradient(55% 55% at 80% 80%, rgba(237,208,202,0.5), transparent 70%), radial-gradient(50% 50% at 70% 30%, rgba(196,218,210,0.45), transparent 70%)",
      }}
      animate={{
        opacity: phase === "thinking" ? [0.55, 0.9, 0.55] : [0.4, 0.65, 0.4],
        scale: [1, 1.06, 1],
      }}
      transition={{
        duration: phase === "thinking" ? 2 : 6,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

// ─── Step 1–4: option grid ────────────────────────────────────────────────────

function StepOptions({
  step,
  answers,
  onPick,
}: {
  step: number;
  answers: QuizAnswers;
  onPick: (field: keyof QuizAnswers, value: string) => void;
}) {
  const meta     = STEP_META[step - 1];
  const selected = answers[meta.field];

  return (
    <div className="px-6 py-5">
      <h2 className="font-serif text-xl font-normal text-[#111111]">{meta.title}</h2>
      <p className="mt-1 text-sm text-textgray">{meta.subtitle}</p>

      <div
        className={`mt-5 grid gap-3 ${
          meta.cols === 3 ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2"
        }`}
      >
        {meta.opts.map(({ v, e, d }) => {
          const sel = selected === v;
          return (
            <motion.button
              key={v}
              onClick={() => onPick(meta.field, v)}
              whileTap={{ scale: 0.97 }}
              animate={{
                scale: sel ? 1.03 : 1,
                boxShadow: sel
                  ? "0 0 0 3px rgba(144,130,200,0.25), 0 10px 28px -10px rgba(144,130,200,0.6)"
                  : "0 0 0 0 rgba(0,0,0,0)",
              }}
              transition={{ type: "spring", stiffness: 320, damping: 22 }}
              className={`relative flex flex-col items-start gap-1.5 rounded-[16px] border p-4 text-left ${
                sel
                  ? "border-[#111111] bg-[#111111]"
                  : "border-[#EBEBEB] bg-white hover:border-[#111111]/25 hover:bg-[#FAFAF7]"
              }`}
            >
              {/* Checkmark on selection */}
              <AnimatePresence>
                {sel && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 18 }}
                    className="absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-white"
                  >
                    <Check size={12} className="text-[#111111]" strokeWidth={3} />
                  </motion.span>
                )}
              </AnimatePresence>

              <span className="text-xl leading-none">{e}</span>
              <span
                className={`text-[13px] font-semibold leading-tight ${
                  sel ? "text-white" : "text-[#111111]"
                }`}
              >
                {v}
              </span>
              <span
                className={`text-[11px] leading-snug ${
                  sel ? "text-white/60" : "text-textgray"
                }`}
              >
                {d}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Step 5: custom text ──────────────────────────────────────────────────────

function StepFive({
  note,
  onChange,
}: {
  note: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="px-6 py-5">
      <h2 className="font-serif text-xl font-normal text-[#111111]">
        Anything else to share?
      </h2>
      <p className="mt-1 text-sm text-textgray">
        Tell us more about your skin or what you&apos;re looking for.{" "}
        <span className="text-textgray/50">(optional — you can skip)</span>
      </p>
      <textarea
        value={note}
        onChange={e => onChange(e.target.value)}
        placeholder="e.g. I have fungal acne, I prefer fragrance-free products, I want a 3-step max routine…"
        rows={4}
        className="mt-5 w-full resize-none rounded-[14px] border border-[#EBEBEB] bg-[#FAFAF7] px-4 py-3.5 text-sm text-[#111111] placeholder-textgray/50 transition-colors focus:border-[#111111] focus:bg-white focus:outline-none"
      />
    </div>
  );
}

// ─── AI thinking animation ────────────────────────────────────────────────────

function ThinkingView({ idx }: { idx: number }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      {/* Pulsing halo + icon */}
      <div className="relative flex h-20 w-20 items-center justify-center">
        <motion.span
          className="absolute inset-0 rounded-full bg-[#9082C8]/20"
          animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
        />
        <motion.span
          className="absolute inset-2 rounded-full bg-[#9082C8]/25"
          animate={{ scale: [1, 1.35, 1], opacity: [0.7, 0.1, 0.7] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut", delay: 0.3 }}
        />
        <motion.div
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#111111]"
          animate={{ rotate: [0, 8, -8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Sparkles size={24} className="text-white" />
        </motion.div>
      </div>

      {/* Rotating status text */}
      <div className="mt-6 h-6">
        <motion.p
          key={idx}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="font-serif text-base text-[#111111]"
        >
          {THINKING_STEPS[idx]}
        </motion.p>
      </div>

      {/* Progress dots */}
      <div className="mt-4 flex gap-1.5">
        {THINKING_STEPS.map((_, i) => (
          <motion.span
            key={i}
            className="h-1.5 w-1.5 rounded-full"
            animate={{
              backgroundColor: i <= idx ? "#111111" : "#E0E0E0",
              scale: i === idx ? [1, 1.4, 1] : 1,
            }}
            transition={{ duration: 0.6, repeat: i === idx ? Infinity : 0 }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Results ──────────────────────────────────────────────────────────────────

const LIST_VARIANTS = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.1 } },
};
const ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 260, damping: 24 },
  },
};

function ResultsView({
  results,
  answers,
  addedIds,
  onAdd,
}: {
  results: Result[];
  answers: QuizAnswers;
  addedIds: string[];
  onAdd: (id: string) => void;
}) {
  const summary = [answers.skinType, answers.concern, answers.budget, answers.productType]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="px-6 py-5">
      {/* Header */}
      <div className="inline-flex items-center gap-1.5 rounded-full bg-[#F0FFF4] px-3 py-1">
        <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
        <span className="text-[10px] font-bold uppercase tracking-wider text-green-700">
          Personalised for you
        </span>
      </div>
      <h2 className="mt-2.5 font-serif text-xl font-normal text-[#111111]">
        Your recommendations
      </h2>
      {summary && (
        <p className="mt-0.5 text-[12px] text-textgray">{summary}</p>
      )}

      {/* Product cards — revealed one by one */}
      <motion.div
        className="mt-4 space-y-3"
        variants={LIST_VARIANTS}
        initial="hidden"
        animate="show"
      >
        {results.map(({ product, reason, brandName }, i) => {
          const gradient = GRADIENTS[i % GRADIENTS.length];
          const added    = addedIds.includes(product.id);

          return (
            <motion.div
              key={product.id}
              variants={ITEM_VARIANTS}
              className="flex gap-3.5 rounded-[20px] border border-[#F0F0F0] bg-[#FAFAF7] p-3.5"
            >
              {/* Thumbnail */}
              <Link href={`/products/${product.id}`} className="shrink-0">
                <div
                  className={`h-[78px] w-[78px] rounded-[13px] bg-gradient-to-b ${gradient} flex items-center justify-center`}
                >
                  <span className="select-none font-serif text-xl font-light text-white/25">
                    {brandName.slice(0, 2).toUpperCase()}
                  </span>
                </div>
              </Link>

              {/* Info */}
              <div className="flex min-w-0 flex-1 flex-col justify-between gap-1.5">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-textgray">
                    {brandName}
                  </p>
                  <Link href={`/products/${product.id}`}>
                    <p className="mt-0.5 line-clamp-2 font-serif text-[13.5px] font-normal leading-snug text-[#111111] hover:underline">
                      {product.name}
                    </p>
                  </Link>
                  <p className="mt-1 text-[11px] leading-snug text-textgray">{reason}</p>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-serif text-[15px] font-normal text-[#111111]">
                    {formatPrice(product.price)}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Link
                      href={`/products/${product.id}`}
                      className="flex h-7 items-center rounded-full border border-[#EBEBEB] bg-white px-3 text-[11px] font-medium text-[#111111] transition-colors hover:border-[#111111]"
                    >
                      View Detail
                    </Link>
                    <button
                      onClick={() => onAdd(product.id)}
                      disabled={product.stock === 0}
                      className={`flex h-7 items-center gap-1.5 rounded-full px-3 text-[11px] font-semibold transition-all duration-300 disabled:opacity-30 ${
                        added
                          ? "bg-green-500 text-white"
                          : "bg-[#111111] text-white hover:opacity-80"
                      }`}
                    >
                      {added ? (
                        <><Check size={10} /> Added</>
                      ) : (
                        <><ShoppingBag size={10} /> Add to Bag</>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Browse link */}
      <div className="mt-5 pb-1 text-center">
        <Link
          href="/products"
          className="inline-flex items-center gap-1 text-xs text-textgray transition-colors hover:text-[#111111]"
        >
          Browse all products <ChevronRight size={11} />
        </Link>
      </div>
    </div>
  );
}
