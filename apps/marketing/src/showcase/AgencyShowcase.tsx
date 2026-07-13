import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Link, NavLink, Outlet, Routes, Route, useLocation } from '@/lib/nav-compat';
import { Imprint, Privacy } from './Legal';
import { NotFound } from './Blog';
import { TemplateGallery } from './Templates';
import { FundingCalculatorPage } from './FundingCalculator';
import CmsFeaturesPage, { CmsFeaturesTeaserSection } from './CmsFeatures';
import ShopFeaturesPage, { ShopFeaturesTeaserSection } from './ShopFeatures';
import { LiveAdminShowcase } from './LiveAdminShowcase';
import Seo from '@/components/Seo';
import {
  Marquee, RotatingWord, ScrollProgress, Accordion, useReveal,
} from '@/components/fx';
import {
  Tilt3DCard, MagneticButton,
} from '@/components/motion-fx';
import {
  SpotlightSection, AnimatedGridPattern,
  TextReveal, BentoCard,
} from '@/components/fx-21st';
import { ConsentProvider } from '@/lib/consent';
import { ContactForm } from '@/components/ContactForm';
import { BRANCHE_OPTIONS, PAKET_OPTIONS, ADDON_OPTIONS } from '@/lib/contact-options';
import { CookieBanner } from '@/components/CookieBanner';
import { MouseGlow } from '@/components/MouseGlow';
import { scrollToTop } from '@/lib/scroll';
import DemoPlayground from './DemoPlayground';

/* ─── Brand ─────────────────────────────────────────────────────────── */
const AGENCY = {
  name: 'FlamingoMedia',
  fullName: 'FlamingoMedia · Websites für lokale Marken',
  tagline: 'Websites mit Pop für lokale Marken · Innsbruck · DACH',
  email: 'hello@flamingomedia.online',
  phone: '+49 1515 5338029',
  phoneAt: '+43 677 6368 1543',
  /** Wordmark variants (text only). */
  logoTextSrc: '/brand/flamingo-text-beside.png',
  logoTextWhiteSrc: '/brand/flamingo-text-beside.png',
  /** Icon-only mark for headers / favicon-style spots. */
  logoMarkSrc: '/brand/flamingo-icon.png',
  logoMarkWhiteSrc: '/brand/flamingo-icon.png',
  /** Full lockup (icon + wordmark beside) — best for hero / footer. */
  logoFullSrc: '/brand/flamingo-full.png',
  logoFullBesideSrc: '/brand/flamingo-full-beside.png',
  /** Vertical stacks. */
  logoTextAboveSrc: '/brand/flamingo-text-above.png',
  logoTextAboveV2Src: '/brand/flamingo-text-above-v2.png',
  /** Backwards-compat alias. */
  logoSrc: '/brand/flamingo-full-beside.png',
};

const ROTATING_WORDS = [
  'Restaurants.',
  'Salons.',
  'Handwerk.',
  'Cafés.',
  'Praxen.',
  'Beratungen.',
  'Studios.',
  'Ateliers.',
  'Werkstätten.',
  'Hotels.',
  'Bäckereien.',
  'Boutiquen.',
];

/* ─── Showcase palette ─────────────────────────────────────────────
 * Single source of truth for the showcase identity. Re-applied on every
 * marketing-route mount so demo theme overrides (applied via lib/theme.ts
 * inside /preview/* routes) cannot bleed into the landing/marketing pages.
 */
const SHOWCASE_PALETTE = {
  '--brand-color': '#14111a',
  '--brand-fg': '#ffffff',
  // FlamingoMedia signature pink — taken from the logo (#F24171).
  '--accent-color': '#F24171',
  // Warm coral complement for highlights / second-accent CTAs.
  '--accent-color-2': '#FFB347',
  // Pink CTAs need white text for AA contrast.
  '--accent-fg': '#ffffff',
  '--surface-color': '#fce7ef',
  '--bg-color': '#fff8fa',
  '--text-color': '#14111a',
} as const;

function applyShowcasePalette() {
  const r = document.documentElement.style;
  for (const [k, v] of Object.entries(SHOWCASE_PALETTE)) r.setProperty(k, v);
  // applyTheme() in lib/theme.ts sets these inline on body — clear them so
  // our CSS variables drive body colors again.
  document.body.style.backgroundColor = '';
  document.body.style.color = '';
}

/* ─── Template metadata ────────────────────────────────────────────── */
const TEMPLATE_META: Record<'handwerk' | 'restaurant' | 'salon' | 'hotel' | 'tourism' | 'medical' | 'wedding' | 'photography' | 'consulting' | 'realestate' | 'cafe' | 'tattoo' | 'shop' | 'retail' | 'florist' | 'fitness' | 'location', {
  label: string;
  tagline: string;
  description: string;
  image: string;
  accent: string;
  bullets: string[];
}> = {
  handwerk: {
    label: 'Handwerk',
    tagline: 'Installateur · Bau · Service',
    description: 'Lead-Generierung, Notdienst-Banner, Referenzen, Portfolio-Galerie und Vertrauen auf den ersten Blick.',
    image: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=1400&q=80',
    accent: '#1d4ed8',
    bullets: ['Hero mit USP-Leiste', 'Leistungs-Grid & Prozess-Timeline', 'Referenz-Portfolio & Galerie', 'Kontakt mit Karte & Formular'],
  },
  restaurant: {
    label: 'Restaurant',
    tagline: 'Gastronomie · Trattoria · Café',
    description: 'Mehrseitige Speisekarte, Reservierung, Signature-Dishes, Events, Ambiente-Galerie und Kontakt mit Karte.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=80',
    accent: '#9a3412',
    bullets: ['Editierbare Speisekarte mit Kategorien', 'Online-Reservierung & Öffnungszeiten', 'Signature Dishes & Events', 'Kontakt & Anfahrt mit Google Maps'],
  },
  salon: {
    label: 'Salon & Beauty',
    tagline: 'Friseur · Spa · Kosmetik',
    description: 'Service-Menü, Preisliste, Team-Vorstellung, Vorher/Nachher-Galerie, Bewertungen und Online-Buchung.',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1400&q=80',
    accent: '#be185d',
    bullets: ['Service-Menü & Preisliste', 'Team mit Spezialisierungen', 'Vorher/Nachher & Galerie', 'Kontakt mit Karte & Buchungs-CTA'],
  },
  hotel: {
    label: 'Hotels',
    tagline: 'Hotel · Pension · Resort',
    description: 'Zimmer-Showcase, Wellness-Bereich, Kulinarik, Angebote, Gästebewertungen und Lage mit Anreise-Infos.',
    image: 'https://images.unsplash.com/photo-1455587734955-081b22074882?auto=format&fit=crop&w=1400&q=80',
    accent: '#7c5e3c',
    bullets: ['Zimmer- & Suiten-Katalog', 'Wellness, Kulinarik & Eventräume', 'Angebote & Arrangements', 'Kontakt & Anreise mit Google Maps'],
  },
  tourism: {
    label: 'Tourismus',
    tagline: 'Regionen · Destinationen · Erlebnisse',
    description: 'Highlights, Erlebnis-Grid, Wanderrouten, Unterkünfte, Veranstaltungskalender und interaktive Karte.',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=80',
    accent: '#0e7490',
    bullets: ['Destination-Highlights & Saison-Teaser', 'Erlebnisse, Routen & Events', 'Unterkünfte & Besucherinfos', 'Kontakt & interaktive Karte'],
  },
  medical: {
    label: 'Praxen & Ärzte',
    tagline: 'Arzt · Therapie · Praxis',
    description: 'Leistungsübersicht, Ärzteteam, Patienteninfos, Sprechzeiten, Notfallhinweise und Online-Terminbuchung.',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1400&q=80',
    accent: '#0e7490',
    bullets: ['Leistungen & Diagnostik', 'Ärzte- & Praxisteam', 'Patienteninfo, Kassen & Downloads', 'Sprechzeiten & Kontakt mit Karte'],
  },
  wedding: {
    label: 'Hochzeit',
    tagline: 'Einladung · Programm · RSVP',
    description: 'Eure Geschichte, Location, Tagesablauf, Dresscode, Menü, Galerie und digitale Gäste-Rückmeldung.',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=80',
    accent: '#d4a373',
    bullets: ['Liebesgeschichte & Countdown', 'Tagesablauf & Location', 'RSVP-Formular & Menü', 'Dresscode & Geschenke'],
  },
  photography: {
    label: 'Fotografie',
    tagline: 'Hochzeit · Portrait · Event',
    description: 'Portfolio-Galerie mit Kategorie-Filter, Shooting-Pakete, Über-mich-Story, Ablauf-Timeline und Kontakt.',
    image: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?auto=format&fit=crop&w=1400&q=80',
    accent: '#9c7c5c',
    bullets: ['Masonry-Portfolio mit Lightbox', 'Service-Pakete & Preise', 'Shooting-Ablauf Timeline', 'Bewertungen & Kontakt'],
  },
  consulting: {
    label: 'Kanzlei & Beratung',
    tagline: 'Anwälte · Steuerberater · Unternehmensberater',
    description: 'Fachgebiete, Teamvorstellung, Erfolgsbilanz, transparente Honorarmodelle, Fachpublikationen und Erstberatungsformular — für Kanzleien, Steuerberater und Beratungsfirmen.',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1400&q=80',
    accent: '#1a2744',
    bullets: ['Fachgebiete-Grid & Honorarübersicht', 'Partner & Team', 'Erfolgsbilanz & Mandantenstimmen', 'Fachbeiträge & Erstberatung'],
  },
  realestate: {
    label: 'Immobilien',
    tagline: 'Makler · Hausverwaltung · Bewertung',
    description: 'Objekt-Showcase, Suchfilter, Marktbericht, Makler-Team, Bewertungs-CTA, verkaufte Referenzen und Standort-Highlight.',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1400&q=80',
    accent: '#1e3a5f',
    bullets: ['Objekt-Showcase & Suchfilter', 'Marktbericht & Statistiken', 'Makler-Team & Bewertungs-CTA', 'Verkaufte Referenzen & Kontakt'],
  },
  cafe: {
    label: 'Café & Bar',
    tagline: 'Coffee · Cocktails · Bistro',
    description: 'Getränke- & Speisekarte, Atmosphäre-Galerie, Tagesangebote, Event-Kalender, Location-Vibe und Kontakt.',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1400&q=80',
    accent: '#8b4513',
    bullets: ['Getränkekarte & Food-Menü', 'Atmosphäre-Galerie & Daily Specials', 'Event-Kalender', 'Location & Kontakt'],
  },
  tattoo: {
    label: 'Tattoo Studio',
    tagline: 'Tattoo · Piercing · Flash Art',
    description: 'Artist-Portfolio, Style-Galerie, Terminanfrage, Flash-Day-Banner, Aftercare-Guide und Preisübersicht.',
    image: 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&w=1400&q=80',
    accent: '#1a1a2e',
    bullets: ['Artist-Grid & Profile', 'Style-Galerie mit Filter', 'Booking-Formular & Flash-Days', 'Aftercare & Pricing'],
  },
  shop: {
    label: 'Online-Shop',
    tagline: 'Weinhandel · Einzelhandel · E-Commerce',
    description: 'Produktkatalog, Kategorien, Warenkorb, Checkout, Bestellverwaltung, Rechnungen und Versandoptionen — fertig für Stripe & PayPal.',
    image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1400&q=80',
    accent: '#7c2d12',
    bullets: ['Produkte & Kategorien mit Varianten', 'Warenkorb & Checkout', 'Bestellverwaltung & Rechnungen', 'Versand, Gutscheine & Storno'],
  },
  retail: {
    label: 'Einzelhandel & Weitere',
    tagline: 'Boutique · Handelskette · Retail Store',
    description: 'Produktkatalog mit Kategorien, Filialen-Übersicht, Öffnungszeiten, Aktionen und Kontakt — modern und einladend.',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1400&q=80',
    accent: '#c41e3a',
    bullets: ['Produkt-Showcase & Kategorien', 'Inspirations-Galerie', 'Beratungsbuchung & Timeline', 'Vorher/Nachher-Slider'],
  },
  florist: {
    label: 'Floristik',
    tagline: 'Blumenladen · Atelier · Hochzeitsfloristik',
    description: 'Bouquets, Hochzeiten, Workshops, saisonale Kampagnen, weitere Standorte und Kontakt als emotionale, hochwertige Website.',
    image: 'https://images.unsplash.com/photo-1487070183336-b863922373d4?auto=format&fit=crop&w=1400&q=80',
    accent: '#be185d',
    bullets: ['Bouquet- und Anlass-Showcase', 'Hochzeiten & Events', 'Workshops & Saisonkampagnen', 'Standorte & Kontakt'],
  },
  fitness: {
    label: 'Fitness & Coaching',
    tagline: 'Studio · Yoga · Personal Training',
    description: 'Programme, Trainer, Probetraining, Kurspläne, Preise und Kontakt als motivierende Website für Studios und Coaches.',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1400&q=80',
    accent: '#9333ea',
    bullets: ['Programme & Kurse', 'Trainer:innen', 'Probetraining-CTA', 'Preise & Pakete'],
  },
  location: {
    label: 'Location',
    tagline: 'Eventlocation · Hochzeit · Coworking',
    description: 'Räume, Kapazitäten, Eventarten, Pakete, Ausstattung, Galerie und Anfrage-CTA für Locations mit echtem Wow-Faktor.',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1400&q=80',
    accent: '#b45309',
    bullets: ['Räume & Kapazitäten', 'Eventarten & Pakete', 'Ausstattung & Mood-Galerie', 'Anfrage-CTA & Anfahrt'],
  },
};

