import { AdminShell } from "@/components/layout/AdminShell";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getOrderStats, getAllOrders } from "@/lib/orders";
import { getProducts, getBrandName } from "@/lib/products";
import { formatPrice, formatDateTime } from "@/lib/utils";
import {
  ShoppingBag,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  Clock,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const [stats, orders, products] = await Promise.all([
    Promise.resolve(getOrderStats()),
    Promise.resolve(getAllOrders()),
    getProducts(),
  ]);

  const lowStockProducts = products.filter((p) => p.stock <= 3);
  const recentOrders = orders.slice(0, 5);
  const latestOrderDate = orders
    .map((o) => o.created_at?.slice(0, 10))
    .filter(Boolean)
    .sort()
    .at(-1);
  const todayOrders = latestOrderDate
    ? orders.filter((o) => o.created_at?.startsWith(latestOrderDate))
    : orders;
  const todayRevenue = todayOrders
    .filter((o) => o.payment_status === "Payment Successful")
    .reduce((sum, o) => sum + o.total_amount, 0);

  // Best seller by order quantity
  const productOrderCount: Record<string, number> = {};
  orders.forEach((o) =>
    o.items.forEach((item) => {
      productOrderCount[item.product_name] =
        (productOrderCount[item.product_name] ?? 0) + item.quantity;
    })
  );
  const bestSeller = Object.entries(productOrderCount).sort(
    (a, b) => b[1] - a[1]
  )[0];

  // Pending payments count
  const pendingPayments = orders.filter(
    (o) => o.payment_status === "Payment Pending" || o.payment_status === "Payment Submitted"
  ).length;

  return (
    <AdminShell>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-textdark">Overview</h1>
        <p className="mt-1 text-sm text-textgray">Store summary at a glance</p>
      </div>

      {/* Stat cards — 2x3 grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AdminStatCard
          label="Today Orders"
          value={todayOrders.length}
          icon={<ShoppingBag size={18} />}
          sub="latest mock day"
        />
        <AdminStatCard
          label="Today Revenue"
          value={formatPrice(todayRevenue)}
          icon={<DollarSign size={18} />}
          variant="green"
          sub="paid orders today"
        />
        <AdminStatCard
          label="Paid Orders"
          value={stats.paid}
          icon={<CheckCircle size={18} />}
          variant="green"
        />
        <AdminStatCard
          label="Pending Payments"
          value={pendingPayments}
          icon={<Clock size={18} />}
          variant={pendingPayments > 0 ? "yellow" : "default"}
          sub="awaiting action"
        />
        <AdminStatCard
          label="Low Stock"
          value={lowStockProducts.length}
          icon={<AlertTriangle size={18} />}
          variant={lowStockProducts.length > 0 ? "yellow" : "default"}
          sub="products with stock ≤ 3"
        />
        <AdminStatCard
          label="Best Seller"
          value={bestSeller ? `${bestSeller[1]} sold` : "—"}
          icon={<TrendingUp size={18} />}
          sub={bestSeller?.[0]?.slice(0, 30) ?? "No sales yet"}
        />
      </div>

      {/* Recent Orders */}
      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-textdark">Recent Orders</h2>
          <Link
            href="/admin/orders"
            className="text-sm text-textgray hover:text-textdark"
          >
            View all
          </Link>
        </div>
        <div className="overflow-x-auto rounded-card border border-bordergray bg-white">
          <table className="w-full min-w-[600px] text-sm">
            <thead className="border-b border-bordergray bg-offwhite text-left text-xs uppercase text-textgray">
              <tr>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bordergray">
              {recentOrders.map((o) => (
                <tr key={o.id} className="hover:bg-offwhite/50">
                  <td className="px-4 py-3 font-medium">{o.order_code}</td>
                  <td className="px-4 py-3 text-textgray">{o.customer_name}</td>
                  <td className="px-4 py-3">{formatPrice(o.total_amount)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={o.payment_status} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={o.order_status} />
                  </td>
                  <td className="px-4 py-3 text-xs text-textgray">
                    {o.created_at ? formatDateTime(o.created_at) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick links */}
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { href: "/admin/payments", label: "Review Payments", count: pendingPayments, color: "text-yellow-600" },
          { href: "/admin/stock", label: "Manage Stock", count: lowStockProducts.length, color: "text-orange-600" },
          { href: "/admin/delivery", label: "Deliveries", count: orders.filter((o) => o.delivery_status === "Delivering").length, color: "text-blue-600" },
          { href: "/admin/customers", label: "Customers", count: null, color: "text-textdark" },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center justify-between rounded-card border border-bordergray bg-white p-4 transition-colors hover:bg-offwhite"
          >
            <span className="text-sm font-medium text-textdark">
              {link.label}
            </span>
            {link.count !== null && link.count > 0 && (
              <span
                className={`rounded-full bg-offwhite px-2 py-0.5 text-xs font-semibold ${link.color}`}
              >
                {link.count}
              </span>
            )}
          </Link>
        ))}
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-textdark">Low Stock Alert</h2>
            <Link
              href="/admin/stock"
              className="text-sm text-textgray hover:text-textdark"
            >
              Manage Stock
            </Link>
          </div>
          <div className="rounded-card border border-yellow-200 bg-yellow-50 p-4">
            <ul className="space-y-2">
              {lowStockProducts.slice(0, 5).map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between text-sm"
                >
                  <div>
                    <span className="text-textdark">{p.name}</span>
                    <span className="ml-2 text-xs text-textgray">
                      {getBrandName(p.brand_id)}
                    </span>
                  </div>
                  <span className="font-medium text-yellow-700">
                    {p.stock} left
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
