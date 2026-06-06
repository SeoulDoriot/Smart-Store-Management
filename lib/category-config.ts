import type { Product } from "@/types/product";

export type SubCategory = {
  label: string;
  categoryId?: string;       // single category match
  categoryIds?: string[];    // OR multi-category match
  brandId?: string;          // brand match
  tagFilters?: string[];     // OR substring match against ai_tags
};

export type PromoBanner = {
  headline: string;
  sub: string;
  bg: string; // Tailwind class string
};

// Serializable — safe to pass as props to client components
export type CategoryDisplayConfig = {
  slug: string;
  title: string;
  description: string;
  subcategories: SubCategory[];
  chips: string[];
  promoBanner: PromoBanner | null;
  emptyMessage?: string;
};

// Full config — used server-side only (contains a function)
type CategoryFullConfig = CategoryDisplayConfig & {
  filterFn: (p: Product) => boolean;
};

export const CATEGORY_CONFIGS: Record<string, CategoryFullConfig> = {
  new: {
    slug: "new",
    title: "New Arrivals",
    description: "Fresh drops, just landed",
    subcategories: [
      { label: "All New" },
      { label: "Skincare", categoryIds: ["c1", "c2", "c3", "c4", "c5", "c6", "c7"] },
      { label: "Makeup", categoryIds: ["c8", "c13"] },
      { label: "Hair", categoryId: "c10" },
      { label: "Body", categoryId: "c12" },
      { label: "Fragrance", categoryId: "c11" },
    ],
    chips: ["Just Dropped", "Trending", "Editor's Pick", "Best Value"],
    promoBanner: {
      headline: "New. Just Dropped.",
      sub: "The latest skincare arrivals, curated for you.",
      bg: "bg-gradient-to-r from-[#E6EEF8] to-[#F5F0FA]",
    },
    filterFn: (p) => p.is_new_arrival,
  },

  skincare: {
    slug: "skincare",
    title: "Skincare",
    description: "Build your perfect routine",
    subcategories: [
      { label: "All Skincare" },
      { label: "Cleansers", categoryId: "c1" },
      { label: "Toners", categoryId: "c2" },
      { label: "Serums", categoryId: "c3" },
      { label: "Moisturizers", categoryId: "c4" },
      { label: "Sunscreens", categoryId: "c5" },
      { label: "Acne Treatment", categoryId: "c6" },
      { label: "Masks", categoryId: "c7" },
      { label: "Lip Care", categoryId: "c13" },
    ],
    chips: ["Bestsellers", "Sensitive Skin", "K-Beauty", "Clean"],
    promoBanner: {
      headline: "Your Skin, Perfected.",
      sub: "Authentic Korean and global skincare, curated by experts.",
      bg: "bg-gradient-to-r from-[#F5EFE8] to-[#FDF8F4]",
    },
    filterFn: () => true,
  },

  makeup: {
    slug: "makeup",
    title: "Makeup",
    description: "Colour, coverage, and care",
    subcategories: [
      { label: "All Makeup" },
      { label: "Face Makeup", categoryId: "c8" },
      { label: "Lip Care", categoryId: "c13" },
      { label: "Masks & Patches", categoryId: "c7" },
    ],
    chips: ["Bestsellers", "New", "Clean Beauty", "Vegan"],
    promoBanner: {
      headline: "Beauty That Cares.",
      sub: "Clean, cruelty-free makeup for every skin tone.",
      bg: "bg-gradient-to-r from-[#F8E8F0] to-[#FDF5FA]",
    },
    filterFn: (p) => ["c7", "c8", "c13"].includes(p.category_id),
    emptyMessage: "More makeup products coming soon.",
  },

  fragrance: {
    slug: "fragrance",
    title: "Fragrance",
    description: "Find your signature scent",
    subcategories: [
      { label: "All Fragrance" },
      { label: "Fine Fragrances", tagFilters: ["fragrance"] },
      { label: "Body Mists", tagFilters: ["body mist"] },
      { label: "Hair Perfume", tagFilters: ["hair perfume"] },
      { label: "Maison Margiela", brandId: "b14" },
    ],
    chips: ["Bestsellers", "New", "Floral", "Fresh", "Woody"],
    promoBanner: {
      headline: "Your Signature Scent.",
      sub: "Discover fragrances that tell your story.",
      bg: "bg-gradient-to-r from-[#F0EAF8] to-[#F8F5FD]",
    },
    filterFn: (p) => p.category_id === "c11",
    emptyMessage: "Fragrance collection coming soon.",
  },

  hair: {
    slug: "hair",
    title: "Hair",
    description: "Healthy hair from root to tip",
    subcategories: [
      { label: "All Hair" },
      { label: "Shampoo", tagFilters: ["shampoo"] },
      { label: "Conditioner", tagFilters: ["conditioner"] },
      { label: "Treatments & Masks", tagFilters: ["treatment", "hair mask"] },
      { label: "Serums & Oils", tagFilters: ["hair serum", "hair essence", "scalp serum"] },
      { label: "Kundal", brandId: "b13" },
    ],
    chips: ["Bestsellers", "New", "For Dry Hair", "Scalp Health"],
    promoBanner: {
      headline: "Good Hair Days, Every Day.",
      sub: "Nourishing haircare for all hair types.",
      bg: "bg-gradient-to-r from-[#E5F5EA] to-[#F5FDF7]",
    },
    filterFn: (p) => p.category_id === "c10",
    emptyMessage: "Hair collection coming soon.",
  },

  body: {
    slug: "body",
    title: "Bath & Body",
    description: "Head-to-toe indulgence",
    subcategories: [
      { label: "All Body" },
      { label: "Body Wash", tagFilters: ["body wash"] },
      { label: "Lotions & Creams", tagFilters: ["body lotion", "body milk", "body balm", "body moisturizer"] },
      { label: "Scrubs", tagFilters: ["body scrub", "scrub"] },
      { label: "Oils & Serums", tagFilters: ["body oil", "body serum"] },
      { label: "Sunscreen", categoryId: "c5" },
    ],
    chips: ["Bestsellers", "New", "Fragrance-Free", "Hydrating"],
    promoBanner: {
      headline: "Skin That Glows, Everywhere.",
      sub: "Luxurious body care for silky, nourished skin.",
      bg: "bg-gradient-to-r from-[#E5F2E5] to-[#F5FBF5]",
    },
    filterFn: (p) => ["c4", "c5", "c7", "c12"].includes(p.category_id),
  },

  tools: {
    slug: "tools",
    title: "Tools & Brushes",
    description: "Brushes, applicators, and beauty essentials",
    subcategories: [
      { label: "All Tools" },
      { label: "Beauty Tools", categoryId: "c14" },
      { label: "Face Brushes", tagFilters: ["brush", "face brush", "foundation brush"] },
      { label: "Eye Brushes", tagFilters: ["eye brush", "shadow brush", "blending brush"] },
      { label: "Sponges", tagFilters: ["sponge", "beauty blender", "konjac"] },
      { label: "Applicators", tagFilters: ["applicator", "lash curler", "tweezer"] },
      { label: "Hair Tools", tagFilters: ["hair tool", "hair brush", "scalp massager"] },
    ],
    chips: ["Bestsellers", "Brush Sets", "Travel Size", "New"],
    promoBanner: {
      headline: "Tools for a Flawless Finish.",
      sub: "Soft-touch essentials for makeup, skincare, and hair rituals.",
      bg: "bg-gradient-to-r from-[#F3F0EA] to-[#FAF7F0]",
    },
    filterFn: (p) => p.category_id === "c14" || p.ai_tags.some((tag) => tag.includes("brush") || tag.includes("tool")),
    emptyMessage: "Beauty tools are being curated now — check back soon.",
  },

  gifts: {
    slug: "gifts",
    title: "Gifts & Value Sets",
    description: "Curated sets, minis, and beauty gifts",
    subcategories: [
      { label: "All Sets" },
      { label: "Skincare Sets", categoryId: "c9" },
      { label: "Makeup Sets", categoryIds: ["c8", "c13"] },
      { label: "Fragrance Sets", categoryId: "c11" },
      { label: "Mini Sets", tagFilters: ["mini", "travel", "trial"] },
      { label: "Luxury Gifts", tagFilters: ["luxury", "gift", "set"] },
    ],
    chips: ["Bestsellers", "Under $25", "Under $50", "Best Value"],
    promoBanner: {
      headline: "Give the Gift of Glow.",
      sub: "Thoughtful sets and beauty rituals for every occasion.",
      bg: "bg-gradient-to-r from-[#F8ECF0] to-[#FDF5F8]",
    },
    filterFn: (p) =>
      p.category_id === "c9" ||
      p.ai_tags.some((tag) => tag.includes("set") || tag.includes("gift") || tag.includes("mini")),
    emptyMessage: "Gift sets are being curated now — check back soon.",
  },

  brands: {
    slug: "brands",
    title: "Brands",
    description: "Shop by your favourite brand",
    subcategories: [
      { label: "All Brands" },
      { label: "Anua", brandId: "b1" },
      { label: "COSRX", brandId: "b2" },
      { label: "Beauty of Joseon", brandId: "b3" },
      { label: "Skin1004", brandId: "b4" },
      { label: "CeraVe", brandId: "b5" },
      { label: "The Ordinary", brandId: "b6" },
      { label: "Some By Mi", brandId: "b7" },
      { label: "La Roche-Posay", brandId: "b8" },
      { label: "Laneige", brandId: "b9" },
      { label: "Rom&nd", brandId: "b10" },
      { label: "Dr. Jart+", brandId: "b11" },
      { label: "Innisfree", brandId: "b12" },
      { label: "Kundal", brandId: "b13" },
      { label: "Maison Margiela", brandId: "b14" },
      { label: "Torriden", brandId: "b15" },
    ],
    chips: ["K-Beauty", "Dermatologist-Tested", "Clean", "Fragrance-Free"],
    promoBanner: {
      headline: "Explore Our Brand Universe.",
      sub: "Korean skincare powerhouses and global cult favourites.",
      bg: "bg-gradient-to-r from-[#EEEEF8] to-[#F8F8FD]",
    },
    filterFn: () => true,
  },

  offers: {
    slug: "offers",
    title: "Sale & Offers",
    description: "Deals you don't want to miss",
    subcategories: [
      { label: "All Offers" },
      { label: "Skincare", categoryIds: ["c1", "c2", "c3", "c4", "c5", "c6", "c7"] },
      { label: "Hair & Body", categoryIds: ["c10", "c12"] },
      { label: "Makeup & Lips", categoryIds: ["c8", "c13"] },
      { label: "Fragrance", categoryId: "c11" },
    ],
    chips: ["Best Value", "Under $15", "Under $20", "Free Delivery"],
    promoBanner: {
      headline: "Limited-Time Deals.",
      sub: "Stock up on your favourites before they sell out.",
      bg: "bg-gradient-to-r from-[#FFF0E8] to-[#FDF8F5]",
    },
    filterFn: (p) => p.is_hot_sale,
    emptyMessage: "New deals added regularly — check back soon.",
  },
};

/** Returns the serializable display config (no filterFn) */
export function getDisplayConfig(slug: string): CategoryDisplayConfig | null {
  const full = CATEGORY_CONFIGS[slug];
  if (!full) return null;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { filterFn: _fn, ...display } = full;
  return display;
}
