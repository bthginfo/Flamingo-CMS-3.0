const token = process.env.FLM_FITNESS_TOKEN;
if (!token) throw new Error('FLM_FITNESS_TOKEN is required');
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
  hero: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=2200&q=85',
  studio: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1800&q=85',
  weights: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1800&q=85',
  yoga: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=1800&q=85',
  hiit: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1800&q=85',
  pt: 'https://images.unsplash.com/photo-1599058917765-a780eda07a3e?w=1800&q=85',
  cardio: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=1800&q=85',
  functional: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=1800&q=85',
  sauna: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1800&q=85',
  trainer1: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=1200&q=85',
  trainer2: 'https://images.unsplash.com/photo-1542206395-9feb3edaa68d?w=1200&q=85',
  trainer3: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1200&q=85',
  trainer4: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&q=85',
  before: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1400&q=85',
  after: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=1400&q=85',
  community: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1800&q=85',
};

const colors = {
  ink: '#0F0A1A',
  soft: '#3D2B5A',
  muted: '#695A80',
  bg: '#0A0612',
  cream: '#F7F4FB',
  card: '#FFFFFF',
  border: '#E2D8EE',
  violet: '#9333EA',
  violetDeep: '#581C87',
  cyan: '#22D3EE',
  onDark: '#F7F4FB',
  onDarkSoft: '#C4B6D6',
  darkCard: '#1D1925',
};

const light = { sectionBg: colors.cream, cardBg: colors.card, cardBorder: colors.border, cardHeadingColor: colors.ink, cardBodyColor: colors.soft, cardMutedColor: colors.muted, heading: colors.ink, body: colors.soft, muted: colors.muted, icon: colors.violet, accentColor: colors.violet, btnBg: colors.violetDeep, btnText: colors.onDark, badgeBg: '#F3E8FF', badgeText: colors.violetDeep, borderColor: colors.border };
const alt = { ...light, sectionBg: '#F3E8FF', cardHeadingColor: colors.ink, cardBodyColor: colors.soft, cardMutedColor: colors.muted };
const dark = { sectionBg: colors.bg, cardBg: colors.darkCard, cardBorder: 'rgba(247,244,251,0.20)', cardHeadingColor: colors.onDark, cardBodyColor: colors.onDarkSoft, cardMutedColor: '#9D8FB0', heading: colors.onDark, body: colors.onDarkSoft, muted: '#9D8FB0', icon: colors.cyan, accentColor: colors.cyan, btnBg: colors.cyan, btnText: colors.bg, badgeBg: 'rgba(34,211,238,0.18)', badgeText: colors.cyan, borderColor: 'rgba(247,244,251,0.18)', onDarkHeading: colors.onDark, onDarkBody: colors.onDarkSoft, onDarkMuted: '#9D8FB0' };
const heroStyle = { ...dark, heroHeading: colors.onDark, heroBody: colors.onDarkSoft, badgeBg: 'rgba(34,211,238,0.20)', badgeText: colors.cyan, btnBg: colors.cyan, btnText: colors.bg };

const phone = '+49 89 7711 2233';
const email = 'hello@pulse-studio.de';
const address = 'Westendstraße 41, 80339 München';
const mapsEmbed = 'https://www.google.com/maps?q=Westendstra%C3%9Fe%2041%2C%2080339%20M%C3%BCnchen&output=embed';

const navItems = [
  { label: 'Startseite', href: '/', type: 'link' },
  { label: 'Programme', href: '/programme', type: 'link' },
  { label: 'Kursplan', href: '/kursplan', type: 'link' },
  { label: 'Coaching', href: '/coaching', type: 'link' },
  { label: 'Trainer', href: '/trainer', type: 'link' },
  { label: 'Mitgliedschaften', href: '/mitgliedschaften', type: 'link' },
  { label: 'Kontakt', href: '/kontakt', type: 'link' },
];

const programs = [
  { title: 'Functional Strength', slug: 'functional-strength', excerpt: 'Krafttraining mit Fokus auf Bewegung, Stabilität und Alltagstauglichkeit.', image: img.functional, durationLabel: '60 Min.', priceLabel: 'enthalten' },
  { title: 'HIIT Express', slug: 'hiit-express', excerpt: 'Hochintensive 30-Minuten-Einheiten für volle Wochen.', image: img.hiit, durationLabel: '30 Min.', priceLabel: 'enthalten' },
  { title: 'Yoga Flow', slug: 'yoga-flow', excerpt: 'Beweglichkeit, Atmung und Erholung — drei Level pro Woche.', image: img.yoga, durationLabel: '60 Min.', priceLabel: 'enthalten' },
  { title: 'Personal Training', slug: 'personal-training', excerpt: '1:1-Coaching mit Plan, Test und ehrlichem Feedback.', image: img.pt, durationLabel: '60 Min.', priceLabel: 'ab 89 €' },
];

