'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowDown, ArrowUp, Check, CircleHelp, ImagePlus, Sparkles, Trash2, TriangleAlert } from 'lucide-react';
import { ImageUploadField, buildDeterministicUploadPath, resizeImage } from '@/components/image-upload-field';
import { ButtonField, DetailLinkField } from '@/components/button-field';
import { MediaBulkPickerButton } from '@/components/media-bulk-picker';
import { saveMediaRecord } from '@/app/admin/media-actions';
import { toast } from 'sonner';

type EditorProps = { type?: string; data: Record<string, unknown>; onChange: (data: Record<string, unknown>) => void; sectionId?: string };
type UploadedImage = { src: string; alt: string };

const META: Record<string, { label: string; description: string; requirements: string[] }> = {
  dualWave: { label: 'Dual Wave', description: 'Eine Liste steuert beide Typografie-Wellen und das zentrale Fokusbild.', requirements: ['6–12 kurze Begriffe', 'möglichst ein Bild pro Begriff', 'keine doppelte Pflege der Wellen'] },
  cinematicChapters: { label: 'Cinematic Chapters', description: 'Eine geführte Geschichte aus wenigen, klaren Kapiteln.', requirements: ['3–6 Kapitel', 'einheitliche Bildsprache', 'kurze Texte statt langer Absätze'] },
  transformationSequence: { label: 'Transformation Sequence', description: 'Zeigt eine nachvollziehbare Entwicklung vom Ausgangspunkt zum Ergebnis.', requirements: ['3–6 Zustände', 'gleiche Perspektive empfohlen', 'Kennzahlen nur mit belastbarer Grundlage'] },
  xrayReveal: { label: 'X-Ray Reveal', description: 'Zwei deckungsgleiche Bilder werden durch eine interaktive Linse verglichen.', requirements: ['identische Perspektive', 'identischer Zuschnitt', 'beide Bilder gleich groß exportieren'] },
  sceneLab: { label: 'Scene Lab', description: 'Ein Basisbild wird mit transparenten, deckungsgleichen Auswahl-Layern kombiniert.', requirements: ['festes Basisbild', 'transparente WebP/PNG-Layer', 'alle Layer im selben Format'] },
  infiniteCanvas: { label: 'Infinite Canvas', description: 'Eine große Bildsammlung wird zum räumlichen Fullscreen-Explorer.', requirements: ['10–40 hochwertige Bilder', 'kurze Titel und Alt-Texte', 'Links und Kategorien optional'] },
};

function makeId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function useReport(data: Record<string, unknown>, onChange: (data: Record<string, unknown>) => void) {
  const first = useRef(true);
  const serialized = JSON.stringify(data);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    onChange(JSON.parse(serialized));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serialized]);
}

