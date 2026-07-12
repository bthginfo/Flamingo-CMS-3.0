// Canonical section color-field registry.
//
// This file is the single source of truth for every color/style control that
// can appear in a section editor, API style contract, and API write path.
// Templates reference CSS vars. The generator maps those vars back to these
// fields, so new sections only expose fields they actually render.

export type ColorFieldKey =
  | 'sectionBg' | 'sectionBgAlt' | 'cardBg'
  | 'headingColor' | 'subheadingColor' | 'bodyColor' | 'mutedColor'
  | 'iconColor' | 'accentColor'
  | 'glowColor'
  | 'eyebrow' | 'statValue' | 'quoteMark' | 'ratingStar' | 'check'
  | 'onDarkHeading' | 'onDarkBody' | 'onDarkMuted'
  | 'imageOverlay'
  | 'btnBg' | 'btnText'
  | 'badgeBg' | 'badgeText' | 'badgeBorder'
  | 'borderColor' | 'dividerColor'
  | 'cardRadius' | 'buttonRadius'
  | 'cardShadow' | 'headingWeight' | 'headingTracking'
  | 'cardHeadingColor' | 'cardBodyColor' | 'cardMutedColor'
  | 'cardBadgeBg' | 'cardBadgeText' | 'cardIconColor'
  | 'btnSecondaryBg' | 'btnSecondaryText' | 'btnSecondaryBorder'
  | 'linkColor' | 'linkHoverColor'
  | 'inputBg' | 'inputBorder' | 'inputText' | 'labelColor'
  | 'priceColor' | 'priceStrikeColor'
  | 'pageBg' | 'shadowColor'
  | 'successColor' | 'successBg'
  | 'dangerColor' | 'dangerBg';

export type FieldType = 'color' | 'size';
export type FieldGroup = 'core' | 'special' | 'advanced';

