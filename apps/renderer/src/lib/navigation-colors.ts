import { compositeColors, parseCssColor, type RgbaColor } from './color-engine';
import { getHexContrastRatio } from './brand-colors';

function hex(color: RgbaColor) {
  return `#${[color.r, color.g, color.b].map(channel => Math.round(channel).toString(16).padStart(2, '0')).join('')}`;
}

/** A body-link hover color is only suitable for a nav when it is readable there. */
export function resolveNavigationHoverColor({ background, hover, foreground, canvas = '#ffffff' }: {
  background: string;
  hover?: string;
  foreground: string;
  canvas?: string;
}): string {
  const underlay = parseCssColor(canvas) || { r: 255, g: 255, b: 255, a: 1 };
  const surface = compositeColors(parseCssColor(background) || underlay, underlay);
  const surfaceHex = hex(surface);
  for (const candidate of [hover, foreground, '#ffffff', '#111827', '#000000']) {
    const parsed = parseCssColor(candidate);
    if (parsed && (getHexContrastRatio(hex(compositeColors(parsed, surface)), surfaceHex) || 0) >= 4.5) return candidate!;
  }
  return '#000000';
}
