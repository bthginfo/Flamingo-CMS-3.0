'use client';

import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';

type SaveState = 'idle' | 'dirty' | 'saving' | 'saved';

type SaveContextType = {
  state: SaveState;
  hasSaveHandler: boolean;
  hasLocalActions: boolean;
  markDirty: () => void;
  markSaving: () => void;
  markSaved: () => void;
  reset: () => void;
  registerSave: (fn: () => void | Promise<void>) => () => void;
  registerLocalActions: () => () => void;
  triggerSave: () => Promise<void>;
};

const SaveContext = createContext<SaveContextType>({
  state: 'idle',
  hasSaveHandler: false,
  hasLocalActions: false,
  markDirty: () => {},
  markSaving: () => {},
  markSaved: () => {},
  reset: () => {},
  registerSave: () => () => {},
  registerLocalActions: () => () => {},
  triggerSave: async () => {},
});

export function SaveProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SaveState>('idle');
  const [hasSaveHandler, setHasSaveHandler] = useState(false);
  const [hasLocalActions, setHasLocalActions] = useState(false);
  const pathname = usePathname();
  const saveFnsRef = useRef<Set<() => void | Promise<void>>>(new Set());
  const localActionsRef = useRef<Set<symbol>>(new Set());

  // Reset save state on navigation
  useEffect(() => { setState('idle'); }, [pathname]);

  const markDirty = useCallback(() => setState('dirty'), []);
  const markSaving = useCallback(() => setState('saving'), []);
  const markSaved = useCallback(() => setState('saved'), []);
  const reset = useCallback(() => setState('idle'), []);
  const registerSave = useCallback((fn: () => void | Promise<void>) => {
    saveFnsRef.current.add(fn);
    setHasSaveHandler(true);
    return () => {
      saveFnsRef.current.delete(fn);
      setHasSaveHandler(saveFnsRef.current.size > 0);
    };
  }, []);
  const registerLocalActions = useCallback(() => {
    const token = Symbol('local-actions');
    localActionsRef.current.add(token);
    setHasLocalActions(true);
    return () => {
      localActionsRef.current.delete(token);
      setHasLocalActions(localActionsRef.current.size > 0);
    };
  }, []);
  const triggerSave = useCallback(async () => {
    await Promise.all(Array.from(saveFnsRef.current, fn => Promise.resolve(fn())));
  }, []);

  return (
    <SaveContext.Provider value={{ state, hasSaveHandler, hasLocalActions, markDirty, markSaving, markSaved, reset, registerSave, registerLocalActions, triggerSave }}>
      {children}
    </SaveContext.Provider>
  );
}

export function useSaveState() {
  return useContext(SaveContext);
}

/** Register a save function that always calls the latest version (avoids stale closures). */
export function useRegisterSave(saveFn: () => void | Promise<void>) {
  const { registerSave } = useContext(SaveContext);
  const ref = useRef(saveFn);
  ref.current = saveFn;
  useEffect(() => registerSave(() => ref.current()), [registerSave]);
}

/** Hide the global publish FAB while an editor owns its own action bar. */
export function useSuppressGlobalActions() {
  const { registerLocalActions } = useContext(SaveContext);
  useEffect(() => registerLocalActions(), [registerLocalActions]);
}
