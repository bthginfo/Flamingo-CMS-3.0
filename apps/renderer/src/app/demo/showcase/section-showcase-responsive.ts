export type ShowcaseViewportKey = 'desktop' | 'tablet' | 'mobile';

export function viewportForHostWidth(width: number): ShowcaseViewportKey {
  if (width < 640) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

export function fitPreviewScale(availableWidth: number, canvasWidth: number): number {
  if (!Number.isFinite(availableWidth) || availableWidth <= 0) return 1;
  if (!Number.isFinite(canvasWidth) || canvasWidth <= 0) return 1;
  return Math.min(1, availableWidth / canvasWidth);
}
