'use client';

import { createContext, useContext, useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { createLivePreviewRelay } from './preview-live-data';

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
  const liveRelayRef = useRef<ReturnType<typeof createLivePreviewRelay> | null>(null);
  if (!liveRelayRef.current) liveRelayRef.current = createLivePreviewRelay();

  const open = useCallback((previewUrl?: string) => {
    setUrlState(previewUrl || defaultUrl);
    setIsOpen(true);
  }, [defaultUrl]);

  const close = useCallback(() => setIsOpen(false), []);
  const refresh = useCallback(() => setRefreshKey(k => k + 1), []);
  const setUrl = useCallback((u: string) => setUrlState(u), []);

  const sendLiveData = useCallback((payload: Record<string, unknown>) => {
    liveRelayRef.current?.send(
      payload,
      iframeRef.current?.contentWindow,
      typeof window !== 'undefined' ? window.location.origin : '/',
    );
  }, []);

  useEffect(() => {
    function handlePreviewReady(event: MessageEvent) {
      const previewWindow = iframeRef.current?.contentWindow;
      if (
        !previewWindow
        || event.source !== previewWindow
        || event.origin !== window.location.origin
        || event.data?.type !== 'flamingo-live-preview-ready'
      ) {
        return;
      }

      liveRelayRef.current?.replay(previewWindow, window.location.origin);
    }

    window.addEventListener('message', handlePreviewReady);
    return () => window.removeEventListener('message', handlePreviewReady);
  }, []);

  // Broadcast edit-mode changes to the same-origin preview.
  const setEditMode = useCallback((v: boolean) => {
    setEditModeState(v);
    sendLiveData({ editMode: v });
  }, [sendLiveData]);

  // A newly mounted iframe also receives this state through the ready replay.
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
