'use client';

import { type Dispatch, type SetStateAction, useEffect, useRef, useState } from 'react';
import { ImageUploadField } from '@/components/image-upload-field';
import { saveMediaRecord } from '@/app/admin/media-actions';
import { ButtonField } from '@/components/button-field';
import { IconPickerField } from '@/components/icon-picker-field';
import { MediaBulkPickerButton } from '@/components/media-bulk-picker';

type ButtonValue = { label: string; href: string };
type EditorProps = { data: Record<string, unknown>; onChange: (data: Record<string, unknown>) => void };

export function SalonSectionDataEditor({ type, data, onChange }: { type: string; data: Record<string, unknown>; onChange: (data: Record<string, unknown>) => void }) {
  const Editor = SALON_EDITORS[type];
  return Editor ? <Editor data={data} onChange={onChange} /> : null;
}

export function hasSalonEditor(type: string): boolean {
  return Boolean(SALON_EDITORS[type]);
}

function HeroEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({ headline: str(data.headline), subline: str(data.subline), badgeText: str(data.badgeText), bgImage: str(data.bgImage), trustItems: join(data.trustItems), primaryCta: btn(data.primaryCta), secondaryCta: btn(data.secondaryCta), bookingHint: str(data.bookingHint), ratingText: str(data.ratingText), imageEffect: (data.imageEffect as string) || 'none', imageEffectIntensity: (data.imageEffectIntensity as string) || 'medium', overlayColor: (data.overlayColor as string) || '#000000', overlayOpacity: (data.overlayOpacity as number) ?? -1 });
  useReport({ ...d, trustItems: lines(d.trustItems) }, onChange);
  return <div className="space-y-3"><Basics d={d} setD={setD} /><ImageUploadField label="Hintergrundbild" value={d.bgImage} onChange={(v) => setD({ ...d, bgImage: v })} /><Field label="Trust-Items" value={d.trustItems} onChange={(v) => setD({ ...d, trustItems: v })} multiline /><ButtonField label="Primärer CTA" value={d.primaryCta} onChange={(v) => setD({ ...d, primaryCta: v })} /><ButtonField label="Sekundärer CTA" value={d.secondaryCta} onChange={(v) => setD({ ...d, secondaryCta: v })} /><div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><Field label="Buchungshinweis" value={d.bookingHint} onChange={(v) => setD({ ...d, bookingHint: v })} /><Field label="Rating Text" value={d.ratingText} onChange={(v) => setD({ ...d, ratingText: v })} /></div><div><label className="text-xs font-medium text-zinc-600 mb-1 block">Bild-Effekt</label><select className="admin-input" value={d.imageEffect} onChange={(e) => setD({ ...d, imageEffect: e.target.value })}><option value="none">Kein Effekt</option><option value="parallax">Parallax</option><option value="kenBurns">Ken Burns (Zoom)</option></select>{d.imageEffect !== 'none' && (<select className="admin-input mt-2" value={d.imageEffectIntensity} onChange={(e) => setD({ ...d, imageEffectIntensity: e.target.value })}><option value="subtle">Dezent</option><option value="medium">Mittel</option><option value="strong">Stark</option></select>)}</div><label className="block"><span className="text-xs font-medium text-zinc-600">Overlay</span><div className="flex gap-2 mt-1.5"><button type="button" onClick={() => setD({ ...d, overlayOpacity: -1, overlayColor: '#000000' })} className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${d.overlayOpacity === -1 ? 'bg-blue-500 text-white' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'}`}>Standard</button><button type="button" onClick={() => setD({ ...d, overlayOpacity: 0.5 })} className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${d.overlayOpacity > 0 ? 'bg-blue-500 text-white' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'}`}>Eigene Farbe</button><button type="button" onClick={() => setD({ ...d, overlayOpacity: 0 })} className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${d.overlayOpacity === 0 ? 'bg-blue-500 text-white' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'}`}>Kein Overlay</button></div></label>{d.overlayOpacity > 0 && (<div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><label className="block"><span className="text-xs font-medium text-zinc-600">Farbe</span><input type="color" className="admin-input mt-1 h-9 p-1 cursor-pointer" value={d.overlayColor} onChange={(e) => setD({ ...d, overlayColor: e.target.value })} /></label><label className="block"><span className="text-xs font-medium text-zinc-600">Deckkraft ({Math.round(d.overlayOpacity * 100)}%)</span><input type="range" min="0.05" max="1" step="0.05" className="w-full mt-2" value={d.overlayOpacity} onChange={(e) => setD({ ...d, overlayOpacity: parseFloat(e.target.value) })} /></label></div>)}</div>;
}

function ServiceMenuEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({ ...basicData(data), categories: arr(data.categories).map(cardListFromData), ctaPrimary: btn(data.ctaPrimary) });
  useReport({ ...d, categories: d.categories.map((item) => ({ ...item, services: lines(item.services) })) }, onChange);
  return <div className="space-y-3"><Basics d={d} setD={setD} /><Repeater items={d.categories} addLabel="+ Kategorie" onAdd={() => setD({ ...d, categories: [...d.categories, cardListFromData({})] })} render={(item, index) => <div className="space-y-3">{cardFields({ item, index, d, setD, keyName: 'categories' })}<Field label="Services" value={item.services} onChange={(v) => updateItem(d, setD, 'categories', index, { ...item, services: v })} multiline /></div>} /><ButtonField label="CTA" value={d.ctaPrimary} onChange={(v) => setD({ ...d, ctaPrimary: v })} /></div>;
}

function PriceListEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({ ...basicData(data), categories: arr(data.categories).map(priceCategoryFromData), footnote: str(data.footnote), ctaPrimary: btn(data.ctaPrimary) });
  useReport(d, onChange);
  return <div className="space-y-3"><Basics d={d} setD={setD} /><Repeater items={d.categories} addLabel="+ Preis-Kategorie" onAdd={() => setD({ ...d, categories: [...d.categories, priceCategoryFromData({})] })} render={(cat, index) => <div className="space-y-3"><Field label="Titel" value={cat.title} onChange={(v) => updateItem(d, setD, 'categories', index, { ...cat, title: v })} /><Field label="Text" value={cat.text} onChange={(v) => updateItem(d, setD, 'categories', index, { ...cat, text: v })} multiline /><Repeater items={cat.items} addLabel="+ Preis" onAdd={() => updateItem(d, setD, 'categories', index, { ...cat, items: [...cat.items, priceItemFromData({})] })} render={(item, itemIndex) => <div className="space-y-3"><div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><Field label="Name" value={item.name} onChange={(v) => updateNested(d, setD, 'categories', index, 'items', itemIndex, { ...item, name: v })} /><Field label="Preis" value={item.priceLabel} onChange={(v) => updateNested(d, setD, 'categories', index, 'items', itemIndex, { ...item, priceLabel: v })} /></div><Field label="Beschreibung" value={item.description} onChange={(v) => updateNested(d, setD, 'categories', index, 'items', itemIndex, { ...item, description: v })} multiline /><div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><Field label="Dauer" value={item.durationLabel} onChange={(v) => updateNested(d, setD, 'categories', index, 'items', itemIndex, { ...item, durationLabel: v })} /><Field label="Hinweis" value={item.note} onChange={(v) => updateNested(d, setD, 'categories', index, 'items', itemIndex, { ...item, note: v })} /></div><ButtonField label="CTA" value={item.cta} onChange={(v) => updateNested(d, setD, 'categories', index, 'items', itemIndex, { ...item, cta: v })} /></div>} /></div>} /><Field label="Footnote" value={d.footnote} onChange={(v) => setD({ ...d, footnote: v })} multiline /><ButtonField label="CTA" value={d.ctaPrimary} onChange={(v) => setD({ ...d, ctaPrimary: v })} /></div>;
}

function TreatmentDetailEditor({ data, onChange }: EditorProps) {
  return CardRepeaterEditor({ data, onChange, keyName: 'treatments', addLabel: '+ Behandlung', factory: treatmentFromData, arrayKeys: ['steps', 'careTips'] });
}

function PackagesEditor({ data, onChange }: EditorProps) {
  return CardRepeaterEditor({ data, onChange, keyName: 'packages', addLabel: '+ Paket', factory: packageFromData, arrayKeys: ['includes'], withCta: true });
}

function TeamShowcaseEditor({ data, onChange }: EditorProps) {
  return CardRepeaterEditor({ data, onChange, keyName: 'members', addLabel: '+ Teammitglied', factory: memberFromData, arrayKeys: ['specialties'], ctaKey: 'bookingCta' });
}

function ExpertiseGridEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({ ...basicData(data), items: arr(data.items).map(expertiseFromData) });
  useReport(d, onChange);
  return <div className="space-y-3"><Basics d={d} setD={setD} /><Repeater items={d.items} addLabel="+ Expertise" onAdd={() => setD({ ...d, items: [...d.items, expertiseFromData({})] })} render={(item, index) => <div className="space-y-3"><IconPickerField label="Icon" value={item.icon} onChange={(v) => updateItem(d, setD, 'items', index, { ...item, icon: v })} /><Field label="Titel" value={item.title} onChange={(v) => updateItem(d, setD, 'items', index, { ...item, title: v })} /><Field label="Text" value={item.text} onChange={(v) => updateItem(d, setD, 'items', index, { ...item, text: v })} multiline /><Field label="Meta" value={item.metaLabel} onChange={(v) => updateItem(d, setD, 'items', index, { ...item, metaLabel: v })} /></div>} /></div>;
}

function BeforeAfterEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({ ...basicData(data), items: arr(data.items).map(beforeAfterFromData) });
  useReport(d, onChange);
  return <div className="space-y-3"><Basics d={d} setD={setD} /><Repeater items={d.items} addLabel="+ Transformation" onAdd={() => setD({ ...d, items: [...d.items, beforeAfterFromData({})] })} render={(item, index) => <div className="space-y-3"><Field label="Titel" value={item.title} onChange={(v) => updateItem(d, setD, 'items', index, { ...item, title: v })} /><Field label="Text" value={item.text} onChange={(v) => updateItem(d, setD, 'items', index, { ...item, text: v })} multiline /><div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><ImageUploadField label="Vorher" value={item.beforeImage} onChange={(v) => updateItem(d, setD, 'items', index, { ...item, beforeImage: v })} /><ImageUploadField label="Nachher" value={item.afterImage} onChange={(v) => updateItem(d, setD, 'items', index, { ...item, afterImage: v })} /></div><div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><Field label="Kategorie" value={item.category} onChange={(v) => updateItem(d, setD, 'items', index, { ...item, category: v })} /><Field label="Caption" value={item.caption} onChange={(v) => updateItem(d, setD, 'items', index, { ...item, caption: v })} /></div><ButtonField label="CTA" value={item.cta} onChange={(v) => updateItem(d, setD, 'items', index, { ...item, cta: v })} /></div>} /></div>;
}

function GalleryEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({ ...basicData(data) });
  const [categories, setCategories] = useState<string[]>(() => [...new Set(arr(data.images).map(i => str(i.category)).filter(Boolean))]);
  const [newCat, setNewCat] = useState('');
  const [images, setImages] = useState(arr(data.images).map(galleryFromData));
  const [openCats, setOpenCats] = useState<Record<string, boolean>>({});
  const [bulkUploading, setBulkUploading] = useState<string | null>(null);
  const bulkRefs = useRef<Record<string, HTMLInputElement | null>>({});
  useReport({ ...d, images }, onChange);

  function addCategory() { const name = newCat.trim(); if (!name || categories.includes(name)) return; setCategories([...categories, name]); setOpenCats({ ...openCats, [name]: true }); setNewCat(''); }
  function removeCategory(cat: string) { setCategories(categories.filter(c => c !== cat)); setImages(images.filter(img => img.category !== cat)); }

  async function handleBulkUpload(files: FileList, category: string) {
    setBulkUploading(category);
    const { upload } = await import('@vercel/blob/client');
    const { resizeImage } = await import('@/components/image-upload-field');
    const newImgs: { src: string; alt: string; caption: string; category: string }[] = [];
    for (const file of Array.from(files)) { if (!file.type.startsWith('image/')) continue; try { const optimized = await resizeImage(file, 1920, 0.85); const blob = await upload(file.name.replace(/\.[^.]+$/, '.webp'), optimized, { access: 'public', handleUploadUrl: '/api/upload' }); newImgs.push({ src: blob.url, alt: file.name.replace(/\.[^.]+$/, ''), caption: '', category });
        await saveMediaRecord({ blobUrl: blob.url, pathname: blob.pathname, filename: optimized.name, mimeType: optimized.type || 'image/webp', size: optimized.size }).catch(e => console.error("saveMediaRecord failed:", e)); } catch (e) { console.error(e); } }
    setImages(prev => [...prev, ...newImgs]); setBulkUploading(null);
  }

  const uncategorized = images.filter(img => !img.category || !categories.includes(img.category));
  return (
    <div className="space-y-3">
      <Basics d={d} setD={setD} />
      <div>
        <p className="text-xs font-medium text-zinc-600 mb-2">Kategorien</p>
        <div className="flex items-center gap-2 mb-2"><input className="admin-input flex-1" placeholder="Neue Kategorie…" value={newCat} onChange={(e) => setNewCat(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCategory())} /><button onClick={addCategory} className="px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 whitespace-nowrap">+ Hinzufügen</button></div>
      </div>
      {categories.map(cat => { const catImgs = images.filter(img => img.category === cat); const isOpen = openCats[cat]; return (
        <div key={cat} className="border border-zinc-200 rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 bg-zinc-50 cursor-pointer" onClick={() => setOpenCats({ ...openCats, [cat]: !isOpen })}><span className="text-sm font-medium text-zinc-700">{cat} <span className="text-zinc-400 font-normal">({catImgs.length})</span></span><div className="flex items-center gap-2"><button onClick={(e) => { e.stopPropagation(); removeCategory(cat); }} className="text-xs text-red-400 hover:text-red-600">Entfernen</button><span className="text-zinc-400 text-xs">{isOpen ? '▲' : '▼'}</span></div></div>
          {isOpen && (<div className="p-3 space-y-2">{catImgs.map((img) => { const i = images.indexOf(img); return (<div key={i} className="relative border border-zinc-100 rounded p-3"><button onClick={() => setImages(images.filter((_, idx) => idx !== i))} className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-xs">×</button><ImageUploadField label="Bild" value={img.src} onChange={(v) => setImages(images.map((im, idx) => idx === i ? { ...im, src: v } : im))} /><div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2"><Field label="Alt" value={img.alt} onChange={(v) => setImages(images.map((im, idx) => idx === i ? { ...im, alt: v } : im))} /><Field label="Caption" value={img.caption} onChange={(v) => setImages(images.map((im, idx) => idx === i ? { ...im, caption: v } : im))} /></div></div>); })}<div className="flex items-center gap-3 pt-1"><button onClick={() => setImages([...images, { src: '', alt: '', caption: '', category: cat }])} className="text-xs text-blue-600 hover:underline">+ Bild</button><button onClick={() => bulkRefs.current[cat]?.click()} disabled={bulkUploading === cat} className="text-xs text-blue-600 hover:underline disabled:opacity-50">{bulkUploading === cat ? '⏳ Hochladen...' : '+ Bulk Upload'}</button><input ref={(el) => { bulkRefs.current[cat] = el; }} type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/avif" multiple className="hidden" onChange={(e) => e.target.files && handleBulkUpload(e.target.files, cat)} />
                  <MediaBulkPickerButton onSelect={(imgs) => setImages(prev => [...prev, ...imgs.map(i => ({ src: i.src, alt: i.alt, caption: '', category: cat }))])} />
                  <MediaBulkPickerButton onSelect={(imgs) => setImages(prev => [...prev, ...imgs.map(i => ({ src: i.src, alt: i.alt, caption: '', category: cat }))])} /></div></div>)}
        </div>
      ); })}
      {uncategorized.length > 0 && (<div className="border border-amber-200 rounded-lg p-3"><p className="text-xs font-medium text-amber-700 mb-2">Ohne Kategorie ({uncategorized.length})</p>{uncategorized.map((img) => { const i = images.indexOf(img); return (<div key={i} className="relative border border-zinc-100 rounded p-3 mb-2"><button onClick={() => setImages(images.filter((_, idx) => idx !== i))} className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-xs">×</button><ImageUploadField label="Bild" value={img.src} onChange={(v) => setImages(images.map((im, idx) => idx === i ? { ...im, src: v } : im))} /><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-2"><Field label="Alt" value={img.alt} onChange={(v) => setImages(images.map((im, idx) => idx === i ? { ...im, alt: v } : im))} /><Field label="Caption" value={img.caption} onChange={(v) => setImages(images.map((im, idx) => idx === i ? { ...im, caption: v } : im))} /><label className="block"><span className="text-gray-600 text-xs">Kategorie</span><select className="admin-input mt-1 w-full" value={img.category} onChange={(e) => setImages(images.map((im, idx) => idx === i ? { ...im, category: e.target.value } : im))}><option value="">—</option>{categories.map(c => <option key={c} value={c}>{c}</option>)}</select></label></div></div>); })}</div>)}
    </div>
  );
}

function TestimonialsEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({ ...basicData(data), ratingValue: str(data.ratingValue), ratingCount: str(data.ratingCount), items: arr(data.items).map(testimonialFromData), ctaPrimary: btn(data.ctaPrimary) });
  useReport(d, onChange);
  return <div className="space-y-3"><Basics d={d} setD={setD} /><div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><Field label="Rating" value={d.ratingValue} onChange={(v) => setD({ ...d, ratingValue: v })} /><Field label="Anzahl" value={d.ratingCount} onChange={(v) => setD({ ...d, ratingCount: v })} /></div><Repeater items={d.items} addLabel="+ Bewertung" onAdd={() => setD({ ...d, items: [...d.items, testimonialFromData({})] })} render={(item, index) => <div className="space-y-3"><Field label="Zitat" value={item.quote} onChange={(v) => updateItem(d, setD, 'items', index, { ...item, quote: v })} multiline /><div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><Field label="Name" value={item.name} onChange={(v) => updateItem(d, setD, 'items', index, { ...item, name: v })} /><Field label="Kontext" value={item.context} onChange={(v) => updateItem(d, setD, 'items', index, { ...item, context: v })} /></div><div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><Field label="Rating" value={String(item.rating)} onChange={(v) => updateItem(d, setD, 'items', index, { ...item, rating: Number(v) || 5 })} /><Field label="Quelle" value={item.sourceLabel} onChange={(v) => updateItem(d, setD, 'items', index, { ...item, sourceLabel: v })} /></div></div>} /><ButtonField label="CTA" value={d.ctaPrimary} onChange={(v) => setD({ ...d, ctaPrimary: v })} /></div>;
}

function OpeningHoursEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({ ...basicData(data), days: arr(data.days).map(dayFromData), bookingNote: str(data.bookingNote), ctaPrimary: btn(data.ctaPrimary) });
  useReport(d, onChange);
  return <div className="space-y-3"><Basics d={d} setD={setD} /><Repeater items={d.days} addLabel="+ Tag" onAdd={() => setD({ ...d, days: [...d.days, dayFromData({})] })} render={(item, index) => <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"><Field label="Tag" value={item.label} onChange={(v) => updateItem(d, setD, 'days', index, { ...item, label: v })} /><Field label="Zeit" value={item.hours} onChange={(v) => updateItem(d, setD, 'days', index, { ...item, hours: v })} /><Field label="Hinweis" value={item.note} onChange={(v) => updateItem(d, setD, 'days', index, { ...item, note: v })} /><Checkbox label="Geschlossen" checked={item.closed} onChange={(v) => updateItem(d, setD, 'days', index, { ...item, closed: v })} /></div>} /><Field label="Buchungshinweis" value={d.bookingNote} onChange={(v) => setD({ ...d, bookingNote: v })} multiline /><ButtonField label="CTA" value={d.ctaPrimary} onChange={(v) => setD({ ...d, ctaPrimary: v })} /></div>;
}

function BookingCtaEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({ ...basicData(data), introText: str(data.introText), onlineCta: btn(data.onlineCta), phoneCta: btn(data.phoneCta), whatsappCta: btn(data.whatsappCta), notes: join(data.notes) });
  useReport({ ...d, notes: lines(d.notes) }, onChange);
  return <div className="space-y-3"><Basics d={d} setD={setD} /><Field label="Intro" value={d.introText} onChange={(v) => setD({ ...d, introText: v })} multiline /><ButtonField label="Online CTA" value={d.onlineCta} onChange={(v) => setD({ ...d, onlineCta: v })} /><ButtonField label="Telefon CTA" value={d.phoneCta} onChange={(v) => setD({ ...d, phoneCta: v })} /><ButtonField label="WhatsApp CTA" value={d.whatsappCta} onChange={(v) => setD({ ...d, whatsappCta: v })} /><Field label="Hinweise" value={d.notes} onChange={(v) => setD({ ...d, notes: v })} multiline /></div>;
}

function LocationContactEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({ ...basicData(data), introText: str(data.introText), image: str(data.image), mapEmbedUrl: str(data.mapEmbedUrl), formEnabled: (data.formEnabled as boolean) ?? true, namePlaceholder: str(data.namePlaceholder), emailPlaceholder: str(data.emailPlaceholder), messagePlaceholder: str(data.messagePlaceholder), submitLabel: str(data.submitLabel), infoCards: arr(data.infoCards).map(infoCardFromData), primaryCta: btn(data.primaryCta), secondaryCta: btn(data.secondaryCta) });
  useReport(d, onChange);
  return <div className="space-y-3"><Basics d={d} setD={setD} /><Field label="Intro" value={d.introText} onChange={(v) => setD({ ...d, introText: v })} multiline /><ImageUploadField label="Bild" value={d.image} onChange={(v) => setD({ ...d, image: v })} /><Field label="Map Embed URL" value={d.mapEmbedUrl} onChange={(v) => setD({ ...d, mapEmbedUrl: v })} /><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"><Field label="Name Placeholder" value={d.namePlaceholder} onChange={(v) => setD({ ...d, namePlaceholder: v })} /><Field label="E-Mail Placeholder" value={d.emailPlaceholder} onChange={(v) => setD({ ...d, emailPlaceholder: v })} /><Field label="Nachricht Placeholder" value={d.messagePlaceholder} onChange={(v) => setD({ ...d, messagePlaceholder: v })} /></div><Field label="Submit-Label" value={d.submitLabel} onChange={(v) => setD({ ...d, submitLabel: v })} /><Checkbox label="Formular anzeigen" checked={d.formEnabled} onChange={(v) => setD({ ...d, formEnabled: v })} /><Repeater items={d.infoCards} addLabel="+ Info" onAdd={() => setD({ ...d, infoCards: [...d.infoCards, infoCardFromData({})] })} render={(item, index) => <div className="space-y-3"><IconPickerField label="Icon" value={item.icon} onChange={(v) => updateItem(d, setD, 'infoCards', index, { ...item, icon: v })} /><Field label="Label" value={item.label} onChange={(v) => updateItem(d, setD, 'infoCards', index, { ...item, label: v })} /><Field label="Wert" value={item.value} onChange={(v) => updateItem(d, setD, 'infoCards', index, { ...item, value: v })} /></div>} /><ButtonField label="Primärer CTA" value={d.primaryCta} onChange={(v) => setD({ ...d, primaryCta: v })} /><ButtonField label="Sekundärer CTA" value={d.secondaryCta} onChange={(v) => setD({ ...d, secondaryCta: v })} /></div>;
}

function FaqEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({ ...basicData(data), items: arr(data.items).map(faqFromData), ctaPrimary: btn(data.ctaPrimary) });
  useReport(d, onChange);
  return <div className="space-y-3"><Basics d={d} setD={setD} /><Repeater items={d.items} addLabel="+ Frage" onAdd={() => setD({ ...d, items: [...d.items, faqFromData({})] })} render={(item, index) => <div className="space-y-3"><Field label="Frage" value={item.question} onChange={(v) => updateItem(d, setD, 'items', index, { ...item, question: v })} /><Field label="Antwort" value={item.answer} onChange={(v) => updateItem(d, setD, 'items', index, { ...item, answer: v })} multiline /></div>} /><ButtonField label="CTA" value={d.ctaPrimary} onChange={(v) => setD({ ...d, ctaPrimary: v })} /></div>;
}

const SALON_EDITORS: Record<string, React.FC<EditorProps>> = {
  hero: HeroEditor,
  serviceMenu: ServiceMenuEditor,
  priceList: PriceListEditor,
  treatmentDetail: TreatmentDetailEditor,
  packages: PackagesEditor,
  teamShowcase: TeamShowcaseEditor,
  expertiseGrid: ExpertiseGridEditor,
  beforeAfter: BeforeAfterEditor,
  gallery: GalleryEditor,
  testimonials: TestimonialsEditor,
  openingHours: OpeningHoursEditor,
  bookingCta: BookingCtaEditor,
  locationContact: LocationContactEditor,
  faq: FaqEditor,
};

