'use client';

import { baseHeader, CtaButton, ImageCard, SectionHeader, asButton, asList } from './shared';
import type { SectionProps } from './types';

type PackageItem = { title?: string; text?: string; image?: string; priceLabel?: string; validUntilLabel?: string; includes?: string[]; cta?: { label?: string; href?: string } };

export function PackagesSection({ data }: SectionProps) {
  const header = baseHeader(data, 'Pakete & Specials', 'Specials');
  const packages = asList<PackageItem>(data.packages);
  const ctaPrimary = asButton(data.ctaPrimary);
  return <div><SectionHeader {...header} /><div className="grid gap-6 md:grid-cols-3">{packages.map((item, index) => <ImageCard key={`${item.title}-${index}`} image={item.image} title={item.title} text={[item.text, asList<string>(item.includes).join(' / ')].filter(Boolean).join('\n')} meta={[item.priceLabel, item.validUntilLabel].filter(Boolean).join(' / ')} cta={item.cta} />)}</div><div className="mt-8"><CtaButton cta={ctaPrimary} /></div></div>;
}
