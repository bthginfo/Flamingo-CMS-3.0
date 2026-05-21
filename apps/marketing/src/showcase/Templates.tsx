'use client';

import { useState, useRef, useEffect } from 'react';
import { Link } from '@/lib/nav-compat';

const DEMO_LINKS: Record<string, string> = {
  tradesman: 'https://www.demo.flamingomedia.online/demo/handwerk',
  restaurant: 'https://www.demo.flamingomedia.online/demo/restaurant',
  salon: 'https://www.demo.flamingomedia.online/demo/salon',
  hotel: 'https://www.demo.flamingomedia.online/demo/hotel',
  tourism: 'https://www.demo.flamingomedia.online/demo/tourism',
  medical: 'https://www.demo.flamingomedia.online/demo/medical',
  wedding: 'https://www.demo.flamingomedia.online/demo/wedding',
  photography: 'https://www.demo.flamingomedia.online/demo/photography',
  consulting: 'https://www.demo.flamingomedia.online/demo/consulting',
  realestate: 'https://www.demo.flamingomedia.online/demo/realestate',
  cafe: 'https://www.demo.flamingomedia.online/demo/cafe',
  tattoo: 'https://www.demo.flamingomedia.online/demo/tattoo',
};

const TEMPLATES = [
  {
    key: 'tradesman',
    name: 'Handwerk',
    tagline: 'Installateur · Bau · Meisterbetrieb',
    description: 'Lead-Generierung, Referenz-Portfolio, Prozess-Timeline, Team, FAQ und Kontakt mit Karte.',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
    color: '#1a5276',
    features: ['Hero mit USP-Leiste', 'Leistungs-Grid & Prozess-Timeline', 'Portfolio & Galerie', 'FAQ-Akkordeon', 'Kontakt mit Karte', 'Team-Vorstellung'],
    status: 'live' as const,
  },
  {
    key: 'restaurant',
    name: 'Restaurant',
    tagline: 'Bistro, Café, Bar & Fine Dining',
    description: 'Mehrseitige Speisekarte, Reservierung, Signature Dishes, Events, Ambiente-Galerie und Kontakt mit Karte.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
    color: '#8B4513',
    features: ['Speisekarte mit Kategorien', 'Online-Reservierung', 'Signature Dishes', 'Events & Feiern', 'Öffnungszeiten', 'Kontakt mit Google Maps'],
    status: 'live' as const,
  },
  {
    key: 'salon',
    name: 'Beauty & Salon',
    tagline: 'Friseur, Kosmetik, Spa & Wellness',
    description: 'Service-Menü, Preisliste, Team, Vorher/Nachher-Galerie, Bewertungen und Online-Buchung mit Karte.',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80',
    color: '#C2185B',
    features: ['Service-Menü & Preisliste', 'Team mit Spezialisierungen', 'Vorher/Nachher', 'Bewertungen', 'Beauty-Packages', 'Kontakt mit Karte'],
    status: 'live' as const,
  },
  {
    key: 'hotel',
    name: 'Hotel & Pension',
    tagline: 'Hotels, B&Bs, Ferienwohnungen',
    description: 'Zimmer-Showcase, Wellness, Kulinarik, Angebote, Gästebewertungen, Eventräume und Anreise mit Karte.',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
    color: '#1B5E20',
    features: ['Zimmer- & Suiten-Katalog', 'Wellness & Spa', 'Kulinarik & Dining', 'Angebote & Packages', 'Gästebewertungen', 'Kontakt & Anreise mit Karte'],
    status: 'live' as const,
  },
  {
    key: 'tourism',
    name: 'Tourismus',
    tagline: 'Regionen, Destinationen & Erlebnisse',
    description: 'Highlights, Erlebnis-Grid, Wanderrouten, Unterkünfte, Veranstaltungskalender und interaktive Karte.',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&q=80',
    color: '#2f6f4e',
    features: ['Destination-Highlights', 'Erlebnis-Grid & Touren', 'Saison-Teaser', 'Unterkünfte', 'Veranstaltungskalender', 'Kontakt mit interaktiver Karte'],
    status: 'live' as const,
  },
  {
    key: 'medical',
    name: 'Arztpraxis',
    tagline: 'Ärzte, Therapeuten & Gesundheit',
    description: 'Leistungsübersicht, Ärzteteam, Patienteninfos, Kassen, Sprechzeiten, Notfallhinweise und Terminbuchung.',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80',
    color: '#0f4c5c',
    features: ['Leistungen & Diagnostik', 'Ärzte- & Praxisteam', 'Patienteninfo & Downloads', 'Terminbuchung', 'Sprechzeiten', 'Kontakt mit Karte'],
    status: 'live' as const,
  },
  {
    key: 'wedding',
    name: 'Hochzeit',
    tagline: 'Einladung, Programm & RSVP',
    description: 'Eure Geschichte, Location, Tagesablauf, Dresscode, Menü, Galerie und digitale Gäste-Rückmeldung.',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
    color: '#d4a373',
    features: ['Countdown & Liebesgeschichte', 'Tagesablauf & Location', 'RSVP-Formular', 'Menü & Dresscode', 'Trauzeugen & Galerie', 'Geschenke & Anreise'],
    status: 'live' as const,
  },
  {
    key: 'photography',
    name: 'Fotografie',
    tagline: 'Hochzeits-, Portrait- & Eventfotografie',
    description: 'Portfolio-Galerie mit Kategorie-Filter, Shooting-Pakete, Über-mich-Story, Ablauf-Timeline und Kontakt.',
    image: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=800&q=80',
    color: '#9c7c5c',
    features: ['Masonry-Portfolio mit Lightbox', 'Service-Pakete & Preise', 'Persönliche Story', 'Shooting-Ablauf Timeline', 'Kundenbewertungen', 'Kontakt & FAQ'],
    status: 'live' as const,
  },
  {
    key: 'consulting',
    name: 'Kanzlei & Beratung',
    tagline: 'Anwälte, Kanzleien & Unternehmensberatung',
    description: 'Rechtsgebiete-Übersicht, Anwaltsteam, Erfolgsbilanz, Honorartransparenz, Fachpublikationen und Kontakt mit Erstberatungsformular.',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80',
    color: '#1a2744',
    features: ['Rechtsgebiete-Grid', 'Anwälte & Partner', 'Erfolgsbilanz', 'Honorar-Übersicht', 'Fachbeiträge', 'Kontakt mit Erstberatung'],
    status: 'live' as const,
  },
  {
    key: 'realestate',
    name: 'Immobilien',
    tagline: 'Makler, Hausverwaltung & Bewertung',
    description: 'Objekt-Showcase, Suchfilter, Marktbericht, Makler-Team, Bewertungs-CTA, verkaufte Referenzen und Kontakt.',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80',
    color: '#1e3a5f',
    features: ['Objekt-Showcase & Suche', 'Marktbericht & Statistiken', 'Makler-Team', 'Bewertungs-CTA', 'Verkaufte Referenzen', 'Kontakt mit Karte'],
    status: 'live' as const,
  },
  {
    key: 'cafe',
    name: 'Café & Bar',
    tagline: 'Coffee-Shops, Bars & Bistros',
    description: 'Getränke- & Speisekarte, Atmosphäre-Galerie, Tagesangebote, Event-Kalender, Location-Vibe und Kontakt.',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80',
    color: '#8b4513',
    features: ['Getränkekarte & Food-Menü', 'Atmosphäre-Galerie', 'Tagesangebote', 'Event-Kalender', 'Location & Vibe', 'Kontakt mit Öffnungszeiten'],
    status: 'live' as const,
  },
  {
    key: 'tattoo',
    name: 'Tattoo Studio',
    tagline: 'Tattoo · Piercing · Flash Art',
    description: 'Artist-Portfolio, Style-Galerie, Terminanfrage-Formular, Flash-Day-Banner, Pflege-Guide und Preisübersicht.',
    image: 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=800&q=80',
    color: '#1a1a2e',
    features: ['Artist-Grid & Profile', 'Style-Galerie mit Filter', 'Booking-Formular', 'Flash-Day-Banner', 'Aftercare-Guide', 'Pricing-Info'],
    status: 'live' as const,
  },
];

export function TemplateGallery() {
  const [filter] = useState<'all'>('all');
  const ref = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setRevealed(true); io.disconnect(); } }, { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const filtered = TEMPLATES;

  return (
    <main id="main" className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden">
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
                <a
                  href={DEMO_LINKS[template.key] || `/demo/${template.key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent-color)] hover:underline"
                >
                  Live-Demo ansehen →
                </a>
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
