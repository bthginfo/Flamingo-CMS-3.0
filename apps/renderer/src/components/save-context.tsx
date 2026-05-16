'use client';

import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';

type SaveState = 'idle' | 'dirty' | 'saving' | 'saved';

type SaveContextType = {
  state: SaveState;
  markDirty: () => void;
  markSaving: () => void;
  markSaved: () => void;
  reset: () => void;
  registerSave: (fn: () => void) => void;
  triggerSave: () => void;
};

const SaveContext = createContext<SaveContextType>({
  state: 'idle',
  markDirty: () => {},
  markSaving: () => {},
  markSaved: () => {},
  reset: () => {},
  registerSave: () => {},
  triggerSave: () => {},
});

export function SaveProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SaveState>('idle');
  const pathname = usePathname();
  const saveFnRef = useRef<(() => void) | null>(null);

  // Reset save state on navigation
  useEffect(() => { setState('idle'); saveFnRef.current = null; }, [pathname]);

  const markDirty = useCallback(() => setState('dirty'), []);
  const markSaving = useCallback(() => setState('saving'), []);
  const markSaved = useCallback(() => setState('saved'), []);
  const reset = useCallback(() => setState('idle'), []);
  const registerSave = useCallback((fn: () => void) => { saveFnRef.current = fn; }, []);
  const triggerSave = useCallback(() => { saveFnRef.current?.(); }, []);

  return (
    <SaveContext.Provider value={{ state, markDirty, markSaving, markSaved, reset, registerSave, triggerSave }}>
      {children}
    </SaveContext.Provider>
  );
}

export function useSaveState() {
  return useContext(SaveContext);
}
