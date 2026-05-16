export type SectionTypeDefinition = {
  type: string;
  label: string;
  description: string;
  category?: string;
};

// Shared sections available to all templates
const SHARED_SECTION_TYPES: SectionTypeDefinition[] = [
  { type: 'textImage', label: 'Text & Bild', description: 'Zweispaltiger Abschnitt mit Text und Bild', category: 'Inhalt' },
  { type: 'freeText', label: 'Freitext', description: 'Formatierter Text mit Editor', category: 'Inhalt' },
  { type: 'richText', label: 'HTML-Block', description: 'Eigener HTML-Code (Impressum, Datenschutz etc.)', category: 'Inhalt' },
  { type: 'videoEmbed', label: 'Video', description: 'YouTube / Vimeo Video einbetten', category: 'Inhalt' },
  { type: 'headerBanner', label: 'Header-Banner', description: 'Obere Hinweisleiste', category: 'Inhalt' },
  { type: 'ctaBand', label: 'CTA-Band', description: 'Call-to-Action Banner', category: 'Marketing' },
  { type: 'ctaLinks', label: 'CTA-Links', description: 'Button-Links zu Unterseiten', category: 'Marketing' },
  { type: 'uspStrip', label: 'USP-Leiste', description: 'Einzigartige Verkaufsargumente', category: 'Marketing' },
  { type: 'stats', label: 'Zahlen & Fakten', description: 'Animierte Statistik-Zähler', category: 'Marketing' },
  { type: 'logoCloud', label: 'Logo-Cloud', description: 'Partner- & Zertifikats-Logos', category: 'Marketing' },
  { type: 'testimonials', label: 'Bewertungen', description: 'Kundenstimmen', category: 'Social Proof' },
  { type: 'faq', label: 'FAQ', description: 'Häufige Fragen', category: 'Social Proof' },
  { type: 'galleryGrid', label: 'Galerie', description: 'Bildergalerie mit Lightbox', category: 'Medien' },
  { type: 'newsPreview', label: 'News-Vorschau', description: 'Aktuelle Beiträge (News/Blog)', category: 'Medien' },
  { type: 'newsGrid', label: 'News-Grid', description: 'News-Beiträge als Grid', category: 'Medien' },
  { type: 'contact', label: 'Kontakt', description: 'Kontaktformular', category: 'Kontakt' },
  { type: 'map', label: 'Karte', description: 'Google Maps Einbettung', category: 'Kontakt' },
  { type: 'team', label: 'Team', description: 'Team-Mitglieder', category: 'Team & Personen' },
  { type: 'servicesGrid', label: 'Leistungen', description: 'Leistungs-Grid', category: 'Leistungen' },
  { type: 'processSteps', label: 'Ablauf', description: 'Prozess-Schritte Timeline', category: 'Leistungen' },
  { type: 'serviceDetail', label: 'Leistungs-Detail', description: 'Detaillierte Leistungsbeschreibung', category: 'Leistungen' },
  { type: 'portfolio', label: 'Portfolio', description: 'Referenzprojekte-Galerie', category: 'Medien' },
  { type: 'collectionHero', label: 'Collection-Hero', description: 'Blog/Artikel-Hero für Detail-Seiten', category: 'Inhalt' },
];

