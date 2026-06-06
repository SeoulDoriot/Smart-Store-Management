import type { OrderRow, ProductRow } from "../supabase";

/** Daily sales summary → sent to OWNER at scheduled time */
export function dailyReport(
  orders: OrderRow[],
  lowStockProducts: ProductRow[]
): string {
  const totalOrders = orders.length;
  const paidOrders = orders.filter(
    (o) => o.payment_status === "Payment Successful"
  );
  const revenue = paidOrders.reduce((sum, o) => sum + o.total_amount, 0);
  const pendingPayments = orders.filter(
    (o) =>
      o.payment_status === "Payment Pending" ||
      o.payment_status === "Payment Submitted"
  ).length;
  const cancelled = orders.filter(
    (o) => o.order_status === "Cancelled"
  ).length;

  // Best seller calculation
  const productCount: Record<string, number> = {};
  orders.forEach((o) =>
    o.order_items.forEach((item) => {
      productCount[item.product_name] =
        (productCount[item.product_name] ?? 0) + item.quantity;
    })
  );
  const bestSeller = Object.entries(productCount).sort(
    (a, b) => b[1] - a[1]
  )[0];

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const lines = [
    `📊 *Daily Store Report*`,
    `${escape(today)}`,
    ``,
    `${"─".repeat(26)}`,
    ``,
    `🛍 *Orders:* ${totalOrders}`,
    `💰 *Revenue:* $${revenue.toFixed(2)}`,
    `✅ *Paid:* ${paidOrders.length}`,
    `⏳ *Pending Payments:* ${pendingPayments}`,
    `❌ *Cancelled:* ${cancelled}`,
  ];

  if (bestSeller) {
    lines.push(
      ``,
      `🏆 *Best Seller:* ${escape(bestSeller[0])} \\(${bestSeller[1]} sold\\)`
    );
  }

  if (lowStockProducts.length > 0) {
    lines.push(
      ``,
      `⚠️ *Low Stock:* ${lowStockProducts.length} products`,
      ...lowStockProducts
        .slice(0, 5)
        .map((p) => `  • ${escape(p.name)} — ${p.stock} left`)
    );
  }

  lines.push(
    ``,
    `${"─".repeat(26)}`,
    `_Lumière Daily Report_ 🌸`
  );

  return lines.join("\n");
}

function escape(text: string): string {
  return text.replace(/([_*\[\]()~`>#+\-=|{}.!\\])/g, "\\$1");
}
