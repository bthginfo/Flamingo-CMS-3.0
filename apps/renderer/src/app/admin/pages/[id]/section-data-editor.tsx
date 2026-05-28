'use client';

import { useState, useEffect, useRef } from 'react';
import { Info } from 'lucide-react';
import { ImageUploadField } from '@/components/image-upload-field';
import { ButtonField, DetailLinkField } from '@/components/button-field';
import { IconPickerField } from '@/components/icon-picker-field';
import { MediaBulkPickerButton } from '@/components/media-bulk-picker';
import { RichTextEditorField } from '@/components/rich-text-editor';
import { MiniRichTextField } from '@/components/mini-rich-text';
import { saveMediaRecord } from '@/app/admin/media-actions';
import { EMBED_PROVIDERS, EMBED_CATEGORIES, getProvider } from '@/lib/embed-providers';
import { SECTION_PREVIEW_DATA } from '@/lib/section-preview-data';
import { getCollectionKeysAction } from '@/app/admin/collections/actions';

// Reports current editor data to parent on every change (skip initial render).
function useReport(data: Record<string, unknown>, onChange: (d: Record<string, unknown>) => void) {
  const isFirst = useRef(true);
  const serialized = JSON.stringify(data);
  useEffect(() => {
    if (isFirst.current) { isFirst.current = false; return; }
    onChange(JSON.parse(serialized));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serialized]);
}


// ─── FIELD LABELS (German) ────────────────────────────────────────────────────
const FIELD_LABELS: Record<string, string> = {
  // Common / Generic
  headline: 'Überschrift',
  halfWidth: 'Halbe Breite',
  subline: 'Unterzeile',
  badgeText: 'Badge',
  badge: 'Badge',
  eyebrow: 'Dachzeile',
  text: 'Text',
  content: 'Inhalt',
  intro: 'Einleitung',
  story: 'Geschichte',
  description: 'Beschreibung',
  title: 'Titel',
  subtitle: 'Untertitel',
  name: 'Name',
  role: 'Rolle',
  bio: 'Biografie',
  quote: 'Zitat',
  image: 'Bild',
  bgImage: 'Hintergrundbild',
  bgImageMobile: 'Hintergrundbild (Mobil)',
  bgColor: 'Hintergrundfarbe',
  bgPosition: 'Bildposition',
  bgPositionMobile: 'Bildposition (Mobil)',
  bgMode: 'Hintergrund-Modus',
  overlayColor: 'Overlay-Farbe',
  overlayOpacity: 'Overlay-Deckkraft',
  imageEffect: 'Bildeffekt',
  imageEffectIntensity: 'Effekt-Intensität',
  imagePosition: 'Bildposition',
  imageAlt: 'Alt-Text (Barrierefreiheit)',
  layout: 'Layout',
  align: 'Ausrichtung',
  reversed: 'Gespiegelt',

  // CTA / Buttons
  primaryCta: 'Primärer Button',
  secondaryCta: 'Sekundärer Button',
  ctaPrimary: 'Primärer Button',
  ctaLabel: 'Button-Beschriftung',
  ctaHref: 'Button-Link',
  cta: 'Call-to-Action',
  label: 'Beschriftung',
  href: 'Link-Ziel',
  linkLabel: 'Link-Text',
  linkHref: 'Link-Ziel',
  submitLabel: 'Absende-Button',
  continueShoppingLabel: 'Weiter-Einkaufen-Text',
  checkoutLabel: 'Zur-Kasse-Text',

  // Media
  videoUrl: 'Video-URL',
  embedUrl: 'Einbettungs-URL',
  embedCode: 'Einbettungs-Code',
  src: 'Bildquelle',
  alt: 'Alt-Text',
  caption: 'Bildunterschrift',
  poster: 'Vorschaubild',
  logo: 'Logo',

  // Lists / Items
  items: 'Einträge',
  links: 'Links',
  cards: 'Karten',
  steps: 'Schritte',
  entries: 'Einträge',
  features: 'Merkmale',
  facts: 'Fakten',
  values: 'Werte',
  stats: 'Statistiken',
  highlights: 'Highlights',
  logos: 'Logos',
  images: 'Bilder',
  panels: 'Panels',
  slides: 'Slides',
  members: 'Team-Mitglieder',
  projects: 'Projekte',
  categories: 'Kategorien',
  packages: 'Pakete',
  columns: 'Spalten',
  rows: 'Zeilen',
  blocks: 'Blöcke',
  services: 'Leistungen',
  manualCards: 'Karten (manuell)',
  infoCards: 'Info-Karten',
  trustItems: 'Vertrauens-Elemente',

  // Hero specific
  trustStripColor: 'Trust-Leiste Farbe',
  badgeIcon: 'Badge-Icon',
  badgeStarsIcon: 'Badge-Sterne-Icon',

  // FAQ
  question: 'Frage',
  answer: 'Antwort',
  expandFirst: 'Erste offen',
  source: 'Quelle',

  // Testimonials
  ratingValue: 'Bewertung',
  ratingCount: 'Anzahl Bewertungen',
  rating: 'Sterne',
  context: 'Kontext',

  // Map
  height: 'Höhe',
  provider: 'Anbieter',

  // Stats
  value: 'Wert',
  suffix: 'Suffix',
  prefix: 'Präfix',

  // Collection
  collectionKey: 'Collection',
  sortBy: 'Sortierung',
  showImage: 'Bild anzeigen',
  showDate: 'Datum anzeigen',
  showExcerpt: 'Vorschau anzeigen',
  showSortControls: 'Sortier-Optionen zeigen',
  showSearch: 'Suche anzeigen',
  showCategories: 'Kategorien anzeigen',
  showSort: 'Sortierung anzeigen',

  // Shop
  mode: 'Modus',
  categorySlug: 'Kategorie-Slug',
  productIds: 'Produkt-IDs',
  count: 'Anzahl',
  emptyText: 'Leer-Text',
  price: 'Preis',

  // Popup
  delayMs: 'Verzögerung (ms)',
  triggerDelayMs: 'Trigger-Verzögerung (ms)',
  frequency: 'Häufigkeit',

  // Process / Timeline
  icon: 'Icon',
  number: 'Nummer',
  year: 'Jahr',
  timeLabel: 'Zeitangabe',
  kicker: 'Kicker',
  checkmarks: 'Häkchen',

  // Before/After
  imageBefore: 'Bild vorher',
  imageAfter: 'Bild nachher',
  labelBefore: 'Label vorher',
  labelAfter: 'Label nachher',
  aspectRatio: 'Seitenverhältnis',

  // Showcase / Product
  span: 'Grid-Breite',
  size: 'Größe',
  mediaType: 'Medientyp',
  panelHeight: 'Panel-Höhe',
  ctaLink: 'CTA-Link',

  // Color fields
  textColor: 'Textfarbe',
  accentColor: 'Akzentfarbe',
  trustStripBg: 'Trust-Leiste Hintergrund',

  // Team
  storyHeadline: 'Story-Überschrift',
  storyText: 'Story-Text',
  storyImage: 'Story-Bild',
  valuesHeadline: 'Werte-Überschrift',
  membersHeadline: 'Team-Überschrift',

  // Embed
  config: 'Konfiguration',
  maxWidth: 'Max. Breite',

  // Comparison
  highlightCol: 'Hervorgehobene Spalte',
  feature: 'Merkmal',
  note: 'Anmerkung',
  highlighted: 'Hervorgehoben',

  // Photography
  location: 'Standort',
  category: 'Kategorie',
  date: 'Datum',
  excerpt: 'Vorschau-Text',

  // Banner
  style: 'Stil',
  link: 'Link',
  bgStyle: 'Hintergrund-Stil',

  // Cinematic Hero
  overlay: 'Overlay',

  // ServiceDetail
  introText: 'Einleitungstext',
  formEnabled: 'Formular aktiv',

  // Wedding
  dresscode: 'Dresscode',
  weddingMenu: 'Menü',
  accommodation: 'Unterkunft',
};

// ─── FIELD HELP TEXTS (German) ────────────────────────────────────────────────
const FIELD_HELP: Record<string, string> = {
  cards: 'Die einzelnen Karten/Blöcke in der Darstellung.',
  slides: 'Die einzelnen Inhaltsblöcke die nacheinander angezeigt werden.',
  kicker: 'Kurzer einleitender Text über dem Titel eines Slides oder einer Karte.',
  headline: 'Die Hauptüberschrift der Section.',
  subline: 'Ergänzender Text unter der Überschrift.',
  badgeText: 'Kleines Label über der Überschrift (z.B. "Neu", "Top bewertet").',
  badge: 'Kleines Label über der Überschrift.',
  eyebrow: 'Dachzeile über der Hauptüberschrift.',
  text: 'Freitext-Inhalt, unterstützt einfache Formatierung.',
  content: 'Hauptinhalt — unterstützt Rich-Text (fett, kursiv, Listen).',
  image: 'Hauptbild der Section. Empfohlen: 16:9 oder 3:2.',
  bgImage: 'Hintergrundbild, das die gesamte Section füllt.',
  bgImageMobile: 'Alternatives Hintergrundbild für Mobilgeräte.',
  bgColor: 'Hintergrundfarbe als Hex-Wert (z.B. #1a1a2e).',
  bgPosition: 'Bildausschnitt bestimmen (z.B. center, top).',
  overlayColor: 'Overlay-Farbe über dem Hintergrundbild (z.B. für Lesbarkeit).',
  overlayOpacity: 'Deckkraft des Overlays (0 = transparent, 1 = deckend).',
  imageEffect: 'Optionaler Effekt (z.B. parallax, zoom).',
  imageEffectIntensity: 'Stärke des Bildeffekts (0–100).',
  imageAlt: 'Beschreibender Text für Screenreader und SEO.',
  layout: 'Variante der Darstellung.',
  align: 'Textausrichtung (links, zentriert, rechts).',
  reversed: 'Reihenfolge von Bild und Text tauschen.',
  primaryCta: 'Haupt-Button mit Text und Ziel-Link.',
  secondaryCta: 'Optionaler zweiter Button.',
  ctaLabel: 'Text auf dem Button.',
  ctaHref: 'Ziel-URL des Buttons.',
  linkLabel: 'Beschriftung des Links.',
  linkHref: 'Ziel-URL des Links.',
  videoUrl: 'YouTube- oder Vimeo-URL für Videoeinbettung.',
  embedUrl: 'URL für die Karteneinbettung (Google Maps, OpenStreetMap).',
  embedCode: 'HTML-Code für externe Einbettungen (iFrames etc.).',
  height: 'Höhe in Pixel.',
  maxWidth: 'Maximale Breite (z.B. 800px oder 100%).',
  provider: 'Externer Anbieter (z.B. Google Maps).',
  collectionKey: 'Technischer Schlüssel der verknüpften Collection.',
  sortBy: 'Standard-Sortierreihenfolge.',
  showImage: 'Vorschaulbild in der Liste anzeigen.',
  showDate: 'Erscheinungsdatum anzeigen.',
  showExcerpt: 'Kurzen Vorschau-Text anzeigen.',
  showSortControls: 'Sortier-Buttons für Besucher anzeigen.',
  showSearch: 'Suchfeld für Besucher anzeigen.',
  showCategories: 'Kategorie-Filter anzeigen.',
  items: 'Liste der Einträge — per "Eintrag" hinzufügen und bearbeiten.',
  steps: 'Schritte/Phasen beschreiben (z.B. für Prozess-Darstellungen).',
  members: 'Team-Mitglieder mit Name, Rolle, Bild und optional Bio.',
  stats: 'Kennzahlen mit Wert und Beschriftung.',
  logos: 'Partnerlogos — empfohlen: SVG oder transparentes PNG.',
  images: 'Bildersammlung für die Galerie.',
  ratingValue: 'Durchschnittsbewertung (z.B. 4.8).',
  ratingCount: 'Gesamtanzahl der Bewertungen.',
  expandFirst: 'Erste FAQ standardmäßig geöffnet anzeigen.',
  source: 'Optionale Quellenangabe.',
  delayMs: 'Wartezeit in Millisekunden bevor das Popup erscheint.',
  frequency: 'Wie oft das Popup pro Besucher erscheint.',
  icon: 'Icon-Name (z.B. aus Lucide Icons).',
  imageBefore: 'Bild für den Vorher-Zustand.',
  imageAfter: 'Bild für den Nachher-Zustand.',
  labelBefore: 'Beschriftung für "Vorher".',
  labelAfter: 'Beschriftung für "Nachher".',
  aspectRatio: 'Seitenverhältnis (z.B. 16:9, 4:3, 1:1).',
  panelHeight: 'Höhe der Scroll-Panels in Pixel.',
  trustItems: 'Vertrauens-Elemente unter dem Hero (z.B. Zertifikate, Bewertungen).',
  trustStripColor: 'Hintergrundfarbe der Trust-Leiste.',
  manualCards: 'Karten manuell anlegen statt aus Collection zu laden.',
  infoCards: 'Info-Karten z.B. für Kontaktdaten.',
  submitLabel: 'Text auf dem Absende-Button.',
  formEnabled: 'Kontaktformular in dieser Section anzeigen.',
  storyHeadline: 'Überschrift für den Story-Bereich.',
  storyText: 'Freitext für die Teamgeschichte.',
  storyImage: 'Bild für den Story-Bereich.',
  valuesHeadline: 'Überschrift über den Unternehmenswerten.',
  membersHeadline: 'Überschrift über der Team-Liste.',
  highlightCol: 'Welche Spalte farblich hervorgehoben wird (0-basiert).',
  categorySlug: 'URL-Slug der Shop-Kategorie.',
  productIds: 'Komma-getrennte Liste von Produkt-IDs.',
  count: 'Maximale Anzahl der angezeigten Elemente.',
  emptyText: 'Text der angezeigt wird wenn keine Einträge vorhanden sind.',
  mode: 'Betriebsmodus (z.B. automatisch, manuell).',
  config: 'Erweiterte Konfiguration als JSON.',
  bgMode: 'Art des Hintergrunds (Bild, Farbe, Gradient).',
  span: 'Wie viele Grid-Spalten das Element einnimmt.',
  size: 'Größenvariante (klein, mittel, groß).',
  mediaType: 'Art des Mediums (Bild oder Video).',
  style: 'Stil-Variante der Darstellung.',
  bgStyle: 'Stil für den Hintergrund.',
  overlay: 'Overlay-Einstellung.',
  date: 'Datum der Veröffentlichung.',
  category: 'Zugeordnete Kategorie.',
  introText: 'Einleitender Text vor dem Hauptinhalt.',
  highlighted: 'Dieses Element visuell hervorheben.',
  features: 'Liste von Merkmalen/Vorteilen.',
  facts: 'Kennzahlen oder Fakten (Wert + Beschriftung).',
  highlights: 'Besondere Highlights hervorheben.',
  services: 'Liste der angebotenen Leistungen.',
  packages: 'Preis-/Leistungspakete.',
};

function fieldLabel(key: string) {
return FIELD_LABELS[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, char => char.toUpperCase());
}

function fieldHelp(key: string): string | undefined {
return FIELD_HELP[key];
}

function HelpHint({ fieldKey }: { fieldKey: string }) {
  const help = FIELD_HELP[fieldKey];
  if (!help) return null;
  return <p className="text-[11px] text-zinc-400 mt-0.5 mb-1">{help}</p>;
}

// Generic section data editor that renders a form per section type.
export function SectionDataEditor({ type, data, onChange }: { type: string; data: Record<string, unknown>; onChange: (data: Record<string, unknown>) => void }) {
  const Editor = EDITORS[type] ?? SchemaSectionEditor;
  return <Editor type={type} data={data} onChange={onChange} />;
}

type EditorProps = { type?: string; data: Record<string, unknown>; onChange: (data: Record<string, unknown>) => void };

