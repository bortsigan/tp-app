"use client";

import { useState } from "react";
import Link from "next/link";
import { TshirtImage } from "./TshirtImage";
import { formatPHP, useCart } from "@/app/lib/cart";
import { PH_SIZES, SIZE_LABELS, type CatalogTshirt, type PHSize } from "@/app/lib/types";

export function TshirtCard({ tee }: { tee: CatalogTshirt }) {
  const { addItem } = useCart();
  const [size, setSize] = useState<PHSize>("M");
  const [justAdded, setJustAdded] = useState(false);

  const onAdd = () => {
    addItem({
      kind: "catalog",
      name: tee.name,
      price: tee.price,
      qty: 1,
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
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-black/10 bg-white transition hover:shadow-lg dark:border-white/10 dark:bg-zinc-900">
      <Link
        href={`/shop/${tee.id}`}
        className="relative block overflow-hidden p-4"
        style={{
          background:
            "repeating-linear-gradient(45deg, rgba(0,0,0,0.03) 0 10px, rgba(0,0,0,0) 10px 20px)",
        }}
        aria-label={`View ${tee.name} details`}
      >
        <div className="flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
          <TshirtImage
            imageUrl={tee.imageUrl}
            alt={`${tee.name} — ${tee.color.name}`}
            color={tee.color}
            designId={tee.designId}
            placement={tee.placement}
            size={220}
          />
        </div>
        <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/80 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-white opacity-0 transition-opacity group-hover:opacity-100">
          View details
        </span>
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <Link
              href={`/shop/${tee.id}`}
              className="font-semibold leading-tight hover:underline"
            >
              {tee.name}
            </Link>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">{tee.color.name}</p>
          </div>
          <div className="text-right text-lg font-bold">{formatPHP(tee.price)}</div>
        </div>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
          {tee.description}
        </p>
        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Size
          </label>
          <div className="flex flex-wrap gap-1">
            {PH_SIZES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                className={
                  "rounded-md border px-2 py-1 text-xs font-medium transition " +
                  (size === s
                    ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                    : "border-black/15 hover:border-black/40 dark:border-white/15 dark:hover:border-white/40")
                }
                aria-pressed={size === s}
                title={SIZE_LABELS[s]}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className={
            "mt-auto w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition " +
            (justAdded
              ? "bg-green-600 text-white"
              : "bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200")
          }
        >
          {justAdded ? "Added to cart ✓" : "Add to cart"}
        </button>
      </div>
    </div>
  );
}
