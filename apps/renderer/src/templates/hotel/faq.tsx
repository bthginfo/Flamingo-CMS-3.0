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
        {badgeText && <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[color:var(--token-badge-text)]"><Star size={12} className="text-[color:var(--token-rating-star)]" /><span data-edit-path="badgeText">{badgeText}</span></motion.p>}
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-3 text-3xl sm:text-3xl md:text-5xl font-[700] text-[color:var(--token-heading)]" data-edit-path="headline">{headline}</motion.h2>
        {subline && <div className="mt-4 text-[color:var(--token-muted)] rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: subline }} />}
      </div>
      <div className="divide-y divide-[color-mix(in_srgb,var(--token-icon)_20%,transparent)] rounded-xl border border-[color-mix(in_srgb,var(--token-icon)_20%,transparent)] bg-[var(--token-card-bg)] shadow-md">
        {items.map((item, index) => (
          <motion.details key={`${item.question || 'item'}-${index}`} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }} className="group p-5" data-edit-collection="items" data-edit-index={index}>
            <summary className="cursor-pointer font-semibold text-[color:var(--token-heading)]">{item.question || ''}</summary>
            {item.answer && <div className="mt-3 text-sm leading-6 text-[color:var(--token-muted)] rt-content" data-edit-rich="answer" dangerouslySetInnerHTML={{ __html: item.answer }} />}
          </motion.details>
        ))}
      </div>
      {ctaPrimary.label && <a data-edit-link="ctaPrimary" href={ctaPrimary.href || '#'} className="mt-8 inline-flex rounded-xl bg-[var(--token-btn-bg)] px-5 py-3 font-semibold text-[color:var(--token-on-dark-heading)] shadow-md" data-edit-path="label">{ctaPrimary.label}</a>}
    </div>
  );
}

