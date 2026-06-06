"use client";

import type { ReactNode } from "react";
import { useState, useRef, useEffect } from "react";
import { SlidersHorizontal, ChevronDown, Globe2, X } from "lucide-react";
import { CatalogProductCard } from "@/components/catalog/CatalogProductCard";
import {
  CATEGORY_PROMOS,
  PromoBanner,
  TallPromoCard,
  WidePromoBanner,
  getGridPromos,
} from "@/components/catalog/CategoryPromos";
import type { Product, Brand, SkinType, SkinConcern, ProductOrigin } from "@/types/product";
import type { CategoryDisplayConfig, SubCategory } from "@/lib/category-config";

// ── Types ─────────────────────────────────────────────────────────────────────
type SortKey = "relevance" | "best_seller" | "newest" | "price_asc" | "price_desc";
type PriceRange = "any" | "under15" | "15to25" | "25to40" | "40plus";
type BadgeKey = "new_arrival" | "best_seller" | "hot_sale" | "ai_pick";
type OriginFilter = "all" | ProductOrigin;
type FilterSignKey =
  | "hydrate"
  | "calm"
  | "acne"
  | "brighten"
  | "spf"
  | "barrier";
type FilterPanelKey =
  | "category"
  | "price"
  | "brand"
  | "rating"
  | "shopping"
  | "ingredients"
  | "concerns"
  | "skinType"
  | "origin"
  | "filterSigns"
  | "sale";

// ── Constants ─────────────────────────────────────────────────────────────────
const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "relevance",   label: "Relevance" },
  { value: "best_seller", label: "Best Selling" },
  { value: "newest",      label: "Newest" },
  { value: "price_asc",   label: "Price: Low to High" },
  { value: "price_desc",  label: "Price: High to Low" },
];

const PRICE_OPTIONS: { value: PriceRange; label: string }[] = [
  { value: "any",     label: "Any Price" },
  { value: "under15", label: "Under $15" },
  { value: "15to25",  label: "$15 – $25" },
  { value: "25to40",  label: "$25 – $40" },
  { value: "40plus",  label: "$40+" },
];

const BADGE_OPTIONS: { key: BadgeKey; label: string }[] = [
  { key: "new_arrival",  label: "New Arrival" },
  { key: "best_seller",  label: "Best Seller" },
  { key: "hot_sale",     label: "Hot Sale" },
  { key: "ai_pick",      label: "AI Pick" },
];

const INGREDIENT_OPTIONS = [
  { key: "spf", label: "SPF", terms: ["spf", "uv filters", "sunscreen"] },
  { key: "centella", label: "Centella", terms: ["centella", "cica"] },
  { key: "hyaluronic", label: "Hyaluronic Acid", terms: ["hyaluronic", "hydration"] },
  { key: "niacinamide", label: "Niacinamide", terms: ["niacinamide", "brightening"] },
  { key: "gentle", label: "Gentle", terms: ["gentle", "sensitive", "barrier"] },
];

const ORIGIN_OPTIONS: { value: OriginFilter; label: string; short: string }[] = [
  { value: "all", label: "All Origins", short: "All" },
  { value: "Korea", label: "Korea", short: "KR" },
  { value: "Japan", label: "Japan", short: "JP" },
  { value: "USA", label: "USA", short: "US" },
  { value: "France", label: "France", short: "FR" },
  { value: "Thailand", label: "Thailand", short: "TH" },
  { value: "Cambodia", label: "Cambodia", short: "KH" },
];

const FILTER_SIGN_LIMIT = 3;

const FILTER_SIGN_OPTIONS: {
  key: FilterSignKey;
  label: string;
  short: string;
  color: string;
  terms: string[];
  concerns?: SkinConcern[];
}[] = [
  {
    key: "hydrate",
    label: "Hydrate",
    short: "Hy",
    color: "bg-[#DFF0FF] text-blue-700 border-blue-100",
    terms: ["hydration", "hyaluronic", "moisture", "plump", "water"],
    concerns: ["Hydration", "Dryness"],
  },
  {
    key: "calm",
    label: "Calm",
    short: "Ca",
    color: "bg-[#E4F4EA] text-green-700 border-green-100",
    terms: ["calming", "soothing", "centella", "cica", "sensitive"],
    concerns: ["Redness"],
  },
  {
    key: "acne",
    label: "Acne",
    short: "Ac",
    color: "bg-[#FFE8E6] text-red-600 border-red-100",
    terms: ["acne", "blemish", "pore", "oil control"],
    concerns: ["Acne", "Large Pores", "Oil Control"],
  },
  {
    key: "brighten",
    label: "Brighten",
    short: "Br",
    color: "bg-[#FFF4CF] text-yellow-700 border-yellow-100",
    terms: ["brightening", "glow", "niacinamide", "dark spot"],
    concerns: ["Brightening", "Dull Skin", "Dark Spots"],
  },
  {
    key: "spf",
    label: "SPF",
    short: "SP",
    color: "bg-[#F6E7FF] text-purple-700 border-purple-100",
    terms: ["spf", "sunscreen", "uv filters", "sun"],
    concerns: ["Sun Protection"],
  },
  {
    key: "barrier",
    label: "Barrier",
    short: "Ba",
    color: "bg-[#EFEDE7] text-stone-700 border-stone-200",
    terms: ["barrier", "ceramide", "repair", "gentle"],
    concerns: ["Dryness", "Redness"],
  },
];

