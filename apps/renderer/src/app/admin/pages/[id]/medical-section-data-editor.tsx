'use client';

import { type Dispatch, type FC, type ReactNode, type SetStateAction, useEffect, useRef, useState } from 'react';
import { ImageUploadField } from '@/components/image-upload-field';
import { saveMediaRecord } from '@/app/admin/media-actions';
import { ButtonField } from '@/components/button-field';
import { IconPickerField } from '@/components/icon-picker-field';

type ButtonValue = { label: string; href: string };
type EditorProps = { data: Record<string, unknown>; onChange: (data: Record<string, unknown>) => void };
type FieldKind = 'text' | 'multiline' | 'image' | 'button' | 'icon' | 'lines' | 'checkbox';
type FieldConfig = { key: string; label: string; kind?: FieldKind };

export function MedicalSectionDataEditor({ type, data, onChange }: { type: string; data: Record<string, unknown>; onChange: (data: Record<string, unknown>) => void }) {
  const Editor = MEDICAL_EDITORS[type];
  return Editor ? <Editor data={data} onChange={onChange} /> : null;
}

export function hasMedicalEditor(type: string): boolean {
  return Boolean(MEDICAL_EDITORS[type]);
}

function HeroEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({
    headline: str(data.headline),
    subline: str(data.subline),
    badgeText: str(data.badgeText),
    bgImage: str(data.bgImage),
    specialtyLabel: str(data.specialtyLabel),
    emergencyHint: str(data.emergencyHint),
    trustItems: join(data.trustItems),
    primaryCta: btn(data.primaryCta),
    emergencyCta: btn(data.emergencyCta),
    secondaryCta: btn(data.secondaryCta),
  });
  useReport({ ...d, trustItems: lines(d.trustItems) }, onChange);
  return <div className="space-y-3"><Basics d={d} setD={setD} /><ImageUploadField label="Hintergrundbild" value={d.bgImage} onChange={(v) => setD({ ...d, bgImage: v })} /><div className="grid grid-cols-2 gap-3"><Field label="Fachrichtung" value={d.specialtyLabel} onChange={(v) => setD({ ...d, specialtyLabel: v })} /><Field label="Akuthinweis" value={d.emergencyHint} onChange={(v) => setD({ ...d, emergencyHint: v })} /></div><Field label="Trust-Items" value={d.trustItems} onChange={(v) => setD({ ...d, trustItems: v })} multiline /><ButtonField label="Primaerer CTA" value={d.primaryCta} onChange={(v) => setD({ ...d, primaryCta: v })} /><ButtonField label="Notfall-CTA" value={d.emergencyCta} onChange={(v) => setD({ ...d, emergencyCta: v })} /><ButtonField label="Sekundaerer CTA" value={d.secondaryCta} onChange={(v) => setD({ ...d, secondaryCta: v })} /></div>;
}

function BasicCardsEditor({ data, onChange, keyName, addLabel, fields, topFields = [], ctaKey }: { data: Record<string, unknown>; onChange: (data: Record<string, unknown>) => void; keyName: string; addLabel: string; fields: FieldConfig[]; topFields?: FieldConfig[]; ctaKey?: string }) {
  const [d, setD] = useState<any>({ ...basicData(data), ...stateFromFields(data, topFields), [keyName]: arr(data[keyName]).map((item) => stateFromFields(item, fields)) });
  useReport({ ...d, ...outputFromFields(d, topFields), [keyName]: d[keyName].map((item: any) => outputFromFields(item, fields)) }, onChange);
  return <div className="space-y-3"><Basics d={d} setD={setD} />{topFields.map((field) => <ConfiguredField key={field.key} field={field} value={d[field.key]} onChange={(value) => setD({ ...d, [field.key]: value })} />)}<Repeater items={d[keyName]} addLabel={addLabel} onAdd={() => setD({ ...d, [keyName]: [...d[keyName], stateFromFields({}, fields)] })} render={(item, index) => <div className="space-y-3">{fields.map((field) => <ConfiguredField key={field.key} field={field} value={item[field.key]} onChange={(value) => updateItem(d, setD, keyName, index, { ...item, [field.key]: value })} />)}</div>} />{ctaKey && <ButtonField label="CTA" value={d[ctaKey]} onChange={(v) => setD({ ...d, [ctaKey]: v })} />}</div>;
}

