'use client';

import { motion } from 'framer-motion';
import { asButton, asList, type SectionProps, type ButtonValue } from './types';

type FaqItem = { question?: string; answer?: string };

export function SalonFaqSection({ data, styleVariant }: SectionProps) {
  const headline = (data.headline as string) || 'Haeufige Fragen';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || 'FAQ';
  const items = asList<FaqItem>(data.items);
  const ctaPrimary = asButton(data.ctaPrimary);

  const props = { headline, subline, badgeText, items, ctaPrimary };

  if (styleVariant === 'modern') return <FaqModern {...props} />;
  if (styleVariant === 'bold') return <FaqBold {...props} />;
  return <FaqClassic {...props} />;
}

type Props = { headline: string; subline: string; badgeText: string; items: FaqItem[]; ctaPrimary: ButtonValue };

function FaqClassic({ headline, subline, badgeText, items, ctaPrimary }: Props) {
  return (
    <div>
      <div className="mb-10 max-w-3xl">
        {badgeText && <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-xs font-bold uppercase tracking-widest text-gray-600">{badgeText}</motion.p>}
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-3 text-3xl sm:text-3xl md:text-5xl font-[700] text-gray-900">{headline}</motion.h2>
        {subline && <div className="mt-4 text-gray-600 rt-content" dangerouslySetInnerHTML={{ __html: subline }} />}
      </div>
      <div className="divide-y divide-[var(--brand-primary)]/20 rounded-xl border border-[var(--brand-primary)]/20 bg-white shadow-md">
        {items.map((item, i) => (
          <motion.details key={`${item.question}-${i}`} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="group p-5">
            <summary className="cursor-pointer font-semibold text-gray-900">{item.question || ''}</summary>
            {item.answer && <div className="mt-3 text-sm leading-6 text-gray-600 rt-content" dangerouslySetInnerHTML={{ __html: item.answer }} />}
          </motion.details>
        ))}
      </div>
      {ctaPrimary.label && <a href={ctaPrimary.href || '#'} className="mt-8 inline-flex rounded-full bg-[#111827] px-5 py-3 font-semibold text-white shadow-md">{ctaPrimary.label}</a>}
    </div>
  );
}

function FaqModern({ headline, subline, badgeText, items, ctaPrimary }: Props) {
  return (
    <div>
      <div className="mb-14 max-w-3xl">
        {badgeText && <p className="text-xs font-light uppercase tracking-[0.3em] text-gray-600">{badgeText}</p>}
        <h2 className="mt-4 text-3xl font-light sm:text-3xl md:text-5xl text-gray-900">{headline}</h2>
        {subline && <div className="mt-4 font-light text-gray-600 rt-content" dangerouslySetInnerHTML={{ __html: subline }} />}
      </div>
      <div className="divide-y divide-black/10 border-y border-black/10">
        {items.map((item, i) => (
          <details key={`${item.question}-${i}`} className="py-6">
            <summary className="cursor-pointer font-light text-gray-900">{item.question || ''}</summary>
            {item.answer && <div className="mt-3 text-sm font-light leading-6 text-gray-600 rt-content" dangerouslySetInnerHTML={{ __html: item.answer }} />}
          </details>
        ))}
      </div>
      {ctaPrimary.label && <a href={ctaPrimary.href || '#'} className="mt-8 inline-flex border border-[#111827] px-6 py-3 font-light text-gray-900">{ctaPrimary.label}</a>}
    </div>
  );
}

function FaqBold({ headline, subline, badgeText, items, ctaPrimary }: Props) {
  return (
    <div>
      <div className="mb-10 max-w-3xl">
        {badgeText && <p className="text-xs font-black uppercase tracking-widest text-brand-accent">{badgeText}</p>}
        <h2 className="mt-3 text-3xl font-black uppercase sm:text-3xl md:text-5xl text-gray-900">{headline}</h2>
        {subline && <div className="mt-4 font-bold text-gray-600 rt-content" dangerouslySetInnerHTML={{ __html: subline }} />}
      </div>
      <div className="divide-y-2 divide-[#111827] border-2 border-[#111827] bg-[#111] shadow-[4px_4px_0_var(--brand-accent)]">
        {items.map((item, i) => (
          <details key={`${item.question}-${i}`} className="p-5">
            <summary className="cursor-pointer font-black uppercase text-white">{item.question || ''}</summary>
            {item.answer && <div className="mt-3 text-sm leading-6 text-white/70 rt-content" dangerouslySetInnerHTML={{ __html: item.answer }} />}
          </details>
        ))}
      </div>
      {ctaPrimary.label && <a href={ctaPrimary.href || '#'} className="mt-8 inline-flex bg-brand-accent px-6 py-3 font-black uppercase text-white shadow-[4px_4px_0_rgba(0,0,0,0.8)]">{ctaPrimary.label}</a>}
    </div>
  );
}
