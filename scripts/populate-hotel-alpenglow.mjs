const token = process.env.FLM_HOTEL_TOKEN || 'flm_pat_1521c5d84ea52527aa60b2f9bd2c2ccbca0b6c30c6f20e7555d98dc3c7a15eb4';
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
const section = (type, data, styleOverrides = {}) => ({ id: uid(), type, data, styleOverrides });

const img = {
  hero: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=2200&q=85',
  lobby: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1800&q=85',
  suite: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1800&q=85',
  room: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1600&q=85',
  chalet: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=85',
  family: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1600&q=85',
  spa: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1800&q=85',
  pool: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1800&q=85',
  massage: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=1600&q=85',
  dining: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1800&q=85',
  breakfast: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=1600&q=85',
  bar: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1600&q=85',
  event: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1800&q=85',
  meeting: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1600&q=85',
  terrace: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=85',
  forest: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1800&q=85',
};

const colors = {
  ink: '#17211B',
  soft: '#5E6B60',
  muted: '#7B846F',
  linen: '#F7F3EA',
  linenAlt: '#ECE6D8',
  card: '#FFFDF8',
  border: '#D8CEBC',
  forest: '#21372D',
  forestDeep: '#101D18',
  sage: '#6F8A76',
  moss: '#405F49',
  gold: '#C89B4A',
  goldLight: '#E8C878',
  onDark: '#FFF8EA',
  onDarkSoft: '#E7DCC8',
};

const light = {
  sectionBg: colors.linen,
  cardBg: colors.card,
  cardBorder: colors.border,
  heading: colors.ink,
  subheading: colors.soft,
  body: colors.soft,
  muted: colors.muted,
  icon: colors.forest,
  accentColor: colors.gold,
  btnBg: colors.forest,
  btnText: colors.onDark,
  badgeBg: '#F1E4C9',
  badgeText: colors.forest,
  badgeBorder: colors.border,
  borderColor: colors.border,
};

const alt = {
  ...light,
  sectionBg: colors.linenAlt,
  cardBg: '#FFFCF4',
};

const dark = {
  sectionBg: colors.forestDeep,
  cardBg: 'rgba(255,248,234,0.09)',
  cardBorder: 'rgba(255,248,234,0.22)',
  heading: colors.onDark,
  subheading: colors.onDarkSoft,
  body: colors.onDarkSoft,
  muted: '#D2C4AD',
  icon: colors.goldLight,
  accentColor: colors.goldLight,
  btnBg: colors.goldLight,
  btnText: colors.forestDeep,
  badgeBg: 'rgba(255,248,234,0.12)',
  badgeText: colors.onDark,
  badgeBorder: 'rgba(255,248,234,0.24)',
  borderColor: 'rgba(255,248,234,0.22)',
  onDarkHeading: colors.onDark,
  onDarkBody: colors.onDarkSoft,
  onDarkMuted: '#D2C4AD',
};

const heroStyle = {
  heroHeading: colors.onDark,
  heroBody: colors.onDarkSoft,
  badgeBg: 'rgba(255,248,234,0.14)',
  badgeText: colors.onDark,
  badgeBorder: 'rgba(255,248,234,0.28)',
  btnBg: colors.goldLight,
  btnText: colors.forestDeep,
  onDarkHeading: colors.onDark,
  onDarkBody: colors.onDarkSoft,
  onDarkMuted: '#D2C4AD',
};

const phone = '+43 5356 90880';
const email = 'anfrage@alpenglow-resort.at';
const address = 'Sonnbergweg 18, 6370 Kitzbühel, Österreich';
const mapsEmbed = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2668.0!2d12.3928!3d47.4464!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zU29ubmJlcmd3ZWcgMTgsIDYzNzAgS2l0emLDvGhlbA!5e0!3m2!1sde!2sat!4v1710000000000';

const navItems = [
  { label: 'Startseite', href: '/', type: 'link' },
  { label: 'Zimmer', href: '/zimmer', type: 'link' },
  { label: 'Spa', href: '/spa', type: 'link' },
  { label: 'Restaurant', href: '/restaurant', type: 'link' },
  { label: 'Angebote', href: '/angebote', type: 'link' },
  { label: 'Events', href: '/events', type: 'link' },
  { label: 'Kontakt', href: '/kontakt', type: 'link' },
];

const rooms = [
  {
    title: 'Garden Room',
    slug: 'garden-room',
    excerpt: 'Ruhiges Doppelzimmer mit Balkon, Naturtönen und Blick in den Garten.',
    name: 'Garden Room',
    description: 'Ein ruhiges Zimmer für zwei Personen: warme Stoffe, Balkon, Regendusche und genug Platz, um nach einem Tag in den Bergen wirklich anzukommen.',
    image: img.room,
    priceLabel: 'ab 189 € / Nacht',
    sizeLabel: '32 m²',
    occupancyLabel: '2 Gäste',
    bedLabel: 'King-Size Bett',
    features: ['Balkon zum Garten', 'Regendusche', 'Frühstück optional', 'Spa-Zugang inklusive'],
  },
  {
    title: 'Alpine Suite',
    slug: 'alpine-suite',
    excerpt: 'Großzügige Suite mit Wohnbereich, Panoramabalkon und viel Ruhe.',
    name: 'Alpine Suite',
    description: 'Für längere Aufenthalte und Wochenenden zu zweit: separater Wohnbereich, Panoramabalkon, freistehende Wanne und ein Grundriss, der nicht überfüllt wirkt.',
    image: img.suite,
    priceLabel: 'ab 310 € / Nacht',
    sizeLabel: '52 m²',
    occupancyLabel: '2 Gäste',
    bedLabel: 'King-Size Bett',
    features: ['Panoramabalkon', 'Wohnbereich', 'Badewanne', 'Private-Spa-Slot nach Verfügbarkeit'],
    highlighted: true,
  },
  {
    title: 'Family Loft',
    slug: 'family-loft',
    excerpt: 'Zwei Schlafbereiche, Stauraum und genug Freiheit für Familien.',
    name: 'Family Loft',
    description: 'Zwei Schlafbereiche, robuste Materialien, Spielkiste und kurze Wege ins Restaurant. Gedacht für Familien, die Komfort wollen, aber kein steifes Hotelgefühl.',
    image: img.family,
    priceLabel: 'ab 360 € / Nacht',
    sizeLabel: '58 m²',
    occupancyLabel: 'bis 4 Gäste',
    bedLabel: 'Doppelbett + Schlafnische',
    features: ['Zwei Schlafbereiche', 'Kinderpaket auf Wunsch', 'Großes Bad', 'Abendessen früh buchbar'],
  },
  {
    title: 'Spa Chalet',
    slug: 'spa-chalet',
    excerpt: 'Privater Rückzugsort mit Terrasse, Sauna-Option und viel Abstand.',
    name: 'Spa Chalet',
    description: 'Unser privater Rückzugsort am Rand des Hauses: Terrasse, eigener Eingang, viel Holz und auf Wunsch ein reservierter Spa-Zeitraum.',
    image: img.chalet,
    priceLabel: 'ab 490 € / Nacht',
    sizeLabel: '74 m²',
    occupancyLabel: '2-3 Gäste',
    bedLabel: 'King-Size Bett + Daybed',
    features: ['Private Terrasse', 'Eigener Eingang', 'Sauna-Zeit reservierbar', 'Frühstück im Chalet möglich'],
  },
];

