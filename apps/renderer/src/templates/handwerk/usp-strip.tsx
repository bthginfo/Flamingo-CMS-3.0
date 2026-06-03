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
      className="font-display font-bold text-4xl lg:text-3xl md:text-5xl text-[color:var(--token-icon,var(--brand-primary,#1a5276))]"
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
    <div ref={ref} className="py-12 relative z-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-[var(--token-card-bg,#ffffff)] rounded-3xl shadow-xl border border-[color:var(--token-card-border,#f4f4f5)/50] p-2">
        <div className={cn(
          'grid grid-cols-1 sm:grid-cols-2 gap-px bg-[var(--token-section-bg-alt,#f4f4f5)] rounded-2xl overflow-hidden',
          items.length >= 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3',
        )}>
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="bg-[var(--token-card-bg,#ffffff)] p-8 lg:p-10 text-center group hover:bg-gradient-to-br hover:from-[var(--token-icon,var(--brand-primary,#1a5276))]/[0.02] hover:to-[var(--token-subheading,var(--brand-secondary,#2e86c1))]/[0.02] transition-all duration-500"
            >
              {item.icon && (
                <div className="flex items-center justify-center text-4xl mb-4 transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-1">
                  <DynamicIcon name={item.icon} size={32} className="text-[color:var(--token-icon,var(--brand-primary,#1a5276))]" />
                </div>
              )}
              <h3 className="font-display font-semibold text-lg mb-1.5 text-[color:var(--token-heading,#18181b)]">{item.title}</h3>
              <div className="text-[color:var(--token-on-dark-muted,#71717a)] text-sm leading-relaxed rt-content" dangerouslySetInnerHTML={{ __html: item.text }} />
            </motion.div>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
}
