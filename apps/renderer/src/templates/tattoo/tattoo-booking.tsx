'use client';

import { useState } from 'react';

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
      <section className="py-20 px-6 bg-neutral-950">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-4xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-white">Anfrage gesendet!</h2>
          <p className="text-white/50 mt-2">Wir melden uns schnellstmöglich bei Dir.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-6 bg-neutral-950" id="kontakt">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">{headline}</h2>
          {subline && <p className="mt-3 text-white/50">{subline}</p>}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-white/60 text-sm">Name *</span>
              <input required type="text" className="mt-1 w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30" placeholder="Dein Name" />
            </label>
            <label className="block">
              <span className="text-white/60 text-sm">E-Mail *</span>
              <input required type="email" className="mt-1 w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30" placeholder="deine@email.de" />
            </label>
          </div>

          {artists.length > 0 && (
            <label className="block">
              <span className="text-white/60 text-sm">Wunschkünstler</span>
              <select className="mt-1 w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/30">
                <option value="">Kein Wunsch / egal</option>
                {artists.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </label>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-white/60 text-sm">Körperstelle</span>
              <input type="text" className="mt-1 w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30" placeholder="z.B. Unterarm, Rücken..." />
            </label>
            <label className="block">
              <span className="text-white/60 text-sm">Größe (ca.)</span>
              <input type="text" className="mt-1 w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30" placeholder="z.B. 10x10 cm" />
            </label>
          </div>

          <label className="block">
            <span className="text-white/60 text-sm">Motiv-Beschreibung *</span>
            <textarea required rows={4} className="mt-1 w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 resize-none" placeholder="Beschreib Deine Idee so genau wie möglich..." />
          </label>

          <label className="block">
            <span className="text-white/60 text-sm">Referenzbilder (optional)</span>
            <div className="mt-1 border border-dashed border-white/20 rounded-lg p-6 text-center text-white/30 text-sm">
              Bilder hier ablegen oder klicken zum Hochladen
              <input type="file" multiple accept="image/*" className="hidden" />
            </div>
          </label>

          <button type="submit" className="w-full py-4 bg-white text-black font-bold uppercase tracking-wider text-sm hover:bg-white/90 transition-colors">
            Anfrage absenden
          </button>
        </form>
      </div>
    </section>
  );
}
