'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Marquee, ScrollProgress, useReveal } from '@/components/fx';
import { ConsentProvider } from '@/lib/consent';
import { CookieBanner } from '@/components/CookieBanner';
import { SmoothScroll } from '@/components/SmoothScroll';
import { BreadcrumbJsonLd } from '@/components/BreadcrumbJsonLd';
import { scrollToTop } from '@/lib/scroll';

const AGENCY = {
  name: 'FlamingoMedia',
  fullName: 'FlamingoMedia · Websites für lokale Marken',
  tagline: 'Websites mit Pop für lokale Marken · Innsbruck · DACH',
  email: 'hello@flamingomedia.online',
  phone: '+49 1515 5338029',
  phoneAt: '+43 677 6368 1543',
  logoFullSrc: '/brand/flamingo-full.png',
  logoFullBesideSrc: '/brand/flamingo-full-beside.png',
  logoMarkSrc: '/brand/flamingo-icon.png',
};

const DEMO_BASE = 'https://flamingo-renderer.vercel.app';

const SHOWCASE_PALETTE = {
  '--brand-color': '#14111a',
  '--brand-fg': '#ffffff',
  '--accent-color': '#F24171',
  '--accent-color-2': '#FFB347',
  '--accent-fg': '#ffffff',
  '--surface-color': '#fce7ef',
  '--bg-color': '#fff8fa',
  '--text-color': '#14111a',
} as const;

function applyShowcasePalette() {
  const r = document.documentElement.style;
  for (const [k, v] of Object.entries(SHOWCASE_PALETTE)) r.setProperty(k, v);
  document.body.style.backgroundColor = '';
  document.body.style.color = '';
}

