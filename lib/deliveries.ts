import { supabase } from "./supabase";
import { MOCK_DELIVERIES } from "./mock-data";
import type { Delivery, DeliveryStatus } from "@/types/order";

// ── Read ─────────────────────────────────────────────────────────────────────

export async function getDeliveries(): Promise<Delivery[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from("deliveries")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data && data.length > 0) return data as Delivery[];
  }
  return MOCK_DELIVERIES;
}

export async function getDeliveryByOrderId(orderId: string): Promise<Delivery | null> {
  if (supabase) {
    const { data, error } = await supabase
      .from("deliveries")
      .select("*")
      .eq("order_id", orderId)
      .single();
    if (!error && data) return data as Delivery;
  }
  return MOCK_DELIVERIES.find((d) => d.order_id === orderId) ?? null;
}

// ── Create ───────────────────────────────────────────────────────────────────

export async function createDelivery(
  orderId: string,
  fields?: Partial<Omit<Delivery, "id" | "order_id">>
): Promise<Delivery | null> {
  if (supabase) {
    const { data, error } = await supabase
      .from("deliveries")
      .insert({ order_id: orderId, ...fields })
      .select()
      .single();
    if (!error && data) return data as Delivery;
  }
  // Mock fallback — return a stub
  return {
    id: `del-mock-${Date.now()}`,
    order_id: orderId,
    delivery_status: "Order Created",
    ...fields,
  } as Delivery;
}

// ── Update ───────────────────────────────────────────────────────────────────

export async function updateDeliveryStatus(
  deliveryId: string,
  fields: {
    delivery_status?: DeliveryStatus;
    tracking_code?: string;
    delivery_company?: string;
    rider_name?: string;
    rider_phone?: string;
    delivery_note?: string;
    estimated_delivery_date?: string;
  }
): Promise<boolean> {
  if (supabase) {
    const { error } = await supabase
      .from("deliveries")
      .update(fields)
      .eq("id", deliveryId);
    return !error;
  }
  // Mock: mutate in-memory
  const delivery = MOCK_DELIVERIES.find((d) => d.id === deliveryId);
  if (delivery) {
    Object.assign(delivery, fields);
    return true;
  }
  return false;
}
