'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { plain } from '@/lib/strip-html';

type Step = { kicker?: string; title: string; text?: string; image?: string };
type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function ScrollStorySection({ data }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const headline = (data.headline as string) || '';
  const subline = (data.subline as string) || '';
  const steps = (data.steps as Step[]) || [];
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 80%', 'end 20%'] });
  const progress = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  if (!steps.length) return null;

  return (
    <div ref={ref} className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
      <div className="lg:sticky lg:top-28 lg:h-fit">
        {headline && <h2 className="section-headline text-left">{headline}</h2>}
        {subline && <p className="section-subline mx-0 text-left">{plain(subline)}</p>}
        <div className="mt-8 h-1 overflow-hidden rounded-full bg-[var(--style-card-bg,#e5e7eb)]">
          <motion.div className="h-full rounded-full bg-[var(--brand-primary)]" style={{ width: progress }} />
        </div>
      </div>
      <div className="space-y-6">
        {steps.map((step, i) => (
          <motion.article key={i} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-120px' }} className="overflow-hidden rounded-[var(--style-card-radius,1rem)] border border-[var(--style-border-color,rgba(0,0,0,0.08))] bg-[var(--style-card-bg,#fff)] shadow-sm">
            {step.image && <img src={step.image} alt="" className="h-64 w-full object-cover" />}
            <div className="p-6 md:p-8">
              <div className="mb-3 text-xs font-bold uppercase text-[var(--brand-primary)]">{step.kicker || String(i + 1).padStart(2, '0')}</div>
              <h3 className="text-2xl font-bold text-[var(--style-heading-color,var(--style-text-primary,#111))]">{step.title}</h3>
              {step.text && <p className="mt-3 leading-7 text-[var(--style-body-color,var(--style-text-secondary,#52525b))]">{plain(step.text)}</p>}
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
