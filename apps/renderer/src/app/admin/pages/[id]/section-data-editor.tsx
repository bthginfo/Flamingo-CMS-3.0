'use client';

import { useState, useEffect, useRef } from 'react';
import { Save } from 'lucide-react';
import { ImageUploadField } from '@/components/image-upload-field';
import { ButtonField, DetailLinkField } from '@/components/button-field';
import { IconPickerField } from '@/components/icon-picker-field';

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

// Generic section data editor that renders a form per section type.
export function SectionDataEditor({ type, data, onChange }: { type: string; data: Record<string, unknown>; onChange: (data: Record<string, unknown>) => void }) {
  const Editor = EDITORS[type] ?? GenericJsonEditor;
  return <Editor data={data} onChange={onChange} />;
}

type EditorProps = { data: Record<string, unknown>; onChange: (data: Record<string, unknown>) => void };

// GenericJsonEditor keeps a button because JSON may be invalid mid-edit
function GenericJsonEditor({ data, onChange }: EditorProps) {
  const [json, setJson] = useState(JSON.stringify(data, null, 2));
  const [error, setError] = useState('');

  function handleApply() {
    try {
      const parsed = JSON.parse(json);
      setError('');
      onChange(parsed);
    } catch {
      setError('Ungültiges JSON');
    }
  }

  return (
    <div>
      <textarea className="admin-input font-mono text-xs w-full" rows={12} value={json} onChange={(e) => setJson(e.target.value)} />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      <button onClick={handleApply} className="admin-btn-primary text-xs mt-2 flex items-center gap-1"><Save size={12} /> Übernehmen</button>
    </div>
  );
}

