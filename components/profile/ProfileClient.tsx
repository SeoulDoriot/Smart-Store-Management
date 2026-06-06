"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Heart,
  Sparkles,
  ChevronRight,
  Bell,
  Globe,
  Shield,
  MessageCircle,
  Pencil,
  Star,
  Droplets,
  Zap,
  User,
  Package,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { HomeProductCard } from "@/components/home/HomeProductCard";
import type { Product, Brand } from "@/types/product";

// ─── Mock profile data ────────────────────────────────────────────────────────

const PROFILE = {
  name: "Ava Chen",
  email: "ava.chen@example.com",
  joinDate: "January 2026",
  tier: "Beauty Member",
};

const PROFILE_ORDERS = [
  {
    id: "ORD-1001",
    date: "May 28, 2026",
    total: 54,
    items: [
      { name: "Anua Heartleaf 77% Soothing Toner", qty: 2 },
      { name: "COSRX Low pH Good Morning Gel Cleanser", qty: 1 },
    ],
    paymentStatus: "Payment Successful",
    deliveryStatus: "Delivering",
  },
  {
    id: "ORD-1002",
    date: "May 20, 2026",
    total: 37,
    items: [
      { name: "Beauty of Joseon Relief Sun SPF50+", qty: 1 },
      { name: "Skin1004 Madagascar Centella Ampoule", qty: 1 },
    ],
    paymentStatus: "Payment Successful",
    deliveryStatus: "Completed",
  },
  {
    id: "ORD-1003",
    date: "May 10, 2026",
    total: 25,
    items: [{ name: "COSRX Advanced Snail 96 Mucin Power Essence", qty: 1 }],
    paymentStatus: "Payment Successful",
    deliveryStatus: "Completed",
  },
];

const SKIN_PROFILE = {
  skinType: "Oily",
  concerns: ["Acne", "Redness", "Large Pores"],
  budget: "$10 – $30",
  preferredBrands: ["Anua", "COSRX", "Beauty of Joseon"],
  lastUpdated: "May 2026",
};

const SETTINGS_ITEMS: {
  icon: LucideIcon;
  label: string;
  sub: string;
}[] = [
  { icon: User,          label: "Personal Information", sub: "Name, email, phone number" },
  { icon: Globe,         label: "Language",             sub: "English (US)"             },
  { icon: Bell,          label: "Notifications",        sub: "Email and push alerts"    },
  { icon: MessageCircle, label: "Telegram Receipt",     sub: "Connect @username"        },
  { icon: Shield,        label: "Privacy",              sub: "Data and account security" },
];

// ─── Tabs ─────────────────────────────────────────────────────────────────────

type Tab =
  | "overview"
  | "orders"
  | "wishlist"
  | "skin-profile"
  | "settings";

const TABS: { id: Tab; label: string }[] = [
  { id: "overview",        label: "Overview"         },
  { id: "orders",          label: "Orders"           },
  { id: "wishlist",        label: "Wishlist"         },
  { id: "skin-profile",    label: "Skin Profile"     },
  { id: "settings",        label: "Settings"         },
];

// ─── Status helpers ───────────────────────────────────────────────────────────

function paymentColor(status: string) {
  if (status === "Payment Successful")  return "bg-[#DDEFE3] text-green-700";
  if (status.includes("Pending") || status.includes("Submitted"))
    return "bg-[#FFF7E0] text-yellow-700";
  if (status.includes("Failed") || status.includes("Expired"))
    return "bg-[#FDECEA] text-red-600";
  return "bg-[#F0F0F0] text-textgray";
}

function deliveryColor(status: string) {
  if (status === "Completed")  return "bg-[#F0F0F0] text-[#666]";
  if (status === "Delivering") return "bg-[#E3F0FD] text-blue-700";
  if (status === "Preparing" || status === "Packing")
    return "bg-[#FFF7E0] text-yellow-700";
  if (status === "Cancelled") return "bg-[#FDECEA] text-red-600";
  return "bg-[#F0F0F0] text-textgray";
}

// ─── ProfileHeaderCard ────────────────────────────────────────────────────────

