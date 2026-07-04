/**
 * Demo tenant: REALESTATE
 *
 * Identität: "Stadtkante Immobilien" - inhabergeführtes Maklerbüro in Nürnberg.
 * Fokus: Verkauf, Bewertung und Kaufberatung für Stadtwohnungen, Altbau und
 * familienfreundliche Häuser im Nürnberger Norden.
 *
 * Tonalität: ruhig, präzise, lokal. Keine Luxusfloskeln, keine Portal-Rhetorik.
 * Bildwelt: Stadtfassaden, Altbau, helle Wohnungen, Straßenzüge, Beratung.
 *
 * Run:
 *   node scripts/demo-tenants/realestate.cjs
 */

const crypto = require('crypto');
const { run } = require('./_lib/runner.cjs');
const { darkTokens } = require('./_lib/theme.cjs');

const PAT = '6ef04ab718a41192d1eac3b1c3b4d523a2561463927a77861f85a745e251c485';

const uuid = () => crypto.randomUUID();
const img = (id, w = 1920) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;
const p = (text) => `<p>${text}</p>`;

const C = {
  ink: '#122033',
  body: '#344256',
  muted: '#66758A',
  paper: '#FBF7EF',
  mist: '#EDF3F4',
  card: '#FFFFFF',
  line: '#DCE4E5',
  teal: '#0E5964',
  brass: '#B7833B',
  clay: '#D6B896',
  night: '#10212A',
};

const lightTokens = {
  '--token-section-bg': '#FFFFFF',
  '--token-section-bg-alt': C.mist,
  '--token-card-bg': C.card,
  '--token-card-border': C.line,
  '--token-heading': C.ink,
  '--token-body': C.body,
  '--token-muted': C.muted,
  '--token-subheading': C.body,
  '--token-eyebrow': C.brass,
  '--token-icon': C.teal,
  '--token-accent': C.brass,
  '--token-btn-bg': C.teal,
  '--token-btn-text': '#FFFFFF',
  '--token-badge-bg': '#EEF7F8',
  '--token-badge-text': C.teal,
  '--token-badge-border': '#C9DEE1',
  '--token-stat-value': C.teal,
  '--token-rating-star': C.brass,
  '--token-check': C.teal,
};

const softTokens = {
  ...lightTokens,
  '--token-section-bg': C.paper,
  '--token-section-bg-alt': C.paper,
  '--token-card-bg': '#FFFCF7',
  '--token-card-border': '#E6D9C6',
  '--token-badge-bg': '#F3E6D5',
  '--token-badge-text': '#744C1C',
  '--token-badge-border': '#DEC39A',
};

const mistTokens = {
  ...lightTokens,
  '--token-section-bg': C.mist,
  '--token-section-bg-alt': C.mist,
  '--token-card-bg': '#FFFFFF',
  '--token-card-border': '#D6E2E4',
};

const imageTokens = {
  ...darkTokens({ accent: '#F4C875' }),
  '--token-heading': '#FFFFFF',
  '--token-body': 'rgba(255,255,255,0.92)',
  '--token-muted': 'rgba(255,255,255,0.74)',
  '--token-subheading': 'rgba(255,255,255,0.88)',
  '--token-eyebrow': '#F1C985',
  '--token-on-dark-heading': '#FFFFFF',
  '--token-on-dark-body': 'rgba(255,255,255,0.92)',
  '--token-on-dark-muted': 'rgba(255,255,255,0.74)',
  '--token-card-bg': '#182F3A',
  '--token-card-border': 'rgba(255,255,255,0.26)',
  '--token-btn-bg': '#F4C875',
  '--token-btn-text': C.night,
  '--token-badge-bg': 'rgba(255,255,255,0.14)',
  '--token-badge-text': '#FFFFFF',
  '--token-badge-border': 'rgba(255,255,255,0.32)',
  '--token-icon': '#F4C875',
  '--token-accent': '#F4C875',
  '--token-stat-value': '#FFFFFF',
};

const darkSolidTokens = {
  ...darkTokens({ accent: '#F4C875' }),
  ...imageTokens,
  '--token-section-bg': C.night,
  '--token-section-bg-alt': C.night,
  '--token-card-bg': '#182F3A',
  '--token-card-border': 'rgba(255,255,255,0.18)',
};

function pageSeo(title, description, image) {
  return { metaTitle: title, metaDescription: description, ogImage: image };
}

function collectionHeroData({ category, headline, subline, bgImage }) {
  return {
    category,
    headline,
    subline,
    bgImage,
    overlayOpacity: 0.72,
    primaryCta: { label: 'Gespräch anfragen', href: '/kontakt' },
    secondaryCta: { label: 'Referenzen ansehen', href: '/referenzen' },
    imageEffect: 'parallax',
  };
}

function ctaBand(headline, subline, label, href, overrides = softTokens) {
  return {
    type: 'ctaBand',
    data: {
      badgeText: 'Direkt klären',
      headline,
      subline,
      ctaPrimary: { label, href, icon: 'ArrowRight' },
    },
    styleOverrides: {
      ...overrides,
      '--token-section-bg': overrides['--token-section-bg'] || C.paper,
      '--token-heading': overrides['--token-heading'] || C.ink,
      '--token-body': overrides['--token-body'] || C.body,
      '--token-btn-bg': overrides['--token-btn-bg'] || C.teal,
      '--token-btn-text': overrides['--token-btn-text'] || '#FFFFFF',
    },
  };
}

const propertyCards = [
  {
    title: 'Altbauwohnung am Stadtpark',
    price: '740.000 €',
    size: '118 m²',
    rooms: '4',
    location: 'Nürnberg-Nordstadt',
    image: img('1600585154340-be6161a56a0c'),
    href: '/c/objekte/altbauwohnung-stadtpark',
    badge: 'neu geprüft',
  },
  {
    title: 'Stadthaus mit Hofgarten',
    price: '1.120.000 €',
    size: '162 m²',
    rooms: '5',
    location: 'Erlenstegen',
    image: img('1564013799919-ab600027ffc6'),
    href: '/c/objekte/stadthaus-erlenstegen',
    badge: 'familie',
  },
  {
    title: 'Dachgeschoss mit Weitblick',
    price: '620.000 €',
    size: '92 m²',
    rooms: '3',
    location: 'Gostenhof',
    image: img('1505693416388-ac5ce068fe85'),
    href: '/c/objekte/dachgeschoss-gostenhof',
    badge: 'reserviert',
  },
];

const soldProperties = [
  { title: 'Maisonette am Archivpark', location: 'Nürnberg-Nordstadt', price: 'verkauft', soldIn: '31 Tagen', image: img('1494526585095-c41746248156') },
  { title: 'Reihenhaus in Zabo', location: 'Zerzabelshof', price: 'verkauft', soldIn: '24 Tagen', image: img('1570129477492-45c003edd2be') },
  { title: 'Loft am Plärrer', location: 'Gostenhof', price: 'verkauft', soldIn: '19 Tagen', image: img('1522708323590-d24dbb6b0267') },
  { title: 'Gartenwohnung am Wöhrder See', location: 'St. Jobst', price: 'verkauft', soldIn: '28 Tagen', image: img('1560448204-e02f11c3d0e2') },
];

