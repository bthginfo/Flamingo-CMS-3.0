'use client';

import { baseHeader, CtaButton, ImageCard, SectionHeader, asButton, asList } from './shared';
import type { SectionProps } from './types';

type ServiceCategory = { title?: string; text?: string; image?: string; category?: string; services?: string[]; cta?: { label?: string; href?: string } };

export function ServiceMenuSection({ data }: SectionProps) {
  const header = baseHeader(data, 'Leistungen', 'Services');
  const categories = asList<ServiceCategory>(data.categories);
  const ctaPrimary = asButton(data.ctaPrimary);
  return <div><SectionHeader {...header} /><div className="grid gap-6 md:grid-cols-3">{categories.map((item, index) => <ImageCard key={`${item.title}-${index}`} image={item.image} title={item.title} text={[item.text, asList<string>(item.services).join(' / ')].filter(Boolean).join('\n')} meta={item.category} cta={item.cta} />)}</div><div className="mt-8"><CtaButton cta={ctaPrimary} /></div></div>;
}
