/**
 * Demo tenant: CAFE
 *
 * Identität: "SPIRAL Coffee & Plants" - ein ruhiges Café in Innsbruck-Wilten
 * mit Specialty Coffee, Brunch, Pflanzen und kleinen Abendformaten.
 *
 * Brand:
 * - Stadt: Innsbruck-Wilten, Andreas-Hofer-Straße
 * - Story: Ein Café als Pause vom Bildschirm: guter Kaffee, einfache Karte,
 *   Pflanzen, wechselnde Brunch-Ideen und kleine After-Work-Events.
 * - Tonalität: warm, klar, nahbar, etwas editorial.
 * - Bildwelt: Kaffee, Pflanzen, helle Keramik, Holz, Stadtcafé, Brunch.
 * - Farben: Espresso, Matcha, Oat, Terrakotta. Classic style only.
 *
 * Run:
 *   node scripts/demo-tenants/cafe.cjs
 */

const crypto = require('crypto');
const { run } = require('./_lib/runner.cjs');
const { darkTokens } = require('./_lib/theme.cjs');

const PAT = 'eb8a830226779565248605c2fd832aeffd338a50fdc85475393fd2117aafcb93';

const uuid = () => crypto.randomUUID();
const img = (id, w = 1920) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=82`;

const C = {
  espresso: '#23150F',
  crema: '#FFF8EE',
  oat: '#F3E7D5',
  paper: '#FFFCF6',
  matcha: '#3F5A43',
  sage: '#789072',
  clay: '#B96745',
  cocoa: '#5A3426',
  gold: '#D6A85B',
};

const darkSectionTokens = {
  ...darkTokens({ accent: '#F0C777' }),
  '--token-section-bg': C.espresso,
  '--token-section-bg-alt': '#1A0F0B',
  '--token-heading': '#FFFFFF',
  '--token-subheading': 'rgba(255,255,255,0.9)',
  '--token-body': 'rgba(255,255,255,0.88)',
  '--token-muted': 'rgba(255,255,255,0.66)',
  '--token-eyebrow': '#F0C777',
  '--token-icon': '#F0C777',
  '--token-stat-value': '#F0C777',
  '--token-quote': '#FFFFFF',
  '--token-rating-star': '#F0C777',
  '--token-check': '#F0C777',
  '--token-on-dark-heading': '#FFFFFF',
  '--token-on-dark-body': 'rgba(255,255,255,0.88)',
  '--token-on-dark-muted': 'rgba(255,255,255,0.66)',
  '--token-btn-bg': C.crema,
  '--token-btn-text': C.espresso,
  '--token-badge-bg': 'rgba(255,255,255,0.16)',
  '--token-badge-text': '#FFFFFF',
  '--token-badge-border': 'rgba(255,255,255,0.26)',
  '--token-card-bg': 'rgba(35,21,15,0.72)',
  '--token-card-border': 'rgba(255,255,255,0.22)',
};

const heroTokens = {
  ...darkSectionTokens,
  '--token-badge-bg': 'rgba(255,248,238,0.92)',
  '--token-badge-text': C.espresso,
  '--token-badge-border': 'rgba(255,248,238,0.5)',
};

const lightTokens = {
  '--token-section-bg': C.paper,
  '--token-section-bg-alt': C.oat,
  '--token-card-bg': '#FFFFFF',
  '--token-card-border': '#E6D6C2',
  '--token-heading': C.espresso,
  '--token-subheading': C.cocoa,
  '--token-body': '#4D3B31',
  '--token-muted': '#77665B',
  '--token-icon': C.matcha,
  '--token-eyebrow': C.clay,
  '--token-stat-value': C.clay,
  '--token-quote': C.espresso,
  '--token-rating-star': C.gold,
  '--token-check': C.matcha,
  '--token-btn-bg': C.espresso,
  '--token-btn-text': '#FFFFFF',
  '--token-badge-bg': '#EFE1CF',
  '--token-badge-text': C.espresso,
  '--token-badge-border': '#DCC6AF',
};

const greenTokens = {
  ...lightTokens,
  '--token-section-bg': '#EDF4EA',
  '--token-section-bg-alt': '#E2EDE0',
  '--token-heading': '#173A2A',
  '--token-body': '#294837',
  '--token-muted': '#5A7163',
  '--token-icon': C.matcha,
  '--token-btn-bg': C.matcha,
  '--token-btn-text': '#FFFFFF',
  '--token-badge-bg': '#D9E8D5',
  '--token-badge-text': '#173A2A',
  '--token-badge-border': '#BED5B8',
};

const section = (type, data, styleOverrides = lightTokens, variant = 'classic') => ({
  id: uuid(),
  type,
  variant,
  data,
  styleOverrides,
});

function buildNewsItem({ slug, title, excerpt, imageId, body }) {
  return {
    title,
    slug,
    excerpt,
    data: {
      excerpt,
      sections: [
        section('collectionHero', { headline: title, subline: excerpt, bgImage: img(imageId), backgroundImage: img(imageId), overlayColor: '#1B100B', overlayOpacity: 0.6 }, heroTokens),
        section('freeText', { content: body }),
        section('ctaBand', { badgeText: 'Frage zum Journal?', headline: 'Kurz schreiben statt lange suchen.', subline: 'Wenn Sie etwas planen oder wissen möchten, antworten wir persönlich.', ctaPrimary: { label: 'Kontakt aufnehmen', href: '/kontakt', icon: 'Send' } }, darkSectionTokens),
      ],
    },
  };
}

function buildOfferItem({ slug, title, excerpt, imageId, body }) {
  return {
    title,
    slug,
    excerpt,
    data: {
      excerpt,
      sections: [
        section('collectionHero', { headline: title, subline: excerpt, bgImage: img(imageId), backgroundImage: img(imageId), overlayColor: '#1B100B', overlayOpacity: 0.58 }, heroTokens),
        section('textImage', { headline: 'So funktioniert es im SPIRAL', text: body, image: img(imageId, 1400), imageAlt: title, layout: 'image-right', primaryCta: { label: 'Anfragen', href: '/kontakt', icon: 'Send' } }),
        section('ctaBand', { badgeText: 'Interesse?', headline: `${title} anfragen`, subline: 'Schreiben Sie uns kurz Datum, Uhrzeit und Personenzahl. Wir antworten konkret.', ctaPrimary: { label: 'Nachricht senden', href: '/kontakt', icon: 'Send' } }, darkSectionTokens),
      ],
    },
  };
}

const tenant = {
  slug: 'cafe',
  pat: PAT,
  wipe: true,
  publish: true,

  style: { style: 'classic' },

  brand: {
    companyName: 'SPIRAL Coffee & Plants',
    tagline: 'Specialty Coffee, Brunch und grüne Pausen in Innsbruck-Wilten',
    primaryColor: C.espresso,
    secondaryColor: C.matcha,
    accentColor: C.clay,
    logoDisplay: 'name',
    headingFont: 'Fraunces',
    bodyFont: 'Inter',
    topBarColor: C.espresso,
    footerColor: '#160C08',
  },

  contact: {
    phone: '+43 512 908144',
    email: 'hello@spiral-coffee.at',
    address: 'Andreas-Hofer-Straße 7, 6020 Innsbruck',
    whatsapp: '+43 660 9081440',
    whatsappEnabled: true,
    whatsappColor: '#25D366',
  },

  design: {
    sectionBg: C.paper,
    sectionBgAlt: C.oat,
    cardBg: '#FFFFFF',
    cardBorder: '#E6D6C2',
    heading: C.espresso,
    subheading: C.cocoa,
    body: '#4D3B31',
    muted: '#77665B',
    brand: C.espresso,
    accent: C.clay,
    icon: C.matcha,
    btnBg: C.espresso,
    btnText: '#FFFFFF',
    badgeBg: '#EFE1CF',
    badgeText: C.espresso,
    badgeBorder: '#DCC6AF',
    dividerColor: '#E6D6C2',
    eyebrow: C.clay,
    statValue: C.clay,
    quote: C.espresso,
    ratingStar: C.gold,
    check: C.matcha,
    onDarkHeading: '#FFFFFF',
    onDarkBody: 'rgba(255,255,255,0.88)',
    onDarkMuted: 'rgba(255,255,255,0.66)',
  },

  socialLinks: {
    instagram: 'https://www.instagram.com/spiral.coffee/',
    google: 'https://g.page/spiral-coffee-innsbruck',
  },

  openingHours: {
    monday: { closed: true },
    tuesday: { open: '09:30', close: '17:00' },
    wednesday: { open: '09:30', close: '17:00' },
    thursday: { open: '09:30', close: '17:00' },
    friday: { open: '09:30', close: '18:00' },
    saturday: { open: '09:30', close: '18:00' },
    sunday: { open: '10:00', close: '15:00' },
  },

  formFields: {
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'email', label: 'E-Mail', type: 'email', required: true },
      { name: 'topic', label: 'Worum geht es?', type: 'select', options: ['Tisch anfragen', 'Event', 'Catering', 'Feedback'], required: true },
      { name: 'message', label: 'Nachricht', type: 'textarea', required: true },
    ],
  },

  seoGlobal: {
    siteTitle: 'SPIRAL Coffee & Plants Innsbruck',
    metaDescription: 'Specialty Coffee, Brunch, Pflanzen und kleine Events in Innsbruck-Wilten. Ein Café für echte Pausen statt endloser Screens.',
    keywords: 'Café Innsbruck, Specialty Coffee Innsbruck, Brunch Innsbruck, Café Wilten, Kaffee Innsbruck',
  },

  navigation: {
    items: [
      { label: 'Startseite', href: '/' },
      { label: 'Karte', href: '/karte' },
      { label: 'Events', href: '/events' },
      { label: 'Über uns', href: '/ueber-uns' },
      { label: 'Journal', href: '/journal' },
      { label: 'Kontakt', href: '/kontakt' },
    ],
    ctaLabel: 'Tisch anfragen',
    ctaHref: '/kontakt',
  },

  footer: {
    columns: [
      { title: 'SPIRAL', items: [{ text: 'Karte', href: '/karte' }, { text: 'Events', href: '/events' }, { text: 'Über uns', href: '/ueber-uns' }] },
      { title: 'Besuch', items: [{ text: 'Kontakt', href: '/kontakt' }, { text: 'Journal', href: '/journal' }, { text: 'Instagram', href: 'https://www.instagram.com/spiral.coffee/' }] },
    ],
    legalLinks: [{ label: 'Impressum', href: '/impressum' }, { label: 'Datenschutz', href: '/datenschutz' }],
    cta: { label: 'Nachricht senden', href: '/kontakt' },
  },

  collections: [
    {
      key: 'news',
      label: 'Journal',
      items: [
        buildNewsItem({ title: 'Neue Brunch-Karte: mehr Grün, mehr Crunch, mehr SPIRAL.', slug: 'neue-brunch-karte', excerpt: 'Warum unsere neue Karte kleiner, klarer und trotzdem spannender geworden ist.', imageId: '1512568400610-62da28bc8a13', body: '<p>Unsere Brunch-Karte ist bewusst nicht endlos. Wir kochen lieber wenige Dinge richtig gut: Sauerteig, Kräuter, Eier von Höfen aus der Umgebung und süße Teller, die nicht nach Dessertzwang schmecken.</p><p>Neu dabei: Green Shakshuka, Kardamom-Porridge und unser Toast mit Pilzen, Zitrone und Haselnuss.</p>' }),
        buildNewsItem({ title: 'Coffee to go: schneller, aber nicht beliebig.', slug: 'coffee-to-go', excerpt: 'Wie wir Takeaway so organisieren, dass Qualität nicht unter Tempo leidet.', imageId: '1509042239860-f550ce710b93', body: '<p>Ein guter Kaffee für unterwegs braucht klare Abläufe. Deshalb arbeiten wir morgens mit vorbereiteten Rezepturen, eigener Milchstation und kurzen Wegen hinter der Bar.</p><p>Das Ergebnis: weniger Warten, weniger Hektik, bessere Tassen.</p>' }),
        buildNewsItem({ title: 'Warum wir Events im Café lieben', slug: 'events-im-cafe', excerpt: 'Kleine Abende, die nah genug bleiben: Tastings, Listening Sessions und Pflanzen-Swaps.', imageId: '1517248135467-4c7edcad34c4', body: '<p>Unser Raum funktioniert am besten, wenn er nicht überinszeniert wird. Ein langer Tisch, gute Musik, eine ehrliche Karte und Menschen, die wirklich miteinander reden.</p>' }),
      ],
    },
    {
      key: 'angebote',
      label: 'Angebote',
      items: [
        buildOfferItem({ title: 'Brunch am Wochenende', slug: 'brunch', excerpt: 'Sauerteig, Eier, Grünzeug, Süßes und Kaffee ohne Zeitdruck.', imageId: '1484723091739-30a097e8f929', body: '<p>Samstag und Sonntag kochen wir länger, weicher und mit mehr Platz für Gespräche.</p><p>Wir reservieren kleine Gruppen bewusst, damit der Raum nicht kippt und die Karte trotzdem frisch bleibt.</p>' }),
        buildOfferItem({ title: 'Coffee Office', slug: 'coffee-office', excerpt: 'Kaffee, Wasser, kleiner Tisch und Steckdose für konzentrierte Vormittage.', imageId: '1497366754035-f200968a6e72', body: '<p>Kein Coworking-Space, sondern ein ruhiger Platz für zwei fokussierte Stunden.</p><p>Ideal für kurze Konzeptarbeit, Vorbereitung oder ein Gespräch, das nicht im Büro stattfinden muss.</p>' }),
        buildOfferItem({ title: 'Private Tastings', slug: 'private-tastings', excerpt: 'Kleine Verkostungen für Teams, Freundeskreise und neugierige Nachbarn.', imageId: '1442512595331-e89e73853f31', body: '<p>Wir erklären Herkunft, Röstung und Zubereitung ohne Barista-Theater.</p><p>Das Format bleibt nahbar: sechs bis zwölf Personen, klare Dauer, gute Tassen und genug Zeit für Fragen.</p>' }),
      ],
    },
  ],

  pages: [
    {
      slug: '',
      title: 'Startseite',
      seo: { metaTitle: 'SPIRAL Coffee & Plants | Café in Innsbruck-Wilten', metaDescription: 'Specialty Coffee, Brunch, Pflanzen und kleine Events in Innsbruck-Wilten. Ruhig, warm und nah am Alltag.' },
      sections: [
        section('hero', {
          headline: 'Ein Café für Kaffee, nicht für endlose Screens.',
          subline: 'SPIRAL ist Ihr ruhiger Ort in Innsbruck-Wilten: Specialty Coffee, ehrlicher Brunch, Pflanzen und kleine Events mit Gefühl.',
          badgeText: 'Innsbruck-Wilten',
          badgeIcon: 'Coffee',
          bgMode: 'image',
          bgImage: img('1495474472287-4d71bcdd2085'),
          bgPosition: 'center 48%',
          overlayColor: '#1B100B',
          overlayOpacity: 0.56,
          primaryCta: { label: 'Karte ansehen', href: '/karte', icon: 'Menu' },
          secondaryCta: { label: 'Tisch anfragen', href: '/kontakt', icon: 'Send' },
          trustItems: ['Spezialitätenkaffee', 'Brunch am Wochenende', 'Pflanzen & kleine Events'],
          trustStripColor: 'rgba(35,21,15,0.62)',
          imageEffect: 'kenBurns',
          imageEffectIntensity: 'subtle',
        }, heroTokens),
        section('socialProofBar', { bgStyle: 'light', items: [
          { value: '4,8/5', label: 'Gästestimmen', icon: 'Star' },
          { value: 'Di-So', label: 'Café-Zeit', icon: 'Clock' },
          { value: 'Wilten', label: 'Andreas-Hofer-Straße', icon: 'MapPin' },
          { value: 'More', label: 'than coffee', icon: 'Leaf' },
        ] }),
        section('featureShowcase', {
          badge: 'Unsere Haltung',
          headline: 'Kaffee ist bei uns kein Nebengeräusch.',
          subline: 'Wir wollen kein austauschbares Coffee-Konzept, sondern einen Ort, den man wiedererkennt.',
          text: '<p>Unsere Karte ist klein, saisonal und bewusst lesbar. Espresso, Filter, Brunch und Süßes sollen nicht beeindrucken, sondern gut in den Tag passen.</p>',
          image: img('1442512595331-e89e73853f31'),
          features: ['Bohnen mit Herkunft', 'Brunch ohne Buffetgefühl', 'pflanzenfreundlicher Raum', 'Takeaway mit sauberem Ablauf'],
          ctaLabel: 'Mehr über uns',
          ctaHref: '/ueber-uns',
        }, lightTokens),
        section('drinkMenu', {
          headline: 'Kaffee, der klar bleibt.',
          subline: 'Unsere Getränkekarte wechselt klein, aber regelmäßig.',
          categories: [
            { title: 'Espresso Bar', items: [{ name: 'Espresso', description: 'Hausröstung, schokoladig und klar', price: '2,90 €' }, { name: 'Flat White', description: 'doppio, cremig, nicht zu heiß', price: '4,40 €' }, { name: 'Iced Latte', description: 'mit Hafer oder Bio-Milch', price: '4,90 €' }] },
            { title: 'Filter & Tee', items: [{ name: 'Batch Brew', description: 'täglich wechselnde Bohne', price: '3,80 €' }, { name: 'Handbrew', description: 'nach Verfügbarkeit', price: '5,60 €' }, { name: 'Kräutertee', description: 'Zitrone, Salbei, Minze', price: '4,20 €' }] },
          ],
        }, greenTokens),
        section('foodMenu', {
          headline: 'Brunch, Kuchen, kleine Teller.',
          subline: 'Nicht riesig. Dafür gut vorbereitet und frisch genug für jeden Tag.',
          items: [
            { name: 'Green Shakshuka', description: 'Spinat, Kräuter, Ei, Sauerteig', price: '12,80 €', image: img('1484723091739-30a097e8f929', 1200), badge: 'Wochenende' },
            { name: 'Pilz-Toast', description: 'Sauerteig, Zitrone, Haselnuss, Frischkäse', price: '10,90 €', image: img('1525351484163-7529414344d8', 1200), badge: 'Herzhaft' },
            { name: 'Kardamom-Porridge', description: 'Hafer, Apfel, Nuss, etwas Orange', price: '8,90 €', image: img('1517673132405-a56a62b18caf', 1200), badge: 'Warm' },
            { name: 'Zitronen-Olivenöl-Kuchen', description: 'saftig, nicht zu süß', price: '4,60 €', image: img('1509440159596-0249088772ff', 1200), badge: 'Hausgemacht' },
          ],
        }),
        section('bentoGrid', {
          headline: 'Warum Menschen sitzen bleiben.',
          subline: 'Es sind selten die großen Gesten. Meistens sind es Details.',
          items: [
            { title: 'Kein Dauerlärm', text: 'Musik bleibt leise genug für Gespräche.', icon: 'VolumeX', span: '2' },
            { title: 'Pflanzen statt Deko', text: 'Grün, das den Raum wirklich ruhiger macht.', icon: 'Leaf' },
            { title: 'Laptop-freie Zone', text: 'Einige Tische bleiben bewusst für Gespräche frei.', icon: 'Coffee' },
            { title: 'Takeaway ohne Stress', text: 'Kurze Wege, klare Reihenfolge, gute Tasse.', icon: 'CupSoda' },
          ],
        }, greenTokens),
        section('cafeEventCalendar', {
          headline: 'Kleine Abende, die nicht laut sein müssen.',
          subline: 'Tastings, Pflanzen-Swaps und ruhige Formate nach Ladenschluss.',
          events: [
            { title: 'Filter Tasting', date: '2026-06-18', time: '18:30', category: 'Kaffee', description: 'Drei Bohnen, drei Methoden, viele Fragen.', image: img('1497935586351-b67a49e012bf', 1200) },
            { title: 'Plant Swap', date: '2026-07-04', time: '17:00', category: 'Community', description: 'Ableger tauschen, Kaffee trinken, Tipps mitnehmen.', image: img('1485955900006-10f4d324d411', 1200) },
            { title: 'Listening Hour', date: '2026-07-23', time: '19:00', category: 'Musik', description: 'Eine Stunde Platte, keine Playlist, kleine Karte.', image: img('1516280440614-37939bbacd81', 1200) },
          ],
        }, darkSectionTokens),
        section('timeline', {
          badge: 'Unsere Geschichte',
          headline: 'Aus einer Barista-Ecke wurde ein Ort.',
          subline: 'SPIRAL ist langsam gewachsen. Genau so soll es bleiben.',
          entries: [
            { year: '2019', title: 'Erste Maschine', text: 'Zwei Tische, eine La Marzocco und viel Neugier in Wilten.' },
            { year: '2021', title: 'Mehr Grün', text: 'Pflanzen kamen erst zufällig, dann bewusst in den Raum.' },
            { year: '2024', title: 'Brunch statt Hektik', text: 'Kleine Karte, feste Abläufe und Wochenenden mit mehr Zeit.' },
            { year: 'Heute', title: 'Ruhiger bleiben', text: 'Wir wachsen nur, wenn der Ort dabei nahbar bleibt.' },
          ],
        }),
        section('statsCounter', {
          headline: 'Was man bei uns messen kann.',
          subline: 'Nicht alles Wichtige passt in Zahlen. Ein paar Dinge trotzdem.',
          stats: [
            { value: 12, suffix: '+', label: 'Röstereien getestet' },
            { value: 38, suffix: 'm²', label: 'kleiner Gastraum' },
            { value: 4, label: 'Eventformate' },
            { value: 0, suffix: ' €', label: 'Laptopdruck' },
          ],
        }),
        section('portfolio', {
          badgeText: 'Lieblingsformate',
          headline: 'Drei Gründe, länger zu bleiben.',
          subline: 'Für Vormittage, Nachmittage und kleine Abende.',
          projects: [
            { title: 'Brunch am Fenster', category: 'Wochenende', description: 'Sauerteig, Eier, Kräuter, Kaffee und Blick Richtung Wilten.', image: img('1504754524776-8f4f37790ca0', 1200), href: '/c/angebote/brunch', stats: [{ label: 'Tage', value: 'Sa/So' }, { label: 'Uhrzeit', value: '10-14' }] },
            { title: 'Coffee Office', category: 'Vormittag', description: 'Ruhiger Platz, gute Tasse, Wasser und klare Zeitfenster.', image: img('1516321497487-e288fb19713f', 1200), href: '/c/angebote/coffee-office', stats: [{ label: 'Dauer', value: '2h' }, { label: 'Plätze', value: '6' }] },
            { title: 'Private Tastings', category: 'Abend', description: 'Kaffee verstehen, ohne Fachsprache aushalten zu müssen.', image: img('1497935586351-b67a49e012bf', 1200), href: '/c/angebote/private-tastings', stats: [{ label: 'Personen', value: '6-12' }, { label: 'Dauer', value: '90 Min.' }] },
          ],
          ctaLabel: 'Alle Angebote',
          ctaHref: '/karte',
        }),
        section('testimonials', {
          headline: 'Was Gäste oft sagen.',
          subline: 'Ruhig im Ton, stark im Kaffee.',
          items: [
            { quote: 'Endlich ein Café, in dem man sich unterhalten kann, ohne dass der Kaffee Nebensache ist.', name: 'Nina K.', context: 'Wilten', rating: 5 },
            { quote: 'Kleine Karte, aber alles wirkt durchdacht. Der Pilz-Toast ist jedes Mal ein Grund wiederzukommen.', name: 'Jonas R.', context: 'Innsbruck', rating: 5 },
            { quote: 'Takeaway geht schnell, aber nie hektisch. Man merkt die Abläufe.', name: 'Mara T.', context: 'Pendlerin', rating: 5 },
          ],
        }, greenTokens),
        section('newsPreview', {
          headline: 'Neues aus dem SPIRAL',
          subline: 'Karten-Updates, Ideen aus der Bar und kleine Einblicke hinter unseren Café-Alltag.',
          collectionKey: 'news',
          linkLabel: 'Alle News lesen',
          linkHref: '/journal',
        }),
        section('faq', {
          headline: 'Kurz geklärt.',
          subline: 'Damit der Besuch einfach bleibt.',
          items: [
            { question: 'Kann man reservieren?', answer: 'Für kleine Gruppen ja. Schreib uns kurz über das Kontaktformular oder WhatsApp.' },
            { question: 'Gibt es vegane Optionen?', answer: 'Ja, täglich. Hafermilch ist Standardoption, Kuchen und Brunch wechseln.' },
            { question: 'Darf man mit Laptop arbeiten?', answer: 'Ja, aber nicht an allen Tischen. Einige Plätze bleiben bewusst laptopfrei.' },
            { question: 'Macht Ihr Events?', answer: 'Ja, kleine Tastings, Pflanzen-Swaps und ruhige Abendformate.' },
          ],
        }),
        section('ctaBand', {
          badgeText: 'Direkt fragen',
          headline: 'Heute Kaffee, morgen Brunch?',
          subline: 'Schreib uns kurz, wenn Du mit mehreren Personen kommst oder ein kleines Format planst.',
          ctaPrimary: { label: 'Tisch anfragen', href: '/kontakt', icon: 'Send' },
        }, darkSectionTokens),
      ],
    },
    {
      slug: 'leistungen',
      title: 'Angebote',
      seo: { metaTitle: 'Angebote | SPIRAL Coffee & Plants', metaDescription: 'Brunch, Coffee Office, Tastings und kleine Gruppenformate im SPIRAL Coffee & Plants in Innsbruck.' },
      sections: [
        section('hero', { headline: 'Mehr als Kaffee, aber nie beliebig.', subline: 'Unsere Angebote bleiben klein, planbar und nah am Raum: Brunch, ruhige Arbeitsfenster und Tastings für Gruppen.', badgeText: 'Angebote', badgeIcon: 'Coffee', bgMode: 'image', bgImage: img('1495474472287-4d71bcdd2085'), overlayColor: '#1B100B', overlayOpacity: 0.58, primaryCta: { label: 'Anfragen', href: '/kontakt', icon: 'Send' }, secondaryCta: { label: 'Karte ansehen', href: '/karte', icon: 'Menu' }, trustItems: ['Brunch Sa/So', 'Tastings ab 6 Personen', 'Coffee Office', 'kleine Gruppen'], trustStripColor: 'rgba(35,21,15,0.62)' }, heroTokens),
        section('collectionList', { headline: 'Formate, die zum SPIRAL passen.', subline: 'Nicht jedes Angebot braucht eine große Bühne. Wichtig ist, dass Ablauf, Karte und Raum zusammen funktionieren.', collectionKey: 'angebote', columns: 3, showImage: true, showDate: false, showExcerpt: true, showSortControls: false }),
        section('comparisonTable', { badge: 'Vergleich', headline: 'Was passt zu welchem Moment?', text: 'Eine schnelle Orientierung, bevor Du uns schreibst.', columns: [{ label: 'Brunch' }, { label: 'Office' }, { label: 'Tasting' }], highlightCol: 0, rows: [
          { feature: 'Ideal für', values: ['Wochenende', 'ruhiges Arbeiten', 'kleine Gruppen'] },
          { feature: 'Zeit', values: ['10-14 Uhr', 'Vormittag', 'abends'] },
          { feature: 'Personen', values: ['2-8', '1-2', '6-12'] },
          { feature: 'Anfrage', values: ['ab 4 Personen', 'empfohlen', 'erforderlich'] },
        ] }),
        section('processSteps', { headline: 'So klären wir Anfragen.', badgeText: 'Ablauf', steps: [
          { icon: 'Send', title: 'Kurz schreiben', text: 'Personenzahl, Wunschdatum und Idee reichen.' },
          { icon: 'ClipboardCheck', title: 'Machbarkeit prüfen', text: 'Wir schauen, ob Raum und Team passen.' },
          { icon: 'Coffee', title: 'Karte festlegen', text: 'Kaffee, Brunch oder Tasting werden bewusst klein geplant.' },
          { icon: 'CheckCircle2', title: 'Besuch vorbereiten', text: 'Sie kommen an, wir haben den Ablauf im Griff.' },
        ] }, greenTokens),
        section('faq', { headline: 'Kurz beantwortet.', subline: 'Damit Ihre Anfrage schnell sinnvoll wird.', items: [
          { question: 'Kann ich das Café exklusiv buchen?', answer: 'Für kleine Abendformate ja, tagsüber nur sehr eingeschränkt.' },
          { question: 'Gibt es Catering?', answer: 'Klein und lokal: Kaffee, Kuchen und einfache Brunch-Bausteine.' },
          { question: 'Wie früh sollte ich anfragen?', answer: 'Für Gruppen am Wochenende gern mindestens eine Woche vorher.' },
          { question: 'Gibt es feste Pakete?', answer: 'Wir haben Grundformate, passen sie aber an Personenzahl und Uhrzeit an.' },
        ] }),
        section('ctaBand', { badgeText: 'Angebot planen', headline: 'Ein Format im SPIRAL?', subline: 'Schreib uns kurz, was Du vorhast. Wir antworten ehrlich und konkret.', ctaPrimary: { label: 'Angebot anfragen', href: '/kontakt', icon: 'Send' } }, darkSectionTokens),
      ],
    },
    {
      slug: 'karte',
      title: 'Karte',
      seo: { metaTitle: 'Karte | SPIRAL Coffee & Plants', metaDescription: 'Kaffee, Brunch, Kuchen und kleine Teller im SPIRAL Coffee & Plants in Innsbruck-Wilten.' },
      sections: [
        section('hero', { headline: 'Kleine Karte. Gute Gründe.', subline: 'Wir kochen und brühen lieber weniger, aber klarer: Kaffee, Brunch, Kuchen und kleine Teller.', badgeText: 'Karte', badgeIcon: 'Menu', bgMode: 'image', bgImage: img('1442512595331-e89e73853f31'), overlayColor: '#1B100B', overlayOpacity: 0.6, primaryCta: { label: 'Brunch ansehen', href: '#brunch', icon: 'Utensils' }, secondaryCta: { label: 'Tisch anfragen', href: '/kontakt', icon: 'Send' }, trustItems: ['Espresso Bar', 'Filter', 'Brunch', 'Kuchen'], trustStripColor: 'rgba(35,21,15,0.62)' }, heroTokens),
        section('drinkMenu', { headline: 'Getränke', subline: 'Kaffee zuerst. Alles andere danach.', categories: [
          { title: 'Kaffee', items: [{ name: 'Espresso', description: 'Hausröstung', price: '2,90 €' }, { name: 'Cappuccino', description: 'Bio-Milch oder Hafer', price: '4,20 €' }, { name: 'Flat White', description: 'doppio, cremig', price: '4,40 €' }, { name: 'Batch Brew', description: 'wechselnde Bohne', price: '3,80 €' }] },
          { title: 'Kalt & ohne Kaffee', items: [{ name: 'Iced Matcha', description: 'Hafer, Vanille optional', price: '5,20 €' }, { name: 'Hauslimo', description: 'Zitrone, Minze, wenig Zucker', price: '4,60 €' }, { name: 'Kombucha', description: 'nach Verfügbarkeit', price: '4,90 €' }] },
        ] }, greenTokens),
        section('foodMenu', { headline: 'Brunch & Kuchen', subline: 'Täglich klein, am Wochenende etwas ausführlicher.', items: [
          { name: 'Green Shakshuka', description: 'Spinat, Kräuter, Ei, Sauerteig', price: '12,80 €', image: img('1484723091739-30a097e8f929', 1200), badge: 'Wochenende' },
          { name: 'Pilz-Toast', description: 'Sauerteig, Zitrone, Haselnuss', price: '10,90 €', image: img('1525351484163-7529414344d8', 1200), badge: 'Herzhaft' },
          { name: 'Granola Bowl', description: 'Joghurt, Kompott, Nuss, Honig', price: '8,60 €', image: img('1494390248081-4e521a5940db', 1200), badge: 'Früh' },
          { name: 'Zitronenkuchen', description: 'Olivenöl, Glasur, Salz', price: '4,60 €', image: img('1509440159596-0249088772ff', 1200), badge: 'Hausgemacht' },
        ] }),
        section('comparisonTable', { badge: 'Orientierung', headline: 'Was passt wann?', text: 'Drei typische Besuche, drei einfache Wege durch die Karte.', columns: [{ label: 'Schnell' }, { label: 'Brunch' }, { label: 'Abend' }], highlightCol: 1, rows: [
          { feature: 'Zeit', values: ['10 Minuten', '60-90 Minuten', 'nach Event'] },
          { feature: 'Empfehlung', values: ['Flat White', 'Shakshuka + Filter', 'Tasting-Menü'] },
          { feature: 'Platz', values: ['Bar', 'Fenster', 'langer Tisch'] },
          { feature: 'Anfrage', values: ['nein', 'ab 4 Personen', 'ja'] },
        ] }),
        section('collectionList', { headline: 'Angebote', subline: 'Formate, die über die normale Karte hinausgehen.', collectionKey: 'angebote', columns: 3, showImage: true, showDate: false, showExcerpt: true, showSortControls: false }),
        section('ctaBand', { badgeText: 'Karte & Gruppe', headline: 'Mit mehreren Personen?', subline: 'Wir halten keine riesigen Flächen frei, planen kleine Gruppen aber gern sauber ein.', ctaPrimary: { label: 'Kurz anfragen', href: '/kontakt', icon: 'Send' } }, darkSectionTokens),
      ],
    },
    {
      slug: 'events',
      title: 'Events',
      seo: { metaTitle: 'Events im Café | SPIRAL Coffee & Plants', metaDescription: 'Kleine Café-Events in Innsbruck: Tastings, Plant Swaps und ruhige Abende im SPIRAL.' },
      sections: [
        section('hero', { headline: 'Abende, die nicht laut sein müssen.', subline: 'Nach Ladenschluss wird SPIRAL zum kleinen Raum für Kaffee, Pflanzen, Musik und Gespräche.', badgeText: 'Events', badgeIcon: 'Calendar', bgMode: 'image', bgImage: img('1517248135467-4c7edcad34c4'), overlayColor: '#1B100B', overlayOpacity: 0.58, primaryCta: { label: 'Termine ansehen', href: '#termine', icon: 'Calendar' }, secondaryCta: { label: 'Eigenes Format', href: '/kontakt', icon: 'Send' }, trustItems: ['kleine Gruppen', 'ruhige Formate', 'Kaffee & Pflanzen'], trustStripColor: 'rgba(35,21,15,0.62)' }, heroTokens),
        section('cafeEventCalendar', { headline: 'Nächste Termine', subline: 'Wir halten die Liste kurz und aktuell.', events: [
          { title: 'Filter Tasting', date: '2026-06-18', time: '18:30', category: 'Kaffee', description: 'Drei Bohnen, drei Methoden, viele Fragen.', image: img('1497935586351-b67a49e012bf', 1200) },
          { title: 'Plant Swap', date: '2026-07-04', time: '17:00', category: 'Community', description: 'Ableger tauschen, Kaffee trinken, Tipps mitnehmen.', image: img('1485955900006-10f4d324d411', 1200) },
          { title: 'Listening Hour', date: '2026-07-23', time: '19:00', category: 'Musik', description: 'Eine Stunde Platte, keine Playlist, kleine Karte.', image: img('1516280440614-37939bbacd81', 1200) },
        ] }, lightTokens),
        section('bentoGrid', { headline: 'So planen wir Events.', subline: 'Klein genug, um persönlich zu bleiben.', items: [
          { title: 'Kein Bühnengefühl', text: 'Der Raum bleibt Café, nicht Seminarraum.', icon: 'Armchair', span: '2' },
          { title: 'Klare Zeiten', text: 'Start, Ende und Karte stehen vorher fest.', icon: 'Clock' },
          { title: 'Gute Tassen', text: 'Kaffee bleibt Teil des Abends, nicht Deko.', icon: 'Coffee' },
          { title: 'Wenig Lärm', text: 'Musik und Gespräche bekommen Raum.', icon: 'Volume2' },
        ] }, greenTokens),
        section('processSteps', { headline: 'Vom Wunsch zum Abend', badgeText: 'Ablauf', steps: [
          { icon: 'Send', title: 'Anfragen', text: 'Datum, Personenzahl und Idee reichen für den Start.' },
          { icon: 'ListChecks', title: 'Format klären', text: 'Wir schlagen Ablauf, Karte und Zeitfenster vor.' },
          { icon: 'Coffee', title: 'Abend halten', text: 'Wir kümmern uns um Raum, Bar und Stimmung.' },
          { icon: 'Heart', title: 'Nachwirken', text: 'Kein großes Event, sondern ein guter Abend.' },
        ] }),
        section('ctaBand', { badgeText: 'Eigene Idee?', headline: 'Ein kleiner Abend im SPIRAL?', subline: 'Schreib uns, was Du vorhast. Wir sagen ehrlich, ob unser Raum dazu passt.', ctaPrimary: { label: 'Event anfragen', href: '/kontakt', icon: 'Send' } }, darkSectionTokens),
        section('faq', { headline: 'Häufig gefragt', subline: 'Kurz vorab.', items: [
          { question: 'Wie viele Personen passen?', answer: 'Je nach Format 8 bis 24 Personen.' },
          { question: 'Gibt es Alkohol?', answer: 'Manchmal Wein und Aperitif, aber immer passend zum Format.' },
          { question: 'Kann man privat buchen?', answer: 'Ja, wenn es zum Raum und zur Uhrzeit passt.' },
          { question: 'Macht Ihr Firmenformate?', answer: 'Ja, besonders Tastings und kleine Teamabende.' },
        ] }),
      ],
    },
    {
      slug: 'ueber-uns',
      title: 'Über uns',
      seo: { metaTitle: 'Über uns | SPIRAL Coffee & Plants', metaDescription: 'Die Geschichte hinter SPIRAL Coffee & Plants in Innsbruck-Wilten.' },
      sections: [
        section('hero', { headline: 'Warm, braun, lebendig, nah.', subline: 'SPIRAL ist ein Café, das lieber langsam besser wird als schnell größer.', badgeText: 'Über SPIRAL', badgeIcon: 'Leaf', bgMode: 'image', bgImage: img('1511081692775-05d0f180a065'), overlayColor: '#1B100B', overlayOpacity: 0.58, primaryCta: { label: 'Karte ansehen', href: '/karte', icon: 'Menu' }, secondaryCta: { label: 'Kontakt', href: '/kontakt', icon: 'Send' }, trustItems: ['Wilten', 'Specialty Coffee', 'kleine Karte'], trustStripColor: 'rgba(35,21,15,0.62)' }, heroTokens),
        section('textImage', { badge: 'Unsere Idee', headline: 'Ein Ort, der Sie kurz aus dem Tempo nimmt.', text: '<p>Wir glauben nicht, dass ein Café alles sein muss. SPIRAL ist kein Büro, kein Restaurant, kein Concept Store. Es ist ein guter Raum für Kaffee, Brunch, Gespräche und kleine Pausen.</p><p>Die Pflanzen kamen erst zufällig. Heute gehören sie dazu, weil sie genau das tun, was wir auch wollen: den Raum ruhiger machen.</p>', image: img('1517701604599-bb29b565090c'), imageAlt: 'Café mit Pflanzen und Holz', layout: 'image-left', items: [{ icon: 'Coffee', title: 'Kaffee zuerst', text: 'Jede Entscheidung startet an der Bar.' }, { icon: 'Leaf', title: 'Grün statt Kulisse', text: 'Pflanzen sind Teil des Raums.' }, { icon: 'Users', title: 'Nahbar bleiben', text: 'Wir planen für Menschen, nicht für Reichweite.' }, { icon: 'Clock', title: 'Zeit lassen', text: 'Gute Abläufe dürfen leise sein.' }] }),
        section('timeline', { badge: 'Geschichte', headline: 'Langsam gewachsen.', subline: 'SPIRAL ist nicht als Konzeptfolie gestartet.', entries: [
          { year: '2019', title: 'Zwei Tische', text: 'Ein kleiner Raum, eine Maschine und viele Nachbarn.' },
          { year: '2021', title: 'Pflanzen überall', text: 'Aus Ablegern wurde ein grüner Charakter.' },
          { year: '2024', title: 'Brunch klarer', text: 'Weniger Auswahl, bessere Vorbereitung.' },
          { year: 'Heute', title: 'Wilten bleibt Basis', text: 'Wir wachsen nur, wenn der Ort ruhig bleibt.' },
        ] }),
        section('principlesGrid', { badge: 'Was uns wichtig ist', headline: 'Nicht jedes Café braucht mehr Lautstärke.', subline: 'Wir arbeiten an Qualität, Ablauf und Atmosphäre. Jeden Tag.', principles: [
          { eyebrow: '01', title: 'Kaffee bleibt Kern', text: 'Trends sind erlaubt, aber die Tasse muss zuerst stimmen.' },
          { eyebrow: '02', title: 'Karte bleibt lesbar', text: 'Wenn alles wichtig ist, schmeckt nichts mehr klar.' },
          { eyebrow: '03', title: 'Raum bleibt ruhig', text: 'Gute Gespräche brauchen nicht viel Bühne.' },
          { eyebrow: '04', title: 'Service bleibt menschlich', text: 'Freundlich, ehrlich, ohne künstliche Nähe.' },
        ], cta: { label: 'Besuchen kommen', href: '/kontakt' } }, greenTokens),
        section('testimonials', { headline: 'Nah dran.', subline: 'Das sagen Gäste, die öfter kommen.', items: [
          { quote: 'Es fühlt sich an, als hätte Wilten genau dieses Café gebraucht.', name: 'Laura M.', context: 'Stammgast', rating: 5 },
          { quote: 'Kein großes Tamtam. Einfach sehr guter Kaffee und ein Raum, der gut tut.', name: 'Felix B.', context: 'Innsbruck', rating: 5 },
          { quote: 'Die Pflanzen, die Karte, die Musik - alles wirkt ruhig entschieden.', name: 'Sophie N.', context: 'Nachbarin', rating: 5 },
        ] }),
        section('ctaBand', { badgeText: 'Vorbeikommen', headline: 'Wir sind meistens an der Bar.', subline: 'Wenn Du etwas fragen willst: Schreib kurz oder komm vorbei.', ctaPrimary: { label: 'Kontakt öffnen', href: '/kontakt', icon: 'Send' } }, darkSectionTokens),
      ],
    },
    {
      slug: 'journal',
      title: 'Journal',
      seo: { metaTitle: 'Journal | SPIRAL Coffee & Plants', metaDescription: 'News, Karten-Updates und kleine Einblicke aus dem SPIRAL Coffee & Plants.' },
      sections: [
        section('hero', { headline: 'Notizen aus der Bar.', subline: 'Karten-Updates, Kaffee-Gedanken und kleine Geschichten aus dem Café-Alltag.', badgeText: 'Journal', badgeIcon: 'Newspaper', bgMode: 'image', bgImage: img('1495474472287-4d71bcdd2085'), overlayColor: '#1B100B', overlayOpacity: 0.58, primaryCta: { label: 'Beiträge lesen', href: '#beitraege', icon: 'ArrowDown' }, trustItems: ['Karte', 'Kaffee', 'Events'], trustStripColor: 'rgba(35,21,15,0.62)' }, heroTokens),
        section('collectionList', { headline: 'Aktuelle Beiträge', subline: 'Was sich bei uns bewegt.', collectionKey: 'news', columns: 3, showImage: true, showDate: true, showExcerpt: true, showSortControls: false }),
        section('featureShowcase', { badge: 'Warum Journal?', headline: 'Weil gute Orte erklärt werden dürfen.', subline: 'Wir schreiben über kleine Entscheidungen, die Gäste oft spüren, aber nicht immer sehen.', text: '<p>Welche Bohne kommt in den Filter? Warum ist die Karte klein? Weshalb bleiben manche Tische laptopfrei? Hier sammeln wir genau solche Notizen.</p>', image: img('1516321497487-e288fb19713f'), features: ['Karten-Updates', 'Event-Rückblicke', 'Kaffee-Wissen', 'Alltag aus Wilten'], ctaLabel: 'Kontakt aufnehmen', ctaHref: '/kontakt' }, lightTokens),
        section('ctaBand', { badgeText: 'Eine Idee?', headline: 'Ein Thema für unser Journal?', subline: 'Frag uns an der Bar oder schreib eine kurze Nachricht.', ctaPrimary: { label: 'Nachricht senden', href: '/kontakt', icon: 'Send' } }, greenTokens),
      ],
    },
    {
      slug: 'kontakt',
      title: 'Kontakt',
      seo: { metaTitle: 'Kontakt | SPIRAL Coffee & Plants Innsbruck', metaDescription: 'Adresse, Öffnungszeiten und Kontakt zum SPIRAL Coffee & Plants in Innsbruck-Wilten.' },
      sections: [
        section('hero', { headline: 'Mitten in Wilten, schnell erreichbar.', subline: 'SPIRAL liegt an der Andreas-Hofer-Straße. Gut für Kaffee vor Terminen, Brunch am Wochenende und Takeaway auf dem Weg durch die Stadt.', badgeText: 'Kontakt', badgeIcon: 'MapPin', bgMode: 'image', bgImage: img('1517245386807-bb43f82c33c4'), overlayColor: '#1B100B', overlayOpacity: 0.58, primaryCta: { label: 'Route öffnen', href: 'https://maps.google.com/?q=Andreas-Hofer-Stra%C3%9Fe%207%206020%20Innsbruck', icon: 'MapPin' }, secondaryCta: { label: 'Nachricht senden', href: 'mailto:hello@spiral-coffee.at', icon: 'Mail' }, trustItems: ['Andreas-Hofer-Straße', 'Di-So geöffnet', 'WhatsApp möglich'], trustStripColor: 'rgba(35,21,15,0.62)' }, heroTokens),
        section('contactLocation', { headline: 'Hier findest Du uns.', subline: 'ÖPNV, Fahrrad und kurze Wege aus Wilten.', address: 'Andreas-Hofer-Straße 7, 6020 Innsbruck', phone: '+43 512 908144', email: 'hello@spiral-coffee.at', mapEmbedUrl: 'https://www.google.com/maps?q=Andreas-Hofer-Stra%C3%9Fe%207%206020%20Innsbruck&output=embed' }, lightTokens),
        section('openingStatus', { badge: 'Öffnungszeiten', headline: 'Komm einfach vorbei.', subline: 'Der Status zeigt live, ob gerade offen ist. Montag ist Ruhetag — Feiertage kündigen wir im Journal und auf Instagram an.', days: [
          { day: 'Montag', closed: true },
          { day: 'Dienstag', hours: '09:30 – 17:00' },
          { day: 'Mittwoch', hours: '09:30 – 17:00' },
          { day: 'Donnerstag', hours: '09:30 – 17:00' },
          { day: 'Freitag', hours: '09:30 – 18:00' },
          { day: 'Samstag', hours: '09:30 – 18:00' },
          { day: 'Sonntag', hours: '10:00 – 15:00' },
        ], address: 'Andreas-Hofer-Straße 7, 6020 Innsbruck', phone: '+43 512 908144', openLabel: 'Jetzt geöffnet — komm vorbei!', closedLabel: 'Gerade geschlossen' }, greenTokens),
        section('contactForm', { headline: 'Schreib uns kurz.', subline: 'Für Gruppen, Events, Feedback oder Fragen zur Karte.', submitLabel: 'Nachricht senden' }),
        section('faq', { headline: 'Vor dem Besuch', subline: 'Ein paar praktische Antworten.', items: [
          { question: 'Gibt es Parkplätze?', answer: 'Nicht direkt vor der Tür. Mit Öffis, Fahrrad oder zu Fuß ist es deutlich entspannter.' },
          { question: 'Kann man mit Karte zahlen?', answer: 'Ja, Karte und Barzahlung sind möglich.' },
          { question: 'Sind Hunde erlaubt?', answer: 'Ja, wenn sie ruhig bleiben und der Raum nicht zu voll ist.' },
          { question: 'Kann ich Kuchen vorbestellen?', answer: 'Für kleine Mengen ja. Schreib uns bitte ein paar Tage vorher.' },
        ] }),
        section('ctaBand', { badgeText: 'Bis gleich', headline: 'Komm vorbei, wenn der Tag kurz Luft braucht.', subline: 'Wir sind nicht versteckt, nur ein bisschen ruhiger.', ctaPrimary: { label: 'Route öffnen', href: 'https://maps.google.com/?q=Andreas-Hofer-Stra%C3%9Fe%207%206020%20Innsbruck', icon: 'MapPin' } }, darkSectionTokens),
      ],
    },
    {
      slug: 'impressum',
      title: 'Impressum',
      sections: [
        section('textBlock', { headline: 'Impressum', text: '<p>SPIRAL Coffee & Plants GmbH<br>Andreas-Hofer-Straße 7<br>6020 Innsbruck<br>Österreich</p><p>Geschäftsführung: Mara Leitner<br>E-Mail: hello@spiral-coffee.at<br>Telefon: +43 512 908144</p><p>UID: ATU12345678<br>Firmenbuchnummer: FN 123456a<br>Firmenbuchgericht: Landesgericht Innsbruck</p><p>Mitglied der Wirtschaftskammer Tirol, Fachgruppe Gastronomie.</p>' }),
      ],
    },
    {
      slug: 'datenschutz',
      title: 'Datenschutz',
      sections: [
        section('textBlock', { headline: 'Datenschutz', text: '<p>Wir verarbeiten personenbezogene Daten nur, wenn sie für Kontaktanfragen, Reservierungswünsche, Eventanfragen oder gesetzliche Pflichten notwendig sind.</p><p>Wenn Du uns über das Formular kontaktierst, speichern wir Deine Angaben zur Bearbeitung der Anfrage. Eine Weitergabe an Dritte erfolgt nicht ohne rechtliche Grundlage.</p><p>Du kannst Auskunft, Berichtigung oder Löschung Deiner Daten verlangen. Schreib dafür an hello@spiral-coffee.at.</p>' }),
      ],
    },
  ],
};

module.exports = tenant;
if (require.main === module) {
  run(tenant).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
