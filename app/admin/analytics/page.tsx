import { AdminShell } from "@/components/layout/AdminShell";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { getAllOrders } from "@/lib/orders";
import { getProducts, getBrandName, getCategoryName } from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import { ShoppingBag, DollarSign, Package, TrendingUp, Star, BarChart2 } from "lucide-react";
import { ReportActions } from "./ReportActions";
import { AdminDateRangeUrlFilter } from "@/components/admin/AdminDateRangeUrlFilter";
import {
  defaultAdminCustomDate,
  getAdminDateRange,
  isInAdminDateRange,
  type AdminDateRangeKey,
} from "@/lib/admin-date-range";

function parseRange(value: string | string[] | undefined): AdminDateRangeKey {
  const raw = Array.isArray(value) ? value[0] : value;
  if (
    raw === "today" ||
    raw === "yesterday" ||
    raw === "last7" ||
    raw === "month" ||
    raw === "custom" ||
    raw === "all"
  ) {
    return raw;
  }

  return "all";
}

export default async function AdminAnalyticsPage({
  searchParams,
}: {
  searchParams?: { range?: string | string[]; date?: string | string[] };
}) {
  const range = parseRange(searchParams?.range);
  const customDate =
    (Array.isArray(searchParams?.date)
      ? searchParams?.date[0]
      : searchParams?.date) || defaultAdminCustomDate();
  const rangeLabel = getAdminDateRange(range, customDate).label;

  const [products, orders] = await Promise.all([
    getProducts(),
    Promise.resolve(getAllOrders()),
  ]);
  const filteredOrders = orders.filter((order) =>
    isInAdminDateRange(order.created_at, range, customDate)
  );
  const paidOrders = filteredOrders.filter(
    (o) => o.payment_status === "Payment Successful"
  );
  const stats = {
    total: filteredOrders.length,
    paid: paidOrders.length,
    pending: filteredOrders.filter((o) => o.order_status === "New Order")
      .length,
    cancelled: filteredOrders.filter((o) => o.order_status === "Cancelled")
      .length,
    revenue: paidOrders.reduce((sum, o) => sum + o.total_amount, 0),
  };

  // Best sellers by order count
  const productOrderCount: Record<string, number> = {};
  filteredOrders.forEach((o) => {
    o.items.forEach((item) => {
      productOrderCount[item.product_name] =
        (productOrderCount[item.product_name] ?? 0) + item.quantity;
    });
  });
  const bestSellers = Object.entries(productOrderCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Top categories by product count
  const categoryCount: Record<string, number> = {};
  products.forEach((p) => {
    const cat = getCategoryName(p.category_id);
    categoryCount[cat] = (categoryCount[cat] ?? 0) + 1;
  });
  const topCategories = Object.entries(categoryCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  // Top brands by product count
  const brandCount: Record<string, number> = {};
  products.forEach((p) => {
    const brand = getBrandName(p.brand_id);
    brandCount[brand] = (brandCount[brand] ?? 0) + 1;
  });
  const topBrands = Object.entries(brandCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  // Popular skin concerns
  const concernCount: Record<string, number> = {};
  products.forEach((p) => {
    p.skin_concerns.forEach((c) => {
      concernCount[c] = (concernCount[c] ?? 0) + 1;
    });
  });
  const topConcerns = Object.entries(concernCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Mock weekly revenue data for chart
  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const mockRevenue = [45, 72, 38, 85, 119, 36, 49];
  const maxRev = Math.max(...mockRevenue);

  return (
    <AdminShell>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-textdark">Analytics</h1>
          <p className="mt-1 text-sm text-textgray">
            Store performance overview · {rangeLabel}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <AdminDateRangeUrlFilter
            value={range}
            customDate={customDate}
            label={rangeLabel}
          />
          <ReportActions
            rows={[
              ["Range", rangeLabel],
              ["Metric", "Value"],
              ["Total Orders", stats.total],
              ["Total Revenue", stats.revenue],
              ["Paid Orders", stats.paid],
              ["Pending Orders", stats.pending],
              ["Cancelled Orders", stats.cancelled],
              ["Total Products", products.length],
              ["", ""],
              ["Best Seller", "Units Sold"],
              ...bestSellers.map(([name, count]) => [name, count] as [string, number]),
            ]}
          />
        </div>
      </div>

      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard
          label="Total Orders"
          value={stats.total}
          icon={<ShoppingBag size={18} />}
        />
        <AdminStatCard
          label="Total Revenue"
          value={formatPrice(stats.revenue)}
          icon={<DollarSign size={18} />}
          variant="green"
        />
        <AdminStatCard
          label="Paid Conversion"
          value={`${stats.total > 0 ? Math.round((stats.paid / stats.total) * 100) : 0}%`}
          icon={<TrendingUp size={18} />}
          variant="green"
          sub={`${stats.paid} of ${stats.total} orders`}
        />
        <AdminStatCard
          label="Total Products"
          value={products.length}
          icon={<Package size={18} />}
        />
      </div>

      {/* Revenue chart + Best sellers side by side */}
      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        {/* Mock revenue bar chart */}
        <div className="rounded-card border border-bordergray bg-white p-5">
          <div className="mb-4 flex items-center gap-2">
            <BarChart2 size={16} className="text-textgray" />
            <h2 className="font-semibold text-textdark">Weekly Revenue</h2>
          </div>
          <p className="mb-4 text-xs text-textgray">Mock data — 7-day snapshot</p>
          <div className="flex items-end gap-2" style={{ height: 140 }}>
            {mockRevenue.map((rev, i) => {
              const pct = maxRev > 0 ? (rev / maxRev) * 100 : 0;
              return (
                <div key={weekdays[i]} className="flex flex-1 flex-col items-center gap-1">
                  <span className="text-[10px] font-medium text-textdark">
                    ${rev}
                  </span>
                  <div
                    className="w-full rounded-t-md bg-textdark transition-all"
                    style={{ height: `${pct}%`, minHeight: 4 }}
                  />
                  <span className="text-[10px] text-textgray">
                    {weekdays[i]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Best sellers */}
        <div className="rounded-card border border-bordergray bg-white p-5">
          <div className="mb-4 flex items-center gap-2">
            <Star size={16} className="text-textgray" />
            <h2 className="font-semibold text-textdark">Best Sellers</h2>
          </div>
          {bestSellers.length > 0 ? (
            <ul className="space-y-3">
              {bestSellers.map(([name, count], i) => (
                <li key={name} className="flex items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-offwhite text-xs font-semibold text-textdark">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-textdark">{name}</p>
                  </div>
                  <span className="text-sm font-semibold text-textdark">
                    {count} sold
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-textgray">No sales data yet.</p>
          )}
        </div>
      </div>

      {/* Categories + Brands */}
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        {/* Top categories */}
        <div className="rounded-card border border-bordergray bg-white p-5">
          <h2 className="mb-4 font-semibold text-textdark">
            Top Categories
          </h2>
          <div className="space-y-3">
            {topCategories.map(([cat, count]) => {
              const pct = Math.round((count / products.length) * 100);
              return (
                <div key={cat}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-textdark">{cat}</span>
                    <span className="text-textgray">{count} products</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-bordergray">
                    <div
                      className="h-full rounded-full bg-textdark"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top brands */}
        <div className="rounded-card border border-bordergray bg-white p-5">
          <h2 className="mb-4 font-semibold text-textdark">Top Brands</h2>
          <div className="space-y-3">
            {topBrands.map(([brand, count]) => {
              const pct = Math.round((count / products.length) * 100);
              return (
                <div key={brand}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-textdark">{brand}</span>
                    <span className="text-textgray">{count} products</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-bordergray">
                    <div
                      className="h-full rounded-full bg-green-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Skin concerns + Order breakdown */}
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        {/* Top Concerns */}
        <div className="rounded-card border border-bordergray bg-white p-5">
          <h2 className="font-semibold text-textdark">
            Top Skin Concerns
          </h2>
          <p className="mt-0.5 mb-4 text-xs text-textgray">
            Based on product catalog
          </p>
          <ul className="space-y-3">
            {topConcerns.map(([concern, count]) => {
              const pct = Math.round((count / products.length) * 100);
              return (
                <li key={concern}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-textdark">{concern}</span>
                    <span className="text-textgray">{count} products</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-bordergray">
                    <div
                      className="h-full rounded-full bg-purple-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Order status breakdown */}
        <div className="rounded-card border border-bordergray bg-white p-5">
          <h2 className="mb-4 font-semibold text-textdark">
            Order Status Breakdown
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-offwhite p-3 text-center">
              <p className="text-2xl font-semibold text-textdark">
                {stats.total}
              </p>
              <p className="text-xs text-textgray">Total</p>
            </div>
            <div className="rounded-xl bg-green-50 p-3 text-center">
              <p className="text-2xl font-semibold text-green-700">
                {stats.paid}
              </p>
              <p className="text-xs text-textgray">Paid</p>
            </div>
            <div className="rounded-xl bg-yellow-50 p-3 text-center">
              <p className="text-2xl font-semibold text-yellow-600">
                {stats.pending}
              </p>
              <p className="text-xs text-textgray">Pending</p>
            </div>
            <div className="rounded-xl bg-red-50 p-3 text-center">
              <p className="text-2xl font-semibold text-red-500">
                {stats.cancelled}
              </p>
              <p className="text-xs text-textgray">Cancelled</p>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
