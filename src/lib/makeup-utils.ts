/** Makeup type → emoji icon map. Safe to import from both server and client components. */
export const MAKEUP_ICONS: Record<string, string> = {
  "Bridal": "👰",
  "Pre-Wedding": "📸",
  "Engagement": "💍",
  "Party": "🎉",
  "Saree Draping": "🥻",
};

export function getMakeupIcon(type: string): string {
  return MAKEUP_ICONS[type] ?? "💄";
}
