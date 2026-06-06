import Link from "next/link";

const SKIN_TYPES = [
  { label: "Oily", icon: "💧", desc: "Balance sebum" },
  { label: "Dry", icon: "🌿", desc: "Deep moisture" },
  { label: "Sensitive", icon: "🌸", desc: "Soothe & calm" },
  { label: "Combination", icon: "☯️", desc: "Balance zones" },
  { label: "Normal", icon: "✨", desc: "Maintain glow" },
  { label: "Acne-Prone", icon: "🍃", desc: "Clear skin" },
];

const CONCERNS = [
  { label: "Acne", icon: "🌿", bg: "bg-[#F2EDE8]", text: "text-[#7A5540]" },
  { label: "Dark Spots", icon: "✨", bg: "bg-[#F5EFD8]", text: "text-[#8A7030]" },
  { label: "Redness", icon: "🌸", bg: "bg-[#FAE8EC]", text: "text-[#B04060]" },
  { label: "Hydration", icon: "💧", bg: "bg-[#E5EFF8]", text: "text-[#3060A0]" },
  { label: "Brightening", icon: "💫", bg: "bg-[#F8F4DC]", text: "text-[#907820]" },
  { label: "Sun Protection", icon: "☀️", bg: "bg-[#E8F4E8]", text: "text-[#307030]" },
];

export function SkinGuideSection() {
  return (
    <section className="bg-[#FAFAF7] py-6">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-textgray">
            Guided shopping
          </p>
          <h2 className="mt-2 font-serif text-2xl font-normal text-textdark md:text-3xl">
            Shop by Skin Needs
          </h2>
          <p className="mt-1 text-sm text-textgray">
            Browse by skin type or concern when you want a more personal path.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-[24px] border border-bordergray bg-white p-5">
            <h3 className="font-serif text-xl text-[#111111]">Shop by Skin Type</h3>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {SKIN_TYPES.map((type) => (
                <Link
                  key={type.label}
                  href="/skincare"
                  className="group flex flex-col gap-2 rounded-[18px] border border-bordergray bg-white px-4 py-4 transition-all hover:border-[#111111] hover:shadow-sm"
                >
                  <span className="text-2xl">{type.icon}</span>
                  <span className="text-sm font-medium text-textdark">{type.label}</span>
                  <span className="text-xs text-textgray">{type.desc}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-bordergray bg-white p-5">
            <h3 className="font-serif text-xl text-[#111111]">Shop by Concern</h3>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {CONCERNS.map((concern) => (
                <Link
                  key={concern.label}
                  href="/skincare"
                  className={`group flex flex-col items-start gap-3 rounded-[18px] ${concern.bg} p-4 transition-opacity hover:opacity-85`}
                >
                  <span className="text-2xl">{concern.icon}</span>
                  <span className={`text-sm font-semibold ${concern.text}`}>
                    {concern.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
