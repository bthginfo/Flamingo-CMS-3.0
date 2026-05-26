'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  BarChart3,
  Brush,
  Contact,
  ExternalLink,
  FileText,
  Globe2,
  Image as ImageIcon,
  LayoutDashboard,
  Mail,
  Menu,
  Monitor,
  Package,
  PanelLeft,
  Rocket,
  Search,
  Settings,
  ShoppingBag,
  Smartphone,
  Tablet,
} from 'lucide-react';

const DEMO_BASE = 'https://www.demo.flamingomedia.online';
const PREVIEW_TENANT_ID = 'f50cbf53-279d-43f3-b58b-f5ae3d550ab2';
const demoAdminUrl = (next = '/admin') => `${DEMO_BASE}/admin/demo-login?industry=handwerk&next=${encodeURIComponent(next)}`;

type Viewport = 'desktop' | 'tablet' | 'mobile';
type ShowcaseMode = 'demo' | 'cms' | 'shop';
type AdminTab = {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  note: string;
};

const CMS_TABS: AdminTab[] = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard, note: 'Überblick, Status und Schnellzugriffe' },
  { label: 'Seiten', href: '/admin/pages', icon: FileText, note: 'Seiten, Sections und Live-Vorschau' },
  { label: 'Editor', href: '/admin/pages', icon: PanelLeft, note: 'Inhalte direkt im Builder pflegen' },
  { label: 'Marke', href: '/admin/brand', icon: Brush, note: 'Farben, Schriften und Logo steuern' },
  { label: 'Medien', href: '/admin/media', icon: ImageIcon, note: 'Bilder hochladen und wiederverwenden' },
  { label: 'Navigation', href: '/admin/navigation', icon: Menu, note: 'Menü, CTA und Footer zentral verwalten' },
  { label: 'Kontakt', href: '/admin/contact', icon: Contact, note: 'Adresse, Telefon und Formularfelder' },
  { label: 'SEO', href: '/admin/seo', icon: Search, note: 'Meta-Titel, Vorschau und Indexierung' },
  { label: 'Posteingang', href: '/admin/inbox', icon: Mail, note: 'Anfragen und Formulareingänge prüfen' },
  { label: 'Live Preview', href: `/live-preview?tenant=${PREVIEW_TENANT_ID}`, icon: Monitor, note: 'Demo-Tenant als Website-Vorschau sehen' },
];

const SHOP_TABS: AdminTab[] = [
  { label: 'Shop', href: '/admin/shop', icon: ShoppingBag, note: 'Shop-Setup und Aktivierung' },
  { label: 'Produkte', href: '/admin/shop/products', icon: Package, note: 'Produkte, Varianten, Bilder und Bestand' },
  { label: 'Kategorien', href: '/admin/shop/categories', icon: Globe2, note: 'Sortimente und Übersichtsseiten strukturieren' },
  { label: 'Bestellungen', href: '/admin/shop/orders', icon: BarChart3, note: 'Status, Zahlung, Rechnung und Versand' },
  { label: 'Gutscheine', href: '/admin/shop/coupons', icon: ShoppingBag, note: 'Rabatte, Limits und Laufzeiten' },
  { label: 'Versand', href: '/admin/shop/shipping', icon: Rocket, note: 'Versandzonen, Preise und Lieferzeiten' },
  { label: 'Einstellungen', href: '/admin/shop/settings', icon: Settings, note: 'Zahlung, Versand und Rechnungsdaten' },
];

function viewportSize(viewport: Viewport) {
  if (viewport === 'mobile') return { width: 390, height: 844 };
  if (viewport === 'tablet') return { width: 820, height: 1080 };
  return { width: 1440, height: 920 };
}

