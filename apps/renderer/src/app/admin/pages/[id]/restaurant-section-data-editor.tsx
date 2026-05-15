'use client';

import { type Dispatch, type SetStateAction, useEffect, useRef, useState } from 'react';
import { ImageUploadField } from '@/components/image-upload-field';
import { ButtonField, DetailLinkField } from '@/components/button-field';
import { IconPickerField } from '@/components/icon-picker-field';

type EditorProps = { data: Record<string, unknown>; onChange: (data: Record<string, unknown>) => void };
type ButtonValue = { label: string; href: string };

function useReport(data: Record<string, unknown>, onChange: (d: Record<string, unknown>) => void) {
  const isFirst = useRef(true);
  const serialized = JSON.stringify(data);
  useEffect(() => {
    if (isFirst.current) { isFirst.current = false; return; }
    onChange(JSON.parse(serialized));
  }, [serialized, onChange]);
}

export function RestaurantSectionDataEditor({ type, data, onChange }: { type: string; data: Record<string, unknown>; onChange: (data: Record<string, unknown>) => void }) {
  const Editor = RESTAURANT_EDITORS[type];
  return Editor ? <Editor data={data} onChange={onChange} /> : null;
}

export function hasRestaurantEditor(type: string): boolean {
  return Boolean(RESTAURANT_EDITORS[type]);
}

function MenuEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({
    headline: (data.headline as string) || '',
    subline: (data.subline as string) || '',
    badgeText: (data.badgeText as string) || '',
    introText: (data.introText as string) || '',
    categories: ((data.categories as Record<string, unknown>[]) || []).map(categoryFromData),
    footnote: (data.footnote as string) || '',
    ctaPrimary: (data.ctaPrimary as ButtonValue) || { label: '', href: '' },
  });
  useReport({
    ...d,
    categories: d.categories.map((category) => ({
      ...category,
      items: category.items.map((item) => ({ ...item, tags: lines(item.tags), allergens: lines(item.allergens) })),
    })),
  } as unknown as Record<string, unknown>, onChange);

  return (
    <div className="space-y-4">
      <Field label="Badge-Text" value={d.badgeText} onChange={(v) => setD({ ...d, badgeText: v })} />
      <Field label="Headline" value={d.headline} onChange={(v) => setD({ ...d, headline: v })} />
      <Field label="Subline" value={d.subline} onChange={(v) => setD({ ...d, subline: v })} />
      <Field label="Intro-Text" value={d.introText} onChange={(v) => setD({ ...d, introText: v })} multiline />
      {d.categories.map((category, categoryIndex) => (
        <div key={categoryIndex} className="border rounded p-3 space-y-3">
          <div className="flex justify-between gap-3">
            <Field label="Kategorie" value={category.title} onChange={(v) => setD({ ...d, categories: updateAt(d.categories, categoryIndex, { ...category, title: v }) })} />
            <button className="text-xs text-red-500" onClick={() => setD({ ...d, categories: d.categories.filter((_, i) => i !== categoryIndex) })}>Entfernen</button>
          </div>
          <Field label="Beschreibung" value={category.description} onChange={(v) => setD({ ...d, categories: updateAt(d.categories, categoryIndex, { ...category, description: v }) })} multiline />
          {category.items.map((item, itemIndex) => (
            <div key={itemIndex} className="rounded border bg-white p-3 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Gericht" value={item.name} onChange={(v) => updateMenuItem(d, setD, categoryIndex, itemIndex, { ...item, name: v })} />
                <Field label="Preis" value={item.price} onChange={(v) => updateMenuItem(d, setD, categoryIndex, itemIndex, { ...item, price: v })} />
              </div>
              <Field label="Beschreibung" value={item.description} onChange={(v) => updateMenuItem(d, setD, categoryIndex, itemIndex, { ...item, description: v })} multiline />
              <ImageUploadField label="Bild" value={item.image} onChange={(v) => updateMenuItem(d, setD, categoryIndex, itemIndex, { ...item, image: v })} />
              <Field label="Tags (eine pro Zeile)" value={item.tags} onChange={(v) => updateMenuItem(d, setD, categoryIndex, itemIndex, { ...item, tags: v })} multiline />
              <Field label="Allergene (eine pro Zeile)" value={item.allergens} onChange={(v) => updateMenuItem(d, setD, categoryIndex, itemIndex, { ...item, allergens: v })} multiline />
              <Field label="Detail-Link Label" value={item.detailLabel} onChange={(v) => updateMenuItem(d, setD, categoryIndex, itemIndex, { ...item, detailLabel: v })} />
              <DetailLinkField label="Detail-Link" value={item.detailHref} onChange={(v) => updateMenuItem(d, setD, categoryIndex, itemIndex, { ...item, detailHref: v })} />
              <div className="grid grid-cols-4 gap-2 text-xs">
                <Checkbox label="Highlight" checked={item.highlighted} onChange={(v) => updateMenuItem(d, setD, categoryIndex, itemIndex, { ...item, highlighted: v })} />
                <Checkbox label="Vegetarisch" checked={item.vegetarian} onChange={(v) => updateMenuItem(d, setD, categoryIndex, itemIndex, { ...item, vegetarian: v })} />
                <Checkbox label="Vegan" checked={item.vegan} onChange={(v) => updateMenuItem(d, setD, categoryIndex, itemIndex, { ...item, vegan: v })} />
                <Checkbox label="Scharf" checked={item.spicy} onChange={(v) => updateMenuItem(d, setD, categoryIndex, itemIndex, { ...item, spicy: v })} />
              </div>
              <button className="text-xs text-red-500" onClick={() => {
                const nextCategory = { ...category, items: category.items.filter((_, i) => i !== itemIndex) };
                setD({ ...d, categories: updateAt(d.categories, categoryIndex, nextCategory) });
              }}>Gericht entfernen</button>
            </div>
          ))}
          <button className="text-xs text-blue-600" onClick={() => {
            const nextCategory = { ...category, items: [...category.items, emptyMenuItem()] };
            setD({ ...d, categories: updateAt(d.categories, categoryIndex, nextCategory) });
          }}>+ Gericht</button>
        </div>
      ))}
      <button className="text-sm text-blue-600" onClick={() => setD({ ...d, categories: [...d.categories, { title: '', description: '', items: [] }] })}>+ Kategorie</button>
      <Field label="Fussnote" value={d.footnote} onChange={(v) => setD({ ...d, footnote: v })} multiline />
      <ButtonField label="CTA" value={d.ctaPrimary} onChange={(v) => setD({ ...d, ctaPrimary: v })} />
    </div>
  );
}

function ReservationEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({
    headline: (data.headline as string) || '',
    subline: (data.subline as string) || '',
    badgeText: (data.badgeText as string) || '',
    introText: (data.introText as string) || '',
    formEnabled: (data.formEnabled as boolean) ?? true,
    submitLabel: (data.submitLabel as string) || '',
    phoneCta: (data.phoneCta as ButtonValue) || { label: '', href: '' },
    externalBookingCta: (data.externalBookingCta as ButtonValue) || { label: '', href: '' },
    partySizeOptions: ((data.partySizeOptions as string[]) || []).join('\n'),
    timeHint: (data.timeHint as string) || '',
    policyText: (data.policyText as string) || '',
    image: (data.image as string) || '',
  });
  useReport({ ...d, partySizeOptions: lines(d.partySizeOptions) }, onChange);

  return (
    <div className="space-y-3">
      <Field label="Badge-Text" value={d.badgeText} onChange={(v) => setD({ ...d, badgeText: v })} />
      <Field label="Headline" value={d.headline} onChange={(v) => setD({ ...d, headline: v })} />
      <Field label="Subline" value={d.subline} onChange={(v) => setD({ ...d, subline: v })} />
      <Field label="Intro-Text" value={d.introText} onChange={(v) => setD({ ...d, introText: v })} multiline />
      <Checkbox label="Formular anzeigen" checked={d.formEnabled} onChange={(v) => setD({ ...d, formEnabled: v })} />
      <Field label="Submit-Label" value={d.submitLabel} onChange={(v) => setD({ ...d, submitLabel: v })} />
      <ButtonField label="Telefon-CTA" value={d.phoneCta} onChange={(v) => setD({ ...d, phoneCta: v })} />
      <ButtonField label="Buchungs-CTA" value={d.externalBookingCta} onChange={(v) => setD({ ...d, externalBookingCta: v })} />
      <Field label="Formular-Platzhalter (eine pro Zeile)" value={d.partySizeOptions} onChange={(v) => setD({ ...d, partySizeOptions: v })} multiline />
      <Field label="Zeit-Hinweis" value={d.timeHint} onChange={(v) => setD({ ...d, timeHint: v })} />
      <Field label="Policy-Text" value={d.policyText} onChange={(v) => setD({ ...d, policyText: v })} multiline />
      <ImageUploadField label="Bild" value={d.image} onChange={(v) => setD({ ...d, image: v })} />
    </div>
  );
}

function OpeningHoursEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({
    headline: (data.headline as string) || '',
    subline: (data.subline as string) || '',
    badgeText: (data.badgeText as string) || '',
    days: ((data.days as Record<string, unknown>[]) || []).map(dayFromData),
    kitchenHoursHeadline: (data.kitchenHoursHeadline as string) || '',
    kitchenHoursText: (data.kitchenHoursText as string) || '',
    holidayNote: (data.holidayNote as string) || '',
    ctaPrimary: (data.ctaPrimary as ButtonValue) || { label: '', href: '' },
  });
  useReport(d as unknown as Record<string, unknown>, onChange);

  return (
    <div className="space-y-3">
      <Field label="Badge-Text" value={d.badgeText} onChange={(v) => setD({ ...d, badgeText: v })} />
      <Field label="Headline" value={d.headline} onChange={(v) => setD({ ...d, headline: v })} />
      <Field label="Subline" value={d.subline} onChange={(v) => setD({ ...d, subline: v })} />
      {d.days.map((day, index) => (
        <div key={index} className="grid grid-cols-4 gap-2 border rounded p-3">
          <Field label="Tag" value={day.label} onChange={(v) => setD({ ...d, days: updateAt(d.days, index, { ...day, label: v }) })} />
          <Field label="Zeiten" value={day.hours} onChange={(v) => setD({ ...d, days: updateAt(d.days, index, { ...day, hours: v }) })} />
          <Field label="Notiz" value={day.note} onChange={(v) => setD({ ...d, days: updateAt(d.days, index, { ...day, note: v }) })} />
          <Checkbox label="Geschlossen" checked={day.closed} onChange={(v) => setD({ ...d, days: updateAt(d.days, index, { ...day, closed: v }) })} />
        </div>
      ))}
      <button className="text-sm text-blue-600" onClick={() => setD({ ...d, days: [...d.days, { label: '', hours: '', note: '', closed: false }] })}>+ Tag</button>
      <Field label="Kuechenzeiten Headline" value={d.kitchenHoursHeadline} onChange={(v) => setD({ ...d, kitchenHoursHeadline: v })} />
      <Field label="Kuechenzeiten Text" value={d.kitchenHoursText} onChange={(v) => setD({ ...d, kitchenHoursText: v })} multiline />
      <Field label="Feiertags-Hinweis" value={d.holidayNote} onChange={(v) => setD({ ...d, holidayNote: v })} multiline />
      <ButtonField label="CTA" value={d.ctaPrimary} onChange={(v) => setD({ ...d, ctaPrimary: v })} />
    </div>
  );
}

function SignatureDishesEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({
    headline: (data.headline as string) || '',
    subline: (data.subline as string) || '',
    badgeText: (data.badgeText as string) || '',
    dishes: ((data.dishes as Record<string, unknown>[]) || []).map(dishFromData),
  });
  useReport({
    ...d,
    dishes: d.dishes.map((dish) => ({ ...dish, ingredients: lines(dish.ingredients) })),
  }, onChange);

  return (
    <div className="space-y-3">
      <Field label="Badge-Text" value={d.badgeText} onChange={(v) => setD({ ...d, badgeText: v })} />
      <Field label="Headline" value={d.headline} onChange={(v) => setD({ ...d, headline: v })} />
      <Field label="Subline" value={d.subline} onChange={(v) => setD({ ...d, subline: v })} />
      {d.dishes.map((dish, index) => (
        <div key={index} className="border rounded p-3 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Name" value={dish.name} onChange={(v) => setD({ ...d, dishes: updateAt(d.dishes, index, { ...dish, name: v }) })} />
            <Field label="Preis" value={dish.price} onChange={(v) => setD({ ...d, dishes: updateAt(d.dishes, index, { ...dish, price: v }) })} />
          </div>
          <Field label="Label" value={dish.label} onChange={(v) => setD({ ...d, dishes: updateAt(d.dishes, index, { ...dish, label: v }) })} />
          <Field label="Beschreibung" value={dish.description} onChange={(v) => setD({ ...d, dishes: updateAt(d.dishes, index, { ...dish, description: v }) })} multiline />
          <ImageUploadField label="Bild" value={dish.image} onChange={(v) => setD({ ...d, dishes: updateAt(d.dishes, index, { ...dish, image: v }) })} />
          <Field label="Zutaten (eine pro Zeile)" value={dish.ingredients} onChange={(v) => setD({ ...d, dishes: updateAt(d.dishes, index, { ...dish, ingredients: v }) })} multiline />
          <ButtonField label="CTA" value={dish.cta} onChange={(v) => setD({ ...d, dishes: updateAt(d.dishes, index, { ...dish, cta: v }) })} />
        </div>
      ))}
      <button className="text-sm text-blue-600" onClick={() => setD({ ...d, dishes: [...d.dishes, emptyDish()] })}>+ Gericht</button>
    </div>
  );
}

function EventsEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({
    headline: (data.headline as string) || '',
    subline: (data.subline as string) || '',
    badgeText: (data.badgeText as string) || '',
    events: ((data.events as Record<string, unknown>[]) || []).map(eventFromData),
    fallbackText: (data.fallbackText as string) || '',
  });
  useReport(d as unknown as Record<string, unknown>, onChange);

  return (
    <div className="space-y-3">
      <Field label="Badge-Text" value={d.badgeText} onChange={(v) => setD({ ...d, badgeText: v })} />
      <Field label="Headline" value={d.headline} onChange={(v) => setD({ ...d, headline: v })} />
      <Field label="Subline" value={d.subline} onChange={(v) => setD({ ...d, subline: v })} />
      {d.events.map((event, index) => (
        <div key={index} className="border rounded p-3 space-y-3">
          <Field label="Titel" value={event.title} onChange={(v) => setD({ ...d, events: updateAt(d.events, index, { ...event, title: v }) })} />
          <div className="grid grid-cols-3 gap-3">
            <Field label="Datum" value={event.dateLabel} onChange={(v) => setD({ ...d, events: updateAt(d.events, index, { ...event, dateLabel: v }) })} />
            <Field label="Zeit" value={event.timeLabel} onChange={(v) => setD({ ...d, events: updateAt(d.events, index, { ...event, timeLabel: v }) })} />
            <Field label="Preis" value={event.priceLabel} onChange={(v) => setD({ ...d, events: updateAt(d.events, index, { ...event, priceLabel: v }) })} />
          </div>
          <Field label="Beschreibung" value={event.description} onChange={(v) => setD({ ...d, events: updateAt(d.events, index, { ...event, description: v }) })} multiline />
          <ImageUploadField label="Bild" value={event.image} onChange={(v) => setD({ ...d, events: updateAt(d.events, index, { ...event, image: v }) })} />
          <ButtonField label="CTA" value={event.cta} onChange={(v) => setD({ ...d, events: updateAt(d.events, index, { ...event, cta: v }) })} />
          <Field label="Detail-Link Label" value={event.detailLabel} onChange={(v) => setD({ ...d, events: updateAt(d.events, index, { ...event, detailLabel: v }) })} />
          <DetailLinkField label="Detail-Link" value={event.detailHref} onChange={(v) => setD({ ...d, events: updateAt(d.events, index, { ...event, detailHref: v }) })} />
        </div>
      ))}
      <button className="text-sm text-blue-600" onClick={() => setD({ ...d, events: [...d.events, emptyEvent()] })}>+ Event</button>
      <Field label="Fallback-Text" value={d.fallbackText} onChange={(v) => setD({ ...d, fallbackText: v })} multiline />
    </div>
  );
}

function AmbienceEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({
    headline: (data.headline as string) || '',
    subline: (data.subline as string) || '',
    badgeText: (data.badgeText as string) || '',
    imagePrimary: (data.imagePrimary as string) || '',
    imageSecondary: (data.imageSecondary as string) || '',
    imageTertiary: (data.imageTertiary as string) || '',
    highlights: ((data.highlights as Record<string, unknown>[]) || []).map(highlightFromData),
    ctaPrimary: (data.ctaPrimary as ButtonValue) || { label: '', href: '' },
  });
  useReport(d as unknown as Record<string, unknown>, onChange);

  return (
    <div className="space-y-3">
      <Field label="Badge-Text" value={d.badgeText} onChange={(v) => setD({ ...d, badgeText: v })} />
      <Field label="Headline" value={d.headline} onChange={(v) => setD({ ...d, headline: v })} />
      <Field label="Subline" value={d.subline} onChange={(v) => setD({ ...d, subline: v })} />
      <ImageUploadField label="Hauptbild" value={d.imagePrimary} onChange={(v) => setD({ ...d, imagePrimary: v })} />
      <ImageUploadField label="Sekundaerbild" value={d.imageSecondary} onChange={(v) => setD({ ...d, imageSecondary: v })} />
      <ImageUploadField label="Drittbild" value={d.imageTertiary} onChange={(v) => setD({ ...d, imageTertiary: v })} />
      {d.highlights.map((highlight, index) => (
        <div key={index} className="border rounded p-3 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Titel" value={highlight.title} onChange={(v) => setD({ ...d, highlights: updateAt(d.highlights, index, { ...highlight, title: v }) })} />
            <IconPickerField label="Icon" value={highlight.icon} onChange={(v) => setD({ ...d, highlights: updateAt(d.highlights, index, { ...highlight, icon: v }) })} />
          </div>
          <Field label="Text" value={highlight.text} onChange={(v) => setD({ ...d, highlights: updateAt(d.highlights, index, { ...highlight, text: v }) })} multiline />
        </div>
      ))}
      <button className="text-sm text-blue-600" onClick={() => setD({ ...d, highlights: [...d.highlights, { title: '', text: '', icon: '' }] })}>+ Highlight</button>
      <ButtonField label="CTA" value={d.ctaPrimary} onChange={(v) => setD({ ...d, ctaPrimary: v })} />
    </div>
  );
}

