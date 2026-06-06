import Link from "next/link";

const SKIN_TYPES = [
  { label: "Oily", icon: "💧", desc: "Balance sebum" },
  { label: "Dry", icon: "🌿", desc: "Deep moisture" },
  { label: "Sensitive", icon: "🌸", desc: "Soothe & calm" },
  { label: "Combination", icon: "☯️", desc: "Balance zones" },
  { label: "Normal", icon: "✨", desc: "Maintain glow" },
  { label: "Acne-Prone", icon: "🍃", desc: "Clear skin" },
];

export function SkinTypeSection() {
  return (
    <section className="bg-[#FAFAF7] py-16">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-8">
          <h2 className="font-serif text-2xl font-normal text-textdark md:text-3xl">
            Shop by Skin Type
          </h2>
          <p className="mt-1 text-sm text-textgray">
            Find what works best for your skin
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3 md:grid-cols-6">
          {SKIN_TYPES.map((type) => (
            <Link
              key={type.label}
              href="/skincare"
              className="group flex flex-col items-center gap-2 rounded-[20px] border border-bordergray bg-white px-3 py-5 text-center transition-all hover:border-[#111111] hover:shadow-sm"
            >
              <span className="text-2xl">{type.icon}</span>
              <span className="text-sm font-medium text-textdark">{type.label}</span>
              <span className="text-xs text-textgray">{type.desc}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
