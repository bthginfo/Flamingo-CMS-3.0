import {
  FIELD_DEFS,
  sortColorFields,
  type ColorFieldKey,
} from './section-color-fields';
import { getContrastRatio as calculateContrastRatio } from './color-engine';

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
  actions: ColorFieldKey[];
  surfaces: ColorFieldKey[];
  states: ColorFieldKey[];
  design: ColorFieldKey[];
}

export type EditorFieldGroupKey = keyof EditorFieldGroups;

/**
 * Customer-facing editor taxonomy. Keeping this list explicit makes missing
 * metadata a test failure instead of silently dropping a renderer token into
 * a vague "advanced" bucket.
 */
export const EDITOR_FIELD_GROUPS: Readonly<Record<EditorFieldGroupKey, readonly ColorFieldKey[]>> = {
  core: [
    'sectionBg',
    'headingColor',
    'subheadingColor',
    'bodyColor',
    'mutedColor',
    'iconColor',
    'accentColor',
  ],
  actions: [
    'btnBg',
    'btnText',
    'btnSecondaryBg',
    'btnSecondaryText',
    'btnSecondaryBorder',
    'linkColor',
  ],
  surfaces: [
    'sectionBgAlt',
    'cardBg',
    'cardHeadingColor',
    'cardBodyColor',
    'cardMutedColor',
    'cardBadgeBg',
    'cardBadgeText',
    'cardIconColor',
    'badgeBg',
    'badgeText',
    'badgeBorder',
    'borderColor',
    'dividerColor',
    'imageOverlay',
    'glowColor',
    'inputBg',
    'inputBorder',
    'inputText',
    'labelColor',
    'pageBg',
    'shadowColor',
  ],
  states: [
    'linkHoverColor',
    'successColor',
    'successBg',
    'dangerColor',
    'dangerBg',
    'priceColor',
    'priceStrikeColor',
    'eyebrow',
    'statValue',
    'quoteMark',
    'ratingStar',
    'check',
  ],
  design: [
    'cardRadius',
    'buttonRadius',
    'cardShadow',
    'headingWeight',
    'headingTracking',
  ],
};

const EDITOR_FIELD_GROUP_BY_KEY = new Map<ColorFieldKey, EditorFieldGroupKey>(
  (Object.entries(EDITOR_FIELD_GROUPS) as [EditorFieldGroupKey, readonly ColorFieldKey[]][])
    .flatMap(([group, fields]) => fields.map((field) => [field, group] as const)),
);

export function getEditorFieldGroup(field: ColorFieldKey): EditorFieldGroupKey | null {
  return EDITOR_FIELD_GROUP_BY_KEY.get(field) ?? null;
}

/**
 * Static renderer contracts are the source of truth. Runtime preview data is
 * deliberately not accepted here, so closing the preview can never remove a
 * supported control from the editor.
 */
export function groupEditorFields(fields: ColorFieldKey[]): EditorFieldGroups {
  const groups: EditorFieldGroups = {
    core: [],
    actions: [],
    surfaces: [],
    states: [],
    design: [],
  };

  for (const field of sortColorFields(fields)) {
    if (!FIELD_DEFS[field]) continue;
    const group = getEditorFieldGroup(field);
    if (group) groups[group].push(field);
  }

  return groups;
}

export interface EditorColorRoleDiscovery {
  field: ColorFieldKey;
  available: true;
  visibleInPreview: boolean;
  overridden: boolean;
}

export type CtaCoverageScope = 'primary' | 'secondary';
export type CtaCoverageState = 'surface' | 'content' | 'border' | 'hover' | 'focus';
export type CtaCoverageMode = 'editable' | 'derived';

export interface CtaStateCoverage {
  id: `${CtaCoverageScope}-${CtaCoverageState}`;
  scope: CtaCoverageScope;
  state: CtaCoverageState;
  label: string;
  mode: CtaCoverageMode;
  field?: ColorFieldKey;
  description: string;
}

const PRIMARY_CTA_COVERAGE: readonly CtaStateCoverage[] = [
  { id: 'primary-surface', scope: 'primary', state: 'surface', label: 'Fläche', mode: 'editable', field: 'btnBg', description: 'Die Primärfläche ist direkt editierbar.' },
  { id: 'primary-content', scope: 'primary', state: 'content', label: 'Text & Icons', mode: 'editable', field: 'btnText', description: 'Text und Icons sind direkt editierbar.' },
  { id: 'primary-border', scope: 'primary', state: 'border', label: 'Rahmen', mode: 'derived', description: 'Der Primärrahmen bleibt automatisch passend zur Buttonfläche.' },
  { id: 'primary-hover', scope: 'primary', state: 'hover', label: 'Hover', mode: 'derived', description: 'Der Hover-Effekt wird automatisch aus der Primärfläche berechnet.' },
  { id: 'primary-focus', scope: 'primary', state: 'focus', label: 'Tastaturfokus', mode: 'derived', description: 'Der Fokusrahmen wird automatisch kontrastreich aus der Akzentfarbe erzeugt.' },
];