function CardRepeaterEditor({ data, onChange, keyName, addLabel, factory, arrayKeys = [], withCta, ctaKey = 'cta' }: { data: Record<string, unknown>; onChange: (data: Record<string, unknown>) => void; keyName: string; addLabel: string; factory: (r: Record<string, unknown>) => any; arrayKeys?: string[]; withCta?: boolean; ctaKey?: string }) {
  const [d, setD] = useState<any>({ ...basicData(data), [keyName]: arr(data[keyName]).map(factory), ...(withCta ? { ctaPrimary: btn(data.ctaPrimary) } : {}) });
  useReport({ ...d, [keyName]: d[keyName].map((item: any) => arrayKeys.reduce((acc, key) => ({ ...acc, [key]: lines(acc[key]) }), item)) }, onChange);
  return <div className="space-y-3"><Basics d={d} setD={setD} /><Repeater items={d[keyName]} addLabel={addLabel} onAdd={() => setD({ ...d, [keyName]: [...d[keyName], factory({})] })} render={(item, index) => <div className="space-y-3">{cardFields({ item, index, d, setD, keyName })}{arrayKeys.map((key) => <Field key={key} label={key} value={item[key]} onChange={(v) => updateItem(d, setD, keyName, index, { ...item, [key]: v })} multiline />)}<ButtonField label="CTA" value={item[ctaKey]} onChange={(v) => updateItem(d, setD, keyName, index, { ...item, [ctaKey]: v })} /></div>} />{withCta && <ButtonField label="CTA" value={d.ctaPrimary} onChange={(v) => setD({ ...d, ctaPrimary: v })} />}</div>;
}

function cardFields({ item, index, d, setD, keyName }: any) {
  return <><Field label="Titel/Name" value={item.title || item.name} onChange={(v) => updateItem(d, setD, keyName, index, { ...item, title: v, name: item.name !== undefined ? v : item.name })} /><Field label="Text/Bio" value={item.text || item.bio} onChange={(v) => updateItem(d, setD, keyName, index, { ...item, text: v, bio: item.bio !== undefined ? v : item.bio })} multiline /><ImageUploadField label="Bild" value={item.image} onChange={(v) => updateItem(d, setD, keyName, index, { ...item, image: v })} /><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"><Field label="Kategorie/Rolle" value={item.category || item.role || item.resultLabel || item.typeLabel} onChange={(v) => updateItem(d, setD, keyName, index, { ...item, category: v, role: item.role !== undefined ? v : item.role, resultLabel: item.resultLabel !== undefined ? v : item.resultLabel, typeLabel: item.typeLabel !== undefined ? v : item.typeLabel })} /><Field label="Preis" value={item.priceLabel} onChange={(v) => updateItem(d, setD, keyName, index, { ...item, priceLabel: v })} /><Field label="Dauer/Gueltig" value={item.durationLabel || item.validUntilLabel} onChange={(v) => updateItem(d, setD, keyName, index, { ...item, durationLabel: v, validUntilLabel: item.validUntilLabel !== undefined ? v : item.validUntilLabel })} /></div></>;
}

