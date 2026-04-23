"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { CartItem } from "./types";
type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clear: () => void;
  hydrated: boolean;
};

const CartContext = createContext<CartContextValue | null>(null);

/**
 * localStorage key. Bump the version if the CartItem shape ever changes
 * so old carts don't blow up on load.
 *
 * @var string
 */
const STORAGE_KEY = "tp-cart-v1";

function genId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  // Really old browser? Fine, here's a best-effort fallback.
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Pull the saved cart on first mount. Runs in the browser only.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setItems(parsed as CartItem[]);
        }
      }
    } catch {
      // Corrupted JSON? Just start fresh, not worth crashing the app.
    }
    setHydrated(true);
  }, []);

  // Save back to storage whenever the cart changes. Wait for hydration
  // first, otherwise the initial empty state would clobber saved data.
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Quota full or private mode — nothing we can do, move on.
    }
  }, [items, hydrated]);

  const addItem = useCallback((item: Omit<CartItem, "id">) => {
    setItems((prev) => {
      // If the exact same shirt is already in the cart, just bump qty
      // instead of adding a second line.
      const idx = prev.findIndex(
        (p) =>
          p.kind === item.kind &&
          p.name === item.name &&
          p.price === item.price &&
          p.color.id === item.color.id &&
          p.size === item.size &&
          p.designId === item.designId &&
          p.placement === item.placement,
      );
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + item.qty };
        return next;
      }
      return [...prev, { ...item, id: genId() }];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const updateQty = useCallback((id: string, qty: number) => {
    setItems((prev) =>
      prev
        .map((p) => (p.id === id ? { ...p, qty: Math.max(0, Math.floor(qty)) } : p))
        .filter((p) => p.qty > 0),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((n, i) => n + i.qty, 0);
    const subtotal = items.reduce((n, i) => n + i.qty * i.price, 0);
    return { items, count, subtotal, addItem, removeItem, updateQty, clear, hydrated };
  }, [items, addItem, removeItem, updateQty, clear, hydrated]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export function formatPHP(amount: number): string {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