const offers = [
  {
    title: 'Zwei Nächte Bergluft',
    slug: 'zwei-naechte-bergluft',
    excerpt: 'Kurz raus, gut schlafen, gut essen und den Kopf leiser bekommen.',
    image: img.forest,
    priceLabel: 'ab 520 € p. P.',
    durationLabel: '2 Nächte',
    includes: ['Frühstück', 'Spa-Zugang', '3-Gänge-Abendmenü', 'Late Checkout nach Verfügbarkeit'],
  },
  {
    title: 'Spa-Auszeit unter der Woche',
    slug: 'spa-auszeit-unter-der-woche',
    excerpt: 'Für Tage, an denen Ruhe wichtiger ist als ein voller Kalender.',
    image: img.spa,
    priceLabel: 'ab 690 € p. P.',
    durationLabel: '3 Nächte',
    includes: ['Massage 60 Min.', 'Sauna & Ruheraum', 'Dinner an zwei Abenden', 'Teezeit am Kamin'],
  },
  {
    title: 'Workation am Berg',
    slug: 'workation-am-berg',
    excerpt: 'Konzentriert arbeiten, gut essen und nachmittags auf den Berg.',
    image: img.meeting,
    priceLabel: 'ab 840 € p. P.',
    durationLabel: '4 Nächte',
    includes: ['Zimmer mit Schreibtisch', 'Highspeed-WLAN', 'Meeting-Nische', 'Wäsche-Service'],
  },
];

const newsItems = [
  {
    title: 'Warum Direktanfragen im Hotel oft besser funktionieren',
    slug: 'direktanfrage-hotel',
    excerpt: 'Ein kurzer Blick hinter die Kulissen: Zimmerwunsch, Anlass und Timing lassen sich direkt viel genauer klären.',
    image: img.lobby,
    content: '<p>Portale zeigen Verfügbarkeit, aber sie verstehen selten den Anlass einer Reise. Bei einer Direktanfrage können wir Zimmerlage, Anreisezeit, Spa-Wunsch und kleine Details direkt zusammenführen.</p><p>Gerade bei Wochenenden, Familienreisen und besonderen Anlässen entstehen so oft bessere Aufenthalte als über eine anonyme Schnellbuchung.</p>',
  },
  {
    title: 'Frühstück im Alpenglow: leise, regional, ohne Buffet-Stress',
    slug: 'fruehstueck-alpenglow',
    excerpt: 'Wie wir Frühstück planen, damit der Tag ruhig beginnt.',
    image: img.breakfast,
    content: '<p>Unser Frühstück folgt keiner Show-Logik. Wir setzen auf gutes Brot, Käse aus der Region, warme Eierspeisen, Obst, Kaffee und einen Service, der nachfragt, ohne zu drängen.</p><p>Wer früh auf den Berg möchte, bekommt eine schnelle Variante. Wer bleibt, darf sitzen bleiben.</p>',
  },
  {
    title: 'Spa-Zeit richtig planen',
    slug: 'spa-zeit-planen',
    excerpt: 'Wann der Spa besonders ruhig ist und wie Sie Treatments sinnvoll kombinieren.',
    image: img.spa,
    content: '<p>Der Spa ist morgens und am frühen Nachmittag besonders ruhig. Für Paare empfehlen wir, Massage und Sauna nicht zu eng zu planen, damit aus Wellness kein Terminplan wird.</p><p>Unser Team hilft bei der passenden Reihenfolge und blockt auf Wunsch ruhige Slots vor.</p>',
  },
];

function hero(headline, subline, bgImage, extra = {}) {
  return section('hero', {
    headline,
    subline,
    badgeText: extra.badgeText || 'Boutique-Hotel in Tirol',
    badgeIcon: 'Sparkles',
    bgMode: 'image',
    bgImage,
    bgImageMobile: bgImage,
    bgPosition: extra.bgPosition || 'center 48%',
    bgPositionMobile: 'center center',
    overlayColor: '#07120E',
    overlayOpacity: extra.overlayOpacity ?? 0.56,
    imageEffect: 'kenBurns',
    imageEffectIntensity: 'subtle',
    primaryCta: extra.primaryCta || { label: 'Aufenthalt anfragen', href: '/kontakt', icon: 'CalendarCheck' },
    secondaryCta: extra.secondaryCta || { label: 'Zimmer ansehen', href: '/zimmer', icon: 'BedDouble' },
    trustItems: extra.trustItems || ['Direktkontakt statt Portalstress', 'Spa-Zugang inklusive', 'Restaurant im Haus'],
    availabilityHint: extra.availabilityHint || 'Ruhige Wochenmitte auf Anfrage',
    ratingText: extra.ratingText || '4,8 / 5 Gästestimmen',
  }, heroStyle);
}

function roomShowcase(customRooms = rooms, heading = 'Zimmer, die Ruhe ernst nehmen.') {
  return section('roomShowcase', {
    badgeText: 'Zimmer & Suiten',
    headline: heading,
    subline: 'Jede Kategorie ist anders geplant: nicht lauter Luxus, sondern die richtige Mischung aus Licht, Ruhe, Material und Blick.',
    footerText: 'Alle Preise sind Richtwerte und hängen von Saison, Aufenthaltsdauer und Verfügbarkeit ab.',
    rooms: customRooms.map((room) => ({
      ...room,
      detailCta: { label: 'Details ansehen', href: `/c/zimmer/${room.slug}` },
      bookingCta: { label: 'Anfragen', href: '/kontakt' },
      galleryImages: [room.image, img.lobby],
    })),
  }, light);
}