function ServiceOverviewEditor(props: EditorProps) {
  return <BasicCardsEditor {...props} keyName="items" addLabel="+ Leistung" fields={[
    { key: 'title', label: 'Titel' },
    { key: 'text', label: 'Text', kind: 'multiline' },
    { key: 'image', label: 'Bild', kind: 'image' },
    { key: 'icon', label: 'Icon', kind: 'icon' },
    { key: 'category', label: 'Kategorie' },
    { key: 'cta', label: 'CTA', kind: 'button' },
  ]} topFields={[{ key: 'ctaPrimary', label: 'CTA', kind: 'button' }]} />;
}

function TreatmentDetailEditor(props: EditorProps) {
  return <BasicCardsEditor {...props} keyName="treatments" addLabel="+ Behandlung" fields={[
    { key: 'title', label: 'Titel' },
    { key: 'text', label: 'Text', kind: 'multiline' },
    { key: 'image', label: 'Bild', kind: 'image' },
    { key: 'durationLabel', label: 'Dauer' },
    { key: 'requirementLabel', label: 'Voraussetzung' },
    { key: 'noticeText', label: 'Hinweis', kind: 'multiline' },
    { key: 'steps', label: 'Ablauf-Schritte', kind: 'lines' },
    { key: 'cta', label: 'CTA', kind: 'button' },
  ]} />;
}

function DiagnosticsEditor(props: EditorProps) {
  return <BasicCardsEditor {...props} keyName="items" addLabel="+ Diagnostik" fields={[
    { key: 'title', label: 'Titel' },
    { key: 'text', label: 'Text', kind: 'multiline' },
    { key: 'image', label: 'Bild', kind: 'image' },
    { key: 'benefitLabel', label: 'Nutzen' },
    { key: 'methodLabel', label: 'Methode' },
    { key: 'cta', label: 'CTA', kind: 'button' },
  ]} />;
}

function DoctorTeamEditor(props: EditorProps) {
  return <BasicCardsEditor {...props} keyName="doctors" addLabel="+ Arzt/Aerztin" fields={[
    { key: 'name', label: 'Name' },
    { key: 'title', label: 'Titel' },
    { key: 'specialty', label: 'Fachgebiet' },
    { key: 'bio', label: 'Bio', kind: 'multiline' },
    { key: 'image', label: 'Bild', kind: 'image' },
    { key: 'languages', label: 'Sprachen', kind: 'lines' },
    { key: 'appointmentCta', label: 'Termin-CTA', kind: 'button' },
  ]} />;
}

function PracticeTeamEditor(props: EditorProps) {
  return <BasicCardsEditor {...props} keyName="members" addLabel="+ Teammitglied" fields={[
    { key: 'name', label: 'Name' },
    { key: 'role', label: 'Rolle' },
    { key: 'bio', label: 'Bio', kind: 'multiline' },
    { key: 'image', label: 'Bild', kind: 'image' },
  ]} />;
}

function CertificationsEditor(props: EditorProps) {
  return <BasicCardsEditor {...props} keyName="items" addLabel="+ Zertifikat" fields={[
    { key: 'icon', label: 'Icon', kind: 'icon' },
    { key: 'title', label: 'Titel' },
    { key: 'text', label: 'Text', kind: 'multiline' },
    { key: 'metaLabel', label: 'Meta' },
  ]} />;
}

