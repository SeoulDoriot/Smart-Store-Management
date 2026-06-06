/**
 * Session-based order storage using localStorage.
 * Orders placed during a browser session are stored here so that the payment,
 * receipt, and track-order pages can find them without a backend.
 */
import type { OrderWithItems } from "./mock-data";

const KEY = "lumiere-session-orders";

function load(): OrderWithItems[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as OrderWithItems[]) : [];
  } catch {
    return [];
  }
}

function persist(orders: OrderWithItems[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(orders));
  } catch {
    /* ignore quota errors */
  }
}

/** Save (or overwrite) an order in session storage. */
export function saveSessionOrder(order: OrderWithItems): void {
  const rest = load().filter((o) => o.order_code !== order.order_code);
  persist([...rest, order]);
}

/** Return all session orders created in this browser. */
export function getSessionOrders(): OrderWithItems[] {
  return load();
}

/** Look up an order by its code. Returns null if not found. */
export function getSessionOrder(orderCode: string): OrderWithItems | null {
  return load().find((o) => o.order_code === orderCode) ?? null;
}

/** Patch a session order by order code. Used by the mock payment/admin flow. */
export function updateSessionOrder(
  orderCode: string,
  updates: Partial<OrderWithItems>
): OrderWithItems | null {
  const orders = load();
  const index = orders.findIndex((o) => o.order_code === orderCode);
  if (index === -1) return null;
  const next = { ...orders[index], ...updates };
  orders[index] = next;
  persist(orders);
  return next;
}

/** Look up an order by code + phone (used by Track Order). */
export function findSessionOrder(
  orderCode: string,
  phone: string
): OrderWithItems | null {
  return (
    load().find(
      (o) =>
        o.order_code.toLowerCase() === orderCode.toLowerCase() &&
        o.customer_phone === phone
    ) ?? null
  );
}
