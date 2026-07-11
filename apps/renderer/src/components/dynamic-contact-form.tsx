'use client';

import { useEffect, useId, useState } from 'react';
import { AlertCircle, CheckCircle, Info, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FormField } from '@/templates/shared/section-primitives';
import {
  DEFAULT_CONTACT_FORM_FIELDS,
  normalizeContactFormFields,
  type ContactFormFieldDefinition,
} from '@/lib/contact-form';
import {
  LEAD_CONTEXT_STORAGE_KEY,
  parseLeadContext,
  resolveLeadContext,
  type LeadContext,
} from '@/lib/lead-context';

export type FormFieldDef = ContactFormFieldDefinition;

type Props = {
  fields?: FormFieldDef[];
  submitLabel?: string;
  className?: string;
  inputClassName?: string;
  leadContext?: LeadContext | null;
};

export function DynamicContactForm({
  fields,
  submitLabel = 'Nachricht senden',
  className,
  inputClassName,
  leadContext: directLeadContext,
}: Props) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const [storedLeadContext, setStoredLeadContext] = useState<LeadContext | null>(null);
  const formId = useId().replace(/:/g, '');

  const formFields = normalizeContactFormFields(fields?.length ? fields : DEFAULT_CONTACT_FORM_FIELDS).map((field) => ({
    ...field,
    label: field.label || humanizeFieldName(field.name),
    placeholder: field.placeholder || field.label || humanizeFieldName(field.name),
  }));

  useEffect(() => {
    if (directLeadContext) return;
    let stored: string | null = null;
    try {
      stored = window.sessionStorage.getItem(LEAD_CONTEXT_STORAGE_KEY);
    } catch {
      // Session storage is optional; URL parameters still work.
    }
    setStoredLeadContext(parseLeadContext(window.location.search, stored));
  }, [directLeadContext]);

  const leadContext = resolveLeadContext(directLeadContext, storedLeadContext);

  const baseInput = cn(
    'min-h-12 w-full rounded-xl border border-[var(--token-input-border)] bg-[var(--token-input-bg)] px-4 py-3 text-[15px] text-[color:var(--token-input-text)] placeholder:text-[color:var(--token-muted)] transition-[border-color,box-shadow,background-color] duration-200',
    inputClassName,
  );

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        setError('');
        setStatus('loading');
        const form = event.currentTarget;
        const formData = new FormData(form);
        const payload: Record<string, unknown> = {};
        formFields.forEach((field) => {
          const value = formData.get(field.name);
          if (value) payload[field.name] = String(value);
        });
        payload._website = String(formData.get('_website') || '');
        payload._formFields = formFields;
        payload._page = window.location.pathname;
        if (leadContext) {
          payload._source = leadContext.source;
          payload._summary = leadContext.summary;
        }

        try {
          const response = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
          if (response.ok) {
            setStatus('success');
            form.reset();
            try {
              window.sessionStorage.removeItem(LEAD_CONTEXT_STORAGE_KEY);
            } catch {
              // Ignore restricted storage.
            }
            setStoredLeadContext(null);
          } else {
            const data = await response.json().catch(() => null) as { error?: string } | null;
            setError(data?.error || 'Fehler beim Senden. Bitte versuchen Sie es erneut.');
            setStatus('error');
          }
        } catch {
          setError('Verbindungsfehler. Bitte versuchen Sie es erneut.');
          setStatus('error');
        }
      }}
      className={cn('space-y-5', className)}
      aria-busy={status === 'loading'}
    >
      {status === 'success' ? (
        <div className="flex flex-col items-center justify-center gap-3 py-10 text-center" role="status" aria-live="polite">
          <CheckCircle aria-hidden="true" className="text-[color:var(--token-success)]" size={44} />
          <p className="text-lg font-semibold text-[color:var(--token-heading)]">Vielen Dank!</p>
          <p className="max-w-md text-sm leading-6 text-[color:var(--token-muted)]">Ihre Nachricht wurde erfolgreich gesendet. Wir melden uns zeitnah.</p>
          <button type="button" onClick={() => setStatus('idle')} className="cms-button cms-button--secondary mt-2">Neue Nachricht senden</button>
        </div>
      ) : (
        <>
          <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
            <label htmlFor={`${formId}-website`}>Website</label>
            <input id={`${formId}-website`} name="_website" type="text" tabIndex={-1} autoComplete="off" />
          </div>
          {leadContext && (
            <div className="flex items-start gap-3 rounded-xl border border-[var(--token-card-border)] bg-[color:color-mix(in_srgb,var(--token-badge-bg)_55%,var(--token-card-bg))] p-4 text-sm text-[color:var(--token-card-body,var(--token-body))]" role="status">
              <Info aria-hidden="true" className="mt-0.5 shrink-0 text-[color:var(--token-icon)]" size={17} />
              <div>
                <span className="font-semibold text-[color:var(--token-card-heading,var(--token-heading))]">Ihre Auswahl wurde übernommen</span>
                <p className="mt-1 whitespace-pre-line text-[color:var(--token-card-muted,var(--token-muted))]">{leadContext.summary}</p>
              </div>
            </div>
          )}
          {status === 'error' && (
            <div className="flex items-start gap-2 rounded-xl border border-[color:color-mix(in_srgb,var(--token-danger)_35%,transparent)] bg-[color:color-mix(in_srgb,var(--token-danger)_8%,var(--token-card-bg))] p-3 text-sm text-[color:var(--token-danger)]" role="alert">
              <AlertCircle aria-hidden="true" className="mt-0.5 shrink-0" size={16} />
              {error}
            </div>
          )}
          {renderFields(formFields, baseInput, formId)}
          <button type="submit" disabled={status === 'loading'} className="cms-button cms-button--primary w-full sm:w-auto">
            <Send aria-hidden="true" size={16} />
            <span>{status === 'loading' ? 'Wird gesendet…' : submitLabel}</span>
          </button>
        </>
      )}
    </form>
  );
}

