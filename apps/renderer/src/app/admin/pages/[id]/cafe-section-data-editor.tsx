'use client';

import { type Dispatch, type SetStateAction, useEffect, useRef, useState } from 'react';
import { ImageUploadField } from '@/components/image-upload-field';
import { saveMediaRecord } from '@/app/admin/media-actions';

type EditorProps = { data: Record<string, unknown>; onChange: (data: Record<string, unknown>) => void };

export function CafeSectionDataEditor({ type, data, onChange }: { type: string; data: Record<string, unknown>; onChange: (data: Record<string, unknown>) => void }) {
  const Editor = CAFE_EDITORS[type];
  return Editor ? <Editor data={data} onChange={onChange} /> : null;
}

export function hasCafeEditor(type: string): boolean {
  return Boolean(CAFE_EDITORS[type]);
}

// ─── Drink Menu ──────────────────────────────────────────────────
function DrinkMenuEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({ headline: str(data.headline), subline: str(data.subline), categories: arr(data.categories).map(c => ({ title: str(c.title), items: arrInner(c.items).map(i => ({ name: str(i.name), description: str(i.description), price: str(i.price) })) })) });
  useReport(d, onChange);
  return <div className="space-y-3"><Field label="Headline" value={d.headline} onChange={v => setD({ ...d, headline: v })} /><Field label="Subline" value={d.subline} onChange={v => setD({ ...d, subline: v })} />{d.categories.map((cat, ci) => <div key={ci} className="border rounded p-3 space-y-2"><Field label="Kategorie" value={cat.title} onChange={v => { const cats = [...d.categories]; cats[ci] = { ...cat, title: v }; setD({ ...d, categories: cats }); }} />{cat.items.map((item, ii) => <div key={ii} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pl-3 border-l-2 border-zinc-200"><Field label="Name" value={item.name} onChange={v => { const cats = [...d.categories]; const items = [...cat.items]; items[ii] = { ...item, name: v }; cats[ci] = { ...cat, items }; setD({ ...d, categories: cats }); }} /><Field label="Beschreibung" value={item.description} onChange={v => { const cats = [...d.categories]; const items = [...cat.items]; items[ii] = { ...item, description: v }; cats[ci] = { ...cat, items }; setD({ ...d, categories: cats }); }} /><Field label="Preis" value={item.price} onChange={v => { const cats = [...d.categories]; const items = [...cat.items]; items[ii] = { ...item, price: v }; cats[ci] = { ...cat, items }; setD({ ...d, categories: cats }); }} /></div>)}<button type="button" className="text-xs text-blue-600" onClick={() => { const cats = [...d.categories]; cats[ci] = { ...cat, items: [...cat.items, { name: '', description: '', price: '' }] }; setD({ ...d, categories: cats }); }}>+ Getränk</button></div>)}<button type="button" className="text-sm text-blue-600" onClick={() => setD({ ...d, categories: [...d.categories, { title: '', items: [] }] })}>+ Kategorie</button></div>;
}

// ─── Food Menu ───────────────────────────────────────────────────
function FoodMenuEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({ headline: str(data.headline), subline: str(data.subline), items: arr(data.items).map(i => ({ name: str(i.name), description: str(i.description), price: str(i.price), image: str(i.image), badge: str(i.badge) })) });
  useReport(d, onChange);
  return <div className="space-y-3"><Field label="Headline" value={d.headline} onChange={v => setD({ ...d, headline: v })} /><Field label="Subline" value={d.subline} onChange={v => setD({ ...d, subline: v })} /><Repeater items={d.items} addLabel="+ Gericht" onAdd={() => setD({ ...d, items: [...d.items, { name: '', description: '', price: '', image: '', badge: '' }] })} render={(item, i) => <div className="space-y-2"><div className="grid grid-cols-1 sm:grid-cols-2 gap-2"><Field label="Name" value={item.name} onChange={v => updateItem(d, setD, 'items', i, { ...item, name: v })} /><Field label="Preis" value={item.price} onChange={v => updateItem(d, setD, 'items', i, { ...item, price: v })} /></div><Field label="Beschreibung" value={item.description} onChange={v => updateItem(d, setD, 'items', i, { ...item, description: v })} /><ImageUploadField label="Bild" value={item.image} onChange={v => updateItem(d, setD, 'items', i, { ...item, image: v })} /><Field label="Badge (z.B. Vegan)" value={item.badge} onChange={v => updateItem(d, setD, 'items', i, { ...item, badge: v })} /></div>} /></div>;
}

// ─── Daily Specials ──────────────────────────────────────────────
function DailySpecialsEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({ headline: str(data.headline), subline: str(data.subline), specials: arr(data.specials).map(s => ({ title: str(s.title), description: str(s.description), price: str(s.price), day: str(s.day) })) });
  useReport(d, onChange);
  return <div className="space-y-3"><Field label="Headline" value={d.headline} onChange={v => setD({ ...d, headline: v })} /><Field label="Subline" value={d.subline} onChange={v => setD({ ...d, subline: v })} /><Repeater items={d.specials} addLabel="+ Tagesangebot" onAdd={() => setD({ ...d, specials: [...d.specials, { title: '', description: '', price: '', day: '' }] })} render={(item, i) => <div className="space-y-2"><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2"><Field label="Tag" value={item.day} onChange={v => updateItem(d, setD, 'specials', i, { ...item, day: v })} /><Field label="Titel" value={item.title} onChange={v => updateItem(d, setD, 'specials', i, { ...item, title: v })} /><Field label="Preis" value={item.price} onChange={v => updateItem(d, setD, 'specials', i, { ...item, price: v })} /></div><Field label="Beschreibung" value={item.description} onChange={v => updateItem(d, setD, 'specials', i, { ...item, description: v })} /></div>} /></div>;
}

// ─── Event Calendar ──────────────────────────────────────────────
function CafeEventCalendarEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({ headline: str(data.headline), subline: str(data.subline), events: arr(data.events).map(e => ({ title: str(e.title), date: str(e.date), time: str(e.time), description: str(e.description), image: str(e.image), category: str(e.category) })) });
  useReport(d, onChange);
  return <div className="space-y-3"><Field label="Headline" value={d.headline} onChange={v => setD({ ...d, headline: v })} /><Field label="Subline" value={d.subline} onChange={v => setD({ ...d, subline: v })} /><Repeater items={d.events} addLabel="+ Event" onAdd={() => setD({ ...d, events: [...d.events, { title: '', date: '', time: '', description: '', image: '', category: '' }] })} render={(item, i) => <div className="space-y-2"><div className="grid grid-cols-1 sm:grid-cols-2 gap-2"><Field label="Titel" value={item.title} onChange={v => updateItem(d, setD, 'events', i, { ...item, title: v })} /><Field label="Kategorie" value={item.category} onChange={v => updateItem(d, setD, 'events', i, { ...item, category: v })} /></div><div className="grid grid-cols-1 sm:grid-cols-2 gap-2"><Field label="Datum" value={item.date} onChange={v => updateItem(d, setD, 'events', i, { ...item, date: v })} /><Field label="Uhrzeit" value={item.time} onChange={v => updateItem(d, setD, 'events', i, { ...item, time: v })} /></div><Field label="Beschreibung" value={item.description} onChange={v => updateItem(d, setD, 'events', i, { ...item, description: v })} multiline /><ImageUploadField label="Bild" value={item.image} onChange={v => updateItem(d, setD, 'events', i, { ...item, image: v })} /></div>} /></div>;
}

// ─── Location Vibe ───────────────────────────────────────────────
function LocationVibeEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({ headline: str(data.headline), address: str(data.address), description: str(data.description), vibeText: str(data.vibeText), mapEmbed: str(data.mapEmbed), mapImage: str(data.mapImage), hours: arr(data.hours).map(h => ({ day: str(h.day), hours: str(h.hours) })) });
  useReport(d, onChange);
  return <div className="space-y-3"><Field label="Headline" value={d.headline} onChange={v => setD({ ...d, headline: v })} /><Field label="Adresse" value={d.address} onChange={v => setD({ ...d, address: v })} multiline /><Field label="Beschreibung" value={d.description} onChange={v => setD({ ...d, description: v })} multiline /><Field label="Vibe-Text" value={d.vibeText} onChange={v => setD({ ...d, vibeText: v })} multiline /><Field label="Google Maps Embed URL" value={d.mapEmbed} onChange={v => setD({ ...d, mapEmbed: v })} /><ImageUploadField label="Karten-Bild (Fallback)" value={d.mapImage} onChange={v => setD({ ...d, mapImage: v })} /><Repeater items={d.hours} addLabel="+ Öffnungszeit" onAdd={() => setD({ ...d, hours: [...d.hours, { day: '', hours: '' }] })} render={(item, i) => <div className="grid grid-cols-1 sm:grid-cols-2 gap-2"><Field label="Tag(e)" value={item.day} onChange={v => updateItem(d, setD, 'hours', i, { ...item, day: v })} /><Field label="Zeiten" value={item.hours} onChange={v => updateItem(d, setD, 'hours', i, { ...item, hours: v })} /></div>} /></div>;
}

