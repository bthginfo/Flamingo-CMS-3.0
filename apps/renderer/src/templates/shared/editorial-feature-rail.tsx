'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { plain } from '@/lib/strip-html';

type Item = { kicker?: string; title: string; text?: string; image?: string; ctaLabel?: string; ctaHref?: string };
type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function EditorialFeatureRailSection({ data }: Props) {
  const badge = (data.badge as string) || '';
  const headline = (data.headline as string) || '';
  const subline = (data.subline as string) || '';
  const items = (data.items as Item[]) || [];
  if (!items.length) return null;

  return (
    <section className="editorial-feature-rail overflow-hidden bg-[var(--token-section-bg)] py-16 text-[color:var(--token-body)] md:py-24">
      <style>{`
        .editorial-feature-rail [data-feature-rail-heading] { color: var(--token-heading, #061532) !important; }
        .editorial-feature-rail [data-feature-rail-copy] { color: var(--token-body, #25344f) !important; }
        .editorial-feature-rail [data-feature-card-title] { color: var(--token-on-dark-heading, #ffffff) !important; text-shadow: 0 2px 20px rgba(0,0,0,0.45); }
        .editorial-feature-rail [data-feature-card-copy] { color: var(--token-on-dark-body, var(--token-card-body, rgba(255,255,255,0.88))) !important; text-shadow: 0 1px 12px rgba(0,0,0,0.32); }
        .editorial-feature-rail [data-feature-card-kicker] { color: var(--token-eyebrow) !important; text-shadow: 0 1px 12px rgba(0,0,0,0.35); }
      `}</style>
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 max-w-3xl">
          {badge && <div className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-[color:var(--token-badge-text)]" data-edit-path="badge">{badge}</div>}
          {headline && <h2 className="text-4xl font-black leading-none !text-[color:var(--token-heading)] md:text-6xl" data-edit-path="headline" data-feature-rail-heading>{headline}</h2>}
          {subline && <p className="mt-5 text-lg leading-8 !text-[color:var(--token-body)]" data-edit-path="subline" data-feature-rail-copy>{plain(subline)}</p>}
        </div>
        <div className="flex snap-x gap-5 overflow-x-auto pb-4 [scrollbar-width:thin]">
          {items.map((item, index) => (
            <motion.article key={index} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ delay: index * 0.06 }} className="group relative min-h-[560px] w-[82vw] shrink-0 snap-center overflow-hidden rounded-3xl border border-[var(--token-card-border)] bg-[var(--token-card-bg)] md:w-[520px]" data-edit-collection="items" data-edit-index={index} data-color-context="dark" data-feature-card>
              {item.image && <img data-edit-image="image" src={item.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-74 transition duration-700 group-hover:scale-105 group-hover:opacity-86" />}
              <div className="absolute inset-0 bg-[color:color-mix(in_srgb,var(--token-card-bg)_12%,transparent)]" />
              <div className="absolute inset-0 bg-[linear-gradient(to_top,var(--token-card-bg),color-mix(in_srgb,var(--token-card-bg)_62%,transparent),color-mix(in_srgb,var(--token-card-bg)_12%,transparent))]" />
              <div className="relative z-10 flex h-full flex-col justify-end p-6 md:p-8">
                {item.kicker && <div className="mb-3 text-xs font-bold uppercase tracking-[0.2em] !text-[color:var(--token-eyebrow)]" data-edit-path="kicker" data-feature-card-kicker>{item.kicker}</div>}
                <h3 className="text-3xl font-black leading-tight !text-[color:var(--token-on-dark-heading,#fff)] md:text-4xl" data-edit-path="title" data-feature-card-title>{item.title}</h3>
                {item.text && <p className="mt-4 max-w-md text-sm leading-7 !text-[color:var(--token-on-dark-body,var(--token-card-body,rgba(255,255,255,0.88)))]" data-edit-path="text" data-feature-card-copy>{plain(item.text)}</p>}
                {item.ctaLabel && <a href={item.ctaHref || '#'} className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-[var(--token-btn-bg)] px-4 py-2 text-sm font-bold text-[color:var(--token-btn-text)]"><span data-edit-path="ctaLabel">{item.ctaLabel}</span><ArrowRight size={15} /></a>}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
