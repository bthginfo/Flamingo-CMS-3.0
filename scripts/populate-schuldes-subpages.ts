/**
 * Add Unternehmen, Mietservice, and Jobs pages to Schuldes GmbH.
 * Run: npx tsx scripts/populate-schuldes-subpages.ts
 */
import { neon } from '@neondatabase/serverless';

const sql = neon('postgresql://neondb_owner:npg_2Dvar0iXqMIc@ep-mute-recipe-ald7aiv3-pooler.c-3.eu-central-1.aws.neon.tech/neondb?sslmode=require');
const TENANT_ID = '51e6afea-86f7-4363-b341-95620d462a43';

const IMG = {
  unternehmen: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&q=80',
  mietservice: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=80',
  jobs: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1920&q=80',
  team: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80',
  buehne1: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80',
  buehne2: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&q=80',
  trockner: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80',
  heizgeraet: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&q=80',
};

async function addPage(title: string, slug: string, sortOrder: number): Promise<string> {
  const existing = await sql`SELECT id FROM pages WHERE tenant_id = ${TENANT_ID} AND slug = ${slug}`;
  if (existing.length > 0) {
    console.log(`  Page "${slug}" exists, updating...`);
    await sql`UPDATE pages SET title = ${title}, status = 'published', visible = true WHERE id = ${existing[0].id}`;
    return existing[0].id;
  }
  const result = await sql`INSERT INTO pages (id, tenant_id, title, slug, type, status, visible, sort_order) 
    VALUES (gen_random_uuid(), ${TENANT_ID}, ${title}, ${slug}, 'free', 'published', true, ${sortOrder}) RETURNING id`;
  return result[0].id;
}

async function addSection(pageId: string, type: string, sortOrder: number, anchorId: string | null, data: Record<string, unknown>) {
  const existing = await sql`SELECT id FROM page_sections WHERE page_id = ${pageId} AND type = ${type} AND sort_order = ${sortOrder}`;
  if (existing.length > 0) {
    await sql`UPDATE page_sections SET data = ${JSON.stringify(data)}::jsonb, anchor_id = ${anchorId} WHERE id = ${existing[0].id}`;
  } else {
    await sql`INSERT INTO page_sections (id, page_id, tenant_id, type, sort_order, visible, data, anchor_id, container, spacing_top, spacing_bottom) 
    VALUES (gen_random_uuid(), ${pageId}, ${TENANT_ID}, ${type}, ${sortOrder}, true, ${JSON.stringify(data)}::jsonb, ${anchorId}, 'boxed', 'm', 'm')`;
  }
}