const SECONDARY_CTA_FIELDS: Partial<Record<CtaCoverageState, ColorFieldKey>> = {
  surface: 'btnSecondaryBg',
  content: 'btnSecondaryText',
  border: 'btnSecondaryBorder',
};

const SECONDARY_CTA_LABELS: Record<CtaCoverageState, string> = {
  surface: 'Fläche',
  content: 'Text & Icons',
  border: 'Rahmen',
  hover: 'Hover',
  focus: 'Tastaturfokus',
};

/**
 * Complete CTA state map. A state is either backed by an editable renderer
 * token or explicitly documented as derived, so the editor never implies a
 * missing control is an undiscovered color.
 */
export function getCtaStateCoverage(fields: readonly ColorFieldKey[]): CtaStateCoverage[] {
  const supported = new Set(fields);
  const hasPrimary = supported.has('btnBg') || supported.has('btnText');
  const hasSecondary = Object.values(SECONDARY_CTA_FIELDS).some((field) => field && supported.has(field));
  const coverage: CtaStateCoverage[] = hasPrimary
    ? PRIMARY_CTA_COVERAGE.map((item) => ({ ...item }))
    : [];

  if (!hasSecondary) return coverage;
  for (const state of ['surface', 'content', 'border', 'hover', 'focus'] as const) {
    const field = SECONDARY_CTA_FIELDS[state];
    const editable = Boolean(field && supported.has(field));
    const automaticDescription = state === 'focus'
      ? 'Der Fokusrahmen wird automatisch kontrastreich aus der Akzentfarbe erzeugt.'
      : state === 'hover'
        ? 'Der Hover-Effekt wird automatisch aus der Sekundärfläche berechnet.'
        : `Die ${SECONDARY_CTA_LABELS[state]} wird automatisch aus dem aktiven Designrezept abgeleitet.`;
    coverage.push({
      id: `secondary-${state}`,
      scope: 'secondary',
      state,
      label: SECONDARY_CTA_LABELS[state],
      mode: editable ? 'editable' : 'derived',
      ...(editable && field ? { field } : {}),
      description: editable ? `${SECONDARY_CTA_LABELS[state]} ist direkt editierbar.` : automaticDescription,
    });
  }
  return coverage;
}

/** Merge optional runtime evidence into deterministic static role discovery. */
export function reconcileEditorColorRoles(
  fields: ColorFieldKey[],
  usedCssVars: ReadonlySet<string> | null,
  overrides: Readonly<Record<string, string>>,
): EditorColorRoleDiscovery[] {
  return sortColorFields(fields).flatMap((field) => {
    const definition = FIELD_DEFS[field];
    if (!definition) return [];
    return [{
      field,
      available: true as const,
      visibleInPreview: Boolean(usedCssVars?.has(definition.cssVar)),
      overridden: Boolean(overrides[definition.cssVar]?.trim()),
    }];
  });
}

export interface InheritedColorPresentation {
  displayValue: string;
  technicalValue: string;
  isDerived: boolean;
}

const DERIVED_COLOR_SOURCE_LABELS: readonly [pattern: RegExp, label: string][] = [
  [/\bcurrentColor\b/i, 'der Textfarbe'],
  [/--token-btn-secondary-(?:bg|text|border)\b/i, 'den Farben des sekundären Buttons'],
  [/--token-btn-(?:bg|text)\b/i, 'der primären Buttonfarbe'],
  [/--token-accent\b/i, 'der Akzentfarbe'],
  [/--token-(?:heading|subheading)\b/i, 'der Überschriftenfarbe'],
  [/--token-(?:body|muted)\b/i, 'der Textfarbe'],
  [/--token-card-(?:bg|heading|body|muted|border)\b/i, 'den Kartenfarben'],
  [/--token-section-bg(?:-alt)?\b/i, 'der Sektionsfläche'],
  [/--token-(?:icon|badge-bg|badge-text|badge-border)\b/i, 'der Akzentfarbe'],
];

/**
 * Keep CSS recipes available to technical users without making raw color-mix
 * syntax the primary value shown to non-technical customers.
 */
export function getInheritedColorPresentation(value: string | undefined): InheritedColorPresentation {
  const technicalValue = value?.trim() ?? '';
  const isDerived = /\bcolor-mix\s*\(/i.test(technicalValue);
  if (!isDerived) {
    return { displayValue: technicalValue, technicalValue, isDerived: false };
  }

  const sourceLabels = DERIVED_COLOR_SOURCE_LABELS
    .filter(([pattern]) => pattern.test(technicalValue))
    .map(([, label]) => label);
  const uniqueSources = [...new Set(sourceLabels)];
  const displayValue = uniqueSources.length === 1
    ? `Automatisch aus ${uniqueSources[0]} abgeleitet`
    : uniqueSources.length > 1
      ? 'Automatisch aus den aktiven Designfarben abgeleitet'
      : 'Automatisch aus dem aktiven Design abgeleitet';

  return { displayValue, technicalValue, isDerived: true };
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
