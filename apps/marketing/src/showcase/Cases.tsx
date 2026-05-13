import { Link, useParams } from 'react-router-dom';
import Seo from '@/components/Seo';

type Case = {
  slug: string;
  branch: string;
  client: string;
  location: string;
  task: string;
  approach: string[];
  result: { kpi: string; label: string }[];
  story: string;
  before: string;
  after: string;
  testimonial: { quote: string; person: string; role: string };
  duration: string;
  scope: string[];
};

const CASES: Record<string, Case> = {
  'restaurant-trattoria': {
    slug: 'restaurant-trattoria',
    branch: 'Gastronomie',
    client: 'Trattoria Lucia (Demo-Case)',
    location: 'Innsbruck',
    task:
      'Eine kleine, familiengeführte Trattoria mit zwei Tischreihen und einer alten WordPress-Seite, die auf dem Handy unbrauchbar war. Reservierungen liefen nur per Telefon, die Speisekarte war ein PDF von 2019.',
    approach: [
      'Multi-page-Template (Klassisch) mit Fokus auf Speisekarte und Reservierung',
      'Speisekarte vom Wirt selbst pflegbar im Admin – kein PDF mehr',
      'Foto-Add-on: ein Vormittag Shooting für Hero, Speisekarten-Bilder und Team',
      'Reservierungs-Funnel direkt aus dem Hero, mit Telefon-Fallback',
    ],
    result: [
      { kpi: '+38 %', label: 'mehr Online-Reservierungen pro Woche' },
      { kpi: '< 1.5 s', label: 'Largest Contentful Paint mobil' },
      { kpi: '0 €', label: 'laufende WordPress-Plugins' },
    ],
    story:
      'Die alte Seite war ein Klassiker: WordPress, drei verschachtelte Plugins für die Speisekarte, ein veraltetes Theme. Wir haben alles auf eine ruhige, mehrseitige Klassik-Variante umgestellt – Editorial-Look, italic-pop Headlines, eine echte digitale Speisekarte. Die Inhaberin pflegt sie selbst im Admin.',
    before:
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
    after:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    testimonial: {
      quote:
        'Wir wollten eine Karte, die wir selbst pflegen können – und eine Seite, für die wir uns nicht schämen. Beides haben wir.',
      person: 'Lucia M.',
      role: 'Inhaberin, Trattoria Lucia',
    },
    duration: 'ca. 2 Wochen',
    scope: ['Klassisches Template', 'Speisekarten-CMS', 'Foto-Add-on', 'Hosting & Pflege'],
  },
  'handwerk-mayer': {
    slug: 'handwerk-mayer',
    branch: 'Handwerk',
    client: 'Mayer Bau & Sanierung (Demo-Case)',
    location: 'Ingolstadt',
    task:
      'Familienbetrieb in dritter Generation mit voller Auftragslage – aber ohne Web-Präsenz, die Anfragen filtert. Anrufer fragten alles, vom Wasserhahn bis zum Komplett-Umbau, was massiv Zeit kostete.',
    approach: [
      'Bold-Variante mit großer Typografie und klaren Service-Karten',
      'Vorgelagerter Anfrage-Funnel: Branche → Umfang → Termin',
      'Referenz-Galerie als Masonry, sortiert nach Gewerk',
      'Notfall-Telefonnummer als sticky Element auf Mobile',
    ],
    result: [
      { kpi: '–60 %', label: 'unpassende Telefonate' },
      { kpi: '+22', label: 'qualifizierte Anfragen pro Monat' },
      { kpi: '4.9/5', label: 'Sternewert nach 90 Tagen' },
    ],
    story:
      'Das Ziel war nicht „mehr Anfragen“, sondern „die richtigen“. Der Funnel auf der Startseite filtert vorab, die Referenz-Galerie liefert Vertrauen, und der Notfall-Button auf dem Handy fängt dringende Fälle direkt ab. Die Bold-Variante passt zur Tonalität des Betriebs – ehrlich, direkt, ohne Schnörkel.',
    before:
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
    after:
      'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=1200&q=80',
    testimonial: {
      quote:
        'Die Seite filtert für uns vor. Wir sprechen mit Leuten, die wirklich passen – das war vorher anders.',
      person: 'Andreas Mayer',
      role: 'Geschäftsführer, Mayer Bau',
    },
    duration: 'ca. 3 Wochen',
    scope: ['Bold-Template', 'Anfrage-Funnel', 'Referenz-CMS', 'Hosting & Pflege'],
  },
};

export const CASE_LIST = Object.values(CASES).map((c) => ({
  slug: c.slug,
  branch: c.branch,
  client: c.client,
  location: c.location,
  cover: c.after,
}));

