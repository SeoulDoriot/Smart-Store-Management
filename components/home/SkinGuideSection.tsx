import Link from "next/link";
import {
  Droplet,
  Leaf,
  Flower2,
  CircleDashed,
  Sparkles,
  Sprout,
  Sun,
  Flame,
  Star,
  Droplets,
  type LucideIcon,
} from "lucide-react";

type NeedCard = {
  label: string;
  desc: string;
  icon: LucideIcon;
  href: string;
};

const SKIN_TYPES: NeedCard[] = [
  { label: "Oily", desc: "Balance sebum", icon: Droplet, href: "/skincare" },
  { label: "Dry", desc: "Deep moisture", icon: Leaf, href: "/skincare" },
  { label: "Sensitive", desc: "Soothe & calm", icon: Flower2, href: "/skincare" },
  { label: "Combination", desc: "Balance zones", icon: CircleDashed, href: "/skincare" },
  { label: "Normal", desc: "Maintain glow", icon: Sparkles, href: "/skincare" },
  { label: "Acne-Prone", desc: "Clear skin", icon: Sprout, href: "/skincare" },
];

const CONCERNS: NeedCard[] = [
  { label: "Acne", desc: "Clear breakouts", icon: Sprout, href: "/skincare?concern=Acne" },
  { label: "Dark Spots", desc: "Even tone", icon: Star, href: "/skincare?concern=Dark+Spots" },
  { label: "Redness", desc: "Calm & soothe", icon: Flame, href: "/skincare?concern=Redness" },
  { label: "Hydration", desc: "Lasting moisture", icon: Droplets, href: "/skincare?concern=Dryness" },
  { label: "Brightening", desc: "Glow boost", icon: Sparkles, href: "/skincare?sub=Serums" },
  { label: "Sun Protection", desc: "Daily SPF", icon: Sun, href: "/skincare?sub=Sunscreens" },
];

function NeedGrid({ cards }: { cards: NeedCard[] }) {
  return (
    <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
      {cards.map(({ label, desc, icon: Icon, href }) => (
        <Link
          key={label}
          href={href}
          className="group flex h-[124px] flex-col items-start justify-between rounded-[18px] border border-bordergray bg-white p-4 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[#111111]/30 hover:shadow-[0_14px_34px_rgba(17,17,17,0.07)]"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F7EFE5] transition-colors duration-300 group-hover:bg-[#F1E4D4]">
            <Icon size={18} strokeWidth={1.6} className="text-[#7A6A56]" />
          </span>
          <span className="w-full">
            <span className="block text-sm font-medium text-textdark">{label}</span>
            <span className="mt-0.5 block text-xs text-textgray">{desc}</span>
          </span>
        </Link>
      ))}
    </div>
  );
}

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
            <NeedGrid cards={SKIN_TYPES} />
          </div>

          <div className="rounded-[24px] border border-bordergray bg-white p-5">
            <h3 className="font-serif text-xl text-[#111111]">Shop by Concern</h3>
            <NeedGrid cards={CONCERNS} />
          </div>
        </div>
      </div>
    </section>
  );
}
