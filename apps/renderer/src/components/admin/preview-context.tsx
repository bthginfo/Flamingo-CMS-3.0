'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { PreviewPanel } from './preview-panel';

type PreviewContextValue = {
  isOpen: boolean;
  open: (url: string) => void;
  close: () => void;
  refresh: () => void;
  setUrl: (url: string) => void;
};

const PreviewContext = createContext<PreviewContextValue>({
  isOpen: false,
  open: () => {},
  close: () => {},
  refresh: () => {},
  setUrl: () => {},
});

export function usePreview() {
  return useContext(PreviewContext);
}

export function PreviewProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrlState] = useState('/preview/?token=preview');
  const [refreshKey, setRefreshKey] = useState(0);

  const open = useCallback((previewUrl: string) => {
    setUrlState(previewUrl);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);
  const refresh = useCallback(() => setRefreshKey(k => k + 1), []);
  const setUrl = useCallback((u: string) => setUrlState(u), []);

  return (
    <PreviewContext.Provider value={{ isOpen, open, close, refresh, setUrl }}>
      {children}
      {isOpen && <PreviewPanel key={refreshKey} url={url} onClose={close} />}
    </PreviewContext.Provider>
  );
}
