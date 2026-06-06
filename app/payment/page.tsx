"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Check,
  CheckCircle2,
  Clipboard,
  Download,
  FileImage,
  LockKeyhole,
  QrCode,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { AnnouncementBar } from "@/components/home/AnnouncementBar";
import { Header } from "@/components/home/Header";
import { NavigationBar } from "@/components/home/NavigationBar";
import { HomeFooter } from "@/components/home/HomeFooter";
import { getOrderByCode } from "@/lib/orders";
import { getSessionOrder } from "@/lib/session-orders";
import {
  approveStoredPayment,
  getStoredPayment,
  rejectStoredPayment,
  saveStoredPayment,
  submitStoredPayment,
} from "@/lib/mock-payment-store";
import { formatPrice } from "@/lib/utils";
import {
  PAYMENT_METHODS,
  PAYMENT_TIMELINE,
  approvePayment,
  createPayment,
  getDeliveryFee,
  rejectPayment,
  submitPaymentProof,
  verifyPaymentMock,
  type MockPaymentSession,
  type PaymentChannel,
  type PaymentFlowStatus,
} from "@/lib/payments";
import type { OrderWithItems } from "@/lib/mock-data";

const FALLBACK_ORDER = "ORD-1004";

function statusTone(status: PaymentFlowStatus) {
  if (status === "Payment Successful") return "bg-[#DDEFE3] text-green-700";
  if (status === "Payment Rejected") return "bg-[#FDECEA] text-red-600";
  if (status === "Checking Payment") return "bg-[#EAF0FF] text-blue-700";
  if (status === "Payment Submitted") return "bg-[#F6EAFE] text-[#7A4D9E]";
  return "bg-[#FFF7E8] text-[#9A6A18]";
}

function paymentSupportsQr(method: PaymentChannel) {
  return !["Cash on Delivery", "Pay at Store"].includes(method);
}