const newsItems = [
  { title: 'Warum 3x pro Woche besser ist als jeden Tag', slug: 'frequenz-statt-volumen', excerpt: 'Wie wir Trainingsfrequenz im Coaching planen.', image: img.weights, content: '<p>Mehr ist nicht automatisch besser. Wer dreimal pro Woche fokussiert trainiert und dazwischen regeneriert, sieht meistens schneller Fortschritt als jemand, der täglich ans Limit geht.</p><p>Im Coaching arbeiten wir mit Frequenzplänen, die zum echten Wochenrhythmus passen — nicht zur Idealwoche.</p>' },
  { title: 'Mythos Bauchmuskeltraining', slug: 'mythos-bauch', excerpt: 'Warum tausend Sit-ups nicht das Sixpack bringen.', image: img.functional, content: '<p>Sichtbare Bauchmuskeln entstehen nicht durch Crunches, sondern durch eine Kombination aus Ganzkörperkraft und niedrigem Körperfett.</p><p>Wir trainieren den Rumpf funktional — als Stabilisator, nicht als kosmetisches Detail.</p>' },
  { title: 'Was unsere Probetraining-Phase verändert hat', slug: 'probetraining-phase', excerpt: 'Wie wir Probetrainings umgestellt haben.', image: img.studio, content: '<p>Früher war das Probetraining ein Verkaufstermin. Heute ist es ein echtes Workout mit Plan und ehrlicher Empfehlung.</p><p>Das Ergebnis: weniger Mitglieder, die nach drei Monaten wieder gehen — und mehr, die wirklich dranbleiben.</p>' },
];

function hero(headline, subline, image, extra = {}) {
  return section('fitnessHero', {
    eyebrow: extra.eyebrow || 'Pulse Studio München',
    headline, subline, image, bgImage: image,
    glowColor: 'rgba(34,211,238,0.42)',
    overlay: 'rgba(10,6,18,0.65)',
    primaryCta: extra.primaryCta || { label: 'Probetraining buchen', href: '/kontakt' },
    secondaryCta: extra.secondaryCta || { label: 'Kursplan ansehen', href: '/kursplan' },
    facts: extra.facts || [
      { value: '24/7', label: 'für Mitglieder geöffnet' },
      { value: '40+', label: 'Kurse pro Woche' },
      { value: '1:1', label: 'Personal Coaching' },
    ],
  }, heroStyle);
}

function programGrid() {
  return section('programGrid', {
    badgeText: 'Programme',
    headline: 'Worauf du bei uns trainieren kannst.',
    subline: 'Vier Trainingsformate — kombinierbar, klar strukturiert, immer mit Anleitung.',
    items: programs.map(p => ({ title: p.title, text: p.excerpt, image: p.image, icon: 'Dumbbell', cta: { label: 'Mehr erfahren', href: `/c/programme/${p.slug}` } })),
  }, light);
}

function courseSchedule() {
  return section('courseSchedule', {
    badge: 'Kursplan',
    headline: 'Beispielwoche im Studio.',
    subline: 'Aktuelle Termine findest du im Mitgliederbereich. Hier siehst du, wie eine typische Woche aussieht.',
    entries: [
      { year: 'Mo', title: 'HIIT Express · 06:30 / 18:00', text: 'Coach Mara · Level 2-3 · 30 Min.' },
      { year: 'Di', title: 'Yoga Flow · 08:00 / 19:00', text: 'Coach Lena · alle Level · 60 Min.' },
      { year: 'Mi', title: 'Functional Strength · 07:00 / 18:30', text: 'Coach Tobias · Level 2 · 60 Min.' },
      { year: 'Do', title: 'Mobility & Recovery · 12:00 / 19:30', text: 'Coach Lena · alle Level · 45 Min.' },
      { year: 'Fr', title: 'Strength Heavy · 17:00 / 18:30', text: 'Coach Tobias · Level 3 · 60 Min.' },
      { year: 'Sa', title: 'Community WOD · 10:00', text: 'Team · alle Level · 60 Min.' },
    ],
  }, alt);
}

