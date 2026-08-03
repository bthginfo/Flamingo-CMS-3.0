'use client';

import { AlertTriangle, ChevronDown, GripVertical, Plus, Trash2 } from 'lucide-react';
import { DEFAULT_ANAMNESIS_CUSTOM_FORM } from '@/lib/custom-form-defaults';
import { CUSTOM_FORM_FIELD_TYPES, parseCustomFormConfig, type CustomFormConfig, type CustomFormField, type CustomFormGroup } from '@/lib/custom-form';

type Props = { data: Record<string, unknown>; onChange: (data: Record<string, unknown>) => void };
const input = 'admin-input w-full';

export function CustomFormEditor({ data, onChange }: Props) {
  const parsed = parseCustomFormConfig(data);
  const config = parsed.success ? parsed.data : ({ ...DEFAULT_ANAMNESIS_CUSTOM_FORM, ...data } as CustomFormConfig);
  const update = (patch: Partial<CustomFormConfig>) => onChange({ ...config, ...patch });
  const updateGroup = (index: number, group: CustomFormGroup) => update({ groups: config.groups.map((item, itemIndex) => itemIndex === index ? group : item) });

  return <div className="space-y-5">
    <section className="space-y-3 rounded-xl border border-zinc-200 bg-white p-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Text label="Formularschlüssel" value={config.formKey} onChange={formKey => update({ formKey })} />
        <label className="block"><span className="mb-1 block text-xs font-medium text-zinc-600">Versandmodus</span><select className={input} value={config.deliveryPolicy} onChange={event => update({ deliveryPolicy: event.target.value as 'dry-run' | 'live' })}><option value="dry-run">Dry-run · keine E-Mails</option><option value="live">Live · Praxis und Ausfüller erhalten E-Mails</option></select></label>
      </div>
      {config.deliveryPolicy === 'live' && <div className="flex gap-2 rounded-lg border border-amber-300 bg-amber-50 p-3 text-xs leading-5 text-amber-900"><AlertTriangle aria-hidden="true" className="mt-0.5 shrink-0" size={16} />Live-Versand nutzt die SMTP-Konfiguration des Tenants. Erst nach bestätigtem Dry-run aktivieren.</div>}
      <Text label="Dachzeile" value={config.eyebrow || ''} onChange={eyebrow => update({ eyebrow })} />
      <Text label="Titel" value={config.title} onChange={title => update({ title })} />
      <Text label="Einleitung" value={config.description || ''} multiline onChange={description => update({ description })} />
      <div className="grid gap-3 sm:grid-cols-2"><Text label="Button" value={config.submitLabel} onChange={submitLabel => update({ submitLabel })} /><Text label="Datenschutz-Link" value={config.privacyHref} onChange={privacyHref => update({ privacyHref })} /></div>
      <div className="grid gap-3 sm:grid-cols-2"><Text label="Erfolgstitel" value={config.successTitle} onChange={successTitle => update({ successTitle })} /><Text label="Erfolgstext" value={config.successMessage} multiline onChange={successMessage => update({ successMessage })} /></div>
    </section>

    <section className="space-y-3 rounded-xl border border-zinc-200 bg-white p-4">
      <h3 className="text-sm font-semibold text-zinc-900">PDF und E-Mails</h3>
      <div className="grid gap-3 sm:grid-cols-2"><Text label="PDF-Titel" value={config.pdfTitle} onChange={pdfTitle => update({ pdfTitle })} /><Text label="PDF-Dateiname" value={config.pdfFilename} onChange={pdfFilename => update({ pdfFilename })} /></div>
      <Text label="Betreff an die Praxis" value={config.practiceSubject} onChange={practiceSubject => update({ practiceSubject })} />
      <Text label="Betreff der Bestätigung" value={config.confirmationSubject} onChange={confirmationSubject => update({ confirmationSubject })} />
      <Text label="Bestätigungstext" value={config.confirmationText} multiline onChange={confirmationText => update({ confirmationText })} />
      <div className="grid gap-3 sm:grid-cols-3"><Text label="E-Mail-Feld-ID" value={config.emailField} onChange={emailField => update({ emailField })} /><Text label="Vorname-Feld-ID" value={config.firstNameField || ''} onChange={firstNameField => update({ firstNameField })} /><Text label="Nachname-Feld-ID" value={config.lastNameField || ''} onChange={lastNameField => update({ lastNameField })} /></div>
    </section>

    <div className="space-y-3">
      {config.groups.map((group, groupIndex) => <GroupEditor key={`${group.id}-${groupIndex}`} group={group} allFields={config.groups.flatMap(item => item.fields)} onChange={next => updateGroup(groupIndex, next)} onRemove={() => update({ groups: config.groups.filter((_, index) => index !== groupIndex) })} />)}
      <button type="button" className="flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border border-dashed border-zinc-300 text-sm font-medium text-zinc-700 hover:border-blue-400 hover:text-blue-700" onClick={() => update({ groups: [...config.groups, { id: `gruppe_${config.groups.length + 1}`, title: 'Neue Gruppe', kind: 'default', fields: [{ id: `feld_${Date.now()}`, label: 'Neues Feld', type: 'text', required: false, width: 'full' }] }] })}><Plus size={15} />Gruppe hinzufügen</button>
    </div>
    {!parsed.success && <p className="text-xs leading-5 text-red-600">Die aktuelle Konfiguration ist noch unvollständig: {parsed.error.issues[0]?.message}</p>}
  </div>;
}

