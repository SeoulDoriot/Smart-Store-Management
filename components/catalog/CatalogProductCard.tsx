"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Eye, ShoppingBag } from "lucide-react";
import type { Product } from "@/types/product";
import { formatPrice } from "@/lib/utils";

/* ── Soft product-stage palette (same as HomeProductCard) ── */
const GRADIENTS = [
  "from-white via-[#FBF8F4] to-[#F1E7DF]",
  "from-white via-[#F7FBF9] to-[#E5F2EC]",
  "from-white via-[#FAF8FF] to-[#ECE8FA]",
  "from-white via-[#FCF8F3] to-[#F1E8DD]",
  "from-white via-[#F7FAFD] to-[#E5EFF7]",
];

function getBrandInitial(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return words.slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

function fmtCount(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

export function CatalogProductCard({
  product,
  brandName,
  index = 0,
}: {
  product: Product;
  brandName: string;
  index?: number;
}) {
  const [wishlisted, setWishlisted] = useState(false);
  const gradient = GRADIENTS[index % GRADIENTS.length];
  const initial = getBrandInitial(brandName);
  const isSale = !!product.original_price;
  const isNew = product.is_new_arrival && !product.is_hot_sale;
  const filledStars = product.rating ? Math.round(product.rating) : 0;
  const outOfStock = product.stock <= 0;

  return (
    <div className="group relative">
      <Link
        href={`/products/${product.id}`}
        className="block"
      >
        {/* ── Card wrapper ── */}
        <div className="catalog-card flex flex-col overflow-hidden rounded-2xl border border-[#F0F0F0] bg-white shadow-sm transition-all duration-500 ease-out md:hover:-translate-y-1 md:hover:border-[#E8E2DA] md:hover:shadow-[0_22px_70px_rgba(17,17,17,0.12)]">

          {/* ── Image area ── */}
          <div className="relative aspect-[4/5] overflow-hidden bg-white">
            <div
              className={`flex h-full w-full items-center justify-center bg-gradient-to-b ${gradient}`}
            >
              <div className="absolute left-1/2 top-[48%] h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/80 blur-2xl transition-all duration-500 ease-out md:group-hover:scale-125 md:group-hover:bg-white" />
              <div className="absolute bottom-[19%] left-1/2 h-7 w-28 -translate-x-1/2 rounded-full bg-[#111]/10 blur-md transition-all duration-500 ease-out md:group-hover:w-32 md:group-hover:bg-[#111]/14" />
              <div className="relative z-[1] flex h-[74%] w-[78%] items-center justify-center transition-transform duration-500 ease-out md:group-hover:-translate-y-3 md:group-hover:scale-110">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="h-full w-full object-contain drop-shadow-[0_18px_24px_rgba(17,17,17,0.16)]"
                    loading="lazy"
                  />
                ) : (
                  <span
                    className="select-none font-serif text-7xl font-light text-[#111]/10 md:text-8xl"
                    aria-hidden="true"
                  >
                    {initial}
                  </span>
                )}
              </div>
            </div>

            {/* Badge */}
            {isSale ? (
              <span className="absolute left-2.5 top-2.5 z-10 rounded-full bg-red-500 px-2 py-[3px] text-[9px] font-bold uppercase tracking-wider text-white">
                SALE
              </span>
            ) : isNew ? (
              <span className="absolute left-2.5 top-2.5 z-10 rounded-full bg-emerald-500 px-2 py-[3px] text-[9px] font-bold uppercase tracking-wider text-white">
                NEW
              </span>
            ) : null}

            {/* ── Hover overlay actions ── */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 md:opacity-100">
              <div className="flex gap-1.5 p-2.5">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    /* TODO: quicklook modal */
                  }}
                  className="pointer-events-none flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-white/90 text-[11px] font-semibold text-[#111] opacity-0 shadow-sm backdrop-blur-sm transition-all duration-300 ease-out hover:bg-white md:pointer-events-auto md:translate-y-1 md:group-hover:translate-y-0 md:group-hover:opacity-100"
                >
                  <Eye size={13} />
                  Quick Look
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    /* TODO: add to bag */
                  }}
                  className="pointer-events-none flex h-9 flex-1 translate-y-4 items-center justify-center gap-1.5 rounded-lg bg-[#111]/90 text-[11px] font-semibold text-white opacity-0 shadow-sm backdrop-blur-sm transition-all duration-500 ease-out hover:bg-[#111] md:pointer-events-auto md:group-hover:translate-y-0 md:group-hover:opacity-100"
                >
                  <ShoppingBag size={13} />
                  Add to Bag
                </button>
              </div>
            </div>
          </div>

          {/* ── Info section ── */}
          <div className="flex flex-1 flex-col px-3 pb-3 pt-2.5">
            {/* Brand */}
            <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#999]">
              {brandName}
            </p>

            {/* Name */}
            <p className="mt-1 line-clamp-2 min-h-[40px] font-serif text-[13px] font-normal leading-snug text-[#111]">
              {product.name}
            </p>

            {/* Price row */}
            <div className="mt-auto flex items-baseline gap-1.5 pt-2">
              <span className="text-[14px] font-bold text-[#111]">
                {formatPrice(product.price)}
              </span>
              {isSale && product.original_price && (
                <span className="text-[11px] text-[#AAAAAA] line-through">
                  {formatPrice(product.original_price)}
                </span>
              )}
            </div>

            {/* Stars + stock */}
            <div className="mt-1.5 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <div className="flex gap-px">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span
                      key={s}
                      className={`text-[10px] leading-none ${
                        s <= filledStars ? "text-amber-400" : "text-[#E0E0E0]"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                {product.review_count != null && (
                  <span className="text-[9px] text-[#AAAAAA]">
                    ({fmtCount(product.review_count)})
                  </span>
                )}
              </div>
              {outOfStock && (
                <span className="text-[10px] font-medium text-red-400">
                  Out of Stock
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>

      {/* ── Wishlist heart (always visible, top-right) ── */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setWishlisted(!wishlisted);
        }}
        className="absolute right-2.5 top-2.5 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:shadow-md"
        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart
          size={15}
          className={
            wishlisted
              ? "fill-red-500 text-red-500"
              : "text-[#999] transition-colors group-hover:text-[#666]"
          }
        />
      </button>
    </div>
  );
}
