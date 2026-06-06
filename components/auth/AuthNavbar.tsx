"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { AUTH_ROUTES } from "@/lib/authFlow";
import { getSupabaseBrowserClient } from "@/lib/supabaseBrowser";

const AUTH_NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: AUTH_ROUTES.login, label: "Log in" },
  { href: AUTH_ROUTES.signup, label: "Sign up" },
] as const;

function getActiveIndex(pathname: string) {
  if (pathname === "/" || pathname === AUTH_ROUTES.welcome) return 0;
  const index = AUTH_NAV_ITEMS.findIndex((item) => item.href === pathname);
  return index >= 0 ? index : 0;
}

export default function AuthNavbar() {
  const pathname = usePathname();
  const activeIndex = getActiveIndex(pathname);
  const [isVisible, setIsVisible] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 12 || currentScrollY < lastScrollY) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        setIsVisible(false);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  async function handleLogout() {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  const navItems = isLoggedIn
    ? ([{ href: "/", label: "Home" }] as const)
    : AUTH_NAV_ITEMS;
  const columns = isLoggedIn ? "grid-cols-2" : "grid-cols-3";

  return (
    <header
      className={`pointer-events-none fixed right-4 top-4 z-50 sm:right-6 sm:top-5 lg:right-10 lg:top-6 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-5 opacity-0"
      }`}
    >
      <nav className="pointer-events-auto relative hidden rounded-[22px] bg-[#efede9]/[0.88] p-1.5 shadow-[0_12px_40px_rgba(15,23,42,0.07)] backdrop-blur-xl md:block">
        <div className={`relative grid ${columns} gap-1`}>
          {/* ── Liquid glass slider ── */}
          <motion.span
            aria-hidden="true"
            layoutId="auth-tab-slider"
            className="absolute inset-y-0 rounded-[16px] bg-[#dfddda]/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_1px_3px_rgba(0,0,0,0.04)]"
            animate={{
              width: `calc(${100 / navItems.length}% - 0.1875rem)`,
              left: `calc(${(activeIndex * 100) / navItems.length}% + ${activeIndex * 0.125}rem)`,
            }}
            transition={{
              type: "spring",
              stiffness: 380,
              damping: 32,
              mass: 0.8,
            }}
          />

          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href === "/" && pathname === AUTH_ROUTES.welcome);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative z-10 inline-flex min-w-[82px] items-center justify-center rounded-[16px] px-4 py-2.5 text-[15px] font-medium transition-colors duration-300 ${
                  isActive ? "text-zinc-900" : "text-zinc-500 hover:text-zinc-700"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          {isLoggedIn ? (
            <button
              type="button"
              onClick={() => void handleLogout()}
              className="relative z-10 inline-flex min-w-[82px] items-center justify-center rounded-[16px] px-4 py-2.5 text-[15px] font-medium text-zinc-500 transition-colors duration-300 hover:text-zinc-700"
            >
              Log out
            </button>
          ) : null}
        </div>
      </nav>
    </header>
  );
}
