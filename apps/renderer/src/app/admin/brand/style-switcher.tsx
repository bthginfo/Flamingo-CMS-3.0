'use client';

import { useState } from 'react';
import { saveActiveStyle } from '../settings-actions';
import { toast } from 'sonner';
import { Check } from 'lucide-react';
import { useSaveState } from '@/components/save-context';

const STYLE_OPTIONS: Record<string, { label: string; description: string; preview: string }[]> = {
  handwerk: [
    { label: 'Klassisch', description: 'Vertrauenswürdig & professionell – runde Formen, sanfte Schatten, warme Akzente', preview: 'classic' },
    { label: 'Modern', description: 'Minimalistisch & clean – subtile Kanten, flaches Design, viel Weißraum', preview: 'modern' },
    { label: 'Bold', description: 'Kräftig & dynamisch – harte Kanten, starke Kontraste, uppercase Headlines', preview: 'bold' },
    { label: 'Individuell', description: 'Volle Kontrolle – Stil pro Sektion frei wählbar (Classic, Modern oder Bold)', preview: 'individual' },
  ],
};

export function StyleSwitcher({ industry, activeStyle }: { industry: string; activeStyle: string }) {
  const [current, setCurrent] = useState(activeStyle);
  const [saving, setSaving] = useState(false);
  const { markSaved } = useSaveState();
  const options = STYLE_OPTIONS[industry] || STYLE_OPTIONS.handwerk;

  async function handleSelect(style: string) {
    if (style === current) return;
    setSaving(true);
    try {
      await saveActiveStyle(style);
      setCurrent(style);
      markSaved();
      toast.success('Stil geändert');
    } catch {
      toast.error('Fehler beim Speichern');
    } finally {
      setSaving(false);
    }
  }

  const styleKeys = ['classic', 'modern', 'bold', 'individual'];

  return (
    <div className="admin-card p-6 mb-8">
      <h2 className="font-semibold text-lg mb-1">Website-Stil</h2>
      <p className="text-sm text-zinc-500 mb-5">Wählen Sie das Design Ihrer Website. Alle Stile verwenden Ihre Inhalte und Farben.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {options.map((opt, i) => {
          const key = styleKeys[i];
          const isActive = current === key;
          return (
            <button
              key={key}
              onClick={() => handleSelect(key)}
              disabled={saving}
              className={`relative text-left p-5 rounded-xl border-2 transition-all duration-200 ${
                isActive
                  ? 'border-blue-500 bg-blue-50/50 ring-2 ring-blue-500/20'
                  : 'border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'
              }`}
            >
              {isActive && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <Check size={14} className="text-white" />
                </div>
              )}
              {/* Style preview mini */}
              <div className="mb-3 flex gap-1.5">
                {key === 'classic' && (
                  <>
                    <div className="w-8 h-8 rounded-xl bg-zinc-200" />
                    <div className="w-8 h-8 rounded-xl bg-zinc-300" />
                    <div className="w-8 h-8 rounded-full bg-zinc-400" />
                  </>
                )}
                {key === 'modern' && (
                  <>
                    <div className="w-8 h-8 rounded bg-zinc-200" />
                    <div className="w-8 h-8 rounded bg-zinc-300" />
                    <div className="w-8 h-8 rounded bg-zinc-400" />
                  </>
                )}
                {key === 'bold' && (
                  <>
                    <div className="w-8 h-8 rounded-none bg-zinc-800" />
                    <div className="w-8 h-8 rounded-none bg-zinc-600" />
                    <div className="w-8 h-8 rounded-none bg-zinc-400" />
                  </>
                )}
                {key === 'individual' && (
                  <>
                    <div className="w-8 h-8 rounded-xl bg-zinc-200" />
                    <div className="w-8 h-8 rounded bg-zinc-400" />
                    <div className="w-8 h-8 rounded-none bg-zinc-800" />
                  </>
                )}
              </div>
              <div className="font-semibold text-sm">{opt.label}</div>
              <div className="text-xs text-zinc-500 mt-1 leading-relaxed">{opt.description}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
