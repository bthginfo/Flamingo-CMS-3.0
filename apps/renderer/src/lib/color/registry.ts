/**
 * COLOR TOKEN REGISTRY — Single Source of Truth
 *
 * This is the ONLY place a color slot may be defined.
 * All other parts of the system (resolver, CMS editor, validator, templates)
 * derive their slot knowledge from this registry.
 *
 * Rules:
 * - One slot = one CSS var = one purpose. No aliases.
 * - If `inheritsFrom` is null, `default` is required.
 * - If `inheritsFrom` is set, default is optional (inherits at resolve-time).
 * - The CMS editor field list, validator, and template prop type are all
 *   derived from this object.
 */

export interface ColorTokenDef {
  cssVar: `--token-${string}`;
  label: string;
  description: string;
  inheritsFrom: string | null;
  default?: string;
}

export const COLOR_TOKENS = {
  // ─── Surface ───────────────────────────────────────────────────────────────
  sectionBg: {
    cssVar: '--token-section-bg',
    label: 'Hintergrund',
    description: 'Hintergrundfarbe der Sektion',
    inheritsFrom: null,
    default: 'transparent',
  },
  cardBg: {
    cssVar: '--token-card-bg',
    label: 'Karten-Hintergrund',
    description: 'Hintergrund von Karten/Containern',
    inheritsFrom: null,
    default: '#ffffff',
  },
  cardBorder: {
    cssVar: '--token-card-border',
    label: 'Rahmenfarbe',
    description: 'Rahmen/Border von Karten',
    inheritsFrom: null,
    default: 'rgba(15,23,42,0.08)',
  },

  // ─── Text ──────────────────────────────────────────────────────────────────
  heading: {
    cssVar: '--token-heading',
    label: 'Headline',
    description: 'Farbe der Hauptüberschrift',
    inheritsFrom: null,
    default: '#0f172a',
  },
  subheading: {
    cssVar: '--token-subheading',
    label: 'Subheadline',
    description: 'Farbe der Unterüberschrift',
    inheritsFrom: 'heading',
  },
  body: {
    cssVar: '--token-body',
    label: 'Fließtext',
    description: 'Farbe des Fließtexts',
    inheritsFrom: null,
    default: '#27272a',
  },
  muted: {
    cssVar: '--token-muted',
    label: 'Dezenter Text',
    description: 'Dezente Texte, Labels',
    inheritsFrom: null,
    default: '#71717a',
  },

  // ─── On-dark text (for dark surface contexts) ──────────────────────────────
  onDarkHeading: {
    cssVar: '--token-on-dark-heading',
    label: 'Headline (auf dunkel)',
    description: 'Überschrift auf dunklem Hintergrund',
    inheritsFrom: null,
    default: '#ffffff',
  },
  onDarkBody: {
    cssVar: '--token-on-dark-body',
    label: 'Text (auf dunkel)',
    description: 'Fließtext auf dunklem Hintergrund',
    inheritsFrom: null,
    default: 'rgba(255,255,255,0.85)',
  },

  // ─── Accent (split roles — these used to all collide on --style-accent-color)
  accent: {
    cssVar: '--token-accent',
    label: 'Akzentfarbe',
    description: 'Primärer Akzent (Basis für Eyebrow, Stats etc.)',
    inheritsFrom: null,
    default: '#f39c12',
  },
  eyebrow: {
    cssVar: '--token-eyebrow',
    label: 'Eyebrow / Kicker',
    description: 'Kleine Label-Texte über der Überschrift',
    inheritsFrom: 'accent',
  },
  icon: {
    cssVar: '--token-icon',
    label: 'Icons',
    description: 'Farbe der Icons (Phone, Mail, Lucide-Icons)',
    inheritsFrom: null,
    default: '#2563eb',
  },
  statValue: {
    cssVar: '--token-stat-value',
    label: 'Statistik-Wert',
    description: 'Große Zahlenwerte (Stats, Metrics)',
    inheritsFrom: 'accent',
  },
  quoteMark: {
    cssVar: '--token-quote',
    label: 'Anführungszeichen',
    description: 'Das " Glyph in Testimonial-Karten',
    inheritsFrom: 'accent',
  },
  ratingStar: {
    cssVar: '--token-rating-star',
    label: 'Rating-Sterne',
    description: 'Sterne in Reviews / Bewertungen',
    inheritsFrom: 'accent',
  },
  check: {
    cssVar: '--token-check',
    label: 'Checkmarks',
    description: 'Häkchen in Feature-/Vergleichs-Listen',
    inheritsFrom: 'accent',
  },

  // ─── Badge ─────────────────────────────────────────────────────────────────
  badgeBg: {
    cssVar: '--token-badge-bg',
    label: 'Badge Hintergrund',
    description: 'Badge/Label Hintergrund',
    inheritsFrom: null,
    default: 'rgba(0,0,0,0.06)',
  },
  badgeText: {
    cssVar: '--token-badge-text',
    label: 'Badge Text',
    description: 'Badge/Label Textfarbe',
    inheritsFrom: null,
    default: '#2563eb',
  },
  badgeBorder: {
    cssVar: '--token-badge-border',
    label: 'Badge Rahmen',
    description: 'Badge/Label Rahmenfarbe',
    inheritsFrom: null,
    default: 'transparent',
  },

  // ─── Button ────────────────────────────────────────────────────────────────
  btnBg: {
    cssVar: '--token-btn-bg',
    label: 'Button Hintergrund',
    description: 'CTA-Button Hintergrund',
    inheritsFrom: null,
    default: '#2563eb',
  },
  btnText: {
    cssVar: '--token-btn-text',
    label: 'Button Text',
    description: 'CTA-Button Textfarbe',
    inheritsFrom: null,
    default: '#ffffff',
  },
  btnSecondaryBg: {
    cssVar: '--token-btn-secondary-bg',
    label: 'Sekundär-Button Hintergrund',
    description: 'Sekundärer Button Hintergrund',
    inheritsFrom: null,
    default: '#f1f5f9',
  },
  btnSecondaryText: {
    cssVar: '--token-btn-secondary-text',
    label: 'Sekundär-Button Text',
    description: 'Sekundärer Button Textfarbe',
    inheritsFrom: null,
    default: '#0f172a',
  },

  // ─── Divider ───────────────────────────────────────────────────────────────
  divider: {
    cssVar: '--token-divider',
    label: 'Trennlinie',
    description: 'Trennlinien zwischen Elementen',
    inheritsFrom: null,
    default: 'rgba(0,0,0,0.08)',
  },
} as const satisfies Record<string, ColorTokenDef>;

/** All valid slot identifiers. */
export type ColorSlot = keyof typeof COLOR_TOKENS;

/** A fully-resolved appearance object — every slot has a concrete color value. */
export type Appearance = Readonly<Record<ColorSlot, string>>;

/** Brand-level palette — partial slot values derived from tenant brand config. */
export type BrandPalette = Partial<Record<ColorSlot, string | undefined>>;

/** Ordered list of all slot keys (stable iteration order). */
export const ALL_SLOTS = Object.keys(COLOR_TOKENS) as ColorSlot[];

/** Lookup CSS var → slot id. */
export const CSS_VAR_TO_SLOT: Record<string, ColorSlot> = Object.fromEntries(
  ALL_SLOTS.map(slot => [COLOR_TOKENS[slot].cssVar, slot]),
) as Record<string, ColorSlot>;
