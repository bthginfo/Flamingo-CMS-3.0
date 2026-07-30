'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Eye,
  FileText,
  Palette,
  Rocket,
  Sparkles,
  X,
} from 'lucide-react';

export const ONBOARDING_VERSION = 'v2';

export function onboardingStorageKey(tenantId: string) {
  return `flamingo:onboarding:${ONBOARDING_VERSION}:${tenantId}`;
}

function onboardingDismissedKey(tenantId: string) {
  return `flamingo:onboarding:dismissed:${ONBOARDING_VERSION}:${tenantId}`;
}

type TourStep = {
  target: string;
  fallbackHref: string;
  title: string;
  description: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  icon: React.ElementType;
};

export const ONBOARDING_STEPS: TourStep[] = [
  {
    target: '[data-tour="sidebar-pages"]',
    fallbackHref: '/admin/pages',
    title: 'Seiten und Inhalte',
    description: 'Hier bearbeitest du Seiten, ordnest Sections und pflegst die Inhalte deiner Website.',
    placement: 'right',
    icon: FileText,
  },
  {
    target: '[data-tour="sidebar-brand"]',
    fallbackHref: '/admin/brand',
    title: 'Marke und Design',
    description: 'Hier steuerst du Farben, Schriften und den grundlegenden Look deiner Website.',
    placement: 'right',
    icon: Palette,
  },
  {
    target: '[data-tour="admin-preview"]',
    fallbackHref: '/admin',
    title: 'Vorschau öffnen',
    description: 'Prüfe deine Änderungen vor dem Veröffentlichen auf Desktop und Mobilgeräten.',
    placement: 'right',
    icon: Eye,
  },
  {
    target: '[data-tour="sidebar-help"]',
    fallbackHref: '/admin/help',
    title: 'Hilfe finden',
    description: 'Die Hilfe führt dich direkt zur passenden Einstellung oder zum nächsten Arbeitsschritt.',
    placement: 'right',
    icon: CircleHelp,
  },
];

function getRect(selector: string): DOMRect | null {
  const elements = document.querySelectorAll(selector);
  for (const element of elements) {
    const rect = element.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0 && rect.right > 0 && rect.left < window.innerWidth) {
      return rect;
    }
  }
  return null;
}

