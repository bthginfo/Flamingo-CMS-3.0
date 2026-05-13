'use client';

import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const TEMPLATES = [
  {
    key: 'tradesman',
    name: 'Handwerk',
    tagline: 'Heizung, Sanitär, Elektro & Co.',
    description: 'Premium-Template für Meisterbetriebe mit Leistungsübersicht, Referenz-Portfolio, Team-Seite und Notdienst-Highlights.',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
    color: '#1a5276',
    features: ['Hero mit Hintergrundbild', 'USP-Leiste', 'Leistungs-Grid mit Bildern', 'Prozess-Timeline', 'Portfolio-Galerie', 'FAQ-Akkordeon', 'Kontaktformular'],
    status: 'live' as const,
  },
  {
    key: 'restaurant',
    name: 'Restaurant',
    tagline: 'Bistro, Café, Bar & Fine Dining',
    description: 'Elegantes Design mit Speisekarte, Reservierung, Galerie und Veranstaltungskalender.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
    color: '#8B4513',
    features: ['Fullscreen Hero', 'Speisekarte mit Kategorien', 'Reservierungs-Widget', 'Event-Kalender', 'Instagram-Feed', 'Bildergalerie'],
    status: 'coming' as const,
  },
  {
    key: 'salon',
    name: 'Beauty & Salon',
    tagline: 'Friseur, Kosmetik, Spa & Wellness',
    description: 'Modernes, warmes Design mit Online-Buchung, Preisliste und Team-Vorstellung.',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80',
    color: '#C2185B',
    features: ['Online-Terminbuchung', 'Preisliste', 'Team-Galerie', 'Vorher/Nachher-Slider', 'Bewertungen', 'Gutschein-Bereich'],
    status: 'coming' as const,
  },
  {
    key: 'hotel',
    name: 'Hotel & Pension',
    tagline: 'Hotels, B&Bs, Ferienwohnungen',
    description: 'Großzügiges Layout mit Zimmer-Katalog, Verfügbarkeitsprüfung und virtueller Tour.',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
    color: '#1B5E20',
    features: ['Zimmer-Katalog', 'Buchungsintegration', 'Bildergalerie', 'Umgebungskarte', 'Bewertungen', 'Saisonale Angebote'],
    status: 'coming' as const,
  },
  {
    key: 'medical',
    name: 'Arztpraxis',
    tagline: 'Ärzte, Therapeuten & Gesundheit',
    description: 'Seriöses, vertrauenswürdiges Design mit Leistungsübersicht, Team und Online-Terminvergabe.',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80',
    color: '#0D47A1',
    features: ['Leistungsübersicht', 'Team-Vorstellung', 'Terminbuchung', 'Patienteninfo', 'Standortkarte', 'Notfall-Banner'],
    status: 'coming' as const,
  },
  {
    key: 'consulting',
    name: 'Beratung & Agentur',
    tagline: 'Kanzleien, Berater & Freelancer',
    description: 'Minimalistisches, professionelles Design mit Case Studies, Expertise-Darstellung und Kontakt.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    color: '#263238',
    features: ['Case Studies', 'Expertise-Grid', 'Team-Seite', 'Blog/Insights', 'Kontaktformular', 'Testimonials'],
    status: 'coming' as const,
  },
];

export function TemplateGallery() {
  const [filter, setFilter] = useState<'all' | 'live' | 'coming'>('all');
  const ref = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setRevealed(true); io.disconnect(); } }, { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const filtered = filter === 'all' ? TEMPLATES : TEMPLATES.filter(t => t.status === filter);

  return (
    <main id="main" className="min-h-screen">
      {/* Hero */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--bg-color)] to-white" />
        <div className="container-x relative">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-[var(--accent-color)]/10 border border-[var(--accent-color)]/20 px-4 py-1.5 text-sm font-medium text-[var(--accent-color)] mb-6">
              Template-Galerie
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Ein Template für <span className="text-[var(--accent-color)]">jede Branche</span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Professionelle Website-Templates, maßgeschneidert für lokale Unternehmen. 
              100% anpassbar über unser CMS — keine Programmierkenntnisse nötig.
            </p>
          </div>
        </div>
      </section>

      {/* Filter */}
      <section className="container-x pb-8">
        <div className="flex items-center justify-center gap-2">
          {[
            { key: 'all', label: 'Alle' },
            { key: 'live', label: 'Verfügbar' },
            { key: 'coming', label: 'Bald verfügbar' },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key as typeof filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === f.key
                  ? 'bg-[var(--accent-color)] text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section ref={ref} className="container-x pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((template, i) => (
            <article
              key={template.key}
              className={`group relative bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-xl transition-all duration-500 ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {/* Preview image */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={template.image}
                  alt={`${template.name} Template`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                
                {/* Status badge */}
                <div className="absolute top-4 right-4">
                  {template.status === 'live' ? (
                    <span className="inline-flex items-center gap-1.5 bg-emerald-500 text-white text-xs font-medium px-2.5 py-1 rounded-full">
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                      Live
                    </span>
                  ) : (
                    <span className="inline-flex items-center bg-slate-800/70 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full">
                      Bald
                    </span>
                  )}
                </div>

                {/* Color indicator */}
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full shadow-sm" style={{ background: template.color }} />
                  <span className="text-white text-sm font-medium drop-shadow">{template.name}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">{template.tagline}</p>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">{template.description}</p>
                
                {/* Features */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {template.features.slice(0, 4).map((f, j) => (
                    <span key={j} className="text-[11px] bg-slate-50 border border-slate-100 text-slate-500 px-2 py-0.5 rounded-md">
                      {f}
                    </span>
                  ))}
                  {template.features.length > 4 && (
                    <span className="text-[11px] text-slate-400 px-2 py-0.5">
                      +{template.features.length - 4} mehr
                    </span>
                  )}
                </div>

                {/* CTA */}
                {template.status === 'live' ? (
                  <Link
                    to="/kontakt"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent-color)] hover:underline"
                  >
                    Live-Demo ansehen →
                  </Link>
                ) : (
                  <span className="text-sm text-slate-400">Verfügbar ab Q3 2026</span>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container-x pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[var(--brand-color)] to-slate-800 p-12 md:p-16 text-center text-white">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:30px_30px]" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ihr Template nicht dabei?</h2>
            <p className="text-lg text-white/70 mb-8 max-w-xl mx-auto">
              Wir entwickeln individuelle Templates für jede Branche. 
              Kontaktieren Sie uns für ein maßgeschneidertes Angebot.
            </p>
            <Link
              to="/kontakt"
              className="inline-flex items-center gap-2 bg-[var(--accent-color)] text-white font-semibold px-8 py-4 rounded-full hover:brightness-110 transition-all shadow-lg"
            >
              Projekt besprechen →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