const agents = [
  { name: 'Clara Seidel', role: 'Inhaberin & Verkauf', image: img('1494790108377-be9c29b29330', 900), specialization: 'Altbau, Eigentümerberatung, Preisstrategie', phone: '+49 911 2388410', email: 'clara@stadtkante-immobilien.de', soldCount: '148 Verkäufe' },
  { name: 'Jonas Merz', role: 'Bewertung & Marktanalyse', image: img('1500648767791-00dcc994a43e', 900), specialization: 'Kaufpreisprüfung, Mikrolagen, Renditeobjekte', phone: '+49 911 2388412', email: 'jonas@stadtkante-immobilien.de', soldCount: '12 Stadtteile' },
  { name: 'Mira Hoffmann', role: 'Exposé & Besichtigungen', image: img('1544005313-94ddf0286df2', 900), specialization: 'Inszenierung, Fotoplanung, Käuferkommunikation', phone: '+49 911 2388414', email: 'mira@stadtkante-immobilien.de', soldCount: '420 Termine' },
];

const faqs = [
  { question: 'Arbeiten Sie nur in Nürnberg?', answer: 'Unser Schwerpunkt liegt auf Nürnberg, Fürth und Erlangen. Bei passenden Objekten übernehmen wir auch angrenzende Lagen, wenn wir den Markt sauber einschätzen können.' },
  { question: 'Was kostet eine erste Einschätzung?', answer: 'Das Erstgespräch ist kostenlos. Eine fundierte Bewertung erstellen wir nach Sichtung von Unterlagen, Lage, Zustand und Vergleichsdaten.' },
  { question: 'Muss ich sofort verkaufen?', answer: 'Nein. Viele Eigentümerinnen und Eigentümer sprechen früh mit uns, um Optionen zu verstehen. Eine gute Entscheidung braucht keinen Druck.' },
  { question: 'Wie werden Besichtigungen gesteuert?', answer: 'Wir qualifizieren Anfragen vor, bündeln Termine sinnvoll und geben Ihnen danach klare Rückmeldung statt loser Besuchslisten.' },
];

const contactCards = [
  { icon: 'Phone', label: 'Telefon', value: '+49 911 2388410' },
  { icon: 'Mail', label: 'E-Mail', value: 'hallo@stadtkante-immobilien.de' },
  { icon: 'MapPin', label: 'Büro', value: 'Pilotystraße 12, 90408 Nürnberg' },
  { icon: 'Clock', label: 'Termine', value: 'Mo-Fr 9:00-18:00, Beratung nach Vereinbarung' },
];

function marketStats() {
  return [
    { label: 'Ø Vermarktung', value: '34 Tage', trend: 'stabil' },
    { label: 'Nordstadt', value: '+2,8 %', trend: 'nachgefragt' },
    { label: 'Käuferprüfung', value: '100 %', trend: 'vor Termin' },
    { label: 'Preisabweichung', value: '3,1 %', trend: 'sauber' },
  ];
}

function homeSections() {
  return [
    {
      type: 'glowHero',
      data: {
        eyebrow: 'Immobilien in Nürnberg',
        headline: 'Verkaufen, ohne den Überblick zu verlieren.',
        subline: 'Stadtkante Immobilien begleitet Eigentümerinnen und Käufer mit klarer Bewertung, ruhiger Vermarktung und ehrlicher Einordnung der Nürnberger Mikrolagen.',
        image: img('1486406146926-c627a92ad1ab'),
        glowColor: 'rgba(183,131,59,0.42)',
        primaryCta: { label: 'Immobilie bewerten', href: '/bewertung' },
        secondaryCta: { label: 'Objekte ansehen', href: '/kaufen' },
        facts: [
          { value: '148+', label: 'Verkäufe begleitet' },
          { value: '34 Tage', label: 'Ø Vermarktung' },
          { value: 'Nürnberg', label: 'lokaler Fokus' },
        ],
      },
      styleOverrides: {
        ...imageTokens,
        '--token-section-bg': C.night,
        '--token-card-bg': '#182F3A',
        '--token-card-border': 'rgba(255,255,255,0.28)',
      },
    },
    { type: 'socialProofBar', data: { bgStyle: 'light', items: [
      { value: '4,9/5', label: 'Kundenstimmen', icon: 'Star' },
      { value: '12', label: 'Stadtteile', icon: 'MapPin' },
      { value: '48 h', label: 'erste Einschätzung', icon: 'Clock' },
      { value: '0', label: 'Portal-Druck', icon: 'ShieldCheck' },
    ] }, styleOverrides: lightTokens },
    { type: 'propertySearch', data: {
      headline: 'Was suchen Sie gerade wirklich?',
      subline: 'Kaufen, verkaufen, bewerten oder erst sortieren: Die häufigsten Wege führen zu unterschiedlichen Gesprächen.',
      categories: [
        { label: 'Wohnung kaufen', href: '/kaufen', count: 'Stadtlagen' },
        { label: 'Haus verkaufen', href: '/verkaufen', count: 'Strategie' },
        { label: 'Wert klären', href: '/bewertung', count: '48 h' },
        { label: 'Referenzen', href: '/referenzen', count: 'verkauft' },
      ],
      ctaLabel: 'Passenden Einstieg wählen',
      ctaHref: '/kontakt',
    }, styleOverrides: mistTokens },
    { type: 'propertyShowcase', data: {
      headline: 'Objekte mit sauberer Einordnung.',
      subline: 'Nicht jedes Objekt braucht dieselbe Bühne. Wichtig ist, was Lage, Zustand und Käuferprofil wirklich tragen.',
      properties: propertyCards,
    }, styleOverrides: softTokens },
    { type: 'featureShowcase', data: {
      badge: 'Verkaufsstrategie',
      headline: 'Ein gutes Exposé beginnt vor dem Foto.',
      subline: 'Wir prüfen Grundrisse, Unterlagen, Zielgruppe und Timing, bevor die Immobilie online geht.',
      image: img('1560518883-ce09059eeffa'),
      features: [
        'Bewertung aus Vergleichsdaten, Zustand und Mikrolage.',
        'Exposé-Texte, die Käuferfragen vorwegnehmen.',
        'Besichtigungen mit vorbereiteten Interessenten.',
        'Rückmeldungen, die Ihnen echte Entscheidungen ermöglichen.',
      ],
      ctaLabel: 'Verkaufsweg besprechen',
      ctaHref: '/verkaufen',
      reversed: true,
    }, styleOverrides: lightTokens },
    { type: 'marketReport', data: {
      region: 'Nürnberg Nord · Fürth · Erlangen',
      headline: 'Marktgefühl ist gut. Belege sind besser.',
      subline: 'Wir übersetzen Zahlen in Entscheidungen: Preis, Zeitraum, Zielgruppe und Verhandlungsspielraum.',
      stats: marketStats(),
      description: p('Eine Immobilie ist selten nur Quadratmeterpreis. Straßenlage, Sanierungsstand, Licht, Hausgemeinschaft und Mikro-Nachfrage entscheiden oft stärker als Durchschnittswerte. Darum erklären wir, was die Daten bedeuten und wo Bauchgefühl täuscht.'),
    }, styleOverrides: lightTokens },
    { type: 'bentoGrid', data: {
      headline: 'Warum Eigentümer mit uns arbeiten.',
      subline: 'Weil wir den Prozess kleiner, klarer und verlässlicher machen.',
      items: [
        { icon: 'FileSearch', title: 'Unterlagen zuerst', text: 'Wir finden offene Punkte, bevor Käufer oder Banken sie finden.', span: '2' },
        { icon: 'Camera', title: 'Bildwelt mit Plan', text: 'Fotos zeigen nicht alles, sondern das Richtige.' },
        { icon: 'MessagesSquare', title: 'Ruhige Kommunikation', text: 'Sie wissen, was passiert, ohne jeden Tag nachfragen zu müssen.' },
        { icon: 'ShieldCheck', title: 'Qualifizierte Termine', text: 'Besichtigungen nur mit ernsthaften Interessenten.' },
        { icon: 'Handshake', title: 'Verhandlung mit Haltung', text: 'Klar im Preis, fair im Ton, sauber dokumentiert.', span: '2' },
      ],
    }, styleOverrides: softTokens },
    { type: 'processSteps', data: {
      badgeText: 'Ablauf',
      headline: 'So wird aus Interesse ein belastbarer Verkauf.',
      steps: [
        { icon: 'ClipboardCheck', title: 'Objekt verstehen', text: 'Unterlagen, Zustand, Lage und Ziele werden sauber sortiert.' },
        { icon: 'LineChart', title: 'Preisrahmen festlegen', text: 'Wir zeigen Chancen, Grenzen und sinnvolle Preisstrategie.' },
        { icon: 'Home', title: 'Vermarktung starten', text: 'Exposé, Bildwelt, Zielgruppe und Termine greifen ineinander.' },
        { icon: 'KeyRound', title: 'Übergabe sichern', text: 'Verhandlung, Notar, Unterlagen und Übergabe bleiben nachvollziehbar.' },
      ],
    }, styleOverrides: lightTokens },
    { type: 'referencesSold', data: {
      headline: 'Verkauft heißt nicht: irgendwie vermittelt.',
      subline: 'Ein paar Beispiele, bei denen Preis, Tempo und Käuferprofil zusammengepasst haben.',
      totalSold: '148+ vermittelte Objekte seit 2016',
      properties: soldProperties,
    }, styleOverrides: darkSolidTokens },
    { type: 'comparisonTable', data: {
      badge: 'Einordnung',
      headline: 'Maklerbüro, Portal oder selbst verkaufen?',
      text: 'Die Unterschiede liegen weniger im Inserat als in Vorbereitung, Prüfung und Verhandlung.',
      columns: [{ label: 'Selbst' }, { label: 'Portal' }, { label: 'Stadtkante' }],
      highlightCol: 2,
      rows: [
        { feature: 'Preisstrategie', values: ['geschätzt', 'algorithmisch', 'datenbasiert + Objektblick'] },
        { feature: 'Anfragen', values: ['ungefiltert', 'viel Volumen', 'vorqualifiziert'] },
        { feature: 'Unterlagen', values: ['eigene Suche', 'teilweise', 'vor Start geprüft'] },
        { feature: 'Verhandlung', values: ['emotional', 'standardisiert', 'ruhig dokumentiert'] },
        { feature: 'Zeitaufwand', values: ['hoch', 'mittel', 'geführt'] },
      ],
    }, styleOverrides: mistTokens },
    { type: 'agentTeam', data: {
      headline: 'Drei Menschen, ein Prozess.',
      subline: 'Sie sprechen nicht mit wechselnden Callcenter-Kontakten, sondern mit einem kleinen Team, das Ihr Objekt kennt.',
      agents,
    }, styleOverrides: lightTokens },
    { type: 'testimonials', data: {
      headline: 'Was Eigentümer nach dem Verkauf sagen.',
      items: [
        { quote: 'Wir hatten nie das Gefühl, gedrängt zu werden. Jede Entscheidung war sauber erklärt.', name: 'Familie Neumann', context: 'Wohnung Nordstadt', rating: 5 },
        { quote: 'Der Preis war ambitioniert, aber begründet. Am Ende hat genau die richtige Familie gekauft.', name: 'K. Schuster', context: 'Haus Erlenstegen', rating: 5 },
        { quote: 'Die Rückmeldungen nach Besichtigungen waren konkret. Das hat viel Unsicherheit rausgenommen.', name: 'M. Wagner', context: 'Altbau Gostenhof', rating: 5 },
        { quote: 'Kein Makler-Getöse, sondern verlässliche Arbeit.', name: 'A. Reuter', context: 'Kapitalanlage Fürth', rating: 5 },
      ],
    }, styleOverrides: lightTokens },
    { type: 'faq', data: { headline: 'Kurz vor dem ersten Gespräch geklärt.', subline: 'Die häufigsten Fragen, bevor Eigentümerinnen und Eigentümer mit uns starten.', items: faqs }, styleOverrides: softTokens },
    ctaBand('Soll Ihre Immobilie ruhig und sauber verkauft werden?', 'Schicken Sie uns Adresse, Objektart und grobe Eckdaten. Wir melden uns mit einer realistischen ersten Einschätzung.', 'Bewertung anfragen', '/bewertung'),
  ];
}

