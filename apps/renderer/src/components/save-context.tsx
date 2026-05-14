'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

type SaveState = 'idle' | 'dirty' | 'saving' | 'saved';

type SaveContextType = {
  state: SaveState;
  markDirty: () => void;
  markSaving: () => void;
  markSaved: () => void;
  reset: () => void;
};

const SaveContext = createContext<SaveContextType>({
  state: 'idle',
  markDirty: () => {},
  markSaving: () => {},
  markSaved: () => {},
  reset: () => {},
});

export function SaveProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SaveState>('idle');

  const markDirty = useCallback(() => setState('dirty'), []);
  const markSaving = useCallback(() => setState('saving'), []);
  const markSaved = useCallback(() => setState('saved'), []);
  const reset = useCallback(() => setState('idle'), []);

  return (
    <SaveContext.Provider value={{ state, markDirty, markSaving, markSaved, reset }}>
      {children}
    </SaveContext.Provider>
  );
}

export function useSaveState() {
  return useContext(SaveContext);
}
