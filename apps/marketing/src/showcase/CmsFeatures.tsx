'use client';

import { useState, useRef, useEffect } from 'react';
import Seo from '@/components/Seo';

const DEMO_BASE = 'https://www.flamingomedia.online';

const FEATURES = [
  {
    badge: 'Seiten & Sektionen',
    title: 'Drag & Drop\nSeiten-Builder',
    description: 'Erstelle beliebig viele Seiten mit vorgefertigten Sektionen. Per Drag & Drop sortieren, ein- und ausblenden — ohne eine Zeile Code.',
    highlights: ['Über 30 Sektionstypen pro Branche', 'Drag & Drop Reihenfolge', 'Ein-/Ausblenden per Klick', 'Live-Vorschau im Editor'],
    demoUrl: `${DEMO_BASE}/demo/admin/pages`,
  },
  {
    badge: 'Design-Kontrolle',
    title: 'Drei Stile.\nEin Klick.',
    description: 'Wechsle den gesamten Look deiner Website zwischen Classic, Modern und Bold — oder steuere den Stil pro Sektion im Individuell-Modus.',
    highlights: ['Classic: zeitlos & warm', 'Modern: clean & minimal', 'Bold: dynamisch & markant', 'Individuell: pro Sektion steuerbar'],
    demoUrl: `${DEMO_BASE}/demo/admin/brand`,
  },
  {
    badge: 'Mediathek',
    title: 'Bilder hochladen.\nOptimiert serviert.',
    description: 'Lade Bilder direkt im Editor hoch. Automatische Komprimierung, WebP-Konvertierung und CDN-Delivery. Keine externen Tools nötig.',
    highlights: ['Drag & Drop Upload', 'Auto-Komprimierung & WebP', 'CDN mit globalem Edge-Cache', 'Bulk-Upload für Galerien'],
    demoUrl: `${DEMO_BASE}/demo/admin/media`,
  },
  {
    badge: 'SEO & Meta',
    title: 'SEO an\nBord.',
    description: 'Meta-Titel, Beschreibungen, Open Graph, Canonical URLs und Robots-Einstellungen — direkt im CMS. Ohne Plugin, ohne WordPress.',
    highlights: ['Meta-Tags pro Seite', 'Open Graph & Social Preview', 'Sitemap & Robots automatisch', 'Structured Data (JSON-LD)'],
    demoUrl: `${DEMO_BASE}/demo/admin/seo`,
  },
  {
    badge: 'Navigation & Footer',
    title: 'Navigation.\nZentral verwaltet.',
    description: 'Menü-Items, Call-to-Action-Button, Footer-Spalten und Social-Links — alles an einem Ort konfigurierbar.',
    highlights: ['Drag & Drop Menü-Sortierung', 'CTA-Button im Header', 'Multi-Column Footer', 'Social Media Icons'],
    demoUrl: `${DEMO_BASE}/demo/admin/navigation`,
  },
  {
    badge: 'Veröffentlichung',
    title: 'Ein Klick.\nLive.',
    description: 'Arbeite im Draft-Modus und veröffentliche wenn du bereit bist. Atomares Publishing — deine Website ist nie „halb fertig".',
    highlights: ['Draft vs. Live Trennung', 'Multi-Page Publish', 'Publish-History mit Timestamps', 'Rollback jederzeit möglich'],
    demoUrl: `${DEMO_BASE}/demo/admin`,
  },
];

function DesktopMockup({ demoUrl }: { demoUrl: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [mount, setMount] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || mount) return;
    const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setMount(true); obs.disconnect(); } }, { rootMargin: '200px' });
    obs.observe(el);
    return () => obs.disconnect();
  }, [mount]);

  return (
    <div ref={wrapRef} className="rounded-2xl overflow-hidden border border-slate-200 shadow-2xl bg-white">
      <div className="bg-slate-900 px-4 py-2.5 flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        <span className="ml-3 text-[10px] text-slate-500 font-mono">flamingo-cms.de/admin</span>
      </div>
      <div className="relative w-full h-[360px] overflow-hidden bg-slate-50">
        {mount ? (
          <iframe
            src={demoUrl}
            className="absolute top-0 left-0 w-[1280px] h-[800px] origin-top-left border-0"
            style={{ transform: 'scale(0.47)' }}
            loading="lazy"
            title="CMS Demo"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-slate-300 text-sm">Laden…</div>
        )}
      </div>
    </div>
  );
}

