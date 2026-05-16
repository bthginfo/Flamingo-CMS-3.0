'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { toast } from 'sonner';
import { useSaveState } from '@/components/save-context';
import { getSeoGlobalAction, saveSeoGlobalAction } from './actions';
import { Save } from 'lucide-react';

export function SeoForm() {
  const [pending, startTransition] = useTransition();
  const { markDirty, markSaved } = useSaveState();
  const mounted = useRef(0);
  const [data, setData] = useState({
    defaultTitle: '',
    titleTemplate: '',
    defaultDescription: '',
    defaultOgImage: '',
    canonicalBase: '',
    locale: 'de_DE',
    robots: 'index,follow',
  });

  useEffect(() => {
    getSeoGlobalAction().then(row => {
      if (row) setData({
        defaultTitle: row.defaultTitle ?? '',
        titleTemplate: row.titleTemplate ?? '',
        defaultDescription: row.defaultDescription ?? '',
        defaultOgImage: row.defaultOgImage ?? '',
        canonicalBase: row.canonicalBase ?? '',
        locale: row.locale,
        robots: row.robots,
      });
    });
  }, []);

  useEffect(() => { if (mounted.current >= 2) markDirty(); else mounted.current++; }, [data]);

  function handleSave() {
    startTransition(async () => {
      await saveSeoGlobalAction(data);
      toast.success('SEO-Einstellungen gespeichert');
      markSaved();
    });
  }

  const field = (label: string, key: keyof typeof data, opts?: { placeholder?: string; hint?: string; maxLength?: number; multiline?: boolean }) => (
    <div>
      <label className="admin-label">{label}</label>
      {opts?.multiline ? (
        <textarea
          className="admin-input min-h-[80px]"
          value={data[key]}
          onChange={e => setData(d => ({ ...d, [key]: e.target.value }))}
          placeholder={opts.placeholder}
          maxLength={opts.maxLength}
        />
      ) : (
        <input
          className="admin-input"
          value={data[key]}
          onChange={e => setData(d => ({ ...d, [key]: e.target.value }))}
          placeholder={opts?.placeholder}
          maxLength={opts?.maxLength}
        />
      )}
      {opts?.hint && <p className="text-xs text-zinc-400 mt-1">{opts.hint}</p>}
      {opts?.maxLength && <p className="text-xs text-zinc-400 mt-0.5 text-right">{data[key].length}/{opts.maxLength}</p>}
    </div>
  );

  return (
    <div className="admin-card p-6 space-y-5">
      <h2 className="font-semibold text-lg">Globale SEO-Einstellungen</h2>
      <div className="space-y-4">
        {field('Standard-Titel', 'defaultTitle', { placeholder: 'Müller & Söhne Meisterbetrieb', maxLength: 70, hint: 'Wird verwendet wenn eine Seite keinen eigenen Titel hat.' })}
        {field('Titel-Template', 'titleTemplate', { placeholder: '%s | Müller & Söhne', hint: '%s wird durch den Seitentitel ersetzt.' })}
        {field('Standard-Beschreibung', 'defaultDescription', { placeholder: 'Ihr Experte für Heizung, Sanitär & Bäder...', maxLength: 170, multiline: true })}
        {field('Standard OG-Bild (URL)', 'defaultOgImage', { placeholder: 'https://...' })}
        {field('Canonical-Basis-URL', 'canonicalBase', { placeholder: 'https://www.mueller-soehne.de' })}
        {field('Locale', 'locale', { placeholder: 'de_DE' })}
        {field('Robots', 'robots', { placeholder: 'index,follow', hint: 'z.B. index,follow oder noindex,nofollow' })}
      </div>
      <div className="flex justify-end pt-2">
        <button onClick={handleSave} disabled={pending} className="admin-btn-primary flex items-center gap-2">
          <Save size={16} /> Speichern
        </button>
      </div>
    </div>
  );
}
