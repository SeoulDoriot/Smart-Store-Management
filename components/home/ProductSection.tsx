"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { HomeProductCard } from "./HomeProductCard";
import type { Product, Brand } from "@/types/product";

export function ProductSection({
  title,
  subtitle,
  products,
  brands,
  bgClass = "bg-white",
  viewAllHref = "/new",
}: {
  title: string;
  subtitle?: string;
  products: Product[];
  brands: Brand[];
  bgClass?: string;
  viewAllHref?: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function getBrandName(brandId: string): string {
    return brands.find((b) => b.id === brandId)?.name ?? "";
  }

  function scroll(dir: "left" | "right") {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.firstElementChild?.getBoundingClientRect().width ?? 220;
    const distance = cardWidth + 10; // card width + gap
    el.scrollBy({ left: dir === "right" ? distance : -distance, behavior: "smooth" });
  }

  return (
    <section className={`${bgClass} py-6`}>
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        {/* Header row */}
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl font-normal text-textdark md:text-3xl">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-1 text-sm text-textgray">{subtitle}</p>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Scroll arrows — desktop only */}
            <div className="hidden gap-1.5 md:flex">
              <button
                onClick={() => scroll("left")}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E8E8E8] bg-white text-[#999] transition-all hover:border-[#CCC] hover:text-[#333]"
                aria-label="Scroll left"
              >
                <ChevronLeft size={15} />
              </button>
              <button
                onClick={() => scroll("right")}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E8E8E8] bg-white text-[#999] transition-all hover:border-[#CCC] hover:text-[#333]"
                aria-label="Scroll right"
              >
                <ChevronRight size={15} />
              </button>
            </div>

            <Link
              href={viewAllHref}
              className="flex items-center gap-1.5 text-sm text-textgray transition-colors hover:text-textdark"
            >
              View all
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Scrollable product rail
            Internal padding gives hover shadows / lift room; matching negative
            margins keep the visual spacing identical. overflow-x-auto forces
            overflow-y to auto, so the padding is what prevents vertical clipping. */}
        <div
          ref={scrollRef}
          className="no-scrollbar -mx-4 -mt-4 -mb-12 flex snap-x snap-mandatory gap-2.5 overflow-x-auto px-4 pb-12 pt-4 md:-mx-4 md:px-4"
        >
          {products.map((p, i) => (
            <div
              key={p.id}
              className="relative z-0 w-[46vw] shrink-0 snap-start transition-[z-index] duration-0 hover:z-10 sm:w-[32vw] md:w-[220px] lg:w-[232px]"
            >
              <HomeProductCard
                product={p}
                brandName={getBrandName(p.brand_id)}
                index={i}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
