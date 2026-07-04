'use client';

import { motion } from 'framer-motion';
import { CalendarDays, Phone } from 'lucide-react';
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

