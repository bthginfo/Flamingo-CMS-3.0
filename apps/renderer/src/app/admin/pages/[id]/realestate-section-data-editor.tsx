'use client';

import { type Dispatch, type SetStateAction, useEffect, useRef, useState } from 'react';
import { ImageUploadField } from '@/components/image-upload-field';
import { DetailLinkField } from '@/components/button-field';
import { saveMediaRecord } from '@/app/admin/media-actions';

type EditorProps = { data: Record<string, unknown>; onChange: (data: Record<string, unknown>) => void };

export function RealestateSectionDataEditor({ type, data, onChange }: { type: string; data: Record<string, unknown>; onChange: (data: Record<string, unknown>) => void }) {
  const Editor = RE_EDITORS[type];
  return Editor ? <Editor data={data} onChange={onChange} /> : null;
}

export function hasRealestateEditor(type: string): boolean {
  return Boolean(RE_EDITORS[type]);
}

// ─── Property Showcase ───────────────────────────────────────────
function PropertyShowcaseEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({ headline: str(data.headline), subline: str(data.subline), properties: arr(data.properties).map(p => ({ title: str(p.title), image: str(p.image), price: str(p.price), size: str(p.size), rooms: str(p.rooms), location: str(p.location), badge: str(p.badge), href: str(p.href) })) });
  useReport(d, onChange);
  return <div className="space-y-3"><Field label="Headline" value={d.headline} onChange={v => setD({ ...d, headline: v })} /><Field label="Subline" value={d.subline} onChange={v => setD({ ...d, subline: v })} multiline /><Repeater items={d.properties} addLabel="+ Immobilie" onAdd={() => setD({ ...d, properties: [...d.properties, { title: '', image: '', price: '', size: '', rooms: '', location: '', badge: '', href: '' }] })} render={(item, i) => <div className="space-y-2"><Field label="Titel" value={item.title} onChange={v => updateItem(d, setD, 'properties', i, { ...item, title: v })} /><ImageUploadField label="Bild" value={item.image} onChange={v => updateItem(d, setD, 'properties', i, { ...item, image: v })} /><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2"><Field label="Preis" value={item.price} onChange={v => updateItem(d, setD, 'properties', i, { ...item, price: v })} /><Field label="Fläche" value={item.size} onChange={v => updateItem(d, setD, 'properties', i, { ...item, size: v })} /><Field label="Zimmer" value={item.rooms} onChange={v => updateItem(d, setD, 'properties', i, { ...item, rooms: v })} /></div><div className="grid grid-cols-1 sm:grid-cols-2 gap-2"><Field label="Lage" value={item.location} onChange={v => updateItem(d, setD, 'properties', i, { ...item, location: v })} /><Field label="Badge" value={item.badge} onChange={v => updateItem(d, setD, 'properties', i, { ...item, badge: v })} /></div><DetailLinkField label="Detail-Link" value={item.href} onChange={v => updateItem(d, setD, 'properties', i, { ...item, href: v })} /></div>} /></div>;
}

// ─── Property Search ─────────────────────────────────────────────
function PropertySearchEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({ headline: str(data.headline), categories: join(data.categories), bgColor: str(data.bgColor) });
  useReport({ ...d, categories: lines(d.categories) }, onChange);
  return <div className="space-y-3"><Field label="Headline" value={d.headline} onChange={v => setD({ ...d, headline: v })} /><Field label="Kategorien (eine pro Zeile, z.B. Kaufen, Mieten)" value={d.categories} onChange={v => setD({ ...d, categories: v })} multiline /><Field label="Hintergrundfarbe (optional)" value={d.bgColor} onChange={v => setD({ ...d, bgColor: v })} /></div>;
}

