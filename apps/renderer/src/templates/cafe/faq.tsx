'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { plain } from '@/lib/strip-html';

type FaqItem = { question: string; answer: string };
type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function CafeFaqSection({ data }: Props) {
  const headline = (data.headline as string) || 'FAQ';
  const items = (data.items as FaqItem[]) || [];
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section ref={ref} className="py-20 md:py-28 bg-[var(--token-section-bg-alt,#fafafa)]">
      <div className="max-w-3xl mx-auto px-6">
        <motion.h2 initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} className="text-3xl font-bold text-[color:var(--token-heading,#18181b)] text-center mb-10">{headline}</motion.h2>
        <div className="space-y-3">
          {items.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: i * 0.05 }} className="bg-[var(--token-card-bg,#ffffff)] rounded-lg border border-[color:var(--token-card-border,#f4f4f5)]" data-edit-collection="items" data-edit-index={i}>
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left">
                <span className="font-medium text-[color:var(--token-heading,#18181b)] pr-4" data-edit-path="question">{item.question}</span>
                {open === i ? <Minus size={18} className="text-[color:var(--token-icon,var(--brand-primary,#1a5276))] shrink-0" /> : <Plus size={18} className="text-[color:var(--token-body,#a1a1aa)] shrink-0" />}
              </button>
              {open === i && <div className="px-5 pb-5 text-[color:var(--token-muted,#52525b)] text-sm leading-relaxed">{plain(item.answer)}</div>}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