export const TRADESMAN_SECTION_TYPES: SectionTypeDefinition[] = [
  { type: 'hero', label: 'Hero', description: 'Hauptbanner der Seite' },
  { type: 'uspStrip', label: 'USP-Leiste', description: 'Einzigartige Verkaufsargumente' },
  { type: 'servicesGrid', label: 'Leistungen', description: 'Leistungs-Grid' },
  { type: 'processSteps', label: 'Ablauf', description: 'Prozess-Schritte Timeline' },
  { type: 'ctaLinks', label: 'CTA-Links', description: 'Button-Links zu Unterseiten' },
  { type: 'newsPreview', label: 'News-Vorschau', description: 'Aktuelle Beiträge (News/Blog)' },
  { type: 'newsGrid', label: 'News-Grid', description: 'News-Beiträge als Grid' },
  { type: 'stats', label: 'Zahlen & Fakten', description: 'Animierte Statistik-Zähler' },
  { type: 'logoCloud', label: 'Logo-Cloud', description: 'Partner- & Zertifikats-Logos' },
  { type: 'galleryGrid', label: 'Galerie', description: 'Bildergalerie mit Lightbox' },
  { type: 'testimonials', label: 'Bewertungen', description: 'Kundenstimmen' },
  { type: 'faq', label: 'FAQ', description: 'Häufige Fragen' },
  { type: 'ctaBand', label: 'CTA-Band', description: 'Call-to-Action Banner' },
  { type: 'contact', label: 'Kontakt', description: 'Kontaktformular' },
  { type: 'map', label: 'Karte', description: 'Google Maps Einbettung' },
  { type: 'serviceDetail', label: 'Leistungs-Detail', description: 'Detaillierte Leistungsbeschreibung' },
  { type: 'portfolio', label: 'Portfolio', description: 'Referenzprojekte-Galerie' },
  { type: 'team', label: 'Team', description: 'Team-Mitglieder' },
  { type: 'textImage', label: 'Text & Bild', description: 'Zweispaltiger Abschnitt mit Text und Bild' },
  { type: 'richText', label: 'HTML-Block', description: 'Eigener HTML-Code (Impressum, Datenschutz etc.)' },
  { type: 'headerBanner', label: 'Header-Banner', description: 'Obere Hinweisleiste' },
  { type: 'collectionHero', label: 'Collection-Hero', description: 'Blog/Artikel-Hero für Detail-Seiten' },
];

export const RESTAURANT_SECTION_TYPES: SectionTypeDefinition[] = [
  { type: 'hero', label: 'Restaurant-Hero', description: 'Atmosphäre, Küche und Reservierungs-CTA' },
  { type: 'menu', label: 'Speisekarte', description: 'Kategorien, Gerichte, Preise, Allergene und Detail-Links' },
  { type: 'signatureDishes', label: 'Signature-Gerichte', description: 'Empfehlungen des Hauses mit Bildern und CTAs' },
  { type: 'reservation', label: 'Reservierung', description: 'Reservierungs-CTA, Formular-Hinweise und Buchungslink' },
  { type: 'openingHours', label: 'Öffnungszeiten', description: 'Restaurantzeiten, Küchenzeiten und Hinweise' },
  { type: 'ambience', label: 'Ambiente', description: 'Atmosphäre, Bilder und Highlights' },
  { type: 'events', label: 'Events', description: 'Themenabende, Feiern und Buchungs-CTAs' },
  { type: 'textImage', label: 'Text & Bild', description: 'Zweispaltiger Abschnitt mit Text und Bild' },
  { type: 'richText', label: 'HTML-Block', description: 'Eigener HTML-Code (Impressum, Datenschutz etc.)' },
  { type: 'collectionHero', label: 'Collection-Hero', description: 'Blog/Artikel-Hero für Detail-Seiten' },
];

export const HOTEL_SECTION_TYPES: SectionTypeDefinition[] = [
  { type: 'hero', label: 'Hotel-Hero', description: 'Hotelpositionierung, Bild und Buchungs-CTA' },
  { type: 'bookingStrip', label: 'Buchungsleiste', description: 'Anreise, Abreise, Gäste und Direktbuchung' },
  { type: 'roomShowcase', label: 'Zimmer', description: 'Zimmerkategorien, Preise, Features und CTAs' },
  { type: 'offers', label: 'Angebote', description: 'Arrangements, Saisonpakete und Specials' },
  { type: 'amenities', label: 'Ausstattung', description: 'Services, Features und Hotelausstattung' },
  { type: 'wellness', label: 'Wellness', description: 'Spa, Treatments und Wellness-Highlights' },
  { type: 'location', label: 'Lage', description: 'Adresse, Anreise, Karte und Umgebung' },
  { type: 'hotelDining', label: 'Restaurant & Bar', description: 'Frühstück, Restaurant, Bar und Genuss' },
  { type: 'eventSpaces', label: 'Events & Tagungen', description: 'Räume, Kapazitäten und Anfrage-CTA' },
  { type: 'gallery', label: 'Galerie', description: 'Hotelbilder mit Kategorien und Captions' },
  { type: 'testimonials', label: 'Bewertungen', description: 'Gästestimmen, Rating und Quelle' },
  { type: 'faq', label: 'FAQ', description: 'Check-in, Parken, Buchung, Storno' },
  { type: 'contact', label: 'Kontakt', description: 'Kontaktformular, Infokarten und Route' },
  { type: 'textImage', label: 'Text & Bild', description: 'Zweispaltiger Abschnitt mit Text und Bild' },
  { type: 'richText', label: 'HTML-Block', description: 'Eigener HTML-Code (Impressum, Datenschutz etc.)' },
  { type: 'collectionHero', label: 'Collection-Hero', description: 'Blog/Artikel-Hero für Detail-Seiten' },
];

