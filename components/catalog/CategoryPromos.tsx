"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────

type PromoConfig = {
  /** Wide banner placed above the product grid */
  banner: {
    gradient: string;
    eyebrow: string;
    headline: string;
    sub: string;
    cta: string;
    href: string;
  };
  /** Quick-browse concern/vibe tags */
  browseTags: { label: string; emoji: string; href: string }[];
};

/** Smart promo card inserted inside the product grid */
export type GridPromo = {
  id: string;
  emoji: string;
  headline: string;
  sub: string;
  cta: string;
  href: string;
  gradient: string;
  accent: string; // text color for headline
};

// ── Shared promo pool (cycled per category) ──────────────────────────────────

const GRID_PROMO_POOL: GridPromo[] = [
  {
    id: "summer-glow",
    emoji: "☀️",
    headline: "Summer Glow Picks",
    sub: "SPF, mists, and lightweight hydration for warm days.",
    cta: "Shop Glow",
    href: "/skincare?sub=Sunscreens",
    gradient: "from-[#FFF5E0] to-[#FFECCC]",
    accent: "text-[#8A6520]",
  },
  {
    id: "best-gifts",
    emoji: "🎁",
    headline: "Best Gifts, Always",
    sub: "Curated sets and minis for every occasion.",
    cta: "Shop Gifts",
    href: "/offers",
    gradient: "from-[#F0E6F8] to-[#F8F0FE]",
    accent: "text-[#6A4A8A]",
  },
  {
    id: "under-20",
    emoji: "💰",
    headline: "Under $20 Finds",
    sub: "Premium beauty that doesn't break the budget.",
    cta: "Browse Deals",
    href: "/offers?chip=Under+%2420",
    gradient: "from-[#E8F4E8] to-[#F0FAF0]",
    accent: "text-[#3A6A3A]",
  },
  {
    id: "build-routine",
    emoji: "🧴",
    headline: "Build Your Routine",
    sub: "Cleanser, serum, moisturizer, SPF — step by step.",
    cta: "Start Building",
    href: "/ai-advisor",
    gradient: "from-[#F5EFE8] to-[#FDF8F0]",
    accent: "text-[#7A5530]",
  },
  {
    id: "ai-picks",
    emoji: "✨",
    headline: "AI Recommended",
    sub: "Products matched to your skin type and concerns.",
    cta: "Ask AI",
    href: "/ai-advisor",
    gradient: "from-[#E8E4F8] to-[#F2F0FE]",
    accent: "text-[#5A4A8A]",
  },
  {
    id: "k-beauty",
    emoji: "🇰🇷",
    headline: "K-Beauty Drops",
    sub: "Trending Korean skincare, fresh from Seoul.",
    cta: "Explore",
    href: "/brands?chip=K-Beauty",
    gradient: "from-[#E0F0F8] to-[#F0F8FE]",
    accent: "text-[#2A5A7A]",
  },
  {
    id: "free-delivery",
    emoji: "🚚",
    headline: "Free Delivery $30+",
    sub: "Same-day delivery in Phnom Penh on qualifying orders.",
    cta: "Shop Now",
    href: "/offers?chip=Free+Delivery",
    gradient: "from-[#E8F8E8] to-[#F4FEF4]",
    accent: "text-[#2A6A2A]",
  },
];

/** Get promo cards for a category — shuffles based on slug so each page feels different */
export function getGridPromos(slug: string, count: number): GridPromo[] {
  // Simple hash to offset the pool per category
  let offset = 0;
  for (let i = 0; i < slug.length; i++) offset += slug.charCodeAt(i);
  offset = offset % GRID_PROMO_POOL.length;

  const result: GridPromo[] = [];
  for (let i = 0; i < count; i++) {
    result.push(GRID_PROMO_POOL[(offset + i) % GRID_PROMO_POOL.length]);
  }
  return result;
}

