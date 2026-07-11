'use client';

import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { asButton, asList, type SectionProps } from './types';

type Day = { label?: string; day?: string; hours?: string; note?: string; closed?: boolean };

type OpeningHoursViewProps = {
  headline: string;
  subline: string;
  badgeText: string;
  days: Day[];
  kitchenHoursHeadline: string;
  kitchenHoursText: string;
  holidayNote: string;
  ctaPrimary: { label?: string; href?: string };
};

export function OpeningHoursSection({ data, styleVariant }: SectionProps) {
  const headline = (data.headline as string) || 'Oeffnungszeiten';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || 'Besuchen Sie uns';
  const days = asList<Day>(data.days).map((d) => d && ({ ...d, label: d.label ?? d.day }));
  const kitchenHoursHeadline = (data.kitchenHoursHeadline as string) || '';
  const kitchenHoursText = (data.kitchenHoursText as string) || '';
  const holidayNote = (data.holidayNote as string) || '';
  const ctaPrimary = asButton(data.ctaPrimary);

  const props: OpeningHoursViewProps = { headline, subline, badgeText, days, kitchenHoursHeadline, kitchenHoursText, holidayNote, ctaPrimary };

  return <OpeningHoursClassic {...props} />;
}

function OpeningHoursClassic({ headline, subline, badgeText, days, kitchenHoursHeadline, kitchenHoursText, holidayNote, ctaPrimary }: OpeningHoursViewProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
      <div>
        {badgeText && <p className="inline-block rounded-full bg-[color-mix(in_srgb,var(--token-badge-bg)_10%,transparent)] px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[color:var(--token-badge-text)]" data-edit-path="badgeText">{badgeText}</p>}
        <h2 className="mt-4 text-3xl sm:text-3xl md:text-5xl font-[700] text-[color:var(--token-heading)]" data-edit-path="headline">{headline}</h2>
        {subline && <div className="mt-4 text-[color:var(--token-muted)] rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: subline }} />}
        {kitchenHoursHeadline && <h3 className="mt-8 font-semibold text-[color:var(--token-heading)]">{kitchenHoursHeadline}</h3>}
        {kitchenHoursText && <p className="mt-2 text-sm leading-6 text-[color:var(--token-muted)]">{kitchenHoursText}</p>}
        {holidayNote && <p className="mt-4 text-xs text-[color:var(--token-muted)]">{holidayNote}</p>}
        {ctaPrimary.label && <a data-edit-link="ctaPrimary" href={ctaPrimary.href || '#'} className="mt-6 inline-flex rounded-full bg-[var(--token-btn-bg)] px-6 py-3 font-semibold text-[color:var(--token-btn-text)] shadow-md" data-edit-path="label">{ctaPrimary.label}</a>}
      </div>
      <div className="overflow-hidden rounded-xl border border-black/10 bg-[var(--token-card-bg)] shadow-lg">
        {days.map((day, index) => (
          <motion.div key={`${day.label || 'item'}-${index}`} initial={{ opacity: 0, x: 12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }} className="flex items-center justify-between gap-4 border-b border-black/10 px-6 py-4 last:border-b-0" data-edit-collection="days" data-edit-index={index}>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-[color-mix(in_srgb,var(--token-badge-bg)_10%,transparent)] p-1.5 text-[color:var(--token-badge-text)]"><Clock size={15} /></div>
              <div>
                <p className="font-semibold text-[color:var(--token-heading)]" data-edit-path="label">{day.label || ''}</p>
                {day.note && <p className="text-xs text-[color:var(--token-muted)]" data-edit-path="note">{day.note}</p>}
              </div>
            </div>
            <p className={`text-sm font-medium ${day.closed ? 'text-[color:var(--token-muted)]' : 'text-[color:var(--token-heading)]'}`}>{day.closed ? (day.note || '') : day.hours}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

