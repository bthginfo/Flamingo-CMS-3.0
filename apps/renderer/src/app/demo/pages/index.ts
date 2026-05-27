import { handwerkSite } from './handwerk';
import { hotelSite } from './hotel';
import { restaurantSite } from './restaurant';
import { medicalSite } from './medical';
import { salonSite } from './salon';
import { tourismSite } from './tourism';
import { weddingSite } from './wedding-v2';
import { photographySite } from './photography';
import { consultingSite } from './consulting';
import { showcaseSite } from './showcase';
import { realestateSite } from './realestate';
import { cafeSite } from './cafe';
import { tattooSite } from './tattoo';
import { retailSite } from './retail';
import { floristSite } from './florist';
import { fitnessSite } from './fitness';
import { locationSite } from './location';
import type { DemoSite } from './types';

export type { DemoSite, DemoPage } from './types';

const SITES: Record<string, DemoSite> = {
  handwerk: handwerkSite,
  hotel: hotelSite,
  restaurant: restaurantSite,
  medical: medicalSite,
  salon: salonSite,
  tourism: tourismSite,
  wedding: weddingSite,
  photography: photographySite,
  consulting: consultingSite,
  showcase: showcaseSite,
  realestate: realestateSite,
  cafe: cafeSite,
  tattoo: tattooSite,
  retail: retailSite,
  florist: floristSite,
  fitness: fitnessSite,
  location: locationSite,
};

export function getDemoSite(industryKey: string): DemoSite | undefined {
  return SITES[industryKey];
}

export function getAllIndustryKeys(): string[] {
  return Object.keys(SITES);
}
