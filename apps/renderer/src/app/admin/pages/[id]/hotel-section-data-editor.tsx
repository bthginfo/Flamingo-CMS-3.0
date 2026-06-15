'use client';

import { type Dispatch, type SetStateAction, useEffect, useRef, useState } from 'react';
import { ImageUploadField } from '@/components/image-upload-field';
import { saveMediaRecord } from '@/app/admin/media-actions';
import { ButtonField, DetailLinkField } from '@/components/button-field';
import { IconPickerField } from '@/components/icon-picker-field';
import { MediaBulkPickerButton } from '@/components/media-bulk-picker';

type ButtonValue = { label: string; href: string };
type EditorProps = { data: Record<string, unknown>; onChange: (data: Record<string, unknown>) => void };

function useReport(data: Record<string, unknown>, onChange: (d: Record<string, unknown>) => void) {
  const isFirst = useRef(true);
  const serialized = JSON.stringify(data);
  useEffect(() => {
    if (isFirst.current) { isFirst.current = false; return; }
    onChange(JSON.parse(serialized));
  }, [serialized, onChange]);
}

export function HotelSectionDataEditor({ type, data, onChange }: { type: string; data: Record<string, unknown>; onChange: (data: Record<string, unknown>) => void }) {
  const Editor = HOTEL_EDITORS[type];
  return Editor ? <Editor data={data} onChange={onChange} /> : null;
}

export function hasHotelEditor(type: string): boolean {
  return Boolean(HOTEL_EDITORS[type]);
}

function HotelHeroEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({
    headline: (data.headline as string) || '',
    subline: (data.subline as string) || '',
    badgeText: (data.badgeText as string) || '',
    bgImage: (data.bgImage as string) || '',
    trustItems: ((data.trustItems as string[]) || []).join('\n'),
    primaryCta: (data.primaryCta as ButtonValue) || { label: '', href: '' },
    secondaryCta: (data.secondaryCta as ButtonValue) || { label: '', href: '' },
    availabilityHint: (data.availabilityHint as string) || '',
    ratingText: (data.ratingText as string) || '',
    imageEffect: (data.imageEffect as string) || 'none',
    imageEffectIntensity: (data.imageEffectIntensity as string) || 'medium',
    overlayColor: (data.overlayColor as string) || '#000000',
    overlayOpacity: (data.overlayOpacity as number) ?? -1,
  });
  useReport({ ...d, trustItems: lines(d.trustItems) }, onChange);
  return (
    <div className="space-y-3">
      <Field label="Badge-Text" value={d.badgeText} onChange={(v) => setD({ ...d, badgeText: v })} />
      <Field label="Headline" value={d.headline} onChange={(v) => setD({ ...d, headline: v })} />
      <Field label="Subline" value={d.subline} onChange={(v) => setD({ ...d, subline: v })} multiline />
      <ImageUploadField label="Hintergrundbild" value={d.bgImage} onChange={(v) => setD({ ...d, bgImage: v })} />
      <Field label="Trust-Items (eine pro Zeile)" value={d.trustItems} onChange={(v) => setD({ ...d, trustItems: v })} multiline />
      <ButtonField label="Primärer CTA" value={d.primaryCta} onChange={(v) => setD({ ...d, primaryCta: v })} />
      <ButtonField label="Sekundärer CTA" value={d.secondaryCta} onChange={(v) => setD({ ...d, secondaryCta: v })} />
      <Field label="Verfuegbarkeits-Hinweis" value={d.availabilityHint} onChange={(v) => setD({ ...d, availabilityHint: v })} />
      <Field label="Rating-Text" value={d.ratingText} onChange={(v) => setD({ ...d, ratingText: v })} />
      <div><label className="text-xs font-medium text-zinc-600 mb-1 block">Bild-Effekt</label><select className="admin-input" value={d.imageEffect} onChange={(e) => setD({ ...d, imageEffect: e.target.value })}><option value="none">Kein Effekt</option><option value="parallax">Parallax</option><option value="kenBurns">Ken Burns (Zoom)</option></select>{d.imageEffect !== 'none' && (<select className="admin-input mt-2" value={d.imageEffectIntensity} onChange={(e) => setD({ ...d, imageEffectIntensity: e.target.value })}><option value="subtle">Dezent</option><option value="medium">Mittel</option><option value="strong">Stark</option></select>)}</div>
      <label className="block"><span className="text-xs font-medium text-zinc-600">Overlay</span><div className="flex gap-2 mt-1.5"><button type="button" onClick={() => setD({ ...d, overlayOpacity: -1, overlayColor: '#000000' })} className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${d.overlayOpacity === -1 ? 'bg-blue-500 text-white' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'}`}>Standard</button><button type="button" onClick={() => setD({ ...d, overlayOpacity: 0.5 })} className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${d.overlayOpacity > 0 ? 'bg-blue-500 text-white' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'}`}>Eigene Farbe</button><button type="button" onClick={() => setD({ ...d, overlayOpacity: 0 })} className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${d.overlayOpacity === 0 ? 'bg-blue-500 text-white' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'}`}>Kein Overlay</button></div></label>
      {d.overlayOpacity > 0 && (<div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><label className="block"><span className="text-xs font-medium text-zinc-600">Farbe</span><input type="color" className="admin-input mt-1 h-9 p-1 cursor-pointer" value={d.overlayColor} onChange={(e) => setD({ ...d, overlayColor: e.target.value })} /></label><label className="block"><span className="text-xs font-medium text-zinc-600">Deckkraft ({Math.round(d.overlayOpacity * 100)}%)</span><input type="range" min="0.05" max="1" step="0.05" className="w-full mt-2" value={d.overlayOpacity} onChange={(e) => setD({ ...d, overlayOpacity: parseFloat(e.target.value) })} /></label></div>)}
    </div>
  );
}

function BookingStripEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({
    headline: (data.headline as string) || '',
    subline: (data.subline as string) || '',
    badgeText: (data.badgeText as string) || '',
    arrivalLabel: (data.arrivalLabel as string) || '',
    departureLabel: (data.departureLabel as string) || '',
    guestsLabel: (data.guestsLabel as string) || '',
    roomLabel: (data.roomLabel as string) || '',
    submitCta: (data.submitCta as ButtonValue) || { label: '', href: '' },
    secondaryCta: (data.secondaryCta as ButtonValue) || { label: '', href: '' },
    bookingNote: (data.bookingNote as string) || '',
    fields: ((data.fields as Record<string, unknown>[]) || []).map(fieldFromData),
  });
  useReport(d as unknown as Record<string, unknown>, onChange);
  return (
    <div className="space-y-3">
      <Basics d={d} setD={setD} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="Anreise Label" value={d.arrivalLabel} onChange={(v) => setD({ ...d, arrivalLabel: v })} />
        <Field label="Abreise Label" value={d.departureLabel} onChange={(v) => setD({ ...d, departureLabel: v })} />
        <Field label="Gaeste Label" value={d.guestsLabel} onChange={(v) => setD({ ...d, guestsLabel: v })} />
        <Field label="Zimmer Label" value={d.roomLabel} onChange={(v) => setD({ ...d, roomLabel: v })} />
      </div>
      <ButtonField label="Submit CTA" value={d.submitCta} onChange={(v) => setD({ ...d, submitCta: v })} />
      <ButtonField label="Sekundärer CTA" value={d.secondaryCta} onChange={(v) => setD({ ...d, secondaryCta: v })} />
      <Field label="Buchungs-Hinweis" value={d.bookingNote} onChange={(v) => setD({ ...d, bookingNote: v })} multiline />
      <Repeater items={d.fields} addLabel="+ Feld" onAdd={() => setD({ ...d, fields: [...d.fields, fieldFromData({})] })} render={(field, index) => (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <Field label="Label" value={field.label} onChange={(v) => setD({ ...d, fields: updateAt(d.fields, index, { ...field, label: v }) })} />
          <Field label="Wert" value={field.value} onChange={(v) => setD({ ...d, fields: updateAt(d.fields, index, { ...field, value: v }) })} />
          <Field label="Typ" value={field.type} onChange={(v) => setD({ ...d, fields: updateAt(d.fields, index, { ...field, type: v }) })} />
        </div>
      )} />
    </div>
  );
}

function RoomShowcaseEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({
    headline: (data.headline as string) || '',
    subline: (data.subline as string) || '',
    badgeText: (data.badgeText as string) || '',
    rooms: ((data.rooms as Record<string, unknown>[]) || []).map(roomFromData),
    footerText: (data.footerText as string) || '',
  });
  useReport({ ...d, rooms: d.rooms.map((room) => ({ ...room, galleryImages: lines(room.galleryImages), features: lines(room.features) })) }, onChange);
  return (
    <div className="space-y-3">
      <Basics d={d} setD={setD} />
      <Repeater items={d.rooms} addLabel="+ Zimmer" onAdd={() => setD({ ...d, rooms: [...d.rooms, roomFromData({})] })} render={(room, index) => (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><Field label="Name" value={room.name} onChange={(v) => setD({ ...d, rooms: updateAt(d.rooms, index, { ...room, name: v }) })} /><Field label="Preis" value={room.priceLabel} onChange={(v) => setD({ ...d, rooms: updateAt(d.rooms, index, { ...room, priceLabel: v }) })} /></div>
          <Field label="Beschreibung" value={room.description} onChange={(v) => setD({ ...d, rooms: updateAt(d.rooms, index, { ...room, description: v }) })} multiline />
          <ImageUploadField label="Bild" value={room.image} onChange={(v) => setD({ ...d, rooms: updateAt(d.rooms, index, { ...room, image: v }) })} />
          <Field label="Galerie-Bilder (URLs, eine pro Zeile)" value={room.galleryImages} onChange={(v) => setD({ ...d, rooms: updateAt(d.rooms, index, { ...room, galleryImages: v }) })} multiline />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"><Field label="Groesse" value={room.sizeLabel} onChange={(v) => setD({ ...d, rooms: updateAt(d.rooms, index, { ...room, sizeLabel: v }) })} /><Field label="Belegung" value={room.occupancyLabel} onChange={(v) => setD({ ...d, rooms: updateAt(d.rooms, index, { ...room, occupancyLabel: v }) })} /><Field label="Bett" value={room.bedLabel} onChange={(v) => setD({ ...d, rooms: updateAt(d.rooms, index, { ...room, bedLabel: v }) })} /></div>
          <Field label="Features (eine pro Zeile)" value={room.features} onChange={(v) => setD({ ...d, rooms: updateAt(d.rooms, index, { ...room, features: v }) })} multiline />
          <ButtonField label="Detail CTA" value={room.detailCta} onChange={(v) => setD({ ...d, rooms: updateAt(d.rooms, index, { ...room, detailCta: v }) })} />
          <ButtonField label="Buchungs CTA" value={room.bookingCta} onChange={(v) => setD({ ...d, rooms: updateAt(d.rooms, index, { ...room, bookingCta: v }) })} />
          <Checkbox label="Highlight" checked={room.highlighted} onChange={(v) => setD({ ...d, rooms: updateAt(d.rooms, index, { ...room, highlighted: v }) })} />
        </div>
      )} />
      <Field label="Footer-Text" value={d.footerText} onChange={(v) => setD({ ...d, footerText: v })} multiline />
    </div>
  );
}

function OffersEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({ headline: (data.headline as string) || '', subline: (data.subline as string) || '', badgeText: (data.badgeText as string) || '', offers: ((data.offers as Record<string, unknown>[]) || []).map(offerFromData), fallbackText: (data.fallbackText as string) || '' });
  useReport({ ...d, offers: d.offers.map((offer) => ({ ...offer, includes: lines(offer.includes) })) }, onChange);
  return (
    <div className="space-y-3">
      <Basics d={d} setD={setD} />
      <Repeater items={d.offers} addLabel="+ Angebot" onAdd={() => setD({ ...d, offers: [...d.offers, offerFromData({})] })} render={(offer, index) => (
        <div className="space-y-3">
          <Field label="Titel" value={offer.title} onChange={(v) => setD({ ...d, offers: updateAt(d.offers, index, { ...offer, title: v }) })} />
          <Field label="Beschreibung" value={offer.description} onChange={(v) => setD({ ...d, offers: updateAt(d.offers, index, { ...offer, description: v }) })} multiline />
          <ImageUploadField label="Bild" value={offer.image} onChange={(v) => setD({ ...d, offers: updateAt(d.offers, index, { ...offer, image: v }) })} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"><Field label="Preis" value={offer.priceLabel} onChange={(v) => setD({ ...d, offers: updateAt(d.offers, index, { ...offer, priceLabel: v }) })} /><Field label="Dauer" value={offer.durationLabel} onChange={(v) => setD({ ...d, offers: updateAt(d.offers, index, { ...offer, durationLabel: v }) })} /><Field label="Gueltig bis" value={offer.validUntilLabel} onChange={(v) => setD({ ...d, offers: updateAt(d.offers, index, { ...offer, validUntilLabel: v }) })} /></div>
          <Field label="Inklusive (eine pro Zeile)" value={offer.includes} onChange={(v) => setD({ ...d, offers: updateAt(d.offers, index, { ...offer, includes: v }) })} multiline />
          <ButtonField label="CTA" value={offer.cta} onChange={(v) => setD({ ...d, offers: updateAt(d.offers, index, { ...offer, cta: v }) })} />
          <Field label="Detail-Link Label" value={offer.detailLabel} onChange={(v) => setD({ ...d, offers: updateAt(d.offers, index, { ...offer, detailLabel: v }) })} />
          <DetailLinkField label="Detail-Link" value={offer.detailHref} onChange={(v) => setD({ ...d, offers: updateAt(d.offers, index, { ...offer, detailHref: v }) })} />
          <Checkbox label="Highlight" checked={offer.highlighted} onChange={(v) => setD({ ...d, offers: updateAt(d.offers, index, { ...offer, highlighted: v }) })} />
        </div>
      )} />
      <Field label="Fallback-Text" value={d.fallbackText} onChange={(v) => setD({ ...d, fallbackText: v })} multiline />
    </div>
  );
}

