'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ChevronDown, HelpCircle, Plus, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

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
        {headline && <h2 className="section-headline">{headline}</h2>}
      </motion.div>
      <div className="space-y-3">
        {items.map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4, delay: i * 0.08 }}>
            <FaqItemClassic question={item.question} answer={item.answer} defaultOpen={expandFirst && i === 0} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function FaqItemClassic({ question, answer, defaultOpen }: { question: string; answer: string; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={cn('rounded-2xl border transition-all duration-300 overflow-hidden', open ? 'bg-white shadow-lg border-gray-200' : 'bg-white/50 border-gray-100 hover:bg-white hover:shadow-sm')}>
      <button onClick={() => setOpen(!open)} className="w-full text-left px-7 py-6 font-display font-semibold text-[16px] flex justify-between items-center gap-4">
        {question}
        <ChevronDown size={18} className={cn('shrink-0 transition-transform text-gray-400', open && 'rotate-180')} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
            <div className="px-7 pb-6 text-gray-500 leading-relaxed">{answer}</div>
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
      <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="mb-16">
        {badgeText && <div className="flex items-center gap-3 text-sm text-gray-400 mb-4 tracking-wide uppercase"><span className="w-8 h-px bg-gray-300" />{badgeText}</div>}
        {headline && <h2 className="text-4xl lg:text-5xl font-light text-gray-900 tracking-tight">{headline}</h2>}
      </motion.div>
      <div className="divide-y divide-gray-100">
        {items.map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.4, delay: i * 0.08 }}>
            <FaqItemModern question={item.question} answer={item.answer} defaultOpen={expandFirst && i === 0} />
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
      <button onClick={() => setOpen(!open)} className="w-full text-left font-medium text-gray-900 flex justify-between items-center gap-4 hover:text-brand-primary transition-colors">
        {question}
        <Plus size={16} className={cn('shrink-0 text-gray-300 transition-transform', open && 'rotate-45')} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
            <p className="text-gray-400 leading-relaxed mt-4 text-[15px]">{answer}</p>
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
        {badgeText && <span className="inline-block bg-brand-accent text-brand-dark font-bold text-xs uppercase tracking-widest px-3 py-1.5 mb-4">{badgeText}</span>}
        {headline && <h2 className="text-3xl lg:text-4xl font-black uppercase tracking-tight">{headline}</h2>}
      </motion.div>
      <div className="space-y-3">
        {items.map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4, delay: i * 0.08 }}>
            <FaqItemBold question={item.question} answer={item.answer} defaultOpen={expandFirst && i === 0} num={i + 1} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function FaqItemBold({ question, answer, defaultOpen, num }: { question: string; answer: string; defaultOpen: boolean; num: number }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={cn('border-3 border-gray-900 transition-all', open ? 'shadow-[4px_4px_0_#f39c12]' : 'shadow-[4px_4px_0_#0d2137]')}>
      <button onClick={() => setOpen(!open)} className="w-full text-left px-6 py-5 font-bold uppercase tracking-wide text-sm flex items-center gap-4">
        <span className="shrink-0 w-7 h-7 bg-brand-dark text-white text-xs flex items-center justify-center font-black">{num}</span>
        <span className="flex-1">{question}</span>
        <Minus size={16} className={cn('shrink-0 transition-transform', !open && 'rotate-90')} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
            <div className="px-6 pb-5 text-gray-600 leading-relaxed border-t-2 border-gray-200 pt-4">{answer}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
