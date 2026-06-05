'use client';

import { motion } from 'framer-motion';
import { Clock, ArrowRight } from 'lucide-react';
import { baseHeader, CtaButton, SectionHeader, asButton, asList } from './shared';
import type { SectionProps } from './types';

type Day = { label?: string; hours?: string; note?: string; closed?: boolean };

export function MedicalOpeningHoursSection({ data, styleVariant }: SectionProps) {
  const header = baseHeader(data, 'Sprechzeiten', 'Zeiten');
  const days = asList<Day>(data.days);
  const acuteCareText = (data.acuteCareText as string) || '';
  const holidayNote = (data.holidayNote as string) || '';
  const ctaPrimary = asButton(data.ctaPrimary);

  const props = { header, days, acuteCareText, holidayNote, ctaPrimary };
  if (styleVariant === 'modern') return <Modern {...props} />;
  if (styleVariant === 'bold') return <Bold {...props} />;
  return <Classic {...props} />;
}

type Props = { header: { headline: string; subline: string; badgeText: string }; days: Day[]; acuteCareText: string; holidayNote: string; ctaPrimary: { label?: string; href?: string } };

function Classic({ header, days, acuteCareText, holidayNote, ctaPrimary }: Props) {
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
      <div>
        <SectionHeader {...header} />
        {acuteCareText && <p className="text-sm leading-6 text-[var(--token-body)]">{acuteCareText}</p>}
        {holidayNote && <p className="mt-3 text-xs text-[var(--token-muted)]">{holidayNote}</p>}
        <div className="mt-6"><CtaButton cta={ctaPrimary} /></div>
      </div>
      <div className="rounded-xl bg-[var(--token-card-bg)] shadow-lg">
        {days.map((day, index) => (
          <div key={`$<span data-edit-path="label">{day.label}</span>-${index}`} className="flex items-center justify-between gap-4 border-b border-[var(--token-card-border)] px-5 py-4 last:border-b-0" data-edit-collection="days" data-edit-index={index}>
            <div className="flex items-center gap-3">
              <Clock size={17} className="text-[var(--token-icon)]" />
              <div><p className="font-semibold text-[var(--token-heading)]" data-edit-path="label">{day.label || ''}</p>{day.note && <p className="text-xs text-[var(--token-muted)]" data-edit-path="note">{day.note}</p>}</div>
            </div>
            <p className="text-sm font-medium text-[var(--token-heading)]">{day.closed ? (day.note || '') : day.hours}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function Modern({ header, days, acuteCareText, holidayNote, ctaPrimary }: Props) {
  return (
    <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
      <div>
        <SectionHeader {...header} />
        {acuteCareText && <p className="text-sm font-light leading-6 text-[var(--token-body)]">{acuteCareText}</p>}
        {holidayNote && <p className="mt-3 text-xs font-light text-[var(--token-muted)]">{holidayNote}</p>}
        {ctaPrimary.label && <div className="mt-6"><a href={ctaPrimary.href || '#'} className="inline-flex items-center gap-2 rounded-lg border border-[var(--token-btn-bg)] bg-[var(--token-btn-bg)] px-5 py-3 font-semibold text-[var(--token-btn-text)]"><span data-edit-path="label">{ctaPrimary.label}</span><ArrowRight size={16} /></a></div>}
      </div>
      <div className="border border-[var(--token-card-border)] bg-[var(--token-card-bg)]">
        {days.map((day, index) => (
          <div key={`$<span data-edit-path="label">{day.label}</span>-${index}`} className="flex items-center justify-between gap-4 border-b border-[var(--token-card-border)] px-5 py-4 last:border-b-0" data-edit-collection="days" data-edit-index={index}>
            <div className="flex items-center gap-3">
              <Clock size={17} className="text-[var(--token-icon)]" />
              <div><p className="font-light text-[var(--token-heading)]" data-edit-path="label">{day.label || ''}</p>{day.note && <p className="text-xs font-light text-[var(--token-muted)]" data-edit-path="note">{day.note}</p>}</div>
            </div>
            <p className="text-sm font-light text-[var(--token-heading)]">{day.closed ? (day.note || '') : day.hours}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Bold({ header, days, acuteCareText, holidayNote, ctaPrimary }: Props) {
  return (
    <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
      <div>
        <div className="mb-10 max-w-3xl">
          {header.badgeText && <p className="text-xs font-black uppercase tracking-widest text-[var(--token-badge-text)]" data-edit-path="badgeText">{header.badgeText}</p>}
          <h2 className="mt-3 text-3xl font-black uppercase text-[var(--token-heading)] sm:text-3xl md:text-5xl" data-edit-path="headline">{header.headline}</h2>
          {header.subline && <div className="mt-4 text-[var(--token-body)] rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: header.subline }} />}
        </div>
        {acuteCareText && <p className="text-sm leading-6 text-[var(--token-body)]">{acuteCareText}</p>}
        {holidayNote && <p className="mt-3 text-xs text-[var(--token-muted)]">{holidayNote}</p>}
        {ctaPrimary.label && <div className="mt-6"><a href={ctaPrimary.href || '#'} className="inline-flex items-center gap-2 border-2 border-[var(--token-btn-bg)] bg-[var(--token-btn-bg)] px-5 py-3 font-black uppercase text-[var(--token-btn-text)]"><span data-edit-path="label">{ctaPrimary.label}</span><ArrowRight size={16} /></a></div>}
      </div>
      <div className="border-2 border-[var(--token-card-border)] bg-[var(--token-card-bg)] shadow-[4px_4px_0_var(--token-card-border)]">
        {days.map((day, index) => (
          <div key={`$<span data-edit-path="label">{day.label}</span>-${index}`} className="flex items-center justify-between gap-4 border-b-2 border-[var(--token-card-border)] px-5 py-4 last:border-b-0" data-edit-collection="days" data-edit-index={index}>
            <div className="flex items-center gap-3">
              <Clock size={17} className="text-[var(--token-icon)]" />
              <div><p className="font-black uppercase text-[var(--token-heading)]" data-edit-path="label">{day.label || ''}</p>{day.note && <p className="text-xs text-[var(--token-muted)]" data-edit-path="note">{day.note}</p>}</div>
            </div>
            <p className="text-sm font-bold text-[var(--token-heading)]">{day.closed ? (day.note || '') : day.hours}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
