'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  Activity,
  ArrowRight,
  Bot,
  CheckCircle2,
  CircleHelp,
  FileText,
  Globe2,
  Image,
  LayoutTemplate,
  Navigation,
  Palette,
  Search,
  ShoppingBag,
  Sparkles,
  WandSparkles,
} from 'lucide-react';
import { RestartTourButton } from '@/components/admin/onboarding-tour';

export type HelpFeatureState = {
  shop: boolean;
  booking: boolean;
  billing: boolean;
  i18n: boolean;
};

type HelpEntry = {
  title: string;
  summary: string;
  detail: string;
  href: string;
  cta: string;
  keywords?: string;
  status?: 'active' | 'inactive';
};

type HelpCategory = {
  id: string;
  title: string;
  intro: string;
  icon: typeof FileText;
  entries: HelpEntry[];
};

const statusEntry = (
  active: boolean,
  activeEntry: Omit<HelpEntry, 'status'>,
  inactiveEntry: Omit<HelpEntry, 'status'>,
): HelpEntry => active
  ? { ...activeEntry, status: 'active' }
  : { ...inactiveEntry, status: 'inactive' };

function getCategories(features: HelpFeatureState): HelpCategory[] {
  return [
    {
      id: 'inhalte',
      title: 'Inhalte',
      intro: 'Seiten aufbauen, wiederkehrende Inhalte pflegen und Übersichten vollständig halten.',
      icon: FileText,
      entries: [
        {
          title: 'Seiten und Sections',
          summary: 'Eine Seite besteht aus einzelnen Inhaltsblöcken, den Sections.',
          detail: 'Öffne eine Seite, ordne ihre Sections und bearbeite Texte, Bilder, Listen und Buttons. Speichern ändert nur den Entwurf.',
          href: '/admin/pages',
          cta: 'Seiten öffnen',
          keywords: 'page section abschnitt inhalt speichern',
        },
        {
          title: 'Collections und Einträge',
          summary: 'Collections bündeln Inhalte wie Projekte, Leistungen, News oder Teamprofile.',
          detail: 'Nutze sie, wenn mehrere Einträge gleich aufgebaut sind. Jeder Eintrag kann eine eigene Detailseite und eigene SEO-Daten besitzen.',
          href: '/admin/collections',
          cta: 'Collections öffnen',
          keywords: 'collection item eintrag referenz projekt leistung news',
        },
        {
          title: 'Übersichts- und Detailseiten',
          summary: 'Eine Collection braucht eine Übersicht, von der Besucher zu den Einträgen gelangen.',
          detail: 'Prüfe bei jeder Collection sowohl die Übersichtsseite als auch einzelne Detailseiten. So entstehen keine leeren Links oder 404-Seiten.',
          href: '/admin/pages',
          cta: 'Übersichtsseiten prüfen',
          keywords: 'übersicht detail 404 slug collection',
        },
      ],
    },
    {
      id: 'design',
      title: 'Design',
      intro: 'Marke, Lesbarkeit und Footer-Varianten konsistent steuern.',
      icon: Palette,
      entries: [
        {
          title: 'Marke, Farben und Schriften',
          summary: 'Globale Designwerte bilden die Grundlage für alle Seiten.',
          detail: 'Pflege Logo, Schriften und Hauptfarben zentral. Einzelne Sections können diese Werte bewusst überschreiben.',
          href: '/admin/brand',
          cta: 'Marke und Design öffnen',
          keywords: 'logo font schrift farbe brand',
        },
        {
          title: 'Kontrast und Lesbarkeit',
          summary: 'Text muss sich deutlich vom jeweiligen Hintergrund abheben.',
          detail: 'Prüfe besonders Text auf Bildern, Buttons, Karten und dunkle Sections. Öffne danach die Mobile-Vorschau.',
          href: '/admin/content-health',
          cta: 'Website prüfen',
          keywords: 'kontrast readability lesbar hintergrund button text',
        },
        {
          title: 'Footer-Stil und Footer-Farben',
          summary: 'Footer-Aufbau und Farben werden in Navigation & Footer gepflegt.',
          detail: 'Wähle einen passenden Stil, passe seine Farben an und kontrolliere CTA, Links, Kontakt und Rechtliches in der Vorschau.',
          href: '/admin/navigation',
          cta: 'Footer bearbeiten',
          keywords: 'footer stil variante farbe cta link',
        },
      ],
    },
    {
      id: 'navigation',
      title: 'Navigation und Sichtbarkeit',
      intro: 'Wege durch die Website, Suchmaschinen-Angaben und der Unterschied zwischen Entwurf und Live-Stand.',
      icon: Navigation,
      entries: [
        {
          title: 'Navigation und Footer',
          summary: 'Die Navigation zeigt die wichtigsten Ziele, der Footer darf ausführlicher sein.',
          detail: 'Vermeide zu viele Hauptpunkte. Achte darauf, dass Kontakt, Impressum und Datenschutz erreichbar bleiben.',
          href: '/admin/navigation',
          cta: 'Navigation öffnen',
          keywords: 'menü nav footer links',
        },
        {
          title: 'SEO, Slug, Noindex und Open Graph',
          summary: 'Der Slug ist der URL-Teil; Noindex blendet eine Seite in Suchmaschinen aus.',
          detail: 'Open Graph bestimmt häufig das Vorschaubild beim Teilen. Nutze Noindex nur bewusst und gib wichtigen Seiten klare Titel und Beschreibungen.',
          href: '/admin/seo',
          cta: 'SEO prüfen',
          keywords: 'slug noindex open graph google meta url',
        },
        {
          title: 'Speichern oder veröffentlichen?',
          summary: 'Speichern sichert den Entwurf. Veröffentlichen macht den gespeicherten Stand live.',
          detail: 'Du kannst Änderungen in Ruhe speichern und prüfen. Erst mit Veröffentlichen sehen Besucher den neuen Stand.',
          href: '/admin',
          cta: 'Zum Dashboard',
          keywords: 'save publish live entwurf speichern veröffentlichen',
        },
        {
          title: 'Impressum und Datenschutz',
          summary: 'Rechtliche Seiten müssen vollständig, aktuell und gut erreichbar sein.',
          detail: 'Prüfe die Angaben vor dem Launch und verlinke beide Seiten im Footer.',
          href: '/admin/legal',
          cta: 'Rechtliches öffnen',
          keywords: 'legal impressum datenschutz pflicht',
        },
      ],
    },
    {
      id: 'bearbeiten',
      title: 'Bearbeiten',
      intro: 'Vorschau, Medien und besondere Sections sicher einsetzen.',
      icon: WandSparkles,
      entries: [
        {
          title: 'Vorschau und direktes Bearbeiten',
          summary: 'Die Vorschau zeigt deinen aktuellen Entwurf auf Desktop und Mobilgeräten.',
          detail: 'Öffne sie während der Bearbeitung, prüfe Bildausschnitte und lange Texte und nutze direktes Bearbeiten, wenn es für das Feld angeboten wird.',
          href: '/admin/pages',
          cta: 'Seite zum Prüfen wählen',
          keywords: 'preview live direkt mobile desktop',
        },
        {
          title: 'Mediathek und Bilder',
          summary: 'Bilder werden zentral gespeichert und in mehreren Sections wiederverwendet.',
          detail: 'Nutze klare Alt-Texte, kontrolliere den Fokuspunkt und wähle für jede Section ein passendes Seitenverhältnis.',
          href: '/admin/media',
          cta: 'Mediathek öffnen',
          keywords: 'bild upload medien alt text fokuspunkt',
        },
        {
          title: 'Advanced- und Premium-Sections',
          summary: 'Besondere Sections brauchen mehr Material und eine klare Aufgabe.',
          detail: 'Lies die Einrichtungshilfe im Editor, befülle alle erforderlichen Inhalte und teste Interaktionen auch mobil.',
          href: '/admin/pages',
          cta: 'Section-Auswahl öffnen',
          keywords: 'advanced premium novelty section canvas x-ray',
        },
      ],
    },
    {
      id: 'funktionen',
      title: 'Anfragen und bezahlte Funktionen',
      intro: 'Aktive Module verwalten oder verfügbare Erweiterungen gezielt anfragen.',
      icon: Sparkles,
      entries: [
        statusEntry(features.shop, {
          title: 'Online-Shop',
          summary: 'Das Shop-Modul ist für diesen Tenant aktiv.',
          detail: 'Verwalte Produkte, Kategorien, Zahlungen, Bestellungen und Versand im Shop-Bereich.',
          href: '/admin/shop',
          cta: 'Shop verwalten',
          keywords: 'shop produkt zahlung bestellung versand',
        }, {
          title: 'Online-Shop',
          summary: 'Das Shop-Modul ist für diesen Tenant noch nicht aktiv.',
          detail: 'Auf der Funktionsübersicht siehst du den Leistungsumfang und kannst das Modul anfragen.',
          href: '/admin/functions',
          cta: 'Funktionen ansehen',
          keywords: 'shop produkt zahlung premium',
        }),
        statusEntry(features.booking, {
          title: 'Booking Pro',
          summary: 'Booking Pro ist für diesen Tenant aktiv.',
          detail: 'Pflege Leistungen, Ressourcen, verfügbare Zeiten, Benachrichtigungen und Buchungsregeln.',
          href: '/admin/functions/booking',
          cta: 'Booking Pro verwalten',
          keywords: 'booking buchung kalender termin ressource',
        }, {
          title: 'Booking Pro',
          summary: 'Booking Pro ist für diesen Tenant noch nicht aktiv.',
          detail: 'Die Funktionsübersicht erklärt den Unterschied zur einfachen Reservierungs-Section.',
          href: '/admin/functions',
          cta: 'Funktionen ansehen',
          keywords: 'booking buchung kalender premium',
        }),
        statusEntry(features.billing, {
          title: 'Rechnungen und Kunden',
          summary: 'Das Rechnungsmodul ist für diesen Tenant aktiv.',
          detail: 'Verwalte Kunden, Leistungen, Dokumente, Serien und Rechnungseinstellungen im Modul.',
          href: '/admin/billing',
          cta: 'Rechnungen öffnen',
          keywords: 'billing rechnung kunde angebot serie',
        }, {
          title: 'Rechnungen und Kunden',
          summary: 'Das Rechnungsmodul ist für diesen Tenant noch nicht aktiv.',
          detail: 'Auf der Funktionsübersicht kannst du den Leistungsumfang ansehen und das Modul anfragen.',
          href: '/admin/functions',
          cta: 'Funktionen ansehen',
          keywords: 'billing rechnung kunde premium',
        }),
        statusEntry(features.i18n, {
          title: 'Mehrsprachigkeit',
          summary: 'Mehrsprachigkeit ist für diesen Tenant aktiv.',
          detail: 'Verwalte Sprachen und übersetze Seiten, Navigation und Inhalte in den jeweiligen Editoren.',
          href: '/admin/functions/i18n',
          cta: 'Sprachen verwalten',
          keywords: 'i18n sprache übersetzung englisch',
        }, {
          title: 'Mehrsprachigkeit',
          summary: 'Mehrsprachigkeit ist für diesen Tenant noch nicht aktiv.',
          detail: 'Die Funktionsübersicht zeigt, wie zusätzliche Sprachen aktiviert werden können.',
          href: '/admin/functions',
          cta: 'Funktionen ansehen',
          keywords: 'i18n sprache übersetzung premium',
        }),
      ],
    },
    {
      id: 'probleme',
      title: 'Website-Check und Fehlerbehebung',
      intro: 'Häufige Probleme verständlich prüfen, ohne technische Diagnosen lesen zu müssen.',
      icon: Activity,
      entries: [
        {
          title: 'Website-Check verwenden',
          summary: 'Der Website-Check bündelt Hinweise zu Inhalt, Struktur und Lesbarkeit.',
          detail: 'Hinweise helfen bei der Verbesserung, blockieren aber nicht das Speichern. Öffne betroffene Seiten direkt aus der Übersicht.',
          href: '/admin/content-health',
          cta: 'Website prüfen',
          keywords: 'health check problem hinweis fehler',
        },
        {
          title: 'Änderung ist nicht sichtbar',
          summary: 'Prüfe zuerst, ob du gespeichert und anschließend veröffentlicht hast.',
          detail: 'Lade die öffentliche Seite danach neu. Die Admin-Vorschau kann bereits Entwurfsänderungen zeigen, die noch nicht live sind.',
          href: '/admin',
          cta: 'Veröffentlichung prüfen',
          keywords: 'cache nicht sichtbar live publish speichern',
        },
        {
          title: 'Seite oder Link führt zu 404',
          summary: 'Meist fehlt die Zielseite oder ein Link zeigt auf einen alten Slug.',
          detail: 'Prüfe Seiten, Collection-Übersichten und Navigation. Ein Slug ist der Teil der Adresse nach der Domain.',
          href: '/admin/pages',
          cta: 'Seiten und Slugs prüfen',
          keywords: '404 link kaputt slug übersicht collection',
        },
      ],
    },
  ];
}