/* ─── Showcase root ────────────────────────────────────────────────── */
export default function AgencyShowcase() {
  useEffect(() => {
    applyShowcasePalette();
  }, []);

  return (
    <ConsentProvider>
      <Routes>
        <Route path="/demo" element={<DemoPlayground />} />
        <Route path="/" element={<ShowcaseShell />}>
          <Route index element={<Landing />} />

          <Route path="templates" element={<TemplateGallery />} />
          <Route path="prozess" element={<ProcessPage />} />
          <Route path="preise" element={<Pricing />} />
          <Route path="ueber-uns" element={<AboutPage />} />
          <Route path="kontakt" element={<Contact />} />
          <Route path="impressum" element={<Imprint />} />
          <Route path="datenschutz" element={<Privacy />} />
          <Route path="foerderrechner" element={<FundingCalculatorPage />} />
          <Route path="cms" element={<CmsFeaturesPage />} />
          <Route path="shop" element={<ShopFeaturesPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>

      </Routes>
      <CookieBanner />
    </ConsentProvider>
  );
}

/* ─── Shell with header / footer ───────────────────────────────────── */
function ScrollToTop() {
  // Reset scroll position on every route change. Without this, navigating to a
  // new page keeps the user's previous scroll offset, which is confusing.
  // Cooperates with Lenis (otherwise window.scrollTo is ignored).
  const { pathname } = useLocation();
  useEffect(() => {
    // Lenis sometimes hasn't picked up the new layout yet on the same tick;
    // schedule once after the React commit and once on next frame so we win
    // against any in-flight smooth-scroll animation.
    scrollToTop();
    const id = requestAnimationFrame(() => scrollToTop());
    return () => cancelAnimationFrame(id);
  }, [pathname]);
  return null;
}

function ShowcaseShell() {
  const [scrolled, setScrolled] = useState(false);
  const [mobile, setMobile] = useState(false);
  const { pathname } = useLocation();
  const isLanding = pathname === '/';
  // Header is always rendered with dark styling so the brand logo (designed for
  // dark backgrounds) stays readable. On the landing page we keep the bar
  // transparent at the very top (hero is dark already), then switch to a solid
  // dark bar on scroll. Subpages have the solid dark bar from the start.
  const headerSolid = scrolled || !isLanding;
  // Restore showcase palette on every shell mount so demo theme overrides
  // applied inside /preview/* never persist into the marketing pages.
  useEffect(() => {
    applyShowcasePalette();
  }, []);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useReveal();

  const NAV = [
    { to: '/templates', label: 'Templates' },
    { to: '/cms', label: 'CMS' },
    { to: '/shop', label: 'Shop' },
    { to: '/foerderrechner', label: 'Förderrechner' },
    { to: '/prozess', label: 'Ablauf' },
    { to: '/preise', label: 'Preise' },
    { to: '/blog', label: 'Blog' },
    { to: '/ueber-uns', label: 'Über uns' },
    { to: '/kontakt', label: 'Kontakt' },
  ];

  return (
    <div className="showcase-root min-h-screen flex flex-col">
      <ScrollToTop />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-md focus:bg-brand focus:text-white focus:outline-none focus:ring-2 focus:ring-white"
      >
        Zum Hauptinhalt springen
      </a>
      <ScrollProgress />

      {/* Top marquee */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-brand text-white text-xs uppercase tracking-[0.18em] py-2.5">
        <Marquee speed="slow">
          {[
            'Passend für jede Branche',
            'Foto- & Videoshooting optional als Add-on',
            'Typisch in 7–10 Werktagen online',
            'Innsbruck · München · Ingolstadt · DACH',
            'Hosting & kleine Pflege inklusive',
          ].map((m, i) => (
            <span key={i} className="whitespace-nowrap inline-flex items-center gap-3">
              <span className="opacity-80">{m}</span>
              <span aria-hidden className="opacity-40">✦</span>
            </span>
          ))}
        </Marquee>
      </div>

      <header
        className={`fixed top-[36px] left-0 right-0 z-40 transition-all duration-300 ${
          headerSolid
            ? 'bg-[#0b0810]/95 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.5)]'
            : 'bg-transparent'
        }`}
      >
        <div className="container-x flex items-center justify-between py-3">
          <Link to="/" className="flex items-center leading-none group" aria-label={AGENCY.fullName}>
            <img
              src={AGENCY.logoFullBesideSrc}
              alt={AGENCY.name}
              className="h-9 md:h-10 w-auto transition-transform group-hover:scale-[1.03]"
            />
          </Link>
          <nav className="hidden lg:flex items-center gap-0.5">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) =>
                  `px-3 py-1.5 text-[13px] font-medium rounded-full transition-colors ${isActive ? 'bg-white/15 text-white' : 'text-white/70 hover:text-white hover:bg-white/5'}`
                }
              >
                {n.label}
              </NavLink>
            ))}
            <span className="w-px h-5 bg-white/20 mx-2" />
            <Link to="/kontakt" className="btn-accent !py-1.5 !px-4 text-[13px]">
              Beratung <span aria-hidden>→</span>
            </Link>
            <Link to="/demo" className="ml-1.5 rounded-full border border-white/30 px-4 py-1.5 text-[13px] font-medium text-white transition hover:bg-white/10">
              Demo
            </Link>
          </nav>
          <button
            onClick={() => setMobile(true)}
            className="lg:hidden p-2 rounded-full border text-white border-white/30"
            aria-label="Menü öffnen"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </header>

      {mobile && (
        <div className="fixed inset-0 z-[60] bg-[var(--bg-color)]">
          <div className="container-x py-5 flex justify-between items-center">
            <div className="flex items-center leading-none">
              <img src={AGENCY.logoFullBesideSrc} alt={AGENCY.name} className="h-12 w-auto" />
            </div>
            <button onClick={() => setMobile(false)} className="p-2" aria-label="Schließen">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <nav className="container-x flex flex-col gap-1 mt-8">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setMobile(false)}
                className="py-5 text-5xl font-display border-b border-line transition-transform hover:translate-x-2 text-slate-800"
              >
                {n.label}
              </Link>
            ))}
            <Link to="/kontakt" onClick={() => setMobile(false)} className="btn-accent mt-10 self-start">
              Beratung anfragen <span aria-hidden>→</span>
            </Link>
          </nav>
        </div>
      )}

      <main id="main" className="flex-1">
        <Outlet />
      </main>

      <ShowcaseFooter />
    </div>
  );
}

function ShowcaseFooter() {
  return (
    <footer className="bg-black text-white pt-24 pb-10 mt-auto relative overflow-hidden">
      <div className="container-x">
        <div className="grid md:grid-cols-12 gap-10 pt-4 pb-14 border-b border-white/10">
          <div className="md:col-span-5">
            <div className="flex items-center leading-none">
              <img
                src={AGENCY.logoFullSrc}
                alt={AGENCY.name}
                className="h-20 md:h-24 w-auto"
              />
            </div>
            <p className="text-sm text-white/70 mt-4 max-w-sm">{AGENCY.tagline}</p>
            <div className="mt-6 flex flex-col gap-1.5 text-sm">
              <a href={`mailto:${AGENCY.email}`} className="hover:text-accent">{AGENCY.email}</a>
              <a href={`tel:${AGENCY.phone.replace(/\s/g,'')}`} className="hover:text-accent">{AGENCY.phone}</a>
              <a href={`tel:${AGENCY.phoneAt.replace(/\s/g,'')}`} className="hover:text-accent">{AGENCY.phoneAt}</a>
              <span className="text-white/60">Innsbruck · München · Ingolstadt</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-8 py-14 text-sm">
          <div>
            <p className="text-xs uppercase tracking-widest text-white/50 mb-4">Angebot</p>
            <ul className="space-y-2">
              <li><Link to="/templates" className="hover:text-accent">Templates</Link></li>
                  <li><Link to="/prozess" className="hover:text-accent">Ablauf</Link></li>
                  <li><Link to="/preise" className="hover:text-accent">Preise</Link></li>
                  <li><Link to="/blog" className="hover:text-accent">Blog</Link></li>
                  <li><Link to="/ueber-uns" className="hover:text-accent">Über uns</Link></li>
              <li><Link to="/kontakt" className="hover:text-accent">Kontakt</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-white/50 mb-4">Branchen</p>
            <ul className="space-y-2">
              <li><a href="https://www.demo.flamingomedia.online/demo/handwerk" className="hover:text-accent">Handwerk</a></li>
              <li><a href="https://www.demo.flamingomedia.online/demo/restaurant" className="hover:text-accent">Restaurant</a></li>
              <li><a href="https://www.demo.flamingomedia.online/demo/hotel" className="hover:text-accent">Hotel</a></li>
              <li><a href="https://www.demo.flamingomedia.online/demo/salon" className="hover:text-accent">Salon &amp; Beauty</a></li>
              <li><a href="https://www.demo.flamingomedia.online/demo/medical" className="hover:text-accent">Arztpraxis</a></li>
              <li><a href="https://www.demo.flamingomedia.online/demo/tourism" className="hover:text-accent">Tourismus</a></li>
              <li><a href="https://www.demo.flamingomedia.online/demo/wedding" className="hover:text-accent">Hochzeit</a></li>
              <li><a href="https://www.demo.flamingomedia.online/demo/photography" className="hover:text-accent">Fotografie</a></li>
              <li><a href="https://www.demo.flamingomedia.online/demo/consulting" className="hover:text-accent">Kanzlei &amp; Beratung</a></li>
              <li><a href="https://www.demo.flamingomedia.online/demo/realestate" className="hover:text-accent">Immobilien</a></li>
              <li><a href="https://www.demo.flamingomedia.online/demo/cafe" className="hover:text-accent">Café</a></li>
              <li><a href="https://www.demo.flamingomedia.online/demo/tattoo" className="hover:text-accent">Tattoo Studio</a></li>
              <li><a href="https://www.demo.flamingomedia.online/demo/florist" className="hover:text-accent">Floristik</a></li>
              <li><a href="https://www.demo.flamingomedia.online/demo/fitness" className="hover:text-accent">Fitness</a></li>
              <li><a href="https://www.demo.flamingomedia.online/demo/location" className="hover:text-accent">Location</a></li>
              <li><a href="https://www.demo.flamingomedia.online/demo/eishockey" className="hover:text-accent">Verein &amp; Sport</a></li>
              <li><a href="https://www.demo.flamingomedia.online/demo/shop" className="hover:text-accent">Online-Shop</a></li>
              <li><a href="https://www.demo.flamingomedia.online/demo/retail" className="hover:text-accent">Einzelhandel</a></li>
            </ul>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-white/50 mb-4">Region</p>
            <ul className="space-y-2 text-white/70">
              <li>Innsbruck</li>
              <li>München</li>
              <li>Ingolstadt</li>
              <li>DACH-weit auf Anfrage</li>
            </ul>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-white/50 mb-4">Rechtliches</p>
            <ul className="space-y-2">
              <li><Link to="/impressum" className="hover:text-accent">Impressum</Link></li>
              <li><Link to="/datenschutz" className="hover:text-accent">Datenschutz</Link></li>
            </ul>
          </div>
        </div>

        <Marquee speed="slow" className="py-2">
          <span
            className="font-display leading-none whitespace-nowrap"
            style={{ fontSize: 'clamp(4rem,12vw,12rem)', color: 'rgba(255,255,255,0.08)' }}
          >
            FLAMINGOMEDIA · FLAMINGOMEDIA · FLAMINGOMEDIA ·
          </span>
        </Marquee>

        <div className="mt-10 pt-6 border-t border-white/10 text-xs text-white/50 flex flex-col md:flex-row gap-2 justify-between">
          <span>© {new Date().getFullYear()} {AGENCY.name}. Alle Rechte vorbehalten.</span>
          <span className="font-mono">Made with care · Innsbruck</span>
        </div>
      </div>
    </footer>
  );
}

