import type { Placement, ShirtColor } from "@/app/lib/types";
import { DESIGN_MAP } from "@/app/lib/designs";

type Props = {
  color: ShirtColor;
  designId: string;
  placement: Placement;
  size?: number;
  showPlacementLabel?: boolean;
};

type Spot = { x: number; y: number; fontSize: number };

const SPOTS: Record<Placement, Spot> = {
  "front-center": { x: 200, y: 240, fontSize: 110 },
  "front-left-chest": { x: 260, y: 145, fontSize: 42 },
  "back-center": { x: 200, y: 240, fontSize: 110 },
  "left-sleeve": { x: 78, y: 175, fontSize: 36 },
  "right-sleeve": { x: 322, y: 175, fontSize: 36 },
};

export function TshirtPreview({
  color,
  designId,
  placement,
  size = 280,
  showPlacementLabel = false,
}: Props) {
  const design = DESIGN_MAP[designId];
  const spot = SPOTS[placement];
  const isDark = isDarkColor(color.hex);
  const strokeColor = isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.18)";
  const backLabelColor = isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)";

  return (
    <svg
      viewBox="0 0 400 400"
      width={size}
      height={size}
      role="img"
      aria-label={`T-shirt in ${color.name} with ${design?.name ?? "no"} design at ${placement}`}
      className="block"
    >
      {/* The shirt itself. */}
      <path
        d={TSHIRT_PATH}
        fill={color.hex}
        stroke={strokeColor}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      {/* Fake collar line so it reads as a shirt and not a gingerbread man. */}
      <path
        d="M160 55 Q200 95 240 55"
        fill="none"
        stroke={strokeColor}
        strokeWidth={3}
      />

      {/* Stamp "BACK" on the back view so we can tell which side we're looking at. */}
      {placement === "back-center" && (
        <text
          x={200}
          y={90}
          textAnchor="middle"
          fontSize={16}
          fontWeight={700}
          letterSpacing={2}
          fill={backLabelColor}
          fontFamily="system-ui, sans-serif"
        >
          BACK
        </text>
      )}

      {/* Design */}
      {design && (
        <text
          x={spot.x}
          y={spot.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={spot.fontSize}
          fontWeight={800}
          fill={isDark ? "#ffffff" : "#111111"}
          fontFamily="'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji', system-ui, sans-serif"
          style={{ paintOrder: "stroke" }}
        >
          {design.glyph}
        </text>
      )}

      {showPlacementLabel && (
        <text
          x={200}
          y={390}
          textAnchor="middle"
          fontSize={12}
          fill="currentColor"
          opacity={0.6}
          fontFamily="system-ui, sans-serif"
        >
          {placement.replace(/-/g, " ")}
        </text>
      )}
    </svg>
  );
}

function isDarkColor(hex: string): boolean {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  // Perceived brightness. Below 0.5 we call it "dark" so the design
  // gets printed in white instead of black.
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum < 0.5;
}

// Raw SVG path for the tee. Traced by hand, don't try to pretty-print it.
const TSHIRT_PATH = `
  M 155 50
  L 100 70
  L 55 130
  L 90 175
  L 125 150
  L 125 355
  Q 125 370 140 370
  L 260 370
  Q 275 370 275 355
  L 275 150
  L 310 175
  L 345 130
  L 300 70
  L 245 50
  Q 225 95 200 95
  Q 175 95 155 50
  Z
`;
