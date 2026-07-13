'use client';

import { useId, type ReactNode } from 'react';
import { EDITORIAL_GROUPS, groupEditorialFields } from '@/lib/editorial-field-metadata';

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

export function IndustrySectionDataEditor({ industry, type, data, onChange, sectionId }: { industry: string; type: string; data: Record<string, unknown>; onChange: (data: Record<string, unknown>) => void; sectionId?: string }) {
  if (industry === 'wedding' && hasWeddingEditor(type)) {
    return <SpecializedEditorShell data={data}><WeddingSectionDataEditor type={type} data={data} onChange={onChange} /></SpecializedEditorShell>;
  }

  if (industry === 'medical' && hasMedicalEditor(type)) {
    return <SpecializedEditorShell data={data}><MedicalSectionDataEditor type={type} data={data} onChange={onChange} /></SpecializedEditorShell>;
  }

  if (industry === 'salon' && hasSalonEditor(type)) {
    return <SpecializedEditorShell data={data}><SalonSectionDataEditor type={type} data={data} onChange={onChange} /></SpecializedEditorShell>;
  }

  if (industry === 'tourism' && hasTourismEditor(type)) {
    return <SpecializedEditorShell data={data}><TourismSectionDataEditor type={type} data={data} onChange={onChange} /></SpecializedEditorShell>;
  }

  if (industry === 'hotel' && hasHotelEditor(type)) {
    return <SpecializedEditorShell data={data}><HotelSectionDataEditor type={type} data={data} onChange={onChange} /></SpecializedEditorShell>;
  }

  if (industry === 'restaurant' && hasRestaurantEditor(type)) {
    return <SpecializedEditorShell data={data}><RestaurantSectionDataEditor type={type} data={data} onChange={onChange} /></SpecializedEditorShell>;
  }

  if (industry === 'tattoo' && hasTattooEditor(type)) {
    return <SpecializedEditorShell data={data}><TattooSectionDataEditor type={type} data={data} onChange={onChange} /></SpecializedEditorShell>;
  }

  if (industry === 'realestate' && hasRealestateEditor(type)) {
    return <SpecializedEditorShell data={data}><RealestateSectionDataEditor type={type} data={data} onChange={onChange} /></SpecializedEditorShell>;
  }

  if (industry === 'cafe' && hasCafeEditor(type)) {
    return <SpecializedEditorShell data={data}><CafeSectionDataEditor type={type} data={data} onChange={onChange} /></SpecializedEditorShell>;
  }

  if (industry === 'consulting' && hasConsultingEditor(type)) {
    return <SpecializedEditorShell data={data}><ConsultingSectionDataEditor type={type} data={data} onChange={onChange} /></SpecializedEditorShell>;
  }

  return <SectionDataEditor type={type} data={data} onChange={onChange} sectionId={sectionId} />;
}

function SpecializedEditorShell({ children, data }: { children: ReactNode; data: Record<string, unknown> }) {
  const titleId = useId();
  const groups = groupEditorialFields(data);
  const outline = EDITORIAL_GROUPS.filter((group) => group.key !== 'advanced');
  return (
    <section className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 sm:p-5" aria-labelledby={titleId}>
      <div className="mb-4 border-b border-zinc-200 pb-3">
        <h3 id={titleId} className="text-xs font-bold uppercase tracking-[0.12em] text-zinc-700">Redaktioneller Aufbau</h3>
        <p className="mt-1 text-xs leading-5 text-zinc-500">Inhalte, Aktionen, Medien und Details bleiben in jeder Branche gleich erkennbar.</p>
        <ol className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-4" aria-label="Inhaltsgruppen dieser Section">
          {outline.map((group, index) => (
            <li key={group.key} className={`rounded-lg border px-3 py-2 ${groups[group.key].length ? 'border-blue-200 bg-blue-50/70 text-blue-800' : 'border-zinc-200 bg-white text-zinc-400'}`}>
              <span className="block text-[10px] font-bold uppercase tracking-[0.1em]">{index + 1}. {group.label}</span>
              <span className="mt-0.5 block text-[10px]">{groups[group.key].length} Felder</span>
            </li>
          ))}
        </ol>
      </div>
      <div className="rounded-lg border border-zinc-200 bg-white p-3 shadow-sm shadow-zinc-950/[0.02] sm:p-4">
        <h4 className="mb-3 text-[11px] font-bold uppercase tracking-[0.1em] text-zinc-500">Felder bearbeiten</h4>
        <div className="space-y-4">{children}</div>
      </div>
    </section>
  );
}
