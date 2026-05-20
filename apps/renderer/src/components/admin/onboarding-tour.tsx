'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, ChevronRight, ChevronLeft, Rocket } from 'lucide-react';

const STORAGE_KEY = 'flamingo_onboarding_completed';

type TourStep = {
  target: string; // CSS selector
  title: string;
  description: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
};

const STEPS: TourStep[] = [
  {
    target: '[data-tour="sidebar-pages"]',
    title: 'Seiten verwalten',
    description: 'Hier finden Sie alle Seiten Ihrer Website. Erstellen, bearbeiten und ordnen Sie Ihre Inhalte.',
    placement: 'right',
  },
  {
    target: '[data-tour="sidebar-brand"]',
    title: 'Marke & Design',
    description: 'Passen Sie Farben, Schriften und den Design-Stil Ihrer Website an.',
    placement: 'right',
  },
  {
    target: '[data-tour="sidebar-media"]',
    title: 'Mediathek',
    description: 'Laden Sie Bilder hoch und verwalten Sie alle Medien zentral.',
    placement: 'right',
  },
  {
    target: '[data-tour="sidebar-nav"]',
    title: 'Navigation',
    description: 'Konfigurieren Sie das Menü und die Struktur Ihrer Website.',
    placement: 'right',
  },
  {
    target: '[data-tour="publish-fab"]',
    title: 'Veröffentlichen',
    description: 'Wenn Sie mit Ihren Änderungen zufrieden sind, veröffentlichen Sie alles mit einem Klick.',
    placement: 'left',
  },
];

function getRect(selector: string): DOMRect | null {
  const el = document.querySelector(selector);
  return el?.getBoundingClientRect() ?? null;
}

export function OnboardingTour() {
  const [active, setActive] = useState(false);
  const [step, setStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return;
    // Small delay to let DOM settle
    const t = setTimeout(() => setActive(true), 800);
    return () => clearTimeout(t);
  }, []);

  const updateRect = useCallback(() => {
    if (!active) return;
    const rect = getRect(STEPS[step].target);
    setTargetRect(rect);
  }, [active, step]);

  useEffect(() => {
    updateRect();
    window.addEventListener('resize', updateRect);
    return () => window.removeEventListener('resize', updateRect);
  }, [updateRect]);

  const finish = useCallback(() => {
    setActive(false);
    localStorage.setItem(STORAGE_KEY, '1');
  }, []);

  const next = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
    else finish();
  };

  const prev = () => {
    if (step > 0) setStep(step - 1);
  };

  if (!active) return null;

  const currentStep = STEPS[step];
  const placement = currentStep.placement || 'right';

  // Calculate tooltip position (clamped to viewport)
  let tooltipStyle: React.CSSProperties = { position: 'fixed', zIndex: 10001 };
  const tooltipW = 320;
  const tooltipH = 160;
  if (targetRect) {
    let top = 0;
    let left = 0;
    switch (placement) {
      case 'right':
        top = targetRect.top + targetRect.height / 2 - tooltipH / 2;
        left = targetRect.right + 16;
        break;
      case 'left':
        top = targetRect.top + targetRect.height / 2 - tooltipH / 2;
        left = targetRect.left - tooltipW - 16;
        break;
      case 'bottom':
        top = targetRect.bottom + 16;
        left = targetRect.left + targetRect.width / 2 - tooltipW / 2;
        break;
      case 'top':
        top = targetRect.top - tooltipH - 16;
        left = targetRect.left + targetRect.width / 2 - tooltipW / 2;
        break;
    }
    // Clamp to viewport
    top = Math.max(8, Math.min(top, window.innerHeight - tooltipH - 8));
    left = Math.max(8, Math.min(left, window.innerWidth - tooltipW - 8));
    tooltipStyle.top = top;
    tooltipStyle.left = left;
  } else {
    tooltipStyle.top = '50%';
    tooltipStyle.left = '50%';
    tooltipStyle.transform = 'translate(-50%, -50%)';
  }

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-[10000] pointer-events-none">
        {/* Dark backdrop with cutout */}
        <div className="absolute inset-0 bg-black/50 pointer-events-auto" onClick={finish} />
        {/* Highlight cutout */}
        {targetRect && (
          <div
            className="absolute rounded-lg ring-4 ring-blue-400/80 bg-transparent pointer-events-none"
            style={{
              top: targetRect.top - 4,
              left: targetRect.left - 4,
              width: targetRect.width + 8,
              height: targetRect.height + 8,
              boxShadow: '0 0 0 9999px rgba(0,0,0,0.5)',
              zIndex: 10000,
            }}
          />
        )}
      </div>

      {/* Tooltip */}
      <div style={tooltipStyle} className="w-80 bg-white rounded-xl shadow-2xl border border-zinc-200 p-5 pointer-events-auto">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-sm">{currentStep.title}</h3>
          <button onClick={finish} className="text-zinc-400 hover:text-zinc-600 -mt-1 -mr-1 p-1">
            <X size={16} />
          </button>
        </div>
        <p className="text-sm text-zinc-600 mb-4">{currentStep.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-400">{step + 1} / {STEPS.length}</span>
          <div className="flex gap-2">
            {step > 0 && (
              <button onClick={prev} className="flex items-center gap-1 text-xs text-zinc-600 hover:text-zinc-900 px-2 py-1 rounded hover:bg-zinc-100">
                <ChevronLeft size={14} /> Zurück
              </button>
            )}
            <button onClick={next} className="flex items-center gap-1 text-xs font-medium text-white bg-blue-500 hover:bg-blue-600 px-3 py-1.5 rounded-lg">
              {step < STEPS.length - 1 ? <>Weiter <ChevronRight size={14} /></> : 'Fertig'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/** Button to restart the tour manually */
export function RestartTourButton() {
  return (
    <button
      onClick={() => {
        localStorage.removeItem(STORAGE_KEY);
        window.location.reload();
      }}
      className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
    >
      <Rocket size={16} /> Tour erneut starten
    </button>
  );
}
