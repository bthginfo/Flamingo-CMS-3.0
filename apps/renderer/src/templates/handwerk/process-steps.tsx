'use client';

import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { DynamicIcon } from '@/components/ui/icon-map';
import { plain } from '@/lib/strip-html';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function ProcessStepsSection({ data, styleVariant }: Props) {
  const headline = (data.headline as string) || '';
  const badgeText = (data.badgeText as string) || '';
  const subline = (data.subline as string) || '';
  const steps = (data.steps as { title: string; text: string; icon?: string }[]) || [];

  return <ProcessClassic headline={headline} subline={subline} badgeText={badgeText} steps={steps} />;
}

type PProps = { headline: string; subline?: string; badgeText: string; steps: { title: string; text: string; icon?: string }[] };

/* ─── CLASSIC: Timeline with animated progress line, rounded cards, gradient bg ─── */
function ProcessClassic({ headline, subline, badgeText, steps }: PProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const lineHeight = useTransform(scrollYProgress, [0.1, 0.8], ['0%', '100%']);

  return (
    <div ref={ref} className="relative">
      <div className="absolute inset-0 bg-[radial-gradient(var(--token-muted)_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.15] rounded-4xl" />
      <div className="relative rounded-4xl p-8 sm:p-12 lg:p-20" style={{ background: 'var(--token-card-bg)', borderColor: 'color-mix(in srgb, var(--token-card-border) 36%, transparent)', borderWidth: '1px' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-10 md:mb-16">
          {badgeText && <div className="section-badge"><span data-edit-path="badgeText">{badgeText}</span></div>}
          {headline && <h2 className="section-headline" data-edit-path="headline">{headline}</h2>}
          {subline && <p className="section-subline max-w-2xl mx-auto" data-edit-path="subline">{plain(subline)}</p>}
        </motion.div>
        <div className="relative max-w-4xl mx-auto">
          <div className="absolute bottom-0 left-[31px] top-0 hidden w-[2px] bg-[var(--token-card-border)] md:block">
            <motion.div style={{ height: lineHeight }} className="w-full rounded-full bg-[var(--token-accent)]" />
          </div>
          <div className="space-y-12">
            {steps.map((step, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.5, delay: i * 0.15 }} className="flex gap-8 md:gap-12 items-start group" data-edit-collection="steps" data-edit-index={i}>
                <div className="shrink-0 relative z-10">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--token-card-border)] bg-[var(--token-card-bg)] shadow-lg transition-all group-hover:scale-110 group-hover:shadow-glow">
                    {step.icon ? <DynamicIcon editPath="icon" name={step.icon} size={24} className="text-[color:var(--token-icon)]" /> : <span className="text-lg font-bold text-[color:var(--token-accent)]">{i + 1}</span>}
                  </div>
                </div>
                <div className="pt-3">
                  <h3 className="font-display mb-2 text-xl font-bold text-[color:var(--token-heading)]" data-edit-path="title">{step.title}</h3>
                  <div className="rt-content leading-relaxed text-[color:var(--token-body)]" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: step.text }} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

