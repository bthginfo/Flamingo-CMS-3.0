'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { DynamicIcon } from '@/components/ui/icon-map';
import { plain } from '@/lib/strip-html';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

type BentoItem = { title: string; description?: string; icon?: string; image?: string; span?: string; size?: string };

export function BentoGridSection({ data }: Props) {
  const headline = (data.headline as string) || '';
  const subline = (data.subline as string) || '';
  const badge = (data.badge as string) || '';
  const items = (data.items as BentoItem[]) || [];
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  if (!items.length) return null;

  const getSpanClass = (item: BentoItem, idx?: number) => {
    const val = item.span || item.size || '';
    if (val === 'wide' || val === 'lg') return 'md:col-span-2';
    if (val === 'tall') return 'md:row-span-2';
    if (val === 'large') return 'md:col-span-2 md:row-span-2';
    if (val === 'md') return 'md:col-span-1';
    if (val === 'sm') return '';
    // Default pattern: first is wide
    if (idx === 0) return 'md:col-span-2';
    return '';
  };

  return (
    <div ref={ref}>
      {(headline || badge) && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="text-center mb-12">
          {badge && <span className="section-badge">{badge}</span>}
          {headline && <h2 className="section-headline">{headline}</h2>}
          {subline && <p className="section-subline max-w-2xl mx-auto">{plain(subline)}</p>}
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[minmax(180px,auto)]">
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className={`group relative overflow-hidden rounded-2xl bg-zinc-50 border border-zinc-200/60 p-6 cursor-default transition-all duration-300 hover:shadow-xl hover:shadow-zinc-200/50 hover:border-[var(--color-primary)]/20 hover:-translate-y-1 ${getSpanClass(item, i)}`}
          >
            {/* Hover spotlight */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(600px_at_50%_50%,var(--color-primary)/0.04,transparent)]" />

            {item.image && (
              <div className="absolute inset-0 z-0">
                <img src={item.image} alt="" className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent" />
              </div>
            )}

            <div className="relative z-10 flex flex-col h-full justify-end">
              {item.icon && <div className="text-3xl mb-3 text-[var(--color-primary)]"><DynamicIcon name={item.icon} size={32} /></div>}
              <h3 className="text-lg font-semibold text-zinc-900 mb-1">{item.title}</h3>
              {item.description && <p className="text-sm text-zinc-600 leading-relaxed">{plain(item.description)}</p>}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
