"use client";

import { useMemo, useState } from "react";
import { CATALOG } from "@/app/lib/catalog";
import { SHIRT_COLORS } from "@/app/lib/designs";
import { TshirtCard } from "@/app/components/TshirtCard";

type SortBy = "featured" | "price-asc" | "price-desc" | "name-asc";

const PRICE_MIN = 0;
const PRICE_MAX = 1000;

export default function ShopPage() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortBy>("featured");
  const [colorIds, setColorIds] = useState<Set<string>>(new Set());
  const [priceMin, setPriceMin] = useState<number>(PRICE_MIN);
  const [priceMax, setPriceMax] = useState<number>(PRICE_MAX);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = CATALOG.filter((t) => {
      if (q && !t.name.toLowerCase().includes(q) && !t.description.toLowerCase().includes(q)) {
        return false;
      }
      if (colorIds.size > 0 && !colorIds.has(t.color.id)) return false;
      if (t.price < priceMin || t.price > priceMax) return false;
      return true;
    });

    switch (sort) {
      case "price-asc":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        list = [...list].sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }
    return list;
  }, [query, sort, colorIds, priceMin, priceMax]);

  const toggleColor = (id: string) => {
    setColorIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const resetFilters = () => {
    setQuery("");
    setSort("featured");
    setColorIds(new Set());
    setPriceMin(PRICE_MIN);
    setPriceMax(PRICE_MAX);
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Shop</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          {filtered.length} tees found. Sort, filter, search — then grab yours.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="flex flex-col gap-6 rounded-2xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-zinc-900 lg:sticky lg:top-20 lg:self-start">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Search
            </label>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name..."
              className="w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-black dark:border-white/15 dark:bg-zinc-800 dark:focus:border-white"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Sort by
            </label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortBy)}
              className="w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-black dark:border-white/15 dark:bg-zinc-800 dark:focus:border-white"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="name-asc">Name: A → Z</option>
            </select>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Price range
              </span>
              <span className="text-xs tabular-nums text-zinc-600 dark:text-zinc-400">
                ₱{priceMin} – ₱{priceMax}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs text-zinc-500">Min: ₱{priceMin}</label>
              <input
                type="range"
                min={PRICE_MIN}
                max={PRICE_MAX}
                step={10}
                value={priceMin}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setPriceMin(Math.min(v, priceMax));
                }}
                className="w-full accent-black dark:accent-white"
              />
              <label className="text-xs text-zinc-500">Max: ₱{priceMax}</label>
              <input
                type="range"
                min={PRICE_MIN}
                max={PRICE_MAX}
                step={10}
                value={priceMax}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setPriceMax(Math.max(v, priceMin));
                }}
                className="w-full accent-black dark:accent-white"
              />
            </div>
          </div>

          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Colors
            </div>
            <div className="flex flex-wrap gap-2">
              {SHIRT_COLORS.map((c) => {
                const active = colorIds.has(c.id);
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => toggleColor(c.id)}
                    title={c.name}
                    aria-pressed={active}
                    aria-label={c.name}
                    className={
                      "relative h-8 w-8 rounded-full border-2 transition " +
                      (active
                        ? "border-black ring-2 ring-black ring-offset-2 dark:border-white dark:ring-white dark:ring-offset-zinc-900"
                        : "border-black/20 hover:border-black/60 dark:border-white/20 dark:hover:border-white/60")
                    }
                    style={{ backgroundColor: c.hex }}
                  />
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={resetFilters}
            className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm font-medium hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
          >
            Reset filters
          </button>
        </aside>

        <section>
          {filtered.length === 0 ? (
            <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-black/20 text-zinc-500 dark:border-white/20">
              No tees match your filters. Try resetting.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((t) => (
                <TshirtCard key={t.id} tee={t} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
