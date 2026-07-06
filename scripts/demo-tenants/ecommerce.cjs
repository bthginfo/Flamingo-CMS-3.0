/**
 * Demo tenant: ECOMMERCE
 *
 * Identität: "Vinothek Goldberg" - kuratierter Weinshop aus München-Haidhausen
 * mit kleinen Gütern, Probierpaketen, Geschenkboxen und ehrlicher Beratung.
 *
 * Brand:
 * - Stadt: München-Haidhausen, nahe Wiener Platz.
 * - Story: Kein anonymer Flaschenversand, sondern ein Online-Shop mit echter
 *   Vinothek-DNA: persönliche Auswahl, klare Speiseempfehlungen, schnelle Lieferung.
 * - Tonalität: warm, präzise, genussvoll, vertrauensbildend.
 * - Bildwelt: Weinregale, gedeckte Tische, Flaschen, Gläser, Winzerhandwerk.
 * - Farben: Bordeaux, Tinte, Champagner, Papier, Messing. Classic style only.
 *
 * Run:
 *   node scripts/demo-tenants/ecommerce.cjs
 */

const crypto = require('crypto');
const { run } = require('./_lib/runner.cjs');
const { darkTokens: sharedDark } = require('./_lib/theme.cjs');

const PAT = '57b5659857d5ca5ef9eb11f0f8190c68c35f7f4ae041286f84818aa3bc51c30f';