// ─── Market Report ───────────────────────────────────────────────
function MarketReportEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({ headline: str(data.headline), subline: str(data.subline), region: str(data.region), description: str(data.description), stats: arr(data.stats).map(s => ({ label: str(s.label), value: str(s.value), trend: str(s.trend) })) });
  useReport(d, onChange);
  return <div className="space-y-3"><Field label="Headline" value={d.headline} onChange={v => setD({ ...d, headline: v })} /><Field label="Subline" value={d.subline} onChange={v => setD({ ...d, subline: v })} /><Field label="Region" value={d.region} onChange={v => setD({ ...d, region: v })} /><Field label="Beschreibung" value={d.description} onChange={v => setD({ ...d, description: v })} multiline /><Repeater items={d.stats} addLabel="+ Statistik" onAdd={() => setD({ ...d, stats: [...d.stats, { label: '', value: '', trend: '' }] })} render={(item, i) => <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2"><Field label="Label" value={item.label} onChange={v => updateItem(d, setD, 'stats', i, { ...item, label: v })} /><Field label="Wert" value={item.value} onChange={v => updateItem(d, setD, 'stats', i, { ...item, value: v })} /><Field label="Trend (↑/↓)" value={item.trend} onChange={v => updateItem(d, setD, 'stats', i, { ...item, trend: v })} /></div>} /></div>;
}

// ─── Agent Team ──────────────────────────────────────────────────
function AgentTeamEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({ headline: str(data.headline), subline: str(data.subline), agents: arr(data.agents).map(a => ({ name: str(a.name), role: str(a.role), image: str(a.image), specialization: str(a.specialization), phone: str(a.phone), email: str(a.email), soldCount: str(a.soldCount) })) });
  useReport(d, onChange);
  return <div className="space-y-3"><Field label="Headline" value={d.headline} onChange={v => setD({ ...d, headline: v })} /><Field label="Subline" value={d.subline} onChange={v => setD({ ...d, subline: v })} multiline /><Repeater items={d.agents} addLabel="+ Makler" onAdd={() => setD({ ...d, agents: [...d.agents, { name: '', role: '', image: '', specialization: '', phone: '', email: '', soldCount: '' }] })} render={(item, i) => <div className="space-y-2"><div className="grid grid-cols-1 sm:grid-cols-2 gap-2"><Field label="Name" value={item.name} onChange={v => updateItem(d, setD, 'agents', i, { ...item, name: v })} /><Field label="Rolle" value={item.role} onChange={v => updateItem(d, setD, 'agents', i, { ...item, role: v })} /></div><ImageUploadField label="Bild" value={item.image} onChange={v => updateItem(d, setD, 'agents', i, { ...item, image: v })} /><Field label="Spezialisierung" value={item.specialization} onChange={v => updateItem(d, setD, 'agents', i, { ...item, specialization: v })} /><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2"><Field label="Telefon" value={item.phone} onChange={v => updateItem(d, setD, 'agents', i, { ...item, phone: v })} /><Field label="E-Mail" value={item.email} onChange={v => updateItem(d, setD, 'agents', i, { ...item, email: v })} /><Field label="Vermittelt" value={item.soldCount} onChange={v => updateItem(d, setD, 'agents', i, { ...item, soldCount: v })} /></div></div>} /></div>;
}

// ─── Valuation CTA ───────────────────────────────────────────────
function ValuationCtaEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({ headline: str(data.headline), subline: str(data.subline), ctaLabel: str(data.ctaLabel), ctaHref: str(data.ctaHref), bgImage: str(data.bgImage), stats: arr(data.stats).map(s => ({ label: str(s.label), value: str(s.value) })) });
  useReport(d, onChange);
  return <div className="space-y-3"><Field label="Headline" value={d.headline} onChange={v => setD({ ...d, headline: v })} /><Field label="Subline" value={d.subline} onChange={v => setD({ ...d, subline: v })} multiline /><div className="grid grid-cols-1 sm:grid-cols-2 gap-2"><Field label="CTA Label" value={d.ctaLabel} onChange={v => setD({ ...d, ctaLabel: v })} /><DetailLinkField label="CTA Link" value={d.ctaHref} onChange={v => setD({ ...d, ctaHref: v })} /></div><ImageUploadField label="Hintergrundbild" value={d.bgImage} onChange={v => setD({ ...d, bgImage: v })} /><Repeater items={d.stats} addLabel="+ Stat" onAdd={() => setD({ ...d, stats: [...d.stats, { label: '', value: '' }] })} render={(item, i) => <div className="grid grid-cols-1 sm:grid-cols-2 gap-2"><Field label="Label" value={item.label} onChange={v => updateItem(d, setD, 'stats', i, { ...item, label: v })} /><Field label="Wert" value={item.value} onChange={v => updateItem(d, setD, 'stats', i, { ...item, value: v })} /></div>} /></div>;
}

