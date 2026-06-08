'use client';

import { type Dispatch, type SetStateAction, useEffect, useRef, useState } from 'react';
import { ImageUploadField } from '@/components/image-upload-field';
import { IconPickerField } from '@/components/icon-picker-field';
import { DetailLinkField } from '@/components/button-field';
import { saveMediaRecord } from '@/app/admin/media-actions';

type EditorProps = { data: Record<string, unknown>; onChange: (data: Record<string, unknown>) => void };

export function ConsultingSectionDataEditor({ type, data, onChange }: { type: string; data: Record<string, unknown>; onChange: (data: Record<string, unknown>) => void }) {
  const Editor = CONSULTING_EDITORS[type];
  return Editor ? <Editor data={data} onChange={onChange} /> : null;
}

export function hasConsultingEditor(type: string): boolean {
  return Boolean(CONSULTING_EDITORS[type]);
}

// ─── Practice Areas ──────────────────────────────────────────────
function PracticeAreasEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({ headline: str(data.headline), subline: str(data.subline), badgeText: str(data.badgeText), areas: arr(data.areas).map(a => ({ title: str(a.title), text: str(a.text), icon: str(a.icon), href: str(a.href) })) });
  useReport(d, onChange);
  return <div className="space-y-3"><Field label="Badge" value={d.badgeText} onChange={v => setD({ ...d, badgeText: v })} /><Field label="Headline" value={d.headline} onChange={v => setD({ ...d, headline: v })} /><Field label="Subline" value={d.subline} onChange={v => setD({ ...d, subline: v })} multiline /><Repeater items={d.areas} addLabel="+ Rechtsgebiet" onAdd={() => setD({ ...d, areas: [...d.areas, { title: '', text: '', icon: '', href: '' }] })} render={(item, i) => <div className="space-y-2"><div className="grid grid-cols-1 sm:grid-cols-2 gap-2"><Field label="Titel" value={item.title} onChange={v => updateItem(d, setD, 'areas', i, { ...item, title: v })} /><IconPickerField label="Icon" value={item.icon} onChange={v => updateItem(d, setD, 'areas', i, { ...item, icon: v })} /></div><Field label="Beschreibung" value={item.text} onChange={v => updateItem(d, setD, 'areas', i, { ...item, text: v })} multiline /><DetailLinkField label="Detail-Link" value={item.href} onChange={v => updateItem(d, setD, 'areas', i, { ...item, href: v })} /></div>} /></div>;
}

// ─── Case Results ────────────────────────────────────────────────
function CaseResultsEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({ headline: str(data.headline), subline: str(data.subline), stats: arr(data.stats).map(s => ({ value: String(s.value || ''), suffix: str(s.suffix), prefix: str(s.prefix), label: str(s.label), icon: str(s.icon) })) });
  useReport({ ...d, stats: d.stats.map(s => ({ ...s, value: Number(s.value) || 0 })) }, onChange);
  return <div className="space-y-3"><Field label="Headline" value={d.headline} onChange={v => setD({ ...d, headline: v })} /><Field label="Subline" value={d.subline} onChange={v => setD({ ...d, subline: v })} multiline /><Repeater items={d.stats} addLabel="+ Statistik" onAdd={() => setD({ ...d, stats: [...d.stats, { value: '', suffix: '', prefix: '', label: '', icon: '' }] })} render={(item, i) => <div className="space-y-2"><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2"><Field label="Prefix" value={item.prefix} onChange={v => updateItem(d, setD, 'stats', i, { ...item, prefix: v })} /><Field label="Wert (Zahl)" value={item.value} onChange={v => updateItem(d, setD, 'stats', i, { ...item, value: v })} /><Field label="Suffix" value={item.suffix} onChange={v => updateItem(d, setD, 'stats', i, { ...item, suffix: v })} /></div><div className="grid grid-cols-1 sm:grid-cols-2 gap-2"><Field label="Label" value={item.label} onChange={v => updateItem(d, setD, 'stats', i, { ...item, label: v })} /><IconPickerField label="Icon" value={item.icon} onChange={v => updateItem(d, setD, 'stats', i, { ...item, icon: v })} /></div></div>} /></div>;
}

// ─── Fee Table ───────────────────────────────────────────────────
function FeeTableEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({ headline: str(data.headline), subline: str(data.subline), badgeText: str(data.badgeText), footnote: str(data.footnote), fees: arr(data.fees).map(f => ({ title: str(f.title), price: str(f.price), description: str(f.description), icon: str(f.icon), highlighted: Boolean(f.highlighted) })) });
  useReport(d, onChange);
  return <div className="space-y-3"><Field label="Badge" value={d.badgeText} onChange={v => setD({ ...d, badgeText: v })} /><Field label="Headline" value={d.headline} onChange={v => setD({ ...d, headline: v })} /><Field label="Subline" value={d.subline} onChange={v => setD({ ...d, subline: v })} /><Repeater items={d.fees} addLabel="+ Position" onAdd={() => setD({ ...d, fees: [...d.fees, { title: '', price: '', description: '', icon: '', highlighted: false }] })} render={(item, i) => <div className="space-y-2"><div className="grid grid-cols-1 sm:grid-cols-2 gap-2"><Field label="Titel" value={item.title} onChange={v => updateItem(d, setD, 'fees', i, { ...item, title: v })} /><Field label="Preis" value={item.price} onChange={v => updateItem(d, setD, 'fees', i, { ...item, price: v })} /></div><Field label="Beschreibung" value={item.description} onChange={v => updateItem(d, setD, 'fees', i, { ...item, description: v })} /><div className="grid grid-cols-1 sm:grid-cols-2 gap-2"><IconPickerField label="Icon" value={item.icon} onChange={v => updateItem(d, setD, 'fees', i, { ...item, icon: v })} /><label className="flex items-center gap-2 text-xs mt-auto"><input type="checkbox" checked={item.highlighted} onChange={e => updateItem(d, setD, 'fees', i, { ...item, highlighted: e.target.checked })} /> Hervorgehoben</label></div></div>} /><Field label="Fußnote" value={d.footnote} onChange={v => setD({ ...d, footnote: v })} multiline /></div>;
}