function cta(headline, subline, label = 'Aufenthalt anfragen') {
  return section('immersiveCtaBanner', {
    badge: 'Direkt anfragen',
    headline,
    subline,
    image: img.lobby,
    imageAlt: 'Warme Hotellobby im Alpenglow Resort & Spa',
    stats: [
      { value: '42', label: 'Zimmer & Suiten' },
      { value: '900 m²', label: 'Spa & Ruhe' },
      { value: '1', label: 'Team, das mitdenkt' },
    ],
    primaryCta: { label, href: '/kontakt', icon: 'Send' },
    secondaryCta: { label: 'Zimmer ansehen', href: '/zimmer', icon: 'BedDouble' },
  }, dark);
}

function bookingStrip() {
  return section('bookingStrip', {
    badgeText: 'Direktanfrage',
    headline: 'Aufenthalt ohne Umwege klären.',
    subline: 'Senden Sie Wunschdatum, Gästezahl und Anlass. Wir antworten persönlich mit sinnvoller Zimmerempfehlung.',
    arrivalLabel: 'Anreise',
    departureLabel: 'Abreise',
    guestsLabel: 'Gäste',
    roomLabel: 'Zimmerwunsch',
    submitCta: { label: 'Anfrage senden', href: '/kontakt' },
    secondaryCta: { label: 'Telefonisch fragen', href: '/kontakt' },
    bookingNote: 'Das volle Booking-Addon ist hier nicht aktiv. Diese Demo nutzt bewusst die einfache Direktanfrage.',
    trustItems: [
      { icon: 'ShieldCheck', text: 'ehrliche Verfügbarkeit' },
      { icon: 'Coffee', text: 'Frühstück optional' },
      { icon: 'Sparkles', text: 'Spa-Wünsche vorab klären' },
    ],
  }, light);
}

function wellnessSection() {
  return section('wellness', {
    badgeText: 'Spa & Ruhe',
    headline: 'Wellness ohne Tagesprogramm.',
    subline: 'Sauna, Ruheraum, Treatments und genug Abstand zwischen den Terminen.',
    introText: 'Unser Spa ist nicht auf Masse gebaut. Wir planen Slots, Treatments und Ruhebereiche so, dass Gäste nicht von einem Programmpunkt zum nächsten laufen.',
    imagePrimary: img.spa,
    imageSecondary: img.pool,
    treatments: [
      { title: 'Alpine Massage', text: 'Ruhige Anwendung mit warmem Öl und Fokus auf Rücken, Nacken und Schultern.', durationLabel: '60 Min.', priceLabel: '98 €', image: img.massage, cta: { label: 'Termin anfragen', href: '/kontakt' } },
      { title: 'Private Spa Slot', text: 'Reservierter Zeitraum im kleinen Spa-Bereich für Paare oder ruhige Morgen.', durationLabel: '90 Min.', priceLabel: 'auf Anfrage', image: img.pool, cta: { label: 'Slot anfragen', href: '/kontakt' } },
      { title: 'Bergkräuter-Ritual', text: 'Peeling, Wärme und Teezeit mit Kräutern aus der Region.', durationLabel: '75 Min.', priceLabel: '126 €', image: img.spa, cta: { label: 'Ritual anfragen', href: '/kontakt' } },
    ],
    features: [
      { icon: 'Flame', title: 'Sauna', text: 'Täglich geöffnet, am Abend bewusst ruhig.' },
      { icon: 'Leaf', title: 'Ruhebereiche', text: 'Liegen mit Abstand, Tee und Blick ins Grüne.' },
      { icon: 'Droplets', title: 'Pool', text: 'Innenbereich mit warmem Licht und klaren Zeiten.' },
    ],
    ctaPrimary: { label: 'Spa anfragen', href: '/kontakt' },
  }, alt);
}

function diningSection() {
  return section('hotelDining', {
    badgeText: 'Restaurant & Bar',
    headline: 'Morgens ruhig. Abends regional.',
    subline: 'Unsere Küche arbeitet mit Produkten aus Tirol, kurzen Karten und einem Service, der lieber erklärt als überredet.',
    introText: 'Frühstück, kleine Nachmittagskarte, Abendmenü und Bar am Kamin: alles so geplant, dass der Aufenthalt leicht bleibt.',
    image: img.dining,
    openingText: 'Frühstück 7:30-10:30 Uhr · Abendmenü 18:00-21:30 Uhr · Bar ab 17:00 Uhr',
    menus: [
      { title: 'Alpenglow Frühstück', description: 'Brot, Käse, Eiergerichte, Obst, Kaffee und ruhiger Service am Tisch.', timeLabel: '7:30-10:30 Uhr', priceLabel: 'optional inklusive' },
      { title: 'Abendmenü', description: 'Drei bis fünf Gänge, regional gedacht und saisonal gekocht.', timeLabel: '18:00-21:30 Uhr', priceLabel: 'ab 58 €' },
      { title: 'Kaminbar', description: 'Wein, alpine Drinks, kleine Teller und ein Platz, der nicht laut werden muss.', timeLabel: 'ab 17:00 Uhr', priceLabel: 'à la carte' },
    ],
    highlights: [
      { title: 'Frühstück ohne Gedränge', text: 'Lieber frisch nachgelegt als vollgestellte Buffets.', image: img.breakfast },
      { title: 'Bar am Kamin', text: 'Kleine Karte, gute Weine, klare Empfehlungen.', image: img.bar },
    ],
    ctaPrimary: { label: 'Tisch anfragen', href: '/kontakt' },
  }, light);
}

