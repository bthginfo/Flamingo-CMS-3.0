import type { DemoSite } from './types';

// Fiktiver Eishockeyverein für die "Verein & Sport"-Branche. Zeigt alle neuen
// Club-Sections (nextMatchHero, matchSchedule, leagueTable, teamRoster,
// sponsorsWall) im Zusammenspiel mit Premium-Standardsections.
const B = { visible: true, variant: null, container: 'default' as const, spacingTop: 'l' as const, spacingBottom: 'l' as const, anchorId: null };
const FULL = { ...B, container: 'full' as const, spacingTop: 'none' as const, spacingBottom: 'none' as const };

// Nur verifizierte, thematisch passende Unsplash-Bilder. Teamlogos bewusst
// leer → die Section rendert saubere Initialen-Wappen statt Fake-Logos.
const IMG = {
  arena: 'https://images.unsplash.com/photo-1607627000458-210e8d2bdb1d?auto=format&fit=crop&w=1800&q=80', // Flutlicht-Atmosphäre
  action: 'https://images.unsplash.com/photo-1515703407324-5f753afd8be8?auto=format&fit=crop&w=1600&q=80', // Eishockey-Tor auf dem Eis
  action2: 'https://images.unsplash.com/photo-1515703407324-5f753afd8be8?auto=format&fit=crop&w=1600&q=80',
  crowd: 'https://images.unsplash.com/photo-1607627000458-210e8d2bdb1d?auto=format&fit=crop&w=1600&q=80',
  youth: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=1600&q=80', // Nachwuchs-Team
  p1: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&w=500&q=80',
  p2: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80',
  p3: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80',
  p4: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=500&q=80',
  p5: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=500&q=80',
  p6: 'https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?auto=format&fit=crop&w=500&q=80',
};

const SCHEDULE = {
  badgeText: 'Saison 2025/26',
  headline: 'Spielplan',
  subline: 'Alle Termine der Hauptrunde — Heimspiele in der Saturn-Arena.',
  matches: [
    { dateLabel: 'Sa 12.10.', competition: 'Oberliga', homeTeam: 'Donau Panther', awayTeam: 'EV Landshut', venue: 'Saturn-Arena', homeGame: true, ticketHref: '#' },
    { dateLabel: 'Fr 18.10.', competition: 'Oberliga', homeTeam: 'Deggendorfer SC', awayTeam: 'Donau Panther', venue: 'Deggendorf', homeGame: false },
    { dateLabel: 'So 20.10.', competition: 'Oberliga', homeTeam: 'Donau Panther', awayTeam: 'Höchstadt Alligators', venue: 'Saturn-Arena', result: '4:2', homeGame: true },
    { dateLabel: 'Fr 25.10.', competition: 'Pokal', homeTeam: 'Selber Wölfe', awayTeam: 'Donau Panther', venue: 'Selb', homeGame: false },
    { dateLabel: 'So 27.10.', competition: 'Oberliga', homeTeam: 'Donau Panther', awayTeam: 'Memmingen Indians', venue: 'Saturn-Arena', homeGame: true, ticketHref: '#' },
    { dateLabel: 'Fr 01.11.', competition: 'Oberliga', homeTeam: 'Passau Black Hawks', awayTeam: 'Donau Panther', venue: 'Passau', homeGame: false },
  ],
};

const TABLE = {
  badgeText: 'Tabelle',
  headline: 'Oberliga Süd',
  subline: 'Stand nach dem 8. Spieltag.',
  rows: [
    { rank: '1', team: 'Selber Wölfe', played: '8', won: '7', drawn: '0', lost: '1', points: '21' },
    { rank: '2', team: 'Memmingen Indians', played: '8', won: '6', drawn: '1', lost: '1', points: '19' },
    { rank: '3', team: 'Donau Panther', played: '8', won: '5', drawn: '1', lost: '2', points: '16', highlight: true },
    { rank: '4', team: 'EV Landshut', played: '8', won: '4', drawn: '1', lost: '3', points: '13' },
    { rank: '5', team: 'Deggendorfer SC', played: '8', won: '3', drawn: '0', lost: '5', points: '9' },
    { rank: '6', team: 'Höchstadt Alligators', played: '8', won: '1', drawn: '1', lost: '6', points: '4' },
  ],
};

