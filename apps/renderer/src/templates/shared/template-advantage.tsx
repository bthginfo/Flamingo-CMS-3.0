'use client';

import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { plain } from '@/lib/strip-html';

type TemplateCard = { title?: string; text?: string; image?: string; href?: string; label?: string };
type Cta = { label?: string; href?: string };
type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function TemplateAdvantageSection({ data }: Props) {
  const badge = (data.badge as string) || '';
  const headline = (data.headline as string) || '';
  const subline = (data.subline as string) || '';
  const cards = ((data.cards as TemplateCard[]) || []).filter(card => card.title || card.text || card.image);
  const bullets = ((data.bullets as string[]) || []).filter(Boolean);
  const cta = (data.cta as Cta) || {};
  if (!cards.length && !headline) return null;

  return (
    <section className="overflow-hidden bg-[var(--token-section-bg)] py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-end">
          <div>
            {badge && <div className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-[var(--token-badge-text)]" data-edit-path="badge">{badge}</div>}
            {headline && <h2 className="max-w-3xl text-4xl font-black leading-none text-[var(--token-heading)] md:text-6xl" data-edit-path="headline">{headline}</h2>}
          </div>
          <div>
            {subline && <p className="text-lg leading-8 text-[var(--token-subheading)]" data-edit-path="subline">{plain(subline)}</p>}
            {bullets.length > 0 && (
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {bullets.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm font-semibold text-[var(--token-card-body, var(--token-body))]" data-edit-collection="bullets" data-edit-index={index}>
                    <CheckCircle2 size={18} className="text-[var(--token-icon)]" />
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {cards.map((card, index) => (
            <motion.a
              key={index}
              href={card.href || '#'}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: index * 0.06 }}
              className="group overflow-hidden rounded-2xl border border-[var(--token-card-border)] bg-[var(--token-card-bg)] shadow-[0_24px_70px_rgba(20,17,26,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_90px_rgba(20,17,26,0.13)]"
             data-edit-collection="cards" data-edit-index={index}>
              <div className="relative aspect-[16/11] overflow-hidden bg-[color:color-mix(in_srgb,var(--token-card-border)_35%,var(--token-card-bg,#fff))]">
                {card.image && <img data-edit-image="image" src={card.image} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />}
                {card.image && <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />}
                {card.label && <span className="absolute left-4 top-4 rounded-full bg-[var(--token-badge-bg)] px-3 py-1 text-xs font-bold text-[var(--token-card-badge-text, var(--token-badge-text))] shadow-sm" data-edit-path="label">{card.label}</span>}
              </div>
              <div className="p-6">
                {card.title && <h3 className="text-2xl font-black leading-tight text-[var(--token-card-heading, var(--token-heading))]" data-edit-path="title">{card.title}</h3>}
                {card.text && <p className="mt-3 text-sm leading-6 text-[var(--token-muted)]" data-edit-path="text">{plain(card.text)}</p>}
              </div>
            </motion.a>
          ))}
        </div>

        {cta.label && (
          <div className="mt-10">
            <a data-edit-link="cta" href={cta.href || '#'} className="inline-flex items-center gap-2 rounded-full bg-[var(--token-btn-bg)] px-6 py-3 text-sm font-bold text-[var(--token-btn-text)]">
              <span data-edit-path="label">{cta.label}</span><ArrowRight size={16} />
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
