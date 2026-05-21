export type SectionTypeDefinition = {
  type: string;
  label: string;
  description: string;
  category?: string;
};

/**
 * Unified section catalog — all sections are available to all templates.
 * Grouped thematically for easy discovery in the picker modal.
 */
const ALL_SECTIONS: SectionTypeDefinition[] = [
  // ─── Hero & Einstieg ───────────────────────────────────────────────
  { type: 'hero', label: 'Hero', description: 'Fullscreen-Banner mit Bild, Headline und CTA — die erste Sektion jeder Seite.', category: 'Hero & Einstieg' },
  { type: 'collectionHero', label: 'Artikel-Hero', description: 'Kompakter Hero für Blog-/Artikelseiten mit Kategorie und Datum.', category: 'Hero & Einstieg' },
  { type: 'headerBanner', label: 'Hinweis-Leiste', description: 'Schmale Leiste ganz oben für Aktionen, Urlaub oder wichtige Infos.', category: 'Hero & Einstieg' },
  { type: 'noticeBanner', label: 'Hinweis-Banner', description: 'Auffälliger, farbiger Banner für temporäre Ankündigungen (Urlaub, Sale etc.).', category: 'Hero & Einstieg' },

  // ─── Inhalt & Text ─────────────────────────────────────────────────
  { type: 'textImage', label: 'Text & Bild', description: 'Zweispalter mit Fließtext und Bild — vielseitig für Über-uns, Geschichte etc.', category: 'Inhalt & Text' },
  { type: 'freeText', label: 'Freitext', description: 'Formatierter Textblock mit WYSIWYG-Editor, für beliebige Inhalte.', category: 'Inhalt & Text' },
  { type: 'richText', label: 'HTML-Block', description: 'Eigener HTML-Code — ideal für Impressum, Datenschutz, AGB.', category: 'Inhalt & Text' },
  { type: 'legalContent', label: 'Rechtliche Inhalte', description: 'Strukturierte Paragraphen für Impressum & Datenschutz (SEO-optimiert).', category: 'Inhalt & Text' },
  { type: 'timeline', label: 'Zeitleiste', description: 'Chronologischer Verlauf — z.B. Firmengeschichte oder Projekt-Meilensteine.', category: 'Inhalt & Text' },

  // ─── Leistungen & Angebote ─────────────────────────────────────────
  { type: 'servicesGrid', label: 'Leistungs-Grid', description: 'Kacheln mit Icon, Bild und Text — für Leistungen, Behandlungen, Angebote.', category: 'Leistungen & Angebote' },
  { type: 'serviceDetail', label: 'Leistungs-Detail', description: 'Ausführliche Einzelbeschreibung einer Leistung mit USPs und CTA.', category: 'Leistungen & Angebote' },
  { type: 'servicePackages', label: 'Pakete & Preise', description: 'Preistabelle mit Paketen, Features und Highlight-Option — für Fotografen, Berater etc.', category: 'Leistungen & Angebote' },
  { type: 'processSteps', label: 'Ablauf / Prozess', description: 'Schritte-Timeline: Anfrage → Beratung → Umsetzung → Ergebnis.', category: 'Leistungen & Angebote' },
  { type: 'priceList', label: 'Preisliste', description: 'Kategorisierte Preis-/Behandlungsliste mit Dauer und Hinweisen.', category: 'Leistungen & Angebote' },
  { type: 'comparisonTable', label: 'Vergleichstabelle', description: 'Optionen/Pakete nebeneinander vergleichen (Checkmarks, Preise).', category: 'Leistungen & Angebote' },
  { type: 'practiceAreas', label: 'Fachgebiete / Bereiche', description: 'Grid mit Fachbereichen und Icons — für Kanzleien, Praxen, Agenturen.', category: 'Leistungen & Angebote' },
  { type: 'feeTable', label: 'Honorar / Kosten', description: 'Transparente Kostenübersicht mit verschiedenen Preismodellen.', category: 'Leistungen & Angebote' },

  // ─── Marketing & CTA ───────────────────────────────────────────────
  { type: 'ctaBand', label: 'CTA-Band', description: 'Farbiger Call-to-Action-Streifen mit Headline und Button — ideal zwischen Sektionen.', category: 'Marketing & CTA' },
  { type: 'ctaLinks', label: 'CTA-Links', description: 'Mehrere Button-Links nebeneinander zu Unterseiten oder Aktionen.', category: 'Marketing & CTA' },
  { type: 'uspStrip', label: 'USP-Leiste', description: 'Kompakte Reihe mit Stärken/Alleinstellungsmerkmalen (Icon + Kurztext).', category: 'Marketing & CTA' },
  { type: 'stats', label: 'Zahlen & Fakten', description: 'Animierte Statistik-Counter (z.B. "500+ Projekte", "20 Jahre").', category: 'Marketing & CTA' },
  { type: 'caseResults', label: 'Erfolgsbilanz', description: 'Kennzahlen und Erfolge prominent darstellen — für Kanzleien, Agenturen.', category: 'Marketing & CTA' },
  { type: 'logoCloud', label: 'Logo-Cloud', description: 'Partner-, Kunden- oder Zertifikats-Logos in einer Reihe.', category: 'Marketing & CTA' },
  { type: 'bookingCta', label: 'Buchungs-CTA', description: 'Prominenter Buchungsaufruf mit Online-Link, Telefon und WhatsApp.', category: 'Marketing & CTA' },
  { type: 'offers', label: 'Angebote / Specials', description: 'Saisonale Pakete, Arrangements oder Aktionsangebote.', category: 'Marketing & CTA' },

  // ─── Social Proof ──────────────────────────────────────────────────
  { type: 'testimonials', label: 'Bewertungen / Stimmen', description: 'Kundenstimmen mit Zitat, Name, Kontext und Sterne-Rating.', category: 'Social Proof' },
  { type: 'faq', label: 'FAQ', description: 'Aufklappbare Fragen & Antworten — senkt Rückfragen, stärkt SEO.', category: 'Social Proof' },
  { type: 'socialProofBar', label: 'Social-Proof-Leiste', description: 'Kompakte Zeile mit Rating-Badge, Anzahl Bewertungen, Auszeichnungen.', category: 'Social Proof' },
  { type: 'certifications', label: 'Zertifikate & Auszeichnungen', description: 'Qualifikationen, Mitgliedschaften und Qualitätsstandards zeigen.', category: 'Social Proof' },

  // ─── Team & Personen ───────────────────────────────────────────────
  { type: 'team', label: 'Team-Grid', description: 'Mitarbeiter mit Foto, Rolle und Kontaktinfo — universell einsetzbar.', category: 'Team & Personen' },
  { type: 'doctorTeam', label: 'Ärzteteam', description: 'Ärzte mit Fachgebiet, Sprachen und Lebenslauf — für Praxen.', category: 'Team & Personen' },
  { type: 'practiceTeam', label: 'Praxisteam / Empfang', description: 'MFA, Assistenz und Empfangsteam vorstellen.', category: 'Team & Personen' },
  { type: 'teamShowcase', label: 'Team-Showcase (Salon)', description: 'Stylisten/Experten mit Spezialisierung und Buchungsoption.', category: 'Team & Personen' },
  { type: 'photographerAbout', label: 'Über mich (Personal Brand)', description: 'Persönliche Vorstellung mit Geschichte, Werten und Bild — für Solo-Selbstständige.', category: 'Team & Personen' },
  { type: 'weddingParty', label: 'Trauzeugen / Brautjungfern', description: 'Personen der Hochzeitsgesellschaft vorstellen.', category: 'Team & Personen' },

  // ─── Medien & Galerie ──────────────────────────────────────────────
  { type: 'galleryGrid', label: 'Bildergalerie', description: 'Responsive Grid mit Lightbox — für Projekte, Räume, Ergebnisse.', category: 'Medien & Galerie' },
  { type: 'gallery', label: 'Galerie (mit Kategorien)', description: 'Galerie mit Filterkategorien und Captions — Hotels, Salons, Praxen.', category: 'Medien & Galerie' },
  { type: 'portfolioGallery', label: 'Portfolio-Galerie', description: 'Filterbare Masonry-Galerie — ideal für Fotografen und Kreative.', category: 'Medien & Galerie' },
  { type: 'portfolio', label: 'Referenzprojekte', description: 'Projekt-Karten mit Bild, Beschreibung und Tags.', category: 'Medien & Galerie' },
  { type: 'beforeAfter', label: 'Vorher / Nachher', description: 'Bildpaare für Transformationen — Salon, Handwerk, Renovierung.', category: 'Medien & Galerie' },
  { type: 'videoEmbed', label: 'Video', description: 'YouTube- oder Vimeo-Video einbetten mit optionalem Text.', category: 'Medien & Galerie' },
  { type: 'practiceGallery', label: 'Praxis-/Raumgalerie', description: 'Räume und Ausstattung zeigen — für Praxen, Studios, Hotels.', category: 'Medien & Galerie' },

  // ─── News & Publikationen ──────────────────────────────────────────
  { type: 'newsPreview', label: 'News-Vorschau', description: 'Die neuesten 3 Beiträge als Teaser-Karten auf der Startseite.', category: 'News & Publikationen' },
  { type: 'newsGrid', label: 'News-Grid', description: 'Alle Beiträge als Grid — für die News-Übersichtsseite.', category: 'News & Publikationen' },
  { type: 'publications', label: 'Fachartikel / Blog', description: 'Publikationen mit Datum, Kategorie und Bild — für Experten-Positionierung.', category: 'News & Publikationen' },

  // ─── Gastronomie & Hotellerie ──────────────────────────────────────
  { type: 'menu', label: 'Speisekarte', description: 'Vollständige Menükarte mit Kategorien, Preisen, Allergenen und Tags.', category: 'Gastronomie & Hotellerie' },
  { type: 'signatureDishes', label: 'Signature-Gerichte', description: 'Empfehlungen des Hauses als große Bildkarten mit Beschreibung.', category: 'Gastronomie & Hotellerie' },
  { type: 'reservation', label: 'Reservierung', description: 'Reservierungs-CTA mit Hinweistext, Telefon und Buchungslink.', category: 'Gastronomie & Hotellerie' },
  { type: 'openingHours', label: 'Öffnungszeiten', description: 'Tage, Uhrzeiten, Küchenzeiten, Ruhetage und Feiertags-Hinweis.', category: 'Gastronomie & Hotellerie' },
  { type: 'ambience', label: 'Ambiente / Räumlichkeiten', description: 'Atmosphäre mit Bildern und Highlights — Restaurant, Hotel, Eventlocation.', category: 'Gastronomie & Hotellerie' },
  { type: 'events', label: 'Events & Veranstaltungen', description: 'Wiederkehrende Events mit Datum, Preis und Buchungs-CTA.', category: 'Gastronomie & Hotellerie' },
  { type: 'hotelDining', label: 'Restaurant & Bar (Hotel)', description: 'Frühstück, Halbpension, Bar-Angebot im Hotelkontext.', category: 'Gastronomie & Hotellerie' },
  { type: 'bookingStrip', label: 'Buchungsleiste', description: 'Kompakte Buchungsmaske: Anreise, Abreise, Gäste, Buchen-Button.', category: 'Gastronomie & Hotellerie' },
  { type: 'roomShowcase', label: 'Zimmer-Showcase', description: 'Zimmerkategorien mit Bildern, Ausstattung, Preisen und CTA.', category: 'Gastronomie & Hotellerie' },
  { type: 'wellness', label: 'Wellness & Spa', description: 'Treatments, Spa-Bereich und Wellness-Highlights.', category: 'Gastronomie & Hotellerie' },
  { type: 'eventSpaces', label: 'Tagungsräume / Events', description: 'Räume mit Kapazitäten, Technik und Anfrage-CTA.', category: 'Gastronomie & Hotellerie' },
  { type: 'weddingMenu', label: 'Hochzeitsmenü', description: 'Mehrgängiges Menü für die Hochzeitsfeier.', category: 'Gastronomie & Hotellerie' },

  // ─── Tourismus & Erlebnisse ────────────────────────────────────────
  { type: 'destinationHighlights', label: 'Destination-Highlights', description: 'Top-Orte und Naturattraktionen einer Region.', category: 'Tourismus & Erlebnisse' },
  { type: 'experienceGrid', label: 'Erlebnisse / Aktivitäten', description: 'Aktivitäten mit Dauer, Schwierigkeit und Preis.', category: 'Tourismus & Erlebnisse' },
  { type: 'seasonTeaser', label: 'Saison-Teaser', description: 'Saisonale Highlights und Angebote nach Jahreszeit.', category: 'Tourismus & Erlebnisse' },
  { type: 'eventsCalendar', label: 'Veranstaltungskalender', description: 'Events mit Datum, Ort, Kategorie und Ticketpreis.', category: 'Tourismus & Erlebnisse' },
  { type: 'placesMap', label: 'Orte & Karte', description: 'Interaktive Karte mit POIs, Distanzen und Adressen.', category: 'Tourismus & Erlebnisse' },
  { type: 'sightseeingList', label: 'Sehenswürdigkeiten', description: 'Museen, Aussichtspunkte und Attraktionen als Liste.', category: 'Tourismus & Erlebnisse' },
  { type: 'tourRoutes', label: 'Routen & Touren', description: 'Wander-/Radrouten mit Länge, Dauer und Schwierigkeit.', category: 'Tourismus & Erlebnisse' },
  { type: 'accommodationGrid', label: 'Unterkünfte', description: 'Hotels, Pensionen und Ferienwohnungen einer Region.', category: 'Tourismus & Erlebnisse' },
  { type: 'downloadGuides', label: 'Downloads / Karten', description: 'PDF-Guides, Wanderkarten und Broschüren zum Herunterladen.', category: 'Tourismus & Erlebnisse' },

  // ─── Medizin & Gesundheit ──────────────────────────────────────────
  { type: 'serviceOverview', label: 'Leistungsübersicht (Praxis)', description: 'Behandlungen, Sprechstunden und Spezialisierungen einer Praxis.', category: 'Medizin & Gesundheit' },
  { type: 'treatmentDetail', label: 'Behandlungs-Detail', description: 'Einzelne Behandlung mit Ablauf, Dauer und Hinweisen.', category: 'Medizin & Gesundheit' },
  { type: 'diagnostics', label: 'Diagnostik', description: 'Untersuchungsmethoden und deren Nutzen für Patienten.', category: 'Medizin & Gesundheit' },
  { type: 'patientInfo', label: 'Patienten-Info', description: 'Was mitbringen, wie vorbereiten, Ablauf beim Erstbesuch.', category: 'Medizin & Gesundheit' },
  { type: 'insuranceInfo', label: 'Kassen & Privat', description: 'Welche Versicherungen akzeptiert werden, IGeL-Leistungen.', category: 'Medizin & Gesundheit' },
  { type: 'downloadForms', label: 'Formulare / Downloads', description: 'Anamnesebogen, Einwilligungen und Infoblätter.', category: 'Medizin & Gesundheit' },
  { type: 'emergencyInfo', label: 'Notfall-Hinweise', description: 'Akutfall-Infos, Bereitschaftsdienst-Telefon, ärztlicher Notdienst.', category: 'Medizin & Gesundheit' },
  { type: 'appointmentCta', label: 'Termin-CTA', description: 'Online-Terminbuchung mit Telefon-Fallback und Rückrufbitte.', category: 'Medizin & Gesundheit' },
  { type: 'equipmentHighlights', label: 'Ausstattung / Geräte', description: 'Medizinische Geräte und Technik mit Patientennutzen.', category: 'Medizin & Gesundheit' },
  { type: 'valuesGrid', label: 'Praxis-Werte', description: 'Haltung und Versorgungsanspruch der Praxis kommunizieren.', category: 'Medizin & Gesundheit' },

  // ─── Salon & Beauty ────────────────────────────────────────────────
  { type: 'serviceMenu', label: 'Service-Menü (Salon)', description: 'Behandlungskategorien mit Beschreibung und Preisspanne.', category: 'Salon & Beauty' },
  { type: 'packages', label: 'Pakete & Specials (Salon)', description: 'Kombi-Angebote, Gutscheine und saisonale Specials.', category: 'Salon & Beauty' },
  { type: 'expertiseGrid', label: 'Expertise / Marken', description: 'Zertifizierungen, verwendete Marken und Skills.', category: 'Salon & Beauty' },

  // ─── Hochzeit ──────────────────────────────────────────────────────
  { type: 'coupleStory', label: 'Unsere Geschichte', description: 'Timeline mit Kennenlernen, Verlobung und Meilensteinen.', category: 'Hochzeit' },
  { type: 'eventSchedule', label: 'Tagesablauf', description: 'Zeitplan des Hochzeitstags mit Icons und Orten.', category: 'Hochzeit' },
  { type: 'venueInfo', label: 'Location-Info', description: 'Veranstaltungsort mit Bildern, Karte und Beschreibung.', category: 'Hochzeit' },
  { type: 'travelInfo', label: 'Anreise & Hotels', description: 'Anfahrtsbeschreibung und Hotelempfehlungen für Gäste.', category: 'Hochzeit' },
  { type: 'giftRegistry', label: 'Geschenkewünsche', description: 'Wunschliste oder Bankverbindung für Geldgeschenke.', category: 'Hochzeit' },
  { type: 'dresscode', label: 'Dresscode', description: "Kleidungsempfehlung mit Farbpalette und Do's/Don'ts.", category: 'Hochzeit' },
  { type: 'rsvp', label: 'RSVP / Zusage', description: 'Anmelde-Formular für Hochzeitsgäste.', category: 'Hochzeit' },

  // ─── Fotografie ────────────────────────────────────────────────────
  { type: 'shootingProcess', label: 'Shooting-Ablauf', description: 'Schritte vom Kennenlernen über den Shooting-Tag bis zur Galerie.', category: 'Fotografie' },

  // ─── Kontakt & Standort ────────────────────────────────────────────
  { type: 'contact', label: 'Kontaktformular', description: 'Standard-Kontaktformular mit Nachricht, E-Mail und optionalen Feldern.', category: 'Kontakt & Standort' },
  { type: 'locationContact', label: 'Kontakt & Anfahrt', description: 'Adresse, Karte, Öffnungszeiten und Kontaktformular kombiniert.', category: 'Kontakt & Standort' },
  { type: 'tourismContact', label: 'Tourismus-Kontakt', description: 'Tourismusbüro mit Öffnungszeiten, Formular und Info-Material.', category: 'Kontakt & Standort' },
  { type: 'map', label: 'Karte', description: 'Google Maps Einbettung mit Standortmarker.', category: 'Kontakt & Standort' },
  { type: 'location', label: 'Lage & Anreise', description: 'Adresse, Anfahrtsbeschreibung (Auto/Bahn/Flug) und Umgebungsinfos.', category: 'Kontakt & Standort' },
  { type: 'visitorInfo', label: 'Besucher-Info', description: 'Parken, ÖPNV, Barrierefreiheit und praktische Hinweise.', category: 'Kontakt & Standort' },

  // ─── Einbettungen & Extras ─────────────────────────────────────────
  { type: 'embed', label: 'Embed / Integration', description: 'Externe Widgets einbinden: Buchungstool, Bewertungsportal, Kalender.', category: 'Einbettungen & Extras' },
];

/**
 * Returns all available section types with thematic categories.
 * All sections work with all templates — the industry parameter is kept
 * for API compatibility but no longer filters the list.
 */
export function getSectionTypesForIndustry(_industry: string): SectionTypeDefinition[] {
  return ALL_SECTIONS;
}