const RESTAURANT_EDITORS: Record<string, React.FC<EditorProps>> = {
  menu: MenuEditor,
  reservation: ReservationEditor,
  openingHours: OpeningHoursEditor,
  signatureDishes: SignatureDishesEditor,
  events: EventsEditor,
  ambience: AmbienceEditor,
};

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

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return <label className="flex items-center gap-2"><input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />{label}</label>;
}

function lines(value: string): string[] {
  return value.split('\n').map((item) => item.trim()).filter(Boolean);
}

function updateAt<T>(items: T[], index: number, value: T): T[] {
  return items.map((item, i) => i === index ? value : item);
}

function categoryFromData(category: Record<string, unknown>) {
  return {
    title: (category.title as string) || '',
    description: (category.description as string) || '',
    items: ((category.items as Record<string, unknown>[]) || []).map(menuItemFromData),
  };
}

function menuItemFromData(item: Record<string, unknown>) {
  return {
    name: (item.name as string) || '',
    description: (item.description as string) || '',
    price: (item.price as string) || '',
    image: (item.image as string) || '',
    tags: ((item.tags as string[]) || []).join('\n'),
    allergens: ((item.allergens as string[]) || []).join('\n'),
    highlighted: Boolean(item.highlighted),
    vegetarian: Boolean(item.vegetarian),
    vegan: Boolean(item.vegan),
    spicy: Boolean(item.spicy),
    detailHref: (item.detailHref as string) || '',
    detailLabel: (item.detailLabel as string) || '',
  };
}

function emptyMenuItem() {
  return { name: '', description: '', price: '', image: '', tags: '', allergens: '', highlighted: false, vegetarian: false, vegan: false, spicy: false, detailHref: '', detailLabel: '' };
}

function updateMenuItem(
  d: { categories: ReturnType<typeof categoryFromData>[] },
  setD: Dispatch<SetStateAction<any>>,
  categoryIndex: number,
  itemIndex: number,
  item: ReturnType<typeof emptyMenuItem>,
) {
  const category = d.categories[categoryIndex];
  const nextCategory = { ...category, items: updateAt(category.items, itemIndex, item) };
  setD((current: typeof d) => ({ ...current, categories: updateAt(current.categories, categoryIndex, nextCategory) }));
}

function dayFromData(day: Record<string, unknown>) {
  return { label: (day.label as string) || '', hours: (day.hours as string) || '', note: (day.note as string) || '', closed: Boolean(day.closed) };
}

function dishFromData(dish: Record<string, unknown>) {
  return {
    name: (dish.name as string) || '',
    description: (dish.description as string) || '',
    price: (dish.price as string) || '',
    image: (dish.image as string) || '',
    label: (dish.label as string) || '',
    ingredients: ((dish.ingredients as string[]) || []).join('\n'),
    cta: (dish.cta as ButtonValue) || { label: '', href: '' },
  };
}

function emptyDish() {
  return { name: '', description: '', price: '', image: '', label: '', ingredients: '', cta: { label: '', href: '' } };
}

function eventFromData(event: Record<string, unknown>) {
  return {
    title: (event.title as string) || '',
    dateLabel: (event.dateLabel as string) || '',
    timeLabel: (event.timeLabel as string) || '',
    description: (event.description as string) || '',
    image: (event.image as string) || '',
    priceLabel: (event.priceLabel as string) || '',
    cta: (event.cta as ButtonValue) || { label: '', href: '' },
    detailHref: (event.detailHref as string) || '',
    detailLabel: (event.detailLabel as string) || '',
  };
}

function emptyEvent() {
  return { title: '', dateLabel: '', timeLabel: '', description: '', image: '', priceLabel: '', cta: { label: '', href: '' }, detailHref: '', detailLabel: '' };
}

function highlightFromData(highlight: Record<string, unknown>) {
  return { title: (highlight.title as string) || '', text: (highlight.text as string) || '', icon: (highlight.icon as string) || '' };
}