// ─── References Sold ─────────────────────────────────────────────
function ReferencesSoldEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({ headline: str(data.headline), subline: str(data.subline), totalSold: str(data.totalSold), properties: arr(data.properties).map(p => ({ title: str(p.title), image: str(p.image), location: str(p.location), soldIn: str(p.soldIn), price: str(p.price) })) });
  useReport(d, onChange);
  return <div className="space-y-3"><Field label="Headline" value={d.headline} onChange={v => setD({ ...d, headline: v })} /><Field label="Subline" value={d.subline} onChange={v => setD({ ...d, subline: v })} /><Field label="Gesamt vermittelt" value={d.totalSold} onChange={v => setD({ ...d, totalSold: v })} /><Repeater items={d.properties} addLabel="+ Referenz" onAdd={() => setD({ ...d, properties: [...d.properties, { title: '', image: '', location: '', soldIn: '', price: '' }] })} render={(item, i) => <div className="space-y-2"><Field label="Titel" value={item.title} onChange={v => updateItem(d, setD, 'properties', i, { ...item, title: v })} /><ImageUploadField label="Bild" value={item.image} onChange={v => updateItem(d, setD, 'properties', i, { ...item, image: v })} /><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2"><Field label="Lage" value={item.location} onChange={v => updateItem(d, setD, 'properties', i, { ...item, location: v })} /><Field label="Verkauft in" value={item.soldIn} onChange={v => updateItem(d, setD, 'properties', i, { ...item, soldIn: v })} /><Field label="Preis" value={item.price} onChange={v => updateItem(d, setD, 'properties', i, { ...item, price: v })} /></div></div>} /></div>;
}

// ─── Location Highlight ──────────────────────────────────────────
function LocationHighlightEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({ headline: str(data.headline), subline: str(data.subline), description: str(data.description), image: str(data.image), pois: arr(data.pois).map(p => ({ label: str(p.label), distance: str(p.distance), icon: str(p.icon) })) });
  useReport(d, onChange);
  return <div className="space-y-3"><Field label="Headline" value={d.headline} onChange={v => setD({ ...d, headline: v })} /><Field label="Subline" value={d.subline} onChange={v => setD({ ...d, subline: v })} /><Field label="Beschreibung" value={d.description} onChange={v => setD({ ...d, description: v })} multiline /><ImageUploadField label="Bild" value={d.image} onChange={v => setD({ ...d, image: v })} /><Repeater items={d.pois} addLabel="+ POI" onAdd={() => setD({ ...d, pois: [...d.pois, { label: '', distance: '', icon: '' }] })} render={(item, i) => <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2"><Field label="Name" value={item.label} onChange={v => updateItem(d, setD, 'pois', i, { ...item, label: v })} /><Field label="Entfernung" value={item.distance} onChange={v => updateItem(d, setD, 'pois', i, { ...item, distance: v })} /><Field label="Icon" value={item.icon} onChange={v => updateItem(d, setD, 'pois', i, { ...item, icon: v })} /></div>} /></div>;
}

const RE_EDITORS: Record<string, React.FC<EditorProps>> = {
  propertyShowcase: PropertyShowcaseEditor,
  propertySearch: PropertySearchEditor,
  marketReport: MarketReportEditor,
  agentTeam: AgentTeamEditor,
  valuationCta: ValuationCtaEditor,
  referencesSold: ReferencesSoldEditor,
  locationHighlight: LocationHighlightEditor,
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
