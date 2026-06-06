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

// ── Neutral product-stage gradients (charcoal / cool gray / deep brown) ──
const STAGE_GRADIENTS = [
  "from-white via-[#F2F4F6] to-[#D9DEE3]",
  "from-white via-[#F5F6F7] to-[#C9CED4]",
  "from-white via-[#F1F2F3] to-[#BFC5CA]",
  "from-white via-[#F3F1EE] to-[#C6B7A5]",
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
function MenCard({
  product,
  index,
  onAdd,
}: {
  product: MenProduct;
  index: number;
  onAdd: (product: MenProduct) => void;
}) {
  const gradient = STAGE_GRADIENTS[index % STAGE_GRADIENTS.length];
  const filled = Math.round(product.rating);
  const reviews =
    product.reviewCount >= 1000
      ? `${(product.reviewCount / 1000).toFixed(1)}k`
      : String(product.reviewCount);

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-[#D9DEE3] bg-white shadow-sm transition-all duration-300 ease-out md:hover:-translate-y-0.5 md:hover:border-[#111111]/25 md:hover:shadow-[0_14px_34px_rgba(17,17,17,0.12)]">
      <div className="relative aspect-[4/3] overflow-hidden">
        <div className={`flex h-full w-full items-center justify-center bg-gradient-to-b ${gradient}`}>
          <span
            className="select-none font-serif text-4xl font-light text-[#111111]/12 md:text-5xl"
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
        <span className="absolute right-2.5 top-2.5 rounded-full bg-white/85 px-2 py-[3px] text-[9px] font-semibold uppercase tracking-wider text-[#3F454A] backdrop-blur-sm">
          {product.gender === "men" ? "Men" : "Unisex"}
        </span>
      </div>

      <div className="flex flex-1 flex-col px-3 pb-3 pt-2.5">
        <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#6B7280]">
          {product.brand}
        </p>
        <p className="mt-1 line-clamp-2 min-h-[34px] text-[13px] font-semibold leading-snug text-[#111111]">
          {product.name}
        </p>
        <div className="mt-auto flex items-baseline gap-1.5 pt-1.5">
          <span className="text-[15px] font-bold text-[#111111]">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="text-[11px] text-[#9CA3AF] line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
        <div className="mt-1 flex items-center gap-1">
          <div className="flex gap-px">
            {[1, 2, 3, 4, 5].map((s) => (
              <span
                key={s}
                className={`text-[10px] leading-none ${s <= filled ? "text-[#6B4E2E]" : "text-[#D9DEE3]"}`}
              >
                ★
              </span>
            ))}
          </div>
          <span className="text-[9px] text-[#9CA3AF]">({reviews})</span>
        </div>
        <div className="mt-2 grid grid-cols-[1fr_auto] gap-1.5">
          <button
            type="button"
            onClick={() => onAdd(product)}
            className="h-8 rounded-lg bg-[#111111] px-2 text-[11px] font-semibold text-white transition-opacity hover:opacity-85"
          >
            Add to Bag
          </button>
          <Link
            href={`/men?quick=${product.id}`}
            className="flex h-8 items-center justify-center rounded-lg border border-[#D9DEE3] px-2 text-[11px] font-semibold text-[#111111] hover:border-[#111111]/40"
          >
            Quick Look
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Section heading ──────────────────────────────────────────────────────────
function SectionHead({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <div className="mb-5 text-center">
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#6B7280]">{eyebrow}</p>
      <h2 className="mt-1.5 text-2xl font-semibold text-[#111111] md:text-3xl">{title}</h2>
      {sub && <p className="mx-auto mt-1.5 max-w-md text-sm text-[#4B5563]">{sub}</p>}
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

const QUICK_SHOP_CHIPS: {
  label: string;
  type?: MenProductType;
  best?: boolean;
}[] = [
  { label: "Face Wash", type: "Cleanser" },
  { label: "Moisturizer", type: "Moisturizer" },
  { label: "Sunscreen", type: "Sunscreen" },
  { label: "Hair Styling", type: "Hair" },
  { label: "Fragrance", type: "Fragrance" },
  { label: "Body Care", type: "Body Wash" },
  { label: "Sets" },
  { label: "Trending", best: true },
];

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
  const [added, setAdded] = useState<string | null>(null);

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

  function addToBag(product: MenProduct) {
    setAdded(product.name);
    window.setTimeout(() => setAdded(null), 1800);
  }

  function applyQuickChip(chip: (typeof QUICK_SHOP_CHIPS)[number]) {
    if (chip.label === "Sets") {
      document.getElementById("shop-sets")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    clearAll();
    if (chip.type) setType(chip.type);
    if (chip.best) setSort("rating");
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <main className="bg-[#F5F6F7]">
      {/* ── Section 1 · Hero ── */}
      <section className="border-b border-[#D9DEE3] bg-white">
        <div className="mx-auto grid max-w-7xl items-center gap-6 px-4 py-8 md:grid-cols-[1.05fr_0.95fr] md:px-6 md:py-10">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#6B7280]">
              Men&apos;s Grooming
            </p>
            <h1 className="mt-2 text-4xl font-semibold leading-tight text-[#111111] md:text-5xl">
              Fast grooming. Better basics.
            </h1>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-[#4B5563]">
              Face wash, SPF, hair styling, fragrance, and sets built for quick decisions.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href="#shop-sets"
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#111111] px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-85"
              >
                Buy a Set
                <ChevronRight size={15} />
              </a>
              <a
                href="#products"
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#111111]/20 bg-white px-5 py-3 text-sm font-semibold text-[#111111] transition-colors hover:border-[#111111]/50"
              >
                Shop Trending
              </a>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {QUICK_SHOP_CHIPS.map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={() => applyQuickChip(chip)}
                  className="rounded-full border border-[#D9DEE3] bg-[#F5F6F7] px-3 py-1.5 text-xs font-semibold text-[#111111] hover:border-[#111111]/35 hover:bg-white"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Visual placeholder — man + product lineup */}
          <div className="relative">
            <div className="relative flex aspect-[16/9] items-end justify-center overflow-hidden rounded-2xl border border-[#D9DEE3] bg-gradient-to-br from-[#25282B] via-[#363330] to-[#111111]">
              <span className="absolute left-5 top-5 text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
                Lumière for Men
              </span>
              <Sparkles className="absolute right-5 top-5 text-white/25" size={18} />
              <div className="flex w-full items-end justify-center gap-2.5 px-8 pb-6">
                {[68, 92, 76, 100, 60].map((h, i) => (
                  <div
                    key={i}
                    style={{ height: `${h}%` }}
                    className="flex-1 rounded-t-md bg-gradient-to-b from-white/90 to-white/35 shadow-lg"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 2 · Shop by Set ── */}
      <section id="shop-sets" className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <SectionHead
          eyebrow="Curated Bundles"
          title="Shop by Set"
          sub="Everything useful, bundled. Pick a set and go."
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {MEN_SETS.map((set, i) => (
            <div
              key={set.id}
              className="flex flex-col overflow-hidden rounded-xl border border-[#D9DEE3] bg-white shadow-sm transition-all duration-300 md:hover:-translate-y-0.5 md:hover:shadow-[0_14px_34px_rgba(17,17,17,0.10)]"
            >
              <div className={`flex h-20 items-center justify-center bg-gradient-to-b ${STAGE_GRADIENTS[i % STAGE_GRADIENTS.length]}`}>
                <span className="text-lg font-semibold text-[#111111]/30">{set.name}</span>
              </div>
              <div className="flex flex-1 flex-col p-3">
                <h3 className="text-base font-semibold text-[#111111]">{set.name}</h3>
                <ul className="mt-1.5 space-y-0.5">
                  {set.includes.map((item) => (
                    <li key={item} className="flex items-center gap-1.5 text-[11px] text-[#4B5563]">
                      <Check size={11} className="text-[#6B4E2E]" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-2 line-clamp-1 text-[11px] text-[#6B7280]">{set.bestFor}</p>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="text-lg font-bold text-[#111111]">{formatPrice(set.price)}</span>
                  <span className="text-xs text-[#9CA3AF] line-through">
                    {formatPrice(set.originalPrice)}
                  </span>
                </div>
                <button
                  type="button"
                  className="mt-2 inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-[#111111] px-3 text-xs font-semibold text-white transition-opacity hover:opacity-85"
                >
                  Buy Set
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 3 · Trending for Men ── */}
      <section className="border-y border-[#D9DEE3] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
          <SectionHead eyebrow="Most Loved" title="Trending for Men" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {trending.map((p, i) => (
              <MenCard key={p.id} product={p} index={i} onAdd={addToBag} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 4 · Simple 5-Step Routine ── */}
      <section id="routine" className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <SectionHead
          eyebrow="The Basics"
          title="Simple 5-Step Routine"
          sub="Five minutes, morning and night. That's the whole thing."
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {ROUTINE_STEPS.map(({ step, note }, i) => {
            const Icon = ROUTINE_ICONS[step];
            return (
              <div
                key={step}
                className="relative rounded-xl border border-[#D9DEE3] bg-white p-4 shadow-sm"
              >
                <span className="absolute right-4 top-4 text-2xl font-semibold text-[#111111]/10">
                  {i + 1}
                </span>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#111111]">
                  <Icon size={18} strokeWidth={1.7} className="text-white" />
                </div>
                <h3 className="mt-2 text-base font-semibold text-[#111111]">{step}</h3>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#4B5563]">{note}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Section 5 · Product Listing ── */}
      <section id="products" className="border-t border-[#D9DEE3] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#6B7280]">
                The Edit
              </p>
              <h2 className="mt-1.5 text-2xl font-semibold text-[#111111] md:text-3xl">
                All Products
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMobileFilters((v) => !v)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#D9DEE3] px-3 py-2 text-xs font-semibold text-[#111111] lg:hidden"
              >
                <SlidersHorizontal size={13} />
                Filters
              </button>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="rounded-lg border border-[#D9DEE3] bg-white px-3 py-2 text-xs font-medium text-[#111111] focus:outline-none focus:ring-1 focus:ring-[#111111]"
              >
                <option value="featured">Featured</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {added && (
            <div className="mb-4 rounded-xl border border-[#C9D8CC] bg-[#EEF7F0] px-3 py-2 text-sm font-medium text-[#275D32]">
              Added to bag: {added}
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
            {/* Filters */}
            <aside className={`${mobileFilters ? "block" : "hidden"} lg:block`}>
              <div className="space-y-5 rounded-xl border border-[#D9DEE3] bg-[#F5F6F7] p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#111111]">Filters</h3>
                  {anyFilter && (
                    <button
                      type="button"
                      onClick={clearAll}
                      className="text-[11px] font-semibold text-[#6B4E2E] hover:underline"
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
              <p className="mb-3 text-xs text-[#6B7280]">
                {filtered.length} {filtered.length === 1 ? "product" : "products"}
              </p>
              {filtered.length === 0 ? (
                <div className="rounded-xl border border-dashed border-[#C9CED4] bg-[#F5F6F7] py-14 text-center">
                  <p className="text-lg font-semibold text-[#111111]">No products match</p>
                  <button
                    type="button"
                    onClick={clearAll}
                    className="mt-3 rounded-lg bg-[#111111] px-4 py-2 text-xs font-semibold text-white"
                  >
                    Reset filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
                  {filtered.map((p, i) => (
                    <MenCard key={p.id} product={p} index={i} onAdd={addToBag} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 6 · Popular Brands ── */}
      <section className="border-t border-[#D9DEE3] bg-[#F5F6F7]">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
          <SectionHead eyebrow="Trusted By Men" title="Popular Brands" />
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9">
            {MEN_BRANDS.map((b) => (
              <div
                key={b}
                className="flex h-16 items-center justify-center rounded-xl border border-[#D9DEE3] bg-white px-3 text-center transition-colors hover:border-[#111111]/30"
              >
                <span className="text-sm font-semibold text-[#111111]">{b}</span>
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
      <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[#6B7280]">{label}</p>
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
      className={`rounded-md border px-2.5 py-1 text-[11px] font-medium transition-colors ${
        active
          ? "border-[#111111] bg-[#111111] text-white"
          : "border-[#D9DEE3] bg-white text-[#3F454A] hover:border-[#111111]/40"
      }`}
    >
      {children}
    </button>
  );
}