function trainerProfiles() {
  return section('trainerProfiles', {
    badgeText: 'Trainer',
    headline: 'Coaches, die zuhören.',
    subline: 'Vier Trainer mit unterschiedlichen Schwerpunkten — jeder mit fundierter Ausbildung.',
    members: [
      { name: 'Tobias', role: 'Head Coach · Kraft & Functional', bio: 'Sportwissenschaftler mit 12 Jahren Erfahrung in Kraft- und Athletiktraining.', image: img.trainer1 },
      { name: 'Mara', role: 'HIIT & Cardio Specialist', bio: 'Ehemalige Leichtathletin, Spezialistin für hochintensives Intervalltraining.', image: img.trainer2 },
      { name: 'Lena', role: 'Yoga & Mobility', bio: 'Yogalehrerin (E-RYT 500) und Mobility-Coach für Athleten.', image: img.trainer3 },
      { name: 'Jonas', role: 'Personal Coach & Ernährung', bio: 'Personal Trainer mit Fokus auf Ernährung und nachhaltigem Krafttraining.', image: img.trainer4 },
    ],
  }, light);
}

function membershipPlans() {
  return section('membershipPlans', {
    anchorId: 'tarife',
    badge: 'Mitgliedschaften',
    headline: 'Faire Pakete ohne Stolperfallen.',
    subline: 'Monatlich kündbar, keine Aufnahmegebühr, keine Mindestlaufzeit-Tricks.',
    plans: [
      { name: 'Flex', price: '49 € / Monat', features: ['Zugang Mo-Fr 06:30-22:00', '4 Kurse pro Monat', 'Mitgliederbereich', 'Cardio & Kraft'], missing: ['Wochenendzugang', '24/7-Zutritt', 'Sauna'], ctaLabel: 'Flex starten', ctaHref: '/kontakt' },
      { name: 'Studio', price: '79 € / Monat', features: ['24/7-Zugang', 'Unbegrenzte Kurse', 'Sauna & Wellness', 'Mobility Sessions', 'Trainingsplan'], missing: ['Personal Training'], ctaLabel: 'Studio starten', ctaHref: '/kontakt', highlighted: true, note: 'Empfehlung' },
      { name: 'Coach', price: '149 € / Monat', features: ['Alles aus Studio', '2x Personal Training / Monat', 'Ernährungsplan', 'Individueller Coach', 'Premium Support'], missing: [], ctaLabel: 'Coach starten', ctaHref: '/kontakt' },
    ],
  }, light);
}

function trialSessionCta() {
  return section('trialSessionCta', {
    badge: 'Probetraining',
    headline: 'Komm einmal vorbei — ohne Vertrag, ohne Drama.',
    subline: 'Wir machen ein echtes Workout, schauen wo du stehst und geben ehrliche Empfehlung. Kein Verkaufsgespräch.',
    image: img.studio,
    overlay: 'rgba(10,6,18,0.6)',
    metrics: [{ value: '60 Min.', label: 'Probetraining' }, { value: 'gratis', label: 'für Neukunden' }, { value: '0 €', label: 'Aufnahmegebühr' }],
    primaryCta: { label: 'Probetraining anfragen', href: '/kontakt', icon: 'Calendar' },
    secondaryCta: { label: 'Mitgliedschaften', href: '/mitgliedschaften', icon: 'List' },
  }, dark);
}

function transformationStories() {
  return section('transformationStories', {
    badge: 'Transformation',
    headline: 'Eine Geschichte, die zeigt was möglich ist.',
    problem: 'Markus, 41, kam zu uns nach Jahren Rückenschmerzen und 12 kg Übergewicht. Frustriert von Pauschalprogrammen und unwirksamen Anleitungen.',
    solution: 'Wir haben mit Bewegungsanalyse begonnen, einen Aufbauplan über 6 Monate erstellt und Krafttraining mit Mobility kombiniert. Personal Training 1x pro Woche, eigenständig 2x.',
    result: 'Nach 9 Monaten: keine Rückenschmerzen mehr, 8 kg Gewichtsverlust, Kreuzheben mit eigenem Körpergewicht — und vor allem wieder Spaß an Bewegung.',
    beforeImage: img.before,
    afterImage: img.after,
    points: [
      { label: 'Dauer', value: '9 Monate' },
      { label: 'Coaching', value: '1x pro Woche' },
      { label: 'Eigenständig', value: '2x pro Woche' },
      { label: 'Ergebnis', value: 'schmerzfrei + 8 kg' },
    ],
    cta: { label: 'Eigene Geschichte starten', href: '/kontakt' },
  }, light);
}

