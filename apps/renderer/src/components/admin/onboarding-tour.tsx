'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, ChevronRight, ChevronLeft, Rocket, FileText, Palette, Image, Navigation, Sparkles } from 'lucide-react';

const STORAGE_KEY = 'flamingo_onboarding_completed';

type TourStep = {
  target: string;
  title: string;
  description: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  icon: React.ElementType;
};

const STEPS: TourStep[] = [
  {
    target: '[data-tour="sidebar-pages"]',
    title: 'Seiten verwalten',
    description: 'Hier finden Sie alle Seiten Ihrer Website. Erstellen, bearbeiten und ordnen Sie Ihre Inhalte.',
    placement: 'right',
    icon: FileText,
  },
  {
    target: '[data-tour="sidebar-brand"]',
    title: 'Marke & Design',
    description: 'Passen Sie Farben, Schriften und den Design-Stil Ihrer Website an.',
    placement: 'right',
    icon: Palette,
  },
  {
    target: '[data-tour="sidebar-media"]',
    title: 'Mediathek',
    description: 'Laden Sie Bilder hoch und verwalten Sie alle Medien zentral.',
    placement: 'right',
    icon: Image,
  },
  {
    target: '[data-tour="sidebar-nav"]',
    title: 'Navigation',
    description: 'Konfigurieren Sie das Menü und die Struktur Ihrer Website.',
    placement: 'right',
    icon: Navigation,
  },
  {
    target: '[data-tour="publish-fab"]',
    title: 'Veröffentlichen',
    description: 'Wenn Sie mit Ihren Änderungen zufrieden sind, veröffentlichen Sie alles mit einem Klick.',
    placement: 'left',
    icon: Rocket,
  },
];

function getRect(selector: string): DOMRect | null {
  const elements = document.querySelectorAll(selector);
  for (const el of elements) {
    const rect = el.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0 && rect.right > 0 && rect.left < window.innerWidth) {
      return rect;
    }
  }
  return null;
}

export function OnboardingTour() {
  const [active, setActive] = useState(false);
  const [step, setStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return;
    const t = setTimeout(() => setActive(true), 800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const updateRect = useCallback(() => {
    if (!active || isMobile) return;
    const rect = getRect(STEPS[step].target);
    setTargetRect(rect);
  }, [active, step, isMobile]);

  useEffect(() => {
    updateRect();
    if (active && !isMobile) {
      const retryTimer = setInterval(() => {
        const rect = getRect(STEPS[step].target);
        if (rect) {
          setTargetRect(rect);
          clearInterval(retryTimer);
        }
      }, 300);
      const cleanup = setTimeout(() => clearInterval(retryTimer), 3000);
      window.addEventListener('resize', updateRect);
      window.addEventListener('scroll', updateRect, true);
      return () => {
        clearInterval(retryTimer);
        clearTimeout(cleanup);
        window.removeEventListener('resize', updateRect);
        window.removeEventListener('scroll', updateRect, true);
      };
    }
  }, [updateRect, active, step, isMobile]);

  const finish = useCallback(() => {
    setActive(false);
    localStorage.setItem(STORAGE_KEY, '1');
  }, []);

  const next = () => {
    if (step < STEPS.length - 1) {
      const nextStep = step + 1;
      setStep(nextStep);
      if (!isMobile) {
        requestAnimationFrame(() => {
          const rect = getRect(STEPS[nextStep].target);
          setTargetRect(rect);
        });
      }
    } else {
      finish();
    }
  };

  const prev = () => {
    if (step > 0) {
      const prevStep = step - 1;
      setStep(prevStep);
      if (!isMobile) {
        requestAnimationFrame(() => {
          const rect = getRect(STEPS[prevStep].target);
          setTargetRect(rect);
        });
      }
    }
  };

  if (!active) return null;

  const currentStep = STEPS[step];
  const Icon = currentStep.icon;

  // Mobile: bottom-sheet style card
  if (isMobile) {
    return (
      <>
        <div className="fixed inset-0 bg-black/50 z-[10000]" onClick={finish} />
        <div className="fixed inset-x-0 bottom-0 z-[10001] p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <div className="bg-white rounded-2xl shadow-2xl p-5 max-w-md mx-auto">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Icon size={18} className="text-blue-600" />
                </div>
                <h3 className="font-semibold text-sm">{currentStep.title}</h3>
              </div>
              <button onClick={finish} className="text-zinc-400 hover:text-zinc-600 p-1">
                <X size={16} />
              </button>
            </div>
            <p className="text-sm text-zinc-600 mb-5 leading-relaxed">{currentStep.description}</p>
            {/* Progress dots */}
            <div className="flex justify-center gap-1.5 mb-4">
              {STEPS.map((_, i) => (
                <div key={i} className={`h-1.5 rounded-full transition-all ${i === step ? 'w-5 bg-blue-500' : 'w-1.5 bg-zinc-200'}`} />
              ))}
            </div>
            <div className="flex items-center justify-between">
              <button
                onClick={prev}
                disabled={step === 0}
                className="px-3 py-2 text-xs text-zinc-500 hover:text-zinc-700 disabled:opacity-0 flex items-center gap-1"
              >
                <ChevronLeft size={14} /> Zurück
              </button>
              <button
                onClick={next}
                className="px-4 py-2 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 flex items-center gap-1.5"
              >
                {step === STEPS.length - 1 ? <><Sparkles size={14} /> Los geht&apos;s!</> : <>Weiter <ChevronRight size={14} /></>}
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Desktop: tooltip tour with highlight
  const placement = currentStep.placement || 'right';
  let tooltipStyle: React.CSSProperties = { position: 'fixed', zIndex: 10002 };
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
      <div className="fixed inset-0 z-[10000]">
        <div className="absolute inset-0 pointer-events-auto" onClick={finish} />
        {targetRect && (
          <div
            className="absolute rounded-lg ring-4 ring-blue-400/80 pointer-events-none"
            style={{
              top: targetRect.top - 4,
              left: targetRect.left - 4,
              width: targetRect.width + 8,
              height: targetRect.height + 8,
              boxShadow: '0 0 0 9999px rgba(0,0,0,0.5)',
              zIndex: 10001,
            }}
          />
        )}
        {!targetRect && <div className="absolute inset-0 bg-black/50 pointer-events-none" />}
      </div>

      <div style={tooltipStyle} className="w-80 bg-white rounded-xl shadow-2xl border border-zinc-200 p-5 pointer-events-auto">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <Icon size={16} className="text-blue-500" />
            <h3 className="font-semibold text-sm">{currentStep.title}</h3>
          </div>
          <button onClick={finish} className="text-zinc-400 hover:text-zinc-600 -mt-1 -mr-1 p-1">
            <X size={16} />
          </button>
        </div>
        <p className="text-sm text-zinc-600 mb-4">{currentStep.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-400">{step + 1} / {STEPS.length}</span>
          <div className="flex gap-2">
            {step > 0 && (
              <button onClick={prev} className="px-3 py-1.5 text-xs text-zinc-500 hover:text-zinc-700 rounded-lg hover:bg-zinc-100 flex items-center gap-1">
                <ChevronLeft size={12} /> Zurück
              </button>
            )}
            <button onClick={next} className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-1">
              {step === STEPS.length - 1 ? <><Rocket size={12} /> Fertig</> : <>Weiter <ChevronRight size={12} /></>}
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
