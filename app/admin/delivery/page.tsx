"use client";

import { useState } from "react";
import { AdminShell } from "@/components/layout/AdminShell";
import { AdminTable } from "@/components/admin/AdminTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getAllOrders, getDeliveryForOrder } from "@/lib/orders";
import { DELIVERY_STATUSES } from "@/lib/mock-data";
import type { DeliveryStatus, Delivery } from "@/types/order";
import type { OrderWithItems } from "@/lib/mock-data";
import { X } from "lucide-react";

type DeliveryRow = {
  order: OrderWithItems;
  delivery: Delivery;
};

function fallbackDelivery(order: OrderWithItems): Delivery {
  return {
    id: `delivery-${order.id}`,
    order_id: order.id,
    delivery_company: "",
    tracking_code: "",
    rider_name: "",
    rider_phone: "",
    delivery_note: "",
    estimated_delivery_date: "",
    delivery_status: order.delivery_status,
  };
}

export default function AdminDeliveryPage() {
  const [rowsData, setRowsData] = useState<DeliveryRow[]>(() =>
    getAllOrders().map((order) => ({
      order: { ...order },
      delivery: {
        ...fallbackDelivery(order),
        ...(getDeliveryForOrder(order.id) ?? {}),
      },
    }))
  );
  const [editing, setEditing] = useState<DeliveryRow | null>(null);
  const [saved, setSaved] = useState(false);

  function saveDelivery(next: Delivery) {
    setRowsData((prev) =>
      prev.map((row) =>
        row.order.id === next.order_id
          ? {
              order: { ...row.order, delivery_status: next.delivery_status },
              delivery: next,
            }
          : row
      )
    );
    setEditing((current) =>
      current
        ? {
            order: {
              ...current.order,
              delivery_status: next.delivery_status,
            },
            delivery: next,
          }
        : null
    );
    setSaved(true);
  }

  const rows = rowsData.map(({ order, delivery }) => ({
    order: <span className="font-medium text-textdark">{order.order_code}</span>,
    customer: (
      <div>
        <p className="text-textdark">{order.customer_name}</p>
        <p className="text-xs text-textgray">{order.customer_phone}</p>
      </div>
    ),
    tracking: (
      <span className="text-sm text-textdark">
        {delivery.tracking_code || "-"}
      </span>
    ),
    company: (
      <span className="text-sm text-textgray">
        {delivery.delivery_company || "-"}
      </span>
    ),
    rider: (
      <span className="text-sm text-textgray">
        {delivery.rider_name || "-"}
      </span>
    ),
    eta: (
      <span className="text-xs text-textgray">
        {delivery.estimated_delivery_date || "-"}
      </span>
    ),
    status: <StatusBadge status={delivery.delivery_status} />,
    action: (
      <button
        onClick={() => {
          setEditing({ order, delivery });
          setSaved(false);
        }}
        className="rounded-lg border border-bordergray px-3 py-1 text-xs text-textgray hover:bg-offwhite hover:text-textdark"
      >
        Update
      </button>
    ),
  }));

  return (
    <AdminShell>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-textdark">Delivery</h1>
        <p className="mt-1 text-sm text-textgray">
          {rowsData.length} deliveries
        </p>
      </div>
      <AdminTable
        columns={[
          { key: "order", label: "Order" },
          { key: "customer", label: "Customer" },
          { key: "tracking", label: "Tracking" },
          { key: "company", label: "Company" },
          { key: "rider", label: "Rider" },
          { key: "eta", label: "Est. Date" },
          { key: "status", label: "Status" },
          { key: "action", label: "" },
        ]}
        rows={rows}
        emptyMessage="No deliveries yet."
      />

      {editing && (
        <DeliveryModal
          row={editing}
          saved={saved}
          onClose={() => setEditing(null)}
          onSave={saveDelivery}
        />
      )}
    </AdminShell>
  );
}

function DeliveryModal({
  row,
  saved,
  onClose,
  onSave,
}: {
  row: DeliveryRow;
  saved: boolean;
  onClose: () => void;
  onSave: (delivery: Delivery) => void;
}) {
  const [delivery, setDelivery] = useState<Delivery>(row.delivery);

  function set<K extends keyof Delivery>(key: K, value: Delivery[K]) {
    setDelivery((current) => ({ ...current, [key]: value }));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="relative w-full max-w-md rounded-[20px] border border-bordergray bg-white p-5 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-textgray hover:bg-offwhite hover:text-textdark"
        >
          <X size={18} />
        </button>
        <h2 className="pr-8 font-semibold text-textdark">
          Update {row.order.order_code}
        </h2>
        <p className="mt-1 text-xs text-textgray">
          {row.order.customer_name} · mock delivery update
        </p>

        <div className="mt-5 space-y-3">
          <Field label="Delivery Status">
            <select
              value={delivery.delivery_status}
              onChange={(e) =>
                set("delivery_status", e.target.value as DeliveryStatus)
              }
              className="h-10 w-full rounded-xl border border-bordergray bg-offwhite px-3 text-sm text-textdark focus:border-textdark focus:outline-none"
            >
              {DELIVERY_STATUSES.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
          </Field>
          <Field label="Tracking Code">
            <input
              value={delivery.tracking_code ?? ""}
              onChange={(e) => set("tracking_code", e.target.value)}
              className="h-10 w-full rounded-xl border border-bordergray bg-offwhite px-3 text-sm text-textdark focus:border-textdark focus:outline-none"
              placeholder="e.g. LM-PP-1024"
            />
          </Field>
          <Field label="Delivery Company">
            <input
              value={delivery.delivery_company ?? ""}
              onChange={(e) => set("delivery_company", e.target.value)}
              className="h-10 w-full rounded-xl border border-bordergray bg-offwhite px-3 text-sm text-textdark focus:border-textdark focus:outline-none"
              placeholder="e.g. J&T Express"
            />
          </Field>
          <Field label="Delivery Note">
            <textarea
              value={delivery.delivery_note ?? ""}
              onChange={(e) => set("delivery_note", e.target.value)}
              className="min-h-20 w-full rounded-xl border border-bordergray bg-offwhite px-3 py-2 text-sm text-textdark focus:border-textdark focus:outline-none"
              placeholder="Short note for delivery follow-up"
            />
          </Field>
        </div>

        <button
          onClick={() => onSave(delivery)}
          className="mt-5 h-10 w-full rounded-xl bg-textdark text-sm font-medium text-white transition-opacity hover:opacity-80"
        >
          Save Delivery Update
        </button>
        <p className="mt-2 text-center text-[10px] text-textgray">
          {saved
            ? "Mock delivery update saved for this admin session."
            : "No backend is used. Changes stay in this admin session."}
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-textgray">{label}</span>
      {children}
    </label>
  );
}
