import Link from "next/link";

const LINKS = [
  { href: "/products", label: "Products" },
  { href: "/find-my-product", label: "Find My Product" },
  { href: "/ai-advisor", label: "AI Advisor" },
  { href: "/order", label: "Order" },
  { href: "/track-order", label: "Track Order" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-bordergray bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="font-semibold text-textdark">Glow Studio</p>
            <p className="mt-2 text-sm text-textgray">
              Premium skincare curated for your skin concern. Browse, order, and
              track — all in one place.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-textdark">Quick Links</p>
            <ul className="mt-3 flex flex-col gap-2">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-textgray hover:text-textdark"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-textdark">Contact</p>
            <div className="mt-3 flex flex-col gap-1 text-sm text-textgray">
              <p>Telegram: @glowstudio</p>
              <p>Phone: 012 345 678</p>
              <p>Phnom Penh, Cambodia</p>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-bordergray pt-6 text-center text-xs text-textgray">
          © 2026 Glow Studio. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