function ProfileHeaderCard() {
  return (
    <div className="overflow-hidden rounded-[24px] border border-[#F0F0F0] bg-white shadow-sm">
      {/* Gradient band */}
      <div className="h-24 bg-gradient-to-br from-[#EDD0CA] via-[#F0EAF8] to-[#C4DAD2]" />

      <div className="px-5 pb-6 md:px-6">
        {/* Avatar + edit row */}
        <div className="-mt-10 flex items-end justify-between">
          {/* Avatar */}
          <div className="flex h-[76px] w-[76px] items-center justify-center rounded-full border-[3px] border-white bg-gradient-to-br from-[#EDD0CA] to-[#B8877E] shadow-md">
            <span className="select-none font-serif text-[2rem] font-light text-white/90">
              A
            </span>
          </div>
          {/* Edit button */}
          <button className="mb-1 flex items-center gap-1.5 rounded-full border border-[#E8E8E8] bg-white px-3.5 py-2 text-xs font-medium text-[#333] transition-colors hover:border-[#CCCCCC] hover:bg-[#FAFAF7]">
            <Pencil size={11} />
            Edit Profile
          </button>
        </div>

        {/* Identity */}
        <div className="mt-3">
          <h2 className="font-serif text-[1.4rem] font-normal text-[#111111]">
            {PROFILE.name}
          </h2>
          <p className="mt-0.5 text-sm text-textgray">{PROFILE.email}</p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {/* Tier badge */}
            <span className="flex items-center gap-1.5 rounded-full bg-[#111111] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
              <Star size={9} />
              {PROFILE.tier}
            </span>
            <span className="text-[11px] text-textgray">
              Lumière member since {PROFILE.joinDate}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── StatCard ─────────────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  iconBg,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  sub?: string;
  iconBg: string;
}) {
  return (
    <div className="rounded-[18px] border border-[#F0F0F0] bg-white p-4 shadow-sm">
      <div
        className={`mb-3 flex h-9 w-9 items-center justify-center rounded-full ${iconBg}`}
      >
        <Icon size={15} />
      </div>
      <p className="font-serif text-[1.5rem] font-normal leading-none text-[#111111]">
        {value}
      </p>
      <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-textgray">
        {label}
      </p>
      {sub && <p className="mt-0.5 text-[10px] text-textgray">{sub}</p>}
    </div>
  );
}

// ─── OrderCard ────────────────────────────────────────────────────────────────

function OrderCard({ order }: { order: (typeof PROFILE_ORDERS)[number] }) {
  const first    = order.items[0];
  const extra    = order.items.length - 1;

  return (
    <div className="rounded-[18px] border border-[#F0F0F0] bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        {/* Left info */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-sm font-semibold text-[#111111]">
              {order.id}
            </span>
            <span className="text-[11px] text-textgray">· {order.date}</span>
          </div>
          <p className="mt-1 truncate text-sm text-textgray">
            {first.name}
            {extra > 0 && (
              <span className="text-textgray">
                {" "}
                +{extra} item{extra > 1 ? "s" : ""}
              </span>
            )}
          </p>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            <span
              className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${paymentColor(
                order.paymentStatus
              )}`}
            >
              {order.paymentStatus}
            </span>
            <span
              className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${deliveryColor(
                order.deliveryStatus
              )}`}
            >
              {order.deliveryStatus}
            </span>
          </div>
        </div>

        {/* Total */}
        <p className="shrink-0 font-serif text-lg font-normal text-[#111111]">
          ${order.total}
        </p>
      </div>

      {/* Actions */}
      <div className="mt-4 flex gap-2">
        <Link
          href={`/receipt/${order.id}`}
          className="flex-1 rounded-full border border-[#E8E8E8] py-2 text-center text-xs font-medium text-[#333] transition-colors hover:border-[#CCCCCC] hover:bg-[#FAFAF7]"
        >
          View Receipt
        </Link>
        <Link
          href="/track-order"
          className="flex-1 rounded-full bg-[#111111] py-2 text-center text-xs font-semibold text-white transition-opacity hover:opacity-80"
        >
          Track Order
        </Link>
      </div>
    </div>
  );
}

// ─── EmptyState ───────────────────────────────────────────────────────────────

