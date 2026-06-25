'use client';

import { useState } from 'react';
import { plain } from '@/lib/strip-html';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function TattooBookingSection({ data }: Props) {
  const headline = (data.headline as string) || 'Terminanfrage';
  const subline = (data.subline as string) || 'Beschreib uns Dein Wunschmotiv – wir melden uns innerhalb von 48h.';
  const artists = (data.artists as string[]) || [];
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <section className="py-20 px-6 bg-[var(--token-section-bg-alt)]">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-4xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-[color:var(--token-on-dark-heading)]">Anfrage gesendet!</h2>
          <p className="text-[color:color-mix(in_srgb,var(--token-on-dark-heading)_50%,transparent)] mt-2">Wir melden uns schnellstmöglich bei Dir.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-6 bg-[var(--token-section-bg-alt)]" id="kontakt">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-[color:var(--token-on-dark-heading)]" data-edit-path="headline">{headline}</h2>
          {subline && <p className="mt-3 text-[color:color-mix(in_srgb,var(--token-on-dark-heading)_50%,transparent)]" data-edit-path="subline">{plain(subline)}</p>}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-[color:color-mix(in_srgb,var(--token-on-dark-heading)_60%,transparent)] text-sm">Name *</span>
              <input required type="text" className="mt-1 w-full bg-[color-mix(in_srgb,var(--token-input-bg)_5%,transparent)] border border-[color:color-mix(in_srgb,var(--token-input-border)_10%,transparent)] rounded-lg px-4 py-3 text-[color:var(--token-on-dark-heading)] placeholder:text-[color:color-mix(in_srgb,var(--token-on-dark-heading)_30%,transparent)] focus:outline-none focus:border-[color:color-mix(in_srgb,var(--token-input-border)_30%,transparent)]" placeholder="Dein Name" />
            </label>
            <label className="block">
              <span className="text-[color:color-mix(in_srgb,var(--token-on-dark-heading)_60%,transparent)] text-sm">E-Mail *</span>
              <input required type="email" className="mt-1 w-full bg-[color-mix(in_srgb,var(--token-input-bg)_5%,transparent)] border border-[color:color-mix(in_srgb,var(--token-input-border)_10%,transparent)] rounded-lg px-4 py-3 text-[color:var(--token-on-dark-heading)] placeholder:text-[color:color-mix(in_srgb,var(--token-on-dark-heading)_30%,transparent)] focus:outline-none focus:border-[color:color-mix(in_srgb,var(--token-input-border)_30%,transparent)]" placeholder="deine@email.de" />
            </label>
          </div>

          {artists.length > 0 && (
            <label className="block">
              <span className="text-[color:color-mix(in_srgb,var(--token-on-dark-heading)_60%,transparent)] text-sm">Wunschkünstler</span>
              <select className="mt-1 w-full bg-[color-mix(in_srgb,var(--token-input-bg)_5%,transparent)] border border-[color:color-mix(in_srgb,var(--token-input-border)_10%,transparent)] rounded-lg px-4 py-3 text-[color:var(--token-on-dark-heading)] focus:outline-none focus:border-[color:color-mix(in_srgb,var(--token-input-border)_30%,transparent)]">
                <option value="">Kein Wunsch / egal</option>
                {artists.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </label>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-[color:color-mix(in_srgb,var(--token-on-dark-heading)_60%,transparent)] text-sm">Körperstelle</span>
              <input type="text" className="mt-1 w-full bg-[color-mix(in_srgb,var(--token-input-bg)_5%,transparent)] border border-[color:color-mix(in_srgb,var(--token-input-border)_10%,transparent)] rounded-lg px-4 py-3 text-[color:var(--token-on-dark-heading)] placeholder:text-[color:color-mix(in_srgb,var(--token-on-dark-heading)_30%,transparent)] focus:outline-none focus:border-[color:color-mix(in_srgb,var(--token-input-border)_30%,transparent)]" placeholder="z.B. Unterarm, Rücken..." />
            </label>
            <label className="block">
              <span className="text-[color:color-mix(in_srgb,var(--token-on-dark-heading)_60%,transparent)] text-sm">Größe (ca.)</span>
              <input type="text" className="mt-1 w-full bg-[color-mix(in_srgb,var(--token-input-bg)_5%,transparent)] border border-[color:color-mix(in_srgb,var(--token-input-border)_10%,transparent)] rounded-lg px-4 py-3 text-[color:var(--token-on-dark-heading)] placeholder:text-[color:color-mix(in_srgb,var(--token-on-dark-heading)_30%,transparent)] focus:outline-none focus:border-[color:color-mix(in_srgb,var(--token-input-border)_30%,transparent)]" placeholder="z.B. 10x10 cm" />
            </label>
          </div>

          <label className="block">
            <span className="text-[color:color-mix(in_srgb,var(--token-on-dark-heading)_60%,transparent)] text-sm">Motiv-Beschreibung *</span>
            <textarea required rows={4} className="mt-1 w-full bg-[color-mix(in_srgb,var(--token-input-bg)_5%,transparent)] border border-[color:color-mix(in_srgb,var(--token-input-border)_10%,transparent)] rounded-lg px-4 py-3 text-[color:var(--token-on-dark-heading)] placeholder:text-[color:color-mix(in_srgb,var(--token-on-dark-heading)_30%,transparent)] focus:outline-none focus:border-[color:color-mix(in_srgb,var(--token-input-border)_30%,transparent)] resize-none" placeholder="Beschreib Deine Idee so genau wie möglich..." />
          </label>

          <label className="block">
            <span className="text-[color:color-mix(in_srgb,var(--token-on-dark-heading)_60%,transparent)] text-sm">Referenzbilder (optional)</span>
            <div className="mt-1 border border-dashed border-[color:color-mix(in_srgb,var(--token-card-border)_20%,transparent)] rounded-lg p-6 text-center text-[color:color-mix(in_srgb,var(--token-on-dark-heading)_30%,transparent)] text-sm">
              Bilder hier ablegen oder klicken zum Hochladen
              <input type="file" multiple accept="image/png,image/jpeg,image/webp,image/gif,image/avif" className="hidden" />
            </div>
          </label>

          <button type="submit" className="w-full py-4 bg-[var(--token-card-bg)] text-[color:var(--token-heading)] font-bold uppercase tracking-wider text-sm hover:bg-[color-mix(in_srgb,var(--token-card-bg)_90%,transparent)] transition-colors">
            Anfrage absenden
          </button>
        </form>
      </div>
    </section>
  );
}
