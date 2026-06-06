// Mock data for the Men's Grooming page (/men). Self-contained — no backend.
// Men-focused + unisex curation only. Tags drive the in-page filters.

export type RoutineStep = "Cleanse" | "Moisturize" | "Protect" | "Style" | "Scent";

export type MenConcern =
  | "Oil Control"
  | "Acne Care"
  | "Anti-Aging"
  | "Hydration"
  | "Sensitive"
  | "Hair Styling";

export type MenProductType =
  | "Cleanser"
  | "Moisturizer"
  | "Sunscreen"
  | "Hair"
  | "Fragrance"
  | "Deodorant"
  | "Body Wash"
  | "Tool";

export interface MenProduct {
  id: string;
  name: string;
  brand: string;
  type: MenProductType;
  routine: RoutineStep;
  concerns: MenConcern[];
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  gender: "men" | "unisex";
  tags: string[]; // men-focused, unisex, oil-control, acne-care, hair-styling, fragrance-men, gym-care, daily-routine
  isNew?: boolean;
  isBest?: boolean;
}

export const MEN_BRANDS = [
  "CeraVe",
  "Cetaphil",
  "The Ordinary",
  "La Roche-Posay",
  "COSRX",
  "Innisfree",
  "Dove Men",
  "Nivea Men",
  "Maison Margiela",
] as const;

export const ROUTINE_STEPS: { step: RoutineStep; label: string; note: string }[] = [
  { step: "Cleanse", label: "Cleanse", note: "Wash away oil, sweat and grime — morning and night." },
  { step: "Moisturize", label: "Moisturize", note: "Hydrate so skin stays comfortable, not tight or shiny." },
  { step: "Protect", label: "Protect", note: "Daily SPF — the single biggest anti-aging step." },
  { step: "Style", label: "Style", note: "Clay, wax or salt spray for an easy, lived-in finish." },
  { step: "Scent", label: "Scent", note: "Deodorant plus a signature fragrance to finish the day." },
];

