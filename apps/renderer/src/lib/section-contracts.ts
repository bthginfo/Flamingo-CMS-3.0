import { getSectionTypesForIndustry } from '../app/admin/pages/[id]/section-types';
import { SECTION_EDITOR_FIELD_DEFAULTS } from './section-editor-field-defaults';
import { SECTION_PREVIEW_DATA } from './section-preview-data';
import type { ColorFieldKey } from '../app/admin/pages/[id]/section-color-editor';
import { SECTION_COLOR_CONTRACTS_GENERATED, SECTION_COLOR_CONTRACTS_GENERIC } from './section-color-contracts-generated';

export type SectionFieldType =
  | 'text'
  | 'richText'
  | 'textarea'
  | 'image'
  | 'cta'
  | 'number'
  | 'boolean'
  | 'select'
  | 'list'
  | 'object';

export type SectionFieldContract = {
  key: string;
  label: string;
  type: SectionFieldType;
  required?: boolean;
  itemFields?: SectionFieldContract[];
  options?: string[];
  supportsFocalPoint?: boolean;
};

export type SectionColorSlot =
  | 'sectionBg'
  | 'sectionBgAlt'
  | 'cardBg'
  | 'headingColor'
  | 'subheadingColor'
  | 'bodyColor'
  | 'mutedColor'
  | 'textPrimary'
  | 'textSecondary'
  | 'imageTextColor'
  | 'accentColor'
  | 'iconColor'
  | 'btnBg'
  | 'btnText'
  | 'btnSecondaryBg'
  | 'btnSecondaryText'
  | 'badgeBg'
  | 'badgeText'
  | 'badgeBorder'
  | 'borderColor'
  | 'dividerColor'
  | 'overlayColor';

export type SectionContract = {
  type: string;
  label: string;
  category: 'shared' | 'premium' | 'industry' | 'shop' | 'system';
  industry?: string;
  wrapper?: 'contained' | 'fullBleed';
  defaultTheme?: 'light' | 'dark' | 'auto';
  fields: SectionFieldContract[];
  colorSlots: SectionColorSlot[];
  previewData: Record<string, unknown>;
  maturity?: 'formal';
  source?: 'curated' | 'registry';
};

