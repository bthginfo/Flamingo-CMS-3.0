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
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="rounded-xl bg-[var(--style-card-bg,#fff)] p-6 shadow-lg sm:p-10">
      <SectionHeader {...header} />
      {introText && <div className="max-w-2xl text-[var(--style-body-color,var(--style-text-secondary,#4b5563))] rt-content" dangerouslySetInnerHTML={{ __html: introText }} />}
      <div className="mt-8 flex flex-wrap gap-3">
        {onlineCta.label && <a href={onlineCta.href || '#'} className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-btn-bg,var(--style-accent-color,var(--brand-primary)))] px-5 py-3 font-semibold text-[var(--brand-btn-text,#fff)]"><CalendarDays size={17} />{onlineCta.label}</a>}
        {phoneCta.label && <a href={phoneCta.href || '#'} className="inline-flex items-center gap-2 rounded-full border border-[var(--style-border-color,color-mix(in_srgb,var(--style-accent-color,var(--brand-primary))_30%,transparent))] px-5 py-3 font-semibold text-[var(--style-heading-color,var(--style-text-primary,#111827))]"><Phone size={17} />{phoneCta.label}</a>}
        {callbackCta.label && <a href={callbackCta.href || '#'} className="inline-flex rounded-full border border-[var(--style-border-color,rgba(0,0,0,.1))] px-5 py-3 font-semibold text-[var(--style-heading-color,var(--style-text-primary,#111827))]">{callbackCta.label}</a>}
        {externalCta.label && <a href={externalCta.href || '#'} className="inline-flex rounded-full border border-[var(--style-border-color,rgba(0,0,0,.1))] px-5 py-3 font-semibold text-[var(--style-heading-color,var(--style-text-primary,#111827))]">{externalCta.label}</a>}
      </div>
      <div className="mt-6 flex flex-wrap gap-2">{notes.map((note) => <span key={note} className="rounded-full bg-[var(--style-badge-bg,color-mix(in_srgb,var(--style-accent-color,var(--brand-primary))_10%,#fff))] px-3 py-1 text-xs text-[var(--style-badge-text,var(--style-accent-color,var(--brand-primary)))]">{note}</span>)}</div>
    </motion.div>
  );
}

function Modern({ header, introText, onlineCta, phoneCta, callbackCta, externalCta, notes }: Props) {
  return (
    <div className="border border-[var(--style-border-color,rgba(0,0,0,.1))] bg-[var(--style-card-bg,#fff)] p-6 sm:p-10">
      <SectionHeader {...header} />
      {introText && <div className="max-w-2xl font-light text-[var(--style-body-color,var(--style-text-secondary,#4b5563))] rt-content" dangerouslySetInnerHTML={{ __html: introText }} />}
      <div className="mt-8 flex flex-wrap gap-3">
        {onlineCta.label && <a href={onlineCta.href || '#'} className="inline-flex items-center gap-2 rounded-lg border border-[var(--brand-btn-bg,var(--style-accent-color,var(--brand-primary)))] bg-[var(--brand-btn-bg,var(--style-accent-color,var(--brand-primary)))] px-5 py-3 font-semibold text-[var(--brand-btn-text,#fff)]"><CalendarDays size={17} />{onlineCta.label}</a>}
        {phoneCta.label && <a href={phoneCta.href || '#'} className="inline-flex items-center gap-2 rounded-lg border border-[var(--style-border-color,rgba(0,0,0,.15))] px-5 py-3 font-light text-[var(--style-heading-color,var(--style-text-primary,#111827))]"><Phone size={17} />{phoneCta.label}</a>}
        {callbackCta.label && <a href={callbackCta.href || '#'} className="inline-flex rounded-lg border border-[var(--style-border-color,rgba(0,0,0,.15))] px-5 py-3 font-light text-[var(--style-heading-color,var(--style-text-primary,#111827))]">{callbackCta.label}</a>}
        {externalCta.label && <a href={externalCta.href || '#'} className="inline-flex rounded-lg border border-[var(--style-border-color,rgba(0,0,0,.15))] px-5 py-3 font-light text-[var(--style-heading-color,var(--style-text-primary,#111827))]">{externalCta.label}</a>}
      </div>
      <div className="mt-6 flex flex-wrap gap-2">{notes.map((note) => <span key={note} className="border border-[var(--style-border-color,rgba(0,0,0,.1))] px-3 py-1 text-xs text-[var(--style-text-muted,var(--style-text-secondary,#4b5563))]">{note}</span>)}</div>
    </div>
  );
}

function Bold({ header, introText, onlineCta, phoneCta, callbackCta, externalCta, notes }: Props) {
  return (
    <div className="border-2 border-[var(--style-border-color,var(--style-text-primary,#111827))] bg-[var(--style-section-bg,#030712)] p-6 shadow-[4px_4px_0_var(--style-border-color,var(--style-text-primary,#111827))] sm:p-10">
      <div className="mb-10 max-w-3xl">
        {header.badgeText && <p className="text-xs font-black uppercase tracking-widest text-[var(--style-badge-text,var(--style-accent-color,var(--brand-primary)))]">{header.badgeText}</p>}
        <h2 className="mt-3 text-3xl font-black uppercase text-[var(--style-heading-color,#fff)] sm:text-3xl md:text-5xl">{header.headline}</h2>
        {header.subline && <div className="mt-4 text-[var(--style-body-color,rgba(255,255,255,.7))] rt-content" dangerouslySetInnerHTML={{ __html: header.subline }} />}
      </div>
      {introText && <div className="max-w-2xl text-[var(--style-body-color,rgba(255,255,255,.7))] rt-content" dangerouslySetInnerHTML={{ __html: introText }} />}
      <div className="mt-8 flex flex-wrap gap-3">
        {onlineCta.label && <a href={onlineCta.href || '#'} className="inline-flex items-center gap-2 border-2 border-[var(--brand-btn-bg,var(--style-accent-color,var(--brand-primary)))] bg-[var(--brand-btn-bg,var(--style-accent-color,var(--brand-primary)))] px-5 py-3 font-black uppercase text-[var(--brand-btn-text,#fff)]"><CalendarDays size={17} />{onlineCta.label}</a>}
        {phoneCta.label && <a href={phoneCta.href || '#'} className="inline-flex items-center gap-2 border-2 border-[var(--style-border-color,rgba(255,255,255,.4))] px-5 py-3 font-black uppercase text-[var(--style-heading-color,#fff)]"><Phone size={17} />{phoneCta.label}</a>}
        {callbackCta.label && <a href={callbackCta.href || '#'} className="inline-flex border-2 border-[var(--style-border-color,rgba(255,255,255,.4))] px-5 py-3 font-black uppercase text-[var(--style-heading-color,#fff)]">{callbackCta.label}</a>}
        {externalCta.label && <a href={externalCta.href || '#'} className="inline-flex border-2 border-[var(--style-border-color,rgba(255,255,255,.4))] px-5 py-3 font-black uppercase text-[var(--style-heading-color,#fff)]">{externalCta.label}</a>}
      </div>
      <div className="mt-6 flex flex-wrap gap-2">{notes.map((note) => <span key={note} className="border border-[var(--style-border-color,rgba(255,255,255,.2))] px-3 py-1 text-xs font-bold uppercase text-[var(--style-body-color,rgba(255,255,255,.7))]">{note}</span>)}</div>
    </div>
  );
}
