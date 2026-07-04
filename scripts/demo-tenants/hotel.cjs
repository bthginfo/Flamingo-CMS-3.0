const { randomUUID } = require('node:crypto');
const { run } = require('./_lib/runner.cjs');
const { darkTokens } = require('./_lib/theme.cjs');

/**
 * Tenant: hotel
 * Marke: Alpenglow Resort & Spa, Seefeld in Tirol
 * Story: Ein kleines Boutique-Resort am Waldrand: alpine Ruhe, ehrliche Gastgeber,
 *        gutes Frühstück, leise Spa-Momente und Zimmer, die nicht nach Katalog wirken.
 * Palette: Latschenkiefer, Stein, warmes Leinen, Kupfer, Abendlicht.
 * Typografie: Fraunces für Headlines, Manrope für Fließtext.
 * Bildwelt: Berge, Holz, warmes Licht, Spa, Frühstück, Räume mit Aussicht.
 * Tonalität: gastgeberhaft, ruhig, konkret, ortsverliebt.
 */

const PAT = 'flm_pat_1521c5d84ea52527aa60b2f9bd2c2ccbca0b6c30c6f20e7555d98dc3c7a15eb4';

const C = {
  forest: '#223C34',
  deep: '#13241F',
  moss: '#6F7E62',
  copper: '#B46A3C',
  gold: '#D6A85A',
  linen: '#F7F1E8',
  paper: '#FFFBF5',
  stone: '#E5DED2',
  ink: '#17231F',
  body: '#4E5C55',
  muted: '#607068',
  white: '#FFFFFF',
};

