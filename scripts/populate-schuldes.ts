import { requireDatabaseUrl } from './_database-url';
/**
 * Populate Schuldes GmbH tenant with real, SEO-optimized content.
 * Run with: npx tsx scripts/populate-schuldes.ts
 */
import { neon } from '@neondatabase/serverless';

const DB_URL = requireDatabaseUrl();
const sql = neon(DB_URL);

const TENANT_ID = '51e6afea-86f7-4363-b341-95620d462a43';

// Placeholder images (Unsplash – water damage / construction related)
const IMG = {
  heroHome: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=80',
  heroLeistungen: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1920&q=80',
  wasserschaden: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&q=80',
  leckortung: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600&q=80',
  bautrocknung: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80',
  sanierung: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&q=80',
  abdichtung: 'https://images.unsplash.com/photo-1541123603104-512919d6a96c?w=600&q=80',
  rissverpressung: 'https://images.unsplash.com/photo-1590644365607-1cddfc4a787c?w=600&q=80',
};

async function main() {
  console.log('🔄 Populating Schuldes GmbH content...');

  // ── Fix typo in "Lesitungen" → "Leistungen" ─────────────────
  await sql`UPDATE pages SET title = 'Leistungen', slug = 'leistungen', status = 'published' WHERE id = 'fa0bd7cd-8a4c-472b-a6b3-484cd15eca21'`;
  console.log('✅ Fixed Leistungen page title/slug');

  // ══════════════════════════════════════════════════════════════
  // STARTSEITE
  // ══════════════════════════════════════════════════════════════

  // Hero
  await updateSection('1f1a6547-1bad-4bd7-867c-ca28764952a9', {
    headline: 'Wasserschaden? Wir sind sofort für Sie da.',
    subline: 'Seit über 30 Jahren Ihr Experte für Wasserschadenbeseitigung, Leckortung und Bautrocknung in Ingolstadt und der gesamten Region.',
    badgeText: 'Zertifizierter Fachbetrieb seit 1993',
    bgImage: IMG.heroHome,
    overlayColor: '#0a1628',
    overlayOpacity: 0.55,
    trustItems: ['Soforthilfe 24/7', 'Festpreisgarantie', 'Kostenlose Erstberatung', 'Direkte Versicherungsabwicklung'],
    primaryCta: { label: 'Jetzt Soforthilfe anfordern', href: '/kontakt' },
    secondaryCta: { label: '+49 841 95616480', href: 'tel:+498419516480' },
  });
  console.log('✅ Startseite: Hero');

  // Add new sections to Startseite
  const startseiteId = '403d525f-f1b1-4e79-be9b-279ee6de5ed8';

  // USP Strip
  await addSection(startseiteId, 'uspStrip', 1, 'usp', {
    items: [
      { icon: 'shield', title: 'Über 30 Jahre Erfahrung', text: 'Bewährte Expertise seit 1993 in Ingolstadt und Umgebung' },
      { icon: 'clock', title: 'Soforthilfe im Notfall', text: 'Schnelle Reaktionszeiten – auch am Wochenende und an Feiertagen' },
      { icon: 'badge-check', title: 'Festpreisgarantie', text: 'Transparente Kalkulation ohne versteckte Kosten' },
      { icon: 'handshake', title: 'Komplettservice', text: 'Ein Ansprechpartner für alle Gewerke – von Analyse bis Sanierung' },
    ],
  });
  console.log('✅ Startseite: USP Strip');

  // Services Grid
  await addSection(startseiteId, 'servicesGrid', 2, 'leistungen', {
    headline: 'Unsere Leistungen im Überblick',
    subline: 'Von der Soforthilfe bei Wasserschäden bis zur kompletten Sanierung – wir bieten Ihnen den vollen Leistungsumfang aus einer Hand.',
    badgeText: 'Leistungsspektrum',
    ctaLabel: 'Alle Leistungen entdecken',
    ctaHref: '/leistungen',
    manualCards: [
      {
        title: 'Wasserschadenbeseitigung',
        text: 'Professionelle Soforthilfe und nachhaltige Beseitigung von Wasserschäden aller Art – schnell, effizient und mit modernster Messtechnik.',
        icon: 'droplets',
        image: IMG.wasserschaden,
        mediaType: 'image',
        href: '/leistungen',
      },
      {
        title: 'Leckortung & Thermografie',
        text: 'Zerstörungsfreie Lokalisierung von Leckagen mit präziser Messtechnik und Infrarot-Thermografie für minimale Folgeschäden.',
        icon: 'search',
        image: IMG.leckortung,
        mediaType: 'image',
        href: '/leistungen',
      },
      {
        title: 'Bautrocknung',
        text: 'Effiziente Trocknungsmaßnahmen mit professionellen Geräten – für schnelle Ergebnisse und die Einhaltung Ihrer Terminpläne.',
        icon: 'wind',
        image: IMG.bautrocknung,
        mediaType: 'image',
        href: '/leistungen',
      },
      {
        title: 'Sanierung & Schadensmanagement',
        text: 'Koordination aller erforderlichen Gewerke und direkte Regulierungsabwicklung mit Ihrem Versicherer – alles aus einer Hand.',
        icon: 'wrench',
        image: IMG.sanierung,
        mediaType: 'image',
        href: '/leistungen',
      },
    ],
  });
  console.log('✅ Startseite: Services Grid');

  // Process Steps
  await addSection(startseiteId, 'processSteps', 3, 'ablauf', {
    headline: 'So läuft die Schadensbeseitigung ab',
    badgeText: 'Unser Ablauf',
    steps: [
      { title: 'Kontaktaufnahme', text: 'Rufen Sie uns an oder nutzen Sie unser Kontaktformular. Wir reagieren schnell – auch außerhalb der Geschäftszeiten.', icon: 'phone' },
      { title: 'Schadensanalyse vor Ort', text: 'Unsere Experten kommen zu Ihnen und analysieren Schadensart und -umfang mit modernster Messtechnik.', icon: 'clipboard-check' },
      { title: 'Festpreisangebot', text: 'Sie erhalten ein transparentes Festpreisangebot – ohne versteckte Kosten, mit voller Planungssicherheit.', icon: 'file-text' },
      { title: 'Professionelle Ausführung', text: 'Unser Team beseitigt den Schaden fachgerecht und übernimmt bei Bedarf die komplette Sanierung.', icon: 'hard-hat' },
      { title: 'Versicherungsabwicklung', text: 'Wir wickeln die Regulierung direkt mit Ihrem Versicherer ab – Sie brauchen sich um nichts zu kümmern.', icon: 'shield-check' },
    ],
  });
  console.log('✅ Startseite: Process Steps');

  // Stats
  await addSection(startseiteId, 'stats', 4, 'zahlen', {
    headline: 'Schuldes GmbH in Zahlen',
    stats: [
      { value: 30, suffix: '+', prefix: '', label: 'Jahre Erfahrung', icon: 'calendar' },
      { value: 5000, suffix: '+', prefix: '', label: 'Beseitigte Wasserschäden', icon: 'droplets' },
      { value: 24, suffix: '/7', prefix: '', label: 'Erreichbarkeit im Notfall', icon: 'clock' },
      { value: 100, suffix: '%', prefix: '', label: 'Festpreisgarantie', icon: 'shield' },
    ],
  });
  console.log('✅ Startseite: Stats');

  // Testimonials
  await addSection(startseiteId, 'testimonials', 5, 'bewertungen', {
    headline: 'Das sagen unsere Kunden',
    badgeText: 'Kundenstimmen',
    ratingValue: '4.9',
    ratingCount: '127',
    items: [
      { quote: 'Nach einem Rohrbruch war die Schuldes GmbH innerhalb einer Stunde vor Ort. Professionelle Arbeit, faire Preise und die komplette Abwicklung mit der Versicherung – besser geht es nicht!', name: 'Thomas M.', context: 'Wasserschaden Wohnhaus, Ingolstadt', rating: 5 },
      { quote: 'Herr Schuldes und sein Team haben unseren Keller nach einem Hochwasserschaden komplett saniert. Alles aus einer Hand, ohne dass wir uns um einzelne Handwerker kümmern mussten.', name: 'Sandra K.', context: 'Kellersanierung, Pfaffenhofen', rating: 5 },
      { quote: 'Schnelle Leckortung ohne Aufbrechen der Wände – beeindruckende Technik und sehr kompetente Beratung. Klare Empfehlung für jeden, der ein Leck sucht.', name: 'Markus H.', context: 'Leckortung Badezimmer, Neuburg a.d. Donau', rating: 5 },
    ],
  });
  console.log('✅ Startseite: Testimonials');

  // FAQ
  await addSection(startseiteId, 'faq', 6, 'faq', {
    headline: 'Häufig gestellte Fragen',
    badgeText: 'FAQ',
    source: 'manual',
    layout: 'accordion',
    expandFirst: true,
    items: [
      { question: 'Was soll ich tun, wenn ich einen Wasserschaden entdecke?', answer: 'Stellen Sie sofort den Hauptwasserhahn ab und kontaktieren Sie uns unter +49 841 95616480. Wir leisten umgehend Soforthilfe und begrenzen den Schaden optimal.' },
      { question: 'Wie schnell sind Sie vor Ort?', answer: 'Dank unserer Nähe in Ingolstadt und einem eingespielten Notfallsystem sind wir häufig innerhalb von 60 Minuten bei Ihnen – auch am Wochenende und an Feiertagen.' },
      { question: 'Übernimmt meine Versicherung die Kosten?', answer: 'In den meisten Fällen ja. Wir wickeln die Regulierung direkt mit Ihrem Versicherer ab. Sie erhalten von uns ein detailliertes Festpreisangebot, das als Grundlage für die Schadensregulierung dient.' },
      { question: 'Was kostet eine Leckortung?', answer: 'Die Kosten hängen vom Aufwand ab. Wir arbeiten mit modernster Technik und bieten eine transparente Festpreiskalkulation. Rufen Sie uns an für eine kostenlose Ersteinschätzung.' },
      { question: 'Bieten Sie auch Bautrocknung an?', answer: 'Ja, Bautrocknung gehört zu unserem Kerngeschäft. Wir setzen professionelle Trocknungsgeräte ein und überwachen den Trocknungsfortschritt mit regelmäßigen Feuchtigkeitsmessungen.' },
      { question: 'Was bedeutet „Komplettservice"?', answer: 'Wir koordinieren alle notwendigen Gewerke – von Maler über Bodenleger bis Fliesenleger – unter einem Dach. Sie haben einen einzigen Ansprechpartner von der Analyse bis zur fertig sanierten Immobilie.' },
    ],
  });
  console.log('✅ Startseite: FAQ');

  // CTA Band
  await addSection(startseiteId, 'ctaBand', 7, 'cta', {
    headline: 'Wasserschaden? Jetzt kostenlos beraten lassen.',
    subline: 'Unser Expertenteam ist für Sie da – schnell, zuverlässig und mit transparenten Festpreisen.',
    badgeText: 'Kostenlose Erstberatung',
    ctaPrimary: { label: 'Jetzt Kontakt aufnehmen', href: '/kontakt' },
  });
  console.log('✅ Startseite: CTA Band');

  // ══════════════════════════════════════════════════════════════
  // LEISTUNGEN
  // ══════════════════════════════════════════════════════════════

  // Hero
  await updateSection('65395dda-bddf-4855-a6dd-e1222a48de26', {
    headline: 'Unsere Leistungen',
    subline: 'Spezialisiert auf Wasserschadenbeseitigung, Leckortung, Bautrocknung, Bauwerksabdichtung und Rissverpressung – mit über 30 Jahren Erfahrung.',
    badgeText: 'Fachkompetenz auf höchstem Niveau',
    bgImage: IMG.heroLeistungen,
    overlayColor: '#0a1628',
    overlayOpacity: 0.6,
    primaryCta: { label: 'Kostenlose Beratung anfragen', href: '/kontakt' },
    secondaryCta: { label: '+49 841 95616480', href: 'tel:+498419516480' },
    trustItems: [],
  });
  console.log('✅ Leistungen: Hero');

  // Services Grid
  await updateSection('eb3719b7-774d-45aa-b5e4-05cb1345692a', {
    headline: 'Unsere Fachgebiete im Detail',
    subline: 'Wählen Sie einen Themenschwerpunkt, um detaillierte Informationen zu erhalten.',
    badgeText: 'Leistungsspektrum',
    ctaLabel: '',
    ctaHref: '',
    manualCards: [
      {
        title: 'Wasserschadenbeseitigung',
        text: 'Wasser ist trickreich und sucht sich auf unterschiedlichste Art seinen zerstörerischen Weg. Wir leisten Soforthilfe bei akuten Wasserschäden, nutzen effiziente Messtechnik für konkrete Ergebnisse und verwenden ausschließlich umweltverträgliche Werkstoffe.',
        icon: 'droplets',
        image: IMG.wasserschaden,
        mediaType: 'image',
        href: '',
      },
      {
        title: 'Leckortung & Thermografie',
        text: 'Nicht immer lässt sich die Ursache für einen Wasserschaden auf den ersten Blick lokalisieren. Mit modernster Infrarot-Thermografie und zerstörungsfreien Analyseverfahren finden wir jede Leckage – ohne Ihre Bausubstanz unnötig zu beschädigen.',
        icon: 'scan-search',
        image: IMG.leckortung,
        mediaType: 'image',
        href: '',
      },
      {
        title: 'Bautrocknung',
        text: 'Zeit ist ein wichtiger Kostenfaktor. Restfeuchte kann Terminpläne empfindlich verzögern. Unsere professionellen Trocknungsgeräte sorgen für schnelle und nachhaltige Ergebnisse bei Neubau und Sanierung.',
        icon: 'wind',
        image: IMG.bautrocknung,
        mediaType: 'image',
        href: '',
      },
      {
        title: 'Schadensmanagement',
        text: 'Auf Wunsch übernehmen wir die Komplettsteuerung aller erforderlichen Gewerke: Maler, Bodenleger, Schreiner, Fliesenleger – Sie haben einen zentralen Ansprechpartner für die gesamte Sanierung inkl. Versicherungsabwicklung.',
        icon: 'clipboard-list',
        image: IMG.sanierung,
        mediaType: 'image',
        href: '',
      },
      {
        title: 'Bauwerksabdichtung',
        text: 'Wirkungsvolle Maßnahmen zur Unterbindung des schädlichen Einflusses von Feuchtigkeit auf die Bausubstanz. Wir schützen Ihr Gebäude nachhaltig vor eindringender Nässe.',
        icon: 'shield',
        image: IMG.abdichtung,
        mediaType: 'image',
        href: '',
      },
      {
        title: 'Rissverpressung',
        text: 'Bauliche Gegebenheiten und Umwelteinflüsse sind häufig die Ursache für Rissbildungen in Betonkonstruktionen. Mit professioneller Rissverpressung stellen wir die Dichtigkeit und Tragfähigkeit wieder her.',
        icon: 'construction',
        image: IMG.rissverpressung,
        mediaType: 'image',
        href: '',
      },
    ],
  });
  console.log('✅ Leistungen: Services Grid');

  // Add CTA Band to Leistungen
  const leistungenId = 'fa0bd7cd-8a4c-472b-a6b3-484cd15eca21';
  await addSection(leistungenId, 'ctaBand', 2, 'cta-leistungen', {
    headline: 'Profitieren Sie von unserem Komplettservice',
    subline: 'Kontaktieren Sie uns für eine kostenlose Beratung und ein transparentes Festpreisangebot.',
    badgeText: '',
    ctaPrimary: { label: 'Jetzt beraten lassen', href: '/kontakt' },
  });
  console.log('✅ Leistungen: CTA Band');

  // ══════════════════════════════════════════════════════════════
  // KONTAKT
  // ══════════════════════════════════════════════════════════════

  await updateSection('9a3c543a-4a58-4aa6-8619-8450ae06b216', {
    headline: 'Kontaktieren Sie uns',
    introText: 'Ob akuter Wasserschaden, Beratungsbedarf oder Angebotsanfrage – unser Team ist gerne für Sie da. Rufen Sie uns an oder nutzen Sie das Kontaktformular.',
    badgeText: 'Jetzt Kontakt aufnehmen',
    submitLabel: 'Nachricht senden',
    formEnabled: true,
    infoCards: [
      { icon: 'phone', label: 'Telefon', value: '+49 841 95616480' },
      { icon: 'mail', label: 'E-Mail', value: 'mail@schuldes-rainer.de' },
      { icon: 'map-pin', label: 'Adresse', value: 'Joseph-Baader-Straße 1, 85053 Ingolstadt' },
      { icon: 'clock', label: 'Erreichbarkeit', value: 'Mo–Fr 07:30–17:00 Uhr | Notdienst 24/7' },
    ],
  });
  console.log('✅ Kontakt: Contact Section');

  // ══════════════════════════════════════════════════════════════
  // Update Navigation
  // ══════════════════════════════════════════════════════════════
  await sql`UPDATE navigation SET items = ${JSON.stringify([
    { label: 'Startseite', href: '/', type: 'link' },
    { label: 'Leistungen', href: '/leistungen', type: 'link' },
    { label: 'Kontakt', href: '/kontakt', type: 'link' },
  ])}::jsonb WHERE tenant_id = ${TENANT_ID}`;
  console.log('✅ Navigation updated');

  // ══════════════════════════════════════════════════════════════
  // Update Footer
  // ══════════════════════════════════════════════════════════════
  await sql`UPDATE footer SET columns = ${JSON.stringify([
    {
      title: 'Leistungen',
      items: [
        { text: 'Wasserschadenbeseitigung', href: '/leistungen' },
        { text: 'Leckortung & Thermografie', href: '/leistungen' },
        { text: 'Bautrocknung', href: '/leistungen' },
        { text: 'Bauwerksabdichtung', href: '/leistungen' },
        { text: 'Rissverpressung', href: '/leistungen' },
      ],
    },
    {
      title: 'Öffnungszeiten',
      items: [
        { text: 'Mo–Fr: 07:30 – 17:00' },
        { text: 'Notdienst: rund um die Uhr' },
      ],
    },
  ])}::jsonb, legal_links = ${JSON.stringify([
    { label: 'Impressum', href: '/impressum' },
    { label: 'Datenschutz', href: '/datenschutz' },
    { label: 'AGB', href: '/agb' },
  ])}::jsonb WHERE tenant_id = ${TENANT_ID}`;
  console.log('✅ Footer updated');

  // ══════════════════════════════════════════════════════════════
  // Update Brand
  // ══════════════════════════════════════════════════════════════
  await sql`UPDATE brand SET tagline = 'Ihr Experte für Wasserschadenbeseitigung in Ingolstadt – seit über 30 Jahren.' WHERE tenant_id = ${TENANT_ID}`;
  console.log('✅ Brand tagline updated');

  console.log('\n🎉 Schuldes GmbH content populated successfully!');
}

async function updateSection(sectionId: string, data: Record<string, unknown>) {
  await sql`UPDATE page_sections SET data = ${JSON.stringify(data)}::jsonb WHERE id = ${sectionId}`;
}

async function addSection(pageId: string, type: string, sortOrder: number, anchorId: string, data: Record<string, unknown>) {
  // Check if section type already exists at that sort order
  const existing = await sql`SELECT id FROM page_sections WHERE page_id = ${pageId} AND type = ${type} AND sort_order = ${sortOrder}`;
  if (existing.length > 0) {
    await sql`UPDATE page_sections SET data = ${JSON.stringify(data)}::jsonb, anchor_id = ${anchorId} WHERE id = ${existing[0].id}`;
  } else {
    await sql`INSERT INTO page_sections (id, page_id, tenant_id, type, sort_order, visible, data, anchor_id, container, spacing_top, spacing_bottom) 
    VALUES (gen_random_uuid(), ${pageId}, ${TENANT_ID}, ${type}, ${sortOrder}, true, ${JSON.stringify(data)}::jsonb, ${anchorId}, 'boxed', 'm', 'm')`;
  }
}

main().catch(console.error);
