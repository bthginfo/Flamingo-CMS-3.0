/**
 * Create "services" and "mietgeraete" collections with items for Schuldes GmbH,
 * and update the Leistungen + Mietservice page grids to link to them.
 * Run: npx tsx scripts/populate-schuldes-collections.ts
 */
import { neon } from '@neondatabase/serverless';

const sql = neon('postgresql://neondb_owner:npg_2Dvar0iXqMIc@ep-mute-recipe-ald7aiv3-pooler.c-3.eu-central-1.aws.neon.tech/neondb?sslmode=require');
const TENANT_ID = '51e6afea-86f7-4363-b341-95620d462a43';

const IMG = {
  wasserschaden: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=1200&q=80',
  leckortung: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=1200&q=80',
  bautrocknung: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&q=80',
  sanierung: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&q=80',
  abdichtung: 'https://images.unsplash.com/photo-1541123603104-512919d6a96c?w=1200&q=80',
  rissverpressung: 'https://images.unsplash.com/photo-1590644365607-1cddfc4a787c?w=1200&q=80',
  buehne: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80',
  trockner: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&q=80',
  heizgeraet: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=1200&q=80',
};

async function ensureCollection(key: string, label: string): Promise<string> {
  const existing = await sql`SELECT id FROM collections WHERE tenant_id = ${TENANT_ID} AND key = ${key}`;
  if (existing.length > 0) return existing[0].id;
  const result = await sql`INSERT INTO collections (id, tenant_id, key, label) VALUES (gen_random_uuid(), ${TENANT_ID}, ${key}, ${label}) RETURNING id`;
  return result[0].id;
}

async function upsertItem(collectionId: string, slug: string, title: string, data: Record<string, unknown>, priority: number) {
  const existing = await sql`SELECT id FROM collection_items WHERE tenant_id = ${TENANT_ID} AND collection_id = ${collectionId} AND slug = ${slug}`;
  if (existing.length > 0) {
    await sql`UPDATE collection_items SET title = ${title}, data = ${JSON.stringify(data)}::jsonb, published = true, priority = ${priority} WHERE id = ${existing[0].id}`;
  } else {
    await sql`INSERT INTO collection_items (id, tenant_id, collection_id, slug, title, data, published, priority) VALUES (gen_random_uuid(), ${TENANT_ID}, ${collectionId}, ${slug}, ${title}, ${JSON.stringify(data)}::jsonb, true, ${priority})`;
  }
}