function studioAmenities() {
  return section('studioAmenities', {
    badge: 'Ausstattung',
    headline: 'Was du im Studio findest.',
    subline: 'Premium-Equipment, viel Platz, ruhige Atmosphäre.',
    cards: [
      { title: 'Krafttraining', description: 'Komplette Power-Racks, Hantelbank, Kettlebells bis 48 kg.', icon: 'Dumbbell', image: img.weights, size: 'large' },
      { title: 'Cardio-Zone', description: 'Concept2-Ruderer, Assault Bikes, Skiergs, Laufbänder.', icon: 'Activity', image: img.cardio },
      { title: 'Functional Area', description: '200m² für Functional, Stretching, Mobility.', icon: 'Move', image: img.functional },
      { title: 'Yoga Studio', description: 'Eigener ruhiger Raum mit Holzboden und Wandheizung.', icon: 'Sparkles', image: img.yoga },
      { title: 'Sauna & Dusche', description: 'Finnische Sauna, große Duschen, Spinde inklusive.', icon: 'Droplets', image: img.sauna },
      { title: '24/7-Zutritt', description: 'Mitglieder im Studio- und Coach-Tarif kommen rund um die Uhr.', icon: 'Clock' },
    ],
  }, alt);
}

function ctaBanner(headline, subline, primaryLabel = 'Probetraining buchen') {
  return section('immersiveCtaBanner', {
    badge: 'Starten',
    headline, subline,
    image: img.community,
    overlay: 'rgba(10,6,18,0.65)',
    metrics: [{ value: '1.200+', label: 'aktive Mitglieder' }, { value: '4,9/5', label: 'Bewertung' }, { value: '40+', label: 'Kurse / Woche' }],
    primaryCta: { label: primaryLabel, href: '/kontakt', icon: 'Calendar' },
    secondaryCta: { label: 'Mitgliedschaften', href: '/mitgliedschaften', icon: 'List' },
  }, dark);
}