function renderFields(fields: FormFieldDef[], inputClass: string, idPrefix: string) {
  const elements: React.ReactNode[] = [];
  let index = 0;
  while (index < fields.length) {
    const field = fields[index];
    if (field.halfWidth && index + 1 < fields.length && fields[index + 1].halfWidth) {
      elements.push(
        <div key={`row-${index}`} className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {renderField(fields[index], inputClass, idPrefix)}
          {renderField(fields[index + 1], inputClass, idPrefix)}
        </div>,
      );
      index += 2;
    } else {
      elements.push(<div key={`field-${index}`}>{renderField(field, inputClass, idPrefix)}</div>);
      index += 1;
    }
  }
  return elements;
}

function renderField(field: FormFieldDef, inputClass: string, idPrefix: string) {
  const id = `${idPrefix}-${field.name.replace(/[^a-zA-Z0-9_-]/g, '-')}`;
  const autoComplete = getAutocomplete(field);

  if (field.type === 'textarea') {
    return (
      <FormField key={field.name} id={id} label={field.label} required={field.required}>
        <textarea
          id={id}
          name={field.name}
          placeholder={field.placeholder || field.label}
          required={field.required}
          rows={5}
          className={cn(inputClass, 'resize-y')}
        />
      </FormField>
    );
  }

  if (field.type === 'select') {
    return (
      <FormField key={field.name} id={id} label={field.label} required={field.required}>
        <select id={id} name={field.name} required={field.required} autoComplete={autoComplete} className={inputClass} defaultValue="">
          <option value="" disabled>{field.placeholder || field.label}</option>
          {field.options?.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
      </FormField>
    );
  }

  return (
    <FormField key={field.name} id={id} label={field.label} required={field.required}>
      <input
        id={id}
        name={field.name}
        type={field.type}
        placeholder={field.placeholder || field.label}
        required={field.required}
        autoComplete={autoComplete}
        className={inputClass}
      />
    </FormField>
  );
}

function humanizeFieldName(name: string) {
  return name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, ' $1');
}

function getAutocomplete(field: FormFieldDef): string | undefined {
  const name = field.name.toLowerCase();
  if (field.type === 'email' || name.includes('email') || name.includes('e-mail')) return 'email';
  if (field.type === 'tel' || name.includes('phone') || name.includes('telefon')) return 'tel';
  if (name === 'name' || name.includes('fullname') || name.includes('vollname')) return 'name';
  if (name.includes('firstname') || name.includes('vorname')) return 'given-name';
  if (name.includes('lastname') || name.includes('nachname')) return 'family-name';
  if (name.includes('company') || name.includes('firma')) return 'organization';
  if (name.includes('address') || name.includes('adresse')) return 'street-address';
  if (name.includes('city') || name.includes('ort')) return 'address-level2';
  if (name.includes('zip') || name.includes('postal') || name.includes('plz')) return 'postal-code';
  return undefined;
}
