const token = process.env.FLM_SALON_TOKEN || 'flm_pat_de5a3d8ac1447d879e680d74218b8266a0e47144191913d0a6ee20d08c7988c5';
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

const id = () => crypto.randomUUID();
const section = (type, data, styleOverrides = {}) => ({ id: id(), type, data, styleOverrides });

const img = {
  hero: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=2200&q=85',
  salon: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1800&q=85',
  chair: 'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=1800&q=85',
  styling: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=1600&q=85',
  color: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=1600&q=85',
  balayage: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1600&q=85',
  care: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=1600&q=85',
  bride: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=85',
  team1: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1200&q=85',
  team2: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=1200&q=85',
  team3: 'https://images.unsplash.com/photo-1524503033411-c9566986fc8f?w=1200&q=85',
  product: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1600&q=85',
};

const colors = {
  ink: '#1B1312',
  soft: '#66514D',
  muted: '#8D7771',
  cream: '#FBF6F0',
  blush: '#F3E4DE',
  card: '#FFFDF9',
  border: '#E4D0C8',
  espresso: '#201413',
  rose: '#B76E79',
  roseDeep: '#8F4E5A',
  caramel: '#C99054',
  champagne: '#F1D0B7',
  onDark: '#FFF6EF',
  onDarkSoft: '#EFD8CF',
};

const light = {
  sectionBg: colors.cream,
  cardBg: colors.card,
  cardBorder: colors.border,
  heading: colors.ink,
  subheading: colors.soft,
  body: colors.soft,
  muted: colors.muted,
  icon: colors.roseDeep,
  accentColor: colors.rose,
  btnBg: colors.espresso,
  btnText: colors.onDark,
  badgeBg: colors.blush,
  badgeText: colors.espresso,
  badgeBorder: colors.border,
  borderColor: colors.border,
};

const alt = {
  ...light,
  sectionBg: colors.blush,
  cardBg: colors.cream,
};

const dark = {
  sectionBg: colors.espresso,
  cardBg: 'rgba(255,246,239,0.09)',
  cardBorder: 'rgba(255,246,239,0.24)',
  heading: colors.onDark,
  subheading: colors.onDarkSoft,
  body: colors.onDarkSoft,
  muted: '#D9BDB4',
  icon: colors.champagne,
  accentColor: colors.champagne,
  btnBg: colors.champagne,
  btnText: colors.espresso,
  badgeBg: 'rgba(255,246,239,0.13)',
  badgeText: colors.onDark,
  badgeBorder: 'rgba(255,246,239,0.26)',
  borderColor: 'rgba(255,246,239,0.22)',
  onDarkHeading: colors.onDark,
  onDarkBody: colors.onDarkSoft,
  onDarkMuted: '#D9BDB4',
};

const heroStyle = {
  heroHeading: colors.onDark,
  heroBody: colors.onDarkSoft,
  badgeBg: 'rgba(255,246,239,0.16)',
  badgeText: colors.onDark,
  badgeBorder: 'rgba(255,246,239,0.32)',
  btnBg: colors.champagne,
  btnText: colors.espresso,
  onDarkHeading: colors.onDark,
  onDarkBody: colors.onDarkSoft,
  onDarkMuted: '#D9BDB4',
};

const phone = '+49 89 452 390 18';
const email = 'hello@atelier-isabelle.de';
const address = 'Türkenstraße 68, 80799 München';
const mapsEmbed = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2674.0!2d11.5774!3d48.1514!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zVMO8cmtlbnN0cmHDn2UgNjgsIDgwNzk5IE3DvG5jaGVu!5e0!3m2!1sde!2sde!4v1710000000000';

const navItems = [
  { label: 'Startseite', href: '/', type: 'link' },
  { label: 'Behandlungen', href: '/behandlungen', type: 'link' },
  { label: 'Preise', href: '/preise', type: 'link' },
  { label: 'Looks', href: '/looks', type: 'link' },
  { label: 'Team', href: '/team', type: 'link' },
  { label: 'Über uns', href: '/ueber-uns', type: 'link' },
  { label: 'Kontakt', href: '/kontakt', type: 'link' },
];

