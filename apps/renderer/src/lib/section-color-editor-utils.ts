import {
  FIELD_DEFS,
  sortColorFields,
  type ColorFieldKey,
} from './section-color-fields';
import { getContrastRatio as calculateContrastRatio } from './color-engine';

export const CORE_FIELD_LIMIT = 12;

export const ALPHA_CAPABLE_FIELDS = new Set<ColorFieldKey>([
  'sectionBgAlt',
  'glowColor',
  'imageOverlay',
  'badgeBg',
  'cardBadgeBg',
  'shadowColor',
]);

export interface EditorFieldGroups {
  core: ColorFieldKey[];
  coreOverflow: ColorFieldKey[];
  special: ColorFieldKey[];
  design: ColorFieldKey[];
  inactive: ColorFieldKey[];
}

/**
 * Keeps the default editor surface honest: a field is active only when the
 * rendered preview uses it, the user set it, or it is the section background.
 * Contract-only fields remain available in a separately labelled disclosure.
 */
export function groupEditorFields(
  fields: ColorFieldKey[],
  usedCssVars: ReadonlySet<string> | null,
  overrides: Readonly<Record<string, string>>,
  coreLimit = CORE_FIELD_LIMIT,
): EditorFieldGroups {
  const activeCore: ColorFieldKey[] = [];
  const special: ColorFieldKey[] = [];
  const design: ColorFieldKey[] = [];
  const inactive: ColorFieldKey[] = [];

  for (const field of sortColorFields(fields)) {
    const definition = FIELD_DEFS[field];
    if (!definition) continue;

    const isSet = Boolean(overrides[definition.cssVar]);
    const isRendered = field === 'sectionBg' || Boolean(usedCssVars?.has(definition.cssVar));
    if (!isSet && !isRendered) {
      inactive.push(field);
      continue;
    }

    if (definition.type === 'size') {
      design.push(field);
    } else if ((definition.group ?? 'advanced') === 'core') {
      activeCore.push(field);
    } else {
      special.push(field);
    }
  }

  const safeLimit = Math.max(1, coreLimit);
  return {
    core: activeCore.slice(0, safeLimit),
    coreOverflow: activeCore.slice(safeLimit),
    special,
    design,
    inactive,
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function toHexByte(value: number): string {
  return Math.round(clamp(value, 0, 255)).toString(16).padStart(2, '0');
}

export function parseColorWithAlpha(value: string | undefined): { hex: string; alpha: number | undefined } {
  const parsed = parseCssColor(value);
  if (!parsed) return { hex: '', alpha: undefined };
  return {
    hex: `#${toHexByte(parsed.r)}${toHexByte(parsed.g)}${toHexByte(parsed.b)}`,
    alpha: parsed.a,
  };
}

export function composeColorWithAlpha(hex: string, alpha: number | undefined): string {
  const parsed = parseCssColor(hex);
  if (!parsed) return hex;
  const nextAlpha = clamp(alpha ?? 1, 0, 1);
  const normalizedHex = `#${toHexByte(parsed.r)}${toHexByte(parsed.g)}${toHexByte(parsed.b)}`;
  if (nextAlpha >= 0.999) return normalizedHex;
  return `rgba(${Math.round(parsed.r)}, ${Math.round(parsed.g)}, ${Math.round(parsed.b)}, ${Number(nextAlpha.toFixed(3))})`;
}

interface RgbaColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

function parseRgbChannel(value: string): number | null {
  const number = Number.parseFloat(value);
  if (!Number.isFinite(number)) return null;
  return value.endsWith('%') ? clamp(number * 2.55, 0, 255) : clamp(number, 0, 255);
}

function parseAlpha(value: string | undefined): number {
  if (!value) return 1;
  const number = Number.parseFloat(value);
  if (!Number.isFinite(number)) return 1;
  return value.endsWith('%') ? clamp(number / 100, 0, 1) : clamp(number, 0, 1);
}

function parseFunctionalParts(value: string): { channels: string[]; alpha?: string } {
  const [channelSource, slashAlpha] = value.split('/').map((part) => part.trim());
  const channels = channelSource.replace(/,/g, ' ').split(/\s+/).filter(Boolean);
  const legacyAlpha = channels.length > 3 ? channels.pop() : undefined;
  return { channels, alpha: slashAlpha || legacyAlpha };
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
  const { channels, alpha } = parseFunctionalParts(value);
  if (channels.length !== 3 || !channels[1].endsWith('%') || !channels[2].endsWith('%')) return null;
  const hue = Number.parseFloat(channels[0]);
  const saturation = Number.parseFloat(channels[1]) / 100;
  const lightness = Number.parseFloat(channels[2]) / 100;
  if (![hue, saturation, lightness].every(Number.isFinite)) return null;

  const h = (((hue % 360) + 360) % 360) / 360;
  const s = clamp(saturation, 0, 1);
  const l = clamp(lightness, 0, 1);
  if (s === 0) {
    const gray = l * 255;
    return { r: gray, g: gray, b: gray, a: parseAlpha(alpha) };
  }

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return {
    r: hueToRgb(p, q, h + 1 / 3) * 255,
    g: hueToRgb(p, q, h) * 255,
    b: hueToRgb(p, q, h - 1 / 3) * 255,
    a: parseAlpha(alpha),
  };
}

function parseCssColor(value: string | undefined): RgbaColor | null {
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
    const { channels, alpha } = parseFunctionalParts(rgbMatch[1]);
    if (channels.length !== 3) return null;
    const rgb = channels.map(parseRgbChannel);
    if (rgb.some((channel) => channel === null)) return null;
    return { r: rgb[0]!, g: rgb[1]!, b: rgb[2]!, a: parseAlpha(alpha) };
  }

  const hslMatch = normalized.match(/^hsla?\((.*)\)$/);
  return hslMatch ? parseHsl(hslMatch[1]) : null;
}

export function getContrastRatio(
  foregroundValue: string,
  backgroundValue: string,
  canvasValue = '#ffffff',
): number | null {
  return calculateContrastRatio(foregroundValue, backgroundValue, canvasValue);
}

export interface ContrastPairDefinition {
  id: string;
  label: string;
  foreground: ColorFieldKey;
  background: ColorFieldKey;
  canvas?: ColorFieldKey;
}

export const CONTRAST_PAIRS: ContrastPairDefinition[] = [
  { id: 'heading-section', label: 'Headline auf Sektionsfläche', foreground: 'headingColor', background: 'sectionBg' },
  { id: 'body-section', label: 'Fließtext auf Sektionsfläche', foreground: 'bodyColor', background: 'sectionBg' },
  { id: 'card-heading', label: 'Karten-Headline auf Karte', foreground: 'cardHeadingColor', background: 'cardBg', canvas: 'sectionBg' },
  { id: 'card-body', label: 'Karten-Text auf Karte', foreground: 'cardBodyColor', background: 'cardBg', canvas: 'sectionBg' },
  { id: 'button', label: 'Button-Text auf Button', foreground: 'btnText', background: 'btnBg', canvas: 'sectionBg' },
  { id: 'badge', label: 'Badge-Text auf Badge', foreground: 'badgeText', background: 'badgeBg', canvas: 'sectionBg' },
  { id: 'card-badge', label: 'Karten-Badge-Text auf Badge', foreground: 'cardBadgeText', background: 'cardBadgeBg', canvas: 'cardBg' },
];

export interface ContrastResult extends ContrastPairDefinition {
  ratio: number;
  passesAA: boolean;
}

export function evaluateContrastPairs(
  fields: ReadonlySet<ColorFieldKey>,
  resolveColor: (field: ColorFieldKey) => string | undefined,
  threshold = 4.5,
): ContrastResult[] {
  const results: ContrastResult[] = [];
  for (const pair of CONTRAST_PAIRS) {
    if (!fields.has(pair.foreground) || !fields.has(pair.background)) continue;
    const foreground = resolveColor(pair.foreground);
    const background = resolveColor(pair.background);
    const canvas = pair.canvas ? resolveColor(pair.canvas) : undefined;
    if (!foreground || !background) continue;
    const ratio = getContrastRatio(foreground, background, canvas);
    if (ratio === null) continue;
    results.push({ ...pair, ratio, passesAA: ratio >= threshold });
  }
  return results;
}
