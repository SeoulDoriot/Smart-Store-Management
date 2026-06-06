"use client";

import { getSessionOrders, updateSessionOrder } from "@/lib/session-orders";
import type { OrderWithItems } from "@/lib/mock-data";
import type { PaymentStatus } from "@/types/order";
import type { MockPaymentSession, PaymentChannel } from "@/lib/payments";

const KEY = "lumiere-mock-payments";

export type StoredMockPayment = MockPaymentSession & {
  customerName: string;
  customerPhone: string;
  submittedAt?: string;
  reviewedAt?: string;
};

function load(): StoredMockPayment[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as StoredMockPayment[]) : [];
  } catch {
    return [];
  }
}

function persist(payments: StoredMockPayment[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(payments));
}

function toOrderPaymentStatus(status: MockPaymentSession["status"]): PaymentStatus {
  if (status === "Payment Successful") return "Payment Successful";
  if (status === "Payment Submitted" || status === "Checking Payment") return "Payment Submitted";
  if (status === "Payment Rejected") return "Payment Rejected";
  return "Payment Pending";
}

function syncOrderPayment(payment: StoredMockPayment) {
  updateSessionOrder(payment.orderCode, {
    payment_status: toOrderPaymentStatus(payment.status),
  });
}

export function getStoredPayments(): StoredMockPayment[] {
  return load().sort((a, b) => (b.submittedAt ?? "").localeCompare(a.submittedAt ?? ""));
}

export function getStoredPayment(orderCode: string): StoredMockPayment | null {
  return load().find((payment) => payment.orderCode === orderCode) ?? null;
}

export function saveStoredPayment(
  payment: MockPaymentSession,
  order: OrderWithItems
): StoredMockPayment {
  const payments = load().filter((item) => item.orderCode !== payment.orderCode);
  const stored: StoredMockPayment = {
    ...payment,
    customerName: order.customer_name,
    customerPhone: order.customer_phone,
  };
  persist([...payments, stored]);
  syncOrderPayment(stored);
  return stored;
}

export function submitStoredPayment(
  payment: MockPaymentSession,
  order: OrderWithItems
): StoredMockPayment {
  const stored = saveStoredPayment(
    {
      ...payment,
      status: "Payment Submitted",
    },
    order
  );
  const submitted = { ...stored, submittedAt: new Date().toISOString() };
  persist([...load().filter((item) => item.orderCode !== submitted.orderCode), submitted]);
  syncOrderPayment(submitted);
  return submitted;
}

export function approveStoredPayment(orderCode: string): StoredMockPayment | null {
  const payments = load();
  const existing = payments.find((payment) => payment.orderCode === orderCode);
  if (!existing) return null;
  const approved: StoredMockPayment = {
    ...existing,
    status: "Payment Successful",
    reviewedAt: new Date().toISOString(),
  };
  persist([...payments.filter((payment) => payment.orderCode !== orderCode), approved]);
  syncOrderPayment(approved);
  return approved;
}

export function rejectStoredPayment(orderCode: string): StoredMockPayment | null {
  const payments = load();
  const existing = payments.find((payment) => payment.orderCode === orderCode);
  if (!existing) return null;
  const rejected: StoredMockPayment = {
    ...existing,
    status: "Payment Rejected",
    reviewedAt: new Date().toISOString(),
  };
  persist([...payments.filter((payment) => payment.orderCode !== orderCode), rejected]);
  syncOrderPayment(rejected);
  return rejected;
}

export function getSessionOrdersWithPaymentStatus(): OrderWithItems[] {
  return getSessionOrders().map((order) => {
    const payment = getStoredPayment(order.order_code);
    return payment
      ? { ...order, payment_status: toOrderPaymentStatus(payment.status) }
      : order;
  });
}

export function getStoredPaymentMethod(orderCode: string): PaymentChannel | null {
  return getStoredPayment(orderCode)?.method ?? null;
}
