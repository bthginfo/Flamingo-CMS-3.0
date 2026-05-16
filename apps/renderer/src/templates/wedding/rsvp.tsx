'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

type Props = {
  data: Record<string, unknown>;
  variant?: string | null;
  styleVariant?: string;
};

export function RsvpSection({ data }: Props) {
  const headline = (data.headline as string) || 'Zusage';
  const subline = (data.subline as string) || 'Bitte teilt uns bis zum Anmeldeschluss mit, ob ihr dabei seid.';
  const deadline = (data.deadline as string) || '';
  const tenantId = (data.tenantId as string) || '';
  const showSongWish = data.showSongWish !== false;
  const showDietary = data.showDietary !== false;
  const showAllergies = data.showAllergies !== false;
  const maxGuests = (data.maxGuests as number) || 5;

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    attending: 'yes' as 'yes' | 'no',
    guestCount: 1,
    guestNames: '',
    dietary: '',
    allergies: '',
    songWish: '',
    comment: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, tenantId }),
      });
      if (res.ok) setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-12">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-5xl mb-4">🎉</motion.div>
        <h2 className="text-2xl font-serif">Vielen Dank!</h2>
        <p className="text-gray-600 mt-2">Wir haben eure Antwort erhalten und freuen uns auf euch.</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-serif">{headline}</h2>
        {subline && <p className="text-gray-600 mt-3">{subline}</p>}
        {deadline && <p className="text-rose-500 text-sm mt-2 font-medium">Anmeldeschluss: {deadline}</p>}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1">Name *</label>
          <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-rose-200 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">E-Mail *</label>
          <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-rose-200 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Zusage *</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" checked={form.attending === 'yes'} onChange={() => setForm(f => ({ ...f, attending: 'yes' }))} className="text-rose-500" />
              <span>Ja, ich komme</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" checked={form.attending === 'no'} onChange={() => setForm(f => ({ ...f, attending: 'no' }))} className="text-rose-500" />
              <span>Leider nicht</span>
            </label>
          </div>
        </div>

        {form.attending === 'yes' && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">Anzahl Personen</label>
              <select value={form.guestCount} onChange={e => setForm(f => ({ ...f, guestCount: +e.target.value }))} className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-rose-200 outline-none">
                {Array.from({ length: maxGuests }, (_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
            </div>
            {form.guestCount > 1 && (
              <div>
                <label className="block text-sm font-medium mb-1">Namen der Begleitpersonen</label>
                <input value={form.guestNames} onChange={e => setForm(f => ({ ...f, guestNames: e.target.value }))} className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-rose-200 outline-none" placeholder="z.B. Max Mustermann" />
              </div>
            )}
            {showDietary && (
              <div>
                <label className="block text-sm font-medium mb-1">Ernährung</label>
                <input value={form.dietary} onChange={e => setForm(f => ({ ...f, dietary: e.target.value }))} className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-rose-200 outline-none" placeholder="z.B. vegetarisch, vegan" />
              </div>
            )}
            {showAllergies && (
              <div>
                <label className="block text-sm font-medium mb-1">Allergien / Unverträglichkeiten</label>
                <input value={form.allergies} onChange={e => setForm(f => ({ ...f, allergies: e.target.value }))} className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-rose-200 outline-none" placeholder="z.B. Laktose, Nüsse" />
              </div>
            )}
            {showSongWish && (
              <div>
                <label className="block text-sm font-medium mb-1">Musikwunsch 🎵</label>
                <input value={form.songWish} onChange={e => setForm(f => ({ ...f, songWish: e.target.value }))} className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-rose-200 outline-none" placeholder="Welcher Song bringt euch auf die Tanzfläche?" />
              </div>
            )}
          </>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Nachricht (optional)</label>
          <textarea value={form.comment} onChange={e => setForm(f => ({ ...f, comment: e.target.value }))} rows={3} className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-rose-200 outline-none resize-none" />
        </div>

        <button type="submit" disabled={loading} className="w-full bg-rose-500 hover:bg-rose-600 text-white py-3 rounded-lg font-medium transition disabled:opacity-50">
          {loading ? 'Wird gesendet...' : 'Absenden'}
        </button>
      </form>
    </div>
  );
}
