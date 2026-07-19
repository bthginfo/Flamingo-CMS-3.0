'use client';

import { useEffect, type RefObject } from 'react';
import type { EditableSection } from './editable-section';
import { resolveEditableSectionData, type EditorI18nConfig } from './live-preview-data';
import { patchPreviewSectionData, previewValuesEqual } from './live-preview-path';

type SectionChangeHandler = (sectionId: string, data: Record<string, unknown>) => void;
type ColorChangeHandler = (sectionId: string, overrides: Record<string, unknown> | null) => void;

type Props = {
  sendPreviewData: () => void;
  iframeRef: RefObject<HTMLIFrameElement | null>;
  sectionsRef: RefObject<EditableSection[]>;
  pendingChangesRef: RefObject<Map<string, Record<string, unknown>>>;
  sectionChangeRef: RefObject<SectionChangeHandler | null>;
  colorChangeRef: RefObject<ColorChangeHandler | null>;
  i18n?: EditorI18nConfig;
  activeLocale: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0;
}

function focusSectionCard(sectionId: string, timeouts: Set<number>) {
  const escapedId = typeof CSS !== 'undefined' && typeof CSS.escape === 'function'
    ? CSS.escape(sectionId)
    : sectionId.replace(/["\\]/g, '\\$&');
  const card = document.querySelector<HTMLElement>(`[data-section-card-id="${escapedId}"]`);
  if (!card) return;
  card.scrollIntoView({ behavior: 'smooth', block: 'center' });
  card.classList.add('ring-2', 'ring-pink-400', 'ring-offset-2');
  const timeout = window.setTimeout(() => {
    card.classList.remove('ring-2', 'ring-pink-400', 'ring-offset-2');
    timeouts.delete(timeout);
  }, 1600);
  timeouts.add(timeout);
}

export function useLivePreviewMessageBridge({
  sendPreviewData,
  iframeRef,
  sectionsRef,
  pendingChangesRef,
  sectionChangeRef,
  colorChangeRef,
  i18n,
  activeLocale,
}: Props) {
  useEffect(() => {
    const focusTimeouts = new Set<number>();

    function onMessage(event: MessageEvent) {
      const previewWindow = iframeRef.current?.contentWindow;
      if (!previewWindow || event.source !== previewWindow) return;
      if (event.origin !== window.location.origin || !isRecord(event.data)) return;
      const message = event.data;

      if (message.type === 'flamingo-live-preview-ready') {
        sendPreviewData();
        return;
      }

      if (message.type === 'flamingo-section-clicked') {
        if (!isNonEmptyString(message.sectionId)) return;
        if (!sectionsRef.current.some(section => section.id === message.sectionId)) return;
        focusSectionCard(message.sectionId, focusTimeouts);
        return;
      }

      if (message.type === 'flamingo-color-edit') {
        if (!isNonEmptyString(message.sectionId) || !isRecord(message.overrides)) return;
        const section = sectionsRef.current.find(candidate => candidate.id === message.sectionId);
        if (!section || previewValuesEqual(section.styleOverrides ?? null, message.overrides)) return;
        colorChangeRef.current?.(message.sectionId, message.overrides);
        return;
      }

      if (!isNonEmptyString(message.sectionId) || !isNonEmptyString(message.path)) return;
      const section = sectionsRef.current.find(candidate => candidate.id === message.sectionId);
      if (!section) return;

      let nextValue: unknown;
      if (message.type === 'flamingo-image-edit') {
        if (typeof message.url !== 'string') return;
        nextValue = message.url;
      } else if (
        message.type === 'flamingo-field-edit'
        || message.type === 'flamingo-rich-edit'
        || message.type === 'flamingo-icon-edit'
      ) {
        if (typeof message.value !== 'string') return;
        nextValue = message.value;
      } else if (message.type === 'flamingo-link-edit') {
        if (!isRecord(message.value)) return;
        nextValue = message.value;
      } else {
        return;
      }

      const pendingOrStoredData = pendingChangesRef.current.get(message.sectionId) ?? section.data ?? {};
      const base = resolveEditableSectionData(pendingOrStoredData, i18n, activeLocale);
      const nextData = patchPreviewSectionData(base, message.path, nextValue);
      if (!nextData) return;
      sectionChangeRef.current?.(message.sectionId, nextData);
    }

    window.addEventListener('message', onMessage);
    return () => {
      window.removeEventListener('message', onMessage);
      for (const timeout of focusTimeouts) window.clearTimeout(timeout);
    };
  }, [activeLocale, colorChangeRef, i18n, iframeRef, pendingChangesRef, sectionChangeRef, sectionsRef, sendPreviewData]);
}
