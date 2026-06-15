'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { CalendarDays, Phone, CheckCircle, AlertCircle } from 'lucide-react';
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

  if (styleVariant === 'bold') return <ReservationBold {...props} />;
  if (styleVariant === 'modern') return <ReservationModern {...props} />;
  return <ReservationClassic {...props} />;
}

function ReservationForm({ submitLabel, dark }: { submitLabel: string; dark?: boolean }) {
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
      <div className={`flex flex-col items-center gap-3 rounded-xl p-8 text-center ${dark ? 'text-[color:var(--token-on-dark-heading)]' : 'text-[color:var(--token-heading)]'}`}>
        <CheckCircle size={40} className="text-green-500" />
        <p className="text-lg font-semibold">Anfrage gesendet!</p>
        <p className={`text-sm ${dark ? 'text-[color:color-mix(in_srgb,var(--token-on-dark-heading)_70%,transparent)]' : 'text-[color:var(--token-muted)]'}`}>Wir melden uns zeitnah bei Ihnen.</p>
      </div>
    );
  }

  const inputClass = dark
    ? 'w-full rounded-lg border border-[color:color-mix(in_srgb,var(--token-card-border)_20%,transparent)] bg-[color-mix(in_srgb,var(--token-card-bg)_10%,transparent)] px-4 py-3 text-sm text-[color:var(--token-on-dark-heading)] placeholder:text-[color:color-mix(in_srgb,var(--token-on-dark-heading)_50%,transparent)] outline-none focus:border-[color:color-mix(in_srgb,var(--token-card-border)_40%,transparent)]'
    : 'w-full rounded-lg border border-[color:var(--token-card-border)] bg-[var(--token-card-bg)] px-4 py-3 text-sm text-[color:var(--token-heading)] placeholder:text-[color:var(--token-body)] outline-none focus:border-[var(--token-card-border)] focus:ring-2 focus:ring-brand-primary/10';

  return (
    <form onSubmit={handleSubmit} className="grid gap-3">
      <input name="name" type="text" required placeholder="Ihr Name *" className={inputClass} />
      <div className="grid grid-cols-2 gap-3">
        <input name="email" type="email" placeholder="E-Mail" className={inputClass} />
        <input name="phone" type="tel" placeholder="Telefon" className={inputClass} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <input name="date" type="date" required className={inputClass} />
        <input name="time" type="time" className={inputClass} />
      </div>
      <div>
        <label className={`text-xs font-medium ${dark ? 'text-[color:color-mix(in_srgb,var(--token-on-dark-heading)_60%,transparent)]' : 'text-[color:var(--token-muted)]'}`}>Personen</label>
        <input name="guests" type="number" min={1} max={20} defaultValue={2} className={inputClass} />
      </div>
      <textarea name="message" rows={2} placeholder="Anmerkungen (optional)" className={inputClass} />
      {status === 'error' && (
        <p className="flex items-center gap-2 text-sm text-red-500"><AlertCircle size={14} />{errorMsg}</p>
      )}
      <button type="submit" disabled={status === 'loading'} className={`mt-1 rounded-lg px-5 py-3 font-semibold shadow-md transition-all disabled:opacity-60 ${dark ? 'bg-[var(--token-card-bg)] text-[color:var(--token-heading)] hover:bg-[var(--token-section-bg-alt)]' : 'bg-[var(--token-btn-bg)] text-[color:var(--token-on-dark-heading)] hover:opacity-90'}`}>
        {status === 'loading' ? 'Wird gesendet...' : submitLabel}
      </button>
    </form>
  );
}

function ReservationClassic(props: ReservationViewProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid gap-8 lg:grid-cols-[1fr_0.8fr]">
      <div className="space-y-6">
        {props.badgeText && <p className="inline-block rounded-full bg-[color-mix(in_srgb,var(--token-badge-bg)_10%,transparent)] px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[color:var(--token-eyebrow)]" data-edit-path="badgeText">{props.badgeText}</p>}
        <h2 className="text-3xl sm:text-3xl md:text-5xl font-[700] text-[color:var(--token-heading)]" data-edit-path="headline">{props.headline}</h2>
        {props.subline && <div className="text-lg text-[color:var(--token-muted)] rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: props.subline }} />}
        {props.introText && <p className="leading-7 text-[color:var(--token-muted)]">{plain(props.introText)}</p>}
        <div className="flex flex-wrap gap-3">
          {props.externalBookingCta.label && <a href={props.externalBookingCta.href || '#'} className="inline-flex items-center gap-2 rounded-full bg-[var(--token-btn-bg)] px-6 py-3 font-semibold text-[color:var(--token-on-dark-heading)] shadow-md"><CalendarDays size={17} /><span data-edit-path="label">{props.externalBookingCta.label}</span></a>}
          {props.phoneCta.label && <a href={props.phoneCta.href || '#'} className="inline-flex items-center gap-2 rounded-full border border-black/10 px-6 py-3 font-semibold text-[color:var(--token-heading)]"><Phone size={17} /><span data-edit-path="label">{props.phoneCta.label}</span></a>}
        </div>
        {props.timeHint && <p className="text-sm text-[color:var(--token-muted)]">{props.timeHint}</p>}
        {props.policyText && <p className="text-xs text-[color:var(--token-muted)] opacity-70">{props.policyText}</p>}
      </div>
      <div className="overflow-hidden rounded-xl border border-black/10 bg-[var(--token-card-bg)] p-5 shadow-lg">
        {props.image && <div className="relative mb-5 aspect-[4/3] overflow-hidden rounded-xl"><Image data-edit-image="image" src={props.image} alt="" fill className="object-cover" sizes="50vw" /></div>}
        {props.formEnabled && <ReservationForm submitLabel={props.submitLabel} />}
      </div>
    </motion.div>
  );
}

