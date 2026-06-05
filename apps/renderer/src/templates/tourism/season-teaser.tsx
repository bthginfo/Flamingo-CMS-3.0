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

  if (styleVariant === 'modern') return <Modern header={header} seasons={seasons} />;
  if (styleVariant === 'bold') return <Bold header={header} seasons={seasons} />;
  return <Classic header={header} seasons={seasons} />;
}

type Props = { header: { headline: string; subline: string; badgeText: string }; seasons: Season[] };

function Classic({ header, seasons }: Props) {
  return (
    <div>
      <SectionHeader {...header} />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {seasons.map((season, index) => (
          <motion.article key={`${season.title}-${index}`} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} className="group overflow-hidden rounded-xl bg-[var(--token-card-bg)] shadow-lg" data-edit-collection="seasons" data-edit-index={index}>
            {season.image && <div className="relative aspect-[4/3] overflow-hidden"><Image src={season.image} alt={season.title || ''} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="25vw" /></div>}
            <div className="p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-green-700">{[season.category, season.periodLabel].filter(Boolean).join(' / ')}</p>
              <h3 className="mt-2 text-xl font-bold text-[color:var(--token-heading)]" data-edit-path="title">{season.title || ''}</h3>
              {season.text && <div className="mt-3 text-sm leading-6 text-[color:var(--token-muted)] rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: season.text }} />}
              {season.cta?.label && <a href={season.cta.href || '#'} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-green-700"><span data-edit-path="label">{season.cta.label}</span><ArrowRight size={14} /></a>}
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}

function Modern({ header, seasons }: Props) {
  return (
    <div>
      <SectionHeader {...header} />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {seasons.map((season, index) => (
          <article key={`${season.title}-${index}`} className="group overflow-hidden border border-black/10 bg-[var(--token-card-bg)]" data-edit-collection="seasons" data-edit-index={index}>
            {season.image && <div className="relative aspect-[4/3] overflow-hidden"><Image src={season.image} alt={season.title || ''} fill className="object-cover" sizes="25vw" /></div>}
            <div className="p-5">
              <p className="text-xs font-light uppercase tracking-widest text-teal-600">{[season.category, season.periodLabel].filter(Boolean).join(' / ')}</p>
              <h3 className="mt-2 text-xl font-light text-[color:var(--token-heading)]" data-edit-path="title">{season.title || ''}</h3>
              {season.text && <div className="mt-3 text-sm font-light leading-6 text-[color:var(--token-muted)] rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: season.text }} />}
              {season.cta?.label && <a href={season.cta.href || '#'} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-teal-600"><span data-edit-path="label">{season.cta.label}</span><ArrowRight size={14} /></a>}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function Bold({ header, seasons }: Props) {
  return (
    <div>
      <div className="mb-10 max-w-3xl">
        {header.badgeText && <p className="text-xs font-black uppercase tracking-widest text-orange-500" data-edit-path="badgeText">{header.badgeText}</p>}
        <h2 className="mt-3 text-3xl font-black uppercase text-[color:var(--token-heading)] sm:text-3xl md:text-5xl" data-edit-path="headline">{header.headline}</h2>
        {header.subline && <div className="mt-4 text-[color:var(--token-muted)] rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: header.subline }} />}
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {seasons.map((season, index) => (
          <article key={`$<span data-edit-path="title">{season.title}</span>-${index}`} className="group overflow-hidden border-2 border-[#111827] bg-[var(--token-card-bg)] shadow-[4px_4px_0_#111827]" data-edit-collection="seasons" data-edit-index={index}>
            {season.image && <div className="relative aspect-[4/3] overflow-hidden"><Image src={season.image} alt={season.title || ''} fill className="object-cover" sizes="25vw" /></div>}
            <div className="p-5">
              <p className="text-xs font-black uppercase tracking-widest text-orange-500">{[season.category, season.periodLabel].filter(Boolean).join(' / ')}</p>
              <h3 className="mt-2 text-xl font-black uppercase text-[color:var(--token-heading)]" data-edit-path="title">{season.title || ''}</h3>
              {season.text && <div className="mt-3 text-sm leading-6 text-[color:var(--token-muted)] rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: season.text }} />}
              {season.cta?.label && <a href={season.cta.href || '#'} className="mt-4 inline-flex items-center gap-2 text-sm font-black uppercase text-orange-500"><span data-edit-path="label">{season.cta.label}</span><ArrowRight size={14} /></a>}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