const RATING_OPTIONS = [4.8, 4.5, 4.0];

const SKIN_TYPE_LIST: SkinType[] = [
  "Oily", "Dry", "Sensitive", "Combination", "Normal",
];

const SKIN_CONCERN_LIST: SkinConcern[] = [
  "Acne", "Dark Spots", "Redness", "Dull Skin", "Large Pores",
  "Dryness", "Oil Control", "Sun Protection", "Hydration", "Brightening",
];

// ── Filtering helpers ─────────────────────────────────────────────────────────
function applySort(products: Product[], sort: SortKey): Product[] {
  const arr = [...products];
  switch (sort) {
    case "best_seller":
      return arr.sort((a, b) => (b.is_best_seller ? 1 : 0) - (a.is_best_seller ? 1 : 0));
    case "newest":
      return arr.sort((a, b) => (b.is_new_arrival ? 1 : 0) - (a.is_new_arrival ? 1 : 0));
    case "price_asc":
      return arr.sort((a, b) => a.price - b.price);
    case "price_desc":
      return arr.sort((a, b) => b.price - a.price);
    default:
      return arr;
  }
}

function applySubcategoryFilter(products: Product[], sub: SubCategory | null): Product[] {
  if (!sub) return products;
  if (sub.categoryIds)  return products.filter((p) => sub.categoryIds!.includes(p.category_id));
  if (sub.categoryId)   return products.filter((p) => p.category_id === sub.categoryId);
  if (sub.brandId)      return products.filter((p) => p.brand_id === sub.brandId);
  if (sub.tagFilters) {
    return products.filter((p) =>
      sub.tagFilters!.some((f) => p.ai_tags.some((t) => t.includes(f)))
    );
  }
  return products;
}

function applyChipFilter(products: Product[], chip: string | null): Product[] {
  if (!chip) return products;
  if (chip === "Under $15")  return products.filter((p) => p.price < 15);
  if (chip === "Under $20")  return products.filter((p) => p.price < 20);
  if (chip === "Bestsellers" || chip === "Best Value")
    return products.filter((p) => p.is_best_seller || p.is_hot_sale);
  if (chip === "Just Dropped" || chip === "Trending" || chip === "New")
    return products.filter((p) => p.is_new_arrival);
  if (chip === "K-Beauty")
    return products.filter((p) =>
      ["b1", "b2", "b3", "b4", "b7", "b9", "b10", "b11", "b12", "b15"].includes(p.brand_id)
    );
  return products;
}

