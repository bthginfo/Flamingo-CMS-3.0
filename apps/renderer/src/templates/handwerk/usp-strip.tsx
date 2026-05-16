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
      className="font-display font-bold text-4xl lg:text-3xl md:text-5xl text-brand-primary"
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
    <div ref={ref} className="-mt-20 relative z-20">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100/50 p-2">
        <div className={cn(
          'grid grid-cols-1 sm:grid-cols-2 gap-px bg-gray-100 rounded-2xl overflow-hidden',
          items.length >= 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3',
        )}>
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white p-8 lg:p-10 text-center group hover:bg-gradient-to-br hover:from-brand-primary/[0.02] hover:to-brand-secondary/[0.02] transition-all duration-500"
            >
              {item.icon && (
                <div className="flex items-center justify-center text-4xl mb-4 transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-1">
                  <DynamicIcon name={item.icon} size={32} className="text-brand-primary" />
                </div>
              )}
              <h3 className="font-display font-semibold text-lg mb-1.5 text-gray-900">{item.title}</h3>
              <div className="text-slate-500 text-sm leading-relaxed rt-content" dangerouslySetInnerHTML={{ __html: item.text }} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
