"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { AdminShell } from "@/components/layout/AdminShell";
import {
  useAdminStore,
  stockState,
  getBrandName,
  getCategoryName,
  type AdminProduct,
  type ProductStatus,
} from "@/lib/admin-store";
import { getBrands, getCategories } from "@/lib/products";
import { formatPrice, formatDateTime } from "@/lib/utils";
import type { Brand, Category } from "@/types/product";
import Link from "next/link";
import {
  Plus,
  Search,
  X,
  Eye,
  Trash2,
  AlertTriangle,
  Clock,
  Tag,
  Boxes,
  ScanLine,
  Upload,
  Download,
  ImageOff,
  Barcode,
  FolderX,
  BadgePercent,
  LayoutGrid,
  Library,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const inputCls =
  "h-10 w-full rounded-lg border border-bordergray bg-offwhite px-3 text-sm text-textdark placeholder-textgray focus:border-textdark focus:outline-none";
const selectCls =
  "h-9 rounded-lg border border-bordergray bg-white px-2.5 text-xs text-textdark focus:border-textdark focus:outline-none";

const STATUS_OPTS: ProductStatus[] = ["Active", "Draft", "Archived"];

// ── Small shared pieces ──────────────────────────────────────────────────────
function StockBadge({ stock }: { stock: number }) {
  const s = stockState(stock);
  const map = {
    out: "bg-red-50 text-red-600 border-red-200",
    low: "bg-yellow-50 text-yellow-700 border-yellow-200",
    in: "bg-green-50 text-green-700 border-green-200",
  } as const;
  const label =
    s === "out" ? "Out of Stock" : s === "low" ? "Low Stock" : "In Stock";
  return (
    <span
      className={`inline-flex min-w-[5.5rem] items-center justify-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[10px] font-medium ${map[s]}`}
    >
      {label}
    </span>
  );
}

function ProductStatusBadge({ status }: { status: ProductStatus }) {
  const map: Record<ProductStatus, string> = {
    Active: "border-green-200 bg-green-50 text-green-700",
    Draft: "border-yellow-200 bg-yellow-50 text-yellow-700",
    Archived: "border-gray-200 bg-gray-50 text-gray-600",
  };

  return (
    <span
      className={`inline-flex min-w-[4.5rem] items-center justify-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[10px] font-medium ${map[status]}`}
    >
      {status}
    </span>
  );
}

const THUMB_GRADIENTS = [
  "from-rose-100 to-amber-100 text-rose-700",
  "from-sky-100 to-indigo-100 text-indigo-700",
  "from-emerald-100 to-teal-100 text-emerald-700",
  "from-fuchsia-100 to-purple-100 text-purple-700",
  "from-orange-100 to-yellow-100 text-orange-700",
];
function ProductThumb({ product }: { product: AdminProduct }) {
  if (product.image_url) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={product.image_url}
        alt={product.name}
        className="h-10 w-10 rounded-lg border border-bordergray object-cover"
      />
    );
  }
  const g =
    THUMB_GRADIENTS[
      product.name.charCodeAt(0) % THUMB_GRADIENTS.length
    ];
  return (
    <div
      className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${g} text-sm font-semibold`}
    >
      {product.name.slice(0, 1).toUpperCase()}
    </div>
  );
}

// ── "Needs attention" detection ──────────────────────────────────────────────
type AttentionKey = "image" | "stock" | "id" | "category" | "sale";
function attentionOf(p: AdminProduct): AttentionKey[] {
  const keys: AttentionKey[] = [];
  if (!p.image_url) keys.push("image");
  if (p.stock <= 3) keys.push("stock");
  if (!p.sku || !p.barcode) keys.push("id");
  if (!p.category_id || getCategoryName(p.category_id) === "Unknown")
    keys.push("category");
  if (p.is_hot_sale || p.original_price) keys.push("sale");
  return keys;
}

const ATTENTION_META: Record<
  AttentionKey,
  { label: string; icon: typeof ImageOff; color: string }
> = {
  image: { label: "Missing image", icon: ImageOff, color: "text-purple-600" },
  stock: { label: "Low stock", icon: AlertTriangle, color: "text-yellow-600" },
  id: { label: "Missing barcode/SKU", icon: Barcode, color: "text-blue-600" },
  category: { label: "No category", icon: FolderX, color: "text-orange-600" },
  sale: { label: "On sale", icon: BadgePercent, color: "text-pink-600" },
};

type TabKey = "overview" | "library" | "quick-add" | "scan";
const TABS: { key: TabKey; label: string; icon: typeof LayoutGrid }[] = [
  { key: "overview", label: "Overview", icon: LayoutGrid },
  { key: "library", label: "Product Library", icon: Library },
  { key: "quick-add", label: "Quick Add", icon: Plus },
  { key: "scan", label: "Scan", icon: ScanLine },
];

function exportCsv(products: AdminProduct[]) {
  const head = [
    "name",
    "sku",
    "barcode",
    "brand",
    "category",
    "price",
    "cost",
    "stock",
    "shelf",
    "warehouse",
    "status",
  ];
  const rows = products.map((p) =>
    [
      p.name,
      p.sku,
      p.barcode,
      getBrandName(p.brand_id),
      getCategoryName(p.category_id),
      p.price,
      p.cost,
      p.stock,
      p.shelf,
      p.warehouse,
      p.status,
    ]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(",")
  );
  const csv = [head.join(","), ...rows].join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = "lumiere-products.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminProductsPage() {
  const store = useAdminStore();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tab, setTab] = useState<TabKey>("overview");

  const [search, setSearch] = useState("");
  const [fCategory, setFCategory] = useState("");
  const [fBrand, setFBrand] = useState("");
  const [fStock, setFStock] = useState("");
  const [fStatus, setFStatus] = useState("");
  const [fBadge, setFBadge] = useState("");
  const [attention, setAttention] = useState<AttentionKey | null>(null);

  const [selected, setSelected] = useState<string[]>([]);
  const [drawer, setDrawer] = useState<
    | { mode: "view" | "edit"; product: AdminProduct }
    | { mode: "add" }
    | null
  >(null);

  useEffect(() => {
    getBrands().then(setBrands);
    getCategories().then(setCategories);
  }, []);

  const attentionCounts = useMemo(() => {
    const c: Record<AttentionKey, number> = {
      image: 0,
      stock: 0,
      id: 0,
      category: 0,
      sale: 0,
    };
    store.products.forEach((p) =>
      attentionOf(p).forEach((k) => (c[k] += 1))
    );
    return c;
  }, [store.products]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return store.products.filter((p) => {
      if (q) {
        const hay = `${p.name} ${p.sku} ${p.barcode} ${getBrandName(
          p.brand_id
        )} ${p.tags.join(" ")}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (fCategory && p.category_id !== fCategory) return false;
      if (fBrand && p.brand_id !== fBrand) return false;
      if (fStatus && p.status !== fStatus) return false;
      if (fStock && stockState(p.stock) !== fStock) return false;
      if (fBadge) {
        if (fBadge === "best_seller" && !p.is_best_seller) return false;
        if (fBadge === "hot_sale" && !p.is_hot_sale) return false;
        if (fBadge === "new_arrival" && !p.is_new_arrival) return false;
        if (fBadge === "on_sale" && !(p.is_hot_sale || p.original_price))
          return false;
      }
      if (attention && !attentionOf(p).includes(attention)) return false;
      return true;
    });
  }, [store.products, search, fCategory, fBrand, fStock, fStatus, fBadge, attention]);

  const recentlyUpdated = useMemo(
    () =>
      [...store.products]
        .sort((a, b) => b.updated_at.localeCompare(a.updated_at))
        .slice(0, 5),
    [store.products]
  );

  const allShownSelected =
    filtered.length > 0 && filtered.every((p) => selected.includes(p.id));
  const toggleAll = () =>
    setSelected(allShownSelected ? [] : filtered.map((p) => p.id));
  const toggleOne = (id: string) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const clearFilters = () => {
    setSearch("");
    setFCategory("");
    setFBrand("");
    setFStock("");
    setFStatus("");
    setFBadge("");
    setAttention(null);
  };

  function openAttention(key: AttentionKey) {
    clearFilters();
    setAttention(key);
    setTab("library");
  }

  return (
    <AdminShell>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-textdark">Products</h1>
          <p className="mt-1 text-sm text-textgray">
            {store.products.length} products · manage your catalogue and stock
          </p>
        </div>
        <button
          onClick={() => setDrawer({ mode: "add" })}
          className="flex items-center gap-2 rounded-xl bg-textdark px-4 py-2.5 text-sm font-medium text-white hover:opacity-80"
        >
          <Plus size={15} />
          Add Product
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-5 flex flex-wrap gap-1 rounded-xl border border-bordergray bg-white p-1">
        {TABS.map((t) => {
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm transition-colors ${
                active
                  ? "bg-textdark text-white"
                  : "text-textgray hover:bg-offwhite hover:text-textdark"
              }`}
            >
              <t.icon size={15} />
              {t.label}
            </button>
          );
        })}
        <Link
          href="/admin/stock"
          className="ml-auto flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm text-textgray hover:bg-offwhite hover:text-textdark"
        >
          <Boxes size={15} />
          Stock Control
          <ArrowRight size={13} />
        </Link>
      </div>

      {tab === "overview" && (
        <OverviewTab
          store={store}
          attentionCounts={attentionCounts}
          recentlyUpdated={recentlyUpdated}
          onAdd={() => setDrawer({ mode: "add" })}
          onScan={() => setTab("scan")}
          onOpenAttention={openAttention}
          onView={(p) => setDrawer({ mode: "view", product: p })}
        />
      )}

      {tab === "library" && (
        <>
          {/* Search + filters */}
          <div className="mb-4 rounded-card border border-bordergray bg-white p-3">
            <div className="relative mb-3">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-textgray"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, brand, SKU or barcode…"
                className="h-10 w-full rounded-lg border border-bordergray bg-offwhite pl-9 pr-3 text-sm text-textdark placeholder-textgray focus:border-textdark focus:outline-none"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <select
                value={fCategory}
                onChange={(e) => setFCategory(e.target.value)}
                className={selectCls}
              >
                <option value="">All categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <select
                value={fBrand}
                onChange={(e) => setFBrand(e.target.value)}
                className={selectCls}
              >
                <option value="">All brands</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
              <select
                value={fStatus}
                onChange={(e) => setFStatus(e.target.value)}
                className={selectCls}
              >
                <option value="">Any status</option>
                {STATUS_OPTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <select
                value={fStock}
                onChange={(e) => setFStock(e.target.value)}
                className={selectCls}
              >
                <option value="">Any stock</option>
                <option value="in">In stock</option>
                <option value="low">Low stock</option>
                <option value="out">Out of stock</option>
              </select>
              <select
                value={fBadge}
                onChange={(e) => setFBadge(e.target.value)}
                className={selectCls}
              >
                <option value="">Any badge</option>
                <option value="best_seller">Best seller</option>
                <option value="hot_sale">Hot sale</option>
                <option value="new_arrival">New arrival</option>
                <option value="on_sale">On sale</option>
              </select>
              {attention && (
                <span className="flex items-center gap-1 rounded-lg border border-textdark/20 bg-textdark/5 px-2.5 py-1.5 text-xs text-textdark">
                  {ATTENTION_META[attention].label}
                  <button onClick={() => setAttention(null)}>
                    <X size={12} />
                  </button>
                </span>
              )}
              {(search ||
                fCategory ||
                fBrand ||
                fStock ||
                fStatus ||
                fBadge ||
                attention) && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 rounded-lg px-2.5 text-xs text-textgray hover:text-textdark"
                >
                  <X size={13} /> Clear
                </button>
              )}
              <span className="ml-auto self-center text-xs text-textgray">
                {filtered.length} shown
              </span>
            </div>
          </div>

          {/* Bulk bar */}
          {selected.length > 0 && (
            <div className="mb-3 flex flex-wrap items-center gap-2 rounded-xl border border-textdark/15 bg-textdark/5 px-3 py-2 text-xs">
              <span className="font-medium text-textdark">
                {selected.length} selected
              </span>
              <button
                onClick={() => {
                  store.bulk(selected, { is_hot_sale: true });
                  setSelected([]);
                }}
                className="rounded-lg border border-bordergray bg-white px-2.5 py-1 hover:bg-offwhite"
              >
                Mark on sale
              </button>
              <button
                onClick={() => {
                  selected.forEach((id) =>
                    store.adjustStock(id, 10, "Bulk restock")
                  );
                  setSelected([]);
                }}
                className="rounded-lg border border-bordergray bg-white px-2.5 py-1 hover:bg-offwhite"
              >
                +10 stock
              </button>
              <button
                onClick={() => {
                  store.bulk(selected, { status: "Archived" });
                  setSelected([]);
                }}
                className="rounded-lg border border-bordergray bg-white px-2.5 py-1 hover:bg-offwhite"
              >
                Archive
              </button>
              <button
                onClick={() => {
                  store.bulkDelete(selected);
                  setSelected([]);
                }}
                className="rounded-lg border border-red-200 bg-white px-2.5 py-1 text-red-500 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto rounded-card border border-bordergray bg-white">
            <table className="w-full min-w-[920px] text-sm">
              <thead className="border-b border-bordergray bg-offwhite text-left text-xs uppercase tracking-wide text-textgray">
                <tr>
                  <th className="w-8 px-3 py-3">
                    <input
                      type="checkbox"
                      checked={allShownSelected}
                      onChange={toggleAll}
                      className="rounded"
                    />
                  </th>
                  <th className="px-3 py-3" />
                  <th className="px-3 py-3">Product</th>
                  <th className="px-3 py-3">SKU</th>
                  <th className="px-3 py-3">Barcode</th>
                  <th className="px-3 py-3">Brand</th>
                  <th className="px-3 py-3">Price</th>
                  <th className="px-3 py-3">Stock</th>
                  <th className="px-3 py-3">Shelf</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-bordergray">
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={11}
                      className="px-4 py-12 text-center text-textgray"
                    >
                      No products match your filters.
                    </td>
                  </tr>
                ) : (
                  filtered.map((p) => (
                    <tr
                      key={p.id}
                      onClick={() => setDrawer({ mode: "view", product: p })}
                      className="cursor-pointer hover:bg-offwhite/50"
                    >
                      <td
                        className="px-3 py-3"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={selected.includes(p.id)}
                          onChange={() => toggleOne(p.id)}
                          className="rounded"
                        />
                      </td>
                      <td className="px-3 py-3">
                        <ProductThumb product={p} />
                      </td>
                      <td className="px-3 py-3">
                        <p className="font-medium text-textdark">{p.name}</p>
                        <p className="text-xs text-textgray">
                          {getCategoryName(p.category_id)}
                        </p>
                      </td>
                      <td className="px-3 py-3 font-mono text-xs text-textgray">
                        {p.sku || "—"}
                      </td>
                      <td className="px-3 py-3 font-mono text-xs text-textgray">
                        {p.barcode || "—"}
                      </td>
                      <td className="px-3 py-3 text-textgray">
                        {getBrandName(p.brand_id)}
                      </td>
                      <td className="px-3 py-3">{formatPrice(p.price)}</td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={
                              p.stock === 0
                                ? "font-semibold text-red-500"
                                : p.stock <= 3
                                ? "font-semibold text-yellow-600"
                                : "text-textdark"
                            }
                          >
                            {p.stock}
                          </span>
                          <StockBadge stock={p.stock} />
                        </div>
                      </td>
                      <td className="px-3 py-3 text-xs text-textgray">
                        {p.shelf}
                      </td>
                      <td className="px-3 py-3 text-xs text-textgray">
                        <ProductStatusBadge status={p.status} />
                      </td>
                      <td
                        className="px-3 py-3"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex gap-1">
                          <button
                            onClick={() => setDrawer({ mode: "edit", product: p })}
                            className="flex h-7 items-center rounded-lg px-2 text-xs text-textgray hover:bg-offwhite hover:text-textdark"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setDrawer({ mode: "view", product: p })}
                            className="flex h-7 w-7 items-center justify-center rounded-lg text-textgray hover:bg-offwhite hover:text-textdark"
                            title="View"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => store.deleteProduct(p.id)}
                            className="flex h-7 w-7 items-center justify-center rounded-lg text-textgray hover:bg-red-50 hover:text-red-500"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === "quick-add" && (
        <QuickAddTab brands={brands} categories={categories} />
      )}

      {tab === "scan" && (
        <ScanTab onView={(p) => setDrawer({ mode: "view", product: p })} />
      )}

      {drawer && (
        <ProductDrawer
          key={drawer.mode === "add" ? "add" : drawer.product.id + drawer.mode}
          state={drawer}
          brands={brands}
          categories={categories}
          onClose={() => setDrawer(null)}
        />
      )}
    </AdminShell>
  );
}

// ── Overview tab ─────────────────────────────────────────────────────────────
function OverviewTab({
  store,
  attentionCounts,
  recentlyUpdated,
  onAdd,
  onScan,
  onOpenAttention,
  onView,
}: {
  store: ReturnType<typeof useAdminStore>;
  attentionCounts: Record<AttentionKey, number>;
  recentlyUpdated: AdminProduct[];
  onAdd: () => void;
  onScan: () => void;
  onOpenAttention: (k: AttentionKey) => void;
  onView: (p: AdminProduct) => void;
}) {
  const quickActions = [
    { label: "Add Product", icon: Plus, onClick: onAdd, primary: true },
    { label: "Quick Scan", icon: ScanLine, onClick: onScan },
    {
      label: "Import CSV",
      icon: Upload,
      onClick: () =>
        alert("CSV import is a mock placeholder — no backend connected."),
    },
    {
      label: "Export",
      icon: Download,
      onClick: () => exportCsv(store.products),
    },
  ];

  return (
    <div className="space-y-5">
      {/* Guidance */}
      <div className="flex items-start gap-3 rounded-card border border-bordergray bg-white p-4">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-offwhite">
          <Sparkles size={17} className="text-textdark" />
        </div>
        <div>
          <p className="text-sm font-semibold text-textdark">
            Start here
          </p>
          <p className="mt-0.5 text-xs text-textgray">
            1 · Add or import your products. 2 · Fix anything in “Needs
            attention”. 3 · Use Stock Control when inventory arrives or runs low.
            Tap any product to see its full details and history.
          </p>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {quickActions.map((a) => (
          <button
            key={a.label}
            onClick={a.onClick}
            className={`flex items-center gap-3 rounded-card border p-4 text-left transition-colors ${
              a.primary
                ? "border-textdark bg-textdark text-white hover:opacity-90"
                : "border-bordergray bg-white text-textdark hover:bg-offwhite"
            }`}
          >
            <a.icon size={18} />
            <span className="text-sm font-medium">{a.label}</span>
          </button>
        ))}
      </div>

      {/* Needs attention */}
      <div>
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-textdark">
          <AlertTriangle size={15} className="text-yellow-600" />
          Needs attention
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {(Object.keys(ATTENTION_META) as AttentionKey[]).map((key) => {
            const meta = ATTENTION_META[key];
            const count = attentionCounts[key];
            return (
              <button
                key={key}
                onClick={() => onOpenAttention(key)}
                className="rounded-card border border-bordergray bg-white p-4 text-left transition-colors hover:border-textdark/30 hover:bg-offwhite"
              >
                <meta.icon size={18} className={meta.color} />
                <p className="mt-2 text-2xl font-semibold text-textdark">
                  {count}
                </p>
                <p className="text-xs text-textgray">{meta.label}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recently updated */}
      <div className="rounded-card border border-bordergray bg-white p-4">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-textdark">
          <Clock size={15} className="text-textgray" />
          Recently updated
        </h2>
        <ul className="divide-y divide-bordergray">
          {recentlyUpdated.map((p) => (
            <li key={p.id} className="flex items-center gap-3 py-2.5">
              <ProductThumb product={p} />
              <button
                onClick={() => onView(p)}
                className="min-w-0 flex-1 text-left"
              >
                <p className="truncate text-sm font-medium text-textdark hover:underline">
                  {p.name}
                </p>
                <p className="text-xs text-textgray">
                  {getBrandName(p.brand_id)}
                </p>
              </button>
              <StockBadge stock={p.stock} />
              <span className="hidden text-xs text-textgray sm:block">
                {formatDateTime(p.updated_at)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ── Quick Add tab ────────────────────────────────────────────────────────────
function QuickAddTab({
  brands,
  categories,
}: {
  brands: Brand[];
  categories: Category[];
}) {
  const store = useAdminStore();
  const blank = {
    name: "",
    brand_id: brands[0]?.id ?? "b1",
    category_id: categories[0]?.id ?? "c1",
    price: "",
    stock: "",
    sku: "",
    barcode: "",
    shelf: "",
  };
  const [form, setForm] = useState(blank);
  const [added, setAdded] = useState<string | null>(null);
  const set = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    setForm((f) => ({
      ...f,
      brand_id: f.brand_id || brands[0]?.id || "b1",
      category_id: f.category_id || categories[0]?.id || "c1",
    }));
  }, [brands, categories]);

  function submit() {
    if (!form.name.trim()) return;
    store.addProduct({
      name: form.name,
      brand_id: form.brand_id,
      category_id: form.category_id,
      price: Number(form.price) || 0,
      stock: Number(form.stock) || 0,
      sku: form.sku,
      barcode: form.barcode,
      shelf: form.shelf,
    });
    setAdded(form.name);
    setForm(blank);
  }

  return (
    <div className="max-w-2xl rounded-card border border-bordergray bg-white p-5">
      <h2 className="text-base font-semibold text-textdark">Quick Add</h2>
      <p className="mb-4 mt-0.5 text-xs text-textgray">
        Add a product in seconds. You can fill in images, cost and tags later
        from the product library.
      </p>

      {added && (
        <div className="mb-4 flex items-center justify-between rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-700">
          <span>“{added}” added to your library.</span>
          <button onClick={() => setAdded(null)}>
            <X size={13} />
          </button>
        </div>
      )}

      <div className="space-y-4">
        <Field label="Product Name *">
          <input
            className={inputCls}
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="e.g. COSRX Snail Mucin"
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Brand">
            <select
              className={inputCls}
              value={form.brand_id}
              onChange={(e) => set("brand_id", e.target.value)}
            >
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Category">
            <select
              className={inputCls}
              value={form.category_id}
              onChange={(e) => set("category_id", e.target.value)}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Price">
            <input
              type="number"
              min={0}
              className={inputCls}
              value={form.price}
              onChange={(e) => set("price", e.target.value)}
              placeholder="0.00"
            />
          </Field>
          <Field label="Stock">
            <input
              type="number"
              min={0}
              className={inputCls}
              value={form.stock}
              onChange={(e) => set("stock", e.target.value)}
              placeholder="0"
            />
          </Field>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Field label="SKU">
            <input
              className={inputCls}
              value={form.sku}
              onChange={(e) => set("sku", e.target.value)}
              placeholder="ABC-001"
            />
          </Field>
          <Field label="Barcode">
            <input
              className={inputCls}
              value={form.barcode}
              onChange={(e) => set("barcode", e.target.value)}
              placeholder="880…"
            />
          </Field>
          <Field label="Shelf">
            <input
              className={inputCls}
              value={form.shelf}
              onChange={(e) => set("shelf", e.target.value)}
              placeholder="A1-2"
            />
          </Field>
        </div>
        <button
          onClick={submit}
          disabled={!form.name.trim()}
          className="h-10 w-full rounded-xl bg-textdark text-sm font-medium text-white transition-opacity hover:opacity-80 disabled:opacity-50"
        >
          Add Product
        </button>
      </div>
    </div>
  );
}

// ── Scan tab ─────────────────────────────────────────────────────────────────
function ScanTab({ onView }: { onView: (p: AdminProduct) => void }) {
  const store = useAdminStore();
  const [q, setQ] = useState("");
  const [match, setMatch] = useState<AdminProduct | null>(null);
  const [notFound, setNotFound] = useState(false);

  function lookup(e: React.FormEvent) {
    e.preventDefault();
    const v = q.trim().toLowerCase();
    if (!v) return;
    const found =
      store.products.find(
        (p) => p.barcode.toLowerCase() === v || p.sku.toLowerCase() === v
      ) ?? store.products.find((p) => p.name.toLowerCase().includes(v));
    setMatch(found ?? null);
    setNotFound(!found);
  }

  return (
    <div className="max-w-xl">
      <div className="rounded-card border border-bordergray bg-white p-5">
        <h2 className="flex items-center gap-2 text-base font-semibold text-textdark">
          <ScanLine size={17} /> Scan or look up a product
        </h2>
        <p className="mb-4 mt-0.5 text-xs text-textgray">
          Point your scanner at a barcode, or type a SKU / name to find a
          product fast.
        </p>
        <form onSubmit={lookup} className="relative">
          <ScanLine
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-textgray"
          />
          <input
            autoFocus
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setNotFound(false);
            }}
            placeholder="Scan barcode / SKU or type a name…"
            className="h-12 w-full rounded-xl border border-bordergray bg-offwhite pl-10 pr-3 text-sm text-textdark placeholder-textgray focus:border-textdark focus:outline-none"
          />
        </form>

        {notFound && (
          <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-600">
            No product found for “{q}”.
          </p>
        )}

        {match && (
          <div className="mt-4 flex items-center gap-3 rounded-card border border-bordergray p-3">
            <ProductThumb product={match} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-textdark">
                {match.name}
              </p>
              <p className="text-xs text-textgray">
                {getBrandName(match.brand_id)} · {match.sku} ·{" "}
                {formatPrice(match.price)}
              </p>
            </div>
            <span className="text-sm font-semibold text-textdark">
              {match.stock} in stock
            </span>
            <button
              onClick={() => onView(match)}
              className="rounded-lg bg-textdark px-3 py-2 text-xs font-medium text-white hover:opacity-80"
            >
              Open details
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Slide-in drawer: view / edit / add ───────────────────────────────────────
function ProductDrawer({
  state,
  brands,
  categories,
  onClose,
}: {
  state:
    | { mode: "view" | "edit"; product: AdminProduct }
    | { mode: "add" };
  brands: Brand[];
  categories: Category[];
  onClose: () => void;
}) {
  const store = useAdminStore();
  const existing = state.mode === "add" ? null : state.product;
  const [mode, setMode] = useState(state.mode);

  const [form, setForm] = useState({
    name: existing?.name ?? "",
    brand_id: existing?.brand_id ?? brands[0]?.id ?? "b1",
    category_id: existing?.category_id ?? categories[0]?.id ?? "c1",
    price: existing?.price ?? 0,
    cost: existing?.cost ?? 0,
    stock: existing?.stock ?? 0,
    sku: existing?.sku ?? "",
    barcode: existing?.barcode ?? "",
    shelf: existing?.shelf ?? "",
    warehouse: existing?.warehouse ?? "",
    image_url: existing?.image_url ?? "",
    tags: existing?.tags.join(", ") ?? "",
    status: existing?.status ?? ("Active" as ProductStatus),
  });

  const set = (k: keyof typeof form, v: string | number) =>
    setForm((f) => ({ ...f, [k]: v }));

  function save() {
    const patch = {
      name: form.name,
      brand_id: form.brand_id,
      category_id: form.category_id,
      price: Number(form.price),
      cost: Number(form.cost),
      stock: Number(form.stock),
      sku: form.sku,
      barcode: form.barcode,
      shelf: form.shelf,
      warehouse: form.warehouse,
      image_url: form.image_url,
      status: form.status,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };
    if (existing) store.updateProduct(existing.id, patch);
    else store.addProduct(patch);
    onClose();
  }

  const readOnly = mode === "view";
  const title =
    mode === "add"
      ? "Add Product"
      : mode === "edit"
      ? "Edit Product"
      : existing?.name ?? "Product";

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="animate-menu-in relative h-full w-full max-w-md overflow-y-auto border-l border-bordergray bg-white shadow-xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-bordergray bg-white px-5 py-4">
          <h2 className="truncate text-base font-semibold text-textdark">
            {title}
          </h2>
          <div className="flex items-center gap-2">
            {mode === "view" && existing && (
              <button
                onClick={() => setMode("edit")}
                className="rounded-lg border border-bordergray px-3 py-1.5 text-xs text-textdark hover:bg-offwhite"
              >
                Edit
              </button>
            )}
            <button
              onClick={onClose}
              className="rounded-full p-1 text-textgray hover:bg-offwhite hover:text-textdark"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="space-y-4 p-5">
          {readOnly && existing ? (
            <ViewBody product={existing} store={store} />
          ) : (
            <>
              <Field label="Product Name *">
                <input
                  className={inputCls}
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="e.g. COSRX Snail Mucin"
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Brand">
                  <select
                    className={inputCls}
                    value={form.brand_id}
                    onChange={(e) => set("brand_id", e.target.value)}
                  >
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Category">
                  <select
                    className={inputCls}
                    value={form.category_id}
                    onChange={(e) => set("category_id", e.target.value)}
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <Field label="Price *">
                  <input
                    type="number"
                    min={0}
                    className={inputCls}
                    value={form.price}
                    onChange={(e) => set("price", e.target.value)}
                  />
                </Field>
                <Field label="Cost">
                  <input
                    type="number"
                    min={0}
                    className={inputCls}
                    value={form.cost}
                    onChange={(e) => set("cost", e.target.value)}
                  />
                </Field>
                <Field label="Stock *">
                  <input
                    type="number"
                    min={0}
                    className={inputCls}
                    value={form.stock}
                    onChange={(e) => set("stock", e.target.value)}
                  />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="SKU">
                  <input
                    className={inputCls}
                    value={form.sku}
                    onChange={(e) => set("sku", e.target.value)}
                    placeholder="ABC-001"
                  />
                </Field>
                <Field label="Barcode">
                  <input
                    className={inputCls}
                    value={form.barcode}
                    onChange={(e) => set("barcode", e.target.value)}
                    placeholder="880…"
                  />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Shelf location">
                  <input
                    className={inputCls}
                    value={form.shelf}
                    onChange={(e) => set("shelf", e.target.value)}
                    placeholder="A1-2"
                  />
                </Field>
                <Field label="Warehouse">
                  <input
                    className={inputCls}
                    value={form.warehouse}
                    onChange={(e) => set("warehouse", e.target.value)}
                    placeholder="WH-A3"
                  />
                </Field>
              </div>
              <Field label="Image URL">
                <input
                  className={inputCls}
                  value={form.image_url}
                  onChange={(e) => set("image_url", e.target.value)}
                  placeholder="https://…"
                />
              </Field>
              <Field label="Tags (comma separated)">
                <input
                  className={inputCls}
                  value={form.tags}
                  onChange={(e) => set("tags", e.target.value)}
                  placeholder="hydration, sensitive, K-Beauty"
                />
              </Field>
              <Field label="Status">
                <select
                  className={inputCls}
                  value={form.status}
                  onChange={(e) =>
                    set("status", e.target.value as ProductStatus)
                  }
                >
                  {(["Active", "Draft", "Archived"] as ProductStatus[]).map(
                    (s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    )
                  )}
                </select>
              </Field>

              <button
                onClick={save}
                disabled={!form.name.trim()}
                className="h-10 w-full rounded-xl bg-textdark text-sm font-medium text-white transition-opacity hover:opacity-80 disabled:opacity-50"
              >
                {existing ? "Save Changes" : "Add Product"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-textgray">
        {label}
      </label>
      {children}
    </div>
  );
}

function ViewBody({
  product,
  store,
}: {
  product: AdminProduct;
  store: ReturnType<typeof useAdminStore>;
}) {
  const p = store.products.find((x) => x.id === product.id) ?? product;
  const moves = store.movements
    .filter((m) => m.product_id === p.id)
    .slice(0, 8);
  return (
    <>
      <div className="flex items-center gap-3">
        <ProductThumb product={p} />
        <p className="text-xs text-textgray">
          {getBrandName(p.brand_id)} · {getCategoryName(p.category_id)} ·{" "}
          <span className="font-mono">{p.sku}</span>
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Mini label="Price" value={formatPrice(p.price)} />
        <Mini label="Cost" value={formatPrice(p.cost)} />
        <Mini
          label="Margin"
          value={
            p.price > 0
              ? `${Math.round(((p.price - p.cost) / p.price) * 100)}%`
              : "—"
          }
        />
        <Mini label="Status" value={p.status} />
      </div>

      <div className="rounded-xl bg-offwhite p-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs font-medium text-textdark">
            <Boxes size={14} /> Stock: {p.stock}
          </span>
          <StockBadge stock={p.stock} />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => store.adjustStock(p.id, 1, "Manual +1")}
            className="flex-1 rounded-lg border border-bordergray bg-white py-1.5 text-xs hover:bg-offwhite"
          >
            +1
          </button>
          <button
            onClick={() => store.adjustStock(p.id, 10, "Manual +10")}
            className="flex-1 rounded-lg border border-bordergray bg-white py-1.5 text-xs hover:bg-offwhite"
          >
            +10
          </button>
          <button
            onClick={() => store.adjustStock(p.id, -1, "Manual -1")}
            className="flex-1 rounded-lg border border-bordergray bg-white py-1.5 text-xs hover:bg-offwhite"
          >
            -1
          </button>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] text-textgray">
          <span>Shelf: {p.shelf}</span>
          <span>Warehouse: {p.warehouse}</span>
          <span>Barcode: {p.barcode}</span>
        </div>
      </div>

      {p.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {p.tags.map((t) => (
            <span
              key={t}
              className="flex items-center gap-1 rounded-full bg-offwhite px-2 py-0.5 text-[11px] text-textgray"
            >
              <Tag size={10} />
              {t}
            </span>
          ))}
        </div>
      )}

      <div>
        <p className="mb-2 text-xs font-medium text-textgray">
          Stock movement history
        </p>
        {moves.length === 0 ? (
          <p className="text-xs text-textgray">No movements yet.</p>
        ) : (
          <ul className="space-y-1.5">
            {moves.map((m) => (
              <li
                key={m.id}
                className="rounded-lg bg-offwhite px-2.5 py-1.5 text-[11px]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-textdark">{m.reason}</span>
                  <span
                    className={m.qty >= 0 ? "text-green-600" : "text-red-500"}
                  >
                    {m.qty > 0 ? "+" : ""}
                    {m.qty !== 0 ? m.qty : "↔"}
                  </span>
                </div>
                <p className="text-textgray">
                  {m.staff} · {formatDateTime(m.at)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-offwhite p-3">
      <p className="text-xs text-textgray">{label}</p>
      <p className="font-semibold text-textdark">{value}</p>
    </div>
  );
}
