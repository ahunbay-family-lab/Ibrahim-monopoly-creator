export const COLOR_CLASSES: Record<string, string> = {
  brown: "bg-amber-800",
  "light-blue": "bg-sky-400",
  pink: "bg-pink-400",
  orange: "bg-orange-500",
  red: "bg-red-500",
  yellow: "bg-yellow-400",
  green: "bg-green-600",
  "dark-blue": "bg-blue-800",
};

export function formatMoney(amount: number): string {
  return `$${amount.toLocaleString()}`;
}