export const TOURISM_SECTION_TYPES: SectionTypeDefinition[] = [
  { type: 'hero', label: 'Tourismus-Hero', description: 'Destination, Saison, Region und Erlebnis-CTA' },
  { type: 'destinationHighlights', label: 'Destination-Highlights', description: 'Top-Orte, Naturpunkte und Highlights' },
  { type: 'experienceGrid', label: 'Erlebnisse', description: 'Aktivitäten, Dauer, Zielgruppe und CTAs' },
  { type: 'seasonTeaser', label: 'Saison-Teaser', description: 'Jahreszeiten und saisonale Angebote' },
  { type: 'eventsCalendar', label: 'Veranstaltungen', description: 'Events mit Datum, Ort, Kategorie und Preis' },
  { type: 'placesMap', label: 'Orte & Karte', description: 'Karte, Orte, Distanzen und Adressen' },
  { type: 'sightseeingList', label: 'Sehenswürdigkeiten', description: 'Museen, Aussichtspunkte und Attraktionen' },
  { type: 'tourRoutes', label: 'Routen & Touren', description: 'Routen mit Länge, Dauer und Schwierigkeit' },
  { type: 'accommodationGrid', label: 'Unterkünfte', description: 'Hotels, Pensionen, Camping und Ferienwohnungen' },
  { type: 'visitorInfo', label: 'Besucherinfo', description: 'Anreise, Parken, ÖPNV und Barrierefreiheit' },
  { type: 'downloadGuides', label: 'Downloads', description: 'Karten, Broschüren und PDF-Guides' },
  { type: 'gallery', label: 'Galerie', description: 'Destinationsbilder mit Kategorien und Captions' },
  { type: 'faq', label: 'FAQ', description: 'Häufige Fragen fuer Besucher' },
  { type: 'tourismContact', label: 'Tourismus-Kontakt', description: 'Tourismusbuero, Formular, Infokarten und CTAs' },
  { type: 'textImage', label: 'Text & Bild', description: 'Zweispaltiger Abschnitt mit Text und Bild' },
  { type: 'richText', label: 'HTML-Block', description: 'Eigener HTML-Code (Impressum, Datenschutz etc.)' },
  { type: 'collectionHero', label: 'Collection-Hero', description: 'Blog/Artikel-Hero für Detail-Seiten' },
];

export const SALON_SECTION_TYPES: SectionTypeDefinition[] = [
  { type: 'hero', label: 'Salon-Hero', description: 'Positionierung, Mood-Bild und Buchungs-CTA' },
  { type: 'serviceMenu', label: 'Service-Menue', description: 'Service-Kategorien und Behandlungen' },
  { type: 'priceList', label: 'Preisliste', description: 'Kategorien, Preise, Dauer und Hinweise' },
  { type: 'treatmentDetail', label: 'Behandlungsdetails', description: 'Ablauf, Ergebnis und Pflegehinweise' },
  { type: 'packages', label: 'Pakete & Specials', description: 'Pakete, Gutscheine und saisonale Angebote' },
  { type: 'teamShowcase', label: 'Team', description: 'Teammitglieder, Rollen und Spezialgebiete' },
  { type: 'expertiseGrid', label: 'Expertise', description: 'Skills, Zertifikate und Marken' },
  { type: 'beforeAfter', label: 'Vorher/Nachher', description: 'Transformationen mit Bildpaaren' },
  { type: 'gallery', label: 'Galerie', description: 'Salon- und Arbeitsbilder' },
  { type: 'testimonials', label: 'Bewertungen', description: 'Kundenstimmen und Ratings' },
  { type: 'openingHours', label: 'Öffnungszeiten', description: 'Tage, Zeiten und Buchungshinweise' },
  { type: 'bookingCta', label: 'Buchungs-CTA', description: 'Onlinebuchung, Telefon, WhatsApp und Hinweise' },
  { type: 'locationContact', label: 'Kontakt & Standort', description: 'Adresse, Karte, Formular und CTAs' },
  { type: 'faq', label: 'FAQ', description: 'Häufige Fragen' },
  { type: 'textImage', label: 'Text & Bild', description: 'Zweispaltiger Abschnitt mit Text und Bild' },
  { type: 'richText', label: 'HTML-Block', description: 'Eigener HTML-Code (Impressum, Datenschutz etc.)' },
  { type: 'collectionHero', label: 'Collection-Hero', description: 'Blog/Artikel-Hero für Detail-Seiten' },
];

