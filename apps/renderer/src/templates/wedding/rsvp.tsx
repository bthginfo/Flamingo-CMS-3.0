'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Send, Check, Users, UtensilsCrossed } from 'lucide-react';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function WeddingRsvpSection({ data }: Props) {
  const badge = (data.badge as string) || 'RSVP';
  const headline = (data.headline as string) || 'Zusage';
  const subline = (data.subline as string) || 'Bitte gebt uns bis zum Stichtag Bescheid.';
  const deadline = (data.deadline as string) || '';
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <section className="py-16 md:py-24 px-4 md:px-6 bg-brand-primary/[0.02]">
        <div className="max-w-lg mx-auto text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
            <Check className="w-8 h-8 text-green-600" />
          </motion.div>
          <h2 className="text-2xl font-semibold text-gray-900">Vielen Dank!</h2>
          <p className="text-gray-600 mt-3">Wir haben eure Antwort erhalten und freuen uns auf euch.</p>
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
          {deadline && <p className="text-sm text-brand-primary font-medium mt-4">Bitte bis {new Date(deadline).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })}</p>}
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
