import { supabase } from "./supabase";
import {
  MOCK_PRODUCTS,
  MOCK_BRANDS,
  MOCK_CATEGORIES,
} from "./mock-data";
import type { Product, Brand, Category, SkinType, SkinConcern } from "@/types/product";

// ── Read operations ──────────────────────────────────────────────────────────

export async function getProducts(): Promise<Product[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data && data.length > 0) return data as Product[];
  }
  return MOCK_PRODUCTS;
}

export async function getProductById(id: string): Promise<Product | null> {
  if (supabase) {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();
    if (!error && data) return data as Product;
  }
  return MOCK_PRODUCTS.find((p) => p.id === id) ?? null;
}

export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("category_id", categoryId)
      .order("created_at", { ascending: false });
    if (!error && data && data.length > 0) return data as Product[];
  }
  return MOCK_PRODUCTS.filter((p) => p.category_id === categoryId);
}

export async function searchProducts(query: string): Promise<Product[]> {
  const q = query.toLowerCase();
  if (supabase) {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .or(`name.ilike.%${q}%,description.ilike.%${q}%`)
      .order("created_at", { ascending: false })
      .limit(20);
    if (!error && data && data.length > 0) return data as Product[];
  }
  return MOCK_PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q) ||
      getBrandName(p.brand_id).toLowerCase().includes(q)
  );
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .neq("id", product.id)
      .eq("category_id", product.category_id)
      .limit(limit);
    if (!error && data && data.length > 0) return data as Product[];
  }
  return MOCK_PRODUCTS.filter(
    (p) =>
      p.id !== product.id &&
      (p.category_id === product.category_id ||
        p.skin_concerns.some((c) => product.skin_concerns.includes(c)))
  ).slice(0, limit);
}

// ── Brands & Categories ──────────────────────────────────────────────────────

export async function getBrands(): Promise<Brand[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from("brands")
      .select("*")
      .order("name");
    if (!error && data && data.length > 0) return data as Brand[];
  }
  return MOCK_BRANDS;
}

export async function getCategories(): Promise<Category[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name");
    if (!error && data && data.length > 0) return data as Category[];
  }
  return MOCK_CATEGORIES;
}

// ── Sync helpers (no Supabase needed) ────────────────────────────────────────

export function getBrandById(id: string): Brand | undefined {
  return MOCK_BRANDS.find((b) => b.id === id);
}

export function getCategoryById(id: string): Category | undefined {
  return MOCK_CATEGORIES.find((c) => c.id === id);
}

export function getBrandName(brandId: string): string {
  return MOCK_BRANDS.find((b) => b.id === brandId)?.name ?? "Unknown";
}

export function getCategoryName(categoryId: string): string {
  return MOCK_CATEGORIES.find((c) => c.id === categoryId)?.name ?? "Unknown";
}

// ── Filtering / sorting (client-side, works on any product array) ────────────

export type SortOption =
  | "newest"
  | "best_seller"
  | "price_asc"
  | "price_desc"
  | "hot_sale";

export type FilterOptions = {
  search?: string;
  categoryId?: string;
  brandId?: string;
  skinType?: string;
  skinConcern?: string;
  sort?: SortOption;
};

export function filterProducts(
  products: Product[],
  opts: FilterOptions
): Product[] {
  let result = [...products];

  if (opts.search) {
    const q = opts.search.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        getBrandName(p.brand_id).toLowerCase().includes(q) ||
        p.skin_concerns.some((c) => c.toLowerCase().includes(q)) ||
        p.ai_tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  if (opts.categoryId) {
    result = result.filter((p) => p.category_id === opts.categoryId);
  }

  if (opts.brandId) {
    result = result.filter((p) => p.brand_id === opts.brandId);
  }

  if (opts.skinType) {
    result = result.filter((p) =>
      p.skin_types.includes(opts.skinType as SkinType)
    );
  }

  if (opts.skinConcern) {
    result = result.filter((p) =>
      p.skin_concerns.includes(opts.skinConcern as SkinConcern)
    );
  }

  switch (opts.sort) {
    case "price_asc":
      result.sort((a, b) => a.price - b.price);
      break;
    case "price_desc":
      result.sort((a, b) => b.price - a.price);
      break;
    case "best_seller":
      result.sort((a, b) => (b.is_best_seller ? 1 : 0) - (a.is_best_seller ? 1 : 0));
      break;
    case "hot_sale":
      result.sort((a, b) => (b.is_hot_sale ? 1 : 0) - (a.is_hot_sale ? 1 : 0));
      break;
    default:
      break;
  }

  return result;
}
