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
        {acuteCareText && <p className="text-sm leading-6 text-gray-600">{acuteCareText}</p>}
        {holidayNote && <p className="mt-3 text-xs text-gray-600">{holidayNote}</p>}
        <div className="mt-6"><CtaButton cta={ctaPrimary} /></div>
      </div>
      <div className="rounded-xl bg-white shadow-lg">
        {days.map((day, index) => (
          <div key={`${day.label}-${index}`} className="flex items-center justify-between gap-4 border-b border-black/10 px-5 py-4 last:border-b-0">
            <div className="flex items-center gap-3">
              <Clock size={17} className="text-teal-700" />
              <div><p className="font-semibold text-gray-900">{day.label || ''}</p>{day.note && <p className="text-xs text-gray-600">{day.note}</p>}</div>
            </div>
            <p className="text-sm font-medium text-gray-900">{day.closed ? (day.note || '') : day.hours}</p>
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
        {acuteCareText && <p className="text-sm font-light leading-6 text-gray-600">{acuteCareText}</p>}
        {holidayNote && <p className="mt-3 text-xs font-light text-gray-600">{holidayNote}</p>}
        {ctaPrimary.label && <div className="mt-6"><a href={ctaPrimary.href || '#'} className="inline-flex items-center gap-2 rounded-lg border border-blue-600 bg-blue-600 px-5 py-3 font-semibold text-white">{ctaPrimary.label}<ArrowRight size={16} /></a></div>}
      </div>
      <div className="border border-black/10 bg-white">
        {days.map((day, index) => (
          <div key={`${day.label}-${index}`} className="flex items-center justify-between gap-4 border-b border-black/10 px-5 py-4 last:border-b-0">
            <div className="flex items-center gap-3">
              <Clock size={17} className="text-blue-500" />
              <div><p className="font-light text-gray-900">{day.label || ''}</p>{day.note && <p className="text-xs font-light text-gray-600">{day.note}</p>}</div>
            </div>
            <p className="text-sm font-light text-gray-900">{day.closed ? (day.note || '') : day.hours}</p>
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
          {header.badgeText && <p className="text-xs font-black uppercase tracking-widest text-teal-400">{header.badgeText}</p>}
          <h2 className="mt-3 text-3xl font-black uppercase text-gray-900 sm:text-3xl md:text-5xl">{header.headline}</h2>
          {header.subline && <div className="mt-4 text-gray-600 rt-content" dangerouslySetInnerHTML={{ __html: header.subline }} />}
        </div>
        {acuteCareText && <p className="text-sm leading-6 text-gray-600">{acuteCareText}</p>}
        {holidayNote && <p className="mt-3 text-xs text-gray-600">{holidayNote}</p>}
        {ctaPrimary.label && <div className="mt-6"><a href={ctaPrimary.href || '#'} className="inline-flex items-center gap-2 border-2 border-teal-400 bg-teal-400 px-5 py-3 font-black uppercase text-gray-950 shadow-[4px_4px_0_theme(colors.teal.700)]">{ctaPrimary.label}<ArrowRight size={16} /></a></div>}
      </div>
      <div className="border-2 border-[#111827] bg-white shadow-[4px_4px_0_#111827]">
        {days.map((day, index) => (
          <div key={`${day.label}-${index}`} className="flex items-center justify-between gap-4 border-b-2 border-[#111827] px-5 py-4 last:border-b-0">
            <div className="flex items-center gap-3">
              <Clock size={17} className="text-teal-400" />
              <div><p className="font-black uppercase text-gray-900">{day.label || ''}</p>{day.note && <p className="text-xs text-gray-600">{day.note}</p>}</div>
            </div>
            <p className="text-sm font-bold text-gray-900">{day.closed ? (day.note || '') : day.hours}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
