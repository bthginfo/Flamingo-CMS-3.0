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
            { title: 'Stuibenfall', text: 'Tirols höchster Wasserfall (159 m) mit spektakulärer Hängebrücke und Klettersteig.', image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=900&q=80', category: 'Natur', cta: { label: 'Mehr erfahren', href: '/c/highlights/stuibenfall' } },
            { title: 'Ötzi-Fundstelle', text: 'Die berühmte Fundstelle der Gletschermumie am Similaun — erreichbar über den E5-Fernwanderweg.', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=80', category: 'Kultur', cta: { label: 'Mehr erfahren', href: '/c/highlights/oetzi-fundstelle' } },
            { title: 'Aqua Dome Therme', text: 'Futuristische Thermenanlage in Längenfeld mit Sole-Becken, Saunawelt und Bergpanorama.', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbec6d?w=900&q=80', category: 'Wellness', cta: { label: 'Mehr erfahren', href: '/c/highlights/aqua-dome' } },
            { title: 'Sölden — 007 Elements', text: 'James-Bond-Erlebniswelt auf 3.048 m am Gaislachkogl. Interaktive Kino-Installation im Berg.', image: 'https://images.unsplash.com/photo-1565992441121-4367c2967103?w=900&q=80', category: 'Erlebnis', cta: { label: 'Mehr erfahren', href: '/c/highlights/007-elements' } },
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
            { title: 'Stuibenfall', text: 'Mit 159 m Tirols höchster Wasserfall. Hängebrücke, Aussichtsplattform und Klettersteig.', image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=900&q=80', openingText: 'Frei zugänglich Mai–Okt.', category: 'Natur', cta: { label: 'Details', href: '/c/highlights/stuibenfall' } },
            { title: '007 Elements', text: 'James-Bond-Erlebniswelt auf 3.048 m. Interaktive Kino-Installation im Innern des Gaislachkogls.', image: 'https://images.unsplash.com/photo-1565992441121-4367c2967103?w=900&q=80', openingText: 'Täglich 09:00–16:00', category: 'Erlebnis', cta: { label: 'Tickets', href: '/c/highlights/007-elements' } },
            { title: 'Ötztaler Heimatmuseum', text: 'Geschichte des Ötztals von der Steinzeit bis heute. Ötzi-Ausstellung und traditionelle Stuben.', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80', openingText: 'Di–So 10:00–17:00', category: 'Kultur', cta: { label: 'Details', href: '/c/highlights/heimatmuseum' } },
            { title: 'Area 47 — Outdoor-Playground', text: 'Europas größter Outdoor-Park: Rafting, Canyoning, Hochseilgarten, Wasserrutschen.', image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=900&q=80', openingText: 'Mai–Sep. 10:00–18:00', category: 'Sport', cta: { label: 'Tickets', href: '/c/highlights/area-47' } },
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
            { title: 'Alpenglow Resort & Spa ★★★★★', text: 'Luxushotel mit Spa, Infinity-Pool und Ski-in/Ski-out in Sölden.', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&q=80', category: 'Hotel', typeLabel: '5-Sterne', priceLabel: 'Ab 280 € / Nacht', amenities: ['Spa', 'Pool', 'Restaurant', 'Ski-in/Ski-out'], cta: { label: 'Details', href: '/c/unterkuenfte/alpenglow-resort' } },
            { title: 'Gasthof Stern ★★★', text: 'Traditioneller Tiroler Gasthof mit Halbpension und Stube in Oetz.', image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=900&q=80', category: 'Gasthof', typeLabel: '3-Sterne', priceLabel: 'Ab 85 € / Nacht', amenities: ['Halbpension', 'Sauna', 'Parkplatz', 'WLAN'], cta: { label: 'Details', href: '/c/unterkuenfte/gasthof-stern' } },
            { title: 'Ferienwohnung Alpenblick', text: 'Gemütliche Ferienwohnung für 4 Personen mit Balkon und Bergblick in Umhausen.', image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=900&q=80', category: 'Ferienwohnung', typeLabel: 'Apartment', priceLabel: 'Ab 110 € / Nacht', amenities: ['Küche', 'Balkon', 'WLAN', 'Parkplatz'], cta: { label: 'Details', href: '/c/unterkuenfte/ferienwohnung-alpenblick' } },
            { title: 'Campingplatz Ötztal', text: 'Stellplätze und Mietchalets direkt an der Ötztaler Ache.', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80', category: 'Camping', typeLabel: 'Campingplatz', priceLabel: 'Ab 28 € / Nacht', amenities: ['Sanitäranlagen', 'Spielplatz', 'Grillplatz', 'Strom'], cta: { label: 'Details', href: '/c/unterkuenfte/campingplatz-oetztal' } },
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
            { title: 'Stuibenfall-Rundweg', text: 'Leichte Wanderung zum höchsten Wasserfall Tirols mit Hängebrücke.', image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=900&q=80', category: 'Leicht', lengthLabel: '5,2 km', durationLabel: '2 Std.', difficultyLabel: 'Leicht', startLabel: 'Parkplatz Umhausen', highlights: ['Stuibenfall', 'Hängebrücke', 'Aussichtsplattform'], cta: { label: 'Route ansehen', href: '/c/wanderrouten/stuibenfall-rundweg' } },
            { title: 'Obergurgler Zirbenweg', text: 'Panoramaweg durch den höchsten Zirbenwald Europas mit Blick auf 21 Dreitausender.', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80', category: 'Mittel', lengthLabel: '8,4 km', durationLabel: '3,5 Std.', difficultyLabel: 'Mittel', startLabel: 'Obergurgl Bergbahn', highlights: ['Zirbenwald', '21 Dreitausender-Panorama', 'Schönwieshütte'], cta: { label: 'Route ansehen', href: '/c/wanderrouten/obergurgler-zirbenweg' } },
            { title: 'Similaun — Ötzi-Fundstelle', text: 'Anspruchsvolle Hochtour zur berühmten Fundstelle der Gletschermumie auf 3.210 m.', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=80', category: 'Schwer', lengthLabel: '14,2 km', durationLabel: '7 Std.', difficultyLabel: 'Schwer', startLabel: 'Vernagt-Stausee', highlights: ['Ötzi-Fundstelle', 'Similaunhütte', 'Gletscherpanorama'], cta: { label: 'Route ansehen', href: '/c/wanderrouten/similaun-oetzi' } },
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
            { title: 'Ötztaler Radmarathon', text: 'Legendärer Radmarathon über 238 km und 5.500 Höhenmeter.', image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=900&q=80', dateLabel: '25.08.2024', locationLabel: 'Sölden', category: 'Sport', priceLabel: 'Startgebühr 95 €', cta: { label: 'Anmelden', href: '/c/events/oetztaler-radmarathon' } },
            { title: 'Ötztaler Almbabtrieb', text: 'Traditioneller Almbabtrieb mit geschmückten Kühen, Bauernmarkt und Livemusik.', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80', dateLabel: '14.09.2024', locationLabel: 'Umhausen', category: 'Tradition', priceLabel: 'Eintritt frei', cta: { label: 'Mehr Info', href: '/c/events/almbabtrieb' } },
            { title: 'Electric Mountain Festival', text: 'Elektronische Musik auf 2.200 m — Après-Ski-Party der Superlative.', image: 'https://images.unsplash.com/photo-1565992441121-4367c2967103?w=900&q=80', dateLabel: '12.–15.12.2024', locationLabel: 'Sölden', category: 'Musik', priceLabel: 'Ab 45 € / Tag', cta: { label: 'Tickets', href: '/c/events/electric-mountain-festival' } },
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
      key: 'erlebnisse', label: 'Erlebnisse', items: [
        { slug: 'wandern', title: 'Wandern & Bergtouren', priority: 0, data: { description: 'Über 300 km markierte Wanderwege von der gemütlichen Almrunde bis zur anspruchsvollen Gipfeltour auf über 3.000 m.', features: ['Panorama-Höhenweg (18 km)', 'Geführte Gipfeltouren', '5 bewirtschaftete Almen', 'Kinderwanderwege', 'Sonnenaufgangs-Touren', 'GPS-Tracks kostenlos'], image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=80', content: '<h3>Berge erleben</h3><p>Das Ötztal bietet Wanderungen für jeden Anspruch: Von der gemütlichen Talwanderung entlang der Ötztaler Ache bis zur hochalpinen Gletschertour auf den Wildspitze (3.774 m).</p><p>Unser Wander-Highlight: Die neue Panorama-Höhenroute verbindet 5 Almen auf 18 km und bietet Ausblicke auf über 50 Dreitausender. Einkehr alle 2–3 km garantiert.</p>', price: 'Geführte Tour ab 45 €/Person', cta: { label: 'Tour buchen', href: '/kontakt' } } },
        { slug: 'skifahren', title: 'Skifahren & Snowboard', priority: 1, data: { description: 'Zwei Weltklasse-Skigebiete mit über 360 Pistenkilometern — von November bis Mai auf Gletscher-Garantie.', features: ['Sölden: 144 Pistenkilometer', 'Gurgl: 110 Pistenkilometer', 'Gletscher-Skifahren bis Mai', 'Ski-in/Ski-out Hotels', 'Skischulen für alle Level', 'Après-Ski-Highlights'], image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80', content: '<h3>Winterparadies Ötztal</h3><p>Mit Sölden und Obergurgl-Hochgurgl beherbergt das Ötztal zwei der Top-Skigebiete der Alpen. Der Rettenbachgletscher ermöglicht Skifahren von Oktober bis Mai — schneesicher und sonnenverwöhnt.</p><p>Highlight: Die BIG3 Rallye verbindet alle drei Dreitausender-Gipfel (Gaislachkogl, Tiefenbachkogl, Schwarze Schneid) in einem Tag.</p>', price: 'Tagespass ab 72 €', cta: { label: 'Skipass kaufen', href: '/kontakt' } } },
        { slug: 'mountainbike', title: 'Mountainbike & E-Bike', priority: 2, data: { description: '800 km Bike-Strecken von flowigen Trails bis zum legendären Ötztaler Radmarathon — E-Bike-Ladestationen überall.', features: ['800 km markierte Routen', 'Bike Republic Sölden', 'E-Bike Verleih & Ladestationen', 'Bikepark mit Jumplines', 'Geführte MTB-Touren', 'Radmarathon (238 km)'], image: 'https://images.unsplash.com/photo-1544191696-102dbdaeeaa0?w=900&q=80', content: '<h3>Bike-Eldorado</h3><p>Die Bike Republic Sölden bietet Trails für jeden Level: Vom Blue-Flow-Trail für Einsteiger bis zur Black-Enduro-Strecke für Profis. Shuttle-Service und Gondeltransport inklusive.</p><p>Für E-Biker: Flächendeckendes Ladenetzwerk mit über 30 Stationen im gesamten Tal. Verleih direkt an der Talstation.</p>', price: 'E-Bike Verleih ab 49 €/Tag', cta: { label: 'Bike buchen', href: '/kontakt' } } },
        { slug: 'wellness-therme', title: 'Wellness & Therme', priority: 3, data: { description: 'Aqua Dome Therme mit Innen- und Außenbecken, Saunalandschaft und Panorama-Blick auf die Ötztaler Alpen.', features: ['Aqua Dome Therme', 'Außenbecken 34°C', '12 Saunen & Dampfbäder', 'Spa-Behandlungen', 'Fitness & Yoga', 'Panorama-Relaxzone'], image: 'https://images.unsplash.com/photo-1540555700478-4be289fbec6d?w=900&q=80', content: '<h3>Alpine Entspannung</h3><p>Der Aqua Dome in Längenfeld ist Tirols spektakulärste Therme. Drei freistehende Schalen-Außenbecken mit 34°C warmem Thermalwasser bieten bei jeder Jahreszeit ein unvergessliches Erlebnis — mit direktem Bergpanorama.</p><p>Die Saunalandschaft umfasst 12 verschiedene Aufguss-Saunen, Dampfbäder und Kältekammern auf 2.000 m².</p>', price: 'Tageskarte ab 39 €', cta: { label: 'Tickets buchen', href: '/kontakt' } } },
        { slug: 'klettern', title: 'Klettern & Klettersteige', priority: 4, data: { description: 'Von Anfänger-Klettersteigen bis zu extremen alpinen Routen — das Ötztal ist ein Kletter-Hotspot.', features: ['15 Klettersteige (A–E)', 'Klettergarten Längenfeld', 'Hochseilgarten', 'Eisklettern im Winter', 'Kletterkurse für Anfänger', 'Bergführer buchbar'], image: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?w=900&q=80', content: '<h3>Vertikale Abenteuer</h3><p>Das Ötztal bietet 15 Klettersteige in allen Schwierigkeitsgraden. Vom familienfreundlichen Lehner Wasserfall (A/B) bis zum anspruchsvollen Reinhard-Schiestl-Steig (D/E) ist für jeden etwas dabei.</p><p>Für Einsteiger: Unser Klettergarten in Längenfeld mit über 80 Routen von 3+ bis 9a — ideal zum Trainieren.</p>', price: 'Kurs ab 65 €/Person', cta: { label: 'Kurs buchen', href: '/kontakt' } } },
      ],
    },
    {
      key: 'news', label: 'Neuigkeiten', items: [
        { slug: 'neue-wanderroute-2025', title: 'Neue Panorama-Höhenroute ab Sommer 2025', priority: 0, data: { excerpt: 'Die neue Ötztaler Panoramaroute verbindet 5 Almen auf 18 km — mit spektakulären Ausblicken auf über 50 Dreitausender.', content: '<p>Ab Juni 2025 steht Wanderern eine neue Panorama-Höhenroute zur Verfügung. Die Route führt von der Gaislachkogel-Bergstation über fünf bewirtschaftete Almen bis nach Vent und bietet unterwegs atemberaubende 360°-Bergpanoramen.</p><p>Schwierigkeitsgrad: mittel. Gehzeit: ca. 6 Stunden. Einkehrmöglichkeiten alle 2–3 km.</p>', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80', date: '2025-04-15' } },
        { slug: 'bond-erlebniswelt-update', title: '007 Elements: Neue interaktive Ausstellung am Gaislachkogl', priority: 1, data: { excerpt: 'Die James-Bond-Erlebniswelt am Gipfel des Gaislachkogl bekommt ein umfangreiches Update mit neuen VR-Stationen.', content: '<p>Die spektakuläre 007-Erlebniswelt in 3.048 m Höhe wird erweitert. Neue Virtual-Reality-Stationen lassen Besucher ab Dezember 2025 in Szenen aus SPECTRE eintauchen.</p><p>Geöffnet täglich während der Seilbahnbetriebszeiten. Eintritt: 22 € (Erwachsene), 14 € (Kinder).</p>', image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80', date: '2025-08-10' } },
        { slug: 'oetztal-radmarathon', title: 'Ötztaler Radmarathon 2025: Anmeldung ab sofort', priority: 2, data: { excerpt: 'Der legendäre Ötztaler Radmarathon über 238 km und 5.500 Höhenmeter — Anmeldung für 2025 geöffnet.', content: '<p>Am 31. August 2025 startet der 42. Ötztaler Radmarathon. Die härteste Radveranstaltung der Alpen: 238 km, 5.500 Hm, 4 Alpenpässe (Kühtai, Brenner, Jaufen, Timmelsjoch).</p><p>Limitiert auf 4.000 Startplätze. Erfahrungsgemäß innerhalb weniger Stunden ausverkauft.</p>', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', date: '2025-03-01' } },
      ],
    },
    {
      key: 'highlights', label: 'Highlights', items: [
        { slug: 'stuibenfall', title: 'Stuibenfall', priority: 0, data: { description: 'Mit 159 Metern ist der Stuibenfall Tirols höchster Wasserfall. Eine spektakuläre Hängebrücke in 80 m Höhe und eine Aussichtsplattform bieten einzigartige Perspektiven auf die tosenden Wassermassen.', features: ['159 m Fallhöhe', 'Hängebrücke (80 m)', 'Aussichtsplattform', 'Klettersteig (B/C)', 'Rundwanderweg 5 km', 'Kinderfreundlich'], image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=900&q=80', content: '<h3>Tirols höchster Wasserfall</h3><p>Der Stuibenfall bei Umhausen stürzt in zwei Stufen insgesamt 159 Meter in die Tiefe und ist damit der höchste Wasserfall Tirols. Ein gut ausgebauter Wanderweg führt in ca. 30 Minuten vom Parkplatz Umhausen bis zur spektakulären Hängebrücke.</p><p>Für Klettersteig-Begeisterte: Der Stuibenfall-Klettersteig (Schwierigkeit B/C) führt direkt neben den Wassermassen nach oben — ein unvergessliches Erlebnis bei Sonnenschein, wenn sich Regenbögen in der Gischt bilden.</p><h3>Praktische Infos</h3><p>Frei zugänglich von Mai bis Oktober. Parkplatz in Umhausen (gebührenpflichtig). Einkehrmöglichkeit beim Gasthof Stuibenfall direkt am Weg.</p>', price: 'Frei zugänglich', cta: { label: 'Route planen', href: '/kontakt' } } },
        { slug: 'oetzi-fundstelle', title: 'Ötzi-Fundstelle am Similaun', priority: 1, data: { description: 'Die berühmte Fundstelle der 5.300 Jahre alten Gletschermumie „Ötzi" am Tisenjoch (3.210 m) — erreichbar über den E5-Fernwanderweg oder von der Similaunhütte aus.', features: ['3.210 m Höhe', 'Markierter Steig', 'Similaunhütte als Basis', 'Hochalpine Tour', 'Gedenkstein am Fundort', 'E5-Fernwanderweg'], image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=80', content: '<h3>Auf den Spuren des Ötzi</h3><p>Am 19. September 1991 entdeckten die Nürnberger Eheleute Simon in 3.210 m Höhe am Tisenjoch die besterhaltene Gletschermumie der Welt. Heute markiert ein Gedenkstein die exakte Fundstelle.</p><p>Der Aufstieg von der Similaunhütte (2.766 m) dauert ca. 1,5 Stunden. Die Tour erfordert alpine Erfahrung — gutes Schuhwerk, Wetterschutz und Trittsicherheit sind Pflicht. Die Similaunhütte bietet Übernachtung und Verpflegung.</p><h3>Alternativ: Ötztaler Heimatmuseum</h3><p>Wer die hochalpine Tour scheut, findet im Ötztaler Heimatmuseum in Längenfeld eine ausführliche Ausstellung zur Ötzi-Geschichte.</p>', price: 'Frei zugänglich (Hüttenübernachtung ca. 45 €)', cta: { label: 'Tour planen', href: '/kontakt' } } },
        { slug: 'aqua-dome', title: 'Aqua Dome Therme', priority: 2, data: { description: 'Futuristische Thermenanlage in Längenfeld mit drei freistehenden Schalen-Außenbecken, 12 Saunen und direktem Blick auf die Ötztaler Alpen — Entspannung auf höchstem Niveau.', features: ['3 Schalen-Außenbecken (34°C)', '12 Saunen & Dampfbäder', 'Spa & Massagen', 'Sportbecken 25 m', 'Kinderbereich', 'Panorama-Relaxzone'], image: 'https://images.unsplash.com/photo-1540555700478-4be289fbec6d?w=900&q=80', content: '<h3>Alpine Wellness der Extraklasse</h3><p>Der Aqua Dome in Längenfeld ist Tirols spektakulärste Therme. Die drei ikonischen Schalen-Außenbecken mit 34°C warmem Thermalwasser scheinen über dem Tal zu schweben — mit freiem Blick auf die umliegenden Dreitausender.</p><p>Die Saunalandschaft auf über 2.000 m² umfasst 12 verschiedene Saunen und Dampfbäder — von der Tiroler Zirbensauna bis zur Soledampfgrotte. Regelmäßige Aufguss-Events mit Bergkräutern.</p><h3>Öffnungszeiten & Preise</h3><p>Täglich 09:00–23:00 Uhr. Tageskarte Erwachsene: ab 39 €. Familienkarten und Abendtarife verfügbar.</p>', price: 'Tageskarte ab 39 €', cta: { label: 'Tickets buchen', href: '/kontakt' } } },
        { slug: '007-elements', title: '007 Elements', priority: 3, data: { description: 'James-Bond-Erlebniswelt auf 3.048 m am Gaislachkogl in Sölden. Interaktive Kino-Installation im Innern des Berges — dort wo SPECTRE gedreht wurde.', features: ['3.048 m Höhe', 'Interaktive Installationen', 'Original-Drehorte', 'VR-Stationen', 'Ice Q Restaurant nebenan', 'Erreichbar per Gondel'], image: 'https://images.unsplash.com/photo-1565992441121-4367c2967103?w=900&q=80', content: '<h3>Im Berg des Bösen</h3><p>007 Elements ist eine cineastische Installation im Innern des Gaislachkogl-Gipfels in Sölden. Auf über 1.300 m² erleben Besucher die Welt von James Bond durch interaktive Stationen, Projektionen und Original-Requisiten aus SPECTRE (2015).</p><p>Die Erlebniswelt wurde vom Londoner Architekten Neal Callow gestaltet und fügt sich dramatisch in den Berg ein. Nebenan: das architektonisch spektakuläre Gourmet-Restaurant Ice Q.</p><h3>Anfahrt & Tickets</h3><p>Erreichbar mit der Gaislachkogelbahn (3 Sektionen). Geöffnet täglich 09:00–16:00 Uhr während der Seilbahnbetriebszeiten. Eintritt: 22 € (Erw.), 14 € (Kinder 6–14 J.), Kombikarte mit Bergbahn verfügbar.</p>', price: 'Eintritt 22 € (Erw.), Kombikarte ab 52 €', cta: { label: 'Tickets kaufen', href: '/kontakt' } } },
        { slug: 'heimatmuseum', title: 'Ötztaler Heimatmuseum', priority: 4, data: { description: 'Geschichte des Ötztals von der Steinzeit bis heute — mit Ötzi-Ausstellung, traditionellen Bauernstuben und Sonderausstellungen zur alpinen Kulturgeschichte.', features: ['Ötzi-Dauerausstellung', 'Historische Bauernstuben', 'Sonderausstellungen', 'Museumsshop', 'Familienführungen', 'Barrierefreier Zugang'], image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80', content: '<h3>5.300 Jahre Geschichte</h3><p>Das Ötztaler Heimatmuseum in Längenfeld dokumentiert die faszinierende Geschichte des Tals — von den ersten Siedlern bis zum modernen Tourismus. Herzstück ist die Ötzi-Ausstellung mit Repliken der Fundgegenstände und einer lebensgroßen Rekonstruktion des Mannes aus dem Eis.</p><p>Besonders sehenswert: Die original eingerichteten Bauernstuben aus dem 17.–19. Jahrhundert zeigen, wie die Ötztaler Bevölkerung in karger Bergumgebung lebte und wirtschaftete.</p><h3>Besuch planen</h3><p>Geöffnet Di–So 10:00–17:00 Uhr (Juni–Oktober). Eintritt: 8 € (Erw.), 4 € (Kinder). Familienführungen jeden Mittwoch 14:00 Uhr.</p>', price: 'Eintritt 8 € (Erw.)', cta: { label: 'Mehr erfahren', href: '/kontakt' } } },
        { slug: 'area-47', title: 'Area 47 — Outdoor-Playground', priority: 5, data: { description: 'Europas größter Outdoor-Freizeitpark im Ötztal: Rafting, Canyoning, Hochseilgarten, Wasserrutschen, Wakeboarding und vieles mehr — Abenteuer für alle ab 6 Jahren.', features: ['Rafting & Canyoning', 'XXL-Wasserrutschen', 'Hochseilgarten', 'Wakeboard-Anlage', 'Kletterwand 20 m', 'Camping & Übernachtung'], image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=900&q=80', content: '<h3>Adrenalin im Herzen der Alpen</h3><p>Die Area 47 in Ötz vereint über 40 Outdoor-Aktivitäten auf einem Gelände — vom Rafting auf der Ötztaler Ache über Canyoning in spektakulären Schluchten bis zu XXL-Wasserrutschen und einem 20 m hohen Kletterturm.</p><p>Neuheit 2025: Die „Flying Fox XXL" — 600 m Seilrutsche über den Badesee mit Geschwindigkeiten bis 80 km/h.</p><h3>Öffnungszeiten & Preise</h3><p>Ganztageskarte ab 49 € (Erw.), 35 € (Kinder 6–14 J.). Geöffnet Mai–September, täglich 10:00–18:00 Uhr. Campingplatz direkt am Gelände verfügbar.</p>', price: 'Tageskarte ab 49 €', cta: { label: 'Tickets buchen', href: '/kontakt' } } },
      ],
    },
    {
      key: 'unterkuenfte', label: 'Unterkünfte', items: [
        { slug: 'alpenglow-resort', title: 'Alpenglow Resort & Spa ★★★★★', priority: 0, data: { description: 'Luxuriöses 5-Sterne-Resort in Sölden mit Infinity-Pool, Spa auf 2.000 m² und direktem Zugang zur Skipiste. Das Flaggschiff-Hotel im Ötztal.', features: ['Infinity-Pool mit Bergblick', 'Spa & Wellness 2.000 m²', 'Ski-in/Ski-out', 'Gourmet-Restaurant', 'Suiten mit Panoramablick', 'Tiefgarage & E-Ladestationen'], image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&q=80', content: '<h3>Luxus trifft Alpenkultur</h3><p>Das Alpenglow Resort & Spa verbindet zeitgenössisches Design mit Tiroler Gastfreundschaft. Alle 86 Zimmer und Suiten bieten freien Blick auf die Ötztaler Gletscherwelt. Das hauseigene Restaurant serviert regionale Kulinarik auf Hauben-Niveau.</p><p>Winter-Highlight: Ski-in/Ski-out direkt an der Giggijoch-Gondel. Sommer-Highlight: Infinity-Außenpool mit Bergpanorama.</p><h3>Buchung</h3><p>Doppelzimmer ab 280 €/Nacht inkl. Frühstück. Suite ab 520 €/Nacht. Halbpension +45 €/Person.</p>', price: 'Ab 280 € / Nacht', cta: { label: 'Anfragen', href: '/kontakt' } } },
        { slug: 'gasthof-stern', title: 'Gasthof Stern ★★★', priority: 1, data: { description: 'Traditioneller Tiroler Gasthof mit Halbpension und gemütlicher Stube in Oetz — familiäre Atmosphäre seit 1923.', features: ['Halbpension inklusive', 'Tiroler Stube', 'Finnische Sauna', 'Hauseigener Parkplatz', 'Garten & Terrasse', 'WLAN in allen Zimmern'], image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=900&q=80', content: '<h3>Tiroler Gastlichkeit seit 1923</h3><p>Der Gasthof Stern wird in dritter Generation von Familie Müller geführt. 22 gemütliche Zimmer mit Holzbalkendecken und Bergblick bieten den perfekten Rückzugsort nach einem aktiven Tag in der Natur.</p><p>Das Frühstücksbuffet mit regionalen Produkten und das 4-Gang-Abendmenü sind legendär — Tiroler Küche vom Feinsten mit Produkten aus eigener Landwirtschaft.</p><h3>Preise</h3><p>DZ mit Halbpension ab 85 €/Person/Nacht. Einzelzimmer ab 70 €. Kinder bis 6 Jahre frei im Elternzimmer.</p>', price: 'Ab 85 € / Nacht (HP)', cta: { label: 'Anfragen', href: '/kontakt' } } },
        { slug: 'ferienwohnung-alpenblick', title: 'Ferienwohnung Alpenblick', priority: 2, data: { description: 'Gemütliche Ferienwohnung für 2–4 Personen mit sonnigem Balkon, voll ausgestatteter Küche und freiem Bergblick in Umhausen.', features: ['2-Zimmer (55 m²)', 'Voll ausgestattete Küche', 'Sonniger Süd-Balkon', 'Gratis Parkplatz', 'WLAN & Smart-TV', 'Waschmaschine'], image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=900&q=80', content: '<h3>Zuhause in den Bergen</h3><p>Die Ferienwohnung Alpenblick liegt ruhig oberhalb von Umhausen mit freiem Blick auf das Ötztal und den Stuibenfall. Die 55 m² große Wohnung bietet alles für einen unabhängigen Urlaub: moderne Küche, gemütliches Wohnzimmer mit Kachelofen und ein Schlafzimmer mit Doppelbett.</p><p>Ideal als Ausgangspunkt für Wanderungen zum Stuibenfall (15 Min.), zur Area 47 (10 Min. Autofahrt) oder ins Skigebiet Hochoetz (5 Min.).</p><h3>Konditionen</h3><p>Ab 110 €/Nacht (2 Personen), jede weitere Person +20 €. Mindestaufenthalt 3 Nächte. Endreinigung 60 € einmalig.</p>', price: 'Ab 110 € / Nacht', cta: { label: 'Anfragen', href: '/kontakt' } } },
        { slug: 'campingplatz-oetztal', title: 'Campingplatz Ötztal', priority: 3, data: { description: 'Naturnaher Campingplatz direkt an der Ötztaler Ache mit Stellplätzen, Mietchalets und modernen Sanitäranlagen — ideal für naturverbundene Gäste.', features: ['80 Stellplätze (Strom)', '6 Mietchalets', 'Moderne Sanitäranlagen', 'Grillplatz & Lagerfeuer', 'Spielplatz', 'Direkt am Fluss'], image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80', content: '<h3>Camping im Herzen des Ötztals</h3><p>Der Campingplatz liegt idyllisch an der Ötztaler Ache und bietet 80 großzügige Stellplätze mit Stromanschluss. Wer kein eigenes Equipment hat, kann eines der 6 komfortablen Mietchalets (2–4 Personen) buchen.</p><p>Highlight: Direkt vom Platz aus starten Wanderwege, ein Badeplatz am Fluss ist in 2 Minuten erreichbar. Hunde willkommen!</p><h3>Preise</h3><p>Stellplatz ab 28 €/Nacht (2 Pers. + Strom). Mietchalet ab 89 €/Nacht. Nebensaison-Rabatt 20%.</p>', price: 'Stellplatz ab 28 € / Nacht', cta: { label: 'Reservieren', href: '/kontakt' } } },
      ],
    },
    {
      key: 'wanderrouten', label: 'Wanderrouten', items: [
        { slug: 'stuibenfall-rundweg', title: 'Stuibenfall-Rundweg', priority: 0, data: { description: 'Leichte Rundwanderung zum höchsten Wasserfall Tirols — mit Hängebrücke, Aussichtsplattform und Einkehrmöglichkeit. Ideal für Familien.', features: ['5,2 km Länge', 'ca. 2 Stunden', 'Leicht (familienfreundlich)', 'Hängebrücke 80 m Höhe', 'Aussichtsplattform', 'Einkehr Gasthof Stuibenfall'], image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=900&q=80', content: '<h3>Wanderung zum Stuibenfall</h3><p>Start am Parkplatz Umhausen (Gebühr 4 €). Der gut ausgebaute Weg führt in ca. 30 Minuten zur spektakulären Hängebrücke in 80 m Höhe über dem Wasserfall. Von dort weiter zur Aussichtsplattform mit bestem Blick auf die gesamte 159-m-Kaskade.</p><p>Der Rundweg führt über die Niedertalbrücke zurück zum Ausgangspunkt. Unterwegs informieren Schautafeln über Geologie und Natur des Ötztals.</p><h3>Tipps</h3><p>Beste Zeit: Mai–Oktober, bei Schneeschmelze (Juni) besonders beeindruckend. Festes Schuhwerk empfohlen. Kinderwagentauglich bis zur Brücke.</p>', price: 'Frei zugänglich (Parkgebühr 4 €)', cta: { label: 'Route auf Komoot', href: '/kontakt' } } },
        { slug: 'obergurgler-zirbenweg', title: 'Obergurgler Zirbenweg', priority: 1, data: { description: 'Panoramaweg durch den höchstgelegenen Zirbenwald Europas mit Ausblicken auf 21 Dreitausender — ein Naturjuwel im Hochgebirge.', features: ['8,4 km Länge', 'ca. 3,5 Stunden', 'Mittel (Trittsicherheit)', '21 Dreitausender-Panorama', 'Älteste Zirbe: 750 Jahre', 'Einkehr Schönwieshütte'], image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80', content: '<h3>Durch den ältesten Zirbenwald Europas</h3><p>Der Zirbenweg auf 2.000–2.200 m Höhe bei Obergurgl führt durch einen der ältesten und höchstgelegenen Zirbenwälder der Alpen. Manche der knorrigen Bäume sind über 750 Jahre alt.</p><p>Der Panoramaweg bietet durchgehend freie Sicht auf die Gletscherwelt: Gurgler Ferner, Rotmoosgletscher und 21 Dreitausender im Blickfeld. Unterwegs laden die Schönwieshütte und die Gurgler Alm zur Einkehr ein.</p><h3>Anfahrt & Tipps</h3><p>Start: Bergstation Obergurgl. Rückfahrt: Abstieg nach Obergurgl oder Bus. Beste Zeit: Juni–September. Wanderstöcke empfohlen.</p>', price: 'Bergbahn-Ticket 18 € (retour)', cta: { label: 'Route auf Komoot', href: '/kontakt' } } },
        { slug: 'similaun-oetzi', title: 'Similaun — Ötzi-Fundstelle', priority: 2, data: { description: 'Anspruchsvolle Hochtour zur berühmten Fundstelle der Gletschermumie auf 3.210 m — mit Übernachtung auf der Similaunhütte.', features: ['14,2 km Länge', 'ca. 7 Stunden (2 Tage empf.)', 'Schwer (Hochalpin)', 'Ötzi-Fundstelle 3.210 m', 'Similaunhütte (2.766 m)', 'Gletscherpanorama'], image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=80', content: '<h3>Hochalpine Tour zum Tisenjoch</h3><p>Diese anspruchsvolle Tour führt von der Martin-Busch-Hütte (2.501 m) über die Similaunhütte (2.766 m) zum Tisenjoch (3.210 m) — dem exakten Fundort des Ötzi. Der Gedenkstein markiert die Stelle, an der 1991 die 5.300 Jahre alte Gletschermumie entdeckt wurde.</p><p>Empfohlene Variante: 2-Tages-Tour mit Übernachtung auf der Similaunhütte. Am zweiten Tag Aufstieg zum Tisenjoch (ca. 2 Stunden) und Rückkehr.</p><h3>Voraussetzungen</h3><p>Alpine Erfahrung erforderlich. Trittsicherheit, Schwindelfreiheit, gute Kondition. Ausrüstung: Bergschuhe, Wetterschutz, Stöcke. Im Frühsommer evtl. Steigeisen nötig. Hüttenreservierung empfohlen!</p>', price: 'Hüttenübernachtung ca. 45 €', cta: { label: 'Tour planen', href: '/kontakt' } } },
      ],
    },
    {
      key: 'events', label: 'Events', items: [
        { slug: 'oetztaler-radmarathon', title: 'Ötztaler Radmarathon', priority: 0, data: { description: 'Der legendäre Ötztaler Radmarathon — 238 km, 5.500 Höhenmeter, 4 Alpenpässe. Eine der härtesten Radveranstaltungen der Alpen, seit 1981.', features: ['238 km Strecke', '5.500 Höhenmeter', '4 Alpenpässe', '4.000 Startplätze', 'Verpflegungsstationen alle 30 km', 'Zeitlimit 14 Stunden'], image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=900&q=80', content: '<h3>Die Königsetappe der Alpen</h3><p>Seit 1981 starten jeden letzten Sonntag im August bis zu 4.000 Radsportler in Sölden zum härtesten Radmarathon Europas: über Kühtai (2.017 m), Brenner (1.370 m), Jaufenpass (2.094 m) und Timmelsjoch (2.474 m) zurück nach Sölden.</p><p>Die Startplätze sind jedes Jahr innerhalb weniger Stunden vergriffen. Vorregistrierung empfohlen. Finisher-Quote: ca. 85%.</p><h3>Teilnahme</h3><p>Startgebühr: 95 €. Anmeldung ab März. Zeitlimit 14 Stunden. Ärztliches Attest erforderlich. Trainingstipps und GPS-Tracks auf der offiziellen Website.</p>', price: 'Startgebühr 95 €', cta: { label: 'Anmelden', href: '/kontakt' } } },
        { slug: 'almbabtrieb', title: 'Ötztaler Almabtrieb', priority: 1, data: { description: 'Traditioneller Almabtrieb in Umhausen — festlich geschmückte Kühe kehren von den Almen ins Tal zurück, begleitet von Musik, Bauernmarkt und Tiroler Schmankerln.', features: ['Festlich geschmückte Kühe', 'Bauernmarkt & Handwerk', 'Livemusik & Plattler', 'Tiroler Spezialitäten', 'Eintritt frei', 'Kinderpatradies'], image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80', content: '<h3>Lebendige Tiroler Tradition</h3><p>Mitte September kehren über 300 bunt geschmückte Kühe von den Ötztaler Hochalmen ins Tal zurück. Der Almabtrieb in Umhausen ist eines der authentischsten Brauchtumsfeste Tirols — keine Touristenshow, sondern gelebte Tradition.</p><p>Begleitprogramm: Bauernmarkt mit regionalen Produkten (Käse, Speck, Schnaps), Volksmusik, Schuhplattler-Vorführungen und Handwerksvorführungen. Für Kinder: Streichelzoo und Ponyreiten.</p><h3>Infos</h3><p>Datum: Mitte September (wetterabhängig). Start: ca. 10:00 Uhr am Ortseingang Umhausen. Eintritt frei. Parkplätze ausgeschildert, früh kommen empfohlen!</p>', price: 'Eintritt frei', cta: { label: 'Mehr erfahren', href: '/kontakt' } } },
        { slug: 'electric-mountain-festival', title: 'Electric Mountain Festival', priority: 2, data: { description: 'Elektronische Musik auf 2.200 m Höhe — das Electric Mountain Festival in Sölden verbindet Après-Ski mit internationalen DJs in spektakulärer Bergkulisse.', features: ['2.200 m Höhe', 'Internationale Top-DJs', '4 Tage / 3 Stages', 'Open-Air am Gletscher', 'Après-Ski-Partys', 'Ski-Tagespass inklusive'], image: 'https://images.unsplash.com/photo-1565992441121-4367c2967103?w=900&q=80', content: '<h3>Feiern über den Wolken</h3><p>Das Electric Mountain Festival transformiert die Skigebiets-Infrastruktur in Sölden in eine Hochgebirgs-Party-Location. Auf drei Bühnen — Giggijoch (Open Air), Gaislachkogl (Indoor) und Talstation (Après) — legen internationale DJs elektronische Musik auf.</p><p>Das Besondere: Tagsüber Skifahren auf perfekten Pisten, abends feiern mit Bergpanorama. Ein Erlebnis, das es so nur in Sölden gibt.</p><h3>Tickets & Infos</h3><p>4-Tages-Pass ab 145 € (inkl. Ski-Tagespass). Einzeltag ab 45 €. Unterkünfte in Sölden schnell ausgebucht — frühzeitig reservieren!</p>', price: 'Tagesticket ab 45 €', cta: { label: 'Tickets kaufen', href: '/kontakt' } } },
      ],
    },
  ],
};
