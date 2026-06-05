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
          <p className="text-[color:var(--token-on-dark-heading)/50] mt-2">Wir melden uns schnellstmöglich bei Dir.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-6 bg-[var(--token-section-bg-alt)]" id="kontakt">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-[color:var(--token-on-dark-heading)]" data-edit-path="headline">{headline}</h2>
          {subline && <p className="mt-3 text-[color:var(--token-on-dark-heading)/50]" data-edit-path="subline">{plain(subline)}</p>}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-[color:var(--token-on-dark-heading)/60] text-sm">Name *</span>
              <input required type="text" className="mt-1 w-full bg-[var(--token-card-bg)/5] border border-[color:var(--token-card-border)/10] rounded-lg px-4 py-3 text-[color:var(--token-on-dark-heading)] placeholder:text-[color:var(--token-on-dark-heading)/30] focus:outline-none focus:border-[color:var(--token-card-border)/30]" placeholder="Dein Name" />
            </label>
            <label className="block">
              <span className="text-[color:var(--token-on-dark-heading)/60] text-sm">E-Mail *</span>
              <input required type="email" className="mt-1 w-full bg-[var(--token-card-bg)/5] border border-[color:var(--token-card-border)/10] rounded-lg px-4 py-3 text-[color:var(--token-on-dark-heading)] placeholder:text-[color:var(--token-on-dark-heading)/30] focus:outline-none focus:border-[color:var(--token-card-border)/30]" placeholder="deine@email.de" />
            </label>
          </div>

          {artists.length > 0 && (
            <label className="block">
              <span className="text-[color:var(--token-on-dark-heading)/60] text-sm">Wunschkünstler</span>
              <select className="mt-1 w-full bg-[var(--token-card-bg)/5] border border-[color:var(--token-card-border)/10] rounded-lg px-4 py-3 text-[color:var(--token-on-dark-heading)] focus:outline-none focus:border-[color:var(--token-card-border)/30]">
                <option value="">Kein Wunsch / egal</option>
                {artists.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </label>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-[color:var(--token-on-dark-heading)/60] text-sm">Körperstelle</span>
              <input type="text" className="mt-1 w-full bg-[var(--token-card-bg)/5] border border-[color:var(--token-card-border)/10] rounded-lg px-4 py-3 text-[color:var(--token-on-dark-heading)] placeholder:text-[color:var(--token-on-dark-heading)/30] focus:outline-none focus:border-[color:var(--token-card-border)/30]" placeholder="z.B. Unterarm, Rücken..." />
            </label>
            <label className="block">
              <span className="text-[color:var(--token-on-dark-heading)/60] text-sm">Größe (ca.)</span>
              <input type="text" className="mt-1 w-full bg-[var(--token-card-bg)/5] border border-[color:var(--token-card-border)/10] rounded-lg px-4 py-3 text-[color:var(--token-on-dark-heading)] placeholder:text-[color:var(--token-on-dark-heading)/30] focus:outline-none focus:border-[color:var(--token-card-border)/30]" placeholder="z.B. 10x10 cm" />
            </label>
          </div>

          <label className="block">
            <span className="text-[color:var(--token-on-dark-heading)/60] text-sm">Motiv-Beschreibung *</span>
            <textarea required rows={4} className="mt-1 w-full bg-[var(--token-card-bg)/5] border border-[color:var(--token-card-border)/10] rounded-lg px-4 py-3 text-[color:var(--token-on-dark-heading)] placeholder:text-[color:var(--token-on-dark-heading)/30] focus:outline-none focus:border-[color:var(--token-card-border)/30] resize-none" placeholder="Beschreib Deine Idee so genau wie möglich..." />
          </label>

          <label className="block">
            <span className="text-[color:var(--token-on-dark-heading)/60] text-sm">Referenzbilder (optional)</span>
            <div className="mt-1 border border-dashed border-[color:var(--token-card-border)/20] rounded-lg p-6 text-center text-[color:var(--token-on-dark-heading)/30] text-sm">
              Bilder hier ablegen oder klicken zum Hochladen
              <input type="file" multiple accept="image/png,image/jpeg,image/webp,image/gif,image/avif" className="hidden" />
            </div>
          </label>

          <button type="submit" className="w-full py-4 bg-[var(--token-card-bg)] text-[color:var(--token-heading)] font-bold uppercase tracking-wider text-sm hover:bg-[var(--token-card-bg)/90] transition-colors">
            Anfrage absenden
          </button>
        </form>
      </div>
    </section>
  );
}
