'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { asButton, asList, type SectionProps } from './types';

type FaqItem = { question?: string; answer?: string };

export function HotelFaqSection({ data, styleVariant }: SectionProps) {
  const headline = (data.headline as string) || 'FAQ';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || 'Fragen';
  const items = asList<FaqItem>(data.items);
  const ctaPrimary = asButton(data.ctaPrimary);

  const props = { headline, subline, badgeText, items, ctaPrimary };

  if (styleVariant === 'modern') return <FaqModern {...props} />;
  if (styleVariant === 'bold') return <FaqBold {...props} />;
  return <FaqClassic {...props} />;
}

type Props = {
  headline: string; subline: string; badgeText: string;
  items: FaqItem[]; ctaPrimary: { label?: string; href?: string };
};

/* --- CLASSIC --- */
function FaqClassic({ headline, subline, badgeText, items, ctaPrimary }: Props) {
  return (
    <div>
      <div className="mb-10 max-w-3xl">
        {badgeText && <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--style-text-secondary)]"><Star size={12} className="text-[var(--style-badge-bg)]" />{badgeText}</motion.p>}
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-3 text-3xl sm:text-5xl font-[var(--style-heading-weight)] text-[var(--style-text-primary)]">{headline}</motion.h2>
        {subline && <p className="mt-4 text-[var(--style-text-secondary)]">{subline}</p>}
      </div>
      <div className="divide-y divide-[var(--style-badge-bg)]/20 rounded-xl border border-[var(--style-badge-bg)]/20 bg-[var(--style-card-bg)] shadow-md">
        {items.map((item, index) => (
          <motion.details key={`${item.question}-${index}`} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }} className="group p-5">
            <summary className="cursor-pointer font-semibold text-[var(--style-text-primary)]">{item.question || ''}</summary>
            {item.answer && <p className="mt-3 text-sm leading-6 text-[var(--style-text-secondary)]">{item.answer}</p>}
          </motion.details>
        ))}
      </div>
      {ctaPrimary.label && <a href={ctaPrimary.href || '#'} className="mt-8 inline-flex rounded-xl bg-[var(--style-text-primary)] px-5 py-3 font-semibold text-white shadow-md">{ctaPrimary.label}</a>}
    </div>
  );
}

/* --- MODERN --- */
function FaqModern({ headline, subline, badgeText, items, ctaPrimary }: Props) {
  return (
    <div>
      <div className="mb-14 max-w-3xl">
        {badgeText && <p className="text-xs font-light uppercase tracking-[0.3em] text-[var(--style-text-secondary)]">{badgeText}</p>}
        <h2 className="mt-4 text-3xl font-light sm:text-5xl text-[var(--style-text-primary)]">{headline}</h2>
        {subline && <p className="mt-4 font-light text-[var(--style-text-secondary)]">{subline}</p>}
      </div>
      <div className="divide-y divide-black/10 border-y border-black/10">
        {items.map((item, index) => (
          <details key={`${item.question}-${index}`} className="group py-6">
            <summary className="cursor-pointer font-light text-[var(--style-text-primary)]">{item.question || ''}</summary>
            {item.answer && <p className="mt-4 text-sm font-light leading-7 text-[var(--style-text-secondary)]">{item.answer}</p>}
          </details>
        ))}
      </div>
      {ctaPrimary.label && <a href={ctaPrimary.href || '#'} className="mt-10 inline-flex font-light text-[var(--style-text-primary)] underline underline-offset-4">{ctaPrimary.label}</a>}
    </div>
  );
}

/* --- BOLD --- */
function FaqBold({ headline, subline, badgeText, items, ctaPrimary }: Props) {
  return (
    <div>
      <div className="mb-10 max-w-3xl">
        {badgeText && <p className="inline-block bg-[var(--style-badge-bg)] px-3 py-1 text-xs font-bold uppercase tracking-widest text-[var(--style-badge-text)]">{badgeText}</p>}
        <h2 className="mt-4 text-3xl sm:text-5xl font-black uppercase text-[var(--style-text-primary)]">{headline}</h2>
        {subline && <p className="mt-4 text-[var(--style-text-secondary)]">{subline}</p>}
      </div>
      <div className="border-2 border-[var(--style-text-primary)] bg-[var(--style-card-bg)] shadow-[4px_4px_0_var(--style-text-primary)]">
        {items.map((item, index) => (
          <details key={`${item.question}-${index}`} className="group border-b-2 border-[var(--style-text-primary)] p-5 last:border-b-0">
            <summary className="cursor-pointer font-black uppercase text-[var(--style-text-primary)]">{item.question || ''}</summary>
            {item.answer && <p className="mt-3 text-sm leading-6 text-[var(--style-text-secondary)]">{item.answer}</p>}
          </details>
        ))}
      </div>
      {ctaPrimary.label && <a href={ctaPrimary.href || '#'} className="mt-8 inline-flex border-2 border-[var(--style-text-primary)] bg-[var(--style-text-primary)] px-5 py-3 font-black uppercase text-white shadow-[4px_4px_0_var(--style-badge-bg)]">{ctaPrimary.label}</a>}
    </div>
  );
}
