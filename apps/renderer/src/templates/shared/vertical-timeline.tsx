'use client';

import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { plain } from '@/lib/strip-html';

type Step = {
  number?: string;
  timeLabel?: string;
  title: string;
  text?: string;
  checkmarks?: string[];
};

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function VerticalTimelineSection({ data }: Props) {
  const headline = (data.headline as string) || '';
  const subline = (data.subline as string) || '';
  const steps = (data.steps as Step[]) || [];
  const accentColor = (data.accentColor as string) || 'var(--token-icon)';
  const lineColor = (data.lineColor as string) || 'var(--token-divider)';
  const bgColor = (data.bgColor as string) || 'var(--token-section-bg)';
  const textColor = (data.textColor as string) || 'var(--token-body)';

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start 80%', 'end 60%'] });

  return (
    <section className="py-16 md:py-24" style={{ backgroundColor: bgColor, color: textColor }}>
      <div className="max-w-3xl mx-auto px-5">
        {(headline || subline) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            {headline && <h2 className="text-3xl md:text-4xl font-bold text-[color:var(--token-heading)]" data-edit-path="headline">{headline}</h2>}
            {subline && <p className="mt-3 max-w-xl mx-auto text-[color:var(--token-subheading)]" data-edit-path="subline">{plain(subline)}</p>}
          </motion.div>
        )}

        <div ref={containerRef} className="relative">
          {/* Animated progress line */}
          <div className="absolute left-6 md:left-8 top-0 bottom-0 w-0.5" style={{ backgroundColor: lineColor }}>
            <motion.div
              className="absolute inset-x-0 top-0 origin-top"
              style={{ scaleY: scrollYProgress, backgroundColor: accentColor, height: '100%' }}
            />
          </div>

          <div className="space-y-10 md:space-y-14">
            {steps.map((step, i) => (
              <TimelineStep key={i} step={step} index={i} total={steps.length} accentColor={accentColor}  data-edit-collection="steps" data-edit-index={i}/>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TimelineStep({ step, index, total, accentColor }: { step: Step; index: number; total: number; accentColor: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const number = step.number || String(index + 1).padStart(2, '0');

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="relative pl-16 md:pl-20"
    >
      {/* Dot */}
      <div
        className="absolute left-4 md:left-6 w-4 h-4 rounded-full border-[3px] bg-[var(--token-card-bg)] transition-colors duration-500"
        style={{ borderColor: isInView ? accentColor : '#d4d4d8' }}
      />

      {/* Content */}
      <div className="pb-2">
        <div className="flex items-baseline gap-3 mb-1">
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: accentColor }}>
            Schritt {number}/{String(total).padStart(2, '0')}
          </span>
        {step.timeLabel && <span className="text-xs text-[color:var(--token-muted)]">{step.timeLabel}</span>}
        </div>
        <h3 className="text-xl md:text-2xl font-bold mt-1" data-edit-path="title">{step.title}</h3>
        {step.text && <p className="mt-2 text-[color:var(--token-card-body, var(--token-body))] leading-relaxed" data-edit-path="text">{plain(step.text)}</p>}
        {step.checkmarks && step.checkmarks.length > 0 && (
          <ul className="mt-3 space-y-1.5">
            {step.checkmarks.map((item, j) => (
              <li key={j} className="flex items-center gap-2 text-sm text-[color:var(--token-card-body, var(--token-body))]" data-edit-collection="checkmarks" data-edit-index={j}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
                  <circle cx="8" cy="8" r="8" fill={accentColor} opacity={0.12} />
                  <path d="M5 8l2 2 4-4" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
}