const services = [
  {
    title: 'Schnitt & Styling mit Beratung',
    slug: 'schnitt-styling',
    excerpt: 'Schnitte, die im Alltag funktionieren und nicht nur direkt nach dem Föhnen gut aussehen.',
    image: img.styling,
    category: 'Cut',
    durationLabel: '60-90 Min.',
    priceLabel: 'ab 78 €',
    steps: ['Haarstruktur verstehen', 'Schnitt sauber aufbauen', 'Styling erklären', 'Pflege für zuhause klären'],
    careTips: ['Nach 8-10 Wochen auffrischen', 'Hitzeschutz konsequent nutzen', 'Stylingprodukt sparsam dosieren'],
  },
  {
    title: 'Balayage & natürliche Farbe',
    slug: 'balayage-natuerliche-farbe',
    excerpt: 'Weiche Farbverläufe, Glossing und Nuancen, die mit dem Haar herauswachsen dürfen.',
    image: img.balayage,
    category: 'Color',
    durationLabel: '2,5-4 Std.',
    priceLabel: 'ab 190 €',
    steps: ['Farbziel prüfen', 'Aufhellung planen', 'Glossing abstimmen', 'Pflegeplan mitgeben'],
    careTips: ['Color-Shampoo nutzen', 'Glossing nach 8 Wochen auffrischen', 'Haarmaske wöchentlich einplanen'],
    highlighted: true,
  },
  {
    title: 'Repair & Kopfhautpflege',
    slug: 'repair-kopfhautpflege',
    excerpt: 'Treatments für Glanz, Widerstandskraft und eine Kopfhaut, die wieder ruhig wirkt.',
    image: img.care,
    category: 'Care',
    durationLabel: '45-75 Min.',
    priceLabel: 'ab 58 €',
    steps: ['Analyse', 'Treatment', 'Massage', 'Heimpflege abstimmen'],
    careTips: ['Sulfatarm waschen', 'nicht zu heiß föhnen', 'Kopfhaut regelmäßig reinigen'],
  },
  {
    title: 'Braut- & Eventstyling',
    slug: 'braut-eventstyling',
    excerpt: 'Haare und Make-up für Momente, in denen der Look halten und trotzdem nach Ihnen aussehen soll.',
    image: img.bride,
    category: 'Event',
    durationLabel: 'nach Umfang',
    priceLabel: 'ab 220 €',
    steps: ['Vorgespräch', 'Probetermin', 'Look festlegen', 'Styling am Eventtag'],
    careTips: ['Probetermin 6-10 Wochen vorher', 'Accessoires mitbringen', 'Zeitpuffer einplanen'],
  },
];

const looks = [
  {
    title: 'Soft Blonde mit ruhigem Ansatz',
    slug: 'soft-blonde-ruhiger-ansatz',
    excerpt: 'Natürliches Blond mit weichem Verlauf, damit der Look auch nach Wochen noch gepflegt wirkt.',
    image: img.balayage,
    beforeImage: img.color,
    afterImage: img.balayage,
    category: 'Balayage',
  },
  {
    title: 'Curtain Bangs & Bewegung',
    slug: 'curtain-bangs-bewegung',
    excerpt: 'Ein Schnitt, der Gesicht, Alltag und Stylingroutine zusammenbringt.',
    image: img.styling,
    beforeImage: img.salon,
    afterImage: img.styling,
    category: 'Cut',
  },
  {
    title: 'Glossing für warmes Braun',
    slug: 'glossing-warmes-braun',
    excerpt: 'Mehr Tiefe und Glanz ohne harte Farbveränderung.',
    image: img.care,
    beforeImage: img.product,
    afterImage: img.care,
    category: 'Glossing',
  },
];

const newsItems = [
  {
    title: 'Warum ein guter Schnitt vor dem Föhnen beginnt',
    slug: 'schnitt-vor-dem-foehnen',
    excerpt: 'Was wir in der Beratung klären, bevor die Schere überhaupt angesetzt wird.',
    image: img.styling,
    content: '<p>Ein guter Schnitt entsteht nicht am Ende mit der Bürste. Er beginnt mit Fragen: Wie fällt das Haar trocken? Wie viel Zeit ist morgens realistisch? Welche Länge stört im Alltag?</p><p>Erst wenn diese Punkte klar sind, kann ein Schnitt entstehen, der auch ohne Salonlicht funktioniert.</p>',
  },
  {
    title: 'Balayage, aber bitte tragbar',
    slug: 'balayage-tragbar',
    excerpt: 'Warum wir Farbverläufe lieber weich planen als maximal auffällig.',
    image: img.balayage,
    content: '<p>Balayage darf sichtbar sein, aber nicht nach Arbeit aussehen. Wir planen Farbverläufe so, dass sie mit dem Haar wachsen und nicht nach vier Wochen repariert werden müssen.</p><p>Entscheidend sind Ausgangston, Pflegezustand und ein Glossing, das wirklich zum Gesicht passt.</p>',
  },
  {
    title: 'Pflege ist kein Produktregal',
    slug: 'pflege-kein-produktregal',
    excerpt: 'Wenige richtige Schritte helfen mehr als zehn halb passende Produkte.',
    image: img.product,
    content: '<p>Viele Routinen scheitern, weil sie zu kompliziert sind. Wir empfehlen lieber drei klare Schritte als eine volle Ablage im Bad.</p><p>Nach jeder Behandlung erklären wir, was wirklich nötig ist: waschen, schützen, pflegen und wann der nächste Termin sinnvoll ist.</p>',
  },
];

function hero(headline, subline, bgImage, extra = {}) {
  return section('hero', {
    headline,
    subline,
    badgeText: extra.badgeText || 'Hair Studio München',
    badgeIcon: 'Sparkles',
    bgMode: 'image',
    bgImage,
    bgImageMobile: bgImage,
    bgPosition: extra.bgPosition || 'center 48%',
    bgPositionMobile: 'center center',
    overlayColor: '#140D0C',
    overlayOpacity: extra.overlayOpacity ?? 0.58,
    imageEffect: 'kenBurns',
    imageEffectIntensity: 'subtle',
    trustItems: extra.trustItems || ['Farbberatung mit Plan', 'Schnitt für den Alltag', 'WhatsApp-Anfrage möglich'],
    bookingHint: extra.bookingHint || 'Termine nach Verfügbarkeit',
    ratingText: extra.ratingText || '4,9 / 5 Kundinnenstimmen',
    primaryCta: extra.primaryCta || { label: 'Termin anfragen', href: '/kontakt', icon: 'CalendarCheck' },
    secondaryCta: extra.secondaryCta || { label: 'Behandlungen ansehen', href: '/behandlungen', icon: 'Scissors' },
  }, heroStyle);
}

