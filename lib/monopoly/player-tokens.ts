export const PLAYER_TOKENS = ["🚗", "🐕", "🎩", "👟"] as const;

export const PLAYER_COLORS = [
  "#ef4444",
  "#3b82f6",
  "#22c55e",
  "#f59e0b",
] as const;

export function getTokenForIndex(index: number): string {
  return PLAYER_TOKENS[index % PLAYER_TOKENS.length];
}

export function getColorForIndex(index: number): string {
  return PLAYER_COLORS[index % PLAYER_COLORS.length];
}