function AmenitiesEditor({ data, onChange }: EditorProps) {
  return ListWithCtaEditor({
    data,
    onChange,
    itemKey: 'items',
    addLabel: '+ Ausstattung',
    itemFactory: amenityFromData,
    renderItem: ({ item, index, d, setD }) => (
      <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><Field label="Titel" value={item.title} onChange={(v) => setD({ ...d, items: updateAt(d.items, index, { ...item, title: v }) })} /><IconPickerField label="Icon" value={item.icon} onChange={(v) => setD({ ...d, items: updateAt(d.items, index, { ...item, icon: v }) })} /></div>
        <Field label="Text" value={item.text} onChange={(v) => setD({ ...d, items: updateAt(d.items, index, { ...item, text: v }) })} multiline />
        <Field label="Medientyp" value={item.mediaType} onChange={(v) => setD({ ...d, items: updateAt(d.items, index, { ...item, mediaType: v }) })} />
        <ImageUploadField label="Bild" value={item.image} onChange={(v) => setD({ ...d, items: updateAt(d.items, index, { ...item, image: v }) })} />
      </div>
    ),
  });
}

function WellnessEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({ headline: (data.headline as string) || '', subline: (data.subline as string) || '', badgeText: (data.badgeText as string) || '', introText: (data.introText as string) || '', imagePrimary: (data.imagePrimary as string) || '', imageSecondary: (data.imageSecondary as string) || '', treatments: ((data.treatments as Record<string, unknown>[]) || []).map(treatmentFromData), features: ((data.features as Record<string, unknown>[]) || []).map(featureFromData), ctaPrimary: (data.ctaPrimary as ButtonValue) || { label: '', href: '' } });
  useReport(d as unknown as Record<string, unknown>, onChange);
  return (
    <div className="space-y-3">
      <Basics d={d} setD={setD} />
      <Field label="Intro-Text" value={d.introText} onChange={(v) => setD({ ...d, introText: v })} multiline />
      <ImageUploadField label="Hauptbild" value={d.imagePrimary} onChange={(v) => setD({ ...d, imagePrimary: v })} />
      <ImageUploadField label="Zweitbild" value={d.imageSecondary} onChange={(v) => setD({ ...d, imageSecondary: v })} />
      <TreatmentRepeater d={d} setD={setD} />
      <FeatureRepeater d={d} setD={setD} />
      <ButtonField label="CTA" value={d.ctaPrimary} onChange={(v) => setD({ ...d, ctaPrimary: v })} />
    </div>
  );
}

function LocationEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({ headline: (data.headline as string) || '', subline: (data.subline as string) || '', badgeText: (data.badgeText as string) || '', addressText: (data.addressText as string) || '', mapEmbedUrl: (data.mapEmbedUrl as string) || '', image: (data.image as string) || '', transportItems: ((data.transportItems as Record<string, unknown>[]) || []).map(transportFromData), nearbyItems: ((data.nearbyItems as Record<string, unknown>[]) || []).map(nearbyFromData), routeCta: (data.routeCta as ButtonValue) || { label: '', href: '' } });
  useReport(d as unknown as Record<string, unknown>, onChange);
  return (
    <div className="space-y-3">
      <Basics d={d} setD={setD} />
      <Field label="Adresse" value={d.addressText} onChange={(v) => setD({ ...d, addressText: v })} multiline />
      <Field label="Map Embed URL" value={d.mapEmbedUrl} onChange={(v) => setD({ ...d, mapEmbedUrl: v })} />
      <ImageUploadField label="Bild" value={d.image} onChange={(v) => setD({ ...d, image: v })} />
      <TransportRepeater d={d} setD={setD} />
      <NearbyRepeater d={d} setD={setD} />
      <ButtonField label="Route CTA" value={d.routeCta} onChange={(v) => setD({ ...d, routeCta: v })} />
    </div>
  );
}

function HotelDiningEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({ headline: (data.headline as string) || '', subline: (data.subline as string) || '', badgeText: (data.badgeText as string) || '', introText: (data.introText as string) || '', image: (data.image as string) || '', openingText: (data.openingText as string) || '', menus: ((data.menus as Record<string, unknown>[]) || []).map(menuFromData), highlights: ((data.highlights as Record<string, unknown>[]) || []).map(highlightImageFromData), ctaPrimary: (data.ctaPrimary as ButtonValue) || { label: '', href: '' } });
  useReport(d as unknown as Record<string, unknown>, onChange);
  return <DiningLikeEditor d={d} setD={setD} />;
}

function EventSpacesEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({ headline: (data.headline as string) || '', subline: (data.subline as string) || '', badgeText: (data.badgeText as string) || '', spaces: ((data.spaces as Record<string, unknown>[]) || []).map(spaceFromData), processHeadline: (data.processHeadline as string) || '', processSteps: ((data.processSteps as Record<string, unknown>[]) || []).map(featureFromData), ctaPrimary: (data.ctaPrimary as ButtonValue) || { label: '', href: '' } });
  useReport({ ...d, spaces: d.spaces.map((space) => ({ ...space, seatingOptions: lines(space.seatingOptions), features: lines(space.features) })) }, onChange);
  return (
    <div className="space-y-3">
      <Basics d={d} setD={setD} />
      <Repeater items={d.spaces} addLabel="+ Raum" onAdd={() => setD({ ...d, spaces: [...d.spaces, spaceFromData({})] })} render={(space, index) => (
        <div className="space-y-3">
          <Field label="Name" value={space.name} onChange={(v) => setD({ ...d, spaces: updateAt(d.spaces, index, { ...space, name: v }) })} />
          <Field label="Beschreibung" value={space.description} onChange={(v) => setD({ ...d, spaces: updateAt(d.spaces, index, { ...space, description: v }) })} multiline />
          <ImageUploadField label="Bild" value={space.image} onChange={(v) => setD({ ...d, spaces: updateAt(d.spaces, index, { ...space, image: v }) })} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><Field label="Kapazitaet" value={space.capacityLabel} onChange={(v) => setD({ ...d, spaces: updateAt(d.spaces, index, { ...space, capacityLabel: v }) })} /><Field label="Groesse" value={space.sizeLabel} onChange={(v) => setD({ ...d, spaces: updateAt(d.spaces, index, { ...space, sizeLabel: v }) })} /></div>
          <Field label="Bestuhlungen" value={space.seatingOptions} onChange={(v) => setD({ ...d, spaces: updateAt(d.spaces, index, { ...space, seatingOptions: v }) })} multiline />
          <Field label="Features" value={space.features} onChange={(v) => setD({ ...d, spaces: updateAt(d.spaces, index, { ...space, features: v }) })} multiline />
          <ButtonField label="Anfrage CTA" value={space.inquiryCta} onChange={(v) => setD({ ...d, spaces: updateAt(d.spaces, index, { ...space, inquiryCta: v }) })} />
        </div>
      )} />
      <Field label="Prozess-Headline" value={d.processHeadline} onChange={(v) => setD({ ...d, processHeadline: v })} />
      <FeatureRepeater d={d} setD={setD} keyName="processSteps" />
      <ButtonField label="CTA" value={d.ctaPrimary} onChange={(v) => setD({ ...d, ctaPrimary: v })} />
    </div>
  );
}

function GalleryEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({ headline: (data.headline as string) || '', subline: (data.subline as string) || '', badgeText: (data.badgeText as string) || '', ctaPrimary: (data.ctaPrimary as ButtonValue) || { label: '', href: '' } });
  const [categories, setCategories] = useState<string[]>(() => {
    const imgs = ((data.images as Record<string, unknown>[]) || []).map(galleryFromData);
    return [...new Set(imgs.map(i => i.category).filter(Boolean))];
  });
  const [newCat, setNewCat] = useState('');
  const [images, setImages] = useState(() => ((data.images as Record<string, unknown>[]) || []).map(galleryFromData));
  const [openCats, setOpenCats] = useState<Record<string, boolean>>({});
  const [bulkUploading, setBulkUploading] = useState<string | null>(null);
  const bulkRefs = useRef<Record<string, HTMLInputElement | null>>({});
  useReport({ ...d, images } as unknown as Record<string, unknown>, onChange);

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

  async function handleBulkUpload(files: FileList, category: string) {
    setBulkUploading(category);
    const { upload } = await import('@vercel/blob/client');
    const { resizeImage } = await import('@/components/image-upload-field');
    const newImgs: { src: string; alt: string; caption: string; category: string }[] = [];
    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) continue;
      try {
        const optimized = await resizeImage(file, 1920, 0.85);
        const blob = await upload(file.name.replace(/\.[^.]+$/, '.webp'), optimized, { access: 'public', handleUploadUrl: '/api/upload' });
        newImgs.push({ src: blob.url, alt: file.name.replace(/\.[^.]+$/, ''), caption: '', category });
        await saveMediaRecord({ blobUrl: blob.url, pathname: blob.pathname, filename: optimized.name, mimeType: optimized.type || 'image/webp', size: optimized.size }).catch(e => console.error("saveMediaRecord failed:", e));
      } catch (e) { console.error('Bulk upload failed for', file.name, e); }
    }
    setImages(prev => [...prev, ...newImgs]);
    setBulkUploading(null);
  }

  const uncategorized = images.filter(img => !img.category || !categories.includes(img.category));
  return (
    <div className="space-y-3">
      <Basics d={d} setD={setD} />
      {/* Category management */}
      <div>
        <p className="text-xs font-medium text-zinc-600 mb-2">Kategorien</p>
        <div className="flex items-center gap-2 mb-2">
          <input className="admin-input flex-1" placeholder="Neue Kategorie…" value={newCat} onChange={(e) => setNewCat(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCategory())} />
          <button onClick={addCategory} className="px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 whitespace-nowrap">+ Hinzufügen</button>
        </div>
      </div>
      {/* Category accordions */}
      {categories.map(cat => {
        const catImages = images.filter(img => img.category === cat);
        const isOpen = openCats[cat];
        return (
          <div key={cat} className="border border-zinc-200 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 bg-zinc-50 cursor-pointer" onClick={() => setOpenCats({ ...openCats, [cat]: !isOpen })}>
              <span className="text-sm font-medium text-zinc-700">{cat} <span className="text-zinc-400 font-normal">({catImages.length})</span></span>
              <div className="flex items-center gap-2">
                <button onClick={(e) => { e.stopPropagation(); removeCategory(cat); }} className="text-xs text-red-400 hover:text-red-600">Entfernen</button>
                <span className="text-zinc-400 text-xs">{isOpen ? '▲' : '▼'}</span>
              </div>
            </div>
            {isOpen && (
              <div className="p-3 space-y-2">
                {catImages.map((img) => { const i = images.indexOf(img); return (
                  <div key={i} className="relative border border-zinc-100 rounded p-3">
                    <button onClick={() => setImages(images.filter((_, idx) => idx !== i))} className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-xs">×</button>
                    <ImageUploadField label="Bild" value={img.src} onChange={(v) => setImages(images.map((im, idx) => idx === i ? { ...im, src: v } : im))} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                      <Field label="Alt" value={img.alt} onChange={(v) => setImages(images.map((im, idx) => idx === i ? { ...im, alt: v } : im))} />
                      <Field label="Caption" value={img.caption} onChange={(v) => setImages(images.map((im, idx) => idx === i ? { ...im, caption: v } : im))} />
                    </div>
                  </div>
                ); })}
                <div className="flex items-center gap-3 pt-1">
                  <button onClick={() => setImages([...images, { src: '', alt: '', caption: '', category: cat }])} className="text-xs text-blue-600 hover:underline">+ Bild</button>
                  <button onClick={() => bulkRefs.current[cat]?.click()} disabled={bulkUploading === cat} className="text-xs text-blue-600 hover:underline disabled:opacity-50">{bulkUploading === cat ? '⏳ Hochladen...' : '+ Bulk Upload'}</button>
                  <input ref={(el) => { bulkRefs.current[cat] = el; }} type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/avif" multiple className="hidden" onChange={(e) => e.target.files && handleBulkUpload(e.target.files, cat)} />
                  <MediaBulkPickerButton onSelect={(imgs) => setImages(prev => [...prev, ...imgs.map(i => ({ src: i.src, alt: i.alt, caption: '', category: cat }))])} />
                  <MediaBulkPickerButton onSelect={(imgs) => setImages(prev => [...prev, ...imgs.map(i => ({ src: i.src, alt: i.alt, caption: '', category: cat }))])} />
                </div>
              </div>
            )}
          </div>
        );
      })}
      {/* Uncategorized */}
      {uncategorized.length > 0 && (
        <div className="border border-amber-200 rounded-lg p-3">
          <p className="text-xs font-medium text-amber-700 mb-2">Ohne Kategorie ({uncategorized.length})</p>
          {uncategorized.map((img) => { const i = images.indexOf(img); return (
            <div key={i} className="relative border border-zinc-100 rounded p-3 mb-2">
              <button onClick={() => setImages(images.filter((_, idx) => idx !== i))} className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-xs">×</button>
              <ImageUploadField label="Bild" value={img.src} onChange={(v) => setImages(images.map((im, idx) => idx === i ? { ...im, src: v } : im))} />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
                <Field label="Alt" value={img.alt} onChange={(v) => setImages(images.map((im, idx) => idx === i ? { ...im, alt: v } : im))} />
                <Field label="Caption" value={img.caption} onChange={(v) => setImages(images.map((im, idx) => idx === i ? { ...im, caption: v } : im))} />
                <label className="block"><span className="text-gray-600 text-xs">Kategorie</span><select className="admin-input mt-1 w-full" value={img.category} onChange={(e) => setImages(images.map((im, idx) => idx === i ? { ...im, category: e.target.value } : im))}><option value="">—</option>{categories.map(c => <option key={c} value={c}>{c}</option>)}</select></label>
              </div>
            </div>
          ); })}
        </div>
      )}
      <ButtonField label="CTA" value={d.ctaPrimary} onChange={(v) => setD({ ...d, ctaPrimary: v })} />
    </div>
  );
}

function TestimonialsEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({ headline: (data.headline as string) || '', subline: (data.subline as string) || '', badgeText: (data.badgeText as string) || '', ratingValue: (data.ratingValue as string) || '', ratingCount: (data.ratingCount as string) || '', sourceLabel: (data.sourceLabel as string) || '', items: ((data.items as Record<string, unknown>[]) || []).map(testimonialFromData), ctaPrimary: (data.ctaPrimary as ButtonValue) || { label: '', href: '' } });
  useReport(d as unknown as Record<string, unknown>, onChange);
  return <TestimonialsLikeEditor d={d} setD={setD} />;
}

function FaqEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({ headline: (data.headline as string) || '', subline: (data.subline as string) || '', badgeText: (data.badgeText as string) || '', items: ((data.items as Record<string, unknown>[]) || []).map(faqFromData), ctaPrimary: (data.ctaPrimary as ButtonValue) || { label: '', href: '' } });
  useReport(d as unknown as Record<string, unknown>, onChange);
  return (
    <div className="space-y-3">
      <Basics d={d} setD={setD} />
      <Repeater items={d.items} addLabel="+ Frage" onAdd={() => setD({ ...d, items: [...d.items, faqFromData({})] })} render={(item, index) => (
        <div className="space-y-3"><Field label="Frage" value={item.question} onChange={(v) => setD({ ...d, items: updateAt(d.items, index, { ...item, question: v }) })} /><Field label="Antwort" value={item.answer} onChange={(v) => setD({ ...d, items: updateAt(d.items, index, { ...item, answer: v }) })} multiline /></div>
      )} />
      <ButtonField label="CTA" value={d.ctaPrimary} onChange={(v) => setD({ ...d, ctaPrimary: v })} />
    </div>
  );
}

function ContactEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({ headline: (data.headline as string) || '', subline: (data.subline as string) || '', badgeText: (data.badgeText as string) || '', introText: (data.introText as string) || '', namePlaceholder: (data.namePlaceholder as string) || '', emailPlaceholder: (data.emailPlaceholder as string) || '', messagePlaceholder: (data.messagePlaceholder as string) || '', submitLabel: (data.submitLabel as string) || '', formEnabled: (data.formEnabled as boolean) ?? true, infoCards: ((data.infoCards as Record<string, unknown>[]) || []).map(infoCardFromData), contactCta: (data.contactCta as ButtonValue) || { label: '', href: '' }, routeCta: (data.routeCta as ButtonValue) || { label: '', href: '' }, image: (data.image as string) || '' });
  useReport(d as unknown as Record<string, unknown>, onChange);
  return <ContactLikeEditor d={d} setD={setD} />;
}

function HotelStoryEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({
    headline: (data.headline as string) || '', subline: (data.subline as string) || '', badgeText: (data.badgeText as string) || '',
    storyText: (data.storyText as string) || '',
    imagePrimary: (data.imagePrimary as string) || '', imageSecondary: (data.imageSecondary as string) || '',
    founderName: (data.founderName as string) || '', founderRole: (data.founderRole as string) || '', founderQuote: (data.founderQuote as string) || '',
    stats: ((data.stats as Record<string, unknown>[]) || []).map((s) => ({ value: (s.value as string) || '', label: (s.label as string) || '' })),
    values: ((data.values as Record<string, unknown>[]) || []).map(featureFromData),
    milestones: ((data.milestones as Record<string, unknown>[]) || []).map((m) => ({ year: (m.year as string) || '', title: (m.title as string) || '', text: (m.text as string) || '' })),
    ctaPrimary: (data.ctaPrimary as ButtonValue) || { label: '', href: '' },
  });
  useReport(d as unknown as Record<string, unknown>, onChange);
  return (
    <div className="space-y-3">
      <Basics d={d} setD={setD} />
      <Field label="Story-Text" value={d.storyText} onChange={(v) => setD({ ...d, storyText: v })} multiline />
      <ImageUploadField label="Hauptbild" value={d.imagePrimary} onChange={(v) => setD({ ...d, imagePrimary: v })} />
      <ImageUploadField label="Zweitbild" value={d.imageSecondary} onChange={(v) => setD({ ...d, imageSecondary: v })} />
      <Field label="Gruender-Name" value={d.founderName} onChange={(v) => setD({ ...d, founderName: v })} />
      <Field label="Gruender-Rolle" value={d.founderRole} onChange={(v) => setD({ ...d, founderRole: v })} />
      <Field label="Gruender-Zitat" value={d.founderQuote} onChange={(v) => setD({ ...d, founderQuote: v })} multiline />
      <p className="text-xs font-semibold text-gray-500 pt-2">Statistiken</p>
      <Repeater items={d.stats} addLabel="+ Statistik" onAdd={() => setD({ ...d, stats: [...d.stats, { value: '', label: '' }] })} render={(item, index) => (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><Field label="Wert" value={item.value} onChange={(v) => setD({ ...d, stats: updateAt(d.stats, index, { ...item, value: v }) })} /><Field label="Label" value={item.label} onChange={(v) => setD({ ...d, stats: updateAt(d.stats, index, { ...item, label: v }) })} /></div>
      )} />
      <p className="text-xs font-semibold text-gray-500 pt-2">Werte</p>
      <FeatureRepeater d={{ ...d, features: d.values }} setD={(next) => { const n = typeof next === 'function' ? next({ ...d, features: d.values }) : next; setD({ ...d, values: n.features }); }} keyName="features" />
      <p className="text-xs font-semibold text-gray-500 pt-2">Meilensteine</p>
      <Repeater items={d.milestones} addLabel="+ Meilenstein" onAdd={() => setD({ ...d, milestones: [...d.milestones, { year: '', title: '', text: '' }] })} render={(item, index) => (
        <div className="space-y-3"><Field label="Jahr" value={item.year} onChange={(v) => setD({ ...d, milestones: updateAt(d.milestones, index, { ...item, year: v }) })} /><Field label="Titel" value={item.title} onChange={(v) => setD({ ...d, milestones: updateAt(d.milestones, index, { ...item, title: v }) })} /><Field label="Text" value={item.text} onChange={(v) => setD({ ...d, milestones: updateAt(d.milestones, index, { ...item, text: v }) })} multiline /></div>
      )} />
      <ButtonField label="CTA" value={d.ctaPrimary} onChange={(v) => setD({ ...d, ctaPrimary: v })} />
    </div>
  );
}

