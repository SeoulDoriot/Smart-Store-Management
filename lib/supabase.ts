import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// ── Public (browser-safe) client ─────────────────────────────────────────────
// Uses the anon key — safe to expose in the browser.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase: SupabaseClient | null =
  url && anonKey ? createClient(url, anonKey) : null;

export const isSupabaseReady = (): boolean => supabase !== null;

// ── Server-only admin client ─────────────────────────────────────────────────
// Uses the service role key — NEVER import this in client components.
// Only use in server components, API routes, or server actions.
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseAdmin: SupabaseClient | null =
  url && serviceRoleKey
    ? createClient(url, serviceRoleKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      })
    : null;

export const isSupabaseAdminReady = (): boolean => supabaseAdmin !== null;
