import Link from "next/link";

type Brand = {
  name: string;
  initial: string;
  sub: string;
  label: string;
  gradient: string;
  text: string;
  /** tints for the little product placeholder bottles */
  objectTints: [string, string, string];
};

// Unified soft-luxury palette — cream, beige, blush and warm taupe only.
// Brand identity reads through the logo/name, not loud colour.
const BRANDS: Brand[] = [
  {
    name: "Anua",
    initial: "A",
    sub: "Anua",
    label: "K-Beauty",
    gradient: "from-[#F7F1E9] to-[#ECDFCF]",
    text: "text-[#5C4B38]",
    objectTints: ["bg-white/90", "bg-[#E6D6C2]/80", "bg-white/75"],
  },
  {
    name: "COSRX",
    initial: "CX",
    sub: "COSRX",
    label: "K-Beauty",
    gradient: "from-[#F4F1EC] to-[#E4DCD0]",
    text: "text-[#4F4A42]",
    objectTints: ["bg-white/90", "bg-[#DBD0C0]/80", "bg-white/75"],
  },
  {
    name: "Beauty of Joseon",
    initial: "BJ",
    sub: "Beauty+of+Joseon",
    label: "K-Beauty",
    gradient: "from-[#F8F3E6] to-[#EBDFC6]",
    text: "text-[#6B5A36]",
    objectTints: ["bg-white/90", "bg-[#E4D4AF]/80", "bg-white/75"],
  },
  {
    name: "Skin1004",
    initial: "S1",
    sub: "Skin1004",
    label: "K-Beauty",
    gradient: "from-[#F5F1EE] to-[#E6DCD6]",
    text: "text-[#574A42]",
    objectTints: ["bg-white/90", "bg-[#D8CABF]/80", "bg-white/75"],
  },
  {
    name: "CeraVe",
    initial: "CV",
    sub: "CeraVe",
    label: "Derma",
    gradient: "from-[#F2F2F0] to-[#E0DED9]",
    text: "text-[#4A4A45]",
    objectTints: ["bg-white/92", "bg-[#D2D0C9]/80", "bg-white/78"],
  },
  {
    name: "The Ordinary",
    initial: "TO",
    sub: "The+Ordinary",
    label: "Clean Beauty",
    gradient: "from-[#F1F1F1] to-[#DCDCDC]",
    text: "text-[#505050]",
    objectTints: ["bg-white/95", "bg-[#C9C9C9]/80", "bg-white/80"],
  },
  {
    name: "Some By Mi",
    initial: "SBM",
    sub: "Some+By+Mi",
    label: "K-Beauty",
    gradient: "from-[#F9F0EF] to-[#EFDCD9]",
    text: "text-[#6E4F4A]",
    objectTints: ["bg-white/90", "bg-[#E6CCC6]/80", "bg-white/75"],
  },
  {
    name: "Laneige",
    initial: "L",
    sub: "Laneige",
    label: "K-Beauty",
    gradient: "from-[#F3F2F0] to-[#E2DFDB]",
    text: "text-[#4E4A45]",
    objectTints: ["bg-white/90", "bg-[#D4CFC8]/80", "bg-white/75"],
  },
];

export function BrandsSection() {
  return (
    <section className="bg-[#FAFAF7] py-6">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-5">
          <h2 className="font-serif text-2xl font-normal text-textdark md:text-3xl">
            Popular Brands
          </h2>
          <p className="mt-1 text-sm text-textgray">
            Trusted skincare from Korea and beyond
          </p>
        </div>

        {/* Horizontal rail — desktop shows ~4 cards, mobile scrolls.
            Internal padding + matching negative margins give hover lift /
            shadows room without clipping at the scroll edges. */}
        <div className="no-scrollbar -mx-4 -mt-3 -mb-10 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-10 pt-3 md:-mx-6 md:px-6">
          {BRANDS.map((brand) => (
            <Link
              key={brand.name}
              href={`/brands?sub=${brand.sub}`}
              className={`group relative h-[190px] w-[240px] shrink-0 snap-start overflow-hidden rounded-[22px] bg-gradient-to-br ${brand.gradient} p-4 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_22px_55px_rgba(17,17,17,0.16)] sm:w-[260px] lg:w-[calc((100%-2.25rem)/4)]`}
            >
              {/* Label chip */}
              <span className="absolute left-4 top-4 z-10 rounded-full bg-white/70 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-[#111]/65 shadow-sm backdrop-blur-sm">
                {brand.label}
              </span>

              {/* Product placeholder objects (2–3 little bottles) */}
              <div className="absolute left-5 top-12 flex items-end gap-2">
                {/* bottle 1 — tall */}
                <div
                  className={`h-[68px] w-9 rounded-[10px] rounded-t-[14px] ${brand.objectTints[0]} shadow-[0_10px_24px_rgba(17,17,17,0.12)] transition-all duration-300 ease-out group-hover:-translate-y-1.5`}
                >
                  <div className="mx-auto mt-2 h-3.5 w-3 rounded-sm bg-[#111]/10" />
                </div>
                {/* bottle 2 — short jar */}
                <div
                  className={`h-[46px] w-11 rounded-[12px] ${brand.objectTints[1]} shadow-[0_10px_24px_rgba(17,17,17,0.12)] transition-all delay-75 duration-300 ease-out group-hover:-translate-y-2`}
                >
                  <div className="mx-auto mt-1.5 h-2.5 w-7 rounded-full bg-[#111]/10" />
                </div>
                {/* bottle 3 — dropper */}
                <div
                  className={`h-[58px] w-8 rounded-[9px] rounded-t-[12px] ${brand.objectTints[2]} shadow-[0_10px_24px_rgba(17,17,17,0.12)] transition-all delay-150 duration-300 ease-out group-hover:-translate-y-1`}
                >
                  <div className="mx-auto mt-1.5 h-4 w-2 rounded-full bg-[#111]/10" />
                </div>
              </div>

              {/* Brand identity — bottom-right, clarifies on hover */}
              <div className="absolute bottom-4 right-4 flex items-center gap-2 text-right">
                <div className="text-right">
                  <p
                    className={`font-serif text-[15px] font-normal leading-tight ${brand.text} opacity-80 transition-opacity duration-300 group-hover:opacity-100`}
                  >
                    {brand.name}
                  </p>
                </div>
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full bg-white/75 shadow-sm transition-all duration-300 group-hover:bg-white group-hover:shadow-md`}
                >
                  <span className={`text-[11px] font-bold tracking-tight ${brand.text}`}>
                    {brand.initial}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
