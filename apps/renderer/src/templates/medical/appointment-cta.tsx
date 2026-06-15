'use client';

import { motion } from 'framer-motion';
import { CalendarDays, Phone, ArrowRight } from 'lucide-react';
import { baseHeader, SectionHeader, asButton, asList } from './shared';
import type { SectionProps } from './types';

export function AppointmentCtaSection({ data, styleVariant }: SectionProps) {
  const header = baseHeader(data, 'Termin vereinbaren', 'Termine');
  const introText = (data.introText as string) || '';
  const onlineCta = asButton(data.onlineCta);
  const phoneCta = asButton(data.phoneCta);
  const callbackCta = asButton(data.callbackCta);
  const externalCta = asButton(data.externalCta);
  const notes = asList<string>(data.notes);

  const props = { header, introText, onlineCta, phoneCta, callbackCta, externalCta, notes };
  if (styleVariant === 'modern') return <Modern {...props} />;
  if (styleVariant === 'bold') return <Bold {...props} />;
  return <Classic {...props} />;
}

type Props = { header: { headline: string; subline: string; badgeText: string }; introText: string; onlineCta: { label?: string; href?: string }; phoneCta: { label?: string; href?: string }; callbackCta: { label?: string; href?: string }; externalCta: { label?: string; href?: string }; notes: string[] };

function Classic({ header, introText, onlineCta, phoneCta, callbackCta, externalCta, notes }: Props) {
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="rounded-xl bg-[var(--token-card-bg)] p-6 shadow-lg sm:p-10">
      <SectionHeader {...header} />
      {introText && <div className="max-w-2xl text-[color:var(--token-body)] rt-content" data-edit-rich="introText" dangerouslySetInnerHTML={{ __html: introText }} />}
      <div className="mt-8 flex flex-wrap gap-3">
        {onlineCta.label && <a data-edit-link="onlineCta" href={onlineCta.href || '#'} className="inline-flex items-center gap-2 rounded-full bg-[var(--token-btn-bg)] px-5 py-3 font-semibold text-[color:var(--token-btn-text)]"><CalendarDays size={17} /><span data-edit-path="label">{onlineCta.label}</span></a>}
        {phoneCta.label && <a data-edit-link="phoneCta" href={phoneCta.href || '#'} className="inline-flex items-center gap-2 rounded-full border border-[var(--token-card-border)] px-5 py-3 font-semibold text-[color:var(--token-heading)]"><Phone size={17} /><span data-edit-path="label">{phoneCta.label}</span></a>}
        {callbackCta.label && <a data-edit-link="callbackCta" href={callbackCta.href || '#'} className="inline-flex rounded-full border border-[var(--token-card-border)] px-5 py-3 font-semibold text-[color:var(--token-heading)]" data-edit-path="label">{callbackCta.label}</a>}
        {externalCta.label && <a data-edit-link="externalCta" href={externalCta.href || '#'} className="inline-flex rounded-full border border-[var(--token-card-border)] px-5 py-3 font-semibold text-[color:var(--token-heading)]" data-edit-path="label">{externalCta.label}</a>}
      </div>
      <div className="mt-6 flex flex-wrap gap-2">{notes.map((note) => <span key={note} className="rounded-full bg-[var(--token-badge-bg)] px-3 py-1 text-xs text-[color:var(--token-badge-text)]" data-edit-path="note">{note}</span>)}</div>
    </motion.div>
  );
}