function PatientInfoEditor(props: EditorProps) {
  return <BasicCardsEditor {...props} keyName="cards" addLabel="+ Infokarte" topFields={[{ key: 'introText', label: 'Intro', kind: 'multiline' }]} fields={[
    { key: 'icon', label: 'Icon', kind: 'icon' },
    { key: 'title', label: 'Titel' },
    { key: 'text', label: 'Text', kind: 'multiline' },
    { key: 'items', label: 'Punkte', kind: 'lines' },
  ]} />;
}

function InsuranceInfoEditor(props: EditorProps) {
  return <BasicCardsEditor {...props} keyName="items" addLabel="+ Versicherungsinfo" fields={[
    { key: 'title', label: 'Titel' },
    { key: 'text', label: 'Text', kind: 'multiline' },
    { key: 'image', label: 'Bild', kind: 'image' },
    { key: 'typeLabel', label: 'Typ' },
    { key: 'notice', label: 'Hinweis', kind: 'multiline' },
    { key: 'cta', label: 'CTA', kind: 'button' },
  ]} />;
}

function DownloadFormsEditor(props: EditorProps) {
  return <BasicCardsEditor {...props} keyName="items" addLabel="+ Download" fields={[
    { key: 'title', label: 'Titel' },
    { key: 'text', label: 'Text', kind: 'multiline' },
    { key: 'fileLabel', label: 'Dateiname' },
    { key: 'fileHref', label: 'Datei-URL' },
    { key: 'metaLabel', label: 'Meta' },
  ]} />;
}

function AppointmentCtaEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({ ...basicData(data), introText: str(data.introText), onlineCta: btn(data.onlineCta), phoneCta: btn(data.phoneCta), callbackCta: btn(data.callbackCta), externalCta: btn(data.externalCta), notes: join(data.notes) });
  useReport({ ...d, notes: lines(d.notes) }, onChange);
  return <div className="space-y-3"><Basics d={d} setD={setD} /><Field label="Intro" value={d.introText} onChange={(v) => setD({ ...d, introText: v })} multiline /><ButtonField label="Online-CTA" value={d.onlineCta} onChange={(v) => setD({ ...d, onlineCta: v })} /><ButtonField label="Telefon-CTA" value={d.phoneCta} onChange={(v) => setD({ ...d, phoneCta: v })} /><ButtonField label="Rueckruf-CTA" value={d.callbackCta} onChange={(v) => setD({ ...d, callbackCta: v })} /><ButtonField label="Externer CTA" value={d.externalCta} onChange={(v) => setD({ ...d, externalCta: v })} /><Field label="Hinweise" value={d.notes} onChange={(v) => setD({ ...d, notes: v })} multiline /></div>;
}

function OpeningHoursEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({ ...basicData(data), days: arr(data.days).map(dayFromData), acuteCareText: str(data.acuteCareText), holidayNote: str(data.holidayNote), ctaPrimary: btn(data.ctaPrimary) });
  useReport(d, onChange);
  return <div className="space-y-3"><Basics d={d} setD={setD} /><Repeater items={d.days} addLabel="+ Tag" onAdd={() => setD({ ...d, days: [...d.days, dayFromData({})] })} render={(item, index) => <div className="grid grid-cols-4 gap-3"><Field label="Tag" value={item.label} onChange={(v) => updateItem(d, setD, 'days', index, { ...item, label: v })} /><Field label="Zeit" value={item.hours} onChange={(v) => updateItem(d, setD, 'days', index, { ...item, hours: v })} /><Field label="Hinweis" value={item.note} onChange={(v) => updateItem(d, setD, 'days', index, { ...item, note: v })} /><Checkbox label="Geschlossen" checked={item.closed} onChange={(v) => updateItem(d, setD, 'days', index, { ...item, closed: v })} /></div>} /><Field label="Akutsprechstunde" value={d.acuteCareText} onChange={(v) => setD({ ...d, acuteCareText: v })} multiline /><Field label="Urlaub / Feiertage" value={d.holidayNote} onChange={(v) => setD({ ...d, holidayNote: v })} multiline /><ButtonField label="CTA" value={d.ctaPrimary} onChange={(v) => setD({ ...d, ctaPrimary: v })} /></div>;
}

