export interface RgbaColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

function inRange(value: number, min: number, max: number): boolean {
  return Number.isFinite(value) && value >= min && value <= max;
}

function parseRgbChannel(value: string): number | null {
  const number = Number.parseFloat(value);
  const isPercent = value.endsWith('%');
  if (!inRange(number, 0, isPercent ? 100 : 255)) return null;
  return isPercent ? number * 2.55 : number;
}

function parseAlpha(value: string | undefined): number | null {
  if (value === undefined) return 1;
  const number = Number.parseFloat(value);
  const isPercent = value.endsWith('%');
  if (!inRange(number, 0, isPercent ? 100 : 1)) return null;
  return isPercent ? number / 100 : number;
}

function parseFunctionalParts(value: string): { channels: string[]; alpha?: string } {
  const parts = value.split('/');
  if (parts.length > 2) return { channels: [] };
  const channels = parts[0].trim().replace(/,/g, ' ').split(/\s+/).filter(Boolean);
  const legacyAlpha = channels.length > 3 ? channels.pop() : undefined;
  return { channels, alpha: parts[1]?.trim() || legacyAlpha };
}

function hueToRgb(p: number, q: number, hue: number): number {
  let nextHue = hue;
  if (nextHue < 0) nextHue += 1;
  if (nextHue > 1) nextHue -= 1;
  if (nextHue < 1 / 6) return p + (q - p) * 6 * nextHue;
  if (nextHue < 1 / 2) return q;
  if (nextHue < 2 / 3) return p + (q - p) * (2 / 3 - nextHue) * 6;
  return p;
}

function parseHsl(value: string): RgbaColor | null {
  const { channels, alpha: rawAlpha } = parseFunctionalParts(value);
  if (channels.length !== 3 || !channels[1].endsWith('%') || !channels[2].endsWith('%')) return null;
  const hue = Number.parseFloat(channels[0]);
  const saturation = Number.parseFloat(channels[1]);
  const lightness = Number.parseFloat(channels[2]);
  const alpha = parseAlpha(rawAlpha);
  if (!Number.isFinite(hue) || !inRange(saturation, 0, 100) || !inRange(lightness, 0, 100) || alpha === null) return null;

  const h = (((hue % 360) + 360) % 360) / 360;
  const s = saturation / 100;
  const l = lightness / 100;
  if (s === 0) {
    const gray = l * 255;
    return { r: gray, g: gray, b: gray, a: alpha };
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return {
    r: hueToRgb(p, q, h + 1 / 3) * 255,
    g: hueToRgb(p, q, h) * 255,
    b: hueToRgb(p, q, h - 1 / 3) * 255,
    a: alpha,
  };
}

/** Parse a concrete CSS color without silently clamping invalid channels. */
export function parseCssColor(value: string | undefined): RgbaColor | null {
  if (!value) return null;
  const normalized = value.trim().toLowerCase();
  if (normalized === 'transparent') return { r: 0, g: 0, b: 0, a: 0 };

  const hexMatch = normalized.match(/^#([0-9a-f]+)$/i);
  if (hexMatch && [3, 4, 6, 8].includes(hexMatch[1].length)) {
    let hex = hexMatch[1];
    if (hex.length <= 4) hex = hex.split('').map((character) => character + character).join('');
    return {
      r: Number.parseInt(hex.slice(0, 2), 16),
      g: Number.parseInt(hex.slice(2, 4), 16),
      b: Number.parseInt(hex.slice(4, 6), 16),
      a: hex.length === 8 ? Number.parseInt(hex.slice(6, 8), 16) / 255 : 1,
    };
  }

  const rgbMatch = normalized.match(/^rgba?\((.*)\)$/);
  if (rgbMatch) {
    const { channels, alpha: rawAlpha } = parseFunctionalParts(rgbMatch[1]);
    if (channels.length !== 3) return null;
    const rgb = channels.map(parseRgbChannel);
    const alpha = parseAlpha(rawAlpha);
    if (rgb.some((channel) => channel === null) || alpha === null) return null;
    return { r: rgb[0]!, g: rgb[1]!, b: rgb[2]!, a: alpha };
  }

  const hslMatch = normalized.match(/^hsla?\((.*)\)$/);
  return hslMatch ? parseHsl(hslMatch[1]) : null;
}

export function compositeColors(foreground: RgbaColor, background: RgbaColor): RgbaColor {
  const alpha = foreground.a + background.a * (1 - foreground.a);
  if (alpha === 0) return { r: 0, g: 0, b: 0, a: 0 };
  return {
    r: (foreground.r * foreground.a + background.r * background.a * (1 - foreground.a)) / alpha,
    g: (foreground.g * foreground.a + background.g * background.a * (1 - foreground.a)) / alpha,
    b: (foreground.b * foreground.a + background.b * background.a * (1 - foreground.a)) / alpha,
    a: alpha,
  };
}

export function relativeColorLuminance(color: RgbaColor): number {
  const channels = [color.r, color.g, color.b].map((channel) => {
    const normalized = channel / 255;
    return normalized <= 0.04045
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  });
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

/** WCAG contrast after painting canvas, background, then foreground. */
export function getContrastRatio(
  foregroundValue: string,
  backgroundValue: string,
  canvasValue = '#ffffff',
): number | null {
  const foreground = parseCssColor(foregroundValue);
  const background = parseCssColor(backgroundValue);
  const canvas = parseCssColor(canvasValue);
  if (!foreground || !background || !canvas) return null;

  const white = { r: 255, g: 255, b: 255, a: 1 };
  const opaqueCanvas = compositeColors(canvas, white);
  const paintedBackground = compositeColors(background, opaqueCanvas);
  const paintedForeground = compositeColors(foreground, paintedBackground);
  const foregroundLuminance = relativeColorLuminance(paintedForeground);
  const backgroundLuminance = relativeColorLuminance(paintedBackground);
  return (Math.max(foregroundLuminance, backgroundLuminance) + 0.05)
    / (Math.min(foregroundLuminance, backgroundLuminance) + 0.05);
}