function GroupEditor({ group, allFields, onChange, onRemove }: { group: CustomFormGroup; allFields: CustomFormField[]; onChange: (group: CustomFormGroup) => void; onRemove: () => void }) {
  const updateField = (index: number, field: CustomFormField) => onChange({ ...group, fields: group.fields.map((item, itemIndex) => itemIndex === index ? field : item) });
  return <details open className="group rounded-xl border border-zinc-200 bg-white">
    <summary className="flex cursor-pointer list-none items-center gap-2 p-4"><GripVertical aria-hidden="true" size={16} className="text-zinc-400" /><span className="flex-1 text-sm font-semibold text-zinc-900">{group.title}</span><ChevronDown aria-hidden="true" size={16} className="transition group-open:rotate-180" /></summary>
    <div className="space-y-4 border-t border-zinc-100 p-4">
      <div className="grid gap-3 sm:grid-cols-3"><Text label="Gruppen-ID" value={group.id} onChange={id => onChange({ ...group, id })} /><Text label="Titel" value={group.title} onChange={title => onChange({ ...group, title })} /><label><span className="mb-1 block text-xs font-medium text-zinc-600">Darstellung</span><select className={input} value={group.kind} onChange={event => onChange({ ...group, kind: event.target.value as CustomFormGroup['kind'] })}><option value="default">Formulargruppe</option><option value="matrix">Ja/Nein-Matrix</option><option value="consent">Einwilligungen</option></select></label></div>
      <Text label="Beschreibung" value={group.description || ''} multiline onChange={description => onChange({ ...group, description })} />
      <div className="space-y-3">{group.fields.map((field, index) => <FieldEditor key={`${field.id}-${index}`} field={field} allFields={allFields} onChange={next => updateField(index, next)} onRemove={() => onChange({ ...group, fields: group.fields.filter((_, itemIndex) => itemIndex !== index) })} />)}</div>
      <div className="flex items-center justify-between"><button type="button" className="text-sm font-medium text-blue-600 hover:underline" onClick={() => onChange({ ...group, fields: [...group.fields, { id: `feld_${Date.now()}`, label: 'Neues Feld', type: 'text', required: false, width: 'full' }] })}>+ Feld hinzufügen</button><button type="button" className="flex items-center gap-1 text-xs text-red-600 hover:underline" onClick={onRemove}><Trash2 size={13} />Gruppe entfernen</button></div>
    </div>
  </details>;
}

