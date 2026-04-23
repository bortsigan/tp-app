"use client";

import Link from "next/link";
import { useCart } from "@/app/lib/cart";

export function Header() {
  const { count, hydrated } = useCart();
  return (
    <header className="sticky top-0 z-40 w-full border-b border-black/10 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-black/60">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold tracking-tight">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-black text-white dark:bg-white dark:text-black">
            TP
          </span>
          <span className="text-lg">The Press PH</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm sm:gap-4">
          <Link
            href="/shop"
            className="rounded-full px-3 py-1.5 hover:bg-black/5 dark:hover:bg-white/10"
          >
            Shop
          </Link>
          <Link
            href="/customize"
            className="rounded-full px-3 py-1.5 hover:bg-black/5 dark:hover:bg-white/10"
          >
            Customize
          </Link>
          <Link
            href="/cart"
            className="relative inline-flex items-center gap-2 rounded-full bg-black px-4 py-1.5 font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            <CartIcon />
            <span>Cart</span>
            {hydrated && count > 0 && (
              <span className="ml-1 inline-flex min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold text-white">
                {count}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}

function CartIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}
