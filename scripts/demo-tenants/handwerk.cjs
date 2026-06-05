/**
 * Demo tenant: HANDWERK
 *
 * Identität: "Müller & Söhne Meisterbetrieb" — SHK-Familienbetrieb (Sanitär, Heizung, Klima)
 *            in Köln, dritte Generation, seit 1958.
 *
 * Run:
 *   node scripts/demo-tenants/handwerk.cjs
 *
 * Reads the live API instructions via /api/v1/instructions; if you want to verify
 * the schema before pushing content, dump it first with:
 *   node scripts/demo-tenants/fetch-instructions.cjs handwerk
 */

const crypto = require('crypto');
const { run } = require('./_lib/runner.cjs');

const PAT = '978b230504b8d123234c44375606f28172ee9e2d96146dcbf0892f77c3d2f7d8';

// ── helpers ───────────────────────────────────────────────────────────────────
const uuid = () => crypto.randomUUID();
const img = (id, w = 1920) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

// Brand palette — tief-blau + kupfer. Used in styleOverrides as well.
const C = {
  brand:   '#0E3A53', // tief-blau (Stahl + Wasser) — primary action color
  accent:  '#C76B2A', // gebrannter Kupfer (Rohrleitung) — eyebrows, icons, badges
  ink:     '#101820', // body text on light
  cream:   '#F5EFE6', // soft warm bg + light btn-bg on dark sections
  steel:   '#1B4D6B', // hover-blue
};

// On DARK section backgrounds we override BOTH the base slots (--token-heading,
// --token-body, --token-muted) AND the on-dark equivalents, because different
// renderer sections read different slots. Buttons use the warm cream as bg
// against the dark section so they pop without the copper accent (which is
// reserved for icons/eyebrows/stars).
const darkSectionTokens = {
  '--token-heading':         '#FFFFFF',
  '--token-body':            'rgba(255,255,255,0.92)',
  '--token-muted':           'rgba(255,255,255,0.7)',
  '--token-eyebrow':         '#E2B58D',
  '--token-on-dark-heading': '#FFFFFF',
  '--token-on-dark-body':    'rgba(255,255,255,0.92)',
  '--token-on-dark-muted':   'rgba(255,255,255,0.7)',
  '--token-btn-bg':          C.cream,
  '--token-btn-text':        C.brand,
  '--token-badge-bg':        'rgba(255,255,255,0.14)',
  '--token-badge-text':      '#FFFFFF',
  '--token-badge-border':    'rgba(255,255,255,0.28)',
};

// Light cream-section: heading stays brand-blue, body stays ink, button stays
// brand-blue + white. Used for cream-coloured CTA bands on light pages.
const lightAccentSection = {
  '--token-section-bg':  C.cream,
  '--token-heading':     C.brand,
  '--token-body':        '#2A3340',
  '--token-muted':       '#637381',
  '--token-btn-bg':      C.brand,
  '--token-btn-text':    '#FFFFFF',
};

