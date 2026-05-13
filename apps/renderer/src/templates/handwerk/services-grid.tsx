'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { HoverEffect } from '@/components/ui/hover-effect';
import { ArrowRight } from 'lucide-react';

type Props = { data: Record<string, unknown>; variant?: string | null };

export function ServicesGridSection({ data }: Props) {
  const headline = (data.headline as string) || '';
  const subline = (data.subline as string) || '';
  const cards = (data.manualCards as { title: string; text?: string; icon?: string }[]) || [];
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const hoverItems = cards.map(c => ({
    title: c.title,
    description: c.text || '',
    icon: c.icon ? <span className="text-2xl">{c.icon}</span> : undefined,
  }));

  return (
    <div ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="text-center mb-16"
      >
        <div className="section-badge">
          <span>Unsere Leistungen</span>
        </div>
        {headline && <h2 className="section-headline">{headline}</h2>}
        {subline && <p className="section-subline">{subline}</p>}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <HoverEffect items={hoverItems} />
      </motion.div>
    </div>
  );
}
