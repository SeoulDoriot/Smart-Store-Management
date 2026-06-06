"use client";

import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { useStore } from "@/lib/store";
import { HomeProductCard } from "@/components/home/HomeProductCard";
import type { Product, Brand } from "@/types/product";

type Props = { products: Product[]; brands: Brand[] };

export function WishlistClient({ products, brands }: Props) {
  const { wishlist, wishlistCount, toggleWishlist, addToCart } = useStore();

  function brandOf(brandId: string) {
    return brands.find((b) => b.id === brandId)?.name ?? "";
  }

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  // ── Empty state ──────────────────────────────────────────────────────────────
  if (wishlistProducts.length === 0) {
    return (
      <main className="min-h-[60vh] bg-[#FAFAF7]">
        <div className="mx-auto flex max-w-lg flex-col items-center justify-center px-4 py-24 text-center">
          <div className="reveal-soft mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#FDECEA]">
            <Heart size={26} className="text-red-300" />
          </div>
          <h2 className="font-serif text-2xl font-normal text-[#111111]">
            Your wishlist is empty
          </h2>
          <p className="mt-2 text-sm text-textgray">
            Tap the heart on any product to save it here for later.
          </p>
          <Link
            href="/products"
            className="motion-press mt-6 inline-flex items-center gap-2 rounded-full bg-[#111111] px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-80"
          >
            Browse Products
          </Link>
        </div>
      </main>
    );
  }

  // ── Filled wishlist ──────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-[#FAFAF7]">
      <div className="mx-auto max-w-5xl px-4 py-8 md:px-6">

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="font-serif text-2xl font-normal text-[#111111]">
            Wishlist{" "}
            <span className="font-sans text-base text-textgray">
              ({wishlistCount} {wishlistCount === 1 ? "item" : "items"})
            </span>
          </h1>
          <Link
            href="/products"
            className="text-xs font-medium text-textgray transition-colors hover:text-[#111111]"
          >
            Browse more
          </Link>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {wishlistProducts.map((p, i) => {
            const brand = brandOf(p.brand_id);
            return (
              <div key={p.id} className="group relative">
                {/* Product card */}
                <HomeProductCard product={p} brandName={brand} index={i} />

                {/* Actions overlay — sits outside the Link so clicks don't navigate */}
                <div className="absolute right-4 top-4 z-10 flex flex-col gap-1.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  {/* Remove from wishlist */}
                  <button
                    onClick={() => toggleWishlist(p.id)}
                    aria-label="Remove from wishlist"
                    className="motion-press flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-red-400 shadow-sm backdrop-blur-sm transition-colors hover:bg-white"
                  >
                    <Heart size={14} fill="currentColor" />
                  </button>
                  {/* Add to cart */}
                  <button
                    onClick={() => addToCart(p.id)}
                    aria-label="Add to bag"
                    disabled={p.stock === 0}
                    className="motion-press flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#111111] shadow-sm backdrop-blur-sm transition-colors hover:bg-white disabled:opacity-40"
                  >
                    <ShoppingBag size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 flex justify-center">
          <Link
            href="/cart"
            className="motion-press inline-flex items-center gap-2 rounded-full border border-[#111111]/15 bg-white px-6 py-3 text-sm font-medium text-[#111111] transition-colors hover:border-[#111111]/30 hover:bg-[#FAFAF7]"
          >
            <ShoppingBag size={15} />
            View My Bag
          </Link>
        </div>

      </div>
    </main>
  );
}
