import type { ProductRow } from "../supabase";

/** Low stock alert → sent to OWNER */
export function lowStockAlert(products: ProductRow[]): string {
  if (products.length === 0) return "";

  const items = products
    .map((p) => {
      const emoji = p.stock === 0 ? "🔴" : "🟡";
      return `  ${emoji} ${escape(p.name)} — *${p.stock} left*`;
    })
    .join("\n");

  return [
    `⚠️ *Low Stock Alert*`,
    ``,
    `${products.length} product${products.length > 1 ? "s" : ""} need restocking:`,
    ``,
    items,
    ``,
    `Check your admin dashboard to update stock\\.`,
  ].join("\n");
}

function escape(text: string): string {
  return text.replace(/([_*\[\]()~`>#+\-=|{}.!\\])/g, "\\$1");
}