function EmergencyInfoEditor(props: EditorProps) {
  return <BasicCardsEditor {...props} keyName="items" addLabel="+ Notfallkontakt" topFields={[{ key: 'introText', label: 'Intro', kind: 'multiline' }, { key: 'ctaPrimary', label: 'CTA', kind: 'button' }]} fields={[
    { key: 'title', label: 'Titel' },
    { key: 'text', label: 'Text', kind: 'multiline' },
    { key: 'phoneLabel', label: 'Telefon-Label' },
    { key: 'phoneHref', label: 'Telefon-Link' },
  ]} />;
}

function PracticeGalleryEditor(props: EditorProps) {
  return <BasicCardsEditor {...props} keyName="images" addLabel="+ Bild" fields={[
    { key: 'src', label: 'Bild', kind: 'image' },
    { key: 'alt', label: 'Alt-Text' },
    { key: 'caption', label: 'Caption' },
    { key: 'category', label: 'Kategorie' },
  ]} />;
}

function EquipmentHighlightsEditor(props: EditorProps) {
  return <BasicCardsEditor {...props} keyName="items" addLabel="+ Ausstattung" fields={[
    { key: 'title', label: 'Titel' },
    { key: 'text', label: 'Text', kind: 'multiline' },
    { key: 'image', label: 'Bild', kind: 'image' },
    { key: 'category', label: 'Kategorie' },
    { key: 'benefitLabel', label: 'Nutzen' },
    { key: 'cta', label: 'CTA', kind: 'button' },
  ]} />;
}

function ValuesGridEditor(props: EditorProps) {
  return <BasicCardsEditor {...props} keyName="items" addLabel="+ Wert" fields={[
    { key: 'icon', label: 'Icon', kind: 'icon' },
    { key: 'title', label: 'Titel' },
    { key: 'text', label: 'Text', kind: 'multiline' },
  ]} />;
}

function LocationContactEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({ ...basicData(data), introText: str(data.introText), image: str(data.image), mapEmbedUrl: str(data.mapEmbedUrl), formEnabled: data.formEnabled === undefined ? true : Boolean(data.formEnabled), namePlaceholder: str(data.namePlaceholder), emailPlaceholder: str(data.emailPlaceholder), messagePlaceholder: str(data.messagePlaceholder), submitLabel: str(data.submitLabel), infoCards: arr(data.infoCards).map(infoCardFromData), primaryCta: btn(data.primaryCta), secondaryCta: btn(data.secondaryCta) });
  useReport(d, onChange);
  return <div className="space-y-3"><Basics d={d} setD={setD} /><Field label="Intro" value={d.introText} onChange={(v) => setD({ ...d, introText: v })} multiline /><ImageUploadField label="Bild" value={d.image} onChange={(v) => setD({ ...d, image: v })} /><Field label="Map Embed URL" value={d.mapEmbedUrl} onChange={(v) => setD({ ...d, mapEmbedUrl: v })} /><div className="grid grid-cols-3 gap-3"><Field label="Name Placeholder" value={d.namePlaceholder} onChange={(v) => setD({ ...d, namePlaceholder: v })} /><Field label="E-Mail Placeholder" value={d.emailPlaceholder} onChange={(v) => setD({ ...d, emailPlaceholder: v })} /><Field label="Nachricht Placeholder" value={d.messagePlaceholder} onChange={(v) => setD({ ...d, messagePlaceholder: v })} /></div><Field label="Submit-Label" value={d.submitLabel} onChange={(v) => setD({ ...d, submitLabel: v })} /><Checkbox label="Formular anzeigen" checked={d.formEnabled} onChange={(v) => setD({ ...d, formEnabled: v })} /><Repeater items={d.infoCards} addLabel="+ Infokarte" onAdd={() => setD({ ...d, infoCards: [...d.infoCards, infoCardFromData({})] })} render={(item, index) => <div className="space-y-3"><IconPickerField label="Icon" value={item.icon} onChange={(v) => updateItem(d, setD, 'infoCards', index, { ...item, icon: v })} /><Field label="Label" value={item.label} onChange={(v) => updateItem(d, setD, 'infoCards', index, { ...item, label: v })} /><Field label="Wert" value={item.value} onChange={(v) => updateItem(d, setD, 'infoCards', index, { ...item, value: v })} /></div>} /><ButtonField label="Primaerer CTA" value={d.primaryCta} onChange={(v) => setD({ ...d, primaryCta: v })} /><ButtonField label="Sekundaerer CTA" value={d.secondaryCta} onChange={(v) => setD({ ...d, secondaryCta: v })} /></div>;
}