function eventSpacesSection() {
  return section('eventSpaces', {
    badgeText: 'Events & Rückzug',
    headline: 'Räume für Meetings, Feiern und ruhige Offsites.',
    subline: 'Nicht jeder Anlass braucht einen großen Saal. Manchmal reicht ein Raum, der gut vorbereitet ist.',
    spaces: [
      { name: 'Salon Berglicht', description: 'Heller Raum mit Terrasse für Workshops, Strategie-Tage oder private Essen.', image: img.event, capacityLabel: 'bis 48 Personen', sizeLabel: '86 m²', seatingOptions: ['Workshop', 'Dinner', 'U-Form'], features: ['Terrassenzugang', 'Beamer', 'Bar in der Nähe'], inquiryCta: { label: 'Salon anfragen', href: '/kontakt' } },
      { name: 'Stube Kitz', description: 'Kleiner Raum für vertrauliche Gespräche, Board-Meetings oder Familienrunden.', image: img.meeting, capacityLabel: 'bis 16 Personen', sizeLabel: '34 m²', seatingOptions: ['Boardroom', 'Dinner'], features: ['ruhige Lage', 'Tageslicht', 'Kaminoption'], inquiryCta: { label: 'Stube anfragen', href: '/kontakt' } },
      { name: 'Gartenplateau', description: 'Außenbereich für Empfang, Yoga, Aperitif oder kleine Sommerformate.', image: img.terrace, capacityLabel: 'bis 60 Personen', sizeLabel: 'Außenfläche', seatingOptions: ['Empfang', 'Yoga', 'Aperitif'], features: ['Bergblick', 'Schlechtwetterplan', 'Servicebar'], inquiryCta: { label: 'Plateau anfragen', href: '/kontakt' } },
    ],
    processHeadline: 'So planen wir gemeinsam',
    processSteps: [
      { icon: 'ClipboardList', title: 'Rahmen klären', text: 'Anlass, Personen, Timing und gewünschte Stimmung.' },
      { icon: 'Layout', title: 'Raum wählen', text: 'Bestuhlung, Technik, Menü und Ablauf passend zum Format.' },
      { icon: 'CheckCircle2', title: 'Sauber durchführen', text: 'Ein Ansprechpartner koordiniert den Tag vor Ort.' },
    ],
    ctaPrimary: { label: 'Event anfragen', href: '/kontakt' },
  }, alt);
}

function gallerySection() {
  return section('gallery', {
    badgeText: 'Einblicke',
    headline: 'So fühlt sich das Haus an.',
    subline: 'Zimmer, Spa, Restaurant und die ruhigen Ecken dazwischen.',
    images: [
      { src: img.lobby, alt: 'Lobby mit warmem Licht', caption: 'Ankommen im Haus', category: 'Lobby' },
      { src: img.suite, alt: 'Suite mit Panoramablick', caption: 'Alpine Suite', category: 'Zimmer' },
      { src: img.spa, alt: 'Spa mit ruhiger Atmosphäre', caption: 'Spa & Ruhe', category: 'Spa' },
      { src: img.dining, alt: 'Restaurant im Hotel', caption: 'Restaurant', category: 'Genuss' },
      { src: img.terrace, alt: 'Terrasse mit Blick', caption: 'Terrasse', category: 'Außenbereich' },
      { src: img.forest, alt: 'Wald und Berge in Tirol', caption: 'Umgebung', category: 'Natur' },
    ],
    ctaPrimary: { label: 'Aufenthalt anfragen', href: '/kontakt' },
  }, light);
}

