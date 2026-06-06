"use client";

import type { OrderWithItems } from "@/lib/mock-data";
import { formatPrice, formatDateTime, formatDate } from "@/lib/utils";
import { Copy, Truck, Phone, Scissors, Check } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  EVENT_COUPON,
  hasCoupon,
  removeCoupon,
  saveCoupon,
} from "@/lib/coupons";

const DASH = "border-t border-dashed border-black/30";

export function ReceiptCard({ order }: { order: OrderWithItems }) {
  const [copied, setCopied] = useState(false);

  function copyOrderCode() {
    navigator.clipboard.writeText(order.order_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // Derive money lines from items (no backend fields for these).
  const subtotal = order.items.reduce((s, i) => s + i.total_price, 0);
  const deliveryFee = Math.max(0, order.total_amount - subtotal);
  const discount = Math.max(0, subtotal + deliveryFee - order.total_amount);

  return (
    <div className="mx-auto max-w-sm">
      {/* ── Thermal receipt paper ── */}
      <div className="relative bg-white px-6 pb-8 pt-7 font-mono text-[13px] leading-relaxed text-black shadow-[0_1px_3px_rgba(0,0,0,0.12)] [clip-path:none]">
        {/* Store header */}
        <div className="text-center">
          <p className="text-lg font-bold tracking-[0.3em]">LUMIÈRE</p>
          <p className="mt-1 text-[11px] tracking-wide text-black/60">
            SKINCARE &amp; BEAUTY
          </p>
          <p className="mt-0.5 text-[11px] text-black/60">
            Phnom Penh · 012 345 678
          </p>
        </div>

        <div className={`my-4 ${DASH}`} />

        {/* Transaction meta */}
        <div className="space-y-1 text-[12px]">
          <Row label="ORDER ID" value={order.order_code} />
          <Row label="TXN" value={`TXN-${order.id}`} />
          {order.created_at && (
            <Row label="DATE" value={formatDateTime(order.created_at)} />
          )}
          <Row label="CUSTOMER" value={order.customer_name} />
          <Row label="DELIVERY" value={order.delivery_option} />
        </div>

        <div className={`my-4 ${DASH}`} />

        {/* Items */}
        <div className="space-y-2">
          {order.items.map((item) => (
            <div key={item.id}>
              <p className="uppercase">{item.product_name}</p>
              <div className="flex justify-between text-black/70">
                <span>
                  {item.quantity} x {formatPrice(item.unit_price)}
                </span>
                <span className="text-black">{formatPrice(item.total_price)}</span>
              </div>
            </div>
          ))}
        </div>

        <div className={`my-4 ${DASH}`} />

        {/* Totals */}
        <div className="space-y-1">
          <Row label="SUBTOTAL" value={formatPrice(subtotal)} mono />
          {discount > 0 && (
            <Row label="DISCOUNT" value={`-${formatPrice(discount)}`} mono />
          )}
          <Row label="DELIVERY" value={formatPrice(deliveryFee)} mono />
          <div className={`my-2 ${DASH}`} />
          <div className="flex justify-between text-[15px] font-bold">
            <span>TOTAL</span>
            <span>{formatPrice(order.total_amount)}</span>
          </div>
        </div>

        <div className={`my-4 ${DASH}`} />

        {/* Payment */}
        <div className="space-y-1 text-[12px]">
          <Row label="PAYMENT" value={order.payment_status} />
          <Row label="STATUS" value={order.order_status} />
        </div>

        <div className={`my-4 ${DASH}`} />

        {/* Policy + thanks */}
        <div className="text-center text-[11px] leading-relaxed text-black/70">
          <p className="font-semibold text-black">RETURN &amp; EXCHANGE</p>
          <p className="mt-1">
            Unopened items may be returned within 7 days with this receipt.
            Exchanges subject to stock availability.
          </p>
        </div>

        <p className="mt-4 text-center text-[12px] font-semibold tracking-wide">
          ★ THANK YOU FOR SHOPPING ★
        </p>

        {/* Barcode + QR placeholders */}
        <div className="mt-5 flex flex-col items-center gap-2">
          <Barcode />
          <p className="text-[10px] tracking-[0.25em] text-black/70">
            {order.order_code}
          </p>
          <div className="mt-1 grid h-16 w-16 grid-cols-5 grid-rows-5 gap-0.5">
            {QR_CELLS.map((on, i) => (
              <span
                key={i}
                className={on ? "bg-black" : "bg-transparent"}
              />
            ))}
          </div>
          <p className="text-[10px] text-black/50">Scan to track order</p>
        </div>

        {/* Actions (screen only) */}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={copyOrderCode}
            className="flex items-center gap-1.5 rounded-full border border-black/20 px-3 py-2 text-[11px] hover:bg-black/5"
          >
            <Copy size={12} />
            {copied ? "Copied!" : "Copy ID"}
          </button>
          <Link
            href="/track-order"
            className="flex items-center gap-1.5 rounded-full border border-black/20 px-3 py-2 text-[11px] hover:bg-black/5"
          >
            <Truck size={12} />
            Track
          </Link>
          <a
            href="tel:012345678"
            className="flex items-center gap-1.5 rounded-full border border-black/20 px-3 py-2 text-[11px] hover:bg-black/5"
          >
            <Phone size={12} />
            Contact
          </a>
        </div>
      </div>

      {/* ── Event coupon (only when active) ── */}
      {EVENT_COUPON.active && <CouponStub />}
    </div>
  );
}

function Row({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex justify-between gap-3">
      <span className="shrink-0 text-black/60">{label}</span>
      <span className={`text-right ${mono ? "" : "uppercase"}`}>{value}</span>
    </div>
  );
}

function Barcode() {
  return (
    <div className="flex h-10 items-end gap-[2px]" aria-hidden>
      {BARCODE_WIDTHS.map((w, i) => (
        <span
          key={i}
          className="block h-full bg-black"
          style={{ width: w }}
        />
      ))}
    </div>
  );
}

function CouponStub() {
  const [saved, setSaved] = useState(false);
  const [detaching, setDetaching] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [undoVisible, setUndoVisible] = useState(false);
  const lineRef = useRef<HTMLDivElement>(null);
  const undoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reflect prior saves (prevents cutting the same coupon twice).
  useEffect(() => {
    if (hasCoupon(EVENT_COUPON.code)) {
      setSaved(true);
      setProgress(1);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (undoTimer.current) window.clearTimeout(undoTimer.current);
    };
  }, []);

  function progressFromPointer(clientX: number) {
    const rect = lineRef.current?.getBoundingClientRect();
    if (!rect) return 0;
    return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  }

  function completeCut() {
    if (saved || detaching) return;
    setDragging(false);
    setProgress(1);
    setDetaching(true);
    saveCoupon({
      code: EVENT_COUPON.code,
      title: EVENT_COUPON.title,
      description: EVENT_COUPON.description,
      expiry: EVENT_COUPON.expiry,
    });
    setTimeout(() => {
      setDetaching(false);
      setSaved(true);
      setUndoVisible(true);
      undoTimer.current = setTimeout(() => setUndoVisible(false), 5000);
    }, 560);
  }

  function cancelCut() {
    setDragging(false);
    setProgress(0);
  }

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (saved || detaching) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
    setProgress(progressFromPointer(event.clientX));
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!dragging || saved || detaching) return;
    event.preventDefault();
    const next = progressFromPointer(event.clientX);
    setProgress(next);
    if (next >= 0.9) completeCut();
  }

  function onPointerUp(event: React.PointerEvent<HTMLDivElement>) {
    if (!dragging) return;
    event.preventDefault();
    const next = progressFromPointer(event.clientX);
    if (next >= 0.9) completeCut();
    else cancelCut();
  }

  function undoCut() {
    if (undoTimer.current) window.clearTimeout(undoTimer.current);
    removeCoupon(EVENT_COUPON.code);
    setSaved(false);
    setDetaching(false);
    setDragging(false);
    setUndoVisible(false);
    setProgress(0);
  }

  return (
    <div className="relative mt-0">
      {/* Perforated cut line with draggable scissors */}
      <div className="relative select-none py-3 [touch-action:none]">
        {/* notches */}
        <span className="absolute -left-3 h-6 w-6 rounded-full bg-[#FAFAF7]" />
        <span className="absolute -right-3 h-6 w-6 rounded-full bg-[#FAFAF7]" />
        <div
          ref={lineRef}
          className="relative mx-3 h-8"
          aria-label="Drag scissors across the perforated line to save coupon"
        >
          <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 border-t border-dashed border-black/40" />
          <div
            className={[
              "absolute left-0 top-1/2 h-px -translate-y-1/2 border-t border-dashed border-black transition-[width]",
              dragging ? "animate-pulse" : "",
            ].join(" ")}
            style={{ width: `${progress * 100}%` }}
          />
          {!saved && !detaching && (
            <div
              role="button"
              tabIndex={0}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={cancelCut}
              className="absolute top-1/2 flex h-9 w-9 -translate-y-1/2 cursor-grab items-center justify-center rounded-full border border-black/20 bg-white text-black shadow-sm active:cursor-grabbing"
              style={{
                left: `calc(${progress * 100}% - ${progress * 36}px)`,
              }}
            >
              <Scissors
                size={18}
                className={dragging ? "rotate-12" : "rotate-90"}
              />
            </div>
          )}
          <span className="absolute right-0 top-full mt-0.5 text-[10px] text-black/45">
            {Math.round(progress * 100)}%
          </span>
        </div>
      </div>

      {/* Detachable coupon */}
      <div
        className={[
          "origin-top bg-white px-6 py-5 text-center font-mono text-black shadow-[0_1px_3px_rgba(0,0,0,0.12)] transition-all duration-500",
          detaching
            ? "translate-y-10 rotate-1 opacity-0"
            : saved
            ? "hidden"
            : "translate-y-0 rotate-0 opacity-100",
        ].join(" ")}
      >
        <p className="text-[11px] font-semibold tracking-[0.3em] text-black/60">
          {EVENT_COUPON.title.toUpperCase()}
        </p>
        <p className="mt-2 text-2xl font-bold">{EVENT_COUPON.description}</p>
        <div className="mt-3 inline-block border border-dashed border-black px-4 py-1.5 text-base font-bold tracking-[0.25em]">
          {EVENT_COUPON.code}
        </div>
        <p className="mt-3 text-[11px] text-black/60">
          Valid until {formatDate(EVENT_COUPON.expiry)}
        </p>
        <p className="mt-4 text-[11px] text-black/55">
          Hold the scissors and drag across the line to save.
        </p>
      </div>

      {/* Success state */}
      {saved && !detaching && (
        <div className="animate-menu-in bg-white px-6 py-6 text-center font-mono text-black shadow-[0_1px_3px_rgba(0,0,0,0.12)]">
          <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-black">
            <Check size={20} className="text-white" />
          </div>
          <p className="text-sm font-semibold">Coupon saved to My Coupons.</p>
          <p className="mt-1 text-[11px] text-black/60">
            {EVENT_COUPON.code} · {EVENT_COUPON.description}
          </p>
          {undoVisible && (
            <button
              onClick={undoCut}
              className="mt-3 rounded-full bg-black px-4 py-2 text-[11px] font-semibold text-white hover:opacity-80"
            >
              Undo
            </button>
          )}
          <Link
            href="/coupons"
            className="mt-3 inline-block rounded-full border border-black/20 px-4 py-2 text-[11px] hover:bg-black/5"
          >
            View My Coupons
          </Link>
        </div>
      )}
    </div>
  );
}

// Deterministic decorative patterns (no randomness → stable SSR/CSR).
const BARCODE_WIDTHS = [
  2, 1, 3, 1, 2, 2, 1, 4, 1, 2, 3, 1, 1, 2, 4, 1, 2, 1, 3, 2, 1, 1, 3, 2, 1, 4,
  1, 2, 1, 3, 2, 1,
].map((n) => `${n}px`);

// 5x5 QR-like placeholder.
const QR_CELLS = [
  1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 1,
].map(Boolean);