function Modern({ header, introText, onlineCta, phoneCta, callbackCta, externalCta, notes }: Props) {
  return (
    <div className="border border-[var(--token-card-border)] bg-[var(--token-card-bg)] p-6 sm:p-10">
      <SectionHeader {...header} />
      {introText && <div className="max-w-2xl font-light text-[color:var(--token-body)] rt-content" data-edit-rich="introText" dangerouslySetInnerHTML={{ __html: introText }} />}
      <div className="mt-8 flex flex-wrap gap-3">
        {onlineCta.label && <a data-edit-link="onlineCta" href={onlineCta.href || '#'} className="inline-flex items-center gap-2 rounded-lg border border-[var(--token-btn-bg)] bg-[var(--token-btn-bg)] px-5 py-3 font-semibold text-[color:var(--token-btn-text)]"><CalendarDays size={17} /><span data-edit-path="label">{onlineCta.label}</span></a>}
        {phoneCta.label && <a data-edit-link="phoneCta" href={phoneCta.href || '#'} className="inline-flex items-center gap-2 rounded-lg border border-[var(--token-card-border)] px-5 py-3 font-light text-[color:var(--token-heading)]"><Phone size={17} /><span data-edit-path="label">{phoneCta.label}</span></a>}
        {callbackCta.label && <a data-edit-link="callbackCta" href={callbackCta.href || '#'} className="inline-flex rounded-lg border border-[var(--token-card-border)] px-5 py-3 font-light text-[color:var(--token-heading)]" data-edit-path="label">{callbackCta.label}</a>}
        {externalCta.label && <a data-edit-link="externalCta" href={externalCta.href || '#'} className="inline-flex rounded-lg border border-[var(--token-card-border)] px-5 py-3 font-light text-[color:var(--token-heading)]" data-edit-path="label">{externalCta.label}</a>}
      </div>
      <div className="mt-6 flex flex-wrap gap-2">{notes.map((note) => <span key={note} className="border border-[var(--token-card-border)] px-3 py-1 text-xs text-[color:var(--token-muted)]" data-edit-path="note">{note}</span>)}</div>
    </div>
  );
}

function Bold({ header, introText, onlineCta, phoneCta, callbackCta, externalCta, notes }: Props) {
  return (
    <div className="border-2 border-[var(--token-card-border)] bg-[var(--token-section-bg)] p-6 shadow-[4px_4px_0_var(--token-card-border)] sm:p-10">
      <div className="mb-10 max-w-3xl">
        {header.badgeText && <p className="text-xs font-black uppercase tracking-widest text-[color:var(--token-badge-text)]" data-edit-path="badgeText">{header.badgeText}</p>}
        <h2 className="mt-3 text-3xl font-black uppercase text-[color:var(--token-heading)] sm:text-3xl md:text-5xl" data-edit-path="headline">{header.headline}</h2>
        {header.subline && <div className="mt-4 text-[color:var(--token-body)] rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: header.subline }} />}
      </div>
      {introText && <div className="max-w-2xl text-[color:var(--token-body)] rt-content" data-edit-rich="introText" dangerouslySetInnerHTML={{ __html: introText }} />}
      <div className="mt-8 flex flex-wrap gap-3">
        {onlineCta.label && <a data-edit-link="onlineCta" href={onlineCta.href || '#'} className="inline-flex items-center gap-2 border-2 border-[var(--token-btn-bg)] bg-[var(--token-btn-bg)] px-5 py-3 font-black uppercase text-[color:var(--token-btn-text)]"><CalendarDays size={17} /><span data-edit-path="label">{onlineCta.label}</span></a>}
        {phoneCta.label && <a data-edit-link="phoneCta" href={phoneCta.href || '#'} className="inline-flex items-center gap-2 border-2 border-[var(--token-card-border)] px-5 py-3 font-black uppercase text-[color:var(--token-heading)]"><Phone size={17} /><span data-edit-path="label">{phoneCta.label}</span></a>}
        {callbackCta.label && <a data-edit-link="callbackCta" href={callbackCta.href || '#'} className="inline-flex border-2 border-[var(--token-card-border)] px-5 py-3 font-black uppercase text-[color:var(--token-heading)]" data-edit-path="label">{callbackCta.label}</a>}
        {externalCta.label && <a data-edit-link="externalCta" href={externalCta.href || '#'} className="inline-flex border-2 border-[var(--token-card-border)] px-5 py-3 font-black uppercase text-[color:var(--token-heading)]" data-edit-path="label">{externalCta.label}</a>}
      </div>
      <div className="mt-6 flex flex-wrap gap-2">{notes.map((note) => <span key={note} className="border border-[var(--token-card-border)] px-3 py-1 text-xs font-bold uppercase text-[color:var(--token-body)]" data-edit-path="note">{note}</span>)}</div>
    </div>
  );
}
