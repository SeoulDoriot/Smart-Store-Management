import "dotenv/config";

function required(key: string): string {
  const value = process.env[key];
  if (!value) {
    console.error(`Missing required env var: ${key}`);
    process.exit(1);
  }
  return value;
}

export const config = {
  /** Telegram bot token from @BotFather */
  botToken: required("TELEGRAM_BOT_TOKEN"),

  /** Owner / admin chat ID for business notifications */
  ownerChatId: required("OWNER_CHAT_ID"),

  /** Supabase project URL */
  supabaseUrl: process.env.SUPABASE_URL ?? "",

  /** Supabase service role key (server-only, full access) */
  supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",

  /** Whether Supabase is configured */
  hasSupabase: Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY),

  /** Cron expression for daily report */
  dailyReportCron: process.env.DAILY_REPORT_CRON ?? "0 21 * * *",
};
