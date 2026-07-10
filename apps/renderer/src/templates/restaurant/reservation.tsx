'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { CalendarDays, Phone, CheckCircle, AlertCircle, ShieldCheck } from 'lucide-react';
import { asButton, asList, type SectionProps } from './types';
import { plain } from '@/lib/strip-html';

type ReservationViewProps = {
  headline: string;
  subline: string;
  badgeText: string;
  introText: string;
  formEnabled: boolean;
  submitLabel: string;
  phoneCta: { label?: string; href?: string };
  externalBookingCta: { label?: string; href?: string };
  partySizeOptions: string[];
  timeHint: string;
  policyText: string;
  image: string;
};

export function ReservationSection({ data, styleVariant }: SectionProps) {
  const headline = (data.headline as string) || 'Tisch reservieren';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || 'Reservierung';
  const introText = (data.introText as string) || '';
  const formEnabled = (data.formEnabled as boolean) ?? true;
  const submitLabel = (data.submitLabel as string) || 'Anfrage senden';
  const phoneCta = asButton(data.phoneCta);
  const externalBookingCta = asButton(data.externalBookingCta);
  const partySizeOptions = asList<string>(data.partySizeOptions);
  const timeHint = (data.timeHint as string) || '';
  const policyText = (data.policyText as string) || '';
  const image = (data.image as string) || '';

  const props: ReservationViewProps = { headline, subline, badgeText, introText, formEnabled, submitLabel, phoneCta, externalBookingCta, partySizeOptions, timeHint, policyText, image };

  return <ReservationClassic {...props} />;
}

function ReservationForm({ submitLabel, partySizeOptions, dark }: { submitLabel: string; partySizeOptions: string[]; dark?: boolean }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');
    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      date: formData.get('date'),
      time: formData.get('time'),
      guests: Number(formData.get('guests')) || 2,
      message: formData.get('message'),
    };
    try {
      const res = await fetch('/api/reservation', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Fehler beim Senden.');
      }
      setStatus('success');
      form.reset();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Unbekannter Fehler');
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div aria-live="polite" className={`flex min-h-80 flex-col items-center justify-center gap-3 rounded-[var(--token-card-radius)] border border-[var(--token-card-border)] bg-[var(--token-success-bg)] p-8 text-center ${dark ? 'text-[color:var(--token-on-dark-heading)]' : 'text-[color:var(--token-heading)]'}`}>
        <CheckCircle size={40} className="text-[var(--token-check)]" />
        <p className="text-lg font-semibold">Anfrage gesendet!</p>
        <p className={`text-sm ${dark ? 'text-[color:color-mix(in_srgb,var(--token-on-dark-heading)_70%,transparent)]' : 'text-[color:var(--token-muted)]'}`}>Wir melden uns zeitnah bei Ihnen.</p>
      </div>
    );
  }

  const inputClass = dark
    ? 'w-full rounded-lg border border-[color:color-mix(in_srgb,var(--token-card-border)_20%,transparent)] bg-[color-mix(in_srgb,var(--token-card-bg)_10%,transparent)] px-4 py-3 text-sm text-[color:var(--token-on-dark-heading)] placeholder:text-[color:color-mix(in_srgb,var(--token-on-dark-heading)_50%,transparent)] outline-none focus:border-[color:color-mix(in_srgb,var(--token-card-border)_40%,transparent)]'
    : 'w-full rounded-[var(--token-button-radius)] border border-[color:var(--token-input-border)] bg-[var(--token-input-bg)] px-4 py-3 text-sm text-[color:var(--token-input-text)] placeholder:text-[color:var(--token-label)] outline-none focus:border-[var(--token-accent)] focus:ring-2 focus:ring-[color:color-mix(in_srgb,var(--token-accent)_16%,transparent)]';

  const labelClass = `mb-1.5 block text-sm font-semibold ${dark ? 'text-[color:var(--token-on-dark-muted)]' : 'text-[color:var(--token-label)]'}`;
  const guestOptions = partySizeOptions
    .map((option) => ({ label: option, value: Number.parseInt(option, 10) }))
    .filter((option) => Number.isFinite(option.value) && option.value > 0);

  return (
    <form onSubmit={handleSubmit} className="grid gap-4" aria-busy={status === 'loading'}>
      <label>
        <span className={labelClass}>Name *</span>
        <input name="name" type="text" autoComplete="name" required placeholder="Ihr Name" className={inputClass} />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label>
          <span className={labelClass}>E-Mail</span>
          <input name="email" type="email" autoComplete="email" inputMode="email" placeholder="name@beispiel.de" className={inputClass} />
        </label>
        <label>
          <span className={labelClass}>Telefon</span>
          <input name="phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="+49 …" className={inputClass} />
        </label>
      </div>
      <fieldset className="rounded-[var(--token-card-radius)] border border-[var(--token-card-border)] bg-[var(--token-section-bg-alt)] p-4">
        <legend className="px-2 text-sm font-bold text-[color:var(--token-card-heading)]">Terminwunsch</legend>
        <div className="grid gap-4 sm:grid-cols-3">
          <label>
            <span className={labelClass}>Datum *</span>
            <input name="date" type="date" required className={inputClass} />
          </label>
          <label>
            <span className={labelClass}>Uhrzeit</span>
            <input name="time" type="time" className={inputClass} />
          </label>
          <label>
            <span className={labelClass}>Personen</span>
            {guestOptions.length > 0 ? (
              <select name="guests" defaultValue={guestOptions[0]?.value ?? 2} className={inputClass}>
                {guestOptions.map((option) => <option key={`${option.label}-${option.value}`} value={option.value}>{option.label}</option>)}
              </select>
            ) : (
              <input name="guests" type="number" min={1} max={20} defaultValue={2} className={inputClass} />
            )}
          </label>
        </div>
      </fieldset>
      <label>
        <span className={labelClass}>Anmerkungen</span>
        <textarea name="message" rows={3} placeholder="Allergien, Anlass oder besondere Wünsche (optional)" className={`${inputClass} resize-y`} />
      </label>
      {status === 'error' && (
        <p role="alert" className="flex items-start gap-2 rounded-[var(--token-button-radius)] bg-[var(--token-danger-bg)] p-3 text-sm text-[var(--token-danger)]"><AlertCircle aria-hidden="true" size={16} className="mt-0.5 shrink-0" />{errorMsg}</p>
      )}
      <button type="submit" disabled={status === 'loading'} className={`cms-button mt-1 w-full disabled:opacity-60 ${dark ? 'cms-button--secondary border-[var(--token-btn-secondary-border)] bg-[var(--token-btn-secondary-bg)] text-[color:var(--token-btn-secondary-text)]' : 'cms-button--primary bg-[var(--token-btn-bg)] text-[color:var(--token-btn-text)]'}`}>
        {status === 'loading' ? 'Wird gesendet...' : submitLabel}
      </button>
      <div className="flex items-start gap-2 text-xs leading-5 text-[color:var(--token-card-muted)]">
        <ShieldCheck aria-hidden="true" size={16} className="mt-0.5 shrink-0 text-[color:var(--token-icon)]" />
        <p>Unverbindliche Anfrage. Die Reservierung wird erst nach Bestätigung wirksam. Informationen zur Verarbeitung Ihrer Angaben finden Sie in den Datenschutzhinweisen dieser Website.</p>
      </div>
    </form>
  );
}