function FaqEditor(props: EditorProps) {
  return <BasicCardsEditor {...props} keyName="items" addLabel="+ Frage" topFields={[{ key: 'ctaPrimary', label: 'CTA', kind: 'button' }]} fields={[
    { key: 'question', label: 'Frage' },
    { key: 'answer', label: 'Antwort', kind: 'multiline' },
  ]} />;
}

const MEDICAL_EDITORS: Record<string, FC<EditorProps>> = {
  hero: HeroEditor,
  serviceOverview: ServiceOverviewEditor,
  treatmentDetail: TreatmentDetailEditor,
  diagnostics: DiagnosticsEditor,
  doctorTeam: DoctorTeamEditor,
  practiceTeam: PracticeTeamEditor,
  certifications: CertificationsEditor,
  patientInfo: PatientInfoEditor,
  insuranceInfo: InsuranceInfoEditor,
  downloadForms: DownloadFormsEditor,
  appointmentCta: AppointmentCtaEditor,
  openingHours: OpeningHoursEditor,
  emergencyInfo: EmergencyInfoEditor,
  practiceGallery: PracticeGalleryEditor,
  equipmentHighlights: EquipmentHighlightsEditor,
  valuesGrid: ValuesGridEditor,
  locationContact: LocationContactEditor,
  faq: FaqEditor,
  testimonials: MedicalTestimonialsEditor,
  story: MedicalStoryEditor,
};

function MedicalTestimonialsEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({ ...basicData(data), ratingValue: str(data.ratingValue), ratingCount: str(data.ratingCount), items: arr(data.items).map((t) => ({ name: str(t.name), quote: str(t.quote), context: str(t.context), sourceLabel: str(t.sourceLabel), rating: (t.rating as number) || 5 })), ctaPrimary: btn(data.ctaPrimary) });
  useReport(d as Record<string, unknown>, onChange);
  return (
    <div className="space-y-3">
      <Basics d={d} setD={setD} />
      <Field label="Bewertung (z.B. 4.9/5)" value={d.ratingValue} onChange={(v) => setD({ ...d, ratingValue: v })} />
      <Field label="Anzahl Bewertungen" value={d.ratingCount} onChange={(v) => setD({ ...d, ratingCount: v })} />
      <Repeater items={d.items} addLabel="+ Bewertung" onAdd={() => setD({ ...d, items: [...d.items, { name: '', quote: '', context: '', sourceLabel: '', rating: 5 }] })} render={(item, index) => (
        <div className="space-y-3"><Field label="Name" value={item.name} onChange={(v) => updateItem(d, setD, 'items', index, { ...item, name: v })} /><Field label="Zitat" value={item.quote} onChange={(v) => updateItem(d, setD, 'items', index, { ...item, quote: v })} multiline /><Field label="Kontext" value={item.context} onChange={(v) => updateItem(d, setD, 'items', index, { ...item, context: v })} /><Field label="Quelle" value={item.sourceLabel} onChange={(v) => updateItem(d, setD, 'items', index, { ...item, sourceLabel: v })} /></div>
      )} />
      <ButtonField label="CTA" value={d.ctaPrimary} onChange={(v) => setD({ ...d, ctaPrimary: v })} />
    </div>
  );
}

