import { Link } from '@/lib/nav-compat';
import { useReveal } from '@/components/fx';
import Seo from '@/components/Seo';
import { CookieSettingsButton } from '@/components/CookieBanner';

const STUDIO = {
  name: 'FlamingoMedia',
  legalOwner: 'Mario Schubert Fotografie',
  street: 'Bäckerbühelgasse 14',
  city: '6020 Innsbruck',
  country: 'Österreich',
  email: 'hello@flamingomedia.online',
  phone: '+49 1515 5338029',
  phoneAt: '+43 677 6368 1543',
  uid: 'ATU00000000',
  hr: 'Einzelunternehmen',
};

function Page({ title, children }: { title: string; children: React.ReactNode }) {
  useReveal();
  return (
    <>
      <section className="pt-44 pb-12">
        <div className="container-x">
          <p className="eyebrow mb-5 reveal">Rechtliches</p>
          <h1 className="headline-xl max-w-5xl reveal">{title}</h1>
        </div>
      </section>
      <section className="pb-32">
        <div className="container-tight prose-lite reveal text-base md:text-lg leading-relaxed text-muted [&_h2]:font-display [&_h2]:text-2xl [&_h2]:md:text-3xl [&_h2]:text-[color:var(--text-color)] [&_h2]:mt-12 [&_h2]:mb-4 [&_a]:text-brand [&_a:hover]:text-[var(--accent-color)] [&_strong]:text-[color:var(--text-color)]">
          {children}
        </div>
      </section>
    </>
  );
}

export function Imprint() {
  return (
    <>
      <Seo title="Impressum" description="Anbieter-Informationen und Offenlegung gemäß §§ 5 ECG, 14 UGB, 24 MedienG." noindex />
      <Page title="Impressum">
        <h2>Anbieter</h2>
        <p>
          <strong>{STUDIO.legalOwner}</strong><br />
          {STUDIO.street}<br />
          {STUDIO.city}<br />
          {STUDIO.country}
        </p>

        <h2>Kontakt</h2>
        <p>
          E-Mail: <a href={`mailto:${STUDIO.email}`}>{STUDIO.email}</a><br />
          Telefon (DE): <a href={`tel:${STUDIO.phone.replace(/\s/g,'')}`}>{STUDIO.phone}</a><br />
          Telefon (AT): <a href={`tel:${STUDIO.phoneAt.replace(/\s/g,'')}`}>{STUDIO.phoneAt}</a>
        </p>

        <h2>Unternehmensdaten</h2>
        <p>
          {STUDIO.hr}
        </p>

        <h2>Aufsichtsbehörde / Kammer</h2>
        <p>Wirtschaftskammer Tirol, Fachgruppe Werbung und Marktkommunikation.</p>

        <h2>Online-Streitbeilegung</h2>
        <p>
          Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung bereit:{' '}
          <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noreferrer noopener">ec.europa.eu/consumers/odr</a>.
          Wir sind nicht verpflichtet und nicht bereit, an einem Streitbeilegungsverfahren vor einer
          Verbraucherschlichtungsstelle teilzunehmen.
        </p>

        <h2>Haftung für Inhalte</h2>
        <p>
          Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit
          und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.
        </p>

        <p className="mt-12"><Link to="/" className="link-underline">← Zurück zur Startseite</Link></p>
      </Page>
    </>
  );
}

