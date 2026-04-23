import type { Design, ShirtColor } from "./types";

export const SHIRT_COLORS: ShirtColor[] = [
  { id: "white", name: "White", hex: "#f8fafc" },
  { id: "black", name: "Black", hex: "#0f172a" },
  { id: "heather-gray", name: "Heather Gray", hex: "#9ca3af" },
  { id: "navy", name: "Navy", hex: "#1e3a8a" },
  { id: "royal-blue", name: "Royal Blue", hex: "#2563eb" },
  { id: "red", name: "Red", hex: "#dc2626" },
  { id: "maroon", name: "Maroon", hex: "#7f1d1d" },
  { id: "forest", name: "Forest Green", hex: "#166534" },
  { id: "olive", name: "Olive", hex: "#65a30d" },
  { id: "mustard", name: "Mustard", hex: "#ca8a04" },
  { id: "pink", name: "Pink", hex: "#ec4899" },
  { id: "lavender", name: "Lavender", hex: "#a78bfa" },
  { id: "cream", name: "Cream", hex: "#fef3c7" },
];

export const DESIGNS: Design[] = [
  { id: "dragon", name: "Dragon", glyph: "🐉", category: "animals" },
  { id: "bear", name: "Bear", glyph: "🐻", category: "animals" },
  { id: "tiger", name: "Tiger", glyph: "🐯", category: "animals" },
  { id: "wolf", name: "Wolf", glyph: "🐺", category: "animals" },
  { id: "eagle", name: "Eagle", glyph: "🦅", category: "animals" },
  { id: "octopus", name: "Octopus", glyph: "🐙", category: "animals" },
  { id: "skull", name: "Skull", glyph: "💀", category: "abstract" },
  { id: "fire", name: "Fire", glyph: "🔥", category: "abstract" },
  { id: "lightning", name: "Lightning", glyph: "⚡", category: "abstract" },
  { id: "star", name: "Star", glyph: "⭐", category: "abstract" },
  { id: "heart", name: "Heart", glyph: "❤️", category: "abstract" },
  { id: "peace", name: "Peace", glyph: "☮️", category: "abstract" },
  { id: "mountain", name: "Mountain", glyph: "⛰️", category: "nature" },
  { id: "wave", name: "Wave", glyph: "🌊", category: "nature" },
  { id: "sun", name: "Sun", glyph: "☀️", category: "nature" },
  { id: "moon", name: "Moon", glyph: "🌙", category: "nature" },
  { id: "leaf", name: "Leaf", glyph: "🍃", category: "nature" },
  { id: "rocket", name: "Rocket", glyph: "🚀", category: "logos" },
  { id: "crown", name: "Crown", glyph: "👑", category: "logos" },
  { id: "diamond", name: "Diamond", glyph: "💎", category: "logos" },
  { id: "coffee", name: "Coffee", glyph: "☕", category: "logos" },
  { id: "pizza", name: "Pizza", glyph: "🍕", category: "logos" },
  { id: "pinas", name: "Pinas", glyph: "🇵🇭", category: "logos" },
  { id: "manila", name: "Manila", glyph: "MNL", category: "text" },
  { id: "ph", name: "PH", glyph: "PH", category: "text" },
  { id: "eat", name: "Eat", glyph: "EAT", category: "text" },
];

export const DESIGN_MAP: Record<string, Design> = Object.fromEntries(
  DESIGNS.map((d) => [d.id, d]),
);

export const COLOR_MAP: Record<string, ShirtColor> = Object.fromEntries(
  SHIRT_COLORS.map((c) => [c.id, c]),
);
