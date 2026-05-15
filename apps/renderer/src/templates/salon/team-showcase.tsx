'use client';

import { baseHeader, ImageCard, SectionHeader, asList } from './shared';
import type { SectionProps } from './types';

type Member = { name?: string; role?: string; bio?: string; image?: string; specialties?: string[]; bookingCta?: { label?: string; href?: string } };

export function TeamShowcaseSection({ data }: SectionProps) {
  const header = baseHeader(data, 'Team', 'Menschen');
  const members = asList<Member>(data.members);
  return <div><SectionHeader {...header} /><div className="grid gap-6 md:grid-cols-3">{members.map((item, index) => <ImageCard key={`${item.name}-${index}`} image={item.image} title={item.name} text={[item.bio, asList<string>(item.specialties).join(' / ')].filter(Boolean).join('\n')} meta={item.role} cta={item.bookingCta} />)}</div></div>;
}
