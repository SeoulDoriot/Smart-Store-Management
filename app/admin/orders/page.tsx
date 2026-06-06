"use client";

import { useMemo, useState } from "react";
import { AdminShell } from "@/components/layout/AdminShell";
import { AdminTable } from "@/components/admin/AdminTable";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { AdminDateRangeFilter } from "@/components/admin/AdminDateRangeFilter";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getAllOrders } from "@/lib/orders";
import { formatPrice, formatDateTime } from "@/lib/utils";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Package,
  ShoppingBag,
  X,
} from "lucide-react";
import type { OrderWithItems } from "@/lib/mock-data";
import { ORDER_STATUSES, PAYMENT_STATUSES, DELIVERY_STATUSES } from "@/lib/mock-data";
import type { DeliveryStatus, OrderStatus, PaymentStatus } from "@/types/order";
import {
  defaultAdminCustomDate,
  getAdminDateRange,
  isInAdminDateRange,
  type AdminDateRangeKey,
} from "@/lib/admin-date-range";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderWithItems[]>(() =>
    getAllOrders().map((order) => ({ ...order }))
  );
  const [selected, setSelected] = useState<OrderWithItems | null>(null);
  const [saved, setSaved] = useState(false);
  const [range, setRange] = useState<AdminDateRangeKey>("all");
  const [customDate, setCustomDate] = useState(defaultAdminCustomDate());

  const rangeLabel = getAdminDateRange(range, customDate).label;
  const filteredOrders = useMemo(
    () =>
      orders.filter((order) =>
        isInAdminDateRange(order.created_at, range, customDate)
      ),
    [orders, range, customDate]
  );

  const totalAmount = filteredOrders.reduce(
    (sum, order) => sum + order.total_amount,
    0
  );
  const newOrders = filteredOrders.filter(
    (order) => order.order_status === "New Order"
  );
  const completedOrders = filteredOrders.filter(
    (order) => order.order_status === "Completed"
  );
  const cancelledOrPending = filteredOrders.filter(
    (order) =>
      order.order_status === "Cancelled" ||
      order.payment_status === "Payment Pending" ||
      order.payment_status === "Payment Submitted"
  );

  function updateSelected(fields: {
    order_status?: OrderStatus;
    payment_status?: PaymentStatus;
    delivery_status?: DeliveryStatus;
  }) {
    if (!selected) return;
    const next = { ...selected, ...fields };
    setSelected(next);
    setOrders((prev) =>
      prev.map((order) => (order.id === next.id ? next : order))
    );
    setSaved(false);
  }

  const rows = filteredOrders.map((o) => ({
    code: (
      <button
        onClick={() => setSelected(o)}
        className="font-medium text-textdark underline decoration-bordergray underline-offset-2 hover:text-blue-700"
      >
        {o.order_code}
      </button>
    ),
    customer: (
      <div>
        <p className="text-textdark">{o.customer_name}</p>
        <p className="text-xs text-textgray">{o.customer_phone}</p>
      </div>
    ),
    items: (
      <span className="text-textgray">
        {o.items.length} item{o.items.length !== 1 ? "s" : ""}
      </span>
    ),
    total: <span className="font-medium">{formatPrice(o.total_amount)}</span>,
    payment: <StatusBadge status={o.payment_status} />,
    status: <StatusBadge status={o.order_status} />,
    date: (
      <span className="text-xs text-textgray">
        {o.created_at ? formatDateTime(o.created_at) : "—"}
      </span>
    ),
  }));

  return (
    <AdminShell>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-textdark">Orders</h1>
          <p className="mt-1 text-sm text-textgray">
            {filteredOrders.length} orders in selected range
          </p>
        </div>
        <AdminDateRangeFilter
          value={range}
          customDate={customDate}
          label={rangeLabel}
          onChange={setRange}
          onCustomDateChange={setCustomDate}
        />
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard
          label="Total Orders"
          value={filteredOrders.length}
          icon={<ShoppingBag size={18} />}
          sub={formatPrice(totalAmount)}
        />
        <AdminStatCard
          label="New Orders"
          value={newOrders.length}
          icon={<Clock size={18} />}
          variant={newOrders.length > 0 ? "yellow" : "default"}
        />
        <AdminStatCard
          label="Completed"
          value={completedOrders.length}
          icon={<CheckCircle size={18} />}
          variant="green"
        />
        <AdminStatCard
          label="Cancelled / Pending"
          value={cancelledOrPending.length}
          icon={<AlertTriangle size={18} />}
          variant={cancelledOrPending.length > 0 ? "yellow" : "default"}
        />
      </div>

      <AdminTable
        columns={[
          { key: "code", label: "Order" },
          { key: "customer", label: "Customer" },
          { key: "items", label: "Items" },
          { key: "total", label: "Total" },
          { key: "payment", label: "Payment" },
          { key: "status", label: "Status" },
          { key: "date", label: "Date" },
        ]}
        rows={rows}
        emptyMessage="No orders found for the selected date range."
      />

      {/* Order detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-[20px] border border-bordergray bg-white p-6 shadow-xl">
            <button
              onClick={() => setSelected(null)}
              className="absolute right-4 top-4 rounded-full p-1 text-textgray hover:bg-offwhite hover:text-textdark"
            >
              <X size={18} />
            </button>

            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-offwhite">
                <Package size={18} className="text-textgray" />
              </div>
              <div>
                <h2 className="font-semibold text-textdark">
                  {selected.order_code}
                </h2>
                <p className="text-xs text-textgray">
                  {selected.created_at
                    ? formatDateTime(selected.created_at)
                    : "—"}
                </p>
              </div>
            </div>

            {/* Customer info */}
            <div className="mb-4 rounded-xl bg-offwhite p-4">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-textgray">
                Customer
              </p>
              <p className="text-sm font-medium text-textdark">
                {selected.customer_name}
              </p>
              <p className="text-xs text-textgray">{selected.customer_phone}</p>
              {selected.customer_telegram && (
                <p className="text-xs text-textgray">
                  {selected.customer_telegram}
                </p>
              )}
              {selected.delivery_address && (
                <p className="mt-1 text-xs text-textgray">
                  {selected.delivery_address}
                </p>
              )}
              <p className="mt-1 text-xs text-textgray">
                {selected.delivery_option}
              </p>
              {selected.note && (
                <p className="mt-1 text-xs italic text-textgray">
                  Note: {selected.note}
                </p>
              )}
            </div>

            {/* Items */}
            <div className="mb-4">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-textgray">
                Items
              </p>
              <div className="space-y-1.5">
                {selected.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-textdark">
                      {item.product_name} × {item.quantity}
                    </span>
                    <span className="text-textgray">
                      {formatPrice(item.total_price)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-2 flex justify-between border-t border-bordergray pt-2 text-sm font-semibold">
                <span>Total</span>
                <span>{formatPrice(selected.total_amount)}</span>
              </div>
            </div>

            {/* Status badges */}
            <div className="mb-4 grid grid-cols-3 gap-2">
              <div className="rounded-xl bg-offwhite p-3 text-center">
                <p className="mb-1 text-[10px] text-textgray">Order</p>
                <StatusBadge status={selected.order_status} />
              </div>
              <div className="rounded-xl bg-offwhite p-3 text-center">
                <p className="mb-1 text-[10px] text-textgray">Payment</p>
                <StatusBadge status={selected.payment_status} />
              </div>
              <div className="rounded-xl bg-offwhite p-3 text-center">
                <p className="mb-1 text-[10px] text-textgray">Delivery</p>
                <StatusBadge status={selected.delivery_status} />
              </div>
            </div>

            {/* Update status (mock) */}
            <div className="space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-textgray">
                Update Status
              </p>
              <div>
                <label className="mb-1 block text-xs text-textgray">
                  Order Status
                </label>
                <select
                  className="h-9 w-full rounded-lg border border-bordergray bg-offwhite px-3 text-xs text-textdark"
                  value={selected.order_status}
                  onChange={(e) =>
                    updateSelected({ order_status: e.target.value as OrderStatus })
                  }
                >
                  {ORDER_STATUSES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs text-textgray">
                  Payment Status
                </label>
                <select
                  className="h-9 w-full rounded-lg border border-bordergray bg-offwhite px-3 text-xs text-textdark"
                  value={selected.payment_status}
                  onChange={(e) =>
                    updateSelected({
                      payment_status: e.target.value as PaymentStatus,
                    })
                  }
                >
                  {PAYMENT_STATUSES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs text-textgray">
                  Delivery Status
                </label>
                <select
                  className="h-9 w-full rounded-lg border border-bordergray bg-offwhite px-3 text-xs text-textdark"
                  value={selected.delivery_status}
                  onChange={(e) =>
                    updateSelected({
                      delivery_status: e.target.value as DeliveryStatus,
                    })
                  }
                >
                  {DELIVERY_STATUSES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => setSaved(true)}
                className="h-10 w-full rounded-xl bg-textdark text-sm font-medium text-white transition-opacity hover:opacity-80"
              >
                Save Changes
              </button>
              <p className="text-center text-[10px] text-textgray">
                {saved
                  ? "Mock status updated for this admin session."
                  : "Status updates use mock state only."}
              </p>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
