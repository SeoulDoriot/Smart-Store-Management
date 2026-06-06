// Mock event-coupon config + local (localStorage) saved-coupon store.
// No backend. Toggle EVENT_COUPON.active to show/hide the receipt coupon.

export interface EventCoupon {
  active: boolean;
  code: string;
  title: string;
  description: string;
  expiry: string; // ISO date
}

// Flip `active` to false to hide the coupon on every receipt.
export const EVENT_COUPON: EventCoupon = {
  active: true,
  code: "LUMIERE3",
  title: "Event Gift For You",
  description: "$3 OFF your next purchase",
  expiry: "2026-12-31",
};

export interface SavedCoupon {
  code: string;
  title: string;
  description: string;
  expiry: string;
  savedAt: string; // ISO
}

const STORAGE_KEY = "lumiere-coupons";

export function getSavedCoupons(): SavedCoupon[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SavedCoupon[]) : [];
  } catch {
    return [];
  }
}

export function hasCoupon(code: string): boolean {
  return getSavedCoupons().some((c) => c.code === code);
}

/** Saves a coupon. Returns false if the same code was already saved. */
export function saveCoupon(coupon: Omit<SavedCoupon, "savedAt">): boolean {
  if (typeof window === "undefined") return false;
  const existing = getSavedCoupons();
  if (existing.some((c) => c.code === coupon.code)) return false;
  const next: SavedCoupon[] = [
    { ...coupon, savedAt: new Date().toISOString() },
    ...existing,
  ];
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return true;
}

export function removeCoupon(code: string): void {
  if (typeof window === "undefined") return;
  const next = getSavedCoupons().filter((coupon) => coupon.code !== code);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}