// Generic structured editor for schema-shaped section data.
function SchemaSectionEditor({ type, data, onChange }: EditorProps) {
  const defaults = type ? SECTION_PREVIEW_DATA[type] || {} : {};
  const [source, setSource] = useState<Record<string, unknown>>(() => Object.keys(data).length > 0 ? data : defaults);

  useEffect(() => {
    const next = Object.keys(data).length > 0 ? data : defaults;
    setSource(next);
    if (Object.keys(data).length === 0 && Object.keys(defaults).length > 0) {
      onChange(defaults);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, type]);

  function isRecord(value: unknown): value is Record<string, unknown> {
    return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
  }

  function updateAtPath(path: Array<string | number>, value: unknown) {
    const update = (current: unknown, depth: number): unknown => {
      const key = path[depth];
      if (depth === path.length - 1) {
        if (Array.isArray(current)) return current.map((item, index) => index === key ? value : item);
        if (isRecord(current)) return { ...current, [key]: value };
        return current;
      }
      if (Array.isArray(current)) return current.map((item, index) => index === key ? update(item, depth + 1) : item);
      if (isRecord(current)) return { ...current, [key]: update(current[key as string], depth + 1) };
      return current;
    };
  
    const next = update(source, 0) as Record<string, unknown>;
    setSource(next);
    onChange(next);
  }

  

  function valueAtPath(path: Array<string | number>) {
    return path.reduce<unknown>((current, key) => {
      if (Array.isArray(current)) return current[key as number];
      if (isRecord(current)) return current[key as string];
      return undefined;
    }, source);
  }

  function imagePositionPath(path: Array<string | number>) {
    const fieldName = String(path[path.length - 1] || '');
    const parentPath = path.slice(0, -1);
    const candidates = [
      `${fieldName}Position`,
      `${fieldName}Focus`,
      `${fieldName}ObjectPosition`,
      fieldName === 'image' || fieldName === 'src' ? 'imagePosition' : '',
      fieldName === 'bgImage' ? 'bgPosition' : '',
      fieldName === 'bgImageMobile' ? 'bgPositionMobile' : '',
    ].filter(Boolean);
    for (const candidate of candidates) {
      if (valueAtPath([...parentPath, candidate]) !== undefined) return [...parentPath, candidate];
    }
    return [...parentPath, candidates[0] || `${fieldName}Position`];
  }

  function createEmptyLike(sample: unknown): unknown {
    if (typeof sample === 'string') return '';
    if (typeof sample === 'number') return 0;
    if (typeof sample === 'boolean') return false;
    if (Array.isArray(sample)) return [];
    if (isRecord(sample)) return Object.fromEntries(Object.keys(sample).map(key => [key, createEmptyLike(sample[key])])) as Record<string, unknown>;
    return '';
  }

  function renderValue(path: Array<string | number>, label: string, value: unknown) {
    const renderKey = path.join('.');
    if (typeof value === 'boolean') {
      return (
        <label key={renderKey} className="flex items-center justify-between gap-3 py-1 cursor-pointer group">
          <span className="text-sm text-zinc-700">{label}</span>
          {typeof path[path.length - 1] === 'string' && <HelpHint fieldKey={String(path[path.length - 1])} />}
          <button type="button" role="switch" aria-checked={value} onClick={() => updateAtPath(path, !value)}
            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${value ? 'bg-blue-600' : 'bg-zinc-300'}`}>
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${value ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </label>
      );
    }

    if (typeof value === 'number') {
      return (
        <label key={renderKey} className="block">
          <span className="text-xs font-medium text-zinc-600 mb-1 block">{label}</span>
          <input type="number" className="admin-input" value={value} onChange={(e) => updateAtPath(path, Number(e.target.value))} />
        </label>
      );
    }

    if (typeof value === 'string') {
      const fieldName = String(path[path.length - 1] || '');
      const multiline = value.length > 80 || /content|description|text|subline|bio|answer|excerpt|intro/i.test(fieldName);
      if (/color|colour|farbe|overlay/i.test(fieldName)) {
        return <ColorField key={renderKey} label={label} value={value} onChange={(v) => updateAtPath(path, v)} allowEmpty />;
      }
      if (/image|background|photo|avatar|poster|logo/i.test(fieldName)) {
        const positionPath = imagePositionPath(path);
        const positionValue = valueAtPath(positionPath);
        return (
          <ImageUploadField
            key={renderKey}
            label={label}
            value={value}
            onChange={(v) => updateAtPath(path, v)}
            position={typeof positionValue === 'string' ? positionValue : 'center'}
            onPositionChange={(v) => updateAtPath(positionPath, v)}
          />
        );
      }
      if (/href|link|url/i.test(fieldName)) {
        return <DetailLinkField key={renderKey} label={label} value={value} onChange={(v) => updateAtPath(path, v)} />;
      }
      if (/icon/i.test(fieldName)) {
        return <IconPickerField key={renderKey} label={label} value={value} onChange={(v) => updateAtPath(path, v)} />;
      }
      return <><Field key={renderKey} label={label} value={value} onChange={(v) => updateAtPath(path, v)} multiline={multiline} /><HelpHint fieldKey={String(path[path.length - 1])} /></>;
    }

    if (Array.isArray(value)) {
      // Use first item as template; fall back to defaults if array is empty
      const sample = value[0] ?? (Array.isArray(defaults[String(path[0])]) ? (defaults[String(path[0])] as unknown[])[0] : '') ?? '';
      return (
        <div key={renderKey} className="space-y-2">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-xs font-semibold text-zinc-600">{label}</span>
            <HelpHint fieldKey={String(path[path.length - 1])} />
            {typeof path[path.length - 1] === 'string' && <HelpHint fieldKey={String(path[path.length - 1])} />}
            <button type="button" className="text-xs font-medium text-blue-600 hover:underline" onClick={() => updateAtPath(path, [...value, createEmptyLike(sample)])}>+ Eintrag</button>
          </div>
          <div className="space-y-3">
            {value.map((item, index) => (
              <div key={`${renderKey}.${index}`} className="relative rounded-xl border border-zinc-200 bg-white p-3 pt-8 shadow-sm">
                <button type="button" className="absolute right-3 top-2 text-xs text-red-500 hover:text-red-600" onClick={() => updateAtPath(path, value.filter((_, itemIndex) => itemIndex !== index))}>Entfernen</button>
                {isRecord(item) ? (
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {Object.entries(item).map(([childKey, childValue]) => (
                      <div key={childKey} className={/text|description|subline|content|bio|answer/i.test(childKey) ? 'md:col-span-2' : undefined}>
                        {renderValue([...path, index, childKey], fieldLabel(childKey), childValue)}
                      </div>
                    ))}
                  </div>
                ) : (
                  renderValue([...path, index], `${label} ${index + 1}`, item)
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (isRecord(value)) {
      const entries = Object.entries(value);
      if ('label' in value && 'href' in value) {
        return <ButtonField key={renderKey} label={label} value={{ label: String(value.label ?? ''), href: String(value.href ?? ''), icon: typeof value.icon === 'string' ? value.icon : undefined }} onChange={(v) => updateAtPath(path, v)} />;
      }
      return (
        <div key={renderKey} className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
          <p className="mb-3 text-xs font-semibold text-zinc-600">{label}</p>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {entries.map(([childKey, childValue]) => (
              <div key={childKey} className={/text|description|subline|content|bio|answer/i.test(childKey) ? 'md:col-span-2' : undefined}>
                {renderValue([...path, childKey], fieldLabel(childKey), childValue)}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return <Field key={renderKey} label={label} value={String(value ?? '')} onChange={(v) => updateAtPath(path, v)} />;
  }

  const keys = Object.keys(source);
  if (keys.length === 0) {
    return <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-3 text-sm text-zinc-600">Für diese Section sind aktuell keine editierbaren Felder definiert.</div>;
  }

  return (
    <div className="space-y-3">
      {keys.map((key) => renderValue([key], fieldLabel(key), source[key]))}
    </div>
  );
}

function PopupEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({
    title: (data.title as string) || 'Sichern Sie sich Ihren Beratungstermin.',
    subtitle: (data.subtitle as string) || '',
    text: (data.text as string) || '',
    delayMs: Number(data.delayMs ?? data.triggerDelayMs ?? 2500),
    frequency: (data.frequency as string) || 'once',
    primaryCta: (data.primaryCta as { label: string; href: string }) || { label: '', href: '' },
    secondaryCta: (data.secondaryCta as { label: string; href: string }) || { label: '', href: '' },
  });

  useReport(d, onChange);

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs leading-5 text-blue-800">
        <strong>Nur einmal</strong> bedeutet: Nach dem Schließen sieht dieser Besucher das Popup auf diesem Gerät nicht erneut. <strong>Einmal pro Session</strong> bedeutet: Es kann in einer neuen Browser-Sitzung wieder erscheinen, aber nicht ständig beim Seitenwechsel.
      </div>
      <Field label={fieldLabel('title')} value={d.title} onChange={(v) => setD({ ...d, title: v })} />
      <Field label="Subtitle / Eyebrow" value={d.subtitle} onChange={(v) => setD({ ...d, subtitle: v })} placeholder="z.B. Kurzer Hinweis, Aktion, Newsletter" />
      <Field label="Fließtext" value={d.text} onChange={(v) => setD({ ...d, text: v })} multiline placeholder="Kurzer erklärender Text im Popup" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-xs font-medium text-zinc-600 mb-1 block">Trigger-Verzögerung in ms</span>
          <input type="number" min={0} step={250} className="admin-input" value={d.delayMs} onChange={(e) => setD({ ...d, delayMs: Math.max(0, Number(e.target.value) || 0) })} />
          <span className="mt-1 block text-[11px] text-zinc-400">1000 ms = 1 Sekunde. 0 ms öffnet direkt.</span>
        </label>
        <label className="block">
          <span className="text-xs font-medium text-zinc-600 mb-1 block">Wiederholung</span>
          <select className="admin-input" value={d.frequency} onChange={(e) => setD({ ...d, frequency: e.target.value })}>
            <option value="once">Nur einmal pro Besucher/Gerät</option>
            <option value="session">Einmal pro Browser-Session</option>
          </select>
        </label>
      </div>
      <ButtonField label="Primärer Button (optional)" value={d.primaryCta} onChange={(v) => setD({ ...d, primaryCta: v })} />
      <ButtonField label="Sekundärer Button (optional)" value={d.secondaryCta} onChange={(v) => setD({ ...d, secondaryCta: v })} />
    </div>
  );
}

function HeroEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({
    headline: (data.headline as string) || '',
    subline: (data.subline as string) || '',
    badgeText: (data.badgeText as string) || '',
    badgeIcon: (data.badgeIcon as string) || '',
    badgeStarsIcon: (data.badgeStarsIcon as string) || '',
    bgMode: (data.bgMode as string) || 'image',
    bgImage: (data.bgImage as string) || (data.image as string) || '',
    bgImageMobile: (data.bgImageMobile as string) || '',
    bgColor: (data.bgColor as string) || '#1a1a2e',
    bgPosition: (data.bgPosition as string) || (data.imagePosition as string) || 'center',
    bgPositionMobile: (data.bgPositionMobile as string) || 'center',
    overlayColor: (data.overlayColor as string) || '#000000',
    overlayOpacity: (data.overlayOpacity as number) ?? -1,
    trustItems: (data.trustItems as string[]) || [],
    trustStripColor: (data.trustStripColor as string) || '',
    primaryCta: (data.primaryCta as { label: string; href: string }) || { label: '', href: '' },
    secondaryCta: (data.secondaryCta as { label: string; href: string }) || { label: '', href: '' },
    imageEffect: (data.imageEffect as string) || 'none',
    imageEffectIntensity: (data.imageEffectIntensity as string) || 'medium',
  });
  useReport({ ...d, image: d.bgImage, imagePosition: d.bgPosition } as unknown as Record<string, unknown>, onChange);

  return (
    <div className="space-y-3">
      <Field label={fieldLabel('headline')} value={d.headline} onChange={(v) => setD({ ...d, headline: v })} />
      <Field label={fieldLabel('subline')} value={d.subline} onChange={(v) => setD({ ...d, subline: v })} multiline />
      <Field label="Badge-Text" value={d.badgeText} onChange={(v) => setD({ ...d, badgeText: v })} />
      <IconPickerField label="Badge-Icon" value={d.badgeIcon} onChange={(v) => setD({ ...d, badgeIcon: v })} />
      <IconPickerField label="Badge-Sterne-Icon (leer = keine Sterne)" value={d.badgeStarsIcon} onChange={(v) => setD({ ...d, badgeStarsIcon: v })} />
      <div>
        <label className="text-xs font-medium text-zinc-600 mb-1 block">Hintergrund</label>
        <div className="flex gap-2 mb-3">
          <button type="button" onClick={() => setD({ ...d, bgMode: 'image' })} className={`px-3 py-1.5 text-xs rounded-md transition-colors ${d.bgMode === 'image' ? 'bg-blue-100 text-blue-700 font-medium' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'}`}>Bild</button>
          <button type="button" onClick={() => setD({ ...d, bgMode: 'color' })} className={`px-3 py-1.5 text-xs rounded-md transition-colors ${d.bgMode === 'color' ? 'bg-blue-100 text-blue-700 font-medium' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'}`}>Farbe</button>
        </div>
        {d.bgMode === 'image' ? (
          <>
            <ImageUploadField label="Hintergrundbild" value={d.bgImage} onChange={(v) => setD({ ...d, bgImage: v })} position={d.bgPosition} onPositionChange={(v) => setD({ ...d, bgPosition: v })} />
            <ImageUploadField label="Hintergrundbild (Mobil, optional)" value={d.bgImageMobile} onChange={(v) => setD({ ...d, bgImageMobile: v })} position={d.bgPositionMobile} onPositionChange={(v) => setD({ ...d, bgPositionMobile: v })} />
            {d.bgImage && (
              <>
              <div className="mt-3">
                <span className="text-xs font-medium text-zinc-600 block mb-1.5">Bildposition Desktop (Fokuspunkt)</span>
                <div className="inline-grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 bg-zinc-100 p-1 rounded-lg">
                  {(['top left','top center','top right','center left','center','center right','bottom left','bottom center','bottom right'] as const).map(pos => (
                    <button key={pos} type="button" onClick={() => setD({ ...d, bgPosition: pos })} className={`w-7 h-7 rounded text-[9px] leading-none transition-colors ${d.bgPosition === pos ? 'bg-blue-500 text-white shadow-sm' : 'hover:bg-zinc-200 text-zinc-400'}`} title={pos}>●</button>
                  ))}
                </div>
              </div>
              {d.bgImageMobile && (
                <div className="mt-3">
                  <span className="text-xs font-medium text-zinc-600 block mb-1.5">Bildposition Mobil (Fokuspunkt)</span>
                  <div className="inline-grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 bg-zinc-100 p-1 rounded-lg">
                    {(['top left','top center','top right','center left','center','center right','bottom left','bottom center','bottom right'] as const).map(pos => (
                      <button key={pos} type="button" onClick={() => setD({ ...d, bgPositionMobile: pos })} className={`w-7 h-7 rounded text-[9px] leading-none transition-colors ${d.bgPositionMobile === pos ? 'bg-blue-500 text-white shadow-sm' : 'hover:bg-zinc-200 text-zinc-400'}`} title={pos}>●</button>
                    ))}
                  </div>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                <label className="block col-span-2">
                  <span className="text-xs font-medium text-zinc-600">Overlay</span>
                  <div className="flex gap-2 mt-1.5">
                    <button type="button" onClick={() => setD({ ...d, overlayOpacity: -1, overlayColor: '#000000' })} className={`px-3 py-1.5 text-xs rounded-md transition-colors ${d.overlayOpacity === -1 ? 'bg-blue-100 text-blue-700 font-medium' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'}`}>Standard</button>
                    <button type="button" onClick={() => setD({ ...d, overlayOpacity: 0.5 })} className={`px-3 py-1.5 text-xs rounded-md transition-colors ${d.overlayOpacity > 0 ? 'bg-blue-100 text-blue-700 font-medium' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'}`}>Eigene Farbe</button>
                    <button type="button" onClick={() => setD({ ...d, overlayOpacity: 0 })} className={`px-3 py-1.5 text-xs rounded-md transition-colors ${d.overlayOpacity === 0 ? 'bg-blue-100 text-blue-700 font-medium' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'}`}>Kein Overlay</button>
                  </div>
                </label>
                {d.overlayOpacity > 0 && (
                  <>
                    <ColorField label="Overlay-Farbe" value={d.overlayColor} onChange={(v) => setD({ ...d, overlayColor: v })} />
                    <label className="block">
                      <span className="text-xs font-medium text-zinc-600">Deckkraft ({Math.round(d.overlayOpacity * 100)}%)</span>
                      <input type="range" min="0.05" max="1" step="0.05" className="w-full mt-2" value={d.overlayOpacity} onChange={(e) => setD({ ...d, overlayOpacity: parseFloat(e.target.value) })} />
                    </label>
                  </>
                )}
              </div>
              </>
            )}
          </>
        ) : (
          <ColorField label="Hintergrundfarbe" value={d.bgColor} onChange={(v) => setD({ ...d, bgColor: v })} />
        )}
      </div>
      <div className="space-y-2">
        <label className="text-xs font-medium text-zinc-600">Trust-Elemente</label>
        {d.trustItems.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input className="admin-input flex-1 text-xs" value={item} onChange={(e) => setD({ ...d, trustItems: d.trustItems.map((t, idx) => idx === i ? e.target.value : t) })} />
            <button onClick={() => setD({ ...d, trustItems: d.trustItems.filter((_, idx) => idx !== i) })} className="text-red-400 hover:text-red-600 text-xs">×</button>
          </div>
        ))}
        <button onClick={() => setD({ ...d, trustItems: [...d.trustItems, ''] })} className="text-xs text-blue-600 hover:underline">+ Trust-Element</button>
        <ColorField label="Strip-Farbe" value={d.trustStripColor} onChange={(v) => setD({ ...d, trustStripColor: v })} allowEmpty />
      </div>
      <ButtonField label="Primärer CTA" value={d.primaryCta} onChange={(v) => setD({ ...d, primaryCta: v })} />
      <ButtonField label="Sekundärer CTA" value={d.secondaryCta} onChange={(v) => setD({ ...d, secondaryCta: v })} />
      <div>
        <label className="text-xs font-medium text-zinc-600 mb-1 block">Bild-Effekt</label>
        <select className="admin-input" value={d.imageEffect} onChange={(e) => setD({ ...d, imageEffect: e.target.value })}>
          <option value="none">Kein Effekt</option>
          <option value="parallax">Parallax</option>
          <option value="kenBurns">Ken Burns (Zoom)</option>
          
          
          
        </select>
        {d.imageEffect !== 'none' && (
          <select className="admin-input mt-2" value={d.imageEffectIntensity} onChange={(e) => setD({ ...d, imageEffectIntensity: e.target.value })}>
            <option value="subtle">Dezent</option>
            <option value="medium">Mittel</option>
            <option value="strong">Stark</option>
          </select>
        )}
      </div>
    </div>
  );
}

// ─── FAQ Editor ──────────────────────────────────────────────────
function FaqEditor({ data, onChange }: EditorProps) {
  const [headline, setHeadline] = useState((data.headline as string) || '');
  const [badgeText, setBadgeText] = useState((data.badgeText as string) || '');
  const [items, setItems] = useState<{ question: string; answer: string }[]>(
    (data.items as { question: string; answer: string }[]) || []
  );
  useReport({ headline, badgeText, items, source: 'manual', layout: 'accordion', expandFirst: true }, onChange);

  function addItem() { setItems([...items, { question: '', answer: '' }]); }
  function removeItem(i: number) { setItems(items.filter((_, idx) => idx !== i)); }
  function updateItem(i: number, field: 'question' | 'answer', val: string) {
    setItems(items.map((item, idx) => idx === i ? { ...item, [field]: val } : item));
  }

  return (
    <div className="space-y-3">
      <Field label={fieldLabel('headline')} value={headline} onChange={setHeadline} help="Optionale Überschrift über dem Statistik-Bereich" />
      {items.map((item, i) => (
        <div key={i} className="border rounded p-3 space-y-2 relative">
          <button onClick={() => removeItem(i)} className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-xs">×</button>
          <Field label={`Frage ${i + 1}`} value={item.question} onChange={(v) => updateItem(i, 'question', v)} />
          <Field label={fieldLabel('answer')} value={item.answer} onChange={(v) => updateItem(i, 'answer', v)} multiline />
        </div>
      ))}
      <button onClick={addItem} className="text-sm text-blue-600 hover:underline">+ Frage hinzufügen</button>
    </div>
  );
}

// ─── CTA Band Editor ────────────────────────────────────────────
function CtaBandEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({
    headline: (data.headline as string) || '',
    subline: (data.subline as string) || '',
    badgeText: (data.badgeText as string) || '',
    ctaPrimary: (data.ctaPrimary as { label: string; href: string }) || { label: '', href: '' },
  });
  useReport(d as unknown as Record<string, unknown>, onChange);

  return (
    <div className="space-y-3">
      <Field label="Badge-Text" value={d.badgeText} onChange={(v) => setD({ ...d, badgeText: v })} />
      <Field label={fieldLabel('headline')} value={d.headline} onChange={(v) => setD({ ...d, headline: v })} />
      <Field label="Untertitel" value={d.subline} onChange={(v) => setD({ ...d, subline: v })} help="Optionaler Beschreibungstext" />
      <ButtonField label="CTA" value={d.ctaPrimary} onChange={(v) => setD({ ...d, ctaPrimary: v })} />
    </div>
  );
}

// ─── Testimonials Editor ────────────────────────────────────────
function TestimonialsEditor({ data, onChange }: EditorProps) {
  const [headline, setHeadline] = useState((data.headline as string) || '');
  const [badgeText, setBadgeText] = useState((data.badgeText as string) || 'Kundenstimmen');
  const [ratingValue, setRatingValue] = useState((data.ratingValue as string) || '');
  const [ratingCount, setRatingCount] = useState((data.ratingCount as string) || '');
  const [items, setItems] = useState<{ quote: string; name: string; context: string; rating: number }[]>(
    (data.items as { quote: string; name: string; context: string; rating: number }[]) || []
  );
  useReport({ headline, badgeText, ratingValue, ratingCount, items, layout: 'cards' }, onChange);

  function addItem() { setItems([...items, { quote: '', name: '', context: '', rating: 5 }]); }
  function removeItem(i: number) { setItems(items.filter((_, idx) => idx !== i)); }

  return (
    <div className="space-y-3">
      <Field label="Badge-Text" value={badgeText} onChange={setBadgeText} />
      <Field label={fieldLabel('headline')} value={headline} onChange={setHeadline}  />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="Bewertungsdurchschnitt (z.B. 4.9)" value={ratingValue} onChange={setRatingValue} />
        <Field label="Anzahl Bewertungen (z.B. 150)" value={ratingCount} onChange={setRatingCount} />
      </div>
      {items.map((item, i) => (
        <div key={i} className="border rounded p-3 space-y-2 relative">
          <button onClick={() => removeItem(i)} className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-xs">×</button>
          <Field label={fieldLabel('quote')} value={item.quote} onChange={(v) => setItems(items.map((it, idx) => idx === i ? { ...it, quote: v } : it))} multiline />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label={fieldLabel('name')} value={item.name} onChange={(v) => setItems(items.map((it, idx) => idx === i ? { ...it, name: v } : it))} />
            <Field label="Kontext" value={item.context} onChange={(v) => setItems(items.map((it, idx) => idx === i ? { ...it, context: v } : it))} />
          </div>
        </div>
      ))}
      <button onClick={addItem} className="text-sm text-blue-600 hover:underline">+ Bewertung hinzufügen</button>
    </div>
  );
}

// ─── Map Editor ──────────────────────────────────────────────────
function MapEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({
    embedUrl: (data.embedUrl as string) || '',
    headline: (data.headline as string) || '',
    height: (data.height as string) || 'm',
  });
  useReport({ ...d, provider: 'embed' }, onChange);

  return (
    <div className="space-y-3">
      <Field label="Headline (optional)" value={d.headline} onChange={(v) => setD({ ...d, headline: v })} />
      <Field label="Google Maps Embed-URL" value={d.embedUrl} onChange={(v) => setD({ ...d, embedUrl: v })} />
      <SelectField label={fieldLabel('height')} value={d.height} options={['s', 'm', 'l']} onChange={(v) => setD({ ...d, height: v })} />
    </div>
  );
}

// ─── Shared field components ─────────────────────────────────────
function Field({ label, value, onChange, multiline, placeholder }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean; placeholder?: string }) {
  if (multiline) {
    return (
      <div>
        <MiniRichTextField label={label} value={value} onChange={onChange} />
        {help && <p className="text-[11px] text-zinc-400 mt-1">{help}</p>}
      </div>
    );
  }
  return (
    <label className="block text-sm">
      <span className="text-gray-600 text-xs">{label}</span>
      <input className="admin-input mt-1 w-full" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
      {help && <p className="text-[11px] text-zinc-400 mt-0.5">{help}</p>}
    </label>
  );
}

function SelectField({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <label className="block text-sm">
      <span className="text-gray-600 text-xs">{label}</span>
      <select className="admin-input mt-1" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}

// ─── CTA Links Editor ────────────────────────────────────────────
function parseColorValue(value: string) {
  const trimmed = value.trim();
  const rgba = trimmed.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([0-9.]+))?\)$/i);
  if (rgba) {
    const toHex = (n: string) => Math.max(0, Math.min(255, Number(n) || 0)).toString(16).padStart(2, '0');
    return { hex: `#${toHex(rgba[1])}${toHex(rgba[2])}${toHex(rgba[3])}`, alpha: Math.max(0, Math.min(1, Number(rgba[4] ?? 1))), format: 'rgba' as const };
  }
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(trimmed)) {
    const hex = trimmed.length === 4 ? `#${trimmed[1]}${trimmed[1]}${trimmed[2]}${trimmed[2]}${trimmed[3]}${trimmed[3]}` : trimmed;
    return { hex, alpha: 1, format: 'hex' as const };
  }
  return { hex: '#000000', alpha: 1, format: 'hex' as const };
}

function hexToRgba(hex: string, alpha: number) {
  const normalized = hex.length === 4 ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}` : hex;
  const r = parseInt(normalized.slice(1, 3), 16);
  const g = parseInt(normalized.slice(3, 5), 16);
  const b = parseInt(normalized.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${Math.round(alpha * 100) / 100})`;
}

function ColorField({ label, value, onChange, allowEmpty = false, alpha = 'auto' }: { label: string; value: string; onChange: (v: string) => void; allowEmpty?: boolean; alpha?: 'auto' | 'never' | 'always' }) {
  const parsed = parseColorValue(value || '#000000');
  const showAlpha = alpha === 'always' || (alpha === 'auto' && parsed.format === 'rgba');
  const updateColor = (hex: string) => onChange(showAlpha ? hexToRgba(hex, parsed.alpha) : hex);
  const updateAlpha = (nextAlpha: number) => onChange(hexToRgba(parsed.hex, nextAlpha));

  return (
    <div className="text-sm">
      <div className="flex items-center justify-between gap-2">
        <span className="text-gray-600 text-xs">{label}</span>
        {allowEmpty && value && <button type="button" onClick={() => onChange('')} className="text-[10px] text-red-500 hover:text-red-600">Entfernen</button>}
      </div>
      <div className="mt-1 flex items-center gap-2">
        <input type="color" className="h-10 w-12 shrink-0 cursor-pointer rounded border border-zinc-200 p-1" value={parsed.hex} onChange={(e) => updateColor(e.target.value)} />
        <div className="admin-input flex min-w-0 flex-1 items-center truncate text-xs text-zinc-500">{value || 'Standard'}</div>
      </div>
      {showAlpha && (
        <label className="mt-2 block">
          <span className="text-[11px] text-zinc-500">Deckkraft ({Math.round(parsed.alpha * 100)}%)</span>
          <input type="range" min="0" max="1" step="0.05" className="mt-1 w-full" value={parsed.alpha} onChange={(e) => updateAlpha(Number(e.target.value))} />
        </label>
      )}
    </div>
  );
}

function CtaLinksEditor({ data, onChange }: EditorProps) {
  const [headline, setHeadline] = useState((data.headline as string) || '');
  const [subline, setSubline] = useState((data.subline as string) || '');
  const [links, setLinks] = useState<{ label: string; href: string; icon: string; description: string }[]>(
    (data.links as { label: string; href: string; icon: string; description: string }[]) || []
  );
  useReport({ headline, subline, links }, onChange);

  function addLink() { setLinks([...links, { label: '', href: '', icon: '', description: '' }]); }
  function removeLink(i: number) { setLinks(links.filter((_, idx) => idx !== i)); }
  function updateLink(i: number, field: string, val: string) {
    setLinks(links.map((l, idx) => idx === i ? { ...l, [field]: val } : l));
  }

  return (
    <div className="space-y-3">
      <Field label={fieldLabel('headline')} value={headline} onChange={setHeadline}  />
      <Field label={fieldLabel('subline')} value={subline} onChange={setSubline}  />
      {links.map((link, i) => (
        <div key={i} className="border rounded p-3 space-y-2 relative">
          <button onClick={() => removeLink(i)} className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-xs">×</button>
          <Field label={fieldLabel('label')} value={link.label} onChange={(v) => updateLink(i, 'label', v)} />
          <DetailLinkField label="Link" value={link.href} onChange={(v) => updateLink(i, 'href', v)} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <IconPickerField label={fieldLabel('icon')} value={link.icon} onChange={(v) => updateLink(i, 'icon', v)} />
            <Field label="Beschreibung" value={link.description} onChange={(v) => updateLink(i, 'description', v)} multiline />
          </div>
        </div>
      ))}
      <button onClick={addLink} className="text-sm text-blue-600 hover:underline">+ Link hinzufügen</button>
    </div>
  );
}

// ─── News Preview Editor ─────────────────────────────────────────
function NewsPreviewEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({
    headline: (data.headline as string) || 'Aktuelles',
    subline: (data.subline as string) || '',
    collectionKey: (data.collectionKey as string) || 'news',
    linkLabel: (data.linkLabel as string) || 'Alle Beiträge',
    linkHref: (data.linkHref as string) || '/news',
  });
  useReport(d, onChange);

  return (
    <div className="space-y-3">
      <Field label={fieldLabel('headline')} value={d.headline} onChange={(v) => setD({ ...d, headline: v })} help="Wird über den News-Karten angezeigt" />
      <Field label="Untertitel" value={d.subline} onChange={(v) => setD({ ...d, subline: v })} help="Optionaler Beschreibungstext unter der Überschrift" />
      <CollectionKeySelect value={d.collectionKey} onChange={(v) => setD({ ...d, collectionKey: v })} />
      <ButtonField label="Alle-Beiträge-Link" value={{ label: d.linkLabel, href: d.linkHref }} onChange={(v) => setD({ ...d, linkLabel: v.label, linkHref: v.href })} />
      <p className="text-xs text-gray-400">Die Beiträge werden automatisch aus der gewählten Collection geladen.</p>
    </div>
  );
}

// ─── Stats Editor ────────────────────────────────────────────────
function StatsEditor({ data, onChange }: EditorProps) {
  const [headline, setHeadline] = useState((data.headline as string) || '');
  const [stats, setStats] = useState<{ value: number; suffix: string; prefix: string; label: string; icon: string }[]>(
    (data.stats as { value: number; suffix: string; prefix: string; label: string; icon: string }[]) || []
  );
  useReport({ headline, stats }, onChange);

  function addStat() { setStats([...stats, { value: 0, suffix: '', prefix: '', label: '', icon: '' }]); }
  function removeStat(i: number) { setStats(stats.filter((_, idx) => idx !== i)); }

  return (
    <div className="space-y-3">
      <Field label={fieldLabel('headline')} value={headline} onChange={setHeadline}  />
      {stats.map((stat, i) => (
        <div key={i} className="border rounded p-3 space-y-2 relative">
          <button onClick={() => removeStat(i)} className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-xs">×</button>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <label className="block text-sm"><span className="text-gray-600 text-xs">Wert</span>
              <input type="number" className="admin-input mt-1 w-full" value={stat.value} onChange={(e) => setStats(stats.map((s, idx) => idx === i ? { ...s, value: Number(e.target.value) } : s))} />
            </label>
            <Field label="Vorzeichen" value={stat.prefix} onChange={(v) => setStats(stats.map((s, idx) => idx === i ? { ...s, prefix: v } : s))} placeholder="z.B. €, >" />
            <Field label="Nachzeichen" value={stat.suffix} onChange={(v) => setStats(stats.map((s, idx) => idx === i ? { ...s, suffix: v } : s))} placeholder="z.B. +, %, Jahre" help="Wird hinter dem Zahlenwert angezeigt" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Beschriftung" value={stat.label} onChange={(v) => setStats(stats.map((s, idx) => idx === i ? { ...s, label: v } : s))} />
            <IconPickerField label={fieldLabel('icon')} value={stat.icon} onChange={(v) => setStats(stats.map((s, idx) => idx === i ? { ...s, icon: v } : s))} />
          </div>
        </div>
      ))}
      <button onClick={addStat} className="text-sm text-blue-600 hover:underline">+ Statistik hinzufügen</button>
    </div>
  );
}

// ─── Logo Cloud Editor ───────────────────────────────────────────
function LogoCloudEditor({ data, onChange }: EditorProps) {
  const [headline, setHeadline] = useState((data.headline as string) || '');
  const [subline, setSubline] = useState((data.subline as string) || '');
  const [logos, setLogos] = useState<{ src: string; alt: string; href: string }[]>(
    (data.logos as { src: string; alt: string; href: string }[]) || []
  );
  useReport({ headline, subline, logos }, onChange);

  function addLogo() { setLogos([...logos, { src: '', alt: '', href: '' }]); }
  function removeLogo(i: number) { setLogos(logos.filter((_, idx) => idx !== i)); }

  return (
    <div className="space-y-3">
      <Field label={fieldLabel('headline')} value={headline} onChange={setHeadline}  />
      <Field label={fieldLabel('subline')} value={subline} onChange={setSubline}  />
      {logos.map((logo, i) => (
        <div key={i} className="border rounded p-3 space-y-2 relative">
          <button onClick={() => removeLogo(i)} className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-xs">×</button>
          <ImageUploadField label={fieldLabel('image')} value={logo.src} onChange={(v) => setLogos(logos.map((l, idx) => idx === i ? { ...l, src: v } : l))} />
          <Field label="Alt-Text" value={logo.alt} onChange={(v) => setLogos(logos.map((l, idx) => idx === i ? { ...l, alt: v } : l))} />
          <DetailLinkField label="Link (optional)" value={logo.href} onChange={(v) => setLogos(logos.map((l, idx) => idx === i ? { ...l, href: v } : l))} />
        </div>
      ))}
      <button onClick={addLogo} className="text-sm text-blue-600 hover:underline">+ Logo hinzufügen</button>
    </div>
  );
}

