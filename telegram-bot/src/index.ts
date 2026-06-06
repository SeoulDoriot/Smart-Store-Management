import { bot, startRealtimeListeners } from "./bot";
import { startScheduler } from "./services/scheduler";
import { config } from "./config";

async function main() {
  console.log("─".repeat(40));
  console.log("🌸 Lumière Telegram Bot");
  console.log("─".repeat(40));
  console.log(`Supabase: ${config.hasSupabase ? "✅ Connected" : "⚠️ Not configured (commands only)"}`);
  console.log(`Owner Chat ID: ${config.ownerChatId}`);
  console.log(`Daily Report: ${config.dailyReportCron}`);
  console.log("─".repeat(40));

  // Start Supabase realtime listeners (auto-notifications)
  startRealtimeListeners();

  // Start the daily report scheduler
  startScheduler();

  // Launch the bot (long polling)
  await bot.launch();
  console.log("🤖 Bot is running! Press Ctrl+C to stop.\n");

  // Graceful shutdown
  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));
}

main().catch((err) => {
  console.error("Failed to start bot:", err);
  process.exit(1);
});
