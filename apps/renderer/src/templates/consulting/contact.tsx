'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { DynamicIcon } from '@/components/ui/icon-map';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function ConsultingContactSection({ data }: Props) {
  const headline = (data.headline as string) || 'Kontakt aufnehmen';
  const subline = (data.subline as string) || '';
  const phone = (data.phone as string) || '';
  const email = (data.email as string) || '';
  const address = (data.address as string) || '';
  const hours = (data.hours as string[]) || [];
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  return (
    <div ref={ref}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="text-center mb-12">
        {headline && <h2 className="section-headline">{headline}</h2>}
        {subline && <p className="section-subline">{subline}</p>}
      </motion.div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.2 }} className="space-y-6">
          {phone && (
            <a href={`tel:${phone}`} className="flex items-center gap-4 p-4 rounded-lg border border-slate-200 hover:border-brand-primary/30 transition-colors group">
              <div className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-colors">
                <DynamicIcon name="phone" size={20} />
              </div>
              <div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">Telefon</div>
                <div className="text-slate-900 font-medium">{phone}</div>
              </div>
            </a>
          )}
          {email && (
            <a href={`mailto:${email}`} className="flex items-center gap-4 p-4 rounded-lg border border-slate-200 hover:border-brand-primary/30 transition-colors group">
              <div className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-colors">
                <DynamicIcon name="mail" size={20} />
              </div>
              <div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">E-Mail</div>
                <div className="text-slate-900 font-medium">{email}</div>
              </div>
            </a>
          )}
          {address && (
            <div className="flex items-center gap-4 p-4 rounded-lg border border-slate-200">
              <div className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                <DynamicIcon name="map-pin" size={20} />
              </div>
              <div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">Adresse</div>
                <div className="text-slate-900 font-medium">{address}</div>
              </div>
            </div>
          )}
          {hours.length > 0 && (
            <div className="flex items-start gap-4 p-4 rounded-lg border border-slate-200">
              <div className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0">
                <DynamicIcon name="clock" size={20} />
              </div>
              <div>
                <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Sprechzeiten</div>
                {hours.map((h, i) => <div key={i} className="text-slate-700 text-sm">{h}</div>)}
              </div>
            </div>
          )}
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.3 }} className="bg-slate-50 rounded-xl p-8 border border-slate-200">
          <h3 className="font-semibold text-slate-900 mb-4">Ihr Anliegen schildern</h3>
          {status === 'success' ? (
            <div className="flex flex-col items-center justify-center py-8 text-center gap-3">
              <CheckCircle className="text-green-500" size={40} />
              <p className="text-lg font-semibold text-gray-900">Vielen Dank!</p>
              <p className="text-sm text-gray-500">Wir melden uns innerhalb von 24 Stunden bei Ihnen.</p>
              <button type="button" onClick={() => setStatus('idle')} className="text-sm text-brand-primary hover:underline mt-2">Neue Anfrage</button>
            </div>
          ) : (
          <form className="space-y-4" onSubmit={async (e) => {
            e.preventDefault();
            setStatus('loading');
            const form = e.currentTarget;
            const fd = new FormData(form);
            const payload: Record<string, string> = {
              name: `${fd.get('firstName') || ''} ${fd.get('lastName') || ''}`.trim(),
              email: String(fd.get('email') || ''),
              message: `Rechtsgebiet: ${fd.get('subject') || 'Nicht angegeben'}\n\n${fd.get('message') || ''}`,
              _page: window.location.pathname,
            };
            try {
              const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
              if (res.ok) { setStatus('success'); form.reset(); }
              else { const d = await res.json(); setErrorMsg(d.error || 'Fehler beim Senden.'); setStatus('error'); }
            } catch { setErrorMsg('Verbindungsfehler.'); setStatus('error'); }
          }}>
            {status === 'error' && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                <AlertCircle size={16} />{errorMsg}
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <input name="firstName" type="text" required placeholder="Vorname" className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20" />
              <input name="lastName" type="text" required placeholder="Nachname" className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20" />
            </div>
            <input name="email" type="email" required placeholder="E-Mail" className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20" />
            <select name="subject" className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary/20">
              <option>Rechtsgebiet wählen</option>
              <option>Arbeitsrecht</option>
              <option>Familienrecht</option>
              <option>Mietrecht</option>
              <option>Handels- & Gesellschaftsrecht</option>
              <option>Strafrecht</option>
              <option>Sonstiges</option>
            </select>
            <textarea name="message" rows={4} required placeholder="Kurze Beschreibung Ihres Anliegens" className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-primary/20" />
            <button type="submit" disabled={status === 'loading'} className="w-full py-3 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
              <Send size={16} />
              {status === 'loading' ? 'Wird gesendet…' : 'Erstberatung anfragen'}
            </button>
          </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