// ── tenant spec ───────────────────────────────────────────────────────────────
const tenant = {
  slug: 'handwerk',
  pat: PAT,
  wipe: true,
  publish: true,

  style: { style: 'classic' },

  brand: {
    companyName: 'Müller & Söhne Meisterbetrieb',
    tagline: 'Sanitär · Heizung · Klima — seit 1958 in Köln',
    primaryColor: C.brand,
    secondaryColor: C.steel,
    accentColor: C.accent,
    logoDisplay: 'name',
    headingFont: 'Manrope',
    bodyFont: 'Inter',
    topBarColor: C.brand,
    footerColor: '#0A2A3D',
  },

  contact: {
    phone: '+49 221 5894120',
    email: 'service@mueller-soehne-koeln.de',
    address: 'Vorgebirgstraße 218, 50969 Köln',
    whatsapp: '+49 173 5894120',
    whatsappEnabled: true,
    whatsappColor: '#25D366',
  },

  design: {
    sectionBg: '#FFFFFF',
    sectionBgAlt: C.cream,
    cardBg: '#FFFFFF',
    cardBorder: '#E6DED1',
    heading: C.brand,
    subheading: C.steel,
    body: '#2A3340',
    muted: '#637381',
    brand: C.brand,
    accent: C.accent,
    icon: C.accent,
    btnBg: C.brand,
    btnText: '#FFFFFF',
    badgeBg: C.cream,
    badgeText: C.brand,
    badgeBorder: '#E2C9A8',
    dividerColor: '#E6DED1',
    eyebrow: C.accent,
    statValue: C.brand,
    quote: C.steel,
    ratingStar: '#E8A52B',
    check: C.accent,
    onDarkHeading: '#FFFFFF',
    onDarkBody:    'rgba(255,255,255,0.92)',
    onDarkMuted:   'rgba(255,255,255,0.7)',
  },

  socialLinks: {
    google: 'https://g.page/mueller-soehne-koeln',
    facebook: 'https://www.facebook.com/muellersoehne.koeln',
    instagram: 'https://www.instagram.com/muellersoehne.koeln/',
  },

  openingHours: {
    hours: [
      { type: 'regular', day: 'Montag',    hours: '07:30 – 17:00' },
      { type: 'regular', day: 'Dienstag',  hours: '07:30 – 17:00' },
      { type: 'regular', day: 'Mittwoch',  hours: '07:30 – 17:00' },
      { type: 'regular', day: 'Donnerstag',hours: '07:30 – 17:00' },
      { type: 'regular', day: 'Freitag',   hours: '07:30 – 15:30' },
      { type: 'regular', day: 'Samstag',   hours: 'Nur Notdienst', note: '24/7 Notdienst unter 0173 5894120' },
      { type: 'regular', day: 'Sonntag',   closed: true, note: '24/7 Notdienst unter 0173 5894120' },
    ],
  },

  formFields: {
    fields: [
      { name: 'firstName', label: 'Vorname',  type: 'text', required: true, halfWidth: true },
      { name: 'lastName',  label: 'Nachname', type: 'text', required: true, halfWidth: true },
      { name: 'email',     label: 'E-Mail',   type: 'email',required: true, halfWidth: true },
      { name: 'phone',     label: 'Telefon',  type: 'tel',  required: false,halfWidth: true },
      { name: 'topic',     label: 'Anliegen', type: 'select', required: true,
        options: ['Heizung erneuern', 'Badsanierung', 'Wartung', 'Notdienst', 'Sonstiges'] },
      { name: 'message',   label: 'Ihre Nachricht', type: 'textarea', required: true,
        placeholder: 'Beschreiben Sie kurz Ihr Anliegen — wir melden uns innerhalb von 24 h.' },
    ],
  },

  seoGlobal: {
    titleTemplate: '%s | Müller & Söhne Meisterbetrieb Köln',
    defaultTitle: 'Müller & Söhne — SHK-Meisterbetrieb in Köln',
    defaultDescription:
      'Familiengeführter SHK-Meisterbetrieb in Köln seit 1958. Heizung, Sanitär, Klima, Bäder und 24/7-Notdienst — meisterlich umgesetzt von Generation zu Generation.',
    defaultOgImage: img('1581094271901-8022df4466f9', 1200),
    locale: 'de_DE',
  },

  navigation: {
    items: [
      { label: 'Startseite',       href: '/' },
      { label: 'Leistungen',       href: '/leistungen' },
      { label: 'Referenzen',       href: '/referenzen' },
      { label: 'Über uns',         href: '/ueber-uns' },
      { label: 'Werkstattnotizen', href: '/news' },
      { label: 'Kontakt',          href: '/kontakt' },
    ],
    cta: { label: '24/7 Notdienst', href: '/kontakt' },
  },

  footer: {
    columns: [
      { title: 'Leistungen', items: [
        { text: 'Heizungssanierung', href: '/c/leistungen/heizungssanierung' },
        { text: 'Badmodernisierung', href: '/c/leistungen/badmodernisierung' },
        { text: 'Wärmepumpen',       href: '/c/leistungen/waermepumpe' },
        { text: 'Wartung & Service', href: '/c/leistungen/wartung-service' },
      ]},
      { title: 'Unternehmen', items: [
        { text: 'Über uns',          href: '/ueber-uns' },
        { text: 'Referenzen',        href: '/referenzen' },
        { text: 'Werkstattnotizen',  href: '/news' },
        { text: 'Karriere',          href: '/ueber-uns' },
      ]},
      { title: 'Service', items: [
        { text: '24/7 Notdienst',    href: '/kontakt' },
        { text: 'Termin vereinbaren', href: '/kontakt' },
        { text: 'WhatsApp',          href: 'https://wa.me/491735894120' },
      ]},
    ],
    legalLinks: [
      { label: 'Impressum',   href: '/impressum' },
      { label: 'Datenschutz', href: '/datenschutz' },
    ],
    cta: { label: 'Termin vereinbaren', href: '/kontakt' },
  },

  collections: [
    {
      key: 'leistungen', label: 'Leistungen',
      items: [
        buildServiceItem({
          slug: 'heizungssanierung',
          title: 'Heizungssanierung',
          excerpt: 'Vom Brennwertkessel bis zur Hybridanlage — fördergeprüft, planungssicher, in 2–4 Werktagen umgesetzt.',
          heroImage: '1631545806609-c11c8a4f9f1d',
          intro: 'Eine alte Heizung schluckt heute bis zu 30 % mehr Energie als nötig. Wir prüfen Ihren Bestand, rechnen die BAFA-Förderung schwarz auf weiß und tauschen Kessel, Pumpen und Regelung in der Regel innerhalb von zwei bis vier Werktagen.',
          highlights: [
            { icon: 'Flame',     title: 'Brennwerttechnik',    text: 'Gas-, Öl- und Hybridkessel der Marken Viessmann, Vaillant und Buderus — installiert vom eigenen Meisterbetrieb.' },
            { icon: 'Leaf',      title: 'Wärmepumpen-Ready',   text: 'Wir prüfen Heizkörperauslegung und Hydraulik so, dass Ihre Anlage auf einen späteren Wärmepumpenbetrieb vorbereitet ist.' },
            { icon: 'FileCheck', title: 'Förderung inklusive', text: 'Wir übernehmen den BAFA-Antrag und die Kommunikation mit Ihrem Energieberater.' },
          ],
        }),
        buildServiceItem({
          slug: 'badmodernisierung',
          title: 'Badmodernisierung',
          excerpt: 'Komplettbäder aus einer Hand — vom Aufmaß über Fliesen bis zur barrierefreien Dusche. Festpreis, Festtermin, ein Ansprechpartner.',
          heroImage: '1552321554-5fefe8c9ef14',
          intro: 'Wir planen Ihr Bad in 3D, koordinieren Fliesenleger, Elektriker und Trockenbauer und übergeben den Schlüssel im vereinbarten Zeitraum — meist drei bis sechs Wochen. Ein Ansprechpartner für alles, eine Rechnung am Ende.',
          highlights: [
            { icon: 'PenTool',       title: '3D-Planung', text: 'Sie sehen Ihr Bad vor dem ersten Hammerschlag — inkl. Lichtkonzept und Materialprobe.' },
            { icon: 'Accessibility', title: 'Barrierearm', text: 'Bodengleiche Duschen, KfW-förderfähige Umbauten, rutschhemmende Beläge nach DIN 51097.' },
            { icon: 'Handshake',     title: 'Ein Vertrag', text: 'Sie schließen einen Vertrag — wir koordinieren alle Gewerke. Keine Terminabstimmung Ihrerseits.' },
          ],
        }),
        buildServiceItem({
          slug: 'waermepumpe',
          title: 'Wärmepumpen-Installation',
          excerpt: 'Luft-Wasser- und Sole-Wärmepumpen — geplant nach hydraulischem Abgleich, eingebaut von zertifizierten Monteuren.',
          heroImage: '1604328698692-f76ea9498e76',
          intro: 'Eine Wärmepumpe arbeitet nur dann effizient, wenn die Hydraulik stimmt. Wir messen, rechnen und dimensionieren — und installieren danach. So liegt die Jahresarbeitszahl Ihrer Anlage bei unseren Projekten im Schnitt über 4,0.',
          highlights: [
            { icon: 'Gauge',     title: 'Hydraulischer Abgleich', text: 'Inklusive Pflicht, nicht Pflichtprogramm. Wir rechnen jeden Raum einzeln durch.' },
            { icon: 'Snowflake', title: 'Kältekreis-Schein',      text: 'Eigene Monteure mit Kältekreis-Zertifikat — kein Subunternehmer für den sensibelsten Teil der Anlage.' },
            { icon: 'BadgeEuro', title: 'BEG-Förderung',          text: 'Bis zu 70 % Zuschuss — wir prüfen Ihre Konstellation kostenfrei vorab.' },
          ],
        }),
        buildServiceItem({
          slug: 'wartung-service',
          title: 'Wartung & Service',
          excerpt: 'Jahreswartung mit fixem Termin im Frühjahr — damit Ihre Anlage im Winter läuft und Sie nicht in der Notdienst-Warteschlange landen.',
          heroImage: '1567789884554-0b844b597180',
          intro: 'Drei Viertel aller Heizungs-Ausfälle im Januar wären bei einer Frühjahrs-Wartung aufgefallen. Mit unserem Wartungsvertrag bekommen Sie einen festen Termin, eine schriftliche Anlagendokumentation und Vorrang im Notdienst.',
          highlights: [
            { icon: 'CalendarClock', title: 'Fester Wartungstermin', text: 'Sie wählen einen Wunschmonat — wir terminieren ein Jahr im Voraus.' },
            { icon: 'ShieldCheck',   title: 'Notdienst-Vorrang',     text: 'Wartungskund:innen kommen im Notdienst zuerst dran. Garantiert.' },
            { icon: 'ClipboardList', title: 'Anlagen-Protokoll',     text: 'Sie erhalten ein schriftliches Wartungsprotokoll — wichtig für Versicherung und späteren Eigentümerwechsel.' },
          ],
        }),
      ],
    },
    {
      key: 'referenzen', label: 'Referenzen',
      items: [
        buildProjectItem({
          slug: 'gruenderzeit-villa-marienburg',
          title: 'Gründerzeit-Villa, Köln-Marienburg',
          excerpt: 'Vollsanierung Heizung + drei Bäder in einer denkmalgeschützten Villa von 1906 — bei laufendem Bewohnerbetrieb.',
          heroImage: '1600585154340-be6161a56a0c',
          summary: 'Wir haben einen 40 Jahre alten Niedertemperaturkessel gegen eine Hybridanlage (Brennwert + Luft-Wärmepumpe) getauscht und drei Bäder im Sinne der Denkmalbehörde modernisiert — inklusive originalgetreuer Restaurierung der Schmiedeeisen-Heizkörper. Die Familie konnte während aller drei Wochen Bauzeit im Haus wohnen bleiben.',
          facts: [
            { label: 'Bauzeit',           value: '3 Wochen' },
            { label: 'Heizlast',          value: '24 kW Hybrid' },
            { label: 'Energieeinsparung', value: 'ca. 42 %' },
            { label: 'Förderung',         value: '12.500 €' },
          ],
        }),
        buildProjectItem({
          slug: 'kita-suelz-waermepumpe',
          title: 'Kita Sülz — Wärmepumpen-Umrüstung',
          excerpt: 'Umstieg auf Sole-Wärmepumpe mit Erdsondenfeld und neue Lüftungsanlage — im Sommerferienzeitraum von 6 Wochen.',
          heroImage: '1593604340846-4fbe9763a8f3',
          summary: 'Eine kommunale Kita in Köln-Sülz musste die alte Gastherme im Rahmen eines kommunalen Klimaplans austauschen. Wir haben in 6 Sommerferienwochen ein Erdsondenfeld mit 6 Bohrungen à 100 m gesetzt, eine Sole-Wärmepumpe mit 18 kW installiert und die Lüftungsanlage mit Wärmerückgewinnung erneuert. Pünktlich zur Wiedereröffnung am 1. September fertig.',
          facts: [
            { label: 'Heizlast',          value: '18 kW Sole-WP' },
            { label: 'Erdsonden',         value: '6 × 100 m' },
            { label: 'Jahresarbeitszahl', value: 'gemessen 4,3' },
            { label: 'Förderung',         value: '38 % BEG-EM' },
          ],
        }),
        buildProjectItem({
          slug: 'baeckerei-deutz',
          title: 'Bäckerei Deutz — Backstubensanierung',
          excerpt: 'Komplette Trinkwasser- und Abwasserinstallation für eine handwerkliche Bäckerei mit angeschlossenem Café.',
          heroImage: '1509440159596-0249088772ff',
          summary: 'Eine traditionsreiche Bäckerei in Deutz wollte eine neue Backstube und ein angegliedertes Café eröffnen. Wir haben Frisch- und Abwasserinstallation komplett neu verlegt, einen Fettabscheider nach DIN EN 1825 dimensioniert und eine Brauchwasser-Wärmepumpe installiert, die die Abwärme der Backöfen nutzt. Inbetriebnahme zwei Tage vor Eröffnung — auf den Punkt.',
          facts: [
            { label: 'Bauzeit',       value: '4 Wochen' },
            { label: 'Gewerke',       value: '5 koordiniert' },
            { label: 'Fettabscheider', value: 'NS 4, 1.040 l' },
            { label: 'Warmwasser-WP', value: '300 l Speicher' },
          ],
        }),
      ],
    },
    {
      key: 'news', label: 'Werkstattnotizen',
      items: [
        buildNewsItem({
          slug: 'heizungstausch-foerderung-2025',
          title: 'BEG-Förderung 2025: Was sich für Hausbesitzer:innen ändert',
          excerpt: 'Die wichtigsten Änderungen am Förderprogramm — und wie sich der richtige Antragszeitpunkt schnell auf 5.000 € auswirken kann.',
          heroImage: '1632937816203-bf6dc52b3f6c',
          body: '<p>Zum 1. Januar 2025 hat das BAFA die Förderquoten für Heizungstausch angepasst. Wir haben die wichtigsten Änderungen für Eigentümer:innen in Köln zusammengefasst und zeigen anhand zweier realer Beispiele aus Sülz und Lindenthal, wie sich der richtige Antragszeitpunkt auf bis zu 5.000 € auswirken kann.</p><p>Der Klimabonus für Heizungen, die älter als 20 Jahre sind, bleibt erhalten — wird jetzt allerdings nur noch in Verbindung mit einem hydraulischen Abgleich gewährt. Was das in der Praxis bedeutet und welche Unterlagen Sie bereithalten sollten, erklären wir im Detail.</p>',
        }),
        buildNewsItem({
          slug: 'frostschaden-vorbeugen',
          title: 'Frostschäden vermeiden: Checkliste für den Winter',
          excerpt: 'Eine Druckminderung im Herbst kann teure Rohrbrüche im Januar verhindern. Was zu prüfen ist und wann es Zeit für den Profi ist.',
          heroImage: '1545194445-dddb8f4487c6',
          body: '<p>Nach jedem Frost-Wochenende klingelt bei uns ab Montag früh um sieben das Notdienst-Telefon. Die meisten dieser Schäden wären vermeidbar gewesen. Wir teilen die Checkliste, die wir unseren Wartungskund:innen jedes Jahr im Oktober schicken.</p><p>Besonders kritisch: außen liegende Leitungen, ungedämmte Kellerräume und Ferienwohnungen. Drei Stunden Vorsorge im Herbst sparen im Schnitt drei Tage Trocknung im Januar.</p>',
        }),
        buildNewsItem({
          slug: 'wir-suchen-azubi',
          title: 'Wir suchen Azubis für 2025 — und erklären, was uns unterscheidet',
          excerpt: 'Drei Ausbildungsplätze, ein Meisterbetrieb in dritter Generation, zwei Berufsschultage und ein eigenes Lehrbad. Warum sich das lohnt.',
          heroImage: '1565008576549-57569a49371d',
          body: '<p>Wir bilden seit über 40 Jahren Anlagenmechaniker SHK aus. 2025 haben wir drei Plätze. Was wir bieten: eigenes Lehrbad, jeden Monat einen Übungstag mit unseren Meistern, geregelte Arbeitszeiten und vom ersten Tag an die ehrliche Ansage, was an diesem Beruf richtig anstrengend ist — und was richtig schön.</p><p>Bewerbungen bitte einfach per E-Mail oder per WhatsApp. Wir freuen uns auf Sie.</p>',
        }),
      ],
    },
  ],

  pages: [
    // ── Startseite ────────────────────────────────────────────────────────────
    {
      slug: 'startseite', title: 'Startseite',
      seo: {
        metaTitle: 'Müller & Söhne — SHK-Meisterbetrieb in Köln seit 1958',
        metaDescription: 'Heizung, Sanitär, Klima, Bäder und 24/7-Notdienst aus Köln. Drei Generationen Meisterbetrieb, ein Ansprechpartner, festes Wort.',
      },
      sections: [
        {
          type: 'hero',
          data: {
            badgeText: 'Meisterbetrieb seit 1958',
            badgeIcon: 'Award',
            headline: 'Handwerk, das hält. Generation nach Generation.',
            subline: 'Wir planen, installieren und warten Heizung, Bad und Klima für Familien und Unternehmen in Köln. Ein Ansprechpartner, ein Festpreis, ein festes Wort.',
            bgImage: img('1581094271901-8022df4466f9'),
            bgMode: 'image',
            overlayColor: '#0E3A53',
            overlayOpacity: 0.6,
            imageEffect: 'kenBurns',
            primaryCta:   { label: 'Termin vereinbaren', href: '/kontakt', icon: 'CalendarCheck' },
            secondaryCta: { label: 'Leistungen ansehen', href: '/leistungen', icon: 'ArrowRight' },
            trustItems: [
              'Meisterbetrieb der HwK Köln',
              '24/7 Notdienst in Köln',
              '4,9 / 5 bei Google (312 Bewertungen)',
            ],
            // The classic hero's default trust-strip background uses a buggy
            // arbitrary-value Tailwind class (bg-[var(...)]/10) that renders
            // as opaque white → white text on white. Setting trustStripColor
            // bypasses that branch entirely and uses a clean translucent dark
            // backing with full-opacity white text.
            trustStripColor: 'rgba(8,28,42,0.55)',
          },
          styleOverrides: darkSectionTokens,
        },
        {
          type: 'socialProofBar',
          data: {
            bgStyle: 'light',
            items: [
              { icon: 'Star',          value: '4,9 / 5',  label: '312 Bewertungen bei Google' },
              { icon: 'Award',         value: 'Meister',  label: 'Eingetragen bei der HwK Köln' },
              { icon: 'ShieldCheck',   value: '67 Jahre', label: 'Familienbetrieb seit 1958' },
              { icon: 'Clock',         value: '< 60 Min', label: 'Notdienst-Reaktionszeit Köln' },
              { icon: 'BadgeCheck',    value: '4.300+',   label: 'Anlagen unter Wartungsvertrag' },
            ],
          },
        },
        {
          type: 'uspStrip',
          data: {
            items: [
              { icon: 'Wrench',    title: 'Meisterbetrieb seit 1958', text: 'Dritte Generation, eigene Werkstatt.' },
              { icon: 'Clock',     title: '24/7 Notdienst',           text: 'In Köln in der Regel < 60 Min vor Ort.' },
              { icon: 'BadgeEuro', title: 'Festpreisgarantie',        text: 'Kein Aufschlag nach Auftrag.' },
              { icon: 'Recycle',   title: 'Förderprofi',              text: 'BAFA & KfW — wir machen den Antrag.' },
            ],
          },
        },
        {
          type: 'servicesGrid',
          data: {
            badgeText: 'Leistungen',
            headline: 'Vier Kerndisziplinen — eine Handschrift',
            subline: 'Wir bündeln Planung, Ausführung und Wartung in einer Hand. Keine Subunternehmer für sensible Gewerke, keine Schnittstellenverluste.',
            ctaLabel: 'Alle Leistungen ansehen', ctaHref: '/leistungen',
            manualCards: [
              { icon: 'Flame',    title: 'Heizungssanierung', text: 'Brennwert, Hybrid, Wärmepumpe — Fördermittel inklusive.', href: '/c/leistungen/heizungssanierung', mediaType: 'icon' },
              { icon: 'Bath',     title: 'Badmodernisierung', text: '3D-Planung, ein Vertrag, Festpreis, Festtermin.',          href: '/c/leistungen/badmodernisierung', mediaType: 'icon' },
              { icon: 'Leaf',     title: 'Wärmepumpen',       text: 'Sole und Luft, zertifizierte Monteure, JAZ > 4,0.',        href: '/c/leistungen/waermepumpe',       mediaType: 'icon' },
              { icon: 'Settings', title: 'Wartung & Service', text: 'Jahreswartung mit Notdienst-Vorrang.',                     href: '/c/leistungen/wartung-service',   mediaType: 'icon' },
            ],
          },
        },
        {
          type: 'featureShowcase',
          data: {
            headline: 'In der eigenen Werkstatt vorgefertigt — in Ihrem Haus eingebaut',
            subline: 'Wir konfektionieren so viel wie möglich in unserer Werkstatt in Köln-Zollstock. Das verkürzt Ihre Bauzeit, hält den Bauplatz sauber und gibt uns Qualitätskontrolle, die auf Baustellen niemand bietet.',
            image: img('1581094277802-a07db7a6bbfb'),
            features: [
              { icon: 'Factory',    title: 'Vorfertigung in Köln',     text: 'Rohrleitungen, Heizverteiler und Unterputz-Boxen werden bei uns gepresst, gedichtet und geprüft — bevor sie auf die Baustelle gehen.' },
              { icon: 'ShieldCheck',title: 'Druck- und Dichtheitsprüfung', text: 'Jede Anlage läuft 24 Stunden auf Druck, bevor sie verputzt wird. Sie unterschreiben kein Werkstück ohne Prüfprotokoll.' },
              { icon: 'Truck',      title: 'Sauberer Bauplatz',         text: 'Eigene Schmutzfangmatten, Staubschutzwände und tägliche Endreinigung sind in jedem Auftrag enthalten — keine Aufpreis-Position.' },
              { icon: 'GraduationCap', title: 'Eigene Lehrwerkstatt',   text: 'Wir bilden seit 1981 aus. Unsere Monteure sind hier gelernt — nicht angelernt.' },
            ],
            ctaPrimary: { label: 'Werkstatt besuchen', href: '/kontakt' },
          },
          styleOverrides: { '--token-section-bg-alt': C.cream },
        },
        {
          type: 'processSteps',
          data: {
            badgeText: 'So arbeiten wir',
            headline: 'Vier Schritte vom ersten Anruf bis zur warmen Wohnung',
            steps: [
              { icon: 'Phone',          title: 'Anruf & Aufmaß',     text: 'Wir kommen kostenfrei vorbei, messen, hören zu und prüfen Förderfähigkeit.' },
              { icon: 'PenTool',        title: 'Angebot & 3D-Plan',  text: 'Sie erhalten ein Festpreis-Angebot und — beim Bad — einen 3D-Plan.' },
              { icon: 'Wrench',         title: 'Ausführung',         text: 'Eigene Monteure, koordinierte Gewerke, sauberer Bauplatz.' },
              { icon: 'ClipboardCheck', title: 'Übergabe & Wartung', text: 'Schriftliches Protokoll, Einweisung, optional Wartungsvertrag.' },
            ],
          },
        },
        {
          type: 'bentoGrid',
          data: {
            headline: 'Was uns von Schnell-Schnell-Betrieben unterscheidet',
            subline: 'Fünf Dinge, an denen man einen guten SHK-Betrieb erkennt — lange bevor die Anlage läuft.',
            items: [
              { icon: 'FileSignature', title: 'Festpreis, schwarz auf weiß', text: 'Keine Überraschungen nach Auftrag. Was im Angebot steht, gilt — inklusive Termin.', span: '2' },
              { icon: 'Microscope',    title: 'Vorab-Bestandsaufnahme',    text: 'Wir messen Heizkörper, Hydraulik und Dämmung — bevor wir Bauteile bestellen.' },
              { icon: 'Wallet',        title: 'Förderung mitgedacht',      text: 'BAFA-Antrag, KfW-Brief, Energieberater-Kontakt — erledigt vom Büro.' },
              { icon: 'BookOpenCheck', title: 'Anlagen-Tagebuch',          text: 'Jede Wartung wird dokumentiert. Sie erhalten ein PDF-Protokoll für Versicherung und Notar.' },
              { icon: 'PhoneCall',     title: 'Direkt mit dem Meister',    text: 'Im Notfall niemand am Callcenter — Sie sprechen mit einem unserer sieben Meister.', span: '2' },
            ],
          },
        },
        {
          type: 'stats',
          data: {
            headline: 'Drei Generationen in Zahlen',
            stats: [
              { icon: 'Calendar', value: '67',   suffix: ' Jahre', label: 'Meisterbetrieb' },
              { icon: 'Users',    value: '14',                     label: 'Monteure & Meister' },
              { icon: 'Wrench',   value: '4300', suffix: '+',      label: 'Anlagen im Service' },
              { icon: 'Star',     value: '4,9',                    label: '★ bei Google' },
            ],
          },
        },
        {
          type: 'timeline',
          data: {
            badge: 'Drei Generationen',
            headline: 'Sechs Jahrzehnte Kölner Handwerks-Geschichte',
            subline: 'Was 1958 in einer Hinterhof-Werkstatt in Sülz begann, ist heute ein 14-köpfiger Meisterbetrieb — mit derselben Handschrift.',
            entries: [
              { year: '1958', title: 'Gründung in Köln-Sülz',          text: 'Heinrich Müller, Installateurmeister, stellt die erste Werkbank in einer Hinterhof-Werkstatt auf. Zwei Gesellen, ein Lehrling, ein Lastenrad.' },
              { year: '1981', title: 'Erste Lehrwerkstatt',             text: 'Werner Müller übernimmt den Betrieb von seinem Vater und richtet die erste eigene Lehrwerkstatt ein — bis heute Herzstück unserer Ausbildung.' },
              { year: '1998', title: 'Umzug Vorgebirgstraße',          text: 'Neue Werkhalle, eigener Hof, Vorfertigung für größere Bauprojekte. Erste Komplettbäder mit eigenem Fliesenleger-Team.' },
              { year: '2012', title: 'Wärmepumpen-Zertifizierung',     text: 'Anja Müller schließt den Kältekreis-Schein ab. Heute installieren wir 30+ Wärmepumpen pro Jahr im Bestand.' },
              { year: '2018', title: 'Dritte Generation übernimmt',    text: 'Anja und Felix Müller führen den Betrieb gemeinsam. Werner bleibt als Senior-Berater an Bord — in jedem Erstgespräch.' },
              { year: '2024', title: '67 Jahre, 14 Menschen, ein Wort', text: 'Sieben Meister, vier Gesellen, drei Auszubildende. 4.300 Anlagen unter Wartungsvertrag. Und ein Bürohund namens Bruno.' },
            ],
          },
        },
        {
          type: 'statsCounter',
          data: {
            headline: 'Was uns ausmacht',
            subline: 'Kennzahlen, die wir messen — weil sie etwas über Qualität aussagen.',
            stats: [
              { value: 97,    suffix: ' %',   label: 'Termintreue in 2024' },
              { value: 4.3,                  label: 'JAZ unserer Wärmepumpen' },
              { value: 60,    suffix: ' Min', label: 'Notdienst-Reaktionszeit' },
              { value: 280,   suffix: '+',    label: 'Wärmepumpen installiert' },
            ],
          },
        },
        {
          type: 'testimonials',
          data: {
            badgeText: 'Kundenstimmen',
            headline: 'Was Auftraggeber:innen über uns sagen',
            items: [
              { name: 'Familie Lenz',      context: 'Köln-Lindenthal',     quote: 'Heizungstausch in 3 Tagen, Festpreis eingehalten auf den Cent. Der Senior-Chef hat persönlich nachgeschaut.', rating: 5 },
              { name: 'Dr. Karim Ostmann', context: 'Zahnarztpraxis Sülz', quote: 'Klimaanlage und Lüftung in der Praxis — über Nacht installiert, am nächsten Morgen pünktlich um 8 Uhr Patientenbetrieb.', rating: 5 },
              { name: 'Andrea Kuper',      context: 'Hausverwaltung Kuper', quote: 'Wir betreuen 240 Wohneinheiten in Köln — Müller & Söhne ist seit Jahren unser verlässlichster SHK-Partner. Termintreu, kommunikativ.', rating: 5 },
            ],
          },
        },
        {
          type: 'faq',
          data: {
            badgeText: 'Häufige Fragen',
            headline: 'Was uns Kund:innen vor dem ersten Termin fragen',
            items: [
              { question: 'Wie schnell sind Sie im Notfall vor Ort?', answer: 'In Köln und Umgebung in der Regel innerhalb von 60 Minuten — rund um die Uhr, 365 Tage im Jahr. Wartungskund:innen erhalten Vorrang.' },
              { question: 'Übernehmen Sie auch die Förderanträge?',    answer: 'Ja, vollständig. Wir prüfen Ihre Förderfähigkeit kostenfrei vorab und stellen den BAFA-Antrag. Sie erhalten den Bescheid direkt von der Behörde.' },
              { question: 'Bekomme ich einen Festpreis?',              answer: 'Für jede planbare Maßnahme ja. Bei Heizungstausch und Badmodernisierung erhalten Sie einen schriftlichen Festpreis — verbindlich, mit Termin.' },
              { question: 'Arbeiten Sie mit Subunternehmern?',         answer: 'Bei sensiblen Gewerken (SHK, Kältekreis) ausschließlich mit eigenen Monteuren. Fliesenleger und Elektriker koordinieren wir aus einem festen Partnerkreis.' },
              { question: 'Wie lange dauert ein Komplettbad?',         answer: 'Im Schnitt drei bis sechs Wochen ab Baubeginn. Wir nennen Ihnen mit dem Angebot einen verbindlichen Übergabetermin.' },
              { question: 'Was kostet ein Heizungstausch ungefähr?',   answer: 'Für ein Einfamilienhaus liegen wir typischerweise zwischen 18.000 und 32.000 € brutto — abhängig von Anlagentyp, Heizkörper-Auslegung und gewünschter Förderkonstellation. Eine belastbare Zahl bekommen Sie nach dem kostenfreien Aufmaß.' },
              { question: 'Wann lohnt sich eine Wärmepumpe wirklich?',  answer: 'Wenn Ihre Heizkörper für Vorlauftemperaturen unter 55 °C ausgelegt sind oder ausgelegt werden können — und Sie eine Dämmung ab Energieeffizienzklasse D haben. Wir prüfen das in zwei Stunden vor Ort und sagen Ihnen ehrlich, ob Hybrid- oder Brennwert-Lösung sinnvoller wäre.' },
            ],
          },
        },
        {
          type: 'ctaBand',
          data: {
            badgeText: 'Termin gesucht?',
            headline: 'Sprechen wir über Ihr Projekt.',
            subline: 'Aufmaß und Erstberatung sind kostenfrei. Im Notfall sind wir 24/7 erreichbar — auch über WhatsApp.',
            ctaPrimary: { label: 'Termin vereinbaren', href: '/kontakt', icon: 'CalendarCheck' },
          },
          styleOverrides: { '--token-section-bg': C.brand, ...darkSectionTokens },
        },
      ],
    },

    // ── Leistungen-Übersicht ─────────────────────────────────────────────────
    {
      slug: 'leistungen', title: 'Leistungen',
      seo: {
        metaTitle: 'Leistungen — Heizung, Bad, Klima, Wartung in Köln',
        metaDescription: 'Unser Leistungsspektrum als SHK-Meisterbetrieb in Köln: Heizungssanierung, Badmodernisierung, Wärmepumpen, Wartung & 24/7-Notdienst.',
      },
      sections: [
        {
          type: 'collectionHero',
          data: {
            headline: 'Vier Kerndisziplinen, ein Meisterbetrieb',
            subline: 'Wir behalten gerne den ganzen Bauablauf in der Hand — von Aufmaß und Förderantrag bis zur jährlichen Wartung.',
            bgImage: img('1581244277943-fe4a9c777189'),
            overlayColor: '#0E3A53', overlayOpacity: 0.6,
          },
          styleOverrides: darkSectionTokens,
        },
        {
          type: 'servicesGrid',
          data: {
            badgeText: 'Unser Portfolio',
            headline: 'Alle Leistungen im Überblick',
            manualCards: [
              { icon: 'Flame',    title: 'Heizungssanierung', text: 'Brennwert, Hybrid und Wärmepumpe — inkl. Förderung.', href: '/c/leistungen/heizungssanierung', mediaType: 'icon' },
              { icon: 'Bath',     title: 'Badmodernisierung', text: 'Komplettbad mit 3D-Plan und festem Übergabetermin.',  href: '/c/leistungen/badmodernisierung', mediaType: 'icon' },
              { icon: 'Leaf',     title: 'Wärmepumpen',       text: 'Sole und Luft — installiert mit Kältekreis-Schein.',  href: '/c/leistungen/waermepumpe',       mediaType: 'icon' },
              { icon: 'Settings', title: 'Wartung & Service', text: 'Jahreswartung, Notdienst-Vorrang, Protokoll.',        href: '/c/leistungen/wartung-service',   mediaType: 'icon' },
            ],
          },
        },
        {
          type: 'comparisonTable',
          data: {
            badge: 'Wartungspakete',
            headline: 'Welches Wartungspaket passt zu Ihrer Anlage?',
            text: 'Alle Pakete enthalten festen Wartungstermin im Wunschmonat, Vorrang im Notdienst und schriftliches Anlagenprotokoll. Preise verstehen sich pro Jahr inkl. MwSt.',
            columns: [
              { label: 'Leistung' },
              { label: 'Basis — 189 €' },
              { label: 'Komfort — 289 €' },
              { label: 'Komplett — 449 €' },
            ],
            highlightCol: 2,
            rows: [
              { feature: 'Jahreswartung Heizung',          values: ['✓', '✓', '✓'] },
              { feature: 'Schriftliches Anlagenprotokoll', values: ['✓', '✓', '✓'] },
              { feature: 'Notdienst-Vorrang',              values: ['—', '✓', '✓'] },
              { feature: 'Trinkwasser-Hygieneprüfung',     values: ['—', '✓', '✓'] },
              { feature: 'Anfahrt Stadtgebiet Köln',       values: ['Aufpreis', 'inkl.', 'inkl.'] },
              { feature: 'Material bei Notdienst',         values: ['nach Aufwand', 'nach Aufwand', '20 % Rabatt'] },
              { feature: 'Heizkostenanalyse jährlich',     values: ['—', '—', '✓'] },
              { feature: 'Förder-Check alle 2 Jahre',      values: ['—', '—', '✓'] },
            ],
          },
        },
        {
          type: 'featureShowcase',
          data: {
            headline: 'Warum Komplettbad bei uns dreimal schneller fertig wird',
            subline: 'Ein Vertrag, ein Ansprechpartner, ein Termin — weil wir jedes Gewerk selbst koordinieren statt zu hoffen, dass der Subunternehmer pünktlich kommt.',
            image: img('1552321554-5fefe8c9ef14'),
            features: [
              { icon: 'PenTool',     title: '3D-Planung vor Auftrag',     text: 'Sie sehen Ihr Bad mit Lichtkonzept und Materialprobe — bevor irgendetwas bestellt wird.' },
              { icon: 'Handshake',   title: 'Alle Gewerke unter einem Dach', text: 'Fliesenleger, Elektriker, Trockenbauer aus festem Partnerkreis. Wir koordinieren — Sie müssen niemanden anrufen.' },
              { icon: 'Calendar',    title: 'Übergabetermin garantiert',  text: 'Drei bis sechs Wochen ab Baubeginn. Verbindlich. Mit Vertragsstrafe bei Verzug aus unserem Verschulden.' },
              { icon: 'Accessibility', title: 'KfW-förderfähig',          text: 'Bodengleiche Duschen und Haltegriffe werden über den KfW-Altersgerecht-Umbau bezuschusst — Antrag inklusive.' },
            ],
            ctaPrimary: { label: 'Badtermin anfragen', href: '/kontakt' },
          },
        },
        {
          type: 'testimonials',
          data: {
            badgeText: 'Kundenstimmen',
            headline: 'Was Auftraggeber:innen zu unseren Leistungen sagen',
            items: [
              { name: 'Familie Wallraf',  context: 'Heizungstausch, Köln-Nippes',     quote: 'Drei Tage Bauzeit, sauberer Heizkeller, Förderbescheid kam direkt von der BAFA. So hätten wir nicht zu hoffen gewagt.',          rating: 5 },
              { name: 'Sebastian Klein',  context: 'Komplettbad, Köln-Ehrenfeld',     quote: 'Fertig 4 Tage vor dem zugesagten Termin. Auf den Cent Festpreis. Wir empfehlen Familie Müller jeder Person, die uns fragt.', rating: 5 },
              { name: 'Dr. med. Hofmann', context: 'Wärmepumpe, Köln-Lindenthal',      quote: 'Sehr saubere Planung. Die Jahresarbeitszahl liegt nach einem Jahr bei 4,2 — wie versprochen.',                          rating: 5 },
            ],
          },
        },
        {
          type: 'ctaBand',
          data: {
            headline: 'Sie wissen noch nicht, welche Leistung passt?',
            subline: 'Rufen Sie an oder schreiben Sie auf WhatsApp — wir hören zu und sagen Ihnen ehrlich, was sinnvoll ist.',
            ctaPrimary: { label: 'Beratung anfragen', href: '/kontakt', icon: 'PhoneCall' },
          },
          styleOverrides: { '--token-section-bg': C.brand, ...darkSectionTokens },
        },
      ],
    },

    // ── Über uns ─────────────────────────────────────────────────────────────
    {
      slug: 'ueber-uns', title: 'Über uns',
      seo: {
        metaTitle: 'Über uns — Familienbetrieb in dritter Generation',
        metaDescription: 'Müller & Söhne ist ein familiengeführter SHK-Meisterbetrieb in Köln. Drei Generationen, 14 Mitarbeitende, eigene Lehrwerkstatt — und ein klares Wort.',
      },
      sections: [
        {
          type: 'collectionHero',
          data: {
            headline: 'Drei Generationen Handwerk in Köln',
            subline: 'Was 1958 mit einer Werkbank in Köln-Sülz begann, ist heute ein Meisterbetrieb mit 14 Mitarbeitenden — und derselben Handschrift.',
            bgImage: img('1521791136064-7986c2920216'),
            overlayColor: '#0E3A53', overlayOpacity: 0.55,
          },
          styleOverrides: darkSectionTokens,
        },
        {
          type: 'textImage',
          data: {
            badge: 'Unsere Geschichte',
            headline: 'Vom Werkbank-Betrieb zum SHK-Spezialisten',
            text:
              '<p>1958 hat unser Großvater Heinrich Müller in einer Hinterhof-Werkstatt in Köln-Sülz die erste Werkbank aufgestellt. Sein Sohn Werner hat den Betrieb in den 80er-Jahren auf moderne Heizungstechnik umgestellt. Heute führen Anja und Felix Müller das Unternehmen in dritter Generation — mit denselben Grundsätzen: gutes Wort, festes Material, sauberer Bauplatz.</p>' +
              '<p>Was uns wichtig ist: dass die Anlage in 20 Jahren immer noch läuft. Dass unsere Azubis Meister werden. Und dass der Briefkasten keine Mahnung enthält, weil wir das Fördergeld rechtzeitig beantragt haben.</p>',
            image: img('1581094277802-a07db7a6bbfb'),
            imageAlt: 'Werkstatt von Müller & Söhne in Köln',
            layout: 'image-right',
            primaryCta: { label: 'Team kennenlernen', href: '/ueber-uns', icon: 'Users' },
          },
        },
        {
          type: 'timeline',
          data: {
            badge: 'Meilensteine',
            headline: 'Sechs Jahrzehnte Kölner Familienbetrieb',
            subline: 'Ein Strich auf der Zeitleiste pro Generation — und ein paar Erinnerungen dazwischen.',
            entries: [
              { year: '1958', title: 'Gründung in Köln-Sülz',          text: 'Heinrich Müller, Installateurmeister, stellt die erste Werkbank in einer Hinterhof-Werkstatt auf.' },
              { year: '1971', title: 'Erste Zentralheizungen',          text: 'Umstellung von Einzelöfen auf Öl-Zentralheizungen prägt das Jahrzehnt — wir wachsen auf sechs Mitarbeitende.' },
              { year: '1981', title: 'Eigene Lehrwerkstatt',            text: 'Werner Müller übernimmt und richtet die erste Lehrwerkstatt ein. Seitdem 47 Lehrlinge ausgebildet.' },
              { year: '1998', title: 'Umzug in die Vorgebirgstraße',   text: 'Neue Werkhalle mit eigenem Hof, Vorfertigung für größere Projekte, erstes Komplettbad-Team.' },
              { year: '2012', title: 'Wärmepumpen-Kompetenz',           text: 'Anja Müller schließt den Kältekreis-Schein ab. Bis heute 280+ Wärmepumpen installiert.' },
              { year: '2018', title: 'Dritte Generation übernimmt',     text: 'Anja und Felix Müller führen den Betrieb gemeinsam. Werner bleibt Senior-Berater für jeden ersten Termin.' },
              { year: '2024', title: 'Frischluft im Familienbetrieb',   text: 'Wir bilden so viele Azubis aus wie nie. Drei Plätze für 2025 sind ausgeschrieben.' },
            ],
          },
        },
        {
          type: 'stats',
          data: {
            headline: 'Was uns ausmacht — in Zahlen',
            stats: [
              { icon: 'Calendar', value: '1958', label: 'Gründungsjahr' },
              { icon: 'Users',    value: '14',   label: 'Mitarbeitende' },
              { icon: 'Layers',   value: '3',    label: 'Generationen' },
              { icon: 'Award',    value: '7',    label: 'Meister im Team' },
            ],
          },
        },
        {
          type: 'team',
          data: {
            badgeText: 'Team',
            headline: 'Die Menschen hinter dem Meisterbetrieb',
            subline: 'Sieben Meister, vier Gesellen, drei Auszubildende — und ein Bürohund namens Bruno.',
            members: [
              { name: 'Anja Müller',    role: 'Geschäftsführerin / Meisterin SHK', image: img('1573496359142-b8d87734a5a2', 600), bio: 'Übernahm den Betrieb 2018 von ihrem Vater Werner. Spezialisiert auf Wärmepumpen-Planung.' },
              { name: 'Felix Müller',   role: 'Technischer Leiter / Meister',      image: img('1507003211169-0a1dd7228f2d', 600), bio: 'Zuständig für Großprojekte und Bestandssanierung. Eigene Kältekreis-Zertifizierung.' },
              { name: 'Thomas Wiegand', role: 'Werkstattleiter / Meister',         image: img('1500648767791-00dcc994a43e', 600), bio: 'Seit 1992 im Betrieb. Bildet seit 20 Jahren Azubis aus und führt unsere Lehrwerkstatt.' },
              { name: 'Petra Eick',     role: 'Büroleitung / Förder-Spezialistin', image: img('1580489944761-15a19d654956', 600), bio: 'Kennt die BAFA-Förderrichtlinie auswendig. Wickelt jährlich über 80 Anträge ab.' },
            ],
            valuesHeadline: 'Was uns wichtig ist',
            values: [
              { icon: 'Handshake',   title: 'Wort halten',         text: 'Was im Angebot steht, gilt. Wenn wir uns verzählen, zahlen wir die Differenz — nicht Sie.' },
              { icon: 'GraduationCap', title: 'Ausbilden',         text: 'Drei Auszubildende pro Jahrgang. Eigenes Lehrbad. Berufsschule wird bezahlt, nicht abgesessen.' },
              { icon: 'Recycle',     title: 'Sauberer Bauplatz',   text: 'Staubschutz, Schmutzfangmatten und tägliche Endreinigung sind im Festpreis enthalten — keine Position extra.' },
              { icon: 'Heart',       title: 'Lange Beziehungen',   text: 'Wir betreuen Anlagen, die wir selbst gebaut haben — manche seit drei Generationen. Wartung ist kein Cross-Selling.' },
            ],
          },
        },
        {
          type: 'ctaBand',
          data: {
            headline: 'Lust auf gutes Handwerk mit gutem Wort?',
            subline: 'Wir freuen uns über Anfragen — und über Bewerbungen.',
            ctaPrimary: { label: 'Projekt anfragen', href: '/kontakt', icon: 'CalendarCheck' },
          },
          styleOverrides: { '--token-section-bg': C.brand, ...darkSectionTokens },
        },
      ],
    },

    // ── Referenzen ───────────────────────────────────────────────────────────
    {
      slug: 'referenzen', title: 'Referenzen',
      seo: {
        metaTitle: 'Referenzen — Ausgewählte Projekte aus Köln',
        metaDescription: 'Vom denkmalgeschützten Gründerzeit-Haus bis zur Kita-Wärmepumpe: ausgewählte Projekte aus Köln und Umgebung.',
      },
      sections: [
        {
          type: 'collectionHero',
          data: {
            headline: 'Projekte, an denen wir hängen',
            subline: 'Eine kleine Auswahl aus dem letzten Jahr — von der denkmalgeschützten Villa bis zur Kita-Wärmepumpe.',
            bgImage: img('1521791055366-0d553872125f'),
            overlayColor: '#0E3A53', overlayOpacity: 0.6,
          },
          styleOverrides: darkSectionTokens,
        },
        {
          type: 'collectionList',
          data: {
            collectionKey: 'referenzen',
            headline: 'Ausgewählte Projekte',
            subline: 'Klicken Sie auf ein Projekt für Details, Eckdaten und Bilder.',
            columns: 3,
          },
        },
        {
          type: 'portfolio',
          data: {
            badgeText: 'Auszug aus drei Jahrzehnten',
            headline: 'Was wir gerne in Erinnerung behalten',
            subline: 'Drei Projekte, an die wir uns gerne erinnern — weil sie zeigen, was Handwerk leisten kann, wenn alle mitziehen.',
            projects: [
              { title: 'Domhotel Tradition',     category: 'Hotel-Sanierung',          image: img('1564501049412-61c2a3083791'),  icon: 'Building2',  description: '38 Zimmer, Komplett-Sanierung von Bad und Heizung in 11 Wochen — bei laufendem Hotelbetrieb. Drei Etagen rollierend.', stats: [{label:'Zimmer',value:'38'},{label:'Bauzeit',value:'11 Wo.'}] },
              { title: 'Bürohaus Rheinauhafen', category: 'Gebäudetechnik Büro',     image: img('1486325212027-8081e485255e'),  icon: 'Briefcase', description: '4.200 m² Bürofläche mit zentraler Lüftung, Kühldecken und Wärmerückgewinnung — nach DGNB-Gold zertifiziert.', stats: [{label:'Fläche',value:'4.200 m²'},{label:'JAZ',value:'4,1'}] },
              { title: 'Sportverein Südstadt',  category: 'Vereinsanlage',           image: img('1505666287802-931dc83948e6'),  icon: 'Trophy',    description: 'Komplette Sanitäranlage für 600-Mitglieder-Verein — inklusive Trinkwasser-Hygienekonzept und Energierecycling der Duschen.', stats: [{label:'Duschen',value:'24'},{label:'Hygienekonzept',value:'DIN 1988'}] },
            ],
            ctaLabel: 'Alle Projekte ansehen', ctaHref: '/referenzen',
          },
        },
        {
          type: 'testimonials',
          data: {
            badgeText: 'Auftraggeber:innen',
            headline: 'Was Bauherren über unsere Projekte sagen',
            items: [
              { name: 'Hausverwaltung Kuper',     context: '240 Wohneinheiten in Köln',  quote: 'Wir vergeben seit 2019 alle SHK-Aufträge an Müller & Söhne. Termintreue, saubere Dokumentation, eine Rechnung. Das spart uns Verwaltung.', rating: 5 },
              { name: 'Kita-Träger St. Joseph',  context: '3 Kita-Standorte Köln',      quote: 'Sommerferien sind kurz. Bei Müller & Söhne können wir uns darauf verlassen, dass am ersten Schultag warm geduscht werden kann.',         rating: 5 },
              { name: 'Atelier Mensching',        context: 'Architekturbüro Köln',      quote: 'Endlich ein SHK-Partner, der Pläne lesen kann und mit denkt. Wir spezifizieren grob — Felix Müller liefert den hydraulischen Abgleich dazu.',  rating: 5 },
            ],
          },
        },
        {
          type: 'ctaBand',
          data: {
            headline: 'Ihr Projekt könnte das nächste sein.',
            subline: 'Sprechen Sie uns an — wir besprechen Ihr Vorhaben unverbindlich.',
            ctaPrimary: { label: 'Termin vereinbaren', href: '/kontakt', icon: 'CalendarCheck' },
          },
          styleOverrides: { '--token-section-bg': C.brand, ...darkSectionTokens },
        },
      ],
    },

    // ── Werkstattnotizen (News) ──────────────────────────────────────────────
    {
      slug: 'news', title: 'Werkstattnotizen',
      seo: {
        metaTitle: 'Werkstattnotizen — Aus dem Alltag eines Meisterbetriebs',
        metaDescription: 'Aktuelle Notizen aus Werkstatt und Baustelle: Fördertipps, Wartungs-Checks, Karriere und Geschichten von Familienbetrieb zu Familienbetrieb.',
      },
      sections: [
        {
          type: 'collectionHero',
          data: {
            headline: 'Notizen aus Werkstatt und Baustelle',
            subline: 'Was uns gerade beschäftigt — von Förderänderungen bis zu Wartungs-Checklisten.',
            bgImage: img('1581094288338-2314dddb7ece'),
            overlayColor: '#0E3A53', overlayOpacity: 0.6,
          },
          styleOverrides: darkSectionTokens,
        },
        {
          type: 'newsGrid',
          data: {
            collectionKey: 'news',
            headline: 'Alle Werkstattnotizen',
            subline: 'Notizen, Tipps und Geschichten aus dem Alltag eines SHK-Meisterbetriebs.',
          },
        },
      ],
    },

    // ── Kontakt ──────────────────────────────────────────────────────────────
    {
      slug: 'kontakt', title: 'Kontakt',
      seo: {
        metaTitle: 'Kontakt — Termin, Notdienst, WhatsApp',
        metaDescription: 'Direkter Draht zum Meisterbetrieb: Telefon, E-Mail, WhatsApp und Kontaktformular. 24/7 Notdienst für Köln und Umgebung.',
      },
      sections: [
        {
          type: 'collectionHero',
          data: {
            headline: 'Direkt zum Meisterbetrieb',
            subline: 'Werktags zwischen 7:30 und 17 Uhr persönlich am Telefon. Notfälle 24/7. WhatsApp ganztägig.',
            bgImage: img('1556761175-5973dc0f32e7'),
            overlayColor: '#0E3A53', overlayOpacity: 0.6,
          },
          styleOverrides: darkSectionTokens,
        },
        {
          type: 'contact',
          data: {
            headline: 'Schreiben Sie uns',
            introText: 'Beschreiben Sie kurz Ihr Anliegen — wir melden uns innerhalb von 24 h, in der Regel deutlich schneller.',
            formEnabled: true,
            submitLabel: 'Anfrage senden',
            infoCards: [
              { icon: 'Phone',  label: 'Telefon',         value: '+49 221 5894120' },
              { icon: 'Mail',   label: 'E-Mail',          value: 'service@mueller-soehne-koeln.de' },
              { icon: 'MapPin', label: 'Adresse',         value: 'Vorgebirgstraße 218, 50969 Köln' },
              { icon: 'Clock',  label: 'Öffnungszeiten',  value: 'Mo–Do 7:30–17 · Fr 7:30–15:30 · 24/7 Notdienst' },
            ],
          },
        },
        {
          type: 'map',
          data: {
            headline: 'So finden Sie uns',
            embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2509.4869091235814!2d6.945!3d50.901!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTDCsDU0JzAzLjYiTiA2wrA1NicyMi4wIkU!5e0!3m2!1sde!2sde!4v1700000000000',
            height: 'm',
          },
        },
      ],
    },

    // ── Impressum ────────────────────────────────────────────────────────────
    {
      slug: 'impressum', title: 'Impressum',
      seo: { metaTitle: 'Impressum', metaDescription: 'Anbieterkennzeichnung gemäß § 5 TMG.' },
      sections: [
        {
          type: 'legalContent',
          data: {
            headline: 'Impressum',
            blocks: [
              { headline: 'Anbieter', text: '<p>Müller & Söhne Meisterbetrieb GmbH<br>Vorgebirgstraße 218<br>50969 Köln<br>Deutschland</p>' },
              { headline: 'Vertretungsberechtigte Geschäftsführung', text: '<p>Anja Müller, Felix Müller</p>' },
              { headline: 'Kontakt', text: '<p>Telefon: +49 221 5894120<br>E-Mail: service@mueller-soehne-koeln.de</p>' },
              { headline: 'Registereintrag', text: '<p>Amtsgericht Köln, HRB 84221<br>Handwerkskammer zu Köln, Eintragungsnummer 12345</p>' },
              { headline: 'Umsatzsteuer-Identifikationsnummer', text: '<p>USt-IdNr. gemäß § 27 a UStG: DE 245 678 901</p>' },
              { headline: 'Aufsichtsbehörde', text: '<p>Handwerkskammer zu Köln, Heumarkt 12, 50667 Köln</p>' },
              { headline: 'Berufsbezeichnung & berufsrechtliche Regelungen', text: '<p>Installateur- und Heizungsbauermeister (verliehen in der Bundesrepublik Deutschland). Es gelten die Regelungen der Handwerksordnung (HwO).</p>' },
              { headline: 'Haftungshinweis', text: '<p>Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte externer Links. Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich.</p>' },
            ],
          },
        },
      ],
    },

    // ── Datenschutz ──────────────────────────────────────────────────────────
    {
      slug: 'datenschutz', title: 'Datenschutz',
      seo: { metaTitle: 'Datenschutzerklärung', metaDescription: 'Informationen zur Verarbeitung personenbezogener Daten gemäß DSGVO.' },
      sections: [
        {
          type: 'legalContent',
          data: {
            headline: 'Datenschutzerklärung',
            blocks: [
              { headline: '1. Verantwortlicher', text: '<p>Müller & Söhne Meisterbetrieb GmbH, Vorgebirgstraße 218, 50969 Köln, vertreten durch die Geschäftsführung Anja und Felix Müller.</p>' },
              { headline: '2. Hosting', text: '<p>Diese Website wird bei Vercel Inc. (340 S Lemon Ave #4133, Walnut, CA 91789, USA) gehostet. Es gilt das EU-US Data Privacy Framework. Mit Vercel besteht ein Auftragsverarbeitungsvertrag.</p>' },
              { headline: '3. Erhebung allgemeiner Daten', text: '<p>Beim Aufruf der Website werden technisch notwendige Daten (IP-Adresse, Zeitpunkt, Browsertyp) verarbeitet. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Diese Daten werden nach 14 Tagen gelöscht.</p>' },
              { headline: '4. Cookies', text: '<p>Wir setzen ausschließlich technisch notwendige Cookies ein. Tracking- oder Marketing-Cookies werden nicht verwendet.</p>' },
              { headline: '5. Kontaktformular', text: '<p>Die im Kontaktformular eingegebenen Daten verarbeiten wir ausschließlich zur Bearbeitung Ihrer Anfrage (Art. 6 Abs. 1 lit. b DSGVO) und löschen sie spätestens 24 Monate nach Abschluss des Vorgangs.</p>' },
              { headline: '6. Rechte der betroffenen Personen', text: '<p>Sie haben das Recht auf Auskunft (Art. 15), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung (Art. 18), Datenübertragbarkeit (Art. 20) und Widerspruch (Art. 21). Beschwerden richten Sie an die Landesbeauftragte für Datenschutz und Informationsfreiheit NRW.</p>' },
            ],
          },
        },
      ],
    },
  ],
};

