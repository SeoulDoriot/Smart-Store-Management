"use client";

import Link from "next/link";
import { Heart, Minus, Plus, ShoppingBag, Sparkles } from "lucide-react";
import { useState } from "react";
import { useStore } from "@/lib/store";

type Props = {
  productId: string;
  isOutOfStock: boolean;
  orderHref: string;
};

export function ProductActions({ productId, isOutOfStock, orderHref }: Props) {
  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const [qty, setQty]     = useState(1);
  const [added, setAdded] = useState(false);

  const wishlisted = isWishlisted(productId);

  function handleAddToBag() {
    if (isOutOfStock) return;
    addToCart(productId, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  }

  return (
    <div className="mt-5 space-y-3">

      {/* ── Qty stepper + wishlist ── */}
      <div className="flex items-center gap-3">
        {/* Stepper */}
        <div className="flex items-center rounded-full border border-[#EBEBEB] bg-[#FAFAF7]">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={isOutOfStock || qty <= 1}
            className="flex h-10 w-10 items-center justify-center text-textgray transition-colors hover:text-[#111111] disabled:opacity-30"
            aria-label="Decrease quantity"
          >
            <Minus size={14} />
          </button>
          <span className="w-8 text-center text-sm font-semibold text-[#111111]">
            {qty}
          </span>
          <button
            onClick={() => setQty((q) => Math.min(10, q + 1))}
            disabled={isOutOfStock || qty >= 10}
            className="flex h-10 w-10 items-center justify-center text-textgray transition-colors hover:text-[#111111] disabled:opacity-30"
            aria-label="Increase quantity"
          >
            <Plus size={14} />
          </button>
        </div>

        {/* Wishlist heart */}
        <button
          onClick={() => toggleWishlist(productId)}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all ${
            wishlisted
              ? "border-red-200 bg-red-50 text-red-500"
              : "border-[#EBEBEB] bg-[#FAFAF7] text-textgray hover:border-red-100 hover:text-red-400"
          }`}
        >
          <Heart size={16} fill={wishlisted ? "currentColor" : "none"} />
        </button>

        {wishlisted && (
          <span className="text-[11px] font-medium text-red-400">Saved!</span>
        )}
      </div>

      {/* ── Add to Bag ── */}
      <button
        onClick={handleAddToBag}
        disabled={isOutOfStock}
        className={`flex h-[52px] w-full items-center justify-center gap-2 rounded-full text-sm font-semibold transition-all ${
          isOutOfStock
            ? "cursor-not-allowed bg-[#EEEEEE] text-[#AAAAAA]"
            : added
            ? "bg-green-600 text-white"
            : "bg-[#111111] text-white hover:opacity-80"
        }`}
      >
        <ShoppingBag size={15} />
        {isOutOfStock
          ? "Out of Stock"
          : added
          ? "Added to Bag ✓"
          : qty > 1
          ? `Add ${qty} to Bag`
          : "Add to Bag"}
      </button>

      {/* ── Order Now ── */}
      <Link
        href={orderHref}
        aria-disabled={isOutOfStock}
        tabIndex={isOutOfStock ? -1 : undefined}
        className={`flex h-11 w-full items-center justify-center gap-2 rounded-full border text-sm font-medium transition-colors ${
          isOutOfStock
            ? "pointer-events-none border-[#EEEEEE] text-[#AAAAAA]"
            : "border-[#111111]/20 bg-white text-[#111111] hover:border-[#111111]/35 hover:bg-[#FAFAF7]"
        }`}
      >
        Order Now
      </Link>

      {/* ── Ask AI ── */}
      <Link
        href="/ai-advisor"
        className="flex h-10 w-full items-center justify-center gap-1.5 rounded-full text-xs font-medium text-textgray transition-colors hover:text-[#111111]"
      >
        <Sparkles size={12} className="text-[#9055A2]" />
        Ask AI About This Product
      </Link>

    </div>
  );
}