function FieldEditor({ field, allFields, onChange, onRemove }: { field: CustomFormField; allFields: CustomFormField[]; onChange: (field: CustomFormField) => void; onRemove: () => void }) {
  const conditionValue = field.condition?.equals === true ? 'true' : field.condition?.equals === false ? 'false' : String(field.condition?.equals ?? '');
  return <details className="rounded-lg border border-zinc-200 bg-zinc-50/60">
    <summary className="flex cursor-pointer list-none items-center gap-2 px-3 py-3"><span className="flex-1 text-xs font-semibold text-zinc-800">{field.label} <span className="font-normal text-zinc-400">· {field.type}</span></span><ChevronDown size={14} /></summary>
    <div className="space-y-3 border-t border-zinc-200 p-3">
      <div className="grid gap-3 sm:grid-cols-2"><Text label="Feld-ID" value={field.id} onChange={id => onChange({ ...field, id })} /><Text label="Label" value={field.label} onChange={label => onChange({ ...field, label })} /></div>
      <div className="grid gap-3 sm:grid-cols-3"><label><span className="mb-1 block text-xs font-medium text-zinc-600">Typ</span><select className={input} value={field.type} onChange={event => onChange({ ...field, type: event.target.value as CustomFormField['type'], ...((event.target.value === 'select' || event.target.value === 'radio') && !field.options?.length ? { options: [{ value: 'option', label: 'Option' }] } : {}) })}>{CUSTOM_FORM_FIELD_TYPES.map(type => <option key={type} value={type}>{type}</option>)}</select></label><label><span className="mb-1 block text-xs font-medium text-zinc-600">Breite</span><select className={input} value={field.width} onChange={event => onChange({ ...field, width: event.target.value as CustomFormField['width'] })}><option value="full">Voll</option><option value="half">Halb</option><option value="third">Drittel</option></select></label><label className="flex items-end gap-2 pb-2 text-xs font-medium text-zinc-700"><input type="checkbox" checked={field.required} onChange={event => onChange({ ...field, required: event.target.checked })} />Pflichtfeld</label></div>
      <div className="grid gap-3 sm:grid-cols-2"><Text label="Platzhalter" value={field.placeholder || ''} onChange={placeholder => onChange({ ...field, placeholder })} /><Text label="Autocomplete" value={field.autocomplete || ''} onChange={autocomplete => onChange({ ...field, autocomplete })} /></div>
      <Text label="Hilfetext" value={field.helpText || ''} multiline onChange={helpText => onChange({ ...field, helpText })} />
      {(field.type === 'select' || field.type === 'radio' || (field.type === 'checkbox' && field.options?.length)) && <Text label="Optionen · je Zeile wert|Beschriftung" value={(field.options || []).map(option => `${option.value}|${option.label}`).join('\n')} multiline onChange={value => onChange({ ...field, options: value.split('\n').map(line => line.trim()).filter(Boolean).map(line => { const [optionValue, ...label] = line.split('|'); return { value: optionValue.trim(), label: (label.join('|') || optionValue).trim() }; }) })} />}
      {field.type === 'boolean-details' && <div className="grid gap-3 sm:grid-cols-2"><Text label="Label der Detailangabe" value={field.detailsLabel || ''} onChange={detailsLabel => onChange({ ...field, detailsLabel })} /><Text label="Platzhalter der Detailangabe" value={field.detailsPlaceholder || ''} onChange={detailsPlaceholder => onChange({ ...field, detailsPlaceholder })} /></div>}
      <div className="grid gap-3 sm:grid-cols-2"><label><span className="mb-1 block text-xs font-medium text-zinc-600">Nur anzeigen nach Feld</span><select className={input} value={field.condition?.field || ''} onChange={event => onChange({ ...field, condition: event.target.value ? { field: event.target.value, equals: true } : undefined })}><option value="">Immer anzeigen</option>{allFields.filter(item => item.id !== field.id).map(item => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>{field.condition && <Text label="Bedingungswert · true/false/Text" value={conditionValue} onChange={value => onChange({ ...field, condition: { field: field.condition!.field, equals: value === 'true' ? true : value === 'false' ? false : value } })} />}</div>
      <div className="text-right"><button type="button" className="text-xs text-red-600 hover:underline" onClick={onRemove}>Feld entfernen</button></div>
    </div>
  </details>;
}

function Text({ label, value, multiline, onChange }: { label: string; value: string; multiline?: boolean; onChange: (value: string) => void }) {
  return <label className="block"><span className="mb-1 block text-xs font-medium text-zinc-600">{label}</span>{multiline ? <textarea className={input} rows={3} value={value} onChange={event => onChange(event.target.value)} /> : <input className={input} value={value} onChange={event => onChange(event.target.value)} />}</label>;
}