function uuid() { return randomUUID(); }
function img(id, w = 1600) { return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=82`; }
function p(text) { return `<p>${text}</p>`; }

function darkSectionTokens(bg = C.deep) {
  return {
    ...darkTokens({ accent: C.gold, btnBg: C.gold, btnText: C.deep }),
    '--token-section-bg': bg,
    '--token-section-bg-alt': bg,
    '--token-card-bg': 'rgba(19,36,31,0.72)',
    '--token-card-border': 'rgba(255,255,255,0.22)',
    '--token-heading': C.white,
    '--token-subheading': 'rgba(255,255,255,0.88)',
    '--token-body': 'rgba(255,255,255,0.86)',
    '--token-muted': 'rgba(255,255,255,0.72)',
    '--token-icon': C.gold,
    '--token-accent': C.gold,
    '--token-eyebrow': C.gold,
    '--token-badge-bg': 'rgba(255,255,255,0.12)',
    '--token-badge-text': C.white,
    '--token-btn-bg': C.gold,
    '--token-btn-text': C.deep,
    '--token-btn-secondary-bg': 'rgba(255,255,255,0.10)',
    '--token-btn-secondary-text': C.white,
    '--token-on-dark-heading': C.white,
    '--token-on-dark-body': 'rgba(255,255,255,0.88)',
    '--token-on-dark-muted': 'rgba(255,255,255,0.68)',
  };
}

const lightTokens = {
  '--token-section-bg': C.linen,
  '--token-section-bg-alt': C.paper,
  '--token-card-bg': C.white,
  '--token-card-border': 'rgba(34,60,52,0.14)',
  '--token-heading': C.ink,
  '--token-subheading': C.forest,
  '--token-body': C.body,
  '--token-muted': C.muted,
  '--token-icon': C.copper,
  '--token-accent': C.copper,
  '--token-eyebrow': C.copper,
  '--token-badge-bg': 'rgba(180,106,60,0.12)',
  '--token-badge-text': C.forest,
  '--token-btn-bg': C.forest,
  '--token-btn-text': C.white,
  '--token-btn-secondary-bg': C.white,
  '--token-btn-secondary-text': C.forest,
};

const softGreenTokens = {
  ...lightTokens,
  '--token-section-bg': '#EDF3ED',
  '--token-section-bg-alt': '#F7FAF5',
  '--token-icon': C.moss,
  '--token-accent': C.moss,
  '--token-eyebrow': C.moss,
  '--token-badge-bg': 'rgba(111,126,98,0.14)',
};

function heroData({ headline, subline, badgeText, bgImage, primaryLabel = 'Aufenthalt anfragen', secondaryLabel = 'Zimmer ansehen', primaryHref = '/kontakt', secondaryHref = '/leistungen' }) {
  return {
    headline,
    subline,
    badgeText,
    badgeIcon: 'Mountain',
    bgMode: 'image',
    bgImage,
    bgPosition: 'center 45%',
    overlayColor: '#101F1B',
    overlayOpacity: 0.58,
    primaryCta: { label: primaryLabel, href: primaryHref, icon: 'CalendarDays' },
    secondaryCta: { label: secondaryLabel, href: secondaryHref },
    ratingText: '4,8 / 5 Gästestimmen',
    availabilityHint: 'Direktanfrage statt Portalstress',
    trustItems: ['Seefeld · Tirol', 'Spa-Zeit inklusive', 'Frühstück aus der Region', 'ruhige Zimmer'],
    trustStripColor: 'rgba(19,36,31,0.58)',
    imageEffect: 'kenBurns',
    imageEffectIntensity: 'subtle',
  };
}

function collectionHeroData({ headline, subline, bgImage, category }) {
  return {
    headline,
    subline,
    category,
    bgImage,
    backgroundImage: bgImage,
    bgPosition: 'center 50%',
    overlayColor: '#101F1B',
    overlayOpacity: 0.58,
    imageEffect: 'parallax',
    imageEffectIntensity: 'subtle',
  };
}

function rooms() {
  return [
    {
      name: 'Waldzimmer',
      description: 'Ein ruhiges Zimmer zur Baumseite, mit viel Holz, weichem Licht und genug Fläche für zwei gute Nächte oder eine ganze Woche.',
      image: img('1500530855697-b586d89ba3ee'),
      priceLabel: 'ab 168 €',
      sizeLabel: '28 m²',
      occupancyLabel: '1-2 Gäste',
      bedLabel: 'King Bed',
      features: ['Waldblick', 'Balkon', 'Naturkosmetik', 'Frühstück inklusive'],
      detailCta: { label: 'Zimmer ansehen', href: '/c/leistungen/waldzimmer' },
      bookingCta: { label: 'Anfragen', href: '/kontakt' },
      highlighted: true,
      galleryImages: [img('1500530855697-b586d89ba3ee', 1200), img('1566073771259-6a8506099945', 1200)],
    },
    {
      name: 'Panorama Suite',
      description: 'Mehr Raum, mehr Aussicht, mehr Ruhe. Für Gäste, die morgens lange schauen und abends nicht sofort ins Bett wollen.',
      image: img('1566073771259-6a8506099945'),
      priceLabel: 'ab 246 €',
      sizeLabel: '46 m²',
      occupancyLabel: '2 Gäste',
      bedLabel: 'King Bed + Lounge',
      features: ['Bergblick', 'Südloggia', 'freistehende Wanne', 'Late Checkout auf Anfrage'],
      detailCta: { label: 'Suite ansehen', href: '/c/leistungen/panorama-suite' },
      bookingCta: { label: 'Anfragen', href: '/kontakt' },
      galleryImages: [img('1566073771259-6a8506099945', 1200), img('1551882547-ff40c63fe5fa', 1200)],
    },
    {
      name: 'Spa Loft',
      description: 'Ein kleines Hideaway mit eigenem Rückzugsgefühl. Ideal für zwei Nächte, wenn der Kalender eigentlich zu laut ist.',
      image: img('1551882547-ff40c63fe5fa'),
      priceLabel: 'ab 298 €',
      sizeLabel: '58 m²',
      occupancyLabel: '2 Gäste',
      bedLabel: 'King Bed',
      features: ['Private Sauna', 'Tee-Bar', 'Bergbad', 'Spa-Tasche'],
      detailCta: { label: 'Loft ansehen', href: '/c/leistungen/spa-loft' },
      bookingCta: { label: 'Anfragen', href: '/kontakt' },
      galleryImages: [img('1551882547-ff40c63fe5fa', 1200), img('1542314831-068cd1dbfeeb', 1200)],
    },
  ];
}

function offerCards() {
  return [
    { title: 'Waldzimmer', text: 'Ruhiges Zimmer mit Balkon, Frühstück und Blick Richtung Latschenwald.', icon: 'Trees', mediaType: 'icon', href: '/c/leistungen/waldzimmer' },
    { title: 'Panorama Suite', text: 'Mehr Raum und Aussicht für Gäste, die länger bleiben möchten.', icon: 'Mountain', mediaType: 'icon', href: '/c/leistungen/panorama-suite' },
    { title: 'Spa Loft', text: 'Rückzug mit Private Sauna, Tee-Bar und bewusst leisem Komfort.', icon: 'Sparkles', mediaType: 'icon', href: '/c/leistungen/spa-loft' },
    { title: 'Retreat & Offsite', text: 'Kleine Teamformate mit Raum, Küche, Ruhe und klarer Planung.', icon: 'Users', mediaType: 'icon', href: '/c/leistungen/retreat-offsite' },
  ];
}

function wellnessData() {
  return {
    badgeText: 'Spa',
    headline: 'Nicht größer. Nur ruhiger.',
    subline: 'Unser Spa ist kein Showroom. Er ist ein stiller Ort für Wärme, Wasser, Schlaf und langsames Wiederankommen.',
    introText: p('Sauna, Dampfbad, Ruheraum und Anwendungen liegen bewusst nah beieinander. Keine Wege, keine Musik, kein Programm, das Sie durch den Tag schiebt.'),
    imagePrimary: img('1544161515-4ab6ce6db874'),
    imageSecondary: img('1540555700478-4be289fbecef'),
    features: [
      { icon: 'Flame', title: 'Sauna mit Aussicht', text: 'Nachmittags warm, abends still. Mit Tee und genug Abstand zwischen den Liegen.' },
      { icon: 'Droplets', title: 'Wasser statt Lärm', text: 'Pool und Ruhezone sind so geplant, dass Gespräche nicht den Raum übernehmen.' },
      { icon: 'Leaf', title: 'Anwendungen auf Anfrage', text: 'Massagen und kleine Rituale buchen wir bewusst limitiert, damit sie nicht wie Fließband wirken.' },
      { icon: 'Moon', title: 'Schlaf als Leistung', text: 'Zimmer, Licht und Abendservice sind auf echten Schlaf ausgelegt.' },
    ],
    treatments: [
      { title: 'Alpine Massage', text: 'Rücken, Nacken und Schultern mit warmem Öl und ruhigem Tempo.', durationLabel: '60 Min.', priceLabel: '98 €', image: img('1600334089648-b0d9d3028eb2'), cta: { label: 'Termin anfragen', href: '/kontakt' } },
      { title: 'Wald & Wärme', text: 'Sauna-Zeit, Kräutertee, Peeling und 30 Minuten Ruhefenster.', durationLabel: '90 Min.', priceLabel: '74 €', image: img('1544161515-4ab6ce6db874'), cta: { label: 'Paket anfragen', href: '/kontakt' } },
      { title: 'Ankommen zu zweit', text: 'Kleine Auszeit nach der Anreise, ideal für das erste Abendfenster.', durationLabel: '45 Min.', priceLabel: 'ab 118 €', image: img('1540555700478-4be289fbecef'), cta: { label: 'Verfügbarkeit fragen', href: '/kontakt' } },
    ],
    ctaPrimary: { label: 'Spa-Zeit anfragen', href: '/kontakt' },
  };
}

function diningData() {
  return {
    headline: 'Frühstück, das nach Region schmeckt.',
    subline: 'Kein Buffet, das alles gleichzeitig sein will. Lieber gute Eier, Brot aus der Nähe, Käse von Höfen, Kaffee in Ruhe.',
    introText: p('Morgens steht der Raum offen, aber nicht laut. Abends kochen wir klein: Suppe, Brotzeit, ein warmes Gericht und Weine, die auch ohne große Karte funktionieren.'),
    image: img('1496412705862-e0088f16f791'),
    openingText: 'Frühstück 7:30-10:30 Uhr · kleine Abendkarte 18:00-21:00 Uhr',
    menus: [
      { title: 'Bergfrühstück', description: 'Sauerteig, Eier, Butter, Marmeladen, Joghurt, Müsli, Käse und guter Kaffee.', timeLabel: 'täglich', priceLabel: 'inklusive' },
      { title: 'Leichte Abendkarte', description: 'Suppen, Brotzeit, Pasta oder Risotto - bewusst klein und frisch gekocht.', timeLabel: 'Mi-So', priceLabel: 'à la carte' },
      { title: 'Tiroler Weine & Tee-Bar', description: 'Kleine Auswahl für Kamin, Terrasse oder Zimmer.', timeLabel: 'ganztägig', priceLabel: 'nach Verbrauch' },
    ],
    ctaPrimary: { label: 'Abendplatz anfragen', href: '/kontakt' },
  };
}

function eventsData() {
  return {
    headline: 'Kleine Formate funktionieren hier am besten.',
    subline: 'Workshops, Offsites, Yoga-Wochenenden oder Familienfeiern: Wir planen lieber präzise als großspurig.',
    spaces: [
      { name: 'Stubenraum', description: 'Holz, Tageslicht, großer Tisch. Für Gespräche, kleine Workshops oder Abendessen.', image: img('1517248135467-4c7edcad34c4'), capacityLabel: 'bis 18 Personen', sizeLabel: '42 m²', features: ['Tageslicht', 'Kamin', 'Dinner-Setup', 'Screen möglich'] },
      { name: 'Panorama Atelier', description: 'Ruhiger Raum mit Blick Richtung Berge, ideal für Offsites und konzentrierte Arbeit.', image: img('1497366754035-f200968a6e72'), capacityLabel: 'bis 24 Personen', sizeLabel: '68 m²', features: ['Workshop-Setup', 'Moderationsmaterial', 'Kaffeepausen', 'Terrassenzugang'] },
      { name: 'Waldterrasse', description: 'Für Aperitif, freie Trauung im kleinen Kreis oder einen Abend, der draußen beginnen soll.', image: img('1500534314209-a25ddb2bd429'), capacityLabel: 'bis 35 Personen', sizeLabel: 'Außenbereich', features: ['Aperitif', 'Feuerschale', 'Schlechtwetter-Plan', 'Bergblick'] },
    ],
    ctaPrimary: { label: 'Format besprechen', href: '/kontakt' },
  };
}

function storyData() {
  return {
    badgeText: 'Gastgeber',
    headline: 'Ein Haus, das lieber zuhört als beeindruckt.',
    subline: 'Das Alpenglow ist aus einem alten Pensionshaus gewachsen. Nicht alles ist neu. Aber alles hat eine Absicht.',
    storyText: `${p('Wir wollten ein Resort bauen, das nicht in jeder Ecke Luxus behauptet, sondern an den richtigen Stellen Ruhe schafft: gute Matratzen, kurze Wege, ehrliches Essen, ein Spa ohne Dauerbeschallung und Gastgeber, die wissen, wann sie da sein sollen.')}${p('Viele Gäste kommen nicht wegen eines einzelnen Features, sondern wegen des Gefühls: ankommen, Tasche abstellen, Schultern senken, wieder klar denken.')}`,
    imagePrimary: img('1500534314209-a25ddb2bd429'),
    imageSecondary: img('1519681393784-d120267933ba'),
    founderName: 'Mara und Lukas Huter',
    founderRole: 'Gastgeber',
    founderQuote: 'Wir mögen Häuser, in denen man nicht sofort etwas tun muss.',
    stats: [
      { value: '24', label: 'Zimmer & Suiten' },
      { value: '2016', label: 'neu eröffnet' },
      { value: '4,8/5', label: 'Gästestimmen' },
    ],
    values: [
      { icon: 'Moon', title: 'Schlaf zuerst', text: 'Licht, Matratzen und Abendrhythmus sind wichtiger als Dekoration.' },
      { icon: 'Leaf', title: 'Region ohne Folklore', text: 'Wir arbeiten lokal, aber nicht museal.' },
      { icon: 'MessageCircle', title: 'Direkt reden', text: 'Anfragen beantworten Menschen, keine Buchungsmaschine.' },
      { icon: 'Sparkles', title: 'Weniger Reiz', text: 'Räume dürfen schön sein, ohne laut zu werden.' },
    ],
    milestones: [
      { year: '1978', title: 'Pension am Waldrand', text: 'Ein kleines Haus mit Frühstücksraum und 14 Zimmern.' },
      { year: '2016', title: 'Umbau zum Boutique-Resort', text: 'Mehr Holz, bessere Zimmer, ein Spa und deutlich weniger Kitsch.' },
      { year: '2021', title: 'Neue Küche', text: 'Frühstück und Abendkarte werden konsequent regionaler.' },
      { year: '2025', title: 'Retreat-Formate', text: 'Kleine Teams und private Feiern bekommen eigene Abläufe.' },
    ],
    ctaPrimary: { label: 'Mehr über uns', href: '/ueber-uns' },
  };
}

function faqItems() {
  return [
    { question: 'Kann ich ohne Buchungsportal anfragen?', answer: 'Ja. Schreiben Sie uns den Zeitraum, die Personenanzahl und Wünsche. Wir melden uns persönlich mit passenden Optionen.' },
    { question: 'Ist der Spa-Bereich im Aufenthalt enthalten?', answer: 'Sauna, Pool und Ruheraum sind für Hausgäste inklusive. Anwendungen buchen Sie separat nach Verfügbarkeit.' },
    { question: 'Gibt es Abendessen im Haus?', answer: 'Ja, aber bewusst klein. Unsere Abendkarte läuft Mittwoch bis Sonntag, Reservierung ist empfehlenswert.' },
    { question: 'Eignet sich das Haus für kleine Retreats?', answer: 'Ja, besonders für Teams bis 24 Personen, Yoga-Wochenenden und ruhige Familienformate.' },
  ];
}

function contactInfoCards() {
  return [
    { icon: 'Phone', label: 'Telefon', value: '+43 5212 48190' },
    { icon: 'Mail', label: 'E-Mail', value: 'servus@alpenglow-seefeld.at' },
    { icon: 'MapPin', label: 'Adresse', value: 'Möserer Straße 18, 6100 Seefeld in Tirol' },
    { icon: 'Clock', label: 'Rezeption', value: 'täglich 7:00-21:00 Uhr' },
  ];
}

function pageSeo(title, description) {
  return { metaTitle: title, metaDescription: description };
}

const tenant = {
  slug: 'hotel',
  pat: PAT,
  wipe: true,
  publish: true,
  style: { style: 'classic' },
  brand: {
    companyName: 'Alpenglow Resort & Spa',
    tagline: 'Boutique-Hotel in Seefeld mit Spa, Ruhe und Bergblick',
    primaryColor: C.forest,
    secondaryColor: C.moss,
    accentColor: C.copper,
    logoDisplay: 'name',
    headingFont: 'Fraunces',
    bodyFont: 'Manrope',
    topBarColor: C.deep,
    footerColor: C.deep,
  },
  contact: {
    phone: '+43 5212 48190',
    email: 'servus@alpenglow-seefeld.at',
    address: 'Möserer Straße 18, 6100 Seefeld in Tirol, Österreich',
    whatsapp: '+43521248190',
    whatsappEnabled: true,
  },
  design: {
    sectionBg: C.linen,
    sectionBgAlt: C.paper,
    cardBg: C.white,
    cardBorder: '#DED5C8',
    heading: C.ink,
    subheading: C.forest,
    body: C.body,
    muted: C.muted,
    brand: C.forest,
    accent: C.copper,
    icon: C.copper,
    buttonBg: C.forest,
    buttonText: C.white,
    buttonSecondaryBg: C.white,
    buttonSecondaryText: C.forest,
    badgeBg: '#EFE2D2',
    badgeText: C.forest,
    onDarkHeading: C.white,
    onDarkBody: 'rgba(255,255,255,0.88)',
    onDarkMuted: 'rgba(255,255,255,0.68)',
  },
  socialLinks: {
    instagram: 'https://www.instagram.com/alpenglow.seefeld',
    facebook: 'https://www.facebook.com/alpenglow.seefeld',
    google: 'https://www.google.com/search?q=Alpenglow+Resort+Seefeld',
    tripadvisor: 'https://www.tripadvisor.de/',
  },
  openingHours: {
    hours: [
      { type: 'regular', day: 'Rezeption', hours: 'täglich 7:00-21:00 Uhr' },
      { type: 'regular', day: 'Frühstück', hours: 'täglich 7:30-10:30 Uhr' },
      { type: 'regular', day: 'Spa', hours: 'täglich 8:00-21:00 Uhr' },
      { type: 'regular', day: 'Abendkarte', hours: 'Mittwoch-Sonntag 18:00-21:00 Uhr' },
    ],
  },
  formFields: {
    fields: [
      { name: 'name', type: 'text', required: true },
      { name: 'email', type: 'email', required: true },
      { name: 'phone', type: 'tel', required: false },
      { name: 'arrival', type: 'text', required: false },
      { name: 'message', type: 'textarea', required: true },
    ],
  },
  seoGlobal: {
    titleTemplate: '%s | Alpenglow Resort & Spa',
    defaultTitle: 'Alpenglow Resort & Spa Seefeld',
    defaultDescription: 'Boutique-Hotel in Seefeld in Tirol mit ruhigen Zimmern, Spa, Frühstück aus der Region und persönlicher Direktanfrage.',
    defaultOgImage: img('1500534314209-a25ddb2bd429', 1200),
    canonicalBase: 'https://www.alpenglow-seefeld.at',
    locale: 'de_DE',
  },
  navigation: {
    items: [
      { label: 'Startseite', href: '/' },
      { label: 'Zimmer', href: '/leistungen' },
      { label: 'Spa', href: '/spa' },
      { label: 'Kulinarik', href: '/kulinarik' },
      { label: 'Retreats', href: '/retreats' },
      { label: 'Über uns', href: '/ueber-uns' },
      { label: 'Journal', href: '/news' },
      { label: 'Kontakt', href: '/kontakt' },
    ],
    cta: { label: 'Aufenthalt anfragen', href: '/kontakt' },
  },
  footer: {
    columns: [
      { title: 'Aufenthalt', items: [
        { text: 'Zimmer & Suiten', href: '/leistungen' },
        { text: 'Waldzimmer', href: '/c/leistungen/waldzimmer' },
        { text: 'Panorama Suite', href: '/c/leistungen/panorama-suite' },
      ] },
      { title: 'Erleben', items: [
        { text: 'Spa & Ruhe', href: '/spa' },
        { text: 'Kulinarik', href: '/kulinarik' },
        { text: 'Retreats', href: '/retreats' },
      ] },
      { title: 'Haus', items: [
        { text: 'Über uns', href: '/ueber-uns' },
        { text: 'Journal', href: '/news' },
        { text: 'Kontakt', href: '/kontakt' },
      ] },
    ],
    legalLinks: [
      { label: 'Impressum', href: '/impressum' },
      { label: 'Datenschutz', href: '/datenschutz' },
    ],
    cta: { label: 'Direkt anfragen', href: '/kontakt' },
  },
  collections: [
    {
      key: 'leistungen',
      label: 'Zimmer & Angebote',
      items: [
        buildOfferItem({
          slug: 'waldzimmer',
          title: 'Waldzimmer',
          excerpt: 'Ruhiges Zimmer mit Balkon, Waldseite und Frühstück aus der Region.',
          imageId: '1500530855697-b586d89ba3ee',
          price: 'ab 168 €',
        }),
        buildOfferItem({
          slug: 'panorama-suite',
          title: 'Panorama Suite',
          excerpt: 'Suite mit Bergblick, Südloggia und mehr Raum für langsame Tage.',
          imageId: '1566073771259-6a8506099945',
          price: 'ab 246 €',
        }),
        buildOfferItem({
          slug: 'spa-loft',
          title: 'Spa Loft',
          excerpt: 'Hideaway mit Private Sauna, Tee-Bar und besonders ruhigem Abendgefühl.',
          imageId: '1551882547-ff40c63fe5fa',
          price: 'ab 298 €',
        }),
        buildOfferItem({
          slug: 'retreat-offsite',
          title: 'Retreat & Offsite',
          excerpt: 'Kleine Teamformate mit Workshopraum, Küche, Spa und sauberem Ablauf.',
          imageId: '1497366754035-f200968a6e72',
          price: 'auf Anfrage',
        }),
      ],
    },
    {
      key: 'news',
      label: 'Journal',
      items: [
        buildNewsItem({
          slug: 'warum-ruhe-planung-braucht',
          title: 'Warum Ruhe Planung braucht',
          excerpt: 'Ein ruhiger Aufenthalt entsteht nicht zufällig. Er beginnt bei Wegen, Licht, Timing und klarer Kommunikation.',
          imageId: '1519681393784-d120267933ba',
        }),
        buildNewsItem({
          slug: 'fruehstueck-ohne-buffetstress',
          title: 'Frühstück ohne Buffetstress',
          excerpt: 'Warum wir lieber weniger gleichzeitig anbieten und dafür morgens wirklich gute Dinge auf den Tisch bringen.',
          imageId: '1496412705862-e0088f16f791',
        }),
        buildNewsItem({
          slug: 'kleine-retreats-grosse-wirkung',
          title: 'Kleine Retreats, große Wirkung',
          excerpt: 'Was Teams brauchen, wenn ein Offsite mehr sein soll als ein Meeting an einem anderen Ort.',
          imageId: '1497366754035-f200968a6e72',
        }),
      ],
    },
  ],
  pages: [
    {
      slug: 'startseite',
      title: 'Startseite',
      seo: pageSeo('Boutique-Hotel in Seefeld mit Spa und Bergblick', 'Alpenglow Resort & Spa in Seefeld: ruhige Zimmer, Spa, Frühstück aus der Region und persönliche Direktanfrage statt Portalstress.'),
      sections: [
        { type: 'hero', data: heroData({
          badgeText: 'Boutique-Hotel in Seefeld',
          headline: 'Ankommen, durchatmen, bleiben wollen.',
          subline: 'Ein kleines Resort am Waldrand für Menschen, die Bergluft, gutes Frühstück und echte Ruhe suchen.',
          bgImage: img('1500534314209-a25ddb2bd429'),
        }), styleOverrides: darkSectionTokens() },
        { type: 'socialProofBar', data: { bgStyle: 'light', items: [
          { value: '4,8/5', label: 'Gästestimmen', icon: 'Star' },
          { value: '24', label: 'Zimmer', icon: 'BedDouble' },
          { value: '7 Min.', label: 'zum Ortskern', icon: 'MapPin' },
          { value: '0', label: 'Portalstress', icon: 'ShieldCheck' },
        ] }, styleOverrides: lightTokens },
        { type: 'story', data: storyData(), styleOverrides: lightTokens },
        { type: 'roomShowcase', data: {
          badgeText: 'Zimmer & Suiten',
          headline: 'Zimmer, die nicht nach Standard aussehen.',
          subline: 'Alle Räume sind ruhig, warm und klar. Der Unterschied liegt in Aussicht, Fläche und Rückzugsgrad.',
          rooms: rooms(),
          footerText: 'Preise gelten pro Nacht inklusive Frühstück, Spa-Zugang und persönlicher Direktanfrage.',
        }, styleOverrides: lightTokens },
        { type: 'featureShowcase', data: {
          headline: 'Was bei uns leise besser ist.',
          subline: 'Viele Hotels addieren Ausstattung. Wir lassen weg, was den Aufenthalt unruhig macht.',
          image: img('1542314831-068cd1dbfeeb'),
          features: [
            'Kurze Wege zwischen Zimmer, Spa, Frühstücksraum und Terrasse.',
            'Licht und Akustik sind auf Ruhe statt Show ausgelegt.',
            'Direkte Kommunikation vor der Anreise verhindert falsche Erwartungen.',
            'Kleine Abendkarte statt überladener Hotelküche.',
          ],
          ctaLabel: 'Haus kennenlernen',
          ctaHref: '/ueber-uns',
        }, styleOverrides: softGreenTokens },
        { type: 'wellness', data: wellnessData(), styleOverrides: softGreenTokens },
        { type: 'hotelDining', data: diningData(), styleOverrides: lightTokens },
        { type: 'processSteps', data: {
          badgeText: 'Direktanfrage',
          headline: 'So wird aus einer Anfrage ein passender Aufenthalt.',
          steps: [
            { icon: 'CalendarDays', title: 'Zeitraum nennen', text: 'Sie schicken uns Wunschdaten, Personenanzahl und was Ihnen wichtig ist.' },
            { icon: 'MessagesSquare', title: 'Wir antworten konkret', text: 'Kein Standardangebot, sondern passende Zimmer und ehrliche Verfügbarkeit.' },
            { icon: 'BedDouble', title: 'Aufenthalt fixieren', text: 'Sie bestätigen per Mail, wir halten Zimmer und Wünsche sauber fest.' },
            { icon: 'Coffee', title: 'Ankommen', text: 'Rezeption, Frühstück und Spa wissen Bescheid, bevor Sie eintreffen.' },
          ],
        }, styleOverrides: lightTokens },
        { type: 'bentoGrid', data: {
          headline: 'Warum Gäste wiederkommen.',
          subline: 'Nicht wegen eines einzelnen Luxusdetails, sondern weil der Aufenthalt zusammenhält.',
          items: [
            { icon: 'Moon', title: 'Schlaf ist kein Zufall', text: 'Matratzen, Verdunkelung, Abendservice und ruhige Zimmerseite werden ernst genommen.', span: '2' },
            { icon: 'Utensils', title: 'Frühstück ohne Hektik', text: 'Regionale Produkte, gute Zeiten, keine überfüllte Buffetlogik.' },
            { icon: 'Flame', title: 'Spa mit Maß', text: 'Wärme, Wasser und Ruhefenster statt Wellness-Show.' },
            { icon: 'Map', title: 'Orte mit Kontext', text: 'Wir empfehlen Wege, die wirklich zu Wetter, Kondition und Zeit passen.' },
            { icon: 'HeartHandshake', title: 'Gastgeber, keine Plattform', text: 'Sie schreiben an Menschen, die das Haus kennen.', span: '2' },
          ],
        }, styleOverrides: lightTokens },
        { type: 'statsCounter', data: {
          headline: 'Klein genug, um aufmerksam zu bleiben.',
          subline: 'Ein paar Zahlen, die erklären, warum das Haus nicht größer werden muss.',
          stats: [
            { value: 24, label: 'Zimmer' },
            { value: 7, suffix: ' Min.', label: 'zum Zentrum' },
            { value: 4.8, label: 'Bewertung' },
            { value: 2016, label: 'neu eröffnet' },
          ],
        }, styleOverrides: softGreenTokens },
        { type: 'timeline', data: {
          badge: 'Hausgeschichte',
          headline: 'Vom Pensionshaus zum ruhigen Resort.',
          subline: 'Wir haben nicht alles neu erfunden. Wir haben entschieden, was bleiben darf.',
          entries: storyData().milestones,
        }, styleOverrides: lightTokens },
        { type: 'testimonials', data: {
          headline: 'Ruhig im Ton, stark in der Erinnerung.',
          items: [
            { quote: 'Endlich ein Hotel, das nicht permanent beschäftigt. Frühstück, Spa und Zimmer waren genau richtig.', name: 'Miriam K.', context: 'Wochenende im Waldzimmer', rating: 5 },
            { quote: 'Die Direktanfrage war erstaunlich persönlich. Wir hatten sofort das passende Zimmer und keine Rückfragen offen.', name: 'Thomas R.', context: 'Panorama Suite', rating: 5 },
            { quote: 'Für unser Team-Offsite war das Haus ideal: ruhig, gut organisiert und nicht überinszeniert.', name: 'Lea M.', context: 'Retreat & Offsite', rating: 5 },
            { quote: 'Das Spa ist klein, aber genau deshalb angenehm. Kein Lärm, keine Show, nur Wärme und Ruhe.', name: 'Familie Berger', context: 'Spa Loft', rating: 5 },
          ],
        }, styleOverrides: lightTokens },
        { type: 'faq', data: { headline: 'Kurz vor der Anfrage geklärt.', items: faqItems() }, styleOverrides: lightTokens },
        sectionCta('Wollen Sie wissen, welches Zimmer passt?', 'Schicken Sie uns Zeitraum, Gäste und Wünsche. Wir antworten mit einer klaren Empfehlung.', 'Aufenthalt anfragen', '/kontakt'),
      ],
    },
    {
      slug: 'leistungen',
      title: 'Zimmer & Angebote',
      seo: pageSeo('Zimmer, Suiten und Retreat-Angebote in Seefeld', 'Zimmer und Angebote im Alpenglow Resort & Spa: Waldzimmer, Panorama Suite, Spa Loft und Retreat-Formate in Seefeld.'),
      sections: [
        { type: 'collectionHero', data: collectionHeroData({ category: 'Zimmer & Angebote', headline: 'Ein Aufenthalt, der zum Tempo passt.', subline: 'Zimmer, Suiten und kleine Formate für ruhige Tage am Waldrand.', bgImage: img('1566073771259-6a8506099945') }), styleOverrides: darkSectionTokens() },
        { type: 'servicesGrid', data: { badgeText: 'Auswahl', headline: 'Vier Möglichkeiten, im Alpenglow anzukommen.', subline: 'Vom ruhigen Zimmer bis zum Offsite: jedes Angebot hat eine klare Rolle.', ctaLabel: 'Anfrage senden', ctaHref: '/kontakt', manualCards: offerCards() }, styleOverrides: lightTokens },
        { type: 'roomShowcase', data: { badgeText: 'Zimmer', headline: 'Nicht jedes Zimmer muss alles können.', subline: 'Wichtig ist, dass es zu Ihrem Aufenthalt passt.', rooms: rooms(), footerText: 'Alle Zimmer enthalten Frühstück, Spa-Zugang und persönliche Vorbereitung vor Anreise.' }, styleOverrides: lightTokens },
        { type: 'comparisonTable', data: {
          badge: 'Einordnung',
          headline: 'Welches Angebot passt?',
          text: 'Ein schneller Vergleich für die erste Orientierung.',
          columns: [{ label: 'Waldzimmer' }, { label: 'Panorama Suite' }, { label: 'Spa Loft' }],
          rows: [
            { feature: 'Am besten für', values: ['ruhige Tage', 'längere Aufenthalte', 'Auszeit zu zweit'] },
            { feature: 'Aussicht', values: ['Waldseite', 'Bergblick', 'privater Rückzug'] },
            { feature: 'Spa-Nähe', values: ['inklusive', 'inklusive', 'Private Sauna'] },
            { feature: 'Direktanfrage', values: ['empfohlen', 'empfohlen', 'empfohlen'] },
          ],
          highlightCol: 1,
        }, styleOverrides: softGreenTokens },
        { type: 'offers', data: {
          headline: 'Saisonale Pakete ohne Paketgefühl.',
          subline: 'Kleine Kombinationen, die einen Aufenthalt erleichtern, ohne ihn zu verplanen.',
          offers: [
            { title: 'Zwei Nächte Waldruhe', description: 'Waldzimmer, Frühstück, Spa-Zeit und ein Abendmenü.', image: img('1500530855697-b586d89ba3ee'), priceLabel: 'ab 395 € p.P.', durationLabel: '2 Nächte', includes: ['Frühstück', 'Spa', 'Abendmenü', 'Late Checkout nach Lage'], cta: { label: 'Paket anfragen', href: '/kontakt' }, highlighted: true },
            { title: 'Panorama-Woche', description: 'Suite, Frühstück, Tee-Bar und zwei geführte Routenvorschläge.', image: img('1566073771259-6a8506099945'), priceLabel: 'ab 1.240 € p.P.', durationLabel: '5 Nächte', includes: ['Suite', 'Frühstück', 'Routenvorschläge', 'Spa'], cta: { label: 'Woche anfragen', href: '/kontakt' } },
            { title: 'Teamtage im Wald', description: 'Workshopraum, Zimmer, Kaffeepausen und Abendessen für kleine Teams.', image: img('1497366754035-f200968a6e72'), priceLabel: 'auf Anfrage', durationLabel: '1-3 Tage', includes: ['Raum', 'Zimmer', 'Verpflegung', 'Ablaufplanung'], cta: { label: 'Format besprechen', href: '/kontakt' } },
          ],
        }, styleOverrides: lightTokens },
        { type: 'collectionList', data: { headline: 'Alle Zimmer und Angebote', collectionKey: 'leistungen', columns: 4, showImage: true, showExcerpt: true, showDate: false, showSortControls: false }, styleOverrides: lightTokens },
        { type: 'faq', data: { headline: 'Fragen zu Zimmern & Angeboten', items: faqItems() }, styleOverrides: lightTokens },
        sectionCta('Sie müssen noch nicht genau wissen, was passt.', 'Beschreiben Sie kurz Reisezeit, Gäste und Anlass. Wir empfehlen das passende Zimmer.', 'Empfehlung anfragen', '/kontakt'),
      ],
    },
    {
      slug: 'spa',
      title: 'Spa',
      seo: pageSeo('Spa und Wellness im Alpenglow Resort Seefeld', 'Ruhiger Spa-Bereich in Seefeld mit Sauna, Pool, Anwendungen und kleinen Auszeit-Paketen im Alpenglow Resort & Spa.'),
      sections: [
        { type: 'collectionHero', data: collectionHeroData({ category: 'Spa', headline: 'Wärme, Wasser, Ruhe. Nicht mehr.', subline: 'Ein Spa für Menschen, die keinen Wellness-Zirkus suchen.', bgImage: img('1544161515-4ab6ce6db874') }), styleOverrides: darkSectionTokens() },
        { type: 'wellness', data: wellnessData(), styleOverrides: softGreenTokens },
        { type: 'featureShowcase', data: {
          headline: 'Ein Spa, der nicht fordert.',
          subline: 'Sie müssen nichts buchen, nichts leisten, nichts dokumentieren. Einfach warm werden.',
          image: img('1540555700478-4be289fbecef'),
          features: ['Sauna und Pool sind für Hausgäste inklusive.', 'Anwendungen finden nur mit genug Abstand statt.', 'Ruheräume bleiben bewusst ohne Dauerbeschallung.', 'Tee, Wasser und Handtücher stehen bereit.'],
          ctaLabel: 'Spa-Zeit anfragen',
          ctaHref: '/kontakt',
        }, styleOverrides: lightTokens },
        { type: 'bentoGrid', data: { headline: 'Kleine Details, die viel ausmachen.', subline: 'Ruhe entsteht oft durch Dinge, die man erst bemerkt, wenn sie fehlen.', items: [
          { icon: 'VolumeX', title: 'Keine Dauerplaylist', text: 'Im Ruheraum bleibt es wirklich ruhig.', span: '2' },
          { icon: 'CupSoda', title: 'Tee statt Barlogik', text: 'Kräuter, Wasser und Zeit.' },
          { icon: 'Clock', title: 'Zeitfenster mit Abstand', text: 'Massagen werden nicht zu eng getaktet.' },
          { icon: 'Towel', title: 'Alles vorbereitet', text: 'Tasche, Handtuch, Bademantel und klare Wege.' },
        ] }, styleOverrides: softGreenTokens },
        { type: 'testimonials', data: { headline: 'Was Gäste am Spa mögen.', items: [
          { quote: 'Klein, ruhig und genau richtig. Keine Handtuchschlacht, kein Gedränge.', name: 'Julia S.', context: 'Spa Loft', rating: 5 },
          { quote: 'Die Massage war nicht spektakulär, sondern einfach sehr gut.', name: 'Martin H.', context: 'Waldzimmer', rating: 5 },
          { quote: 'Der Ruheraum war wirklich ruhig. Das ist seltener, als man denkt.', name: 'Anne R.', context: 'Wochenende', rating: 5 },
          { quote: 'Nach zwei Stunden Sauna war der Kopf wieder leiser.', name: 'Robert K.', context: 'Panorama Suite', rating: 5 },
        ] }, styleOverrides: lightTokens },
        { type: 'faq', data: { headline: 'Spa: gut zu wissen', items: [
          { question: 'Ist der Spa inklusive?', answer: 'Ja, Sauna, Pool und Ruheräume sind für Hausgäste inklusive.' },
          { question: 'Muss ich Anwendungen vorab buchen?', answer: 'Wir empfehlen es, weil wir Termine bewusst begrenzen.' },
          { question: 'Gibt es Day Spa?', answer: 'Nur gelegentlich und nach Auslastung. Hausgäste haben Vorrang.' },
          { question: 'Kann ich den Spa am Abreisetag nutzen?', answer: 'Meist ja, wenn die Auslastung es zulässt. Bitte kurz fragen.' },
        ] }, styleOverrides: lightTokens },
        sectionCta('Soll der Aufenthalt vor allem ruhig werden?', 'Dann schreiben Sie uns das direkt in die Anfrage. Wir empfehlen Zimmer und Zeitfenster passend dazu.', 'Ruhige Auszeit anfragen', '/kontakt'),
      ],
    },
    {
      slug: 'kulinarik',
      title: 'Kulinarik',
      seo: pageSeo('Frühstück und Abendkarte im Hotel in Seefeld', 'Regionale Kulinarik im Alpenglow Resort: ruhiges Frühstück, kleine Abendkarte, Tee-Bar und Weine in Seefeld in Tirol.'),
      sections: [
        { type: 'collectionHero', data: collectionHeroData({ category: 'Kulinarik', headline: 'Gutes Essen muss nicht laut auftreten.', subline: 'Frühstück, kleine Abendkarte und Weine mit Sinn für den Tag.', bgImage: img('1496412705862-e0088f16f791') }), styleOverrides: darkSectionTokens() },
        { type: 'hotelDining', data: diningData(), styleOverrides: lightTokens },
        { type: 'portfolio', data: { badgeText: 'Küche', headline: 'Was morgens und abends auf den Tisch kommt.', subline: 'Keine endlose Karte, sondern gute Anker für den Tag.', projects: [
          { title: 'Bergfrühstück', category: 'morgens', description: 'Brot, Eier, Joghurt, Käse, Obst, Kaffee und ruhige Zeit.', image: img('1496412705862-e0088f16f791'), stats: [{ label: 'Zeit', value: '7:30-10:30' }] },
          { title: 'Abendkarte', category: 'abends', description: 'Klein gekocht: Suppe, Pasta, Risotto, Salat, Brotzeit.', image: img('1543353071-10c8ba85a904'), stats: [{ label: 'Tage', value: 'Mi-So' }] },
          { title: 'Tee-Bar', category: 'ganztägig', description: 'Kräuter, Wasser und etwas Süßes für die leisen Stunden.', image: img('1544787219-7f47ccb76574'), stats: [{ label: 'Ort', value: 'Lounge' }] },
        ], ctaLabel: 'Abendplatz anfragen', ctaHref: '/kontakt' }, styleOverrides: lightTokens },
        { type: 'timeline', data: { badge: 'Tagesrhythmus', headline: 'Essen folgt bei uns dem Tag.', subline: 'Nicht andersherum.', entries: [
          { year: '7:30', title: 'Frühstück beginnt ruhig', text: 'Der erste Kaffee steht, bevor der Raum voll wird.' },
          { year: '12:00', title: 'Terrasse & Tee', text: 'Kleine Pausen statt großes Mittagsprogramm.' },
          { year: '18:00', title: 'Abendkarte', text: 'Wenige Gerichte, frisch gekocht und passend zur Saison.' },
          { year: '21:00', title: 'Lounge-Zeit', text: 'Wein, Tee oder einfach Kamin.' },
        ] }, styleOverrides: softGreenTokens },
        { type: 'faq', data: { headline: 'Kulinarik: kurz geklärt', items: [
          { question: 'Ist Frühstück immer inklusive?', answer: 'Ja, bei Direktbuchung und Anfrage über uns ist Frühstück inklusive.' },
          { question: 'Gibt es vegetarische Optionen?', answer: 'Ja. Bitte sagen Sie uns besondere Wünsche oder Unverträglichkeiten vor Anreise.' },
          { question: 'Muss ich für das Abendessen reservieren?', answer: 'Empfohlen, weil unsere Abendkarte bewusst klein geplant ist.' },
          { question: 'Kann ich nur zum Essen kommen?', answer: 'Nach Verfügbarkeit ja, Hausgäste haben aber Vorrang.' },
        ] }, styleOverrides: lightTokens },
        sectionCta('Ein Abend im Haus?', 'Wenn Sie bei uns essen möchten, schreiben Sie es direkt in die Anfrage. Wir planen den Tisch mit.', 'Tisch mit anfragen', '/kontakt'),
      ],
    },
    {
      slug: 'retreats',
      title: 'Retreats',
      seo: pageSeo('Retreats und kleine Offsites im Hotel in Seefeld', 'Kleine Retreats, Team-Offsites und private Formate im Alpenglow Resort & Spa in Seefeld mit Raum, Küche und Spa.'),
      sections: [
        { type: 'collectionHero', data: collectionHeroData({ category: 'Retreats', headline: 'Kleine Gruppen brauchen gute Ordnung.', subline: 'Räume, Zimmer, Essen und Pausen aus einer Hand.', bgImage: img('1497366754035-f200968a6e72') }), styleOverrides: darkSectionTokens() },
        { type: 'eventSpaces', data: eventsData(), styleOverrides: lightTokens },
        { type: 'processSteps', data: { badgeText: 'Ablauf', headline: 'So planen wir ein kleines Format.', steps: [
          { icon: 'Users', title: 'Gruppe verstehen', text: 'Personen, Ziele, Energielevel und gewünschte Ruhe klären.' },
          { icon: 'LayoutDashboard', title: 'Raum wählen', text: 'Stubenraum, Atelier oder Terrasse passend zum Format.' },
          { icon: 'Utensils', title: 'Verpflegung takten', text: 'Frühstück, Kaffeepausen, Abendessen und Tee-Bar sauber planen.' },
          { icon: 'CalendarCheck', title: 'Ablauf fixieren', text: 'Ein klarer Plan, aber genug Luft zwischen den Programmpunkten.' },
        ] }, styleOverrides: lightTokens },
        { type: 'comparisonTable', data: { badge: 'Formate', headline: 'Was passt zu welcher Gruppe?', text: 'Eine grobe Einordnung für die erste Anfrage.', columns: [{ label: 'Workshop' }, { label: 'Retreat' }, { label: 'Feier' }], rows: [
          { feature: 'Dauer', values: ['1-2 Tage', '2-4 Tage', 'ein Abend'] },
          { feature: 'Raum', values: ['Panorama Atelier', 'Stubenraum + Spa', 'Stubenraum + Terrasse'] },
          { feature: 'Verpflegung', values: ['Kaffeepausen', 'Frühstück & Abend', 'Dinner & Aperitif'] },
          { feature: 'Ideal für', values: ['Teams', 'Yoga/Coaching', 'Familien'] },
        ], highlightCol: 1 }, styleOverrides: softGreenTokens },
        { type: 'statsCounter', data: { headline: 'Bewusst klein geplant.', subline: 'Damit Gastgeber, Küche und Räume aufmerksam bleiben.', stats: [
          { value: 24, label: 'Workshopgäste' },
          { value: 35, label: 'Aperitifgäste' },
          { value: 3, label: 'Räume' },
          { value: 1, label: 'Ansprechperson' },
        ] }, styleOverrides: lightTokens },
        { type: 'faq', data: { headline: 'Retreat-Fragen', items: [
          { question: 'Wie groß darf die Gruppe sein?', answer: 'Am besten funktionieren Gruppen zwischen 8 und 24 Personen.' },
          { question: 'Können Zimmer blockiert werden?', answer: 'Ja, nach Verfügbarkeit halten wir ein Kontingent für Ihr Format.' },
          { question: 'Gibt es Technik?', answer: 'Screen, Moderationsmaterial und stabiles WLAN sind vorhanden.' },
          { question: 'Kann Spa integriert werden?', answer: 'Ja, aber bewusst als ruhiges Zeitfenster, nicht als Pflichtprogramm.' },
        ] }, styleOverrides: lightTokens },
        { type: 'serviceTabs', data: {
          badge: 'Auf einen Blick',
          headline: 'Drei Arten, hier anzukommen.',
          subline: 'Ob Auszeit, Genuss oder konzentriertes Arbeiten — jede Ebene des Hauses hat ihren eigenen Rhythmus.',
          tabs: [
            { label: 'Wohnen', icon: 'bedDouble', title: 'Zimmer & Suiten', text: '<p>Ruhige Materialien, echte Dunkelheit und Betten, über die Gäste noch zuhause sprechen. Kein Zimmer gleicht dem anderen.</p>', image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=82', features: ['Bergblick oder Gartenruhe', 'Späte Abreise nach Verfügbarkeit', 'Hunde in ausgewählten Zimmern'], cta: { label: 'Zimmer ansehen', href: '/zimmer' } },
            { label: 'Spa', icon: 'waves', title: 'Wellness & Ruhe', text: '<p>Panoramapool, Saunen und Anwendungen mit Zeitpuffer — der Spa ist bewusst nicht auf Durchsatz geplant.</p>', image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=82', features: ['Adults-only Ruhebereich', 'Anwendungen mit 15 Min. Nachruhe', 'Textilfreie & textile Zonen'], cta: { label: 'Spa entdecken', href: '/wellness' } },
            { label: 'Kulinarik', icon: 'utensilsCrossed', title: 'Restaurant & Weinkeller', text: '<p>Regionale Küche mit klarer Handschrift, dazu ein Weinkeller, der Entdeckungen über Etiketten stellt.</p>', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=82', features: ['Halbpension mit Wahlfreiheit', 'Vegetarische Linie gleichwertig', 'Weinbegleitung glasweise'], cta: { label: 'Einblick Kulinarik', href: '/kulinarik' } },
          ],
        }, styleOverrides: lightTokens },
        sectionCta('Planen Sie ein kleines Format?', 'Schreiben Sie uns Anlass, Gruppengröße und Wunschzeitraum. Wir machen daraus einen klaren Vorschlag.', 'Format anfragen', '/kontakt'),
      ],
    },
    {
      slug: 'ueber-uns',
      title: 'Über uns',
      seo: pageSeo('Über Alpenglow Resort & Spa in Seefeld', 'Über das Alpenglow Resort & Spa: Gastgeber, Hausgeschichte, Werte und Team des Boutique-Hotels in Seefeld.'),
      sections: [
        { type: 'collectionHero', data: collectionHeroData({ category: 'Über uns', headline: 'Wir mögen Häuser, die nicht schreien.', subline: 'Ein paar Menschen, ein alter Ort, viele bewusste Entscheidungen.', bgImage: img('1519681393784-d120267933ba') }), styleOverrides: darkSectionTokens() },
        { type: 'story', data: storyData(), styleOverrides: lightTokens },
        { type: 'textImage', data: { badge: 'Haltung', headline: 'Gastgeben heißt für uns: gut vorbereiten und dann Raum lassen.', text: `${p('Wir fragen lieber einmal mehr vor der Anreise, damit vor Ort weniger erklärt werden muss. Ob Zimmerlage, Frühstückszeit, Allergie, Spa-Wunsch oder Anreise: Ein guter Aufenthalt beginnt lange vor dem Check-in.')}${p('Unser Haus ist nicht auf maximale Auslastung optimiert, sondern auf Wiederkommen. Das merkt man an kleinen Dingen: genug Personal beim Frühstück, klare Wege, wenig Lärm und eine Rezeption, die erreichbar bleibt.')}`, image: img('1500534314209-a25ddb2bd429'), imageAlt: 'Alpenglow Resort am Waldrand', layout: 'image-left', items: [
          { icon: 'ShieldCheck', title: 'klar vorbereitet', text: 'Wünsche und Besonderheiten stehen vor Anreise im Team.' },
          { icon: 'HeartHandshake', title: 'persönlich erreichbar', text: 'Keine anonyme Plattformlogik, sondern echte Rückmeldung.' },
          { icon: 'Leaf', title: 'regional verankert', text: 'Wir empfehlen Wege, Höfe und Orte, die wir selbst kennen.' },
          { icon: 'Moon', title: 'Ruhe ernst nehmen', text: 'Auch schöne Häuser dürfen Pausen lassen.' },
        ], primaryCta: { label: 'Kontakt aufnehmen', href: '/kontakt', icon: 'ArrowRight' } }, styleOverrides: lightTokens },
        { type: 'team', data: { headline: 'Menschen, die das Haus kennen.', subline: 'Klein genug, dass Verantwortung sichtbar bleibt.', membersHeadline: 'Team', members: [
          { name: 'Mara Huter', role: 'Gastgeberin & Frühstück', image: img('1544005313-94ddf0286df2'), bio: 'Hört in Anfragen oft zwischen den Zeilen und weiß, welches Zimmer wirklich passt.' },
          { name: 'Lukas Huter', role: 'Haus & Retreats', image: img('1500648767791-00dcc994a43e'), bio: 'Plant Abläufe, Räume und Offsites so, dass sie nicht überladen werden.' },
          { name: 'Elena Gruber', role: 'Spa & Anwendungen', image: img('1508214751196-bcfd4ca60f91'), bio: 'Mag langsames Tempo, klare Termine und Anwendungen ohne Produktshow.' },
        ], valuesHeadline: 'Was uns wichtig ist', values: storyData().values, stats: storyData().stats }, styleOverrides: lightTokens },
        { type: 'timeline', data: { badge: 'Geschichte', headline: 'Nicht alles neu. Aber alles bewusster.', subline: 'Unser Haus hat sich Schritt für Schritt verändert.', entries: storyData().milestones }, styleOverrides: softGreenTokens },
        { type: 'gallery', data: { headline: 'Ein paar Blicke ins Haus.', images: [
          { src: img('1500534314209-a25ddb2bd429'), alt: 'Außenansicht am Waldrand', caption: 'Waldrand' },
          { src: img('1566073771259-6a8506099945'), alt: 'Zimmer mit Bergblick', caption: 'Panorama Suite' },
          { src: img('1544161515-4ab6ce6db874'), alt: 'Spa-Bereich', caption: 'Spa' },
          { src: img('1496412705862-e0088f16f791'), alt: 'Frühstück', caption: 'Frühstück' },
        ] }, styleOverrides: lightTokens },
        sectionCta('Lernen Sie uns vor der Buchung kennen.', 'Eine kurze Nachricht reicht oft, damit wir ehrlich sagen können, ob unser Haus zu Ihrem Aufenthalt passt.', 'Direkt schreiben', '/kontakt'),
      ],
    },
    {
      slug: 'kontakt',
      title: 'Kontakt',
      seo: pageSeo('Kontakt und Direktanfrage Alpenglow Resort Seefeld', 'Kontakt zum Alpenglow Resort & Spa in Seefeld: Direktanfrage, Telefon, E-Mail, Adresse, Anreise und Rezeption.'),
      sections: [
        { type: 'collectionHero', data: collectionHeroData({ category: 'Kontakt', headline: 'Schreiben Sie uns lieber direkt.', subline: 'Dann können wir ehrlich sagen, welches Zimmer und welcher Zeitraum passen.', bgImage: img('1500534314209-a25ddb2bd429') }), styleOverrides: darkSectionTokens() },
        { type: 'contact', data: { headline: 'Direktanfrage senden', subline: 'Nennen Sie Zeitraum, Personenanzahl und was Ihnen wichtig ist. Wir antworten persönlich.', formEnabled: true, infoCards: contactInfoCards(), mapEmbedUrl: 'https://www.google.com/maps?q=M%C3%B6serer%20Stra%C3%9Fe%2018%2C%206100%20Seefeld%20in%20Tirol&output=embed' }, styleOverrides: lightTokens },
        { type: 'location', data: { headline: 'Seefeld, Waldrand, kurze Wege.', subline: 'Ruhig genug für Rückzug, nah genug für Bahnhof, Ortskern und Wege in die Berge.', addressText: 'Möserer Straße 18, 6100 Seefeld in Tirol', mapEmbedUrl: 'https://www.google.com/maps?q=M%C3%B6serer%20Stra%C3%9Fe%2018%2C%206100%20Seefeld%20in%20Tirol&output=embed', image: img('1500534314209-a25ddb2bd429'), transportItems: [
          { icon: 'Train', label: 'Bahnhof Seefeld', value: 'ca. 7 Minuten per Taxi' },
          { icon: 'Car', label: 'Parken', value: 'direkt am Haus' },
          { icon: 'Mountain', label: 'Wanderwege', value: 'ab Haustür' },
          { icon: 'Plane', label: 'Flughafen Innsbruck', value: 'ca. 30 Minuten' },
        ], nearbyItems: [
          { title: 'Ortskern Seefeld', distanceLabel: '12 Min. zu Fuß', text: 'Cafés, Geschäfte und Bahnhof.' },
          { title: 'Wildsee', distanceLabel: '15 Min. zu Fuß', text: 'Kurzer Abendweg nach der Anreise.' },
          { title: 'Rosshütte', distanceLabel: '8 Min. mit dem Auto', text: 'Bergbahn, Aussicht und Winterrouten.' },
        ], routeCta: { label: 'Anreise klären', href: '/kontakt' } }, styleOverrides: softGreenTokens },
        { type: 'textImage', data: { badge: 'Rezeption', headline: 'Wir melden uns nicht mit einem Automatentext.', text: `${p('Ihre Anfrage landet direkt im Haus. Meist antworten wir innerhalb eines Tages mit einer konkreten Empfehlung: passendes Zimmer, mögliche Zeiträume und Hinweise, wenn etwas nicht ideal ist.')}${p('Wenn es dringend ist, rufen Sie bitte an. Gerade bei kurzfristigen Wochenenden ist ein Gespräch oft schneller als drei Mails.')}`, image: img('1517248135467-4c7edcad34c4'), imageAlt: 'Rezeption und Lounge im Hotel', layout: 'image-right', primaryCta: { label: 'Anrufen', href: 'tel:+43521248190', icon: 'Phone' }, secondaryCta: { label: 'E-Mail schreiben', href: 'mailto:servus@alpenglow-seefeld.at', icon: 'Mail' } }, styleOverrides: lightTokens },
        { type: 'faq', data: { headline: 'Kontakt: gut zu wissen', items: faqItems() }, styleOverrides: lightTokens },
        sectionCta('Kurz fragen ist besser als lange suchen.', 'Schicken Sie uns eine Nachricht. Wir sortieren Zimmer, Zeitraum und Wünsche gemeinsam.', 'Anfrage senden', '/kontakt'),
      ],
    },
    {
      slug: 'news',
      title: 'Journal',
      seo: pageSeo('Journal des Alpenglow Resort & Spa', 'Journal des Alpenglow Resort & Spa mit Gedanken zu Ruhe, Frühstück, Retreats und Aufenthalt in Seefeld.'),
      sections: [
        { type: 'collectionHero', data: collectionHeroData({ category: 'Journal', headline: 'Notizen aus einem ruhigen Haus.', subline: 'Über Schlaf, Frühstück, kleine Gruppen und Entscheidungen, die Aufenthalte besser machen.', bgImage: img('1519681393784-d120267933ba') }), styleOverrides: darkSectionTokens() },
        { type: 'featureShowcase', data: { headline: 'Warum wir schreiben.', subline: 'Nicht für Reichweite. Sondern, weil manche Entscheidungen erst verständlich werden, wenn man sie erklärt.', image: img('1519681393784-d120267933ba'), features: [
          'Wir schreiben über echte Abläufe im Haus.',
          'Empfehlungen bleiben konkret und lokal.',
          'Keine Wellness-Floskeln, sondern nachvollziehbare Entscheidungen.',
          'Gäste sollen vor der Anfrage besser einschätzen können, ob das Haus passt.',
        ] }, styleOverrides: lightTokens },
        { type: 'collectionList', data: { headline: 'Alle Journal-Beiträge', collectionKey: 'news', columns: 3, showImage: true, showExcerpt: true, showDate: true, showSortControls: false }, styleOverrides: lightTokens },
        { type: 'bentoGrid', data: { headline: 'Themen, die immer wieder auftauchen.', subline: 'Weil sie den Aufenthalt stärker prägen als große Versprechen.', items: [
          { icon: 'Moon', title: 'Schlaf', text: 'Warum Zimmer nicht nur schön, sondern ruhig sein müssen.' },
          { icon: 'Coffee', title: 'Frühstück', text: 'Wie ein Morgen beginnt, entscheidet oft über den ganzen Tag.' },
          { icon: 'Users', title: 'Retreats', text: 'Kleine Gruppen brauchen klare Räume und genug Pausen.', span: '2' },
          { icon: 'MapPin', title: 'Seefeld', text: 'Orte, Wege und Zeiten, die wirklich funktionieren.' },
        ] }, styleOverrides: softGreenTokens },
        { type: 'faq', data: { headline: 'Journal: kurz geklärt', items: [
          { question: 'Sind das echte Texte aus dem Haus?', answer: 'Ja. Die Beiträge erklären Entscheidungen, die im Alltag des Hauses wirklich eine Rolle spielen.' },
          { question: 'Gibt es Routentipps?', answer: 'Manchmal. Wir schreiben nur über Wege und Orte, die wir sinnvoll einordnen können.' },
          { question: 'Kann ich Fragen zu einem Beitrag stellen?', answer: 'Ja, am besten per E-Mail oder direkt in der Aufenthaltsanfrage.' },
          { question: 'Wie oft erscheinen Beiträge?', answer: 'Unregelmäßig, aber bewusst. Lieber wenige gute Notizen als Pflichtcontent.' },
        ] }, styleOverrides: lightTokens },
        sectionCta('Lieber selbst ankommen als lesen?', 'Dann schicken Sie uns Zeitraum und Wünsche. Wir melden uns mit einer Empfehlung.', 'Aufenthalt anfragen', '/kontakt'),
      ],
    },
    {
      slug: 'impressum',
      title: 'Impressum',
      seo: pageSeo('Impressum', 'Impressum des Alpenglow Resort & Spa in Seefeld in Tirol.'),
      sections: [
        { type: 'legalContent', data: { headline: 'Impressum', blocks: [
          { headline: 'Verantwortlich', text: p('Alpenglow Resort & Spa GmbH<br>Möserer Straße 18<br>6100 Seefeld in Tirol<br>Österreich') },
          { headline: 'Kontakt', text: p('Telefon: +43 5212 48190<br>E-Mail: servus@alpenglow-seefeld.at') },
          { headline: 'Geschäftsführung', text: p('Mara Huter und Lukas Huter') },
          { headline: 'Register und Umsatzsteuer', text: p('Firmenbuchgericht: Landesgericht Innsbruck<br>Firmenbuchnummer: FN 482190 a<br>UID: ATU74821903') },
          { headline: 'Haftung für Inhalte', text: p('Wir erstellen die Inhalte dieser Website sorgfältig. Für Vollständigkeit, Aktualität und Richtigkeit übernehmen wir dennoch keine Gewähr.') },
          { headline: 'Urheberrecht', text: p('Texte, Bilder und Gestaltung dieser Website sind urheberrechtlich geschützt. Eine Nutzung außerhalb der gesetzlichen Grenzen bedarf der Zustimmung der Alpenglow Resort & Spa GmbH.') },
        ] } },
      ],
    },
    {
      slug: 'datenschutz',
      title: 'Datenschutz',
      seo: pageSeo('Datenschutzerklärung', 'Datenschutzerklärung des Alpenglow Resort & Spa in Seefeld in Tirol.'),
      sections: [
        { type: 'legalContent', data: { headline: 'Datenschutzerklärung', blocks: [
          { headline: 'Verantwortlicher', text: p('Alpenglow Resort & Spa GmbH, Möserer Straße 18, 6100 Seefeld in Tirol, Österreich. Kontakt: servus@alpenglow-seefeld.at.') },
          { headline: 'Hosting', text: p('Diese Website wird bei einem europäischen Hosting-Dienstleister betrieben. Dabei werden technisch notwendige Serverdaten verarbeitet, um die Website sicher bereitzustellen.') },
          { headline: 'Kontaktformular und Direktanfragen', text: p('Wenn Sie uns über das Formular kontaktieren, verarbeiten wir Ihre Angaben zur Bearbeitung der Anfrage und möglicher Anschlussfragen. Pflichtangaben sind entsprechend gekennzeichnet.') },
          { headline: 'Cookies', text: p('Technisch notwendige Cookies sichern den Betrieb der Website. Optionale Analyse- oder Marketing-Cookies werden nur nach Einwilligung gesetzt.') },
          { headline: 'Analyse und Einbindung externer Dienste', text: p('Sofern Analyse-Tools oder Kartendienste eingesetzt werden, erfolgt dies auf Basis Ihrer Einwilligung oder einer rechtlichen Grundlage nach DSGVO.') },
          { headline: 'Ihre Rechte', text: p('Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit und Widerspruch. Zudem können Sie sich bei einer Datenschutzaufsichtsbehörde beschweren.') },
        ] } },
      ],
    },
  ],
};

function sectionCta(headline, subline, label, href) {
  return {
    type: 'ctaBand',
    data: {
      badgeText: 'Direkt fragen',
      headline,
      subline,
      ctaPrimary: { label, href, icon: 'ArrowRight' },
    },
    styleOverrides: darkSectionTokens(C.forest),
  };
}

function buildOfferItem({ slug, title, excerpt, imageId, price }) {
  const image = img(imageId);
  return {
    title,
    slug,
    data: {
      excerpt,
      sections: [
        { id: uuid(), type: 'collectionHero', data: collectionHeroData({ category: 'Aufenthalt', headline: title, subline: excerpt, bgImage: image }), styleOverrides: darkSectionTokens() },
        { id: uuid(), type: 'textImage', data: { badge: 'Einordnung', headline: `${title} ist für Gäste gedacht, die Ruhe konkret suchen.`, text: `${p(excerpt)}${p('Wir erklären vor der Anfrage ehrlich, für welchen Zeitraum, welche Gäste und welche Erwartungen dieses Angebot am besten funktioniert.')}`, image, imageAlt: title, layout: 'image-right', items: [
          { icon: 'BedDouble', title: 'Zimmer mit Rolle', text: 'Nicht jedes Zimmer muss alles können. Es muss zum Aufenthalt passen.' },
          { icon: 'Coffee', title: 'Frühstück inklusive', text: 'Der Morgen beginnt ruhig und ohne Buffetstress.' },
          { icon: 'Sparkles', title: 'Spa-Zugang', text: 'Sauna, Pool und Ruheraum sind für Hausgäste enthalten.' },
          { icon: 'MessageCircle', title: 'Direkt geklärt', text: 'Wünsche und Besonderheiten werden vor Anreise sortiert.' },
        ], primaryCta: { label: 'Anfrage senden', href: '/kontakt', icon: 'ArrowRight' } }, styleOverrides: lightTokens },
        { id: uuid(), type: 'statsCounter', data: { headline: 'Kurz eingeordnet.', subline: 'Ein paar Fakten für die erste Entscheidung.', stats: [
          { value: price, label: 'Preis' },
          { value: 'inkl.', label: 'Frühstück' },
          { value: 'inkl.', label: 'Spa' },
          { value: 'direkt', label: 'Anfrage' },
        ] }, styleOverrides: softGreenTokens },
        { id: uuid(), type: 'featureShowcase', data: { headline: 'Warum dieses Angebot Sinn macht.', subline: 'Weil es nicht maximal, sondern passend gedacht ist.', image, features: [
          'Die Zimmerlage und Ausstattung werden vor Anreise sauber geklärt.',
          'Frühstück und Spa sind ohne Zusatzsuche direkt mitgedacht.',
          'Sonderwünsche landen nicht im Kommentarfeld einer Plattform.',
          'Sie bekommen eine konkrete Rückmeldung vom Haus.',
        ], ctaLabel: 'Verfügbarkeit fragen', ctaHref: '/kontakt' }, styleOverrides: lightTokens },
        { id: uuid(), ...sectionCta(`${title} anfragen?`, 'Schreiben Sie uns Zeitraum, Personenanzahl und Wünsche. Wir antworten mit einer ehrlichen Empfehlung.', 'Direkt anfragen', '/kontakt') },
      ],
    },
  };
}

function buildNewsItem({ slug, title, excerpt, imageId }) {
  const image = img(imageId);
  return {
    title,
    slug,
    data: {
      excerpt,
      date: '2026-06-03',
      image,
      sections: [
        { id: uuid(), type: 'collectionHero', data: collectionHeroData({ category: 'Journal', headline: title, subline: excerpt, bgImage: image }), styleOverrides: darkSectionTokens() },
        { id: uuid(), type: 'freeText', data: { headline: title, text: `${p(excerpt)}${p('Im Alpenglow versuchen wir, solche Entscheidungen nicht dem Zufall zu überlassen. Ein guter Aufenthalt entsteht aus vielen kleinen, sauberen Festlegungen: wann etwas passiert, wie viel erklärt werden muss und wann man Gäste einfach in Ruhe lässt.')}${p('Darum schreiben wir diese Notizen. Nicht als Werbung, sondern als Einordnung für Menschen, die vor der Anfrage wissen möchten, ob unser Haus zu ihnen passt.')}` }, styleOverrides: lightTokens },
        { id: uuid(), type: 'bentoGrid', data: { headline: 'Drei Gedanken dazu.', subline: 'Kurz, konkret und aus dem Alltag im Haus.', items: [
          { icon: 'Moon', title: 'Ruhe braucht Grenzen', text: 'Nicht alles, was möglich ist, tut einem Aufenthalt gut.' },
          { icon: 'MessageCircle', title: 'Klarheit hilft', text: 'Gute Kommunikation spart vor Ort viel Erklärung.' },
          { icon: 'Leaf', title: 'Ort zählt', text: 'Seefeld, Wald und Berge prägen den Rhythmus stärker als Dekoration.', span: '2' },
          { icon: 'HeartHandshake', title: 'Gastgeben bleibt menschlich', text: 'Manche Dinge klärt ein Gespräch besser als jedes Formular.' },
        ] }, styleOverrides: softGreenTokens },
        { id: uuid(), ...sectionCta('Fragen zum Aufenthalt?', 'Schreiben Sie uns kurz, was Sie suchen. Wir melden uns persönlich.', 'Aufenthalt anfragen', '/kontakt') },
      ],
    },
  };
}

if (require.main === module) {
  run(tenant).catch((e) => { console.error('FATAL:', e); process.exit(1); });
}

module.exports = tenant;