export const PILOT_SECTION_CONTRACTS: SectionContract[] = [
  {
    type: 'hero',
    label: 'Hero',
    category: 'shared',
    wrapper: 'fullBleed',
    defaultTheme: 'dark',
    fields: [
      { key: 'headline', label: 'Headline', type: 'text', required: true },
      { key: 'subline', label: 'Subline', type: 'richText' },
      { key: 'bgImage', label: 'Hintergrundbild', type: 'image', supportsFocalPoint: true },
      { key: 'primaryCta', label: 'Primärer Button', type: 'cta' },
      { key: 'secondaryCta', label: 'Sekundärer Button', type: 'cta' },
      { key: 'trustItems', label: 'Trust-Leiste', type: 'list', itemFields: [{ key: 'text', label: 'Text', type: 'text' }] },
    ],
    colorSlots: ['headingColor', 'bodyColor', 'btnBg', 'btnText', 'badgeBg', 'badgeText', 'overlayColor'],
    previewData: {
      headline: 'Starker Einstieg für eine starke Website',
      subline: 'Ein Hero, der Bild, Aussage und klare Handlung verbindet.',
      primaryCta: { label: 'Anfragen', href: '/kontakt' },
    },
    maturity: 'formal',
  },
  {
    type: 'cinematicHero',
    label: 'Cinematic Hero',
    category: 'premium',
    wrapper: 'fullBleed',
    defaultTheme: 'dark',
    fields: [
      { key: 'eyebrow', label: 'Eyebrow', type: 'text' },
      { key: 'headline', label: 'Headline', type: 'text', required: true },
      { key: 'subline', label: 'Subline', type: 'richText' },
      { key: 'image', label: 'Bild', type: 'image', supportsFocalPoint: true },
      { key: 'primaryCta', label: 'Primärer Button', type: 'cta' },
      { key: 'secondaryCta', label: 'Sekundärer Button', type: 'cta' },
      { key: 'facts', label: 'Fakten', type: 'list', itemFields: [{ key: 'value', label: 'Wert', type: 'text' }, { key: 'label', label: 'Label', type: 'text' }] },
    ],
    colorSlots: ['headingColor', 'bodyColor', 'accentColor', 'btnBg', 'btnText', 'overlayColor'],
    previewData: {
      eyebrow: 'Premium Section',
      headline: 'Cinematic Hero mit klarer Dramaturgie',
      subline: 'Für Seiten, die direkt hochwertig wirken sollen.',
    },
    maturity: 'formal',
  },
  {
    type: 'popup',
    label: 'Popup',
    category: 'shared',
    wrapper: 'contained',
    defaultTheme: 'auto',
    fields: [
      { key: 'title', label: 'Titel', type: 'text', required: true },
      { key: 'subtitle', label: 'Subtitle', type: 'text' },
      { key: 'text', label: 'Text', type: 'richText' },
      { key: 'delayMs', label: 'Verzögerung in ms', type: 'number' },
      { key: 'frequency', label: 'Anzeigehäufigkeit', type: 'select', options: ['once', 'session', 'always'] },
      { key: 'primaryCta', label: 'Primärer Button', type: 'cta' },
      { key: 'secondaryCta', label: 'Sekundärer Button', type: 'cta' },
    ],
    colorSlots: ['cardBg', 'headingColor', 'bodyColor', 'btnBg', 'btnText', 'borderColor', 'overlayColor'],
    previewData: {
      title: 'Kurzer Hinweis',
      text: 'Ein optionales Popup für Aktionen, Hinweise oder Beratung.',
      delayMs: 1200,
      frequency: 'session',
    },
    maturity: 'formal',
  },
];

export function getPilotSectionContract(type: string) {
  return PILOT_SECTION_CONTRACTS.find((contract) => contract.type === type) || null;
}

const CONTRACT_INDUSTRIES = [
  'tradesman',
  'restaurant',
  'salon',
  'hotel',
  'tourism',
  'medical',
  'wedding',
  'photography',
  'consulting',
  'realestate',
  'cafe',
  'tattoo',
  'ecommerce',
  'retail',
  'florist',
  'fitness',
  'location',
] as const;

const PREMIUM_TYPES = new Set([
  'cinematicHero',
  'spotlightCards',
  'scrollStory',
  'premiumComparison',
  'immersiveCtaBanner',
  'proofWall',
  'editorialFeatureRail',
  'offerCampaignStrip',
  'beforeAfterStoryPro',
  'signatureGrid',
  'comparisonCardsPro',
  'templateAdvantage',
  'principlesGrid',
  'glowHero',
]);

const SHOP_TYPES = new Set([
  'shopProductGrid',
  'shopProductDetail',
  'shopCart',
  'shopCheckout',
  'shopThankYou',
  'shopFeaturedProducts',
  'shopCategoryOverview',
]);