const pages = [
  {
    slug: '',
    title: 'Startseite',
    sections: [
      hero('Ankommen, durchatmen, bleiben wollen.', 'Ein Boutique-Resort in Tirol für Menschen, die Bergluft, gute Küche und echte Ruhe suchen.', img.hero, { bgPosition: 'center 55%' }),
      bookingStrip(),
      roomShowcase(rooms.slice(0, 3), 'Ihre Rückzugsorte im Haus.'),
      wellnessSection(),
      diningSection(),
      section('proofWall', {
        badge: 'Gästestimmen',
        headline: 'Ruhig im Ton, stark in der Erinnerung.',
        subline: 'Was Gäste besonders oft nennen: Schlafqualität, Spa-Ruhe, Frühstück und ein Team, das nicht erst fragt, wenn etwas fehlt.',
        stats: [{ value: '4,8/5', label: 'Gästebewertung' }, { value: '42', label: 'Zimmer & Suiten' }, { value: '900 m²', label: 'Spa & Ruhe' }],
        testimonials: [
          { quote: 'Selten so ruhig geschlafen. Das Team war aufmerksam, ohne ständig präsent zu sein.', author: 'M. Berger', meta: 'Wochenende zu zweit', rating: 5 },
          { quote: 'Für unser Offsite war alles vorbereitet: Raum, Essen, Technik und der Ablauf danach.', author: 'Lea M.', meta: 'Firmen-Retreat', rating: 5 },
          { quote: 'Frühstück, Spa und Zimmer wirkten nicht überinszeniert, sondern einfach sehr gut gemacht.', author: 'Familie Kern', meta: 'Familienwoche', rating: 5 },
        ],
      }, light),
      section('newsPreview', { headline: 'Notizen aus dem Alpenglow', subline: 'Kleine Einblicke in Küche, Spa, Direktanfragen und die ruhigeren Tage im Haus.', linkLabel: 'Alle Beiträge lesen', linkIcon: 'ArrowRight', collectionKey: 'news' }, alt),
      cta('Wenn die Reise ruhig beginnen soll, fragen Sie direkt an.', 'Wir prüfen Zimmer, Zeitraum, Spa-Wünsche und Restaurantplätze gemeinsam statt Sie durch ein anonymes Formular zu schicken.'),
    ],
  },
  {
    slug: 'zimmer',
    title: 'Zimmer & Suiten',
    sections: [
      hero('Zimmer, die nicht laut sein müssen.', 'Vier Kategorien für unterschiedliche Aufenthalte: Wochenende, Familie, Workation oder privater Rückzug.', img.suite, { badgeText: 'Zimmer & Suiten', primaryCta: { label: 'Zimmer anfragen', href: '/kontakt', icon: 'Send' } }),
      roomShowcase(rooms, 'Vom Garden Room bis zum Spa Chalet.'),
      section('comparisonCardsPro', {
        badge: 'Welches Zimmer passt?',
        headline: 'Nicht jede Reise braucht denselben Raum.',
        subline: 'Eine schnelle Orientierung, bevor Sie anfragen.',
        plans: [
          { name: 'Kurzurlaub', price: 'Garden Room', note: 'für 1-2 Nächte', highlighted: false, features: ['ruhig', 'kompakt', 'Balkon', 'Spa inklusive'], missing: ['kein separater Wohnbereich'], ctaLabel: 'Garden Room ansehen', ctaHref: '/c/zimmer/garden-room' },
          { name: 'Auszeit', price: 'Alpine Suite', note: 'für Paare', highlighted: true, features: ['Wohnbereich', 'Panoramabalkon', 'Badewanne', 'mehr Ruhe'], missing: [], ctaLabel: 'Suite ansehen', ctaHref: '/c/zimmer/alpine-suite' },
          { name: 'Privat', price: 'Spa Chalet', note: 'für mehr Abstand', highlighted: false, features: ['Terrasse', 'eigener Eingang', 'viel Platz', 'Private-Spa-Option'], missing: ['begrenzte Verfügbarkeit'], ctaLabel: 'Chalet ansehen', ctaHref: '/c/zimmer/spa-chalet' },
        ],
      }, light),
      section('faq', { badgeText: 'FAQ', headline: 'Kurz geklärt vor der Anfrage.', subline: 'Antworten zu Check-in, Frühstück, Spa und Familienaufenthalten.', items: [
        { question: 'Ab wann ist Check-in?', answer: 'Regulär ab 15:00 Uhr. Früherer Check-in ist nach Verfügbarkeit möglich.' },
        { question: 'Ist Spa-Zugang inklusive?', answer: 'Ja, Sauna, Pool und Ruheraum sind für Hotelgäste inklusive.' },
        { question: 'Gibt es Zimmer für Familien?', answer: 'Ja, das Family Loft ist für bis zu vier Gäste geplant. Babybett und Kinderpaket sind auf Anfrage möglich.' },
        { question: 'Kann ich ein bestimmtes Zimmer wünschen?', answer: 'Ja. Bei Direktanfrage prüfen wir Zimmerlage und Kategorie persönlich.' },
      ] }, alt),
      cta('Unsicher, welche Kategorie passt?', 'Schreiben Sie Zeitraum, Personen und Anlass. Wir empfehlen die sinnvollste Kategorie.'),
    ],
  },
  { slug: 'spa', title: 'Spa & Ruhe', sections: [hero('Spa-Zeit, die nicht nach Kalender klingt.', 'Sauna, Ruhebereiche und Treatments mit genug Luft zwischen den Momenten.', img.spa, { badgeText: 'Spa & Wellness' }), wellnessSection(), section('scrollStory', { badge: 'Ruhiger Ablauf', headline: 'Ein Spa-Tag darf einfach bleiben.', subline: 'Nicht jedes Treatment braucht ein großes Ritual. Entscheidend ist, dass Reihenfolge, Timing und Ruhe passen.', steps: [
    { title: 'Ankommen', text: 'Tee, warmes Licht und ein kurzer Moment ohne Programm.', image: img.pool },
    { title: 'Wärme', text: 'Sauna oder Dampfbad, ohne den Bereich zu überfüllen.', image: img.spa },
    { title: 'Treatment', text: 'Massage oder Ritual nach Bedarf, nicht nach Paketdruck.', image: img.massage },
    { title: 'Nachruhen', text: 'Genug Zeit, bevor Restaurant oder Zimmer wieder dran sind.', image: img.forest },
  ] }, light), cta('Planen Sie Spa nicht nebenbei.', 'Wir helfen, Treatments und Zimmerzeit sinnvoll zu verbinden.')] },
  { slug: 'restaurant', title: 'Restaurant & Bar', sections: [hero('Regionale Küche, leise serviert.', 'Frühstück, Abendmenü und Kaminbar im Haus: klar gekocht, gut erklärt und ohne Inszenierungsdruck.', img.dining, { badgeText: 'Restaurant & Bar' }), diningSection(), section('editorialFeatureRail', { badge: 'Genuss im Haus', headline: 'Drei Momente, die den Tag tragen.', subline: 'Morgens ruhig starten, abends regional essen, später am Kamin sitzen.', slides: [
    { eyebrow: 'Frühstück', title: 'Kein Gedränge am Morgen', text: 'Wir legen frisch nach, servieren warme Eierspeisen und halten den Raum bewusst ruhig.', image: img.breakfast, cta: { label: 'Frühstück anfragen', href: '/kontakt' } },
    { eyebrow: 'Dinner', title: 'Kurze Karte, klare Herkunft', text: 'Produkte aus Tirol, saisonale Gänge und Weinempfehlungen ohne steife Sprache.', image: img.dining, cta: { label: 'Abend anfragen', href: '/kontakt' } },
    { eyebrow: 'Bar', title: 'Ein letzter Platz am Kamin', text: 'Drinks, kleine Teller und Gespräche, die nicht gegen Musik anschreien müssen.', image: img.bar, cta: { label: 'Bar ansehen', href: '/galerie' } },
  ] }, light), cta('Sie möchten einen Tisch oder ein kleines Dinner planen?', 'Senden Sie uns Zeitraum, Personen und Anlass.')] },
  { slug: 'angebote', title: 'Angebote', sections: [hero('Arrangements ohne Paket-Gefühl.', 'Ein paar sinnvolle Kombinationen für Bergtage, Spa-Auszeiten und konzentriertes Arbeiten.', img.forest, { badgeText: 'Angebote' }), section('offers', { badgeText: 'Arrangements', headline: 'Gute Aufenthalte beginnen mit einem klaren Rahmen.', subline: 'Unsere Angebote sind Beispiele. Wir passen sie bei Direktanfrage gerne an Zeitraum, Zimmer und Anlass an.', offers: offers.map((offer) => ({ ...offer, cta: { label: 'Anfragen', href: '/kontakt' }, detailHref: `/c/angebote/${offer.slug}`, detailLabel: 'Details ansehen' })), fallbackText: 'Weitere saisonale Angebote folgen.' }, light), section('offerCampaignStrip', { badge: 'Unter der Woche', headline: 'Mehr Ruhe, mehr Spa, bessere Verfügbarkeit.', subline: 'Wer Sonntag bis Donnerstag reist, erlebt das Haus am ruhigsten. Ideal für Spa, Arbeit oder echte Pause.', image: img.pool, offer: 'ab 690 € p. P.', deadline: 'gültig nach Verfügbarkeit', benefits: ['3 Nächte', 'Massage inklusive', 'Dinner an zwei Abenden', 'Late Checkout möglich'], cta: { label: 'Spa-Auszeit anfragen', href: '/kontakt' } }, dark), cta('Sie möchten ein Angebot anpassen?', 'Wir kombinieren Zimmer, Spa und Restaurant passend zu Ihrem Zeitraum.')] },
  { slug: 'events', title: 'Events & Tagungen', sections: [hero('Räume für gute Gespräche.', 'Offsites, kleine Feiern und private Dinner in Räumen, die vorbereitet sind und trotzdem entspannt bleiben.', img.event, { badgeText: 'Events & Tagungen' }), eventSpacesSection(), section('processSteps', { badgeText: 'Planung', headline: 'Vom ersten Rahmen zum ruhigen Ablauf.', subline: 'Wir halten Planung pragmatisch und transparent.', steps: [
    { icon: 'MessageSquare', title: 'Anfrage', text: 'Personen, Anlass, Ziel und Wunschdatum klären.' },
    { icon: 'LayoutPanelTop', title: 'Raum & Ablauf', text: 'Bestuhlung, Technik, Menü und Zeitplan definieren.' },
    { icon: 'Utensils', title: 'Genuss & Service', text: 'Pausen, Drinks und Essen so takten, dass der Tag fließt.' },
    { icon: 'CheckCircle2', title: 'Durchführung', text: 'Ein Ansprechpartner koordiniert vor Ort.' },
  ] }, light), cta('Planen wir Ihr Format sauber vor.', 'Schreiben Sie Anlass, Datum und Personenanzahl. Wir melden uns mit einem passenden Vorschlag.')] },
  { slug: 'galerie', title: 'Galerie', sections: [hero('Ein Haus aus Licht, Holz und Ruhe.', 'Einblicke in Zimmer, Spa, Restaurant, Bar und Natur rund um das Alpenglow.', img.lobby, { badgeText: 'Galerie' }), gallerySection(), section('brandShowroom', { badge: 'Atmosphäre', headline: 'Nicht laut. Nicht kühl. Einfach gut geführt.', subline: 'Das Haus lebt von warmem Licht, klaren Materialien und einem Team, das Details ernst nimmt.', image: img.suite, highlights: [{ label: 'Material', value: 'Holz, Leinen, Stein' }, { label: 'Licht', value: 'warm und ruhig' }, { label: 'Gefühl', value: 'privat statt anonym' }], cta: { label: 'Aufenthalt anfragen', href: '/kontakt' } }, dark)] },
  { slug: 'ueber-uns', title: 'Über uns', sections: [hero('Gastfreundschaft ohne große Geste.', 'Wir führen ein Haus, das ruhig wirken darf: persönlich, klar organisiert und nah an der Region.', img.terrace, { badgeText: 'Über das Haus' }), section('textImage', { badgeText: 'Haltung', headline: 'Ein Hotel ist dann gut, wenn Gäste nicht darüber nachdenken müssen.', subline: 'Deshalb kümmern wir uns um die kleinen Übergänge: Ankommen, Zimmer, Spa, Essen, Rückfragen und Abreise.', text: '<p>Das Alpenglow Resort & Spa steht für alpine Ruhe ohne Klischee. Wir mögen gutes Handwerk, klare Abläufe und ehrliche Empfehlungen. Nicht jedes Detail muss laut erzählt werden, aber jedes Detail soll funktionieren.</p><p>Unser Team kennt Zimmer, Küche, Spa und Umgebung aus dem Alltag. Genau daraus entsteht Beratung, die nicht nach Skript klingt.</p>', image: img.lobby, imageAlt: 'Team und Lobby im Alpenglow Resort', primaryCta: { label: 'Kontakt aufnehmen', href: '/kontakt' } }, light), section('principlesGrid', { badge: 'Was uns wichtig ist', headline: 'Ruhe ist keine Dekoration.', subline: 'Sie entsteht durch Planung, gutes Material und Menschen, die aufmerksam bleiben.', principles: [
    { eyebrow: '01', title: 'Weniger Reibung', text: 'Gute Abläufe sieht man selten, aber man spürt sie sofort.' },
    { eyebrow: '02', title: 'Region ernst nehmen', text: 'Nicht als Kulisse, sondern in Küche, Material und Empfehlungen.' },
    { eyebrow: '03', title: 'Direkter Kontakt', text: 'Wer direkt fragt, bekommt meist die bessere Lösung.' },
    { eyebrow: '04', title: 'Ruhe schützen', text: 'Spa, Zimmer und Restaurant bleiben bewusst nicht überfüllt.' },
  ], cta: { label: 'Mehr erfahren', href: '/kontakt' } }, alt), cta('Sie möchten wissen, ob das Haus zu Ihrer Reise passt?', 'Fragen Sie direkt. Wir antworten persönlich.')] },
  { slug: 'kontakt', title: 'Kontakt', sections: [hero('Fragen Sie direkt an.', 'Zimmer, Spa, Restaurant, Event oder Sonderwunsch: Wir melden uns mit einer klaren Antwort.', img.lobby, { badgeText: 'Kontakt' }), section('contact', { badgeText: 'Kontakt', headline: 'Direkt mit dem Haus sprechen.', subline: 'Schicken Sie Zeitraum, Personen und Anliegen. Wir prüfen Verfügbarkeit und schlagen den nächsten Schritt vor.', formEnabled: true, introText: 'Besonders hilfreich: Reisedatum, Anzahl der Gäste, Zimmerwunsch und ob Spa oder Restaurant wichtig sind.', image: img.terrace, infoCards: [{ icon: 'Phone', label: 'Telefon', value: phone }, { icon: 'Mail', label: 'E-Mail', value: email }, { icon: 'MapPin', label: 'Adresse', value: address }] }, light), section('location', { badgeText: 'Lage', headline: 'Ruhig gelegen, schnell erreichbar.', subline: 'Kitzbühel, Bergbahnen und Wege in die Natur liegen nah genug, ohne dass das Haus mitten im Trubel steht.', addressText: address, mapEmbedUrl: mapsEmbed, image: img.forest, transportItems: [{ icon: 'Train', label: 'Bahnhof Kitzbühel', value: 'ca. 8 Min.', text: 'Taxi oder Shuttle nach Absprache.' }, { icon: 'CableCar', label: 'Bergbahn', value: 'ca. 6 Min.', text: 'Schnell auf den Berg, ohne lange Wege.' }, { icon: 'Car', label: 'Parken', value: 'am Haus', text: 'Stellplätze bitte vorab reservieren.' }], nearbyItems: [{ title: 'Kitzbüheler Horn', distanceLabel: 'nah', text: 'Wandern, Aussicht und klare Luft.', image: img.forest }, { title: 'Altstadt', distanceLabel: 'kurze Fahrt', text: 'Einkaufen, Cafés und Abendspaziergang.', image: img.terrace }], routeCta: { label: 'Route planen', href: 'https://maps.google.com' } }, alt)] },
  { slug: 'news', title: 'Hotelnotizen', sections: [hero('Notizen aus dem Alpenglow.', 'Kleine Beiträge zu Direktanfragen, Frühstück, Spa und den Dingen, die einen Aufenthalt besser machen.', img.breakfast, { badgeText: 'Journal' }), section('newsGrid', { headline: 'Aktuelle Beiträge', subline: 'Einblicke aus Haus, Küche und Spa.', collectionKey: 'news' }, light), cta('Haben Sie eine konkrete Frage?', 'Dann schreiben Sie uns direkt statt lange zu suchen.')] },
  { slug: 'impressum', title: 'Impressum', sections: [section('legalContent', { headline: 'Impressum', blocks: [{ title: 'Angaben gemäß Mediengesetz', content: 'Alpenglow Resort & Spa GmbH, Sonnbergweg 18, 6370 Kitzbühel, Österreich' }, { title: 'Kontakt', content: `${phone} · ${email}` }, { title: 'Vertretungsberechtigt', content: 'Geschäftsführung: Demo Hotelmanagement GmbH' }, { title: 'Hinweis', content: 'Dies ist ein Demo-Tenant von Flamingo Media. Inhalte, Namen und Angaben dienen ausschließlich der Demonstration.' }] }, light)] },
  { slug: 'datenschutz', title: 'Datenschutz', sections: [section('legalContent', { headline: 'Datenschutzerklärung', blocks: [{ title: 'Verantwortlicher', content: 'Alpenglow Resort & Spa GmbH, Sonnbergweg 18, 6370 Kitzbühel, Österreich' }, { title: 'Kontaktformular', content: 'Angaben aus Formularen werden ausschließlich zur Bearbeitung der Anfrage genutzt.' }, { title: 'Hosting', content: 'Die Website wird technisch über Flamingo Media demonstriert.' }, { title: 'Rechte', content: 'Betroffene Personen können Auskunft, Berichtigung oder Löschung ihrer Daten verlangen.' }] }, light)] },
];

