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

        <h2>5a. Instagram-Integration (optional, nur nach Verbindung durch den CMS-Kunden)</h2>
        <p>
          Kund:innen unseres CMS können optional ihr Instagram-Business- oder -Creator-Konto mit ihrer von uns betriebenen
          Website verknüpfen, um öffentliche Beiträge automatisch einzubetten („Instagram-Feed-Funktion"). Verbindet
          eine Kund:in ihr Konto, wirken folgende Verarbeitungen:
        </p>
        <ul>
          <li>
            <strong>OAuth-Authentifizierung über Meta Platforms Ireland Ltd.:</strong> Beim Klick auf „Instagram verbinden"
            wird die Kund:in auf Server der Meta Platforms Ireland Ltd. (4 Grand Canal Square, Grand Canal Harbour,
            Dublin 2, Irland) weitergeleitet. Dort erfolgt die Anmeldung gegenüber Instagram. Bei erfolgreicher Anmeldung
            sendet Meta uns ein langlebiges Zugriffstoken (Long-Lived Access Token, gültig 60 Tage, automatisch erneuert).
          </li>
          <li>
            <strong>Abruf öffentlicher Beiträge:</strong> Mit dem Token rufen wir periodisch (typisch alle 60 Minuten)
            über die offizielle Instagram Graph API die öffentlich sichtbaren Beiträge des verbundenen Kontos ab
            (Medien-URL, Caption, Permalink, Zeitstempel, Medientyp). Wir speichern diese Beiträge in unserer Datenbank
            (Hosting in der EU), um die Anzahl der API-Aufrufe zu minimieren und die Ausspielung auf der Kund:innen-Website
            zu beschleunigen.
          </li>
          <li>
            <strong>Anzeige auf der Kund:innen-Website:</strong> Eingebettete Beiträge werden Besucher:innen der Website
            als Bild- oder Video-Vorschau angezeigt. Der eigentliche Foto-/Video-Inhalt wird vom Instagram-CDN
            (Server von Meta in der EU/USA) ausgeliefert. Damit erfährt Meta die IP-Adresse der Website-Besucher:innen.
          </li>
          <li>
            <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse des Website-Betreibers
            an der einheitlichen Darstellung seiner Social-Media-Inhalte). Endkund:innen können der Anzeige im
            Cookie-Banner widersprechen — in diesem Fall werden Inhalte des Instagram-CDN nicht nachgeladen.
          </li>
          <li>
            <strong>Drittlandtransfer:</strong> Die Übermittlung an Meta in die USA erfolgt auf Basis der
            EU-Standardvertragsklauseln (Art. 46 Abs. 2 lit. c DSGVO) sowie auf Basis des EU-US Data Privacy Frameworks
            (Meta Platforms, Inc. ist DPF-zertifiziert).
          </li>
          <li>
            <strong>Speicherdauer:</strong> Beiträge werden gelöscht, sobald die CMS-Kund:in die Instagram-Verbindung
            trennt oder die Funktion deaktiviert. Bei Widerruf durch die Endkund:in im Instagram-Konto
            („App-Berechtigungen entfernen") werden Token und gecachte Beiträge automatisch innerhalb von 24 Stunden
            aus unseren Systemen gelöscht.
          </li>
          <li>
            <strong>Datenlöschung anfordern:</strong> Endnutzer:innen können die Löschung ihrer durch unsere App
            verarbeiteten Instagram-Daten jederzeit anfordern. Siehe dazu unsere{' '}
            <Link to="/datenloeschung" className="link-underline">Anleitung zur Datenlöschung</Link>.
          </li>
        </ul>
        <p>
          Weitere Informationen zur Datenverarbeitung durch Meta selbst:{' '}
          <a href="https://privacycenter.instagram.com/policy" target="_blank" rel="noreferrer noopener">privacycenter.instagram.com/policy</a>.
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

/**
 * PlatformTerms — Nutzungsbedingungen für die FlamingoMedia-CMS-Plattform.
 * Separat von den klassischen Auftrags-AGB (`Terms`), weil diese URL
 * öffentlich für Drittanbieter-Integrationen (Meta App Review, Stripe,
 * etc.) hinterlegt wird.
 */
export function PlatformTerms() {
  return (
    <>
      <Seo
        title="Nutzungsbedingungen FlamingoMedia-Plattform"
        description="Nutzungsbedingungen für die FlamingoMedia-CMS-Plattform und ihre Integrationen (Instagram, Google, Stripe u. a.)."
      />
      <Page title="Nutzungsbedingungen der FlamingoMedia-Plattform">
        <p><strong>Stand: Juni 2026</strong></p>

        <h2>1. Geltungsbereich</h2>
        <p>
          Diese Nutzungsbedingungen gelten für die Nutzung der von {STUDIO.legalOwner}
          ({STUDIO.street}, {STUDIO.city}, {STUDIO.country}) betriebenen CMS-Plattform „FlamingoMedia"
          (nachfolgend „Plattform") sowie der angebundenen Integrationen und APIs. Für klassische
          Dienstleistungs- und Werkverträge mit Endkund:innen gelten zusätzlich die{' '}
          <Link to="/agb" className="link-underline">Allgemeinen Geschäftsbedingungen</Link>.
        </p>

        <h2>2. Leistungsbeschreibung</h2>
        <p>Die Plattform stellt Kund:innen folgende Funktionen zur Verfügung:</p>
        <ul>
          <li>Verwaltung von Inhalten, Designs und Konfigurationen ihrer Website über ein Web-Interface</li>
          <li>Auslieferung der konfigurierten Website über unsere Hosting-Infrastruktur</li>
          <li>Optionale Anbindung an Drittsysteme (z. B. Instagram, Google Analytics, Zahlungs-Provider)</li>
          <li>Automatisierte Demo-Inhalte, KI-gestützte Vorschläge und Vorlagen-Bibliotheken</li>
        </ul>

        <h2>3. Registrierung und Zugang</h2>
        <p>
          Der Zugang zur Plattform erfolgt nach Vertragsschluss mit dem Auftragnehmer. Zugangsdaten sind vertraulich
          zu behandeln und dürfen nicht an Dritte weitergegeben werden. Bei Verdacht auf Missbrauch ist der Auftragnehmer
          unverzüglich zu informieren.
        </p>

        <h2>4. Nutzerinhalte und Verantwortung</h2>
        <p>
          Die Kund:in ist allein verantwortlich für Inhalte (Texte, Bilder, Videos, Marken, Daten), die sie über die
          Plattform hochlädt oder verlinkt. Sie versichert, dass sie über alle erforderlichen Rechte verfügt und keine
          Rechte Dritter (insbesondere Urheber-, Marken-, Persönlichkeitsrechte) verletzt.
        </p>
        <p>
          Die Plattform überprüft Inhalte nicht aktiv. Bei Hinweisen auf rechtswidrige Inhalte sind wir berechtigt,
          den Zugang zu sperren oder Inhalte zu entfernen.
        </p>

        <h2>5. Verbotene Nutzung</h2>
        <p>Die Plattform darf insbesondere nicht genutzt werden zur</p>
        <ul>
          <li>Verbreitung rechtswidriger, jugendgefährdender, gewalt­verherrlichender oder diskriminierender Inhalte;</li>
          <li>Verbreitung von Spam, Phishing-Inhalten oder Schadsoftware;</li>
          <li>automatisierten Auswertung der Plattform-Infrastruktur (Scraping, Penetrationstests ohne Autorisierung);</li>
          <li>Umgehung technischer Beschränkungen (Rate-Limits, Quotas, Lizenz-Prüfungen).</li>
        </ul>

        <h2>6. Drittanbieter-Integrationen</h2>
        <p>
          Die Plattform integriert ausgewählte Dienste Dritter (z. B. Meta Platforms Ireland Ltd. für die
          Instagram-Anbindung, Google LLC für Schriftarten und Karten, Stripe Payments Europe Ltd. für Zahlungen).
          Für die Nutzung dieser Drittdienste gelten zusätzlich deren eigene Nutzungsbedingungen und
          Datenschutzhinweise. Die Verantwortung für die korrekte Konfiguration einer Drittanbieter-Verbindung
          (z. B. das Verbinden eines Instagram-Business-Kontos) liegt bei der Kund:in.
        </p>

        <h2>7. Verfügbarkeit</h2>
        <p>
          Wir bemühen uns um eine möglichst hohe Verfügbarkeit der Plattform (Ziel: 99,5 % im Jahresmittel). Geplante
          Wartungsfenster werden, wenn möglich, vorab angekündigt. Ein Anspruch auf permanente, ununterbrochene
          Verfügbarkeit besteht nicht.
        </p>

        <h2>8. Daten und Backups</h2>
        <p>
          Wir sichern Kundendaten regelmäßig. Kund:innen sind dennoch angehalten, eigene Sicherungen ihrer Inhalte
          vorzuhalten, soweit dies für sie betriebswirtschaftlich relevant ist. Die Datenverarbeitung erfolgt gemäß
          unserer <Link to="/datenschutz" className="link-underline">Datenschutzerklärung</Link>.
        </p>

        <h2>9. Geistiges Eigentum</h2>
        <p>
          Die Plattform-Software, deren Quellcode, Design und Marken sind und bleiben Eigentum des Auftragnehmers
          bzw. seiner Lizenzgeber. Die Kund:in erhält ausschließlich ein nicht-übertragbares, zeitlich an den Vertrag
          gebundenes Nutzungsrecht für die Dauer ihres Abonnements.
        </p>

        <h2>10. Haftungsbeschränkung</h2>
        <p>
          Der Auftragnehmer haftet unbeschränkt nur bei Vorsatz, grober Fahrlässigkeit und für Schäden aus der
          Verletzung von Leben, Körper oder Gesundheit. Bei einfacher Fahrlässigkeit ist die Haftung auf die
          Verletzung wesentlicher Vertragspflichten und auf den vorhersehbaren, vertragstypischen Schaden begrenzt,
          maximal in Höhe der jährlichen Nettovergütung des betreffenden Vertrags. Eine Haftung für entgangenen Gewinn,
          mittelbare Schäden und Folgeschäden ist bei einfacher Fahrlässigkeit ausgeschlossen.
        </p>

        <h2>11. Sperrung und Kündigung</h2>
        <p>
          Bei Verstößen gegen diese Nutzungsbedingungen sind wir berechtigt, den Zugang zur Plattform vorübergehend
          oder dauerhaft zu sperren. Das Recht zur außerordentlichen Kündigung aus wichtigem Grund bleibt unberührt.
        </p>

        <h2>12. Änderungen dieser Bedingungen</h2>
        <p>
          Änderungen dieser Nutzungsbedingungen werden Kund:innen mindestens 30 Tage vor Inkrafttreten in Textform
          (E-Mail) mitgeteilt. Erfolgt innerhalb dieser Frist kein Widerspruch, gelten die geänderten Bedingungen
          als angenommen.
        </p>

        <h2>13. Schlussbestimmungen</h2>
        <p>
          Es gilt österreichisches Recht unter Ausschluss des UN-Kaufrechts. Gerichtsstand für alle Streitigkeiten
          aus oder im Zusammenhang mit diesen Bedingungen ist, soweit der Auftraggeber Unternehmer ist, Innsbruck.
        </p>

        <p className="mt-12">
          Siehe auch:{' '}
          <Link to="/datenschutz" className="link-underline">Datenschutz</Link>
          {' · '}
          <Link to="/datenloeschung" className="link-underline">Datenlöschung anfordern</Link>
          {' · '}
          <Link to="/impressum" className="link-underline">Impressum</Link>
        </p>
        <p className="mt-6"><Link to="/" className="link-underline">← Zurück zur Startseite</Link></p>
      </Page>
    </>
  );
}

/**
 * DataDeletion — menschen­lesbare Anleitung zur Datenlöschung
 * (Pflichtfeld für Meta App Review: „Data Deletion URL").
 */
export function DataDeletion() {
  return (
    <>
      <Seo
        title="Anleitung zur Datenlöschung"
        description="So lassen Sie Ihre durch FlamingoMedia verarbeiteten Daten — inklusive Instagram-Integration — löschen."
      />
      <Page title="Datenlöschung anfordern">
        <p>
          Wenn Sie möchten, dass wir die über Sie gespeicherten Daten löschen, finden Sie hier die passenden Wege.
          Wir bestätigen jede Löschung innerhalb von <strong>30 Tagen</strong> per E-Mail an die von Ihnen genannte
          Kontaktadresse.
        </p>

        <h2>A) Daten aus der Instagram-Integration löschen</h2>
        <p>
          Wenn Sie die Instagram-Verbindung mit einer von uns betreuten Website hergestellt haben, speichern wir
          ein Zugriffstoken sowie zwischengespeicherte Beiträge Ihres Instagram-Business-Kontos. Es gibt zwei Wege,
          diese Daten löschen zu lassen:
        </p>

        <h3 style={{ fontSize: '1.1em', marginTop: '1.5rem', marginBottom: '0.5rem', fontWeight: 600 }}>
          Weg 1 — direkt über Instagram (empfohlen)
        </h3>
        <ol>
          <li>Öffnen Sie die <strong>Instagram-App</strong> oder <a href="https://www.instagram.com/accounts/manage_access/" target="_blank" rel="noreferrer noopener">instagram.com/accounts/manage_access</a>.</li>
          <li>Gehen Sie zu <em>Einstellungen → Apps und Websites</em>.</li>
          <li>Suchen Sie den Eintrag <strong>„FlamingoMedia CMS"</strong> in der Liste der aktiven Apps.</li>
          <li>Klicken Sie auf <em>Entfernen</em>.</li>
        </ol>
        <p>
          Sobald die Berechtigung entzogen ist, benachrichtigt Instagram unsere Systeme automatisch. Wir löschen
          das Zugriffstoken und alle zwischengespeicherten Beiträge Ihres Kontos innerhalb von <strong>24 Stunden</strong>
          und entfernen den Instagram-Feed von Ihrer Website.
        </p>

        <h3 style={{ fontSize: '1.1em', marginTop: '1.5rem', marginBottom: '0.5rem', fontWeight: 600 }}>
          Weg 2 — per E-Mail an uns
        </h3>
        <p>
          Schreiben Sie an <a href={`mailto:${STUDIO.email}?subject=Datenl%C3%B6schung%20Instagram-Integration`}>{STUDIO.email}</a> mit folgendem Inhalt:
        </p>
        <ul>
          <li>Ihr Instagram-Handle (z. B. <code>@meinbetrieb</code>)</li>
          <li>Die Domain Ihrer Website (z. B. <code>meinbetrieb.de</code>)</li>
          <li>Bestätigung, dass Sie Kontoinhaber:in sind</li>
        </ul>
        <p>
          Wir löschen Ihre Instagram-Daten innerhalb von <strong>7 Werktagen</strong> manuell und bestätigen die
          Löschung per Antwortmail.
        </p>

        <h2>B) Kundendaten und CMS-Inhalte löschen</h2>
        <p>
          Möchten Sie Ihren gesamten Account inklusive aller Inhalte, Konfigurationen und Backups gelöscht haben,
          schreiben Sie bitte ebenfalls an{' '}
          <a href={`mailto:${STUDIO.email}?subject=Account-L%C3%B6schung`}>{STUDIO.email}</a>{' '}
          mit dem Betreff <em>„Account-Löschung"</em>. Beachten Sie, dass gesetzliche Aufbewahrungspflichten
          (insbesondere steuerrechtlich, 7 Jahre) der vollständigen Löschung entgegenstehen können — in diesem Fall
          werden die betroffenen Datensätze gesperrt und nach Ablauf der Frist endgültig gelöscht.
        </p>

        <h2>C) Daten aus dem Kontaktformular oder Newsletter</h2>
        <p>
          Wenn Sie uns über das Kontaktformular geschrieben oder den Newsletter abonniert haben, genügt eine
          formlose Mail an{' '}
          <a href={`mailto:${STUDIO.email}?subject=Datenl%C3%B6schung`}>{STUDIO.email}</a>. Wir löschen Ihre
          Kontaktdaten innerhalb von 7 Werktagen.
        </p>

        <h2>D) Status einer Löschanfrage prüfen</h2>
        <p>
          Wenn Sie eine Löschanfrage über die Instagram-Plattform gestellt haben, erhalten Sie eine
          Bestätigungs-ID. Den Status Ihrer Anfrage können Sie jederzeit per E-Mail bei uns erfragen — geben Sie
          dabei die Bestätigungs-ID an, die Ihnen Instagram angezeigt hat.
        </p>

        <h2>E) Beschwerderecht</h2>
        <p>
          Unabhängig von einer Löschanfrage haben Sie jederzeit das Recht, sich bei einer Datenschutz-Aufsichtsbehörde
          zu beschweren — z. B. bei der Österreichischen Datenschutzbehörde,{' '}
          <a href="https://www.dsb.gv.at" target="_blank" rel="noreferrer noopener">dsb.gv.at</a>.
        </p>

        <p className="mt-12">
          Weitere Informationen:{' '}
          <Link to="/datenschutz" className="link-underline">vollständige Datenschutzerklärung</Link>
          {' · '}
          <Link to="/nutzungsbedingungen" className="link-underline">Nutzungsbedingungen</Link>
        </p>
        <p className="mt-6"><Link to="/" className="link-underline">← Zurück zur Startseite</Link></p>
      </Page>
    </>
  );
}
