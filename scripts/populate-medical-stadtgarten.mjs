const token = process.env.FLM_MEDICAL_TOKEN || 'flm_pat_32a67a176cba5748b9d20d6f86dbf620ae04d9eda10093e0efec433ae1b8ac09';
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
  hero: 'https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=2200&q=85',
  reception: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1800&q=85',
  doctor: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1600&q=85',
  consultation: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1800&q=85',
  diagnostics: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=1800&q=85',
  team: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=1800&q=85',
  waiting: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=1800&q=85',
  lab: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=1600&q=85',
  prevention: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1600&q=85',
  vaccine: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=1600&q=85',
  checkup: 'https://images.unsplash.com/photo-1588776813677-77aaf5595b83?w=1600&q=85',
  acute: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1600&q=85',
  ultrasound: 'https://images.unsplash.com/photo-1588776814546-ec7f1f7f7933?w=1600&q=85',
};

const colors = {
  ink: '#102326',
  soft: '#5A6B6D',
  muted: '#758484',
  cream: '#F7F8F4',
  alt: '#EEF4EF',
  card: '#FFFFFF',
  border: '#D9E4DF',
  teal: '#1F7A74',
  tealDeep: '#0B3437',
  tealSoft: '#DDEEEA',
  sand: '#D9A441',
  sandSoft: '#F4E7C6',
  red: '#B4232D',
  onDark: '#FFFFFF',
  onDarkBody: '#EAF3F1',
  onDarkMuted: '#C8DAD6',
};

const light = {
  sectionBg: colors.cream,
  cardBg: colors.card,
  cardBorder: colors.border,
  heading: colors.ink,
  subheading: colors.soft,
  body: colors.soft,
  muted: colors.muted,
  icon: colors.teal,
  accentColor: colors.teal,
  btnBg: colors.teal,
  btnText: colors.onDark,
  badgeBg: colors.tealSoft,
  badgeText: colors.tealDeep,
  badgeBorder: colors.border,
  borderColor: colors.border,
  eyebrow: colors.teal,
  statValue: colors.teal,
  check: colors.teal,
};

const alt = { ...light, sectionBg: colors.alt, cardBg: '#FCFEFB' };

const dark = {
  sectionBg: colors.tealDeep,
  cardBg: 'rgba(255,255,255,0.11)',
  cardBorder: 'rgba(255,255,255,0.22)',
  heading: colors.onDark,
  subheading: colors.onDarkBody,
  body: colors.onDarkBody,
  muted: colors.onDarkMuted,
  icon: colors.sandSoft,
  accentColor: colors.sandSoft,
  btnBg: colors.sandSoft,
  btnText: colors.tealDeep,
  badgeBg: 'rgba(255,255,255,0.14)',
  badgeText: colors.onDark,
  badgeBorder: 'rgba(255,255,255,0.24)',
  borderColor: 'rgba(255,255,255,0.22)',
  onDarkHeading: colors.onDark,
  onDarkBody: colors.onDarkBody,
  onDarkMuted: colors.onDarkMuted,
};

const heroStyle = {
  ...dark,
  sectionBg: colors.tealDeep,
  heading: colors.onDark,
  body: colors.onDarkBody,
  muted: colors.onDarkMuted,
  btnBg: colors.sandSoft,
  btnText: colors.tealDeep,
  onDarkHeading: colors.onDark,
  onDarkBody: colors.onDarkBody,
  onDarkMuted: colors.onDarkMuted,
};

const phone = '+49 89 452 19 80';
const email = 'kontakt@praxis-stadtgarten.de';
const address = 'Stadtgartenstraße 18, 80331 München';
const mapsEmbed = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2658.0!2d11.575!3d48.137!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zTcO8bmNoZW4!5e0!3m2!1sde!2sde!4v1710000000000';

const navItems = [
  { label: 'Startseite', href: '/', type: 'link' },
  { label: 'Leistungen', href: '/leistungen', type: 'link' },
  { label: 'Termine', href: '/termine', type: 'link' },
  { label: 'Team', href: '/team', type: 'link' },
  { label: 'Praxis', href: '/praxis', type: 'link' },
  { label: 'Ratgeber', href: '/news', type: 'link' },
  { label: 'Kontakt', href: '/kontakt', type: 'link' },
];

const services = [
  {
    slug: 'vorsorge-check-up',
    title: 'Vorsorge & Check-up',
    excerpt: 'Gesundheitschecks, Laborwerte und Beratung, damit Risiken früh sichtbar werden.',
    image: img.prevention,
    category: 'Vorsorge',
    durationLabel: '30-60 Min.',
    requirementLabel: 'mit Termin',
    icon: 'HeartPulse',
  },
  {
    slug: 'akutsprechstunde',
    title: 'Akutsprechstunde',
    excerpt: 'Einordnung akuter Beschwerden mit klarer Empfehlung für die nächsten Schritte.',
    image: img.acute,
    category: 'Akut',
    durationLabel: 'nach Lage',
    requirementLabel: 'telefonisch anmelden',
    icon: 'Siren',
  },
  {
    slug: 'diagnostik-labor',
    title: 'Diagnostik & Labor',
    excerpt: 'EKG, Labor, Ultraschall und strukturierte Befundbesprechung ohne Fachchinesisch.',
    image: img.diagnostics,
    category: 'Diagnostik',
    durationLabel: '20-45 Min.',
    requirementLabel: 'je nach Untersuchung',
    icon: 'Microscope',
  },
  {
    slug: 'impfberatung-reisemedizin',
    title: 'Impfberatung & Reisemedizin',
    excerpt: 'Impfstatus, Reiseprofil und individuelle Empfehlungen verständlich eingeordnet.',
    image: img.vaccine,
    category: 'Beratung',
    durationLabel: '20-30 Min.',
    requirementLabel: 'Impfpass mitbringen',
    icon: 'Syringe',
  },
  {
    slug: 'chronische-erkrankungen',
    title: 'Chronische Erkrankungen',
    excerpt: 'Langfristige Betreuung mit Verlaufskontrollen, Medikation und realistischer Alltagsplanung.',
    image: img.consultation,
    category: 'Betreuung',
    durationLabel: 'regelmäßig',
    requirementLabel: 'Befunde mitbringen',
    icon: 'ClipboardCheck',
  },
];

