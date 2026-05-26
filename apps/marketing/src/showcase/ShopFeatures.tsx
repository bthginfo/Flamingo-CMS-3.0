'use client';

import { useState, useRef, useEffect } from 'react';
import Seo from '@/components/Seo';
import { LiveAdminShowcase } from './LiveAdminShowcase';

const DEMO_BASE = 'https://www.demo.flamingomedia.online';
const demoAdminUrl = (next = '/admin') => `${DEMO_BASE}/admin/demo-login?industry=handwerk&next=${encodeURIComponent(next)}`;

const FEATURES = [
  {
    badge: 'Produktverwaltung',
    title: 'Produkte.\nKategorien.\nVarianten.',
    description: 'Lege Produkte mit Bildern, Preisen, Varianten (Größe, Farbe etc.) und Lagerbestand an. Kategorien helfen Deinen Kunden beim Stöbern.',
    highlights: ['Unbegrenzte Produkte & Kategorien', 'Varianten mit eigenen Preisen & Lager', 'Bulk-Bildupload per Drag & Drop', 'SEO-Felder pro Produkt'],
    demoUrl: `${DEMO_BASE}/demo/shop/shop`,
  },
  {
    badge: 'Checkout & Zahlung',
    title: 'Stripe.\nPayPal.\nVorkasse.',
    description: 'Deine Kunden zahlen per Kreditkarte (Stripe), PayPal oder Überweisung. Du wählst, welche Methoden aktiv sind — eine, alle oder beliebige Kombination.',
    highlights: ['Stripe Checkout (Kredit- & Debitkarte)', 'PayPal mit einem Klick', 'Vorkasse mit automatischer Bankdaten-Mail', 'Abholung & Barzahlung'],
    demoUrl: `${DEMO_BASE}/demo/shop/warenkorb`,
  },
  {
    badge: 'Bestellungen & Rechnungen',
    title: 'Bestellungen.\nAutomatisch verwaltet.',
    description: 'Jede Bestellung erzeugt automatisch eine PDF-Rechnung. Statusänderungen, Tracking-Nummern und Storno mit Gutschrift — alles im Admin.',
    highlights: ['Automatische PDF-Rechnungen', 'Storno mit Gutschrift-PDF', 'Tracking-Nummern & Versand-E-Mails', 'Bestellhistorie pro Kunde'],
    demoUrl: demoAdminUrl('/admin/shop/orders'),
  },
  {
    badge: 'Versand & Gutscheine',
    title: 'Versandzonen.\nGutscheincodes.\nAlles drin.',
    description: 'Definiere Versandzonen mit Ländern, Preisen und Frei-ab-Schwellen. Erstelle Rabattcodes (% oder Fixbetrag) mit Ablaufdatum und Nutzungslimits.',
    highlights: ['Flexible Versandzonen (Länder, Gewicht)', 'Kostenloser Versand ab X €', 'Prozent- & Fixbetrag-Gutscheine', 'Nutzungslimits & Ablaufdatum'],
    demoUrl: `${DEMO_BASE}/demo/shop/shop`,
  },
  {
    badge: 'Nahtlose Integration',
    title: 'Kein externer Shop.\nAlles in Deiner Website.',
    description: 'Der Shop läuft direkt auf Deiner Flamingo-Website. Gleiches Design, gleiche Domain, gleicher Admin. Keine Weiterleitung zu Shopify oder WooCommerce.',
    highlights: ['Shop-Sections im Page-Builder platzieren', 'Gleicher Style & Branding wie die restliche Seite', 'Keine externen Accounts nötig', 'Mobile-first Design'],
    demoUrl: `${DEMO_BASE}/demo/shop`,
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
        <span className="ml-3 text-[10px] text-slate-500 font-mono">demo.flamingomedia.online/demo/shop</span>
      </div>
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-slate-50">
        {mount ? (
          <iframe
            src={demoUrl}
            className="absolute top-0 left-0 w-[1280px] h-[800px] origin-top-left border-0"
            style={{ transform: 'scale(var(--mockup-scale, 0.5))' }}
            loading="lazy"
            title="Shop Demo"
            ref={(el) => {
              if (!el) return;
              const parent = el.parentElement;
              if (!parent) return;
              const ro = new ResizeObserver(() => {
                const scale = parent.clientWidth / 1280;
                parent.style.setProperty('--mockup-scale', String(scale));
              });
              ro.observe(parent);
            }}
          />
        ) : (
          <div className="absolute inset-0 animate-pulse bg-slate-100" />
        )}
      </div>
    </div>
  );
}

