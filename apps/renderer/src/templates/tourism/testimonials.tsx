'use client';

import { IndustryTestimonialsSection } from '../shared/industry-sections';
import type { SectionProps } from './types';

export function TourismTestimonialsSection({ data }: SectionProps) {
  return <IndustryTestimonialsSection data={data} defaults={{ headline: 'Besucherstimmen', badge: 'Erfahrungen' }} />;
}
