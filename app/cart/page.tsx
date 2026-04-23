"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart, formatPHP } from "@/app/lib/cart";
import { TshirtImage } from "@/app/components/TshirtImage";
import { PLACEMENTS, SIZE_LABELS } from "@/app/lib/types";

export default function CartPage() {
  const { items, subtotal, removeItem, updateQty, clear, hydrated } = useCart();
  const [orderId, setOrderId] = useState<string | null>(null);

  if (!hydrated) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <p className="text-zinc-500">Loading cart…</p>
      </div>
    );
  }

  const placeOrder = () => {
    const id = `TP-${Date.now().toString(36).toUpperCase()}`;
    setOrderId(id);
    clear();
  };

  if (orderId) {
    return (
      <div className="mx-auto w-full max-w-xl px-4 py-16 text-center sm:px-6">
        <div className="rounded-3xl border border-green-500/30 bg-green-500/5 p-8">
          <div className="mb-3 text-5xl">🎉</div>
          <h1 className="text-2xl font-extrabold">Order placed!</h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Your order reference is <span className="font-mono font-semibold">{orderId}</span>.
            We&apos;ll add real payment soon — for now, this is a demo checkout.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/shop"
              className="rounded-full bg-black px-5 py-2.5 font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              Back to shop
            </Link>
            <Link
              href="/customize"
              className="rounded-full border border-black/20 px-5 py-2.5 font-semibold hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
            >
              Design another
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto w-full max-w-xl px-4 py-16 text-center sm:px-6">
        <div className="rounded-3xl border border-black/10 bg-white p-10 dark:border-white/10 dark:bg-zinc-900">
          <div className="mb-3 text-5xl">🛒</div>
          <h1 className="text-2xl font-extrabold">Your cart is empty</h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Go grab something from the shop — or design one from scratch.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/shop"
              className="rounded-full bg-black px-5 py-2.5 font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              Shop tees
            </Link>
            <Link
              href="/customize"
              className="rounded-full border border-black/20 px-5 py-2.5 font-semibold hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
            >
              Customize
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const shipping = subtotal >= 1500 ? 0 : 120;
  const total = subtotal + shipping;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="mb-6 text-3xl font-extrabold tracking-tight sm:text-4xl">Your cart</h1>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
        <ul className="flex flex-col gap-4">
          {items.map((item) => {
            const placementLabel =
              PLACEMENTS.find((p) => p.id === item.placement)?.label ?? item.placement;
            return (
              <li
                key={item.id}
                className="flex gap-4 rounded-2xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-zinc-900"
              >
                <div
                  className="flex shrink-0 items-center justify-center rounded-xl p-2"
                  style={{
                    background:
                      "repeating-linear-gradient(45deg, rgba(0,0,0,0.04) 0 8px, rgba(0,0,0,0) 8px 16px)",
                  }}
                >
                  <TshirtImage
                    imageUrl={item.imageUrl}
                    alt={item.name}
                    color={item.color}
                    designId={item.designId}
                    placement={item.placement}
                    size={120}
                  />
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold">{item.name}</div>
                      <div className="text-xs uppercase tracking-wider text-zinc-500">
                        {item.kind === "custom" ? "Custom design" : "Ready-made"}
                      </div>
                    </div>
                    <div className="text-right font-bold tabular-nums">
                      {formatPHP(item.price * item.qty)}
                    </div>
                  </div>
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">
                    {item.color.name} · Size {SIZE_LABELS[item.size]} · {placementLabel}
                  </div>
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateQty(item.id, item.qty - 1)}
                        className="h-8 w-8 rounded-md border border-black/15 text-lg font-bold hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
                        aria-label="Decrease"
                      >
                        −
                      </button>
                      <span className="w-8 text-center tabular-nums">{item.qty}</span>
                      <button
                        type="button"
                        onClick={() => updateQty(item.id, item.qty + 1)}
                        className="h-8 w-8 rounded-md border border-black/15 text-lg font-bold hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
                        aria-label="Increase"
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
          <li>
            <button
              type="button"
              onClick={clear}
              className="text-sm text-zinc-500 hover:text-red-600"
            >
              Clear cart
            </button>
          </li>
        </ul>

        <aside className="h-fit rounded-2xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-zinc-900 lg:sticky lg:top-20">
          <h2 className="mb-4 text-lg font-bold">Order summary</h2>
          <dl className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-zinc-500">Subtotal</dt>
              <dd className="tabular-nums">{formatPHP(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-zinc-500">Shipping</dt>
              <dd className="tabular-nums">
                {shipping === 0 ? <span className="text-green-600">FREE</span> : formatPHP(shipping)}
              </dd>
            </div>
            {shipping > 0 && (
              <p className="text-xs text-zinc-500">
                Free shipping on orders over ₱1,500.
              </p>
            )}
            <hr className="my-2 border-black/10 dark:border-white/10" />
            <div className="flex justify-between text-base font-bold">
              <dt>Total</dt>
              <dd className="tabular-nums">{formatPHP(total)}</dd>
            </div>
          </dl>
          <button
            type="button"
            onClick={placeOrder}
            className="mt-5 w-full rounded-xl bg-black px-4 py-3 font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            Place order (demo)
          </button>
          <p className="mt-3 text-xs text-zinc-500">
            Payment integration coming soon. Orders are not charged.
          </p>
        </aside>
      </div>
    </div>
  );
}
