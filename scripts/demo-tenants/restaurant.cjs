/**
 * Demo tenant: RESTAURANT
 *
 * Identität: "Trattoria Dal Maestro" — ein warmes italienisches
 * Nachbarschaftsrestaurant in München-Haidhausen. Keine generische
 * Fine-Dining-Bühne, sondern handgemachte Pasta, ehrliche Weine,
 * vertrauter Service und kleine Abende, die sich wie Urlaub anfühlen.
 *
 * Brand:
 * - Stadt: München-Haidhausen, Rosenheimer Straße
 * - Story: Küchenchef Paolo Ferraro kam aus Bologna, Gastgeberin Elena
 *   Gruber führt den Gastraum. Die Trattoria arbeitet saisonal, aber nie
 *   verkopft: gute Pasta, Gemüse vom Markt, Wein mit Herkunft.
 * - Tonalität: warm, direkt, sinnlich, ohne Marketing-Floskeln.
 * - Bildwelt: Kerzenlicht, Holz, Pasta, Wein, offene Küche, kleine Tische.
 * - Farben: Espresso, Terrakotta, Creme, Weinrot. Classic style only.
 *
 * Run:
 *   node scripts/demo-tenants/restaurant.cjs
 */

const crypto = require('crypto');
const { run } = require('./_lib/runner.cjs');

const PAT = '910915ec2186b9d044b5ea5f67becabead7291f28c9ef61c384a3d376043a1d1';