export const MEN_PRODUCTS: MenProduct[] = [
  {
    id: "m1",
    name: "Foaming Facial Cleanser",
    brand: "CeraVe",
    type: "Cleanser",
    routine: "Cleanse",
    concerns: ["Oil Control", "Acne Care"],
    price: 14,
    rating: 5,
    reviewCount: 2400,
    gender: "unisex",
    tags: ["men-focused", "unisex", "oil-control", "acne-care", "daily-routine"],
    isBest: true,
  },
  {
    id: "m2",
    name: "Oil Control Moisturizer SPF Free",
    brand: "Cetaphil",
    type: "Moisturizer",
    routine: "Moisturize",
    concerns: ["Oil Control", "Hydration"],
    price: 16,
    rating: 4,
    reviewCount: 980,
    gender: "unisex",
    tags: ["men-focused", "unisex", "oil-control", "daily-routine"],
  },
  {
    id: "m3",
    name: "Anthelios Daily Sunscreen SPF50",
    brand: "La Roche-Posay",
    type: "Sunscreen",
    routine: "Protect",
    concerns: ["Sensitive", "Anti-Aging"],
    price: 21,
    rating: 5,
    reviewCount: 1500,
    gender: "unisex",
    tags: ["men-focused", "unisex", "daily-routine"],
    isBest: true,
  },
  {
    id: "m4",
    name: "Niacinamide 10% + Zinc 1%",
    brand: "The Ordinary",
    type: "Cleanser",
    routine: "Cleanse",
    concerns: ["Oil Control", "Acne Care"],
    price: 11,
    rating: 4,
    reviewCount: 3100,
    gender: "unisex",
    tags: ["unisex", "oil-control", "acne-care"],
    isBest: true,
  },
  {
    id: "m5",
    name: "Matte Finish Hair Clay",
    brand: "Innisfree",
    type: "Hair",
    routine: "Style",
    concerns: ["Hair Styling"],
    price: 15,
    originalPrice: 19,
    rating: 4,
    reviewCount: 640,
    gender: "men",
    tags: ["men-focused", "hair-styling"],
  },
  {
    id: "m6",
    name: "Sea Salt Texturizing Spray",
    brand: "Innisfree",
    type: "Hair",
    routine: "Style",
    concerns: ["Hair Styling"],
    price: 13,
    rating: 4,
    reviewCount: 410,
    gender: "men",
    tags: ["men-focused", "hair-styling", "gym-care"],
    isNew: true,
  },
  {
    id: "m7",
    name: "Men Cool Kick Deodorant",
    brand: "Nivea Men",
    type: "Deodorant",
    routine: "Scent",
    concerns: ["Sensitive"],
    price: 7,
    rating: 4,
    reviewCount: 1200,
    gender: "men",
    tags: ["men-focused", "gym-care", "daily-routine"],
  },
  {
    id: "m8",
    name: "Clean Comfort Body Wash",
    brand: "Dove Men",
    type: "Body Wash",
    routine: "Cleanse",
    concerns: ["Hydration", "Sensitive"],
    price: 9,
    rating: 4,
    reviewCount: 870,
    gender: "men",
    tags: ["men-focused", "gym-care", "daily-routine"],
  },
  {
    id: "m9",
    name: "Replica By the Fireplace EDT",
    brand: "Maison Margiela",
    type: "Fragrance",
    routine: "Scent",
    concerns: [],
    price: 95,
    rating: 5,
    reviewCount: 520,
    gender: "unisex",
    tags: ["unisex", "fragrance-men"],
    isBest: true,
  },
  {
    id: "m10",
    name: "Advanced Snail Gel Cleanser",
    brand: "COSRX",
    type: "Cleanser",
    routine: "Cleanse",
    concerns: ["Acne Care", "Hydration"],
    price: 12,
    rating: 4,
    reviewCount: 760,
    gender: "unisex",
    tags: ["unisex", "acne-care", "daily-routine"],
  },
  {
    id: "m11",
    name: "Hydrating Gel-Cream Moisturizer",
    brand: "CeraVe",
    type: "Moisturizer",
    routine: "Moisturize",
    concerns: ["Hydration", "Sensitive"],
    price: 15,
    rating: 5,
    reviewCount: 1900,
    gender: "unisex",
    tags: ["men-focused", "unisex", "daily-routine"],
  },
  {
    id: "m12",
    name: "Steel Gua Sha Sculpting Tool",
    brand: "Innisfree",
    type: "Tool",
    routine: "Style",
    concerns: ["Anti-Aging"],
    price: 18,
    rating: 4,
    reviewCount: 230,
    gender: "unisex",
    tags: ["unisex", "gym-care"],
    isNew: true,
  },
  {
    id: "m13",
    name: "Anti-Blemish Hair & Scalp Shampoo",
    brand: "Nivea Men",
    type: "Hair",
    routine: "Cleanse",
    concerns: ["Oil Control", "Hair Styling"],
    price: 8,
    rating: 4,
    reviewCount: 540,
    gender: "men",
    tags: ["men-focused", "hair-styling", "gym-care"],
  },
  {
    id: "m14",
    name: "Toleriane Sensitive Moisturizer",
    brand: "La Roche-Posay",
    type: "Moisturizer",
    routine: "Moisturize",
    concerns: ["Sensitive", "Hydration"],
    price: 19,
    rating: 5,
    reviewCount: 1100,
    gender: "unisex",
    tags: ["men-focused", "unisex", "daily-routine"],
  },
];

export interface MenSet {
  id: string;
  name: string;
  includes: string[];
  bestFor: string;
  price: number;
  originalPrice: number;
}

export const MEN_SETS: MenSet[] = [
  {
    id: "s1",
    name: "Daily Face Set",
    includes: ["Cleanser", "Moisturizer", "Sunscreen"],
    bestFor: "First-timers who want a no-fuss daily routine.",
    price: 42,
    originalPrice: 51,
  },
  {
    id: "s2",
    name: "Glow Up Set",
    includes: ["Cleanser", "Moisturizer", "Gua Sha", "Sea Salt Spray"],
    bestFor: "Stepping up — brighter, sculpted, put-together skin.",
    price: 58,
    originalPrice: 72,
  },
  {
    id: "s3",
    name: "Hair Styling Set",
    includes: ["Shampoo", "Sea Salt Spray", "Hair Clay"],
    bestFor: "Easy texture and hold for everyday hair.",
    price: 34,
    originalPrice: 40,
  },
  {
    id: "s4",
    name: "Fresh Scent Set",
    includes: ["Body Wash", "Deodorant", "Fragrance"],
    bestFor: "Stay fresh from the gym to the night out.",
    price: 64,
    originalPrice: 80,
  },
];

// Trending row — references product ids in display order.
export const MEN_TRENDING_IDS = [
  "m12", // Gua Sha
  "m6", // Sea Salt Spray
  "m1", // Cleanser
  "m11", // Moisturizer
  "m3", // Sunscreen
  "m5", // Hair Wax / Clay
  "m9", // Fragrance
  "m7", // Deodorant
];
