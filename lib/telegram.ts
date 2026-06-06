import { supabaseAdmin } from "./supabase";
import type { TelegramMessageType, TelegramRecipient } from "@/types/telegram";

// ── Telegram service ─────────────────────────────────────────────────────────
// The Telegram bot token must NEVER be exposed in the frontend.
// All sends go through a server action or API route that uses supabaseAdmin.
// This file provides the interface; the actual HTTP call to the Telegram API
// should happen in a secure backend context.

export interface SendTelegramInput {
  recipient: TelegramRecipient;
  chatId?: string;
  type: TelegramMessageType;
  text: string;
  orderId?: string;
}

export async function sendTelegramMessage(
  input: SendTelegramInput
): Promise<{ ok: boolean; error?: string }> {
  // Log the attempt to Supabase (audit trail)
  if (supabaseAdmin) {
    await supabaseAdmin.from("telegram_logs").insert({
      order_id: input.orderId ?? null,
      recipient_type: input.recipient,
      chat_id: input.chatId ?? null,
      message_type: input.type,
      message_text: input.text,
      send_status: "Pending",
    });
  }

  // Actual send would happen here via TELEGRAM_BOT_TOKEN env var
  // (backend-only). Not implemented yet — returns false for mock.
  return { ok: false, error: "Telegram integration not connected yet" };
}

export async function getTelegramLogs(orderId?: string) {
  if (supabaseAdmin) {
    let query = supabaseAdmin
      .from("telegram_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    if (orderId) query = query.eq("order_id", orderId);
    const { data, error } = await query;
    if (!error && data) return data;
  }
  return [];
}