export const CATEGORY_PROMOS: Record<string, PromoConfig> = {
  new: {
    banner: {
      gradient: "from-[#E6EEF8] via-[#EEE8F8] to-[#F5F0FA]",
      eyebrow: "This Week",
      headline: "Fresh drops, softly curated.",
      sub: "The newest K-beauty essentials and global cult favourites — added this week.",
      cta: "Shop All New",
      href: "/new",
    },
browseTags: [
      { label: "Serums", emoji: "💧", href: "/new?sub=Skincare" },
      { label: "SPF", emoji: "☀️", href: "/new?sub=Skincare" },
      { label: "Lip Color", emoji: "💄", href: "/new?sub=Makeup" },
      { label: "Hair Repair", emoji: "✨", href: "/new?sub=Hair" },
      { label: "Mists", emoji: "🌸", href: "/new?sub=Fragrance" },
    ],
  },

  skincare: {
    banner: {
      gradient: "from-[#F5EFE8] via-[#FDF8F4] to-[#F0E8DF]",
      eyebrow: "Your Routine",
      headline: "Build your calm skin routine.",
      sub: "Cleanse, treat, protect — curated steps for every skin type.",
      cta: "Find My Routine",
      href: "/ai-advisor",
    },
browseTags: [
      { label: "Acne", emoji: "🍃", href: "/skincare?sub=Acne+Treatment" },
      { label: "Hydration", emoji: "💧", href: "/skincare?sub=Moisturizers" },
      { label: "Brightening", emoji: "✨", href: "/skincare?sub=Serums" },
      { label: "Sun Care", emoji: "☀️", href: "/skincare?sub=Sunscreens" },
      { label: "Sensitive", emoji: "🌸", href: "/skincare?sub=Cleansers" },
    ],
  },

  makeup: {
    banner: {
      gradient: "from-[#F8E8F0] via-[#FDF5FA] to-[#F0E0EA]",
      eyebrow: "Beauty Edit",
      headline: "Soft glam, everyday ready.",
      sub: "Clean formulas that let your skin breathe while looking effortlessly polished.",
      cta: "Shop Makeup",
      href: "/makeup",
    },
browseTags: [
      { label: "Foundation", emoji: "🧴", href: "/makeup?sub=Face+Makeup" },
      { label: "Lip Tint", emoji: "💄", href: "/makeup?sub=Lip+Care" },
      { label: "Blush", emoji: "🌸", href: "/makeup" },
      { label: "Mascara", emoji: "👁️", href: "/makeup" },
      { label: "Clean", emoji: "🌿", href: "/makeup?chip=Clean+Beauty" },
    ],
  },

  hair: {
    banner: {
      gradient: "from-[#E5F5EA] via-[#F0FBF4] to-[#E0F0E5]",
      eyebrow: "Hair Goals",
      headline: "Healthy hair starts here.",
      sub: "From scalp treatments to styling essentials — your best hair day, every day.",
      cta: "Shop Hair",
      href: "/hair",
    },
browseTags: [
      { label: "Shampoo", emoji: "🧴", href: "/hair?sub=Shampoo" },
      { label: "Conditioner", emoji: "✨", href: "/hair?sub=Conditioner" },
      { label: "Hair Mask", emoji: "🧖", href: "/hair?sub=Treatments+%26+Masks" },
      { label: "Scalp", emoji: "💆", href: "/hair" },
      { label: "Hair Oil", emoji: "💧", href: "/hair?sub=Serums+%26+Oils" },
    ],
  },

  fragrance: {
    banner: {
      gradient: "from-[#F0EAF8] via-[#F8F5FD] to-[#E8E0F4]",
      eyebrow: "Scent Studio",
      headline: "Find your signature scent.",
      sub: "Fresh, floral, sweet, or warm — discover what tells your story.",
      cta: "Explore Scents",
      href: "/fragrance",
    },
browseTags: [
      { label: "Floral", emoji: "🌸", href: "/fragrance" },
      { label: "Fresh", emoji: "🍃", href: "/fragrance" },
      { label: "Sweet", emoji: "🍯", href: "/fragrance" },
      { label: "Warm", emoji: "🔥", href: "/fragrance" },
      { label: "Minis", emoji: "✨", href: "/fragrance?sub=Hair+Perfume" },
    ],
  },

  body: {
    banner: {
      gradient: "from-[#E5F2E5] via-[#F5FBF5] to-[#DFF0DF]",
      eyebrow: "Body Care",
      headline: "Skin that glows everywhere.",
      sub: "Luxurious body care for silky, hydrated skin from head to toe.",
      cta: "Shop Body",
      href: "/body",
    },
    browseTags: [
      { label: "Body Wash", emoji: "🚿", href: "/body?sub=Body+Wash" },
      { label: "Lotion", emoji: "🧴", href: "/body?sub=Lotions+%26+Creams" },
      { label: "Scrub", emoji: "✨", href: "/body?sub=Scrubs" },
      { label: "Sunscreen", emoji: "☀️", href: "/body?sub=Sunscreen" },
      { label: "Hand Care", emoji: "🤲", href: "/body" },
    ],
  },

  tools: {
    banner: {
      gradient: "from-[#F3F0EA] via-[#FAF7F0] to-[#EFE9DF]",
      eyebrow: "Beauty Tools",
      headline: "Tools for a flawless finish.",
      sub: "Soft brushes, applicators, and ritual essentials for polished beauty routines.",
      cta: "Shop Tools",
      href: "/tools",
    },
    browseTags: [
      { label: "Face Brush", emoji: "🖌️", href: "/tools?sub=Face+Brush" },
      { label: "Eye Brush", emoji: "✨", href: "/tools?sub=Eye+Brush" },
      { label: "Sponge", emoji: "🫧", href: "/tools?sub=Sponge" },
      { label: "Applicator", emoji: "🤍", href: "/tools?sub=Applicator" },
      { label: "Hair Tools", emoji: "〰️", href: "/tools?sub=Hair+Tools" },
    ],
  },

  gifts: {
    banner: {
      gradient: "from-[#F8ECF0] via-[#FDF5F8] to-[#F1E7F6]",
      eyebrow: "Gift Edit",
      headline: "Give the gift of glow.",
      sub: "Curated sets, minis, and beauty rituals for every skin story.",
      cta: "Shop Gifts",
      href: "/gifts",
    },
    browseTags: [
      { label: "Skincare Sets", emoji: "🎁", href: "/gifts?sub=Skincare+Sets" },
      { label: "Makeup Sets", emoji: "💄", href: "/gifts?sub=Makeup+Sets" },
      { label: "Fragrance", emoji: "🌸", href: "/gifts?sub=Fragrance+Sets" },
      { label: "Minis", emoji: "✨", href: "/gifts?sub=Mini+Sets" },
      { label: "Luxury", emoji: "🖤", href: "/gifts?sub=Luxury+Gifts" },
    ],
  },

  offers: {
    banner: {
      gradient: "from-[#FFF0E8] via-[#FDF8F5] to-[#FFE8DD]",
      eyebrow: "Limited Time",
      headline: "Limited-time beauty deals.",
      sub: "Your favourite products at prices you'll love — stock up before they're gone.",
      cta: "Shop All Deals",
      href: "/offers",
    },
    browseTags: [
      { label: "Skincare", emoji: "💧", href: "/offers?sub=Skincare" },
      { label: "Makeup", emoji: "💄", href: "/offers?sub=Makeup+%26+Lips" },
      { label: "Under $15", emoji: "💰", href: "/offers?chip=Under+%2415" },
      { label: "Best Value", emoji: "🏆", href: "/offers?chip=Best+Value" },
      { label: "Hair & Body", emoji: "🧴", href: "/offers?sub=Hair+%26+Body" },
    ],
  },

  brands: {
    banner: {
      gradient: "from-[#EEEEF8] via-[#F8F8FD] to-[#E8E8F4]",
      eyebrow: "Brand Spotlight",
      headline: "Discover our brand universe.",
      sub: "Korean powerhouses, derma-tested staples, and global cult favourites — all in one place.",
      cta: "View All Brands",
      href: "/brands",
    },
    browseTags: [
      { label: "K-Beauty", emoji: "🇰🇷", href: "/brands?chip=K-Beauty" },
      { label: "Derma", emoji: "🩺", href: "/brands?chip=Dermatologist-Tested" },
      { label: "Clean", emoji: "🌿", href: "/brands?chip=Clean" },
      { label: "Luxury", emoji: "✨", href: "/brands" },
      { label: "New Brands", emoji: "🆕", href: "/brands" },
    ],
  },
};

