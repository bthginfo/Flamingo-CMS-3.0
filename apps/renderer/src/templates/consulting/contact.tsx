'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { DynamicIcon } from '@/components/ui/icon-map';

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
          <form className="space-y-4" onSubmit={e => e.preventDefault()}>
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="Vorname" className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20" />
              <input type="text" placeholder="Nachname" className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20" />
            </div>
            <input type="email" placeholder="E-Mail" className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20" />
            <select className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary/20">
              <option>Rechtsgebiet wählen</option>
              <option>Arbeitsrecht</option>
              <option>Familienrecht</option>
              <option>Mietrecht</option>
              <option>Handels- & Gesellschaftsrecht</option>
              <option>Strafrecht</option>
              <option>Sonstiges</option>
            </select>
            <textarea rows={4} placeholder="Kurze Beschreibung Ihres Anliegens" className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-primary/20" />
            <button type="submit" className="w-full py-3 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-dark transition-colors">
              Erstberatung anfragen
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
