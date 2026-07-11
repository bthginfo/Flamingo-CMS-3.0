const token = process.env.FLM_LOCATION_TOKEN;
if (!token) throw new Error('FLM_LOCATION_TOKEN is required');
const baseUrl = 'https://flamingo-renderer.vercel.app';

async function api(method, path, body) {
  const res = await fetch(`${baseUrl}${path}`, {
    method,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json; charset=utf-8' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${path} failed: ${res.status} ${res.statusText}\n${text}`);
  return text ? JSON.parse(text) : null;
}

const id = () => crypto.randomUUID();
const section = (type, dataWithAnchor, styleOverrides = {}) => {
  const { anchorId, ...data } = dataWithAnchor;
  return { id: id(), type, ...(anchorId ? { anchorId } : {}), data, styleOverrides };
};

const img = {
  hero: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=2200&q=85',
  loft: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1800&q=85',
  ballroom: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1800&q=85',
  garden: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1800&q=85',
  rooftop: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1800&q=85',
  studio: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1800&q=85',
  coworking: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1800&q=85',
  wedding: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1800&q=85',
  workshop: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1800&q=85',
  conference: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1800&q=85',
  dinner: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1800&q=85',
  setupTable: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1800&q=85',
  detail: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1400&q=85',
  team1: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1200&q=85',
  team2: 'https://images.unsplash.com/photo-1576558656222-ba66febe3dec?w=1200&q=85',
  team3: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=1200&q=85',
  mood1: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1400&q=85',
  mood2: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=1400&q=85',
  mood3: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=1400&q=85',
  mood4: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1400&q=85',
};

const colors = {
  ink: '#1A130A',
  soft: '#5A4630',
  muted: '#725E42',
  cream: '#FBF7F0',
  warm: '#F0E2CB',
  card: '#FFFCF6',
  border: '#E5D5B8',
  amber: '#B45309',
  amberDeep: '#451A03',
  gold: '#F59E0B',
  onDark: '#FBF7F0',
  onDarkSoft: '#E5D5B8',
  darkCard: '#57301B',
};

const light = { sectionBg: colors.cream, cardBg: colors.card, cardBorder: colors.border, cardHeadingColor: colors.ink, cardBodyColor: colors.soft, cardMutedColor: colors.muted, heading: colors.ink, body: colors.soft, muted: colors.muted, icon: colors.amber, accentColor: colors.amber, btnBg: colors.amberDeep, btnText: colors.onDark, badgeBg: colors.warm, badgeText: colors.amberDeep, borderColor: colors.border };
const alt = { ...light, sectionBg: colors.warm, cardBg: colors.cream, cardHeadingColor: colors.ink, cardBodyColor: colors.soft, cardMutedColor: colors.muted };
const dark = { sectionBg: colors.amberDeep, cardBg: colors.darkCard, cardBorder: 'rgba(251,247,240,0.24)', cardHeadingColor: colors.onDark, cardBodyColor: colors.onDarkSoft, cardMutedColor: '#C9B89A', heading: colors.onDark, body: colors.onDarkSoft, muted: '#C9B89A', icon: colors.gold, accentColor: colors.gold, btnBg: colors.gold, btnText: colors.amberDeep, badgeBg: 'rgba(245,158,11,0.20)', badgeText: colors.gold, borderColor: 'rgba(251,247,240,0.22)', onDarkHeading: colors.onDark, onDarkBody: colors.onDarkSoft, onDarkMuted: '#C9B89A' };
const heroStyle = { ...dark, heroHeading: colors.onDark, heroBody: colors.onDarkSoft, badgeBg: 'rgba(245,158,11,0.22)', badgeText: colors.gold, btnBg: colors.gold, btnText: colors.amberDeep };

const phone = '+49 841 8899 4411';
const email = 'events@lichtwerk-loft.de';
const address = 'Am Speicher 12, 85049 Ingolstadt';
const mapsEmbed = 'https://www.google.com/maps?q=Am%20Speicher%2012%2C%2085049%20Ingolstadt&output=embed';

const navItems = [
  { label: 'Startseite', href: '/', type: 'link' },
  { label: 'Räume', href: '/raeume', type: 'link' },
  { label: 'Events', href: '/events', type: 'link' },
  { label: 'Hochzeiten', href: '/hochzeiten', type: 'link' },
  { label: 'Coworking', href: '/coworking', type: 'link' },
  { label: 'Galerie', href: '/galerie', type: 'link' },
  { label: 'Kontakt', href: '/kontakt', type: 'link' },
];

const spaces = [
  { title: 'Loft Hauptraum', slug: 'loft-hauptraum', excerpt: 'Industrieller Hauptraum mit Stahlträgern, 6,5 m Decke und Lichtdecke.', image: img.loft, capacityLabel: 'bis 180 Personen', priceLabel: 'ab 1.890 € / Tag', category: 'Hauptraum' },
  { title: 'Bibliothek', slug: 'bibliothek', excerpt: 'Ruhiger Raum mit Buchwand, ideal für Trauungen und intime Dinner.', image: img.ballroom, capacityLabel: 'bis 40 Personen', priceLabel: 'ab 690 € / Tag', category: 'Trauung' },
  { title: 'Dachterrasse', slug: 'dachterrasse', excerpt: 'Großzügige Terrasse mit Stadtblick und Bar.', image: img.rooftop, capacityLabel: 'bis 80 Personen', priceLabel: 'ab 1.190 € / Tag', category: 'Aperitif' },
  { title: 'Workshop-Studio', slug: 'workshop-studio', excerpt: 'Lichtdurchflutetes Studio für Workshops, Shootings und kleine Tagungen.', image: img.studio, capacityLabel: 'bis 25 Personen', priceLabel: 'ab 490 € / Tag', category: 'Studio' },
  { title: 'Coworking Space', slug: 'coworking-space', excerpt: 'Geteilter Arbeitsraum mit 16 Plätzen und Telefonkabinen.', image: img.coworking, capacityLabel: '16 Plätze', priceLabel: 'ab 18 € / Tag', category: 'Coworking' },
  { title: 'Innenhof Garten', slug: 'innenhof-garten', excerpt: 'Begrünter Innenhof für Sommertrauungen und Apéros.', image: img.garden, capacityLabel: 'bis 60 Personen', priceLabel: 'ab 690 € / Tag', category: 'Outdoor' },
];

const newsItems = [
  { title: '8 Lektionen aus 200 Hochzeiten in unserem Loft', slug: 'lektionen-hochzeiten', excerpt: 'Was wir bei der Planung gelernt haben.', image: img.wedding, content: '<p>Wir haben über 200 Hochzeiten begleitet. Hier eine Sammlung Beobachtungen, die fast immer wahr sind: Timing wird unterschätzt, Wetter wird überschätzt, der Wechsel zwischen Trauung und Empfang braucht Puffer, und Live-Musik klingt im Loft besser als jede Box.</p><p>Diese Liste teilen wir mit jedem Brautpaar — damit Erwartung und Realität näher beieinander liegen.</p>' },
  { title: 'Warum unsere Sperrstunde 02:00 ist', slug: 'sperrstunde-02-uhr', excerpt: 'Wie wir die Sperrstunde mit der Nachbarschaft abgestimmt haben.', image: img.dinner, content: '<p>Sperrstunde ist immer eine Verhandlung — mit Behörden, Nachbarn und der Realität einer guten Party.</p><p>Bei uns gilt: Bis 02:00 läuft Musik in regulärer Lautstärke, danach wird abgebaut. Das ist mit der Stadt Ingolstadt geklärt und schützt uns alle vor Beschwerden.</p>' },
  { title: 'Coworking am Speicher: Was uns überrascht hat', slug: 'coworking-erfahrungen', excerpt: 'Sechs Monate Coworking — eine ehrliche Bilanz.', image: img.coworking, content: '<p>Wir hatten erwartet, dass Coworking primär für Freelancer interessant wird. Tatsächlich kommen die meisten Buchungen von Firmen, die kleine Strategie-Tage abhalten möchten.</p><p>Daraus haben wir gelernt: Coworking ist nicht nur ein Tisch, sondern ein Setup-Versprechen. Whiteboard, Beamer, Telefonkabine — das macht den Unterschied.</p>' },
];

function hero(headline, subline, image, extra = {}) {
  return section('locationHero', {
    eyebrow: extra.eyebrow || 'Lichtwerk Loft',
    headline, subline, image,
    overlay: 'rgba(26,19,10,0.62)',
    imageEffect: 'kenBurns',
    imageEffectIntensity: 'subtle',
    primaryCta: extra.primaryCta || { label: 'Verfügbarkeit prüfen', href: '/kontakt' },
    secondaryCta: extra.secondaryCta || { label: 'Räume ansehen', href: '/raeume' },
    facts: extra.facts || [
      { value: '6 Räume', label: 'für jeden Anlass' },
      { value: 'bis 180 Personen', label: 'flexible Kapazität' },
      { value: 'Catering frei', label: 'eigene Partner möglich' },
    ],
  }, heroStyle);
}

function spaceShowcase() {
  return section('spaceShowcase', {
    headline: 'Sechs Räume, ein Konzept.',
    subline: 'Vom Loft für die große Feier bis zur Bibliothek für die intime Trauung.',
    columns: 3,
    items: spaces.map(s => ({ title: s.title, description: s.excerpt, image: s.image, price: s.priceLabel, badge: s.capacityLabel, href: `/c/raeume/${s.slug}` })),
  }, light);
}

function eventTypes() {
  return section('eventTypes', {
    headline: 'Was bei uns stattfindet.',
    subline: 'Sieben Anlässe — und gerne auch deiner.',
    items: [
      { title: 'Hochzeiten', image: img.wedding, href: '/hochzeiten' },
      { title: 'Tagungen & Workshops', image: img.workshop, href: '/events' },
      { title: 'Firmenfeiern', image: img.dinner, href: '/events' },
      { title: 'Geburtstage', image: img.rooftop, href: '/events' },
      { title: 'Konferenzen', image: img.conference, href: '/events' },
      { title: 'Shootings & Drehs', image: img.studio, href: '/events' },
      { title: 'Coworking', image: img.coworking, href: '/coworking' },
      { title: 'Private Dinner', image: img.dinner, href: '/events' },
    ],
  }, alt);
}

function locationPackages(headline) {
  return section('locationPackages', {
    anchorId: 'pakete',
    badge: 'Pakete',
    headline,
    subline: 'Für die meisten Anlässe passt eines unserer Pakete. Sonst kombinieren wir gemeinsam.',
    plans: [
      { name: 'Basic', price: 'ab 1.890 €', features: ['Loft Hauptraum', '8 Std. Mietzeit', 'Grundausstattung', 'Reinigung'], missing: ['Catering', 'Technik-Upgrade', 'Verlängerung'], ctaLabel: 'Basic anfragen', ctaHref: '/kontakt' },
      { name: 'Event', price: 'ab 2.890 €', features: ['Loft + Terrasse', '12 Std. Mietzeit', 'Komplette Technik', 'Bestuhlung & Tische', 'Eigenes Catering möglich', 'On-Site-Manager'], missing: ['Übernachtung'], ctaLabel: 'Event anfragen', ctaHref: '/kontakt', highlighted: true, note: 'Beliebtestes Paket' },
      { name: 'Wedding', price: 'ab 4.490 €', features: ['Alle Räume', 'ganztägig', 'Komplette Technik', 'Bestuhlung & Tische', 'Bar-Setup', 'On-Site-Manager', 'Tag-vor-Probe', 'Übernachtung für 2'], missing: [], ctaLabel: 'Wedding anfragen', ctaHref: '/kontakt' },
    ],
  }, light);
}

function amenitiesGrid() {
  return section('amenitiesGrid', {
    badge: 'Ausstattung',
    headline: 'Was inklusive ist.',
    subline: 'Premium-Setup, das du nicht extra mieten musst.',
    cards: [
      { title: 'Lichtdecke', description: 'Komplette LED-Lichtdecke, in Farbe und Helligkeit dimmbar.', icon: 'Sun', image: img.loft, size: 'large' },
      { title: 'Sound-System', description: 'L-Acoustics Boxen, DJ-Pult, Funkmikros für Reden und Trauungen.', icon: 'Music', image: img.ballroom },
      { title: 'Bestuhlung', description: '180 Stühle, 24 Rundtische, Stehtische — alles im Haus.', icon: 'Users', image: img.setupTable },
      { title: 'Profi-Küche', description: 'Voll ausgestattete Cateringküche mit Spülmaschine und Kühlung.', icon: 'ChefHat' },
      { title: 'Bar-Setup', description: 'Theke, Gläser für 200 Gäste, Eiswürfelmaschine.', icon: 'GlassWater' },
      { title: 'Beamer & Leinwand', description: '4K-Beamer, 4m-Leinwand, HDMI-Anschluss am Pult.', icon: 'Projector' },
      { title: 'Parkplätze', description: '40 Stellplätze direkt am Speicher.', icon: 'Car' },
      { title: 'WLAN', description: 'Glasfaser-Anbindung, eigenes Event-Netz.', icon: 'Wifi' },
    ],
  }, alt);
}

function floorPlanOverview() {
  return section('floorPlanOverview', {
    badgeText: 'Grundriss',
    headline: 'Verschiedene Setups, ein Raum.',
    subline: 'Loft Hauptraum lässt sich für Bankett, Empfang oder Konferenz unterschiedlich aufbauen.',
    text: '<p>Unser Hauptraum bietet 380 m² Fläche, 6,5 m Deckenhöhe und drei Setup-Modi: Bankett (180 Personen an Rundtischen), Reihen (200 Personen für Trauungen / Vorträge) oder Empfang (300 Personen Stehkomfort).</p><p>Wir senden dir gerne Grundrisse als PDF — einfach kurz Bescheid geben.</p>',
    image: img.setupTable,
    primaryCta: { label: 'Grundrisse anfordern', href: '/kontakt' },
    secondaryCta: { label: 'Räume ansehen', href: '/raeume' },
  }, light);
}

function galleryMoodboard() {
  return section('galleryMoodboard', {
    headline: 'Stimmungen aus echten Events.',
    subline: 'Eine Auswahl aus den letzten Monaten.',
    images: [
      { src: img.mood1, alt: 'Tischsetup', category: 'Hochzeit' },
      { src: img.mood2, alt: 'Terrasse', category: 'Aperitif' },
      { src: img.mood3, alt: 'Detail', category: 'Detail' },
      { src: img.mood4, alt: 'Garten', category: 'Outdoor' },
      { src: img.dinner, alt: 'Dinner-Setup', category: 'Dinner' },
      { src: img.workshop, alt: 'Workshop-Atmosphäre', category: 'Workshop' },
      { src: img.studio, alt: 'Studio-Licht', category: 'Studio' },
      { src: img.conference, alt: 'Konferenz-Setup', category: 'Konferenz' },
    ],
  }, alt);
}

function availabilityCta() {
  return section('availabilityCta', {
    badge: 'Verfügbarkeit',
    headline: 'Datum frei? Schreib uns kurz.',
    subline: 'Wir antworten innerhalb von 24 Stunden mit konkretem Vorschlag und transparentem Preis.',
    image: img.loft,
    overlay: 'rgba(26,19,10,0.62)',
    metrics: [{ value: '24 h', label: 'Antwortzeit' }, { value: '200+', label: 'Events pro Jahr' }, { value: '4,9/5', label: 'Bewertungen' }],
    primaryCta: { label: 'Wunschtermin prüfen', href: '/kontakt', icon: 'Calendar' },
    secondaryCta: { label: 'Besichtigung vereinbaren', href: '/kontakt', icon: 'MapPin' },
  }, dark);
}

function hostTeam() {
  return section('hostTeam', {
    badgeText: 'Team',
    headline: 'Drei Ansprechpartner, ein Auftritt.',
    subline: 'Jedes Event hat ein festes Team — vom ersten Gespräch bis zum Abbau.',
    members: [
      { name: 'Clara', role: 'Event-Direktorin', bio: 'Clara plant Hochzeiten und größere Events. 10 Jahre Erfahrung in der Eventbranche.', image: img.team1 },
      { name: 'Daniel', role: 'Tagungen & Coworking', bio: 'Daniel ist Ansprechpartner für Tagungen, Workshops und Coworking-Tage.', image: img.team2 },
      { name: 'Sarah', role: 'Operations & On-Site', bio: 'Sarah ist am Eventtag vor Ort und sorgt dafür, dass alles läuft.', image: img.team3 },
    ],
  }, light);
}

function ctaBanner(headline, subline, primaryLabel = 'Eventtermin anfragen') {
  return section('immersiveCtaBanner', {
    badge: 'Wunschtermin sichern',
    headline, subline,
    image: img.rooftop,
    overlay: 'rgba(26,19,10,0.62)',
    metrics: [{ value: '200+', label: 'Events / Jahr' }, { value: '6 Räume', label: 'flexibel kombinierbar' }, { value: '24 h', label: 'Antwortzeit' }],
    primaryCta: { label: primaryLabel, href: '/kontakt', icon: 'Send' },
    secondaryCta: { label: 'Räume ansehen', href: '/raeume', icon: 'Grid' },
  }, dark);
}

const pages = [
  { slug: '', title: 'Startseite', sections: [
    hero('Räume, die aus Anlässen Erinnerungen machen.', 'Lichtwerk Loft ist eine Eventlocation in Ingolstadt für Hochzeiten, Tagungen, Coworking und private Feiern.', img.hero),
    section('uspStrip', { items: [
      { icon: 'Maximize', title: '380 m²', text: 'Loft + 6 Räume' },
      { icon: 'Users', title: 'bis 180 Pers.', text: 'flexibel teilbar' },
      { icon: 'ChefHat', title: 'Catering frei', text: 'eigener Partner möglich' },
      { icon: 'ParkingCircle', title: '40 Parkplätze', text: 'direkt am Haus' },
    ] }, light),
    spaceShowcase(),
    eventTypes(),
    amenitiesGrid(),
    locationPackages('Pakete für Feiern, Business und besondere Tage.'),
    section('testimonials', { headline: 'Was Veranstalter sagen.', items: [
      { quote: 'Sehr gute Vorab-Planung, Eventtag war komplett stressfrei.', author: 'Anna & Jan', meta: 'Hochzeit · 140 Gäste', rating: 5 },
      { quote: 'Perfekte Größe für unsere Strategietagung. Technik tadellos.', author: 'Markus L.', meta: 'Firmenkunde', rating: 5 },
      { quote: 'Die Dachterrasse zum Aperitif war ein Highlight für die Gäste.', author: 'Lisa M.', meta: 'Geburtstag · 60 Gäste', rating: 5 },
    ] }, alt),
    section('newsPreview', { headline: 'Lichtwerk Magazin', subline: 'Notizen aus unseren Events.', linkLabel: 'Alle Beiträge', linkIcon: 'ArrowRight', collectionKey: 'news' }, light),
    availabilityCta(),
  ] },
  { slug: 'raeume', title: 'Räume', sections: [
    section('editorialHero', { eyebrow: 'Räume', headline: 'Sechs Räume — kombinierbar und einzeln buchbar.', text: '<p>Vom Loft bis zur Bibliothek, von der Dachterrasse bis zum Coworking Space.</p>', imagePrimary: img.loft, primaryCta: { label: 'Besichtigung', href: '/kontakt' }, secondaryCta: { label: 'Galerie', href: '/galerie' } }),
    spaceShowcase(),
    floorPlanOverview(),
    amenitiesGrid(),
    section('collectionList', { headline: 'Alle Räume', subline: 'Details, Kapazität und Preise pro Raum.', collectionKey: 'raeume', ctaLabel: 'Raum ansehen' }, alt),
    ctaBanner('Welcher Raum passt zu dir?', 'Wir empfehlen den passenden Raum nach kurzem Gespräch.', 'Beratung anfragen'),
  ] },
  { slug: 'events', title: 'Events', sections: [
    hero('Eventarten, die wir besonders gerne planen.', 'Firmenfeier, Konferenz, Geburtstag, Workshop oder privates Dinner.', img.dinner, { eyebrow: 'Events', primaryCta: { label: 'Event anfragen', href: '/kontakt' }, secondaryCta: { label: 'Räume', href: '/raeume' } }),
    eventTypes(),
    section('processSteps', { badgeText: 'Ablauf', headline: 'So planen wir dein Event.', steps: [
      { title: '1. Anfrage', text: 'Du sendest Datum, Anlass, ungefähre Gästezahl.' },
      { title: '2. Vorschlag', text: 'Wir antworten in 24 Std. mit Raum-Vorschlag und transparentem Preis.' },
      { title: '3. Besichtigung', text: 'Vor-Ort-Termin mit Setup-Empfehlungen.' },
      { title: '4. Eventtag', text: 'Wir sind vor Ort, kümmern uns um alles Technische.' },
    ] }, light),
    locationPackages('Event-Pakete für planbare Budgets.'),
    section('faq', { headline: 'Häufige Fragen', items: [
      { q: 'Müssen wir euer Catering nehmen?', a: 'Nein. Wir empfehlen Partner, aber du kannst dein eigenes Catering mitbringen.' },
      { q: 'Wie lange können wir bleiben?', a: 'Standardmiete ist 8-12 Std. Verlängerung bis 02:00 möglich.' },
      { q: 'Gibt es Sperrstunde?', a: 'Ja, 02:00 Uhr. Danach läuft Musik leise / Abbau.' },
      { q: 'Was kostet Reinigung?', a: 'Grundreinigung ist immer inklusive. Sonderreinigung pauschal extra.' },
    ] }, alt),
  ] },
  { slug: 'hochzeiten', title: 'Hochzeiten', sections: [
    section('cinematicHero', { eyebrow: 'Hochzeit', headline: 'Eure Hochzeit im Lichtwerk Loft.', subline: 'Trauung im Garten, Empfang auf der Terrasse, Dinner & Tanz im Loft — alles an einem Ort.', image: img.wedding, overlay: 'rgba(24,18,12,0.55)', align: 'left', primaryCta: { label: 'Hochzeitstermin prüfen', href: '/kontakt' }, facts: [ { value: '120', label: 'Gäste im Loft' }, { value: '3', label: 'Bereiche kombinierbar' }, { value: '1', label: 'fester Ansprechpartner' } ] }),
    section('textImage', { badgeText: 'Komplettlösung', headline: 'Eine Location, alle Momente.', subline: 'Standesamt, Trauung, Empfang, Dinner und Party.', text: '<p>Wir bieten alles, was du für deine Hochzeit brauchst, an einem Ort. Standesamtliche und freie Trauungen in Garten oder Bibliothek, Empfang auf der Dachterrasse, Dinner & Tanz im Loft.</p><p>Du musst nicht zwischen Locations wechseln. Deine Gäste auch nicht. Das macht den Tag deutlich entspannter.</p>', image: img.wedding, primaryCta: { label: 'Wedding-Paket ansehen', href: '#pakete' } }, light),
    locationPackages('Hochzeitspakete vom Empfang bis zur Party.'),
    galleryMoodboard(),
    section('testimonials', { headline: 'Was Brautpaare sagen.', items: [
      { quote: 'Die Tag-vor-Probe war Gold wert. Eventtag war komplett ruhig.', author: 'Anna & Felix', meta: 'Mai 2025', rating: 5 },
      { quote: 'Trauung im Garten und Dinner im Loft — perfekter Übergang.', author: 'Lara & Tom', meta: 'August 2025', rating: 5 },
      { quote: 'Sarah als On-Site-Managerin hat einfach alles im Griff.', author: 'Marie & Jonas', meta: 'September 2024', rating: 5 },
    ] }, alt),
    ctaBanner('Verfügbarkeit prüfen?', 'Wir antworten innerhalb 24 Std. mit konkretem Vorschlag.', 'Hochzeitsanfrage'),
  ] },
  { slug: 'coworking', title: 'Coworking', sections: [
    section('editorialHero', { eyebrow: 'Coworking', headline: 'Coworking & Team-Tage.', text: '<p>Tagsüber Coworking-Plätze, abends Eventlocation — beides am selben Speicher.</p>', imagePrimary: img.coworking, primaryCta: { label: 'Tagesticket sichern', href: '/kontakt' }, secondaryCta: { label: 'Team-Tag planen', href: '#team' } }),
    section('servicesGrid', { anchorId: 'team', headline: 'Was du bekommst', manualCards: [
      { icon: 'Briefcase', title: '16 Plätze', text: 'Schreibtische mit Bürostuhl, höhenverstellbar.' },
      { icon: 'Wifi', title: 'Glasfaser', text: 'Eigenes Netz, redundante Anbindung.' },
      { icon: 'Phone', title: 'Telefonkabinen', text: '3 schalldichte Kabinen für Calls.' },
      { icon: 'Coffee', title: 'Kaffee & Tee', text: 'Inklusive, Siebträger-Maschine.' },
      { icon: 'Users', title: 'Teamraum', text: 'Whiteboard, Beamer, 12 Plätze.' },
      { icon: 'Calendar', title: 'Flex-Tarif', text: 'Tageweise, monatlich oder Team-Plan.' },
    ] }, light),
    section('comparisonCardsPro', { badge: 'Tarife', headline: 'Drei Coworking-Tarife.', subline: 'Tageweise, monatlich oder als Team-Plan.', plans: [
      { name: 'Day Pass', price: '18 € / Tag', features: ['1 Schreibtisch', 'Kaffee & Tee', 'WLAN', 'Telefonkabinen'], missing: ['Teamraum'], ctaLabel: 'Tag buchen', ctaHref: '/kontakt' },
      { name: 'Flex', price: '189 € / Monat', features: ['Flexibler Platz', 'Schließfach', 'Postadresse', 'Teamraum 4h / Monat'], missing: [], ctaLabel: 'Flex starten', ctaHref: '/kontakt', highlighted: true },
      { name: 'Team', price: 'ab 690 € / Monat', features: ['4 feste Plätze', 'Eigenes Schließfach', 'Teamraum unbegrenzt', 'Eigene Postadresse'], missing: [], ctaLabel: 'Team anfragen', ctaHref: '/kontakt' },
    ] }, alt),
    section('immersiveCtaBanner', { badge: 'Team-Tag', headline: 'Strategietag fürs Team?', subline: 'Wir öffnen den Teamraum als Tagungseinheit — inkl. Tech, Pausen und optional Catering.', image: img.workshop, overlay: 'rgba(26,19,10,0.6)', metrics: [{ value: 'bis 12', label: 'Personen' }, { value: '8 Std.', label: 'Tagung' }, { value: 'Lunch optional', label: 'Catering' }], primaryCta: { label: 'Team-Tag anfragen', href: '/kontakt' } }, dark),
  ] },
  { slug: 'galerie', title: 'Galerie', sections: [
    hero('Eindrücke aus echten Events.', 'Eine kuratierte Auswahl aus den letzten Monaten.', img.mood1, { eyebrow: 'Galerie', primaryCta: { label: 'Besichtigung vereinbaren', href: '/kontakt' }, secondaryCta: { label: 'Räume', href: '/raeume' } }),
    galleryMoodboard(),
    ctaBanner('Möchtest du den Raum live sehen?', 'Wir machen gerne eine Besichtigung — auch am Abend oder Wochenende.', 'Besichtigung anfragen'),
  ] },
  { slug: 'ueber-uns', title: 'Über uns', sections: [
    section('editorialHero', { eyebrow: 'Story', headline: 'Lichtwerk Loft — aus dem Speicher 12 in Ingolstadt.', text: '<p>Wir haben den Speicher 2019 übernommen und 2021 als Eventlocation eröffnet.</p>', imagePrimary: img.loft, imageSecondary: img.mood1, primaryCta: { label: 'Besichtigung anfragen', href: '/kontakt' } }),
    section('textImage', { badgeText: 'Story', headline: 'Aus Industriegeschichte wird Event-Bühne.', subline: 'Der Speicher 12 hat eine 120-jährige Geschichte.', text: '<p>Der Speicher wurde 1903 erbaut und war bis in die 80er als Lager für Getreide in Betrieb. 2019 haben wir ihn übernommen und in zwei Jahren behutsam in eine Eventlocation umgebaut.</p><p>Stahlträger, Backstein und Holz sind erhalten geblieben. Hinzugekommen: moderne Lichttechnik, Catering-Küche, Bar-Setup und Dachterrasse.</p>', image: img.loft, primaryCta: { label: 'Räume entdecken', href: '/raeume' } }, light),
    hostTeam(),
    section('stats', { items: [{ value: '2021', label: 'Eröffnung' }, { value: '200+', label: 'Events / Jahr' }, { value: '6', label: 'Räume' }, { value: '4,9/5', label: 'Bewertung' }] }, alt),
  ] },
  { slug: 'kontakt', title: 'Kontakt', sections: [
    section('editorialHero', { eyebrow: 'Kontakt', headline: 'Schreib uns — wir antworten persönlich.', text: '<p>Per Formular, WhatsApp oder Telefon. Innerhalb 24 Std. mit konkretem Vorschlag.</p>', imagePrimary: img.ballroom, primaryCta: { label: 'Formular nutzen', href: '#form' }, secondaryCta: { label: 'Anrufen', href: `tel:${phone.replace(/\s/g, '')}` } }),
    section('contact', { anchorId: 'form', badgeText: 'Anfrage', headline: 'Verfügbarkeit prüfen.', subline: 'Datum, Anlass und ungefähre Gästezahl — mehr brauchen wir für den ersten Vorschlag nicht.', namePlaceholder: 'Name', emailPlaceholder: 'E-Mail', phonePlaceholder: 'Telefon (optional)', messagePlaceholder: 'Datum, Anlass, Gästezahl', submitLabel: 'Verfügbarkeit anfragen', infoCards: [{ icon: 'Phone', label: 'Telefon', value: phone }, { icon: 'Mail', label: 'E-Mail', value: email }, { icon: 'MapPin', label: 'Adresse', value: address }] }, light),
    section('locationAccess', { headline: 'Anfahrt & Umgebung', subline: 'Direkt am Donauufer, 5 Min. von der A9.', mapEmbedUrl: mapsEmbed, infoCards: [{ icon: 'Car', label: 'Auto', value: '40 Stellplätze direkt am Haus' }, { icon: 'Train', label: 'Bahn', value: 'Hbf Ingolstadt + 12 Min. Taxi' }, { icon: 'Plane', label: 'Flughafen', value: 'München Airport · 70 km' }] }, alt),
    section('openingHours', { headline: 'Bürozeiten', days: [{ label: 'Mo - Fr', hours: '09:00-18:00', note: 'für Anfragen & Beratung' }, { label: 'Events', hours: 'nach Vereinbarung' }] }, light),
  ] },
  { slug: 'news', title: 'Lichtwerk Magazin', sections: [
    hero('Notizen aus dem Speicher.', 'Beobachtungen, Lektionen und Geschichten aus unseren Events.', img.loft, { eyebrow: 'Magazin', primaryCta: { label: 'Alle Beiträge', href: '#beitraege' }, secondaryCta: { label: 'Kontakt', href: '/kontakt' } }),
    section('newsGrid', { anchorId: 'beitraege', headline: 'Aktuelle Beiträge', subline: 'Aus 200+ Events pro Jahr.', collectionKey: 'news' }, light),
    ctaBanner('Plant ihr ein eigenes Event?', 'Wir freuen uns auf eure Anfrage.', 'Eventidee besprechen'),
  ] },
  { slug: 'impressum', title: 'Impressum', sections: [section('legalContent', { headline: 'Impressum', blocks: [{ title: 'Angaben gemäß § 5 TMG', content: 'Lichtwerk Loft GmbH, Am Speicher 12, 85049 Ingolstadt' }, { title: 'Kontakt', content: `${phone} · ${email}` }, { title: 'Geschäftsführung', content: 'Clara Holzmann, Daniel Wagner' }, { title: 'Hinweis', content: 'Dies ist ein Demo-Tenant von Flamingo Media.' }] }, light)] },
  { slug: 'datenschutz', title: 'Datenschutz', sections: [section('legalContent', { headline: 'Datenschutzerklärung', blocks: [{ title: 'Verantwortlicher', content: 'Lichtwerk Loft GmbH, Am Speicher 12, 85049 Ingolstadt' }, { title: 'Kontaktformular', content: 'Formulardaten dienen ausschließlich der Bearbeitung deiner Anfrage.' }, { title: 'Hosting', content: 'Diese Demo läuft technisch auf Flamingo Media.' }, { title: 'Rechte', content: 'Du kannst Auskunft, Berichtigung oder Löschung verlangen.' }] }, light)] },
];

const PAGE_SEO = {
  '': { metaTitle: 'Eventlocation für Hochzeiten und Tagungen in Ingolstadt', metaDescription: 'Lichtwerk Loft ist eine wandelbare Eventlocation in Ingolstadt für Hochzeiten, Firmenevents, Tagungen und private Feiern.' },
  raeume: { metaTitle: 'Räume und Kapazitäten im Lichtwerk Loft', metaDescription: 'Loft, Bibliothek, Dachterrasse, Workshop-Studio und Innenhof mit Kapazitäten und Ausstattung für Events in Ingolstadt.' },
  events: { metaTitle: 'Firmenevents und private Feiern in Ingolstadt', metaDescription: 'Eventformate, Pakete, Technik und Planung für Firmenfeiern, Tagungen und private Anlässe im Lichtwerk Loft.' },
  hochzeiten: { metaTitle: 'Hochzeitslocation in Ingolstadt', metaDescription: 'Trauung, Empfang, Dinner und Party an einem Ort: Hochzeiten im Lichtwerk Loft mit Garten, Terrasse und festem Ansprechpartner.' },
  coworking: { metaTitle: 'Coworking und Team-Tage in Ingolstadt', metaDescription: 'Flexible Coworking-Plätze, Teamraum und komplette Team-Tage mit Technik und optionalem Catering im Lichtwerk Loft.' },
  galerie: { metaTitle: 'Galerie des Lichtwerk Loft', metaDescription: 'Kuratierte Eindrücke von Hochzeiten, Dinnern, Workshops und Firmenevents im Lichtwerk Loft in Ingolstadt.' },
  'ueber-uns': { metaTitle: 'Über das Lichtwerk Loft Ingolstadt', metaDescription: 'Geschichte, Team und Haltung der Eventlocation Lichtwerk Loft im ehemaligen Speicher 12 in Ingolstadt.' },
  kontakt: { metaTitle: 'Verfügbarkeit im Lichtwerk Loft anfragen', metaDescription: 'Kontakt, Anfahrt und Anfrageformular für Besichtigungen und Veranstaltungen im Lichtwerk Loft Ingolstadt.' },
  news: { metaTitle: 'Lichtwerk Magazin für bessere Events', metaDescription: 'Erfahrungen, Planungstipps und Geschichten aus Hochzeiten, Tagungen und mehr als 200 Veranstaltungen im Lichtwerk Loft.' },
  impressum: { metaTitle: 'Impressum | Lichtwerk Loft', metaDescription: 'Impressum und Anbieterinformationen der Lichtwerk Loft GmbH in Ingolstadt.' },
  datenschutz: { metaTitle: 'Datenschutz | Lichtwerk Loft', metaDescription: 'Datenschutzhinweise des Lichtwerk Loft zu Eventanfragen und technischer Bereitstellung.' },
};

for (const page of pages) page.seo = PAGE_SEO[page.slug];

function detailHero(item, badgeText) {
  return section('collectionHero', { headline: item.title, subline: item.excerpt, badgeText, backgroundImage: item.image, bgImage: item.image, overlayColor: '#1A130A', overlayOpacity: 0.6, imageEffect: 'kenBurns', imageEffectIntensity: 'subtle' }, heroStyle);
}

function prefixDemoLinks(value) {
  if (Array.isArray(value)) return value.map(prefixDemoLinks);
  if (!value || typeof value !== 'object') return value;
  const copy = { ...value };
  for (const [key, child] of Object.entries(copy)) {
    if (key === 'href' && typeof child === 'string' && child.startsWith('/') && !child.startsWith('/demo/location') && !child.startsWith('http') && !child.startsWith('tel:') && !child.startsWith('mailto:')) {
      copy[key] = `/demo/location${child === '/' ? '' : child}`;
    } else copy[key] = prefixDemoLinks(child);
  }
  return copy;
}

function spaceSections(item) {
  return prefixDemoLinks([
    detailHero(item, item.category),
    section('textImage', { headline: item.title, subline: item.excerpt, text: `<p>${item.excerpt}</p><p>Kapazität: ${item.capacityLabel}. Preis: ${item.priceLabel}. Lichttechnik, Sound und Bestuhlung im Preis enthalten.</p>`, image: item.image, primaryCta: { label: 'Raum anfragen', href: '/kontakt' }, secondaryCta: { label: 'Besichtigung', href: '/kontakt' } }, light),
    section('uspStrip', { items: [
      { icon: 'Users', title: 'Kapazität', text: item.capacityLabel },
      { icon: 'Sun', title: 'Lichttechnik', text: 'voll dimmbar' },
      { icon: 'Music', title: 'Sound-System', text: 'L-Acoustics' },
    ] }, alt),
    section('immersiveCtaBanner', { badge: 'Raum sichern', headline: `${item.title} verfügbar?`, subline: 'Schreib uns dein Wunschdatum — Antwort innerhalb 24 Std.', image: item.image, overlay: 'rgba(26,19,10,0.6)', primaryCta: { label: 'Verfügbarkeit prüfen', href: '/kontakt', icon: 'Calendar' } }, dark),
  ]);
}

function newsSections(item) {
  return prefixDemoLinks([detailHero(item, 'Magazin'), section('freeText', { content: item.content }, light)]);
}

async function upsertPage(page, existingPages) {
  const existing = existingPages.find((p) => p.slug === page.slug);
  const payload = { slug: page.slug, title: page.title, sections: page.sections, visible: true, status: 'published' };
  const result = existing
    ? await api('PUT', `/api/v1/content/pages/${existing.id}`, payload)
    : await api('POST', '/api/v1/content/pages', payload);
  const pageId = existing?.id || result?.id || result?.pageId || result?.page?.id;
  if (page.seo && pageId) await api('PUT', `/api/v1/content/seo/${pageId}`, page.seo);
  return result;
}

async function ensureCollection(key, label, existingCollections) {
  const found = existingCollections.find((c) => c.key === key);
  if (found) return found;
  return api('POST', '/api/v1/content/collections', { key, label });
}

async function replaceCollectionItems(key, label, items, makeSections, collections) {
  const collection = await ensureCollection(key, label, collections);
  for (const item of collection.items || []) await api('DELETE', `/api/v1/content/collections/${key}/items/${item.id}`);
  for (const [index, item] of items.entries()) {
    await api('POST', `/api/v1/content/collections/${key}/items`, {
      title: item.title, slug: item.slug, excerpt: item.excerpt, published: true, priority: index,
      data: { image: item.image, author: 'Lichtwerk Loft', date: '2026-03-18', sections: makeSections(item) },
    });
  }
}

async function main() {
  const pagesBefore = await api('GET', '/api/v1/content/pages');
  const collectionsBefore = await api('GET', '/api/v1/content/collections');
  const existingPages = pagesBefore.pages || [];

  await api('PUT', '/api/v1/content/style', { style: 'classic' });
  await api('PUT', '/api/v1/content/brand', { companyName: 'Lichtwerk Loft', tagline: 'Eventlocation, Hochzeiten & Coworking', primaryColor: colors.amber, secondaryColor: colors.amberDeep, accentColor: colors.gold, logoDisplay: 'name', headingFont: 'Playfair Display', bodyFont: 'Inter', topBarColor: colors.amberDeep, footerColor: colors.amberDeep });
  await api('PUT', '/api/v1/content/design', { textPrimary: colors.ink, textSecondary: colors.soft, sectionBg: colors.cream, sectionBgAlt: colors.warm, cardBg: colors.card, cardBorder: colors.border, badgeBg: colors.warm, badgeText: colors.amberDeep, brand: colors.amberDeep, accent: colors.amber, heading: colors.ink, body: colors.soft, muted: colors.muted, icon: colors.amber, btnBg: colors.amberDeep, btnText: colors.onDark, eyebrow: colors.amber, statValue: colors.amberDeep, quote: colors.ink, ratingStar: colors.gold, check: colors.amber, onDarkHeading: colors.onDark, onDarkBody: colors.onDarkSoft, onDarkMuted: '#C9B89A' });
  await api('PUT', '/api/v1/content/contact', { phone, email, address, whatsappEnabled: false });
  await api('PUT', '/api/v1/content/seo', {
    titleTemplate: '%s | Lichtwerk Loft Ingolstadt',
    defaultTitle: 'Lichtwerk Loft – Eventlocation in Ingolstadt',
    defaultDescription: 'Eventlocation in Ingolstadt für Hochzeiten, Tagungen, Coworking und private Feiern – mit flexiblen Räumen und persönlicher Planung.',
    defaultOgImage: img.hero,
    locale: 'de_DE',
  });
  await api('PUT', '/api/v1/content/navigation', { items: navItems, cta: { label: 'Verfügbarkeit prüfen', href: '/kontakt' } });
  await api('PUT', '/api/v1/content/footer', { columns: [
    { title: 'Location', items: [{ text: 'Räume', href: '/raeume' }, { text: 'Events', href: '/events' }, { text: 'Hochzeiten', href: '/hochzeiten' }, { text: 'Coworking', href: '/coworking' }] },
    { title: 'Lichtwerk', items: [{ text: 'Über uns', href: '/ueber-uns' }, { text: 'Galerie', href: '/galerie' }, { text: 'Magazin', href: '/news' }] },
    { title: 'Kontakt', items: [{ text: phone }, { text: email }, { text: address }] },
  ], legalLinks: [{ label: 'Impressum', href: '/impressum' }, { label: 'Datenschutz', href: '/datenschutz' }], cta: { label: 'Verfügbarkeit prüfen', href: '/kontakt' } });
  await api('PUT', '/api/v1/content/opening-hours', { hours: [
    { type: 'regular', day: 'Mo - Fr', hours: '09:00-18:00', note: 'für Anfragen & Besichtigungen' },
    { type: 'regular', day: 'Events', hours: 'nach Vereinbarung' },
  ] });

  for (const page of pages) {
    await upsertPage(page, existingPages);
    console.log('Page:', page.slug || '(home)');
  }

  await replaceCollectionItems('raeume', 'Räume', spaces, spaceSections, collectionsBefore.collections || []);
  await replaceCollectionItems('news', 'Lichtwerk Magazin', newsItems, newsSections, collectionsBefore.collections || []);

  await api('POST', '/api/v1/content/publish', {});
  console.log('Done. Published.');
}

main().catch((err) => { console.error(err); process.exit(1); });