const doctors = [
  {
    title: 'Dr. med.',
    name: 'Helena Berger',
    specialty: 'Allgemeinmedizin · Innere Medizin',
    bio: 'Leitet die Praxis mit Fokus auf verständliche Diagnostik, Vorsorge und langfristige Betreuung. Wichtig ist ihr, dass Patientinnen und Patienten wissen, warum ein Schritt sinnvoll ist.',
    image: img.doctor,
    languages: ['Deutsch', 'Englisch'],
    appointmentCta: { label: 'Termin anfragen', href: '/kontakt' },
  },
  {
    title: 'Dr. med.',
    name: 'Jonas Reiter',
    specialty: 'Akutsprechstunde · Diagnostik',
    bio: 'Betreut akute Beschwerden, EKG, Ultraschall und Befundgespräche. Seine Stärke ist eine klare Einordnung ohne unnötige Verunsicherung.',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=1600&q=85',
    languages: ['Deutsch', 'Englisch'],
    appointmentCta: { label: 'Sprechstunde anfragen', href: '/kontakt' },
  },
  {
    title: 'Dr. med.',
    name: 'Mara Yilmaz',
    specialty: 'Prävention · Reisemedizin',
    bio: 'Begleitet Vorsorge, Impfberatung und Gesundheitschecks mit Blick auf Lebensrealität, Reisepläne und individuelle Risiken.',
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=1600&q=85',
    languages: ['Deutsch', 'Türkisch', 'Englisch'],
    appointmentCta: { label: 'Beratung anfragen', href: '/kontakt' },
  },
];