// ─── Gallery Grid Editor ─────────────────────────────────────────
function GalleryGridEditor({ data, onChange }: EditorProps) {
  const [headline, setHeadline] = useState((data.headline as string) || '');
  const [subline, setSubline] = useState((data.subline as string) || '');
  const [images, setImages] = useState<{ src: string; alt: string; caption: string }[]>(
    (data.images as { src: string; alt: string; caption: string }[]) || []
  );
  const [bulkUploading, setBulkUploading] = useState(false);
  const bulkInputRef = useRef<HTMLInputElement>(null);
  useReport({ headline, subline, images }, onChange);

  function addImage() { setImages([...images, { src: '', alt: '', caption: '' }]); }
  function removeImage(i: number) { setImages(images.filter((_, idx) => idx !== i)); }

  async function handleBulkUpload(files: FileList) {
    setBulkUploading(true);
    const { upload } = await import('@vercel/blob/client');
    const { resizeImage } = await import('@/components/image-upload-field');
    const newImages: { src: string; alt: string; caption: string }[] = [];
    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) continue;
      try {
        const optimized = await resizeImage(file, 1920, 0.85);
        const blob = await upload(file.name.replace(/\.[^.]+$/, '.webp'), optimized, {
          access: 'public',
          handleUploadUrl: '/api/upload',
        });
        newImages.push({ src: blob.url, alt: file.name.replace(/\.[^.]+$/, ''), caption: '' });
        await saveMediaRecord({ blobUrl: blob.url, pathname: blob.pathname, filename: optimized.name, mimeType: optimized.type || 'image/webp', size: optimized.size }).catch(e => console.error('saveMediaRecord failed:', e));
      } catch (e) { console.error('Bulk upload failed for', file.name, e); }
    }
    setImages(prev => [...prev, ...newImages]);
    setBulkUploading(false);
  }

  return (
    <div className="space-y-3">
      <Field label={fieldLabel('headline')} value={headline} onChange={setHeadline}  />
      <Field label={fieldLabel('subline')} value={subline} onChange={setSubline}  />
      {images.map((img, i) => (
        <div key={i} className="border rounded p-3 space-y-2 relative">
          <button onClick={() => removeImage(i)} className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-xs">×</button>
          <ImageUploadField label={fieldLabel('image')} value={img.src} onChange={(v) => setImages(images.map((im, idx) => idx === i ? { ...im, src: v } : im))} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Alt-Text" value={img.alt} onChange={(v) => setImages(images.map((im, idx) => idx === i ? { ...im, alt: v } : im))} />
            <Field label="Bildunterschrift" value={img.caption} onChange={(v) => setImages(images.map((im, idx) => idx === i ? { ...im, caption: v } : im))} />
          </div>
        </div>
      ))}
      <div className="flex items-center gap-3">
        <button onClick={addImage} className="text-sm text-blue-600 hover:underline">+ Bild hinzufügen</button>
        <button onClick={() => bulkInputRef.current?.click()} disabled={bulkUploading} className="text-sm text-blue-600 hover:underline disabled:opacity-50">
          {bulkUploading ? '⏳ Wird hochgeladen...' : '+ Bulk Upload'}
        </button>
        <input ref={bulkInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => e.target.files && handleBulkUpload(e.target.files)} />
        <MediaBulkPickerButton onSelect={(imgs) => setImages(prev => [...prev, ...imgs.map(i => ({ ...i, caption: '' }))])} />
      </div>
    </div>
  );
}

// ─── USP Strip Editor ────────────────────────────────────────────
function UspStripEditor({ data, onChange }: EditorProps) {
  const [items, setItems] = useState<{ icon: string; title: string; text: string }[]>(
    (data.items as { icon: string; title: string; text: string }[]) || []
  );
  useReport({ items }, onChange);

  function addItem() { setItems([...items, { icon: '', title: '', text: '' }]); }
  function removeItem(i: number) { setItems(items.filter((_, idx) => idx !== i)); }
  function update(i: number, field: string, val: string) { setItems(items.map((it, idx) => idx === i ? { ...it, [field]: val } : it)); }

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="border rounded p-3 space-y-2 relative">
          <button onClick={() => removeItem(i)} className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-xs">×</button>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <IconPickerField label={fieldLabel('icon')} value={item.icon} onChange={(v) => update(i, 'icon', v)} />
            <Field label={fieldLabel('title')} value={item.title} onChange={(v) => update(i, 'title', v)} />
            <Field label={fieldLabel('text')} value={item.text} onChange={(v) => update(i, 'text', v)} multiline />
          </div>
        </div>
      ))}
      <button onClick={addItem} className="text-sm text-blue-600 hover:underline">+ USP hinzufügen</button>
    </div>
  );
}

// ─── Services Grid Editor ────────────────────────────────────────
function ServicesGridEditor({ data, onChange }: EditorProps) {
  const [headline, setHeadline] = useState((data.headline as string) || '');
  const [subline, setSubline] = useState((data.subline as string) || '');
  const [badgeText, setBadgeText] = useState((data.badgeText as string) || '');
  const [ctaLabel, setCtaLabel] = useState((data.ctaLabel as string) || '');
  const [ctaHref, setCtaHref] = useState((data.ctaHref as string) || '');
  const [cards, setCards] = useState<{ title: string; text: string; icon: string; image: string; imagePosition: string; mediaType: string; href: string }[]>(
    ((data.manualCards as Record<string, unknown>[]) || []).map(c => ({
      title: (c.title as string) || '',
      text: (c.text as string) || '',
      icon: (c.icon as string) || '',
      image: (c.image as string) || '',
      imagePosition: (c.imagePosition as string) || 'center',
      mediaType: (c.mediaType as string) || 'icon',
      href: (c.href as string) || '',
    }))
  );
  useReport({ headline, subline, badgeText, ctaLabel, ctaHref, manualCards: cards }, onChange);

  function addCard() { setCards([...cards, { title: '', text: '', icon: '', image: '', imagePosition: 'center', mediaType: 'icon', href: '' }]); }
  function removeCard(i: number) { setCards(cards.filter((_, idx) => idx !== i)); }
  function update(i: number, field: string, val: string) { setCards(cards.map((c, idx) => idx === i ? { ...c, [field]: val } : c)); }

  return (
    <div className="space-y-3">
      <Field label={fieldLabel('headline')} value={headline} onChange={setHeadline}  />
      <Field label={fieldLabel('subline')} value={subline} onChange={setSubline}  />
      <Field label="Badge-Text" value={badgeText} onChange={setBadgeText} />
      <ButtonField label="CTA-Button" value={{ label: ctaLabel, href: ctaHref }} onChange={(v) => { setCtaLabel(v.label); setCtaHref(v.href); }} />
      {cards.map((card, i) => (
        <div key={i} className="border rounded p-3 space-y-2 relative">
          <button onClick={() => removeCard(i)} className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-xs">×</button>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label={fieldLabel('title')} value={card.title} onChange={(v) => update(i, 'title', v)} />
            <Field label="Beschreibung" value={card.text} onChange={(v) => update(i, 'text', v)} multiline />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <SelectField label="Medientyp" value={card.mediaType} options={['icon', 'image']} onChange={(v) => update(i, 'mediaType', v)} />
            {card.mediaType === 'icon' ? (
              <IconPickerField label={fieldLabel('icon')} value={card.icon} onChange={(v) => update(i, 'icon', v)} />
            ) : (
              <ImageUploadField label={fieldLabel('image')} value={card.image} onChange={(v) => update(i, 'image', v)} position={card.imagePosition || 'center'} onPositionChange={(v) => update(i, 'imagePosition', v)} />
            )}
          </div>
          <DetailLinkField label="Detail-Link (optional)" value={card.href} onChange={(v) => update(i, 'href', v)} />
        </div>
      ))}
      <button onClick={addCard} className="text-sm text-blue-600 hover:underline">+ Karte hinzufügen</button>
    </div>
  );
}

// ─── Process Steps Editor ────────────────────────────────────────
function ProcessStepsEditor({ data, onChange }: EditorProps) {
  const [headline, setHeadline] = useState((data.headline as string) || '');
  const [badgeText, setBadgeText] = useState((data.badgeText as string) || '');
  const [steps, setSteps] = useState<{ title: string; text: string; icon: string }[]>(
    (data.steps as { title: string; text: string; icon: string }[]) || []
  );
  useReport({ headline, badgeText, steps }, onChange);

  function addStep() { setSteps([...steps, { title: '', text: '', icon: '' }]); }
  function removeStep(i: number) { setSteps(steps.filter((_, idx) => idx !== i)); }
  function update(i: number, field: string, val: string) { setSteps(steps.map((s, idx) => idx === i ? { ...s, [field]: val } : s)); }

  return (
    <div className="space-y-3">
      <Field label={fieldLabel('headline')} value={headline} onChange={setHeadline}  />
      <Field label="Badge-Text" value={badgeText} onChange={setBadgeText} />
      {steps.map((step, i) => (
        <div key={i} className="border rounded p-3 space-y-2 relative">
          <button onClick={() => removeStep(i)} className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-xs">×</button>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <Field label={fieldLabel('title')} value={step.title} onChange={(v) => update(i, 'title', v)} />
            <Field label="Beschreibung" value={step.text} onChange={(v) => update(i, 'text', v)} multiline />
            <IconPickerField label={fieldLabel('icon')} value={step.icon} onChange={(v) => update(i, 'icon', v)} />
          </div>
        </div>
      ))}
      <button onClick={addStep} className="text-sm text-blue-600 hover:underline">+ Schritt hinzufügen</button>
    </div>
  );
}

// ─── Contact Editor ──────────────────────────────────────────────
function ContactEditor({ data, onChange }: EditorProps) {
  const [headline, setHeadline] = useState((data.headline as string) || 'Kontakt');
  const [introText, setIntroText] = useState((data.introText as string) || '');
  const [badgeText, setBadgeText] = useState((data.badgeText as string) || '');
  const [submitLabel, setSubmitLabel] = useState((data.submitLabel as string) || 'Nachricht senden');
  const [formEnabled, setFormEnabled] = useState(data.formEnabled !== false);
  const [infoCards, setInfoCards] = useState<{ icon: string; label: string; value: string }[]>(
    (data.infoCards as { icon: string; label: string; value: string }[]) || []
  );
  useReport({ headline, introText, badgeText, submitLabel, formEnabled, infoCards }, onChange);

  function addCard() { setInfoCards([...infoCards, { icon: '', label: '', value: '' }]); }
  function removeCard(i: number) { setInfoCards(infoCards.filter((_, idx) => idx !== i)); }
  function update(i: number, field: string, val: string) { setInfoCards(infoCards.map((c, idx) => idx === i ? { ...c, [field]: val } : c)); }

  return (
    <div className="space-y-3">
      <Field label={fieldLabel('headline')} value={headline} onChange={setHeadline}  />
      <Field label="Einleitungstext" value={introText} onChange={setIntroText} multiline />
      <Field label="Badge-Text" value={badgeText} onChange={setBadgeText} />
      <Field label="Button-Text" value={submitLabel} onChange={setSubmitLabel} />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={formEnabled} onChange={(e) => setFormEnabled(e.target.checked)} />
        <span className="text-gray-600">Formular anzeigen</span>
      </label>
      <h4 className="text-sm font-medium text-gray-700 pt-2">Info-Karten</h4>
      {infoCards.map((card, i) => (
        <div key={i} className="border rounded p-3 space-y-2 relative">
          <button onClick={() => removeCard(i)} className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-xs">×</button>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <IconPickerField label={fieldLabel('icon')} value={card.icon} onChange={(v) => update(i, 'icon', v)} />
            <Field label={fieldLabel('label')} value={card.label} onChange={(v) => update(i, 'label', v)} />
            <Field label={fieldLabel('value')} value={card.value} onChange={(v) => update(i, 'value', v)} />
          </div>
        </div>
      ))}
      <button onClick={addCard} className="text-sm text-blue-600 hover:underline">+ Info-Karte hinzufügen</button>
    </div>
  );
}

// ─── Service Detail Editor ───────────────────────────────────────
function ServiceDetailEditor({ data, onChange }: EditorProps) {
  const [headline, setHeadline] = useState((data.headline as string) || '');
  const [subline, setSubline] = useState((data.subline as string) || '');
  const [badgeText, setBadgeText] = useState((data.badgeText as string) || '');
  const [items, setItems] = useState<{ title: string; text: string; icon: string; image: string; mediaType: string; features: string; ctaLabel: string; ctaHref: string }[]>(
    ((data.items as Record<string, unknown>[]) || []).map(it => ({
      title: (it.title as string) || '',
      text: (it.text as string) || '',
      icon: (it.icon as string) || '',
      image: (it.image as string) || '',
      mediaType: (it.mediaType as string) || 'icon',
      features: ((it.features as string[]) || []).join('\n'),
      ctaLabel: (it.ctaLabel as string) || '',
      ctaHref: (it.ctaHref as string) || '',
    }))
  );
  useReport({
    headline, subline, badgeText,
    items: items.map(it => ({ ...it, features: it.features.split('\n').map(f => f.trim()).filter(Boolean) })),
  }, onChange);

  function addItem() { setItems([...items, { title: '', text: '', icon: '', image: '', mediaType: 'icon', features: '', ctaLabel: '', ctaHref: '' }]); }
  function removeItem(i: number) { setItems(items.filter((_, idx) => idx !== i)); }
  function update(i: number, field: string, val: string) { setItems(items.map((it, idx) => idx === i ? { ...it, [field]: val } : it)); }

  return (
    <div className="space-y-3">
      <Field label={fieldLabel('headline')} value={headline} onChange={setHeadline}  />
      <Field label={fieldLabel('subline')} value={subline} onChange={setSubline}  />
      <Field label="Badge-Text" value={badgeText} onChange={setBadgeText} />
      {items.map((item, i) => (
        <div key={i} className="border rounded p-3 space-y-2 relative">
          <button onClick={() => removeItem(i)} className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-xs">×</button>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label={fieldLabel('title')} value={item.title} onChange={(v) => update(i, 'title', v)} />
            <Field label="Beschreibung" value={item.text} onChange={(v) => update(i, 'text', v)} multiline />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <SelectField label="Medientyp" value={item.mediaType} options={['icon', 'image']} onChange={(v) => update(i, 'mediaType', v)} />
            {item.mediaType === 'icon' ? (
              <IconPickerField label={fieldLabel('icon')} value={item.icon} onChange={(v) => update(i, 'icon', v)} />
            ) : (
              <ImageUploadField label={fieldLabel('image')} value={item.image} onChange={(v) => update(i, 'image', v)} />
            )}
          </div>
          <Field label="Features (eine pro Zeile)" value={item.features} onChange={(v) => update(i, 'features', v)} multiline />
          <ButtonField label="CTA" value={{ label: item.ctaLabel, href: item.ctaHref }} onChange={(v) => setItems(items.map((it, idx) => idx === i ? { ...it, ctaLabel: v.label, ctaHref: v.href } : it))} />
        </div>
      ))}
      <button onClick={addItem} className="text-sm text-blue-600 hover:underline">+ Leistung hinzufügen</button>
    </div>
  );
}

// ─── Portfolio Editor ────────────────────────────────────────────
function PortfolioEditor({ data, onChange }: EditorProps) {
  const [headline, setHeadline] = useState((data.headline as string) || '');
  const [subline, setSubline] = useState((data.subline as string) || '');
  const [badgeText, setBadgeText] = useState((data.badgeText as string) || '');
  const [ctaLabel, setCtaLabel] = useState((data.ctaLabel as string) || '');
  const [ctaHref, setCtaHref] = useState((data.ctaHref as string) || '');
  const [projects, setProjects] = useState<{ title: string; category: string; description: string; image: string; href: string; stats: { label: string; value: string }[] }[]>(
    ((data.projects as Record<string, unknown>[]) || []).map(p => ({
      title: (p.title as string) || '',
      category: (p.category as string) || '',
      description: (p.description as string) || '',
      image: (p.image as string) || '',
      href: (p.href as string) || '',
      stats: ((p.stats as { label: string; value: string }[]) || []),
    }))
  );
  useReport({ headline, subline, badgeText, ctaLabel, ctaHref, projects }, onChange);

  function addProject() { setProjects([...projects, { title: '', category: '', description: '', image: '', href: '', stats: [] }]); }
  function removeProject(i: number) { setProjects(projects.filter((_, idx) => idx !== i)); }
  function update(i: number, field: string, val: string) { setProjects(projects.map((p, idx) => idx === i ? { ...p, [field]: val } : p)); }

  return (
    <div className="space-y-3">
      <Field label={fieldLabel('headline')} value={headline} onChange={setHeadline}  />
      <Field label={fieldLabel('subline')} value={subline} onChange={setSubline}  />
      <Field label="Badge-Text" value={badgeText} onChange={setBadgeText} />
      <ButtonField label="CTA-Button" value={{ label: ctaLabel, href: ctaHref }} onChange={(v) => { setCtaLabel(v.label); setCtaHref(v.href); }} />
      {projects.map((proj, i) => (
        <div key={i} className="border rounded p-3 space-y-2 relative">
          <button onClick={() => removeProject(i)} className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-xs">×</button>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label={fieldLabel('title')} value={proj.title} onChange={(v) => update(i, 'title', v)} />
            <Field label={fieldLabel('category')} value={proj.category} onChange={(v) => update(i, 'category', v)} />
          </div>
          <Field label="Beschreibung" value={proj.description} onChange={(v) => update(i, 'description', v)} multiline />
          <ImageUploadField label={fieldLabel('image')} value={proj.image} onChange={(v) => update(i, 'image', v)} />
          <DetailLinkField label="Detail-Link (optional)" value={proj.href} onChange={(v) => update(i, 'href', v)} />
          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-600">Statistiken</label>
            {proj.stats.map((s, j) => (
              <div key={j} className="flex gap-2">
                <input className="admin-input flex-1 text-xs" placeholder="Wert" value={s.value} onChange={(e) => {
                  const newStats = [...proj.stats]; newStats[j] = { ...newStats[j], value: e.target.value };
                  setProjects(projects.map((p, idx) => idx === i ? { ...p, stats: newStats } : p));
                }} />
                <input className="admin-input flex-1 text-xs" placeholder="Label" value={s.label} onChange={(e) => {
                  const newStats = [...proj.stats]; newStats[j] = { ...newStats[j], label: e.target.value };
                  setProjects(projects.map((p, idx) => idx === i ? { ...p, stats: newStats } : p));
                }} />
                <button onClick={() => setProjects(projects.map((p, idx) => idx === i ? { ...p, stats: p.stats.filter((_, si) => si !== j) } : p))} className="text-red-400 text-xs">×</button>
              </div>
            ))}
            <button onClick={() => setProjects(projects.map((p, idx) => idx === i ? { ...p, stats: [...p.stats, { value: '', label: '' }] } : p))} className="text-xs text-blue-600 hover:underline">+ Statistik</button>
          </div>
        </div>
      ))}
      <button onClick={addProject} className="text-sm text-blue-600 hover:underline">+ Projekt hinzufügen</button>
    </div>
  );
}

