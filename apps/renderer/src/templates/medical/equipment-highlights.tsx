'use client';

import { baseHeader, ImageCard, SectionHeader, asList } from './shared';
import type { SectionProps } from './types';

type Equipment = { title?: string; text?: string; image?: string; category?: string; benefitLabel?: string; cta?: { label?: string; href?: string } };

export function EquipmentHighlightsSection({ data }: SectionProps) {
  const header = baseHeader(data, 'Ausstattung', 'Praxis');
  const items = asList<Equipment>(data.items);
  return <div><SectionHeader {...header} /><div className="grid gap-6 md:grid-cols-3">{items.map((item, index) => <ImageCard key={`${item.title}-${index}`} image={item.image} title={item.title} text={item.text} meta={[item.category, item.benefitLabel].filter(Boolean).join(' / ')} cta={item.cta} />)}</div></div>;
}
