"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Eye, Layers, ShoppingBag, Sparkles } from "lucide-react";
import { MOCK_PRODUCTS } from "@/lib/mock-data";
import { getBrandName } from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types/product";

const SHELVES = [
  {
    id: "morning",
    label: "Morning Routine",
    eyebrow: "Cleanse. Balance. Protect.",
    description: "Fresh, breathable skincare for the first layer of the day.",
    productIds: ["p2", "p1", "p3", "p9"],
    gradient: "from-[#F7EFE3] to-[#FFFDFC]",
    accent: "text-[#8A602D]",
  },
  {
    id: "night",
    label: "Night Recovery",
    eyebrow: "Repair while skin rests.",
    description: "Comforting formulas for barrier support and overnight glow.",
    productIds: ["p8", "p4", "p6", "p10"],
    gradient: "from-[#ECE7F7] to-[#FFFDFC]",
    accent: "text-[#5C4A8A]",
  },
  {
    id: "clarity",
    label: "Clear Skin Shelf",
    eyebrow: "Calm. Clarify. Refine.",
    description: "Targeted picks for oil control, pores, and breakouts.",
    productIds: ["p2", "p5", "p7", "p1"],
    gradient: "from-[#E6F1EA] to-[#FFFDFC]",
    accent: "text-[#416F55]",
  },
] as const;

const CARD_GRADIENTS = [
  "from-[#EFD6CF] to-[#C68F83]",
  "from-[#DCEBE4] to-[#8EB5A2]",
  "from-[#E7E0F5] to-[#A69AD8]",
  "from-[#F0DDC6] to-[#C1976F]",
];

function getShelfProducts(ids: readonly string[]) {
  return ids
    .map((id) => MOCK_PRODUCTS.find((product) => product.id === id))
    .filter((product): product is Product => Boolean(product));
}

function brandInitial(brandName: string) {
  const words = brandName.trim().split(/\s+/);
  return words.length === 1
    ? words[0].slice(0, 2).toUpperCase()
    : words.slice(0, 2).map((word) => word[0]).join("").toUpperCase();
}

