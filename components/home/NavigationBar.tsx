"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown, ChevronRight, Sparkles } from "lucide-react";

// ─── Mega-menu data ────────────────────────────────────────────────────────────
type MegaLink   = { label: string; href: string; children?: MegaLink[] };
type MegaCol    = { heading: string; items: MegaLink[] };
type MegaPromo  = { headline: string; sub: string; cta: string; href: string; gradient: string };
type MegaMenu   = { columns: MegaCol[]; promo: MegaPromo };
type NestedState = { key: string; placement: "down" | "up" } | null;

const MEGA: Partial<Record<string, MegaMenu>> = {
  New: {
    columns: [
      {
        heading: "Shop New",
        items: [
          {
            label: "All New",
            href: "/new",
            children: [
              { label: "Just Dropped", href: "/new?chip=Just+Dropped" },
              { label: "Trending Now",  href: "/new?chip=Trending" },
            ],
          },
          {
            label: "New Skincare",
            href: "/new?sub=Skincare",
            children: [
              { label: "New Cleansers", href: "/new?sub=Skincare" },
              { label: "New Toners",    href: "/new?sub=Skincare" },
              { label: "New Serums",    href: "/new?sub=Skincare" },
              { label: "New Sunscreens", href: "/new?sub=Skincare" },
            ],
          },
          {
            label: "New Makeup",
            href: "/new?sub=Makeup",
            children: [
              { label: "New Face",  href: "/new?sub=Makeup" },
              { label: "New Lip",   href: "/new?sub=Makeup" },
              { label: "New Eye",   href: "/new?sub=Makeup" },
            ],
          },
          {
            label: "New Hair",
            href: "/new?sub=Hair",
            children: [
              { label: "New Shampoo",     href: "/new?sub=Hair" },
              { label: "New Treatments",  href: "/new?sub=Hair" },
            ],
          },
          {
            label: "New Fragrance",
            href: "/new?sub=Fragrance",
            children: [
              { label: "New Women's",  href: "/new?sub=Fragrance" },
              { label: "New Unisex",   href: "/new?sub=Fragrance" },
              { label: "New Minis",    href: "/new?sub=Fragrance" },
            ],
          },
        ],
      },
      {
        heading: "Curated",
        items: [
          {
            label: "Bestsellers",
            href: "/new",
            children: [
              { label: "Skincare Bestsellers", href: "/skincare?chip=Bestsellers" },
              { label: "Makeup Bestsellers",   href: "/makeup?chip=Bestsellers" },
              { label: "Hair Bestsellers",     href: "/hair?chip=Bestsellers" },
            ],
          },
          { label: "Editor's Pick",   href: "/new" },
          { label: "K-Beauty Drops",  href: "/new" },
          { label: "Gift Ideas",      href: "/new" },
        ],
      },
    ],
    promo: {
      headline: "New. Just Dropped.",
      sub:      "The latest skincare arrivals, curated for you.",
      cta:      "Shop All New",
      href:     "/new",
      gradient: "from-[#E6EEF8] to-[#F5F0FA]",
    },
  },

  Makeup: {
    columns: [
      {
        heading: "By Category",
        items: [
          { label: "All Makeup",  href: "/makeup" },
          {
            label: "Face",
            href: "/makeup?sub=Face+Makeup",
            children: [
              { label: "Foundation",    href: "/makeup?sub=Face+Makeup" },
              { label: "Concealer",     href: "/makeup?sub=Face+Makeup" },
              { label: "Powder",        href: "/makeup?sub=Face+Makeup" },
              { label: "Primer",        href: "/makeup?sub=Face+Makeup" },
              { label: "Setting Spray", href: "/makeup?sub=Face+Makeup" },
            ],
          },
          {
            label: "Lip",
            href: "/makeup?sub=Lip+Care",
            children: [
              { label: "Lipstick",   href: "/makeup?sub=Lip+Care" },
              { label: "Lip Tint",   href: "/makeup?sub=Lip+Care" },
              { label: "Lip Gloss",  href: "/makeup?sub=Lip+Care" },
              { label: "Lip Liner",  href: "/makeup?sub=Lip+Care" },
              { label: "Lip Balm",   href: "/makeup?sub=Lip+Care" },
            ],
          },
          {
            label: "Eye",
            href: "/makeup?sub=Eye",
            children: [
              { label: "Eyeshadow",  href: "/makeup?sub=Eye" },
              { label: "Eyeliner",   href: "/makeup?sub=Eye" },
              { label: "Mascara",    href: "/makeup?sub=Eye" },
              { label: "Brow",       href: "/makeup?sub=Eye" },
            ],
          },
          {
            label: "Cheek",
            href: "/makeup?sub=Cheek",
            children: [
              { label: "Blush",       href: "/makeup?sub=Cheek" },
              { label: "Bronzer",     href: "/makeup?sub=Cheek" },
              { label: "Highlighter", href: "/makeup?sub=Cheek" },
              { label: "Contour",     href: "/makeup?sub=Cheek" },
            ],
          },
          { label: "Brushes & Tools", href: "/tools" },
        ],
      },
      {
        heading: "Shop By",
        items: [
          { label: "Bestsellers",  href: "/makeup" },
          { label: "New Makeup",   href: "/makeup" },
          { label: "Clean Beauty", href: "/makeup" },
          { label: "Vegan",        href: "/makeup" },
          { label: "K-Beauty",     href: "/makeup" },
        ],
      },
    ],
    promo: {
      headline: "Beauty That Cares.",
      sub:      "Clean, cruelty-free makeup.",
      cta:      "Shop Makeup",
      href:     "/makeup",
      gradient: "from-[#F8E8F0] to-[#FDF5FA]",
    },
  },

  Skincare: {
    columns: [
      {
        heading: "By Type",
        items: [
          { label: "All Skincare",   href: "/skincare" },
          {
            label: "Cleansers",
            href: "/skincare?sub=Cleansers",
            children: [
              { label: "Foam Cleanser",  href: "/skincare?sub=Cleansers" },
              { label: "Gel Cleanser",   href: "/skincare?sub=Cleansers" },
              { label: "Oil Cleanser",   href: "/skincare?sub=Cleansers" },
              { label: "Micellar Water", href: "/skincare?sub=Cleansers" },
            ],
          },
          {
            label: "Toners",
            href: "/skincare?sub=Toners",
            children: [
              { label: "Hydrating Toner",   href: "/skincare?sub=Toners" },
              { label: "Exfoliating Toner",  href: "/skincare?sub=Toners" },
              { label: "Essence",            href: "/skincare?sub=Toners" },
            ],
          },
          {
            label: "Serums",
            href: "/skincare?sub=Serums",
            children: [
              { label: "Vitamin C",      href: "/skincare?sub=Serums" },
              { label: "Niacinamide",    href: "/skincare?sub=Serums" },
              { label: "Retinol",        href: "/skincare?sub=Serums" },
              { label: "Hyaluronic Acid", href: "/skincare?sub=Serums" },
              { label: "Centella / Cica", href: "/skincare?sub=Serums" },
            ],
          },
          {
            label: "Moisturizers",
            href: "/skincare?sub=Moisturizers",
            children: [
              { label: "Gel Cream",     href: "/skincare?sub=Moisturizers" },
              { label: "Rich Cream",    href: "/skincare?sub=Moisturizers" },
              { label: "Sleeping Mask", href: "/skincare?sub=Moisturizers" },
            ],
          },
          {
            label: "Sunscreens",
            href: "/skincare?sub=Sunscreens",
            children: [
              { label: "Chemical SPF", href: "/skincare?sub=Sunscreens" },
              { label: "Physical SPF", href: "/skincare?sub=Sunscreens" },
              { label: "Tone-Up SPF",  href: "/skincare?sub=Sunscreens" },
            ],
          },
          { label: "Masks & Patches", href: "/skincare?sub=Masks" },
        ],
      },
      {
        heading: "By Concern",
        items: [
          {
            label: "Skin Concern",
            href: "/skincare",
            children: [
              { label: "Acne",        href: "/skincare?concern=Acne" },
              { label: "Dark Spots",  href: "/skincare?concern=Dark+Spots" },
              { label: "Redness",     href: "/skincare?concern=Redness" },
              { label: "Large Pores", href: "/skincare?concern=Large+Pores" },
              { label: "Dryness",     href: "/skincare?concern=Dryness" },
              { label: "Dull Skin",   href: "/skincare?concern=Dull+Skin" },
            ],
          },
          { label: "Acne Treatment",  href: "/skincare?sub=Acne+Treatment" },
          { label: "Lip Care",        href: "/skincare?sub=Lip+Care" },
          { label: "Brightening",     href: "/skincare?sub=Serums" },
          { label: "Sun Protection",  href: "/skincare?sub=Sunscreens" },
        ],
      },
    ],
    promo: {
      headline: "Your Skin, Perfected.",
      sub:      "Authentic Korean and global skincare.",
      cta:      "Explore All",
      href:     "/skincare",
      gradient: "from-[#F5EFE8] to-[#FDF8F4]",
    },
  },

  Hair: {
    columns: [
      {
        heading: "By Type",
        items: [
          { label: "All Hair",  href: "/hair" },
          {
            label: "Shampoo",
            href: "/hair?sub=Shampoo",
            children: [
              { label: "Daily Shampoo",    href: "/hair?sub=Shampoo" },
              { label: "Anti-Dandruff",    href: "/hair?sub=Shampoo" },
              { label: "Color-Safe",       href: "/hair?sub=Shampoo" },
              { label: "Volumizing",       href: "/hair?sub=Shampoo" },
            ],
          },
          {
            label: "Conditioner",
            href: "/hair?sub=Conditioner",
            children: [
              { label: "Rinse-Out",   href: "/hair?sub=Conditioner" },
              { label: "Leave-In",    href: "/hair?sub=Conditioner" },
              { label: "Deep Conditioner", href: "/hair?sub=Conditioner" },
            ],
          },
          {
            label: "Hair Mask",
            href: "/hair?sub=Treatments+%26+Masks",
            children: [
              { label: "Hydrating Mask",    href: "/hair?sub=Treatments+%26+Masks" },
              { label: "Protein Treatment", href: "/hair?sub=Treatments+%26+Masks" },
              { label: "Overnight Mask",    href: "/hair?sub=Treatments+%26+Masks" },
            ],
          },
          {
            label: "Hair Oil",
            href: "/hair?sub=Serums+%26+Oils",
            children: [
              { label: "Argan Oil",    href: "/hair?sub=Serums+%26+Oils" },
              { label: "Hair Serum",   href: "/hair?sub=Serums+%26+Oils" },
              { label: "Heat Protect", href: "/hair?sub=Serums+%26+Oils" },
            ],
          },
          {
            label: "Scalp Care",
            href: "/hair?sub=Shampoo",
            children: [
              { label: "Scalp Scrub",   href: "/hair?sub=Shampoo" },
              { label: "Scalp Tonic",   href: "/hair?sub=Shampoo" },
              { label: "Anti-Hair Loss", href: "/hair?sub=Shampoo" },
            ],
          },
        ],
      },
      {
        heading: "Shop By",
        items: [
          { label: "Kundal",       href: "/hair?sub=Kundal" },
          { label: "Bestsellers",  href: "/hair" },
          { label: "New Arrivals", href: "/hair" },
        ],
      },
    ],
    promo: {
      headline: "Good Hair Days.",
      sub:      "Nourishing haircare for all types.",
      cta:      "Shop Hair",
      href:     "/hair",
      gradient: "from-[#E5F5EA] to-[#F5FDF7]",
    },
  },

  Fragrance: {
    columns: [
      {
        heading: "By Category",
        items: [
          { label: "All Fragrance",  href: "/fragrance" },
          {
            label: "Women",
            href: "/fragrance?sub=Women",
            children: [
              { label: "Eau de Parfum",  href: "/fragrance?sub=Women" },
              { label: "Eau de Toilette", href: "/fragrance?sub=Women" },
              { label: "Floral",          href: "/fragrance?sub=Women" },
              { label: "Sweet & Gourmand", href: "/fragrance?sub=Women" },
            ],
          },
          {
            label: "Men",
            href: "/fragrance?sub=Men",
            children: [
              { label: "Woody",    href: "/fragrance?sub=Men" },
              { label: "Fresh",    href: "/fragrance?sub=Men" },
              { label: "Aromatic", href: "/fragrance?sub=Men" },
            ],
          },
          {
            label: "Unisex",
            href: "/fragrance?sub=Unisex",
            children: [
              { label: "Citrus",   href: "/fragrance?sub=Unisex" },
              { label: "Woody",    href: "/fragrance?sub=Unisex" },
              { label: "Musky",    href: "/fragrance?sub=Unisex" },
            ],
          },
          {
            label: "Body Mist",
            href: "/fragrance?sub=Body+Mists",
            children: [
              { label: "Floral Mist",     href: "/fragrance?sub=Body+Mists" },
              { label: "Fresh Mist",      href: "/fragrance?sub=Body+Mists" },
              { label: "Hair Perfume",     href: "/fragrance?sub=Hair+Perfume" },
            ],
          },
          { label: "Mini & Travel",  href: "/fragrance?sub=Mini" },
          { label: "Gift Sets",      href: "/fragrance?sub=Gift+Sets" },
        ],
      },
      {
        heading: "Shop By",
        items: [
          { label: "Maison Margiela", href: "/fragrance?sub=Maison+Margiela" },
          { label: "Bestsellers",     href: "/fragrance" },
          { label: "New Arrivals",    href: "/fragrance" },
        ],
      },
    ],
    promo: {
      headline: "Your Signature Scent.",
      sub:      "Fragrances that tell your story.",
      cta:      "Explore",
      href:     "/fragrance",
      gradient: "from-[#F0EAF8] to-[#F8F5FD]",
    },
  },

  Body: {
    columns: [
      {
        heading: "By Type",
        items: [
          { label: "All Body",  href: "/body" },
          {
            label: "Body Lotion",
            href: "/body?sub=Lotions+%26+Creams",
            children: [
              { label: "Hydrating Lotion", href: "/body?sub=Lotions+%26+Creams" },
              { label: "Firming Lotion",   href: "/body?sub=Lotions+%26+Creams" },
              { label: "Body Butter",      href: "/body?sub=Lotions+%26+Creams" },
            ],
          },
          {
            label: "Body Wash",
            href: "/body?sub=Body+Wash",
            children: [
              { label: "Shower Gel",  href: "/body?sub=Body+Wash" },
              { label: "Shower Oil",  href: "/body?sub=Body+Wash" },
              { label: "Bar Soap",    href: "/body?sub=Body+Wash" },
            ],
          },
          {
            label: "Scrub",
            href: "/body?sub=Scrubs",
            children: [
              { label: "Sugar Scrub",  href: "/body?sub=Scrubs" },
              { label: "Salt Scrub",   href: "/body?sub=Scrubs" },
              { label: "Chemical Exfoliant", href: "/body?sub=Scrubs" },
            ],
          },
          {
            label: "Hand Cream",
            href: "/body?sub=Hand+Cream",
            children: [
              { label: "Moisturizing",    href: "/body?sub=Hand+Cream" },
              { label: "Anti-Aging Hand", href: "/body?sub=Hand+Cream" },
              { label: "Hand Mask",       href: "/body?sub=Hand+Cream" },
            ],
          },
          {
            label: "Deodorant",
            href: "/body?sub=Deodorant",
            children: [
              { label: "Natural Deo",  href: "/body?sub=Deodorant" },
              { label: "Spray",        href: "/body?sub=Deodorant" },
              { label: "Roll-On",      href: "/body?sub=Deodorant" },
            ],
          },
        ],
      },
      {
        heading: "Shop By",
        items: [
          { label: "Sunscreen",    href: "/body?sub=Sunscreen" },
          { label: "Hydrating",    href: "/body" },
          { label: "Bestsellers",  href: "/body" },
        ],
      },
    ],
    promo: {
      headline: "Glow, Everywhere.",
      sub:      "Luxurious body care for silky skin.",
      cta:      "Shop Body",
      href:     "/body",
      gradient: "from-[#E5F2E5] to-[#F5FBF5]",
    },
  },

  Brands: {
    columns: [
      {
        heading: "K-Beauty",
        items: [
          {
            label: "K-Beauty",
            href: "/brands?chip=K-Beauty",
            children: [
              { label: "Anua",             href: "/brands?sub=Anua" },
              { label: "COSRX",            href: "/brands?sub=COSRX" },
              { label: "Beauty of Joseon", href: "/brands?sub=Beauty+of+Joseon" },
              { label: "Skin1004",         href: "/brands?sub=Skin1004" },
              { label: "Some By Mi",       href: "/brands?sub=Some+By+Mi" },
              { label: "Laneige",          href: "/brands?sub=Laneige" },
            ],
          },
          {
            label: "Derma",
            href: "/brands?chip=Dermatologist-Tested",
            children: [
              { label: "CeraVe",         href: "/brands?sub=CeraVe" },
              { label: "La Roche-Posay",  href: "/brands?sub=La+Roche-Posay" },
              { label: "The Ordinary",    href: "/brands?sub=The+Ordinary" },
            ],
          },
          {
            label: "Clean Beauty",
            href: "/brands?chip=Clean",
            children: [
              { label: "Innisfree",  href: "/brands?sub=Innisfree" },
              { label: "Round Lab",  href: "/brands?sub=Round+Lab" },
              { label: "Isntree",    href: "/brands?sub=Isntree" },
            ],
          },
          { label: "Luxury",          href: "/brands?chip=Luxury" },
          { label: "Popular Brands",  href: "/brands" },
        ],
      },
      {
        heading: "Browse",
        items: [
          { label: "All Brands A–Z", href: "/brands" },
          { label: "New Brands",     href: "/brands" },
          { label: "Bestsellers",    href: "/brands" },
        ],
      },
    ],
    promo: {
      headline: "Brand Universe.",
      sub:      "Skincare powerhouses, all in one place.",
      cta:      "View All Brands",
      href:     "/brands",
      gradient: "from-[#EEEEF8] to-[#F8F8FD]",
    },
  },

  Offers: {
    columns: [
      {
        heading: "Current Deals",
        items: [
          {
            label: "Hot Sale",
            href: "/offers",
            children: [
              { label: "Skincare Sale",  href: "/offers?sub=Skincare" },
              { label: "Makeup Sale",    href: "/offers?sub=Makeup+%26+Lips" },
              { label: "Hair Sale",      href: "/offers?sub=Hair+%26+Body" },
              { label: "Fragrance Sale", href: "/offers?sub=Fragrance" },
            ],
          },
          {
            label: "Under $10",
            href: "/offers?chip=Under+%2410",
            children: [
              { label: "Skincare Under $10", href: "/offers?chip=Under+%2410" },
              { label: "Makeup Under $10",   href: "/offers?chip=Under+%2410" },
            ],
          },
          {
            label: "Under $20",
            href: "/offers?chip=Under+%2420",
            children: [
              { label: "Skincare Under $20", href: "/offers?chip=Under+%2420" },
              { label: "Sets Under $20",     href: "/offers?chip=Under+%2420" },
            ],
          },
          { label: "Bundle Deals",   href: "/offers" },
          { label: "Clearance",      href: "/offers" },
        ],
      },
      {
        heading: "Shop By",
        items: [
          { label: "All Offers",          href: "/offers" },
          { label: "Bestsellers on Sale", href: "/offers" },
          { label: "K-Beauty Deals",      href: "/offers" },
          { label: "Free Delivery",       href: "/offers?chip=Free+Delivery" },
        ],
      },
    ],
    promo: {
      headline: "Limited Deals.",
      sub:      "Stock up before they sell out.",
      cta:      "Shop Now",
      href:     "/offers",
      gradient: "from-[#FFF0E8] to-[#FDF8F5]",
    },
  },

  "Tools & Brushes": {
    columns: [
      {
        heading: "By Category",
        items: [
          { label: "All Tools",  href: "/tools" },
          {
            label: "Face Brush",
            href: "/tools?sub=Face+Brush",
            children: [
              { label: "Foundation Brush",  href: "/tools?sub=Face+Brush" },
              { label: "Powder Brush",      href: "/tools?sub=Face+Brush" },
              { label: "Contour Brush",     href: "/tools?sub=Face+Brush" },
              { label: "Blush Brush",       href: "/tools?sub=Face+Brush" },
            ],
          },
          {
            label: "Eye Brush",
            href: "/tools?sub=Eye+Brush",
            children: [
              { label: "Shadow Brush",   href: "/tools?sub=Eye+Brush" },
              { label: "Blending Brush", href: "/tools?sub=Eye+Brush" },
              { label: "Liner Brush",    href: "/tools?sub=Eye+Brush" },
              { label: "Brow Brush",     href: "/tools?sub=Eye+Brush" },
            ],
          },
          {
            label: "Sponge",
            href: "/tools?sub=Sponge",
            children: [
              { label: "Beauty Blender",  href: "/tools?sub=Sponge" },
              { label: "Silicone Sponge", href: "/tools?sub=Sponge" },
              { label: "Konjac Sponge",   href: "/tools?sub=Sponge" },
            ],
          },
          {
            label: "Applicator",
            href: "/tools?sub=Applicator",
            children: [
              { label: "Lash Curler",     href: "/tools?sub=Applicator" },
              { label: "Tweezer",         href: "/tools?sub=Applicator" },
              { label: "Cotton Pads",     href: "/tools?sub=Applicator" },
              { label: "Sheet Mask Tool", href: "/tools?sub=Applicator" },
            ],
          },
          {
            label: "Hair Tools",
            href: "/tools?sub=Hair+Tools",
            children: [
              { label: "Hair Dryer",     href: "/tools?sub=Hair+Tools" },
              { label: "Straightener",   href: "/tools?sub=Hair+Tools" },
              { label: "Hair Brush",     href: "/tools?sub=Hair+Tools" },
              { label: "Scalp Massager", href: "/tools?sub=Hair+Tools" },
            ],
          },
        ],
      },
      {
        heading: "Shop By",
        items: [
          { label: "Bestsellers",   href: "/tools" },
          { label: "Brush Sets",    href: "/tools" },
          { label: "Travel Size",   href: "/tools" },
        ],
      },
    ],
    promo: {
      headline: "The Right Tools.",
      sub:      "Professional brushes and beauty tools.",
      cta:      "Shop Tools",
      href:     "/tools",
      gradient: "from-[#F0ECE8] to-[#FAF8F5]",
    },
  },

  "Gifts & Value Sets": {
    columns: [
      {
        heading: "By Category",
        items: [
          { label: "All Sets",  href: "/gifts" },
          {
            label: "Skincare Sets",
            href: "/gifts?sub=Skincare+Sets",
            children: [
              { label: "Routine Starter",  href: "/gifts?sub=Skincare+Sets" },
              { label: "Anti-Aging Set",   href: "/gifts?sub=Skincare+Sets" },
              { label: "Hydration Set",    href: "/gifts?sub=Skincare+Sets" },
              { label: "Acne Care Set",    href: "/gifts?sub=Skincare+Sets" },
            ],
          },
          {
            label: "Makeup Sets",
            href: "/gifts?sub=Makeup+Sets",
            children: [
              { label: "Lip Set",    href: "/gifts?sub=Makeup+Sets" },
              { label: "Face Set",   href: "/gifts?sub=Makeup+Sets" },
              { label: "Eye Set",    href: "/gifts?sub=Makeup+Sets" },
            ],
          },
          {
            label: "Fragrance Sets",
            href: "/gifts?sub=Fragrance+Sets",
            children: [
              { label: "Discovery Set",   href: "/gifts?sub=Fragrance+Sets" },
              { label: "Travel Set",      href: "/gifts?sub=Fragrance+Sets" },
              { label: "Gift Box",        href: "/gifts?sub=Fragrance+Sets" },
            ],
          },
          {
            label: "Mini Sets",
            href: "/gifts?sub=Mini+Sets",
            children: [
              { label: "Trial Size",     href: "/gifts?sub=Mini+Sets" },
              { label: "Sample Kit",     href: "/gifts?sub=Mini+Sets" },
              { label: "Travel Minis",   href: "/gifts?sub=Mini+Sets" },
            ],
          },
        ],
      },
      {
        heading: "Gift Guide",
        items: [
          { label: "Under $25",      href: "/gifts" },
          { label: "Under $50",      href: "/gifts" },
          { label: "Luxury Gifts",   href: "/gifts" },
          { label: "Bestsellers",    href: "/gifts" },
        ],
      },
    ],
    promo: {
      headline: "Give the Gift of Glow.",
      sub:      "Curated sets for every skin story.",
      cta:      "Shop Gifts",
      href:     "/gifts",
      gradient: "from-[#F8ECF0] to-[#FDF5F8]",
    },
  },
};

