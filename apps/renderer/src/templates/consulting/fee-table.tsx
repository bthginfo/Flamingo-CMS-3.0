'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { DynamicIcon } from '@/components/ui/icon-map';
import { plain } from '@/lib/strip-html';

type FeeItem = { title: string; price?: string; description?: string; icon?: string; highlighted?: boolean };
type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function FeeTableSection({ data }: Props) {
  const headline = (data.headline as string) || 'Honorar & Kosten';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || '';
  const fees = (data.fees as FeeItem[]) || [];
  const footnote = (data.footnote as string) || '';
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <div ref={ref}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="text-center mb-12">
        {badgeText && <div className="section-badge"><span data-edit-path="badgeText">{badgeText}</span></div>}
        {headline && <h2 className="section-headline" data-edit-path="headline">{headline}</h2>}
        {subline && <p className="section-subline" data-edit-path="subline">{plain(subline)}</p>}
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {fees.map((fee, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.1 }}
            className={`relative p-8 rounded-xl border ${fee.highlighted ? 'border-[var(--token-card-border)] bg-[color-mix(in_srgb,var(--token-btn-bg)_5%,transparent)] ring-1 ring-brand-primary/20' : 'border-[color:var(--token-card-border)] bg-[var(--token-card-bg)]'} text-center`}
           data-edit-collection="fees" data-edit-index={i}>
            {fee.highlighted && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--token-btn-bg)] text-[color:var(--token-on-dark-heading)] text-xs font-semibold px-3 py-1 rounded-full">Empfohlen</div>
            )}
            {fee.icon && (
              <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-[color-mix(in_srgb,var(--token-btn-bg)_10%,transparent)] flex items-center justify-center text-[color:var(--token-icon)]">
                <DynamicIcon editPath="icon" name={fee.icon} size={24} />
              </div>
            )}
            <h3 className="text-lg font-semibold text-[color:var(--token-heading)] mb-2" data-edit-path="title">{fee.title}</h3>
            {fee.price && <div className="text-2xl font-bold text-[color:var(--token-icon)] mb-3" data-edit-path="price">{fee.price}</div>}
            {fee.description && <p className="text-[color:var(--token-muted)] text-sm leading-relaxed" data-edit-path="description">{plain(fee.description)}</p>}
          </motion.div>
        ))}
      </div>
      {footnote && (
        <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.4 }} className="text-center text-xs text-[color:var(--token-body)] mt-8 max-w-2xl mx-auto">
          {footnote}
        </motion.p>
      )}
    </div>
  );
}
