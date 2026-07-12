'use client';

import { useRef, useState } from 'react';
import { plain } from '@/lib/strip-html';
import {
  createRendererContactActionIdentity,
  rendererContactRequestHeaders,
  type RendererContactActionIdentity,
} from '@/lib/renderer-contact-client-security';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function TattooBookingSection({ data }: Props) {
  const headline = (data.headline as string) || 'Terminanfrage';
  const subline = (data.subline as string) || 'Beschreib uns Dein Wunschmotiv – wir melden uns innerhalb von 48h.';
  const artists = (data.artists as string[]) || [];
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const actionIdentity = useRef<RendererContactActionIdentity | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    setError('');
    const form = e.currentTarget;
    const fd = new FormData(form);
    const details = [
      fd.get('artist') && `Wunschkünstler: ${fd.get('artist')}`,
      fd.get('placement') && `Körperstelle: ${fd.get('placement')}`,
      fd.get('size') && `Größe: ${fd.get('size')}`,
      `Motiv: ${fd.get('message')}`,
    ].filter(Boolean).join('\n');
    const payload = { name: fd.get('name'), email: fd.get('email'), message: details, _page: window.location.pathname };
    actionIdentity.current = createRendererContactActionIdentity(payload, actionIdentity.current);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: rendererContactRequestHeaders(actionIdentity.current.idempotencyKey),
        body: actionIdentity.current.serializedPayload,
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json().catch(() => ({}));
        if (res.status === 409) actionIdentity.current = null;
        setError((data as { error?: string }).error || 'Senden fehlgeschlagen — bitte erneut versuchen.');
      }
    } catch {
      setError('Verbindungsfehler — bitte erneut versuchen.');
    } finally {
      setSending(false);
    }
  }

  if (submitted) {
    return (
      <section className="py-20 px-6 bg-[var(--token-section-bg)]">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-4xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-[color:var(--token-heading)]">Anfrage gesendet!</h2>
          <p className="text-[color:var(--token-muted)] mt-2">Wir melden uns schnellstmöglich bei Dir.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-6 bg-[var(--token-section-bg)]" id="kontakt">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-[color:var(--token-heading)]" data-edit-path="headline">{headline}</h2>
          {subline && <p className="mt-3 text-[color:var(--token-muted)]" data-edit-path="subline">{plain(subline)}</p>}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-[color:var(--token-label)] text-sm">Name *</span>
              <input required type="text" name="name" className="mt-1 w-full bg-[var(--token-input-bg)] border border-[color:var(--token-input-border)] rounded-lg px-4 py-3 text-[color:var(--token-heading)] placeholder:text-[color:var(--token-muted)] focus:outline-none focus:border-[color:var(--token-btn-bg)]" placeholder="Dein Name" />
            </label>
            <label className="block">
              <span className="text-[color:var(--token-label)] text-sm">E-Mail *</span>
              <input required type="email" name="email" className="mt-1 w-full bg-[var(--token-input-bg)] border border-[color:var(--token-input-border)] rounded-lg px-4 py-3 text-[color:var(--token-heading)] placeholder:text-[color:var(--token-muted)] focus:outline-none focus:border-[color:var(--token-btn-bg)]" placeholder="deine@email.de" />
            </label>
          </div>

          {artists.length > 0 && (
            <label className="block">
              <span className="text-[color:var(--token-label)] text-sm">Wunschkünstler</span>
              <select name="artist" className="mt-1 w-full bg-[var(--token-input-bg)] border border-[color:var(--token-input-border)] rounded-lg px-4 py-3 text-[color:var(--token-heading)] focus:outline-none focus:border-[color:var(--token-btn-bg)]">
                <option value="">Kein Wunsch / egal</option>
                {artists.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </label>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-[color:var(--token-label)] text-sm">Körperstelle</span>
              <input type="text" name="placement" className="mt-1 w-full bg-[var(--token-input-bg)] border border-[color:var(--token-input-border)] rounded-lg px-4 py-3 text-[color:var(--token-heading)] placeholder:text-[color:var(--token-muted)] focus:outline-none focus:border-[color:var(--token-btn-bg)]" placeholder="z.B. Unterarm, Rücken..." />
            </label>
            <label className="block">
              <span className="text-[color:var(--token-label)] text-sm">Größe (ca.)</span>
              <input type="text" className="mt-1 w-full bg-[var(--token-input-bg)] border border-[color:var(--token-input-border)] rounded-lg px-4 py-3 text-[color:var(--token-heading)] placeholder:text-[color:var(--token-muted)] focus:outline-none focus:border-[color:var(--token-btn-bg)]" placeholder="z.B. 10x10 cm" name="size" />
            </label>
          </div>

          <label className="block">
            <span className="text-[color:var(--token-label)] text-sm">Motiv-Beschreibung *</span>
            <textarea required rows={4} name="message" className="mt-1 w-full bg-[var(--token-input-bg)] border border-[color:var(--token-input-border)] rounded-lg px-4 py-3 text-[color:var(--token-heading)] placeholder:text-[color:var(--token-muted)] focus:outline-none focus:border-[color:var(--token-btn-bg)] resize-none" placeholder="Beschreib Deine Idee so genau wie möglich..." />
          </label>

          <label className="block">
            <span className="text-[color:var(--token-label)] text-sm">Referenzbilder (optional)</span>
            <div className="mt-1 border border-dashed border-[color:var(--token-card-border)] rounded-lg p-6 text-center text-[color:var(--token-muted)] text-sm">
              Bilder hier ablegen oder klicken zum Hochladen
              <input type="file" multiple accept="image/png,image/jpeg,image/webp,image/gif,image/avif" className="hidden" />
            </div>
          </label>

          {error && <p className="rounded-lg border border-[color:var(--token-danger)] bg-[var(--token-danger-bg)] px-4 py-3 text-sm text-[color:var(--token-danger)]">{error}</p>}
          <button type="submit" disabled={sending} className="w-full py-4 rounded-lg bg-[var(--token-btn-bg)] text-[color:var(--token-btn-text)] font-bold uppercase tracking-wider text-sm shadow-lg transition hover:brightness-110 disabled:opacity-60">
            {sending ? 'Wird gesendet…' : 'Anfrage absenden'}
          </button>
        </form>
      </div>
    </section>
  );
}
