export const FOOTER_VARIANTS = ['premium', 'classic', 'compact', 'editorial'] as const;

export type FooterVariant = (typeof FOOTER_VARIANTS)[number];

export const FOOTER_VARIANT_OPTIONS: Array<{ value: FooterVariant; label: string; description: string }> = [
  {
    value: 'premium',
    label: 'Premium Abschluss',
    description: 'Große CTA-Karte, volle Spalten und rechtliche Links. Gut für Conversion-Seiten.',
  },
  {
    value: 'classic',
    label: 'Klassisch',
    description: 'Ruhiger Footer ohne große CTA-Fläche. Gut für sachliche Websites.',
  },
  {
    value: 'compact',
    label: 'Kompakt',
    description: 'Reduzierter Footer mit Inline-Links. Gut für Onepager und kleine Seiten.',
  },
  {
    value: 'editorial',
    label: 'Editorial',
    description: 'Stärkerer Magazin-Abschluss mit dunkler CTA-Bühne. Gut für Premium-Marken.',
  },
];

export function normalizeFooterVariant(value: unknown): FooterVariant {
  return FOOTER_VARIANTS.includes(value as FooterVariant) ? (value as FooterVariant) : 'premium';
}
