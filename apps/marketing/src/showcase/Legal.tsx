import { Link } from 'react-router-dom';
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
        <p className="text-sm text-muted">
          Hinweis: Dies ist eine Demo-Site. Die nachfolgenden Angaben sind Platzhalter und werden vor Live-Schaltung
          durch echte Daten ersetzt.
        </p>

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
        <p className="text-sm text-muted">
          Hinweis: Dies ist eine Demo-Site. Die folgenden Angaben sind Platzhalter und werden vor Live-Schaltung
          durch eine an Ihren Betrieb angepasste Datenschutzerklärung ersetzt.
        </p>

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
          Google in der EU/USA übertragen. Demobilder werden teilweise von Unsplash geladen.
        </p>

        <h2>6. Ihre Rechte</h2>
        <p>
          Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit,
          Widerruf erteilter Einwilligungen und Beschwerde bei der Aufsichtsbehörde
          (in Österreich: Datenschutzbehörde, dsb.gv.at).
        </p>

        <h2>7. Aufbewahrung</h2>
        <p>
          Wir speichern Ihre Daten nur so lange, wie es für die Bearbeitung der Anfrage und gesetzliche
          Aufbewahrungspflichten erforderlich ist.
        </p>

        <p className="mt-12"><Link to="/" className="link-underline">← Zurück zur Startseite</Link></p>
      </Page>
    </>
  );
}
