'use client';

import { type Dispatch, type SetStateAction, useEffect, useRef, useState } from 'react';
import { ImageUploadField } from '@/components/image-upload-field';
import { saveMediaRecord } from '@/app/admin/media-actions';
import { IconPickerField } from '@/components/icon-picker-field';
import { DetailLinkField } from '@/components/button-field';

type EditorProps = { data: Record<string, unknown>; onChange: (data: Record<string, unknown>) => void };

export function WeddingSectionDataEditor({ type, data, onChange }: { type: string; data: Record<string, unknown>; onChange: (data: Record<string, unknown>) => void }) {
  const Editor = WEDDING_EDITORS[type];
  return Editor ? <Editor data={data} onChange={onChange} /> : null;
}

export function hasWeddingEditor(type: string): boolean {
  return Boolean(WEDDING_EDITORS[type]);
}

function HeroEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({ coupleName: str(data.coupleName), date: str(data.date), venue: str(data.venue), bgImage: str(data.bgImage), overlayColor: str(data.overlayColor), overlayOpacity: str(data.overlayOpacity), tagline: str(data.tagline) , imageEffect: (data.imageEffect as string) || 'none', imageEffectIntensity: (data.imageEffectIntensity as string) || 'medium' });
  useReport(d, onChange);
  return <div className="space-y-3"><Field label="Paarnamen (z.B. Anna & Max)" value={d.coupleName} onChange={v => setD({ ...d, coupleName: v })} /><Field label="Datum (YYYY-MM-DD)" value={d.date} onChange={v => setD({ ...d, date: v })} /><Field label="Location" value={d.venue} onChange={v => setD({ ...d, venue: v })} /><Field label="Tagline" value={d.tagline} onChange={v => setD({ ...d, tagline: v })} /><ImageUploadField label="Hintergrundbild" value={d.bgImage} onChange={v => setD({ ...d, bgImage: v })} /><div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><Field label="Overlay-Farbe" value={d.overlayColor} onChange={v => setD({ ...d, overlayColor: v })} /><Field label="Overlay-Opacity (0-1)" value={d.overlayOpacity} onChange={v => setD({ ...d, overlayOpacity: v })} /></div><div><label className="text-xs font-medium text-zinc-600 mb-1 block">Bild-Effekt</label><select className="admin-input" value={d.imageEffect} onChange={(e) => setD({ ...d, imageEffect: e.target.value })}><option value="none">Kein Effekt</option><option value="parallax">Parallax</option><option value="kenBurns">Ken Burns (Zoom)</option></select>{d.imageEffect !== 'none' && (<select className="admin-input mt-2" value={d.imageEffectIntensity} onChange={(e) => setD({ ...d, imageEffectIntensity: e.target.value })}><option value="subtle">Dezent</option><option value="medium">Mittel</option><option value="strong">Stark</option></select>)}</div></div>;
}

function CoupleStoryEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({ headline: str(data.headline), subline: str(data.subline), milestones: arr(data.milestones).map(milestoneFromData) });
  useReport(d, onChange);
  return <div className="space-y-3"><Field label="Headline" value={d.headline} onChange={v => setD({ ...d, headline: v })} /><Field label="Subline" value={d.subline} onChange={v => setD({ ...d, subline: v })} multiline /><Repeater items={d.milestones} addLabel="+ Meilenstein" onAdd={() => setD({ ...d, milestones: [...d.milestones, milestoneFromData({})] })} render={(item, index) => <div className="space-y-3"><div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><Field label="Jahr" value={item.year} onChange={v => updateItem(d, setD, 'milestones', index, { ...item, year: v })} /><Field label="Titel" value={item.title} onChange={v => updateItem(d, setD, 'milestones', index, { ...item, title: v })} /></div><Field label="Text" value={item.text} onChange={v => updateItem(d, setD, 'milestones', index, { ...item, text: v })} multiline /><ImageUploadField label="Bild" value={item.image} onChange={v => updateItem(d, setD, 'milestones', index, { ...item, image: v })} /></div>} /></div>;
}

function EventScheduleEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({ headline: str(data.headline), subline: str(data.subline), events: arr(data.events).map(eventFromData) });
  useReport(d, onChange);
  return <div className="space-y-3"><Field label="Headline" value={d.headline} onChange={v => setD({ ...d, headline: v })} /><Field label="Subline" value={d.subline} onChange={v => setD({ ...d, subline: v })} multiline /><Repeater items={d.events} addLabel="+ Programmpunkt" onAdd={() => setD({ ...d, events: [...d.events, eventFromData({})] })} render={(item, index) => <div className="space-y-3"><div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><Field label="Uhrzeit" value={item.time} onChange={v => updateItem(d, setD, 'events', index, { ...item, time: v })} /><Field label="Titel" value={item.title} onChange={v => updateItem(d, setD, 'events', index, { ...item, title: v })} /></div><Field label="Beschreibung" value={item.description} onChange={v => updateItem(d, setD, 'events', index, { ...item, description: v })} /><div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><IconPickerField label="Icon" value={item.icon} onChange={v => updateItem(d, setD, 'events', index, { ...item, icon: v })} /><Field label="Ort" value={item.location} onChange={v => updateItem(d, setD, 'events', index, { ...item, location: v })} /></div></div>} /></div>;
}

function VenueInfoEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({ headline: str(data.headline), subline: str(data.subline), venues: arr(data.venues).map(venueFromData) });
  useReport(d, onChange);
  return <div className="space-y-3"><Field label="Headline" value={d.headline} onChange={v => setD({ ...d, headline: v })} /><Field label="Subline" value={d.subline} onChange={v => setD({ ...d, subline: v })} multiline /><Repeater items={d.venues} addLabel="+ Location" onAdd={() => setD({ ...d, venues: [...d.venues, venueFromData({})] })} render={(item, index) => <div className="space-y-3"><Field label="Name" value={item.name} onChange={v => updateItem(d, setD, 'venues', index, { ...item, name: v })} /><Field label="Adresse" value={item.address} onChange={v => updateItem(d, setD, 'venues', index, { ...item, address: v })} /><Field label="Beschreibung" value={item.description} onChange={v => updateItem(d, setD, 'venues', index, { ...item, description: v })} multiline /><ImageUploadField label="Bild" value={item.image} onChange={v => updateItem(d, setD, 'venues', index, { ...item, image: v })} /><Field label="Maps Embed URL" value={item.mapEmbed} onChange={v => updateItem(d, setD, 'venues', index, { ...item, mapEmbed: v })} /><Field label="Parkinfos" value={item.parkingInfo} onChange={v => updateItem(d, setD, 'venues', index, { ...item, parkingInfo: v })} /></div>} /></div>;
}

function TravelInfoEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({ headline: str(data.headline), subline: str(data.subline), sections: arr(data.sections).map(travelSectionFromData), hotels: arr(data.hotels).map(hotelFromData) });
  useReport(d, onChange);
  return <div className="space-y-3"><Field label="Headline" value={d.headline} onChange={v => setD({ ...d, headline: v })} /><Field label="Subline" value={d.subline} onChange={v => setD({ ...d, subline: v })} multiline /><h4 className="text-xs font-medium text-gray-500 mt-4">Anreise-Optionen</h4><Repeater items={d.sections} addLabel="+ Option" onAdd={() => setD({ ...d, sections: [...d.sections, travelSectionFromData({})] })} render={(item, index) => <div className="space-y-3"><IconPickerField label="Icon" value={item.icon} onChange={v => updateItem(d, setD, 'sections', index, { ...item, icon: v })} /><Field label="Titel" value={item.title} onChange={v => updateItem(d, setD, 'sections', index, { ...item, title: v })} /><Field label="Inhalt" value={item.content} onChange={v => updateItem(d, setD, 'sections', index, { ...item, content: v })} multiline /></div>} /><h4 className="text-xs font-medium text-gray-500 mt-4">Hotels</h4><Repeater items={d.hotels} addLabel="+ Hotel" onAdd={() => setD({ ...d, hotels: [...d.hotels, hotelFromData({})] })} render={(item, index) => <div className="space-y-3"><Field label="Name" value={item.name} onChange={v => updateItem(d, setD, 'hotels', index, { ...item, name: v })} /><ImageUploadField label="Bild" value={item.image} onChange={v => updateItem(d, setD, 'hotels', index, { ...item, image: v })} /><div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><DetailLinkField label="Link" value={item.link} onChange={v => updateItem(d, setD, 'hotels', index, { ...item, link: v })} /><Field label="Entfernung" value={item.distance} onChange={v => updateItem(d, setD, 'hotels', index, { ...item, distance: v })} /></div><div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><Field label="Sonderkonditionen" value={item.specialRate} onChange={v => updateItem(d, setD, 'hotels', index, { ...item, specialRate: v })} /><Field label="Sterne" value={item.stars} onChange={v => updateItem(d, setD, 'hotels', index, { ...item, stars: v })} /></div></div>} /></div>;
}

function WeddingPartyEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({ headline: str(data.headline), subline: str(data.subline), members: arr(data.members).map(memberFromData) });
  useReport(d, onChange);
  return <div className="space-y-3"><Field label="Headline" value={d.headline} onChange={v => setD({ ...d, headline: v })} /><Field label="Subline" value={d.subline} onChange={v => setD({ ...d, subline: v })} multiline /><Repeater items={d.members} addLabel="+ Person" onAdd={() => setD({ ...d, members: [...d.members, memberFromData({})] })} render={(item, index) => <div className="space-y-3"><div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><Field label="Name" value={item.name} onChange={v => updateItem(d, setD, 'members', index, { ...item, name: v })} /><Field label="Rolle" value={item.role} onChange={v => updateItem(d, setD, 'members', index, { ...item, role: v })} /></div><Field label="Beziehung" value={item.relationship} onChange={v => updateItem(d, setD, 'members', index, { ...item, relationship: v })} /><Field label="Text" value={item.text} onChange={v => updateItem(d, setD, 'members', index, { ...item, text: v })} multiline /><ImageUploadField label="Bild" value={item.image} onChange={v => updateItem(d, setD, 'members', index, { ...item, image: v })} /></div>} /></div>;
}

function GiftRegistryEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({ headline: str(data.headline), subline: str(data.subline), freeText: str(data.freeText), gifts: arr(data.gifts).map(giftFromData), bankHolder: str((data.bankInfo as any)?.holder), bankIban: str((data.bankInfo as any)?.iban), bankBic: str((data.bankInfo as any)?.bic), bankNote: str((data.bankInfo as any)?.note) });
  useReport({ headline: d.headline, subline: d.subline, freeText: d.freeText, gifts: d.gifts, bankInfo: { holder: d.bankHolder, iban: d.bankIban, bic: d.bankBic, note: d.bankNote } }, onChange);
  return <div className="space-y-3"><Field label="Headline" value={d.headline} onChange={v => setD({ ...d, headline: v })} /><Field label="Subline" value={d.subline} onChange={v => setD({ ...d, subline: v })} multiline /><Field label="Freitext" value={d.freeText} onChange={v => setD({ ...d, freeText: v })} multiline /><Repeater items={d.gifts} addLabel="+ Geschenk" onAdd={() => setD({ ...d, gifts: [...d.gifts, giftFromData({})] })} render={(item, index) => <div className="space-y-3"><div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><Field label="Titel" value={item.title} onChange={v => updateItem(d, setD, 'gifts', index, { ...item, title: v })} /><Field label="Preis" value={item.price} onChange={v => updateItem(d, setD, 'gifts', index, { ...item, price: v })} /></div><Field label="Beschreibung" value={item.description} onChange={v => updateItem(d, setD, 'gifts', index, { ...item, description: v })} /><DetailLinkField label="Link" value={item.link} onChange={v => updateItem(d, setD, 'gifts', index, { ...item, link: v })} /><Checkbox label="Bereits reserviert" checked={item.claimed} onChange={v => updateItem(d, setD, 'gifts', index, { ...item, claimed: v })} /></div>} /><h4 className="text-xs font-medium text-gray-500 mt-4">Bankverbindung</h4><div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><Field label="Inhaber" value={d.bankHolder} onChange={v => setD({ ...d, bankHolder: v })} /><Field label="IBAN" value={d.bankIban} onChange={v => setD({ ...d, bankIban: v })} /></div><div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><Field label="BIC" value={d.bankBic} onChange={v => setD({ ...d, bankBic: v })} /><Field label="Hinweis" value={d.bankNote} onChange={v => setD({ ...d, bankNote: v })} /></div></div>;
}

function DresscodeEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({ headline: str(data.headline), description: str(data.description), colors: join(data.colors), dos: join(data.dos), donts: join(data.donts), note: str(data.note) });
  useReport({ ...d, colors: lines(d.colors), dos: lines(d.dos), donts: lines(d.donts) }, onChange);
  return <div className="space-y-3"><Field label="Headline" value={d.headline} onChange={v => setD({ ...d, headline: v })} /><Field label="Beschreibung" value={d.description} onChange={v => setD({ ...d, description: v })} multiline /><Field label="Farben (Hex, eine pro Zeile)" value={d.colors} onChange={v => setD({ ...d, colors: v })} multiline /><Field label="Gerne gesehen (eine pro Zeile)" value={d.dos} onChange={v => setD({ ...d, dos: v })} multiline /><Field label="Bitte vermeiden (eine pro Zeile)" value={d.donts} onChange={v => setD({ ...d, donts: v })} multiline /><Field label="Hinweis" value={d.note} onChange={v => setD({ ...d, note: v })} /></div>;
}

function RsvpEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({ headline: str(data.headline), subline: str(data.subline), deadline: str(data.deadline), maxGuests: str(data.maxGuests || '5'), showSongWish: (data.showSongWish as boolean) !== false, showDietary: (data.showDietary as boolean) !== false, showAllergies: (data.showAllergies as boolean) !== false });
  useReport({ ...d, maxGuests: Number(d.maxGuests) || 5 }, onChange);
  return <div className="space-y-3"><Field label="Headline" value={d.headline} onChange={v => setD({ ...d, headline: v })} /><Field label="Subline" value={d.subline} onChange={v => setD({ ...d, subline: v })} multiline /><div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><Field label="Anmeldeschluss" value={d.deadline} onChange={v => setD({ ...d, deadline: v })} /><Field label="Max. Gäste pro Anmeldung" value={d.maxGuests} onChange={v => setD({ ...d, maxGuests: v })} /></div><Checkbox label="Musikwunsch anzeigen" checked={d.showSongWish} onChange={v => setD({ ...d, showSongWish: v })} /><Checkbox label="Ernährung anzeigen" checked={d.showDietary} onChange={v => setD({ ...d, showDietary: v })} /><Checkbox label="Allergien anzeigen" checked={d.showAllergies} onChange={v => setD({ ...d, showAllergies: v })} /></div>;
}

function WeddingMenuEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({ headline: str(data.headline), subline: str(data.subline), note: str(data.note), courses: arr(data.courses).map(courseFromData) });
  useReport(d, onChange);
  return <div className="space-y-3"><Field label="Headline" value={d.headline} onChange={v => setD({ ...d, headline: v })} /><Field label="Subline" value={d.subline} onChange={v => setD({ ...d, subline: v })} /><Repeater items={d.courses} addLabel="+ Gang" onAdd={() => setD({ ...d, courses: [...d.courses, courseFromData({})] })} render={(course, ci) => <div className="space-y-3"><Field label="Gang-Titel" value={course.title} onChange={v => updateItem(d, setD, 'courses', ci, { ...course, title: v })} /><Repeater items={course.items} addLabel="+ Gericht" onAdd={() => updateItem(d, setD, 'courses', ci, { ...course, items: [...course.items, { name: '', description: '' }] })} render={(item, ii) => <div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><Field label="Name" value={item.name} onChange={v => { const items = [...course.items]; items[ii] = { ...item, name: v }; updateItem(d, setD, 'courses', ci, { ...course, items }); }} /><Field label="Beschreibung" value={item.description} onChange={v => { const items = [...course.items]; items[ii] = { ...item, description: v }; updateItem(d, setD, 'courses', ci, { ...course, items }); }} /></div>} /></div>} /><Field label="Hinweis" value={d.note} onChange={v => setD({ ...d, note: v })} /></div>;
}

function FaqEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({ headline: str(data.headline), items: arr(data.items).map(faqFromData) });
  useReport(d, onChange);
  return <div className="space-y-3"><Field label="Headline" value={d.headline} onChange={v => setD({ ...d, headline: v })} /><Repeater items={d.items} addLabel="+ Frage" onAdd={() => setD({ ...d, items: [...d.items, faqFromData({})] })} render={(item, index) => <div className="space-y-3"><Field label="Frage" value={item.question} onChange={v => updateItem(d, setD, 'items', index, { ...item, question: v })} /><Field label="Antwort" value={item.answer} onChange={v => updateItem(d, setD, 'items', index, { ...item, answer: v })} multiline /></div>} /></div>;
}

function GalleryEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({ headline: str(data.headline), images: arr(data.images).map(imageFromData) });
  useReport(d, onChange);
  return <div className="space-y-3"><Field label="Headline" value={d.headline} onChange={v => setD({ ...d, headline: v })} /><Repeater items={d.images} addLabel="+ Bild" onAdd={() => setD({ ...d, images: [...d.images, imageFromData({})] })} render={(item, index) => <div className="space-y-3"><ImageUploadField label="Bild" value={item.src} onChange={v => updateItem(d, setD, 'images', index, { ...item, src: v })} /><Field label="Alt-Text" value={item.alt} onChange={v => updateItem(d, setD, 'images', index, { ...item, alt: v })} /></div>} /></div>;
}