const ROSTER = {
  badgeText: 'Saison 2025/26',
  headline: 'Unser Kader',
  subline: 'Torhüter, Verteidigung und Sturm — das ist die Mannschaft.',
  players: [
    { number: '1', name: 'Max Berger', position: 'Torwart', nationality: 'DE', image: IMG.p1 },
    { number: '7', name: 'Jonas Weiß', position: 'Verteidigung', nationality: 'DE', image: IMG.p2 },
    { number: '12', name: 'Elias Novák', position: 'Verteidigung', nationality: 'CZ', image: IMG.p3 },
    { number: '19', name: 'Lukas Fischer', position: 'Center', nationality: 'DE', image: IMG.p4 },
    { number: '23', name: 'Ryan O’Connor', position: 'Flügel', nationality: 'CA', image: IMG.p5 },
    { number: '27', name: 'Niklas Huber', position: 'Flügel', nationality: 'DE', image: IMG.p6 },
    { number: '44', name: 'Tomas Král', position: 'Verteidigung', nationality: 'SK', image: IMG.p2 },
    { number: '91', name: 'David Wagner', position: 'Center', nationality: 'DE', image: IMG.p4 },
  ],
};

const SPONSORS = {
  badgeText: 'Danke',
  headline: 'Unsere Partner',
  subline: 'Gemeinsam für den Nachwuchs und den Eishockeysport in der Region.',
  tiers: [
    { tierLabel: 'Hauptsponsoren', logos: [{ name: 'Saturn' }, { name: 'AUDI' }, { name: 'Stadtwerke' }] },
    { tierLabel: 'Premium-Partner', logos: [{ name: 'Sparkasse' }, { name: 'MediaMarkt' }, { name: 'BAUHAUS' }, { name: 'Getränke Huber' }] },
    { tierLabel: 'Förderpartner', logos: [{ name: 'Bäckerei Müller' }, { name: 'Autohaus Weber' }, { name: 'Physio Aktiv' }, { name: 'Pizzeria Roma' }, { name: 'Optik Klar' }, { name: 'Elektro Bauer' }] },
  ],
};

const nextMatch = {
  ...FULL, id: 'eh-next', type: 'nextMatchHero',
  data: {
    eyebrow: 'Nächstes Heimspiel', headline: 'Komm in die Arena!',
    competition: 'Oberliga Süd', dateLabel: 'Sa 12.10. · 19:30 Uhr',
    homeTeam: 'Donau Panther', awayTeam: 'EV Landshut',
    homeLogo: '', awayLogo: '',
    venue: 'Saturn-Arena Ingolstadt · Jahnstraße 10',
    image: IMG.arena,
    primaryCta: { label: 'Tickets sichern', href: '/demo/eishockey/spielplan' },
    secondaryCta: { label: 'Zum Spielplan', href: '/demo/eishockey/spielplan' },
  },
};

const ctaBand = (headline: string, subline: string) => ({
  ...B, id: `eh-cta-${headline.slice(0, 6)}`, type: 'immersiveCtaBanner',
  data: { badge: 'Panther-Familie', headline, subline, image: IMG.crowd, overlay: 'rgba(20,20,28,0.66)', primaryCta: { label: 'Tickets & Termine', href: '/demo/eishockey/spielplan' }, secondaryCta: { label: 'Mitglied werden', href: '/demo/eishockey/kontakt' } },
});