export const MEDICAL_SECTION_TYPES: SectionTypeDefinition[] = [
  { type: 'hero', label: 'Praxis-Hero', description: 'Fachrichtung, Vertrauen, Termin-CTA und Akuthinweis' },
  { type: 'serviceOverview', label: 'Leistungen', description: 'Behandlungen, Sprechstunden und Schwerpunkte' },
  { type: 'treatmentDetail', label: 'Behandlungsdetails', description: 'Ablauf, Voraussetzungen und Hinweise je Behandlung' },
  { type: 'diagnostics', label: 'Diagnostik', description: 'Untersuchungen, Methoden und Patientennutzen' },
  { type: 'doctorTeam', label: 'Ärzteteam', description: 'Ärztinnen, Ärzte, Fachgebiete und Sprachen' },
  { type: 'practiceTeam', label: 'Praxisteam', description: 'MFA, Assistenz, Empfang und Rollen' },
  { type: 'certifications', label: 'Zertifikate', description: 'Qualifikationen, Mitgliedschaften und Standards' },
  { type: 'patientInfo', label: 'Patienteninfo', description: 'Vorbereitung, Ablauf, Mitbringen und Hinweise' },
  { type: 'insuranceInfo', label: 'Kassen & Privat', description: 'Versicherungsarten, Leistungen und Abrechnungshinweise' },
  { type: 'downloadForms', label: 'Downloads', description: 'Formulare, Anamneseboegen und Dateien' },
  { type: 'appointmentCta', label: 'Termin-CTA', description: 'Online-Termin, Telefon, Rueckruf und Hinweise' },
  { type: 'openingHours', label: 'Sprechzeiten', description: 'Öffnungszeiten, Akutsprechstunde und Urlaubsnotiz' },
  { type: 'emergencyInfo', label: 'Notfallhinweise', description: 'Akutfall, Bereitschaftsdienst und Telefonnummern' },
  { type: 'practiceGallery', label: 'Praxis-Galerie', description: 'Räume, Empfang, Behandlung und Diagnostik' },
  { type: 'equipmentHighlights', label: 'Ausstattung', description: 'Geraete, Technik und medizinische Vorteile' },
  { type: 'valuesGrid', label: 'Praxiswerte', description: 'Haltung, Betreuung und Versorgungsanspruch' },
  { type: 'locationContact', label: 'Kontakt & Anfahrt', description: 'Adresse, Karte, Formular und Kontaktkarten' },
  { type: 'faq', label: 'FAQ', description: 'Häufige Patientenfragen' },
  { type: 'textImage', label: 'Text & Bild', description: 'Zweispaltiger Abschnitt mit Text und Bild' },
  { type: 'richText', label: 'HTML-Block', description: 'Eigener HTML-Code (Impressum, Datenschutz etc.)' },
  { type: 'collectionHero', label: 'Collection-Hero', description: 'Blog/Artikel-Hero für Detail-Seiten' },
];

