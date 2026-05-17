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
      ],
    },
  ],
};