function detailHero(title, excerpt, image, badgeText) {
  return section('collectionHero', { headline: title, subline: excerpt, badgeText, backgroundImage: image, bgImage: image, overlayColor: '#07120E', overlayOpacity: 0.58, imageEffect: 'kenBurns', imageEffectIntensity: 'subtle' }, heroStyle);
}

function prefixDemoLinks(value) {
  if (Array.isArray(value)) return value.map(prefixDemoLinks);
  if (!value || typeof value !== 'object') return value;
  const copy = { ...value };
  for (const [key, child] of Object.entries(copy)) {
    if (key === 'href' && typeof child === 'string' && child.startsWith('/') && !child.startsWith('/demo/hotel')) {
      copy[key] = `/demo/hotel${child === '/' ? '' : child}`;
    } else {
      copy[key] = prefixDemoLinks(child);
    }
  }
  return copy;
}

function roomItemSections(room) {
  return prefixDemoLinks([
    detailHero(room.title, room.excerpt, room.image, 'Zimmer & Suite'),
    section('textImage', { badgeText: room.sizeLabel, headline: room.name, subline: room.description, text: `<p>${room.description}</p><p>${room.occupancyLabel} · ${room.bedLabel} · ${room.priceLabel}. Bei Direktanfrage prüfen wir Lage, Zeitraum und sinnvolle Zusatzleistungen persönlich.</p>`, image: room.image, imageAlt: room.name, primaryCta: { label: 'Zimmer anfragen', href: '/kontakt' } }, light),
    section('amenities', { badgeText: 'Ausstattung', headline: 'Was in dieser Kategorie zählt.', subline: 'Die wichtigsten Merkmale auf einen Blick.', items: room.features.map((feature, index) => ({ icon: ['BedDouble', 'Bath', 'Coffee', 'Sparkles'][index % 4], title: feature, text: 'Im Aufenthalt enthalten oder nach Verfügbarkeit planbar.', mediaType: 'icon' })), ctaPrimary: { label: 'Aufenthalt anfragen', href: '/kontakt' } }, alt),
    cta('Passt diese Kategorie zu Ihrer Reise?', 'Schreiben Sie uns Zeitraum, Gästezahl und Wunsch. Wir prüfen die beste Lösung.'),
  ]);
}

