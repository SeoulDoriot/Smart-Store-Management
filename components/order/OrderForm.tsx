"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { saveSessionOrder } from "@/lib/session-orders";
import { generateOrderCode } from "@/lib/orders";
import { MOCK_PRODUCTS } from "@/lib/mock-data";
import { getBrandName } from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import { Loader2, PackageCheck, ShoppingBag } from "lucide-react";
import type { OrderWithItems } from "@/lib/mock-data";
import type { DeliveryOption } from "@/types/order";

type FormState = {
  customer_name: string;
  customer_phone: string;
  customer_telegram: string;
  product_name: string;
  quantity: number;
  delivery_address: string;
  delivery_option: string;
  note: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const EMPTY: FormState = {
  customer_name: "",
  customer_phone: "",
  customer_telegram: "",
  product_name: "",
  quantity: 1,
  delivery_address: "",
  delivery_option: "Pickup at shop",
  note: "",
};

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-textdark">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "h-11 w-full rounded-xl border border-bordergray bg-white px-4 text-sm text-textdark placeholder-textgray focus:border-textdark focus:outline-none";

function computeDeliveryFee(option: string, subtotal: number): number {
  if (option === "Pickup at shop") return 0;
  if (option === "Delivery in Phnom Penh") return subtotal >= 30 ? 0 : 3;
  if (option === "Delivery to province") return subtotal >= 50 ? 0 : 5;
  return 0;
}

export function OrderForm({ defaultProduct }: { defaultProduct?: string }) {
  const router = useRouter();
  const { cart, clearCart } = useStore();

  // Resolve a pre-selected product from URL param
  const selectedProduct = defaultProduct
    ? MOCK_PRODUCTS.find(
        (p) =>
          p.id === defaultProduct ||
          p.name.toLowerCase() === defaultProduct.toLowerCase()
      ) ?? null
    : null;

  // Build cart items with product data
  const cartItems = cart
    .map((item) => {
      const product = MOCK_PRODUCTS.find((p) => p.id === item.id);
      return product ? { product, qty: item.qty } : null;
    })
    .filter((x): x is { product: (typeof MOCK_PRODUCTS)[number]; qty: number } => x !== null);

  // Cart mode: cart has items and no single product was pre-selected via URL
  const isCartMode = cartItems.length > 0 && !defaultProduct;

  const [form, setForm] = useState<FormState>({
    ...EMPTY,
    product_name: selectedProduct?.name ?? defaultProduct ?? "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  function set(key: keyof FormState, value: string | number) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate(): boolean {
    const e: FormErrors = {};
    if (!form.customer_name.trim()) e.customer_name = "Name is required";
    if (!form.customer_phone.trim()) e.customer_phone = "Phone is required";
    if (!isCartMode && !form.product_name.trim())
      e.product_name = "Product is required";
    if (!isCartMode && form.quantity < 1)
      e.quantity = "Quantity must be at least 1";
    if (
      form.delivery_option !== "Pickup at shop" &&
      !form.delivery_address.trim()
    ) {
      e.delivery_address = "Address is required for delivery";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      const orderCode = generateOrderCode();
      const orderId = `sess-${orderCode}`;

      // Build order items
      let items: OrderWithItems["items"];
      let subtotal: number;

      if (isCartMode) {
        items = cartItems.map((ci, i) => ({
          id: `${orderId}-item-${i}`,
          order_id: orderId,
          product_id: ci.product.id,
          product_name: ci.product.name,
          quantity: ci.qty,
          unit_price: ci.product.price,
          total_price: ci.product.price * ci.qty,
        }));
        subtotal = items.reduce((s, i) => s + i.total_price, 0);
      } else {
        const product =
          selectedProduct ??
          MOCK_PRODUCTS.find(
            (p) => p.name.toLowerCase() === form.product_name.toLowerCase()
          ) ??
          null;
        const unitPrice = product?.price ?? 0;
        subtotal = unitPrice * form.quantity;
        items = [
          {
            id: `${orderId}-item-0`,
            order_id: orderId,
            product_id: product?.id ?? "",
            product_name: form.product_name,
            quantity: form.quantity,
            unit_price: unitPrice,
            total_price: subtotal,
          },
        ];
      }

      const deliveryFee = computeDeliveryFee(form.delivery_option, subtotal);
      const totalAmount = subtotal + deliveryFee;

      const order: OrderWithItems = {
        id: orderId,
        order_code: orderCode,
        customer_name: form.customer_name,
        customer_phone: form.customer_phone,
        customer_telegram: form.customer_telegram || undefined,
        delivery_address: form.delivery_address || undefined,
        delivery_option: form.delivery_option as DeliveryOption,
        note: form.note || undefined,
        total_amount: totalAmount,
        order_status: "New Order",
        payment_status: "Payment Pending",
        delivery_status: "Order Created",
        items,
        created_at: new Date().toISOString(),
      };

      saveSessionOrder(order);
      if (isCartMode) clearCart();
      router.push(`/payment?order=${orderCode}`);
    } catch {
      setLoading(false);
    }
  }

  const needsAddress = form.delivery_option !== "Pickup at shop";

  // Compute live subtotal for delivery-fee hint
  const liveSubtotal = isCartMode
    ? cartItems.reduce((s, ci) => s + ci.product.price * ci.qty, 0)
    : (selectedProduct?.price ?? 0) * form.quantity;
  const liveDeliveryFee = computeDeliveryFee(form.delivery_option, liveSubtotal);

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-card border border-bordergray bg-white p-6"
    >
      <Field label="Full Name" required>
        <input
          className={`${inputCls} ${errors.customer_name ? "border-red-400" : ""}`}
          placeholder="e.g. Sreyka Chan"
          value={form.customer_name}
          onChange={(e) => set("customer_name", e.target.value)}
        />
        {errors.customer_name && (
          <p className="text-xs text-red-500">{errors.customer_name}</p>
        )}
      </Field>

      <Field label="Phone Number" required>
        <input
          className={`${inputCls} ${errors.customer_phone ? "border-red-400" : ""}`}
          placeholder="e.g. 012 345 678"
          value={form.customer_phone}
          onChange={(e) => set("customer_phone", e.target.value)}
        />
        {errors.customer_phone && (
          <p className="text-xs text-red-500">{errors.customer_phone}</p>
        )}
      </Field>

      <Field label="Telegram Username or Phone">
        <input
          className={inputCls}
          placeholder="e.g. @username or 012 345 678"
          value={form.customer_telegram}
          onChange={(e) => set("customer_telegram", e.target.value)}
        />
      </Field>

      {/* ── Product / Cart items ────────────────────────────────────────── */}
      {isCartMode ? (
        <div className="rounded-[22px] border border-[#ECE8E3] bg-[#FAFAF7] p-4">
          <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-textgray">
            <ShoppingBag size={12} />
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in
            your bag
          </div>
          <div className="space-y-2">
            {cartItems.map(({ product, qty }) => (
              <div
                key={product.id}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <span className="line-clamp-1 text-textdark">
                  {product.name}{" "}
                  <span className="text-textgray">× {qty}</span>
                </span>
                <span className="shrink-0 font-medium text-[#111111]">
                  {formatPrice(product.price * qty)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-baseline justify-between border-t border-[#ECE8E3] pt-2.5 text-sm">
            <span className="text-textgray">Subtotal</span>
            <span className="font-semibold text-[#111111]">
              {formatPrice(liveSubtotal)}
            </span>
          </div>
        </div>
      ) : (
        <Field label="Product" required>
          {selectedProduct && (
            <div className="mb-3 rounded-[22px] border border-[#ECE8E3] bg-gradient-to-br from-[#FDFCFA] to-[#F7EEE6] p-4">
              <div className="flex gap-4">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[18px] bg-gradient-to-b from-[#EED4CB] to-[#C9968B]">
                  <span className="font-serif text-4xl font-light text-white/35">
                    {getBrandName(selectedProduct.brand_id)
                      .slice(0, 2)
                      .toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.78] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-textgray">
                    <PackageCheck size={12} />
                    Selected Product
                  </div>
                  <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-textgray">
                    {getBrandName(selectedProduct.brand_id)}
                  </p>
                  <p className="mt-1 line-clamp-2 font-serif text-lg leading-tight text-[#111111]">
                    {selectedProduct.name}
                  </p>
                  <p className="mt-1 text-sm font-bold text-[#111111]">
                    {formatPrice(selectedProduct.price)}
                  </p>
                </div>
              </div>
            </div>
          )}
          <input
            className={`${inputCls} ${errors.product_name ? "border-red-400" : ""}`}
            placeholder="Product name"
            value={form.product_name}
            onChange={(e) => set("product_name", e.target.value)}
          />
          {errors.product_name && (
            <p className="text-xs text-red-500">{errors.product_name}</p>
          )}
        </Field>
      )}

      {!isCartMode && (
        <Field label="Quantity" required>
          <input
            type="number"
            min={1}
            className={`${inputCls} ${errors.quantity ? "border-red-400" : ""}`}
            value={form.quantity}
            onChange={(e) => set("quantity", Number(e.target.value))}
          />
          {errors.quantity && (
            <p className="text-xs text-red-500">{errors.quantity}</p>
          )}
        </Field>
      )}

      <Field label="Delivery Option" required>
        <select
          className={inputCls}
          value={form.delivery_option}
          onChange={(e) => set("delivery_option", e.target.value)}
        >
          <option>Pickup at shop</option>
          <option>Delivery in Phnom Penh</option>
          <option>Delivery to province</option>
        </select>
      </Field>

      {needsAddress && (
        <Field label="Delivery Address" required>
          <input
            className={`${inputCls} ${errors.delivery_address ? "border-red-400" : ""}`}
            placeholder="Street, district, city"
            value={form.delivery_address}
            onChange={(e) => set("delivery_address", e.target.value)}
          />
          {errors.delivery_address && (
            <p className="text-xs text-red-500">{errors.delivery_address}</p>
          )}
        </Field>
      )}

      {/* Delivery fee hint */}
      {needsAddress && (
        <div className="rounded-[12px] bg-[#F5F5F0] px-3.5 py-2.5 text-xs text-textgray">
          Delivery fee:{" "}
          <span className="font-semibold text-textdark">
            {liveDeliveryFee === 0 ? "Free" : formatPrice(liveDeliveryFee)}
          </span>
          {form.delivery_option === "Delivery in Phnom Penh" &&
            liveSubtotal < 30 && (
              <span className="ml-1">
                · Add {formatPrice(30 - liveSubtotal)} more for free delivery
              </span>
            )}
          {form.delivery_option === "Delivery to province" &&
            liveSubtotal < 50 && (
              <span className="ml-1">
                · Add {formatPrice(50 - liveSubtotal)} more for free delivery
              </span>
            )}
        </div>
      )}

      <Field label="Note">
        <textarea
          rows={3}
          className="w-full rounded-xl border border-bordergray bg-white px-4 py-3 text-sm text-textdark placeholder-textgray focus:border-textdark focus:outline-none"
          placeholder="Any special instructions…"
          value={form.note}
          onChange={(e) => set("note", e.target.value)}
        />
      </Field>

      {/* Order total preview */}
      <div className="flex items-baseline justify-between rounded-[14px] bg-[#111111] px-4 py-3">
        <span className="text-sm font-medium text-white/70">Total</span>
        <span className="font-serif text-xl text-white">
          {formatPrice(liveSubtotal + liveDeliveryFee)}
        </span>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-textdark font-medium text-white transition-opacity hover:opacity-80 disabled:opacity-60"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : null}
        {loading ? "Submitting…" : "Submit Order"}
      </button>
    </form>
  );
}
