'use client';

import { baseHeader, ImageCard, SectionHeader, asList } from './shared';
import type { SectionProps } from './types';

type Diagnostic = { title?: string; text?: string; image?: string; benefitLabel?: string; methodLabel?: string; cta?: { label?: string; href?: string } };

export function DiagnosticsSection({ data }: SectionProps) {
  const header = baseHeader(data, 'Diagnostik', 'Verfahren');
  const items = asList<Diagnostic>(data.items);
  return <div><SectionHeader {...header} /><div className="grid gap-6 md:grid-cols-3">{items.map((item, index) => <ImageCard key={`${item.title}-${index}`} image={item.image} title={item.title} text={item.text} meta={[item.methodLabel, item.benefitLabel].filter(Boolean).join(' / ')} cta={item.cta} />)}</div></div>;
}