function serviceMenuSection() {
  return section('serviceMenu', {
    badgeText: 'Services',
    headline: 'Was Sie bei uns buchen können.',
    subline: 'Cut, Color, Pflege und Eventstyling mit Beratung, die nicht nach Standardfragebogen klingt.',
    categories: [
      { title: 'Cut & Styling', text: 'Schnitte, Föhnformen und Stylingroutinen, die zuhause realistisch bleiben.', image: img.styling, category: 'Cut', services: ['Beratung', 'Waschen & Schneiden', 'Föhnen', 'Stylingplan'], cta: { label: 'Schnitt anfragen', href: '/c/leistungen/schnitt-styling' } },
      { title: 'Color & Balayage', text: 'Nuancen, Glossing und Verläufe mit sauberer Einschätzung des Ausgangshaars.', image: img.balayage, category: 'Color', services: ['Balayage', 'Glossing', 'Ansatzfarbe', 'Tönung'], cta: { label: 'Farbe anfragen', href: '/c/leistungen/balayage-natuerliche-farbe' } },
      { title: 'Care & Repair', text: 'Pflege, Kopfhaut und Glanz, wenn das Haar müde oder überarbeitet wirkt.', image: img.care, category: 'Care', services: ['Repair Treatment', 'Kopfhautpflege', 'Gloss Care'], cta: { label: 'Pflege anfragen', href: '/c/leistungen/repair-kopfhautpflege' } },
      { title: 'Bride & Event', text: 'Looks für Hochzeit, Shooting, Abend oder Bühne mit Probetermin und Plan.', image: img.bride, category: 'Event', services: ['Brautstyling', 'Make-up', 'Waves', 'Steckfrisur'], cta: { label: 'Event anfragen', href: '/c/leistungen/braut-eventstyling' } },
    ],
    ctaPrimary: { label: 'Preise ansehen', href: '/preise' },
  }, light);
}

function priceListSection() {
  return section('priceList', {
    badgeText: 'Preise',
    headline: 'Orientierung ohne Überraschung.',
    subline: 'Color-Termine hängen von Länge, Ausgangston und Ziel ab. Wir nennen deshalb ehrliche Ab-Preise und klären Details vor Ort.',
    categories: [
      { title: 'Cut & Styling', text: 'Beratung inklusive.', items: [
        { name: 'Waschen, Schnitt & Föhnen', description: 'Für Damen und Herren, inklusive Stylingempfehlung.', durationLabel: '60-90 Min.', priceLabel: 'ab 78 €' },
        { name: 'Express Styling', description: 'Waves, Blowout oder glattes Finish ohne Schnitt.', durationLabel: '35-45 Min.', priceLabel: 'ab 48 €' },
        { name: 'Pony / Kontur auffrischen', description: 'Kurzer Termin zwischen zwei Hauptterminen.', durationLabel: '15-20 Min.', priceLabel: 'ab 18 €' },
      ] },
      { title: 'Color', text: 'Immer mit Beratung zum Ausgangston.', items: [
        { name: 'Balayage', description: 'Weiche Aufhellung mit Glossing und Pflege.', durationLabel: '2,5-4 Std.', priceLabel: 'ab 190 €' },
        { name: 'Glossing', description: 'Frische Nuance, mehr Glanz und weicheres Finish.', durationLabel: '45-60 Min.', priceLabel: 'ab 58 €' },
        { name: 'Ansatzfarbe', description: 'Sauberer Ansatz mit passender Längenpflege.', durationLabel: '75-100 Min.', priceLabel: 'ab 82 €' },
      ] },
      { title: 'Care & Event', text: 'Für besondere Anlässe oder gezielte Pflege.', items: [
        { name: 'Repair Treatment', description: 'Pflegeaufbau mit Kopfhaut-Check.', durationLabel: '45-75 Min.', priceLabel: 'ab 58 €' },
        { name: 'Braut-Probetermin', description: 'Lookentwicklung mit Haar und Make-up.', durationLabel: '120 Min.', priceLabel: 'ab 160 €' },
        { name: 'Eventstyling', description: 'Styling für Abend, Shooting oder Bühne.', durationLabel: '60-120 Min.', priceLabel: 'ab 95 €' },
      ] },
    ],
    footnote: 'Alle Preise sind Richtwerte. Vor Color- oder Eventterminen klären wir Umfang und Zeitbedarf persönlich.',
    ctaPrimary: { label: 'Termin anfragen', href: '/kontakt' },
  }, light);
}

function bookingCtaSection() {
  return section('bookingCta', {
    badgeText: 'Termin',
    headline: 'Der beste Termin beginnt mit einer guten Frage.',
    subline: 'Schicken Sie uns Wunsch, Foto oder Anlass. Wir sagen ehrlich, wie viel Zeit wir brauchen.',
    introText: 'Da das volle Booking-Addon in dieser Demo nicht aktiv ist, läuft die Anfrage bewusst über Kontakt, Telefon oder WhatsApp.',
    onlineCta: { label: 'Anfrage senden', href: '/kontakt' },
    phoneCta: { label: 'Anrufen', href: '/kontakt' },
    whatsappCta: { label: 'WhatsApp schreiben', href: 'https://wa.me/498945239018' },
    notes: ['Color-Termine bitte mit aktuellem Foto anfragen', 'Absagen bitte mindestens 24 Stunden vorher', 'Für Brautstyling empfehlen wir 6-10 Wochen Vorlauf'],
  }, dark);
}