const pages = [
  { slug: '', title: 'Startseite', sections: [
    hero('Training, das wirklich zum Alltag passt.', 'Pulse Studio ist ein modernes Fitnessstudio in München für Kraft, Kurse und Personal Coaching mit Plan.', img.hero, { primaryCta: { label: 'Studio ausprobieren', href: '/kontakt' } }),
    section('uspStrip', { items: [
      { icon: 'Clock', title: '24/7-Zugang', text: 'für Mitglieder' },
      { icon: 'Users', title: 'Kleine Kurse', text: 'maximal 12 Plätze' },
      { icon: 'Dumbbell', title: 'Premium-Equipment', text: 'Concept2, Eleiko & Co.' },
      { icon: 'Heart', title: 'Coaches', text: 'mit echter Ausbildung' },
    ] }, light),
    programGrid(),
    studioAmenities(),
    courseSchedule(),
    trainerProfiles(),
    transformationStories(),
    membershipPlans(),
    section('newsPreview', { headline: 'Trainings-Tipps', subline: 'Aus dem Studio-Magazin.', linkLabel: 'Alle Beiträge', linkIcon: 'ArrowRight', collectionKey: 'news' }, alt),
    trialSessionCta(),
  ] },
  { slug: 'programme', title: 'Programme', sections: [
    section('editorialHero', { eyebrow: 'Programme', headline: 'Programme für jedes Ziel.', text: '<p>Krafttraining, HIIT, Yoga und Personal Coaching — kombinierbar, modular, mit Plan.</p>', imagePrimary: img.weights, primaryCta: { label: 'Probetraining', href: '/kontakt' }, secondaryCta: { label: 'Kursplan', href: '/kursplan' } }),
    programGrid(),
    section('processSteps', { badgeText: 'So startest du', headline: 'Vier Schritte zum ersten Workout.', steps: [
      { title: '1. Anfragen', text: 'Per Formular oder WhatsApp — wir antworten innerhalb 24 Std.' },
      { title: '2. Probetraining', text: '60 Min. mit Coach — wir machen eine echte Einheit.' },
      { title: '3. Plan & Tarif', text: 'Gemeinsam wählen wir Tarif und Trainingsfrequenz.' },
      { title: '4. Loslegen', text: 'Mitgliedskarte, App-Zugang, fertig.' },
    ] }, light),
    section('collectionList', { headline: 'Alle Programme', subline: 'Hier findest du Details zu jedem Programm.', collectionKey: 'programme', ctaLabel: 'Details ansehen' }, alt),
    ctaBanner('Bereit für das erste Workout?', 'Wir machen es dir leicht — Probetraining ohne Verpflichtung.', 'Erstes Workout planen'),
  ] },
  { slug: 'kursplan', title: 'Kursplan', sections: [
    section('cinematicHero', { eyebrow: 'Kursplan', headline: 'Über 40 Kurse pro Woche.', subline: 'Vom frühen HIIT bis zum späten Yoga — sechs Tage die Woche.', image: img.hiit, overlay: 'rgba(10,6,18,0.62)', align: 'left', primaryCta: { label: 'Kurs reservieren', href: '/kontakt' }, facts: [ { value: '40+', label: 'Kurse pro Woche' }, { value: '6', label: 'Tage geöffnet' }, { value: '4', label: 'Coaches' } ] }),
    courseSchedule(),
    section('textImage', { badgeText: 'Buchung', headline: 'So buchst du Kurse.', subline: 'In der Pulse-App, in der Member-Lounge oder vor Ort.', text: '<p>Kurse buchst du über unsere App oder im Studio. Plätze sind 14 Tage im Voraus freigeschaltet.</p><p>Bei Wartelisten bekommst du automatisch Bescheid, sobald ein Platz frei wird. Stornieren ohne Gebühr bis 4 Stunden vorher.</p>', image: img.community, primaryCta: { label: 'App-Zugang anfragen', href: '/kontakt' } }, light),
    section('faq', { headline: 'Häufige Fragen', items: [
      { q: 'Brauche ich Vorkenntnisse?', a: 'Nein. Jeder Kurs hat ein angegebenes Level — von Anfänger bis Fortgeschritten.' },
      { q: 'Was passiert wenn ein Kurs voll ist?', a: 'Du kommst auf die Warteliste und wirst automatisch benachrichtigt.' },
      { q: 'Kann ich kurzfristig stornieren?', a: 'Ja, bis 4 Stunden vor Kursbeginn ohne Gebühr.' },
    ] }, alt),
  ] },
  { slug: 'coaching', title: 'Coaching', sections: [
    section('editorialHero', { eyebrow: 'Coaching', headline: '1:1-Coaching mit echtem Plan.', text: '<p>Personal Training, Ernährungsberatung und nachhaltige Trainingsplanung — kein Bootcamp-Drama.</p>', imagePrimary: img.pt, primaryCta: { label: 'Beratung anfragen', href: '/kontakt' }, secondaryCta: { label: 'Trainer ansehen', href: '/trainer' } }),
    transformationStories(),
    section('servicesGrid', { headline: 'Was Coaching beinhaltet', manualCards: [
      { icon: 'Activity', title: 'Bewegungsanalyse', text: 'Wir prüfen Haltung, Bewegungsmuster und mögliche Einschränkungen.' },
      { icon: 'Target', title: 'Zielklärung', text: 'Realistische Ziele mit klarem Zeitrahmen, kein "in 8 Wochen alles".' },
      { icon: 'Calendar', title: 'Wochenplan', text: 'Plan für Training, Mobility und Regeneration — abgestimmt auf deine Realität.' },
      { icon: 'Utensils', title: 'Ernährung', text: 'Auf Wunsch Empfehlung mit echten Lebensmitteln statt Pulvern.' },
      { icon: 'TrendingUp', title: 'Reviews', text: 'Alle 4 Wochen Check-in mit Anpassung.' },
      { icon: 'MessageCircle', title: 'WhatsApp-Support', text: 'Direkter Draht zum Coach an Trainingstagen.' },
    ] }, light),
    ctaBanner('Soll ein Coach dich begleiten?', 'Wir starten mit einem unverbindlichen Erstgespräch.', 'Erstgespräch anfragen'),
  ] },
  { slug: 'trainer', title: 'Trainer', sections: [
    hero('Coaches, die wissen was sie tun.', 'Vier ausgebildete Trainer mit unterschiedlichen Schwerpunkten.', img.trainer1, { eyebrow: 'Team', primaryCta: { label: 'Probetraining', href: '/kontakt' }, secondaryCta: { label: 'Coaching', href: '/coaching' } }),
    trainerProfiles(),
    section('testimonials', { headline: 'Mitglieder über unsere Coaches.', items: [
      { quote: 'Tobias erklärt jede Übung so, dass ich sie wirklich verstehe — nicht nur ausführe.', author: 'Sandra M.', meta: 'Mitglied seit 2024', rating: 5 },
      { quote: 'Lena hat meine Yoga-Praxis grundlegend verändert. Endlich kein Geheimnis mehr.', author: 'Daniel K.', meta: 'Mitglied seit 2023', rating: 5 },
      { quote: 'Mara macht HIIT erträglich. Und macht aus jeder Einheit eine Story.', author: 'Lisa P.', meta: 'Mitglied seit 2025', rating: 5 },
    ] }, alt),
  ] },
  { slug: 'mitgliedschaften', title: 'Mitgliedschaften', sections: [
    section('editorialHero', { eyebrow: 'Mitgliedschaft', headline: 'Faire Preise, klare Bedingungen.', text: '<p>Drei Tarife — monatlich kündbar, keine Aufnahmegebühr.</p>', imagePrimary: img.studio, primaryCta: { label: 'Tarif wählen', href: '#tarife' }, hint: 'Monatlich kündbar · keine Aufnahmegebühr' }),
    membershipPlans(),
    section('faq', { headline: 'Häufige Fragen zur Mitgliedschaft', items: [
      { q: 'Gibt es eine Mindestlaufzeit?', a: 'Nein. Alle Tarife sind monatlich kündbar.' },
      { q: 'Was kostet die Aufnahme?', a: '0 €. Wir verlangen keine Aufnahmegebühr.' },
      { q: 'Kann ich pausieren?', a: 'Ja, bis zu 3 Monate pro Jahr — z. B. bei Urlaub oder Verletzung.' },
      { q: 'Kann ich Tarife wechseln?', a: 'Ja, monatlich. Up- oder Downgrade ohne Gebühr.' },
    ] }, alt),
    ctaBanner('Noch unsicher welcher Tarif?', 'Wir empfehlen den passenden Tarif nach dem Probetraining.', 'Tarif im Training testen'),
  ] },
  { slug: 'kontakt', title: 'Kontakt', sections: [
    section('editorialHero', { eyebrow: 'Kontakt', headline: 'Schreib uns — wir antworten persönlich.', text: '<p>Per Formular, WhatsApp oder Telefon. Kein Chatbot, kein Verkaufsdruck.</p>', imagePrimary: img.studio, primaryCta: { label: 'Nachricht senden', href: '#form' } }),
    section('contact', { anchorId: 'form', badgeText: 'Kontaktformular', headline: 'Probetraining oder Anfrage.', subline: 'Wir melden uns innerhalb eines Werktags.', namePlaceholder: 'Name', emailPlaceholder: 'E-Mail', phonePlaceholder: 'Telefon (optional)', messagePlaceholder: 'Wunsch oder Frage', submitLabel: 'Anfrage senden', infoCards: [{ icon: 'Phone', label: 'Telefon', value: phone }, { icon: 'Mail', label: 'E-Mail', value: email }, { icon: 'MapPin', label: 'Adresse', value: address }] }, light),
    section('map', { headline: 'Mitten im Westend', mapEmbedUrl: mapsEmbed }, alt),
    section('openingHours', { headline: 'Öffnungszeiten', days: [{ label: 'Mo - Fr', hours: '06:30-22:00' }, { label: 'Sa - So', hours: '08:00-18:00' }, { label: '24/7', hours: 'für Studio- & Coach-Mitglieder' }] }, light),
  ] },
  { slug: 'news', title: 'Studio Magazin', sections: [
    hero('Trainings-Tipps und Studio-News.', 'Beiträge zu Krafttraining, Mobility, Ernährung und Coaching.', img.weights, { eyebrow: 'Magazin', primaryCta: { label: 'Studio kennenlernen', href: '/kontakt' } }),
    section('newsGrid', { headline: 'Aktuelle Beiträge', subline: 'Aus dem Pulse-Magazin.', collectionKey: 'news' }, light),
    ctaBanner('Bereit selbst zu starten?', 'Probetraining gratis und unverbindlich.', 'Gratis-Session sichern'),
  ] },
  { slug: 'impressum', title: 'Impressum', sections: [section('legalContent', { headline: 'Impressum', blocks: [{ title: 'Angaben gemäß § 5 TMG', content: 'Pulse Studio GmbH, Westendstraße 41, 80339 München' }, { title: 'Kontakt', content: `${phone} · ${email}` }, { title: 'Geschäftsführung', content: 'Tobias Berger, Mara Schreiner' }, { title: 'Hinweis', content: 'Dies ist ein Demo-Tenant von Flamingo Media.' }] }, light)] },
  { slug: 'datenschutz', title: 'Datenschutz', sections: [section('legalContent', { headline: 'Datenschutzerklärung', blocks: [{ title: 'Verantwortlicher', content: 'Pulse Studio GmbH, Westendstraße 41, 80339 München' }, { title: 'Kontaktformular', content: 'Formulardaten dienen nur der Bearbeitung der Anfrage.' }, { title: 'Hosting', content: 'Diese Demo läuft technisch auf Flamingo Media.' }, { title: 'Rechte', content: 'Du kannst Auskunft, Berichtigung oder Löschung verlangen.' }] }, light)] },
];

