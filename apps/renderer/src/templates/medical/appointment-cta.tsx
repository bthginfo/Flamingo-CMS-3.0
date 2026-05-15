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
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="rounded-xl bg-[var(--style-card-bg)] p-6 shadow-lg sm:p-10">
      <SectionHeader {...header} />
      {introText && <p className="max-w-2xl text-[var(--style-text-secondary)]">{introText}</p>}
      <div className="mt-8 flex flex-wrap gap-3">
        {onlineCta.label && <a href={onlineCta.href || '#'} className="inline-flex items-center gap-2 rounded-full bg-teal-700 px-5 py-3 font-semibold text-white"><CalendarDays size={17} />{onlineCta.label}</a>}
        {phoneCta.label && <a href={phoneCta.href || '#'} className="inline-flex items-center gap-2 rounded-full border border-teal-700/30 px-5 py-3 font-semibold text-[var(--style-text-primary)]"><Phone size={17} />{phoneCta.label}</a>}
        {callbackCta.label && <a href={callbackCta.href || '#'} className="inline-flex rounded-full border border-black/10 px-5 py-3 font-semibold text-[var(--style-text-primary)]">{callbackCta.label}</a>}
        {externalCta.label && <a href={externalCta.href || '#'} className="inline-flex rounded-full border border-black/10 px-5 py-3 font-semibold text-[var(--style-text-primary)]">{externalCta.label}</a>}
      </div>
      <div className="mt-6 flex flex-wrap gap-2">{notes.map((note) => <span key={note} className="rounded-full bg-teal-50 px-3 py-1 text-xs text-teal-800">{note}</span>)}</div>
    </motion.div>
  );
}

function Modern({ header, introText, onlineCta, phoneCta, callbackCta, externalCta, notes }: Props) {
  return (
    <div className="border border-black/10 bg-[var(--style-card-bg)] p-6 sm:p-10">
      <SectionHeader {...header} />
      {introText && <p className="max-w-2xl font-light text-[var(--style-text-secondary)]">{introText}</p>}
      <div className="mt-8 flex flex-wrap gap-3">
        {onlineCta.label && <a href={onlineCta.href || '#'} className="inline-flex items-center gap-2 rounded-[var(--style-button-radius)] border border-blue-600 bg-blue-600 px-5 py-3 font-semibold text-white"><CalendarDays size={17} />{onlineCta.label}</a>}
        {phoneCta.label && <a href={phoneCta.href || '#'} className="inline-flex items-center gap-2 rounded-[var(--style-button-radius)] border border-black/15 px-5 py-3 font-light text-[var(--style-text-primary)]"><Phone size={17} />{phoneCta.label}</a>}
        {callbackCta.label && <a href={callbackCta.href || '#'} className="inline-flex rounded-[var(--style-button-radius)] border border-black/15 px-5 py-3 font-light text-[var(--style-text-primary)]">{callbackCta.label}</a>}
        {externalCta.label && <a href={externalCta.href || '#'} className="inline-flex rounded-[var(--style-button-radius)] border border-black/15 px-5 py-3 font-light text-[var(--style-text-primary)]">{externalCta.label}</a>}
      </div>
      <div className="mt-6 flex flex-wrap gap-2">{notes.map((note) => <span key={note} className="border border-black/10 px-3 py-1 text-xs text-[var(--style-text-secondary)]">{note}</span>)}</div>
    </div>
  );
}

function Bold({ header, introText, onlineCta, phoneCta, callbackCta, externalCta, notes }: Props) {
  return (
    <div className="border-2 border-[var(--style-text-primary)] bg-gray-950 p-6 shadow-[4px_4px_0_var(--style-text-primary)] sm:p-10">
      <div className="mb-10 max-w-3xl">
        {header.badgeText && <p className="text-xs font-black uppercase tracking-widest text-teal-400">{header.badgeText}</p>}
        <h2 className="mt-3 text-3xl font-black uppercase text-white sm:text-5xl">{header.headline}</h2>
        {header.subline && <p className="mt-4 text-white/70">{header.subline}</p>}
      </div>
      {introText && <p className="max-w-2xl text-white/70">{introText}</p>}
      <div className="mt-8 flex flex-wrap gap-3">
        {onlineCta.label && <a href={onlineCta.href || '#'} className="inline-flex items-center gap-2 border-2 border-teal-400 bg-teal-400 px-5 py-3 font-black uppercase text-gray-950 shadow-[4px_4px_0_theme(colors.teal.700)]"><CalendarDays size={17} />{onlineCta.label}</a>}
        {phoneCta.label && <a href={phoneCta.href || '#'} className="inline-flex items-center gap-2 border-2 border-white/40 px-5 py-3 font-black uppercase text-white shadow-[4px_4px_0_rgba(255,255,255,0.15)]"><Phone size={17} />{phoneCta.label}</a>}
        {callbackCta.label && <a href={callbackCta.href || '#'} className="inline-flex border-2 border-white/40 px-5 py-3 font-black uppercase text-white">{callbackCta.label}</a>}
        {externalCta.label && <a href={externalCta.href || '#'} className="inline-flex border-2 border-white/40 px-5 py-3 font-black uppercase text-white">{externalCta.label}</a>}
      </div>
      <div className="mt-6 flex flex-wrap gap-2">{notes.map((note) => <span key={note} className="border border-white/20 px-3 py-1 text-xs font-bold uppercase text-white/70">{note}</span>)}</div>
    </div>
  );
}
