'use client';

import { baseHeader, ImageCard, SectionHeader, asList } from './shared';
import type { SectionProps } from './types';

type Accommodation = { title?: string; text?: string; image?: string; category?: string; typeLabel?: string; priceLabel?: string; amenities?: string[]; cta?: { label?: string; href?: string } };

export function AccommodationGridSection({ data }: SectionProps) {
  const header = baseHeader(data, 'Unterkuenfte', 'Bleiben');
  const items = asList<Accommodation>(data.items);
  return (
    <div>
      <SectionHeader {...header} />
      <div className="grid gap-6 md:grid-cols-3">{items.map((item, index) => <ImageCard key={`${item.title}-${index}`} image={item.image} title={item.title} text={[item.text, asList<string>(item.amenities).join(' / ')].filter(Boolean).join('\n')} meta={[item.category, item.typeLabel, item.priceLabel].filter(Boolean).join(' / ')} cta={item.cta} />)}</div>
    </div>
  );
}
