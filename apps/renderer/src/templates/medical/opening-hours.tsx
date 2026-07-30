'use client';

import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { baseHeader, CtaButton, SectionHeader, asButton, asList } from './shared';
import type { SectionProps } from './types';

type Day = { label?: string; day?: string; hours?: string; note?: string; closed?: boolean };

export function MedicalOpeningHoursSection({ data, styleVariant }: SectionProps) {
  const header = baseHeader(data, 'Sprechzeiten', 'Zeiten');
  const days = asList<Day>(data.days).map((d) => d && ({ ...d, label: d.label ?? d.day }));
  const acuteCareText = (data.acuteCareText as string) || '';
  const holidayNote = (data.holidayNote as string) || '';
  const ctaPrimary = asButton(data.ctaPrimary);

  const props = { header, days, acuteCareText, holidayNote, ctaPrimary };
  return <Classic {...props} />;
}

type Props = { header: { headline: string; subline: string; badgeText: string }; days: Day[]; acuteCareText: string; holidayNote: string; ctaPrimary: { label?: string; href?: string } };

function Classic({ header, days, acuteCareText, holidayNote, ctaPrimary }: Props) {
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
      <div>
        <SectionHeader {...header} />
        {acuteCareText && <p className="text-sm leading-6 text-[color:var(--token-body)]">{acuteCareText}</p>}
        {holidayNote && <p className="mt-3 text-xs text-[color:var(--token-muted)]">{holidayNote}</p>}
        <div className="mt-6"><CtaButton cta={ctaPrimary} /></div>
      </div>
      <div className="rounded-xl bg-[var(--token-card-bg)] shadow-lg">
        {days.map((day, index) => (
          <div key={`${day.label || 'item'}-${index}`} className="flex items-center justify-between gap-4 border-b border-[var(--token-card-border)] px-5 py-4 last:border-b-0" data-card data-edit-collection="days" data-edit-index={index}>
            <div className="flex items-center gap-3">
              <Clock size={17} className="text-[color:var(--token-icon)]" />
              <div><p className="font-semibold text-[color:var(--token-heading)]" data-edit-path="label">{day.label || ''}</p>{day.note && <p className="text-xs text-[color:var(--token-muted)]" data-edit-path="note">{day.note}</p>}</div>
            </div>
            <p className="text-sm font-medium text-[color:var(--token-heading)]">{day.closed ? (day.note || '') : day.hours}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

