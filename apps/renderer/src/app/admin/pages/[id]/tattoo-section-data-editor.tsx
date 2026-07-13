'use client';

import { type Dispatch, type SetStateAction, useEffect, useRef, useState } from 'react';
import { ImageUploadField } from '@/components/image-upload-field';
import { DetailLinkField } from '@/components/button-field';
import { saveMediaRecord } from '@/app/admin/media-actions';

type EditorProps = { data: Record<string, unknown>; onChange: (data: Record<string, unknown>) => void };

export function TattooSectionDataEditor({ type, data, onChange }: { type: string; data: Record<string, unknown>; onChange: (data: Record<string, unknown>) => void }) {
  const Editor = TATTOO_EDITORS[type];
  return Editor ? <Editor data={data} onChange={onChange} /> : null;
}

export function hasTattooEditor(type: string): boolean {
  return Boolean(TATTOO_EDITORS[type]);
}

// ─── Style Gallery ───────────────────────────────────────────────
function StyleGalleryEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({ headline: str(data.headline), subline: str(data.subline), styles: arr(data.styles).map(s => ({ name: str(s.name), image: str(s.image), description: str(s.description) })) });
  useReport(d, onChange);
  return <div className="space-y-3"><Field label="Headline" value={d.headline} onChange={v => setD({ ...d, headline: v })} /><Field label="Subline" value={d.subline} onChange={v => setD({ ...d, subline: v })} multiline /><Repeater items={d.styles} addLabel="+ Stil" onAdd={() => setD({ ...d, styles: [...d.styles, { name: '', image: '', description: '' }] })} render={(item, i) => <div className="space-y-2"><Field label="Name" value={item.name} onChange={v => updateItem(d, setD, 'styles', i, { ...item, name: v })} /><ImageUploadField label="Bild" value={item.image} onChange={v => updateItem(d, setD, 'styles', i, { ...item, image: v })} /><Field label="Beschreibung" value={item.description} onChange={v => updateItem(d, setD, 'styles', i, { ...item, description: v })} /></div>} /></div>;
}

// ─── Artist Grid ─────────────────────────────────────────────────
function ArtistGridEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({ headline: str(data.headline), subline: str(data.subline), artists: arr(data.artists).map(a => ({ name: str(a.name), image: str(a.image), styles: join(a.styles), bio: str(a.bio), instagram: str(a.instagram), href: str(a.href) })) });
  useReport({ ...d, artists: d.artists.map(a => ({ ...a, styles: lines(a.styles) })) }, onChange);
  return <div className="space-y-3"><Field label="Headline" value={d.headline} onChange={v => setD({ ...d, headline: v })} /><Field label="Subline" value={d.subline} onChange={v => setD({ ...d, subline: v })} multiline /><Repeater items={d.artists} addLabel="+ Künstler" onAdd={() => setD({ ...d, artists: [...d.artists, { name: '', image: '', styles: '', bio: '', instagram: '', href: '' }] })} render={(item, i) => <div className="space-y-2"><div className="grid grid-cols-1 sm:grid-cols-2 gap-2"><Field label="Name" value={item.name} onChange={v => updateItem(d, setD, 'artists', i, { ...item, name: v })} /><Field label="Instagram" value={item.instagram} onChange={v => updateItem(d, setD, 'artists', i, { ...item, instagram: v })} /></div><ImageUploadField label="Bild" value={item.image} onChange={v => updateItem(d, setD, 'artists', i, { ...item, image: v })} /><Field label="Stile (eine pro Zeile)" value={item.styles} onChange={v => updateItem(d, setD, 'artists', i, { ...item, styles: v })} multiline /><Field label="Bio" value={item.bio} onChange={v => updateItem(d, setD, 'artists', i, { ...item, bio: v })} multiline /><DetailLinkField label="Detail-Link" value={item.href} onChange={v => updateItem(d, setD, 'artists', i, { ...item, href: v })} /></div>} /></div>;
}

