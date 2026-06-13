export const CHART_COLORS = [
  "oklch(65% 0.18 250)",
  "oklch(65% 0.18 150)",
  "oklch(65% 0.18 50)",
  "oklch(65% 0.18 350)",
  "oklch(65% 0.18 300)",
  "oklch(65% 0.18 200)",
];

export const CHART_COLORS_DARK = [
  "oklch(75% 0.18 250)",
  "oklch(75% 0.18 150)",
  "oklch(75% 0.18 50)",
  "oklch(75% 0.18 350)",
  "oklch(75% 0.18 300)",
  "oklch(75% 0.18 200)",
];

export const CONFEDERATION_COLORS: Record<string, string> = {
  UEFA: "oklch(65% 0.18 250)",
  CONMEBOL: "oklch(65% 0.18 150)",
  CAF: "oklch(65% 0.18 50)",
  AFC: "oklch(65% 0.18 350)",
  CONCACAF: "oklch(65% 0.18 300)",
};

export const CONFEDERATION_COLORS_DARK: Record<string, string> = {
  UEFA: "oklch(75% 0.18 250)",
  CONMEBOL: "oklch(75% 0.18 150)",
  CAF: "oklch(75% 0.18 50)",
  AFC: "oklch(75% 0.18 350)",
  CONCACAF: "oklch(75% 0.18 300)",
};

export function formatCurrency(value: number): string {
  if (value >= 1000000) {
    return `€${(value / 1000000).toFixed(0)}M`;
  }
  if (value >= 1000) {
    return `€${(value / 1000).toFixed(0)}K`;
  }
  return `€${value}`;
}

export function chartColors(isDark: boolean): string[] {
  return isDark ? CHART_COLORS_DARK : CHART_COLORS;
}

export function confederationColor(code: string, isDark: boolean): string {
  const map = isDark ? CONFEDERATION_COLORS_DARK : CONFEDERATION_COLORS;
  return map[code] ?? "oklch(65% 0 0)";
}
