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
  'Floristik',
  'Fitness / Coaching',
  'Location / Eventraum',
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
  { value: 'booking-addon', label: 'Booking-Addon (399 € + 20 €/Monat)' },
  { value: 'multilang', label: 'Mehrsprachigkeit (ab 290 €)' },
  { value: 'content-reshoot', label: 'Foto-/Video-Nachshooting (890 €)' },
  { value: 'seo-texte', label: 'SEO optimierte Texte (ab 450 €)' },
  { value: 'crm', label: 'Eigenes CRM/Kundenverwaltung (ab 800 €)' },
  { value: 'logo-refresh', label: 'Logo-Refresh (ab 899 €)' },
  { value: 'custom-sections', label: 'Individuelle Sections (ab 200 €)' },
];
