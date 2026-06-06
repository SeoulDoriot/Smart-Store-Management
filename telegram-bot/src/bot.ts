import { bot, sendToOwner, sendToCustomer } from "./services/notifier";
import { config } from "./config";
import {
  supabase,
  getOrderByCode,
  getOrderById,
  getLowStockProducts,
  getDeliveryByOrderId,
  getTodayOrders,
} from "./supabase";

// Message templates
import { newOrderAlert, orderConfirmedCustomer, orderCompletedCustomer } from "./messages/order";
import { paymentSuccessOwner, paymentSuccessCustomer } from "./messages/payment";
import { receiptMessage } from "./messages/receipt";
import { deliveryUpdateCustomer, deliveryCompletedOwner } from "./messages/delivery";
import { lowStockAlert } from "./messages/stock";
import { dailyReport } from "./messages/daily-report";

// ── Bot Commands ──────────────────────────────────────────────────────────────

/** /start — Welcome message + register chat ID */
bot.start((ctx) => {
  const chatId = ctx.chat.id;
  console.log(`[Bot] /start from chat ${chatId} (${ctx.from?.first_name})`);

  ctx.reply(
    `🌸 Welcome to Lumière Store Bot!\n\n` +
      `Your Chat ID: ${chatId}\n\n` +
      `Commands:\n` +
      `/status ORDER_CODE — Check order status\n` +
      `/receipt ORDER_CODE — Get your receipt\n` +
      `/report — Today's sales report (owner only)\n` +
      `/stock — Low stock alert (owner only)\n` +
      `/help — Show commands`
  );
});

/** /help — Command list */
bot.help((ctx) => {
  ctx.reply(
    `📋 Lumière Bot Commands:\n\n` +
      `/status ORDER_CODE — Check order status\n` +
      `/receipt ORDER_CODE — Get your receipt\n` +
      `/report — Today's sales report\n` +
      `/stock — Low stock alert\n` +
      `/help — Show this list`
  );
});

/** /status ORD-XXXX — Check order status */
bot.command("status", async (ctx) => {
  const code = ctx.message.text.split(" ")[1]?.trim();
  if (!code) {
    return ctx.reply("Usage: /status ORDER_CODE\nExample: /status ORD-1001");
  }

  const order = await getOrderByCode(code);
  if (!order) {
    return ctx.reply(`Order "${code}" not found. Please check the order code.`);
  }

  const items = order.order_items
    .map((i) => `  ${i.product_name} x${i.quantity}`)
    .join("\n");

  ctx.reply(
    `📦 Order: ${order.order_code}\n\n` +
      `Customer: ${order.customer_name}\n` +
      `Items:\n${items}\n` +
      `Total: $${order.total_amount.toFixed(2)}\n\n` +
      `🔹 Order: ${order.order_status}\n` +
      `🔹 Payment: ${order.payment_status}\n` +
      `🔹 Delivery: ${order.delivery_status}`
  );
});

/** /receipt ORD-XXXX — Send receipt */
bot.command("receipt", async (ctx) => {
  const code = ctx.message.text.split(" ")[1]?.trim();
  if (!code) {
    return ctx.reply("Usage: /receipt ORDER_CODE\nExample: /receipt ORD-1001");
  }

  const order = await getOrderByCode(code);
  if (!order) {
    return ctx.reply(`Order "${code}" not found.`);
  }

  try {
    await ctx.replyWithMarkdownV2(receiptMessage(order));
  } catch {
    // Fallback to plain text if MarkdownV2 fails
    const items = order.order_items
      .map((i) => `  ${i.product_name} x${i.quantity} — $${i.total_price.toFixed(2)}`)
      .join("\n");
    ctx.reply(
      `🧾 Lumière Receipt\n\n` +
        `Order: ${order.order_code}\n` +
        `Customer: ${order.customer_name}\n\n` +
        `Items:\n${items}\n\n` +
        `Total: $${order.total_amount.toFixed(2)}\n` +
        `Payment: ${order.payment_status}\n` +
        `Status: ${order.order_status}`
    );
  }
});

/** /report — Today's sales report (owner only) */
bot.command("report", async (ctx) => {
  if (String(ctx.chat.id) !== config.ownerChatId) {
    return ctx.reply("This command is for the store owner only.");
  }

  const orders = await getTodayOrders();
  const lowStock = await getLowStockProducts();
  const report = dailyReport(orders, lowStock);

  try {
    await ctx.replyWithMarkdownV2(report);
  } catch {
    ctx.reply(
      `📊 Today's Report\n\n` +
        `Orders: ${orders.length}\n` +
        `Low Stock: ${lowStock.length} products`
    );
  }
});

