'use client';

import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';

type SaveState = 'idle' | 'dirty' | 'saving' | 'saved';

type SaveContextType = {
  state: SaveState;
  hasSaveHandler: boolean;
  markDirty: () => void;
  markSaving: () => void;
  markSaved: () => void;
  reset: () => void;
  registerSave: (fn: () => void) => void;
  triggerSave: () => void;
};

const SaveContext = createContext<SaveContextType>({
  state: 'idle',
  hasSaveHandler: false,
  markDirty: () => {},
  markSaving: () => {},
  markSaved: () => {},
  reset: () => {},
  registerSave: () => {},
  triggerSave: () => {},
});

export function SaveProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SaveState>('idle');
  const [hasSaveHandler, setHasSaveHandler] = useState(false);
  const pathname = usePathname();
  const saveFnsRef = useRef<Set<() => void>>(new Set());

  // Reset save state on navigation
  useEffect(() => { setState('idle'); saveFnsRef.current = new Set(); setHasSaveHandler(false); }, [pathname]);

  const markDirty = useCallback(() => setState('dirty'), []);
  const markSaving = useCallback(() => setState('saving'), []);
  const markSaved = useCallback(() => setState('saved'), []);
  const reset = useCallback(() => setState('idle'), []);
  const registerSave = useCallback((fn: () => void) => { saveFnsRef.current.add(fn); setHasSaveHandler(true); return () => { saveFnsRef.current.delete(fn); }; }, []);
  const triggerSave = useCallback(() => { saveFnsRef.current.forEach(fn => fn()); }, []);

  return (
    <SaveContext.Provider value={{ state, hasSaveHandler, markDirty, markSaving, markSaved, reset, registerSave, triggerSave }}>
      {children}
    </SaveContext.Provider>
  );
}

export function useSaveState() {
  return useContext(SaveContext);
}

/** Register a save function that always calls the latest version (avoids stale closures). */
export function useRegisterSave(saveFn: () => void) {
  const { registerSave } = useContext(SaveContext);
  const ref = useRef(saveFn);
  ref.current = saveFn;
  useEffect(() => { registerSave(() => ref.current()); }, [registerSave]);
}