function offerItemSections(offer) {
  return prefixDemoLinks([
    detailHero(offer.title, offer.excerpt, offer.image, 'Angebot'),
    section('offers', { badgeText: offer.durationLabel, headline: offer.title, subline: offer.excerpt, offers: [{ ...offer, cta: { label: 'Angebot anfragen', href: '/kontakt' } }] }, light),
    section('freeText', { content: `<p>${offer.excerpt}</p><p>Enthalten sind: ${offer.includes.join(', ')}. Wir passen Zimmerkategorie, Anreise und Zusatzleistungen gern an Ihren Zeitraum an.</p>` }, light),
    cta('Möchten Sie dieses Arrangement anfragen?', 'Senden Sie uns Wunschdatum und Gästezahl.'),
  ]);
}

function newsItemSections(item) {
  return prefixDemoLinks([detailHero(item.title, item.excerpt, item.image, 'Hotelnotiz'), section('freeText', { content: item.content }, light), cta('Noch Fragen zum Aufenthalt?', 'Wir antworten direkt und persönlich.')]);
}

async function upsertPage(page, existingPages) {
  const existing = existingPages.find((p) => p.slug === page.slug) || (page.slug === 'events' ? existingPages.find((p) => p.slug === 'referenzen') : null);
  const payload = { slug: page.slug, title: page.title, sections: page.sections, visible: true, status: 'published' };
  if (existing) return api('PUT', `/api/v1/content/pages/${existing.id}`, payload);
  return api('POST', '/api/v1/content/pages', payload);
}

async function ensureCollection(key, label, existingCollections) {
  const found = existingCollections.find((c) => c.key === key);
  if (found) return found;
  return api('POST', '/api/v1/content/collections', { key, label });
}

async function clearCollectionItems(key, collections) {
  const collection = collections.find((c) => c.key === key);
  if (!collection) return;
  for (const item of collection.items || []) await api('DELETE', `/api/v1/content/collections/${key}/items/${item.id}`);
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
      data: { image: item.image, author: 'Alpenglow Resort & Spa', date: '2026-06-04', sections: makeSections(item) },
    });
  }
}