// ─── Publications ────────────────────────────────────────────────
function PublicationsEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({ headline: str(data.headline), subline: str(data.subline), badgeText: str(data.badgeText), ctaLabel: str(data.ctaLabel), ctaHref: str(data.ctaHref), articles: arr(data.articles).map(a => ({ title: str(a.title), excerpt: str(a.excerpt), date: str(a.date), category: str(a.category), href: str(a.href), image: str(a.image) })) });
  useReport(d, onChange);
  return <div className="space-y-3"><Field label="Badge" value={d.badgeText} onChange={v => setD({ ...d, badgeText: v })} /><Field label="Headline" value={d.headline} onChange={v => setD({ ...d, headline: v })} /><Field label="Subline" value={d.subline} onChange={v => setD({ ...d, subline: v })} /><Repeater items={d.articles} addLabel="+ Artikel" onAdd={() => setD({ ...d, articles: [...d.articles, { title: '', excerpt: '', date: '', category: '', href: '', image: '' }] })} render={(item, i) => <div className="space-y-2"><Field label="Titel" value={item.title} onChange={v => updateItem(d, setD, 'articles', i, { ...item, title: v })} /><Field label="Auszug" value={item.excerpt} onChange={v => updateItem(d, setD, 'articles', i, { ...item, excerpt: v })} multiline /><div className="grid grid-cols-1 sm:grid-cols-2 gap-2"><Field label="Datum" value={item.date} onChange={v => updateItem(d, setD, 'articles', i, { ...item, date: v })} /><Field label="Kategorie" value={item.category} onChange={v => updateItem(d, setD, 'articles', i, { ...item, category: v })} /></div><ImageUploadField label="Bild" value={item.image} onChange={v => updateItem(d, setD, 'articles', i, { ...item, image: v })} /><DetailLinkField label="Link" value={item.href} onChange={v => updateItem(d, setD, 'articles', i, { ...item, href: v })} /></div>} /><div className="grid grid-cols-1 sm:grid-cols-2 gap-2"><Field label="CTA Label" value={d.ctaLabel} onChange={v => setD({ ...d, ctaLabel: v })} /><DetailLinkField label="CTA Link" value={d.ctaHref} onChange={v => setD({ ...d, ctaHref: v })} /></div></div>;
}

const CONSULTING_EDITORS: Record<string, React.FC<EditorProps>> = {
  practiceAreas: PracticeAreasEditor,
  caseResults: CaseResultsEditor,
  feeTable: FeeTableEditor,
  publications: PublicationsEditor,
};

// Helpers
function Field({ label, value, onChange, multiline }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean }) { return <label className="block text-sm"><span className="text-gray-600 text-xs">{label}</span>{multiline ? <textarea className="admin-input mt-1 w-full" rows={3} value={value || ''} onChange={e => onChange(e.target.value)} /> : <input className="admin-input mt-1 w-full" value={value || ''} onChange={e => onChange(e.target.value)} />}</label>; }
function Repeater({ items, addLabel, onAdd, render }: { items: any[]; addLabel: string; onAdd: () => void; render: (item: any, index: number) => React.ReactNode }) { return <div className="space-y-3">{items.map((item, index) => <div key={index} className="border rounded p-3 relative"><button onClick={() => {}} className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-xs">×</button>{render(item, index)}</div>)}<button type="button" className="text-sm text-blue-600" onClick={onAdd}>{addLabel}</button></div>; }
function useReport(data: Record<string, unknown>, onChange: (d: Record<string, unknown>) => void) { const isFirst = useRef(true); const serialized = JSON.stringify(data); useEffect(() => { if (isFirst.current) { isFirst.current = false; return; } onChange(JSON.parse(serialized)); }, [serialized, onChange]); }
function updateItem(d: any, setD: Dispatch<SetStateAction<any>>, key: string, index: number, value: any) { setD({ ...d, [key]: d[key].map((item: any, i: number) => i === index ? value : item) }); }
function str(value: unknown) { return (value as string) || ''; }
function arr(value: unknown): Record<string, unknown>[] { return Array.isArray(value) ? value as Record<string, unknown>[] : []; }
function join(value: unknown) { return Array.isArray(value) ? (value as string[]).join('\n') : ''; }
function lines(value: string): string[] { return (value || '').split('\n').map(s => s.trim()).filter(Boolean); }
