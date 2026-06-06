"use client";

import { useMemo, useState } from "react";
import { AdminShell } from "@/components/layout/AdminShell";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import {
  useAdminStore,
  stockState,
  getBrandName,
  getCategoryName,
  DEFAULT_STAFF,
  type AdminProduct,
  type MovementType,
} from "@/lib/admin-store";
import { formatDateTime } from "@/lib/utils";
import {
  AlertTriangle,
  Package,
  ArrowDownUp,
  ScanLine,
  PackagePlus,
  PackageMinus,
  Pencil,
  MoveRight,
  Info,
} from "lucide-react";

const inputCls =
  "h-10 w-full rounded-lg border border-bordergray bg-offwhite px-3 text-sm text-textdark placeholder-textgray focus:border-textdark focus:outline-none";

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

type ActionMode = "in" | "out" | "adjust" | "transfer";
const ACTIONS: {
  mode: ActionMode;
  label: string;
  icon: typeof PackagePlus;
  hint: string;
}[] = [
  {
    mode: "in",
    label: "Stock In",
    icon: PackagePlus,
    hint: "Add units — use when new products arrive.",
  },
  {
    mode: "out",
    label: "Stock Out",
    icon: PackageMinus,
    hint: "Remove units — damaged, lost or manual removal.",
  },
  {
    mode: "adjust",
    label: "Adjust Stock",
    icon: Pencil,
    hint: "Set the exact counted quantity (stock take).",
  },
  {
    mode: "transfer",
    label: "Transfer Location",
    icon: MoveRight,
    hint: "Move the product to a new shelf or warehouse.",
  },
];

const MOVE_LABEL: Record<MovementType, string> = {
  in: "Stock In",
  out: "Stock Out",
  sale: "POS Sale",
  adjust: "Adjust",
  transfer: "Transfer",
};

