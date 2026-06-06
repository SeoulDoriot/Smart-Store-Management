import {
  getProductById,
  getRelatedProducts,
  getBrandName,
  getBrands,
} from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Sparkles } from "lucide-react";

import { AnnouncementBar } from "@/components/home/AnnouncementBar";
import { Header } from "@/components/home/Header";
import { NavigationBar } from "@/components/home/NavigationBar";
import { HomeFooter } from "@/components/home/HomeFooter";
import { FloatingAIButton } from "@/components/home/FloatingAIButton";
import { HomeProductCard } from "@/components/home/HomeProductCard";
import { ProductImageGallery } from "@/components/product/ProductImageGallery";
import { ProductAbout } from "@/components/product/ProductAbout";
import { ProductActions } from "@/components/product/ProductActions";
import type { Product } from "@/types/product";

// ─── Highlights ───────────────────────────────────────────────────────────────
type Highlight = { label: string; icon: string; bg: string };

function buildHighlights(product: Product): Highlight[] {
  const all: Highlight[] = [
    { label: "Authentic", icon: "✓", bg: "bg-[#DDEFE3]" },
    { label: "Dermatologist Tested", icon: "🔬", bg: "bg-[#E8EDF8]" },
  ];
  if (
    product.skin_types.includes("Sensitive") ||
    product.ai_tags.some((t) => t.includes("sensitive"))
  )
    all.push({ label: "Sensitive-Friendly", icon: "🌸", bg: "bg-[#FFF0F5]" });
  if (
    product.skin_concerns.includes("Hydration") ||
    product.skin_concerns.includes("Dryness")
  )
    all.push({ label: "Deeply Hydrating", icon: "💧", bg: "bg-[#E3F0FD]" });
  if (
    product.skin_concerns.includes("Sun Protection") ||
    product.ai_tags.some((t) => t.includes("spf"))
  )
    all.push({ label: "SPF Protected", icon: "☀️", bg: "bg-[#FFF7E0]" });
  if (
    product.skin_concerns.includes("Brightening") ||
    product.skin_concerns.includes("Dark Spots")
  )
    all.push({ label: "Brightening", icon: "✨", bg: "bg-[#FEF0FA]" });
  if (
    product.skin_concerns.includes("Acne") ||
    product.ai_tags.some((t) => t.includes("acne"))
  )
    all.push({ label: "Acne-Safe", icon: "🫧", bg: "bg-[#F0FAF0]" });
  return all.slice(0, 6);
}

// ─── AI Beauty Tip ────────────────────────────────────────────────────────────
function getAIBeautyTip(
  product: Product,
  brand: string
): { headline: string; body: string } {
  if (
    product.skin_concerns.includes("Sun Protection") ||
    product.ai_tags.some((t) => t.includes("spf"))
  )
    return {
      headline: "Sunscreen is non-negotiable — apply it last.",
      body: `${brand}'s formula is the final step of your morning routine. Reapply every 2 hours outdoors. Layer a Vitamin C serum underneath for amplified brightening protection.`,
    };

  if (
    product.skin_concerns.includes("Acne") &&
    product.skin_types.includes("Oily")
  )
    return {
      headline: "Balance oil without stripping your barrier.",
      body: `This ${brand} formula targets breakouts while keeping your skin barrier intact. Follow with a lightweight, oil-free moisturizer — avoid mixing with retinol on the same night.`,
    };

  if (
    product.skin_concerns.includes("Hydration") ||
    product.skin_concerns.includes("Dryness")
  )
    return {
      headline: "Apply to damp skin for deeper absorption.",
      body: `Hydrators work best within 60 seconds of cleansing. ${brand}'s formula layers beautifully under moisturizers and SPF — try morning and night for a plumped, glass-skin effect.`,
    };

  if (
    product.skin_concerns.includes("Brightening") ||
    product.skin_concerns.includes("Dark Spots")
  )
    return {
      headline: "Consistency is the key to visible brightening.",
      body: `Expect to see real results from ${brand} in 4–6 weeks of daily use. Pair with SPF in the AM to protect new skin cells, and always layer from thinnest to thickest consistency.`,
    };

  if (
    product.skin_types.includes("Sensitive") ||
    product.skin_concerns.includes("Redness")
  )
    return {
      headline: "Gentle formulas deserve a careful introduction.",
      body: `Patch test ${brand} on your inner wrist for 24 hours before full use. If your skin reacts, try using it every other day to slowly build tolerance and let your barrier adjust.`,
    };

  const tag = product.ai_tags[0] ?? "skincare";
  return {
    headline: `Make the most of your ${tag} routine.`,
    body: `${brand} is trusted by thousands of skincare enthusiasts. For best results, use consistently as part of your AM or PM routine. Our AI Advisor can build you a full personalized regimen.`,
  };
}

