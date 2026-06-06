"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type CartItem = { id: string; qty: number };

type StoreCtx = {
  // Cart
  cart: CartItem[];
  cartCount: number;
  addToCart: (id: string, qty?: number) => void;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  // Wishlist
  wishlist: string[];
  wishlistCount: number;
  toggleWishlist: (id: string) => void;
  isWishlisted: (id: string) => boolean;
};

const Ctx = createContext<StoreCtx | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart]         = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [ready, setReady]       = useState(false);

  /** Hydrate from localStorage once on the client */
  useEffect(() => {
    try {
      const c = localStorage.getItem("lumiere-cart");
      const w = localStorage.getItem("lumiere-wishlist");
      if (c) setCart(JSON.parse(c) as CartItem[]);
      if (w) setWishlist(JSON.parse(w) as string[]);
    } catch {
      /* ignore corrupt data */
    }
    setReady(true);
  }, []);

  /** Persist cart */
  useEffect(() => {
    if (ready) localStorage.setItem("lumiere-cart", JSON.stringify(cart));
  }, [cart, ready]);

  /** Persist wishlist */
  useEffect(() => {
    if (ready) localStorage.setItem("lumiere-wishlist", JSON.stringify(wishlist));
  }, [wishlist, ready]);

  const addToCart = useCallback((id: string, qty = 1) => {
    setCart((prev) => {
      const hit = prev.find((x) => x.id === id);
      if (hit)
        return prev.map((x) =>
          x.id === id ? { ...x, qty: Math.min(10, x.qty + qty) } : x
        );
      return [...prev, { id, qty }];
    });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const updateQty = useCallback((id: string, qty: number) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((x) => x.id !== id));
    } else {
      setCart((prev) =>
        prev.map((x) => (x.id === id ? { ...x, qty: Math.min(10, qty) } : x))
      );
    }
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const toggleWishlist = useCallback((id: string) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, []);

  const isWishlisted = useCallback(
    (id: string) => wishlist.includes(id),
    [wishlist]
  );

  const cartCount     = cart.reduce((s, x) => s + x.qty, 0);
  const wishlistCount = wishlist.length;

  return (
    <Ctx.Provider
      value={{
        cart, cartCount, addToCart, removeFromCart, updateQty, clearCart,
        wishlist, wishlistCount, toggleWishlist, isWishlisted,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useStore(): StoreCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}
