import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../packages/db/src/schema';
import { eq, and } from 'drizzle-orm';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) { console.error('DATABASE_URL not set'); process.exit(1); }

const sql = neon(DATABASE_URL);
const db = drizzle(sql, { schema });

const TENANT_ID = 'f50cbf53-279d-43f3-b58b-f5ae3d550ab2';

const IMPRESSUM_HTML = `
<h2>Angaben gem&auml;&szlig; &sect; 5 TMG</h2>
<p><strong>M&uuml;ller &amp; S&ouml;hne Meisterbetrieb GmbH</strong><br/>
Handwerkerstra&szlig;e 12<br/>50667 K&ouml;ln</p>
<p><strong>Vertreten durch:</strong><br/>Michael M&uuml;ller, Stefan M&uuml;ller (Gesch&auml;ftsf&uuml;hrer)</p>

<h2>Kontakt</h2>
<p>Telefon: 0221 / 98 76 54 0<br/>E-Mail: info@mueller-soehne.de</p>

<h2>Registereintrag</h2>
<p>Eintragung im Handelsregister<br/>Registergericht: Amtsgericht K&ouml;ln<br/>Registernummer: HRB 12345</p>

<h2>Umsatzsteuer-ID</h2>
<p>Umsatzsteuer-Identifikationsnummer gem&auml;&szlig; &sect; 27a UStG:<br/>DE 123 456 789</p>

<h2>Berufsbezeichnung und berufsrechtliche Regelungen</h2>
<p>Berufsbezeichnung: Installateur- und Heizungsbaumeister<br/>
Verliehen in: Deutschland<br/>
Zust&auml;ndige Handwerkskammer: Handwerkskammer zu K&ouml;ln, Heumarkt 12, 50667 K&ouml;ln</p>

<h2>Streitschlichtung</h2>
<p>Die Europ&auml;ische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:
<a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener">https://ec.europa.eu/consumers/odr/</a>.
Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>

<h2>Haftung f&uuml;r Inhalte</h2>
<p>Als Diensteanbieter sind wir gem&auml;&szlig; &sect; 7 Abs.1 TMG f&uuml;r eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach &sect;&sect; 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, &uuml;bermittelte oder gespeicherte fremde Informationen zu &uuml;berwachen oder nach Umst&auml;nden zu forschen, die auf eine rechtswidrige T&auml;tigkeit hinweisen.</p>
`;

const DATENSCHUTZ_HTML = `
<h2>1. Datenschutz auf einen Blick</h2>
<h3>Allgemeine Hinweise</h3>
<p>Die folgenden Hinweise geben einen einfachen &Uuml;berblick dar&uuml;ber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie pers&ouml;nlich identifiziert werden k&ouml;nnen.</p>

<h3>Datenerfassung auf dieser Website</h3>
<p><strong>Wer ist verantwortlich f&uuml;r die Datenerfassung auf dieser Website?</strong><br/>
Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber: M&uuml;ller &amp; S&ouml;hne Meisterbetrieb GmbH, Handwerkerstra&szlig;e 12, 50667 K&ouml;ln, Telefon: 0221 / 98 76 54 0, E-Mail: info@mueller-soehne.de.</p>

<h2>2. Hosting</h2>
<p>Diese Website wird bei einem externen Dienstleister gehostet (Hoster). Die personenbezogenen Daten, die auf dieser Website erfasst werden, werden auf den Servern des Hosters gespeichert. Hierbei kann es sich v.a. um IP-Adressen, Kontaktanfragen, Meta- und Kommunikationsdaten, Vertragsdaten, Kontaktdaten, Namen, Websitezugriffe und sonstige Daten, die &uuml;ber eine Website generiert werden, handeln.</p>

<h2>3. Allgemeine Hinweise und Pflichtinformationen</h2>
<h3>Datenschutz</h3>
<p>Die Betreiber dieser Seiten nehmen den Schutz Ihrer pers&ouml;nlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend den gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerkl&auml;rung.</p>

<h3>Hinweis zur verantwortlichen Stelle</h3>
<p>Die verantwortliche Stelle f&uuml;r die Datenverarbeitung auf dieser Website ist:<br/>
<strong>M&uuml;ller &amp; S&ouml;hne Meisterbetrieb GmbH</strong><br/>
Handwerkerstra&szlig;e 12<br/>50667 K&ouml;ln<br/>
Telefon: 0221 / 98 76 54 0<br/>E-Mail: info@mueller-soehne.de</p>

<h2>4. Datenerfassung auf dieser Website</h2>
<h3>Kontaktformular</h3>
<p>Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und f&uuml;r den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter. Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO.</p>

<h3>Cookies</h3>
<p>Unsere Internetseiten verwenden teilweise so genannte Cookies. Cookies richten auf Ihrem Rechner keinen Schaden an und enthalten keine Viren. Cookies dienen dazu, unser Angebot nutzerfreundlicher, effektiver und sicherer zu machen.</p>

<h2>5. Ihre Rechte</h2>
<p>Sie haben jederzeit das Recht auf unentgeltliche Auskunft &uuml;ber Ihre gespeicherten personenbezogenen Daten, deren Herkunft und Empf&auml;nger und den Zweck der Datenverarbeitung sowie ein Recht auf Berichtigung oder L&ouml;schung dieser Daten. Hierzu sowie zu weiteren Fragen zum Thema Datenschutz k&ouml;nnen Sie sich jederzeit an uns wenden.</p>

<h2>6. Analyse-Tools und Werbung</h2>
<p>Beim Besuch dieser Website kann Ihr Surf-Verhalten statistisch ausgewertet werden. Das geschieht vor allem mit sogenannten Analyseprogrammen. Detaillierte Informationen zu diesen Analyseprogrammen finden Sie in den folgenden Abschnitten dieser Datenschutzerkl&auml;rung. Die Analyse Ihres Surf-Verhaltens erfolgt in der Regel anonym; das Surf-Verhalten kann nicht zu Ihnen zur&uuml;ckverfolgt werden.</p>
`;

async function main() {
  console.log('Seeding Impressum + Datenschutz...');

  // Check existing
  const existing = await db.select({ slug: schema.pages.slug })
    .from(schema.pages)
    .where(eq(schema.pages.tenantId, TENANT_ID));

  const slugs = existing.map(p => p.slug);

  if (!slugs.includes('impressum')) {
    const [imp] = await db.insert(schema.pages).values({
      tenantId: TENANT_ID, title: 'Impressum', slug: 'impressum', type: 'legal', status: 'published', visible: true, sortOrder: 10,
    }).returning();
    await db.insert(schema.pageSections).values({
      tenantId: TENANT_ID, pageId: imp.id, type: 'richText', sortOrder: 0, visible: true,
      data: { headline: 'Impressum', html: IMPRESSUM_HTML },
    });
    console.log('Created Impressum');
  } else {
    console.log('Impressum already exists');
  }

  if (!slugs.includes('datenschutz')) {
    const [ds] = await db.insert(schema.pages).values({
      tenantId: TENANT_ID, title: 'Datenschutz', slug: 'datenschutz', type: 'legal', status: 'published', visible: true, sortOrder: 11,
    }).returning();
    await db.insert(schema.pageSections).values({
      tenantId: TENANT_ID, pageId: ds.id, type: 'richText', sortOrder: 0, visible: true,
      data: { headline: 'Datenschutzerkl\u00e4rung', html: DATENSCHUTZ_HTML },
    });
    console.log('Created Datenschutz');
  } else {
    console.log('Datenschutz already exists');
  }

  console.log('Done!');
}

main().catch(console.error);