function ReservationClassic(props: ReservationViewProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.55, ease: [0.2, 0.75, 0.25, 1] }} className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.82fr)] lg:gap-16">
      <div className="space-y-6 lg:sticky lg:top-24">
        {props.badgeText && <p className="cms-eyebrow text-[color:var(--token-badge-text)]" data-edit-path="badgeText"><span aria-hidden="true" className="cms-eyebrow-mark" />{props.badgeText}</p>}
        <h2 className="max-w-[16ch] text-[clamp(2rem,5vw,3.75rem)] font-[var(--token-heading-weight)] leading-[1.04] tracking-[var(--token-heading-tracking)] text-[color:var(--token-heading)]" data-edit-path="headline">{props.headline}</h2>
        {props.subline && <div className="max-w-[60ch] text-lg leading-8 text-[color:var(--token-body)] rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: props.subline }} />}
        {props.introText && <p className="max-w-[65ch] leading-7 text-[color:var(--token-muted)]">{plain(props.introText)}</p>}
        <div className="flex flex-wrap gap-3">
          {props.externalBookingCta.label && <a href={props.externalBookingCta.href || '#'} className="cms-button cms-button--primary bg-[var(--token-btn-bg)] text-[color:var(--token-btn-text)]"><CalendarDays aria-hidden="true" size={17} /><span data-edit-path="label">{props.externalBookingCta.label}</span></a>}
          {props.phoneCta.label && <a href={props.phoneCta.href || '#'} className="cms-button cms-button--secondary border-[var(--token-btn-secondary-border)] bg-[var(--token-btn-secondary-bg)] text-[color:var(--token-btn-secondary-text)]"><Phone aria-hidden="true" size={17} /><span data-edit-path="label">{props.phoneCta.label}</span></a>}
        </div>
        {props.timeHint && <p className="border-l-2 border-[var(--token-accent)] pl-4 text-sm leading-6 text-[color:var(--token-body)]">{props.timeHint}</p>}
        {props.policyText && <p className="max-w-xl text-xs leading-5 text-[color:var(--token-muted)]">{props.policyText}</p>}
      </div>
      <div className="cms-card overflow-hidden border-[var(--token-card-border)] bg-[var(--token-card-bg)] p-4 sm:p-6" data-card="">
        {props.image && <div className="cms-media-frame relative mb-6 aspect-[16/10] overflow-hidden rounded-[var(--token-button-radius)]"><Image data-edit-image="image" src={props.image} alt={props.headline} fill className="object-cover" sizes="(min-width: 1024px) 42vw, 100vw" /></div>}
        {props.formEnabled && <ReservationForm submitLabel={props.submitLabel} partySizeOptions={props.partySizeOptions} />}
      </div>
    </motion.div>
  );
}

