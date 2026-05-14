'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

export type ConsentCategory = 'necessary' | 'functional' | 'analytics' | 'marketing';
type ConsentState = Record<Exclude<ConsentCategory, 'necessary'>, boolean>;
const STORAGE_KEY = 'flamingo_consent';

const defaults: ConsentState = { functional: false, analytics: false, marketing: false };

type Ctx = {
  needsDecision: boolean;
  consent: ConsentState;
  acceptAll: () => void;
  rejectAll: () => void;
  setConsent: (c: ConsentState) => void;
};

const ConsentContext = createContext<Ctx>({ needsDecision: true, consent: defaults, acceptAll: () => {}, rejectAll: () => {}, setConsent: () => {} });

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsentState] = useState<ConsentState>(defaults);
  const [needsDecision, setNeedsDecision] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) { setConsentState(JSON.parse(stored)); setNeedsDecision(false); }
    } catch { /* empty */ }
  }, []);

  const save = useCallback((c: ConsentState) => {
    setConsentState(c);
    setNeedsDecision(false);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
  }, []);

  return (
    <ConsentContext.Provider value={{
      needsDecision, consent,
      acceptAll: () => save({ functional: true, analytics: true, marketing: true }),
      rejectAll: () => save(defaults),
      setConsent: save,
    }}>
      {children}
    </ConsentContext.Provider>
  );
}

export function useConsent() { return useContext(ConsentContext); }
