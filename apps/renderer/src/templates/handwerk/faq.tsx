'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = { data: Record<string, unknown>; variant?: string | null };

export function FaqSection({ data }: Props) {
  const headline = (data.headline as string) || '';
  const items = (data.items as { question: string; answer: string }[]) || [];
  const expandFirst = data.expandFirst !== false;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <div ref={ref} className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-14"
      >
        <div className="section-badge">
          <HelpCircle size={14} />
          <span>Häufige Fragen</span>
        </div>
        {headline && <h2 className="section-headline">{headline}</h2>}
      </motion.div>

      <div className="space-y-3">
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            <FaqItem question={item.question} answer={item.answer} defaultOpen={expandFirst && i === 0} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function FaqItem({ question, answer, defaultOpen }: { question: string; answer: string; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={cn(
      'rounded-2xl border transition-all duration-300 overflow-hidden',
      open ? 'bg-white shadow-lg border-gray-200' : 'bg-white/50 border-gray-100 hover:bg-white hover:shadow-sm',
    )}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-7 py-6 font-display font-semibold text-[16px] flex justify-between items-center gap-4 transition-colors"
      >
        <span className="text-gray-900">{question}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className={cn('shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors', open ? 'bg-brand-primary text-white' : 'bg-gray-100 text-gray-400')}
        >
          <ChevronDown size={16} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="px-7 pb-6 text-slate-500 leading-relaxed text-[15px]">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
