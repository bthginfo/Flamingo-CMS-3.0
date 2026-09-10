// Shared by the renderer and the CMS color resolver. Keep precedence identical.
export const LEGACY_SECTION_FALLBACK_INDUSTRY_ORDER = [
  'tradesman',
  'restaurant',
  'hotel',
  'tourism',
  'salon',
  'medical',
  'wedding',
  'consulting',
  'photography',
  'realestate',
  'cafe',
  'tattoo',
  'ecommerce',
  'retail',
  'florist',
  'fitness',
  'location',
  'verein',
] as const;

export const SECTION_INDUSTRY_ALIASES: Readonly<Record<string, string>> = Object.freeze({
  handwerk: 'tradesman',
  shop: 'ecommerce',
  bar: 'restaurant',
  eishockey: 'verein',
});

