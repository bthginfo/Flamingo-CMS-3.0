/**
 * Demo tenant: MEDICAL
 *
 * Identität: "Praxis am Stadtgarten" — ruhige hausärztliche Praxis in Stuttgart-West
 *            mit Fokus auf Vorsorge, verständliche Diagnostik und klare Terminwege.
 *
 * Run:
 *   node scripts/demo-tenants/medical.cjs
 */

const crypto = require('crypto');
const { run } = require('./_lib/runner.cjs');
const { darkTokens } = require('./_lib/theme.cjs');

const PAT = '32a67a176cba5748b9d20d6f86dbf620ae04d9eda10093e0efec433ae1b8ac09';

const uuid = () => crypto.randomUUID();
const img = (id, w = 1920) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=82`;

const C = {
  ink: '#0B2530',
  body: '#294756',
  muted: '#5F747C',
  paper: '#FFFFFF',
  mist: '#F2F8F7',
  mint: '#DCEFEB',
  brand: '#0E5A63',
  teal: '#167E83',
  sage: '#8FAF9A',
  coral: '#D88B72',
};

const darkSectionTokens = {
  ...darkTokens({ accent: '#CFE9E5' }),
  '--token-heading': '#FFFFFF',
  '--token-body': 'rgba(255,255,255,0.92)',
  '--token-muted': 'rgba(255,255,255,0.72)',
  '--token-eyebrow': '#CFE9E5',
  '--token-on-dark-heading': '#FFFFFF',
  '--token-on-dark-body': 'rgba(255,255,255,0.92)',
  '--token-on-dark-muted': 'rgba(255,255,255,0.72)',
  '--token-btn-bg': '#FFFFFF',
  '--token-btn-text': C.brand,
  '--token-btn-secondary-bg': 'rgba(255,255,255,0.16)',
  '--token-btn-secondary-text': '#FFFFFF',
  '--token-badge-bg': 'rgba(255,255,255,0.16)',
  '--token-badge-text': '#FFFFFF',
  '--token-badge-border': 'rgba(255,255,255,0.32)',
  '--token-card-bg': '#0A3A43',
  '--token-card-border': 'rgba(255,255,255,0.22)',
};

const lightSection = {
  '--token-section-bg': C.mist,
  '--token-heading': C.ink,
  '--token-body': C.body,
  '--token-muted': C.muted,
  '--token-card-bg': '#FFFFFF',
  '--token-card-border': '#D9E8E5',
  '--token-icon': C.brand,
  '--token-accent': C.teal,
  '--token-btn-bg': C.brand,
  '--token-btn-text': '#FFFFFF',
  '--token-badge-bg': '#E6F3F1',
  '--token-badge-text': C.brand,
};

const softCta = {
  '--token-section-bg': '#E5F3F0',
  '--token-heading': C.ink,
  '--token-body': C.body,
  '--token-muted': C.muted,
  '--token-btn-bg': C.brand,
  '--token-btn-text': '#FFFFFF',
  '--token-badge-bg': '#FFFFFF',
  '--token-badge-text': C.brand,
};

const heroImage = img('1584515933487-779824d29309');
const teamImage = img('1579684385127-1ef15d508118');
const diagnosticsImage = img('1581595219315-a187dd40c322');
const practiceImage = img('1519494026892-80bbd2d6fd0d');
const waitingImage = img('1505751172876-fa1923c5c528');

function heroSection({ headline, subline, badgeText, image = heroImage, primary = 'Termin anfragen', secondary = 'Leistungen ansehen', href = '/kontakt' }) {
  return {
    type: 'hero',
    data: {
      headline,
      subline,
      badgeText,
      badgeIcon: 'ShieldCheck',
      bgMode: 'image',
      bgImage: image,
      bgPosition: 'center 42%',
      overlayColor: '#06272E',
      overlayOpacity: 0.64,
      imageEffect: 'kenBurns',
      imageEffectIntensity: 'subtle',
      primaryCta: { label: primary, href, icon: 'CalendarDays' },
      secondaryCta: { label: secondary, href: '/leistungen', icon: 'Stethoscope' },
      trustStripColor: 'rgba(6,39,46,0.55)',
      trustItems: [
        'Allgemeinmedizin',
        'Vorsorge & Diagnostik',
        'verständliche Befunde',
        'kurze Wege',
      ],
    },
    styleOverrides: darkSectionTokens,
  };
}

function collectionHero(headline, subline, image, category = 'Praxis am Stadtgarten') {
  return {
    type: 'collectionHero',
    data: {
      headline,
      subline,
      category,
      bgImage: image,
      backgroundImage: image,
      bgPosition: 'center 45%',
      overlayColor: '#06272E',
      overlayOpacity: 0.6,
      imageEffect: 'kenBurns',
      imageEffectIntensity: 'subtle',
    },
    styleOverrides: darkSectionTokens,
  };
}

function cta(headline = 'Möchten Sie Ihr Anliegen einordnen lassen?', subline = 'Beschreiben Sie kurz, worum es geht. Wir melden uns mit einem sinnvollen nächsten Schritt.') {
  return {
    type: 'ctaBand',
    data: {
      badgeText: 'Termin & Rückruf',
      headline,
      subline,
      ctaPrimary: { label: 'Termin anfragen', href: '/kontakt', icon: 'CalendarDays' },
    },
    styleOverrides: softCta,
  };
}

function faqSection() {
  return {
    type: 'faq',
    data: {
      headline: 'Häufige Fragen vor dem ersten Termin',
      items: [
        { question: 'Kann ich akute Beschwerden online anmelden?', answer: 'Ja. Bitte nennen Sie Beschwerden, seit wann sie bestehen und ob Fieber, Schmerzen oder Atemnot dazukommen. Bei starken akuten Symptomen rufen Sie bitte direkt an.' },
        { question: 'Was soll ich zum ersten Termin mitbringen?', answer: 'Versichertenkarte, Medikamentenliste, vorhandene Befunde und falls relevant Impfpass oder Überweisung. Fotos oder Notizen zu Symptomen helfen ebenfalls.' },
        { question: 'Bekomme ich Befunde verständlich erklärt?', answer: 'Ja. Wir planen Zeit ein, um Laborwerte, Diagnostik und nächste Schritte so zu erklären, dass Sie Entscheidungen nachvollziehen können.' },
        { question: 'Behandeln Sie auch Kinder?', answer: 'Wir behandeln Jugendliche und Erwachsene. Für Kinder unter 14 Jahren empfehlen wir in der Regel eine spezialisierte Kinderarztpraxis.' },
      ],
    },
  };
}

function buildServiceItem({ slug, title, excerpt, image, body, cards }) {
  return {
    title,
    slug,
    excerpt,
    data: {
      excerpt,
      sections: [
        { id: uuid(), ...collectionHero(title, excerpt, image, 'Leistung') },
        {
          id: uuid(),
          type: 'textImage',
          data: {
            badge: 'Einordnung',
            headline: title,
            text: `<p>${body}</p>`,
            image,
            imageAlt: title,
            layout: 'image-right',
            items: cards.slice(0, 3),
            primaryCta: { label: 'Termin anfragen', href: '/kontakt', icon: 'CalendarDays' },
          },
        },
        {
          id: uuid(),
          type: 'patientInfo',
          data: {
            headline: 'So bereiten Sie den Termin vor',
            subline: 'Ein paar Angaben reichen, damit wir schneller richtig einsteigen.',
            cards,
          },
        },
        faqSection(),
        { id: uuid(), ...cta('Passt diese Leistung zu Ihrem Anliegen?', 'Schreiben Sie uns kurz. Wir sagen Ihnen, welche Terminart sinnvoll ist und was Sie mitbringen sollten.') },
      ],
    },
  };
}

const services = [
  {
    slug: 'hausarztliche-versorgung',
    title: 'Hausärztliche Versorgung',
    excerpt: 'Erste Einschätzung, Verlaufskontrolle und langfristige Begleitung mit klarer Dokumentation.',
    image: img('1550831107-1553da8c8464'),
    body: 'Wir verbinden medizinische Routine mit guter Kommunikation. Beschwerden werden eingeordnet, Verläufe dokumentiert und Behandlungswege so erklärt, dass Sie wissen, warum der nächste Schritt sinnvoll ist.',
    cards: [
      { icon: 'ClipboardList', title: 'Anliegen strukturieren', text: 'Symptome, Vorerkrankungen und Medikamente werden sauber erfasst.', items: ['Beschwerden', 'Medikation', 'Verlauf'] },
      { icon: 'HeartPulse', title: 'Verlauf beobachten', text: 'Wir schauen nicht nur auf Einzelwerte, sondern auf Veränderungen.', items: ['Kontrolle', 'Befund', 'Therapieplan'] },
      { icon: 'MessageCircle', title: 'Rückfragen erlaubt', text: 'Unklare Begriffe und nächste Schritte werden verständlich erklärt.', items: ['Befundgespräch', 'Nachfragen', 'Plan'] },
      { icon: 'ShieldCheck', title: 'Datenschutz im Blick', text: 'Gesundheitsdaten werden nur dort genutzt, wo sie für die Behandlung nötig sind.', items: ['Vertraulich', 'sorgfältig'] },
    ],
  },
  {
    slug: 'vorsorge-check-up',
    title: 'Vorsorge & Check-up',
    excerpt: 'Gesundheitscheck, Impfstatus und Laborwerte ohne Panik, aber mit sauberer Einordnung.',
    image: img('1579684385127-1ef15d508118'),
    body: 'Vorsorge ist dann gut, wenn sie verständlich bleibt. Wir prüfen Risikofaktoren, Impfstatus, Blutwerte und Lebenssituation und leiten daraus realistische Empfehlungen ab.',
    cards: [
      { icon: 'Activity', title: 'Check-up planen', text: 'Labor, Blutdruck, Anamnese und körperliche Untersuchung werden passend kombiniert.', items: ['Labor', 'Blutdruck', 'Anamnese'] },
      { icon: 'Syringe', title: 'Impfstatus prüfen', text: 'Wir sehen gemeinsam, welche Impfungen aktuell sinnvoll sind.', items: ['Impfpass', 'Auffrischung'] },
      { icon: 'FileText', title: 'Befunde verstehen', text: 'Werte werden nicht isoliert betrachtet, sondern mit Alltag und Vorgeschichte verbunden.', items: ['Laborwerte', 'Einordnung'] },
      { icon: 'CalendarDays', title: 'Rhythmus finden', text: 'Wir legen fest, wann die nächste Kontrolle sinnvoll ist.', items: ['Recall', 'Kontrolle'] },
    ],
  },
  {
    slug: 'diagnostik-labor',
    title: 'Diagnostik & Labor',
    excerpt: 'EKG, Ultraschall und Laborwerte mit ruhiger Erklärung statt Zahlen ohne Zusammenhang.',
    image: diagnosticsImage,
    body: 'Diagnostik soll Orientierung geben. Wir wählen Untersuchungen gezielt aus, erklären Grenzen und Nutzen und besprechen die Ergebnisse in verständlicher Sprache.',
    cards: [
      { icon: 'ScanLine', title: 'Gezielt untersuchen', text: 'Nicht alles ist immer nötig. Wir wählen Diagnostik nach Fragestellung.', items: ['EKG', 'Ultraschall', 'Labor'] },
      { icon: 'FileSearch', title: 'Befunde einordnen', text: 'Ergebnisse werden mit Symptomen und Vorgeschichte abgeglichen.', items: ['Kontext', 'Nächste Schritte'] },
      { icon: 'Clock', title: 'Rückmeldung planen', text: 'Sie erfahren, wann und wie Sie Ergebnisse erhalten.', items: ['Telefon', 'Termin'] },
      { icon: 'AlertCircle', title: 'Dringendes erkennen', text: 'Auffällige Werte werden priorisiert und nicht liegen gelassen.', items: ['Priorität', 'Kontakt'] },
    ],
  },
  {
    slug: 'akutsprechstunde',
    title: 'Akutsprechstunde',
    excerpt: 'Schnelle Einordnung akuter Beschwerden mit klarer Telefonpriorisierung.',
    image: img('1580281658626-ee379f3cce93'),
    body: 'Akute Beschwerden brauchen eine schnelle, aber geordnete Einschätzung. Wir priorisieren nach Dringlichkeit und sagen klar, wann ein Praxisbesuch, Rückruf oder Notfallkontakt nötig ist.',
    cards: [
      { icon: 'PhoneCall', title: 'Direkt anmelden', text: 'Bitte rufen Sie bei akuten Beschwerden zuerst an.', items: ['Telefon', 'Dringlichkeit'] },
      { icon: 'Thermometer', title: 'Symptome nennen', text: 'Fieber, Atemnot, Brustschmerz oder starke Schmerzen bitte sofort nennen.', items: ['Symptome', 'Warnzeichen'] },
      { icon: 'UserRoundCheck', title: 'Terminfenster erhalten', text: 'Wir geben ein realistisches Zeitfenster statt langer Wartezeit ohne Orientierung.', items: ['Zeitfenster', 'Rückruf'] },
      { icon: 'Ambulance', title: 'Notfall erkennen', text: 'Bei lebensbedrohlichen Symptomen gilt immer 112.', items: ['112', 'Notfall'] },
    ],
  },
];

const tenant = {
  slug: 'medical',
  pat: PAT,
  host: 'www.demo.flamingomedia.online',
  wipe: true,
  publish: true,

  style: { style: 'classic' },

  brand: {
    companyName: 'Praxis am Stadtgarten',
    tagline: 'Hausärztliche Medizin · Vorsorge · Diagnostik in Stuttgart-West',
    primaryColor: C.brand,
    secondaryColor: C.teal,
    accentColor: C.coral,
    logoDisplay: 'name',
    headingFont: 'Manrope',
    bodyFont: 'Inter',
    topBarColor: '#06272E',
    footerColor: '#06272E',
  },

  contact: {
    phone: '+49 711 2486190',
    email: 'kontakt@praxis-stadtgarten.de',
    address: 'Rotebühlstraße 102, 70178 Stuttgart',
    whatsapp: '+49 176 2486190',
    whatsappEnabled: false,
    whatsappColor: '#25D366',
  },

  design: {
    sectionBg: '#FFFFFF',
    sectionBgAlt: C.mist,
    cardBg: '#FFFFFF',
    cardBorder: '#D9E8E5',
    heading: C.ink,
    subheading: C.brand,
    body: C.body,
    muted: C.muted,
    brand: C.brand,
    accent: C.coral,
    icon: C.brand,
    btnBg: C.brand,
    btnText: '#FFFFFF',
    badgeBg: '#E6F3F1',
    badgeText: C.brand,
    badgeBorder: '#C7E1DC',
    dividerColor: '#D9E8E5',
    eyebrow: C.teal,
    statValue: C.brand,
    quote: C.body,
    ratingStar: '#D9A441',
    check: C.teal,
    onDarkHeading: '#FFFFFF',
    onDarkBody: 'rgba(255,255,255,0.92)',
    onDarkMuted: 'rgba(255,255,255,0.72)',
  },

  socialLinks: {
    google: 'https://g.page/praxis-am-stadtgarten-stuttgart',
  },

  openingHours: {
    hours: [
      { type: 'regular', day: 'Montag', hours: '08:00 – 12:30 · 15:00 – 18:00' },
      { type: 'regular', day: 'Dienstag', hours: '08:00 – 12:30 · 14:00 – 17:00' },
      { type: 'regular', day: 'Mittwoch', hours: '08:00 – 13:00' },
      { type: 'regular', day: 'Donnerstag', hours: '08:00 – 12:30 · 15:00 – 18:00' },
      { type: 'regular', day: 'Freitag', hours: '08:00 – 13:00' },
      { type: 'regular', day: 'Samstag', closed: true, note: 'Ärztlicher Bereitschaftsdienst: 116 117' },
      { type: 'regular', day: 'Sonntag', closed: true, note: 'Notfall: 112' },
    ],
  },

  formFields: {
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true, halfWidth: true },
      { name: 'email', label: 'E-Mail', type: 'email', required: true, halfWidth: true },
      { name: 'phone', label: 'Telefon', type: 'tel', required: false, halfWidth: true },
      { name: 'birthDate', label: 'Geburtsdatum', type: 'text', required: false, halfWidth: true },
      { name: 'topic', label: 'Anliegen', type: 'select', required: true, options: ['Akute Beschwerden', 'Vorsorge', 'Labor/Befund', 'Rezept/Überweisung', 'Ersttermin', 'Sonstiges'] },
      { name: 'message', label: 'Nachricht', type: 'textarea', required: true, placeholder: 'Bitte keine hochsensiblen Details senden. Nennen Sie kurz Anliegen, Dringlichkeit und Rückrufnummer.' },
    ],
  },

  seoGlobal: {
    titleTemplate: '%s | Praxis am Stadtgarten Stuttgart',
    defaultTitle: 'Praxis am Stadtgarten — Hausarztpraxis in Stuttgart-West',
    defaultDescription: 'Hausärztliche Praxis in Stuttgart-West für Allgemeinmedizin, Vorsorge, Diagnostik und Akutsprechstunde. Ruhige Medizin, klare Befunde, kurze Wege.',
    defaultOgImage: heroImage,
    locale: 'de_DE',
  },

  navigation: {
    items: [
      { label: 'Startseite', href: '/' },
      { label: 'Leistungen', href: '/leistungen' },
      { label: 'Termine', href: '/termine' },
      { label: 'Praxis', href: '/praxis' },
      { label: 'Team', href: '/team' },
      { label: 'Ratgeber', href: '/news' },
      { label: 'Kontakt', href: '/kontakt' },
    ],
    cta: { label: 'Termin anfragen', href: '/kontakt' },
  },

  footer: {
    columns: [
      { title: 'Leistungen', items: services.map((s) => ({ text: s.title, href: `/c/leistungen/${s.slug}` })) },
      { title: 'Praxis', items: [
        { text: 'Termine', href: '/termine' },
        { text: 'Praxisräume', href: '/praxis' },
        { text: 'Team', href: '/team' },
        { text: 'Ratgeber', href: '/news' },
      ]},
      { title: 'Kontakt', items: [
        { text: 'Anfahrt', href: '/kontakt' },
        { text: 'Telefon', href: 'tel:+497112486190' },
        { text: 'E-Mail', href: 'mailto:kontakt@praxis-stadtgarten.de' },
        { text: 'Bereitschaftsdienst 116 117', href: 'tel:116117' },
      ]},
    ],
    legalLinks: [
      { label: 'Impressum', href: '/impressum' },
      { label: 'Datenschutz', href: '/datenschutz' },
    ],
    cta: { label: 'Termin anfragen', href: '/kontakt' },
  },

  collections: [
    { key: 'leistungen', label: 'Leistungen', items: services.map(buildServiceItem) },
    { key: 'news', label: 'Ratgeber', items: [
      {
        title: 'Welche Werte beim Check-up wirklich wichtig sind',
        slug: 'check-up-werte',
        excerpt: 'Laborwerte sind kein Orakel. Entscheidend ist, was sie im Zusammenhang mit Alltag, Vorgeschichte und Risiko bedeuten.',
        data: { excerpt: 'Laborwerte verständlich einordnen.', sections: [
          { id: uuid(), ...collectionHero('Welche Werte beim Check-up wirklich wichtig sind', 'Ein kurzer Ratgeber zur sinnvollen Vorbereitung auf Vorsorge und Labor.', img('1576091160550-2173dba999ef'), 'Ratgeber') },
          { id: uuid(), type: 'richText', data: { headline: 'Nicht jeder Wert braucht Aktion', content: '<p>Laborwerte helfen, wenn sie eingeordnet werden. Ein einzelner leicht erhöhter Wert ist oft weniger aussagekräftig als Verlauf, Beschwerden, Medikamente und familiäre Risiken.</p><p>Bringen Sie vorhandene Befunde mit. So können wir Veränderungen erkennen und unnötige Doppeluntersuchungen vermeiden.</p>' } },
          { id: uuid(), type: 'patientInfo', data: { headline: 'Vor dem Check-up', cards: services[1].cards } },
          { id: uuid(), ...cta('Check-up sinnvoll planen?', 'Wir sagen Ihnen, welche Untersuchung für Ihre Situation passt.') },
        ]},
      },
      {
        title: 'Akut krank: Wann Praxis, Bereitschaftsdienst oder Notruf?',
        slug: 'akut-bereitschaft-notruf',
        excerpt: 'Eine einfache Orientierung, wann welche Anlaufstelle sinnvoll ist.',
        data: { excerpt: 'Orientierung bei akuten Beschwerden.', sections: [
          { id: uuid(), ...collectionHero('Akut krank: Wann Praxis, Bereitschaftsdienst oder Notruf?', 'Was dringend ist, soll schnell richtig landen.', img('1580281658626-ee379f3cce93'), 'Ratgeber') },
          { id: uuid(), type: 'emergencyInfo', data: { headline: 'Schnell richtig entscheiden', introText: 'Bei Lebensgefahr immer 112. Bei Beschwerden, die nicht bis zum nächsten Werktag warten können, hilft 116 117.', items: [
            { title: 'Praxis', text: 'Für akute, aber stabile Beschwerden während unserer Sprechzeiten.', phoneLabel: '0711 2486190', phoneHref: 'tel:+497112486190' },
            { title: '116 117', text: 'Für medizinische Hilfe außerhalb der Sprechzeiten, wenn es nicht lebensbedrohlich ist.', phoneLabel: '116 117', phoneHref: 'tel:116117' },
            { title: '112', text: 'Bei Atemnot, Brustschmerz, Lähmung, Bewusstlosigkeit oder schweren Verletzungen.', phoneLabel: '112', phoneHref: 'tel:112' },
          ] } },
          faqSection(),
          { id: uuid(), ...cta('Unsicher, ob es dringend ist?', 'Rufen Sie bitte an. Wir helfen bei der Einordnung.') },
        ]},
      },
      {
        title: 'Befunde verstehen: Warum Rückfragen ausdrücklich erlaubt sind',
        slug: 'befunde-verstehen',
        excerpt: 'Medizin wird besser, wenn Patientinnen und Patienten verstehen, was als nächstes passiert.',
        data: { excerpt: 'Befunde verständlich besprechen.', sections: [
          { id: uuid(), ...collectionHero('Befunde verstehen', 'Warum gute Medizin mit verständlicher Sprache beginnt.', img('1581595219315-a187dd40c322'), 'Ratgeber') },
          { id: uuid(), type: 'richText', data: { headline: 'Nachfragen spart Wege', content: '<p>Unklare Befunde verunsichern. Deshalb erklären wir, was ein Ergebnis bedeutet, welche Grenzen es hat und welcher nächste Schritt medizinisch sinnvoll ist.</p><p>Notieren Sie Ihre Fragen vor dem Termin. Häufig geht es nicht um viele Fragen, sondern um die richtigen drei.</p>' } },
          { id: uuid(), type: 'processSteps', data: { badgeText: 'Befundgespräch', headline: 'Drei Schritte für mehr Klarheit', steps: [
            { icon: 'FileSearch', title: 'Befund ansehen', text: 'Was wurde untersucht und warum?' },
            { icon: 'MessageCircle', title: 'Bedeutung erklären', text: 'Was heißt das Ergebnis für Sie konkret?' },
            { icon: 'CheckCircle2', title: 'Plan festlegen', text: 'Kontrolle, Therapie oder Entwarnung.' },
          ] } },
          { id: uuid(), ...cta('Befund besprechen?', 'Senden Sie uns keine sensiblen Details per Formular, sondern vereinbaren Sie einen Termin zur Besprechung.') },
        ]},
      },
    ]},
  ],

  pages: [
    {
      slug: '',
      title: 'Startseite',
      sections: [
        heroSection({
          headline: 'Medizin, die erklärt, bevor sie entscheidet.',
          subline: 'Die Praxis am Stadtgarten verbindet hausärztliche Versorgung, Vorsorge und Diagnostik mit klarer Kommunikation. Sie sollen verstehen, was wir tun und warum.',
          badgeText: 'Praxis in Stuttgart-West',
        }),
        { type: 'socialProofBar', data: { bgStyle: 'light', items: [
          { value: '4,8/5', label: 'Patientenstimmen', icon: 'Star' },
          { value: 'same day', label: 'Akute Einordnung', icon: 'Clock' },
          { value: '3', label: 'Ärztinnen & Ärzte', icon: 'Users' },
          { value: 'zentral', label: 'Stuttgart-West', icon: 'MapPin' },
        ] } },
        { type: 'patientInfo', data: { headline: 'Gut vorbereitet heißt nicht perfekt vorbereitet.', subline: 'Ein paar Angaben reichen oft, damit wir schneller richtig einsteigen.', introText: 'Wir fragen nach Beschwerden, Medikamenten, Vorerkrankungen und Ihrer Dringlichkeit. Daraus entsteht ein Terminweg, der zu Ihrem Anliegen passt.', cards: services[0].cards } },
        { type: 'servicesGrid', data: { badgeText: 'Leistungen', headline: 'Versorgung mit klarer Einordnung.', subline: 'Von akuten Beschwerden bis Vorsorge: Wir schauen auf Verlauf, Alltag und medizinische Priorität.', ctaLabel: 'Alle Leistungen ansehen', ctaHref: '/leistungen', manualCards: services.map((s) => ({ title: s.title, text: s.excerpt, icon: 'Stethoscope', href: `/c/leistungen/${s.slug}` })) } },
        { type: 'featureShowcase', data: { badge: 'Diagnostik', headline: 'Befunde sind nur hilfreich, wenn man sie versteht.', subline: 'Wir nutzen Labor, EKG und Ultraschall gezielt und erklären Ergebnisse ohne Fachsprachen-Nebel.', text: '<p>Diagnostik soll Sicherheit geben, nicht neue Unsicherheit erzeugen. Deshalb besprechen wir, was ein Ergebnis bedeutet, was es nicht bedeutet und wann Kontrolle nötig ist.</p>', image: diagnosticsImage, features: ['Laborwerte mit Verlauf', 'Ultraschall nach Fragestellung', 'EKG bei passenden Beschwerden', 'Rückfragen ausdrücklich erlaubt'], ctaLabel: 'Diagnostik ansehen', ctaHref: '/c/leistungen/diagnostik-labor', reversed: true } },
        { type: 'processSteps', data: { badgeText: 'Ablauf', headline: 'So kommt Ihr Anliegen in die richtige Spur.', steps: [
          { icon: 'MessageSquareText', title: 'Anliegen nennen', text: 'Kurz beschreiben, was los ist und wie dringend es wirkt.' },
          { icon: 'ListChecks', title: 'Terminart wählen', text: 'Akut, Kontrolle, Vorsorge oder Befundgespräch.' },
          { icon: 'Stethoscope', title: 'Untersuchen & erklären', text: 'Wir prüfen gezielt und sprechen verständlich über die nächsten Schritte.' },
          { icon: 'FileCheck2', title: 'Plan mitnehmen', text: 'Sie wissen, was zu tun ist und wann Kontrolle sinnvoll ist.' },
        ] } },
        { type: 'bentoGrid', data: { headline: 'Was unsere Praxis ruhig macht.', subline: 'Nicht lauter, sondern klarer: kurze Wege, saubere Dokumentation und ein Team, das Rückfragen ernst nimmt.', items: [
          { title: 'Akutfälle zuerst sortieren', text: 'Dringliches wird telefonisch eingeordnet und bekommt klare Priorität.', icon: 'PhoneCall', span: '2' },
          { title: 'Befunde in Alltagssprache', text: 'Wir erklären Werte, Bilder und Berichte so, dass Entscheidungen nachvollziehbar bleiben.', icon: 'FileText' },
          { title: 'Vorsorge ohne Panik', text: 'Risikofaktoren prüfen, aber keine unnötige Angst erzeugen.', icon: 'ShieldCheck' },
          { title: 'Diskrete Kommunikation', text: 'Gesundheitsdaten gehören nicht in lange unsichere Nachrichtenketten.', icon: 'Lock' },
        ] } },
        { type: 'statsCounter', data: { headline: 'Zahlen, die Orientierung geben.', subline: 'Kurz gehalten, damit sie nicht wichtiger wirken als das Gespräch.', stats: [
          { value: 3, label: 'Ärzte' },
          { value: 24, suffix: 'h', label: 'Rückrufziel' },
          { value: 8, label: 'Leistungsbereiche' },
          { value: 1, label: 'fester Praxisort' },
        ] } },
        { type: 'doctorTeam', data: { badgeText: 'Team', headline: 'Ein Team, das lieber sauber erklärt als schnell abwinkt.', subline: 'Medizinische Erfahrung, klare Rollen und ein freundlicher Empfang machen die Praxis planbar.', doctors: [
          { name: 'Dr. Helena Berger', title: 'Fachärztin für Allgemeinmedizin', specialty: 'Vorsorge, Innere Medizin, Ultraschall', bio: 'Legt Wert auf verständliche Befundgespräche und realistische Therapiepläne.', image: teamImage, languages: ['Deutsch', 'Englisch'], appointmentCta: { label: 'Termin anfragen', href: '/kontakt' } },
          { name: 'Dr. Tobias Kern', title: 'Facharzt für Allgemeinmedizin', specialty: 'Akutmedizin, EKG, chronische Erkrankungen', bio: 'Sortiert akute Beschwerden ruhig und priorisiert, was wirklich dringend ist.', image: img('1537368910025-700350fe46c7'), languages: ['Deutsch'], appointmentCta: { label: 'Kontakt', href: '/kontakt' } },
          { name: 'Mira Özdemir', title: 'Praxismanagerin', specialty: 'Terminwege, Labor, Befundorganisation', bio: 'Hält Abläufe zusammen und sorgt dafür, dass Rückmeldungen nicht liegen bleiben.', image: img('1607746882042-944635dfe10e'), languages: ['Deutsch', 'Türkisch'], appointmentCta: { label: 'Praxis kontaktieren', href: '/kontakt' } },
        ] } },
        { type: 'timeline', data: { badge: 'Praxisrhythmus', headline: 'Vom ersten Kontakt bis zur Kontrolle.', subline: 'Planbar für Patientinnen und Patienten, klar für unser Team.', entries: [
          { year: '01', title: 'Kontakt', text: 'Sie nennen Anlass, Dringlichkeit und Rückrufnummer.' },
          { year: '02', title: 'Einordnung', text: 'Wir wählen Terminart, Laborbedarf oder Rückruf.' },
          { year: '03', title: 'Termin', text: 'Untersuchung und Gespräch mit verständlicher Zusammenfassung.' },
          { year: '04', title: 'Kontrolle', text: 'Bei Bedarf planen wir Labor, Verlauf oder Facharztkontakt.' },
        ] } },
        { type: 'testimonials', data: { headline: 'Was Patientinnen und Patienten häufig nennen.', items: [
          { quote: 'Ich hatte zum ersten Mal das Gefühl, Laborwerte wirklich verstanden zu haben.', name: 'Patientin, 42', context: 'Check-up', rating: 5 },
          { quote: 'Akut angerufen, sinnvoll eingeordnet und ohne Hektik behandelt.', name: 'Patient, 57', context: 'Akutsprechstunde', rating: 5 },
          { quote: 'Die Praxis erklärt, ohne von oben herab zu sprechen.', name: 'Patientin, 36', context: 'Befundgespräch', rating: 5 },
        ] } },
        { type: 'newsPreview', data: { headline: 'Ratgeber aus der Praxis.', subline: 'Kurze Texte zu Vorsorge, Befunden und der Frage, wann welche Anlaufstelle sinnvoll ist.', collectionKey: 'news', linkLabel: 'Alle Ratgeber lesen', linkHref: '/news' } },
        faqSection(),
        cta(),
      ],
      seo: { metaTitle: 'Hausarztpraxis in Stuttgart-West', metaDescription: 'Praxis am Stadtgarten in Stuttgart-West: Allgemeinmedizin, Vorsorge, Diagnostik, Akutsprechstunde und verständliche Befundgespräche.' },
    },
    {
      slug: 'leistungen',
      title: 'Leistungen',
      sections: [
        collectionHero('Leistungen mit klarer Einordnung.', 'Wir behandeln nicht nur einzelne Werte, sondern schauen auf Beschwerden, Verlauf und Alltag.', img('1581595219315-a187dd40c322'), 'Medizinische Leistungen'),
        { type: 'serviceOverview', data: { headline: 'Unsere Schwerpunkte', subline: 'Vier Bereiche, die viele Anliegen in der Praxis sinnvoll abdecken.', items: services.map((s) => ({ title: s.title, text: s.excerpt, image: s.image, icon: 'Stethoscope', cta: { label: 'Mehr dazu', href: `/c/leistungen/${s.slug}` } })) } },
        { type: 'collectionList', data: { headline: 'Alle Leistungen', subline: 'Jede Leistung mit Details, Vorbereitung und Termin-Hinweisen.', collectionKey: 'leistungen', columns: 2, showImage: true, showExcerpt: true } },
        { type: 'comparisonTable', data: { badge: 'Terminarten', headline: 'Welche Terminart passt?', text: 'Damit Anliegen nicht im falschen Zeitfenster landen.', columns: [{ label: 'Akut' }, { label: 'Geplant' }, { label: 'Befund' }], rows: [
          { feature: 'Typisches Anliegen', values: ['Infekt, Schmerz, plötzlich schlechter', 'Vorsorge, Kontrolle, Impfstatus', 'Labor, Bericht, Verlauf'] },
          { feature: 'Vorbereitung', values: ['Symptome kurz notieren', 'Vorbefunde mitbringen', 'Fragen vorbereiten'] },
          { feature: 'Kontaktweg', values: ['Telefonisch anmelden', 'Formular oder Telefon', 'Termin zur Besprechung'] },
        ], highlightCol: -1 } },
        faqSection(),
        cta('Nicht sicher, welche Leistung passt?', 'Beschreiben Sie kurz Ihr Anliegen. Wir ordnen es vor dem Termin ein.'),
      ],
      seo: { metaTitle: 'Leistungen', metaDescription: 'Hausärztliche Leistungen der Praxis am Stadtgarten: Versorgung, Vorsorge, Diagnostik und Akutsprechstunde in Stuttgart-West.' },
    },
    {
      slug: 'termine',
      title: 'Termine',
      sections: [
        collectionHero('Termine ohne Rätselraten.', 'Akut, Kontrolle, Vorsorge oder Befundgespräch: Der passende Termin beginnt mit der richtigen Einordnung.', img('1576091160550-2173dba999ef'), 'Termine'),
        { type: 'appointmentCta', data: { headline: 'Termin oder Rückruf anfragen', subline: 'Wir melden uns mit einem passenden Vorschlag oder sagen, wenn ein anderer Kontaktweg sinnvoller ist.', introText: 'Bitte senden Sie über das Formular keine vollständigen Diagnosen oder sensiblen Unterlagen. Eine kurze Einordnung reicht.', onlineCta: { label: 'Anfrage senden', href: '/kontakt' }, phoneCta: { label: '0711 2486190', href: 'tel:+497112486190' }, notes: ['Akute Beschwerden bitte telefonisch anmelden.', 'Bei Lebensgefahr immer 112.', 'Für Bereitschaftsdienst außerhalb der Sprechzeiten: 116 117.'] } },
        { type: 'openingHours', data: { headline: 'Sprechzeiten', days: [
          { label: 'Montag', hours: '08:00 – 12:30 · 15:00 – 18:00' },
          { label: 'Dienstag', hours: '08:00 – 12:30 · 14:00 – 17:00' },
          { label: 'Mittwoch', hours: '08:00 – 13:00' },
          { label: 'Donnerstag', hours: '08:00 – 12:30 · 15:00 – 18:00' },
          { label: 'Freitag', hours: '08:00 – 13:00' },
        ] } },
        { type: 'emergencyInfo', data: { headline: 'Wenn es dringend ist', introText: 'Bitte wählen Sie den richtigen Kontaktweg, damit Hilfe nicht verzögert wird.', items: [
          { title: 'Praxis', text: 'Während der Sprechzeiten für akute, aber stabile Beschwerden.', phoneLabel: '0711 2486190', phoneHref: 'tel:+497112486190' },
          { title: '116 117', text: 'Ärztlicher Bereitschaftsdienst außerhalb der Sprechzeiten.', phoneLabel: '116 117', phoneHref: 'tel:116117' },
          { title: '112', text: 'Notruf bei Atemnot, Brustschmerz, Lähmung, Bewusstlosigkeit oder Lebensgefahr.', phoneLabel: '112', phoneHref: 'tel:112' },
        ] } },
        { type: 'downloadForms', data: { badgeText: 'Vorbereitung', headline: 'Unterlagen, die Wege verkürzen.', subline: 'Wenn vorhanden, bringen Sie bitte diese Dinge mit.', items: [
          { title: 'Medikamentenliste', text: 'Aktuelle Einnahme inklusive Dosierung.', fileLabel: 'Zum Termin mitbringen', metaLabel: 'wichtig' },
          { title: 'Vorbefunde', text: 'Labor, Arztbriefe, Krankenhausberichte oder Bildgebung.', fileLabel: 'Als Kopie', metaLabel: 'hilfreich' },
          { title: 'Impfpass', text: 'Besonders bei Check-up, Reise oder Auffrischung.', fileLabel: 'Original genügt', metaLabel: 'optional' },
          { title: 'Versichertenkarte', text: 'Bitte bei jedem Quartalskontakt mitbringen.', fileLabel: 'Pflicht', metaLabel: 'administrativ' },
        ] } },
        cta('Termin richtig einordnen lassen?', 'Rufen Sie an oder senden Sie eine kurze Anfrage. Wir melden uns mit dem passenden nächsten Schritt.'),
      ],
      seo: { metaTitle: 'Termine & Sprechzeiten', metaDescription: 'Termin, Rückruf oder Akutsprechstunde in der Praxis am Stadtgarten Stuttgart-West. Sprechzeiten, Kontaktwege und Vorbereitung.' },
    },
    {
      slug: 'praxis',
      title: 'Praxis',
      sections: [
        collectionHero('Eine Praxis, die nicht nach Hektik aussieht.', 'Ruhige Räume, klare Wege und kurze Distanzen helfen, dass Termine geordnet bleiben.', practiceImage, 'Praxisräume'),
        { type: 'practiceGallery', data: { badgeText: 'Einblicke', headline: 'Räume mit Orientierung.', subline: 'Empfang, Wartebereich, Labor und Sprechzimmer sind bewusst klar gehalten.', images: [
          { src: practiceImage, alt: 'heller Empfang der Praxis', caption: 'Empfang', category: 'Ankommen' },
          { src: waitingImage, alt: 'ruhiger Wartebereich', caption: 'Wartebereich', category: 'Warten' },
          { src: diagnosticsImage, alt: 'Diagnostikarbeitsplatz', caption: 'Diagnostik', category: 'Untersuchung' },
          { src: img('1666214280557-f1b5022eb634'), alt: 'Sprechzimmer mit Schreibtisch', caption: 'Sprechzimmer', category: 'Gespräch' },
        ] } },
        { type: 'equipmentHighlights', data: { headline: 'Ausstattung mit konkretem Nutzen.', subline: 'Technik ist nur sinnvoll, wenn sie zur Fragestellung passt.', items: [
          { title: 'EKG', text: 'Zur Einordnung von Herzrhythmus, Belastung und akuten Beschwerden.', image: img('1579154341098-e4e158cc7f55'), category: 'Diagnostik', benefitLabel: 'schnelle Orientierung' },
          { title: 'Ultraschall', text: 'Schonende Bildgebung bei gezielten Fragestellungen.', image: diagnosticsImage, category: 'Sonografie', benefitLabel: 'ohne Strahlung' },
          { title: 'Labororganisation', text: 'Blutentnahmen, Verlaufskontrollen und strukturierte Rückmeldung.', image: img('1581093588401-fbb62a02f120'), category: 'Labor', benefitLabel: 'klare Rückmeldung' },
        ] } },
        { type: 'valuesGrid', data: { headline: 'Was uns im Praxisalltag wichtig ist.', subline: 'Ruhige Medizin entsteht nicht zufällig.', items: [
          { icon: 'MessageCircle', title: 'Verständlichkeit', text: 'Sie sollen wissen, warum wir etwas empfehlen.' },
          { icon: 'Clock', title: 'Planbarkeit', text: 'Wir sagen, was heute geht und was einen eigenen Termin braucht.' },
          { icon: 'Lock', title: 'Vertraulichkeit', text: 'Gesundheitsdaten behandeln wir mit der nötigen Sorgfalt.' },
          { icon: 'Handshake', title: 'Zusammenarbeit', text: 'Fachärzte, Kliniken und Therapie werden bei Bedarf eingebunden.' },
        ] } },
        { type: 'locationContact', data: { headline: 'Zentral in Stuttgart-West.', subline: 'Gut erreichbar mit ÖPNV und kurze Wege vom Stadtgarten.', mapEmbedUrl: 'https://www.google.com/maps?q=Roteb%C3%BChlstra%C3%9Fe%20102%2C%2070178%20Stuttgart&output=embed', formEnabled: false, infoCards: [
          { icon: 'MapPin', label: 'Adresse', value: 'Rotebühlstraße 102, 70178 Stuttgart' },
          { icon: 'Train', label: 'ÖPNV', value: 'Nähe Schwabstraße und Stadtmitte' },
          { icon: 'Phone', label: 'Telefon', value: '0711 2486190' },
          { icon: 'Mail', label: 'E-Mail', value: 'kontakt@praxis-stadtgarten.de' },
        ] } },
        cta('Möchten Sie vor dem Termin etwas klären?', 'Eine kurze Anfrage reicht. Wir melden uns mit dem passenden Kontaktweg.'),
      ],
      seo: { metaTitle: 'Praxisräume & Ausstattung', metaDescription: 'Praxisräume, Diagnostik und Standort der Praxis am Stadtgarten in Stuttgart-West.' },
    },
    {
      slug: 'team',
      title: 'Team',
      sections: [
        collectionHero('Medizin ist Teamarbeit.', 'Vom Empfang bis zum Befundgespräch: Gute Abläufe brauchen klare Rollen.', teamImage, 'Team'),
        { type: 'doctorTeam', data: { badgeText: 'Ärztinnen & Praxisorganisation', headline: 'Menschen, die zuhören und sortieren.', subline: 'Unser Team verbindet medizinische Erfahrung mit ruhiger Kommunikation.', doctors: [
          { name: 'Dr. Helena Berger', title: 'Fachärztin für Allgemeinmedizin', specialty: 'Vorsorge, Innere Medizin, Ultraschall', bio: 'Achtet darauf, dass Patientinnen und Patienten Befunde wirklich verstehen.', image: teamImage, languages: ['Deutsch', 'Englisch'], appointmentCta: { label: 'Termin anfragen', href: '/kontakt' } },
          { name: 'Dr. Tobias Kern', title: 'Facharzt für Allgemeinmedizin', specialty: 'Akutmedizin, EKG, chronische Erkrankungen', bio: 'Priorisiert akute Beschwerden und erklärt Therapieentscheidungen klar.', image: img('1537368910025-700350fe46c7'), languages: ['Deutsch'], appointmentCta: { label: 'Kontakt aufnehmen', href: '/kontakt' } },
          { name: 'Mira Özdemir', title: 'Praxismanagerin', specialty: 'Labor, Terminwege, Befundorganisation', bio: 'Sorgt dafür, dass Rückrufe, Befunde und Formulare nicht im Alltag untergehen.', image: img('1607746882042-944635dfe10e'), languages: ['Deutsch', 'Türkisch'], appointmentCta: { label: 'Praxis kontaktieren', href: '/kontakt' } },
        ] } },
        { type: 'team', data: { badgeText: 'Praxisalltag', headline: 'Was Sie von uns erwarten können.', subline: 'Keine perfekte Medizin versprechen, sondern sorgfältige Arbeit anbieten.', membersHeadline: 'Teamrollen', members: [
          { name: 'Dr. Helena Berger', role: 'Ärztliche Leitung', image: teamImage, bio: 'Vorsorge, Diagnostik und strukturierte Befundgespräche.' },
          { name: 'Dr. Tobias Kern', role: 'Akutsprechstunde', image: img('1537368910025-700350fe46c7'), bio: 'Akutmedizin, EKG und chronische Verläufe.' },
          { name: 'Mira Özdemir', role: 'Praxismanagement', image: img('1607746882042-944635dfe10e'), bio: 'Termine, Labor und Kommunikation.' },
        ], storyHeadline: 'Warum wir langsam erklären.', storyText: 'Viele medizinische Missverständnisse entstehen nicht durch fehlende Werte, sondern durch fehlende Einordnung. Deshalb nehmen wir uns Zeit für Sprache, Reihenfolge und nächste Schritte.', storyImage: diagnosticsImage, valuesHeadline: 'Arbeitsweise', values: [
          { icon: 'Ear', title: 'Zuhören', text: 'Was Sie schildern, ist der Anfang der Diagnostik.' },
          { icon: 'Search', title: 'Einordnen', text: 'Nicht jeder Wert ist gleich wichtig.' },
          { icon: 'ClipboardCheck', title: 'Dokumentieren', text: 'Damit Verläufe nachvollziehbar bleiben.' },
          { icon: 'MessageCircle', title: 'Erklären', text: 'Damit Entscheidungen nicht im Nebel bleiben.' },
        ], stats: [
          { value: '3', label: 'feste Ansprechpartner' },
          { value: '2', label: 'ärztliche Schwerpunkte' },
          { value: '1', label: 'gemeinsamer Praxisrhythmus' },
        ] } },
        { type: 'timeline', data: { badge: 'Zusammenarbeit', headline: 'So arbeitet das Team zusammen.', entries: [
          { year: 'Morgens', title: 'Akute Fälle sortieren', text: 'Telefon, Rückrufe und Labor werden priorisiert.' },
          { year: 'Mittags', title: 'Befunde prüfen', text: 'Auffällige Werte werden nicht bis zum nächsten Zufallskontakt geparkt.' },
          { year: 'Nachmittags', title: 'Gespräche führen', text: 'Kontrollen, Vorsorge und Besprechungen bekommen eigene Zeitfenster.' },
          { year: 'Laufend', title: 'Nachfassen', text: 'Offene Rückmeldungen werden im Team nachgehalten.' },
        ] } },
        faqSection(),
        cta('Sie möchten uns kennenlernen?', 'Senden Sie uns kurz Ihr Anliegen. Wir melden uns mit einem passenden Terminweg.'),
      ],
      seo: { metaTitle: 'Team', metaDescription: 'Das Team der Praxis am Stadtgarten: Ärztliche Versorgung, Praxismanagement und klare Befundkommunikation in Stuttgart-West.' },
    },
    {
      slug: 'ueber-uns',
      title: 'Über uns',
      sections: [
        collectionHero('Hausarztpraxis mit ruhigem Anspruch.', 'Wir glauben, dass gute Medizin auch gute Erklärung braucht.', img('1576091160550-2173dba999ef'), 'Über uns'),
        { type: 'textImage', data: { badge: 'Haltung', headline: 'Wir nehmen Tempo raus, wo Hektik nichts verbessert.', text: '<p>Die Praxis am Stadtgarten ist eine hausärztliche Praxis für Menschen, die nicht nur eine Diagnose, sondern eine verständliche Einordnung möchten. Wir behandeln akute Beschwerden, begleiten chronische Verläufe und planen Vorsorge so, dass sie zum Leben passt.</p><p>Unser Anspruch ist nicht, alles lauter zu machen. Wir wollen sauber zuhören, gezielt untersuchen und klar sagen, was der nächste sinnvolle Schritt ist.</p>', image: waitingImage, imageAlt: 'ruhiger Wartebereich', layout: 'image-left', primaryCta: { label: 'Praxis kennenlernen', href: '/praxis', icon: 'ArrowRight' } } },
        { type: 'statsCounter', data: { headline: 'Kleine Praxis, klare Verantwortung.', stats: [
          { value: 3, label: 'Teamrollen' },
          { value: 4, label: 'Kernleistungen' },
          { value: 5, label: 'Sprechzeit-Tage' },
          { value: 1, label: 'Standort' },
        ] } },
        { type: 'bentoGrid', data: { headline: 'Unsere Prinzipien.', subline: 'Einfach genug, um im Alltag zu funktionieren.', items: [
          { title: 'Erst verstehen, dann handeln', text: 'Wir fragen nach Kontext, bevor wir Werte isoliert bewerten.', icon: 'Brain', span: '2' },
          { title: 'Sensible Daten bleiben sensibel', text: 'Formulare helfen bei der Einordnung, ersetzen aber kein vertrauliches Gespräch.', icon: 'Lock' },
          { title: 'Keine unnötige Diagnostik', text: 'Untersuchungen brauchen eine Fragestellung.', icon: 'SearchCheck' },
          { title: 'Klare Sprache', text: 'Befunde sollen verstanden werden, nicht beeindrucken.', icon: 'MessageCircle' },
        ] } },
        { type: 'timeline', data: { badge: 'Praxisgeschichte', headline: 'Warum diese Praxis so arbeitet.', entries: [
          { year: '2019', title: 'Praxisübernahme', text: 'Dr. Helena Berger übernimmt die Räume am Stadtgarten und richtet die Abläufe neu aus.' },
          { year: '2021', title: 'Diagnostik erweitert', text: 'Ultraschall und Laborprozesse werden stärker in Befundgespräche eingebunden.' },
          { year: '2024', title: 'Rückrufwege geordnet', text: 'Akute Anliegen, Rezepte und Befunde bekommen klarere Kontaktwege.' },
          { year: 'Heute', title: 'Ruhiger Praxisrhythmus', text: 'Das Team arbeitet mit festen Rollen, damit Patientinnen und Patienten Orientierung bekommen.' },
        ] } },
        faqSection(),
        cta(),
      ],
      seo: { metaTitle: 'Über uns', metaDescription: 'Über die Praxis am Stadtgarten in Stuttgart-West: hausärztliche Medizin, Vorsorge, Diagnostik und verständliche Befundkommunikation.' },
    },
    {
      slug: 'news',
      title: 'Ratgeber',
      sections: [
        collectionHero('Ratgeber ohne Panikmache.', 'Kurze Einordnungen aus dem Praxisalltag: Vorsorge, Akutbeschwerden und Befunde verständlich erklärt.', img('1579684385127-1ef15d508118'), 'Ratgeber'),
        { type: 'newsPreview', data: { headline: 'Aktuelle Hinweise aus der Praxis', subline: 'Nicht als Ersatz für eine Untersuchung, sondern als Orientierung vor dem Termin.', collectionKey: 'news', linkLabel: 'Alle Beiträge', linkHref: '/news' } },
        { type: 'collectionList', data: { headline: 'Alle Ratgeber', subline: 'Lesen Sie, wie wir typische Fragen in der Praxis einordnen.', collectionKey: 'news', columns: 3, showImage: true, showExcerpt: true, showDate: true } },
        { type: 'patientInfo', data: { headline: 'Wichtig bei medizinischen Informationen', introText: 'Online-Texte können helfen, ersetzen aber keine individuelle medizinische Einschätzung.', cards: [
          { icon: 'AlertTriangle', title: 'Keine Notfallberatung', text: 'Bei starken akuten Symptomen bitte direkt medizinische Hilfe kontaktieren.', items: ['112', '116 117'] },
          { icon: 'UserRound', title: 'Kontext zählt', text: 'Alter, Vorerkrankungen und Medikamente verändern die Bewertung.', items: ['Anamnese', 'Verlauf'] },
          { icon: 'MessageCircle', title: 'Fragen notieren', text: 'Kurze Notizen helfen beim Termin oft mehr als lange Internetrecherche.', items: ['3 Fragen', 'Befunde'] },
          { icon: 'Lock', title: 'Keine sensiblen Details', text: 'Bitte keine vollständigen Diagnosen über einfache Formulare senden.', items: ['Datenschutz'] },
        ] } },
        faqSection(),
        cta('Sie haben eine konkrete Frage?', 'Senden Sie uns eine kurze Anfrage oder vereinbaren Sie ein Befundgespräch.'),
      ],
      seo: { metaTitle: 'Ratgeber', metaDescription: 'Medizinische Ratgeber der Praxis am Stadtgarten zu Vorsorge, Akutbeschwerden und Befunden. Verständliche Orientierung aus Stuttgart-West.' },
    },
    {
      slug: 'kontakt',
      title: 'Kontakt',
      sections: [
        collectionHero('Kurze Nachricht, klare Rückmeldung.', 'Bitte nennen Sie Anlass, Dringlichkeit und Rückrufnummer. Wir melden uns mit dem passenden nächsten Schritt.', img('1519494026892-80bbd2d6fd0d'), 'Kontakt'),
        { type: 'contact', data: { badgeText: 'Praxis kontaktieren', headline: 'Wie können wir helfen?', introText: 'Bitte senden Sie keine ausführlichen sensiblen Diagnosen über das Formular. Eine kurze Einordnung genügt für den richtigen Kontaktweg.', formEnabled: true, submitLabel: 'Anfrage senden', infoCards: [
          { icon: 'Phone', label: 'Telefon', value: '0711 2486190' },
          { icon: 'Mail', label: 'E-Mail', value: 'kontakt@praxis-stadtgarten.de' },
          { icon: 'MapPin', label: 'Adresse', value: 'Rotebühlstraße 102, 70178 Stuttgart' },
          { icon: 'Clock', label: 'Sprechzeiten', value: 'Mo, Di, Do mit Nachmittag · Mi und Fr bis 13 Uhr' },
        ] } },
        { type: 'locationContact', data: { headline: 'Mitten in Stuttgart-West.', subline: 'Zentral gelegen, gut erreichbar und mit klarer Anfahrt.', mapEmbedUrl: 'https://www.google.com/maps?q=Roteb%C3%BChlstra%C3%9Fe%20102%2C%2070178%20Stuttgart&output=embed', formEnabled: false, infoCards: [
          { icon: 'MapPin', label: 'Adresse', value: 'Rotebühlstraße 102, 70178 Stuttgart' },
          { icon: 'Train', label: 'ÖPNV', value: 'S-Bahn Schwabstraße, Stadtbahn Rotebühlplatz' },
          { icon: 'Accessibility', label: 'Zugang', value: 'Aufzug im Haus, bitte bei Bedarf vorher anrufen' },
          { icon: 'PhoneCall', label: 'Akut', value: 'Akute Beschwerden bitte telefonisch anmelden' },
        ] } },
        { type: 'emergencyInfo', data: { headline: 'Außerhalb der Sprechzeiten', subline: 'Bitte wählen Sie den passenden Kontakt.', items: [
          { title: 'Ärztlicher Bereitschaftsdienst', text: 'Für Beschwerden, die nicht bis zum nächsten Werktag warten können.', phoneLabel: '116 117', phoneHref: 'tel:116117' },
          { title: 'Notruf', text: 'Bei Lebensgefahr, Atemnot, Brustschmerz, Lähmung oder Bewusstlosigkeit.', phoneLabel: '112', phoneHref: 'tel:112' },
          { title: 'Praxis', text: 'Für Rückruf, Termin, Befund und organisatorische Fragen während der Sprechzeiten.', phoneLabel: '0711 2486190', phoneHref: 'tel:+497112486190' },
        ] } },
        faqSection(),
      ],
      seo: { metaTitle: 'Kontakt & Anfahrt', metaDescription: 'Kontakt, Telefon, Anfahrt und Sprechzeiten der Praxis am Stadtgarten in Stuttgart-West.' },
    },
    {
      slug: 'referenzen',
      title: 'Patientenwege',
      sections: [
        collectionHero('Patientenwege statt Referenzen.', 'Im medizinischen Kontext zeigen wir keine echten Fälle. Wir erklären typische Wege anonymisiert und vorsichtig.', img('1576091160550-2173dba999ef'), 'Patientenwege'),
        { type: 'processSteps', data: { badgeText: 'Beispiel: Check-up', headline: 'Ein geordneter Vorsorgetermin.', steps: [
          { icon: 'CalendarDays', title: 'Termin planen', text: 'Vorbefunde, Medikamente und Fragen werden vorbereitet.' },
          { icon: 'Activity', title: 'Untersuchung', text: 'Labor, Blutdruck und Anamnese werden passend kombiniert.' },
          { icon: 'FileSearch', title: 'Befundgespräch', text: 'Werte werden erklärt, nicht nur ausgehändigt.' },
          { icon: 'Repeat', title: 'Kontrolle', text: 'Nur wenn nötig wird ein sinnvoller nächster Termin geplant.' },
        ] } },
        { type: 'featureShowcase', data: { badge: 'Beispiel: Akut', headline: 'Wenn Beschwerden nicht warten sollen.', subline: 'Akute Anliegen werden telefonisch sortiert, damit Dringendes nicht in normalen Terminfenstern untergeht.', text: '<p>Wir fragen nach Warnzeichen und entscheiden, ob Praxis, Rückruf, Bereitschaftsdienst oder Notruf sinnvoll ist.</p>', image: img('1580281658626-ee379f3cce93'), features: ['Telefonische Ersteinschätzung', 'klare Warnzeichen', 'realistisches Zeitfenster', 'keine Diagnose per Formular'], ctaLabel: 'Kontakt aufnehmen', ctaHref: '/kontakt' } },
        { type: 'testimonials', data: { headline: 'Rückmeldungen, die wir ernst nehmen.', items: [
          { quote: 'Ich wusste nach dem Termin, welche Werte wichtig sind und welche nicht.', name: 'Patientin', context: 'Vorsorge', rating: 5 },
          { quote: 'Der Rückruf kam mit einer klaren Empfehlung statt nur einem Terminangebot.', name: 'Patient', context: 'Akut', rating: 5 },
          { quote: 'Die Praxis wirkt ruhig, aber nicht langsam.', name: 'Patientin', context: 'Befund', rating: 5 },
        ] } },
        faqSection(),
        cta('Möchten Sie Ihren Weg klären?', 'Wir helfen bei der Einordnung, welche Terminart zu Ihrem Anliegen passt.'),
      ],
      seo: { metaTitle: 'Patientenwege', metaDescription: 'Typische Patientenwege der Praxis am Stadtgarten: Vorsorge, Akutsprechstunde und Befundgespräch verständlich erklärt.' },
    },
    {
      slug: 'impressum',
      title: 'Impressum',
      sections: [
        { type: 'legalContent', data: { headline: 'Impressum', blocks: [
          { headline: 'Angaben gemäß § 5 TMG', text: '<p>Praxis am Stadtgarten<br>Dr. med. Helena Berger<br>Rotebühlstraße 102<br>70178 Stuttgart</p>' },
          { headline: 'Kontakt', text: '<p>Telefon: +49 711 2486190<br>E-Mail: kontakt@praxis-stadtgarten.de</p>' },
          { headline: 'Berufsbezeichnung', text: '<p>Ärztin, verliehen in der Bundesrepublik Deutschland. Zuständige Ärztekammer: Landesärztekammer Baden-Württemberg.</p>' },
          { headline: 'Berufsrechtliche Regelungen', text: '<p>Berufsordnung der Landesärztekammer Baden-Württemberg und Heilberufe-Kammergesetz Baden-Württemberg.</p>' },
          { headline: 'Haftung für Inhalte', text: '<p>Als Diensteanbieter sind wir für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Medizinische Informationen ersetzen keine individuelle ärztliche Beratung.</p>' },
        ] } },
      ],
      seo: { metaTitle: 'Impressum', metaDescription: 'Impressum der Praxis am Stadtgarten in Stuttgart-West.' },
    },
    {
      slug: 'datenschutz',
      title: 'Datenschutz',
      sections: [
        { type: 'legalContent', data: { headline: 'Datenschutzerklärung', blocks: [
          { headline: 'Verantwortliche Stelle', text: '<p>Praxis am Stadtgarten, Dr. med. Helena Berger, Rotebühlstraße 102, 70178 Stuttgart, kontakt@praxis-stadtgarten.de.</p>' },
          { headline: 'Gesundheitsdaten', text: '<p>Gesundheitsdaten sind besonders sensibel. Bitte senden Sie über allgemeine Formulare nur die Informationen, die zur Termin- oder Rückruforganisation erforderlich sind.</p>' },
          { headline: 'Kontaktformular', text: '<p>Wenn Sie uns über ein Formular kontaktieren, verarbeiten wir Ihre Angaben zur Bearbeitung der Anfrage. Die Verarbeitung erfolgt auf Grundlage Ihrer Einwilligung und zur Organisation des Praxisbetriebs.</p>' },
          { headline: 'Hosting und technische Daten', text: '<p>Beim Besuch der Website werden technisch notwendige Daten verarbeitet, um die Website sicher auszuliefern und Angriffe zu erkennen.</p>' },
          { headline: 'Rechte der Betroffenen', text: '<p>Sie haben Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung sowie Beschwerde bei einer Aufsichtsbehörde.</p>' },
        ] } },
      ],
      seo: { metaTitle: 'Datenschutz', metaDescription: 'Datenschutzerklärung der Praxis am Stadtgarten in Stuttgart-West.' },
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
