import Link from "next/link";
import { TshirtPreview } from "./components/TshirtPreview";
import { COLOR_MAP } from "./lib/designs";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <section className="relative overflow-hidden border-b border-black/10 dark:border-white/10">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
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

          <div className="relative flex items-center justify-center">
            <div className="absolute -left-6 top-8 rotate-[-8deg] opacity-90">
              <TshirtPreview color={COLOR_MAP["red"]} designId="fire" placement="front-center" size={220} />
            </div>
            <div className="relative z-10">
              <TshirtPreview
                color={COLOR_MAP["black"]}
                designId="dragon"
                placement="front-center"
                size={320}
              />
            </div>
            <div className="absolute -right-6 bottom-2 rotate-[8deg] opacity-90">
              <TshirtPreview
                color={COLOR_MAP["mustard"]}
                designId="tiger"
                placement="front-center"
                size={220}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-4 py-16 sm:grid-cols-3 sm:px-6">
        <Feature
          title="Shop ready-made"
          body="Sort by price, filter by color, search by name. Add to cart in seconds."
          href="/shop"
          cta="Go to shop"
        />
        <Feature
          title="Customize anything"
          body="Pick a shirt color, choose a design, decide the placement, lock the size."
          href="/customize"
          cta="Start designing"
        />
        <Feature
          title="Pinoy sizing"
          body="XSS (babies), XS, S, M, L, XL, XXL. Sizes that actually fit us."
          href="/shop"
          cta="See the fit"
        />
      </section>
    </div>
  );
}

function Feature({ title, body, href, cta }: { title: string; body: string; href: string; cta: string }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-zinc-900">
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">{body}</p>
      <Link href={href} className="mt-auto w-fit text-sm font-semibold underline underline-offset-4">
        {cta} →
      </Link>
    </div>
  );
}