export function Privacy() {
  return (
    <>
      <Seo title="Datenschutzerklärung" description="Informationen zur Verarbeitung personenbezogener Daten gemäß DSGVO." noindex />
      <Page title="Datenschutz">
        <h2>1. Verantwortlicher</h2>
        <p>
          {STUDIO.legalOwner}, {STUDIO.street}, {STUDIO.city}.
          E-Mail: <a href={`mailto:${STUDIO.email}`}>{STUDIO.email}</a>.
        </p>

        <h2>2. Server-Logs</h2>
        <p>
          Beim Aufruf unserer Seiten verarbeitet der Hosting-Anbieter technisch erforderliche Daten
          (IP-Adresse, Zeitpunkt, User-Agent) zur Sicherstellung des Betriebs. Rechtsgrundlage ist
          Art. 6 Abs. 1 lit. f DSGVO. Speicherdauer: maximal 14 Tage.
        </p>

        <h2>3. Kontaktformular</h2>
        <p>
          Daten, die Sie uns über das Kontaktformular übermitteln (Name, E-Mail, Branche, Nachricht),
          verarbeiten wir ausschließlich zur Bearbeitung Ihrer Anfrage gemäß Art. 6 Abs. 1 lit. b und f DSGVO.
        </p>

        <h2>4. Cookies & Tracking</h2>
        <p>
          Wir setzen ausschließlich technisch notwendige Cookies. Optionale Cookies (Analyse, Marketing,
          Funktional) werden ausschließlich nach Ihrer Einwilligung gesetzt — erteilt über den Cookie-Banner
          beim ersten Besuch. Sie können Ihre Auswahl jederzeit ändern oder widerrufen:
        </p>
        <p>
          <CookieSettingsButton className="link-underline" />
        </p>

        <h2>5. Schriften & externe Inhalte</h2>
        <p>
          Schriftarten werden über Google Fonts geladen. Beim Laden wird Ihre IP-Adresse an Server von
          Google in der EU/USA übertragen. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an
          einheitlicher Darstellung). Die Übermittlung in die USA erfolgt auf Basis der EU-Standardvertragsklauseln.
          Demobilder werden teilweise von Unsplash (Unsplash Inc., USA) geladen.
        </p>

        <h2>6. Hosting</h2>
        <p>
          Diese Website wird bei Vercel Inc. (USA) bzw. auf Servern in der EU gehostet. Der Hoster verarbeitet
          IP-Adressen und Metadaten zur Auslieferung der Seiten (Art. 6 Abs. 1 lit. f DSGVO). Ein Auftragsverarbeitungsvertrag
          gemäß Art. 28 DSGVO besteht mit dem Hoster. Datenübermittlungen in Drittländer erfolgen auf Basis von
          EU-Standardvertragsklauseln.
        </p>

        <h2>7. Drittlandtransfer</h2>
        <p>
          Einige der oben genannten Dienste haben ihren Sitz in den USA. Die Übermittlung personenbezogener Daten
          in die USA erfolgt auf Grundlage von EU-Standardvertragsklauseln (Art. 46 Abs. 2 lit. c DSGVO) bzw. auf Basis
          des EU-US Data Privacy Frameworks, sofern der Empfänger zertifiziert ist.
        </p>

        <h2>8. Ihre Rechte</h2>
        <p>
          Sie haben das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16), Löschung (Art. 17),
          Einschränkung der Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20),
          Widerspruch gegen die Verarbeitung (Art. 21) sowie Widerruf erteilter Einwilligungen (Art. 7 Abs. 3).
        </p>
        <p>
          Beschwerderecht bei der Aufsichtsbehörde: Datenschutzbehörde Österreich, Barichgasse 40–42, 1030 Wien,
          <a href="https://www.dsb.gv.at" target="_blank" rel="noreferrer noopener"> dsb.gv.at</a>.
        </p>

        <h2>9. Aufbewahrung</h2>
        <p>
          Wir speichern Ihre Daten nur so lange, wie es für die Bearbeitung der Anfrage und gesetzliche
          Aufbewahrungspflichten erforderlich ist (z. B. steuerrechtliche Aufbewahrung: 7 Jahre).
        </p>

        <h2>10. Aktualität</h2>
        <p>
          Diese Datenschutzerklärung ist aktuell gültig (Stand: Mai 2026). Wir behalten uns vor, sie bei Bedarf
          anzupassen, z. B. bei Änderung unserer Dienste oder gesetzlicher Vorgaben.
        </p>

        <p className="mt-12"><Link to="/" className="link-underline">← Zurück zur Startseite</Link></p>
      </Page>
    </>
  );
}

