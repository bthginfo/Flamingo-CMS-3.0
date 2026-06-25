/**
 * Demo tenant: PHOTOGRAPHY
 *
 * Identität: "Lisa Morgenthaler Fotografie" — dokumentarische Fotografin in
 * Frankfurt am Main. Ruhige Reportagen, natürliche Portraits, Business-Bilder
 * und kleine Hochzeiten im Rhein-Main-Gebiet.
 *
 * Bildwelt: echtes Licht, klare Nähe, keine Studio-Klischees. Warm, editorial,
 * zurückhaltend und präzise.
 *
 * Run:
 *   node scripts/demo-tenants/photography.cjs
 */

const crypto = require('crypto');
const { run } = require('./_lib/runner.cjs');

const PAT = '83a79df5fa9e34d0a33268e5939881da066f38c5b350422ec44707eaf0864d2c';

const uuid = () => crypto.randomUUID();
const img = (id, w = 1920) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=82`;

const C = {
  ink: '#211915',
  body: '#4F4038',
  muted: '#756A62',
  cream: '#F7F0E8',
  sand: '#EADCCA',
  card: '#FFFDF8',
  copper: '#A96A45',
  blush: '#D9B8A2',
  espresso: '#2B1714',
};

const light = {
  '--token-section-bg': C.cream,
  '--token-heading': C.ink,
  '--token-body': C.body,
  '--token-muted': C.muted,
  '--token-card-bg': C.card,
  '--token-card-border': '#E5D6C8',
  '--token-icon': C.copper,
  '--token-eyebrow': C.copper,
  '--token-btn-bg': C.ink,
  '--token-btn-text': '#FFFFFF',
  '--token-badge-bg': '#F1E2D7',
  '--token-badge-text': C.espresso,
  '--token-badge-border': '#D8BBA8',
};

const paper = {
  '--token-section-bg': '#FFF9F2',
  '--token-heading': C.ink,
  '--token-body': C.body,
  '--token-muted': C.muted,
  '--token-card-bg': '#FFFFFF',
  '--token-card-border': '#E9DED3',
  '--token-icon': C.copper,
  '--token-btn-bg': C.ink,
  '--token-btn-text': '#FFFFFF',
};

const dark = {
  '--token-section-bg': C.espresso,
  '--token-heading': '#FFFFFF',
  '--token-body': 'rgba(255,255,255,0.9)',
  '--token-muted': 'rgba(255,255,255,0.72)',
  '--token-eyebrow': '#F0CDB7',
  '--token-on-dark-heading': '#FFFFFF',
  '--token-on-dark-body': 'rgba(255,255,255,0.9)',
  '--token-on-dark-muted': 'rgba(255,255,255,0.72)',
  '--token-btn-bg': '#FFF3E8',
  '--token-btn-text': C.espresso,
  '--token-card-bg': 'rgba(255,255,255,0.1)',
  '--token-card-border': 'rgba(255,255,255,0.22)',
  '--token-badge-bg': 'rgba(255,255,255,0.14)',
  '--token-badge-text': '#FFFFFF',
  '--token-badge-border': 'rgba(255,255,255,0.28)',
};

const heroDark = {
  '--token-heading': '#FFFFFF',
  '--token-body': 'rgba(255,255,255,0.9)',
  '--token-muted': 'rgba(255,255,255,0.74)',
  '--token-on-dark-heading': '#FFFFFF',
  '--token-on-dark-body': 'rgba(255,255,255,0.9)',
  '--token-on-dark-muted': 'rgba(255,255,255,0.74)',
  '--token-btn-bg': '#FFF5EA',
  '--token-btn-text': C.espresso,
  '--token-badge-bg': 'rgba(255,255,255,0.18)',
  '--token-badge-text': '#FFFFFF',
  '--token-badge-border': 'rgba(255,255,255,0.34)',
};

const link = (slug) => `/c/leistungen/${slug}`;

const photos = {
  hero: img('1492691527719-9d1e07e534b4'),
  wedding: img('1519741497674-611481863552'),
  portrait: img('1494790108377-be9c29b29330'),
  business: img('1517245386807-bb43f82c33c4'),
  family: img('1508214751196-bcfd4ca60f91'),
  about: img('1544005313-94ddf0286df2'),
  process: img('1520854221256-17451cc331bf'),
  camera: img('1516035069371-29a1b244cc32'),
  street: img('1519608487953-e999c86e7455'),
  gallery1: img('1511285560929-80b456fea0bc'),
  gallery2: img('1515886657613-9f3515b0c78f'),
  gallery3: img('1519741497674-611481863552'),
  gallery4: img('1500530855697-b586d89ba3ee'),
  gallery5: img('1517457373958-b7bdd4587205'),
  gallery6: img('1529626455594-4ff0802cfb7e'),
  gallery7: img('1537633552985-df8429e8048b'),
  gallery8: img('1521119989659-a83eee488004'),
  og: img('1492691527719-9d1e07e534b4', 1200),
};

function s(type, data, styleOverrides = undefined, variant = undefined) {
  const normalizedData = type === 'collectionHero' && data.bgImage && !data.backgroundImage
    ? { ...data, backgroundImage: data.bgImage }
    : data;
  return { id: uuid(), type, ...(variant ? { variant } : {}), data: normalizedData, ...(styleOverrides ? { styleOverrides } : {}) };
}

const serviceItems = [
  {
    title: 'Hochzeitsreportagen',
    slug: 'hochzeitsreportagen',
    excerpt: 'Leise Begleitung für Tage, die nicht gestellt wirken sollen.',
    image: photos.wedding,
    icon: 'Heart',
    text: 'Vom Getting Ready bis zur letzten Umarmung: Bilder, die den Tag erzählen, ohne ihn zu lenken.',
  },
  {
    title: 'Portraits',
    slug: 'portraits',
    excerpt: 'Portraits für Menschen, die auf Bildern wie sie selbst aussehen wollen.',
    image: photos.portrait,
    icon: 'UserRound',
    text: 'Natürliches Licht, ruhige Führung und genug Zeit, damit echte Präsenz entstehen kann.',
  },
  {
    title: 'Business & Brand',
    slug: 'business-brand',
    excerpt: 'Bildstrecken für Selbstständige, Teams und Marken mit Haltung.',
    image: photos.business,
    icon: 'BriefcaseBusiness',
    text: 'Headshots, Arbeitsmomente und visuelle Sprache für Websites, Profile und Presse.',
  },
  {
    title: 'Familien & Alltag',
    slug: 'familien-alltag',
    excerpt: 'Unaufgeregte Familienbilder mit Nähe, Humor und echten Momenten.',
    image: photos.family,
    icon: 'Users',
    text: 'Zuhause, im Park oder unterwegs: dokumentarisch, warm und ohne starre Posen.',
  },
];

function serviceSections(item) {
  return [
    s('collectionHero', {
      headline: item.title,
      subline: item.excerpt,
      bgImage: item.image,
      category: 'Leistung',
      overlayColor: '#000000',
      overlayOpacity: 0.58,
      bgPosition: 'center 45%',
      imageEffect: 'kenBurns',
      imageEffectIntensity: 'subtle',
    }, heroDark),
    s('textImage', {
      badge: 'So arbeite ich',
      headline: item.title + ' mit Ruhe im Ablauf.',
      text: `<p>${item.text}</p><p>Vor dem Shooting klären wir, was wichtig ist: Menschen, Orte, sensible Momente, Nutzungsrechte und den Ton der Bilder. Danach begleite ich aufmerksam, aber nicht laut.</p>`,
      image: item.image,
      imageAlt: item.title,
      layout: 'image-right',
      items: [
        { icon: 'MessagesSquare', title: 'Vorgespräch', text: 'Erwartungen, Ablauf und Bildsprache werden vorher sauber sortiert.' },
        { icon: 'Camera', title: 'Begleitung', text: 'Ich greife nur ein, wenn es dem Bild oder der Situation hilft.' },
        { icon: 'Images', title: 'Auswahl', text: 'Sie erhalten eine kuratierte Galerie mit klarer, natürlicher Bearbeitung.' },
      ],
      primaryCta: { label: 'Anfrage senden', href: '/kontakt', icon: 'Send' },
    }, paper),
    s('portfolioGallery', {
      headline: 'Eindrücke aus ähnlichen Shootings',
      images: [
        { src: item.image, alt: item.title, category: item.title, location: 'Rhein-Main' },
        { src: photos.gallery1, alt: 'Reportage Moment', category: 'Reportage', location: 'Frankfurt' },
        { src: photos.gallery2, alt: 'Natürliches Portrait', category: 'Portrait', location: 'Mainufer' },
        { src: photos.gallery4, alt: 'Detailaufnahme', category: 'Details', location: 'Studio' },
      ],
    }, light),
    s('shootingProcess', {
      headline: 'Vom ersten Gespräch bis zur fertigen Galerie.',
      subline: 'Transparent, ruhig und planbar, damit am Shootingtag wenig erklärt werden muss.',
      steps: [
        { icon: 'Coffee', title: 'Kennenlernen', text: 'Wir sprechen über Anlass, Menschen, Timing und Bildgefühl.' },
        { icon: 'ListChecks', title: 'Planung', text: 'Ich notiere Prioritäten, Orte, Lichtfenster und mögliche sensible Situationen.' },
        { icon: 'Camera', title: 'Shooting', text: 'Ich begleite aufmerksam und halte echte Übergänge statt starre Posen fest.' },
        { icon: 'ImageDown', title: 'Galerie', text: 'Die finale Auswahl kommt bearbeitet, sortiert und einfach teilbar.' },
      ],
    }, paper),
    s('ctaBand', {
      badgeText: 'Passt das zu Ihrem Anlass?',
      headline: 'Schreiben Sie kurz, was Sie planen.',
      subline: 'Ich melde mich mit einer ehrlichen Einschätzung zu Ablauf, Zeitfenster und Paket.',
      ctaPrimary: { label: 'Anfrage senden', href: '/kontakt', icon: 'Send' },
    }, paper),
  ];
}

const tenant = {
  slug: 'photography',
  pat: PAT,
  wipe: true,
  publish: true,

  style: { style: 'classic' },

  brand: {
    companyName: 'Lisa Morgenthaler Fotografie',
    tagline: 'Dokumentarische Fotografie in Frankfurt und Rhein-Main',
    primaryColor: C.ink,
    secondaryColor: C.copper,
    accentColor: C.blush,
    logoDisplay: 'name',
    headingFont: 'Manrope',
    bodyFont: 'Inter',
    topBarColor: C.ink,
    footerColor: C.espresso,
  },

  contact: {
    phone: '+49 69 87403021',
    email: 'hello@lisamorgenthaler.de',
    address: 'Glauburgstraße 34, 60318 Frankfurt am Main',
    whatsapp: '+49 176 87403021',
    whatsappEnabled: true,
    whatsappColor: '#25D366',
  },

  design: {
    sectionBg: '#FFF9F2',
    sectionBgAlt: C.cream,
    cardBg: C.card,
    cardBorder: '#E5D6C8',
    heading: C.ink,
    subheading: C.copper,
    body: C.body,
    muted: C.muted,
    brand: C.ink,
    accent: C.copper,
    icon: C.copper,
    btnBg: C.ink,
    btnText: '#FFFFFF',
    badgeBg: '#F1E2D7',
    badgeText: C.espresso,
    badgeBorder: '#D8BBA8',
    dividerColor: '#E8DACC',
    eyebrow: C.copper,
    statValue: C.copper,
    quote: C.ink,
    ratingStar: '#C98945',
    check: C.copper,
    onDarkHeading: '#FFFFFF',
    onDarkBody: 'rgba(255,255,255,0.9)',
    onDarkMuted: 'rgba(255,255,255,0.72)',
  },

  socialLinks: {
    instagram: 'https://www.instagram.com/lisamorgenthaler.fotografie/',
    facebook: 'https://www.facebook.com/lisamorgenthaler.fotografie',
    pinterest: 'https://www.pinterest.de/lisamorgenthaler/',
    google: 'https://g.page/lisa-morgenthaler-fotografie',
  },

  openingHours: {
    hours: [
      { type: 'regular', day: 'Montag', hours: '10:00 – 17:00', note: 'Beratung nach Termin' },
      { type: 'regular', day: 'Dienstag', hours: '10:00 – 17:00' },
      { type: 'regular', day: 'Mittwoch', hours: '10:00 – 17:00' },
      { type: 'regular', day: 'Donnerstag', hours: '10:00 – 17:00' },
      { type: 'regular', day: 'Freitag', hours: '10:00 – 15:00' },
      { type: 'regular', day: 'Samstag', hours: 'Shootings nach Vereinbarung' },
      { type: 'regular', day: 'Sonntag', closed: true, note: 'Für Hochzeiten nach Absprache' },
    ],
  },

  formFields: {
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true, halfWidth: true },
      { name: 'email', label: 'E-Mail', type: 'email', required: true, halfWidth: true },
      { name: 'phone', label: 'Telefon', type: 'tel', required: false, halfWidth: true },
      { name: 'shootingType', label: 'Art des Shootings', type: 'select', required: true, options: ['Hochzeit', 'Portrait', 'Business', 'Familie', 'Noch offen'] },
      { name: 'date', label: 'Wunschdatum oder Zeitraum', type: 'text', required: false },
      { name: 'message', label: 'Worum geht es?', type: 'textarea', required: true, placeholder: 'Erzählen Sie kurz Anlass, Ort, Personen und was Ihnen bei den Bildern wichtig ist.' },
    ],
  },

  seoGlobal: {
    titleTemplate: '%s | Lisa Morgenthaler Fotografie',
    defaultTitle: 'Lisa Morgenthaler Fotografie — Frankfurt am Main',
    defaultDescription: 'Dokumentarische Fotografie für Hochzeiten, Portraits, Familien und Business in Frankfurt, Rhein-Main und DACH.',
    defaultOgImage: photos.og,
    locale: 'de_DE',
  },

  navigation: {
    items: [
      { label: 'Startseite', href: '/' },
      { label: 'Leistungen', href: '/leistungen' },
      { label: 'Portfolio', href: '/portfolio' },
      { label: 'Ablauf', href: '/ablauf' },
      { label: 'Über mich', href: '/ueber-uns' },
      { label: 'Kontakt', href: '/kontakt' },
    ],
    cta: { label: 'Anfrage senden', href: '/kontakt' },
  },

  footer: {
    columns: [
      { title: 'Leistungen', items: serviceItems.map((item) => ({ text: item.title, href: link(item.slug) })) },
      { title: 'Studio', items: [
        { text: 'Portfolio', href: '/portfolio' },
        { text: 'Ablauf', href: '/ablauf' },
        { text: 'Über mich', href: '/ueber-uns' },
      ] },
      { title: 'Kontakt', items: [
        { text: 'Anfrage senden', href: '/kontakt' },
        { text: 'Instagram', href: 'https://www.instagram.com/lisamorgenthaler.fotografie/' },
        { text: 'Frankfurt am Main', href: '/kontakt' },
      ] },
    ],
    legalLinks: [
      { label: 'Impressum', href: '/impressum' },
      { label: 'Datenschutz', href: '/datenschutz' },
    ],
    cta: { label: 'Shooting anfragen', href: '/kontakt' },
  },

  collections: [
    {
      key: 'leistungen',
      label: 'Leistungen',
      items: serviceItems.map((item) => ({
        title: item.title,
        slug: item.slug,
        excerpt: item.excerpt,
        data: { sections: serviceSections(item) },
      })),
    },
  ],

  pages: [
    {
      slug: '',
      title: 'Startseite',
      seo: {
        metaTitle: 'Fotografin Frankfurt für Hochzeiten, Portraits und Business',
        metaDescription: 'Lisa Morgenthaler fotografiert Hochzeiten, Portraits, Familien und Marken in Frankfurt und Rhein-Main: ruhig, dokumentarisch und natürlich.',
        ogImage: photos.og,
      },
      sections: [
        s('hero', {
          badgeText: 'Frankfurt · Rhein-Main · DACH',
          badgeIcon: 'Sparkles',
          headline: 'Bilder, die ruhig bleiben, wenn der Moment groß ist.',
          subline: 'Ich begleite Hochzeiten, Portraits und Marken mit einem Blick für echte Übergänge, gutes Licht und Menschen, die nicht inszeniert wirken möchten.',
          bgImage: photos.hero,
          bgMode: 'image',
          overlayColor: '#000000',
          overlayOpacity: 0.56,
          bgPosition: 'center 42%',
          imageEffect: 'kenBurns',
          imageEffectIntensity: 'subtle',
          primaryCta: { label: 'Shooting anfragen', href: '/kontakt', icon: 'Send' },
          secondaryCta: { label: 'Portfolio ansehen', href: '/portfolio', icon: 'Images' },
          trustItems: ['180+ Reportagen', '48h erste Auswahl', 'Frankfurt · Rhein-Main', 'ruhige Begleitung'],
          trustStripColor: 'rgba(43,23,20,0.55)',
        }, heroDark),
        s('socialProofBar', {
          bgStyle: 'light',
          items: [
            { value: '4,9/5', label: 'Kundenstimmen', icon: 'Star' },
            { value: '180+', label: 'Reportagen', icon: 'Camera' },
            { value: '48h', label: 'erste Highlights', icon: 'Clock' },
            { value: 'Rhein-Main', label: 'regional zuhause', icon: 'MapPin' },
          ],
        }, paper),
        s('servicesGrid', {
          badgeText: 'Leistungen',
          headline: 'Vier Einstiege, ein ruhiger Blick.',
          subline: 'Nicht jedes Shooting braucht denselben Ablauf. Entscheidend ist, was die Bilder später leisten sollen.',
          manualCards: serviceItems.map((item) => ({
            title: item.title,
            text: item.text,
            icon: item.icon,
            image: item.image,
            mediaType: 'image',
            href: link(item.slug),
          })),
          ctaLabel: 'Alle Leistungen ansehen',
          ctaHref: '/leistungen',
        }, light),
        s('featureShowcase', {
          badge: 'Arbeitsweise',
          headline: 'Ich fotografiere leise, aber nicht zufällig.',
          subline: 'Gute Reportagen entstehen aus Vorbereitung, Aufmerksamkeit und einem klaren Gespür dafür, wann man führt und wann man wartet.',
          text: '<p>Vor jedem Auftrag sprechen wir über Prioritäten, Menschen, Licht und Situationen, die nicht gestört werden sollen. Am Tag selbst arbeite ich ruhig, verbindlich und nah genug, um die Zwischentöne zu sehen.</p>',
          image: photos.about,
          features: ['klare Vorbereitung', 'natürliche Führung', 'kuratierte Bildauswahl', 'faire Nutzungsrechte'],
          ctaLabel: 'Mehr über mich',
          ctaHref: '/ueber-uns',
          reversed: true,
        }, paper),
        s('bentoGrid', {
          headline: 'Was mir bei Bildern wichtig ist.',
          subline: 'Ein gutes Foto soll nicht erklären müssen, warum es wichtig ist.',
          items: [
            { title: 'Nähe ohne Druck', text: 'Menschen bleiben bei sich. Ich leite nur so viel, wie die Situation braucht.', icon: 'Heart', span: '2' },
            { title: 'Licht mit Plan', text: 'Tageszeit, Räume und Wetter werden vorher mitgedacht.', icon: 'Sun' },
            { title: 'Echte Übergänge', text: 'Die Sekunden zwischen zwei Posen erzählen oft mehr als die Pose selbst.', icon: 'MoveRight' },
            { title: 'Saubere Auswahl', text: 'Sie bekommen keine Bilderflut, sondern eine starke, sortierte Galerie.', icon: 'ImageDown', span: '2' },
          ],
        }, light),
        s('portfolio', {
          badgeText: 'Portfolio',
          headline: 'Ein Blick in unterschiedliche Geschichten.',
          subline: 'Hochzeiten, Portraits, Familien und Business — jeweils mit eigenem Ton.',
          projects: serviceItems.map((item) => ({
            title: item.title,
            category: 'Rhein-Main',
            description: item.excerpt,
            image: item.image,
            href: link(item.slug),
            icon: item.icon,
            stats: [{ label: 'Fokus', value: 'natürlich' }, { label: 'Übergabe', value: 'Galerie' }],
          })),
          ctaLabel: 'Portfolio öffnen',
          ctaHref: '/portfolio',
        }, paper),
        s('shootingProcess', {
          headline: 'Der Ablauf bleibt übersichtlich.',
          subline: 'Damit am Shootingtag nicht diskutiert, sondern fotografiert wird.',
          steps: [
            { icon: 'Coffee', title: 'Kennenlernen', text: 'Wir prüfen Anlass, Stimmung, Ort und was später mit den Bildern passieren soll.' },
            { icon: 'Route', title: 'Planung', text: 'Ich erstelle einen einfachen Ablauf mit Lichtfenstern, Must-haves und Puffer.' },
            { icon: 'Camera', title: 'Shooting', text: 'Ich begleite aufmerksam, greife sparsam ein und halte echte Momente fest.' },
            { icon: 'Images', title: 'Galerie', text: 'Sie erhalten eine kuratierte Online-Galerie mit klarer Bildsprache.' },
          ],
        }, light),
        s('timeline', {
          badge: 'Seit 2014',
          headline: 'Aus Design, Reportage und einem leisen Blick.',
          subline: 'Meine Arbeit ist über Jahre ruhiger, präziser und persönlicher geworden.',
          entries: [
            { year: '2014', title: 'Erste Reportagen', text: 'Hochzeiten und Portraits im Freundeskreis, noch mit viel Technik im Kopf.' },
            { year: '2017', title: 'Kommunikationsdesign', text: 'Blick für Layout, Lichtführung und visuelle Reihenfolge wird Teil jedes Shootings.' },
            { year: '2020', title: 'Rhein-Main Fokus', text: 'Mehr Business, Familien und kleine Hochzeiten in Frankfurt und Umgebung.' },
            { year: 'heute', title: 'Ruhiger Workflow', text: 'Klare Vorbereitung, natürliche Begleitung und Galerien, die sich gut erzählen.' },
          ],
        }, paper),
        s('statsCounter', {
          headline: 'Zahlen, die nur dann zählen, wenn das Gefühl stimmt.',
          subline: 'Erfahrung hilft, aber das Ergebnis muss leicht aussehen.',
          stats: [
            { value: 180, suffix: '+', label: 'Reportagen' },
            { value: 48, suffix: 'h', label: 'erste Auswahl' },
            { value: 4.9, suffix: '/5', label: 'Bewertung' },
            { value: 12, suffix: '+', label: 'Jahre Blick' },
          ],
        }, paper),
        s('testimonialMarquee', {
          headline: 'Was Kundinnen und Kunden danach sagen.',
          items: [
            { quote: 'Lisa war präsent, ohne je laut zu werden. Genau so hatten wir uns das gewünscht.', name: 'Mara & Felix', role: 'Hochzeit im Rheingau', rating: 5 },
            { quote: 'Die Portraits fühlen sich nach mir an. Nicht nach einem Shooting.', name: 'Nora F.', role: 'Business Portraits', rating: 5 },
            { quote: 'Sie hat die Kinder nicht gedrängt und trotzdem die schönsten Momente gesehen.', name: 'Familie Weber', role: 'Familienreportage', rating: 5 },
            { quote: 'Klare Vorbereitung, ruhiger Tag, starke Bilder. Für unsere Website perfekt.', name: 'Studio Kamm', role: 'Brand Shooting', rating: 5 },
            { quote: 'Wir mussten nichts spielen. Die Bilder erzählen wirklich unseren Tag.', name: 'Lena & Paul', role: 'Standesamt Frankfurt', rating: 5 },
            { quote: 'Sehr professionell, aber warm. Die Auswahl war genau richtig kuratiert.', name: 'Julia S.', role: 'Portraitserie', rating: 5 },
          ],
        }, light),
        s('faq', {
          badgeText: 'Fragen',
          headline: 'Was vor einer Anfrage oft wichtig ist.',
          expandFirst: true,
          items: [
            { question: 'Wie früh sollten wir anfragen?', answer: 'Für Hochzeiten gerne sechs bis zwölf Monate vorher. Portraits und Business-Shootings sind oft kurzfristiger möglich.' },
            { question: 'Arbeiten Sie auch außerhalb von Frankfurt?', answer: 'Ja. Ich fotografiere regelmäßig im Rhein-Main-Gebiet und reise für Hochzeiten oder Brand-Shootings auch deutschlandweit.' },
            { question: 'Bekommen wir alle Bilder?', answer: 'Sie erhalten eine kuratierte, bearbeitete Galerie. Ich liefere bewusst keine Dubletten oder Testbilder, sondern eine saubere Auswahl.' },
            { question: 'Können wir vorher telefonieren?', answer: 'Unbedingt. Ein kurzes Gespräch klärt meist schneller als lange E-Mails, ob Arbeitsweise, Ablauf und Budget passen.' },
          ],
        }, paper),
        s('ctaBand', {
          badgeText: 'Termin oder Idee?',
          headline: 'Erzählen Sie mir, was die Bilder leisten sollen.',
          subline: 'Ich antworte mit einer konkreten Einschätzung zu Ablauf, Zeit und sinnvollem Paket.',
          ctaPrimary: { label: 'Anfrage senden', href: '/kontakt', icon: 'Send' },
        }, paper),
      ],
    },
    {
      slug: 'leistungen',
      title: 'Leistungen',
      seo: {
        metaTitle: 'Fotografie-Leistungen in Frankfurt',
        metaDescription: 'Hochzeitsreportagen, Portraits, Business- und Familienfotografie in Frankfurt und Rhein-Main.',
      },
      sections: [
        s('collectionHero', {
          headline: 'Fotografie, die zum Anlass passt.',
          subline: 'Vier Formate, bewusst unterschiedlich geplant.',
          bgImage: photos.camera,
          category: 'Leistungen',
          overlayColor: '#000000',
          overlayOpacity: 0.52,
          bgPosition: 'center 52%',
        }, heroDark),
        s('servicesGrid', {
          badgeText: 'Übersicht',
          headline: 'Wählen Sie den Einstieg, der Ihrem Vorhaben am nächsten kommt.',
          subline: 'Jede Detailseite erklärt Ablauf, Bildgefühl und was vorab geklärt wird.',
          manualCards: serviceItems.map((item) => ({
            title: item.title,
            text: item.excerpt,
            icon: item.icon,
            image: item.image,
            mediaType: 'image',
            href: link(item.slug),
          })),
        }, paper),
        s('servicePackages', {
          headline: 'Pakete ohne künstliche Verkomplizierung.',
          subline: 'Die Preise dienen als Orientierung. Der genaue Umfang entsteht nach einem kurzen Gespräch.',
          packages: [
            { title: 'Portrait', name: 'Portrait', price: 'ab 390 €', description: 'Für Einzelpersonen, Selbstständige oder kleine Serien.', features: ['Vorgespräch', '60–90 Minuten Shooting', '20 bearbeitete Bilder', 'Online-Galerie'], cta: { label: 'Portrait anfragen', href: '/kontakt' }, ctaLabel: 'Portrait anfragen', ctaHref: '/kontakt' },
            { title: 'Reportage', name: 'Reportage', price: 'ab 1.900 €', description: 'Für Hochzeiten, Familien oder Events mit echter Geschichte.', features: ['Ablaufplanung', '4 Stunden Begleitung', 'kuratierte Galerie', 'erste Highlights binnen 48h'], highlighted: true, cta: { label: 'Reportage anfragen', href: '/kontakt' }, ctaLabel: 'Reportage anfragen', ctaHref: '/kontakt' },
            { title: 'Business', name: 'Business', price: 'ab 850 €', description: 'Für Websites, Teams, Selbstständige und kleine Marken.', features: ['Briefing', 'Bildkonzept', 'Nutzungsrechte', 'Auswahl für Web und Presse'], cta: { label: 'Business anfragen', href: '/kontakt' }, ctaLabel: 'Business anfragen', ctaHref: '/kontakt' },
          ],
        }, light),
        s('comparisonTable', {
          badge: 'Vergleich',
          headline: 'Welches Paket passt wozu?',
          text: 'Nicht jeder Anlass braucht einen ganzen Tag. Diese Übersicht hilft bei der ersten Orientierung.',
          columns: [{ label: 'Portrait' }, { label: 'Reportage' }, { label: 'Business' }],
          rows: [
            { feature: 'Ideal für', values: ['Einzelperson', 'Hochzeit/Familie', 'Marke/Team'] },
            { feature: 'Planung', values: ['kurz', 'ausführlich', 'konzeptionell'] },
            { feature: 'Ort', values: ['Studio/Outdoor', 'mehrere Orte', 'Office/Location'] },
            { feature: 'Ergebnis', values: ['starke Auswahl', 'ganze Geschichte', 'Website-Set'] },
          ],
          highlightCol: 1,
        }, paper),
        s('ctaBand', {
          badgeText: 'Noch unsicher?',
          headline: 'Eine kurze Nachricht reicht für eine erste Richtung.',
          subline: 'Ich sage ehrlich, welches Format sinnvoll ist und wo wir schlanker planen können.',
          ctaPrimary: { label: 'Anfrage senden', href: '/kontakt', icon: 'Send' },
        }, paper),
      ],
    },
    {
      slug: 'portfolio',
      title: 'Portfolio',
      seo: {
        metaTitle: 'Portfolio — Hochzeiten, Portraits und Business',
        metaDescription: 'Portfolio von Lisa Morgenthaler Fotografie: natürliche Reportagen, Portraits, Familien- und Businessbilder.',
      },
      sections: [
        s('collectionHero', {
          headline: 'Bilder, die nicht nach Anleitung aussehen.',
          subline: 'Ein Querschnitt aus Reportagen, Portraits, Familienmomenten und Business-Strecken.',
          bgImage: photos.gallery2,
          category: 'Portfolio',
          overlayColor: '#000000',
          overlayOpacity: 0.5,
          bgPosition: 'center 40%',
        }, heroDark),
        s('portfolioGallery', {
          headline: 'Galerie',
          images: [
            { src: photos.gallery1, alt: 'Hochzeitsmoment im Gegenlicht', category: 'Hochzeit', location: 'Rheingau' },
            { src: photos.gallery2, alt: 'Portrait im natürlichen Licht', category: 'Portrait', location: 'Frankfurt' },
            { src: photos.gallery3, alt: 'Brautpaar Reportage', category: 'Hochzeit', location: 'Mainz' },
            { src: photos.gallery4, alt: 'Business Detail', category: 'Business', location: 'Innenstadt' },
            { src: photos.gallery5, alt: 'Familienmoment', category: 'Familie', location: 'Nordend' },
            { src: photos.gallery6, alt: 'Brand Shooting', category: 'Business', location: 'Offenbach' },
            { src: photos.gallery7, alt: 'Dokumentarische Szene', category: 'Reportage', location: 'Frankfurt' },
            { src: photos.gallery8, alt: 'Portraitserie', category: 'Portrait', location: 'Studio' },
          ],
        }, paper),
        s('portfolio', {
          badgeText: 'Cases',
          headline: 'Vier Arten von Nähe.',
          projects: serviceItems.map((item) => ({
            title: item.title,
            category: 'Fotografie',
            description: item.excerpt,
            image: item.image,
            href: link(item.slug),
            icon: item.icon,
          })),
          ctaLabel: 'Leistungen ansehen',
          ctaHref: '/leistungen',
        }, light),
        s('ctaBand', {
          badgeText: 'Eigene Geschichte?',
          headline: 'Wenn Ihnen der Ton gefällt, sprechen wir über Ihren Anlass.',
          subline: 'Ein kurzes Briefing genügt, damit ich eine sinnvolle Empfehlung geben kann.',
          ctaPrimary: { label: 'Shooting anfragen', href: '/kontakt', icon: 'Send' },
        }, paper),
      ],
    },
    {
      slug: 'ablauf',
      title: 'Ablauf',
      seo: {
        metaTitle: 'Ablauf eines Shootings',
        metaDescription: 'Vom Vorgespräch bis zur Galerie: So läuft ein Shooting mit Lisa Morgenthaler Fotografie ab.',
      },
      sections: [
        s('collectionHero', {
          headline: 'Gut vorbereitet, damit es leicht wirkt.',
          subline: 'Der Ablauf ist klar, aber nie steif.',
          bgImage: photos.process,
          category: 'Ablauf',
          overlayColor: '#000000',
          overlayOpacity: 0.54,
          bgPosition: 'center 45%',
        }, heroDark),
        s('shootingProcess', {
          headline: 'Vier Schritte, die Ruhe in den Tag bringen.',
          subline: 'Sie wissen vorher, was passiert. Gleichzeitig bleibt genug Raum für echte Momente.',
          steps: [
            { icon: 'MessagesSquare', title: 'Anfrage', text: 'Sie senden Anlass, Ort und Wunschzeitraum. Ich prüfe, was sinnvoll ist.' },
            { icon: 'Coffee', title: 'Gespräch', text: 'Wir besprechen Prioritäten, sensible Situationen und den gewünschten Bildton.' },
            { icon: 'Camera', title: 'Shooting', text: 'Ich begleite ruhig, leite sparsam und achte auf Licht, Übergänge und Nähe.' },
            { icon: 'ImageDown', title: 'Galerie', text: 'Sie bekommen eine kuratierte Online-Galerie mit klarer Bildauswahl.' },
          ],
        }, paper),
        s('featureShowcase', {
          badge: 'Vorbereitung',
          headline: 'Ich plane genug, damit es am Tag nicht geplant aussieht.',
          subline: 'Gerade bei Reportagen ist Vorbereitung keine Kontrolle, sondern Entlastung.',
          image: photos.camera,
          features: ['Ablauf mit Puffer', 'Must-have-Liste', 'Licht- und Ortscheck', 'klare Übergabe'],
          ctaLabel: 'Anfrage starten',
          ctaHref: '/kontakt',
          reversed: false,
        }, light),
        s('faq', {
          badgeText: 'Details',
          headline: 'Häufige Fragen zum Ablauf.',
          items: [
            { question: 'Müssen wir posieren können?', answer: 'Nein. Ich gebe leichte Hinweise, wenn sie helfen, aber arbeite überwiegend dokumentarisch.' },
            { question: 'Wie lange dauert die Bearbeitung?', answer: 'Portraits meist zwei Wochen, Reportagen je nach Umfang vier bis sechs Wochen. Erste Highlights kommen oft früher.' },
            { question: 'Was passiert bei schlechtem Wetter?', answer: 'Wir planen Alternativen mit. Viele ruhige Bilder entstehen gerade dann, wenn das Licht weicher ist.' },
            { question: 'Gibt es Nutzungsrechte?', answer: 'Ja. Private Nutzung ist enthalten. Business- und Presseeinsatz klären wir transparent im Angebot.' },
          ],
        }, paper),
        s('ctaBand', {
          badgeText: 'Bereit?',
          headline: 'Dann sortieren wir Ihr Shooting gemeinsam.',
          subline: 'Schreiben Sie kurz Anlass, Ort und Wunschzeitraum.',
          ctaPrimary: { label: 'Termin anfragen', href: '/kontakt', icon: 'Send' },
        }, paper),
      ],
    },
    {
      slug: 'ueber-uns',
      title: 'Über mich',
      seo: {
        metaTitle: 'Über Lisa Morgenthaler',
        metaDescription: 'Über Lisa Morgenthaler: Fotografin in Frankfurt für dokumentarische Reportagen, Portraits und Business-Bilder.',
      },
      sections: [
        s('collectionHero', {
          headline: 'Ich mag Bilder, die nicht nach Anweisung aussehen.',
          subline: 'Meine Kamera ist selten der Mittelpunkt. Ich beobachte, sortiere Licht und gebe nur kurze Hinweise.',
          bgImage: photos.street,
          category: 'Über mich',
          overlayColor: '#000000',
          overlayOpacity: 0.52,
          bgPosition: 'center 45%',
        }, heroDark),
        s('photographerAbout', {
          headline: 'Ruhig im Auftreten, genau im Blick.',
          text: '<p>Ich komme aus dem Kommunikationsdesign und habe früh gemerkt, dass Bilder am stärksten sind, wenn sie nicht zu viel behaupten. Mich interessieren Gesten, Pausen, Übergänge und Menschen, die kurz vergessen, dass eine Kamera da ist.</p><p>In Frankfurt arbeite ich für Paare, Familien, Selbstständige und kleine Teams, die klare Bilder wollen, aber keine große Show.</p>',
          image: photos.about,
          signature: 'Lisa Morgenthaler',
          stats: [
            { label: 'seit', value: '2014' },
            { label: 'Reportagen', value: '180+' },
            { label: 'Basis', value: 'Frankfurt' },
          ],
        }, paper),
        s('principlesGrid', {
          badge: 'Haltung',
          headline: 'Woran Sie meine Arbeit erkennen.',
          subline: 'Nicht an Effekten, sondern an Ruhe, Reihenfolge und Respekt vor der Situation.',
          principles: [
            { eyebrow: '01', title: 'Natürlich schlägt perfekt', text: 'Ein echtes Lachen ist wertvoller als eine makellose Pose.' },
            { eyebrow: '02', title: 'Führung bleibt leicht', text: 'Ich helfe, aber nehme der Situation nicht ihre eigene Energie.' },
            { eyebrow: '03', title: 'Auswahl ist Teil der Arbeit', text: 'Eine starke Galerie braucht Kuratierung, nicht Masse.' },
            { eyebrow: '04', title: 'Bilder sollen bleiben', text: 'Bearbeitung bleibt zeitlos, warm und nicht trendabhängig.' },
          ],
          cta: { label: 'Arbeitsweise ansehen', href: '/ablauf' },
        }, light),
        s('team', {
          headline: 'Kleines Netzwerk, klare Rollen.',
          subline: 'Für größere Produktionen arbeite ich mit festen Menschen zusammen.',
          members: [
            { name: 'Lisa Morgenthaler', role: 'Fotografin & Bildauswahl', image: photos.about, text: 'Reportage, Portrait, Business und finale Kuratierung.' },
            { name: 'Jonas Weber', role: 'Second Shooter', image: photos.camera, text: 'Begleitet größere Hochzeiten und Events aus zweiter Perspektive.' },
            { name: 'Mira Schott', role: 'Styling & Produktion', image: photos.portrait, text: 'Unterstützt bei Brand-Shootings, Timings und Set-Organisation.' },
          ],
        }, paper),
        s('ctaBand', {
          badgeText: 'Kennenlernen?',
          headline: 'Ein kurzes Gespräch zeigt meist schnell, ob es passt.',
          subline: 'Ich frage lieber genau nach, bevor ich ein Paket empfehle.',
          ctaPrimary: { label: 'Gespräch anfragen', href: '/kontakt', icon: 'Send' },
        }, paper),
      ],
    },
    {
      slug: 'kontakt',
      title: 'Kontakt',
      seo: {
        metaTitle: 'Kontakt und Shooting-Anfrage',
        metaDescription: 'Kontakt zu Lisa Morgenthaler Fotografie in Frankfurt am Main. Shooting, Hochzeit, Portrait oder Business-Bilder anfragen.',
      },
      sections: [
        s('collectionHero', {
          headline: 'Erzählen Sie mir kurz, worum es geht.',
          subline: 'Ich melde mich mit einer ehrlichen Einschätzung zu Ablauf, Umfang und nächstem Schritt.',
          bgImage: photos.gallery4,
          category: 'Kontakt',
          overlayColor: '#000000',
          overlayOpacity: 0.5,
          bgPosition: 'center 50%',
        }, heroDark),
        s('contact', {
          badgeText: 'Anfrage',
          headline: 'Shooting anfragen',
          introText: 'Schreiben Sie Anlass, Ort, Zeitraum und was Ihnen bei den Bildern wichtig ist. Ich antworte in der Regel innerhalb von zwei Werktagen.',
          formEnabled: true,
          submitLabel: 'Anfrage senden',
          infoCards: [
            { icon: 'Phone', label: 'Telefon', value: '+49 69 87403021' },
            { icon: 'Mail', label: 'E-Mail', value: 'hello@lisamorgenthaler.de' },
            { icon: 'MapPin', label: 'Standort', value: 'Glauburgstraße 34, 60318 Frankfurt am Main' },
            { icon: 'Clock', label: 'Antwortzeit', value: 'meist innerhalb von 2 Werktagen' },
          ],
        }, paper),
        s('map', {
          headline: 'Frankfurt als Basis, unterwegs in Rhein-Main.',
          embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2564.845246873826!2d8.67673531593108!3d50.12652977927019!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47bd0ea5699a9f71%3A0xe13b87f1b428c9e2!2sGlauburgstra%C3%9Fe%2C%2060318%20Frankfurt%20am%20Main!5e0!3m2!1sde!2sde!4v1715000000000!5m2!1sde!2sde',
          height: 'm',
        }, light),
        s('textImage', {
          badge: 'Gut zu wissen',
          headline: 'Je konkreter die Anfrage, desto besser die Empfehlung.',
          text: '<p>Hilfreich sind Datum oder Zeitraum, Ort, Anzahl der Personen, gewünschte Nutzung der Bilder und ein kurzer Satz dazu, welche Stimmung Sie suchen.</p>',
          image: photos.process,
          imageAlt: 'Vorbereitung eines Shootings',
          layout: 'image-left',
          items: [
            { icon: 'Calendar', title: 'Datum', text: 'Fixer Termin oder grober Zeitraum.' },
            { icon: 'MapPin', title: 'Ort', text: 'Location, Stadt oder mehrere Stationen.' },
            { icon: 'Image', title: 'Nutzung', text: 'Privat, Website, Social Media oder Presse.' },
          ],
        }, paper),
      ],
    },
    {
      slug: 'impressum',
      title: 'Impressum',
      seo: { metaTitle: 'Impressum', metaDescription: 'Impressum von Lisa Morgenthaler Fotografie.' },
      sections: [
        s('legalContent', {
          headline: 'Impressum',
          blocks: [
            { title: 'Angaben gemäß § 5 TMG', text: '<p>Lisa Morgenthaler Fotografie<br>Glauburgstraße 34<br>60318 Frankfurt am Main</p>' },
            { title: 'Kontakt', text: '<p>Telefon: +49 69 87403021<br>E-Mail: hello@lisamorgenthaler.de</p>' },
            { title: 'Umsatzsteuer-ID', text: '<p>DE293847561</p>' },
            { title: 'Verantwortlich für den Inhalt', text: '<p>Lisa Morgenthaler, Anschrift wie oben.</p>' },
            { title: 'Urheberrecht', text: '<p>Alle Bilder und Texte dieser Website sind urheberrechtlich geschützt. Eine Nutzung ist nur nach ausdrücklicher Zustimmung erlaubt.</p>' },
          ],
        }, paper),
      ],
    },
    {
      slug: 'datenschutz',
      title: 'Datenschutz',
      seo: { metaTitle: 'Datenschutzerklärung', metaDescription: 'Datenschutzerklärung von Lisa Morgenthaler Fotografie.' },
      sections: [
        s('legalContent', {
          headline: 'Datenschutzerklärung',
          blocks: [
            { title: 'Verantwortliche Stelle', text: '<p>Lisa Morgenthaler Fotografie, Glauburgstraße 34, 60318 Frankfurt am Main, hello@lisamorgenthaler.de.</p>' },
            { title: 'Kontaktformular', text: '<p>Wenn Sie das Kontaktformular nutzen, verarbeiten wir Ihre Angaben ausschließlich zur Bearbeitung Ihrer Anfrage.</p>' },
            { title: 'Hosting', text: '<p>Diese Website wird bei einem professionellen Hosting-Anbieter betrieben. Dabei können technische Zugriffsdaten verarbeitet werden.</p>' },
            { title: 'Cookies und Analyse', text: '<p>Es werden nur technisch notwendige Dienste eingesetzt, sofern keine weitere Einwilligung erteilt wurde.</p>' },
            { title: 'Ihre Rechte', text: '<p>Sie haben Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung und Beschwerde bei einer Aufsichtsbehörde.</p>' },
          ],
        }, paper),
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
