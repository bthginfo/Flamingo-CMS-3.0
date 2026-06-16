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
        {badgeText && <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-xs font-bold uppercase tracking-widest text-[color:var(--token-muted)]" data-edit-path="badgeText">{badgeText}</motion.p>}
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-3 text-3xl sm:text-3xl md:text-5xl font-[700] text-[color:var(--token-heading)]" data-edit-path="headline">{headline}</motion.h2>
        {subline && <div className="mt-4 text-[color:var(--token-muted)] rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: subline }} />}
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {items.map((item, i) => (
          <motion.article key={`$<span data-edit-path="title">{item.title}</span>-${i}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="rounded-xl border border-[color-mix(in_srgb,var(--token-icon)_20%,transparent)] bg-[var(--token-card-bg)] p-6 shadow-md" data-edit-collection="items" data-edit-index={i}>
            {item.metaLabel && <span className="inline-block rounded-full bg-[var(--token-badge-bg)] px-3 py-1 text-xs font-bold uppercase text-[color:var(--token-eyebrow)]">{item.metaLabel}</span>}
            <div className="mt-4 flex gap-4">
              <DynamicIcon editPath="icon" name={item.icon || 'sparkles'} size={20} className="text-[color:var(--token-eyebrow)]" />
              <div>
                <h3 className="font-semibold text-[color:var(--token-heading)]" data-edit-path="title">{item.title || ''}</h3>
                {item.text && <div className="mt-1 text-sm leading-6 text-[color:var(--token-muted)] rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: item.text }} />}
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
        {badgeText && <p className="text-xs font-light uppercase tracking-[0.3em] text-[color:var(--token-muted)]" data-edit-path="badgeText">{badgeText}</p>}
        <h2 className="mt-4 text-3xl font-light sm:text-3xl md:text-5xl text-[color:var(--token-heading)]" data-edit-path="headline">{headline}</h2>
        {subline && <div className="mt-4 font-light text-[color:var(--token-muted)] rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: subline }} />}
      </div>
      <div className="grid gap-8 md:grid-cols-3">
        {items.map((item, i) => (
          <article key={`$<span data-edit-path="title">{item.title}</span>-${i}`} className="border-t border-black/10 pt-6" data-edit-collection="items" data-edit-index={i}>
            {item.metaLabel && <p className="text-xs font-light uppercase tracking-[0.3em] text-[color:var(--token-muted)]">{item.metaLabel}</p>}
            <div className="mt-3 flex gap-4">
              <DynamicIcon editPath="icon" name={item.icon || 'sparkles'} size={18} className="text-[color:var(--token-eyebrow)]" />
              <div>
                <h3 className="font-light text-[color:var(--token-heading)]" data-edit-path="title">{item.title || ''}</h3>
                {item.text && <div className="mt-2 text-sm font-light leading-6 text-[color:var(--token-muted)] rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: item.text }} />}
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
        {badgeText && <p className="text-xs font-black uppercase tracking-widest text-[color:var(--token-eyebrow)]" data-edit-path="badgeText">{badgeText}</p>}
        <h2 className="mt-3 text-3xl font-black uppercase sm:text-3xl md:text-5xl text-[color:var(--token-heading)]" data-edit-path="headline">{headline}</h2>
        {subline && <div className="mt-4 font-bold text-[color:var(--token-muted)] rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: subline }} />}
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {items.map((item, i) => (
          <article key={`$<span data-edit-path="title">{item.title}</span>-${i}`} className="border-2 border-[var(--token-card-border)] bg-[#111] p-6 shadow-[4px_4px_0_var(--token-eyebrow)]" data-edit-collection="items" data-edit-index={i}>
            {item.metaLabel && <span className="inline-block bg-[var(--token-badge-bg)] px-3 py-1 text-xs font-black uppercase text-[color:var(--token-on-dark-heading)]">{item.metaLabel}</span>}
            <div className="mt-4 flex gap-4">
              <DynamicIcon editPath="icon" name={item.icon || 'sparkles'} size={20} className="text-[color:var(--token-eyebrow)]" />
              <div>
                <h3 className="font-black uppercase text-[color:var(--token-on-dark-heading)]" data-edit-path="title">{item.title || ''}</h3>
                {item.text && <div className="mt-1 text-sm leading-6 text-[color:color-mix(in_srgb,var(--token-on-dark-heading)_70%,transparent)] rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: item.text }} />}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
