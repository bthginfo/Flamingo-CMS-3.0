import type { DemoSite } from './types';
import { B, HERO } from './types';

export const tourismSite: DemoSite = {
  industry: 'tourism',
  industryKey: 'tourism',
  defaultStyle: 'classic',
  pages: [
    {
      slug: '',
      title: 'Startseite',
      sections: [
        {
          ...HERO, id: 'tr-home-hero', type: 'hero',
          data: {
            headline: 'Naturregion Silbersee',
            subline: 'Wandern, Wasser, Kultur und kleine Orte mit grossem Ausblick.',
            badgeText: 'Tourismus Demo',
            bgImage: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1800&q=85',
            locationLabel: 'DACH-Region',
            seasonLabel: 'Ganzjaehrig entdecken',
            trustItems: ['Familienfreundlich', '48 Routen', 'Events jede Saison'],
            primaryCta: { label: 'Erlebnisse ansehen', href: '/demo/tourism/erlebnisse' },
            secondaryCta: { label: 'Besuch planen', href: '/demo/tourism/planung' },
          },
        },
        {
          ...B, id: 'tr-home-highlights', type: 'destinationHighlights',
          data: {
            headline: 'Highlights der Region',
            subline: 'Orte, die den Charakter der Destination zeigen.',
            badgeText: 'Entdecken',
            items: [
              { title: 'Silbersee-Ufer', text: 'Promenade, Badestellen und Sonnenuntergaenge am Wasser.', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80', category: 'Natur', cta: { label: 'Mehr erfahren', href: '/demo/tourism/orte' } },
              { title: 'Altstadtbogen', text: 'Gassen, kleine Laeden und regionale Gastronomie.', image: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=900&q=80', category: 'Kultur', cta: { label: 'Route ansehen', href: '/demo/tourism/orte' } },
              { title: 'Panoramaweg', text: 'Leichte Hoehenroute mit Blick auf See und Tal.', image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=900&q=80', category: 'Aktiv', cta: { label: 'Tour planen', href: '/demo/tourism/erlebnisse' } },
            ],
            ctaPrimary: { label: 'Alle Highlights', href: '/demo/tourism/orte' },
          },
        },
        {
          ...B, id: 'tr-home-season', type: 'seasonTeaser',
          data: {
            headline: 'Jede Saison ein anderer Blick',
            subline: 'Inhalte fuer Kampagnen, Saisonseiten und aktuelle Angebote.',
            badgeText: 'Saison',
            seasons: [
              { title: 'Fruehling', text: 'Bluetenwege und erste Terrassen.', image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=900&q=80', periodLabel: 'Maerz-Mai', cta: { label: 'Tipps', href: '/demo/tourism/planung' } },
              { title: 'Sommer', text: 'See, Rad und lange Abende.', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80', periodLabel: 'Juni-August', cta: { label: 'Sommer planen', href: '/demo/tourism/planung' } },
            ],
          },
        },
        {
          ...B, id: 'tr-home-events', type: 'eventsCalendar',
          data: {
            headline: 'Veranstaltungen',
            subline: 'Aktuelle Termine fuer Gaeste und Einheimische.',
            badgeText: 'Kalender',
            events: [
              { title: 'See in Flammen', text: 'Sommerabend mit Musik, Food-Staenden und Lichtshow.', image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=900&q=80', dateLabel: '18. Juli', timeLabel: '18:00', locationLabel: 'Uferpark', category: 'Festival', priceLabel: 'frei', cta: { label: 'Details', href: '/demo/tourism/erlebnisse' } },
            ],
            fallbackText: 'Neue Termine folgen in Kuerze.',
          },
        },
      ],
    },
    {
      slug: 'erlebnisse',
      title: 'Erlebnisse & Touren',
      sections: [
        {
          ...HERO, id: 'tr-exp-hero', type: 'hero',
          data: {
            headline: 'Erlebnisse & Touren',
            subline: 'Von kurzen Familienausfluegen bis zu gefuehrten Tagesprogrammen.',
            badgeText: 'Erleben',
            bgImage: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1800&q=85',
            primaryCta: { label: 'Routen ansehen', href: '/demo/tourism/erlebnisse#routen' },
          },
        },
        {
          ...B, id: 'tr-exp-grid', type: 'experienceGrid',
          data: {
            headline: 'Erlebnisse & Aktivitaeten',
            subline: 'Von kurzen Familienausfluegen bis zu gefuehrten Tagesprogrammen.',
            badgeText: 'Erleben',
            items: [
              { title: 'Gefuehrte Seerunde', text: 'Leichte Tour mit Naturguide, Aussichtspunkten und Picknickplatz.', image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=900&q=80', durationLabel: '3 Stunden', audienceLabel: 'Familien', difficultyLabel: 'leicht', priceLabel: 'ab 18', cta: { label: 'Anfragen', href: '/demo/tourism/kontakt' } },
              { title: 'Kulturabend im Kurpark', text: 'Open-Air-Musik, regionale Kueche und lokale Produzenten.', image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=900&q=80', durationLabel: 'Abend', audienceLabel: 'Alle', difficultyLabel: 'barrierearm', priceLabel: 'frei', cta: { label: 'Termine', href: '/demo/tourism/erlebnisse' } },
            ],
            ctaPrimary: { label: 'Alle Erlebnisse', href: '/demo/tourism/erlebnisse' },
          },
        },
        {
          ...B, id: 'tr-exp-routes', type: 'tourRoutes',
          data: {
            headline: 'Routen & Touren',
            subline: 'Ausgearbeitete Wege fuer verschiedene Ansprueche.',
            badgeText: 'Unterwegs',
            routes: [
              { title: 'Panoramaweg Silbersee', text: 'Rundtour mit Aussicht, Waldstuecken und Einkehrmoeglichkeit.', image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=900&q=80', lengthLabel: '12 km', durationLabel: '3.5 h', difficultyLabel: 'mittel', startLabel: 'Kurpark', highlights: ['Seeufer', 'Aussicht', 'Wald'], cta: { label: 'Route ansehen', href: '/demo/tourism/erlebnisse' } },
            ],
            ctaPrimary: { label: 'Alle Routen', href: '/demo/tourism/erlebnisse' },
          },
        },
      ],
    },
    {
      slug: 'orte',
      title: 'Orte & Sehenswertes',
      sections: [
        {
          ...HERO, id: 'tr-places-hero', type: 'hero',
          data: {
            headline: 'Orte & Sehenswertes',
            subline: 'Sehenswerte Punkte fuer Tagesgaeste und Urlauber.',
            badgeText: 'Orientierung',
            bgImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1800&q=85',
            primaryCta: { label: 'Besuch planen', href: '/demo/tourism/planung' },
          },
        },
        {
          ...B, id: 'tr-places-map', type: 'placesMap',
          data: {
            headline: 'Orte & Karte',
            subline: 'Sehenswerte Punkte fuer Tagesgaeste und Urlauber.',
            badgeText: 'Orientierung',
            mapEmbedUrl: '',
            mapFallbackText: 'Karten-Embed im CMS hinterlegen',
            places: [
              { title: 'Aussichtspunkt Nordhang', text: 'Kurzer Weg, weiter Blick, perfekt zum Sonnenaufgang.', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=80', distanceLabel: '4.2 km', address: 'Nordhangweg', cta: { label: 'Route', href: '/demo/tourism/planung' } },
            ],
            ctaPrimary: { label: 'Besuch planen', href: '/demo/tourism/planung' },
          },
        },
        {
          ...B, id: 'tr-places-sights', type: 'sightseeingList',
          data: {
            headline: 'Sehenswuerdigkeiten',
            subline: 'Kultur, Aussicht und kleine Entdeckungen.',
            badgeText: 'Orte',
            items: [
              { title: 'Heimatmuseum', text: 'Regionale Geschichte in einem alten Speicherhaus.', image: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=900&q=80', openingText: 'Mi-So', category: 'Museum', cta: { label: 'Info', href: '/demo/tourism/kontakt' } },
            ],
          },
        },
      ],
    },
    {
      slug: 'planung',
      title: 'Reiseplanung',
      sections: [
        {
          ...HERO, id: 'tr-plan-hero', type: 'hero',
          data: {
            headline: 'Reiseplanung',
            subline: 'Alles Wichtige fuer Anreise und Aufenthalt.',
            badgeText: 'Info',
            bgImage: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1800&q=85',
            primaryCta: { label: 'Kontakt aufnehmen', href: '/demo/tourism/kontakt' },
          },
        },
        {
          ...B, id: 'tr-plan-info', type: 'visitorInfo',
          data: {
            headline: 'Besuch planen',
            subline: 'Alles Wichtige fuer Anreise und Aufenthalt.',
            badgeText: 'Info',
            introText: 'Diese Inhalte sind komplett ueber das CMS pflegbar.',
            blocks: [
              { icon: 'train', title: 'Anreise', text: 'Bahnhof und Buslinien verbinden die Region.', items: ['Bahnhof 8 Min.', 'Parkplatz P1', 'Radverleih'] },
              { icon: 'accessibility', title: 'Barrierefreiheit', text: 'Viele Angebote sind stufenarm erreichbar.', items: ['Promenade', 'Tourismusbuero', 'WC'] },
            ],
          },
        },
        {
          ...B, id: 'tr-plan-accommodation', type: 'accommodationGrid',
          data: {
            headline: 'Unterkuenfte',
            subline: 'Gastgeber fuer Wochenenden, Familienurlaub und Gruppen.',
            badgeText: 'Bleiben',
            items: [
              { title: 'Seehaus Pension', text: 'Kleine Pension nahe Uferpromenade.', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&q=80', typeLabel: 'Pension', priceLabel: 'ab 89', amenities: ['Fruehstueck', 'Fahrradraum'], cta: { label: 'Anfragen', href: '/demo/tourism/kontakt' } },
            ],
          },
        },
        {
          ...B, id: 'tr-plan-downloads', type: 'downloadGuides',
          data: {
            headline: 'Karten & Broschueren',
            subline: 'Digitale Guides und Materialien.',
            badgeText: 'Downloads',
            items: [
              { title: 'Freizeitkarte', text: 'Routen, Orte und Gastgeber im Ueberblick.', fileLabel: 'PDF herunterladen', fileHref: '#', metaLabel: 'PDF' },
            ],
          },
        },
      ],
    },
    {
      slug: 'galerie',
      title: 'Galerie',
      sections: [
        {
          ...HERO, id: 'tr-gallery-hero', type: 'hero',
          data: {
            headline: 'Galerie',
            subline: 'Bilder fuer Stimmung und Orientierung.',
            badgeText: 'Einblicke',
            bgImage: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=1800&q=85',
            primaryCta: { label: 'Erlebnisse entdecken', href: '/demo/tourism/erlebnisse' },
          },
        },
        {
          ...B, id: 'tr-gallery-images', type: 'gallery',
          data: {
            headline: 'Galerie',
            subline: 'Bilder fuer Stimmung und Orientierung.',
            badgeText: 'Einblicke',
            images: [
              { src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900&q=80', alt: 'Landschaft', caption: 'Weite Landschaft', category: 'Natur' },
              { src: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=900&q=80', alt: 'Ort', caption: 'Historischer Ortskern', category: 'Kultur' },
            ],
          },
        },
      ],
    },
    {
      slug: 'kontakt',
      title: 'Kontakt',
      sections: [
        {
          ...HERO, id: 'tr-contact-hero', type: 'hero',
          data: {
            headline: 'Tourismusbuero',
            subline: 'Persoenliche Beratung fuer Gaeste, Gruppen und Gastgeber.',
            badgeText: 'Kontakt',
            bgImage: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=1800&q=85',
            primaryCta: { label: 'Anrufen', href: 'tel:+49221123456' },
          },
        },
        {
          ...B, id: 'tr-contact-form', type: 'tourismContact',
          data: {
            headline: 'Tourismusbuero',
            subline: 'Persoenliche Beratung fuer Gaeste, Gruppen und Gastgeber.',
            badgeText: 'Kontakt',
            introText: 'Wir helfen bei Unterkunft, Programmen, Routen und Infomaterial.',
            image: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=900&q=80',
            formEnabled: true,
            namePlaceholder: 'Name',
            emailPlaceholder: 'E-Mail',
            messagePlaceholder: 'Nachricht',
            submitLabel: 'Anfrage senden',
            infoCards: [
              { icon: 'phone', label: 'Telefon', value: '+49 221 123456' },
              { icon: 'mail', label: 'E-Mail', value: 'info@silbersee-tourismus.de' },
            ],
            primaryCta: { label: 'Anrufen', href: 'tel:+49221123456' },
            secondaryCta: { label: 'Route planen', href: 'https://maps.google.com' },
          },
        },
        {
          ...B, id: 'tr-contact-faq', type: 'faq',
          data: {
            headline: 'Haeufige Fragen',
            subline: 'Antworten fuer die Reiseplanung.',
            badgeText: 'FAQ',
            items: [
              { question: 'Wann ist die beste Reisezeit?', answer: 'Die Region ist ganzjaehrig attraktiv. Sommer eignet sich fuer See und Rad, Herbst fuer Wandern.' },
            ],
            ctaPrimary: { label: 'Frage stellen', href: '/demo/tourism/kontakt' },
          },
        },
      ],
    },
  ],
};
