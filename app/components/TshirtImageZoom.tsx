"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { TshirtPreview } from "./TshirtPreview";
import type { Placement, ShirtColor } from "@/app/lib/types";

type Props = {
  imageUrl?: string;
  alt: string;
  color: ShirtColor;
  designId: string;
  placement: Placement;
  /**
   * How much to magnify the lens area. 2.2 feels right on most photos.
   * @var number
   */
  zoom?: number;
  /**
   * Lens diameter in px.
   * @var number
   */
  lensSize?: number;
};

/**
 * Product image with a jeweler's-loupe | magnifying glass style hover zoom.
 * Move the cursor over the image and a circle follows, showing
 * whatever pixel is under the cursor at a higher resolution.
 *
 * If there's no real image to zoom into, just show the SVG mockup
 * (no point magnifying a vector — it's already good at any size).
 */
export function TshirtImageZoom({
  imageUrl,
  alt,
  color,
  designId,
  placement,
  zoom = 2.2,
  lensSize = 180,
}: Props) {
  const [errored, setErrored] = useState(false);
  const [active, setActive] = useState(false);
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [bgSize, setBgSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const showFallback = !imageUrl || errored;

  if (showFallback) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-2xl bg-zinc-100 p-6 dark:bg-zinc-800">
        <TshirtPreview
          color={color}
          designId={designId}
          placement={placement}
          size={420}
        />
      </div>
    );
  }

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPos({ x, y });
    setBgSize({ w: rect.width * zoom, h: rect.height * zoom });
  };

  // Keep the lens from sliding past the edges — looked ugly otherwise.
  const half = lensSize / 2;
  const lensX = Math.max(half, Math.min(pos.x, (containerRef.current?.clientWidth ?? 0) - half));
  const lensY = Math.max(half, Math.min(pos.y, (containerRef.current?.clientHeight ?? 0) - half));

  // Nudge the zoomed background so the exact pixel under the cursor
  // sits dead-center in the lens.
  const bgX = -(pos.x * zoom - half);
  const bgY = -(pos.y * zoom - half);

  return (
    <div
      ref={containerRef}
      className="relative aspect-square w-full overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800"
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onMouseMove={handleMove}
    >
      <Image
        src={imageUrl!}
        alt={alt}
        fill
        sizes="(max-width: 1024px) 100vw, 560px"
        priority
        onError={() => setErrored(true)}
        className="object-contain"
      />

      {active && bgSize.w > 0 && (
        <div
          aria-hidden
          className="pointer-events-none absolute rounded-full border-2 border-white shadow-[0_6px_20px_rgba(0,0,0,0.35)]"
          style={{
            width: lensSize,
            height: lensSize,
            left: lensX - half,
            top: lensY - half,
            backgroundImage: `url(${imageUrl})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: `${bgSize.w}px ${bgSize.h}px`,
            backgroundPosition: `${bgX}px ${bgY}px`,
            backgroundColor: "#fff",
          }}
        />
      )}

      <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-white opacity-0 transition-opacity [@media(hover:hover)]:group-hover:opacity-100">
        Hover to zoom
      </div>
    </div>
  );
}
