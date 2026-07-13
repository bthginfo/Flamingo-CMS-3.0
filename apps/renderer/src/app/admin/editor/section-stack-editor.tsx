'use client';

import { useState, type ReactNode } from 'react';
import { Plus } from 'lucide-react';
import { closestCenter, DndContext, KeyboardSensor, PointerSensor, TouchSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { arrayMove } from '@dnd-kit/sortable';
import { SectionPickerModal } from '../components/section-picker-modal';
import type { SectionTypeDefinition } from '../pages/[id]/section-types';
import type { EditableSection } from './editable-section';

type Props = {
  sections: EditableSection[];
  sectionTypes: SectionTypeDefinition[];
  industry: string;
  styleVariant?: string;
  emptyText?: string;
  addLabel?: string;
  onReorder: (sections: EditableSection[]) => void;
  onAddSection: (type: string) => void | boolean | Promise<void | boolean>;
  onOpenAddMenu?: () => void;
  onCopySection?: (sourceSectionId: string) => void | boolean | Promise<void | boolean>;
  copySources?: { pageId: string; pageTitle: string; pageSlug: string; sections: { id: string; type: string; titleInternal: string | null }[] }[];
  copySourcesLoading?: boolean;
  renderSection: (section: EditableSection) => ReactNode;
};

export function SectionStackEditor({
  sections,
  sectionTypes,
  industry,
  styleVariant,
  emptyText = 'Noch keine Sektionen. Füge unten eine hinzu.',
  addLabel = 'Sektion hinzufügen',
  onReorder,
  onAddSection,
  onOpenAddMenu,
  onCopySection,
  copySources,
  copySourcesLoading,
  renderSection,
}: Props) {
  const [showAddMenu, setShowAddMenu] = useState(false);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = sections.findIndex((section) => section.id === active.id);
    const newIndex = sections.findIndex((section) => section.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    onReorder(arrayMove(sections, oldIndex, newIndex));
  }

  return (
    <>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sections.map((section) => section.id)} strategy={verticalListSortingStrategy}>
          {sections.map((section) => renderSection(section))}
        </SortableContext>
      </DndContext>

      {sections.length === 0 && (
        <div className="admin-card text-center py-12 text-gray-400">
          {emptyText}
        </div>
      )}

      <div className="mt-4 pb-24">
        <button type="button" onClick={() => { setShowAddMenu(true); onOpenAddMenu?.(); }} className="admin-btn-primary w-full flex items-center justify-center gap-2">
          <Plus size={18} /> {addLabel}
        </button>
        {showAddMenu && (
          <SectionPickerModal
            sectionTypes={sectionTypes}
            existingSectionTypes={sections.map((section) => section.type)}
            onSelect={onAddSection}
            onCopySection={onCopySection}
            copySources={copySources}
            copySourcesLoading={copySourcesLoading}
            onClose={() => setShowAddMenu(false)}
            industry={industry}
            styleVariant={styleVariant}
          />
        )}
      </div>
    </>
  );
}
