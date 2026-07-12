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

type I18nConfig = { enabled: boolean; locales: string[]; defaultLocale: string };

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
  i18n?: I18nConfig;
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
  const editorData = i18n?.enabled && section.data._localized
    ? (section.data[activeLocale || i18n.defaultLocale] as Record<string, unknown> ?? section.data[i18n.defaultLocale] as Record<string, unknown> ?? {})
    : section.data;

  return (
    <div ref={setNodeRef} style={style} className={`admin-card mb-3 p-0 overflow-hidden ${expanded ? 'ring-2 ring-blue-500/20 border-blue-300' : ''}`}>
      <div className={`flex items-center px-4 py-3 border-b cursor-pointer ${expanded ? 'bg-blue-50' : 'bg-gray-50 hover:bg-gray-100'} transition-colors`} onClick={() => setExpanded(!expanded)}>
        {!section.locked ? (
          <button {...attributes} {...listeners} className="cursor-grab mr-3 text-gray-400 hover:text-gray-600 touch-none" onClick={(event) => event.stopPropagation()}>
            <GripVertical size={18} />
          </button>
        ) : (
          <div className="mr-3 text-amber-500" title="System-Sektion (gesperrt)">
            <Lock size={16} />
          </div>
        )}
        <div className="flex-1 min-w-0 flex items-center gap-2">
          <span className={`font-medium text-sm ${expanded ? 'text-blue-700' : ''}`}>{typeInfo?.label ?? section.type}</span>
          {section.titleInternal && <span className="text-xs text-gray-400">({section.titleInternal})</span>}
          {!expanded && <span className="text-[10px] text-zinc-400 ml-1">— Klicken zum Bearbeiten</span>}
        </div>
        <button onClick={(event) => { event.stopPropagation(); onToggleVisible(); }} className="p-1 mr-2" title={section.visible ? 'Ausblenden' : 'Einblenden'}>
          {section.visible ? <Eye size={16} className="text-green-600" /> : <EyeOff size={16} className="text-gray-400" />}
        </button>
        <button onClick={(event) => { event.stopPropagation(); setExpanded(!expanded); }} className="p-1 mr-2">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {!section.locked && (
          <button onClick={(event) => { event.stopPropagation(); onDelete(); }} className="p-1 text-red-400 hover:text-red-600">
            <Trash2 size={16} />
          </button>
        )}
      </div>
      {expanded && (
        <div className="p-4">
          {/* Keyed by locale: the per-type editors hold their form state in
              useState(data) and would otherwise keep showing (and save!) the
              previous locale's content after a locale-tab switch. */}
          <IndustrySectionDataEditor key={`${section.type}:${activeLocale || 'default'}`} industry={industry} type={section.type} data={editorData} onChange={stableOnChange} sectionId={section.id} />
          <SectionColorEditor value={(section.styleOverrides as Record<string, string>) || null} onChange={onSaveColorOverrides} sectionType={section.type} industry={industry} definitionKey={section.definitionKey} resolvedVars={resolvedVars} iframeRef={iframeRef} sectionId={section.id} />
          <details className="mt-4">
            <summary className="text-xs text-gray-500 cursor-pointer flex items-center gap-1"><Settings2 size={12} /> Erweiterte Einstellungen</summary>
            <SectionMetaEditor section={section} sectionTypes={sectionTypes} onSave={onSaveMeta} onChangeType={onChangeType} />
          </details>
        </div>
      )}
    </div>
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
            <button className="admin-btn-secondary text-xs whitespace-nowrap" disabled={nextType === section.type} onClick={() => onChangeType(nextType)}>
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
        <button className="admin-btn-primary text-xs" onClick={() => onSave(meta)}>Meta speichern</button>
      </div>
    </div>
  );
}
