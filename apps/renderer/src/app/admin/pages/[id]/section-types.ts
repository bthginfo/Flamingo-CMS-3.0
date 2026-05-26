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
  { type: 'legalContent', label: 'Rechtliche Inhalte', description: 'Strukturierte Abschnitte für Impressum / Datenschutz', category: 'Inhalt' },
  { type: 'videoEmbed', label: 'Video', description: 'YouTube / Vimeo Video einbetten', category: 'Inhalt' },
  { type: 'embed', label: 'Embed / Integration', description: 'Externe Dienste einbinden (Buchung, Bewertungen, Karten, etc.)', category: 'Inhalt' },
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
  { type: 'collectionList', label: 'Collection-Liste', description: 'Einträge einer Collection als Übersicht anzeigen', category: 'Medien' },
  { type: 'contact', label: 'Kontakt', description: 'Kontaktformular', category: 'Kontakt' },
  { type: 'map', label: 'Karte', description: 'Google Maps Einbettung', category: 'Kontakt' },
  { type: 'team', label: 'Team', description: 'Team-Mitglieder', category: 'Team & Personen' },
  { type: 'servicesGrid', label: 'Leistungen', description: 'Leistungs-Grid', category: 'Leistungen' },
  { type: 'processSteps', label: 'Ablauf', description: 'Prozess-Schritte Timeline', category: 'Leistungen' },
  { type: 'serviceDetail', label: 'Leistungs-Detail', description: 'Detaillierte Leistungsbeschreibung', category: 'Leistungen' },
  { type: 'portfolio', label: 'Portfolio', description: 'Referenzprojekte-Galerie', category: 'Medien' },
  { type: 'collectionHero', label: 'Collection-Hero', description: 'Blog/Artikel-Hero für Detail-Seiten', category: 'Inhalt' },
  { type: 'servicePackages', label: 'Pakete & Preise', description: 'Leistungspakete mit Features und Preisen', category: 'Leistungen' },
  { type: 'noticeBanner', label: 'Hinweisbanner', description: 'Auffälliges Banner für wichtige Hinweise (Urlaub, Aktionen etc.)', category: 'Marketing' },
  { type: 'comparisonTable', label: 'Vergleichstabelle', description: 'Pakete/Optionen im Vergleich darstellen', category: 'Marketing' },
  { type: 'socialProofBar', label: 'Social-Proof-Leiste', description: 'Kennzahlen, Bewertungen & Partner kompakt', category: 'Social Proof' },
  { type: 'timeline', label: 'Zeitleiste', description: 'Chronologischer Verlauf (Geschichte, Meilensteine)', category: 'Inhalt' },
  { type: 'statsCounter', label: 'Animierte Zahlen', description: 'Scroll-getriggerte Zähler mit dunklem Hintergrund & Gradient', category: 'Marketing' },
  { type: 'bentoGrid', label: 'Bento-Grid', description: 'Asymmetrisches Feature-Grid mit Hover-Spotlight', category: 'Inhalt' },
  { type: 'testimonialMarquee', label: 'Bewertungs-Marquee', description: 'Endlos-scrollende Bewertungskarten in 2 Reihen', category: 'Social Proof' },
  { type: 'featureShowcase', label: 'Feature-Showcase', description: 'Großbild mit Parallax + Feature-Liste + CTA', category: 'Marketing' },
  { type: 'logoMarquee', label: 'Logo-Marquee', description: 'Endlos-scrollende Partner/Kunden-Logos', category: 'Social Proof' },
  { type: 'shopProductGrid', label: 'Shop: Produkte', description: 'Produktübersicht mit Kategorie-Filter & Suche', category: 'Shop' },
  { type: 'shopProductDetail', label: 'Shop: Produkt-Detail', description: 'Einzelprodukt mit Galerie, Varianten & Warenkorb', category: 'Shop' },
  { type: 'shopCart', label: 'Shop: Warenkorb', description: 'Warenkorb-Übersicht mit Mengen & Coupon', category: 'Shop' },
  { type: 'shopCheckout', label: 'Shop: Checkout', description: 'Multi-Step Kasse (Kontakt, Versand, Zahlung)', category: 'Shop' },
  { type: 'shopThankYou', label: 'Shop: Danke-Seite', description: 'Bestellbestätigung nach Kauf', category: 'Shop' },
  { type: 'shopFeaturedProducts', label: 'Shop: Highlight-Produkte', description: 'Ausgewählte Produkte hervorheben', category: 'Shop' },
  { type: 'verticalTimeline', label: 'Prozess-Timeline', description: 'Vertikale Scroll-Timeline mit nummerierten Steps und Progress-Linie', category: 'Inhalt' },
  { type: 'beforeAfterSlider', label: 'Vorher/Nachher-Slider', description: 'Draggbarer Vergleichs-Slider für zwei Bilder', category: 'Medien' },
  { type: 'horizontalScrollShowcase', label: 'Horizontal-Scroll Showcase', description: 'Sticky Fullscreen-Panels die per Scroll horizontal gleiten', category: 'Marketing' },
  { type: 'productShowcase', label: 'Produkt-Showcase', description: 'Produktkarten-Grid mit Bild, Preis, Badge & Link', category: 'Marketing' },
  { type: 'categoryMosaic', label: 'Kategorie-Mosaik', description: 'Asymmetrisches Bild-Mosaik für Kategorien/Bereiche', category: 'Medien' },
  { type: 'brandShowroom', label: 'Showroom-Banner', description: 'Immersives Full-Width Bild mit Overlay-Highlights & CTA', category: 'Marketing' },
  { type: 'consultationBooking', label: 'Beratungsbuchung', description: 'Service-Auswahl mit Beschreibung & Buchungs-CTA', category: 'Kontakt' },
  { type: 'materialGallery', label: 'Material-Galerie', description: 'Filterbares Grid für Materialien, Farben oder Stoffe', category: 'Medien' },
  { type: 'deliveryTimeline', label: 'Liefer-/Projektablauf', description: 'Visueller Ablauf mit nummerierten Schritten', category: 'Leistungen' },
  { type: 'inspirationGrid', label: 'Inspirations-Grid', description: 'Lifestyle-Bildergalerie mit Hover-Overlay & Links', category: 'Medien' },
  { type: 'beforeAfter', label: 'Vorher/Nachher', description: 'Interaktiver Slider zum Vergleich zweier Bilder', category: 'Medien' },
  { type: 'cinematicHero', label: 'Cinematic Hero', description: 'Fullscreen Premium-Hero mit Parallax, Media, Fakten und CTAs', category: 'Premium' },
  { type: 'spotlightCards', label: 'Spotlight Cards', description: 'Interaktive Premium-Karten mit Hover-Spotlight', category: 'Premium' },
  { type: 'scrollStory', label: 'Scroll Story', description: 'Sticky Storytelling-Sektion mit Progress und Bildkarten', category: 'Premium' },
  { type: 'premiumComparison', label: 'Premium-Vergleich', description: 'Hochwertige Vergleichsmatrix für Pakete, Leistungen oder Angebote', category: 'Premium' },
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