const HOTEL_EDITORS: Record<string, React.FC<EditorProps>> = {
  hero: HotelHeroEditor,
  bookingStrip: BookingStripEditor,
  roomShowcase: RoomShowcaseEditor,
  offers: OffersEditor,
  amenities: AmenitiesEditor,
  wellness: WellnessEditor,
  location: LocationEditor,
  hotelDining: HotelDiningEditor,
  eventSpaces: EventSpacesEditor,
  gallery: GalleryEditor,
  testimonials: TestimonialsEditor,
  faq: FaqEditor,
  contact: ContactEditor,
  story: HotelStoryEditor,
};

function Basics({ d, setD }: { d: { headline: string; subline: string; badgeText: string }; setD: Dispatch<SetStateAction<any>> }) {
  return <><Field label="Badge-Text" value={d.badgeText} onChange={(v) => setD({ ...d, badgeText: v })} /><Field label="Headline" value={d.headline} onChange={(v) => setD({ ...d, headline: v })} /><Field label="Subline" value={d.subline} onChange={(v) => setD({ ...d, subline: v })} multiline /></>;
}

function Field({ label, value, onChange, multiline }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean }) {
  return <label className="block text-sm"><span className="text-gray-600 text-xs">{label}</span>{multiline ? <textarea className="admin-input mt-1 w-full" rows={3} value={value} onChange={(e) => onChange(e.target.value)} /> : <input className="admin-input mt-1 w-full" value={value} onChange={(e) => onChange(e.target.value)} />}</label>;
}

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />{label}</label>;
}

function Repeater({ items, addLabel, onAdd, render }: { items: any[]; addLabel: string; onAdd: () => void; render: (item: any, index: number) => React.ReactNode }) {
  return <div className="space-y-3">{items.map((item, index) => <div key={index} className="border rounded p-3">{render(item, index)}</div>)}<button className="text-sm text-blue-600" onClick={onAdd}>{addLabel}</button></div>;
}

function ListWithCtaEditor({ data, onChange, itemKey, addLabel, itemFactory, renderItem }: { data: Record<string, unknown>; onChange: (data: Record<string, unknown>) => void; itemKey: string; addLabel: string; itemFactory: (r: Record<string, unknown>) => any; renderItem: (args: { item: any; index: number; d: any; setD: Dispatch<SetStateAction<any>> }) => React.ReactNode }) {
  const [d, setD] = useState<any>({ headline: (data.headline as string) || '', subline: (data.subline as string) || '', badgeText: (data.badgeText as string) || '', [itemKey]: ((data[itemKey] as Record<string, unknown>[]) || []).map(itemFactory), ctaPrimary: (data.ctaPrimary as ButtonValue) || { label: '', href: '' } });
  useReport(d as Record<string, unknown>, onChange);
  return <div className="space-y-3"><Basics d={d} setD={setD} /><Repeater items={d[itemKey]} addLabel={addLabel} onAdd={() => setD({ ...d, [itemKey]: [...d[itemKey], itemFactory({})] })} render={(item, index) => renderItem({ item, index, d, setD })} /><ButtonField label="CTA" value={d.ctaPrimary} onChange={(v) => setD({ ...d, ctaPrimary: v })} /></div>;
}

function TreatmentRepeater({ d, setD }: { d: any; setD: Dispatch<SetStateAction<any>> }) {
  return <Repeater items={d.treatments} addLabel="+ Treatment" onAdd={() => setD({ ...d, treatments: [...d.treatments, treatmentFromData({})] })} render={(item, index) => <div className="space-y-3"><Field label="Titel" value={item.title} onChange={(v) => setD({ ...d, treatments: updateAt(d.treatments, index, { ...item, title: v }) })} /><Field label="Text" value={item.text} onChange={(v) => setD({ ...d, treatments: updateAt(d.treatments, index, { ...item, text: v }) })} multiline /><div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><Field label="Dauer" value={item.durationLabel} onChange={(v) => setD({ ...d, treatments: updateAt(d.treatments, index, { ...item, durationLabel: v }) })} /><Field label="Preis" value={item.priceLabel} onChange={(v) => setD({ ...d, treatments: updateAt(d.treatments, index, { ...item, priceLabel: v }) })} /></div><ImageUploadField label="Bild" value={item.image} onChange={(v) => setD({ ...d, treatments: updateAt(d.treatments, index, { ...item, image: v }) })} /><ButtonField label="CTA" value={item.cta} onChange={(v) => setD({ ...d, treatments: updateAt(d.treatments, index, { ...item, cta: v }) })} /></div>} />;
}

