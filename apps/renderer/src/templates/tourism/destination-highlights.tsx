'use client';

import { baseHeader, CtaButton, ImageCard, SectionHeader, asButton, asList } from './shared';
import type { SectionProps } from './types';

type Highlight = { title?: string; text?: string; image?: string; category?: string; cta?: { label?: string; href?: string } };

export function DestinationHighlightsSection({ data }: SectionProps) {
  const header = baseHeader(data, 'Highlights der Region', 'Entdecken');
  const items = asList<Highlight>(data.items);
  const ctaPrimary = asButton(data.ctaPrimary);
  return (
    <div>
      <SectionHeader {...header} />
      <div className="grid gap-6 md:grid-cols-3">{items.map((item, index) => <ImageCard key={`${item.title}-${index}`} image={item.image} title={item.title} text={item.text} meta={item.category} cta={item.cta} />)}</div>
      <div className="mt-8"><CtaButton cta={ctaPrimary} /></div>
    </div>
  );
}
