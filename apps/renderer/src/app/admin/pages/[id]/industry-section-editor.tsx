'use client';

import { SectionDataEditor } from './section-data-editor';
import { hasHotelEditor, HotelSectionDataEditor } from './hotel-section-data-editor';
import { hasRestaurantEditor, RestaurantSectionDataEditor } from './restaurant-section-data-editor';
import { hasTourismEditor, TourismSectionDataEditor } from './tourism-section-data-editor';

export function IndustrySectionDataEditor({ industry, type, data, onChange }: { industry: string; type: string; data: Record<string, unknown>; onChange: (data: Record<string, unknown>) => void }) {
  if (industry === 'tourism' && hasTourismEditor(type)) {
    return <TourismSectionDataEditor type={type} data={data} onChange={onChange} />;
  }

  if (industry === 'hotel' && hasHotelEditor(type)) {
    return <HotelSectionDataEditor type={type} data={data} onChange={onChange} />;
  }

  if (industry === 'restaurant' && hasRestaurantEditor(type)) {
    return <RestaurantSectionDataEditor type={type} data={data} onChange={onChange} />;
  }

  return <SectionDataEditor type={type} data={data} onChange={onChange} />;
}
