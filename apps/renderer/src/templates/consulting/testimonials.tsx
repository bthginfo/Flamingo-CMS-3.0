'use client';

import { useRef } from 'react';
import { plain } from '@/lib/strip-html';
import { motion, useInView } from 'framer-motion';
import { DynamicIcon } from '@/components/ui/icon-map';

type Testimonial = { quote: string; name: string; context?: string; rating?: number };
type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function ConsultingTestimonialsSection({ data }: Props) {
  const headline = (data.headline as string) || 'Mandantenstimmen';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || '';
  const items = (data.items as Testimonial[]) || [];
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <div ref={ref}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="text-center mb-12">
        {badgeText && <div className="section-badge"><span>{badgeText}</span></div>}
        {headline && <h2 className="section-headline">{headline}</h2>}
        {subline && <p className="section-subline">{plain(subline)}</p>}
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.1 }}
            className="bg-[var(--token-card-bg,#ffffff)] border border-[color:var(--token-card-border,#e4e4e7)] rounded-xl p-8 relative"
          >
            <DynamicIcon name="quote" size={24} className="text-[color:var(--token-icon,var(--brand-primary,#1a5276))/20] absolute top-6 right-6" />
            {item.rating && (
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: item.rating }).map((_, j) => (
                  <DynamicIcon key={j} name="star" size={14} className="text-amber-400 fill-amber-400" />
                ))}
              </div>
            )}
            <p className="text-[color:var(--token-muted,#3f3f46)] leading-relaxed italic mb-6">&ldquo;{plain(item.quote)}&rdquo;</p>
            <div className="border-t border-[color:var(--token-card-border,#f4f4f5)] pt-4">
              <div className="font-semibold text-[color:var(--token-heading,#18181b)] text-sm">{item.name}</div>
              {item.context && <div className="text-[color:var(--token-body,#a1a1aa)] text-xs mt-0.5">{item.context}</div>}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
