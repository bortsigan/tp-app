export type PHSize = "XSS" | "XS" | "S" | "M" | "L" | "XL" | "XXL";

export const PH_SIZES: PHSize[] = ["XSS", "XS", "S", "M", "L", "XL", "XXL"];

export const SIZE_LABELS: Record<PHSize, string> = {
  XSS: "XSS (babies)",
  XS: "XS",
  S: "S",
  M: "M",
  L: "L",
  XL: "XL",
  XXL: "XXL",
};

export type ShirtColor = {
  id: string;
  name: string;
  hex: string;
};

export type Placement = "front-center" | "front-left-chest" | "back-center" | "left-sleeve" | "right-sleeve";

export const PLACEMENTS: { id: Placement; label: string }[] = [
  { id: "front-center", label: "Front (center)" },
//  { id: "front-left-chest", label: "Front (left chest)" },
  { id: "back-center", label: "Back (center)" },
  // { id: "left-sleeve", label: "Left sleeve" },
  // { id: "right-sleeve", label: "Right sleeve" },
];

export type CatalogTshirt = {
  id: string;
  name: string;
  description: string;
  /**
   * Price in PHP (whole pesos, no cents).
   * @var number
   */
  price: number;
  color: ShirtColor;
  /**
   * FK-ish pointer to DESIGNS[].id
   * @var string
   */
  designId: string;
  placement: Placement;
  /**
   * Product photo. Leave blank and we fall back to the SVG preview so
   * nothing looks broken while we're still uploading real shots.
   * TODO: swap to a DB field once Laravel is available.
   * @var string
   */
  imageUrl?: string;
};

export type Design = {
  id: string;
  name: string;
  /**
   * What gets printed. Can be an emoji or a short text label (e.g. "MNL").
   * @var string
   */
  glyph: string;
  category: "animals" | "logos" | "nature" | "abstract" | "text";
};

export type CartItem = {
  /**
   * One-off id for this cart line. Not the product id.
   * @var string
   */
  id: string;
  kind: "catalog" | "custom";
  name: string;
  price: number;
  qty: number;
  color: ShirtColor;
  size: PHSize;
  designId: string;
  placement: Placement;
  /**
   * Copied from the catalog item so the cart thumbnail still works
   * after the source tee list changes. Custom orders leave this blank.
   * @var string
   */
  imageUrl?: string;
};