// ─── Hero Editor ─────────────────────────────────────────────────
function HeroEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({
    headline: (data.headline as string) || '',
    subline: (data.subline as string) || '',
    badgeText: (data.badgeText as string) || '',
    bgImage: (data.bgImage as string) || '',
    overlayColor: (data.overlayColor as string) || '#000000',
    overlayOpacity: (data.overlayOpacity as number) ?? 0,
    trustItems: (data.trustItems as string[]) || [],
    primaryCta: (data.primaryCta as { label: string; href: string }) || { label: '', href: '' },
    secondaryCta: (data.secondaryCta as { label: string; href: string }) || { label: '', href: '' },
  });
  useReport(d as unknown as Record<string, unknown>, onChange);

  return (
    <div className="space-y-3">
      <Field label="Headline" value={d.headline} onChange={(v) => setD({ ...d, headline: v })} />
      <Field label="Subline" value={d.subline} onChange={(v) => setD({ ...d, subline: v })} multiline />
      <Field label="Badge-Text" value={d.badgeText} onChange={(v) => setD({ ...d, badgeText: v })} />
      <ImageUploadField label="Hintergrundbild" value={d.bgImage} onChange={(v) => setD({ ...d, bgImage: v })} />
      {d.bgImage && (
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-xs font-medium text-zinc-600">Overlay-Farbe</span>
            <input type="color" className="admin-input mt-1 h-9 p-1 cursor-pointer" value={d.overlayColor} onChange={(e) => setD({ ...d, overlayColor: e.target.value })} />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-zinc-600">Overlay-Deckkraft ({Math.round(d.overlayOpacity * 100)}%)</span>
            <input type="range" min="0" max="1" step="0.05" className="w-full mt-2" value={d.overlayOpacity} onChange={(e) => setD({ ...d, overlayOpacity: parseFloat(e.target.value) })} />
          </label>
        </div>
      )}
      <div className="space-y-2">
        <label className="text-xs font-medium text-zinc-600">Trust-Elemente</label>
        {d.trustItems.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input className="admin-input flex-1 text-xs" value={item} onChange={(e) => setD({ ...d, trustItems: d.trustItems.map((t, idx) => idx === i ? e.target.value : t) })} />
            <button onClick={() => setD({ ...d, trustItems: d.trustItems.filter((_, idx) => idx !== i) })} className="text-red-400 hover:text-red-600 text-xs">×</button>
          </div>
        ))}
        <button onClick={() => setD({ ...d, trustItems: [...d.trustItems, ''] })} className="text-xs text-blue-600 hover:underline">+ Trust-Element</button>
      </div>
      <ButtonField label="Primärer CTA" value={d.primaryCta} onChange={(v) => setD({ ...d, primaryCta: v })} />
      <ButtonField label="Sekundärer CTA" value={d.secondaryCta} onChange={(v) => setD({ ...d, secondaryCta: v })} />
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
      <Field label="Headline" value={headline} onChange={setHeadline} />
      {items.map((item, i) => (
        <div key={i} className="border rounded p-3 space-y-2 relative">
          <button onClick={() => removeItem(i)} className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-xs">×</button>
          <Field label={`Frage ${i + 1}`} value={item.question} onChange={(v) => updateItem(i, 'question', v)} />
          <Field label="Antwort" value={item.answer} onChange={(v) => updateItem(i, 'answer', v)} multiline />
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
      <Field label="Headline" value={d.headline} onChange={(v) => setD({ ...d, headline: v })} />
      <Field label="Subline" value={d.subline} onChange={(v) => setD({ ...d, subline: v })} />
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
      <Field label="Headline" value={headline} onChange={setHeadline} />
      <div className="grid grid-cols-2 gap-3">
        <Field label="Bewertungsdurchschnitt (z.B. 4.9)" value={ratingValue} onChange={setRatingValue} />
        <Field label="Anzahl Bewertungen (z.B. 150)" value={ratingCount} onChange={setRatingCount} />
      </div>
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
      <SelectField label="Höhe" value={d.height} options={['s', 'm', 'l']} onChange={(v) => setD({ ...d, height: v })} />
    </div>
  );
}

// ─── Shared field components ─────────────────────────────────────
function Field({ label, value, onChange, multiline, placeholder }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean; placeholder?: string }) {
  return (
    <label className="block text-sm">
      <span className="text-gray-600 text-xs">{label}</span>
      {multiline ? (
        <textarea className="admin-input mt-1 w-full" rows={3} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
      ) : (
        <input className="admin-input mt-1 w-full" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
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
      <Field label="Headline" value={headline} onChange={setHeadline} />
      <Field label="Subline" value={subline} onChange={setSubline} />
      {links.map((link, i) => (
        <div key={i} className="border rounded p-3 space-y-2 relative">
          <button onClick={() => removeLink(i)} className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-xs">×</button>
          <Field label="Label" value={link.label} onChange={(v) => updateLink(i, 'label', v)} />
          <DetailLinkField label="Link" value={link.href} onChange={(v) => updateLink(i, 'href', v)} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Icon (Lucide-Name)" value={link.icon} onChange={(v) => updateLink(i, 'icon', v)} />
            <Field label="Beschreibung" value={link.description} onChange={(v) => updateLink(i, 'description', v)} />
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
      <Field label="Headline" value={d.headline} onChange={(v) => setD({ ...d, headline: v })} />
      <Field label="Subline" value={d.subline} onChange={(v) => setD({ ...d, subline: v })} />
      <Field label="Collection-Key (z.B. news, blog)" value={d.collectionKey} onChange={(v) => setD({ ...d, collectionKey: v })} />
      <ButtonField label="Link" value={{ label: d.linkLabel, href: d.linkHref }} onChange={(v) => setD({ ...d, linkLabel: v.label, linkHref: v.href })} />
      <p className="text-xs text-gray-400">Die News-Items werden automatisch aus der verknüpften Collection geladen.</p>
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
      <Field label="Headline" value={headline} onChange={setHeadline} />
      <Field label="Subline" value={subline} onChange={setSubline} />
      {logos.map((logo, i) => (
        <div key={i} className="border rounded p-3 space-y-2 relative">
          <button onClick={() => removeLogo(i)} className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-xs">×</button>
          <ImageUploadField label="Bild" value={logo.src} onChange={(v) => setLogos(logos.map((l, idx) => idx === i ? { ...l, src: v } : l))} />
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
  useReport({ headline, subline, images }, onChange);

  function addImage() { setImages([...images, { src: '', alt: '', caption: '' }]); }
  function removeImage(i: number) { setImages(images.filter((_, idx) => idx !== i)); }

  return (
    <div className="space-y-3">
      <Field label="Headline" value={headline} onChange={setHeadline} />
      <Field label="Subline" value={subline} onChange={setSubline} />
      {images.map((img, i) => (
        <div key={i} className="border rounded p-3 space-y-2 relative">
          <button onClick={() => removeImage(i)} className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-xs">×</button>
          <ImageUploadField label="Bild" value={img.src} onChange={(v) => setImages(images.map((im, idx) => idx === i ? { ...im, src: v } : im))} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Alt-Text" value={img.alt} onChange={(v) => setImages(images.map((im, idx) => idx === i ? { ...im, alt: v } : im))} />
            <Field label="Bildunterschrift" value={img.caption} onChange={(v) => setImages(images.map((im, idx) => idx === i ? { ...im, caption: v } : im))} />
          </div>
        </div>
      ))}
      <button onClick={addImage} className="text-sm text-blue-600 hover:underline">+ Bild hinzufügen</button>
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
          <div className="grid grid-cols-3 gap-3">
            <IconPickerField label="Icon" value={item.icon} onChange={(v) => update(i, 'icon', v)} />
            <Field label="Titel" value={item.title} onChange={(v) => update(i, 'title', v)} />
            <Field label="Text" value={item.text} onChange={(v) => update(i, 'text', v)} />
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
  const [cards, setCards] = useState<{ title: string; text: string; icon: string; image: string; mediaType: string; href: string }[]>(
    ((data.manualCards as Record<string, unknown>[]) || []).map(c => ({
      title: (c.title as string) || '',
      text: (c.text as string) || '',
      icon: (c.icon as string) || '',
      image: (c.image as string) || '',
      mediaType: (c.mediaType as string) || 'icon',
      href: (c.href as string) || '',
    }))
  );
  useReport({ headline, subline, badgeText, ctaLabel, ctaHref, manualCards: cards }, onChange);

  function addCard() { setCards([...cards, { title: '', text: '', icon: '', image: '', mediaType: 'icon', href: '' }]); }
  function removeCard(i: number) { setCards(cards.filter((_, idx) => idx !== i)); }
  function update(i: number, field: string, val: string) { setCards(cards.map((c, idx) => idx === i ? { ...c, [field]: val } : c)); }

  return (
    <div className="space-y-3">
      <Field label="Headline" value={headline} onChange={setHeadline} />
      <Field label="Subline" value={subline} onChange={setSubline} />
      <Field label="Badge-Text" value={badgeText} onChange={setBadgeText} />
      <ButtonField label="CTA-Button" value={{ label: ctaLabel, href: ctaHref }} onChange={(v) => { setCtaLabel(v.label); setCtaHref(v.href); }} />
      {cards.map((card, i) => (
        <div key={i} className="border rounded p-3 space-y-2 relative">
          <button onClick={() => removeCard(i)} className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-xs">×</button>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Titel" value={card.title} onChange={(v) => update(i, 'title', v)} />
            <Field label="Beschreibung" value={card.text} onChange={(v) => update(i, 'text', v)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <SelectField label="Medientyp" value={card.mediaType} options={['icon', 'image']} onChange={(v) => update(i, 'mediaType', v)} />
            {card.mediaType === 'icon' ? (
              <IconPickerField label="Icon" value={card.icon} onChange={(v) => update(i, 'icon', v)} />
            ) : (
              <ImageUploadField label="Bild" value={card.image} onChange={(v) => update(i, 'image', v)} />
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
      <Field label="Headline" value={headline} onChange={setHeadline} />
      <Field label="Badge-Text" value={badgeText} onChange={setBadgeText} />
      {steps.map((step, i) => (
        <div key={i} className="border rounded p-3 space-y-2 relative">
          <button onClick={() => removeStep(i)} className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-xs">×</button>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Titel" value={step.title} onChange={(v) => update(i, 'title', v)} />
            <Field label="Beschreibung" value={step.text} onChange={(v) => update(i, 'text', v)} />
            <Field label="Icon (optional)" value={step.icon} onChange={(v) => update(i, 'icon', v)} />
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
      <Field label="Headline" value={headline} onChange={setHeadline} />
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
          <div className="grid grid-cols-3 gap-3">
            <IconPickerField label="Icon" value={card.icon} onChange={(v) => update(i, 'icon', v)} />
            <Field label="Label" value={card.label} onChange={(v) => update(i, 'label', v)} />
            <Field label="Wert" value={card.value} onChange={(v) => update(i, 'value', v)} />
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
      <Field label="Headline" value={headline} onChange={setHeadline} />
      <Field label="Subline" value={subline} onChange={setSubline} />
      <Field label="Badge-Text" value={badgeText} onChange={setBadgeText} />
      {items.map((item, i) => (
        <div key={i} className="border rounded p-3 space-y-2 relative">
          <button onClick={() => removeItem(i)} className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-xs">×</button>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Titel" value={item.title} onChange={(v) => update(i, 'title', v)} />
            <Field label="Beschreibung" value={item.text} onChange={(v) => update(i, 'text', v)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <SelectField label="Medientyp" value={item.mediaType} options={['icon', 'image']} onChange={(v) => update(i, 'mediaType', v)} />
            {item.mediaType === 'icon' ? (
              <IconPickerField label="Icon" value={item.icon} onChange={(v) => update(i, 'icon', v)} />
            ) : (
              <ImageUploadField label="Bild" value={item.image} onChange={(v) => update(i, 'image', v)} />
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
      <Field label="Headline" value={headline} onChange={setHeadline} />
      <Field label="Subline" value={subline} onChange={setSubline} />
      <Field label="Badge-Text" value={badgeText} onChange={setBadgeText} />
      <ButtonField label="CTA-Button" value={{ label: ctaLabel, href: ctaHref }} onChange={(v) => { setCtaLabel(v.label); setCtaHref(v.href); }} />
      {projects.map((proj, i) => (
        <div key={i} className="border rounded p-3 space-y-2 relative">
          <button onClick={() => removeProject(i)} className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-xs">×</button>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Titel" value={proj.title} onChange={(v) => update(i, 'title', v)} />
            <Field label="Kategorie" value={proj.category} onChange={(v) => update(i, 'category', v)} />
          </div>
          <Field label="Beschreibung" value={proj.description} onChange={(v) => update(i, 'description', v)} multiline />
          <ImageUploadField label="Bild" value={proj.image} onChange={(v) => update(i, 'image', v)} />
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
      <Field label="Headline" value={headline} onChange={setHeadline} />
      <Field label="Subline" value={subline} onChange={setSubline} />
      <Field label="Badge-Text" value={badgeText} onChange={setBadgeText} />

      <h4 className="text-sm font-medium text-gray-700 pt-2 border-t">Firmengeschichte</h4>
      <Field label="Story-Headline" value={storyHeadline} onChange={setStoryHeadline} />
      <Field label="Story-Text" value={storyText} onChange={setStoryText} multiline />
      <ImageUploadField label="Story-Bild" value={storyImage} onChange={setStoryImage} />

      <h4 className="text-sm font-medium text-gray-700 pt-2 border-t">Statistiken</h4>
      {teamStats.map((s, i) => (
        <div key={i} className="flex gap-3 items-end">
          <Field label="Wert" value={s.value} onChange={(v) => setTeamStats(teamStats.map((st, idx) => idx === i ? { ...st, value: v } : st))} />
          <Field label="Label" value={s.label} onChange={(v) => setTeamStats(teamStats.map((st, idx) => idx === i ? { ...st, label: v } : st))} />
          <button onClick={() => setTeamStats(teamStats.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-600 text-xs pb-2">×</button>
        </div>
      ))}
      <button onClick={() => setTeamStats([...teamStats, { value: '', label: '' }])} className="text-sm text-blue-600 hover:underline">+ Statistik</button>

      <h4 className="text-sm font-medium text-gray-700 pt-2 border-t">Werte</h4>
      <Field label="Werte-Überschrift" value={valuesHeadline} onChange={setValuesHeadline} />
      {values.map((v, i) => (
        <div key={i} className="border rounded p-3 space-y-2 relative">
          <button onClick={() => setValues(values.filter((_, idx) => idx !== i))} className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-xs">×</button>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Titel" value={v.title} onChange={(val) => setValues(values.map((vl, idx) => idx === i ? { ...vl, title: val } : vl))} />
            <Field label="Text" value={v.text} onChange={(val) => setValues(values.map((vl, idx) => idx === i ? { ...vl, text: val } : vl))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <SelectField label="Medientyp" value={v.mediaType} options={['icon', 'image']} onChange={(val) => setValues(values.map((vl, idx) => idx === i ? { ...vl, mediaType: val } : vl))} />
            {v.mediaType === 'icon' ? (
              <IconPickerField label="Icon" value={v.icon} onChange={(val) => setValues(values.map((vl, idx) => idx === i ? { ...vl, icon: val } : vl))} />
            ) : (
              <ImageUploadField label="Bild" value={v.image} onChange={(val) => setValues(values.map((vl, idx) => idx === i ? { ...vl, image: val } : vl))} />
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
          <div className="grid grid-cols-2 gap-3">
            <Field label="Name" value={m.name} onChange={(v) => setMembers(members.map((mem, idx) => idx === i ? { ...mem, name: v } : mem))} />
            <Field label="Rolle" value={m.role} onChange={(v) => setMembers(members.map((mem, idx) => idx === i ? { ...mem, role: v } : mem))} />
          </div>
          <ImageUploadField label="Bild" value={m.image} onChange={(v) => setMembers(members.map((mem, idx) => idx === i ? { ...mem, image: v } : mem))} />
          <Field label="Bio" value={m.bio} onChange={(v) => setMembers(members.map((mem, idx) => idx === i ? { ...mem, bio: v } : mem))} multiline />
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
      <div>
        <label className="text-xs font-medium text-zinc-600 mb-1 block">Inhalt (HTML)</label>
        <textarea
          className="admin-input w-full min-h-[300px] font-mono text-xs leading-relaxed"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="<h2>Überschrift</h2>\n<p>Ihr Text hier...</p>"
        />
        <p className="text-[10px] text-zinc-400 mt-1">HTML-Tags: &lt;h2&gt;, &lt;h3&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;ol&gt;, &lt;li&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;a&gt; werden unterstützt.</p>
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
      <SelectField label="Stil" value={style} options={['neutral', 'info', 'warning']} onChange={setStyle} />
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
  uspStrip: UspStripEditor,
  servicesGrid: ServicesGridEditor,
  newsGrid: NewsPreviewEditor,
  processSteps: ProcessStepsEditor,
  contact: ContactEditor,
  serviceDetail: ServiceDetailEditor,
  portfolio: PortfolioEditor,
  team: TeamEditor,
  richText: RichTextEditor,
  headerBanner: HeaderBannerEditor,
};