export const CONSULTING_SECTION_TYPES: SectionTypeDefinition[] = [
  { type: 'hero', label: 'Kanzlei-Hero', description: 'Seriöser Hero mit Vertrauenselementen und Erstberatungs-CTA' },
  { type: 'practiceAreas', label: 'Rechtsgebiete', description: 'Grid mit Fachbereichen, Icons und Beschreibungen' },
  { type: 'caseResults', label: 'Erfolgsbilanz', description: 'Animierte Statistiken (gewonnene Fälle, Zufriedenheit etc.)' },
  { type: 'feeTable', label: 'Honorar-Übersicht', description: 'Transparente Kostenübersicht mit Preismodellen' },
  { type: 'publications', label: 'Fachbeiträge', description: 'Blog/News für juristische Fachartikel und Neuigkeiten' },
  { type: 'team', label: 'Anwälte & Team', description: 'Partner, Associates und Mitarbeiter mit Fachgebiet' },
  { type: 'testimonials', label: 'Mandantenstimmen', description: 'Bewertungen und Erfahrungsberichte von Mandanten' },
  { type: 'faq', label: 'FAQ', description: 'Häufige Rechtsfragen und Kanzlei-FAQs' },
  { type: 'contact', label: 'Kontakt', description: 'Kontaktformular mit Rechtsgebiet-Auswahl und Sprechzeiten' },
  { type: 'processSteps', label: 'Beratungsablauf', description: 'Erstgespräch → Strategie → Umsetzung → Abschluss' },
  { type: 'ctaBand', label: 'CTA-Band', description: 'Call-to-Action für Erstberatung' },
  { type: 'stats', label: 'Zahlen & Fakten', description: 'Animierte Kennzahlen der Kanzlei' },
  { type: 'map', label: 'Karte', description: 'Standort der Kanzlei' },
  { type: 'textImage', label: 'Text & Bild', description: 'Zweispaltiger Abschnitt (z.B. Kanzleigeschichte)' },
  { type: 'richText', label: 'HTML-Block', description: 'Eigener HTML-Code (Impressum, Datenschutz etc.)' },
  { type: 'collectionHero', label: 'Collection-Hero', description: 'Blog/Artikel-Hero für Detail-Seiten' },
];

