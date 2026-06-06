import { AdminShell } from "@/components/layout/AdminShell";
import { AdminTable } from "@/components/admin/AdminTable";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { MOCK_CUSTOMERS, MOCK_ORDERS } from "@/lib/mock-data";
import { formatPrice, formatDate } from "@/lib/utils";
import { Users, ShoppingBag, Repeat } from "lucide-react";

export default function AdminCustomersPage() {
  const customers = MOCK_CUSTOMERS;
  const orders = MOCK_ORDERS;

  // Compute per-customer stats
  const customerStats = customers.map((c) => {
    const customerOrders = orders.filter((o) => o.customer_id === c.id);
    const totalSpent = customerOrders
      .filter((o) => o.payment_status === "Payment Successful")
      .reduce((s, o) => s + o.total_amount, 0);
    return { customer: c, orderCount: customerOrders.length, totalSpent };
  });

  const totalCustomers = customers.length;
  const returning = customerStats.filter((cs) => cs.orderCount > 1).length;
  const avgSpend =
    totalCustomers > 0
      ? customerStats.reduce((s, cs) => s + cs.totalSpent, 0) / totalCustomers
      : 0;

  const rows = customerStats.map(({ customer: c, orderCount, totalSpent }) => ({
    name: (
      <div>
        <p className="font-medium text-textdark">{c.name}</p>
        {c.telegram_username && (
          <p className="text-xs text-textgray">{c.telegram_username}</p>
        )}
      </div>
    ),
    phone: <span className="text-sm text-textdark">{c.phone}</span>,
    address: (
      <span className="text-xs text-textgray line-clamp-1">
        {c.address ?? "—"}
      </span>
    ),
    orders: (
      <span
        className={`text-sm font-medium ${
          orderCount > 0 ? "text-textdark" : "text-textgray"
        }`}
      >
        {orderCount}
      </span>
    ),
    spent: (
      <span className="font-medium text-textdark">
        {totalSpent > 0 ? formatPrice(totalSpent) : "—"}
      </span>
    ),
    joined: (
      <span className="text-xs text-textgray">
        {c.created_at ? formatDate(c.created_at) : "—"}
      </span>
    ),
  }));

  return (
    <AdminShell>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-textdark">Customers</h1>
        <p className="mt-1 text-sm text-textgray">
          {totalCustomers} registered customers
        </p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <AdminStatCard
          label="Total Customers"
          value={totalCustomers}
          icon={<Users size={18} />}
        />
        <AdminStatCard
          label="Returning"
          value={returning}
          icon={<Repeat size={18} />}
          variant="green"
          sub={`${totalCustomers > 0 ? Math.round((returning / totalCustomers) * 100) : 0}% return rate`}
        />
        <AdminStatCard
          label="Avg. Spend"
          value={formatPrice(avgSpend)}
          icon={<ShoppingBag size={18} />}
          sub="per customer"
        />
      </div>

      <AdminTable
        columns={[
          { key: "name", label: "Customer" },
          { key: "phone", label: "Phone" },
          { key: "address", label: "Address" },
          { key: "orders", label: "Orders" },
          { key: "spent", label: "Total Spent" },
          { key: "joined", label: "Joined" },
        ]}
        rows={rows}
        emptyMessage="No customers yet. They will appear here after their first order."
      />
    </AdminShell>
  );
}
