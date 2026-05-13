import { useState } from 'react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

export type ContactFormField = 'name' | 'email' | 'phone' | 'branche' | 'paket' | 'subject' | 'message';

/** One row from `SiteContent.formFields` (admin order). */
export type ContactFormFieldRow = {
  key: string;
  label: string;
  type?: string;
  required?: boolean;
};

export interface ContactFormProps {
  /** Identifier for the source (e.g. "agency-landing", "tenant:restaurant"). Sent with the request. */
  source?: string;
  /** Tenant / brand name for the subject line. */
  tenant?: string;
  /** Which fields to render when `fieldRows` is not set. Defaults to a sensible subset. `name`, `email` and `message` are always included when using this mode. */
  fields?: ContactFormField[];
  /**
   * Full ordered form definition from CMS (`formFields`). When set, renders every row
   * (standard + custom). Unknown keys are sent under `extras` in the JSON body.
   */
  fieldRows?: ContactFormFieldRow[];
  /** Branche options when the `branche` field is rendered. */
  brancheOptions?: string[];
  /** Paket options when the `paket` field is rendered. */
  paketOptions?: string[];
  className?: string;
  /** Visual variant for the submit button. */
  buttonClass?: string;
  /** Heading-level wrapper around the success state. */
  successTitle?: string;
  successText?: string;
  /** Optional pre-fill for `paket` when "Paket-Interesse" comes from a CTA click. */
  defaultPaket?: string;
}

const DEFAULT_FIELDS: ContactFormField[] = ['name', 'email', 'message'];

const STANDARD_KEYS = new Set<ContactFormField>(['name', 'email', 'phone', 'subject', 'message', 'branche', 'paket']);

const DEFAULT_ROW: Record<'name' | 'email' | 'message', ContactFormFieldRow> = {
  name: { key: 'name', label: 'Name', type: 'text', required: true },
  email: { key: 'email', label: 'E-Mail', type: 'email', required: true },
  message: { key: 'message', label: 'Ihre Nachricht', type: 'textarea', required: true },
};

function normalizeFieldRows(rows: ContactFormFieldRow[]): ContactFormFieldRow[] {
  const cleaned = rows
    .map((r) => ({
      key: String(r.key || '').trim().toLowerCase(),
      label: String(r.label || '').trim() || String(r.key || '').trim(),
      type: r.type,
      required: r.required === true,
    }))
    .filter((r) => r.key);
  const seen = new Set<string>();
  const deduped: ContactFormFieldRow[] = [];
  for (const r of cleaned) {
    if (seen.has(r.key)) continue;
    seen.add(r.key);
    deduped.push(r);
  }
  let out = [...deduped];
  const has = (k: string) => out.some((r) => r.key === k);
  const prefix: ContactFormFieldRow[] = [];
  if (!has('name')) prefix.push({ ...DEFAULT_ROW.name });
  if (!has('email')) prefix.push({ ...DEFAULT_ROW.email });
  out = [...prefix, ...out];
  if (!out.some((r) => r.key === 'message')) out.push({ ...DEFAULT_ROW.message });
  return out;
}

function isStandardKey(k: string): k is ContactFormField {
  return STANDARD_KEYS.has(k as ContactFormField);
}