export const REALESTATE_SECTION_TYPES: SectionTypeDefinition[] = [
  { type: 'hero', label: 'Immobilien-Hero', description: 'Premium-Hero mit Overlay, Trust-Elementen und Such-CTA' },
  { type: 'propertyShowcase', label: 'Immobilien-Showcase', description: 'Karten mit Bild, Preis, Fläche, Zimmer und Lage' },
  { type: 'propertySearch', label: 'Immobiliensuche', description: 'Suchformular mit Filtern (Typ, Ort, Preis)' },
  { type: 'marketReport', label: 'Marktbericht', description: 'Regionale Marktdaten, Statistiken und Trends' },
  { type: 'agentTeam', label: 'Makler-Team', description: 'Makler mit Foto, Spezialisierung und Kontakt' },
  { type: 'valuationCta', label: 'Bewertungs-CTA', description: '"Was ist Ihre Immobilie wert?" — Bewertungsanfrage' },
  { type: 'referencesSold', label: 'Erfolgreich vermittelt', description: 'Verkaufte Objekte mit Sold-Badge und Statistiken' },
  { type: 'locationHighlight', label: 'Lage & Umgebung', description: 'Standort-Infos mit POIs (ÖPNV, Schulen, Einkaufen)' },
  { type: 'contact', label: 'Kontakt', description: 'Kontaktformular mit Rückruf-Option' },
  { type: 'faq', label: 'FAQ', description: 'Fragen zu Kauf, Verkauf, Bewertung und Provision' },
  { type: 'testimonials', label: 'Kundenstimmen', description: 'Bewertungen von Käufern und Verkäufern' },
  { type: 'stats', label: 'Zahlen & Fakten', description: 'Vermittelte Objekte, Erfahrung, Vermarktungszeit' },
  { type: 'textImage', label: 'Text & Bild', description: 'Zweispaltiger Abschnitt (z.B. Über uns, Philosophie)' },
  { type: 'richText', label: 'HTML-Block', description: 'Eigener HTML-Code (Impressum, Datenschutz etc.)' },
  { type: 'collectionHero', label: 'Collection-Hero', description: 'Blog/Artikel-Hero für Detail-Seiten' },
];