export function OnboardingTour({ tenantId }: { tenantId: string }) {
  const [active, setActive] = useState(false);
  const [step, setStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (
      localStorage.getItem(onboardingStorageKey(tenantId))
      || sessionStorage.getItem(onboardingDismissedKey(tenantId))
    ) return;
    const timer = window.setTimeout(() => {
      returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setActive(true);
    }, 800);
    return () => window.clearTimeout(timer);
  }, [tenantId]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const dismiss = useCallback(() => {
    sessionStorage.setItem(onboardingDismissedKey(tenantId), '1');
    setActive(false);
    window.setTimeout(() => returnFocusRef.current?.focus(), 0);
  }, [tenantId]);

  const finish = useCallback(() => {
    localStorage.setItem(onboardingStorageKey(tenantId), new Date().toISOString());
    sessionStorage.removeItem(onboardingDismissedKey(tenantId));
    setActive(false);
    window.setTimeout(() => returnFocusRef.current?.focus(), 0);
  }, [tenantId]);

  useEffect(() => {
    if (!active) return;
    const dialog = dialogRef.current;
    dialog?.querySelector<HTMLElement>(
      'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
    )?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        dismiss();
        return;
      }
      if (event.key !== 'Tab' || !dialog) return;
      const controls = Array.from(dialog.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
      ));
      if (!controls.length) return;
      const first = controls[0];
      const last = controls.at(-1)!;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [active, dismiss, step]);

  const updateRect = useCallback(() => {
    if (!active || isMobile) return;
    setTargetRect(getRect(ONBOARDING_STEPS[step].target));
  }, [active, isMobile, step]);

  useEffect(() => {
    updateRect();
    if (!active || isMobile) return;
    const retryTimer = window.setInterval(() => {
      const rect = getRect(ONBOARDING_STEPS[step].target);
      if (rect) {
        setTargetRect(rect);
        window.clearInterval(retryTimer);
      }
    }, 300);
    const cleanup = window.setTimeout(() => window.clearInterval(retryTimer), 3000);
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect, true);
    return () => {
      window.clearInterval(retryTimer);
      window.clearTimeout(cleanup);
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect, true);
    };
  }, [active, isMobile, step, updateRect]);

  const changeStep = (nextStep: number) => {
    setStep(nextStep);
    if (!isMobile) {
      requestAnimationFrame(() => setTargetRect(getRect(ONBOARDING_STEPS[nextStep].target)));
    }
  };

  const next = () => {
    if (step < ONBOARDING_STEPS.length - 1) changeStep(step + 1);
    else finish();
  };

  if (!active) return null;

  const currentStep = ONBOARDING_STEPS[step];
  const Icon = currentStep.icon;
  const placement = currentStep.placement || 'right';
  const tooltipWidth = 336;
  const tooltipHeight = 230;
  const tooltipStyle: React.CSSProperties = { position: 'fixed', zIndex: 10002 };

  if (!isMobile && targetRect) {
    let top = targetRect.top + targetRect.height / 2 - tooltipHeight / 2;
    let left = targetRect.right + 16;
    if (placement === 'left') left = targetRect.left - tooltipWidth - 16;
    if (placement === 'bottom') {
      top = targetRect.bottom + 16;
      left = targetRect.left + targetRect.width / 2 - tooltipWidth / 2;
    }
    if (placement === 'top') {
      top = targetRect.top - tooltipHeight - 16;
      left = targetRect.left + targetRect.width / 2 - tooltipWidth / 2;
    }
    tooltipStyle.top = Math.max(8, Math.min(top, window.innerHeight - tooltipHeight - 8));
    tooltipStyle.left = Math.max(8, Math.min(left, window.innerWidth - tooltipWidth - 8));
  } else if (!isMobile) {
    tooltipStyle.top = '50%';
    tooltipStyle.left = '50%';
    tooltipStyle.transform = 'translate(-50%, -50%)';
  }

  const card = (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-tour-title"
      aria-describedby="onboarding-tour-description"
      style={isMobile ? undefined : tooltipStyle}
      className={isMobile
        ? 'pointer-events-auto w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-5 shadow-2xl'
        : 'pointer-events-auto w-[21rem] rounded-2xl border border-zinc-200 bg-white p-5 shadow-2xl'}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
            <Icon size={19} aria-hidden="true" />
          </span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-400">Kurze Orientierung</p>
            <h2 id="onboarding-tour-title" className="mt-0.5 text-sm font-semibold text-zinc-950">{currentStep.title}</h2>
          </div>
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="flex size-9 shrink-0 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          aria-label="Tour schließen und später fortsetzen"
        >
          <X size={17} aria-hidden="true" />
        </button>
      </div>
      <p id="onboarding-tour-description" className="mt-4 text-sm leading-6 text-zinc-600">{currentStep.description}</p>

      {!targetRect && !isMobile && (
        <Link href={currentStep.fallbackHref} className="mt-3 inline-flex text-xs font-semibold text-blue-700 hover:underline">
          Bereich direkt öffnen
        </Link>
      )}

      <ol aria-label={`Schritt ${step + 1} von ${ONBOARDING_STEPS.length}`} className="mt-5 flex gap-1.5">
        {ONBOARDING_STEPS.map((item, index) => (
          <li
            key={item.title}
            aria-current={index === step ? 'step' : undefined}
            className={`h-1.5 rounded-full transition-all ${index === step ? 'w-7 bg-blue-600' : index < step ? 'w-3 bg-blue-200' : 'w-3 bg-zinc-200'}`}
          >
            <span className="sr-only">Schritt {index + 1}: {item.title}</span>
          </li>
        ))}
      </ol>

      <div className="mt-5 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => changeStep(step - 1)}
          disabled={step === 0}
          className="inline-flex min-h-10 items-center gap-1 rounded-lg px-3 text-xs font-semibold text-zinc-600 transition hover:bg-zinc-100 disabled:invisible focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <ChevronLeft size={14} aria-hidden="true" /> Zurück
        </button>
        <button
          type="button"
          onClick={next}
          className="inline-flex min-h-10 items-center gap-1.5 rounded-lg bg-blue-600 px-4 text-xs font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          {step === ONBOARDING_STEPS.length - 1
            ? <><Sparkles size={14} aria-hidden="true" /> Orientierung abschließen</>
            : <>Weiter <ChevronRight size={14} aria-hidden="true" /></>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div className="fixed inset-0 z-[10000]" aria-hidden="true">
        <div className="absolute inset-0" />
        {!isMobile && targetRect ? (
          <div
            className="pointer-events-none absolute rounded-lg ring-4 ring-blue-400/80"
            style={{
              top: targetRect.top - 4,
              left: targetRect.left - 4,
              width: targetRect.width + 8,
              height: targetRect.height + 8,
              boxShadow: '0 0 0 9999px rgba(0,0,0,0.52)',
              zIndex: 10001,
            }}
          />
        ) : (
          <div className="pointer-events-none absolute inset-0 bg-black/50" />
        )}
      </div>
      {isMobile ? (
        <div className="fixed inset-x-0 bottom-0 z-[10002] flex justify-center p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          {card}
        </div>
      ) : card}
    </>
  );
}

/** Starts the short orientation tour again without changing checklist progress. */
export function RestartTourButton({ tenantId }: { tenantId: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        localStorage.removeItem(onboardingStorageKey(tenantId));
        sessionStorage.removeItem(onboardingDismissedKey(tenantId));
        window.location.reload();
      }}
      className="inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
    >
      <Rocket size={16} aria-hidden="true" /> Kurze Orientierung erneut starten
    </button>
  );
}
