import { requireDatabaseUrl } from './_database-url';
/**
 * Fix wedding demo tenant data: insert global_settings, navigation, footer, and page_sections.
 * The original seed script incorrectly tried to put sections on the pages table.
 * Usage: npx tsx scripts/fix-wedding-demo-data.ts
 */
import { neon } from '@neondatabase/serverless';
import crypto from 'crypto';

const DATABASE_URL = requireDatabaseUrl();
const sql = neon(DATABASE_URL);

const TENANT_ID = '39a03f3a-3eaf-4cf8-acec-2f74534f0392';

// Page IDs from existing DB
const PAGE_IDS: Record<string, string> = {
  '/': '5414442f-929c-4647-9483-a2408369fcbe',
  '/location': 'a0da8af2-f852-49f6-8895-a06da2836987',
  '/rsvp': '04c40ef8-74de-4896-a505-e7999aaea4ae',
  '/trauzeugen': '8f2e89c8-97d0-4d67-987b-00f1ef9c8319',
  '/menue': '9ecacddb-d947-49ca-b9cf-7a66d7caa037',
  '/geschenke': '1d69aaee-31a1-49eb-a33c-60711a91f7c1',
  '/faq': '5ad19636-5044-4fa2-ad23-62acb00ea88a',
};

async function main() {
  console.log('Fixing wedding demo tenant data...');

  // 1. Insert global_settings
  await sql(`INSERT INTO global_settings (id, tenant_id, brand, contact, social_links, design)
    VALUES ($1, $2, $3, $4, $5, $6)
    ON CONFLICT (tenant_id) DO UPDATE SET brand=$3, contact=$4, social_links=$5, design=$6`, [
    crypto.randomUUID(), TENANT_ID,
    JSON.stringify({ companyName: 'Anna & Maximilian', tagline: 'Wir heiraten am 12. September 2026', primaryColor: '#d4a373' }),
    JSON.stringify({ email: 'hochzeit@anna-max.at', phone: '' }),
    JSON.stringify({ instagram: 'https://instagram.com/anna.und.max' }),
    JSON.stringify({ font: 'Cormorant Garamond', accentFont: 'Great Vibes' }),
  ]);
  console.log('  ✅ global_settings');

  // 2. Insert navigation
  await sql(`INSERT INTO navigation (id, tenant_id, items, cta)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (tenant_id) DO UPDATE SET items=$3, cta=$4`, [
    crypto.randomUUID(), TENANT_ID,
    JSON.stringify([
      { label: 'Ablauf', href: '/' },
      { label: 'Location', href: '/location' },
      { label: 'Trauzeugen', href: '/trauzeugen' },
      { label: 'Menü', href: '/menue' },
      { label: 'Geschenke', href: '/geschenke' },
      { label: 'FAQ', href: '/faq' },
    ]),
    JSON.stringify({ label: 'RSVP', href: '/rsvp' }),
  ]);
  console.log('  ✅ navigation');

  // 3. Insert footer
  await sql(`INSERT INTO footer (id, tenant_id, columns, legal_links, cta)
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (tenant_id) DO UPDATE SET columns=$3, legal_links=$4, cta=$5`, [
    crypto.randomUUID(), TENANT_ID,
    JSON.stringify([
      { title: 'Programm', items: [{ text: 'Tagesablauf', href: '/' }, { text: 'Location', href: '/location' }, { text: 'Menü', href: '/menue' }] },
      { title: 'Infos', items: [{ text: 'Trauzeugen', href: '/trauzeugen' }, { text: 'Geschenke', href: '/geschenke' }, { text: 'FAQ', href: '/faq' }] },
    ]),
    JSON.stringify([{ label: 'Impressum', href: '/impressum' }, { label: 'Datenschutz', href: '/datenschutz' }]),
    JSON.stringify({ label: 'Zusagen', href: '/rsvp' }),
  ]);
  console.log('  ✅ footer');

  // 4. Insert page_sections
  const sections: { pageSlug: string; type: string; data: Record<string, unknown>; sortOrder: number }[] = [
    // --- Startseite ---
    { pageSlug: '/', type: 'hero', sortOrder: 0, data: { coupleName: 'Anna & Maximilian', date: '2026-09-12', venue: 'Schloss Ambras, Innsbruck', tagline: 'Wir heiraten!', bgImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=80', overlayColor: '#000000', overlayOpacity: '0.3' } },
    { pageSlug: '/', type: 'coupleStory', sortOrder: 1, data: { headline: 'Unsere Geschichte', subline: 'Wie alles begann...', milestones: [
      { year: '2018', title: 'Das erste Treffen', text: 'Auf einer Geburtstagsfeier im Sommer trafen sich unsere Blicke zum ersten Mal.', image: '' },
      { year: '2019', title: 'Erster gemeinsamer Urlaub', text: 'Zwei Wochen in Portugal — und wir wussten: das ist es.', image: '' },
      { year: '2022', title: 'Zusammengezogen', text: 'Unsere erste gemeinsame Wohnung in Innsbruck, mit Blick auf die Nordkette.', image: '' },
      { year: '2025', title: 'Der Antrag', text: 'Am Hafelekar, bei Sonnenuntergang, mit dem schönsten Ja der Welt.', image: '' },
    ] } },
    { pageSlug: '/', type: 'eventSchedule', sortOrder: 2, data: { headline: 'Unser Tag', subline: 'So haben wir uns den Ablauf vorgestellt', events: [
      { time: '14:00', title: 'Trauung', description: 'Kirchliche Zeremonie in der Schlosskapelle', icon: 'Church', location: 'Schlosskapelle Ambras' },
      { time: '15:30', title: 'Sektempfang', description: 'Stoßt mit uns im Schlossgarten an!', icon: 'Wine', location: 'Schlossgarten' },
      { time: '16:30', title: 'Gruppenfoto', description: 'Erinnerungen für die Ewigkeit', icon: 'Camera', location: 'Schlossterrasse' },
      { time: '18:00', title: 'Dinner', description: '4-Gänge-Menü im Festsaal', icon: 'UtensilsCrossed', location: 'Spanischer Saal' },
      { time: '21:00', title: 'Eröffnungstanz', description: 'Unser erster Tanz als Ehepaar', icon: 'Music', location: 'Festsaal' },
      { time: '22:00', title: 'Party', description: 'DJ & Tanzfläche bis in die Nacht', icon: 'PartyPopper', location: 'Festsaal' },
    ] } },
    // --- Location ---
    { pageSlug: '/location', type: 'venueInfo', sortOrder: 0, data: { headline: 'Unsere Location', subline: 'Ein märchenhafter Ort für einen unvergesslichen Tag', venues: [
      { name: 'Schloss Ambras', image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80', address: 'Schlossstraße 20, 6020 Innsbruck', description: 'Eines der schönsten Renaissance-Schlösser Österreichs, umgeben von einem weitläufigen Park mit Blick auf die Tiroler Berge.', mapEmbed: '', parkingInfo: 'Kostenfreie Parkplätze am Schloss verfügbar. Shuttle vom Hotel zum Schloss.' },
    ] } },
    { pageSlug: '/location', type: 'travelInfo', sortOrder: 1, data: { headline: 'Anreise & Übernachtung', subline: '', sections: [
      { title: 'Mit dem Auto', icon: 'Car', content: 'A13 Inntal-Autobahn, Ausfahrt Innsbruck-Ost → Beschilderung Schloss Ambras folgen. Parkplätze direkt am Schloss.' },
      { title: 'Mit der Bahn', icon: 'Train', content: 'Innsbruck Hbf → Buslinie J Richtung Ambras (10 Min). Oder Taxi ca. 8 Minuten.' },
      { title: 'Flugzeug', icon: 'Plane', content: 'Flughafen Innsbruck (INN), 10 Min Taxi zum Schloss. Alternativ München (MUC) + 2h Zug.' },
    ], hotels: [
      { name: 'Hotel Grauer Bär', image: '', link: '', distance: '3 km', specialRate: 'Sonderkonditionen unter "Hochzeit Anna & Max"', stars: '4' },
      { name: 'STAGE 12', image: '', link: '', distance: '4 km', specialRate: 'Code ANNAMAX2026 für 15% Rabatt', stars: '4' },
      { name: 'Nala Individuell Hotel', image: '', link: '', distance: '3.5 km', specialRate: '', stars: '4' },
    ] } },
    // --- RSVP ---
    { pageSlug: '/rsvp', type: 'rsvp', sortOrder: 0, data: { headline: 'Seid ihr dabei?', subline: 'Bitte gebt uns bis zum 1. Juli 2026 Bescheid.', deadline: '01.07.2026', maxGuests: 4, showSongWish: true, showDietary: true, showAllergies: true } },
    // --- Trauzeugen ---
    { pageSlug: '/trauzeugen', type: 'weddingParty', sortOrder: 0, data: { headline: 'Unsere Trauzeugen', subline: 'Die wichtigsten Menschen an unserer Seite', members: [
      { name: 'Lisa Berger', role: 'Trauzeugin der Braut', relationship: 'Beste Freundin seit dem Studium', text: 'Lisa kennt Anna seit dem ersten Semester und war von Anfang an dabei – bei jedem Abenteuer, jedem Umzug und jetzt auch am Altar.', image: '' },
      { name: 'Thomas Hofer', role: 'Trauzeuge des Bräutigams', relationship: 'Bruder des Bräutigams', text: 'Als großer Bruder hat Thomas Max schon immer den Rücken gestärkt. Natürlich steht er auch an diesem Tag an seiner Seite.', image: '' },
      { name: 'Sophie Auer', role: 'Brautjungfer', relationship: 'Schwester der Braut', text: 'Klein-Schwester, große Stütze. Sophie organisiert, plant und sorgt dafür, dass alles reibungslos läuft.', image: '' },
      { name: 'David Keller', role: 'Groomsman', relationship: 'Bester Freund seit Schulzeit', text: 'Seit der 5. Klasse unzertrennlich — David und Max teilen sich nicht nur Erinnerungen, sondern auch den Musikgeschmack für die Party.', image: '' },
    ] } },
    // --- Menü ---
    { pageSlug: '/menue', type: 'weddingMenu', sortOrder: 0, data: { headline: 'Unser Hochzeitsmenü', subline: 'Kreiert von Küchenchef Martin Riedl', note: 'Bitte gebt bei der RSVP eure Allergien und Ernährungswünsche an.', courses: [
      { title: 'Amuse-Bouche', items: [{ name: 'Tiroler Bergkäse-Praline', description: 'mit Walnuss-Feigen-Chutney' }] },
      { title: 'Vorspeise', items: [{ name: 'Rote-Bete-Carpaccio', description: 'mit Ziegenkäse, Rucola und Honig-Senf-Dressing' }, { name: 'Kürbiscreme-Suppe', description: 'mit Kürbiskernöl und gerösteten Kernen' }] },
      { title: 'Hauptgang', items: [{ name: 'Rosa gebratenes Rinderfilet', description: 'mit Trüffel-Jus, Süßkartoffelpüree und Marktgemüse' }, { name: 'Safran-Risotto (vegetarisch)', description: 'mit gegrilltem Gemüse und Parmesan-Chip' }] },
      { title: 'Dessert', items: [{ name: 'Hochzeitstorte', description: 'Dreistöckig: Vanille, Himbeere, Schokolade' }, { name: 'Kleine Dessert-Auswahl', description: 'Panna Cotta, Macarons, Früchte' }] },
    ] } },
    { pageSlug: '/menue', type: 'dresscode', sortOrder: 1, data: { headline: 'Dresscode', description: 'Wir freuen uns über festliche Kleidung in gedeckten Farben. Lasst euch inspirieren!', colors: ['#2c3e50', '#8e6f47', '#c9b99a', '#6b8e6b', '#f4ece1'], dos: ['Anzug oder Cocktailkleid', 'Festlich & elegant', 'Gedeckte Erdtöne'], donts: ['Weiß / Creme (reserviert für die Braut)', 'Jeans oder Sneaker', 'Zu kurze Kleider'], note: 'Bei der Feier im Freien empfehlen wir einen Schal oder ein Jacket für den Abend.' } },
    // --- Geschenke ---
    { pageSlug: '/geschenke', type: 'giftRegistry', sortOrder: 0, data: { headline: 'Geschenkewünsche', subline: 'Eure Anwesenheit ist uns das größte Geschenk!', freeText: 'Wer uns dennoch eine Freude machen möchte: Wir sparen für unsere Flitterwochen in Japan. Über einen Beitrag zur Reisekasse freuen wir uns riesig.', gifts: [], bankInfo: { holder: 'Anna Berger & Maximilian Hofer', iban: 'AT12 3456 7890 1234 5678', bic: 'BKAUATWW', note: 'Verwendungszweck: Hochzeitsgeschenk' } } },
    // --- FAQ ---
    { pageSlug: '/faq', type: 'faq', sortOrder: 0, data: { headline: 'Häufige Fragen', items: [
      { question: 'Gibt es einen Shuttle-Service?', answer: 'Ja! Ein Shuttle fährt stündlich zwischen den Hotels in der Innenstadt und dem Schloss (17:00–02:00 Uhr).' },
      { question: 'Dürfen wir Kinder mitbringen?', answer: 'Selbstverständlich! Für die Kleinen gibt es einen separaten Spielbereich mit Betreuung ab 18 Uhr.' },
      { question: 'Gibt es vegetarische/vegane Optionen?', answer: 'Ja, bitte gebt bei der RSVP eure Ernährungswünsche an – die Küche stellt sich gerne darauf ein.' },
      { question: 'Bis wann geht die Feier?', answer: 'Offiziell bis 03:00 Uhr. Der Shuttle fährt bis 02:00, danach stehen Taxis bereit.' },
      { question: 'Können wir Fotos machen?', answer: 'Während der Trauung bitten wir euch, die Handys wegzulegen (Unplugged Ceremony). Danach: drauflos knipsen!' },
      { question: 'Was ist bei Regen?', answer: 'Das Schloss bietet wunderschöne Innenräume — der Sektempfang würde dann im Arkadenhof stattfinden.' },
    ] } },
  ];

  // Delete existing page_sections for this tenant (in case of re-run)
  await sql(`DELETE FROM page_sections WHERE tenant_id = $1`, [TENANT_ID]);

  for (const s of sections) {
    const pageId = PAGE_IDS[s.pageSlug];
    if (!pageId) { console.error(`No page ID for slug: ${s.pageSlug}`); continue; }
    await sql(`INSERT INTO page_sections (id, tenant_id, page_id, type, visible, container, spacing_top, spacing_bottom, data, sort_order)
      VALUES ($1, $2, $3, $4, true, 'default', 'm', 'm', $5, $6)`, [
      crypto.randomUUID(), TENANT_ID, pageId, s.type, JSON.stringify(s.data), s.sortOrder,
    ]);
  }
  console.log(`  ✅ ${sections.length} page_sections inserted`);

  console.log('\n✅ Wedding demo tenant data fixed!');
}

main().catch(console.error);
