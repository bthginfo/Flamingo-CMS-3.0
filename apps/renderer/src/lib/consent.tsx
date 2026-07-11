'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type ConsentCategory = 'necessary' | 'functional' | 'analytics' | 'marketing';
export type OptionalConsentCategory = Exclude<ConsentCategory, 'necessary'>;
export type ConsentSelection = Record<OptionalConsentCategory, boolean>;

export type StoredConsent = ConsentSelection & {
  necessary: true;
  ts: number;
  v: number;
};

export const CONSENT_STORAGE_KEY = 'flamingo_consent';
export const CONSENT_VERSION = 1;

const EMPTY_SELECTION: ConsentSelection = {
  functional: false,
  analytics: false,
  marketing: false,
};

export function undecidedConsent(): StoredConsent {
  return {
    necessary: true,
    ...EMPTY_SELECTION,
    ts: 0,
    v: CONSENT_VERSION,
  };
}

export function createStoredConsent(selection: ConsentSelection, now = Date.now()): StoredConsent {
  return {
    necessary: true,
    functional: selection.functional === true,
    analytics: selection.analytics === true,
    marketing: selection.marketing === true,
    ts: Number.isFinite(now) && now > 0 ? now : Date.now(),
    v: CONSENT_VERSION,
  };
}

/** Strict parsing prevents corrupt or stale storage from silently granting consent. */
export function parseStoredConsent(raw: string | null): StoredConsent | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as Partial<StoredConsent>;
    if (
      value.v !== CONSENT_VERSION
      || value.necessary !== true
      || typeof value.ts !== 'number'
      || !Number.isFinite(value.ts)
      || value.ts <= 0
      || typeof value.functional !== 'boolean'
      || typeof value.analytics !== 'boolean'
      || typeof value.marketing !== 'boolean'
    ) {
      return null;
    }
    return createStoredConsent({
      functional: value.functional,
      analytics: value.analytics,
      marketing: value.marketing,
    }, value.ts);
  } catch {
    return null;
  }
}

type ConsentContextValue = {
  ready: boolean;
  needsDecision: boolean;
  consent: StoredConsent;
  acceptAll: () => void;
  rejectAll: () => void;
  setConsent: (selection: ConsentSelection) => void;
  allowCategory: (category: OptionalConsentCategory) => void;
  revoke: () => void;
};

const FALLBACK_CONTEXT: ConsentContextValue = {
  ready: false,
  needsDecision: false,
  consent: undecidedConsent(),
  acceptAll: () => {},
  rejectAll: () => {},
  setConsent: () => {},
  allowCategory: () => {},
  revoke: () => {},
};

const ConsentContext = createContext<ConsentContextValue | null>(null);

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsentState] = useState<StoredConsent>(undecidedConsent);
  const [ready, setReady] = useState(false);

  const persist = useCallback((next: StoredConsent) => {
    try {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Consent still applies for this page view when storage is unavailable.
    }
    window.dispatchEvent(new CustomEvent('flamingo:consent-change', { detail: next }));
  }, []);

  useEffect(() => {
    let loaded: StoredConsent | null = null;
    try {
      loaded = parseStoredConsent(window.localStorage.getItem(CONSENT_STORAGE_KEY));
    } catch {
      // Storage can be disabled by the browser. Fail closed and ask again.
    }
    setConsentState(loaded || undecidedConsent());
    setReady(true);

    const syncAcrossTabs = (event: StorageEvent) => {
      if (event.key !== CONSENT_STORAGE_KEY) return;
      setConsentState(parseStoredConsent(event.newValue) || undecidedConsent());
    };
    window.addEventListener('storage', syncAcrossTabs);
    return () => window.removeEventListener('storage', syncAcrossTabs);
  }, []);

  const commit = useCallback((selection: ConsentSelection) => {
    const next = createStoredConsent(selection);
    setConsentState(next);
    setReady(true);
    persist(next);
  }, [persist]);

  const acceptAll = useCallback(() => {
    commit({ functional: true, analytics: true, marketing: true });
  }, [commit]);

  const rejectAll = useCallback(() => {
    commit(EMPTY_SELECTION);
  }, [commit]);

  const allowCategory = useCallback((category: OptionalConsentCategory) => {
    setConsentState((current) => {
      const next = createStoredConsent({
        functional: current.functional,
        analytics: current.analytics,
        marketing: current.marketing,
        [category]: true,
      });
      persist(next);
      return next;
    });
    setReady(true);
  }, [persist]);

  const revoke = useCallback(() => {
    try {
      window.localStorage.removeItem(CONSENT_STORAGE_KEY);
    } catch {
      // Best effort only.
    }
    setConsentState(undecidedConsent());
    setReady(true);
  }, []);

  const value = useMemo<ConsentContextValue>(() => ({
    ready,
    needsDecision: ready && consent.ts === 0,
    consent,
    acceptAll,
    rejectAll,
    setConsent: commit,
    allowCategory,
    revoke,
  }), [acceptAll, allowCategory, commit, consent, ready, rejectAll, revoke]);

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
}

export function useConsent(): ConsentContextValue {
  return useContext(ConsentContext) || FALLBACK_CONTEXT;
}