// ─── Artist Hero ─────────────────────────────────────────────────
function ArtistHeroEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({ name: str(data.name), image: str(data.image), bio: str(data.bio), styles: join(data.styles), instagram: str(data.instagram), experience: str(data.experience) });
  useReport({ ...d, styles: lines(d.styles) }, onChange);
  return <div className="space-y-3"><Field label="Name" value={d.name} onChange={v => setD({ ...d, name: v })} /><ImageUploadField label="Bild" value={d.image} onChange={v => setD({ ...d, image: v })} /><Field label="Bio" value={d.bio} onChange={v => setD({ ...d, bio: v })} multiline /><Field label="Stile (eine pro Zeile)" value={d.styles} onChange={v => setD({ ...d, styles: v })} multiline /><Field label="Instagram" value={d.instagram} onChange={v => setD({ ...d, instagram: v })} /><Field label="Erfahrung" value={d.experience} onChange={v => setD({ ...d, experience: v })} /></div>;
}

// ─── Booking CTA ─────────────────────────────────────────────────
function TattooBookingCtaEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({ headline: str(data.headline), subline: str(data.subline), ctaLabel: str(data.ctaLabel), ctaHref: str(data.ctaHref), hints: join(data.hints) });
  useReport({ ...d, hints: lines(d.hints) }, onChange);
  return <div className="space-y-3"><Field label="Headline" value={d.headline} onChange={v => setD({ ...d, headline: v })} /><Field label="Subline" value={d.subline} onChange={v => setD({ ...d, subline: v })} multiline /><div className="grid grid-cols-1 sm:grid-cols-2 gap-2"><Field label="CTA Label" value={d.ctaLabel} onChange={v => setD({ ...d, ctaLabel: v })} /><DetailLinkField label="CTA Link" value={d.ctaHref} onChange={v => setD({ ...d, ctaHref: v })} /></div><Field label="Hinweise (eine pro Zeile)" value={d.hints} onChange={v => setD({ ...d, hints: v })} multiline /></div>;
}

// ─── Pricing Info ────────────────────────────────────────────────
function PricingInfoEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({ headline: str(data.headline), subline: str(data.subline), items: arr(data.items).map(i => ({ label: str(i.label), value: str(i.value), note: str(i.note) })), notes: join(data.notes) });
  useReport({ ...d, notes: lines(d.notes) }, onChange);
  return <div className="space-y-3"><Field label="Headline" value={d.headline} onChange={v => setD({ ...d, headline: v })} /><Field label="Subline" value={d.subline} onChange={v => setD({ ...d, subline: v })} multiline /><Repeater items={d.items} addLabel="+ Preisposition" onAdd={() => setD({ ...d, items: [...d.items, { label: '', value: '', note: '' }] })} render={(item, i) => <div className="space-y-2"><div className="grid grid-cols-1 sm:grid-cols-2 gap-2"><Field label="Bezeichnung" value={item.label} onChange={v => updateItem(d, setD, 'items', i, { ...item, label: v })} /><Field label="Preis/Wert" value={item.value} onChange={v => updateItem(d, setD, 'items', i, { ...item, value: v })} /></div><Field label="Hinweis" value={item.note} onChange={v => updateItem(d, setD, 'items', i, { ...item, note: v })} /></div>} /><Field label="Allgemeine Hinweise (eine pro Zeile)" value={d.notes} onChange={v => setD({ ...d, notes: v })} multiline /></div>;
}

// ─── Tattoo Booking ──────────────────────────────────────────────
function TattooBookingEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({ headline: str(data.headline), subline: str(data.subline), artists: join(data.artists) });
  useReport({ ...d, artists: lines(d.artists) }, onChange);
  return <div className="space-y-3"><Field label="Headline" value={d.headline} onChange={v => setD({ ...d, headline: v })} /><Field label="Subline" value={d.subline} onChange={v => setD({ ...d, subline: v })} multiline /><Field label="Künstler-Auswahl (eine pro Zeile)" value={d.artists} onChange={v => setD({ ...d, artists: v })} multiline /></div>;
}

