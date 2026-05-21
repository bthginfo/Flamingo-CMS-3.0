import type { DemoSite } from './types';
import { B, HERO } from './types';

export const restaurantSite: DemoSite = {
  industry: 'restaurant',
  industryKey: 'restaurant',
  defaultStyle: 'classic',
  pages: [
    {
      slug: '',
      title: 'Startseite',
      sections: [
        {
          ...HERO,
          id: 'rs-home-hero',
          type: 'hero',
          data: {
            headline: 'Trattoria Dal Maestro',
            subline: 'Authentische italienische Küche seit 1998 — mitten in der Innsbrucker Altstadt',
            badgeText: 'Seit 1998',
            bgImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1800&q=85',
            trustItems: ['Authentische italienische Küche', 'Seit 25 Jahren', 'Familiengeführt'],
            primaryCta: { label: 'Tisch reservieren', href: '/demo/restaurant/reservierung' },
            secondaryCta: { label: 'Speisekarte entdecken', href: '/demo/restaurant/speisekarte' },
          },
        },
        {
          ...B,
          id: 'rs-home-dishes',
          type: 'signatureDishes',
          data: {
            headline: 'Unsere Signature-Gerichte',
            subline: 'Drei Klassiker, die unsere Gäste immer wieder zurückbringen',
            dishes: [
              {
                name: 'Osso Buco alla Milanese',
                description: 'Geschmorte Kalbshaxe nach Mailänder Art, serviert auf safrangelben Risotto mit Gremolata — unser meistbestelltes Gericht seit der ErÖffnung.',
                price: '34,00 €',
                image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=900&q=80',
                imageAlt: 'Osso Buco mit Risotto auf weißem Teller',
                label: "Chef's Pick",
                ingredients: ['Kalbshaxe', 'Safranrisotto', 'Gremolata', 'Weißwein', 'Rosmarin'],
                cta: { label: 'Zur Speisekarte', href: '/demo/restaurant/speisekarte' },
              },
              {
                name: 'Tagliatelle al Tartufo',
                description: 'Frische, handgerollte Tagliatelle mit schwarzem Trüffel aus Norcia, Parmigiano Reggiano 36 Monate und einem Hauch Trüffeloel.',
                price: '24,00 €',
                image: 'https://images.unsplash.com/photo-1556761223-4c4282c73f77?w=900&q=80',
                imageAlt: 'Frische Tagliatelle mit Trüffel-Shavings',
                label: 'Saisonhighlight',
                ingredients: ['Frische Tagliatelle', 'Schwarzer Trüffel', 'Parmigiano Reggiano', 'Butter', 'Trüffeloel'],
                cta: { label: 'Zur Speisekarte', href: '/demo/restaurant/speisekarte' },
              },
              {
                name: 'Tiramisù della Casa',
                description: 'Unser legendäres Hausdessert nach dem Originalrezept von Nonna Maria — mit Mascarpone, Espresso und Amaretto, 24 Stunden durchgezogen.',
                price: '12,00 €',
                image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=900&q=80',
                imageAlt: 'Klassisches Tiramisù im Glas mit Kakaopulver',
                label: 'Dolce Vita',
                ingredients: ['Mascarpone', 'Espresso', 'Löffelbiskuit', 'Amaretto', 'Kakao'],
                cta: { label: 'Alle Dolci', href: '/demo/restaurant/speisekarte' },
              },
            ],
          },
        },
        {
          ...B,
          id: 'rs-home-reservation',
          type: 'reservation',
          data: {
            headline: 'Reservieren Sie Ihren Tisch',
            subline: 'Genießen Sie einen unvergesslichen Abend in der Trattoria Dal Maestro',
            introText: 'Ob romantisches Dinner zu zweit oder gesellige Runde mit Freunden — wir freuen uns auf Ihren Besuch. Reservieren Sie bequem online oder rufen Sie uns an.',
            externalBookingCta: { label: 'Jetzt reservieren', href: '/demo/restaurant/reservierung' },
            phoneCta: { label: '+43 512 123 456', href: 'tel:+43512123456' },
            timeHint: 'Wir empfehlen eine Reservierung mindestens 2 Tage im Voraus, besonders für Freitag und Samstag.',
          },
        },
        {
          ...B, id: 'rs-stats', type: 'statsCounter',
          data: {
            headline: 'La Trattoria in Zahlen',
            stats: [
              { value: 15, suffix: ' Jahre', label: 'In Innsbruck' },
              { value: 4.8, suffix: '★', label: 'Google-Bewertung' },
              { value: 120, suffix: '', label: 'Sitzplätze' },
              { value: 850, suffix: '+', label: 'Bewertungen' },
            ],
          },
        },
        {
          ...B, id: 'rs-home-testimonials', type: 'testimonials',
          data: {
            headline: 'Was unsere Gäste sagen',
            items: [
              { quote: 'Die beste italienische Küche außerhalb Italiens. Wir kommen seit 10 Jahren hierher.', author: 'Familie Huber', role: 'Stammgäste' },
              { quote: 'Marco und sein Team haben unsere Hochzeitsfeier unvergesslich gemacht. Grazie mille!', author: 'Julia & Markus', role: 'Hochzeitsgäste 2024' },
              { quote: 'Authentisch, herzlich, perfekt. Die Tagliatelle al Tartufo sind ein Gedicht!', author: 'Michael R.', role: 'TripAdvisor' },
            ],
          },
        },
        {
          ...B, id: 'rs-home-team', type: 'team',
          data: {
            headline: 'Unser Team',
            subline: 'Die Menschen hinter dem Genuss',
            members: [
              { name: 'Marco Dal Maestro', role: 'Küchenchef & Inhaber', image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&q=80' },
              { name: 'Elena Dal Maestro', role: 'Geschäftsführung & Service', image: 'https://images.unsplash.com/photo-1594744803329-e58b31239f85?w=400&q=80' },
              { name: 'Luca Dal Maestro', role: 'Sous-Chef', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80' },
              { name: 'Andrea Rossi', role: 'Sommelier', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80' },
            ],
          },
        },
        {
          ...B, id: 'rs-home-hours', type: 'openingHours',
          data: {
            headline: 'Öffnungszeiten',
            days: [
              { label: 'Dienstag — Samstag', hours: '11:30 — 14:30 & 17:30 — 23:00 Uhr' },
              { label: 'Sonntag', hours: '11:30 — 22:00 Uhr' },
              { label: 'Montag', hours: '', closed: true, note: 'Ruhetag' },
            ],
            kitchenHoursHeadline: 'Küchenzeiten',
            kitchenHoursText: 'Warme Küche bis 30 Min. vor Schluss.',
          },
        },
        {
          ...B, id: 'rs-home-faq', type: 'faq',
          data: {
            headline: 'Häufige Fragen',
            items: [
              { question: 'Muss ich reservieren?', answer: 'Wir empfehlen eine Reservierung, besonders Fr/Sa ab 19 Uhr. Für Lunch unter der Woche kommen Sie gerne spontan.' },
              { question: 'Gibt es vegetarische Optionen?', answer: 'Ja! Unsere Karte hat zahlreiche vegetarische Pasta- und Risotto-Gerichte. Auf Wunsch auch vegan.' },
              { question: 'Haben Sie eine Terrasse?', answer: 'Ja, von Mai bis September mit Blick auf die Nordkette — ca. 40 Plätze.' },
              { question: 'Bieten Sie Catering an?', answer: 'Ja, für Events bis 100 Personen in Innsbruck und Umgebung.' },
            ],
          },
        },
        {
          ...B, id: 'rs-home-cta', type: 'ctaBand',
          data: {
            headline: 'Buon Appetito!',
            subline: 'Reservieren Sie jetzt und erleben Sie authentische italienische Küche.',
            ctaPrimary: { label: 'Tisch reservieren', href: '/demo/restaurant/reservierung' },
          },
        },
      ],
    },
    {
      slug: 'speisekarte',
      title: 'Speisekarte',
      sections: [
        {
          ...HERO,
          id: 'rs-menu-hero',
          type: 'hero',
          data: {
            headline: 'Unsere Speisekarte',
            subline: 'Frische Zutaten, traditionelle Rezepte, leidenschaftlich zubereitet',
            bgImage: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1800&q=85',
            primaryCta: { label: 'Tisch reservieren', href: '/demo/restaurant/reservierung' },
          },
        },
        {
          ...B,
          id: 'rs-menu-full',
          type: 'menu',
          data: {
            headline: 'La Carta',
            footnote: 'Alle Gerichte werden mit frischen, saisonalen Zutaten zubereitet. Änderungen vorbehalten. Bitte informieren Sie uns über Allergien und Unverträglichkeiten.',
            categories: [
            {
              title: 'Antipasti',
              description: 'Kleine Kostbarkeiten zum Einstimmen',
              items: [
                {
                  name: 'Bruschetta Classica',
                  description: 'geröstetes Ciabatta mit marinierten San-Marzano-Tomaten, Knoblauch, frischem Basilikum und nativem Olivenöl extra.',
                  price: '12,00 €',
                  image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=900&q=80',
                  tags: ['vegetarisch'],
                  allergens: ['Gluten'],
                },
                {
                  name: 'Carpaccio di Manzo',
                  description: 'HauchDünn geschnittenes Rinderfilet mit Rucola, Parmigianspänen, Kapern und Zitronendressing.',
                  price: '16,50 €',
                  allergens: ['Milch'],
                },
                {
                  name: 'Burrata Pugliese',
                  description: 'Cremige Burrata aus Apulien auf einem Bett von ofengerösteten Kirschtomaten und Basilikum-Pesto.',
                  price: '15,00 €',
                  image: 'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=900&q=80',
                  tags: ['vegetarisch'],
                  allergens: ['Milch'],
                },
                {
                  name: 'Vitello Tonnato',
                  description: 'Zartes Kalbfleisch in hauchDünnen Scheiben mit cremiger Thunfisch-Kapern-Sauce — ein Klassiker aus dem Piemont.',
                  price: '17,50 €',
                  allergens: ['Fisch', 'Ei'],
                },
                {
                  name: 'Cozze alla Marinara',
                  description: 'Frische Miesmuscheln in würziger Tomaten-Weißwein-Sauce mit Knoblauch und Petersilie, serviert mit Focaccia.',
                  price: '16,00 €',
                  allergens: ['Weichtiere', 'Gluten'],
                },
                {
                  name: 'Insalata Caprese',
                  description: 'Büffel-Mozzarella mit sonnengereiften Tomaten, frischem Basilikum und erstklassigem Olivenöl aus Ligurien.',
                  price: '13,50 €',
                  tags: ['vegetarisch'],
                  allergens: ['Milch'],
                },
              ],
            },
            {
              title: 'Primi Piatti — Pasta & Risotto',
              description: 'Täglich frisch in unserer offenen Küche zubereitet',
              items: [
                {
                  name: 'Tagliatelle al Tartufo',
                  description: 'Handgerollte Tagliatelle mit schwarzem Trüffel, Parmigiano Reggiano 36 Monate und einem Hauch Trüffeloel.',
                  price: '24,00 €',
                  image: 'https://images.unsplash.com/photo-1556761223-4c4282c73f77?w=900&q=80',
                  tags: ['vegetarisch'],
                  allergens: ['Gluten', 'Milch', 'Ei'],
                },
                {
                  name: 'Risotto ai Funghi Porcini',
                  description: 'Carnaroli-Risotto mit frischen Steinpilzen, Thymian und einem Großzügigen Stück Butter zum Abschluss.',
                  price: '21,00 €',
                  tags: ['vegetarisch'],
                  allergens: ['Milch'],
                },
                {
                  name: 'Spaghetti alle Vongole',
                  description: 'Spaghetti mit frischen Venusmuscheln, Knoblauch, Chili, Petersilie und einem Schuss Vermentino.',
                  price: '22,00 €',
                  image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=900&q=80',
                  allergens: ['Gluten', 'Weichtiere'],
                },
                {
                  name: 'Ravioli di Spinaci e Ricotta',
                  description: 'Hausgemachte Ravioli gefüllt mit Spinat und Ricotta in zerlassener Salbeibutter mit Pinienkernen.',
                  price: '19,00 €',
                  tags: ['vegetarisch'],
                  allergens: ['Gluten', 'Milch', 'Ei', 'Nüsse'],
                },
                {
                  name: 'Penne all\'Arrabbiata',
                  description: 'Penne in feuriger Tomatensauce mit Knoblauch, Peperoncino und frischer Petersilie — für alle, die es schärfer mögen.',
                  price: '16,00 €',
                  tags: ['vegetarisch', 'scharf', 'vegan'],
                  allergens: ['Gluten'],
                },
                {
                  name: 'Gnocchi al Gorgonzola',
                  description: 'Kartoffelgnocchi in samtiger Gorgonzola-Sahne-Sauce mit gerösteten Walnüssen und frischem Schnittlauch.',
                  price: '18,50 €',
                  tags: ['vegetarisch'],
                  allergens: ['Gluten', 'Milch', 'Nüsse'],
                },
              ],
            },
            {
              title: 'Secondi — Hauptgerichte',
              description: 'Fleisch & Fisch aus nachhaltiger Herkunft',
              items: [
                {
                  name: 'Osso Buco alla Milanese',
                  description: 'Langsam geschmorte Kalbshaxe auf Safranrisotto mit Gremolata — unser Signature-Gericht seit 1998.',
                  price: '34,00 €',
                  image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=900&q=80',
                  allergens: ['Milch'],
                },
                {
                  name: 'Saltimbocca alla Romana',
                  description: 'Zartes Kalbsschnitzel mit luftgetrocknetem Prosciutto und Salbei, Abgelöscht mit Marsala, dazu Blattspinat.',
                  price: '29,00 €',
                  allergens: ['Milch'],
                },
                {
                  name: 'Branzino al Forno',
                  description: 'Ganzer Wolfsbarsch im Ofen gegart mit Kirschtomaten, Oliven, Kapern und frischen Kräutern.',
                  price: '32,00 €',
                  image: 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=900&q=80',
                  allergens: ['Fisch'],
                },
                {
                  name: 'Tagliata di Manzo',
                  description: 'Gegrilltes RinderRückensteak, aufgeschnitten auf Rucola-Bett mit Parmesan, Balsamico-Reduktion und Rosmarin-Kartoffeln.',
                  price: '38,00 €',
                  allergens: ['Milch'],
                },
                {
                  name: 'Scaloppine al Limone',
                  description: 'Dünne Kalbsschnitzel in frischer Zitronen-Butter-Sauce mit Kapern, dazu saisonales Gemüse.',
                  price: '28,00 €',
                  allergens: ['Milch'],
                },
              ],
            },
            {
              title: 'Dolci',
              description: 'Süße Verführungen zum perfekten Abschluss',
              items: [
                {
                  name: 'Tiramisù della Casa',
                  description: 'Unser legendäres Hausdessert nach Nonna Marias Rezept — Mascarpone, Espresso, Amaretto, 24 Stunden durchgezogen.',
                  price: '12,00 €',
                  image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=900&q=80',
                  allergens: ['Milch', 'Ei', 'Gluten'],
                },
                {
                  name: 'Panna Cotta ai Frutti di Bosco',
                  description: 'Vanille-Panna-Cotta mit hausgemachtem Waldbeeren-Coulis und frischer Minze.',
                  price: '10,00 €',
                  tags: ['vegetarisch'],
                  allergens: ['Milch'],
                },
                {
                  name: 'Affogato al Caffè',
                  description: 'Cremiges Fior-di-Latte-Gelato, Übergossen mit einem doppelten Espresso und optional einem Schuss Amaretto.',
                  price: '9,50 €',
                  tags: ['vegetarisch'],
                  allergens: ['Milch'],
                },
                {
                  name: 'Cannoli Siciliani',
                  description: 'Knusprige TeigRöllchen gefüllt mit süßer Ricotta-Creme, kandierten Früchten und Pistazien aus Bronte.',
                  price: '13,00 €',
                  image: 'https://images.unsplash.com/photo-1611293388250-580b08c4a145?w=900&q=80',
                  allergens: ['Gluten', 'Milch', 'Nüsse'],
                },
              ],
            },
          ],
          },
        },
        {
          ...B,
          id: 'rs-menu-seasonal',
          type: 'richText',
          data: {
            headline: 'Saisonale Empfehlungen',
            text: '<p>Unser Küchenchef Marco wählt jede Woche die besten saisonalen Zutaten vom Tiroler Bauernmarkt und direkt aus Italien. Fragen Sie nach dem Tagesmenü — es lohnt sich immer.</p><p>Aktuell empfehlen wir: Trüffel-Risotto mit frischen Steinpilzen und unsere hausgemachten Pappardelle mit Wildschwein-Ragù.</p>',
          },
        },
        {
          ...B,
          id: 'rs-menu-testimonials',
          type: 'testimonials',
          data: {
            headline: 'Stimmen zur Karte',
            items: [
              { quote: 'Die beste Pasta außerhalb Italiens. Der Tartufo-Gang war ein Traum.', author: 'Andreas W.', role: 'Google-Bewertung' },
              { quote: 'Auch für Vegetarier ein Gedicht — das Risotto ai funghi ist unübertroffen.', author: 'Sabine L.', role: 'TripAdvisor' },
            ],
          },
        },
        {
          ...B,
          id: 'rs-menu-cta',
          type: 'ctaBand',
          data: {
            headline: 'Appetit bekommen?',
            subline: 'Reservieren Sie jetzt Ihren Tisch und genießen Sie unsere Gerichte frisch aus der Küche.',
            ctaPrimary: { label: 'Tisch reservieren', href: '/demo/restaurant/reservierung' },
          },
        },
      ],
    },
    {
      slug: 'ambiente',
      title: 'Ambiente & Räume',
      sections: [
        {
          ...HERO,
          id: 'rs-amb-hero',
          type: 'hero',
          data: {
            headline: 'Ambiente & Räume',
            subline: 'Wo Geschichte auf Genuss trifft — unser Restaurant in der Innsbrucker Altstadt',
            bgImage: 'https://images.unsplash.com/photo-1550966871-3ed3cdb51f3a?w=1800&q=85',
          },
        },
        {
          ...B,
          id: 'rs-amb-detail',
          type: 'ambience',
          data: {
            headline: 'Unsere Räumlichkeiten',
            subline: 'Drei einzigartige Bereiche für unvergessliche Momente',
            imagePrimary: 'https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=900&q=80',
            imageSecondary: 'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=900&q=80',
            imageTertiary: 'https://images.unsplash.com/photo-1528823872057-9c018a7a7553?w=900&q=80',
            highlights: [
              {
                title: 'Gewölbekeller aus dem 15. Jahrhundert',
                text: 'Originale Steinbögen und historisches Ambiente verleihen jedem Besuch einen besonderen Rahmen.',
                icon: 'castle',
              },
              {
                title: 'Sonnenterrasse mit Alpenblick',
                text: 'Genießen Sie von Mai bis September die warme Jahreszeit mit Blick auf die Innsbrucker Nordkette.',
                icon: 'sun',
              },
              {
                title: 'Private Dining für bis zu 12 Personen',
                text: 'Unser Weinkeller bietet den perfekten Rahmen für Geburtstage, Jubiläen oder Geschäftsessen in exklusiver Atmosphäre.',
                icon: 'wine',
              },
            ],
            ctaPrimary: { label: 'Tisch reservieren', href: '/demo/restaurant/reservierung' },
          },
        },
        {
          ...B,
          id: 'rs-amb-testimonials',
          type: 'testimonials',
          data: {
            headline: 'Was unsere Gäste sagen',
            items: [
              { quote: 'Das Ambiente im Gewölbekeller ist einzigartig — man fühlt sich wie in einer echten italienischen Trattoria.', author: 'Sarah M.', role: 'Stammgast seit 2015' },
              { quote: 'Die Terrasse mit Blick auf die Nordkette ist der perfekte Ort für ein Sommerabendessen.', author: 'Thomas K.', role: 'Google-Bewertung' },
              { quote: 'Unser Private Dining im Weinkeller war unvergesslich. Perfekt für unseren Hochzeitstag!', author: 'Anna & Stefan', role: 'Private Dining Gäste' },
            ],
          },
        },
        {
          ...B,
          id: 'rs-amb-stats',
          type: 'socialProofBar',
          data: {
            items: [
              { value: '120', label: 'Sitzplätze innen' },
              { value: '40', label: 'Terrassenplätze' },
              { value: '12', label: 'Private Dining' },
              { value: '15. Jh.', label: 'Gewölbekeller' },
            ],
          },
        },
        {
          ...B,
          id: 'rs-amb-cta',
          type: 'ctaBand',
          data: {
            headline: 'Exklusives Private Dining',
            subline: 'Reservieren Sie unseren Weinkeller für ein unvergessliches Dinner in privater Atmosphäre.',
            ctaPrimary: { label: 'Private Dinner buchen', href: '/demo/restaurant/reservierung' },
          },
        },
      ],
    },
    {
      slug: 'events',
      title: 'Events & Catering',
      sections: [
        {
          ...HERO,
          id: 'rs-evt-hero',
          type: 'hero',
          data: {
            headline: 'Events & Catering',
            subline: 'Gemeinsam feiern, Genießen und die italienische Küche erleben',
            bgImage: 'https://images.unsplash.com/photo-1530062845289-9109b2c9c868?w=1800&q=85',
          },
        },
        {
          ...B,
          id: 'rs-evt-list',
          type: 'events',
          data: {
            headline: 'Unsere Veranstaltungen',
            subline: 'regelmäßige Events und individuelle Angebote',
            events: [
            {
              title: 'Wein & Pasta Abend',
              dateLabel: 'Jeden letzten Freitag im Monat',
              timeLabel: '19:00 — 22:30 Uhr',
              description: 'Vier Gänge, vier Weine: Unser Sommelier Andrea führt Sie durch eine Reise von Südtirol bis Sizilien. Jeder Gang wird von Küchenchef Marco live erklärt und mit dem perfekten Wein begleitet. Inkl. Aperitivo, Wasser und Kaffee.',
              image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=900&q=80',
              imageAlt: 'Weingläser und Pasta auf einem festlich gedeckten Tisch',
              priceLabel: '49,00 € pro Person',
              cta: { label: 'Platz reservieren', href: '/demo/restaurant/reservierung' },
            },
            {
              title: 'Kochkurs: Frische Pasta',
              dateLabel: 'Jeden 2. und 4. Samstag im Monat',
              timeLabel: '10:00 — 14:00 Uhr',
              description: 'Lernen Sie von Küchenchef Marco die Kunst der frischen Pasta: Tagliatelle, Ravioli und Gnocchi — von Hand gemacht, mit Liebe und den besten Zutaten. Inkl. gemeinsames Mittagessen mit Wein und Rezeptmappe zum Mitnehmen.',
              image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=900&q=80',
              imageAlt: 'Hände formen frische Pasta auf einer bemehlten Arbeitsfläche',
              priceLabel: '89,00 € pro Person',
              cta: { label: 'Kurs buchen', href: '/demo/restaurant/reservierung' },
            },
            {
              title: 'Firmen-Events & Private Dining',
              dateLabel: 'Auf Anfrage',
              timeLabel: 'Individuell planbar',
              description: 'Ob Teambuilding, Kundenevent oder private Feier — wir gestalten Ihr Event nach Ihren wünschen. Exklusiver Weinkeller für bis zu 12 Personen, Hauptsaal für Gruppen bis 60 Personen. Individuelle Menüzusammenstellung, Weinbegleitung und Dekoration auf Anfrage.',
              image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=900&q=80',
              imageAlt: 'Elegantes Private Dining im Weinkeller',
              priceLabel: 'Auf Anfrage',
              cta: { label: 'Anfrage senden', href: '/demo/restaurant/reservierung' },
            },
          ],
          },
        },
        {
          ...B,
          id: 'rs-evt-faq',
          type: 'faq',
          data: {
            headline: 'Häufige Fragen zu Events',
            items: [
              { question: 'Wie weit im Voraus sollte ich ein Event buchen?', answer: 'Wir empfehlen mindestens 4 Wochen Vorlaufzeit für private Events. Für größere Feiern ab 30 Personen planen Sie bitte 6–8 Wochen ein.' },
              { question: 'Kann ich ein individuelles Menü zusammenstellen?', answer: 'Selbstverständlich! Unser Küchenchef Marco erstellt gerne ein maßgeschneidertes Menü nach Ihren Wünschen und Ernährungsbedürfnissen.' },
              { question: 'Bieten Sie auch Catering außer Haus an?', answer: 'Ja, wir bieten Catering für Events in Innsbruck und Umgebung an — von kleinen Aperitivi bis zu vollständigen Menüs für bis zu 100 Personen.' },
            ],
          },
        },
        {
          ...B,
          id: 'rs-evt-highlights',
          type: 'richText',
          data: {
            headline: 'Highlights vergangener Events',
            text: '<p>Von Firmen-Weihnachtsfeiern über Hochzeitsempfänge bis hin zu Weinverkostungen mit renommierten Winzern — in über 25 Jahren haben wir hunderte unvergessliche Abende gestaltet.</p><p>Lassen Sie sich inspirieren und sprechen Sie uns an — gemeinsam planen wir Ihr perfektes Event.</p>',
          },
        },
      ],
    },
    {
      slug: 'reservierung',
      title: 'Reservierung',
      sections: [
        {
          ...HERO,
          id: 'rs-res-hero',
          type: 'hero',
          data: {
            headline: 'Reservierung',
            subline: 'Sichern Sie sich Ihren Lieblingstisch in der Trattoria Dal Maestro',
            bgImage: 'https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=1800&q=85',
            primaryCta: { label: 'Jetzt reservieren', href: '#reservation-form' },
          },
        },
        {
          ...B,
          id: 'rs-res-hours',
          type: 'openingHours',
          data: {
            headline: 'Unsere Öffnungszeiten',
            days: [
              { label: 'Dienstag — Samstag', hours: '11:30 — 14:30 Uhr & 17:30 — 23:00 Uhr' },
              { label: 'Sonntag', hours: '11:30 — 22:00 Uhr' },
              { label: 'Montag', hours: '', closed: true, note: 'Ruhetag' },
            ],
            kitchenHoursHeadline: 'Küchenzeiten',
            kitchenHoursText: 'Warme Küche bis 30 Minuten vor Restaurantschluss.',
            holidayNote: 'An Feiertagen nach gesonderter Ankündigung.',
            ctaPrimary: { label: 'Tisch reservieren', href: '/demo/restaurant/reservierung' },
          },
        },
        {
          ...B,
          id: 'rs-res-form',
          type: 'reservation',
          data: {
            headline: 'Tisch reservieren',
            introText: 'Füllen Sie einfach das Formular aus und wir bestätigen Ihre Reservierung innerhalb von 2 Stunden per E-Mail. für kurzfristige Anfragen empfehlen wir einen Anruf.',
            partySizeOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            phoneCta: {
              label: 'Telefonisch: +43 512 123 456',
              href: 'tel:+43512123456',
            },
            timeHint: 'Bitte beachten Sie: Reservierungen für Freitag und Samstag ab 19 Uhr sind besonders beliebt. Wir empfehlen eine Buchung mindestens 3 Tage im Voraus.',
            policyText: 'Bitte informieren Sie uns mindestens 24 Stunden im Voraus, falls Sie Ihre Reservierung stornieren oder ändern möchten. Bei Nichterscheinen kann eine Gebühr von 25,00 € pro Person anfallen. Gruppen ab 8 Personen bitten wir um eine Anzahlung.',
            externalBookingCta: {
              label: 'Oder buchen Sie über OpenTable',
              href: '/demo/restaurant/reservierung',
            },
            submitLabel: 'Reservierung absenden',
          },
        },
        {
          ...B,
          id: 'rs-res-faq',
          type: 'faq',
          data: {
            headline: 'Häufige Fragen zur Reservierung',
            items: [
              { question: 'Wie kann ich meine Reservierung stornieren?', answer: 'Bitte informieren Sie uns mindestens 24 Stunden im Voraus per Telefon oder E-Mail. Bei Nichterscheinen kann eine Gebühr von 25 € pro Person anfallen.' },
              { question: 'Gibt es eine maximale Gruppengröße?', answer: 'Im Hauptsaal können wir Gruppen bis 60 Personen bewirten. Für den Weinkeller sind maximal 12 Personen möglich.' },
              { question: 'Kann ich einen bestimmten Tisch reservieren?', answer: 'Gerne berücksichtigen wir Ihre Wünsche nach Möglichkeit. Geben Sie Ihre Präferenz einfach bei der Reservierung an.' },
            ],
          },
        },
        {
          ...B,
          id: 'rs-res-groups',
          type: 'richText',
          data: {
            headline: 'Gruppenreservierungen & Private Dining',
            text: '<p>Für Gruppen ab 8 Personen erstellen wir gerne ein individuelles Menü. Unser Weinkeller bietet Platz für exklusive Dinner mit bis zu 12 Gästen — perfekt für Geburtstage, Jubiläen oder Geschäftsessen.</p><p>Kontaktieren Sie uns für ein unverbindliches Angebot unter <strong>+43 512 123 456</strong> oder per E-Mail.</p>',
          },
        },
      ],
    },
    {
      slug: 'ueber-uns',
      title: 'Über uns',
      sections: [
        {
          ...HERO,
          id: 'rs-about-hero',
          type: 'hero',
          data: {
            headline: 'Unsere Geschichte',
            subline: 'Seit 1998 bringen wir authentischen italienischen Genuss nach Innsbruck',
            bgImage: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=1800&q=85',
          },
        },
        {
          ...B,
          id: 'rs-about-story',
          type: 'textImage',
          data: {
            headline: 'Famiglia Dal Maestro',
            text: '<p>Als Marco Dal Maestro 1998 die Türen seiner Trattoria in der Innsbrucker Altstadt öffnete, hatte er eine Vision: Den Geschmack seiner Heimat Kampanien in die Alpen bringen — ohne Kompromisse.</p><p>Heute führt er das Restaurant gemeinsam mit seiner Frau Elena und Sohn Luca. Die Rezepte stammen von Nonna Maria, die Zutaten kommen wöchentlich direkt aus Italien. Was sich nie geändert hat: die Leidenschaft für ehrliche, handgemachte Küche.</p>',
            image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=900&q=80',
            imagePosition: 'right',
          },
        },
        {
          ...B,
          id: 'rs-about-team',
          type: 'team',
          data: {
            headline: 'Unser Team',
            subline: 'Die Menschen hinter dem Genuss',
            members: [
              { name: 'Marco Dal Maestro', role: 'Küchenchef & Inhaber', specialization: 'Klassische italienische Küche, Pasta fresca', image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&q=80' },
              { name: 'Elena Dal Maestro', role: 'Geschäftsführung & Service', specialization: 'Gastgeberin, Weinauswahl, Events', image: 'https://images.unsplash.com/photo-1594744803329-e58b31239f85?w=400&q=80' },
              { name: 'Luca Dal Maestro', role: 'Sous-Chef', specialization: 'Moderne Interpretationen, Desserts', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80' },
              { name: 'Andrea Rossi', role: 'Sommelier', specialization: 'Italienische Weine, Weinbegleitung, Degustationen', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80' },
            ],
          },
        },
        {
          ...B,
          id: 'rs-about-values',
          type: 'uspStrip',
          data: {
            items: [
              { icon: 'leaf', title: 'Frische Zutaten', text: 'Wöchentliche Lieferung direkt aus Kampanien und vom Tiroler Bauernmarkt.' },
              { icon: 'cookie', title: 'Alles handgemacht', text: 'Pasta, Brot und Desserts — täglich frisch in unserer offenen Küche.' },
              { icon: 'grape', title: '120+ italienische Weine', text: 'Kuratiert von unserem Sommelier Andrea — von Südtirol bis Sizilien.' },
              { icon: 'heart', title: 'Familienbetrieb', text: 'Drei Generationen Leidenschaft für authentische italienische Küche.' },
            ],
          },
        },
        {
          ...B,
          id: 'rs-about-stats',
          type: 'statsCounter',
          data: {
            headline: 'Trattoria Dal Maestro in Zahlen',
            stats: [
              { value: 25, suffix: '+', label: 'Jahre in Innsbruck' },
              { value: 12000, suffix: '+', label: 'Zufriedene Gäste pro Jahr' },
              { value: 120, suffix: '', label: 'Italienische Weine' },
              { value: 4.8, suffix: '/5', label: 'Durchschnittliche Bewertung' },
            ],
          },
        },
        {
          ...B,
          id: 'rs-about-testimonials',
          type: 'testimonials',
          data: {
            headline: 'Stimmen unserer Gäste',
            items: [
              { quote: 'Die beste italienische Küche außerhalb Italiens. Wir kommen seit 10 Jahren hierher und es wird nie langweilig.', author: 'Familie Huber', role: 'Stammgäste' },
              { quote: 'Marco und sein Team haben unsere Hochzeitsfeier zu einem unvergesslichen Abend gemacht. Grazie mille!', author: 'Julia & Markus', role: 'Hochzeitsgäste 2024' },
              { quote: 'Authentisch, herzlich, einfach perfekt. Die Tagliatelle al Tartufo sind ein Gedicht!', author: 'Michael R.', role: 'TripAdvisor-Bewertung' },
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
          ...HERO,
          id: 'rs-gal-hero',
          type: 'hero',
          data: {
            headline: 'Galerie',
            subline: 'Einblicke in Küche, Räume und Genussmomente',
            bgImage: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1800&q=85',
          },
        },
        {
          ...B,
          id: 'rs-gallery',
          type: 'gallery',
          data: {
            headline: 'Bilder aus der Trattoria',
            categories: ['Restaurant', 'Gerichte', 'Events', 'Terrasse'],
            images: [
              { src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80', alt: 'Hauptsaal mit Gewölbe', category: 'Restaurant' },
              { src: 'https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=600&q=80', alt: 'Gedeckter Tisch im Weinkeller', category: 'Restaurant' },
              { src: 'https://images.unsplash.com/photo-1550966871-3ed3cdb51f3a?w=600&q=80', alt: 'Bar-Bereich', category: 'Restaurant' },
              { src: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80', alt: 'Osso Buco alla Milanese', category: 'Gerichte' },
              { src: 'https://images.unsplash.com/photo-1556761223-4c4282c73f77?w=600&q=80', alt: 'Tagliatelle al Tartufo', category: 'Gerichte' },
              { src: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&q=80', alt: 'Tiramisù della Casa', category: 'Gerichte' },
              { src: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&q=80', alt: 'Wein & Pasta Abend', category: 'Events' },
              { src: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&q=80', alt: 'Kochkurs Pasta', category: 'Events' },
              { src: 'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=600&q=80', alt: 'Sonnenterrasse', category: 'Terrasse' },
            ],
          },
        },
        {
          ...B,
          id: 'rs-gal-credits',
          type: 'richText',
          data: {
            headline: 'Über unsere Bilder',
            text: '<p>Unsere Food-Fotografie stammt von der Innsbrucker Fotografin Lisa Berger, die seit 2019 unsere Gerichte und Events begleitet. Die Bilder zeigen echte Gerichte aus unserer Küche — keine Requisiten, kein Styling-Trick.</p>',
          },
        },
        {
          ...B,
          id: 'rs-gal-stats',
          type: 'socialProofBar',
          data: {
            items: [
              { value: '200+', label: 'Fotos im Archiv' },
              { value: '4', label: 'Bereiche' },
              { value: '25+', label: 'Jahre Geschichte' },
              { value: '4.8 ★', label: 'Bewertung' },
            ],
          },
        },
        {
          ...B,
          id: 'rs-gal-cta',
          type: 'ctaBand',
          data: {
            headline: 'Lust bekommen?',
            subline: 'Besuchen Sie uns und erleben Sie die Trattoria Dal Maestro mit allen Sinnen.',
            ctaPrimary: { label: 'Besuchen Sie uns', href: '/demo/restaurant/reservierung' },
          },
        },
      ],
    },
  ],
};
