'use client';

import { baseHeader, ImageCard, SectionHeader, asList } from './shared';
import type { SectionProps } from './types';

type Doctor = { name?: string; title?: string; specialty?: string; bio?: string; image?: string; languages?: string[]; appointmentCta?: { label?: string; href?: string } };

export function DoctorTeamSection({ data }: SectionProps) {
  const header = baseHeader(data, 'Aerztliches Team', 'Team');
  const doctors = asList<Doctor>(data.doctors);
  return <div><SectionHeader {...header} /><div className="grid gap-6 md:grid-cols-3">{doctors.map((item, index) => <ImageCard key={`${item.name}-${index}`} image={item.image} title={[item.title, item.name].filter(Boolean).join(' ')} text={[item.bio, asList<string>(item.languages).join(' / ')].filter(Boolean).join('\n')} meta={item.specialty} cta={item.appointmentCta} />)}</div></div>;
}
