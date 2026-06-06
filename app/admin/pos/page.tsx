"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AdminShell } from "@/components/layout/AdminShell";
import {
  useAdminStore,
  stockState,
  getBrandName,
  type AdminProduct,
  type Sale,
  type SaleLine,
} from "@/lib/admin-store";
import { formatPrice, formatDateTime } from "@/lib/utils";
import {
  Search,
  ScanLine,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  Check,
} from "lucide-react";

export default function AdminPosPage() {
  const store = useAdminStore();
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState<SaleLine[]>([]);
  const [receipt, setReceipt] = useState<Sale | null>(null);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function showFeedback(type: "success" | "error", message: string) {
    setFeedback({ type, message });
    window.setTimeout(() => setFeedback(null), 1800);
  }

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return store.products.slice(0, 8);
    return store.products
      .filter((p) =>
        `${p.name} ${p.sku} ${p.barcode} ${getBrandName(p.brand_id)}`
          .toLowerCase()
          .includes(q)
      )
      .slice(0, 12);
  }, [store.products, query]);

  function addToCart(p: AdminProduct) {
    if (p.stock === 0) {
      showFeedback("error", "Product is out of stock");
      return;
    }
    setCart((prev) => {
      const line = prev.find((l) => l.product_id === p.id);
      if (line) {
        if (line.qty >= p.stock) {
          showFeedback("error", "No more stock available");
          return prev;
        }
        return prev.map((l) =>
          l.product_id === p.id ? { ...l, qty: l.qty + 1 } : l
        );
      }
      return [...prev, { product_id: p.id, name: p.name, price: p.price, qty: 1 }];
    });
    showFeedback("success", "Added to cart");
    inputRef.current?.focus();
  }

  function setQty(id: string, qty: number) {
    const prod = store.products.find((p) => p.id === id);
    const max = prod?.stock ?? 0;
    setCart((prev) =>
      prev
        .map((l) =>
          l.product_id === id
            ? { ...l, qty: Math.max(0, Math.min(qty, max)) }
            : l
        )
        .filter((l) => l.qty > 0)
    );
  }

  function onScan(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim().toLowerCase();
    if (!q) return;
    // Exact barcode / SKU match → instant add (scanner behaviour)
    const exact = store.products.find(
      (p) =>
        p.barcode.toLowerCase() === q || p.sku.toLowerCase() === q
    );
    if (exact) {
      addToCart(exact);
      setQuery("");
      inputRef.current?.focus();
    } else if (results.length === 1) {
      addToCart(results[0]);
      setQuery("");
      inputRef.current?.focus();
    } else {
      showFeedback("error", "Product not found");
      inputRef.current?.select();
    }
  }

  const total = cart.reduce((s, l) => s + l.price * l.qty, 0);
  const itemCount = cart.reduce((s, l) => s + l.qty, 0);

  function completeSale() {
    if (cart.length === 0) return;
    const sale = store.recordSale(cart, {
      payment_method: paymentMethod,
    });
    setReceipt(sale);
    setCart([]);
    setQuery("");
    setPaymentMethod("Cash");
    showFeedback("success", "Sale completed");
    inputRef.current?.focus();
  }

  return (
    <AdminShell>
      <div className="mb-5">
        <h1 className="text-2xl font-semibold text-textdark">Point of Sale</h1>
        <p className="mt-1 text-sm text-textgray">
          Scan a barcode or search to add items. Stock updates after each sale.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        {/* Catalog / scanner */}
        <div>
          <form onSubmit={onScan} className="relative mb-4">
            <ScanLine
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-textgray"
            />
            <input
              ref={inputRef}
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Scan barcode / SKU or search by name…"
              className="h-12 w-full rounded-xl border border-bordergray bg-white pl-10 pr-3 text-sm text-textdark placeholder-textgray focus:border-textdark focus:outline-none"
            />
            <Search
              size={15}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-textgray"
            />
          </form>
          {feedback && (
            <div
              className={`mb-4 rounded-xl border px-3 py-2 text-sm font-medium ${
                feedback.type === "success"
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-red-200 bg-red-50 text-red-600"
              }`}
            >
              {feedback.message}
            </div>
          )}

          <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
            {results.length === 0 ? (
              <p className="col-span-full py-10 text-center text-sm text-textgray">
                No products match “{query}”.
              </p>
            ) : (
              results.map((p) => {
                const s = stockState(p.stock);
                return (
                  <button
                    key={p.id}
                    onClick={() => addToCart(p)}
                    disabled={p.stock === 0}
                    className="flex flex-col rounded-card border border-bordergray bg-white p-3 text-left transition-colors hover:border-textdark/30 hover:bg-offwhite disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <span className="line-clamp-2 text-sm font-medium text-textdark">
                      {p.name}
                    </span>
                    <span className="mt-0.5 font-mono text-[11px] text-textgray">
                      {p.sku}
                    </span>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <span className="font-semibold text-textdark">
                        {formatPrice(p.price)}
                      </span>
                      <span
                        className={`text-[11px] ${
                          s === "out"
                            ? "text-red-500"
                            : s === "low"
                            ? "text-yellow-600"
                            : "text-textgray"
                        }`}
                      >
                        {p.stock} in stock
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Cart */}
        <div className="lg:sticky lg:top-4 lg:self-start">
          <div className="rounded-card border border-bordergray bg-white">
            <div className="flex items-center gap-2 border-b border-bordergray px-4 py-3">
              <ShoppingCart size={16} className="text-textdark" />
              <span className="text-sm font-semibold text-textdark">
                Current Sale
              </span>
              {itemCount > 0 && (
                <span className="ml-auto rounded-full bg-offwhite px-2 py-0.5 text-xs text-textgray">
                  {itemCount} item{itemCount > 1 ? "s" : ""}
                </span>
              )}
            </div>

            <div className="max-h-[42vh] overflow-y-auto">
              {cart.length === 0 ? (
                <p className="px-4 py-10 text-center text-sm text-textgray">
                  Cart is empty. Add products to start a sale.
                </p>
              ) : (
                <ul className="divide-y divide-bordergray">
                  {cart.map((l) => (
                    <li key={l.product_id} className="px-4 py-3">
                      <div className="mb-2 flex items-start justify-between gap-2">
                        <span className="text-sm text-textdark">{l.name}</span>
                        <button
                          onClick={() => setQty(l.product_id, 0)}
                          className="text-textgray hover:text-red-500"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setQty(l.product_id, l.qty - 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-lg border border-bordergray text-textgray hover:bg-offwhite"
                          >
                            <Minus size={13} />
                          </button>
                          <span className="w-7 text-center text-sm font-medium text-textdark">
                            {l.qty}
                          </span>
                          <button
                            onClick={() => setQty(l.product_id, l.qty + 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-lg border border-bordergray text-textgray hover:bg-offwhite"
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                        <span className="text-sm font-semibold text-textdark">
                          {formatPrice(l.price * l.qty)}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="border-t border-bordergray p-4">
              <div className="mb-4 space-y-3">
                <div>
                  <label className="mb-1 block text-xs text-textgray">
                    Payment Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="h-10 w-full rounded-xl border border-bordergray bg-offwhite px-3 text-sm text-textdark focus:border-textdark focus:outline-none"
                  >
                    {["Cash", "ABA", "KHQR", "Bakong", "Card"].map((method) => (
                      <option key={method}>{method}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm text-textgray">Total</span>
                <span className="text-lg font-semibold text-textdark">
                  {formatPrice(total)}
                </span>
              </div>
              <button
                onClick={completeSale}
                disabled={cart.length === 0}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-textdark text-sm font-medium text-white transition-opacity hover:opacity-80 disabled:opacity-40"
              >
                <Check size={16} />
                Complete Sale
              </button>
            </div>
          </div>
        </div>
      </div>

      {receipt && (
        <ReceiptModal receipt={receipt} onClose={() => setReceipt(null)} />
      )}
    </AdminShell>
  );
}

function ReceiptModal({
  receipt,
  onClose,
}: {
  receipt: Sale;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="animate-menu-in w-full max-w-xs rounded-[20px] border border-bordergray bg-white p-6 shadow-xl">
        <div className="mb-4 text-center">
          <div className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-softgreen">
            <Check size={20} className="text-green-700" />
          </div>
          <p className="font-serif text-lg text-textdark">Lumière</p>
          <p className="text-[11px] text-textgray">
            {receipt.code} · {formatDateTime(receipt.at)}
          </p>
        </div>

        <div className="mb-3 rounded-xl bg-offwhite px-3 py-2 text-xs">
          <div className="flex justify-between gap-2">
            <span className="text-textgray">Customer</span>
            <span className="truncate font-medium text-textdark">
              {receipt.customer_name}
            </span>
          </div>
          {receipt.customer_phone && (
            <div className="mt-1 flex justify-between gap-2">
              <span className="text-textgray">Phone</span>
              <span className="truncate text-textdark">
                {receipt.customer_phone}
              </span>
            </div>
          )}
          <div className="mt-1 flex justify-between gap-2">
            <span className="text-textgray">Payment</span>
            <span className="font-medium text-textdark">
              {receipt.payment_method}
            </span>
          </div>
        </div>

        <ul className="mb-3 space-y-1.5 border-y border-dashed border-bordergray py-3 text-xs">
          {receipt.lines.map((l) => (
            <li key={l.product_id} className="flex justify-between gap-2">
              <span className="truncate text-textdark">
                {l.qty}× {l.name}
              </span>
              <span className="shrink-0 text-textgray">
                {formatPrice(l.price * l.qty)}
              </span>
            </li>
          ))}
        </ul>

        <div className="mb-5 flex justify-between text-sm font-semibold text-textdark">
          <span>Total</span>
          <span>{formatPrice(receipt.total)}</span>
        </div>

        <button
          onClick={onClose}
          className="h-10 w-full rounded-xl bg-textdark text-sm font-medium text-white hover:opacity-80"
        >
          New Sale
        </button>
      </div>
    </div>
  );
}
