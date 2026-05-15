'use client';

import { motion } from 'framer-motion';
import { DynamicIcon } from '@/components/ui/icon-map';
import { asList, type SectionProps } from './types';

type Expertise = { icon?: string; title?: string; text?: string; metaLabel?: string };

export function ExpertiseGridSection({ data, styleVariant }: SectionProps) {
  const headline = (data.headline as string) || 'Expertise';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || 'Skills';
  const items = asList<Expertise>(data.items);

  const props = { headline, subline, badgeText, items };

  if (styleVariant === 'modern') return <ExpertiseModern {...props} />;
  if (styleVariant === 'bold') return <ExpertiseBold {...props} />;
  return <ExpertiseClassic {...props} />;
}

type Props = { headline: string; subline: string; badgeText: string; items: Expertise[] };

function ExpertiseClassic({ headline, subline, badgeText, items }: Props) {
  return (
    <div>
      <div className="mb-10 max-w-3xl">
        {badgeText && <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-xs font-bold uppercase tracking-widest text-[var(--style-text-secondary)]">{badgeText}</motion.p>}
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-3 text-3xl sm:text-5xl font-[var(--style-heading-weight)] text-[var(--style-text-primary)]">{headline}</motion.h2>
        {subline && <p className="mt-4 text-[var(--style-text-secondary)]">{subline}</p>}
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {items.map((item, i) => (
          <motion.article key={`${item.title}-${i}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="rounded-2xl border border-[var(--style-badge-bg)]/20 bg-[var(--style-card-bg)] p-6 shadow-md">
            {item.metaLabel && <span className="inline-block rounded-full bg-[var(--style-badge-bg)] px-3 py-1 text-xs font-bold uppercase text-[var(--style-badge-text,#c0528a)]">{item.metaLabel}</span>}
            <div className="mt-4 flex gap-4">
              <DynamicIcon name={item.icon || 'sparkles'} size={20} className="text-[var(--style-accent)]" />
              <div>
                <h3 className="font-semibold text-[var(--style-text-primary)]">{item.title || ''}</h3>
                {item.text && <p className="mt-1 text-sm leading-6 text-[var(--style-text-secondary)]">{item.text}</p>}
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}

function ExpertiseModern({ headline, subline, badgeText, items }: Props) {
  return (
    <div>
      <div className="mb-14 max-w-3xl">
        {badgeText && <p className="text-xs font-light uppercase tracking-[0.3em] text-[var(--style-text-secondary)]">{badgeText}</p>}
        <h2 className="mt-4 text-3xl font-light sm:text-5xl text-[var(--style-text-primary)]">{headline}</h2>
        {subline && <p className="mt-4 font-light text-[var(--style-text-secondary)]">{subline}</p>}
      </div>
      <div className="grid gap-8 md:grid-cols-3">
        {items.map((item, i) => (
          <article key={`${item.title}-${i}`} className="border-t border-black/10 pt-6">
            {item.metaLabel && <p className="text-xs font-light uppercase tracking-[0.3em] text-[var(--style-text-secondary)]">{item.metaLabel}</p>}
            <div className="mt-3 flex gap-4">
              <DynamicIcon name={item.icon || 'sparkles'} size={18} className="text-[var(--style-accent)]" />
              <div>
                <h3 className="font-light text-[var(--style-text-primary)]">{item.title || ''}</h3>
                {item.text && <p className="mt-2 text-sm font-light leading-6 text-[var(--style-text-secondary)]">{item.text}</p>}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function ExpertiseBold({ headline, subline, badgeText, items }: Props) {
  return (
    <div>
      <div className="mb-10 max-w-3xl">
        {badgeText && <p className="text-xs font-black uppercase tracking-widest text-[var(--style-accent)]">{badgeText}</p>}
        <h2 className="mt-3 text-3xl font-black uppercase sm:text-5xl text-[var(--style-text-primary)]">{headline}</h2>
        {subline && <p className="mt-4 font-bold text-[var(--style-text-secondary)]">{subline}</p>}
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {items.map((item, i) => (
          <article key={`${item.title}-${i}`} className="border-2 border-[var(--style-text-primary)] bg-[#111] p-6 shadow-[4px_4px_0_var(--style-accent)]">
            {item.metaLabel && <span className="inline-block bg-[var(--style-accent)] px-3 py-1 text-xs font-black uppercase text-white">{item.metaLabel}</span>}
            <div className="mt-4 flex gap-4">
              <DynamicIcon name={item.icon || 'sparkles'} size={20} className="text-[var(--style-accent)]" />
              <div>
                <h3 className="font-black uppercase text-white">{item.title || ''}</h3>
                {item.text && <p className="mt-1 text-sm leading-6 text-white/70">{item.text}</p>}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
