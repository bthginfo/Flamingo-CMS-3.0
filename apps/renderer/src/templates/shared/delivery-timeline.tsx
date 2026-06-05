'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { DynamicIcon } from '@/components/ui/icon-map';
import { plain } from '@/lib/strip-html';

type Step = {
  number?: string;
  icon?: string;
  title: string;
  text?: string;
};

type Props = { data: Record<string, unknown>; variant?: string | null };

export function DeliveryTimelineSection({ data }: Props) {
  const headline = (data.headline as string) || '';
  const subline = (data.subline as string) || '';
  const steps = (data.steps as Step[]) || [];
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <div ref={ref}>
      {(headline || subline) && (
        <div className="text-center mb-12">
          {headline && <h2 className="font-display text-3xl md:text-4xl font-[var(--token-heading-weight,700)] tracking-[var(--token-heading-tracking,-0.02em)] text-[var(--token-body)]" data-edit-path="headline">{headline}</h2>}
          {subline && <p className="mt-3 text-[var(--token-body)] text-lg max-w-2xl mx-auto" data-edit-path="subline">{plain(subline)}</p>}
        </div>
      )}

      <div className="relative">
        {/* Connecting line */}
        <div className="absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[color-mix(in_srgb,var(--token-icon)_20%,transparent)] to-transparent hidden md:block" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-4">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="text-center relative"
             data-edit-collection="steps" data-edit-index={i}>
              {/* Step circle */}
              <div className="relative mx-auto w-24 h-24 rounded-full bg-[color-mix(in_srgb,var(--token-icon)_5%,transparent)] border-2 border-[color-mix(in_srgb,var(--token-icon)_20%,transparent)] flex flex-col items-center justify-center mb-5">
                {step.icon ? (
                  <DynamicIcon editPath="icon" name={step.icon} size={28} className="text-[var(--token-icon)]" />
                ) : (
                  <span className="text-2xl font-bold text-[var(--token-icon)]">{step.number || i + 1}</span>
                )}
              </div>

              {/* Arrow between steps (desktop) */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 -right-2 text-[color-mix(in_srgb,var(--token-icon)_30%,transparent)] text-xl">→</div>
              )}

              <h3 className="font-display font-semibold text-lg text-[var(--token-body)] mb-2" data-edit-path="title">{step.title}</h3>
              {step.text && <p className="text-sm text-[var(--token-body)] max-w-[200px] mx-auto" data-edit-path="text">{plain(step.text)}</p>}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
