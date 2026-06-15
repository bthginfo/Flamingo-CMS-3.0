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
        {badgeText && <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-xs font-bold uppercase tracking-widest text-[color:var(--token-muted)]" data-edit-path="badgeText">{badgeText}</motion.p>}
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-3 text-3xl sm:text-3xl md:text-5xl font-[700] text-[color:var(--token-heading)]" data-edit-path="headline">{headline}</motion.h2>
        {subline && <div className="mt-4 text-[color:var(--token-muted)] rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: subline }} />}
      </div>
      <div className="divide-y divide-[color-mix(in_srgb,var(--token-icon)_20%,transparent)] rounded-xl border border-[color-mix(in_srgb,var(--token-icon)_20%,transparent)] bg-[var(--token-card-bg)] shadow-md">
        {items.map((item, i) => (
          <motion.details key={`$<span data-edit-path="question">{item.question}</span>-${i}`} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="group p-5" data-edit-collection="items" data-edit-index={i}>
            <summary className="cursor-pointer font-semibold text-[color:var(--token-heading)]">{item.question || ''}</summary>
            {item.answer && <div className="mt-3 text-sm leading-6 text-[color:var(--token-muted)] rt-content" data-edit-rich="answer" dangerouslySetInnerHTML={{ __html: item.answer }} />}
          </motion.details>
        ))}
      </div>
      {ctaPrimary.label && <a data-edit-link="ctaPrimary" href={ctaPrimary.href || '#'} className="mt-8 inline-flex rounded-full bg-[#111827] px-5 py-3 font-semibold text-[color:var(--token-on-dark-heading)] shadow-md" data-edit-path="label">{ctaPrimary.label}</a>}
    </div>
  );
}

function FaqModern({ headline, subline, badgeText, items, ctaPrimary }: Props) {
  return (
    <div>
      <div className="mb-14 max-w-3xl">
        {badgeText && <p className="text-xs font-light uppercase tracking-[0.3em] text-[color:var(--token-muted)]" data-edit-path="badgeText">{badgeText}</p>}
        <h2 className="mt-4 text-3xl font-light sm:text-3xl md:text-5xl text-[color:var(--token-heading)]" data-edit-path="headline">{headline}</h2>
        {subline && <div className="mt-4 font-light text-[color:var(--token-muted)] rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: subline }} />}
      </div>
      <div className="divide-y divide-black/10 border-y border-black/10">
        {items.map((item, i) => (
          <details key={`$<span data-edit-path="question">{item.question}</span>-${i}`} className="py-6" data-edit-collection="items" data-edit-index={i}>
            <summary className="cursor-pointer font-light text-[color:var(--token-heading)]">{item.question || ''}</summary>
            {item.answer && <div className="mt-3 text-sm font-light leading-6 text-[color:var(--token-muted)] rt-content" data-edit-rich="answer" dangerouslySetInnerHTML={{ __html: item.answer }} />}
          </details>
        ))}
      </div>
      {ctaPrimary.label && <a data-edit-link="ctaPrimary" href={ctaPrimary.href || '#'} className="mt-8 inline-flex border border-[#111827] px-6 py-3 font-light text-[color:var(--token-heading)]" data-edit-path="label">{ctaPrimary.label}</a>}
    </div>
  );
}

function FaqBold({ headline, subline, badgeText, items, ctaPrimary }: Props) {
  return (
    <div>
      <div className="mb-10 max-w-3xl">
        {badgeText && <p className="text-xs font-black uppercase tracking-widest text-[color:var(--token-eyebrow)]" data-edit-path="badgeText">{badgeText}</p>}
        <h2 className="mt-3 text-3xl font-black uppercase sm:text-3xl md:text-5xl text-[color:var(--token-heading)]" data-edit-path="headline">{headline}</h2>
        {subline && <div className="mt-4 font-bold text-[color:var(--token-muted)] rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: subline }} />}
      </div>
      <div className="divide-y-2 divide-[#111827] border-2 border-[#111827] bg-[#111] shadow-[4px_4px_0_var(--token-eyebrow)]">
        {items.map((item, i) => (
          <details key={`$<span data-edit-path="question">{item.question}</span>-${i}`} className="p-5" data-edit-collection="items" data-edit-index={i}>
            <summary className="cursor-pointer font-black uppercase text-[color:var(--token-on-dark-heading)]">{item.question || ''}</summary>
            {item.answer && <div className="mt-3 text-sm leading-6 text-[color:color-mix(in_srgb,var(--token-on-dark-heading)_70%,transparent)] rt-content" data-edit-rich="answer" dangerouslySetInnerHTML={{ __html: item.answer }} />}
          </details>
        ))}
      </div>
      {ctaPrimary.label && <a data-edit-link="ctaPrimary" href={ctaPrimary.href || '#'} className="mt-8 inline-flex bg-[var(--token-badge-bg)] px-6 py-3 font-black uppercase text-[color:var(--token-on-dark-heading)] shadow-[4px_4px_0_rgba(0,0,0,0.8)]" data-edit-path="label">{ctaPrimary.label}</a>}
    </div>
  );
}