function buildQrSvg(payment: MockPaymentSession) {
  const label = `${payment.method} ${payment.orderCode} ${payment.amount}`;
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="720" height="720" viewBox="0 0 720 720">
      <rect width="720" height="720" rx="42" fill="#fffaf7"/>
      <rect x="52" y="52" width="616" height="616" rx="34" fill="#ffffff" stroke="#111111" stroke-opacity=".08" stroke-width="8"/>
      <g fill="#111111">
        <rect x="110" y="110" width="150" height="150" rx="18"/>
        <rect x="460" y="110" width="150" height="150" rx="18"/>
        <rect x="110" y="460" width="150" height="150" rx="18"/>
        <rect x="145" y="145" width="80" height="80" rx="10" fill="#fff"/>
        <rect x="495" y="145" width="80" height="80" rx="10" fill="#fff"/>
        <rect x="145" y="495" width="80" height="80" rx="10" fill="#fff"/>
        <rect x="318" y="120" width="46" height="46" rx="8"/>
        <rect x="372" y="174" width="40" height="92" rx="8"/>
        <rect x="306" y="306" width="52" height="52" rx="8"/>
        <rect x="386" y="306" width="96" height="44" rx="8"/>
        <rect x="306" y="396" width="42" height="132" rx="8"/>
        <rect x="382" y="404" width="56" height="56" rx="8"/>
        <rect x="462" y="392" width="120" height="42" rx="8"/>
        <rect x="468" y="478" width="46" height="108" rx="8"/>
        <rect x="548" y="512" width="54" height="54" rx="8"/>
      </g>
      <text x="360" y="658" font-family="Inter, Arial" font-size="22" text-anchor="middle" fill="#6b7280">${label}</text>
    </svg>`;
}

function PaymentContent() {
  const params = useSearchParams();
  const orderCode = params.get("order") ?? FALLBACK_ORDER;
  const order =
    getOrderByCode(orderCode) ??
    getSessionOrder(orderCode) ??
    getOrderByCode(FALLBACK_ORDER);
  const [method, setMethod] = useState<PaymentChannel>(() => {
    if (!order) return "KHQR / Bakong";
    return getStoredPayment(order.order_code)?.method ?? "KHQR / Bakong";
  });
  const [reference, setReference] = useState("");
  const [proofName, setProofName] = useState("");
  const [copied, setCopied] = useState(false);

  const [payment, setPayment] = useState<MockPaymentSession | null>(() => {
    if (!order) return null;
    return getStoredPayment(order.order_code) ?? createPayment(order, "KHQR / Bakong");
  });

  const deliveryFee = order ? getDeliveryFee(order) : 0;
  const subtotal = order?.items?.reduce((sum, item) => sum + item.total_price, 0) ?? 0;
  const isQrMethod = payment ? paymentSupportsQr(payment.method) : false;
  const isSuccessful = payment?.status === "Payment Successful";
  const isRejected = payment?.status === "Payment Rejected";

  const qrDataUrl = useMemo(() => {
    if (!payment) return "";
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(buildQrSvg(payment))}`;
  }, [payment]);

  function changeMethod(next: PaymentChannel) {
    setMethod(next);
    if (order) {
      const nextPayment = createPayment(order, next);
      setPayment(saveStoredPayment(nextPayment, order));
    }
    setCopied(false);
  }

  async function copyOrderId() {
    if (!payment) return;
    await navigator.clipboard.writeText(payment.orderCode);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  function handlePaid() {
    if (!payment || !order) return;
    const submitted = submitPaymentProof(payment, {
      transactionReference: reference.trim() || undefined,
      proofFileName: proofName || undefined,
    });
    const checked = verifyPaymentMock(submitted);
    setPayment(checked);
    window.setTimeout(() => {
      const stored = submitStoredPayment(submitted, order);
      setPayment(stored);
    }, 700);
  }

  function approve() {
    if (!payment) return;
    setPayment(approvePayment(payment));
    window.setTimeout(() => {
      setPayment(approveStoredPayment(payment.orderCode) ?? approvePayment(payment));
    }, 250);
  }

  function reject() {
    if (!payment) return;
    setPayment(rejectPayment(payment));
    window.setTimeout(() => {
      setPayment(rejectStoredPayment(payment.orderCode) ?? rejectPayment(payment));
    }, 250);
  }

  if (!order || !payment) {
    return (
      <main className="min-h-[60vh] bg-[#FAFAF7] px-4 py-16">
        <div className="mx-auto max-w-md rounded-[24px] border border-[#F0F0F0] bg-white p-8 text-center shadow-sm">
          <h1 className="font-serif text-2xl text-[#111111]">Order not found</h1>
          <p className="mt-2 text-sm text-textgray">
            We could not find this mock order. Try opening payment from checkout.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAFAF7] px-4 py-8 md:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="reveal-up">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-textgray">
              Secure Checkout
            </p>
            <h1 className="mt-2 font-serif text-3xl font-normal text-[#111111] md:text-4xl">
              Payment
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-textgray">
              Complete your payment using the selected method, then submit proof for review.
            </p>
          </div>
          <span className={`w-fit rounded-full px-4 py-2 text-xs font-semibold ${statusTone(payment.status)}`}>
            {payment.status}
          </span>
        </div>

        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="space-y-5">
            <div className="premium-surface reveal-up rounded-[24px] p-5">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-xl font-normal text-[#111111]">
                    Order Summary
                  </h2>
                  <p className="mt-1 text-xs text-textgray">{order.order_code}</p>
                </div>
                <ShieldCheck size={22} className="text-green-600" />
              </div>

              <div className="space-y-3">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex gap-3 rounded-[16px] bg-white/70 p-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-br from-[#EED4CB] to-[#FAF0EC] font-serif text-lg text-[#A76F63]">
                      L
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-1 text-sm font-medium text-[#111111]">
                        {item.product_name}
                      </p>
                      <p className="mt-1 text-xs text-textgray">
                        Qty {item.quantity} x {formatPrice(item.unit_price)}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-[#111111]">
                      {formatPrice(item.total_price)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 space-y-2 border-t border-[#111111]/10 pt-4 text-sm">
                <div className="flex justify-between text-textgray">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-textgray">
                  <span>Delivery fee</span>
                  <span>{deliveryFee === 0 ? "Free" : formatPrice(deliveryFee)}</span>
                </div>
                <div className="flex items-baseline justify-between pt-2">
                  <span className="font-semibold text-[#111111]">Total amount</span>
                  <span className="font-serif text-2xl text-[#111111]">
                    {formatPrice(order.total_amount)}
                  </span>
                </div>
              </div>
            </div>

            <div className="reveal-up stagger-2 rounded-[24px] border border-[#F0F0F0] bg-white p-5 shadow-sm">
              <h2 className="font-serif text-xl font-normal text-[#111111]">
                Payment Method
              </h2>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {PAYMENT_METHODS.map((item) => (
                  <button
                    key={item}
                    onClick={() => changeMethod(item)}
                    className={`motion-press rounded-2xl border px-3 py-3 text-left text-xs font-semibold transition-colors ${
                      method === item
                        ? "border-[#111111] bg-[#111111] text-white"
                        : "border-[#EBEBEB] bg-[#FAFAF7] text-textgray hover:border-[#111111]/30 hover:text-[#111111]"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="space-y-5">
            <div className="premium-surface reveal-up stagger-2 rounded-[28px] p-5 md:p-6">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-textgray">
                    {payment.method}
                  </p>
                  <h2 className="mt-1 font-serif text-2xl font-normal text-[#111111]">
                    {isQrMethod ? "Scan to Pay" : payment.method}
                  </h2>
                </div>
                <QrCode size={24} className="text-[#111111]" />
              </div>

              {isQrMethod ? (
                <div className="mx-auto flex aspect-square w-full max-w-[340px] items-center justify-center rounded-[28px] border border-[#111111]/10 bg-white p-6 shadow-[0_24px_80px_rgba(17,17,17,0.08)]">
                  <img src={qrDataUrl} alt={`${payment.method} QR placeholder`} className="h-full w-full rounded-[18px]" />
                </div>
              ) : (
                <div className="rounded-[24px] border border-[#111111]/10 bg-white p-6 text-center">
                  <LockKeyhole className="mx-auto text-[#111111]" size={32} />
                  <p className="mt-3 font-serif text-xl text-[#111111]">
                    No QR required
                  </p>
                  <p className="mt-2 text-sm leading-6 text-textgray">
                    Choose this option if you want to pay when receiving your order or at the Lumière store.
                  </p>
                </div>
              )}

              <div className="mt-5 grid gap-3 rounded-[20px] bg-white/70 p-4 text-sm sm:grid-cols-3">
                <div>
                  <p className="text-xs text-textgray">Total</p>
                  <p className="font-semibold text-[#111111]">{formatPrice(payment.amount)}</p>
                </div>
                <div>
                  <p className="text-xs text-textgray">Order ID</p>
                  <p className="font-semibold text-[#111111]">{payment.orderCode}</p>
                </div>
                <div>
                  <p className="text-xs text-textgray">Payment</p>
                  <p className="font-semibold text-[#111111]">{payment.id}</p>
                </div>
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                <button
                  onClick={copyOrderId}
                  className="motion-press inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#111111]/15 bg-white text-sm font-semibold text-[#111111] hover:bg-[#FAFAF7]"
                >
                  {copied ? <Check size={15} /> : <Clipboard size={15} />}
                  {copied ? "Copied" : "Copy Order ID"}
                </button>
                <a
                  href={qrDataUrl}
                  download={`${payment.orderCode}-${payment.method.replaceAll(" ", "-")}-QR.svg`}
                  className={`motion-press inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#111111]/15 bg-white text-sm font-semibold text-[#111111] hover:bg-[#FAFAF7] ${
                    !isQrMethod ? "pointer-events-none opacity-40" : ""
                  }`}
                >
                  <Download size={15} />
                  Download QR
                </a>
                <button
                  onClick={handlePaid}
                  disabled={isSuccessful}
                  className="motion-press inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#111111] text-sm font-semibold text-white hover:opacity-85 disabled:opacity-40"
                >
                  <CheckCircle2 size={15} />
                  I have paid
                </button>
              </div>
            </div>

            {(payment.status === "Payment Submitted" || payment.status === "Checking Payment") && (
              <div className="reveal-soft rounded-[20px] border border-[#E8DDF5] bg-[#FBF7FF] p-4">
                <p className="font-semibold text-[#111111]">Your payment is being checked.</p>
                <p className="mt-1 text-sm text-textgray">
                  You will receive receipt after confirmation.
                </p>
              </div>
            )}

            {isRejected && (
              <div className="reveal-soft rounded-[20px] border border-[#F8D8D4] bg-[#FFF7F6] p-4">
                <p className="font-semibold text-red-600">Payment Rejected</p>
                <p className="mt-1 text-sm text-textgray">
                  Please check your amount, order ID, or transaction reference and submit again.
                </p>
              </div>
            )}

            {isSuccessful && (
              <div className="reveal-soft rounded-[20px] border border-[#DDEFE3] bg-[#F6FBF7] p-4">
                <p className="font-semibold text-green-700">Payment Successful</p>
                <p className="mt-1 text-sm text-textgray">
                  Your receipt is ready for this order.
                </p>
                <Link
                  href={`/receipt/${payment.orderCode}`}
                  className="motion-press mt-4 inline-flex h-11 items-center justify-center rounded-full bg-[#111111] px-5 text-sm font-semibold text-white"
                >
                  View Receipt
                </Link>
              </div>
            )}

            <div className="grid gap-5 md:grid-cols-2">
              <div className="rounded-[24px] border border-[#F0F0F0] bg-white p-5 shadow-sm">
                <h3 className="font-serif text-lg text-[#111111]">Payment Instruction</h3>
                <ol className="mt-4 space-y-3 text-sm text-textgray">
                  {[
                    "Scan the QR code",
                    "Pay the exact amount",
                    "Click “I have paid”",
                    "Wait for confirmation",
                  ].map((step, index) => (
                    <li key={step} className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#111111] text-xs font-bold text-white">
                        {index + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="rounded-[24px] border border-[#F0F0F0] bg-white p-5 shadow-sm">
                <h3 className="font-serif text-lg text-[#111111]">Payment Proof</h3>
                <label className="motion-press mt-4 flex cursor-pointer items-center gap-3 rounded-[18px] border border-dashed border-[#DADADA] bg-[#FAFAF7] p-4">
                  <FileImage size={20} className="text-textgray" />
                  <span className="min-w-0 text-sm text-textgray">
                    {proofName || "Upload screenshot placeholder"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => setProofName(event.target.files?.[0]?.name ?? "")}
                  />
                </label>
                <input
                  value={reference}
                  onChange={(event) => setReference(event.target.value)}
                  placeholder="Transaction reference"
                  className="mt-3 h-12 w-full rounded-2xl border border-[#EBEBEB] bg-white px-4 text-sm outline-none transition-colors focus:border-[#111111]/40"
                />
              </div>
            </div>

            <div className="rounded-[24px] border border-[#F0F0F0] bg-white p-5 shadow-sm">
              <h3 className="font-serif text-lg text-[#111111]">Payment Status</h3>
              <div className="mt-5 space-y-4">
                {PAYMENT_TIMELINE.map((step) => {
                  const active = payment.status === step;
                  const done =
                    PAYMENT_TIMELINE.indexOf(payment.status) >= PAYMENT_TIMELINE.indexOf(step) &&
                    payment.status !== "Payment Rejected";
                  return (
                    <div key={step} className="flex items-center gap-3">
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-full border ${
                          done
                            ? "border-[#111111] bg-[#111111] text-white"
                            : "border-[#E5E5E5] bg-white text-textgray"
                        }`}
                      >
                        {done ? <Check size={14} /> : <span className="h-2 w-2 rounded-full bg-current" />}
                      </span>
                      <span className={`text-sm ${active ? "font-semibold text-[#111111]" : "text-textgray"}`}>
                        {step}
                      </span>
                    </div>
                  );
                })}
                {payment.status === "Payment Rejected" && (
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FDECEA] text-red-600">
                      <XCircle size={15} />
                    </span>
                    <span className="text-sm font-semibold text-red-600">Payment Rejected</span>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-[24px] border border-[#F0F0F0] bg-white p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <LockKeyhole size={18} className="mt-0.5 shrink-0 text-green-700" />
                <p className="text-sm leading-6 text-textgray">
                  Your payment information is processed securely. This demo uses mock verification.
                </p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={approve}
                  className="motion-press rounded-full bg-[#DDEFE3] px-4 py-2 text-xs font-semibold text-green-700"
                >
                  Approve Payment
                </button>
                <button
                  onClick={reject}
                  className="motion-press rounded-full bg-[#FDECEA] px-4 py-2 text-xs font-semibold text-red-600"
                >
                  Reject Payment
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default function PaymentPage() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <NavigationBar />
      <Suspense>
        <PaymentContent />
      </Suspense>
      <HomeFooter />
    </>
  );
}
