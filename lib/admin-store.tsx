"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getProducts, getBrandName, getCategoryName } from "@/lib/products";
import type { Product } from "@/types/product";

// ── Admin-only product fields layered on top of the catalog Product ──────────
export type ProductStatus = "Active" | "Draft" | "Archived";

export interface AdminProduct extends Product {
  cost: number;
  sku: string;
  barcode: string;
  shelf: string; // in-store shelf location
  warehouse: string; // warehouse bin/zone
  tags: string[];
  status: ProductStatus;
  updated_at: string; // ISO — bumped on any edit / stock change
}

export type MovementType = "in" | "out" | "sale" | "adjust" | "transfer";

export interface StockMovement {
  id: string;
  product_id: string;
  product_name: string;
  type: MovementType;
  qty: number; // signed: +in, -out/-sale. 0 for location transfers
  reason: string;
  staff: string;
  note?: string;
  at: string; // ISO
}

export const DEFAULT_STAFF = "Store Manager";

export interface SaleLine {
  product_id: string;
  name: string;
  price: number;
  qty: number;
}

export interface Sale {
  id: string;
  code: string;
  lines: SaleLine[];
  total: number;
  payment_method: string;
  customer_name: string;
  customer_phone?: string;
  at: string;
}

// ── Deterministic seed of admin fields from a catalog product ────────────────
function seedAdmin(p: Product, i: number): AdminProduct {
  const brandTag = getBrandName(p.brand_id).slice(0, 3).toUpperCase();
  const num = String(i + 1).padStart(3, "0");
  return {
    ...p,
    cost: Math.round(p.price * 0.55 * 100) / 100,
    sku: `${brandTag}-${num}`,
    barcode: `880${String(1000000 + i * 137).slice(0, 7)}${(i % 10)}`,
    shelf: `A${(i % 6) + 1}-${(i % 4) + 1}`,
    warehouse: `WH-${String.fromCharCode(65 + (i % 4))}${(i % 9) + 1}`,
    tags: p.ai_tags.slice(0, 3),
    status: "Active",
    updated_at: new Date(Date.now() - i * 36e5).toISOString(),
  };
}

interface AdminStoreValue {
  products: AdminProduct[];
  movements: StockMovement[];
  sales: Sale[];
  loading: boolean;
  addProduct: (p: Partial<AdminProduct>) => void;
  updateProduct: (id: string, patch: Partial<AdminProduct>) => void;
  deleteProduct: (id: string) => void;
  adjustStock: (
    id: string,
    delta: number,
    reason: string,
    staff?: string,
    note?: string
  ) => void;
  setStock: (id: string, target: number, staff?: string, note?: string) => void;
  transferLocation: (
    id: string,
    patch: { shelf?: string; warehouse?: string },
    staff?: string,
    note?: string
  ) => void;
  recordSale: (
    lines: SaleLine[],
    meta?: { payment_method?: string; customer_name?: string; customer_phone?: string }
  ) => Sale;
  bulk: (ids: string[], patch: Partial<AdminProduct>) => void;
  bulkDelete: (ids: string[]) => void;
}

const AdminStoreContext = createContext<AdminStoreValue | null>(null);

let counter = 0;
const uid = (prefix: string) =>
  `${prefix}_${Date.now().toString(36)}_${(counter++).toString(36)}`;