export const CAFE_SECTION_TYPES: SectionTypeDefinition[] = [
  { type: 'hero', label: 'Café-Hero', description: 'Stimmungsvoller Hero mit Öffnungszeiten-Hinweis' },
  { type: 'drinkMenu', label: 'Getränkekarte', description: 'Kaffee, Cocktails, Wein — Kategorien mit Preisen' },
  { type: 'foodMenu', label: 'Speisekarte', description: 'Kuchen, Snacks, Bowls — Karten mit Bild und Preis' },
  { type: 'atmosphereGallery', label: 'Atmosphäre-Galerie', description: 'Masonry-Grid mit Stimmungsbildern' },
  { type: 'dailySpecials', label: 'Wochenkarte', description: 'Tagesangebote mit Tag-Badge und Preis' },
  { type: 'cafeEventCalendar', label: 'Events', description: 'Live-Musik, Quiz-Night, Weinprobe mit Datum' },
  { type: 'locationVibe', label: 'Standort & Vibes', description: 'Adresse, Öffnungszeiten und Vibe-Text im Split-Layout' },
  { type: 'contact', label: 'Kontakt', description: 'Kontakt-Buttons (Telefon, E-Mail, Adresse)' },
  { type: 'faq', label: 'FAQ', description: 'Häufige Fragen (Reservierung, Hunde, WLAN etc.)' },
  { type: 'testimonials', label: 'Gästestimmen', description: 'Google-Reviews und Bewertungen' },
  { type: 'team', label: 'Team', description: 'Barista-Team und Köche' },
  { type: 'galleryGrid', label: 'Galerie', description: 'Bildergalerie mit Lightbox' },
  { type: 'textImage', label: 'Text & Bild', description: 'Zweispaltiger Abschnitt (z.B. Story, Philosophie)' },
  { type: 'richText', label: 'HTML-Block', description: 'Eigener HTML-Code (Impressum, Datenschutz etc.)' },
  { type: 'collectionHero', label: 'Collection-Hero', description: 'Blog/Artikel-Hero für Detail-Seiten' },
];

export const TATTOO_SECTION_TYPES: SectionTypeDefinition[] = [
  { type: 'hero', label: 'Tattoo-Hero', description: 'Dark Hero mit Neon-Akzent und Booking-CTA' },
  { type: 'styleGallery', label: 'Stil-Galerie', description: 'Filterbares Masonry-Grid nach Tattoo-Stilen' },
  { type: 'artistGrid', label: 'Künstler', description: 'Artist-Karten mit Bild, Stilen und Links' },
  { type: 'artistHero', label: 'Künstler-Detail', description: 'Profil-Header für einzelne Artists' },
  { type: 'tattooBookingCta', label: 'Termin-CTA', description: 'Buchungs-CTA mit Kurzinfos' },
  { type: 'pricingInfo', label: 'Preisübersicht', description: 'Stundensatz, Mindestpreis, Konditionen' },
  { type: 'tattooBooking', label: 'Terminanfrage', description: 'Formular mit Motiv, Stelle, Referenzbild' },
  { type: 'flashDayBanner', label: 'Flash Day', description: 'Ankündigung für Flash-Day Events' },
  { type: 'aftercareSteps', label: 'Pflegeanleitung', description: 'Schritt-für-Schritt Nachsorge' },
  { type: 'galleryGrid', label: 'Galerie', description: 'Bildergalerie mit Lightbox' },
  { type: 'testimonials', label: 'Bewertungen', description: 'Kundenstimmen' },
  { type: 'faq', label: 'FAQ', description: 'Häufige Fragen (Pflege, Schmerz, Preise)' },
  { type: 'processSteps', label: 'Ablauf', description: 'Beratung → Entwurf → Session → Nachsorge' },
  { type: 'team', label: 'Team', description: 'Studio-Team' },
  { type: 'textImage', label: 'Text & Bild', description: 'Zweispaltiger Abschnitt' },
  { type: 'richText', label: 'HTML-Block', description: 'Eigener HTML-Code' },
  { type: 'collectionHero', label: 'Collection-Hero', description: 'Blog/Artikel-Hero für Detail-Seiten' },
];

