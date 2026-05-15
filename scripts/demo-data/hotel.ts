/**
 * Rich demo seed: Hotel (Alpenglow Resort & Spa)
 * Section types match template keys in templates/index.ts
 */
export const HOTEL_CONFIG = {
  slug: 'demo-hotel',
  name: 'Alpenglow Resort & Spa',
  industry: 'hotel' as const,
  activeStyle: 'classic',
  brand: {
    companyName: 'Alpenglow Resort & Spa',
    tagline: 'Luxus und Natur vereint — Ihr Rückzugsort in den Tiroler Alpen',
    primaryColor: '#1e3a5f',
    secondaryColor: '#2563eb',
    accentColor: '#d4a574',
  },
  contact: { phone: '+43 5264 890 00', email: 'info@alpenglow-resort.at', address: 'Bergstraße 42, 6450 Sölden, Tirol' },
  socialLinks: { instagram: 'https://instagram.com/alpenglow', facebook: 'https://facebook.com/alpenglow' },
  openingHours: [{ day: 'Rezeption', hours: '24/7' }, { day: 'Restaurant', hours: '07:00–22:00' }, { day: 'Spa', hours: '08:00–21:00' }],
  navItems: [
    { label: 'Startseite', href: '/', type: 'link' },
    { label: 'Zimmer & Suiten', href: '/zimmer', type: 'link' },
    { label: 'Wellness', href: '/wellness', type: 'link' },
    { label: 'Kulinarik', href: '/kulinarik', type: 'link' },
    { label: 'Erlebnisse', href: '/erlebnisse', type: 'link' },
    { label: 'Kontakt', href: '/kontakt', type: 'link' },
  ],
  navCta: { label: 'Zimmer buchen', href: '/zimmer' },
  footerColumns: [
    { title: 'Hotel', items: [{ text: 'Zimmer & Suiten', href: '/zimmer' }, { text: 'Wellness & Spa', href: '/wellness' }, { text: 'Kulinarik', href: '/kulinarik' }] },
    { title: 'Erlebnisse', items: [{ text: 'Sommer & Winter', href: '/erlebnisse' }, { text: 'FAQ', href: '/faq' }] },
    { title: 'Kontakt', items: [{ text: '+43 5264 890 00' }, { text: 'info@alpenglow-resort.at' }, { text: 'Bergstraße 42, 6450 Sölden' }] },
  ],
  footerLegalLinks: [{ label: 'Impressum', href: '/impressum' }, { label: 'Datenschutz', href: '/datenschutz' }],
  footerCta: { label: 'Jetzt buchen', href: '/zimmer' },
  pages: [
    /* ─── Startseite ─── */
    {
      slug: 'startseite', title: 'Startseite', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Alpenglow Resort & Spa',
          subline: 'Ihr exklusiver Rückzugsort auf 1.350 m — umgeben von der majestätischen Kulisse der Ötztaler Alpen.',
          badgeText: '5-Sterne Superior',
          bgImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1800&q=85',
          trustItems: ['24/7 Rezeption', 'Ski-in / Ski-out', 'Infinity-Pool'],
          primaryCta: { label: 'Verfügbarkeit prüfen', href: '/zimmer' },
          secondaryCta: { label: 'Hotel entdecken', href: '/wellness' },
        }},
        { type: 'roomShowcase', sortOrder: 1, data: {
          headline: 'Zimmer & Suiten',
          subline: 'Luxuriöser Rückzug mit alpinem Charakter',
          badgeText: '6 Kategorien',
          rooms: [
            { name: 'Deluxe Doppelzimmer', description: 'Geräumiges Zimmer mit Panoramabalkon, Regendusche und hochwertigsten Naturmaterialien.', priceLabel: 'Ab 280 € / Nacht', image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=900&q=80', features: ['Bergpanorama', 'Balkon', 'Regendusche', 'Minibar'], sizeLabel: '35 m²', occupancyLabel: '2 Gäste', bookingCta: { label: 'Buchen', href: '/zimmer' } },
            { name: 'Panorama Suite', description: 'Großzügige Suite mit separatem Wohnbereich, freistehender Badewanne und 180°-Alpenpanorama.', priceLabel: 'Ab 520 € / Nacht', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900&q=80', features: ['180° Panorama', 'Freistehende Badewanne', 'Wohnbereich', 'Nespresso'], sizeLabel: '65 m²', occupancyLabel: '2–3 Gäste', bookingCta: { label: 'Buchen', href: '/zimmer' } },
            { name: 'Penthouse Suite', description: 'Privater Whirlpool auf der Dachterrasse, offener Kamin und Butler-Service.', priceLabel: 'Ab 1.200 € / Nacht', image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=900&q=80', features: ['Privater Whirlpool', 'Dachterrasse', 'Kamin', 'Butler-Service'], sizeLabel: '120 m²', occupancyLabel: '2–4 Gäste', highlighted: true, bookingCta: { label: 'Buchen', href: '/zimmer' } },
          ],
        }},
        { type: 'amenities', sortOrder: 2, data: {
          headline: 'Ausstattung & Services',
          subline: 'Alles für einen sorglosen Aufenthalt',
          badgeText: 'Premium',
          items: [
            { icon: 'waves', title: 'Infinity-Außenpool', text: 'Ganzjährig beheizt auf 32 °C mit atemberaubendem Bergpanorama.' },
            { icon: 'flame', title: 'Finnische Sauna', text: '90 °C Aufguss-Sauna mit Panoramafenster und stündlichen Aufgüssen.' },
            { icon: 'dumbbell', title: 'Fitnessraum 24/7', text: 'Modernste Technogym-Geräte, freie Gewichte und Yoga-Raum.' },
            { icon: 'utensils', title: 'Gourmetrestaurant', text: '1-Hauben-Küche von Küchenchef Stefan Walser. 7-Gänge-Menü Di–Sa.' },
            { icon: 'wine', title: 'Panorama-Bar', text: 'Cocktails, Edelbrände und Patisserie mit Gletscherblick.' },
            { icon: 'mountain', title: 'Ski-in / Ski-out', text: 'Direkter Pistenzugang zur Gaislachkoglbahn.' },
          ],
          ctaPrimary: { label: 'Alle Annehmlichkeiten', href: '/wellness' },
        }},
        { type: 'testimonials', sortOrder: 3, data: {
          headline: 'Was unsere Gäste sagen',
          subline: 'Aus über 2.000 Bewertungen',
          ratingValue: '4.9',
          sourceLabel: 'TripAdvisor',
          items: [
            { name: 'Familie Berger', context: 'München', rating: 5, quote: 'Ein unvergesslicher Familienurlaub! Die Kinder waren begeistert vom Kinderclub, wir vom Spa.', stayLabel: 'Juli 2024' },
            { name: 'Dr. Christine Auer', context: 'Wien', rating: 5, quote: 'Perfekte Auszeit. Der Infinity-Pool mit Blick auf die Berge ist atemberaubend.', stayLabel: 'März 2024' },
            { name: 'Thomas & Maria K.', context: 'Zürich', rating: 5, quote: 'Zum dritten Mal hier. Die Penthouse Suite ist ein Traum, das Gourmet-Menü ein Highlight.', stayLabel: 'Dezember 2023' },
          ],
        }},
        { type: 'offers', sortOrder: 4, data: {
          headline: 'Aktuelle Angebote',
          subline: 'Unsere beliebtesten Packages',
          offers: [
            { title: 'Alpine Balance — 3 Nächte', description: 'Ankommen, durchatmen, aufleben. Inkl. Spa, Massage und Verwöhnpension.', priceLabel: 'Ab 990 € p.P.', image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=900&q=80', includes: ['3 Übernachtungen', 'Verwöhnpension', '1× Alpenkräuter-Massage', '1× Gesichtsbehandlung', 'Spa-Nutzung'], cta: { label: 'Anfragen', href: '/kontakt' } },
            { title: 'Romantik-Auszeit — 2 Nächte', description: 'Candle-Light-Dinner, Paarmassage und Champagner-Frühstück.', priceLabel: 'Ab 780 € p.P.', image: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=900&q=80', includes: ['2 Übernachtungen', 'Candle-Light-Dinner', '1× Paarmassage', 'Champagner-Frühstück'], highlighted: true, cta: { label: 'Anfragen', href: '/kontakt' } },
          ],
        }},
        { type: 'gallery', sortOrder: 5, data: {
          headline: 'Impressionen',
          subline: 'Ein Blick in unser Resort',
          images: [
            { src: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&q=80', alt: 'Hotel Außenansicht', category: 'Außen' },
            { src: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=900&q=80', alt: 'Deluxe Zimmer', category: 'Zimmer' },
            { src: 'https://images.unsplash.com/photo-1540555700478-4be289fbec6d?w=900&q=80', alt: 'Infinity Pool', category: 'Wellness' },
            { src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=80', alt: 'Restaurant Gipfelblick', category: 'Kulinarik' },
          ],
        }},
      ],
    },
    /* ─── Zimmer ─── */
    {
      slug: 'zimmer', title: 'Zimmer & Suiten', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Unsere Zimmer & Suiten',
          subline: 'Sechs Kategorien — von gemütlich-alpin bis exklusiv-luxuriös. Jedes Zimmer mit Bergblick.',
          bgImage: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1800&q=85',
          primaryCta: { label: 'Verfügbarkeit prüfen', href: '/kontakt' },
        }},
        { type: 'roomShowcase', sortOrder: 1, data: {
          headline: 'Wählen Sie Ihr Refugium',
          subline: 'Jedes Zimmer ist ein Unikat — gestaltet mit lokalen Materialien und modernem Luxus',
          rooms: [
            { name: 'Komfort Doppelzimmer', description: 'Gemütlicher alpiner Charme: Massivholzmöbel, Tiroler Wolle, Talblick.', priceLabel: 'Ab 220 € / Nacht', image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&q=80', features: ['Talblick', 'Balkon', 'Dusche', 'WLAN'], sizeLabel: '28 m²', occupancyLabel: '2 Gäste', bookingCta: { label: 'Buchen', href: '/kontakt' } },
            { name: 'Deluxe Doppelzimmer', description: 'Panoramabalkon, Regendusche, hochwertigste Naturmaterialien.', priceLabel: 'Ab 280 € / Nacht', image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=900&q=80', features: ['Bergpanorama', 'Balkon', 'Regendusche', 'Minibar'], sizeLabel: '35 m²', occupancyLabel: '2 Gäste', bookingCta: { label: 'Buchen', href: '/kontakt' } },
            { name: 'Junior Suite', description: 'Großzügige Suite mit Sitzecke, Badewanne & Regendusche.', priceLabel: 'Ab 380 € / Nacht', image: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=900&q=80', features: ['Bergpanorama', 'Sitzecke', 'Badewanne', 'Nespresso'], sizeLabel: '48 m²', occupancyLabel: '2–3 Gäste', bookingCta: { label: 'Buchen', href: '/kontakt' } },
            { name: 'Panorama Suite', description: 'Separate Schlaf- und Wohnbereiche, freistehende Badewanne.', priceLabel: 'Ab 520 € / Nacht', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900&q=80', features: ['180° Panorama', 'Freistehende Badewanne', 'Wohnbereich'], sizeLabel: '65 m²', occupancyLabel: '2–3 Gäste', bookingCta: { label: 'Buchen', href: '/kontakt' } },
            { name: 'Familien Suite', description: 'Zwei verbundene Zimmer, zwei Bäder — perfekt für die Familie.', priceLabel: 'Ab 450 € / Nacht', image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=900&q=80', features: ['2 Schlafzimmer', '2 Bäder', 'Kinderbetten', 'Spielecke'], sizeLabel: '72 m²', occupancyLabel: '2 Erw. + 2 Kinder', bookingCta: { label: 'Buchen', href: '/kontakt' } },
            { name: 'Penthouse Suite', description: 'Privater Whirlpool auf der Dachterrasse, Kamin, Butler-Service.', priceLabel: 'Ab 1.200 € / Nacht', image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=900&q=80', features: ['Privater Whirlpool', 'Dachterrasse', 'Kamin', 'Butler-Service'], sizeLabel: '120 m²', occupancyLabel: '2–4 Gäste', highlighted: true, bookingCta: { label: 'Buchen', href: '/kontakt' } },
          ],
        }},
      ],
    },
    /* ─── Wellness ─── */
    {
      slug: 'wellness', title: 'Wellness & Spa', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Wellness & Spa',
          subline: '2.000 m² alpines Wohlgefühl — Infinity-Pool, Saunawelt und erstklassige Treatments',
          bgImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbec6d?w=1800&q=85',
          primaryCta: { label: 'Treatment buchen', href: '/kontakt' },
        }},
        { type: 'wellness', sortOrder: 1, data: {
          headline: 'Unser Spa-Bereich',
          subline: 'Verwöhnung auf höchstem Niveau',
          badgeText: '2.000 m²',
          introText: 'Tauchen Sie ein in unsere alpine Wellnesswelt: Beheizte Pools, Saunawelt und exklusive Treatments mit regionalen Zutaten.',
          imagePrimary: 'https://images.unsplash.com/photo-1540555700478-4be289fbec6d?w=900&q=80',
          imageSecondary: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=900&q=80',
          treatments: [
            { title: 'Alpenkräuter-Massage', text: 'Tiefenwirksame Ganzkörpermassage mit Tiroler Bergkräuteröl.', durationLabel: '50 Min.', priceLabel: 'Ab 120 €', cta: { label: 'Buchen', href: '/kontakt' } },
            { title: 'Hot-Stone Ritual', text: 'Warme Basaltsteine auf Energiepunkten — tiefe Entspannung für Körper und Geist.', durationLabel: '75 Min.', priceLabel: 'Ab 150 €', cta: { label: 'Buchen', href: '/kontakt' } },
            { title: 'Gesichtsbehandlung Alpenrose', text: 'Reinigende Pflege mit Alpenrosenextrakt und Hyaluron-Serum.', durationLabel: '60 Min.', priceLabel: 'Ab 130 €', cta: { label: 'Buchen', href: '/kontakt' } },
          ],
          features: [
            { icon: 'waves', title: 'Infinity-Außenpool', text: 'Ganzjährig 32 °C, 25 m Bahnen' },
            { icon: 'flame', title: 'Saunawelt', text: 'Finnische Sauna, Bio-Sauna, Dampfbad' },
            { icon: 'sparkles', title: 'Ruheräume', text: 'Panorama-Ruheraum mit Wasserbetten' },
          ],
          ctaPrimary: { label: 'Alle Treatments ansehen', href: '/kontakt' },
        }},
        { type: 'offers', sortOrder: 2, data: {
          headline: 'Wellness-Packages',
          subline: 'Unsere beliebtesten Spa-Arrangements',
          offers: [
            { title: 'Alpine Balance — 3 Nächte', description: '3 Übernachtungen mit Verwöhnpension, Spa-Zugang, Massage und Gesichtsbehandlung.', priceLabel: 'Ab 990 € p.P.', image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=900&q=80', includes: ['3 Übernachtungen', 'Verwöhnpension', '1× Alpenkräuter-Massage', '1× Gesichtsbehandlung', 'Spa-Nutzung'], cta: { label: 'Anfragen', href: '/kontakt' } },
            { title: 'Romantik-Auszeit — 2 Nächte', description: 'Candle-Light-Dinner, Paarmassage und Champagner-Frühstück.', priceLabel: 'Ab 780 € p.P.', image: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=900&q=80', includes: ['2 Übernachtungen', 'Candle-Light-Dinner', '1× Paarmassage', 'Champagner-Frühstück'], cta: { label: 'Anfragen', href: '/kontakt' } },
          ],
        }},
      ],
    },
    /* ─── Kulinarik ─── */
    {
      slug: 'kulinarik', title: 'Kulinarik', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Kulinarik',
          subline: 'Regionale Produkte, alpine Kochkunst und internationale Raffinesse',
          bgImage: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1800&q=85',
        }},
        { type: 'hotelDining', sortOrder: 1, data: {
          headline: 'Gastronomie im Alpenglow',
          subline: 'Drei Restaurants, eine Bar',
          badgeText: '1 Haube',
          introText: 'Unser Küchenchef Stefan Walser verbindet alpine Tradition mit internationaler Finesse. Regionale Zutaten von handverlesenen Produzenten bilden die Grundlage.',
          image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=80',
          menus: [
            { title: '7-Gänge-Gourmetmenü', description: 'Saisonales Degustationsmenü mit Weinbegleitung.', timeLabel: 'Di–Sa 19:00', priceLabel: 'Ab 145 €' },
            { title: 'Tiroler Stüberl', description: 'Klassische Tiroler Küche: Kaspressknödel, Gröstl, Kaiserschmarrn.', timeLabel: 'Tägl. 12:00–21:00', priceLabel: 'Ab 22 €' },
          ],
          highlights: [
            { title: 'Panorama-Bar', text: 'Cocktails, Edelbrände und Patisserie mit Gletscherblick. Täglich ab 16 Uhr.', image: 'https://images.unsplash.com/photo-1528823872057-9c018a7a7553?w=900&q=80' },
          ],
          ctaPrimary: { label: 'Tisch reservieren', href: '/kontakt' },
        }},
      ],
    },
    /* ─── Erlebnisse ─── */
    {
      slug: 'erlebnisse', title: 'Erlebnisse', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Erlebnisse',
          subline: 'Ob Sommer oder Winter — die Ötztaler Alpen bieten unvergessliche Momente',
          bgImage: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1800&q=85',
        }},
        { type: 'offers', sortOrder: 1, data: {
          headline: 'Erlebnispakete',
          subline: 'Abenteuer und Erholung kombiniert',
          offers: [
            { title: 'Ski & Spa — 5 Nächte', description: 'Ski-in/Ski-out, Spa-Zugang, Après-Ski.', priceLabel: 'Ab 1.650 € p.P.', image: 'https://images.unsplash.com/photo-1565992441121-4367c2967103?w=900&q=80', includes: ['5 Übernachtungen', 'Verwöhnpension', '5-Tages-Skipass', 'Spa-Nutzung'], cta: { label: 'Anfragen', href: '/kontakt' } },
            { title: 'Wander & Wellness — 4 Nächte', description: 'Geführte Bergtour, E-Bike und Massage.', priceLabel: 'Ab 1.180 € p.P.', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=80', includes: ['4 Übernachtungen', '2× Geführte Wanderung', '1× E-Bike-Tour', '1× Massage'], cta: { label: 'Anfragen', href: '/kontakt' } },
          ],
        }},
        { type: 'eventSpaces', sortOrder: 2, data: {
          headline: 'Veranstaltungsräume',
          subline: 'Für Hochzeiten, Seminare und private Feiern',
          badgeText: 'Bis 200 Personen',
          spaces: [
            { name: 'Saal „Wildspitze"', description: 'Panoramaverglasung, flexible Bestuhlung, Bühne.', image: 'https://images.unsplash.com/photo-1431540015159-0f9641f13f06?w=900&q=80', capacityLabel: 'Bis 200 Personen', sizeLabel: '350 m²', features: ['Panoramaverglasung', 'Bühne', 'Beamer', 'Soundsystem'] },
            { name: 'Stube „Edelweiß"', description: 'Tiroler Stil mit Holzvertäfelung und Kachelofen.', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&q=80', capacityLabel: 'Bis 30 Personen', sizeLabel: '65 m²', features: ['Kachelofen', 'Flipchart', 'TV', 'Terrasse'] },
            { name: 'Panorama-Terrasse', description: '360°-Bergpanorama für Empfänge und Hochzeiten.', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=80', capacityLabel: 'Bis 120 Personen', sizeLabel: '280 m²', features: ['360° Panorama', 'Außenbar', 'Heizstrahler'] },
          ],
          ctaPrimary: { label: 'Event anfragen', href: '/kontakt' },
        }},
      ],
    },
    /* ─── FAQ ─── */
    {
      slug: 'faq', title: 'FAQ', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Häufig gestellte Fragen',
          subline: 'Antworten rund um Ihren Aufenthalt im Alpenglow Resort & Spa',
          bgImage: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1800&q=85',
        }},
        { type: 'faq', sortOrder: 1, data: {
          headline: 'FAQ',
          subline: 'Nützliche Informationen',
          items: [
            { question: 'Wann kann ich einchecken und auschecken?', answer: 'Check-in ab 15:00 Uhr, Check-out bis 11:00 Uhr. Early Check-in und Late Check-out nach Verfügbarkeit möglich.' },
            { question: 'Ist das Hotel für Kinder geeignet?', answer: 'Ja! Familien Suite, Kinderbetreuung (3–12 J.), Indoor-Spielbereich und Kindermenüs.' },
            { question: 'Gibt es Parkmöglichkeiten?', answer: 'Hauseigene Tiefgarage mit 80 Stellplätzen, kostenlos für Hausgäste. E-Ladestationen verfügbar.' },
            { question: 'Ist der Spa-Bereich inklusive?', answer: 'Ja, Pool, Saunawelt, Ruheräume und Fitnessraum sind im Zimmerpreis enthalten. Treatments separat.' },
            { question: 'Haben Sie vegane Menüs?', answer: 'Ja, alle Restaurants bieten vegetarische und vegane Optionen. Individuelle Menüs auf Wunsch.' },
            { question: 'Wie komme ich am besten an?', answer: 'Mit dem Auto über die A13 Brenner → B186 nach Sölden. Per Bahn: Innsbruck Hbf → Bus 4166 (ca. 90 Min.).' },
          ],
          ctaPrimary: { label: 'Weitere Fragen? Kontakt', href: '/kontakt' },
        }},
      ],
    },
    /* ─── Kontakt ─── */
    {
      slug: 'kontakt', title: 'Kontakt', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Kontakt & Anreise',
          subline: 'Wir freuen uns auf Ihre Nachricht',
          bgImage: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1800&q=85',
        }},
        { type: 'contact', sortOrder: 1, data: {
          headline: 'Schreiben Sie uns',
          subline: 'Für Buchungen, Fragen und Sonderwünsche',
          introText: 'Unser Team ist 24/7 telefonisch, per E-Mail oder über das Kontaktformular für Sie da.',
          formEnabled: true,
          infoCards: [
            { icon: 'phone', label: 'Telefon', value: '+43 5264 890 00' },
            { icon: 'mail', label: 'E-Mail', value: 'info@alpenglow-resort.at' },
            { icon: 'clock', label: 'Rezeption', value: '24/7 erreichbar' },
            { icon: 'map-pin', label: 'Adresse', value: 'Bergstraße 42, 6450 Sölden' },
          ],
          image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&q=80',
        }},
        { type: 'location', sortOrder: 2, data: {
          headline: 'Anreise',
          subline: 'Mitten in den Ötztaler Alpen',
          badgeText: 'Sölden, Tirol',
          addressText: 'Alpenglow Resort & Spa\nBergstraße 42\n6450 Sölden, Tirol',
          mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2726.9!2d10.84!3d46.97!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDbwsDU4JzEyLjAiTiAxMMKwNTAnMjQuMCJF!5e0!3m2!1sde!2sat!4v1700000000000',
          image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=900&q=80',
          transportItems: [
            { icon: 'car', label: 'Auto', value: 'A13 Brenner → B186 → Sölden (35 Min.)' },
            { icon: 'train', label: 'Bahn', value: 'Innsbruck Hbf → Bus 4166 (90 Min.)' },
            { icon: 'plane', label: 'Flugzeug', value: 'Flughafen Innsbruck — 75 Min.' },
          ],
          nearbyItems: [
            { title: 'Gaislachkoglbahn', distanceLabel: '200 m', text: 'Direkte Gondel ins Skigebiet.' },
            { title: 'Aqua Dome Therme', distanceLabel: '15 Min.', text: 'Spektakuläre Thermenlandschaft in Längenfeld.' },
          ],
          routeCta: { label: 'Route planen', href: 'https://www.google.com/maps/dir//Sölden+Tirol' },
        }},
      ],
    },
  ],
};