// ─── Nav items ─────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { label: "New",                href: "/new" },
  { label: "Skincare",           href: "/skincare" },
  { label: "Hair",               href: "/hair" },
  { label: "Fragrance",          href: "/fragrance" },
  { label: "Makeup",             href: "/makeup" },
  { label: "Body",               href: "/body" },
  { label: "Men's Grooming",     href: "/men" },
  { label: "Tools & Brushes",    href: "/tools" },
  { label: "Gifts & Value Sets", href: "/gifts" },
  { label: "Brands",             href: "/brands" },
  { label: "Offers",             href: "/offers" },
  { label: "AI Advisor",         href: "/ai-advisor", highlight: true },
  { label: "Track Order",        href: "/track-order" },
] as const;

function NavItemLabel({ label }: { label: string }) {
  if (label === "AI Advisor") {
    return (
      <span className="inline-flex items-center gap-1.5">
        <span>{label}</span>
        <span className="relative inline-flex h-3.5 w-3.5 items-center justify-center">
          <span className="absolute inset-0 rounded-full bg-[#9055A2]/10 blur-[3px]" />
          <Sparkles
            size={11}
            strokeWidth={1.7}
            className="relative text-[#9055A2] motion-safe:animate-pulse"
          />
        </span>
      </span>
    );
  }

  if (label === "Offers") {
    return (
      <span className="inline-flex items-center gap-1.5">
        <span>{label}</span>
        <span className="rounded-full bg-[#9F2F2F] px-1.5 py-[2px] text-[8px] font-bold uppercase tracking-[0.08em] text-white shadow-[0_4px_12px_rgba(159,47,47,0.22)]">
          SALE
        </span>
      </span>
    );
  }

  return <span>{label}</span>;
}