export const ECOMMERCE_SECTION_TYPES: SectionTypeDefinition[] = [
  { type: 'hero', label: 'Shop-Hero', description: 'Hauptbanner mit Produkthighlight oder Aktion' },
  { type: 'shopProductGrid', label: 'Produkte', description: 'Produktübersicht mit Kategorie-Filter & Suche' },
  { type: 'shopFeaturedProducts', label: 'Highlight-Produkte', description: 'Ausgewählte Produkte hervorheben' },
  { type: 'shopProductDetail', label: 'Produkt-Detail', description: 'Einzelprodukt mit Galerie, Varianten & Warenkorb' },
  { type: 'shopCart', label: 'Warenkorb', description: 'Warenkorb-Übersicht mit Mengen & Coupon' },
  { type: 'shopCheckout', label: 'Checkout', description: 'Multi-Step Kasse (Kontakt, Versand, Zahlung)' },
  { type: 'shopThankYou', label: 'Danke-Seite', description: 'Bestellbestätigung nach Kauf' },
  { type: 'shopCategoryOverview', label: 'Kategorien', description: 'Kategorieübersicht mit Bildern' },
  { type: 'uspStrip', label: 'USP-Leiste', description: 'Versand, Retoure, Zahlung — Vertrauens-Icons' },
  { type: 'ctaBand', label: 'CTA-Band', description: 'Aktionsbanner / Sale-Hinweis' },
  { type: 'testimonials', label: 'Bewertungen', description: 'Kundenstimmen' },
  { type: 'testimonialMarquee', label: 'Bewertungs-Marquee', description: 'Endlos-scrollende Bewertungskarten' },
  { type: 'faq', label: 'FAQ', description: 'Versand, Retoure, Zahlung — Häufige Fragen' },
  { type: 'textImage', label: 'Text & Bild', description: 'Über uns / Markengeschichte' },
  { type: 'contact', label: 'Kontakt', description: 'Kontaktformular' },
  { type: 'logoCloud', label: 'Zahlungsarten / Partner', description: 'Payment-Logos, Trust-Badges' },
  { type: 'newsPreview', label: 'Blog / News', description: 'Aktuelle Beiträge' },
  { type: 'galleryGrid', label: 'Galerie', description: 'Produkt-Lifestyle Bilder' },
  { type: 'team', label: 'Team', description: 'Über das Team' },
  { type: 'richText', label: 'HTML-Block', description: 'Eigener HTML-Code (AGB, Widerruf etc.)' },
  { type: 'legalContent', label: 'Rechtliche Inhalte', description: 'Impressum / Datenschutz / Widerruf' },
  { type: 'collectionHero', label: 'Collection-Hero', description: 'Blog/Artikel-Hero für Detail-Seiten' },
];

export const RETAIL_SECTION_TYPES: SectionTypeDefinition[] = [
  { type: 'hero', label: 'Hero', description: 'Hauptbanner der Seite' },
  { type: 'productShowcase', label: 'Produkt-Showcase', description: 'Produktkarten-Grid mit Bild, Preis, Badge & Link' },
  { type: 'categoryMosaic', label: 'Kategorie-Mosaik', description: 'Asymmetrisches Bild-Mosaik für Bereiche' },
  { type: 'brandShowroom', label: 'Showroom-Banner', description: 'Immersives Bild mit Overlay-Highlights' },
  { type: 'consultationBooking', label: 'Beratungsbuchung', description: 'Service-Auswahl mit Buchungs-CTA' },
  { type: 'materialGallery', label: 'Material-Galerie', description: 'Filterbares Grid für Materialien' },
  { type: 'deliveryTimeline', label: 'Liefer-/Projektablauf', description: 'Visueller Ablauf' },
  { type: 'inspirationGrid', label: 'Inspirations-Grid', description: 'Lifestyle-Bilder mit Hover-Overlay' },
  { type: 'beforeAfter', label: 'Vorher/Nachher', description: 'Interaktiver Vergleichs-Slider' },
  { type: 'uspStrip', label: 'USP-Leiste', description: 'Einzigartige Verkaufsargumente' },
  { type: 'servicesGrid', label: 'Leistungen', description: 'Leistungs-Grid' },
  { type: 'processSteps', label: 'Ablauf', description: 'Prozess-Schritte Timeline' },
  { type: 'testimonials', label: 'Bewertungen', description: 'Kundenstimmen' },
  { type: 'faq', label: 'FAQ', description: 'Häufige Fragen' },
  { type: 'contact', label: 'Kontakt', description: 'Kontaktformular' },
  { type: 'map', label: 'Karte', description: 'Google Maps Einbettung' },
  { type: 'team', label: 'Team', description: 'Team-Mitglieder' },
  { type: 'stats', label: 'Zahlen & Fakten', description: 'Animierte Statistik-Zähler' },
  { type: 'galleryGrid', label: 'Galerie', description: 'Bildergalerie' },
  { type: 'ctaBand', label: 'CTA-Band', description: 'Call-to-Action Banner' },
  { type: 'textImage', label: 'Text & Bild', description: 'Zweispaltiger Abschnitt' },
  { type: 'logoCloud', label: 'Logo-Cloud', description: 'Partner-Logos' },
  { type: 'collectionHero', label: 'Collection-Hero', description: 'Blog/Artikel-Hero für Detail-Seiten' },
];