function teamSection() {
  return section('teamShowcase', {
    badgeText: 'Team',
    headline: 'Spezialistinnen statt Alleskönner-Versprechen.',
    subline: 'Jede im Team hat einen Fokus. Genau deshalb passt Beratung besser zum Ergebnis.',
    members: [
      { name: 'Isabelle', role: 'Founder · Cut & Beratung', bio: 'Isabelle übersetzt Wunschbilder in Schnitte, die zur Haarstruktur und zum Alltag passen.', image: img.team1, specialties: ['Schnitt', 'Beratung', 'Alltagsstyling'], bookingCta: { label: 'Bei Isabelle anfragen', href: '/kontakt' } },
      { name: 'Mara', role: 'Color Specialist', bio: 'Mara arbeitet mit weichen Farbverläufen, Glossing und Nuancen, die natürlich herauswachsen.', image: img.team2, specialties: ['Balayage', 'Glossing', 'Color Correction'], bookingCta: { label: 'Color-Termin anfragen', href: '/kontakt' } },
      { name: 'Nina', role: 'Care & Event Styling', bio: 'Nina plant Pflegeaufbau, Brautstyling und Looks, die lange halten ohne starr zu wirken.', image: img.team3, specialties: ['Repair', 'Bride', 'Waves'], bookingCta: { label: 'Styling anfragen', href: '/kontakt' } },
    ],
  }, light);
}

function cta(headline, subline) {
  return section('immersiveCtaBanner', {
    badge: 'Termin anfragen',
    headline,
    subline,
    image: img.salon,
    imageAlt: 'Warmer Salonbereich im Atelier Isabelle',
    stats: [{ value: '4,9/5', label: 'Bewertungen' }, { value: '3', label: 'Spezialistinnen' }, { value: '1', label: 'ehrliche Beratung' }],
    primaryCta: { label: 'Anfrage senden', href: '/kontakt', icon: 'Send' },
    secondaryCta: { label: 'Preise ansehen', href: '/preise', icon: 'ListChecks' },
  }, dark);
}