function ReservationModern(props: ReservationViewProps) {
  return (
    <div className="grid gap-16 lg:grid-cols-[1fr_0.8fr]">
      <div className="space-y-6">
        {props.badgeText && <p className="text-xs font-light uppercase tracking-[0.2em] text-[color:var(--token-muted)]" data-edit-path="badgeText">{props.badgeText}</p>}
        <h2 className="text-3xl font-light text-[color:var(--token-heading)] sm:text-3xl md:text-5xl" data-edit-path="headline">{props.headline}</h2>
        <div className="h-px w-16 bg-[var(--token-badge-bg)]" />
        {props.subline && <div className="font-light leading-relaxed text-[color:var(--token-muted)] rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: props.subline }} />}
        {props.introText && <p className="font-light leading-7 text-[color:var(--token-muted)]">{plain(props.introText)}</p>}
        <div className="flex flex-wrap gap-4">
          {props.externalBookingCta.label && <a href={props.externalBookingCta.href || '#'} className="inline-flex items-center gap-2 border-b-2 border-[#111827] pb-1 font-medium text-[color:var(--token-heading)]"><CalendarDays size={17} /><span data-edit-path="label">{props.externalBookingCta.label}</span></a>}
          {props.phoneCta.label && <a href={props.phoneCta.href || '#'} className="inline-flex items-center gap-2 font-light text-[color:var(--token-muted)]"><Phone size={17} /><span data-edit-path="label">{props.phoneCta.label}</span></a>}
        </div>
        {props.timeHint && <p className="text-sm font-light text-[color:var(--token-muted)]">{props.timeHint}</p>}
        {props.policyText && <p className="text-xs font-light text-[color:var(--token-muted)]">{props.policyText}</p>}
      </div>
      <div className="border border-black/5 p-6">
        {props.image && <div className="relative mb-6 aspect-[4/3] overflow-hidden border border-black/5"><Image data-edit-image="image" src={props.image} alt="" fill className="object-cover" sizes="50vw" /></div>}
        {props.formEnabled && <ReservationForm submitLabel={props.submitLabel} />}
      </div>
    </div>
  );
}

function ReservationBold(props: ReservationViewProps) {
  return (
    <div className="bg-[#111827] p-6 text-[color:var(--token-on-dark-heading)] sm:p-10">
      <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr]">
        <div className="space-y-6">
          {props.badgeText && <p className="inline-block bg-[var(--token-badge-bg)] px-3 py-1 text-xs font-black uppercase tracking-widest text-[color:var(--token-heading)]" data-edit-path="badgeText">{props.badgeText}</p>}
          <h2 className="text-3xl font-black uppercase sm:text-3xl md:text-5xl" data-edit-path="headline">{props.headline}</h2>
          <div className="h-1.5 w-20 bg-[var(--token-badge-bg)]" />
          {props.subline && <div className="text-lg text-[color:color-mix(in_srgb,var(--token-on-dark-heading)_70%,transparent)] rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: props.subline }} />}
          {props.introText && <p className="leading-7 text-[color:color-mix(in_srgb,var(--token-on-dark-heading)_65%,transparent)]">{plain(props.introText)}</p>}
          <div className="flex flex-wrap gap-3">
            {props.externalBookingCta.label && <a href={props.externalBookingCta.href || '#'} className="inline-flex items-center gap-2 rounded-none border-2 border-[color:var(--token-card-border)] bg-[var(--token-card-bg)] px-6 py-3 font-black uppercase text-[color:var(--token-heading)] shadow-[4px_4px_0_rgba(255,255,255,0.3)]"><CalendarDays size={17} /><span data-edit-path="label">{props.externalBookingCta.label}</span></a>}
            {props.phoneCta.label && <a href={props.phoneCta.href || '#'} className="inline-flex items-center gap-2 rounded-none border-2 border-[color:color-mix(in_srgb,var(--token-card-border)_40%,transparent)] px-6 py-3 font-bold uppercase"><Phone size={17} /><span data-edit-path="label">{props.phoneCta.label}</span></a>}
          </div>
          {props.timeHint && <p className="text-sm text-[color:color-mix(in_srgb,var(--token-on-dark-heading)_50%,transparent)]">{props.timeHint}</p>}
          {props.policyText && <p className="text-xs text-[color:color-mix(in_srgb,var(--token-on-dark-heading)_40%,transparent)]">{props.policyText}</p>}
        </div>
        <div className="border-2 border-[color:color-mix(in_srgb,var(--token-card-border)_20%,transparent)] p-5 shadow-[4px_4px_0_rgba(255,255,255,0.15)]">
          {props.image && <div className="relative mb-5 aspect-[4/3] overflow-hidden border-2 border-[color:color-mix(in_srgb,var(--token-card-border)_20%,transparent)]"><Image data-edit-image="image" src={props.image} alt="" fill className="object-cover" sizes="50vw" /></div>}
          {props.formEnabled && <ReservationForm submitLabel={props.submitLabel} dark />}
        </div>
      </div>
    </div>
  );
}

