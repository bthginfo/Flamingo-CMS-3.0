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
        {badgeText && <div className="section-badge"><span data-edit-path="badgeText">{badgeText}</span></div>}
        {headline && <h2 className="section-headline" data-edit-path="headline">{headline}</h2>}
        {subline && <p className="section-subline" data-edit-path="subline">{plain(subline)}</p>}
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.1 }}
            className="bg-[var(--token-card-bg)] border border-[color:var(--token-card-border)] rounded-xl p-8 relative"
           data-edit-collection="items" data-edit-index={i}>
            <DynamicIcon name="quote" size={24} className="text-[color:var(--token-icon)/20] absolute top-6 right-6" />
            {item.rating && (
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: item.rating }).map((_, j) => (
                  <DynamicIcon key={j} name="star" size={14} className="text-amber-400 fill-amber-400"  data-edit-collection="rating" data-edit-index={j}/>
                ))}
              </div>
            )}
            <p className="text-[color:var(--token-muted)] leading-relaxed italic mb-6">&ldquo;<span data-edit-path="quote">{plain(item.quote)}</span>&rdquo;</p>
            <div className="border-t border-[color:var(--token-card-border)] pt-4">
              <div className="font-semibold text-[color:var(--token-heading)] text-sm" data-edit-path="name">{item.name}</div>
              {item.context && <div className="text-[color:var(--token-body)] text-xs mt-0.5">{item.context}</div>}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
