'use client';

import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { DynamicIcon } from '@/components/ui/icon-map';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function ProcessStepsSection({ data, styleVariant }: Props) {
  const headline = (data.headline as string) || '';
  const badgeText = (data.badgeText as string) || '';
  const steps = (data.steps as { title: string; text: string; icon?: string }[]) || [];

  if (styleVariant === 'modern') return <ProcessModern headline={headline} badgeText={badgeText} steps={steps} />;
  if (styleVariant === 'bold') return <ProcessBold headline={headline} badgeText={badgeText} steps={steps} />;
  return <ProcessClassic headline={headline} badgeText={badgeText} steps={steps} />;
}

type PProps = { headline: string; badgeText: string; steps: { title: string; text: string; icon?: string }[] };

/* ─── CLASSIC: Timeline with animated progress line, rounded cards, gradient bg ─── */
function ProcessClassic({ headline, badgeText, steps }: PProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const lineHeight = useTransform(scrollYProgress, [0.1, 0.8], ['0%', '100%']);

  return (
    <div ref={ref} className="relative">
      <div className="absolute inset-0 bg-[radial-gradient(var(--token-muted, var(--style-text-muted,#e5e7eb))_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.15] rounded-4xl" />
      <div className="relative rounded-4xl p-8 sm:p-12 lg:p-20" style={{ background: 'var(--token-card-bg, var(--style-card-bg, linear-gradient(to bottom right, var(--surface, #f8fafc), white)))', borderColor: 'color-mix(in srgb, var(--style-text-primary, #111) 8%, transparent)', borderWidth: '1px' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-10 md:mb-16">
          {badgeText && <div className="section-badge"><span>{badgeText}</span></div>}
          {headline && <h2 className="section-headline">{headline}</h2>}
        </motion.div>
        <div className="relative max-w-4xl mx-auto">
          <div className="absolute bottom-0 left-[31px] top-0 hidden w-[2px] bg-[var(--token-card-border, var(--style-border-color,#e5e7eb))] md:block">
            <motion.div style={{ height: lineHeight }} className="w-full rounded-full bg-[var(--style-accent-color,var(--token-icon, var(--brand-primary)))]" />
          </div>
          <div className="space-y-12">
            {steps.map((step, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.5, delay: i * 0.15 }} className="flex gap-8 md:gap-12 items-start group">
                <div className="shrink-0 relative z-10">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--token-card-border, var(--style-border-color,rgba(0,0,0,0.08)))] bg-[var(--token-card-bg, var(--style-card-bg,#ffffff))] shadow-lg transition-all group-hover:scale-110 group-hover:shadow-glow">
                    {step.icon ? <DynamicIcon name={step.icon} size={24} className="text-[var(--token-icon, var(--style-icon-color,var(--style-accent-color,var(--token-icon, var(--brand-primary)))))]" /> : <span className="text-lg font-bold text-[var(--style-accent-color,var(--token-icon, var(--brand-primary)))]">{i + 1}</span>}
                  </div>
                </div>
                <div className="pt-3">
                  <h3 className="font-display mb-2 text-xl font-bold text-[var(--token-heading, var(--style-heading-color,var(--style-text-primary,#111827)))]">{step.title}</h3>
                  <div className="rt-content leading-relaxed text-[var(--token-body, var(--style-body-color,var(--style-text-secondary,#6b7280)))]" dangerouslySetInnerHTML={{ __html: step.text }} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── MODERN: Numbered list, clean lines, generous spacing ─── */
function ProcessModern({ headline, badgeText, steps }: PProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <div ref={ref}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="mb-12 md:mb-20">
        {badgeText && <div className="mb-4 flex items-center gap-3 text-sm uppercase tracking-wide text-[var(--token-muted, var(--style-text-muted,var(--style-text-secondary,#9ca3af)))]"><span className="h-px w-8 bg-[var(--token-card-border, var(--style-border-color,#d1d5db))]" />{badgeText}</div>}
        {headline && <h2 className="text-4xl font-light tracking-tight text-[var(--token-heading, var(--style-heading-color,var(--style-text-primary,#111827)))] md:text-5xl lg:text-3xl">{headline}</h2>}
      </motion.div>
      <div className="max-w-3xl mx-auto space-y-0">
        {steps.map((step, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: i * 0.1 }}
            className="flex gap-8 border-b border-[var(--token-card-border, var(--style-border-color,rgba(0,0,0,0.08)))] py-10 last:border-b-0">
            <div className="shrink-0 text-3xl font-extralight text-[var(--token-muted, var(--style-text-muted,#e5e7eb))] md:text-5xl">{String(i + 1).padStart(2, '0')}</div>
            <div>
              <h3 className="mb-2 text-lg font-medium text-[var(--token-heading, var(--style-heading-color,var(--style-text-primary,#111827)))]">{step.title}</h3>
              <div className="rt-content leading-relaxed text-[var(--token-body, var(--style-body-color,var(--style-text-secondary,#9ca3af)))]" dangerouslySetInnerHTML={{ __html: step.text }} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ─── BOLD: Horizontal steps, numbered blocks, thick accents ─── */
function ProcessBold({ headline, badgeText, steps }: PProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <div ref={ref}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="mb-10">
        {badgeText && <span className="mb-4 inline-block bg-[var(--token-badge-bg, var(--style-badge-bg,var(--style-accent-color,var(--token-eyebrow, var(--brand-accent)))))] px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-[var(--token-badge-text, var(--style-badge-text,var(--token-section-bg-alt, var(--brand-dark))))]">{badgeText}</span>}
        {headline && <h2 className="text-3xl font-black uppercase tracking-tight text-[var(--token-heading, var(--style-heading-color,var(--style-text-primary,#111827)))] lg:text-4xl">{headline}</h2>}
      </motion.div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {steps.map((step, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4, delay: i * 0.1 }}
            className="relative border-3 border-[var(--token-card-border, var(--style-border-color,var(--style-text-primary,#111827)))] bg-[var(--token-card-bg, var(--style-card-bg,#ffffff))] p-6 shadow-[4px_4px_0_var(--style-text-primary,#0d2137)]">
            <div className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center bg-[var(--style-accent-color,var(--token-eyebrow, var(--brand-accent)))] text-sm font-black text-[var(--token-badge-text, var(--style-badge-text,var(--token-section-bg-alt, var(--brand-dark))))]">
              {i + 1}
            </div>
            <div className="pt-6">
              <h3 className="mb-2 text-base font-bold uppercase tracking-wide text-[var(--token-heading, var(--style-heading-color,var(--style-text-primary,#111827)))]">{step.title}</h3>
              <div className="rt-content text-sm leading-relaxed text-[var(--token-body, var(--style-body-color,var(--style-text-secondary,#6b7280)))]" dangerouslySetInnerHTML={{ __html: step.text }} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
