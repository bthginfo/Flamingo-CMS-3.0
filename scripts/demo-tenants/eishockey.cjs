// Demo-Tenant "EHC Donau Panther" — Branche Verein & Sport (Eishockey).
// Wird über scripts/demo-tenants/run-all.cjs befüllt, sobald ein Tenant mit
// industry='verein' existiert und PAT_EISHOCKEY gesetzt ist:
//   PAT_EISHOCKEY=flm_pat_… node -e "const {run}=require('./scripts/demo-tenants/_lib/runner.cjs');const t=require('./scripts/demo-tenants/eishockey.cjs');t.pat=process.env.PAT_EISHOCKEY;run(t)"
// Inhaltlich identisch zur Code-Demo unter /demo/eishockey.
// Nur verifizierte, thematisch passende Bilder. Teamlogos leer → Initialen-Wappen.
const IMG = {
  arena: 'https://images.unsplash.com/photo-1607627000458-210e8d2bdb1d?auto=format&fit=crop&w=1800&q=80',
  action: 'https://images.unsplash.com/photo-1515703407324-5f753afd8be8?auto=format&fit=crop&w=1600&q=80',
  action2: 'https://images.unsplash.com/photo-1515703407324-5f753afd8be8?auto=format&fit=crop&w=1600&q=80',
  crowd: 'https://images.unsplash.com/photo-1607627000458-210e8d2bdb1d?auto=format&fit=crop&w=1600&q=80',
  youth: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=1600&q=80',
  logoHome: '',
  logoAway: '',
  p1: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&w=500&q=80',
  p2: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80',
  p3: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80',
  p4: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=500&q=80',
  p5: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=500&q=80',
  p6: 'https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?auto=format&fit=crop&w=500&q=80',
  p7: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&w=500&q=80',
  p8: 'https://images.unsplash.com/photo-1545167622-3a6ac756afa4?auto=format&fit=crop&w=500&q=80',
  coach: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=500&q=80',
  assistantCoach: 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?auto=format&fit=crop&w=500&q=80',
  doctor: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80',
};
const ARENA = 'Saturn-Arena, Jahnstraße 10, 85049 Ingolstadt';

