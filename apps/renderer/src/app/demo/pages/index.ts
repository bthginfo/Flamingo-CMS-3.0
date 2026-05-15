import { handwerkSite } from './handwerk';
import { hotelSite } from './hotel';
import { restaurantSite } from './restaurant';
import { medicalSite } from './medical';
import { salonSite } from './salon';
import { tourismSite } from './tourism';
import type { DemoSite } from './types';

export type { DemoSite, DemoPage } from './types';

const SITES: Record<string, DemoSite> = {
  handwerk: handwerkSite,
  hotel: hotelSite,
  restaurant: restaurantSite,
  medical: medicalSite,
  salon: salonSite,
  tourism: tourismSite,
};

export function getDemoSite(industryKey: string): DemoSite | undefined {
  return SITES[industryKey];
}

export function getAllIndustryKeys(): string[] {
  return Object.keys(SITES);
}
