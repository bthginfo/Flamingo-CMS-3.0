export type SectionTypeDefinition = {
  type: string;
  label: string;
  description: string;
};

export const TRADESMAN_SECTION_TYPES: SectionTypeDefinition[] = [
  { type: 'hero', label: 'Hero', description: 'Hauptbanner der Seite' },
  { type: 'uspStrip', label: 'USP-Leiste', description: 'Einzigartige Verkaufsargumente' },
  { type: 'servicesGrid', label: 'Leistungen', description: 'Leistungs-Grid' },
  { type: 'processSteps', label: 'Ablauf', description: 'Prozess-Schritte Timeline' },
  { type: 'ctaLinks', label: 'CTA-Links', description: 'Button-Links zu Unterseiten' },
  { type: 'newsPreview', label: 'News-Vorschau', description: 'Aktuelle Beitraege (News/Blog)' },
  { type: 'newsGrid', label: 'News-Grid', description: 'News-Beitraege als Grid' },
  { type: 'stats', label: 'Zahlen & Fakten', description: 'Animierte Statistik-Zaehler' },
  { type: 'logoCloud', label: 'Logo-Cloud', description: 'Partner- & Zertifikats-Logos' },
  { type: 'galleryGrid', label: 'Galerie', description: 'Bildergalerie mit Lightbox' },
  { type: 'testimonials', label: 'Bewertungen', description: 'Kundenstimmen' },
  { type: 'faq', label: 'FAQ', description: 'Haeufige Fragen' },
  { type: 'ctaBand', label: 'CTA-Band', description: 'Call-to-Action Banner' },
  { type: 'contact', label: 'Kontakt', description: 'Kontaktformular' },
  { type: 'map', label: 'Karte', description: 'Google Maps Einbettung' },
  { type: 'serviceDetail', label: 'Leistungs-Detail', description: 'Detaillierte Leistungsbeschreibung' },
  { type: 'portfolio', label: 'Portfolio', description: 'Referenzprojekte-Galerie' },
  { type: 'team', label: 'Team', description: 'Team-Mitglieder' },
  { type: 'richText', label: 'Freitext / HTML', description: 'Impressum, Datenschutz, AGB etc.' },
  { type: 'headerBanner', label: 'Header-Banner', description: 'Obere Hinweisleiste' },
];

export const RESTAURANT_SECTION_TYPES: SectionTypeDefinition[] = [
  { type: 'hero', label: 'Restaurant-Hero', description: 'Atmosphaere, Kueche und Reservierungs-CTA' },
  { type: 'menu', label: 'Speisekarte', description: 'Kategorien, Gerichte, Preise, Allergene und Detail-Links' },
  { type: 'signatureDishes', label: 'Signature-Gerichte', description: 'Empfehlungen des Hauses mit Bildern und CTAs' },
  { type: 'reservation', label: 'Reservierung', description: 'Reservierungs-CTA, Formular-Hinweise und Buchungslink' },
  { type: 'openingHours', label: 'Oeffnungszeiten', description: 'Restaurantzeiten, Kuechenzeiten und Hinweise' },
  { type: 'ambience', label: 'Ambiente', description: 'Atmosphaere, Bilder und Highlights' },
  { type: 'events', label: 'Events', description: 'Themenabende, Feiern und Buchungs-CTAs' },
  { type: 'richText', label: 'Freitext / HTML', description: 'Impressum, Datenschutz, AGB etc.' },
];

export const HOTEL_SECTION_TYPES: SectionTypeDefinition[] = [
  { type: 'hero', label: 'Hotel-Hero', description: 'Hotelpositionierung, Bild und Buchungs-CTA' },
  { type: 'bookingStrip', label: 'Buchungsleiste', description: 'Anreise, Abreise, Gaeste und Direktbuchung' },
  { type: 'roomShowcase', label: 'Zimmer', description: 'Zimmerkategorien, Preise, Features und CTAs' },
  { type: 'offers', label: 'Angebote', description: 'Arrangements, Saisonpakete und Specials' },
  { type: 'amenities', label: 'Ausstattung', description: 'Services, Features und Hotelausstattung' },
  { type: 'wellness', label: 'Wellness', description: 'Spa, Treatments und Wellness-Highlights' },
  { type: 'location', label: 'Lage', description: 'Adresse, Anreise, Karte und Umgebung' },
  { type: 'hotelDining', label: 'Restaurant & Bar', description: 'Fruehstueck, Restaurant, Bar und Genuss' },
  { type: 'eventSpaces', label: 'Events & Tagungen', description: 'Raeume, Kapazitaeten und Anfrage-CTA' },
  { type: 'gallery', label: 'Galerie', description: 'Hotelbilder mit Kategorien und Captions' },
  { type: 'testimonials', label: 'Bewertungen', description: 'Gaestestimmen, Rating und Quelle' },
  { type: 'faq', label: 'FAQ', description: 'Check-in, Parken, Buchung, Storno' },
  { type: 'contact', label: 'Kontakt', description: 'Kontaktformular, Infokarten und Route' },
  { type: 'richText', label: 'Freitext / HTML', description: 'Impressum, Datenschutz, AGB etc.' },
];

export const TOURISM_SECTION_TYPES: SectionTypeDefinition[] = [
  { type: 'hero', label: 'Tourismus-Hero', description: 'Destination, Saison, Region und Erlebnis-CTA' },
  { type: 'destinationHighlights', label: 'Destination-Highlights', description: 'Top-Orte, Naturpunkte und Highlights' },
  { type: 'experienceGrid', label: 'Erlebnisse', description: 'Aktivitaeten, Dauer, Zielgruppe und CTAs' },
  { type: 'seasonTeaser', label: 'Saison-Teaser', description: 'Jahreszeiten und saisonale Angebote' },
  { type: 'eventsCalendar', label: 'Veranstaltungen', description: 'Events mit Datum, Ort, Kategorie und Preis' },
  { type: 'placesMap', label: 'Orte & Karte', description: 'Karte, Orte, Distanzen und Adressen' },
  { type: 'sightseeingList', label: 'Sehenswuerdigkeiten', description: 'Museen, Aussichtspunkte und Attraktionen' },
  { type: 'tourRoutes', label: 'Routen & Touren', description: 'Routen mit Laenge, Dauer und Schwierigkeit' },
  { type: 'accommodationGrid', label: 'Unterkuenfte', description: 'Hotels, Pensionen, Camping und Ferienwohnungen' },
  { type: 'visitorInfo', label: 'Besucherinfo', description: 'Anreise, Parken, OePNV und Barrierefreiheit' },
  { type: 'downloadGuides', label: 'Downloads', description: 'Karten, Broschueren und PDF-Guides' },
  { type: 'gallery', label: 'Galerie', description: 'Destinationsbilder mit Kategorien und Captions' },
  { type: 'faq', label: 'FAQ', description: 'Haeufige Fragen fuer Besucher' },
  { type: 'tourismContact', label: 'Tourismus-Kontakt', description: 'Tourismusbuero, Formular, Infokarten und CTAs' },
  { type: 'richText', label: 'Freitext / HTML', description: 'Impressum, Datenschutz, AGB etc.' },
];

export function getSectionTypesForIndustry(industry: string): SectionTypeDefinition[] {
  if (industry === 'tourism') return TOURISM_SECTION_TYPES;
  if (industry === 'hotel') return HOTEL_SECTION_TYPES;
  if (industry === 'restaurant') return RESTAURANT_SECTION_TYPES;
  return TRADESMAN_SECTION_TYPES;
}
