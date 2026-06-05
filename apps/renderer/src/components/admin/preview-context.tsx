'use client';

import { createContext, useContext, useState, useCallback, useRef, useMemo, useEffect } from 'react';

type PreviewContextValue = {
  isOpen: boolean;
  url: string;
  refreshKey: number;
  editMode: boolean;
  setEditMode: (v: boolean) => void;
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
  editMode: false,
  setEditMode: () => {},
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
  const [editMode, setEditModeState] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const open = useCallback((previewUrl?: string) => {
    setUrlState(previewUrl || defaultUrl);
    setIsOpen(true);
  }, [defaultUrl]);

  const close = useCallback(() => setIsOpen(false), []);
  const refresh = useCallback(() => setRefreshKey(k => k + 1), []);
  const setUrl = useCallback((u: string) => setUrlState(u), []);

  const sendLiveData = useCallback((payload: Record<string, unknown>) => {
    // Target the same origin only — iframe is always loaded from the renderer
    // host. Using a wildcard '*' would leak preview data to any cross-origin
    // window that ever takes over the iframe URL.
    iframeRef.current?.contentWindow?.postMessage(
      { type: 'flamingo-live-preview', payload },
      typeof window !== 'undefined' ? window.location.origin : '/',
    );
  }, []);

  // Broadcast editMode changes to the iframe so the live-preview client can
  // toggle hover-outlines / contentEditable behaviour. The setter is exposed
  // via context so the parent toolbar button (in PreviewPanel) is the sole
  // owner of the edit-mode state.
  const setEditMode = useCallback((v: boolean) => {
    setEditModeState(v);
    sendLiveData({ editMode: v });
  }, [sendLiveData]);

  // Re-broadcast editMode whenever the iframe (re-)opens or refreshes so the
  // freshly mounted client always reflects the parent's intent.
  useEffect(() => {
    if (isOpen) sendLiveData({ editMode });
  }, [isOpen, editMode, sendLiveData, refreshKey]);

  const value = useMemo(
    () => ({ isOpen, url, refreshKey, editMode, setEditMode, open, close, refresh, setUrl, sendLiveData, iframeRef }),
    [isOpen, url, refreshKey, editMode, setEditMode, open, close, refresh, setUrl, sendLiveData],
  );

  return (
    <PreviewContext.Provider value={value}>
      {children}
    </PreviewContext.Provider>
  );
}