const pages = [
  { slug: '', title: 'Startseite', sections: [
    hero('Haare, die zu Ihrem Alltag passen.', 'Atelier Isabelle ist ein ruhiges Hair Studio in München für präzise Schnitte, natürliche Farben und Beratung ohne Verkaufsdruck.', img.hero),
    serviceMenuSection(),
    section('spotlightCards', { badge: 'Warum Kundinnen bleiben', headline: 'Schön ist erst gut, wenn es zuhause funktioniert.', subline: 'Wir planen Looks nicht für ein Foto, sondern für echte Wochen danach.', cards: [
      { title: 'Beratung vor Technik', text: 'Wir klären Haarstruktur, Alltag und Pflege, bevor Farbe oder Schnitt starten.', icon: 'MessagesSquare' },
      { title: 'Farbe mit Abstand', text: 'Balayage und Glossing sollen weich herauswachsen und nicht nach vier Wochen stressen.', icon: 'Sparkles' },
      { title: 'Pflege mit Sinn', text: 'Wenige klare Produkte statt Regal voller Empfehlungen.', icon: 'Leaf' },
      { title: 'Zeit realistisch planen', text: 'Color, Braut und Repair bekommen den Slot, den sie wirklich brauchen.', icon: 'Clock' },
    ] }, alt),
    section('beforeAfter', { badgeText: 'Looks', headline: 'Veränderung, die nach Ihnen aussieht.', subline: 'Drei Beispiele aus Cut, Color und Glossing.', items: looks.map((look) => ({ title: look.title, text: look.excerpt, beforeImage: look.beforeImage, afterImage: look.afterImage, category: look.category, caption: 'Beratung, Umsetzung und Pflegehinweis inklusive.', cta: { label: 'Ähnlichen Look anfragen', href: '/kontakt' } })) }, light),
    teamSection(),
    section('newsPreview', { headline: 'Salonjournal', subline: 'Kurze Beiträge zu Schnitt, Farbe, Pflege und Terminplanung.', linkLabel: 'Alle Beiträge lesen', linkIcon: 'ArrowRight', collectionKey: 'news' }, alt),
    bookingCtaSection(),
  ] },
  { slug: 'behandlungen', title: 'Behandlungen', sections: [
    hero('Behandlungen mit Plan statt Preisliste allein.', 'Cut, Color, Care und Eventstyling werden bei uns so geplant, dass Ergebnis, Zeit und Pflege zusammenpassen.', img.color, { badgeText: 'Behandlungen' }),
    serviceMenuSection(),
    section('treatmentDetail', { badgeText: 'Details', headline: 'Was im Termin wirklich passiert.', subline: 'Ablauf, Ergebnis und Pflegehinweise je Behandlung.', treatments: services.map((s) => ({ title: s.title, text: s.excerpt, image: s.image, durationLabel: s.durationLabel, priceLabel: s.priceLabel, resultLabel: s.category, steps: s.steps, careTips: s.careTips, cta: { label: 'Anfragen', href: '/kontakt' } })) }, light),
    section('expertiseGrid', { badgeText: 'Expertise', headline: 'Worin wir besonders genau sind.', subline: 'Spezialisierungen, die im Alltag einen Unterschied machen.', items: [
      { icon: 'Scissors', title: 'Schnittarchitektur', text: 'Formen, die trocken gut fallen und nicht nur frisch geföhnt.' },
      { icon: 'Sparkles', title: 'Balayage', text: 'Weiche Übergänge, saubere Glossings und natürliche Haltbarkeit.' },
      { icon: 'Leaf', title: 'Repair', text: 'Pflegeaufbau für Haar und Kopfhaut ohne Überforderung.' },
      { icon: 'Heart', title: 'Eventstyling', text: 'Looks, die halten, aber beweglich und persönlich bleiben.' },
    ] }, alt),
    cta('Nicht sicher, was Ihr Haar braucht?', 'Schicken Sie uns kurz Ihr Ziel und ein aktuelles Foto. Wir antworten mit einer ehrlichen Einschätzung.'),
  ] },
  { slug: 'preise', title: 'Preise', sections: [
    hero('Preise, die Orientierung geben.', 'Keine versteckten Paketversprechen: Wir nennen Richtwerte und klären den echten Umfang vor dem Termin.', img.chair, { badgeText: 'Preise' }),
    priceListSection(),
    section('packages', { badgeText: 'Pakete', headline: 'Sinnvolle Kombinationen.', subline: 'Für typische Wünsche, die mehr als einen einzelnen Service brauchen.', packages: [
      { title: 'Fresh Shape', text: 'Schnitt, Pflege und Styling für einen klaren Neustart.', image: img.styling, priceLabel: 'ab 129 €', validUntilLabel: 'jederzeit', includes: ['Beratung', 'Schnitt', 'Treatment', 'Styling'], cta: { label: 'Anfragen', href: '/kontakt' } },
      { title: 'Soft Color Day', text: 'Balayage, Glossing und Pflege in einem gut geplanten Termin.', image: img.balayage, priceLabel: 'ab 260 €', validUntilLabel: 'nach Aufwand', includes: ['Farbberatung', 'Balayage', 'Glossing', 'Pflege'], cta: { label: 'Color anfragen', href: '/kontakt' } },
      { title: 'Bride Preview', text: 'Probetermin für Haar und Make-up mit klarer Timingplanung.', image: img.bride, priceLabel: 'ab 240 €', validUntilLabel: 'mit Vorlauf', includes: ['Vorgespräch', 'Probelook', 'Plan für Eventtag'], cta: { label: 'Brautstyling anfragen', href: '/kontakt' } },
    ] }, alt),
    bookingCtaSection(),
  ] },
  { slug: 'looks', title: 'Looks', sections: [
    hero('Looks, die nicht austauschbar wirken.', 'Ein kleines Lookbook aus Schnitt, Farbe und Pflege. Immer mit Beratung, nicht mit Kopie.', img.balayage, { badgeText: 'Lookbook' }),
    section('collectionList', { headline: 'Look-Cases', subline: 'Ausgewählte Ergebnisse mit Kontext.', collectionKey: 'looks', ctaLabel: 'Alle Looks ansehen' }, light),
    section('gallery', { badgeText: 'Galerie', headline: 'Salon, Details und Finish.', subline: 'Einblicke in Arbeiten, Produkte und Atmosphäre.', images: [
      { src: img.salon, alt: 'Salon Isabelle', caption: 'Ruhiger Salonbereich', category: 'Salon' },
      { src: img.styling, alt: 'Styling im Salon', caption: 'Cut & Styling', category: 'Cut' },
      { src: img.balayage, alt: 'Balayage Ergebnis', caption: 'Soft Blonde', category: 'Color' },
      { src: img.product, alt: 'Pflegeprodukte', caption: 'Pflege', category: 'Care' },
    ] }, alt),
    cta('Ein Look gefällt Ihnen, aber Sie sind unsicher?', 'Wir prüfen, was mit Ihrem Ausgangshaar realistisch und gesund machbar ist.'),
  ] },
  { slug: 'team', title: 'Team', sections: [
    hero('Menschen, denen man Haare anvertrauen kann.', 'Drei Spezialisierungen, ein gemeinsamer Anspruch: gute Beratung, ruhige Arbeit und Ergebnisse mit Alltag.', img.team1, { badgeText: 'Team' }),
    teamSection(),
    section('principlesGrid', { badge: 'Haltung', headline: 'Wir schneiden keine Wunschbilder aus dem Kontext.', subline: 'Gutes Haar entsteht, wenn Wunsch, Struktur und Pflege ehrlich zusammenpassen.', principles: [
      { eyebrow: '01', title: 'Ehrlich beraten', text: 'Wir sagen auch, wenn ein Ziel mehr Schritte braucht.' },
      { eyebrow: '02', title: 'Gesund arbeiten', text: 'Farbe darf schön sein, aber nicht blind auf Kosten der Haarqualität.' },
      { eyebrow: '03', title: 'Routine mitdenken', text: 'Ein Look muss morgens realistisch bleiben.' },
      { eyebrow: '04', title: 'Zeit respektieren', text: 'Wir planen Termine so, dass Beratung nicht hinten runterfällt.' },
    ], cta: { label: 'Termin anfragen', href: '/kontakt' } }, alt),
  ] },
  { slug: 'ueber-uns', title: 'Über uns', sections: [
    hero('Ein Salon für ruhige Entscheidungen.', 'Atelier Isabelle verbindet präzises Handwerk mit einer Atmosphäre, in der Beratung nicht nebenbei passiert.', img.salon, { badgeText: 'Über uns' }),
    section('textImage', { badgeText: 'Atelier Isabelle', headline: 'Wir mögen Looks, die bleiben dürfen.', subline: 'Nicht jeder Trend passt zu jedem Haar. Deshalb arbeiten wir lieber präzise als laut.', text: '<p>Atelier Isabelle ist ein Hair Studio in München für Menschen, die eine ehrliche Einschätzung suchen. Wir nehmen uns Zeit für Ausgangshaar, Alltag und Pflege, weil genau dort entschieden wird, ob ein Look langfristig funktioniert.</p><p>Unser Fokus liegt auf präzisen Schnitten, natürlichen Farben, sinnvoller Pflege und Eventlooks, die nicht verkleidet wirken.</p>', image: img.chair, imageAlt: 'Salonbereich im Atelier Isabelle', primaryCta: { label: 'Kontakt aufnehmen', href: '/kontakt' } }, light),
    section('proofWall', { badge: 'Vertrauen', headline: 'Ruhige Arbeit, klare Ergebnisse.', subline: 'Was Kundinnen häufig nennen: Beratung, Farbe, Haltbarkeit und die entspannte Atmosphäre.', stats: [{ value: '4,9/5', label: 'Bewertung' }, { value: '3', label: 'Spezialistinnen' }, { value: '60+', label: 'Minuten Beratung bei Color' }], testimonials: [
      { quote: 'Endlich eine Balayage, die nicht nach drei Wochen hart herauswächst.', author: 'Lena K.', meta: 'Color', rating: 5 },
      { quote: 'Der Schnitt fällt auch ohne langes Styling gut. Genau das wollte ich.', author: 'Miriam S.', meta: 'Cut', rating: 5 },
      { quote: 'Sehr klare Beratung und keine unnötigen Produkte aufgedrängt.', author: 'Sophie R.', meta: 'Care', rating: 5 },
    ] }, alt),
  ] },
  { slug: 'kontakt', title: 'Kontakt', sections: [
    hero('Schreiben Sie uns, was Sie vorhaben.', 'Für Schnitt, Farbe, Pflege oder Eventstyling: je konkreter die Anfrage, desto besser können wir Zeit und Team planen.', img.chair, { badgeText: 'Kontakt' }),
    section('locationContact', { badgeText: 'Kontakt & Standort', headline: 'Atelier Isabelle in München-Schwabing.', subline: 'Terminanfragen beantworten wir persönlich. Für Color-Termine hilft ein aktuelles Foto.', introText: 'Sie erreichen uns per Formular, Telefon oder WhatsApp. Bitte nennen Sie Wunschservice, Zeitfenster und falls möglich Ihre aktuelle Haarlänge.', image: img.salon, mapEmbedUrl: mapsEmbed, formEnabled: true, namePlaceholder: 'Name', emailPlaceholder: 'E-Mail', messagePlaceholder: 'Wunsch, Zeitraum oder Frage', submitLabel: 'Anfrage senden', infoCards: [{ icon: 'Phone', label: 'Telefon', value: phone }, { icon: 'Mail', label: 'E-Mail', value: email }, { icon: 'MapPin', label: 'Adresse', value: address }], primaryCta: { label: 'Anrufen', href: '/kontakt' }, secondaryCta: { label: 'Route planen', href: 'https://maps.google.com' } }, light),
    section('openingHours', { badgeText: 'Zeiten', headline: 'Öffnungszeiten & Terminlogik.', subline: 'Color- und Eventtermine planen wir bewusst mit mehr Puffer.', days: [{ label: 'Montag', hours: 'geschlossen', note: 'Ruhetag' }, { label: 'Dienstag-Freitag', hours: '10:00-19:00 Uhr', note: 'Termine nach Anfrage' }, { label: 'Samstag', hours: '9:00-15:00 Uhr', note: 'nur mit Termin' }], bookingNote: 'Für Balayage, Braut und größere Veränderungen bitte vorab anfragen.', ctaPrimary: { label: 'Termin anfragen', href: '/kontakt' } }, alt),
  ] },
  { slug: 'news', title: 'Salonjournal', sections: [
    hero('Notizen zu Haar, Farbe und Pflege.', 'Kurze Beiträge aus dem Salonalltag: verständlich, praktisch und ohne Produktpredigt.', img.product, { badgeText: 'Journal' }),
    section('newsGrid', { headline: 'Aktuelle Beiträge', subline: 'Gedanken zu Cut, Color, Care und Terminplanung.', collectionKey: 'news' }, light),
    cta('Sie haben eine konkrete Frage?', 'Schreiben Sie uns direkt. Wir helfen bei Einschätzung und Terminplanung.'),
  ] },
  { slug: 'impressum', title: 'Impressum', sections: [section('legalContent', { headline: 'Impressum', blocks: [{ title: 'Angaben gemäß § 5 TMG', content: 'Atelier Isabelle GmbH, Türkenstraße 68, 80799 München' }, { title: 'Kontakt', content: `${phone} · ${email}` }, { title: 'Vertretungsberechtigt', content: 'Geschäftsführung: Isabelle Berger' }, { title: 'Hinweis', content: 'Dies ist ein Demo-Tenant von Flamingo Media. Inhalte und Angaben dienen der Demonstration.' }] }, light)] },
  { slug: 'datenschutz', title: 'Datenschutz', sections: [section('legalContent', { headline: 'Datenschutzerklärung', blocks: [{ title: 'Verantwortlicher', content: 'Atelier Isabelle GmbH, Türkenstraße 68, 80799 München' }, { title: 'Kontaktformular', content: 'Formulardaten werden ausschließlich zur Bearbeitung der Anfrage genutzt.' }, { title: 'Hosting', content: 'Diese Demo wird technisch über Flamingo Media bereitgestellt.' }, { title: 'Rechte', content: 'Sie können Auskunft, Berichtigung oder Löschung Ihrer Daten verlangen.' }] }, light)] },
];

