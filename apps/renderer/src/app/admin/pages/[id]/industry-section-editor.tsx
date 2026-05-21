'use client';

import { SectionDataEditor } from './section-data-editor';
import { hasHotelEditor, HotelSectionDataEditor } from './hotel-section-data-editor';
import { hasRestaurantEditor, RestaurantSectionDataEditor } from './restaurant-section-data-editor';
import { hasTourismEditor, TourismSectionDataEditor } from './tourism-section-data-editor';
import { hasSalonEditor, SalonSectionDataEditor } from './salon-section-data-editor';
import { hasMedicalEditor, MedicalSectionDataEditor } from './medical-section-data-editor';
import { hasWeddingEditor, WeddingSectionDataEditor } from './wedding-section-data-editor';
import { hasTattooEditor, TattooSectionDataEditor } from './tattoo-section-data-editor';
import { hasRealestateEditor, RealestateSectionDataEditor } from './realestate-section-data-editor';
import { hasCafeEditor, CafeSectionDataEditor } from './cafe-section-data-editor';
import { hasConsultingEditor, ConsultingSectionDataEditor } from './consulting-section-data-editor';

export function IndustrySectionDataEditor({ industry, type, data, onChange }: { industry: string; type: string; data: Record<string, unknown>; onChange: (data: Record<string, unknown>) => void }) {
  if (industry === 'wedding' && hasWeddingEditor(type)) {
    return <WeddingSectionDataEditor type={type} data={data} onChange={onChange} />;
  }

  if (industry === 'medical' && hasMedicalEditor(type)) {
    return <MedicalSectionDataEditor type={type} data={data} onChange={onChange} />;
  }

  if (industry === 'salon' && hasSalonEditor(type)) {
    return <SalonSectionDataEditor type={type} data={data} onChange={onChange} />;
  }

  if (industry === 'tourism' && hasTourismEditor(type)) {
    return <TourismSectionDataEditor type={type} data={data} onChange={onChange} />;
  }

  if (industry === 'hotel' && hasHotelEditor(type)) {
    return <HotelSectionDataEditor type={type} data={data} onChange={onChange} />;
  }

  if (industry === 'restaurant' && hasRestaurantEditor(type)) {
    return <RestaurantSectionDataEditor type={type} data={data} onChange={onChange} />;
  }

  if (industry === 'tattoo' && hasTattooEditor(type)) {
    return <TattooSectionDataEditor type={type} data={data} onChange={onChange} />;
  }

  if (industry === 'realestate' && hasRealestateEditor(type)) {
    return <RealestateSectionDataEditor type={type} data={data} onChange={onChange} />;
  }

  if (industry === 'cafe' && hasCafeEditor(type)) {
    return <CafeSectionDataEditor type={type} data={data} onChange={onChange} />;
  }

  if (industry === 'consulting' && hasConsultingEditor(type)) {
    return <ConsultingSectionDataEditor type={type} data={data} onChange={onChange} />;
  }

  return <SectionDataEditor type={type} data={data} onChange={onChange} />;
}
