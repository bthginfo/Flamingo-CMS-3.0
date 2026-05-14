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

// ─── CTA Links Editor ────────────────────────────────────────────
function CtaLinksEditor({ data, onSave }: EditorProps) {
  const [headline, setHeadline] = useState((data.headline as string) || '');
  const [subline, setSubline] = useState((data.subline as string) || '');
  const [links, setLinks] = useState<{ label: string; href: string; icon: string; description: string }[]>(
    (data.links as { label: string; href: string; icon: string; description: string }[]) || []
  );

  function addLink() { setLinks([...links, { label: '', href: '', icon: '', description: '' }]); }
  function removeLink(i: number) { setLinks(links.filter((_, idx) => idx !== i)); }
  function updateLink(i: number, field: string, val: string) {
    setLinks(links.map((l, idx) => idx === i ? { ...l, [field]: val } : l));
  }

  return (
    <div className="space-y-3">
      <Field label="Headline" value={headline} onChange={setHeadline} />
      <Field label="Subline" value={subline} onChange={setSubline} />
      {links.map((link, i) => (
        <div key={i} className="border rounded p-3 space-y-2 relative">
          <button onClick={() => removeLink(i)} className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-xs">×</button>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Label" value={link.label} onChange={(v) => updateLink(i, 'label', v)} />
            <Field label="Link (href)" value={link.href} onChange={(v) => updateLink(i, 'href', v)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Icon (Lucide-Name)" value={link.icon} onChange={(v) => updateLink(i, 'icon', v)} />
            <Field label="Beschreibung" value={link.description} onChange={(v) => updateLink(i, 'description', v)} />
          </div>
        </div>
      ))}
      <button onClick={addLink} className="text-sm text-blue-600 hover:underline">+ Link hinzufügen</button>
      <div><button onClick={() => onSave({ headline, subline, links })} className="admin-btn-primary text-xs flex items-center gap-1"><Save size={12} /> Speichern</button></div>
    </div>
  );
}

// ─── News Preview Editor ─────────────────────────────────────────
function NewsPreviewEditor({ data, onSave }: EditorProps) {
  const [d, setD] = useState({
    headline: (data.headline as string) || 'Aktuelles',
    subline: (data.subline as string) || '',
    collectionKey: (data.collectionKey as string) || 'news',
    linkLabel: (data.linkLabel as string) || 'Alle Beiträge',
    linkHref: (data.linkHref as string) || '/news',
  });

  return (
    <div className="space-y-3">
      <Field label="Headline" value={d.headline} onChange={(v) => setD({ ...d, headline: v })} />
      <Field label="Subline" value={d.subline} onChange={(v) => setD({ ...d, subline: v })} />
      <Field label="Collection-Key (z.B. news, blog)" value={d.collectionKey} onChange={(v) => setD({ ...d, collectionKey: v })} />
      <div className="grid grid-cols-2 gap-3">
        <Field label="Link Label" value={d.linkLabel} onChange={(v) => setD({ ...d, linkLabel: v })} />
        <Field label="Link Href" value={d.linkHref} onChange={(v) => setD({ ...d, linkHref: v })} />
      </div>
      <p className="text-xs text-gray-400">Die News-Items werden automatisch aus der verknüpften Collection geladen.</p>
      <button onClick={() => onSave(d)} className="admin-btn-primary text-xs flex items-center gap-1"><Save size={12} /> Speichern</button>
    </div>
  );
}

// ─── Stats Editor ────────────────────────────────────────────────
function StatsEditor({ data, onSave }: EditorProps) {
  const [headline, setHeadline] = useState((data.headline as string) || '');
  const [stats, setStats] = useState<{ value: number; suffix: string; prefix: string; label: string; icon: string }[]>(
    (data.stats as { value: number; suffix: string; prefix: string; label: string; icon: string }[]) || []
  );

  function addStat() { setStats([...stats, { value: 0, suffix: '', prefix: '', label: '', icon: '' }]); }
  function removeStat(i: number) { setStats(stats.filter((_, idx) => idx !== i)); }

  return (
    <div className="space-y-3">
      <Field label="Headline" value={headline} onChange={setHeadline} />
      {stats.map((stat, i) => (
        <div key={i} className="border rounded p-3 space-y-2 relative">
          <button onClick={() => removeStat(i)} className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-xs">×</button>
          <div className="grid grid-cols-3 gap-3">
            <label className="block text-sm"><span className="text-gray-600 text-xs">Wert</span>
              <input type="number" className="admin-input mt-1 w-full" value={stat.value} onChange={(e) => setStats(stats.map((s, idx) => idx === i ? { ...s, value: Number(e.target.value) } : s))} />
            </label>
            <Field label="Prefix" value={stat.prefix} onChange={(v) => setStats(stats.map((s, idx) => idx === i ? { ...s, prefix: v } : s))} />
            <Field label="Suffix (+, %, etc.)" value={stat.suffix} onChange={(v) => setStats(stats.map((s, idx) => idx === i ? { ...s, suffix: v } : s))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Label" value={stat.label} onChange={(v) => setStats(stats.map((s, idx) => idx === i ? { ...s, label: v } : s))} />
            <Field label="Icon (Lucide-Name)" value={stat.icon} onChange={(v) => setStats(stats.map((s, idx) => idx === i ? { ...s, icon: v } : s))} />
          </div>
        </div>
      ))}
      <button onClick={addStat} className="text-sm text-blue-600 hover:underline">+ Statistik hinzufügen</button>
      <div><button onClick={() => onSave({ headline, stats })} className="admin-btn-primary text-xs flex items-center gap-1"><Save size={12} /> Speichern</button></div>
    </div>
  );
}

// ─── Logo Cloud Editor ───────────────────────────────────────────
function LogoCloudEditor({ data, onSave }: EditorProps) {
  const [headline, setHeadline] = useState((data.headline as string) || '');
  const [subline, setSubline] = useState((data.subline as string) || '');
  const [logos, setLogos] = useState<{ src: string; alt: string; href: string }[]>(
    (data.logos as { src: string; alt: string; href: string }[]) || []
  );

  function addLogo() { setLogos([...logos, { src: '', alt: '', href: '' }]); }
  function removeLogo(i: number) { setLogos(logos.filter((_, idx) => idx !== i)); }

  return (
    <div className="space-y-3">
      <Field label="Headline" value={headline} onChange={setHeadline} />
      <Field label="Subline" value={subline} onChange={setSubline} />
      {logos.map((logo, i) => (
        <div key={i} className="border rounded p-3 space-y-2 relative">
          <button onClick={() => removeLogo(i)} className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-xs">×</button>
          <Field label="Bild-URL" value={logo.src} onChange={(v) => setLogos(logos.map((l, idx) => idx === i ? { ...l, src: v } : l))} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Alt-Text" value={logo.alt} onChange={(v) => setLogos(logos.map((l, idx) => idx === i ? { ...l, alt: v } : l))} />
            <Field label="Link (optional)" value={logo.href} onChange={(v) => setLogos(logos.map((l, idx) => idx === i ? { ...l, href: v } : l))} />
          </div>
        </div>
      ))}
      <button onClick={addLogo} className="text-sm text-blue-600 hover:underline">+ Logo hinzufügen</button>
      <div><button onClick={() => onSave({ headline, subline, logos })} className="admin-btn-primary text-xs flex items-center gap-1"><Save size={12} /> Speichern</button></div>
    </div>
  );
}

// ─── Gallery Grid Editor ─────────────────────────────────────────
function GalleryGridEditor({ data, onSave }: EditorProps) {
  const [headline, setHeadline] = useState((data.headline as string) || '');
  const [subline, setSubline] = useState((data.subline as string) || '');
  const [images, setImages] = useState<{ src: string; alt: string; caption: string }[]>(
    (data.images as { src: string; alt: string; caption: string }[]) || []
  );

  function addImage() { setImages([...images, { src: '', alt: '', caption: '' }]); }
  function removeImage(i: number) { setImages(images.filter((_, idx) => idx !== i)); }

  return (
    <div className="space-y-3">
      <Field label="Headline" value={headline} onChange={setHeadline} />
      <Field label="Subline" value={subline} onChange={setSubline} />
      {images.map((img, i) => (
        <div key={i} className="border rounded p-3 space-y-2 relative">
          <button onClick={() => removeImage(i)} className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-xs">×</button>
          <Field label="Bild-URL" value={img.src} onChange={(v) => setImages(images.map((im, idx) => idx === i ? { ...im, src: v } : im))} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Alt-Text" value={img.alt} onChange={(v) => setImages(images.map((im, idx) => idx === i ? { ...im, alt: v } : im))} />
            <Field label="Bildunterschrift" value={img.caption} onChange={(v) => setImages(images.map((im, idx) => idx === i ? { ...im, caption: v } : im))} />
          </div>
        </div>
      ))}
      <button onClick={addImage} className="text-sm text-blue-600 hover:underline">+ Bild hinzufügen</button>
      <div><button onClick={() => onSave({ headline, subline, images })} className="admin-btn-primary text-xs flex items-center gap-1"><Save size={12} /> Speichern</button></div>
    </div>
  );
}

// ─── Editor registry ─────────────────────────────────────────────
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
};
