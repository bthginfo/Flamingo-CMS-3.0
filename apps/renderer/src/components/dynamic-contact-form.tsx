'use client';

import { useState } from 'react';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type FormFieldDef = {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select';
  placeholder?: string;
  required?: boolean;
  options?: string[]; // for select type
  halfWidth?: boolean;
};

const DEFAULT_FIELDS: FormFieldDef[] = [
  { name: 'name', label: 'Name', type: 'text', placeholder: 'Ihr Name', required: true, halfWidth: true },
  { name: 'email', label: 'E-Mail', type: 'email', placeholder: 'E-Mail Adresse', required: true, halfWidth: true },
  { name: 'phone', label: 'Telefon', type: 'tel', placeholder: 'Telefon (optional)', required: false },
  { name: 'message', label: 'Nachricht', type: 'textarea', placeholder: 'Wie können wir Ihnen helfen?', required: true },
];

type Props = {
  fields?: FormFieldDef[];
  submitLabel?: string;
  className?: string;
  inputClassName?: string;
};

export function DynamicContactForm({
  fields,
  submitLabel = 'Nachricht senden',
  className,
  inputClassName,
}: Props) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  const formFields = (fields?.length ? fields : DEFAULT_FIELDS).map(f => ({
    ...f,
    label: f.label || f.name.charAt(0).toUpperCase() + f.name.slice(1).replace(/([A-Z])/g, ' $1'),
    placeholder: f.placeholder || f.label || f.name.charAt(0).toUpperCase() + f.name.slice(1).replace(/([A-Z])/g, ' $1'),
  }));

  const baseInput = inputClassName || 'w-full bg-white border border-gray-200 rounded-xl px-5 py-4 text-[15px] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary/40 transition-all duration-300 hover:border-gray-300';

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setStatus('loading');
        const form = e.currentTarget;
        const fd = new FormData(form);
        const payload: Record<string, string> = {};
        formFields.forEach((f) => {
          const val = fd.get(f.name);
          if (val) payload[f.name] = String(val);
        });
        payload._page = window.location.pathname;

        try {
          const res = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
          if (res.ok) {
            setStatus('success');
            form.reset();
          } else {
            const data = await res.json();
            setError(data.error || 'Fehler beim Senden.');
            setStatus('error');
          }
        } catch {
          setError('Verbindungsfehler. Bitte versuchen Sie es erneut.');
          setStatus('error');
        }
      }}
      className={cn('space-y-5', className)}
    >
      {status === 'success' ? (
        <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
          <CheckCircle className="text-green-500" size={48} />
          <p className="text-lg font-semibold text-gray-900">Vielen Dank!</p>
          <p className="text-sm text-gray-500">Ihre Nachricht wurde erfolgreich gesendet. Wir melden uns zeitnah.</p>
          <button type="button" onClick={() => setStatus('idle')} className="text-sm text-brand-primary hover:underline mt-2">Neue Nachricht senden</button>
        </div>
      ) : (
        <>
          {status === 'error' && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">
              <AlertCircle size={16} />
              {error}
            </div>
          )}
          {/* Render fields grouped by halfWidth */}
          {renderFields(formFields, baseInput)}
          <button
            type="submit"
            disabled={status === 'loading'}
            className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-xl bg-brand-primary px-8 py-4 font-semibold text-white transition-all duration-300 hover:shadow-glow hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <span className="relative z-10 flex items-center gap-2">
              <Send size={16} />
              {status === 'loading' ? 'Wird gesendet…' : submitLabel}
            </span>
            <div className="absolute inset-0 animate-shimmer bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.15),transparent)] bg-[length:200%_100%]" />
          </button>
        </>
      )}
    </form>
  );
}

function renderFields(fields: FormFieldDef[], inputClass: string) {
  const elements: React.ReactNode[] = [];
  let i = 0;
  while (i < fields.length) {
    const field = fields[i];
    // Group consecutive halfWidth fields into a 2-col grid
    if (field.halfWidth && i + 1 < fields.length && fields[i + 1].halfWidth) {
      elements.push(
        <div key={`row-${i}`} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {renderField(fields[i], inputClass)}
          {renderField(fields[i + 1], inputClass)}
        </div>
      );
      i += 2;
    } else {
      elements.push(<div key={`field-${i}`}>{renderField(field, inputClass)}</div>);
      i++;
    }
  }
  return elements;
}

function renderField(field: FormFieldDef, inputClass: string) {
  const labelEl = (
    <span className="block text-sm font-medium text-gray-700 mb-1.5">
      {field.label || field.name.charAt(0).toUpperCase() + field.name.slice(1)}{field.required && <span className="text-red-400 ml-0.5">*</span>}
    </span>
  );

  if (field.type === 'textarea') {
    return (
      <label key={field.name} className="block">
        {labelEl}
        <textarea
          name={field.name}
          placeholder={field.placeholder || field.label}
          required={field.required}
          rows={5}
          className={cn(inputClass, 'resize-none')}
        />
      </label>
    );
  }
  if (field.type === 'select') {
    return (
      <label key={field.name} className="block">
        {labelEl}
        <select
          name={field.name}
          required={field.required}
          className={inputClass}
          defaultValue=""
        >
          <option value="" disabled>{field.placeholder || field.label}</option>
          {field.options?.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </label>
    );
  }
  return (
    <label key={field.name} className="block">
      {labelEl}
      <input
        name={field.name}
        type={field.type}
        placeholder={field.placeholder || field.label}
        required={field.required}
        className={inputClass}
      />
    </label>
  );
}