export const FIELD_RENDER_ORDER: ColorFieldKey[] = [
  'sectionBg',
  'sectionBgAlt',
  'cardBg',
  'headingColor',
  'subheadingColor',
  'bodyColor',
  'mutedColor',
  'iconColor',
  'accentColor',
  'glowColor',
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

const INTERNAL_COLOR_FIELD_ALIASES: Partial<Record<ColorFieldKey, ColorFieldKey>> = {
  onDarkHeading: 'headingColor',
  onDarkBody: 'bodyColor',
  onDarkMuted: 'mutedColor',
};

const FIELD_WRITE_ALIASES: Partial<Record<ColorFieldKey, string[]>> = {
  sectionBg: ['--style-section-bg'],
  sectionBgAlt: ['--style-section-bg-alt'],
  cardBg: ['--style-card-bg'],
  headingColor: [
    '--style-heading-color',
    '--style-text-primary',
    '--token-on-dark-heading',
  ],
  subheadingColor: ['--style-subheading-color'],
  bodyColor: [
    '--style-body-color',
    '--style-text-secondary',
    '--token-on-dark-body',
  ],
  mutedColor: [
    '--style-text-muted',
    '--token-on-dark-muted',
  ],
  iconColor: ['--style-icon-color'],
  accentColor: ['--style-accent-color', '--style-accent'],
  btnBg: ['--style-button-bg', '--brand-btn-bg'],
  btnText: ['--style-button-text', '--brand-btn-text'],
  btnSecondaryBg: ['--brand-btn-secondary-bg'],
  btnSecondaryText: ['--brand-btn-secondary-text'],
  btnSecondaryBorder: ['--brand-btn-secondary-border'],
  badgeBg: ['--style-badge-bg'],
  badgeText: ['--style-badge-text'],
  badgeBorder: ['--style-badge-border'],
  borderColor: ['--style-border-color', '--style-border'],
  dividerColor: ['--style-divider-color'],
  cardRadius: ['--style-card-radius'],
  buttonRadius: ['--style-button-radius'],
  cardShadow: ['--style-card-shadow'],
  headingWeight: ['--style-heading-weight'],
  headingTracking: ['--style-heading-tracking'],
};

export const INTERNAL_COLOR_FIELD_KEYS = new Set<ColorFieldKey>(
  Object.keys(INTERNAL_COLOR_FIELD_ALIASES) as ColorFieldKey[],
);

export function canonicalColorField(field: ColorFieldKey): ColorFieldKey {
  return INTERNAL_COLOR_FIELD_ALIASES[field] || field;
}

export function isPublicColorField(field: ColorFieldKey): boolean {
  return canonicalColorField(field) === field && !INTERNAL_COLOR_FIELD_KEYS.has(field);
}

export function sortColorFields(fields: ColorFieldKey[]): ColorFieldKey[] {
  const rank = new Map(FIELD_RENDER_ORDER.map((field, index) => [field, index]));
  return Array.from(new Set(fields.map(canonicalColorField).filter(isPublicColorField)))
    .sort((left, right) => (rank.get(left) ?? 999) - (rank.get(right) ?? 999));
}

export const FIELD_DEFS: Record<ColorFieldKey, { cssVar: string; label: string; description: string; type?: FieldType; group?: FieldGroup }> = {
  sectionBg:        { cssVar: '--token-section-bg',       label: 'Hintergrund',            description: 'Hintergrundfarbe der Sektion', group: 'core' },
  sectionBgAlt:     { cssVar: '--token-section-bg-alt',   label: 'Sekundärer Hintergrund', description: 'Nur für Sections mit einem zweiten sichtbaren Hintergrund-Layer', group: 'special' },
  cardBg:           { cssVar: '--token-card-bg',          label: 'Karten-Hintergrund',     description: 'Hintergrund von Karten/Containern', group: 'core' },
  headingColor:     { cssVar: '--token-heading',          label: 'Headline-Farbe',         description: 'Farbe der Hauptüberschrift', group: 'core' },
  subheadingColor:  { cssVar: '--token-subheading',       label: 'Subheadline',            description: 'Farbe der Unterüberschrift', group: 'core' },
  bodyColor:        { cssVar: '--token-body',             label: 'Fließtext-Farbe',        description: 'Farbe des Fließtexts', group: 'core' },
  mutedColor:       { cssVar: '--token-muted',            label: 'Dezenter Text',          description: 'Dezente Texte / Labels', group: 'core' },
  iconColor:        { cssVar: '--token-icon',             label: 'Icons',                  description: 'Farbe der Icons', group: 'core' },
  accentColor:      { cssVar: '--token-accent',           label: 'Akzentfarbe',            description: 'Akzente, Linien, Hervorhebungen', group: 'core' },
  glowColor:        { cssVar: '--token-glow-color',       label: 'Glow / Hintergrundschein', description: 'Farbiger Schein hinter Hero- oder Premium-Inhalten', group: 'special' },
  eyebrow:          { cssVar: '--token-eyebrow',          label: 'Eyebrow / Kicker',       description: 'Kleine Label-Texte über der Überschrift', group: 'special' },
  statValue:        { cssVar: '--token-stat-value',       label: 'Statistik-Wert',         description: 'Große Zahlenwerte (Stats, Metrics)', group: 'special' },
  quoteMark:        { cssVar: '--token-quote',            label: 'Anführungszeichen',      description: 'Anführungszeichen-Glyph in Testimonial-Karten', group: 'special' },
  ratingStar:       { cssVar: '--token-rating-star',      label: 'Rating-Sterne',          description: 'Sterne in Reviews / Bewertungen', group: 'special' },
  check:            { cssVar: '--token-check',            label: 'Checkmarks',             description: 'Häkchen in Feature-/Vergleichs-Listen', group: 'special' },
  onDarkHeading:    { cssVar: '--token-on-dark-heading',  label: 'Interner Headline-Alias',  description: 'Interner Legacy-Alias. Öffentlich über Headline-Farbe gesteuert.', group: 'advanced' },
  onDarkBody:       { cssVar: '--token-on-dark-body',     label: 'Interner Fließtext-Alias', description: 'Interner Legacy-Alias. Öffentlich über Fließtext-Farbe gesteuert.', group: 'advanced' },
  onDarkMuted:      { cssVar: '--token-on-dark-muted',    label: 'Interner Dezenttext-Alias', description: 'Interner Legacy-Alias. Öffentlich über Dezenter Text gesteuert.', group: 'advanced' },
  imageOverlay:     { cssVar: '--token-image-overlay',    label: 'Bild-Overlay',           description: 'Abdunklung / Farbfläche über Hintergrund-Bildern', group: 'special' },
  btnBg:            { cssVar: '--token-btn-bg',           label: 'Primär-Button Hintergrund', description: 'Hintergrund der wichtigsten Handlungsaufforderung', group: 'core' },
  btnText:          { cssVar: '--token-btn-text',         label: 'Primär-Button Text & Icons', description: 'Text- und Iconfarbe der wichtigsten Handlungsaufforderung', group: 'core' },
  badgeBg:          { cssVar: '--token-badge-bg',         label: 'Badge/Eyebrow BG',       description: 'Badge/Eyebrow Hintergrund', group: 'core' },
  badgeText:        { cssVar: '--token-badge-text',       label: 'Badge/Eyebrow Text',     description: 'Badge/Eyebrow Textfarbe', group: 'core' },
  badgeBorder:      { cssVar: '--token-badge-border',     label: 'Badge/Eyebrow Rahmen',   description: 'Badge/Eyebrow Rahmenfarbe', group: 'special' },
  borderColor:      { cssVar: '--token-card-border',      label: 'Rahmenfarbe',            description: 'Rahmen/Border von Karten', group: 'core' },
  dividerColor:     { cssVar: '--token-divider',          label: 'Trennlinie',             description: 'Trennlinien zwischen Elementen', group: 'core' },
  cardRadius:       { cssVar: '--token-card-radius',      label: 'Karten-Radius',          description: 'Abrundung der Kartenecken', type: 'size' },
  buttonRadius:     { cssVar: '--token-button-radius',    label: 'Button-Radius',          description: 'Abrundung der Buttons', type: 'size' },
  cardShadow:       { cssVar: '--token-card-shadow',      label: 'Karten-Schatten',        description: 'box-shadow auf Karten', type: 'size', group: 'special' },
  headingWeight:    { cssVar: '--token-heading-weight',   label: 'Headline-Gewicht',       description: 'font-weight der Headlines', type: 'size', group: 'special' },
  headingTracking:  { cssVar: '--token-heading-tracking', label: 'Headline-Laufweite',     description: 'letter-spacing der Headlines', type: 'size', group: 'special' },
  cardHeadingColor:    { cssVar: '--token-card-heading',     label: 'Detail-Headline',        description: 'Überschriftenfarbe innerhalb von Karten/Detail-Elementen', group: 'core' },
  cardBodyColor:       { cssVar: '--token-card-body',        label: 'Detail-Fließtext',       description: 'Fließtext innerhalb von Karten/Detail-Elementen', group: 'core' },
  cardMutedColor:      { cssVar: '--token-card-muted',       label: 'Detail-Dezenttext',      description: 'Dezente Texte innerhalb von Karten/Detail-Elementen', group: 'core' },
  cardBadgeBg:         { cssVar: '--token-card-badge-bg',    label: 'Karten-Badge BG',        description: 'Badge-Hintergrund auf Karten', group: 'special' },
  cardBadgeText:       { cssVar: '--token-card-badge-text',  label: 'Karten-Badge Text',      description: 'Badge-Text auf Karten', group: 'special' },
  cardIconColor:       { cssVar: '--token-card-icon',        label: 'Karten-Icon',            description: 'Icon-Farbe innerhalb von Karten', group: 'special' },
  btnSecondaryBg:      { cssVar: '--token-btn-secondary-bg',     label: 'Sekundär-Button Hintergrund', description: 'Hintergrund von ergänzenden oder Outline-Buttons', group: 'special' },
  btnSecondaryText:    { cssVar: '--token-btn-secondary-text',   label: 'Sekundär-Button Text & Icons', description: 'Text- und Iconfarbe ergänzender Buttons', group: 'special' },
  btnSecondaryBorder:  { cssVar: '--token-btn-secondary-border', label: 'Sekundär-Button Rahmen', description: 'Rahmenfarbe ergänzender oder Outline-Buttons', group: 'special' },
  linkColor:           { cssVar: '--token-link',                 label: 'Link-Farbe',             description: 'Textlinks innerhalb der Section', group: 'special' },
  linkHoverColor:      { cssVar: '--token-link-hover',           label: 'Link bei Hover & Fokus', description: 'Linkfarbe beim Darüberfahren oder Tastaturfokus', group: 'special' },
  inputBg:             { cssVar: '--token-input-bg',             label: 'Input-Hintergrund',      description: 'Hintergrund von Formularfeldern', group: 'special' },
  inputBorder:         { cssVar: '--token-input-border',         label: 'Input-Border',           description: 'Randfarbe Formularfelder', group: 'special' },
  inputText:           { cssVar: '--token-input-text',           label: 'Input-Textfarbe',        description: 'Textfarbe in Formularfeldern', group: 'special' },
  labelColor:          { cssVar: '--token-label',                label: 'Label-Farbe',            description: 'Beschriftungen zu Formularfeldern', group: 'special' },
  priceColor:          { cssVar: '--token-price',                label: 'Preis-Farbe',            description: 'Preisangaben', group: 'special' },
  priceStrikeColor:    { cssVar: '--token-price-strikethrough',  label: 'Preis-Streich',          description: 'Durchgestrichener Vergleichspreis', group: 'special' },
  pageBg:              { cssVar: '--token-page-bg',              label: 'Seiten-Hintergrund',     description: 'Hintergrund auf Seitenebene', group: 'special' },
  shadowColor:         { cssVar: '--token-shadow',               label: 'Schattenfarbe',          description: 'Box-Shadow-Farbe', group: 'special' },
  successColor:        { cssVar: '--token-success',              label: 'Erfolg-Farbe',           description: 'Erfolgsmeldungen, Checkmarks', group: 'special' },
  successBg:           { cssVar: '--token-success-bg',           label: 'Erfolg-Hintergrund',     description: 'Hintergrund für Erfolgs-Hinweise', group: 'special' },
  dangerColor:         { cssVar: '--token-danger',               label: 'Warnung-Farbe',          description: 'Fehler/Sale/Lösch-Aktionen', group: 'special' },
  dangerBg:            { cssVar: '--token-danger-bg',            label: 'Warnung-Hintergrund',    description: 'Hintergrund für Sale-Badges / Warnhinweise', group: 'special' },
};

export const COLOR_FIELD_KEYS = Object.keys(FIELD_DEFS) as ColorFieldKey[];
export const PUBLIC_COLOR_FIELD_KEYS = COLOR_FIELD_KEYS.filter(isPublicColorField);
export const COLOR_FIELD_CSS_VARS = new Set(COLOR_FIELD_KEYS.map((key) => FIELD_DEFS[key].cssVar));
export const PUBLIC_COLOR_FIELD_CSS_VARS = new Set(PUBLIC_COLOR_FIELD_KEYS.map((key) => FIELD_DEFS[key].cssVar));
export const COLOR_FIELD_BY_CSS_VAR = Object.fromEntries(
  COLOR_FIELD_KEYS.map((key) => [FIELD_DEFS[key].cssVar, key]),
) as Record<string, ColorFieldKey>;

export function canonicalColorFieldForCssVar(cssVar: string): ColorFieldKey | null {
  const field = COLOR_FIELD_BY_CSS_VAR[cssVar];
  return field ? canonicalColorField(field) : null;
}

export function getCssVarsForColorField(field: ColorFieldKey): string[] {
  const canonical = canonicalColorField(field);
  const primary = FIELD_DEFS[canonical]?.cssVar;
  if (!primary) return [];
  return [primary, ...(FIELD_WRITE_ALIASES[canonical] || [])];
}