// ─── Trust strip items ────────────────────────────────────────────────────────
const TRUST = [
  { icon: "✓", label: "Authentic & verified" },
  { icon: "↩", label: "Easy 7-day returns"   },
  { icon: "🚚", label: "Fast delivery"        },
  { icon: "🤖", label: "AI Beauty support"    },
] as const;

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProductById(params.id);
  if (!product) notFound();

  const [related, brands] = await Promise.all([
    getRelatedProducts(product),
    getBrands(),
  ]);

  const brandName    = getBrandName(product.brand_id);
  const isOutOfStock = product.stock === 0;
  const isLowStock   = product.stock > 0 && product.stock <= 3;
  const gallerySeed  = product.id.charCodeAt(product.id.length - 1) % 5;
  const highlights   = buildHighlights(product);
  const tip          = getAIBeautyTip(product, brandName);
  const orderHref    = `/order?product=${encodeURIComponent(product.id)}`;

  return (
    <>
      <AnnouncementBar />
      <Header />
      <NavigationBar />

      <main className="bg-white">

        {/* ── Breadcrumb ── */}
        <div className="mx-auto max-w-7xl px-4 pb-2 pt-4 md:px-6">
          <nav className="flex items-center gap-1 text-[11px] text-textgray">
            <Link href="/home"     className="hover:text-[#111111]">Home</Link>
            <ChevronRight size={10} />
            <Link href="/products" className="hover:text-[#111111]">Products</Link>
            <ChevronRight size={10} />
            <span className="line-clamp-1 text-[#111111]">{product.name}</span>
          </nav>
        </div>

        {/* ── Top: Image + Info ── */}
        <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
          <div className="grid gap-10 md:grid-cols-[1fr_1fr] lg:grid-cols-[480px_1fr]">

            {/* LEFT: gallery */}
            <ProductImageGallery
              seed={gallerySeed}
              brandInitial={brandName.slice(0, 1)}
            />

            {/* RIGHT: info panel */}
            <div>

              {/* Brand */}
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-textgray">
                {brandName}
              </p>

              {/* Name */}
              <h1 className="mt-2 font-serif text-[1.7rem] font-normal leading-snug text-[#111111] md:text-[2rem]">
                {product.name}
              </h1>

              {/* Stars + reviews */}
              <div className="mt-3 flex items-center gap-2">
                <div className="flex gap-[2px]">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span
                      key={s}
                      className={`text-[14px] leading-none ${
                        s <= Math.round(product.rating ?? 0)
                          ? "text-amber-400"
                          : "text-[#DCDCDC]"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                {product.rating != null && (
                  <span className="text-xs font-medium text-[#111111]">
                    {product.rating.toFixed(1)}
                  </span>
                )}
                <span className="text-xs text-textgray">
                  {product.review_count != null && product.review_count > 0
                    ? `${product.review_count >= 1000 ? `${(product.review_count / 1000).toFixed(1)}k` : product.review_count} Reviews`
                    : "No Reviews Yet"}
                </span>
                <span className="text-xs text-[#DCDCDC]">·</span>
                <button className="text-xs text-[#111111] underline underline-offset-2 hover:no-underline">
                  Write a Review
                </button>
              </div>

              {/* Badges */}
              <div className="mt-3 flex flex-wrap gap-2">
                {product.is_best_seller && (
                  <span className="rounded-full bg-[#111111] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                    Best Seller
                  </span>
                )}
                {product.is_new_arrival && (
                  <span className="rounded-full border border-[#111111]/20 bg-[#FAFAF7] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#111111]">
                    New Arrival
                  </span>
                )}
                {product.is_hot_sale && (
                  <span className="rounded-full bg-red-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                    Sale
                  </span>
                )}
              </div>

              {/* Price */}
              <div className="mt-5 flex items-baseline gap-3">
                <p className="font-serif text-[2rem] font-normal leading-none text-[#111111]">
                  {formatPrice(product.price)}
                </p>
                {product.original_price && (
                  <>
                    <p className="text-base text-textgray line-through">
                      {formatPrice(product.original_price)}
                    </p>
                    <span className="rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-bold text-red-500">
                      {Math.round((1 - product.price / product.original_price) * 100)}% OFF
                    </span>
                  </>
                )}
              </div>

              <hr className="my-5 border-[#F0F0F0]" />

              {/* Skin Type */}
              {product.skin_types.length > 0 && (
                <div className="mb-4">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-textgray">
                    Best for Skin Type
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {product.skin_types.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-[#E8E8E8] bg-[#FAFAF7] px-3 py-1 text-[11px] font-medium text-[#333]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Skin Concerns */}
              {product.skin_concerns.length > 0 && (
                <div className="mb-5">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-textgray">
                    Targets
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {product.skin_concerns.map((c) => (
                      <span
                        key={c}
                        className="rounded-full border border-[#EDD0CA]/60 bg-[#FFF8F6] px-3 py-1 text-[11px] font-medium text-[#333]"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <hr className="mb-5 border-[#F0F0F0]" />

              {/* Delivery options */}
              <div>
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-textgray">
                  Delivery Options
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { icon: "🚀", label: "Fast Delivery", sub: "Phnom Penh · 2–4h" },
                    { icon: "⏱",  label: "Same-Day",      sub: "Order before 12PM"  },
                    { icon: "📦", label: "Province",      sub: "1–3 business days"  },
                    { icon: "💻", label: "Order Online",  sub: "Nationwide"          },
                  ].map((opt) => (
                    <div
                      key={opt.label}
                      className="flex items-start gap-2.5 rounded-[14px] border border-[#EBEBEB] bg-[#FAFAF7] p-3 transition-colors hover:border-[#DCDCDC]"
                    >
                      <span className="mt-0.5 shrink-0 text-base leading-none">
                        {opt.icon}
                      </span>
                      <div>
                        <p className="text-[11px] font-semibold text-[#111111]">
                          {opt.label}
                        </p>
                        <p className="text-[10px] leading-snug text-textgray">
                          {opt.sub}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stock indicator */}
              <div className="mt-4">
                {isOutOfStock ? (
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-red-400" />
                    <p className="text-sm font-medium text-red-500">Out of Stock</p>
                  </div>
                ) : isLowStock ? (
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-yellow-400" />
                    <p className="text-sm font-medium text-yellow-600">
                      Only {product.stock} left — order soon!
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <p className="text-sm font-medium text-green-700">
                      In Stock · {product.stock} available
                    </p>
                  </div>
                )}
              </div>

              {/* ── Qty + Wishlist + Add to Bag + Order Now + Ask AI ── */}
              <ProductActions
                productId={product.id}
                isOutOfStock={isOutOfStock}
                orderHref={orderHref}
              />

              {/* ── Trust strip ── */}
              <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 rounded-[14px] border border-[#F0F0F0] bg-[#FAFAF7] px-4 py-3.5">
                {TRUST.map((t) => (
                  <div key={t.label} className="flex items-center gap-2">
                    <span className="text-xs">{t.icon}</span>
                    <span className="text-[11px] text-textgray">{t.label}</span>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>

        {/* ── Highlights ── */}
        <div className="border-t border-[#F0F0F0] bg-[#FAFAF7] py-10">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <h2 className="mb-7 font-serif text-xl font-normal text-[#111111]">
              Highlights
            </h2>
            <div className="flex flex-wrap gap-x-10 gap-y-6">
              {highlights.map((h) => (
                <div
                  key={h.label}
                  className="flex flex-col items-center gap-2.5 text-center"
                >
                  <div
                    className={`flex h-[52px] w-[52px] items-center justify-center rounded-full text-xl ${h.bg}`}
                  >
                    {h.icon}
                  </div>
                  <p className="text-[11px] font-semibold text-[#333]">
                    {h.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── About the Product ── */}
        <ProductAbout
          description={product.description}
          ingredients={product.ingredients}
          howToUse={product.how_to_use}
          mainBenefit={product.main_benefit}
        />

        {/* ── AI Beauty Tip ── */}
        <div className="mx-auto mt-12 max-w-7xl px-4 md:px-6">
          <div className="overflow-hidden rounded-[20px] border border-[#EBEBEB] bg-gradient-to-br from-[#CEC7EE]/20 via-white to-[#EDD0CA]/20 p-6 md:p-7">
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#111111]">
                <Sparkles size={15} className="text-white" />
              </div>
              {/* Content */}
              <div className="flex-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#9055A2]">
                  AI Beauty Tip
                </p>
                <p className="mt-1.5 font-serif text-[1.05rem] font-normal leading-snug text-[#111111]">
                  {tip.headline}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-textgray">
                  {tip.body}
                </p>
                <Link
                  href="/ai-advisor"
                  className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#111111] px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-80"
                >
                  Get More AI Tips
                  <ChevronRight size={11} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ── You May Also Like ── */}
        {related.length > 0 && (
          <div className="mx-auto mt-14 max-w-7xl px-4 pb-16 md:px-6">
            <div className="mb-6 flex items-end justify-between">
              <h2 className="font-serif text-xl font-normal text-[#111111]">
                You May Also Like
              </h2>
              <Link
                href="/products"
                className="flex items-center gap-1 text-xs font-medium text-textgray hover:text-[#111111]"
              >
                View All
                <ChevronRight size={12} />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {related.map((p, i) => {
                const b = brands.find((br) => br.id === p.brand_id)?.name ?? "";
                return (
                  <HomeProductCard key={p.id} product={p} brandName={b} index={i} />
                );
              })}
            </div>
          </div>
        )}

      </main>

      <HomeFooter />
      <FloatingAIButton />
    </>
  );
}