function FeatureBlock({ feature, index }: { feature: typeof FEATURES[0]; index: number }) {
  const isReversed = index % 2 === 1;

  return (
    <section className="py-20 md:py-28">
      <div className={`container-x grid lg:grid-cols-2 gap-12 lg:gap-20 items-center ${isReversed ? 'lg:grid-flow-dense' : ''}`}>
        {/* Text side */}
        <div className={`reveal ${isReversed ? 'lg:col-start-2' : ''}`}>
          <span className="inline-flex px-3 py-1 rounded-full bg-[var(--accent-color)]/10 text-[var(--accent-color)] text-xs font-semibold tracking-wide uppercase mb-4">
            {feature.badge}
          </span>
          <h2 className="headline-md whitespace-pre-line">{feature.title}</h2>
          <p className="mt-5 text-lg text-muted leading-relaxed">{feature.description}</p>
          <ul className="mt-8 space-y-3">
            {feature.highlights.map((h, i) => (
              <li key={i} className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-emerald-600"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
                <span className="text-sm text-slate-700">{h}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Mockup side */}
        <div className={`reveal ${isReversed ? 'lg:col-start-1' : ''}`}>
          <div className="relative">
            <DesktopMockup demoUrl={feature.demoUrl} />
            <div className="absolute -inset-6 -z-10 bg-gradient-to-br from-[var(--accent-color)]/20 to-transparent rounded-3xl blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function CmsFeaturesPage() {
  return (
    <>
      <Seo title="CMS-Funktionen · Flamingo CMS" description="Alle Funktionen des Flamingo CMS im Überblick: Seiten-Builder, Design-Stile, Mediathek, SEO, Navigation und Ein-Klick-Publishing." />

      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-white" />
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(148 163 184 / 0.3) 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="container-x relative text-center max-w-4xl mx-auto reveal">
          <span className="inline-flex px-4 py-1.5 rounded-full bg-brand/10 text-brand text-xs font-bold uppercase tracking-wider mb-6">
            CMS-Funktionen
          </span>
          <h1 className="headline-xl">
            Alles was du brauchst.<br />
            <em className="italic-pop">Nichts was du nicht brauchst.</em>
          </h1>
          <p className="mt-6 text-xl text-muted max-w-2xl mx-auto leading-relaxed">
            Flamingo CMS gibt dir volle Kontrolle über deine Website — mit einer Oberfläche,
            die sich anfühlt wie eine moderne App. Kein Bloat, keine Plugins, kein Frust.
          </p>
          <div className="flex gap-4 justify-center mt-10">
            <a href={`${DEMO_BASE}/demo/admin`} target="_blank" rel="noopener noreferrer" className="btn-primary">
              Demo testen →
            </a>
            <a href="/kontakt" className="btn-ghost">
              Beratungsgespräch
            </a>
          </div>
        </div>
      </section>

      {/* Feature blocks */}
      {FEATURES.map((feature, i) => (
        <FeatureBlock key={feature.badge} feature={feature} index={i} />
      ))}

      {/* CTA Section */}
      <section className="py-24 md:py-32 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(99,102,241,0.3) 0%, transparent 50%)' }} />
        <div className="container-x text-center relative reveal">
          <h2 className="headline-md text-white">Bereit für ein CMS,<br />das <em className="italic-pop text-[var(--accent-color)]">mitdenkt</em>?</h2>
          <p className="mt-6 text-lg text-slate-300 max-w-xl mx-auto">
            Teste Flamingo CMS kostenlos in der Demo. Keine Registrierung, kein Risiko.
          </p>
          <div className="flex gap-4 justify-center mt-10">
            <a href={`${DEMO_BASE}/demo/admin`} target="_blank" rel="noopener noreferrer" className="px-8 py-4 rounded-full bg-white text-slate-900 font-bold text-sm hover:bg-slate-100 transition-colors">
              Jetzt Demo starten
            </a>
            <a href="/kontakt" className="px-8 py-4 rounded-full border-2 border-white/30 text-white font-bold text-sm hover:border-white/60 transition-colors">
              Kontakt aufnehmen
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

/** Teaser section for the landing page */
export function CmsFeaturesTeaserSection() {
  return (
    <section className="py-24 md:py-32 surface">
      <div className="container-x text-center reveal">
        <p className="eyebrow mb-5">CMS-Funktionen</p>
        <h2 className="headline-md max-w-3xl mx-auto">
          Ein CMS, das sich anfühlt wie<br /><em className="italic-pop">deine eigene App.</em>
        </h2>
        <p className="mt-6 text-lg text-muted max-w-2xl mx-auto leading-relaxed">
          Seiten bauen, Bilder hochladen, Design ändern, SEO optimieren und veröffentlichen — alles in einer einzigen, eleganten Oberfläche.
        </p>

        <div className="grid sm:grid-cols-3 gap-6 mt-14 text-left max-w-4xl mx-auto">
          {[
            { icon: '🧩', title: '30+ Sektionstypen', desc: 'Hero, Services, Galerie, Testimonials und mehr — per Drag & Drop.' },
            { icon: '🎨', title: '3 Stile + Individuell', desc: 'Classic, Modern oder Bold — global oder pro Sektion steuerbar.' },
            { icon: '🚀', title: 'Ein-Klick-Publishing', desc: 'Draft-Modus, Vorschau und atomares Veröffentlichen.' },
          ].map(item => (
            <div key={item.title} className="p-6 rounded-2xl border border-line bg-white hover:shadow-lg transition-shadow">
              <span className="text-3xl">{item.icon}</span>
              <h3 className="font-bold text-lg mt-3">{item.title}</h3>
              <p className="text-sm text-muted mt-2 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <a href="/cms" className="btn-primary mt-12 inline-flex">
          Alle Funktionen entdecken →
        </a>
      </div>
    </section>
  );
}