function buildObjectItem({ slug, title, excerpt, image, price, size, rooms, location }) {
  return {
    title,
    slug,
    data: {
      image,
      excerpt,
      price,
      size,
      rooms,
      location,
      sections: [
        { id: uuid(), type: 'collectionHero', data: collectionHeroData({ category: 'Objekt', headline: title, subline: excerpt, bgImage: image }), styleOverrides: imageTokens },
        { id: uuid(), type: 'textImage', data: { badge: 'Einordnung', headline: 'Was dieses Objekt besonders macht.', text: `${p(excerpt)}${p('Wir beschreiben Immobilien nicht nur schön, sondern so, dass Käuferinnen und Käufer schnell verstehen, ob Lage, Grundriss und Zustand zu ihrem Alltag passen.')}`, image, imageAlt: title, layout: 'image-right', items: [
          { icon: 'MapPin', title: location, text: 'Lage mit klarer Zielgruppe und nachvollziehbaren Wegen.' },
          { icon: 'Ruler', title: size, text: 'Fläche und Räume sind sinnvoll nutzbar, nicht nur groß auf dem Papier.' },
          { icon: 'FileSearch', title: 'Unterlagen geprüft', text: 'Relevante Dokumente liegen für ernsthafte Gespräche bereit.' },
          { icon: 'CalendarDays', title: 'Termine gebündelt', text: 'Besichtigungen werden vorbereitet und nicht wahllos verteilt.' },
        ], primaryCta: { label: 'Besichtigung anfragen', href: '/kontakt', icon: 'ArrowRight' } }, styleOverrides: lightTokens },
        { id: uuid(), type: 'statsCounter', data: { headline: 'Kurz eingeordnet.', subline: 'Die wichtigsten Eckdaten auf einen Blick.', stats: [
          { value: rooms, label: 'Zimmer' },
          { value: size, label: 'Fläche' },
          { value: price, label: 'Preis' },
          { value: 'geprüft', label: 'Status' },
        ] }, styleOverrides: mistTokens },
        { id: uuid(), ...ctaBand('Passt dieses Objekt zu Ihrer Suche?', 'Schreiben Sie uns kurz, was Ihnen wichtig ist. Wir sagen ehrlich, ob eine Besichtigung sinnvoll ist.', 'Besichtigung anfragen', '/kontakt') },
      ],
    },
  };
}

