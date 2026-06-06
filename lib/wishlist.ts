import { supabase } from "./supabase";
import type { Product } from "@/types/product";

// ── Wishlist service ─────────────────────────────────────────────────────────
// When Supabase is connected and a customer is logged in, wishlist ops go
// through the database. Otherwise the frontend falls back to localStorage
// via the store context (lib/store.tsx).

export async function getWishlist(customerId: string): Promise<Product[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from("wishlist_items")
      .select("product_id, products(*)")
      .eq("customer_id", customerId);
    if (!error && data) {
      return data
        .map((row) => (row as Record<string, unknown>).products as Product | null)
        .filter((p): p is Product => p !== null);
    }
  }
  return [];
}

export async function addToWishlist(
  customerId: string,
  productId: string
): Promise<boolean> {
  if (supabase) {
    const { error } = await supabase
      .from("wishlist_items")
      .upsert({ customer_id: customerId, product_id: productId });
    return !error;
  }
  return false;
}

export async function removeFromWishlist(
  customerId: string,
  productId: string
): Promise<boolean> {
  if (supabase) {
    const { error } = await supabase
      .from("wishlist_items")
      .delete()
      .eq("customer_id", customerId)
      .eq("product_id", productId);
    return !error;
  }
  return false;
}