// ── Promo block components ───────────────────────────────────────────────────

/** Wide banner — placed above the product grid */
export function PromoBanner({
  gradient,
  eyebrow,
  headline,
  sub,
  cta,
  href,
}: PromoConfig["banner"]) {
  return (
    <div
      className={`overflow-hidden rounded-[16px] bg-gradient-to-r ${gradient} px-5 py-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md md:px-6 md:py-5`}
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.2em] text-[#111]/35">
            {eyebrow}
          </p>
          <h3 className="font-serif text-lg font-normal text-[#111] md:text-xl">
            {headline}
          </h3>
          <p className="mt-1 max-w-md text-[12px] leading-relaxed text-[#111]/45">
            {sub}
          </p>
        </div>
        <Link
          href={href}
          className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-[#111] px-5 text-[11px] font-semibold text-white shadow-sm transition-opacity hover:opacity-80"
        >
          {cta}
          <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  );
}

/**
 * Tall promo card — 1 column wide, 2 rows tall inside the product grid.
 * `side` controls which column it anchors to on tablet/desktop.
 * On mobile it becomes a full-width card (all promos full-width on mobile).
 */
export function TallPromoCard({
  promo,
  side,
}: {
  promo: GridPromo;
  side: "left" | "right";
}) {
  const sideClass =
    side === "left" ? "sm:col-start-1" : "sm:col-start-3 lg:col-start-4";

  return (
    <Link
      href={promo.href}
      className={`group relative col-span-2 row-span-1 flex flex-col items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br ${promo.gradient} p-5 text-center transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg sm:col-span-1 sm:row-span-2 ${sideClass}`}
    >
      <span className="text-4xl">{promo.emoji}</span>
      <h3
        className={`mt-3 font-serif text-[15px] font-normal leading-tight ${promo.accent} md:text-[17px]`}
      >
        {promo.headline}
      </h3>
      <p className="mt-2 max-w-[200px] text-[11px] leading-relaxed text-[#111]/45">
        {promo.sub}
      </p>
      <span className="mt-4 inline-flex items-center gap-1 rounded-full bg-[#111] px-4 py-1.5 text-[10px] font-semibold text-white transition-opacity group-hover:opacity-80">
        {promo.cta}
        <ArrowRight size={10} />
      </span>
    </Link>
  );
}

/**
 * Wide promo banner — full-width rectangle spanning a whole product row.
 * Full-width on every breakpoint.
 */
export function WidePromoBanner({ promo }: { promo: GridPromo }) {
  return (
    <Link
      href={promo.href}
      className={`group col-span-2 flex items-center justify-between gap-4 overflow-hidden rounded-2xl bg-gradient-to-r ${promo.gradient} px-5 py-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg sm:col-span-3 sm:px-7 lg:col-span-4`}
    >
      <div className="flex items-center gap-3.5">
        <span className="text-3xl md:text-4xl">{promo.emoji}</span>
        <div>
          <h3
            className={`font-serif text-base font-normal leading-tight ${promo.accent} md:text-xl`}
          >
            {promo.headline}
          </h3>
          <p className="mt-1 max-w-md text-[11px] leading-relaxed text-[#111]/45 md:text-[12px]">
            {promo.sub}
          </p>
        </div>
      </div>
      <span className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-[#111] px-5 text-[11px] font-semibold text-white shadow-sm transition-opacity group-hover:opacity-80">
        {promo.cta}
        <ArrowRight size={12} />
      </span>
    </Link>
  );
}

/** Browse-by tags — compact row of pill links */
export function BrowseTags({
  tags,
}: {
  tags: PromoConfig["browseTags"];
}) {
  return (
    <div>
      <div className="no-scrollbar flex gap-1.5 overflow-x-auto">
        {tags.map((tag) => (
          <Link
            key={tag.label}
            href={tag.href}
            className="flex shrink-0 items-center gap-1.5 rounded-full border border-[#EBEBEB] bg-white px-3 py-1.5 text-[11px] font-medium text-[#666] transition-all hover:border-[#DDD] hover:text-[#333] hover:shadow-sm"
          >
            <span className="text-sm">{tag.emoji}</span>
            {tag.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