const PAGE_SEO = {
  '': { metaTitle: 'Fitnessstudio und Personal Coaching in München', metaDescription: 'Pulse Studio im Münchner Westend verbindet Krafttraining, Kurse und Personal Coaching mit klaren Plänen und kleinen Gruppen.' },
  programme: { metaTitle: 'Trainingsprogramme im Pulse Studio München', metaDescription: 'Functional Strength, HIIT, Yoga und Personal Training im Pulse Studio – mit Dauer, Level und klarem Trainingsziel.' },
  kursplan: { metaTitle: 'Kursplan des Pulse Studio München', metaDescription: 'Aktueller Wochenplan für Kraft, HIIT, Yoga und Mobility im Pulse Studio München-Westend.' },
  coaching: { metaTitle: 'Personal Training und Coaching in München', metaDescription: 'Individuelles Personal Training mit Standortcheck, Trainingsplan und regelmäßiger Anpassung im Pulse Studio München.' },
  trainer: { metaTitle: 'Trainer und Coaches im Pulse Studio', metaDescription: 'Lernen Sie die Coaches für Kraft, HIIT, Yoga, Mobility und Ernährung im Pulse Studio München kennen.' },
  mitgliedschaften: { metaTitle: 'Mitgliedschaften und Preise im Pulse Studio', metaDescription: 'Flexible Mitgliedschaften ohne Aufnahmegebühr: Tarife, Leistungen und Bedingungen des Pulse Studio München im Vergleich.' },
  kontakt: { metaTitle: 'Probetraining im Pulse Studio anfragen', metaDescription: 'Kontakt, Öffnungszeiten und Anfrage für ein Probetraining im Pulse Studio München-Westend.' },
  news: { metaTitle: 'Pulse Studio Magazin für Training und Regeneration', metaDescription: 'Trainingswissen und Studio-Notizen zu Kraft, Mobility, Regeneration und nachhaltigem Coaching.' },
  impressum: { metaTitle: 'Impressum | Pulse Studio', metaDescription: 'Impressum und Anbieterinformationen der Pulse Studio GmbH in München.' },
  datenschutz: { metaTitle: 'Datenschutz | Pulse Studio', metaDescription: 'Datenschutzhinweise des Pulse Studio zu Probetraining, Kontaktanfragen und technischer Bereitstellung.' },
};

