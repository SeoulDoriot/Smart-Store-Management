"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Sparkles, X, Send, ChevronRight } from "lucide-react";

// ─── Mini rule-based chat ─────────────────────────────────────────────────────

function getMiniResponse(input: string): string {
  const q = input.toLowerCase();
  const has = (...t: string[]) => t.some(x => q.includes(x));

  if (has("acne", "breakout", "pimple", "blemish"))
    return "For acne-prone skin, try a low-pH cleanser (COSRX $12) + niacinamide serum (The Ordinary $8). Keep it simple and consistent!";

  if (has("oily"))
    return "Oily skin benefits from niacinamide to regulate sebum. Don't skip moisturizer — skipping it triggers even more oil production.";

  if (has("sunscreen", "spf", "sun protection", "sun screen"))
    return "Beauty of Joseon Relief Sun SPF50+ is lightweight and loved by all skin types — the best daily habit for your skin!";

  if (has("routine", "under $30", "budget", "cheap"))
    return "A budget routine: COSRX Cleanser ($12) + The Ordinary Niacinamide ($8) + Beauty of Joseon Sun ($17). Under $37 total!";

  if (has("dry", "dehydrat", "flaky", "tight"))
    return "Layer hydration thin-to-thick: hydrating toner → centella ampoule → CeraVe Moisturizing Cream to seal everything in.";

  if (has("sensitive", "redness", "irritat", "inflam"))
    return "For sensitive skin, look for heartleaf (Anua) or centella (Skin1004) — both calming and fragrance-free.";

  if (has("dark spot", "pigment", "bright", "glow", "dull"))
    return "For dark spots: Some By Mi AHA BHA Toner (PM only) + Beauty of Joseon Glow Serum. Always follow with SPF!";

  if (has("hydrat", "moistur", "water"))
    return "Layer hydration: toner → essence → moisturizer. COSRX Snail Mucin Essence is a top pick for deep moisture.";

  if (has("serum"))
    return "Choose a serum based on your concern: niacinamide for oil/pores, centella for redness, propolis for brightening.";

  if (has("cleanser", "wash", "cleanse"))
    return "COSRX Low pH Gel Cleanser is gentle, effective, and under $15 — great for most skin types including acne-prone.";

  return "I can help with acne, oily skin, sunscreen, dark spots, dryness, and more. What's your main skin concern? 😊";
}

// ─── Chips ────────────────────────────────────────────────────────────────────

const CHIPS = ["Acne", "Oily skin", "Sunscreen", "Routine under $30"];

// ─── Component ────────────────────────────────────────────────────────────────

export function FloatingAIButton() {
  const [open, setOpen]       = useState(false);
  const [input, setInput]     = useState("");
  const [answer, setAnswer]   = useState("");
  const [loading, setLoading] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const btnRef   = useRef<HTMLButtonElement>(null);

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      const target = e.target as Node;
      if (
        panelRef.current && !panelRef.current.contains(target) &&
        btnRef.current   && !btnRef.current.contains(target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  function send(text: string) {
    const t = text.trim();
    if (!t || loading) return;
    setInput("");
    setAnswer("");
    setLoading(true);
    setTimeout(() => {
      setAnswer(getMiniResponse(t));
      setLoading(false);
    }, 700);
  }

  function handleClose() {
    setOpen(false);
  }

  return (
    <>
      {/* ── Chat panel (always in DOM, animated via classes) ── */}
      <div
        ref={panelRef}
        className={`fixed bottom-[88px] right-6 z-50 w-[320px] overflow-hidden rounded-[24px] border border-[#EBEBEB] bg-white shadow-[0_8px_40px_rgba(0,0,0,0.13)] transition-all duration-300 origin-bottom-right sm:w-[340px] ${
          open
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-95 translate-y-3 pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#F0F0F0] px-4 py-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#111111]">
              <Sparkles size={14} className="text-white" />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-[#111111]">AI Beauty Advisor</p>
              <div className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                <span className="text-[10px] text-green-600">Online</span>
              </div>
            </div>
          </div>
          <button
            onClick={handleClose}
            aria-label="Close"
            className="flex h-7 w-7 items-center justify-center rounded-full text-textgray transition-colors hover:bg-[#F0F0F0] hover:text-[#111111]"
          >
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <div className="px-4 pt-4 pb-3 space-y-3">
          {/* Intro or answer */}
          {!loading && !answer && (
            <div className="rounded-[14px] bg-[#FAFAF7] px-3.5 py-3 text-[13px] leading-relaxed text-[#111111]">
              Hi! Tell me your skin concern and I&apos;ll suggest the right products for you. 😊
            </div>
          )}

          {loading && (
            <div className="flex items-center gap-1.5 rounded-[14px] bg-[#FAFAF7] px-3.5 py-3.5">
              <span className="h-2 w-2 animate-bounce rounded-full bg-textgray/40 [animation-delay:0ms]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-textgray/40 [animation-delay:150ms]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-textgray/40 [animation-delay:300ms]" />
            </div>
          )}

          {!loading && answer && (
            <div className="rounded-[14px] bg-[#FAFAF7] px-3.5 py-3 text-[13px] leading-relaxed text-[#111111]">
              {answer}
            </div>
          )}

          {/* Quick chips — always visible if no answer yet */}
          {!answer && !loading && (
            <div className="flex flex-wrap gap-1.5">
              {CHIPS.map(c => (
                <button
                  key={c}
                  onClick={() => send(c)}
                  className="rounded-full border border-[#EBEBEB] bg-white px-3 py-1 text-[11px] font-medium text-[#333] transition-colors hover:border-[#111111] hover:text-[#111111]"
                >
                  {c}
                </button>
              ))}
            </div>
          )}

          {/* Re-ask link when answer is shown */}
          {answer && (
            <button
              onClick={() => setAnswer("")}
              className="text-[11px] text-textgray transition-colors hover:text-[#111111]"
            >
              Ask something else →
            </button>
          )}
        </div>

        {/* Input row */}
        <div className="border-t border-[#F0F0F0] px-3 py-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter") { e.preventDefault(); send(input); }
              }}
              placeholder="Ask about your skin…"
              className="h-10 flex-1 rounded-full border border-[#EBEBEB] bg-[#FAFAF7] px-3.5 text-[12px] text-[#111111] placeholder-textgray/50 transition-colors focus:border-[#111111] focus:bg-white focus:outline-none"
            />
            <button
              onClick={() => send(input)}
              disabled={!input.trim() || loading}
              aria-label="Send"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#111111] text-white transition-opacity hover:opacity-80 disabled:opacity-30"
            >
              <Send size={13} />
            </button>
          </div>
        </div>

        {/* Footer link */}
        <div className="border-t border-[#F0F0F0] px-4 py-2.5">
          <Link
            href="/ai-advisor"
            onClick={handleClose}
            className="flex items-center justify-center gap-1.5 text-[11px] font-medium text-textgray transition-colors hover:text-[#111111]"
          >
            <Sparkles size={11} />
            Open full AI Advisor
            <ChevronRight size={10} />
          </Link>
        </div>
      </div>

      {/* ── Trigger button ── */}
      <button
        ref={btnRef}
        onClick={() => setOpen(prev => !prev)}
        aria-label="Ask AI Advisor"
        className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#111111] shadow-[0_4px_20px_rgba(0,0,0,0.25)] transition-all duration-300 hover:scale-105 hover:shadow-[0_6px_28px_rgba(0,0,0,0.35)] ${
          open ? "rotate-[15deg]" : "rotate-0"
        }`}
      >
        <Sparkles size={21} className="text-white" />
      </button>
    </>
  );
}
