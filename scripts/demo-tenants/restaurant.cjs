/**
 * Demo tenant: RESTAURANT
 *
 * Identität: "Salzkorn" — ein saisonales, marktnahes Restaurant in
 * Hamburg-Eppendorf. Kleine Karte, ehrlicher Wein, warmer Service. Kein
 * Sterne-Theater, sondern gute Produkte, sauber gekocht, ruhig serviert.
 *
 * Brand:
 * - Stadt: Hamburg-Eppendorf, Lehmweg
 * - Story: Küchenchef Jonas Brandt kam aus der Sternegastronomie und wollte es
 *   wieder entspannter. Gastgeberin Mira Halász führt den Raum. Gekocht wird,
 *   was der Markt und die norddeutsche Saison hergeben.
 * - Tonalität: warm, direkt, unangestrengt, ohne Marketing-Floskeln.
 * - Farben: Moosgrün, Amber, Creme, Ton. Classic style only.
 *
 * Run:  PAT_RESTAURANT=flm_pat_… node scripts/demo-tenants/run-all.cjs restaurant
 */

const crypto = require('crypto');
const { run } = require('./_lib/runner.cjs');
const { darkTokens } = require('./_lib/theme.cjs');

const PAT = 'set-via-PAT_RESTAURANT-env';

const uuid = () => crypto.randomUUID();
const img = (id, w = 1920) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=82`;

const C = {
  moss: '#26342B',   // tiefes Moosgrün — primary
  ink: '#18211B',
  amber: '#C98A2B',  // warmer Amber — accent
  clay: '#A65A3C',
  cream: '#F6F1E7',
  paper: '#FBF8F1',
  sage: '#6B7A66',
  gold: '#D7A552',
};

const darkSectionTokens = {
  ...darkTokens({ accent: '#E6BD6E', btnBg: C.cream, btnText: C.moss }),
  '--token-heading': '#FFFFFF',
  '--token-subheading': 'rgba(255,255,255,0.9)',
  '--token-body': 'rgba(255,255,255,0.9)',
  '--token-muted': 'rgba(255,255,255,0.68)',
  '--token-eyebrow': '#E6BD6E',
  '--token-stat-value': '#E6BD6E',
  '--token-quote': '#FFFFFF',
  '--token-icon': '#E6BD6E',
  '--token-rating-star': '#E6BD6E',
  '--token-check': '#E6BD6E',
  '--token-on-dark-heading': '#FFFFFF',
  '--token-on-dark-body': 'rgba(255,255,255,0.9)',
  '--token-on-dark-muted': 'rgba(255,255,255,0.68)',
  '--token-btn-bg': C.cream,
  '--token-btn-text': C.moss,
  '--token-badge-bg': 'rgba(255,255,255,0.15)',
  '--token-badge-text': '#FFFFFF',
  '--token-badge-border': 'rgba(255,255,255,0.28)',
  '--token-card-bg': 'rgba(24,33,27,0.72)',
  '--token-card-border': 'rgba(255,255,255,0.24)',
  '--token-card-heading': '#FFFFFF',
  '--token-card-body': 'rgba(255,255,255,0.9)',
};

const heroTokens = {
  ...darkSectionTokens,
  '--token-btn-bg': C.paper,
  '--token-btn-text': C.moss,
  '--token-badge-bg': 'rgba(255,255,255,0.9)',
  '--token-badge-text': C.moss,
  '--token-badge-border': 'rgba(255,255,255,0.42)',
};

const warmLightTokens = {
  '--token-section-bg': C.cream,
  '--token-heading': C.moss,
  '--token-subheading': C.clay,
  '--token-body': '#39433A',
  '--token-muted': '#6C7A6B',
  '--token-icon': C.amber,
  '--token-eyebrow': C.clay,
  '--token-btn-bg': C.moss,
  '--token-btn-text': '#FFFFFF',
  '--token-badge-bg': '#EADFC8',
  '--token-badge-text': C.moss,
  '--token-badge-border': '#DDCBA6',
};

const tenant = {
  slug: 'restaurant',
  pat: PAT,
  wipe: true,
  publish: true,

  style: { style: 'classic' },

  brand: {
    companyName: 'Salzkorn',
    tagline: 'Saisonale Küche, ehrlicher Wein und Abende mit Ruhe — Hamburg-Eppendorf',
    primaryColor: C.moss,
    secondaryColor: C.clay,
    accentColor: C.amber,
    logoDisplay: 'name',
    headingFont: 'Fraunces',
    bodyFont: 'Inter',
    topBarColor: C.moss,
    footerColor: '#141B16',
  },

  contact: {
    phone: '+49 40 47112380',
    email: 'hallo@salzkorn-hamburg.de',
    address: 'Lehmweg 18, 20251 Hamburg',
    whatsapp: '+49 152 47112380',
    whatsappEnabled: true,
    whatsappColor: '#25D366',
  },

  openingHours: {
    hours: [
      { type: 'regular', day: 'Montag',     closed: true, note: 'Ruhetag' },
      { type: 'regular', day: 'Dienstag',   hours: '18:00 – 23:00' },
      { type: 'regular', day: 'Mittwoch',   hours: '18:00 – 23:00' },
      { type: 'regular', day: 'Donnerstag', hours: '18:00 – 23:00' },
      { type: 'regular', day: 'Freitag',    hours: '18:00 – 00:00' },
      { type: 'regular', day: 'Samstag',    hours: '12:00 – 15:00 · 18:00 – 00:00' },
      { type: 'regular', day: 'Sonntag',    hours: '12:00 – 21:00' },
    ],
  },

  formFields: {
    fields: [
      { name: 'firstName', label: 'Vorname',  type: 'text', required: true, halfWidth: true },
      { name: 'lastName',  label: 'Nachname', type: 'text', required: true, halfWidth: true },
      { name: 'email',     label: 'E-Mail',   type: 'email',required: true, halfWidth: true },
      { name: 'phone',     label: 'Telefon',  type: 'tel',  required: false,halfWidth: true },
      { name: 'guests',    label: 'Personen', type: 'select', required: true, options: ['1–2', '3–4', '5–6', '7–10', '11+'] },
      { name: 'message',   label: 'Datum, Uhrzeit & Wünsche', type: 'textarea', required: true,
        placeholder: 'z. B. „Samstag 19:30, 4 Personen, ein ruhiger Tisch, eine Glutenunverträglichkeit" — wir bestätigen persönlich.' },
    ],
  },

  seoGlobal: {
    titleTemplate: '%s | Salzkorn Hamburg',
    defaultTitle: 'Salzkorn — saisonales Restaurant in Hamburg-Eppendorf',
    defaultDescription:
      'Salzkorn ist ein saisonales, marktnahes Restaurant in Hamburg-Eppendorf. Kleine Karte, ehrlicher Wein, warmer Service — und Abende, die Zeit lassen.',
    defaultOgImage: img('1517248135467-4c7edcad34c4', 1200),
    locale: 'de_DE',
  },

  navigation: {
    items: [
      { label: 'Startseite',  href: '/' },
      { label: 'Speisekarte', href: '/leistungen' },
      { label: 'Reservieren', href: '/reservierung' },
      { label: 'Events',      href: '/events' },
      { label: 'Über uns',    href: '/ueber-uns' },
      { label: 'Journal',     href: '/news' },
      { label: 'Kontakt',     href: '/kontakt' },
    ],
    cta: { label: 'Tisch anfragen', href: '/reservierung' },
  },

  footer: {
    columns: [
      { title: 'Salzkorn', items: [
        { text: 'Speisekarte', href: '/leistungen' },
        { text: 'Reservieren', href: '/reservierung' },
        { text: 'Events',      href: '/events' },
        { text: 'Über uns',    href: '/ueber-uns' },
      ]},
      { title: 'Formate', items: [
        { text: 'Abendkarte',    href: '/c/leistungen/abendkarte' },
        { text: 'Samstags-Lunch',href: '/c/leistungen/samstags-lunch' },
        { text: 'Weinabende',    href: '/c/leistungen/weinabende' },
        { text: 'Private Feiern',href: '/c/leistungen/private-feiern' },
      ]},
      { title: 'Kontakt', items: [
        { text: 'Tisch anfragen', href: '/reservierung' },
        { text: 'Anrufen',        href: 'tel:+494047112380' },
        { text: 'WhatsApp',       href: 'https://wa.me/4915247112380' },
      ]},
    ],
    legalLinks: [
      { label: 'Impressum',   href: '/impressum' },
      { label: 'Datenschutz', href: '/datenschutz' },
    ],
    cta: { label: 'Tisch anfragen', href: '/reservierung' },
  },

  collections: [
    {
      key: 'leistungen', label: 'Angebote',
      items: [
        buildOfferItem({ slug: 'abendkarte', title: 'Abendkarte', excerpt: 'Kleine, saisonale Karte mit Tellern zum Teilen, zwei bis drei Hauptgängen und Süßem — jeden Abend Di–Sa.', imageId: '1514933651103-005eec06c04b',
          intro: 'Unsere Abendkarte ist bewusst klein: ein paar Vorspeisen zum Teilen, zwei bis drei Hauptgänge, zwei Süße. Was wir frisch bekommen, kommt drauf — was nicht überzeugt, fliegt raus. So bleibt jede Bestellung gut.',
          facts: [{ value: '6–8', label: 'Gerichte täglich' }, { value: 'à la carte', label: 'Format' }, { value: 'Di–Sa', label: 'abends' }] }),
        buildOfferItem({ slug: 'samstags-lunch', title: 'Samstags-Lunch', excerpt: 'Ein leichter Mittagstisch am Samstag — kurze Karte, ein Glas Wein und Zeit zwischen Isemarkt und Nachmittag.', imageId: '1551218808-94e220e084d2',
          intro: 'Samstags öffnen wir mittags. Eine kurze Karte, ein Tagesgericht, ein Glas Wein oder Hausgemachtes ohne Alkohol. Ideal nach dem Isemarkt — ohne dass der Nachmittag verplant ist.',
          facts: [{ value: '12–15 Uhr', label: 'Samstag' }, { value: '2–3 Gänge', label: 'leicht' }, { value: 'Markt', label: 'um die Ecke' }] }),
        buildOfferItem({ slug: 'weinabende', title: 'Weinabende', excerpt: 'Einmal im Monat: vier Gänge, fünf Weine und Geschichten zur Herkunft — ohne steifen Vortrag.', imageId: '1510812431401-41d2bd2722f3',
          intro: 'An einem Abend im Monat wird Salzkorn zum langen Tisch. Vier Gänge, fünf Weine, eine Winzerin oder ein Importeur erzählt — verständlich, nicht akademisch. Man lernt etwas, ohne belehrt zu werden.',
          facts: [{ value: '4 Gänge', label: 'Menü' }, { value: '5 Weine', label: 'begleitet' }, { value: '22', label: 'Plätze' }] }),
        buildOfferItem({ slug: 'private-feiern', title: 'Private Feiern', excerpt: 'Geburtstage, Teamabende und Familienessen bis 30 Personen — Menü, Zeiten und Wein vorab geklärt.', imageId: '1552566626-52f8b828add9',
          intro: 'Für Feiern legen wir vorher fest, was den Abend leicht macht: ein Menü statt großer Auswahl, klare Zeiten, eine Weinbegleitung auf Wunsch. So muss am Abend niemand organisieren — auch Sie nicht.',
          facts: [{ value: 'bis 30', label: 'Personen' }, { value: '3–4 Gänge', label: 'Menü' }, { value: 'auf Wunsch', label: 'Weinbegleitung' }] }),
      ],
    },
    {
      key: 'events', label: 'Events',
      items: [
        buildEventItem({ slug: 'wein-loire', title: 'Weinabend: Loire', excerpt: 'Vier Gänge zu fünf Weinen von der Loire — Chenin, Cabernet Franc und ein Gast, der die Winzer kennt.', imageId: '1510812431401-41d2bd2722f3', dateLabel: 'erster Donnerstag im Monat' }),
        buildEventItem({ slug: 'pasta-werkstatt', title: 'Teig-Werkstatt', excerpt: 'Frische Pasta und Brot selbst machen, danach gemeinsam essen — ein Nachmittag in der Küche.', imageId: '1498579150354-977475b7ea0b', dateLabel: 'samstags auf Anfrage' }),
        buildEventItem({ slug: 'sonntagstafel', title: 'Sonntagstafel', excerpt: 'Lange Tische, ein einfaches Gericht für alle und entspannter Service — der Sonntag als Ritual.', imageId: '1551218808-94e220e084d2', dateLabel: 'jeden Sonntag' }),
      ],
    },
    {
      key: 'news', label: 'Journal',
      items: [
        buildNewsItem({ slug: 'kleine-karte-warum', title: 'Warum unsere Karte so klein ist', excerpt: 'Sechs Gerichte statt sechzig — was nach Verzicht klingt, ist die Voraussetzung für gutes Essen.', imageId: '1514933651103-005eec06c04b',
          body: '<p>Eine große Karte verspricht Auswahl und liefert Tiefkühltruhe. Wer dreißig Gerichte „kann", kann selten eins davon richtig. Wir haben uns früh entschieden, klein zu bleiben: sechs bis acht Gerichte, die wir täglich frisch vorbereiten, sauber abschmecken und am Abend wirklich gut servieren können.</p><p>Das bedeutet auch: Wenn der Fisch am Markt nicht überzeugt, steht abends kein Fisch auf der Karte. Das verlangt Vertrauen — von uns ins Produkt und von Ihnen in uns. Wir glauben, es schmeckt man.</p>' }),
        buildNewsItem({ slug: 'wein-ohne-vortrag', title: 'Wein darf einfach sein', excerpt: 'Herkunft in Trinkgefühl übersetzen — wie wir über Wein reden, ohne dass es anstrengend wird.', imageId: '1510812431401-41d2bd2722f3',
          body: '<p>Wein kann einschüchtern. Muss er aber nicht. Bei uns übersetzen wir Herkunft in etwas Greifbares: Was passt zu Ihrem Gericht, was zu Ihrer Stimmung, was zu Ihrem Budget. Wir empfehlen offen — und wenn Ihnen ein Glas nicht schmeckt, tauschen wir es.</p><p>Auf unserer Karte stehen kleine Weingüter, oft biologisch, fast immer mit Geschichte. Aber die Geschichte erzählen wir nur, wenn Sie danach fragen. Sonst gilt: einschenken und genießen.</p>' }),
        buildNewsItem({ slug: 'team-gesucht', title: 'Wir suchen Service mit Haltung', excerpt: 'Zwei Stellen im Gastraum — für Menschen, die gerne Gastgeber:in sind, nicht nur Teller tragen.', imageId: '1544005313-94ddf0286df2',
          body: '<p>Salzkorn wächst vorsichtig. Wir suchen zwei Menschen für den Gastraum, die Lust haben, wirklich Gastgeber:in zu sein: aufmerksam, ruhig, mit Sinn für Timing und Gespräch. Erfahrung ist schön, Haltung ist wichtiger.</p><p>Geregelte Zeiten, fairer Lohn, Trinkgeld geteilt, Montag und Dienstagmittag frei. Bewerbungen gerne formlos per E-Mail an Mira — ein Probeabend zum Reinschnuppern ist jederzeit möglich.</p>' }),
      ],
    },
  ],

  pages: [
    // ── Startseite ────────────────────────────────────────────────────────────
    {
      slug: 'startseite', title: 'Startseite',
      seo: {
        metaTitle: 'Salzkorn — saisonales Restaurant in Hamburg-Eppendorf',
        metaDescription: 'Kleine, saisonale Karte, ehrlicher Wein und warmer Service in Hamburg-Eppendorf. Reservieren Sie einen Tisch bei Salzkorn.',
      },
      sections: [
        {
          type: 'hero',
          data: {
            badgeText: 'Eppendorf · seit 2016',
            badgeIcon: 'Utensils',
            headline: 'Kleine Karte. Gute Produkte. Abende mit Zeit.',
            subline: 'Salzkorn ist ein saisonales Restaurant am Lehmweg. Wir kochen, was der Markt hergibt, schenken Wein mit Herkunft aus und nehmen uns Zeit für Ihren Abend.',
            bgImage: img('1517248135467-4c7edcad34c4'),
            bgMode: 'image',
            overlayColor: C.moss,
            overlayOpacity: 0.62,
            imageEffect: 'kenBurns',
            primaryCta:   { label: 'Tisch reservieren', href: '/reservierung', icon: 'CalendarCheck' },
            secondaryCta: { label: 'Speisekarte ansehen', href: '/leistungen', icon: 'ArrowRight' },
            trustItems: [
              'Saisonal & marktnah gekocht',
              'Kleine Karte, täglich frisch',
              '4,8 / 5 bei Google (291 Bewertungen)',
            ],
            trustStripColor: 'rgba(20,27,22,0.55)',
          },
        },
        {
          type: 'socialProofBar',
          data: {
            bgStyle: 'light',
            items: [
              { icon: 'Star',      value: '4,8 / 5', label: '291 Bewertungen bei Google' },
              { icon: 'Leaf',      value: 'Saison',  label: 'Karte wechselt mit dem Markt' },
              { icon: 'Wine',      value: '40+',     label: 'Weine, meist von kleinen Gütern' },
              { icon: 'Clock',     value: 'seit 2016',label: 'am Lehmweg in Eppendorf' },
              { icon: 'Users',     value: '14',      label: 'Tische, ein voller Gastraum' },
            ],
          },
        },
        {
          type: 'servicesGrid',
          data: {
            badgeText: 'Formate',
            headline: 'Vier Wege, bei uns einen Abend zu verbringen',
            subline: 'Bewusst übersichtlich — und genau deshalb gut planbar.',
            ctaLabel: 'Alle Angebote ansehen', ctaHref: '/leistungen',
            manualCards: offerCards(),
          },
        },
        { type: 'menu', data: menuData('Ein Blick auf die Karte', 'Ein Auszug — die echte Karte bewegt sich mit der Saison.', 'Karte & Tisch entdecken') },
        {
          type: 'signatureDishes',
          data: {
            headline: 'Gerichte, wegen denen Gäste wiederkommen',
            dishes: [
              { name: 'Sellerie vom Holz', description: 'Im Ganzen gegart, Haselnuss, braune Butter, Apfel.', image: img('1504674900247-0877df9cc836', 900), price: '17 €' },
              { name: 'Hausgemachte Pasta', description: 'Was gerade Saison hat — Steinpilz, Kürbis oder Tomate vom Markt.', image: img('1473093295043-cdd812d0e601', 900), price: '19 €' },
              { name: 'Dry-Aged Rind', description: 'Vom Weiderind, rosa gebraten, Schmorzwiebel, Kresse.', image: img('1558030006-450675393462', 900), price: '34 €' },
            ],
          },
        },
        {
          type: 'featureShowcase',
          data: {
            headline: 'Kleine Karte, große Aufmerksamkeit',
            subline: 'Wir kochen nicht alles. Wir kochen das, was wir frisch einkaufen, sauber vorbereiten und am Abend wirklich gut servieren können.',
            image: img('1498579150354-977475b7ea0b'),
            features: [
              'Pasta, Saucen und Brot entstehen täglich in der Küche.',
              'Was der Markt nicht hergibt, kommt nicht auf die Karte.',
              'Weinempfehlungen bleiben verständlich und passen zum Essen.',
              'Der Service merkt sich Vorlieben — nicht nur Reservierungsnummern.',
            ],
            ctaLabel: 'Speisekarte ansehen',
            ctaHref: '/leistungen',
          },
        },
        {
          type: 'processSteps',
          data: {
            badgeText: 'Reservieren',
            headline: 'So bleibt der Abend entspannt',
            subline: 'Wir fragen nur ab, was für einen guten Tisch wirklich hilft.',
            steps: [
              { icon: 'CalendarCheck', title: 'Termin nennen',       text: 'Datum, Uhrzeit und Personenanzahl reichen im ersten Schritt.' },
              { icon: 'Utensils',      title: 'Wünsche ergänzen',     text: 'Kinderstuhl, Allergien, Anlass oder Lieblingsplatz gerne dazu.' },
              { icon: 'MessageCircle', title: 'Rückmeldung bekommen', text: 'Wir bestätigen persönlich — meistens noch am selben Tag.' },
              { icon: 'Wine',          title: 'Ankommen',             text: 'Der Tisch steht bereit, die Küche weiß Bescheid.' },
            ],
          },
        },
        {
          type: 'bentoGrid',
          data: {
            headline: 'Was Salzkorn anders macht',
            subline: 'Nicht spektakulär um jeden Preis. Lieber verlässlich gut, jedes Mal.',
            items: [
              { title: 'Küche und Gastraum reden', text: 'Vor jedem Service stimmen sich Küche und Service ab. So bleibt Timing wichtiger als Eitelkeit.', icon: 'MessagesSquare', span: '2' },
              { title: 'Wein darf einfach sein',   text: 'Wir übersetzen Herkunft in Trinkgefühl.', icon: 'Wine' },
              { title: 'Feiern mit Ablauf',        text: 'Menü, Zeiten und Servicepunkte sind vorher klar.', icon: 'PartyPopper' },
              { title: 'Kinder sind Gäste',        text: 'Samstagmittag und sonntags gibt es Platz und Geduld.', icon: 'Baby' },
              { title: 'Saison ohne Dogma',        text: 'Norddeutsch geerdet, aber neugierig. Der Markt entscheidet mit.', icon: 'Leaf', span: '2' },
            ],
          },
        },
        {
          type: 'timeline',
          data: {
            badge: 'Geschichte',
            headline: 'Aus einer Idee wurde ein Eppendorfer Abendritual',
            subline: 'Salzkorn ist gewachsen, ohne den Raum größer zu machen.',
            entries: [
              { year: '2016', title: 'Jonas eröffnet Salzkorn',    text: 'Nach Jahren in der Sternegastronomie 14 Tische, eine offene Küche und der Wunsch nach mehr Ruhe.' },
              { year: '2018', title: 'Mira übernimmt den Gastraum', text: 'Reservierungen, Wein und Stammgäste bekommen ein Gesicht.' },
              { year: '2020', title: 'Die Karte wird kleiner',     text: 'Weniger Gerichte, bessere Vorbereitung, ruhigerer Service.' },
              { year: '2024', title: 'Weinabende starten',         text: 'Einmal im Monat wird aus dem Restaurant ein langer Tisch.' },
            ],
          },
          styleOverrides: warmLightTokens,
        },
        {
          type: 'statsCounter',
          data: {
            headline: 'Ein kleines Restaurant mit vielen Wiederholungen',
            subline: 'Unsere Zahlen sind nicht laut. Sie zeigen nur, dass Menschen gerne wiederkommen.',
            stats: [
              { value: 14, label: 'Tische' },
              { value: 7,  label: 'Gerichte auf der Karte' },
              { value: 30, label: 'Feierplätze' },
              { value: 4.8, suffix: '/5', label: 'Bewertung' },
            ],
          },
          styleOverrides: { ...darkSectionTokens, '--token-section-bg': C.moss, '--token-section-bg-alt': C.moss },
        },
        {
          type: 'comparisonTable',
          data: {
            badge: 'Für jeden Anlass',
            headline: 'Was passt zu Ihrem Abend?',
            text: 'Drei Formate, drei Stimmungen — alle mit derselben Sorgfalt.',
            columns: [{ label: 'Dinner' }, { label: 'Weinabend' }, { label: 'Feier' }],
            rows: [
              { feature: 'Personen',     values: ['2–6', '10–22', '12–30'] },
              { feature: 'Dauer',        values: ['2 Stunden', '3 Stunden', 'nach Absprache'] },
              { feature: 'Karte',        values: ['à la carte', '4 Gänge', 'Menü geplant'] },
              { feature: 'Wein',         values: ['Empfehlung', 'inklusive', 'optional'] },
              { feature: 'Vorbereitung', values: ['Reservierung', 'Anfrage', 'persönliche Planung'] },
            ],
            highlightCol: 1,
          },
        },
        {
          type: 'testimonials',
          data: {
            badgeText: 'Gästestimmen',
            headline: 'Menschen erinnern sich selten an Abläufe — aber an gute Abende',
            subline: 'Das sagen Gäste, die häufiger bei uns sitzen.',
            ratingValue: '4,8',
            ratingCount: '291 Bewertungen',
            items: [
              { quote: 'Wir kommen wegen des Essens, bleiben aber wegen der Ruhe im Raum.', name: 'K. Petersen', context: 'Stammgast aus Eppendorf', rating: 5, sourceLabel: 'Google' },
              { quote: 'Unsere Familienfeier war unkompliziert geplant und am Abend genau richtig geführt.', name: 'Claudia S.', context: 'Geburtstagsessen', rating: 5, sourceLabel: 'Google' },
              { quote: 'Kleine Karte, dafür jedes Gericht wirklich gut. Genau unser Restaurant.', name: 'Thomas K.', context: 'Abendessen', rating: 5, sourceLabel: 'Tripadvisor' },
              { quote: 'Der Weinabend war angenehm unangestrengt. Man lernt etwas, ohne belehrt zu werden.', name: 'Franziska B.', context: 'Loire-Abend', rating: 5, sourceLabel: 'Google' },
            ],
            ctaPrimary: { label: 'Wunschtermin prüfen', href: '/reservierung' },
          },
        },
        {
          type: 'faq',
          data: { headline: 'Kurz vor dem Abend gefragt', items: restaurantFaq() },
        },
        sectionCta('Einen Tisch, der zu Ihrem Abend passt?', 'Schreiben Sie uns kurz Datum, Uhrzeit und Personenanzahl. Wir melden uns persönlich zurück.', 'Reservierung starten', '/reservierung'),
      ],
    },

    // ── Speisekarte & Angebote ───────────────────────────────────────────────
    {
      slug: 'leistungen', title: 'Speisekarte & Angebote',
      seo: {
        metaTitle: 'Speisekarte, Lunch, Weinabende und Feiern',
        metaDescription: 'Speisekarte und Angebote von Salzkorn in Hamburg: Abendkarte, Samstags-Lunch, Weinabende und private Feiern.',
      },
      sections: [
        edHeroSec('Speisekarte', 'Speisekarte, aber ohne Überforderung', 'Kleine Karte, klare Herkunft, Gerichte mit genug Ruhe in der Vorbereitung.', '1514933651103-005eec06c04b', { primaryCta: { label: 'Angebot & Tisch wählen', href: '/reservierung' }, secondaryCta: { label: 'Weinabende ansehen', href: '/events' } }),
        { type: 'servicesGrid', data: { badgeText: 'Angebote', headline: 'Wählen Sie nicht aus Masse, sondern aus Haltung', subline: 'Unsere Formate sind bewusst übersichtlich — und genau deshalb gut planbar.', ctaLabel: 'Passendes Format anfragen', ctaHref: '/reservierung', manualCards: offerCards() } },
        { type: 'menu', data: menuData('Auszug aus der aktuellen Karte', 'Die genaue Karte wechselt je nach Saison, Markt und Serviceplanung.', 'Speisekarte & Platz planen') },
        { type: 'signatureDishes', data: { headline: 'Signatures aus Küche und Weinkeller', dishes: [
          { name: 'Sellerie vom Holz', description: 'Im Ganzen gegart, Haselnuss, Apfel, braune Butter.', image: img('1504674900247-0877df9cc836', 900), price: '17 €' },
          { name: 'Forelle, Buttermilch', description: 'Gebeizte Forelle, Buttermilch, Gurke, Dill.', image: img('1485921325833-c519f76c4927', 900), price: '16 €' },
          { name: 'Birne, Honig, Quark', description: 'Pochierte Birne, Thymianhonig, Quarkcreme.', image: img('1565958011703-44f9829ba187', 900), price: '9 €' },
        ] } },
        { type: 'comparisonTable', data: { badge: 'Formate', headline: 'Dinner, Lunch oder Feier?', text: 'Wenn Sie unsicher sind, fragen Sie uns. Wir sagen ehrlich, was passt.', columns: [{ label: 'Dinner' }, { label: 'Lunch' }, { label: 'Feier' }], rows: [
          { feature: 'Ideal für', values: ['Abend zu zweit', 'Samstagmittag', 'Geburtstag / Team'] },
          { feature: 'Karte',     values: ['à la carte', 'leichter Auszug', 'Menü nach Absprache'] },
          { feature: 'Personen',  values: ['2–8', '2–10', '12–30'] },
          { feature: 'Planung',   values: ['Reservierung', 'Reservierung', 'Vorgespräch'] },
        ], highlightCol: 0 } },
        { type: 'collectionList', data: { headline: 'Alle Angebote im Detail', subline: 'Mehr Kontext zu Karte, Lunch, Weinabenden und Feiern.', collectionKey: 'leistungen', columns: 4, showImage: true, showExcerpt: true, showDate: false, showSortControls: false } },
        { type: 'faq', data: { headline: 'Fragen zur Karte', items: restaurantFaq() } },
        imCtaSec('Lust auf einen Abend bei Salzkorn?', 'Reservieren Sie frühzeitig für Freitag und Samstag. Unter der Woche finden wir meistens schneller einen Tisch.', '1514933651103-005eec06c04b', 'Abend reservieren'),
      ],
    },

    // ── Reservierung ─────────────────────────────────────────────────────────
    {
      slug: 'reservierung', title: 'Reservierung',
      seo: {
        metaTitle: 'Tisch reservieren in Hamburg-Eppendorf',
        metaDescription: 'Tisch bei Salzkorn anfragen: Datum, Uhrzeit, Personenanzahl und Wünsche senden. Wir bestätigen persönlich.',
      },
      sections: [
        edHeroSec('Reservierung', 'Reservieren heißt bei uns: kurz schreiben, persönlich hören', 'Wir bestätigen nicht automatisch, sondern so, dass der Tisch wirklich passt.', '1517248135467-4c7edcad34c4', { primaryCta: { label: 'Jetzt reservieren', href: '#reservierung' }, hint: 'Freitag und Samstag früh reservieren — unter der Woche geht es meist spontan.' }),
        {
          type: 'reservation',
          anchorId: 'reservierung',
          data: {
            badgeText: 'Tischanfrage',
            headline: 'Sagen Sie uns, wann Sie kommen möchten',
            subline: 'Wir melden uns persönlich zurück — meistens noch am selben Tag.',
            introText: '<p>Bitte nennen Sie Datum, Uhrzeit, Personenanzahl und besondere Wünsche. Für Gruppen ab 8 Personen empfehlen wir ein kurzes Telefonat.</p>',
            formEnabled: true,
            submitLabel: 'Anfrage senden',
            phoneCta: { label: 'Direkt anrufen', href: 'tel:+494047112380' },
            partySizeOptions: ['1–2', '3–4', '5–6', '7–10', '11+'],
            timeHint: 'Di–Fr ab 18:00, Sa ab 12:00, So ab 12:00',
            policyText: 'Bei Verspätung über 20 Minuten bitten wir um einen kurzen Anruf.',
            image: img('1552566626-52f8b828add9'),
          },
        },
        { type: 'openingHours', data: { headline: 'Unsere Zeiten', days: [
          { label: 'Montag', hours: 'Ruhetag' },
          { label: 'Dienstag bis Donnerstag', hours: '18:00 – 23:00' },
          { label: 'Freitag', hours: '18:00 – 00:00' },
          { label: 'Samstag', hours: '12:00 – 15:00 · 18:00 – 00:00' },
          { label: 'Sonntag', hours: '12:00 – 21:00' },
        ] } },
        { type: 'featureShowcase', data: { headline: 'Damit der Tisch wirklich passt', subline: 'Manchmal ist ein Vierertisch nicht gleich ein Vierertisch. Wir achten auf Anlass, Kinderwagen, Ruhebedarf und Timing.', image: img('1517248135467-4c7edcad34c4'), features: [
          'Gruppen ab 8 Personen bekommen Menü und Timing vorab geklärt.',
          'Kinderwagen, Hochstuhl oder ruhiger Platz werden direkt mitgedacht.',
          'Allergien und Unverträglichkeiten klären wir ehrlich vor der Ankunft.',
          'Freitag und Samstag sind spätere Slots oft entspannter.',
        ], ctaLabel: 'Anfrage senden', ctaHref: '/kontakt' } },
        { type: 'events', data: eventsData('Nächste Abende mit besonderem Anlass', 'Sonntagstafel reservieren') },
        { type: 'faq', data: { headline: 'Reservierung: gut zu wissen', items: restaurantFaq() } },
        sectionCta('Lieber telefonisch klären?', 'Für größere Gruppen oder spontane Anfragen sind wir ab 15 Uhr telefonisch erreichbar.', 'Jetzt anrufen', 'tel:+494047112380'),
      ],
    },

    // ── Events ───────────────────────────────────────────────────────────────
    {
      slug: 'events', title: 'Events',
      seo: {
        metaTitle: 'Weinabende, Teig-Werkstatt und private Feiern',
        metaDescription: 'Events bei Salzkorn: Weinabende, Teig-Werkstatt, Sonntagstafel und private Feiern in Hamburg-Eppendorf.',
      },
      sections: [
        cineHeroSec('Events', 'Kleine Abende, an die man sich erinnert', 'Wein, Küche, lange Tische und Formate, die nicht nach Veranstaltungshalle klingen.', '1510812431401-41d2bd2722f3', [ { value: '30', label: 'Plätze für private Feiern' }, { value: '5', label: 'Weine pro Weinabend' }, { value: '4', label: 'Gänge' } ], 'Event-Platz sichern'),
        { type: 'events', data: eventsData('Aktuelle Termine und Formate', 'Platz für die Sonntagstafel') },
        { type: 'portfolio', data: { badgeText: 'Momente', headline: 'So sehen Abende bei uns aus', subline: 'Ein Restaurant, drei Stimmungen: Weinabend, Werkstatt und private Tafel.', projects: [
          { title: 'Weinabend Loire', category: 'Weinabend', description: 'Vier Gänge, fünf Weine, ein langer Tisch.', image: img('1510812431401-41d2bd2722f3'), href: '/c/events/wein-loire', icon: 'Wine', stats: [{ label: 'Plätze', value: '22' }, { label: 'Gänge', value: '4' }] },
          { title: 'Teig-Werkstatt', category: 'Küche', description: 'Pasta und Brot selbst machen, danach essen.', image: img('1498579150354-977475b7ea0b'), href: '/c/events/pasta-werkstatt', icon: 'ChefHat', stats: [{ label: 'Dauer', value: '3 h' }, { label: 'Gruppe', value: '8–12' }] },
          { title: 'Sonntagstafel', category: 'Sonntag', description: 'Lange Tische und entspannter Service.', image: img('1551218808-94e220e084d2'), href: '/c/events/sonntagstafel', icon: 'Heart', stats: [{ label: 'Start', value: '12 Uhr' }, { label: 'Kinder', value: 'willkommen' }] },
        ], ctaLabel: 'Event anfragen', ctaHref: '/kontakt' } },
        { type: 'bentoGrid', data: { headline: 'Events ohne Event-Gefühl', subline: 'Wir machen den Ablauf klar, damit der Abend leicht bleibt.', items: [
          { title: 'Menü statt Durcheinander', text: 'Für Gruppen planen wir drei bis vier Gänge mit genug Pausen.', icon: 'ListChecks', span: '2' },
          { title: 'Wein begleitet', text: 'Optional pro Gang, aber nie aufdringlich.', icon: 'Wine' },
          { title: 'Eine Gastgeberin', text: 'Mira hält Kontakt vor und während des Abends.', icon: 'UserCheck' },
          { title: 'Ehrliche Preise', text: 'Was vorher vereinbart ist, gilt am Ende.', icon: 'BadgeEuro' },
          { title: 'Kein Mindestumsatz-Theater', text: 'Wir sagen offen, ab wann sich ein Format für beide Seiten trägt.', icon: 'Scale', span: '2' },
        ] } },
        { type: 'faq', data: { headline: 'Fragen zu Events', items: restaurantFaq() } },
        imCtaSec('Einen besonderen Abend planen?', 'Schreiben Sie uns Anlass, Personenanzahl und Wunschtermin — wir machen einen Vorschlag.', '1510812431401-41d2bd2722f3', 'Feier besprechen'),
      ],
    },

    // ── Über uns ─────────────────────────────────────────────────────────────
    {
      slug: 'ueber-uns', title: 'Über uns',
      seo: {
        metaTitle: 'Über uns — Küche, Gastraum und Haltung',
        metaDescription: 'Salzkorn ist ein inhabergeführtes Restaurant in Hamburg-Eppendorf. Jonas Brandt in der Küche, Mira Halász im Gastraum — kleine Karte, klare Haltung.',
      },
      sections: [
        edHeroSec('Über uns', 'Zwei Menschen, ein Gastraum, eine Haltung', 'Was 2016 als ruhige Gegenbewegung zur Sternegastronomie begann, ist heute ein vertrautes Restaurant am Lehmweg.', '1551218808-94e220e084d2', { imageSecondary: '1517248135467-4c7edcad34c4', primaryCta: { label: 'Abend bei uns planen', href: '/reservierung' } }),
        {
          type: 'textImage',
          data: {
            badge: 'Unsere Geschichte',
            headline: 'Warum wir es bewusst einfacher machen',
            text:
              '<p>Jonas Brandt hat Jahre in Sterneküchen verbracht — und irgendwann gemerkt, dass er das Kochen mehr mochte als die Bühne. 2016 hat er Salzkorn eröffnet: 14 Tische, eine offene Küche, eine kleine Karte. Zwei Jahre später kam Mira Halász dazu und übernahm den Gastraum.</p>' +
              '<p>Was uns wichtig ist: gute Produkte, sauber gekocht, ruhig serviert. Wein, der Spaß macht, ohne einzuschüchtern. Und ein Abend, der Zeit lässt — für das Essen, das Gespräch und einen guten Schluss.</p>',
            image: img('1498579150354-977475b7ea0b'),
            imageAlt: 'Offene Küche bei Salzkorn',
            layout: 'image-right',
            primaryCta: { label: 'Küche & Tisch erleben', href: '/reservierung', icon: 'CalendarCheck' },
          },
        },
        {
          type: 'timeline',
          data: {
            badge: 'Meilensteine',
            headline: 'Acht Jahre Lehmweg',
            subline: 'Gewachsen ist vor allem die Ruhe, nicht der Raum.',
            entries: [
              { year: '2016', title: 'Salzkorn eröffnet', text: 'Jonas Brandt eröffnet mit 14 Tischen und einer offenen Küche.' },
              { year: '2018', title: 'Mira übernimmt den Gastraum', text: 'Service, Wein und Reservierungen bekommen ein Gesicht.' },
              { year: '2020', title: 'Die Karte schrumpft', text: 'Weniger Gerichte, bessere Vorbereitung, ruhigerer Service.' },
              { year: '2022', title: 'Eigener Weinfokus', text: 'Kleine Güter, oft biologisch, fast immer mit Geschichte.' },
              { year: '2024', title: 'Weinabende & Werkstatt', text: 'Formate, die Gäste tiefer mitnehmen — ohne Show.' },
            ],
          },
        },
        {
          type: 'stats',
          data: {
            headline: 'Was uns ausmacht — in Zahlen',
            stats: [
              { icon: 'Calendar', value: '2016', label: 'seit' },
              { icon: 'Users',    value: '11',   label: 'im Team' },
              { icon: 'Leaf',     value: '7',    label: 'Gerichte auf der Karte' },
              { icon: 'Wine',     value: '40+',  label: 'Weine im Keller' },
            ],
          },
        },
        {
          type: 'team',
          data: {
            badgeText: 'Team',
            headline: 'Die Menschen hinter Salzkorn',
            subline: 'Eine kleine Crew, die sich Abend für Abend abstimmt.',
            members: [
              { name: 'Jonas Brandt', role: 'Küchenchef & Inhaber',   image: img('1566492031773-4f4e44671857', 600), bio: 'Kam aus der Sternegastronomie, wollte es wieder entspannter. Kocht saisonal und ohne Schnörkel.' },
              { name: 'Mira Halász',  role: 'Gastgeberin & Inhaberin', image: img('1502685104226-ee32379fefbe', 600), bio: 'Führt den Gastraum, kennt die Stammgäste und sorgt dafür, dass Timing nie wie Stress wirkt.' },
              { name: 'Pavel Roth',   role: 'Sous-Chef',               image: img('1507591064344-4c6ce005b128', 600), bio: 'Steht seit der ersten Stunde am Herd. Verantwortet Pasta, Brot und die tägliche Vorbereitung.' },
              { name: 'Lena Kraus',   role: 'Sommelière',              image: img('1512316609839-ce289d3eba0a', 600), bio: 'Übersetzt Herkunft in Trinkgefühl. Kuratiert Weinkarte und die monatlichen Weinabende.' },
            ],
            valuesHeadline: 'Was uns wichtig ist',
            values: [
              { icon: 'Leaf',          title: 'Saison & Markt',  text: 'Was nicht überzeugt, kommt nicht auf den Teller — auch wenn es auf der Karte stünde.' },
              { icon: 'HeartHandshake',title: 'Gastgeben',       text: 'Aufmerksam, ruhig, mit Sinn für Timing. Wir tragen nicht nur Teller.' },
              { icon: 'Wine',          title: 'Wein ohne Vortrag', text: 'Wir empfehlen offen und tauschen ein Glas, das nicht schmeckt.' },
              { icon: 'Scale',         title: 'Ehrliche Preise', text: 'Kleine Karte, faire Kalkulation, geteiltes Trinkgeld.' },
            ],
          },
        },
        { type: 'jobListings', data: {
          badge: 'Karriere',
          headline: 'Wir suchen Menschen, die gern Gastgeber sind.',
          subline: 'Kleines Team, kleine Karte, ehrliche Arbeitszeiten — Gastronomie, die sich gut anfühlt.',
          benefits: ['2 feste freie Tage', 'Trinkgeld transparent geteilt', 'Personalessen inklusive', 'Weinschulungen'],
          jobs: [
            { title: 'Chef de Partie (m/w/d)', location: 'am Markt', type: 'Vollzeit', schedule: 'ab sofort', text: 'Kleine Karte, saisonale Produkte, ehrliches Handwerk — kein Convenience-Theater.', tags: ['Küche'], href: '/kontakt' },
            { title: 'Service / Gastgeber:in', location: 'am Markt', type: 'Voll-/Teilzeit', schedule: 'nach Absprache', text: 'Sie führen durch den Abend, empfehlen Wein und behalten den Raum im Blick.', tags: ['Service', 'Quereinstieg möglich'], href: '/kontakt' },
          ],
          contactCta: { label: 'Kurz vorstellen', href: '/kontakt' },
        } },
        sectionCta('Lust, bei uns Platz zu nehmen?', 'Reservieren Sie einen Tisch — oder schauen Sie sich erst die Karte an.', 'Reservierung vormerken', '/reservierung'),
      ],
    },

    // ── Journal (News) ───────────────────────────────────────────────────────
    {
      slug: 'news', title: 'Journal',
      seo: {
        metaTitle: 'Journal — aus Küche und Gastraum',
        metaDescription: 'Beiträge aus Küche und Gastraum von Salzkorn: über kleine Karten, ehrlichen Wein und das, was am Tisch wirklich zählt.',
      },
      sections: [
        sectionCollectionHero('Aus Küche und Gastraum', 'Was uns gerade beschäftigt — über Produkte, Wein und Gastgeben.', '1514933651103-005eec06c04b', 'Journal'),
        { type: 'newsGrid', data: { collectionKey: 'news', headline: 'Alle Beiträge', subline: 'Gedanken aus dem Alltag eines kleinen Restaurants.' } },
      ],
    },

    // ── Kontakt ──────────────────────────────────────────────────────────────
    {
      slug: 'kontakt', title: 'Kontakt',
      seo: {
        metaTitle: 'Kontakt — Tisch, Telefon, WhatsApp',
        metaDescription: 'So erreichen Sie Salzkorn in Hamburg-Eppendorf: Telefon, E-Mail, WhatsApp und Anfrageformular.',
      },
      sections: [
        edHeroSec('Kontakt', 'Direkt zu uns', 'Persönlich, nicht über drei Ecken. Schreiben Sie oder rufen Sie an.', '1552566626-52f8b828add9', { primaryCta: { label: 'Jetzt anrufen', href: 'tel:+494047112380' }, secondaryCta: { label: 'Nachricht schreiben', href: '#kontakt' } }),
        {
          type: 'contact',
          anchorId: 'kontakt',
          data: {
            headline: 'Schreiben Sie uns',
            introText: 'Für Reservierungen nutzen Sie am besten die Tischanfrage. Für alles andere sind wir hier erreichbar.',
            formEnabled: true,
            submitLabel: 'Nachricht senden',
            infoCards: [
              { icon: 'Phone',  label: 'Telefon',        value: '+49 40 47112380' },
              { icon: 'Mail',   label: 'E-Mail',         value: 'hallo@salzkorn-hamburg.de' },
              { icon: 'MapPin', label: 'Adresse',        value: 'Lehmweg 18, 20251 Hamburg' },
              { icon: 'Clock',  label: 'Öffnungszeiten', value: 'Di–Fr ab 18 · Sa & So ab 12 · Mo Ruhetag' },
            ],
          },
        },
        { type: 'openingHours', data: { headline: 'Öffnungszeiten', days: [
          { label: 'Montag', hours: 'Ruhetag' },
          { label: 'Dienstag bis Donnerstag', hours: '18:00 – 23:00' },
          { label: 'Freitag', hours: '18:00 – 00:00' },
          { label: 'Samstag', hours: '12:00 – 15:00 · 18:00 – 00:00' },
          { label: 'Sonntag', hours: '12:00 – 21:00' },
        ] } },
        {
          type: 'map',
          data: {
            headline: 'So finden Sie uns',
            embedUrl: 'https://www.google.com/maps?q=Lehmweg%2018%2C%2020251%20Hamburg&output=embed',
            height: 'm',
          },
        },
      ],
    },

    // ── Impressum ────────────────────────────────────────────────────────────
    {
      slug: 'impressum', title: 'Impressum',
      seo: { metaTitle: 'Impressum', metaDescription: 'Anbieterkennzeichnung gemäß § 5 TMG.' },
      sections: [
        {
          type: 'legalContent',
          data: {
            headline: 'Impressum',
            blocks: [
              { headline: 'Anbieter', text: '<p>Salzkorn Gastronomie GmbH<br>Lehmweg 18<br>20251 Hamburg<br>Deutschland</p>' },
              { headline: 'Vertretungsberechtigte Geschäftsführung', text: '<p>Jonas Brandt, Mira Halász</p>' },
              { headline: 'Kontakt', text: '<p>Telefon: +49 40 47112380<br>E-Mail: hallo@salzkorn-hamburg.de</p>' },
              { headline: 'Registereintrag', text: '<p>Amtsgericht Hamburg, HRB 142880</p>' },
              { headline: 'Umsatzsteuer-Identifikationsnummer', text: '<p>USt-IdNr. gemäß § 27 a UStG: DE 308 552 140</p>' },
              { headline: 'Verantwortlich i.S.d. § 18 Abs. 2 MStV', text: '<p>Mira Halász, Anschrift wie oben</p>' },
              { headline: 'Online-Streitbeilegung', text: '<p>Die EU-Kommission stellt eine Plattform zur Online-Streitbeilegung bereit: https://ec.europa.eu/consumers/odr. Wir sind nicht verpflichtet und nicht bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>' },
              { headline: 'Haftungshinweis', text: '<p>Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte externer Links. Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich.</p>' },
            ],
          },
        },
      ],
    },

    // ── Datenschutz ──────────────────────────────────────────────────────────
    {
      slug: 'datenschutz', title: 'Datenschutz',
      seo: { metaTitle: 'Datenschutzerklärung', metaDescription: 'Informationen zur Verarbeitung personenbezogener Daten gemäß DSGVO.' },
      sections: [
        {
          type: 'legalContent',
          data: {
            headline: 'Datenschutzerklärung',
            blocks: [
              { headline: '1. Verantwortlicher', text: '<p>Salzkorn Gastronomie GmbH, Lehmweg 18, 20251 Hamburg, vertreten durch die Geschäftsführung Jonas Brandt und Mira Halász.</p>' },
              { headline: '2. Hosting', text: '<p>Diese Website wird bei Vercel Inc. (340 S Lemon Ave #4133, Walnut, CA 91789, USA) gehostet. Es gilt das EU-US Data Privacy Framework. Mit Vercel besteht ein Auftragsverarbeitungsvertrag.</p>' },
              { headline: '3. Erhebung allgemeiner Daten', text: '<p>Beim Aufruf der Website werden technisch notwendige Daten (IP-Adresse, Zeitpunkt, Browsertyp) verarbeitet. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Diese Daten werden nach 14 Tagen gelöscht.</p>' },
              { headline: '4. Reservierungs- und Kontaktanfragen', text: '<p>Die im Anfrage- oder Reservierungsformular eingegebenen Daten verarbeiten wir ausschließlich zur Bearbeitung Ihrer Anfrage (Art. 6 Abs. 1 lit. b DSGVO) und löschen sie spätestens 24 Monate nach Abschluss des Vorgangs.</p>' },
              { headline: '5. Cookies', text: '<p>Wir setzen ausschließlich technisch notwendige Cookies ein. Tracking- oder Marketing-Cookies werden nicht verwendet.</p>' },
              { headline: '6. Rechte der betroffenen Personen', text: '<p>Sie haben das Recht auf Auskunft (Art. 15), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung (Art. 18), Datenübertragbarkeit (Art. 20) und Widerspruch (Art. 21). Beschwerden richten Sie an den Hamburgischen Beauftragten für Datenschutz und Informationsfreiheit.</p>' },
            ],
          },
        },
      ],
    },
  ],
};

// ── helpers ───────────────────────────────────────────────────────────────────
function sectionCollectionHero(headline, subline, imageId, category) {
  return {
    type: 'collectionHero',
    data: {
      headline, subline, category,
      bgImage: img(imageId), backgroundImage: img(imageId),
      overlayColor: C.moss, overlayOpacity: 0.62,
      bgPosition: 'center 48%', imageEffect: 'kenBurns', imageEffectIntensity: 'subtle',
    },
    styleOverrides: heroTokens,
  };
}

function edHeroSec(eyebrow, headline, text, imageId, opts = {}) {
  return {
    type: 'editorialHero',
    data: {
      eyebrow, headline, text: `<p>${text}</p>`, imagePrimary: img(imageId),
      ...(opts.imageSecondary ? { imageSecondary: img(opts.imageSecondary) } : {}),
      primaryCta: opts.primaryCta || { label: 'Tisch persönlich planen', href: '/reservierung' },
      ...(opts.secondaryCta ? { secondaryCta: opts.secondaryCta } : {}),
      ...(opts.hint ? { hint: opts.hint } : {}),
    },
  };
}

function cineHeroSec(eyebrow, headline, subline, imageId, facts, primaryLabel = 'Platz anfragen') {
  return {
    type: 'cinematicHero',
    data: {
      eyebrow, headline, subline, image: img(imageId),
      overlay: 'rgba(26,36,26,0.58)', align: 'left',
      primaryCta: { label: primaryLabel, href: '/reservierung' },
      ...(facts ? { facts } : {}),
    },
  };
}

function imCtaSec(headline, subline, imageId, primaryLabel = 'Reservierung senden') {
  return {
    type: 'immersiveCtaBanner',
    data: {
      badge: 'Direkt anfragen', headline, subline, image: img(imageId),
      overlay: 'rgba(26,36,26,0.62)',
      primaryCta: { label: primaryLabel, href: '/reservierung' },
      secondaryCta: { label: 'Jetzt anrufen', href: 'tel:+494047112380' },
    },
  };
}

function sectionCta(headline, subline, label, href) {
  return {
    type: 'ctaBand',
    data: { badgeText: 'Direkt anfragen', headline, subline, ctaPrimary: { label, href, icon: 'ArrowRight' } },
    styleOverrides: { '--token-section-bg': C.moss, ...darkSectionTokens },
  };
}

function offerCards() {
  return [
    { title: 'Abendkarte',     text: 'Kleine, saisonale Karte mit Tellern zum Teilen, Hauptgängen und Süßem.', icon: 'Utensils',    href: '/c/leistungen/abendkarte',     mediaType: 'icon' },
    { title: 'Samstags-Lunch', text: 'Leichter Mittagstisch, ein Glas Wein und Zeit nach dem Isemarkt.',       icon: 'Sun',         href: '/c/leistungen/samstags-lunch', mediaType: 'icon' },
    { title: 'Weinabende',     text: 'Vier Gänge, fünf Weine und Geschichten ohne steifen Vortrag.',           icon: 'Wine',        href: '/c/leistungen/weinabende',     mediaType: 'icon' },
    { title: 'Private Feiern', text: 'Geburtstage, Teamabende und Familienessen bis 30 Personen.',             icon: 'PartyPopper', href: '/c/leistungen/private-feiern', mediaType: 'icon' },
  ];
}

function menuData(headline, subline, ctaLabel = 'Zur Reservierung') {
  return {
    badgeText: 'Speisekarte', headline, subline,
    introText: 'Die Karte wechselt nach Saison. Diese Auswahl zeigt die Richtung.',
    footnote: 'Allergene nennen wir am Tisch transparent. Vegetarische Alternativen sind immer möglich.',
    ctaPrimary: { label: ctaLabel, href: '/reservierung' },
    categories: [
      {
        title: 'Zum Teilen',
        description: 'Kleine Teller für den ruhigen Start.',
        items: [
          { name: 'Sellerie vom Holz', description: 'Im Ganzen gegart, Haselnuss, Apfel, braune Butter.', price: '17 €', tags: ['vegetarisch'], vegetarian: true, highlighted: true },
          { name: 'Forelle, Buttermilch', description: 'Gebeizte Forelle, Buttermilch, Gurke, Dill.', price: '16 €' },
          { name: 'Geröstete Karotte', description: 'Karotte, Kichererbse, Kreuzkümmel, Joghurt.', price: '13 €', tags: ['vegan'], vegan: true },
        ],
      },
      {
        title: 'Hauptgänge',
        description: 'Zwei bis drei, je nach Markt.',
        items: [
          { name: 'Hausgemachte Pasta', description: 'Was Saison hat — Steinpilz, Kürbis oder Tomate.', price: '19 €', highlighted: true, vegetarian: true },
          { name: 'Kabeljau, Linsen', description: 'Gebratener Kabeljau, Belugalinsen, Petersilienöl.', price: '26 €' },
          { name: 'Dry-Aged Rind', description: 'Weiderind, rosa gebraten, Schmorzwiebel, Kresse.', price: '34 €' },
          { name: 'Schmorgemüse-Teller', description: 'Wurzelgemüse, Polenta, Salsa verde.', price: '21 €', vegetarian: true },
        ],
      },
      {
        title: 'Süßes',
        description: 'Klassisch, nicht kompliziert.',
        items: [
          { name: 'Birne, Honig, Quark', description: 'Pochierte Birne, Thymianhonig, Quarkcreme.', price: '9 €', vegetarian: true },
          { name: 'Schokoladentarte', description: 'Dunkle Schokolade, Meersalz, Crème fraîche.', price: '9 €', vegetarian: true },
          { name: 'Affogato', description: 'Espresso auf Vanilleeis.', price: '6 €', vegetarian: true },
        ],
      },
    ],
  };
}

function eventsData(headline, sundayCtaLabel = 'Sonntagstafel vormerken') {
  return {
    badgeText: 'Events', headline,
    subline: 'Ein paar Formate, bei denen Essen, Wein und Gespräch genug Platz bekommen.',
    fallbackText: 'Neue Termine veröffentlichen wir im Journal und auf Instagram.',
    events: [
      { title: 'Weinabend Loire', description: 'Vier Gänge zu fünf Weinen von der Loire. Ein ruhiger Abend mit Lena und passenden Flaschen.', image: img('1510812431401-41d2bd2722f3'), dateLabel: 'erster Donnerstag im Monat', timeLabel: '19:00', priceLabel: '89 € p.P.', cta: { label: 'Anfragen', href: '/c/events/wein-loire' } },
      { title: 'Teig-Werkstatt', description: 'Pasta und Brot selbst machen, danach gemeinsam essen.', image: img('1498579150354-977475b7ea0b'), dateLabel: 'samstags auf Anfrage', timeLabel: '15:00', priceLabel: 'ab 72 € p.P.', cta: { label: 'Workshop ansehen', href: '/c/events/pasta-werkstatt' } },
      { title: 'Sonntagstafel', description: 'Sonntagmittag mit langen Tischen, einem Gericht für alle und entspanntem Service.', image: img('1551218808-94e220e084d2'), dateLabel: 'sonntags', timeLabel: '12:00', priceLabel: 'à la carte', cta: { label: sundayCtaLabel, href: '/c/events/sonntagstafel' } },
    ],
  };
}

function restaurantFaq() {
  return [
    { question: 'Kann ich online direkt buchen?', answer: 'Aktuell senden Sie eine Anfrage. Wir bestätigen persönlich, damit Tisch, Uhrzeit und Anlass wirklich passen.' },
    { question: 'Gibt es vegetarische und vegane Gerichte?', answer: 'Ja. Auf der Karte stehen immer mehrere vegetarische Optionen, vegane Gerichte klären wir gerne vorab.' },
    { question: 'Sind Hunde erlaubt?', answer: 'Ruhige Hunde sind willkommen. Bitte erwähnen Sie es bei der Reservierung, damit wir einen passenden Tisch wählen.' },
    { question: 'Kann man bei euch feiern?', answer: 'Ja, private Feiern sind bis 30 Personen möglich. Wir planen Menü, Ablauf und Weinempfehlung vorab.' },
  ];
}

function buildOfferItem({ slug, title, excerpt, imageId, intro, facts }) {
  return {
    title, slug,
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
        { id: uuid(), type: 'featureShowcase', data: { headline: 'Warum Gäste dieses Format wählen', subline: 'Weil es Orientierung gibt, ohne den Abend festzunageln.', image: img('1517248135467-4c7edcad34c4'), features: [
          'Wir fragen vorher nach Anlass, Zeit und Erwartungen.',
          'Küche und Service wissen, was ansteht.',
          'Das Timing bleibt ruhig, ohne Gefühl von Durchschleusen.',
          'Es bleibt genug Raum für Gespräch, Wein und einen guten Schluss.',
        ], ctaLabel: 'Tisch für dieses Angebot planen', ctaHref: '/reservierung' } },
        { id: uuid(), ...sectionCta(`${title} anfragen?`, 'Schreiben Sie uns Datum, Personenanzahl und Wünsche. Wir antworten persönlich.', 'Anfrage senden', '/reservierung') },
      ],
    },
  };
}

function buildEventItem({ slug, title, excerpt, imageId, dateLabel }) {
  return {
    title, slug,
    data: {
      excerpt,
      sections: [
        { id: uuid(), ...sectionCollectionHero(title, excerpt, imageId, 'Event') },
        { id: uuid(), type: 'textImage', data: { badge: dateLabel, headline: 'Ein Abend mit genug Struktur für Leichtigkeit.', text: `<p>${excerpt}</p><p>Wir planen Gänge, Weine und Zeiten vorab. Am Abend selbst darf es sich trotzdem nach Restaurant anfühlen — nicht nach Veranstaltung.</p>`, image: img(imageId), imageAlt: title, layout: 'image-left', items: [
          { icon: 'CalendarHeart', title: 'Termin', text: dateLabel },
          { icon: 'Users', title: 'Gruppengröße', text: 'klein genug für Gespräch' },
          { icon: 'Wine', title: 'Wein', text: 'auf Wunsch begleitet' },
          { icon: 'MessageCircle', title: 'Anfrage', text: 'persönlich bestätigt' },
        ], primaryCta: { label: 'Event anfragen', href: '/kontakt', icon: 'ArrowRight' } } },
        { id: uuid(), type: 'timeline', data: { badge: 'Ablauf', headline: 'So läuft der Abend', entries: [
          { year: '18:30', title: 'Ankommen', text: 'Aperitivo und kurze Begrüßung.' },
          { year: '19:00', title: 'Erster Gang', text: 'Küche startet ruhig, Service erklärt nur so viel wie nötig.' },
          { year: '20:30', title: 'Hauptgang', text: 'Zeit am Tisch statt Programmstress.' },
          { year: '22:00', title: 'Süßes', text: 'Espresso, Digestif und kein harter Schnitt.' },
        ] }, styleOverrides: warmLightTokens },
        { id: uuid(), ...sectionCta(`${title} vormerken?`, 'Schreiben Sie uns kurz, mit wie vielen Personen Sie kommen möchten.', 'Anfrage senden', '/kontakt') },
      ],
    },
  };
}

function buildNewsItem({ slug, title, excerpt, imageId, body }) {
  return {
    title, slug,
    data: {
      excerpt,
      sections: [
        { id: uuid(), ...sectionCollectionHero(title, excerpt, imageId, 'Journal') },
        { id: uuid(), type: 'freeText', data: { content: body } },
        { id: uuid(), type: 'featureShowcase', data: { headline: 'Aus Küche und Gastraum gedacht', subline: 'Unsere Beiträge sollen erklären, wie wir arbeiten — nicht nur schöne Wörter aneinanderreihen.', image: img(imageId), features: [
          'Einordnung: was hinter einer Entscheidung steckt.',
          'Handwerk: wie Küche und Vorbereitung zusammenhängen.',
          'Genuss: warum manche Dinge einfacher bleiben dürfen.',
          'Gastgefühl: was am Tisch wirklich zählt.',
        ] } },
        { id: uuid(), ...sectionCta('Fragen zum Thema?', 'Am besten bei einem Glas Wein. Oder kurz per Nachricht.', 'Gespräch am Tisch fortsetzen', '/reservierung') },
      ],
    },
  };
}

if (require.main === module) {
  run(tenant).catch((e) => { console.error('FATAL:', e); process.exit(1); });
}

module.exports = tenant;
