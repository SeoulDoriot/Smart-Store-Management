"use client";

import { useState, useEffect, useRef, type ReactNode } from "react";
import { Check, ShoppingBag, Clock, Sparkles, RefreshCw } from "lucide-react";

// ─── FadeIn (used for mobile stacked layout) ──────────────────────────────────

function useFI() {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setV(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, v };
}

function FadeIn({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const { ref, v } = useFI();
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ${v ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
    >
      {children}
    </div>
  );
}

// ─── AnimCard: entrance animation on each step change ────────────────────────

function AnimCard({ children }: { children: ReactNode }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), 30);
    return () => clearTimeout(t);
  }, []);
  return (
    <div
      className={`transition-all duration-500 ease-out ${
        show ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-5 scale-[0.98]"
      }`}
    >
      {children}
    </div>
  );
}

// ─── Static data ──────────────────────────────────────────────────────────────

const STEP_LABELS = [
  "Order Summary",
  "Choose Payment",
  "Scan QR Code",
  "Payment Verified",
  "Receipt Ready",
];

const ORDER_ITEMS = [
  { name: "Anua Heartleaf 77% Toner",  price: "$18.00", grad: "from-[#EDD0CA] to-[#B8877E]" },
  { name: "COSRX Low pH Gel Cleanser", price: "$12.00", grad: "from-[#C4DAD2] to-[#7EAB9C]" },
];

const PAY_METHODS = [
  { id: "khqr",   label: "KHQR",             emoji: "🔲", bg: "bg-[#0D5E3A]", text: "text-white" },
  { id: "aba",    label: "ABA Pay",           emoji: "🏦", bg: "bg-[#C0001E]", text: "text-white" },
  { id: "bakong", label: "Bakong",            emoji: "◈",  bg: "bg-[#4A2D8A]", text: "text-white" },
  { id: "cod",    label: "Cash on Delivery",  emoji: "🚚", bg: "bg-[#EAD8C5]", text: "text-[#5A3A10]" },
];

// ─── QR Code visual (mock pattern) ───────────────────────────────────────────

