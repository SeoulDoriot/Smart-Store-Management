import type { OrderRow } from "../supabase";

/** New order alert → sent to OWNER */
export function newOrderAlert(order: OrderRow): string {
  const items = order.order_items
    .map((i) => `  ${i.product_name} x${i.quantity} — $${i.total_price.toFixed(2)}`)
    .join("\n");

  return [
    `🛍 *New Order Received*`,
    ``,
    `*Order:* \`${order.order_code}\``,
    `*Customer:* ${escape(order.customer_name)}`,
    `*Phone:* ${order.customer_phone}`,
    order.customer_telegram ? `*Telegram:* ${order.customer_telegram}` : null,
    `*Delivery:* ${order.delivery_option}`,
    order.delivery_address ? `*Address:* ${escape(order.delivery_address)}` : null,
    order.note ? `*Note:* ${escape(order.note)}` : null,
    ``,
    `*Items:*`,
    items,
    ``,
    `*Total: $${order.total_amount.toFixed(2)}*`,
    `*Status:* ${order.order_status}`,
    ``,
    `📅 ${formatDate(order.created_at)}`,
  ]
    .filter(Boolean)
    .join("\n");
}

/** Order confirmed → sent to CUSTOMER */
export function orderConfirmedCustomer(order: OrderRow): string {
  const items = order.order_items
    .map((i) => `  ${i.product_name} x${i.quantity}`)
    .join("\n");

  return [
    `✅ *Order Confirmed*`,
    ``,
    `Hi ${escape(order.customer_name)}, your order has been confirmed\\!`,
    ``,
    `*Order:* \`${order.order_code}\``,
    `*Items:*`,
    items,
    `*Total:* $${order.total_amount.toFixed(2)}`,
    ``,
    `We'll update you when it's ready\\.`,
    `Thank you for shopping with Lumière\\! 🌸`,
  ].join("\n");
}

/** Order completed → sent to CUSTOMER */
export function orderCompletedCustomer(order: OrderRow): string {
  return [
    `🎉 *Order Completed*`,
    ``,
    `Hi ${escape(order.customer_name)}, your order \`${order.order_code}\` is complete\\!`,
    ``,
    `*Total:* $${order.total_amount.toFixed(2)}`,
    ``,
    `We hope you enjoy your products\\! 💕`,
    `Thank you for choosing Lumière\\.`,
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
  // Escape MarkdownV2 special characters
  return text.replace(/([_*\[\]()~`>#+\-=|{}.!\\])/g, "\\$1");
}