export const SECTION_COLOR_SLOT_DEFINITIONS: Record<SectionColorSlot, { cssVar: string; label: string; description: string; contrastWith?: SectionColorSlot[] }> = {
  sectionBg: { cssVar: '--style-section-bg', label: 'Section-Hintergrund', description: 'Hintergrundfarbe der gesamten Section', contrastWith: ['headingColor', 'bodyColor', 'textPrimary', 'textSecondary'] },
  sectionBgAlt: { cssVar: '--style-section-bg-alt', label: 'Alternativer Hintergrund', description: 'Zweiter Section-Hintergrund, z. B. für geteilte Layouts', contrastWith: ['headingColor', 'bodyColor', 'textPrimary', 'textSecondary'] },
  cardBg: { cssVar: '--style-card-bg', label: 'Karten-Hintergrund', description: 'Hintergrund von Cards, Boxen und Formularflächen', contrastWith: ['headingColor', 'bodyColor', 'textPrimary', 'textSecondary'] },
  headingColor: { cssVar: '--style-heading-color', label: 'Headline', description: 'Farbe für H1-H6 innerhalb der Section', contrastWith: ['sectionBg', 'sectionBgAlt', 'cardBg'] },
  subheadingColor: { cssVar: '--style-subheading-color', label: 'Subheadline', description: 'Farbe für Unterzeilen und Lead-Texte', contrastWith: ['sectionBg', 'sectionBgAlt', 'cardBg'] },
  bodyColor: { cssVar: '--style-body-color', label: 'Fließtext', description: 'Farbe für normale Texte, Beschreibungen und Listen', contrastWith: ['sectionBg', 'sectionBgAlt', 'cardBg'] },
  mutedColor: { cssVar: '--style-text-muted', label: 'Dezenter Text', description: 'Farbe für Meta-Labels, kleine Hinweise und Nebeninformationen', contrastWith: ['sectionBg', 'sectionBgAlt', 'cardBg'] },
  textPrimary: { cssVar: '--style-text-primary', label: 'Primärer Text', description: 'Allgemeine primäre Textfarbe innerhalb der Section', contrastWith: ['sectionBg', 'sectionBgAlt', 'cardBg'] },
  textSecondary: { cssVar: '--style-text-secondary', label: 'Sekundärer Text', description: 'Allgemeine sekundäre Textfarbe innerhalb der Section', contrastWith: ['sectionBg', 'sectionBgAlt', 'cardBg'] },
  imageTextColor: { cssVar: '--style-image-text-color', label: 'Bild-/Overlay-Text', description: 'Textfarbe direkt auf Bildern, Overlays und dunklen Medienflächen', contrastWith: ['overlayColor'] },
  accentColor: { cssVar: '--style-accent-color', label: 'Akzentfarbe', description: 'Akzente, Links, Highlights, aktive Zustände und kleine Marker' },
  iconColor: { cssVar: '--style-icon-color', label: 'Icons', description: 'Farbe für Icons und Symbolflächen' },
  btnBg: { cssVar: '--brand-btn-bg', label: 'Button-Hintergrund', description: 'Hintergrund des primären CTA-Buttons', contrastWith: ['btnText'] },
  btnText: { cssVar: '--brand-btn-text', label: 'Button-Text', description: 'Textfarbe des primären CTA-Buttons', contrastWith: ['btnBg'] },
  btnSecondaryBg: { cssVar: '--brand-btn-secondary-bg', label: 'Sekundär-Button-Hintergrund', description: 'Hintergrund des sekundären CTA-Buttons', contrastWith: ['btnSecondaryText'] },
  btnSecondaryText: { cssVar: '--brand-btn-secondary-text', label: 'Sekundär-Button-Text', description: 'Textfarbe des sekundären CTA-Buttons', contrastWith: ['btnSecondaryBg'] },
  badgeBg: { cssVar: '--style-badge-bg', label: 'Badge-Hintergrund', description: 'Hintergrund von Badges, Eyebrows und kleinen Labels', contrastWith: ['badgeText'] },
  badgeText: { cssVar: '--style-badge-text', label: 'Badge-Text', description: 'Textfarbe von Badges, Eyebrows und kleinen Labels', contrastWith: ['badgeBg'] },
  badgeBorder: { cssVar: '--style-badge-border', label: 'Badge-Rahmen', description: 'Rahmenfarbe von Badges und Eyebrows' },
  borderColor: { cssVar: '--style-border-color', label: 'Rahmenfarbe', description: 'Rahmenfarbe von Cards, Boxen, Formularen und Trennern' },
  dividerColor: { cssVar: '--style-divider-color', label: 'Trennlinien', description: 'Linien zwischen Listeneinträgen oder Layoutbereichen' },
  overlayColor: { cssVar: '--style-overlay-color', label: 'Overlay', description: 'Overlay-Farbe auf Bildern. Bei Bild-Heroes immer so wählen, dass Text lesbar bleibt.', contrastWith: ['headingColor', 'bodyColor', 'imageTextColor'] },
};

