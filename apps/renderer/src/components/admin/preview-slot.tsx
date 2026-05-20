'use client';

import { usePreview } from './preview-context';
import { PreviewPanel } from './preview-panel';

export function PreviewSlot() {
  const { isOpen, url, refreshKey, close, iframeRef } = usePreview();

  if (!isOpen) return null;

  return <PreviewPanel key={refreshKey} url={url} onClose={close} iframeRef={iframeRef} />;
}
