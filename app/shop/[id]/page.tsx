import Link from "next/link";
import { notFound } from "next/navigation";
import { CATALOG } from "@/app/lib/catalog";
import { ProductDetail } from "./ProductDetail";

export function generateStaticParams() {
  return CATALOG.map((t) => ({ id: t.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tee = CATALOG.find((t) => t.id === id);
  if (!tee) return { title: "Tee not found" };
  return {
    title: `${tee.name} — Tee Press PH`,
    description: tee.description,
  };
}

export default async function TeeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tee = CATALOG.find((t) => t.id === id);
  if (!tee) notFound();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <nav className="mb-4 text-sm text-zinc-500">
        <Link href="/shop" className="hover:underline">
          Shop
        </Link>
        <span className="mx-2">/</span>
        <span className="text-zinc-800 dark:text-zinc-200">{tee.name}</span>
      </nav>
      <ProductDetail tee={tee} />
    </div>
  );
}