export default function ShopFeaturesPage() {
  return (
    <>
      <Seo title="Shop-Addon · FlamingoMedia" description="Dein eigener Online-Shop – direkt in Deiner Flamingo-Website. Produkte, Checkout, Stripe, PayPal, Versand, Rechnungen und mehr." />

      <section className="pt-44 pb-12">
        <div className="container-x">
          <p className="eyebrow mb-5 reveal">Shop-Addon</p>
          <h1 className="headline-xl max-w-5xl reveal">
            Dein eigener Online-Shop.<br />
            <em className="italic-pop">Direkt in Deiner Website.</em>
          </h1>
          <p className="mt-8 text-lg md:text-xl text-muted max-w-2xl reveal">
            Kein Shopify. Kein WooCommerce. Kein Umweg. Das Flamingo Shop-Addon verwandelt Deine Website in einen vollwertigen Online-Shop — mit dem gleichen Look, der gleichen Domain und dem gleichen Admin.
          </p>
          <div className="flex flex-wrap gap-4 mt-10 reveal">
            <a href="/kontakt" className="btn-primary">Shop anfragen →</a>
            <a href={`${DEMO_BASE}/demo/shop`} target="_blank" rel="noopener" className="btn-outline">Live-Demo ansehen</a>
          </div>
        </div>
      </section>

      <LiveAdminShowcase mode="shop" compact />

      <section className="py-10 md:py-16">
        <div className="container-x space-y-32">
          {FEATURES.map((feature, i) => (
            <div key={i} className={`grid md:grid-cols-2 gap-10 md:gap-16 items-center reveal ${i % 2 === 1 ? 'md:[direction:rtl] md:[&>*]:[direction:ltr]' : ''}`}>
              <div>
                <span className="inline-block px-3 py-1 text-xs font-medium uppercase tracking-widest rounded-full bg-brand/10 text-brand mb-4">
                  {feature.badge}
                </span>
                <h2 className="headline-md whitespace-pre-line">{feature.title}</h2>
                <p className="mt-4 text-muted text-lg leading-relaxed">{feature.description}</p>
                <ul className="mt-6 space-y-2">
                  {feature.highlights.map(h => (
                    <li key={h} className="flex gap-2 text-sm">
                      <span className="text-brand">✓</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <DesktopMockup demoUrl={feature.demoUrl} />
            </div>
          ))}
        </div>
      </section>

      {/* Pricing CTA */}
      <section className="py-24 md:py-32 surface">
        <div className="container-x text-center reveal">
          <p className="eyebrow mb-5">Preise</p>
          <h2 className="headline-md max-w-3xl mx-auto">
            Ein Preis. <em className="italic-pop">Alles drin.</em>
          </h2>
          <div className="grid sm:grid-cols-2 gap-6 mt-14 max-w-3xl mx-auto">
            <div className="p-8 rounded-3xl border border-line bg-white text-left">
              <h3 className="font-mono text-xs uppercase tracking-widest text-muted">/ Self-Setup</h3>
              <p className="headline-md mt-4">999 €</p>
              <p className="text-sm text-muted mt-1">einmalig</p>
              <p className="text-sm text-muted mt-4">Shop-Addon aktiviert. Du richtest Produkte, Kategorien und Zahlungsarten selbst ein.</p>
            </div>
            <div className="p-8 rounded-3xl border-2 border-brand bg-brand/5 text-left relative">
              <span className="absolute -top-3 left-8 bg-brand text-white text-xs font-medium uppercase tracking-widest px-3 py-1 rounded-full">Empfohlen</span>
              <h3 className="font-mono text-xs uppercase tracking-widest text-muted">/ Inkl. Einrichtung</h3>
              <p className="headline-md mt-4">1.450 €</p>
              <p className="text-sm text-muted mt-1">einmalig</p>
              <p className="text-sm text-muted mt-4">Wir übernehmen die komplette Einrichtung: Produkte, Kategorien, Versand, Zahlungsarten, Design-Anpassung.</p>
            </div>
          </div>
          <a href="/kontakt" className="btn-primary mt-12 inline-flex">Shop-Addon anfragen →</a>
        </div>
      </section>
    </>
  );
}

/** Compact teaser for the homepage */
export function ShopFeaturesTeaserSection() {
  return (
    <section className="py-24 md:py-32">
      <div className="container-x text-center reveal">
        <p className="eyebrow mb-5">Neu: Shop-Addon</p>
        <h2 className="headline-md max-w-3xl mx-auto">
          Verkaufe direkt auf<br /><em className="italic-pop">Deiner Website.</em>
        </h2>
        <p className="mt-6 text-lg text-muted max-w-2xl mx-auto leading-relaxed">
          Produkte, Warenkorb, Checkout, Stripe, PayPal — alles integriert in Dein Flamingo-Design. Kein Shopify nötig.
        </p>

        <div className="grid sm:grid-cols-3 gap-6 mt-14 text-left max-w-4xl mx-auto">
          {[
            { icon: '🛒', title: 'Vollwertiger Shop', desc: 'Produkte, Varianten, Kategorien, Bilder — alles im gewohnten Admin.' },
            { icon: '💳', title: 'Stripe & PayPal', desc: 'Kreditkarte, PayPal, Vorkasse oder Abholung. Du wählst.' },
            { icon: '📦', title: 'Versand & Rechnungen', desc: 'Automatische PDF-Rechnungen, Versandzonen, Gutscheine & Tracking.' },
          ].map(item => (
            <div key={item.title} className="p-6 rounded-2xl border border-line bg-white hover:shadow-lg transition-shadow">
              <span className="text-3xl">{item.icon}</span>
              <h3 className="font-bold text-lg mt-3">{item.title}</h3>
              <p className="text-sm text-muted mt-2 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <a href="/shop" className="btn-primary mt-12 inline-flex">
          Mehr erfahren →
        </a>
      </div>
    </section>
  );
}