export function CaseStudy() {
  const { slug } = useParams<{ slug: string }>();
  const c = slug ? CASES[slug] : undefined;
  if (!c) {
    return (
      <section className="pt-44 pb-32 container-x">
        <Seo title="Case nicht gefunden" noindex />
        <p className="eyebrow mb-4">404 · Case</p>
        <h1 className="headline-xl">Diese Case-Study haben wir nicht.</h1>
        <p className="mt-6 text-lg text-muted">
          Vielleicht meinten Sie die <Link to="/studio/cases" className="underline">Übersicht</Link>?
        </p>
      </section>
    );
  }
  return (
    <>
      <Seo
        title={`Case · ${c.client}`}
        description={`${c.branch} · ${c.location} – ${c.task.slice(0, 140)}`}
      />
      <section className="pt-40 pb-16 container-x">
        <p className="font-mono text-xs uppercase tracking-widest text-muted reveal">
          Case Study · {c.branch} · {c.location}
        </p>
        <h1 className="headline-xl mt-5 max-w-4xl reveal">{c.client}</h1>
        <p className="mt-6 text-lg md:text-xl text-muted max-w-3xl reveal">{c.task}</p>
      </section>

      <section className="pb-16 container-x">
        <div className="grid md:grid-cols-2 gap-4">
          <figure className="reveal">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 relative">
              <img src={c.before} alt="Vorher" className="w-full h-full object-cover" loading="lazy" />
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 text-xs font-mono uppercase tracking-widest">
                Vorher
              </span>
            </div>
          </figure>
          <figure className="reveal">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 relative">
              <img src={c.after} alt="Nachher" className="w-full h-full object-cover" loading="lazy" />
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-brand text-white text-xs font-mono uppercase tracking-widest">
                Nachher
              </span>
            </div>
          </figure>
        </div>
      </section>

      <section className="py-20 container-x grid md:grid-cols-3 gap-10">
        <div className="md:col-span-2 reveal">
          <p className="eyebrow mb-3">Aufgabe & Vorgehen</p>
          <p className="text-lg leading-relaxed mb-8">{c.story}</p>
          <ul className="space-y-3">
            {c.approach.map((a, i) => (
              <li key={i} className="flex gap-3 text-base">
                <span className="text-brand mt-1.5">▸</span>
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </div>
        <aside className="bg-[#fafaf7] rounded-2xl p-6 h-fit border border-line reveal">
          <p className="text-xs uppercase tracking-widest text-muted mb-4">Auf einen Blick</p>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-muted">Branche</dt>
              <dd className="font-medium">{c.branch}</dd>
            </div>
            <div>
              <dt className="text-muted">Ort</dt>
              <dd className="font-medium">{c.location}</dd>
            </div>
            <div>
              <dt className="text-muted">Dauer</dt>
              <dd className="font-medium">{c.duration}</dd>
            </div>
            <div>
              <dt className="text-muted mb-1">Umfang</dt>
              <dd className="flex flex-wrap gap-1.5">
                {c.scope.map((s, i) => (
                  <span key={i} className="text-[11px] bg-white border border-line rounded-full px-2.5 py-1">
                    {s}
                  </span>
                ))}
              </dd>
            </div>
          </dl>
        </aside>
      </section>

      <section className="py-16 bg-brand text-white">
        <div className="container-x">
          <p className="eyebrow text-white/60 mb-6">Ergebnis</p>
          <div className="grid md:grid-cols-3 gap-8">
            {c.result.map((r, i) => (
              <div key={i} className="reveal">
                <p className="num-display text-5xl md:text-6xl">{r.kpi}</p>
                <p className="mt-3 text-sm uppercase tracking-widest text-white/70">{r.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 container-x">
        <blockquote className="max-w-3xl reveal">
          <p className="font-display text-3xl md:text-4xl leading-tight">"{c.testimonial.quote}"</p>
          <footer className="mt-6 text-sm text-muted">
            — {c.testimonial.person}, {c.testimonial.role}
          </footer>
        </blockquote>
      </section>

      <section className="py-16 container-x border-t border-line">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <Link to="/studio/cases" className="text-sm hover:text-brand">← Alle Cases</Link>
          <Link to="/kontakt" className="btn-primary">
            Eigenes Projekt anfragen <span aria-hidden>→</span>
          </Link>
        </div>
      </section>
    </>
  );
}

export function CasesIndex() {
  return (
    <>
      <Seo
        title="Cases · FlamingoMedia"
        description="Auswahl an Demo-Cases: Wie FlamingoMedia kleinere Marken ins Web bringt."
      />
      <section className="pt-44 pb-16 container-x">
        <p className="eyebrow mb-5 reveal">Cases · Auswahl</p>
        <h1 className="headline-xl max-w-4xl reveal">
          Zwei kleine Geschichten,<br />
          <em className="italic-pop">die für sich sprechen.</em>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-muted max-w-2xl reveal">
          Zwei beispielhafte Demo-Projekte, die zeigen, wie wir arbeiten – Aufgabe, Vorgehen, Ergebnis.
        </p>
      </section>
      <section className="pb-32 container-x grid md:grid-cols-2 gap-6">
        {CASE_LIST.map((c) => (
          <Link
            key={c.slug}
            to={`/studio/case/${c.slug}`}
            className="group block rounded-3xl overflow-hidden bg-white border border-line hover-lift reveal"
          >
            <div className="aspect-[4/3] overflow-hidden img-zoom">
              <img src={c.cover} alt={c.client} className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="p-6">
              <p className="font-mono text-xs uppercase tracking-widest text-muted">
                {c.branch} · {c.location}
              </p>
              <p className="font-display text-2xl mt-2">{c.client}</p>
              <p className="text-sm text-brand mt-3 group-hover:translate-x-1 transition">
                Case ansehen →
              </p>
            </div>
          </Link>
        ))}
      </section>
    </>
  );
}