function detailHero(item, badgeText) {
  return section('collectionHero', { headline: item.title, subline: item.excerpt, badgeText, backgroundImage: item.image, bgImage: item.image, overlayColor: '#140D0C', overlayOpacity: 0.58, imageEffect: 'kenBurns', imageEffectIntensity: 'subtle' }, heroStyle);
}

function prefixDemoLinks(value) {
  if (Array.isArray(value)) return value.map(prefixDemoLinks);
  if (!value || typeof value !== 'object') return value;
  const copy = { ...value };
  for (const [key, child] of Object.entries(copy)) {
    if (key === 'href' && typeof child === 'string' && child.startsWith('/') && !child.startsWith('/demo/salon')) {
      copy[key] = `/demo/salon${child === '/' ? '' : child}`;
    } else {
      copy[key] = prefixDemoLinks(child);
    }
  }
  return copy;
}

function serviceSections(item) {
  return prefixDemoLinks([
    detailHero(item, 'Behandlung'),
    section('treatmentDetail', { badgeText: item.category, headline: item.title, subline: item.excerpt, treatments: [{ title: item.title, text: item.excerpt, image: item.image, durationLabel: item.durationLabel, priceLabel: item.priceLabel, resultLabel: item.category, steps: item.steps, careTips: item.careTips, cta: { label: 'Termin anfragen', href: '/kontakt' } }] }, light),
    section('freeText', { content: `<p>${item.excerpt}</p><p>Wir starten mit einer kurzen Beratung, prüfen Ausgangshaar und Ziel und erklären danach, welche Pflege zuhause sinnvoll ist.</p>` }, light),
    cta('Soll dieser Service zu Ihrem Haar passen?', 'Schicken Sie uns Wunsch, Zeitraum und gern ein aktuelles Foto.'),
  ]);
}

