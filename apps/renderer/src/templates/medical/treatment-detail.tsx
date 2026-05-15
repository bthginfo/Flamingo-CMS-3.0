'use client';

import { baseHeader, ImageCard, SectionHeader, asList } from './shared';
import type { SectionProps } from './types';

type Treatment = { title?: string; text?: string; image?: string; durationLabel?: string; requirementLabel?: string; noticeText?: string; steps?: string[]; cta?: { label?: string; href?: string } };

export function TreatmentDetailSection({ data }: SectionProps) {
  const header = baseHeader(data, 'Behandlungen im Detail', 'Ablauf');
  const treatments = asList<Treatment>(data.treatments);
  return <div><SectionHeader {...header} /><div className="grid gap-6 md:grid-cols-2">{treatments.map((item, index) => <ImageCard key={`${item.title}-${index}`} image={item.image} title={item.title} text={[item.text, asList<string>(item.steps).join(' / '), item.noticeText].filter(Boolean).join('\n')} meta={[item.durationLabel, item.requirementLabel].filter(Boolean).join(' / ')} cta={item.cta} />)}</div></div>;
}
