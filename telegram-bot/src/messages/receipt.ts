import type { OrderRow } from "../supabase";

/** Full receipt → sent to CUSTOMER */
export function receiptMessage(order: OrderRow): string {
  const items = order.order_items
    .map(
      (i) =>
        `  ${escape(i.product_name)} x${i.quantity} — $${i.total_price.toFixed(2)}`
    )
    .join("\n");

  const line = "─".repeat(26);

  return [
    `🧾 *Lumière Receipt*`,
    ``,
    line,
    ``,
    `*Order:* \`${order.order_code}\``,
    `*Customer:* ${escape(order.customer_name)}`,
    `*Phone:* ${order.customer_phone}`,
    ``,
    `*Items:*`,
    items,
    ``,
    line,
    `*Total: $${order.total_amount.toFixed(2)}*`,
    line,
    ``,
    `*Payment:* ${escape(order.payment_status)}`,
    `*Order Status:* ${escape(order.order_status)}`,
    `*Delivery:* ${escape(order.delivery_option)}`,
    ``,
    `📅 ${formatDate(order.created_at)}`,
    ``,
    `Thank you for shopping with Lumière\\! 🌸`,
    ``,
    `_Keep this receipt for your records\\._`,
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
