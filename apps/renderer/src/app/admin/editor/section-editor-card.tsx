'use client';

import { useCallback, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { ChevronDown, ChevronUp, Eye, EyeOff, GripVertical, Lock, Settings2, Trash2 } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { IndustrySectionDataEditor } from '../pages/[id]/industry-section-editor';
import { SectionColorEditor } from '../pages/[id]/section-color-editor';
import type { SectionTypeDefinition } from '../pages/[id]/section-types';
import type { EditableSection } from './editable-section';
import { resolveEditableSectionData, type EditorI18nConfig } from './live-preview-data';
import { getSectionEditorialSummary } from '@/lib/editorial-field-metadata';

type Props = {
  section: EditableSection;
  industry: string;
  sectionTypes: SectionTypeDefinition[];
  resolvedVars: Record<string, string>;
  iframeRef: RefObject<HTMLIFrameElement | null>;
  onDelete: () => void;
  onToggleVisible: () => void;
  onChangeData: (data: Record<string, unknown>) => void;
  onChangeType: (type: string) => void;
  onSaveMeta: (meta: Partial<EditableSection>) => void;
  onSaveColorOverrides: (overrides: Record<string, unknown> | null) => void;
  activeLocale?: string;
  i18n?: EditorI18nConfig;
};

export function SectionEditorCard({
  section,
  industry,
  sectionTypes,
  resolvedVars,
  iframeRef,
  onDelete,
  onToggleVisible,
  onChangeData,
  onChangeType,
  onSaveMeta,
  onSaveColorOverrides,
  activeLocale,
  i18n,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const onChangeRef = useRef(onChangeData);
  onChangeRef.current = onChangeData;
  const stableOnChange = useCallback((data: Record<string, unknown>) => onChangeRef.current(data), []);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : !section.visible ? 0.5 : 1 };
  const typeInfo = sectionTypes.find((type) => type.type === section.type);
  const editorData = resolveEditableSectionData(section.data, i18n, activeLocale);
  const summary = getSectionEditorialSummary(editorData);
  const sectionLabel = typeInfo?.label ?? section.type;

  return (
    <article ref={setNodeRef} data-section-card-id={section.id} style={style} className={`admin-card mb-3 overflow-hidden p-0 ${expanded ? 'border-blue-300 ring-2 ring-blue-500/15' : ''}`}>
      <header className={`flex items-stretch border-b transition-colors ${expanded ? 'border-blue-200 bg-blue-50/70' : 'border-zinc-200 bg-zinc-50 hover:bg-zinc-100'}`}>
        {!section.locked ? (
          <button type="button" {...attributes} {...listeners} className="touch-none cursor-grab px-3 text-zinc-400 hover:bg-zinc-200/60 hover:text-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500" aria-label={`${sectionLabel} verschieben`} title="Section verschieben">
            <GripVertical size={18} aria-hidden="true" />
          </button>
        ) : (
          <div className="flex items-center px-3 text-amber-600" title="System-Section (gesperrt)" aria-label="System-Section, gesperrt">
            <Lock size={16} aria-hidden="true" />
          </div>
        )}
        <button type="button" onClick={() => setExpanded((current) => !current)} className="min-w-0 flex-1 px-1 py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500" aria-expanded={expanded} aria-label={`${sectionLabel} ${expanded ? 'einklappen' : 'bearbeiten'}`}>
          <span className="flex min-w-0 items-center gap-2">
            <span className={`truncate text-sm font-semibold ${expanded ? 'text-blue-800' : 'text-zinc-800'}`}>{sectionLabel}</span>
            {section.titleInternal && <span className="truncate text-xs text-zinc-400">{section.titleInternal}</span>}
            {!section.visible && <span className="rounded bg-zinc-200 px-1.5 py-0.5 text-[10px] font-semibold text-zinc-600">Ausgeblendet</span>}
          </span>
          <span className="mt-1.5 flex min-w-0 items-center gap-3">
            <span className="min-w-0 flex-1 truncate text-xs text-zinc-500">{summary.excerpt || 'Noch keine Kernbotschaft eingetragen'}</span>
            {summary.total > 0 && <span className="inline-flex shrink-0 items-center gap-1.5 text-[10px] font-medium text-zinc-500" title={`${summary.complete} von ${summary.total} Inhaltsbereichen ausgefüllt`}><span className="h-1.5 w-12 overflow-hidden rounded-full bg-zinc-200" aria-hidden="true"><span className="block h-full bg-blue-500" style={{ width: `${summary.percentage}%` }} /></span>{summary.complete}/{summary.total}</span>}
          </span>
        </button>
        <button type="button" onClick={onToggleVisible} className="px-3 text-zinc-500 hover:bg-zinc-200/60 hover:text-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500" aria-label={section.visible ? `${sectionLabel} ausblenden` : `${sectionLabel} einblenden`} title={section.visible ? 'Ausblenden' : 'Einblenden'}>
          {section.visible ? <Eye size={17} className="text-emerald-600" aria-hidden="true" /> : <EyeOff size={17} aria-hidden="true" />}
        </button>
        <button type="button" onClick={() => setExpanded((current) => !current)} className="px-3 text-zinc-500 hover:bg-zinc-200/60 hover:text-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500" aria-label={`${sectionLabel} ${expanded ? 'einklappen' : 'aufklappen'}`} title={expanded ? 'Einklappen' : 'Aufklappen'}>
          {expanded ? <ChevronUp size={17} aria-hidden="true" /> : <ChevronDown size={17} aria-hidden="true" />}
        </button>
        {!section.locked && (
          <button type="button" onClick={onDelete} className="px-3 text-red-400 hover:bg-red-50 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-red-500" aria-label={`${sectionLabel} löschen`} title="Section löschen">
            <Trash2 size={17} aria-hidden="true" />
          </button>
        )}
      </header>
      {expanded && (
        <div className="bg-white p-4 [&_button]:focus-visible:outline-none [&_button]:focus-visible:ring-2 [&_button]:focus-visible:ring-blue-500 [&_button]:focus-visible:ring-offset-2 sm:p-5">
          <div className="mb-5 border-b border-zinc-200 pb-3">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-zinc-700">Inhalt bearbeiten</p>
            <p className="mt-1 text-xs text-zinc-500">Beginne mit der Kernbotschaft. Darstellung und technische Optionen folgen getrennt.</p>
          </div>
          {/* Keyed by locale: the per-type editors hold their form state in
              useState(data) and would otherwise keep showing (and save!) the
              previous locale's content after a locale-tab switch. */}
          <IndustrySectionDataEditor key={`${section.type}:${activeLocale || 'default'}`} industry={industry} type={section.type} definitionKey={section.definitionKey} data={editorData} onChange={stableOnChange} sectionId={section.id} />
          <SectionColorEditor value={(section.styleOverrides as Record<string, string>) || null} onChange={onSaveColorOverrides} sectionType={section.type} industry={industry} definitionKey={section.definitionKey} resolvedVars={resolvedVars} iframeRef={iframeRef} sectionId={section.id} />
          <details className="mt-4">
            <summary className="text-xs text-gray-500 cursor-pointer flex items-center gap-1"><Settings2 size={12} /> Erweiterte Einstellungen</summary>
            <SectionMetaEditor section={section} sectionTypes={sectionTypes} onSave={onSaveMeta} onChangeType={onChangeType} />
          </details>
        </div>
      )}
    </article>
  );
}

function SectionMetaEditor({ section, sectionTypes, onSave, onChangeType }: { section: EditableSection; sectionTypes: SectionTypeDefinition[]; onSave: (meta: Partial<EditableSection>) => void; onChangeType: (type: string) => void }) {
  const [meta, setMeta] = useState({
    titleInternal: section.titleInternal || '',
    variant: section.variant || '',
    container: section.container,
    spacingTop: section.spacingTop,
    spacingBottom: section.spacingBottom,
    anchorId: section.anchorId || '',
  });
  const [nextType, setNextType] = useState(section.type);

  return (
    <div className="grid grid-cols-2 gap-3 mt-3 text-sm">
      {!section.locked && (
        <label className="block col-span-2">
          <span className="text-gray-600 text-xs">Sektionstyp</span>
          <div className="mt-1 flex gap-2">
            <select className="admin-input flex-1" value={nextType} onChange={(event) => setNextType(event.target.value)}>
              {sectionTypes.map((type) => (
                <option key={type.type} value={type.type}>{type.label}</option>
              ))}
            </select>
            <button type="button" className="admin-btn-secondary text-xs whitespace-nowrap" disabled={nextType === section.type} onClick={() => onChangeType(nextType)}>
              Typ wechseln
            </button>
          </div>
        </label>
      )}
      <label className="block">
        <span className="text-gray-600 text-xs">Interner Titel</span>
        <input className="admin-input mt-1" value={meta.titleInternal} onChange={(event) => setMeta({ ...meta, titleInternal: event.target.value })} />
      </label>
      <label className="block">
        <span className="text-gray-600 text-xs">Container</span>
        <select className="admin-input mt-1" value={meta.container} onChange={(event) => setMeta({ ...meta, container: event.target.value })}>
          <option value="default">Standard</option>
          <option value="wide">Breit</option>
          <option value="full">Volle Breite</option>
          <option value="narrow">Schmal</option>
        </select>
      </label>
      <label className="block">
        <span className="text-gray-600 text-xs">Anker-ID</span>
        <input className="admin-input mt-1" value={meta.anchorId} onChange={(event) => setMeta({ ...meta, anchorId: event.target.value })} />
      </label>
      <label className="block">
        <span className="text-gray-600 text-xs">Abstand oben</span>
        <select className="admin-input mt-1" value={meta.spacingTop} onChange={(event) => setMeta({ ...meta, spacingTop: event.target.value })}>
          <option value="none">Kein</option>
          <option value="s">Klein</option>
          <option value="m">Mittel</option>
          <option value="l">Groß</option>
          <option value="xl">Extra Groß</option>
        </select>
      </label>
      <label className="block">
        <span className="text-gray-600 text-xs">Abstand unten</span>
        <select className="admin-input mt-1" value={meta.spacingBottom} onChange={(event) => setMeta({ ...meta, spacingBottom: event.target.value })}>
          <option value="none">Kein</option>
          <option value="s">Klein</option>
          <option value="m">Mittel</option>
          <option value="l">Groß</option>
          <option value="xl">Extra Groß</option>
        </select>
      </label>
      <div className="col-span-2">
        <button type="button" className="admin-btn-primary text-xs" onClick={() => onSave(meta)}>Einstellungen speichern</button>
      </div>
    </div>
  );
}
