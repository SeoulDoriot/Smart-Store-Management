export interface Promotion {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  discount_type?: "Percentage" | "Fixed Amount" | "Bundle" | "Free Delivery";
  discount_value?: number;
  start_date?: string;
  end_date?: string;
  is_active: boolean;
  created_at?: string;
}

export type SkinType =
  | "Oily"
  | "Dry"
  | "Sensitive"
  | "Combination"
  | "Normal";

export type SkinConcern =
  | "Acne"
  | "Dark Spots"
  | "Redness"
  | "Dull Skin"
  | "Large Pores"
  | "Dryness"
  | "Oil Control"
  | "Sun Protection"
  | "Hydration"
  | "Brightening";

export type ProductOrigin =
  | "Korea"
  | "Japan"
  | "USA"
  | "France"
  | "Thailand"
  | "Cambodia";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  description?: string;
}

export interface Product {
  id: string;
  name: string;
  brand_id: string;
  origin: ProductOrigin;
  category_id: string;
  price: number;
  original_price?: number;   // Pre-sale price (set when is_hot_sale is true)
  stock: number;
  slug?: string;
  image_url?: string;
  description?: string;
  main_benefit?: string;
  how_to_use?: string;
  ingredients?: string;
  skin_types: SkinType[];
  skin_concerns: SkinConcern[];
  ai_tags: string[];
  is_best_seller: boolean;
  is_hot_sale: boolean;
  is_new_arrival: boolean;
  is_ai_recommendable: boolean;
  rating?: number;        // 1.0–5.0
  review_count?: number;
}