const practiceTeam = [
  { name: 'Lea Schuster', role: 'Empfang & Terminmanagement', bio: 'Sortiert Anliegen, Dringlichkeit und passende Terminart, damit Sie nicht im falschen Slot landen.', image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1600&q=85' },
  { name: 'Nora Klein', role: 'MFA · Labor', bio: 'Kümmert sich um Blutabnahmen, EKG-Vorbereitung und klare Hinweise vor Untersuchungen.', image: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=1600&q=85' },
  { name: 'Samuel Richter', role: 'Praxiskoordination', bio: 'Hält Abläufe, Rückrufe und Befundwege zusammen, damit nichts zwischen Anmeldung und Arztzimmer verloren geht.', image: img.team },
];

const patientCards = [
  { icon: 'CalendarCheck', title: 'Terminart wählen', text: 'Akut, Kontrolle, Vorsorge oder Beratung: Die Terminart entscheidet über Dauer und Vorbereitung.', items: ['Anliegen nennen', 'Dringlichkeit sagen', 'Rückruf möglich'] },
  { icon: 'FileText', title: 'Befunde mitbringen', text: 'Vorberichte, Medikamentenliste und Impfpass helfen, doppelte Wege zu vermeiden.', items: ['Medikamente', 'Laborwerte', 'Impfpass'] },
  { icon: 'Clock', title: 'Pünktlich, aber entspannt', text: 'Bitte zehn Minuten früher kommen, wenn Formulare oder neue Daten nötig sind.', items: ['10 Min. vorher', 'Versichertenkarte', 'Überweisung'] },
  { icon: 'MessageCircle', title: 'Nachfragen erlaubt', text: 'Wir erklären Befunde so, dass Sie die nächsten Schritte wirklich verstehen.', items: ['Befundgespräch', 'Therapieplan', 'Rückfragen'] },
];

const openingDays = [
  { label: 'Montag', hours: '08:00-12:30 · 14:00-17:00', note: 'Akut nach telefonischer Anmeldung' },
  { label: 'Dienstag', hours: '08:00-13:00', note: 'Vorsorge und Labor' },
  { label: 'Mittwoch', hours: '08:00-12:30 · 15:00-18:00', note: 'späte Sprechstunde' },
  { label: 'Donnerstag', hours: '08:00-13:00', note: 'Diagnostik' },
  { label: 'Freitag', hours: '08:00-12:00', note: 'Akut und Rückrufe' },
];

const newsItems = [
  {
    slug: 'check-up-sinnvoll-vorbereiten',
    title: 'So bereiten Sie einen Check-up sinnvoll vor',
    excerpt: 'Welche Informationen helfen, damit Vorsorge nicht zur reinen Blutwertsammlung wird.',
    image: img.checkup,
    content: '<p>Ein guter Check-up beginnt nicht erst mit der Blutabnahme. Hilfreich sind aktuelle Beschwerden, familiäre Risiken, Medikamente, Schlaf, Bewegung und die Frage, was Sie selbst klären möchten.</p><p>Bringen Sie vorhandene Befunde mit. Dann können wir besser entscheiden, welche Untersuchungen wirklich sinnvoll sind und welche nur doppelt wären.</p>',
  },
  {
    slug: 'akute-beschwerden-richtig-einordnen',
    title: 'Akute Beschwerden: Wann reicht Praxis, wann Notdienst?',
    excerpt: 'Eine ruhige Orientierung für Beschwerden, die schnell geklärt werden sollten.',
    image: img.acute,
    content: '<p>Nicht jede akute Beschwerde ist ein Notfall, aber manche Symptome brauchen sofortige Hilfe. Atemnot, starke Brustschmerzen, neurologische Ausfälle oder schwere Verletzungen gehören in den Rettungsdienst.</p><p>Für viele andere Themen kann eine Akutsprechstunde sinnvoll sein. Rufen Sie vorher an, damit wir Dringlichkeit und passenden Weg einschätzen können.</p>',
  },
  {
    slug: 'impfpass-vor-reise-pruefen',
    title: 'Warum der Impfpass vor Reisen früh geprüft werden sollte',
    excerpt: 'Reisemedizin funktioniert besser, wenn Empfehlungen nicht am letzten Tag entstehen.',
    image: img.vaccine,
    content: '<p>Manche Impfungen brauchen Abstand oder mehrere Dosen. Deshalb lohnt sich eine Prüfung einige Wochen vor der Reise.</p><p>Wichtig sind Reiseziel, Aufenthaltsdauer, Art der Reise, Vorerkrankungen und der aktuelle Impfstatus. Daraus entsteht eine Empfehlung, die zu Ihrer Situation passt.</p>',
  },
];

function hero(headline, subline, image, extra = {}) {
  return section('hero', {
    badgeText: extra.badgeText || 'Praxis am Stadtgarten',
    badgeIcon: extra.badgeIcon || 'ShieldCheck',
    headline,
    subline,
    bgMode: 'image',
    bgImage: image,
    bgPosition: extra.bgPosition || 'center',
    overlayColor: extra.overlayColor || colors.tealDeep,
    overlayOpacity: extra.overlayOpacity ?? 0.62,
    imageEffect: extra.imageEffect || 'kenBurns',
    imageEffectIntensity: extra.imageEffectIntensity || 'subtle',
    specialtyLabel: extra.specialtyLabel || 'Allgemeinmedizin · Vorsorge · Diagnostik',
    emergencyHint: extra.emergencyHint || 'Akutfälle bitte telefonisch anmelden',
    trustItems: extra.trustItems || ['verständliche Befunde', 'kurze Wege', 'klare Terminarten'],
    primaryCta: extra.primaryCta || { label: 'Termin anfragen', href: '/kontakt', icon: 'CalendarCheck' },
    secondaryCta: extra.secondaryCta || { label: 'Leistungen ansehen', href: '/leistungen', icon: 'Stethoscope' },
    emergencyCta: extra.emergencyCta || { label: 'Akuthinweise', href: '/kontakt', icon: 'Phone' },
  }, heroStyle);
}

function appointment(headline = 'Der richtige Termin spart Wartezeit.', subline = 'Schreiben Sie uns kurz, worum es geht. Wir melden uns mit einem passenden Vorschlag.') {
  return section('appointmentCta', {
    badgeText: 'Termin',
    headline,
    subline,
    introText: '<p>Für akute Beschwerden bitte anrufen. Für Vorsorge, Kontrolle und Beratung können Sie das Formular nutzen. Je genauer das Anliegen, desto passender der Termin.</p>',
    onlineCta: { label: 'Termin anfragen', href: '/kontakt' },
    phoneCta: { label: phone, href: `tel:${phone.replaceAll(' ', '')}` },
    callbackCta: { label: 'Rückruf wünschen', href: '/kontakt' },
    notes: ['Akut telefonisch', 'Vorsorge mit Termin', 'Befunde mitbringen'],
  }, light);
}

function cta(headline, subline) {
  return section('immersiveCtaBanner', {
    badge: 'Praxis kontaktieren',
    headline,
    subline,
    image: img.reception,
    overlay: 'rgba(11,52,55,0.70)',
    primaryCta: { label: 'Termin anfragen', href: '/kontakt' },
    secondaryCta: { label: 'Sprechzeiten ansehen', href: '/termine' },
    metrics: [{ value: '3', label: 'Ärztinnen & Ärzte' }, { value: '5', label: 'Terminarten' }, { value: '1', label: 'klarer Befundweg' }],
  }, dark);
}

function prefixDemoLinks(value) {
  if (Array.isArray(value)) return value.map(prefixDemoLinks);
  if (!value || typeof value !== 'object') return value;
  const copy = { ...value };
  for (const [key, child] of Object.entries(copy)) {
    if (key === 'href' && typeof child === 'string' && child.startsWith('/') && !child.startsWith('/demo/medical')) {
      copy[key] = `/demo/medical${child === '/' ? '' : child}`;
    } else {
      copy[key] = prefixDemoLinks(child);
    }
  }
  return copy;
}

function serviceCards(list = services) {
  return list.map((item) => ({
    title: item.title,
    text: item.excerpt,
    image: item.image,
    icon: item.icon,
    category: item.category,
    cta: { label: 'Details ansehen', href: `/c/leistungen/${item.slug}` },
  }));
}

function collectionHero(title, excerpt, image, badgeText) {
  return section('collectionHero', {
    headline: title,
    subline: excerpt,
    badgeText,
    backgroundImage: image,
    bgImage: image,
    overlayColor: colors.tealDeep,
    overlayOpacity: 0.62,
    imageEffect: 'kenBurns',
    imageEffectIntensity: 'subtle',
  }, heroStyle);
}

const pages = [
  {
    slug: '',
    title: 'Startseite',
    sections: [
      hero('Medizin, die erklärt, bevor sie entscheidet.', 'Die Praxis am Stadtgarten verbindet hausärztliche Versorgung, Vorsorge und Diagnostik mit klarer Kommunikation. Sie sollen verstehen, was wir tun und warum.', img.hero),
      section('serviceOverview', { badgeText: 'Leistungen', headline: 'Für viele Anliegen der erste gute Schritt.', subline: 'Von akuten Beschwerden bis Vorsorge: Wir ordnen ein, prüfen gezielt und erklären die nächsten Schritte.', items: serviceCards(services.slice(0, 4)), ctaPrimary: { label: 'Alle Leistungen ansehen', href: '/leistungen' } }, light),
      section('principlesGrid', { badge: 'Was uns wichtig ist', headline: 'Gute Medizin braucht Ruhe und Struktur.', subline: 'Nicht lauter, nicht komplizierter, sondern verständlicher.', principles: [
        { eyebrow: '01', title: 'Erst zuhören, dann untersuchen', text: 'Der beste Befund hilft wenig, wenn das eigentliche Anliegen nicht verstanden wurde.' },
        { eyebrow: '02', title: 'Befunde verständlich machen', text: 'Wir übersetzen Ergebnisse in klare nächste Schritte.' },
        { eyebrow: '03', title: 'Akut heißt nicht chaotisch', text: 'Dringlichkeit wird sortiert, damit Hilfe dort ankommt, wo sie gebraucht wird.' },
        { eyebrow: '04', title: 'Vorsorge bleibt individuell', text: 'Nicht jede Untersuchung passt zu jedem Menschen. Wir prüfen Nutzen und Kontext.' },
      ], cta: { label: 'Praxis kennenlernen', href: '/team' } }, alt),
      section('diagnostics', { badgeText: 'Diagnostik', headline: 'Gezielt prüfen, verständlich besprechen.', subline: 'Technik ist nur dann hilfreich, wenn Ergebnis und Konsequenz klar werden.', items: [
        { title: 'Labor & Blutwerte', text: 'Basiswerte, Verlaufskontrollen und gezielte Abklärungen mit anschließender Einordnung.', image: img.lab, methodLabel: 'Labor', benefitLabel: 'Verlauf sehen', cta: { label: 'Mehr erfahren', href: '/c/leistungen/diagnostik-labor' } },
        { title: 'EKG & Kreislauf', text: 'Schnelle Orientierung bei Herz-Kreislauf-Themen, Kontrollen und unklaren Beschwerden.', image: img.diagnostics, methodLabel: 'EKG', benefitLabel: 'schnell einordnen', cta: { label: 'Termin anfragen', href: '/kontakt' } },
        { title: 'Ultraschall', text: 'Nicht-invasive Diagnostik, wenn Organe, Verlauf oder Beschwerden genauer betrachtet werden sollten.', image: img.ultrasound, methodLabel: 'Sonografie', benefitLabel: 'sichtbar machen', cta: { label: 'Details ansehen', href: '/c/leistungen/diagnostik-labor' } },
      ] }, light),
      section('doctorTeam', { badgeText: 'Ärztliches Team', headline: 'Menschen, die medizinisch und menschlich einordnen.', subline: 'Jede Sprechstunde soll mit einem verständlichen nächsten Schritt enden.', doctors }, alt),
      section('patientInfo', { badgeText: 'Vor dem Termin', headline: 'Gut vorbereitet heißt nicht perfekt vorbereitet.', subline: 'Ein paar Angaben reichen oft, damit wir schneller richtig einsteigen.', introText: '<p>Wenn Sie uns Anliegen, Medikamente und vorhandene Befunde nennen, vermeiden wir doppelte Wege und planen besser.</p>', cards: patientCards }, light),
      section('newsPreview', { headline: 'Praxiswissen', subline: 'Kurze, verständliche Beiträge zu Vorsorge, Akutfragen und Vorbereitung.', linkLabel: 'Alle Beiträge lesen', linkIcon: 'ArrowRight', collectionKey: 'news' }, alt),
      cta('Unsicher, welcher Termin richtig ist?', 'Rufen Sie an oder senden Sie eine Anfrage. Wir sortieren Akut, Kontrolle, Vorsorge und Beratung gemeinsam.'),
    ],
  },
  {
    slug: 'leistungen',
    title: 'Leistungen',
    sections: [
      hero('Leistungen mit klarer Einordnung.', 'Wir behandeln nicht nur einzelne Werte, sondern schauen auf Beschwerden, Verlauf und Alltag.', img.consultation, { badgeText: 'Leistungen' }),
      section('serviceOverview', { badgeText: 'Übersicht', headline: 'Unsere medizinischen Schwerpunkte.', subline: 'Jede Leistung ist so beschrieben, dass Sie wissen, wann sie sinnvoll ist und wie sie abläuft.', items: serviceCards(), ctaPrimary: { label: 'Termin anfragen', href: '/kontakt' } }, light),
      section('treatmentDetail', { badgeText: 'Ablauf', headline: 'Was in der Sprechstunde passiert.', subline: 'Wir erklären Ablauf, Vorbereitung und Ergebnis so konkret wie möglich.', treatments: services.slice(0, 4).map((item) => ({ title: item.title, text: item.excerpt, image: item.image, durationLabel: item.durationLabel, requirementLabel: item.requirementLabel, steps: ['Anliegen klären', 'gezielt untersuchen', 'nächsten Schritt festlegen'], noticeText: item.slug === 'akutsprechstunde' ? 'Bei lebensbedrohlichen Symptomen bitte sofort 112 wählen.' : 'Bitte vorhandene Befunde und Medikamentenliste mitbringen.', cta: { label: 'Details ansehen', href: `/c/leistungen/${item.slug}` } })) }, alt),
      appointment(),
    ],
  },
  {
    slug: 'termine',
    title: 'Termine',
    sections: [
      hero('Der passende Termin beginnt mit dem richtigen Anliegen.', 'Akut, Kontrolle, Vorsorge oder Beratung: Wir helfen, die richtige Terminart zu wählen.', img.waiting, { badgeText: 'Termine' }),
      appointment('Termin anfragen, Rückruf bekommen oder direkt anrufen.', 'Je nach Anliegen melden wir uns mit passendem Zeitfenster und Vorbereitungshinweisen.'),
      section('openingHours', { badgeText: 'Sprechzeiten', headline: 'Sprechzeiten und Akutfenster.', subline: 'Akute Anliegen bitte telefonisch anmelden, damit wir Dringlichkeit und Ablauf einschätzen können.', acuteCareText: 'Akutsprechstunden sind für Beschwerden gedacht, die zeitnah medizinisch eingeordnet werden sollten. Bei schweren Symptomen bitte den Rettungsdienst verständigen.', holidayNote: 'Urlaubs- und Vertretungshinweise erscheinen bei Bedarf als Hinweisbanner.', days: openingDays, ctaPrimary: { label: 'Akut anrufen', href: `tel:${phone.replaceAll(' ', '')}` } }, light),
      section('patientInfo', { badgeText: 'Vorbereitung', headline: 'Was Sie zum Termin mitbringen sollten.', subline: 'Nicht alles ist immer nötig. Diese Punkte helfen häufig.', introText: '<p>Wenn Sie unsicher sind, bringen Sie lieber vorhandene Unterlagen mit. Wir sortieren gemeinsam, was relevant ist.</p>', cards: patientCards }, alt),
      section('emergencyInfo', { badgeText: 'Akut & Notfall', headline: 'Wenn es dringend ist.', subline: 'Wir unterscheiden zwischen Praxis-Akutsprechstunde und medizinischem Notfall.', emergencyItems: [
        { title: 'Sofort 112', text: 'Atemnot, starke Brustschmerzen, Lähmungen, Bewusstseinsstörung oder schwere Verletzungen.' },
        { title: '116 117', text: 'Außerhalb der Sprechzeiten, wenn ärztliche Hilfe nötig ist, aber kein lebensbedrohlicher Notfall vorliegt.' },
        { title: 'Praxis anrufen', text: 'Akute Beschwerden während unserer Sprechzeiten bitte telefonisch anmelden.' },
      ], primaryCta: { label: 'Praxis anrufen', href: `tel:${phone.replaceAll(' ', '')}` } }, light),
    ],
  },
  {
    slug: 'team',
    title: 'Team',
    sections: [
      hero('Ein Team, das Medizin verständlich macht.', 'Ärztinnen, Ärzte und Praxisteam arbeiten so zusammen, dass Anliegen nicht zwischen Empfang, Labor und Sprechzimmer verloren gehen.', img.team, { badgeText: 'Team' }),
      section('doctorTeam', { badgeText: 'Ärztliches Team', headline: 'Kompetenz mit ruhiger Sprache.', subline: 'Unsere Schwerpunkte ergänzen sich, damit Versorgung nicht an einer Tür endet.', doctors }, light),
      section('practiceTeam', { badgeText: 'Praxisteam', headline: 'Die Menschen, die Abläufe verlässlich machen.', subline: 'Terminmanagement, Labor, Rückrufe und Vorbereitung entscheiden oft darüber, wie gut ein Besuch funktioniert.', members: practiceTeam }, alt),
      section('story', { badgeText: 'Praxis', headline: 'Wir arbeiten lieber klar als kompliziert.', subline: 'Die Praxis am Stadtgarten ist auf Versorgung ausgelegt, die Patientinnen und Patienten nicht allein mit Befunden lässt.', text: '<p>Unser Ziel ist eine Praxis, in der medizinische Entscheidungen nachvollziehbar bleiben. Dazu gehören gute Diagnostik, saubere Vorbereitung, klare Sprache und ein Team, das Dringlichkeit ernst nimmt.</p><p>Wir nehmen uns nicht für jedes Anliegen gleich viel Zeit, sondern die passende Zeit. Akut, Kontrolle, Vorsorge und Beratung brauchen unterschiedliche Abläufe.</p>', image: img.reception, ctaPrimary: { label: 'Kontakt aufnehmen', href: '/kontakt' } }, light),
    ],
  },
  {
    slug: 'praxis',
    title: 'Praxis',
    sections: [
      hero('Eine Praxis, die Orientierung gibt.', 'Räume, Diagnostik und Abläufe sind darauf ausgelegt, dass Sie schnell wissen, wo Sie hinmüssen und was als Nächstes passiert.', img.reception, { badgeText: 'Praxis' }),
      section('practiceGallery', { badgeText: 'Räume', headline: 'Hell, ruhig, funktional.', subline: 'Empfang, Wartebereich, Diagnostik und Sprechzimmer mit kurzen Wegen.', images: [
        { src: img.reception, alt: 'Empfang der Praxis am Stadtgarten', caption: 'Empfang' },
        { src: img.waiting, alt: 'Wartebereich der Praxis', caption: 'Wartebereich' },
        { src: img.diagnostics, alt: 'Diagnostikraum', caption: 'Diagnostik' },
        { src: img.consultation, alt: 'Sprechzimmer', caption: 'Sprechzimmer' },
      ] }, light),
      section('equipmentHighlights', { badgeText: 'Ausstattung', headline: 'Diagnostik, die im Alltag hilft.', subline: 'Nicht maximale Technik, sondern passende Verfahren für konkrete Fragen.', items: [
        { icon: 'Microscope', title: 'Labor vor Ort', text: 'Basiswerte und Verlaufskontrollen direkt in den Praxisablauf integriert.' },
        { icon: 'Activity', title: 'EKG', text: 'Schnelle Orientierung bei Herz-Kreislauf-Fragen und Kontrollen.' },
        { icon: 'ScanLine', title: 'Ultraschall', text: 'Bildgebung für ausgewählte Fragestellungen ohne unnötige Umwege.' },
        { icon: 'ShieldCheck', title: 'Datenschutz', text: 'Befunde, Rückrufe und Formulare werden strukturiert und vertraulich geführt.' },
      ] }, alt),
      section('certifications', { badgeText: 'Standards', headline: 'Qualität ist auch Organisation.', subline: 'Fortbildung, Dokumentation und klare Zuständigkeiten halten die Versorgung verlässlich.', items: [
        { title: 'Regelmäßige Fortbildung', text: 'Medizinische Empfehlungen werden fortlaufend überprüft.' },
        { title: 'Hygiene & Datenschutz', text: 'Klare Standards für Praxisräume, Formulare und Patientendaten.' },
        { title: 'Vorsorgeprogramme', text: 'Strukturierte Checks für passende Alters- und Risikogruppen.' },
      ] }, light),
      cta('Sie möchten wissen, ob wir die richtige Praxis sind?', 'Schreiben Sie uns Ihr Anliegen. Wir sagen ehrlich, ob und wie wir helfen können.'),
    ],
  },
  {
    slug: 'news',
    title: 'Ratgeber',
    sections: [
      hero('Praxiswissen ohne Panik.', 'Kurze Beiträge zu Vorsorge, Akutfragen, Impfungen und Vorbereitung. Verständlich, vorsichtig und ohne Heilsversprechen.', img.lab, { badgeText: 'Ratgeber' }),
      section('newsGrid', { headline: 'Aktuelle Beiträge', subline: 'Orientierung für typische Fragen aus dem Praxisalltag.', collectionKey: 'news' }, light),
      cta('Sie haben eine konkrete medizinische Frage?', 'Bitte nutzen Sie für individuelle Anliegen unser Kontaktformular oder rufen Sie direkt an.'),
    ],
  },
  {
    slug: 'kontakt',
    title: 'Kontakt',
    sections: [
      hero('Kontakt zur Praxis am Stadtgarten.', 'Termin, Rückruf, Akutfrage oder allgemeines Anliegen: Wir melden uns mit dem passenden nächsten Schritt.', img.reception, { badgeText: 'Kontakt' }),
      section('locationContact', { badgeText: 'Kontakt & Standort', headline: 'Schreiben Sie uns Ihr Anliegen kurz und konkret.', subline: 'Für akute Beschwerden bitte anrufen. Für Termine und Rückfragen können Sie das Formular nutzen.', introText: 'Bitte nennen Sie Anliegen, gewünschte Terminart und ob es akut ist. Medizinische Notfälle gehören nicht ins Kontaktformular.', image: img.reception, mapEmbedUrl: mapsEmbed, formEnabled: true, submitLabel: 'Anfrage senden', infoCards: [{ icon: 'Phone', label: 'Telefon', value: phone }, { icon: 'Mail', label: 'E-Mail', value: email }, { icon: 'MapPin', label: 'Adresse', value: address }], primaryCta: { label: 'Anrufen', href: `tel:${phone.replaceAll(' ', '')}` }, secondaryCta: { label: 'Route planen', href: 'https://maps.google.com' } }, light),
      section('openingHours', { badgeText: 'Sprechzeiten', headline: 'Wann Sie uns erreichen.', subline: 'Akute Anliegen bitte telefonisch anmelden.', acuteCareText: 'Für lebensbedrohliche Symptome wählen Sie bitte sofort 112.', holidayNote: 'Telefonische Erreichbarkeit kann in Urlaubszeiten abweichen.', days: openingDays, ctaPrimary: { label: 'Praxis anrufen', href: `tel:${phone.replaceAll(' ', '')}` } }, alt),
      section('faq', { headline: 'Häufige Fragen vor der Kontaktaufnahme', items: [{ question: 'Kann ich akute Beschwerden über das Formular senden?', answer: 'Bitte rufen Sie bei akuten Beschwerden an. So können wir Dringlichkeit und Terminart besser einschätzen.' }, { question: 'Welche Unterlagen soll ich mitbringen?', answer: 'Versichertenkarte, Medikamentenliste und vorhandene Befunde sind häufig hilfreich.' }, { question: 'Kann ich einen Rückruf wünschen?', answer: 'Ja. Beschreiben Sie kurz das Anliegen und nennen Sie eine gut erreichbare Telefonnummer.' }] }, light),
    ],
  },
  {
    slug: 'impressum',
    title: 'Impressum',
    sections: [section('legalContent', { headline: 'Impressum', blocks: [{ title: 'Angaben gemäß TMG', content: 'Praxis am Stadtgarten, Stadtgartenstraße 18, 80331 München' }, { title: 'Kontakt', content: `${phone} · ${email}` }, { title: 'Berufsbezeichnung', content: 'Ärztinnen und Ärzte, verliehen in Deutschland' }, { title: 'Zuständige Kammer', content: 'Bayerische Landesärztekammer' }, { title: 'Hinweis', content: 'Dies ist ein Demo-Tenant von Flamingo Media. Inhalte und Angaben dienen ausschließlich der Demonstration.' }] }, light)],
  },
  {
    slug: 'datenschutz',
    title: 'Datenschutz',
    sections: [section('legalContent', { headline: 'Datenschutzerklärung', blocks: [{ title: 'Verantwortlicher', content: 'Praxis am Stadtgarten, Stadtgartenstraße 18, 80331 München' }, { title: 'Kontaktformular', content: 'Formulardaten werden zur Bearbeitung Ihrer Anfrage verwendet. Bitte senden Sie keine Notfälle über das Formular.' }, { title: 'Hosting', content: 'Diese Demo wird technisch über Flamingo Media bereitgestellt.' }, { title: 'Rechte', content: 'Sie haben Rechte auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung.' }] }, light)],
  },
];

function serviceItemSections(item) {
  return prefixDemoLinks([
    collectionHero(item.title, item.excerpt, item.image, item.category),
    section('treatmentDetail', { badgeText: 'Details', headline: `${item.title}: Ablauf und Einordnung.`, subline: item.excerpt, treatments: [{ title: item.title, text: `<p>${item.excerpt}</p><p>Wir klären zuerst Anlass, Vorgeschichte und vorhandene Befunde. Danach entscheiden wir, welche Untersuchung sinnvoll ist und welche nächste Maßnahme wirklich hilft.</p>`, image: item.image, durationLabel: item.durationLabel, requirementLabel: item.requirementLabel, steps: ['Anliegen klären', 'Untersuchung planen', 'Befund besprechen'], noticeText: item.slug === 'akutsprechstunde' ? 'Bei schweren Symptomen bitte sofort 112 wählen.' : 'Bitte vorhandene Unterlagen mitbringen.', cta: { label: 'Termin anfragen', href: '/kontakt' } }] }, light),
    section('patientInfo', { badgeText: 'Vorbereitung', headline: 'Was für diesen Termin hilft.', subline: 'Ein paar Angaben machen die Einordnung leichter.', introText: '<p>Wenn Sie nicht sicher sind, welche Unterlagen relevant sind, bringen Sie vorhandene Befunde lieber mit.</p>', cards: patientCards.slice(0, 3) }, alt),
    appointment('Möchten Sie diese Leistung anfragen?', 'Senden Sie uns kurz Ihr Anliegen. Wir melden uns mit der passenden Terminart.'),
  ]);
}

function newsItemSections(item) {
  return prefixDemoLinks([
    collectionHero(item.title, item.excerpt, item.image, 'Praxiswissen'),
    section('freeText', { content: item.content }, light),
    cta('Brauchen Sie eine persönliche Einordnung?', 'Für individuelle medizinische Fragen melden Sie sich bitte direkt in der Praxis.'),
  ]);
}

async function upsertPage(page, existingPages) {
  const existing = existingPages.find((p) => p.slug === page.slug);
  const payload = { slug: page.slug, title: page.title, sections: prefixDemoLinks(page.sections), visible: true, status: 'published' };
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
      data: { image: item.image, author: 'Praxis am Stadtgarten', date: '2026-06-04', sections: makeSections(item) },
    });
  }
}

