"use client";

import { useMemo, useState } from "react";
import { AdminTable } from "@/components/admin/AdminTable";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { AdminDateRangeFilter } from "@/components/admin/AdminDateRangeFilter";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getAllOrders, getPaymentForOrder } from "@/lib/orders";
import {
  approveStoredPayment,
  getSessionOrdersWithPaymentStatus,
  getStoredPayment,
  rejectStoredPayment,
  type StoredMockPayment,
} from "@/lib/mock-payment-store";
import { formatDateTime, formatPrice } from "@/lib/utils";
import { AlertTriangle, CheckCircle, Clock, CreditCard } from "lucide-react";
import type { OrderWithItems } from "@/lib/mock-data";
import {
  defaultAdminCustomDate,
  getAdminDateRange,
  isInAdminDateRange,
  type AdminDateRangeKey,
} from "@/lib/admin-date-range";

type PaymentRow = {
  order: OrderWithItems;
  payment: StoredMockPayment | ReturnType<typeof getPaymentForOrder> | null;
};

function getPaymentDate({ order, payment }: PaymentRow) {
  const isStoredPayment = payment && "orderCode" in payment;
  return isStoredPayment
    ? payment.reviewedAt ?? payment.submittedAt
    : payment?.paid_at ?? order.created_at;
}

function usePaymentRows(version: number): PaymentRow[] {
  return useMemo(() => {
    const demoRows = getAllOrders().map((order) => ({
      order,
      payment: getPaymentForOrder(order.id),
    }));

    const sessionRows = getSessionOrdersWithPaymentStatus().map((order) => ({
      order,
      payment: getStoredPayment(order.order_code),
    }));

    return [...sessionRows, ...demoRows];
  }, [version]);
}

export function AdminPaymentsClient() {
  const [version, setVersion] = useState(0);
  const [range, setRange] = useState<AdminDateRangeKey>("all");
  const [customDate, setCustomDate] = useState(defaultAdminCustomDate());
  const payments = usePaymentRows(version);
  const rangeLabel = getAdminDateRange(range, customDate).label;
  const filteredPayments = useMemo(
    () =>
      payments.filter((payment) =>
        isInAdminDateRange(getPaymentDate(payment), range, customDate)
      ),
    [payments, range, customDate]
  );

  function refresh() {
    setVersion((value) => value + 1);
  }

  function approve(orderCode: string) {
    approveStoredPayment(orderCode);
    refresh();
  }

  function reject(orderCode: string) {
    rejectStoredPayment(orderCode);
    refresh();
  }

  const successful = filteredPayments.filter((p) => p.order.payment_status === "Payment Successful");
  const pending = filteredPayments.filter((p) => p.order.payment_status === "Payment Pending");
  const submitted = filteredPayments.filter((p) => p.order.payment_status === "Payment Submitted");
  const totalRevenue = successful.reduce((sum, p) => sum + p.order.total_amount, 0);

  const rows = filteredPayments.map(({ order, payment }) => {
    const isStoredPayment = payment && "orderCode" in payment;
    const isSubmitted = order.payment_status === "Payment Submitted";
    const method = isStoredPayment ? payment.method : payment?.payment_method;
    const reference = isStoredPayment
      ? payment.transactionReference
      : payment?.payment_reference ?? payment?.transaction_id;
    const date = getPaymentDate({ order, payment });

    return {
      order: <span className="font-medium text-textdark">{order.order_code}</span>,
      customer: (
        <div>
          <p className="text-textdark">{order.customer_name}</p>
          <p className="text-xs text-textgray">{order.customer_phone}</p>
        </div>
      ),
      method: <span className="text-sm text-textgray">{method ?? "—"}</span>,
      amount: <span className="font-medium">{formatPrice(order.total_amount)}</span>,
      reference: <span className="text-xs text-textgray">{reference ?? "—"}</span>,
      status: <StatusBadge status={order.payment_status} />,
      date: (
        <span className="text-xs text-textgray">
          {date ? formatDateTime(date) : "—"}
        </span>
      ),
      actions: isStoredPayment ? (
        <div className="flex gap-1">
          <button
            onClick={() => approve(order.order_code)}
            disabled={!isSubmitted}
            className="rounded-lg bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Approve
          </button>
          <button
            onClick={() => reject(order.order_code)}
            disabled={!isSubmitted}
            className="rounded-lg bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Reject
          </button>
        </div>
      ) : (
        <span className="text-xs text-textgray">Demo record</span>
      ),
    };
  });

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-textgray">
          {filteredPayments.length} payment records in selected range
        </p>
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
          label="Total Revenue"
          value={formatPrice(totalRevenue)}
          icon={<CreditCard size={18} />}
          variant="green"
          sub="from paid orders"
        />
        <AdminStatCard
          label="Successful"
          value={successful.length}
          icon={<CheckCircle size={18} />}
          variant="green"
        />
        <AdminStatCard
          label="Submitted"
          value={submitted.length}
          icon={<Clock size={18} />}
          variant="yellow"
          sub="awaiting review"
        />
        <AdminStatCard
          label="Pending"
          value={pending.length}
          icon={<AlertTriangle size={18} />}
          variant={pending.length > 0 ? "yellow" : "default"}
        />
      </div>

      <AdminTable
        columns={[
          { key: "order", label: "Order" },
          { key: "customer", label: "Customer" },
          { key: "method", label: "Method" },
          { key: "amount", label: "Amount" },
          { key: "reference", label: "Reference" },
          { key: "status", label: "Status" },
          { key: "date", label: "Date" },
          { key: "actions", label: "" },
        ]}
        rows={rows}
        emptyMessage="No payment records found for the selected date range."
      />
    </>
  );
}