const uuid = () => crypto.randomUUID();
const img = (id, w = 1920) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=82`;

const C = {
  wine: '#4A1625',
  ink: '#151018',
  plum: '#2A1622',
  paper: '#FFF9F1',
  cream: '#F4E8DA',
  champagne: '#D9B46B',
  copper: '#B86B3B',
  slate: '#4E5F66',
};

const lightTokens = {
  '--token-section-bg': C.paper,
  '--token-section-bg-alt': C.cream,
  '--token-card-bg': '#FFFFFF',
  '--token-card-border': '#E6D4C2',
  '--token-heading': C.ink,
  '--token-subheading': '#513C3A',
  '--token-body': '#493A37',
  '--token-muted': '#756865',
  '--token-icon': C.wine,
  '--token-eyebrow': C.copper,
  '--token-stat-value': C.copper,
  '--token-quote': C.ink,
  '--token-rating-star': C.champagne,
  '--token-check': C.wine,
  '--token-btn-bg': C.wine,
  '--token-btn-text': '#FFFFFF',
  '--token-badge-bg': '#F0DED1',
  '--token-badge-text': C.ink,
  '--token-badge-border': '#DFC4B1',
};

const creamTokens = {
  ...lightTokens,
  '--token-section-bg': C.cream,
  '--token-section-bg-alt': '#F8EFE4',
  '--token-card-bg': '#FFFDF8',
};

const darkTokens = {
  ...sharedDark({ accent: '#F0C987' }),
  '--token-section-bg': C.ink,
  '--token-section-bg-alt': C.plum,
  '--token-heading': '#FFFFFF',
  '--token-subheading': 'rgba(255,255,255,0.9)',
  '--token-body': 'rgba(255,255,255,0.88)',
  '--token-muted': 'rgba(255,255,255,0.68)',
  '--token-eyebrow': '#F0C987',
  '--token-icon': '#F0C987',
  '--token-stat-value': '#F0C987',
  '--token-quote': '#FFFFFF',
  '--token-rating-star': '#F0C987',
  '--token-check': '#F0C987',
  '--token-on-dark-heading': '#FFFFFF',
  '--token-on-dark-body': 'rgba(255,255,255,0.88)',
  '--token-on-dark-muted': 'rgba(255,255,255,0.68)',
  '--token-btn-bg': C.paper,
  '--token-btn-text': C.ink,
  '--token-badge-bg': 'rgba(255,255,255,0.15)',
  '--token-badge-text': '#FFFFFF',
  '--token-badge-border': 'rgba(255,255,255,0.28)',
  '--token-card-bg': '#24151B',
  '--token-card-border': '#56404A',
};

const heroTokens = {
  ...darkTokens,
  '--token-badge-bg': 'rgba(255,249,241,0.94)',
  '--token-badge-text': C.ink,
  '--token-badge-border': 'rgba(255,249,241,0.42)',
};

const ctaTokens = {
  ...darkTokens,
  '--token-section-bg': C.wine,
  '--token-section-bg-alt': '#6B2436',
  '--token-card-bg': '#5B1D2E',
  '--token-card-border': '#8A4354',
};

const section = (type, data, styleOverrides = lightTokens, variant = 'classic') => ({
  id: uuid(),
  type,
  variant,
  data,
  styleOverrides,
});

function newsItem({ slug, title, excerpt, imageId, body }) {
  return {
    title,
    slug,
    excerpt,
    data: {
      excerpt,
      image: img(imageId, 1600),
      sections: [
        section('collectionHero', {
          headline: title,
          subline: excerpt,
          bgImage: img(imageId),
          backgroundImage: img(imageId),
          overlayColor: '#1A0D12',
          overlayOpacity: 0.62,
        }, heroTokens),
        section('freeText', { content: body }),
        section('shopFeaturedProducts', { headline: 'Dazu passend aus dem Shop', count: 3, columns: 3, basePath: '/shop' }, creamTokens),
        section('ctaBand', {
          badgeText: 'Frage zur Auswahl?',
          headline: 'Lieber kurz fragen als blind bestellen.',
          subline: 'Wir empfehlen persönlich, wenn Anlass, Essen oder Geschmack noch nicht ganz klar sind.',
          ctaPrimary: { label: 'Beratung anfragen', href: '/kontakt', icon: 'Send' },
        }, ctaTokens),
      ],
    },
  };
}

const products = [
  {
    title: 'Barolo Monvigliero 2019',
    slug: 'barolo-monvigliero-2019',
    category: 'rotwein',
    priceCents: 6900,
    comparePriceCents: 7900,
    shortDescription: 'Nebbiolo aus dem Piemont, präzise gereift.',
    description: 'Ein Barolo mit Tiefe, Rosenblüte, Kirsche, feinem Tannin und genug Ruhe für lange Abende. Wir empfehlen ihn zu geschmortem Fleisch, Pilzgerichten oder als Geschenk für Menschen, die Struktur mögen.',
    images: [img('1553361371-9b22f78e8b1d', 1200)],
    stock: 18,
    highlights: ['Piemont', 'Nebbiolo', 'trinkreif ab jetzt', 'kleines Weingut'],
  },
  {
    title: 'Riesling Kabinett Schiefer 2023',
    slug: 'riesling-kabinett-schiefer-2023',
    category: 'weisswein',
    priceCents: 1890,
    shortDescription: 'Mosel-Riesling mit Zug, Frucht und klarer Säure.',
    description: 'Leicht, mineralisch und lebendig. Ein Riesling für asiatische Küche, Aperitif und lange Sommerabende, wenn der Wein frisch bleiben soll statt schwer zu wirken.',
    images: [img('1474722883778-792e7990302f', 1200)],
    stock: 42,
    highlights: ['Mosel', 'feinherb', '8,5% Vol.', 'sehr speisebegleitend'],
  },
  {
    title: 'Crémant Brut Nature Loire',
    slug: 'cremant-brut-nature-loire',
    category: 'schaumwein',
    priceCents: 2290,
    shortDescription: 'Feine Perlage, trocken, ohne laute Süße.',
    description: 'Ein Crémant für Menschen, die Champagner mögen, aber nicht jedes Mal Champagner öffnen wollen. Frisch, kalkig, präzise und wunderbar zum Start eines Essens.',
    images: [img('1549060279-7e168fcee0c2', 1200)],
    stock: 36,
    highlights: ['Loire', 'Brut Nature', 'Aperitif', 'feine Perlage'],
  },
  {
    title: 'Rosé Côtes de Provence 2024',
    slug: 'rose-cotes-de-provence-2024',
    category: 'rose',
    priceCents: 1690,
    shortDescription: 'Hell, trocken, kräuterig und sehr sauber.',
    description: 'Kein lauter Terrassenwein, sondern ein klarer Rosé mit roten Beeren, Kräutern und genug Spannung für Salate, Fisch und laue Abende.',
    images: [img('1506377247377-2a5b3b417ebb', 1200)],
    stock: 58,
    highlights: ['Provence', 'trocken', '8-10°C', 'Sommer und Fisch'],
  },
  {
    title: 'Naturwein Orange Jura 2022',
    slug: 'naturwein-orange-jura-2022',
    category: 'naturwein',
    priceCents: 3290,
    shortDescription: 'Maischevergoren, würzig, klar und nicht wild um der Wildheit willen.',
    description: 'Ein Orange Wine mit Grip, Tee, Aprikose und feiner Phenolik. Für Gäste, die neugierig sind, aber keine fehlerhafte Flasche suchen.',
    images: [img('1510812431401-41d2bd2722f3', 1200)],
    stock: 14,
    highlights: ['Jura', 'Orange Wine', 'minimal filtriert', 'für Käse und Gemüse'],
  },
  {
    title: 'Probierpaket Feierabend',
    slug: 'probierpaket-feierabend',
    category: 'probierpakete',
    priceCents: 5900,
    shortDescription: 'Sechs Flaschen für unkomplizierte Abende mit Gästen.',
    description: 'Zwei Weißweine, zwei Rotweine, ein Rosé und ein Crémant. So zusammengestellt, dass niemand lange erklären muss, was geöffnet wird.',
    images: [img('1510812431401-41d2bd2722f3', 1200)],
    stock: 25,
    highlights: ['6 Flaschen', 'versandfertig', 'Geschenkoption', 'kuratiert'],
  },
  {
    title: 'Geschenkbox Danke',
    slug: 'geschenkbox-danke',
    category: 'geschenke',
    priceCents: 4500,
    shortDescription: 'Zwei Flaschen, Karte und ruhige Verpackung.',
    description: 'Eine Geschenkbox für Kundinnen, Gastgeber oder Freunde: ein eleganter Weißwein, ein samtiger Rotwein und eine Karte ohne Kitsch.',
    images: [img('1558001373-7b93ee48ffa0', 1200)],
    stock: 31,
    highlights: ['2 Flaschen', 'Grußkarte', 'Geschenkverpackung', 'auf Wunsch mit Notiz'],
  },
  {
    title: 'Chianti Classico Bio 2021',
    slug: 'chianti-classico-bio-2021',
    category: 'rotwein',
    priceCents: 2190,
    shortDescription: 'Sangiovese, Kirsche, Kräuter und gute Trinkfreude.',
    description: 'Ein Chianti, der Pasta, Pizza und Ofengemüse ernst nimmt. Frucht, Säure und Würze sind so balanciert, dass eine zweite Flasche sinnvoll wirkt.',
    images: [img('1516594915697-87eb3b1c14ea', 1200)],
    stock: 40,
    highlights: ['Toskana', 'Bio', 'Sangiovese', 'Pasta und Pizza'],
  },
];

const categories = [
  { name: 'Rotwein', slug: 'rotwein', description: 'Rote Flaschen mit Struktur, Tiefe und klarer Speiseempfehlung.', image: img('1553361371-9b22f78e8b1d', 1200) },
  { name: 'Weißwein', slug: 'weisswein', description: 'Frische, mineralische und aromatische Weine für Küche und Terrasse.', image: img('1474722883778-792e7990302f', 1200) },
  { name: 'Schaumwein', slug: 'schaumwein', description: 'Crémant, Champagner und feine Perlage für Anlässe ohne Umwege.', image: img('1549060279-7e168fcee0c2', 1200) },
  { name: 'Rosé', slug: 'rose', description: 'Trockene Rosés, die mehr können als nur gut aussehen.', image: img('1506377247377-2a5b3b417ebb', 1200) },
  { name: 'Naturwein', slug: 'naturwein', description: 'Lebendige Weine mit Charakter, aber ohne technische Ausreden.', image: img('1510812431401-41d2bd2722f3', 1200) },
  { name: 'Probierpakete', slug: 'probierpakete', description: 'Fertig kuratierte Pakete für Abende, Geschenke und erste Orientierung.', image: img('1510812431401-41d2bd2722f3', 1200) },
  { name: 'Geschenke', slug: 'geschenke', description: 'Boxen und Flaschen, die persönlich wirken, ohne kompliziert zu werden.', image: img('1558001373-7b93ee48ffa0', 1200) },
];

const tenant = {
  slug: 'ecommerce',
  pat: PAT,
  wipe: true,
  publish: true,

  style: { style: 'classic' },

  brand: {
    companyName: 'Vinothek Goldberg',
    tagline: 'Kuratierte Weine, Probierpakete und Geschenkboxen aus München',
    primaryColor: C.wine,
    secondaryColor: C.plum,
    accentColor: C.champagne,
    logoDisplay: 'name',
    headingFont: 'Manrope',
    bodyFont: 'Inter',
    topBarColor: C.ink,
    footerColor: C.ink,
  },

  contact: {
    phone: '+49 89 2154 7080',
    email: 'beratung@vinothek-goldberg.de',
    address: 'Preysingstraße 14, 81667 München',
    whatsapp: '+49 176 21547080',
    whatsappEnabled: true,
    whatsappColor: '#25D366',
  },

  design: {
    sectionBg: C.paper,
    sectionBgAlt: C.cream,
    cardBg: '#FFFFFF',
    cardBorder: '#E6D4C2',
    heading: C.ink,
    subheading: '#513C3A',
    body: '#493A37',
    muted: '#756865',
    brand: C.wine,
    accent: C.champagne,
    icon: C.wine,
    btnBg: C.wine,
    btnText: '#FFFFFF',
    badgeBg: '#F0DED1',
    badgeText: C.ink,
    badgeBorder: '#DFC4B1',
    dividerColor: '#E6D4C2',
    eyebrow: C.copper,
    statValue: C.copper,
    quote: C.ink,
    ratingStar: C.champagne,
    check: C.wine,
    onDarkHeading: '#FFFFFF',
    onDarkBody: 'rgba(255,255,255,0.88)',
    onDarkMuted: 'rgba(255,255,255,0.68)',
  },

  socialLinks: {
    instagram: 'https://instagram.com/vinothekgoldberg',
  },

  openingHours: {
    monday: { closed: true },
    tuesday: { open: '11:00', close: '19:00' },
    wednesday: { open: '11:00', close: '19:00' },
    thursday: { open: '11:00', close: '20:00' },
    friday: { open: '11:00', close: '20:00' },
    saturday: { open: '10:00', close: '16:00' },
    sunday: { closed: true },
  },

  formFields: {
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'email', label: 'E-Mail', type: 'email', required: true },
      { name: 'phone', label: 'Telefon', type: 'tel', required: false },
      { name: 'occasion', label: 'Anlass oder Essen', type: 'text', required: false },
      { name: 'message', label: 'Nachricht', type: 'textarea', required: true },
    ],
  },

  seoGlobal: {
    siteTitle: 'Vinothek Goldberg München',
    siteDescription: 'Kuratierter Online-Shop für Wein, Probierpakete und Geschenkboxen aus München-Haidhausen. Persönliche Beratung, sichere Verpackung und schneller Versand.',
    keywords: ['Wein online kaufen München', 'Vinothek München', 'Probierpakete Wein', 'Geschenkbox Wein', 'Naturwein München'],
    ogImage: img('1510812431401-41d2bd2722f3'),
  },

  navigation: {
    items: [
      { label: 'Startseite', href: '/', type: 'link' },
      { label: 'Shop', href: '/shop', type: 'link' },
      { label: 'Kategorien', href: '/kategorien', type: 'link' },
      { label: 'Services', href: '/leistungen', type: 'link' },
      { label: 'Beratung', href: '/beratung', type: 'link' },
      { label: 'Journal', href: '/news', type: 'link' },
      { label: 'Über uns', href: '/ueber-uns', type: 'link' },
      { label: 'Kontakt', href: '/kontakt', type: 'link' },
    ],
    ctaLabel: 'Zum Warenkorb',
    ctaHref: '/warenkorb',
  },

  footer: {
    columns: [
      { title: 'Shop', items: [{ text: 'Alle Weine', href: '/shop' }, { text: 'Kategorien', href: '/kategorien' }, { text: 'Probierpakete', href: '/shop?kategorie=probierpakete' }] },
      { title: 'Service', items: [{ text: 'Services', href: '/leistungen' }, { text: 'Beratung', href: '/beratung' }, { text: 'Versand', href: '/versand' }] },
      { title: 'Vinothek', items: [{ text: 'Über uns', href: '/ueber-uns' }, { text: 'Journal', href: '/news' }, { text: 'Warenkorb', href: '/warenkorb' }] },
      { title: 'Kontakt', items: [{ text: '+49 89 2154 7080', href: 'tel:+498921547080' }, { text: 'beratung@vinothek-goldberg.de', href: 'mailto:beratung@vinothek-goldberg.de' }] },
    ],
    legalLinks: [
      { label: 'Impressum', href: '/impressum' },
      { label: 'Datenschutz', href: '/datenschutz' },
      { label: 'AGB', href: '/agb' },
      { label: 'Widerruf', href: '/widerruf' },
    ],
    cta: { label: 'Weine entdecken', href: '/shop' },
  },

  collections: [
    {
      key: 'news',
      label: 'Journal',
      items: [
        newsItem({
          slug: 'wein-zum-abendessen',
          title: 'Welcher Wein passt, wenn Gäste kommen?',
          excerpt: 'Drei einfache Fragen helfen mehr als zehn Etiketten.',
          imageId: '1506377247377-2a5b3b417ebb',
          body: '<p>Die beste Flasche ist selten die lauteste. Wir fragen zuerst: Was steht auf dem Tisch? Wie viele Menschen trinken mit? Soll der Wein Gespräch sein oder einfach gut begleiten?</p><p>Für Gemüse und Fisch empfehlen wir häufig Riesling oder Crémant. Für langsam gegarte Gerichte funktionieren Barolo, Chianti oder ein kühler, nicht zu schwerer Rotwein. Und wenn niemand weiß, was kommt, ist ein Probierpaket oft die ehrlichste Lösung.</p>',
        }),
        newsItem({
          slug: 'naturwein-ohne-dogma',
          title: 'Naturwein ohne Dogma',
          excerpt: 'Lebendige Weine müssen nicht fehlerhaft schmecken.',
          imageId: '1510812431401-41d2bd2722f3',
          body: '<p>Naturwein ist kein Stilversprechen, sondern eine Arbeitsweise. Uns interessieren Weine, die lebendig sind, aber sauber bleiben: klare Frucht, gute Säure, nachvollziehbare Herkunft.</p><p>Wir nehmen nur Flaschen auf, die wir auch Gästen ohne Vortrag einschenken würden. Wer mehr wissen möchte, bekommt die Geschichte dazu. Wer einfach trinken möchte, bekommt eine ehrliche Empfehlung.</p>',
        }),
        newsItem({
          slug: 'geschenke-die-nicht-beliebig-wirken',
          title: 'Weingeschenke, die nicht beliebig wirken',
          excerpt: 'Eine gute Box braucht keine goldene Schleife, sondern eine gute Auswahl.',
          imageId: '1558001373-7b93ee48ffa0',
          body: '<p>Ein Weingeschenk wirkt dann persönlich, wenn Anlass und Empfänger mitgedacht sind. Wir kombinieren Flaschen deshalb nach Geschmack, Essen, Jahreszeit und Budget.</p><p>Unsere Geschenkboxen können mit Karte versendet werden. Auf Wunsch schreiben wir eine kurze Empfehlung dazu, damit die Flasche nicht anonym im Regal landet.</p>',
        }),
      ],
    },
    {
      key: 'leistungen',
      label: 'Services',
      items: [
        {
          title: 'Persönliche Weinberatung',
          slug: 'weinberatung',
          excerpt: 'Für Essen, Geschenk, Firmenevent oder den eigenen Vorrat.',
          data: {
            excerpt: 'Für Essen, Geschenk, Firmenevent oder den eigenen Vorrat.',
            sections: [
              section('collectionHero', { headline: 'Weinberatung ohne Fachchinesisch.', subline: 'Sie nennen Anlass, Budget und Geschmack. Wir schlagen Flaschen vor, die wirklich passen.', bgImage: img('1556761175-5973dc0f32e7'), backgroundImage: img('1556761175-5973dc0f32e7'), overlayColor: '#160A0F', overlayOpacity: 0.62 }, heroTokens),
              section('processSteps', { badgeText: 'Ablauf', headline: 'So wird aus Unsicherheit eine gute Auswahl.', steps: [{ title: 'Anlass klären', text: 'Essen, Personenzahl, Stimmung und Budget.' }, { title: 'Stil eingrenzen', text: 'Frisch, kräftig, leise, besonders oder sicher.' }, { title: 'Flaschen wählen', text: 'Konkrete Auswahl mit kurzer Begründung.' }, { title: 'Liefern lassen', text: 'Sicher verpackt oder in der Vinothek abholen.' }] }),
              section('ctaBand', { badgeText: 'Beratung', headline: 'Kurz schreiben reicht.', subline: 'Wir antworten nicht mit einer Liste, sondern mit einer klaren Empfehlung.', ctaPrimary: { label: 'Beratung anfragen', href: '/kontakt', icon: 'Send' } }, ctaTokens),
            ],
          },
        },
        {
          title: 'Geschenkboxen',
          slug: 'geschenkboxen',
          excerpt: 'Weinboxen mit Karte, Auswahl und Versand an Wunschadresse.',
          data: {
            excerpt: 'Weinboxen mit Karte, Auswahl und Versand an Wunschadresse.',
            sections: [
              section('collectionHero', { headline: 'Geschenke, die nicht nach Restposten aussehen.', subline: 'Wir kombinieren Flaschen, Karte und Verpackung so, dass es persönlich wirkt.', bgImage: img('1558001373-7b93ee48ffa0'), backgroundImage: img('1558001373-7b93ee48ffa0'), overlayColor: '#160A0F', overlayOpacity: 0.58 }, heroTokens),
              section('bentoGrid', { badgeText: 'Optionen', headline: 'Für Gastgeber, Kundinnen und Menschen, die schon alles haben.', items: [{ title: 'Danke-Box', text: 'Zwei Flaschen, Karte, ruhige Verpackung.' }, { title: 'Dinner-Box', text: 'Drei Flaschen passend zu Menü oder Anlass.' }, { title: 'Team-Box', text: 'Mehrere Adressen, einheitliche Qualität.' }, { title: 'Persönliche Notiz', text: 'Auf Wunsch mit kurzem Text von Ihnen.' }] }),
              section('shopFeaturedProducts', { headline: 'Geschenke im Shop', categorySlug: 'geschenke', count: 3, columns: 3, basePath: '/shop' }, creamTokens),
            ],
          },
        },
        {
          title: 'Firmenpakete',
          slug: 'firmenpakete',
          excerpt: 'Kuratierte Weine für Kunden, Teams und Events.',
          data: {
            excerpt: 'Kuratierte Weine für Kunden, Teams und Events.',
            sections: [
              section('collectionHero', { headline: 'Kundengeschenke ohne Werbemittel-Gefühl.', subline: 'Wir stellen Pakete zusammen, die hochwertig wirken und trotzdem unkompliziert bleiben.', bgImage: img('1528823872057-9c018a7a7553'), backgroundImage: img('1528823872057-9c018a7a7553'), overlayColor: '#160A0F', overlayOpacity: 0.6 }, heroTokens),
              section('comparisonTable', { badgeText: 'Vergleich', headline: 'Welches Paket passt?', subline: 'Drei Wege, sauber planbar.', columns: ['Danke', 'Dinner', 'Event'], rows: [{ label: 'Ideal für', values: ['Kundinnen', 'Gastgeber', 'Teams'] }, { label: 'Umfang', values: ['2 Flaschen', '3 Flaschen', 'ab 12 Pakete'] }, { label: 'Karte', values: ['inklusive', 'optional', 'individuell'] }, { label: 'Versand', values: ['einzeln', 'einzeln', 'Sammel- oder Einzelversand'] }] }),
              section('ctaBand', { badgeText: 'Firmenpakete', headline: 'Wir planen Mengen, Versand und Karte mit.', subline: 'Schreiben Sie uns Zielgruppe, Budget und Timing.', ctaPrimary: { label: 'Firmenpaket anfragen', href: '/kontakt', icon: 'Send' } }, ctaTokens),
            ],
          },
        },
      ],
    },
  ],

  pages: [
    {
      slug: '',
      title: 'Startseite',
      seo: {
        metaTitle: 'Vinothek Goldberg München - Wein online kaufen mit Beratung',
        metaDescription: 'Kuratierter Weinshop aus München: Rotwein, Weißwein, Naturwein, Probierpakete und Geschenkboxen mit persönlicher Empfehlung.',
        ogImage: img('1510812431401-41d2bd2722f3'),
      },
      sections: [
        section('cinematicHero', {
          eyebrow: 'Vinothek Goldberg · München',
          headline: 'Wein kaufen, ohne sich durch Etiketten zu kämpfen.',
          subline: 'Wir kuratieren Flaschen, Pakete und Geschenke für Menschen, die guten Wein wollen - aber keine leeren Versprechen.',
          image: img('1510812431401-41d2bd2722f3'),
          bgImage: img('1510812431401-41d2bd2722f3'),
          overlayColor: '#160A0F',
          overlayOpacity: 0.58,
          primaryCta: { label: 'Weine entdecken', href: '/shop' },
          secondaryCta: { label: 'Beratung anfragen', href: '/kontakt' },
          facts: [{ value: '280+', label: 'kuratierte Weine' }, { value: '24h', label: 'versandfertig' }, { value: '4,9/5', label: 'Kundenstimmen' }],
          trustItems: ['sichere Verpackung', 'persönliche Empfehlung', 'ab 79 € versandfrei'],
          trustStripColor: 'rgba(21,16,24,0.58)',
        }, heroTokens),
        section('socialProofBar', { items: [{ icon: 'ShieldCheck', text: 'Bruchsicher verpackt' }, { icon: 'Truck', text: 'Versand in 1-3 Werktagen' }, { icon: 'Sparkles', text: 'Probierpakete kuratiert' }, { icon: 'Gift', text: 'Geschenkboxen mit Karte' }] }, creamTokens),
        section('shopFeaturedProducts', { headline: 'Aktuell besonders gut', mode: 'latest', count: 4, columns: 4, basePath: '/shop' }),
        section('shopCategoryOverview', { headline: 'Weinwelten statt endloser Filter', subline: 'Starten Sie mit einer Kategorie oder einem Anlass. Den Rest sortieren wir sauber im Shop.', columns: 4, basePath: '/shop', shopGridPath: '/shop' }, creamTokens),
        section('textImage', {
          badgeText: 'Unsere Art',
          headline: 'Wir verkaufen nicht alles. Nur das, was wir erklären können.',
          text: '<p>Vinothek Goldberg ist ein kleiner Shop mit echter Auswahl. Jede Flasche wird verkostet, beschrieben und in einen Kontext gesetzt: Essen, Anlass, Temperatur, Geschenk oder Vorrat.</p><p>So bestellen Sie nicht nach schönem Etikett, sondern mit Orientierung. Und wenn etwas unklar ist, schreiben Sie uns kurz.</p>',
          image: img('1556761175-5973dc0f32e7', 1400),
          imageAlt: 'Beratung in der Vinothek',
          primaryCta: { label: 'Mehr über uns', href: '/ueber-uns', icon: 'ArrowRight' },
        }),
        section('featureShowcase', {
          badgeText: 'Shop-Service',
          headline: 'Was im Paket mitgedacht ist.',
          subline: 'Wein muss nicht kompliziert sein. Lieferung, Empfehlung und Verpackung sind Teil der Qualität.',
          features: [
            { icon: 'PackageCheck', title: 'Sichere Verpackung', text: 'Jede Bestellung geht in bruchsicheren Kartons raus.' },
            { icon: 'MessageCircle', title: 'Beratung vor Kauf', text: 'Anlass nennen, konkrete Empfehlung bekommen.' },
            { icon: 'Gift', title: 'Geschenkfähig', text: 'Boxen, Karte und Versand an Wunschadresse.' },
            { icon: 'Wine', title: 'Kuratierte Auswahl', text: 'Keine Regalmeter, sondern klare Weinwelten.' },
          ],
        }),
        section('bentoGrid', {
          badgeText: 'Für wen',
          headline: 'Für Abende, Geschenke und Vorräte mit Plan.',
          subline: 'Wir denken Wein von der Situation aus.',
          items: [
            { title: 'Dinner mit Gästen', text: 'Flaschen, die Essen begleiten, ohne die Runde zu übernehmen.' },
            { title: 'Geschenk gesucht', text: 'Boxen mit Karte, gutem Verhältnis und sauberem Versand.' },
            { title: 'Keller auffüllen', text: 'Alltagsweine und besondere Flaschen getrennt gedacht.' },
            { title: 'Neugierig auf Naturwein', text: 'Charakter, aber kein Fehlerkult.' },
          ],
        }, creamTokens),
        section('timeline', {
          badgeText: 'Bestellweg',
          headline: 'Vom Anlass zur passenden Flasche.',
          steps: [
            { title: 'Kategorie wählen', text: 'Rot, weiß, Naturwein, Geschenk oder Probierpaket.' },
            { title: 'Kurz prüfen', text: 'Beschreibung, Highlights und Speiseidee lesen.' },
            { title: 'Sicher bestellen', text: 'Warenkorb, Checkout, Versandart.' },
            { title: 'Öffnen mit Plan', text: 'Temperatur und Anlass stehen direkt in der Produktbeschreibung.' },
          ],
        }),
        section('statsCounter', { badgeText: 'Zahlen', headline: 'Klein genug für Beratung. Groß genug für Auswahl.', stats: [{ value: 280, suffix: '+', label: 'Weine' }, { value: 42, label: 'Winzerkontakte' }, { value: 24, suffix: 'h', label: 'Versandstart' }, { value: 4.9, suffix: '/5', label: 'Bewertung' }] }, creamTokens),
        section('portfolio', {
          badgeText: 'Anlässe',
          headline: 'So wird bei uns gekauft.',
          items: [
            { title: 'Feierabend-Paket', description: 'Sechs Flaschen, die unkompliziert funktionieren.', image: img('1510812431401-41d2bd2722f3', 1200), href: '/shop?search=Feierabend', meta: [{ label: '6', value: 'Flaschen' }, { label: '59 €', value: 'Paket' }] },
            { title: 'Dinner-Begleitung', description: 'Ein Rotwein, ein Weißwein, ein Start mit Perlage.', image: img('1506377247377-2a5b3b417ebb', 1200), href: '/beratung', meta: [{ label: '3', value: 'Gänge' }, { label: 'klar', value: 'empfohlen' }] },
            { title: 'Danke-Box', description: 'Zwei Flaschen mit Karte und Wunschversand.', image: img('1558001373-7b93ee48ffa0', 1200), href: '/shop?search=Danke', meta: [{ label: '2', value: 'Flaschen' }, { label: 'Karte', value: 'inkl.' }] },
          ],
        }),
        section('testimonials', { headline: 'Ruhig in der Beratung, sicher im Paket.', items: [{ quote: 'Ich habe nur das Menü geschickt und zwei Tage später standen drei perfekte Flaschen da.', author: 'Laura M.', role: 'Dinner in Schwabing' }, { quote: 'Die Geschenkbox wirkte hochwertig, aber nicht übertrieben. Genau richtig für Kundinnen.', author: 'Felix K.', role: 'Agentur München' }, { quote: 'Endlich Naturwein, den ich nicht erklären musste.', author: 'Miriam S.', role: 'Stammkundin' }] }, creamTokens),
        section('faq', { headline: 'Häufige Fragen vor der ersten Bestellung', items: [{ question: 'Versenden Sie deutschlandweit?', answer: 'Ja. Wir versenden bruchsicher innerhalb Deutschlands. Ab 79 € ist der Versand kostenlos.' }, { question: 'Kann ich mich vor dem Kauf beraten lassen?', answer: 'Ja. Schreiben Sie Anlass, Budget und Geschmack. Wir antworten mit konkreten Flaschen.' }, { question: 'Kann ich Geschenkboxen direkt an Empfänger senden?', answer: 'Ja, inklusive Karte und optionaler persönlicher Nachricht.' }, { question: 'Sind die Produkte auch in München abholbar?', answer: 'Ja. Abholung in Haidhausen ist während der Öffnungszeiten möglich.' }] }),
        section('ctaBand', { badgeText: 'Jetzt auswählen', headline: 'Guter Wein beginnt mit einer klaren Empfehlung.', subline: 'Starten Sie im Shop oder schreiben Sie uns, wenn der Anlass wichtiger ist als die Kategorie.', ctaPrimary: { label: 'Zum Shop', href: '/shop', icon: 'ShoppingBag' }, ctaSecondary: { label: 'Beratung anfragen', href: '/kontakt', icon: 'Send' } }, ctaTokens),
      ],
    },
    {
      slug: 'shop',
      title: 'Shop',
      seo: { metaTitle: 'Weinshop München - Vinothek Goldberg', metaDescription: 'Rotwein, Weißwein, Rosé, Naturwein, Probierpakete und Geschenkboxen online kaufen.' },
      sections: [
        section('hero', { badgeText: 'Shop', headline: 'Alle Flaschen, sauber kuratiert.', subline: 'Filtern, suchen, auswählen - oder direkt fragen, wenn Anlass und Geschmack wichtiger sind als Kategorie.', bgImage: img('1510812431401-41d2bd2722f3'), backgroundImage: img('1510812431401-41d2bd2722f3'), overlayColor: '#160A0F', overlayOpacity: 0.62, primaryCta: { label: 'Kategorien ansehen', href: '/kategorien' }, secondaryCta: { label: 'Beratung anfragen', href: '/kontakt' }, trustItems: ['ab 79 € versandfrei', 'bruchsicher verpackt', 'persönlich kuratiert'], trustStripColor: 'rgba(21,16,24,0.58)' }, heroTokens),
        section('shopProductGrid', { headline: 'Weine, Pakete und Geschenkboxen', showSearch: true, showCategories: true, columns: 3, basePath: '/shop' }),
        section('ctaBand', { badgeText: 'Nicht sicher?', headline: 'Schreiben Sie uns Anlass und Budget.', subline: 'Wir empfehlen wenige passende Flaschen statt einer langen Liste.', ctaPrimary: { label: 'Beratung anfragen', href: '/kontakt', icon: 'Send' } }, ctaTokens),
      ],
    },
    {
      slug: 'kategorien',
      title: 'Kategorien',
      sections: [
        section('glowHero', { eyebrow: 'Weinwelten', headline: 'Der schnellste Weg zur richtigen Flasche.', subline: 'Kategorien helfen, aber sie ersetzen keine Beratung. Darum sind unsere Produkttexte kurz, klar und verwendbar.', glowColor: '#D9B46B', primaryCta: { label: 'Alle Weine ansehen', href: '/shop' }, secondaryCta: { label: 'Frage stellen', href: '/kontakt' } }, creamTokens),
        section('shopCategoryOverview', { headline: 'Kategorien im Überblick', subline: 'Von Rotwein bis Geschenkbox: jedes Sortiment ist klein genug, um kuratiert zu bleiben.', columns: 3, basePath: '/shop', shopGridPath: '/shop' }),
        section('comparisonCardsPro', { badgeText: 'Orientierung', headline: 'Wenn Sie nur wissen, was passieren soll.', subline: 'Drei einfache Wege zur Auswahl.', cards: [{ title: 'Essen begleiten', text: 'Gericht, Personenzahl und Stimmung reichen für eine Empfehlung.', metric: 'Dinner' }, { title: 'Sicher schenken', text: 'Boxen mit Karte, Versand und Flaschen, die nicht beliebig wirken.', metric: 'Gift' }, { title: 'Neues probieren', text: 'Probierpakete mit klarer Dramaturgie statt Zufallskarton.', metric: 'Taste' }] }, creamTokens),
        section('faq', { headline: 'Kategorie-Fragen', items: [{ question: 'Was ist der Unterschied zwischen Naturwein und Bio?', answer: 'Bio beschreibt den Anbau. Naturwein beschreibt zusätzlich oft Kellerarbeit, Eingriffe und Stil. Wir erklären das produktbezogen.' }, { question: 'Kann ich nach Essen auswählen?', answer: 'Ja. Schreiben Sie uns das Menü oder nutzen Sie die Hinweise in den Produkttexten.' }, { question: 'Gibt es alkoholfreie Alternativen?', answer: 'Auf Anfrage führen wir alkoholfreie Empfehlungen für Geschenk- und Eventpakete.' }, { question: 'Sind Pakete günstiger?', answer: 'Pakete sind nicht Restposten, sondern kuratiert. Der Preis ist fair gebündelt, nicht aggressiv rabattiert.' }] }),
        section('ctaBand', { badgeText: 'Shop', headline: 'Erst Kategorie, dann Flasche.', subline: 'Oder direkt beraten lassen, wenn die Situation wichtiger ist als das Regal.', ctaPrimary: { label: 'Zum Shop', href: '/shop', icon: 'ShoppingBag' } }, ctaTokens),
      ],
    },
    {
      slug: 'leistungen',
      title: 'Services',
      sections: [
        section('editorialHero', { eyebrow: 'Services', headline: 'Service, der Wein einfacher macht.', text: '<p>Beratung, Geschenkboxen und Firmenpakete — alles so geplant, dass Auswahl nicht zur Aufgabe wird.</p>', imagePrimary: img('1556761175-5973dc0f32e7'), primaryCta: { label: 'Beratung anfragen', href: '/kontakt' }, secondaryCta: { label: 'Zum Shop', href: '/shop' } }),
        section('servicesGrid', { badgeText: 'Services', headline: 'Wobei wir helfen', subline: 'Vom einzelnen Geschenk bis zum Firmenversand.', manualCards: [{ title: 'Persönliche Weinberatung', text: 'Für Essen, Geschenk, Firmenevent oder den eigenen Vorrat.', icon: 'MessageCircle', href: '/c/leistungen/weinberatung' }, { title: 'Geschenkboxen', text: 'Weinboxen mit Karte, Auswahl und Versand an Wunschadresse.', icon: 'Gift', href: '/c/leistungen/geschenkboxen' }, { title: 'Firmenpakete', text: 'Kuratierte Weine für Kunden, Teams und Events.', icon: 'Briefcase', href: '/c/leistungen/firmenpakete' }, { title: 'Shop-Auswahl', text: 'Kategorien, Produkttexte und Probierpakete für schnelle Orientierung.', icon: 'ShoppingBag', href: '/shop' }] }),
        section('collectionList', { headline: 'Services im Detail', subline: 'Jeder Service hat eine eigene Detailseite mit Ablauf und nächstem Schritt.', collectionKey: 'leistungen', sortBy: 'priority', columns: 3, showImage: false, showDate: false, showExcerpt: true, showSortControls: false }, creamTokens),
        section('processSteps', { badgeText: 'Ablauf', headline: 'So arbeiten wir mit Anfragen.', steps: [{ title: 'Kurzbriefing', text: 'Anlass, Menge, Budget und Timing.' }, { title: 'Auswahl', text: 'Wenige passende Optionen statt langer Liste.' }, { title: 'Freigabe', text: 'Sie entscheiden, wir stellen zusammen.' }, { title: 'Versand', text: 'Bruchsicher, nachvollziehbar und sauber dokumentiert.' }] }, creamTokens),
        section('faq', { headline: 'Service-Fragen', items: [{ question: 'Kann ich nur kurz fragen?', answer: 'Ja, gerade dafür ist die Beratung gedacht.' }, { question: 'Gibt es Mindestmengen?', answer: 'Für normale Beratung nein. Firmenpakete planen wir je nach Umfang.' }, { question: 'Können Sie direkt an mehrere Adressen senden?', answer: 'Ja, für Firmenpakete nach vorheriger Abstimmung.' }, { question: 'Kann ich auch alles selbst im Shop bestellen?', answer: 'Ja. Die Services sind optional, der Shop bleibt direkt nutzbar.' }] }),
        section('immersiveCtaBanner', { badge: 'Services', headline: 'Wenn der Shop nicht alles beantworten soll.', subline: 'Schreiben Sie uns kurz, worum es geht. Wir melden uns mit einer konkreten Empfehlung.', image: img('1556761175-5973dc0f32e7'), overlay: 'rgba(22,10,15,0.62)', primaryCta: { label: 'Service anfragen', href: '/kontakt' } }),
      ],
    },
    {
      slug: 'beratung',
      title: 'Beratung',
      sections: [
        section('editorialHero', { eyebrow: 'Beratung', headline: 'Weinberatung ohne Vortrag.', text: '<p>Sie brauchen keine Fachbegriffe. Anlass, Essen, Budget und Stimmung reichen.</p>', imagePrimary: img('1556761175-5973dc0f32e7'), primaryCta: { label: 'Beratung anfragen', href: '/kontakt' }, hint: 'Antwort in der Regel am selben Tag.' }),
        section('servicesGrid', { badgeText: 'Services', headline: 'Wobei wir helfen', subline: 'Alles, was eine gute Auswahl ruhiger macht.', manualCards: [{ title: 'Dinner-Weine', text: 'Flaschen passend zu Menü, Gästen und Budget.', icon: 'Utensils', href: '/c/leistungen/weinberatung' }, { title: 'Geschenkboxen', text: 'Persönliche Boxen mit Karte und Versand.', icon: 'Gift', href: '/c/leistungen/geschenkboxen' }, { title: 'Firmenpakete', text: 'Kundengeschenke und Team-Pakete sauber geplant.', icon: 'Briefcase', href: '/c/leistungen/firmenpakete' }, { title: 'Vorrat aufbauen', text: 'Alltagsweine und besondere Flaschen getrennt denken.', icon: 'Boxes', href: '/shop' }] }),
        section('processSteps', { badgeText: 'Ablauf', headline: 'Vier Fragen statt Fachchinesisch.', steps: [{ title: 'Anlass', text: 'Essen, Geschenk, Feier oder Vorrat.' }, { title: 'Budget', text: 'Realistisch pro Flasche oder Paket.' }, { title: 'Geschmack', text: 'Was hat bisher funktioniert - und was nicht?' }, { title: 'Empfehlung', text: 'Konkrete Flaschen mit kurzer Begründung.' }] }, creamTokens),
        section('comparisonTable', { badgeText: 'Formate', headline: 'Welche Beratung passt?', subline: 'Klein anfangen, sauber auswählen.', columns: ['Kurz', 'Dinner', 'Firmenpaket'], rows: [{ label: 'Dauer', values: ['10 Min.', '20 Min.', 'nach Umfang'] }, { label: 'Ideal für', values: ['ein Geschenk', 'ein Menü', 'viele Adressen'] }, { label: 'Ergebnis', values: ['2-3 Flaschen', '3-5 Flaschen', 'Paketliste'] }, { label: 'Kosten', values: ['kostenfrei', 'kostenfrei', 'nach Aufwand'] }] }),
        section('immersiveCtaBanner', { badge: 'Beratung starten', headline: 'Schreiben Sie uns, was geplant ist.', subline: 'Wir antworten konkret und ohne Verkaufsdruck.', image: img('1558001373-7b93ee48ffa0'), overlay: 'rgba(22,10,15,0.62)', primaryCta: { label: 'Nachricht senden', href: '/kontakt' } }),
        section('faq', { headline: 'Beratungsfragen', items: [{ question: 'Muss ich Weinwissen haben?', answer: 'Nein. Alltagssprache reicht völlig.' }, { question: 'Kostet die Beratung?', answer: 'Kurze Empfehlungen sind kostenlos. Größere Firmenpakete kalkulieren wir transparent.' }, { question: 'Kann ich danach online bestellen?', answer: 'Ja. Wir senden passende Links oder legen Pakete im Shop an.' }, { question: 'Kann ich vor Ort abholen?', answer: 'Ja, in München-Haidhausen.' }] }),
      ],
    },
    {
      slug: 'ueber-uns',
      title: 'Über uns',
      sections: [
        section('editorialHero', { eyebrow: 'Über uns', headline: 'Eine Vinothek, die online nicht anonym wird.', text: '<p>Goldberg steht für kleine Auswahl, klare Sprache und Flaschen, die wir selbst öffnen würden.</p>', imagePrimary: img('1528823872057-9c018a7a7553'), imageSecondary: img('1510812431401-41d2bd2722f3'), primaryCta: { label: 'Weine entdecken', href: '/shop' } }),
        section('textImage', { badgeText: 'Haidhausen', headline: 'Aus einer Ladenberatung wurde ein Shop mit Haltung.', text: '<p>Unsere Vinothek liegt in München-Haidhausen. Viele Bestellungen beginnen bis heute mit einer kurzen Frage im Laden: Was passt zu diesem Abend?</p><p>Genau diese Beratung übersetzen wir online. Produkttexte sind kurz, Empfehlungen konkret und das Sortiment bleibt bewusst kuratiert.</p>', image: img('1556761175-5973dc0f32e7', 1400), imageAlt: 'Team der Vinothek Goldberg' }),
        section('timeline', { badgeText: 'Geschichte', headline: 'Nicht groß geworden, sondern genauer.', steps: [{ title: '1998', text: 'Erste kleine Vinothek nahe Wiener Platz.' }, { title: '2012', text: 'Direkte Winzerkontakte in Italien, Frankreich und Österreich.' }, { title: '2020', text: 'Online-Bestellungen mit persönlicher Beratung.' }, { title: 'Heute', text: 'Shop, Geschenkboxen und Firmenpakete aus einem System.' }] }, creamTokens),
        section('team', { headline: 'Menschen hinter der Auswahl', members: [{ name: 'Katrin Goldberg', role: 'Beratung & Geschenkboxen', bio: 'Fragt zuerst nach Anlass und erst danach nach Traube.', image: img('1494790108377-be9c29b29330', 900) }, { name: 'Thomas Goldberg', role: 'Einkauf & Winzerkontakte', bio: 'Sucht Weine, die Charakter haben und trotzdem trinkbar bleiben.', image: img('1500648767791-00dcc994a43e', 900) }, { name: 'Mira Hoffmann', role: 'Shop & Versand', bio: 'Sorgt dafür, dass Flaschen heil, schnell und gut beschrieben ankommen.', image: img('1438761681033-6461ffad8d80', 900) }] }),
        section('principlesGrid', { badge: 'Haltung', headline: 'Was uns wichtig ist', subline: 'Gute Auswahl ist Arbeit vor dem Klick.', principles: [{ eyebrow: '01', title: 'Klein halten', text: 'Lieber 280 gute Flaschen als 2.800 austauschbare.' }, { eyebrow: '02', title: 'Ehrlich beschreiben', text: 'Kein Etikettenpoem, sondern Geschmack, Anlass und Essen.' }, { eyebrow: '03', title: 'Sicher versenden', text: 'Verpackung ist Teil des Produkts.' }, { eyebrow: '04', title: 'Beratung anbieten', text: 'Wenn der Shop nicht reicht, antworten Menschen.' }] }, creamTokens),
        section('immersiveCtaBanner', { badge: 'Shop besuchen', headline: 'Genug über uns. Es geht um Ihren Abend.', subline: 'Stöbern Sie durch die Kategorien oder fragen Sie direkt nach einer Empfehlung.', image: img('1528823872057-9c018a7a7553'), overlay: 'rgba(22,10,15,0.62)', primaryCta: { label: 'Weine entdecken', href: '/shop' } }),
      ],
    },
    {
      slug: 'versand',
      title: 'Versand',
      sections: [
        section('cinematicHero', { eyebrow: 'Versand', headline: 'Wein muss heil ankommen.', subline: 'Darum behandeln wir Versand nicht als Nachsatz.', image: img('1510812431401-41d2bd2722f3'), overlay: 'rgba(22,10,15,0.6)', align: 'left', primaryCta: { label: 'Zum Shop', href: '/shop' }, facts: [ { value: '48h', label: 'Versandzeit' }, { value: '0 €', label: 'ab 6 Flaschen' }, { value: '100%', label: 'Bruchschutz' } ] }),
        section('featureShowcase', { badgeText: 'Versand', headline: 'Was im Paket passiert', features: [{ icon: 'PackageCheck', title: 'Bruchsichere Kartons', text: 'Flaschen sitzen fest und getrennt.' }, { icon: 'Truck', title: '1-3 Werktage', text: 'Bestellungen verlassen uns meist am Folgetag.' }, { icon: 'Thermometer', title: 'Wetter im Blick', text: 'Bei Hitze oder Frost melden wir uns lieber kurz.' }, { icon: 'Gift', title: 'Geschenkversand', text: 'Direkt an Wunschadresse mit Karte.' }] }),
        section('comparisonTable', { badgeText: 'Kosten', headline: 'Versand auf einen Blick', columns: ['Deutschland', 'Abholung', 'Geschenk'], rows: [{ label: 'Preis', values: ['5,90 €', 'kostenfrei', '5,90 €'] }, { label: 'Kostenfrei ab', values: ['79 €', 'immer', '79 €'] }, { label: 'Dauer', values: ['1-3 Werktage', 'abholbereit', '1-3 Werktage'] }, { label: 'Hinweis', values: ['DHL', 'Haidhausen', 'Karte möglich'] }] }, creamTokens),
        section('faq', { headline: 'Versandfragen', items: [{ question: 'Wie wird verpackt?', answer: 'In zertifizierten Flaschenkartons mit stabilen Einsätzen.' }, { question: 'Kann ich an eine andere Adresse senden?', answer: 'Ja, besonders bei Geschenkboxen.' }, { question: 'Versenden Sie ins Ausland?', answer: 'Aktuell auf Anfrage.' }, { question: 'Was passiert bei Bruch?', answer: 'Melden Sie sich mit Foto. Wir kümmern uns schnell um Ersatz.' }] }),
        section('ctaBand', { badgeText: 'Lieferung', headline: 'Sie bestellen. Wir packen so, als wäre es unsere eigene Flasche.', subline: 'Sicher, nachvollziehbar und ohne unnötige Umverpackung.', ctaPrimary: { label: 'Zum Shop', href: '/shop', icon: 'ShoppingBag' } }, ctaTokens),
      ],
    },
    {
      slug: 'news',
      title: 'Journal',
      sections: [
        section('collectionHero', { headline: 'Notizen aus der Vinothek.', subline: 'Kurze Texte zu Wein, Geschenken und Entscheidungen, die Auswahl leichter machen.', bgImage: img('1506377247377-2a5b3b417ebb'), backgroundImage: img('1506377247377-2a5b3b417ebb'), overlayColor: '#160A0F', overlayOpacity: 0.6 }, heroTokens),
        section('newsGrid', { headline: 'Aktuelle Beiträge', collectionKey: 'news', limit: 6, columns: 3 }),
        section('ctaBand', { badgeText: 'Frage statt Suche', headline: 'Wenn der passende Beitrag fehlt, schreiben Sie uns.', subline: 'Wir antworten konkret auf Anlass, Essen und Budget.', ctaPrimary: { label: 'Kontakt aufnehmen', href: '/kontakt', icon: 'Send' } }, ctaTokens),
      ],
    },
    {
      slug: 'kontakt',
      title: 'Kontakt',
      sections: [
        section('collectionHero', { headline: 'Kurze Frage, klare Empfehlung.', subline: 'Schreiben Sie uns Anlass, Budget und Geschmack. Wir melden uns persönlich.', bgImage: img('1556761175-5973dc0f32e7'), backgroundImage: img('1556761175-5973dc0f32e7'), overlayColor: '#160A0F', overlayOpacity: 0.6 }, heroTokens),
        section('contact', { badgeText: 'Kontakt', headline: 'Vinothek Goldberg in München-Haidhausen', introText: 'Online bestellen, vor Ort abholen oder kurz beraten lassen.', submitLabel: 'Nachricht senden', showMap: true }),
        section('additionalLocations', { badgeText: 'Abholung', headline: 'Abholen oder liefern lassen', locations: [{ name: 'Vinothek Haidhausen', address: 'Preysingstraße 14, 81667 München', phone: '+49 89 2154 7080', email: 'beratung@vinothek-goldberg.de', note: 'Abholung während der Öffnungszeiten.' }] }, creamTokens),
        section('faq', { headline: 'Kontaktfragen', items: [{ question: 'Wie schnell antworten Sie?', answer: 'Meist am selben Werktag.' }, { question: 'Kann ich spontan vorbeikommen?', answer: 'Ja, während der Öffnungszeiten.' }, { question: 'Kann ich eine Bestellung telefonisch aufgeben?', answer: 'Ja, besonders bei Geschenk- und Firmenpaketen.' }, { question: 'Gibt es Beratung per WhatsApp?', answer: 'Ja, kurze Anfragen beantworten wir auch dort.' }] }),
      ],
    },
    {
      slug: 'warenkorb',
      title: 'Warenkorb',
      sections: [
        section('shopCart', { headline: 'Ihr Warenkorb', emptyText: 'Ihr Warenkorb ist noch leer.', continueShoppingLabel: 'Weiter einkaufen', checkoutLabel: 'Zur Kasse', checkoutPath: '/checkout', continueShoppingPath: '/shop' }, creamTokens),
      ],
    },
    {
      slug: 'checkout',
      title: 'Checkout',
      sections: [
        section('shopCheckout', { headline: 'Sicher bestellen', thankYouPath: '/danke', requirePhone: false, showCompanyField: false }, creamTokens),
      ],
    },
    {
      slug: 'danke',
      title: 'Danke',
      sections: [
        section('shopThankYou', { headline: 'Danke für Ihre Bestellung.', subline: 'Wir prüfen die Bestellung, packen bruchsicher und senden die nächsten Informationen per E-Mail.', orderNumberLabel: 'Bestellnummer', continueShoppingPath: '/shop', ctaLabel: 'Weiter einkaufen' }, creamTokens),
      ],
    },
    {
      slug: 'agb',
      title: 'AGB',
      sections: [
        section('legalContent', { headline: 'Allgemeine Geschäftsbedingungen', content: '<p>Diese Demo-AGB zeigen, wie rechtliche Inhalte im Flamingo CMS gepflegt werden können. Für echte Shops müssen AGB, Widerruf, Versand, Zahlung und Datenschutz juristisch geprüft werden.</p><h2>Bestellung</h2><p>Produkte werden über den Shop ausgewählt und im Checkout bestellt. Preise verstehen sich inklusive gesetzlicher Mehrwertsteuer.</p><h2>Lieferung</h2><p>Die Lieferung erfolgt bruchsicher verpackt an die angegebene Adresse.</p>' }),
      ],
    },
    {
      slug: 'widerruf',
      title: 'Widerruf',
      sections: [
        section('legalContent', { headline: 'Widerrufsbelehrung', content: '<p>Diese Demo-Widerrufsbelehrung ist ein Platzhalter. Für den Live-Betrieb muss die rechtliche Prüfung durch geeignete Fachstellen erfolgen.</p><p>Kundinnen und Kunden können Bestellungen nach Maßgabe der gesetzlichen Regelungen widerrufen, sofern kein Ausschlussgrund vorliegt.</p>' }),
      ],
    },
    {
      slug: 'impressum',
      title: 'Impressum',
      sections: [
        section('legalContent', { headline: 'Impressum', content: '<p>Vinothek Goldberg GmbH<br>Preysingstraße 14<br>81667 München</p><p>Telefon: +49 89 2154 7080<br>E-Mail: beratung@vinothek-goldberg.de</p><p>Vertreten durch: Katrin Goldberg und Thomas Goldberg<br>Umsatzsteuer-ID: DE123456789</p><p>Dies ist ein Demo-Impressum und muss für echte Projekte rechtlich geprüft werden.</p>' }),
      ],
    },
    {
      slug: 'datenschutz',
      title: 'Datenschutz',
      sections: [
        section('legalContent', { headline: 'Datenschutzerklärung', content: '<p>Wir verarbeiten personenbezogene Daten zur Bearbeitung von Bestellungen, Anfragen und Versandprozessen. Dazu gehören Kontakt-, Liefer- und Zahlungsdaten.</p><h2>Kontaktformular</h2><p>Angaben aus dem Formular werden ausschließlich zur Bearbeitung der Anfrage genutzt.</p><h2>Shop</h2><p>Bestell- und Zahlungsdaten werden verarbeitet, soweit dies zur Abwicklung der Bestellung erforderlich ist.</p><p>Dies ist ein Demo-Text und ersetzt keine rechtliche Prüfung.</p>' }),
      ],
    },
  ],

  postRun: async (api) => {
    const safeDelete = async (path) => {
      try { await api.request('DELETE', path); } catch (e) { console.log('[ecommerce] warn delete', path, e.message); }
    };

    const existingProducts = await api.request('GET', '/api/v1/shop/products');
    for (const product of existingProducts.products || []) {
      await safeDelete(`/api/v1/shop/products/${product.id}`);
    }

    const existingCategories = await api.request('GET', '/api/v1/shop/categories');
    for (const category of existingCategories.categories || []) {
      await safeDelete(`/api/v1/shop/categories/${category.id}`);
    }

    const categoryIds = new Map();
    for (const category of categories) {
      const res = await api.request('POST', '/api/v1/shop/categories', category);
      const created = res.category || res;
      categoryIds.set(category.slug, created.id);
    }

    for (const product of products) {
      const { category, ...body } = product;
      await api.request('POST', '/api/v1/shop/products', {
        ...body,
        categoryId: categoryIds.get(category),
        status: 'active',
      });
    }

    await api.request('PUT', '/api/v1/shop/settings', {
      currency: 'EUR',
      paymentMethods: ['stripe', 'paypal', 'bank_transfer'],
      pickupEnabled: true,
      pickupInstructions: 'Abholung in der Vinothek Goldberg, Preysingstraße 14, 81667 München. Bitte warten Sie auf die Abholbestätigung per E-Mail.',
      notificationEmail: 'beratung@vinothek-goldberg.de',
      orderPrefix: 'VG',
      invoicePrefix: 'VG-R',
      lowStockThreshold: 6,
      companyInfo: 'Vinothek Goldberg GmbH, Preysingstraße 14, 81667 München',
      bankDetails: 'Demo-Bankverbindung: Flamingo Bank, IBAN DE00 0000 0000 0000 0000 00',
    });

    const shipping = await api.request('GET', '/api/v1/shop/shipping');
    const hasGermany = (shipping.zones || []).some((zone) => zone.name === 'Deutschland');
    if (!hasGermany) {
      await api.request('POST', '/api/v1/shop/shipping', {
        name: 'Deutschland',
        countries: ['DE'],
        methods: [
          { name: 'Standardversand', priceCents: 590, freeAboveCents: 7900, estimatedDays: '1-3 Werktage' },
          { name: 'Abholung Vinothek', priceCents: 0, estimatedDays: 'abholbereit nach Bestätigung' },
        ],
      });
    }
  },
};

module.exports = tenant;
if (require.main === module) {
  run(tenant).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
