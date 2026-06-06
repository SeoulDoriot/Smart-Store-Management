"use client";

import { useEffect, useState, useRef } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Globe, Heart, ShoppingBag, User, X, Check } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabaseBrowser";
import { useStore } from "@/lib/store";

const LANGUAGES = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "km", label: "ខ្មែរ", flag: "🇰🇭" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
] as const;

export function Header() {
  const [query, setQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [lang, setLang] = useState("en");
  const langRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { cartCount, wishlistCount } = useStore();

  // Load saved language
  useEffect(() => {
    const saved = localStorage.getItem("lumiere-lang");
    if (saved) setLang(saved);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    }
    if (langOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [langOpen]);

  function selectLang(code: string) {
    setLang(code);
    localStorage.setItem("lumiere-lang", code);
    setLangOpen(false);
  }

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (mounted) setIsLoggedIn(Boolean(data.session));
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(Boolean(session));
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    await supabase.auth.signOut();
    setIsLoggedIn(false);
  }

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanQuery = query.trim();
    router.push(cleanQuery ? `/products?search=${encodeURIComponent(cleanQuery)}` : "/products");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-bordergray bg-white/96 backdrop-blur-md">
      <div className="mx-auto grid h-16 max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-4 px-4 md:px-6">
        {/* Logo */}
        <Link href="/home" className="shrink-0">
          <span className="font-serif text-[1.6rem] font-semibold tracking-tight text-[#111111]">
            Lumière
          </span>
        </Link>

        {/* Search bar — desktop (centered in grid) */}
        <form
          onSubmit={handleSearch}
          className="mx-auto hidden w-full max-w-md items-center gap-2 md:flex"
        >
          <div className="relative flex-1">
            <Search
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textgray"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, brands…"
              className="h-10 w-full rounded-full border border-bordergray bg-offwhite pl-9 pr-9 text-sm text-textdark placeholder-textgray transition-colors focus:border-[#111111] focus:bg-white focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-textgray hover:text-textdark"
              >
                <X size={13} />
              </button>
            )}
          </div>
          <div ref={langRef} className="relative">
            <button
              type="button"
              onClick={() => setLangOpen((v) => !v)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-bordergray text-textgray transition-colors hover:bg-offwhite hover:text-textdark"
              aria-label="Change language"
            >
              <Globe size={16} />
            </button>

            {langOpen && (
              <div className="absolute right-0 top-12 z-50 w-48 overflow-hidden rounded-2xl border border-bordergray bg-white py-1 shadow-lg">
                <p className="px-4 pb-1.5 pt-2.5 text-[10px] font-bold uppercase tracking-wider text-textgray">
                  Language
                </p>
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => selectLang(l.code)}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:bg-offwhite"
                  >
                    <span className="text-base leading-none">{l.flag}</span>
                    <span
                      className={
                        lang === l.code
                          ? "font-semibold text-textdark"
                          : "text-textgray"
                      }
                    >
                      {l.label}
                    </span>
                    {lang === l.code && (
                      <Check
                        size={14}
                        className="ml-auto text-green-600"
                        strokeWidth={2.5}
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </form>

        {/* Right actions */}
        <div className="flex items-center justify-end gap-0.5">
          {isLoggedIn ? (
            <button
              type="button"
              onClick={() => void handleLogout()}
              className="hidden h-9 items-center rounded-full border border-bordergray px-4 text-[13px] font-semibold text-textdark transition-colors hover:bg-offwhite md:flex"
            >
              Log out
            </button>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Link
                href="/Log_in"
                className="h-9 rounded-full px-4 py-2 text-[13px] font-semibold text-textgray transition-colors hover:bg-offwhite hover:text-textdark"
              >
                Log in
              </Link>
              <Link
                href="/Sign_up"
                className="h-9 rounded-full bg-[#111111] px-4 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-85"
              >
                Sign up
              </Link>
            </div>
          )}

          {/* Profile */}
          <Link
            href="/profile"
            aria-label="My Profile"
            className="relative flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-offwhite"
          >
            <User size={17} className="text-textgray" />
          </Link>

          {/* Wishlist */}
          <Link
            href="/wishlist"
            aria-label={wishlistCount > 0 ? `Wishlist (${wishlistCount} items)` : "Wishlist"}
            className="relative flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-offwhite"
          >
            <Heart
              size={17}
              fill={wishlistCount > 0 ? "currentColor" : "none"}
              className={wishlistCount > 0 ? "text-red-400" : "text-textgray"}
            />
            {wishlistCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-400 text-[9px] font-bold text-white">
                {wishlistCount > 9 ? "9+" : wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link
            href="/cart"
            aria-label={cartCount > 0 ? `Cart (${cartCount} items)` : "Cart"}
            className="relative flex h-9 w-9 items-center justify-center rounded-full text-textdark transition-colors hover:bg-offwhite"
          >
            <ShoppingBag size={17} />
            {cartCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#111111] text-[9px] font-bold text-white">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile search row */}
      <div className="border-t border-bordergray px-4 pb-2.5 pt-2 md:hidden">
        <form onSubmit={handleSearch} className="relative">
          <Search
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-textgray"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products…"
            className="h-9 w-full rounded-full border border-bordergray bg-offwhite pl-8 pr-3 text-sm placeholder-textgray focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X size={12} className="text-textgray" />
            </button>
          )}
        </form>
      </div>
    </header>
  );
}