function FeatureRepeater({ d, setD, keyName = 'features' }: { d: any; setD: Dispatch<SetStateAction<any>>; keyName?: string }) {
  return <Repeater items={d[keyName]} addLabel="+ Feature" onAdd={() => setD({ ...d, [keyName]: [...d[keyName], featureFromData({})] })} render={(item, index) => <div className="space-y-3"><div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><Field label="Titel" value={item.title} onChange={(v) => setD({ ...d, [keyName]: updateAt(d[keyName], index, { ...item, title: v }) })} /><IconPickerField label="Icon" value={item.icon} onChange={(v) => setD({ ...d, [keyName]: updateAt(d[keyName], index, { ...item, icon: v }) })} /></div><Field label="Text" value={item.text} onChange={(v) => setD({ ...d, [keyName]: updateAt(d[keyName], index, { ...item, text: v }) })} multiline /></div>} />;
}

function TransportRepeater({ d, setD }: { d: any; setD: Dispatch<SetStateAction<any>> }) {
  return <Repeater items={d.transportItems} addLabel="+ Anreise" onAdd={() => setD({ ...d, transportItems: [...d.transportItems, transportFromData({})] })} render={(item, index) => <div className="space-y-3"><IconPickerField label="Icon" value={item.icon} onChange={(v) => setD({ ...d, transportItems: updateAt(d.transportItems, index, { ...item, icon: v }) })} /><div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><Field label="Label" value={item.label} onChange={(v) => setD({ ...d, transportItems: updateAt(d.transportItems, index, { ...item, label: v }) })} /><Field label="Wert" value={item.value} onChange={(v) => setD({ ...d, transportItems: updateAt(d.transportItems, index, { ...item, value: v }) })} /></div><Field label="Text" value={item.text} onChange={(v) => setD({ ...d, transportItems: updateAt(d.transportItems, index, { ...item, text: v }) })} multiline /></div>} />;
}

function NearbyRepeater({ d, setD }: { d: any; setD: Dispatch<SetStateAction<any>> }) {
  return <Repeater items={d.nearbyItems} addLabel="+ Umgebung" onAdd={() => setD({ ...d, nearbyItems: [...d.nearbyItems, nearbyFromData({})] })} render={(item, index) => <div className="space-y-3"><Field label="Titel" value={item.title} onChange={(v) => setD({ ...d, nearbyItems: updateAt(d.nearbyItems, index, { ...item, title: v }) })} /><Field label="Distanz" value={item.distanceLabel} onChange={(v) => setD({ ...d, nearbyItems: updateAt(d.nearbyItems, index, { ...item, distanceLabel: v }) })} /><Field label="Text" value={item.text} onChange={(v) => setD({ ...d, nearbyItems: updateAt(d.nearbyItems, index, { ...item, text: v }) })} multiline /><ImageUploadField label="Bild" value={item.image} onChange={(v) => setD({ ...d, nearbyItems: updateAt(d.nearbyItems, index, { ...item, image: v }) })} /></div>} />;
}

function DiningLikeEditor({ d, setD }: { d: any; setD: Dispatch<SetStateAction<any>> }) {
  return <div className="space-y-3"><Basics d={d} setD={setD} /><Field label="Intro-Text" value={d.introText} onChange={(v) => setD({ ...d, introText: v })} multiline /><ImageUploadField label="Bild" value={d.image} onChange={(v) => setD({ ...d, image: v })} /><Field label="Oeffnungszeiten Text" value={d.openingText} onChange={(v) => setD({ ...d, openingText: v })} /><Repeater items={d.menus} addLabel="+ Menue" onAdd={() => setD({ ...d, menus: [...d.menus, menuFromData({})] })} render={(item, index) => <div className="space-y-3"><Field label="Titel" value={item.title} onChange={(v) => setD({ ...d, menus: updateAt(d.menus, index, { ...item, title: v }) })} /><Field label="Beschreibung" value={item.description} onChange={(v) => setD({ ...d, menus: updateAt(d.menus, index, { ...item, description: v }) })} multiline /><div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><Field label="Zeit" value={item.timeLabel} onChange={(v) => setD({ ...d, menus: updateAt(d.menus, index, { ...item, timeLabel: v }) })} /><Field label="Preis" value={item.priceLabel} onChange={(v) => setD({ ...d, menus: updateAt(d.menus, index, { ...item, priceLabel: v }) })} /></div><ButtonField label="CTA" value={item.cta} onChange={(v) => setD({ ...d, menus: updateAt(d.menus, index, { ...item, cta: v }) })} /></div>} /><Repeater items={d.highlights} addLabel="+ Highlight" onAdd={() => setD({ ...d, highlights: [...d.highlights, highlightImageFromData({})] })} render={(item, index) => <div className="space-y-3"><Field label="Titel" value={item.title} onChange={(v) => setD({ ...d, highlights: updateAt(d.highlights, index, { ...item, title: v }) })} /><Field label="Text" value={item.text} onChange={(v) => setD({ ...d, highlights: updateAt(d.highlights, index, { ...item, text: v }) })} multiline /><ImageUploadField label="Bild" value={item.image} onChange={(v) => setD({ ...d, highlights: updateAt(d.highlights, index, { ...item, image: v }) })} /></div>} /><ButtonField label="CTA" value={d.ctaPrimary} onChange={(v) => setD({ ...d, ctaPrimary: v })} /></div>;
}

function TestimonialsLikeEditor({ d, setD }: { d: any; setD: Dispatch<SetStateAction<any>> }) {
  return <div className="space-y-3"><Basics d={d} setD={setD} /><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"><Field label="Rating" value={d.ratingValue} onChange={(v) => setD({ ...d, ratingValue: v })} /><Field label="Anzahl" value={d.ratingCount} onChange={(v) => setD({ ...d, ratingCount: v })} /><Field label="Quelle" value={d.sourceLabel} onChange={(v) => setD({ ...d, sourceLabel: v })} /></div><Repeater items={d.items} addLabel="+ Bewertung" onAdd={() => setD({ ...d, items: [...d.items, testimonialFromData({})] })} render={(item, index) => <div className="space-y-3"><Field label="Zitat" value={item.quote} onChange={(v) => setD({ ...d, items: updateAt(d.items, index, { ...item, quote: v }) })} multiline /><div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><Field label="Name" value={item.name} onChange={(v) => setD({ ...d, items: updateAt(d.items, index, { ...item, name: v }) })} /><Field label="Kontext" value={item.context} onChange={(v) => setD({ ...d, items: updateAt(d.items, index, { ...item, context: v }) })} /></div><div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><Field label="Rating" value={String(item.rating)} onChange={(v) => setD({ ...d, items: updateAt(d.items, index, { ...item, rating: Number(v) || 5 }) })} /><Field label="Aufenthalt" value={item.stayLabel} onChange={(v) => setD({ ...d, items: updateAt(d.items, index, { ...item, stayLabel: v }) })} /></div></div>} /><ButtonField label="CTA" value={d.ctaPrimary} onChange={(v) => setD({ ...d, ctaPrimary: v })} /></div>;
}