const SCHEDULE = { badgeText: 'Saison 2025/26', headline: 'Spielplan', subline: 'Alle Termine der Hauptrunde — Heimspiele in der Saturn-Arena.', matches: [
  { dateLabel: 'Sa 12.10.', competition: 'Oberliga', homeTeam: 'Donau Panther', awayTeam: 'EV Landshut', venue: 'Saturn-Arena', homeGame: true, ticketHref: '/kontakt' },
  { dateLabel: 'Fr 18.10.', competition: 'Oberliga', homeTeam: 'Deggendorfer SC', awayTeam: 'Donau Panther', venue: 'Deggendorf', homeGame: false },
  { dateLabel: 'So 20.10.', competition: 'Oberliga', homeTeam: 'Donau Panther', awayTeam: 'Höchstadt Alligators', venue: 'Saturn-Arena', result: '4:2', homeGame: true },
  { dateLabel: 'Fr 25.10.', competition: 'Pokal', homeTeam: 'Selber Wölfe', awayTeam: 'Donau Panther', venue: 'Selb', homeGame: false },
  { dateLabel: 'So 27.10.', competition: 'Oberliga', homeTeam: 'Donau Panther', awayTeam: 'Memmingen Indians', venue: 'Saturn-Arena', homeGame: true, ticketHref: '/kontakt' },
  { dateLabel: 'Fr 01.11.', competition: 'Oberliga', homeTeam: 'Passau Black Hawks', awayTeam: 'Donau Panther', venue: 'Passau', homeGame: false },
] };
const TABLE = { badgeText: 'Tabelle', headline: 'Oberliga Süd', subline: 'Stand nach dem 8. Spieltag.', rows: [
  { rank: '1', team: 'Selber Wölfe', played: '8', won: '7', drawn: '0', lost: '1', points: '21' },
  { rank: '2', team: 'Memmingen Indians', played: '8', won: '6', drawn: '1', lost: '1', points: '19' },
  { rank: '3', team: 'Donau Panther', played: '8', won: '5', drawn: '1', lost: '2', points: '16', highlight: true },
  { rank: '4', team: 'EV Landshut', played: '8', won: '4', drawn: '1', lost: '3', points: '13' },
  { rank: '5', team: 'Deggendorfer SC', played: '8', won: '3', drawn: '0', lost: '5', points: '9' },
  { rank: '6', team: 'Höchstadt Alligators', played: '8', won: '1', drawn: '1', lost: '6', points: '4' },
] };
const ROSTER = { badgeText: 'Saison 2025/26', headline: 'Unser Kader', subline: 'Torhüter, Verteidigung und Sturm — das ist die Mannschaft.', players: [
  { number: '1', name: 'Max Berger', position: 'Torwart', nationality: 'DE', image: IMG.p1 },
  { number: '7', name: 'Jonas Weiß', position: 'Verteidigung', nationality: 'DE', image: IMG.p2 },
  { number: '12', name: 'Elias Novák', position: 'Verteidigung', nationality: 'CZ', image: IMG.p3 },
  { number: '19', name: 'Lukas Fischer', position: 'Center', nationality: 'DE', image: IMG.p4 },
  { number: '23', name: 'Ryan O’Connor', position: 'Flügel', nationality: 'CA', image: IMG.p5 },
  { number: '27', name: 'Niklas Huber', position: 'Flügel', nationality: 'DE', image: IMG.p6 },
  { number: '44', name: 'Tomas Král', position: 'Verteidigung', nationality: 'SK', image: IMG.p7 },
  { number: '91', name: 'David Wagner', position: 'Center', nationality: 'DE', image: IMG.p8 },
] };
const SPONSORS = { badgeText: 'Danke', headline: 'Unsere Partner', subline: 'Gemeinsam für den Nachwuchs und den Eishockeysport in der Region.', tiers: [
  { tierLabel: 'Hauptsponsoren', logos: [{ name: 'Saturn' }, { name: 'AUDI' }, { name: 'Stadtwerke' }] },
  { tierLabel: 'Premium-Partner', logos: [{ name: 'Sparkasse' }, { name: 'MediaMarkt' }, { name: 'BAUHAUS' }, { name: 'Getränke Huber' }] },
  { tierLabel: 'Förderpartner', logos: [{ name: 'Bäckerei Müller' }, { name: 'Autohaus Weber' }, { name: 'Physio Aktiv' }, { name: 'Pizzeria Roma' }, { name: 'Optik Klar' }, { name: 'Elektro Bauer' }] },
] };
const nextMatch = { type: 'nextMatchHero', data: { eyebrow: 'Nächstes Heimspiel', headline: 'Komm in die Arena!', competition: 'Oberliga Süd', dateLabel: 'Sa 12.10. · 19:30 Uhr', homeTeam: 'Donau Panther', awayTeam: 'EV Landshut', homeLogo: IMG.logoHome, awayLogo: IMG.logoAway, venue: 'Saturn-Arena Ingolstadt · Jahnstraße 10', image: IMG.arena, primaryCta: { label: 'Tickets sichern', href: '/spielplan' }, secondaryCta: { label: 'Zum Spielplan', href: '/spielplan' } } };
const immersiveCta = (headline, subline, primaryCta, secondaryCta) => ({
  type: 'immersiveCtaBanner',
  data: { badge: 'Panther-Familie', headline, subline, image: IMG.crowd, overlay: 'rgba(20,20,28,0.66)', primaryCta, secondaryCta },
});
const compactCta = (headline, subline, ctaPrimary) => ({
  type: 'ctaBand',
  data: { badgeText: 'Donau Panther', headline, subline, ctaPrimary },
});
const splitCta = (headline, subline, primaryCta, secondaryCta) => ({
  type: 'ctaSplit',
  data: { badge: 'Mannschaft & Verein', headline, text: `<p>${subline}</p>`, image: IMG.crowd, primaryCta, secondaryCta },
});

