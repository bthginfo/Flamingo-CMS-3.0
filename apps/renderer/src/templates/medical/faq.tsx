'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { baseHeader, CtaButton, SectionHeader, asButton, asList } from './shared';
import type { SectionProps } from './types';

type FaqItem = { question?: string; answer?: string };

export function MedicalFaqSection({ data, styleVariant }: SectionProps) {
  const header = baseHeader(data, 'Haeufige Fragen', 'FAQ');
  const items = asList<FaqItem>(data.items);
  const ctaPrimary = asButton(data.ctaPrimary);

  if (styleVariant === 'modern') return <Modern header={header} items={items} ctaPrimary={ctaPrimary} />;
  if (styleVariant === 'bold') return <Bold header={header} items={items} ctaPrimary={ctaPrimary} />;
  return <Classic header={header} items={items} ctaPrimary={ctaPrimary} />;
}

type Props = { header: { headline: string; subline: string; badgeText: string }; items: FaqItem[]; ctaPrimary: { label?: string; href?: string } };

function Classic({ header, items, ctaPrimary }: Props) {
  return (
    <div>
      <SectionHeader {...header} />
      <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="divide-y divide-black/10 rounded-2xl bg-[var(--style-card-bg)] shadow-lg">
        {items.map((item, index) => (
          <details key={`${item.question}-${index}`} className="p-5">
            <summary className="cursor-pointer font-semibold text-[var(--style-text-primary)]">{item.question || ''}</summary>
            {item.answer && <p className="mt-3 text-sm leading-6 text-[var(--style-text-secondary)]">{item.answer}</p>}
          </details>
        ))}
      </motion.div>
      {ctaPrimary.label && <div className="mt-8"><a href={ctaPrimary.href || '#'} className="inline-flex items-center gap-2 rounded-full bg-teal-700 px-5 py-3 font-semibold text-white">{ctaPrimary.label}<ArrowRight size={16} /></a></div>}
    </div>
  );
}

function Modern({ header, items, ctaPrimary }: Props) {
  return (
    <div>
      <SectionHeader {...header} />
      <div className="divide-y divide-black/10 border border-black/10 bg-[var(--style-card-bg)]">
        {items.map((item, index) => (
          <details key={`${item.question}-${index}`} className="p-5">
            <summary className="cursor-pointer font-light text-[var(--style-text-primary)]">{item.question || ''}</summary>
            {item.answer && <p className="mt-3 text-sm font-light leading-6 text-[var(--style-text-secondary)]">{item.answer}</p>}
          </details>
        ))}
      </div>
      {ctaPrimary.label && <div className="mt-8"><a href={ctaPrimary.href || '#'} className="inline-flex items-center gap-2 rounded-[var(--style-button-radius)] border border-blue-600 bg-blue-600 px-5 py-3 font-semibold text-white">{ctaPrimary.label}<ArrowRight size={16} /></a></div>}
    </div>
  );
}

function Bold({ header, items, ctaPrimary }: Props) {
  return (
    <div>
      <div className="mb-10 max-w-3xl">
        {header.badgeText && <p className="text-xs font-black uppercase tracking-widest text-teal-400">{header.badgeText}</p>}
        <h2 className="mt-3 text-3xl font-black uppercase text-[var(--style-text-primary)] sm:text-5xl">{header.headline}</h2>
        {header.subline && <p className="mt-4 text-[var(--style-text-secondary)]">{header.subline}</p>}
      </div>
      <div className="divide-y divide-[var(--style-text-primary)] border-2 border-[var(--style-text-primary)] bg-[var(--style-card-bg)] shadow-[4px_4px_0_var(--style-text-primary)]">
        {items.map((item, index) => (
          <details key={`${item.question}-${index}`} className="p-5">
            <summary className="cursor-pointer font-black uppercase text-[var(--style-text-primary)]">{item.question || ''}</summary>
            {item.answer && <p className="mt-3 text-sm leading-6 text-[var(--style-text-secondary)]">{item.answer}</p>}
          </details>
        ))}
      </div>
      {ctaPrimary.label && <div className="mt-8"><a href={ctaPrimary.href || '#'} className="inline-flex items-center gap-2 border-2 border-teal-400 bg-teal-400 px-5 py-3 font-black uppercase text-gray-950 shadow-[4px_4px_0_theme(colors.teal.700)]">{ctaPrimary.label}<ArrowRight size={16} /></a></div>}
    </div>
  );
}
