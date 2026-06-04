const token = process.env.FLM_PHOTOGRAPHY_TOKEN || 'flm_pat_83a79df5fa9e34d0a33268e5939881da066f38c5b350422ec44707eaf0864d2c';
const baseUrl = 'https://flamingo-renderer.vercel.app';

async function api(method, path, body) {
  const res = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${path} failed: ${res.status} ${res.statusText}\n${text}`);
  return text ? JSON.parse(text) : null;
}

const uid = () => crypto.randomUUID();

const STYLE_KEY_TO_VARS = {
  sectionBg: ['--style-section-bg', '--token-section-bg'],
  sectionBgAlt: ['--style-section-bg-alt', '--token-section-bg-alt'],
  cardBg: ['--style-card-bg', '--token-card-bg'],
  cardBorder: ['--style-card-border-color', '--style-border-color', '--token-card-border'],
  borderColor: ['--style-border-color', '--token-card-border'],
  cardBorderColor: ['--style-card-border-color', '--style-border-color', '--token-card-border'],
  dividerColor: ['--style-divider-color', '--token-divider'],
  heading: ['--style-heading-color', '--style-text-primary', '--token-heading'],
  heroHeading: ['--style-image-text-color', '--token-on-dark-heading', '--style-heading-color', '--style-text-primary', '--token-heading'],
  subheading: ['--style-subheading-color', '--style-text-secondary', '--token-subheading'],
  body: ['--style-body-color', '--style-text-secondary', '--token-body'],
  heroBody: ['--style-image-body-color', '--token-on-dark-body', '--style-body-color', '--style-text-secondary', '--token-body'],
  muted: ['--style-text-muted', '--token-muted'],
  icon: ['--style-icon-color', '--token-icon'],
  accentColor: ['--style-accent-color', '--style-accent', '--token-eyebrow', '--token-stat-value', '--token-quote', '--token-rating-star', '--token-check'],
  eyebrow: ['--style-accent-color', '--token-eyebrow'],
  statValue: ['--token-stat-value'],
  quote: ['--token-quote'],
  ratingStar: ['--token-rating-star'],
  check: ['--token-check'],
  badgeBg: ['--style-badge-bg', '--token-badge-bg'],
  badgeText: ['--style-badge-text', '--token-badge-text'],
  badgeBorder: ['--style-badge-border', '--token-badge-border'],
  btnBg: ['--style-button-bg', '--brand-btn-bg', '--token-btn-bg'],
  btnText: ['--style-button-text', '--brand-btn-text', '--token-btn-text'],
  onDarkHeading: ['--style-image-text-color', '--token-on-dark-heading'],
  onDarkBody: ['--style-image-body-color', '--token-on-dark-body'],
  onDarkMuted: ['--style-image-muted-color', '--token-on-dark-muted'],
};

function styleVars(overrides = {}) {
  const vars = {};
  for (const [key, value] of Object.entries(overrides)) {
    if (value === undefined || value === null || value === '') continue;
    const targets = key.startsWith('--') ? [key] : STYLE_KEY_TO_VARS[key];
    if (!targets?.length) continue;
    for (const target of targets) vars[target] = String(value);
  }
  return vars;
}

const section = (type, data, styleOverrides = {}) => ({
  id: uid(),
  type,
  data,
  styleOverrides: styleVars(styleOverrides),
});

const img = {
  hero: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=2200&q=85',
  wedding: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=1800&q=85',
  couple: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=1800&q=85',
  portrait: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=1600&q=85',
  business: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=1600&q=85',
  family: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=1600&q=85',
  studio: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1600&q=85',
  detail: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1800&q=85',
  camera: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1600&q=85',
  table: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=1600&q=85',
  home: 'https://images.unsplash.com/photo-1604881988758-f76ad2f7aac1?w=1600&q=85',
  editorial: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1800&q=85',
  morning: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=1800&q=85',
  galleryA: 'https://images.unsplash.com/photo-1519741347686-c1e0aadf4611?w=1600&q=85',
  galleryB: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1600&q=85',
  galleryC: 'https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=1600&q=85',
  galleryD: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=1600&q=85',
};

const colors = {
  ink: '#1D1714',
  body: '#675C54',
  muted: '#81746B',
  cream: '#F8F4EE',
  alt: '#EFE6DA',
  card: '#FFFDFC',
  border: '#E6D7CB',
  copper: '#B98255',
  copperDeep: '#8D5938',
  sand: '#D9B98F',
  espresso: '#261915',
  onDark: '#FFF8EF',
  onDarkBody: '#F6E9DA',
  onDarkMuted: '#D9CABB',
};

const light = {
  sectionBg: colors.cream,
  sectionBgAlt: colors.alt,
  cardBg: colors.card,
  cardBorder: colors.border,
  borderColor: colors.border,
  heading: colors.ink,
  subheading: colors.body,
  body: colors.body,
  muted: colors.muted,
  icon: colors.copperDeep,
  accentColor: colors.copper,
  eyebrow: colors.copperDeep,
  statValue: colors.copperDeep,
  quote: colors.ink,
  check: colors.copperDeep,
  badgeBg: '#F1E1D2',
  badgeText: colors.copperDeep,
  badgeBorder: colors.border,
  btnBg: colors.espresso,
  btnText: colors.onDark,
};

const alt = { ...light, sectionBg: colors.alt, cardBg: '#FFF9F2' };

const dark = {
  sectionBg: colors.espresso,
  sectionBgAlt: colors.espresso,
  cardBg: 'rgba(255,248,239,0.12)',
  cardBorder: 'rgba(255,248,239,0.24)',
  borderColor: 'rgba(255,248,239,0.22)',
  heading: colors.onDark,
  subheading: colors.onDarkBody,
  body: colors.onDarkBody,
  muted: colors.onDarkMuted,
  icon: colors.sand,
  accentColor: colors.sand,
  eyebrow: colors.sand,
  statValue: colors.sand,
  quote: colors.onDark,
  check: colors.sand,
  badgeBg: 'rgba(255,248,239,0.16)',
  badgeText: colors.onDark,
  badgeBorder: 'rgba(255,248,239,0.34)',
  btnBg: colors.onDark,
  btnText: colors.espresso,
  onDarkHeading: colors.onDark,
  onDarkBody: colors.onDarkBody,
  onDarkMuted: colors.onDarkMuted,
  heroHeading: colors.onDark,
  heroBody: colors.onDarkBody,
};

const heroStyle = {
  ...dark,
  '--token-hero-content-align': 'center',
  '--token-hero-content-y': '48%',
};

const phone = '+49 69 430 88 12';
const email = 'hello@lisamorgenthaler.de';
const address = 'Berger Straße 112, 60385 Frankfurt am Main';

const navItems = [
  { label: 'Startseite', href: '/', type: 'link' },
  { label: 'Portfolio', href: '/portfolio', type: 'link' },
  { label: 'Leistungen', href: '/leistungen', type: 'link' },
  { label: 'Reportagen', href: '/referenzen', type: 'link' },
  { label: 'Über mich', href: '/ueber-uns', type: 'link' },
  { label: 'Journal', href: '/news', type: 'link' },
  { label: 'Kontakt', href: '/kontakt', type: 'link' },
];

function prefixHref(href) {
  if (!href || typeof href !== 'string') return href;
  if (href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('http') || href.startsWith('#')) return href;
  if (href === '/') return '/demo/photography';
  if (href.startsWith('/demo/photography')) return href;
  if (href.startsWith('/')) return `/demo/photography${href}`;
  return href;
}

function prefixDemoLinks(value) {
  if (Array.isArray(value)) return value.map(prefixDemoLinks);
  if (value && typeof value === 'object') {
    const copy = {};
    for (const [key, val] of Object.entries(value)) copy[key] = key === 'href' || key.endsWith('Href') ? prefixHref(val) : prefixDemoLinks(val);
    return copy;
  }
  return value;
}

function hero(headline, subline, bgImage, overrides = {}) {
  return section('hero', {
    badgeText: overrides.badgeText || 'Fotografie mit Ruhe',
    badgeIcon: overrides.badgeIcon || 'Camera',
    headline,
    subline,
    bgImage,
    bgMode: 'image',
    overlayColor: '#140C09',
    overlayOpacity: overrides.overlayOpacity ?? 0.58,
    bgPosition: overrides.bgPosition || 'center center',
    primaryCta: overrides.primaryCta || { label: 'Anfrage senden', href: '/kontakt' },
    secondaryCta: overrides.secondaryCta || { label: 'Portfolio ansehen', href: '/portfolio' },
    trustItems: overrides.trustItems || ['Hochzeiten', 'Portraits', 'Familien', 'Business'],
  }, heroStyle);
}

function cinematic(headline, subline, bgImage, overrides = {}) {
  return section('cinematicHero', {
    eyebrow: overrides.eyebrow || 'Lisa Morgenthaler Fotografie',
    headline,
    subline,
    image: bgImage,
    bgImage,
    overlayColor: '#170E0A',
    overlayOpacity: overrides.overlayOpacity ?? 0.56,
    align: overrides.align || 'left',
    primaryCta: overrides.primaryCta || { label: 'Termin anfragen', href: '/kontakt' },
    secondaryCta: overrides.secondaryCta || { label: 'Arbeiten ansehen', href: '/portfolio' },
    stats: overrides.stats || [
      { value: '12+', label: 'Jahre Erfahrung' },
      { value: '180+', label: 'Reportagen' },
      { value: '48h', label: 'erste Vorschau' },
    ],
  }, heroStyle);
}

function collectionHero(headline, subline, image, category = 'Fotografie') {
  return section('collectionHero', {
    category,
    headline,
    subline,
    image,
    bgImage: image,
    overlayColor: '#160D09',
    overlayOpacity: 0.54,
    date: 'Frankfurt · Rhein-Main',
    primaryCta: { label: 'Anfragen', href: '/kontakt' },
    secondaryCta: { label: 'Portfolio', href: '/portfolio' },
  }, heroStyle);
}

function cta(headline, subline, ctaOverride = {}) {
  return section('immersiveCtaBanner', {
    badge: 'Nächster Schritt',
    headline,
    subline,
    bgImage: img.detail,
    image: img.detail,
    overlayColor: '#1B100C',
    overlayOpacity: 0.62,
    primaryCta: ctaOverride.primaryCta || { label: 'Anfrage senden', href: '/kontakt' },
    secondaryCta: ctaOverride.secondaryCta || { label: 'Leistungen ansehen', href: '/leistungen' },
  }, dark);
}

const galleryImages = [
  { src: img.wedding, alt: 'Hochzeitsreportage im warmen Abendlicht', category: 'Hochzeit', location: 'Rheingau' },
  { src: img.couple, alt: 'Paarshooting mit natürlicher Nähe', category: 'Paare', location: 'Frankfurt' },
  { src: img.portrait, alt: 'Ruhiges Portrait mit weichem Licht', category: 'Portrait', location: 'Studio' },
  { src: img.business, alt: 'Business Portrait ohne steife Pose', category: 'Business', location: 'Innenstadt' },
  { src: img.family, alt: 'Familienreportage zuhause', category: 'Familie', location: 'Rhein-Main' },
  { src: img.table, alt: 'Details einer Sommerhochzeit', category: 'Hochzeit', location: 'Mainufer' },
  { src: img.morning, alt: 'Paarshooting im Morgenlicht', category: 'Paare', location: 'Taunus' },
  { src: img.editorial, alt: 'Editoriale Hochzeitsdetails', category: 'Hochzeit', location: 'Wiesbaden' },
  { src: img.galleryA, alt: 'Leiser Moment vor der Trauung', category: 'Hochzeit', location: 'Rhein-Main' },
  { src: img.galleryB, alt: 'Location, Licht und Stimmung', category: 'Reportage', location: 'Hessen' },
  { src: img.galleryC, alt: 'Natürliches Lachen statt Anweisung', category: 'Paare', location: 'Frankfurt' },
  { src: img.galleryD, alt: 'Portrait mit klarer Haltung', category: 'Portrait', location: 'Studio' },
];

const services = [
  {
    slug: 'hochzeitsreportage',
    title: 'Hochzeitsreportage',
    excerpt: 'Vom Getting Ready bis zur Tanzfläche: ruhig begleitet, sauber erzählt und ohne ständiges Inszenieren.',
    text: 'Vom Getting Ready bis zur Tanzfläche: ruhig begleitet, sauber erzählt und ohne ständiges Inszenieren.',
    image: img.wedding,
    category: 'Hochzeit',
    durationLabel: 'ab 6 Stunden',
    priceLabel: 'ab 2.400 €',
    icon: 'Heart',
  },
  {
    slug: 'paarshooting',
    title: 'Paarshooting',
    excerpt: 'Ein Spaziergang, gutes Licht und genug Raum, damit Nähe nicht gestellt wirkt.',
    text: 'Ein Spaziergang, gutes Licht und genug Raum, damit Nähe nicht gestellt wirkt.',
    image: img.couple,
    category: 'Paare',
    durationLabel: '90 Minuten',
    priceLabel: 'ab 390 €',
    icon: 'Sparkles',
  },
  {
    slug: 'portraitshooting',
    title: 'Portraitshooting',
    excerpt: 'Portraits für Menschen, die sich auf Bildern wiedererkennen wollen statt eine Rolle zu spielen.',
    text: 'Portraits für Menschen, die sich auf Bildern wiedererkennen wollen statt eine Rolle zu spielen.',
    image: img.portrait,
    category: 'Portrait',
    durationLabel: '60-90 Minuten',
    priceLabel: 'ab 320 €',
    icon: 'User',
  },
  {
    slug: 'business-portraits',
    title: 'Business Portraits',
    excerpt: 'Klare Bilder für Websites, LinkedIn und Teams: professionell, aber nicht glattgebügelt.',
    text: 'Klare Bilder für Websites, LinkedIn und Teams: professionell, aber nicht glattgebügelt.',
    image: img.business,
    category: 'Business',
    durationLabel: 'halb- oder ganztags',
    priceLabel: 'auf Anfrage',
    icon: 'Briefcase',
  },
  {
    slug: 'familienreportage',
    title: 'Familienreportage',
    excerpt: 'Alltag, Nähe und kleine Gesten. Bilder, die nicht nach Studio klingen.',
    text: 'Alltag, Nähe und kleine Gesten. Bilder, die nicht nach Studio klingen.',
    image: img.family,
    category: 'Familie',
    durationLabel: '2 Stunden',
    priceLabel: 'ab 520 €',
    icon: 'Home',
  },
  {
    slug: 'after-wedding-editorial',
    title: 'After-Wedding & Editorial',
    excerpt: 'Noch einmal in Ruhe, mit gutem Licht, stärkerer Bildsprache und weniger Zeitdruck.',
    text: 'Noch einmal in Ruhe, mit gutem Licht, stärkerer Bildsprache und weniger Zeitdruck.',
    image: img.editorial,
    category: 'Editorial',
    durationLabel: '2-4 Stunden',
    priceLabel: 'ab 690 €',
    icon: 'Camera',
  },
];

const packages = [
  {
    name: 'Portrait',
    price: 'ab 320 €',
    priceNote: 'inkl. Auswahlgalerie',
    description: 'Für Bewerbungen, Websites, Social Profile oder einfach ein Bild, das sich nach Ihnen anfühlt.',
    features: ['Vorgespräch und Bildidee', '60-90 Minuten Shooting', 'Online-Auswahlgalerie', '6 retuschierte Dateien'],
    ctaLabel: 'Portrait anfragen',
    ctaHref: '/kontakt',
  },
  {
    name: 'Reportage',
    price: 'ab 1.200 €',
    priceNote: 'halbtags',
    description: 'Für kleine Hochzeiten, Familienmomente, Business-Storys oder Events mit klarer Bildsprache.',
    features: ['Ablaufplanung vorab', '4 Stunden Begleitung', 'kurze Vorschau in 48 Stunden', 'komplette Online-Galerie'],
    highlighted: true,
    ctaLabel: 'Reportage planen',
    ctaHref: '/kontakt',
  },
  {
    name: 'Hochzeit',
    price: 'ab 2.400 €',
    priceNote: 'ganzer Tag',
    description: 'Für Paare, die ihre Hochzeit dokumentiert haben möchten, ohne dass der Tag zur Fotoshow wird.',
    features: ['ausführliches Kennenlernen', '6-10 Stunden Begleitung', 'Highlights innerhalb 48 Stunden', 'passwortgeschützte Galerie'],
    ctaLabel: 'Hochzeit anfragen',
    ctaHref: '/kontakt',
  },
];

const reportages = [
  {
    slug: 'hochzeit-am-see',
    title: 'Hochzeit am See',
    excerpt: 'Eine freie Trauung im warmen Abendlicht, leise Momente vor dem Ja-Wort und ein Dinner direkt am Wasser.',
    image: img.wedding,
    category: 'Hochzeit',
  },
  {
    slug: 'paarshooting-im-morgenlicht',
    title: 'Paarshooting im Morgenlicht',
    excerpt: 'Ein ruhiger Spaziergang, klare Luft und Bilder, die mehr nach Nähe als nach Pose aussehen.',
    image: img.morning,
    category: 'Paare',
  },
  {
    slug: 'business-portraits-mit-ruhe',
    title: 'Business Portraits mit Ruhe',
    excerpt: 'Ein Team-Shooting für eine Beratung, das professionell wirkt, ohne die Menschen dahinter zu verstecken.',
    image: img.business,
    category: 'Business',
  },
  {
    slug: 'familienreportage-zuhause',
    title: 'Familienreportage zuhause',
    excerpt: 'Zwei Stunden Alltag, Spiel, Chaos und Nähe. Genau deshalb bleiben diese Bilder wichtig.',
    image: img.family,
    category: 'Familie',
  },
];

const newsItems = [
  {
    slug: 'was-ein-paarshooting-entspannt-macht',
    title: 'Was ein Paarshooting entspannt macht',
    excerpt: 'Warum gute Vorbereitung wichtiger ist als perfekte Posen und wie ein Shooting sich leicht anfühlen kann.',
    image: img.couple,
    content: '<p>Ein gutes Paarshooting beginnt nicht mit einer Pose, sondern mit einem Rahmen, in dem Sie sich bewegen können. Ich arbeite deshalb mit kleinen Wegen, Lichtpausen und einfachen Aufgaben statt mit starren Anweisungen.</p><p>Das Ziel ist nicht, dass jedes Bild perfekt kontrolliert wirkt. Das Ziel ist, dass Sie sich später wiedererkennen.</p>',
  },
  {
    slug: 'hochzeitsreportage-vorbereitung',
    title: 'Was ich vor einer Hochzeit wirklich wissen muss',
    excerpt: 'Ablauf, Licht, wichtige Menschen und die Momente, die auf keinen Fall untergehen sollen.',
    image: img.table,
    content: '<p>Vor einer Hochzeit klären wir nicht nur Zeiten und Adressen. Wichtig sind auch die Menschen, die eine besondere Rolle spielen, sensible Situationen und Momente, die Ihnen persönlich viel bedeuten.</p><p>So kann ich aufmerksam fotografieren, ohne den Tag ständig zu unterbrechen.</p>',
  },
  {
    slug: 'business-portraits-ohne-steife-posen',
    title: 'Business Portraits ohne steife Posen',
    excerpt: 'Wie professionelle Bilder entstehen, die klar wirken, aber nicht austauschbar aussehen.',
    image: img.business,
    content: '<p>Business Portraits funktionieren besser, wenn sie zur Rolle, zur Branche und zur Persönlichkeit passen. Deshalb sprechen wir vorab über Einsatzorte: Website, LinkedIn, Presse oder Teamseite.</p><p>Dann entsteht eine Bildsprache, die ruhig, glaubwürdig und professionell ist.</p>',
  },
  {
    slug: 'online-galerie-prints-bildauswahl',
    title: 'Online-Galerie, Prints und Bildauswahl',
    excerpt: 'Wie Sie nach dem Shooting schnell zu einer sauberen Auswahl und hochwertigen Dateien kommen.',
    image: img.camera,
    content: '<p>Nach dem Shooting bekommen Sie eine geschützte Galerie. Dort markieren Sie Favoriten, teilen Bilder mit Familie oder Team und bestellen auf Wunsch Prints.</p><p>Die Galerie ist bewusst einfach gehalten, damit die Auswahl nicht komplizierter wird als das Shooting.</p>',
  },
];

const processSteps = [
  { title: 'Anfrage & Gefühl prüfen', text: 'Sie schicken Anlass, Datum, Ort und groben Umfang. Ich antworte ehrlich, ob ich passe und welche Dauer sinnvoll ist.', icon: 'message' },
  { title: 'Planung ohne Überladung', text: 'Wir klären Ablauf, Licht, wichtige Menschen und mögliche Stolperstellen. Danach ist genug vorbereitet, aber nicht alles verkrampft.', icon: 'calendar' },
  { title: 'Fotografieren mit ruhiger Führung', text: 'Ich gebe kurze Hinweise, wenn sie helfen, und halte mich zurück, wenn der Moment gerade selbst trägt.', icon: 'camera' },
  { title: 'Vorschau & Galerie', text: 'Sie erhalten eine erste Auswahl meist innerhalb von 48 Stunden und danach eine saubere Online-Galerie mit Download.', icon: 'image' },
];

const testimonials = [
  { quote: 'Wir haben kaum gemerkt, wann Lisa fotografiert hat. Genau deshalb fühlen sich die Bilder so echt an.', author: 'Mara & Jens', meta: 'Hochzeit im Rheingau', rating: 5 },
  { quote: 'Für unser Team war es das erste Shooting ohne diese typische Business-Steifheit. Sehr klar, sehr angenehm.', author: 'Studio Nord', meta: 'Business Portraits', rating: 5 },
  { quote: 'Die Familienbilder sehen nach unserem Zuhause aus, nicht nach Fotostudio. Das war uns wichtig.', author: 'Katharina M.', meta: 'Familienreportage', rating: 5 },
];

const faqItems = [
  { question: 'Wie früh sollten wir anfragen?', answer: 'Für Hochzeiten gern 9-18 Monate vorher. Portraits und Business-Shootings lassen sich oft kurzfristiger planen.' },
  { question: 'Können wir vorab telefonieren?', answer: 'Ja. Ein kurzes Gespräch ist immer sinnvoll, damit Umfang, Stimmung und Ablauf passen.' },
  { question: 'Bekommen wir alle Bilder?', answer: 'Sie erhalten eine kuratierte, sauber bearbeitete Galerie. Unscharfe Doppelungen oder Testbilder sind nicht enthalten.' },
  { question: 'Fotografierst du auch außerhalb von Frankfurt?', answer: 'Ja. Rhein-Main ist meine Basis, Hochzeiten und Reportagen begleite ich auch deutschlandweit.' },
];

function faqSection(headline) {
  return section('faq', { badge: 'FAQ', headline, subline: 'Die wichtigsten Fragen vor der Anfrage.', items: faqItems }, light);
}

const pages = [
  {
    slug: '',
    title: 'Startseite',
    sections: [
      cinematic('Bilder, die nicht lauter sind als der Moment.', 'Hochzeiten, Portraits und Reportagen mit ruhigem Blick, gutem Timing und Bildern, die auch Jahre später noch nach dem Tag fühlen.', img.hero),
      section('uspStrip', {
        items: [
          { icon: 'Eye', title: 'ruhig geführt', text: 'klare Anleitung ohne steife Posen' },
          { icon: 'Clock', title: 'schnelle Vorschau', text: 'erste Highlights meist in 48 Stunden' },
          { icon: 'Image', title: 'saubere Galerie', text: 'Auswahl, Download und Teilen an einem Ort' },
          { icon: 'Heart', title: 'echte Momente', text: 'Reportage statt Dauerinszenierung' },
        ],
      }, light),
      section('portfolioGallery', { badge: 'Portfolio', headline: 'Ein Blick, viele Situationen.', subline: 'Hochzeiten, Paare, Portraits und Familienreportagen. Jede Serie bleibt ruhig, aber nicht beliebig.', images: galleryImages, categories: ['Hochzeit', 'Paare', 'Portrait', 'Business', 'Familie'], cta: { label: 'Portfolio öffnen', href: '/portfolio', icon: 'ArrowRight' } }, light),
      section('servicesGrid', { badge: 'Leistungen', headline: 'Fotografie für Menschen, die keine Show brauchen.', subline: 'Ob Hochzeit, Portrait oder Business: Ich plane genug, damit am Tag selbst Raum für echte Bilder bleibt.', services }, alt),
      section('photographerAbout', {
        badge: 'Über Lisa',
        headline: 'Ich fotografiere leise, aber sehr aufmerksam.',
        intro: '<p>Ich begleite Menschen, die sich natürliche Bilder wünschen, aber trotzdem klare Führung brauchen. Meine Arbeit ist ruhig, strukturiert und nah genug, um die wichtigen Momente nicht zu verpassen.</p>',
        story: '<p>Vor jeder Reportage sprechen wir über Ablauf, Licht, Prioritäten und sensible Situationen. Danach dürfen Sie den Tag wieder erleben, statt ihn für die Kamera zu spielen.</p>',
        image: img.portrait,
        facts: ['Frankfurt am Main · unterwegs in Rhein-Main und DACH', 'Hochzeiten, Portraits, Familien und Business-Reportagen', 'Online-Galerie, Bildauswahl und Printoptionen inklusive'],
        values: [
          { title: 'Zurückhaltung', text: 'Ich greife nur ein, wenn es hilft.' },
          { title: 'Klarheit', text: 'Sie wissen vorher, was passiert und wann.' },
          { title: 'Licht', text: 'Gutes Licht ist Planung, nicht Glück.' },
          { title: 'Respekt', text: 'Bilder dürfen nah sein, ohne privat zu wirken.' },
        ],
        ctaLabel: 'Mehr über mich',
        ctaHref: '/ueber-uns',
      }, light),
      section('shootingProcess', { badge: 'Ablauf', headline: 'Ein Prozess, der Sicherheit gibt.', subline: 'Nicht kompliziert, aber sauber vorbereitet.', steps: processSteps }, alt),
      section('proofWall', { badge: 'Stimmen', headline: 'Ruhig fotografiert. Stark erinnert.', subline: 'Was Kundinnen und Kunden besonders oft nennen: entspannte Atmosphäre, klare Kommunikation und Bilder, die nicht gestellt wirken.', stats: [{ value: '180+', label: 'Reportagen' }, { value: '4,9/5', label: 'Kundenstimmen' }, { value: '48h', label: 'erste Highlights' }], quotes: testimonials }, light),
      section('newsPreview', { badge: 'Journal', headline: 'Notizen zu Bildern, Planung und Licht.', subline: 'Praktische Gedanken für Paare, Teams und Menschen vor der Kamera.', collectionKey: 'news', limit: 3, cta: { label: 'Alle Beiträge lesen', href: '/news' } }, alt),
      cta('Lassen Sie uns über Bilder sprechen, bevor der Termin voll wird.', 'Schreiben Sie kurz, worum es geht. Ich antworte mit einer klaren Einschätzung zu Ablauf, Licht, Dauer und Budget.'),
    ],
  },
  {
    slug: 'portfolio',
    title: 'Portfolio',
    sections: [
      hero('Portfolio mit Ruhe, Licht und echten Übergängen.', 'Ein Auszug aus Hochzeiten, Portraits, Business-Shootings und Familienreportagen. Nicht als Showreel gedacht, sondern als Gefühl für meine Art zu sehen.', img.galleryB, { badgeText: 'Auswahl' }),
      section('portfolioGallery', { badge: 'Arbeiten', headline: 'Serien statt Einzelglück.', subline: 'Eine gute Reportage besteht nicht aus einem perfekten Bild, sondern aus einem Rhythmus.', images: galleryImages, categories: ['Hochzeit', 'Paare', 'Portrait', 'Business', 'Familie'], cta: { label: 'Reportage anfragen', href: '/kontakt', icon: 'Send' } }, light),
      section('editorialFeatureRail', {
        badge: 'Bildsprache',
        headline: 'Worauf ich beim Fotografieren achte.',
        subline: 'Die besten Bilder entstehen selten durch Druck. Sie entstehen, wenn Licht, Nähe und Timing zusammenkommen.',
        slides: [
          { eyebrow: '01', title: 'Nähe ohne Druck', text: 'Ich bleibe aufmerksam, aber lasse Situationen atmen.', image: img.couple, cta: { label: 'Paarshooting', href: '/c/leistungen/paarshooting' } },
          { eyebrow: '02', title: 'Reportage mit Struktur', text: 'Ablauf, Familie und wichtige Details sind vorher geklärt.', image: img.wedding, cta: { label: 'Hochzeit', href: '/c/leistungen/hochzeitsreportage' } },
          { eyebrow: '03', title: 'Portraits mit Haltung', text: 'Sie bekommen Führung, aber kein starres Posing.', image: img.portrait, cta: { label: 'Portrait', href: '/c/leistungen/portraitshooting' } },
        ],
      }, light),
      cta('Passt diese Bildsprache zu Ihrem Termin?', 'Dann reicht eine kurze Anfrage mit Anlass, Datum und Ort.'),
    ],
  },
  {
    slug: 'leistungen',
    title: 'Leistungen',
    sections: [
      hero('Leistungen, die sich nach Ihrem Termin richten.', 'Nicht jedes Shooting braucht denselben Umfang. Wir klären, was Sie wirklich brauchen: Reportage, Portrait, Teamtag oder Familienmoment.', img.camera, { badgeText: 'Leistungen', secondaryCta: { label: 'Pakete ansehen', href: '#pakete' } }),
      section('servicesGrid', { badge: 'Übersicht', headline: 'Von einer Stunde bis zum ganzen Tag.', subline: 'Jede Leistung lässt sich an Ort, Licht, Menschen und spätere Nutzung anpassen.', services }, light),
      section('servicePackages', { badge: 'Pakete', headline: 'Orientierung ohne Kleingedrucktes.', subline: 'Die Pakete geben einen Rahmen. Das konkrete Angebot entsteht nach Datum, Ort und gewünschtem Umfang.', packages, note: 'Alle Pakete können um zweite Fotografin, Prints, Alben oder zusätzliche Stunden ergänzt werden.' }, alt),
      section('comparisonCardsPro', {
        badge: 'Entscheidungshilfe',
        headline: 'Welcher Umfang passt?',
        subline: 'Wenn Sie unsicher sind, starten wir mit dem Anlass und arbeiten den sinnvollen Umfang heraus.',
        plans: [
          { name: 'Kurz & klar', price: '1-2 Std.', note: 'Portraits, kleine Familienmomente, schnelle Business-Bilder', features: ['wenig Vorplanung', 'klare Bildliste', 'schnelle Galerie'], ctaLabel: 'Anfragen', ctaHref: '/kontakt' },
          { name: 'Halber Tag', price: '4 Std.', note: 'kleine Hochzeiten, Events und Teamreportagen', highlighted: true, features: ['Ablaufcheck', 'Reportage + Portraits', 'Highlights in 48h'], ctaLabel: 'Planen', ctaHref: '/kontakt' },
          { name: 'Ganzer Tag', price: '6-10 Std.', note: 'Hochzeiten und umfassende Geschichten', features: ['Kennenlernen', 'voller Ablauf', 'Online-Galerie für Gäste'], ctaLabel: 'Besprechen', ctaHref: '/kontakt' },
        ],
      }, light),
      faqSection('Fragen vor der Buchung'),
      cta('Noch unsicher beim Umfang?', 'Schreiben Sie mir Anlass, Datum und Ort. Ich empfehle ehrlich, was sinnvoll ist.'),
    ],
  },
  {
    slug: 'referenzen',
    title: 'Reportagen',
    sections: [
      hero('Reportagen, die einen ganzen Moment tragen.', 'Vier Beispiele aus Hochzeit, Paarshooting, Business und Familie. Jede Geschichte hat ihren eigenen Takt.', img.wedding, { badgeText: 'Reportagen' }),
      section('collectionList', { badge: 'Auswahl', headline: 'Ausgewählte Geschichten', subline: 'Nicht nur schöne Einzelbilder, sondern vollständige Situationen mit Anfang, Mitte und Nachklang.', collectionKey: 'reportagen', layout: 'cards' }, light),
      section('portfolioGallery', { badge: 'Galerie', headline: 'Bilder aus den Reportagen.', subline: 'Ein zweiter Blick in Licht, Details und Zwischenmomente.', images: galleryImages.slice(0, 8), categories: ['Hochzeit', 'Paare', 'Business', 'Familie'] }, alt),
      cta('Soll Ihre Geschichte dazukommen?', 'Erzählen Sie kurz, was geplant ist. Ich melde mich mit Rückfragen und einem sauberen Vorschlag.'),
    ],
  },
  {
    slug: 'ueber-uns',
    title: 'Über mich',
    sections: [
      hero('Ruhig im Auftreten, präzise im Blick.', 'Ich arbeite am liebsten so, dass Menschen vergessen, dass sie fotografiert werden, aber trotzdem wissen, dass alles Wichtige gesehen wird.', img.portrait, { badgeText: 'Über Lisa' }),
      section('photographerAbout', {
        badge: 'Über mich',
        headline: 'Ich mag Bilder, die nicht nach Anweisung aussehen.',
        intro: '<p>Meine Kamera ist selten der Mittelpunkt. Ich beobachte, sortiere Licht, gebe kurze Hinweise und lasse Situationen dann wieder passieren.</p>',
        story: '<p>Was mir wichtig ist: gute Vorbereitung, klare Kommunikation und ein Blick für die leisen Momente zwischen den offensichtlichen Motiven. Genau dort entstehen oft die Bilder, die bleiben.</p>',
        image: img.camera,
        facts: ['Studium Kommunikationsdesign · Schwerpunkt Fotografie', 'Reportage, Portrait, Hochzeit und Business seit 2014', 'zuhause in Frankfurt, unterwegs in Deutschland und Europa'],
        values: [
          { title: 'Ehrlichkeit', text: 'Ich verspreche keine Magie, sondern gute Vorbereitung und Aufmerksamkeit.' },
          { title: 'Timing', text: 'Ich fotografiere nicht alles. Ich fotografiere, was trägt.' },
          { title: 'Würde', text: 'Menschen sollen auf Bildern stark wirken, nicht bloßgestellt.' },
          { title: 'Ruhe', text: 'Eine ruhige Begleitung macht den Tag leichter.' },
        ],
        ctaLabel: 'Kontakt aufnehmen',
        ctaHref: '/kontakt',
      }, light),
      section('principlesGrid', {
        badge: 'Prinzipien',
        headline: 'Gute Bilder brauchen keinen lauten Auftritt.',
        subline: 'Vier Dinge, die meine Arbeit durchziehen.',
        principles: [
          { eyebrow: '01', title: 'Erst verstehen', text: 'Ich frage vorher nach Menschen, Ablauf und Prioritäten.' },
          { eyebrow: '02', title: 'Licht ernst nehmen', text: 'Gutes Licht ist kein Zufall, sondern Teil der Planung.' },
          { eyebrow: '03', title: 'Nähe dosieren', text: 'Ich komme nah genug, ohne Situationen zu übernehmen.' },
          { eyebrow: '04', title: 'Serien denken', text: 'Am Ende soll nicht nur ein Bild gut sein, sondern die ganze Geschichte.' },
        ],
        cta: { label: 'Arbeitsweise besprechen', href: '/kontakt' },
      }, alt),
      section('scrollStory', {
        badge: 'Arbeitsweise',
        headline: 'Vom ersten Gespräch bis zur fertigen Galerie.',
        subline: 'Ein Shooting wird entspannter, wenn alle wissen, was passiert.',
        items: [
          { title: 'Vorgespräch', text: 'Wir klären Anlass, Stimmung, Ort, Timing und spätere Nutzung.', image: img.studio },
          { title: 'Planung', text: 'Ich schaue auf Licht, Wege, sensible Momente und sinnvolle Bildgruppen.', image: img.detail },
          { title: 'Shooting', text: 'Sie bekommen klare Führung, aber keine Dauerregie.', image: img.couple },
          { title: 'Galerie', text: 'Sie erhalten eine geschützte Online-Galerie mit Auswahl und Download.', image: img.camera },
        ],
      }, light),
      cta('Wenn diese Arbeitsweise passt, sprechen wir konkret.', 'Ein kurzes Gespräch reicht oft, um Termin, Umfang und Budget sauber einzuordnen.'),
    ],
  },
  {
    slug: 'news',
    title: 'Journal',
    sections: [
      hero('Journal für bessere Vorbereitung.', 'Gedanken zu Shootings, Hochzeiten, Portraits, Licht und den kleinen Entscheidungen, die Bilder leichter machen.', img.table, { badgeText: 'Journal' }),
      section('newsGrid', { badge: 'Bildnotizen', headline: 'Praktisch, ehrlich, ohne Fotografie-Pathos.', subline: 'Einblicke in Vorbereitung, Bildauswahl, Reportagen und ruhiges Arbeiten vor der Kamera.', collectionKey: 'news', limit: 12 }, light),
      cta('Lieber direkt besprechen?', 'Schicken Sie mir Anlass, Datum und Ort. Ich antworte mit den nächsten sinnvollen Schritten.'),
    ],
  },
  {
    slug: 'kontakt',
    title: 'Kontakt',
    sections: [
      hero('Erzählen Sie mir, was fotografiert werden soll.', 'Datum, Ort, Anlass und was Ihnen wichtig ist reichen für den Start. Ich melde mich mit Rückfragen, Einschätzung und nächstem Schritt.', img.home, { badgeText: 'Kontakt', secondaryCta: { label: 'Leistungen ansehen', href: '/leistungen' } }),
      section('contact', { badge: 'Anfrage', headline: 'Kurze Nachricht, klare Antwort.', subline: 'Bitte nennen Sie Datum, Ort, Anlass und groben Umfang. Wenn etwas noch offen ist, reicht eine erste Idee.', phone, email, address, formEnabled: true, submitLabel: 'Anfrage senden', fields: [{ name: 'name', label: 'Name', type: 'text', required: true }, { name: 'email', label: 'E-Mail', type: 'email', required: true }, { name: 'topic', label: 'Anlass', type: 'select', options: ['Hochzeit', 'Paarshooting', 'Portrait', 'Business', 'Familie', 'Sonstiges'] }, { name: 'date', label: 'Datum', type: 'text' }, { name: 'message', label: 'Nachricht', type: 'textarea', required: true }] }, light),
      faqSection('Häufige Fragen'),
      section('map', { badge: 'Standort', headline: 'Frankfurt als Basis, unterwegs dahin, wo Bilder entstehen.', subline: 'Shootings in Frankfurt, Rhein-Main, Hessen und für Hochzeiten auch deutschlandweit.', address, mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2642.0!2d8.6821!3d50.1109!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1sFrankfurt%20am%20Main!5e0!3m2!1sde!2sde!4v1710000000000' }, alt),
    ],
  },
  {
    slug: 'impressum',
    title: 'Impressum',
    sections: [section('legalContent', { headline: 'Impressum', blocks: [{ title: 'Angaben', content: 'Lisa Morgenthaler Fotografie, Berger Straße 112, 60385 Frankfurt am Main' }, { title: 'Kontakt', content: `${email} · ${phone}` }, { title: 'Hinweis', content: 'Dies ist ein Demo-Tenant von Flamingo Media. Inhalte dienen der Demonstration.' }] }, light)],
  },
  {
    slug: 'datenschutz',
    title: 'Datenschutz',
    sections: [section('legalContent', { headline: 'Datenschutzerklärung', blocks: [{ title: 'Verantwortliche', content: 'Lisa Morgenthaler Fotografie' }, { title: 'Kontaktformular', content: 'Anfragen werden zur Bearbeitung gespeichert und nicht ohne Anlass weitergegeben.' }, { title: 'Galerien', content: 'Online-Galerien können passwortgeschützt bereitgestellt werden.' }, { title: 'Hosting', content: 'Diese Demo wird technisch über Flamingo Media bereitgestellt.' }] }, light)],
  },
];

function serviceItemSections(item) {
  return prefixDemoLinks([
    collectionHero(item.title, item.excerpt, item.image, item.category),
    section('textImage', {
      badge: item.category,
      headline: `${item.title}, aber ohne Standardprogramm.`,
      text: `<p>${item.excerpt}</p><p>Vor dem Termin klären wir, welche Bilder wirklich gebraucht werden, wie viel Führung sinnvoll ist und welcher Ablauf die besten Voraussetzungen schafft.</p>`,
      image: item.image,
      imagePosition: 'right',
      cta: { label: 'Anfrage senden', href: '/kontakt' },
    }, light),
    section('shootingProcess', { badge: 'Ablauf', headline: 'So läuft die Zusammenarbeit.', steps: processSteps }, alt),
    section('portfolioGallery', { badge: 'Beispiele', headline: 'Bildgefühl für diese Leistung.', images: galleryImages.filter((image) => image.category === item.category || image.category === 'Reportage').slice(0, 6), categories: [item.category, 'Reportage'] }, light),
    faqSection('Fragen zu dieser Leistung'),
    cta('Passt diese Leistung zu Ihrem Termin?', 'Schicken Sie mir Datum, Ort und ein paar Sätze zum Anlass.'),
  ]);
}

function reportageItemSections(item) {
  return prefixDemoLinks([
    collectionHero(item.title, item.excerpt, item.image, item.category),
    section('freeText', { content: `<p>${item.excerpt}</p><p>Bei dieser Reportage ging es nicht darum, möglichst viel zu inszenieren. Wichtig waren ein klarer Ablauf, gutes Licht und der Mut, Zwischentöne stehen zu lassen.</p><p>Die Bildstrecke verbindet Details, Portraits und dokumentarische Momente zu einer Geschichte, die sich ruhig und vollständig anfühlt.</p>` }, light),
    section('portfolioGallery', { badge: item.category, headline: 'Aus der Reportage', images: galleryImages.slice(0, 9), categories: ['Hochzeit', 'Paare', 'Portrait', 'Business', 'Familie'] }, alt),
    section('proofWall', { badge: 'Stimme', headline: 'Was hängen geblieben ist.', quotes: testimonials.slice(0, 2), stats: [{ value: '48h', label: 'erste Vorschau' }, { value: '1', label: 'geschützte Galerie' }] }, light),
    cta('Eine ähnliche Reportage planen?', 'Erzählen Sie mir kurz Anlass, Ort und Datum.'),
  ]);
}

function newsItemSections(item) {
  return prefixDemoLinks([
    collectionHero(item.title, item.excerpt, item.image, 'Journal'),
    section('freeText', { content: item.content }, light),
    section('portfolioGallery', { badge: 'Passende Arbeiten', headline: 'Bilder, die dazu passen.', images: galleryImages.slice(0, 6) }, alt),
    cta('Sie möchten das konkret besprechen?', 'Eine kurze Anfrage reicht für den Start.'),
  ]);
}

async function upsertPage(page, existingPages) {
  const existing = existingPages.find((p) => p.slug === page.slug);
  const payload = { slug: page.slug, title: page.title, sections: prefixDemoLinks(page.sections), visible: true, status: 'published' };
  if (existing) return api('PUT', `/api/v1/content/pages/${existing.id}`, payload);
  return api('POST', '/api/v1/content/pages', payload);
}

async function ensureCollection(key, label, collections) {
  const found = collections.find((c) => c.key === key);
  if (found) return found;
  return api('POST', '/api/v1/content/collections', { key, label });
}

async function replaceCollectionItems(key, label, items, makeSections, collections) {
  const collection = await ensureCollection(key, label, collections);
  for (const item of collection.items || []) await api('DELETE', `/api/v1/content/collections/${key}/items/${item.id}`);
  for (const item of items) {
    await api('POST', `/api/v1/content/collections/${key}/items`, {
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt,
      published: true,
      data: {
        image: item.image,
        category: item.category,
        author: 'Lisa Morgenthaler',
        date: '2026-06-04',
        sections: makeSections(item),
      },
    });
  }
}

async function main() {
  const pagesBefore = await api('GET', '/api/v1/content/pages');
  const collectionsBefore = await api('GET', '/api/v1/content/collections');
  const existingPages = pagesBefore.pages || [];
  const existingCollections = collectionsBefore.collections || [];

  await api('PUT', '/api/v1/content/style', { style: 'classic' });
  await api('PUT', '/api/v1/content/brand', {
    companyName: 'Lisa Morgenthaler Fotografie',
    tagline: 'Hochzeiten, Portraits und Reportagen mit ruhigem Blick',
    primaryColor: colors.espresso,
    secondaryColor: colors.copperDeep,
    accentColor: colors.copper,
    logo: '',
    logoDisplay: 'name',
    headingFont: 'Inter',
    bodyFont: 'Inter',
    topBarColor: colors.espresso,
    footerColor: colors.espresso,
  });
  await api('PUT', '/api/v1/content/design', {
    textPrimary: colors.ink,
    textSecondary: colors.body,
    sectionBg: colors.cream,
    sectionBgAlt: colors.alt,
    cardBg: colors.card,
    cardBorder: colors.border,
    badgeBg: '#F1E1D2',
    badgeText: colors.copperDeep,
    badgeBorder: colors.border,
    brand: colors.espresso,
    accent: colors.copper,
    heading: colors.ink,
    subheading: colors.body,
    body: colors.body,
    muted: colors.muted,
    icon: colors.copperDeep,
    btnBg: colors.espresso,
    btnText: colors.onDark,
    dividerColor: colors.border,
    eyebrow: colors.copperDeep,
    statValue: colors.copperDeep,
    quote: colors.ink,
    ratingStar: colors.copper,
    check: colors.copperDeep,
    onDarkHeading: colors.onDark,
    onDarkBody: colors.onDarkBody,
    onDarkMuted: colors.onDarkMuted,
  });
  await api('PUT', '/api/v1/content/contact', { phone, email, address, whatsappEnabled: false, whatsapp: '', whatsappColor: colors.copperDeep });
  await api('PUT', '/api/v1/content/navigation', { items: navItems, cta: { label: 'Anfrage senden', href: '/kontakt' } });
  await api('PUT', '/api/v1/content/footer', {
    columns: [
      { title: 'Fotografie', items: [{ text: 'Portfolio', href: '/portfolio' }, { text: 'Leistungen', href: '/leistungen' }, { text: 'Reportagen', href: '/referenzen' }] },
      { title: 'Anfragen', items: [{ text: 'Hochzeit', href: '/c/leistungen/hochzeitsreportage' }, { text: 'Portrait', href: '/c/leistungen/portraitshooting' }, { text: 'Business', href: '/c/leistungen/business-portraits' }] },
      { title: 'Kontakt', items: [{ text: email }, { text: phone }, { text: address }] },
    ],
    legalLinks: [{ label: 'Impressum', href: '/impressum' }, { label: 'Datenschutz', href: '/datenschutz' }],
    cta: { label: 'Termin anfragen', href: '/kontakt' },
  });
  await api('PUT', '/api/v1/content/opening-hours', { hours: [{ type: 'regular', day: 'Montag-Freitag', hours: '10:00-18:00' }, { type: 'regular', day: 'Shootings', hours: 'nach Vereinbarung' }, { type: 'regular', day: 'Hochzeiten', hours: 'deutschlandweit' }] });
  await api('PUT', '/api/v1/content/form-fields', { fields: [{ name: 'name', label: 'Name', type: 'text', required: true, halfWidth: true }, { name: 'email', label: 'E-Mail', type: 'email', required: true, halfWidth: true }, { name: 'topic', label: 'Anlass', type: 'select', options: ['Hochzeit', 'Paarshooting', 'Portrait', 'Business', 'Familie', 'Sonstiges'], halfWidth: true }, { name: 'date', label: 'Datum / Zeitraum', type: 'text', halfWidth: true }, { name: 'message', label: 'Was soll fotografiert werden?', type: 'textarea', required: true }] });
  await api('PUT', '/api/v1/content/social-links', { instagram: 'https://instagram.com/lisamorgenthaler.fotografie', facebook: '', google: 'https://maps.google.com' });
  await api('PUT', '/api/v1/content/seo', { titleTemplate: '%s · Lisa Morgenthaler Fotografie', defaultTitle: 'Lisa Morgenthaler Fotografie · Hochzeiten, Portraits und Reportagen', defaultDescription: 'Fotografin in Frankfurt für Hochzeiten, Paarshootings, Portraits, Business-Bilder und Familienreportagen mit ruhigem Blick.', defaultOgImage: img.hero, canonicalBase: 'https://flamingo-renderer.vercel.app/demo/photography', locale: 'de_DE' });

  for (const page of pages) await upsertPage(page, existingPages);
  await replaceCollectionItems('leistungen', 'Leistungen', services, serviceItemSections, existingCollections);
  await replaceCollectionItems('reportagen', 'Reportagen', reportages, reportageItemSections, existingCollections);
  await replaceCollectionItems('referenzen', 'Reportagen', reportages, reportageItemSections, existingCollections);
  await replaceCollectionItems('news', 'Journal', newsItems, newsItemSections, existingCollections);

  const pagesAfter = await api('GET', '/api/v1/content/pages');
  const meta = {
    '': ['Lisa Morgenthaler Fotografie', 'Fotografin in Frankfurt für Hochzeiten, Portraits, Business-Bilder und Familienreportagen mit ruhigem Blick.'],
    portfolio: ['Portfolio', 'Ausgewählte Hochzeiten, Paarshootings, Portraits, Business-Bilder und Familienreportagen von Lisa Morgenthaler.'],
    leistungen: ['Leistungen', 'Fotografie-Leistungen für Hochzeiten, Portraits, Paare, Familien und Business in Frankfurt und Rhein-Main.'],
    referenzen: ['Reportagen', 'Ausgewählte Fotoreportagen aus Hochzeit, Paarshooting, Business und Familie.'],
    'ueber-uns': ['Über Lisa Morgenthaler', 'Arbeitsweise, Haltung und Erfahrung von Lisa Morgenthaler Fotografie in Frankfurt.'],
    news: ['Journal', 'Praktische Notizen zu Fotografie, Hochzeiten, Portraits, Licht, Vorbereitung und Bildauswahl.'],
    kontakt: ['Kontakt', 'Anfrage an Lisa Morgenthaler Fotografie für Hochzeit, Portrait, Business oder Familienreportage.'],
  };
  for (const page of pagesAfter.pages || []) {
    if (!meta[page.slug]) continue;
    await api('PUT', `/api/v1/content/seo/${page.id}`, { metaTitle: `${meta[page.slug][0]} · Lisa Morgenthaler Fotografie`, metaDescription: meta[page.slug][1], ogImage: img.hero, noindex: false });
  }

  const publishResult = await api('POST', '/api/v1/content/publish', {});
  console.log(JSON.stringify({ ok: true, publishResult }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
