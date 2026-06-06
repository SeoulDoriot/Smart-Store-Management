import type { OrderRow, DeliveryRow } from "../supabase";

/** Delivery update → sent to CUSTOMER */
export function deliveryUpdateCustomer(
  order: OrderRow,
  delivery: DeliveryRow
): string {
  const statusEmoji: Record<string, string> = {
    "Preparing": "📋",
    "Packing": "📦",
    "Ready for Delivery": "✅",
    "Delivering": "🚚",
    "Completed": "🎉",
    "Cancelled": "❌",
  };

  const emoji = statusEmoji[delivery.delivery_status] ?? "📬";

  const lines = [
    `${emoji} *Delivery Update*`,
    ``,
    `Hi ${escape(order.customer_name)}, here's an update on your order:`,
    ``,
    `*Order:* \`${order.order_code}\``,
    `*Status:* ${escape(delivery.delivery_status)}`,
  ];

  if (delivery.tracking_code) {
    lines.push(`*Tracking:* \`${delivery.tracking_code}\``);
  }
  if (delivery.rider_name) {
    lines.push(`*Rider:* ${escape(delivery.rider_name)}`);
  }
  if (delivery.rider_phone) {
    lines.push(`*Rider Phone:* ${delivery.rider_phone}`);
  }
  if (delivery.estimated_delivery_date) {
    lines.push(`*ETA:* ${escape(delivery.estimated_delivery_date)}`);
  }
  if (delivery.delivery_note) {
    lines.push(`*Note:* ${escape(delivery.delivery_note)}`);
  }

  lines.push(``, `Thank you for your patience\\! 💕`);

  return lines.join("\n");
}

/** Delivery completed → sent to OWNER */
export function deliveryCompletedOwner(order: OrderRow): string {
  return [
    `✅ *Delivery Completed*`,
    ``,
    `*Order:* \`${order.order_code}\``,
    `*Customer:* ${escape(order.customer_name)}`,
    `*Total:* $${order.total_amount.toFixed(2)}`,
    ``,
    `This order has been delivered successfully\\.`,
  ].join("\n");
}

function escape(text: string): string {
  return text.replace(/([_*\[\]()~`>#+\-=|{}.!\\])/g, "\\$1");
}
