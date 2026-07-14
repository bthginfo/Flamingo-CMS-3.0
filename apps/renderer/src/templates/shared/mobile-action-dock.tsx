'use client';

import { useEffect, useState } from 'react';
import { DynamicIcon } from '@/components/ui/icon-map';
import {
  normalizeMobileActionDockData,
  shouldHideActionDockForPath,
  type MobileAction,
} from '@/lib/mobile-action-dock';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

const BLOCKING_SURFACES = '[data-consent-banner], [aria-modal="true"], [data-cart-drawer]';

function hasVisibleBlockingSurface() {
  return Array.from(document.querySelectorAll<HTMLElement>(BLOCKING_SURFACES))
    .some((element) => element.getClientRects().length > 0 && getComputedStyle(element).visibility !== 'hidden');
}

function ActionItems({ actions }: { actions: MobileAction[] }) {
  return (
    <div className="grid flex-1 auto-cols-fr grid-flow-col gap-1.5 sm:gap-2">
      {actions.map((action, index) => (
        <a
          key={`${action.kind}-${action.href}-${index}`}
          href={action.href}
          data-edit-collection="actions"
          data-edit-index={index}
          data-edit-link="href"
          data-event="mobile-action"
          data-action={action.kind}
          className={`group/action flex min-h-11 min-w-0 items-center justify-center gap-2 rounded-[var(--token-button-radius)] border px-3 text-center text-sm font-semibold outline-none transition-[transform,background-color,color,border-color] focus-visible:ring-2 focus-visible:ring-[var(--token-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--token-card-bg)] active:scale-[0.98] motion-reduce:transition-none ${
            index === 0
              ? 'border-[var(--token-btn-bg)] bg-[var(--token-btn-bg)] text-[color:var(--token-btn-text)] hover:brightness-95'
              : 'border-[var(--token-btn-secondary-border)] bg-[var(--token-btn-secondary-bg)] text-[color:var(--token-btn-secondary-text)] hover:bg-[color-mix(in_srgb,var(--token-btn-secondary-bg)_82%,var(--token-accent))]'
          }`}
          aria-label={action.label}
        >
          <DynamicIcon name={action.icon} size={18} className="shrink-0" editPath="icon" />
          <span className="truncate" data-edit-path="label">{action.label}</span>
        </a>
      ))}
    </div>
  );
}

function DockSurface({ compactLabel, actions, mobile = false }: { compactLabel: string; actions: MobileAction[]; mobile?: boolean }) {
  return (
    <nav
      aria-label="Schnellaktionen"
      className={`border border-[var(--token-card-border)] bg-[var(--token-card-bg)] text-[color:var(--token-card-body,var(--token-body))] shadow-[0_18px_55px_color-mix(in_srgb,var(--token-shadow)_22%,transparent)] ${
        mobile
          ? 'mx-auto flex w-full max-w-xl items-center gap-3 rounded-[calc(var(--token-card-radius)+0.25rem)] p-2'
          : 'mx-auto flex max-w-5xl items-center gap-5 rounded-[var(--token-card-radius)] p-3'
      }`}
    >
      {compactLabel && (
        <p className={`${mobile ? 'hidden min-[430px]:block max-w-28' : 'max-w-52'} shrink-0 text-xs font-semibold leading-4 text-[color:var(--token-card-muted,var(--token-muted))]`} data-edit-path="compactLabel">
          {compactLabel}
        </p>
      )}
      <ActionItems actions={actions} />
    </nav>
  );
}

export function MobileActionDockSection({ data }: Props) {
  const config = normalizeMobileActionDockData(data);
  const [mobileVisible, setMobileVisible] = useState(!config.revealAfterScroll);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    const updateVisibility = () => {
      setMobileVisible(!config.revealAfterScroll || window.scrollY >= config.revealAfterPx);
      setBlocked(
        shouldHideActionDockForPath(window.location.pathname, config.hideOnPaths)
        || hasVisibleBlockingSurface(),
      );
    };
    updateVisibility();
    window.addEventListener('scroll', updateVisibility, { passive: true });
    const observer = new MutationObserver(updateVisibility);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => {
      window.removeEventListener('scroll', updateVisibility);
      observer.disconnect();
    };
  }, [config.hideOnPaths.join('|'), config.revealAfterPx, config.revealAfterScroll]);

  if (config.actions.length === 0) return null;

  return (
    <section className="relative bg-[var(--token-section-bg)] text-[color:var(--token-body)]" aria-label="Schnellaktionen">
      {config.desktopMode === 'inline' && (
        <div className="hidden px-6 py-5 md:block">
          <DockSurface compactLabel={config.compactLabel} actions={config.actions} />
        </div>
      )}
      {mobileVisible && !blocked && (
        <div
          className="cms-mobile-action-dock pointer-events-none fixed inset-x-0 z-[55] px-3 md:hidden"
          style={{ bottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
        >
          <div className="pointer-events-auto motion-safe:animate-[mobile-dock-in_280ms_cubic-bezier(0.22,1,0.36,1)_both]">
            <DockSurface compactLabel={config.compactLabel} actions={config.actions} mobile />
          </div>
        </div>
      )}
      <style>{`@keyframes mobile-dock-in { from { opacity: 0; transform: translateY(14px) scale(.985); } to { opacity: 1; transform: translateY(0) scale(1); } }`}</style>
    </section>
  );
}