function Basics({ d, setD }: { d: { headline: string; subline: string; badgeText: string }; setD: Dispatch<SetStateAction<any>> }) {
  return <><Field label="Badge-Text" value={d.badgeText} onChange={(v) => setD({ ...d, badgeText: v })} /><Field label="Headline" value={d.headline} onChange={(v) => setD({ ...d, headline: v })} /><Field label="Subline" value={d.subline} onChange={(v) => setD({ ...d, subline: v })} multiline /></>;
}
function Field({ label, value, onChange, multiline }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean }) { return <label className="block text-sm"><span className="text-gray-600 text-xs">{label}</span>{multiline ? <textarea className="admin-input mt-1 w-full" rows={3} value={value || ''} onChange={(e) => onChange(e.target.value)} /> : <input className="admin-input mt-1 w-full" value={value || ''} onChange={(e) => onChange(e.target.value)} />}</label>; }
function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) { return <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />{label}</label>; }
function Repeater({ items, addLabel, onAdd, render }: { items: any[]; addLabel: string; onAdd: () => void; render: (item: any, index: number) => React.ReactNode }) { return <div className="space-y-3">{items.map((item, index) => <div key={index} className="border rounded p-3">{render(item, index)}</div>)}<button type="button" className="text-sm text-blue-600" onClick={onAdd}>{addLabel}</button></div>; }
function useReport(data: Record<string, unknown>, onChange: (d: Record<string, unknown>) => void) { const isFirst = useRef(true); const serialized = JSON.stringify(data); useEffect(() => { if (isFirst.current) { isFirst.current = false; return; } onChange(JSON.parse(serialized)); }, [serialized, onChange]); }
function updateItem(d: any, setD: Dispatch<SetStateAction<any>>, key: string, index: number, value: any) { setD({ ...d, [key]: d[key].map((item: any, i: number) => i === index ? value : item) }); }
function updateNested(d: any, setD: Dispatch<SetStateAction<any>>, key: string, index: number, childKey: string, childIndex: number, value: any) { updateItem(d, setD, key, index, { ...d[key][index], [childKey]: d[key][index][childKey].map((item: any, i: number) => i === childIndex ? value : item) }); }
function basicData(data: Record<string, unknown>) { return { headline: str(data.headline), subline: str(data.subline), badgeText: str(data.badgeText) }; }
function str(value: unknown) { return (value as string) || ''; }
function arr(value: unknown): Record<string, unknown>[] { return Array.isArray(value) ? value as Record<string, unknown>[] : []; }
function btn(value: unknown): ButtonValue { return (value as ButtonValue) || { label: '', href: '' }; }
function join(value: unknown) { return Array.isArray(value) ? (value as string[]).join('\n') : ''; }
function lines(value: string): string[] { return (value || '').split('\n').map((item) => item.trim()).filter(Boolean); }
function cardListFromData(r: Record<string, unknown>) { return { title: str(r.title), text: str(r.text), image: str(r.image), category: str(r.category), services: join(r.services), cta: btn(r.cta) }; }
function priceCategoryFromData(r: Record<string, unknown>) { return { title: str(r.title), text: str(r.text), items: arr(r.items).map(priceItemFromData) }; }
function priceItemFromData(r: Record<string, unknown>) { return { name: str(r.name), description: str(r.description), durationLabel: str(r.durationLabel), priceLabel: str(r.priceLabel), note: str(r.note), cta: btn(r.cta) }; }
function treatmentFromData(r: Record<string, unknown>) { return { title: str(r.title), text: str(r.text), image: str(r.image), resultLabel: str(r.resultLabel), durationLabel: str(r.durationLabel), priceLabel: str(r.priceLabel), steps: join(r.steps), careTips: join(r.careTips), cta: btn(r.cta) }; }
function packageFromData(r: Record<string, unknown>) { return { title: str(r.title), text: str(r.text), image: str(r.image), priceLabel: str(r.priceLabel), validUntilLabel: str(r.validUntilLabel), includes: join(r.includes), cta: btn(r.cta) }; }
function memberFromData(r: Record<string, unknown>) { return { name: str(r.name), role: str(r.role), bio: str(r.bio), image: str(r.image), specialties: join(r.specialties), bookingCta: btn(r.bookingCta) }; }
function expertiseFromData(r: Record<string, unknown>) { return { icon: str(r.icon), title: str(r.title), text: str(r.text), metaLabel: str(r.metaLabel) }; }
function beforeAfterFromData(r: Record<string, unknown>) { return { title: str(r.title), text: str(r.text), beforeImage: str(r.beforeImage), afterImage: str(r.afterImage), category: str(r.category), caption: str(r.caption), cta: btn(r.cta) }; }
function galleryFromData(r: Record<string, unknown>) { return { src: str(r.src), alt: str(r.alt), caption: str(r.caption), category: str(r.category) }; }
function testimonialFromData(r: Record<string, unknown>) { return { quote: str(r.quote), name: str(r.name), context: str(r.context), rating: (r.rating as number) || 5, sourceLabel: str(r.sourceLabel) }; }
function dayFromData(r: Record<string, unknown>) { return { label: str(r.label), hours: str(r.hours), note: str(r.note), closed: Boolean(r.closed) }; }
function infoCardFromData(r: Record<string, unknown>) { return { icon: str(r.icon), label: str(r.label), value: str(r.value) }; }
function faqFromData(r: Record<string, unknown>) { return { question: str(r.question), answer: str(r.answer) }; }
