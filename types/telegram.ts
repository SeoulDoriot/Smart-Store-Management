export type TelegramRecipient =
  | "Customer"
  | "Owner"
  | "Manager"
  | "Employee";

export type TelegramMessageType =
  | "New Order"
  | "Payment Successful"
  | "Receipt"
  | "Delivery Update"
  | "Low Stock Alert"
  | "Daily Report"
  | "AI Question Summary";

export type TelegramSendStatus = "Pending" | "Sent" | "Failed";

export interface TelegramLog {
  id: string;
  order_id?: string;
  recipient_type: TelegramRecipient;
  chat_id?: string;
  message_type: TelegramMessageType;
  message_text?: string;
  send_status: TelegramSendStatus;
  error_message?: string;
  sent_at?: string;
  created_at?: string;
}
