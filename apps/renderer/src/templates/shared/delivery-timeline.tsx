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
          {headline && <h2 className="font-display text-3xl md:text-4xl font-[var(--style-heading-weight,700)] tracking-[var(--style-heading-tracking,-0.02em)] text-[var(--style-text-primary,#0f172a)]" data-edit-path="headline">{headline}</h2>}
          {subline && <p className="mt-3 text-[var(--style-text-secondary,#64748b)] text-lg max-w-2xl mx-auto" data-edit-path="subline">{plain(subline)}</p>}
        </div>
      )}

      <div className="relative">
        {/* Connecting line */}
        <div className="absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[var(--token-icon, var(--brand-primary,#2563eb))]/20 to-transparent hidden md:block" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-4">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="text-center relative"
            >
              {/* Step circle */}
              <div className="relative mx-auto w-24 h-24 rounded-full bg-[var(--token-icon, var(--brand-primary,#2563eb))]/5 border-2 border-[var(--token-icon, var(--brand-primary,#2563eb))]/20 flex flex-col items-center justify-center mb-5">
                {step.icon ? (
                  <DynamicIcon name={step.icon} size={28} className="text-[var(--token-icon, var(--brand-primary,#2563eb))]" />
                ) : (
                  <span className="text-2xl font-bold text-[var(--token-icon, var(--brand-primary,#2563eb))]">{step.number || i + 1}</span>
                )}
              </div>

              {/* Arrow between steps (desktop) */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 -right-2 text-[var(--token-icon, var(--brand-primary,#2563eb))]/30 text-xl">→</div>
              )}

              <h3 className="font-display font-semibold text-lg text-[var(--style-text-primary,#0f172a)] mb-2" data-edit-path="title">{step.title}</h3>
              {step.text && <p className="text-sm text-[var(--style-text-secondary,#64748b)] max-w-[200px] mx-auto" data-edit-path="text">{plain(step.text)}</p>}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
