"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";

// ── Cookie helpers ──────────────────────────────────────────────────────────
const COOKIE_NAME = "lumiere-admin-session";

function setAdminCookie(email: string) {
  const value = btoa(JSON.stringify({ email, ts: Date.now() }));
  // SameSite=Lax, path=/, 7 day expiry
  document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
}

function clearAdminCookie() {
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
}

function getAdminCookie(): { email: string; ts: number } | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${COOKIE_NAME}=`));
  if (!match) return null;
  try {
    return JSON.parse(atob(match.split("=")[1]));
  } catch {
    return null;
  }
}

// ── Mock admin credentials ──────────────────────────────────────────────────
// Matches the demo accounts defined in the existing login page.
const MOCK_ADMINS = [
  { email: "admin@lumiere.demo", password: "admin1234" },
];

// ── Login / logout helpers ──────────────────────────────────────────────────

export type AdminLoginResult =
  | { ok: true }
  | { ok: false; error: string };

/**
 * Attempt admin login.
 * 1. Check mock admin list first (works without Supabase).
 * 2. If Supabase is configured, try Supabase Auth and verify role claim.
 */
export async function loginAdmin(
  email: string,
  password: string,
): Promise<AdminLoginResult> {
  const cleanEmail = email.trim().toLowerCase();

  // ── Mock login ────────────────────────────────────────────────────────────
  const mockMatch = MOCK_ADMINS.find(
    (a) => a.email === cleanEmail && a.password === password,
  );
  if (mockMatch) {
    setAdminCookie(mockMatch.email);
    return { ok: true };
  }

  // ── Supabase Auth (when configured) ───────────────────────────────────────
  try {
    const { supabase } = await import("@/lib/supabase");
    if (supabase) {
      const { error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });
      if (error) {
        return { ok: false, error: error.message };
      }
      // Set our own cookie so middleware can check easily
      setAdminCookie(cleanEmail);
      return { ok: true };
    }
  } catch {
    // supabase module unavailable — ignore
  }

  return { ok: false, error: "Invalid email or password." };
}

/**
 * Log the admin out — clears cookies and optionally signs out of Supabase.
 */
export async function logoutAdmin() {
  clearAdminCookie();
  // Also clear the demo-user key used by the customer login page
  if (typeof window !== "undefined") {
    window.localStorage.removeItem("lumiere-demo-user");
  }
  try {
    const { supabase } = await import("@/lib/supabase");
    if (supabase) await supabase.auth.signOut();
  } catch {
    // ignore
  }
}

// ── React hook for admin pages ──────────────────────────────────────────────

export function useAdminSession() {
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const session = getAdminCookie();
    setEmail(session?.email ?? null);
    setLoading(false);
  }, []);

  const logout = useCallback(async () => {
    await logoutAdmin();
    router.push("/admin/login");
  }, [router]);

  return { email, loading, logout };
}