// ── builders for collection items ─────────────────────────────────────────────
// NOTE: collection items default to published=false on create. The runner
// auto-sets published=true when the item spec doesn't specify it explicitly.
function buildServiceItem({ slug, title, excerpt, heroImage, intro, highlights }) {
  return {
    title, slug,
    data: {
      excerpt,
      sections: [
        {
          id: uuid(), type: 'collectionHero',
          data: { headline: title, subline: excerpt, bgImage: img(heroImage), backgroundImage: img(heroImage), overlayColor: '#0E3A53', overlayOpacity: 0.6 },
          styleOverrides: darkSectionTokens,
        },
        {
          id: uuid(), type: 'textImage',
          data: {
            headline: 'Was Sie bekommen',
            text: `<p>${intro}</p>`,
            image: img(heroImage),
            imageAlt: title,
            layout: 'image-right',
            primaryCta: { label: 'Termin vereinbaren', href: '/kontakt', icon: 'CalendarCheck' },
          },
        },
        {
          id: uuid(), type: 'servicesGrid',
          data: {
            headline: 'Was wir konkret leisten',
            manualCards: highlights.map((h) => ({ ...h, mediaType: 'icon' })),
          },
        },
        {
          id: uuid(), type: 'ctaBand',
          data: {
            headline: `${title} anfragen`,
            subline: 'Wir hören zu, messen auf und nennen Ihnen einen verbindlichen Festpreis.',
            ctaPrimary: { label: 'Beratung anfragen', href: '/kontakt', icon: 'CalendarCheck' },
          },
          styleOverrides: { '--token-section-bg': C.brand, ...darkSectionTokens },
        },
      ],
    },
  };
}