export const eishockeySite: DemoSite = {
  industry: 'verein',
  industryKey: 'eishockey',
  defaultStyle: 'classic',
  pages: [
    {
      slug: 'startseite',
      title: 'Startseite',
      sections: [
        nextMatch,
        {
          ...B, id: 'eh-stats', type: 'statsCounter',
          data: { badgeText: 'Der Verein', headline: 'Eishockey mit Tradition.', items: [
            { value: '1978', label: 'Gegründet' }, { value: '480', label: 'Mitglieder' }, { value: '6', label: 'Nachwuchsteams' }, { value: '3.200', label: 'Plätze in der Arena' },
          ] },
        },
        { ...B, id: 'eh-table-home', type: 'leagueTable', data: TABLE },
        { ...B, id: 'eh-sched-home', type: 'matchSchedule', data: SCHEDULE },
        {
          ...B, id: 'eh-zig', type: 'zigzagShowcase',
          data: { rows: [
            { eyebrow: 'Profiteam', headline: 'Oberliga-Eishockey in Ingolstadt.', text: '<p>Schnelles, ehrliches Eishockey — jede Woche in der Saturn-Arena. Unsere erste Mannschaft spielt in der Oberliga Süd und lebt von der Unterstützung der Fans.</p>', image: IMG.action, imageAlt: 'Spielszene', links: [{ label: 'Kader ansehen', href: '/demo/eishockey/kader' }] },
            { eyebrow: 'Nachwuchs', headline: 'Vom Bambini bis zur U20.', text: '<p>Über 300 Kinder und Jugendliche trainieren bei den Panthern. Vom ersten Schritt auf dem Eis bis zum Sprung in die Junioren-Ligen begleiten wir jeden Weg.</p>', image: IMG.youth, imageAlt: 'Nachwuchstraining', links: [{ label: 'Zum Verein', href: '/demo/eishockey/verein' }] },
          ] },
        },
        { ...B, id: 'eh-roster-home', type: 'teamRoster', data: { ...ROSTER, players: ROSTER.players.slice(0, 5) } },
        { ...B, id: 'eh-sponsors-home', type: 'sponsorsWall', data: SPONSORS },
        ctaBand('Sei dabei, wenn die Panther spielen.', 'Dauerkarten, Tagestickets und Familienangebote — jedes Heimspiel wird zum Erlebnis.'),
      ],
    },
    {
      slug: 'spielplan',
      title: 'Spielplan',
      sections: [
        { ...FULL, id: 'eh-sp-hero', type: 'nextMatchHero', data: nextMatch.data },
        { ...B, id: 'eh-sp-sched', type: 'matchSchedule', data: SCHEDULE },
        { ...B, id: 'eh-sp-table', type: 'leagueTable', data: TABLE },
        ctaBand('Tickets für das nächste Heimspiel.', 'Sichere dir deinen Platz in der Saturn-Arena — online oder an der Abendkasse.'),
      ],
    },
    {
      slug: 'kader',
      title: 'Kader',
      sections: [
        {
          ...FULL, id: 'eh-kader-hero', type: 'cinematicHero',
          data: { eyebrow: 'Saison 2025/26', headline: 'Das ist unser Team.', subline: 'Torhüter, Verteidiger und Stürmer der ersten Mannschaft.', image: IMG.action2, overlay: 'rgba(20,20,28,0.55)', align: 'left', primaryCta: { label: 'Spielplan ansehen', href: '/demo/eishockey/spielplan' } },
        },
        { ...B, id: 'eh-kader-roster', type: 'teamRoster', data: ROSTER },
        {
          ...B, id: 'eh-kader-staff', type: 'team',
          data: { badgeText: 'Betreuerstab', headline: 'Hinter der Bande', members: [
            { name: 'Andreas Klein', role: 'Cheftrainer', image: IMG.p1 },
            { name: 'Stefan Bauer', role: 'Co-Trainer & Athletik', image: IMG.p4 },
            { name: 'Dr. Petra Sommer', role: 'Teamärztin', image: IMG.p6 },
          ] },
        },
        ctaBand('Werde Teil der Panther-Familie.', 'Ob als Fan, Mitglied oder Sponsor — bei uns ist jeder willkommen.'),
      ],
    },
    {
      slug: 'verein',
      title: 'Verein',
      sections: [
        {
          ...B, id: 'eh-v-hero', type: 'editorialHero',
          data: { eyebrow: 'Seit 1978', headline: 'Ein Verein, der zusammenhält.', text: '<p>Der EHC Donau Panther steht für ehrlichen Sport, gelebten Zusammenhalt und eine der lautesten Kurven der Oberliga. Was mit einer Handvoll Eishockey-Begeisterter begann, ist heute ein Verein mit 480 Mitgliedern und sechs Nachwuchsteams.</p>', imagePrimary: IMG.crowd, imageSecondary: IMG.youth, primaryCta: { label: 'Mitglied werden', href: '/demo/eishockey/kontakt' }, secondaryCta: { label: 'Sponsoren', href: '/demo/eishockey/sponsoren' } },
        },
        {
          ...B, id: 'eh-v-timeline', type: 'timeline',
          data: { badgeText: 'Geschichte', headline: 'Meilensteine', items: [
            { year: '1978', title: 'Gründung', text: 'Der EHC Donau Panther wird von 24 Eishockey-Begeisterten gegründet.' },
            { year: '1994', title: 'Erste Meisterschaft', text: 'Aufstieg in die Bayernliga und erster Titel der Vereinsgeschichte.' },
            { year: '2008', title: 'Neue Arena', text: 'Umzug in die Saturn-Arena mit 3.200 Plätzen.' },
            { year: '2019', title: 'Nachwuchszentrum', text: 'Eröffnung des vereinseigenen Nachwuchsleistungszentrums.' },
            { year: '2025', title: 'Oberliga', text: 'Etabliert in der Oberliga Süd — mit dem Ziel Playoffs.' },
          ] },
        },
        { ...B, id: 'eh-v-stats', type: 'statsCounter', data: { headline: 'Der Verein in Zahlen', items: [ { value: '47', label: 'Jahre' }, { value: '480', label: 'Mitglieder' }, { value: '6', label: 'Nachwuchsteams' }, { value: '30+', label: 'Ehrenamtliche' } ] } },
        {
          ...B, id: 'eh-v-faq', type: 'faq',
          data: { badgeText: 'Gut zu wissen', headline: 'Häufige Fragen', items: [
            { question: 'Wo finde ich Tickets?', answer: 'Tickets gibt es online über unseren Shop und an der Abendkasse ab 18:00 Uhr.' },
            { question: 'Kann mein Kind bei euch Eishockey lernen?', answer: 'Ja! Unsere Laufschule startet ab 4 Jahren. Schnuppertrainings sind jederzeit nach Absprache möglich.' },
            { question: 'Wie werde ich Mitglied?', answer: 'Über das Kontaktformular oder direkt an der Geschäftsstelle. Es gibt Einzel-, Familien- und Fördermitgliedschaften.' },
            { question: 'Gibt es Dauerkarten?', answer: 'Ja, Dauerkarten für die gesamte Hauptrunde sind vor Saisonstart erhältlich und deutlich günstiger als Einzeltickets.' },
          ] },
        },
        ctaBand('Unterstütze deinen Verein.', 'Mitgliedschaft, Ehrenamt oder Sponsoring — jeder Beitrag zählt.'),
      ],
    },
    {
      slug: 'sponsoren',
      title: 'Sponsoren',
      sections: [
        {
          ...B, id: 'eh-sp2-hero', type: 'editorialHero',
          data: { eyebrow: 'Partner', headline: 'Starke Partner an unserer Seite.', text: '<p>Ohne unsere Sponsoren gäbe es keinen Leistungssport und keinen Nachwuchs. Wir sagen Danke — und bieten Partnern eine Bühne bei jedem Heimspiel.</p>', imagePrimary: IMG.arena, primaryCta: { label: 'Sponsor werden', href: '/demo/eishockey/kontakt' } },
        },
        { ...B, id: 'eh-sp2-wall', type: 'sponsorsWall', data: SPONSORS },
        {
          ...B, id: 'eh-sp2-pkg', type: 'comparisonCardsPro',
          data: { badge: 'Sponsoring', headline: 'Partnerpakete', subline: 'Vom Bandenlogo bis zum Hauptsponsoring — für jedes Budget das passende Paket.', plans: [
            { name: 'Bande', price: 'ab 500 €', note: 'pro Saison', features: ['Bandenwerbung in der Arena', 'Logo auf der Website', 'Nennung im Stadionheft'], ctaLabel: 'Anfragen', ctaHref: '/demo/eishockey/kontakt' },
            { name: 'Premium', price: 'ab 2.500 €', note: 'pro Saison', highlighted: true, features: ['Alles aus Bande', 'Trikot- oder Helmwerbung', '4 VIP-Tickets pro Heimspiel', 'Social-Media-Präsenz'], ctaLabel: 'Anfragen', ctaHref: '/demo/eishockey/kontakt' },
            { name: 'Hauptsponsor', price: 'auf Anfrage', note: 'individuell', features: ['Namensrecht & Trikotbrust', 'VIP-Loge', 'Exklusive Aktionen', 'Presse & PR'], ctaLabel: 'Gespräch anfragen', ctaHref: '/demo/eishockey/kontakt' },
          ] },
        },
        ctaBand('Werde Partner der Panther.', 'Sprich mit uns über ein Paket, das zu deinem Unternehmen passt.'),
      ],
    },
    {
      slug: 'kontakt',
      title: 'Kontakt',
      sections: [
        {
          ...B, id: 'eh-k-hero', type: 'editorialHero',
          data: { eyebrow: 'Kontakt', headline: 'Schreib uns.', text: '<p>Fragen zu Tickets, Mitgliedschaft, Nachwuchs oder Sponsoring? Die Geschäftsstelle meldet sich schnell zurück.</p>', imagePrimary: IMG.crowd, primaryCta: { label: 'Jetzt anrufen', href: 'tel:+49841555010' }, hint: 'Saturn-Arena · Jahnstraße 10 · 85049 Ingolstadt' },
        },
        {
          ...B, id: 'eh-k-contact', type: 'contact',
          data: { badgeText: 'Geschäftsstelle', headline: 'So erreichst du uns', subline: 'Telefonisch unter +49 841 555 010 oder über das Formular.', email: 'info@donau-panther.de', phone: '+49 841 555 010', address: 'Saturn-Arena, Jahnstraße 10, 85049 Ingolstadt', formEnabled: true, submitLabel: 'Nachricht senden' },
        },
        { ...B, id: 'eh-k-map', type: 'map', data: { headline: 'Anfahrt zur Arena', address: 'Saturn-Arena, Jahnstraße 10, 85049 Ingolstadt', embedUrl: 'https://www.google.com/maps?q=Saturn-Arena%20Ingolstadt&output=embed' } },
      ],
    },
  ],
};