const NAV = [
  { href: '/templates', label: 'Templates' },
  { href: '/cms', label: 'CMS' },
  { href: '/foerderrechner', label: 'Förderrechner' },
  { href: '/prozess', label: 'Ablauf' },
  { href: '/preise', label: 'Preise' },
  { href: '/ueber-uns', label: 'Über uns' },
  { href: '/kontakt', label: 'Kontakt' },
];

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobile, setMobile] = useState(false);
  const pathname = usePathname();
  const isLanding = pathname === '/';
  const headerSolid = scrolled || !isLanding;

  useEffect(() => { applyShowcasePalette(); }, []);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => { scrollToTop(); }, [pathname]);
  useReveal();

  return (
    <ConsentProvider>
      <SmoothScroll />
      <BreadcrumbJsonLd />
      <div className="showcase-root min-h-screen flex flex-col">
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
              'Online in wenigen Tagen',
              'Innsbruck · München · Ingolstadt · DACH',
              'Hosting & kleine Pflege inklusive',
            ].concat([
              'Passend für jede Branche',
              'Foto- & Videoshooting optional als Add-on',
              'Online in wenigen Tagen',
              'Innsbruck · München · Ingolstadt · DACH',
              'Hosting & kleine Pflege inklusive',
            ]).map((m, i) => (
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
            <Link href="/" className="flex items-center leading-none group" aria-label={AGENCY.fullName}>
              <img
                src={AGENCY.logoFullBesideSrc}
                alt={AGENCY.name}
                className="h-9 md:h-10 w-auto transition-transform group-hover:scale-[1.03]"
              />
            </Link>
            <nav className="hidden lg:flex items-center gap-0.5">
              {NAV.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className={`px-3 py-1.5 text-[13px] font-medium rounded-full transition-colors ${
                    pathname === n.href ? 'bg-white/15 text-white' : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {n.label}
                </Link>
              ))}
              <span className="w-px h-5 bg-white/20 mx-2" />
              <Link href="/kontakt" className="btn-accent !py-1.5 !px-4 text-[13px]">
                Beratung <span aria-hidden>→</span>
              </Link>
              <Link href="/demo" className="ml-1.5 rounded-full border border-white/30 px-4 py-1.5 text-[13px] font-medium text-white transition hover:bg-white/10">
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
            <nav className="container-x flex flex-col gap-0.5 mt-6">
              {NAV.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  onClick={() => setMobile(false)}
                  className="py-3 text-2xl font-display border-b border-line transition-transform hover:translate-x-2 text-slate-800"
                >
                  {n.label}
                </Link>
              ))}
              <div className="flex items-center gap-3 mt-8">
                <Link href="/kontakt" onClick={() => setMobile(false)} className="btn-accent">
                  Beratung anfragen <span aria-hidden>→</span>
                </Link>
                <Link href="/demo" onClick={() => setMobile(false)} className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-800 transition hover:bg-slate-100">
                  Demo
                </Link>
              </div>
            </nav>
          </div>
        )}

        <main id="main" className="flex-1">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-black text-white pt-24 pb-10 mt-auto relative overflow-hidden">
          <div className="container-x">
            <div className="grid md:grid-cols-12 gap-10 pt-4 pb-14 border-b border-white/10">
              <div className="md:col-span-5">
                <div className="flex items-center leading-none">
                  <img src={AGENCY.logoFullSrc} alt={AGENCY.name} className="h-20 md:h-24 w-auto" />
                </div>
                <p className="text-sm text-white/70 mt-4 max-w-sm">{AGENCY.tagline}</p>
                <div className="mt-6 flex flex-col gap-1.5 text-sm">
                  <a href={`mailto:${AGENCY.email}`} className="hover:text-accent">{AGENCY.email}</a>
                  <a href={`tel:${AGENCY.phone.replace(/\s/g, '')}`} className="hover:text-accent">{AGENCY.phone}</a>
                  <a href={`tel:${AGENCY.phoneAt.replace(/\s/g, '')}`} className="hover:text-accent">{AGENCY.phoneAt}</a>
                  <span className="text-white/60">Innsbruck · München · Ingolstadt</span>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-8 py-14 text-sm">
              <div>
                <p className="text-xs uppercase tracking-widest text-white/50 mb-4">Angebot</p>
                <ul className="space-y-2">
                  <li><Link href="/templates" className="hover:text-accent">Templates</Link></li>
                  <li><Link href="/prozess" className="hover:text-accent">Ablauf</Link></li>
                  <li><Link href="/preise" className="hover:text-accent">Preise</Link></li>
                  <li><Link href="/ueber-uns" className="hover:text-accent">Über uns</Link></li>
                  <li><Link href="/kontakt" className="hover:text-accent">Kontakt</Link></li>
                </ul>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-white/50 mb-4">Branchen</p>
                <ul className="space-y-2">
                  <li><a href={`${DEMO_BASE}/demo/handwerk`} target="_blank" rel="noopener noreferrer" className="hover:text-accent">Handwerk</a></li>
                  <li><a href={`${DEMO_BASE}/demo/restaurant`} target="_blank" rel="noopener noreferrer" className="hover:text-accent">Restaurant</a></li>
                  <li><a href={`${DEMO_BASE}/demo/hotel`} target="_blank" rel="noopener noreferrer" className="hover:text-accent">Hotel</a></li>
                  <li><a href={`${DEMO_BASE}/demo/salon`} target="_blank" rel="noopener noreferrer" className="hover:text-accent">Salon &amp; Beauty</a></li>
                  <li><a href={`${DEMO_BASE}/demo/medical`} target="_blank" rel="noopener noreferrer" className="hover:text-accent">Arztpraxis</a></li>
                  <li><a href={`${DEMO_BASE}/demo/tourism`} target="_blank" rel="noopener noreferrer" className="hover:text-accent">Tourismus</a></li>
                  <li><a href={`${DEMO_BASE}/demo/wedding`} target="_blank" rel="noopener noreferrer" className="hover:text-accent">Hochzeit</a></li>
                  <li><a href={`${DEMO_BASE}/demo/consulting`} target="_blank" rel="noopener noreferrer" className="hover:text-accent">Kanzlei &amp; Beratung</a></li>
                  <li><a href={`${DEMO_BASE}/demo/tattoo`} target="_blank" rel="noopener noreferrer" className="hover:text-accent">Tattoo Studio</a></li>
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
                  <li><Link href="/impressum" className="hover:text-accent">Impressum</Link></li>
                  <li><Link href="/datenschutz" className="hover:text-accent">Datenschutz</Link></li>
                  <li><Link href="/agb" className="hover:text-accent">AGB</Link></li>
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
      </div>
      <CookieBanner />
    </ConsentProvider>
  );
}