function buildProjectItem({ slug, title, excerpt, heroImage, summary, facts }) {
  return {
    title, slug,
    data: {
      excerpt,
      sections: [
        {
          id: uuid(), type: 'collectionHero',
          data: { headline: title, subline: excerpt, bgImage: img(heroImage), backgroundImage: img(heroImage), overlayColor: '#0E3A53', overlayOpacity: 0.6 },
          styleOverrides: darkSectionTokens,
        },
        {
          id: uuid(), type: 'textImage',
          data: { headline: 'Projekt im Detail', text: `<p>${summary}</p>`, image: img(heroImage), imageAlt: title, layout: 'image-left' },
        },
        {
          id: uuid(), type: 'stats',
          data: { headline: 'Eckdaten', stats: facts.map((f) => ({ icon: 'Check', value: f.value, label: f.label })) },
        },
        {
          id: uuid(), type: 'ctaBand',
          data: {
            headline: 'Ähnliches Projekt geplant?',
            subline: 'Wir besprechen Ihr Vorhaben unverbindlich — gerne auch vor Ort.',
            ctaPrimary: { label: 'Termin vereinbaren', href: '/kontakt', icon: 'CalendarCheck' },
          },
          styleOverrides: { '--token-section-bg': C.brand, ...darkSectionTokens },
        },
      ],
    },
  };
}

function buildNewsItem({ slug, title, excerpt, heroImage, body }) {
  return {
    title, slug,
    data: {
      excerpt,
      sections: [
        {
          id: uuid(), type: 'collectionHero',
          data: { headline: title, subline: excerpt, bgImage: img(heroImage), backgroundImage: img(heroImage), overlayColor: '#0E3A53', overlayOpacity: 0.6 },
          styleOverrides: darkSectionTokens,
        },
        {
          id: uuid(), type: 'freeText',
          data: { content: body },
        },
        {
          id: uuid(), type: 'ctaBand',
          data: {
            headline: 'Fragen zum Thema?',
            subline: 'Rufen Sie an oder schreiben Sie eine kurze Nachricht — wir antworten persönlich.',
            ctaPrimary: { label: 'Beratung anfragen', href: '/kontakt', icon: 'PhoneCall' },
          },
          styleOverrides: { '--token-section-bg': C.brand, ...darkSectionTokens },
        },
      ],
    },
  };
}

// ── run ───────────────────────────────────────────────────────────────────────
if (require.main === module) {
  run(tenant).catch((e) => { console.error('FATAL:', e); process.exit(1); });
}

module.exports = tenant;