async function main() {
  console.log('🔄 Creating collections for Schuldes GmbH...\n');

  // ══════════════════════════════════════════════════════════════
  // LEISTUNGEN COLLECTION
  // ══════════════════════════════════════════════════════════════
  const servicesId = await ensureCollection('services', 'Leistungen');
  console.log('📦 Services collection:', servicesId);

  await upsertItem(servicesId, 'wasserschadenbeseitigung', 'Wasserschadenbeseitigung', {
    image: IMG.wasserschaden,
    description: 'Professionelle Soforthilfe und nachhaltige Beseitigung von Wasserschäden aller Art – mit über 30 Jahren Erfahrung, modernster Messtechnik und dem bewährten Komplettservice-Prinzip der Schuldes GmbH.',
    features: [
      'Sofortige Schadensbegrenzung durch Installation von Trocknungsgeräten',
      'Kostenlose und transparente Angebotserstellung',
      'Zerstörungsfreie Schadensanalyse und Leckortung',
      'Effiziente Messtechnik für konkrete Ergebnisse und hohe Erfolgsquoten',
      'Verwendung ausschließlich umweltverträglicher Werkstoffe und Betriebsmittel',
      'Koordination aller Sanierungsgewerke aus einer Hand',
      'Direkte Regulierungsabwicklung mit Ihrem Versicherer',
    ],
    content: `
<h2>Die Ursache – unkalkulierbar und vielfältig</h2>
<p>Wasser ist trickreich und sucht sich auf unterschiedlichste Art und Weise seinen zerstörerischen Weg. Ob durch natürliche Korrosionseffekte, außerordentliche Umwelteinflüsse, bauliche Mängel oder schlichtweg Unachtsamkeit – die Ursachen für ein Wasserproblem sind vielfältig:</p>
<ul>
<li>Beschädigte Rohrleitungen – Lochfraß (Heizung, Wasser, Fußbodenheizung)</li>
<li>Undichte Armaturen, Boiler und Heizkörper</li>
<li>Geplatzte Schlauchsysteme an Wasch- und Spülmaschinen</li>
<li>Mangelhafte Dachkonstruktionen</li>
<li>Fehlerhaft montierte oder korrodierte Dichtungssysteme</li>
<li>Löschwasser nach Brandeinsätzen</li>
</ul>

<h2>Die Folge – unangenehm und gefährlich</h2>
<p>Unangenehmer Modergeruch, aufgequollene Holzkonstruktionen und Zerfallserscheinungen an der Bausubstanz sind nur einige der Folgen. Besonders kritisch wird es, wenn Pilze und Schimmelbildung die Gesundheit gefährden oder die Statik eines Objektes bedroht ist.</p>

<h2>Die Lösung – effizient und nachhaltig</h2>
<p>Einem erkannten Wasserproblem muss schnell und konsequent entgegengetreten werden. Nur so lassen sich Langzeitschäden vermeiden und Kosten im Rahmen halten. Unser bewährtes Verfahren umfasst:</p>
<ol>
<li><strong>Schadensbegrenzung durch Soforthilfe</strong> – Installation von Trocknungsgeräten bei der initialen Projektbesichtigung</li>
<li><strong>Problemanalyse</strong> – Ursachenermittlung, Feuchtigkeitsmessungen, Prüfung der Baukonstruktion</li>
<li><strong>Leckortung</strong> – Thermografie, frequenzakustische Ortung, Widerstands-/Digitalmessungen, Endoskopie</li>
<li><strong>Kostenlose Angebotserstellung</strong> – Transparent und verbindlich</li>
<li><strong>Ursachenbeseitigung</strong> – Zuverlässige Beseitigung der Fehlerquelle</li>
<li><strong>Trocknungsverfahren</strong> – Je nach Ausgangslage: Estrich-, Raum-, Hohlraum- oder Wandtrocknung</li>
<li><strong>Sanierungsmaßnahmen</strong> – Komplettsteuerung aller erforderlichen Gewerke</li>
</ol>
    `.trim(),
  }, 0);
  console.log('  ✅ Wasserschadenbeseitigung');

  await upsertItem(servicesId, 'leckortung-thermografie', 'Leckortung & Thermografie', {
    image: IMG.leckortung,
    description: 'Nicht immer lässt sich die Ursache für einen Wasserschaden auf den ersten Blick lokalisieren. Mit modernster Messtechnik und zerstörungsfreien Verfahren finden wir jede Leckage – präzise und ohne unnötige Folgeschäden.',
    features: [
      'Infrarot-Thermografie zur präzisen Temperaturanalyse',
      'Frequenzakustische Leckageortung mit DSA-Technologie',
      'Widerstands- und Digitalmessungen zur Feuchtigkeitsbestimmung',
      'Endoskopie für zerstörungsfreie Hohlrauminspektion',
      'Minimierung von Folgekosten durch zerstörungsfreie Ortung',
    ],
    content: `
<h2>Dem Wasser auf der Spur</h2>
<p>Nicht immer lässt sich die Ursache für einen Wasserschaden eindeutig lokalisieren. In diesem Fall setzen wir auf Messtechniken, die sich durch hohe Präzision und ausgezeichnete Ergebnisse bewähren. Unser Anspruch: möglichst zerstörungsfreie Ortung der Schadstelle.</p>

<h2>Thermografie</h2>
<p>Thermografische Systeme erfassen Infrarotwellen und registrieren selbst minimale Temperaturunterschiede. Tritt aus einer undichten Leitung warmes Wasser aus, kann die Infrarotkamera den Ursprung präzise eingrenzen – auch bei Kaltwasser- und Abwasserleitungen.</p>

<h2>Frequenzakustische Leckageortung</h2>
<p>Modernste digitale Signalprozessortechnik (DSP) ermöglicht auch unter schwierigen akustischen Bedingungen die Ortung des Leckgeräusches. Die innovative DSA-Technologie separiert Störgeräusche vom Lecksignal und stellt es grafisch dar.</p>

<h2>Widerstandsmessungen</h2>
<p>Durch Messung des elektrischen Widerstands lässt sich der Feuchtigkeitsgrad exakt bestimmen. Trockene Flächen weisen hohen Widerstand auf, feuchte Bereiche leiten Elektrizität deutlich besser – ein zuverlässiger Indikator.</p>

<h2>Endoskopie</h2>
<p>Flexibles oder starres Endoskop wird durch kleine Öffnungen (4–10 mm) in Hohlräume eingeführt und liefert aufschlussreiches Bildmaterial. Das ermöglicht eine weitgehend zerstörungsfreie Analyse ohne großflächige Öffnung der Bausubstanz.</p>
    `.trim(),
  }, 1);
  console.log('  ✅ Leckortung & Thermografie');

  await upsertItem(servicesId, 'bautrocknung', 'Bautrocknung', {
    image: IMG.bautrocknung,
    description: 'Zeit ist ein entscheidender Kostenfaktor. Restfeuchte kann Terminpläne empfindlich verzögern. Unsere professionellen Trocknungsgeräte sorgen für schnelle Ergebnisse – bei Neubau, Sanierung und nach Wasserschäden.',
    features: [
      'Kondensations- und Adsorptionstrockner für verschiedene Einsatzzwecke',
      'Umluftgebläse für beschleunigte Trocknung',
      'Estrichtrocknung (Unter- und Überdruckverfahren)',
      'Raumtrocknung mit kontinuierlicher Feuchtigkeitsmessung',
      'Hohlraumtrocknung mit gezielter Luftdurchflutung',
      'Decken- und Wandtrocknung mit Folienverfahren',
      'Regelmäßige Kontrolle des Trocknungsfortschritts',
    ],
    content: `
<h2>Professionelle Bautrocknung</h2>
<p>Vor allem der natürliche Wassergehalt von Baumaterialien (Beton, Mauerwerk, Putz) und witterungsbedingte Feuchtigkeit können Bauprojekte erheblich verzögern. Der gezielte Einsatz von Kondensationstrocknern und Umluftgebläsen reduziert vorhandene Feuchtigkeit in Böden, Wänden und Decken innerhalb kurzer Zeit auf einen vertretbaren Wert.</p>

<h3>Estrichtrocknung</h3>
<p>Bei schwimmender Estrichkonstruktion kommen Unter- oder Überdruckverfahren zum Einsatz. Beim Unterdruckverfahren wird die feuchte Luft aus dem Hohlraum abgesaugt und vorgetrocknete Luft zugeführt. Beim Überdruckverfahren wird trockene Luft in den Hohlraum gepresst.</p>

<h3>Raumtrocknung</h3>
<p>Der Trocknungsprozess erstreckt sich auf den gesamten Raum und basiert auf dem Prinzip der Luftentfeuchtung. Kondensations- oder Adsorptionstrockner in Verbindung mit Umluftgebläsen bleiben im Einsatz, bis die erforderlichen Messwerte erreicht werden.</p>

<h3>Hohlraum- und Wandtrocknung</h3>
<p>Bei Hohlräumen wird der Bereich angebohrt und mit trockener Luft durchflutet. Bei Wänden und Decken werden betroffene Stellen mit Folie abgedeckt und gezielt entfeuchtet – für eine deutlich beschleunigte Trocknung.</p>
    `.trim(),
  }, 2);
  console.log('  ✅ Bautrocknung');

  await upsertItem(servicesId, 'schadensmanagement', 'Schadensmanagement & Sanierung', {
    image: IMG.sanierung,
    description: 'Auf Wunsch übernehmen wir die Komplettsteuerung aller erforderlichen Gewerke – von der Auswahl über die Ausführung bis zur Abwicklung mit Ihrem Versicherer. Sie haben einen Ansprechpartner für alles.',
    features: [
      'Auswahl und Koordination aller benötigten Gewerke',
      'Maler-, Bodenleger-, Schreiner- und Fliesenlegerarbeiten',
      'Sachgemäße Ausführung und Qualitätsüberwachung',
      'Detaillierte Rechnungsprüfung und transparente Abrechnung',
      'Direkte Regulierungsabwicklung mit dem Versicherer',
      'Ein Ansprechpartner für die gesamte Sanierung',
    ],
    content: `
<h2>Alles aus einer Hand</h2>
<p>Von der Auswahl der benötigten Gewerke über die Angebotsunterbreitung, die Steuerung und Überwachung der sachgemäßen Ausführung bis hin zur detaillierten Rechnungsprüfung und der verwaltungstechnischen Abwicklung mit dem Versicherer – Sie haben mit der Schuldes GmbH einen einzigen Ansprechpartner und brauchen sich um nichts weiter zu kümmern.</p>
<p>Wir arbeiten seit vielen Jahren intensiv mit qualifizierten Partnern aus Ingolstadt und der Region zusammen, auf die sowohl wir als auch Sie sich zu 100 % verlassen können.</p>
<blockquote>
<p>„Durch das Schadensmanagement nach dem ‚Komplettservice'-Prinzip profitieren Sie lückenlos von unserer langjährigen Erfahrung bei der Auftragsabwicklung."</p>
<footer>— Rainer Schuldes, Geschäftsführung</footer>
</blockquote>
    `.trim(),
  }, 3);
  console.log('  ✅ Schadensmanagement');

  await upsertItem(servicesId, 'bauwerksabdichtung', 'Bauwerksabdichtung', {
    image: IMG.abdichtung,
    description: 'Unter Bauwerksabdichtung werden alle Maßnahmen zusammengefasst, die den schädlichen Einfluss von Feuchtigkeit auf die Bausubstanz nachhaltig unterbinden – bei Neubau und Sanierung.',
    features: [
      'Kellerabdichtung gegen aufsteigende Feuchtigkeit',
      'Schutz gegen drohende Bodenfeuchtigkeit',
      'Abdichtung von Terrassen, Balkonen und Flachdächern',
      'Feuchtraumabdichtung (Bad, Sauna)',
      'Abdichtung von Kabel- und Rohrdurchführungen',
      'Einhaltung gesetzlich geregelter Normen',
    ],
    content: `
<h2>Wirkungsvoller Schutz vor Feuchtigkeit</h2>
<p>Bauwerksabdichtung spielt vor allem bei der Nutzbarmachung von Kellerräumen und Tiefgeschossen eine wichtige Rolle, aber auch Terrassen, Balkone, Flachdachkonstruktionen und Räume mit hohem Feuchtegrad sind betroffen.</p>
<p>Ein besonderer Problembereich ist der Schutz gegen drohende Bodenfeuchtigkeit. Alle Berührungspunkte zwischen Bausubstanz und Erdreich sind für das Eindringen von Feuchtigkeit anfällig. Kabel und Rohre, die das Mauerwerk durchdringen, erweisen sich häufig als potentielle Gefahrenquellen.</p>
<p>Bei unsachgemäßer oder nicht mehr intakter Abdichtung führen steigende Grundwasserpegel, Schmelzwasser und Niederschläge schnell zu empfindlichen Schäden: Putzausblühungen, unangenehme Gerüche und abblätternder Putz sind typische Folgen.</p>
<p>Die Bauwerksabdichtung orientiert sich an gesetzlich geregelten Normen und kommt sowohl bei Neubauten als auch bei der Sanierung bestehender Gebäude zum Einsatz.</p>
    `.trim(),
  }, 4);
  console.log('  ✅ Bauwerksabdichtung');

  await upsertItem(servicesId, 'rissverpressung', 'Rissverpressung', {
    image: IMG.rissverpressung,
    description: 'Rissbildungen in Betonkonstruktionen bieten Angriffsfläche für Feuchtigkeit und können die Statik gefährden. Mit professioneller Injektionstechnik stellen wir Dichtigkeit und Tragfähigkeit wieder her.',
    features: [
      'Kraftschlüssige Verpressung zur Wiederherstellung der Tragfähigkeit',
      'Dehnfähige Verpressung für Gebiete mit aktiver Bodensenkung',
      'Arbeitsfugen-Verpressung für Beton-Übergänge (Wand/Boden/Decke)',
      'Einsatz von flüssigem Kunstharz über gesetzte Bohrungen',
      'Individuelle Auswahl des Injektionssystems nach Baustruktur',
    ],
    content: `
<h2>Professionelle Rissverpressung</h2>
<p>Bauliche Gegebenheiten und Umwelteinflüsse sind überwiegend die Ursache für Rissbildungen in Betonkonstruktionen. Diese Beschädigungen bieten Angriffsfläche für eindringende Feuchtigkeit und können die statischen Eigenschaften eines Gebäudes beeinträchtigen.</p>
<p>Beim Verfahren der Rissverpressung wird flüssiges Kunstharz über Bohrungen in den Riss injiziert und dieser somit verfüllt. Welches Injektionssystem zum Einsatz kommt, richtet sich nach den Gegebenheiten der Baustruktur.</p>

<h3>Kraftschlüssige Verpressung</h3>
<p>Erzeugt statische Verbindungen (zug- und druckfest) zur Wiederherstellung der Tragfähigkeit von gerissenen Bauelementen, wie bei tragenden Betonteilen erforderlich.</p>

<h3>Dehnfähige Verpressung</h3>
<p>Stellt eine begrenzt dehnfähige Verbindung zwischen gerissenen Bauteilen her – empfohlen in Gebieten mit aktiver Bodensenkung.</p>

<h3>Arbeitsfugen-Verpressung</h3>
<p>Dauerhafte Methode zum Verschluss von Übergängen zwischen Wänden, Böden und Decken bei Betonkonstruktionen, z.B. in Tiefgaragen und wasserdichten Kellern.</p>
    `.trim(),
  }, 5);
  console.log('  ✅ Rissverpressung');

  // ══════════════════════════════════════════════════════════════
  // MIETGERÄTE COLLECTION
  // ══════════════════════════════════════════════════════════════
  const mietId = await ensureCollection('mietgeraete', 'Mietgeräte');
  console.log('\n📦 Mietgeräte collection:', mietId);

  await upsertItem(mietId, 'tb-220', 'Sprinter-Arbeitsbühne TB 220', {
    image: IMG.buehne,
    description: 'Kompakte Sprinter-Arbeitsbühne für beengte Einsatzorte – ideal für Fassadenarbeiten, Baumschnitt und Montagearbeiten bis 22 Meter Arbeitshöhe.',
    features: [
      'Korbbelastung: 200 kg',
      'Arbeitshöhe: bis 22 m',
      'Kompakte Sprinter-Bauweise',
      'Ideal für beengte Zufahrten und enge Hofbereiche',
      'Einweisung inklusive',
      'Lieferung und Abholung möglich',
    ],
    content: `
<h2>Sprinter-Arbeitsbühne TB 220</h2>
<p>Die TB 220 ist eine kompakte Arbeitsbühne auf Sprinter-Basis und eignet sich hervorragend für Einsatzorte mit begrenztem Platzangebot. Mit einer Arbeitshöhe von bis zu 22 Metern und einer Korbbelastung von 200 kg ist sie ideal für Fassadenarbeiten, Baumschnitt, Beleuchtungsmontage und ähnliche Aufgaben.</p>
<p>Kontaktieren Sie uns für aktuelle Preise und Verfügbarkeit unter <strong>+49 841 95616480</strong>.</p>
    `.trim(),
  }, 0);
  console.log('  ✅ TB 220');

  await upsertItem(mietId, 'tbr-220', 'Sprinter-Arbeitsbühne TBR 220', {
    image: IMG.buehne,
    description: 'Vielseitige Sprinter-Arbeitsbühne mit erweitertem Aktionsradius und 230 kg Korbbelastung – für flexible Einsätze in Höhe und Reichweite.',
    features: [
      'Korbbelastung: 230 kg',
      'Erweiterter Aktionsradius',
      'Sprinter-Bauweise für flexible Einsätze',
      'Geeignet für Fassaden, Dachrinnen und Montagearbeiten',
      'Einweisung inklusive',
      'Lieferung und Abholung möglich',
    ],
    content: `
<h2>Sprinter-Arbeitsbühne TBR 220</h2>
<p>Die TBR 220 bietet gegenüber der TB 220 einen erweiterten Aktionsradius bei gleichzeitig erhöhter Korbbelastung von 230 kg. Ihre Sprinter-Bauweise ermöglicht den flexiblen Einsatz auch an schwer zugänglichen Stellen.</p>
<p>Kontaktieren Sie uns für aktuelle Preise und Verfügbarkeit unter <strong>+49 841 95616480</strong>.</p>
    `.trim(),
  }, 1);
  console.log('  ✅ TBR 220');

  await upsertItem(mietId, 'tb-270', 'Sprinter-Arbeitsbühne TB 270', {
    image: IMG.buehne,
    description: 'Leistungsstarke Sprinter-Arbeitsbühne mit 250 kg Korbbelastung und bis zu 27 Metern Arbeitshöhe – für anspruchsvolle Höhenarbeiten.',
    features: [
      'Korbbelastung: 250 kg',
      'Arbeitshöhe: bis 27 m',
      'Sprinter-Bauweise – kein LKW-Führerschein nötig',
      'Ideal für höhere Fassaden und Dacharbeiten',
      'Einweisung inklusive',
      'Lieferung und Abholung möglich',
    ],
    content: `
<h2>Sprinter-Arbeitsbühne TB 270</h2>
<p>Die TB 270 erreicht Arbeitshöhen von bis zu 27 Metern bei einer Korbbelastung von 250 kg. Sie kombiniert die Wendigkeit einer Sprinter-Basis mit der Leistungsfähigkeit für anspruchsvolle Höhenarbeiten an Fassaden, Dächern und Industrieanlagen.</p>
<p>Kontaktieren Sie uns für aktuelle Preise und Verfügbarkeit unter <strong>+49 841 95616480</strong>.</p>
    `.trim(),
  }, 2);
  console.log('  ✅ TB 270');

  await upsertItem(mietId, 't-330', 'LKW-Arbeitsbühne T 330', {
    image: IMG.buehne,
    description: 'Unsere größte Arbeitsbühne: 320 kg Korbbelastung und beeindruckende 33 Meter Arbeitshöhe – für Großprojekte und schwer erreichbare Einsatzorte.',
    features: [
      'Korbbelastung: 320 kg',
      'Arbeitshöhe: bis 33 m',
      'LKW-Basis für maximale Stabilität',
      'Ideal für Großprojekte und Industrieeinsätze',
      'Professionelle Einweisung inklusive',
      'Lieferung und Abholung deutschlandweit',
    ],
    content: `
<h2>LKW-Arbeitsbühne T 330</h2>
<p>Die T 330 ist unsere leistungsstärkste Arbeitsbühne auf LKW-Basis. Mit einer Arbeitshöhe von bis zu 33 Metern und einer Korbbelastung von 320 kg eignet sie sich für Großprojekte, Industriemontagen und alle Aufgaben, die maximale Reichweite erfordern.</p>
<p>Kontaktieren Sie uns für aktuelle Preise und Verfügbarkeit unter <strong>+49 841 95616480</strong>.</p>
    `.trim(),
  }, 3);
  console.log('  ✅ T 330');

  await upsertItem(mietId, 'trocknungsgeraete', 'Trocknungsgeräte', {
    image: IMG.trockner,
    description: 'Professionelle Bautrockner und Kondensationstrockner zur schnellen und effizienten Entfeuchtung von Räumen, Estrichen und Hohlräumen.',
    features: [
      'Kondensationstrockner verschiedener Leistungsklassen',
      'Adsorptionstrockner für besonders niedrige Temperaturen',
      'Umluftgebläse / Schneckengebläse',
      'Seitenkanalverdichter für Estrichtrocknung',
      'Feuchtigkeitsmessgeräte',
      'Beratung zur optimalen Gerätekombination',
    ],
    content: `
<h2>Professionelle Trocknungsgeräte</h2>
<p>Ob Neubautrocknung, Wasserschadensanierung oder Restfeuchte-Reduktion – wir vermieten professionelle Trocknungsgeräte für jeden Bedarf. Unsere Experten beraten Sie bei der Auswahl der optimalen Gerätekombination für Ihr Projekt.</p>
<p>Kontaktieren Sie uns für aktuelle Preise und Verfügbarkeit unter <strong>+49 841 95616480</strong>.</p>
    `.trim(),
  }, 4);
  console.log('  ✅ Trocknungsgeräte');

  await upsertItem(mietId, 'heizgeraete', 'Heizgeräte (Elektro, Gas, Öl)', {
    image: IMG.heizgeraet,
    description: 'Mobile Heizlösungen für Baustellen und Trocknungseinsätze – als Elektro-, Gas- oder Ölvariante für jeden Bedarf und jede Raumgröße.',
    features: [
      'Elektro-Heizgeräte für innenräumlichen Einsatz',
      'Gas-Heizgeräte für große Flächen',
      'Öl-Heizgeräte für Außenbereiche und Hallen',
      'Verschiedene Leistungsklassen verfügbar',
      'Ideal als Unterstützung bei Trocknungseinsätzen',
      'Beratung zur optimalen Heizlösung',
    ],
    content: `
<h2>Mobile Heizgeräte</h2>
<p>Unsere mobilen Heizgeräte unterstützen Trocknungseinsätze und sorgen auf Baustellen für die nötige Temperatur. Verfügbar als Elektro-, Gas- oder Ölvariante in verschiedenen Leistungsklassen – passend für Kleinsträume bis hin zu großen Hallen.</p>
<p>Kontaktieren Sie uns für aktuelle Preise und Verfügbarkeit unter <strong>+49 841 95616480</strong>.</p>
    `.trim(),
  }, 5);
  console.log('  ✅ Heizgeräte');

  // ══════════════════════════════════════════════════════════════
  // UPDATE LEISTUNGEN PAGE – link services grid to collection items
  // ══════════════════════════════════════════════════════════════
  console.log('\n🔗 Updating page links...');

  // Update the services grid cards on Leistungen page to link to collection items
  const leistungenSections = await sql`SELECT id, type, data FROM page_sections WHERE page_id = 'fa0bd7cd-8a4c-472b-a6b3-484cd15eca21' AND type = 'servicesGrid'`;
  if (leistungenSections.length > 0) {
    const data = leistungenSections[0].data as Record<string, unknown>;
    const cards = data.manualCards as Array<Record<string, unknown>>;
    const slugMap: Record<string, string> = {
      'Wasserschadenbeseitigung': '/c/services/wasserschadenbeseitigung',
      'Leckortung & Thermografie': '/c/services/leckortung-thermografie',
      'Bautrocknung': '/c/services/bautrocknung',
      'Schadensmanagement': '/c/services/schadensmanagement',
      'Bauwerksabdichtung': '/c/services/bauwerksabdichtung',
      'Rissverpressung': '/c/services/rissverpressung',
    };
    for (const card of cards) {
      const href = slugMap[card.title as string];
      if (href) card.href = href;
    }
    data.manualCards = cards;
    await sql`UPDATE page_sections SET data = ${JSON.stringify(data)}::jsonb WHERE id = ${leistungenSections[0].id}`;
    console.log('  ✅ Leistungen grid linked');
  }

  // Update the services grid cards on Startseite to link too
  const startSections = await sql`SELECT id, type, data FROM page_sections WHERE page_id = '403d525f-f1b1-4e79-be9b-279ee6de5ed8' AND type = 'servicesGrid'`;
  if (startSections.length > 0) {
    const data = startSections[0].data as Record<string, unknown>;
    const cards = data.manualCards as Array<Record<string, unknown>>;
    const slugMap: Record<string, string> = {
      'Wasserschadenbeseitigung': '/c/services/wasserschadenbeseitigung',
      'Leckortung & Thermografie': '/c/services/leckortung-thermografie',
      'Bautrocknung': '/c/services/bautrocknung',
      'Sanierung & Schadensmanagement': '/c/services/schadensmanagement',
    };
    for (const card of cards) {
      const href = slugMap[card.title as string];
      if (href) card.href = href;
    }
    data.manualCards = cards;
    await sql`UPDATE page_sections SET data = ${JSON.stringify(data)}::jsonb WHERE id = ${startSections[0].id}`;
    console.log('  ✅ Startseite grid linked');
  }

  // Update the Mietservice grid to link to collection items
  const mietSections = await sql`SELECT id, type, sort_order, data FROM page_sections WHERE page_id = '80002c21-5c60-4a73-b6f4-58b970389c66' AND type = 'servicesGrid'`;
  if (mietSections.length > 0) {
    const data = mietSections[0].data as Record<string, unknown>;
    const cards = data.manualCards as Array<Record<string, unknown>>;
    const slugMap: Record<string, string> = {
      'Sprinter-Arbeitsbühne TB 220': '/c/mietgeraete/tb-220',
      'Sprinter-Arbeitsbühne TBR 220': '/c/mietgeraete/tbr-220',
      'Sprinter-Arbeitsbühne TB 270': '/c/mietgeraete/tb-270',
      'LKW-Arbeitsbühne T 330': '/c/mietgeraete/t-330',
      'Trocknungsgeräte': '/c/mietgeraete/trocknungsgeraete',
      'Heizgeräte (Elektro, Gas, Öl)': '/c/mietgeraete/heizgeraete',
    };
    for (const card of cards) {
      const href = slugMap[card.title as string];
      if (href) card.href = href;
    }
    data.manualCards = cards;
    await sql`UPDATE page_sections SET data = ${JSON.stringify(data)}::jsonb WHERE id = ${mietSections[0].id}`;
    console.log('  ✅ Mietservice grid linked');
  }

  console.log('\n🎉 Collections created and pages linked!');
}

main().catch(console.error);