async function main() {
  const pagesBefore = await api('GET', '/api/v1/content/pages');
  const collectionsBefore = await api('GET', '/api/v1/content/collections');
  const existingPages = pagesBefore.pages || [];

  await api('PUT', '/api/v1/content/style', { style: 'classic' });
  await api('PUT', '/api/v1/content/brand', { companyName: 'Praxis am Stadtgarten', tagline: 'Allgemeinmedizin, Vorsorge und Diagnostik in München', primaryColor: colors.teal, secondaryColor: colors.tealDeep, accentColor: colors.sand, logo: '', logoDisplay: 'name', headingFont: 'Inter', bodyFont: 'Inter', topBarColor: colors.tealDeep, footerColor: colors.tealDeep });
  await api('PUT', '/api/v1/content/design', { textPrimary: colors.ink, textSecondary: colors.soft, sectionBg: colors.cream, sectionBgAlt: colors.alt, cardBg: colors.card, cardBorder: colors.border, badgeBg: colors.tealSoft, badgeText: colors.tealDeep, badgeBorder: colors.border, brand: colors.teal, accent: colors.sand, heading: colors.ink, subheading: colors.soft, body: colors.soft, muted: colors.muted, icon: colors.teal, btnBg: colors.teal, btnText: colors.onDark, dividerColor: colors.border, eyebrow: colors.teal, statValue: colors.teal, quote: colors.ink, ratingStar: colors.sand, check: colors.teal, onDarkHeading: colors.onDark, onDarkBody: colors.onDarkBody, onDarkMuted: colors.onDarkMuted });
  await api('PUT', '/api/v1/content/contact', { phone, email, address, whatsappEnabled: false, whatsapp: '', whatsappColor: colors.teal });
  await api('PUT', '/api/v1/content/navigation', { items: navItems, cta: { label: 'Termin anfragen', href: '/kontakt' } });
  await api('PUT', '/api/v1/content/footer', { columns: [{ title: 'Praxis', items: [{ text: 'Leistungen', href: '/leistungen' }, { text: 'Termine', href: '/termine' }, { text: 'Team', href: '/team' }] }, { title: 'Leistungen', items: services.slice(0, 4).map((item) => ({ text: item.title, href: `/c/leistungen/${item.slug}` })) }, { title: 'Kontakt', items: [{ text: phone }, { text: email }, { text: address }] }], legalLinks: [{ label: 'Impressum', href: '/impressum' }, { label: 'Datenschutz', href: '/datenschutz' }], cta: { label: 'Termin anfragen', href: '/kontakt' } });
  await api('PUT', '/api/v1/content/opening-hours', { hours: openingDays.map((day) => ({ type: 'regular', day: day.label, hours: day.hours })) });
  await api('PUT', '/api/v1/content/form-fields', { fields: [{ name: 'name', label: 'Name', type: 'text', required: true, halfWidth: true }, { name: 'email', label: 'E-Mail', type: 'email', required: true, halfWidth: true }, { name: 'phone', label: 'Telefon', type: 'tel', halfWidth: true }, { name: 'topic', label: 'Anliegen', type: 'select', options: ['Termin', 'Akutfrage', 'Vorsorge', 'Befund', 'Rückruf'], halfWidth: true }, { name: 'message', label: 'Nachricht', type: 'textarea', required: true }] });
  await api('PUT', '/api/v1/content/social-links', { google: 'https://maps.google.com', facebook: '', instagram: '' });
  await api('PUT', '/api/v1/content/seo', { titleTemplate: '%s · Praxis am Stadtgarten', defaultTitle: 'Praxis am Stadtgarten · Allgemeinmedizin in München', defaultDescription: 'Praxis am Stadtgarten in München: Allgemeinmedizin, Vorsorge, Diagnostik, Akutsprechstunde und verständliche Befundbesprechung.', defaultOgImage: img.hero, canonicalBase: 'https://flamingo-renderer.vercel.app/demo/medical', locale: 'de_DE' });

  for (const page of pages) await upsertPage(page, existingPages);

  await clearCollectionItems('referenzen', collectionsBefore);
  await clearCollectionItems('team', collectionsBefore);
  await replaceCollectionItems('leistungen', 'Leistungen', services, serviceItemSections, collectionsBefore);
  await replaceCollectionItems('news', 'Praxiswissen', newsItems, newsItemSections, collectionsBefore);

  const pagesAfter = await api('GET', '/api/v1/content/pages');
  const meta = {
    '': ['Praxis am Stadtgarten München', 'Allgemeinmedizin, Vorsorge, Diagnostik und Akutsprechstunde in München mit klarer medizinischer Einordnung.'],
    leistungen: ['Leistungen', 'Vorsorge, Akutsprechstunde, Diagnostik, Impfberatung und Betreuung chronischer Erkrankungen.'],
    termine: ['Termine & Sprechzeiten', 'Terminarten, Akutsprechstunde, Sprechzeiten und Vorbereitung in der Praxis am Stadtgarten.'],
    team: ['Team', 'Ärztliches Team und Praxisteam der Praxis am Stadtgarten in München.'],
    praxis: ['Praxisräume & Ausstattung', 'Räume, Diagnostik und Praxisabläufe der Praxis am Stadtgarten.'],
    news: ['Praxiswissen', 'Verständliche Beiträge zu Vorsorge, Akutfragen, Impfungen und Terminvorbereitung.'],
    kontakt: ['Kontakt', 'Kontakt, Adresse, Sprechzeiten und Terminformular der Praxis am Stadtgarten.'],
  };
  for (const page of pagesAfter.pages || []) {
    if (!meta[page.slug]) continue;
    await api('PUT', `/api/v1/content/seo/${page.id}`, { metaTitle: `${meta[page.slug][0]} · Praxis am Stadtgarten`, metaDescription: meta[page.slug][1], ogImage: img.hero, noindex: false });
  }

  const publishResult = await api('POST', '/api/v1/content/publish', {});
  console.log(JSON.stringify({ ok: true, publishResult }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
