'use client';

import { baseHeader, ImageCard, SectionHeader, asList } from './shared';
import type { SectionProps } from './types';

type Season = { title?: string; text?: string; image?: string; category?: string; periodLabel?: string; cta?: { label?: string; href?: string } };

export function SeasonTeaserSection({ data }: SectionProps) {
  const header = baseHeader(data, 'Die beste Zeit fuer Ihren Besuch', 'Saison');
  const seasons = asList<Season>(data.seasons);
  return (
    <div>
      <SectionHeader {...header} />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{seasons.map((season, index) => <ImageCard key={`${season.title}-${index}`} image={season.image} title={season.title} text={season.text} meta={[season.category, season.periodLabel].filter(Boolean).join(' / ')} cta={season.cta} />)}</div>
    </div>
  );
}
