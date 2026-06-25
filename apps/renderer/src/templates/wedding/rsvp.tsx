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
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const submitted = status === 'success';
  const isBold = styleVariant === 'bold';
  const isModern = styleVariant === 'modern';

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
      dietary: String(fd.get('dietary') || ''),
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
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className={`w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center ${isBold ? 'bg-[color-mix(in_srgb,var(--token-badge-bg)_20%,transparent)]' : 'bg-[var(--token-success-bg)]'}`}>
            <Check className={`w-8 h-8 ${isBold ? 'text-[color:var(--token-check)]' : 'text-[var(--token-check)]'}`} />
          </motion.div>
          <h2 className="text-2xl font-semibold text-[color:var(--token-heading)]">Vielen Dank!</h2>
          <p className={`mt-3 ${isBold ? 'text-[color:var(--token-muted)]' : 'text-[color:var(--token-muted)]'}`}>Wir haben eure Antwort erhalten und freuen uns auf euch.</p>
        </div>
      </section>
    );
  }

  if (isModern) {
    return (
      <section className="py-24 md:py-36 px-4 md:px-6">
        <div className="max-w-md mx-auto">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[color:var(--token-body)] mb-4" data-edit-path="badge">{badge}</p>
          <h2 className="text-3xl md:text-5xl font-extralight uppercase tracking-[0.15em] text-[color:var(--token-heading)] mb-4 break-words" data-edit-path="headline">{headline}</h2>
          {subline && <p className="text-[color:var(--token-body)] text-sm mb-2" data-edit-path="subline">{plain(subline)}</p>}
          {deadlineStr && <p className="text-[color:var(--token-body)] text-xs uppercase tracking-wider mb-12">Bis {deadlineStr}</p>}
          <form onSubmit={handleSubmit} className="space-y-6">
            {status === 'error' && <p className="text-sm text-[var(--token-danger)] flex items-center gap-1"><AlertCircle size={14} />{errorMsg}</p>}
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-[color:var(--token-body)] mb-2">Name(n)</label>
              <input name="name" type="text" required className="w-full px-0 py-3 border-0 border-b border-[color:var(--token-card-border)] focus:border-[color:var(--token-card-border)] outline-none bg-transparent text-[color:var(--token-heading)]" placeholder="Vor- und Nachname" />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-[color:var(--token-body)] mb-2">E-Mail</label>
              <input name="email" type="email" required className="w-full px-0 py-3 border-0 border-b border-[color:var(--token-card-border)] focus:border-[color:var(--token-card-border)] outline-none bg-transparent text-[color:var(--token-heading)]" placeholder="eure@email.de" />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-[color:var(--token-body)] mb-2">Zusage</label>
              <div className="flex gap-6 py-2">
                <label className="flex items-center gap-2 text-sm text-[color:var(--token-muted)]"><input type="radio" name="attending" value="yes" defaultChecked className="accent-[var(--token-icon)]" /> Wir kommen</label>
                <label className="flex items-center gap-2 text-sm text-[color:var(--token-muted)]"><input type="radio" name="attending" value="no" className="accent-[var(--token-icon)]" /> Leider nicht</label>
              </div>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-[color:var(--token-body)] mb-2">Anzahl Personen</label>
              <input name="guestCount" type="number" min={1} max={10} defaultValue={1} className="w-full px-0 py-3 border-0 border-b border-[color:var(--token-card-border)] focus:border-[color:var(--token-card-border)] outline-none bg-transparent text-[color:var(--token-heading)]" />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-[color:var(--token-body)] mb-2">Essenswünsche / Allergien</label>
              <textarea name="dietary" rows={2} className="w-full px-0 py-3 border-0 border-b border-[color:var(--token-card-border)] focus:border-[color:var(--token-card-border)] outline-none bg-transparent text-[color:var(--token-heading)] resize-none" placeholder="z.B. vegetarisch, glutenfrei..." />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-[color:var(--token-body)] mb-2">Nachricht (optional)</label>
              <textarea name="comment" rows={2} className="w-full px-0 py-3 border-0 border-b border-[color:var(--token-card-border)] focus:border-[color:var(--token-card-border)] outline-none bg-transparent text-[color:var(--token-heading)] resize-none" placeholder="Eure Nachricht an uns..." />
            </div>
            <button type="submit" disabled={status === 'loading'} className="w-full py-3 border border-[color:var(--token-card-border)] text-[color:var(--token-heading)] text-sm uppercase tracking-[0.2em] hover:bg-[var(--token-section-bg-alt)] hover:text-[color:var(--token-on-dark-heading)] transition-colors mt-8 disabled:opacity-50">
              {status === 'loading' ? 'Wird gesendet…' : 'Zusagen'}
            </button>
          </form>
        </div>
      </section>
    );
  }

  if (isBold) {
    return (
      <section className="py-16 md:py-24 px-4 md:px-6">
        <div className="max-w-lg mx-auto">
          <span className="inline-block bg-[var(--token-badge-bg)] text-[color:var(--token-heading)] text-[10px] font-bold uppercase tracking-[0.3em] px-4 py-1.5 mb-4" data-edit-path="badge">{badge}</span>
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-wide mb-4 break-words" data-edit-path="headline">{headline}</h2>
          {subline && <p className="text-[color:var(--token-muted)] mb-2" data-edit-path="subline">{plain(subline)}</p>}
          {deadlineStr && <p className="text-[color:var(--token-eyebrow)] text-sm font-bold mb-10">Bis {deadlineStr}</p>}
          <form onSubmit={handleSubmit} className="space-y-5 border-2 border-[color:var(--token-card-border)] p-8">
            {status === 'error' && <p className="text-sm text-[var(--token-danger)] flex items-center gap-1"><AlertCircle size={14} />{errorMsg}</p>}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[color:var(--token-muted)] mb-2">Name(n)</label>
              <input name="name" type="text" required className="w-full px-4 py-3 bg-[var(--token-section-bg-alt)] border-2 border-[color:var(--token-card-border)] text-[color:var(--token-heading)] placeholder:text-[color:var(--token-muted)] outline-none focus:border-[var(--token-card-border)]" placeholder="Vor- und Nachname" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[color:var(--token-muted)] mb-2">E-Mail</label>
              <input name="email" type="email" required className="w-full px-4 py-3 bg-[var(--token-section-bg-alt)] border-2 border-[color:var(--token-card-border)] text-[color:var(--token-heading)] placeholder:text-[color:var(--token-muted)] outline-none focus:border-[var(--token-card-border)]" placeholder="eure@email.de" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[color:var(--token-muted)] mb-2">Zusage</label>
              <div className="flex gap-6 py-2">
                <label className="flex items-center gap-2 text-sm text-[color:var(--token-muted)]"><input type="radio" name="attending" value="yes" defaultChecked className="accent-brand-accent" /> Wir kommen</label>
                <label className="flex items-center gap-2 text-sm text-[color:var(--token-muted)]"><input type="radio" name="attending" value="no" className="accent-brand-accent" /> Leider nicht</label>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[color:var(--token-muted)] mb-2">Anzahl Personen</label>
              <input name="guestCount" type="number" min={1} max={10} defaultValue={1} className="w-full px-4 py-3 bg-[var(--token-section-bg-alt)] border-2 border-[color:var(--token-card-border)] text-[color:var(--token-heading)] outline-none focus:border-[var(--token-card-border)]" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[color:var(--token-muted)] mb-2">Essenswünsche / Allergien</label>
              <textarea name="dietary" rows={3} className="w-full px-4 py-3 bg-[var(--token-section-bg-alt)] border-2 border-[color:var(--token-card-border)] text-[color:var(--token-heading)] placeholder:text-[color:var(--token-muted)] outline-none focus:border-[var(--token-card-border)] resize-none" placeholder="z.B. vegetarisch, glutenfrei..." />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[color:var(--token-muted)] mb-2">Nachricht (optional)</label>
              <textarea name="comment" rows={2} className="w-full px-4 py-3 bg-[var(--token-section-bg-alt)] border-2 border-[color:var(--token-card-border)] text-[color:var(--token-heading)] placeholder:text-[color:var(--token-muted)] outline-none focus:border-[var(--token-card-border)] resize-none" placeholder="Eure Nachricht an uns..." />
            </div>
            <button type="submit" disabled={status === 'loading'} className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-[var(--token-badge-bg)] text-[color:var(--token-heading)] font-bold uppercase tracking-wider hover:opacity-90 transition-opacity disabled:opacity-50">
              <Send className="w-4 h-4" /> {status === 'loading' ? 'Wird gesendet…' : 'Zusagen'}
            </button>
          </form>
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
        <form onSubmit={handleSubmit} className="space-y-5 bg-[var(--token-card-bg)] p-8 rounded-2xl shadow-sm border border-[color:var(--token-card-border)]">
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
            <input name="guestCount" type="number" min={1} max={10} defaultValue={1} className="w-full px-4 py-3 border border-[color:var(--token-card-border)] rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-[var(--token-card-border)] outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[color:var(--token-muted)] mb-1">Essenswünsche / Allergien</label>
            <div className="relative">
              <UtensilsCrossed className="absolute left-3 top-3 w-4 h-4 text-[color:var(--token-body)]" />
              <textarea name="dietary" rows={3} className="w-full pl-10 pr-4 py-3 border border-[color:var(--token-card-border)] rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-[var(--token-card-border)] outline-none resize-none" placeholder="z.B. vegetarisch, glutenfrei..." />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[color:var(--token-muted)] mb-1">Nachricht (optional)</label>
            <textarea name="comment" rows={2} className="w-full px-4 py-3 border border-[color:var(--token-card-border)] rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-[var(--token-card-border)] outline-none resize-none" placeholder="Eure Nachricht an uns..." />
          </div>
          <button type="submit" disabled={status === 'loading'} className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-[var(--token-btn-bg)] text-[color:var(--token-on-dark-heading)] rounded-lg font-medium hover:bg-[var(--token-section-bg-alt)] transition-colors disabled:opacity-50">
            <Send className="w-4 h-4" /> {status === 'loading' ? 'Wird gesendet…' : 'Zusagen'}
          </button>
        </form>
      </div>
    </section>
  );
}
