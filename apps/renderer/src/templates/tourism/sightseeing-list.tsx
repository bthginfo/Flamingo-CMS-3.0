'use client';

import { baseHeader, ImageCard, SectionHeader, asList } from './shared';
import type { SectionProps } from './types';

type Sight = { title?: string; text?: string; image?: string; openingText?: string; category?: string; cta?: { label?: string; href?: string } };

export function SightseeingListSection({ data }: SectionProps) {
  const header = baseHeader(data, 'Sehenswuerdigkeiten', 'Orte');
  const items = asList<Sight>(data.items);
  return (
    <div>
      <SectionHeader {...header} />
      <div className="grid gap-6 md:grid-cols-3">{items.map((item, index) => <ImageCard key={`${item.title}-${index}`} image={item.image} title={item.title} text={item.text} meta={[item.category, item.openingText].filter(Boolean).join(' / ')} cta={item.cta} />)}</div>
    </div>
  );
}