/** /stock — Low stock products (owner only) */
bot.command("stock", async (ctx) => {
  if (String(ctx.chat.id) !== config.ownerChatId) {
    return ctx.reply("This command is for the store owner only.");
  }

  const products = await getLowStockProducts();
  if (products.length === 0) {
    return ctx.reply("✅ All products have healthy stock levels!");
  }

  const alert = lowStockAlert(products);
  try {
    await ctx.replyWithMarkdownV2(alert);
  } catch {
    const list = products
      .map((p) => `  ${p.stock === 0 ? "🔴" : "🟡"} ${p.name} — ${p.stock} left`)
      .join("\n");
    ctx.reply(`⚠️ Low Stock Alert\n\n${list}`);
  }
});

// ── Supabase Realtime Listeners ───────────────────────────────────────────────

/**
 * Listen for database changes and send notifications automatically.
 * Requires Supabase realtime to be enabled on the tables.
 */
export function startRealtimeListeners() {
  if (!supabase) {
    console.log("[Realtime] Supabase not configured — skipping realtime listeners.");
    console.log("[Realtime] Bot commands still work. Use /status, /receipt, etc.");
    return;
  }

  console.log("[Realtime] Starting Supabase realtime listeners...");

  // ── Listen for new orders ──
  supabase
    .channel("orders-insert")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "orders" },
      async (payload) => {
        console.log("[Realtime] New order inserted:", payload.new.order_code);
        const order = await getOrderById(payload.new.id);
        if (!order) return;

        // Notify owner
        await sendToOwner(newOrderAlert(order), "New Order", order.id);

        // Notify customer (if they have a Telegram chat ID)
        if (order.customer_telegram) {
          await sendToCustomer(
            order.customer_telegram,
            orderConfirmedCustomer(order),
            "Order Confirmed",
            order.id
          );
        }
      }
    )
    .subscribe();

  // ── Listen for order status updates ──
  supabase
    .channel("orders-update")
    .on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "orders" },
      async (payload) => {
        const oldStatus = (payload.old as Record<string, unknown>).payment_status;
        const newStatus = (payload.new as Record<string, unknown>).payment_status;
        const oldOrderStatus = (payload.old as Record<string, unknown>).order_status;
        const newOrderStatus = (payload.new as Record<string, unknown>).order_status;

        const order = await getOrderById(payload.new.id as string);
        if (!order) return;

        // ── Payment became successful ──
        if (oldStatus !== "Payment Successful" && newStatus === "Payment Successful") {
          console.log(`[Realtime] Payment successful: ${order.order_code}`);
          await sendToOwner(paymentSuccessOwner(order), "Payment Successful", order.id);

          if (order.customer_telegram) {
            await sendToCustomer(
              order.customer_telegram,
              paymentSuccessCustomer(order),
              "Payment Successful",
              order.id
            );
            // Also send receipt
            await sendToCustomer(
              order.customer_telegram,
              receiptMessage(order),
              "Receipt",
              order.id
            );
          }

          // Check for low stock after payment (stock decreases)
          const lowStock = await getLowStockProducts();
          if (lowStock.length > 0) {
            const alert = lowStockAlert(lowStock);
            if (alert) await sendToOwner(alert, "Low Stock Alert");
          }
        }

        // ── Order completed ──
        if (oldOrderStatus !== "Completed" && newOrderStatus === "Completed") {
          console.log(`[Realtime] Order completed: ${order.order_code}`);
          if (order.customer_telegram) {
            await sendToCustomer(
              order.customer_telegram,
              orderCompletedCustomer(order),
              "Order Completed",
              order.id
            );
          }
        }
      }
    )
    .subscribe();

  // ── Listen for delivery updates ──
  supabase
    .channel("deliveries-update")
    .on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "deliveries" },
      async (payload) => {
        const oldDeliveryStatus = (payload.old as Record<string, unknown>).delivery_status;
        const newDeliveryStatus = (payload.new as Record<string, unknown>).delivery_status;

        if (oldDeliveryStatus === newDeliveryStatus) return;

        console.log(`[Realtime] Delivery updated: ${newDeliveryStatus}`);
        const delivery = payload.new as {
          id: string;
          order_id: string;
          delivery_status: string;
          tracking_code?: string;
          rider_name?: string;
          rider_phone?: string;
          delivery_note?: string;
          estimated_delivery_date?: string;
        };

        const order = await getOrderById(delivery.order_id);
        if (!order) return;

        // Notify customer of delivery update
        if (order.customer_telegram) {
          await sendToCustomer(
            order.customer_telegram,
            deliveryUpdateCustomer(order, delivery),
            "Delivery Update",
            order.id
          );
        }

        // Notify owner when delivery completed
        if (newDeliveryStatus === "Completed") {
          await sendToOwner(deliveryCompletedOwner(order), "Delivery Completed", order.id);
        }
      }
    )
    .subscribe();

  console.log("[Realtime] Listening for orders, payments, and deliveries.");
}

export { bot };
