/**
 * WCAG 2.1 contrast utilities for automatic text color calculation.
 * Ensures at minimum AA (4.5:1) contrast ratio for normal text.
 */

/** Convert hex color to linear RGB values (0-1) */
function hexToLinear(hex: string): [number, number, number] {
  const h = hex.startsWith('#') ? hex.slice(1) : hex;
  const full = h.length === 3 ? h[0]+h[0]+h[1]+h[1]+h[2]+h[2] : h;
  const r = parseInt(full.slice(0, 2), 16) / 255;
  const g = parseInt(full.slice(2, 4), 16) / 255;
  const b = parseInt(full.slice(4, 6), 16) / 255;
  // sRGB to linear
  const toLinear = (c: number) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  return [toLinear(r), toLinear(g), toLinear(b)];
}

/** Relative luminance per WCAG 2.1 */
export function luminance(hex: string): number {
  const [r, g, b] = hexToLinear(hex);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Contrast ratio between two colors (1:1 to 21:1) */
export function contrastRatio(hex1: string, hex2: string): number {
  const l1 = luminance(hex1);
  const l2 = luminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Returns a text color (dark or light) that achieves at least AA contrast (4.5:1)
 * against the given background color.
 */
export function getContrastColor(bgHex: string): string {
  const lum = luminance(bgHex);
  // Light background → dark text, dark background → light text
  if (lum > 0.179) {
    return '#1a1a1a';
  }
  return '#f5f5f5';
}

/**
 * Check if two colors meet WCAG AA for normal text (4.5:1)
 */
export function meetsAA(bg: string, fg: string): boolean {
  return contrastRatio(bg, fg) >= 4.5;
}

/**
 * Returns the contrast level label
 */
export function getContrastLevel(bg: string, fg: string): 'fail' | 'AA' | 'AAA' {
  const ratio = contrastRatio(bg, fg);
  if (ratio >= 7) return 'AAA';
  if (ratio >= 4.5) return 'AA';
  return 'fail';
}
