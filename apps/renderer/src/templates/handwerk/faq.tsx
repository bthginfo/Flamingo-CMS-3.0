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
  const subline = (data.subline as string) || '';
  const items = (data.items as { question: string; answer: string }[]) || [];
  const expandFirst = data.expandFirst !== false;

  return <FaqClassic headline={headline} subline={subline} badgeText={badgeText} items={items} expandFirst={expandFirst} />;
}

type FProps = { headline: string; subline?: string; badgeText: string; items: { question: string; answer: string }[]; expandFirst: boolean };

/* ─── CLASSIC: Rounded cards, soft shadow, chevron icon ─── */
function FaqClassic({ headline, subline, badgeText, items, expandFirst }: FProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <div ref={ref} className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-14">
        {badgeText && <div className="section-badge"><HelpCircle size={14} /><span data-edit-path="badgeText">{badgeText}</span></div>}
        {headline && <h2 className="section-headline" data-edit-path="headline">{headline}</h2>}
        {subline && <p className="section-subline max-w-2xl mx-auto" data-edit-path="subline">{plain(subline)}</p>}
      </motion.div>
      <div className="space-y-3">
        {items.map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4, delay: i * 0.08 }} data-edit-collection="items" data-edit-index={i}>
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
    <div className={cn('overflow-hidden rounded-2xl border transition-all duration-300', open ? 'border-[var(--token-card-border)] bg-[var(--token-card-bg)] shadow-lg' : 'border-[var(--token-card-border)] bg-[var(--token-card-bg)] hover:shadow-sm')}>
      <button onClick={() => setOpen(!open)} className="font-display flex w-full items-center justify-between gap-4 px-7 py-6 text-left text-[16px] font-semibold text-[color:var(--token-heading)]">
        <span data-edit-path="question">{question}</span>
        <ChevronDown size={18} className={cn('shrink-0 text-[color:var(--token-muted)] transition-transform', open && 'rotate-180')} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
            <div className="px-7 pb-6 leading-relaxed text-[color:var(--token-body)]" data-edit-path="answer">{plain(answer)}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