// ─── Flash Day Banner ────────────────────────────────────────────
function FlashDayBannerEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({ headline: str(data.headline), date: str(data.date), description: str(data.description), ctaLabel: str(data.ctaLabel), ctaHref: str(data.ctaHref), bgColor: str(data.bgColor) || '#dc2626' });
  useReport(d, onChange);
  return <div className="space-y-3"><Field label="Headline" value={d.headline} onChange={v => setD({ ...d, headline: v })} /><Field label="Datum" value={d.date} onChange={v => setD({ ...d, date: v })} /><Field label="Beschreibung" value={d.description} onChange={v => setD({ ...d, description: v })} multiline /><div className="grid grid-cols-1 sm:grid-cols-2 gap-2"><Field label="CTA Label" value={d.ctaLabel} onChange={v => setD({ ...d, ctaLabel: v })} /><DetailLinkField label="CTA Link" value={d.ctaHref} onChange={v => setD({ ...d, ctaHref: v })} /></div><div className="flex items-center gap-2"><label className="text-xs font-medium text-zinc-600">Hintergrundfarbe</label><input type="color" className="w-8 h-8 rounded border cursor-pointer" value={d.bgColor} onChange={e => setD({ ...d, bgColor: e.target.value })} /></div></div>;
}

// ─── Aftercare Steps ─────────────────────────────────────────────
function AftercareStepsEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({ headline: str(data.headline), subline: str(data.subline), steps: arr(data.steps).map(s => ({ title: str(s.title), description: str(s.description) })) });
  useReport(d, onChange);
  return <div className="space-y-3"><Field label="Headline" value={d.headline} onChange={v => setD({ ...d, headline: v })} /><Field label="Subline" value={d.subline} onChange={v => setD({ ...d, subline: v })} multiline /><Repeater items={d.steps} addLabel="+ Schritt" onAdd={() => setD({ ...d, steps: [...d.steps, { title: '', description: '' }] })} render={(item, i) => <div className="space-y-2"><Field label="Titel" value={item.title} onChange={v => updateItem(d, setD, 'steps', i, { ...item, title: v })} /><Field label="Beschreibung" value={item.description} onChange={v => updateItem(d, setD, 'steps', i, { ...item, description: v })} multiline /></div>} /></div>;
}

const TATTOO_EDITORS: Record<string, React.FC<EditorProps>> = {
  styleGallery: StyleGalleryEditor,
  artistGrid: ArtistGridEditor,
  artistHero: ArtistHeroEditor,
  tattooBookingCta: TattooBookingCtaEditor,
  pricingInfo: PricingInfoEditor,
  tattooBooking: TattooBookingEditor,
  flashDayBanner: FlashDayBannerEditor,
  aftercareSteps: AftercareStepsEditor,
};

// Helpers
function Field({ label, value, onChange, multiline }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean }) { return <label className="block text-sm"><span className="text-gray-600 text-xs">{label}</span>{multiline ? <textarea className="admin-input mt-1 w-full" rows={3} value={value || ''} onChange={e => onChange(e.target.value)} /> : <input className="admin-input mt-1 w-full" value={value || ''} onChange={e => onChange(e.target.value)} />}</label>; }
function Repeater({ items, addLabel, onAdd, render }: { items: any[]; addLabel: string; onAdd: () => void; render: (item: any, index: number) => React.ReactNode }) { return <div className="space-y-3">{items.map((item, index) => <div key={index} className="border rounded p-3 relative">{render(item, index)}</div>)}<button type="button" className="text-sm text-blue-600" onClick={onAdd}>{addLabel}</button></div>; }
function useReport(data: Record<string, unknown>, onChange: (d: Record<string, unknown>) => void) { const isFirst = useRef(true); const serialized = JSON.stringify(data); useEffect(() => { if (isFirst.current) { isFirst.current = false; return; } onChange(JSON.parse(serialized)); }, [serialized, onChange]); }
function updateItem(d: any, setD: Dispatch<SetStateAction<any>>, key: string, index: number, value: any) { setD({ ...d, [key]: d[key].map((item: any, i: number) => i === index ? value : item) }); }
function str(value: unknown) { return (value as string) || ''; }
function arr(value: unknown): Record<string, unknown>[] { return Array.isArray(value) ? value as Record<string, unknown>[] : []; }
function join(value: unknown) { return Array.isArray(value) ? (value as string[]).join('\n') : ''; }
function lines(value: string): string[] { return (value || '').split('\n').map(s => s.trim()).filter(Boolean); }
