/** Makeup type → emoji icon map. Safe to import from both server and client components. */
export const MAKEUP_ICONS: Record<string, string> = {
  "Simple Makeover": "💄",
  "Bridal Makeover": "👰",
  "Saree + Hair Draping": "🥻",
  "Saree Draping + Hairstyle": "🥻",
};

export function getMakeupIcon(type: string): string {
  return MAKEUP_ICONS[type] ?? "✨";
}