function TextField({ label, value, onChange, placeholder, multiline }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; multiline?: boolean }) {
  return (
    <label className="block text-sm">
      <span className="text-xs font-semibold text-zinc-700">{label}</span>
      {multiline
        ? <textarea value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} rows={3} className="admin-input mt-1 w-full resize-y" />
        : <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="admin-input mt-1 w-full" />}
    </label>
  );
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: Array<{ value: string; label: string }> }) {
  return <label className="block text-sm"><span className="text-xs font-semibold text-zinc-700">{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="admin-input mt-1 w-full">{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>;
}

function EditorGroup({ title, description, children, defaultOpen = true }: { title: string; description?: string; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <details open={open} onToggle={(event) => setOpen(event.currentTarget.open)} className="group overflow-hidden rounded-xl border border-zinc-200 bg-white">
      <summary className="cursor-pointer list-none border-b border-transparent px-4 py-3 transition group-open:border-zinc-200 group-open:bg-zinc-50">
        <span className="block text-sm font-bold text-zinc-900">{title}</span>
        {description && <span className="mt-0.5 block text-[11px] leading-4 text-zinc-500">{description}</span>}
      </summary>
      <div className="space-y-4 p-4">{children}</div>
    </details>
  );
}

function ItemPanel({ label, image, children }: { label: string; image?: string; children: ReactNode }) {
  return (
    <details className="group overflow-hidden rounded-xl border border-zinc-200 bg-white">
      <summary className="flex min-h-14 cursor-pointer list-none items-center gap-3 px-3 py-2 transition hover:bg-zinc-50">
        <span className="h-10 w-12 shrink-0 overflow-hidden rounded-lg bg-zinc-100">{image && <img src={image} alt="" className="h-full w-full object-cover" />}</span>
        <span className="min-w-0 flex-1 truncate text-xs font-bold text-zinc-800">{label}</span>
        <span className="text-[11px] font-semibold text-violet-700 group-open:hidden">Bearbeiten</span>
        <span className="hidden text-[11px] font-semibold text-zinc-500 group-open:inline">Schließen</span>
      </summary>
      <div className="border-t border-zinc-200 p-3">{children}</div>
    </details>
  );
}

function Readiness({ checks }: { checks: Array<{ label: string; ok: boolean }> }) {
  const ready = checks.filter((check) => check.ok).length;
  return (
    <div className={`rounded-xl border p-4 ${ready === checks.length ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'}`}>
      <div className="flex items-center justify-between gap-3"><span className="text-xs font-bold text-zinc-900">Einrichtungsstatus</span><span className="text-[11px] font-semibold text-zinc-600">{ready} / {checks.length} erfüllt</span></div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">{checks.map((check) => <div key={check.label} className="flex items-center gap-2 text-[11px] text-zinc-700">{check.ok ? <Check size={14} className="text-emerald-600" /> : <TriangleAlert size={14} className="text-amber-600" />}<span>{check.label}</span></div>)}</div>
    </div>
  );
}

function AdvancedFrame({ type, checks, children }: { type: string; checks: Array<{ label: string; ok: boolean }>; children: ReactNode }) {
  const meta = META[type];
  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 via-white to-fuchsia-50">
        <div className="p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-2xl"><span className="inline-flex items-center gap-1.5 rounded-full bg-violet-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-violet-700"><Sparkles size={12} /> Advanced</span><h3 className="mt-3 text-lg font-black text-zinc-950">{meta.label} einrichten</h3><p className="mt-1 text-xs leading-5 text-zinc-600">{meta.description}</p></div>
            <a href={`mailto:hello@flamingomedia.online?subject=${encodeURIComponent(`${meta.label} befüllen lassen`)}`} className="rounded-full border border-violet-200 bg-white px-4 py-2.5 text-xs font-bold text-violet-700 shadow-sm transition hover:border-violet-400">Von Flamingo befüllen lassen</a>
          </div>
          <div className="mt-4 grid gap-2 border-t border-violet-100 pt-4 sm:grid-cols-3">{meta.requirements.map((requirement) => <div key={requirement} className="flex items-start gap-2 text-[11px] leading-4 text-zinc-600"><CircleHelp size={13} className="mt-0.5 shrink-0 text-violet-500" />{requirement}</div>)}</div>
          <p className="mt-3 text-[10px] text-zinc-500">Einrichtung durch Flamingo: Preis auf Anfrage. Die Section bleibt vollständig manuell bearbeitbar.</p>
        </div>
      </div>
      <Readiness checks={checks} />
      {children}
    </div>
  );
}

function ReorderButtons({ index, length, onMove, onRemove }: { index: number; length: number; onMove: (from: number, to: number) => void; onRemove: () => void }) {
  return (
    <div className="flex items-center gap-1">
      <button type="button" disabled={index === 0} onClick={() => onMove(index, index - 1)} className="grid h-8 w-8 place-items-center rounded-lg text-zinc-500 hover:bg-zinc-100 disabled:opacity-25" aria-label="Nach oben"><ArrowUp size={14} /></button>
      <button type="button" disabled={index === length - 1} onClick={() => onMove(index, index + 1)} className="grid h-8 w-8 place-items-center rounded-lg text-zinc-500 hover:bg-zinc-100 disabled:opacity-25" aria-label="Nach unten"><ArrowDown size={14} /></button>
      <button type="button" onClick={onRemove} className="grid h-8 w-8 place-items-center rounded-lg text-red-500 hover:bg-red-50" aria-label="Entfernen"><Trash2 size={14} /></button>
    </div>
  );
}

function moveItem<T>(items: T[], from: number, to: number) {
  if (to < 0 || to >= items.length) return items;
  const next = [...items];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

function BulkImageActions({ onSelect, label = 'Bilder gesammelt hinzufügen' }: { onSelect: (images: UploadedImage[]) => void; label?: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function uploadFiles(files: FileList) {
    setUploading(true);
    const candidates = Array.from(files).filter((file) => file.type.startsWith('image/') && file.type !== 'image/svg+xml');
    if (candidates.length !== files.length) toast.error('Nicht unterstützte Dateien wurden übersprungen. Erlaubt sind PNG, WebP, JPG, GIF und AVIF.');
    const toastId = toast.loading(`${candidates.length} Bild${candidates.length === 1 ? '' : 'er'} werden optimiert …`);
    try {
      const { upload } = await import('@vercel/blob/client');
      const uploaded: UploadedImage[] = [];
      let failed = 0;
      for (let offset = 0; offset < candidates.length; offset += 3) {
        const batch = candidates.slice(offset, offset + 3);
        const results = await Promise.all(batch.map(async (file) => {
          try {
            const optimized = await resizeImage(file, 1920, 0.85);
            const path = await buildDeterministicUploadPath(optimized, '.webp');
            const blob = await upload(path, optimized, { access: 'public', handleUploadUrl: '/api/upload' });
            await saveMediaRecord({ blobUrl: blob.url, pathname: blob.pathname, filename: optimized.name, mimeType: optimized.type || 'image/webp', size: optimized.size });
            return { src: blob.url, alt: file.name.replace(/\.[^.]+$/, '') } satisfies UploadedImage;
          } catch (error) {
            console.error('Advanced bulk upload failed', error);
            return null;
          }
        }));
        for (const result of results) {
          if (result) uploaded.push(result);
          else failed += 1;
        }
      }
      if (uploaded.length) onSelect(uploaded);
      if (failed) toast.warning(`${uploaded.length} Bilder eingefügt, ${failed} konnten nicht hochgeladen werden.`, { id: toastId });
      else if (uploaded.length) toast.success(`${uploaded.length} Bild${uploaded.length === 1 ? '' : 'er'} eingefügt`, { id: toastId });
      else toast.error('Es konnte kein Bild hochgeladen werden.', { id: toastId });
    } catch (error) {
      console.error('Advanced bulk upload could not start', error);
      toast.error('Bilder konnten nicht hochgeladen werden. Bitte erneut versuchen.', { id: toastId });
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-dashed border-violet-200 bg-violet-50/50 p-3">
      <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-violet-600 px-3 text-xs font-bold text-white disabled:opacity-60"><ImagePlus size={14} />{uploading ? 'Bilder werden optimiert …' : label}</button>
      <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/avif" multiple className="hidden" onChange={(event) => event.target.files && void uploadFiles(event.target.files)} />
      <span className="inline-flex items-center gap-1.5 text-xs text-zinc-600"><MediaBulkPickerButton onSelect={onSelect} /></span>
    </div>
  );
}

export function AdvancedSectionEditor(props: EditorProps) {
  switch (props.type) {
    case 'dualWave': return <DualWaveEditor {...props} />;
    case 'cinematicChapters': return <StoryEditor {...props} mode="cinematic" />;
    case 'transformationSequence': return <StoryEditor {...props} mode="transformation" />;
    case 'xrayReveal': return <XrayEditor {...props} />;
    case 'sceneLab': return <SceneLabEditor {...props} />;
    case 'infiniteCanvas': return <InfiniteCanvasEditor {...props} />;
    default: return null;
  }
}

type WaveItem = { title: string; text: string; image: string; href: string };
function DualWaveEditor({ data, onChange }: EditorProps) {
  const incoming = Array.isArray(data.items) ? (data.items as WaveItem[]).filter(Boolean) : [];
  const [value, setValue] = useState({ badge: String(data.badge || ''), headline: String(data.headline || ''), subline: String(data.subline || ''), preset: String(data.preset || 'editorial'), items: incoming.map((item) => ({ title: item.title || '', text: item.text || '', image: item.image || '', href: item.href || '' })) });
  useReport(value, onChange);
  const updateItem = (index: number, patch: Partial<WaveItem>) => setValue((current) => ({ ...current, items: current.items.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item) }));
  return <AdvancedFrame type="dualWave" checks={[{ label: 'Überschrift gesetzt', ok: Boolean(value.headline.trim()) }, { label: 'Mindestens 6 Begriffe', ok: value.items.length >= 6 }, { label: 'Alle Begriffe benannt', ok: value.items.length > 0 && value.items.every((item) => item.title.trim()) }, { label: 'Mindestens 4 Bilder', ok: value.items.filter((item) => item.image).length >= 4 }]}>
    <EditorGroup title="1. Aussage" description="Kurzer Einstieg oberhalb der interaktiven Welle."><TextField label="Dachzeile" value={value.badge} onChange={(badge) => setValue({ ...value, badge })} /><TextField label="Überschrift" value={value.headline} onChange={(headline) => setValue({ ...value, headline })} /><TextField label="Unterzeile" value={value.subline} onChange={(subline) => setValue({ ...value, subline })} multiline /></EditorGroup>
    <EditorGroup title="2. Begriffe und Bilder" description="Eine Liste genügt; die zweite Welle erzeugt Flamingo automatisch.">
      <BulkImageActions onSelect={(images) => setValue((current) => ({ ...current, items: [...current.items, ...images.map((image) => ({ title: image.alt, text: '', image: image.src, href: '' }))] }))} />
      {value.items.map((item, index) => <div key={index} className="rounded-xl border border-zinc-200 p-3"><div className="mb-3 flex items-center justify-between gap-3"><strong className="text-xs text-zinc-700">Eintrag {index + 1}</strong><ReorderButtons index={index} length={value.items.length} onMove={(from, to) => setValue({ ...value, items: moveItem(value.items, from, to) })} onRemove={() => setValue({ ...value, items: value.items.filter((_, itemIndex) => itemIndex !== index) })} /></div><ImageUploadField label="Fokusbild" value={item.image} onChange={(image) => updateItem(index, { image })} /><div className="mt-3 grid gap-3 sm:grid-cols-2"><TextField label="Kurzer Begriff" value={item.title} onChange={(title) => updateItem(index, { title })} /><DetailLinkField label="Link (optional)" value={item.href} onChange={(href) => updateItem(index, { href })} /></div><div className="mt-3"><TextField label="Kurztext (optional)" value={item.text} onChange={(text) => updateItem(index, { text })} multiline /></div></div>)}
      <button type="button" onClick={() => setValue({ ...value, items: [...value.items, { title: '', text: '', image: '', href: '' }] })} className="text-sm font-semibold text-violet-700">+ Eintrag hinzufügen</button>
    </EditorGroup>
    <EditorGroup title="3. Bewegungscharakter"><SelectField label="Preset" value={value.preset} onChange={(preset) => setValue({ ...value, preset })} options={[{ value: 'calm', label: 'Ruhig' }, { value: 'editorial', label: 'Editorial' }, { value: 'dynamic', label: 'Dynamisch' }]} /></EditorGroup>
  </AdvancedFrame>;
}

type StoryItem = { kicker: string; title: string; text: string; image: string; ctaLabel: string; ctaHref: string; metricValue: string; metricLabel: string };
function StoryEditor({ data, onChange, mode }: EditorProps & { mode: 'cinematic' | 'transformation' }) {
  const key = mode === 'cinematic' ? 'chapters' : 'states';
  const incoming = Array.isArray(data[key]) ? (data[key] as Array<Partial<StoryItem>>).filter(Boolean) : [];
  const [value, setValue] = useState({ badge: String(data.badge || ''), headline: String(data.headline || ''), subline: String(data.subline || data.intro || ''), transition: String(data.transition || 'crossfade'), cta: (data.cta as { label: string; href: string }) || { label: '', href: '' }, items: incoming.map((item) => ({ kicker: item.kicker || '', title: item.title || '', text: item.text || '', image: item.image || '', ctaLabel: item.ctaLabel || '', ctaHref: item.ctaHref || '', metricValue: item.metricValue || '', metricLabel: item.metricLabel || '' })) });
  const report = mode === 'cinematic' ? { badge: value.badge, headline: value.headline, intro: value.subline, transition: value.transition, chapters: value.items.map(({ metricValue, metricLabel, ...item }) => item) } : { badge: value.badge, headline: value.headline, subline: value.subline, states: value.items.map(({ ctaLabel, ctaHref, ...item }) => item), cta: value.cta };
  useReport(report, onChange);
  const updateItem = (index: number, patch: Partial<StoryItem>) => setValue((current) => ({ ...current, items: current.items.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item) }));
  const type = mode === 'cinematic' ? 'cinematicChapters' : 'transformationSequence';
  return <AdvancedFrame type={type} checks={[{ label: 'Überschrift gesetzt', ok: Boolean(value.headline.trim()) }, { label: '3 bis 6 Kapitel/Zustände', ok: value.items.length >= 3 && value.items.length <= 6 }, { label: 'Alle Titel gesetzt', ok: value.items.length > 0 && value.items.every((item) => item.title.trim()) }, { label: 'Alle Medien gesetzt', ok: value.items.length > 0 && value.items.every((item) => item.image) }]}>
    <EditorGroup title="1. Rahmen"><TextField label="Dachzeile" value={value.badge} onChange={(badge) => setValue({ ...value, badge })} /><TextField label="Überschrift" value={value.headline} onChange={(headline) => setValue({ ...value, headline })} /><TextField label="Einleitung" value={value.subline} onChange={(subline) => setValue({ ...value, subline })} multiline /></EditorGroup>
    <EditorGroup title={`2. ${mode === 'cinematic' ? 'Kapitel' : 'Zustände'}`} description="Die Reihenfolge entspricht der späteren Scroll-Reihenfolge.">
      <BulkImageActions label={`Bilder als neue ${mode === 'cinematic' ? 'Kapitel' : 'Zustände'} hinzufügen`} onSelect={(images) => setValue((current) => ({ ...current, items: [...current.items, ...images.map((image, index) => ({ kicker: `${mode === 'cinematic' ? 'Kapitel' : 'Phase'} ${current.items.length + index + 1}`, title: image.alt, text: '', image: image.src, ctaLabel: '', ctaHref: '', metricValue: '', metricLabel: '' }))] }))} />
      {value.items.map((item, index) => <div key={index} className="rounded-xl border border-zinc-200 p-3"><div className="mb-3 flex items-center justify-between gap-3"><strong className="text-xs text-zinc-700">{mode === 'cinematic' ? 'Kapitel' : 'Zustand'} {index + 1}</strong><ReorderButtons index={index} length={value.items.length} onMove={(from, to) => setValue({ ...value, items: moveItem(value.items, from, to) })} onRemove={() => setValue({ ...value, items: value.items.filter((_, itemIndex) => itemIndex !== index) })} /></div><ImageUploadField label="Szenenbild" value={item.image} onChange={(image) => updateItem(index, { image })} /><div className="mt-3 grid gap-3 sm:grid-cols-2"><TextField label="Dachzeile" value={item.kicker} onChange={(kicker) => updateItem(index, { kicker })} /><TextField label="Titel" value={item.title} onChange={(title) => updateItem(index, { title })} /></div><div className="mt-3"><TextField label="Kurztext" value={item.text} onChange={(text) => updateItem(index, { text })} multiline /></div>{mode === 'cinematic' ? <div className="mt-3"><ButtonField label="Kapitel-Button (optional)" value={{ label: item.ctaLabel, href: item.ctaHref }} onChange={(cta) => updateItem(index, { ctaLabel: cta.label, ctaHref: cta.href })} /></div> : <div className="mt-3 grid gap-3 sm:grid-cols-2"><TextField label="Kennzahl (optional)" value={item.metricValue} onChange={(metricValue) => updateItem(index, { metricValue })} /><TextField label="Kennzahl-Beschriftung" value={item.metricLabel} onChange={(metricLabel) => updateItem(index, { metricLabel })} /></div>}</div>)}
      <button type="button" onClick={() => setValue({ ...value, items: [...value.items, { kicker: '', title: '', text: '', image: '', ctaLabel: '', ctaHref: '', metricValue: '', metricLabel: '' }] })} className="text-sm font-semibold text-violet-700">+ {mode === 'cinematic' ? 'Kapitel' : 'Zustand'} hinzufügen</button>
    </EditorGroup>
    <EditorGroup title="3. Darstellung">{mode === 'cinematic' ? <SelectField label="Übergang" value={value.transition} onChange={(transition) => setValue({ ...value, transition })} options={[{ value: 'crossfade', label: 'Sanfter Crossfade' }, { value: 'push', label: 'Gerichteter Push' }, { value: 'depth', label: 'Räumliche Tiefe' }]} /> : <ButtonField label="Abschluss-Button (optional)" value={value.cta} onChange={(cta) => setValue({ ...value, cta })} />}</EditorGroup>
  </AdvancedFrame>;
}

function XrayEditor({ data, onChange }: EditorProps) {
  const [value, setValue] = useState({ badge: String(data.badge || ''), headline: String(data.headline || ''), subline: String(data.subline || ''), imageBase: String(data.imageBase || ''), imageReveal: String(data.imageReveal || ''), labelBase: String(data.labelBase || 'Ansicht'), labelReveal: String(data.labelReveal || 'Dahinter'), caption: String(data.caption || ''), revealStyle: String(data.revealStyle || 'lens'), aspectRatio: String(data.aspectRatio || '16/9') });
  const [opacity, setOpacity] = useState(50);
  useReport(value, onChange);
  return <AdvancedFrame type="xrayReveal" checks={[{ label: 'Beide Bilder gesetzt', ok: Boolean(value.imageBase && value.imageReveal) }, { label: 'Beide Zustände beschriftet', ok: Boolean(value.labelBase && value.labelReveal) }, { label: 'Überschrift gesetzt', ok: Boolean(value.headline.trim()) }]}>
    <EditorGroup title="1. Aussage"><TextField label="Dachzeile" value={value.badge} onChange={(badge) => setValue({ ...value, badge })} /><TextField label="Überschrift" value={value.headline} onChange={(headline) => setValue({ ...value, headline })} /><TextField label="Erklärung" value={value.subline} onChange={(subline) => setValue({ ...value, subline })} multiline /></EditorGroup>
    <EditorGroup title="2. Deckungsgleiche Bilder" description="Exportiere beide Medien aus derselben Perspektive und mit exakt denselben Abmessungen."><div className="grid gap-4 lg:grid-cols-2"><div><ImageUploadField label="Bild A · normale Ansicht" value={value.imageBase} onChange={(imageBase) => setValue({ ...value, imageBase })} /><TextField label="Label A" value={value.labelBase} onChange={(labelBase) => setValue({ ...value, labelBase })} /></div><div><ImageUploadField label="Bild B · Reveal" value={value.imageReveal} onChange={(imageReveal) => setValue({ ...value, imageReveal })} /><TextField label="Label B" value={value.labelReveal} onChange={(labelReveal) => setValue({ ...value, labelReveal })} /></div></div>{value.imageBase && value.imageReveal && <div className="rounded-xl border border-zinc-200 bg-zinc-950 p-3"><div className="relative mx-auto aspect-video max-w-xl overflow-hidden rounded-lg"><img src={value.imageBase} alt="" className="absolute inset-0 h-full w-full object-cover" /><img src={value.imageReveal} alt="" className="absolute inset-0 h-full w-full object-cover" style={{ opacity: opacity / 100 }} /></div><label className="mx-auto mt-3 block max-w-xl text-xs text-white/80">Ausrichtung prüfen · Bild B {opacity}%<input type="range" min="0" max="100" value={opacity} onChange={(event) => setOpacity(Number(event.target.value))} className="mt-2 w-full accent-violet-500" /></label></div>}</EditorGroup>
    <EditorGroup title="3. Darstellung"><div className="grid gap-3 sm:grid-cols-2"><SelectField label="Reveal-Stil" value={value.revealStyle} onChange={(revealStyle) => setValue({ ...value, revealStyle })} options={[{ value: 'lens', label: 'Präzise Linse' }, { value: 'soft', label: 'Weiche Linse' }, { value: 'scan', label: 'Scan-Linie' }]} /><SelectField label="Bildformat" value={value.aspectRatio} onChange={(aspectRatio) => setValue({ ...value, aspectRatio })} options={[{ value: '16/9', label: '16:9' }, { value: '4/3', label: '4:3' }, { value: '1/1', label: 'Quadrat' }]} /></div><TextField label="Bildunterschrift" value={value.caption} onChange={(caption) => setValue({ ...value, caption })} multiline /></EditorGroup>
  </AdvancedFrame>;
}

type CanvasItem = { image: string; alt: string; title: string; caption: string; category: string; href: string; featured: boolean };
function InfiniteCanvasEditor({ data, onChange }: EditorProps) {
  const incoming = Array.isArray(data.items) ? (data.items as CanvasItem[]).filter(Boolean) : [];
  const [value, setValue] = useState({ badge: String(data.badge || ''), headline: String(data.headline || ''), subline: String(data.subline || ''), ctaLabel: String(data.ctaLabel || 'Galerie erkunden'), items: incoming.map((item) => ({ image: item.image || '', alt: item.alt || '', title: item.title || '', caption: item.caption || '', category: item.category || '', href: item.href || '', featured: Boolean(item.featured) })) });
  useReport(value, onChange);
  const updateItem = (index: number, patch: Partial<CanvasItem>) => setValue((current) => ({ ...current, items: current.items.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item) }));
  return <AdvancedFrame type="infiniteCanvas" checks={[{ label: 'Mindestens 10 Bilder', ok: value.items.length >= 10 }, { label: 'Alle Alt-Texte gesetzt', ok: value.items.length > 0 && value.items.every((item) => item.alt.trim()) }, { label: 'Überschrift und Button gesetzt', ok: Boolean(value.headline && value.ctaLabel) }]}>
    <EditorGroup title="1. Einstieg"><TextField label="Dachzeile" value={value.badge} onChange={(badge) => setValue({ ...value, badge })} /><TextField label="Überschrift" value={value.headline} onChange={(headline) => setValue({ ...value, headline })} /><TextField label="Unterzeile" value={value.subline} onChange={(subline) => setValue({ ...value, subline })} multiline /><TextField label="Explorer-Button" value={value.ctaLabel} onChange={(ctaLabel) => setValue({ ...value, ctaLabel })} /></EditorGroup>
    <EditorGroup title="2. Galerie" description="Position und Tiefe berechnet Flamingo automatisch. Du pflegst nur Inhalt und Gewichtung.">
      <BulkImageActions onSelect={(images) => setValue((current) => ({ ...current, items: [...current.items, ...images.map((image) => ({ image: image.src, alt: image.alt, title: image.alt, caption: '', category: '', href: '', featured: false }))] }))} />
      <div className="space-y-2">
        {value.items.map((item, index) => (
          <ItemPanel key={index} image={item.image} label={`${String(index + 1).padStart(2, '0')} · ${item.title || item.alt || 'Unbenanntes Bild'}`}>
            <div className="mb-3 flex justify-end"><ReorderButtons index={index} length={value.items.length} onMove={(from, to) => setValue({ ...value, items: moveItem(value.items, from, to) })} onRemove={() => setValue({ ...value, items: value.items.filter((_, itemIndex) => itemIndex !== index) })} /></div>
            <ImageUploadField label="Bild" value={item.image} onChange={(image) => updateItem(index, { image })} />
            <div className="mt-3 grid gap-3 sm:grid-cols-2"><TextField label="Titel" value={item.title} onChange={(title) => updateItem(index, { title })} /><TextField label="Alt-Text" value={item.alt} onChange={(alt) => updateItem(index, { alt })} /><TextField label="Kategorie (optional)" value={item.category} onChange={(category) => updateItem(index, { category })} /><DetailLinkField label="Link (optional)" value={item.href} onChange={(href) => updateItem(index, { href })} /></div>
            <div className="mt-3"><TextField label="Kurztext" value={item.caption} onChange={(caption) => updateItem(index, { caption })} multiline /></div>
            <label className="mt-3 flex items-center gap-2 text-xs font-semibold text-zinc-700"><input type="checkbox" checked={item.featured} onChange={(event) => updateItem(index, { featured: event.target.checked })} className="h-4 w-4 rounded border-zinc-300 accent-violet-600" />Größer hervorheben</label>
          </ItemPanel>
        ))}
      </div>
    </EditorGroup>
  </AdvancedFrame>;
}

type SceneChoice = { id: string; label: string; image: string; swatch: string; description: string; priceLabel: string };
type SceneGroup = { id: string; label: string; description: string; choices: SceneChoice[] };
function SceneLabEditor({ data, onChange }: EditorProps) {
  const incoming = Array.isArray(data.groups) ? (data.groups as SceneGroup[]).filter(Boolean) : [];
  const [value, setValue] = useState({ badge: String(data.badge || ''), headline: String(data.headline || ''), subline: String(data.subline || ''), baseImage: String(data.baseImage || ''), aspectRatio: String(data.aspectRatio || '4/3'), cta: (data.cta as { label: string; href: string }) || { label: '', href: '' }, groups: incoming.map((group, groupIndex) => ({ id: group.id || `group-${groupIndex + 1}`, label: group.label || '', description: group.description || '', choices: (Array.isArray(group.choices) ? group.choices : []).filter(Boolean).map((choice, choiceIndex) => ({ id: choice.id || `choice-${choiceIndex + 1}`, label: choice.label || '', image: choice.image || '', swatch: choice.swatch || '#d4d4d8', description: choice.description || '', priceLabel: choice.priceLabel || '' })) })) });
  useReport(value, onChange);
  const updateGroup = (index: number, patch: Partial<SceneGroup>) => setValue((current) => ({ ...current, groups: current.groups.map((group, groupIndex) => groupIndex === index ? { ...group, ...patch } : group) }));
  const updateChoice = (groupIndex: number, choiceIndex: number, patch: Partial<SceneChoice>) => setValue((current) => ({ ...current, groups: current.groups.map((group, index) => index === groupIndex ? { ...group, choices: group.choices.map((choice, choiceIndexValue) => choiceIndexValue === choiceIndex ? { ...choice, ...patch } : choice) } : group) }));
  const choices = value.groups.flatMap((group) => group.choices);
  return <AdvancedFrame type="sceneLab" checks={[{ label: 'Überschrift gesetzt', ok: Boolean(value.headline.trim()) }, { label: 'Basisbild gesetzt', ok: Boolean(value.baseImage) }, { label: 'Mindestens 2 Optionsgruppen', ok: value.groups.length >= 2 }, { label: 'Mindestens 2 benannte Optionen je Gruppe', ok: value.groups.length > 0 && value.groups.every((group) => group.label.trim() && group.choices.length >= 2 && group.choices.every((choice) => choice.label.trim())) }, { label: 'Alle Optionen haben einen Layer', ok: choices.length > 0 && choices.every((choice) => choice.image) }]}>
    <EditorGroup title="1. Szene"><TextField label="Dachzeile" value={value.badge} onChange={(badge) => setValue({ ...value, badge })} /><TextField label="Überschrift" value={value.headline} onChange={(headline) => setValue({ ...value, headline })} /><TextField label="Erklärung" value={value.subline} onChange={(subline) => setValue({ ...value, subline })} multiline /><ImageUploadField label="Basisbild ohne Varianten" value={value.baseImage} onChange={(baseImage) => setValue({ ...value, baseImage })} /><SelectField label="Format aller Layer" value={value.aspectRatio} onChange={(aspectRatio) => setValue({ ...value, aspectRatio })} options={[{ value: '16/9', label: '16:9' }, { value: '4/3', label: '4:3' }, { value: '1/1', label: 'Quadrat' }]} /></EditorGroup>
    <EditorGroup title="2. Optionsgruppen" description="Beispiel: Wandfarbe, Möbel, Armatur, Licht.">{value.groups.map((group, groupIndex) => <div key={group.id} className="rounded-xl border border-zinc-200 bg-zinc-50/60 p-3"><div className="mb-3 flex items-center justify-between gap-3"><strong className="text-xs text-zinc-800">Gruppe {groupIndex + 1}</strong><ReorderButtons index={groupIndex} length={value.groups.length} onMove={(from, to) => setValue({ ...value, groups: moveItem(value.groups, from, to) })} onRemove={() => setValue({ ...value, groups: value.groups.filter((_, index) => index !== groupIndex) })} /></div><div className="grid gap-3 sm:grid-cols-2"><TextField label="Gruppenname" value={group.label} onChange={(label) => updateGroup(groupIndex, { label })} /><TextField label="Kurze Hilfe" value={group.description} onChange={(description) => updateGroup(groupIndex, { description })} /></div><div className="mt-4 space-y-3"><BulkImageActions label="Layer gesammelt hinzufügen" onSelect={(images) => updateGroup(groupIndex, { choices: [...group.choices, ...images.map((image) => ({ id: makeId('choice'), label: image.alt, image: image.src, swatch: '#d4d4d8', description: '', priceLabel: '' }))] })} />{group.choices.map((choice, choiceIndex) => <div key={choice.id} className="rounded-lg border border-zinc-200 bg-white p-3"><div className="mb-2 flex items-center justify-between"><span className="text-[11px] font-bold text-zinc-600">Option {choiceIndex + 1}</span><ReorderButtons index={choiceIndex} length={group.choices.length} onMove={(from, to) => updateGroup(groupIndex, { choices: moveItem(group.choices, from, to) })} onRemove={() => updateGroup(groupIndex, { choices: group.choices.filter((_, index) => index !== choiceIndex) })} /></div><ImageUploadField label="Transparenter Layer" value={choice.image} onChange={(image) => updateChoice(groupIndex, choiceIndex, { image })} /><div className="mt-3 grid gap-3 sm:grid-cols-2"><TextField label="Name" value={choice.label} onChange={(label) => updateChoice(groupIndex, choiceIndex, { label })} /><label className="block text-sm"><span className="text-xs font-semibold text-zinc-700">Farbswatch</span><input type="color" value={choice.swatch} onChange={(event) => updateChoice(groupIndex, choiceIndex, { swatch: event.target.value })} className="mt-1 h-10 w-full rounded-lg border border-zinc-200 bg-white p-1" /></label><TextField label="Kurzbeschreibung" value={choice.description} onChange={(description) => updateChoice(groupIndex, choiceIndex, { description })} /><TextField label="Preis-/Hinweistext" value={choice.priceLabel} onChange={(priceLabel) => updateChoice(groupIndex, choiceIndex, { priceLabel })} /></div></div>)}<button type="button" onClick={() => updateGroup(groupIndex, { choices: [...group.choices, { id: makeId('choice'), label: '', image: '', swatch: '#d4d4d8', description: '', priceLabel: '' }] })} className="text-xs font-bold text-violet-700">+ Option hinzufügen</button></div></div>)}<button type="button" onClick={() => setValue({ ...value, groups: [...value.groups, { id: makeId('group'), label: '', description: '', choices: [] }] })} className="text-sm font-semibold text-violet-700">+ Optionsgruppe hinzufügen</button></EditorGroup>
    <EditorGroup title="3. Abschluss"><ButtonField label="Anfrage- oder Buchungsbutton" value={value.cta} onChange={(cta) => setValue({ ...value, cta })} /></EditorGroup>
  </AdvancedFrame>;
}