function EmptyState({
  icon,
  title,
  sub,
  cta,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  sub: string;
  cta: string;
  href: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[20px] border border-[#F0F0F0] bg-white py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#FAFAF7]">
        {icon}
      </div>
      <p className="font-serif text-lg font-normal text-[#111111]">{title}</p>
      <p className="mt-1.5 max-w-xs px-4 text-sm text-textgray">{sub}</p>
      <Link
        href={href}
        className="mt-5 rounded-full bg-[#111111] px-5 py-2.5 text-xs font-semibold text-white transition-opacity hover:opacity-80"
      >
        {cta}
      </Link>
    </div>
  );
}

// ─── Section heading row ──────────────────────────────────────────────────────

function SectionHead({
  title,
  count,
  onMore,
}: {
  title: string;
  count?: number;
  onMore?: () => void;
}) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h3 className="font-serif text-lg font-normal text-[#111111]">{title}</h3>
      {count !== undefined && (
        <span className="rounded-full bg-[#F0F0F0] px-2.5 py-1 text-[11px] font-medium text-textgray">
          {count}
        </span>
      )}
      {onMore && (
        <button
          onClick={onMore}
          className="flex items-center gap-0.5 text-xs text-textgray hover:text-[#111111]"
        >
          View All <ChevronRight size={12} />
        </button>
      )}
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

type Props = {
  wishlistProducts: Product[];
  recommendedProducts: Product[];
  brands: Brand[];
};

export function ProfileClient({
  wishlistProducts,
  recommendedProducts,
  brands,
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  function brandName(brandId: string) {
    return brands.find((b) => b.id === brandId)?.name ?? "";
  }

  return (
    <main className="min-h-screen bg-[#FAFAF7]">
      <div className="w-full px-3 py-6 sm:px-5 md:px-8">

        {/* ── Profile header ── */}
        <ProfileHeaderCard />

        {/* ── Quick stats ── */}
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4 lg:gap-4">
          <StatCard
            icon={ShoppingBag}
            label="Total Orders"
            value={12}
            iconBg="bg-[#E3F0FD] text-blue-600"
          />
          <StatCard
            icon={Heart}
            label="Wishlist"
            value={8}
            sub="items saved"
            iconBg="bg-[#FDECEA] text-red-400"
          />
          <StatCard
            icon={Droplets}
            label="Skin Type"
            value="Oily"
            iconBg="bg-[#DDEFE3] text-green-600"
          />
          <StatCard
            icon={Zap}
            label="Main Concern"
            value="Acne"
            iconBg="bg-[#FFF7E0] text-yellow-600"
          />
        </div>

        {/* ── Tabs ── */}
        <div className="mt-5 overflow-x-auto pb-0.5">
          <div className="flex min-w-max gap-1 rounded-[16px] border border-[#EBEBEB] bg-white p-1 shadow-sm">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap rounded-[12px] px-4 py-2 text-[13px] font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-[#111111] text-white shadow-sm"
                    : "text-textgray hover:text-[#111111]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Tab content ── */}
        <div className="mt-5 space-y-4">

          {/* ════ OVERVIEW ════ */}
          {activeTab === "overview" && (
            <>
              {/* Recent orders preview */}
              <div>
                <SectionHead
                  title="Recent Orders"
                  onMore={() => setActiveTab("orders")}
                />
                <div className="space-y-3">
                  {PROFILE_ORDERS.slice(0, 2).map((o) => (
                    <OrderCard key={o.id} order={o} />
                  ))}
                </div>
              </div>

              {/* Wishlist preview */}
              <div className="pt-2">
                <SectionHead
                  title="Saved Items"
                  onMore={() => setActiveTab("wishlist")}
                />
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {wishlistProducts.slice(0, 4).map((p, i) => (
                    <HomeProductCard
                      key={p.id}
                      product={p}
                      brandName={brandName(p.brand_id)}
                      index={i}
                    />
                  ))}
                </div>
              </div>

              {/* Skin snapshot */}
              <div className="pt-2">
                <SectionHead
                  title="Your Skin Profile"
                  onMore={() => setActiveTab("skin-profile")}
                />
                <div className="rounded-[18px] border border-[#F0F0F0] bg-white p-5">
                  <div className="flex flex-wrap gap-x-8 gap-y-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-textgray">
                        Skin Type
                      </p>
                      <p className="mt-1 text-sm font-medium text-[#111111]">
                        {SKIN_PROFILE.skinType}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-textgray">
                        Budget
                      </p>
                      <p className="mt-1 text-sm font-medium text-[#111111]">
                        {SKIN_PROFILE.budget}
                      </p>
                    </div>
                    <div>
                      <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-textgray">
                        Concerns
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {SKIN_PROFILE.concerns.map((c) => (
                          <span
                            key={c}
                            className="rounded-full border border-[#EDD0CA]/60 bg-[#FFF8F6] px-2.5 py-0.5 text-[11px] font-medium text-[#333]"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ════ ORDERS ════ */}
          {activeTab === "orders" && (
            <>
              <SectionHead
                title="My Orders"
                count={PROFILE_ORDERS.length}
              />
              {PROFILE_ORDERS.length > 0 ? (
                <div className="space-y-3">
                  {PROFILE_ORDERS.map((o) => (
                    <OrderCard key={o.id} order={o} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={<ShoppingBag size={22} className="text-textgray" />}
                  title="No orders yet"
                  sub="Your order history will appear here after your first purchase."
                  cta="Shop Now"
                  href="/products"
                />
              )}
            </>
          )}

          {/* ════ WISHLIST ════ */}
          {activeTab === "wishlist" && (
            <>
              <SectionHead
                title="Wishlist"
                count={wishlistProducts.length}
              />
              {wishlistProducts.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {wishlistProducts.map((p, i) => (
                    <HomeProductCard
                      key={p.id}
                      product={p}
                      brandName={brandName(p.brand_id)}
                      index={i}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={<Heart size={22} className="text-textgray" />}
                  title="Your wishlist is empty"
                  sub="Save products you love and find them here any time."
                  cta="Browse Products"
                  href="/products"
                />
              )}
            </>
          )}

          {/* ════ SKIN PROFILE ════ */}
          {activeTab === "skin-profile" && (
            <div className="rounded-[20px] border border-[#F0F0F0] bg-white p-6">
              {/* Header row */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-serif text-lg font-normal text-[#111111]">
                    Your Skin Profile
                  </h3>
                  <p className="mt-0.5 text-xs text-textgray">
                    Last updated: {SKIN_PROFILE.lastUpdated}
                  </p>
                </div>
                <button className="flex items-center gap-1.5 rounded-full border border-[#E8E8E8] px-3.5 py-2 text-xs font-medium text-[#333] transition-colors hover:border-[#CCCCCC] hover:bg-[#FAFAF7]">
                  <Pencil size={11} />
                  Update
                </button>
              </div>

              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                {/* Skin type */}
                <div>
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-textgray">
                    Skin Type
                  </p>
                  <span className="rounded-full border border-[#E8E8E8] bg-[#FAFAF7] px-4 py-1.5 text-sm font-medium text-[#111111]">
                    {SKIN_PROFILE.skinType}
                  </span>
                </div>

                {/* Budget */}
                <div>
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-textgray">
                    Budget Range
                  </p>
                  <span className="rounded-full border border-[#E8E8E8] bg-[#FAFAF7] px-4 py-1.5 text-sm font-medium text-[#111111]">
                    {SKIN_PROFILE.budget}
                  </span>
                </div>

                {/* Concerns */}
                <div className="sm:col-span-2">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-textgray">
                    Skin Concerns
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {SKIN_PROFILE.concerns.map((c) => (
                      <span
                        key={c}
                        className="rounded-full border border-[#EDD0CA]/60 bg-[#FFF8F6] px-3.5 py-1.5 text-xs font-medium text-[#333]"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Preferred brands */}
                <div className="sm:col-span-2">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-textgray">
                    Preferred Brands
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {SKIN_PROFILE.preferredBrands.map((b) => (
                      <span
                        key={b}
                        className="rounded-full bg-[#111111] px-3.5 py-1.5 text-xs font-semibold text-white"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* AI suggestion nudge */}
              <div className="mt-6 flex items-center gap-3 rounded-[14px] bg-gradient-to-r from-[#CEC7EE]/20 to-[#EDD0CA]/20 p-4">
                <Sparkles size={16} className="shrink-0 text-[#9055A2]" />
                <p className="text-xs leading-relaxed text-textgray">
                  Your profile helps our AI give you better recommendations.{" "}
                  <Link
                    href="/ai-advisor"
                    className="font-semibold text-[#111111] underline underline-offset-2"
                  >
                    Ask AI Advisor
                  </Link>
                </p>
              </div>
            </div>
          )}

          {/* ════ SETTINGS ════ */}
          {activeTab === "settings" && (
            <>
              <h3 className="font-serif text-lg font-normal text-[#111111]">
                Settings
              </h3>

              {/* Settings list */}
              <div className="overflow-hidden rounded-[20px] border border-[#F0F0F0] bg-white shadow-sm">
                {SETTINGS_ITEMS.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.label}
                      className={`flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-[#FAFAF7] ${
                        i > 0 ? "border-t border-[#F5F5F5]" : ""
                      }`}
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F5F5F5]">
                        <Icon size={15} className="text-[#444]" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium text-[#111111]">
                          {item.label}
                        </p>
                        <p className="text-[11px] text-textgray">{item.sub}</p>
                      </div>
                      <ChevronRight size={14} className="shrink-0 text-[#CCCCCC]" />
                    </button>
                  );
                })}
              </div>

              {/* Version / log out */}
              <div className="space-y-2 pt-2">
                <div className="rounded-[18px] border border-[#F0F0F0] bg-white px-5 py-3 text-center">
                  <p className="text-[11px] text-textgray">
                    Lumière&nbsp;· Version 1.0.0
                  </p>
                </div>
                <button className="w-full rounded-[18px] border border-[#FDECEA] bg-white py-3.5 text-sm font-medium text-red-500 transition-colors hover:bg-[#FDECEA]/30">
                  Log out
                </button>
              </div>
            </>
          )}

        </div>
      </div>
    </main>
  );
}
