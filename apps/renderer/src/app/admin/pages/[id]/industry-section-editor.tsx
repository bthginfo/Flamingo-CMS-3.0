'use client';

import { useId, type ReactNode } from 'react';
import { EDITORIAL_GROUPS, groupEditorialFields } from '@/lib/editorial-field-metadata';
import { resolveIndustryEditorOwner } from '@/app/admin/editor/industry-editor-resolution';

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

type SpecializedEditorProps = {
  type: string;
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
};

const INDUSTRY_EDITOR_OWNERS = [
  { industry: 'wedding', matches: hasWeddingEditor, render: (props: SpecializedEditorProps) => <WeddingSectionDataEditor {...props} /> },
  { industry: 'medical', matches: hasMedicalEditor, render: (props: SpecializedEditorProps) => <MedicalSectionDataEditor {...props} /> },
  { industry: 'salon', matches: hasSalonEditor, render: (props: SpecializedEditorProps) => <SalonSectionDataEditor {...props} /> },
  { industry: 'tourism', matches: hasTourismEditor, render: (props: SpecializedEditorProps) => <TourismSectionDataEditor {...props} /> },
  { industry: 'hotel', matches: hasHotelEditor, render: (props: SpecializedEditorProps) => <HotelSectionDataEditor {...props} /> },
  { industry: 'restaurant', matches: hasRestaurantEditor, render: (props: SpecializedEditorProps) => <RestaurantSectionDataEditor {...props} /> },
  { industry: 'tattoo', matches: hasTattooEditor, render: (props: SpecializedEditorProps) => <TattooSectionDataEditor {...props} /> },
  { industry: 'realestate', matches: hasRealestateEditor, render: (props: SpecializedEditorProps) => <RealestateSectionDataEditor {...props} /> },
  { industry: 'cafe', matches: hasCafeEditor, render: (props: SpecializedEditorProps) => <CafeSectionDataEditor {...props} /> },
  { industry: 'consulting', matches: hasConsultingEditor, render: (props: SpecializedEditorProps) => <ConsultingSectionDataEditor {...props} /> },
] as const;

export function resolveIndustryEditorKey(industry: string, type: string, definitionKey?: string | null): string | null {
  return resolveIndustryEditorOwner(INDUSTRY_EDITOR_OWNERS, { industry, type, definitionKey });
}

export function IndustrySectionDataEditor({ industry, type, definitionKey, data, onChange, sectionId }: { industry: string; type: string; definitionKey?: string | null; data: Record<string, unknown>; onChange: (data: Record<string, unknown>) => void; sectionId?: string }) {
  const ownerKey = resolveIndustryEditorKey(industry, type, definitionKey);
  const owner = INDUSTRY_EDITOR_OWNERS.find(candidate => candidate.industry === ownerKey);
  if (owner) {
    return (
      <SpecializedEditorShell data={data}>
        {owner.render({ type, data, onChange })}
      </SpecializedEditorShell>
    );
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