export const SECTION_COLOR_SLOT_ALIASES: Record<SectionColorSlot, string[]> = {
  sectionBg: ['--style-section-bg', '--token-section-bg', '--style-section-bg-alt', '--token-section-bg-alt'],
  sectionBgAlt: ['--style-section-bg-alt', '--token-section-bg-alt', '--style-section-bg', '--token-section-bg'],
  cardBg: ['--style-card-bg', '--token-card-bg'],
  headingColor: ['--style-heading-color', '--style-heading', '--style-text-primary', '--token-heading'],
  subheadingColor: ['--style-subheading-color', '--token-subheading'],
  bodyColor: ['--style-body-color', '--style-body', '--style-text-secondary', '--token-body'],
  mutedColor: ['--style-text-muted', '--style-muted', '--token-muted'],
  textPrimary: ['--style-text-primary', '--style-heading-color', '--style-heading', '--token-heading', '--brand-dark'],
  textSecondary: ['--style-text-secondary', '--style-body-color', '--style-body', '--token-body', '--brand-secondary'],
  imageTextColor: ['--style-image-text-color', '--token-on-dark-heading', '--token-on-dark-body', '--token-on-dark-muted'],
  accentColor: ['--style-accent-color', '--style-accent', '--style-brand', '--brand-accent', '--brand-accent-15', '--brand-primary', '--color-primary', '--token-eyebrow', '--token-stat-value', '--token-quote', '--token-rating-star', '--token-check'],
  iconColor: ['--style-icon-color', '--token-icon'],
  btnBg: ['--brand-btn-bg', '--style-button-bg', '--token-btn-bg'],
  btnText: ['--brand-btn-text', '--style-button-text', '--token-btn-text'],
  btnSecondaryBg: ['--brand-btn-secondary-bg'],
  btnSecondaryText: ['--brand-btn-secondary-text'],
  badgeBg: ['--style-badge-bg', '--token-badge-bg'],
  badgeText: ['--style-badge-text', '--token-badge-text'],
  badgeBorder: ['--style-badge-border', '--token-badge-border'],
  borderColor: ['--style-border-color', '--style-border', '--style-card-border-color', '--style-card-border', '--token-card-border', '--token-divider'],
  dividerColor: ['--style-divider-color', '--token-divider', '--style-border-color'],
  overlayColor: ['--style-overlay-color', '--style-image-overlay', '--token-overlay'],
};

export const SECTION_COLOR_FIELD_TO_SLOT: Record<string, SectionColorSlot> = {
  sectionBg: 'sectionBg',
  sectionBgAlt: 'sectionBgAlt',
  cardBg: 'cardBg',
  headingColor: 'headingColor',
  subheadingColor: 'subheadingColor',
  bodyColor: 'bodyColor',
  mutedColor: 'mutedColor',
  textPrimary: 'textPrimary',
  textSecondary: 'textSecondary',
  imageTextColor: 'imageTextColor',
  iconColor: 'iconColor',
  accentColor: 'accentColor',
  styleBrand: 'accentColor',
  brandPrimary: 'accentColor',
  brandAccent: 'accentColor',
  colorPrimary: 'accentColor',
  eyebrow: 'accentColor',
  statValue: 'accentColor',
  quoteMark: 'accentColor',
  ratingStar: 'accentColor',
  check: 'accentColor',
  onDarkHeading: 'imageTextColor',
  onDarkBody: 'imageTextColor',
  onDarkMuted: 'imageTextColor',
  btnBg: 'btnBg',
  btnText: 'btnText',
  btnSecondaryBg: 'btnSecondaryBg',
  btnSecondaryText: 'btnSecondaryText',
  badgeBg: 'badgeBg',
  badgeText: 'badgeText',
  badgeBorder: 'badgeBorder',
  imageOverlay: 'overlayColor',
  borderColor: 'borderColor',
  dividerColor: 'dividerColor',
  cardBorder: 'borderColor',
  cardBorderColor: 'borderColor',
};

