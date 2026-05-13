'use client';

import { useState } from 'react';
import { Save } from 'lucide-react';

// Generic section data editor that renders a JSON editor per section type.
// Future improvement: schema-driven auto-form from Zod schemas.

export function SectionDataEditor({ type, data, onSave }: { type: string; data: Record<string, unknown>; onSave: (data: Record<string, unknown>) => void }) {
  const Editor = EDITORS[type] ?? GenericJsonEditor;
  return <Editor data={data} onSave={onSave} />;
}

function GenericJsonEditor({ data, onSave }: EditorProps) {
  const [json, setJson] = useState(JSON.stringify(data, null, 2));
  const [error, setError] = useState('');

  function handleSave() {
    try {
      const parsed = JSON.parse(json);
      setError('');
      onSave(parsed);
    } catch {
      setError('Ungültiges JSON');
    }
  }

  return (
    <div>
      <textarea
        className="admin-input font-mono text-xs w-full"
        rows={12}
        value={json}
        onChange={(e) => setJson(e.target.value)}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      <button onClick={handleSave} className="admin-btn-primary text-xs mt-2 flex items-center gap-1"><Save size={12} /> Speichern</button>
    </div>
  );
}

type EditorProps = { data: Record<string, unknown>; onSave: (data: Record<string, unknown>) => void };

// ─── Hero Editor ─────────────────────────────────────────────────
function HeroEditor({ data, onSave }: EditorProps) {
  const [d, setD] = useState({
    headline: (data.headline as string) || '',
    subline: (data.subline as string) || '',
    variant: (data.variant as string) || 'split',
    primaryCta: (data.primaryCta as { label: string; href: string }) || { label: '', href: '' },
    secondaryCta: (data.secondaryCta as { label: string; href: string }) || { label: '', href: '' },
  });

  return (
    <div className="space-y-3">
      <Field label="Headline" value={d.headline} onChange={(v) => setD({ ...d, headline: v })} />
      <Field label="Subline" value={d.subline} onChange={(v) => setD({ ...d, subline: v })} multiline />
      <SelectField label="Variante" value={d.variant} options={['split', 'centered', 'editorial', 'fullBleedMedia']} onChange={(v) => setD({ ...d, variant: v })} />
      <div className="grid grid-cols-2 gap-3">
        <Field label="Primärer CTA Label" value={d.primaryCta.label} onChange={(v) => setD({ ...d, primaryCta: { ...d.primaryCta, label: v } })} />
        <Field label="Primärer CTA Link" value={d.primaryCta.href} onChange={(v) => setD({ ...d, primaryCta: { ...d.primaryCta, href: v } })} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Sekundärer CTA Label" value={d.secondaryCta.label} onChange={(v) => setD({ ...d, secondaryCta: { ...d.secondaryCta, label: v } })} />
        <Field label="Sekundärer CTA Link" value={d.secondaryCta.href} onChange={(v) => setD({ ...d, secondaryCta: { ...d.secondaryCta, href: v } })} />
      </div>
      <button onClick={() => onSave(d)} className="admin-btn-primary text-xs flex items-center gap-1"><Save size={12} /> Speichern</button>
    </div>
  );
}

// ─── FAQ Editor ──────────────────────────────────────────────────
function FaqEditor({ data, onSave }: EditorProps) {
  const [headline, setHeadline] = useState((data.headline as string) || '');
  const [items, setItems] = useState<{ question: string; answer: string }[]>(
    (data.items as { question: string; answer: string }[]) || []
  );

  function addItem() { setItems([...items, { question: '', answer: '' }]); }
  function removeItem(i: number) { setItems(items.filter((_, idx) => idx !== i)); }
  function updateItem(i: number, field: 'question' | 'answer', val: string) {
    setItems(items.map((item, idx) => idx === i ? { ...item, [field]: val } : item));
  }

  return (
    <div className="space-y-3">
      <Field label="Headline" value={headline} onChange={setHeadline} />
      {items.map((item, i) => (
        <div key={i} className="border rounded p-3 space-y-2 relative">
          <button onClick={() => removeItem(i)} className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-xs">×</button>
          <Field label={`Frage ${i + 1}`} value={item.question} onChange={(v) => updateItem(i, 'question', v)} />
          <Field label="Antwort" value={item.answer} onChange={(v) => updateItem(i, 'answer', v)} multiline />
        </div>
      ))}
      <button onClick={addItem} className="text-sm text-blue-600 hover:underline">+ Frage hinzufügen</button>
      <div>
        <button onClick={() => onSave({ headline, items, source: 'manual', layout: 'accordion', expandFirst: true })} className="admin-btn-primary text-xs flex items-center gap-1"><Save size={12} /> Speichern</button>
      </div>
    </div>
  );
}

