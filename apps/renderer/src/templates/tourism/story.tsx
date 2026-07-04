'use client';

import { IndustryStorySection } from '../shared/industry-sections';
import type { SectionProps } from './types';

export function TourismStorySection({ data }: SectionProps) {
  return <IndustryStorySection data={data} defaults={{ headline: 'Über die Region', badge: 'Über uns', icon: 'map-pin' }} />;
}
