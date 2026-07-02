/**
 * Demo tenant: TATTOO
 *
 * Identität: "INK DISTRICT" - ein ruhiges Tattoo-Studio in Berlin-Kreuzberg
 * mit Fine Line, Blackwork, Botanical Motifs und klarer Beratung.
 *
 * Brand:
 * - Stadt: Berlin-Kreuzberg, Nähe Paul-Lincke-Ufer
 * - Story: Tattoos ohne Laufkundschaft-Atmosphäre: Vorgespräch, Motivklärung,
 *   saubere Linien, Hygiene und Nachsorge als Teil des Prozesses.
 * - Tonalität: präzise, ruhig, direkt, leicht editorial.
 * - Bildwelt: Studio-Details, Hände, Linien, Haut, ruhiges Schwarzweiß, warmes Licht.
 * - Farben: Ink, Bone, Clay, Smoke. Classic style only.
 *
 * Run:
 *   node scripts/demo-tenants/tattoo.cjs
 */

const crypto = require('crypto');
const { run } = require('./_lib/runner.cjs');
const { darkTokens: sharedDark } = require('./_lib/theme.cjs');

const PAT = '91e6ae60a80cd9385a65671bbef0c12971446d416a403a76f38139ce26eabc70';

const uuid = () => crypto.randomUUID();
const img = (id, w = 1920) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=82`;

const C = {
  ink: '#11100E',
  graphite: '#252321',
  bone: '#F7F1E8',
  paper: '#FFFCF7',
  smoke: '#E7DED3',
  taupe: '#75685D',
  clay: '#A75C43',
  rust: '#7A352B',
  gold: '#D8A75D',
};

const lightTokens = {
  '--token-section-bg': C.paper,
  '--token-section-bg-alt': C.bone,
  '--token-card-bg': '#FFFFFF',
  '--token-card-border': '#E4D8CB',
  '--token-heading': C.ink,
  '--token-subheading': '#443A33',
  '--token-body': '#4A4038',
  '--token-muted': '#7A6D62',
  '--token-icon': C.clay,
  '--token-eyebrow': C.clay,
  '--token-stat-value': C.clay,
  '--token-quote': C.ink,
  '--token-rating-star': C.gold,
  '--token-check': C.clay,
  '--token-btn-bg': C.ink,
  '--token-btn-text': '#FFFFFF',
  '--token-badge-bg': '#EFE4D8',
  '--token-badge-text': C.ink,
  '--token-badge-border': '#D9C7B5',
};

const smokeTokens = {
  ...lightTokens,
  '--token-section-bg': C.bone,
  '--token-section-bg-alt': C.smoke,
  '--token-card-bg': '#FFFDF9',
  '--token-card-border': '#D8CABE',
};

const darkTokens = {
  ...sharedDark({ accent: '#E5B070' }),
  '--token-section-bg': C.ink,
  '--token-section-bg-alt': C.graphite,
  '--token-heading': '#FFFFFF',
  '--token-subheading': 'rgba(255,255,255,0.9)',
  '--token-body': 'rgba(255,255,255,0.86)',
  '--token-muted': 'rgba(255,255,255,0.64)',
  '--token-eyebrow': '#E5B070',
  '--token-icon': '#E5B070',
  '--token-stat-value': '#E5B070',
  '--token-quote': '#FFFFFF',
  '--token-rating-star': '#E5B070',
  '--token-check': '#E5B070',
  '--token-on-dark-heading': '#FFFFFF',
  '--token-on-dark-body': 'rgba(255,255,255,0.86)',
  '--token-on-dark-muted': 'rgba(255,255,255,0.64)',
  '--token-btn-bg': C.bone,
  '--token-btn-text': C.ink,
  '--token-badge-bg': 'rgba(255,255,255,0.14)',
  '--token-badge-text': '#FFFFFF',
  '--token-badge-border': 'rgba(255,255,255,0.25)',
  '--token-card-bg': '#1D1A17',
  '--token-card-border': '#4A4038',
};

const heroTokens = {
  ...darkTokens,
  '--token-badge-bg': 'rgba(247,241,232,0.94)',
  '--token-badge-text': C.ink,
  '--token-badge-border': 'rgba(247,241,232,0.42)',
};

const section = (type, data, styleOverrides = lightTokens, variant = 'classic') => ({
  id: uuid(),
  type,
  variant,
  data,
  styleOverrides,
});

function collectionHero(title, excerpt, imageId) {
  return section('collectionHero', {
    headline: title,
    subline: excerpt,
    bgImage: img(imageId),
    backgroundImage: img(imageId),
    overlayColor: '#090807',
    overlayOpacity: 0.62,
  }, heroTokens);
}

function buildServiceItem({ slug, title, excerpt, imageId, intro, bullets }) {
  return {
    title,
    slug,
    excerpt,
    data: {
      excerpt,
      sections: [
        collectionHero(title, excerpt, imageId),
        section('textImage', {
          headline: 'Was Sie erwarten können',
          text: `<p>${intro}</p>`,
          image: img(imageId, 1400),
          imageAlt: title,
          layout: 'image-right',
          primaryCta: { label: 'Beratung anfragen', href: '/kontakt', icon: 'Send' },
        }, lightTokens),
        section('servicesGrid', {
          headline: 'Im Termin wichtig',
          manualCards: bullets.map((text, index) => ({ title: ['Motiv', 'Platzierung', 'Haut', 'Nachsorge'][index] || 'Detail', text, icon: ['Pencil', 'ScanLine', 'ShieldCheck', 'HeartPulse'][index] || 'Check', mediaType: 'icon' })),
        }, smokeTokens),
        section('ctaBand', { badgeText: 'Motiv klären', headline: `${title} besprechen`, subline: 'Senden Sie uns eine grobe Idee, Referenzen und die gewünschte Körperstelle. Wir sagen ehrlich, was sinnvoll ist.', ctaPrimary: { label: 'Anfrage senden', href: '/kontakt', icon: 'Send' } }, darkTokens),
      ],
    },
  };
}

function buildPortfolioItem({ slug, title, excerpt, imageId, style, detail }) {
  return {
    title,
    slug,
    excerpt,
    data: {
      excerpt,
      sections: [
        collectionHero(title, excerpt, imageId),
        section('textImage', { headline: style, text: `<p>${detail}</p>`, image: img(imageId, 1400), imageAlt: title, layout: 'image-left' }, lightTokens),
        section('aftercareSteps', { headline: 'Nach dem Termin', subline: 'Die Heilung ist Teil des Ergebnisses.', steps: [
          { title: 'Folie entfernen', description: 'Wir erklären exakt, wann und wie.' },
          { title: 'Sanft reinigen', description: 'Keine Experimente, keine Duftstoffe, keine Hektik.' },
          { title: 'Ruhig halten', description: 'Sport, Sonne und Sauna warten, bis die Haut bereit ist.' },
        ] }, smokeTokens),
      ],
    },
  };
}

function buildNewsItem({ slug, title, excerpt, imageId, body }) {
  return {
    title,
    slug,
    excerpt,
    data: {
      excerpt,
      sections: [
        collectionHero(title, excerpt, imageId),
        section('freeText', { content: body }),
        section('ctaBand', { badgeText: 'Noch Fragen?', headline: 'Lieber vorher klären als später bereuen.', subline: 'Schreiben Sie uns kurz. Wir antworten ohne Verkaufsdruck.', ctaPrimary: { label: 'Kontakt aufnehmen', href: '/kontakt', icon: 'Send' } }, darkTokens),
      ],
    },
  };
}

const services = [
  { title: 'Fine Line', slug: 'fine-line', excerpt: 'Feine Linien, klare Motive und Platzierungen, die auch Jahre später funktionieren.', imageId: '1598300042247-d088f8ab3a91', intro: 'Fine Line sieht leicht aus, verzeiht aber wenig. Wir prüfen Linienbreite, Größe, Hautstelle und Alterung, bevor wir stechen.', bullets: ['Linien werden nicht zu fein geplant.', 'Platzierung wird am Körper geprüft.', 'Hautstruktur entscheidet mit.', 'Pflegehinweise sind konkret.'] },
  { title: 'Blackwork', slug: 'blackwork', excerpt: 'Kräftige Flächen, grafische Formen und saubere Kanten mit ruhiger Vorbereitung.', imageId: '1611501275019-9b5cda994e8d', intro: 'Blackwork braucht klare Komposition und Geduld. Wir planen Flächen, Negativräume und Sitzungsdauer so, dass das Ergebnis stark bleibt.', bullets: ['Form und Kontrast zuerst.', 'Sitzungen werden realistisch geplant.', 'Hautspannung wird berücksichtigt.', 'Heilung wird eng erklärt.'] },
  { title: 'Botanical Tattoos', slug: 'botanical', excerpt: 'Pflanzenmotive zwischen Illustration und Körperform, ohne beliebige Pinterest-Kopie.', imageId: '1598371839696-5c5bb00bdc28', intro: 'Botanical Motifs leben von Richtung, Rhythmus und Luft. Wir zeichnen nicht einfach eine Blume, sondern platzieren sie passend zum Körper.', bullets: ['Referenzen werden übersetzt, nicht kopiert.', 'Blätter und Linien folgen der Bewegung.', 'Größe schützt die Details.', 'Nachsorge erhält Kontrast.'] },
  { title: 'Cover-up Beratung', slug: 'cover-up', excerpt: 'Ehrliche Einschätzung, was möglich ist, was Laser braucht und was besser nicht versprochen wird.', imageId: '1542727365-19732a80dcfd', intro: 'Nicht jedes alte Tattoo lässt sich sauber überdecken. Wir prüfen Kontrast, Narben, Größe und Motivrichtung und erklären die Optionen offen.', bullets: ['Keine unrealistischen Versprechen.', 'Laser-Optionen werden mitgedacht.', 'Motivgröße bleibt ehrlich.', 'Mehrere Sessions möglich.'] },
];

const portfolioItems = [
  { title: 'Botanical Spine', slug: 'botanical-spine', excerpt: 'Feine Pflanzenlinie entlang der Wirbelsäule, bewusst reduziert.', imageId: '1611501275019-9b5cda994e8d', style: 'Botanical Fine Line', detail: 'Das Motiv wurde aus drei Referenzen neu gezeichnet und am Körper so gespiegelt, dass die Linie ruhig bleibt.' },
  { title: 'Graphischer Unterarm', slug: 'graphischer-unterarm', excerpt: 'Blackwork mit klaren Flächen, viel Negativraum und sauberer Kante.', imageId: '1598300042247-d088f8ab3a91', style: 'Blackwork', detail: 'Die Komposition nutzt die Unterarmform und vermeidet zu kleine Details, damit das Tattoo lange lesbar bleibt.' },
  { title: 'Kleine Erinnerung', slug: 'kleine-erinnerung', excerpt: 'Minimalistisches Symbol, leise platziert und mit genug Abstand zur Hautbewegung.', imageId: '1542727365-19732a80dcfd', style: 'Micro Tattoo', detail: 'Wir haben das Motiv bewusst etwas größer gesetzt als die Vorlage, damit es nicht nach kurzer Zeit verläuft.' },
];

const tenant = {
  slug: 'tattoo',
  pat: PAT,
  wipe: true,
  publish: true,

  style: { style: 'classic' },

  brand: {
    companyName: 'INK DISTRICT',
    tagline: 'Fine Line, Blackwork und ruhige Tattoo-Beratung in Berlin-Kreuzberg',
    primaryColor: C.ink,
    secondaryColor: C.clay,
    accentColor: C.gold,
    logoDisplay: 'name',
    headingFont: 'Space Grotesk',
    bodyFont: 'Inter',
    topBarColor: C.ink,
    footerColor: C.ink,
  },

  contact: {
    phone: '+49 30 2332 1840',
    email: 'studio@ink-district.berlin',
    address: 'Reichenberger Straße 48, 10999 Berlin',
    whatsapp: '+49 176 4432 1840',
    whatsappEnabled: true,
    whatsappColor: '#25D366',
  },

  design: {
    sectionBg: C.paper,
    sectionBgAlt: C.bone,
    cardBg: '#FFFFFF',
    cardBorder: '#E4D8CB',
    heading: C.ink,
    subheading: '#443A33',
    body: '#4A4038',
    muted: '#7A6D62',
    brand: C.ink,
    accent: C.clay,
    icon: C.clay,
    btnBg: C.ink,
    btnText: '#FFFFFF',
    badgeBg: '#EFE4D8',
    badgeText: C.ink,
    badgeBorder: '#D9C7B5',
    dividerColor: '#E4D8CB',
    eyebrow: C.clay,
    statValue: C.clay,
    quote: C.ink,
    ratingStar: C.gold,
    check: C.clay,
    onDarkHeading: '#FFFFFF',
    onDarkBody: 'rgba(255,255,255,0.86)',
    onDarkMuted: 'rgba(255,255,255,0.64)',
  },

  socialLinks: {
    instagram: 'https://www.instagram.com/inkdistrict.berlin/',
    google: 'https://g.page/ink-district-berlin',
  },

  openingHours: {
    monday: { closed: true },
    tuesday: { open: '11:00', close: '18:00' },
    wednesday: { open: '11:00', close: '18:00' },
    thursday: { open: '11:00', close: '19:00' },
    friday: { open: '11:00', close: '19:00' },
    saturday: { open: '10:00', close: '16:00' },
    sunday: { closed: true },
  },

  formFields: {
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'email', label: 'E-Mail', type: 'email', required: true },
      { name: 'placement', label: 'Körperstelle', type: 'text', required: true },
      { name: 'idea', label: 'Motividee und Größe', type: 'textarea', required: true },
    ],
  },

  seoGlobal: {
    siteTitle: 'INK DISTRICT Berlin',
    metaDescription: 'Tattoo-Studio in Berlin-Kreuzberg für Fine Line, Blackwork, Botanical Tattoos und ehrliche Beratung.',
    keywords: 'Tattoo Berlin, Tattoo Studio Kreuzberg, Fine Line Tattoo Berlin, Blackwork Berlin, Tattoo Beratung',
  },

  navigation: {
    items: [
      { label: 'Startseite', href: '/' },
      { label: 'Leistungen', href: '/leistungen' },
      { label: 'Artists', href: '/artists' },
      { label: 'Portfolio', href: '/portfolio' },
      { label: 'Pflege', href: '/pflege' },
      { label: 'Über uns', href: '/ueber-uns' },
      { label: 'Journal', href: '/journal' },
      { label: 'Kontakt', href: '/kontakt' },
    ],
    ctaLabel: 'Anfrage senden',
    ctaHref: '/kontakt',
  },

  footer: {
    columns: [
      { title: 'Studio', items: [{ text: 'Leistungen', href: '/leistungen' }, { text: 'Artists', href: '/artists' }, { text: 'Über uns', href: '/ueber-uns' }, { text: 'Portfolio', href: '/portfolio' }] },
      { title: 'Beratung', items: [{ text: 'Pflegehinweise', href: '/pflege' }, { text: 'Anfrage senden', href: '/kontakt' }, { text: 'Journal', href: '/journal' }] },
      { title: 'Kontakt', items: [{ text: 'Berlin-Kreuzberg', href: '/kontakt' }, { text: 'Instagram', href: 'https://www.instagram.com/inkdistrict.berlin/' }, { text: 'WhatsApp', href: 'https://wa.me/4917644321840' }] },
    ],
    legalLinks: [{ label: 'Impressum', href: '/impressum' }, { label: 'Datenschutz', href: '/datenschutz' }],
    cta: { label: 'Anfrage senden', href: '/kontakt' },
  },

  collections: [
    { key: 'leistungen', label: 'Leistungen', items: services.map(buildServiceItem) },
    { key: 'portfolio', label: 'Portfolio', items: portfolioItems.map(buildPortfolioItem) },
    {
      key: 'news',
      label: 'Studio Journal',
      items: [
        buildNewsItem({ title: 'Warum wir keine Mini-Tattoos versprechen', slug: 'keine-mini-versprechen', excerpt: 'Feine Linien brauchen trotzdem genug Größe, Abstand und ehrliche Planung.', imageId: '1598300042247-d088f8ab3a91', body: '<p>Sehr kleine Motive wirken auf dem Bildschirm oft perfekt. Auf Haut altern sie anders. Deshalb sprechen wir über Linienbreite, Hautstelle und Größe, bevor ein Motiv final wird.</p><p>Das ist keine Einschränkung, sondern Schutz für ein Tattoo, das Sie lange mögen.</p>' }),
        buildNewsItem({ title: 'Nachsorge ohne Panik', slug: 'nachsorge-ohne-panik', excerpt: 'Was in den ersten Tagen wirklich zählt und was meistens nur Unsicherheit macht.', imageId: '1598371839696-5c5bb00bdc28', body: '<p>Nachsorge muss nicht kompliziert sein. Sauber halten, ruhig lassen, nicht überpflegen und bei Unsicherheit fragen. Wir geben nach jedem Termin klare Hinweise mit.</p>' }),
        buildNewsItem({ title: 'Flash Day im Herbst', slug: 'flash-day-herbst', excerpt: 'Kleine Motive, feste Slots und Designs, die wir bewusst für diesen Tag zeichnen.', imageId: '1542727365-19732a80dcfd', body: '<p>Unser Flash Day ist kein Zufallsordner. Die Motive werden für Haut, Größe und Platzierung vorbereitet und nur in begrenzter Zahl gestochen.</p>' }),
      ],
    },
  ],

  pages: [
    {
      slug: 'startseite',
      title: 'Startseite',
      seo: { metaTitle: 'Tattoo-Studio Berlin-Kreuzberg | INK DISTRICT', metaDescription: 'Fine Line, Blackwork und Botanical Tattoos mit ruhiger Beratung, sauberer Planung und klarer Nachsorge in Berlin-Kreuzberg.' },
      sections: [
        section('glowHero', {
          eyebrow: 'Tattoo-Studio Berlin-Kreuzberg',
          headline: 'Tattoos, die leise beginnen und lange bleiben.',
          subline: 'INK DISTRICT plant Fine Line, Blackwork und Botanical Motifs mit ruhiger Beratung, sauberer Platzierung und klarer Nachsorge.',
          image: img('1598300042247-d088f8ab3a91'),
          glowColor: 'rgba(216,167,93,0.42)',
          primaryCta: { label: 'Motiv anfragen', href: '/kontakt' },
          secondaryCta: { label: 'Portfolio ansehen', href: '/portfolio' },
          facts: [{ value: '3', label: 'Artists' }, { value: '45 Min.', label: 'Beratung' }, { value: 'Kreuzberg', label: 'Studio' }],
        }, heroTokens),
        section('socialProofBar', { items: [{ icon: 'ShieldCheck', label: 'Hygiene klar erklärt' }, { icon: 'Pencil', label: 'Custom statt Kopie' }, { icon: 'Clock', label: 'Termine mit Ruhe' }, { icon: 'HeartPulse', label: 'Nachsorge inklusive' }] }, smokeTokens),
        section('servicesGrid', { badgeText: 'Stile', headline: 'Vier Wege, ein Anspruch.', subline: 'Nicht jedes Motiv passt zu jeder Hautstelle. Wir beraten, bevor wir stechen.', manualCards: services.map((s, index) => ({ title: s.title, text: s.excerpt, icon: ['PenTool', 'CircleDot', 'Leaf', 'RefreshCw'][index], mediaType: 'icon', href: `/c/leistungen/${s.slug}` })) }),
        section('styleGallery', { headline: 'Stile mit Haltung', subline: 'Eine Auswahl, wie INK DISTRICT arbeitet.', styles: [
          { name: 'Fine Line', image: img('1598300042247-d088f8ab3a91', 1200), description: 'Fein, aber nicht zu klein geplant.' },
          { name: 'Botanical', image: img('1598371839696-5c5bb00bdc28', 1200), description: 'Pflanzenmotive mit Körperbezug.' },
          { name: 'Blackwork', image: img('1611501275019-9b5cda994e8d', 1200), description: 'Kontrast, Fläche und klare Kante.' },
          { name: 'Micro Symbols', image: img('1542727365-19732a80dcfd', 1200), description: 'Reduziert, aber haltbar gedacht.' },
        ] }, lightTokens),
        section('featureShowcase', { badge: 'Beratung', headline: 'Wir sagen auch, wenn eine Idee so nicht funktioniert.', subline: 'Das ist der Unterschied zwischen schönem Entwurf und gutem Tattoo.', text: '<p>Wir prüfen Motiv, Größe, Körperstelle und Alterung gemeinsam. Wenn eine Vorlage zu fein, zu klein oder falsch platziert wäre, erklären wir die bessere Lösung.</p>', image: img('1611501275019-9b5cda994e8d'), features: ['keine 1:1-Kopien', 'realistische Größen', 'klare Session-Planung', 'Nachsorge schriftlich'], ctaLabel: 'Beratung anfragen', ctaHref: '/kontakt' }, smokeTokens),
        section('processSteps', { badgeText: 'Ablauf', headline: 'Vom Motiv zur Haut.', subline: 'Ein ruhiger Prozess ist kein Luxus. Er schützt das Ergebnis.', steps: [
          { icon: 'Send', title: 'Anfrage', text: 'Sie senden Motividee, Körperstelle, Größe und Referenzen.' },
          { icon: 'MessageCircle', title: 'Vorgespräch', text: 'Wir klären Stil, Machbarkeit und Artist.' },
          { icon: 'PencilRuler', title: 'Entwurf', text: 'Das Motiv wird für Ihren Körper übersetzt.' },
          { icon: 'ShieldCheck', title: 'Termin', text: 'Sauber, konzentriert und ohne Laufkundschaft-Stress.' },
        ] }),
        section('portfolio', { badgeText: 'Portfolio', headline: 'Arbeiten, die nicht schreien müssen.', subline: 'Auswahl aus Fine Line, Blackwork und Botanical Motifs.', projects: portfolioItems.map((p) => ({ title: p.title, category: p.style, description: p.excerpt, image: img(p.imageId, 1200), href: `/c/portfolio/${p.slug}`, stats: [{ label: 'Stil', value: p.style }, { label: 'Termin', value: 'Custom' }] })), ctaLabel: 'Alles ansehen', ctaHref: '/portfolio' }, lightTokens),
        section('pricingInfo', { headline: 'Preise ohne Ratespiel.', subline: 'Finale Preise hängen von Größe, Stelle und Aufwand ab. Diese Werte helfen bei der Orientierung.', items: [
          { label: 'Beratung', value: 'kostenfrei', note: 'für konkrete Anfragen' },
          { label: 'Studio Minimum', value: '120 €', note: 'inkl. Vorbereitung' },
          { label: 'Kleine Motive', value: 'ab 160 €', note: 'je nach Stelle' },
          { label: 'Tagessitzung', value: 'auf Anfrage', note: 'für größere Projekte' },
        ], notes: ['Keine Preiszusage ohne Motivprüfung.', 'Anzahlung erst nach Terminbestätigung.'] }, smokeTokens),
        section('proofWall', { badge: 'Stimmen', headline: 'Ruhig im Studio, klar im Ergebnis.', subline: 'Was Kundinnen und Kunden häufig nennen.', proofs: [{ value: '4,9/5', label: 'Google-Bewertung', note: 'aus Studio-Feedback' }, { value: '3', label: 'Artists', note: 'jeweils eigene Schwerpunkte' }, { value: '2016', label: 'gegründet', note: 'in Kreuzberg' }], reviews: [
          { quote: 'Ich hatte endlich das Gefühl, dass jemand meine Idee verstanden und verbessert hat.', name: 'Mara L.', context: 'Fine Line', rating: 5 },
          { quote: 'Sehr ruhig, sehr sauber, keine Hektik. Genau so sollte ein erstes Tattoo laufen.', name: 'Jonas K.', context: 'Blackwork', rating: 5 },
          { quote: 'Die Nachsorge war klarer als alles, was ich vorher online gelesen hatte.', name: 'Nina S.', context: 'Botanical', rating: 5 },
        ] }, lightTokens),
        section('aftercareSteps', { headline: 'Nachsorge ist kein Beipackzettel.', subline: 'Wir erklären sie vor Ort und geben sie schriftlich mit.', steps: [
          { title: 'Sauber halten', description: 'Hände waschen, sanft reinigen, trocken tupfen.' },
          { title: 'Nicht überpflegen', description: 'Weniger Produkt, mehr Ruhe. Die Haut muss arbeiten können.' },
          { title: 'Sonne vermeiden', description: 'UV, Sauna und Sport erst, wenn die Haut bereit ist.' },
          { title: 'Nachfragen erlaubt', description: 'Wenn etwas unsicher wirkt, schreib uns lieber früh.' },
        ] }, smokeTokens),
        section('faq', { headline: 'Kurz geklärt.', subline: 'Die häufigsten Fragen vor dem ersten Termin.', items: [
          { question: 'Kann ich einfach vorbeikommen?', answer: 'Für Beratung bitte vorher schreiben. So können wir genug Zeit einplanen.' },
          { question: 'Stecht Ihr jedes Motiv?', answer: 'Nein. Wir stechen nur Motive, die technisch, ethisch und stilistisch zu uns passen.' },
          { question: 'Wie läuft die Anzahlung?', answer: 'Nach Terminbestätigung. Sie wird mit dem Endpreis verrechnet.' },
          { question: 'Was soll ich zur Anfrage senden?', answer: 'Motividee, Körperstelle, ungefähre Größe, Referenzen und gern ein Foto der Stelle.' },
        ] }),
        section('ctaBand', { badgeText: 'Motiv im Kopf?', headline: 'Lieber einmal sauber klären.', subline: 'Schreib uns Deine Idee. Wir antworten mit einer ehrlichen Einschätzung und dem passenden nächsten Schritt.', ctaPrimary: { label: 'Anfrage senden', href: '/kontakt', icon: 'Send' } }, darkTokens),
      ],
    },
    {
      slug: 'leistungen',
      title: 'Leistungen',
      seo: { metaTitle: 'Tattoo-Stile & Beratung | INK DISTRICT', metaDescription: 'Fine Line, Blackwork, Botanical Tattoos und Cover-up Beratung bei INK DISTRICT Berlin.' },
      sections: [
        collectionHero('Stile, Beratung und saubere Entscheidungen.', 'Unsere Leistungen sind keine Paketliste. Sie helfen, die richtige Richtung für Ihr Motiv zu finden.', '1611501275019-9b5cda994e8d'),
        section('servicesGrid', { headline: 'Was wir anbieten', subline: 'Jede Karte führt zu einer Detailseite mit mehr Kontext.', manualCards: services.map((s, index) => ({ title: s.title, text: s.excerpt, icon: ['PenTool', 'CircleDot', 'Leaf', 'RefreshCw'][index], mediaType: 'icon', href: `/c/leistungen/${s.slug}` })) }),
        section('comparisonTable', { badge: 'Orientierung', headline: 'Welcher Stil passt wozu?', text: 'Eine erste Orientierung. Die endgültige Entscheidung treffen wir anhand von Motiv und Körperstelle.', columns: [{ label: 'Fine Line' }, { label: 'Blackwork' }, { label: 'Botanical' }], highlightCol: 0, rows: [
          { feature: 'Wirkung', values: ['fein', 'grafisch', 'organisch'] },
          { feature: 'Planung', values: ['sehr präzise', 'kontraststark', 'bewegungsnah'] },
          { feature: 'Größe', values: ['nicht zu klein', 'mittel bis groß', 'flexibel'] },
          { feature: 'Ideal für', values: ['Symbole/Text', 'Flächen/Formen', 'Pflanzen/Linien'] },
        ] }, smokeTokens),
        section('pricingInfo', { headline: 'Preisrahmen', subline: 'Transparent genug für Planung, ehrlich genug für echte Motive.', items: [
          { label: 'Studio Minimum', value: '120 €', note: 'für kleine Motive' },
          { label: 'Custom Entwurf', value: 'inklusive', note: 'bei bestätigtem Termin' },
          { label: 'Halber Tag', value: 'ab 420 €', note: 'je nach Aufwand' },
          { label: 'Cover-up', value: 'nach Beratung', note: 'Laser ggf. empfohlen' },
        ] }, lightTokens),
        section('ctaBand', { badgeText: 'Motiv prüfen', headline: 'Nicht sicher, welcher Stil passt?', subline: 'Schick uns Deine Idee. Wir sortieren sie gemeinsam.', ctaPrimary: { label: 'Beratung anfragen', href: '/kontakt', icon: 'Send' } }, darkTokens),
      ],
    },
    {
      slug: 'artists',
      title: 'Artists',
      seo: { metaTitle: 'Artists | INK DISTRICT Berlin', metaDescription: 'Das Team von INK DISTRICT: Fine Line, Blackwork und Botanical Tattoos in Berlin-Kreuzberg.' },
      sections: [
        collectionHero('Drei Artists, drei Handschriften.', 'Wir matchen Motiv und Artist bewusst, statt jede Anfrage irgendwo einzusortieren.', '1542727365-19732a80dcfd'),
        section('artistGrid', { headline: 'Wer bei uns sticht', subline: 'Jede Person hat einen klaren Schwerpunkt.', artists: [
          { name: 'Lea Novak', image: img('1494790108377-be9c29b29330', 900), styles: ['Fine Line', 'Botanical'], bio: 'Lea arbeitet ruhig, fein und mit viel Blick für Körperlinien.', instagram: '@lea.inkdistrict', href: '/kontakt' },
          { name: 'Miro Sander', image: img('1500648767791-00dcc994a43e', 900), styles: ['Blackwork', 'Graphic'], bio: 'Miro denkt in Flächen, Kanten und Negativraum.', instagram: '@miro.blackwork', href: '/kontakt' },
          { name: 'Noor Ali', image: img('1531123897727-8f129e1688ce', 900), styles: ['Micro Symbols', 'Script'], bio: 'Noor reduziert Motive, ohne sie beliebig zu machen.', instagram: '@noor.lines', href: '/kontakt' },
        ] }, lightTokens),
        section('team', { headline: 'Studio statt Durchlauf.', subline: 'Wir arbeiten bewusst mit wenigen Artists und klaren Schwerpunkten.', membersHeadline: 'Team', members: [
          { name: 'Lea Novak', role: 'Fine Line & Botanical', image: img('1494790108377-be9c29b29330', 900), bio: 'Feine Linien, ruhige Motive, präzise Platzierung.' },
          { name: 'Miro Sander', role: 'Blackwork', image: img('1500648767791-00dcc994a43e', 900), bio: 'Grafische Formen, Flächen und Cover-up Einschätzung.' },
          { name: 'Noor Ali', role: 'Micro & Script', image: img('1531123897727-8f129e1688ce', 900), bio: 'Reduzierte Zeichen, Schrift und kleine Erinnerungen.' },
        ], valuesHeadline: 'Wie wir arbeiten', values: [
          { icon: 'ShieldCheck', title: 'Hygiene sichtbar', text: 'Abläufe werden erklärt, nicht versteckt.' },
          { icon: 'Pencil', title: 'Custom zuerst', text: 'Referenzen sind Startpunkte, keine Kopiervorlagen.' },
          { icon: 'Clock', title: 'Zeitfenster realistisch', text: 'Wir planen nicht knapper, als Haut und Motiv erlauben.' },
        ] }, smokeTokens),
        section('ctaBand', { badgeText: 'Artist wählen', headline: 'Noch unsicher, wer passt?', subline: 'Beschreib uns Dein Motiv. Wir schlagen den passenden Artist vor.', ctaPrimary: { label: 'Motiv senden', href: '/kontakt', icon: 'Send' } }, darkTokens),
      ],
    },
    {
      slug: 'portfolio',
      title: 'Portfolio',
      seo: { metaTitle: 'Tattoo Portfolio | INK DISTRICT', metaDescription: 'Portfolio von INK DISTRICT Berlin: Fine Line, Blackwork und Botanical Tattoos.' },
      sections: [
        collectionHero('Nicht jede Arbeit muss laut sein.', 'Eine Auswahl aus Tattoos, bei denen Linie, Platzierung und Nachsorge zusammenpassen.', '1598300042247-d088f8ab3a91'),
        section('collectionList', { headline: 'Portfolio ansehen', subline: 'Detailseiten zeigen Kontext, Stil und Pflegehinweise.', collectionKey: 'portfolio', columns: 3, showImage: true, showDate: false, showExcerpt: true, showSortControls: false }),
        section('galleryGrid', { headline: 'Studio-Mood', subline: 'Ruhige Details aus dem Alltag.', columns: 3, images: [
          { src: img('1598300042247-d088f8ab3a91', 1000), alt: 'Tattoo Detail mit feinen Linien', caption: 'Linienprüfung' },
          { src: img('1611501275019-9b5cda994e8d', 1000), alt: 'Blackwork Tattoo Detail', caption: 'Kontrast' },
          { src: img('1598371839696-5c5bb00bdc28', 1000), alt: 'Botanical Tattoo Motiv', caption: 'Botanical' },
          { src: img('1542727365-19732a80dcfd', 1000), alt: 'Tattoo Studio Detail', caption: 'Vorbereitung' },
        ] }, smokeTokens),
        section('ctaBand', { badgeText: 'Eigenes Motiv?', headline: 'Portfolio inspiriert. Beratung entscheidet.', subline: 'Senden Sie uns gern Referenzen, aber erwarten Sie keine Kopie.', ctaPrimary: { label: 'Custom anfragen', href: '/kontakt', icon: 'Send' } }, darkTokens),
      ],
    },
    {
      slug: 'pflege',
      title: 'Pflege',
      seo: { metaTitle: 'Tattoo Nachsorge | INK DISTRICT', metaDescription: 'Klare Nachsorgehinweise für Tattoos: Reinigung, Pflege, Heilung und Warnzeichen.' },
      sections: [
        collectionHero('Gute Heilung beginnt vor dem Termin.', 'Nachsorge ist einfacher, wenn vorher klar ist, was die Haut braucht.', '1598371839696-5c5bb00bdc28'),
        section('aftercareSteps', { headline: 'Die ersten Tage', subline: 'Konkret, ruhig und ohne Produkt-Chaos.', steps: [
          { title: 'Folie nach Anleitung entfernen', description: 'Nicht früher, nicht später aus Unsicherheit.' },
          { title: 'Lauwarm reinigen', description: 'Sanft, kurz und ohne Duftstoffe.' },
          { title: 'Dünn pflegen', description: 'Zu viel Creme hält die Haut unnötig feucht.' },
          { title: 'Nicht kratzen', description: 'Juckreiz ist normal. Kratzen zerstört Linien.' },
        ] }, smokeTokens),
        section('noticeBanner', { headline: 'Wenn etwas komisch wirkt', text: 'Schick uns ein Foto und beschreibe kurz, seit wann es so aussieht. Wir sagen Dir, ob es normal ist oder abgeklärt werden sollte.', tone: 'info' }, lightTokens),
        section('faq', { headline: 'Nachsorge-Fragen', subline: 'Kurz und ehrlich.', items: [
          { question: 'Wann darf ich wieder Sport machen?', answer: 'Meist nach einigen Tagen, je nach Stelle und Heilung. Wir sagen es beim Termin konkret.' },
          { question: 'Darf Sonne ans Tattoo?', answer: 'Frisch nicht. Später nur mit konsequentem Schutz.' },
          { question: 'Welche Creme soll ich nehmen?', answer: 'Wir empfehlen eine einfache, geeignete Pflege und erklären die Menge.' },
          { question: 'Was ist normal?', answer: 'Leichte Rötung, Spannung und Jucken können normal sein. Bei Unsicherheit bitte schreiben.' },
        ] }),
        section('ctaBand', { badgeText: 'Unsicher?', headline: 'Lieber einmal zu früh fragen.', subline: 'Nachsorge-Fragen sind kein Störfaktor. Sie schützen das Ergebnis.', ctaPrimary: { label: 'Frage senden', href: '/kontakt', icon: 'Send' } }, darkTokens),
      ],
    },
    {
      slug: 'ueber-uns',
      title: 'Über uns',
      seo: { metaTitle: 'Über INK DISTRICT | Tattoo-Studio Berlin', metaDescription: 'INK DISTRICT ist ein ruhiges Tattoo-Studio in Berlin-Kreuzberg mit Fokus auf Beratung, Hygiene, Fine Line und Blackwork.' },
      sections: [
        collectionHero('Ein Studio, das lieber sauber plant als laut verkauft.', 'INK DISTRICT ist aus der Idee entstanden, Tattoo-Beratung ruhiger, ehrlicher und besser nachvollziehbar zu machen.', '1542727365-19732a80dcfd'),
        section('textImage', {
          badge: 'Studio-Story',
          headline: 'Keine Laufkundschaft-Atmosphäre. Keine Motiv-Hektik.',
          text: '<p>Wir haben INK DISTRICT gegründet, weil viele Tattoo-Anfragen zu schnell beantwortet werden: Preis, Termin, fertig. Für uns beginnt gute Arbeit früher.</p><p>Wir wollen verstehen, warum ein Motiv wichtig ist, wo es sitzen soll und wie es nach Jahren noch wirken kann. Deshalb planen wir langsamer, stechen konzentrierter und erklären mehr.</p>',
          image: img('1598300042247-d088f8ab3a91', 1400),
          imageAlt: 'Tattoo Studio mit ruhiger Arbeitsfläche',
          layout: 'image-left',
          items: [
            { icon: 'ShieldCheck', title: 'Hygiene sichtbar', text: 'Abläufe werden erklärt, nicht versteckt.' },
            { icon: 'Pencil', title: 'Custom statt Kopie', text: 'Referenzen sind Richtung, nicht Endmotiv.' },
            { icon: 'Clock', title: 'Zeit statt Druck', text: 'Termine bekommen realistische Zeitfenster.' },
            { icon: 'HeartPulse', title: 'Nachsorge gehört dazu', text: 'Heilung ist Teil der Qualität.' },
          ],
        }, smokeTokens),
        section('timeline', { badgeText: 'Entwicklung', headline: 'Wie das Studio gewachsen ist.', subline: 'Langsam, bewusst und mit klarer Haltung.', items: [
          { year: '2016', title: 'Erster Raum in Kreuzberg', text: 'Ein Arbeitsplatz, zwei Artists, sehr klare Regeln.' },
          { year: '2019', title: 'Fine Line wird Schwerpunkt', text: 'Mehr Beratung zu Größe, Hautstellen und Alterung.' },
          { year: '2022', title: 'Blackwork & Botanical', text: 'Miro und Noor ergänzen das Studio mit eigenen Handschriften.' },
          { year: '2026', title: 'Nur noch kuratierte Anfragen', text: 'Weniger Durchlauf, bessere Vorbereitung, ruhigere Termine.' },
        ] }, lightTokens),
        section('team', { headline: 'Menschen hinter den Nadeln.', subline: 'Drei Artists, ein gemeinsamer Anspruch.', membersHeadline: 'Team', members: [
          { name: 'Lea Novak', role: 'Fine Line & Botanical', image: img('1494790108377-be9c29b29330', 900), bio: 'Gründerin, ruhig im Gespräch und sehr genau in Linien.' },
          { name: 'Miro Sander', role: 'Blackwork', image: img('1500648767791-00dcc994a43e', 900), bio: 'Denkt Motive in Fläche, Kante und Kontrast.' },
          { name: 'Noor Ali', role: 'Micro & Script', image: img('1531123897727-8f129e1688ce', 900), bio: 'Reduziert Motive, ohne sie technisch zu schwächen.' },
        ], stats: [{ value: '2016', label: 'gegründet' }, { value: '3', label: 'Artists' }, { value: '4,9/5', label: 'Bewertung' }] }, smokeTokens),
        section('principlesGrid', { badge: 'Werte', headline: 'Woran wir uns messen.', subline: 'Nicht an möglichst vielen Motiven pro Tag.', principles: [
          { eyebrow: '01', title: 'Ehrlichkeit vor Zusage', text: 'Wenn eine Idee zu klein, zu fein oder technisch schwach ist, sagen wir das.' },
          { eyebrow: '02', title: 'Haut ist kein Papier', text: 'Motive werden an Körperstelle, Haut und Bewegung angepasst.' },
          { eyebrow: '03', title: 'Sauberkeit ist sichtbar', text: 'Hygiene ist kein Backstage-Thema, sondern Teil der Beratung.' },
          { eyebrow: '04', title: 'Heilung zählt mit', text: 'Das Tattoo ist erst gut, wenn es sauber verheilt.' },
        ], cta: { label: 'Anfrage senden', href: '/kontakt' } }, lightTokens),
        section('ctaBand', { badgeText: 'Studio kennenlernen', headline: 'Passt unsere Haltung zu Ihrem Motiv?', subline: 'Dann schreiben Sie uns. Wenn nicht, sagen wir es ebenfalls ehrlich.', ctaPrimary: { label: 'Motiv anfragen', href: '/kontakt', icon: 'Send' } }, darkTokens),
      ],
    },
    {
      slug: 'journal',
      title: 'Journal',
      seo: { metaTitle: 'Tattoo Journal | INK DISTRICT', metaDescription: 'Notizen zu Tattoo-Stilen, Nachsorge, Motivplanung und Studio-Alltag bei INK DISTRICT.' },
      sections: [
        collectionHero('Notizen aus dem Studio.', 'Keine Mythen, sondern klare Gedanken zu Motiv, Haut und Heilung.', '1542727365-19732a80dcfd'),
        section('newsPreview', { headline: 'Aus dem Journal', subline: 'Kurze Texte, die vor der Anfrage helfen.', collectionKey: 'news', linkLabel: 'Alle lesen', linkHref: '/journal' }, lightTokens),
        section('collectionList', { headline: 'Alle Beiträge', collectionKey: 'news', columns: 3, showImage: true, showDate: false, showExcerpt: true, showSortControls: false }, smokeTokens),
      ],
    },
    {
      slug: 'kontakt',
      title: 'Kontakt',
      seo: { metaTitle: 'Kontakt & Tattoo-Anfrage | INK DISTRICT', metaDescription: 'Tattoo-Anfrage an INK DISTRICT Berlin-Kreuzberg senden: Motividee, Größe, Körperstelle und Referenzen.' },
      sections: [
        collectionHero('Motiv anfragen.', 'Je klarer die Anfrage, desto besser können wir einschätzen, welcher Artist und welches Zeitfenster passt.', '1598300042247-d088f8ab3a91'),
        section('tattooBooking', { headline: 'Tattoo-Anfrage', subline: 'Bitte senden Sie Motividee, Körperstelle, ungefähre Größe und Referenzen. Wir melden uns mit Einschätzung und nächstem Schritt.', artists: ['Lea Novak', 'Miro Sander', 'Noor Ali', 'Noch offen'] }, lightTokens),
        section('contact', { badgeText: 'Studio', headline: 'Berlin-Kreuzberg, ruhig gelegen.', introText: 'Termine nur nach Vereinbarung. Kurze Beratungen planen wir so, dass wirklich Zeit für Motiv und Fragen bleibt.', formEnabled: true, submitLabel: 'Anfrage senden', infoCards: [
          { icon: 'MapPin', label: 'Adresse', value: 'Reichenberger Straße 48, 10999 Berlin' },
          { icon: 'Phone', label: 'Telefon', value: '+49 30 2332 1840' },
          { icon: 'Mail', label: 'E-Mail', value: 'studio@ink-district.berlin' },
          { icon: 'Clock', label: 'Öffnungszeiten', value: 'Di-Fr 11-18 Uhr, Sa 10-16 Uhr' },
        ] }, smokeTokens),
        section('map', { headline: 'Nähe Paul-Lincke-Ufer', address: 'Reichenberger Straße 48, 10999 Berlin', mapEmbedUrl: 'https://www.google.com/maps?q=Reichenberger%20Stra%C3%9Fe%2048%2010999%20Berlin&output=embed' }, lightTokens),
        section('tattooBookingCta', { headline: 'Was sollte in die Anfrage?', subline: 'Motividee, Körperstelle, Größe, Referenzen und ob es ein erstes Tattoo ist.', ctaLabel: 'Anfrage senden', ctaHref: '/kontakt', hints: ['Foto der Körperstelle hilft', 'Pinterest als Richtung, nicht als Kopie', 'Budgetrahmen gern nennen'] }, darkTokens),
      ],
    },
    {
      slug: 'impressum',
      title: 'Impressum',
      seo: { metaTitle: 'Impressum | INK DISTRICT', metaDescription: 'Impressum von INK DISTRICT Berlin.' },
      sections: [
        section('legalContent', { headline: 'Impressum', blocks: [
          { title: 'Angaben gemäß § 5 TMG', text: 'INK DISTRICT Studio GmbH<br>Reichenberger Straße 48<br>10999 Berlin' },
          { title: 'Vertreten durch', text: 'Lea Novak und Miro Sander' },
          { title: 'Kontakt', text: 'Telefon: +49 30 2332 1840<br>E-Mail: studio@ink-district.berlin' },
          { title: 'Registereintrag', text: 'Handelsregister: Amtsgericht Charlottenburg, HRB 184920' },
          { title: 'Umsatzsteuer-ID', text: 'DE321498760' },
          { title: 'Haftung für Inhalte', text: 'Wir erstellen Inhalte sorgfältig, übernehmen jedoch keine Gewähr für Vollständigkeit und Aktualität.' },
          { title: 'Urheberrecht', text: 'Bilder, Texte und Entwürfe dieser Website sind urheberrechtlich geschützt.' },
        ] }),
      ],
    },
    {
      slug: 'datenschutz',
      title: 'Datenschutz',
      seo: { metaTitle: 'Datenschutz | INK DISTRICT', metaDescription: 'Datenschutzerklärung von INK DISTRICT Berlin.' },
      sections: [
        section('legalContent', { headline: 'Datenschutzerklärung', blocks: [
          { title: 'Verantwortlicher', text: 'INK DISTRICT Studio GmbH, Reichenberger Straße 48, 10999 Berlin, studio@ink-district.berlin' },
          { title: 'Hosting', text: 'Unsere Website wird bei einem europäischen Hosting-Anbieter betrieben. Dabei werden technische Zugriffsdaten verarbeitet.' },
          { title: 'Kontaktformular', text: 'Wenn Sie uns über das Formular schreiben, verarbeiten wir Ihre Angaben zur Bearbeitung der Anfrage.' },
          { title: 'Bildreferenzen', text: 'Mitgesendete Referenzen und Fotos verwenden wir ausschließlich zur Einschätzung Ihrer Tattoo-Anfrage.' },
          { title: 'Cookies', text: 'Wir verwenden nur technisch notwendige Cookies, sofern keine weiteren Dienste aktiv eingebunden sind.' },
          { title: 'Ihre Rechte', text: 'Sie haben Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung und Beschwerde bei einer Aufsichtsbehörde.' },
        ] }),
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
