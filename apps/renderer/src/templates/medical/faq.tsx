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
      <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="divide-y divide-[var(--token-card-border)] rounded-xl bg-[var(--token-card-bg)] shadow-lg">
        {items.map((item, index) => (
          <details key={`${item.question}-${index}`} className="p-5" data-edit-collection="items" data-edit-index={index}>
            <summary className="cursor-pointer font-semibold text-[color:var(--token-heading)]">{item.question || ''}</summary>
            {item.answer && <div className="mt-3 text-sm leading-6 text-[color:var(--token-body)] rt-content" data-edit-rich="answer" dangerouslySetInnerHTML={{ __html: item.answer }} />}
          </details>
        ))}
      </motion.div>
      {ctaPrimary.label && <div className="mt-8"><a data-edit-link="ctaPrimary" href={ctaPrimary.href || '#'} className="inline-flex items-center gap-2 rounded-full bg-[var(--token-btn-bg)] px-5 py-3 font-semibold text-[color:var(--token-btn-text)]"><span data-edit-path="label">{ctaPrimary.label}</span><ArrowRight size={16} /></a></div>}
    </div>
  );
}

function Modern({ header, items, ctaPrimary }: Props) {
  return (
    <div>
      <SectionHeader {...header} />
      <div className="divide-y divide-[var(--token-card-border)] border border-[var(--token-card-border)] bg-[var(--token-card-bg)]">
        {items.map((item, index) => (
          <details key={`${item.question}-${index}`} className="p-5" data-edit-collection="items" data-edit-index={index}>
            <summary className="cursor-pointer font-light text-[color:var(--token-heading)]">{item.question || ''}</summary>
            {item.answer && <div className="mt-3 text-sm font-light leading-6 text-[color:var(--token-body)] rt-content" data-edit-rich="answer" dangerouslySetInnerHTML={{ __html: item.answer }} />}
          </details>
        ))}
      </div>
      {ctaPrimary.label && <div className="mt-8"><a data-edit-link="ctaPrimary" href={ctaPrimary.href || '#'} className="inline-flex items-center gap-2 rounded-lg border border-[var(--token-btn-bg)] bg-[var(--token-btn-bg)] px-5 py-3 font-semibold text-[color:var(--token-btn-text)]"><span data-edit-path="label">{ctaPrimary.label}</span><ArrowRight size={16} /></a></div>}
    </div>
  );
}

function Bold({ header, items, ctaPrimary }: Props) {
  return (
    <div>
      <div className="mb-10 max-w-3xl">
        {header.badgeText && <p className="text-xs font-black uppercase tracking-widest text-[color:var(--token-badge-text)]" data-edit-path="badgeText">{header.badgeText}</p>}
        <h2 className="mt-3 text-3xl font-black uppercase text-[color:var(--token-heading)] sm:text-3xl md:text-5xl" data-edit-path="headline">{header.headline}</h2>
        {header.subline && <div className="mt-4 text-[color:var(--token-body)] rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: header.subline }} />}
      </div>
      <div className="divide-y divide-[var(--token-card-border)] border-2 border-[var(--token-card-border)] bg-[var(--token-card-bg)] shadow-[4px_4px_0_var(--token-card-border)]">
        {items.map((item, index) => (
          <details key={`$<span data-edit-path="question">{item.question}</span>-${index}`} className="p-5" data-edit-collection="items" data-edit-index={index}>
            <summary className="cursor-pointer font-black uppercase text-[color:var(--token-heading)]">{item.question || ''}</summary>
            {item.answer && <div className="mt-3 text-sm leading-6 text-[color:var(--token-body)] rt-content" data-edit-rich="answer" dangerouslySetInnerHTML={{ __html: item.answer }} />}
          </details>
        ))}
      </div>
      {ctaPrimary.label && <div className="mt-8"><a data-edit-link="ctaPrimary" href={ctaPrimary.href || '#'} className="inline-flex items-center gap-2 border-2 border-[var(--token-btn-bg)] bg-[var(--token-btn-bg)] px-5 py-3 font-black uppercase text-[color:var(--token-btn-text)]"><span data-edit-path="label">{ctaPrimary.label}</span><ArrowRight size={16} /></a></div>}
    </div>
  );
}