// ─── Component ─────────────────────────────────────────────────────────────────
export function NavigationBar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileMega, setMobileMega] = useState<string | null>(null);
  const [mobileNested, setMobileNested] = useState<string | null>(null);
  const [activeNav, setActiveNav]   = useState<string | null>(null);
  const [activeNested, setActiveNested] = useState<NestedState>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nestedCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function openMenu(label: string) {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveNested(null);
    setActiveNav(label);
  }
  function scheduleClose() {
    closeTimer.current = setTimeout(() => {
      if (nestedCloseTimer.current) clearTimeout(nestedCloseTimer.current);
      setActiveNested(null);
      setActiveNav(null);
    }, 150);
  }
  function cancelClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }

  function scheduleNestedClose() {
    if (nestedCloseTimer.current) clearTimeout(nestedCloseTimer.current);
    nestedCloseTimer.current = setTimeout(() => setActiveNested(null), 200);
  }

  function cancelNestedClose() {
    if (nestedCloseTimer.current) clearTimeout(nestedCloseTimer.current);
  }

  function openNested(key: string, target: HTMLElement) {
    cancelNestedClose();
    const rect = target.getBoundingClientRect();
    const submenuHeight = 188;
    const placement = rect.bottom + submenuHeight > window.innerHeight ? "up" : "down";
    setActiveNested({ key, placement });
  }

  const activeMega = activeNav ? MEGA[activeNav] ?? null : null;

  return (
    <nav
      className="relative z-40 border-b border-bordergray bg-white"
      onMouseLeave={scheduleClose}
    >
      {/* ── Desktop nav bar (centered) ── */}
      <div className="mx-auto hidden max-w-7xl items-center justify-center px-4 md:flex md:px-6">
        {NAV_ITEMS.map((item) => {
          const hasMega  = !!MEGA[item.label];
          const isActive = activeNav === item.label;

          return (
            <Link
              key={item.label}
              href={item.href}
              onMouseEnter={() => {
                if (closeTimer.current) clearTimeout(closeTimer.current);
                hasMega ? setActiveNav(item.label) : setActiveNav(null);
              }}
              className={`relative whitespace-nowrap px-3.5 py-3 text-[13px] font-medium transition-colors ${
                "highlight" in item && item.highlight
                  ? "text-[#9055A2] hover:text-[#7040A0]"
                  : isActive
                  ? "text-[#111111]"
                  : "text-textgray hover:text-[#111111]"
              }`}
            >
              <NavItemLabel label={item.label} />
              {/* Underline indicator for active mega item */}
              {isActive && hasMega && (
                <span className="absolute bottom-0 left-1/2 h-[2px] w-4 -translate-x-1/2 rounded-full bg-[#111111]" />
              )}
            </Link>
          );
        })}
      </div>

      {/* ── Mega-menu dropdown ── */}
      {activeMega && (
        <div
          className="animate-mega-in origin-top absolute left-0 right-0 top-full z-50 border-b border-bordergray bg-white shadow-[0_12px_40px_rgba(0,0,0,0.07)] will-change-[transform,opacity]"
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
        >
          <div className="mx-auto max-w-7xl px-6 py-8">
            {/* Keyed on the active item so content gently re-animates
                when hovering from one nav item to another */}
            <div
              key={activeNav}
              className="animate-content-swap grid grid-cols-[1fr_1fr_270px] gap-10"
            >

              {/* Link columns */}
              {activeMega.columns.map((col) => (
                <div key={col.heading}>
                  <p className="mb-3.5 text-[11px] font-bold uppercase tracking-[0.15em] text-textgray">
                    {col.heading}
                  </p>
                  <ul className="space-y-0.5">
                    {col.items.map((link) => (
                      <li key={link.label} className="flex items-center gap-1">
                        <Link
                          href={link.href}
                          onClick={() => setActiveNav(null)}
                          className="group flex min-w-0 flex-1 items-center justify-between rounded-lg px-2 py-1.5 text-sm text-textgray transition-colors hover:bg-offwhite hover:text-[#111111]"
                        >
                          <span>{link.label}</span>
                        </Link>
                        {link.children && (
                          <div
                            className="relative"
                            onMouseEnter={(event) =>
                              openNested(`${col.heading}-${link.label}`, event.currentTarget)
                            }
                            onMouseLeave={scheduleNestedClose}
                          >
                            <button
                              type="button"
                              onFocus={(event) =>
                                openNested(`${col.heading}-${link.label}`, event.currentTarget)
                              }
                              className="flex h-8 w-7 items-center justify-center rounded-lg text-textgray transition-colors hover:bg-offwhite hover:text-[#111111]"
                              aria-label={`Open ${link.label} submenu`}
                            >
                              <ChevronRight size={13} />
                            </button>
                            {activeNested?.key === `${col.heading}-${link.label}` && (
                              <div
                                onMouseEnter={cancelNestedClose}
                                onMouseLeave={scheduleNestedClose}
                                className={`absolute left-full z-50 w-52 origin-left rounded-2xl border border-[#ECECEC] bg-white/95 p-2 shadow-[0_18px_50px_rgba(17,17,17,0.13)] backdrop-blur animate-menu-in will-change-[transform,opacity] before:absolute before:-left-3 before:top-0 before:h-full before:w-3 before:content-[''] ${
                                  activeNested.placement === "up" ? "bottom-0" : "top-0"
                                }`}
                              >
                                <div className="mb-1 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-textgray">
                                  {link.label}
                                </div>
                                <ul className="space-y-0.5">
                                  {link.children.map((child) => (
                                    <li key={child.label}>
                                      <Link
                                        href={child.href}
                                        onClick={() => {
                                          if (nestedCloseTimer.current) clearTimeout(nestedCloseTimer.current);
                                          setActiveNested(null);
                                          setActiveNav(null);
                                        }}
                                        className="block rounded-xl px-3 py-2 text-[13px] text-textgray transition-colors hover:bg-offwhite hover:text-[#111111]"
                                      >
                                        {child.label}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {/* Promo card */}
              <div
                className={`flex flex-col justify-between rounded-[20px] bg-gradient-to-br p-6 ${activeMega.promo.gradient}`}
              >
                <div>
                  <p className="font-serif text-xl font-normal text-[#111111]">
                    {activeMega.promo.headline}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-textgray">
                    {activeMega.promo.sub}
                  </p>
                </div>
                <Link
                  href={activeMega.promo.href}
                  onClick={() => setActiveNav(null)}
                  className="mt-5 inline-flex w-fit items-center gap-1.5 rounded-full bg-[#111111] px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-80"
                >
                  {activeMega.promo.cta}
                  <ChevronRight size={12} />
                </Link>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ── Mobile toggle ── */}
      <div className="flex items-center justify-between px-4 py-2.5 md:hidden">
        <span className="text-sm font-medium text-textdark">Browse</span>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-textgray hover:text-textdark"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* ── Mobile dropdown ── */}
      {mobileOpen && (
        <div className="border-t border-bordergray bg-white px-4 pb-4 md:hidden">
          {NAV_ITEMS.map((item) => {
            const mega = MEGA[item.label];
            const isMegaOpen = mobileMega === item.label;

            if (!mega) {
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block py-2.5 text-sm font-medium ${
                    "highlight" in item && item.highlight
                      ? "text-[#9055A2]"
                      : "text-textgray hover:text-textdark"
                  }`}
                >
                  <NavItemLabel label={item.label} />
                </Link>
              );
            }

            return (
              <div key={item.label} className="border-b border-[#F3F3F3] last:border-b-0">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMega(isMegaOpen ? null : item.label);
                    setMobileNested(null);
                  }}
                  className="flex w-full items-center justify-between py-2.5 text-left text-sm font-medium text-textgray"
                  aria-expanded={isMegaOpen}
                >
                  <NavItemLabel label={item.label} />
                  <ChevronDown
                    size={15}
                    className={`transition-transform ${isMegaOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isMegaOpen && (
                  <div className="animate-menu-in pb-3">
                    {mega.columns.map((col) => (
                      <div key={col.heading} className="pt-2">
                        <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-textgray">
                          {col.heading}
                        </p>
                        <ul className="space-y-0.5">
                          {col.items.map((link) => {
                            const nestedKey = `${item.label}-${col.heading}-${link.label}`;
                            const isNestedOpen = mobileNested === nestedKey;

                            return (
                              <li key={link.label}>
                                <div className="flex items-center gap-1">
                                  <Link
                                    href={link.href}
                                    onClick={() => setMobileOpen(false)}
                                    className="block flex-1 rounded-lg px-2.5 py-2 text-[13px] text-textgray hover:bg-offwhite hover:text-[#111111]"
                                  >
                                    {link.label}
                                  </Link>
                                  {link.children && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setMobileNested(isNestedOpen ? null : nestedKey)
                                      }
                                      className="flex h-8 w-8 items-center justify-center rounded-lg text-textgray hover:bg-offwhite hover:text-[#111111]"
                                      aria-label={`Toggle ${link.label} submenu`}
                                      aria-expanded={isNestedOpen}
                                    >
                                      <ChevronDown
                                        size={14}
                                        className={`transition-transform ${
                                          isNestedOpen ? "rotate-180" : ""
                                        }`}
                                      />
                                    </button>
                                  )}
                                </div>

                                {link.children && isNestedOpen && (
                                  <ul className="animate-menu-in ml-3 mt-1 space-y-0.5 rounded-xl border border-[#F0F0F0] bg-offwhite/70 p-1.5">
                                    {link.children.map((child) => (
                                      <li key={child.label}>
                                        <Link
                                          href={child.href}
                                          onClick={() => setMobileOpen(false)}
                                          className="block rounded-lg px-3 py-1.5 text-[12px] text-textgray hover:bg-white hover:text-[#111111]"
                                        >
                                          {child.label}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </nav>
  );
}
