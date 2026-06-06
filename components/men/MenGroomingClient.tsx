"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Droplets,
  Sun,
  Scissors,
  Sparkles,
  Waves,
  Check,
  SlidersHorizontal,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import {
  MEN_PRODUCTS,
  MEN_SETS,
  MEN_BRANDS,
  MEN_TRENDING_IDS,
  ROUTINE_STEPS,
  type MenProduct,
  type RoutineStep,
  type MenConcern,
  type MenProductType,
} from "@/lib/men-products";

// ── Neutral product-stage gradients (charcoal / cream / brown — never colorful) ──
const STAGE_GRADIENTS = [
  "from-white via-[#F7F4EF] to-[#E7DECF]",
  "from-white via-[#F4F2F0] to-[#DAD3C8]",
  "from-white via-[#F6F1EA] to-[#E3D7C5]",
  "from-white via-[#F3F3F2] to-[#D6D2CC]",
];

const ROUTINE_ICONS: Record<RoutineStep, typeof Droplets> = {
  Cleanse: Droplets,
  Moisturize: Waves,
  Protect: Sun,
  Style: Scissors,
  Scent: Sparkles,
};

function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

// ── Reusable men product card (neutral palette) ──────────────────────────────
function MenCard({ product, index }: { product: MenProduct; index: number }) {
  const gradient = STAGE_GRADIENTS[index % STAGE_GRADIENTS.length];
  const filled = Math.round(product.rating);
  const reviews =
    product.reviewCount >= 1000
      ? `${(product.reviewCount / 1000).toFixed(1)}k`
      : String(product.reviewCount);

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-[#E7E3DC] bg-white shadow-sm transition-all duration-500 ease-out md:hover:-translate-y-1 md:hover:border-[#1A1A1A]/20 md:hover:shadow-[0_22px_60px_rgba(26,26,26,0.14)]">
      <div className="relative aspect-[4/5] overflow-hidden">
        <div className={`flex h-full w-full items-center justify-center bg-gradient-to-b ${gradient}`}>
          <span
            className="select-none font-serif text-6xl font-light text-[#1A1A1A]/12 md:text-7xl"
            aria-hidden="true"
          >
            {initials(product.brand)}
          </span>
        </div>
        {product.originalPrice ? (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-[#1A1A1A] px-2 py-[3px] text-[9px] font-bold uppercase tracking-wider text-white">
            Sale
          </span>
        ) : product.isNew ? (
          <span className="absolute left-2.5 top-2.5 rounded-full border border-[#1A1A1A] bg-white px-2 py-[3px] text-[9px] font-bold uppercase tracking-wider text-[#1A1A1A]">
            New
          </span>
        ) : null}
        <span className="absolute right-2.5 top-2.5 rounded-full bg-white/80 px-2 py-[3px] text-[9px] font-semibold uppercase tracking-wider text-[#5C5247] backdrop-blur-sm">
          {product.gender === "men" ? "Men" : "Unisex"}
        </span>
      </div>

      <div className="flex flex-1 flex-col px-3 pb-3 pt-2.5">
        <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#9A9183]">
          {product.brand}
        </p>
        <p className="mt-1 line-clamp-2 min-h-[40px] font-serif text-[13px] font-normal leading-snug text-[#1A1A1A]">
          {product.name}
        </p>
        <div className="mt-auto flex items-baseline gap-1.5 pt-2">
          <span className="text-[14px] font-bold text-[#1A1A1A]">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="text-[11px] text-[#B0A99E] line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
        <div className="mt-1.5 flex items-center gap-1">
          <div className="flex gap-px">
            {[1, 2, 3, 4, 5].map((s) => (
              <span
                key={s}
                className={`text-[10px] leading-none ${s <= filled ? "text-[#8A6D3B]" : "text-[#E0DACF]"}`}
              >
                ★
              </span>
            ))}
          </div>
          <span className="text-[9px] text-[#B0A99E]">({reviews})</span>
        </div>
      </div>
    </div>
  );
}

// ── Section heading ──────────────────────────────────────────────────────────
function SectionHead({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <div className="mb-7 text-center">
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#9A9183]">{eyebrow}</p>
      <h2 className="mt-2 font-serif text-2xl font-normal text-[#1A1A1A] md:text-3xl">{title}</h2>
      {sub && <p className="mx-auto mt-1.5 max-w-md text-sm text-[#6B6358]">{sub}</p>}
    </div>
  );
}

const ROUTINE_FILTERS: RoutineStep[] = ["Cleanse", "Moisturize", "Protect", "Style", "Scent"];
const CONCERN_FILTERS: MenConcern[] = [
  "Oil Control",
  "Acne Care",
  "Anti-Aging",
  "Hydration",
  "Sensitive",
  "Hair Styling",
];
const TYPE_FILTERS: MenProductType[] = [
  "Cleanser",
  "Moisturizer",
  "Sunscreen",
  "Hair",
  "Fragrance",
  "Deodorant",
  "Body Wash",
  "Tool",
];
const PRICE_FILTERS = [
  { label: "Under $10", min: 0, max: 10 },
  { label: "$10 – $20", min: 10, max: 20 },
  { label: "$20 – $50", min: 20, max: 50 },
  { label: "$50+", min: 50, max: Infinity },
];
type SortKey = "featured" | "price_asc" | "price_desc" | "rating";

export function MenGroomingClient() {
  const trending = useMemo(
    () =>
      MEN_TRENDING_IDS.map((id) => MEN_PRODUCTS.find((p) => p.id === id)).filter(
        (p): p is MenProduct => Boolean(p)
      ),
    []
  );

  const [routine, setRoutine] = useState<RoutineStep | null>(null);
  const [concern, setConcern] = useState<MenConcern | null>(null);
  const [brand, setBrand] = useState<string | null>(null);
  const [priceIdx, setPriceIdx] = useState<number | null>(null);
  const [type, setType] = useState<MenProductType | null>(null);
  const [sort, setSort] = useState<SortKey>("featured");
  const [mobileFilters, setMobileFilters] = useState(false);

  const filtered = useMemo(() => {
    let rows = MEN_PRODUCTS.filter((p) => {
      if (routine && p.routine !== routine) return false;
      if (concern && !p.concerns.includes(concern)) return false;
      if (brand && p.brand !== brand) return false;
      if (type && p.type !== type) return false;
      if (priceIdx != null) {
        const { min, max } = PRICE_FILTERS[priceIdx];
        if (p.price < min || p.price >= max) return false;
      }
      return true;
    });
    rows = [...rows];
    switch (sort) {
      case "price_asc":
        rows.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        rows.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        rows.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
        break;
      default:
        rows.sort((a, b) => Number(b.isBest) - Number(a.isBest));
    }
    return rows;
  }, [routine, concern, brand, type, priceIdx, sort]);

  const anyFilter = routine || concern || brand || type || priceIdx != null;
  function clearAll() {
    setRoutine(null);
    setConcern(null);
    setBrand(null);
    setType(null);
    setPriceIdx(null);
  }

  return (
    <main className="bg-[#FAF8F4]">
      {/* ── Section 1 · Hero ── */}
      <section className="border-b border-[#E7E3DC] bg-gradient-to-b from-white to-[#F4F0E9]">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-12 md:grid-cols-2 md:px-6 md:py-16">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#9A9183]">
              Men&apos;s Grooming
            </p>
            <h1 className="mt-3 font-serif text-4xl font-normal leading-tight text-[#1A1A1A] md:text-5xl">
              Men&apos;s Grooming, simplified.
            </h1>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[#6B6358]">
              Clean face, fresh hair, daily sunscreen, and fragrance — curated for simple routines.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#shop-sets"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#1A1A1A] px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-85"
              >
                Shop Starter Set
                <ChevronRight size={15} />
              </a>
              <a
                href="#routine"
                className="inline-flex items-center gap-1.5 rounded-full border border-[#1A1A1A]/20 bg-white px-5 py-3 text-sm font-semibold text-[#1A1A1A] transition-colors hover:border-[#1A1A1A]/50"
              >
                Build My Routine
              </a>
            </div>
            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2">
              {ROUTINE_STEPS.map(({ step }) => {
                const Icon = ROUTINE_ICONS[step];
                return (
                  <span key={step} className="inline-flex items-center gap-1.5 text-xs font-medium text-[#5C5247]">
                    <Icon size={14} strokeWidth={1.7} className="text-[#8A6D3B]" />
                    {step}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Visual placeholder — man + product lineup */}
          <div className="relative">
            <div className="relative flex aspect-[4/3] items-end justify-center overflow-hidden rounded-[28px] border border-[#E7E3DC] bg-gradient-to-br from-[#2A2A2A] via-[#3A352E] to-[#1A1A1A]">
              <span className="absolute left-6 top-6 font-serif text-sm italic text-white/40">
                Lumière for Men
              </span>
              <Sparkles className="absolute right-6 top-6 text-white/30" size={20} />
              <div className="flex w-full items-end justify-center gap-3 px-8 pb-8">
                {[68, 92, 76, 100, 60].map((h, i) => (
                  <div
                    key={i}
                    style={{ height: `${h}%` }}
                    className="flex-1 rounded-t-lg bg-gradient-to-b from-white/85 to-white/40 shadow-lg"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 2 · Shop by Set ── */}
      <section id="shop-sets" className="mx-auto max-w-7xl px-4 py-14 md:px-6">
        <SectionHead
          eyebrow="Curated Bundles"
          title="Shop by Set"
          sub="Everything you need in one box — no guesswork, better value."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {MEN_SETS.map((set, i) => (
            <div
              key={set.id}
              className="flex flex-col overflow-hidden rounded-2xl border border-[#E7E3DC] bg-white shadow-sm transition-all duration-500 md:hover:-translate-y-1 md:hover:shadow-[0_22px_60px_rgba(26,26,26,0.12)]"
            >
              <div className={`flex aspect-[5/3] items-center justify-center bg-gradient-to-b ${STAGE_GRADIENTS[i % STAGE_GRADIENTS.length]}`}>
                <span className="font-serif text-2xl font-light text-[#1A1A1A]/25">{set.name}</span>
              </div>
              <div className="flex flex-1 flex-col p-4">
                <h3 className="font-serif text-lg font-normal text-[#1A1A1A]">{set.name}</h3>
                <ul className="mt-2 space-y-1">
                  {set.includes.map((item) => (
                    <li key={item} className="flex items-center gap-1.5 text-xs text-[#6B6358]">
                      <Check size={12} className="text-[#8A6D3B]" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-[11px] font-medium uppercase tracking-wide text-[#9A9183]">
                  Best for
                </p>
                <p className="text-xs text-[#6B6358]">{set.bestFor}</p>
                <div className="mt-3 flex items-baseline gap-1.5">
                  <span className="text-lg font-bold text-[#1A1A1A]">{formatPrice(set.price)}</span>
                  <span className="text-xs text-[#B0A99E] line-through">
                    {formatPrice(set.originalPrice)}
                  </span>
                </div>
                <button
                  type="button"
                  className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-[#1A1A1A] px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-85"
                >
                  Buy Set
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 3 · Trending for Men ── */}
      <section className="border-y border-[#E7E3DC] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-6">
          <SectionHead eyebrow="Most Loved" title="Trending for Men" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {trending.map((p, i) => (
              <MenCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 4 · Simple 5-Step Routine ── */}
      <section id="routine" className="mx-auto max-w-7xl px-4 py-14 md:px-6">
        <SectionHead
          eyebrow="The Basics"
          title="Simple 5-Step Routine"
          sub="Five minutes, morning and night. That's the whole thing."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {ROUTINE_STEPS.map(({ step, note }, i) => {
            const Icon = ROUTINE_ICONS[step];
            return (
              <div
                key={step}
                className="relative rounded-2xl border border-[#E7E3DC] bg-white p-5 shadow-sm"
              >
                <span className="absolute right-4 top-4 font-serif text-3xl font-light text-[#1A1A1A]/10">
                  {i + 1}
                </span>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1A1A1A]">
                  <Icon size={18} strokeWidth={1.7} className="text-white" />
                </div>
                <h3 className="mt-3 font-serif text-lg font-normal text-[#1A1A1A]">{step}</h3>
                <p className="mt-1 text-xs leading-relaxed text-[#6B6358]">{note}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Section 5 · Product Listing ── */}
      <section className="border-t border-[#E7E3DC] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-6">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#9A9183]">
                The Edit
              </p>
              <h2 className="mt-2 font-serif text-2xl font-normal text-[#1A1A1A] md:text-3xl">
                All Products
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMobileFilters((v) => !v)}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#E7E3DC] px-3 py-2 text-xs font-semibold text-[#1A1A1A] lg:hidden"
              >
                <SlidersHorizontal size={13} />
                Filters
              </button>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="rounded-full border border-[#E7E3DC] bg-white px-3 py-2 text-xs font-medium text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#1A1A1A]"
              >
                <option value="featured">Featured</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[230px_1fr]">
            {/* Filters */}
            <aside className={`${mobileFilters ? "block" : "hidden"} lg:block`}>
              <div className="space-y-6 rounded-2xl border border-[#E7E3DC] bg-[#FAF8F4] p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#1A1A1A]">Filters</h3>
                  {anyFilter && (
                    <button
                      type="button"
                      onClick={clearAll}
                      className="text-[11px] font-semibold text-[#8A6D3B] hover:underline"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                <FilterGroup label="Routine">
                  {ROUTINE_FILTERS.map((r) => (
                    <Chip key={r} active={routine === r} onClick={() => setRoutine(routine === r ? null : r)}>
                      {r}
                    </Chip>
                  ))}
                </FilterGroup>

                <FilterGroup label="Concern">
                  {CONCERN_FILTERS.map((c) => (
                    <Chip key={c} active={concern === c} onClick={() => setConcern(concern === c ? null : c)}>
                      {c}
                    </Chip>
                  ))}
                </FilterGroup>

                <FilterGroup label="Product Type">
                  {TYPE_FILTERS.map((t) => (
                    <Chip key={t} active={type === t} onClick={() => setType(type === t ? null : t)}>
                      {t}
                    </Chip>
                  ))}
                </FilterGroup>

                <FilterGroup label="Brand">
                  {MEN_BRANDS.map((b) => (
                    <Chip key={b} active={brand === b} onClick={() => setBrand(brand === b ? null : b)}>
                      {b}
                    </Chip>
                  ))}
                </FilterGroup>

                <FilterGroup label="Price">
                  {PRICE_FILTERS.map((p, i) => (
                    <Chip key={p.label} active={priceIdx === i} onClick={() => setPriceIdx(priceIdx === i ? null : i)}>
                      {p.label}
                    </Chip>
                  ))}
                </FilterGroup>
              </div>
            </aside>

            {/* Grid */}
            <div>
              <p className="mb-4 text-xs text-[#9A9183]">
                {filtered.length} {filtered.length === 1 ? "product" : "products"}
              </p>
              {filtered.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#D8D2C8] bg-[#FAF8F4] py-16 text-center">
                  <p className="font-serif text-lg text-[#1A1A1A]">No products match</p>
                  <button
                    type="button"
                    onClick={clearAll}
                    className="mt-3 rounded-full bg-[#1A1A1A] px-4 py-2 text-xs font-semibold text-white"
                  >
                    Reset filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {filtered.map((p, i) => (
                    <MenCard key={p.id} product={p} index={i} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 6 · Popular Brands ── */}
      <section className="border-t border-[#E7E3DC] bg-[#FAF8F4]">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-6">
          <SectionHead eyebrow="Trusted By Men" title="Popular Brands" />
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9">
            {MEN_BRANDS.map((b) => (
              <div
                key={b}
                className="flex h-20 items-center justify-center rounded-xl border border-[#E7E3DC] bg-white px-3 text-center transition-colors hover:border-[#1A1A1A]/30"
              >
                <span className="font-serif text-sm font-normal text-[#1A1A1A]">{b}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[#9A9183]">{label}</p>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors ${
        active
          ? "border-[#1A1A1A] bg-[#1A1A1A] text-white"
          : "border-[#E0DACF] bg-white text-[#5C5247] hover:border-[#1A1A1A]/40"
      }`}
    >
      {children}
    </button>
  );
}
