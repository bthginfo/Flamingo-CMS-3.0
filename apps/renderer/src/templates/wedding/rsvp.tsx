'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Send, Check, Users, UtensilsCrossed } from 'lucide-react';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function WeddingRsvpSection({ data, styleVariant }: Props) {
  const badge = (data.badge as string) || 'RSVP';
  const headline = (data.headline as string) || 'Zusage';
  const subline = (data.subline as string) || 'Bitte gebt uns bis zum Stichtag Bescheid.';
  const deadline = (data.deadline as string) || '';
  const [submitted, setSubmitted] = useState(false);
  const isBold = styleVariant === 'bold';
  const isModern = styleVariant === 'modern';

  const deadlineStr = deadline ? new Date(deadline).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' }) : '';

  if (submitted) {
    return (
      <section className={`py-16 md:py-24 px-4 md:px-6 ${isBold ? 'bg-gray-950 text-white' : ''}`}>
        <div className="max-w-lg mx-auto text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className={`w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center ${isBold ? 'bg-brand-accent/20' : 'bg-green-100'}`}>
            <Check className={`w-8 h-8 ${isBold ? 'text-brand-accent' : 'text-green-600'}`} />
          </motion.div>
          <h2 className={`text-2xl font-semibold ${isBold ? 'text-white' : 'text-gray-900'}`}>Vielen Dank!</h2>
          <p className={`mt-3 ${isBold ? 'text-white/60' : 'text-gray-600'}`}>Wir haben eure Antwort erhalten und freuen uns auf euch.</p>
        </div>
      </section>
    );
  }

  if (isModern) {
    return (
      <section className="py-24 md:py-36 px-4 md:px-6">
        <div className="max-w-md mx-auto">
          <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-4">{badge}</p>
          <h2 className="text-3xl md:text-5xl font-extralight uppercase tracking-[0.15em] text-gray-900 mb-4">{headline}</h2>
          {subline && <p className="text-gray-400 text-sm mb-2">{subline}</p>}
          {deadlineStr && <p className="text-gray-400 text-xs uppercase tracking-wider mb-12">Bis {deadlineStr}</p>}
          <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-6">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2">Name(n)</label>
              <input type="text" required className="w-full px-0 py-3 border-0 border-b border-gray-200 focus:border-gray-900 outline-none bg-transparent text-gray-900" placeholder="Vor- und Nachname" />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2">Anzahl Personen</label>
              <input type="number" min={1} max={10} defaultValue={1} className="w-full px-0 py-3 border-0 border-b border-gray-200 focus:border-gray-900 outline-none bg-transparent text-gray-900" />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2">Essenswünsche / Allergien</label>
              <textarea rows={2} className="w-full px-0 py-3 border-0 border-b border-gray-200 focus:border-gray-900 outline-none bg-transparent text-gray-900 resize-none" placeholder="z.B. vegetarisch, glutenfrei..." />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2">Nachricht (optional)</label>
              <textarea rows={2} className="w-full px-0 py-3 border-0 border-b border-gray-200 focus:border-gray-900 outline-none bg-transparent text-gray-900 resize-none" placeholder="Eure Nachricht an uns..." />
            </div>
            <button type="submit" className="w-full py-3 border border-gray-900 text-gray-900 text-sm uppercase tracking-[0.2em] hover:bg-gray-900 hover:text-white transition-colors mt-8">
              Zusagen
            </button>
          </form>
        </div>
      </section>
    );
  }

  if (isBold) {
    return (
      <section className="py-16 md:py-24 px-4 md:px-6 bg-gray-950 text-white">
        <div className="max-w-lg mx-auto">
          <span className="inline-block bg-brand-accent text-black text-[10px] font-bold uppercase tracking-[0.3em] px-4 py-1.5 mb-4">{badge}</span>
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-wide mb-4">{headline}</h2>
          {subline && <p className="text-white/60 mb-2">{subline}</p>}
          {deadlineStr && <p className="text-brand-accent text-sm font-bold mb-10">Bis {deadlineStr}</p>}
          <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-5 border border-white/10 p-8">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-2">Name(n)</label>
              <input type="text" required className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder-white/30 outline-none focus:border-brand-accent" placeholder="Vor- und Nachname" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-2">Anzahl Personen</label>
              <input type="number" min={1} max={10} defaultValue={1} className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white outline-none focus:border-brand-accent" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-2">Essenswünsche / Allergien</label>
              <textarea rows={3} className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder-white/30 outline-none focus:border-brand-accent resize-none" placeholder="z.B. vegetarisch, glutenfrei..." />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-2">Nachricht (optional)</label>
              <textarea rows={2} className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder-white/30 outline-none focus:border-brand-accent resize-none" placeholder="Eure Nachricht an uns..." />
            </div>
            <button type="submit" className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-brand-accent text-black font-bold uppercase tracking-wider hover:opacity-90 transition-opacity">
              <Send className="w-4 h-4" /> Zusagen
            </button>
          </form>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 px-4 md:px-6 bg-brand-primary/[0.02]">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-12">
          <span className="section-badge">{badge}</span>
          <h2 className="section-headline">{headline}</h2>
          {subline && <div className="section-subline rt-content" dangerouslySetInnerHTML={{ __html: subline }} />}
          {deadlineStr && <p className="text-sm text-brand-primary font-medium mt-4">Bitte bis {deadlineStr}</p>}
        </div>
        <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-5 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name(n)</label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" required className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none" placeholder="Vor- und Nachname" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Anzahl Personen</label>
            <input type="number" min={1} max={10} defaultValue={1} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Essenswünsche / Allergien</label>
            <div className="relative">
              <UtensilsCrossed className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <textarea rows={3} className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none resize-none" placeholder="z.B. vegetarisch, glutenfrei..." />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nachricht (optional)</label>
            <textarea rows={2} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none resize-none" placeholder="Eure Nachricht an uns..." />
          </div>
          <button type="submit" className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-brand-primary text-white rounded-lg font-medium hover:bg-brand-dark transition-colors">
            <Send className="w-4 h-4" /> Zusagen
          </button>
        </form>
      </div>
    </section>
  );
}
