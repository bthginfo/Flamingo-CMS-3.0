'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { useState } from 'react';
import { plain } from '@/lib/strip-html';

type FaqItem = { question: string; answer: string };

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function RealestateFaqSection({ data }: Props) {
  const headline = (data.headline as string) || 'Häufige Fragen';
  const subline = (data.subline as string) || '';
  const items = (data.items as FaqItem[]) || [];

  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section ref={ref} className="py-20 md:py-28 bg-[var(--token-section-bg-alt)]">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[color:var(--token-heading)]" data-edit-path="headline">{headline}</h2>
          {subline && <p className="text-lg text-[color:var(--token-muted)] mt-4" data-edit-path="subline">{plain(subline)}</p>}
        </motion.div>

        <div className="space-y-3">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.05 }}
              className="bg-[var(--token-card-bg)] rounded-lg border border-[color:var(--token-card-border)] overflow-hidden"
             data-edit-collection="items" data-edit-index={i}>
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="font-medium text-[color:var(--token-heading)] pr-4" data-edit-path="question">{item.question}</span>
                {openIndex === i ? <Minus size={18} className="text-[color:var(--token-icon)] shrink-0" /> : <Plus size={18} className="text-[color:var(--token-body)] shrink-0" />}
              </button>
              {openIndex === i && (
                <div className="px-5 pb-5 text-[color:var(--token-muted)] text-sm leading-relaxed" data-edit-path="answer">
                  {plain(item.answer)}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
