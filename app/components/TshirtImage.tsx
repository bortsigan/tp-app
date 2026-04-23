"use client";

import Image from "next/image";
import { useState } from "react";
import { TshirtPreview } from "./TshirtPreview";
import type { Placement, ShirtColor } from "@/app/lib/types";

type Props = {
  imageUrl?: string;
  alt: string;
  // These are used when there's no photo yet (or the photo 404'd).
  color: ShirtColor;
  designId: string;
  placement: Placement;
  /**
   * Display size in px. Square.
   * @var number
   */
  size?: number;
  priority?: boolean;
  className?: string;
};

/**
 * Thin wrapper over next/image. If there's no URL or the image
 * fails to load, we swap in the SVG mockup instead of
 * showing a bad image icon. Keeps the shop looking intentional
 * even while we're still waiting for real product photos.
 */
export function TshirtImage({
  imageUrl,
  alt,
  color,
  designId,
  placement,
  size = 220,
  priority = false,
  className,
}: Props) {
  const [errored, setErrored] = useState(false);
  const showFallback = !imageUrl || errored;

  if (showFallback) {
    return (
      <div
        className={className}
        style={{ width: size, height: size }}
        aria-label={alt}
      >
        <TshirtPreview
          color={color}
          designId={designId}
          placement={placement}
          size={size}
        />
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{ width: size, height: size, position: "relative" }}
    >
      <Image
        src={imageUrl}
        alt={alt}
        fill
        // Only fetch an image roughly matching the on-screen size.
        sizes={`${size}px`}
        priority={priority}
        onError={() => setErrored(true)}
        className="object-contain"
      />
    </div>
  );
}
