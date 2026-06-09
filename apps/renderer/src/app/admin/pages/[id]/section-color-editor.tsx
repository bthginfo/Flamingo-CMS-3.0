'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Palette, ChevronDown } from 'lucide-react';
import {
  SECTION_COLOR_CONTRACTS_GENERATED,
  SECTION_COLOR_CONTRACTS_GENERIC,
} from '@/lib/section-color-contracts-generated';

type ColorOverrides = Record<string, string>;

/* ─── Color helpers: rgba ⇆ hex parsing with alpha channel (Phase 4b) ─── */
function clamp01(n: number): number { return Math.max(0, Math.min(1, n)); }
function toHex2(n: number): string { return Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0'); }

export function parseColorWithAlpha(value: string | undefined): { hex: string; alpha: number | undefined } {
  if (!value) return { hex: '', alpha: undefined };
  const v = value.trim();
  // rgba(r,g,b,a) / rgb(r,g,b)
  const rgba = v.match(/^rgba?\(\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*(?:,\s*(-?\d+(?:\.\d+)?)\s*)?\)$/i);
  if (rgba) {
    const r = Number(rgba[1]); const g = Number(rgba[2]); const b = Number(rgba[3]);
    const a = rgba[4] !== undefined ? clamp01(Number(rgba[4])) : 1;
    return { hex: `#${toHex2(r)}${toHex2(g)}${toHex2(b)}`, alpha: a };
  }
  // #rgb / #rgba / #rrggbb / #rrggbbaa
  const hex = v.match(/^#([0-9a-f]{3,8})$/i);
  if (hex) {
    let h = hex[1];
    if (h.length === 3) h = h.split('').map((c) => c + c).join('');
    if (h.length === 4) h = h.split('').map((c) => c + c).join('');
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    const a = h.length >= 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1;
    return { hex: `#${h.slice(0, 6).toLowerCase()}`, alpha: a };
  }
  return { hex: '', alpha: undefined };
}

export function composeColorWithAlpha(hex: string, alpha: number | undefined): string {
  const a = alpha === undefined ? 1 : clamp01(alpha);
  const clean = hex.startsWith('#') ? hex.slice(1) : hex;
  if (clean.length !== 6) return hex;
  if (a >= 0.999) return `#${clean.toLowerCase()}`;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${Number(a.toFixed(3))})`;
}

const FIELD_RENDER_ORDER: ColorFieldKey[] = [
  'sectionBg',
  'sectionBgAlt',
  'cardBg',
  'headingColor',
  'subheadingColor',
  'bodyColor',
  'mutedColor',
  'iconColor',
  'accentColor',
  'btnBg',
  'btnText',
  'badgeBg',
  'badgeText',
  'badgeBorder',
  'borderColor',
  'dividerColor',
  'cardHeadingColor',
  'cardBodyColor',
  'cardMutedColor',
  'cardBadgeBg',
  'cardBadgeText',
  'cardIconColor',
  'imageOverlay',
  'onDarkHeading',
  'onDarkBody',
  'onDarkMuted',
  'eyebrow',
  'statValue',
  'quoteMark',
  'ratingStar',
  'check',
  'btnSecondaryBg',
  'btnSecondaryText',
  'btnSecondaryBorder',
  'linkColor',
  'linkHoverColor',
  'inputBg',
  'inputBorder',
  'inputText',
  'labelColor',
  'priceColor',
  'priceStrikeColor',
  'pageBg',
  'shadowColor',
  'successColor',
  'successBg',
  'dangerColor',
  'dangerBg',
  'cardRadius',
  'buttonRadius',
  'cardShadow',
  'headingWeight',
  'headingTracking',
];

function sortColorFields(fields: ColorFieldKey[]): ColorFieldKey[] {
  const rank = new Map(FIELD_RENDER_ORDER.map((field, index) => [field, index]));
  return [...fields].sort((left, right) => (rank.get(left) ?? 999) - (rank.get(right) ?? 999));
}

/* ─── All available color fields with categories ───
 *
 * Legacy field keys (textPrimary, textSecondary, brandPrimary, brandAccent,
 * colorPrimary, styleBrand, imageTextColor, cardBorderColor, cardBorder,
 * cardShadow, headingWeight, headingTracking, imageOverlay, btnSecondary*)
 * were removed in Phase 3. Stored overrides referencing those keys are
 * collapsed at load time via migrateLegacyOverrides() so existing tenant
 * data continues to render correctly.
 */
export type ColorFieldKey =
  | 'sectionBg' | 'sectionBgAlt' | 'cardBg'
  | 'headingColor' | 'subheadingColor' | 'bodyColor' | 'mutedColor'
  | 'iconColor' | 'accentColor'
  | 'eyebrow' | 'statValue' | 'quoteMark' | 'ratingStar' | 'check'
  | 'onDarkHeading' | 'onDarkBody' | 'onDarkMuted'
  | 'imageOverlay'
  | 'btnBg' | 'btnText'
  | 'badgeBg' | 'badgeText' | 'badgeBorder'
  | 'borderColor' | 'dividerColor'
  | 'cardRadius' | 'buttonRadius'
  | 'cardShadow' | 'headingWeight' | 'headingTracking'
  // Phase A: Card-level overrides (fallback to section-level token)
  | 'cardHeadingColor' | 'cardBodyColor' | 'cardMutedColor'
  | 'cardBadgeBg' | 'cardBadgeText' | 'cardIconColor'
  // Phase B: Specialized roles
  | 'btnSecondaryBg' | 'btnSecondaryText' | 'btnSecondaryBorder'
  | 'linkColor' | 'linkHoverColor'
  | 'inputBg' | 'inputBorder' | 'inputText' | 'labelColor'
  | 'priceColor' | 'priceStrikeColor'
  | 'pageBg' | 'shadowColor'
  | 'successColor' | 'successBg'
  | 'dangerColor' | 'dangerBg';

// Mapping of every legacy key the editor used to expose to its modern
// equivalent. Used by migrateLegacyOverrides() to clean up stored
// styleOverrides objects on load so the editor never shows orphaned values.
// Keys cover BOTH field-name aliases (textPrimary) AND legacy CSS var names
// (--style-text-primary, --brand-primary) because stored overrides use the
// CSS var form while contract slots use the field-name form.
export const LEGACY_FIELD_ALIASES: Record<string, ColorFieldKey | null> = {
  // Field-name aliases
  textPrimary:     'bodyColor',
  textSecondary:   'bodyColor',
  brandPrimary:    'accentColor',
  brandAccent:     'accentColor',
  colorPrimary:    'accentColor',
  styleBrand:      'accentColor',
  imageTextColor:  'onDarkHeading',
  cardBorderColor: 'borderColor',
  imageOverlay:    'imageOverlay',
  cardBorder:      null,
  cardShadow:      'cardShadow',
  headingWeight:   'headingWeight',
  headingTracking: 'headingTracking',
  btnSecondaryBg:  'btnSecondaryBg',
  btnSecondaryText:'btnSecondaryText',
};

// Legacy CSS-var name → modern CSS-var name (used at load time only).
const LEGACY_CSS_VAR_ALIASES: Record<string, string | null> = {
  '--style-text-primary':      '--token-body',
  '--style-text-secondary':    '--token-muted',
  '--style-heading-color':     '--token-heading',
  '--style-subheading-color':  '--token-subheading',
  '--style-body-color':        '--token-body',
  '--style-text-muted':        '--token-muted',
  '--style-section-bg':        '--token-section-bg',
  '--style-section-bg-alt':    '--token-section-bg-alt',
  '--style-card-bg':           '--token-card-bg',
  '--style-card-border':       '--token-card-border',
  '--style-border-color':      '--token-card-border',
  '--style-divider-color':     '--token-divider',
  '--style-icon-color':        '--token-icon',
  '--style-accent-color':      '--token-accent',
  '--style-badge-bg':          '--token-badge-bg',
  '--style-badge-text':        '--token-badge-text',
  '--style-badge-border':      '--token-badge-border',
  '--style-card-radius':       '--token-card-radius',
  '--style-button-radius':     '--token-button-radius',
  '--style-image-text-color':  '--token-on-dark-heading',
  '--brand-primary':           '--token-accent',
  '--brand-accent':            '--token-accent',
  '--brand-btn-secondary-bg':  null,
  '--brand-btn-secondary-text':null,
  '--style-card-border-color': '--token-card-border',
  '--style-image-overlay':     '--token-image-overlay',
  '--style-card-shadow':       '--token-card-shadow',
  '--style-heading-weight':    '--token-heading-weight',
  '--style-heading-tracking':  '--token-heading-tracking',
  '--style-brand':             '--token-accent',
  '--color-primary':           '--token-accent',
};

export function migrateLegacyOverrides<T extends Record<string, unknown>>(raw: T | null | undefined): T {
  if (!raw) return {} as T;
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(raw)) {
    // Skip empty values entirely.
    if (value == null || value === '') continue;
    // CSS-var form (e.g. "--style-text-primary")
    if (key.startsWith('--') && key in LEGACY_CSS_VAR_ALIASES) {
      const target = LEGACY_CSS_VAR_ALIASES[key];
      if (target && !(target in out)) out[target] = value;
      continue;
    }
    // Field-key alias form (rare — only contract slots use this shape).
    if (key in LEGACY_FIELD_ALIASES) {
      const fieldKey = LEGACY_FIELD_ALIASES[key];
      if (fieldKey) {
        const cssVar = FIELD_DEFS[fieldKey]?.cssVar;
        if (cssVar && !(cssVar in out)) out[cssVar] = value;
      }
      continue;
    }
    out[key] = value;
  }
  return out as T;
}

type FieldType = 'color' | 'size';
// 'core'     — always visible (the 6–12 obvious knobs every section needs)
// 'special'  — collapsed by default (eyebrow, ratings, quote glyphs, …)
// 'advanced' — collapsed by default (legacy/duplicate vars from --style-* and
//              --brand-* that overlap with --token-* and exist only for older
//              templates; surfaced for power users, hidden for normal use)
type FieldGroup = 'core' | 'special' | 'advanced';

export const FIELD_DEFS: Record<ColorFieldKey, { cssVar: string; label: string; description: string; type?: FieldType; group?: FieldGroup }> = {
  sectionBg:        { cssVar: '--token-section-bg',       label: 'Hintergrund',            description: 'Hintergrundfarbe der Sektion', group: 'core' },
  sectionBgAlt:     { cssVar: '--token-section-bg-alt',   label: 'Sekundärer Hintergrund', description: 'Nur für Sections mit einem zweiten sichtbaren Hintergrund-Layer', group: 'special' },
  cardBg:           { cssVar: '--token-card-bg',          label: 'Karten-Hintergrund',     description: 'Hintergrund von Karten/Containern', group: 'core' },
  headingColor:     { cssVar: '--token-heading',          label: 'Headline-Farbe',         description: 'Farbe der Hauptueberschrift (gilt fuer helle und dunkle Backgrounds)', group: 'core' },
  subheadingColor:  { cssVar: '--token-subheading',       label: 'Subheadline',            description: 'Farbe der Unterueberschrift', group: 'core' },
  bodyColor:        { cssVar: '--token-body',             label: 'Fliesstext-Farbe',       description: 'Farbe des Fliesstexts (gilt fuer helle und dunkle Backgrounds)', group: 'core' },
  mutedColor:       { cssVar: '--token-muted',            label: 'Dezenter Text',          description: 'Dezente Texte / Labels (gilt fuer helle und dunkle Backgrounds)', group: 'core' },
  iconColor:        { cssVar: '--token-icon',             label: 'Icons',                  description: 'Farbe der Icons', group: 'core' },
  accentColor:      { cssVar: '--token-accent',           label: 'Akzentfarbe',            description: 'Akzente, Linien, Hervorhebungen', group: 'core' },
  eyebrow:          { cssVar: '--token-eyebrow',          label: 'Eyebrow / Kicker',       description: 'Kleine Label-Texte über der Überschrift', group: 'special' },
  statValue:        { cssVar: '--token-stat-value',       label: 'Statistik-Wert',         description: 'Große Zahlenwerte (Stats, Metrics)', group: 'special' },
  quoteMark:        { cssVar: '--token-quote',            label: 'Anführungszeichen',      description: 'Anführungszeichen-Glyph in Testimonial-Karten', group: 'special' },
  ratingStar:       { cssVar: '--token-rating-star',      label: 'Rating-Sterne',          description: 'Sterne in Reviews / Bewertungen', group: 'special' },
  check:            { cssVar: '--token-check',            label: 'Checkmarks',             description: 'Häkchen in Feature-/Vergleichs-Listen', group: 'special' },
  onDarkHeading:    { cssVar: '--token-on-dark-heading',  label: 'Headline (auf Dunkel)',  description: 'Hauptueberschrift auf dunklem Hintergrund', group: 'core' },
  onDarkBody:       { cssVar: '--token-on-dark-body',     label: 'Fließtext (auf Dunkel)', description: 'Fließtext auf dunklem Hintergrund', group: 'core' },
  onDarkMuted:      { cssVar: '--token-on-dark-muted',    label: 'Dezent (auf Dunkel)',    description: 'Dezenter Text auf dunklem Hintergrund', group: 'core' },
  imageOverlay:     { cssVar: '--token-image-overlay',    label: 'Bild-Overlay',           description: 'Abdunklung / Farbfläche über Hintergrund-Bildern (Hero, Galerie)', group: 'special' },
  btnBg:            { cssVar: '--token-btn-bg',           label: 'Button Hintergrund',     description: 'CTA-Button Hintergrund', group: 'core' },
  btnText:          { cssVar: '--token-btn-text',         label: 'Button Text',            description: 'CTA-Button Textfarbe', group: 'core' },
  badgeBg:          { cssVar: '--token-badge-bg',         label: 'Badge/Eyebrow BG',       description: 'Badge/Eyebrow Hintergrund', group: 'core' },
  badgeText:        { cssVar: '--token-badge-text',       label: 'Badge/Eyebrow Text',     description: 'Badge/Eyebrow Textfarbe', group: 'core' },
  badgeBorder:      { cssVar: '--token-badge-border',     label: 'Badge/Eyebrow Rahmen',   description: 'Badge/Eyebrow Rahmenfarbe', group: 'special' },
  borderColor:      { cssVar: '--token-card-border',      label: 'Rahmenfarbe',            description: 'Rahmen/Border von Karten', group: 'core' },
  dividerColor:     { cssVar: '--token-divider',          label: 'Trennlinie',             description: 'Trennlinien zwischen Elementen', group: 'core' },
  cardRadius:       { cssVar: '--token-card-radius',      label: 'Karten-Radius',          description: 'Abrundung der Kartenecken', type: 'size' },
  buttonRadius:     { cssVar: '--token-button-radius',    label: 'Button-Radius',          description: 'Abrundung der Buttons', type: 'size' },
  cardShadow:       { cssVar: '--token-card-shadow',      label: 'Karten-Schatten',        description: 'box-shadow auf Karten (CSS-Wert, z.B. "0 8px 24px rgba(0,0,0,0.12)")', type: 'size', group: 'special' },
  headingWeight:    { cssVar: '--token-heading-weight',   label: 'Headline-Gewicht',       description: 'font-weight der Headlines (z.B. 400, 600, 800)', type: 'size', group: 'special' },
  headingTracking:  { cssVar: '--token-heading-tracking', label: 'Headline-Laufweite',     description: 'letter-spacing der Headlines (z.B. -0.02em)', type: 'size', group: 'special' },
  // Phase A – Karten-spezifische Overrides (fallen auf section-level zurück)
  cardHeadingColor:    { cssVar: '--token-card-heading',     label: 'Detail-Headline',        description: 'Überschriftenfarbe innerhalb von Karten/Detail-Elementen – getrennt von Main-Headline', group: 'core' },
  cardBodyColor:       { cssVar: '--token-card-body',        label: 'Detail-Fliesstext',      description: 'Fliesstext innerhalb von Karten/Detail-Elementen – getrennt vom Main-Fliesstext', group: 'core' },
  cardMutedColor:      { cssVar: '--token-card-muted',       label: 'Detail-Dezenttext',      description: 'Dezente Texte innerhalb von Karten/Detail-Elementen (Meta, Datum, Labels)', group: 'core' },
  cardBadgeBg:         { cssVar: '--token-card-badge-bg',    label: 'Karten-Badge BG',        description: 'Badge-Hintergrund auf Karten (z.B. Tags)', group: 'special' },
  cardBadgeText:       { cssVar: '--token-card-badge-text',  label: 'Karten-Badge Text',      description: 'Badge-Text auf Karten', group: 'special' },
  cardIconColor:       { cssVar: '--token-card-icon',        label: 'Karten-Icon',            description: 'Icon-Farbe innerhalb von Karten', group: 'special' },
  // Phase B – Spezialrollen
  btnSecondaryBg:      { cssVar: '--token-btn-secondary-bg',     label: 'Sekundär-Button BG',     description: 'Hintergrund von Sekundär-/Outline-Buttons', group: 'special' },
  btnSecondaryText:    { cssVar: '--token-btn-secondary-text',   label: 'Sekundär-Button Text',   description: 'Textfarbe Sekundär-/Outline-Button', group: 'special' },
  btnSecondaryBorder:  { cssVar: '--token-btn-secondary-border', label: 'Sekundär-Button Border', description: 'Randfarbe Sekundär-/Outline-Button', group: 'special' },
  linkColor:           { cssVar: '--token-link',                 label: 'Link-Farbe',             description: 'Inline-Links (rich text, Legal-Pages)', group: 'special' },
  linkHoverColor:      { cssVar: '--token-link-hover',           label: 'Link-Hover',             description: 'Inline-Link Hover-Farbe', group: 'special' },
  inputBg:             { cssVar: '--token-input-bg',             label: 'Input-Hintergrund',      description: 'Hintergrund von Formularfeldern', group: 'special' },
  inputBorder:         { cssVar: '--token-input-border',         label: 'Input-Border',           description: 'Randfarbe Formularfelder', group: 'special' },
  inputText:           { cssVar: '--token-input-text',           label: 'Input-Textfarbe',        description: 'Textfarbe in Formularfeldern', group: 'special' },
  labelColor:          { cssVar: '--token-label',                label: 'Label-Farbe',            description: 'Beschriftungen zu Formularfeldern', group: 'special' },
  priceColor:          { cssVar: '--token-price',                label: 'Preis-Farbe',            description: 'Preisangaben (Shop)', group: 'special' },
  priceStrikeColor:    { cssVar: '--token-price-strikethrough',  label: 'Preis-Streich',          description: 'Durchgestrichener Vergleichspreis', group: 'special' },
  pageBg:              { cssVar: '--token-page-bg',              label: 'Seiten-Hintergrund',     description: 'Hintergrund auf Seitenebene (z.B. Hero, Marquee)', group: 'special' },
  shadowColor:         { cssVar: '--token-shadow',               label: 'Schattenfarbe',          description: 'Box-Shadow-Farbe (z.B. Property-Showcase)', group: 'special' },
  successColor:        { cssVar: '--token-success',              label: 'Erfolg-Farbe',           description: 'Erfolgsmeldungen, Checkmarks (z.B. Checkout, Thank-You)', group: 'special' },
  successBg:           { cssVar: '--token-success-bg',           label: 'Erfolg-Hintergrund',     description: 'Hintergrund für Erfolgs-Hinweise', group: 'special' },
  dangerColor:         { cssVar: '--token-danger',               label: 'Warnung-Farbe',          description: 'Fehler/Sale/Lösch-Aktionen', group: 'special' },
  dangerBg:            { cssVar: '--token-danger-bg',            label: 'Warnung-Hintergrund',    description: 'Hintergrund für Sale-Badges / Warnhinweise', group: 'special' },
};

/* ─── SINGLE SOURCE OF TRUTH ─── */
// The editor reads ONLY the codegen output. The codegen scans each
// industry-specific template file for var(--token-*) references and
// reverse-maps them to ColorFieldKey via FIELD_DEFS. Regenerate with:
//   node scripts/generate-section-color-contracts.cjs
export function getFieldsForSection(sectionType: string, industry?: string): ColorFieldKey[] {
  const industryKey = industry
    ? `${sectionType}${industry.charAt(0).toUpperCase()}${industry.slice(1)}`
    : null;
  const industrySpecific = industryKey ? SECTION_COLOR_CONTRACTS_GENERATED[industryKey] : undefined;
  if (Array.isArray(industrySpecific) && industrySpecific.length > 0) {
    const fields = (industrySpecific as ColorFieldKey[]).filter((f) => f !== 'sectionBgAlt');
    // Always ensure sectionBg is available for background control
    if (!fields.includes('sectionBg')) fields.unshift('sectionBg');
    return fields;
  }
  const generic = SECTION_COLOR_CONTRACTS_GENERIC[sectionType];
  if (Array.isArray(generic) && generic.length > 0) {
    const fields = (generic as ColorFieldKey[]).filter((f) => f !== 'sectionBgAlt');
    // Always ensure sectionBg is available for background control
    if (!fields.includes('sectionBg')) fields.unshift('sectionBg');
    return fields;
  }
  // No codegen entry → minimal safe set. Re-run the generator to fix.
  return ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'accentColor'];
}


export function SectionColorEditor({ value, onChange, sectionType, industry, resolvedVars, iframeRef, sectionId }: { value: ColorOverrides | null; onChange: (overrides: ColorOverrides | null) => void; sectionType?: string; industry?: string; resolvedVars?: Record<string, string>; iframeRef?: React.RefObject<HTMLIFrameElement | null>; sectionId?: string }) {
  const probeRef = useRef<HTMLDivElement>(null);
  const overrides = migrateLegacyOverrides<ColorOverrides>(value);
  const rawFields = sectionType ? getFieldsForSection(sectionType, industry) : Object.keys(FIELD_DEFS) as ColorFieldKey[];
  // Only count overrides that are actually used by this section (filter out legacy/copied values)
  const relevantCSSVars = new Set(rawFields.map(f => FIELD_DEFS[f]?.cssVar).filter(Boolean));
  const activeCount = Object.entries(overrides).filter(([k, v]) => relevantCSSVars.has(k as string) && v).length;
  
  // Only auto-open if there are active color overrides
  const shouldDefaultOpen = activeCount > 0;
  
  const [open, setOpen] = useState(shouldDefaultOpen);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [computedVars, setComputedVars] = useState<Record<string, string>>({});
  // Collapse the "auf Dunkel" duplicates — a single Headline/Body/Muted picker
  // writes both --token-* and --token-on-dark-* via FIELD_FANOUT below.
  const HIDDEN_FIELDS = new Set<ColorFieldKey>(['onDarkHeading', 'onDarkBody', 'onDarkMuted']);
  const allFields = rawFields.filter((f) => !HIDDEN_FIELDS.has(f));
  
  // Split into color fields and design token fields
  const colorFields = sortColorFields(allFields.filter(f => FIELD_DEFS[f]?.type !== 'size'));
  const designFields = allFields.filter(f => FIELD_DEFS[f]?.type === 'size');
  // Split color fields by visibility group so the editor isn't overwhelming:
  //  - core:     always visible (the obvious 6–12 knobs)
  //  - special:  collapsed by default (eyebrow / stat / quote / rating / overlay…)
  //  - advanced: collapsed by default (legacy --style-* / --brand-* duplicates)
  const coreFields     = colorFields.filter(f => (FIELD_DEFS[f]?.group ?? 'core') === 'core');
  const specialFields  = colorFields.filter(f =>  FIELD_DEFS[f]?.group === 'special');
  const advancedFields = colorFields.filter(f =>  FIELD_DEFS[f]?.group === 'advanced');

  // All CSS vars we need to read (token-only after Phase 3 cleanup)
  const allVarKeys = allFields.map(f => FIELD_DEFS[f]?.cssVar).filter(Boolean);

  const readComputedStyles = useCallback(() => {
    const result: Record<string, string> = {};

    // Strategy 1: Read from preview iframe (100% accurate)
    if (iframeRef?.current && sectionId) {
      try {
        const doc = iframeRef.current.contentDocument;
        if (doc) {
          const el = doc.querySelector(`[data-section-id="${CSS.escape(sectionId)}"]`);
          if (el) {
            const styles = getComputedStyle(el);
            for (const v of allVarKeys) {
              const val = styles.getPropertyValue(v).trim();
              if (val) result[v] = val;
            }
            if (Object.keys(result).length > 0) { setComputedVars(result); return; }
          }
        }
      } catch { /* iframe not accessible */ }
    }

    // Strategy 2: Read from local probe element (works without preview)
    if (probeRef.current) {
      const styles = getComputedStyle(probeRef.current);
      for (const v of allVarKeys) {
        const val = styles.getPropertyValue(v).trim();
        if (val) result[v] = val;
      }
    }

    setComputedVars(result);
  }, [iframeRef, sectionId, allVarKeys]);

  useEffect(() => {
    if (open) {
      const t = setTimeout(readComputedStyles, 50);
      return () => clearTimeout(t);
    }
  }, [open, readComputedStyles]);

  // Comprehensive fallback chain for resolving display colors
  const getResolvedColor = (cssVar: string): string | undefined => {
    // 1. Computed from iframe/probe (100% accurate)
    if (computedVars[cssVar]) return computedVars[cssVar];
    // 2. From resolvedVars (style + brand combined)
    if (resolvedVars?.[cssVar]) return resolvedVars[cssVar];
    // 3. Fallback chain for vars that derive from others
    const fallbacks: Record<string, string[]> = {
      '--token-heading': ['--style-text-primary', '--brand-dark'],
      '--token-subheading': ['--style-text-secondary', '--style-text-primary'],
      '--token-body': ['--style-text-secondary', '--style-text-primary'],
      '--token-muted': ['--style-text-secondary'],
      '--token-icon': ['--brand-primary', '--style-accent-color', '--brand-accent'],
      '--style-accent-color': ['--brand-accent', '--brand-primary'],
      '--token-card-border': ['--style-card-border'],
      '--token-divider': ['--style-border-color', '--style-card-border'],
      '--token-btn-bg': ['--brand-accent', '--brand-primary'],
      '--token-btn-text': ['--brand-dark'],
      // --brand-btn-secondary-* intentionally no fallback: no shared template
      // reads these from another var, so showing a borrowed swatch is misleading.
      '--token-badge-bg': ['--brand-primary'],
      '--token-badge-text': ['--brand-primary'],
      '--token-badge-border': ['--brand-primary'],
      '--token-section-bg-alt': ['--style-section-bg'],
      // --style-card-bg intentionally no fallback to section-bg: they are
      // independent in every shared template; suggesting otherwise was confusing.
    };
    const chain = fallbacks[cssVar];
    if (chain) {
      for (const fb of chain) {
        const val = computedVars[fb] || resolvedVars?.[fb];
        if (val) return val;
      }
    }
    return undefined;
  };

  const handleChange = (key: string, color: string) => {
    // Phase 4c: pickers write exactly ONE var — no hidden cross-writes.
    // EXCEPTION (Phase 6 UX merge): the three text-colour fields also
    // write their --token-on-dark-* twin so the section always renders
    // with the chosen colour regardless of which slot the template uses.
    const FANOUT: Record<string, string[]> = {
      '--token-heading': ['--token-on-dark-heading'],
      '--token-body':    ['--token-on-dark-body'],
      '--token-muted':   ['--token-on-dark-muted'],
    };
    const extras = FANOUT[key] || [];
    const next: Record<string, string> = { ...overrides, [key]: color };
    for (const v of extras) next[v] = color;
    Object.keys(next).forEach(k => { if (!next[k]) delete next[k]; });
    onChange(Object.keys(next).length > 0 ? next : null);
  };

  const handleClear = (key: string) => {
    const FANOUT: Record<string, string[]> = {
      '--token-heading': ['--token-on-dark-heading'],
      '--token-body':    ['--token-on-dark-body'],
      '--token-muted':   ['--token-on-dark-muted'],
    };
    const next = { ...overrides };
    delete next[key];
    for (const v of FANOUT[key] || []) delete next[v];
    onChange(Object.keys(next).length > 0 ? next : null);
  };

  function renderColorField(fieldKey: ColorFieldKey) {
    const def = FIELD_DEFS[fieldKey];
    if (!def) return null;
    const currentOverride = overrides[def.cssVar] || '';
    const resolved = getResolvedColor(def.cssVar);
    const displayColor = currentOverride || resolved || '';
    const { hex, alpha } = parseColorWithAlpha(displayColor);
    const overrideAlpha = parseColorWithAlpha(currentOverride).alpha;
    return (
      <label key={fieldKey} className="block">
        <span className="text-gray-600 text-xs" title={def.description}>{def.label}</span>
        <div className="flex items-center gap-2 mt-1">
          <div className="relative">
            <input
              type="color"
              className="w-8 h-8 rounded border border-gray-200 cursor-pointer p-0"
              value={hex || '#000000'}
              onChange={(e) => handleChange(def.cssVar, composeColorWithAlpha(e.target.value, overrideAlpha ?? alpha))}
            />
            {!currentOverride && resolved && (
              <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border border-white" style={{ background: resolved }} title={`Aktuell: ${resolved}`} />
            )}
          </div>
          <div className="flex flex-1 flex-col gap-1">
            <input
              type="text"
              className="admin-input w-full text-xs font-mono"
              placeholder={resolved || '—'}
              value={currentOverride}
              onChange={(e) => handleChange(def.cssVar, e.target.value)}
            />
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={Math.round(((overrideAlpha ?? alpha) ?? 1) * 100)}
                onChange={(e) => {
                  const a = Number(e.target.value) / 100;
                  const base = hex || '#000000';
                  handleChange(def.cssVar, composeColorWithAlpha(base, a));
                }}
                className="flex-1 h-1 accent-[var(--brand-primary,#0ea5e9)]"
                title="Transparenz (Alpha)"
              />
              <span className="w-10 text-right text-[10px] font-mono text-zinc-500">{Math.round(((overrideAlpha ?? alpha) ?? 1) * 100)}%</span>
            </div>
          </div>
          {currentOverride && (
            <button type="button" className="text-xs text-red-400 hover:text-red-600" onClick={() => handleClear(def.cssVar)}>✕</button>
          )}
        </div>
      </label>
    );
  }

  function renderDesignField(fieldKey: ColorFieldKey) {
    const def = FIELD_DEFS[fieldKey];
    if (!def) return null;
    const currentOverride = overrides[def.cssVar] || '';
    const resolved = computedVars[def.cssVar] || resolvedVars?.[def.cssVar] || '';
    return (
      <label key={fieldKey} className="block">
        <span className="text-gray-600 text-xs" title={def.description}>{def.label}</span>
        <div className="flex items-center gap-2 mt-1">
          <input
            type="text"
            className="admin-input flex-1 text-xs font-mono"
            placeholder={resolved || '—'}
            value={currentOverride}
            onChange={(e) => handleChange(def.cssVar, e.target.value)}
          />
          {currentOverride && (
            <button type="button" className="text-xs text-red-400 hover:text-red-600" onClick={() => handleClear(def.cssVar)}>✕</button>
          )}
        </div>
      </label>
    );
  }

  return (
    <details className="mt-4 rounded-lg border border-blue-100 bg-blue-50/30 p-3" open={open} onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}>
      <summary className="text-xs font-semibold text-gray-700 cursor-pointer flex items-center gap-2 hover:text-gray-900 transition-colors">
        <Palette size={14} className="text-blue-600" /> 
        <span>Farben anpassen</span>
        {activeCount > 0 && <span className="ml-1 px-1.5 py-0.5 bg-blue-200 text-blue-800 rounded-full text-[10px] font-bold">{activeCount} Farben</span>}
      </summary>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-3 border-t border-blue-100">
        {coreFields.map(renderColorField)}
      </div>
      {specialFields.length > 0 && (
        <details className="mt-3 pt-3 border-t border-zinc-100">
          <summary className="text-xs font-medium text-zinc-600 cursor-pointer flex items-center gap-1 mb-2 hover:text-zinc-900 transition-colors">
            <ChevronDown size={12} /> Spezial-Felder ({specialFields.length})
          </summary>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
            {specialFields.map(renderColorField)}
          </div>
        </details>
      )}
      {advancedFields.length > 0 && (
        <details className="mt-3 pt-3 border-t border-zinc-100">
          <summary className="text-xs font-medium text-zinc-600 cursor-pointer flex items-center gap-1 mb-2 hover:text-zinc-900 transition-colors">
            <ChevronDown size={12} /> Erweitert – Legacy / Marken-Variablen ({advancedFields.length})
          </summary>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
            {advancedFields.map(renderColorField)}
          </div>
        </details>
      )}
      {designFields.length > 0 && (
        <div className="mt-3 pt-3 border-t border-zinc-100">
          <button type="button" className="text-xs font-medium text-zinc-600 flex items-center gap-1 mb-2 hover:text-zinc-900 transition-colors" onClick={() => setShowAdvanced(!showAdvanced)}>
            <ChevronDown size={12} className={`transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
            Design-Tokens (Radius, Schatten)
          </button>
          {showAdvanced && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {designFields.map(renderDesignField)}
            </div>
          )}
        </div>
      )}
      {activeCount > 0 && (
        <button type="button" className="mt-3 text-xs font-medium text-red-500 hover:text-red-700" onClick={() => onChange(null)}>
          ✕ Alle Farb-Overrides entfernen
        </button>
      )}
      {/* Hidden probe element to read computed CSS vars without needing the preview iframe */}
      {open && <div ref={probeRef} data-style="" style={resolvedVars as React.CSSProperties} className="hidden" aria-hidden="true" />}
    </details>
  );
}