export function Terms() {
  return (
    <>
      <Seo title="Allgemeine Geschäftsbedingungen" description="AGB für die Dienstleistungen von FlamingoMedia." noindex />
      <Page title="Allgemeine Geschäftsbedingungen (AGB)">
        <p><strong>Stand: Mai 2026</strong></p>

        <h2>1. Geltungsbereich</h2>
        <p>
          Diese Allgemeinen Geschäftsbedingungen gelten für alle Verträge zwischen {STUDIO.legalOwner}, {STUDIO.street}, {STUDIO.city} (nachfolgend „Auftragnehmer") und dem Kunden (nachfolgend „Auftraggeber") über die Erstellung, das Hosting und die Pflege von Websites sowie damit verbundene Dienstleistungen.
        </p>
        <p>
          Abweichende Bedingungen des Auftraggebers gelten nur, wenn der Auftragnehmer deren Geltung ausdrücklich schriftlich zugestimmt hat.
        </p>

        <h2>2. Vertragsgegenstand</h2>
        <p>Der Auftragnehmer erbringt Dienstleistungen in den Bereichen:</p>
        <ul>
          <li>Konzeption, Design und technische Umsetzung von Websites</li>
          <li>Content-Erstellung (Texte, Bilder, Videos)</li>
          <li>Hosting und technischer Betrieb</li>
          <li>Laufende Wartung und Aktualisierung</li>
          <li>Suchmaschinenoptimierung (SEO)</li>
        </ul>
        <p>Der genaue Leistungsumfang ergibt sich aus dem individuellen Angebot bzw. der Auftragsbestätigung.</p>

        <h2>3. Vertragsschluss</h2>
        <p>
          Angebote des Auftragnehmers sind freibleibend. Ein Vertrag kommt erst durch die schriftliche Auftragsbestätigung oder durch Beginn der Leistungserbringung zustande.
        </p>

        <h2>4. Leistungserbringung & Mitwirkungspflichten</h2>
        <p>
          Der Auftragnehmer erbringt seine Leistungen nach bestem Wissen und Gewissen unter Einhaltung vereinbarter Zeitpläne. Voraussetzung ist die rechtzeitige und vollständige Zulieferung von Inhalten, Zugangsdaten und Freigaben durch den Auftraggeber.
        </p>
        <p>
          Verzögerungen aufgrund fehlender Mitwirkung berechtigen den Auftragnehmer zur angemessenen Verlängerung vereinbarter Fristen.
        </p>

        <h2>5. Abnahme</h2>
        <p>
          Der Auftraggeber prüft die fertiggestellte Leistung innerhalb von 14 Tagen nach Bereitstellung und nimmt sie ab. Beanstandungen sind unverzüglich schriftlich mitzuteilen. Erfolgt keine Rückmeldung innerhalb der Frist, gilt die Leistung als abgenommen.
        </p>

        <h2>6. Vergütung & Zahlungsbedingungen</h2>
        <p>Die Vergütung ergibt sich aus dem jeweiligen Angebot. Alle Preise verstehen sich netto zzgl. gesetzlicher USt.</p>
        <ul>
          <li><strong>Einmalige Leistungen:</strong> 50 % bei Auftragserteilung, 50 % bei Abnahme.</li>
          <li><strong>Laufende Leistungen (Hosting, Wartung):</strong> Monatlich oder jährlich im Voraus.</li>
        </ul>
        <p>Rechnungen sind innerhalb von 14 Tagen ohne Abzug fällig. Bei Verzug werden Verzugszinsen in gesetzlicher Höhe berechnet.</p>

        <h2>7. Laufzeit & Kündigung</h2>
        <p>
          Verträge über laufende Leistungen haben eine Mindestlaufzeit von 12 Monaten und verlängern sich automatisch um jeweils 12 Monate, sofern nicht mit einer Frist von 3 Monaten zum Laufzeitende schriftlich gekündigt wird.
        </p>
        <p>Das Recht zur außerordentlichen Kündigung aus wichtigem Grund bleibt unberührt.</p>

        <h2>8. Urheberrecht & Nutzungsrechte</h2>
        <p>
          Nach vollständiger Bezahlung erhält der Auftraggeber ein einfaches, zeitlich unbefristetes Nutzungsrecht an allen erstellten Werken für den vereinbarten Zweck. Das Urheberrecht verbleibt beim Auftragnehmer.
        </p>
        <p>
          Der Auftragnehmer ist berechtigt, erstellte Arbeiten zu Referenzzwecken im Portfolio zu zeigen.
        </p>

        <h2>9. Hosting & Verfügbarkeit</h2>
        <p>
          Sofern der Auftragnehmer Hosting erbringt, gewährleistet er eine Verfügbarkeit von 99,5 % im Jahresmittel. Ausgenommen sind geplante Wartungen sowie höhere Gewalt.
        </p>

        <h2>10. Datenschutz & Auftragsverarbeitung</h2>
        <p>
          Soweit der Auftragnehmer personenbezogene Daten im Auftrag verarbeitet, schließen die Parteien einen Auftragsverarbeitungsvertrag (AVV) gemäß Art. 28 DSGVO.
        </p>

        <h2>11. Gewährleistung</h2>
        <p>
          Mängel werden innerhalb angemessener Frist kostenlos behoben. Gewährleistungsansprüche verjähren 12 Monate nach Abnahme.
        </p>

        <h2>12. Haftung</h2>
        <p>
          Der Auftragnehmer haftet unbeschränkt bei Vorsatz, grober Fahrlässigkeit sowie für Schäden aus der Verletzung von Leben, Körper oder Gesundheit.
        </p>
        <p>
          Bei leichter Fahrlässigkeit haftet der Auftragnehmer nur bei Verletzung wesentlicher Vertragspflichten (Kardinalpflichten), begrenzt auf den vorhersehbaren, vertragstypischen Schaden — maximal in Höhe der jährlichen Nettovergütung des betreffenden Vertrags.
        </p>
        <p>
          Die Haftung für entgangenen Gewinn, mittelbare Schäden und Folgeschäden ist bei leichter Fahrlässigkeit ausgeschlossen.
        </p>

        <h2>13. Vertraulichkeit</h2>
        <p>
          Beide Parteien verpflichten sich, vertrauliche Informationen nicht an Dritte weiterzugeben. Diese Pflicht besteht auch nach Vertragsende fort.
        </p>

        <h2>14. Höhere Gewalt</h2>
        <p>
          Keine Partei haftet für die Nichterfüllung ihrer Pflichten, soweit dies auf Umstände höherer Gewalt zurückzuführen ist (z. B. Naturkatastrophen, Pandemien, Cyberangriffe, behördliche Anordnungen).
        </p>

        <h2>15. Schlussbestimmungen</h2>
        <p>
          Es gilt österreichisches Recht unter Ausschluss des UN-Kaufrechts. Gerichtsstand ist Innsbruck, sofern der Auftraggeber Unternehmer ist.
        </p>
        <p>
          Sollten einzelne Bestimmungen unwirksam sein, bleibt die Wirksamkeit der übrigen unberührt. Änderungen bedürfen der Schriftform.
        </p>

        <p className="mt-12"><Link to="/" className="link-underline">← Zurück zur Startseite</Link></p>
      </Page>
    </>
  );
}