export const WEDDING_SECTION_TYPES: SectionTypeDefinition[] = [
  { type: 'hero', label: 'Wedding-Hero', description: 'Paarnamen, Datum, Countdown und Hochzeitsbild' },
  { type: 'coupleStory', label: 'Unsere Geschichte', description: 'Timeline mit Meilensteinen des Paares' },
  { type: 'eventSchedule', label: 'Tagesablauf', description: 'Zeitplan des Hochzeitstags' },
  { type: 'venueInfo', label: 'Location', description: 'Veranstaltungsort mit Karte und Infos' },
  { type: 'travelInfo', label: 'Anreise & Hotels', description: 'Anfahrt und Übernachtungsempfehlungen' },
  { type: 'weddingParty', label: 'Trauzeugen', description: 'Trauzeugen und Brautjungfern' },
  { type: 'giftRegistry', label: 'Geschenke', description: 'Geschenkewünsche und Bankverbindung' },
  { type: 'dresscode', label: 'Dresscode', description: 'Kleidungsempfehlungen und Farbpalette' },
  { type: 'rsvp', label: 'Zusage (RSVP)', description: 'Anmeldeformular für Gäste' },
  { type: 'weddingMenu', label: 'Menü', description: 'Hochzeitsmenü mit Gängen' },
  { type: 'faq', label: 'FAQ', description: 'Häufige Fragen der Gäste' },
  { type: 'gallery', label: 'Galerie', description: 'Fotos vom Paar / Engagement-Shooting' },
  { type: 'textImage', label: 'Text & Bild', description: 'Zweispaltiger Abschnitt mit Text und Bild' },
  { type: 'richText', label: 'HTML-Block', description: 'Eigener HTML-Code (Impressum, Datenschutz etc.)' },
  { type: 'collectionHero', label: 'Collection-Hero', description: 'Blog/Artikel-Hero für Detail-Seiten' },
];

export const PHOTOGRAPHY_SECTION_TYPES: SectionTypeDefinition[] = [
  { type: 'hero', label: 'Hero', description: 'Fullscreen-Hero mit Bild und CTA' },
  { type: 'portfolioGallery', label: 'Portfolio-Galerie', description: 'Filterbare Masonry-Galerie mit Lightbox' },
  { type: 'servicesGrid', label: 'Leistungen', description: 'Leistungs-Grid mit Links zu Detail-Seiten' },
  { type: 'servicePackages', label: 'Pakete & Preise', description: 'Shooting-Pakete mit Features und Preisen' },
  { type: 'photographerAbout', label: 'Über mich', description: 'Persönliche Vorstellung mit Bild und Story' },
  { type: 'shootingProcess', label: 'Ablauf', description: 'Schritte vom Kennenlernen bis zur Übergabe' },
  { type: 'testimonials', label: 'Bewertungen', description: 'Kundenstimmen und Ratings' },
  { type: 'faq', label: 'FAQ', description: 'Häufige Fragen' },
  { type: 'contact', label: 'Kontakt', description: 'Kontaktformular' },
  { type: 'ctaBand', label: 'CTA-Band', description: 'Call-to-Action Banner' },
  { type: 'uspStrip', label: 'USP-Leiste', description: 'Einzigartige Verkaufsargumente' },
  { type: 'textImage', label: 'Text & Bild', description: 'Zweispaltiger Abschnitt mit Text und Bild' },
  { type: 'newsPreview', label: 'News-Vorschau', description: 'Aktuelle Beiträge' },
  { type: 'richText', label: 'HTML-Block', description: 'Eigener HTML-Code (Impressum, Datenschutz etc.)' },
  { type: 'collectionHero', label: 'Collection-Hero', description: 'Blog/Artikel-Hero für Detail-Seiten' },
];

export function getSectionTypesForIndustry(industry: string): SectionTypeDefinition[] {
  let specific: SectionTypeDefinition[];
  if (industry === 'photography') specific = PHOTOGRAPHY_SECTION_TYPES;
  else if (industry === 'wedding') specific = WEDDING_SECTION_TYPES;
  else if (industry === 'medical') specific = MEDICAL_SECTION_TYPES;
  else if (industry === 'salon') specific = SALON_SECTION_TYPES;
  else if (industry === 'tourism') specific = TOURISM_SECTION_TYPES;
  else if (industry === 'hotel') specific = HOTEL_SECTION_TYPES;
  else if (industry === 'restaurant') specific = RESTAURANT_SECTION_TYPES;
  else specific = TRADESMAN_SECTION_TYPES;

  // Merge: industry-specific first, then shared (skip duplicates)
  const types = new Set(specific.map(s => s.type));
  const shared = SHARED_SECTION_TYPES.filter(s => !types.has(s.type));
  return [...specific, ...shared];
}
