'use client';

import { useEffect, useMemo, useState } from 'react';
import { X, ArrowRight } from 'lucide-react';
import type { SectionProps } from '../restaurant';

type Cta = { label?: string; href?: string };

function asCta(value: unknown): Cta {
  return value && typeof value === 'object' ? value as Cta : {};
}

function asNumber(value: unknown, fallback: number) {
  const number = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(number) && number >= 0 ? number : fallback;
}

export function PopupSection({ data }: SectionProps) {
  const title = (data.title as string) || 'Kurz gefragt';
  const subtitle = (data.subtitle as string) || '';
  const text = (data.text as string) || '';
  const primaryCta = asCta(data.primaryCta);
  const secondaryCta = asCta(data.secondaryCta);
  const delayMs = asNumber(data.delayMs ?? data.triggerDelayMs, 2500);
  const mode = data.frequency === 'session' || data.showMode === 'session' ? 'session' : 'once';
  const storageKey = useMemo(() => {
    const raw = `${title}-${subtitle}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return `flamingo-popup-${raw || 'default'}`;
  }, [title, subtitle]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const storage = mode === 'session' ? window.sessionStorage : window.localStorage;
    if (storage.getItem(storageKey) === 'closed') return;

    const timer = window.setTimeout(() => setOpen(true), delayMs);
    return () => window.clearTimeout(timer);
  }, [delayMs, mode, storageKey]);

  function close() {
    const storage = mode === 'session' ? window.sessionStorage : window.localStorage;
    storage.setItem(storageKey, 'closed');
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 py-8">
      <button
        type="button"
        aria-label="Popup schließen"
        onClick={close}
        className="absolute inset-0 bg-[color-mix(in_srgb,var(--token-section-bg-alt)_62%,transparent)] backdrop-blur-[2px]"
      />
      <div className="relative w-full max-w-xl overflow-hidden rounded-[var(--token-card-radius)] border border-[var(--token-card-border)] bg-[var(--token-card-bg)] p-6 text-[color:var(--token-body)] shadow-[0_30px_120px_rgba(0,0,0,0.35)] md:p-8">
        <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-[color-mix(in_srgb,var(--token-accent)_20%,transparent)] blur-3xl" />
        <button
          type="button"
          onClick={close}
          aria-label="Popup schließen"
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-[var(--token-card-border)] bg-[color-mix(in_srgb,var(--token-card-bg)_80%,transparent)] text-[color:var(--token-muted)] shadow-sm backdrop-blur transition hover:bg-[var(--token-card-bg)]"
        >
          <X size={18} />
        </button>

        <div className="relative pr-10">
          {subtitle && <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--token-eyebrow)]" data-edit-path="subtitle">{subtitle}</p>}
          <h2 className="max-w-lg text-3xl font-black leading-tight text-[color:var(--token-heading)] md:text-4xl" data-edit-path="title">{title}</h2>
          {text && <div className="rt-content mt-5 text-base leading-8 text-[color:var(--token-body)]" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: text }} />}
        </div>

        {(primaryCta.label || secondaryCta.label) && (
          <div className="relative mt-7 flex flex-col gap-3 sm:flex-row">
            {primaryCta.label && (
              <a data-edit-link="primaryCta" href={primaryCta.href || '#'} onClick={close} className="inline-flex items-center justify-center gap-2 rounded-[var(--token-button-radius)] bg-[var(--token-btn-bg)] px-5 py-3 text-sm font-bold text-[color:var(--token-btn-text)] shadow-lg transition hover:brightness-110">
                <span data-edit-path="label">{primaryCta.label}</span>
                <ArrowRight size={16} />
              </a>
            )}
            {secondaryCta.label && (
              <a data-edit-link="secondaryCta" href={secondaryCta.href || '#'} onClick={close} className="inline-flex items-center justify-center rounded-[var(--token-button-radius)] border border-[var(--token-card-border)] bg-[color-mix(in_srgb,var(--token-card-bg)_70%,transparent)] px-5 py-3 text-sm font-bold text-[color:var(--token-heading)] transition hover:bg-[var(--token-btn-secondary-bg,#f1f5f9)]" data-edit-path="label">
                {secondaryCta.label}
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