function ContactLikeEditor({ d, setD }: { d: any; setD: Dispatch<SetStateAction<any>> }) {
  return <div className="space-y-3"><Basics d={d} setD={setD} /><Field label="Intro-Text" value={d.introText} onChange={(v) => setD({ ...d, introText: v })} multiline /><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"><Field label="Name Placeholder" value={d.namePlaceholder} onChange={(v) => setD({ ...d, namePlaceholder: v })} /><Field label="E-Mail Placeholder" value={d.emailPlaceholder} onChange={(v) => setD({ ...d, emailPlaceholder: v })} /><Field label="Nachricht Placeholder" value={d.messagePlaceholder} onChange={(v) => setD({ ...d, messagePlaceholder: v })} /></div><Field label="Submit-Label" value={d.submitLabel} onChange={(v) => setD({ ...d, submitLabel: v })} /><Checkbox label="Formular anzeigen" checked={d.formEnabled} onChange={(v) => setD({ ...d, formEnabled: v })} /><Repeater items={d.infoCards} addLabel="+ Info" onAdd={() => setD({ ...d, infoCards: [...d.infoCards, infoCardFromData({})] })} render={(item, index) => <div className="space-y-3"><IconPickerField label="Icon" value={item.icon} onChange={(v) => setD({ ...d, infoCards: updateAt(d.infoCards, index, { ...item, icon: v }) })} /><Field label="Label" value={item.label} onChange={(v) => setD({ ...d, infoCards: updateAt(d.infoCards, index, { ...item, label: v }) })} /><Field label="Wert" value={item.value} onChange={(v) => setD({ ...d, infoCards: updateAt(d.infoCards, index, { ...item, value: v }) })} /></div>} /><ButtonField label="Kontakt CTA" value={d.contactCta} onChange={(v) => setD({ ...d, contactCta: v })} /><ButtonField label="Route CTA" value={d.routeCta} onChange={(v) => setD({ ...d, routeCta: v })} /><ImageUploadField label="Bild" value={d.image} onChange={(v) => setD({ ...d, image: v })} /></div>;
}

function lines(value: string): string[] { return value.split('\n').map((item) => item.trim()).filter(Boolean); }
function updateAt<T>(items: T[], index: number, value: T): T[] { return items.map((item, i) => i === index ? value : item); }
function fieldFromData(r: Record<string, unknown>) { return { label: (r.label as string) || '', value: (r.value as string) || '', type: (r.type as string) || '' }; }
function roomFromData(r: Record<string, unknown>) { return { name: (r.name as string) || '', description: (r.description as string) || '', image: (r.image as string) || '', galleryImages: ((r.galleryImages as string[]) || []).join('\n'), priceLabel: (r.priceLabel as string) || '', sizeLabel: (r.sizeLabel as string) || '', occupancyLabel: (r.occupancyLabel as string) || '', bedLabel: (r.bedLabel as string) || '', features: ((r.features as string[]) || []).join('\n'), detailCta: (r.detailCta as ButtonValue) || { label: '', href: '' }, bookingCta: (r.bookingCta as ButtonValue) || { label: '', href: '' }, highlighted: Boolean(r.highlighted) }; }
function offerFromData(r: Record<string, unknown>) { return { title: (r.title as string) || '', description: (r.description as string) || '', image: (r.image as string) || '', priceLabel: (r.priceLabel as string) || '', durationLabel: (r.durationLabel as string) || '', includes: ((r.includes as string[]) || []).join('\n'), validUntilLabel: (r.validUntilLabel as string) || '', cta: (r.cta as ButtonValue) || { label: '', href: '' }, detailHref: (r.detailHref as string) || '', detailLabel: (r.detailLabel as string) || '', highlighted: Boolean(r.highlighted) }; }
function amenityFromData(r: Record<string, unknown>) { return { icon: (r.icon as string) || '', title: (r.title as string) || '', text: (r.text as string) || '', image: (r.image as string) || '', mediaType: (r.mediaType as string) || 'icon' }; }
function treatmentFromData(r: Record<string, unknown>) { return { title: (r.title as string) || '', text: (r.text as string) || '', durationLabel: (r.durationLabel as string) || '', priceLabel: (r.priceLabel as string) || '', image: (r.image as string) || '', cta: (r.cta as ButtonValue) || { label: '', href: '' } }; }
function featureFromData(r: Record<string, unknown>) { return { icon: (r.icon as string) || '', title: (r.title as string) || '', text: (r.text as string) || '' }; }
function transportFromData(r: Record<string, unknown>) { return { icon: (r.icon as string) || '', label: (r.label as string) || '', value: (r.value as string) || '', text: (r.text as string) || '' }; }
function nearbyFromData(r: Record<string, unknown>) { return { title: (r.title as string) || '', distanceLabel: (r.distanceLabel as string) || '', text: (r.text as string) || '', image: (r.image as string) || '' }; }
function menuFromData(r: Record<string, unknown>) { return { title: (r.title as string) || '', description: (r.description as string) || '', timeLabel: (r.timeLabel as string) || '', priceLabel: (r.priceLabel as string) || '', cta: (r.cta as ButtonValue) || { label: '', href: '' } }; }
function highlightImageFromData(r: Record<string, unknown>) { return { title: (r.title as string) || '', text: (r.text as string) || '', image: (r.image as string) || '' }; }
function spaceFromData(r: Record<string, unknown>) { return { name: (r.name as string) || '', description: (r.description as string) || '', image: (r.image as string) || '', capacityLabel: (r.capacityLabel as string) || '', sizeLabel: (r.sizeLabel as string) || '', seatingOptions: ((r.seatingOptions as string[]) || []).join('\n'), features: ((r.features as string[]) || []).join('\n'), inquiryCta: (r.inquiryCta as ButtonValue) || { label: '', href: '' } }; }
function galleryFromData(r: Record<string, unknown>) { return { src: (r.src as string) || '', alt: (r.alt as string) || '', caption: (r.caption as string) || '', category: (r.category as string) || '' }; }
function testimonialFromData(r: Record<string, unknown>) { return { quote: (r.quote as string) || '', name: (r.name as string) || '', context: (r.context as string) || '', rating: (r.rating as number) || 5, stayLabel: (r.stayLabel as string) || '' }; }
function faqFromData(r: Record<string, unknown>) { return { question: (r.question as string) || '', answer: (r.answer as string) || '' }; }
function infoCardFromData(r: Record<string, unknown>) { return { icon: (r.icon as string) || '', label: (r.label as string) || '', value: (r.value as string) || '' }; }
