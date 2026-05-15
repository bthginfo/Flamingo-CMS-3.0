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
        {badgeText && <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-xs font-bold uppercase tracking-widest text-[var(--style-text-secondary)]">{badgeText}</motion.p>}
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-3 text-3xl sm:text-5xl font-[var(--style-heading-weight)] text-[var(--style-text-primary)]">{headline}</motion.h2>
        {subline && <p className="mt-4 text-[var(--style-text-secondary)]">{subline}</p>}
      </div>
      <div className="divide-y divide-[var(--style-badge-bg)]/20 rounded-xl border border-[var(--style-badge-bg)]/20 bg-[var(--style-card-bg)] shadow-md">
        {items.map((item, i) => (
          <motion.details key={`${item.question}-${i}`} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="group p-5">
            <summary className="cursor-pointer font-semibold text-[var(--style-text-primary)]">{item.question || ''}</summary>
            {item.answer && <p className="mt-3 text-sm leading-6 text-[var(--style-text-secondary)]">{item.answer}</p>}
          </motion.details>
        ))}
      </div>
      {ctaPrimary.label && <a href={ctaPrimary.href || '#'} className="mt-8 inline-flex rounded-full bg-[var(--style-text-primary)] px-5 py-3 font-semibold text-white shadow-md">{ctaPrimary.label}</a>}
    </div>
  );
}

function FaqModern({ headline, subline, badgeText, items, ctaPrimary }: Props) {
  return (
    <div>
      <div className="mb-14 max-w-3xl">
        {badgeText && <p className="text-xs font-light uppercase tracking-[0.3em] text-[var(--style-text-secondary)]">{badgeText}</p>}
        <h2 className="mt-4 text-3xl font-light sm:text-5xl text-[var(--style-text-primary)]">{headline}</h2>
        {subline && <p className="mt-4 font-light text-[var(--style-text-secondary)]">{subline}</p>}
      </div>
      <div className="divide-y divide-black/10 border-y border-black/10">
        {items.map((item, i) => (
          <details key={`${item.question}-${i}`} className="py-6">
            <summary className="cursor-pointer font-light text-[var(--style-text-primary)]">{item.question || ''}</summary>
            {item.answer && <p className="mt-3 text-sm font-light leading-6 text-[var(--style-text-secondary)]">{item.answer}</p>}
          </details>
        ))}
      </div>
      {ctaPrimary.label && <a href={ctaPrimary.href || '#'} className="mt-8 inline-flex border border-[var(--style-text-primary)] px-6 py-3 font-light text-[var(--style-text-primary)]">{ctaPrimary.label}</a>}
    </div>
  );
}

function FaqBold({ headline, subline, badgeText, items, ctaPrimary }: Props) {
  return (
    <div>
      <div className="mb-10 max-w-3xl">
        {badgeText && <p className="text-xs font-black uppercase tracking-widest text-[var(--style-accent)]">{badgeText}</p>}
        <h2 className="mt-3 text-3xl font-black uppercase sm:text-5xl text-[var(--style-text-primary)]">{headline}</h2>
        {subline && <p className="mt-4 font-bold text-[var(--style-text-secondary)]">{subline}</p>}
      </div>
      <div className="divide-y-2 divide-[var(--style-text-primary)] border-2 border-[var(--style-text-primary)] bg-[#111] shadow-[4px_4px_0_var(--style-accent)]">
        {items.map((item, i) => (
          <details key={`${item.question}-${i}`} className="p-5">
            <summary className="cursor-pointer font-black uppercase text-white">{item.question || ''}</summary>
            {item.answer && <p className="mt-3 text-sm leading-6 text-white/70">{item.answer}</p>}
          </details>
        ))}
      </div>
      {ctaPrimary.label && <a href={ctaPrimary.href || '#'} className="mt-8 inline-flex bg-[var(--style-accent)] px-6 py-3 font-black uppercase text-white shadow-[4px_4px_0_rgba(0,0,0,0.8)]">{ctaPrimary.label}</a>}
    </div>
  );
}