export function ContactForm({
  source = '',
  tenant = '',
  fields = DEFAULT_FIELDS,
  fieldRows,
  brancheOptions,
  paketOptions,
  className = '',
  buttonClass = 'btn-primary w-full justify-center',
  successTitle = 'Vielen Dank.',
  successText = 'Wir melden uns innerhalb von 24 Stunden.',
  defaultPaket = '',
}: ContactFormProps) {
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const rowsMode = Array.isArray(fieldRows) && fieldRows.length > 0;
  const normalizedRows = rowsMode ? normalizeFieldRows(fieldRows) : null;

  if (state === 'sent') {
    return (
      <div className={`bg-white border border-line rounded-3xl p-8 md:p-10 text-center ${className}`}>
        <div className="text-5xl mb-4" aria-hidden>✓</div>
        <h3 className="font-display text-3xl">{successTitle}</h3>
        <p className="mt-3 text-muted">{successText}</p>
      </div>
    );
  }

  const inputCls = 'w-full bg-[var(--surface-color)] rounded-xl px-4 py-3 border border-line focus:border-brand outline-none transition';
  const legacyFields = (() => {
    const list = [...fields];
    for (const req of ['name', 'email', 'message'] as const) {
      if (!list.includes(req)) list.unshift(req);
    }
    return list;
  })();
  const hasLegacy = (f: ContactFormField) => legacyFields.includes(f);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState('sending');
    setErrorMsg('');
    const fd = new FormData(e.currentTarget);
    const payload: Record<string, unknown> = { source, tenant };
    const extras: Record<string, string> = {};
    fd.forEach((v, k) => {
      if (k === 'website') {
        payload.website = String(v);
        return;
      }
      if (k.startsWith('extra__')) {
        const inner = k.slice(7);
        if (inner) extras[inner] = String(v);
        return;
      }
      payload[k] = String(v);
    });
    if (Object.keys(extras).length > 0) payload.extras = extras;
    try {
      const r = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || !j?.ok) {
        setState('error');
        const msg = j?.error || 'Senden fehlgeschlagen. Bitte später erneut versuchen.';
        setErrorMsg(msg);
        toast.error('Senden fehlgeschlagen', { description: msg });
        return;
      }
      setState('sent');
      toast.success('Nachricht gesendet', { description: successText });
      try {
        const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
        if (!reduce) {
          const fire = (origin: { x: number; y: number }) =>
            confetti({
              particleCount: 70,
              spread: 70,
              startVelocity: 38,
              origin,
              colors: ['#F24171', '#FFB347', '#7C3AED', '#22d3ee'],
              disableForReducedMotion: true,
            });
          fire({ x: 0.2, y: 0.7 });
          setTimeout(() => fire({ x: 0.8, y: 0.7 }), 180);
          setTimeout(() => fire({ x: 0.5, y: 0.6 }), 340);
        }
      } catch { /* noop */ }
    } catch {
      setState('error');
      const msg = 'Netzwerkfehler. Bitte später erneut versuchen.';
      setErrorMsg(msg);
      toast.error('Netzwerkfehler', { description: msg });
    }
  }

  function renderDynamicField(row: ContactFormFieldRow) {
    const t = (row.type || 'text').toLowerCase();
    const name = `extra__${row.key}`;
    const req = row.required === true;
    if (t === 'textarea') {
      return (
        <Field key={row.key} label={row.label}>
          <textarea required={req} name={name} rows={4} className={inputCls} minLength={req ? 1 : undefined} />
        </Field>
      );
    }
    const inputType = t === 'email' ? 'email' : t === 'tel' ? 'tel' : t === 'date' ? 'date' : 'text';
    return (
      <Field key={row.key} label={row.label}>
        <input required={req} type={inputType} name={name} className={inputCls} autoComplete="off" />
      </Field>
    );
  }

  function renderRow(row: ContactFormFieldRow) {
    const k = row.key as ContactFormField;
    if (!isStandardKey(row.key)) return renderDynamicField(row);

    if (k === 'name') {
      return (
        <Field key={k} label={row.label || 'Name'}>
          <input required name="name" autoComplete="name" className={inputCls} />
        </Field>
      );
    }
    if (k === 'email') {
      return (
        <Field key={k} label={row.label || 'E-Mail'}>
          <input required type="email" name="email" autoComplete="email" className={inputCls} />
        </Field>
      );
    }
    if (k === 'phone') {
      return (
        <Field key={k} label={row.label || 'Telefon (optional)'}>
          <input type="tel" name="phone" autoComplete="tel" className={inputCls} />
        </Field>
      );
    }
    if (k === 'subject') {
      return (
        <Field key={k} label={row.label || 'Betreff'}>
          <input name="subject" className={inputCls} />
        </Field>
      );
    }
    if (k === 'message') {
      return (
        <Field key={k} label={row.label || 'Ihre Nachricht'}>
          <textarea required name="message" rows={5} className={inputCls} minLength={5} />
        </Field>
      );
    }
    if (k === 'branche') {
      if (brancheOptions && brancheOptions.length > 0) {
        return (
          <Field key={k} label={row.label || 'Branche'}>
            <select name="branche" required={row.required} className={inputCls} defaultValue={brancheOptions[0]}>
              {brancheOptions.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </Field>
        );
      }
      return (
        <Field key={k} label={row.label || 'Branche'}>
          <input name="branche" className={inputCls} required={row.required} autoComplete="off" />
        </Field>
      );
    }
    if (k === 'paket') {
      if (paketOptions && paketOptions.length > 0) {
        return (
          <Field key={k} label={row.label || 'Paket-Interesse'}>
            <select name="paket" className={inputCls} defaultValue={defaultPaket || paketOptions[0]}>
              {paketOptions.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </Field>
        );
      }
      return (
        <Field key={k} label={row.label || 'Paket'}>
          <input name="paket" className={inputCls} required={row.required} autoComplete="off" />
        </Field>
      );
    }
    return null;
  }

  return (
    <form
      onSubmit={onSubmit}
      className={`bg-white border border-line rounded-3xl p-5 sm:p-8 md:p-10 space-y-5 ${className}`}
    >
      {/* Honeypot — keep visually hidden but not display:none, so bots fill it. */}
      <div aria-hidden style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}>
        <label>Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {normalizedRows
        ? normalizedRows.map((row) => renderRow(row))
        : (
          <>
            {hasLegacy('name') && (
              <Field label="Name">
                <input required name="name" autoComplete="name" className={inputCls} />
              </Field>
            )}
            {hasLegacy('email') && (
              <Field label="E-Mail">
                <input required type="email" name="email" autoComplete="email" className={inputCls} />
              </Field>
            )}
            {hasLegacy('phone') && (
              <Field label="Telefon (optional)">
                <input type="tel" name="phone" autoComplete="tel" className={inputCls} />
              </Field>
            )}
            {hasLegacy('subject') && (
              <Field label="Betreff">
                <input name="subject" className={inputCls} />
              </Field>
            )}
            {hasLegacy('branche') && brancheOptions && brancheOptions.length > 0 && (
              <Field label="Branche">
                <select name="branche" className={inputCls} defaultValue={brancheOptions[0]}>
                  {brancheOptions.map((o) => <option key={o}>{o}</option>)}
                </select>
              </Field>
            )}
            {hasLegacy('paket') && paketOptions && paketOptions.length > 0 && (
              <Field label="Paket-Interesse">
                <select name="paket" className={inputCls} defaultValue={defaultPaket || paketOptions[0]}>
                  {paketOptions.map((o) => <option key={o}>{o}</option>)}
                </select>
              </Field>
            )}
            {hasLegacy('message') && (
              <Field label="Ihre Nachricht">
                <textarea required name="message" rows={5} className={inputCls} minLength={5} />
              </Field>
            )}
          </>
        )}

      <button type="submit" disabled={state === 'sending'} className={`${buttonClass} disabled:opacity-60`}>
        {state === 'sending' ? 'Wird gesendet…' : <>Anfrage senden <span aria-hidden>→</span></>}
      </button>

      {state === 'error' && errorMsg && (
        <p role="alert" className="text-sm text-red-600 text-center">{errorMsg}</p>
      )}

      <p className="text-xs text-muted text-center">
        Mit dem Absenden stimmen Sie der Verarbeitung Ihrer Daten gemäß unserem Datenschutz zu.
      </p>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-widest text-muted mb-2">{label}</span>
      {children}
    </label>
  );
}