const QUICK_ACTIONS = [
  { label: 'eine Seite bearbeiten', href: '/admin/pages', icon: FileText },
  { label: 'Farben und Schriften ändern', href: '/admin/brand', icon: Palette },
  { label: 'den Footer anpassen', href: '/admin/navigation', icon: LayoutTemplate },
  { label: 'Bilder hochladen', href: '/admin/media', icon: Image },
  { label: 'die Website prüfen', href: '/admin/content-health', icon: Activity },
  { label: 'eine Funktion verwalten', href: '/admin/functions', icon: ShoppingBag },
];

export function HelpHub({
  tenantId,
  features,
}: {
  tenantId: string;
  features: HelpFeatureState;
}) {
  const [query, setQuery] = useState('');
  const categories = useMemo(() => getCategories(features), [features]);
  const normalizedQuery = query.trim().toLocaleLowerCase('de');
  const filtered = useMemo(() => {
    if (!normalizedQuery) return categories;
    return categories
      .map(category => ({
        ...category,
        entries: category.entries.filter(entry => [
          category.title,
          category.intro,
          entry.title,
          entry.summary,
          entry.detail,
          entry.keywords || '',
        ].join(' ').toLocaleLowerCase('de').includes(normalizedQuery)),
      }))
      .filter(category => category.entries.length > 0);
  }, [categories, normalizedQuery]);
  const resultCount = filtered.reduce((count, category) => count + category.entries.length, 0);

  return (
    <div className="space-y-6">
      <header className="overflow-hidden rounded-3xl border border-zinc-200 bg-white">
        <div className="grid gap-8 px-6 py-7 md:grid-cols-[minmax(0,1fr)_minmax(18rem,0.72fr)] md:px-8 md:py-9">
          <div>
            <div className="flex items-center gap-2 text-admin-accent">
              <CircleHelp size={19} aria-hidden="true" />
              <span className="text-[11px] font-bold uppercase tracking-[0.18em]">Hilfe & Anleitung</span>
            </div>
            <h1 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-zinc-950 md:text-4xl">
              Was möchtest du erledigen?
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-600 md:text-base">
              Suche nach einem Thema oder springe direkt zur passenden Einstellung. Alle Hinweise sind verständlich und verändern nichts an deiner Website.
            </p>
            <div className="mt-5">
              <RestartTourButton tenantId={tenantId} />
            </div>
          </div>
          <div className="self-end rounded-2xl bg-zinc-950 p-5 text-white">
            <label htmlFor="help-search" className="text-xs font-bold uppercase tracking-[0.14em] text-white/60">
              Hilfe durchsuchen
            </label>
            <div className="mt-3 flex min-h-12 items-center gap-3 rounded-xl bg-white px-4 text-zinc-950 focus-within:ring-2 focus-within:ring-admin-accent">
              <Search size={18} className="shrink-0 text-zinc-400" aria-hidden="true" />
              <input
                id="help-search"
                type="search"
                value={query}
                onChange={event => setQuery(event.target.value)}
                placeholder="z. B. Footer, 404 oder Rechnung"
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-400"
              />
            </div>
            <p className="mt-3 text-xs text-white/60" aria-live="polite">
              {normalizedQuery ? `${resultCount} passende Hilfethemen` : 'Durchsuche alle Hilfethemen'}
            </p>
          </div>
        </div>
      </header>

      <section className="admin-card p-5 sm:p-6" aria-labelledby="quick-actions-title">
        <h2 id="quick-actions-title" className="text-sm font-semibold text-zinc-950">Ich möchte …</h2>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {QUICK_ACTIONS.map(action => (
            <Link
              key={action.label}
              href={action.href}
              className="group flex min-h-12 items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-medium text-zinc-800 transition hover:border-admin-accent/30 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-accent"
            >
              <action.icon size={17} className="shrink-0 text-admin-accent" aria-hidden="true" />
              <span className="min-w-0 flex-1">{action.label}</span>
              <ArrowRight size={15} className="shrink-0 text-zinc-300 transition group-hover:translate-x-0.5 group-hover:text-admin-accent" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>

      {!normalizedQuery && (
        <nav aria-label="Hilfekategorien" className="flex gap-2 overflow-x-auto pb-1">
          {categories.map(category => (
            <a
              key={category.id}
              href={`#hilfe-${category.id}`}
              className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-xs font-semibold text-zinc-700 transition hover:border-admin-accent/30 hover:text-admin-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-accent"
            >
              <category.icon size={14} aria-hidden="true" /> {category.title}
            </a>
          ))}
        </nav>
      )}

      {filtered.length ? (
        <div className="space-y-5">
          {filtered.map(category => (
            <section key={category.id} id={`hilfe-${category.id}`} className="admin-card scroll-mt-6 overflow-hidden" aria-labelledby={`hilfe-${category.id}-title`}>
              <div className="border-b border-zinc-100 px-5 py-5 sm:px-6">
                <div className="flex items-start gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-admin-accent/10 text-admin-accent">
                    <category.icon size={19} aria-hidden="true" />
                  </span>
                  <div>
                    <h2 id={`hilfe-${category.id}-title`} className="font-semibold text-zinc-950">{category.title}</h2>
                    <p className="mt-1 text-sm leading-6 text-zinc-500">{category.intro}</p>
                  </div>
                </div>
              </div>
              <div className="divide-y divide-zinc-100">
                {category.entries.map(entry => (
                  <article key={entry.title} className="grid gap-4 px-5 py-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-center sm:px-6">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-semibold text-zinc-950">{entry.title}</h3>
                        {entry.status && (
                          <span className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${
                            entry.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-zinc-100 text-zinc-500'
                          }`}>
                            {entry.status === 'active' && <CheckCircle2 size={11} aria-hidden="true" />}
                            {entry.status === 'active' ? 'Aktiv' : 'Nicht aktiv'}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm font-medium leading-6 text-zinc-700">{entry.summary}</p>
                      <p className="mt-1 text-sm leading-6 text-zinc-500">{entry.detail}</p>
                    </div>
                    <Link
                      href={entry.href}
                      className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-zinc-200 px-3 text-xs font-semibold text-zinc-800 transition hover:border-admin-accent/30 hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-accent"
                    >
                      {entry.cta} <ArrowRight size={14} aria-hidden="true" />
                    </Link>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="admin-card px-6 py-12 text-center">
          <Search size={26} className="mx-auto text-zinc-300" aria-hidden="true" />
          <h2 className="mt-3 font-semibold text-zinc-950">Kein passendes Hilfethema gefunden</h2>
          <p className="mt-2 text-sm text-zinc-500">Versuche einen kürzeren Begriff oder öffne die Funktionsübersicht.</p>
          <Link href="/admin/functions" className="admin-btn-secondary mt-5">
            <Globe2 size={16} aria-hidden="true" /> Funktionen ansehen
          </Link>
        </div>
      )}

      <footer className="rounded-2xl border border-zinc-200 bg-zinc-950 px-6 py-6 text-white sm:px-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Bot size={18} className="text-admin-accent" aria-hidden="true" />
              <h2 className="font-semibold">Du kommst nicht weiter?</h2>
            </div>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">
              Beschreibe kurz, was du tun möchtest und auf welcher Seite du arbeitest. Teile keine Passwörter oder API-Schlüssel.
            </p>
          </div>
          <a
            href="mailto:hello@flamingomedia.online?subject=Hilfe%20im%20Flamingo%20CMS"
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-admin-accent px-4 text-sm font-semibold text-white transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Support kontaktieren <ArrowRight size={15} aria-hidden="true" />
          </a>
        </div>
      </footer>
    </div>
  );
}
