'use client';

import { useState, useEffect } from 'react';
import { SectionRenderer } from '@/components/section-renderer';
import type { SnapshotSection } from '@/lib/snapshot';

/**
 * Client-side live preview page.
 * Receives section data via postMessage from the admin editor.
 * No DB calls — purely client-rendered.
 */
export default function LivePreviewPage() {
  const [sections, setSections] = useState<SnapshotSection[]>([]);
  const [industry, setIndustry] = useState('tradesman');
  const [styleVariant, setStyleVariant] = useState('classic');
  const [cssVars, setCssVars] = useState<Record<string, string>>({});

  useEffect(() => {
    function handleMessage(e: MessageEvent) {
      if (!e.data || e.data.type !== 'flamingo-live-preview') return;
      const { sections: s, industry: ind, styleVariant: sv, cssVars: vars } = e.data.payload;
      if (s) setSections(s);
      if (ind) setIndustry(ind);
      if (sv) setStyleVariant(sv);
      if (vars) setCssVars(vars);
    }
    window.addEventListener('message', handleMessage);
    // Signal parent that we're ready
    window.parent?.postMessage({ type: 'flamingo-live-preview-ready' }, '*');
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const visibleSections = sections.filter(s => s.visible !== false);

  return (
    <div style={cssVars as React.CSSProperties}>
      <div className="fixed top-0 left-0 right-0 z-[9999] bg-green-600 text-white text-center text-xs py-1 font-medium">
        Live-Vorschau
      </div>
      <main className="pt-6">
        {visibleSections.length === 0 && (
          <div className="flex items-center justify-center h-[60vh] text-gray-400 text-sm">
            Bearbeite Sektionen im Editor um die Live-Vorschau zu sehen…
          </div>
        )}
        {visibleSections.map((section) => (
          <SectionRenderer key={section.id} section={section} styleVariant={styleVariant} industry={industry} />
        ))}
      </main>
    </div>
  );
}