function lookSections(item) {
  return prefixDemoLinks([
    detailHero(item, 'Lookbook'),
    section('beforeAfter', { badgeText: item.category, headline: item.title, subline: item.excerpt, items: [{ title: item.title, text: item.excerpt, beforeImage: item.beforeImage, afterImage: item.afterImage, category: item.category, caption: 'Beratung, Umsetzung und Pflegehinweis inklusive.', cta: { label: 'Ähnlichen Look anfragen', href: '/kontakt' } }] }, light),
    section('freeText', { content: `<p>${item.excerpt}</p><p>Jeder Look wird an Ausgangston, Haarstruktur und Pflegebereitschaft angepasst. Das Ziel ist nicht eine Kopie, sondern ein Ergebnis, das zur Person passt.</p>` }, light),
    bookingCtaSection(),
  ]);
}

function newsSections(item) {
  return prefixDemoLinks([detailHero(item, 'Salonjournal'), section('freeText', { content: item.content }, light), cta('Noch eine Frage zu Ihrem Haar?', 'Wir antworten direkt und ohne Produktdruck.')]);
}

async function upsertPage(page, existingPages) {
  const existing = existingPages.find((p) => p.slug === page.slug) || (page.slug === 'looks' ? existingPages.find((p) => p.slug === 'referenzen') : null);
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
  for (const [index, item] of items.entries()) {
    await api('POST', `/api/v1/content/collections/${key}/items`, {
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt,
      published: true,
      priority: index,
      data: { image: item.image, author: 'Atelier Isabelle', date: '2026-06-04', sections: makeSections(item) },
    });
  }
}

