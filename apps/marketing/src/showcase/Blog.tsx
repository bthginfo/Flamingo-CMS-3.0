import { Link, useParams } from 'react-router-dom';
import Seo from '@/components/Seo';

export function NotFound() {
  return (
    <section className="pt-44 pb-32 container-x text-center min-h-[60vh] flex flex-col items-center justify-center">
      <Seo title="Seite nicht gefunden" noindex />
      <p className="font-mono text-sm uppercase tracking-widest text-muted">Fehler · 404</p>
      <h1 className="headline-xl mt-4 max-w-3xl">
        Diese Seite haben wir<br /><em className="italic-pop">noch nicht gebaut.</em>
      </h1>
      <p className="mt-6 text-lg text-muted max-w-xl">
        Vielleicht ist sie umgezogen oder hat nie existiert. Beides kann vorkommen.
      </p>
      <div className="mt-10 flex flex-wrap gap-3 justify-center">
        <Link to="/" className="btn-primary">Zur Startseite</Link>
        <Link to="/templates" className="btn-ghost">Templates ansehen</Link>
      </div>
    </section>
  );
}

type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readingMinutes: number;
  body: { kind: 'p' | 'h2' | 'ul'; text?: string; items?: string[] }[];
};

const POSTS: Record<string, Post> = {
  'website-in-2-3-wochen': {
    slug: 'website-in-2-3-wochen',
    title: 'Warum 2–3 Wochen die ehrliche Antwort sind',
    excerpt:
      'Wir liefern keine Sieben-Tage-Wunder. Hier ist, woraus sich der Zeitplan tatsächlich zusammensetzt – und warum das gut ist.',
    date: '2025-04-08',
    readingMinutes: 5,
    body: [
      {
        kind: 'p',
        text:
          'Vor zwei Jahren haben wir auf der Startseite "in 7 Tagen live" versprochen. Das war marketingtechnisch griffig – und in 4 von 5 Fällen falsch.',
      },
      { kind: 'h2', text: 'Was wirklich Zeit braucht' },
      {
        kind: 'ul',
        items: [
          'Onboarding-Call und Inhalts-Brief: 1–2 Tage',
          'Texte schreiben oder schärfen: 3–5 Tage',
          'Fotos auswählen oder shooten: 1–4 Tage',
          'Bauen, Feedback-Runden, Korrekturlauf: 5–7 Tage',
          'Technik, DNS, Mailadressen, Launch: 1–2 Tage',
        ],
      },
      {
        kind: 'p',
        text:
          'In Summe kommen wir auf 11–20 Werktage. Das nennen wir 2–3 Wochen. Wer Ihnen "in einer Woche live" sagt, lügt entweder oder spart drastisch an Inhalten und Feedback.',
      },
      { kind: 'h2', text: 'Was Sie davon haben' },
      {
        kind: 'p',
        text:
          'Eine Seite, die nicht nur schnell live geht, sondern auch danach hält. Texte, hinter denen Sie stehen. Fotos, die Sie nicht in einem halben Jahr austauschen müssen. Und ein Launch ohne Panik.',
      },
    ],
  },
};

export const POST_LIST = Object.values(POSTS).map((p) => ({
  slug: p.slug,
  title: p.title,
  excerpt: p.excerpt,
  date: p.date,
  readingMinutes: p.readingMinutes,
}));

export function BlogIndex() {
  return (
    <>
      <Seo
        title="Studio-Notizen · FlamingoMedia"
        description="Notizen aus dem Studio – über Templates, Tempo und Web-Handwerk."
      />
      <section className="pt-44 pb-16 container-x">
        <p className="eyebrow mb-5 reveal">Studio-Notizen</p>
        <h1 className="headline-xl max-w-3xl reveal">
          Kein Blog.<br /><em className="italic-pop">Nur, was wir denken.</em>
        </h1>
      </section>
      <section className="pb-32 container-x grid md:grid-cols-2 gap-6">
        {POST_LIST.map((p) => (
          <Link
            key={p.slug}
            to={`/studio/notiz/${p.slug}`}
            className="block rounded-2xl border border-line bg-white p-8 hover-lift reveal"
          >
            <p className="font-mono text-xs uppercase tracking-widest text-muted">
              {new Date(p.date).toLocaleDateString('de-DE')} · {p.readingMinutes} min
            </p>
            <p className="font-display text-2xl mt-3">{p.title}</p>
            <p className="text-base text-muted mt-3">{p.excerpt}</p>
            <p className="text-sm text-brand mt-5">Lesen →</p>
          </Link>
        ))}
      </section>
    </>
  );
}

export function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const p = slug ? POSTS[slug] : undefined;
  if (!p) {
    return (
      <section className="pt-44 pb-32 container-x">
        <Seo title="Notiz nicht gefunden" noindex />
        <p className="eyebrow mb-4">404 · Notiz</p>
        <h1 className="headline-xl">Diese Notiz haben wir nicht.</h1>
        <p className="mt-6">
          <Link to="/studio/notizen" className="underline">Zurück zur Übersicht</Link>
        </p>
      </section>
    );
  }
  return (
    <>
      <Seo title={p.title} description={p.excerpt} />
      <article className="pt-40 pb-24 container-x max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-widest text-muted reveal">
          {new Date(p.date).toLocaleDateString('de-DE')} · {p.readingMinutes} min · Studio-Notiz
        </p>
        <h1 className="headline-xl mt-5 reveal">{p.title}</h1>
        <p className="mt-6 text-xl text-muted reveal">{p.excerpt}</p>
        <div className="prose-lite mt-12 space-y-6">
          {p.body.map((b, i) => {
            if (b.kind === 'h2') return <h2 key={i} className="font-display text-3xl mt-12 mb-2">{b.text}</h2>;
            if (b.kind === 'ul') return (
              <ul key={i} className="space-y-2 list-disc pl-6">
                {b.items?.map((it, j) => <li key={j}>{it}</li>)}
              </ul>
            );
            return <p key={i} className="text-lg leading-relaxed">{b.text}</p>;
          })}
        </div>
        <div className="mt-16 pt-8 border-t border-line">
          <Link to="/studio/notizen" className="text-sm hover:text-brand">← Alle Notizen</Link>
        </div>
      </article>
    </>
  );
}
