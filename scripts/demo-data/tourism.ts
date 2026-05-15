/**
 * Rich demo seed: Tourism (Ötztal Tourismus)
 * Section types match template keys in templates/index.ts:
 * hero, destinationHighlights, experienceGrid, seasonTeaser, eventsCalendar, placesMap,
 * sightseeingList, tourRoutes, accommodationGrid, visitorInfo, downloadGuides,
 * gallery, faq, tourismContact, richText
 */
export const TOURISM_CONFIG = {
  slug: 'demo-tourism',
  name: 'Ötztal Tourismus',
  industry: 'tourism' as const,
  activeStyle: 'classic',
  brand: {
    companyName: 'Ötztal Tourismus',
    tagline: 'Das Ötztal erleben — Natur, Abenteuer & Genuss in Tirol',
    primaryColor: '#1a5c3a',
    secondaryColor: '#2d8a56',
    accentColor: '#a8d5ba',
  },
  contact: { phone: '+43 57200 100', email: 'info@oetztal.com', address: 'Gemeindestraße 4, 6450 Sölden, Tirol' },
  socialLinks: { instagram: 'https://instagram.com/oetztal', facebook: 'https://facebook.com/oetztal' },
  openingHours: [{ day: 'Infobüro', hours: 'Mo–Fr 08:00–18:00, Sa 09:00–12:00' }],
  navItems: [
    { label: 'Startseite', href: '/', type: 'link' },
    { label: 'Highlights', href: '/highlights', type: 'link' },
    { label: 'Erlebnisse', href: '/erlebnisse', type: 'link' },
    { label: 'Unterkünfte', href: '/unterkuenfte', type: 'link' },
    { label: 'Wanderrouten', href: '/wanderrouten', type: 'link' },
    { label: 'Über uns', href: '/ueber-uns', type: 'link' },
    { label: 'Kontakt', href: '/kontakt', type: 'link' },
  ],
  navCta: { label: 'Urlaub planen', href: '/erlebnisse' },
  footerColumns: [
    { title: 'Entdecken', items: [{ text: 'Highlights', href: '/highlights' }, { text: 'Erlebnisse', href: '/erlebnisse' }, { text: 'Wanderrouten', href: '/wanderrouten' }] },
    { title: 'Planen', items: [{ text: 'Unterkünfte', href: '/unterkuenfte' }, { text: 'Events', href: '/events' }, { text: 'FAQ', href: '/faq' }] },
    { title: 'Kontakt', items: [{ text: '+43 57200 100' }, { text: 'info@oetztal.com' }, { text: 'Gemeindestraße 4, 6450 Sölden' }] },
  ],
  footerLegalLinks: [{ label: 'Impressum', href: '/impressum' }, { label: 'Datenschutz', href: '/datenschutz' }],
  footerCta: { label: 'Urlaub planen', href: '/erlebnisse' },
  pages: [
    /* ─── Startseite ─── */
    {
      slug: 'startseite', title: 'Startseite', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Willkommen im Ötztal',
          subline: '65 km alpines Hochtal in Tirol — von der Gletscherwelt bis zu den Thermalquellen. Entdecken Sie Natur und Abenteuer.',
          badgeText: 'Tirol, Österreich',
          bgImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1800&q=85',
          locationLabel: 'Tirol, Österreich',
          seasonLabel: 'Ganzjahres-Destination',
          trustItems: ['250+ km Wanderwege', '6 Skigebiete', 'Aqua Dome Therme'],
          primaryCta: { label: 'Erlebnisse entdecken', href: '/erlebnisse' },
          secondaryCta: { label: 'Unterkünfte finden', href: '/unterkuenfte' },
        }},
        { type: 'destinationHighlights', sortOrder: 1, data: {
          headline: 'Highlights im Ötztal',
          subline: 'Die Top-Attraktionen auf einen Blick',
          badgeText: 'Must-See',
          items: [
            { title: 'Stuibenfall', text: 'Tirols höchster Wasserfall (159 m) mit spektakulärer Hängebrücke und Klettersteig.', image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=900&q=80', category: 'Natur', cta: { label: 'Mehr erfahren', href: '/highlights' } },
            { title: 'Ötzi-Fundstelle', text: 'Die berühmte Fundstelle der Gletschermumie am Similaun — erreichbar über den E5-Fernwanderweg.', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=80', category: 'Kultur', cta: { label: 'Mehr erfahren', href: '/highlights' } },
            { title: 'Aqua Dome Therme', text: 'Futuristische Thermenanlage in Längenfeld mit Sole-Becken, Saunawelt und Bergpanorama.', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbec6d?w=900&q=80', category: 'Wellness', cta: { label: 'Mehr erfahren', href: '/highlights' } },
            { title: 'Sölden — 007 Elements', text: 'James-Bond-Erlebniswelt auf 3.048 m am Gaislachkogl. Interaktive Kino-Installation im Berg.', image: 'https://images.unsplash.com/photo-1565992441121-4367c2967103?w=900&q=80', category: 'Erlebnis', cta: { label: 'Mehr erfahren', href: '/highlights' } },
          ],
          ctaPrimary: { label: 'Alle Highlights entdecken', href: '/highlights' },
        }},
        { type: 'seasonTeaser', sortOrder: 2, data: {
          headline: 'Das Ötztal in jeder Jahreszeit',
          subline: 'Ganzjahres-Destination für Natur und Abenteuer',
          seasons: [
            { title: 'Sommer im Ötztal', text: 'Wandern, Klettern, Mountainbiken und Rafting — über 250 km markierte Wege und unzählige Gipfel.', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=80', category: 'Sommer', periodLabel: 'Juni–September', cta: { label: 'Sommeraktivitäten', href: '/erlebnisse' } },
            { title: 'Winter im Ötztal', text: 'Sölden, Obergurgl-Hochgurgl und 4 weitere Skigebiete. 360 Pistenkilometer, Langlauf und Winterwandern.', image: 'https://images.unsplash.com/photo-1565992441121-4367c2967103?w=900&q=80', category: 'Winter', periodLabel: 'November–April', cta: { label: 'Wintererlebnisse', href: '/erlebnisse' } },
            { title: 'Herbst — Ötztaler Almbabtrieb', text: 'Buntes Laub, klare Luft und der traditionsreiche Almbabtrieb — ein Tiroler Erlebnis.', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80', category: 'Herbst', periodLabel: 'September–Oktober', cta: { label: 'Herbstgenuss', href: '/erlebnisse' } },
          ],
        }},
        { type: 'gallery', sortOrder: 3, data: {
          headline: 'Bildergalerie',
          subline: 'Impressionen aus dem Ötztal',
          images: [
            { src: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=80', alt: 'Bergpanorama Ötztal', category: 'Natur' },
            { src: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=900&q=80', alt: 'Stuibenfall', category: 'Natur' },
            { src: 'https://images.unsplash.com/photo-1565992441121-4367c2967103?w=900&q=80', alt: 'Skigebiet Sölden', category: 'Winter' },
            { src: 'https://images.unsplash.com/photo-1540555700478-4be289fbec6d?w=900&q=80', alt: 'Aqua Dome', category: 'Wellness' },
            { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80', alt: 'Herbst im Ötztal', category: 'Herbst' },
          ],
        }},
        { type: 'newsPreview', sortOrder: 4, data: {
          headline: 'Neuigkeiten',
          subline: 'Aktuelles aus dem Ötztal',
          collectionKey: 'news',
          linkLabel: 'Alle Beiträge',
          linkHref: '/neuigkeiten',
        }},
      ],
    },
    /* ─── Highlights ─── */
    {
      slug: 'highlights', title: 'Highlights', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Highlights im Ötztal',
          subline: 'Die schönsten Orte und Attraktionen in Tirols längstem Seitental',
          bgImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1800&q=85',
        }},
        { type: 'sightseeingList', sortOrder: 1, data: {
          headline: 'Sehenswürdigkeiten',
          subline: 'Natur, Kultur und Architektur',
          items: [
            { title: 'Stuibenfall', text: 'Mit 159 m Tirols höchster Wasserfall. Hängebrücke, Aussichtsplattform und Klettersteig.', image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=900&q=80', openingText: 'Frei zugänglich Mai–Okt.', category: 'Natur', cta: { label: 'Details', href: '/highlights' } },
            { title: '007 Elements', text: 'James-Bond-Erlebniswelt auf 3.048 m. Interaktive Kino-Installation im Innern des Gaislachkogls.', image: 'https://images.unsplash.com/photo-1565992441121-4367c2967103?w=900&q=80', openingText: 'Täglich 09:00–16:00', category: 'Erlebnis', cta: { label: 'Tickets', href: '/highlights' } },
            { title: 'Ötztaler Heimatmuseum', text: 'Geschichte des Ötztals von der Steinzeit bis heute. Ötzi-Ausstellung und traditionelle Stuben.', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80', openingText: 'Di–So 10:00–17:00', category: 'Kultur', cta: { label: 'Details', href: '/highlights' } },
            { title: 'Area 47 — Outdoor-Playground', text: 'Europas größter Outdoor-Park: Rafting, Canyoning, Hochseilgarten, Wasserrutschen.', image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=900&q=80', openingText: 'Mai–Sep. 10:00–18:00', category: 'Sport', cta: { label: 'Tickets', href: '/highlights' } },
          ],
        }},
      ],
    },
    /* ─── Erlebnisse ─── */
    {
      slug: 'erlebnisse', title: 'Erlebnisse', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Erlebnisse & Aktivitäten',
          subline: 'Abenteuer, Entspannung und Genuss — für jeden etwas',
          bgImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1800&q=85',
        }},
        { type: 'experienceGrid', sortOrder: 1, data: {
          headline: 'Aktivitäten im Ötztal',
          subline: 'Sommer & Winter',
          items: [
            { title: 'Geführte Gipfeltouren', text: 'Mit staatlich geprüften Bergführern auf die schönsten Gipfel der Ötztaler Alpen.', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=80', category: 'Wandern', durationLabel: '4–8 Std.', audienceLabel: 'Fortgeschrittene', difficultyLabel: 'Mittel–Schwer', priceLabel: 'Ab 65 € p.P.', cta: { label: 'Buchen', href: '/kontakt' } },
            { title: 'E-Bike-Touren', text: 'Entspannt das Tal erkunden: geführte E-Bike-Touren zu Almen, Seen und Wasserfällen.', image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=900&q=80', category: 'Radfahren', durationLabel: '3–5 Std.', audienceLabel: 'Familien & Anfänger', difficultyLabel: 'Leicht', priceLabel: 'Ab 45 € p.P.', cta: { label: 'Buchen', href: '/kontakt' } },
            { title: 'Wildwasser-Rafting', text: 'Adrenalin pur auf der Ötztaler Ache. Level I–IV verfügbar.', image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=900&q=80', category: 'Wasser', durationLabel: '2–3 Std.', audienceLabel: 'Ab 14 Jahren', difficultyLabel: 'Mittel', priceLabel: 'Ab 55 € p.P.', cta: { label: 'Buchen', href: '/kontakt' } },
            { title: 'Skifahren in Sölden', text: '144 Pistenkilometer, 31 Lifte, 2 Gletscherskigebiete und Après-Ski-Kultur.', image: 'https://images.unsplash.com/photo-1565992441121-4367c2967103?w=900&q=80', category: 'Ski', durationLabel: 'Tagespass', audienceLabel: 'Alle Level', difficultyLabel: 'Leicht–Schwer', priceLabel: 'Ab 62 € / Tag', cta: { label: 'Skipass kaufen', href: '/kontakt' } },
            { title: 'Klettersteige', text: 'Vom Einsteiger-Klettersteig bis zur alpinen Herausforderung — bestens gesichert.', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80', category: 'Klettern', durationLabel: '3–6 Std.', audienceLabel: 'Sportliche', difficultyLabel: 'Mittel–Schwer', priceLabel: 'Ab 75 € p.P.', cta: { label: 'Buchen', href: '/kontakt' } },
            { title: 'Paragliding Tandemflug', text: 'Über dem Ötztal schweben — Tandemflug mit erfahrenem Piloten und Bergpanorama.', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=80', category: 'Luft', durationLabel: '15–25 Min.', audienceLabel: 'Ab 6 Jahren', difficultyLabel: 'Leicht', priceLabel: 'Ab 130 €', cta: { label: 'Buchen', href: '/kontakt' } },
          ],
          ctaPrimary: { label: 'Alle Erlebnisse', href: '/erlebnisse' },
        }},
      ],
    },
    /* ─── Unterkünfte ─── */
    {
      slug: 'unterkuenfte', title: 'Unterkünfte', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Unterkünfte im Ötztal',
          subline: 'Vom Berghotel bis zur gemütlichen Ferienwohnung',
          bgImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1800&q=85',
        }},
        { type: 'accommodationGrid', sortOrder: 1, data: {
          headline: 'Übernachten im Ötztal',
          subline: 'Für jeden Geschmack und jedes Budget',
          items: [
            { title: 'Alpenglow Resort & Spa ★★★★★', text: 'Luxushotel mit Spa, Infinity-Pool und Ski-in/Ski-out in Sölden.', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&q=80', category: 'Hotel', typeLabel: '5-Sterne', priceLabel: 'Ab 280 € / Nacht', amenities: ['Spa', 'Pool', 'Restaurant', 'Ski-in/Ski-out'], cta: { label: 'Details', href: '/unterkuenfte' } },
            { title: 'Gasthof Stern ★★★', text: 'Traditioneller Tiroler Gasthof mit Halbpension und Stube in Oetz.', image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=900&q=80', category: 'Gasthof', typeLabel: '3-Sterne', priceLabel: 'Ab 85 € / Nacht', amenities: ['Halbpension', 'Sauna', 'Parkplatz', 'WLAN'], cta: { label: 'Details', href: '/unterkuenfte' } },
            { title: 'Ferienwohnung Alpenblick', text: 'Gemütliche Ferienwohnung für 4 Personen mit Balkon und Bergblick in Umhausen.', image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=900&q=80', category: 'Ferienwohnung', typeLabel: 'Apartment', priceLabel: 'Ab 110 € / Nacht', amenities: ['Küche', 'Balkon', 'WLAN', 'Parkplatz'], cta: { label: 'Details', href: '/unterkuenfte' } },
            { title: 'Campingplatz Ötztal', text: 'Stellplätze und Mietchalets direkt an der Ötztaler Ache.', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80', category: 'Camping', typeLabel: 'Campingplatz', priceLabel: 'Ab 28 € / Nacht', amenities: ['Sanitäranlagen', 'Spielplatz', 'Grillplatz', 'Strom'], cta: { label: 'Details', href: '/unterkuenfte' } },
          ],
        }},
      ],
    },
    /* ─── Wanderrouten ─── */
    {
      slug: 'wanderrouten', title: 'Wanderrouten', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Wanderrouten',
          subline: 'Über 250 km markierte Wanderwege — vom Spaziergang bis zur Gipfeltour',
          bgImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1800&q=85',
        }},
        { type: 'tourRoutes', sortOrder: 1, data: {
          headline: 'Beliebte Routen',
          subline: 'Unsere Top-Empfehlungen',
          routes: [
            { title: 'Stuibenfall-Rundweg', text: 'Leichte Wanderung zum höchsten Wasserfall Tirols mit Hängebrücke.', image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=900&q=80', category: 'Leicht', lengthLabel: '5,2 km', durationLabel: '2 Std.', difficultyLabel: 'Leicht', startLabel: 'Parkplatz Umhausen', highlights: ['Stuibenfall', 'Hängebrücke', 'Aussichtsplattform'], cta: { label: 'Route ansehen', href: '/wanderrouten' } },
            { title: 'Obergurgler Zirbenweg', text: 'Panoramaweg durch den höchsten Zirbenwald Europas mit Blick auf 21 Dreitausender.', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80', category: 'Mittel', lengthLabel: '8,4 km', durationLabel: '3,5 Std.', difficultyLabel: 'Mittel', startLabel: 'Obergurgl Bergbahn', highlights: ['Zirbenwald', '21 Dreitausender-Panorama', 'Schönwieshütte'], cta: { label: 'Route ansehen', href: '/wanderrouten' } },
            { title: 'Similaun — Ötzi-Fundstelle', text: 'Anspruchsvolle Hochtour zur berühmten Fundstelle der Gletschermumie auf 3.210 m.', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=80', category: 'Schwer', lengthLabel: '14,2 km', durationLabel: '7 Std.', difficultyLabel: 'Schwer', startLabel: 'Vernagt-Stausee', highlights: ['Ötzi-Fundstelle', 'Similaunhütte', 'Gletscherpanorama'], cta: { label: 'Route ansehen', href: '/wanderrouten' } },
          ],
          ctaPrimary: { label: 'Alle Routen auf Komoot', href: '/wanderrouten' },
        }},
      ],
    },
    /* ─── Events ─── */
    {
      slug: 'events', title: 'Events', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Events & Veranstaltungen',
          subline: 'Traditionsreiche Feste und sportliche Highlights im Ötztal',
          bgImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1800&q=85',
        }},
        { type: 'eventsCalendar', sortOrder: 1, data: {
          headline: 'Veranstaltungskalender',
          subline: 'Die nächsten Events',
          events: [
            { title: 'Ötztaler Radmarathon', text: 'Legendärer Radmarathon über 238 km und 5.500 Höhenmeter.', image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=900&q=80', dateLabel: '25.08.2024', locationLabel: 'Sölden', category: 'Sport', priceLabel: 'Startgebühr 95 €', cta: { label: 'Anmelden', href: '/kontakt' } },
            { title: 'Ötztaler Almbabtrieb', text: 'Traditioneller Almbabtrieb mit geschmückten Kühen, Bauernmarkt und Livemusik.', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80', dateLabel: '14.09.2024', locationLabel: 'Umhausen', category: 'Tradition', priceLabel: 'Eintritt frei', cta: { label: 'Mehr Info', href: '/events' } },
            { title: 'Electric Mountain Festival', text: 'Elektronische Musik auf 2.200 m — Après-Ski-Party der Superlative.', image: 'https://images.unsplash.com/photo-1565992441121-4367c2967103?w=900&q=80', dateLabel: '12.–15.12.2024', locationLabel: 'Sölden', category: 'Musik', priceLabel: 'Ab 45 € / Tag', cta: { label: 'Tickets', href: '/events' } },
          ],
        }},
      ],
    },
    /* ─── FAQ ─── */
    {
      slug: 'faq', title: 'FAQ', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Häufig gestellte Fragen',
          subline: 'Alles Wissenswerte für Ihren Ötztal-Urlaub',
          bgImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1800&q=85',
        }},
        { type: 'faq', sortOrder: 1, data: {
          headline: 'FAQ',
          subline: 'Wir beantworten Ihre Fragen',
          items: [
            { question: 'Wie komme ich ins Ötztal?', answer: 'Über die A12 (Inntal-Autobahn) und A13 (Brenner) zur Abfahrt Ötztal. Per Bahn: Bahnhof Ötztal-Bahnhof, dann Bus ins Tal.' },
            { question: 'Gibt es eine Gästekarte?', answer: 'Ja! Die Ötztal Card ist bei teilnehmenden Unterkünften inklusive und bietet freie Bergbahnen und Busse.' },
            { question: 'Wann ist die beste Reisezeit?', answer: 'Sommer (Juni–Sep.) für Wandern, Winter (Nov.–Apr.) für Ski. Herbst für Almbabtrieb und klare Luft.' },
            { question: 'Ist das Ötztal familienfreundlich?', answer: 'Absolut! Kinderbetreuung an den Bergbahnen, Familienraften, Area 47 und viele leichte Wanderungen.' },
            { question: 'Brauche ich ein Auto?', answer: 'Nicht unbedingt. Kostenlose Ötztal-Busse verkehren im gesamten Tal (Ötztal Card).' },
          ],
          ctaPrimary: { label: 'Noch Fragen? Kontakt', href: '/kontakt' },
        }},
        { type: 'visitorInfo', sortOrder: 2, data: {
          headline: 'Gut zu wissen',
          subline: 'Praktische Tipps für Ihren Aufenthalt',
          introText: 'Damit Sie Ihren Ötztal-Urlaub optimal genießen können.',
          blocks: [
            { title: 'Anreise', icon: 'car', text: 'Das Ötztal ist über die A12/A13 sehr gut erreichbar.', items: ['Autobahn A12 → Ausfahrt Ötztal', 'Bahnhof Ötztal-Bahnhof', 'Kostenloser Ötztal-Bus'] },
            { title: 'Ötztal Card', icon: 'ticket', text: 'Die Gästekarte ist Ihr Allround-Ticket.', items: ['Freie Bergbahnen', 'Freie Ötztal-Busse', 'Ermäßigungen bei Attraktionen'] },
            { title: 'Wetter & Ausrüstung', icon: 'cloud', text: 'Alpine Lagen können wettertechnisch überraschen.', items: ['Wetterfeste Kleidung', 'Wanderschuhe empfohlen', 'Sonnenschutz (hohe UV-Strahlung)'] },
          ],
        }},
      ],
    },
    /* ─── Über uns ─── */
    {
      slug: 'ueber-uns', title: 'Über uns', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Über das Ötztal',
          subline: 'Eine Region voller Naturwunder und Traditionen',
          bgImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1800&q=85',
        }},
        { type: 'story', sortOrder: 1, data: {
          headline: 'Unser Tal, unsere Leidenschaft',
          subline: 'Was das Ötztal so besonders macht',
          badgeText: 'Seit Jahrhunderten',
          storyText: 'Das Ötztal erstreckt sich über 65 Kilometer tief in die Ötztaler Alpen hinein — ein Tal, das Geschichte atmet und Natur in ihrer ursprünglichsten Form bewahrt. Von der Fundstelle des Ötzi über jahrhundertealte Almwirtschaft bis hin zu modernem Bergtourismus.\n\nUnser Tourismusverband verbindet diese Tradition mit zeitgemäßem Erlebnis-Tourismus und sorgt dafür, dass Gäste aus aller Welt das Ötztal in seiner ganzen Vielfalt erleben.',
          imagePrimary: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=80',
          imageSecondary: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=900&q=80',
          founderName: 'Josef Falkner',
          founderRole: 'Obmann Tourismusverband',
          founderQuote: 'Das Ötztal ist nicht nur ein Reiseziel — es ist ein Lebensgefühl.',
          values: [
            { icon: 'mountain', title: 'Naturschutz', text: 'Nachhaltiger Tourismus im Einklang mit der alpinen Umwelt.' },
            { icon: 'users', title: 'Gastfreundschaft', text: 'Herzliche Tiroler Gastfreundschaft seit Generationen.' },
            { icon: 'sparkles', title: 'Vielfalt', text: '250 Dreitausender, Gletscher, Seen und Wasserfälle.' },
          ],
          milestones: [
            { year: '1991', title: 'Ötzi-Fund', text: 'Fund der Gletschermumie macht das Ötztal weltbekannt.' },
            { year: '2004', title: 'Skyline Sölden', text: 'Bau der spektakulären Gaislachkogl-Gondel.' },
            { year: '2015', title: 'James Bond', text: 'Dreharbeiten zu SPECTRE in Sölden bringen internationale Aufmerksamkeit.' },
            { year: '2023', title: '365 Tage', text: 'Ganzjahres-Strategie macht das Ötztal zur Vier-Jahreszeiten-Destination.' },
          ],
          ctaPrimary: { label: 'Erlebnisse entdecken', href: '/erlebnisse' },
        }},
        { type: 'testimonials', sortOrder: 2, data: {
          headline: 'Stimmen unserer Gäste',
          subline: 'Was Besucher über das Ötztal sagen',
          badgeText: 'Gästebewertungen',
          ratingValue: '4.8',
          ratingCount: '3.200+',
          items: [
            { name: 'Claudia M.', location: 'München', text: 'Jedes Jahr aufs Neue beeindruckend — die Wanderungen, die Gastfreundschaft, das Essen. Das Ötztal ist unser zweites Zuhause geworden.', rating: 5, avatarUrl: '' },
            { name: 'Thomas W.', location: 'Hamburg', text: 'Die Kombination aus Natur, Sport und Erholung ist einzigartig. Im Winter zum Skifahren, im Sommer zum Wandern — immer perfekt.', rating: 5, avatarUrl: '' },
            { name: 'Sarah K.', location: 'Wien', text: 'Die Wildspitze zu besteigen war ein Lebenstraum. Dank der tollen Bergführer wurde er wahr.', rating: 5, avatarUrl: '' },
          ],
          ctaPrimary: { label: 'Urlaub planen', href: '/erlebnisse' },
        }},
      ],
    },
    /* ─── Kontakt ─── */
    {
      slug: 'kontakt', title: 'Kontakt', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Kontakt & Information',
          subline: 'Wir beraten Sie gerne bei Ihrer Urlaubsplanung',
          bgImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1800&q=85',
        }},
        { type: 'tourismContact', sortOrder: 1, data: {
          headline: 'Infobüro Ötztal',
          subline: 'Persönlich, telefonisch oder per E-Mail',
          introText: 'Unser Team im Infobüro hilft Ihnen bei der Planung — von der Unterkunft bis zur Tourenempfehlung.',
          image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80',
          formEnabled: true,
          infoCards: [
            { icon: 'phone', label: 'Telefon', value: '+43 57200 100' },
            { icon: 'mail', label: 'E-Mail', value: 'info@oetztal.com' },
            { icon: 'map-pin', label: 'Adresse', value: 'Gemeindestraße 4, 6450 Sölden' },
            { icon: 'clock', label: 'Bürozeiten', value: 'Mo–Fr 08:00–18:00, Sa 09:00–12:00' },
          ],
          primaryCta: { label: 'Nachricht senden', href: '/kontakt' },
          secondaryCta: { label: 'Anrufen', href: 'tel:+4357200100' },
        }},
        { type: 'placesMap', sortOrder: 2, data: {
          headline: 'Ötztal auf der Karte',
          subline: 'Wichtige Orte im Überblick',
          mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d43638.8!2d10.84!3d46.97!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x479d0e36a3b6f7a7%3A0x1234567890abcdef!2s6450+S%C3%B6lden!5e0!3m2!1sde!2sat!4v1700000000000',
          places: [
            { title: 'Sölden', text: 'Ski- und Wanderzentrum des Ötztals.', category: 'Ort', distanceLabel: 'Zentrum' },
            { title: 'Obergurgl-Hochgurgl', text: 'Höchstes Kirchdorf Österreichs, schneesicheres Skigebiet.', category: 'Ort', distanceLabel: '15 km von Sölden' },
            { title: 'Umhausen / Stuibenfall', text: 'Tirols höchster Wasserfall und Greifvogelpark.', category: 'Sehenswürdigkeit', distanceLabel: '20 km von Sölden' },
          ],
          ctaPrimary: { label: 'Route planen', href: 'https://www.google.com/maps/dir//Sölden+Tirol' },
        }},
      ],
    },
  ],
  collections: [
    {
      key: 'news', label: 'Neuigkeiten', items: [
        { slug: 'neue-wanderroute-2025', title: 'Neue Panorama-Höhenroute ab Sommer 2025', priority: 0, data: { excerpt: 'Die neue Ötztaler Panoramaroute verbindet 5 Almen auf 18 km — mit spektakulären Ausblicken auf über 50 Dreitausender.', content: '<p>Ab Juni 2025 steht Wanderern eine neue Panorama-Höhenroute zur Verfügung. Die Route führt von der Gaislachkogel-Bergstation über fünf bewirtschaftete Almen bis nach Vent und bietet unterwegs atemberaubende 360°-Bergpanoramen.</p><p>Schwierigkeitsgrad: mittel. Gehzeit: ca. 6 Stunden. Einkehrmöglichkeiten alle 2–3 km.</p>', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80', date: '2025-04-15' } },
        { slug: 'bond-erlebniswelt-update', title: '007 Elements: Neue interaktive Ausstellung am Gaislachkogl', priority: 1, data: { excerpt: 'Die James-Bond-Erlebniswelt am Gipfel des Gaislachkogl bekommt ein umfangreiches Update mit neuen VR-Stationen.', content: '<p>Die spektakuläre 007-Erlebniswelt in 3.048 m Höhe wird erweitert. Neue Virtual-Reality-Stationen lassen Besucher ab Dezember 2025 in Szenen aus SPECTRE eintauchen.</p><p>Geöffnet täglich während der Seilbahnbetriebszeiten. Eintritt: 22 € (Erwachsene), 14 € (Kinder).</p>', image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80', date: '2025-08-10' } },
        { slug: 'oetztal-radmarathon', title: 'Ötztaler Radmarathon 2025: Anmeldung ab sofort', priority: 2, data: { excerpt: 'Der legendäre Ötztaler Radmarathon über 238 km und 5.500 Höhenmeter — Anmeldung für 2025 geöffnet.', content: '<p>Am 31. August 2025 startet der 42. Ötztaler Radmarathon. Die härteste Radveranstaltung der Alpen: 238 km, 5.500 Hm, 4 Alpenpässe (Kühtai, Brenner, Jaufen, Timmelsjoch).</p><p>Limitiert auf 4.000 Startplätze. Erfahrungsgemäß innerhalb weniger Stunden ausverkauft.</p>', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', date: '2025-03-01' } },
      ],
    },
  ],
};
