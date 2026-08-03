'use client';

import { useId, useMemo, useRef, useState } from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, LockKeyhole, Send } from 'lucide-react';
import type { SectionProps } from './industry-kit';
import {
  customFormValueToText,
  isCustomFormFieldVisible,
  parseCustomFormRenderConfig,
  validateCustomFormValues,
  type CustomFormField,
  type CustomFormValue,
} from '@/lib/custom-form';
import {
  createRendererContactActionIdentity,
  rendererContactRequestHeaders,
  type RendererContactActionIdentity,
} from '@/lib/renderer-contact-client-security';

type Status = 'idle' | 'sending' | 'success' | 'error';

export function CustomFormSection({ data }: SectionProps) {
  const parsed = useMemo(() => parseCustomFormRenderConfig(data), [data]);
  const [values, setValues] = useState<Record<string, CustomFormValue>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const actionIdentity = useRef<RendererContactActionIdentity | null>(null);
  const prefix = useId().replace(/:/g, '');

  if (!parsed.success) {
    const isPreview = data._isSectionPreview === true;
    return (
      <div className="mx-auto max-w-3xl border border-[var(--token-card-border)] bg-[var(--token-card-bg)] p-6 sm:p-8" data-card="" role="alert">
        <div className="flex items-start gap-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--token-badge-bg)] text-[color:var(--token-badge-text)]"><AlertTriangle aria-hidden="true" size={20} /></span>
          <div>
            <h2 className="text-xl font-semibold text-[color:var(--token-card-heading)]">{isPreview ? 'Formularkonfiguration prüfen' : 'Dieses Formular ist derzeit nicht verfügbar.'}</h2>
            <p className="mt-2 text-sm leading-6 text-[color:var(--token-card-body)]">{isPreview ? 'Mindestens eine Angabe ist unvollständig oder ungültig. Öffnen Sie die Section im Editor und prüfen Sie die markierten Formularfelder.' : 'Bitte kontaktieren Sie uns direkt. Wir helfen Ihnen gern persönlich weiter.'}</p>
            {isPreview && <p className="mt-3 text-xs leading-5 text-[color:var(--token-card-muted)]">{parsed.error.issues[0]?.path.join('.') || 'Konfiguration'}: {parsed.error.issues[0]?.message}</p>}
          </div>
        </div>
      </div>
    );
  }
  const config = parsed.data;
  const setValue = (fieldId: string, value: CustomFormValue) => {
    actionIdentity.current = null;
    setValues(current => ({ ...current, [fieldId]: value }));
    setFieldErrors(current => {
      if (!current[fieldId]) return current;
      const next = { ...current };
      delete next[fieldId];
      return next;
    });
  };
  const focusFirstError = (errors: Record<string, string>) => {
    const first = config.groups.flatMap(group => group.fields).find(field => errors[field.id]);
    if (first) requestAnimationFrame(() => document.getElementById(`${prefix}-${first.id}`)?.focus());
  };

  return (
    <div className="mx-auto max-w-5xl">
      <style>{`@keyframes customFormDetailReveal{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <header className="max-w-3xl">
        {config.eyebrow && <p className="section-badge mb-4 inline-flex border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]" data-edit-path="eyebrow">{config.eyebrow}</p>}
        <h2 className="text-balance text-3xl font-bold leading-tight text-[color:var(--token-heading)] sm:text-4xl lg:text-5xl" data-edit-path="title">{config.title}</h2>
        {config.description && <p className="mt-5 max-w-2xl text-base leading-7 text-[color:var(--token-body)] sm:text-lg" data-edit-path="description">{config.description}</p>}
      </header>

      <div className="mt-10 border border-[var(--token-card-border)] bg-[var(--token-card-bg)] shadow-[0_24px_70px_-45px_color-mix(in_srgb,var(--token-heading)_45%,transparent)] sm:mt-12" data-card="">
        {status === 'success' ? (
          <div className="flex min-h-80 flex-col items-center justify-center px-6 py-16 text-center" role="status" aria-live="polite">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--token-badge-bg)] text-[color:var(--token-badge-text)]"><CheckCircle2 aria-hidden="true" size={28} /></span>
            <h3 className="mt-6 text-2xl font-semibold text-[color:var(--token-card-heading)]">{config.successTitle}</h3>
            <p className="mt-3 max-w-xl leading-7 text-[color:var(--token-card-body)]">{config.successMessage}</p>
          </div>
        ) : (
          <form
            noValidate
            className="divide-y divide-[var(--token-card-border)]"
            aria-busy={status === 'sending'}
            onSubmit={async event => {
              event.preventDefault();
              setMessage('');
              const checked = validateCustomFormValues(config, values);
              if (!checked.success) {
                setFieldErrors(checked.fieldErrors);
                setMessage(checked.error);
                setStatus('error');
                focusFirstError(checked.fieldErrors);
                return;
              }
                setStatus('sending');
                try {
                  const honeypot = new FormData(event.currentTarget).get('_website');
                  const payload = { values: checked.values, _website: String(honeypot || ''), page: window.location.pathname };
                  actionIdentity.current = createRendererContactActionIdentity(payload, actionIdentity.current);
                  const response = await fetch(`/api/forms/${encodeURIComponent(config.formKey)}`, {
                    method: 'POST',
                    headers: rendererContactRequestHeaders(actionIdentity.current.idempotencyKey),
                    body: actionIdentity.current.serializedPayload,
                  });
                  const result = await response.json().catch(() => null) as { error?: string; fieldErrors?: Record<string, string>; retryWithNewIdempotencyKey?: boolean } | null;
                  if (!response.ok) {
                    if (result?.retryWithNewIdempotencyKey) actionIdentity.current = null;
                    const errors = result?.fieldErrors || {};
                  setFieldErrors(errors);
                  setMessage(result?.error || 'Die Übermittlung war nicht möglich. Bitte versuchen Sie es erneut.');
                  setStatus('error');
                  focusFirstError(errors);
                  return;
                }
                  setStatus('success');
                  actionIdentity.current = null;
                  setValues({});
                setFieldErrors({});
              } catch {
                setMessage('Die Verbindung konnte nicht hergestellt werden. Bitte versuchen Sie es erneut.');
                setStatus('error');
              }
            }}
          >
            <div className="absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true">
              <label htmlFor={`${prefix}-website`}>Website</label>
              <input id={`${prefix}-website`} name="_website" tabIndex={-1} autoComplete="off" />
            </div>
            {config.groups.map((group, groupIndex) => (
              <fieldset key={group.id} className="px-5 py-8 sm:px-8 sm:py-10 lg:px-12">
                <legend className="w-full px-0">
                  <span className="flex items-baseline gap-3">
                    <span className="text-xs font-semibold tabular-nums text-[color:var(--token-muted)]">{String(groupIndex + 1).padStart(2, '0')}</span>
                    <span className="text-xl font-semibold text-[color:var(--token-card-heading)] sm:text-2xl">{group.title}</span>
                  </span>
                  {group.description && <span className="mt-3 block pl-8 text-base leading-7 text-[color:var(--token-card-muted)]">{group.description}</span>}
                </legend>
                <div className={group.kind === 'matrix' ? 'mt-8 grid gap-4 sm:gap-5' : 'mt-8 grid grid-cols-1 gap-x-6 gap-y-7 sm:grid-cols-6'}>
                  {group.fields.filter(field => isCustomFormFieldVisible(field, values)).map(field => (
                    <CustomField key={field.id} field={field} value={values[field.id]} error={fieldErrors[field.id]} prefix={prefix} matrix={group.kind === 'matrix'} onChange={value => setValue(field.id, value)} />
                  ))}
                </div>
              </fieldset>
            ))}
            <div className="px-5 py-8 sm:px-8 lg:px-12">
              <div className="min-h-6" role="alert" aria-live="assertive">
                {status === 'error' && message && <p className="flex items-start gap-2 text-base font-semibold leading-6 text-[color:var(--token-danger)]"><AlertCircle aria-hidden="true" className="mt-0.5 shrink-0" size={18} />{message}</p>}
              </div>
              <div className="mt-5 flex flex-col gap-5 border-t border-[var(--token-card-border)] pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="flex max-w-xl items-start gap-2 text-sm leading-6 text-[color:var(--token-card-muted)]"><LockKeyhole aria-hidden="true" className="mt-0.5 shrink-0" size={17} />{config.helpText || <>Wir behandeln Ihre Angaben vertraulich. Weitere Hinweise finden Sie in unserer <a className="font-semibold underline underline-offset-2" href={config.privacyHref}>{config.privacyLabel}</a>.</>}</p>
                <button type="submit" disabled={status === 'sending'} className="cms-button cms-button--primary min-h-12 shrink-0 disabled:cursor-wait disabled:opacity-65">
                  <Send aria-hidden="true" size={16} />
                  {status === 'sending' ? 'Wird sicher übermittelt…' : config.submitLabel}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function CustomField({
  field,
  value,
  error,
  prefix,
  matrix,
  onChange,
}: {
  field: CustomFormField;
  value?: CustomFormValue;
  error?: string;
  prefix: string;
  matrix: boolean;
  onChange: (value: CustomFormValue) => void;
}) {
  const id = `${prefix}-${field.id}`;
  const describedBy = [field.helpText ? `${id}-help` : '', error ? `${id}-error` : ''].filter(Boolean).join(' ') || undefined;
  const width = field.width === 'half' ? 'sm:col-span-3' : field.width === 'third' ? 'sm:col-span-2' : 'sm:col-span-6';
  const inputClass = `min-h-12 w-full border bg-[var(--token-input-bg)] px-3.5 py-2.5 text-base text-[color:var(--token-input-text)] outline-none transition-[border-color,box-shadow] placeholder:text-[color:var(--token-muted)] focus:border-[var(--token-brand)] focus:ring-4 focus:ring-[color:color-mix(in_srgb,var(--token-brand)_20%,transparent)] ${error ? 'border-[var(--token-danger)]' : 'border-[var(--token-input-border)]'}`;
  const label = (
    <label htmlFor={id} className="mb-2 block text-[15px] font-semibold leading-6 text-[color:var(--token-card-heading)]">
      {field.label}
      {field.required && <span className="ml-1 text-[color:var(--token-danger)]" aria-hidden="true">*</span>}
    </label>
  );
  const help = (
    <>
      {field.helpText && <p id={`${id}-help`} className="mt-2 text-sm leading-6 text-[color:var(--token-card-muted)]">{field.helpText}</p>}
      {error && <p id={`${id}-error`} className="mt-2 text-sm font-semibold leading-6 text-[color:var(--token-danger)]">{error}</p>}
    </>
  );

  if (field.type === 'boolean-details') {
    const entry = typeof value === 'object' && value && !Array.isArray(value) ? value : undefined;
    const answered = typeof entry?.answer === 'boolean';
    const cardClass = matrix
      ? `rounded-[var(--token-card-radius)] !border-2 p-5 shadow-[0_14px_34px_-28px_color-mix(in_srgb,var(--token-heading)_40%,transparent)] transition-[border-color,background-color,box-shadow] sm:p-6 ${
          error
            ? 'border-[var(--token-danger)] bg-[var(--token-danger-bg)]'
            : answered
              ? 'border-[var(--token-btn-bg)] bg-[color:color-mix(in_srgb,var(--token-btn-bg)_6%,var(--token-card-bg))]'
              : 'border-[var(--token-card-border)] bg-[var(--token-card-bg)]'
        }`
      : width;

    return (
      <div className={cardClass}>
        <fieldset aria-describedby={describedBy} aria-invalid={Boolean(error)}>
          <legend className="text-base font-bold leading-6 text-[color:var(--token-card-heading)] sm:text-lg">{field.label}{field.required && <span className="ml-1 text-[color:var(--token-danger)]" aria-hidden="true">*</span>}</legend>
          <div className="mt-4 flex flex-wrap gap-3">
            {[true, false].map(answer => (
              <label key={String(answer)} className="cursor-pointer">
                <input
                  id={answer ? id : undefined}
                  className="peer sr-only"
                  type="radio"
                  name={field.id}
                  checked={entry?.answer === answer}
                  onChange={() => onChange({ answer, details: entry?.details })}
                />
                <span className="flex min-h-12 min-w-24 items-center justify-center rounded-[var(--token-button-radius)] !border-2 border-[var(--token-input-border)] bg-[var(--token-input-bg)] px-5 text-base font-bold text-[color:var(--token-card-body)] transition-[border-color,background-color,color,box-shadow] peer-checked:border-[var(--token-btn-bg)] peer-checked:bg-[var(--token-btn-bg)] peer-checked:text-[color:var(--token-btn-text)] peer-focus-visible:ring-4 peer-focus-visible:ring-[color:color-mix(in_srgb,var(--token-brand)_28%,transparent)] peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[var(--token-card-bg)]">
                  {answer ? 'Ja' : 'Nein'}
                </span>
              </label>
            ))}
          </div>
          {entry?.answer && (
            <div className="mt-5 border-t border-[var(--token-card-border)] pt-5 motion-safe:animate-[customFormDetailReveal_180ms_ease-out]">
              <label htmlFor={`${id}-details`} className="mb-2 block text-[15px] font-semibold leading-6 text-[color:var(--token-card-heading)]">
                {field.detailsLabel || 'Ergänzende Angaben'}
                {field.detailsRequired && <span className="ml-1 text-[color:var(--token-danger)]" aria-hidden="true">*</span>}
              </label>
              <textarea
                id={`${id}-details`}
                rows={3}
                value={entry.details || ''}
                placeholder={field.detailsPlaceholder}
                onChange={event => onChange({ answer: true, details: event.target.value })}
                className={`${inputClass} resize-y`}
              />
            </div>
          )}
          {help}
        </fieldset>
      </div>
    );
  }

  if (field.type === 'radio') {
    return (
      <fieldset className={width} aria-describedby={describedBy} aria-invalid={Boolean(error)}>
        <legend className="text-[15px] font-semibold leading-6 text-[color:var(--token-card-heading)]">{field.label}{field.required && <span className="ml-1 text-[color:var(--token-danger)]" aria-hidden="true">*</span>}</legend>
        <div className="mt-3 flex flex-wrap gap-3">
          {field.options?.map((option, index) => (
            <label key={option.value} className="cursor-pointer">
              <input id={index === 0 ? id : undefined} className="peer sr-only" type="radio" name={field.id} checked={value === option.value} onChange={() => onChange(option.value)} />
              <span className="flex min-h-12 items-center rounded-[var(--token-button-radius)] !border-2 border-[var(--token-input-border)] bg-[var(--token-input-bg)] px-5 text-base font-semibold text-[color:var(--token-card-body)] transition-[border-color,background-color,color,box-shadow] peer-checked:border-[var(--token-btn-bg)] peer-checked:bg-[var(--token-btn-bg)] peer-checked:text-[color:var(--token-btn-text)] peer-focus-visible:ring-4 peer-focus-visible:ring-[color:color-mix(in_srgb,var(--token-brand)_28%,transparent)] peer-focus-visible:ring-offset-2">
                {option.label}
              </span>
            </label>
          ))}
        </div>
        {help}
      </fieldset>
    );
  }

  if (field.type === 'checkbox') {
    if (field.options?.length) {
      const selected = Array.isArray(value) ? value : [];
      return (
        <fieldset className={width} aria-describedby={describedBy} aria-invalid={Boolean(error)}>
          <legend className="text-[15px] font-semibold leading-6 text-[color:var(--token-card-heading)]">{field.label}</legend>
          <div className="mt-3 space-y-3">
            {field.options.map((option, index) => {
              const isSelected = selected.includes(option.value);
              return (
                <label key={option.value} className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-[var(--token-button-radius)] !border-2 px-4 py-3 text-[15px] leading-6 text-[color:var(--token-card-body)] transition-[border-color,background-color,box-shadow] focus-within:ring-4 focus-within:ring-[color:color-mix(in_srgb,var(--token-brand)_20%,transparent)] ${isSelected ? 'border-[var(--token-btn-bg)] bg-[color:color-mix(in_srgb,var(--token-btn-bg)_6%,var(--token-input-bg))]' : 'border-[var(--token-input-border)] bg-[var(--token-input-bg)]'}`}>
                  <input id={index === 0 ? id : undefined} type="checkbox" checked={isSelected} onChange={event => onChange(event.target.checked ? [...selected, option.value] : selected.filter(item => item !== option.value))} className="h-6 w-6 shrink-0 accent-[var(--token-brand)]" />
                  {option.label}
                </label>
              );
            })}
          </div>
          {help}
        </fieldset>
      );
    }

    const checked = value === true;
    return (
      <div className={width}>
        <label className={`flex cursor-pointer items-start gap-3 rounded-[var(--token-card-radius)] !border-2 p-5 text-[15px] leading-6 transition-[border-color,background-color,box-shadow] focus-within:ring-4 focus-within:ring-[color:color-mix(in_srgb,var(--token-brand)_20%,transparent)] ${error ? 'border-[var(--token-danger)] bg-[var(--token-danger-bg)]' : checked ? 'border-[var(--token-btn-bg)] bg-[color:color-mix(in_srgb,var(--token-btn-bg)_6%,var(--token-input-bg))]' : 'border-[var(--token-input-border)] bg-[var(--token-input-bg)]'}`}>
          <input id={id} type="checkbox" checked={checked} onChange={event => onChange(event.target.checked)} aria-describedby={describedBy} aria-invalid={Boolean(error)} className="mt-0.5 h-6 w-6 shrink-0 accent-[var(--token-brand)]" />
          <span className="text-[color:var(--token-card-body)]">{field.label}{field.required && <span className="ml-1 text-[color:var(--token-danger)]" aria-hidden="true">*</span>}</span>
        </label>
        {help}
      </div>
    );
  }

  const common = { id, required: field.required, placeholder: field.placeholder, autoComplete: field.autocomplete, 'aria-describedby': describedBy, 'aria-invalid': Boolean(error) as boolean };
  return <div className={width}>{label}{field.type === 'textarea' ? <textarea {...common} rows={5} maxLength={field.maxLength} value={typeof value === 'string' ? value : ''} onChange={event => onChange(event.target.value)} className={`${inputClass} resize-y`} /> : field.type === 'select' ? <select {...common} value={typeof value === 'string' ? value : ''} onChange={event => onChange(event.target.value)} className={inputClass}><option value="">{field.placeholder || 'Bitte auswählen'}</option>{field.options?.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select> : <input {...common} type={field.type} min={field.min} max={field.max} maxLength={field.maxLength} value={typeof value === 'string' || typeof value === 'number' ? value : ''} onChange={event => onChange(field.type === 'number' ? Number(event.target.value) : event.target.value)} className={inputClass} />}{help}</div>;
}
