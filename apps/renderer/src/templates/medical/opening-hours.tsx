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
        {acuteCareText && <p className="text-sm leading-6 text-[var(--token-body, var(--style-body-color,var(--style-text-secondary,#4b5563)))]">{acuteCareText}</p>}
        {holidayNote && <p className="mt-3 text-xs text-[var(--token-muted, var(--style-text-muted,var(--style-text-secondary,#4b5563)))]">{holidayNote}</p>}
        <div className="mt-6"><CtaButton cta={ctaPrimary} /></div>
      </div>
      <div className="rounded-xl bg-[var(--token-card-bg, var(--style-card-bg,#fff))] shadow-lg">
        {days.map((day, index) => (
          <div key={`${day.label}-${index}`} className="flex items-center justify-between gap-4 border-b border-[var(--token-card-border, var(--style-border-color,rgba(0,0,0,.1)))] px-5 py-4 last:border-b-0">
            <div className="flex items-center gap-3">
              <Clock size={17} className="text-[var(--token-icon, var(--style-icon-color,var(--style-accent-color,var(--token-icon, var(--brand-primary)))))]" />
              <div><p className="font-semibold text-[var(--token-heading, var(--style-heading-color,var(--style-text-primary,#111827)))]">{day.label || ''}</p>{day.note && <p className="text-xs text-[var(--token-muted, var(--style-text-muted,var(--style-text-secondary,#4b5563)))]">{day.note}</p>}</div>
            </div>
            <p className="text-sm font-medium text-[var(--token-heading, var(--style-heading-color,var(--style-text-primary,#111827)))]">{day.closed ? (day.note || '') : day.hours}</p>
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
        {acuteCareText && <p className="text-sm font-light leading-6 text-[var(--token-body, var(--style-body-color,var(--style-text-secondary,#4b5563)))]">{acuteCareText}</p>}
        {holidayNote && <p className="mt-3 text-xs font-light text-[var(--token-muted, var(--style-text-muted,var(--style-text-secondary,#4b5563)))]">{holidayNote}</p>}
        {ctaPrimary.label && <div className="mt-6"><a href={ctaPrimary.href || '#'} className="inline-flex items-center gap-2 rounded-lg border border-[var(--token-btn-bg, var(--brand-btn-bg,var(--style-accent-color,var(--token-icon, var(--brand-primary)))))] bg-[var(--token-btn-bg, var(--brand-btn-bg,var(--style-accent-color,var(--token-icon, var(--brand-primary)))))] px-5 py-3 font-semibold text-[var(--token-btn-text, var(--brand-btn-text,#fff))]">{ctaPrimary.label}<ArrowRight size={16} /></a></div>}
      </div>
      <div className="border border-[var(--token-card-border, var(--style-border-color,rgba(0,0,0,.1)))] bg-[var(--token-card-bg, var(--style-card-bg,#fff))]">
        {days.map((day, index) => (
          <div key={`${day.label}-${index}`} className="flex items-center justify-between gap-4 border-b border-[var(--token-card-border, var(--style-border-color,rgba(0,0,0,.1)))] px-5 py-4 last:border-b-0">
            <div className="flex items-center gap-3">
              <Clock size={17} className="text-[var(--token-icon, var(--style-icon-color,var(--style-accent-color,var(--token-icon, var(--brand-primary)))))]" />
              <div><p className="font-light text-[var(--token-heading, var(--style-heading-color,var(--style-text-primary,#111827)))]">{day.label || ''}</p>{day.note && <p className="text-xs font-light text-[var(--token-muted, var(--style-text-muted,var(--style-text-secondary,#4b5563)))]">{day.note}</p>}</div>
            </div>
            <p className="text-sm font-light text-[var(--token-heading, var(--style-heading-color,var(--style-text-primary,#111827)))]">{day.closed ? (day.note || '') : day.hours}</p>
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
          {header.badgeText && <p className="text-xs font-black uppercase tracking-widest text-[var(--token-badge-text, var(--style-badge-text,var(--style-accent-color,var(--token-icon, var(--brand-primary)))))]">{header.badgeText}</p>}
          <h2 className="mt-3 text-3xl font-black uppercase text-[var(--token-heading, var(--style-heading-color,var(--style-text-primary,#111827)))] sm:text-3xl md:text-5xl">{header.headline}</h2>
          {header.subline && <div className="mt-4 text-[var(--token-body, var(--style-body-color,var(--style-text-secondary,#4b5563)))] rt-content" dangerouslySetInnerHTML={{ __html: header.subline }} />}
        </div>
        {acuteCareText && <p className="text-sm leading-6 text-[var(--token-body, var(--style-body-color,var(--style-text-secondary,#4b5563)))]">{acuteCareText}</p>}
        {holidayNote && <p className="mt-3 text-xs text-[var(--token-muted, var(--style-text-muted,var(--style-text-secondary,#4b5563)))]">{holidayNote}</p>}
        {ctaPrimary.label && <div className="mt-6"><a href={ctaPrimary.href || '#'} className="inline-flex items-center gap-2 border-2 border-[var(--token-btn-bg, var(--brand-btn-bg,var(--style-accent-color,var(--token-icon, var(--brand-primary)))))] bg-[var(--token-btn-bg, var(--brand-btn-bg,var(--style-accent-color,var(--token-icon, var(--brand-primary)))))] px-5 py-3 font-black uppercase text-[var(--token-btn-text, var(--brand-btn-text,#fff))]">{ctaPrimary.label}<ArrowRight size={16} /></a></div>}
      </div>
      <div className="border-2 border-[var(--token-card-border, var(--style-border-color,var(--style-text-primary,#111827)))] bg-[var(--token-card-bg, var(--style-card-bg,#fff))] shadow-[4px_4px_0_var(--token-card-border, var(--style-border-color,var(--style-text-primary,#111827)))]">
        {days.map((day, index) => (
          <div key={`${day.label}-${index}`} className="flex items-center justify-between gap-4 border-b-2 border-[var(--token-card-border, var(--style-border-color,var(--style-text-primary,#111827)))] px-5 py-4 last:border-b-0">
            <div className="flex items-center gap-3">
              <Clock size={17} className="text-[var(--token-icon, var(--style-icon-color,var(--style-accent-color,var(--token-icon, var(--brand-primary)))))]" />
              <div><p className="font-black uppercase text-[var(--token-heading, var(--style-heading-color,var(--style-text-primary,#111827)))]">{day.label || ''}</p>{day.note && <p className="text-xs text-[var(--token-muted, var(--style-text-muted,var(--style-text-secondary,#4b5563)))]">{day.note}</p>}</div>
            </div>
            <p className="text-sm font-bold text-[var(--token-heading, var(--style-heading-color,var(--style-text-primary,#111827)))]">{day.closed ? (day.note || '') : day.hours}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
