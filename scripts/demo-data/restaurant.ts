/**
 * Rich demo seed: Restaurant (Trattoria Dal Maestro)
 * Section types match template keys in templates/index.ts:
 * hero, menu, reservation, openingHours, signatureDishes, events, ambience, richText
 */
export const RESTAURANT_CONFIG = {
  slug: 'demo-restaurant',
  name: 'Trattoria Dal Maestro',
  industry: 'restaurant' as const,
  activeStyle: 'classic',
  brand: {
    companyName: 'Trattoria Dal Maestro',
    tagline: 'Authentische italienische Küche seit 1987',
    primaryColor: '#7e4023',
    secondaryColor: '#b7632f',
    accentColor: '#d4a574',
  },
  contact: { phone: '+49 89 123 456 78', email: 'info@dal-maestro.de', address: 'Maximilianstraße 12, 80539 München' },
  socialLinks: { instagram: 'https://instagram.com/dalmaestro', facebook: 'https://facebook.com/dalmaestro' },
  openingHours: [
    { day: 'Mo–Fr', hours: '11:30–14:30, 17:30–23:00' },
    { day: 'Sa', hours: '17:30–23:30' },
    { day: 'So', hours: '11:30–22:00' },
  ],
  navItems: [
    { label: 'Startseite', href: '/', type: 'link' },
    { label: 'Speisekarte', href: '/speisekarte', type: 'link' },
    { label: 'Über uns', href: '/ueber-uns', type: 'link' },
    { label: 'Galerie', href: '/galerie', type: 'link' },
    { label: 'Events', href: '/events', type: 'link' },
    { label: 'Reservierung', href: '/reservierung', type: 'link' },
    { label: 'Kontakt', href: '/kontakt', type: 'link' },
  ],
  navCta: { label: 'Tisch reservieren', href: '/reservierung' },
  footerColumns: [
    { title: 'Restaurant', items: [{ text: 'Speisekarte', href: '/speisekarte' }, { text: 'Über uns', href: '/ueber-uns' }, { text: 'Events', href: '/events' }] },
    { title: 'Service', items: [{ text: 'Reservierung', href: '/reservierung' }, { text: 'Öffnungszeiten', href: '/reservierung' }] },
    { title: 'Kontakt', items: [{ text: '+49 89 123 456 78' }, { text: 'info@dal-maestro.de' }, { text: 'Maximilianstraße 12, München' }] },
  ],
  footerLegalLinks: [{ label: 'Impressum', href: '/impressum' }, { label: 'Datenschutz', href: '/datenschutz' }],
  footerCta: { label: 'Reservieren', href: '/reservierung' },
  pages: [
    /* ─── Startseite ─── */
    {
      slug: 'startseite', title: 'Startseite', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Trattoria Dal Maestro',
          subline: 'Seit 1987 servieren wir Ihnen authentische italienische Küche im Herzen Münchens — mit Liebe, frischen Zutaten und Leidenschaft.',
          badgeText: 'Seit 1987',
          bgImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1800&q=85',
          trustItems: ['Frische Pasta täglich', 'Hauseigene Weinbar', 'Dachterrasse'],
          primaryCta: { label: 'Tisch reservieren', href: '/reservierung' },
          secondaryCta: { label: 'Speisekarte', href: '/speisekarte' },
        }},
        { type: 'signatureDishes', sortOrder: 1, data: {
          headline: 'Unsere Signature Dishes',
          subline: 'Die Klassiker unserer Küche',
          badgeText: 'Empfehlung des Hauses',
          dishes: [
            { name: 'Ossobuco alla Milanese', description: 'Geschmorte Kalbshaxe mit Safranrisotto und Gremolata — unser Signature Dish seit Tag 1.', price: '38 €', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=900&q=80', label: 'Bestseller', ingredients: ['Kalbshaxe', 'Safranrisotto', 'Gremolata'] },
            { name: 'Tagliatelle al Tartufo', description: 'Handgemachte Tagliatelle mit frischem schwarzem Trüffel aus dem Piemont, Parmigiano und Trüffelbutter.', price: '32 €', image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=900&q=80', label: 'Saisonal', ingredients: ['Frische Pasta', 'Schwarzer Trüffel', 'Parmigiano'] },
            { name: 'Branzino al Forno', description: 'Ganzer Wolfsbarsch aus dem Ofen mit Zitronen-Kräuterkruste, Ofenkartoffeln und Grillgemüse.', price: '34 €', image: 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=900&q=80', label: 'Fisch', ingredients: ['Wolfsbarsch', 'Kräuterkruste', 'Ofenkartoffeln'] },
          ],
        }},
        { type: 'ambience', sortOrder: 2, data: {
          headline: 'Unser Ambiente',
          subline: 'Genuss für alle Sinne',
          badgeText: 'Seit 1987',
          imagePrimary: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&q=80',
          imageSecondary: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=80',
          imageTertiary: 'https://images.unsplash.com/photo-1528823872057-9c018a7a7553?w=900&q=80',
          highlights: [
            { title: 'Dachterrasse mit Alpenblick', text: 'An lauen Abenden genießen Sie auf unserer Dachterrasse mediterranes Flair mit Blick auf die Frauenkirche.', icon: 'sun' },
            { title: 'Hauseigene Weinbar', text: 'Über 300 Positionen aus allen Regionen Italiens, kuratiert von Sommelier Marco.', icon: 'wine' },
            { title: 'Offene Show-Küche', text: 'Erleben Sie unseren Küchenchef Giovanni bei der Zubereitung — direkt vor Ihren Augen.', icon: 'flame' },
          ],
          ctaPrimary: { label: 'Reservieren', href: '/reservierung' },
        }},
        { type: 'events', sortOrder: 3, data: {
          headline: 'Events & Specials',
          subline: 'Kulinarische Highlights im Dal Maestro',
          events: [
            { title: 'Trüffel-Woche', dateLabel: '15.–21. November 2024', description: 'Eine ganze Woche im Zeichen des weißen Alba-Trüffels. 5-Gänge-Menü mit Weinbegleitung.', image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=900&q=80', priceLabel: '98 € p.P.', cta: { label: 'Reservieren', href: '/reservierung' } },
            { title: 'Weinprobe Toskana', dateLabel: 'Jeden 1. Donnerstag', description: '6 ausgewählte Weine mit Antipasti-Begleitung. Sommelier Marco führt durch den Abend.', image: 'https://images.unsplash.com/photo-1528823872057-9c018a7a7553?w=900&q=80', priceLabel: '59 € p.P.', cta: { label: 'Tickets', href: '/reservierung' } },
            { title: 'Sunday Brunch Italiano', dateLabel: 'Jeden Sonntag', timeLabel: '10:30–14:00', description: 'Brunch-Buffet mit Antipasti, Pasta-Station, Dolci und Prosecco.', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=80', priceLabel: '45 € p.P.', cta: { label: 'Reservieren', href: '/reservierung' } },
          ],
        }},
        { type: 'openingHours', sortOrder: 4, data: {
          headline: 'Öffnungszeiten',
          subline: 'Wir freuen uns auf Ihren Besuch',
          kitchenHoursHeadline: 'Küche',
          kitchenHoursText: 'Warme Küche bis 30 Min. vor Schließung.',
          holidayNote: 'An Feiertagen gesonderte Zeiten — bitte telefonisch erfragen.',
          days: [
            { label: 'Montag–Freitag', hours: '11:30–14:30, 17:30–23:00' },
            { label: 'Samstag', hours: '17:30–23:30' },
            { label: 'Sonntag', hours: '11:30–22:00' },
            { label: 'Dienstag', hours: 'Ruhetag', closed: true },
          ],
          ctaPrimary: { label: 'Tisch reservieren', href: '/reservierung' },
        }},
        { type: 'newsPreview', sortOrder: 5, data: {
          headline: 'Neuigkeiten',
          subline: 'Aktuelles aus dem Dal Maestro',
          collectionKey: 'news',
          linkLabel: 'Alle Beiträge',
          linkHref: '/neuigkeiten',
        }},
      ],
    },
    {
      slug: 'speisekarte', title: 'Speisekarte', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Unsere Speisekarte',
          subline: 'Frische Pasta, edle Weine, handgemachte Dolci — la dolce vita in München',
          bgImage: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1800&q=85',
        }},
        { type: 'menu', sortOrder: 1, data: {
          headline: 'Speisekarte',
          subline: 'Saisonal & frisch',
          badgeText: 'Täglich frisch',
          footnote: 'Alle Preise inkl. MwSt. Allergene auf Anfrage.',
          categories: [
            {
              title: 'Antipasti',
              description: 'Klassische italienische Vorspeisen',
              items: [
                { name: 'Bruschetta Classica', description: 'Geröstetes Ciabatta mit Tomaten, Basilikum und nativem Olivenöl.', price: '9 €', vegetarian: true },
                { name: 'Carpaccio di Manzo', description: 'Hauchdünnes Rinderfilet mit Rucola, Parmesan und Trüffelöl.', price: '16 €' },
                { name: 'Burrata con Prosciutto', description: 'Cremige Burrata aus Apulien mit San-Daniele-Schinken und Feigen.', price: '18 €', highlighted: true },
                { name: 'Vitello Tonnato', description: 'Kalbfleisch mit Thunfischcreme, Kapern und Zitrone.', price: '17 €' },
              ],
            },
            {
              title: 'Pasta & Risotto',
              description: 'Handgemachte Pasta — täglich frisch',
              items: [
                { name: 'Tagliatelle al Tartufo', description: 'Frische Tagliatelle mit schwarzem Trüffel und Parmigiano.', price: '32 €', highlighted: true },
                { name: 'Spaghetti alle Vongole', description: 'Venusmuscheln, Weißwein, Knoblauch, Petersilie.', price: '24 €' },
                { name: 'Risotto ai Funghi Porcini', description: 'Carnaroli-Risotto mit Steinpilzen und Thymian.', price: '26 €', vegetarian: true },
                { name: 'Pappardelle al Ragù', description: 'Breite Bandnudeln mit langsam geschmortem Ragù vom Chianina-Rind.', price: '22 €' },
                { name: 'Gnocchi alla Sorrentina', description: 'Kartoffelgnocchi mit Tomaten-Mozzarella-Gratin.', price: '19 €', vegetarian: true },
              ],
            },
            {
              title: 'Secondi — Fleisch & Fisch',
              description: 'Hauptgerichte aus erstklassigen Zutaten',
              items: [
                { name: 'Ossobuco alla Milanese', description: 'Geschmorte Kalbshaxe mit Safranrisotto.', price: '38 €', highlighted: true },
                { name: 'Branzino al Forno', description: 'Ganzer Wolfsbarsch mit Zitronen-Kräuterkruste.', price: '34 €' },
                { name: 'Tagliata di Manzo', description: 'Rosa gebratenes Rumpsteak mit Rucola und Parmesan.', price: '36 €' },
                { name: 'Saltimbocca alla Romana', description: 'Kalbsschnitzel mit Salbei und Parmaschinken.', price: '29 €' },
              ],
            },
            {
              title: 'Dolci',
              description: 'Hausgemachte Desserts',
              items: [
                { name: 'Tiramisù della Casa', description: 'Unser Geheimrezept seit 1987 — mit Mascarpone und Amaretto.', price: '12 €', highlighted: true },
                { name: 'Panna Cotta', description: 'Vanille-Panna-Cotta mit Waldbeerenspiegel.', price: '10 €', vegetarian: true },
                { name: 'Affogato al Caffè', description: 'Vanilleeis mit frischem Espresso und Amaretti.', price: '9 €' },
              ],
            },
          ],
          ctaPrimary: { label: 'Tisch reservieren', href: '/reservierung' },
        }},
      ],
    },
    /* ─── Über uns ─── */
    {
      slug: 'ueber-uns', title: 'Über uns', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Über uns',
          subline: 'Die Geschichte der Trattoria Dal Maestro — eine Familientradition seit 1987',
          bgImage: 'https://images.unsplash.com/photo-1528823872057-9c018a7a7553?w=1800&q=85',
        }},
        { type: 'story', sortOrder: 1, data: {
          headline: 'Unsere Geschichte',
          subline: 'Von Neapel nach München — eine Reise voller Leidenschaft',
          badgeText: 'Seit 1987',
          storyText: 'Als Giovanni Maestro 1987 mit seiner Frau Maria aus Neapel nach München kam, hatte er einen Traum: authentische italienische Küche in einem Restaurant, das sich wie ein zweites Zuhause anfühlt.\n\nHeute, über 35 Jahre später, führen ihre Kinder Marco und Lucia die Trattoria mit der gleichen Leidenschaft. Giovannis Original-Rezepte leben weiter — ergänzt durch moderne Interpretationen und eine erstklassige Weinkarte.',
          imagePrimary: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&q=80',
          imageSecondary: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=80',
          founderName: 'Giovanni Maestro',
          founderRole: 'Gründer & Küchenchef',
          founderQuote: 'Die beste Zutat ist immer die Liebe zum Detail.',
          values: [
            { icon: 'heart', title: 'Familientradition', text: 'Drei Generationen Leidenschaft für authentische italienische Küche.' },
            { icon: 'truck', title: 'Regionale Lieferanten', text: 'Olivenöl, Käse und Wurst direkt von Familienbetrieben in Kampanien.' },
            { icon: 'leaf', title: 'Saisonale Frische', text: 'Nur das Beste der Saison landet auf Ihrem Teller.' },
          ],
          milestones: [
            { year: '1987', title: 'Eröffnung', text: 'Giovanni und Maria eröffnen die erste Trattoria in der Maximilianstraße.' },
            { year: '2005', title: 'Nächste Generation', text: 'Marco übernimmt die Weinbar, Lucia den Service.' },
            { year: '2019', title: 'Renovierung', text: 'Kompletter Umbau – modernes Design trifft italienische Tradition.' },
            { year: '2024', title: 'Auszeichnung', text: 'Aufnahme in den Guide Michelin Bib Gourmand.' },
          ],
          ctaPrimary: { label: 'Speisekarte ansehen', href: '/speisekarte' },
        }},
        { type: 'testimonials', sortOrder: 2, data: {
          headline: 'Was unsere Gäste sagen',
          badgeText: 'Bewertungen',
          ratingValue: '4.8/5',
          ratingCount: 'über 1.200 Bewertungen',
          items: [
            { name: 'Thomas M.', quote: 'Die beste Pasta außerhalb Italiens! Das Trüffel-Risotto ist ein Gedicht.', context: 'Stammgast seit 2015', sourceLabel: 'Google', rating: 5 },
            { name: 'Anna K.', quote: 'Wunderschönes Ambiente und ein Service, der seinesgleichen sucht. Perfekt für besondere Anlässe.', context: 'Hochzeits-Dinner', sourceLabel: 'TripAdvisor', rating: 5 },
            { name: 'Dr. Stefan W.', quote: 'Marco hat ein unglaubliches Weinwissen. Die Weinprobe jeden ersten Donnerstag ist ein Muss!', context: 'Weinprobe-Teilnehmer', sourceLabel: 'Google', rating: 5 },
          ],
          ctaPrimary: { label: 'Tisch reservieren', href: '/reservierung' },
        }},
      ],
    },
    /* ─── Galerie ─── */
    {
      slug: 'galerie', title: 'Galerie', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Galerie',
          subline: 'Einblicke in die Trattoria Dal Maestro',
          bgImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1800&q=85',
        }},
        { type: 'gallery', sortOrder: 1, data: {
          headline: 'Impressionen',
          badgeText: 'Einblicke',
          subline: 'Entdecken Sie das Ambiente, die Küche und besondere Momente',
          images: [
            { src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&q=80', alt: 'Restaurant-Innenraum', caption: 'Unser Gastraum mit Blick auf die offene Küche', category: 'Ambiente' },
            { src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=80', alt: 'Feine Küche', caption: 'Frisch zubereitete Pasta mit saisonalen Zutaten', category: 'Küche' },
            { src: 'https://images.unsplash.com/photo-1528823872057-9c018a7a7553?w=900&q=80', alt: 'Weinkeller', caption: 'Unsere Weinbar mit über 200 italienischen Weinen', category: 'Wein' },
            { src: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=900&q=80', alt: 'Trüffel-Gericht', caption: 'Saisonales Trüffel-Menü im Herbst', category: 'Küche' },
            { src: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=900&q=80', alt: 'Terrasse', caption: 'Die Sommerterrasse in der Maximilianstraße', category: 'Ambiente' },
            { src: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=900&q=80', alt: 'Event', caption: 'Weinprobe mit Sommelier Marco', category: 'Events' },
          ],
          ctaPrimary: { label: 'Tisch reservieren', href: '/reservierung' },
        }},
        { type: 'faq', sortOrder: 2, data: {
          headline: 'Häufige Fragen',
          badgeText: 'FAQ',
          items: [
            { question: 'Muss ich einen Tisch reservieren?', answer: 'Wir empfehlen eine Reservierung, besonders am Wochenende und für Events. Unter der Woche haben wir auch Walk-In-Plätze.' },
            { question: 'Gibt es vegetarische und vegane Optionen?', answer: 'Selbstverständlich! Unsere Speisekarte bietet eine große Auswahl an vegetarischen Gerichten. Vegane Optionen sind gekennzeichnet oder können auf Wunsch zubereitet werden.' },
            { question: 'Bieten Sie Catering oder private Events an?', answer: 'Ja, wir richten private Dinner und Events für bis zu 24 Personen aus. Für Catering-Anfragen kontaktieren Sie uns bitte direkt.' },
            { question: 'Welche Allergene sind in den Gerichten enthalten?', answer: 'Alle Allergene sind in unserer Speisekarte gekennzeichnet. Unser Service-Team berät Sie gerne persönlich.' },
            { question: 'Gibt es Parkmöglichkeiten?', answer: 'In der Nähe befindet sich das Parkhaus an der Maximilianstraße (5 Gehminuten). Alternativ sind wir mit der U-Bahn Lehel erreichbar.' },
          ],
          ctaPrimary: { label: 'Weitere Fragen? Kontaktieren Sie uns', href: '/kontakt' },
        }},
      ],
    },
    /* ─── Events ─── */
    {
      slug: 'events', title: 'Events', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Events & Specials',
          subline: 'Kulinarische Erlebnisse und private Feiern',
          bgImage: 'https://images.unsplash.com/photo-1528823872057-9c018a7a7553?w=1800&q=85',
        }},
        { type: 'events', sortOrder: 1, data: {
          headline: 'Kommende Events',
          subline: 'Reservieren Sie Ihren Platz',
          events: [
            { title: 'Trüffel-Woche', dateLabel: '15.–21.11.2024', description: '5-Gänge-Degustationsmenü mit weißem Alba-Trüffel.', priceLabel: '98 € p.P.', image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=900&q=80', cta: { label: 'Reservieren', href: '/reservierung' } },
            { title: 'Weinprobe Toskana', dateLabel: 'Jeden 1. Do. im Monat', timeLabel: '19:00–22:00', description: '6 Weine mit Antipasti. Sommelier Marco führt.', priceLabel: '59 € p.P.', image: 'https://images.unsplash.com/photo-1528823872057-9c018a7a7553?w=900&q=80', cta: { label: 'Anmelden', href: '/reservierung' } },
            { title: 'Sunday Brunch Italiano', dateLabel: 'Jeden Sonntag', timeLabel: '10:30–14:00', description: 'Brunch-Buffet mit Antipasti, Pasta-Station, Dolci und Prosecco.', priceLabel: '45 € p.P.', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=80', cta: { label: 'Reservieren', href: '/reservierung' } },
            { title: 'Private Dinner', dateLabel: 'Nach Vereinbarung', description: 'Exklusives Menü für geschlossene Gesellschaften bis 24 Personen.', priceLabel: 'Auf Anfrage', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&q=80', cta: { label: 'Anfrage senden', href: '/reservierung' } },
          ],
        }},
      ],
    },
    /* ─── Reservierung ─── */
    {
      slug: 'reservierung', title: 'Reservierung', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Tisch reservieren',
          subline: 'Sichern Sie sich Ihren Platz in der Trattoria Dal Maestro',
          bgImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1800&q=85',
        }},
        { type: 'reservation', sortOrder: 1, data: {
          headline: 'Reservierung',
          subline: 'Online oder telefonisch',
          introText: 'Reservieren Sie bequem online oder rufen Sie uns an. Für Gruppen ab 8 Personen bitten wir um telefonische Reservierung.',
          formEnabled: true,
          submitLabel: 'Reservierung absenden',
          partySizeOptions: ['1 Person', '2 Personen', '3 Personen', '4 Personen', '5 Personen', '6 Personen', '7+ Personen'],
          timeHint: 'Reservierungen von Di–So möglich. Montag Ruhetag.',
          policyText: 'Bei Nichterscheinen ohne Absage behalten wir uns eine No-Show-Gebühr von 25 € p.P. vor.',
          image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&q=80',
          phoneCta: { label: 'Anrufen: +49 89 123 456 78', href: 'tel:+498912345678' },
        }},
        { type: 'openingHours', sortOrder: 2, data: {
          headline: 'Öffnungszeiten',
          subline: 'Wann Sie uns besuchen können',
          kitchenHoursHeadline: 'Küche',
          kitchenHoursText: 'Warme Küche bis 30 Min. vor Schließung.',
          holidayNote: 'An Feiertagen gesonderte Zeiten — bitte telefonisch erfragen.',
          days: [
            { label: 'Montag', hours: 'Ruhetag', closed: true },
            { label: 'Dienstag–Freitag', hours: '11:30–14:30, 17:30–23:00' },
            { label: 'Samstag', hours: '17:30–23:30' },
            { label: 'Sonntag', hours: '11:30–22:00' },
          ],
          ctaPrimary: { label: 'Jetzt reservieren', href: '/reservierung' },
        }},
      ],
    },
    /* ─── Kontakt ─── */
    {
      slug: 'kontakt', title: 'Kontakt & Anfahrt', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Kontakt & Anfahrt',
          subline: 'So finden Sie die Trattoria Dal Maestro in München',
          bgImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1800&q=85',
        }},
        { type: 'contact', sortOrder: 1, data: {
          headline: 'Besuchen Sie uns',
          subline: 'Im Herzen der Maximilianstraße',
          introText: 'Reservieren Sie telefonisch, per E-Mail oder kommen Sie einfach vorbei — wir freuen uns auf Sie.',
          image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&q=80',
          mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2662.0!2d11.58!3d48.14!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDjCsDA4JzI0LjAiTiAxMcKwMzQnNDguMCJF!5e0!3m2!1sde!2sde!4v1700000000000',
          formEnabled: true,
          infoCards: [
            { icon: 'phone', label: 'Telefon', value: '+49 89 123 456 78' },
            { icon: 'mail', label: 'E-Mail', value: 'info@dal-maestro.de' },
            { icon: 'map-pin', label: 'Adresse', value: 'Maximilianstraße 12, 80539 München' },
            { icon: 'clock', label: 'Öffnungszeiten', value: 'Di–So (Mo Ruhetag)' },
          ],
          primaryCta: { label: 'Tisch reservieren', href: '/reservierung' },
          secondaryCta: { label: 'Anrufen', href: 'tel:+498912345678' },
        }},
      ],
    },
  ],
  collections: [
    {
      key: 'speisekarte', label: 'Speisekarte', items: [
        { slug: 'antipasti', title: 'Antipasti & Vorspeisen', priority: 0, data: { description: 'Italienische Vorspeisen aus frischen, saisonalen Zutaten — von Vitello Tonnato bis Burrata mit San-Marzano-Tomaten.', features: ['Vitello Tonnato', 'Burrata con Pomodori', 'Carpaccio di Manzo', 'Bruschetta Tricolore', 'Insalata Caprese', 'Calamari Fritti'], image: 'https://images.unsplash.com/photo-1550507992-eb63ffee0847?w=900&q=80', content: '<h3>Der perfekte Start</h3><p>Unsere Antipasti sind mehr als nur ein Auftakt — sie sind eine Liebeserklärung an die italienische Küche. Alle Zutaten beziehen wir von ausgewählten Lieferanten: Mozzarella di Bufala aus Kampanien, Prosciutto di San Daniele, Olivenöl aus Ligurien.</p><p>Saisonal ergänzt durch Trüffel, weiße Spargel oder Steinpilze.</p>', price: '12–24 €', cta: { label: 'Tisch reservieren', href: '/kontakt' } } },
        { slug: 'pasta-risotto', title: 'Pasta & Risotto', priority: 1, data: { description: 'Handgemachte Pasta frisch aus unserer Küche und cremige Risotti mit saisonalen Zutaten.', features: ['Tagliatelle al Tartufo', 'Spaghetti Vongole', 'Ravioli di Ricotta', 'Risotto ai Funghi Porcini', 'Gnocchi al Pesto', 'Pappardelle al Ragù'], image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=900&q=80', content: '<h3>Handgemacht, jeden Tag</h3><p>Unsere Pasta wird täglich frisch in der Küche hergestellt. Küchenchef Giovanni verwendet traditionelle Bronze-Matrizen für die perfekte Textur, die Saucen optimal aufnimmt.</p><p>Die Risotti kochen wir ausschließlich mit Carnaroli-Reis und hausgemachter Brodo. Garzeit: 18 Minuten — Perfektion braucht Zeit.</p>', price: '18–32 €', cta: { label: 'Tisch reservieren', href: '/kontakt' } } },
        { slug: 'pesce-carne', title: 'Fisch & Fleisch', priority: 2, data: { description: 'Hauptgerichte vom Josper-Grill und aus dem Holzofen — vom Branzino bis zum Bistecca alla Fiorentina.', features: ['Branzino alla Griglia', 'Bistecca alla Fiorentina', 'Ossobuco alla Milanese', 'Tagliata di Manzo', 'Salmone al Forno', 'Agnello al Rosmarino'], image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=80', content: '<h3>Feuer & Flamme</h3><p>Unser Josper-Holzkohlegrill aus Barcelona erreicht Temperaturen von über 500°C und verleiht Fleisch und Fisch eine unnachahmliche Rauchnote bei perfekt saftigem Kern.</p><p>Das Bistecca alla Fiorentina (1,2 kg, für 2 Personen) ist unser Signature Dish — dry-aged für 40 Tage vom Chianina-Rind.</p>', price: '28–85 €', cta: { label: 'Tisch reservieren', href: '/kontakt' } } },
        { slug: 'dolci', title: 'Dolci & Desserts', priority: 3, data: { description: 'Italienische Dessertkunst: Tiramisu nach Originalrezept, Panna Cotta und saisonale Kreationen.', features: ['Tiramisu Classico', 'Panna Cotta', 'Affogato al Caffè', 'Limoncello-Sorbet', 'Cannoli Siciliani', 'Semifreddo'], image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=900&q=80', content: '<h3>Süßer Abschluss</h3><p>Unsere Dolci werden ausnahmslos im Haus hergestellt. Das Tiramisu nach dem Originalrezept von Giovannis Großmutter braucht 24 Stunden Ruhezeit — und schmeckt jede Sekunde davon.</p><p>Saisonal neu: Im Sommer erfrischende Granita, im Winter warmes Tortino al Cioccolato mit flüssigem Kern.</p>', price: '10–16 €', cta: { label: 'Tisch reservieren', href: '/kontakt' } } },
      ],
    },
    {
      key: 'news', label: 'Neuigkeiten', items: [
        { slug: 'trueffel-saison', title: 'Trüffel-Saison hat begonnen', priority: 0, data: { excerpt: 'Die Trüffel-Saison hat begonnen! Ab sofort servieren wir frischen weißen Alba-Trüffel in drei exklusiven Gerichten.', content: '<p>Jedes Jahr ab Oktober beginnt für uns die schönste Zeit: Die weißen Trüffel aus dem Piemont sind da. Unser Küchenchef Giovanni hat drei neue Kreationen entwickelt — vom klassischen Tagliatelle al Tartufo bis zum Trüffel-Risotto mit Parmigiano 36 Monate.</p><p>Die Trüffel-Gerichte sind verfügbar, solange der Vorrat reicht. Reservieren Sie frühzeitig!</p>', image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800&q=80', date: '2025-10-15' } },
        { slug: 'neue-sommerkarte', title: 'Neue Sommerkarte: Leichte Gerichte & Dachterrassen-Specials', priority: 1, data: { excerpt: 'Frische Insalate, gegrillter Fisch und hausgemachtes Limoncello-Sorbet — unsere Sommerkarte ist da.', content: '<p>Der Sommer im Dal Maestro schmeckt nach Meer und Sonne. Unsere neue Sommerkarte bringt die Aromen der Amalfiküste nach München. Highlights: Crudo di Tonno mit Zitrusfrüchten, gegrillter Branzino vom Josper-Grill und unser legendäres Limoncello-Sorbet.</p><p>Genießen Sie die neuen Gerichte auf unserer Dachterrasse mit Blick über die Altstadt.</p>', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80', date: '2025-06-01' } },
        { slug: 'weinprobe-toskana-special', title: 'Weinprobe-Abend: Die besten Weine der Toskana', priority: 2, data: { excerpt: 'Sommelier Marco lädt zur exklusiven Toskana-Weinprobe ein — 6 Weine, 4 Gänge, ein Abend.', content: '<p>Am 20. November führt unser Sommelier Marco durch die Weinlandschaft der Toskana. Von Brunello di Montalcino über Chianti Classico Riserva bis zum Vin Santo — begleitet von passenden Antipasti und Dolci.</p><p>Limitiert auf 24 Plätze. Preis: 89 € pro Person inkl. aller Weine und Speisen.</p>', image: 'https://images.unsplash.com/photo-1528823872057-9c018a7a7553?w=800&q=80', date: '2025-11-01' } },
      ],
    },
  ],
};
