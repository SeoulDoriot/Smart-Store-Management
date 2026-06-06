import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { config } from "./config";

/**
 * Supabase admin client (service role — full access).
 * Null if credentials aren't configured.
 */
export const supabase: SupabaseClient | null = config.hasSupabase
  ? createClient(config.supabaseUrl, config.supabaseKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  : null;

// ── Query helpers ─────────────────────────────────────────────────────────────

export interface OrderRow {
  id: string;
  order_code: string;
  customer_name: string;
  customer_phone: string;
  customer_telegram?: string;
  total_amount: number;
  order_status: string;
  payment_status: string;
  delivery_status: string;
  delivery_option: string;
  delivery_address?: string;
  note?: string;
  created_at: string;
  order_items: OrderItemRow[];
}

export interface OrderItemRow {
  id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface ProductRow {
  id: string;
  name: string;
  brand_id: string;
  price: number;
  stock: number;
}

export interface DeliveryRow {
  id: string;
  order_id: string;
  delivery_status: string;
  tracking_code?: string;
  rider_name?: string;
  rider_phone?: string;
  delivery_note?: string;
  estimated_delivery_date?: string;
}

/** Fetch an order by code, including items */
export async function getOrderByCode(code: string): Promise<OrderRow | null> {
  if (!supabase) return null;
  const { data } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("order_code", code)
    .single();
  return data as OrderRow | null;
}

/** Fetch an order by ID, including items */
export async function getOrderById(id: string): Promise<OrderRow | null> {
  if (!supabase) return null;
  const { data } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", id)
    .single();
  return data as OrderRow | null;
}

/** Get today's orders */
export async function getTodayOrders(): Promise<OrderRow[]> {
  if (!supabase) return [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const { data } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .gte("created_at", today.toISOString())
    .order("created_at", { ascending: false });
  return (data as OrderRow[]) ?? [];
}

/** Get low-stock products (stock <= 3) */
export async function getLowStockProducts(): Promise<ProductRow[]> {
  if (!supabase) return [];
  const { data } = await supabase
    .from("products")
    .select("id, name, brand_id, price, stock")
    .lte("stock", 3)
    .order("stock", { ascending: true });
  return (data as ProductRow[]) ?? [];
}

/** Get delivery info for an order */
export async function getDeliveryByOrderId(orderId: string): Promise<DeliveryRow | null> {
  if (!supabase) return null;
  const { data } = await supabase
    .from("deliveries")
    .select("*")
    .eq("order_id", orderId)
    .single();
  return data as DeliveryRow | null;
}

/** Log a sent Telegram message */
export async function logTelegramMessage(entry: {
  order_id?: string;
  recipient_type: string;
  chat_id: string;
  message_type: string;
  message_text: string;
  send_status: "Sent" | "Failed";
  error_message?: string;
}) {
  if (!supabase) return;
  await supabase.from("telegram_logs").insert(entry);
}