async function main() {
  const pagesBefore = await api('GET', '/api/v1/content/pages');
  const collectionsBefore = await api('GET', '/api/v1/content/collections');
  const existingPages = pagesBefore.pages || [];

  await api('PUT', '/api/v1/content/style', { style: 'classic' });
  await api('PUT', '/api/v1/content/brand', { companyName: 'Atelier Isabelle', tagline: 'Hair Studio für Cut, Color und ruhige Beratung', primaryColor: colors.espresso, secondaryColor: colors.roseDeep, accentColor: colors.caramel, logo: '', logoDisplay: 'name', headingFont: 'Playfair Display', bodyFont: 'Inter', topBarColor: colors.espresso, footerColor: colors.espresso });
  await api('PUT', '/api/v1/content/design', { textPrimary: colors.ink, textSecondary: colors.soft, sectionBg: colors.cream, sectionBgAlt: colors.blush, cardBg: colors.card, cardBorder: colors.border, badgeBg: colors.blush, badgeText: colors.espresso, badgeBorder: colors.border, brand: colors.espresso, accent: colors.rose, heading: colors.ink, subheading: colors.soft, body: colors.soft, muted: colors.muted, icon: colors.roseDeep, btnBg: colors.espresso, btnText: colors.onDark, dividerColor: colors.border, eyebrow: colors.roseDeep, statValue: colors.espresso, quote: colors.ink, ratingStar: colors.caramel, check: colors.roseDeep, onDarkHeading: colors.onDark, onDarkBody: colors.onDarkSoft, onDarkMuted: '#D9BDB4' });
  await api('PUT', '/api/v1/content/contact', { phone, email, address, whatsappEnabled: true, whatsapp: '+498945239018', whatsappColor: colors.roseDeep });
  await api('PUT', '/api/v1/content/navigation', { items: navItems, cta: { label: 'Termin anfragen', href: '/kontakt' } });
  await api('PUT', '/api/v1/content/footer', { columns: [{ title: 'Services', items: [{ text: 'Behandlungen', href: '/behandlungen' }, { text: 'Preise', href: '/preise' }, { text: 'Looks', href: '/looks' }] }, { title: 'Atelier', items: [{ text: 'Team', href: '/team' }, { text: 'Über uns', href: '/ueber-uns' }, { text: 'Kontakt', href: '/kontakt' }] }, { title: 'Kontakt', items: [{ text: phone }, { text: email }, { text: address }] }], legalLinks: [{ label: 'Impressum', href: '/impressum' }, { label: 'Datenschutz', href: '/datenschutz' }], cta: { label: 'Termin anfragen', href: '/kontakt' } });
  await api('PUT', '/api/v1/content/opening-hours', { hours: [{ type: 'regular', day: 'Montag', closed: true, note: 'Ruhetag' }, { type: 'regular', day: 'Dienstag bis Freitag', hours: '10:00-19:00 Uhr' }, { type: 'regular', day: 'Samstag', hours: '9:00-15:00 Uhr' }, { type: 'regular', day: 'Sonntag', closed: true }] });
  await api('PUT', '/api/v1/content/form-fields', { fields: [{ name: 'name', label: 'Name', type: 'text', required: true, halfWidth: true }, { name: 'email', label: 'E-Mail', type: 'email', required: true, halfWidth: true }, { name: 'phone', label: 'Telefon', type: 'tel', halfWidth: true }, { name: 'topic', label: 'Wunsch', type: 'select', options: ['Schnitt & Styling', 'Balayage / Farbe', 'Pflege / Repair', 'Braut- oder Eventstyling', 'Sonstiges'], halfWidth: true }, { name: 'message', label: 'Nachricht', type: 'textarea', required: true }] });
  await api('PUT', '/api/v1/content/social-links', { instagram: 'https://instagram.com/atelierisabelle', facebook: 'https://facebook.com/atelierisabelle', google: 'https://maps.google.com' });
  await api('PUT', '/api/v1/content/seo', { titleTemplate: '%s · Atelier Isabelle München', defaultTitle: 'Atelier Isabelle · Hair Studio in München', defaultDescription: 'Atelier Isabelle in München: präzise Schnitte, natürliche Farben, Balayage, Pflege und Eventstyling mit ruhiger Beratung.', defaultOgImage: img.hero, canonicalBase: 'https://flamingo-renderer.vercel.app/demo/salon', locale: 'de_DE' });

  for (const page of pages) await upsertPage(page, existingPages);

  await clearCollectionItems('services', collectionsBefore);
  await clearCollectionItems('referenzen', collectionsBefore);
  await replaceCollectionItems('leistungen', 'Behandlungen', services, serviceSections, collectionsBefore);
  await replaceCollectionItems('looks', 'Looks', looks, lookSections, collectionsBefore);
  await replaceCollectionItems('news', 'Salonjournal', newsItems, newsSections, collectionsBefore);

  const pagesAfter = await api('GET', '/api/v1/content/pages');
  const meta = {
    '': ['Atelier Isabelle München', 'Hair Studio in München für präzise Schnitte, natürliche Farben, Balayage, Pflege und ruhige Beratung.'],
    behandlungen: ['Behandlungen', 'Cut, Color, Balayage, Pflege und Eventstyling im Atelier Isabelle München.'],
    preise: ['Preise', 'Transparente Richtpreise für Schnitt, Farbe, Balayage, Pflege und Eventstyling.'],
    looks: ['Looks', 'Lookbook mit ausgewählten Schnitten, Farben und Glossing-Ergebnissen aus dem Atelier Isabelle.'],
    team: ['Team', 'Das Team von Atelier Isabelle mit Fokus auf Cut, Color, Pflege und Eventstyling.'],
    'ueber-uns': ['Über uns', 'Atelier Isabelle in München: ruhige Beratung, präzises Handwerk und Looks für den Alltag.'],
    kontakt: ['Kontakt', 'Termin oder Beratung im Atelier Isabelle München anfragen.'],
    news: ['Salonjournal', 'Beiträge zu Schnitt, Balayage, Pflege und Terminplanung im Atelier Isabelle.'],
  };
  for (const page of pagesAfter.pages || []) {
    if (!meta[page.slug]) continue;
    await api('PUT', `/api/v1/content/seo/${page.id}`, { metaTitle: `${meta[page.slug][0]} · Atelier Isabelle`, metaDescription: meta[page.slug][1], ogImage: img.hero, noindex: false });
  }

  const publishResult = await api('POST', '/api/v1/content/publish', {});
  console.log(JSON.stringify({ ok: true, publishResult }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
