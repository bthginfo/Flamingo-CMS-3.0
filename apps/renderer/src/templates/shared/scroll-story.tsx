'use client';

import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';
import { useMemo, useRef, useState } from 'react';
import { plain } from '@/lib/strip-html';

type Step = { kicker?: string; title: string; text?: string; image?: string };
type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function ScrollStorySection({ data }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const headline = (data.headline as string) || '';
  const subline = (data.subline as string) || '';
  const steps = useMemo(
    () =>
      ((data.steps as Step[]) || []).filter(
        (step) => Boolean(step?.title || step?.text || step?.image || step?.kicker),
      ),
    [data.steps],
  );
  const activeStep = steps[Math.min(activeIndex, steps.length - 1)] || steps[0];
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const progress = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (steps.length <= 1) return;
    const next = Math.min(steps.length - 1, Math.max(0, Math.floor(latest * steps.length)));
    setActiveIndex(next);
  });

  if (!steps.length) return null;
  const scrollHeight = steps.length > 1 ? `${Math.max(steps.length * 64, 150)}vh` : undefined;

  return (
    <div ref={ref} className="relative" style={{ minHeight: scrollHeight }}>
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div className="lg:sticky lg:top-24 lg:flex lg:h-[calc(100vh-7rem)] lg:flex-col lg:justify-center">
          {headline && (
            <h2 className="section-headline text-left" data-edit-path="headline">
              {headline}
            </h2>
          )}
          {subline && (
            <p className="section-subline mx-0 text-left" data-edit-path="subline">
              {plain(subline)}
            </p>
          )}

          <div className="mt-8 h-1 overflow-hidden rounded-full bg-[color:color-mix(in_srgb,var(--token-icon)_14%,var(--token-card-bg,#fff))]">
            <motion.div className="h-full rounded-full bg-[var(--token-icon)]" style={{ width: progress }} />
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {steps.map((step, index) => (
              <button
                key={`${step.title}-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`h-2.5 rounded-full transition-all ${
                  index === activeIndex
                    ? 'w-10 bg-[var(--token-icon)]'
                    : 'w-2.5 bg-[color:color-mix(in_srgb,var(--token-icon)_24%,transparent)]'
                }`}
                aria-label={`Schritt ${index + 1} anzeigen`}
              />
            ))}
          </div>

          <div className="mt-8 hidden overflow-hidden rounded-[var(--token-card-radius)] border border-[var(--token-card-border)] bg-[var(--token-card-bg)] shadow-sm lg:block">
            {activeStep.image && (
              <motion.img
                key={activeStep.image}
                src={activeStep.image}
                alt=""
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35 }}
                className="h-56 w-full object-cover"
              />
            )}
            <motion.div
              key={`${activeIndex}-${activeStep.title}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28 }}
              className="p-6"
            >
              <div className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-[var(--token-icon)]">
                {activeStep.kicker || String(activeIndex + 1).padStart(2, '0')}
              </div>
              <h3 className="text-2xl font-bold text-[var(--token-heading)]">{activeStep.title}</h3>
              {activeStep.text && <p className="mt-3 leading-7 text-[var(--token-body)]">{plain(activeStep.text)}</p>}
            </motion.div>
          </div>
        </div>

        <div className="space-y-6 lg:py-[10vh]">
          {steps.map((step, i) => (
            <motion.article
              key={`${step.title}-${i}`}
              initial={{ opacity: 0.45, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ margin: '-30% 0px -30% 0px' }}
              onViewportEnter={() => setActiveIndex(i)}
              className={`overflow-hidden rounded-[var(--token-card-radius)] border bg-[var(--token-card-bg)] shadow-sm transition-colors duration-300 lg:min-h-[52vh] ${
                activeIndex === i ? 'border-[var(--token-icon)]' : 'border-[var(--token-card-border)]'
              }`}
              data-edit-collection="steps"
              data-edit-index={i}
            >
              {step.image && <img data-edit-image="image" src={step.image} alt="" className="h-64 w-full object-cover" />}
              <div className="p-6 md:p-8">
                <div className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-[var(--token-icon)]" data-edit-path="kicker">
                  {step.kicker || String(i + 1).padStart(2, '0')}
                </div>
                <h3 className="text-2xl font-bold text-[var(--token-heading)]" data-edit-path="title">
                  {step.title}
                </h3>
                {step.text && (
                  <p className="mt-3 leading-7 text-[var(--token-body)]" data-edit-path="text">
                    {plain(step.text)}
                  </p>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}
