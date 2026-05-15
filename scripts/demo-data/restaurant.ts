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
      ],
    },
    /* ─── Speisekarte ─── */
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
        { type: 'ambience', sortOrder: 1, data: {
          headline: 'Unsere Geschichte',
          subline: 'Von Neapel nach München',
          imagePrimary: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&q=80',
          imageSecondary: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=80',
          highlights: [
            { title: '1987 — Der Anfang', text: 'Giovanni Maestro eröffnet mit seiner Frau Maria die erste Trattoria in der Maximilianstraße.', icon: 'clock' },
            { title: 'Familientradition', text: 'Heute führt Sohn Marco die Weinbar, Tochter Lucia leitet den Service. Giovannis Rezepte leben weiter.', icon: 'heart' },
            { title: 'Regionale Lieferanten', text: 'Wir beziehen Olivenöl, Käse und Wurst direkt von Familienbetrieben in Kampanien und der Toskana.', icon: 'truck' },
          ],
          ctaPrimary: { label: 'Speisekarte ansehen', href: '/speisekarte' },
        }},
        { type: 'richText', sortOrder: 2, data: {
          headline: 'Unsere Philosophie',
          content: '<p>In der Trattoria Dal Maestro glauben wir an einfache, ehrliche Küche. Frische Zutaten, traditionelle Rezepte und die Leidenschaft für gutes Essen — das ist unser Geheimnis seit über 35 Jahren.</p><p>Unser Küchenchef Giovanni verwendet nur saisonale Produkte und bereitet jeden Tag frische Pasta von Hand zu. Die Weine werden von Sommelier Marco persönlich in Italien ausgewählt.</p>',
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
};