function buildGuideItem({ slug, title, excerpt, image }) {
  return {
    title,
    slug,
    data: {
      image,
      excerpt,
      date: '2026-06-03',
      sections: [
        { id: uuid(), type: 'collectionHero', data: collectionHeroData({ category: 'Ratgeber', headline: title, subline: excerpt, bgImage: image }), styleOverrides: imageTokens },
        { id: uuid(), type: 'freeText', data: { headline: title, text: `${p(excerpt)}${p('Unsere Ratgeber sollen keine Entscheidung abnehmen, sondern die richtigen Fragen sichtbar machen: Preis, Zeitpunkt, Unterlagen, Zielgruppe und Risiken.')}${p('Wenn Sie danach genauer wissen möchten, wie Ihre Immobilie einzuordnen ist, sprechen wir gern konkret über Ihr Objekt.')}` }, styleOverrides: lightTokens },
        { id: uuid(), type: 'bentoGrid', data: { headline: 'Drei Punkte, die fast immer zählen.', items: [
          { icon: 'FileText', title: 'Unterlagen', text: 'Was fehlt, verzögert später den Prozess.' },
          { icon: 'Map', title: 'Mikrolage', text: 'Straße, Licht und Wege schlagen oft den Stadtteil-Durchschnitt.' },
          { icon: 'Users', title: 'Käuferprofil', text: 'Gute Vermarktung spricht nicht alle an, sondern die Richtigen.', span: '2' },
        ] }, styleOverrides: mistTokens },
        { id: uuid(), ...ctaBand('Frage zu Ihrer Immobilie?', 'Schicken Sie uns ein paar Eckdaten. Wir geben eine ehrliche erste Einordnung.', 'Einschätzung anfragen', '/bewertung') },
      ],
    },
  };
}

