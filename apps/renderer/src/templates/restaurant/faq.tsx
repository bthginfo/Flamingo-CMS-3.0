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
          <div key={`${item.question}-${i}`} className={variant === 'bold' ? 'border-b-2 border-[#111827]' : variant === 'modern' ? 'border-b border-black/10' : 'border-b border-[var(--token-icon, var(--brand-primary))]/20'}>
            <button onClick={() => setOpen(isOpen ? null : i)} className={`flex w-full items-center justify-between py-5 text-left ${variant === 'bold' ? 'font-black uppercase text-[color:var(--token-heading,#18181b)]' : variant === 'modern' ? 'font-medium text-[color:var(--token-heading,#18181b)]' : 'font-semibold text-[color:var(--token-heading,#18181b)]'}`}>
              {item.question || ''}
              <ChevronDown size={18} className={`shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {isOpen && item.answer && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
                  <div className={`pb-5 text-sm leading-6 ${variant === 'modern' ? 'font-light text-[color:var(--token-muted,#71717a)]' : 'text-[color:var(--token-muted,#71717a)]'}`} dangerouslySetInnerHTML={{ __html: item.answer }} />
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
        {badgeText && <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="inline-block rounded-full bg-[var(--token-badge-bg,var(--brand-accent,#f39c12))/10] px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[color:var(--token-eyebrow,var(--brand-accent,#f39c12))]" data-edit-path="badgeText">{badgeText}</motion.p>}
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-4 text-3xl sm:text-3xl md:text-5xl font-[700] text-[color:var(--token-heading,#18181b)]" data-edit-path="headline">{headline}</motion.h2>
        {subline && <div className="mt-4 text-[color:var(--token-muted,#71717a)] rt-content" dangerouslySetInnerHTML={{ __html: subline }} />}
      </div>
      <div className="rounded-xl border border-black/10 bg-[var(--token-card-bg,#ffffff)] px-6 shadow-md">
        <Accordion items={items} variant="classic" />
      </div>
      {ctaPrimary.label && <div className="mt-8 text-center"><a href={ctaPrimary.href || '#'} className="inline-flex rounded-full bg-[var(--token-btn-bg,var(--brand-primary,#1a5276))] px-6 py-3 font-semibold text-[color:var(--token-on-dark-heading,#ffffff)] shadow-md" data-edit-path="label">{ctaPrimary.label}</a></div>}
    </div>
  );
}

function FaqModern({ headline, subline, badgeText, items, ctaPrimary }: Props) {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-14">
        {badgeText && <p className="text-xs font-light uppercase tracking-[0.2em] text-[color:var(--token-muted,#71717a)]" data-edit-path="badgeText">{badgeText}</p>}
        <h2 className="mt-4 text-3xl font-light sm:text-3xl md:text-5xl text-[color:var(--token-heading,#18181b)]" data-edit-path="headline">{headline}</h2>
        <div className="mt-2 h-px w-16 bg-[var(--token-badge-bg,var(--brand-accent,#f39c12))]" />
        {subline && <div className="mt-6 font-light text-[color:var(--token-muted,#71717a)] rt-content" dangerouslySetInnerHTML={{ __html: subline }} />}
      </div>
      <Accordion items={items} variant="modern" />
      {ctaPrimary.label && <a href={ctaPrimary.href || '#'} className="mt-10 inline-flex border-b-2 border-[#111827] pb-1 font-medium text-[color:var(--token-heading,#18181b)]" data-edit-path="label">{ctaPrimary.label}</a>}
    </div>
  );
}

function FaqBold({ headline, subline, badgeText, items, ctaPrimary }: Props) {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-10">
        {badgeText && <p className="inline-block bg-[var(--token-badge-bg,var(--brand-accent,#f39c12))] px-3 py-1 text-xs font-black uppercase tracking-widest text-[color:var(--token-on-dark-heading,#ffffff)]" data-edit-path="badgeText">{badgeText}</p>}
        <h2 className="mt-4 text-3xl sm:text-3xl md:text-5xl font-black uppercase text-[color:var(--token-heading,#18181b)]" data-edit-path="headline">{headline}</h2>
        <div className="mt-2 h-1.5 w-20 bg-[var(--token-badge-bg,var(--brand-accent,#f39c12))]" />
        {subline && <div className="mt-4 font-bold text-[color:var(--token-muted,#71717a)] rt-content" dangerouslySetInnerHTML={{ __html: subline }} />}
      </div>
      <div className="border-2 border-[#111827] bg-[var(--token-card-bg,#ffffff)] px-6 shadow-[4px_4px_0_#111827]">
        <Accordion items={items} variant="bold" />
      </div>
      {ctaPrimary.label && <div className="mt-8"><a href={ctaPrimary.href || '#'} className="inline-flex border-2 border-[#111827] bg-[#111827] px-6 py-3 font-black uppercase text-[color:var(--token-on-dark-heading,#ffffff)] shadow-[4px_4px_0_var(--token-eyebrow, var(--brand-accent))]" data-edit-path="label">{ctaPrimary.label}</a></div>}
    </div>
  );
}
