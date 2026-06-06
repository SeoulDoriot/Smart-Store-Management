"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, Heart, ShoppingBag } from "lucide-react";
import type { Product } from "@/types/product";
import { formatPrice } from "@/lib/utils";
import { getBrandName } from "@/lib/products";

function ProductBadge({ product }: { product: Product }) {
  if (product.stock === 0)
    return (
      <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-500">
        Out of Stock
      </span>
    );
  if (product.stock <= 3)
    return (
      <span className="rounded-full bg-yellow-50 px-2.5 py-0.5 text-xs text-yellow-700 border border-yellow-200">
        Low Stock
      </span>
    );
  if (product.is_best_seller)
    return (
      <span className="rounded-full bg-softgreen px-2.5 py-0.5 text-xs text-green-700 border border-green-200">
        Best Seller
      </span>
    );
  if (product.is_hot_sale)
    return (
      <span className="rounded-full bg-softpink px-2.5 py-0.5 text-xs text-pink-700 border border-pink-200">
        Hot Sale
      </span>
    );
  if (product.is_new_arrival)
    return (
      <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs text-blue-700 border border-blue-200">
        New Arrival
      </span>
    );
  return null;
}

export function ProductCard({
  product,
  index = 0,
}: {
  product: Product;
  index?: number;
}) {
  const brandName = getBrandName(product.brand_id);
  const isOutOfStock = product.stock === 0;
  const [wishlisted, setWishlisted] = useState(false);

  return (
    <div
      className={`reveal-up stagger-${(index % 5) + 1} group flex flex-col overflow-hidden rounded-card border border-bordergray bg-white shadow-sm transition-all duration-500 ease-out md:hover:-translate-y-1 md:hover:border-[#E8E2DA] md:hover:shadow-[0_24px_80px_rgba(17,17,17,0.13)]`}
    >
      {/* Image */}
      <div className="relative overflow-hidden rounded-t-card bg-white">
        <div className="relative flex aspect-square w-full items-center justify-center bg-gradient-to-br from-white via-[#FCF8F3] to-[#F1E8DD]">
          <div className="absolute left-1/2 top-[48%] h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/80 blur-2xl transition-all duration-500 ease-out md:group-hover:scale-125 md:group-hover:bg-white" />
          <div className="absolute bottom-[18%] left-1/2 h-7 w-28 -translate-x-1/2 rounded-full bg-[#111]/10 blur-md transition-all duration-500 ease-out md:group-hover:w-32 md:group-hover:bg-[#111]/14" />
          <div className="relative z-[1] flex h-[76%] w-[80%] items-center justify-center transition-transform duration-500 ease-out md:group-hover:-translate-y-3 md:group-hover:scale-110">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="h-full w-full object-contain drop-shadow-[0_18px_24px_rgba(17,17,17,0.16)]"
                loading="lazy"
              />
            ) : (
              <span
                className="select-none font-serif text-7xl font-light text-[#111]/10"
                aria-hidden="true"
              >
                {brandName.slice(0, 2).toUpperCase()}
              </span>
            )}
          </div>
        </div>
        <div className="absolute left-3 top-3">
          <ProductBadge product={product} />
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setWishlisted(!wishlisted);
          }}
          className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/82 shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:shadow-md"
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            size={15}
            className={
              wishlisted
                ? "fill-red-500 text-red-500"
                : "text-[#999] transition-colors md:group-hover:text-[#666]"
            }
          />
        </button>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex gap-1.5 p-3">
          <Link
            href={`/products/${product.id}`}
            className="pointer-events-none flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-white/90 text-[11px] font-semibold text-[#111] opacity-0 shadow-sm backdrop-blur-sm transition-all duration-300 ease-out hover:bg-white md:pointer-events-auto md:translate-y-1 md:group-hover:translate-y-0 md:group-hover:opacity-100"
          >
            <Eye size={13} />
            Quick Look
          </Link>
          <Link
            href={isOutOfStock ? `/products/${product.id}` : `/order?product=${product.id}`}
            className="pointer-events-none flex h-9 flex-1 translate-y-4 items-center justify-center gap-1.5 rounded-lg bg-[#111]/90 text-[11px] font-semibold text-white opacity-0 shadow-sm backdrop-blur-sm transition-all duration-500 ease-out hover:bg-[#111] md:pointer-events-auto md:group-hover:translate-y-0 md:group-hover:opacity-100"
          >
            <ShoppingBag size={13} />
            Add to Bag
          </Link>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <p className="text-xs text-textgray">{brandName}</p>
          <h3 className="mt-0.5 text-sm font-medium leading-snug text-textdark line-clamp-2">
            {product.name}
          </h3>
        </div>

        {/* Skin concerns */}
        {product.skin_concerns.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {product.skin_concerns.slice(0, 2).map((c) => (
              <span
                key={c}
                className="rounded-full bg-offwhite px-2 py-0.5 text-xs text-textgray"
              >
                {c}
              </span>
            ))}
          </div>
        )}

        {/* Price + Stock */}
        <div className="flex items-center justify-between">
          <p className="text-base font-semibold text-textdark">
            {formatPrice(product.price)}
          </p>
          <p className={`text-xs ${isOutOfStock ? "text-red-500" : "text-green-600"}`}>
            {isOutOfStock ? "Out of Stock" : `${product.stock} left`}
          </p>
        </div>

        {/* Actions */}
        <div className="mt-auto flex gap-2">
          <Link
            href={`/products/${product.id}`}
            className="motion-press flex-1 rounded-xl border border-bordergray py-2 text-center text-xs font-medium text-textgray transition-colors hover:border-textdark hover:text-textdark"
          >
            View Detail
          </Link>
          <Link
            href={`/order?product=${product.id}`}
            className={`motion-press flex-1 rounded-xl py-2 text-center text-xs font-medium transition-opacity ${
              isOutOfStock
                ? "cursor-not-allowed bg-gray-100 text-gray-400"
                : "bg-textdark text-white hover:opacity-80"
            }`}
          >
            Order
          </Link>
        </div>
      </div>
    </div>
  );
}
