"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Archive,
  Truck,
  BarChart2,
  CreditCard,
  Users,
  Settings,
  Home,
  LogOut,
  ScanLine,
  UserCog,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminSession } from "@/lib/admin-auth";

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/pos", label: "POS", icon: ScanLine },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/payments", label: "Payments", icon: CreditCard },
  { href: "/admin/delivery", label: "Delivery", icon: Truck },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/stock", label: "Stock", icon: Archive },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart2 },
  { href: "/admin/staff", label: "Staff", icon: UserCog },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { email, logout } = useAdminSession();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden w-56 flex-shrink-0 border-r border-bordergray bg-white md:flex md:flex-col">
        <div className="flex items-center gap-2 border-b border-bordergray px-5 py-5">
          <span className="font-serif text-lg text-textdark">Lumière</span>
          <span className="rounded-full bg-textdark px-2 py-0.5 text-[10px] font-bold text-white">
            Admin
          </span>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3">
          {NAV.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-colors",
                  active
                    ? "bg-textdark text-white"
                    : "text-textgray hover:bg-offwhite hover:text-textdark"
                )}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-bordergray px-3 pb-8 pt-3">
          {email && (
            <p className="mb-2 truncate px-3 text-[10px] text-textgray">
              {email}
            </p>
          )}
          <Link
            href="/home"
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-textgray hover:bg-offwhite hover:text-textdark"
          >
            <Home size={16} />
            Back to Store
          </Link>
          <button
            onClick={logout}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-red-400 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={16} />
            Log Out
          </button>
        </div>
      </aside>

      {/* Mobile bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex border-t border-bordergray bg-white md:hidden">
        {NAV.slice(0, 5).map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px]",
                active ? "text-textdark" : "text-textgray"
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </div>

      <main className="flex-1 bg-offwhite p-4 pb-20 md:p-6 md:pb-6">
        {children}
      </main>
    </div>
  );
}
