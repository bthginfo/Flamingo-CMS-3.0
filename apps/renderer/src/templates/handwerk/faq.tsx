'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ChevronDown, HelpCircle, Plus, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { plain } from '@/lib/strip-html';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function FaqSection({ data, styleVariant }: Props) {
  const headline = (data.headline as string) || '';
  const badgeText = (data.badgeText as string) || '';
  const items = (data.items as { question: string; answer: string }[]) || [];
  const expandFirst = data.expandFirst !== false;

  if (styleVariant === 'modern') return <FaqModern headline={headline} badgeText={badgeText} items={items} expandFirst={expandFirst} />;
  if (styleVariant === 'bold') return <FaqBold headline={headline} badgeText={badgeText} items={items} expandFirst={expandFirst} />;
  return <FaqClassic headline={headline} badgeText={badgeText} items={items} expandFirst={expandFirst} />;
}

type FProps = { headline: string; badgeText: string; items: { question: string; answer: string }[]; expandFirst: boolean };

/* ─── CLASSIC: Rounded cards, soft shadow, chevron icon ─── */
function FaqClassic({ headline, badgeText, items, expandFirst }: FProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <div ref={ref} className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-14">
        {badgeText && <div className="section-badge"><HelpCircle size={14} /><span>{badgeText}</span></div>}
        {headline && <h2 className="section-headline" data-edit-path="headline">{headline}</h2>}
      </motion.div>
      <div className="space-y-3">
        {items.map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4, delay: i * 0.08 }}>
            <FaqItemClassic question={item.question} answer={plain(item.answer)} defaultOpen={expandFirst && i === 0} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function FaqItemClassic({ question, answer, defaultOpen }: { question: string; answer: string; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={cn('overflow-hidden rounded-2xl border transition-all duration-300', open ? 'border-[var(--token-card-border, var(--style-border-color,rgba(0,0,0,0.14)))] bg-[var(--token-card-bg, var(--style-card-bg,#ffffff))] shadow-lg' : 'border-[var(--token-card-border, var(--style-border-color,rgba(0,0,0,0.08)))] bg-[var(--token-card-bg, var(--style-card-bg,rgba(255,255,255,0.50)))] hover:shadow-sm')}>
      <button onClick={() => setOpen(!open)} className="font-display flex w-full items-center justify-between gap-4 px-7 py-6 text-left text-[16px] font-semibold text-[var(--token-heading, var(--style-heading-color,var(--style-text-primary,#111827)))]">
        {question}
        <ChevronDown size={18} className={cn('shrink-0 text-[var(--token-muted, var(--style-text-muted,var(--style-text-secondary,#9ca3af)))] transition-transform', open && 'rotate-180')} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
            <div className="px-7 pb-6 leading-relaxed text-[var(--token-body, var(--style-body-color,var(--style-text-secondary,#6b7280)))]">{plain(answer)}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── MODERN: Clean lines, no cards, subtle separator ─── */
function FaqModern({ headline, badgeText, items, expandFirst }: FProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <div ref={ref} className="max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="mb-10 md:mb-16">
        {badgeText && <div className="mb-4 flex items-center gap-3 text-sm uppercase tracking-wide text-[var(--token-muted, var(--style-text-muted,var(--style-text-secondary,#9ca3af)))]"><span className="h-px w-8 bg-[var(--token-card-border, var(--style-border-color,#d1d5db))]" />{badgeText}</div>}
        {headline && <h2 className="text-4xl font-light tracking-tight text-[var(--token-heading, var(--style-heading-color,var(--style-text-primary,#111827)))] md:text-5xl lg:text-3xl" data-edit-path="headline">{headline}</h2>}
      </motion.div>
      <div className="divide-y divide-[var(--token-card-border, var(--style-border-color,rgba(0,0,0,0.08)))]">
        {items.map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.4, delay: i * 0.08 }}>
            <FaqItemModern question={item.question} answer={plain(item.answer)} defaultOpen={expandFirst && i === 0} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function FaqItemModern({ question, answer, defaultOpen }: { question: string; answer: string; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="py-6">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between gap-4 text-left font-medium text-[var(--token-heading, var(--style-heading-color,var(--style-text-primary,#111827)))] transition-colors hover:text-[var(--style-accent-color,var(--token-icon, var(--brand-primary)))]">
        {question}
        <Plus size={16} className={cn('shrink-0 text-[var(--token-muted, var(--style-text-muted,var(--style-text-secondary,#d1d5db)))] transition-transform', open && 'rotate-45')} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
            <p className="mt-4 text-[15px] leading-relaxed text-[var(--token-body, var(--style-body-color,var(--style-text-secondary,#9ca3af)))]" data-edit-path="answer">{plain(answer)}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── BOLD: Thick borders, angular, numbered ─── */
function FaqBold({ headline, badgeText, items, expandFirst }: FProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <div ref={ref} className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="mb-10">
        {badgeText && <span className="mb-4 inline-block bg-[var(--token-badge-bg, var(--style-badge-bg,var(--style-accent-color,var(--token-eyebrow, var(--brand-accent)))))] px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-[var(--token-badge-text, var(--style-badge-text,var(--token-section-bg-alt, var(--brand-dark))))]">{badgeText}</span>}
        {headline && <h2 className="text-3xl font-black uppercase tracking-tight text-[var(--token-heading, var(--style-heading-color,var(--style-text-primary,#111827)))] lg:text-4xl" data-edit-path="headline">{headline}</h2>}
      </motion.div>
      <div className="space-y-3">
        {items.map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4, delay: i * 0.08 }}>
            <FaqItemBold question={item.question} answer={plain(item.answer)} defaultOpen={expandFirst && i === 0} num={i + 1} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function FaqItemBold({ question, answer, defaultOpen, num }: { question: string; answer: string; defaultOpen: boolean; num: number }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={cn('border-3 border-[var(--token-card-border, var(--style-border-color,var(--style-text-primary,#111827)))] transition-all', open ? 'shadow-[4px_4px_0_var(--style-accent-color,#f39c12)]' : 'shadow-[4px_4px_0_var(--style-text-primary,#0d2137)]')}>
      <button onClick={() => setOpen(!open)} className="flex w-full items-center gap-4 px-6 py-5 text-left text-sm font-bold uppercase tracking-wide text-[var(--token-heading, var(--style-heading-color,var(--style-text-primary,#111827)))]">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center bg-[var(--style-text-primary,var(--token-section-bg-alt, var(--brand-dark)))] text-xs font-black text-[var(--token-btn-text, var(--brand-btn-text,#ffffff))]">{num}</span>
        <span className="flex-1" data-edit-path="question">{question}</span>
        <Minus size={16} className={cn('shrink-0 transition-transform', !open && 'rotate-90')} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
            <div className="border-t-2 border-[var(--token-card-border, var(--style-border-color,rgba(0,0,0,0.12)))] px-6 pb-5 pt-4 leading-relaxed text-[var(--token-body, var(--style-body-color,var(--style-text-secondary,#4b5563)))]">{plain(answer)}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