// ─── Team Editor ─────────────────────────────────────────────────
function TeamEditor({ data, onChange }: EditorProps) {
  const [headline, setHeadline] = useState((data.headline as string) || '');
  const [subline, setSubline] = useState((data.subline as string) || '');
  const [badgeText, setBadgeText] = useState((data.badgeText as string) || '');
  const [storyHeadline, setStoryHeadline] = useState((data.storyHeadline as string) || '');
  const [storyText, setStoryText] = useState((data.storyText as string) || '');
  const [storyImage, setStoryImage] = useState((data.storyImage as string) || '');
  const [valuesHeadline, setValuesHeadline] = useState((data.valuesHeadline as string) || 'Unsere Werte');
  const [membersHeadline, setMembersHeadline] = useState((data.membersHeadline as string) || 'Unser Team');
  const [members, setMembers] = useState<{ name: string; role: string; image: string; bio: string }[]>(
    ((data.members as Record<string, unknown>[]) || []).map(m => ({
      name: (m.name as string) || '', role: (m.role as string) || '', image: (m.image as string) || '', bio: (m.bio as string) || '',
    }))
  );
  const [teamStats, setTeamStats] = useState<{ value: string; label: string }[]>(
    ((data.stats as Record<string, unknown>[]) || []).map(s => ({
      value: (s.value as string) || '', label: (s.label as string) || '',
    }))
  );
  const [values, setValues] = useState<{ icon: string; title: string; text: string; image: string; mediaType: string }[]>(
    ((data.values as Record<string, unknown>[]) || []).map(v => ({
      icon: (v.icon as string) || '', title: (v.title as string) || '', text: (v.text as string) || '',
      image: (v.image as string) || '', mediaType: (v.mediaType as string) || 'icon',
    }))
  );
  useReport({ headline, subline, badgeText, storyHeadline, storyText, storyImage, valuesHeadline, membersHeadline, members, stats: teamStats, values }, onChange);

  return (
    <div className="space-y-4">
      <Field label={fieldLabel('headline')} value={headline} onChange={setHeadline}  />
      <Field label={fieldLabel('subline')} value={subline} onChange={setSubline}  />
      <Field label="Badge-Text" value={badgeText} onChange={setBadgeText} />

      <h4 className="text-sm font-medium text-gray-700 pt-2 border-t">Firmengeschichte</h4>
      <Field label="Story-Headline" value={storyHeadline} onChange={setStoryHeadline} />
      <Field label="Story-Text" value={storyText} onChange={setStoryText} multiline />
      <ImageUploadField label="Story-Bild" value={storyImage} onChange={setStoryImage} />

      <h4 className="text-sm font-medium text-gray-700 pt-2 border-t">Statistiken</h4>
      {teamStats.map((s, i) => (
        <div key={i} className="flex gap-3 items-end">
          <Field label={fieldLabel('value')} value={s.value} onChange={(v) => setTeamStats(teamStats.map((st, idx) => idx === i ? { ...st, value: v } : st))} />
          <Field label={fieldLabel('label')} value={s.label} onChange={(v) => setTeamStats(teamStats.map((st, idx) => idx === i ? { ...st, label: v } : st))} />
          <button onClick={() => setTeamStats(teamStats.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-600 text-xs pb-2">×</button>
        </div>
      ))}
      <button onClick={() => setTeamStats([...teamStats, { value: '', label: '' }])} className="text-sm text-blue-600 hover:underline">+ Statistik</button>

      <h4 className="text-sm font-medium text-gray-700 pt-2 border-t">Werte</h4>
      <Field label="Werte-Überschrift" value={valuesHeadline} onChange={setValuesHeadline} />
      {values.map((v, i) => (
        <div key={i} className="border rounded p-3 space-y-2 relative">
          <button onClick={() => setValues(values.filter((_, idx) => idx !== i))} className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-xs">×</button>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label={fieldLabel('title')} value={v.title} onChange={(val) => setValues(values.map((vl, idx) => idx === i ? { ...vl, title: val } : vl))} />
            <Field label={fieldLabel('text')} value={v.text} onChange={(val) => setValues(values.map((vl, idx) => idx === i ? { ...vl, text: val } : vl))} multiline />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <SelectField label="Medientyp" value={v.mediaType} options={['icon', 'image']} onChange={(val) => setValues(values.map((vl, idx) => idx === i ? { ...vl, mediaType: val } : vl))} />
            {v.mediaType === 'icon' ? (
              <IconPickerField label={fieldLabel('icon')} value={v.icon} onChange={(val) => setValues(values.map((vl, idx) => idx === i ? { ...vl, icon: val } : vl))} />
            ) : (
              <ImageUploadField label={fieldLabel('image')} value={v.image} onChange={(val) => setValues(values.map((vl, idx) => idx === i ? { ...vl, image: val } : vl))} />
            )}
          </div>
        </div>
      ))}
      <button onClick={() => setValues([...values, { icon: '', title: '', text: '', image: '', mediaType: 'icon' }])} className="text-sm text-blue-600 hover:underline">+ Wert</button>

      <h4 className="text-sm font-medium text-gray-700 pt-2 border-t">Team-Mitglieder</h4>
      <Field label="Team-Überschrift" value={membersHeadline} onChange={setMembersHeadline} />
      {members.map((m, i) => (
        <div key={i} className="border rounded p-3 space-y-2 relative">
          <button onClick={() => setMembers(members.filter((_, idx) => idx !== i))} className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-xs">×</button>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label={fieldLabel('name')} value={m.name} onChange={(v) => setMembers(members.map((mem, idx) => idx === i ? { ...mem, name: v } : mem))} />
            <Field label={fieldLabel('role')} value={m.role} onChange={(v) => setMembers(members.map((mem, idx) => idx === i ? { ...mem, role: v } : mem))} />
          </div>
          <ImageUploadField label={fieldLabel('image')} value={m.image} onChange={(v) => setMembers(members.map((mem, idx) => idx === i ? { ...mem, image: v } : mem))} />
          <Field label={fieldLabel('bio')} value={m.bio} onChange={(v) => setMembers(members.map((mem, idx) => idx === i ? { ...mem, bio: v } : mem))} multiline />
        </div>
      ))}
      <button onClick={() => setMembers([...members, { name: '', role: '', image: '', bio: '' }])} className="text-sm text-blue-600 hover:underline">+ Mitglied</button>
    </div>
  );
}

// ─── Rich Text Editor ────────────────────────────────────────────
function RichTextEditor({ data, onChange }: EditorProps) {
  const [headline, setHeadline] = useState((data.headline as string) || '');
  const [content, setContent] = useState((data.content as string) || '');
  useReport({ headline, content }, onChange);

  return (
    <div className="space-y-3">
      <Field label="Headline (optional)" value={headline} onChange={setHeadline} />
      <RichTextEditorField label={fieldLabel('content')} value={content} onChange={setContent} />
    </div>
  );
}

function FreeTextEditor({ data, onChange }: EditorProps) {
  const [headline, setHeadline] = useState((data.headline as string) || '');
  const [content, setContent] = useState((data.content as string) || '');
  useReport({ headline, content }, onChange);

  return (
    <div className="space-y-3">
      <Field label="Headline (optional)" value={headline} onChange={setHeadline} />
      <RichTextEditorField label={fieldLabel('content')} value={content} onChange={setContent} />
    </div>
  );
}

// ─── Video Embed Editor ──────────────────────────────────────────
function VideoEmbedEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({
    badge: (data.badge as string) || '',
    headline: (data.headline as string) || '',
    text: (data.text as string) || '',
    videoUrl: (data.videoUrl as string) || '',
  });
  useReport(d as unknown as Record<string, unknown>, onChange);

  return (
    <div className="space-y-3">
      <Field label="Eyebrow / Badge" value={d.badge} onChange={(v) => setD({ ...d, badge: v })} />
      <Field label={fieldLabel('title')} value={d.headline} onChange={(v) => setD({ ...d, headline: v })} />
      <Field label={fieldLabel('text')} value={d.text} onChange={(v) => setD({ ...d, text: v })} multiline />
      <Field label="Video-URL (YouTube / Vimeo)" value={d.videoUrl} onChange={(v) => setD({ ...d, videoUrl: v })} />
      {d.videoUrl && <p className="text-[11px] text-zinc-400">Unterstützt: YouTube, Vimeo – einfach den normalen Link einfügen.</p>}
    </div>
  );
}

// ─── Embed Editor ────────────────────────────────────────────────
function EmbedEditor({ data, onChange }: EditorProps) {
  const [mode, setMode] = useState<'standard' | 'preset'>((data.mode as string) === 'standard' ? 'standard' : 'preset');
  const [provider, setProvider] = useState((data.provider as string) || '');
  const [config, setConfig] = useState<Record<string, string>>((data.config as Record<string, string>) || {});
  const [embedCode, setEmbedCode] = useState((data.embedCode as string) || '');
  const [headline, setHeadline] = useState((data.headline as string) || '');
  const [subline, setSubline] = useState((data.subline as string) || '');
  const [height, setHeight] = useState((data.height as number) || 0);
  const [maxWidth, setMaxWidth] = useState((data.maxWidth as string) || '100%');

  const currentProvider = getProvider(provider);

  useReport({
    mode, provider: mode === 'preset' ? provider : '', config: mode === 'preset' ? config : {},
    embedCode: mode === 'standard' ? embedCode : '', headline, subline,
    height: height || (currentProvider?.defaultHeight ?? 500), maxWidth,
  } as unknown as Record<string, unknown>, onChange);

  return (
    <div className="space-y-4">
      <Field label="Überschrift (optional)" value={headline} onChange={setHeadline} />
      <Field label="Beschreibung (optional)" value={subline} onChange={setSubline} multiline />

      {/* Mode Switch */}
      <div>
        <span className="text-xs font-medium text-zinc-600 block mb-1.5">Modus</span>
        <div className="flex gap-2">
          <button type="button" onClick={() => setMode('preset')} className={`px-3 py-1.5 text-xs rounded-md transition-colors ${mode === 'preset' ? 'bg-blue-100 text-blue-700 font-medium' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'}`}>Anbieter-Preset</button>
          <button type="button" onClick={() => setMode('standard')} className={`px-3 py-1.5 text-xs rounded-md transition-colors ${mode === 'standard' ? 'bg-blue-100 text-blue-700 font-medium' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'}`}>Standard (Embed-Code)</button>
        </div>
      </div>

      {mode === 'standard' && (
        <div>
          <label className="block text-sm">
            <span className="text-gray-600 text-xs">Embed-Code (iframe)</span>
            <textarea className="admin-input mt-1 w-full font-mono text-xs" rows={5} value={embedCode} onChange={(e) => setEmbedCode(e.target.value)} placeholder='<iframe src="https://..." width="100%" height="400"></iframe>' />
          </label>
          <p className="text-[11px] text-amber-600 mt-1 flex items-center gap-1"><Info size={11} /> Nur &lt;iframe&gt; Tags werden akzeptiert. Scripts werden aus Sicherheitsgründen entfernt.</p>
        </div>
      )}

      {mode === 'preset' && (
        <>
          {/* Provider Select grouped by category */}
          <div>
            <span className="text-xs font-medium text-zinc-600 block mb-1.5">Anbieter</span>
            <select className="admin-input w-full" value={provider} onChange={(e) => { setProvider(e.target.value); setConfig({}); }}>
              <option value="">— Anbieter wählen —</option>
              {EMBED_CATEGORIES.map(cat => (
                <optgroup key={cat.id} label={cat.label}>
                  {EMBED_PROVIDERS.filter(p => p.category === cat.id).map(p => (
                    <option key={p.id} value={p.id}>{p.label}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {/* Provider-specific fields */}
          {currentProvider && (
            <div className="border border-zinc-200 rounded-lg p-3 space-y-3 bg-zinc-50/50">
              <p className="text-xs font-medium text-zinc-700">{currentProvider.label} — Konfiguration</p>
              {currentProvider.fields.map(field => (
                <div key={field.key}>
                  <label className="block text-sm">
                    <span className="text-gray-600 text-xs">{field.label}{field.required && <span className="text-red-400"> *</span>}</span>
                    <input className="admin-input mt-1 w-full" value={config[field.key] || ''} onChange={(e) => setConfig({ ...config, [field.key]: e.target.value })} placeholder={field.placeholder} />
                  </label>
                  <p className="text-[11px] text-zinc-400 mt-0.5 flex items-center gap-1"><Info size={10} /> {field.help}</p>
                </div>
              ))}
              {/* Preview URL */}
              {currentProvider.buildUrl(config) && (
                <p className="text-[11px] text-emerald-600 mt-1 truncate">✓ URL: {currentProvider.buildUrl(config)}</p>
              )}
            </div>
          )}
        </>
      )}

      {/* Layout options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="block text-sm">
          <span className="text-gray-600 text-xs">Höhe (px)</span>
          <input type="number" className="admin-input mt-1 w-full" value={height || currentProvider?.defaultHeight || 500} onChange={(e) => setHeight(Number(e.target.value))} />
        </label>
        <label className="block text-sm">
          <span className="text-gray-600 text-xs">Max-Breite</span>
          <input className="admin-input mt-1 w-full" value={maxWidth} onChange={(e) => setMaxWidth(e.target.value)} placeholder="100%" />
        </label>
      </div>
    </div>
  );
}

// ─── Header Banner Editor ────────────────────────────────────────
function HeaderBannerEditor({ data, onChange }: EditorProps) {
  const [items, setItems] = useState<{ text: string; link: string }[]>(
    (data.items as { text: string; link?: string }[])?.map(i => ({ text: i.text, link: i.link || '' })) || []
  );
  const [style, setStyle] = useState((data.style as string) || 'neutral');
  useReport({ items: items.filter(i => i.text.trim()).map(i => ({ text: i.text, ...(i.link.trim() ? { link: i.link } : {}) })), style }, onChange);

  return (
    <div className="space-y-3">
      <SelectField label={fieldLabel('style')} value={style} options={['neutral', 'info', 'warning']} onChange={setStyle} />
      <label className="text-xs font-medium text-zinc-600">Einträge</label>
      {items.map((item, i) => (
        <div key={i} className="flex gap-2 items-start">
          <div className="flex-1 space-y-1">
            <input className="admin-input text-xs w-full" value={item.text} onChange={e => setItems(items.map((t, idx) => idx === i ? { ...t, text: e.target.value } : t))} placeholder="Text" />
            <input className="admin-input text-xs w-full" value={item.link} onChange={e => setItems(items.map((t, idx) => idx === i ? { ...t, link: e.target.value } : t))} placeholder="Link (optional)" />
          </div>
          <button onClick={() => setItems(items.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-600 text-xs mt-1">×</button>
        </div>
      ))}
      <button onClick={() => setItems([...items, { text: '', link: '' }])} className="text-xs text-blue-600 hover:underline">+ Eintrag</button>
    </div>
  );
}

// ─── Notice Banner Editor ──────────────────────────────────────
function NoticeBannerEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({
    headline: (data.headline as string) || '',
    subline: (data.subline as string) || '',
    text: (data.text as string) || '',

    primaryCta: (data.primaryCta as { label: string; href: string; icon?: string }) || { label: '', href: '' },
    secondaryCta: (data.secondaryCta as { label: string; href: string; icon?: string }) || { label: '', href: '' },
  });
  useReport(d as unknown as Record<string, unknown>, onChange);

  return (
    <div className="space-y-3">
      <Field label={fieldLabel('title')} value={d.headline} onChange={(v) => setD({ ...d, headline: v })} />
      <Field label="Untertitel" value={d.subline} onChange={(v) => setD({ ...d, subline: v })} />
      <Field label="Fließtext (HTML)" value={d.text} onChange={(v) => setD({ ...d, text: v })} />

      <ButtonField label="Button 1 (optional)" value={d.primaryCta} onChange={(v) => setD({ ...d, primaryCta: v })} />
      <ButtonField label="Button 2 (optional)" value={d.secondaryCta} onChange={(v) => setD({ ...d, secondaryCta: v })} />
    </div>
  );
}

// ─── Collection Hero Editor ──────────────────────────────────────
function CollectionHeroEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({
    headline: (data.headline as string) || '',
    subline: (data.subline as string) || '',
    bgImage: (data.bgImage as string) || '',
    bgPosition: (data.bgPosition as string) || 'center',
    category: (data.category as string) || '',
    date: (data.date as string) || '',
    overlayColor: (data.overlayColor as string) || '#000000',
    overlayOpacity: (data.overlayOpacity as number) ?? -1,
    imageEffect: (data.imageEffect as string) || 'none',
    imageEffectIntensity: (data.imageEffectIntensity as string) || 'medium',
  });
  useReport(d as unknown as Record<string, unknown>, onChange);

  return (
    <div className="space-y-3">
      <Field label={fieldLabel('headline')} value={d.headline} onChange={(v) => setD({ ...d, headline: v })} />
      <Field label={fieldLabel('subline')} value={d.subline} onChange={(v) => setD({ ...d, subline: v })} multiline />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="Kategorie (optional)" value={d.category} onChange={(v) => setD({ ...d, category: v })} />
        <Field label="Datum (optional)" value={d.date} onChange={(v) => setD({ ...d, date: v })} />
      </div>
      <ImageUploadField label="Hintergrundbild" value={d.bgImage} onChange={(v) => setD({ ...d, bgImage: v })} />
      {d.bgImage && (
        <>
          <span className="text-xs font-medium text-zinc-600 block mb-1.5">Bildposition (Fokuspunkt)</span>
          <div className="inline-grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 bg-zinc-100 p-1 rounded-lg">
            {(['top left','top center','top right','center left','center','center right','bottom left','bottom center','bottom right'] as const).map(pos => (
              <button key={pos} type="button" onClick={() => setD({ ...d, bgPosition: pos })} className={`w-7 h-7 rounded text-[9px] leading-none transition-colors ${d.bgPosition === pos ? 'bg-blue-500 text-white shadow-sm' : 'hover:bg-zinc-200 text-zinc-400'}`} title={pos}>●</button>
            ))}
          </div>
          <label className="block col-span-2">
            <span className="text-xs font-medium text-zinc-600">Overlay</span>
            <div className="flex gap-2 mt-1.5">
              <button type="button" onClick={() => setD({ ...d, overlayOpacity: -1, overlayColor: '#000000' })} className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${d.overlayOpacity === -1 ? 'bg-blue-500 text-white' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'}`}>Standard</button>
              <button type="button" onClick={() => setD({ ...d, overlayOpacity: 0.5 })} className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${d.overlayOpacity > 0 ? 'bg-blue-500 text-white' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'}`}>Eigene Farbe</button>
              <button type="button" onClick={() => setD({ ...d, overlayOpacity: 0 })} className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${d.overlayOpacity === 0 ? 'bg-blue-500 text-white' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'}`}>Kein Overlay</button>
            </div>
          </label>
          {d.overlayOpacity > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
              <ColorField label="Overlay-Farbe" value={d.overlayColor} onChange={(v) => setD({ ...d, overlayColor: v })} />
              <label className="block">
                <span className="text-xs font-medium text-zinc-600">Deckkraft ({Math.round(d.overlayOpacity * 100)}%)</span>
                <input type="range" min="0.05" max="1" step="0.05" className="w-full mt-2" value={d.overlayOpacity} onChange={(e) => setD({ ...d, overlayOpacity: parseFloat(e.target.value) })} />
              </label>
            </div>
          )}
        </>
      )}
      <p className="text-xs text-gray-400">Variante &quot;minimal&quot; in den erweiterten Einstellungen für reinen Text-Hero ohne Bild.</p>
      <div>
        <label className="text-xs font-medium text-zinc-600 mb-1 block">Bild-Effekt</label>
        <select className="admin-input" value={d.imageEffect} onChange={(e) => setD({ ...d, imageEffect: e.target.value })}>
          <option value="none">Kein Effekt</option>
          <option value="parallax">Parallax</option>
          <option value="kenBurns">Ken Burns (Zoom)</option>
          
          
          
        </select>
        {d.imageEffect !== 'none' && (
          <select className="admin-input mt-2" value={d.imageEffectIntensity} onChange={(e) => setD({ ...d, imageEffectIntensity: e.target.value })}>
            <option value="subtle">Dezent</option>
            <option value="medium">Mittel</option>
            <option value="strong">Stark</option>
          </select>
        )}
      </div>
    </div>
  );
}

// ─── TextImage Editor ────────────────────────────────────────────
function TextImageEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({
    badge: (data.badge as string) || '',
    headline: (data.headline as string) || '',
    text: (data.text as string) || '',
    image: (data.image as string) || '',
    imageAlt: (data.imageAlt as string) || '',
    imagePosition: (data.imagePosition as string) || (data.layout as string) || 'right',
    primaryCta: (data.primaryCta as { label: string; href: string; icon?: string }) || { label: '', href: '' },
    secondaryCta: (data.secondaryCta as { label: string; href: string; icon?: string }) || { label: '', href: '' },
  });
  const [items, setItems] = useState<{ icon: string; title: string; text: string }[]>(
    (data.items as { icon: string; title: string; text: string }[]) || []
  );
  useReport({ ...d, items } as unknown as Record<string, unknown>, onChange);

  return (
    <div className="space-y-3">
      <Field label={fieldLabel('badge')} value={d.badge} onChange={(v) => setD({ ...d, badge: v })} />
      <Field label={fieldLabel('headline')} value={d.headline} onChange={(v) => setD({ ...d, headline: v })} />
      <Field label={fieldLabel('text')} value={d.text} onChange={(v) => setD({ ...d, text: v })} multiline />
      <ImageUploadField label={fieldLabel('image')} value={d.image} onChange={(v) => setD({ ...d, image: v })} />
      <Field label="Bild Alt-Text" value={d.imageAlt} onChange={(v) => setD({ ...d, imageAlt: v })} />
      <SelectField label="Bild-Position" value={d.imagePosition} options={['left', 'right']} onChange={(v) => setD({ ...d, imagePosition: v })} />
      <div>
        <p className="text-xs font-medium text-zinc-600 mb-2">Auflistung (optional)</p>
        {items.map((item, i) => (
          <div key={i} className="relative border border-zinc-200 rounded-lg p-3 mb-2">
            <button onClick={() => setItems(items.filter((_, idx) => idx !== i))} className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-xs">×</button>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Field label={fieldLabel('title')} value={item.title} onChange={(v) => setItems(items.map((it, idx) => idx === i ? { ...it, title: v } : it))} />
              <IconPickerField label={fieldLabel('icon')} value={item.icon} onChange={(v) => setItems(items.map((it, idx) => idx === i ? { ...it, icon: v } : it))} />
            </div>
            <Field label={fieldLabel('text')} value={item.text} onChange={(v) => setItems(items.map((it, idx) => idx === i ? { ...it, text: v } : it))} multiline />
          </div>
        ))}
        <button onClick={() => setItems([...items, { icon: '', title: '', text: '' }])} className="text-xs text-blue-600 hover:underline">+ Punkt hinzufügen</button>
      </div>
      <ButtonField label="Primärer Button (optional)" value={d.primaryCta} onChange={(v) => setD({ ...d, primaryCta: v })} />
      <ButtonField label="Sekundärer Button (optional)" value={d.secondaryCta} onChange={(v) => setD({ ...d, secondaryCta: v })} />
    </div>
  );
}

// ─── PortfolioGallery Editor ─────────────────────────────────────
function PortfolioGalleryEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({
    badge: (data.badge as string) || '',
    headline: (data.headline as string) || '',
    subline: (data.subline as string) || '',
  });
  const [cta, setCta] = useState<{ label: string; href: string; icon?: string }>((data.cta as { label: string; href: string; icon?: string }) || { label: '', href: '' });
  const [categories, setCategories] = useState<string[]>((data.categories as string[]) || []);
  const [newCat, setNewCat] = useState('');
  const [images, setImages] = useState<{ src: string; alt: string; category: string; location: string }[]>(
    ((data.images as unknown[]) || []).map((img: unknown) => {
      const i = img as Record<string, string>;
      return { src: i.src || '', alt: i.alt || '', category: i.category || '', location: i.location || '' };
    })
  );
  const [openCats, setOpenCats] = useState<Record<string, boolean>>({});
  const [bulkUploading, setBulkUploading] = useState<string | null>(null);
  const bulkRefs = useRef<Record<string, HTMLInputElement | null>>({});
  useReport({ ...d, categories, images, cta: cta.label ? cta : undefined } as unknown as Record<string, unknown>, onChange);

  function addCategory() {
    const name = newCat.trim();
    if (!name || categories.includes(name)) return;
    setCategories([...categories, name]);
    setOpenCats({ ...openCats, [name]: true });
    setNewCat('');
  }
  function removeCategory(cat: string) {
    setCategories(categories.filter(c => c !== cat));
    setImages(images.filter(img => img.category !== cat));
  }
  function toggleCat(cat: string) { setOpenCats({ ...openCats, [cat]: !openCats[cat] }); }

  async function handleBulkUpload(files: FileList, category: string) {
    setBulkUploading(category);
    const { upload } = await import('@vercel/blob/client');
    const { resizeImage } = await import('@/components/image-upload-field');
    const newImages: { src: string; alt: string; category: string; location: string }[] = [];
    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) continue;
      try {
        const optimized = await resizeImage(file, 1920, 0.85);
        const blob = await upload(file.name.replace(/\.[^.]+$/, '.webp'), optimized, { access: 'public', handleUploadUrl: '/api/upload' });
        newImages.push({ src: blob.url, alt: file.name.replace(/\.[^.]+$/, ''), category, location: '' });
        await saveMediaRecord({ blobUrl: blob.url, pathname: blob.pathname, filename: optimized.name, mimeType: optimized.type || 'image/webp', size: optimized.size }).catch(e => console.error('saveMediaRecord failed:', e));
      } catch (e) { console.error('Bulk upload failed for', file.name, e); }
    }
    setImages(prev => [...prev, ...newImages]);
    setBulkUploading(null);
  }

  const uncategorized = images.filter(img => !img.category || !categories.includes(img.category));

  return (
    <div className="space-y-3">
      <Field label={fieldLabel('badge')} value={d.badge} onChange={(v) => setD({ ...d, badge: v })} />
      <Field label={fieldLabel('headline')} value={d.headline} onChange={(v) => setD({ ...d, headline: v })} />
      <Field label={fieldLabel('subline')} value={d.subline} onChange={(v) => setD({ ...d, subline: v })} />

      {/* Category management */}
      <div>
        <p className="text-xs font-medium text-zinc-600 mb-2">Kategorien</p>
        <div className="flex items-center gap-2 mb-2">
          <input className="admin-input flex-1" placeholder="Neue Kategorie…" value={newCat} onChange={(e) => setNewCat(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCategory())} />
          <button onClick={addCategory} className="px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 whitespace-nowrap">+ Hinzufügen</button>
        </div>
        {categories.length === 0 && <p className="text-xs text-zinc-400">Noch keine Kategorien angelegt.</p>}
      </div>

      {/* Category accordions */}
      {categories.map(cat => {
        const catImages = images.filter(img => img.category === cat);
        const isOpen = openCats[cat];
        return (
          <div key={cat} className="border border-zinc-200 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 bg-zinc-50 cursor-pointer" onClick={() => toggleCat(cat)}>
              <span className="text-sm font-medium text-zinc-700">{cat} <span className="text-zinc-400 font-normal">({catImages.length})</span></span>
              <div className="flex items-center gap-2">
                <button onClick={(e) => { e.stopPropagation(); removeCategory(cat); }} className="text-xs text-red-400 hover:text-red-600">Entfernen</button>
                <span className="text-zinc-400 text-xs">{isOpen ? '▲' : '▼'}</span>
              </div>
            </div>
            {isOpen && (
              <div className="p-3 space-y-2">
                {catImages.map((img) => {
                  const i = images.indexOf(img);
                  return (
                    <div key={i} className="relative border border-zinc-100 rounded p-3">
                      <button onClick={() => setImages(images.filter((_, idx) => idx !== i))} className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-xs">×</button>
                      <ImageUploadField label={fieldLabel('image')} value={img.src} onChange={(v) => setImages(images.map((im, idx) => idx === i ? { ...im, src: v } : im))} />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                        <Field label="Alt-Text" value={img.alt} onChange={(v) => setImages(images.map((im, idx) => idx === i ? { ...im, alt: v } : im))} />
                        <Field label="Ort" value={img.location} onChange={(v) => setImages(images.map((im, idx) => idx === i ? { ...im, location: v } : im))} />
                      </div>
                    </div>
                  );
                })}
                <div className="flex items-center gap-3 pt-1">
                  <button onClick={() => setImages([...images, { src: '', alt: '', category: cat, location: '' }])} className="text-xs text-blue-600 hover:underline">+ Bild</button>
                  <button onClick={() => bulkRefs.current[cat]?.click()} disabled={bulkUploading === cat} className="text-xs text-blue-600 hover:underline disabled:opacity-50">
                    {bulkUploading === cat ? '⏳ Hochladen...' : '+ Bulk Upload'}
                  </button>
                  <input ref={(el) => { bulkRefs.current[cat] = el; }} type="file" accept="image/*" multiple className="hidden" onChange={(e) => e.target.files && handleBulkUpload(e.target.files, cat)} />
                  <MediaBulkPickerButton onSelect={(imgs) => setImages(prev => [...prev, ...imgs.map(i => ({ src: i.src, alt: i.alt, category: cat, location: '' }))])} />
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Uncategorized images */}
      {uncategorized.length > 0 && (
        <div className="border border-amber-200 rounded-lg p-3">
          <p className="text-xs font-medium text-amber-700 mb-2">Ohne Kategorie ({uncategorized.length})</p>
          {uncategorized.map((img) => {
            const i = images.indexOf(img);
            return (
              <div key={i} className="relative border border-zinc-100 rounded p-3 mb-2">
                <button onClick={() => setImages(images.filter((_, idx) => idx !== i))} className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-xs">×</button>
                <ImageUploadField label={fieldLabel('image')} value={img.src} onChange={(v) => setImages(images.map((im, idx) => idx === i ? { ...im, src: v } : im))} />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
                  <Field label="Alt-Text" value={img.alt} onChange={(v) => setImages(images.map((im, idx) => idx === i ? { ...im, alt: v } : im))} />
                  <label className="block"><span className="text-gray-600 text-xs">Kategorie</span><select className="admin-input mt-1 w-full" value={img.category} onChange={(e) => setImages(images.map((im, idx) => idx === i ? { ...im, category: e.target.value } : im))}><option value="">—</option>{categories.map(c => <option key={c} value={c}>{c}</option>)}</select></label>
                  <Field label="Ort" value={img.location} onChange={(v) => setImages(images.map((im, idx) => idx === i ? { ...im, location: v } : im))} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="pt-2 border-t border-zinc-200">
        <p className="text-xs font-medium text-zinc-600 mb-2">Button unterhalb der Galerie (optional)</p>
        <ButtonField label="CTA Button" value={cta} onChange={setCta} />
      </div>
    </div>
  );
}

// ─── PhotographerAbout Editor ────────────────────────────────────
function PhotographerAboutEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({
    badge: (data.badge as string) || '',
    headline: (data.headline as string) || '',
    intro: (data.intro as string) || '',
    story: (data.story as string) || '',
    image: (data.image as string) || '',
    ctaLabel: (data.ctaLabel as string) || '',
    ctaHref: (data.ctaHref as string) || '',
  });
  const [facts, setFacts] = useState<string[]>((data.facts as string[]) || []);
  const [values, setValues] = useState<{ title: string; text: string }[]>(
    ((data.values as unknown[]) || []).map((v: unknown) => {
      const val = v as Record<string, string>;
      return { title: val.title || '', text: val.text || '' };
    })
  );
  useReport({ ...d, facts, values } as unknown as Record<string, unknown>, onChange);

  return (
    <div className="space-y-3">
      <Field label={fieldLabel('badge')} value={d.badge} onChange={(v) => setD({ ...d, badge: v })} />
      <Field label={fieldLabel('headline')} value={d.headline} onChange={(v) => setD({ ...d, headline: v })} />
      <Field label={fieldLabel('intro')} value={d.intro} onChange={(v) => setD({ ...d, intro: v })} multiline />
      <Field label={fieldLabel('story')} value={d.story} onChange={(v) => setD({ ...d, story: v })} multiline />
      <ImageUploadField label={fieldLabel('image')} value={d.image} onChange={(v) => setD({ ...d, image: v })} />
      <ButtonField label="CTA" value={{ label: d.ctaLabel, href: d.ctaHref }} onChange={(v) => setD({ ...d, ctaLabel: v.label, ctaHref: v.href })} />
      <div>
        <p className="text-xs font-medium text-zinc-600 mb-2">Fakten</p>
        {facts.map((f, i) => (
          <div key={i} className="flex gap-2 mb-1">
            <input className="admin-input flex-1" value={f} onChange={(e) => setFacts(facts.map((x, idx) => idx === i ? e.target.value : x))} />
            <button onClick={() => setFacts(facts.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-600 text-xs">×</button>
          </div>
        ))}
        <button onClick={() => setFacts([...facts, ''])} className="text-xs text-blue-600 hover:underline">+ Fakt hinzufügen</button>
      </div>
      <div>
        <p className="text-xs font-medium text-zinc-600 mb-2">Werte</p>
        {values.map((v, i) => (
          <div key={i} className="relative border border-zinc-200 rounded-lg p-3 mb-2">
            <button onClick={() => setValues(values.filter((_, idx) => idx !== i))} className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-xs">×</button>
            <Field label={fieldLabel('title')} value={v.title} onChange={(val) => setValues(values.map((x, idx) => idx === i ? { ...x, title: val } : x))} />
            <Field label={fieldLabel('text')} value={v.text} onChange={(val) => setValues(values.map((x, idx) => idx === i ? { ...x, text: val } : x))} multiline />
          </div>
        ))}
        <button onClick={() => setValues([...values, { title: '', text: '' }])} className="text-xs text-blue-600 hover:underline">+ Wert hinzufügen</button>
      </div>
    </div>
  );
}

// ─── ShootingProcess Editor ──────────────────────────────────────
function ShootingProcessEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({
    badge: (data.badge as string) || '',
    headline: (data.headline as string) || '',
    subline: (data.subline as string) || '',
  });
  const [steps, setSteps] = useState<{ title: string; text: string; icon: string }[]>(
    ((data.steps as unknown[]) || []).map((s: unknown) => {
      const step = s as Record<string, string>;
      return { title: step.title || '', text: step.text || '', icon: step.icon || '' };
    })
  );
  useReport({ ...d, steps } as unknown as Record<string, unknown>, onChange);

  return (
    <div className="space-y-3">
      <Field label={fieldLabel('badge')} value={d.badge} onChange={(v) => setD({ ...d, badge: v })} />
      <Field label={fieldLabel('headline')} value={d.headline} onChange={(v) => setD({ ...d, headline: v })} />
      <Field label={fieldLabel('subline')} value={d.subline} onChange={(v) => setD({ ...d, subline: v })} />
      <div>
        <p className="text-xs font-medium text-zinc-600 mb-2">Schritte</p>
        {steps.map((step, i) => (
          <div key={i} className="relative border border-zinc-200 rounded-lg p-3 mb-2">
            <button onClick={() => setSteps(steps.filter((_, idx) => idx !== i))} className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-xs">×</button>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Field label={fieldLabel('title')} value={step.title} onChange={(v) => setSteps(steps.map((s, idx) => idx === i ? { ...s, title: v } : s))} />
              <IconPickerField label={fieldLabel('icon')} value={step.icon} onChange={(v) => setSteps(steps.map((s, idx) => idx === i ? { ...s, icon: v } : s))} />
            </div>
            <Field label="Beschreibung" value={step.text} onChange={(v) => setSteps(steps.map((s, idx) => idx === i ? { ...s, text: v } : s))} multiline />
          </div>
        ))}
        <button onClick={() => setSteps([...steps, { title: '', text: '', icon: '' }])} className="text-xs text-blue-600 hover:underline">+ Schritt hinzufügen</button>
      </div>
    </div>
  );
}

// ─── ServicePackages Editor ──────────────────────────────────────
function ServicePackagesEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({
    badge: (data.badge as string) || '',
    headline: (data.headline as string) || '',
    subline: (data.subline as string) || '',
    note: (data.note as string) || '',
  });
  const [packages, setPackages] = useState<{ name: string; price: string; description: string; features: string[]; highlighted: boolean; ctaLabel: string; ctaHref: string }[]>(
    ((data.packages as unknown[]) || []).map((p: unknown) => {
      const pkg = p as Record<string, unknown>;
      return {
        name: (pkg.name as string) || '',
        price: (pkg.price as string) || '',
        description: (pkg.description as string) || '',
        features: (pkg.features as string[]) || [],
        highlighted: (pkg.highlighted as boolean) || false,
        ctaLabel: (pkg.ctaLabel as string) || '',
        ctaHref: (pkg.ctaHref as string) || '',
      };
    })
  );
  useReport({ ...d, packages } as unknown as Record<string, unknown>, onChange);

  function updatePkg(i: number, field: string, val: unknown) {
    setPackages(packages.map((p, idx) => idx === i ? { ...p, [field]: val } : p));
  }

  return (
    <div className="space-y-3">
      <Field label={fieldLabel('badge')} value={d.badge} onChange={(v) => setD({ ...d, badge: v })} />
      <Field label={fieldLabel('headline')} value={d.headline} onChange={(v) => setD({ ...d, headline: v })} />
      <Field label={fieldLabel('subline')} value={d.subline} onChange={(v) => setD({ ...d, subline: v })} />
      <div>
        <p className="text-xs font-medium text-zinc-600 mb-2">Pakete</p>
        {packages.map((pkg, i) => (
          <div key={i} className="relative border border-zinc-200 rounded-lg p-3 mb-3">
            <button onClick={() => setPackages(packages.filter((_, idx) => idx !== i))} className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-xs">×</button>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Field label={fieldLabel('name')} value={pkg.name} onChange={(v) => updatePkg(i, 'name', v)} />
              <Field label={fieldLabel('price')} value={pkg.price} onChange={(v) => updatePkg(i, 'price', v)} placeholder="z.B. ab 490€" />
            </div>
            <Field label="Beschreibung" value={pkg.description} onChange={(v) => updatePkg(i, 'description', v)} multiline />
            <div className="mt-2">
              <p className="text-xs text-zinc-500 mb-1">Features (eins pro Zeile)</p>
              <textarea className="admin-input text-xs w-full" rows={3} value={pkg.features.join('\n')} onChange={(e) => updatePkg(i, 'features', e.target.value.split('\n').filter(Boolean))} />
            </div>
            <div className="mt-2">
              <ButtonField label="CTA" value={{ label: pkg.ctaLabel, href: pkg.ctaHref }} onChange={(v) => { updatePkg(i, 'ctaLabel', v.label); updatePkg(i, 'ctaHref', v.href); }} />
            </div>
            <label className="flex items-center gap-2 mt-2 text-xs text-zinc-600">
              <input type="checkbox" checked={pkg.highlighted} onChange={(e) => updatePkg(i, 'highlighted', e.target.checked)} />
              Hervorgehoben
            </label>
          </div>
        ))}
        <button onClick={() => setPackages([...packages, { name: '', price: '', description: '', features: [], highlighted: false, ctaLabel: '', ctaHref: '' }])} className="text-xs text-blue-600 hover:underline">+ Paket hinzufügen</button>
      </div>
      <Field label="Hinweis (unter Paketen)" value={d.note} onChange={(v) => setD({ ...d, note: v })} />
    </div>
  );
}

// ─── LegalContent Editor ─────────────────────────────────────────
function LegalContentEditor({ data, onChange }: EditorProps) {
  const [headline, setHeadline] = useState((data.headline as string) || '');
  const [blocks, setBlocks] = useState<{ headline: string; text: string }[]>(
    (data.blocks as { headline: string; text: string }[]) || [{ headline: '', text: '' }]
  );
  useReport({ headline, blocks }, onChange);

  return (
    <div className="space-y-4">
      <Field label="Hauptüberschrift" value={headline} onChange={setHeadline} />
      <div>
        <p className="text-xs font-medium text-zinc-600 mb-2">Inhaltsblöcke</p>
        {blocks.map((block, i) => (
          <div key={i} className="relative border border-zinc-200 rounded-lg p-4 mb-3">
            <button onClick={() => setBlocks(blocks.filter((_, idx) => idx !== i))} className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-xs">×</button>
            <Field label={`Block ${i + 1} — Überschrift`} value={block.headline} onChange={(v) => setBlocks(blocks.map((b, idx) => idx === i ? { ...b, headline: v } : b))} />
            <div className="mt-2">
              <MiniRichTextField label="Inhalt (HTML)" value={block.text} onChange={(v) => setBlocks(blocks.map((b, idx) => idx === i ? { ...b, text: v } : b))} />
            </div>
          </div>
        ))}
        <button onClick={() => setBlocks([...blocks, { headline: '', text: '' }])} className="text-xs text-blue-600 hover:underline">+ Block hinzufügen</button>
      </div>
    </div>
  );
}

// ─── Comparison Table Editor ─────────────────────────────────────
function ComparisonTableEditor({ data, onChange }: EditorProps) {
  const [headline, setHeadline] = useState((data.headline as string) || '');
  const [badge, setBadge] = useState((data.badge as string) || '');
  const [text, setText] = useState((data.text as string) || '');
  const [highlightCol, setHighlightCol] = useState<number>((data.highlightCol as number) ?? -1);
  const [columns, setColumns] = useState<{ label: string }[]>((data.columns as { label: string }[]) || [{ label: 'Basis' }, { label: 'Premium' }]);
  const [rows, setRows] = useState<{ feature: string; values: string[] }[]>((data.rows as { feature: string; values: string[] }[]) || []);
  useReport({ headline, badge, text, highlightCol, columns, rows }, onChange);

  function addColumn() { setColumns([...columns, { label: '' }]); setRows(rows.map(r => ({ ...r, values: [...r.values, ''] }))); }
  function removeColumn(i: number) { setColumns(columns.filter((_, ci) => ci !== i)); setRows(rows.map(r => ({ ...r, values: r.values.filter((_, ci) => ci !== i) }))); }
  function addRow() { setRows([...rows, { feature: '', values: columns.map(() => '') }]); }
  function removeRow(i: number) { setRows(rows.filter((_, ri) => ri !== i)); }

  return (
    <div className="space-y-4">
      <Field label={fieldLabel('badge')} value={badge} onChange={setBadge}  />
      <Field label={fieldLabel('headline')} value={headline} onChange={setHeadline}  />
      <Field label="Beschreibung" value={text} onChange={setText} multiline />
      <div>
        <span className="text-xs font-medium text-gray-600 mb-1 block">Spalten</span>
        {columns.map((col, i) => (
          <div key={i} className="flex gap-2 mb-1 items-center">
            <input className="admin-input flex-1" value={col.label} onChange={(e) => { const c = [...columns]; c[i] = { label: e.target.value }; setColumns(c); }} placeholder={`Spalte ${i + 1}`} />
            <label className="text-xs flex items-center gap-1"><input type="radio" name="highlight" checked={highlightCol === i} onChange={() => setHighlightCol(i)} /> Highlight</label>
            <button onClick={() => removeColumn(i)} className="text-red-400 hover:text-red-600 text-xs">×</button>
          </div>
        ))}
        <button onClick={addColumn} className="text-sm text-blue-600 hover:underline">+ Spalte</button>
      </div>
      <div>
        <span className="text-xs font-medium text-gray-600 mb-1 block">Zeilen</span>
        {rows.map((row, ri) => (
          <div key={ri} className="border rounded p-2 mb-2 space-y-1 relative">
            <button onClick={() => removeRow(ri)} className="absolute top-1 right-1 text-red-400 hover:text-red-600 text-xs">×</button>
            <input className="admin-input w-full" value={row.feature} onChange={(e) => { const r = [...rows]; r[ri] = { ...r[ri], feature: e.target.value }; setRows(r); }} placeholder="Feature-Name" />
            <div className="flex gap-1">
              {row.values.map((val, ci) => (
                <input key={ci} className="admin-input flex-1 text-xs" value={val} onChange={(e) => { const r = [...rows]; r[ri] = { ...r[ri], values: r[ri].values.map((v, vi) => vi === ci ? e.target.value : v) }; setRows(r); }} placeholder={columns[ci]?.label || `Wert ${ci + 1}`} title="true/false für ✓/✗ oder Freitext" />
              ))}
            </div>
          </div>
        ))}
        <button onClick={addRow} className="text-sm text-blue-600 hover:underline">+ Zeile</button>
      </div>
    </div>
  );
}

// ─── Social Proof Bar Editor ─────────────────────────────────────
function SocialProofBarEditor({ data, onChange }: EditorProps) {
  const [bgStyle, setBgStyle] = useState((data.bgStyle as string) || 'light');
  const [items, setItems] = useState<{ value: string; label: string; icon: string; logo: string }[]>(
    (data.items as { value: string; label: string; icon: string; logo: string }[]) || []
  );
  useReport({ bgStyle, items }, onChange);

  function addItem() { setItems([...items, { value: '', label: '', icon: '', logo: '' }]); }
  function removeItem(i: number) { setItems(items.filter((_, idx) => idx !== i)); }
  function updateItem(i: number, field: string, val: string) { setItems(items.map((item, idx) => idx === i ? { ...item, [field]: val } : item)); }

  return (
    <div className="space-y-3">
      <div>
        <span className="text-xs font-medium text-gray-600">Hintergrund</span>
        <select className="admin-input mt-1" value={bgStyle} onChange={(e) => setBgStyle(e.target.value)}>
          <option value="light">Hell</option>
          <option value="dark">Dunkel</option>
          <option value="primary">Primärfarbe</option>
        </select>
      </div>
      {items.map((item, i) => (
        <div key={i} className="border rounded p-3 space-y-2 relative">
          <button onClick={() => removeItem(i)} className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-xs">×</button>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Field label="Wert (z.B. 500+)" value={item.value} onChange={(v) => updateItem(i, 'value', v)} />
            <Field label={fieldLabel('label')} value={item.label} onChange={(v) => updateItem(i, 'label', v)} />
            <Field label="Icon (star oder leer)" value={item.icon} onChange={(v) => updateItem(i, 'icon', v)} />
            <Field label="Logo-URL (optional)" value={item.logo} onChange={(v) => updateItem(i, 'logo', v)} />
          </div>
        </div>
      ))}
      <button onClick={addItem} className="text-sm text-blue-600 hover:underline">+ Eintrag</button>
    </div>
  );
}

// ─── Timeline Editor ─────────────────────────────────────────────
function TimelineEditor({ data, onChange }: EditorProps) {
  const [badge, setBadge] = useState((data.badge as string) || '');
  const [headline, setHeadline] = useState((data.headline as string) || '');
  const [subline, setSubline] = useState((data.subline as string) || '');
  const [entries, setEntries] = useState<{ year: string; title: string; text: string }[]>(
    (data.entries as { year: string; title: string; text: string }[]) || []
  );
  useReport({ badge, headline, subline, entries }, onChange);

  function addEntry() { setEntries([...entries, { year: '', title: '', text: '' }]); }
  function removeEntry(i: number) { setEntries(entries.filter((_, idx) => idx !== i)); }
  function updateEntry(i: number, field: string, val: string) { setEntries(entries.map((e, idx) => idx === i ? { ...e, [field]: val } : e)); }

  return (
    <div className="space-y-3">
      <Field label={fieldLabel('badge')} value={badge} onChange={setBadge}  />
      <Field label={fieldLabel('headline')} value={headline} onChange={setHeadline}  />
      <Field label="Unterzeile" value={subline} onChange={setSubline} />
      {entries.map((entry, i) => (
        <div key={i} className="border rounded p-3 space-y-2 relative">
          <button onClick={() => removeEntry(i)} className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-xs">×</button>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Field label="Jahr / Datum" value={entry.year} onChange={(v) => updateEntry(i, 'year', v)} />
            <Field label={fieldLabel('title')} value={entry.title} onChange={(v) => updateEntry(i, 'title', v)} />
          </div>
          <Field label="Beschreibung" value={entry.text} onChange={(v) => updateEntry(i, 'text', v)} multiline />
        </div>
      ))}
      <button onClick={addEntry} className="text-sm text-blue-600 hover:underline">+ Eintrag</button>
    </div>
  );
}

// ─── Stats Counter Editor ────────────────────────────────────────
function StatsCounterEditor({ data, onChange }: EditorProps) {
  const [headline, setHeadline] = useState((data.headline as string) || '');
  const [subline, setSubline] = useState((data.subline as string) || '');
  const [badge, setBadge] = useState((data.badge as string) || '');
  const [stats, setStats] = useState<{ value: string; suffix: string; prefix: string; label: string }[]>(
    ((data.stats as any[]) || []).map(s => ({ value: String(s.value || ''), suffix: (s.suffix as string) || '', prefix: (s.prefix as string) || '', label: (s.label as string) || '' }))
  );
  useReport({ headline, subline, badge, stats: stats.map(s => ({ ...s, value: Number(s.value) || 0 })) }, onChange);

  return (
    <div className="space-y-3">
      <Field label={fieldLabel('badge')} value={badge} onChange={setBadge}  />
      <Field label={fieldLabel('headline')} value={headline} onChange={setHeadline}  />
      <Field label={fieldLabel('subline')} value={subline} onChange={setSubline} multiline  />
      {stats.map((stat, i) => (
        <div key={i} className="border rounded p-3 space-y-2 relative">
          <button onClick={() => setStats(stats.filter((_, idx) => idx !== i))} className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-xs">×</button>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            <Field label="Prefix (z.B. +)" value={stat.prefix} onChange={v => setStats(stats.map((s, idx) => idx === i ? { ...s, prefix: v } : s))} />
            <Field label="Wert (Zahl)" value={stat.value} onChange={v => setStats(stats.map((s, idx) => idx === i ? { ...s, value: v } : s))} />
            <Field label="Suffix (z.B. %)" value={stat.suffix} onChange={v => setStats(stats.map((s, idx) => idx === i ? { ...s, suffix: v } : s))} />
          </div>
          <Field label={fieldLabel('label')} value={stat.label} onChange={v => setStats(stats.map((s, idx) => idx === i ? { ...s, label: v } : s))} />
        </div>
      ))}
      <button onClick={() => setStats([...stats, { value: '', suffix: '', prefix: '', label: '' }])} className="text-sm text-blue-600 hover:underline">+ Stat</button>
    </div>
  );
}

// ─── Bento Grid Editor ───────────────────────────────────────────
function BentoGridEditor({ data, onChange }: EditorProps) {
  const [headline, setHeadline] = useState((data.headline as string) || '');
  const [subline, setSubline] = useState((data.subline as string) || '');
  const [badge, setBadge] = useState((data.badge as string) || '');
  const [items, setItems] = useState<{ title: string; description: string; icon: string; image: string; span: string }[]>(
    ((data.items as any[]) || []).map(item => ({ title: (item.title as string) || '', description: (item.description as string) || '', icon: (item.icon as string) || '', image: (item.image as string) || '', span: (item.span as string) || '' }))
  );
  useReport({ headline, subline, badge, items: items.map(i => ({ ...i, span: i.span || undefined })) }, onChange);

  return (
    <div className="space-y-3">
      <Field label={fieldLabel('badge')} value={badge} onChange={setBadge}  />
      <Field label={fieldLabel('headline')} value={headline} onChange={setHeadline}  />
      <Field label={fieldLabel('subline')} value={subline} onChange={setSubline} multiline  />
      {items.map((item, i) => (
        <div key={i} className="border rounded p-3 space-y-2 relative">
          <button onClick={() => setItems(items.filter((_, idx) => idx !== i))} className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-xs">×</button>
          <Field label={fieldLabel('title')} value={item.title} onChange={v => setItems(items.map((it, idx) => idx === i ? { ...it, title: v } : it))} />
          <Field label="Beschreibung" value={item.description} onChange={v => setItems(items.map((it, idx) => idx === i ? { ...it, description: v } : it))} multiline />
          <IconPickerField label={fieldLabel('icon')} value={item.icon} onChange={v => setItems(items.map((it, idx) => idx === i ? { ...it, icon: v } : it))} />
          <ImageUploadField label={fieldLabel('image')} value={item.image} onChange={v => setItems(items.map((it, idx) => idx === i ? { ...it, image: v } : it))} />
          <div>
            <label className="text-xs font-medium text-zinc-600">Größe</label>
            <select className="admin-input mt-1" value={item.span} onChange={e => setItems(items.map((it, idx) => idx === i ? { ...it, span: e.target.value } : it))}>
              <option value="">Standard</option>
              <option value="wide">Breit (2 Spalten)</option>
              <option value="tall">Hoch (2 Reihen)</option>
              <option value="large">Groß (2×2)</option>
            </select>
          </div>
        </div>
      ))}
      <button onClick={() => setItems([...items, { title: '', description: '', icon: '', image: '', span: '' }])} className="text-sm text-blue-600 hover:underline">+ Element</button>
    </div>
  );
}

// ─── Testimonial Marquee Editor ──────────────────────────────────
function TestimonialMarqueeEditor({ data, onChange }: EditorProps) {
  const [headline, setHeadline] = useState((data.headline as string) || '');
  const [items, setItems] = useState<{ quote: string; name: string; role: string; image: string; rating: number }[]>(
    ((data.items as any[]) || []).map(item => ({ quote: (item.quote as string) || '', name: (item.name as string) || '', role: (item.role as string) || '', image: (item.image as string) || '', rating: (item.rating as number) || 5 }))
  );
  useReport({ headline, items }, onChange);

  return (
    <div className="space-y-3">
      <Field label={fieldLabel('headline')} value={headline} onChange={setHeadline}  />
      {items.map((item, i) => (
        <div key={i} className="border rounded p-3 space-y-2 relative">
          <button onClick={() => setItems(items.filter((_, idx) => idx !== i))} className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-xs">×</button>
          <Field label={fieldLabel('quote')} value={item.quote} onChange={v => setItems(items.map((it, idx) => idx === i ? { ...it, quote: v } : it))} multiline />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Field label={fieldLabel('name')} value={item.name} onChange={v => setItems(items.map((it, idx) => idx === i ? { ...it, name: v } : it))} />
            <Field label="Rolle / Kontext" value={item.role} onChange={v => setItems(items.map((it, idx) => idx === i ? { ...it, role: v } : it))} />
          </div>
          <ImageUploadField label={fieldLabel('image')} value={item.image} onChange={v => setItems(items.map((it, idx) => idx === i ? { ...it, image: v } : it))} />
          <div>
            <label className="text-xs font-medium text-zinc-600">Bewertung</label>
            <select className="admin-input mt-1" value={item.rating} onChange={e => setItems(items.map((it, idx) => idx === i ? { ...it, rating: Number(e.target.value) } : it))}>
              {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} Sterne</option>)}
            </select>
          </div>
        </div>
      ))}
      <button onClick={() => setItems([...items, { quote: '', name: '', role: '', image: '', rating: 5 }])} className="text-sm text-blue-600 hover:underline">+ Bewertung</button>
    </div>
  );
}

// ─── Feature Showcase Editor ─────────────────────────────────────
function FeatureShowcaseEditor({ data, onChange }: EditorProps) {
  const [headline, setHeadline] = useState((data.headline as string) || '');
  const [subline, setSubline] = useState((data.subline as string) || '');
  const [badge, setBadge] = useState((data.badge as string) || '');
  const [text, setText] = useState((data.text as string) || '');
  const [image, setImage] = useState((data.image as string) || '');
  const [features, setFeatures] = useState<string[]>((data.features as string[]) || []);
  const [ctaLabel, setCtaLabel] = useState((data.ctaLabel as string) || '');
  const [ctaHref, setCtaHref] = useState((data.ctaHref as string) || '');
  const [reversed, setReversed] = useState(data.reversed === true);
  useReport({ headline, subline, badge, text, image, features, ctaLabel, ctaHref, reversed }, onChange);

  return (
    <div className="space-y-3">
      <Field label={fieldLabel('badge')} value={badge} onChange={setBadge}  />
      <Field label={fieldLabel('headline')} value={headline} onChange={setHeadline}  />
      <Field label={fieldLabel('subline')} value={subline} onChange={setSubline}  />
      <Field label={fieldLabel('text')} value={text} onChange={setText} multiline  />
      <ImageUploadField label={fieldLabel('image')} value={image} onChange={setImage} />
      <div>
        <label className="text-xs font-medium text-zinc-600">Features (eine pro Zeile)</label>
        <textarea className="admin-input mt-1 w-full" rows={4} value={features.join('\n')} onChange={e => setFeatures(e.target.value.split('\n'))} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <Field label={fieldLabel('ctaLabel')} value={ctaLabel} onChange={setCtaLabel}  />
        <Field label={fieldLabel('ctaHref')} value={ctaHref} onChange={setCtaHref}  />
      </div>
      <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={reversed} onChange={e => setReversed(e.target.checked)} /> Layout spiegeln</label>
    </div>
  );
}

// ─── Logo Marquee Editor ─────────────────────────────────────────
function LogoMarqueeEditor({ data, onChange }: EditorProps) {
  const [headline, setHeadline] = useState((data.headline as string) || '');
  const [subline, setSubline] = useState((data.subline as string) || '');
  const [items, setItems] = useState<{ name: string; image: string }[]>(
    ((data.items as any[]) || []).map(item => ({ name: (item.name as string) || '', image: (item.image as string) || '' }))
  );
  useReport({ headline, subline, items }, onChange);

  return (
    <div className="space-y-3">
      <Field label={fieldLabel('headline')} value={headline} onChange={setHeadline}  />
      <Field label={fieldLabel('subline')} value={subline} onChange={setSubline}  />
      {items.map((item, i) => (
        <div key={i} className="border rounded p-3 space-y-2 relative">
          <button onClick={() => setItems(items.filter((_, idx) => idx !== i))} className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-xs">×</button>
          <Field label={fieldLabel('name')} value={item.name} onChange={v => setItems(items.map((it, idx) => idx === i ? { ...it, name: v } : it))} />
          <ImageUploadField label="Logo" value={item.image} onChange={v => setItems(items.map((it, idx) => idx === i ? { ...it, image: v } : it))} />
        </div>
      ))}
      <button onClick={() => setItems([...items, { name: '', image: '' }])} className="text-sm text-blue-600 hover:underline">+ Logo</button>
    </div>
  );
}


// Async-loaded collection key dropdown
function CollectionKeySelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [keys, setKeys] = useState<{ key: string; label: string }[]>([]);
  useEffect(() => { getCollectionKeysAction().then(setKeys).catch(() => {}); }, []);
  return (
    <label className="block">
      <span className="text-xs font-medium text-zinc-600 mb-1 block">Collection</span>
      {keys.length > 0 ? (
        <select className="admin-input" value={value} onChange={(e) => onChange(e.target.value)}>
          <option value="">– Bitte wählen –</option>
          {keys.map(c => <option key={c.key} value={c.key}>{c.label} ({c.key})</option>)}
        </select>
      ) : (
        <input className="admin-input" value={value} onChange={(e) => onChange(e.target.value)} placeholder="z.B. news, blog" />
      )}
    </label>
  );
}

// ─── CollectionList Editor ───────────────────────────────────────
function CollectionListEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({
    headline: (data.headline as string) || '',
    subline: (data.subline as string) || '',
    collectionKey: (data.collectionKey as string) || 'news',
    sortBy: (data.sortBy as string) || 'date-desc',
    columns: (data.columns as number) || 3,
    showImage: data.showImage !== false,
    showDate: data.showDate !== false,
    showExcerpt: data.showExcerpt !== false,
    showSortControls: data.showSortControls !== false,
  });
  useReport(d, onChange);

  return (
    <div className="space-y-3">
      <Field label={fieldLabel('headline')} value={d.headline} onChange={(v) => setD({ ...d, headline: v })} placeholder="z.B. Alle Beiträge" help="Hauptüberschrift über der Beitragsliste" />
      <Field label={fieldLabel('subline')} value={d.subline} onChange={(v) => setD({ ...d, subline: v })} />
      <CollectionKeySelect value={d.collectionKey} onChange={(v) => setD({ ...d, collectionKey: v })} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="block">
          <span className="text-xs text-gray-600">Standard-Sortierung</span>
          <select className="admin-input mt-1" value={d.sortBy} onChange={(e) => setD({ ...d, sortBy: e.target.value })}>
            <option value="date-desc">Neueste zuerst</option>
            <option value="date-asc">Älteste zuerst</option>
            <option value="alpha-asc">A → Z</option>
            <option value="alpha-desc">Z → A</option>
            <option value="priority">Priorität</option>
          </select>
        </label>
        <label className="block">
          <span className="text-xs text-gray-600">Spalten</span>
          <select className="admin-input mt-1" value={d.columns} onChange={(e) => setD({ ...d, columns: parseInt(e.target.value) })}>
            <option value={2}>2 Spalten</option>
            <option value={3}>3 Spalten</option>
            <option value={4}>4 Spalten</option>
          </select>
        </label>
      </div>
      <div className="flex flex-wrap gap-4 pt-1">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={d.showImage} onChange={() => setD({ ...d, showImage: !d.showImage })} />
          Bilder anzeigen
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={d.showDate} onChange={() => setD({ ...d, showDate: !d.showDate })} />
          Datum anzeigen
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={d.showExcerpt} onChange={() => setD({ ...d, showExcerpt: !d.showExcerpt })} />
          Auszug anzeigen
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={d.showSortControls} onChange={() => setD({ ...d, showSortControls: !d.showSortControls })} />
          Sortier-Dropdown anzeigen
        </label>
      </div>
      <p className="text-xs text-gray-400">Die Items werden automatisch aus der verknüpften Collection geladen. Bilder werden aus der Hero-Section der Items gezogen.</p>
    </div>
  );
}

// ─── Shop Featured Products Editor ──────────────────────────────
function ShopProductGridEditor({ data, onChange }: EditorProps) {
  const [headline, setHeadline] = useState((data.headline as string) || 'Unsere Produkte');
  const [showSearch, setShowSearch] = useState(data.showSearch !== false);
  const [showCategories, setShowCategories] = useState(data.showCategories !== false);
  const [showSort, setShowSort] = useState(data.showSort !== false);
  const [columns, setColumns] = useState<number>((data.columns as number) || 3);

  useReport({ headline, showSearch, showCategories, showSort, columns }, onChange);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Überschrift</label>
        <input className="w-full border rounded px-3 py-2" value={headline} onChange={e => setHeadline(e.target.value)} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={showSearch} onChange={e => setShowSearch(e.target.checked)} />
          Suche anzeigen
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={showCategories} onChange={e => setShowCategories(e.target.checked)} />
          Kategorien anzeigen
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={showSort} onChange={e => setShowSort(e.target.checked)} />
          Sortierung anzeigen
        </label>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Spalten (Desktop)</label>
        <select className="w-full border rounded px-3 py-2" value={columns} onChange={e => setColumns(Number(e.target.value))}>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
        </select>
      </div>
    </div>
  );
}

function ShopProductDetailEditor({ data, onChange }: EditorProps) {
  // This section is mostly automatic (fetches product from URL slug).
  // No configurable fields needed — display info message.
  useReport({}, onChange);

  return (
    <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 flex items-start gap-3">
      <Info size={18} className="text-blue-500 mt-0.5 shrink-0" />
      <div className="text-sm text-blue-800">
        <p className="font-medium mb-1">Automatische Sektion</p>
        <p>Das Produkt-Detail wird automatisch anhand der URL geladen. Diese Sektion benötigt keine manuelle Konfiguration.</p>
      </div>
    </div>
  );
}

function ShopCartEditor({ data, onChange }: EditorProps) {
  const [headline, setHeadline] = useState((data.headline as string) || 'Dein Warenkorb');
  const [emptyText, setEmptyText] = useState((data.emptyText as string) || 'Dein Warenkorb ist leer.');
  const [continueShoppingLabel, setContinueShoppingLabel] = useState((data.continueShoppingLabel as string) || 'Weiter einkaufen');
  const [checkoutLabel, setCheckoutLabel] = useState((data.checkoutLabel as string) || 'Zur Kasse');

  useReport({ headline, emptyText, continueShoppingLabel, checkoutLabel }, onChange);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Überschrift</label>
        <input className="w-full border rounded px-3 py-2" value={headline} onChange={e => setHeadline(e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Text bei leerem Warenkorb</label>
        <input className="w-full border rounded px-3 py-2" value={emptyText} onChange={e => setEmptyText(e.target.value)} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Button: Weiter einkaufen</label>
          <input className="w-full border rounded px-3 py-2" value={continueShoppingLabel} onChange={e => setContinueShoppingLabel(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Button: Zur Kasse</label>
          <input className="w-full border rounded px-3 py-2" value={checkoutLabel} onChange={e => setCheckoutLabel(e.target.value)} />
        </div>
      </div>
    </div>
  );
}

function ShopCheckoutEditor({ data, onChange }: EditorProps) {
  const [headline, setHeadline] = useState((data.headline as string) || 'Kasse');

  useReport({ headline }, onChange);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Überschrift</label>
        <input className="w-full border rounded px-3 py-2" value={headline} onChange={e => setHeadline(e.target.value)} />
      </div>
      <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 flex items-start gap-3">
        <Info size={18} className="text-blue-500 mt-0.5 shrink-0" />
        <p className="text-sm text-blue-800">Die Checkout-Schritte (Kontakt, Versand, Zahlung, Bestätigung) werden automatisch gesteuert.</p>
      </div>
    </div>
  );
}

function ShopThankYouEditor({ data, onChange }: EditorProps) {
  const [headline, setHeadline] = useState((data.headline as string) || 'Vielen Dank für deine Bestellung!');
  const [subline, setSubline] = useState((data.subline as string) || 'Du erhältst in Kürze eine Bestätigung per E-Mail.');
  const [continueShoppingLabel, setContinueShoppingLabel] = useState((data.continueShoppingLabel as string) || 'Zurück zum Shop');

  useReport({ headline, subline, continueShoppingLabel }, onChange);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Überschrift</label>
        <input className="w-full border rounded px-3 py-2" value={headline} onChange={e => setHeadline(e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Untertitel</label>
        <input className="w-full border rounded px-3 py-2" value={subline} onChange={e => setSubline(e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Button-Text: Zurück zum Shop</label>
        <input className="w-full border rounded px-3 py-2" value={continueShoppingLabel} onChange={e => setContinueShoppingLabel(e.target.value)} />
      </div>
    </div>
  );
}

function ShopFeaturedProductsEditor({ data, onChange }: EditorProps) {
  const [headline, setHeadline] = useState((data.headline as string) || 'Empfohlene Produkte');
  const [mode, setMode] = useState<string>((data.mode as string) || 'latest');
  const [categorySlug, setCategorySlug] = useState((data.categorySlug as string) || '');
  const [productIds, setProductIds] = useState<string>((data.productIds as string[] || []).join(', '));
  const [count, setCount] = useState<number>((data.count as number) || 4);
  const [columns, setColumns] = useState<number>((data.columns as number) || 4);

  useReport({ headline, mode, categorySlug, productIds: productIds.split(',').map(s => s.trim()).filter(Boolean), count, columns }, onChange);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Überschrift</label>
        <input className="w-full border rounded px-3 py-2" value={headline} onChange={e => setHeadline(e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Modus</label>
        <select className="w-full border rounded px-3 py-2" value={mode} onChange={e => setMode(e.target.value)}>
          <option value="latest">Neueste Produkte</option>
          <option value="category">Nach Kategorie</option>
          <option value="manual">Manuelle Auswahl (IDs)</option>
        </select>
      </div>
      {mode === 'category' && (
        <div>
          <label className="block text-sm font-medium mb-1">Kategorie-Slug</label>
          <input className="w-full border rounded px-3 py-2" value={categorySlug} onChange={e => setCategorySlug(e.target.value)} placeholder="z.B. rotwein" />
        </div>
      )}
      {mode === 'manual' && (
        <div>
          <label className="block text-sm font-medium mb-1">Produkt-IDs (komma-getrennt)</label>
          <input className="w-full border rounded px-3 py-2" value={productIds} onChange={e => setProductIds(e.target.value)} placeholder="id1, id2, id3" />
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Anzahl</label>
          <input type="number" className="w-full border rounded px-3 py-2" value={count} onChange={e => setCount(Number(e.target.value))} min={1} max={12} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Spalten (Desktop)</label>
          <select className="w-full border rounded px-3 py-2" value={columns} onChange={e => setColumns(Number(e.target.value))}>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
          </select>
        </div>
      </div>
    </div>
  );
}

// ─── Retail / Shared new editors ─────────────────────────────────

function ProductShowcaseEditor({ data, onChange }: EditorProps) {
  const [headline, setHeadline] = useState((data.headline as string) || '');
  const [subline, setSubline] = useState((data.subline as string) || '');
  const [columns, setColumns] = useState((data.columns as string) || '3');
  const [items, setItems] = useState<{ image: string; title: string; price: string; badge: string; href: string; description: string }[]>(
    (data.items as any[]) || []
  );
  useReport({ headline, subline, columns, items }, onChange);
  function addItem() { setItems([...items, { image: '', title: '', price: '', badge: '', href: '', description: '' }]); }
  function removeItem(i: number) { setItems(items.filter((_, idx) => idx !== i)); }
  function update(i: number, field: string, val: string) { setItems(items.map((it, idx) => idx === i ? { ...it, [field]: val } : it)); }
  return (
    <div className="space-y-4">
      <Field label={fieldLabel('headline')} value={headline} onChange={setHeadline}  />
      <Field label={fieldLabel('subline')} value={subline} onChange={setSubline}  />
      <SelectField label={fieldLabel('columns')} value={columns} options={['2', '3', '4']} onChange={setColumns} />
      {items.map((item, i) => (
        <div key={i} className="border rounded-lg p-3 space-y-2 relative">
          <button onClick={() => removeItem(i)} className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-xs">×</button>
          <ImageUploadField label={fieldLabel('image')} value={item.image} onChange={(v) => update(i, 'image', v)} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Field label={fieldLabel('title')} value={item.title} onChange={(v) => update(i, 'title', v)} />
            <Field label={fieldLabel('price')} value={item.price} onChange={(v) => update(i, 'price', v)} placeholder="ab 299 €" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Field label={fieldLabel('badge')} value={item.badge} onChange={(v) => update(i, 'badge', v)} placeholder="Neu / Sale" />
            <Field label="Link" value={item.href} onChange={(v) => update(i, 'href', v)} placeholder="/produkt" />
          </div>
          <Field label="Beschreibung" value={item.description} onChange={(v) => update(i, 'description', v)} />
        </div>
      ))}
      <button onClick={addItem} className="text-sm text-blue-600 hover:underline">+ Produkt hinzufügen</button>
    </div>
  );
}

function CategoryMosaicEditor({ data, onChange }: EditorProps) {
  const [headline, setHeadline] = useState((data.headline as string) || '');
  const [subline, setSubline] = useState((data.subline as string) || '');
  const [items, setItems] = useState<{ image: string; title: string; href: string; size: string }[]>(
    (data.items as any[]) || []
  );
  useReport({ headline, subline, items }, onChange);
  function addItem() { setItems([...items, { image: '', title: '', href: '', size: 'small' }]); }
  function removeItem(i: number) { setItems(items.filter((_, idx) => idx !== i)); }
  function update(i: number, field: string, val: string) { setItems(items.map((it, idx) => idx === i ? { ...it, [field]: val } : it)); }
  return (
    <div className="space-y-4">
      <Field label={fieldLabel('headline')} value={headline} onChange={setHeadline}  />
      <Field label={fieldLabel('subline')} value={subline} onChange={setSubline}  />
      <p className="text-xs text-zinc-500">Tipp: Die ersten 2 Einträge mit Größe "Groß" erscheinen als große Kacheln.</p>
      {items.map((item, i) => (
        <div key={i} className="border rounded-lg p-3 space-y-2 relative">
          <button onClick={() => removeItem(i)} className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-xs">×</button>
          <ImageUploadField label={fieldLabel('image')} value={item.image} onChange={(v) => update(i, 'image', v)} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            <Field label={fieldLabel('title')} value={item.title} onChange={(v) => update(i, 'title', v)} />
            <Field label="Link" value={item.href} onChange={(v) => update(i, 'href', v)} placeholder="/kategorie" />
            <SelectField label="Größe" value={item.size} options={['large', 'small']} onChange={(v) => update(i, 'size', v)} />
          </div>
        </div>
      ))}
      <button onClick={addItem} className="text-sm text-blue-600 hover:underline">+ Kategorie hinzufügen</button>
    </div>
  );
}

function BrandShowroomEditor({ data, onChange }: EditorProps) {
  const [image, setImage] = useState((data.image as string) || '');
  const [headline, setHeadline] = useState((data.headline as string) || '');
  const [subline, setSubline] = useState((data.subline as string) || '');
  const [overlayOpacity, setOverlayOpacity] = useState(String((data.overlayOpacity as number) ?? 0.5));
  const [highlights, setHighlights] = useState<{ title: string; text: string }[]>((data.highlights as any[]) || []);
  const [cta, setCta] = useState((data.cta as { label: string; href: string }) || { label: '', href: '' });
  useReport({ image, headline, subline, overlayOpacity: parseFloat(overlayOpacity) || 0.5, highlights, cta }, onChange);
  return (
    <div className="space-y-4">
      <ImageUploadField label="Showroom-Bild" value={image} onChange={setImage} />
      <Field label={fieldLabel('headline')} value={headline} onChange={setHeadline}  />
      <Field label={fieldLabel('subline')} value={subline} onChange={setSubline}  />
      <Field label="Overlay-Stärke (0-1)" value={overlayOpacity} onChange={setOverlayOpacity} placeholder="0.5" />
      <div className="space-y-2">
        <span className="text-xs text-gray-600 font-medium">Highlights</span>
        {highlights.map((h, i) => (
          <div key={i} className="border rounded p-2 space-y-1 relative">
            <button onClick={() => setHighlights(highlights.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 text-red-400 text-xs">×</button>
            <Field label={fieldLabel('title')} value={h.title} onChange={(v) => setHighlights(highlights.map((x, idx) => idx === i ? { ...x, title: v } : x))} />
            <Field label={fieldLabel('text')} value={h.text} onChange={(v) => setHighlights(highlights.map((x, idx) => idx === i ? { ...x, text: v } : x))} />
          </div>
        ))}
        <button onClick={() => setHighlights([...highlights, { title: '', text: '' }])} className="text-sm text-blue-600 hover:underline">+ Highlight</button>
      </div>
      <ButtonField label="CTA-Button" value={cta} onChange={setCta} />
    </div>
  );
}

function ConsultationBookingEditor({ data, onChange }: EditorProps) {
  const [headline, setHeadline] = useState((data.headline as string) || '');
  const [subline, setSubline] = useState((data.subline as string) || '');
  const [image, setImage] = useState((data.image as string) || '');
  const [services, setServices] = useState<{ icon: string; title: string; description: string }[]>((data.services as any[]) || []);
  const [cta, setCta] = useState((data.cta as { label: string; href: string }) || { label: '', href: '' });
  useReport({ headline, subline, image, services, cta }, onChange);
  function addService() { setServices([...services, { icon: '', title: '', description: '' }]); }
  function removeService(i: number) { setServices(services.filter((_, idx) => idx !== i)); }
  function updateService(i: number, field: string, val: string) { setServices(services.map((s, idx) => idx === i ? { ...s, [field]: val } : s)); }
  return (
    <div className="space-y-4">
      <Field label={fieldLabel('headline')} value={headline} onChange={setHeadline}  />
      <Field label={fieldLabel('subline')} value={subline} onChange={setSubline}  />
      <ImageUploadField label="Seitenbild" value={image} onChange={setImage} />
      <div className="space-y-2">
        <span className="text-xs text-gray-600 font-medium">Services / Beratungsangebote</span>
        {services.map((s, i) => (
          <div key={i} className="border rounded-lg p-3 space-y-2 relative">
            <button onClick={() => removeService(i)} className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-xs">×</button>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              <IconPickerField label={fieldLabel('icon')} value={s.icon} onChange={(v) => updateService(i, 'icon', v)} />
              <Field label={fieldLabel('title')} value={s.title} onChange={(v) => updateService(i, 'title', v)} />
              <Field label="Beschreibung" value={s.description} onChange={(v) => updateService(i, 'description', v)} />
            </div>
          </div>
        ))}
        <button onClick={addService} className="text-sm text-blue-600 hover:underline">+ Service hinzufügen</button>
      </div>
      <ButtonField label="CTA-Button" value={cta} onChange={setCta} />
    </div>
  );
}

function MaterialGalleryEditor({ data, onChange }: EditorProps) {
  const [headline, setHeadline] = useState((data.headline as string) || '');
  const [subline, setSubline] = useState((data.subline as string) || '');
  const [categories, setCategories] = useState<string[]>((data.categories as string[]) || []);
  const [items, setItems] = useState<{ image: string; name: string; category: string }[]>((data.items as any[]) || []);
  useReport({ headline, subline, categories, items }, onChange);
  function addItem() { setItems([...items, { image: '', name: '', category: categories[0] || '' }]); }
  function removeItem(i: number) { setItems(items.filter((_, idx) => idx !== i)); }
  function update(i: number, field: string, val: string) { setItems(items.map((it, idx) => idx === i ? { ...it, [field]: val } : it)); }
  return (
    <div className="space-y-4">
      <Field label={fieldLabel('headline')} value={headline} onChange={setHeadline}  />
      <Field label={fieldLabel('subline')} value={subline} onChange={setSubline}  />
      <div className="space-y-2">
        <span className="text-xs text-gray-600 font-medium">Kategorien (für Filter)</span>
        {categories.map((cat, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input className="admin-input flex-1" value={cat} onChange={(e) => setCategories(categories.map((c, idx) => idx === i ? e.target.value : c))} />
            <button onClick={() => setCategories(categories.filter((_, idx) => idx !== i))} className="text-red-400 text-xs">×</button>
          </div>
        ))}
        <button onClick={() => setCategories([...categories, ''])} className="text-sm text-blue-600 hover:underline">+ Kategorie</button>
      </div>
      <div className="space-y-2">
        <span className="text-xs text-gray-600 font-medium">Materialien</span>
        {items.map((item, i) => (
          <div key={i} className="border rounded-lg p-3 space-y-2 relative">
            <button onClick={() => removeItem(i)} className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-xs">×</button>
            <ImageUploadField label={fieldLabel('image')} value={item.image} onChange={(v) => update(i, 'image', v)} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Field label={fieldLabel('name')} value={item.name} onChange={(v) => update(i, 'name', v)} />
              <SelectField label={fieldLabel('category')} value={item.category} options={['', ...categories]} onChange={(v) => update(i, 'category', v)} />
            </div>
          </div>
        ))}
        <button onClick={addItem} className="text-sm text-blue-600 hover:underline">+ Material hinzufügen</button>
      </div>
    </div>
  );
}

function DeliveryTimelineEditor({ data, onChange }: EditorProps) {
  const [headline, setHeadline] = useState((data.headline as string) || '');
  const [subline, setSubline] = useState((data.subline as string) || '');
  const [steps, setSteps] = useState<{ number: string; icon: string; title: string; text: string }[]>((data.steps as any[]) || []);
  useReport({ headline, subline, steps }, onChange);
  function addStep() { setSteps([...steps, { number: String(steps.length + 1), icon: '', title: '', text: '' }]); }
  function removeStep(i: number) { setSteps(steps.filter((_, idx) => idx !== i)); }
  function updateStep(i: number, field: string, val: string) { setSteps(steps.map((s, idx) => idx === i ? { ...s, [field]: val } : s)); }
  return (
    <div className="space-y-4">
      <Field label={fieldLabel('headline')} value={headline} onChange={setHeadline}  />
      <Field label={fieldLabel('subline')} value={subline} onChange={setSubline}  />
      {steps.map((step, i) => (
        <div key={i} className="border rounded-lg p-3 space-y-2 relative">
          <button onClick={() => removeStep(i)} className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-xs">×</button>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            <Field label="Nr." value={step.number} onChange={(v) => updateStep(i, 'number', v)} />
            <IconPickerField label={fieldLabel('icon')} value={step.icon} onChange={(v) => updateStep(i, 'icon', v)} />
            <Field label={fieldLabel('title')} value={step.title} onChange={(v) => updateStep(i, 'title', v)} />
            <Field label={fieldLabel('text')} value={step.text} onChange={(v) => updateStep(i, 'text', v)} />
          </div>
        </div>
      ))}
      <button onClick={addStep} className="text-sm text-blue-600 hover:underline">+ Schritt hinzufügen</button>
    </div>
  );
}

function InspirationGridEditor({ data, onChange }: EditorProps) {
  const [headline, setHeadline] = useState((data.headline as string) || '');
  const [subline, setSubline] = useState((data.subline as string) || '');
  const [items, setItems] = useState<{ image: string; title: string; href: string }[]>((data.items as any[]) || []);
  useReport({ headline, subline, items }, onChange);
  function addItem() { setItems([...items, { image: '', title: '', href: '' }]); }
  function removeItem(i: number) { setItems(items.filter((_, idx) => idx !== i)); }
  function update(i: number, field: string, val: string) { setItems(items.map((it, idx) => idx === i ? { ...it, [field]: val } : it)); }
  return (
    <div className="space-y-4">
      <Field label={fieldLabel('headline')} value={headline} onChange={setHeadline}  />
      <Field label={fieldLabel('subline')} value={subline} onChange={setSubline}  />
      {items.map((item, i) => (
        <div key={i} className="border rounded-lg p-3 space-y-2 relative">
          <button onClick={() => removeItem(i)} className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-xs">×</button>
          <ImageUploadField label={fieldLabel('image')} value={item.image} onChange={(v) => update(i, 'image', v)} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Field label={fieldLabel('title')} value={item.title} onChange={(v) => update(i, 'title', v)} />
            <Field label="Link" value={item.href} onChange={(v) => update(i, 'href', v)} placeholder="/inspiration" />
          </div>
        </div>
      ))}
      <button onClick={addItem} className="text-sm text-blue-600 hover:underline">+ Bild hinzufügen</button>
    </div>
  );
}

function BeforeAfterEditor({ data, onChange }: EditorProps) {
  const [headline, setHeadline] = useState((data.headline as string) || '');
  const [description, setDescription] = useState((data.description as string) || '');
  const [imageBefore, setImageBefore] = useState((data.imageBefore as string) || '');
  const [imageAfter, setImageAfter] = useState((data.imageAfter as string) || '');
  const [labelBefore, setLabelBefore] = useState((data.labelBefore as string) || 'Vorher');
  const [labelAfter, setLabelAfter] = useState((data.labelAfter as string) || 'Nachher');
  useReport({ headline, description, imageBefore, imageAfter, labelBefore, labelAfter }, onChange);
  return (
    <div className="space-y-4">
      <Field label={fieldLabel('headline')} value={headline} onChange={setHeadline}  />
      <Field label="Beschreibung" value={description} onChange={setDescription} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <ImageUploadField label="Bild Vorher" value={imageBefore} onChange={setImageBefore} />
          <Field label="Label Vorher" value={labelBefore} onChange={setLabelBefore} />
        </div>
        <div>
          <ImageUploadField label="Bild Nachher" value={imageAfter} onChange={setImageAfter} />
          <Field label="Label Nachher" value={labelAfter} onChange={setLabelAfter} />
        </div>
      </div>
    </div>
  );
}

// ─── Editor registry ─────────────────────────────────────────────
function VerticalTimelineEditor({ data, onChange }: EditorProps) {
  const [headline, setHeadline] = useState((data.headline as string) || '');
  const [subline, setSubline] = useState((data.subline as string) || '');
  const [steps, setSteps] = useState<{ number: string; timeLabel: string; title: string; text: string; checkmarks: string[] }[]>(
    ((data.steps as any[]) || []).map((step) => ({
      number: step.number || '',
      timeLabel: step.timeLabel || '',
      title: step.title || '',
      text: step.text || '',
      checkmarks: Array.isArray(step.checkmarks) ? step.checkmarks : [],
    }))
  );
  useReport({ headline, subline, steps }, onChange);
  function addStep() { setSteps([...steps, { number: String(steps.length + 1).padStart(2, '0'), timeLabel: '', title: '', text: '', checkmarks: [] }]); }
  function removeStep(i: number) { setSteps(steps.filter((_, idx) => idx !== i)); }
  function updateStep(i: number, field: string, value: string | string[]) { setSteps(steps.map((step, idx) => idx === i ? { ...step, [field]: value } : step)); }
  return (
    <div className="space-y-4">
      <Field label={fieldLabel('headline')} value={headline} onChange={setHeadline}  />
      <Field label={fieldLabel('subline')} value={subline} onChange={setSubline} multiline  />
      {steps.map((step, i) => (
        <div key={i} className="border rounded-lg p-3 space-y-2 relative">
          <button type="button" onClick={() => removeStep(i)} className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-xs">×</button>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Field label={fieldLabel('number')} value={step.number} onChange={(v) => updateStep(i, 'number', v)} />
            <Field label={fieldLabel('timeLabel')} value={step.timeLabel} onChange={(v) => updateStep(i, 'timeLabel', v)} placeholder="z.B. Woche 1" />
          </div>
          <Field label={fieldLabel('title')} value={step.title} onChange={(v) => updateStep(i, 'title', v)} />
          <Field label={fieldLabel('text')} value={step.text} onChange={(v) => updateStep(i, 'text', v)} multiline />
          <Field label="Checkpunkte (eine Zeile pro Punkt)" value={step.checkmarks.join('\n')} onChange={(v) => updateStep(i, 'checkmarks', v.split('\n').map(item => item.trim()).filter(Boolean))} multiline />
        </div>
      ))}
      <button type="button" onClick={addStep} className="text-sm text-blue-600 hover:underline">+ Schritt hinzufügen</button>
    </div>
  );
}

function BeforeAfterSliderEditor({ data, onChange }: EditorProps) {
  const [headline, setHeadline] = useState((data.headline as string) || '');
  const [subline, setSubline] = useState((data.subline as string) || '');
  const [aspectRatio, setAspectRatio] = useState((data.aspectRatio as string) || '16/9');
  const [slides, setSlides] = useState<{ imageBefore: string; imageAfter: string; labelBefore: string; labelAfter: string; caption: string }[]>(
    ((data.slides as any[]) || []).map((slide) => ({
      imageBefore: slide.imageBefore || '',
      imageAfter: slide.imageAfter || '',
      labelBefore: slide.labelBefore || 'Vorher',
      labelAfter: slide.labelAfter || 'Nachher',
      caption: slide.caption || '',
    }))
  );
  useReport({ headline, subline, slides, aspectRatio }, onChange);
  function addSlide() { setSlides([...slides, { imageBefore: '', imageAfter: '', labelBefore: 'Vorher', labelAfter: 'Nachher', caption: '' }]); }
  function removeSlide(i: number) { setSlides(slides.filter((_, idx) => idx !== i)); }
  function updateSlide(i: number, field: string, value: string) { setSlides(slides.map((slide, idx) => idx === i ? { ...slide, [field]: value } : slide)); }
  return (
    <div className="space-y-4">
      <Field label={fieldLabel('headline')} value={headline} onChange={setHeadline}  />
      <Field label={fieldLabel('subline')} value={subline} onChange={setSubline} multiline  />
      <SelectField label="Bildformat" value={aspectRatio} options={['16/9', '4/3', '1/1']} onChange={setAspectRatio} />
      {slides.map((slide, i) => (
        <div key={i} className="border rounded-lg p-3 space-y-3 relative">
          <button type="button" onClick={() => removeSlide(i)} className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-xs">×</button>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <ImageUploadField label="Bild vorher" value={slide.imageBefore} onChange={(v) => updateSlide(i, 'imageBefore', v)} />
              <Field label="Label vorher" value={slide.labelBefore} onChange={(v) => updateSlide(i, 'labelBefore', v)} />
            </div>
            <div>
              <ImageUploadField label="Bild nachher" value={slide.imageAfter} onChange={(v) => updateSlide(i, 'imageAfter', v)} />
              <Field label="Label nachher" value={slide.labelAfter} onChange={(v) => updateSlide(i, 'labelAfter', v)} />
            </div>
          </div>
          <Field label={fieldLabel('caption')} value={slide.caption} onChange={(v) => updateSlide(i, 'caption', v)} />
        </div>
      ))}
      <button type="button" onClick={addSlide} className="text-sm text-blue-600 hover:underline">+ Vergleich hinzufügen</button>
    </div>
  );
}

function HorizontalScrollShowcaseEditor({ data, onChange }: EditorProps) {
  const [headline, setHeadline] = useState((data.headline as string) || '');
  const [subline, setSubline] = useState((data.subline as string) || '');
  const [panelHeight, setPanelHeight] = useState((data.panelHeight as string) || 'full');
  const [panels, setPanels] = useState<{ image: string; title: string; text: string; ctaLabel: string; ctaHref: string; overlayColor: string }[]>(
    ((data.panels as any[]) || []).map((panel) => ({
      image: panel.image || '',
      title: panel.title || '',
      text: panel.text || '',
      ctaLabel: panel.ctaLabel || '',
      ctaHref: panel.ctaHref || '',
      overlayColor: panel.overlayColor || 'rgba(0,0,0,0.4)',
    }))
  );
  useReport({ headline, subline, panels, panelHeight }, onChange);
  function addPanel() { setPanels([...panels, { image: '', title: '', text: '', ctaLabel: '', ctaHref: '', overlayColor: 'rgba(0,0,0,0.4)' }]); }
  function removePanel(i: number) { setPanels(panels.filter((_, idx) => idx !== i)); }
  function updatePanel(i: number, field: string, value: string) { setPanels(panels.map((panel, idx) => idx === i ? { ...panel, [field]: value } : panel)); }
  return (
    <div className="space-y-4">
      <Field label={fieldLabel('headline')} value={headline} onChange={setHeadline}  />
      <Field label={fieldLabel('subline')} value={subline} onChange={setSubline} multiline  />
      <SelectField label="Panel-Höhe" value={panelHeight} options={['full', 'compact']} onChange={setPanelHeight} />
      {panels.map((panel, i) => (
        <div key={i} className="border rounded-lg p-3 space-y-2 relative">
          <button type="button" onClick={() => removePanel(i)} className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-xs">×</button>
          <ImageUploadField label={fieldLabel('image')} value={panel.image} onChange={(v) => updatePanel(i, 'image', v)} />
          <Field label={fieldLabel('title')} value={panel.title} onChange={(v) => updatePanel(i, 'title', v)} />
          <Field label={fieldLabel('text')} value={panel.text} onChange={(v) => updatePanel(i, 'text', v)} multiline />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Field label={fieldLabel('ctaLabel')} value={panel.ctaLabel} onChange={(v) => updatePanel(i, 'ctaLabel', v)} />
            <Field label={fieldLabel('ctaHref')} value={panel.ctaHref} onChange={(v) => updatePanel(i, 'ctaHref', v)} />
          </div>
          <ColorField label="Overlay-Farbe" value={panel.overlayColor} onChange={(v) => updatePanel(i, 'overlayColor', v)} alpha="always" />
        </div>
      ))}
      <button type="button" onClick={addPanel} className="text-sm text-blue-600 hover:underline">+ Panel hinzufügen</button>
    </div>
  );
}

function CinematicHeroEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({
    eyebrow: (data.eyebrow as string) || '',
    headline: (data.headline as string) || '',
    subline: (data.subline as string) || '',
    image: (data.image as string) || '',
    videoUrl: (data.videoUrl as string) || '',
    overlay: (data.overlay as string) || 'rgba(0,0,0,0.52)',
    align: (data.align as string) || 'left',
    primaryCta: (data.primaryCta as { label: string; href: string }) || { label: '', href: '' },
    secondaryCta: (data.secondaryCta as { label: string; href: string }) || { label: '', href: '' },
    facts: (((data.facts as any[]) || []) as any[]).map((fact) => ({ value: fact.value || '', label: fact.label || '' })),
  });
  useReport(d as unknown as Record<string, unknown>, onChange);
  function addFact() { setD({ ...d, facts: [...d.facts, { value: '', label: '' }] }); }
  function removeFact(i: number) { setD({ ...d, facts: d.facts.filter((_, idx) => idx !== i) }); }
  function updateFact(i: number, field: 'value' | 'label', value: string) {
    setD({ ...d, facts: d.facts.map((fact, idx) => idx === i ? { ...fact, [field]: value } : fact) });
  }
  return (
    <div className="space-y-4">
      <Field label="Eyebrow / Badge" value={d.eyebrow} onChange={(v) => setD({ ...d, eyebrow: v })} />
      <Field label={fieldLabel('headline')} value={d.headline} onChange={(v) => setD({ ...d, headline: v })} />
      <Field label={fieldLabel('subline')} value={d.subline} onChange={(v) => setD({ ...d, subline: v })} multiline />
      <ImageUploadField label="Hero-Bild" value={d.image} onChange={(v) => setD({ ...d, image: v })} />
      <Field label="Video-URL optional" value={d.videoUrl} onChange={(v) => setD({ ...d, videoUrl: v })} placeholder="https://..." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <ColorField label={fieldLabel('overlay')} value={d.overlay} onChange={(v) => setD({ ...d, overlay: v })} alpha="always" />
        <SelectField label="Textausrichtung" value={d.align} options={['left', 'center']} onChange={(v) => setD({ ...d, align: v })} />
      </div>
      <ButtonField label="Primärer CTA" value={d.primaryCta} onChange={(v) => setD({ ...d, primaryCta: v })} />
      <ButtonField label="Sekundärer CTA" value={d.secondaryCta} onChange={(v) => setD({ ...d, secondaryCta: v })} />
      <div className="space-y-3">
        <div className="text-xs font-semibold text-zinc-600">Faktenleiste</div>
        {d.facts.map((fact, i) => (
          <div key={i} className="relative rounded-lg border p-3">
            <button type="button" onClick={() => removeFact(i)} className="absolute right-2 top-2 text-xs text-red-400 hover:text-red-600">×</button>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Field label={fieldLabel('value')} value={fact.value} onChange={(v) => updateFact(i, 'value', v)} />
              <Field label={fieldLabel('label')} value={fact.label} onChange={(v) => updateFact(i, 'label', v)} />
            </div>
          </div>
        ))}
        <button type="button" onClick={addFact} className="text-sm text-blue-600 hover:underline">+ Fakt hinzufügen</button>
      </div>
    </div>
  );
}

function SpotlightCardsEditor({ data, onChange }: EditorProps) {
  const [badge, setBadge] = useState((data.badge as string) || '');
  const [headline, setHeadline] = useState((data.headline as string) || '');
  const [subline, setSubline] = useState((data.subline as string) || '');
  const [cards, setCards] = useState<{ title: string; text: string; icon: string; image: string; href: string }[]>(
    ((data.cards as any[]) || []).map((card) => ({ title: card.title || '', text: card.text || '', icon: card.icon || '', image: card.image || '', href: card.href || '' }))
  );
  useReport({ badge, headline, subline, cards }, onChange);
  function addCard() { setCards([...cards, { title: '', text: '', icon: '', image: '', href: '' }]); }
  function removeCard(i: number) { setCards(cards.filter((_, idx) => idx !== i)); }
  function updateCard(i: number, field: string, value: string) {
    setCards(cards.map((card, idx) => idx === i ? { ...card, [field]: value } : card));
  }
  return (
    <div className="space-y-4">
      <Field label={fieldLabel('badge')} value={badge} onChange={setBadge}  />
      <Field label={fieldLabel('headline')} value={headline} onChange={setHeadline}  />
      <Field label={fieldLabel('subline')} value={subline} onChange={setSubline} multiline  />
      {cards.map((card, i) => (
        <div key={i} className="relative rounded-lg border p-3 space-y-2">
          <button type="button" onClick={() => removeCard(i)} className="absolute right-2 top-2 text-xs text-red-400 hover:text-red-600">×</button>
          <Field label={fieldLabel('title')} value={card.title} onChange={(v) => updateCard(i, 'title', v)} />
          <Field label={fieldLabel('text')} value={card.text} onChange={(v) => updateCard(i, 'text', v)} multiline />
          <IconPickerField label={fieldLabel('icon')} value={card.icon} onChange={(v) => updateCard(i, 'icon', v)} />
          <ImageUploadField label="Bild optional" value={card.image} onChange={(v) => updateCard(i, 'image', v)} />
          <Field label="Link optional" value={card.href} onChange={(v) => updateCard(i, 'href', v)} />
        </div>
      ))}
      <button type="button" onClick={addCard} className="text-sm text-blue-600 hover:underline">+ Karte hinzufügen</button>
    </div>
  );
}

function ScrollStoryEditor({ data, onChange }: EditorProps) {
  const [headline, setHeadline] = useState((data.headline as string) || '');
  const [subline, setSubline] = useState((data.subline as string) || '');
  const [steps, setSteps] = useState<{ kicker: string; title: string; text: string; image: string }[]>(
    ((data.steps as any[]) || []).map((step) => ({ kicker: step.kicker || '', title: step.title || '', text: step.text || '', image: step.image || '' }))
  );
  useReport({ headline, subline, steps }, onChange);
  function addStep() { setSteps([...steps, { kicker: '', title: '', text: '', image: '' }]); }
  function removeStep(i: number) { setSteps(steps.filter((_, idx) => idx !== i)); }
  function updateStep(i: number, field: string, value: string) {
    setSteps(steps.map((step, idx) => idx === i ? { ...step, [field]: value } : step));
  }
  return (
    <div className="space-y-4">
      <Field label={fieldLabel('headline')} value={headline} onChange={setHeadline}  />
      <Field label={fieldLabel('subline')} value={subline} onChange={setSubline} multiline  />
      {steps.map((step, i) => (
        <div key={i} className="relative rounded-lg border p-3 space-y-2">
          <button type="button" onClick={() => removeStep(i)} className="absolute right-2 top-2 text-xs text-red-400 hover:text-red-600">×</button>
          <Field label={fieldLabel('kicker')} value={step.kicker} onChange={(v) => updateStep(i, 'kicker', v)} placeholder="01 / Analyse / Woche 1" />
          <Field label={fieldLabel('title')} value={step.title} onChange={(v) => updateStep(i, 'title', v)} />
          <Field label={fieldLabel('text')} value={step.text} onChange={(v) => updateStep(i, 'text', v)} multiline />
          <ImageUploadField label={fieldLabel('image')} value={step.image} onChange={(v) => updateStep(i, 'image', v)} />
        </div>
      ))}
      <button type="button" onClick={addStep} className="text-sm text-blue-600 hover:underline">+ Story-Schritt hinzufügen</button>
    </div>
  );
}

function PremiumComparisonEditor({ data, onChange }: EditorProps) {
  const [badge, setBadge] = useState((data.badge as string) || '');
  const [headline, setHeadline] = useState((data.headline as string) || '');
  const [subline, setSubline] = useState((data.subline as string) || '');
  const [highlightCol, setHighlightCol] = useState(Number(data.highlightCol ?? 1));
  const [columns, setColumns] = useState<{ label: string; note: string }[]>(
    ((data.columns as any[]) || []).map((col) => ({ label: col.label || '', note: col.note || '' }))
  );
  const [rows, setRows] = useState<{ feature: string; values: string[] }[]>(
    ((data.rows as any[]) || []).map((row) => ({ feature: row.feature || '', values: Array.isArray(row.values) ? row.values.map(String) : [] }))
  );
  useReport({ badge, headline, subline, columns, rows, highlightCol }, onChange);
  function addColumn() {
    setColumns([...columns, { label: '', note: '' }]);
    setRows(rows.map((row) => ({ ...row, values: [...row.values, ''] })));
  }
  function removeColumn(i: number) {
    setColumns(columns.filter((_, idx) => idx !== i));
    setRows(rows.map((row) => ({ ...row, values: row.values.filter((_, idx) => idx !== i) })));
  }
  function updateColumn(i: number, field: string, value: string) {
    setColumns(columns.map((col, idx) => idx === i ? { ...col, [field]: value } : col));
  }
  function addRow() { setRows([...rows, { feature: '', values: columns.map(() => '') }]); }
  function removeRow(i: number) { setRows(rows.filter((_, idx) => idx !== i)); }
  function updateRow(i: number, field: string, value: string) {
    setRows(rows.map((row, idx) => idx === i ? { ...row, [field]: value } : row));
  }
  function updateValue(rowIndex: number, colIndex: number, value: string) {
    setRows(rows.map((row, idx) => idx === rowIndex ? { ...row, values: row.values.map((current, ci) => ci === colIndex ? value : current) } : row));
  }
  return (
    <div className="space-y-4">
      <Field label={fieldLabel('badge')} value={badge} onChange={setBadge}  />
      <Field label={fieldLabel('headline')} value={headline} onChange={setHeadline}  />
      <Field label={fieldLabel('subline')} value={subline} onChange={setSubline} multiline  />
      <label className="block text-sm">
        <span className="text-gray-600 text-xs">Highlight-Spalte (0-basiert)</span>
        <input className="admin-input mt-1 w-full" type="number" min={0} value={highlightCol} onChange={(e) => setHighlightCol(Number(e.target.value))} />
      </label>
      <div className="space-y-3">
        <div className="text-xs font-semibold text-zinc-600">Spalten</div>
        {columns.map((column, i) => (
          <div key={i} className="relative rounded-lg border p-3">
            <button type="button" onClick={() => removeColumn(i)} className="absolute right-2 top-2 text-xs text-red-400 hover:text-red-600">×</button>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Field label={fieldLabel('label')} value={column.label} onChange={(v) => updateColumn(i, 'label', v)} />
              <Field label="Notiz" value={column.note} onChange={(v) => updateColumn(i, 'note', v)} />
            </div>
          </div>
        ))}
        <button type="button" onClick={addColumn} className="text-sm text-blue-600 hover:underline">+ Spalte hinzufügen</button>
      </div>
      <div className="space-y-3">
        <div className="text-xs font-semibold text-zinc-600">Zeilen</div>
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="relative rounded-lg border p-3 space-y-2">
            <button type="button" onClick={() => removeRow(rowIndex)} className="absolute right-2 top-2 text-xs text-red-400 hover:text-red-600">×</button>
            <Field label={fieldLabel('feature')} value={row.feature} onChange={(v) => updateRow(rowIndex, 'feature', v)} />
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              {columns.map((column, colIndex) => (
                <Field key={colIndex} label={column.label || `Spalte ${colIndex + 1}`} value={row.values[colIndex] || ''} onChange={(v) => updateValue(rowIndex, colIndex, v)} placeholder="true, false oder Text" />
              ))}
            </div>
          </div>
        ))}
        <button type="button" onClick={addRow} className="text-sm text-blue-600 hover:underline">+ Zeile hinzufügen</button>
      </div>
    </div>
  );
}

function ImmersiveCtaBannerEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({
    badge: (data.badge as string) || '',
    headline: (data.headline as string) || '',
    subline: (data.subline as string) || '',
    image: (data.image as string) || '',
    overlay: (data.overlay as string) || 'rgba(0,0,0,0.62)',
    primaryCta: (data.primaryCta as { label: string; href: string }) || { label: '', href: '' },
    secondaryCta: (data.secondaryCta as { label: string; href: string }) || { label: '', href: '' },
    metrics: ((data.metrics as any[]) || []).map(item => ({ value: item.value || '', label: item.label || '' })),
  });
  useReport(d as unknown as Record<string, unknown>, onChange);
  return (
    <div className="space-y-4">
      <Field label={fieldLabel('badge')} value={d.badge} onChange={(v) => setD({ ...d, badge: v })} />
      <Field label={fieldLabel('headline')} value={d.headline} onChange={(v) => setD({ ...d, headline: v })} />
      <Field label={fieldLabel('subline')} value={d.subline} onChange={(v) => setD({ ...d, subline: v })} multiline />
      <ImageUploadField label="Hintergrundbild" value={d.image} onChange={(v) => setD({ ...d, image: v })} />
      <ColorField label={fieldLabel('overlay')} value={d.overlay} onChange={(v) => setD({ ...d, overlay: v })} alpha="always" />
      <ButtonField label="Primärer CTA" value={d.primaryCta} onChange={(v) => setD({ ...d, primaryCta: v })} />
      <ButtonField label="Sekundärer CTA" value={d.secondaryCta} onChange={(v) => setD({ ...d, secondaryCta: v })} />
      <SimplePairs title="Kennzahlen" items={d.metrics} onAdd={() => setD({ ...d, metrics: [...d.metrics, { value: '', label: '' }] })} onRemove={(i) => setD({ ...d, metrics: d.metrics.filter((_, idx) => idx !== i) })} onChange={(i, next) => setD({ ...d, metrics: d.metrics.map((item, idx) => idx === i ? next : item) })} firstLabel="Wert" secondLabel="Label" />
    </div>
  );
}

function ProofWallEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({
    badge: (data.badge as string) || '',
    headline: (data.headline as string) || '',
    subline: (data.subline as string) || '',
    proofs: ((data.proofs as any[]) || []).map(item => ({ value: item.value || '', label: item.label || '', note: item.note || '' })),
    reviews: ((data.reviews as any[]) || []).map(item => ({ quote: item.quote || '', name: item.name || '', context: item.context || '', rating: String(item.rating || 5) })),
    logos: ((data.logos as any[]) || []).map(item => ({ name: item.name || '', image: item.image || '' })),
  });
  useReport({ ...d, reviews: d.reviews.map(review => ({ ...review, rating: Number(review.rating) || 5 })) }, onChange);
  return (
    <div className="space-y-4">
      <Field label={fieldLabel('badge')} value={d.badge} onChange={(v) => setD({ ...d, badge: v })} />
      <Field label={fieldLabel('headline')} value={d.headline} onChange={(v) => setD({ ...d, headline: v })} />
      <Field label={fieldLabel('subline')} value={d.subline} onChange={(v) => setD({ ...d, subline: v })} multiline />
      <ProofList title="Proofs" items={d.proofs} onChange={(items) => setD({ ...d, proofs: items })} />
      <ReviewList title="Bewertungen" items={d.reviews} onChange={(items) => setD({ ...d, reviews: items })} />
      <LogoList title="Logos/Zertifikate" items={d.logos} onChange={(items) => setD({ ...d, logos: items })} />
    </div>
  );
}

function EditorialFeatureRailEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({
    badge: (data.badge as string) || '',
    headline: (data.headline as string) || '',
    subline: (data.subline as string) || '',
    items: ((data.items as any[]) || []).map(item => ({ kicker: item.kicker || '', title: item.title || '', text: item.text || '', image: item.image || '', ctaLabel: item.ctaLabel || '', ctaHref: item.ctaHref || '' })),
  });
  useReport(d as unknown as Record<string, unknown>, onChange);
  return (
    <div className="space-y-4">
      <Field label={fieldLabel('badge')} value={d.badge} onChange={(v) => setD({ ...d, badge: v })} />
      <Field label={fieldLabel('headline')} value={d.headline} onChange={(v) => setD({ ...d, headline: v })} />
      <Field label={fieldLabel('subline')} value={d.subline} onChange={(v) => setD({ ...d, subline: v })} multiline />
      <RailItems items={d.items} onChange={(items) => setD({ ...d, items })} />
    </div>
  );
}

function OfferCampaignStripEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({
    badge: (data.badge as string) || '',
    headline: (data.headline as string) || '',
    subline: (data.subline as string) || '',
    image: (data.image as string) || '',
    offerLabel: (data.offerLabel as string) || '',
    deadline: (data.deadline as string) || '',
    benefitsText: Array.isArray(data.benefits) ? (data.benefits as string[]).join('\n') : '',
    cta: (data.cta as { label: string; href: string }) || { label: '', href: '' },
  });
  useReport({ ...d, benefits: d.benefitsText.split('\n').map(v => v.trim()).filter(Boolean), benefitsText: undefined }, onChange);
  return (
    <div className="space-y-4">
      <Field label={fieldLabel('badge')} value={d.badge} onChange={(v) => setD({ ...d, badge: v })} />
      <Field label={fieldLabel('headline')} value={d.headline} onChange={(v) => setD({ ...d, headline: v })} />
      <Field label={fieldLabel('subline')} value={d.subline} onChange={(v) => setD({ ...d, subline: v })} multiline />
      <ImageUploadField label={fieldLabel('image')} value={d.image} onChange={(v) => setD({ ...d, image: v })} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><Field label="Angebotslabel" value={d.offerLabel} onChange={(v) => setD({ ...d, offerLabel: v })} /><Field label="Deadline" value={d.deadline} onChange={(v) => setD({ ...d, deadline: v })} /></div>
      <Field label="Benefits (eine Zeile pro Punkt)" value={d.benefitsText} onChange={(v) => setD({ ...d, benefitsText: v })} multiline />
      <ButtonField label="CTA" value={d.cta} onChange={(v) => setD({ ...d, cta: v })} />
    </div>
  );
}

function BeforeAfterStoryProEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({
    badge: (data.badge as string) || '',
    headline: (data.headline as string) || '',
    problem: (data.problem as string) || '',
    solution: (data.solution as string) || '',
    result: (data.result as string) || '',
    beforeImage: (data.beforeImage as string) || '',
    afterImage: (data.afterImage as string) || '',
    cta: (data.cta as { label: string; href: string }) || { label: '', href: '' },
    points: ((data.points as any[]) || []).map(item => ({ value: item.value || '', label: item.label || '' })),
  });
  useReport(d as unknown as Record<string, unknown>, onChange);
  return (
    <div className="space-y-4">
      <Field label={fieldLabel('badge')} value={d.badge} onChange={(v) => setD({ ...d, badge: v })} />
      <Field label={fieldLabel('headline')} value={d.headline} onChange={(v) => setD({ ...d, headline: v })} />
      <Field label="Ausgangslage" value={d.problem} onChange={(v) => setD({ ...d, problem: v })} multiline />
      <Field label="Lösung" value={d.solution} onChange={(v) => setD({ ...d, solution: v })} multiline />
      <Field label="Ergebnis" value={d.result} onChange={(v) => setD({ ...d, result: v })} multiline />
      <ImageUploadField label="Vorher-Bild" value={d.beforeImage} onChange={(v) => setD({ ...d, beforeImage: v })} />
      <ImageUploadField label="Nachher-Bild" value={d.afterImage} onChange={(v) => setD({ ...d, afterImage: v })} />
      <ButtonField label="CTA" value={d.cta} onChange={(v) => setD({ ...d, cta: v })} />
      <SimplePairs title="Ergebnis-Kennzahlen" items={d.points} onAdd={() => setD({ ...d, points: [...d.points, { value: '', label: '' }] })} onRemove={(i) => setD({ ...d, points: d.points.filter((_, idx) => idx !== i) })} onChange={(i, next) => setD({ ...d, points: d.points.map((item, idx) => idx === i ? next : item) })} firstLabel="Wert" secondLabel="Label" />
    </div>
  );
}

function SignatureGridEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({
    badge: (data.badge as string) || '',
    headline: (data.headline as string) || '',
    subline: (data.subline as string) || '',
    image: (data.image as string) || '',
    traits: ((data.traits as any[]) || []).map(item => ({ title: item.title || '', text: item.text || '', icon: item.icon || '' })),
    stats: ((data.stats as any[]) || []).map(item => ({ value: item.value || '', label: item.label || '' })),
  });
  useReport(d as unknown as Record<string, unknown>, onChange);
  return (
    <div className="space-y-4">
      <Field label={fieldLabel('badge')} value={d.badge} onChange={(v) => setD({ ...d, badge: v })} />
      <Field label={fieldLabel('headline')} value={d.headline} onChange={(v) => setD({ ...d, headline: v })} />
      <Field label={fieldLabel('subline')} value={d.subline} onChange={(v) => setD({ ...d, subline: v })} multiline />
      <ImageUploadField label="Signatur-Bild" value={d.image} onChange={(v) => setD({ ...d, image: v })} />
      <TraitList items={d.traits} onChange={(items) => setD({ ...d, traits: items })} />
      <SimplePairs title="Stats" items={d.stats} onAdd={() => setD({ ...d, stats: [...d.stats, { value: '', label: '' }] })} onRemove={(i) => setD({ ...d, stats: d.stats.filter((_, idx) => idx !== i) })} onChange={(i, next) => setD({ ...d, stats: d.stats.map((item, idx) => idx === i ? next : item) })} firstLabel="Wert" secondLabel="Label" />
    </div>
  );
}

type ComparisonCardsProPlanEditor = {
  name: string;
  price: string;
  note: string;
  highlighted: boolean;
  featuresText: string;
  missingText: string;
  ctaLabel: string;
  ctaHref: string;
};

function linesToList(value: string): string[] {
  return value.split('\n').map((line: string) => line.trim()).filter(Boolean);
}

function ComparisonCardsProEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({
    badge: (data.badge as string) || '',
    headline: (data.headline as string) || '',
    subline: (data.subline as string) || '',
    plans: ((data.plans as any[]) || []).map((item): ComparisonCardsProPlanEditor => ({ name: item.name || '', price: item.price || '', note: item.note || '', highlighted: Boolean(item.highlighted), featuresText: Array.isArray(item.features) ? item.features.join('\n') : '', missingText: Array.isArray(item.missing) ? item.missing.join('\n') : '', ctaLabel: item.ctaLabel || '', ctaHref: item.ctaHref || '' })),
  });
  useReport({ ...d, plans: d.plans.map((plan: ComparisonCardsProPlanEditor) => ({ name: plan.name, price: plan.price, note: plan.note, highlighted: plan.highlighted, features: linesToList(plan.featuresText), missing: linesToList(plan.missingText), ctaLabel: plan.ctaLabel, ctaHref: plan.ctaHref })) }, onChange);
  return (
    <div className="space-y-4">
      <Field label={fieldLabel('badge')} value={d.badge} onChange={(v) => setD({ ...d, badge: v })} />
      <Field label={fieldLabel('headline')} value={d.headline} onChange={(v) => setD({ ...d, headline: v })} />
      <Field label={fieldLabel('subline')} value={d.subline} onChange={(v) => setD({ ...d, subline: v })} multiline />
      <PlanList items={d.plans} onChange={(plans) => setD({ ...d, plans })} />
    </div>
  );
}

function SimplePairs({ title, items, onAdd, onRemove, onChange, firstLabel, secondLabel }: { title: string; items: { value: string; label: string }[]; onAdd: () => void; onRemove: (i: number) => void; onChange: (i: number, item: { value: string; label: string }) => void; firstLabel: string; secondLabel: string }) {
  return <div className="space-y-3"><div className="text-xs font-semibold text-zinc-600">{title}</div>{items.map((item, i) => <div key={i} className="relative rounded-lg border p-3"><button type="button" onClick={() => onRemove(i)} className="absolute right-2 top-2 text-xs text-red-400">×</button><div className="grid grid-cols-1 sm:grid-cols-2 gap-2"><Field label={firstLabel} value={item.value} onChange={(v) => onChange(i, { ...item, value: v })} /><Field label={secondLabel} value={item.label} onChange={(v) => onChange(i, { ...item, label: v })} /></div></div>)}<button type="button" onClick={onAdd} className="text-sm text-blue-600 hover:underline">+ Eintrag hinzufügen</button></div>;
}

function ProofList({ title, items, onChange }: { title: string; items: { value: string; label: string; note: string }[]; onChange: (items: { value: string; label: string; note: string }[]) => void }) {
  return <div className="space-y-3"><div className="text-xs font-semibold text-zinc-600">{title}</div>{items.map((item, i) => <div key={i} className="relative rounded-lg border p-3 space-y-2"><button type="button" onClick={() => onChange(items.filter((_, idx) => idx !== i))} className="absolute right-2 top-2 text-xs text-red-400">×</button><div className="grid grid-cols-1 sm:grid-cols-2 gap-2"><Field label={fieldLabel('value')} value={item.value} onChange={(v) => onChange(items.map((x, idx) => idx === i ? { ...x, value: v } : x))} /><Field label={fieldLabel('label')} value={item.label} onChange={(v) => onChange(items.map((x, idx) => idx === i ? { ...x, label: v } : x))} /></div><Field label="Notiz" value={item.note} onChange={(v) => onChange(items.map((x, idx) => idx === i ? { ...x, note: v } : x))} multiline /></div>)}<button type="button" onClick={() => onChange([...items, { value: '', label: '', note: '' }])} className="text-sm text-blue-600 hover:underline">+ Proof hinzufügen</button></div>;
}

function ReviewList({ title, items, onChange }: { title: string; items: { quote: string; name: string; context: string; rating: string }[]; onChange: (items: { quote: string; name: string; context: string; rating: string }[]) => void }) {
  return <div className="space-y-3"><div className="text-xs font-semibold text-zinc-600">{title}</div>{items.map((item, i) => <div key={i} className="relative rounded-lg border p-3 space-y-2"><button type="button" onClick={() => onChange(items.filter((_, idx) => idx !== i))} className="absolute right-2 top-2 text-xs text-red-400">×</button><Field label={fieldLabel('quote')} value={item.quote} onChange={(v) => onChange(items.map((x, idx) => idx === i ? { ...x, quote: v } : x))} multiline /><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2"><Field label={fieldLabel('name')} value={item.name} onChange={(v) => onChange(items.map((x, idx) => idx === i ? { ...x, name: v } : x))} /><Field label="Kontext" value={item.context} onChange={(v) => onChange(items.map((x, idx) => idx === i ? { ...x, context: v } : x))} /><Field label={fieldLabel('rating')} value={item.rating} onChange={(v) => onChange(items.map((x, idx) => idx === i ? { ...x, rating: v } : x))} /></div></div>)}<button type="button" onClick={() => onChange([...items, { quote: '', name: '', context: '', rating: '5' }])} className="text-sm text-blue-600 hover:underline">+ Bewertung hinzufügen</button></div>;
}

function LogoList({ title, items, onChange }: { title: string; items: { name: string; image: string }[]; onChange: (items: { name: string; image: string }[]) => void }) {
  return <div className="space-y-3"><div className="text-xs font-semibold text-zinc-600">{title}</div>{items.map((item, i) => <div key={i} className="relative rounded-lg border p-3 space-y-2"><button type="button" onClick={() => onChange(items.filter((_, idx) => idx !== i))} className="absolute right-2 top-2 text-xs text-red-400">×</button><Field label={fieldLabel('name')} value={item.name} onChange={(v) => onChange(items.map((x, idx) => idx === i ? { ...x, name: v } : x))} /><ImageUploadField label="Logo optional" value={item.image} onChange={(v) => onChange(items.map((x, idx) => idx === i ? { ...x, image: v } : x))} /></div>)}<button type="button" onClick={() => onChange([...items, { name: '', image: '' }])} className="text-sm text-blue-600 hover:underline">+ Logo hinzufügen</button></div>;
}

function RailItems({ items, onChange }: { items: { kicker: string; title: string; text: string; image: string; ctaLabel: string; ctaHref: string }[]; onChange: (items: { kicker: string; title: string; text: string; image: string; ctaLabel: string; ctaHref: string }[]) => void }) {
  return <div className="space-y-3"><div className="text-xs font-semibold text-zinc-600">Slides</div>{items.map((item, i) => <div key={i} className="relative rounded-lg border p-3 space-y-2"><button type="button" onClick={() => onChange(items.filter((_, idx) => idx !== i))} className="absolute right-2 top-2 text-xs text-red-400">×</button><Field label={fieldLabel('kicker')} value={item.kicker} onChange={(v) => onChange(items.map((x, idx) => idx === i ? { ...x, kicker: v } : x))} /><Field label={fieldLabel('title')} value={item.title} onChange={(v) => onChange(items.map((x, idx) => idx === i ? { ...x, title: v } : x))} /><Field label={fieldLabel('text')} value={item.text} onChange={(v) => onChange(items.map((x, idx) => idx === i ? { ...x, text: v } : x))} multiline /><ImageUploadField label={fieldLabel('image')} value={item.image} onChange={(v) => onChange(items.map((x, idx) => idx === i ? { ...x, image: v } : x))} /><div className="grid grid-cols-1 sm:grid-cols-2 gap-2"><Field label={fieldLabel('ctaLabel')} value={item.ctaLabel} onChange={(v) => onChange(items.map((x, idx) => idx === i ? { ...x, ctaLabel: v } : x))} /><Field label={fieldLabel('ctaHref')} value={item.ctaHref} onChange={(v) => onChange(items.map((x, idx) => idx === i ? { ...x, ctaHref: v } : x))} /></div></div>)}<button type="button" onClick={() => onChange([...items, { kicker: '', title: '', text: '', image: '', ctaLabel: '', ctaHref: '' }])} className="text-sm text-blue-600 hover:underline">+ Slide hinzufügen</button></div>;
}

function TraitList({ items, onChange }: { items: { title: string; text: string; icon: string }[]; onChange: (items: { title: string; text: string; icon: string }[]) => void }) {
  return <div className="space-y-3"><div className="text-xs font-semibold text-zinc-600">Merkmale</div>{items.map((item, i) => <div key={i} className="relative rounded-lg border p-3 space-y-2"><button type="button" onClick={() => onChange(items.filter((_, idx) => idx !== i))} className="absolute right-2 top-2 text-xs text-red-400">×</button><Field label={fieldLabel('title')} value={item.title} onChange={(v) => onChange(items.map((x, idx) => idx === i ? { ...x, title: v } : x))} /><Field label={fieldLabel('text')} value={item.text} onChange={(v) => onChange(items.map((x, idx) => idx === i ? { ...x, text: v } : x))} multiline /><IconPickerField label={fieldLabel('icon')} value={item.icon} onChange={(v) => onChange(items.map((x, idx) => idx === i ? { ...x, icon: v } : x))} /></div>)}<button type="button" onClick={() => onChange([...items, { title: '', text: '', icon: '' }])} className="text-sm text-blue-600 hover:underline">+ Merkmal hinzufügen</button></div>;
}

function PlanList({ items, onChange }: { items: { name: string; price: string; note: string; highlighted: boolean; featuresText: string; missingText: string; ctaLabel: string; ctaHref: string }[]; onChange: (items: { name: string; price: string; note: string; highlighted: boolean; featuresText: string; missingText: string; ctaLabel: string; ctaHref: string }[]) => void }) {
  return <div className="space-y-3"><div className="text-xs font-semibold text-zinc-600">Pakete</div>{items.map((item, i) => <div key={i} className="relative rounded-lg border p-3 space-y-2"><button type="button" onClick={() => onChange(items.filter((_, idx) => idx !== i))} className="absolute right-2 top-2 text-xs text-red-400">×</button><div className="grid grid-cols-1 sm:grid-cols-2 gap-2"><Field label={fieldLabel('name')} value={item.name} onChange={(v) => onChange(items.map((x, idx) => idx === i ? { ...x, name: v } : x))} /><Field label={fieldLabel('price')} value={item.price} onChange={(v) => onChange(items.map((x, idx) => idx === i ? { ...x, price: v } : x))} /></div><Field label="Notiz" value={item.note} onChange={(v) => onChange(items.map((x, idx) => idx === i ? { ...x, note: v } : x))} multiline /><label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={item.highlighted} onChange={(e) => onChange(items.map((x, idx) => idx === i ? { ...x, highlighted: e.target.checked } : x))} /> Empfohlen</label><Field label="Features (eine Zeile pro Punkt)" value={item.featuresText} onChange={(v) => onChange(items.map((x, idx) => idx === i ? { ...x, featuresText: v } : x))} multiline /><Field label="Nicht enthalten (eine Zeile pro Punkt)" value={item.missingText} onChange={(v) => onChange(items.map((x, idx) => idx === i ? { ...x, missingText: v } : x))} multiline /><div className="grid grid-cols-1 sm:grid-cols-2 gap-2"><Field label={fieldLabel('ctaLabel')} value={item.ctaLabel} onChange={(v) => onChange(items.map((x, idx) => idx === i ? { ...x, ctaLabel: v } : x))} /><Field label={fieldLabel('ctaHref')} value={item.ctaHref} onChange={(v) => onChange(items.map((x, idx) => idx === i ? { ...x, ctaHref: v } : x))} /></div></div>)}<button type="button" onClick={() => onChange([...items, { name: '', price: '', note: '', highlighted: false, featuresText: '', missingText: '', ctaLabel: '', ctaHref: '' }])} className="text-sm text-blue-600 hover:underline">+ Paket hinzufügen</button></div>;
}

type AdditionalLocationDraft = { name: string; address: string; phone: string; email: string; mapEmbedUrl: string; openingHours: string; ctaLabel: string; ctaHref: string };

function AdditionalLocationsEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({
    badge: (data.badge as string) || '',
    headline: (data.headline as string) || '',
    subline: (data.subline as string) || '',
    locations: ((data.locations as any[]) || []).map((item): AdditionalLocationDraft => ({
      name: item.name || '',
      address: item.address || '',
      phone: item.phone || '',
      email: item.email || item.mail || '',
      mapEmbedUrl: item.mapEmbedUrl || '',
      openingHours: item.openingHours || '',
      ctaLabel: item.ctaLabel || '',
      ctaHref: item.ctaHref || '',
    })),
  });
  useReport(d as unknown as Record<string, unknown>, onChange);
  return (
    <div className="space-y-4">
      <Field label={fieldLabel('badge')} value={d.badge} onChange={(v) => setD({ ...d, badge: v })} />
      <Field label={fieldLabel('headline')} value={d.headline} onChange={(v) => setD({ ...d, headline: v })} />
      <Field label={fieldLabel('subline')} value={d.subline} onChange={(v) => setD({ ...d, subline: v })} multiline />
      <LocationList items={d.locations} onChange={(locations) => setD({ ...d, locations })} />
    </div>
  );
}

function LocationList({ items, onChange }: { items: AdditionalLocationDraft[]; onChange: (items: AdditionalLocationDraft[]) => void }) {
  return <div className="space-y-3"><div className="text-xs font-semibold text-zinc-600">Standorte</div>{items.map((item, i) => <div key={i} className="relative rounded-lg border p-3 space-y-2"><button type="button" onClick={() => onChange(items.filter((_, idx) => idx !== i))} className="absolute right-2 top-2 text-xs text-red-400">×</button><div className="grid grid-cols-1 sm:grid-cols-2 gap-2"><Field label={fieldLabel('name')} value={item.name} onChange={(v) => onChange(items.map((x, idx) => idx === i ? { ...x, name: v } : x))} /><Field label="Telefon" value={item.phone} onChange={(v) => onChange(items.map((x, idx) => idx === i ? { ...x, phone: v } : x))} /></div><Field label="Adresse" value={item.address} onChange={(v) => onChange(items.map((x, idx) => idx === i ? { ...x, address: v } : x))} multiline /><Field label="E-Mail" value={item.email} onChange={(v) => onChange(items.map((x, idx) => idx === i ? { ...x, email: v } : x))} /><Field label="Öffnungszeiten" value={item.openingHours} onChange={(v) => onChange(items.map((x, idx) => idx === i ? { ...x, openingHours: v } : x))} multiline /><Field label="Google Maps Embed URL" value={item.mapEmbedUrl} onChange={(v) => onChange(items.map((x, idx) => idx === i ? { ...x, mapEmbedUrl: v } : x))} multiline /><div className="grid grid-cols-1 sm:grid-cols-2 gap-2"><Field label={fieldLabel('ctaLabel')} value={item.ctaLabel} onChange={(v) => onChange(items.map((x, idx) => idx === i ? { ...x, ctaLabel: v } : x))} /><Field label={fieldLabel('ctaHref')} value={item.ctaHref} onChange={(v) => onChange(items.map((x, idx) => idx === i ? { ...x, ctaHref: v } : x))} /></div></div>)}<button type="button" onClick={() => onChange([...items, { name: '', address: '', phone: '', email: '', mapEmbedUrl: '', openingHours: '', ctaLabel: '', ctaHref: '' }])} className="text-sm text-blue-600 hover:underline">+ Standort hinzufügen</button></div>;
}

const EDITORS: Record<string, React.FC<EditorProps>> = {
  hero: HeroEditor,
  faq: FaqEditor,
  ctaBand: CtaBandEditor,
  testimonials: TestimonialsEditor,
  map: MapEditor,
  ctaLinks: CtaLinksEditor,
  newsPreview: NewsPreviewEditor,
  stats: StatsEditor,
  logoCloud: LogoCloudEditor,
  galleryGrid: GalleryGridEditor,
  uspStrip: UspStripEditor,
  servicesGrid: ServicesGridEditor,
  newsGrid: NewsPreviewEditor,
  processSteps: ProcessStepsEditor,
  contact: ContactEditor,
  serviceDetail: ServiceDetailEditor,
  portfolio: PortfolioEditor,
  team: TeamEditor,
  richText: RichTextEditor,
  freeText: FreeTextEditor,
  videoEmbed: VideoEmbedEditor,
  embed: EmbedEditor,
  headerBanner: HeaderBannerEditor,
  collectionHero: CollectionHeroEditor,
  textImage: TextImageEditor,
  portfolioGallery: PortfolioGalleryEditor,
  photographerAbout: PhotographerAboutEditor,
  shootingProcess: ShootingProcessEditor,
  servicePackages: ServicePackagesEditor,
  noticeBanner: NoticeBannerEditor,
  legalContent: LegalContentEditor,
  comparisonTable: ComparisonTableEditor,
  socialProofBar: SocialProofBarEditor,
  timeline: TimelineEditor,
  statsCounter: StatsCounterEditor,
  bentoGrid: BentoGridEditor,
  testimonialMarquee: TestimonialMarqueeEditor,
  featureShowcase: FeatureShowcaseEditor,
  logoMarquee: LogoMarqueeEditor,
  verticalTimeline: VerticalTimelineEditor,
  beforeAfterSlider: BeforeAfterSliderEditor,
  horizontalScrollShowcase: HorizontalScrollShowcaseEditor,
  collectionList: CollectionListEditor,
  shopFeaturedProducts: ShopFeaturedProductsEditor,
  shopProductGrid: ShopProductGridEditor,
  shopProductDetail: ShopProductDetailEditor,
  shopCart: ShopCartEditor,
  shopCheckout: ShopCheckoutEditor,
  shopThankYou: ShopThankYouEditor,
  productShowcase: ProductShowcaseEditor,
  categoryMosaic: CategoryMosaicEditor,
  brandShowroom: BrandShowroomEditor,
  consultationBooking: ConsultationBookingEditor,
  materialGallery: MaterialGalleryEditor,
  deliveryTimeline: DeliveryTimelineEditor,
  inspirationGrid: InspirationGridEditor,
  beforeAfter: BeforeAfterEditor,
  accommodationGrid: SchemaSectionEditor,
  aftercareSteps: SchemaSectionEditor,
  agentTeam: SchemaSectionEditor,
  ambience: SchemaSectionEditor,
  amenities: SchemaSectionEditor,
  appointmentCta: SchemaSectionEditor,
  artistGrid: SchemaSectionEditor,
  artistHero: SchemaSectionEditor,
  atmosphereGallery: SchemaSectionEditor,
  bookingCta: SchemaSectionEditor,
  bookingStrip: SchemaSectionEditor,
  cafeEventCalendar: SchemaSectionEditor,
  caseResults: SchemaSectionEditor,
  certifications: SchemaSectionEditor,
  coupleStory: SchemaSectionEditor,
  dailySpecials: SchemaSectionEditor,
  destinationHighlights: SchemaSectionEditor,
  diagnostics: SchemaSectionEditor,
  doctorTeam: SchemaSectionEditor,
  downloadForms: SchemaSectionEditor,
  downloadGuides: SchemaSectionEditor,
  dresscode: SchemaSectionEditor,
  drinkMenu: SchemaSectionEditor,
  emergencyInfo: SchemaSectionEditor,
  equipmentHighlights: SchemaSectionEditor,
  eventSchedule: SchemaSectionEditor,
  eventSpaces: SchemaSectionEditor,
  events: SchemaSectionEditor,
  eventsCalendar: SchemaSectionEditor,
  experienceGrid: SchemaSectionEditor,
  expertiseGrid: SchemaSectionEditor,
  feeTable: SchemaSectionEditor,
  flashDayBanner: SchemaSectionEditor,
  foodMenu: SchemaSectionEditor,
  gallery: SchemaSectionEditor,
  giftRegistry: SchemaSectionEditor,
  hotelDining: SchemaSectionEditor,
  insuranceInfo: SchemaSectionEditor,
  location: SchemaSectionEditor,
  locationContact: SchemaSectionEditor,
  locationHighlight: SchemaSectionEditor,
  locationVibe: SchemaSectionEditor,
  marketReport: SchemaSectionEditor,
  menu: SchemaSectionEditor,
  offers: SchemaSectionEditor,
  openingHours: SchemaSectionEditor,
  packages: SchemaSectionEditor,
  patientInfo: SchemaSectionEditor,
  placesMap: SchemaSectionEditor,
  practiceAreas: SchemaSectionEditor,
  practiceGallery: SchemaSectionEditor,
  practiceTeam: SchemaSectionEditor,
  priceList: SchemaSectionEditor,
  pricingInfo: SchemaSectionEditor,
  propertySearch: SchemaSectionEditor,
  propertyShowcase: SchemaSectionEditor,
  publications: SchemaSectionEditor,
  referencesSold: SchemaSectionEditor,
  reservation: SchemaSectionEditor,
  roomShowcase: SchemaSectionEditor,
  rsvp: SchemaSectionEditor,
  seasonTeaser: SchemaSectionEditor,
  serviceMenu: SchemaSectionEditor,
  serviceOverview: SchemaSectionEditor,
  shopCategoryOverview: SchemaSectionEditor,
  sightseeingList: SchemaSectionEditor,
  signatureDishes: SchemaSectionEditor,
  styleGallery: SchemaSectionEditor,
  tattooBooking: SchemaSectionEditor,
  tattooBookingCta: SchemaSectionEditor,
  teamShowcase: SchemaSectionEditor,
  tourRoutes: SchemaSectionEditor,
  tourismContact: SchemaSectionEditor,
  travelInfo: SchemaSectionEditor,
  treatmentDetail: SchemaSectionEditor,
  valuationCta: SchemaSectionEditor,
  valuesGrid: SchemaSectionEditor,
  venueInfo: SchemaSectionEditor,
  visitorInfo: SchemaSectionEditor,
  weddingMenu: SchemaSectionEditor,
  weddingParty: SchemaSectionEditor,
  wellness: SchemaSectionEditor,
  cinematicHero: CinematicHeroEditor,
  spotlightCards: SpotlightCardsEditor,
  scrollStory: ScrollStoryEditor,
  premiumComparison: PremiumComparisonEditor,
  immersiveCtaBanner: ImmersiveCtaBannerEditor,
  proofWall: ProofWallEditor,
  editorialFeatureRail: EditorialFeatureRailEditor,
  offerCampaignStrip: OfferCampaignStripEditor,
  beforeAfterStoryPro: BeforeAfterStoryProEditor,
  signatureGrid: SignatureGridEditor,
  comparisonCardsPro: ComparisonCardsProEditor,
  additionalLocations: AdditionalLocationsEditor,
  popup: PopupEditor,
  templateAdvantage: SchemaSectionEditor,
  principlesGrid: SchemaSectionEditor,
  glowHero: SchemaSectionEditor,
  floristHero: SchemaSectionEditor,
  bouquetShowcase: ProductShowcaseEditor,
  occasionMosaic: CategoryMosaicEditor,
  weddingFloristry: BrandShowroomEditor,
  workshopBooking: ConsultationBookingEditor,
  seasonalCampaign: OfferCampaignStripEditor,
  floristMaterials: MaterialGalleryEditor,
  fitnessHero: SchemaSectionEditor,
  programGrid: ServicesGridEditor,
  courseSchedule: TimelineEditor,
  trainerProfiles: TeamEditor,
  membershipPlans: ComparisonCardsProEditor,
  trialSessionCta: ImmersiveCtaBannerEditor,
  transformationStories: BeforeAfterStoryProEditor,
  studioAmenities: BentoGridEditor,
  locationHero: CinematicHeroEditor,
  spaceShowcase: ProductShowcaseEditor,
  eventTypes: CategoryMosaicEditor,
  availabilityCta: ImmersiveCtaBannerEditor,
  locationPackages: ComparisonCardsProEditor,
  amenitiesGrid: BentoGridEditor,
  floorPlanOverview: TextImageEditor,
  galleryMoodboard: GalleryGridEditor,
  locationAccess: MapEditor,
  hostTeam: TeamEditor,
  faqGallery: SchemaSectionEditor,
  eventCalendar: SchemaSectionEditor,
};