function MedicalStoryEditor({ data, onChange }: EditorProps) {
  const [d, setD] = useState({
    ...basicData(data), storyText: str(data.storyText),
    imagePrimary: str(data.imagePrimary), imageSecondary: str(data.imageSecondary),
    founderName: str(data.founderName), founderRole: str(data.founderRole), founderQuote: str(data.founderQuote),
    values: arr(data.values).map((v) => ({ icon: str(v.icon), title: str(v.title), text: str(v.text) })),
    milestones: arr(data.milestones).map((m) => ({ year: str(m.year), title: str(m.title), text: str(m.text) })),
    ctaPrimary: btn(data.ctaPrimary),
  });
  useReport(d as unknown as Record<string, unknown>, onChange);
  return (
    <div className="space-y-3">
      <Basics d={d} setD={setD} />
      <Field label="Story-Text" value={d.storyText} onChange={(v) => setD({ ...d, storyText: v })} multiline />
      <ImageUploadField label="Hauptbild" value={d.imagePrimary} onChange={(v) => setD({ ...d, imagePrimary: v })} />
      <ImageUploadField label="Zweitbild" value={d.imageSecondary} onChange={(v) => setD({ ...d, imageSecondary: v })} />
      <Field label="Gruender/Leiter Name" value={d.founderName} onChange={(v) => setD({ ...d, founderName: v })} />
      <Field label="Rolle" value={d.founderRole} onChange={(v) => setD({ ...d, founderRole: v })} />
      <Field label="Zitat" value={d.founderQuote} onChange={(v) => setD({ ...d, founderQuote: v })} multiline />
      <p className="text-xs font-semibold text-gray-500 pt-2">Werte</p>
      <Repeater items={d.values} addLabel="+ Wert" onAdd={() => setD({ ...d, values: [...d.values, { icon: '', title: '', text: '' }] })} render={(item, index) => (
        <div className="space-y-3"><IconPickerField label="Icon" value={item.icon} onChange={(v) => setD({ ...d, values: d.values.map((x: any, i: number) => i === index ? { ...x, icon: v } : x) })} /><Field label="Titel" value={item.title} onChange={(v) => setD({ ...d, values: d.values.map((x: any, i: number) => i === index ? { ...x, title: v } : x) })} /><Field label="Text" value={item.text} onChange={(v) => setD({ ...d, values: d.values.map((x: any, i: number) => i === index ? { ...x, text: v } : x) })} multiline /></div>
      )} />
      <p className="text-xs font-semibold text-gray-500 pt-2">Meilensteine</p>
      <Repeater items={d.milestones} addLabel="+ Meilenstein" onAdd={() => setD({ ...d, milestones: [...d.milestones, { year: '', title: '', text: '' }] })} render={(item, index) => (
        <div className="space-y-3"><Field label="Jahr" value={item.year} onChange={(v) => setD({ ...d, milestones: d.milestones.map((x: any, i: number) => i === index ? { ...x, year: v } : x) })} /><Field label="Titel" value={item.title} onChange={(v) => setD({ ...d, milestones: d.milestones.map((x: any, i: number) => i === index ? { ...x, title: v } : x) })} /><Field label="Text" value={item.text} onChange={(v) => setD({ ...d, milestones: d.milestones.map((x: any, i: number) => i === index ? { ...x, text: v } : x) })} multiline /></div>
      )} />
      <ButtonField label="CTA" value={d.ctaPrimary} onChange={(v) => setD({ ...d, ctaPrimary: v })} />
    </div>
  );
}

