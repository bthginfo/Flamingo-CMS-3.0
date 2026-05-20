'use client';

import { useState, useRef } from 'react';
import Seo from '@/components/Seo';

const DEMO_BASE = 'https://flamingo-cms.de';

const FEATURES = [
  {
    badge: 'Seiten & Sektionen',
    title: 'Drag & Drop\nSeiten-Builder',
    description: 'Erstelle beliebig viele Seiten mit vorgefertigten Sektionen. Per Drag & Drop sortieren, ein- und ausblenden — ohne eine Zeile Code.',
    highlights: ['Über 30 Sektionstypen pro Branche', 'Drag & Drop Reihenfolge', 'Ein-/Ausblenden per Klick', 'Live-Vorschau im Editor'],
    mockupContent: (
      <div className="p-4 space-y-2.5">
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-blue-50 border-2 border-blue-300 shadow-sm">
          <span className="w-5 h-5 rounded bg-blue-500 flex items-center justify-center text-white text-[9px]">⠿</span>
          <span className="text-xs font-semibold text-blue-800">Hero</span>
          <span className="ml-auto text-[10px] text-blue-400">12 Felder</span>
          <span className="w-4 h-4 rounded-full bg-green-400" />
        </div>
        {['USP-Leiste', 'Leistungen', 'Ablauf-Timeline', 'Galerie', 'Testimonials', 'CTA-Banner'].map((s, i) => (
          <div key={s} className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200 ${i === 4 ? 'opacity-40' : ''}`}>
            <span className="w-5 h-5 rounded bg-slate-200 flex items-center justify-center text-[9px] text-slate-500">⠿</span>
            <span className="text-xs font-medium text-slate-700">{s}</span>
            <span className="ml-auto text-[10px] text-slate-400">{3 + i} Felder</span>
            <span className={`w-4 h-4 rounded-full ${i === 4 ? 'bg-slate-300' : 'bg-green-400'}`} />
          </div>
        ))}
      </div>
    ),
  },
  {
    badge: 'Design-Kontrolle',
    title: 'Drei Stile.\nEin Klick.',
    description: 'Wechsle den gesamten Look deiner Website zwischen Classic, Modern und Bold — oder steuere den Stil pro Sektion im Individuell-Modus.',
    highlights: ['Classic: zeitlos & warm', 'Modern: clean & minimal', 'Bold: dynamisch & markant', 'Individuell: pro Sektion steuerbar'],
    mockupContent: (
      <div className="p-5 space-y-4">
        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Website-Stil</p>
        <div className="grid grid-cols-2 gap-2.5">
          {[
            { name: 'Classic', active: true, shapes: ['rounded-xl bg-amber-100', 'rounded-xl bg-amber-200', 'rounded-full bg-amber-300'] },
            { name: 'Modern', active: false, shapes: ['rounded bg-slate-100', 'rounded bg-slate-200', 'rounded bg-slate-300'] },
            { name: 'Bold', active: false, shapes: ['rounded-none bg-slate-800', 'rounded-none bg-slate-600', 'rounded-none bg-slate-400'] },
            { name: 'Individuell', active: false, shapes: ['rounded-xl bg-purple-100', 'rounded bg-blue-200', 'rounded-none bg-slate-800'] },
          ].map(s => (
            <div key={s.name} className={`p-3 rounded-xl border-2 text-center cursor-pointer transition-all ${s.active ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-slate-200'}`}>
              <div className="flex gap-1 justify-center mb-2">{s.shapes.map((cls, i) => <div key={i} className={`w-5 h-5 ${cls}`} />)}</div>
              <p className={`text-[11px] font-semibold ${s.active ? 'text-blue-700' : 'text-slate-500'}`}>{s.name}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div><p className="text-[10px] uppercase tracking-widest text-slate-400 mb-1.5">Primärfarbe</p><div className="flex gap-2 items-center"><span className="w-7 h-7 rounded-lg bg-blue-600 shadow-inner" /><span className="text-[10px] font-mono text-slate-500">#2563EB</span></div></div>
          <div><p className="text-[10px] uppercase tracking-widest text-slate-400 mb-1.5">Akzentfarbe</p><div className="flex gap-2 items-center"><span className="w-7 h-7 rounded-lg bg-amber-500 shadow-inner" /><span className="text-[10px] font-mono text-slate-500">#F59E0B</span></div></div>
        </div>
      </div>
    ),
  },
  {
    badge: 'Mediathek',
    title: 'Bilder hochladen.\nOptimiert serviert.',
    description: 'Lade Bilder direkt im Editor hoch. Automatische Komprimierung, WebP-Konvertierung und CDN-Delivery. Keine externen Tools nötig.',
    highlights: ['Drag & Drop Upload', 'Auto-Komprimierung & WebP', 'CDN mit globalem Edge-Cache', 'Bulk-Upload für Galerien'],
    mockupContent: (
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-3 gap-2">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="aspect-square rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-400 text-lg">📷</div>
          ))}
        </div>
        <div className="border-2 border-dashed border-blue-300 rounded-xl p-4 text-center bg-blue-50/50">
          <p className="text-xs text-blue-600 font-medium">Bilder hierher ziehen</p>
          <p className="text-[10px] text-blue-400 mt-1">oder klicken zum Auswählen</p>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-slate-400">
          <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded font-medium">WebP</span>
          <span>Automatische Optimierung aktiv</span>
        </div>
      </div>
    ),
  },
  {
    badge: 'SEO & Meta',
    title: 'SEO an\nBord.',
    description: 'Meta-Titel, Beschreibungen, Open Graph, Canonical URLs und Robots-Einstellungen — direkt im CMS. Ohne Plugin, ohne WordPress.',
    highlights: ['Meta-Tags pro Seite', 'Open Graph & Social Preview', 'Sitemap & Robots automatisch', 'Structured Data (JSON-LD)'],
    mockupContent: (
      <div className="p-4 space-y-3">
        <div><p className="text-[10px] uppercase tracking-widest text-slate-400 mb-1">Meta-Titel</p><div className="border border-slate-200 rounded-lg px-3 py-2 text-xs">Müller & Söhne · Sanitär & Heizung</div></div>
        <div><p className="text-[10px] uppercase tracking-widest text-slate-400 mb-1">Beschreibung</p><div className="border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-600 leading-relaxed">Ihr Meisterbetrieb für Sanitär, Heizung und Bäder in München. 35+ Jahre Erfahrung.</div></div>
        <div className="rounded-xl border border-slate-200 p-3">
          <p className="text-[10px] text-slate-400 mb-2">Google-Vorschau</p>
          <p className="text-blue-700 text-xs font-medium">Müller & Söhne · Sanitär & Heizung</p>
          <p className="text-green-700 text-[10px]">muellersanitaer.de</p>
          <p className="text-slate-500 text-[10px] leading-relaxed">Ihr Meisterbetrieb für Sanitär, Heizung und Bäder…</p>
        </div>
      </div>
    ),
  },
  {
    badge: 'Navigation & Footer',
    title: 'Navigation.\nZentral verwaltet.',
    description: 'Menü-Items, Call-to-Action-Button, Footer-Spalten und Social-Links — alles an einem Ort konfigurierbar.',
    highlights: ['Drag & Drop Menü-Sortierung', 'CTA-Button im Header', 'Multi-Column Footer', 'Social Media Icons'],
    mockupContent: (
      <div className="p-4 space-y-3">
        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Menü-Items</p>
        {['Startseite', 'Leistungen', 'Über uns', 'Projekte', 'Kontakt'].map((item, i) => (
          <div key={item} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200">
            <span className="text-slate-400 text-xs">⠿</span>
            <span className="text-xs font-medium">{item}</span>
            <span className="ml-auto text-[10px] text-slate-400">/{item.toLowerCase().replace('ü','ue').replace(' ','-')}</span>
          </div>
        ))}
        <div className="pt-2 border-t border-slate-100">
          <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-2">Header CTA</p>
          <div className="inline-flex px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-medium">Jetzt anfragen</div>
        </div>
      </div>
    ),
  },
  {
    badge: 'Veröffentlichung',
    title: 'Ein Klick.\nLive.',
    description: 'Arbeite im Draft-Modus und veröffentliche wenn du bereit bist. Atomares Publishing — deine Website ist nie „halb fertig".',
    highlights: ['Draft vs. Live Trennung', 'Multi-Page Publish', 'Publish-History mit Timestamps', 'Rollback jederzeit möglich'],
    mockupContent: (
      <div className="p-5 space-y-4">
        <div className="text-center py-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white text-2xl shadow-lg shadow-green-200 mb-3">🚀</div>
          <p className="text-sm font-bold text-slate-800">Bereit zum Veröffentlichen</p>
          <p className="text-xs text-slate-400 mt-1">3 Seiten mit Änderungen</p>
        </div>
        <div className="space-y-2">
          {['Startseite', 'Leistungen', 'Kontakt'].map(p => (
            <div key={p} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-xs font-medium text-amber-800">{p}</span>
              <span className="ml-auto text-[10px] text-amber-500">geändert</span>
            </div>
          ))}
        </div>
        <button className="w-full py-3 rounded-xl bg-slate-900 text-white text-xs font-bold">Alle veröffentlichen</button>
      </div>
    ),
  },
];

function DesktopMockup({ children, scrollable = true }: { children: React.ReactNode; scrollable?: boolean }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  return (
    <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-2xl bg-white">
      <div className="bg-slate-900 px-4 py-2.5 flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        <span className="ml-3 text-[10px] text-slate-500 font-mono">flamingo-cms.de/admin</span>
      </div>
      <div className="flex">
        <aside className="w-40 bg-slate-900 p-2.5 border-r border-slate-800 shrink-0 hidden sm:block">
          <div className="flex items-center gap-1.5 px-2 py-1.5 mb-2">
            <span className="w-5 h-5 rounded bg-blue-500 text-white text-[8px] font-bold flex items-center justify-center">F</span>
            <span className="text-[10px] text-white font-semibold">Flamingo CMS</span>
          </div>
          {['Dashboard', 'Seiten', 'Mediathek', 'Navigation', 'Marke & Design', 'SEO', 'Veröffentlichen'].map((s, i) => (
            <div key={s} className={`px-2.5 py-1.5 rounded text-[10px] mb-0.5 ${i === 1 ? 'bg-white/10 text-white font-medium' : 'text-slate-500'}`}>{s}</div>
          ))}
        </aside>
        <div ref={scrollRef} className={`flex-1 ${scrollable ? 'h-[320px] overflow-y-auto' : ''}`}>
          {children}
        </div>
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
            <DesktopMockup>{feature.mockupContent}</DesktopMockup>
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
