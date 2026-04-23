"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { DESIGNS, SHIRT_COLORS } from "@/app/lib/designs";
import {
  PH_SIZES,
  PLACEMENTS,
  SIZE_LABELS,
  type Design,
  type PHSize,
  type Placement,
  type ShirtColor,
} from "@/app/lib/types";
import { TshirtPreview } from "@/app/components/TshirtPreview";
import { formatPHP, useCart } from "@/app/lib/cart";

const Tshirt3D = dynamic(() => import("@/app/components/Tshirt3D"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[460px] w-full items-center justify-center rounded-2xl bg-zinc-100 text-sm text-zinc-500 dark:bg-zinc-800">
      Loading 3D preview…
    </div>
  ),
});

const BASE_PRICE = 399;
const PLACEMENT_UPCHARGE: Record<Placement, number> = {
  "front-center": 0,
  "front-left-chest": 0,
  "back-center": 50,
  "left-sleeve": 30,
  "right-sleeve": 30,
};

const CATEGORIES: { id: Design["category"] | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "animals", label: "Animals" },
  { id: "logos", label: "Logos" },
  { id: "nature", label: "Nature" },
  { id: "abstract", label: "Abstract" },
  { id: "text", label: "Text" },
];

export default function CustomizePage() {
  const { addItem } = useCart();
  const [color, setColor] = useState<ShirtColor>(SHIRT_COLORS[0]);
  const [designId, setDesignId] = useState<string>(DESIGNS[0].id);
  const [placement, setPlacement] = useState<Placement>("front-center");
  const [size, setSize] = useState<PHSize>("M");
  const [qty, setQty] = useState<number>(1);
  const [category, setCategory] = useState<Design["category"] | "all">("all");
  const [justAdded, setJustAdded] = useState(false);
  const [view, setView] = useState<"3d" | "2d">("3d");
  const [autoRotate, setAutoRotate] = useState(false);

  const price = BASE_PRICE + PLACEMENT_UPCHARGE[placement];
  const total = price * qty;

  const filteredDesigns = useMemo(
    () => (category === "all" ? DESIGNS : DESIGNS.filter((d) => d.category === category)),
    [category],
  );

  const onAdd = () => {
    addItem({
      kind: "custom",
      name: `Custom ${color.name} Tee`,
      price,
      qty,
      color,
      size,
      designId,
      placement,
    });
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Design your tee</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Color, design, placement, size. That&apos;s your shirt.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_420px]">
        {/* Preview */}
        <div className="flex flex-col items-center gap-4 rounded-3xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-zinc-900 lg:sticky lg:top-20 lg:self-start">
          <div className="flex w-full items-center justify-between gap-2">
            <div className="inline-flex rounded-full border border-black/10 bg-zinc-100 p-1 text-xs font-semibold dark:border-white/10 dark:bg-zinc-800">
              <button
                type="button"
                onClick={() => setView("3d")}
                className={
                  "rounded-full px-3 py-1 transition " +
                  (view === "3d"
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : "text-zinc-600 dark:text-zinc-300")
                }
                aria-pressed={view === "3d"}
              >
                3D
              </button>
              <button
                type="button"
                onClick={() => setView("2d")}
                className={
                  "rounded-full px-3 py-1 transition " +
                  (view === "2d"
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : "text-zinc-600 dark:text-zinc-300")
                }
                aria-pressed={view === "2d"}
              >
                2D
              </button>
            </div>
            {view === "3d" && (
              <label className="flex cursor-pointer items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                <input
                  type="checkbox"
                  checked={autoRotate}
                  onChange={(e) => setAutoRotate(e.target.checked)}
                  className="h-4 w-4 accent-black dark:accent-white"
                />
                Auto-rotate
              </label>
            )}
          </div>

          {view === "3d" ? (
            <Tshirt3D
              color={color}
              designId={designId}
              placement={placement}
              autoRotate={autoRotate}
              className="h-[460px] w-full overflow-hidden rounded-2xl"
            />
          ) : (
            <div
              className="flex w-full items-center justify-center rounded-2xl p-4"
              style={{
                background:
                  "repeating-linear-gradient(45deg, rgba(0,0,0,0.04) 0 10px, rgba(0,0,0,0) 10px 20px)",
              }}
            >
              <TshirtPreview
                color={color}
                designId={designId}
                placement={placement}
                size={420}
              />
            </div>
          )}

          <div className="flex w-full items-center justify-between text-sm">
            <div className="text-zinc-500 dark:text-zinc-400">
              {color.name} · Size {size} · {PLACEMENTS.find((p) => p.id === placement)?.label}
            </div>
            <div className="font-semibold tabular-nums">{formatPHP(price)} / shirt</div>
          </div>
          {view === "3d" && (
            <p className="w-full text-center text-xs text-zinc-500 dark:text-zinc-500">
              Drag to rotate · scroll to zoom
            </p>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-6">
          <Section title="1. Shirt color">
            <div className="flex flex-wrap gap-2">
              {SHIRT_COLORS.map((c) => {
                const active = c.id === color.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setColor(c)}
                    aria-pressed={active}
                    title={c.name}
                    className={
                      "flex items-center gap-2 rounded-full border-2 py-1.5 pl-1.5 pr-3 text-sm font-medium transition " +
                      (active
                        ? "border-black dark:border-white"
                        : "border-black/10 hover:border-black/40 dark:border-white/10 dark:hover:border-white/40")
                    }
                  >
                    <span
                      className="h-6 w-6 rounded-full border border-black/10"
                      style={{ backgroundColor: c.hex }}
                    />
                    {c.name}
                  </button>
                );
              })}
            </div>
          </Section>

          <Section title="2. Design">
            <div className="mb-3 flex flex-wrap gap-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={
                    "rounded-full px-3 py-1 text-xs font-medium transition " +
                    (category === cat.id
                      ? "bg-black text-white dark:bg-white dark:text-black"
                      : "bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20")
                  }
                >
                  {cat.label}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
              {filteredDesigns.map((d) => {
                const active = d.id === designId;
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setDesignId(d.id)}
                    aria-pressed={active}
                    title={d.name}
                    className={
                      "flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border-2 p-1 text-center transition " +
                      (active
                        ? "border-black bg-black/5 dark:border-white dark:bg-white/10"
                        : "border-black/10 hover:border-black/40 dark:border-white/10 dark:hover:border-white/40")
                    }
                  >
                    <span className="text-2xl leading-none">{d.glyph}</span>
                    <span className="text-[10px] font-medium text-zinc-600 dark:text-zinc-400">
                      {d.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </Section>

          <Section title="3. Placement">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {PLACEMENTS.map((p) => {
                const active = placement === p.id;
                const upcharge = PLACEMENT_UPCHARGE[p.id];
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPlacement(p.id)}
                    aria-pressed={active}
                    className={
                      "flex items-center justify-between rounded-xl border-2 px-4 py-3 text-left text-sm transition " +
                      (active
                        ? "border-black bg-black/5 dark:border-white dark:bg-white/10"
                        : "border-black/10 hover:border-black/40 dark:border-white/10 dark:hover:border-white/40")
                    }
                  >
                    <span className="font-medium">{p.label}</span>
                    {upcharge > 0 && (
                      <span className="text-xs text-zinc-500">+₱{upcharge}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </Section>

          <Section title="4. Size (Filipino sizing)">
            <div className="flex flex-wrap gap-2">
              {PH_SIZES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  aria-pressed={size === s}
                  className={
                    "rounded-lg border-2 px-3 py-2 text-sm font-semibold transition " +
                    (size === s
                      ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                      : "border-black/10 hover:border-black/40 dark:border-white/10 dark:hover:border-white/40")
                  }
                  title={SIZE_LABELS[s]}
                >
                  {SIZE_LABELS[s]}
                </button>
              ))}
            </div>
          </Section>

          <Section title="5. Quantity">
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
                  setQty(Number.isFinite(v) && v > 0 ? Math.min(999, Math.floor(v)) : 1);
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
          </Section>

          <div className="sticky bottom-4 flex items-center justify-between gap-3 rounded-2xl border border-black/10 bg-white p-4 shadow-lg dark:border-white/10 dark:bg-zinc-900">
            <div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">Total</div>
              <div className="text-2xl font-extrabold tabular-nums">{formatPHP(total)}</div>
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
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-zinc-900">
      <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-zinc-500">{title}</h2>
      {children}
    </div>
  );
}