// ─── CTA Band Editor ────────────────────────────────────────────
function CtaBandEditor({ data, onSave }: EditorProps) {
  const [d, setD] = useState({
    headline: (data.headline as string) || '',
    subline: (data.subline as string) || '',
    ctaPrimary: (data.ctaPrimary as { label: string; href: string }) || { label: '', href: '' },
    background: (data.background as string) || 'surface',
  });

  return (
    <div className="space-y-3">
      <Field label="Headline" value={d.headline} onChange={(v) => setD({ ...d, headline: v })} />
      <Field label="Subline" value={d.subline} onChange={(v) => setD({ ...d, subline: v })} />
      <div className="grid grid-cols-2 gap-3">
        <Field label="CTA Label" value={d.ctaPrimary.label} onChange={(v) => setD({ ...d, ctaPrimary: { ...d.ctaPrimary, label: v } })} />
        <Field label="CTA Link" value={d.ctaPrimary.href} onChange={(v) => setD({ ...d, ctaPrimary: { ...d.ctaPrimary, href: v } })} />
      </div>
      <SelectField label="Hintergrund" value={d.background} options={['surface', 'gradient', 'image']} onChange={(v) => setD({ ...d, background: v })} />
      <button onClick={() => onSave(d)} className="admin-btn-primary text-xs flex items-center gap-1"><Save size={12} /> Speichern</button>
    </div>
  );
}

// ─── Testimonials Editor ────────────────────────────────────────
function TestimonialsEditor({ data, onSave }: EditorProps) {
  const [headline, setHeadline] = useState((data.headline as string) || '');
  const [items, setItems] = useState<{ quote: string; name: string; context: string; rating: number }[]>(
    (data.items as { quote: string; name: string; context: string; rating: number }[]) || []
  );

  function addItem() { setItems([...items, { quote: '', name: '', context: '', rating: 5 }]); }
  function removeItem(i: number) { setItems(items.filter((_, idx) => idx !== i)); }

  return (
    <div className="space-y-3">
      <Field label="Headline" value={headline} onChange={setHeadline} />
      {items.map((item, i) => (
        <div key={i} className="border rounded p-3 space-y-2 relative">
          <button onClick={() => removeItem(i)} className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-xs">×</button>
          <Field label="Zitat" value={item.quote} onChange={(v) => setItems(items.map((it, idx) => idx === i ? { ...it, quote: v } : it))} multiline />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Name" value={item.name} onChange={(v) => setItems(items.map((it, idx) => idx === i ? { ...it, name: v } : it))} />
            <Field label="Kontext" value={item.context} onChange={(v) => setItems(items.map((it, idx) => idx === i ? { ...it, context: v } : it))} />
          </div>
        </div>
      ))}
      <button onClick={addItem} className="text-sm text-blue-600 hover:underline">+ Bewertung hinzufügen</button>
      <div>
        <button onClick={() => onSave({ headline, items, layout: 'cards' })} className="admin-btn-primary text-xs flex items-center gap-1"><Save size={12} /> Speichern</button>
      </div>
    </div>
  );
}

// ─── Map Editor ──────────────────────────────────────────────────
function MapEditor({ data, onSave }: EditorProps) {
  const [d, setD] = useState({
    embedUrl: (data.embedUrl as string) || '',
    headline: (data.headline as string) || '',
    height: (data.height as string) || 'm',
  });

  return (
    <div className="space-y-3">
      <Field label="Headline (optional)" value={d.headline} onChange={(v) => setD({ ...d, headline: v })} />
      <Field label="Google Maps Embed-URL" value={d.embedUrl} onChange={(v) => setD({ ...d, embedUrl: v })} />
      <SelectField label="Höhe" value={d.height} options={['s', 'm', 'l']} onChange={(v) => setD({ ...d, height: v })} />
      <button onClick={() => onSave({ ...d, provider: 'embed' })} className="admin-btn-primary text-xs flex items-center gap-1"><Save size={12} /> Speichern</button>
    </div>
  );
}

// ─── Shared field components ─────────────────────────────────────
function Field({ label, value, onChange, multiline }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean }) {
  return (
    <label className="block text-sm">
      <span className="text-gray-600 text-xs">{label}</span>
      {multiline ? (
        <textarea className="admin-input mt-1 w-full" rows={3} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input className="admin-input mt-1 w-full" value={value} onChange={(e) => onChange(e.target.value)} />
      )}
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

// ─── Editor registry ─────────────────────────────────────────────
const EDITORS: Record<string, React.FC<EditorProps>> = {
  hero: HeroEditor,
  faq: FaqEditor,
  ctaBand: CtaBandEditor,
  testimonials: TestimonialsEditor,
  map: MapEditor,
};