const ALL_INDUSTRY_SECTIONS: Record<string, SectionTypeDefinition[]> = {
  tradesman: TRADESMAN_SECTION_TYPES,
  photography: PHOTOGRAPHY_SECTION_TYPES,
  consulting: CONSULTING_SECTION_TYPES,
  wedding: WEDDING_SECTION_TYPES,
  medical: MEDICAL_SECTION_TYPES,
  salon: SALON_SECTION_TYPES,
  tourism: TOURISM_SECTION_TYPES,
  hotel: HOTEL_SECTION_TYPES,
  restaurant: RESTAURANT_SECTION_TYPES,
  realestate: REALESTATE_SECTION_TYPES,
  cafe: CAFE_SECTION_TYPES,
  tattoo: TATTOO_SECTION_TYPES,
  ecommerce: ECOMMERCE_SECTION_TYPES,
  retail: RETAIL_SECTION_TYPES,
};

const INDUSTRY_LABELS: Record<string, string> = {
  tradesman: 'Handwerk',
  photography: 'Fotografie',
  consulting: 'Kanzlei & Beratung',
  wedding: 'Hochzeit',
  medical: 'Medizin',
  salon: 'Salon',
  tourism: 'Tourismus',
  hotel: 'Hotel',
  restaurant: 'Restaurant',
  realestate: 'Immobilien',
  cafe: 'Café & Bar',
  tattoo: 'Tattoo Studio',
  ecommerce: 'E-Commerce',
  retail: 'Einzelhandel & Weitere',
};

export function getSectionTypesForIndustry(industry: string, options?: { hasShop?: boolean }): SectionTypeDefinition[] {
  const specific = ALL_INDUSTRY_SECTIONS[industry] ?? TRADESMAN_SECTION_TYPES;

  // Merge: industry-specific first, then shared (skip duplicates)
  const types = new Set(specific.map(s => s.type));
  let shared = SHARED_SECTION_TYPES.filter(s => !types.has(s.type));

  // Hide shop sections if tenant doesn't have shop addon
  if (!options?.hasShop) {
    shared = shared.filter(s => s.category !== 'Shop');
  }

  // Collect foreign sections from other industries
  const foreign: SectionTypeDefinition[] = [];
  for (const [key, sections] of Object.entries(ALL_INDUSTRY_SECTIONS)) {
    if (key === industry) continue;
    for (const s of sections) {
      if (!types.has(s.type) && !shared.some(sh => sh.type === s.type) && !foreign.some(f => f.type === s.type)) {
        foreign.push({ ...s, category: `Andere: ${INDUSTRY_LABELS[key] || key}` });
      }
    }
  }

  return [...specific, ...shared, ...foreign];
}
