import type { OrderRow } from "../supabase";

/** Payment successful → sent to OWNER */
export function paymentSuccessOwner(order: OrderRow): string {
  return [
    `💰 *Payment Received*`,
    ``,
    `*Order:* \`${order.order_code}\``,
    `*Customer:* ${escape(order.customer_name)}`,
    `*Amount:* $${order.total_amount.toFixed(2)}`,
    `*Status:* ${order.payment_status}`,
    ``,
    `📅 ${formatDate(new Date().toISOString())}`,
  ].join("\n");
}

/** Payment successful → sent to CUSTOMER */
export function paymentSuccessCustomer(order: OrderRow): string {
  return [
    `💚 *Payment Confirmed*`,
    ``,
    `Hi ${escape(order.customer_name)}, we've received your payment\\!`,
    ``,
    `*Order:* \`${order.order_code}\``,
    `*Amount:* $${order.total_amount.toFixed(2)}`,
    ``,
    `Your order is now being prepared\\. 📦`,
    `We'll notify you when it ships\\.`,
  ].join("\n");
}

// ── Helpers ──

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function escape(text: string): string {
  return text.replace(/([_*\[\]()~`>#+\-=|{}.!\\])/g, "\\$1");
}
