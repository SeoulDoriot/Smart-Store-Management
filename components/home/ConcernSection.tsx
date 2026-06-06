import Link from "next/link";

const CONCERNS = [
  {
    label: "Acne",
    icon: "🌿",
    bg: "bg-[#F2EDE8]",
    text: "text-[#7A5540]",
  },
  {
    label: "Dark Spots",
    icon: "✨",
    bg: "bg-[#F5EFD8]",
    text: "text-[#8A7030]",
  },
  {
    label: "Redness",
    icon: "🌸",
    bg: "bg-[#FAE8EC]",
    text: "text-[#B04060]",
  },
  {
    label: "Hydration",
    icon: "💧",
    bg: "bg-[#E5EFF8]",
    text: "text-[#3060A0]",
  },
  {
    label: "Brightening",
    icon: "💫",
    bg: "bg-[#F8F4DC]",
    text: "text-[#907820]",
  },
  {
    label: "Sun Protection",
    icon: "☀️",
    bg: "bg-[#E8F4E8]",
    text: "text-[#307030]",
  },
];

export function ConcernSection() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-8">
          <h2 className="font-serif text-2xl font-normal text-textdark md:text-3xl">
            Shop by Concern
          </h2>
          <p className="mt-1 text-sm text-textgray">
            Target your specific skin goals
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {CONCERNS.map((c) => (
            <Link
              key={c.label}
              href="/skincare"
              className={`group flex flex-col items-start gap-3 rounded-[20px] ${c.bg} p-5 transition-opacity hover:opacity-85`}
            >
              <span className="text-2xl">{c.icon}</span>
              <span className={`text-sm font-semibold ${c.text}`}>
                {c.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