const SECTION_COLOR_VAR_TO_SLOT = new Map<string, SectionColorSlot>();
for (const [slot, vars] of Object.entries(SECTION_COLOR_SLOT_ALIASES) as [SectionColorSlot, string[]][]) {
  for (const cssVar of vars) {
    if (!SECTION_COLOR_VAR_TO_SLOT.has(cssVar)) SECTION_COLOR_VAR_TO_SLOT.set(cssVar, slot);
  }
}

export function getSectionColorSlotForCssVar(cssVar: string): SectionColorSlot | null {
  return SECTION_COLOR_VAR_TO_SLOT.get(cssVar) || null;
}

export function getSectionColorSlotForField(field: string): SectionColorSlot | null {
  return SECTION_COLOR_FIELD_TO_SLOT[field] || null;
}

export function getCssVarsForSectionColorSlot(slot: SectionColorSlot): string[] {
  return SECTION_COLOR_SLOT_ALIASES[slot] || [SECTION_COLOR_SLOT_DEFINITIONS[slot].cssVar];
}

export function areEquivalentSectionColorVars(left: string, right: string): boolean {
  if (left === right) return true;
  const leftSlot = getSectionColorSlotForCssVar(left);
  return Boolean(leftSlot && leftSlot === getSectionColorSlotForCssVar(right));
}

const BASE_TEXT_SLOTS: SectionColorSlot[] = ['sectionBg', 'headingColor', 'bodyColor', 'textPrimary', 'textSecondary'];
const CARD_SLOTS: SectionColorSlot[] = ['cardBg', 'borderColor'];
const CTA_SLOTS: SectionColorSlot[] = ['btnBg', 'btnText'];
const BADGE_SLOTS: SectionColorSlot[] = ['badgeBg', 'badgeText'];
const MEDIA_OVERLAY_SLOTS: SectionColorSlot[] = ['overlayColor', 'imageTextColor'];

function inferColorSlotsForSection(type: string, category: SectionContract['category'], fieldKeys: Set<string>): SectionColorSlot[] {
  const slots = new Set<SectionColorSlot>(BASE_TEXT_SLOTS);
  const keyText = [...fieldKeys].join(' ').toLowerCase();

  if (category === 'premium' || keyText.includes('card') || keyText.includes('items') || keyText.includes('plans') || keyText.includes('members')) {
    CARD_SLOTS.forEach(slot => slots.add(slot));
  }
  if (keyText.includes('cta') || keyText.includes('button') || keyText.includes('href') || keyText.includes('submit')) {
    CTA_SLOTS.forEach(slot => slots.add(slot));
  }
  if (keyText.includes('badge') || keyText.includes('eyebrow') || keyText.includes('label')) {
    BADGE_SLOTS.forEach(slot => slots.add(slot));
  }
  if (keyText.includes('icon')) slots.add('iconColor');
  if (keyText.includes('image') || keyText.includes('video') || type.toLowerCase().includes('hero')) {
    MEDIA_OVERLAY_SLOTS.forEach(slot => slots.add(slot));
  }
  if (category === 'premium') {
    slots.add('accentColor');
    slots.add('mutedColor');
  }

  return [...slots];
}

