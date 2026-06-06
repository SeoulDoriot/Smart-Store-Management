"use client";

import { useState } from "react";
import { findOrder, getDeliveryForOrder } from "@/lib/orders";
import { findSessionOrder } from "@/lib/session-orders";
import { getStoredPayment } from "@/lib/mock-payment-store";
import type { OrderWithItems } from "@/lib/mock-data";
import type { PaymentStatus } from "@/types/order";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatPrice, formatDate } from "@/lib/utils";
import { Search, Loader2, Package } from "lucide-react";

const TIMELINE_STEPS = [
  "Order Created",
  "Payment Successful",
  "Preparing",
  "Packing",
  "Ready for Delivery",
  "Delivering",
  "Completed",
] as const;

function toOrderPaymentStatus(status: string): PaymentStatus {
  if (status === "Payment Successful") return "Payment Successful";
  if (status === "Payment Rejected") return "Payment Rejected";
  if (status === "Payment Submitted" || status === "Checking Payment") return "Payment Submitted";
  return "Payment Pending";
}

function DeliveryTimeline({ currentStatus }: { currentStatus: string }) {
  const currentIndex = TIMELINE_STEPS.findIndex((s) => s === currentStatus);

  return (
    <div className="mt-4">
      <div className="relative">
        {TIMELINE_STEPS.map((step, i) => {
          const done = i <= currentIndex;
          const active = i === currentIndex;
          return (
            <div key={step} className="flex items-start gap-3 pb-4 last:pb-0">
              <div className="flex flex-col items-center">
                <div
                  className={`h-5 w-5 flex-shrink-0 rounded-full border-2 transition-colors ${
                    active
                      ? "border-textdark bg-textdark"
                      : done
                      ? "border-success bg-success"
                      : "border-bordergray bg-white"
                  }`}
                >
                  {done && !active && (
                    <svg className="h-full w-full text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                {i < TIMELINE_STEPS.length - 1 && (
                  <div className={`mt-0.5 h-6 w-0.5 ${done ? "bg-success" : "bg-bordergray"}`} />
                )}
              </div>
              <p className={`pt-0.5 text-sm ${active ? "font-medium text-textdark" : done ? "text-success" : "text-textgray"}`}>
                {step}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function TrackOrderForm() {
  const [orderCode, setOrderCode] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OrderWithItems | null | "not-found">(null);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!orderCode.trim() || !phone.trim()) return;
    setLoading(true);
    const found =
      (await findOrder(orderCode.trim(), phone.trim())) ??
      findSessionOrder(orderCode.trim(), phone.trim());
    const storedPayment = found ? getStoredPayment(found.order_code) : null;
    setResult(
      found
        ? {
            ...found,
            payment_status: storedPayment
              ? toOrderPaymentStatus(storedPayment.status)
              : found.payment_status,
          }
        : "not-found"
    );
    setLoading(false);
  }

  const delivery =
    result && result !== "not-found"
      ? getDeliveryForOrder(result.id)
      : null;

  return (
    <div className="space-y-4">
      <form
        onSubmit={handleSearch}
        className="rounded-card border border-bordergray bg-white p-6"
      >
        <div className="space-y-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-textdark">
              Order ID
            </label>
            <input
              className="h-11 w-full rounded-xl border border-bordergray bg-white px-4 text-sm text-textdark placeholder-textgray focus:border-textdark focus:outline-none"
              placeholder="e.g. ORD-1001"
              value={orderCode}
              onChange={(e) => setOrderCode(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-textdark">
              Phone Number
            </label>
            <input
              className="h-11 w-full rounded-xl border border-bordergray bg-white px-4 text-sm text-textdark placeholder-textgray focus:border-textdark focus:outline-none"
              placeholder="e.g. 012345678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-textdark font-medium text-white transition-opacity hover:opacity-80 disabled:opacity-60"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
            {loading ? "Searching…" : "Track Order"}
          </button>
        </div>
      </form>

      {/* Results */}
      {result === "not-found" && (
        <div className="rounded-card border border-bordergray bg-white p-6 text-center">
          <Package size={32} className="mx-auto mb-3 text-textgray" />
          <p className="font-medium text-textdark">Order not found</p>
          <p className="mt-1 text-sm text-textgray">
            We could not find your order. Please check your Order ID and phone number.
          </p>
          <p className="mt-3 text-xs text-textgray">
            Demo: try ORD-1001 / 012345678 or ORD-1002 / 098765432
          </p>
        </div>
      )}

      {result && result !== "not-found" && (
        <div className="rounded-card border border-bordergray bg-white">
          {/* Header */}
          <div className="border-b border-bordergray px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-textgray">Order</p>
                <p className="font-semibold text-textdark">{result.order_code}</p>
              </div>
              <StatusBadge status={result.order_status} />
            </div>
            <p className="mt-1 text-sm text-textgray">{result.customer_name}</p>
          </div>

          {/* Status grid */}
          <div className="grid grid-cols-3 divide-x divide-bordergray border-b border-bordergray">
            <div className="px-4 py-3 text-center">
              <p className="text-xs text-textgray">Order</p>
              <div className="mt-1 flex justify-center">
                <StatusBadge status={result.order_status} />
              </div>
            </div>
            <div className="px-4 py-3 text-center">
              <p className="text-xs text-textgray">Payment</p>
              <div className="mt-1 flex justify-center">
                <StatusBadge status={result.payment_status} />
              </div>
            </div>
            <div className="px-4 py-3 text-center">
              <p className="text-xs text-textgray">Delivery</p>
              <div className="mt-1 flex justify-center">
                <StatusBadge status={result.delivery_status} />
              </div>
            </div>
          </div>

          {/* Delivery info */}
          {delivery && (
            <div className="border-b border-bordergray px-6 py-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-textgray mb-3">
                Delivery Info
              </p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                {delivery.tracking_code && (
                  <>
                    <p className="text-textgray">Tracking</p>
                    <p className="font-medium text-textdark">{delivery.tracking_code}</p>
                  </>
                )}
                {delivery.delivery_company && (
                  <>
                    <p className="text-textgray">Company</p>
                    <p className="text-textdark">{delivery.delivery_company}</p>
                  </>
                )}
                {delivery.rider_name && (
                  <>
                    <p className="text-textgray">Rider</p>
                    <p className="text-textdark">{delivery.rider_name} · {delivery.rider_phone}</p>
                  </>
                )}
                {delivery.estimated_delivery_date && (
                  <>
                    <p className="text-textgray">Est. Delivery</p>
                    <p className="text-textdark">{formatDate(delivery.estimated_delivery_date)}</p>
                  </>
                )}
                {delivery.delivery_note && (
                  <>
                    <p className="text-textgray">Note</p>
                    <p className="text-textdark">{delivery.delivery_note}</p>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="px-6 py-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-textgray mb-3">
              Timeline
            </p>
            <DeliveryTimeline currentStatus={result.delivery_status} />
          </div>

          {/* Items */}
          <div className="border-t border-bordergray px-6 py-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-textgray mb-3">
              Items
            </p>
            <ul className="space-y-1">
              {result.items.map((item) => (
                <li key={item.id} className="flex justify-between text-sm">
                  <span className="text-textdark">
                    {item.product_name} × {item.quantity}
                  </span>
                  <span className="text-textgray">{formatPrice(item.total_price)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex justify-between border-t border-bordergray pt-2 text-sm font-semibold">
              <span>Total</span>
              <span>{formatPrice(result.total_amount)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
