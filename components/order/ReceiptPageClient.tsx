"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle, Clock, ShoppingBag } from "lucide-react";
import { getSessionOrder } from "@/lib/session-orders";
import { getStoredPayment } from "@/lib/mock-payment-store";
import { ReceiptCard } from "./ReceiptCard";
import type { OrderWithItems } from "@/lib/mock-data";

interface Props {
  orderCode: string;
  /** Order resolved server-side from MOCK_ORDERS (null if not a demo order). */
  serverOrder: OrderWithItems | null;
}

export function ReceiptPageClient({ orderCode, serverOrder }: Props) {
  // Start with whatever the server found; check session storage on mount as
  // fallback for orders placed during this browser session.
  const [order, setOrder] = useState<OrderWithItems | null>(serverOrder);
  const [isAwaitingApproval, setIsAwaitingApproval] = useState(false);

  useEffect(() => {
    const sessionOrder = getSessionOrder(orderCode);
    const storedPayment = getStoredPayment(orderCode);
    const nextOrder = sessionOrder ?? serverOrder;
    if (nextOrder) setOrder(nextOrder);
    setIsAwaitingApproval(Boolean(storedPayment && storedPayment.status !== "Payment Successful"));
  }, [orderCode, serverOrder]);

  return (
    <main className="min-h-screen bg-[#FAFAF7]">
      <div className="mx-auto max-w-xl px-4 py-10">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className={`mx-auto mb-4 flex h-[60px] w-[60px] items-center justify-center rounded-full ${
            isAwaitingApproval ? "bg-[#FFF7E8]" : "bg-[#DDEFE3]"
          }`}>
            {isAwaitingApproval ? (
              <Clock size={30} className="text-[#9A6A18]" />
            ) : (
              <CheckCircle size={30} className="text-green-600" />
            )}
          </div>
          <h1 className="font-serif text-3xl font-normal text-[#111111]">
            {isAwaitingApproval ? "Receipt Pending" : order ? "Your Receipt" : "Order Placed!"}
          </h1>
          <p className="mt-1.5 text-sm text-textgray">
            {isAwaitingApproval
              ? "Your receipt will appear after admin payment approval."
              : order
              ? `Receipt for order ${order.order_code}`
              : `Order ${orderCode} has been received.`}
          </p>
        </div>

        {order && !isAwaitingApproval ? (
          <ReceiptCard order={order} />
        ) : isAwaitingApproval ? (
          <div className="rounded-[24px] border border-[#F0F0F0] bg-white p-6 text-center shadow-sm">
            <p className="font-serif text-lg font-normal text-[#111111]">
              Order {orderCode}
            </p>
            <p className="mt-2 text-sm text-textgray">
              Payment has been submitted and is waiting for admin confirmation.
            </p>
            <div className="mt-6 flex flex-col gap-2.5">
              <Link
                href="/track-order"
                className="flex h-[52px] items-center justify-center gap-2 rounded-full bg-[#111111] text-sm font-semibold text-white transition-opacity hover:opacity-80"
              >
                Track Order
              </Link>
              <Link
                href="/home"
                className="flex h-11 items-center justify-center gap-2 rounded-full border border-[#111111]/15 bg-white text-sm font-medium text-[#111111] transition-colors hover:border-[#111111]/30 hover:bg-[#FAFAF7]"
              >
                <ShoppingBag size={15} />
                Continue Shopping
              </Link>
            </div>
          </div>
        ) : (
          <div className="rounded-[24px] border border-[#F0F0F0] bg-white p-6 text-center shadow-sm">
            <p className="font-serif text-lg font-normal text-[#111111]">
              Order {orderCode}
            </p>
            <p className="mt-2 text-sm text-textgray">
              Your order has been submitted. We will confirm via Telegram shortly.
            </p>
            <p className="mt-2 text-xs text-textgray">
              Save your Order ID to track your order later.
            </p>

            <div className="mt-6 flex flex-col gap-2.5">
              <Link
                href="/track-order"
                className="flex h-[52px] items-center justify-center gap-2 rounded-full bg-[#111111] text-sm font-semibold text-white transition-opacity hover:opacity-80"
              >
                Track Order
              </Link>
              <Link
                href="/home"
                className="flex h-11 items-center justify-center gap-2 rounded-full border border-[#111111]/15 bg-white text-sm font-medium text-[#111111] transition-colors hover:border-[#111111]/30 hover:bg-[#FAFAF7]"
              >
                <ShoppingBag size={15} />
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
