'use client';

import { IndustryFaqSection } from '../shared/industry-sections';
import type { SectionProps } from './types';

export function MedicalFaqSection({ data }: SectionProps) {
  return <IndustryFaqSection data={data} defaults={{ headline: 'Haeufige Fragen', badge: 'FAQ' }} />;
}
