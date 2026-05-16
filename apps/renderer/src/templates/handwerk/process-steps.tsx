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
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-40 rounded-4xl" />
      <div className="relative bg-gradient-to-br from-surface to-white rounded-4xl p-8 sm:p-12 lg:p-20 border border-gray-100/50">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-10 md:mb-16">
          {badgeText && <div className="section-badge"><span>{badgeText}</span></div>}
          {headline && <h2 className="section-headline">{headline}</h2>}
        </motion.div>
        <div className="relative max-w-4xl mx-auto">
          <div className="absolute left-[31px] top-0 bottom-0 w-[2px] bg-gray-200 hidden md:block">
            <motion.div style={{ height: lineHeight }} className="w-full bg-gradient-to-b from-brand-primary via-brand-accent to-brand-secondary rounded-full" />
          </div>
          <div className="space-y-12">
            {steps.map((step, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.5, delay: i * 0.15 }} className="flex gap-8 md:gap-12 items-start group">
                <div className="shrink-0 relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-white shadow-lg border border-gray-100 flex items-center justify-center group-hover:shadow-glow group-hover:scale-110 transition-all">
                    {step.icon ? <DynamicIcon name={step.icon} size={24} className="text-brand-primary" /> : <span className="font-bold text-brand-primary text-lg">{i + 1}</span>}
                  </div>
                </div>
                <div className="pt-3">
                  <h3 className="font-display font-bold text-xl mb-2">{step.title}</h3>
                  <div className="text-gray-500 leading-relaxed rt-content" dangerouslySetInnerHTML={{ __html: step.text }} />
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
        {badgeText && <div className="flex items-center gap-3 text-sm text-gray-400 mb-4 tracking-wide uppercase"><span className="w-8 h-px bg-gray-300" />{badgeText}</div>}
        {headline && <h2 className="text-4xl lg:text-3xl md:text-5xl font-light text-gray-900 tracking-tight">{headline}</h2>}
      </motion.div>
      <div className="max-w-3xl mx-auto space-y-0">
        {steps.map((step, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: i * 0.1 }}
            className="flex gap-8 py-10 border-b border-gray-100 last:border-b-0">
            <div className="shrink-0 text-3xl md:text-5xl font-extralight text-gray-200">{String(i + 1).padStart(2, '0')}</div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">{step.title}</h3>
              <div className="text-gray-400 leading-relaxed rt-content" dangerouslySetInnerHTML={{ __html: step.text }} />
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
        {badgeText && <span className="inline-block bg-brand-accent text-brand-dark font-bold text-xs uppercase tracking-widest px-3 py-1.5 mb-4">{badgeText}</span>}
        {headline && <h2 className="text-3xl lg:text-4xl font-black uppercase tracking-tight">{headline}</h2>}
      </motion.div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {steps.map((step, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4, delay: i * 0.1 }}
            className="relative p-6 border-3 border-gray-900 bg-white shadow-[4px_4px_0_#0d2137]">
            <div className="absolute top-0 left-0 bg-brand-accent text-brand-dark font-black text-sm w-8 h-8 flex items-center justify-center">
              {i + 1}
            </div>
            <div className="pt-6">
              <h3 className="font-bold uppercase tracking-wide text-base mb-2">{step.title}</h3>
              <div className="text-gray-500 text-sm leading-relaxed rt-content" dangerouslySetInnerHTML={{ __html: step.text }} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
