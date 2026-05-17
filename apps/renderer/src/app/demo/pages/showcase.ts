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
              { title: 'Hero-Banner', text: 'Großflächige Einstiegssektion mit Bild, Headline und Call-to-Action.', icon: 'layout', mediaType: 'icon', href: '/demo/showcase/hero-banner' },
              { title: 'USP-Leiste', text: 'Kompakte Darstellung Ihrer Alleinstellungsmerkmale mit Icons.', icon: 'award', mediaType: 'icon', href: '/demo/showcase/usp-leiste' },
              { title: 'Leistungs-Grid', text: 'Kachel-Übersicht Ihrer Angebote mit Bild oder Icon.', icon: 'grid3x3', mediaType: 'icon', href: '/demo/showcase/leistungs-grid' },
              { title: 'Text & Bild', text: 'Zweispaltiges Layout mit Text und Bild nebeneinander.', icon: 'columns', mediaType: 'icon', href: '/demo/showcase/text-bild' },
              { title: 'Preispakete', text: 'Paket-Vergleich mit Preisen, Features und Highlights.', icon: 'creditCard', mediaType: 'icon', href: '/demo/showcase/preispakete' },
              { title: 'Prozess-Schritte', text: 'Nummerierte Schritte mit Icons – ideal für Abläufe.', icon: 'listOrdered', mediaType: 'icon', href: '/demo/showcase/prozess-schritte' },
              { title: 'Bewertungen', text: 'Kundenstimmen mit Sternebewertung.', icon: 'star', mediaType: 'icon', href: '/demo/showcase/bewertungen' },
              { title: 'FAQ', text: 'Akkordeon mit häufigen Fragen und Antworten.', icon: 'helpCircle', mediaType: 'icon', href: '/demo/showcase/faq' },
              { title: 'CTA-Banner', text: 'Aufruf zur Aktion mit Headline und Button.', icon: 'megaphone', mediaType: 'icon', href: '/demo/showcase/cta-banner' },
              { title: 'Kontaktformular', text: 'Formular mit Karte und Kontaktinfos.', icon: 'mail', mediaType: 'icon', href: '/demo/showcase/kontakt' },
              { title: 'Bildergalerie', text: 'Responsive Bildergalerie mit Lightbox.', icon: 'image', mediaType: 'icon', href: '/demo/showcase/galerie' },
              { title: 'Team', text: 'Teamvorstellung mit Fotos und Rollen.', icon: 'users', mediaType: 'icon', href: '/demo/showcase/team' },
              { title: 'Statistiken', text: 'Zahlen und Fakten in animierter Darstellung.', icon: 'barChart', mediaType: 'icon', href: '/demo/showcase/statistiken' },
              { title: 'Logo-Cloud', text: 'Partnerlogos und Referenzen.', icon: 'building', mediaType: 'icon', href: '/demo/showcase/logo-cloud' },
              { title: 'Rich Text', text: 'Freier Texteditor mit Formatierungen.', icon: 'fileText', mediaType: 'icon', href: '/demo/showcase/rich-text' },
              { title: 'Video-Embed', text: 'YouTube oder Vimeo-Video einbetten.', icon: 'play', mediaType: 'icon', href: '/demo/showcase/video' },
              { title: 'Hinweisbanner', text: 'Farbiger Hinweis-Banner.', icon: 'alertTriangle', mediaType: 'icon', href: '/demo/showcase/hinweisbanner' },
              { title: 'Header-Banner', text: 'Schmaler Banner mit Text.', icon: 'type', mediaType: 'icon', href: '/demo/showcase/header-banner' },
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
    // ── Detail pages for each section type ──
    {
      slug: 'hero-banner',
      title: 'Hero-Banner',
      sections: [
        {
          ...HERO, id: 'sc-hero-demo', type: 'hero',
          data: {
            headline: 'Willkommen bei Muster GmbH',
            subline: 'Ihr zuverlässiger Partner für hochwertige Handwerksarbeit seit 1985. Qualität, die man sieht — und spürt.',
            badgeText: 'Meisterbetrieb seit 1985',
            bgImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1800&q=85',
            trustItems: ['20+ Jahre Erfahrung', 'Über 500 Projekte', '100% Kundenzufriedenheit'],
            primaryCta: { label: 'Kostenlos anfragen', href: '#' },
            secondaryCta: { label: 'Unsere Leistungen', href: '#' },
          },
        },
        {
          ...B, id: 'sc-hero-info', type: 'richText',
          data: { content: '<h3>Hero-Banner</h3><p>Die Hero-Sektion ist das erste, was Besucher sehen. Sie besteht aus einem großflächigen Hintergrundbild, einer Headline, Subline, optionalem Badge-Text, Trust-Items und bis zu zwei Call-to-Action-Buttons. Ideal als Einstieg auf jeder Seite.</p>' },
        },
      ],
    },
    {
      slug: 'usp-leiste',
      title: 'USP-Leiste',
      sections: [
        {
          ...HERO, id: 'sc-usp-hero', type: 'hero',
          data: { headline: 'USP-Leiste', subline: 'Kompakte Darstellung Ihrer Alleinstellungsmerkmale.', bgImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1800&q=85' },
        },
        {
          ...B, id: 'sc-usp-demo', type: 'uspStrip',
          data: {
            items: [
              { icon: 'shield', title: '10 Jahre Garantie', text: 'Auf alle unsere Arbeiten.' },
              { icon: 'clock', title: 'Schnelle Umsetzung', text: 'Innerhalb von 48 Stunden vor Ort.' },
              { icon: 'award', title: 'Meisterbetrieb', text: 'Zertifizierte Qualität.' },
              { icon: 'heart', title: 'Familienunternehmen', text: 'Persönlich und nahbar.' },
            ],
          },
        },
        {
          ...B, id: 'sc-usp-info', type: 'richText',
          data: { content: '<h3>USP-Leiste</h3><p>Zeigt 3-6 Alleinstellungsmerkmale in einer kompakten Reihe mit Icons und kurzem Text. Perfekt direkt unter dem Hero-Banner oder zwischen anderen Sektionen als visueller Trenner.</p>' },
        },
      ],
    },
    {
      slug: 'leistungs-grid',
      title: 'Leistungs-Grid',
      sections: [
        {
          ...HERO, id: 'sc-grid-hero', type: 'hero',
          data: { headline: 'Leistungs-Grid', subline: 'Kachel-Übersicht Ihrer Angebote.', bgImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1800&q=85' },
        },
        {
          ...B, id: 'sc-grid-demo', type: 'servicesGrid',
          data: {
            headline: 'Unsere Leistungen',
            subline: 'Von der Beratung bis zur Umsetzung — alles aus einer Hand.',
            badgeText: 'Leistungen',
            manualCards: [
              { title: 'Badezimmer-Sanierung', text: 'Komplettumbau vom alten Bad zum Wohlfühl-Bad.', icon: 'bath', mediaType: 'icon' },
              { title: 'Heizungsmodernisierung', text: 'Effiziente Heizsysteme für weniger Energiekosten.', icon: 'thermometer', mediaType: 'icon' },
              { title: 'Rohrinstallation', text: 'Neuinstallation und Reparatur aller Rohrsysteme.', icon: 'wrench', mediaType: 'icon' },
              { title: 'Notdienst 24/7', text: 'Bei Rohrbruch sofort zur Stelle — Tag und Nacht.', icon: 'phone', mediaType: 'icon' },
              { title: 'Wartungsverträge', text: 'Regelmäßige Wartung für sorgenfreien Betrieb.', icon: 'calendar', mediaType: 'icon' },
              { title: 'Energieberatung', text: 'Individuell beraten für maximale Effizienz.', icon: 'leaf', mediaType: 'icon' },
            ],
          },
        },
        {
          ...B, id: 'sc-grid-info', type: 'richText',
          data: { content: '<h3>Leistungs-Grid</h3><p>Zeigt Ihre Angebote als Kacheln mit Icon oder Bild, Titel und Kurztext. Jede Kachel kann auf eine Detailseite verlinken. Ideal für Dienstleistungsübersichten, Produktkategorien oder Angebotsbereiche.</p>' },
        },
      ],
    },
    {
      slug: 'text-bild',
      title: 'Text & Bild',
      sections: [
        {
          ...HERO, id: 'sc-ti-hero', type: 'hero',
          data: { headline: 'Text & Bild', subline: 'Zweispaltiges Layout mit Text und Bild.', bgImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1800&q=85' },
        },
        {
          ...B, id: 'sc-ti-demo1', type: 'textImage',
          data: {
            headline: 'Tradition trifft Innovation',
            text: '<p>Seit über 30 Jahren verbinden wir traditionelles Handwerk mit moderner Technik. Unser Team aus 12 Meistern und Gesellen bringt Erfahrung und frische Ideen in jedes Projekt.</p><p>Von der ersten Beratung bis zur finalen Abnahme sind wir persönlich für Sie da — verlässlich, pünktlich und mit einem Auge fürs Detail.</p>',
            image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
            imagePosition: 'right',
          },
        },
        {
          ...B, id: 'sc-ti-demo2', type: 'textImage',
          data: {
            headline: 'Nachhaltigkeit als Prinzip',
            text: '<p>Wir setzen konsequent auf nachhaltige Materialien und energieeffiziente Lösungen. Gut für die Umwelt, gut für Ihren Geldbeutel — und gut fürs Gewissen.</p>',
            image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
            imagePosition: 'left',
          },
        },
        {
          ...B, id: 'sc-ti-info', type: 'richText',
          data: { content: '<h3>Text & Bild</h3><p>Zweispaltiges Layout mit Text auf einer Seite und einem Bild auf der anderen. Die Bildposition (links/rechts) ist frei wählbar. Mehrere Text-Bild-Sektionen hintereinander erzeugen einen abwechslungsreichen, rhythmischen Seitenaufbau.</p>' },
        },
      ],
    },
    {
      slug: 'preispakete',
      title: 'Preispakete',
      sections: [
        {
          ...HERO, id: 'sc-pkg-hero', type: 'hero',
          data: { headline: 'Preispakete', subline: 'Paketvergleich mit Preisen und Features.', bgImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1800&q=85' },
        },
        {
          ...B, id: 'sc-pkg-demo', type: 'servicePackages',
          data: {
            badge: 'Pakete',
            headline: 'Unsere Wartungspakete',
            subline: 'Wählen Sie das passende Paket für Ihren Bedarf.',
            packages: [
              { name: 'Basis', price: '29€/Monat', description: 'Für Einsteiger.', features: ['Jährliche Inspektion', 'Telefon-Support', 'Notdienst (Werktage)'], ctaLabel: 'Wählen', ctaHref: '#' },
              { name: 'Premium', price: '59€/Monat', highlighted: true, description: 'Unser Bestseller.', features: ['Halbjährliche Inspektion', '24/7 Telefon-Support', 'Notdienst inkl.', 'Ersatzteile inklusive', '10% Rabatt auf Zusatzarbeiten'], ctaLabel: 'Wählen', ctaHref: '#' },
              { name: 'Enterprise', price: 'Auf Anfrage', description: 'Für Gewerbekunden.', features: ['Monatliche Inspektion', 'Dedizierter Ansprechpartner', '24/7 Notdienst', 'Alle Ersatzteile inkl.', 'SLA-Vertrag', 'Mengenrabatte'], ctaLabel: 'Kontakt', ctaHref: '#' },
            ],
            note: 'Alle Preise zzgl. MwSt. Mindestlaufzeit 12 Monate.',
          },
        },
        {
          ...B, id: 'sc-pkg-info', type: 'richText',
          data: { content: '<h3>Preispakete</h3><p>Perfekt für Paketvergleiche, Preisübersichten und Abo-Modelle. Ein Paket kann als „highlighted" markiert werden (z.B. der Bestseller). Jedes Paket hat Name, Preis, Features-Liste und einen CTA-Button.</p>' },
        },
      ],
    },
    {
      slug: 'prozess-schritte',
      title: 'Prozess-Schritte',
      sections: [
        {
          ...HERO, id: 'sc-proc-hero', type: 'hero',
          data: { headline: 'Prozess-Schritte', subline: 'Nummerierte Schritte für Abläufe.', bgImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1800&q=85' },
        },
        {
          ...B, id: 'sc-proc-demo', type: 'processSteps',
          data: {
            headline: 'So läuft Ihr Projekt ab',
            subline: 'Von der Anfrage bis zur Fertigstellung — transparent und planbar.',
            badgeText: 'In 5 Schritten',
            steps: [
              { icon: 'phone', title: 'Erstgespräch', text: 'Kostenlose Beratung bei Ihnen vor Ort. Wir nehmen Ihre Wünsche auf und machen uns ein Bild.' },
              { icon: 'fileText', title: 'Angebot', text: 'Innerhalb von 3 Werktagen erhalten Sie ein transparentes Festpreisangebot — ohne versteckte Kosten.' },
              { icon: 'calendar', title: 'Terminplanung', text: 'Wir stimmen den Zeitplan ab und koordinieren alle Gewerke.' },
              { icon: 'hammer', title: 'Umsetzung', text: 'Unser Team führt die Arbeiten sauber, pünktlich und mit höchster Sorgfalt aus.' },
              { icon: 'checkCircle', title: 'Abnahme', text: 'Gemeinsame Endkontrolle. Erst wenn Sie zufrieden sind, ist das Projekt abgeschlossen.' },
            ],
          },
        },
        {
          ...B, id: 'sc-proc-info', type: 'richText',
          data: { content: '<h3>Prozess-Schritte</h3><p>Nummerierte Schritte mit Icons und Beschreibungen — ideal um Arbeitsabläufe, Bestellprozesse oder Projektphasen transparent darzustellen. Schafft Vertrauen bei Neukunden.</p>' },
        },
      ],
    },
    {
      slug: 'bewertungen',
      title: 'Bewertungen',
      sections: [
        {
          ...HERO, id: 'sc-test-hero', type: 'hero',
          data: { headline: 'Bewertungen', subline: 'Kundenstimmen und Erfahrungsberichte.', bgImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1800&q=85' },
        },
        {
          ...B, id: 'sc-test-demo', type: 'testimonials',
          data: {
            headline: 'Das sagen unsere Kunden',
            badgeText: 'Bewertungen',
            ratingValue: '4.9 von 5',
            ratingCount: '127 Bewertungen auf Google',
            items: [
              { quote: 'Pünktlich, sauber, fair. Das neue Bad ist ein Traum! Absolute Empfehlung für jeden, der Qualität sucht.', name: 'Familie Müller', context: 'Badsanierung in Mainz', rating: 5 },
              { quote: 'Von der Beratung bis zur Umsetzung alles top. Das Team hat mitgedacht und kreative Lösungen vorgeschlagen.', name: 'Thomas K.', context: 'Heizungsmodernisierung', rating: 5 },
              { quote: 'Der Notdienst war innerhalb von 30 Minuten da. Professionell und freundlich — auch um 3 Uhr nachts.', name: 'Sandra B.', context: 'Rohrbruch-Notdienst', rating: 5 },
            ],
          },
        },
        {
          ...B, id: 'sc-test-info', type: 'richText',
          data: { content: '<h3>Bewertungen / Testimonials</h3><p>Zeigt Kundenstimmen mit Zitat, Name, Kontext und Sternebewertung. Optional mit Gesamtbewertung und Anzahl. Social Proof ist einer der stärksten Conversion-Treiber für lokale Unternehmen.</p>' },
        },
      ],
    },
    {
      slug: 'faq',
      title: 'FAQ',
      sections: [
        {
          ...HERO, id: 'sc-faq-hero', type: 'hero',
          data: { headline: 'FAQ', subline: 'Häufig gestellte Fragen.', bgImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1800&q=85' },
        },
        {
          ...B, id: 'sc-faq-demo', type: 'faq',
          data: {
            headline: 'Häufige Fragen',
            badgeText: 'FAQ',
            items: [
              { question: 'Wie schnell können Sie starten?', answer: 'In der Regel innerhalb von 1-2 Wochen nach Auftragserteilung. Bei dringenden Fällen auch kurzfristiger.' },
              { question: 'Bieten Sie Festpreise an?', answer: 'Ja! Nach der Vor-Ort-Besichtigung erhalten Sie ein verbindliches Festpreisangebot — ohne versteckte Kosten.' },
              { question: 'Wie lange dauert eine Badsanierung?', answer: 'Je nach Umfang 5-10 Arbeitstage. Wir erstellen vorab einen genauen Zeitplan.' },
              { question: 'Übernehmen Sie auch Kleinaufträge?', answer: 'Selbstverständlich! Vom tropfenden Wasserhahn bis zur Komplettsanierung — kein Auftrag ist zu klein.' },
              { question: 'Haben Sie einen Notdienst?', answer: 'Ja, wir sind 24/7 erreichbar. Bei Rohrbruch, Heizungsausfall oder ähnlichen Notfällen sind wir schnell vor Ort.' },
            ],
          },
        },
        {
          ...B, id: 'sc-faq-info', type: 'richText',
          data: { content: '<h3>FAQ (Häufige Fragen)</h3><p>Akkordeon-Layout mit Frage-Antwort-Paaren. Reduziert Anfragen, schafft Transparenz und ist hervorragend für SEO. Die Fragen werden als strukturierte Daten ausgegeben und können in Google als Rich Result erscheinen.</p>' },
        },
      ],
    },
    {
      slug: 'cta-banner',
      title: 'CTA-Banner',
      sections: [
        {
          ...HERO, id: 'sc-cta-hero', type: 'hero',
          data: { headline: 'CTA-Banner', subline: 'Aufruf zur Aktion.', bgImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1800&q=85' },
        },
        {
          ...B, id: 'sc-cta-demo', type: 'ctaBand',
          data: {
            headline: 'Bereit für Ihr Projekt?',
            subline: 'Jetzt kostenlos und unverbindlich anfragen — wir melden uns innerhalb von 24 Stunden.',
            badgeText: 'Jetzt starten',
            ctaPrimary: { label: 'Kostenloses Angebot anfordern', href: '#' },
          },
        },
        {
          ...B, id: 'sc-cta-info', type: 'richText',
          data: { content: '<h3>CTA-Banner (Call-to-Action)</h3><p>Ein farbig hervorgehobener Banner mit Headline, Subline und einem prominenten Button. Perfekt als Abschluss einer Seite oder zwischen Content-Sektionen, um Besucher zur Handlung zu motivieren.</p>' },
        },
      ],
    },
    {
      slug: 'kontakt',
      title: 'Kontakt',
      sections: [
        {
          ...HERO, id: 'sc-contact-hero', type: 'hero',
          data: { headline: 'Kontaktformular', subline: 'Direkte Kontaktaufnahme mit Formular und Karte.', bgImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1800&q=85' },
        },
        {
          ...B, id: 'sc-contact-demo', type: 'contact',
          data: {
            headline: 'Schreiben Sie uns',
            subline: 'Wir melden uns innerhalb von 24 Stunden bei Ihnen.',
            badgeText: 'Kontakt',
          },
        },
        {
          ...B, id: 'sc-contact-info', type: 'richText',
          data: { content: '<h3>Kontaktformular</h3><p>Enthält ein Kontaktformular mit konfigurierbaren Feldern, Ihre Kontaktdaten und optional eine eingebettete Google-Maps-Karte. Formulareingaben werden per E-Mail an Sie weitergeleitet.</p>' },
        },
      ],
    },
    {
      slug: 'galerie',
      title: 'Bildergalerie',
      sections: [
        {
          ...HERO, id: 'sc-gal-hero', type: 'hero',
          data: { headline: 'Bildergalerie', subline: 'Responsive Galerie mit Lightbox.', bgImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1800&q=85' },
        },
        {
          ...B, id: 'sc-gal-demo', type: 'galleryGrid',
          data: {
            headline: 'Unsere Projekte',
            subline: 'Ein Auszug unserer letzten Arbeiten.',
            badgeText: 'Galerie',
            images: [
              { src: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80', alt: 'Badezimmer-Sanierung' },
              { src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80', alt: 'Büroumbau' },
              { src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80', alt: 'Hausfassade' },
              { src: 'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=600&q=80', alt: 'Küche' },
              { src: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80', alt: 'Heizungsanlage' },
              { src: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&q=80', alt: 'Referenzprojekt' },
            ],
          },
        },
        {
          ...B, id: 'sc-gal-info', type: 'richText',
          data: { content: '<h3>Bildergalerie</h3><p>Responsive Grid-Galerie mit Lightbox-Funktion zum Vergrößern. Perfekt für Referenzprojekte, Vorher-/Nachher-Bilder oder Produktfotos. Alt-Texte aus der Mediathek werden automatisch übernommen.</p>' },
        },
      ],
    },
    {
      slug: 'team',
      title: 'Team',
      sections: [
        {
          ...HERO, id: 'sc-team-hero', type: 'hero',
          data: { headline: 'Team', subline: 'Stellen Sie Ihr Team vor.', bgImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1800&q=85' },
        },
        {
          ...B, id: 'sc-team-demo', type: 'team',
          data: {
            headline: 'Unser Team',
            subline: 'Die Menschen hinter der Arbeit.',
            badgeText: 'Team',
            members: [
              { name: 'Michael Wagner', role: 'Geschäftsführer & Meister', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80', text: 'Seit 25 Jahren im Handwerk. Liebt komplexe Projekte.' },
              { name: 'Sarah Fischer', role: 'Projektleitung', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80', text: 'Koordiniert, plant und sorgt dafür, dass alles rund läuft.' },
              { name: 'Jonas Becker', role: 'Geselle', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80', text: 'Spezialist für Badsanierungen. Perfektionist bis ins Detail.' },
              { name: 'Lisa Schmitt', role: 'Büro & Verwaltung', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80', text: 'Die gute Seele im Büro. Immer erreichbar, immer freundlich.' },
            ],
          },
        },
        {
          ...B, id: 'sc-team-info', type: 'richText',
          data: { content: '<h3>Team</h3><p>Stellt Ihr Team mit Foto, Name, Rolle und optionalem Beschreibungstext vor. Schafft Vertrauen und Nahbarkeit — besonders wichtig für lokale Dienstleister und kleine Unternehmen.</p>' },
        },
      ],
    },
    {
      slug: 'statistiken',
      title: 'Statistiken',
      sections: [
        {
          ...HERO, id: 'sc-stats-hero', type: 'hero',
          data: { headline: 'Statistiken', subline: 'Zahlen und Fakten.', bgImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1800&q=85' },
        },
        {
          ...B, id: 'sc-stats-demo', type: 'stats',
          data: {
            headline: 'Unser Erfolg in Zahlen',
            badgeText: 'Fakten',
            items: [
              { value: '500+', label: 'Abgeschlossene Projekte' },
              { value: '25', label: 'Jahre Erfahrung' },
              { value: '12', label: 'Mitarbeiter' },
              { value: '100%', label: 'Kundenzufriedenheit' },
            ],
          },
        },
        {
          ...B, id: 'sc-stats-info', type: 'richText',
          data: { content: '<h3>Statistiken</h3><p>Große, auf einen Blick erfassbare Zahlen mit Labels. Perfekt um Erfahrung, Projektanzahl, Kundenzufriedenheit oder andere KPIs prominent darzustellen. Wirkt besonders stark in der „bold"-Stilvariante.</p>' },
        },
      ],
    },
    {
      slug: 'logo-cloud',
      title: 'Logo-Cloud',
      sections: [
        {
          ...HERO, id: 'sc-logo-hero', type: 'hero',
          data: { headline: 'Logo-Cloud', subline: 'Partner und Referenzen.', bgImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1800&q=85' },
        },
        {
          ...B, id: 'sc-logo-demo', type: 'logoCloud',
          data: {
            headline: 'Unsere Partner & Referenzen',
            badgeText: 'Vertrauen',
            logos: [
              { name: 'Viessmann', image: 'https://placehold.co/200x80/f5f5f5/999?text=Viessmann' },
              { name: 'Grohe', image: 'https://placehold.co/200x80/f5f5f5/999?text=Grohe' },
              { name: 'Bosch', image: 'https://placehold.co/200x80/f5f5f5/999?text=Bosch' },
              { name: 'Handwerkskammer', image: 'https://placehold.co/200x80/f5f5f5/999?text=HWK' },
              { name: 'Buderus', image: 'https://placehold.co/200x80/f5f5f5/999?text=Buderus' },
            ],
          },
        },
        {
          ...B, id: 'sc-logo-info', type: 'richText',
          data: { content: '<h3>Logo-Cloud</h3><p>Zeigt Partnerlogos, Hersteller-Logos oder Referenz-Kunden in einer Reihe. Baut Vertrauen auf durch bekannte Marken und Kooperationspartner.</p>' },
        },
      ],
    },
    {
      slug: 'rich-text',
      title: 'Rich Text',
      sections: [
        {
          ...HERO, id: 'sc-rt-hero', type: 'hero',
          data: { headline: 'Rich Text', subline: 'Freier Texteditor.', bgImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1800&q=85' },
        },
        {
          ...B, id: 'sc-rt-demo', type: 'richText',
          data: {
            content: '<h2>Ein Beispiel für Rich Text</h2><p>Diese Sektion bietet einen vollwertigen Texteditor mit Formatierungsoptionen:</p><ul><li><strong>Fettschrift</strong> und <em>Kursivschrift</em></li><li>Aufzählungen und nummerierte Listen</li><li><a href="#">Links zu anderen Seiten</a></li><li>Überschriften in verschiedenen Größen</li></ul><h3>Wofür eignet sich Rich Text?</h3><p>Ideal für Impressum, Datenschutzerklärung, AGBs, Blog-Artikel, Über-uns-Texte oder andere freie Inhalte, die nicht in eine vordefinierte Struktur passen.</p><blockquote>Rich Text Sektionen sind der Allrounder im CMS — flexibel einsetzbar und einfach zu befüllen.</blockquote>',
          },
        },
      ],
    },
    {
      slug: 'video',
      title: 'Video',
      sections: [
        {
          ...HERO, id: 'sc-vid-hero', type: 'hero',
          data: { headline: 'Video-Embed', subline: 'YouTube oder Vimeo einbetten.', bgImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1800&q=85' },
        },
        {
          ...B, id: 'sc-vid-demo', type: 'videoEmbed',
          data: {
            headline: 'Sehen Sie uns bei der Arbeit',
            subline: 'Ein kurzer Einblick in unseren Arbeitsalltag.',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          },
        },
        {
          ...B, id: 'sc-vid-info', type: 'richText',
          data: { content: '<h3>Video-Embed</h3><p>Bettet ein YouTube- oder Vimeo-Video responsiv ein. Perfekt für Imagefilme, Tutorials, Kundenstimmen als Video oder Projektdokumentationen.</p>' },
        },
      ],
    },
    {
      slug: 'hinweisbanner',
      title: 'Hinweisbanner',
      sections: [
        {
          ...HERO, id: 'sc-nb-hero', type: 'hero',
          data: { headline: 'Hinweisbanner', subline: 'Farbiger Banner für wichtige Hinweise.', bgImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1800&q=85' },
        },
        {
          ...B, id: 'sc-nb-demo1', type: 'noticeBanner',
          data: {
            headline: '🚨 Notdienst-Hinweis',
            subline: 'Wir sind 24/7 für Sie da',
            text: '<p>Bei Rohrbruch, Heizungsausfall oder anderen Notfällen erreichen Sie unseren Notdienst rund um die Uhr unter <strong>0800 123 456</strong>.</p>',
            bgColor: '#dc2626',
            textColor: '#ffffff',
            primaryButton: { label: 'Jetzt anrufen', href: 'tel:0800123456' },
          },
        },
        {
          ...B, id: 'sc-nb-demo2', type: 'noticeBanner',
          data: {
            headline: '📢 Sommer-Aktion',
            subline: '20% auf alle Badsanierungen',
            text: '<p>Nur noch bis Ende August: Sichern Sie sich 20% Rabatt auf alle Badsanierungen. Jetzt Beratungstermin vereinbaren!</p>',
            bgColor: '#059669',
            textColor: '#ffffff',
            primaryButton: { label: 'Termin vereinbaren', href: '#' },
            secondaryButton: { label: 'Mehr erfahren', href: '#' },
          },
        },
        {
          ...B, id: 'sc-nb-info', type: 'richText',
          data: { content: '<h3>Hinweisbanner</h3><p>Vollflächiger, farbiger Banner für wichtige Mitteilungen, Aktionen, saisonale Hinweise oder Notfall-Infos. Mit konfigurierbarer Hintergrund- und Textfarbe, optionaler Subline und bis zu zwei Buttons.</p>' },
        },
      ],
    },
    {
      slug: 'header-banner',
      title: 'Header-Banner',
      sections: [
        {
          ...HERO, id: 'sc-hb-hero', type: 'hero',
          data: { headline: 'Header-Banner', subline: 'Schmaler Banner über der Seite.', bgImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1800&q=85' },
        },
        {
          ...B, id: 'sc-hb-demo', type: 'headerBanner',
          data: {
            headline: 'Neu: Jetzt auch Smart-Home-Installation!',
            text: 'Buchen Sie jetzt Ihre Beratung und machen Sie Ihr Zuhause intelligent.',
            ctaLabel: 'Mehr erfahren',
            ctaHref: '#',
          },
        },
        {
          ...B, id: 'sc-hb-info', type: 'richText',
          data: { content: '<h3>Header-Banner</h3><p>Ein schmaler, farbiger Banner mit kurzer Nachricht und optionalem Button. Perfekt als Ankündigung über dem Seiteninhalt — z.B. für Neuigkeiten, Angebote oder Hinweise.</p>' },
        },
      ],
    },
  ],
};
