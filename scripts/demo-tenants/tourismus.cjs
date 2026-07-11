const { randomUUID } = require('node:crypto');
const { run } = require('./_lib/runner.cjs');
const { darkTokens } = require('./_lib/theme.cjs');

/**
 * Tenant: tourismus
 * Marke: Karwendel Kompass, Mittenwald
 * Story: Kleine Tourismusberatung für das Karwendel: ehrliche Routen, saisonale
 *        Empfehlungen, Mobilität, Familien- und Genussmomente ohne Massenprogramm.
 * Palette: Bergsee-Blau, Felsgrau, Latschenkiefer, warmes Sonnenfenster.
 * Typografie: Manrope für klare Headlines, Inter für ruhige Lesbarkeit.
 * Bildwelt: alpine Täler, Wege, Seen, Hütten, kleine Orte, Wetter und Jahreszeiten.
 * Tonalität: ortskundig, ruhig, konkret, hilfreich statt werblich.
 */

const PAT = process.env.PAT_DEMO_TOURISM || '';

const C = {
  lake: '#245D6A',
  deep: '#122D36',
  pine: '#315C48',
  moss: '#6F805F',
  sun: '#D99A3D',
  sand: '#F4EFE4',
  mist: '#F2F7F6',
  paper: '#FFFFFF',
  stone: '#DCE5E2',
  ink: '#10212A',
  body: '#40545D',
  muted: '#536970',
  white: '#FFFFFF',
};

