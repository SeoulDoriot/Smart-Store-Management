"use client";

import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, ChevronRight } from "lucide-react";
import { useStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import type { Product, Brand } from "@/types/product";

const GRADIENTS = [
  "from-[#EDD0CA] to-[#B8877E]",
  "from-[#C4DAD2] to-[#7EAB9C]",
  "from-[#CEC7EE] to-[#9082C8]",
  "from-[#EAD8C5] to-[#B8906A]",
  "from-[#BDD2E8] to-[#6E9EC0]",
];

type Props = { products: Product[]; brands: Brand[] };

export function CartClient({ products, brands }: Props) {
  const { cart, cartCount, removeFromCart, updateQty } = useStore();

  function brandOf(brandId: string) {
    return brands.find((b) => b.id === brandId)?.name ?? "";
  }

  const cartItems = cart
    .map((item) => {
      const product = products.find((p) => p.id === item.id);
      return product ? { product, qty: item.qty } : null;
    })
    .filter((x): x is { product: Product; qty: number } => x !== null);

  const subtotal     = cartItems.reduce((s, { product, qty }) => s + product.price * qty, 0);
  const deliveryCost = subtotal >= 30 ? 0 : 3;
  const total        = subtotal + deliveryCost;

  // ── Empty state ──────────────────────────────────────────────────────────────
  if (cartItems.length === 0) {
    return (
      <main className="min-h-[60vh] bg-[#FAFAF7]">
        <div className="mx-auto flex max-w-lg flex-col items-center justify-center px-4 py-24 text-center">
          <div className="reveal-soft mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#F0F0F0]">
            <ShoppingBag size={26} className="text-textgray" />
          </div>
          <h2 className="font-serif text-2xl font-normal text-[#111111]">
            Your bag is empty
          </h2>
          <p className="mt-2 text-sm text-textgray">
            Add products from the shop and they&apos;ll appear here.
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

  // ── Filled cart ──────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-[#FAFAF7]">
      <div className="mx-auto max-w-5xl px-4 py-8 md:px-6">

        {/* Back */}
        <Link
          href="/products"
          className="mb-6 flex w-fit items-center gap-1.5 text-sm text-textgray transition-colors hover:text-[#111111]"
        >
          <ArrowLeft size={14} />
          Continue Shopping
        </Link>

        {/* Title */}
        <h1 className="mb-6 font-serif text-2xl font-normal text-[#111111]">
          My Bag{" "}
          <span className="font-sans text-base text-textgray">
            ({cartCount} {cartCount === 1 ? "item" : "items"})
          </span>
        </h1>

        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">

          {/* ── Cart items ── */}
          <div className="space-y-3">
            {cartItems.map(({ product, qty }) => {
              const gradient =
                GRADIENTS[product.id.charCodeAt(product.id.length - 1) % GRADIENTS.length];
              const brand = brandOf(product.brand_id);

              return (
                <div
                  key={product.id}
                  className="motion-card reveal-up flex gap-4 rounded-[20px] border border-[#F0F0F0] bg-white p-4 shadow-sm"
                >
                  {/* Image */}
                  <Link href={`/products/${product.id}`} className="shrink-0">
                    <div
                      className={`h-[88px] w-[88px] rounded-[14px] bg-gradient-to-b ${gradient} flex items-center justify-center`}
                    >
                      <span className="select-none font-serif text-2xl font-light text-white/25">
                        {brand.slice(0, 1)}
                      </span>
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-textgray">
                        {brand}
                      </p>
                      <Link href={`/products/${product.id}`}>
                        <p className="mt-0.5 line-clamp-2 font-serif text-[15px] font-normal leading-snug text-[#111111] hover:underline">
                          {product.name}
                        </p>
                      </Link>
                      <p className="mt-1 text-xs text-textgray">
                        {formatPrice(product.price)} each
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Qty stepper */}
                      <div className="flex items-center rounded-full border border-[#EBEBEB] bg-[#FAFAF7]">
                        <button
                          onClick={() => updateQty(product.id, qty - 1)}
                          disabled={qty <= 1}
                          aria-label="Decrease quantity"
                          className="motion-press flex h-8 w-8 items-center justify-center text-textgray transition-colors hover:text-[#111111] disabled:opacity-30"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-7 text-center text-sm font-semibold text-[#111111]">
                          {qty}
                        </span>
                        <button
                          onClick={() => updateQty(product.id, qty + 1)}
                          disabled={qty >= 10}
                          aria-label="Increase quantity"
                          className="motion-press flex h-8 w-8 items-center justify-center text-textgray transition-colors hover:text-[#111111] disabled:opacity-30"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      {/* Line total + remove */}
                      <div className="flex items-center gap-3">
                        <p className="font-serif text-lg font-normal text-[#111111]">
                          {formatPrice(product.price * qty)}
                        </p>
                        <button
                          onClick={() => removeFromCart(product.id)}
                          aria-label={`Remove ${product.name}`}
                          className="motion-press flex h-8 w-8 items-center justify-center rounded-full text-textgray transition-colors hover:bg-red-50 hover:text-red-400"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Order summary ── */}
          <div className="space-y-3">

            {/* Summary card */}
            <div className="premium-surface reveal-up rounded-[20px] p-5">
              <h2 className="mb-4 font-serif text-lg font-normal text-[#111111]">
                Order Summary
              </h2>

              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-textgray">Subtotal</span>
                  <span className="text-[#111111]">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-textgray">Delivery</span>
                  <span
                    className={
                      deliveryCost === 0
                        ? "font-medium text-green-600"
                        : "text-[#111111]"
                    }
                  >
                    {deliveryCost === 0 ? "Free" : formatPrice(deliveryCost)}
                  </span>
                </div>
              </div>

              {/* Free delivery nudge */}
              {subtotal < 30 && (
                <div className="mt-3 rounded-[10px] bg-[#FFF7E0] px-3 py-2">
                  <p className="text-[11px] text-yellow-700">
                    Add{" "}
                    <span className="font-semibold">
                      {formatPrice(30 - subtotal)}
                    </span>{" "}
                    more for free delivery
                  </p>
                </div>
              )}

              {/* Total */}
              <div className="mt-4 flex items-baseline justify-between border-t border-[#F0F0F0] pt-3">
                <span className="text-sm font-semibold text-[#111111]">Total</span>
                <span className="font-serif text-xl font-normal text-[#111111]">
                  {formatPrice(total)}
                </span>
              </div>

              {/* CTAs */}
              <div className="mt-5 space-y-2.5">
                <Link
                  href="/order"
                  className="motion-press flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-[#111111] text-sm font-semibold text-white transition-opacity hover:opacity-80"
                >
                  Continue to Order
                  <ChevronRight size={14} />
                </Link>
                <Link
                  href="/products"
                  className="motion-press flex h-11 w-full items-center justify-center rounded-full border border-[#111111]/15 bg-white text-sm font-medium text-[#111111] transition-colors hover:border-[#111111]/30 hover:bg-[#FAFAF7]"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* Delivery estimate */}
            <div className="reveal-soft rounded-[16px] border border-[#F0F0F0] bg-white p-4">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-textgray">
                Delivery Estimate
              </p>
              <div className="space-y-2.5">
                {[
                  { icon: "🚀", label: "Phnom Penh",  sub: "Today · 2–4 hours"      },
                  { icon: "📦", label: "Provinces",   sub: "1–3 business days"      },
                  { icon: "✓",  label: "Authentic",   sub: "All products verified"  },
                ].map((d) => (
                  <div key={d.label} className="flex items-center gap-2.5">
                    <span className="w-4 text-center text-sm leading-none">{d.icon}</span>
                    <div>
                      <p className="text-xs font-semibold text-[#111111]">{d.label}</p>
                      <p className="text-[10px] text-textgray">{d.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
