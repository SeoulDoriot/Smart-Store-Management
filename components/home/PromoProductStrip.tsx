import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Brand, Product } from "@/types/product";
import { formatPrice } from "@/lib/utils";

const PROMOS = [
  {
    title: "Hydrating Mists and Oils",
    sub: "Lightweight glow for warm days.",
    cta: "Shop now",
    color: "bg-[#E9F1FF]",
    gradient: "from-[#C7E8F4] to-[#F4E9FF]",
  },
  {
    title: "Makeup-Friendly Sunscreens",
    sub: "Daily SPF that layers beautifully.",
    cta: "Find your match",
    color: "bg-[#111111] text-white",
    gradient: "from-[#F6DDC8] to-[#FFF3CD]",
    dark: true,
  },
  {
    title: "Soft Lip Color Drop",
    sub: "Fresh tint, comfortable shine.",
    cta: "Shop now",
    color: "bg-[#F5ECE4]",
    gradient: "from-[#F2C8C1] to-[#F8EDE7]",
  },
  {
    title: "Barrier Repair Shelf",
    sub: "Ceramides and calming care.",
    cta: "Shop recovery",
    color: "bg-[#EDF5EF]",
    gradient: "from-[#C9E7D4] to-[#F4FBF5]",
  },
  {
    title: "Fragrance Soft Launch",
    sub: "Clean skin scents for every day.",
    cta: "Explore scent",
    color: "bg-[#F4EEFF]",
    gradient: "from-[#DED2FF] to-[#FFF2FA]",
  },
  {
    title: "Body Glow Staples",
    sub: "Smooth, soft, and quietly polished.",
    cta: "Shop body",
    color: "bg-[#FFF3E8]",
    gradient: "from-[#F2D2BC] to-[#FFF2DE]",
  },
];

function brandName(product: Product, brands: Brand[]) {
  return brands.find((brand) => brand.id === product.brand_id)?.name ?? "Lumiere";
}

export function PromoProductStrip({
  products,
  brands,
}: {
  products: Product[];
  brands: Brand[];
}) {
  const featured = [
    products.find((product) => product.id === "p15"),
    products.find((product) => product.id === "p25"),
    products.find((product) => product.id === "p12"),
    products.find((product) => product.id === "p29"),
    products.find((product) => product.id === "p20"),
    products.find((product) => product.id === "p31"),
  ].filter((product): product is Product => Boolean(product));

  return (
    <section className="bg-white pb-2 pt-1 md:pb-3">
      <div className="overflow-x-auto px-4 pb-2 md:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="mx-auto flex max-w-7xl snap-x snap-mandatory gap-3">
        {featured.map((product, index) => {
          const promo = PROMOS[index % PROMOS.length];
          return (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className={`motion-card reveal-up stagger-${(index % 5) + 1} group w-[82vw] shrink-0 snap-start overflow-hidden rounded-[8px] sm:w-[460px] lg:w-[430px] xl:w-[420px] ${promo.color}`}
            >
              <div className={`relative h-48 overflow-hidden bg-gradient-to-br ${promo.gradient} md:h-60`}>
                <div className="absolute inset-x-8 top-8 flex items-end justify-center gap-3">
                  {[0, 1, 2].map((item) => (
                    <div
                      key={item}
                      className={`rounded-t-full bg-white/85 shadow-[0_18px_40px_rgba(17,17,17,0.12)] ${
                        item === 1 ? "h-28 w-14" : "h-20 w-11"
                      }`}
                    >
                      <div className="mx-auto mt-4 h-10 w-6 rounded-full bg-[#111111]/10" />
                    </div>
                  ))}
                </div>
                <div className="absolute right-5 top-5 rounded-full bg-white/85 px-3 py-1 text-[11px] font-semibold text-[#111111] shadow-sm">
                  {brandName(product, brands)}
                </div>
              </div>
              <div className={`p-3.5 ${promo.dark ? "text-white" : "text-[#111111]"}`}>
                <p className="text-sm font-bold leading-tight md:text-base">{promo.title}</p>
                <p className={`mt-0.5 text-[11px] md:text-xs ${promo.dark ? "text-white/75" : "text-textgray"}`}>
                  {promo.sub}
                </p>
                <div className="mt-2.5 flex items-center justify-between gap-3">
                  <span className="text-[9px] font-bold uppercase tracking-wide md:text-[10px]">
                    {promo.cta}
                  </span>
                  <span className="font-serif text-sm md:text-base">{formatPrice(product.price)}</span>
                </div>
                <div className="mt-1.5 flex items-center gap-1 text-[10px] font-semibold md:text-[11px]">
                  <span className="line-clamp-1">{product.name}</span>
                  <ArrowRight size={13} className="shrink-0 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          );
        })}
        </div>
      </div>
    </section>
  );
}