// ─── Atmosphere Gallery ──────────────────────────────────────────
function AtmosphereGalleryEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({ headline: str(data.headline), images: arr(data.images).map(img => ({ src: str(img.src), caption: str(img.caption) })) });
  useReport(d, onChange);
  return <div className="space-y-3"><Field label="Headline" value={d.headline} onChange={v => setD({ ...d, headline: v })} /><Repeater items={d.images} addLabel="+ Bild" onAdd={() => setD({ ...d, images: [...d.images, { src: '', caption: '' }] })} render={(item, i) => <div className="space-y-2"><ImageUploadField label="Bild" value={item.src} onChange={v => updateItem(d, setD, 'images', i, { ...item, src: v })} /><Field label="Bildunterschrift" value={item.caption} onChange={v => updateItem(d, setD, 'images', i, { ...item, caption: v })} /></div>} /></div>;
}

const CAFE_EDITORS: Record<string, React.FC<EditorProps>> = {
  drinkMenu: DrinkMenuEditor,
  foodMenu: FoodMenuEditor,
  dailySpecials: DailySpecialsEditor,
  cafeEventCalendar: CafeEventCalendarEditor,
  locationVibe: LocationVibeEditor,
  atmosphereGallery: AtmosphereGalleryEditor,
};

// Helpers
function Field({ label, value, onChange, multiline }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean }) { return <label className="block text-sm"><span className="text-gray-600 text-xs">{label}</span>{multiline ? <textarea className="admin-input mt-1 w-full" rows={3} value={value || ''} onChange={e => onChange(e.target.value)} /> : <input className="admin-input mt-1 w-full" value={value || ''} onChange={e => onChange(e.target.value)} />}</label>; }
function Repeater({ items, addLabel, onAdd, render }: { items: any[]; addLabel: string; onAdd: () => void; render: (item: any, index: number) => React.ReactNode }) { return <div className="space-y-3">{items.map((item, index) => <div key={index} className="border rounded p-3 relative">{render(item, index)}</div>)}<button type="button" className="text-sm text-blue-600" onClick={onAdd}>{addLabel}</button></div>; }
function useReport(data: Record<string, unknown>, onChange: (d: Record<string, unknown>) => void) { const isFirst = useRef(true); const serialized = JSON.stringify(data); useEffect(() => { if (isFirst.current) { isFirst.current = false; return; } onChange(JSON.parse(serialized)); }, [serialized, onChange]); }
function updateItem(d: any, setD: Dispatch<SetStateAction<any>>, key: string, index: number, value: any) { setD({ ...d, [key]: d[key].map((item: any, i: number) => i === index ? value : item) }); }
function str(value: unknown) { return (value as string) || ''; }
function arr(value: unknown): Record<string, unknown>[] { return Array.isArray(value) ? value as Record<string, unknown>[] : []; }
function arrInner(value: unknown): Record<string, unknown>[] { return Array.isArray(value) ? value as Record<string, unknown>[] : []; }
function join(value: unknown) { return Array.isArray(value) ? (value as string[]).join('\n') : ''; }
function lines(value: string): string[] { return (value || '').split('\n').map(s => s.trim()).filter(Boolean); }
