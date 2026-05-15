'use client';

import { type Dispatch, type SetStateAction, useEffect, useRef, useState } from 'react';
import { ImageUploadField } from '@/components/image-upload-field';
import { ButtonField } from '@/components/button-field';
import { IconPickerField } from '@/components/icon-picker-field';

type ButtonValue = { label: string; href: string };
type EditorProps = { data: Record<string, unknown>; onChange: (data: Record<string, unknown>) => void };

export function TourismSectionDataEditor({ type, data, onChange }: { type: string; data: Record<string, unknown>; onChange: (data: Record<string, unknown>) => void }) {
  const Editor = TOURISM_EDITORS[type];
  return Editor ? <Editor data={data} onChange={onChange} /> : null;
}

export function hasTourismEditor(type: string): boolean {
  return Boolean(TOURISM_EDITORS[type]);
}

function TourismHeroEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({
    headline: str(data.headline), subline: str(data.subline), badgeText: str(data.badgeText), bgImage: str(data.bgImage),
    locationLabel: str(data.locationLabel), seasonLabel: str(data.seasonLabel), trustItems: join(data.trustItems),
    primaryCta: btn(data.primaryCta), secondaryCta: btn(data.secondaryCta),
  });
  useReport({ ...d, trustItems: lines(d.trustItems) }, onChange);
  return <div className="space-y-3"><Basics d={d} setD={setD} /><ImageUploadField label="Hintergrundbild" value={d.bgImage} onChange={(v) => setD({ ...d, bgImage: v })} /><div className="grid grid-cols-2 gap-3"><Field label="Ort/Region" value={d.locationLabel} onChange={(v) => setD({ ...d, locationLabel: v })} /><Field label="Saison" value={d.seasonLabel} onChange={(v) => setD({ ...d, seasonLabel: v })} /></div><Field label="Trust-Items" value={d.trustItems} onChange={(v) => setD({ ...d, trustItems: v })} multiline /><ButtonField label="Primaerer CTA" value={d.primaryCta} onChange={(v) => setD({ ...d, primaryCta: v })} /><ButtonField label="Sekundaerer CTA" value={d.secondaryCta} onChange={(v) => setD({ ...d, secondaryCta: v })} /></div>;
}

function DestinationHighlightsEditor({ data, onChange }: EditorProps) {
  return CardListEditor({ data, onChange, itemKey: 'items', addLabel: '+ Highlight', itemFactory: imageCardFromData, renderItem: imageCardFields });
}

function ExperienceGridEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({ ...basicData(data), items: arr(data.items).map(experienceFromData), ctaPrimary: btn(data.ctaPrimary) });
  useReport(d, onChange);
  return <div className="space-y-3"><Basics d={d} setD={setD} /><Repeater items={d.items} addLabel="+ Erlebnis" onAdd={() => setD({ ...d, items: [...d.items, experienceFromData({})] })} render={(item, index) => <div className="space-y-3">{imageCardFields({ item, index, d, setD, keyName: 'items' })}<div className="grid grid-cols-4 gap-3"><Field label="Dauer" value={item.durationLabel} onChange={(v) => updateItem(d, setD, 'items', index, { ...item, durationLabel: v })} /><Field label="Zielgruppe" value={item.audienceLabel} onChange={(v) => updateItem(d, setD, 'items', index, { ...item, audienceLabel: v })} /><Field label="Schwierigkeit" value={item.difficultyLabel} onChange={(v) => updateItem(d, setD, 'items', index, { ...item, difficultyLabel: v })} /><Field label="Preis" value={item.priceLabel} onChange={(v) => updateItem(d, setD, 'items', index, { ...item, priceLabel: v })} /></div></div>} /><ButtonField label="CTA" value={d.ctaPrimary} onChange={(v) => setD({ ...d, ctaPrimary: v })} /></div>;
}

function SeasonTeaserEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({ ...basicData(data), seasons: arr(data.seasons).map(seasonFromData) });
  useReport(d, onChange);
  return <div className="space-y-3"><Basics d={d} setD={setD} /><Repeater items={d.seasons} addLabel="+ Saison" onAdd={() => setD({ ...d, seasons: [...d.seasons, seasonFromData({})] })} render={(item, index) => <div className="space-y-3">{imageCardFields({ item, index, d, setD, keyName: 'seasons' })}<Field label="Zeitraum" value={item.periodLabel} onChange={(v) => updateItem(d, setD, 'seasons', index, { ...item, periodLabel: v })} /></div>} /></div>;
}

function EventsCalendarEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({ ...basicData(data), events: arr(data.events).map(eventFromData), fallbackText: str(data.fallbackText) });
  useReport(d, onChange);
  return <div className="space-y-3"><Basics d={d} setD={setD} /><Repeater items={d.events} addLabel="+ Event" onAdd={() => setD({ ...d, events: [...d.events, eventFromData({})] })} render={(item, index) => <div className="space-y-3">{imageCardFields({ item, index, d, setD, keyName: 'events' })}<div className="grid grid-cols-5 gap-3"><Field label="Datum" value={item.dateLabel} onChange={(v) => updateItem(d, setD, 'events', index, { ...item, dateLabel: v })} /><Field label="Zeit" value={item.timeLabel} onChange={(v) => updateItem(d, setD, 'events', index, { ...item, timeLabel: v })} /><Field label="Ort" value={item.locationLabel} onChange={(v) => updateItem(d, setD, 'events', index, { ...item, locationLabel: v })} /><Field label="Kategorie" value={item.category} onChange={(v) => updateItem(d, setD, 'events', index, { ...item, category: v })} /><Field label="Preis" value={item.priceLabel} onChange={(v) => updateItem(d, setD, 'events', index, { ...item, priceLabel: v })} /></div></div>} /><Field label="Fallback-Text" value={d.fallbackText} onChange={(v) => setD({ ...d, fallbackText: v })} multiline /></div>;
}

function PlacesMapEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({ ...basicData(data), mapEmbedUrl: str(data.mapEmbedUrl), mapFallbackText: str(data.mapFallbackText), places: arr(data.places).map(placeFromData), ctaPrimary: btn(data.ctaPrimary) });
  useReport(d, onChange);
  return <div className="space-y-3"><Basics d={d} setD={setD} /><Field label="Map Embed URL" value={d.mapEmbedUrl} onChange={(v) => setD({ ...d, mapEmbedUrl: v })} /><Field label="Map Fallback Text" value={d.mapFallbackText} onChange={(v) => setD({ ...d, mapFallbackText: v })} /><Repeater items={d.places} addLabel="+ Ort" onAdd={() => setD({ ...d, places: [...d.places, placeFromData({})] })} render={(item, index) => <div className="space-y-3">{imageCardFields({ item, index, d, setD, keyName: 'places' })}<div className="grid grid-cols-3 gap-3"><Field label="Distanz" value={item.distanceLabel} onChange={(v) => updateItem(d, setD, 'places', index, { ...item, distanceLabel: v })} /><Field label="Adresse" value={item.address} onChange={(v) => updateItem(d, setD, 'places', index, { ...item, address: v })} /></div></div>} /><ButtonField label="CTA" value={d.ctaPrimary} onChange={(v) => setD({ ...d, ctaPrimary: v })} /></div>;
}

function SightseeingListEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({ ...basicData(data), items: arr(data.items).map(sightFromData) });
  useReport(d, onChange);
  return <div className="space-y-3"><Basics d={d} setD={setD} /><Repeater items={d.items} addLabel="+ Sehenswuerdigkeit" onAdd={() => setD({ ...d, items: [...d.items, sightFromData({})] })} render={(item, index) => <div className="space-y-3">{imageCardFields({ item, index, d, setD, keyName: 'items' })}<div className="grid grid-cols-2 gap-3"><Field label="Oeffnungszeiten" value={item.openingText} onChange={(v) => updateItem(d, setD, 'items', index, { ...item, openingText: v })} /><Field label="Kategorie" value={item.category} onChange={(v) => updateItem(d, setD, 'items', index, { ...item, category: v })} /></div></div>} /></div>;
}

function TourRoutesEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({ ...basicData(data), routes: arr(data.routes).map(routeFromData), ctaPrimary: btn(data.ctaPrimary) });
  useReport({ ...d, routes: d.routes.map((route) => ({ ...route, highlights: lines(route.highlights) })) }, onChange);
  return <div className="space-y-3"><Basics d={d} setD={setD} /><Repeater items={d.routes} addLabel="+ Route" onAdd={() => setD({ ...d, routes: [...d.routes, routeFromData({})] })} render={(item, index) => <div className="space-y-3">{imageCardFields({ item, index, d, setD, keyName: 'routes' })}<div className="grid grid-cols-4 gap-3"><Field label="Laenge" value={item.lengthLabel} onChange={(v) => updateItem(d, setD, 'routes', index, { ...item, lengthLabel: v })} /><Field label="Dauer" value={item.durationLabel} onChange={(v) => updateItem(d, setD, 'routes', index, { ...item, durationLabel: v })} /><Field label="Schwierigkeit" value={item.difficultyLabel} onChange={(v) => updateItem(d, setD, 'routes', index, { ...item, difficultyLabel: v })} /><Field label="Start" value={item.startLabel} onChange={(v) => updateItem(d, setD, 'routes', index, { ...item, startLabel: v })} /></div><Field label="Highlights" value={item.highlights} onChange={(v) => updateItem(d, setD, 'routes', index, { ...item, highlights: v })} multiline /></div>} /><ButtonField label="CTA" value={d.ctaPrimary} onChange={(v) => setD({ ...d, ctaPrimary: v })} /></div>;
}

function AccommodationGridEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({ ...basicData(data), items: arr(data.items).map(accommodationFromData) });
  useReport({ ...d, items: d.items.map((item) => ({ ...item, amenities: lines(item.amenities) })) }, onChange);
  return <div className="space-y-3"><Basics d={d} setD={setD} /><Repeater items={d.items} addLabel="+ Unterkunft" onAdd={() => setD({ ...d, items: [...d.items, accommodationFromData({})] })} render={(item, index) => <div className="space-y-3">{imageCardFields({ item, index, d, setD, keyName: 'items' })}<div className="grid grid-cols-2 gap-3"><Field label="Typ" value={item.typeLabel} onChange={(v) => updateItem(d, setD, 'items', index, { ...item, typeLabel: v })} /><Field label="Preis" value={item.priceLabel} onChange={(v) => updateItem(d, setD, 'items', index, { ...item, priceLabel: v })} /></div><Field label="Ausstattung" value={item.amenities} onChange={(v) => updateItem(d, setD, 'items', index, { ...item, amenities: v })} multiline /></div>} /></div>;
}

function VisitorInfoEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({ ...basicData(data), introText: str(data.introText), blocks: arr(data.blocks).map(blockFromData) });
  useReport({ ...d, blocks: d.blocks.map((block) => ({ ...block, items: lines(block.items) })) }, onChange);
  return <div className="space-y-3"><Basics d={d} setD={setD} /><Field label="Intro" value={d.introText} onChange={(v) => setD({ ...d, introText: v })} multiline /><Repeater items={d.blocks} addLabel="+ Infoblock" onAdd={() => setD({ ...d, blocks: [...d.blocks, blockFromData({})] })} render={(item, index) => <div className="space-y-3"><IconPickerField label="Icon" value={item.icon} onChange={(v) => updateItem(d, setD, 'blocks', index, { ...item, icon: v })} /><Field label="Titel" value={item.title} onChange={(v) => updateItem(d, setD, 'blocks', index, { ...item, title: v })} /><Field label="Text" value={item.text} onChange={(v) => updateItem(d, setD, 'blocks', index, { ...item, text: v })} multiline /><Field label="Items" value={item.items} onChange={(v) => updateItem(d, setD, 'blocks', index, { ...item, items: v })} multiline /></div>} /></div>;
}

function DownloadGuidesEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({ ...basicData(data), items: arr(data.items).map(downloadFromData) });
  useReport(d, onChange);
  return <div className="space-y-3"><Basics d={d} setD={setD} /><Repeater items={d.items} addLabel="+ Download" onAdd={() => setD({ ...d, items: [...d.items, downloadFromData({})] })} render={(item, index) => <div className="space-y-3"><Field label="Titel" value={item.title} onChange={(v) => updateItem(d, setD, 'items', index, { ...item, title: v })} /><Field label="Text" value={item.text} onChange={(v) => updateItem(d, setD, 'items', index, { ...item, text: v })} multiline /><div className="grid grid-cols-3 gap-3"><Field label="Datei-Label" value={item.fileLabel} onChange={(v) => updateItem(d, setD, 'items', index, { ...item, fileLabel: v })} /><Field label="Datei-Link" value={item.fileHref} onChange={(v) => updateItem(d, setD, 'items', index, { ...item, fileHref: v })} /><Field label="Meta" value={item.metaLabel} onChange={(v) => updateItem(d, setD, 'items', index, { ...item, metaLabel: v })} /></div></div>} /></div>;
}

function GalleryEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({ ...basicData(data), images: arr(data.images).map(galleryFromData) });
  useReport(d, onChange);
  return <div className="space-y-3"><Basics d={d} setD={setD} /><Repeater items={d.images} addLabel="+ Bild" onAdd={() => setD({ ...d, images: [...d.images, galleryFromData({})] })} render={(item, index) => <div className="space-y-3"><ImageUploadField label="Bild" value={item.src} onChange={(v) => updateItem(d, setD, 'images', index, { ...item, src: v })} /><Field label="Alt" value={item.alt} onChange={(v) => updateItem(d, setD, 'images', index, { ...item, alt: v })} /><Field label="Caption" value={item.caption} onChange={(v) => updateItem(d, setD, 'images', index, { ...item, caption: v })} /><Field label="Kategorie" value={item.category} onChange={(v) => updateItem(d, setD, 'images', index, { ...item, category: v })} /></div>} /></div>;
}

function FaqEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({ ...basicData(data), items: arr(data.items).map(faqFromData), ctaPrimary: btn(data.ctaPrimary) });
  useReport(d, onChange);
  return <div className="space-y-3"><Basics d={d} setD={setD} /><Repeater items={d.items} addLabel="+ Frage" onAdd={() => setD({ ...d, items: [...d.items, faqFromData({})] })} render={(item, index) => <div className="space-y-3"><Field label="Frage" value={item.question} onChange={(v) => updateItem(d, setD, 'items', index, { ...item, question: v })} /><Field label="Antwort" value={item.answer} onChange={(v) => updateItem(d, setD, 'items', index, { ...item, answer: v })} multiline /></div>} /><ButtonField label="CTA" value={d.ctaPrimary} onChange={(v) => setD({ ...d, ctaPrimary: v })} /></div>;
}

function TourismContactEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({ ...basicData(data), introText: str(data.introText), image: str(data.image), formEnabled: (data.formEnabled as boolean) ?? true, namePlaceholder: str(data.namePlaceholder), emailPlaceholder: str(data.emailPlaceholder), messagePlaceholder: str(data.messagePlaceholder), submitLabel: str(data.submitLabel), infoCards: arr(data.infoCards).map(infoCardFromData), primaryCta: btn(data.primaryCta), secondaryCta: btn(data.secondaryCta) });
  useReport(d, onChange);
  return <div className="space-y-3"><Basics d={d} setD={setD} /><Field label="Intro" value={d.introText} onChange={(v) => setD({ ...d, introText: v })} multiline /><ImageUploadField label="Bild" value={d.image} onChange={(v) => setD({ ...d, image: v })} /><div className="grid grid-cols-3 gap-3"><Field label="Name Placeholder" value={d.namePlaceholder} onChange={(v) => setD({ ...d, namePlaceholder: v })} /><Field label="E-Mail Placeholder" value={d.emailPlaceholder} onChange={(v) => setD({ ...d, emailPlaceholder: v })} /><Field label="Nachricht Placeholder" value={d.messagePlaceholder} onChange={(v) => setD({ ...d, messagePlaceholder: v })} /></div><Field label="Submit-Label" value={d.submitLabel} onChange={(v) => setD({ ...d, submitLabel: v })} /><Checkbox label="Formular anzeigen" checked={d.formEnabled} onChange={(v) => setD({ ...d, formEnabled: v })} /><Repeater items={d.infoCards} addLabel="+ Info" onAdd={() => setD({ ...d, infoCards: [...d.infoCards, infoCardFromData({})] })} render={(item, index) => <div className="space-y-3"><IconPickerField label="Icon" value={item.icon} onChange={(v) => updateItem(d, setD, 'infoCards', index, { ...item, icon: v })} /><Field label="Label" value={item.label} onChange={(v) => updateItem(d, setD, 'infoCards', index, { ...item, label: v })} /><Field label="Wert" value={item.value} onChange={(v) => updateItem(d, setD, 'infoCards', index, { ...item, value: v })} /></div>} /><ButtonField label="Primaerer CTA" value={d.primaryCta} onChange={(v) => setD({ ...d, primaryCta: v })} /><ButtonField label="Sekundaerer CTA" value={d.secondaryCta} onChange={(v) => setD({ ...d, secondaryCta: v })} /></div>;
}

const TOURISM_EDITORS: Record<string, React.FC<EditorProps>> = {
  hero: TourismHeroEditor,
  destinationHighlights: DestinationHighlightsEditor,
  experienceGrid: ExperienceGridEditor,
  seasonTeaser: SeasonTeaserEditor,
  eventsCalendar: EventsCalendarEditor,
  placesMap: PlacesMapEditor,
  sightseeingList: SightseeingListEditor,
  tourRoutes: TourRoutesEditor,
  accommodationGrid: AccommodationGridEditor,
  visitorInfo: VisitorInfoEditor,
  downloadGuides: DownloadGuidesEditor,
  gallery: GalleryEditor,
  faq: FaqEditor,
  tourismContact: TourismContactEditor,
};

function CardListEditor({ data, onChange, itemKey, addLabel, itemFactory, renderItem }: { data: Record<string, unknown>; onChange: (data: Record<string, unknown>) => void; itemKey: string; addLabel: string; itemFactory: (r: Record<string, unknown>) => any; renderItem: (args: any) => React.ReactNode }) {
  const [d, setD] = useState<any>({ ...basicData(data), [itemKey]: arr(data[itemKey]).map(itemFactory), ctaPrimary: btn(data.ctaPrimary) });
  useReport(d, onChange);
  return <div className="space-y-3"><Basics d={d} setD={setD} /><Repeater items={d[itemKey]} addLabel={addLabel} onAdd={() => setD({ ...d, [itemKey]: [...d[itemKey], itemFactory({})] })} render={(item, index) => renderItem({ item, index, d, setD, keyName: itemKey })} /><ButtonField label="CTA" value={d.ctaPrimary} onChange={(v) => setD({ ...d, ctaPrimary: v })} /></div>;
}

function imageCardFields({ item, index, d, setD, keyName }: any) {
  return <><Field label="Titel" value={item.title} onChange={(v) => updateItem(d, setD, keyName, index, { ...item, title: v })} /><Field label="Text" value={item.text} onChange={(v) => updateItem(d, setD, keyName, index, { ...item, text: v })} multiline /><ImageUploadField label="Bild" value={item.image} onChange={(v) => updateItem(d, setD, keyName, index, { ...item, image: v })} /><Field label="Kategorie/Meta" value={item.category} onChange={(v) => updateItem(d, setD, keyName, index, { ...item, category: v })} /><ButtonField label="CTA" value={item.cta} onChange={(v) => updateItem(d, setD, keyName, index, { ...item, cta: v })} /></>;
}

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
  return <div className="space-y-3">{items.map((item, index) => <div key={index} className="border rounded p-3">{render(item, index)}</div>)}<button type="button" className="text-sm text-blue-600" onClick={onAdd}>{addLabel}</button></div>;
}

