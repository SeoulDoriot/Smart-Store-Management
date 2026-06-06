import { Telegraf } from "telegraf";
import { config } from "../config";
import { logTelegramMessage } from "../supabase";

const bot = new Telegraf(config.botToken);

/**
 * Send a Markdown message to a specific chat.
 * Logs the result to Supabase telegram_logs table.
 */
export async function sendMessage(opts: {
  chatId: string;
  text: string;
  recipientType: "Customer" | "Owner";
  messageType: string;
  orderId?: string;
}): Promise<boolean> {
  try {
    await bot.telegram.sendMessage(opts.chatId, opts.text, {
      parse_mode: "MarkdownV2",
    });

    console.log(`[OK] ${opts.messageType} → ${opts.recipientType} (${opts.chatId})`);

    await logTelegramMessage({
      order_id: opts.orderId,
      recipient_type: opts.recipientType,
      chat_id: opts.chatId,
      message_type: opts.messageType,
      message_text: opts.text,
      send_status: "Sent",
    });

    return true;
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error(`[FAIL] ${opts.messageType} → ${opts.recipientType}: ${errorMsg}`);

    await logTelegramMessage({
      order_id: opts.orderId,
      recipient_type: opts.recipientType,
      chat_id: opts.chatId,
      message_type: opts.messageType,
      message_text: opts.text,
      send_status: "Failed",
      error_message: errorMsg,
    });

    return false;
  }
}

/** Send a message to the shop owner */
export async function sendToOwner(
  text: string,
  messageType: string,
  orderId?: string
): Promise<boolean> {
  return sendMessage({
    chatId: config.ownerChatId,
    text,
    recipientType: "Owner",
    messageType,
    orderId,
  });
}

/** Send a message to a customer (if they provided a Telegram chat ID) */
export async function sendToCustomer(
  chatId: string,
  text: string,
  messageType: string,
  orderId?: string
): Promise<boolean> {
  return sendMessage({
    chatId,
    text,
    recipientType: "Customer",
    messageType,
    orderId,
  });
}

export { bot };
