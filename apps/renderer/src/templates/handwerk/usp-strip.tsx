'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { cn } from '@/lib/utils';
import { DynamicIcon } from '@/components/ui/icon-map';

type Props = { data: Record<string, unknown>; variant?: string | null };

function CountUp({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      className="font-display font-bold text-4xl lg:text-3xl md:text-5xl text-[var(--style-accent-color,var(--brand-primary,#1a5276))]"
    >
      {inView ? (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {target}{suffix}
        </motion.span>
      ) : '0'}
    </motion.span>
  );
}

export function UspStripSection({ data }: Props) {
  const items = (data.items as { icon?: string; title: string; text: string }[]) || [];
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <div ref={ref} className="relative z-20 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="rounded-3xl border border-[var(--token-card-border, var(--style-border-color,rgba(0,0,0,0.08)))] bg-[var(--token-card-bg, var(--style-card-bg,#ffffff))] p-3 shadow-xl md:p-4">
        <div className={cn(
          'grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4',
          items.length >= 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3',
        )}>
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="group rounded-2xl border border-[var(--token-card-border, var(--style-border-color,rgba(0,0,0,0.06)))] p-8 text-center transition-all duration-500 hover:-translate-y-0.5 hover:border-[var(--style-accent-color,var(--brand-primary,#1a5276))] lg:p-10"
            >
              {item.icon && (
                <div className="flex items-center justify-center text-4xl mb-4 transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-1">
                  <DynamicIcon name={item.icon} size={32} className="text-[var(--style-accent-color,var(--brand-primary,#1a5276))]" />
                </div>
              )}
              <h3 className="font-display mb-1.5 text-lg font-semibold text-[var(--token-heading, var(--style-heading-color,var(--style-text-primary,#18181b)))]" data-edit-path="title">{item.title}</h3>
              <div className="rt-content text-sm leading-relaxed text-[var(--token-body, var(--style-body-color,var(--style-text-secondary,#71717a)))]" dangerouslySetInnerHTML={{ __html: item.text }} />
            </motion.div>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
}
