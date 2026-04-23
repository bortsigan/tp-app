"use client";

import { useState } from "react";
import Link from "next/link";
import { TshirtImageZoom } from "@/app/components/TshirtImageZoom";
import { formatPHP, useCart } from "@/app/lib/cart";
import {
  PH_SIZES,
  PLACEMENTS,
  SIZE_LABELS,
  type CatalogTshirt,
  type PHSize,
} from "@/app/lib/types";

export function ProductDetail({ tee }: { tee: CatalogTshirt }) {
  const { addItem } = useCart();
  const [size, setSize] = useState<PHSize>("M");
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const placementLabel =
    PLACEMENTS.find((p) => p.id === tee.placement)?.label ?? tee.placement;

  const onAdd = () => {
    addItem({
      kind: "catalog",
      name: tee.name,
      price: tee.price,
      qty,
      color: tee.color,
      size,
      designId: tee.designId,
      placement: tee.placement,
      imageUrl: tee.imageUrl,
    });
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_420px]">
      {/* Image + magnifier */}
      <div className="group">
        <TshirtImageZoom
          imageUrl={tee.imageUrl}
          alt={`${tee.name} — ${tee.color.name}`}
          color={tee.color}
          designId={tee.designId}
          placement={tee.placement}
        />
        <p className="mt-2 text-center text-xs text-zinc-500">
          Hover the image to zoom in · tap and hold on mobile
        </p>
      </div>

      {/* Details */}
      <div className="flex flex-col gap-5">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            {tee.name}
          </h1>
          <p className="mt-1 text-sm uppercase tracking-wider text-zinc-500">
            Ready-made · {tee.color.name}
          </p>
        </div>

        <div className="text-3xl font-extrabold tabular-nums">{formatPHP(tee.price)}</div>

        <p className="text-zinc-700 dark:text-zinc-300">{tee.description}</p>

        <dl className="grid grid-cols-2 gap-3 rounded-2xl border border-black/10 bg-white p-4 text-sm dark:border-white/10 dark:bg-zinc-900">
          <div>
            <dt className="text-xs uppercase tracking-wider text-zinc-500">Color</dt>
            <dd className="mt-1 flex items-center gap-2 font-medium">
              <span
                className="h-4 w-4 rounded-full border border-black/15"
                style={{ backgroundColor: tee.color.hex }}
              />
              {tee.color.name}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wider text-zinc-500">Placement</dt>
            <dd className="mt-1 font-medium">{placementLabel}</dd>
          </div>
        </dl>

        <div>
          <div className="mb-2 text-xs font-bold uppercase tracking-wider text-zinc-500">
            Size
          </div>
          <div className="flex flex-wrap gap-2">
            {PH_SIZES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                aria-pressed={size === s}
                title={SIZE_LABELS[s]}
                className={
                  "rounded-lg border-2 px-3 py-2 text-sm font-semibold transition " +
                  (size === s
                    ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                    : "border-black/10 hover:border-black/40 dark:border-white/10 dark:hover:border-white/40")
                }
              >
                {SIZE_LABELS[s]}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-2 text-xs font-bold uppercase tracking-wider text-zinc-500">
            Quantity
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="h-10 w-10 rounded-lg border border-black/15 text-xl font-bold hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <input
              type="number"
              min={1}
              max={999}
              value={qty}
              onChange={(e) => {
                const v = Number(e.target.value);
                setQty(
                  Number.isFinite(v) && v > 0 ? Math.min(999, Math.floor(v)) : 1,
                );
              }}
              className="h-10 w-20 rounded-lg border border-black/15 bg-white text-center text-lg font-semibold outline-none focus:border-black dark:border-white/15 dark:bg-zinc-800 dark:focus:border-white"
            />
            <button
              type="button"
              onClick={() => setQty((q) => Math.min(999, q + 1))}
              className="h-10 w-10 rounded-lg border border-black/15 text-xl font-bold hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>

        <div className="sticky bottom-4 flex items-center justify-between gap-3 rounded-2xl border border-black/10 bg-white p-4 shadow-lg dark:border-white/10 dark:bg-zinc-900">
          <div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400">Total</div>
            <div className="text-2xl font-extrabold tabular-nums">
              {formatPHP(tee.price * qty)}
            </div>
          </div>
          <div className="flex flex-1 justify-end gap-2">
            <button
              type="button"
              onClick={onAdd}
              className={
                "rounded-xl px-5 py-3 text-sm font-semibold transition " +
                (justAdded
                  ? "bg-green-600 text-white"
                  : "bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200")
              }
            >
              {justAdded ? "Added ✓" : "Add to cart"}
            </button>
            <Link
              href="/cart"
              className="rounded-xl border border-black/15 px-5 py-3 text-sm font-semibold hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
            >
              View cart →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
