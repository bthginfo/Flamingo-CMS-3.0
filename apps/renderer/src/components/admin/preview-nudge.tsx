'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { usePreview } from './preview-context';

/**
 * Proactive nudge tooltip that hovers above the "Vorschau" button without
 * requiring a mouseover. Shown until the user either:
 *   - clicks the dismiss (X) button on the tooltip, OR
 *   - opens the preview at least once (implicit acknowledgement).
 *
 * Persisted in localStorage so it stays dismissed across page loads.
 * Mounted next to each Vorschau toggle (publish-fab, editor-action-bar,
 * sidebar). The wrapping button is *separate* — this component only renders
 * the tooltip bubble.
 */
const DISMISS_KEY = 'flamingo:preview-nudge-dismissed';

export function PreviewNudge({
  variant = 'top-right',
  compact = false,
}: {
  variant?: 'top-right' | 'top-left' | 'right';
  compact?: boolean;
}) {
  const { isOpen } = usePreview();
  const [dismissed, setDismissed] = useState(true); // start hidden (SSR-safe)
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(DISMISS_KEY);
    setDismissed(stored === '1');
  }, []);

  // Auto-dismiss the moment the user opens the preview — they've discovered
  // the feature on their own, no need to keep nagging.
  useEffect(() => {
    if (!isOpen || dismissed) return;
    window.localStorage.setItem(DISMISS_KEY, '1');
    setDismissed(true);
  }, [isOpen, dismissed]);

  function dismiss() {
    window.localStorage.setItem(DISMISS_KEY, '1');
    setDismissed(true);
  }

  if (!mounted || dismissed || isOpen) return null;

  const position =
    variant === 'top-right'
      ? 'bottom-full right-0 mb-2'
      : variant === 'top-left'
      ? 'bottom-full left-0 mb-2'
      : 'left-full top-0 ml-2';

  return (
    <div
      className={`pointer-events-auto absolute ${position} ${compact ? 'w-56' : 'w-72'} rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 text-white text-xs px-3.5 py-2.5 shadow-2xl ring-1 ring-white/20 z-50`}
      role="dialog"
      aria-label="Hinweis zur Live-Vorschau"
    >
      <button
        type="button"
        onClick={dismiss}
        className="absolute -top-1.5 -right-1.5 h-5 w-5 grid place-items-center rounded-full bg-white text-pink-600 shadow ring-1 ring-pink-200 hover:bg-pink-50 transition-colors"
        title="Hinweis nicht mehr anzeigen"
        aria-label="Hinweis schließen"
      >
        <X size={11} strokeWidth={3} />
      </button>
      <div className="font-bold mb-0.5 flex items-center gap-1.5">
        <span aria-hidden>✏️</span>
        Neu: Texte direkt bearbeiten
      </div>
      <div className="font-normal leading-snug text-white/95">
        Öffne die Vorschau und klicke auf Texte oder Sektionen, um sie sofort zu ändern.
      </div>
      {variant !== 'right' && (
        <div className={`absolute top-full h-2.5 w-2.5 -mt-1.5 rotate-45 bg-pink-600 ${variant === 'top-right' ? 'right-6' : 'left-6'}`} />
      )}
      {variant === 'right' && (
        <div className="absolute right-full top-3 h-2.5 w-2.5 -mr-1.5 rotate-45 bg-pink-500" />
      )}
    </div>
  );
}
