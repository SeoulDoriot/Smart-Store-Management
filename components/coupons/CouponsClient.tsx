"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Copy, Check, Ticket, ShoppingBag } from "lucide-react";
import { getSavedCoupons, type SavedCoupon } from "@/lib/coupons";
import { formatDate } from "@/lib/utils";

export function CouponsClient() {
  const [coupons, setCoupons] = useState<SavedCoupon[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    setCoupons(getSavedCoupons());
  }, []);

  function copy(code: string) {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  }

  if (coupons.length === 0) {
    return (
      <div className="rounded-[24px] border border-[#F0F0F0] bg-white p-10 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#FAFAF7]">
          <Ticket size={26} className="text-textgray" />
        </div>
        <p className="font-serif text-lg text-[#111111]">No coupons yet</p>
        <p className="mt-1.5 text-sm text-textgray">
          Cut an event coupon from your receipt and it will appear here.
        </p>
        <Link
          href="/home"
          className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#111111] px-6 text-sm font-semibold text-white transition-opacity hover:opacity-80"
        >
          <ShoppingBag size={15} />
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {coupons.map((c) => (
        <div
          key={c.code}
          className="overflow-hidden rounded-[20px] border border-[#111111]/15 bg-white shadow-sm"
        >
          <div className="flex items-stretch">
            <div className="flex w-2 flex-col bg-[#111111]" />
            <div className="flex-1 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-textgray">
                {c.title}
              </p>
              <p className="mt-1 font-serif text-2xl text-[#111111]">
                {c.description}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="rounded-lg border border-dashed border-[#111111] px-3 py-1 font-mono text-sm font-bold tracking-[0.2em] text-[#111111]">
                  {c.code}
                </span>
                <button
                  onClick={() => copy(c.code)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#111111]/20 px-3 py-1.5 text-xs text-[#111111] hover:bg-[#FAFAF7]"
                >
                  {copied === c.code ? (
                    <>
                      <Check size={13} /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={13} /> Copy code
                    </>
                  )}
                </button>
              </div>
              <p className="mt-3 text-xs text-textgray">
                Valid until {formatDate(c.expiry)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