async function main() {
  console.log('🔄 Adding subpages to Schuldes GmbH...\n');

  // ══════════════════════════════════════════════════════════════
  // UNTERNEHMEN
  // ══════════════════════════════════════════════════════════════
  const unternehmenId = await addPage('Unternehmen', 'unternehmen', 2);
  console.log('📄 Unternehmen page:', unternehmenId);

  await addSection(unternehmenId, 'hero', 0, null, {
    headline: 'Spezialisiert auf Wasserschadenbeseitigung seit über 30 Jahren',
    subline: 'Die Schuldes GmbH & Co. KG in Ingolstadt – qualifizierter Komplettservice vom Spezialisten für Wasserschäden, Leckortung, Bautrocknung und Sanierung.',
    badgeText: 'Über unser Unternehmen',
    bgImage: IMG.unternehmen,
    overlayColor: '#0a1628',
    overlayOpacity: 0.55,
    trustItems: [],
    primaryCta: { label: 'Kontakt aufnehmen', href: '/kontakt' },
    secondaryCta: { label: '+49 841 95616480', href: 'tel:+498419516480' },
  });

  // Rich Text – Unternehmensbeschreibung
  await addSection(unternehmenId, 'richText', 1, 'ueber-uns', {
    content: `
<h2>Qualifizierter Komplettservice vom Spezialisten</h2>
<p>Seit über 30 Jahren konzentriert sich die in Ingolstadt ansässige Schuldes GmbH & Co. KG auf die Themenbereiche <strong>Wasserschadenbeseitigung</strong>, <strong>Leckortung & Thermografie</strong>, <strong>Bautrocknung</strong>, <strong>Bauwerksabdichtung</strong> und <strong>Rissverpressung</strong>.</p>
<p>Erfahrung ist das wichtigste Kapital unseres mittelständischen Betriebes. Kombiniert mit fortschrittlichen Arbeitsverfahren nach dem neuesten Stand der Technik und dem Einsatz modernster Geräte findet unser Team auch bei komplexen Problemstellungen die optimale Lösung.</p>
<p>Von der ersten Kontaktaufnahme bis zum letzten Arbeitsschritt erwartet Sie in jeder Phase der Auftragsabwicklung ein vorbildliches, qualifiziertes Leistungsspektrum – <strong>das spart wertvolle Zeit, kostbare Nerven und teures Geld</strong>.</p>
<p>Profitieren Sie von den Vorteilen unseres Komplettservice: fair, zuverlässig und sympathisch. Dafür steht die Schuldes GmbH & Co. KG – verlassen Sie sich darauf!</p>
    `.trim(),
  });

  // USP Strip – Kernkompetenzen
  await addSection(unternehmenId, 'uspStrip', 2, 'kompetenzen', {
    items: [
      { icon: 'clipboard-list', title: 'Komplettservice-Prinzip', text: 'Wir kümmern uns um alle Details – von der Schadensbehebung über die Sanierung bis zur Versicherungsabwicklung.' },
      { icon: 'siren', title: 'Soforthilfe im Notfall', text: 'Schnelle Reaktionszeiten und sofortiger Einsatz von Trocknungsgeräten zur werterhaltenden Schadensbegrenzung.' },
      { icon: 'search', title: 'Präzise Schadensanalyse', text: 'Bewährte, zerstörungsfreie Verfahren, die nachträgliche Renovierungsarbeiten bestmöglich reduzieren.' },
      { icon: 'gauge', title: 'Höchste Effizienz', text: 'Präzise Analysesysteme und ausgefeilte Technik – optimal aufeinander abgestimmt für schnelle Ergebnisse.' },
    ],
  });

  await addSection(unternehmenId, 'uspStrip', 3, 'werte', {
    items: [
      { icon: 'leaf', title: 'Schadstofffreie Werkstoffe', text: 'Umweltverträgliche Materialien und Betriebsmittel – unbedenklich für Mensch und Tier.' },
      { icon: 'brain', title: 'Sachverstand & Innovation', text: 'Laufende Weiterentwicklung unseres Teams für konstruktive und innovative Lösungsansätze.' },
      { icon: 'receipt', title: 'Pauschale Festpreise', text: 'Transparente Festpreisangebote nach sorgfältiger Aufwandsanalyse – für Planungssicherheit und Vertrauen.' },
      { icon: 'user-check', title: 'Ein Ansprechpartner', text: 'Von der Analyse bis zur fertigen Sanierung – Sie haben immer einen zentralen Ansprechpartner.' },
    ],
  });

  // Stats
  await addSection(unternehmenId, 'stats', 4, 'zahlen', {
    headline: 'Schuldes GmbH in Zahlen',
    stats: [
      { value: 30, suffix: '+', prefix: '', label: 'Jahre am Markt', icon: 'calendar' },
      { value: 5000, suffix: '+', prefix: '', label: 'Abgeschlossene Projekte', icon: 'check-circle' },
      { value: 15, suffix: '', prefix: '', label: 'Fachexperten im Team', icon: 'users' },
      { value: 100, suffix: '%', prefix: '', label: 'Festpreisgarantie', icon: 'shield' },
    ],
  });

  // CTA Band
  await addSection(unternehmenId, 'ctaBand', 5, null, {
    headline: 'Überzeugen Sie sich von unserem Komplettservice',
    subline: 'Kontaktieren Sie uns für eine kostenlose und unverbindliche Erstberatung.',
    ctaPrimary: { label: 'Jetzt Kontakt aufnehmen', href: '/kontakt' },
  });

  console.log('✅ Unternehmen: 6 sections');

  // ══════════════════════════════════════════════════════════════
  // MIETSERVICE
  // ══════════════════════════════════════════════════════════════
  const mietserviceId = await addPage('Mietservice', 'mietservice', 3);
  console.log('📄 Mietservice page:', mietserviceId);

  await addSection(mietserviceId, 'hero', 0, null, {
    headline: 'Mietservice – Arbeitsbühnen, Trockner & Heizgeräte',
    subline: 'Professionelle Mietgeräte der Schuldes GmbH – kompetent beraten, flexibel verfügbar und zum fairen Preis.',
    badgeText: 'Gerätevermietung',
    bgImage: IMG.mietservice,
    overlayColor: '#0a1628',
    overlayOpacity: 0.55,
    trustItems: [],
    primaryCta: { label: 'Verfügbarkeit anfragen', href: '/kontakt' },
    secondaryCta: { label: '+49 841 95616480', href: 'tel:+498419516480' },
  });

  // Rich Text – Intro
  await addSection(mietserviceId, 'richText', 1, null, {
    content: `
<h2>Professionelle Geräte zum Mieten</h2>
<p>Mit der Schuldes GmbH & Co. KG setzen Sie auf den richtigen Partner, der Sie auch bei der Auswahl eines benötigten Mietgerätes kompetent und umfassend berät. Basierend auf der Ist-Situation ermitteln wir für Sie den optimalen Bedarf aus unserem hochwertigen Geräteprogramm.</p>
    `.trim(),
  });

  // Services Grid – Mietangebot
  await addSection(mietserviceId, 'servicesGrid', 2, 'geraete', {
    headline: 'Unser Mietangebot im Überblick',
    subline: 'Hochwertige Geräte für Ihren Bedarf – flexibel und zu fairen Konditionen.',
    badgeText: 'Mietpark',
    ctaLabel: '',
    ctaHref: '',
    manualCards: [
      {
        title: 'Sprinter-Arbeitsbühne TB 220',
        text: 'Kompakte Sprinter-Arbeitsbühne mit 200 kg Korbbelastung – ideal für beengte Einsatzorte und Arbeiten bis 22 m Höhe.',
        icon: 'crane',
        image: IMG.buehne1,
        mediaType: 'image',
        href: '',
      },
      {
        title: 'Sprinter-Arbeitsbühne TBR 220',
        text: 'Vielseitige Sprinter-Arbeitsbühne mit 230 kg Korbbelastung und erweitertem Aktionsradius für flexible Einsätze.',
        icon: 'crane',
        image: IMG.buehne1,
        mediaType: 'image',
        href: '',
      },
      {
        title: 'Sprinter-Arbeitsbühne TB 270',
        text: 'Leistungsstarke Arbeitsbühne mit 250 kg Korbbelastung und bis zu 27 m Arbeitshöhe für anspruchsvolle Aufgaben.',
        icon: 'crane',
        image: IMG.buehne2,
        mediaType: 'image',
        href: '',
      },
      {
        title: 'LKW-Arbeitsbühne T 330',
        text: 'Unsere größte Arbeitsbühne: 320 kg Korbbelastung und bis zu 33 m Arbeitshöhe – für Großprojekte und schwer erreichbare Stellen.',
        icon: 'truck',
        image: IMG.buehne2,
        mediaType: 'image',
        href: '',
      },
      {
        title: 'Trocknungsgeräte',
        text: 'Professionelle Bautrockner und Kondensationstrockner zur schnellen und effizienten Entfeuchtung. Verschiedene Leistungsklassen verfügbar.',
        icon: 'wind',
        image: IMG.trockner,
        mediaType: 'image',
        href: '',
      },
      {
        title: 'Heizgeräte (Elektro, Gas, Öl)',
        text: 'Mobile Heizlösungen für Baustellen und Trocknungseinsätze – als Elektro-, Gas- oder Ölvariante für jeden Bedarf.',
        icon: 'flame',
        image: IMG.heizgeraet,
        mediaType: 'image',
        href: '',
      },
    ],
  });

  // FAQ – Mietbedingungen
  await addSection(mietserviceId, 'faq', 3, 'faq-miet', {
    headline: 'Häufige Fragen zum Mietservice',
    badgeText: 'FAQ',
    source: 'manual',
    layout: 'accordion',
    expandFirst: true,
    items: [
      { question: 'Welche Geräte kann ich bei Ihnen mieten?', answer: 'Wir vermieten Hubarbeitsbühnen (Sprinter und LKW), Trocknungsgeräte sowie Heizgeräte (Elektro, Gas, Öl). Bei speziellen Anforderungen beraten wir Sie gerne zu weiteren Möglichkeiten.' },
      { question: 'Wie kurzfristig kann ich Geräte mieten?', answer: 'Wir sind flexibel. Rufen Sie uns an unter +49 841 95616480 und wir prüfen die aktuelle Verfügbarkeit. In vielen Fällen ist eine kurzfristige Bereitstellung möglich.' },
      { question: 'Ist eine Einweisung im Mietpreis inbegriffen?', answer: 'Ja, bei Arbeitsbühnen erhalten Sie eine professionelle Einweisung in die Bedienung. Die Sicherheit unserer Kunden hat höchste Priorität.' },
      { question: 'Bieten Sie auch Lieferung und Abholung an?', answer: 'Ja, wir liefern die Geräte direkt zu Ihrem Einsatzort und holen sie nach Mietende wieder ab. Sprechen Sie uns auf die Konditionen an.' },
    ],
  });

  // CTA Band
  await addSection(mietserviceId, 'ctaBand', 4, null, {
    headline: 'Gerät gesucht? Wir beraten Sie gerne.',
    subline: 'Rufen Sie uns an oder schreiben Sie uns – wir finden das passende Gerät für Ihren Einsatz.',
    ctaPrimary: { label: 'Verfügbarkeit anfragen', href: '/kontakt' },
  });

  console.log('✅ Mietservice: 5 sections');

  // ══════════════════════════════════════════════════════════════
  // JOBS / KARRIERE
  // ══════════════════════════════════════════════════════════════
  const jobsId = await addPage('Karriere', 'karriere', 4);
  console.log('📄 Karriere page:', jobsId);

  await addSection(jobsId, 'hero', 0, null, {
    headline: 'Karriere bei Schuldes – Werden Sie Teil unseres Teams',
    subline: 'Wir suchen engagierte Fachkräfte in Ingolstadt. Entdecken Sie Ihre Möglichkeiten bei einem der führenden Spezialisten für Wasserschadenbeseitigung.',
    badgeText: 'Jetzt bewerben',
    bgImage: IMG.jobs,
    overlayColor: '#0a1628',
    overlayOpacity: 0.5,
    trustItems: [],
    primaryCta: { label: 'Initiativbewerbung senden', href: '/kontakt' },
    secondaryCta: { label: '+49 841 95616480', href: 'tel:+498419516480' },
  });

  // Rich Text – Intro
  await addSection(jobsId, 'richText', 1, null, {
    content: `
<h2>Arbeiten bei der Schuldes GmbH</h2>
<p>Die Schuldes GmbH & Co. KG mit Sitz in Ingolstadt ist spezialisiert auf Wasserschadenbeseitigung, Leckortung, Trocknung, Sanierung und vieles mehr. Zur Verstärkung unseres Teams suchen wir engagierte Kolleginnen und Kollegen in verschiedenen Bereichen.</p>
<p>Wir bieten Ihnen einen <strong>sicheren Arbeitsplatz</strong> in einem erfahrenen Team, <strong>abwechslungsreiche Projekte</strong> und eine <strong>faire Vergütung</strong>. Wenn Sie handwerkliches Geschick mitbringen und gerne im Team arbeiten, freuen wir uns auf Ihre Bewerbung.</p>
    `.trim(),
  });

  // FAQ – Stellenangebote als Akkordeon
  await addSection(jobsId, 'faq', 2, 'stellen', {
    headline: 'Aktuelle Stellenangebote',
    badgeText: 'Offene Positionen',
    source: 'manual',
    layout: 'accordion',
    expandFirst: false,
    items: [
      {
        question: 'Kaufmännische Sachbearbeiterin / Büroassistenz (m/w/d) – Vollzeit',
        answer: 'Sie unterstützen unser Team in der kaufmännischen Auftragsabwicklung, Angebotserstellung und Kundenkommunikation. Wir erwarten Organisationstalent, sicheren Umgang mit MS Office und idealerweise Erfahrung in der Baubranche. Wir bieten: ein familiäres Arbeitsumfeld, flexible Arbeitszeiten und eine faire Vergütung.',
      },
      {
        question: 'Handwerker (m/w/d) für Wasserschadenmanagement – Vollzeit',
        answer: 'Sie führen Trocknungs-, Rückbau- und Sanierungsarbeiten nach Wasserschäden durch. Idealerweise bringen Sie eine abgeschlossene handwerkliche Ausbildung und einen Führerschein Klasse B mit. Wir bieten: professionelle Ausrüstung, Weiterbildungsmöglichkeiten und überdurchschnittliche Bezahlung.',
      },
      {
        question: 'Leckorter / Messtechniker (m/w/d) – Vollzeit',
        answer: 'Sie lokalisieren Leckagen mit modernster Messtechnik (Thermografie, akustische Ortung, Endoskopie) und erstellen Schadensberichte. Technisches Verständnis und sorgfältige Arbeitsweise sind Voraussetzung. Wir bieten: Einarbeitung durch erfahrene Kollegen, hochmoderne Ausrüstung und eigenverantwortliches Arbeiten.',
      },
      {
        question: 'Monteur / Trockenbauer (m/w/d) – Vollzeit',
        answer: 'Sie führen Trockenbau-, Fliesen- und Malerarbeiten im Rahmen von Sanierungsprojekten durch. Handwerkliche Ausbildung und Erfahrung in der Sanierung sind von Vorteil. Wir bieten: vielfältige Projekte, ein eingespieltes Team und langfristige Perspektive.',
      },
    ],
  });

  // USP Strip – Vorteile als Arbeitgeber
  await addSection(jobsId, 'uspStrip', 3, null, {
    items: [
      { icon: 'shield-check', title: 'Sicherer Arbeitsplatz', text: 'Über 30 Jahre am Markt – ein krisensicheres Unternehmen mit stabiler Auftragslage.' },
      { icon: 'trending-up', title: 'Weiterentwicklung', text: 'Regelmäßige Schulungen und Weiterbildungen für Ihre fachliche und persönliche Entwicklung.' },
      { icon: 'users', title: 'Starkes Team', text: 'Kollegiales Arbeitsumfeld mit flachen Hierarchien und direkter Kommunikation.' },
      { icon: 'wallet', title: 'Faire Vergütung', text: 'Überdurchschnittliche Bezahlung, Sonderzahlungen und weitere Benefits.' },
    ],
  });

  // CTA Band
  await addSection(jobsId, 'ctaBand', 4, null, {
    headline: 'Keine passende Stelle dabei? Bewerben Sie sich initiativ!',
    subline: 'Wir freuen uns über engagierte Fachkräfte – senden Sie uns Ihre Bewerbung an mail@schuldes-rainer.de.',
    ctaPrimary: { label: 'Jetzt bewerben', href: '/kontakt' },
  });

  console.log('✅ Karriere: 5 sections');

  // ══════════════════════════════════════════════════════════════
  // UPDATE NAVIGATION
  // ══════════════════════════════════════════════════════════════
  await sql`UPDATE navigation SET items = ${JSON.stringify([
    { label: 'Startseite', href: '/', type: 'link' },
    { label: 'Unternehmen', href: '/unternehmen', type: 'link' },
    { label: 'Leistungen', href: '/leistungen', type: 'link' },
    { label: 'Mietservice', href: '/mietservice', type: 'link' },
    { label: 'Karriere', href: '/karriere', type: 'link' },
    { label: 'Kontakt', href: '/kontakt', type: 'link' },
  ])}::jsonb WHERE tenant_id = ${TENANT_ID}`;
  console.log('✅ Navigation updated');

  // ══════════════════════════════════════════════════════════════
  // UPDATE FOOTER – add new pages
  // ══════════════════════════════════════════════════════════════
  await sql`UPDATE footer SET columns = ${JSON.stringify([
    {
      title: 'Leistungen',
      items: [
        { text: 'Wasserschadenbeseitigung', href: '/leistungen' },
        { text: 'Leckortung & Thermografie', href: '/leistungen' },
        { text: 'Bautrocknung', href: '/leistungen' },
        { text: 'Bauwerksabdichtung', href: '/leistungen' },
        { text: 'Mietservice', href: '/mietservice' },
      ],
    },
    {
      title: 'Unternehmen',
      items: [
        { text: 'Über uns', href: '/unternehmen' },
        { text: 'Karriere & Jobs', href: '/karriere' },
        { text: 'Kontakt', href: '/kontakt' },
      ],
    },
    {
      title: 'Öffnungszeiten',
      items: [
        { text: 'Mo–Fr: 07:30 – 17:00' },
        { text: 'Notdienst: rund um die Uhr' },
      ],
    },
  ])}::jsonb WHERE tenant_id = ${TENANT_ID}`;
  console.log('✅ Footer updated');

  console.log('\n🎉 All subpages created successfully!');
}

main().catch(console.error);