function useReport(data: Record<string, unknown>, onChange: (d: Record<string, unknown>) => void) {
  const isFirst = useRef(true);
  const serialized = JSON.stringify(data);
  useEffect(() => { if (isFirst.current) { isFirst.current = false; return; } onChange(JSON.parse(serialized)); }, [serialized, onChange]);
}

function updateItem(d: any, setD: Dispatch<SetStateAction<any>>, key: string, index: number, value: any) {
  setD({ ...d, [key]: d[key].map((item: any, i: number) => i === index ? value : item) });
}

function basicData(data: Record<string, unknown>) { return { headline: str(data.headline), subline: str(data.subline), badgeText: str(data.badgeText) }; }
function str(value: unknown) { return (value as string) || ''; }
function arr(value: unknown): Record<string, unknown>[] { return Array.isArray(value) ? value as Record<string, unknown>[] : []; }
function btn(value: unknown): ButtonValue { return (value as ButtonValue) || { label: '', href: '' }; }
function join(value: unknown) { return Array.isArray(value) ? (value as string[]).join('\n') : ''; }
function lines(value: string): string[] { return value.split('\n').map((item) => item.trim()).filter(Boolean); }
function imageCardFromData(r: Record<string, unknown>) { return { title: str(r.title), text: str(r.text), image: str(r.image), category: str(r.category), cta: btn(r.cta) }; }
function experienceFromData(r: Record<string, unknown>) { return { ...imageCardFromData(r), durationLabel: str(r.durationLabel), audienceLabel: str(r.audienceLabel), difficultyLabel: str(r.difficultyLabel), priceLabel: str(r.priceLabel) }; }
function seasonFromData(r: Record<string, unknown>) { return { ...imageCardFromData(r), periodLabel: str(r.periodLabel) }; }
function eventFromData(r: Record<string, unknown>) { return { ...imageCardFromData(r), dateLabel: str(r.dateLabel), timeLabel: str(r.timeLabel), locationLabel: str(r.locationLabel), priceLabel: str(r.priceLabel) }; }
function placeFromData(r: Record<string, unknown>) { return { ...imageCardFromData(r), distanceLabel: str(r.distanceLabel), address: str(r.address) }; }
function sightFromData(r: Record<string, unknown>) { return { ...imageCardFromData(r), openingText: str(r.openingText) }; }
function routeFromData(r: Record<string, unknown>) { return { ...imageCardFromData(r), lengthLabel: str(r.lengthLabel), durationLabel: str(r.durationLabel), difficultyLabel: str(r.difficultyLabel), startLabel: str(r.startLabel), highlights: join(r.highlights) }; }
function accommodationFromData(r: Record<string, unknown>) { return { ...imageCardFromData(r), typeLabel: str(r.typeLabel), priceLabel: str(r.priceLabel), amenities: join(r.amenities) }; }
function blockFromData(r: Record<string, unknown>) { return { icon: str(r.icon), title: str(r.title), text: str(r.text), items: join(r.items) }; }
function downloadFromData(r: Record<string, unknown>) { return { title: str(r.title), text: str(r.text), fileLabel: str(r.fileLabel), fileHref: str(r.fileHref), metaLabel: str(r.metaLabel) }; }
function galleryFromData(r: Record<string, unknown>) { return { src: str(r.src), alt: str(r.alt), caption: str(r.caption), category: str(r.category) }; }
function faqFromData(r: Record<string, unknown>) { return { question: str(r.question), answer: str(r.answer) }; }
function infoCardFromData(r: Record<string, unknown>) { return { icon: str(r.icon), label: str(r.label), value: str(r.value) }; }
