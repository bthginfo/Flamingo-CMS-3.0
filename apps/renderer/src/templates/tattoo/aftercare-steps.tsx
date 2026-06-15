'use client';

import { motion } from 'framer-motion';
import { plain } from '@/lib/strip-html';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

type Step = { title: string; description: string };

export function AftercarStepsSection({ data }: Props) {
  const headline = (data.headline as string) || 'Nachsorge';
  const subline = (data.subline as string) || '';
  const steps = (data.steps as Step[]) || [];

  return (
    <section className="py-20 px-6 bg-[var(--token-section-bg-alt)]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-[color:var(--token-on-dark-heading)]" data-edit-path="headline">{headline}</h2>
          {subline && <p className="mt-3 text-[color:color-mix(in_srgb,var(--token-on-dark-heading)_50%,transparent)]" data-edit-path="subline">{plain(subline)}</p>}
        </div>

        <div className="space-y-6">
          {steps.map((step, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="flex gap-5 items-start" data-edit-collection="steps" data-edit-index={i}>
              <div className="shrink-0 w-10 h-10 rounded-full bg-[color-mix(in_srgb,var(--token-card-bg)_10%,transparent)] border border-[color:color-mix(in_srgb,var(--token-card-border)_20%,transparent)] flex items-center justify-center text-[color:var(--token-on-dark-heading)] font-bold text-sm">
                {i + 1}
              </div>
              <div>
                <h3 className="text-[color:var(--token-on-dark-heading)] font-semibold" data-edit-path="title">{step.title}</h3>
                <p className="text-[color:color-mix(in_srgb,var(--token-on-dark-heading)_50%,transparent)] text-sm mt-1" data-edit-path="description">{plain(step.description)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
