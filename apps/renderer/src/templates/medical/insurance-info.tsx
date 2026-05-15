'use client';

import { baseHeader, ImageCard, SectionHeader, asList } from './shared';
import type { SectionProps } from './types';

type Insurance = { title?: string; text?: string; image?: string; typeLabel?: string; notice?: string; cta?: { label?: string; href?: string } };

export function InsuranceInfoSection({ data }: SectionProps) {
  const header = baseHeader(data, 'Versicherung & Abrechnung', 'Info');
  const items = asList<Insurance>(data.items);
  return <div><SectionHeader {...header} /><div className="grid gap-6 md:grid-cols-3">{items.map((item, index) => <ImageCard key={`${item.title}-${index}`} image={item.image} title={item.title} text={[item.text, item.notice].filter(Boolean).join('\n')} meta={item.typeLabel} cta={item.cta} />)}</div></div>;
}