export function getAllSectionContracts(): SectionContract[] {
  const formalByType = new Map(PILOT_SECTION_CONTRACTS.map((contract) => [contract.type, contract]));
  const definitions = new Map<string, { label: string; category?: string }>();

  for (const industry of CONTRACT_INDUSTRIES) {
    for (const definition of getSectionTypesForIndustry(industry)) {
      const type = definition.type;
      if (!type || definitions.has(type)) continue;
      definitions.set(type, { label: definition.label || type, category: definition.category });
    }
  }

  for (const type of Object.keys(SECTION_EDITOR_FIELD_DEFAULTS)) {
    if (!definitions.has(type)) definitions.set(type, { label: labelFromType(type) });
  }

  for (const type of Object.keys(SECTION_PREVIEW_DATA)) {
    if (!definitions.has(type)) definitions.set(type, { label: labelFromType(type) });
  }

  const derived = [...definitions.entries()].map(([type, definition]) => {
    const formal = formalByType.get(type);
    if (formal) return formal;

    const previewData = SECTION_PREVIEW_DATA[type] || SECTION_EDITOR_FIELD_DEFAULTS[type] || {};
    const defaultData = SECTION_EDITOR_FIELD_DEFAULTS[type] || previewData;
    const fieldKeys = new Set([...Object.keys(defaultData), ...Object.keys(previewData)]);

    return {
      type,
      label: definition.label,
      category: categoryFor(type, definition.category),
      fields: [...fieldKeys].sort().map((key) => ({
        key,
        label: labelFromKey(key),
        type: inferFieldType(key, defaultData[key] ?? previewData[key]),
        supportsFocalPoint: key.toLowerCase().includes('image') || key.toLowerCase().includes('logo'),
      })),
      colorSlots: inferColorSlotsForSection(type, categoryFor(type, definition.category), fieldKeys),
      previewData,
      maturity: 'formal',
      source: 'registry',
    } satisfies SectionContract;
  });

  return derived.sort((a, b) => a.category.localeCompare(b.category) || a.label.localeCompare(b.label, 'de'));
}

export function getFieldsForSection(sectionType: string, industry?: string): ColorFieldKey[] {
  const industryKey = industry
    ? `${sectionType}${industry.charAt(0).toUpperCase()}${industry.slice(1)}`
    : null;
  const industrySpecific = industryKey ? SECTION_COLOR_CONTRACTS_GENERATED[industryKey] : undefined;
  const baseFields: ColorFieldKey[] = ['sectionBg'];

  const mergeFields = (fields: ColorFieldKey[] | undefined): ColorFieldKey[] => {
    const combined = [...baseFields, ...(fields || [])];
    return combined.filter((field, index) => combined.indexOf(field) === index);
  };

  if (Array.isArray(industrySpecific) && industrySpecific.length > 0) {
    return mergeFields((industrySpecific as ColorFieldKey[]).filter((field) => field !== 'sectionBgAlt'));
  }

  const generic = SECTION_COLOR_CONTRACTS_GENERIC[sectionType];
  if (Array.isArray(generic) && generic.length > 0) {
    return mergeFields((generic as ColorFieldKey[]).filter((field) => field !== 'sectionBgAlt'));
  }

  return ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'accentColor'];
}

function categoryFor(type: string, category?: string): SectionContract['category'] {
  if (SHOP_TYPES.has(type) || category === 'Shop') return 'shop';
  if (PREMIUM_TYPES.has(type) || category === 'Premium') return 'premium';
  if (category && !['Inhalt', 'Marketing', 'Medien', 'Kontakt', 'Leistungen', 'Social Proof', 'Team & Personen', 'Booking'].includes(category)) return 'industry';
  return 'shared';
}

function inferFieldType(key: string, value: unknown): SectionFieldType {
  const normalized = key.toLowerCase();
  if (normalized.includes('image') || normalized.includes('logo')) return 'image';
  if (normalized.includes('cta') || normalized.includes('button') || normalized.includes('href')) return 'cta';
  if (normalized.includes('text') || normalized.includes('content') || normalized.includes('subline') || normalized.includes('description')) return 'richText';
  if (typeof value === 'number') return 'number';
  if (typeof value === 'boolean') return 'boolean';
  if (Array.isArray(value)) return 'list';
  if (value && typeof value === 'object') return 'object';
  return 'text';
}

function labelFromType(type: string) {
  return type.replace(/([A-Z])/g, ' $1').replace(/^./, (char) => char.toUpperCase());
}

function labelFromKey(key: string) {
  return labelFromType(key)
    .replace('Cta', 'CTA')
    .replace('Bg', 'Hintergrund')
    .replace('Url', 'URL');
}
