'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { baseHeader, SectionHeader, asButton, asList } from './shared';
import type { SectionProps } from './types';

type FaqItem = { question?: string; answer?: string };

export function TourismFaqSection({ data, styleVariant }: SectionProps) {
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
      <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="divide-y divide-[var(--style-border-color,rgba(0,0,0,.1))] rounded-xl bg-[var(--style-card-bg,#fff)] shadow-lg">
        {items.map((item, index) => (
          <details key={`${item.question}-${index}`} className="p-5">
            <summary className="cursor-pointer font-semibold text-[var(--style-heading-color,var(--style-text-primary,#111827))]">{item.question || ''}</summary>
            {item.answer && <div className="mt-3 text-sm leading-6 text-[var(--style-body-color,var(--style-text-secondary,#4b5563))] rt-content" dangerouslySetInnerHTML={{ __html: item.answer }} />}
          </details>
        ))}
      </motion.div>
      {ctaPrimary.label && <div className="mt-8"><a href={ctaPrimary.href || '#'} className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-btn-bg,var(--style-accent-color,var(--brand-primary)))] px-5 py-3 font-semibold text-[var(--brand-btn-text,#fff)]">{ctaPrimary.label}<ArrowRight size={16} /></a></div>}
    </div>
  );
}

function Modern({ header, items, ctaPrimary }: Props) {
  return (
    <div>
      <SectionHeader {...header} />
      <div className="divide-y divide-[var(--style-border-color,rgba(0,0,0,.1))] border border-[var(--style-border-color,rgba(0,0,0,.1))] bg-[var(--style-card-bg,#fff)]">
        {items.map((item, index) => (
          <details key={`${item.question}-${index}`} className="p-5">
            <summary className="cursor-pointer font-light text-[var(--style-heading-color,var(--style-text-primary,#111827))]">{item.question || ''}</summary>
            {item.answer && <div className="mt-3 text-sm font-light leading-6 text-[var(--style-body-color,var(--style-text-secondary,#4b5563))] rt-content" dangerouslySetInnerHTML={{ __html: item.answer }} />}
          </details>
        ))}
      </div>
      {ctaPrimary.label && <div className="mt-8"><a href={ctaPrimary.href || '#'} className="inline-flex items-center gap-2 rounded-lg border border-[var(--brand-btn-bg,var(--style-accent-color,var(--brand-primary)))] bg-[var(--brand-btn-bg,var(--style-accent-color,var(--brand-primary)))] px-5 py-3 font-semibold text-[var(--brand-btn-text,#fff)]">{ctaPrimary.label}<ArrowRight size={16} /></a></div>}
    </div>
  );
}

function Bold({ header, items, ctaPrimary }: Props) {
  return (
    <div>
      <div className="mb-10 max-w-3xl">
        {header.badgeText && <p className="text-xs font-black uppercase tracking-widest text-[var(--style-badge-text,var(--style-accent-color,var(--brand-primary)))]">{header.badgeText}</p>}
        <h2 className="mt-3 text-3xl font-black uppercase text-[var(--style-heading-color,var(--style-text-primary,#111827))] sm:text-3xl md:text-5xl">{header.headline}</h2>
        {header.subline && <div className="mt-4 text-[var(--style-body-color,var(--style-text-secondary,#4b5563))] rt-content" dangerouslySetInnerHTML={{ __html: header.subline }} />}
      </div>
      <div className="divide-y divide-[var(--style-border-color,var(--style-text-primary,#111827))] border-2 border-[var(--style-border-color,var(--style-text-primary,#111827))] bg-[var(--style-card-bg,#fff)] shadow-[4px_4px_0_var(--style-border-color,var(--style-text-primary,#111827))]">
        {items.map((item, index) => (
          <details key={`${item.question}-${index}`} className="p-5">
            <summary className="cursor-pointer font-black uppercase text-[var(--style-heading-color,var(--style-text-primary,#111827))]">{item.question || ''}</summary>
            {item.answer && <div className="mt-3 text-sm leading-6 text-[var(--style-body-color,var(--style-text-secondary,#4b5563))] rt-content" dangerouslySetInnerHTML={{ __html: item.answer }} />}
          </details>
        ))}
      </div>
      {ctaPrimary.label && <div className="mt-8"><a href={ctaPrimary.href || '#'} className="inline-flex items-center gap-2 border-2 border-[var(--brand-btn-bg,var(--style-accent-color,var(--brand-primary)))] bg-[var(--brand-btn-bg,var(--style-accent-color,var(--brand-primary)))] px-5 py-3 font-black uppercase text-[var(--brand-btn-text,#fff)]">{ctaPrimary.label}<ArrowRight size={16} /></a></div>}
    </div>
  );
}