async function main() {
  const pagesBefore = await api('GET', '/api/v1/content/pages');
  const collectionsBefore = await api('GET', '/api/v1/content/collections');
  const existingPages = pagesBefore.pages || [];

  await api('PUT', '/api/v1/content/style', { style: 'classic' });
  await api('PUT', '/api/v1/content/brand', { companyName: 'Alpenglow Resort & Spa', tagline: 'Boutique-Hotel, Spa und alpine Ruhe in Tirol', primaryColor: colors.forest, secondaryColor: colors.sage, accentColor: colors.gold, logo: '', logoDisplay: 'name', headingFont: 'Playfair Display', bodyFont: 'Inter', topBarColor: colors.forestDeep, footerColor: colors.forestDeep });
  await api('PUT', '/api/v1/content/design', { textPrimary: colors.ink, textSecondary: colors.soft, sectionBg: colors.linen, sectionBgAlt: colors.linenAlt, cardBg: colors.card, cardBorder: colors.border, badgeBg: '#F1E4C9', badgeText: colors.forest, badgeBorder: colors.border, brand: colors.forest, accent: colors.gold, heading: colors.ink, subheading: colors.soft, body: colors.soft, muted: colors.muted, icon: colors.forest, btnBg: colors.forest, btnText: colors.onDark, dividerColor: colors.border, eyebrow: colors.gold, statValue: colors.forest, quote: colors.ink, ratingStar: colors.gold, check: colors.moss, onDarkHeading: colors.onDark, onDarkBody: colors.onDarkSoft, onDarkMuted: '#D2C4AD' });
  await api('PUT', '/api/v1/content/contact', { phone, email, address, whatsappEnabled: true, whatsapp: '+43535690880', whatsappColor: colors.forest });
  await api('PUT', '/api/v1/content/navigation', { items: navItems, cta: { label: 'Anfrage senden', href: '/kontakt' } });
  await api('PUT', '/api/v1/content/footer', { columns: [{ title: 'Aufenthalt', items: [{ text: 'Zimmer', href: '/zimmer' }, { text: 'Spa', href: '/spa' }, { text: 'Angebote', href: '/angebote' }] }, { title: 'Haus', items: [{ text: 'Restaurant', href: '/restaurant' }, { text: 'Events', href: '/events' }, { text: 'Galerie', href: '/galerie' }] }, { title: 'Kontakt', items: [{ text: phone }, { text: email }, { text: address }] }], legalLinks: [{ label: 'Impressum', href: '/impressum' }, { label: 'Datenschutz', href: '/datenschutz' }], cta: { label: 'Aufenthalt anfragen', href: '/kontakt' } });
  await api('PUT', '/api/v1/content/opening-hours', { hours: [{ type: 'regular', day: 'Rezeption', hours: 'täglich 7:00-22:00 Uhr' }, { type: 'regular', day: 'Frühstück', hours: '7:30-10:30 Uhr' }, { type: 'regular', day: 'Spa', hours: '8:00-21:00 Uhr' }, { type: 'regular', day: 'Restaurant', hours: '18:00-21:30 Uhr' }] });
  await api('PUT', '/api/v1/content/form-fields', { fields: [{ name: 'name', label: 'Name', type: 'text', required: true, halfWidth: true }, { name: 'email', label: 'E-Mail', type: 'email', required: true, halfWidth: true }, { name: 'phone', label: 'Telefon', type: 'tel', halfWidth: true }, { name: 'topic', label: 'Anliegen', type: 'select', options: ['Zimmer anfragen', 'Spa & Wellness', 'Restaurant', 'Event / Tagung', 'Sonstiges'], halfWidth: true }, { name: 'date', label: 'Wunschdatum / Zeitraum', type: 'text', halfWidth: true }, { name: 'guests', label: 'Gäste', type: 'number', halfWidth: true }, { name: 'message', label: 'Nachricht', type: 'textarea', required: true }] });
  await api('PUT', '/api/v1/content/social-links', { instagram: 'https://instagram.com/alpenglowresort', facebook: 'https://facebook.com/alpenglowresort', google: 'https://maps.google.com', tripadvisor: 'https://www.tripadvisor.com' });
  await api('PUT', '/api/v1/content/seo', { titleTemplate: '%s · Alpenglow Resort & Spa', defaultTitle: 'Alpenglow Resort & Spa · Boutique-Hotel in Tirol', defaultDescription: 'Alpenglow Resort & Spa in Tirol: Boutique-Hotel mit Zimmern, Spa, Restaurant, Events und direkter persönlicher Anfrage.', defaultOgImage: img.hero, canonicalBase: 'https://flamingo-renderer.vercel.app/demo/hotel', locale: 'de_DE' });

  for (const page of pages) await upsertPage(page, existingPages);

  await clearCollectionItems('leistungen', collectionsBefore);
  await clearCollectionItems('referenzen', collectionsBefore);
  await clearCollectionItems('erlebnisse', collectionsBefore);
  await clearCollectionItems('rooms', collectionsBefore);
  await replaceCollectionItems('zimmer', 'Zimmer & Suiten', rooms, roomItemSections, collectionsBefore);
  await replaceCollectionItems('angebote', 'Angebote', offers, offerItemSections, collectionsBefore);
  await replaceCollectionItems('news', 'Hotelnotizen', newsItems, newsItemSections, collectionsBefore);

  const pagesAfter = await api('GET', '/api/v1/content/pages');
  const meta = {
    '': ['Alpenglow Resort & Spa Tirol', 'Boutique-Resort in Tirol mit ruhigen Zimmern, Spa, Restaurant, Events und direkter persönlicher Anfrage.'],
    zimmer: ['Zimmer & Suiten', 'Garden Room, Alpine Suite, Family Loft und Spa Chalet im Alpenglow Resort & Spa in Tirol.'],
    spa: ['Spa & Ruhe', 'Sauna, Pool, Treatments und ruhige Spa-Zeiten im Alpenglow Resort & Spa.'],
    restaurant: ['Restaurant & Bar', 'Regionales Frühstück, Abendmenü und Kaminbar im Alpenglow Resort & Spa.'],
    angebote: ['Angebote', 'Arrangements für Bergtage, Spa-Auszeit und Workation im Alpenglow Resort & Spa.'],
    events: ['Events & Tagungen', 'Räume für Offsites, private Feiern und kleine Events im Alpenglow Resort & Spa.'],
    galerie: ['Galerie', 'Einblicke in Zimmer, Spa, Restaurant und Atmosphäre im Alpenglow Resort & Spa.'],
    'ueber-uns': ['Über uns', 'Haltung, Team und Gastfreundschaft im Alpenglow Resort & Spa.'],
    kontakt: ['Kontakt', 'Direktanfrage für Zimmer, Spa, Restaurant oder Events im Alpenglow Resort & Spa.'],
    news: ['Hotelnotizen', 'Beiträge zu Direktanfrage, Frühstück, Spa und ruhigen Aufenthalten im Alpenglow Resort & Spa.'],
  };
  for (const page of pagesAfter.pages || []) {
    if (!meta[page.slug]) continue;
    await api('PUT', `/api/v1/content/seo/${page.id}`, { metaTitle: `${meta[page.slug][0]} · Alpenglow Resort & Spa`, metaDescription: meta[page.slug][1], ogImage: img.hero, noindex: false });
  }

  const publishResult = await api('POST', '/api/v1/content/publish', {});
  console.log(JSON.stringify({ ok: true, publishResult }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
