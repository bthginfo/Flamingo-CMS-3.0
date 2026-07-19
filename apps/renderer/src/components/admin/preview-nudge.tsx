'use client';

import { useEffect, useReducer, useRef, useState } from 'react';
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
 *
 * SINGLETON: several of those toggles are on screen at once (e.g. the page
 * editor shows both the sidebar entry and the action-bar toggle), which used
 * to render the bubble two/three times. A tiny module-level registry elects a
 * single visible instance — the one with the highest `priority` currently
 * mounted — so the hint shows exactly once.
 */
const DISMISS_KEY = 'flamingo:preview-nudge-dismissed';

type NudgeEntry = { id: number; priority: number };
let nudgeEntries: NudgeEntry[] = [];
let nudgeCounter = 0;
const nudgeListeners = new Set<() => void>();
const notifyNudges = () => nudgeListeners.forEach((l) => l());
const primaryNudgeId = (): number | null =>
  nudgeEntries.length
    ? nudgeEntries.reduce((best, e) => (e.priority > best.priority ? e : best)).id
    : null;

// Dismissal is a global fact — keep it in module state so that when the primary
// instance changes (e.g. after navigation), the newly-promoted nudge already
// knows the hint was dismissed instead of re-reading stale per-instance state.
let nudgeDismissed: boolean | null = null; // null = not yet read from storage
function readNudgeDismissed(): boolean {
  if (nudgeDismissed === null) {
    nudgeDismissed = typeof window !== 'undefined' && window.localStorage.getItem(DISMISS_KEY) === '1';
  }
  return nudgeDismissed;
}
function dismissNudge() {
  if (nudgeDismissed) return;
  nudgeDismissed = true;
  if (typeof window !== 'undefined') window.localStorage.setItem(DISMISS_KEY, '1');
  notifyNudges();
}

/** Returns true only for the single highest-priority mounted nudge. */
function useIsPrimaryNudge(priority: number): boolean {
  const idRef = useRef(0);
  if (idRef.current === 0) idRef.current = ++nudgeCounter;
  const [, force] = useReducer((x: number) => x + 1, 0);

  useEffect(() => {
    const id = idRef.current;
    nudgeEntries = [...nudgeEntries, { id, priority }];
    const listener = () => force();
    nudgeListeners.add(listener);
    notifyNudges();
    return () => {
      nudgeListeners.delete(listener);
      nudgeEntries = nudgeEntries.filter((e) => e.id !== id);
      notifyNudges();
    };
  }, [priority]);

  return primaryNudgeId() === idRef.current;
}

export function PreviewNudge({
  variant = 'top-right',
  compact = false,
  priority = 0,
}: {
  variant?: 'top-right' | 'top-left' | 'right';
  compact?: boolean;
  /** Higher wins when multiple nudges are mounted at once. */
  priority?: number;
}) {
  const { isOpen } = usePreview();
  const [mounted, setMounted] = useState(false);
  const isPrimary = useIsPrimaryNudge(priority);
  const dismissed = mounted && readNudgeDismissed();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-dismiss the moment the user opens the preview — they've discovered
  // the feature on their own, no need to keep nagging.
  useEffect(() => {
    if (isOpen) dismissNudge();
  }, [isOpen]);

  if (!mounted || dismissed || isOpen || !isPrimary) return null;

  const position =
    variant === 'top-right'
      ? 'bottom-full right-0 mb-2'
      : variant === 'top-left'
      ? 'bottom-full left-0 mb-2'
      : 'left-full top-0 ml-2';

  return (
    <div
      className={`pointer-events-auto absolute hidden sm:block ${position} ${compact ? 'w-56' : 'w-72'} rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 text-white text-xs px-3.5 py-2.5 shadow-2xl ring-1 ring-white/20 z-50`}
      role="dialog"
      aria-label="Hinweis zur Live-Vorschau"
    >
      <button
        type="button"
        onClick={dismissNudge}
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
