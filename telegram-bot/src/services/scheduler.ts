import cron from "node-cron";
import { config } from "../config";
import { getTodayOrders, getLowStockProducts, supabase } from "../supabase";
import { sendToOwner } from "./notifier";
import { dailyReport } from "../messages/daily-report";
import { lowStockAlert } from "../messages/stock";
import { aiQuestionSummary } from "../messages/ai-summary";

/**
 * Schedule recurring reports.
 * Default: every day at 9 PM Cambodia time (configurable via DAILY_REPORT_CRON).
 */
export function startScheduler() {
  console.log(`[Scheduler] Daily report cron: ${config.dailyReportCron}`);

  cron.schedule(config.dailyReportCron, async () => {
    console.log("[Scheduler] Running daily report...");

    try {
      // ── 1. Daily sales summary ──
      const orders = await getTodayOrders();
      const lowStock = await getLowStockProducts();
      const report = dailyReport(orders, lowStock);
      await sendToOwner(report, "Daily Report");

      // ── 2. Low stock alert (only if there are low-stock items) ──
      if (lowStock.length > 0) {
        const alert = lowStockAlert(lowStock);
        if (alert) await sendToOwner(alert, "Low Stock Alert");
      }

      // ── 3. AI question summary ──
      const aiQuestions = await getTodayAIQuestions();
      if (aiQuestions.length > 0) {
        const summary = aiQuestionSummary(aiQuestions);
        await sendToOwner(summary, "AI Question Summary");
      }

      console.log("[Scheduler] Daily report sent successfully.");
    } catch (err) {
      console.error("[Scheduler] Error:", err);
    }
  });

  console.log("[Scheduler] Started.");
}

/** Fetch today's AI conversations from Supabase */
async function getTodayAIQuestions(): Promise<
  { question: string; answer: string; language: string }[]
> {
  if (!supabase) return [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data } = await supabase
    .from("ai_conversations")
    .select("question, answer, language")
    .gte("created_at", today.toISOString())
    .order("created_at", { ascending: false });

  return (data as { question: string; answer: string; language: string }[]) ?? [];
}