function QRVisual() {
  const data = [1,0,1,0,1,1, 0,1,0,1,0,1, 1,1,0,0,1,0, 0,1,1,0,1,0, 1,0,0,1,0,1];
  return (
    <div className="inline-block rounded-[14px] bg-white p-4 shadow-[0_2px_24px_rgba(0,0,0,0.10)]">
      <div className="relative h-[130px] w-[130px]">
        {/* Corner markers */}
        {[["left-0 top-0"], ["right-0 top-0"], ["left-0 bottom-0"]].map(([pos], i) => (
          <div key={i} className={`absolute ${pos} h-[34px] w-[34px] rounded-[4px] border-[3.5px] border-[#111111]`}>
            <div className="absolute inset-[5.5px] rounded-[1px] bg-[#111111]" />
          </div>
        ))}
        {/* Data area */}
        <div className="absolute inset-[42px] grid grid-cols-5 gap-[2.5px]">
          {data.map((d, i) => (
            <div key={i} className={`rounded-[1px] ${d ? "bg-[#111111]" : ""}`} />
          ))}
        </div>
        {/* Bottom-right filler dots */}
        <div className="absolute bottom-[2px] right-[2px] grid grid-cols-4 gap-[2.5px]">
          {[1,0,1,0,0,1,1,0,1,0,0,1,1,1,0,0].map((d, i) => (
            <div key={i} className={`h-3.5 w-3.5 rounded-[1px] ${d ? "bg-[#111111]" : ""}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Step card components ─────────────────────────────────────────────────────

function OrderCard() {
  return (
    <AnimCard>
      <div className="rounded-[24px] border border-[#F0F0F0] bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <ShoppingBag size={15} className="text-textgray" />
          <h3 className="font-serif text-[17px] font-normal text-[#111111]">Order Summary</h3>
        </div>
        <div className="space-y-3">
          {ORDER_ITEMS.map(item => (
            <div key={item.name} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className={`h-8 w-8 shrink-0 rounded-[8px] bg-gradient-to-b ${item.grad}`} />
                <span className="line-clamp-1 text-[12.5px] text-textgray">{item.name}</span>
              </div>
              <span className="shrink-0 text-[13px] font-medium text-[#111111]">{item.price}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 space-y-1.5 border-t border-[#F0F0F0] pt-4">
          <div className="flex justify-between text-[12px] text-textgray">
            <span>Subtotal</span><span>$30.00</span>
          </div>
          <div className="flex justify-between text-[12px] text-textgray">
            <span>Delivery</span><span>$3.00</span>
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <span className="text-[13px] font-semibold text-[#111111]">Total</span>
            <span className="font-serif text-xl font-normal text-[#111111]">$33.00</span>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 rounded-[12px] bg-[#FAFAF7] px-3 py-2.5">
          <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
          <span className="text-[11px] text-textgray">Delivering to Phnom Penh · 2–4 hrs</span>
        </div>
      </div>
    </AnimCard>
  );
}

function PaymentMethodsCard() {
  const [selected, setSelected] = useState<string | null>(null);
  useEffect(() => {
    const t = setTimeout(() => setSelected("aba"), 700);
    return () => clearTimeout(t);
  }, []);
  return (
    <AnimCard>
      <div className="rounded-[24px] border border-[#F0F0F0] bg-white p-6 shadow-sm">
        <h3 className="mb-5 font-serif text-[17px] font-normal text-[#111111]">
          Choose Payment Method
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {PAY_METHODS.map(({ id, label, emoji, bg, text }) => {
            const sel = selected === id;
            return (
              <button
                key={id}
                onClick={() => setSelected(id)}
                className={`relative flex flex-col items-start gap-2 rounded-[16px] ${bg} p-4 transition-all duration-300 ${
                  sel ? "ring-2 ring-[#111111] ring-offset-2 scale-[1.02]" : "opacity-75 hover:opacity-100"
                }`}
              >
                <span className="text-lg leading-none">{emoji}</span>
                <span className={`text-[12px] font-semibold leading-tight ${text}`}>{label}</span>
                {sel && (
                  <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-white/90">
                    <Check size={10} className="text-[#111111]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
        {selected && (
          <div className="mt-4 flex items-center gap-2 rounded-[12px] bg-[#F0FFF4] px-3 py-2.5">
            <Check size={11} className="text-green-600" />
            <span className="text-[11px] font-medium text-green-700">
              {PAY_METHODS.find(m => m.id === selected)?.label} selected
            </span>
          </div>
        )}
      </div>
    </AnimCard>
  );
}

function QRCard() {
  const [glow, setGlow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setGlow(true), 500);
    return () => clearTimeout(t);
  }, []);
  return (
    <AnimCard>
      <div className="rounded-[24px] border border-[#F0F0F0] bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-serif text-[17px] font-normal text-[#111111]">ABA Pay</h3>
          <div className="flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1">
            <Check size={10} className="text-green-600" />
            <span className="text-[10px] font-semibold text-green-700">Selected</span>
          </div>
        </div>
        <div
          className={`flex justify-center transition-all duration-700 ${
            glow ? "drop-shadow-[0_0_20px_rgba(17,17,17,0.12)]" : ""
          }`}
        >
          <QRVisual />
        </div>
        <div className="mt-5 space-y-1 text-center">
          <p className="text-[13px] font-medium text-[#111111]">Scan with ABA Pay app</p>
          <p className="font-serif text-xl font-normal text-[#111111]">$33.00</p>
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-textgray">
            <Clock size={11} />
            <span>Expires in 10:00</span>
          </div>
        </div>
      </div>
    </AnimCard>
  );
}

const VERIFY_STEPS = [
  "Order Received",
  "Payment Submitted",
  "Transaction Verified",
  "Payment Confirmed",
];

function StatusCard() {
  const [done, setDone] = useState(0);
  useEffect(() => {
    const ts = VERIFY_STEPS.map((_, i) =>
      setTimeout(() => setDone(i + 1), 500 + i * 800)
    );
    return () => ts.forEach(clearTimeout);
  }, []);
  const complete = done >= 4;
  return (
    <AnimCard>
      <div className="rounded-[24px] border border-[#F0F0F0] bg-white p-6 shadow-sm">
        <div className="mb-5 text-center">
          <div className={`inline-flex items-center gap-1.5 transition-all duration-500 ${complete ? "opacity-100" : "opacity-60"}`}>
            {complete ? (
              <Check size={14} className="text-green-600" />
            ) : (
              <RefreshCw size={13} className="animate-spin text-textgray" />
            )}
            <span className={`text-[13px] font-medium ${complete ? "text-green-700" : "text-textgray"}`}>
              {complete ? "Payment Successful!" : "Verifying payment…"}
            </span>
          </div>
        </div>
        <div className="space-y-3.5">
          {VERIFY_STEPS.map((label, i) => {
            const isDone   = i < done;
            const isActive = i === done;
            return (
              <div key={label} className="flex items-center gap-3">
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all duration-500 ${
                    isDone
                      ? "bg-green-500"
                      : isActive
                      ? "border-2 border-[#111111] bg-white"
                      : "border-2 border-[#EBEBEB] bg-white"
                  }`}
                >
                  {isDone ? (
                    <Check size={12} className="text-white" />
                  ) : isActive ? (
                    <div className="h-2 w-2 animate-pulse rounded-full bg-[#111111]" />
                  ) : null}
                </div>
                <span
                  className={`text-[13px] transition-all duration-500 ${
                    isDone && i === 3
                      ? "font-semibold text-green-700"
                      : isDone
                      ? "font-medium text-[#111111]"
                      : isActive
                      ? "font-medium text-[#111111] opacity-60"
                      : "text-textgray/35"
                  }`}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </AnimCard>
  );
}

function ReceiptCard() {
  const [badge, setBadge] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setBadge(true), 400);
    return () => clearTimeout(t);
  }, []);
  return (
    <AnimCard>
      <div className="relative pt-5">
        {/* Floating badge */}
        <div
          className={`absolute left-1/2 top-0 -translate-x-1/2 transition-all duration-500 ${
            badge ? "opacity-100 -translate-y-1" : "opacity-0 translate-y-1"
          }`}
        >
          <div className="flex items-center gap-1.5 rounded-full bg-green-500 px-4 py-1.5 shadow-lg">
            <Check size={11} className="text-white" />
            <span className="text-[11px] font-bold text-white">Payment Successful</span>
          </div>
        </div>

        <div className="rounded-[24px] border border-[#F0F0F0] bg-white p-6 shadow-sm">
          <div className="mb-4 border-b border-dashed border-[#EBEBEB] pb-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-textgray">
              Receipt
            </p>
            <p className="mt-1 font-serif text-[17px] font-normal text-[#111111]">
              Order #ORD-2026-1234
            </p>
          </div>
          <div className="space-y-2.5">
            {[
              ["Date",    "Jun 1, 2026"],
              ["Method",  "ABA Pay"],
              ["Items",   "2 products"],
              ["Total",   "$33.00"],
            ].map(([k, val]) => (
              <div key={k} className="flex justify-between">
                <span className="text-[12.5px] text-textgray">{k}</span>
                <span className="text-[12.5px] font-medium text-[#111111]">{val}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2 rounded-[12px] bg-[#F0FFF4] px-3 py-2.5">
            <Sparkles size={11} className="text-green-600" />
            <span className="text-[11px] font-medium text-green-700">
              Receipt sent via Telegram ✓
            </span>
          </div>
        </div>
      </div>
    </AnimCard>
  );
}

// ─── Step Panel ───────────────────────────────────────────────────────────────

function StepPanel({ step }: { step: number }) {
  // step -1 and 0 both show OrderCard (no re-mount when going from -1 to 0)
  return (
    <div className="w-full">
      {step <= 0 && <OrderCard key="order" />}
      {step === 1 && <PaymentMethodsCard key="pay" />}
      {step === 2 && <QRCard key="qr" />}
      {step === 3 && <StatusCard key="status" />}
      {step === 4 && <ReceiptCard key="receipt" />}
    </div>
  );
}

// ─── Desktop: sticky scroll-driven section ────────────────────────────────────

function DesktopScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(-1);

  useEffect(() => {
    const onScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      // Skip if hidden (display:none on mobile viewport)
      if (el.getBoundingClientRect().height === 0) return;

      const rect = el.getBoundingClientRect();
      const scrolled = -rect.top;
      const range = el.offsetHeight - window.innerHeight;
      if (scrolled <= 0)   { setStep(-1); return; }
      if (scrolled >= range) { setStep(4); return; }
      const progress = scrolled / range;
      setStep(Math.floor(progress * 5));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div ref={containerRef} style={{ height: "500vh" }}>
      <div className="sticky top-0 h-screen overflow-hidden bg-gradient-to-br from-[#FDFAF8] to-[#F7EEE6]">
        <div className="flex h-full items-center justify-center">
          <div className="grid w-full max-w-5xl grid-cols-[1fr_420px] items-center gap-16 px-8 xl:gap-20">

            {/* ── Left: copy + step list ── */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-textgray">
                Payment Flow
              </p>
              <h2 className="mt-2 font-serif text-3xl font-normal leading-snug text-[#111111] lg:text-4xl">
                Smooth payment,
                <br />
                clear confirmation.
              </h2>
              <p className="mt-3 max-w-xs text-[13.5px] leading-relaxed text-textgray">
                Choose your payment method, scan the QR, submit, and receive
                confirmation with a digital receipt.
              </p>

              {/* Step list */}
              <div className="mt-8 space-y-3.5">
                {STEP_LABELS.map((label, i) => {
                  const isDone   = i < step;
                  const isActive = i === step || (step === -1 && i === 0);
                  return (
                    <div
                      key={i}
                      className={`flex items-center gap-3 transition-all duration-400 ${
                        isActive ? "opacity-100" : isDone ? "opacity-50" : "opacity-20"
                      }`}
                    >
                      <div
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold transition-all duration-300 ${
                          isDone
                            ? "bg-green-500 text-white"
                            : isActive
                            ? "bg-[#111111] text-white"
                            : "border border-[#DCDCDC] text-textgray"
                        }`}
                      >
                        {isDone ? <Check size={12} /> : i + 1}
                      </div>
                      <span
                        className={`text-[13.5px] transition-all duration-300 ${
                          isActive ? "font-semibold text-[#111111]" :
                          isDone   ? "font-medium text-textgray"   :
                          "text-textgray"
                        }`}
                      >
                        {label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Right: animated card ── */}
            <div>
              <StepPanel step={step} />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Mobile: stacked FadeIn steps ────────────────────────────────────────────

function MobileSteps() {
  return (
    <section className="bg-gradient-to-b from-[#FDFAF8] to-[#F7EEE6] py-20">
      <div className="mx-auto max-w-lg px-5">
        <FadeIn>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-textgray">
            Payment Flow
          </p>
          <h2 className="mt-2 font-serif text-3xl font-normal text-[#111111]">
            Smooth payment,
            <br />
            clear confirmation.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-textgray">
            Choose your method, scan the QR, and get your digital receipt.
          </p>
        </FadeIn>

        <div className="mt-8 space-y-8">
          {[
            { n: 1, label: "Order Summary",   card: <OrderCard /> },
            { n: 2, label: "Choose Payment",  card: <PaymentMethodsCard /> },
            { n: 3, label: "Scan QR Code",    card: <QRCard /> },
            { n: 4, label: "Verify Payment",  card: <StatusCard /> },
            { n: 5, label: "Receipt Ready",   card: <ReceiptCard /> },
          ].map(({ n, label, card }, i) => (
            <FadeIn key={n} delay={i * 120}>
              <div className="flex items-start gap-3.5">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#111111] text-[11px] font-bold text-white">
                  {n}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="mb-2.5 text-[10px] font-bold uppercase tracking-wider text-textgray">
                    {label}
                  </p>
                  {card}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function PaymentSection() {
  return (
    <>
      {/* Desktop: pinned scroll animation */}
      <div className="hidden md:block">
        <DesktopScroll />
      </div>
      {/* Mobile: stacked FadeIn steps */}
      <div className="md:hidden">
        <MobileSteps />
      </div>
    </>
  );
}
