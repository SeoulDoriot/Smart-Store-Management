import { supabase } from "./supabase";
import {
  MOCK_ORDERS,
  MOCK_DELIVERIES,
  MOCK_PAYMENTS,
  type OrderWithItems,
} from "./mock-data";
import type { Order, OrderItem, OrderStatus, PaymentStatus, DeliveryStatus } from "@/types/order";

// ── Generate order code ──────────────────────────────────────────────────────

export function generateOrderCode(): string {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `ORD-${n}`;
}

// ── Create ───────────────────────────────────────────────────────────────────

type CreateOrderInput = Omit<Partial<Order>, "items"> & {
  items: Omit<OrderItem, "id" | "order_id">[];
};

export async function createOrder(
  input: CreateOrderInput
): Promise<{ order_code: string }> {
  const orderCode = input.order_code ?? generateOrderCode();

  if (supabase) {
    const { data: orderRow, error: orderErr } = await supabase
      .from("orders")
      .insert({
        order_code: orderCode,
        customer_name: input.customer_name,
        customer_phone: input.customer_phone,
        customer_telegram: input.customer_telegram,
        delivery_address: input.delivery_address,
        delivery_option: input.delivery_option,
        note: input.note,
        total_amount: input.total_amount ?? 0,
      })
      .select("id")
      .single();

    if (!orderErr && orderRow) {
      const items = input.items.map((item) => ({
        order_id: orderRow.id,
        product_id: item.product_id || null,
        product_name: item.product_name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price,
      }));
      await supabase.from("order_items").insert(items);
    }
  }

  return { order_code: orderCode };
}

// ── Read ─────────────────────────────────────────────────────────────────────

export async function findOrder(
  orderCode: string,
  phone: string
): Promise<OrderWithItems | null> {
  if (supabase) {
    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .ilike("order_code", orderCode)
      .eq("customer_phone", phone)
      .single();
    if (!error && data) {
      return { ...data, items: data.order_items ?? [] } as OrderWithItems;
    }
  }
  const order = MOCK_ORDERS.find(
    (o) =>
      o.order_code.toLowerCase() === orderCode.toLowerCase() &&
      o.customer_phone === phone
  );
  return order ?? null;
}

export function getOrderByCode(code: string): OrderWithItems | null {
  return MOCK_ORDERS.find((o) => o.order_code === code) ?? null;
}

export function getAllOrders(): OrderWithItems[] {
  return MOCK_ORDERS;
}

export async function getOrders(): Promise<OrderWithItems[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false });
    if (!error && data && data.length > 0) {
      return data.map((o) => ({
        ...o,
        items: o.order_items ?? [],
      })) as OrderWithItems[];
    }
  }
  return MOCK_ORDERS;
}

// ── Update status ────────────────────────────────────────────────────────────

export async function updateOrderStatus(
  orderId: string,
  fields: {
    order_status?: OrderStatus;
    payment_status?: PaymentStatus;
    delivery_status?: DeliveryStatus;
  }
): Promise<boolean> {
  if (supabase) {
    const { error } = await supabase
      .from("orders")
      .update(fields)
      .eq("id", orderId);
    return !error;
  }
  // Mock: find and mutate in-memory (for admin preview)
  const order = MOCK_ORDERS.find((o) => o.id === orderId);
  if (order) {
    if (fields.order_status) order.order_status = fields.order_status;
    if (fields.payment_status) order.payment_status = fields.payment_status;
    if (fields.delivery_status) order.delivery_status = fields.delivery_status;
    return true;
  }
  return false;
}

// ── Delivery / Payment helpers ───────────────────────────────────────────────

export function getDeliveryForOrder(orderId: string) {
  return MOCK_DELIVERIES.find((d) => d.order_id === orderId) ?? null;
}

export function getPaymentForOrder(orderId: string) {
  return MOCK_PAYMENTS.find((p) => p.order_id === orderId) ?? null;
}

// ── Stats ────────────────────────────────────────────────────────────────────

export function getOrderStats() {
  const orders = MOCK_ORDERS;
  const paid = orders.filter((o) => o.payment_status === "Payment Successful");
  const pending = orders.filter((o) => o.order_status === "New Order");
  const cancelled = orders.filter((o) => o.order_status === "Cancelled");
  const revenue = paid.reduce((sum, o) => sum + o.total_amount, 0);

  return {
    total: orders.length,
    paid: paid.length,
    pending: pending.length,
    cancelled: cancelled.length,
    revenue,
  };
}
