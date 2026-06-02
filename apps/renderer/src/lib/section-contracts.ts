import { getSectionTypesForIndustry } from '../app/admin/pages/[id]/section-types';
import { SECTION_EDITOR_FIELD_DEFAULTS } from './section-editor-field-defaults';
import { SECTION_PREVIEW_DATA } from './section-preview-data';

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
  | 'accentColor'
  | 'iconColor'
  | 'btnBg'
  | 'btnText'
  | 'badgeBg'
  | 'badgeText'
  | 'borderColor'
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
      colorSlots: [],
      previewData,
      maturity: 'formal',
      source: 'registry',
    } satisfies SectionContract;
  });

  return derived.sort((a, b) => a.category.localeCompare(b.category) || a.label.localeCompare(b.label, 'de'));
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
