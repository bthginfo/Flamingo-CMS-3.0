/**
 * Rich demo seed: Restaurant (Trattoria Dal Maestro)
 * ALL section types, ALL fields populated with realistic content.
 */
import type { InferInsertModel } from 'drizzle-orm';

export const RESTAURANT_CONFIG = {
  slug: 'demo-restaurant',
  name: 'Trattoria Dal Maestro',
  industry: 'restaurant' as const,
  activeStyle: 'classic',
  brand: {
    companyName: 'Trattoria Dal Maestro',
    tagline: 'Authentische italienische Küche in Innsbruck',
    primaryColor: '#9a3412',
    secondaryColor: '#c2410c',
    accentColor: '#f59e0b',
  },
  contact: { phone: '+43 512 123 456', email: 'info@trattoria-dalmaestro.at', address: 'Maria-Theresien-Straße 24, 6020 Innsbruck' },
  socialLinks: { instagram: 'https://instagram.com/trattoria-dalmaestro', facebook: 'https://facebook.com/trattoria-dalmaestro', google: 'https://g.page/trattoria-dalmaestro' },
  openingHours: [
    { day: 'Di–Sa', hours: '11:30–14:30 & 17:30–23:00' },
    { day: 'So', hours: '11:30–22:00' },
    { day: 'Mo', hours: 'Ruhetag' },
  ],
  navItems: [
    { label: 'Startseite', href: '/', type: 'link' },
    { label: 'Speisekarte', href: '/speisekarte', type: 'link' },
    { label: 'Ambiente', href: '/ambiente', type: 'link' },
    { label: 'Events', href: '/events', type: 'link' },
    { label: 'Reservierung', href: '/reservierung', type: 'link' },
  ],
  navCta: { label: 'Tisch reservieren', href: '/reservierung' },
  footerColumns: [
    { title: 'Küche', items: [{ text: 'Speisekarte', href: '/speisekarte' }, { text: 'Signature Dishes', href: '/' }, { text: 'Events & Catering', href: '/events' }] },
    { title: 'Besuch', items: [{ text: 'Reservierung', href: '/reservierung' }, { text: 'Ambiente & Räume', href: '/ambiente' }, { text: 'Kontakt', href: '/reservierung' }] },
    { title: 'Öffnungszeiten', items: [{ text: 'Di–Sa: 11:30–14:30 & 17:30–23:00' }, { text: 'So: 11:30–22:00' }, { text: 'Mo: Ruhetag' }] },
  ],
  footerLegalLinks: [{ label: 'Impressum', href: '/impressum' }, { label: 'Datenschutz', href: '/datenschutz' }],
  footerCta: { label: 'Tisch reservieren', href: '/reservierung' },
  pages: [
    {
      slug: 'startseite', title: 'Startseite', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Trattoria Dal Maestro',
          subline: 'Authentische italienische Küche seit 1998 — mitten in der Innsbrucker Altstadt. Frische Pasta, edle Weine und herzliche Gastfreundschaft erwarten Sie.',
          badgeText: 'Seit 1998',
          bgImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1800&q=85',
          trustItems: ['Authentische italienische Küche', 'Seit 25 Jahren in Innsbruck', 'Familiengeführt in 2. Generation'],
          primaryCta: { label: 'Tisch reservieren', href: '/reservierung' },
          secondaryCta: { label: 'Speisekarte entdecken', href: '/speisekarte' },
        }},
        { type: 'signatureDishes', sortOrder: 1, data: {
          headline: 'Unsere Signature-Gerichte',
          subline: 'Drei Klassiker, die unsere Gäste immer wieder zurückbringen',
          dishes: [
            { name: 'Osso Buco alla Milanese', description: 'Geschmorte Kalbshaxe nach Mailänder Art, serviert auf safrangelben Risotto mit Gremolata — unser meistbestelltes Gericht seit der Eröffnung.', price: '34,00 €', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=900&q=80', imageAlt: 'Osso Buco mit Risotto', label: "Chef's Pick", ingredients: ['Kalbshaxe', 'Safranrisotto', 'Gremolata', 'Weißwein', 'Rosmarin'], cta: { label: 'Zur Speisekarte', href: '/speisekarte' } },
            { name: 'Tagliatelle al Tartufo', description: 'Frische, handgerollte Tagliatelle mit schwarzem Trüffel aus Norcia, Parmigiano Reggiano 36 Monate und einem Hauch Trüffelöl.', price: '24,00 €', image: 'https://images.unsplash.com/photo-1556761223-4c4282c73f77?w=900&q=80', imageAlt: 'Frische Tagliatelle mit Trüffel', label: 'Saisonhighlight', ingredients: ['Frische Tagliatelle', 'Schwarzer Trüffel', 'Parmigiano Reggiano', 'Butter', 'Trüffelöl'], cta: { label: 'Zur Speisekarte', href: '/speisekarte' } },
            { name: 'Tiramisù della Casa', description: 'Unser legendäres Hausdessert nach dem Originalrezept von Nonna Maria — mit Mascarpone, Espresso und Amaretto, 24 Stunden durchgezogen.', price: '12,00 €', image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=900&q=80', imageAlt: 'Klassisches Tiramisù', label: 'Dolce Vita', ingredients: ['Mascarpone', 'Espresso', 'Löffelbiskuit', 'Amaretto', 'Kakao'], cta: { label: 'Alle Dolci', href: '/speisekarte' } },
          ],
        }},
        { type: 'reservation', sortOrder: 2, data: {
          headline: 'Reservieren Sie Ihren Tisch',
          subline: 'Genießen Sie einen unvergesslichen Abend in der Trattoria Dal Maestro',
          introText: 'Ob romantisches Dinner zu zweit oder gesellige Runde mit Freunden — wir freuen uns auf Ihren Besuch. Reservieren Sie bequem online oder rufen Sie uns an.',
          externalBookingCta: { label: 'Jetzt reservieren', href: '/reservierung' },
          phoneCta: { label: '+43 512 123 456', href: 'tel:+43512123456' },
          timeHint: 'Wir empfehlen eine Reservierung mindestens 2 Tage im Voraus, besonders für Freitag und Samstag.',
        }},
      ],
    },
    {
      slug: 'speisekarte', title: 'Speisekarte', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Unsere Speisekarte',
          subline: 'Frische Zutaten, traditionelle Rezepte, leidenschaftlich zubereitet — von der Vorspeise bis zum Dolce.',
          bgImage: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1800&q=85',
          primaryCta: { label: 'Tisch reservieren', href: '/reservierung' },
        }},
        { type: 'menu', sortOrder: 1, data: {
          headline: 'La Carta',
          footnote: 'Alle Gerichte werden mit frischen, saisonalen Zutaten zubereitet. Änderungen vorbehalten. Bitte informieren Sie uns über Allergien und Unverträglichkeiten.',
          categories: [
            {
              title: 'Antipasti', description: 'Kleine Kostbarkeiten zum Einstimmen',
              items: [
                { name: 'Bruschetta Classica', description: 'Geröstetes Ciabatta mit marinierten San-Marzano-Tomaten, Knoblauch, frischem Basilikum und nativem Olivenöl extra.', price: '12,00 €', image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=900&q=80', tags: ['vegetarisch'], allergens: ['Gluten'] },
                { name: 'Carpaccio di Manzo', description: 'Hauchdünn geschnittenes Rinderfilet mit Rucola, Parmigianspänen, Kapern und Zitronendressing.', price: '16,50 €', allergens: ['Milch'] },
                { name: 'Burrata Pugliese', description: 'Cremige Burrata aus Apulien auf einem Bett von ofengerösteten Kirschtomaten und Basilikum-Pesto.', price: '15,00 €', image: 'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=900&q=80', tags: ['vegetarisch'], allergens: ['Milch'] },
                { name: 'Vitello Tonnato', description: 'Zartes Kalbfleisch in hauchdünnen Scheiben mit cremiger Thunfisch-Kapern-Sauce — ein Klassiker aus dem Piemont.', price: '17,50 €', allergens: ['Fisch', 'Ei'] },
                { name: 'Cozze alla Marinara', description: 'Frische Miesmuscheln in würziger Tomaten-Weißwein-Sauce mit Knoblauch und Petersilie, serviert mit Focaccia.', price: '16,00 €', allergens: ['Weichtiere', 'Gluten'] },
                { name: 'Insalata Caprese', description: 'Büffel-Mozzarella mit sonnengereiften Tomaten, frischem Basilikum und erstklassigem Olivenöl aus Ligurien.', price: '13,50 €', tags: ['vegetarisch'], allergens: ['Milch'] },
              ],
            },
            {
              title: 'Primi Piatti — Pasta & Risotto', description: 'Täglich frisch in unserer offenen Küche zubereitet',
              items: [
                { name: 'Tagliatelle al Tartufo', description: 'Handgerollte Tagliatelle mit schwarzem Trüffel, Parmigiano Reggiano 36 Monate und einem Hauch Trüffelöl.', price: '24,00 €', image: 'https://images.unsplash.com/photo-1556761223-4c4282c73f77?w=900&q=80', tags: ['vegetarisch'], allergens: ['Gluten', 'Milch', 'Ei'] },
                { name: 'Risotto ai Funghi Porcini', description: 'Carnaroli-Risotto mit frischen Steinpilzen, Thymian und einem großzügigen Stück Butter zum Abschluss.', price: '21,00 €', tags: ['vegetarisch'], allergens: ['Milch'] },
                { name: 'Spaghetti alle Vongole', description: 'Spaghetti mit frischen Venusmuscheln, Knoblauch, Chili, Petersilie und einem Schuss Vermentino.', price: '22,00 €', image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=900&q=80', allergens: ['Gluten', 'Weichtiere'] },
                { name: 'Ravioli di Spinaci e Ricotta', description: 'Hausgemachte Ravioli gefüllt mit Spinat und Ricotta in zerlassener Salbeibutter mit Pinienkernen.', price: '19,00 €', tags: ['vegetarisch'], allergens: ['Gluten', 'Milch', 'Ei', 'Nüsse'] },
                { name: "Penne all'Arrabbiata", description: 'Penne in feuriger Tomatensauce mit Knoblauch, Peperoncino und frischer Petersilie — für alle, die es schärfer mögen.', price: '16,00 €', tags: ['vegetarisch', 'scharf', 'vegan'], allergens: ['Gluten'] },
                { name: 'Gnocchi al Gorgonzola', description: 'Kartoffelgnocchi in samtiger Gorgonzola-Sahne-Sauce mit gerösteten Walnüssen und frischem Schnittlauch.', price: '18,50 €', tags: ['vegetarisch'], allergens: ['Gluten', 'Milch', 'Nüsse'] },
              ],
            },
            {
              title: 'Secondi — Hauptgerichte', description: 'Fleisch & Fisch aus nachhaltiger Herkunft',
              items: [
                { name: 'Osso Buco alla Milanese', description: 'Langsam geschmorte Kalbshaxe auf Safranrisotto mit Gremolata — unser Signature-Gericht seit 1998.', price: '34,00 €', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=900&q=80', allergens: ['Milch'] },
                { name: 'Saltimbocca alla Romana', description: 'Zartes Kalbsschnitzel mit luftgetrocknetem Prosciutto und Salbei, abgelöscht mit Marsala, dazu Blattspinat.', price: '29,00 €', allergens: ['Milch'] },
                { name: 'Branzino al Forno', description: 'Ganzer Wolfsbarsch im Ofen gegart mit Kirschtomaten, Oliven, Kapern und frischen Kräutern.', price: '32,00 €', image: 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=900&q=80', allergens: ['Fisch'] },
                { name: 'Tagliata di Manzo', description: 'Gegrilltes Rinderrückensteak, aufgeschnitten auf Rucola-Bett mit Parmesan, Balsamico-Reduktion und Rosmarin-Kartoffeln.', price: '38,00 €', allergens: ['Milch'] },
                { name: 'Scaloppine al Limone', description: 'Dünne Kalbsschnitzel in frischer Zitronen-Butter-Sauce mit Kapern, dazu saisonales Gemüse.', price: '28,00 €', allergens: ['Milch'] },
              ],
            },
            {
              title: 'Dolci', description: 'Süße Verführungen zum perfekten Abschluss',
              items: [
                { name: 'Tiramisù della Casa', description: 'Unser legendäres Hausdessert nach Nonna Marias Rezept — Mascarpone, Espresso, Amaretto, 24 Stunden durchgezogen.', price: '12,00 €', image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=900&q=80', allergens: ['Milch', 'Ei', 'Gluten'] },
                { name: 'Panna Cotta ai Frutti di Bosco', description: 'Vanille-Panna-Cotta mit hausgemachtem Waldbeeren-Coulis und frischer Minze.', price: '10,00 €', tags: ['vegetarisch'], allergens: ['Milch'] },
                { name: 'Affogato al Caffè', description: 'Cremiges Fior-di-Latte-Gelato, übergossen mit einem doppelten Espresso und optional einem Schuss Amaretto.', price: '9,50 €', tags: ['vegetarisch'], allergens: ['Milch'] },
                { name: 'Cannoli Siciliani', description: 'Knusprige Teigröllchen gefüllt mit süßer Ricotta-Creme, kandierten Früchten und Pistazien aus Bronte.', price: '13,00 €', image: 'https://images.unsplash.com/photo-1611293388250-580b08c4a145?w=900&q=80', allergens: ['Gluten', 'Milch', 'Nüsse'] },
              ],
            },
          ],
        }},
      ],
    },
    {
      slug: 'ambiente', title: 'Ambiente & Räume', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Ambiente & Räume',
          subline: 'Wo Geschichte auf Genuss trifft — unser Restaurant in der Innsbrucker Altstadt',
          bgImage: 'https://images.unsplash.com/photo-1550966871-3ed3cdb51f3a?w=1800&q=85',
        }},
        { type: 'ambience', sortOrder: 1, data: {
          headline: 'Unsere Räumlichkeiten',
          subline: 'Drei einzigartige Bereiche für unvergessliche Momente',
          imagePrimary: 'https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=900&q=80',
          imageSecondary: 'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=900&q=80',
          imageTertiary: 'https://images.unsplash.com/photo-1528823872057-9c018a7a7553?w=900&q=80',
          highlights: [
            { title: 'Gewölbekeller aus dem 15. Jahrhundert', text: 'Originale Steinbögen und historisches Ambiente verleihen jedem Besuch einen besonderen Rahmen. Platz für bis zu 40 Gäste.', icon: 'castle' },
            { title: 'Sonnenterrasse mit Alpenblick', text: 'Genießen Sie von Mai bis September die warme Jahreszeit mit Blick auf die Innsbrucker Nordkette. 24 Sitzplätze.', icon: 'sun' },
            { title: 'Private Dining für bis zu 12 Personen', text: 'Unser Weinkeller bietet den perfekten Rahmen für Geburtstage, Jubiläen oder Geschäftsessen in exklusiver Atmosphäre.', icon: 'wine' },
          ],
          ctaPrimary: { label: 'Tisch reservieren', href: '/reservierung' },
        }},
      ],
    },
    {
      slug: 'events', title: 'Events & Catering', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Events & Catering',
          subline: 'Gemeinsam feiern, genießen und die italienische Küche erleben — bei uns oder bei Ihnen',
          bgImage: 'https://images.unsplash.com/photo-1530062845289-9109b2c9c868?w=1800&q=85',
          primaryCta: { label: 'Event anfragen', href: '/reservierung' },
        }},
        { type: 'events', sortOrder: 1, data: {
          headline: 'Unsere Veranstaltungen',
          subline: 'Regelmäßige Events und individuelle Angebote für jeden Anlass',
          events: [
            { title: 'Wein & Pasta Abend', dateLabel: 'Jeden letzten Freitag im Monat', timeLabel: '19:00 — 22:30 Uhr', description: 'Vier Gänge, vier Weine: Unser Sommelier Andrea führt Sie durch eine Reise von Südtirol bis Sizilien. Jeder Gang wird von Küchenchef Marco live erklärt und mit dem perfekten Wein begleitet. Inkl. Aperitivo, Wasser und Kaffee.', image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=900&q=80', imageAlt: 'Weingläser und Pasta auf festlich gedecktem Tisch', priceLabel: '49,00 € pro Person', cta: { label: 'Platz reservieren', href: '/reservierung' } },
            { title: 'Kochkurs: Frische Pasta', dateLabel: 'Jeden 2. und 4. Samstag im Monat', timeLabel: '10:00 — 14:00 Uhr', description: 'Lernen Sie von Küchenchef Marco die Kunst der frischen Pasta: Tagliatelle, Ravioli und Gnocchi — von Hand gemacht, mit Liebe und den besten Zutaten. Inkl. gemeinsames Mittagessen mit Wein und Rezeptmappe.', image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=900&q=80', imageAlt: 'Hände formen frische Pasta', priceLabel: '89,00 € pro Person', cta: { label: 'Kurs buchen', href: '/reservierung' } },
            { title: 'Firmen-Events & Private Dining', dateLabel: 'Auf Anfrage', timeLabel: 'Individuell planbar', description: 'Ob Teambuilding, Kundenevent oder private Feier — wir gestalten Ihr Event nach Ihren Wünschen. Exklusiver Weinkeller für bis zu 12 Personen, Hauptsaal für Gruppen bis 60 Personen. Individuelle Menüzusammenstellung.', image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=900&q=80', imageAlt: 'Elegantes Private Dining', priceLabel: 'Auf Anfrage', cta: { label: 'Anfrage senden', href: '/reservierung' } },
          ],
        }},
      ],
    },
    {
      slug: 'reservierung', title: 'Reservierung', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Reservierung',
          subline: 'Sichern Sie sich Ihren Lieblingstisch in der Trattoria Dal Maestro',
          bgImage: 'https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=1800&q=85',
          primaryCta: { label: 'Jetzt reservieren', href: '#reservation-form' },
        }},
        { type: 'openingHours', sortOrder: 1, data: {
          headline: 'Unsere Öffnungszeiten',
          days: [
            { label: 'Dienstag — Samstag', hours: '11:30 — 14:30 Uhr & 17:30 — 23:00 Uhr' },
            { label: 'Sonntag', hours: '11:30 — 22:00 Uhr' },
            { label: 'Montag', hours: '', closed: true, note: 'Ruhetag' },
          ],
          kitchenHoursHeadline: 'Küchenzeiten',
          kitchenHoursText: 'Warme Küche bis 30 Minuten vor Restaurantschluss.',
          holidayNote: 'An Feiertagen nach gesonderter Ankündigung auf unserer Website und Social Media.',
          ctaPrimary: { label: 'Tisch reservieren', href: '/reservierung' },
        }},
        { type: 'reservation', sortOrder: 2, data: {
          headline: 'Tisch reservieren',
          introText: 'Füllen Sie einfach das Formular aus und wir bestätigen Ihre Reservierung innerhalb von 2 Stunden per E-Mail. Für kurzfristige Anfragen empfehlen wir einen Anruf.',
          partySizeOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
          phoneCta: { label: 'Telefonisch: +43 512 123 456', href: 'tel:+43512123456' },
          timeHint: 'Bitte beachten Sie: Reservierungen für Freitag und Samstag ab 19 Uhr sind besonders beliebt. Wir empfehlen eine Buchung mindestens 3 Tage im Voraus.',
          policyText: 'Bitte informieren Sie uns mindestens 24 Stunden im Voraus, falls Sie Ihre Reservierung stornieren oder ändern möchten. Bei Nichterscheinen kann eine Gebühr von 25,00 € pro Person anfallen.',
          externalBookingCta: { label: 'Oder buchen Sie über OpenTable', href: '/reservierung' },
          submitLabel: 'Reservierung absenden',
        }},
      ],
    },
  ],
};