for (const page of pages) page.seo = PAGE_SEO[page.slug];

function detailHero(item, badgeText) {
  return section('collectionHero', { headline: item.title, subline: item.excerpt, badgeText, backgroundImage: item.image, bgImage: item.image, overlayColor: '#0A0612', overlayOpacity: 0.6, imageEffect: 'kenBurns', imageEffectIntensity: 'subtle' }, heroStyle);
}

function prefixDemoLinks(value) {
  if (Array.isArray(value)) return value.map(prefixDemoLinks);
  if (!value || typeof value !== 'object') return value;
  const copy = { ...value };
  for (const [key, child] of Object.entries(copy)) {
    if (key === 'href' && typeof child === 'string' && child.startsWith('/') && !child.startsWith('/demo/fitness') && !child.startsWith('http')) {
      copy[key] = `/demo/fitness${child === '/' ? '' : child}`;
    } else copy[key] = prefixDemoLinks(child);
  }
  return copy;
}

function programSections(item) {
  return prefixDemoLinks([
    detailHero(item, 'Programm'),
    section('textImage', { headline: item.title, subline: item.excerpt, text: `<p>${item.excerpt}</p><p>Dauer: ${item.durationLabel}. Inkl. in allen Mitgliedschaften außer Personal Training.</p>`, image: item.image, primaryCta: { label: `${item.title} ausprobieren`, href: '/kontakt' } }, light),
    section('uspStrip', { items: [
      { icon: 'Users', title: 'Kleine Gruppen', text: 'max. 12 Plätze' },
      { icon: 'Award', title: 'Ausgebildet', text: 'Sportwissenschaft' },
      { icon: 'Heart', title: 'Alle Level', text: 'wir holen dich ab' },
    ] }, alt),
    section('immersiveCtaBanner', { badge: 'Programm starten', headline: `Probetraining für ${item.title}.`, subline: 'Komm vorbei, probiere es aus — ohne Verpflichtung.', image: item.image, overlay: 'rgba(10,6,18,0.6)', primaryCta: { label: `${item.title} testen`, href: '/kontakt' } }, dark),
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
      data: { image: item.image, author: 'Pulse Studio', date: '2026-04-22', sections: makeSections(item) },
    });
  }
}