const uuid = () => randomUUID();
const img = (id, w = 1600) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=82`;
const p = (text) => `<p>${text}</p>`;

function darkSectionTokens(bg = C.deep) {
  return {
    ...darkTokens({ accent: C.sun }),
    '--token-section-bg': bg,
    '--token-section-bg-alt': bg,
    '--token-card-bg': 'rgba(18,45,54,0.78)',
    '--token-card-border': 'rgba(255,255,255,0.22)',
    '--token-heading': C.white,
    '--token-subheading': 'rgba(255,255,255,0.88)',
    '--token-body': 'rgba(255,255,255,0.88)',
    '--token-muted': 'rgba(255,255,255,0.70)',
    '--token-icon': C.sun,
    '--token-accent': C.sun,
    '--token-eyebrow': C.sun,
    '--token-badge-bg': 'rgba(255,255,255,0.13)',
    '--token-badge-text': C.white,
    '--token-badge-border': 'rgba(255,255,255,0.28)',
    '--token-btn-bg': C.sun,
    '--token-btn-text': C.deep,
    '--token-btn-secondary-bg': 'rgba(255,255,255,0.12)',
    '--token-btn-secondary-text': C.white,
    '--token-on-dark-heading': C.white,
    '--token-on-dark-body': 'rgba(255,255,255,0.88)',
    '--token-on-dark-muted': 'rgba(255,255,255,0.70)',
  };
}

const lightTokens = {
  '--token-section-bg': C.mist,
  '--token-section-bg-alt': C.sand,
  '--token-card-bg': C.paper,
  '--token-card-border': 'rgba(36,93,106,0.14)',
  '--token-heading': C.ink,
  '--token-subheading': C.lake,
  '--token-body': C.body,
  '--token-muted': C.muted,
  '--token-icon': C.lake,
  '--token-accent': C.sun,
  '--token-eyebrow': C.sun,
  '--token-badge-bg': 'rgba(36,93,106,0.10)',
  '--token-badge-text': C.deep,
  '--token-badge-border': 'rgba(36,93,106,0.18)',
  '--token-btn-bg': C.lake,
  '--token-btn-text': C.white,
  '--token-btn-secondary-bg': C.paper,
  '--token-btn-secondary-text': C.deep,
};

const sandTokens = {
  ...lightTokens,
  '--token-section-bg': C.sand,
  '--token-section-bg-alt': '#FFF9ED',
  '--token-icon': C.sun,
  '--token-accent': C.sun,
};

const greenTokens = {
  ...lightTokens,
  '--token-section-bg': '#EEF5EF',
  '--token-section-bg-alt': '#F7FBF7',
  '--token-icon': C.pine,
  '--token-accent': C.pine,
  '--token-eyebrow': C.pine,
};

function heroData({ headline, subline, badgeText, bgImage, primaryLabel = 'Reise planen', primaryHref = '/kontakt', secondaryLabel = 'Erlebnisse ansehen', secondaryHref = '/leistungen', icon = 'Compass' }) {
  return {
    headline,
    subline,
    badgeText,
    badgeIcon: icon,
    bgMode: 'image',
    bgImage,
    bgPosition: 'center 44%',
    overlayColor: '#071A20',
    overlayOpacity: 0.56,
    primaryCta: { label: primaryLabel, href: primaryHref, icon: 'Send' },
    secondaryCta: { label: secondaryLabel, href: secondaryHref, icon: 'Map' },
    ratingText: '4,9 / 5 Gästestimmen',
    availabilityHint: 'ganzjährig planbar',
    trustItems: ['Mittenwald & Karwendel', 'ehrliche Schwierigkeit', 'ÖPNV mitgedacht', 'Tipps nach Saison'],
    trustStripColor: 'rgba(18,45,54,0.58)',
    imageEffect: 'kenBurns',
    imageEffectIntensity: 'subtle',
  };
}

function collectionHero({ category, headline, subline, bgImage }) {
  return {
    category,
    headline,
    subline,
    bgImage,
    backgroundImage: bgImage,
    bgPosition: 'center 50%',
    overlayColor: '#071A20',
    overlayOpacity: 0.58,
    imageEffect: 'parallax',
    imageEffectIntensity: 'subtle',
  };
}

function experienceCards() {
  return [
    { title: 'Familienrunde Lautersee', text: 'Kurzer Weg, viel Wasser, klare Pausenpunkte und genug Abwechslung für Kinder.', icon: 'Trees', mediaType: 'icon', href: '/c/erlebnisse/familienrunde-lautersee' },
    { title: 'Sonnenaufgang am Kranzberg', text: 'Ein früher Start mit ruhigem Blick, guter Einkehr und realistischer Gehzeit.', icon: 'Sunrise', mediaType: 'icon', href: '/c/erlebnisse/sonnenaufgang-kranzberg' },
    { title: 'Genussroute Mittenwald', text: 'Altstadt, Geigenbau, Kaffee, leichte Wege und ein Nachmittag ohne Eile.', icon: 'Coffee', mediaType: 'icon', href: '/c/erlebnisse/genussroute-mittenwald' },
    { title: 'Winterweg Ferchensee', text: 'Schnee, Wald, Seeufer und Hinweise, wann Spikes wirklich sinnvoll sind.', icon: 'Snowflake', mediaType: 'icon', href: '/c/erlebnisse/winterweg-ferchensee' },
  ];
}

function routeItems() {
  return [
    { title: 'Lautersee-Runde', text: 'Leicht, aussichtsreich und auch bei wechselhaftem Wetter gut planbar.', image: img('1500530855697-b586d89ba3ee'), lengthLabel: '6,5 km', durationLabel: '2 Std.', difficultyLabel: 'leicht', highlights: ['Seeufer', 'Einkehr', 'familientauglich'], cta: { label: 'Route ansehen', href: '/c/erlebnisse/familienrunde-lautersee' } },
    { title: 'Kranzberg am Morgen', text: 'Früh los, warm einpacken, oben kurz bleiben und mit gutem Frühstück zurück.', image: img('1500534314209-a25ddb2bd429'), lengthLabel: '8 km', durationLabel: '3 Std.', difficultyLabel: 'mittel', highlights: ['Sonnenaufgang', 'Bergblick', 'ruhige Wege'], cta: { label: 'Route ansehen', href: '/c/erlebnisse/sonnenaufgang-kranzberg' } },
    { title: 'Ferchensee im Winter', text: 'Ein stiller Winterweg mit klaren Hinweisen zu Schnee, Schuhen und Rückweg.', image: img('1519681393784-d120267933ba'), lengthLabel: '9 km', durationLabel: '3,5 Std.', difficultyLabel: 'leicht-mittel', highlights: ['Winterruhe', 'See', 'Waldweg'], cta: { label: 'Route ansehen', href: '/c/erlebnisse/winterweg-ferchensee' } },
    { title: 'Altstadt & Geigenbau', text: 'Kulturroute für Tage, an denen der Berg warten darf.', image: img('1527631746610-bca00a040d60'), lengthLabel: '3 km', durationLabel: 'halber Tag', difficultyLabel: 'leicht', highlights: ['Altstadt', 'Museum', 'Kaffee'], cta: { label: 'Route ansehen', href: '/c/erlebnisse/genussroute-mittenwald' } },
  ];
}

function destinationHighlights() {
  return [
    { title: 'Lautersee', text: 'Nah am Ort, stark im Licht und ideal für Familien, Badepausen und sanfte Einstiege.', image: img('1501785888041-af3ef285b470'), category: 'See', cta: { label: 'Route planen', href: '/c/erlebnisse/familienrunde-lautersee' } },
    { title: 'Kranzberg', text: 'Der Berg für klare Ausblicke ohne gleich den ganzen Tag zu blockieren.', image: img('1506905925346-21bda4d32df4'), category: 'Aussicht', cta: { label: 'Morgentour ansehen', href: '/c/erlebnisse/sonnenaufgang-kranzberg' } },
    { title: 'Mittenwald', text: 'Lüftlmalerei, Geigenbau, gute Wege und Pausen, die auch bei Regen funktionieren.', image: img('1519451241324-20b4ea2c4220'), category: 'Ort', cta: { label: 'Orte ansehen', href: '/orte' } },
    { title: 'Ferchensee', text: 'Ruhiger, etwas weiter, perfekt für Wintertage und Sommertage ausserhalb der Spitze.', image: img('1519904981063-b0cf448d479e'), category: 'Natur', cta: { label: 'Winterweg ansehen', href: '/c/erlebnisse/winterweg-ferchensee' } },
  ];
}

function seasons() {
  return [
    { title: 'Frühjahr', text: 'Tiefe Wege trocknen langsam. Wir empfehlen sonnige Routen, kurze Aufstiege und gute Einkehr.', image: img('1493246507139-91e8fad9978e'), periodLabel: 'April-Juni', cta: { label: 'Frühjahr planen', href: '/kontakt' } },
    { title: 'Sommer', text: 'Früh starten, Schattenwege wählen und Badestopps nicht dem Zufall überlassen.', image: img('1500534314209-a25ddb2bd429'), periodLabel: 'Juli-September', cta: { label: 'Sommerideen ansehen', href: '/leistungen' } },
    { title: 'Herbst', text: 'Klares Licht, kühle Morgen, starke Farben. Die beste Zeit für aussichtsreiche Halbtage.', image: img('1500530855697-b586d89ba3ee'), periodLabel: 'September-November', cta: { label: 'Herbstroute fragen', href: '/kontakt' } },
    { title: 'Winter', text: 'Schnee verändert Wege. Wir sagen ehrlich, wann ein Plan schön ist und wann nicht.', image: img('1519681393784-d120267933ba'), periodLabel: 'Dezember-März', cta: { label: 'Winterweg ansehen', href: '/c/erlebnisse/winterweg-ferchensee' } },
  ];
}

function events() {
  return [
    { title: 'Morgen am Kranzberg', text: 'Geführte kleine Runde mit Sonnenaufgang, Tee und Rückkehr vor dem Ortsbetrieb.', image: img('1506905925346-21bda4d32df4'), dateLabel: 'jeden Freitag im Sommer', locationLabel: 'Kranzberg', category: 'Natur', priceLabel: 'ab 29 Euro', cta: { label: 'Anfragen', href: '/kontakt' } },
    { title: 'Geigenbau & Gassen', text: 'Ruhiger Ortsgang mit Werkstattblick, Geschichte und guter Kaffeepause.', image: img('1527631746610-bca00a040d60'), dateLabel: 'samstags', locationLabel: 'Mittenwald', category: 'Kultur', priceLabel: 'ab 18 Euro', cta: { label: 'Details fragen', href: '/kontakt' } },
    { title: 'Wintersee leise', text: 'Kurze Winterrunde mit Ausrüstungscheck und realistischem Wetterfenster.', image: img('1519681393784-d120267933ba'), dateLabel: 'Dezember-Februar', locationLabel: 'Ferchensee', category: 'Winter', priceLabel: 'auf Anfrage', cta: { label: 'Termin fragen', href: '/kontakt' } },
    { title: 'Familientag am Wasser', text: 'Plan für Kinder, Buggy-Option, Badepause und Rückweg ohne Stress.', image: img('1501785888041-af3ef285b470'), dateLabel: 'Mai-September', locationLabel: 'Lautersee', category: 'Familie', priceLabel: 'individuell', cta: { label: 'Familientag planen', href: '/kontakt' } },
  ];
}

function faqItems() {
  return [
    { question: 'Sind die Routen geführt oder nur Empfehlungen?', answer: 'Beides ist möglich. Viele Gäste nutzen unsere Pläne selbstständig. Bei bestimmten Formaten vermitteln wir lokale Guides.' },
    { question: 'Plant ihr auch bei schlechtem Wetter?', answer: 'Ja. Wir schlagen lieber einen kleineren, guten Plan vor als eine schöne Route, die am Tag selbst keinen Sinn ergibt.' },
    { question: 'Können wir ohne Auto anreisen?', answer: 'Sehr oft ja. Wir achten bei jeder Empfehlung auf Bahnhof, Bus, Gehzeiten und realistische Rückwege.' },
    { question: 'Gibt es Angebote für Familien?', answer: 'Ja. Wir planen mit Pausen, Toiletten, Einkehr, Schatten, Badestellen und Wegen, die für Kinder nicht nur machbar, sondern angenehm sind.' },
  ];
}

function contactCards() {
  return [
    { icon: 'Phone', label: 'Telefon', value: '+49 8823 936407' },
    { icon: 'Mail', label: 'E-Mail', value: 'servus@karwendel-kompass.de' },
    { icon: 'MapPin', label: 'Infopunkt', value: 'Obermarkt 12, 82481 Mittenwald' },
    { icon: 'Clock', label: 'Antwortzeit', value: 'meist innerhalb eines Werktags' },
  ];
}

const tenant = {
  slug: 'tourismus',
  pat: PAT,
  host: 'www.demo.flamingomedia.online',
  wipe: true,
  publish: true,

  style: { style: 'classic' },

  brand: {
    companyName: 'Karwendel Kompass',
    tagline: 'Routen, Orte und Jahreszeiten rund um Mittenwald',
    primaryColor: C.lake,
    secondaryColor: C.pine,
    accentColor: C.sun,
    logoDisplay: 'name',
    headingFont: 'Manrope',
    bodyFont: 'Inter',
    topBarColor: C.deep,
    footerColor: C.deep,
  },

  contact: {
    phone: '+49 8823 936407',
    email: 'servus@karwendel-kompass.de',
    address: 'Obermarkt 12, 82481 Mittenwald',
    whatsapp: '+49 176 93640721',
    whatsappEnabled: true,
    whatsappColor: '#25D366',
  },

  design: {
    sectionBg: C.mist,
    sectionBgAlt: C.sand,
    cardBg: C.paper,
    cardBorder: '#D9E4E1',
    heading: C.ink,
    subheading: C.lake,
    body: C.body,
    muted: C.muted,
    brand: C.lake,
    accent: C.sun,
    icon: C.lake,
    btnBg: C.lake,
    btnText: C.white,
    badgeBg: '#E6F0EE',
    badgeText: C.deep,
    badgeBorder: '#C9D9D5',
    dividerColor: '#D9E4E1',
    eyebrow: C.sun,
    statValue: C.lake,
    quote: C.pine,
    ratingStar: C.sun,
    check: C.pine,
    onDarkHeading: C.white,
    onDarkBody: 'rgba(255,255,255,0.88)',
    onDarkMuted: 'rgba(255,255,255,0.70)',
  },

  socialLinks: {
    instagram: 'https://www.instagram.com/karwendelkompass/',
    facebook: 'https://www.facebook.com/karwendelkompass',
    google: 'https://maps.google.com/?q=Obermarkt%2012%2C%2082481%20Mittenwald',
  },

  openingHours: {
    hours: [
      { type: 'regular', day: 'Montag', hours: '09:00-17:00' },
      { type: 'regular', day: 'Dienstag', hours: '09:00-17:00' },
      { type: 'regular', day: 'Mittwoch', hours: '09:00-17:00' },
      { type: 'regular', day: 'Donnerstag', hours: '09:00-17:00' },
      { type: 'regular', day: 'Freitag', hours: '09:00-15:00' },
      { type: 'regular', day: 'Samstag', hours: '10:00-13:00', note: 'Mai bis Oktober' },
      { type: 'regular', day: 'Sonntag', closed: true },
    ],
  },

  formFields: {
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true, halfWidth: true },
      { name: 'email', label: 'E-Mail', type: 'email', required: true, halfWidth: true },
      { name: 'phone', label: 'Telefon', type: 'tel', required: false, halfWidth: true },
      { name: 'travelDate', label: 'Zeitraum', type: 'text', required: false, halfWidth: true },
      { name: 'topic', label: 'Worum geht es?', type: 'select', required: true, options: ['Familie', 'Wandern', 'Winter', 'Kultur', 'Gruppenreise', 'Noch offen'] },
      { name: 'message', label: 'Nachricht', type: 'textarea', required: true, placeholder: 'Schreiben Sie kurz Zeitraum, Personen, Kondition und was Ihnen wichtig ist.' },
    ],
  },

  seoGlobal: {
    titleTemplate: '%s | Karwendel Kompass Mittenwald',
    defaultTitle: 'Karwendel Kompass - Tourismusberatung in Mittenwald',
    defaultDescription: 'Ehrliche Routen, saisonale Empfehlungen und lokale Tipps für Mittenwald, Karwendel, Lautersee, Ferchensee und Familienurlaub in den Alpen.',
    defaultOgImage: img('1506905925346-21bda4d32df4', 1200),
    locale: 'de_DE',
  },

  navigation: {
    items: [
      { label: 'Startseite', href: '/' },
      { label: 'Erlebnisse', href: '/leistungen' },
      { label: 'Routen', href: '/routen' },
      { label: 'Orte', href: '/orte' },
      { label: 'Saison', href: '/saison' },
      { label: 'Journal', href: '/news' },
      { label: 'Kontakt', href: '/kontakt' },
    ],
    cta: { label: 'Reise planen', href: '/kontakt' },
  },

  footer: {
    columns: [
      { title: 'Planung', items: [
        { text: 'Erlebnisse', href: '/leistungen' },
        { text: 'Routen', href: '/routen' },
        { text: 'Saison', href: '/saison' },
      ] },
      { title: 'Region', items: [
        { text: 'Orte & Karte', href: '/orte' },
        { text: 'Besucherinfo', href: '/kontakt' },
        { text: 'Journal', href: '/news' },
      ] },
      { title: 'Kontakt', items: [
        { text: 'Anfrage senden', href: '/kontakt' },
        { text: 'E-Mail', href: 'mailto:servus@karwendel-kompass.de' },
        { text: 'WhatsApp', href: 'https://wa.me/4917693640721' },
      ] },
    ],
    legalLinks: [
      { label: 'Impressum', href: '/impressum' },
      { label: 'Datenschutz', href: '/datenschutz' },
    ],
    cta: { label: 'Reiseidee anfragen', href: '/kontakt' },
  },

  collections: [
    {
      key: 'erlebnisse',
      label: 'Erlebnisse',
      items: [
        buildExperienceItem({
          slug: 'familienrunde-lautersee',
          title: 'Familienrunde Lautersee',
          excerpt: 'Ein leichter Tag mit Wasser, Pausen, Einkehr und genug Natur, ohne dass der Rückweg zur Geduldsprobe wird.',
          imageId: '1501785888041-af3ef285b470',
          category: 'Familie',
        }),
        buildExperienceItem({
          slug: 'sonnenaufgang-kranzberg',
          title: 'Sonnenaufgang am Kranzberg',
          excerpt: 'Früh starten, kurz staunen, warm bleiben und rechtzeitig wieder im Ort sein.',
          imageId: '1506905925346-21bda4d32df4',
          category: 'Aussicht',
        }),
        buildExperienceItem({
          slug: 'genussroute-mittenwald',
          title: 'Genussroute Mittenwald',
          excerpt: 'Ein halber Tag für Altstadt, Geigenbau, Kaffee, kleine Läden und Wege, die auch bei Regen tragen.',
          imageId: '1527631746610-bca00a040d60',
          category: 'Kultur',
        }),
        buildExperienceItem({
          slug: 'winterweg-ferchensee',
          title: 'Winterweg Ferchensee',
          excerpt: 'Eine stille Runde für klare Wintertage, mit ehrlicher Ausrüstungsempfehlung und Rückweg-Plan.',
          imageId: '1519681393784-d120267933ba',
          category: 'Winter',
        }),
      ],
    },
    {
      key: 'news',
      label: 'Journal',
      items: [
        buildNewsItem({
          slug: 'warum-leichte-routen-nicht-langweilig-sind',
          title: 'Warum leichte Routen nicht langweilig sind',
          excerpt: 'Gute Tage entstehen nicht nur aus Höhenmetern. Manchmal ist die richtige Pause wichtiger als der nächste Gipfel.',
          imageId: '1500534314209-a25ddb2bd429',
        }),
        buildNewsItem({
          slug: 'mittenwald-ohne-auto',
          title: 'Mittenwald ohne Auto planen',
          excerpt: 'Bahnhof, Bus, kurze Wege und klare Rückfahrten: So wird ein Urlaub ohne Auto entspannter.',
          imageId: '1519451241324-20b4ea2c4220',
        }),
        buildNewsItem({
          slug: 'winterwege-realistisch-einschaetzen',
          title: 'Winterwege realistisch einschätzen',
          excerpt: 'Schnee macht Wege schön, aber auch langsamer. Diese Fragen klären wir vor jeder Winterempfehlung.',
          imageId: '1519681393784-d120267933ba',
        }),
      ],
    },
  ],

  pages: [
    {
      slug: '',
      title: 'Startseite',
      seo: {
        metaTitle: 'Karwendel Kompass - Urlaub rund um Mittenwald planen',
        metaDescription: 'Lokale Tourismusberatung für Mittenwald und Karwendel: Routen, Orte, Saison-Tipps, Familienausflüge und ehrliche Empfehlungen.',
        ogImage: img('1506905925346-21bda4d32df4', 1200),
      },
      sections: [
        { type: 'hero', data: heroData({ badgeText: 'Mittenwald · Karwendel', headline: 'Ein Tal, das nicht bespielt werden muss.', subline: 'Wir zeigen Wege, Orte und Tage, die wirklich zu Ihrer Reise passen: ruhig, klar beschrieben und ohne unnötige Umwege.', bgImage: img('1506905925346-21bda4d32df4') }), styleOverrides: darkSectionTokens() },
        { type: 'socialProofBar', data: { bgStyle: 'light', items: [
          { value: '120+', label: 'geprüfte Routen', icon: 'Map' },
          { value: '4', label: 'Jahreszeiten', icon: 'Sun' },
          { value: '1', label: 'Region im Fokus', icon: 'MapPin' },
          { value: '24h', label: 'Antwortzeit', icon: 'Clock' },
        ] }, styleOverrides: lightTokens },
        { type: 'destinationHighlights', data: { badgeText: 'Region', headline: 'Orte, die mehr können als ein Fotostopp.', subline: 'Wir empfehlen nicht alles. Nur das, was für Ihren Zeitraum, Ihre Kondition und Ihr Tempo Sinn ergibt.', items: destinationHighlights(), ctaPrimary: { label: 'Orte ansehen', href: '/orte' } }, styleOverrides: lightTokens },
        { type: 'experienceGrid', data: { headline: 'Erlebnisse mit sauberem Rahmen.', subline: 'Jede Idee hat Dauer, Zielgruppe, Wetterfenster und einen konkreten nächsten Schritt.', items: routeItems().map((r) => ({ title: r.title, text: r.text, image: r.image, category: r.difficultyLabel, durationLabel: r.durationLabel, priceLabel: r.lengthLabel, cta: r.cta })) }, styleOverrides: sandTokens },
        { type: 'featureShowcase', data: { badge: 'Planung', headline: 'Ein guter Reisetag beginnt vor dem Wetterbericht.', subline: 'Wir ordnen ein, was online oft fehlt: echte Gehzeit, Pausen, Rückwege, Andrang und Alternativen.', image: img('1500534314209-a25ddb2bd429'), features: ['Wetterfenster statt Wunschdenken', 'Routen mit Rückweg und ÖPNV', 'Familien-, Genuss- und Aktivtage', 'ehrliche Hinweise zur Schwierigkeit'], ctaLabel: 'Plan anfragen', ctaHref: '/kontakt', reversed: true }, styleOverrides: lightTokens },
        { type: 'seasonTeaser', data: { headline: 'Jede Saison hat gute Tage. Aber nicht jeder Plan passt immer.', subline: 'Wir denken Jahreszeit, Licht, Temperatur, Schnee und Andrang zusammen.', seasons: seasons() }, styleOverrides: greenTokens },
        { type: 'processSteps', data: { badgeText: 'Ablauf', headline: 'So wird aus einer Idee ein machbarer Tag.', steps: [
          { icon: 'MessageCircle', title: 'Kurz schildern', text: 'Zeitraum, Personen, Kondition, Interessen und was vermieden werden soll.' },
          { icon: 'CloudSun', title: 'Wetter und Saison prüfen', text: 'Wir gleichen Wunschroute, Wetterfenster und aktuelle Bedingungen ab.' },
          { icon: 'Map', title: 'Route sauber beschreiben', text: 'Mit Gehzeit, Pausen, Rückweg, ÖPNV und Einkehrhinweisen.' },
          { icon: 'RefreshCw', title: 'Alternative mitgeben', text: 'Falls Wetter oder Andrang kippt, gibt es einen Plan B.' },
        ] }, styleOverrides: lightTokens },
        { type: 'bentoGrid', data: { headline: 'Was wir anders machen.', subline: 'Tourismus ist für uns keine Liste von Highlights, sondern Orientierung.', items: [
          { title: 'Keine Überforderung', text: 'Lieber vier starke Ideen als zwanzig Links ohne Einordnung.', icon: 'ListChecks', span: '2' },
          { title: 'Mobilität mitgedacht', text: 'Bahnhof, Bus, Parkplatz und Rückweg gehören in denselben Plan.', icon: 'Train' },
          { title: 'Saison ehrlich', text: 'Frühjahr, Sommer, Herbst und Winter brauchen unterschiedliche Antworten.', icon: 'CalendarDays' },
          { title: 'Ortskenntnis', text: 'Wir kennen die stillen Zeitfenster, nicht nur die bekannten Bilder.', icon: 'Compass' },
        ] }, styleOverrides: sandTokens },
        { type: 'tourRoutes', data: { headline: 'Vier Routen für unterschiedliche Tage.', subline: 'Kurz eingeordnet, damit Sie schneller entscheiden können.', routes: routeItems() }, styleOverrides: lightTokens },
        { type: 'statsCounter', data: { headline: 'Klein genug für echte Empfehlungen.', subline: 'Wir bleiben bewusst regional, damit unsere Hinweise nicht beliebig werden.', stats: [
          { value: 120, suffix: '+', label: 'Routen geprüft' },
          { value: 18, suffix: '+', label: 'Orte beschrieben' },
          { value: 4, label: 'Saisons' },
          { value: 1, label: 'Region' },
        ] }, styleOverrides: greenTokens },
        { type: 'timeline', data: { badge: 'Jahresrhythmus', headline: 'Planung folgt hier dem Bergjahr.', subline: 'Nicht dem Kalender allein.', entries: [
          { year: 'März-April', title: 'Übergänge beachten', text: 'Talwege sind oft gut, höher gelegene Wege noch weich oder schneereich.' },
          { year: 'Juni-August', title: 'Früh starten', text: 'Hitze, Gewitter und Andrang werden Teil der Planung.' },
          { year: 'September-Oktober', title: 'Licht nutzen', text: 'Kühle Morgen, klare Sicht und ruhigere Wege sind oft ideal.' },
          { year: 'Winter', title: 'Langsamer denken', text: 'Schnee braucht Reservezeit, Ausrüstung und kürzere Distanzen.' },
        ] }, styleOverrides: lightTokens },
        { type: 'testimonials', data: { headline: 'Was Gäste an unserer Planung mögen.', items: [
          { quote: 'Wir hatten endlich keinen übervollen Tagesplan, sondern drei sehr gute Entscheidungen.', name: 'Familie Riedl', context: 'Sommerwoche mit Kindern', rating: 5 },
          { quote: 'Die Alternative für Regen war besser als unser ursprünglicher Plan.', name: 'M. Seiler', context: 'Kurzurlaub im Herbst', rating: 5 },
          { quote: 'ÖPNV, Einkehr und Gehzeiten waren so beschrieben, dass wir uns wirklich orientieren konnten.', name: 'Jana & Timo', context: 'Urlaub ohne Auto', rating: 5 },
          { quote: 'Nicht touristisch laut, sondern ruhig und sehr konkret.', name: 'Claudia H.', context: 'Winterwochenende', rating: 5 },
        ] }, styleOverrides: sandTokens },
        { type: 'faq', data: { headline: 'Kurz vor der Anfrage geklärt.', items: faqItems() }, styleOverrides: lightTokens },
        { type: 'ctaBand', data: { badgeText: 'Reiseidee', headline: 'Schreiben Sie uns, wie sich Ihr guter Tag anfühlen soll.', subline: 'Wir antworten mit einer ehrlichen Empfehlung, nicht mit einer endlosen Liste.', ctaPrimary: { label: 'Reise planen', href: '/kontakt', icon: 'Send' } }, styleOverrides: darkSectionTokens(C.lake) },
      ],
    },
    {
      slug: 'leistungen',
      title: 'Erlebnisse',
      seo: { metaTitle: 'Erlebnisse in Mittenwald und Karwendel', metaDescription: 'Familienrunden, Genussrouten, Winterwege und aussichtsreiche Tage rund um Mittenwald - klar beschrieben und saisonal eingeordnet.' },
      sections: [
        cineHeroSec('Erlebnisse', 'Nicht jede Idee muss ein Gipfel sein.', 'Gute Urlaubstage können leicht, ruhig, kulturell oder sehr früh beginnen.', img('1501785888041-af3ef285b470'), [ { value: '32', label: 'kuratierte Erlebnisse' }, { value: '4', label: 'Jahreszeiten' }, { value: '1', label: 'ehrliche Empfehlung' } ], 'Erlebnisse eingrenzen'),
        { type: 'servicesGrid', data: { badgeText: 'Auswahl', headline: 'Vier Einstiege für Ihren Reisetag.', subline: 'Von Familie bis Winterruhe: jedes Erlebnis hat eine klare Rolle.', ctaLabel: 'Reiseidee fragen', ctaHref: '/kontakt', manualCards: experienceCards() }, styleOverrides: lightTokens },
        { type: 'experienceGrid', data: { headline: 'Erlebnisse mit Kontext.', subline: 'Dauer, Zielgruppe und Stimmung stehen direkt dabei.', items: routeItems().map((r) => ({ title: r.title, text: r.text, image: r.image, category: r.difficultyLabel, durationLabel: r.durationLabel, priceLabel: r.lengthLabel, cta: r.cta })) }, styleOverrides: sandTokens },
        { type: 'comparisonTable', data: { badge: 'Einordnung', headline: 'Welches Erlebnis passt zu welchem Tag?', text: 'Eine erste Orientierung, bevor wir konkret planen.', columns: [{ label: 'Familie' }, { label: 'Aktiv' }, { label: 'Ruhig' }], rows: [
          { feature: 'kurze Wege', values: ['sehr gut', 'teilweise', 'gut'] },
          { feature: 'Aussicht', values: ['gut', 'sehr gut', 'mittel'] },
          { feature: 'Einkehr', values: ['wichtig', 'optional', 'wichtig'] },
          { feature: 'Wetterreserve', values: ['hoch', 'mittel', 'hoch'] },
        ], highlightCol: 0 }, styleOverrides: lightTokens },
        { type: 'collectionList', data: { headline: 'Alle Erlebnisse', subline: 'Mit Details, Hinweisen und passenden Alternativen.', collectionKey: 'erlebnisse', columns: 4, showImage: true, showExcerpt: true, showDate: false, showSortControls: false }, styleOverrides: greenTokens },
        { type: 'faq', data: { headline: 'Erlebnisse: gut zu wissen', items: faqItems() }, styleOverrides: lightTokens },
        imCtaSec('Welcher Tag darf es werden?', 'Beschreiben Sie kurz, wie Sie reisen. Wir antworten mit zwei, drei Ideen statt einer endlosen Liste.', img('1501785888041-af3ef285b470'), 'Ideen für den Zeitraum erhalten'),
      ],
    },
    {
      slug: 'routen',
      title: 'Routen',
      seo: { metaTitle: 'Routen rund um Mittenwald', metaDescription: 'Routen mit Länge, Dauer, Schwierigkeit, Einkehr und Rückweg rund um Mittenwald, Lautersee, Ferchensee und Kranzberg.' },
      sections: [
        edHeroSec('Routen', 'Routen, die vor Ort funktionieren.', 'Nicht nur schön auf der Karte, sondern realistisch für Wetter, Zeit und Kondition.', img('1500534314209-a25ddb2bd429'), { primaryCta: { label: 'Route einschätzen lassen', href: '/kontakt' }, secondaryCta: { label: 'Saison prüfen', href: '/saison' } }),
        { type: 'tourRoutes', data: { headline: 'Ausgewählte Routen.', subline: 'Kurz, konkret und mit den wichtigsten Eckdaten.', routes: routeItems() }, styleOverrides: lightTokens },
        { type: 'visitorInfo', data: { headline: 'Was in jeder Route mitgeprüft wird.', subline: 'Damit der Tag nicht an Kleinigkeiten scheitert.', introText: 'Wir beschreiben Wege so, dass Sie unterwegs weniger interpretieren müssen.', blocks: [
          { title: 'Startpunkt', text: 'Wo Sie gut beginnen und wie Sie ohne Umweg hinkommen.', icon: 'MapPin', items: ['Bahnhof', 'Parkplatz', 'Bus'] },
          { title: 'Zeitfenster', text: 'Wann Licht, Andrang und Wetter am besten zusammenpassen.', icon: 'Clock', items: ['Startzeit', 'Reserve', 'Rückweg'] },
          { title: 'Ausrüstung', text: 'Was wirklich nötig ist und was nur Sicherheit vorgaukelt.', icon: 'Backpack', items: ['Schuhe', 'Wasser', 'Winterhinweis'] },
          { title: 'Alternative', text: 'Ein Plan B, wenn Wetter oder Kondition anders ausfallen.', icon: 'RefreshCw', items: ['kurzer Weg', 'Kultur', 'Einkehr'] },
        ] }, styleOverrides: sandTokens },
        { type: 'downloadGuides', data: { badgeText: 'Downloads', headline: 'Karten und Spickzettel für unterwegs.', subline: 'Kurz gehalten, mobil lesbar und ohne überflüssige Seiten.', items: [
          { title: 'Lautersee kompakt', text: 'Familienrunde mit Badestellen, WC, Einkehr und Rückweg.', fileLabel: 'PDF anfragen', fileHref: '/kontakt', metaLabel: '2 Seiten' },
          { title: 'Wintercheck', text: 'Was vor einem Winterweg wirklich geprüft werden sollte.', fileLabel: 'PDF anfragen', fileHref: '/kontakt', metaLabel: 'Checkliste' },
          { title: 'Mittenwald ohne Auto', text: 'Bahnhof, Bus und Wege, die ohne Parkplatzsuche funktionieren.', fileLabel: 'PDF anfragen', fileHref: '/kontakt', metaLabel: 'Mobilität' },
          { title: 'Saisonkalender', text: 'Welche Routen in welchem Monat realistischer sind.', fileLabel: 'PDF anfragen', fileHref: '/kontakt', metaLabel: 'Jahresüberblick' },
        ] }, styleOverrides: greenTokens },
        { type: 'statsCounter', data: { headline: 'Keine Routenflut.', subline: 'Nur Wege, die wir wirklich verantworten können.', stats: [
          { value: 35, suffix: '+', label: 'leichte Runden' },
          { value: 42, suffix: '+', label: 'mittlere Wege' },
          { value: 18, suffix: '+', label: 'Winterideen' },
          { value: 12, suffix: '+', label: 'ÖPNV-Touren' },
        ] }, styleOverrides: lightTokens },
        { type: 'faq', data: { headline: 'Routenfragen', items: faqItems() }, styleOverrides: sandTokens },
      ],
    },
    {
      slug: 'orte',
      title: 'Orte',
      seo: { metaTitle: 'Orte und Karte rund um Mittenwald', metaDescription: 'Lautersee, Ferchensee, Kranzberg und Mittenwald mit lokaler Einordnung, Distanzen und Tipps für gute Zeitfenster.' },
      sections: [
        edHeroSec('Orte', 'Manche Orte brauchen weniger Programm.', 'Wir zeigen, wann sie wirken, wie Sie hinkommen und was in der Nähe Sinn ergibt.', img('1519451241324-20b4ea2c4220'), { primaryCta: { label: 'Ortsauswahl planen', href: '/kontakt' } }),
        { type: 'placesMap', data: { badgeText: 'Karte', headline: 'Orte mit echter Einordnung.', subline: 'Nicht jeder Punkt auf der Karte ist für jeden Tag gleich gut.', mapEmbedUrl: 'https://www.google.com/maps?q=Mittenwald%2C%20Karwendel&output=embed', places: destinationHighlights().map((d, index) => ({ ...d, distanceLabel: ['2 km vom Zentrum', '3 km vom Bahnhof', 'im Ortskern', '6 km Richtung Elmau'][index], address: ['Lautersee, Mittenwald', 'Kranzberg, Mittenwald', 'Obermarkt, Mittenwald', 'Ferchensee, Mittenwald'][index] })), ctaPrimary: { label: 'Ort passend planen', href: '/kontakt' } }, styleOverrides: lightTokens },
        { type: 'destinationHighlights', data: { badgeText: 'Highlights', headline: 'Vier Orte, vier unterschiedliche Rollen.', subline: 'See, Aussicht, Kultur und Winterruhe sind keine Konkurrenz - sie passen zu unterschiedlichen Tagen.', items: destinationHighlights(), ctaPrimary: { label: 'Reiseidee fragen', href: '/kontakt' } }, styleOverrides: sandTokens },
        { type: 'portfolio', data: { badgeText: 'Bilder', headline: 'So sieht die Region nicht im Prospekt, sondern am Tag aus.', subline: 'Ein paar Eindrücke für Licht, Wege und Stimmung.', projects: [
          { title: 'Morgenlicht am See', category: 'Lautersee', description: 'Früh, ruhig, gut für Familien mit kurzem Weg.', image: img('1501785888041-af3ef285b470'), href: '/c/erlebnisse/familienrunde-lautersee', stats: [{ label: 'Weg', value: 'leicht' }] },
          { title: 'Bergblick ohne Eile', category: 'Kranzberg', description: 'Aussicht mit klarer Startzeit und Rückweg.', image: img('1506905925346-21bda4d32df4'), href: '/c/erlebnisse/sonnenaufgang-kranzberg', stats: [{ label: 'Zeit', value: '3 Std.' }] },
          { title: 'Ort bei Regen', category: 'Mittenwald', description: 'Kultur, Kaffee und kurze Wege.', image: img('1527631746610-bca00a040d60'), href: '/c/erlebnisse/genussroute-mittenwald', stats: [{ label: 'Plan', value: 'wetterfest' }] },
        ], ctaLabel: 'Alle Erlebnisse ansehen', ctaHref: '/leistungen' }, styleOverrides: greenTokens },
        { type: 'visitorInfo', data: { headline: 'Ankommen ohne Umweg.', subline: 'Ein paar praktische Hinweise für die Region.', blocks: [
          { title: 'Bahnhof Mittenwald', text: 'Viele Touren starten sinnvoll direkt am Bahnhof oder mit kurzem Busanschluss.', icon: 'Train', items: ['München erreichbar', 'Innsbruck erreichbar', 'Busse ins Tal'] },
          { title: 'Parken', text: 'Nicht jeder Parkplatz ist zu jeder Uhrzeit eine gute Idee.', icon: 'Car', items: ['früh planen', 'Alternativen kennen', 'Rückweg beachten'] },
          { title: 'Einkehr', text: 'Öffnungszeiten wechseln saisonal. Wir prüfen lieber vorher.', icon: 'Utensils', items: ['Hütten', 'Cafes', 'Ruhetage'] },
          { title: 'Barrierearm', text: 'Wir nennen ehrlich, wo Wege wirklich leichter sind.', icon: 'Accessibility', items: ['Seewege', 'Ortsrunde', 'kurze Distanzen'] },
        ] }, styleOverrides: lightTokens },
        sharedCta('Tagesidee zusammenstellen'),
      ],
    },
    {
      slug: 'saison',
      title: 'Saison',
      seo: { metaTitle: 'Saison-Tipps für Mittenwald und Karwendel', metaDescription: 'Frühjahr, Sommer, Herbst und Winter rund um Mittenwald: welche Wege passen, worauf man achten sollte und wann Alternativen besser sind.' },
      sections: [
        cineHeroSec('Saison', 'Der gleiche Weg ist nie derselbe Tag.', 'Jahreszeit, Wetter, Licht und Andrang verändern jede Empfehlung.', img('1519681393784-d120267933ba'), undefined, 'Reisezeit prüfen'),
        { type: 'seasonTeaser', data: { headline: 'Vier Jahreszeiten, vier Planungslogiken.', subline: 'Wir ordnen nicht nur Monate, sondern echte Bedingungen ein.', seasons: seasons() }, styleOverrides: lightTokens },
        { type: 'eventsCalendar', data: { headline: 'Saisonale Formate.', subline: 'Kleine, konkrete Anlässe statt Dauerbespielung.', events: events() }, styleOverrides: sandTokens },
        { type: 'timeline', data: { badge: 'Planungsjahr', headline: 'Was wir wann besonders prüfen.', subline: 'Damit Empfehlungen nicht aus der Zeit fallen.', entries: [
          { year: 'Frühjahr', title: 'Restschnee und weiche Wege', text: 'Lieber sonnige Talrunden als zu frühe Höhenmeter.' },
          { year: 'Sommer', title: 'Hitze und Gewitterfenster', text: 'Startzeit und Schatten werden wichtiger als Distanz.' },
          { year: 'Herbst', title: 'Licht und kurze Tage', text: 'Starke Stimmung, aber weniger Zeitreserve am Nachmittag.' },
          { year: 'Winter', title: 'Schnee, Eis und Ruhe', text: 'Kürzere Wege, bessere Schuhe, klare Rückwege.' },
        ] }, styleOverrides: greenTokens },
        { type: 'comparisonTable', data: { badge: 'Saisonwahl', headline: 'Welche Saison passt zu welchem Wunsch?', text: 'Grobe Orientierung für die erste Anfrage.', columns: [{ label: 'Familie' }, { label: 'Aussicht' }, { label: 'Ruhe' }], rows: [
          { feature: 'Frühjahr', values: ['gut', 'mittel', 'sehr gut'] },
          { feature: 'Sommer', values: ['sehr gut', 'gut', 'mittel'] },
          { feature: 'Herbst', values: ['gut', 'sehr gut', 'sehr gut'] },
          { feature: 'Winter', values: ['mittel', 'gut', 'sehr gut'] },
        ], highlightCol: 2 }, styleOverrides: lightTokens },
        { type: 'faq', data: { headline: 'Saisonfragen', items: faqItems() }, styleOverrides: sandTokens },
        imCtaSec('Der richtige Tag ist planbar.', 'Sagen Sie uns Zeitraum und Tempo — wir sagen Ihnen, welcher Tag in welcher Saison wirklich trägt.', img('1519681393784-d120267933ba'), 'Saisonempfehlung erhalten'),
      ],
    },
    {
      slug: 'ueber-uns',
      title: 'Über uns',
      seo: { metaTitle: 'Über Karwendel Kompass', metaDescription: 'Karwendel Kompass aus Mittenwald: lokale Routenberatung, Saisonwissen und klare Empfehlungen für Gäste, Familien und Gruppen.' },
      sections: [
        edHeroSec('Über uns', 'Wir mögen Tourismus, der leiser hilft.', 'Nicht mehr Programm, sondern bessere Orientierung.', img('1519451241324-20b4ea2c4220'), { primaryCta: { label: 'Kompass kennenlernen', href: '/kontakt' } }),
        { type: 'textImage', data: { badge: 'Haltung', headline: 'Wir zeigen nicht alles. Wir sortieren.', text: `${p('Karwendel Kompass ist ein kleiner Infopunkt für Menschen, die ihren Urlaub nicht aus zwanzig Tabs zusammensetzen wollen. Wir hören zu, fragen nach und schlagen Wege vor, die wirklich zu Zeit, Wetter und Kondition passen.')}${p('Unser Anspruch ist einfach: Wer mit unserer Empfehlung losgeht, soll unterwegs weniger zweifeln. Deshalb sind Rückweg, Einkehr, ÖPNV und Alternative Teil derselben Antwort.')}`, image: img('1527631746610-bca00a040d60'), imageAlt: 'Mittenwald im Karwendel', layout: 'image-left', items: [
          { icon: 'Compass', title: 'regional eng', text: 'Wir bleiben rund um Mittenwald, weil gute Empfehlungen Nähe brauchen.' },
          { icon: 'CloudSun', title: 'saisonal ehrlich', text: 'Ein schöner Plan ist nur gut, wenn er am konkreten Tag funktioniert.' },
          { icon: 'Users', title: 'für echte Menschen', text: 'Familien, Paare, Gruppen und Alleinreisende brauchen unterschiedliche Antworten.' },
        ], primaryCta: { label: 'Planung besprechen', href: '/kontakt', icon: 'Send' } }, styleOverrides: lightTokens },
        { type: 'team', data: { badgeText: 'Team', headline: 'Menschen mit Ortskenntnis.', subline: 'Klein genug für Verantwortung, erfahren genug für gute Einordnung.', membersHeadline: 'Infopunkt & Planung', members: [
          { name: 'Mara Leitner', role: 'Routen & Familienplanung', image: img('1598550874175-4d0ef436c909'), bio: 'Kennt kurze Wege, Badestellen und die Punkte, an denen Kinder eine Pause brauchen.' },
          { name: 'Tobias Ried', role: 'Wetter & Winter', image: img('1506277886164-e25aa3f4ef7f'), bio: 'Prüft Bedingungen, Ausrüstung und Alternativen, bevor eine Empfehlung rausgeht.' },
          { name: 'Nina Ferchl', role: 'Kultur & Genuss', image: img('1569913486515-b74bf7751574'), bio: 'Verbindet Altstadt, Werkstätten, Cafés und kleine Wege zu ruhigen Tagen.' },
        ], valuesHeadline: 'Was uns wichtig ist', values: [
          { icon: 'CheckCircle', title: 'Klarheit', text: 'Gäste sollen verstehen, warum wir etwas empfehlen.' },
          { icon: 'Leaf', title: 'Rücksicht', text: 'Natur, Orte und Menschen vor Ort sind kein Hintergrundmotiv.' },
          { icon: 'Map', title: 'Praktikabilität', text: 'Schöne Ideen brauchen gute Startpunkte und Rückwege.' },
          { icon: 'MessageCircle', title: 'Ehrlichkeit', text: 'Wenn etwas nicht passt, sagen wir es.' },
        ], stats: [
          { value: '120+', label: 'Routen geprüft' },
          { value: '4', label: 'Jahreszeiten' },
          { value: '1', label: 'Region' },
        ] }, styleOverrides: sandTokens },
        { type: 'timeline', data: { badge: 'Geschichte', headline: 'Aus Ortswissen wurde ein Kompass.', subline: 'Nicht als Portal, sondern als kleine, gepflegte Orientierung.', entries: [
          { year: '2018', title: 'Erste Routenlisten', text: 'Für Gästehäuser, Familien und Stammgäste im Ort.' },
          { year: '2020', title: 'Mehr Nachfrage nach ruhigen Wegen', text: 'Viele wollten raus, aber nicht in dieselben Hotspots.' },
          { year: '2023', title: 'Karwendel Kompass', text: 'Ein eigener Infopunkt mit digitalen Guides und persönlichen Empfehlungen.' },
          { year: 'Heute', title: 'Bewusst regional', text: 'Wir wachsen nicht in jede Region, sondern werden rund um Mittenwald besser.' },
        ] }, styleOverrides: lightTokens },
        { type: 'bentoGrid', data: { headline: 'Unsere Prinzipien.', subline: 'Damit Empfehlungen nicht beliebig werden.', items: [
          { title: 'Weniger, aber genauer', text: 'Wir kuratieren, statt zu überfrachten.', icon: 'Filter' },
          { title: 'Wetter ist Teil der Route', text: 'Nicht eine nachträgliche Einschränkung.', icon: 'CloudSun' },
          { title: 'Pausen sind Planung', text: 'Gerade für Familien und Genussreisen.', icon: 'Coffee' },
          { title: 'Rückweg zählt', text: 'Ein guter Plan endet nicht am Zielpunkt.', icon: 'Undo2' },
        ] }, styleOverrides: greenTokens },
        { type: 'gallery', data: { headline: 'Blicke aus unserer Region.', images: [
          { src: img('1506905925346-21bda4d32df4'), alt: 'Berge im Morgenlicht' },
          { src: img('1501785888041-af3ef285b470'), alt: 'See in den Alpen' },
          { src: img('1527631746610-bca00a040d60'), alt: 'Ortskern in den Bergen' },
          { src: img('1519681393784-d120267933ba'), alt: 'Winterlicher Bergweg' },
        ] }, styleOverrides: lightTokens },
        sharedCta('Persönlich planen'),
      ],
    },
    {
      slug: 'kontakt',
      title: 'Kontakt',
      seo: { metaTitle: 'Reiseidee anfragen', metaDescription: 'Karwendel Kompass kontaktieren: Zeitraum, Personen, Interessen und Kondition nennen - wir antworten mit konkreter Empfehlung für Mittenwald und Karwendel.' },
      sections: [
        edHeroSec('Kontakt', 'Erzählen Sie uns kurz, wie der Tag sein soll.', 'Wir antworten mit einer konkreten, ehrlichen Empfehlung.', img('1500534314209-a25ddb2bd429'), { primaryCta: { label: 'Nachricht schreiben', href: '#kontakt' } }),
        { type: 'tourismContact', anchorId: 'kontakt', data: { headline: 'Reiseidee senden', subline: 'Zeitraum, Personen, Kondition, Wetterwunsch und Interessen reichen für den ersten Vorschlag.', mapEmbedUrl: 'https://www.google.com/maps?q=Obermarkt%2012%2C%2082481%20Mittenwald&output=embed', formEnabled: true, infoCards: contactCards() }, styleOverrides: lightTokens },
        { type: 'contact', data: { badgeText: 'Direktkontakt', headline: 'Wir melden uns persönlich.', introText: 'Ihre Anfrage landet nicht in einem anonymen Portal. Wir schauen sie mit Ortskenntnis an und antworten konkret.', formEnabled: true, submitLabel: 'Anfrage senden', infoCards: contactCards() }, styleOverrides: sandTokens },
        { type: 'placesMap', data: { badgeText: 'Infopunkt', headline: 'Mittenwald als Ausgangspunkt.', subline: 'Unser Infopunkt liegt nah am Bahnhof und am Obermarkt.', mapEmbedUrl: 'https://www.google.com/maps?q=Obermarkt%2012%2C%2082481%20Mittenwald&output=embed', places: [
          { title: 'Infopunkt Obermarkt', text: 'Persönliche Beratung nach Termin und kurze Rückfragen vor Ort.', category: 'Kontakt', distanceLabel: '6 Min. vom Bahnhof', address: 'Obermarkt 12, Mittenwald' },
          { title: 'Bahnhof Mittenwald', text: 'Viele Empfehlungen starten direkt hier oder mit kurzem Busanschluss.', category: 'Mobilität', distanceLabel: '500 m', address: 'Bahnhofplatz, Mittenwald' },
          { title: 'Lautersee-Bus', text: 'Saisonal gute Verbindung für leichte Tagespläne.', category: 'ÖPNV', distanceLabel: 'saisonal', address: 'Mittenwald' },
        ], ctaPrimary: { label: 'Anreise fragen', href: '/kontakt' } }, styleOverrides: lightTokens },
        { type: 'visitorInfo', data: { headline: 'Was wir für eine gute Antwort brauchen.', subline: 'Je konkreter die Anfrage, desto besser die Empfehlung.', blocks: [
          { title: 'Zeitraum', text: 'Datum oder Woche, Tageszeit und wie flexibel Sie sind.', icon: 'CalendarDays', items: ['Datum', 'Dauer', 'Reserve'] },
          { title: 'Gruppe', text: 'Personen, Alter, Kondition und besondere Anforderungen.', icon: 'Users', items: ['Kinder', 'Hund', 'Mobilität'] },
          { title: 'Interessen', text: 'Natur, Wasser, Aussicht, Kultur, Einkehr oder Ruhe.', icon: 'Heart', items: ['See', 'Berg', 'Ort'] },
          { title: 'Grenzen', text: 'Was Sie vermeiden möchten: Hitze, Steile Wege, Andrang oder lange Fahrten.', icon: 'ShieldCheck', items: ['Andrang', 'Höhe', 'Wetter'] },
        ] }, styleOverrides: greenTokens },
        { type: 'faq', data: { headline: 'Kontaktfragen', items: faqItems() }, styleOverrides: lightTokens },
      ],
    },
    {
      slug: 'news',
      title: 'Journal',
      seo: { metaTitle: 'Journal - Karwendel Kompass', metaDescription: 'Notizen zu Routen, Wetter, ÖPNV, Familienurlaub und guten Entscheidungen rund um Mittenwald und Karwendel.' },
      sections: [
        { type: 'collectionHero', data: collectionHero({ category: 'Journal', headline: 'Notizen für bessere Reisetage.', subline: 'Kurz, konkret und aus der Region geschrieben.', bgImage: img('1500530855697-b586d89ba3ee') }), styleOverrides: darkSectionTokens() },
        { type: 'featureShowcase', data: { badge: 'Warum wir schreiben', headline: 'Manche Hinweise sind vor Ort Gold wert.', subline: 'Unsere Journalbeiträge erklären Entscheidungen, die in normalen Tourenlisten oft fehlen.', image: img('1519451241324-20b4ea2c4220'), features: ['leichte Routen besser verstehen', 'ÖPNV realistisch planen', 'Winterwege einschätzen', 'Pausen und Alternativen mitdenken'], ctaLabel: 'Anfrage stellen', ctaHref: '/kontakt' }, styleOverrides: lightTokens },
        { type: 'collectionList', data: { headline: 'Alle Journal-Beiträge', subline: 'Praktische Notizen für Menschen, die gut vorbereitet reisen wollen.', collectionKey: 'news', columns: 3, showImage: true, showExcerpt: true, showDate: true, showSortControls: false }, styleOverrides: sandTokens },
        { type: 'bentoGrid', data: { headline: 'Themen, die immer wieder helfen.', subline: 'Nicht spektakulär, aber unterwegs entscheidend.', items: [
          { title: 'Startzeiten', text: 'Warum ein früher Start manchmal mehr bringt als eine längere Route.', icon: 'Clock' },
          { title: 'Pausen', text: 'Gute Pausen sind kein Luxus, sondern Teil der Tagesdramaturgie.', icon: 'Coffee' },
          { title: 'Rückwege', text: 'Wer den Rückweg plant, bleibt unterwegs entspannter.', icon: 'Undo2' },
          { title: 'Wetter', text: 'Nicht jeder Regen ist ein Problem. Manche Wolke aber schon.', icon: 'CloudRain' },
        ] }, styleOverrides: greenTokens },
        { type: 'downloadGuides', data: { headline: 'Kleine Guides statt großer Broschüren.', subline: 'Auf Anfrage schicken wir kurze PDF-Hinweise passend zu Ihrer Reise.', items: [
          { title: 'Familienrunde', text: 'Wie man leichte Routen für Kinder besser plant.', fileLabel: 'Anfragen', fileHref: '/kontakt', metaLabel: 'Familie' },
          { title: 'ÖPNV kompakt', text: 'Was ohne Auto rund um Mittenwald wirklich gut funktioniert.', fileLabel: 'Anfragen', fileHref: '/kontakt', metaLabel: 'Mobilität' },
          { title: 'Wintercheck', text: 'Die wichtigsten Fragen vor einem Winterweg.', fileLabel: 'Anfragen', fileHref: '/kontakt', metaLabel: 'Winter' },
        ] }, styleOverrides: lightTokens },
        { type: 'faq', data: { headline: 'Journal: kurz geklärt', items: faqItems() }, styleOverrides: sandTokens },
      ],
    },
    {
      slug: 'impressum',
      title: 'Impressum',
      seo: { metaTitle: 'Impressum', metaDescription: 'Impressum und Anbieterinformationen von Karwendel Kompass in Mittenwald.' },
      sections: [
        { type: 'legalContent', data: { headline: 'Impressum', blocks: [
          { title: 'Angaben gemäß § 5 TMG', text: 'Karwendel Kompass GmbH<br>Obermarkt 12<br>82481 Mittenwald<br>Deutschland' },
          { title: 'Kontakt', text: 'Telefon: +49 8823 936407<br>E-Mail: servus@karwendel-kompass.de' },
          { title: 'Vertreten durch', text: 'Mara Leitner und Tobias Ried' },
          { title: 'Umsatzsteuer-ID', text: 'DE349812670' },
          { title: 'Verantwortlich für den Inhalt', text: 'Mara Leitner, Obermarkt 12, 82481 Mittenwald' },
        ] }, styleOverrides: lightTokens },
      ],
    },
    {
      slug: 'datenschutz',
      title: 'Datenschutz',
      seo: { metaTitle: 'Datenschutz', metaDescription: 'Datenschutzhinweise von Karwendel Kompass zu Anfragen, Server-Logs und eingebetteten Karten.' },
      sections: [
        { type: 'legalContent', data: { headline: 'Datenschutzerklärung', blocks: [
          { title: 'Grundsatz', text: 'Wir verarbeiten personenbezogene Daten nur, soweit dies für die Bearbeitung Ihrer Anfrage, die Kommunikation und den Betrieb dieser Website erforderlich ist.' },
          { title: 'Kontaktformular', text: 'Wenn Sie uns über das Formular kontaktieren, speichern wir Ihre Angaben zur Bearbeitung der Anfrage und für Anschlussfragen. Eine Weitergabe ohne Einwilligung erfolgt nicht.' },
          { title: 'Server-Logs', text: 'Beim Besuch der Website werden technische Zugriffsdaten verarbeitet, um Sicherheit und Stabilität zu gewährleisten.' },
          { title: 'Karten und externe Inhalte', text: 'Eingebettete Karten können Daten an den jeweiligen Anbieter übertragen. Nutzen Sie diese Funktionen nur, wenn Sie damit einverstanden sind.' },
          { title: 'Ihre Rechte', text: 'Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung und Beschwerde bei einer Aufsichtsbehörde.' },
        ] }, styleOverrides: lightTokens },
      ],
    },
  ],
};

function edHeroSec(eyebrow, headline, text, image, opts = {}) {
  return {
    type: 'editorialHero',
    data: {
      eyebrow, headline, text: `<p>${text}</p>`, imagePrimary: image,
      ...(opts.imageSecondary ? { imageSecondary: opts.imageSecondary } : {}),
      primaryCta: opts.primaryCta || { label: 'Reise passend planen', href: '/kontakt' },
      ...(opts.secondaryCta ? { secondaryCta: opts.secondaryCta } : {}),
      ...(opts.hint ? { hint: opts.hint } : {}),
    },
  };
}

function cineHeroSec(eyebrow, headline, subline, image, facts, primaryLabel = 'Reisezeit einordnen') {
  return {
    type: 'cinematicHero',
    data: {
      eyebrow, headline, subline, image,
      overlay: 'rgba(12,36,48,0.55)', align: 'left',
      primaryCta: { label: primaryLabel, href: '/kontakt' },
      ...(facts ? { facts } : {}),
    },
  };
}

function imCtaSec(headline, subline, image, primaryLabel = 'Empfehlung anfordern') {
  return {
    type: 'immersiveCtaBanner',
    data: {
      badge: 'Karwendel Kompass', headline, subline, image,
      overlay: 'rgba(12,36,48,0.6)',
      primaryCta: { label: primaryLabel, href: '/kontakt' },
      secondaryCta: { label: 'Routen entdecken', href: '/routen' },
    },
  };
}

function sharedCta(primaryLabel = 'Reisetag planen') {
  return { type: 'ctaBand', data: { badgeText: 'Karwendel Kompass', headline: 'Lieber passend planen als alles sehen wollen.', subline: 'Sagen Sie uns kurz, wie Sie reisen. Wir sortieren die Region für Ihren konkreten Zeitraum.', ctaPrimary: { label: primaryLabel, href: '/kontakt', icon: 'Send' } }, styleOverrides: darkSectionTokens(C.lake) };
}

function buildExperienceItem({ slug, title, excerpt, imageId, category }) {
  const image = img(imageId);
  return {
    id: uuid(),
    title,
    slug,
    excerpt,
    image,
    published: true,
    data: {
      title,
      excerpt,
      image,
      category,
      sections: [
        { id: uuid(), type: 'collectionHero', data: collectionHero({ category, headline: title, subline: excerpt, bgImage: image }), styleOverrides: darkSectionTokens() },
        { id: uuid(), type: 'textImage', data: { badge: 'Einordnung', headline: `${title} passt, wenn der Tag gut sortiert sein soll.`, text: `${p(excerpt)}${p('Wir beschreiben nicht nur den schönen Teil, sondern auch Startpunkt, Rückweg, Pause und das Wetterfenster. So bleibt der Tag ruhig, auch wenn unterwegs etwas anders läuft als gedacht.')}`, image, imageAlt: title, layout: 'image-right', items: [
          { icon: 'Clock', title: 'Zeit', text: 'realistische Dauer mit Pause und Rückweg' },
          { icon: 'MapPin', title: 'Start', text: 'klarer Treffpunkt oder gut erreichbarer Einstieg' },
          { icon: 'CloudSun', title: 'Wetter', text: 'Hinweis, wann die Idee wirklich passt' },
        ], primaryCta: { label: 'Dieses Erlebnis anfragen', href: '/kontakt', icon: 'Send' }, secondaryCta: { label: 'Weitere Erlebnisse', href: '/leistungen' } }, styleOverrides: lightTokens },
        { id: uuid(), type: 'visitorInfo', data: { headline: 'Vor dem Losgehen geklärt.', subline: 'Die wichtigsten Punkte für dieses Erlebnis.', blocks: [
          { title: 'Für wen', text: 'Wir klären Kondition, Gruppe und Erwartungen vorab.', icon: 'Users', items: ['Familien', 'Paare', 'kleine Gruppen'] },
          { title: 'Weg', text: 'Start, Länge, Rückweg und Alternativen sind Teil der Empfehlung.', icon: 'Map', items: ['Startpunkt', 'Rückweg', 'Plan B'] },
          { title: 'Pause', text: 'Gute Pausen machen den Tag besser und planbarer.', icon: 'Coffee', items: ['Einkehr', 'Wasser', 'Schatten'] },
          { title: 'Saison', text: 'Wir sagen, wann diese Idee besonders gut passt.', icon: 'CalendarDays', items: ['Frühjahr', 'Sommer', 'Herbst', 'Winter'] },
        ] }, styleOverrides: sandTokens },
        { id: uuid(), type: 'featureShowcase', data: { badge: 'Warum diese Idee', headline: 'Die Route ist nur ein Teil des Tages.', subline: 'Entscheidend ist, ob sie für Ihren Zeitraum und Ihre Gruppe funktioniert.', image, features: ['konkrete Startzeit', 'Pausenpunkte', 'Rückweg beschrieben', 'Alternative bei Wetterwechsel'], ctaLabel: 'Plan anfragen', ctaHref: '/kontakt' }, styleOverrides: greenTokens },
        { id: uuid(), type: 'faq', data: { headline: 'Fragen zu diesem Erlebnis', items: faqItems() }, styleOverrides: lightTokens },
        { id: uuid(), ...sharedCta(`${title} passend planen`) },
      ],
    },
  };
}

function buildNewsItem({ slug, title, excerpt, imageId }) {
  const image = img(imageId);
  return {
    id: uuid(),
    title,
    slug,
    excerpt,
    image,
    date: '2026-06-03',
    published: true,
    data: {
      title,
      excerpt,
      image,
      date: '2026-06-03',
      sections: [
        { id: uuid(), type: 'collectionHero', data: collectionHero({ category: 'Journal', headline: title, subline: excerpt, bgImage: image }), styleOverrides: darkSectionTokens() },
        { id: uuid(), type: 'freeText', data: { headline: title, text: `${p(excerpt)}${p('In der Region rund um Mittenwald sind die kleinen Entscheidungen oft wichtiger als die großen Schlagworte: Startzeit, Rückweg, Wetter, Pause und die Frage, ob ein Plan zur Gruppe passt.')}${p('Darum schreiben wir diese Notizen. Sie sollen helfen, vor der Reise bessere Fragen zu stellen und unterwegs entspannter zu entscheiden.')}` }, styleOverrides: lightTokens },
        { id: uuid(), type: 'bentoGrid', data: { headline: 'Drei Gedanken dazu.', subline: 'Kurz und praktisch.', items: [
          { title: 'Zeitfenster', text: 'Eine gute Stunde kann mehr wert sein als ein langer Tag.', icon: 'Clock' },
          { title: 'Alternative', text: 'Plan B ist kein Kompromiss, sondern Teil guter Vorbereitung.', icon: 'RefreshCw' },
          { title: 'Ruhe', text: 'Nicht jeder Ort muss maximal ausgenutzt werden.', icon: 'Leaf' },
          { title: 'Rückweg', text: 'Der Rückweg entscheidet oft, wie entspannt der Tag endet.', icon: 'Undo2' },
        ] }, styleOverrides: sandTokens },
        { id: uuid(), ...sharedCta('Frage zum Beitrag senden') },
      ],
    },
  };
}

module.exports = tenant;
if (require.main === module) {
  run(tenant).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
