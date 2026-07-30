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
    <section
      className="editorial-feature-rail overflow-hidden py-16 md:py-24"
      data-color-slot="sectionBg"
      style={{ backgroundColor: 'var(--token-section-bg)' }}
    >
      <div className="mx-auto max-w-7xl px-6">
        <div
          className="mb-12 max-w-3xl"
          data-color-slot="mutedColor"
          style={{ color: 'var(--token-muted)' }}
        >
          {badge && (
            <div
              className="mb-4 text-xs font-bold uppercase tracking-[0.22em]"
              data-edit-path="badge"
              data-color-slot="badgeText"
              style={{ color: 'var(--token-badge-text)' }}
            >
              {badge}
            </div>
          )}
          {headline && (
            <h2
              className="text-4xl font-black leading-none md:text-6xl"
              data-edit-path="headline"
              data-color-slot="headingColor"
              style={{ color: 'var(--token-heading)' }}
            >
              {headline}
            </h2>
          )}
          {subline && (
            <p
              className="mt-5 text-lg leading-8"
              data-edit-path="subline"
              data-color-slot="bodyColor"
              style={{ color: 'var(--token-body)' }}
            >
              {plain(subline)}
            </p>
          )}
        </div>
        <div className="flex snap-x gap-5 overflow-x-auto pb-4 [scrollbar-width:thin]">
          {items.map((item, index) => (
            <motion.article
              key={index}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: index * 0.06 }}
              className="group relative min-h-[560px] w-[82vw] shrink-0 snap-center overflow-hidden rounded-3xl border md:w-[520px]"
              data-edit-collection="items"
              data-edit-index={index}
              data-card
              data-color-slot="cardBg borderColor cardMutedColor"
              style={{
                backgroundColor: 'var(--token-card-bg)',
                borderColor: 'var(--token-card-border)',
                color: 'var(--token-card-muted, rgba(255,255,255,0.72))',
              }}
            >
              {item.image && <img data-edit-image="image" src={item.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-74 transition duration-700 group-hover:scale-105 group-hover:opacity-86" />}
              <div className="absolute inset-0 bg-[color:color-mix(in_srgb,var(--token-card-bg)_12%,transparent)]" />
              <div className="absolute inset-0 bg-[linear-gradient(to_top,var(--token-card-bg),color-mix(in_srgb,var(--token-card-bg)_62%,transparent),color-mix(in_srgb,var(--token-card-bg)_12%,transparent))]" />
              <div className="relative z-10 flex h-full flex-col justify-end p-6 md:p-8">
                {item.kicker && (
                  <div
                    className="mb-3 text-xs font-bold uppercase tracking-[0.2em] [text-shadow:0_1px_12px_rgba(0,0,0,0.35)]"
                    data-edit-path="kicker"
                    data-color-slot="eyebrow"
                    style={{ color: 'var(--token-eyebrow)' }}
                  >
                    {item.kicker}
                  </div>
                )}
                <h3
                  className="text-3xl font-black leading-tight [text-shadow:0_2px_20px_rgba(0,0,0,0.45)] md:text-4xl"
                  data-edit-path="title"
                  data-color-slot="cardHeadingColor"
                  style={{ color: 'var(--token-card-heading, #ffffff)' }}
                >
                  {item.title}
                </h3>
                {item.text && (
                  <p
                    className="mt-4 max-w-md text-sm leading-7 [text-shadow:0_1px_12px_rgba(0,0,0,0.32)]"
                    data-edit-path="text"
                    data-color-slot="cardBodyColor"
                    style={{ color: 'var(--token-card-body, rgba(255,255,255,0.88))' }}
                  >
                    {plain(item.text)}
                  </p>
                )}
                {item.ctaLabel && (
                  <a
                    href={item.ctaHref || '#'}
                    className="mt-6 inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-bold"
                    data-color-slot="btnBg"
                    style={{ backgroundColor: 'var(--token-btn-bg)' }}
                  >
                    <span
                      data-edit-path="ctaLabel"
                      data-color-slot="btnText"
                      style={{ color: 'var(--token-btn-text)' }}
                    >
                      {item.ctaLabel}
                    </span>
                    <ArrowRight size={15} style={{ color: 'var(--token-btn-text)' }} />
                  </a>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
