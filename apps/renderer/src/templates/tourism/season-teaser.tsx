'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { baseHeader, SectionHeader, asList } from './shared';
import type { SectionProps } from './types';

type Season = { title?: string; text?: string; image?: string; category?: string; periodLabel?: string; cta?: { label?: string; href?: string } };

export function SeasonTeaserSection({ data, styleVariant }: SectionProps) {
  const header = baseHeader(data, 'Die beste Zeit fuer Ihren Besuch', 'Saison');
  const seasons = asList<Season>(data.seasons);

  return <Classic header={header} seasons={seasons} />;
}

type Props = { header: { headline: string; subline: string; badgeText: string }; seasons: Season[] };

function Classic({ header, seasons }: Props) {
  return (
    <div>
      <SectionHeader {...header} />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {seasons.map((season, index) => (
          <motion.article key={`${season.title}-${index}`} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} className="group overflow-hidden rounded-xl bg-[var(--token-card-bg)] shadow-lg" data-card data-edit-collection="seasons" data-edit-index={index}>
            {season.image && <div className="relative aspect-[4/3] overflow-hidden"><Image data-edit-image="image" src={season.image} alt={season.title || ''} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="25vw" /></div>}
            <div className="p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--token-success)]">{[season.category, season.periodLabel].filter(Boolean).join(' / ')}</p>
              <h3 className="mt-2 text-xl font-bold text-[color:var(--token-heading)]" data-edit-path="title">{season.title || ''}</h3>
              {season.text && <div className="mt-3 text-sm leading-6 text-[color:var(--token-muted)] rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: season.text }} />}
              {season.cta?.label && <a href={season.cta.href || '#'} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--token-success)]"><span data-edit-path="label">{season.cta.label}</span><ArrowRight size={14} /></a>}
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}

