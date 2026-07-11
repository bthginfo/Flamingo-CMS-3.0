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
import { eishockeySite } from './eishockey';
import type { DemoSite } from './types';

export type { DemoSite, DemoPage } from './types';

/**
 * @deprecated Hand-authored demo data is retained solely for explicit local
 * development (`DEMO_STATIC_FALLBACK=1`). Production routes must use tenant
 * snapshots so these fixtures cannot silently drift from the live personas.
 */
const DEPRECATED_STATIC_DEMO_FIXTURES: Record<string, DemoSite> = {
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
  eishockey: eishockeySite,
};

export function getDeprecatedStaticDemoFixture(industryKey: string): DemoSite | undefined {
  return DEPRECATED_STATIC_DEMO_FIXTURES[industryKey];
}

/** @deprecated Use DB-backed demo snapshots in production. */
export const getDemoSite = getDeprecatedStaticDemoFixture;

export function getAllIndustryKeys(): string[] {
  return Object.keys(DEPRECATED_STATIC_DEMO_FIXTURES);
}