export default function AdminStockPage() {
  const store = useAdminStore();
  const staff = DEFAULT_STAFF;
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [mode, setMode] = useState<ActionMode>("in");
  const [qty, setQty] = useState("1");
  const [target, setTarget] = useState("");
  const [shelf, setShelf] = useState("");
  const [warehouse, setWarehouse] = useState("");
  const [note, setNote] = useState("");
  const [done, setDone] = useState<string | null>(null);

  const lowStock = store.products
    .filter((p) => p.stock <= 3)
    .sort((a, b) => a.stock - b.stock);
  const outOfStock = store.products.filter((p) => p.stock === 0);

  const selected = store.products.find((p) => p.id === selectedId) ?? null;

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return store.products
      .filter((p) =>
        `${p.name} ${p.sku} ${p.barcode} ${getBrandName(p.brand_id)}`
          .toLowerCase()
          .includes(q)
      )
      .slice(0, 6);
  }, [store.products, query]);

  function pick(p: AdminProduct) {
    setSelectedId(p.id);
    setQuery("");
    setTarget(String(p.stock));
    setShelf(p.shelf);
    setWarehouse(p.warehouse);
    setDone(null);
  }

  function onScan(e: React.FormEvent) {
    e.preventDefault();
    const v = query.trim().toLowerCase();
    if (!v) return;
    const exact = store.products.find(
      (p) => p.barcode.toLowerCase() === v || p.sku.toLowerCase() === v
    );
    if (exact) pick(exact);
    else if (searchResults.length === 1) pick(searchResults[0]);
  }

  function apply() {
    if (!selected) return;
    const n = Math.abs(parseInt(qty || "0", 10)) || 0;
    if (mode === "in") store.adjustStock(selected.id, n, "Stock In", staff, note);
    else if (mode === "out")
      store.adjustStock(selected.id, -n, "Stock Out", staff, note);
    else if (mode === "adjust")
      store.setStock(selected.id, parseInt(target || "0", 10) || 0, staff, note);
    else if (mode === "transfer")
      store.transferLocation(
        selected.id,
        { shelf, warehouse },
        staff,
        note
      );
    setDone(`${MOVE_LABEL[mode === "transfer" ? "transfer" : mode]} applied to ${selected.name}.`);
    setNote("");
    setQty("1");
  }

  return (
    <AdminShell>
      <div className="mb-5">
        <div>
          <h1 className="text-2xl font-semibold text-textdark">
            Stock Control Center
          </h1>
          <p className="mt-1 text-sm text-textgray">
            Scan, receive, remove and move inventory — every change is logged.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-5 grid gap-4 sm:grid-cols-3">
        <AdminStatCard
          label="Total Products"
          value={store.products.length}
          icon={<Package size={18} />}
        />
        <AdminStatCard
          label="Low Stock"
          value={lowStock.length - outOfStock.length}
          icon={<AlertTriangle size={18} />}
          variant={lowStock.length > outOfStock.length ? "yellow" : "default"}
          sub="1–3 units"
        />
        <AdminStatCard
          label="Out of Stock"
          value={outOfStock.length}
          icon={<AlertTriangle size={18} />}
          variant={outOfStock.length > 0 ? "red" : "default"}
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Left: scan + action panel */}
        <div className="space-y-5">
          {/* Quick scan */}
          <div className="rounded-card border border-bordergray bg-white p-4">
            <h2 className="mb-1 flex items-center gap-2 text-sm font-semibold text-textdark">
              <ScanLine size={16} /> Quick scan
            </h2>
            <p className="mb-3 text-xs text-textgray">
              Scan a barcode or type a SKU / name, then choose an action.
            </p>
            <form onSubmit={onScan} className="relative">
              <ScanLine
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-textgray"
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Scan barcode or type SKU / name…"
                className="h-11 w-full rounded-xl border border-bordergray bg-offwhite pl-10 pr-3 text-sm text-textdark placeholder-textgray focus:border-textdark focus:outline-none"
              />
            </form>
            {searchResults.length > 0 && (
              <ul className="mt-2 divide-y divide-bordergray rounded-xl border border-bordergray">
                {searchResults.map((p) => (
                  <li key={p.id}>
                    <button
                      onClick={() => pick(p)}
                      className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm hover:bg-offwhite"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-textdark">
                          {p.name}
                        </span>
                        <span className="font-mono text-[11px] text-textgray">
                          {p.sku}
                        </span>
                      </span>
                      <span className="text-xs text-textgray">
                        {p.stock} in stock
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Action panel */}
          <div className="rounded-card border border-bordergray bg-white p-4">
            {!selected ? (
              <div className="py-8 text-center">
                <Package size={26} className="mx-auto mb-2 text-textgray" />
                <p className="text-sm text-textgray">
                  Scan or pick a product to start a stock action.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-4 flex items-start justify-between gap-3 border-b border-bordergray pb-4">
                  <div>
                    <p className="font-medium text-textdark">{selected.name}</p>
                    <p className="text-xs text-textgray">
                      {getBrandName(selected.brand_id)} ·{" "}
                      {getCategoryName(selected.category_id)} ·{" "}
                      <span className="font-mono">{selected.sku}</span>
                    </p>
                    <p className="mt-1 text-xs text-textgray">
                      Shelf {selected.shelf} · {selected.warehouse}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-semibold text-textdark">
                      {selected.stock}
                    </p>
                    <StockBadge stock={selected.stock} />
                  </div>
                </div>

                {/* Action mode buttons */}
                <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {ACTIONS.map((a) => (
                    <button
                      key={a.mode}
                      onClick={() => {
                        setMode(a.mode);
                        setDone(null);
                      }}
                      className={`flex flex-col items-center gap-1 rounded-xl border px-2 py-2.5 text-xs transition-colors ${
                        mode === a.mode
                          ? "border-textdark bg-textdark text-white"
                          : "border-bordergray bg-white text-textgray hover:bg-offwhite"
                      }`}
                    >
                      <a.icon size={16} />
                      {a.label}
                    </button>
                  ))}
                </div>

                <p className="mb-3 rounded-lg bg-offwhite px-3 py-2 text-[11px] text-textgray">
                  {ACTIONS.find((a) => a.mode === mode)?.hint}
                </p>

                {/* Inputs per mode */}
                {(mode === "in" || mode === "out") && (
                  <label className="mb-3 block">
                    <span className="mb-1 block text-xs font-medium text-textgray">
                      Quantity
                    </span>
                    <input
                      type="number"
                      min={1}
                      value={qty}
                      onChange={(e) => setQty(e.target.value)}
                      className={inputCls}
                    />
                  </label>
                )}
                {mode === "adjust" && (
                  <label className="mb-3 block">
                    <span className="mb-1 block text-xs font-medium text-textgray">
                      New counted quantity
                    </span>
                    <input
                      type="number"
                      min={0}
                      value={target}
                      onChange={(e) => setTarget(e.target.value)}
                      className={inputCls}
                    />
                  </label>
                )}
                {mode === "transfer" && (
                  <div className="mb-3 grid grid-cols-2 gap-3">
                    <label className="block">
                      <span className="mb-1 block text-xs font-medium text-textgray">
                        Shelf
                      </span>
                      <input
                        value={shelf}
                        onChange={(e) => setShelf(e.target.value)}
                        className={inputCls}
                        placeholder="A1-2"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-xs font-medium text-textgray">
                        Warehouse
                      </span>
                      <input
                        value={warehouse}
                        onChange={(e) => setWarehouse(e.target.value)}
                        className={inputCls}
                        placeholder="WH-A3"
                      />
                    </label>
                  </div>
                )}

                <label className="mb-3 block">
                  <span className="mb-1 block text-xs font-medium text-textgray">
                    Note (optional)
                  </span>
                  <input
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className={inputCls}
                    placeholder="e.g. Supplier delivery #1842"
                  />
                </label>

                {done && (
                  <p className="mb-3 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-700">
                    {done}
                  </p>
                )}

                <button
                  onClick={apply}
                  className="h-10 w-full rounded-xl bg-textdark text-sm font-medium text-white hover:opacity-80"
                >
                  Apply {ACTIONS.find((a) => a.mode === mode)?.label}
                </button>
              </>
            )}
          </div>

          {/* Guidance */}
          <div className="rounded-card border border-bordergray bg-white p-4">
            <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-textdark">
              <Info size={15} className="text-textgray" /> How stock works
            </h2>
            <ul className="space-y-1.5 text-xs text-textgray">
              <li>
                <span className="font-medium text-textdark">Stock In</span> —
                use when new products arrive.
              </li>
              <li>
                <span className="font-medium text-textdark">Stock Out</span> —
                use for damaged, lost or manual removal.
              </li>
              <li>
                <span className="font-medium text-textdark">POS sales</span>{" "}
                reduce stock automatically.
              </li>
            </ul>
          </div>
        </div>

        {/* Right: low-stock priority */}
        <div>
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-textdark">
            <AlertTriangle size={15} className="text-yellow-600" />
            Low stock priority
          </h2>
          <div className="rounded-card border border-bordergray bg-white p-3">
            {lowStock.length === 0 ? (
              <p className="py-6 text-center text-xs text-textgray">
                Everything is well stocked.
              </p>
            ) : (
              <ul className="space-y-2">
                {lowStock.map((p) => (
                  <li key={p.id}>
                    <button
                      onClick={() => pick(p)}
                      className={`flex w-full items-center justify-between gap-2 rounded-xl border px-3 py-2 text-left transition-colors hover:bg-offwhite ${
                        selectedId === p.id
                          ? "border-textdark"
                          : "border-bordergray"
                      }`}
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-xs font-medium text-textdark">
                          {p.name}
                        </span>
                        <span className="text-[11px] text-textgray">
                          Shelf {p.shelf}
                        </span>
                      </span>
                      <span
                        className={`shrink-0 text-sm font-semibold ${
                          p.stock === 0 ? "text-red-500" : "text-yellow-600"
                        }`}
                      >
                        {p.stock}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Movement history */}
      <div className="mt-6">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-textdark">
          <ArrowDownUp size={15} className="text-textgray" />
          Stock movement history
        </h2>
        <div className="overflow-x-auto rounded-card border border-bordergray bg-white">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="border-b border-bordergray bg-offwhite text-left text-xs uppercase tracking-wide text-textgray">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Qty</th>
                <th className="px-4 py-3">Staff</th>
                <th className="px-4 py-3">Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bordergray">
              {store.movements.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center text-textgray"
                  >
                    No movements yet. Scan a product and apply a stock action.
                  </td>
                </tr>
              ) : (
                store.movements.slice(0, 40).map((m) => (
                  <tr key={m.id} className="hover:bg-offwhite/50">
                    <td className="px-4 py-3 text-xs text-textgray">
                      {formatDateTime(m.at)}
                    </td>
                    <td className="px-4 py-3 text-textdark">
                      {m.product_name}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full border border-bordergray bg-offwhite px-2 py-0.5 text-[11px] text-textgray">
                        {MOVE_LABEL[m.type]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          m.qty > 0
                            ? "font-semibold text-green-600"
                            : m.qty < 0
                            ? "font-semibold text-red-500"
                            : "text-textgray"
                        }
                      >
                        {m.qty > 0 ? "+" : ""}
                        {m.qty !== 0 ? m.qty : "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-textgray">
                      {m.staff}
                    </td>
                    <td className="px-4 py-3 text-xs text-textgray">
                      {m.note || m.reason}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
