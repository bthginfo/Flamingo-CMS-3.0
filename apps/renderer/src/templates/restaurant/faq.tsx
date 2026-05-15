'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { asButton, asList, type SectionProps, type ButtonValue } from './types';

type FaqItem = { question?: string; answer?: string };

export function RestaurantFaqSection({ data, styleVariant }: SectionProps) {
  const headline = (data.headline as string) || 'Häufige Fragen';
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

function Accordion({ items, variant }: { items: FaqItem[]; variant: 'classic' | 'modern' | 'bold' }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={`${item.question}-${i}`} className={variant === 'bold' ? 'border-b-2 border-[var(--style-text-primary)]' : variant === 'modern' ? 'border-b border-black/10' : 'border-b border-[var(--style-badge-bg)]/20'}>
            <button onClick={() => setOpen(isOpen ? null : i)} className={`flex w-full items-center justify-between py-5 text-left ${variant === 'bold' ? 'font-black uppercase text-[var(--style-text-primary)]' : variant === 'modern' ? 'font-medium text-[var(--style-text-primary)]' : 'font-semibold text-[var(--style-text-primary)]'}`}>
              {item.question || ''}
              <ChevronDown size={18} className={`shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {isOpen && item.answer && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
                  <p className={`pb-5 text-sm leading-6 ${variant === 'modern' ? 'font-light text-[var(--style-text-muted)]' : 'text-[var(--style-text-muted)]'}`}>{item.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </>
  );
}

function FaqClassic({ headline, subline, badgeText, items, ctaPrimary }: Props) {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-10 text-center">
        {badgeText && <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="inline-block rounded-full bg-[var(--style-accent)]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[var(--style-accent)]">{badgeText}</motion.p>}
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-4 text-3xl sm:text-5xl font-[var(--style-heading-weight)] text-[var(--style-text-primary)]">{headline}</motion.h2>
        {subline && <p className="mt-4 text-[var(--style-text-muted)]">{subline}</p>}
      </div>
      <div className="rounded-xl border border-black/10 bg-[var(--style-card-bg)] px-6 shadow-md">
        <Accordion items={items} variant="classic" />
      </div>
      {ctaPrimary.label && <div className="mt-8 text-center"><a href={ctaPrimary.href || '#'} className="inline-flex rounded-full bg-[var(--style-brand)] px-6 py-3 font-semibold text-white shadow-md">{ctaPrimary.label}</a></div>}
    </div>
  );
}

function FaqModern({ headline, subline, badgeText, items, ctaPrimary }: Props) {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-14">
        {badgeText && <p className="text-xs font-light uppercase tracking-[0.2em] text-[var(--style-text-muted)]">{badgeText}</p>}
        <h2 className="mt-4 text-3xl font-light sm:text-5xl text-[var(--style-text-primary)]">{headline}</h2>
        <div className="mt-2 h-px w-16 bg-[var(--style-accent)]" />
        {subline && <p className="mt-6 font-light text-[var(--style-text-muted)]">{subline}</p>}
      </div>
      <Accordion items={items} variant="modern" />
      {ctaPrimary.label && <a href={ctaPrimary.href || '#'} className="mt-10 inline-flex border-b-2 border-[var(--style-text-primary)] pb-1 font-medium text-[var(--style-text-primary)]">{ctaPrimary.label}</a>}
    </div>
  );
}

function FaqBold({ headline, subline, badgeText, items, ctaPrimary }: Props) {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-10">
        {badgeText && <p className="inline-block bg-[var(--style-accent)] px-3 py-1 text-xs font-black uppercase tracking-widest text-white">{badgeText}</p>}
        <h2 className="mt-4 text-3xl sm:text-5xl font-black uppercase text-[var(--style-text-primary)]">{headline}</h2>
        <div className="mt-2 h-1.5 w-20 bg-[var(--style-accent)]" />
        {subline && <p className="mt-4 font-bold text-[var(--style-text-muted)]">{subline}</p>}
      </div>
      <div className="border-2 border-[var(--style-text-primary)] bg-[var(--style-card-bg)] px-6 shadow-[4px_4px_0_var(--style-text-primary)]">
        <Accordion items={items} variant="bold" />
      </div>
      {ctaPrimary.label && <div className="mt-8"><a href={ctaPrimary.href || '#'} className="inline-flex border-2 border-[var(--style-text-primary)] bg-[var(--style-text-primary)] px-6 py-3 font-black uppercase text-white shadow-[4px_4px_0_var(--style-accent)]">{ctaPrimary.label}</a></div>}
    </div>
  );
}
