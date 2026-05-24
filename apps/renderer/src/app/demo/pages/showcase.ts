import type { DemoSite } from './types';
import { B, HERO } from './types';

/**
 * "Inhalte-Demo" — showcases available section types with example content.
 * This is a special demo that's not tied to any specific industry.
 * It shows customers what sections are available in the CMS.
 */
export const showcaseSite: DemoSite = {
  industry: 'tradesman',
  industryKey: 'showcase',
  defaultStyle: 'classic',
  pages: [
    {
      slug: '',
      title: 'Sektionen-Übersicht',
      sections: [
        {
          ...HERO, id: 'sc-hero', type: 'hero',
          data: {
            headline: 'Sektionen-Galerie',
            subline: 'Entdecken Sie die verfügbaren Inhaltsbausteine für Ihre Website. Jede Sektion kann individuell angepasst, kombiniert und mit Ihren eigenen Inhalten befüllt werden.',
            badgeText: 'Flamingo CMS',
            bgImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1800&q=85',
            primaryCta: { label: 'Sektionen entdecken', href: '#sections' },
          },
        },
        {
          ...B, id: 'sc-intro', type: 'richText',
          data: {
            content: '<h2>Verfügbare Sektionen</h2><p>Flamingo CMS bietet über 80 verschiedene Sektionstypen. Allgemeine Sektionen sind branchenunabhängig nutzbar, dazu kommen spezialisierte Bausteine für jede Branche.</p><p>Klicken Sie auf die Kacheln, um jede Sektion in Aktion zu sehen.</p>',
          },
        },
        {
          ...B, id: 'sc-grid', type: 'servicesGrid',
          data: {
            headline: 'Allgemeine Sektionen',
            subline: 'Diese Bausteine stehen allen Branchen zur Verfügung.',
            badgeText: 'Universell',
            manualCards: [
              { title: 'Hero-Banner', text: 'Großflächige Einstiegssektion mit Bild, Headline und Call-to-Action.', icon: 'layout', mediaType: 'icon' },
              { title: 'USP-Leiste', text: 'Kompakte Darstellung Ihrer Alleinstellungsmerkmale mit Icons.', icon: 'award', mediaType: 'icon' },
              { title: 'Leistungs-Grid', text: 'Kachel-Übersicht Ihrer Angebote mit Bild oder Icon.', icon: 'grid3x3', mediaType: 'icon' },
              { title: 'Text & Bild', text: 'Zweispaltiges Layout mit Text und Bild nebeneinander.', icon: 'columns', mediaType: 'icon' },
              { title: 'Preispakete', text: 'Paket-Vergleich mit Preisen, Features und Highlights.', icon: 'creditCard', mediaType: 'icon' },
              { title: 'Prozess-Schritte', text: 'Nummerierte Schritte mit Icons – ideal für Abläufe.', icon: 'listOrdered', mediaType: 'icon' },
              { title: 'Bewertungen', text: 'Kundenstimmen mit Sternebewertung.', icon: 'star', mediaType: 'icon' },
              { title: 'FAQ', text: 'Akkordeon mit häufigen Fragen und Antworten.', icon: 'helpCircle', mediaType: 'icon' },
              { title: 'CTA-Banner', text: 'Aufruf zur Aktion mit Headline und Button.', icon: 'megaphone', mediaType: 'icon' },
              { title: 'Kontaktformular', text: 'Formular mit Karte und Kontaktinfos.', icon: 'mail', mediaType: 'icon' },
              { title: 'Bildergalerie', text: 'Responsive Bildergalerie mit Lightbox.', icon: 'image', mediaType: 'icon' },
              { title: 'Team', text: 'Teamvorstellung mit Fotos und Rollen.', icon: 'users', mediaType: 'icon' },
              { title: 'Statistiken', text: 'Zahlen und Fakten in animierter Darstellung.', icon: 'barChart', mediaType: 'icon' },
              { title: 'Logo-Cloud', text: 'Partnerlogos und Referenzen.', icon: 'building', mediaType: 'icon' },
              { title: 'Rich Text', text: 'Freier Texteditor mit Formatierungen.', icon: 'fileText', mediaType: 'icon' },
              { title: 'Video-Embed', text: 'YouTube oder Vimeo-Video einbetten.', icon: 'play', mediaType: 'icon' },
              { title: 'Hinweisbanner', text: 'Farbiger Hinweis-Banner.', icon: 'alertTriangle', mediaType: 'icon' },
              { title: 'Header-Banner', text: 'Schmaler Banner mit Text.', icon: 'type', mediaType: 'icon' },
            ],
          },
        },
        {
          ...B, id: 'sc-restaurant', type: 'servicesGrid',
          data: {
            headline: '🍽️ Restaurant & Gastronomie',
            subline: 'Spezialisierte Sektionen für Restaurants, Cafés und Bars.',
            badgeText: 'Gastronomie',
            manualCards: [
              { title: 'Speisekarte', text: 'Kategorisierte Menükarte mit Preisen und Beschreibungen.', icon: 'utensilsCrossed', mediaType: 'icon', href: '/demo/restaurant' },
              { title: 'Reservierung', text: 'Online-Reservierungsformular mit Datumswahl.', icon: 'calendarCheck', mediaType: 'icon', href: '/demo/restaurant' },
              { title: 'Öffnungszeiten', text: 'Übersicht der Öffnungszeiten mit Sonderzeiten.', icon: 'clock', mediaType: 'icon', href: '/demo/restaurant' },
              { title: 'Signature Dishes', text: 'Highlight-Gerichte mit Bildern und Beschreibung.', icon: 'chefHat', mediaType: 'icon', href: '/demo/restaurant' },
              { title: 'Events', text: 'Veranstaltungen und Special-Abende.', icon: 'partyPopper', mediaType: 'icon', href: '/demo/restaurant' },
              { title: 'Ambiente', text: 'Eindrücke und Atmosphäre des Lokals.', icon: 'lamp', mediaType: 'icon', href: '/demo/restaurant' },
              { title: 'Restaurant-Story', text: 'Geschichte und Philosophie des Hauses.', icon: 'book', mediaType: 'icon', href: '/demo/restaurant' },
            ],
          },
        },
        {
          ...B, id: 'sc-hotel', type: 'servicesGrid',
          data: {
            headline: '🏨 Hotel & Unterkunft',
            subline: 'Alles für Hotelwebsites — von Zimmerauswahl bis Wellness.',
            badgeText: 'Hotellerie',
            manualCards: [
              { title: 'Buchungsleiste', text: 'Kompakte Buchungs-CTA im Header.', icon: 'calendarCheck', mediaType: 'icon', href: '/demo/hotel' },
              { title: 'Zimmer-Showcase', text: 'Zimmertypen mit Bildern, Ausstattung und Preisen.', icon: 'bed', mediaType: 'icon', href: '/demo/hotel' },
              { title: 'Angebote', text: 'Saisonale Pakete und Sonderangebote.', icon: 'tag', mediaType: 'icon', href: '/demo/hotel' },
              { title: 'Ausstattung', text: 'Annehmlichkeiten des Hauses im Überblick.', icon: 'sparkles', mediaType: 'icon', href: '/demo/hotel' },
              { title: 'Wellness & Spa', text: 'Wellnessbereich mit Angeboten.', icon: 'heart', mediaType: 'icon', href: '/demo/hotel' },
              { title: 'Restaurant im Haus', text: 'Kulinarisches Angebot des Hotels.', icon: 'utensilsCrossed', mediaType: 'icon', href: '/demo/hotel' },
              { title: 'Veranstaltungsräume', text: 'Räume für Events und Konferenzen.', icon: 'presentation', mediaType: 'icon', href: '/demo/hotel' },
              { title: 'Lage & Umgebung', text: 'Standort und Sehenswürdigkeiten.', icon: 'mapPin', mediaType: 'icon', href: '/demo/hotel' },
            ],
          },
        },
        {
          ...B, id: 'sc-salon', type: 'servicesGrid',
          data: {
            headline: '💇 Salon & Beauty',
            subline: 'Für Friseursalons, Kosmetikstudios und Nagelstudios.',
            badgeText: 'Beauty',
            manualCards: [
              { title: 'Behandlungsmenü', text: 'Leistungen mit Preisen und Dauer.', icon: 'scissors', mediaType: 'icon', href: '/demo/salon' },
              { title: 'Preisliste', text: 'Detaillierte Preisliste aller Leistungen.', icon: 'euro', mediaType: 'icon', href: '/demo/salon' },
              { title: 'Behandlungsdetail', text: 'Einzelne Behandlung mit Ablauf und Bildern.', icon: 'sparkles', mediaType: 'icon', href: '/demo/salon' },
              { title: 'Pakete', text: 'Kombinierte Angebote und Bundles.', icon: 'gift', mediaType: 'icon', href: '/demo/salon' },
              { title: 'Team-Showcase', text: 'Stylisten und Expertinnen im Überblick.', icon: 'users', mediaType: 'icon', href: '/demo/salon' },
              { title: 'Expertise-Grid', text: 'Spezialisierungen und Kompetenzen.', icon: 'grid3x3', mediaType: 'icon', href: '/demo/salon' },
              { title: 'Vorher/Nachher', text: 'Ergebnisse mit Vergleichsbildern.', icon: 'arrowLeftRight', mediaType: 'icon', href: '/demo/salon' },
              { title: 'Termin buchen', text: 'Online-Terminbuchung als CTA.', icon: 'calendar', mediaType: 'icon', href: '/demo/salon' },
            ],
          },
        },
        {
          ...B, id: 'sc-medical', type: 'servicesGrid',
          data: {
            headline: '🏥 Medizin & Praxis',
            subline: 'Speziell für Arztpraxen, Zahnarztpraxen und Kliniken.',
            badgeText: 'Medizin',
            manualCards: [
              { title: 'Leistungsübersicht', text: 'Medizinische Leistungen im Überblick.', icon: 'stethoscope', mediaType: 'icon', href: '/demo/medical' },
              { title: 'Diagnostik', text: 'Diagnostische Verfahren und Geräte.', icon: 'microscope', mediaType: 'icon', href: '/demo/medical' },
              { title: 'Ärzteteam', text: 'Ärzte mit Qualifikationen und Fotos.', icon: 'userCheck', mediaType: 'icon', href: '/demo/medical' },
              { title: 'Praxisteam', text: 'MFAs und Mitarbeiter vorstellen.', icon: 'users', mediaType: 'icon', href: '/demo/medical' },
              { title: 'Zertifizierungen', text: 'Qualitätssiegel und Zertifikate.', icon: 'award', mediaType: 'icon', href: '/demo/medical' },
              { title: 'Patienteninfos', text: 'Infos für Patienten (Erstbesuch, Ablauf).', icon: 'info', mediaType: 'icon', href: '/demo/medical' },
              { title: 'Kasseninfos', text: 'Akzeptierte Versicherungen und Kassen.', icon: 'creditCard', mediaType: 'icon', href: '/demo/medical' },
              { title: 'Notfall-Info', text: 'Notfallnummern und Bereitschaft.', icon: 'alertTriangle', mediaType: 'icon', href: '/demo/medical' },
              { title: 'Termin-CTA', text: 'Online-Terminvereinbarung.', icon: 'calendar', mediaType: 'icon', href: '/demo/medical' },
              { title: 'Download-Formulare', text: 'Anmeldebögen und Aufklärungen als PDF.', icon: 'download', mediaType: 'icon', href: '/demo/medical' },
              { title: 'Geräte-Highlights', text: 'Moderne Ausstattung und Technik.', icon: 'cpu', mediaType: 'icon', href: '/demo/medical' },
              { title: 'Werte-Grid', text: 'Praxisphilosophie und Leitbild.', icon: 'heart', mediaType: 'icon', href: '/demo/medical' },
            ],
          },
        },
        {
          ...B, id: 'sc-tourism', type: 'servicesGrid',
          data: {
            headline: '🏔️ Tourismus & Destination',
            subline: 'Für Tourismusverbände, Regionen und Reiseziele.',
            badgeText: 'Tourismus',
            manualCards: [
              { title: 'Destination-Highlights', text: 'Top-Sehenswürdigkeiten der Region.', icon: 'mountain', mediaType: 'icon', href: '/demo/tourism' },
              { title: 'Erlebnis-Grid', text: 'Aktivitäten und Erlebnisse entdecken.', icon: 'compass', mediaType: 'icon', href: '/demo/tourism' },
              { title: 'Saison-Teaser', text: 'Saisonale Highlights und Empfehlungen.', icon: 'sun', mediaType: 'icon', href: '/demo/tourism' },
              { title: 'Veranstaltungskalender', text: 'Events und Termine in der Region.', icon: 'calendar', mediaType: 'icon', href: '/demo/tourism' },
              { title: 'Interaktive Karte', text: 'Points of Interest auf einer Karte.', icon: 'map', mediaType: 'icon', href: '/demo/tourism' },
              { title: 'Sehenswürdigkeiten-Liste', text: 'Alle Sehenswürdigkeiten mit Details.', icon: 'landmark', mediaType: 'icon', href: '/demo/tourism' },
              { title: 'Wanderrouten', text: 'Touren und Routen mit Schwierigkeitsgrad.', icon: 'route', mediaType: 'icon', href: '/demo/tourism' },
              { title: 'Unterkünfte', text: 'Hotels und Unterkünfte in der Region.', icon: 'bed', mediaType: 'icon', href: '/demo/tourism' },
              { title: 'Besucherinfo', text: 'Praktische Infos für Besucher.', icon: 'info', mediaType: 'icon', href: '/demo/tourism' },
              { title: 'Download-Guides', text: 'Broschüren und Karten zum Download.', icon: 'download', mediaType: 'icon', href: '/demo/tourism' },
            ],
          },
        },
        {
          ...B, id: 'sc-wedding', type: 'servicesGrid',
          data: {
            headline: '💒 Hochzeit',
            subline: 'Alles für die perfekte Hochzeitswebsite.',
            badgeText: 'Wedding',
            manualCards: [
              { title: 'Paar-Story', text: 'Eure Liebesgeschichte als Zeitstrahl.', icon: 'heart', mediaType: 'icon', href: '/demo/wedding/unsere-geschichte' },
              { title: 'Tagesablauf', text: 'Programm und Zeitplan des Hochzeitstags.', icon: 'clock', mediaType: 'icon', href: '/demo/wedding/ablauf' },
              { title: 'Location & Anreise', text: 'Venue-Infos, Karte und Hotelempfehlungen.', icon: 'mapPin', mediaType: 'icon', href: '/demo/wedding/location' },
              { title: 'Hochzeitsmenü', text: 'Menüfolge des Hochzeitsdinner.', icon: 'utensilsCrossed', mediaType: 'icon', href: '/demo/wedding/ablauf' },
              { title: 'Trauzeugen', text: 'Vorstellung der Brautjungfern und Trauzeugen.', icon: 'users', mediaType: 'icon', href: '/demo/wedding/trauzeugen' },
              { title: 'Geschenke', text: 'Wunschliste und Bankverbindung.', icon: 'gift', mediaType: 'icon', href: '/demo/wedding/geschenke' },
              { title: 'Dresscode', text: 'Kleidungsempfehlung mit Farbpalette.', icon: 'shirt', mediaType: 'icon', href: '/demo/wedding/ablauf' },
              { title: 'RSVP', text: 'Online-Zusage mit Formular.', icon: 'mailCheck', mediaType: 'icon', href: '/demo/wedding/rsvp' },
            ],
          },
        },
        {
          ...B, id: 'sc-photo', type: 'servicesGrid',
          data: {
            headline: '📸 Fotografie',
            subline: 'Für Fotografen, Studios und kreative Portfolios.',
            badgeText: 'Fotografie',
            manualCards: [
              { title: 'Portfolio-Galerie', text: 'Bildergalerie im Masonry-Layout.', icon: 'image', mediaType: 'icon', href: '/demo/photography' },
              { title: 'Shooting-Pakete', text: 'Pakete mit Preisen und Leistungen.', icon: 'creditCard', mediaType: 'icon', href: '/demo/photography' },
              { title: 'Über den Fotografen', text: 'Persönliche Vorstellung mit Story.', icon: 'user', mediaType: 'icon', href: '/demo/photography' },
              { title: 'Shooting-Ablauf', text: 'So läuft ein Shooting ab.', icon: 'listOrdered', mediaType: 'icon', href: '/demo/photography' },
            ],
          },
        },
        {
          ...B, id: 'sc-handwerk', type: 'servicesGrid',
          data: {
            headline: '🔧 Handwerk & Meisterbetrieb',
            subline: 'Für Installateure, Elektriker, Dachdecker und mehr.',
            badgeText: 'Handwerk',
            manualCards: [
              { title: 'Notdienst-Banner', text: 'Auffälliger 24/7-Notdienst-Hinweis.', icon: 'alertTriangle', mediaType: 'icon', href: '/demo/handwerk' },
              { title: 'Leistungs-Grid', text: 'Alle Gewerke im Überblick.', icon: 'grid3x3', mediaType: 'icon', href: '/demo/handwerk' },
              { title: 'Prozess-Timeline', text: 'So läuft Ihr Projekt ab.', icon: 'listOrdered', mediaType: 'icon', href: '/demo/handwerk' },
              { title: 'Referenzen-Portfolio', text: 'Abgeschlossene Projekte als Galerie.', icon: 'image', mediaType: 'icon', href: '/demo/handwerk' },
              { title: 'Team-Vorstellung', text: 'Meister und Gesellen mit Qualifikationen.', icon: 'users', mediaType: 'icon', href: '/demo/handwerk' },
              { title: 'Festpreisgarantie', text: 'Trust-Element mit Preisversprechen.', icon: 'shield', mediaType: 'icon', href: '/demo/handwerk' },
              { title: 'Einzugsgebiet', text: 'Karte mit Einsatzradius.', icon: 'mapPin', mediaType: 'icon', href: '/demo/handwerk' },
            ],
          },
        },
        {
          ...B, id: 'sc-consulting', type: 'servicesGrid',
          data: {
            headline: '⚖️ Kanzlei & Beratung',
            subline: 'Für Anwälte, Steuerberater und Unternehmensberater.',
            badgeText: 'Beratung',
            manualCards: [
              { title: 'Fachgebiete', text: 'Rechtsgebiete oder Beratungsfelder im Überblick.', icon: 'scale', mediaType: 'icon', href: '/demo/consulting' },
              { title: 'Anwalts-Team', text: 'Partner und Associates mit Spezialisierung.', icon: 'users', mediaType: 'icon', href: '/demo/consulting' },
              { title: 'Erfolgsbilanz', text: 'Kennzahlen und gewonnene Fälle.', icon: 'barChart', mediaType: 'icon', href: '/demo/consulting' },
              { title: 'Honorarmodelle', text: 'Transparente Kostenübersicht.', icon: 'creditCard', mediaType: 'icon', href: '/demo/consulting' },
              { title: 'Publikationen', text: 'Fachartikel und Veröffentlichungen.', icon: 'book', mediaType: 'icon', href: '/demo/consulting' },
              { title: 'Erstberatung-CTA', text: 'Formular zur kostenlosen Erstberatung.', icon: 'mail', mediaType: 'icon', href: '/demo/consulting/kontakt' },
            ],
          },
        },
        {
          ...B, id: 'sc-realestate', type: 'servicesGrid',
          data: {
            headline: '🏠 Immobilien',
            subline: 'Für Makler, Hausverwaltungen und Immobilienportale.',
            badgeText: 'Immobilien',
            manualCards: [
              { title: 'Objektsuche', text: 'Filterbare Immobiliensuche.', icon: 'search', mediaType: 'icon', href: '/demo/realestate' },
              { title: 'Objekt-Showcase', text: 'Hervorgehobene Immobilien als Karussell.', icon: 'image', mediaType: 'icon', href: '/demo/realestate' },
              { title: 'Wertermittlung-CTA', text: 'Aufruf zur kostenlosen Immobilienbewertung.', icon: 'calculator', mediaType: 'icon', href: '/demo/realestate' },
              { title: 'Objekt-Grid', text: 'Alle Angebote als Karten-Grid.', icon: 'grid3x3', mediaType: 'icon', href: '/demo/realestate' },
              { title: 'Makler-Team', text: 'Maklervorstellung mit Kontaktdaten.', icon: 'users', mediaType: 'icon', href: '/demo/realestate' },
              { title: 'Verkaufte Objekte', text: 'Erfolgreich vermittelte Referenzen.', icon: 'checkCircle', mediaType: 'icon', href: '/demo/realestate' },
              { title: 'Marktbericht', text: 'Aktuelle Zahlen zum lokalen Immobilienmarkt.', icon: 'barChart', mediaType: 'icon', href: '/demo/realestate' },
              { title: 'Standort-Highlight', text: 'Lage und Umgebung attraktiv darstellen.', icon: 'mapPin', mediaType: 'icon', href: '/demo/realestate' },
            ],
          },
        },
        {
          ...B, id: 'sc-cafe', type: 'servicesGrid',
          data: {
            headline: '☕ Café & Bar',
            subline: 'Für Cafés, Cocktailbars und Bistros.',
            badgeText: 'Café',
            manualCards: [
              { title: 'Getränkekarte', text: 'Kaffee-Spezialitäten, Cocktails und mehr.', icon: 'coffee', mediaType: 'icon', href: '/demo/cafe' },
              { title: 'Speisekarte', text: 'Snacks, Kuchen und kleine Gerichte.', icon: 'utensilsCrossed', mediaType: 'icon', href: '/demo/cafe' },
              { title: 'Atmosphäre-Galerie', text: 'Eindrücke des Ambientes.', icon: 'image', mediaType: 'icon', href: '/demo/cafe' },
              { title: 'Events & Workshops', text: 'Barista-Kurse, Tastings und Veranstaltungen.', icon: 'calendar', mediaType: 'icon', href: '/demo/cafe' },
              { title: 'Story', text: 'Die Geschichte hinter dem Café.', icon: 'book', mediaType: 'icon', href: '/demo/cafe' },
              { title: 'Team', text: 'Baristas und Team vorstellen.', icon: 'users', mediaType: 'icon', href: '/demo/cafe' },
              { title: 'Tagesangebote', text: 'Wechselnde Specials und Happy Hour.', icon: 'tag', mediaType: 'icon', href: '/demo/cafe' },
            ],
          },
        },
        {
          ...B, id: 'sc-tattoo', type: 'servicesGrid',
          data: {
            headline: '🖋️ Tattoo Studio',
            subline: 'Für Tattoo-Studios, Piercer und Ink-Artists.',
            badgeText: 'Tattoo',
            manualCards: [
              { title: 'Artist-Grid', text: 'Künstler mit Stilen, Bio und Instagram.', icon: 'users', mediaType: 'icon', href: '/demo/tattoo' },
              { title: 'Style-Galerie', text: 'Masonry-Grid mit Stil-Filter.', icon: 'image', mediaType: 'icon', href: '/demo/tattoo/galerie' },
              { title: 'Booking-Formular', text: 'Terminanfrage mit Motiv-Upload.', icon: 'calendar', mediaType: 'icon', href: '/demo/tattoo/kontakt' },
              { title: 'Flash-Day-Banner', text: 'Event-Ankündigung für Walk-in-Tage.', icon: 'zap', mediaType: 'icon', href: '/demo/tattoo' },
              { title: 'Aftercare-Guide', text: 'Pflege-Schritte nach dem Stechen.', icon: 'heart', mediaType: 'icon', href: '/demo/tattoo/pflege' },
              { title: 'Pricing-Info', text: 'Transparente Preisübersicht.', icon: 'tag', mediaType: 'icon', href: '/demo/tattoo/leistungen' },
            ],
          },
        },
        {
          ...B, id: 'sc-premium', type: 'servicesGrid',
          data: {
            headline: '✨ Premium-Sektionen',
            subline: 'Hochwertige, animierte Sektionen für besondere Auftritte.',
            badgeText: 'Premium',
            manualCards: [
              { title: 'Animierte Zahlen', text: 'Scroll-getriggerte Zähler mit dunklem Hintergrund & Gradient.', icon: 'barChart', mediaType: 'icon' },
              { title: 'Bento-Grid', text: 'Asymmetrisches Feature-Grid mit Hover-Spotlight.', icon: 'grid3x3', mediaType: 'icon' },
              { title: 'Bewertungs-Marquee', text: 'Endlos-scrollende Bewertungskarten in 2 Reihen.', icon: 'star', mediaType: 'icon' },
              { title: 'Feature-Showcase', text: 'Großbild mit Parallax + Feature-Liste + CTA.', icon: 'sparkles', mediaType: 'icon' },
              { title: 'Logo-Marquee', text: 'Endlos-scrollende Partner/Kunden-Logos.', icon: 'building', mediaType: 'icon' },
              { title: 'Vergleichstabelle', text: 'Pakete oder Optionen im Vergleich.', icon: 'columns', mediaType: 'icon' },
              { title: 'Social-Proof-Leiste', text: 'Kompakte Kennzahlen und Bewertungen.', icon: 'award', mediaType: 'icon' },
              { title: 'Zeitleiste', text: 'Chronologischer Verlauf mit Meilensteinen.', icon: 'clock', mediaType: 'icon' },
            ],
          },
        },
        {
          ...B, id: 'sc-realestate', type: 'servicesGrid',
          data: {
            headline: '🏠 Immobilien',
            subline: 'Für Makler, Hausverwaltungen und Immobilienportale.',
            badgeText: 'Immobilien',
            manualCards: [
              { title: 'Objektsuche', text: 'Filterbare Immobiliensuche mit Karte.', icon: 'search', mediaType: 'icon', href: '/demo/realestate' },
              { title: 'Objekt-Karussell', text: 'Hervorgehobene Immobilien als Slider.', icon: 'image', mediaType: 'icon', href: '/demo/realestate' },
              { title: 'Exposé-Seite', text: 'Detailansicht mit Galerie, Fakten & Grundriss.', icon: 'fileText', mediaType: 'icon', href: '/demo/realestate' },
              { title: 'Wertermittlung', text: 'CTA zur kostenlosen Immobilienbewertung.', icon: 'calculator', mediaType: 'icon', href: '/demo/realestate' },
              { title: 'Objekt-Grid', text: 'Alle Angebote als Karten-Grid.', icon: 'grid3x3', mediaType: 'icon', href: '/demo/realestate' },
              { title: 'Makler-Team', text: 'Maklervorstellung mit Kontaktdaten.', icon: 'users', mediaType: 'icon', href: '/demo/realestate' },
              { title: 'Referenzen', text: 'Erfolgreich vermittelte Objekte.', icon: 'checkCircle', mediaType: 'icon', href: '/demo/realestate' },
              { title: 'Marktbericht', text: 'Aktuelle Zahlen zum Immobilienmarkt.', icon: 'barChart', mediaType: 'icon', href: '/demo/realestate' },
            ],
          },
        },
        {
          ...B, id: 'sc-cafe', type: 'servicesGrid',
          data: {
            headline: '☕ Café & Bistro',
            subline: 'Für Cafés, Bäckereien und kleine Gastronomie.',
            badgeText: 'Café',
            manualCards: [
              { title: 'Getränkekarte', text: 'Kaffee-Spezialitäten und Getränke.', icon: 'coffee', mediaType: 'icon', href: '/demo/cafe' },
              { title: 'Speisekarte', text: 'Snacks, Kuchen und kleine Gerichte.', icon: 'utensilsCrossed', mediaType: 'icon', href: '/demo/cafe' },
              { title: 'Unser Space', text: 'Eindrücke des Ambientes mit Galerie.', icon: 'image', mediaType: 'icon', href: '/demo/cafe' },
              { title: 'Events & Workshops', text: 'Barista-Kurse und Veranstaltungen.', icon: 'calendar', mediaType: 'icon', href: '/demo/cafe' },
              { title: 'Über uns', text: 'Die Geschichte hinter dem Café.', icon: 'book', mediaType: 'icon', href: '/demo/cafe' },
              { title: 'Unser Team', text: 'Baristas und Mitarbeiter vorstellen.', icon: 'users', mediaType: 'icon', href: '/demo/cafe' },
              { title: 'Catering', text: 'Catering-Angebote für Events.', icon: 'truck', mediaType: 'icon', href: '/demo/cafe' },
            ],
          },
        },
        {
          ...B, id: 'sc-premium', type: 'servicesGrid',
          data: {
            headline: '✨ Premium-Sektionen',
            subline: 'Hochwertige, animierte Sektionen für besondere Auftritte.',
            badgeText: 'Premium',
            manualCards: [
              { title: 'Animierte Zahlen', text: 'Scroll-getriggerte Zähler mit dunklem Hintergrund & Gradient.', icon: 'barChart', mediaType: 'icon' },
              { title: 'Bento-Grid', text: 'Asymmetrisches Feature-Grid mit Hover-Spotlight.', icon: 'grid3x3', mediaType: 'icon' },
              { title: 'Bewertungs-Marquee', text: 'Endlos-scrollende Bewertungskarten in 2 Reihen.', icon: 'star', mediaType: 'icon' },
              { title: 'Feature-Showcase', text: 'Großbild mit Parallax + Feature-Liste + CTA.', icon: 'sparkles', mediaType: 'icon' },
              { title: 'Logo-Marquee', text: 'Endlos-scrollende Partner/Kunden-Logos.', icon: 'building', mediaType: 'icon' },
              { title: 'Prozess-Timeline', text: 'Vertikale Scroll-Timeline mit animierter Progress-Linie.', icon: 'gitBranch', mediaType: 'icon' },
              { title: 'Vorher/Nachher-Slider', text: 'Draggbarer Vergleichs-Slider für zwei Bilder.', icon: 'columns', mediaType: 'icon' },
              { title: 'Horizontal-Scroll Showcase', text: 'Sticky Fullscreen-Panels die per Scroll horizontal gleiten.', icon: 'arrowRight', mediaType: 'icon' },
            ],
          },
        },
        // Live-Demo: Vertical Timeline
        {
          ...B, id: 'sc-vertical-timeline', type: 'verticalTimeline',
          data: {
            headline: 'Ihr Weg zur neuen Website',
            subline: 'In wenigen Schritten von der Idee zur fertigen Seite.',
            accentColor: '#6366f1',
            steps: [
              { number: '01', timeLabel: 'Tag 1', title: 'Erstgespräch', text: 'Wir lernen Ihren Betrieb und Ihre Ziele kennen.', checkmarks: ['Branche & Wettbewerb', 'Ziele definieren', 'Stil-Auswahl'] },
              { number: '02', timeLabel: 'Tag 2–3', title: 'Konzept & Planung', text: 'Struktur, Inhalte und Design werden festgelegt.', checkmarks: ['Seitenstruktur', 'Inhalte sammeln', 'Farbschema'] },
              { number: '03', timeLabel: 'Tag 4–7', title: 'Aufbau', text: 'Wir richten alles ein und befüllen Ihre Website.', checkmarks: ['Template-Setup', 'Bilder optimieren', 'SEO-Texte'] },
              { number: '04', timeLabel: 'Tag 8', title: 'Review & Launch', text: 'Sie prüfen, geben frei — wir schalten live.', checkmarks: ['Preview-Link', 'Feedback-Runde', 'Domain verbinden'] },
            ],
          },
        },
        // Live-Demo: Before/After Slider
        {
          ...B, id: 'sc-before-after', type: 'beforeAfterSlider',
          data: {
            headline: 'Vorher & Nachher',
            subline: 'Ziehen Sie den Slider um den Unterschied zu sehen.',
            handleColor: '#6366f1',
            slides: [
              { imageBefore: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80', imageAfter: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80', labelBefore: 'Vorher', labelAfter: 'Nachher', caption: 'Komplette Badsanierung in 2 Wochen.' },
              { imageBefore: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&q=80', imageAfter: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80', labelBefore: 'Alt', labelAfter: 'Neu', caption: 'Wohnzimmer-Renovierung mit neuer Raumaufteilung.' },
            ],
          },
        },
        // Live-Demo: Horizontal Scroll Showcase
        {
          ...B, id: 'sc-horizontal-scroll', type: 'horizontalScrollShowcase',
          data: {
            headline: 'Unsere Projekte',
            subline: 'Scrollen Sie durch unsere Referenzen.',
            bgColor: '#09090b',
            textColor: '#ffffff',
            dotColor: '#6366f1',
            panels: [
              { image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=85', title: 'Büro-Umbau München', text: 'Moderne Arbeitsräume auf 400m² — Planung bis Schlüsselübergabe in 6 Wochen.', ctaLabel: 'Projekt ansehen', ctaHref: '#' },
              { image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=85', title: 'Villa Seebruck', text: 'Energetische Sanierung eines historischen Hauses am Chiemsee.', ctaLabel: 'Projekt ansehen', ctaHref: '#' },
              { image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&q=85', title: 'Restaurant Goldberg', text: 'Gastro-Konzept mit offener Küche, Bar und Lounge-Bereich.', ctaLabel: 'Projekt ansehen', ctaHref: '#' },
              { image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1600&q=85', title: 'Penthouse Schwabing', text: 'Luxury Loft mit Dachterrasse und Alpenpanorama.', ctaLabel: 'Projekt ansehen', ctaHref: '#' },
            ],
          },
        },
      ],
    },
  ],
};
