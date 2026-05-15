import type { DemoSite } from './types';
import { B, HERO } from './types';

export const hotelSite: DemoSite = {
  industry: 'hotel',
  industryKey: 'hotel',
  defaultStyle: 'classic',
  pages: [
    {
      slug: '',
      title: 'Startseite',
      sections: [
        {
          ...HERO, id: 'ht-home-hero', type: 'hero',
          data: {
            headline: 'Hotel Lindenhof',
            subline: 'Boutique-Hotel mit Spa, Restaurant und Blick ins Gruene.',
            badgeText: 'Hotel Demo',
            bgImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1800&q=85',
            trustItems: ['Spa inklusive', 'Direktbucher-Vorteile', 'Kostenfreies Fruehstueck'],
            primaryCta: { label: 'Verfuegbarkeit pruefen', href: '/demo/hotel/zimmer' },
            secondaryCta: { label: 'Zimmer ansehen', href: '/demo/hotel/zimmer' },
            availabilityHint: 'Heute noch 3 Zimmer frei',
            ratingText: '4.8 / 5 Gaestebewertung',
          },
        },
        {
          ...B, id: 'ht-home-booking', type: 'bookingStrip',
          data: {
            headline: 'Direkt buchen',
            subline: 'Beste Rate, flexible Optionen und persoenlicher Service.',
            badgeText: 'Verfuegbarkeit',
            arrivalLabel: 'Anreise',
            departureLabel: 'Abreise',
            guestsLabel: 'Gaeste',
            roomLabel: 'Zimmer',
            submitCta: { label: 'Jetzt pruefen', href: '/demo/hotel/zimmer' },
            secondaryCta: { label: 'Anrufen', href: 'tel:+49221123456' },
            bookingNote: 'Direktbucher erhalten Fruehstueck inklusive.',
            fields: [
              { label: 'Anreise', value: 'Heute', type: 'date' },
              { label: 'Abreise', value: 'Morgen', type: 'date' },
              { label: 'Gaeste', value: '2 Erwachsene', type: 'select' },
              { label: 'Zimmer', value: 'Superior', type: 'select' },
            ],
          },
        },
        {
          ...B, id: 'ht-home-rooms', type: 'roomShowcase',
          data: {
            headline: 'Zimmer & Suiten',
            subline: 'Ruhige Raeume, hochwertige Betten und Details, die den Aufenthalt leichter machen.',
            badgeText: 'Aufenthalt',
            rooms: [
              {
                name: 'Superior Doppelzimmer',
                description: 'Grosses Bett, Sitzecke, Walk-in-Dusche und Blick in den Innenhof.',
                image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=900&q=80',
                galleryImages: ['https://images.unsplash.com/photo-1590490359683-658d3d23f972?w=900&q=80'],
                priceLabel: 'ab 159 / Nacht',
                sizeLabel: '28 qm',
                occupancyLabel: '2 Gaeste',
                bedLabel: 'King Bed',
                features: ['Fruehstueck', 'WLAN', 'Spa-Zugang'],
                detailCta: { label: 'Details', href: '/demo/hotel/zimmer' },
                bookingCta: { label: 'Buchen', href: '/demo/hotel/zimmer' },
                highlighted: true,
              },
            ],
            footerText: 'Alle Zimmerpreise sind editierbare CMS-Inhalte.',
          },
        },
        {
          ...B, id: 'ht-home-amenities', type: 'amenities',
          data: {
            headline: 'Alles fuer einen leichten Aufenthalt',
            subline: 'Services, die Gaeste wirklich nutzen.',
            badgeText: 'Ausstattung',
            items: [
              { icon: 'star', title: 'Highspeed WLAN', text: 'Im gesamten Haus inklusive.', image: '', mediaType: 'icon' },
              { icon: 'clock', title: 'Late Check-out', text: 'Nach Verfuegbarkeit flexibel moeglich.', image: '', mediaType: 'icon' },
              { icon: 'leaf', title: 'Spa & Sauna', text: 'Taeglich fuer Hotelgaeste geoeffnet.', image: '', mediaType: 'icon' },
            ],
            ctaPrimary: { label: 'Alle Services ansehen', href: '/demo/hotel/zimmer' },
          },
        },
        {
          ...B, id: 'ht-home-testimonials', type: 'testimonials',
          data: {
            headline: 'Was Gaeste sagen',
            subline: 'Bewertungen und Stimmen aus aktuellen Aufenthalten.',
            badgeText: 'Bewertungen',
            ratingValue: '4.8 von 5',
            ratingCount: '312 Bewertungen',
            sourceLabel: 'Direktbuchung & Portale',
            items: [
              { quote: 'Sehr ruhig, tolles Fruehstueck und ein Team, das wirklich mitdenkt.', name: 'M. Schneider', context: 'Privatreise', rating: 5, stayLabel: 'April 2026' },
              { quote: 'Perfekt fuer unser Offsite. Raum, Technik und Abendessen waren stark organisiert.', name: 'Lea K.', context: 'Business', rating: 5, stayLabel: 'Maerz 2026' },
              { quote: 'Der Spa-Bereich war der Grund zu buchen und am Ende auch das Highlight.', name: 'Jonas R.', context: 'Wellness', rating: 5, stayLabel: 'Februar 2026' },
            ],
            ctaPrimary: { label: 'Jetzt anfragen', href: '/demo/hotel/kontakt' },
          },
        },
        {
          ...B, id: 'ht-home-cta', type: 'ctaBand',
          data: {
            headline: 'Aufenthalt planen?',
            subline: 'Persoenliche Beratung und beste Konditionen bei Direktbuchung.',
            badgeText: 'Jetzt buchen',
            ctaPrimary: { label: 'Kontakt aufnehmen', href: '/demo/hotel/kontakt' },
          },
        },
      ],
    },
    {
      slug: 'zimmer',
      title: 'Zimmer & Suiten',
      sections: [
        {
          ...HERO, id: 'ht-rooms-hero', type: 'hero',
          data: {
            headline: 'Zimmer & Suiten',
            subline: 'Ruhige Raeume mit hochwertiger Ausstattung fuer einen erholsamen Aufenthalt.',
            badgeText: 'Zimmer',
            bgImage: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1800&q=85',
            primaryCta: { label: 'Verfuegbarkeit pruefen', href: '/demo/hotel/kontakt' },
          },
        },
        {
          ...B, id: 'ht-rooms-showcase', type: 'roomShowcase',
          data: {
            headline: 'Zimmer & Suiten',
            subline: 'Ruhige Raeume, hochwertige Betten und Details, die den Aufenthalt leichter machen.',
            badgeText: 'Aufenthalt',
            rooms: [
              {
                name: 'Superior Doppelzimmer',
                description: 'Grosses Bett, Sitzecke, Walk-in-Dusche und Blick in den Innenhof.',
                image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=900&q=80',
                galleryImages: ['https://images.unsplash.com/photo-1590490359683-658d3d23f972?w=900&q=80'],
                priceLabel: 'ab 159 / Nacht',
                sizeLabel: '28 qm',
                occupancyLabel: '2 Gaeste',
                bedLabel: 'King Bed',
                features: ['Fruehstueck', 'WLAN', 'Spa-Zugang'],
                detailCta: { label: 'Details', href: '/demo/hotel/kontakt' },
                bookingCta: { label: 'Buchen', href: '/demo/hotel/kontakt' },
                highlighted: true,
              },
            ],
            footerText: 'Alle Zimmerpreise sind editierbare CMS-Inhalte.',
          },
        },
        {
          ...B, id: 'ht-rooms-offers', type: 'offers',
          data: {
            headline: 'Angebote & Arrangements',
            subline: 'Kurzurlaub, Wellness und Business-Aufenthalte.',
            badgeText: 'Specials',
            offers: [
              {
                title: 'Wellness Wochenende',
                description: 'Zwei Naechte, Spa-Zugang, Massage und Dinner.',
                image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=900&q=80',
                priceLabel: 'ab 349',
                durationLabel: '2 Naechte',
                includes: ['Spa', 'Dinner', 'Massage'],
                validUntilLabel: 'bis September',
                cta: { label: 'Anfragen', href: '/demo/hotel/kontakt' },
                detailHref: '/demo/hotel/kontakt',
                detailLabel: 'Details',
                highlighted: true,
              },
            ],
            fallbackText: 'Neue Angebote folgen in Kuerze.',
          },
        },
      ],
    },
    {
      slug: 'wellness',
      title: 'Wellness & Spa',
      sections: [
        {
          ...HERO, id: 'ht-wellness-hero', type: 'hero',
          data: {
            headline: 'Spa & Wellness',
            subline: 'Sauna, Ruhebereiche und Treatments fuer Koerper und Geist.',
            badgeText: 'Wellness',
            bgImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1800&q=85',
            primaryCta: { label: 'Spa anfragen', href: '/demo/hotel/kontakt' },
          },
        },
        {
          ...B, id: 'ht-wellness-main', type: 'wellness',
          data: {
            headline: 'Spa & Wellness',
            subline: 'Sauna, Ruhebereiche und Treatments.',
            badgeText: 'Wellness',
            introText: 'Der Spa-Bereich ist fuer Hotelgaeste taeglich geoeffnet.',
            imagePrimary: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200&q=85',
            imageSecondary: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=800&q=80',
            treatments: [{ title: 'Aroma Massage', text: 'Ruhige Anwendung mit warmen Oelen.', durationLabel: '50 Minuten', priceLabel: '89', image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&q=80', cta: { label: 'Termin anfragen', href: '/demo/hotel/kontakt' } }],
            features: [{ icon: 'heart', title: 'Ruheraum', text: 'Leise Zonen mit Blick ins Gruene.' }],
            ctaPrimary: { label: 'Spa anfragen', href: '/demo/hotel/kontakt' },
          },
        },
      ],
    },
    {
      slug: 'restaurant',
      title: 'Restaurant',
      sections: [
        {
          ...HERO, id: 'ht-restaurant-hero', type: 'hero',
          data: {
            headline: 'Restaurant & Bar',
            subline: 'Saisonale Kueche, Fruehstuecksbuffet und Drinks am Kamin.',
            badgeText: 'Genuss',
            bgImage: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1800&q=85',
            primaryCta: { label: 'Tisch anfragen', href: '/demo/hotel/kontakt' },
          },
        },
        {
          ...B, id: 'ht-restaurant-dining', type: 'hotelDining',
          data: {
            headline: 'Restaurant & Bar',
            subline: 'Fruehstueck, Abendkarte und Drinks am Kamin.',
            badgeText: 'Genuss',
            introText: 'Die Kueche arbeitet saisonal und regional.',
            image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200&q=85',
            openingText: 'Fruehstueck 7-11 Uhr, Bar ab 17 Uhr',
            menus: [{ title: 'Fruehstueck', description: 'Buffet, Eierspeisen und Kaffee.', timeLabel: '7-11 Uhr', priceLabel: 'inklusive', cta: { label: 'Mehr erfahren', href: '/demo/hotel/kontakt' } }],
            highlights: [{ title: 'Kaminbar', text: 'Drinks und kleine Teller.', image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80' }],
            ctaPrimary: { label: 'Tisch anfragen', href: '/demo/hotel/kontakt' },
          },
        },
      ],
    },
    {
      slug: 'veranstaltungen',
      title: 'Veranstaltungen',
      sections: [
        {
          ...HERO, id: 'ht-events-hero', type: 'hero',
          data: {
            headline: 'Events & Tagungen',
            subline: 'Flexible Raeume fuer Meetings, Feiern und Konferenzen.',
            badgeText: 'Veranstaltungen',
            bgImage: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1800&q=85',
            primaryCta: { label: 'Event anfragen', href: '/demo/hotel/kontakt' },
          },
        },
        {
          ...B, id: 'ht-events-spaces', type: 'eventSpaces',
          data: {
            headline: 'Events & Tagungen',
            subline: 'Flexible Raeume fuer Meetings und Feiern.',
            badgeText: 'Raeume',
            spaces: [{ name: 'Salon Linden', description: 'Heller Raum mit Zugang zur Terrasse.', image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=900&q=80', capacityLabel: 'bis 60 Personen', sizeLabel: '90 qm', seatingOptions: ['U-Form', 'Dinner', 'Theater'], features: ['Beamer', 'Terrasse', 'Bar'], inquiryCta: { label: 'Anfragen', href: '/demo/hotel/kontakt' } }],
            processHeadline: 'So planen wir gemeinsam',
            processSteps: [{ icon: 'clipboard', title: 'Anfrage', text: 'Rahmen und Ziel klaeren.' }],
            ctaPrimary: { label: 'Event anfragen', href: '/demo/hotel/kontakt' },
          },
        },
      ],
    },
    {
      slug: 'galerie',
      title: 'Galerie',
      sections: [
        {
          ...HERO, id: 'ht-gallery-hero', type: 'hero',
          data: {
            headline: 'Einblicke ins Haus',
            subline: 'Zimmer, Spa, Restaurant und ruhige Ecken im Ueberblick.',
            badgeText: 'Galerie',
            bgImage: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1800&q=85',
            primaryCta: { label: 'Aufenthalt planen', href: '/demo/hotel/kontakt' },
          },
        },
        {
          ...B, id: 'ht-gallery-main', type: 'gallery',
          data: {
            headline: 'Einblicke ins Haus',
            subline: 'Zimmer, Spa, Restaurant und ruhige Ecken im Ueberblick.',
            badgeText: 'Galerie',
            images: [
              { src: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=900&q=80', alt: 'Hotellobby', caption: 'Warme Lobby mit Lounge', category: 'Ankommen' },
              { src: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=900&q=80', alt: 'Hotelzimmer', caption: 'Ruhige Zimmer mit klaren Linien', category: 'Zimmer' },
              { src: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=900&q=80', alt: 'Hotelpool', caption: 'Spa-Bereich fuer Hotelgaeste', category: 'Wellness' },
            ],
            ctaPrimary: { label: 'Aufenthalt planen', href: '/demo/hotel/kontakt' },
          },
        },
      ],
    },
    {
      slug: 'kontakt',
      title: 'Kontakt',
      sections: [
        {
          ...HERO, id: 'ht-kontakt-hero', type: 'hero',
          data: {
            headline: 'Kontakt aufnehmen',
            subline: 'Fuer Buchungen, Events und individuelle Aufenthalte.',
            badgeText: 'Kontakt',
            bgImage: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&q=85',
            primaryCta: { label: 'Jetzt anrufen', href: 'tel:+49221123456' },
          },
        },
        {
          ...B, id: 'ht-kontakt-location', type: 'location',
          data: {
            headline: 'Zentral und ruhig gelegen',
            subline: 'Altstadt, Bahnhof und Natur sind schnell erreichbar.',
            badgeText: 'Lage',
            addressText: 'Lindenallee 7, 50667 Koeln',
            mapEmbedUrl: '',
            image: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=1200&q=85',
            transportItems: [{ icon: 'map-pin', label: 'Bahnhof', value: '8 Minuten', text: 'Direkte Verbindung mit Tram und Taxi.' }],
            nearbyItems: [{ title: 'Altstadt', distanceLabel: '1.2 km', text: 'Restaurants, Museen und Rheinpromenade.', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&q=80' }],
            routeCta: { label: 'Route planen', href: 'https://maps.google.com' },
          },
        },
        {
          ...B, id: 'ht-kontakt-faq', type: 'faq',
          data: {
            headline: 'Haeufige Fragen',
            subline: 'Antworten zu Check-in, Spa, Parkplatz und Direktbuchung.',
            badgeText: 'FAQ',
            items: [
              { question: 'Ab wann ist der Check-in moeglich?', answer: 'Der Check-in ist ab 15 Uhr moeglich. Fruehere Anreise pruefen wir nach Verfuegbarkeit.' },
              { question: 'Ist Spa-Zugang inklusive?', answer: 'Ja, fuer Hotelgaeste ist der Zugang zu Sauna und Ruhebereich inklusive.' },
              { question: 'Gibt es Parkplaetze?', answer: 'Parkplaetze koennen je nach Verfuegbarkeit direkt mit der Buchung reserviert werden.' },
            ],
            ctaPrimary: { label: 'Weitere Frage stellen', href: '/demo/hotel/kontakt' },
          },
        },
        {
          ...B, id: 'ht-kontakt-contact', type: 'contact',
          data: {
            headline: 'Direkt Kontakt aufnehmen',
            subline: 'Fuer Buchungen, Events und individuelle Aufenthalte.',
            badgeText: 'Kontakt',
            introText: 'Das Team antwortet persoenlich und klaert Verfuegbarkeit, Zimmerwunsch oder Eventbedarf.',
            image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&q=85',
            infoCards: [
              { icon: 'phone', label: 'Telefon', value: '+49 221 123456' },
              { icon: 'mail', label: 'E-Mail', value: 'hello@hotel-lindenhof.de' },
              { icon: 'map-pin', label: 'Adresse', value: 'Lindenallee 7, 50667 Koeln' },
            ],
            contactCta: { label: 'Anrufen', href: 'tel:+49221123456' },
            routeCta: { label: 'Route planen', href: 'https://maps.google.com' },
            formEnabled: true,
            namePlaceholder: 'Name',
            emailPlaceholder: 'E-Mail',
            messagePlaceholder: 'Nachricht',
            submitLabel: 'Anfrage senden',
          },
        },
      ],
    },
  ],
};