const uuid = () => crypto.randomUUID();
const img = (id, w = 1920) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=82`;

const C = {
  espresso: '#2A1712',
  ink: '#21130F',
  clay: '#B95738',
  wine: '#6D2431',
  cream: '#F8EFE2',
  paper: '#FFF9F1',
  sage: '#6F7457',
  gold: '#D79B43',
};

const darkSectionTokens = {
  '--token-heading': '#FFFFFF',
  '--token-subheading': 'rgba(255,255,255,0.9)',
  '--token-body': 'rgba(255,255,255,0.9)',
  '--token-muted': 'rgba(255,255,255,0.68)',
  '--token-eyebrow': '#F2C17B',
  '--token-stat-value': '#F2C17B',
  '--token-quote': '#FFFFFF',
  '--token-icon': '#F2C17B',
  '--token-rating-star': '#F2C17B',
  '--token-check': '#F2C17B',
  '--token-on-dark-heading': '#FFFFFF',
  '--token-on-dark-body': 'rgba(255,255,255,0.9)',
  '--token-on-dark-muted': 'rgba(255,255,255,0.68)',
  '--token-btn-bg': C.cream,
  '--token-btn-text': C.espresso,
  '--token-badge-bg': 'rgba(255,255,255,0.15)',
  '--token-badge-text': '#FFFFFF',
  '--token-badge-border': 'rgba(255,255,255,0.28)',
  '--token-card-bg': 'rgba(42,23,18,0.72)',
  '--token-card-border': 'rgba(255,255,255,0.24)',
};

const heroTokens = {
  ...darkSectionTokens,
  '--token-btn-bg': C.paper,
  '--token-btn-text': C.espresso,
  '--token-badge-bg': 'rgba(255,255,255,0.88)',
  '--token-badge-text': C.espresso,
  '--token-badge-border': 'rgba(255,255,255,0.42)',
};

const warmLightTokens = {
  '--token-section-bg': C.cream,
  '--token-heading': C.espresso,
  '--token-subheading': C.wine,
  '--token-body': '#49352D',
  '--token-muted': '#745F55',
  '--token-icon': C.clay,
  '--token-eyebrow': C.clay,
  '--token-btn-bg': C.espresso,
  '--token-btn-text': '#FFFFFF',
  '--token-badge-bg': '#F1DFC9',
  '--token-badge-text': C.espresso,
  '--token-badge-border': '#E1C6A8',
};

const whiteCardTokens = {
  '--token-card-bg': '#FFFFFF',
  '--token-card-border': '#EADCCD',
  '--token-heading': C.espresso,
  '--token-body': '#49352D',
  '--token-muted': '#78675F',
  '--token-icon': C.clay,
};

const tenant = {
  slug: 'restaurant',
  pat: PAT,
  wipe: true,
  publish: true,

  style: { style: 'classic' },

  brand: {
    companyName: 'Trattoria Dal Maestro',
    tagline: 'Handgemachte Pasta, Wein und Abende mit Gefühl in München-Haidhausen',
    primaryColor: C.espresso,
    secondaryColor: C.wine,
    accentColor: C.clay,
    logoDisplay: 'name',
    headingFont: 'Fraunces',
    bodyFont: 'Inter',
    topBarColor: C.espresso,
    footerColor: '#1B0F0B',
  },

  contact: {
    phone: '+49 89 45218670',
    email: 'ciao@dalmaestro-muenchen.de',
    address: 'Rosenheimer Straße 34, 81669 München',
    whatsapp: '+49 176 45218670',
    whatsappEnabled: true,
    whatsappColor: '#25D366',
  },

  design: {
    sectionBg: C.paper,
    sectionBgAlt: C.cream,
    cardBg: '#FFFFFF',
    cardBorder: '#EADCCD',
    heading: C.espresso,
    subheading: C.wine,
    body: '#49352D',
    muted: '#78675F',
    brand: C.espresso,
    accent: C.clay,
    icon: C.clay,
    btnBg: C.espresso,
    btnText: '#FFFFFF',
    badgeBg: '#F1DFC9',
    badgeText: C.espresso,
    badgeBorder: '#E1C6A8',
    dividerColor: '#EADCCD',
    eyebrow: C.clay,
    statValue: C.wine,
    quote: C.espresso,
    ratingStar: C.gold,
    check: C.clay,
    onDarkHeading: '#FFFFFF',
    onDarkBody: 'rgba(255,255,255,0.9)',
    onDarkMuted: 'rgba(255,255,255,0.68)',
  },

  socialLinks: {
    instagram: 'https://www.instagram.com/trattoria.dalmaestro/',
    facebook: 'https://www.facebook.com/trattoriadalmaestro',
    google: 'https://g.page/trattoria-dal-maestro-muenchen',
    tripadvisor: 'https://www.tripadvisor.de/Restaurant_Review-g187309-dalmaestro',
  },

  openingHours: {
    hours: [
      { type: 'regular', day: 'Montag', closed: true, note: 'Ruhetag' },
      { type: 'regular', day: 'Dienstag', hours: '17:30 - 23:00', note: 'Küche bis 21:45' },
      { type: 'regular', day: 'Mittwoch', hours: '17:30 - 23:00', note: 'Küche bis 21:45' },
      { type: 'regular', day: 'Donnerstag', hours: '17:30 - 23:00', note: 'Küche bis 21:45' },
      { type: 'regular', day: 'Freitag', hours: '17:30 - 00:00', note: 'Küche bis 22:30' },
      { type: 'regular', day: 'Samstag', hours: '12:00 - 15:00 / 17:30 - 00:00', note: 'Pranzo und Abendkarte' },
      { type: 'regular', day: 'Sonntag', hours: '12:00 - 21:30', note: 'Familientische auf Anfrage' },
    ],
  },

  formFields: {
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true, halfWidth: true },
      { name: 'email', label: 'E-Mail', type: 'email', required: true, halfWidth: true },
      { name: 'phone', label: 'Telefon', type: 'tel', required: false, halfWidth: true },
      { name: 'topic', label: 'Anliegen', type: 'select', required: true, halfWidth: true, options: ['Tisch reservieren', 'Feier planen', 'Weinabend anfragen', 'Presse / Kooperation', 'Sonstiges'] },
      { name: 'message', label: 'Nachricht', type: 'textarea', required: true, placeholder: 'Wunschtermin, Personenanzahl und Anlass reichen für den ersten Schritt.' },
    ],
  },

  seoGlobal: {
    titleTemplate: '%s | Trattoria Dal Maestro München',
    defaultTitle: 'Trattoria Dal Maestro - Italienisches Restaurant in München-Haidhausen',
    defaultDescription: 'Italienisches Restaurant in München-Haidhausen mit handgemachter Pasta, saisonaler Karte, Weinabenden, privaten Feiern und herzlichem Service.',
    defaultOgImage: img('1514933651103-005eec06c04b', 1200),
    locale: 'de_DE',
  },

  navigation: {
    items: [
      { label: 'Startseite', href: '/' },
      { label: 'Speisekarte', href: '/leistungen' },
      { label: 'Reservierung', href: '/reservierung' },
      { label: 'Events', href: '/events' },
      { label: 'Über uns', href: '/ueber-uns' },
      { label: 'Journal', href: '/news' },
      { label: 'Kontakt', href: '/kontakt' },
    ],
    cta: { label: 'Tisch anfragen', href: '/reservierung' },
  },

  footer: {
    columns: [
      { title: 'Genuss', items: [
        { text: 'Abendkarte', href: '/c/leistungen/abendkarte' },
        { text: 'Mittag am Samstag', href: '/c/leistungen/pranzo-samstag' },
        { text: 'Weinabende', href: '/c/leistungen/weinabende' },
        { text: 'Private Feiern', href: '/c/leistungen/private-feiern' },
      ] },
      { title: 'Restaurant', items: [
        { text: 'Speisekarte', href: '/leistungen' },
        { text: 'Reservierung', href: '/reservierung' },
        { text: 'Events', href: '/events' },
        { text: 'Über uns', href: '/ueber-uns' },
      ] },
      { title: 'Kontakt', items: [
        { text: 'Anfahrt', href: '/kontakt' },
        { text: 'WhatsApp', href: 'https://wa.me/4917645218670' },
        { text: 'Instagram', href: 'https://www.instagram.com/trattoria.dalmaestro/' },
        { text: 'Journal', href: '/news' },
      ] },
    ],
    legalLinks: [
      { label: 'Impressum', href: '/impressum' },
      { label: 'Datenschutz', href: '/datenschutz' },
    ],
    cta: { label: 'Tisch anfragen', href: '/reservierung' },
  },

  collections: [
    {
      key: 'leistungen',
      label: 'Angebote',
      items: [
        buildOfferItem({
          slug: 'abendkarte',
          title: 'Abendkarte',
          excerpt: 'Handgemachte Pasta, saisonales Gemüse, langsam geschmorte Saucen und kleine Antipasti zum Teilen.',
          imageId: '1473093295043-cdd812d0e601',
          intro: 'Unsere Abendkarte ist klein, aber bewusst. Paolo kocht lieber fünf Pastagerichte richtig gut als fünfzehn mittelmäßig. Jede Woche kommen zwei saisonale Gerichte dazu - je nachdem, was Markt, Fischhändler und Gemüsebauern liefern.',
          facts: [
            { value: '5', label: 'Pastas' },
            { value: '3', label: 'Antipasti' },
            { value: '2', label: 'Dolci' },
            { value: 'wöchentlich', label: 'saisonal' },
          ],
        }),
        buildOfferItem({
          slug: 'pranzo-samstag',
          title: 'Pranzo am Samstag',
          excerpt: 'Mittagskarte für lange Samstage: leichte Pasta, Marktsalat, Espresso, Dolci und Zeit am Tisch.',
          imageId: '1555396273-367ea4eb4db5',
          intro: 'Samstags öffnen wir schon mittags. Der Pranzo ist leichter als die Abendkarte, aber genauso sorgfältig: frische Tagliatelle, Caponata, Burrata, kleine Weine und Espresso danach. Ideal vor dem Spaziergang an der Isar oder nach dem Markt.',
          facts: [
            { value: '12-15', label: 'Uhr' },
            { value: '4', label: 'Tagesgerichte' },
            { value: '2', label: 'Dolci' },
            { value: 'ohne', label: 'Eile' },
          ],
        }),
        buildOfferItem({
          slug: 'weinabende',
          title: 'Weinabende',
          excerpt: 'Kleine Abende mit vier Gängen, passenden Weinen und Geschichten aus Piemont, Toskana und Sizilien.',
          imageId: '1510812431401-41d2bd2722f3',
          intro: 'Einmal im Monat decken wir weniger Tische und nehmen uns mehr Zeit: vier Gänge, fünf Weine, kurze Geschichten zur Herkunft und genug Raum für Gespräche. Kein Vortrag, kein steifer Abend - nur gutes Essen und ein Gastgeber, der die Flaschen kennt.',
          facts: [
            { value: '4', label: 'Gänge' },
            { value: '5', label: 'Weine' },
            { value: '22', label: 'Plätze' },
            { value: 'monatlich', label: 'Termine' },
          ],
        }),
        buildOfferItem({
          slug: 'private-feiern',
          title: 'Private Feiern',
          excerpt: 'Geburtstage, kleine Firmenabende und Familienessen bis 34 Personen - mit Menü statt Menüchaos.',
          imageId: '1517248135467-4c7edcad34c4',
          intro: 'Für Feiern schließen wir keinen Bereich mit Absperrband ab. Wir planen den Abend so, dass er sich trotzdem privat anfühlt: Menü in drei oder vier Gängen, Weinbegleitung optional, klare Zeiten und eine Gastgeberin, die den Ablauf zusammenhält.',
          facts: [
            { value: '34', label: 'Personen' },
            { value: '3-4', label: 'Gänge' },
            { value: '1', label: 'Ansprechperson' },
            { value: 'klar', label: 'Ablauf' },
          ],
        }),
      ],
    },
    {
      key: 'events',
      label: 'Events',
      items: [
        buildEventItem({
          slug: 'piemont-abend',
          title: 'Piemont-Abend',
          excerpt: 'Vier Gänge, Barolo, Haselnuss, Tajarin und ein Abend, der nach Norditalien schmeckt.',
          imageId: '1529692236671-f1f6cf9683ba',
          dateLabel: 'jeden ersten Donnerstag',
        }),
        buildEventItem({
          slug: 'pasta-workshop',
          title: 'Pasta-Workshop',
          excerpt: 'Ravioli, Tagliatelle und Sugo: ein kleiner Workshop in der offenen Küche mit anschließendem Essen.',
          imageId: '1498579150354-977475b7ea0b',
          dateLabel: 'samstags auf Anfrage',
        }),
        buildEventItem({
          slug: 'familienmittag',
          title: 'Familienmittag',
          excerpt: 'Lange Tische, einfache Gerichte, Kinder willkommen und ein Service, der entspannt bleibt.',
          imageId: '1551218808-94e220e084d2',
          dateLabel: 'sonntags ab 12 Uhr',
        }),
      ],
    },
    {
      key: 'news',
      label: 'Journal',
      items: [
        buildNewsItem({
          slug: 'warum-unsere-karte-klein-ist',
          title: 'Warum unsere Karte bewusst klein bleibt',
          excerpt: 'Eine kleine Karte ist kein Mangel, sondern die Voraussetzung für frische Küche und ruhige Abläufe.',
          imageId: '1473093295043-cdd812d0e601',
          body: '<p>Wir werden oft gefragt, warum unsere Karte nicht länger ist. Die kurze Antwort: weil gute Küche Zeit und Konzentration braucht. Wenn wir weniger Gerichte kochen, können wir genauer einkaufen, sauberer vorbereiten und am Abend entspannter arbeiten.</p><p>Das Ergebnis ist keine Verzichtserklärung. Es ist ein Versprechen: Was auf der Karte steht, haben wir wirklich im Griff.</p>',
        }),
        buildNewsItem({
          slug: 'wein-ohne-theater',
          title: 'Wein ohne Theater',
          excerpt: 'Wie wir Weine auswählen: weniger Etikettenlogik, mehr Trinkfreude am Tisch.',
          imageId: '1510812431401-41d2bd2722f3',
          body: '<p>Ein Wein muss nicht erklärt werden, bevor man ihn trinken darf. Unsere Karte ist so aufgebaut, dass Sie schnell verstehen, was passt: leicht, würzig, mineralisch, kräftig. Wenn Sie möchten, erzählen wir mehr. Wenn nicht, bringen wir einfach ein gutes Glas.</p>',
        }),
        buildNewsItem({
          slug: 'samstag-pranzo',
          title: 'Samstagmittag in Haidhausen',
          excerpt: 'Warum der Samstagmittag für uns der schönste Service der Woche ist.',
          imageId: '1555396273-367ea4eb4db5',
          body: '<p>Samstagmittag ist anders. Niemand kommt gehetzt aus dem Büro, viele bringen Zeit mit, manche noch die Markttasche. Genau dafür öffnen wir mittags: für leichte Pasta, einen Salat, Espresso und ein Gespräch, das nicht zwischen zwei Terminen passiert.</p>',
        }),
      ],
    },
  ],

  pages: [
    {
      slug: 'startseite',
      title: 'Startseite',
      seo: {
        metaTitle: 'Trattoria Dal Maestro - Italienisch essen in München-Haidhausen',
        metaDescription: 'Handgemachte Pasta, saisonale italienische Küche, Weinabende und private Feiern in München-Haidhausen. Tisch bei Trattoria Dal Maestro anfragen.',
      },
      sections: [
        sectionHero({
          badgeText: 'München-Haidhausen · seit 2008',
          headline: 'Italienische Küche, die nach Ankommen schmeckt.',
          subline: 'Handgemachte Pasta, warme Tische und Weine, die nicht erklären müssen, warum sie gut sind.',
          imageId: '1514933651103-005eec06c04b',
          primaryLabel: 'Tisch anfragen',
          primaryHref: '/reservierung',
          secondaryLabel: 'Speisekarte ansehen',
          secondaryHref: '/leistungen',
          trustItems: ['Pasta jeden Tag frisch', '4,8 / 5 Gästestimmen', 'Private Feiern bis 34 Personen'],
        }),
        {
          type: 'socialProofBar',
          data: {
            bgStyle: 'light',
            items: [
              { value: '4,8/5', label: 'Google-Bewertung', icon: 'Star' },
              { value: '2008', label: 'geöffnet seit', icon: 'CalendarHeart' },
              { value: '34', label: 'Plätze für Feiern', icon: 'Users' },
              { value: 'jede Woche', label: 'frische Karte', icon: 'Sparkles' },
            ],
          },
        },
        {
          type: 'ambience',
          data: {
            badgeText: 'Der Raum',
            headline: 'Nicht laut. Nicht steif. Einfach warm.',
            subline: '<p>Holz, Kerzen, offene Küche und Tische, die nah genug für Stimmung sind, aber weit genug für ein echtes Gespräch.</p>',
            imagePrimary: img('1517248135467-4c7edcad34c4'),
            imageSecondary: img('1552566626-52f8b828add9'),
            imageTertiary: img('1529692236671-f1f6cf9683ba'),
            highlights: [
              { icon: 'Flame', title: 'offene Küche', text: 'Sie sehen, was passiert, aber der Abend bleibt ruhig.' },
              { icon: 'Wine', title: 'kleine Weinkarte', text: 'Sorgfältig ausgewählt, verständlich erklärt.' },
              { icon: 'Baby', title: 'Familien willkommen', text: 'Sonntagmittag ohne genervte Blicke.' },
              { icon: 'PartyPopper', title: 'Feiern möglich', text: 'Bis 34 Personen mit festem Menü.' },
            ],
            ctaPrimary: { label: 'Atmosphäre ansehen', href: '/ueber-uns' },
          },
        },
        {
          type: 'servicesGrid',
          data: {
            badgeText: 'Angebote',
            headline: 'Vier Arten, bei uns gut zu sitzen.',
            subline: 'Abendkarte, Pranzo, Weinabend oder private Feier - alles mit klarer Vorbereitung und ohne steifen Ablauf.',
            ctaLabel: 'Alle Angebote ansehen',
            ctaHref: '/leistungen',
            manualCards: offerCards(),
          },
        },
        {
          type: 'menu',
          data: menuData('Ein Blick auf die Karte', 'Auszug aus einer Karte, die sich saisonal bewegt.'),
        },
        {
          type: 'signatureDishes',
          data: {
            headline: 'Gerichte, wegen denen Stammgäste wiederkommen.',
            dishes: [
              { name: 'Tajarin al Limone', description: 'Feine Eiernudeln, Zitrone, Butter, Parmesan und schwarzer Pfeffer.', image: img('1473093295043-cdd812d0e601', 900), price: '18 €' },
              { name: 'Ravioli di Zucca', description: 'Kürbis, Salbei, braune Butter und ein Hauch Amaretti.', image: img('1504674900247-0877df9cc836', 900), price: '19 €' },
              { name: 'Bistecca Tagliata', description: 'Rosa geschnitten, Rucola, Olivenöl, Rosmarinkartoffeln.', image: img('1558030006-450675393462', 900), price: '32 €' },
            ],
          },
        },
        {
          type: 'featureShowcase',
          data: {
            headline: 'Kleine Karte, große Aufmerksamkeit.',
            subline: 'Wir kochen nicht alles. Wir kochen das, was wir frisch einkaufen, sauber vorbereiten und am Abend wirklich gut servieren können.',
            image: img('1498579150354-977475b7ea0b'),
            features: [
              'Pasta, Füllungen und Saucen entstehen täglich in der Küche.',
              'Was der Markt nicht hergibt, kommt nicht auf die Karte.',
              'Weinempfehlungen bleiben verständlich und passen zum Essen.',
              'Der Service merkt sich Vorlieben statt nur Reservierungsnummern.',
            ],
            ctaLabel: 'Speisekarte ansehen',
            ctaHref: '/leistungen',
          },
        },
        {
          type: 'processSteps',
          data: {
            badgeText: 'Reservieren',
            headline: 'So bleibt der Abend entspannt.',
            subline: 'Wir fragen nur ab, was für einen guten Tisch wirklich hilft.',
            steps: [
              { icon: 'CalendarCheck', title: 'Termin nennen', text: 'Datum, Uhrzeit und Personenanzahl reichen im ersten Schritt.' },
              { icon: 'Utensils', title: 'Wünsche ergänzen', text: 'Kinderstuhl, Allergien, Anlass oder Lieblingsplatz gerne dazuschreiben.' },
              { icon: 'MessageCircle', title: 'Rückmeldung bekommen', text: 'Wir bestätigen persönlich - meistens noch am selben Tag.' },
              { icon: 'Wine', title: 'Ankommen', text: 'Der Tisch steht bereit, die Küche weiß Bescheid.' },
            ],
          },
        },
        {
          type: 'bentoGrid',
          data: {
            headline: 'Was Dal Maestro anders macht.',
            subline: 'Nicht spektakulär um jeden Preis. Lieber verlässlich gut, jedes Mal.',
            items: [
              { title: 'Die Küche entscheidet nicht allein', text: 'Gastraum und Küche sprechen vor jedem Service. So bleibt Timing wichtiger als Eitelkeit.', icon: 'MessagesSquare', span: '2' },
              { title: 'Wein darf einfach sein', text: 'Wir übersetzen Herkunft in Trinkgefühl.', icon: 'Wine' },
              { title: 'Feiern mit Ablauf', text: 'Menü, Zeiten und Servicepunkte sind vorher klar.', icon: 'PartyPopper' },
              { title: 'Kinder sind Gäste', text: 'Sonntagmittag gibt es Platz, Geduld und kleine Portionen.', icon: 'Baby' },
              { title: 'Saison ohne Dogma', text: 'Italienisch, aber nicht museal. München darf mitschmecken.', icon: 'Leaf', span: '2' },
            ],
          },
        },
        {
          type: 'timeline',
          data: {
            badge: 'Geschichte',
            headline: 'Aus einer Pasta-Bar wurde ein Haidhauser Abendritual.',
            subline: 'Dal Maestro ist gewachsen, ohne den Raum größer zu machen.',
            entries: [
              { year: '2008', title: 'Paolo eröffnet die erste Pasta-Bar', text: 'Zwölf Plätze, eine Nudelmaschine, drei Saucen und viel zu wenig Stauraum.' },
              { year: '2012', title: 'Elena übernimmt den Gastraum', text: 'Reservierungen, Wein und Stammgäste bekommen ein Gesicht.' },
              { year: '2018', title: 'Die Karte wird kleiner', text: 'Weniger Gerichte, bessere Vorbereitung, ruhigerer Service.' },
              { year: '2024', title: 'Weinabende starten', text: 'Einmal im Monat wird aus der Trattoria ein langer Tisch.' },
            ],
          },
          styleOverrides: warmLightTokens,
        },
        {
          type: 'statsCounter',
          data: {
            headline: 'Ein kleines Restaurant mit vielen Wiederholungen.',
            subline: 'Unsere Zahlen sind nicht laut. Sie zeigen nur, dass Menschen gerne wiederkommen.',
            stats: [
              { value: 16, label: 'Tische' },
              { value: 4, label: 'Pastateige' },
              { value: 34, label: 'Feierplätze' },
              { value: 4.8, suffix: '/5', label: 'Bewertung' },
            ],
          },
          styleOverrides: { '--token-section-bg': C.espresso, ...darkSectionTokens },
        },
        {
          type: 'comparisonTable',
          data: {
            badge: 'Für jeden Anlass',
            headline: 'Was passt zu Ihrem Abend?',
            text: 'Drei Formate, drei Stimmungen - alle mit derselben Sorgfalt.',
            columns: [{ label: 'Dinner' }, { label: 'Weinabend' }, { label: 'Feier' }],
            rows: [
              { feature: 'Personen', values: ['2-6', '10-22', '12-34'] },
              { feature: 'Dauer', values: ['2 Stunden', '3 Stunden', 'nach Absprache'] },
              { feature: 'Karte', values: ['à la carte', '4 Gänge', 'Menü geplant'] },
              { feature: 'Wein', values: ['Empfehlung', 'inklusive', 'optional'] },
              { feature: 'Vorbereitung', values: ['Reservierung', 'Ticket/Anfrage', 'persönliche Planung'] },
            ],
            highlightCol: 1,
          },
        },
        {
          type: 'testimonials',
          data: {
            badgeText: 'Gästestimmen',
            headline: 'Menschen erinnern sich selten an perfekte Abläufe. Aber an gute Abende.',
            subline: 'Das sagen Gäste, die häufiger bei uns sitzen.',
            ratingValue: '4,8',
            ratingCount: '318 Bewertungen',
            items: [
              { quote: 'Wir kommen wegen der Pasta, bleiben aber wegen der Ruhe im Raum.', name: 'M. Huber', context: 'Stammgast aus Haidhausen', rating: 5, sourceLabel: 'Google' },
              { quote: 'Unsere Familienfeier war unkompliziert geplant und am Abend genau richtig geführt.', name: 'Claudia S.', context: 'Geburtstagsessen', rating: 5, sourceLabel: 'Google' },
              { quote: 'Keine riesige Karte, dafür jedes Gericht wirklich gut. Genau unser Restaurant.', name: 'Thomas K.', context: 'Abendessen', rating: 5, sourceLabel: 'Tripadvisor' },
              { quote: 'Der Weinabend war angenehm unangestrengt. Man lernt etwas, ohne belehrt zu werden.', name: 'Franziska B.', context: 'Piemont-Abend', rating: 5, sourceLabel: 'Google' },
            ],
            ctaPrimary: { label: 'Tisch anfragen', href: '/reservierung' },
          },
        },
        {
          type: 'faq',
          data: {
            headline: 'Kurz vor dem Abend gefragt.',
            items: restaurantFaq(),
          },
        },
        sectionCta('Einen Tisch, der zu Ihrem Abend passt?', 'Schreiben Sie uns kurz Datum, Uhrzeit und Personenanzahl. Wir melden uns persönlich zurück.', 'Tisch anfragen', '/reservierung'),
      ],
    },

    {
      slug: 'leistungen',
      title: 'Speisekarte & Angebote',
      seo: {
        metaTitle: 'Speisekarte, Pranzo, Weinabende und Feiern',
        metaDescription: 'Speisekarte und Angebote der Trattoria Dal Maestro in München: Abendkarte, Pranzo am Samstag, Weinabende und private Feiern.',
      },
      sections: [
        sectionCollectionHero('Speisekarte, aber ohne Überforderung.', 'Kleine Karte, klare Herkunft, Gerichte mit genug Ruhe in der Vorbereitung.', '1514933651103-005eec06c04b', 'Speisekarte'),
        { type: 'servicesGrid', data: { badgeText: 'Angebote', headline: 'Wählen Sie nicht aus Masse, sondern aus Haltung.', subline: 'Unsere Formate sind bewusst übersichtlich - und genau deshalb gut planbar.', ctaLabel: 'Tisch anfragen', ctaHref: '/reservierung', manualCards: offerCards() } },
        { type: 'menu', data: menuData('Auszug aus der aktuellen Karte', 'Die genaue Karte wechselt je nach Saison, Markt und Serviceplanung.') },
        { type: 'signatureDishes', data: { headline: 'Signatures aus Küche und Weinkeller.', dishes: [
          { name: 'Tajarin al Limone', description: 'Eiernudeln, Zitrone, Butter, Parmesan, Pfeffer.', image: img('1473093295043-cdd812d0e601', 900), price: '18 €' },
          { name: 'Vitello tonnato', description: 'Kalbfleisch, Thunfischcreme, Kapern, Zitrone.', image: img('1504674900247-0877df9cc836', 900), price: '16 €' },
          { name: 'Tiramisu classico', description: 'Mascarpone, Espresso, Kakao - nicht neu erfunden.', image: img('1514517220032-51f583dc5a68', 900), price: '9 €' },
        ] } },
        { type: 'comparisonTable', data: { badge: 'Formate', headline: 'Dinner, Weinabend oder Feier?', text: 'Wenn Sie unsicher sind, fragen Sie uns. Wir sagen ehrlich, was passt.', columns: [{ label: 'Dinner' }, { label: 'Pranzo' }, { label: 'Feier' }], rows: [
          { feature: 'Ideal für', values: ['Abend zu zweit', 'Samstagmittag', 'Geburtstag / Team'] },
          { feature: 'Karte', values: ['à la carte', 'leichter Auszug', 'Menü nach Absprache'] },
          { feature: 'Personen', values: ['2-8', '2-10', '12-34'] },
          { feature: 'Planung', values: ['Reservierung', 'Reservierung', 'Vorgespräch'] },
        ], highlightCol: 0 } },
        { type: 'collectionList', data: { headline: 'Alle Angebote im Detail', subline: 'Mehr Kontext zu Karte, Pranzo, Weinabenden und Feiern.', collectionKey: 'leistungen', columns: 4, showImage: true, showExcerpt: true, showDate: false, showSortControls: false } },
        { type: 'faq', data: { headline: 'Fragen zur Karte', items: restaurantFaq() } },
        sectionCta('Lust auf einen Abend bei Dal Maestro?', 'Reservieren Sie frühzeitig für Freitag und Samstag. Unter der Woche finden wir meistens schneller einen passenden Tisch.', 'Tisch anfragen', '/reservierung'),
      ],
    },

    {
      slug: 'reservierung',
      title: 'Reservierung',
      seo: {
        metaTitle: 'Tisch reservieren in München-Haidhausen',
        metaDescription: 'Tisch in der Trattoria Dal Maestro anfragen: Datum, Uhrzeit, Personenanzahl und Wünsche senden. Wir bestätigen persönlich.',
      },
      sections: [
        sectionCollectionHero('Reservieren heißt bei uns: kurz schreiben, persönlich hören.', 'Wir bestätigen nicht automatisch, sondern so, dass der Tisch wirklich passt.', '1517248135467-4c7edcad34c4', 'Reservierung'),
        {
          type: 'reservation',
          data: {
            badgeText: 'Tischanfrage',
            headline: 'Sagen Sie uns, wann Sie kommen möchten.',
            subline: 'Wir melden uns persönlich zurück - meistens noch am selben Tag.',
            introText: '<p>Bitte nennen Sie Datum, Uhrzeit, Personenanzahl und besondere Wünsche. Für Gruppen ab 10 Personen empfehlen wir ein kurzes Telefonat.</p>',
            formEnabled: true,
            submitLabel: 'Anfrage senden',
            phoneCta: { label: 'Direkt anrufen', href: 'tel:+498945218670' },
            partySizeOptions: ['1-2', '3-4', '5-6', '7-10', '11+'],
            timeHint: 'Di-Fr ab 17:30, Sa ab 12:00, So ab 12:00',
            policyText: 'Bei Verspätung über 20 Minuten bitten wir um einen kurzen Anruf.',
            image: img('1552566626-52f8b828add9'),
          },
        },
        { type: 'openingHours', data: { headline: 'Unsere Zeiten', days: [
          { label: 'Montag', hours: 'geschlossen' },
          { label: 'Dienstag bis Donnerstag', hours: '17:30 - 23:00' },
          { label: 'Freitag', hours: '17:30 - 00:00' },
          { label: 'Samstag', hours: '12:00 - 15:00 / 17:30 - 00:00' },
          { label: 'Sonntag', hours: '12:00 - 21:30' },
        ] } },
        { type: 'featureShowcase', data: { headline: 'Damit der Tisch wirklich passt.', subline: 'Manchmal ist ein Vierertisch nicht gleich ein Vierertisch. Wir achten auf Anlass, Kinderwagen, Ruhebedarf und Timing.', image: img('1517248135467-4c7edcad34c4'), features: [
          'Gruppen ab 10 Personen bekommen Menü und Timing vorab geklärt.',
          'Kinderwagen, Hochstuhl oder ruhiger Platz werden direkt mitgedacht.',
          'Allergien und Unverträglichkeiten klären wir ehrlich vor der Ankunft.',
          'Freitag und Samstag sind spätere Slots oft entspannter.',
        ], ctaLabel: 'Anfrage senden', ctaHref: '/kontakt' } },
        { type: 'events', data: eventsData('Nächste Abende mit besonderem Anlass') },
        { type: 'faq', data: { headline: 'Reservierung: gut zu wissen', items: restaurantFaq() } },
        sectionCta('Lieber telefonisch klären?', 'Für größere Gruppen oder spontane Anfragen sind wir ab 15 Uhr telefonisch erreichbar.', 'Jetzt anrufen', 'tel:+498945218670'),
      ],
    },

    {
      slug: 'events',
      title: 'Events',
      seo: {
        metaTitle: 'Weinabende, Pasta-Workshops und private Feiern',
        metaDescription: 'Events bei Trattoria Dal Maestro: Weinabende, Pasta-Workshops, Familienmittag und private Feiern in München-Haidhausen.',
      },
      sections: [
        sectionCollectionHero('Kleine Abende, an die man sich erinnert.', 'Wein, Pasta, lange Tische und Formate, die nicht nach Veranstaltungshalle klingen.', '1510812431401-41d2bd2722f3', 'Events'),
        { type: 'events', data: eventsData('Aktuelle Termine und Formate') },
        { type: 'portfolio', data: { badgeText: 'Momente', headline: 'So sehen Abende bei uns aus.', subline: 'Ein Restaurant, drei Stimmungen: Weinabend, Workshop und private Tafel.', projects: [
          { title: 'Piemont-Abend', category: 'Weinabend', description: 'Vier Gänge, fünf Weine, ein langer Tisch.', image: img('1510812431401-41d2bd2722f3'), href: '/c/events/piemont-abend', icon: 'Wine', stats: [{ label: 'Plätze', value: '22' }, { label: 'Gänge', value: '4' }] },
          { title: 'Pasta-Workshop', category: 'Küche', description: 'Ravioli falten, Sugo kochen, zusammen essen.', image: img('1498579150354-977475b7ea0b'), href: '/c/events/pasta-workshop', icon: 'ChefHat', stats: [{ label: 'Dauer', value: '3 h' }, { label: 'Gruppe', value: '8-12' }] },
          { title: 'Familienmittag', category: 'Sonntag', description: 'Lange Tische und entspannter Service.', image: img('1551218808-94e220e084d2'), href: '/c/events/familienmittag', icon: 'Heart', stats: [{ label: 'Start', value: '12 Uhr' }, { label: 'Kinder', value: 'willkommen' }] },
        ], ctaLabel: 'Event anfragen', ctaHref: '/kontakt' } },
        { type: 'bentoGrid', data: { headline: 'Events ohne Event-Gefühl.', subline: 'Wir machen den Ablauf klar, damit der Abend leicht bleibt.', items: [
          { title: 'Menü statt Durcheinander', text: 'Für Gruppen planen wir drei bis vier Gänge mit genug Pausen.', icon: 'ListChecks', span: '2' },
          { title: 'Wein begleitet', text: 'Optional pro Gang, aber nie aufdringlich.', icon: 'Wine' },
          { title: 'Eine Gastgeberin', text: 'Elena hält Kontakt vor und während des Abends.', icon: 'UserCheck' },
          { title: 'Raumgefühl', text: 'Keine kalte Exklusivität, sondern ein Restaurant, das arbeitet.', icon: 'Lamp' },
        ] } },
        { type: 'timeline', data: { badge: 'Ablauf', headline: 'So planen wir eine Feier.', subline: 'Vier Schritte reichen meistens.', entries: [
          { year: '1', title: 'Anlass verstehen', text: 'Personen, Uhrzeit, Stimmung und Einschränkungen.' },
          { year: '2', title: 'Menü vorschlagen', text: 'Wir schicken einen konkreten Vorschlag mit Preisrahmen.' },
          { year: '3', title: 'Details klären', text: 'Allergien, Weine, Sitzordnung, Ankunft.' },
          { year: '4', title: 'Abend führen', text: 'Service und Küche halten den Ablauf zusammen.' },
        ] }, styleOverrides: warmLightTokens },
        { type: 'collectionList', data: { headline: 'Events im Detail', collectionKey: 'events', columns: 3, showImage: true, showExcerpt: true, showDate: false, showSortControls: false } },
        sectionCta('Einen Abend planen?', 'Schreiben Sie uns Anlass, Personenanzahl und Wunschdatum. Wir antworten mit einem konkreten Vorschlag.', 'Event anfragen', '/kontakt'),
      ],
    },

    {
      slug: 'ueber-uns',
      title: 'Über uns',
      seo: {
        metaTitle: 'Über Trattoria Dal Maestro',
        metaDescription: 'Lernen Sie das Team und die Geschichte der Trattoria Dal Maestro in München-Haidhausen kennen.',
      },
      sections: [
        sectionCollectionHero('Eine Trattoria ist kein Konzept. Sie ist ein Verhältnis.', 'Zur Küche, zum Raum, zu Gästen und zu dem, was man wiedererkennt.', '1517248135467-4c7edcad34c4', 'Über uns'),
        { type: 'textImage', data: { badge: 'Paolo & Elena', headline: 'Wir mögen Abende, die nicht aufgesetzt wirken.', text: '<p>Paolo Ferraro kocht so, wie er in Bologna gelernt hat: genau, handwerklich und ohne Angst vor Einfachheit. Elena Gruber führt den Gastraum mit einer Ruhe, die man erst merkt, wenn sie fehlt.</p><p>Dal Maestro ist unser Versuch, München jeden Abend ein kleines Stück Italien zu geben - nicht als Kulisse, sondern als Haltung.</p>', image: img('1585151314251-3627f2d87e34'), imageAlt: 'Küche und Service der Trattoria Dal Maestro', layout: 'image-left', items: [
          { icon: 'ChefHat', title: 'Paolo kocht', text: 'Pasta, Saucen, Timing.' },
          { icon: 'Wine', title: 'Elena führt', text: 'Wein, Raum, Gäste.' },
          { icon: 'MapPin', title: 'Haidhausen bleibt', text: 'Ein Restaurant für die Nachbarschaft.' },
          { icon: 'Heart', title: 'Wiederkommen zählt', text: 'Stammgäste sind kein Zufall.' },
        ], primaryCta: { label: 'Tisch anfragen', href: '/reservierung', icon: 'CalendarCheck' } } },
        { type: 'timeline', data: { badge: 'Geschichte', headline: 'Vom kleinen Pasta-Tresen zur Trattoria.', subline: 'Gewachsen ist nicht die Show, sondern die Sorgfalt.', entries: [
          { year: '2008', title: 'Erster Abend', text: 'Zwölf Plätze, drei Gerichte, keine Website.' },
          { year: '2012', title: 'Elena kommt dazu', text: 'Der Gastraum bekommt Struktur und Wärme.' },
          { year: '2017', title: 'Umbau mit offener Küche', text: 'Mehr Sichtbarkeit, mehr Ruhe im Service.' },
          { year: '2024', title: 'Weinabende', text: 'Monatliche Abende mit Winzern und Geschichten.' },
        ] }, styleOverrides: warmLightTokens },
        { type: 'team', data: { badgeText: 'Team', headline: 'Menschen, die lieber gut arbeiten als laut auftreten.', subline: 'Ein kleines Team mit klaren Rollen.', membersHeadline: 'Küche & Gastraum', members: [
          { name: 'Paolo Ferraro', role: 'Küchenchef & Pasta', image: img('1500648767791-00dcc994a43e', 800), bio: 'Kommt aus Bologna, kocht ruhig und probiert jede Sauce selbst.' },
          { name: 'Elena Gruber', role: 'Gastgeberin & Wein', image: img('1494790108377-be9c29b29330', 800), bio: 'Führt Reservierung, Gastraum und Weinempfehlungen mit Überblick.' },
          { name: 'Luca Marino', role: 'Souschef', image: img('1507003211169-0a1dd7228f2d', 800), bio: 'Hält Vorbereitung, Pranzo und Dolci sauber zusammen.' },
          { name: 'Mara Seidl', role: 'Service', image: img('1544005313-94ddf0286df2', 800), bio: 'Merkt sich Lieblingsplätze und wann ein Tisch lieber in Ruhe gelassen wird.' },
        ], valuesHeadline: 'Was uns wichtig ist', values: [
          { icon: 'Leaf', title: 'Saisonal einkaufen', text: 'Lieber weniger Gerichte als beliebige Zutaten.' },
          { icon: 'Clock', title: 'Timing respektieren', text: 'Gäste sollen nicht der Küche hinterherlaufen.' },
          { icon: 'Wine', title: 'Wein verständlich halten', text: 'Empfehlungen statt Belehrung.' },
          { icon: 'HeartHandshake', title: 'Nachbarschaft ernst nehmen', text: 'Ein Restaurant lebt von Wiederkehr.' },
        ], stats: [{ value: '16', label: 'Tische' }, { value: '8', label: 'Teammitglieder' }, { value: '2008', label: 'gegründet' }] } },
        { type: 'statsCounter', data: { headline: 'Klein genug für Aufmerksamkeit.', subline: 'Wir bleiben bewusst übersichtlich.', stats: [
          { value: 16, label: 'Tische' },
          { value: 8, label: 'Team' },
          { value: 4, label: 'Pastateige' },
          { value: 318, suffix: '+', label: 'Bewertungen' },
        ] }, styleOverrides: { '--token-section-bg': C.espresso, ...darkSectionTokens } },
        { type: 'testimonials', data: { badgeText: 'Stimmen', headline: 'Das Schönste ist, wenn Menschen ihren Tisch wiedererkennen.', subline: 'Ein paar Sätze, die bei uns hängen geblieben sind.', items: [
          { quote: 'Elena wusste beim zweiten Besuch noch, welchen Wein wir mochten.', name: 'Anja & Robert', context: 'Stammgäste', rating: 5 },
          { quote: 'Paolos Pasta ist präzise, aber nie bemüht.', name: 'Süddeutscher Genussblog', context: 'Journal', rating: 5 },
          { quote: 'Ein Ort, der sich nach München und Italien zugleich anfühlt.', name: 'Laura M.', context: 'Abendessen', rating: 5 },
          { quote: 'Unsere Feier war warm, klar geplant und trotzdem sehr persönlich.', name: 'Familie Berger', context: 'Private Feier', rating: 5 },
        ] } },
        sectionCta('Kommen Sie vorbei, wenn Sie gutes Essen ohne Theater mögen.', 'Wir freuen uns über Stammgäste, neue Gesichter und alle, die gerne an einem guten Tisch sitzen.', 'Tisch anfragen', '/reservierung'),
      ],
    },

    {
      slug: 'kontakt',
      title: 'Kontakt',
      seo: {
        metaTitle: 'Kontakt und Anfahrt',
        metaDescription: 'Kontakt, Adresse, Öffnungszeiten und Anfahrt der Trattoria Dal Maestro in München-Haidhausen.',
      },
      sections: [
        sectionCollectionHero('Mitten in Haidhausen. Nah an der Isar.', 'Rosenheimer Straße, kurze Wege, warme Tische.', '1514933651103-005eec06c04b', 'Kontakt'),
        { type: 'contact', data: { headline: 'Schreiben Sie uns, wenn der Abend konkret wird.', subline: 'Für Reservierungen, Gruppen, Weinabende oder kurze Fragen.', formEnabled: true, infoCards: [
          { icon: 'Phone', label: 'Telefon', value: '+49 89 45218670' },
          { icon: 'Mail', label: 'E-Mail', value: 'ciao@dalmaestro-muenchen.de' },
          { icon: 'MapPin', label: 'Adresse', value: 'Rosenheimer Straße 34, 81669 München' },
          { icon: 'Clock', label: 'Ruhetag', value: 'Montag geschlossen' },
        ] } },
        { type: 'openingHours', data: { headline: 'Öffnungszeiten', days: [
          { label: 'Montag', hours: 'geschlossen' },
          { label: 'Dienstag bis Donnerstag', hours: '17:30 - 23:00' },
          { label: 'Freitag', hours: '17:30 - 00:00' },
          { label: 'Samstag', hours: '12:00 - 15:00 / 17:30 - 00:00' },
          { label: 'Sonntag', hours: '12:00 - 21:30' },
        ] } },
        { type: 'map', data: { headline: 'Anfahrt', embedUrl: 'https://www.google.com/maps?q=Rosenheimer%20Stra%C3%9Fe%2034%2C%2081669%20M%C3%BCnchen&output=embed', height: 'm' } },
        { type: 'faq', data: { headline: 'Kontakt: häufige Fragen', items: restaurantFaq() } },
        sectionCta('Spontan? Rufen Sie lieber an.', 'Gerade für denselben Abend ist Telefon oft schneller als Formular.', 'Jetzt anrufen', 'tel:+498945218670'),
      ],
    },

    {
      slug: 'news',
      title: 'Journal',
      seo: {
        metaTitle: 'Journal - Küche, Wein und Geschichten',
        metaDescription: 'Journal der Trattoria Dal Maestro mit Notizen zu Pasta, Wein, Haidhausen und Restaurantabenden.',
      },
      sections: [
        sectionCollectionHero('Notizen aus Küche und Gastraum.', 'Kleine Texte über Pasta, Wein und die Entscheidungen hinter guten Abenden.', '1510812431401-41d2bd2722f3', 'Journal'),
        { type: 'newsGrid', data: { headline: 'Aktuelle Geschichten', subline: 'Was uns beschäftigt, bevor es auf dem Teller oder im Glas landet.', collectionKey: 'news', linkLabel: 'Alle Beiträge lesen', linkHref: '/news' } },
        { type: 'featureShowcase', data: { headline: 'Warum wir über kleine Dinge schreiben.', subline: 'Ein Restaurant besteht nicht nur aus Gerichten. Es besteht aus Entscheidungen: Wie viel Karte ist genug? Welcher Wein hilft einem Essen? Wann wird Service zu viel?', image: img('1510812431401-41d2bd2722f3'), features: [
          'Küchennotizen erklären, warum wir manches weglassen und anderes wiederholen.',
          'Weintexte beginnen beim Trinkgefühl, nicht bei Fachsprache.',
          'Haidhausen bleibt Teil der Geschichte, weil ein Stadtteil Restaurants prägt.',
          'Event-Notizen zeigen, was bei Weinabenden und Feiern wirklich funktioniert.',
        ] } },
        { type: 'collectionList', data: { headline: 'Alle Journal-Beiträge', collectionKey: 'news', columns: 3, showImage: true, showDate: true, showExcerpt: true, showSortControls: false } },
        { type: 'faq', data: { headline: 'Fragen zum Journal', items: [
          { question: 'Sind die Beiträge echte Restaurantnotizen?', answer: 'Ja. Wir schreiben über Entscheidungen, die in Küche und Gastraum wirklich eine Rolle spielen.' },
          { question: 'Kündigt ihr Events hier an?', answer: 'Ja, größere Weinabende und Workshops erscheinen zusätzlich im Journal.' },
          { question: 'Kann ich Rezepte nachkochen?', answer: 'Manchmal geben wir Ansätze weiter. Die meisten Texte erklären aber eher das Warum als genaue Grammzahlen.' },
          { question: 'Wie oft erscheinen Beiträge?', answer: 'Unregelmäßig, aber bewusst. Lieber ein guter Text als ein Pflichtbeitrag.' },
        ] } },
        sectionCta('Lieber direkt essen als lesen?', 'Dann fragen Sie einen Tisch an. Die bessere Version unserer Notizen steht ohnehin auf dem Teller.', 'Tisch anfragen', '/reservierung'),
      ],
    },

    {
      slug: 'impressum',
      title: 'Impressum',
      seo: {
        metaTitle: 'Impressum',
        metaDescription: 'Impressum der Trattoria Dal Maestro in München-Haidhausen.',
      },
      sections: [
        { type: 'legalContent', data: { headline: 'Impressum', blocks: [
          { headline: 'Angaben gemäß § 5 TMG', text: '<p>Trattoria Dal Maestro GmbH<br>Rosenheimer Straße 34<br>81669 München</p>' },
          { headline: 'Vertreten durch', text: '<p>Geschäftsführer: Paolo Ferraro und Elena Gruber</p>' },
          { headline: 'Kontakt', text: '<p>Telefon: +49 89 45218670<br>E-Mail: ciao@dalmaestro-muenchen.de</p>' },
          { headline: 'Registereintrag', text: '<p>Eintragung im Handelsregister.<br>Registergericht: Amtsgericht München<br>Registernummer: HRB 248913</p>' },
          { headline: 'Umsatzsteuer-ID', text: '<p>Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz: DE321845679</p>' },
          { headline: 'Verantwortlich für den Inhalt', text: '<p>Elena Gruber, Rosenheimer Straße 34, 81669 München</p>' },
          { headline: 'Haftung für Inhalte', text: '<p>Wir erstellen die Inhalte dieser Website mit Sorgfalt. Für Richtigkeit, Vollständigkeit und Aktualität übernehmen wir keine Gewähr. Gesetzliche Verpflichtungen zur Entfernung oder Sperrung von Informationen bleiben unberührt.</p>' },
          { headline: 'Urheberrecht', text: '<p>Texte, Bilder und Gestaltung dieser Website unterliegen dem deutschen Urheberrecht. Eine Verwendung außerhalb der gesetzlichen Grenzen bedarf der schriftlichen Zustimmung.</p>' },
        ] } },
      ],
    },

    {
      slug: 'datenschutz',
      title: 'Datenschutz',
      seo: {
        metaTitle: 'Datenschutzerklärung',
        metaDescription: 'Datenschutzerklärung der Trattoria Dal Maestro München.',
      },
      sections: [
        { type: 'legalContent', data: { headline: 'Datenschutzerklärung', blocks: [
          { headline: 'Verantwortlicher', text: '<p>Trattoria Dal Maestro GmbH, Rosenheimer Straße 34, 81669 München. Kontakt: ciao@dalmaestro-muenchen.de.</p>' },
          { headline: 'Zweck der Verarbeitung', text: '<p>Wir verarbeiten personenbezogene Daten, wenn Sie uns kontaktieren, eine Reservierung anfragen oder unsere Website nutzen. Dazu zählen insbesondere Name, E-Mail-Adresse, Telefonnummer, Nachricht und technische Zugriffsdaten.</p>' },
          { headline: 'Kontaktformular und Reservierungsanfragen', text: '<p>Daten aus Formularen verwenden wir ausschließlich zur Bearbeitung Ihrer Anfrage, zur Reservierungsabstimmung und zur notwendigen Rückkommunikation. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO bzw. Art. 6 Abs. 1 lit. f DSGVO.</p>' },
          { headline: 'Hosting', text: '<p>Die Website wird bei einem technischen Dienstleister innerhalb der EU bzw. unter Einhaltung geeigneter Datenschutzgarantien betrieben. Serverzugriffe können protokolliert werden, um Sicherheit und Stabilität zu gewährleisten.</p>' },
          { headline: 'Cookies und externe Inhalte', text: '<p>Für Komfortfunktionen, Karten oder eingebettete Inhalte können Cookies oder externe Dienste eingesetzt werden. Soweit erforderlich, erfolgt dies nur mit Ihrer Einwilligung.</p>' },
          { headline: 'Google Maps', text: '<p>Auf der Kontaktseite kann Google Maps eingebunden sein. Beim Aufruf der Karte können Daten an Google übertragen werden. Details finden Sie in den Datenschutzhinweisen von Google.</p>' },
          { headline: 'Speicherdauer', text: '<p>Anfragedaten werden nur so lange gespeichert, wie es für Bearbeitung, gesetzliche Aufbewahrungspflichten oder berechtigte Interessen erforderlich ist.</p>' },
          { headline: 'Ihre Rechte', text: '<p>Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Beschwerde bei einer Aufsichtsbehörde. Außerdem können Sie einer Verarbeitung widersprechen, soweit die gesetzlichen Voraussetzungen vorliegen.</p>' },
        ] } },
      ],
    },
  ],
};

function sectionHero({ badgeText, headline, subline, imageId, primaryLabel, primaryHref, secondaryLabel, secondaryHref, trustItems }) {
  return {
    type: 'hero',
    data: {
      badgeText,
      badgeIcon: 'Sparkles',
      headline,
      subline,
      bgImage: img(imageId),
      bgMode: 'image',
      bgPosition: 'center 48%',
      overlayColor: '#2A1712',
      overlayOpacity: 0.64,
      imageEffect: 'kenBurns',
      imageEffectIntensity: 'subtle',
      primaryCta: { label: primaryLabel, href: primaryHref, icon: 'CalendarCheck' },
      secondaryCta: { label: secondaryLabel, href: secondaryHref, icon: 'Utensils' },
      trustItems,
      trustStripColor: 'rgba(42,23,18,0.58)',
    },
    styleOverrides: heroTokens,
  };
}

function sectionCollectionHero(headline, subline, imageId, category) {
  return {
    type: 'collectionHero',
    data: {
      headline,
      subline,
      category,
      bgImage: img(imageId),
      backgroundImage: img(imageId),
      overlayColor: '#2A1712',
      overlayOpacity: 0.62,
      bgPosition: 'center 48%',
      imageEffect: 'kenBurns',
      imageEffectIntensity: 'subtle',
    },
    styleOverrides: heroTokens,
  };
}

function sectionCta(headline, subline, label, href) {
  return {
    type: 'ctaBand',
    data: {
      badgeText: 'Direkt anfragen',
      headline,
      subline,
      ctaPrimary: { label, href, icon: 'ArrowRight' },
    },
    styleOverrides: { '--token-section-bg': C.espresso, ...darkSectionTokens },
  };
}

function offerCards() {
  return [
    { title: 'Abendkarte', text: 'Handgemachte Pasta, saisonale Gerichte und Antipasti zum Teilen.', icon: 'Utensils', href: '/c/leistungen/abendkarte', mediaType: 'icon' },
    { title: 'Pranzo am Samstag', text: 'Leichte Mittagskarte, Espresso, Dolci und Zeit zwischen Markt und Isar.', icon: 'Sun', href: '/c/leistungen/pranzo-samstag', mediaType: 'icon' },
    { title: 'Weinabende', text: 'Vier Gänge, fünf Weine und Geschichten ohne steifen Vortrag.', icon: 'Wine', href: '/c/leistungen/weinabende', mediaType: 'icon' },
    { title: 'Private Feiern', text: 'Geburtstage, Teamabende und Familienessen bis 34 Personen.', icon: 'PartyPopper', href: '/c/leistungen/private-feiern', mediaType: 'icon' },
  ];
}

function menuData(headline, subline) {
  return {
    badgeText: 'Speisekarte',
    headline,
    subline,
    introText: 'Die Karte wechselt nach Saison. Diese Auswahl zeigt die Richtung.',
    footnote: 'Allergene nennen wir am Tisch transparent. Vegetarische Alternativen sind immer möglich.',
    ctaPrimary: { label: 'Tisch anfragen', href: '/reservierung' },
    categories: [
      {
        title: 'Antipasti',
        description: 'Kleine Teller zum Teilen oder als ruhiger Start.',
        items: [
          { name: 'Burrata, Feige, Haselnuss', description: 'Cremige Burrata mit gebackener Feige und gerösteter Haselnuss.', price: '15 €', tags: ['vegetarisch'], vegetarian: true, highlighted: true },
          { name: 'Vitello tonnato', description: 'Kalbfleisch, Thunfischcreme, Kapern und Zitrone.', price: '16 €' },
          { name: 'Caponata', description: 'Aubergine, Tomate, Sellerie, Pinienkerne und Basilikum.', price: '13 €', tags: ['vegan'], vegan: true },
        ],
      },
      {
        title: 'Pasta',
        description: 'Täglich im Haus gemacht.',
        items: [
          { name: 'Tajarin al Limone', description: 'Eiernudeln, Zitrone, Butter, Parmesan und Pfeffer.', price: '18 €', highlighted: true, vegetarian: true },
          { name: 'Ravioli di Zucca', description: 'Kürbisfüllung, Salbei, braune Butter und Amaretti.', price: '19 €', vegetarian: true },
          { name: 'Pappardelle al Ragù', description: 'Langsam geschmortes Rind, Tomate und Rotwein.', price: '21 €' },
          { name: 'Spaghetti alle Vongole', description: 'Venusmuscheln, Weißwein, Petersilie und Knoblauch.', price: '23 €' },
        ],
      },
      {
        title: 'Dolci',
        description: 'Klassisch, nicht kompliziert.',
        items: [
          { name: 'Tiramisu classico', description: 'Mascarpone, Espresso, Kakao.', price: '9 €', vegetarian: true },
          { name: 'Panna cotta', description: 'Vanille, Beeren, Olivenöl-Crumble.', price: '8 €', vegetarian: true },
          { name: 'Affogato', description: 'Espresso auf Vanilleeis.', price: '6 €', vegetarian: true },
        ],
      },
    ],
  };
}

function eventsData(headline) {
  return {
    badgeText: 'Events',
    headline,
    subline: 'Ein paar Formate, bei denen Essen, Wein und Gespräch genug Platz bekommen.',
    fallbackText: 'Neue Termine veröffentlichen wir im Journal und auf Instagram.',
    events: [
      { title: 'Piemont-Abend', description: 'Vier Gänge, Barolo, Tajarin und Haselnuss. Ein ruhiger Abend mit Elena und passenden Weinen.', image: img('1510812431401-41d2bd2722f3'), dateLabel: 'jeden ersten Donnerstag', timeLabel: '19:00', priceLabel: '89 € p.P.', cta: { label: 'Anfragen', href: '/c/events/piemont-abend' } },
      { title: 'Pasta-Workshop', description: 'Ravioli und Tagliatelle selbst machen, danach gemeinsam essen.', image: img('1498579150354-977475b7ea0b'), dateLabel: 'samstags auf Anfrage', timeLabel: '15:00', priceLabel: 'ab 72 € p.P.', cta: { label: 'Workshop ansehen', href: '/c/events/pasta-workshop' } },
      { title: 'Familienmittag', description: 'Sonntagmittag mit langen Tischen, einfachen Gerichten und entspanntem Service.', image: img('1551218808-94e220e084d2'), dateLabel: 'sonntags', timeLabel: '12:00', priceLabel: 'à la carte', cta: { label: 'Tisch anfragen', href: '/c/events/familienmittag' } },
    ],
  };
}

function restaurantFaq() {
  return [
    { question: 'Kann ich online direkt buchen?', answer: 'Aktuell senden Sie eine Anfrage. Wir bestätigen persönlich, damit Tisch, Uhrzeit und Anlass wirklich passen.' },
    { question: 'Gibt es vegetarische Gerichte?', answer: 'Ja. Auf der Karte stehen immer mehrere vegetarische Optionen, vegane Gerichte klären wir gerne vorab.' },
    { question: 'Sind Hunde erlaubt?', answer: 'Ruhige Hunde sind willkommen. Bitte erwähnen Sie es bei der Reservierung, damit wir einen passenden Tisch wählen.' },
    { question: 'Kann man bei euch feiern?', answer: 'Ja, private Feiern sind bis 34 Personen möglich. Wir planen Menü, Ablauf und Weinempfehlung vorab.' },
  ];
}

function buildOfferItem({ slug, title, excerpt, imageId, intro, facts }) {
  return {
    title,
    slug,
    data: {
      excerpt,
      sections: [
        { id: uuid(), ...sectionCollectionHero(title, excerpt, imageId, 'Angebot') },
        { id: uuid(), type: 'textImage', data: { badge: 'Im Detail', headline: `${title}: bewusst geplant, nicht überladen.`, text: `<p>${intro}</p>`, image: img(imageId), imageAlt: title, layout: 'image-right', items: [
          { icon: 'CheckCircle', title: 'Klarer Ablauf', text: 'Wir sagen vorher, was möglich ist.' },
          { icon: 'ChefHat', title: 'Küche mit Fokus', text: 'Weniger Auswahl, bessere Ausführung.' },
          { icon: 'Wine', title: 'Wein auf Wunsch', text: 'Empfehlung passend zum Abend.' },
          { icon: 'HeartHandshake', title: 'Persönlich', text: 'Keine anonyme Abwicklung.' },
        ], primaryCta: { label: 'Anfrage senden', href: '/reservierung', icon: 'CalendarCheck' } } },
        { id: uuid(), type: 'stats', data: { headline: 'Kurz zusammengefasst', stats: facts.map((f) => ({ icon: 'Sparkles', value: f.value, label: f.label })) } },
        { id: uuid(), type: 'featureShowcase', data: { headline: 'Warum Gäste dieses Format wählen.', subline: 'Weil es Orientierung gibt, ohne den Abend festzunageln.', image: img('1517248135467-4c7edcad34c4'), features: [
          'Wir fragen vorher nach Anlass, Zeit und Erwartungen.',
          'Küche und Service wissen, was ansteht.',
          'Das Timing bleibt ruhig, ohne Gefühl von Durchschleusen.',
          'Es bleibt genug Raum für Gespräch, Wein und einen guten Schluss.',
        ], ctaLabel: 'Tisch anfragen', ctaHref: '/reservierung' } },
        { id: uuid(), ...sectionCta(`${title} anfragen?`, 'Schreiben Sie uns Datum, Personenanzahl und Wünsche. Wir antworten persönlich.', 'Anfrage senden', '/reservierung') },
      ],
    },
  };
}

function buildEventItem({ slug, title, excerpt, imageId, dateLabel }) {
  return {
    title,
    slug,
    data: {
      excerpt,
      sections: [
        { id: uuid(), ...sectionCollectionHero(title, excerpt, imageId, 'Event') },
        { id: uuid(), type: 'textImage', data: { badge: dateLabel, headline: 'Ein Abend mit genug Struktur für Leichtigkeit.', text: `<p>${excerpt}</p><p>Wir planen die Gänge, Weine und Zeiten vorab. Am Abend selbst darf es sich trotzdem nach Restaurant anfühlen - nicht nach Veranstaltung.</p>`, image: img(imageId), imageAlt: title, layout: 'image-left', items: [
          { icon: 'CalendarHeart', title: 'Termin', text: dateLabel },
          { icon: 'Users', title: 'Gruppengröße', text: 'klein genug für Gespräch' },
          { icon: 'Wine', title: 'Wein', text: 'auf Wunsch begleitet' },
          { icon: 'MessageCircle', title: 'Anfrage', text: 'persönlich bestätigt' },
        ], primaryCta: { label: 'Event anfragen', href: '/kontakt', icon: 'ArrowRight' } } },
        { id: uuid(), type: 'timeline', data: { badge: 'Ablauf', headline: 'So läuft der Abend.', entries: [
          { year: '18:30', title: 'Ankommen', text: 'Aperitivo und kurze Begrüßung.' },
          { year: '19:00', title: 'Erster Gang', text: 'Küche startet ruhig, Service erklärt nur so viel wie nötig.' },
          { year: '20:30', title: 'Hauptgang', text: 'Zeit am Tisch statt Programmstress.' },
          { year: '22:00', title: 'Dolce', text: 'Espresso, Digestivo und kein harter Schnitt.' },
        ] }, styleOverrides: warmLightTokens },
        { id: uuid(), ...sectionCta(`${title} vormerken?`, 'Schreiben Sie uns kurz, mit wie vielen Personen Sie kommen möchten.', 'Anfrage senden', '/kontakt') },
      ],
    },
  };
}

function buildNewsItem({ slug, title, excerpt, imageId, body }) {
  return {
    title,
    slug,
    data: {
      excerpt,
      sections: [
        { id: uuid(), ...sectionCollectionHero(title, excerpt, imageId, 'Journal') },
        { id: uuid(), type: 'freeText', data: { content: body } },
        { id: uuid(), type: 'featureShowcase', data: { headline: 'Aus Küche und Gastraum gedacht.', subline: 'Unsere Journal-Beiträge sollen erklären, wie wir arbeiten - nicht nur schöne Wörter aneinanderreihen.', image: img(imageId), features: [
          'Einordnung: was hinter einer Entscheidung steckt.',
          'Handwerk: wie Küche und Vorbereitung zusammenhängen.',
          'Genuss: warum manche Dinge einfacher bleiben dürfen.',
          'Gastgefühl: was am Tisch wirklich zählt.',
        ] } },
        { id: uuid(), ...sectionCta('Fragen zum Thema?', 'Am besten bei einem Teller Pasta. Oder kurz per Nachricht.', 'Tisch anfragen', '/reservierung') },
      ],
    },
  };
}

if (require.main === module) {
  run(tenant).catch((e) => { console.error('FATAL:', e); process.exit(1); });
}

module.exports = tenant;
