'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { DynamicIcon } from '@/components/ui/icon-map';
import { plain } from '@/lib/strip-html';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

type BentoItem = { title: string; description?: string; text?: string; icon?: string; image?: string; span?: string; size?: string };

export function BentoGridSection({ data }: Props) {
  const headline = (data.headline as string) || '';
  const subline = (data.subline as string) || '';
  const badge = (data.badge as string) || (data.badgeText as string) || '';
  const items = (((data.items as BentoItem[]) || (data.cards as BentoItem[]) || []))
    .map((item) => item && ({ ...item, description: item.description ?? item.text }))
    .filter(item => item?.title || item?.description || item?.image || item?.icon);
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
          {badge && <span className="section-badge" data-edit-path="badge">{badge}</span>}
          {headline && <h2 className="section-headline" data-edit-path="headline">{headline}</h2>}
          {subline && <p className="section-subline max-w-2xl mx-auto" data-edit-path="subline">{plain(subline)}</p>}
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 auto-rows-[minmax(180px,auto)]">
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className={`group relative overflow-hidden rounded-3xl bg-[var(--token-card-bg)] border border-[var(--token-card-border)] p-7 md:p-8 cursor-default transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${getSpanClass(item, i)}`}
           data-edit-collection="items" data-edit-index={i} data-card>
            {/* Hover spotlight */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(600px_at_50%_50%,var(--token-accent)/0.04,transparent)]" />

            {item.image && (
              <div className="absolute inset-0 z-0">
                <img data-edit-image="image" src={item.image} alt="" className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--token-card-bg)] via-[color-mix(in_srgb,var(--token-card-bg)_80%,transparent)] to-transparent" />
              </div>
            )}

            <div className="relative z-10 flex h-full flex-col gap-8">
              {item.icon && <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[color:color-mix(in_srgb,var(--token-icon)_12%,var(--token-card-bg,#fff))] text-[color:var(--token-icon)]"><DynamicIcon editPath="icon" name={item.icon} size={24} /></div>}
              <div className="mt-auto">
                <h3 className="text-xl font-bold leading-tight text-[color:var(--token-card-heading,var(--token-heading))] mb-2" data-edit-path="title">{item.title}</h3>
                {item.description && <p className="text-sm text-[color:var(--token-card-body,var(--token-body))] leading-relaxed" data-edit-path="description">{plain(item.description)}</p>}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
