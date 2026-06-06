import { supabase } from "./supabase";
import { MOCK_PAYMENTS } from "./mock-data";
import type { OrderWithItems } from "@/lib/mock-data";
import type { Payment, PaymentStatus } from "@/types/order";

// ── Types ────────────────────────────────────────────────────────────────────

export type PaymentChannel =
  | "KHQR / Bakong"
  | "ABA Pay"
  | "ACLEDA"
  | "Wing"
  | "Cash on Delivery"
  | "Pay at Store";

export type PaymentFlowStatus =
  | "Payment Pending"
  | "Waiting for Scan"
  | "Payment Submitted"
  | "Checking Payment"
  | "Payment Successful"
  | "Payment Rejected";

export type MockPaymentSession = {
  id: string;
  orderId: string;
  orderCode: string;
  amount: number;
  method: PaymentChannel;
  status: PaymentFlowStatus;
  transactionReference?: string;
  proofFileName?: string;
};

export const PAYMENT_METHODS: PaymentChannel[] = [
  "KHQR / Bakong",
  "ABA Pay",
  "ACLEDA",
  "Wing",
  "Cash on Delivery",
  "Pay at Store",
];

export const PAYMENT_TIMELINE: PaymentFlowStatus[] = [
  "Payment Pending",
  "Waiting for Scan",
  "Payment Submitted",
  "Checking Payment",
  "Payment Successful",
];

// ── Supabase-backed operations ───────────────────────────────────────────────

export async function getPayments(): Promise<Payment[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from("payments")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data && data.length > 0) return data as Payment[];
  }
  return MOCK_PAYMENTS;
}

export async function createPaymentRecord(
  orderId: string,
  method: string,
  amount: number
): Promise<Payment | null> {
  if (supabase) {
    const { data, error } = await supabase
      .from("payments")
      .insert({ order_id: orderId, payment_method: method, amount })
      .select()
      .single();
    if (!error && data) return data as Payment;
  }
  return null;
}

export async function submitPaymentProofRecord(
  paymentId: string,
  input: { transaction_id?: string; payment_reference?: string; proof_url?: string }
): Promise<boolean> {
  if (supabase) {
    const { error } = await supabase
      .from("payments")
      .update({ ...input, payment_status: "Payment Submitted" })
      .eq("id", paymentId);
    return !error;
  }
  return false;
}

export async function updatePaymentStatus(
  paymentId: string,
  status: PaymentStatus
): Promise<boolean> {
  if (supabase) {
    const updates: Record<string, unknown> = { payment_status: status };
    if (status === "Payment Successful") updates.paid_at = new Date().toISOString();
    const { error } = await supabase
      .from("payments")
      .update(updates)
      .eq("id", paymentId);
    return !error;
  }
  return false;
}

// ── Mock session helpers (frontend payment flow) ─────────────────────────────

export function getDeliveryFee(order: OrderWithItems): number {
  const subtotal = order.items?.reduce((sum, item) => sum + item.total_price, 0) ?? 0;
  return Math.max(0, order.total_amount - subtotal);
}

export function createPayment(order: OrderWithItems, method: PaymentChannel): MockPaymentSession {
  return {
    id: `PAY-${order.order_code.replace("ORD-", "")}`,
    orderId: order.id,
    orderCode: order.order_code,
    amount: order.total_amount,
    method,
    status: method === "Cash on Delivery" || method === "Pay at Store"
      ? "Payment Pending"
      : "Waiting for Scan",
  };
}

export function submitPaymentProof(
  payment: MockPaymentSession,
  input: { transactionReference?: string; proofFileName?: string }
): MockPaymentSession {
  return {
    ...payment,
    ...input,
    status: "Payment Submitted",
  };
}

export function verifyPaymentMock(payment: MockPaymentSession): MockPaymentSession {
  return {
    ...payment,
    status: payment.status === "Payment Submitted" ? "Checking Payment" : payment.status,
  };
}

export function approvePayment(payment: MockPaymentSession): MockPaymentSession {
  return {
    ...payment,
    status: "Payment Successful",
  };
}

export function rejectPayment(payment: MockPaymentSession): MockPaymentSession {
  return {
    ...payment,
    status: "Payment Rejected",
  };
}