function ConfiguredField({ field, value, onChange }: { field: FieldConfig; value: unknown; onChange: (value: any) => void }) {
  if (field.kind === 'image') return <ImageUploadField label={field.label} value={str(value)} onChange={onChange} />;
  if (field.kind === 'button') return <ButtonField label={field.label} value={btn(value)} onChange={onChange} />;
  if (field.kind === 'icon') return <IconPickerField label={field.label} value={str(value)} onChange={onChange} />;
  if (field.kind === 'checkbox') return <Checkbox label={field.label} checked={Boolean(value)} onChange={onChange} />;
  return <Field label={field.label} value={str(value)} onChange={onChange} multiline={field.kind === 'multiline' || field.kind === 'lines'} />;
}

function Basics({ d, setD }: { d: { headline: string; subline: string; badgeText: string }; setD: Dispatch<SetStateAction<any>> }) {
  return <><Field label="Badge-Text" value={d.badgeText} onChange={(v) => setD({ ...d, badgeText: v })} /><Field label="Headline" value={d.headline} onChange={(v) => setD({ ...d, headline: v })} /><Field label="Subline" value={d.subline} onChange={(v) => setD({ ...d, subline: v })} multiline /></>;
}

function Field({ label, value, onChange, multiline }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean }) {
  return <label className="block text-sm"><span className="text-xs text-gray-600">{label}</span>{multiline ? <textarea className="admin-input mt-1 w-full" rows={3} value={value || ''} onChange={(e) => onChange(e.target.value)} /> : <input className="admin-input mt-1 w-full" value={value || ''} onChange={(e) => onChange(e.target.value)} />}</label>;
}

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />{label}</label>;
}

function Repeater({ items, addLabel, onAdd, render }: { items: any[]; addLabel: string; onAdd: () => void; render: (item: any, index: number) => ReactNode }) {
  return <div className="space-y-3">{items.map((item, index) => <div key={index} className="rounded border p-3">{render(item, index)}</div>)}<button type="button" className="text-sm text-blue-600" onClick={onAdd}>{addLabel}</button></div>;
}

function useReport(data: Record<string, unknown>, onChange: (d: Record<string, unknown>) => void) {
  const isFirst = useRef(true);
  const serialized = JSON.stringify(data);
  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    onChange(JSON.parse(serialized));
  }, [serialized, onChange]);
}

function updateItem(d: any, setD: Dispatch<SetStateAction<any>>, key: string, index: number, value: any) {
  setD({ ...d, [key]: d[key].map((item: any, i: number) => i === index ? value : item) });
}

function stateFromFields(data: Record<string, unknown>, fields: FieldConfig[]) {
  return fields.reduce<Record<string, unknown>>((acc, field) => {
    if (field.kind === 'button') acc[field.key] = btn(data[field.key]);
    else if (field.kind === 'lines') acc[field.key] = join(data[field.key]);
    else if (field.kind === 'checkbox') acc[field.key] = Boolean(data[field.key]);
    else acc[field.key] = str(data[field.key]);
    return acc;
  }, {});
}

function outputFromFields(data: Record<string, unknown>, fields: FieldConfig[]) {
  return fields.reduce<Record<string, unknown>>((acc, field) => {
    acc[field.key] = field.kind === 'lines' ? lines(str(data[field.key])) : data[field.key];
    return acc;
  }, {});
}

function basicData(data: Record<string, unknown>) {
  return { headline: str(data.headline), subline: str(data.subline), badgeText: str(data.badgeText) };
}

function str(value: unknown) {
  return (value as string) || '';
}

function arr(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value) ? value as Record<string, unknown>[] : [];
}

function btn(value: unknown): ButtonValue {
  return (value as ButtonValue) || { label: '', href: '' };
}

function join(value: unknown) {
  return Array.isArray(value) ? (value as string[]).join('\n') : '';
}

function lines(value: string): string[] {
  return (value || '').split('\n').map((item) => item.trim()).filter(Boolean);
}

function dayFromData(r: Record<string, unknown>) {
  return { label: str(r.label), hours: str(r.hours), note: str(r.note), closed: Boolean(r.closed) };
}

function infoCardFromData(r: Record<string, unknown>) {
  return { icon: str(r.icon), label: str(r.label), value: str(r.value) };
}
