'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Send, Check, Users, UtensilsCrossed, AlertCircle } from 'lucide-react';
import { plain } from '@/lib/strip-html';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function WeddingRsvpSection({ data, styleVariant }: Props) {
  const badge = (data.badge as string) || 'RSVP';
  const headline = (data.headline as string) || 'Zusage';
  const subline = (data.subline as string) || 'Bitte gebt uns bis zum Stichtag Bescheid.';
  const deadline = (data.deadline as string) || '';
  const maxGuests = Number(data.maxGuests) > 0 ? Number(data.maxGuests) : 10;
  const showSongWish = data.showSongWish === true;
  const showDietary = data.showDietary !== false;
  const showAllergies = data.showAllergies === true;
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const submitted = status === 'success';

  const deadlineStr = deadline ? new Date(deadline).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' }) : '';

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get('name') || ''),
      email: String(fd.get('email') || ''),
      attending: String(fd.get('attending') || 'yes'),
      guestCount: Number(fd.get('guestCount') || 1),
      dietary: [String(fd.get('dietary') || ''), String(fd.get('allergies') || '')].filter(Boolean).join(' · '),
      songWish: String(fd.get('songWish') || ''),
      comment: String(fd.get('comment') || ''),
    };
    try {
      const res = await fetch('/api/rsvp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (res.ok) { setStatus('success'); }
      else { const d = await res.json(); setErrorMsg(d.error || 'Fehler beim Senden.'); setStatus('error'); }
    } catch { setErrorMsg('Verbindungsfehler.'); setStatus('error'); }
  }

  if (submitted) {
    return (
      <section className="py-16 md:py-24 px-4 md:px-6">
        <div className="max-w-lg mx-auto text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className={`w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center bg-[var(--token-success-bg)]`}>
            <Check className={`w-8 h-8 text-[var(--token-check)]`} />
          </motion.div>
          <h2 className="text-2xl font-semibold text-[color:var(--token-heading)]">Vielen Dank!</h2>
          <p className={`mt-3 text-[color:var(--token-muted)]`}>Wir haben eure Antwort erhalten und freuen uns auf euch.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 px-4 md:px-6 bg-[var(--token-section-bg)]">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-12">
          <span className="section-badge" data-edit-path="badge">{badge}</span>
          <h2 className="section-headline" data-edit-path="headline">{headline}</h2>
          {subline && <div className="section-subline rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: subline }} />}
          {deadlineStr && <p className="text-sm text-[color:var(--token-icon)] font-medium mt-4">Bitte bis {deadlineStr}</p>}
        </div>
        <form onSubmit={handleSubmit} className="space-y-5 bg-[var(--token-card-bg)] p-8 rounded-2xl shadow-sm transition-all duration-300 motion-safe:hover:-translate-y-1 hover:shadow-xl border border-[color:var(--token-card-border)]">
          {status === 'error' && <p className="text-sm text-[var(--token-danger)] flex items-center gap-1"><AlertCircle size={14} />{errorMsg}</p>}
          <div>
            <label className="block text-sm font-medium text-[color:var(--token-muted)] mb-1">Name(n)</label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[color:var(--token-body)]" />
              <input name="name" type="text" required className="w-full pl-10 pr-4 py-3 border border-[color:var(--token-card-border)] rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-[var(--token-card-border)] outline-none" placeholder="Vor- und Nachname" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[color:var(--token-muted)] mb-1">E-Mail</label>
            <input name="email" type="email" required className="w-full px-4 py-3 border border-[color:var(--token-card-border)] rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-[var(--token-card-border)] outline-none" placeholder="eure@email.de" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[color:var(--token-muted)] mb-1">Zusage</label>
            <div className="flex gap-6 py-2">
              <label className="flex items-center gap-2 text-sm text-[color:var(--token-muted)]"><input type="radio" name="attending" value="yes" defaultChecked className="accent-brand-primary" /> Wir kommen</label>
              <label className="flex items-center gap-2 text-sm text-[color:var(--token-muted)]"><input type="radio" name="attending" value="no" className="accent-brand-primary" /> Leider nicht</label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[color:var(--token-muted)] mb-1">Anzahl Personen</label>
            <input name="guestCount" type="number" min={1} max={maxGuests} defaultValue={1} className="w-full px-4 py-3 border border-[color:var(--token-card-border)] rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-[var(--token-card-border)] outline-none" />
          </div>
          {showDietary && (
          <div>
            <label className="block text-sm font-medium text-[color:var(--token-muted)] mb-1">Essenswünsche</label>
            <div className="relative">
              <UtensilsCrossed className="absolute left-3 top-3 w-4 h-4 text-[color:var(--token-body)]" />
              <textarea name="dietary" rows={3} className="w-full pl-10 pr-4 py-3 border border-[color:var(--token-card-border)] rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-[var(--token-card-border)] outline-none resize-none" placeholder="z.B. vegetarisch, glutenfrei..." />
            </div>
          </div>
          )}
          {showAllergies && (
          <div>
            <label className="block text-sm font-medium text-[color:var(--token-label)] mb-1">Allergien</label>
            <textarea name="allergies" rows={2} className="w-full px-4 py-3 border border-[color:var(--token-input-border)] text-[color:var(--token-input-text)] rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-[var(--token-card-border)] outline-none resize-none" placeholder="z.B. Nüsse, Laktose..." />
          </div>
          )}
          {showSongWish && (
          <div>
            <label className="block text-sm font-medium text-[color:var(--token-label)] mb-1">Songwunsch</label>
            <input name="songWish" type="text" className="w-full px-4 py-3 border border-[color:var(--token-input-border)] text-[color:var(--token-input-text)] rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-[var(--token-card-border)] outline-none" placeholder="Welcher Song bringt euch auf die Tanzfläche?" />
          </div>
          )}
          <div>
            <label className="block text-sm font-medium text-[color:var(--token-muted)] mb-1">Nachricht (optional)</label>
            <textarea name="comment" rows={2} className="w-full px-4 py-3 border border-[color:var(--token-card-border)] rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-[var(--token-card-border)] outline-none resize-none" placeholder="Eure Nachricht an uns..." />
          </div>
          <button type="submit" disabled={status === 'loading'} className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-[var(--token-btn-bg)] text-[color:var(--token-btn-text)] rounded-lg font-medium hover:bg-[var(--token-section-bg-alt)] transition-colors disabled:opacity-50">
            <Send className="w-4 h-4" /> {status === 'loading' ? 'Wird gesendet…' : 'Zusagen'}
          </button>
        </form>
      </div>
    </section>
  );
}