async function main() {
  const pagesBefore = await api('GET', '/api/v1/content/pages');
  const collectionsBefore = await api('GET', '/api/v1/content/collections');
  const existingPages = pagesBefore.pages || [];

  await api('PUT', '/api/v1/content/style', { style: 'classic' });
  await api('PUT', '/api/v1/content/brand', { companyName: 'Pulse Studio', tagline: 'Training, Kurse & Personal Coaching', primaryColor: colors.violet, secondaryColor: colors.violetDeep, accentColor: colors.cyan, logoDisplay: 'name', headingFont: 'Outfit', bodyFont: 'Inter', topBarColor: colors.bg, footerColor: colors.bg });
  await api('PUT', '/api/v1/content/design', { textPrimary: colors.ink, textSecondary: colors.soft, sectionBg: colors.cream, sectionBgAlt: '#F3E8FF', cardBg: colors.card, cardBorder: colors.border, badgeBg: '#F3E8FF', badgeText: colors.violetDeep, brand: colors.violet, accent: colors.cyan, heading: colors.ink, body: colors.soft, muted: colors.muted, icon: colors.violet, btnBg: colors.violetDeep, btnText: colors.onDark, eyebrow: colors.cyan, statValue: colors.violet, quote: colors.ink, ratingStar: colors.cyan, check: colors.violet, onDarkHeading: colors.onDark, onDarkBody: colors.onDarkSoft, onDarkMuted: '#9D8FB0' });
  await api('PUT', '/api/v1/content/contact', { phone, email, address, whatsappEnabled: true, whatsapp: '+498977112233', whatsappColor: colors.violet });
  await api('PUT', '/api/v1/content/seo', {
    titleTemplate: '%s | Pulse Studio München',
    defaultTitle: 'Pulse Studio – Fitness & Coaching in München',
    defaultDescription: 'Krafttraining, Kurse und Personal Coaching im Pulse Studio München-Westend – mit klaren Plänen, kleinen Gruppen und Probetraining.',
    defaultOgImage: img.hero,
    locale: 'de_DE',
  });
  await api('PUT', '/api/v1/content/navigation', { items: navItems, cta: { label: 'Probetraining buchen', href: '/kontakt' } });
  await api('PUT', '/api/v1/content/footer', { columns: [
    { title: 'Training', items: [{ text: 'Programme', href: '/programme' }, { text: 'Kursplan', href: '/kursplan' }, { text: 'Coaching', href: '/coaching' }] },
    { title: 'Studio', items: [{ text: 'Trainer', href: '/trainer' }, { text: 'Mitgliedschaften', href: '/mitgliedschaften' }, { text: 'Magazin', href: '/news' }] },
    { title: 'Kontakt', items: [{ text: phone }, { text: email }, { text: address }] },
  ], legalLinks: [{ label: 'Impressum', href: '/impressum' }, { label: 'Datenschutz', href: '/datenschutz' }], cta: { label: 'Probetraining buchen', href: '/kontakt' } });
  await api('PUT', '/api/v1/content/opening-hours', { hours: [
    { type: 'regular', day: 'Mo - Fr', hours: '06:30-22:00' },
    { type: 'regular', day: 'Sa - So', hours: '08:00-18:00' },
    { type: 'regular', day: '24/7', hours: 'für Studio- & Coach-Mitglieder' },
  ] });

  for (const page of pages) {
    await upsertPage(page, existingPages);
    console.log('Page:', page.slug || '(home)');
  }

  await replaceCollectionItems('programme', 'Programme', programs, programSections, collectionsBefore.collections || []);
  await replaceCollectionItems('news', 'Studio Magazin', newsItems, newsSections, collectionsBefore.collections || []);

  await api('POST', '/api/v1/content/publish', {});
  console.log('Done. Published.');
}

main().catch((err) => { console.error(err); process.exit(1); });
