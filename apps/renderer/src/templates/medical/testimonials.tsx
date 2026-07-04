'use client';

import { IndustryTestimonialsSection } from '../shared/industry-sections';
import type { SectionProps } from './types';

export function MedicalTestimonialsSection({ data }: SectionProps) {
  return <IndustryTestimonialsSection data={data} defaults={{ headline: 'Patientenstimmen', badge: 'Bewertungen' }} />;
}