function AdminFrame({ src, viewport, framed = true, small = false }: { src: string; viewport: Viewport; framed?: boolean; small?: boolean }) {
  const shellRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const size = viewportSize(viewport);

  useEffect(() => {
    const node = shellRef.current;
    if (!node) return;
    const update = () => {
      const widthScale = node.clientWidth / size.width;
      const heightScale = node.clientHeight / size.height;
      setScale(Math.min(widthScale, heightScale, 1));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(node);
    return () => ro.disconnect();
  }, [size.height, size.width, viewport]);

  return (
    <div ref={shellRef} className={`relative grid ${small ? 'aspect-[16/10] min-h-0' : 'min-h-[520px]'} w-full place-items-center overflow-hidden ${framed ? 'rounded-[28px] border border-white/10 bg-[#07070a] p-3 shadow-2xl shadow-black/35' : ''}`}>
      <div className="relative" style={{ width: size.width * scale, height: size.height * scale }}>
        <div
          className="absolute left-0 top-0 origin-top-left overflow-hidden rounded-[18px] bg-white shadow-2xl"
          style={{ width: size.width, height: size.height, transform: `scale(${scale})` }}
        >
          <iframe
            src={src}
            title="Flamingo CMS Admin Demo"
            className="h-full w-full border-0"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}

export function LiveAdminShowcase({ mode = 'cms', compact = false, showTabs = true, smallPreview = false }: { mode?: ShowcaseMode; compact?: boolean; showTabs?: boolean; smallPreview?: boolean }) {
  const [viewport, setViewport] = useState<Viewport>('desktop');
  const tabs = mode === 'shop' ? SHOP_TABS : CMS_TABS;
  const [activeTab, setActiveTab] = useState(0);
  const active = tabs[activeTab] || tabs[0];
  const src = active.href.startsWith('/admin') ? demoAdminUrl(active.href) : `${DEMO_BASE}${active.href}`;

  const copy = useMemo(() => {
    if (mode === 'shop') {
      return {
        eyebrow: 'Shop-Admin',
        title: 'Produkte, Bestellungen und Zahlungen im gleichen Admin.',
        text: 'Das Shop-Addon sitzt nicht daneben, sondern direkt im Flamingo CMS: Produkte pflegen, Bestellungen prüfen, Gutscheine erstellen und Rechnungsdaten verwalten.',
        cta: 'Demo ansehen',
      };
    }
    if (mode === 'demo') {
      return {
        eyebrow: 'Live Admin',
        title: 'Teste den echten Flamingo Admin direkt im Browser.',
        text: 'Seiten bearbeiten, Marke anpassen, Medien verwalten und den Editor auf Desktop, Tablet und Mobile prüfen. Die Demo läuft isoliert und ist jederzeit zurücksetzbar.',
        cta: 'Demo ansehen',
      };
    }
    return {
      eyebrow: 'CMS-Live-Vorschau',
      title: 'So fühlt sich Inhalts­pflege heute an.',
      text: 'Kein altes Backend, keine Plugin-Oberfläche: Flamingo CMS arbeitet wie eine moderne App mit klarer Navigation, Live-Vorschau und mobilen Workflows.',
      cta: 'Demo ansehen',
    };
  }, [mode]);

  return (
    <section className={compact ? 'py-16 md:py-24' : 'py-20 md:py-28'}>
      <div className="container-x">
        <div className={`grid gap-8 ${showTabs ? (compact ? 'lg:grid-cols-[0.72fr_1.28fr]' : 'lg:grid-cols-[0.65fr_1.35fr]') : 'lg:grid-cols-[0.95fr_1.05fr]'} lg:items-center`}>
          <div className="reveal">
            <p className="eyebrow mb-5">{copy.eyebrow}</p>
            <h2 className={compact ? 'headline-md' : 'headline-lg'}>{copy.title}</h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-muted md:text-lg">{copy.text}</p>

            {showTabs && (
              <div className="mt-8 grid gap-2">
                {tabs.map((tab, index) => {
                  const Icon = tab.icon;
                  const selected = index === activeTab;
                  return (
                    <button
                      key={tab.label}
                      type="button"
                      onClick={() => setActiveTab(index)}
                      className={`group flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition ${selected ? 'border-slate-950 bg-slate-950 text-white shadow-xl shadow-slate-950/15' : 'border-line bg-white text-slate-700 hover:border-slate-300 hover:shadow-sm'}`}
                    >
                      <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${selected ? 'bg-white text-slate-950' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'}`}>
                        <Icon size={18} />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold">{tab.label}</span>
                        <span className={`block truncate text-xs ${selected ? 'text-white/62' : 'text-slate-500'}`}>{tab.note}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            <a href="/demo" className="btn-primary mt-8 inline-flex items-center gap-2">
              {copy.cta} <ExternalLink size={16} />
            </a>
          </div>

          <div className={`reveal ${smallPreview ? 'mx-auto w-full max-w-[520px]' : ''}`}>
            <div className={`overflow-hidden border border-slate-200 bg-white shadow-2xl shadow-slate-950/15 ${smallPreview ? 'rounded-2xl' : 'rounded-[32px]'}`}>
              <div className={`${smallPreview ? 'bg-slate-900 px-4 py-2.5' : 'border-b border-white/10 bg-[#111119] px-4 py-3'} flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between`}>
                {smallPreview ? (
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                    <span className="ml-3 text-[10px] font-mono text-slate-500">flamingo-cms.de/admin</span>
                  </div>
                ) : (
                  <>
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-sm font-black text-slate-950">F</span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">Flamingo CMS Admin</p>
                        <p className="truncate text-xs text-white/45">{active.note}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {([
                        ['desktop', Monitor],
                        ['tablet', Tablet],
                        ['mobile', Smartphone],
                      ] as const).map(([key, Icon]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setViewport(key)}
                          className={`grid h-9 w-9 place-items-center rounded-xl transition ${viewport === key ? 'bg-white text-slate-950' : 'bg-white/5 text-white/45 hover:bg-white/10 hover:text-white'}`}
                          aria-label={`${key} Vorschau`}
                        >
                          <Icon size={17} />
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <AdminFrame src={src} viewport={viewport} framed={false} small={smallPreview} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function DemoAdminExperience() {
  const [viewport, setViewport] = useState<Viewport>('desktop');
  const [activeTab, setActiveTab] = useState(0);
  const tabs = CMS_TABS;
  const active = tabs[activeTab] || tabs[0];
  const src = active.href.startsWith('/admin') ? demoAdminUrl(active.href) : `${DEMO_BASE}${active.href}`;

  return (
    <main className="min-h-screen bg-[#08080c] text-white">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#08080c]/90 backdrop-blur">
        <div className="flex flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <Link href="/" className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-white/10 text-white/62 transition hover:bg-white/10 hover:text-white">
              <ArrowLeft size={18} />
            </Link>
            <div className="min-w-0">
              <p className="text-sm font-semibold">Flamingo CMS Live Admin</p>
              <p className="truncate text-xs text-white/45">Echte Demo-Umgebung, responsive gerendert</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-2xl border border-white/10 bg-white/5 p-1">
              {tabs.map((tab, index) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.label}
                    type="button"
                    onClick={() => setActiveTab(index)}
                    className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition ${index === activeTab ? 'bg-white text-slate-950' : 'text-white/55 hover:bg-white/10 hover:text-white'}`}
                  >
                    <Icon size={14} />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>
            <div className="flex rounded-2xl border border-white/10 bg-white/5 p-1">
              {([
                ['desktop', Monitor],
                ['tablet', Tablet],
                ['mobile', Smartphone],
              ] as const).map(([key, Icon]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setViewport(key)}
                  className={`grid h-9 w-9 place-items-center rounded-xl transition ${viewport === key ? 'bg-white text-slate-950' : 'text-white/55 hover:bg-white/10 hover:text-white'}`}
                  aria-label={`${key} Vorschau`}
                >
                  <Icon size={16} />
                </button>
              ))}
            </div>
            <span className="inline-flex h-11 items-center gap-2 rounded-2xl bg-white/10 px-4 text-xs font-bold text-white/70">
              Read-only
            </span>
          </div>
        </div>
      </header>

      <section className="grid min-h-[calc(100vh-76px)] gap-4 p-3 md:grid-cols-[280px_1fr] md:p-5">
        <aside className="hidden rounded-[28px] border border-white/10 bg-white/[0.04] p-4 md:block">
          <div className="mb-6 rounded-3xl bg-white p-4 text-slate-950">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Demo-Modus</p>
            <h1 className="mt-3 text-2xl font-black leading-tight">Der Admin, den Kunden später wirklich nutzen.</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">Die Vorschau zeigt echte Admin-Ansichten, ist aber hier bewusst schreibgeschützt. Kein Speichern, kein Publish, keine Tenant-Änderung.</p>
          </div>
          <div className="space-y-2">
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              const selected = index === activeTab;
              return (
                <button
                  key={tab.label}
                  type="button"
                  onClick={() => setActiveTab(index)}
                  className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition ${selected ? 'bg-white text-slate-950' : 'text-white/62 hover:bg-white/10 hover:text-white'}`}
                >
                  <Icon size={17} />
                  <span>
                    <span className="block text-sm font-semibold">{tab.label}</span>
                    <span className={`block text-xs ${selected ? 'text-slate-500' : 'text-white/35'}`}>{tab.note}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        <div className="min-h-[620px] overflow-hidden rounded-[32px] border border-white/10 bg-[#101016] p-2 shadow-2xl shadow-black/40 md:min-h-0">
          <AdminFrame src={src} viewport={viewport} />
        </div>
      </section>
    </main>
  );
}
