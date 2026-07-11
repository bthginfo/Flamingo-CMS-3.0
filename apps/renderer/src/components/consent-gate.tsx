'use client';

import { ShieldCheck } from 'lucide-react';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { useConsent, type OptionalConsentCategory } from '@/lib/consent';
import { cn } from '@/lib/utils';

type Props = {
  children: ReactNode;
  category?: OptionalConsentCategory;
  provider?: string;
  className?: string;
};

function privacyHref(pathname: string | null) {
  const demo = pathname?.match(/^(\/demo\/[^/]+)/)?.[1];
  if (demo) return `${demo}/datenschutz`;
  const locale = pathname?.match(/^\/(de|en|es)(?:\/|$)/)?.[1];
  return locale ? `/${locale}/datenschutz` : '/datenschutz';
}

export function ConsentGate({
  children,
  category = 'functional',
  provider = 'Der externe Anbieter',
  className,
}: Props) {
  const pathname = usePathname();
  const { ready, consent, allowCategory } = useConsent();

  if (ready && consent[category]) return <>{children}</>;

  if (!ready) {
    return (
      <div
        aria-hidden="true"
        data-consent-state="loading"
        className={cn('grid min-h-56 place-items-center bg-[var(--token-section-bg-alt)]', className)}
      >
        <span className="h-9 w-9 animate-pulse rounded-full bg-[var(--token-divider)]" />
      </div>
    );
  }

  return (
    <div
      data-consent-state="blocked"
      data-consent-category={category}
      className={cn(
        'grid min-h-56 place-items-center bg-[var(--token-section-bg-alt)] p-6 text-center',
        className,
      )}
    >
      <div className="max-w-md">
        <ShieldCheck aria-hidden="true" className="mx-auto text-[color:var(--token-icon)]" size={28} />
        <p className="mt-3 font-bold text-[color:var(--token-heading)]">Externer Inhalt ist deaktiviert</p>
        <p className="mt-2 text-sm leading-6 text-[color:var(--token-body)]">
          {provider} wird erst geladen, wenn Sie funktionalen Inhalten zustimmen. Dabei kann eine Verbindung zu einem Drittanbieter entstehen.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => allowCategory(category)}
            className="min-h-11 rounded-full bg-[var(--token-btn-bg)] px-5 py-2.5 text-sm font-bold text-[color:var(--token-btn-text)] transition hover:brightness-110"
          >
            Inhalt laden
          </button>
          <a
            href={privacyHref(pathname)}
            className="min-h-11 content-center px-2 text-sm font-semibold text-[color:var(--token-heading)] underline decoration-[var(--token-divider)] underline-offset-4"
          >
            Datenschutz
          </a>
        </div>
      </div>
    </div>
  );
}