const WEDDING_EDITORS: Record<string, React.FC<EditorProps>> = {
  hero: HeroEditor,
  coupleStory: CoupleStoryEditor,
  eventSchedule: EventScheduleEditor,
  venueInfo: VenueInfoEditor,
  travelInfo: TravelInfoEditor,
  weddingParty: WeddingPartyEditor,
  giftRegistry: GiftRegistryEditor,
  dresscode: DresscodeEditor,
  rsvp: RsvpEditor,
  weddingMenu: WeddingMenuEditor,
  faq: FaqEditor,
  gallery: GalleryEditor,
};

// Helpers
function Field({ label, value, onChange, multiline }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean }) { return <label className="block text-sm"><span className="text-gray-600 text-xs">{label}</span>{multiline ? <textarea className="admin-input mt-1 w-full" rows={3} value={value || ''} onChange={e => onChange(e.target.value)} /> : <input className="admin-input mt-1 w-full" value={value || ''} onChange={e => onChange(e.target.value)} />}</label>; }
function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) { return <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />{label}</label>; }
function Repeater({ items, addLabel, onAdd, render }: { items: any[]; addLabel: string; onAdd: () => void; render: (item: any, index: number) => React.ReactNode }) { return <div className="space-y-3">{items.map((item, index) => <div key={index} className="border rounded p-3">{render(item, index)}</div>)}<button type="button" className="text-sm text-blue-600" onClick={onAdd}>{addLabel}</button></div>; }
function useReport(data: Record<string, unknown>, onChange: (d: Record<string, unknown>) => void) { const isFirst = useRef(true); const serialized = JSON.stringify(data); useEffect(() => { if (isFirst.current) { isFirst.current = false; return; } onChange(JSON.parse(serialized)); }, [serialized, onChange]); }
function updateItem(d: any, setD: Dispatch<SetStateAction<any>>, key: string, index: number, value: any) { setD({ ...d, [key]: d[key].map((item: any, i: number) => i === index ? value : item) }); }
function str(value: unknown) { return (value as string) || ''; }
function arr(value: unknown): Record<string, unknown>[] { return Array.isArray(value) ? value as Record<string, unknown>[] : []; }
function join(value: unknown) { return Array.isArray(value) ? (value as string[]).join('\n') : ''; }
function lines(value: string): string[] { return (value || '').split('\n').map(s => s.trim()).filter(Boolean); }
function milestoneFromData(r: Record<string, unknown>) { return { year: str(r.year), title: str(r.title), text: str(r.text), image: str(r.image) }; }
function eventFromData(r: Record<string, unknown>) { return { time: str(r.time), title: str(r.title), description: str(r.description), icon: str(r.icon), location: str(r.location) }; }
function venueFromData(r: Record<string, unknown>) { return { name: str(r.name), image: str(r.image), address: str(r.address), description: str(r.description), mapEmbed: str(r.mapEmbed), parkingInfo: str(r.parkingInfo) }; }
function travelSectionFromData(r: Record<string, unknown>) { return { title: str(r.title), icon: str(r.icon), content: str(r.content) }; }
function hotelFromData(r: Record<string, unknown>) { return { name: str(r.name), image: str(r.image), link: str(r.link), distance: str(r.distance), specialRate: str(r.specialRate), stars: str(r.stars) }; }
function memberFromData(r: Record<string, unknown>) { return { name: str(r.name), role: str(r.role), relationship: str(r.relationship), text: str(r.text), image: str(r.image) }; }
function giftFromData(r: Record<string, unknown>) { return { title: str(r.title), description: str(r.description), link: str(r.link), price: str(r.price), claimed: Boolean(r.claimed) }; }
function courseFromData(r: Record<string, unknown>) { return { title: str(r.title), items: (Array.isArray(r.items) ? r.items : []).map((i: any) => ({ name: str(i?.name), description: str(i?.description) })) }; }
function faqFromData(r: Record<string, unknown>) { return { question: str(r.question), answer: str(r.answer) }; }
function imageFromData(r: Record<string, unknown>) { return { src: str(r.src), alt: str(r.alt) }; }
