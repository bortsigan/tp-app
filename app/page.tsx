import Link from "next/link";
import { TshirtCard } from "./components/TshirtCard";
import { TshirtImage } from "./components/TshirtImage";
import { CATALOG } from "./lib/catalog";
import { formatPHP } from "./lib/format";

export default function Home() {
  /** @var CatalogTshirt[] Picked straight from the shop — these are the same items for sale. */
  const featured = CATALOG.slice(0, 4);
  const hero = CATALOG[0];
  const heroSide = CATALOG.slice(1, 3);

  return (
    <div className="flex flex-1 flex-col">
      <section className="relative overflow-hidden border-b border-black/10 dark:border-white/10">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 py-16 sm:px-6 lg:py-24">
          <div className="flex flex-col gap-6">
            <span className="w-fit rounded-full border border-black/10 bg-white/60 px-3 py-1 text-xs font-medium uppercase tracking-wider text-zinc-600 dark:border-white/10 dark:bg-black/40 dark:text-zinc-300">
              Print-on-demand · Philippines
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">
              Wear your <span className="text-red-600">story</span>.
              <br />
              Print your <span className="text-blue-600">vibe</span>.
            </h1>
            <p className="max-w-lg text-lg text-zinc-600 dark:text-zinc-300">
              Shop ready-made tees or build your own from scratch. Pick your color,
              your design, where you want it printed, and your size. Add to cart.
              That&apos;s it.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="rounded-full bg-black px-6 py-3 font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
              >
                Browse the shop
              </Link>
              <Link
                href="/customize"
                className="rounded-full border border-black/20 px-6 py-3 font-semibold hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
              >
                Design your own →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Featured tees
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              A quick look at what&apos;s on the rack right now.
            </p>
          </div>
          <Link
            href="/shop"
            className="shrink-0 text-sm font-semibold underline underline-offset-4"
          >
            See all {CATALOG.length} →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((tee) => (
            <TshirtCard key={tee.id} tee={tee} />
          ))}
        </div>
      </section>
    </div>
  );
}
