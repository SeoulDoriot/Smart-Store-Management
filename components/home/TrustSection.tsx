import { ShieldCheck, Truck, RefreshCw, Headphones, Lock } from "lucide-react";

const BADGES = [
  {
    icon: ShieldCheck,
    title: "Authentic Products",
    desc: "100% genuine, sourced directly",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    desc: "Same-day in Phnom Penh",
  },
  {
    icon: RefreshCw,
    title: "Easy Returns",
    desc: "7-day hassle-free policy",
  },
  {
    icon: Headphones,
    title: "Expert Support",
    desc: "Skincare advice on Telegram",
  },
  {
    icon: Lock,
    title: "Secure Payment",
    desc: "ABA · Wing · Bakong",
  },
];

export function TrustSection() {
  return (
    <section className="border-y border-bordergray bg-[#FAFAF7] py-6">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {BADGES.map((badge) => {
            const Icon = badge.icon;
            return (
              <div
                key={badge.title}
                className="flex flex-col items-center gap-2.5 text-center"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#111111]">
                  <Icon size={18} className="text-white" />
                </div>
                <p className="text-sm font-semibold text-textdark">
                  {badge.title}
                </p>
                <p className="text-xs leading-relaxed text-textgray">
                  {badge.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
