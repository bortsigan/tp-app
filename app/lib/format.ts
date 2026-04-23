/**
 * Used outside cart.tsx on purpose. cart.tsx is `"use client"`, and
 * server components can't import functions from a client module.
 *
 * @var (amount: number) => string
 */
export function formatPHP(amount: number): string {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
