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
  },
];

export function getPilotSectionContract(type: string) {
  return PILOT_SECTION_CONTRACTS.find((contract) => contract.type === type) || null;
}