module.exports = {
  slug: 'eishockey',
  wipe: true,
  brand: { companyName: 'EHC Donau Panther', tagline: 'Eishockey aus Leidenschaft — seit 1978', primaryColor: '#dc2626', secondaryColor: '#1e293b' },
  contact: { phone: '+49 841 555 010', email: 'info@donau-panther.de', address: ARENA },
  seoGlobal: {
    titleTemplate: '%s | EHC Donau Panther',
    defaultTitle: 'EHC Donau Panther — Eishockey in Ingolstadt',
    defaultDescription: 'Oberliga-Eishockey in der Saturn-Arena Ingolstadt: Spielplan, Tabelle, Kader und Tickets des EHC Donau Panther. Eishockey aus Leidenschaft seit 1978.',
    defaultOgImage: IMG.arena,
    locale: 'de_DE',
  },
  navigation: {
    items: [
      { label: 'Spielplan', href: '/spielplan' },
      { label: 'Kader', href: '/kader' },
      { label: 'Verein', href: '/verein' },
      { label: 'Sponsoren', href: '/sponsoren' },
    ],
    ctaLabel: 'Tickets', ctaHref: '/spielplan',
  },
  footer: {
    columns: [
      { title: 'Team', items: [{ text: 'Spielplan', href: '/spielplan' }, { text: 'Kader', href: '/kader' }, { text: 'Tabelle', href: '/spielplan' }] },
      { title: 'Verein', items: [{ text: 'Über uns', href: '/verein' }, { text: 'Sponsoren', href: '/sponsoren' }, { text: 'Kontakt', href: '/kontakt' }] },
      { title: 'Kontakt', items: [{ text: ARENA }, { text: '+49 841 555 010' }, { text: 'info@donau-panther.de' }] },
    ],
    legalLinks: [{ label: 'Impressum', href: '/impressum' }, { label: 'Datenschutz', href: '/datenschutz' }],
  },
  pages: [
    { slug: 'startseite', title: 'Startseite', seo: { metaTitle: 'Eishockey in Ingolstadt', metaDescription: 'Oberliga-Eishockey in der Saturn-Arena Ingolstadt: Spielplan, Tabelle, Kader und Tickets des EHC Donau Panther.' }, sections: [
      nextMatch,
      { type: 'statsCounter', data: { badgeText: 'Der Verein', headline: 'Eishockey mit Tradition.', items: [{ value: '1978', label: 'Gegründet' }, { value: '480', label: 'Mitglieder' }, { value: '6', label: 'Nachwuchsteams' }, { value: '3.200', label: 'Plätze in der Arena' }] } },
      { type: 'leagueTable', data: TABLE },
      { type: 'matchSchedule', data: SCHEDULE },
      { type: 'zigzagShowcase', data: { rows: [
        { eyebrow: 'Profiteam', headline: 'Oberliga-Eishockey in Ingolstadt.', text: '<p>Schnelles, ehrliches Eishockey — jede Woche in der Saturn-Arena. Unsere erste Mannschaft spielt in der Oberliga Süd und lebt von der Unterstützung der Fans.</p>', image: IMG.action, imageAlt: 'Zweikampf der Donau Panther an der Bande', links: [{ label: 'Kader ansehen', href: '/kader' }] },
        { eyebrow: 'Nachwuchs', headline: 'Vom Bambini bis zur U20.', text: '<p>Über 300 Kinder und Jugendliche trainieren bei den Panthern. Vom ersten Schritt auf dem Eis bis zum Sprung in die Junioren-Ligen begleiten wir jeden Weg.</p>', image: IMG.youth, imageAlt: 'Nachwuchstraining', links: [{ label: 'Zum Verein', href: '/verein' }] },
      ] } },
      { type: 'teamRoster', data: { ...ROSTER, players: ROSTER.players.slice(0, 5) } },
      { type: 'sponsorsWall', data: SPONSORS },
      immersiveCta(
        'Sei dabei, wenn die Panther spielen.',
        'Dauerkarten, Tagestickets und Familienangebote — jedes Heimspiel wird zum Erlebnis.',
        { label: 'Heimspiele ansehen', href: '/spielplan' },
        { label: 'Verein kennenlernen', href: '/verein' },
      ),
    ] },
    { slug: 'spielplan', title: 'Spielplan', seo: { metaTitle: 'Spielplan & Tabelle', metaDescription: 'Alle Heim- und Auswärtsspiele des EHC Donau Panther in der Oberliga Süd — mit aktueller Tabelle und Tickets.' }, sections: [
      nextMatch, { type: 'matchSchedule', data: SCHEDULE }, { type: 'leagueTable', data: TABLE },
      compactCta(
        'Tickets für das nächste Heimspiel.',
        'Sichere dir deinen Platz in der Saturn-Arena — online oder an der Abendkasse.',
        { label: 'Ticketanfrage senden', href: '/kontakt' },
      ),
    ] },
    { slug: 'kader', title: 'Kader', seo: { metaTitle: 'Kader & Team', metaDescription: 'Der Kader des EHC Donau Panther in der Saison 2025/26: Torhüter, Verteidiger, Stürmer und der Betreuerstab.' }, sections: [
      { type: 'cinematicHero', data: { eyebrow: 'Saison 2025/26', headline: 'Das ist unser Team.', subline: 'Torhüter, Verteidiger und Stürmer der ersten Mannschaft.', image: IMG.action2, overlay: 'rgba(20,20,28,0.55)', align: 'left', primaryCta: { label: 'Spielplan ansehen', href: '/spielplan' } } },
      { type: 'teamRoster', data: ROSTER },
      { type: 'team', data: { badgeText: 'Betreuerstab', headline: 'Hinter der Bande', members: [
        { name: 'Andreas Klein', role: 'Cheftrainer', image: IMG.coach },
        { name: 'Stefan Bauer', role: 'Co-Trainer & Athletik', image: IMG.assistantCoach },
        { name: 'Dr. Petra Sommer', role: 'Teamärztin', image: IMG.doctor },
      ] } },
      splitCta(
        'Werde Teil der Panther-Familie.',
        'Ob als Fan, Mitglied oder Sponsor — bei uns ist jeder willkommen.',
        { label: 'Mitgliedschaft anfragen', href: '/kontakt' },
        { label: 'Nächstes Spiel ansehen', href: '/spielplan' },
      ),
    ] },
    { slug: 'verein', title: 'Verein', seo: { metaTitle: 'Der Verein', metaDescription: 'Der EHC Donau Panther: seit 1978 Eishockey in Ingolstadt, 480 Mitglieder, sechs Nachwuchsteams. Unsere Geschichte und Werte.' }, sections: [
      { type: 'editorialHero', data: { eyebrow: 'Seit 1978', headline: 'Ein Verein, der zusammenhält.', text: '<p>Der EHC Donau Panther steht für ehrlichen Sport, gelebten Zusammenhalt und eine der lautesten Kurven der Oberliga. Was mit einer Handvoll Eishockey-Begeisterter begann, ist heute ein Verein mit 480 Mitgliedern und sechs Nachwuchsteams.</p>', imagePrimary: IMG.crowd, imageSecondary: IMG.youth, primaryCta: { label: 'Mitglied werden', href: '/kontakt' }, secondaryCta: { label: 'Sponsoren', href: '/sponsoren' } } },
      { type: 'timeline', data: { badgeText: 'Geschichte', headline: 'Meilensteine', items: [
        { year: '1978', title: 'Gründung', text: 'Der EHC Donau Panther wird von 24 Eishockey-Begeisterten gegründet.' },
        { year: '1994', title: 'Erste Meisterschaft', text: 'Aufstieg in die Bayernliga und erster Titel der Vereinsgeschichte.' },
        { year: '2008', title: 'Neue Arena', text: 'Umzug in die Saturn-Arena mit 3.200 Plätzen.' },
        { year: '2019', title: 'Nachwuchszentrum', text: 'Eröffnung des vereinseigenen Nachwuchsleistungszentrums.' },
        { year: '2025', title: 'Oberliga', text: 'Etabliert in der Oberliga Süd — mit dem Ziel Playoffs.' },
      ] } },
      { type: 'statsCounter', data: { headline: 'Der Verein in Zahlen', items: [{ value: '47', label: 'Jahre' }, { value: '480', label: 'Mitglieder' }, { value: '6', label: 'Nachwuchsteams' }, { value: '30+', label: 'Ehrenamtliche' }] } },
      { type: 'faq', data: { badgeText: 'Gut zu wissen', headline: 'Häufige Fragen', items: [
        { question: 'Wo finde ich Tickets?', answer: 'Tickets gibt es online über unseren Shop und an der Abendkasse ab 18:00 Uhr.' },
        { question: 'Kann mein Kind bei euch Eishockey lernen?', answer: 'Ja! Unsere Laufschule startet ab 4 Jahren. Schnuppertrainings sind jederzeit nach Absprache möglich.' },
        { question: 'Wie werde ich Mitglied?', answer: 'Über das Kontaktformular oder direkt an der Geschäftsstelle. Es gibt Einzel-, Familien- und Fördermitgliedschaften.' },
        { question: 'Gibt es Dauerkarten?', answer: 'Ja, Dauerkarten für die gesamte Hauptrunde sind vor Saisonstart erhältlich und günstiger als Einzeltickets.' },
      ] } },
      immersiveCta(
        'Unterstütze deinen Verein.',
        'Mitgliedschaft, Ehrenamt oder Sponsoring — jeder Beitrag zählt.',
        { label: 'Mitglied werden', href: '/kontakt' },
        { label: 'Sponsoring ansehen', href: '/sponsoren' },
      ),
    ] },
    { slug: 'sponsoren', title: 'Sponsoren', seo: { metaTitle: 'Sponsoren & Partner', metaDescription: 'Die Partner des EHC Donau Panther und die Sponsoring-Pakete: von Bandenwerbung bis Hauptsponsoring.' }, sections: [
      { type: 'editorialHero', data: { eyebrow: 'Partner', headline: 'Starke Partner an unserer Seite.', text: '<p>Ohne unsere Sponsoren gäbe es keinen Leistungssport und keinen Nachwuchs. Wir sagen Danke — und bieten Partnern eine Bühne bei jedem Heimspiel.</p>', imagePrimary: IMG.arena, primaryCta: { label: 'Sponsor werden', href: '/kontakt' } } },
      { type: 'sponsorsWall', data: SPONSORS },
      { type: 'comparisonCardsPro', data: { badge: 'Sponsoring', headline: 'Partnerpakete', subline: 'Vom Bandenlogo bis zum Hauptsponsoring — für jedes Budget das passende Paket.', plans: [
        { name: 'Bande', price: 'ab 500 €', note: 'pro Saison', features: ['Bandenwerbung in der Arena', 'Logo auf der Website', 'Nennung im Stadionheft'], ctaLabel: 'Anfragen', ctaHref: '/kontakt' },
        { name: 'Premium', price: 'ab 2.500 €', note: 'pro Saison', highlighted: true, features: ['Alles aus Bande', 'Trikot- oder Helmwerbung', '4 VIP-Tickets pro Heimspiel', 'Social-Media-Präsenz'], ctaLabel: 'Anfragen', ctaHref: '/kontakt' },
        { name: 'Hauptsponsor', price: 'auf Anfrage', note: 'individuell', features: ['Namensrecht & Trikotbrust', 'VIP-Loge', 'Exklusive Aktionen', 'Presse & PR'], ctaLabel: 'Gespräch anfragen', ctaHref: '/kontakt' },
      ] } },
      compactCta(
        'Werde Partner der Panther.',
        'Sprich mit uns über ein Paket, das zu deinem Unternehmen passt.',
        { label: 'Sponsoring besprechen', href: '/kontakt' },
      ),
    ] },
    { slug: 'kontakt', title: 'Kontakt', seo: { metaTitle: 'Kontakt & Anfahrt', metaDescription: 'Kontakt zur Geschäftsstelle des EHC Donau Panther in der Saturn-Arena Ingolstadt — Tickets, Mitgliedschaft, Nachwuchs und Sponsoring.' }, sections: [
      { type: 'editorialHero', data: { eyebrow: 'Kontakt', headline: 'Schreib uns.', text: '<p>Fragen zu Tickets, Mitgliedschaft, Nachwuchs oder Sponsoring? Die Geschäftsstelle meldet sich schnell zurück.</p>', imagePrimary: IMG.crowd, primaryCta: { label: 'Jetzt anrufen', href: 'tel:+49841555010' }, hint: 'Saturn-Arena · Jahnstraße 10 · 85049 Ingolstadt' } },
      { type: 'contact', data: { badgeText: 'Geschäftsstelle', headline: 'So erreichst du uns', subline: 'Telefonisch unter +49 841 555 010 oder über das Formular.', email: 'info@donau-panther.de', phone: '+49 841 555 010', address: ARENA, formEnabled: true, submitLabel: 'Nachricht senden' } },
      { type: 'map', data: { headline: 'Anfahrt zur Arena', address: ARENA, embedUrl: 'https://www.google.com/maps?q=Saturn-Arena%20Ingolstadt&output=embed' } },
    ] },
    { slug: 'impressum', title: 'Impressum', seo: { metaTitle: 'Impressum', metaDescription: 'Demo-Impressum des fiktiven EHC Donau Panther in Ingolstadt.' }, sections: [
      { type: 'legalContent', data: { headline: 'Impressum', blocks: [
        { title: 'Demo-Anbieter', text: '<p>EHC Donau Panther e. V.<br>Saturn-Arena, Jahnstraße 10<br>85049 Ingolstadt</p>' },
        { title: 'Kontakt', text: '<p>Telefon: +49 841 555 010<br>E-Mail: info@donau-panther.de</p>' },
        { title: 'Hinweis', text: '<p>Dieser Verein ist fiktiv. Inhalte und Kontaktdaten dienen ausschließlich der Demonstration des CMS.</p>' },
      ] } },
    ] },
    { slug: 'datenschutz', title: 'Datenschutz', seo: { metaTitle: 'Datenschutz', metaDescription: 'Datenschutzhinweise zur Demo-Website des fiktiven EHC Donau Panther.' }, sections: [
      { type: 'legalContent', data: { headline: 'Datenschutzhinweise', blocks: [
        { title: 'Demo-Website', text: '<p>Diese Seite zeigt eine fiktive Vereinswebsite. Formulare dürfen in der Demo keine echten personenbezogenen Daten enthalten.</p>' },
        { title: 'Kontaktformular', text: '<p>In einem Kundenprojekt werden Zweck, Speicherdauer und Rechtsgrundlage passend zur tatsächlichen Verarbeitung dokumentiert.</p>' },
        { title: 'Externe Inhalte', text: '<p>Eingebettete Karten oder Medien werden erst nach der dafür erforderlichen Einwilligung geladen.</p>' },
      ] } },
    ] },
  ],
  publish: true,
};
