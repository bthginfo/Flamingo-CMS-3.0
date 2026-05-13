'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { AnimateOnScroll, StaggerOnScroll, fadeUp } from '@/components/animate';

type Props = { data: Record<string, unknown>; variant?: string | null };

export function FaqSection({ data }: Props) {
  const headline = (data.headline as string) || '';
  const items = (data.items as { question: string; answer: string }[]) || [];
  const expandFirst = data.expandFirst !== false;

  return (
    <div className="bg-surface rounded-3xl p-8 sm:p-12 lg:p-16">
      <AnimateOnScroll className="text-center mb-12">
        {headline && <h2 className="section-headline">{headline}</h2>}
      </AnimateOnScroll>
      <StaggerOnScroll className="max-w-3xl mx-auto space-y-3">
        {items.map((item, i) => (
          <AnimateOnScroll key={i} variants={fadeUp}>
            <FaqItem question={item.question} answer={item.answer} defaultOpen={expandFirst && i === 0} />
          </AnimateOnScroll>
        ))}
      </StaggerOnScroll>
    </div>
  );
}

function FaqItem({ question, answer, defaultOpen }: { question: string; answer: string; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-6 py-5 font-display font-semibold text-[15px] flex justify-between items-center gap-4 hover:bg-gray-50/50 transition-colors"
      >
        <span>{question}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="shrink-0 text-gray-400"
        >
          <ChevronDown size={20} />
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
            <div className="px-6 pb-5 text-gray-500 leading-relaxed text-[15px] border-t border-gray-50 pt-4">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
