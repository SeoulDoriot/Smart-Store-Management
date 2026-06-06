"use client";

import { useState } from "react";
import Link from "next/link";
import { Instagram, Facebook, Send } from "lucide-react";

const SHOP_LINKS = [
  { label: "All Products", href: "/products" },
  { label: "New Arrivals", href: "/new" },
  { label: "Best Sellers", href: "/offers" },
  { label: "Offers", href: "/offers" },
];

const HELP_LINKS = [
  { label: "Track Order", href: "/track-order" },
  { label: "Shipping", href: "/track-order" },
  { label: "Returns", href: "/home" },
  { label: "FAQs", href: "/home" },
];

const ABOUT_LINKS = [
  { label: "About Lumière", href: "/home" },
  { label: "Authenticity", href: "/home" },
  { label: "Contact Us", href: "/home" },
];

const PAYMENT_METHODS = [
  "ABA",
  "KHQR",
  "Bakong",
  "Cash on Delivery",
];

export function HomeFooter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  }

  return (
    <footer className="bg-[#FAF9F7] pt-16">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.25fr_2fr]">
          {/* Brand */}
          <div>
            <Link href="/home">
              <span className="font-serif text-2xl font-semibold text-[#111111]">
                Lumière
              </span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-textgray">
              Premium skincare curated for your unique skin. Authentic
              products, fast delivery, AI-powered advice.
            </p>

            {/* Email subscribe */}
            {!subscribed ? (
              <form onSubmit={handleSubscribe} className="mt-5 flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="h-9 min-w-0 flex-1 rounded-lg border border-bordergray bg-white px-3 text-sm placeholder-textgray focus:outline-none"
                />
                <button
                  type="submit"
                  className="flex h-9 shrink-0 items-center gap-1.5 rounded-lg bg-[#111111] px-3 text-xs font-medium text-white hover:opacity-80"
                >
                  <Send size={11} />
                  Join
                </button>
              </form>
            ) : (
              <p className="mt-5 text-sm font-medium text-green-600">
                ✓ You&apos;re subscribed!
              </p>
            )}

            {/* Socials */}
            <div className="mt-5 flex gap-2.5">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-bordergray bg-white text-textgray hover:border-textdark hover:text-textdark"
              >
                <Instagram size={15} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-bordergray bg-white text-textgray hover:border-textdark hover:text-textdark"
              >
                <Facebook size={15} />
              </a>
              <a
                href="https://t.me/lumiere"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-bordergray bg-white text-textgray hover:border-textdark hover:text-textdark"
              >
                <Send size={14} />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <FooterLinkColumn title="SHOP" links={SHOP_LINKS} />
            <FooterLinkColumn title="HELP" links={HELP_LINKS} />
            <FooterLinkColumn title="ABOUT" links={ABOUT_LINKS} />

            {/* Payment / Currency */}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-textdark">
                PAYMENT
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {PAYMENT_METHODS.map((method) => (
                  <span
                    key={method}
                    className="rounded-full bg-white px-2.5 py-1 text-[11px] text-textgray ring-1 ring-bordergray"
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-bordergray py-6 sm:flex-row">
          <p className="text-xs text-textgray">
            © 2026 Lumière. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-textgray">
            <Link href="/home" className="hover:text-textdark">
              Privacy Policy
            </Link>
            <Link href="/home" className="hover:text-textdark">
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLinkColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-textdark">
        {title}
      </p>
      <ul className="mt-4 space-y-3">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              href={l.href}
              className="text-sm text-textgray transition-colors hover:text-textdark"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
