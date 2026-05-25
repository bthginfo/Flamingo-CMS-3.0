/**
 * Shared dropdown options for the contact form.
 * Keep in sync with /templates (BRANCHE_OPTIONS) and /preise (PAKET_OPTIONS).
 */

export const BRANCHE_OPTIONS = [
  'Handwerk',
  'Restaurant / Gastro',
  'Beauty & Salon',
  'Hotel & Pension',
  'Tourismus',
  'Arztpraxis / Gesundheit',
  'Hochzeit',
  'Fotografie',
  'Kanzlei & Beratung',
  'Immobilien',
  'Café & Bar',
  'Tattoo Studio',
  'Online-Shop',
  'Einzelhandel / Möbelhaus',
  'Andere',
];

export const PAKET_OPTIONS = [
  'Template (1.490 €)',
  'Mit Content Kit (Foto + Video) (2.400 €)',
  'Custom (auf Anfrage)',
  'Noch unentschieden',
];

export const ADDON_OPTIONS = [
  { value: 'shop-self', label: 'Shop-Addon (999 €)' },
  { value: 'shop-setup', label: 'Shop-Addon inkl. Einrichtung (1.450 €)' },
  { value: 'multilang', label: 'Mehrsprachigkeit (ab 290 €)' },
  { value: 'reservation', label: 'Online-Reservierung (ab 390 €)' },
  { value: 'newsletter', label: 'Newsletter-Setup (290 €)' },
  { value: 'seo-texte', label: 'Texte & SEO (ab 490 €)' },
];