export function AdminStoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getProducts().then((rows) => {
      if (!mounted) return;
      setProducts(rows.map(seedAdmin));
      setLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const value = useMemo<AdminStoreValue>(() => {
    const touch = (id: string, patch: Partial<AdminProduct>) =>
      setProducts((prev) =>
        prev.map((p) =>
          p.id === id
            ? { ...p, ...patch, updated_at: new Date().toISOString() }
            : p
        )
      );

    const logMove = (m: Omit<StockMovement, "id" | "at" | "staff"> & { staff?: string }) =>
      setMovements((prev) =>
        [
          {
            ...m,
            staff: m.staff ?? DEFAULT_STAFF,
            id: uid("mv"),
            at: new Date().toISOString(),
          },
          ...prev,
        ].slice(0, 200)
      );

    return {
      products,
      movements,
      sales,
      loading,

      addProduct(p) {
        const i = products.length;
        const base: AdminProduct = {
          ...seedAdmin(
            {
              id: uid("p"),
              name: p.name ?? "Untitled product",
              brand_id: p.brand_id ?? "b1",
              origin: p.origin ?? "Korea",
              category_id: p.category_id ?? "c1",
              price: p.price ?? 0,
              stock: p.stock ?? 0,
              skin_types: [],
              skin_concerns: [],
              ai_tags: p.tags ?? [],
              is_best_seller: false,
              is_hot_sale: false,
              is_new_arrival: true,
              is_ai_recommendable: false,
            },
            i
          ),
          ...p,
          updated_at: new Date().toISOString(),
        };
        setProducts((prev) => [base, ...prev]);
        if (base.stock > 0)
          logMove({
            product_id: base.id,
            product_name: base.name,
            type: "in",
            qty: base.stock,
            reason: "Initial stock",
          });
      },

      updateProduct(id, patch) {
        touch(id, patch);
      },

      deleteProduct(id) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      },

      adjustStock(id, delta, reason, staff, note) {
        const prod = products.find((p) => p.id === id);
        if (!prod || delta === 0) return;
        const next = Math.max(0, prod.stock + delta);
        touch(id, { stock: next });
        logMove({
          product_id: id,
          product_name: prod.name,
          type: delta >= 0 ? "in" : "out",
          qty: delta,
          reason,
          staff,
          note,
        });
      },

      setStock(id, target, staff, note) {
        const prod = products.find((p) => p.id === id);
        if (!prod) return;
        const next = Math.max(0, Math.round(target));
        const delta = next - prod.stock;
        if (delta === 0) return;
        touch(id, { stock: next });
        logMove({
          product_id: id,
          product_name: prod.name,
          type: "adjust",
          qty: delta,
          reason: `Adjusted to ${next}`,
          staff,
          note,
        });
      },

      transferLocation(id, patch, staff, note) {
        const prod = products.find((p) => p.id === id);
        if (!prod) return;
        const from = `${prod.shelf} / ${prod.warehouse}`;
        touch(id, patch);
        const to = `${patch.shelf ?? prod.shelf} / ${
          patch.warehouse ?? prod.warehouse
        }`;
        logMove({
          product_id: id,
          product_name: prod.name,
          type: "transfer",
          qty: 0,
          reason: `Moved ${from} → ${to}`,
          staff,
          note,
        });
      },

      recordSale(lines, meta) {
        const total = lines.reduce((s, l) => s + l.price * l.qty, 0);
        const sale: Sale = {
          id: uid("sale"),
          code: `POS-${String(sales.length + 1).padStart(4, "0")}`,
          lines,
          total,
          payment_method: meta?.payment_method ?? "Cash",
          customer_name: meta?.customer_name?.trim() || "Walk-in Customer",
          customer_phone: meta?.customer_phone?.trim() || undefined,
          at: new Date().toISOString(),
        };
        setSales((prev) => [sale, ...prev]);
        setProducts((prev) =>
          prev.map((p) => {
            const line = lines.find((l) => l.product_id === p.id);
            if (!line) return p;
            return {
              ...p,
              stock: Math.max(0, p.stock - line.qty),
              updated_at: new Date().toISOString(),
            };
          })
        );
        lines.forEach((l) =>
          logMove({
            product_id: l.product_id,
            product_name: l.name,
            type: "sale",
            qty: -l.qty,
            reason: sale.code,
            staff: "POS",
          })
        );
        return sale;
      },

      bulk(ids, patch) {
        const at = new Date().toISOString();
        setProducts((prev) =>
          prev.map((p) =>
            ids.includes(p.id) ? { ...p, ...patch, updated_at: at } : p
          )
        );
      },

      bulkDelete(ids) {
        setProducts((prev) => prev.filter((p) => !ids.includes(p.id)));
      },
    };
  }, [products, movements, sales, loading]);

  return (
    <AdminStoreContext.Provider value={value}>
      {children}
    </AdminStoreContext.Provider>
  );
}

export function useAdminStore() {
  const ctx = useContext(AdminStoreContext);
  if (!ctx)
    throw new Error("useAdminStore must be used within AdminStoreProvider");
  return ctx;
}

// ── Stock status helper ──────────────────────────────────────────────────────
export type StockState = "out" | "low" | "in";
export function stockState(stock: number): StockState {
  if (stock === 0) return "out";
  if (stock <= 3) return "low";
  return "in";
}

export { getBrandName, getCategoryName };