/* ─── Landing ─────────────────────────────────────────────────────── */
function Landing({ newsSlot }: { newsSlot?: ReactNode } = {}) {
  return (
    <>
      <Seo title="FlamingoMedia · Websites für lokale Marken" description="Websites für lokale Betriebe in Innsbruck, München, Ingolstadt und der DACH-Region. Starkes Design, eigenes CMS, SEO-Grundlage und Inhalte, die Du selbst pflegst." />
      <HeroSection />
      <ClientLogosSection />
      <ServicesSection />
      <TemplatesPreviewSection />
      <DeviceShowcaseSection />
      <ManifestoSection />
      <AdminPreviewSection />
      <CmsFeaturesTeaserSection />
      <ShopFeaturesTeaserSection />
      <BookingAddonTeaserSection />
      <ProcessTimelineSection />
      <ProductionSection />
      <NumbersSection />
      <TestimonialsSection />
      {newsSlot}
      <CalloutFooter />
    </>
  );
}

function BookingAddonTeaserSection() {
  const items = [
    'Anfrage oder direkte Buchung',
    'Zeitslots, ganze Tage oder Datumsbereiche',
    'Tische, Räume, Mitarbeiter oder Equipment',
    'Automatische E-Mails über Kunden- oder Flamingo-SMTP',
  ];

  return (
    <section className="py-20 md:py-24 surface">
      <div className="container-x grid gap-10 md:grid-cols-12 md:items-center">
        <div className="md:col-span-6 reveal">
          <p className="eyebrow mb-5">Neu als Add-on</p>
          <h2 className="headline-lg">
            Buchungen.<br />
            <em className="italic-pop">Direkt in Deiner Website.</em>
          </h2>
          <p className="mt-6 max-w-xl text-lg text-muted leading-relaxed">
            Für Restaurants, Cafés, Salons, Hotels, Fotografen, Locations und alle, die Termine oder Ressourcen nicht mehr per E-Mail-Chaos koordinieren wollen.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/booking" className="btn-primary">Booking-Addon ansehen <span aria-hidden>→</span></Link>
            <Link to="/kontakt" className="btn-outline">Booking anfragen</Link>
          </div>
        </div>
        <div className="md:col-span-6 reveal">
          <div className="rounded-3xl bg-brand p-6 text-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-5">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-white/50">/ Booking-Addon</p>
                <h3 className="mt-2 font-display text-3xl">399 € Setup</h3>
                <p className="mt-1 text-sm text-white/65">+ 20 € / Monat für Buchungslogik und Betrieb</p>
              </div>
              <span className="rounded-full bg-[var(--accent-color)] px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white">Paid Feature</span>
            </div>
            <div className="mt-6 grid gap-3">
              {items.map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/82">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroSection() {
  return (
    <section className="relative min-h-[100vh] flex items-end overflow-hidden text-white grain group/hero">
      {/* Layered backgrounds — solid base, GPU-only mouse glow (desktop only), thin grid for texture. */}
      <div className="absolute inset-0 -z-10 bg-[#0b1020]" />
      <div className="hidden md:block">
        <MouseGlow
          className="-z-[5]"
          colorA="rgba(124,58,237,0.55)"
          colorB="rgba(242,65,113,0.65)"
        />
      </div>
      <AnimatedGridPattern
        className="-z-[2] text-white/[0.05]"
        width={40}
        height={40}
        dotSize={1.2}
      />

      {/* Centered brand mark — sits behind copy, glows on hover (desktop). On mobile we just show the mark a bit larger as a static backdrop since there's no cursor. */}
      <div
        className="hero-brand-mark pointer-events-none absolute inset-0 -z-[3] flex items-center justify-center"
        aria-hidden
      >
        <img
          src={AGENCY.logoMarkSrc}
          alt=""
          className="hero-brand-mark__img w-[70%] max-w-[520px] md:w-[44%] lg:w-[38%]"
        />
      </div>
      <style>{`
        .hero-brand-mark__img {
          opacity: 0.18;
          filter: drop-shadow(0 0 60px rgba(242,65,113,0.18));
          will-change: opacity, filter, transform;
          transition: opacity 700ms ease, filter 700ms ease, transform 700ms ease;
        }
        @media (hover: hover) and (pointer: fine) {
          .hero-brand-mark__img { opacity: 0.12; }
          .group\\/hero:hover .hero-brand-mark__img {
            opacity: 0.42;
            filter: drop-shadow(0 0 80px rgba(242,65,113,0.85)) drop-shadow(0 0 28px rgba(124,58,237,0.45));
            transform: scale(1.02);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-brand-mark__img { transition: none; }
        }
      `}</style>

      <div className="container-x relative z-10 pt-44 pb-24 md:pb-32">
        <p className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-white/80 mb-8">
          <span className="h-2 w-2 rounded-full bg-[var(--accent-color)] animate-pulse" />
          {AGENCY.tagline}
        </p>

        <h1 className="headline-xl max-w-6xl">
          Websites für
          <br />
          <em className="italic-pop" style={{ color: 'var(--accent-color)' }}>
            <RotatingWord words={ROTATING_WORDS} />
          </em>
        </h1>

        <div className="grid md:grid-cols-12 gap-8 mt-14">
          <p className="md:col-span-7 text-lg md:text-2xl text-white/85 leading-relaxed reveal-fast is-visible">
            Wir gestalten Websites, die klar führen, Vertrauen schaffen und Anfragen bringen.
            Starkes Design, saubere Technik, Inhalte im eigenen CMS und auf Wunsch Foto und Video von unserem Team.
          </p>
          <div className="md:col-span-5 md:pl-8 md:border-l border-white/15 self-end reveal-fast is-visible">
            <p className="font-mono text-xs text-white/60 uppercase tracking-widest mb-4">/ Typisch in 7–10 Werktagen online</p>
            <div className="flex flex-wrap gap-3">
              <MagneticButton strength={22}>
                <Link to="/templates" className="btn-accent">Live-Demos ansehen <span aria-hidden>→</span></Link>
              </MagneticButton>
              <MagneticButton strength={18}>
                <Link to="/preise" className="btn-outline !border-white/60 !text-white hover:!bg-white hover:!text-slate-900">
                  Preise &amp; Pakete
                </Link>
              </MagneticButton>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator – hidden on mobile so it doesn't overlap the price/package CTA. */}
      <a
        href="#mehr"
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/90 hover:text-white hidden md:flex flex-col items-center gap-2 z-20"
        aria-label="Weiter scrollen"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] opacity-80">Scroll</span>
        <span className="block h-10 w-[1px] bg-white/40 relative overflow-hidden">
          <span className="absolute top-0 left-0 right-0 h-1/3 bg-white" style={{ animation: 'scrollLine 1.6s ease-in-out infinite' }} />
        </span>
      </a>
      <style>{`@keyframes scrollLine { 0%{transform:translateY(-100%)} 100%{transform:translateY(300%)} }`}</style>
    </section>
  );
}

function ClientLogosSection() {
  const ITEMS = [
    'Restaurants', 'Salons & Beauty', 'Handwerk', 'Cafés', 'Bäckereien',
    'Hotels & Pensionen', 'Praxen & Ärzte', 'Beratung & Kanzleien',
    'Studios & Coaching', 'Ateliers', 'Werkstätten', 'Boutiquen',
    'Weingüter', 'Bars & Clubs', 'Immobilien-Makler', 'Floristen',
  ];
  return (
    <section className="py-12 md:py-16 surface border-y border-line" id="mehr">
      <div className="container-x mb-6">
        <p className="eyebrow">Branchen, die wir verstehen</p>
      </div>
      <Marquee speed="slow">
        {ITEMS.map((n, i) => (
          <span key={i} className="font-display text-3xl md:text-5xl text-muted whitespace-nowrap">
            {n}
            <span className="text-[var(--accent-color-2)] ml-12">✦</span>
          </span>
        ))}
        <span className="font-display text-3xl md:text-5xl whitespace-nowrap italic" style={{ color: 'var(--accent-color-2)' }}>
          und viele mehr
          <span className="text-muted ml-12">✦</span>
        </span>
      </Marquee>
    </section>
  );
}

function ServicesSection() {
  return (
    <SpotlightSection
      as="section"
      color="rgba(242,65,113,0.18)"
      size={700}
      className="py-24 md:py-32 bg-brand text-white"
    >
      <AnimatedGridPattern className="text-white/[0.05]" width={48} height={48} dotSize={1.5} />
      <div className="container-x relative">
        <div className="grid md:grid-cols-12 gap-8 mb-16 items-end">
          <div className="md:col-span-7 reveal">
            <p className="eyebrow mb-5" style={{ color: 'rgba(255,255,255,0.7)' }}>
              <span style={{ background: 'rgba(255,255,255,0.5)' }} />Was wir machen
            </p>
            <h2 className="headline-lg text-white">
              <TextReveal text="Studio" /><br />
              <em className="italic-pop" style={{ color: 'var(--accent-color)' }}>
                <TextReveal text="für lokale Marken." />
              </em>
            </h2>
          </div>
          <p className="md:col-span-5 text-lg text-white/75 leading-relaxed reveal">
            Ein Team für Konzept, Design, CMS, Inhalte, Hosting und Pflege. Du bekommst keinen Baukasten,
            sondern eine Website, die schnell live geht und danach einfach weiterlebt.
          </p>
        </div>

        {/* Bento grid: 4 tiles with asymmetric sizes */}
        <div className="grid md:grid-cols-6 gap-4 reveal-stagger">
          <BentoCard
            className="md:col-span-4 p-8 md:p-12 min-h-[320px] !bg-white text-slate-900"
            accent="rgba(242,65,113,0.22)"
          >
            <div className="flex items-start justify-between mb-12">
              <span className="font-mono text-xs text-muted">01</span>
              <span className="text-xs uppercase tracking-widest text-brand bg-[var(--accent-color)] text-white px-3 py-1 rounded-full">
                Typisch 7–10 Werktage
              </span>
            </div>
            <h3 className="font-display text-3xl md:text-5xl leading-[1.05] tracking-tight">Branchen-Templates</h3>
            <p className="mt-6 text-base md:text-lg text-muted leading-relaxed max-w-xl">
              Siebzehn Branchen live — Restaurant, Salon, Hotel, Tourismus, Arztpraxis, Handwerk, Hochzeit, Fotografie, Kanzlei, Immobilien, Café, Tattoo Studio, Floristik, Fitness, Location, Online-Shop und Einzelhandel.
              Mit echten Unterseiten, passenden Sections und einem Admin, der sich nach Alltag anfühlt.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {['Restaurant', 'Salon', 'Hotel', 'Tourismus', 'Handwerk', 'Arztpraxis', 'Hochzeit', 'Fotografie', 'Kanzlei', 'Immobilien', 'Café', 'Tattoo', 'Floristik', 'Fitness', 'Location', 'Einzelhandel'].map((b) => (
                <span key={b} className="hidden md:inline-block text-[11px] font-mono uppercase tracking-widest border border-line rounded-full px-2.5 py-1 text-muted">{b}</span>
              ))}
            </div>
          </BentoCard>

          <BentoCard
            className="md:col-span-2 p-8 md:p-10 min-h-[320px] !bg-[var(--accent-color)] !border-transparent text-white"
            accent="rgba(255,255,255,0.18)"
          >
            <span className="font-mono text-xs text-white/80">02</span>
            <h3 className="mt-12 font-display text-3xl md:text-4xl leading-[1.05] tracking-tight">Custom Design</h3>
            <p className="mt-5 text-sm text-white/90 leading-relaxed">
              Wenn Template nicht reicht: eigenes Design, eigene Funktionen und eigene
              Sections. Ohne unnötigen Agentur-Overhead.
            </p>
            <p className="mt-6 text-[11px] uppercase tracking-widest text-white/80 font-mono">Ab 4 Wochen</p>
          </BentoCard>

          <BentoCard
            className="md:col-span-3 p-8 md:p-10 min-h-[280px] !bg-slate-900 !border-white/10 text-white"
            accent="rgba(255,179,71,0.25)"
          >
            <div className="flex items-start justify-between">
              <span className="font-mono text-xs text-white/60">03</span>
              <span className="text-[11px] font-mono uppercase tracking-widest text-white/70 border border-white/20 rounded-full px-2.5 py-1">On-Location</span>
            </div>
            <h3 className="mt-10 font-display text-3xl md:text-4xl leading-[1.05] tracking-tight">Foto &amp; Video</h3>
            <p className="mt-5 text-sm text-white/75 leading-relaxed max-w-md">
              Eigenes Team kommt zu Dir ins Lokal, in die Praxis, in den Salon oder auf die
              Baustelle. Bilder, die nach Dir aussehen – nicht nach Stockfotos.
            </p>
          </BentoCard>

          <BentoCard
            className="md:col-span-3 p-8 md:p-10 min-h-[280px] !bg-white text-slate-900"
            accent="rgba(124,58,237,0.18)"
          >
            <div className="flex items-start justify-between">
              <span className="font-mono text-xs text-muted">04</span>
              <span className="text-[11px] font-mono uppercase tracking-widest text-muted border border-line rounded-full px-2.5 py-1">Sorglos-Paket</span>
            </div>
            <h3 className="mt-10 font-display text-3xl md:text-4xl leading-[1.05] tracking-tight">Hosting &amp; Pflege</h3>
            <p className="mt-5 text-sm text-muted leading-relaxed">
              Schnelles Hosting, Updates und kleine Anpassungen zum Pauschalpreis. 29 €/Monat –
              mit Ansprechpartner statt Ticket-Lotterie.
            </p>
            <p className="mt-6 font-display text-3xl tabular-nums">
              29<span className="text-base text-muted ml-1">€/Monat</span>
            </p>
          </BentoCard>
        </div>
      </div>
    </SpotlightSection>
  );
}

const DEMO_BASE = 'https://www.demo.flamingomedia.online';
const FEATURED_TEMPLATE_KEYS: Array<keyof typeof TEMPLATE_META> = [
  'handwerk',
  'restaurant',
  'medical',
  'hotel',
  'consulting',
  'shop',
];

function TemplatesPreviewSection() {
  return (
    <section className="py-24 md:py-32 surface">
      <div className="container-x">
        <div className="grid md:grid-cols-12 gap-8 mb-14 items-end">
          <div className="md:col-span-7 reveal">
            <p className="eyebrow mb-5">Templates</p>
            <h2 className="headline-lg">
              Unsere Templates.<br />
              <em className="italic-pop">Dein Vorsprung.</em>
            </h2>
          </div>
          <p className="md:col-span-5 text-lg text-muted reveal">
            Branchenspezifische Templates mit echten Seiten, passenden Sections, einem konsistenten Basisstil und einem Admin,
            der nur zeigt, was Du wirklich brauchst. Deine Branche fehlt? Dann bauen wir sie sauber nach.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 reveal-stagger">
          {FEATURED_TEMPLATE_KEYS.map((k) => {
            const m = TEMPLATE_META[k];
            return (
              <Tilt3DCard key={k} max={8} className="rounded-3xl">
              <a
                href={`${DEMO_BASE}/demo/${k}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative rounded-3xl overflow-hidden aspect-[4/5] hover-lift block"
              >
                <img src={m.image} alt={m.label} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute top-5 left-5 right-5 flex justify-between items-start">
                  <span className="text-xs font-mono text-white/80 uppercase tracking-widest">/ {k}</span>
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ background: m.accent, boxShadow: `0 0 20px ${m.accent}` }}
                  />
                </div>
                <div className="relative p-8 h-full flex flex-col justify-end text-white">
                  <p className="text-xs uppercase tracking-widest text-white/90 mb-2">{m.tagline}</p>
                  <h3 className="font-display text-4xl md:text-5xl">{m.label}</h3>
                  <p className="mt-3 text-sm text-white/80 leading-relaxed max-w-xs">{m.description}</p>
                  <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium border-t border-white/20 pt-4">
                    Live-Demo ansehen
                    <span aria-hidden className="transition-transform group-hover:translate-x-2">→</span>
                  </div>
                </div>
              </a>
              </Tilt3DCard>
            );
          })}

        </div>

        <div className="mt-14 text-center reveal">
          <Link to="/templates" className="btn-outline">Alle 17 Live-Demos ansehen <span aria-hidden>→</span></Link>
        </div>
      </div>
    </section>
  );
}

function ManifestoSection() {
  return (
    <section className="py-32 md:py-44 bg-brand text-white relative overflow-hidden grain">
      <div className="blob -top-40 right-0 w-[600px] h-[600px]" style={{ background: 'var(--accent-color)', opacity: 0.18 }} />
      <div className="container-x relative">
        <p className="eyebrow !text-white/60 mb-6" style={{ color: 'rgba(255,255,255,0.6)' }}>
          <span style={{ background: 'rgba(255,255,255,0.4)' }} />Was uns wichtig ist
        </p>
        <h2 className="headline-lg max-w-5xl">
          <span className="text-white/40">Wir bauen keine starren Templates.</span> Wir bauen <em className="italic-pop" style={{ color: 'var(--accent-color)' }}>anpassbare Systeme</em>, mit denen Du weiterarbeiten kannst – auch wenn wir nicht da sind.
        </h2>

        <div className="grid md:grid-cols-3 gap-12 mt-20 reveal-stagger">
          {[
            {
              t: 'Inhalt vor Effekt.',
              d: 'Eine Website soll zeigen, warum man Dich wählen sollte. Animationen sind die Würze, nicht das Hauptgericht.',
            },
            {
              t: 'Eigentum, nicht Miete.',
              d: 'Du hast jederzeit Zugriff auf Deinen Code, Deine Inhalte und Deine Bilder. Keine Geiselhaft, kein Lock-in.',
            },
            {
              t: 'Funktionen, die Alltag sparen.',
              d: 'CMS, Shop, Booking, Formulare, SEO und Live-Vorschau sitzen in einem System. Du pflegst nicht nur Texte, sondern echte Workflows.',
            },
          ].map((b, i) => (
            <div key={i} className="border-t border-white/15 pt-8">
              <p className="font-mono text-xs text-white/40 mb-4">/ {String(i + 1).padStart(2, '0')}</p>
              <h3 className="headline-md text-white">{b.t}</h3>
              <p className="mt-5 text-white/70 leading-relaxed">{b.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Device Showcase: live iframes inside MacBook + iPad + iPhone ─── */
type DeviceItem = {
  kind: 'laptop' | 'tablet' | 'phone';
  src: string;
  label: string;
  caption: string;
  image?: string; // static image fallback instead of iframe
};

const RENDERER_URL = process.env.NEXT_PUBLIC_RENDERER_URL || 'https://www.demo.flamingomedia.online';

const ADMIN_URL_SHOWCASE = 'https://www.demo.flamingomedia.online';
const demoAdminUrl = (next = '/admin') => `${ADMIN_URL_SHOWCASE}/admin/demo-login?industry=handwerk&public=1&embed=1&next=${encodeURIComponent(next)}`;

const DEVICE_ITEMS: DeviceItem[] = [
  {
    kind: 'laptop',
    src: `${RENDERER_URL}/demo/handwerk?embed=1`,
    label: 'Handwerk · Home',
    caption: 'Handwerk-Template auf dem Desktop',
  },
  {
    kind: 'tablet',
    src: demoAdminUrl('/admin'),
    label: 'Admin-Bereich',
    caption: 'Inhalte pflegen, ohne Code',
  },
  {
    kind: 'phone',
    src: `${RENDERER_URL}/demo/restaurant?embed=1`,
    label: 'Restaurant · Home',
    caption: 'Mobile zuerst gedacht',
  },
];

function LiveDeviceFrame({ item }: { item: DeviceItem }) {
  // Only mount the iframe once the device scrolls into view, then keep it
  // alive. Saves the landing page from booting three full SPA instances on
  // first paint while still feeling instant once the user scrolls down.
  const wrapRef = useRef<HTMLDivElement>(null);
  const [mount, setMount] = useState(false);
  useEffect(() => {
    const el = wrapRef.current;
    if (!el || mount) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setMount(true);
          io.disconnect();
        }
      },
      { rootMargin: '300px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [mount]);

  // Each device gets its own logical viewport so the embedded site renders at
  // a believable resolution and is then scaled to fit the frame. We measure
  // the wrapper's actual rendered width with a ResizeObserver and set the
  // scale factor as a CSS variable. Doing the math in JS sidesteps any
  // container-query/positioning subtleties that previously caused the
  // scaled iframe to overflow the screen by a few percent.
  const dims =
    item.kind === 'laptop'
      ? { vw: 1280, vh: 800 }
      : item.kind === 'tablet'
        ? { vw: 820, vh: 1180 }
        : { vw: 390, vh: 844 };

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const apply = () => {
      const w = el.clientWidth;
      if (!w) return;
      const scale = w / dims.vw;
      el.style.setProperty('--device-scale', String(scale));
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    return () => ro.disconnect();
  }, [dims.vw]);

  const iframe = mount ? (
    item.image ? (
      <img
        src={item.image}
        alt={item.label}
        style={{
          width: `${dims.vw}px`,
          height: `${dims.vh}px`,
          objectFit: 'cover',
          objectPosition: 'top left',
        }}
      />
    ) : (
    <iframe
      title={item.label}
      src={item.src}
      loading="lazy"
      tabIndex={-1}
      style={{
        width: `${dims.vw}px`,
        height: `${dims.vh}px`,
        border: '0',
      }}
    />
    )
  ) : (
    <div
      style={{ width: `${dims.vw}px`, height: `${dims.vh}px` }}
      className="bg-slate-100 grid place-items-center text-xs text-slate-400"
    >
      lädt …
    </div>
  );

  return (
    <div ref={wrapRef} className="device-frame__inner">
      {iframe}
    </div>
  );
}

function DeviceShowcaseSection() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-[#0b0810] text-white">
      <div
        aria-hidden
        className="absolute inset-0 -z-0 opacity-70"
        style={{
          background:
            'radial-gradient(50% 50% at 15% 20%, rgba(242,65,113,0.18), transparent 70%),' +
            'radial-gradient(50% 50% at 85% 80%, rgba(124,58,237,0.18), transparent 70%)',
        }}
      />
      <div className="container-x relative">
        <div className="max-w-3xl reveal">
          <p className="eyebrow text-white/70 mb-5">In Aktion</p>
          <h2 className="headline-md">
            Echte Templates.<br />
            <em className="italic-pop">Echter Admin.</em>
          </h2>
          <p className="mt-6 text-white/75 max-w-xl">
            Einblicke in Templates und Admin-Bereich – live, auf Laptop, Tablet und Phone.
            Auf jedem Gerät, in jeder Größe.
          </p>
        </div>

        <div className="mt-16 md:mt-20 grid lg:grid-cols-12 gap-10 lg:gap-8 items-end">
          {/* Laptop — left, takes more space on lg+; full width on mobile */}
          <div className="lg:col-span-7 reveal">
            <DeviceLaptop>
              <LiveDeviceFrame item={DEVICE_ITEMS[0]} />
            </DeviceLaptop>
            <DeviceCaption {...DEVICE_ITEMS[0]} />
          </div>

          {/* Right column: tablet + phone. Stack on mobile so each device
              has enough width to render its content readably; side-by-side
              from sm: upward, integrated into the laptop column from lg:. */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-5 gap-8 sm:gap-4 lg:gap-6 reveal">
            <div className="sm:col-span-3">
              <DeviceTablet>
                <LiveDeviceFrame item={DEVICE_ITEMS[1]} />
              </DeviceTablet>
              <DeviceCaption {...DEVICE_ITEMS[1]} dark />
            </div>
            <div className="sm:col-span-2 max-w-[60%] sm:max-w-none mx-auto sm:mx-0">
              <DevicePhone>
                <LiveDeviceFrame item={DEVICE_ITEMS[2]} />
              </DevicePhone>
              <DeviceCaption {...DEVICE_ITEMS[2]} dark />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        /* Shared inner wrapper: fits any iframe and scales it to the frame.
           The actual scale factor is set via the --device-scale CSS variable
           by JS (ResizeObserver) — that is the most reliable way to keep
           the scaled iframe pixel-perfect inside the device screen, regardless
           of bezels, borders or scrollbars. */
        .device-frame__inner {
          position: absolute;
          inset: 0;
          background: #ffffff;
          overflow: hidden;
        }
        .device-frame__inner > iframe,
        .device-frame__inner > div {
          transform-origin: top left;
          transform: scale(var(--device-scale, 1));
        }
        /* Laptop frame (MacBook-ish). */
        .device-laptop {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 10;
          border-radius: 18px;
          padding: 14px;
          background: linear-gradient(180deg, #2a2530, #15131a);
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 40px 80px -30px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(255,255,255,0.04);
        }
        .device-laptop__screen {
          position: absolute;
          inset: 14px;
          border-radius: 6px;
          overflow: hidden;
          background: #fff;
        }
        .device-laptop__notch {
          position: absolute;
          top: 4px;
          left: 50%;
          transform: translateX(-50%);
          width: 60px;
          height: 6px;
          border-radius: 0 0 8px 8px;
          background: #0b0810;
        }
        .device-laptop__base {
          position: absolute;
          left: -3%;
          right: -3%;
          bottom: -10px;
          height: 14px;
          border-radius: 0 0 14px 14px;
          background: linear-gradient(180deg, #1c1922, #0b0810);
          box-shadow: 0 14px 30px -10px rgba(0,0,0,0.6);
        }
        /* Tablet frame (iPad-ish). */
        .device-tablet {
          position: relative;
          width: 100%;
          aspect-ratio: 3 / 4;
          border-radius: 28px;
          padding: 10px;
          background: linear-gradient(180deg, #2a2530, #15131a);
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 30px 60px -25px rgba(0,0,0,0.6);
        }
        .device-tablet__screen {
          position: absolute;
          inset: 10px;
          border-radius: 18px;
          overflow: hidden;
          background: #fff;
        }
        /* Phone frame (iPhone-ish with dynamic island). */
        .device-phone {
          position: relative;
          width: 100%;
          aspect-ratio: 9 / 19.5;
          border-radius: 36px;
          padding: 8px;
          background: linear-gradient(180deg, #2a2530, #15131a);
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 30px 50px -20px rgba(0,0,0,0.65);
        }
        .device-phone__screen {
          position: absolute;
          inset: 8px;
          border-radius: 28px;
          overflow: hidden;
          background: #fff;
        }
        .device-phone__island {
          position: absolute;
          top: 14px;
          left: 50%;
          transform: translateX(-50%);
          width: 32%;
          height: 18px;
          border-radius: 9999px;
          background: #0b0810;
          z-index: 2;
        }
        @media (prefers-reduced-motion: reduce) {
          .device-laptop, .device-tablet, .device-phone { transition: none; }
        }
      `}</style>
    </section>
  );
}

function DeviceLaptop({ children }: { children: ReactNode }) {
  return (
    <div className="device-laptop">
      <div className="device-laptop__notch" aria-hidden />
      <div className="device-laptop__screen">{children}</div>
      <div className="device-laptop__base" aria-hidden />
    </div>
  );
}
function DeviceTablet({ children }: { children: ReactNode }) {
  return (
    <div className="device-tablet">
      <div className="device-tablet__screen">{children}</div>
    </div>
  );
}
function DevicePhone({ children }: { children: ReactNode }) {
  return (
    <div className="device-phone">
      <div className="device-phone__island" aria-hidden />
      <div className="device-phone__screen">{children}</div>
    </div>
  );
}
function DeviceCaption({ label, caption, dark }: { label: string; caption: string; dark?: boolean }) {
  return (
    <div className={`mt-5 ${dark ? 'text-white/80' : 'text-white/85'}`}>
      <p className="text-xs uppercase tracking-widest text-accent">{label}</p>
      <p className="mt-1 text-sm text-white/70">{caption}</p>
    </div>
  );
}

function AdminPreviewSection() {
  return <LiveAdminShowcase mode="cms" compact showTabs={false} smallPreview />;
}

function ProcessTimelineSection() {
  const steps = [
    {
      n: '01',
      t: 'Kennenlernen',
      d: 'Wir sprechen 30 Minuten über Deinen Betrieb, Dein Ziel und Deinen Stil. Kostenlos, unverbindlich, ohne Sales-Gedöns.',
      meta: 'Tag 1',
    },
    {
      n: '02',
      t: 'Foto- & Videoshooting',
      d: 'Optional als Add-on: Wir kommen mit kleinem Team vor Ort und produzieren passende Bilder und kurzen Bewegtbild-Content. Buchbar auch separat.',
      meta: 'Optional',
    },
    {
      n: '03',
      t: 'Aufbau & Befüllung',
      d: 'Du wählst Template und Farbschema. Wir bauen auf, befüllen mit Deinen Inhalten und schicken Dir einen Preview-Link.',
      meta: 'Tag 2–7',
    },
    {
      n: '04',
      t: 'Live-Schaltung',
      d: 'Du gibst grünes Licht. Wir schalten live, übergeben den Admin-Bereich und sind ab da Dein direkter Ansprechpartner.',
      meta: 'Tag 8–10',
    },
  ];
  return (
    <section className="py-24 md:py-32 surface">
      <div className="container-x">
        <div className="grid md:grid-cols-12 gap-8 mb-14 items-end">
          <div className="md:col-span-7 reveal">
            <p className="eyebrow mb-5">Ablauf</p>
            <h2 className="headline-lg">Typisch in <em className="italic-pop">7–10 Werktagen</em> online.</h2>
          </div>
          <p className="md:col-span-5 text-lg text-muted reveal">
            Vom ersten Anruf bis zur Live-Schaltung – ein klarer Ablauf ohne Überraschungen.
            Wie schnell es geht, hängt vor allem davon ab, wie zügig Inhalte (Texte, Fotos)
            von Deiner Seite kommen. Du weißt jederzeit, wo wir gerade stehen.
          </p>
        </div>

        <ol className="relative md:grid md:grid-cols-4 md:gap-6">
          {steps.map((s, i) => (
            <li
              key={s.n}
              className={`relative md:border-l border-t md:border-t-0 border-line p-6 md:p-7 reveal min-w-0 ${i === 0 ? '' : ''}`}
            >
              {/* connector dot */}
              <span
                className="absolute -left-1.5 -top-1.5 md:left-[-7px] md:top-7 h-3 w-3 rounded-full bg-brand"
                style={{ boxShadow: '0 0 0 6px var(--surface-color)' }}
              />
              <p className="font-mono text-xs text-muted">{s.n} · {s.meta}</p>
              <h3 className="font-display text-2xl md:text-3xl leading-tight mt-3 break-words hyphens-auto" lang="de">{s.t}</h3>
              <p className="mt-4 text-muted leading-relaxed text-sm md:text-base">{s.d}</p>
            </li>
          ))}
        </ol>

        <div className="mt-12 reveal">
          <Link to="/prozess" className="btn-outline">Detaillierter Ablauf <span aria-hidden>→</span></Link>
        </div>
      </div>
    </section>
  );
}

function ProductionSection() {
  const cards = [
    {
      t: 'Foto-Shooting',
      lines: ['Halber bis ganzer Tag vor Ort', '20–40 bearbeitete Bilder', 'Unbegrenzte Nutzung', 'Lieferung in ca. 2 Wochen'],
      img: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=900&q=80',
      featured: false,
    },
    {
      t: 'Imagefilm',
      lines: ['30–60 Sekunden Film', 'Kurzer Bewegtbild-Inhalt', 'Lizenzierte Hintergrundmusik', 'Web- & Social-Schnitt'],
      img: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=900&q=80',
      featured: true,
    },
    {
      t: 'Foto + Film',
      lines: ['Beides am gleichen Tag', 'Kombi-Konditionen', 'Social-Media-Cuts', 'Beste Preisleistung'],
      img: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=900&q=80',
      featured: false,
    },
  ];
  return (
    <section className="py-24 md:py-32 bg-brand text-white relative overflow-hidden grain">
      <div className="blob -top-32 -right-32 w-[600px] h-[600px]" style={{ background: 'var(--accent-color)', opacity: 0.16 }} />
      <div className="container-x relative">
        <div className="grid md:grid-cols-12 gap-8 mb-14 items-end">
          <div className="md:col-span-7 reveal">
            <p className="eyebrow !text-white/60 mb-5" style={{ color: 'rgba(255,255,255,0.6)' }}>
              <span style={{ background: 'rgba(255,255,255,0.4)' }} />Add-on · optional
            </p>
            <h2 className="headline-lg">
              Auf Wunsch:<br />
              <em className="italic-pop" style={{ color: 'var(--accent-color)' }}>Bilder & kurzer Film.</em>
            </h2>
          </div>
          <p className="md:col-span-5 text-lg text-white/80 reveal">
            Buchbar als Add-on. Wir kommen ins Lokal, in die Praxis, in den Salon, ins Studio oder auf die Baustelle und produzieren Inhalte, die zu Deiner Marke passen – nur wenn Du es wünschst.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 reveal-stagger">
          {cards.map((c) => (
            <article key={c.t} className={`relative rounded-3xl overflow-hidden border ${c.featured ? 'border-[var(--accent-color)]' : 'border-white/15'} hover-lift`}>
              <div className="aspect-[4/3] overflow-hidden">
                <img src={c.img} alt={c.t} className="w-full h-full object-cover transition-transform duration-1000 hover:scale-110" loading="lazy" />
              </div>
              <div className={`p-7 ${c.featured ? 'bg-[var(--accent-color)] text-brand' : 'bg-white/5 backdrop-blur-sm'}`}>
                <h3 className="font-display text-3xl mb-4">{c.t}</h3>
                <ul className="space-y-2 text-sm">
                  {c.lines.map((l) => (
                    <li key={l} className="flex gap-2">
                      <span className={c.featured ? 'text-brand' : 'text-[var(--accent-color)]'}>✓</span>
                      <span>{l}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-14 reveal">
          <Link to="/preise" className="btn-accent">Pakete &amp; Preise <span aria-hidden>→</span></Link>
        </div>
      </div>
    </section>
  );
}

function NumbersSection() {
  return (
    <section className="py-24 md:py-32">
      <div className="container-x">
        <div className="grid md:grid-cols-12 gap-8 mb-12 items-end">
          <h2 className="md:col-span-7 headline-lg reveal">
            In <em className="italic-pop">Zahlen.</em>
          </h2>
          <p className="md:col-span-5 text-lg text-muted reveal">
            17 Branchen live, über 80 Sections und volle Farbanpassung global oder je Section — ein Admin, mit dem Du alles selbst pflegst. Kein Agentur-Ticket nötig.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12 md:gap-y-0 reveal-stagger">
          {[
            { v: 17, s: '', l: 'Branchen-Templates' },
            { v: 100, s: '%', l: 'CMS-gesteuerte Designs' },
            { v: 80, s: '+', l: 'Sections kombinierbar' },
            { v: 1, s: '', l: 'Admin für Inhalte, Shop & Booking' },
          ].map((m, i) => (
            <div key={i} className="md:border-l border-line md:pl-8">
              <p className="num-display text-6xl md:text-8xl leading-none">
                {m.v}{m.s}
              </p>
              <p className="mt-4 text-xs uppercase tracking-widest text-muted">{m.l}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const quotes = [
    {
      t: 'FlamingoMedia hat unsere Brautstyling-Welt online genauso gefühlvoll gezeigt, wie wir sie morgens im Studio leben. Anfragen kommen jetzt vorab gebrieft – kein leeres Postfach mehr, sondern echte Termine.',
      a: 'Magdalena Johanna',
      r: 'Brautstylistin · Ingolstadt',
    },
    {
      t: 'Endlich eine Praxis-Website, die nicht steril wirkt. Online-Termin, klare Leistungen, Eltern finden auf einen Blick, was sie brauchen. Saubere Arbeit, fairer Preis, freundliche Betreuung.',
      a: 'Julian Burg',
      r: 'Kieferorthopäde · München',
    },
    {
      t: 'Wir verkaufen Olivenöl auf Geschichte und Vertrauen – das FlamingoMedia-Team hat das verstanden und in einen Auftritt verwandelt, der unsere Hände, unsere Bäume und unsere Werte zeigt. Direktverkauf hat sich verdoppelt.',
      a: 'Monika Girardi',
      r: 'The Girardi Oil · Innsbruck',
    },
  ];
  return (
    <section className="py-24 md:py-32 surface">
      <div className="container-x">
        <p className="eyebrow mb-5 reveal">Stimmen</p>
        <h2 className="headline-lg max-w-3xl mb-16 reveal">
          Was unsere Kund<em className="italic-pop">:innen sagen.</em>
        </h2>
        <div className="grid md:grid-cols-3 gap-5 reveal-stagger">
          {quotes.map((q, i) => (
            <blockquote
              key={i}
              className="bg-white border border-line rounded-3xl p-8 md:p-10 hover-lift"
            >
              <span className="font-display text-7xl text-[var(--accent-color-2)] block leading-none mb-2">&ldquo;</span>
              <p className="text-lg leading-relaxed">{q.t}</p>
              <footer className="mt-8 pt-6 border-t border-line">
                <p className="font-medium">{q.a}</p>
                <p className="text-sm text-muted">{q.r}</p>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

function CalloutFooter() {
  return (
    <section className="py-32 md:py-44 bg-brand text-white relative overflow-hidden grain">
      <div className="blob top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px]" style={{ background: 'var(--accent-color)', opacity: 0.18 }} />
      <div className="container-x relative text-center max-w-4xl mx-auto">
        <p className="eyebrow !text-white/60 mb-5 justify-center" style={{ color: 'rgba(255,255,255,0.6)' }}>
          <span style={{ background: 'rgba(255,255,255,0.4)' }} />Bereit?
        </p>
        <h2 className="headline-xl">
          Bauen wir<br />
          <em className="italic-pop" style={{ color: 'var(--accent-color)' }}>Deine Website.</em>
        </h2>
        <p className="mt-8 text-lg text-white/80 max-w-xl mx-auto">
          Schreib uns – wir antworten innerhalb von 24 Stunden mit einer ehrlichen Einschätzung.
        </p>
        <div className="mt-12 flex flex-wrap gap-4 justify-center">
          <Link to="/kontakt" className="btn-accent">Beratung anfragen <span aria-hidden>→</span></Link>
          <Link to="/templates" className="btn-outline !border-white/60 !text-white hover:!bg-white hover:!text-slate-900">
            Templates ansehen
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─── Process page ────────────────────────────────────────────────── */
const PROCESS_STEPS = [
  {
    d: 'Tag 1',
    t: 'Kennenlernen',
    icon: '☎',
    body: '30-Minuten Online-Call oder Telefon. Wir verstehen Deinen Betrieb, Deine Konkurrenz, Deine Ziele. Du bekommst unsere ehrliche Einschätzung.',
    bullets: ['Branche & Wettbewerb', 'Ziele & Zielgruppe', 'Erste Empfehlung'],
  },
  {
    d: 'Tag 2',
    t: 'Briefing & Auswahl',
    icon: '✎',
    body: 'Du wählst Template und Paket. Wir senden ein verbindliches Angebot. Anzahlung 50 %.',
    bullets: ['Template & Stil', 'Module & Features', 'Verbindliches Angebot'],
  },
  {
    d: 'Optional',
    t: 'Foto- & Videoshooting',
    icon: '◉',
    body: 'Add-on, kein Standard. Auf Wunsch kommen wir mit kleinem Team vor Ort und produzieren Bild- und Filmmaterial. Auch nachträglich oder separat buchbar.',
    bullets: ['Halber oder ganzer Tag', 'Bildauswahl mit Dir', 'Druckreife Lieferung'],
  },
  {
    d: 'Tag 3–7',
    t: 'Aufbau',
    icon: '✦',
    body: 'Wir richten das Template ein, importieren Deine Inhalte, optimieren Bilder, schreiben SEO-Texte vor.',
    bullets: ['Template-Setup', 'Inhalte & Bilder', 'SEO-Vorlagen'],
  },
  {
    d: 'Tag 8',
    t: 'Feedback-Schleife',
    icon: '↻',
    body: 'Du schaust Dir den Preview-Link an. Eine Korrektur-Runde inkludiert. Du sendest Anmerkungen, wir setzen um.',
    bullets: ['Privater Preview-Link', '1× Korrektur-Runde inkl.', 'Schnelle Umsetzung'],
  },
  {
    d: 'Tag 9–10',
    t: 'Live-Schaltung',
    icon: '⚡',
    body: 'Wir verbinden Deine Domain und übergeben den Admin-Bereich. Du bist online.',
    bullets: ['Domain & SSL', 'Admin-Zugang & Schulung', 'Online — fertig'],
  },
  {
    d: 'Laufend',
    t: 'Pflege & Support',
    icon: '♥',
    body: 'Du pflegst Inhalte selbst. Wir kümmern uns um den Hosting-Teil und kleine Anpassungen. 29 €/Monat.',
    bullets: ['Du pflegst Inhalte selbst', 'Hosting inklusive', 'Kleine Anpassungen on demand'],
  },
] as const;

function ProcessPage() {
  useReveal();
  const steps = PROCESS_STEPS;

  // Refs to each step row + the timeline track wrapper.
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const timelineRef = useRef<HTMLDivElement>(null);
  // 0..1 — how far the user has scrolled through the timeline section.
  const [progress, setProgress] = useState(0);
  // Currently highlighted step index (drives top sticky pill + active card).
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    let raf = 0;
    const compute = () => {
      raf = 0;
      const track = timelineRef.current;
      if (!track) return;
      const r = track.getBoundingClientRect();
      const winH = window.innerHeight;
      // Anchor: the line fills as the timeline crosses the viewport center.
      const anchor = winH * 0.55;
      const start = r.top - anchor;
      const total = r.height;
      const passed = Math.max(0, Math.min(total, -start));
      const p = total > 0 ? passed / total : 0;
      setProgress(p);

      // Active step: the one whose center is closest to the anchor.
      let best = 0;
      let bestDist = Infinity;
      stepRefs.current.forEach((el, i) => {
        if (!el) return;
        const er = el.getBoundingClientRect();
        const center = er.top + er.height / 2;
        const dist = Math.abs(center - anchor);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      setActiveIdx(best);
    };
    const schedule = () => {
      if (raf) return;
      raf = requestAnimationFrame(compute);
    };
    compute();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    // Lenis emits its own 'scroll' event on window via dispatchEvent in newer
    // versions, but we also hook into it directly for snappier sync.
    const lenis = (window as any).__lenis as { on?: (e: string, cb: () => void) => void; off?: (e: string, cb: () => void) => void } | undefined;
    lenis?.on?.('scroll', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      lenis?.off?.('scroll', schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const jumpTo = (i: number) => {
    const el = stepRefs.current[i];
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 140;
    const lenis = (window as any).__lenis as { scrollTo?: (t: any, o?: any) => void } | undefined;
    if (lenis?.scrollTo) lenis.scrollTo(top, { duration: 0.9 });
    else window.scrollTo({ top, behavior: 'smooth' });
  };

  return (
    <>
      <Seo title="Ablauf · FlamingoMedia" description="Vom ersten Gespräch bis zur Live-Schaltung. Klar geplant, ohne Überraschungen." />

      {/* Hero */}
      <section className="relative pt-44 pb-12 overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background:
              'radial-gradient(60% 50% at 20% 10%, rgba(242,65,113,0.10), transparent 70%),' +
              'radial-gradient(50% 45% at 90% 0%, rgba(124,58,237,0.10), transparent 70%)',
          }}
        />
        <div className="container-x">
          <p className="eyebrow mb-5 reveal">Ablauf</p>
          <h1 className="headline-xl max-w-5xl reveal">
            Von der Idee bis live.<br />
            <em className="italic-pop">In sieben Schritten.</em>
          </h1>
          <p className="mt-8 max-w-2xl text-lg md:text-xl text-muted reveal">
            Klare Stationen, transparente Kosten, kein Agentur-Theater.
            Du weißt jederzeit, wo wir stehen — und was als nächstes kommt.
          </p>
        </div>
      </section>

      {/* Sticky compact stepper bar */}
      <div
        className="sticky top-[88px] z-30 backdrop-blur-md bg-white/80 border-y border-line"
        aria-label="Aktueller Schritt"
      >
        <div className="container-x py-3">
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
            <span className="text-[11px] uppercase tracking-widest text-muted hidden md:inline shrink-0 mr-1">
              Schritt {String(activeIdx + 1).padStart(2, '0')}/{String(steps.length).padStart(2, '0')}
            </span>
            <div className="flex items-center gap-1.5 shrink-0">
              {steps.map((s, i) => {
                const reached = i <= activeIdx;
                return (
                  <button
                    key={s.t}
                    type="button"
                    onClick={() => jumpTo(i)}
                    title={`${s.d} – ${s.t}`}
                    className={`group relative shrink-0 h-8 px-3 rounded-full text-xs font-medium transition-all border ${
                      i === activeIdx
                        ? 'bg-accent text-white border-accent shadow-[0_4px_14px_rgba(242,65,113,0.45)]'
                        : reached
                          ? 'bg-accent/10 text-accent border-accent/30 hover:bg-accent/20'
                          : 'bg-white text-slate-500 border-line hover:border-accent/40 hover:text-accent'
                    }`}
                  >
                    <span className="font-mono mr-1.5">{String(i + 1).padStart(2, '0')}</span>
                    <span className="hidden md:inline">{s.t}</span>
                    <span className="md:hidden">{s.d}</span>
                  </button>
                );
              })}
            </div>
            <div className="flex-1 min-w-[60px] hidden sm:block">
              <div className="h-1.5 bg-line rounded-full overflow-hidden ml-3">
                <div
                  className="h-full bg-gradient-to-r from-accent to-[#7c3aed] rounded-full transition-[width] duration-300 ease-out"
                  style={{ width: `${Math.round(progress * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <section className="py-16 md:py-24">
        <div className="container-tight">
          <div ref={timelineRef} className="relative">
            {/* Vertical track + animated fill (centered on md+, left-aligned with node centers on mobile) */}
            <div
              aria-hidden
              className="absolute top-0 bottom-0 left-6 md:left-1/2 -translate-x-1/2 w-[3px] bg-line rounded-full"
            />
            <div
              aria-hidden
              className="absolute top-0 left-6 md:left-1/2 -translate-x-1/2 w-[3px] rounded-full bg-gradient-to-b from-accent via-[#7c3aed] to-accent"
              style={{
                height: `${Math.max(0, Math.min(100, progress * 100))}%`,
                boxShadow: '0 0 18px rgba(242,65,113,0.45)',
              }}
            />

            <ol className="relative space-y-10 md:space-y-20">
              {steps.map((s, i) => {
                const left = i % 2 === 0; // alternate sides on md+
                const isActive = i === activeIdx;
                const reached = i <= activeIdx;
                return (
                  <li key={s.t} className="relative">
                    {/* Node */}
                    <div
                      aria-hidden
                      className={`absolute left-6 md:left-1/2 -translate-x-1/2 -translate-y-0 top-6 z-10 grid place-items-center transition-all duration-500 ${
                        isActive ? 'scale-110' : ''
                      }`}
                    >
                      <span
                        className={`grid place-items-center h-12 w-12 rounded-full font-mono text-sm border-2 transition-all duration-500 ${
                          reached
                            ? 'bg-accent text-white border-accent shadow-[0_0_28px_rgba(242,65,113,0.55)]'
                            : 'bg-white text-slate-500 border-line'
                        }`}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>

                    {/* Card */}
                    <div
                      ref={(el) => { stepRefs.current[i] = el; }}
                      className={`scroll-mt-40 reveal grid md:grid-cols-2 ${left ? '' : 'md:[&>*:first-child]:col-start-2'}`}
                    >
                      <article
                        className={`relative ml-20 md:ml-0 ${left ? 'md:mr-12 md:text-right' : 'md:ml-12'} bg-white border rounded-3xl p-7 md:p-9 transition-all duration-500 ${
                          isActive
                            ? 'border-accent/40 shadow-[0_30px_60px_-30px_rgba(242,65,113,0.4)]'
                            : 'border-line shadow-sm'
                        }`}
                      >
                        {/* Connector line from card to center node */}
                        <span
                          aria-hidden
                          className={`hidden md:block absolute top-12 ${left ? '-right-12 w-12 [background:linear-gradient(to_right,rgba(0,0,0,0)_0%,var(--accent-color)_100%)]' : '-left-12 w-12 [background:linear-gradient(to_left,rgba(0,0,0,0)_0%,var(--accent-color)_100%)]'} h-[2px] opacity-${isActive ? '100' : '40'} transition-opacity duration-500`}
                        />

                        <div className={`flex items-center gap-3 ${left ? 'md:flex-row-reverse' : ''}`}>
                          <span
                            className={`grid place-items-center h-11 w-11 rounded-2xl text-xl transition-all duration-500 ${
                              isActive ? 'bg-accent text-white shadow-[0_8px_20px_rgba(242,65,113,0.35)]' : 'bg-slate-100 text-slate-600'
                            }`}
                            aria-hidden
                          >
                            {s.icon}
                          </span>
                          <div className={left ? 'md:text-right' : ''}>
                            <p className="text-[11px] font-mono uppercase tracking-widest text-muted">
                              Schritt {String(i + 1).padStart(2, '0')}
                            </p>
                            <p className="font-display text-2xl md:text-3xl leading-tight">{s.d}</p>
                          </div>
                        </div>

                        <h3 className="headline-md mt-6 text-2xl md:text-3xl">{s.t}</h3>
                        <p className="mt-3 text-base md:text-lg text-muted leading-relaxed">{s.body}</p>

                        <ul className={`mt-5 flex flex-wrap gap-2 ${left ? 'md:justify-end' : ''}`}>
                          {s.bullets.map((b) => (
                            <li
                              key={b}
                              className="inline-flex items-center gap-1.5 text-xs bg-slate-50 border border-line rounded-full px-3 py-1.5 text-slate-700"
                            >
                              <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
                              {b}
                            </li>
                          ))}
                        </ul>
                      </article>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Final CTA banner */}
          <div className="mt-24 reveal">
            <div className="relative overflow-hidden rounded-3xl bg-black text-white p-10 md:p-14 text-center">
              <div
                aria-hidden
                className="absolute inset-0 opacity-60"
                style={{
                  background:
                    'radial-gradient(40% 60% at 20% 100%, rgba(242,65,113,0.45), transparent 60%),' +
                    'radial-gradient(40% 60% at 80% 0%, rgba(124,58,237,0.45), transparent 60%)',
                }}
              />
              <div className="relative">
                <p className="eyebrow text-white/70">Bereit?</p>
                <h2 className="headline-md mt-3">In 10 Tagen online.</h2>
                <p className="mt-4 text-white/80 max-w-xl mx-auto">
                  Schreib uns kurz, was Du brauchst. Wir melden uns am selben Tag mit einer ehrlichen Einschätzung.
                </p>
                <div className="mt-8 flex flex-wrap gap-3 justify-center">
                  <Link to="/kontakt" className="btn-accent">Beratung anfragen</Link>
                  <Link
                    to="/preise"
                    className="px-5 py-2.5 rounded-full border border-white/30 text-white hover:bg-white/10 transition-colors"
                  >
                    Preise ansehen
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CalloutFooter />
    </>
  );
}

/* ─── About page ─────────────────────────────────────────────────── */
function AboutPage() {
  useReveal();
  return (
    <>
      <Seo title="Über uns · FlamingoMedia" description="Studio für lokale Marken in der DACH-Region. Wer wir sind, wie wir arbeiten." />
      <section className="pt-44 pb-16">
        <div className="container-x">
          <p className="eyebrow mb-5 reveal">Über uns</p>
          <h1 className="headline-xl max-w-5xl reveal">
            Ein kleines Studio.<br />
            <em className="italic-pop">Ein klarer Anspruch.</em>
          </h1>
          <p className="mt-8 max-w-2xl text-lg md:text-xl text-muted reveal">
            FlamingoMedia ist eine Werkstatt für Websites, Foto und Video.
            Zwei Menschen, ein Hund, viel Kaffee. Wir glauben an Handwerk vor Marketing-Sprech.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24 surface">
        <div className="container-x grid md:grid-cols-12 gap-10">
          <div className="md:col-span-6 reveal">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1400&q=80"
              alt="Team FlamingoMedia"
              className="rounded-3xl w-full aspect-[4/5] object-cover"
              loading="lazy"
            />
          </div>
          <div className="md:col-span-6 reveal flex flex-col justify-center">
            <h2 className="headline-md">
              Studio in Innsbruck.<br />
              <em className="italic-pop">Kunden in der DACH-Region.</em>
            </h2>
            <p className="mt-6 text-lg text-muted leading-relaxed">
              Wir sind ein kleines, unkompliziertes Team aus Tech-Enthusiast:innen und Gestalter:innen.
              Lieber kurze Wege als lange Briefings. Lieber direkt sprechen als zehnseitige Konzepte schicken.
            </p>
            <p className="mt-4 text-lg text-muted leading-relaxed">
              Unsere Kunden sind Restaurants, Salons, Handwerksbetriebe, Praxen, Kanzleien, Studios und viele mehr –
              in Innsbruck, München, Ingolstadt und überall dort, wo gute Arbeit zählt. Über 65 % der Aufträge kommen von Empfehlungen.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container-x">
          <h2 className="headline-md max-w-3xl reveal mb-16">
            Das Team.
          </h2>
          <div className="grid md:grid-cols-3 gap-6 reveal-stagger">
            {[
              {
                n: 'Mario Schubert',
                r: 'CEO · Foto & Video',
                img: '/team/mario.webp',
                bio: 'Der Mann für alles Visuelle. Packt die Kamera aus, denkt in Bildausschnitten und liefert Material, das nach Dir aussieht – nicht nach Stockfoto.',
              },
              {
                n: 'Julius von Ingelheim',
                r: 'CTO · Web · UX',
                img: '/team/julius.jpg',
                bio: 'Gelernter UX-Designer und Tech-Nerd. Herr über das CMS und den Code. Liebt Design, schnelle Ladezeiten und guten Wein.',
              },
              {
                n: 'Nikey',
                r: 'Chief Happiness Officer',
                img: '/team/nikey.jpg',
                bio: 'Unser Hund. Begrüßt Besucher:innen, testet Sofakomfort und sorgt dafür, dass keiner zu lange am Schreibtisch sitzt.',
              },
            ].map((m, i) => (
              <article key={i} className="bg-white border border-line rounded-3xl overflow-hidden hover-lift">
                <div className="aspect-[4/5] img-zoom">
                  <img src={m.img} alt={m.n} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="p-7">
                  <p className="font-mono text-xs text-muted">/ {String(i + 1).padStart(2, '0')}</p>
                  <h3 className="font-display text-3xl mt-2">{m.n}</h3>
                  <p className="text-sm text-muted mt-1">{m.r}</p>
                  <p className="mt-5 text-sm leading-relaxed">{m.bio}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <ManifestoSection />
      <CalloutFooter />
    </>
  );
}

/* ─── Pricing page ────────────────────────────────────────────────── */
function Pricing() {
  useReveal();
  const tiers = [
    {
      name: 'Template',
      price: '1.490 €',
      sub: 'einmalig',
      monthly: '+ 29 € / Monat Hosting & Pflege',
      features: [
        'Eines unserer Branchen-Templates mit konsistentem Basisstil',
        'Globales Marke-&-Design-Setup plus Farben je Section fein steuerbar',
        'Admin-Bereich zum selbst Pflegen von Texten, Bildern, Seiten und Navigation',
        'Responsive Website mit sauberer SEO-Grundstruktur',
        'Hosting & kleine Pflege inklusive',
        '1 Stunde Einrichtungs-Support',
        'Typisch in 7–10 Werktagen online – nach vollständiger Inhaltsfreigabe',
      ],
    },
    {
      name: 'Mit Content Kit (Foto + Video)',
      price: '2.400 €',
      sub: 'einmalig',
      monthly: '+ 29 € / Monat Hosting & Pflege',
      featured: true,
      badge: 'Content Kit',
      features: [
        'Alles aus „Template"',
        '1 Drehtag bei Dir vor Ort',
        'Teamfotos bis 20 Personen (Einzel + Gruppe)',
        'Location komplett: Räume, Atmosphäre, Details',
        'Food-, Produkt- und Servicemomente inklusive',
        '50 bearbeitete Bilder + 3 Reels (à 30 Sek.)',
        'Beratung zu Bildsprache, Story und Einsatz auf Web & Social',
      ],
    },
    {
      name: 'Custom',
      price: 'auf Anfrage',
      sub: 'individuell',
      monthly: 'Hosting individuell',
      features: [
        'Individuelles Design ohne Template-Bindung',
        'Eigene Sections, besondere Interaktionen und individuelle Seitenlogik',
        'Erweiterte Inhalts-Funktionen wie Multi-Standort, Mehrsprachigkeit oder Spezialformulare',
        'Persönlicher Projektmanager',
        'Design-System mit klarer Markenlogik für Website und CMS',
        'API-Anbindungen und komplexere Datenmodelle möglich',
        'Zeitplan nach Absprache',
      ],
    },
  ];

  const addons = [
    { t: 'Shop-Addon', p: 'ab 999 €', d: 'Vollwertiger Online-Shop mit Produkten, Kategorien, Varianten, Warenkorb, Checkout, Stripe & PayPal, Versandverwaltung, Rechnungen und Gutscheinen. Auf Wunsch inkl. Einrichtung: 1.450 €.', featured: true },
    { t: 'Booking-Addon', p: '399 € + 20 € / Monat', d: 'Flexibles Buchungssystem für Termine, Tische, Räume, ganze Tage oder Datumsbereiche. Inkl. Ressourcen, Verfügbarkeiten, Anfrage- oder Direktbuchung und automatischen E-Mails.', featured: true },
    { t: 'Mehrsprachigkeit', p: 'ab 290 €', d: 'DE + EN, weitere Sprachen auf Anfrage. Inkl. Sprach-Switcher.' },
    { t: 'Foto-/Video-Nachshooting', p: '890 €', d: '1 Drehtag light für saisonale Updates, neue Produkte oder Teamwechsel (ca. 25 Bilder + 1 Reel).' },
    { t: 'SEO optimierte Texte', p: 'ab 450 €', d: 'Professionelle Website-Texte mit klarer Struktur, lokaler Suchintention und sauberer Onpage-Grundlage.' },
    { t: 'Eigenes CRM/Kundenverwaltung', p: 'ab 800 €', d: 'Ein eigener geschützter Bereich für Kontakte, Kunden, Status, Notizen und einfache Auswertungen.' },
    { t: 'Logo-Refresh', p: 'ab 899 €', d: 'Modernisierung Deines bestehenden Logos. Drei Iterationen.' },
    { t: 'Individuelle Sections', p: 'ab 200 €', d: 'Maßgeschneiderte Inhaltsblöcke außerhalb des Templates. Preis abhängig von Anzahl, Komplexität und Interaktivität.' },
  ];

  return (
    <>
      <section className="pt-40 pb-8 md:pt-44 md:pb-10">
        <div className="container-x">
          <p className="eyebrow mb-5 reveal">Preise</p>
          <h1 className="headline-lg max-w-4xl reveal">
            Faire Preise.<br />
            <em className="italic-pop">Keine Überraschungen.</em>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted max-w-2xl reveal">
            Drei klare Pakete. Ein transparenter Festpreis, einmalig zahlbar.
            Hosting und Pflege auf Wunsch monatlich – kündbar jederzeit.
          </p>
          <ul className="mt-8 flex flex-wrap gap-3 text-sm reveal" aria-label="Leistungsversprechen">
            {['Klare Paketpreise', 'Quellcode und Inhalte gehören Dir', 'Typisch 7–10 Werktage nach Inhaltsfreigabe'].map(item => (
              <li key={item} className="rounded-full border border-line bg-white px-4 py-2 text-slate-700">{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container-x grid md:grid-cols-3 gap-5 reveal-stagger">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`relative rounded-3xl p-8 md:p-10 flex flex-col ${
                t.featured ? 'bg-brand text-white' : 'bg-white border border-line'
              } hover-lift`}
            >
              {t.badge && (
                <span className="absolute -top-3 left-8 bg-[var(--accent-color)] text-brand text-xs font-medium uppercase tracking-widest px-3 py-1 rounded-full">
                  {t.badge}
                </span>
              )}
              <h3 className="font-mono text-xs uppercase tracking-widest text-muted">/ {t.name}</h3>
              <p className={`headline-lg mt-4 ${t.featured ? 'text-[var(--accent-color)]' : ''}`}>{t.price}</p>
              <p className={`text-sm mt-1 ${t.featured ? 'text-white/70' : 'text-muted'}`}>{t.sub}</p>
              <p className={`text-sm mt-2 ${t.featured ? 'text-white/70' : 'text-muted'}`}>{t.monthly}</p>
              <ul className="mt-8 space-y-3 text-sm flex-1">
                {t.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className={t.featured ? 'text-[var(--accent-color)]' : 'text-brand'}>✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/kontakt"
                className={`mt-10 ${t.featured ? 'btn-accent' : 'btn-outline'}`}
              >
                Anfragen <span aria-hidden>→</span>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 md:py-28 surface">
        <div className="container-x">
          <div className="grid md:grid-cols-12 gap-8 mb-12 items-end">
            <h2 className="md:col-span-7 headline-lg reveal">
              Add-ons.<br />
              <em className="italic-pop">Wer mehr braucht, bekommt mehr.</em>
            </h2>
            <p className="md:col-span-5 text-lg text-muted reveal">
              Buchbar einzeln oder als Paket. Auf Wunsch zu jedem Zeitpunkt nachrüstbar.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 reveal-stagger">
            {addons.map((a) => (
              <article key={a.t} className={`relative rounded-3xl p-7 hover-lift ${a.featured ? 'md:col-span-2 lg:col-span-2 border border-[var(--accent-color)] bg-brand text-white shadow-2xl' : 'bg-white border border-line'}`}>
                {a.featured && <span className="mb-4 inline-flex rounded-full bg-[var(--accent-color)] px-3 py-1 text-xs font-semibold uppercase tracking-widest text-brand">Beliebtes Add-on</span>}
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-display text-2xl">{a.t}</h3>
                  <span className={`text-sm font-mono ${a.featured ? 'text-white/80' : ''}`}>{a.p}</span>
                </div>
                <p className={`${a.featured ? 'text-white/78' : 'text-muted'} text-sm leading-relaxed`}>{a.d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-28">
        <div className="container-tight">
          <h2 className="headline-lg mb-12 reveal">
            Häufige <em className="italic-pop">Fragen.</em>
          </h2>
          <Accordion
            items={[
              { q: 'Wie lange dauert die Erstellung?', a: 'Bei Template-Projekten typischerweise 7–10 Werktage nach vollständiger Inhaltsfreigabe. Mit Content Kit planen wir zusätzlich Zeit für Dreh, Auswahl und Schnitt ein.' },
              { q: 'Kann ich Inhalte selbst pflegen?', a: 'Ja. Du bekommst einen einfachen Admin-Bereich. Texte, Bilder, Speisekarte und Öffnungszeiten änderst Du ohne Vorkenntnisse direkt im Browser. Du siehst den Effekt sofort.' },
              { q: 'Was passiert, wenn etwas kaputt ist?', a: 'Im Pflegepaket überwachen wir Deine Seite automatisch – wir bekommen Probleme oft mit, bevor Du es tust. Wir reagieren innerhalb der Geschäftszeiten in der Regel binnen weniger Stunden.' },
              { q: 'Wem gehört die Website?', a: 'Dir. Du kannst den Quellcode jederzeit anfordern, das Hosting wechseln und mit anderen Agenturen weiterarbeiten. Wir liefern keine Verträge mit Lock-in-Klauseln.' },
              { q: 'Was kostet eine zusätzliche Sprache?', a: 'Mehrsprachigkeit (DE + EN) kostet einmalig ab 290 €. Weitere Sprachen je nach Umfang. Inhalte können von uns übersetzt oder bereitgestellt werden.' },
              { q: 'Welche Zahlungsweise?', a: '50 % Anzahlung bei Auftrag, 50 % bei Live-Schaltung. Beide Rechnungen mit MwSt. Hosting wird monatlich abgebucht (kündbar zum Monatsende).' },
              { q: 'Arbeitet ihr auch außerhalb der DACH-Region?', a: 'Ja, auf Anfrage. Allerdings nur dort, wo wir mit Tageslicht und einem Direktflug hinreisen können – sonst leidet die Qualität des Shootings.' },
            ]}
          />
        </div>
      </section>

      <CalloutFooter />
    </>
  );
}

/* ─── Contact page ────────────────────────────────────────────────── */
function Contact() {
  useReveal();
  return (
    <>
      <Seo title="Kontakt · FlamingoMedia" description="Erstgespräch, Angebot oder einfach mal Hallo. Wir antworten innerhalb von 24 Stunden." />
      <section className="pt-44 pb-12">
        <div className="container-x grid md:grid-cols-12 gap-10">
          <div className="md:col-span-6 reveal">
            <p className="eyebrow mb-5">Kontakt</p>
            <h1 className="headline-xl">
              Lass<br />
              <em className="italic-pop">uns reden.</em>
            </h1>
            <p className="mt-8 text-lg md:text-xl text-muted max-w-md">
              Schreib uns Deine Idee. Wir antworten innerhalb von 24 Stunden mit einer ehrlichen Einschätzung – auch wenn wir nicht der richtige Partner sind.
            </p>
            <div className="mt-12 space-y-6">
              <a href={`mailto:${AGENCY.email}`} className="block group">
                <p className="text-xs uppercase tracking-widest text-muted">E-Mail</p>
                <p className="mt-1 font-display text-xl sm:text-2xl md:text-3xl break-all group-hover:translate-x-1 transition-transform">{AGENCY.email}</p>
              </a>
              <a href={`tel:${AGENCY.phone}`} className="block group">
                <p className="text-xs uppercase tracking-widest text-muted">Telefon</p>
                <p className="mt-1 font-display text-3xl group-hover:translate-x-1 transition-transform">{AGENCY.phone}</p>
              </a>
              <div>
                <p className="text-xs uppercase tracking-widest text-muted">Erreichbarkeit</p>
                <p className="mt-1 text-xl">Mo–Fr · 09:00 – 18:00</p>
                <p className="text-sm text-muted mt-1">DACH-weit remote · Termine vor Ort nach Absprache.</p>
              </div>
            </div>
          </div>

          <div className="md:col-span-6 reveal min-w-0">
            <ContactForm
              source="agency-landing"
              tenant="FlamingoMedia"
              fields={['name', 'email', 'branche', 'paket', 'message']}
              brancheOptions={BRANCHE_OPTIONS}
              paketOptions={PAKET_OPTIONS}
              addonOptions={ADDON_OPTIONS}
            />
          </div>
        </div>
      </section>

      <section className="py-16 surface">
        <div className="container-x">
          <div className="grid md:grid-cols-12 gap-8 mb-10 items-end">
            <div className="md:col-span-7 reveal">
              <p className="eyebrow mb-5">Wo wir arbeiten</p>
              <h2 className="headline-md">
                DACH-Region.<br />
                <em className="italic-pop">Mit Fokus auf drei Städte.</em>
              </h2>
            </div>
            <p className="md:col-span-5 text-base text-muted leading-relaxed reveal">
              Wir arbeiten remote-first für inhabergeführte Betriebe in Deutschland, Österreich und der Schweiz.
              Persönliche Termine vor Ort vereinbaren wir gerne nach Absprache.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { t: 'Innsbruck & Tirol' },
              { t: 'München & Oberbayern' },
              { t: 'Ingolstadt & Region' },
            ].map((c, i) => (
              <div key={i} className="bg-white border border-line rounded-3xl p-7 reveal">
                <p className="font-mono text-xs text-muted">/ Schwerpunkt-Region</p>
                <h3 className="font-display text-3xl mt-2">{c.t}</h3>
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm text-muted reveal">
            Du sitzt woanders? Schreib uns trotzdem – wir arbeiten DACH-weit remote.
          </p>
        </div>
      </section>
    </>
  );
}

// Named exports for individual route pages
export { Landing, ProcessPage, AboutPage, Pricing, Contact, CalloutFooter, ManifestoSection };