function ShelfProductRow({
  product,
  index,
}: {
  product: Product;
  index: number;
}) {
  const [open, setOpen] = useState(false);
  const brandName = getBrandName(product.brand_id);
  const gradient = CARD_GRADIENTS[index % CARD_GRADIENTS.length];
  const quickInfoVisible = open ? "max-md:grid" : "max-md:hidden";

  return (
    <article className="group rounded-[28px] border border-[#ECE8E3] bg-white p-3 shadow-[0_18px_45px_rgba(17,17,17,0.05)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_60px_rgba(17,17,17,0.08)]">
      <div className="grid gap-4 md:grid-cols-[180px_minmax(0,1fr)_180px] md:items-center">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className={`relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[22px] bg-gradient-to-b ${gradient} text-left md:aspect-square`}
          aria-label={`Quick view ${product.name}`}
        >
          <span className="select-none font-serif text-7xl font-light text-white/25">
            {brandInitial(brandName)}
          </span>
          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/[0.84] px-3 py-1.5 text-[11px] font-semibold text-[#111111] shadow-sm backdrop-blur">
            <Eye size={12} />
            Quick view
          </span>
        </button>

        <div className="px-1 md:px-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-textgray">
            {brandName}
          </p>
          <h2 className="mt-2 font-serif text-2xl leading-tight tracking-[-0.02em] text-[#111111]">
            {product.name}
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-textgray">
            {product.main_benefit ?? product.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {product.skin_concerns.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[#F7F4F1] px-2.5 py-1 text-[11px] font-medium text-textgray"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="grid gap-2">
          <div className="flex items-center justify-between rounded-2xl bg-[#FAFAF7] px-4 py-3 md:block">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-textgray">
              Price
            </p>
            <p className="mt-0 text-lg font-bold text-[#111111] md:mt-1">
              {formatPrice(product.price)}
            </p>
          </div>
          <Link
            href={`/products/${product.id}`}
            className="inline-flex h-10 items-center justify-center rounded-full border border-[#E5E1DC] bg-white px-4 text-sm font-semibold text-[#111111] transition hover:border-[#111111]/30 hover:bg-[#FAFAF7]"
          >
            View Detail
          </Link>
          <Link
            href={`/order?product=${product.id}`}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#111111] px-4 text-sm font-semibold text-white transition hover:opacity-85"
          >
            <ShoppingBag size={15} />
            Order Now
          </Link>
        </div>
      </div>

      <div
        className={`${quickInfoVisible} mt-3 gap-3 rounded-[22px] bg-[#FAFAF7] p-4 text-sm text-textgray md:grid md:grid-cols-3 md:opacity-0 md:transition-opacity md:duration-300 md:group-hover:opacity-100`}
      >
        <div>
          <p className="font-semibold text-[#111111]">How it helps</p>
          <p className="mt-1 leading-5">{product.main_benefit}</p>
        </div>
        <div>
          <p className="font-semibold text-[#111111]">Skin type</p>
          <p className="mt-1 leading-5">{product.skin_types.join(", ")}</p>
        </div>
        <div>
          <p className="font-semibold text-[#111111]">Stock</p>
          <p className="mt-1 leading-5">{product.stock > 0 ? `${product.stock} available` : "Out of stock"}</p>
        </div>
      </div>
    </article>
  );
}

export default function DigitalShelfPage() {
  const [activeShelfId, setActiveShelfId] = useState<(typeof SHELVES)[number]["id"]>("morning");
  const activeShelf = SHELVES.find((shelf) => shelf.id === activeShelfId) ?? SHELVES[0];
  const products = useMemo(() => getShelfProducts(activeShelf.productIds), [activeShelf]);

  return (
    <main className={`min-h-screen bg-gradient-to-br ${activeShelf.gradient} px-4 py-10 transition-colors duration-500 md:px-6 md:py-16`}>
      <section className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/[0.78] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-textgray shadow-sm backdrop-blur">
              <Layers size={14} />
              Digital Shelf
            </div>
            <h1 className="font-serif text-5xl font-normal tracking-[-0.05em] text-[#111111] md:text-7xl">
              Curated shelves for every skin moment.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-textgray md:text-lg">
              Browse routine-ready product rows, reveal quick info, and move from discovery to order in one soft flow.
            </p>
          </div>

          <div className="rounded-[32px] border border-white/[0.75] bg-white/[0.72] p-5 shadow-[0_24px_70px_rgba(17,17,17,0.07)] backdrop-blur">
            <p className={`text-sm font-bold uppercase tracking-[0.22em] ${activeShelf.accent}`}>
              {activeShelf.eyebrow}
            </p>
            <p className="mt-3 font-serif text-3xl text-[#111111]">{activeShelf.label}</p>
            <p className="mt-2 text-sm leading-6 text-textgray">{activeShelf.description}</p>
          </div>
        </div>

        <div className="mt-10 overflow-x-auto pb-2">
          <div className="flex min-w-max gap-2 rounded-full bg-white/[0.72] p-1.5 shadow-sm backdrop-blur">
            {SHELVES.map((shelf) => (
              <button
                key={shelf.id}
                type="button"
                onClick={() => setActiveShelfId(shelf.id)}
                className={`h-11 rounded-full px-5 text-sm font-semibold transition ${
                  shelf.id === activeShelfId
                    ? "bg-[#111111] text-white shadow-[0_12px_24px_rgba(17,17,17,0.16)]"
                    : "text-textgray hover:bg-white hover:text-[#111111]"
                }`}
              >
                {shelf.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-4">
          {products.map((product, index) => (
            <ShelfProductRow key={product.id} product={product} index={index} />
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/products"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#111111] px-7 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(17,17,17,0.16)] transition hover:opacity-85"
          >
            Browse full catalog
            <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </main>
  );
}
