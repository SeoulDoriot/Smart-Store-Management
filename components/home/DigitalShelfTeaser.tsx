import { Layers, ArrowRight } from "lucide-react";

const SHELVES = [
  {
    title: "Morning Routine",
    desc: "Cleanse → Tone → Serum → SPF",
    count: "4 products",
    gradient: "from-[#F6F0DF] to-[#FDF9F0]",
    titleColor: "text-[#7A6020]",
  },
  {
    title: "Night Recovery",
    desc: "Oil Cleanser → Serum → Moisturizer",
    count: "5 products",
    gradient: "from-[#EAE0F5] to-[#F7F4FD]",
    titleColor: "text-[#584A8A]",
  },
  {
    title: "Glow Boosters",
    desc: "Vitamin C · Niacinamide · AHA/BHA",
    count: "6 products",
    gradient: "from-[#F5E8D8] to-[#FDF5EE]",
    titleColor: "text-[#8A4820]",
  },
];

export function DigitalShelfTeaser() {
  return (
    <section className="bg-white py-6">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        {/* Header */}
        <div className="mb-5">
          <div className="mb-2 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-textgray">
            <Layers size={12} />
            Digital Shelf
          </div>
          <h2 className="font-serif text-2xl font-normal text-textdark md:text-3xl">
            Curated Routines
          </h2>
          <p className="mt-1 text-sm text-textgray">
            Pre-built skincare routines — pick a shelf, order the whole set
          </p>
        </div>

        {/* Shelf cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {SHELVES.map((shelf, index) => (
            <div
              key={shelf.title}
              className={`motion-card reveal-up stagger-${index + 1} rounded-[20px] bg-gradient-to-br ${shelf.gradient} p-7`}
            >
              <h3
                className={`font-serif text-xl font-normal ${shelf.titleColor}`}
              >
                {shelf.title}
              </h3>
              <p className="mt-1.5 text-sm text-textgray">{shelf.desc}</p>
              <p className="mt-4 text-xs font-medium text-textgray/70">
                {shelf.count}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <button
            disabled
            className="inline-flex h-11 cursor-not-allowed items-center gap-2 rounded-full border border-bordergray px-7 text-sm font-medium text-textgray opacity-50"
          >
            Enter Showroom
            <ArrowRight size={14} />
          </button>
          <p className="mt-2.5 text-xs text-textgray">
            Full showroom experience launching in Version 2
          </p>
        </div>
      </div>
    </section>
  );
}
