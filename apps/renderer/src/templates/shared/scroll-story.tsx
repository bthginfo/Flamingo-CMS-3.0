'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { plain } from '@/lib/strip-html';
import { ResilientImage } from '@/components/ui/resilient-image';
import { useHydrationSafeReducedMotion } from '@/lib/use-hydration-safe-reduced-motion';

type Step = { kicker?: string; title: string; text?: string; image?: string; imageAlt?: string; imagePosition?: string };
type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function ScrollStorySection({ data }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const headline = (data.headline as string) || '';
  const subline = (data.subline as string) || '';
  const steps = (data.steps as Step[]) || [];
  const showKickers = data.showKickers !== false;
  const reduceMotion = useHydrationSafeReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 80%', 'end 20%'] });
  const progress = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  if (!steps.length) return null;

  return (
    <div ref={ref} className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
      <div className="lg:sticky lg:top-28 lg:h-fit">
        {headline && <h2 className="section-headline text-left" data-edit-path="headline">{headline}</h2>}
        {subline && <p className="section-subline mx-0 text-left" data-edit-path="subline">{plain(subline)}</p>}
        <div className="mt-8 h-1 overflow-hidden rounded-full bg-[var(--token-card-bg)]">
          <motion.div className="h-full rounded-full bg-[var(--token-icon)]" style={{ width: progress }} />
        </div>
      </div>
      <div className="space-y-6">
        {steps.map((step, i) => (
          <motion.article key={i} initial={false} whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, margin: '-120px' }} className="overflow-hidden rounded-[var(--token-card-radius)] border border-[var(--token-card-border)] bg-[var(--token-card-bg)] shadow-sm transition-all duration-300 motion-safe:hover:-translate-y-1 hover:shadow-xl" data-card data-edit-collection="steps" data-edit-index={i}>
            {step.image && <ResilientImage data-edit-image="image" src={step.image} alt={step.imageAlt || step.title || ''} className="h-64 w-full object-cover" style={{ objectPosition: step.imagePosition || 'center' }} />}
            <div className="p-6 md:p-8">
              {showKickers && step.kicker && <div className="mb-3 text-xs font-bold uppercase text-[color:var(--token-eyebrow)]" data-edit-path="kicker">{step.kicker}</div>}
              <h3 className="text-2xl font-bold text-[color:var(--token-card-heading,var(--token-heading))]" data-edit-path="title">{step.title}</h3>
              {step.text && <p className="mt-3 leading-7 text-[color:var(--token-card-body,var(--token-body))]" data-edit-path="text">{plain(step.text)}</p>}
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
