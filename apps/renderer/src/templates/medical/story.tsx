'use client';

import { IndustryStorySection } from '../shared/industry-sections';
import type { SectionProps } from './types';

export function MedicalStorySection({ data }: SectionProps) {
  return <IndustryStorySection data={data} defaults={{ headline: 'Unsere Praxis', badge: 'Über uns', icon: 'stethoscope' }} />;
}