function applyFilterSigns(products: Product[], signs: Set<FilterSignKey>): Product[] {
  if (signs.size === 0) return products;
  const selected = FILTER_SIGN_OPTIONS.filter((option) => signs.has(option.key));

  return products.filter((product) => {
    const searchable = [
      product.name,
      product.description,
      product.main_benefit,
      product.ingredients,
      product.ai_tags.join(" "),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return selected.some((option) => {
      const matchesText = option.terms.some((term) =>
        searchable.includes(term.toLowerCase())
      );
      const matchesConcern = option.concerns?.some((concern) =>
        product.skin_concerns.includes(concern)
      );
      return matchesText || matchesConcern;
    });
  });
}

// ── Pre-select a subcategory from a URL ?sub= param ───────────────────────────
function resolveInitialSub(
  config: CategoryDisplayConfig,
  subLabel: string | undefined
): SubCategory | null {
  if (!subLabel) return null;
  const found = config.subcategories.find(
    (s) => s.label.toLowerCase() === subLabel.toLowerCase()
  );
  if (!found) return null;
  // "All X" items have no filter criteria → treat as no active sub
  const isAll = !found.categoryId && !found.categoryIds && !found.brandId && !found.tagFilters;
  return isAll ? null : found;
}

// ── Main component ─────────────────────────────────────────────────────────────
export function CategoryShell({
  config,
  products: initialProducts,
  brands,
  initialSub,
}: {
  config: CategoryDisplayConfig;
  products: Product[];
  brands: Brand[];
  initialSub?: string; // pre-select from URL ?sub= param
}) {
  // Sorting & quick filters
  const [sort, setSort]           = useState<SortKey>("relevance");
  const [activeSub, setActiveSub] = useState<SubCategory | null>(
    () => resolveInitialSub(config, initialSub)
  );
  const [activeChip, setActiveChip] = useState<string | null>(null);

  // Sidebar filters
  const [priceRange, setPriceRange]       = useState<PriceRange>("any");
  const [brandIds, setBrandIds]           = useState<Set<string>>(new Set());
  const [minRating, setMinRating]         = useState<number | null>(null);
  const [skinTypes, setSkinTypes]         = useState<Set<SkinType>>(new Set());
  const [skinConcerns, setSkinConcerns]   = useState<Set<SkinConcern>>(new Set());
  const [badges, setBadges]               = useState<Set<BadgeKey>>(new Set());
  const [ingredientPrefs, setIngredientPrefs] = useState<Set<string>>(new Set());
  const [origin, setOrigin]               = useState<OriginFilter>("all");
  const [filterSigns, setFilterSigns]     = useState<Set<FilterSignKey>>(new Set());
  const [inStockOnly, setInStockOnly]     = useState(false);

  // UI state
  const [mobileFilterOpen, setMobileFilterOpen]   = useState(false);
  const [sortOpen, setSortOpen]                   = useState(false);
  const [openFilterPanel, setOpenFilterPanel]     = useState<FilterPanelKey | null>("category");
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === "Escape") setMobileFilterOpen(false);
    }
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  // ── Filter pipeline ──
  let displayed = applySubcategoryFilter(initialProducts, activeSub);
  displayed = applyChipFilter(displayed, activeChip);
  displayed = applyFilterSigns(displayed, filterSigns);

  if (priceRange === "under15") displayed = displayed.filter((p) => p.price < 15);
  else if (priceRange === "15to25") displayed = displayed.filter((p) => p.price >= 15 && p.price <= 25);
  else if (priceRange === "25to40") displayed = displayed.filter((p) => p.price > 25 && p.price <= 40);
  else if (priceRange === "40plus") displayed = displayed.filter((p) => p.price > 40);

  if (brandIds.size > 0) displayed = displayed.filter((p) => brandIds.has(p.brand_id));

  if (origin !== "all") displayed = displayed.filter((p) => p.origin === origin);

  if (minRating !== null) displayed = displayed.filter((p) => (p.rating ?? 0) >= minRating);

  if (skinTypes.size > 0)
    displayed = displayed.filter((p) => p.skin_types.some((t) => skinTypes.has(t)));

  if (skinConcerns.size > 0)
    displayed = displayed.filter((p) => p.skin_concerns.some((c) => skinConcerns.has(c)));

  if (ingredientPrefs.size > 0) {
    displayed = displayed.filter((p) => {
      const text = `${p.ingredients ?? ""} ${p.ai_tags.join(" ")} ${p.main_benefit ?? ""}`.toLowerCase();
      return [...ingredientPrefs].every((key) => {
        const option = INGREDIENT_OPTIONS.find((item) => item.key === key);
        return option ? option.terms.some((term) => text.includes(term)) : true;
      });
    });
  }

  if (badges.size > 0)
    displayed = displayed.filter(
      (p) =>
        (badges.has("new_arrival")  && p.is_new_arrival)   ||
        (badges.has("best_seller")  && p.is_best_seller)   ||
        (badges.has("hot_sale")     && p.is_hot_sale)      ||
        (badges.has("ai_pick")      && p.is_ai_recommendable)
    );

  if (inStockOnly) displayed = displayed.filter((p) => p.stock > 0);

  displayed = applySort(displayed, sort);

  // ── Helpers ──
  function getBrandName(brandId: string) {
    return brands.find((b) => b.id === brandId)?.name ?? "";
  }

  function selectSub(sub: SubCategory) {
    const isAll = !sub.categoryId && !sub.categoryIds && !sub.brandId && !sub.tagFilters;
    setActiveSub(isAll ? null : activeSub?.label === sub.label ? null : sub);
  }

  const activeFilterCount =
    (priceRange !== "any" ? 1 : 0) +
    brandIds.size +
    (minRating !== null ? 1 : 0) +
    skinTypes.size +
    skinConcerns.size +
    ingredientPrefs.size +
    (origin !== "all" ? 1 : 0) +
    filterSigns.size +
    badges.size +
    (inStockOnly ? 1 : 0);

  const hasAnyFilter = activeSub !== null || activeFilterCount > 0 || activeChip !== null;

  function clearAllFilters() {
    setActiveSub(null);
    setActiveChip(null);
    setPriceRange("any");
    setBrandIds(new Set());
    setMinRating(null);
    setSkinTypes(new Set());
    setSkinConcerns(new Set());
    setBadges(new Set());
    setIngredientPrefs(new Set());
    setOrigin("all");
    setFilterSigns(new Set());
    setInStockOnly(false);
  }

  function toggleBrand(id: string) {
    const next = new Set(brandIds);
    next.has(id) ? next.delete(id) : next.add(id);
    setBrandIds(next);
  }

  function toggleSkinType(t: SkinType) {
    const next = new Set(skinTypes);
    next.has(t) ? next.delete(t) : next.add(t);
    setSkinTypes(next);
  }

  function toggleConcern(c: SkinConcern) {
    const next = new Set(skinConcerns);
    next.has(c) ? next.delete(c) : next.add(c);
    setSkinConcerns(next);
  }

  function toggleBadge(b: BadgeKey) {
    const next = new Set(badges);
    next.has(b) ? next.delete(b) : next.add(b);
    setBadges(next);
  }

  function toggleIngredient(key: string) {
    const next = new Set(ingredientPrefs);
    next.has(key) ? next.delete(key) : next.add(key);
    setIngredientPrefs(next);
  }

  function toggleFilterSign(key: FilterSignKey) {
    const next = new Set(filterSigns);
    if (next.has(key)) {
      next.delete(key);
    } else if (next.size < FILTER_SIGN_LIMIT) {
      next.add(key);
    }
    setFilterSigns(next);
  }

  const currentSortLabel = SORT_OPTIONS.find((o) => o.value === sort)?.label ?? "Relevance";
  const visibleBrands = brands.filter((brand) => initialProducts.some((product) => product.brand_id === brand.id));

  function getPanelCount(panel: FilterPanelKey) {
    if (panel === "category") return activeSub ? 1 : 0;
    if (panel === "price") return priceRange !== "any" ? 1 : 0;
    if (panel === "brand") return brandIds.size;
    if (panel === "rating") return minRating !== null ? 1 : 0;
    if (panel === "shopping") return badges.size + (inStockOnly ? 1 : 0);
    if (panel === "ingredients") return ingredientPrefs.size;
    if (panel === "concerns") return skinConcerns.size;
    if (panel === "skinType") return skinTypes.size;
    if (panel === "origin") return origin !== "all" ? 1 : 0;
    if (panel === "filterSigns") return filterSigns.size;
    if (panel === "sale") return badges.has("hot_sale") ? 1 : 0;
    return 0;
  }

  // ── Reusable inline filter section JSX ─────────────────────────────────────
  // NOTE: These are JSX expressions (ReactNode), NOT components.
  //       Using them inline avoids the remount anti-pattern of inner components.

  const filterCategorySection = (
    <FilterAccordion
      count={getPanelCount("category")}
      isOpen={openFilterPanel === "category"}
      label="Category"
      onToggle={() => setOpenFilterPanel(openFilterPanel === "category" ? null : "category")}
    >
      <ul className="space-y-px">
        {config.subcategories.map((sub) => {
          const isActive =
            activeSub?.label === sub.label ||
            (activeSub === null && sub.label.startsWith("All"));
          return (
            <li key={sub.label}>
              <button
                onClick={() => selectSub(sub)}
                className={`w-full rounded-lg px-2.5 py-1.5 text-left text-[11px] transition-colors ${
                  isActive
                    ? "bg-[#111] font-medium text-white"
                    : "text-[#888] hover:bg-[#FAFAFA] hover:text-[#555]"
                }`}
              >
                {sub.label}
              </button>
            </li>
          );
        })}
      </ul>
    </FilterAccordion>
  );

  const filterPriceSection = (
    <FilterAccordion
      count={getPanelCount("price")}
      isOpen={openFilterPanel === "price"}
      label="Price Range"
      onToggle={() => setOpenFilterPanel(openFilterPanel === "price" ? null : "price")}
    >
      <ul className="space-y-px">
        {PRICE_OPTIONS.map((opt) => (
          <li key={opt.value}>
            <button
              onClick={() => setPriceRange(opt.value)}
              className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-[11px] transition-colors ${
                priceRange === opt.value
                  ? "bg-[#111] font-medium text-white"
                  : "text-[#888] hover:bg-[#FAFAFA] hover:text-[#555]"
              }`}
            >
              {opt.label}
            </button>
          </li>
        ))}
      </ul>
    </FilterAccordion>
  );

  const filterBrandSection = (
    <FilterAccordion
      count={getPanelCount("brand")}
      isOpen={openFilterPanel === "brand"}
      label="Brand"
      onToggle={() => setOpenFilterPanel(openFilterPanel === "brand" ? null : "brand")}
    >
      <ul className="space-y-px">
        {visibleBrands.map((brand) => (
          <li key={brand.id}>
            <label className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-[11px] transition-colors hover:bg-[#FAFAFA]">
              <input
                type="checkbox"
                checked={brandIds.has(brand.id)}
                onChange={() => toggleBrand(brand.id)}
                className="h-3 w-3 accent-[#111]"
              />
              <span className={brandIds.has(brand.id) ? "font-medium text-[#333]" : "text-[#888]"}>
                {brand.name}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </FilterAccordion>
  );

  const filterRatingSection = (
    <FilterAccordion
      count={getPanelCount("rating")}
      isOpen={openFilterPanel === "rating"}
      label="Rating"
      onToggle={() => setOpenFilterPanel(openFilterPanel === "rating" ? null : "rating")}
    >
      <ul className="space-y-px">
        {RATING_OPTIONS.map((rating) => (
          <li key={rating}>
            <button
              onClick={() => setMinRating(minRating === rating ? null : rating)}
              className={`w-full rounded-lg px-2.5 py-1.5 text-left text-[11px] transition-colors ${
                minRating === rating
                  ? "bg-[#111] font-medium text-white"
                  : "text-[#888] hover:bg-[#FAFAFA] hover:text-[#555]"
              }`}
            >
              {rating}+ stars
            </button>
          </li>
        ))}
      </ul>
    </FilterAccordion>
  );

  const filterSkinTypeSection = (
    <FilterAccordion
      count={getPanelCount("skinType")}
      isOpen={openFilterPanel === "skinType"}
      label="Skin Type"
      onToggle={() => setOpenFilterPanel(openFilterPanel === "skinType" ? null : "skinType")}
    >
      <ul className="space-y-px">
        {SKIN_TYPE_LIST.map((type) => (
          <li key={type}>
            <label className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-[11px] transition-colors hover:bg-[#FAFAFA]">
              <input
                type="checkbox"
                checked={skinTypes.has(type)}
                onChange={() => toggleSkinType(type)}
                className="h-3 w-3 accent-[#111]"
              />
              <span className={skinTypes.has(type) ? "font-medium text-[#333]" : "text-[#888]"}>
                {type}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </FilterAccordion>
  );

  const filterConcernSection = (
    <FilterAccordion
      count={getPanelCount("concerns")}
      isOpen={openFilterPanel === "concerns"}
      label="Skin Concerns"
      onToggle={() => setOpenFilterPanel(openFilterPanel === "concerns" ? null : "concerns")}
    >
      <ul className="space-y-px">
        {SKIN_CONCERN_LIST.map((concern) => (
          <li key={concern}>
            <label className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-[11px] transition-colors hover:bg-[#FAFAFA]">
              <input
                type="checkbox"
                checked={skinConcerns.has(concern)}
                onChange={() => toggleConcern(concern)}
                className="h-3 w-3 accent-[#111]"
              />
              <span className={skinConcerns.has(concern) ? "font-medium text-[#333]" : "text-[#888]"}>
                {concern}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </FilterAccordion>
  );

  const filterOriginSection = (
    <section className="px-1 py-2">
      <div className="mb-2 flex items-center gap-1.5">
        <p className="text-[12px] font-semibold text-[#555]">Shop by Origin</p>
        {origin !== "all" && (
          <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#111] px-1 text-[8px] font-bold text-white">
            1
          </span>
        )}
      </div>
      <div className="grid grid-cols-4 gap-2 px-1">
        {ORIGIN_OPTIONS.map((item) => {
          const isActive = origin === item.value;
          return (
            <button
              key={item.value}
              type="button"
              onClick={() => setOrigin(item.value)}
              className="group relative flex flex-col items-center gap-1 rounded-xl p-1 transition-colors hover:bg-[#FAFAFA]"
              aria-label={`Filter by ${item.label}`}
              aria-pressed={isActive}
              title={item.label}
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full border text-[9px] font-bold transition-all ${
                  isActive
                    ? "border-[#111] bg-[#111] text-white shadow-[0_8px_22px_rgba(17,17,17,0.18)]"
                    : "border-[#E8E8E8] bg-white text-[#777] shadow-sm"
                }`}
              >
                {item.value === "all" ? <Globe2 size={13} strokeWidth={1.8} /> : item.short}
              </span>
              <span className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-1 -translate-x-1/2 whitespace-nowrap rounded-full border border-[#EFEFEF] bg-white px-2 py-0.5 text-[9px] font-medium text-[#666] opacity-0 shadow-[0_8px_24px_rgba(17,17,17,0.08)] transition-opacity group-hover:opacity-100">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );

  const filterSignSection = (
    <FilterAccordion
      count={getPanelCount("filterSigns")}
      isOpen={openFilterPanel === "filterSigns"}
      label="Filter Signs"
      onToggle={() => setOpenFilterPanel(openFilterPanel === "filterSigns" ? null : "filterSigns")}
    >
      <div className="grid grid-cols-3 gap-2 px-1">
        <button
          type="button"
          onClick={() => setFilterSigns(new Set())}
          className={`flex flex-col items-center gap-1 rounded-xl p-1.5 transition-colors ${
            filterSigns.size === 0 ? "bg-[#111] text-white" : "text-[#888] hover:bg-[#FAFAFA]"
          }`}
          aria-pressed={filterSigns.size === 0}
        >
          <span
            className={`flex h-9 w-9 items-center justify-center rounded-full border text-[10px] font-bold ${
              filterSigns.size === 0
                ? "border-white/20 bg-white text-[#111]"
                : "border-[#E8E8E8] bg-white"
            }`}
          >
            All
          </span>
          <span className="text-[9px] font-medium leading-none">All</span>
        </button>

        {FILTER_SIGN_OPTIONS.map((option) => {
          const isActive = filterSigns.has(option.key);
          const isLocked = !isActive && filterSigns.size >= FILTER_SIGN_LIMIT;
          return (
            <button
              key={option.key}
              type="button"
              onClick={() => toggleFilterSign(option.key)}
              disabled={isLocked}
              className={`flex flex-col items-center gap-1 rounded-xl p-1.5 transition-colors ${
                isActive
                  ? "bg-[#111] text-white"
                  : isLocked
                    ? "cursor-not-allowed text-[#C9C9C9]"
                    : "text-[#888] hover:bg-[#FAFAFA]"
              }`}
              aria-pressed={isActive}
              title={isLocked ? "Remove one sign before adding another" : option.label}
            >
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full border text-[10px] font-bold ${
                  isActive ? "border-white/20 bg-white text-[#111]" : option.color
                } ${isLocked ? "opacity-45" : ""}`}
              >
                {option.short}
              </span>
              <span className="text-[9px] font-medium leading-none">{option.label}</span>
            </button>
          );
        })}
      </div>
      <p className="mt-2 px-2 text-[9px] text-[#AAA]">
        Choose up to {FILTER_SIGN_LIMIT}. All is the default.
      </p>
    </FilterAccordion>
  );

  const filterInStockSection = (
    <div className="flex items-center justify-between px-1">
      <span className="text-[11px] text-[#888]">In Stock Only</span>
      <button
        onClick={() => setInStockOnly(!inStockOnly)}
        className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
          inStockOnly ? "bg-[#111111]" : "bg-[#DCDCDC]"
        }`}
        aria-label="Toggle in stock only"
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
            inStockOnly ? "translate-x-[18px]" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );

  const filterBadgeSection = (
    <FilterAccordion
      count={getPanelCount("shopping")}
      isOpen={openFilterPanel === "shopping"}
      label="Shopping Preferences"
      onToggle={() => setOpenFilterPanel(openFilterPanel === "shopping" ? null : "shopping")}
    >
      <ul className="space-y-px">
        {BADGE_OPTIONS.filter(({ key }) => key !== "hot_sale").map(({ key, label }) => (
          <li key={key}>
            <label className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-[11px] transition-colors hover:bg-[#FAFAFA]">
              <input
                type="checkbox"
                checked={badges.has(key)}
                onChange={() => toggleBadge(key)}
                className="h-3 w-3 accent-[#111]"
              />
              <span className={badges.has(key) ? "font-medium text-[#333]" : "text-[#888]"}>
                {label}
              </span>
            </label>
          </li>
        ))}
        <li className="rounded-xl px-3 py-2">{filterInStockSection}</li>
      </ul>
    </FilterAccordion>
  );

  const filterIngredientSection = (
    <FilterAccordion
      count={getPanelCount("ingredients")}
      isOpen={openFilterPanel === "ingredients"}
      label="Ingredient Preferences"
      onToggle={() => setOpenFilterPanel(openFilterPanel === "ingredients" ? null : "ingredients")}
    >
      <ul className="space-y-px">
        {INGREDIENT_OPTIONS.map((item) => (
          <li key={item.key}>
            <label className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-[11px] transition-colors hover:bg-[#FAFAFA]">
              <input
                type="checkbox"
                checked={ingredientPrefs.has(item.key)}
                onChange={() => toggleIngredient(item.key)}
                className="h-3 w-3 accent-[#111]"
              />
              <span className={ingredientPrefs.has(item.key) ? "font-medium text-[#333]" : "text-[#888]"}>
                {item.label}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </FilterAccordion>
  );

  const filterSaleSection = (
    <FilterAccordion
      count={getPanelCount("sale")}
      isOpen={openFilterPanel === "sale"}
      label="Sale"
      onToggle={() => setOpenFilterPanel(openFilterPanel === "sale" ? null : "sale")}
    >
      <label className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-[11px] transition-colors hover:bg-[#FAFAFA]">
        <input
          type="checkbox"
          checked={badges.has("hot_sale")}
          onChange={() => toggleBadge("hot_sale")}
          className="h-3 w-3 accent-[#111]"
        />
        <span className={badges.has("hot_sale") ? "font-medium text-[#333]" : "text-[#888]"}>
          On Sale
        </span>
      </label>
    </FilterAccordion>
  );

  const clearAllButton = hasAnyFilter ? (
    <button
      onClick={clearAllFilters}
      className="w-full rounded-lg border border-[#E8E8E8] py-1.5 text-[10px] text-[#999] transition-colors hover:border-[#CCC] hover:text-[#555]"
    >
      Clear all filters
      {activeFilterCount > 0 && ` (${activeFilterCount})`}
    </button>
  ) : null;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white">
      {/* Promo banner */}
      {config.promoBanner && (
        <div className={`${config.promoBanner.bg} px-4 py-8 md:px-6`}>
          <div className="mx-auto max-w-7xl">
            <h2 className="font-serif text-xl font-normal text-textdark md:text-2xl">
              {config.promoBanner.headline}
            </h2>
            <p className="mt-1 text-sm text-textgray">{config.promoBanner.sub}</p>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
        {/* Quick-filter chips */}
        <div className="no-scrollbar mb-5 flex gap-1.5 overflow-x-auto pb-0.5">
          {config.chips.map((chip) => (
            <button
              key={chip}
              onClick={() => setActiveChip(activeChip === chip ? null : chip)}
              className={`shrink-0 rounded-full border px-3 py-1 text-[11px] font-medium transition-all ${
                activeChip === chip
                  ? "border-[#111] bg-[#111] text-white"
                  : "border-[#E8E8E8] bg-white text-[#888] hover:border-[#CCC] hover:text-[#555]"
              }`}
            >
              {chip}
            </button>
          ))}
        </div>

        <div className="flex gap-6 lg:gap-8">
          {/* ── Desktop sidebar — lighter, narrower, sticky ── */}
          <aside className="hidden w-48 shrink-0 md:block lg:w-52">
            <div className="sticky top-4 max-h-[calc(100vh-2rem)] space-y-1 overflow-y-auto pb-8 pr-1">
              {filterCategorySection}
              <div className="mx-1 h-px bg-[#F0F0F0]" />
              {filterPriceSection}
              <div className="mx-1 h-px bg-[#F0F0F0]" />
              {filterBrandSection}
              <div className="mx-1 h-px bg-[#F0F0F0]" />
              {filterRatingSection}
              <div className="mx-1 h-px bg-[#F0F0F0]" />
              {filterBadgeSection}
              <div className="mx-1 h-px bg-[#F0F0F0]" />
              {filterIngredientSection}
              <div className="mx-1 h-px bg-[#F0F0F0]" />
              {filterConcernSection}
              <div className="mx-1 h-px bg-[#F0F0F0]" />
              {filterSkinTypeSection}
              <div className="mx-1 h-px bg-[#F0F0F0]" />
              {filterSignSection}
              <div className="mx-1 h-px bg-[#F0F0F0]" />
              {filterSaleSection}
              <div className="mx-1 h-px bg-[#F0F0F0]" />
              {filterOriginSection}
              {clearAllButton && <div className="pt-1">{clearAllButton}</div>}
            </div>
          </aside>

          {/* ── Main content ── */}
          <div className="min-w-0 flex-1">
            {/* Toolbar */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {/* Mobile filter toggle */}
                <button
                  onClick={() => setMobileFilterOpen(true)}
                  className="relative flex items-center gap-1.5 rounded-full border border-[#E8E8E8] px-3 py-1.5 text-[11px] font-medium text-[#888] hover:border-[#CCC] hover:text-[#555] md:hidden"
                >
                  <SlidersHorizontal size={12} />
                  Filter
                  {activeFilterCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#111] text-[8px] font-bold text-white">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
                <p className="text-[12px] text-[#AAA]">
                  {displayed.length} result{displayed.length !== 1 ? "s" : ""}
                </p>
              </div>

              {/* Sort dropdown */}
              <div className="relative" ref={sortRef}>
                <button
                  onClick={() => setSortOpen(!sortOpen)}
                  className="flex items-center gap-1.5 rounded-full border border-[#E8E8E8] px-3 py-1.5 text-[11px] font-medium text-[#888] hover:border-[#CCC] hover:text-[#555]"
                >
                  Sort: {currentSortLabel}
                  <ChevronDown
                    size={11}
                    className={`transition-transform ${sortOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {sortOpen && (
                  <div className="absolute right-0 top-full z-20 mt-1 min-w-[180px] overflow-hidden rounded-xl border border-[#F0F0F0] bg-white shadow-lg">
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => { setSort(opt.value); setSortOpen(false); }}
                        className={`block w-full px-3.5 py-2 text-left text-[12px] transition-colors hover:bg-[#FAFAFA] ${
                          sort === opt.value ? "font-semibold text-[#111]" : "text-[#888]"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Top banner + browse tags */}
            {(() => {
              const promo = CATEGORY_PROMOS[config.slug];
              if (!promo) return null;
              return (
                <div className="mb-4 space-y-3">
                  <PromoBanner {...promo.banner} />
                </div>
              );
            })()}

            {/* Product grid with smart promo cards — tall (1×2) + wide banners.
                Density scales with product count; pattern alternates
                tall-left → wide → tall-right → wide → tall-left. */}
            {displayed.length > 0 ? (
              <div className="grid grid-flow-row-dense grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
                {(() => {
                  const count = displayed.length;

                  // Density: <12 none, ~20→1, 40→2, 60→3, 80→4, 100+→5 (cap)
                  const promoCount =
                    count < 12 ? 0 : Math.min(5, Math.max(1, Math.round(count / 20)));

                  // Place every ~13 products (within the 12–16 range)
                  const INTERVAL = 13;
                  const promos = getGridPromos(config.slug, promoCount);

                  // Alternation pattern by promo order
                  type Pattern =
                    | { type: "tall"; side: "left" | "right" }
                    | { type: "wide" };
                  const patternFor = (order: number): Pattern => {
                    switch (order) {
                      case 0:
                        return { type: "tall", side: "left" };
                      case 1:
                        return { type: "wide" };
                      case 2:
                        return { type: "tall", side: "right" };
                      case 3:
                        return { type: "wide" };
                      default:
                        return { type: "tall", side: "left" };
                    }
                  };

                  const nodes: ReactNode[] = [];
                  let promoOrder = 0;

                  displayed.forEach((p, i) => {
                    nodes.push(
                      <CatalogProductCard
                        key={p.id}
                        product={p}
                        brandName={getBrandName(p.brand_id)}
                        index={i}
                      />
                    );

                    // After every INTERVAL products, insert next promo (never after the last)
                    if (
                      promoOrder < promos.length &&
                      (i + 1) % INTERVAL === 0 &&
                      i + 1 < count
                    ) {
                      const pat = patternFor(promoOrder);
                      const promo = promos[promoOrder];
                      nodes.push(
                        pat.type === "wide" ? (
                          <WidePromoBanner key={`promo-${promo.id}`} promo={promo} />
                        ) : (
                          <TallPromoCard
                            key={`promo-${promo.id}`}
                            promo={promo}
                            side={pat.side}
                          />
                        )
                      );
                      promoOrder++;
                    }
                  });

                  return nodes;
                })()}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-28 text-center">
                <span className="text-4xl">🌿</span>
                <p className="mt-4 font-serif text-xl text-[#111]">
                  {config.emptyMessage ?? "No products found."}
                </p>
                <p className="mt-1.5 text-[13px] text-[#AAA]">
                  Try a different filter or check back soon.
                </p>
                {hasAnyFilter && (
                  <button
                    onClick={clearAllFilters}
                    className="mt-5 rounded-full border border-[#E8E8E8] px-5 py-1.5 text-[12px] text-[#888] hover:border-[#CCC] hover:text-[#555]"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile filter drawer ── */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileFilterOpen(false)}
            aria-hidden="true"
          />
          {/* Sheet */}
          <div className="reveal-up absolute bottom-0 left-0 right-0 max-h-[82vh] overflow-y-auto rounded-t-2xl bg-white p-5 pb-8">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-[13px] font-semibold text-[#333]">Filters</p>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="text-[#AAA] hover:text-[#555]"
                aria-label="Close filter"
              >
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3">
              {filterCategorySection}
              <div className="h-px bg-[#F0F0F0]" />
              {filterPriceSection}
              <div className="h-px bg-[#F0F0F0]" />
              {filterBrandSection}
              <div className="h-px bg-[#F0F0F0]" />
              {filterRatingSection}
              <div className="h-px bg-[#F0F0F0]" />
              {filterBadgeSection}
              <div className="h-px bg-[#F0F0F0]" />
              {filterIngredientSection}
              <div className="h-px bg-[#F0F0F0]" />
              {filterConcernSection}
              <div className="h-px bg-[#F0F0F0]" />
              {filterSkinTypeSection}
              <div className="h-px bg-[#F0F0F0]" />
              {filterSignSection}
              <div className="h-px bg-[#F0F0F0]" />
              {filterSaleSection}
              <div className="h-px bg-[#F0F0F0]" />
              {filterOriginSection}
              {clearAllButton && <div className="pt-2">{clearAllButton}</div>}
              {/* Close button */}
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full rounded-xl bg-[#111] py-2.5 text-[12px] font-semibold text-white"
              >
                Show {displayed.length} result{displayed.length !== 1 ? "s" : ""}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterAccordion({
  label,
  count,
  isOpen,
  onToggle,
  children,
}: {
  label: string;
  count: number;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <section>
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-2 py-1.5 text-left"
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-1.5 text-[12px] font-semibold text-[#555]">
          {label}
          {count > 0 && (
            <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#111] px-1 text-[8px] font-bold text-white">
              {count}
            </span>
          )}
        </span>
        <ChevronDown
          size={13}
          strokeWidth={2}
          className={`shrink-0 text-[#AAA] transition-transform duration-300 ease-out ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`grid transition-all duration-300 ease-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="pb-2 pt-0.5">{children}</div>
        </div>
      </div>
    </section>
  );
}