const tenant = {
  slug: 'realestate',
  pat: PAT,
  wipe: true,
  publish: true,
  style: { style: 'classic' },

  brand: {
    companyName: 'Stadtkante Immobilien',
    tagline: 'Immobilienbewertung und Verkauf in Nürnberg',
    primaryColor: C.teal,
    secondaryColor: C.night,
    accentColor: C.brass,
    logoDisplay: 'name',
    headingFont: 'Manrope',
    bodyFont: 'Inter',
    topBarColor: C.night,
    footerColor: C.night,
  },

  contact: {
    phone: '+49 911 2388410',
    email: 'hallo@stadtkante-immobilien.de',
    address: 'Pilotystraße 12, 90408 Nürnberg',
    whatsapp: '+49 176 2388410',
    whatsappEnabled: true,
    whatsappColor: '#25D366',
  },

  design: {
    sectionBg: '#FFFFFF',
    sectionBgAlt: C.paper,
    cardBg: C.card,
    cardBorder: C.line,
    heading: C.ink,
    subheading: C.body,
    body: C.body,
    muted: C.muted,
    brand: C.teal,
    accent: C.brass,
    icon: C.teal,
    btnBg: C.teal,
    btnText: '#FFFFFF',
    badgeBg: '#EEF7F8',
    badgeText: C.teal,
    badgeBorder: '#C9DEE1',
    dividerColor: C.line,
    eyebrow: C.brass,
    statValue: C.teal,
    quote: C.body,
    ratingStar: C.brass,
    check: C.teal,
    onDarkHeading: '#FFFFFF',
    onDarkBody: 'rgba(255,255,255,0.92)',
    onDarkMuted: 'rgba(255,255,255,0.74)',
  },

  socialLinks: {
    linkedin: 'https://www.linkedin.com/company/stadtkante-immobilien',
    instagram: 'https://www.instagram.com/stadtkante.immobilien/',
    google: 'https://maps.google.com/?q=Stadtkante+Immobilien+Nürnberg',
  },

  openingHours: {
    hours: [
      { type: 'regular', day: 'Montag', hours: '09:00-18:00' },
      { type: 'regular', day: 'Dienstag', hours: '09:00-18:00' },
      { type: 'regular', day: 'Mittwoch', hours: '09:00-18:00' },
      { type: 'regular', day: 'Donnerstag', hours: '09:00-18:00' },
      { type: 'regular', day: 'Freitag', hours: '09:00-16:00' },
      { type: 'regular', day: 'Samstag', hours: 'Besichtigungen nach Vereinbarung' },
      { type: 'regular', day: 'Sonntag', closed: true },
    ],
  },

  formFields: {
    fields: [
      { name: 'firstName', label: 'Vorname', type: 'text', required: true, halfWidth: true },
      { name: 'lastName', label: 'Nachname', type: 'text', required: true, halfWidth: true },
      { name: 'email', label: 'E-Mail', type: 'email', required: true, halfWidth: true },
      { name: 'phone', label: 'Telefon', type: 'tel', required: false, halfWidth: true },
      { name: 'topic', label: 'Anliegen', type: 'select', required: true, options: ['Immobilie verkaufen', 'Immobilie bewerten', 'Objekt anfragen', 'Kaufberatung', 'Sonstiges'] },
      { name: 'message', label: 'Nachricht', type: 'textarea', required: true, placeholder: 'Beschreiben Sie kurz Immobilie, Lage oder Suchwunsch. Wir melden uns persönlich.' },
    ],
  },

  seoGlobal: {
    titleTemplate: '%s | Stadtkante Immobilien Nürnberg',
    defaultTitle: 'Stadtkante Immobilien - Makler und Bewertung in Nürnberg',
    defaultDescription: 'Stadtkante Immobilien begleitet Verkauf, Bewertung und Kaufberatung in Nürnberg, Fürth und Erlangen mit lokaler Marktkenntnis und ruhiger Vermarktung.',
    defaultOgImage: img('1486406146926-c627a92ad1ab', 1200),
    locale: 'de_DE',
  },

  navigation: {
    items: [
      { label: 'Startseite', href: '/' },
      { label: 'Kaufen', href: '/kaufen' },
      { label: 'Verkaufen', href: '/verkaufen' },
      { label: 'Bewertung', href: '/bewertung' },
      { label: 'Referenzen', href: '/referenzen' },
      { label: 'Über uns', href: '/ueber-uns' },
      { label: 'Kontakt', href: '/kontakt' },
    ],
    cta: { label: 'Bewertung anfragen', href: '/bewertung' },
  },

  footer: {
    columns: [
      { title: 'Immobilien', items: [
        { text: 'Kaufen', href: '/kaufen' },
        { text: 'Verkaufen', href: '/verkaufen' },
        { text: 'Bewertung', href: '/bewertung' },
      ] },
      { title: 'Einblicke', items: [
        { text: 'Referenzen', href: '/referenzen' },
        { text: 'Ratgeber', href: '/news' },
        { text: 'Über uns', href: '/ueber-uns' },
      ] },
      { title: 'Kontakt', items: [
        { text: 'Telefon', href: 'tel:+499112388410' },
        { text: 'E-Mail', href: 'mailto:hallo@stadtkante-immobilien.de' },
        { text: 'Anfahrt', href: '/kontakt' },
      ] },
    ],
    legalLinks: [
      { text: 'Impressum', href: '/impressum' },
      { text: 'Datenschutz', href: '/datenschutz' },
    ],
    cta: { label: 'Gespräch anfragen', href: '/kontakt' },
  },

  collections: [
    {
      key: 'objekte',
      label: 'Objekte',
      items: propertyCards.map((obj) => buildObjectItem({
        slug: obj.href.split('/').pop(),
        title: obj.title,
        excerpt: `${obj.location}, ${obj.size}, ${obj.rooms} Zimmer. Ein Objekt für Käuferinnen und Käufer, die nicht nur suchen, sondern sauber entscheiden möchten.`,
        image: obj.image,
        price: obj.price,
        size: obj.size,
        rooms: obj.rooms,
        location: obj.location,
      })),
    },
    {
      key: 'news',
      label: 'Ratgeber',
      items: [
        buildGuideItem({ slug: 'verkaufspreis-nicht-schaetzen', title: 'Warum ein guter Verkaufspreis nicht geraten wird', excerpt: 'Ein realistischer Preis entsteht aus Lage, Zustand, Nachfrage und Strategie - nicht aus Wunsch, Portalgefühl oder Nachbarschaftsgerüchten.', image: img('1560520031-3a4dc4e9de0c') }),
        buildGuideItem({ slug: 'unterlagen-vor-dem-verkauf', title: 'Welche Unterlagen vor dem Verkauf wirklich helfen', excerpt: 'Grundbuch, Energieausweis, Teilungserklärung und Protokolle sind nicht Bürokratie, sondern die Basis für Vertrauen.', image: img('1450101499163-c8848c66ca85') }),
        buildGuideItem({ slug: 'besichtigungen-richtig-buendeln', title: 'Warum gute Besichtigungen nicht zufällig passieren', excerpt: 'Zu viele Termine erzeugen Unruhe. Gute Vorbereitung qualifiziert Interessenten und schützt Ihre Zeit.', image: img('1560518883-ce09059eeffa') }),
      ],
    },
  ],

  pages: [
    {
      slug: 'startseite',
      title: 'Startseite',
      seo: pageSeo('Immobilienmakler Nürnberg - Bewertung und Verkauf', 'Stadtkante Immobilien begleitet Immobilienverkauf, Bewertung und Kaufberatung in Nürnberg mit lokaler Marktkenntnis und klarer Vermarktung.', img('1486406146926-c627a92ad1ab', 1200)),
      sections: homeSections(),
    },
    {
      slug: 'leistungen',
      title: 'Leistungen',
      seo: pageSeo('Immobilienmakler Leistungen in Nürnberg', 'Leistungen von Stadtkante Immobilien: Immobilienverkauf, Bewertung, Kaufberatung, Objektprüfung und Vermarktung in Nürnberg.'),
      sections: [
        { type: 'collectionHero', data: collectionHeroData({ category: 'Leistungen', headline: 'Immobilienarbeit mit klaren Rollen.', subline: 'Bewertung, Verkauf, Kaufberatung und Objektprüfung greifen ineinander, statt nebeneinander zu laufen.', bgImage: img('1560518883-ce09059eeffa') }), styleOverrides: imageTokens },
        { type: 'servicesGrid', data: { badgeText: 'Schwerpunkte', headline: 'Vier Wege, wie wir helfen.', subline: 'Je nach Ziel startet der Prozess an einer anderen Stelle.', ctaLabel: 'Leistung besprechen', ctaHref: '/kontakt', manualCards: [
          { title: 'Immobilie verkaufen', text: 'Preisstrategie, Unterlagen, Exposé, Besichtigungen und Verhandlung aus einer Hand.', icon: 'KeyRound', href: '/verkaufen' },
          { title: 'Immobilie bewerten', text: 'Realistische Spanne mit Lage, Zustand, Nachfrage und Vergleichsdaten.', icon: 'LineChart', href: '/bewertung' },
          { title: 'Kaufberatung', text: 'Objekte prüfen, Unterlagen verstehen und Entscheidungen sauber vorbereiten.', icon: 'Search', href: '/kaufen' },
          { title: 'Referenzen einordnen', text: 'Verkaufte Objekte zeigen, welche Strategie in welcher Lage funktioniert.', icon: 'CheckCircle2', href: '/referenzen' },
        ] }, styleOverrides: lightTokens },
        { type: 'featureShowcase', data: { badge: 'Arbeitsweise', headline: 'Wir verkaufen nicht schneller um jeden Preis.', subline: 'Gute Maklerarbeit schützt Wert, Zeit und Nerven.', image: img('1486406146926-c627a92ad1ab'), features: ['Klare Vorbereitung vor dem ersten Inserat.', 'Nachvollziehbare Preisargumentation.', 'Kommunikation ohne tägliches Nachfragen.', 'Abschluss mit sauberer Dokumentation.'], ctaLabel: 'Erstgespräch anfragen', ctaHref: '/kontakt' }, styleOverrides: softTokens },
        { type: 'comparisonTable', data: { badge: 'Passt zu', headline: 'Welche Leistung brauchen Sie?', text: 'Eine schnelle Orientierung für den ersten Kontakt.', columns: [{ label: 'Bewertung' }, { label: 'Verkauf' }, { label: 'Kauf' }], highlightCol: 1, rows: [
          { feature: 'Ausgangspunkt', values: ['Wert unklar', 'Objekt soll verkauft werden', 'Suchprofil steht'] },
          { feature: 'Ergebnis', values: ['realistische Spanne', 'geführter Verkaufsprozess', 'bessere Entscheidung'] },
          { feature: 'Dauer', values: ['48 h erste Sichtung', 'mehrere Wochen', 'nach Objektlage'] },
          { feature: 'Unterlagen', values: ['hilfreich', 'zwingend', 'zur Prüfung'] },
        ] }, styleOverrides: mistTokens },
        { type: 'processSteps', data: { badgeText: 'Ablauf', headline: 'Immer erst sortieren, dann handeln.', steps: [
          { icon: 'MessageSquareText', title: 'Anliegen klären', text: 'Was soll entschieden werden und bis wann?' },
          { icon: 'FileSearch', title: 'Daten prüfen', text: 'Unterlagen, Lage, Zustand und Markt werden zusammen gelesen.' },
          { icon: 'Map', title: 'Strategie wählen', text: 'Bewertung, Verkauf oder Kaufberatung bekommen klare nächste Schritte.' },
          { icon: 'ArrowRight', title: 'Umsetzen', text: 'Wir begleiten konkret, dokumentiert und ohne Streuverlust.' },
        ] }, styleOverrides: lightTokens },
        ctaBand('Welche Leistung passt zu Ihrer Situation?', 'Schreiben Sie uns kurz, wo Sie stehen. Wir ordnen den nächsten Schritt ein.', 'Leistung anfragen', '/kontakt'),
      ],
    },
    {
      slug: 'kaufen',
      title: 'Kaufen',
      seo: pageSeo('Immobilien kaufen in Nürnberg', 'Wohnungen und Häuser in Nürnberg mit sauberer Einordnung, geprüften Unterlagen und persönlicher Besichtigung über Stadtkante Immobilien.'),
      sections: [
        { type: 'collectionHero', data: collectionHeroData({ category: 'Kaufen', headline: 'Nicht jedes Objekt passt zu jedem Leben.', subline: 'Wir zeigen nicht möglichst viele Immobilien, sondern die, bei denen Lage, Grundriss und Zustand wirklich zu Ihrer Suche passen.', bgImage: img('1505693416388-ac5ce068fe85') }), styleOverrides: imageTokens },
        { type: 'propertyShowcase', data: { headline: 'Aktuelle Objekte', subline: 'Drei Beispiele aus unserem aktuellen Bestand.', properties: propertyCards }, styleOverrides: lightTokens },
        { type: 'collectionList', data: { headline: 'Alle Objekte', collectionKey: 'objekte', collectionBasePath: '/c/objekte', columns: 3, showImage: true, showExcerpt: true, showDate: false, showSortControls: false }, styleOverrides: mistTokens },
        { type: 'processSteps', data: { badgeText: 'Kaufberatung', headline: 'So prüfen wir, ob ein Objekt zu Ihnen passt.', steps: [
          { icon: 'Search', title: 'Suchprofil klären', text: 'Budget, Lage, Alltag und Muss-Kriterien werden sauber sortiert.' },
          { icon: 'FileSearch', title: 'Unterlagen lesen', text: 'Wir erklären, was Grundriss, Protokolle und Energieausweis bedeuten.' },
          { icon: 'Home', title: 'Besichtigung vorbereiten', text: 'Sie gehen mit konkreten Fragen in den Termin.' },
          { icon: 'Handshake', title: 'Entscheidung absichern', text: 'Wir benennen Chancen, Risiken und Verhandlungspunkte.' },
        ] }, styleOverrides: lightTokens },
        { type: 'faq', data: { headline: 'Fragen vor der Besichtigung', items: [
          { question: 'Kann ich ein Objekt reservieren?', answer: 'Eine feste Reservierung ist erst nach Klärung der Finanzierung und Verkäuferfreigabe sinnvoll.' },
          { question: 'Bekomme ich Unterlagen vor dem Termin?', answer: 'Ja, ernsthafte Interessenten erhalten die relevanten Unterlagen rechtzeitig.' },
          { question: 'Begleiten Sie auch Käufer?', answer: 'Ja, wenn wir unabhängig beraten können und das Mandat sauber geklärt ist.' },
          { question: 'Wie schnell bekomme ich Rückmeldung?', answer: 'In der Regel innerhalb eines Werktags.' },
        ] }, styleOverrides: softTokens },
        ctaBand('Sie suchen nicht irgendeine Immobilie?', 'Dann starten wir mit Kriterien, nicht mit Zufall. Schreiben Sie uns, was wirklich passen muss.', 'Suchprofil senden', '/kontakt'),
      ],
    },
    {
      slug: 'verkaufen',
      title: 'Verkaufen',
      seo: pageSeo('Immobilie verkaufen in Nürnberg', 'Immobilienverkauf in Nürnberg mit Bewertung, Unterlagenprüfung, Exposé, Besichtigungssteuerung und ruhiger Verhandlung.'),
      sections: [
        { type: 'collectionHero', data: collectionHeroData({ category: 'Verkaufen', headline: 'Ein Verkauf ist kein Inserat. Er ist ein Prozess.', subline: 'Wir bereiten Verkauf, Preis, Unterlagen und Kommunikation so vor, dass Sie nicht bei jeder Anfrage neu improvisieren müssen.', bgImage: img('1564013799919-ab600027ffc6') }), styleOverrides: imageTokens },
        { type: 'featureShowcase', data: { badge: 'Vorbereitung', headline: 'Wir gehen erst online, wenn die Grundlage stimmt.', subline: 'Ein starker Verkauf braucht weniger Lärm und mehr Klarheit.', image: img('1560518883-ce09059eeffa'), features: ['Unterlagencheck vor Vermarktungsstart.', 'Preisstrategie mit Vergleichsdaten und Objektlogik.', 'Bild- und Textkonzept passend zur Zielgruppe.', 'Besichtigungen mit qualifizierten Interessenten.'], ctaLabel: 'Verkauf besprechen', ctaHref: '/kontakt' }, styleOverrides: lightTokens },
        { type: 'comparisonTable', data: { badge: 'Vergleich', headline: 'Was wir anders machen.', text: 'Nicht lauter, sondern strukturierter.', columns: [{ label: 'Standard' }, { label: 'Stadtkante' }], highlightCol: 1, rows: [
          { feature: 'Start', values: ['Inserat schnell online', 'Unterlagen und Preis zuerst sauber'] },
          { feature: 'Anfragen', values: ['viel Volumen', 'vorqualifiziert und gebündelt'] },
          { feature: 'Feedback', values: ['Einzelmeinungen', 'sortierte Rückmeldung nach Terminblöcken'] },
          { feature: 'Verhandlung', values: ['reaktiv', 'vorbereitet und dokumentiert'] },
        ] }, styleOverrides: mistTokens },
        { type: 'timeline', data: { badge: 'Verkaufsphasen', headline: 'Der Ablauf bleibt sichtbar.', subline: 'Sie wissen jederzeit, in welcher Phase der Verkauf steht.', entries: [
          { year: '01', title: 'Einordnung', text: 'Ziele, Objekt, Unterlagen und Preisrahmen.' },
          { year: '02', title: 'Vorbereitung', text: 'Exposé, Fotoplan, Zielgruppe und Vermarktungsstart.' },
          { year: '03', title: 'Besichtigungen', text: 'Termine, Rückmeldungen und Käuferprüfung.' },
          { year: '04', title: 'Abschluss', text: 'Verhandlung, Notar, Übergabe und Dokumentation.' },
        ] }, styleOverrides: softTokens },
        { type: 'referencesSold', data: { headline: 'So sieht ein sauberer Abschluss aus.', subline: 'Verkäufe, bei denen nicht nur Tempo, sondern auch Passung gestimmt hat.', totalSold: '148+ vermittelte Objekte', properties: soldProperties }, styleOverrides: darkSolidTokens },
        ctaBand('Wollen Sie wissen, was Ihr Verkauf braucht?', 'Ein kurzes Gespräch reicht oft, um Preis, Timing und nächste Schritte klarer zu sehen.', 'Verkauf anfragen', '/kontakt'),
      ],
    },
    {
      slug: 'bewertung',
      title: 'Bewertung',
      seo: pageSeo('Immobilienbewertung Nürnberg', 'Immobilienbewertung in Nürnberg mit Marktanalyse, Objektprüfung und realistischer Verkaufsspanne.'),
      sections: [
        { type: 'valuationCta', data: { headline: 'Was ist Ihre Immobilie wirklich wert?', subline: 'Wir verbinden Vergleichsdaten, Objektzustand und Mikrolage zu einer realistischen Einschätzung - ohne Druck zum Verkauf.', ctaLabel: 'Bewertung anfragen', ctaHref: '/kontakt', bgImage: img('1560518883-ce09059eeffa'), stats: [{ label: 'erste Rückmeldung', value: '48 h' }, { label: 'Stadtteile geprüft', value: '12' }, { label: 'Verkaufsdaten', value: 'seit 2016' }] }, styleOverrides: darkSolidTokens },
        { type: 'marketReport', data: { region: 'Nürnberg und Umgebung', headline: 'Der Preis entsteht aus mehr als Quadratmetern.', subline: 'Wir betrachten Lage, Licht, Zustand, Haus, Nachfrage und Vergleichsverkäufe gemeinsam.', stats: marketStats(), description: p('Eine Bewertung ist gut, wenn sie erklärbar ist. Darum zeigen wir nicht nur eine Zahl, sondern eine Spanne und die Faktoren, die sie bewegen können.') }, styleOverrides: lightTokens },
        { type: 'bentoGrid', data: { headline: 'Was in die Bewertung einfließt.', items: [
          { icon: 'MapPin', title: 'Mikrolage', text: 'Straße, ÖPNV, Lärm, Licht und Umfeld.' },
          { icon: 'Hammer', title: 'Zustand', text: 'Modernisierung, Technik, Rücklagen und sichtbare Risiken.' },
          { icon: 'Users', title: 'Nachfrage', text: 'Welche Zielgruppe sucht genau diese Immobilie?', span: '2' },
          { icon: 'FileText', title: 'Unterlagen', text: 'Was Käufer und Banken später wirklich prüfen.' },
        ] }, styleOverrides: softTokens },
        { type: 'faq', data: { headline: 'Bewertung: häufige Fragen', items: [
          { question: 'Reicht eine Online-Bewertung?', answer: 'Für eine grobe Idee ja. Für einen Verkauf nein, weil Zustand, Unterlagen und Mikrolage fehlen.' },
          { question: 'Muss jemand vor Ort sein?', answer: 'Für eine belastbare Spanne ja. Fotos und Unterlagen helfen, ersetzen aber nicht alles.' },
          { question: 'Bekomme ich nur einen Preis?', answer: 'Sie bekommen eine realistische Spanne und eine Erklärung, was diese Spanne beeinflusst.' },
          { question: 'Ist die Bewertung kostenlos?', answer: 'Die erste Einschätzung ist kostenlos. Umfangreiche Gutachten sind ein separates Thema.' },
        ] }, styleOverrides: lightTokens },
        { type: 'serviceTabs', data: {
          badge: 'Leistungen',
          headline: 'Drei Situationen, drei klare Wege.',
          subline: 'Verkaufen, bewerten oder vermieten — jede Situation braucht eine andere Strategie.',
          tabs: [
            { label: 'Verkaufen', icon: 'home', title: 'Verkauf mit Strategie', text: '<p>Zielgruppenanalyse, ehrliche Preisstrategie und eine Vermarktung, die zum Objekt passt — nicht umgekehrt.</p>', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=82', features: ['Ø 34 Tage bis zur Beurkundung', 'Professionelles Exposé inklusive', 'Diskrete Off-Market-Option'], cta: { label: 'Verkauf besprechen', href: '/kontakt' } },
            { label: 'Bewerten', icon: 'calculator', title: 'Bewertung mit Begründung', text: '<p>Eine Zahl ist schnell genannt. Wir erklären, wie sie zustande kommt — mit Vergleichsobjekten und Marktdaten aus Ihrem Stadtteil.</p>', image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=82', features: ['Vor-Ort-Termin in 2 Stunden', 'Schriftliche Einordnung', 'Kostenlos für Eigentümer'], cta: { label: 'Bewertung starten', href: '/kontakt' } },
            { label: 'Vermieten', icon: 'keyRound', title: 'Vermietung ohne Bauchgefühl', text: '<p>Mieterauswahl mit Substanz: Bonität, Selbstauskunft und ein Übergabeprotokoll, das späteren Streit vermeidet.</p>', image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=82', features: ['Marktgerechte Mietpreisanalyse', 'Vollständige Bewerberprüfung', 'Rechtssichere Verträge'], cta: { label: 'Vermietung anfragen', href: '/kontakt' } },
          ],
        }, styleOverrides: lightTokens },
        ctaBand('Eine Zahl ohne Erklärung hilft selten.', 'Schicken Sie uns Adresse, Objektart und Ziel. Wir melden uns mit einem sinnvollen nächsten Schritt.', 'Bewertung starten', '/kontakt'),
      ],
    },
    {
      slug: 'referenzen',
      title: 'Referenzen',
      seo: pageSeo('Verkaufte Immobilien in Nürnberg', 'Referenzen von Stadtkante Immobilien: verkaufte Wohnungen, Häuser und Kapitalanlagen in Nürnberg und Umgebung.'),
      sections: [
        { type: 'collectionHero', data: collectionHeroData({ category: 'Referenzen', headline: 'Verkauft ist erst gut, wenn es nachvollziehbar war.', subline: 'Ein Blick auf Objekte, bei denen Strategie, Zielgruppe und Abschluss zusammengepasst haben.', bgImage: img('1494526585095-c41746248156') }), styleOverrides: imageTokens },
        { type: 'referencesSold', data: { headline: 'Ausgewählte Verkäufe', subline: 'Nicht vollständig, aber typisch für unsere Arbeit.', totalSold: '148+ Vermittlungen', properties: soldProperties }, styleOverrides: lightTokens },
        { type: 'statsCounter', data: { headline: 'Ein paar Zahlen aus der Praxis.', subline: 'Kurz gehalten, weil Zahlen nur mit Kontext etwas bedeuten.', stats: [
          { value: 148, suffix: '+', label: 'Verkäufe' },
          { value: 34, label: 'Ø Tage' },
          { value: 12, label: 'Stadtteile' },
          { value: 4.9, label: 'Bewertung' },
        ] }, styleOverrides: mistTokens },
        { type: 'testimonials', data: { headline: 'Stimmen aus abgeschlossenen Verkäufen.', items: homeSections().find((s) => s.type === 'testimonials').data.items }, styleOverrides: lightTokens },
        ctaBand('Ihr Objekt muss nicht wie eine Referenz wirken.', 'Es muss richtig eingeordnet werden. Genau damit starten wir.', 'Objekt besprechen', '/kontakt'),
      ],
    },
    {
      slug: 'ueber-uns',
      title: 'Über uns',
      seo: pageSeo('Über Stadtkante Immobilien Nürnberg', 'Über Stadtkante Immobilien: Team, Haltung und Arbeitsweise des Maklerbüros in Nürnberg.'),
      sections: [
        { type: 'collectionHero', data: collectionHeroData({ category: 'Über uns', headline: 'Wir mögen Immobilienarbeit ohne Show.', subline: 'Gute Maklerarbeit ist sichtbar in Vorbereitung, nicht in Lautstärke.', bgImage: img('1522708323590-d24dbb6b0267') }), styleOverrides: imageTokens },
        { type: 'textImage', data: { badge: 'Haltung', headline: 'Wir erklären lieber zu viel als zu wenig.', text: `${p('Immobilienentscheidungen sind selten nur wirtschaftlich. Sie hängen an Erinnerungen, Plänen, Familie, Finanzierung und manchmal auch an Unsicherheit. Darum arbeiten wir ruhig und konkret.')}${p('Unser Ziel ist nicht, jeden Preis schönzureden. Unser Ziel ist, dass Eigentümer und Käufer verstehen, worauf sie sich einlassen.')}`, image: img('1560518883-ce09059eeffa'), imageAlt: 'Beratung im Immobilienbüro', layout: 'image-left', items: [
          { icon: 'MessageSquareText', title: 'klar sprechen', text: 'Keine Fachbegriffe als Nebelwand.' },
          { icon: 'Map', title: 'lokal denken', text: 'Nürnberg ist nicht ein Markt, sondern viele Mikrolagen.' },
          { icon: 'ShieldCheck', title: 'sauber prüfen', text: 'Unterlagen, Zustand und Risiken gehören früh auf den Tisch.' },
          { icon: 'Handshake', title: 'fair verhandeln', text: 'Ein Abschluss soll für beide Seiten tragfähig bleiben.' },
        ], primaryCta: { label: 'Team kennenlernen', href: '/kontakt', icon: 'ArrowRight' } }, styleOverrides: lightTokens },
        { type: 'agentTeam', data: { headline: 'Klein genug, um verantwortlich zu bleiben.', subline: 'Jedes Mandat hat feste Ansprechpartner.', agents }, styleOverrides: softTokens },
        { type: 'timeline', data: { badge: 'Geschichte', headline: 'Wie Stadtkante gewachsen ist.', subline: 'Nicht durch Masse, sondern durch wiederkehrende Empfehlungen.', entries: [
          { year: '2016', title: 'Start in der Nordstadt', text: 'Clara Seidel gründet Stadtkante mit Fokus auf Eigentümerberatung.' },
          { year: '2019', title: 'Bewertung als eigener Schwerpunkt', text: 'Marktdaten und Objektprüfung werden systematischer verbunden.' },
          { year: '2022', title: 'Team statt Einzelkämpfer', text: 'Exposé, Analyse und Besichtigung bekommen klare Rollen.' },
          { year: 'Heute', title: 'Bewusst lokal', text: 'Nürnberg, Fürth und Erlangen bleiben der Fokus.' },
        ] }, styleOverrides: mistTokens },
        { type: 'bentoGrid', data: { headline: 'Was uns wichtig ist.', items: [
          { icon: 'Compass', title: 'Orientierung vor Tempo', text: 'Schnell ist gut. Richtig sortiert ist besser.', span: '2' },
          { icon: 'Eye', title: 'Keine Schönfärberei', text: 'Risiken werden früh benannt.' },
          { icon: 'Users', title: 'Menschliche Entscheidungen', text: 'Immobilien sind Vermögen und Zuhause zugleich.' },
          { icon: 'FileCheck', title: 'Dokumentation', text: 'Was besprochen wird, bleibt nachvollziehbar.' },
        ] }, styleOverrides: lightTokens },
        ctaBand('Passt unsere Art zu Ihrem Verkauf?', 'Dann lernen wir uns in einem ruhigen Erstgespräch kennen.', 'Gespräch anfragen', '/kontakt'),
      ],
    },
    {
      slug: 'kontakt',
      title: 'Kontakt',
      seo: pageSeo('Kontakt Stadtkante Immobilien Nürnberg', 'Kontakt zu Stadtkante Immobilien in Nürnberg: Bewertung, Verkauf, Kaufberatung und Besichtigung anfragen.'),
      sections: [
        { type: 'collectionHero', data: collectionHeroData({ category: 'Kontakt', headline: 'Erzählen Sie uns kurz, worum es geht.', subline: 'Adresse, Objektart oder Suchwunsch reichen für den Anfang. Wir melden uns persönlich.', bgImage: img('1486406146926-c627a92ad1ab') }), styleOverrides: imageTokens },
        { type: 'contact', data: { headline: 'Direkt anfragen', subline: 'Wir antworten in der Regel innerhalb eines Werktags.', introText: 'Je konkreter Ihre Angaben sind, desto genauer können wir den nächsten Schritt empfehlen.', badgeText: 'Nürnberg', phone: '+49 911 2388410', email: 'hallo@stadtkante-immobilien.de', address: 'Pilotystraße 12, 90408 Nürnberg', hours: 'Mo-Fr 9:00-18:00, Termine nach Vereinbarung', formEnabled: true, submitLabel: 'Anfrage senden', infoCards: contactCards }, styleOverrides: lightTokens },
        { type: 'locationHighlight', data: { headline: 'Büro in der Nordstadt.', subline: 'Ruhig erreichbar, nah an Stadtpark, Altstadt und den Lagen, in denen wir viel arbeiten.', description: p('Unser Büro liegt in der Pilotystraße. Beratungstermine finden nach Vereinbarung statt, damit Unterlagen und Fragen vorbereitet sind.'), image: img('1522708323590-d24dbb6b0267'), pois: [
          { label: 'Stadtpark', distance: '6 Min. zu Fuß', icon: 'nature' },
          { label: 'U-Bahn Kaulbachplatz', distance: '4 Min.', icon: 'train' },
          { label: 'Altstadt', distance: '10 Min. Rad', icon: 'shopping' },
          { label: 'Schulen & Kitas', distance: 'im Umfeld', icon: 'school' },
        ] }, styleOverrides: mistTokens },
        { type: 'faq', data: { headline: 'Kontakt: gut zu wissen', items: faqs }, styleOverrides: softTokens },
      ],
    },
    {
      slug: 'news',
      title: 'Ratgeber',
      seo: pageSeo('Immobilien-Ratgeber Nürnberg', 'Ratgeber von Stadtkante Immobilien zu Verkaufspreis, Unterlagen, Besichtigungen und Immobilienentscheidungen in Nürnberg.'),
      sections: [
        { type: 'collectionHero', data: collectionHeroData({ category: 'Ratgeber', headline: 'Notizen für bessere Immobilienentscheidungen.', subline: 'Kurze Einordnungen zu Preis, Unterlagen, Lage und Verkaufsvorbereitung.', bgImage: img('1450101499163-c8848c66ca85') }), styleOverrides: imageTokens },
        { type: 'collectionList', data: { headline: 'Alle Ratgeber', collectionKey: 'news', collectionBasePath: '/c/news', columns: 3, showImage: true, showExcerpt: true, showDate: true, showSortControls: false }, styleOverrides: lightTokens },
        { type: 'featureShowcase', data: { badge: 'Warum wir schreiben', headline: 'Gute Fragen sparen später Druck.', subline: 'Ratgeber helfen vor allem dann, wenn sie Entscheidungen vorbereiten statt nur Suchbegriffe bedienen.', image: img('1450101499163-c8848c66ca85'), features: ['Preislogik verstehen.', 'Unterlagen rechtzeitig sortieren.', 'Besichtigungen besser einordnen.', 'Verhandlungsspielraum realistisch sehen.'], ctaLabel: 'Frage stellen', ctaHref: '/kontakt' }, styleOverrides: softTokens },
        ctaBand('Lieber konkret als allgemein?', 'Dann sprechen wir direkt über Ihre Immobilie oder Ihre Suche.', 'Kontakt aufnehmen', '/kontakt'),
      ],
    },
    {
      slug: 'impressum',
      title: 'Impressum',
      seo: pageSeo('Impressum', 'Impressum von Stadtkante Immobilien Nürnberg.'),
      sections: [
        { type: 'freeText', data: { headline: 'Impressum', text: `${p('Stadtkante Immobilien GmbH')} ${p('Pilotystraße 12, 90408 Nürnberg')} ${p('Telefon: +49 911 2388410<br>E-Mail: hallo@stadtkante-immobilien.de')} ${p('Geschäftsführung: Clara Seidel<br>Registergericht: Amtsgericht Nürnberg<br>Registernummer: HRB 24817<br>Umsatzsteuer-ID: DE312845901')} ${p('Aufsichtsbehörde nach § 34c GewO: Stadt Nürnberg, Ordnungsamt, Innerer Laufer Platz 3, 90403 Nürnberg.')} ${p('Inhaltlich verantwortlich: Clara Seidel, Anschrift wie oben.')}` }, styleOverrides: lightTokens },
      ],
    },
    {
      slug: 'datenschutz',
      title: 'Datenschutz',
      seo: pageSeo('Datenschutz', 'Datenschutzhinweise von Stadtkante Immobilien Nürnberg.'),
      sections: [
        { type: 'freeText', data: { headline: 'Datenschutz', text: `${p('Wir verarbeiten personenbezogene Daten, wenn Sie uns kontaktieren, eine Bewertung anfragen oder Objektunterlagen erhalten möchten. Dazu zählen insbesondere Name, Kontaktdaten, Objektinformationen und Ihre Nachricht.')} ${p('Die Verarbeitung erfolgt zur Bearbeitung Ihrer Anfrage, zur Vorbereitung eines Maklervertrags oder zur Durchführung vorvertraglicher Maßnahmen. Rechtsgrundlagen sind Art. 6 Abs. 1 lit. b und f DSGVO.')} ${p('Daten werden nur so lange gespeichert, wie es für die Bearbeitung, gesetzliche Pflichten oder berechtigte Nachweise erforderlich ist. Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung und Widerspruch.')} ${p('Kontakt Datenschutz: datenschutz@stadtkante-immobilien.de')}` }, styleOverrides: lightTokens },
      ],
    },
  ],
};

if (require.main === module) {
  run(tenant).catch((e) => { console.error('FATAL:', e); process.exit(1); });
}

module.exports = tenant;
