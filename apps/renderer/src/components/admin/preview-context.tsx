'use client';

import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

type PreviewContextValue = {
  isOpen: boolean;
  url: string;
  refreshKey: number;
  open: (url?: string) => void;
  close: () => void;
  refresh: () => void;
  setUrl: (url: string) => void;
  sendLiveData: (payload: Record<string, unknown>) => void;
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
};

const PreviewContext = createContext<PreviewContextValue>({
  isOpen: false,
  url: '/live-preview',
  refreshKey: 0,
  open: () => {},
  close: () => {},
  refresh: () => {},
  setUrl: () => {},
  sendLiveData: () => {},
  iframeRef: { current: null },
});

export function usePreview() {
  return useContext(PreviewContext);
}

export function PreviewProvider({ children, tenantId }: { children: React.ReactNode; tenantId?: string }) {
  const defaultUrl = tenantId ? `/live-preview?tenant=${tenantId}` : '/live-preview';
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrlState] = useState(defaultUrl);
  const [refreshKey, setRefreshKey] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const open = useCallback((previewUrl?: string) => {
    setUrlState(previewUrl || defaultUrl);
    setIsOpen(true);
  }, [defaultUrl]);

  const close = useCallback(() => setIsOpen(false), []);
  const refresh = useCallback(() => setRefreshKey(k => k + 1), []);
  const setUrl = useCallback((u: string) => setUrlState(u), []);

  const sendLiveData = useCallback((payload: Record<string, unknown>) => {
    iframeRef.current?.contentWindow?.postMessage(
      { type: 'flamingo-live-preview', payload },
      '*'
    );
  }, []);

  return (
    <PreviewContext.Provider value={{ isOpen, url, refreshKey, open, close, refresh, setUrl, sendLiveData, iframeRef }}>
      {children}
    </PreviewContext.Provider>
  );
}
