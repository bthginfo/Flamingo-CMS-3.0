'use client';

import { useState, useEffect, useRef } from 'react';
import { saveDesignSettings } from '../settings-actions';
import { toast } from 'sonner';
import { useSaveState, useRegisterSave } from '@/components/save-context';
import { getContrastColor, contrastRatio, getContrastLevel } from '@/lib/contrast';
import { Check, AlertTriangle, RotateCcw } from 'lucide-react';

type DesignData = Record<string, string>;

const BG_FIELDS = [
  { key: 'sectionBg', label: 'Section-Hintergrund (ungerade)', description: 'Hero, Services, FAQ, Kontakt u.a. — jede 1., 3., 5. Section auf der Seite. Wenn nicht gesetzt, wird Weiß verwendet.', default: '#ffffff' },
  { key: 'sectionBgAlt', label: 'Section-Hintergrund (gerade)', description: 'Alternierende Sections (2., 4., 6. …) — erzeugt visuellen Rhythmus. Standard: helles Grau aus den Stil-Vorgaben.', default: '#f8fafc' },
  { key: 'cardBg', label: 'Karten-Hintergrund', description: 'Leistungs-Karten, Team-Karten, Preis-Boxen, Testimonial-Cards und ähnliche hervorgehobene Elemente.', default: '#ffffff' },
  { key: 'bgSubtle', label: 'Dezenter Hintergrund', description: 'Feature-Listen, Info-Boxen, Statistik-Bereiche und andere dezent abgehobene Bereiche innerhalb einer Section.', default: '#f1f5f9' },
] as const;

const TEXT_OVERRIDE_KEYS: Record<string, string> = {
  sectionBg: 'textOnSectionBg',
  sectionBgAlt: 'textOnSectionBgAlt',
  cardBg: 'textOnCardBg',
  bgSubtle: 'textOnBgSubtle',
};

export function BackgroundForm({ initial }: { initial: DesignData }) {
  const [form, setForm] = useState<DesignData>({ ...initial });
  const [saving, setSaving] = useState(false);
  const { markDirty, markSaved } = useSaveState();
  const mounted = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);
  const formJson = JSON.stringify(form);

  useEffect(() => { if (mounted.current) markDirty(); else mounted.current = true; }, [formJson]);
  useRegisterSave(() => formRef.current?.requestSubmit());

  function updateField(key: string, value: string) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  function resetField(key: string) {
    setForm(prev => {
      const next = { ...prev };
      delete next[key];
      const textKey = TEXT_OVERRIDE_KEYS[key];
      if (textKey) delete next[textKey];
      return next;
    });
  }

  function updateTextOverride(bgKey: string, value: string) {
    const textKey = TEXT_OVERRIDE_KEYS[bgKey];
    if (!textKey) return;
    if (value === '') {
      setForm(prev => { const next = { ...prev }; delete next[textKey]; return next; });
    } else {
      setForm(prev => ({ ...prev, [textKey]: value }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      // Clean empty values
      const clean: DesignData = {};
      for (const [k, v] of Object.entries(form)) {
        if (v && v.trim()) clean[k] = v.trim();
      }
      await saveDesignSettings(clean);
      markSaved();
      toast.success('Hintergrundfarben gespeichert');
    } catch {
      toast.error('Fehler beim Speichern');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 mt-10">
      <div>
        <h2 className="text-lg font-semibold mb-1">Hintergrundfarben</h2>
        <p className="text-sm text-zinc-500 mb-6">
          Passen Sie die Hintergrundfarben Ihrer Website an. Textfarben werden automatisch berechnet, um mindestens WCAG AA Kontrast (4.5:1) zu gewährleisten.
        </p>
      </div>

      <div className="grid gap-5">
        {BG_FIELDS.map(field => {
          const bgValue = form[field.key] || field.default;
          const textOverrideKey = TEXT_OVERRIDE_KEYS[field.key];
          const textOverride = textOverrideKey ? form[textOverrideKey] : undefined;
          const autoTextColor = getContrastColor(bgValue);
          const activeTextColor = textOverride || autoTextColor;
          const ratio = contrastRatio(bgValue, activeTextColor);
          const level = getContrastLevel(bgValue, activeTextColor);

          return (
            <div key={field.key} className="rounded-xl border border-zinc-200 p-4 bg-white">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                  <label className="text-sm font-medium text-zinc-800">{field.label}</label>
                  <p className="text-xs text-zinc-500 mt-0.5">{field.description}</p>
                </div>
                {form[field.key] && (
                  <button type="button" onClick={() => resetField(field.key)} className="text-xs text-zinc-400 hover:text-zinc-600 flex items-center gap-1" title="Auf Standard zurücksetzen">
                    <RotateCcw size={12} /> Reset
                  </button>
                )}
              </div>

              <div className="flex items-center gap-4 flex-wrap">
                {/* BG Color picker */}
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <input
                      type="color"
                      value={bgValue}
                      onChange={e => updateField(field.key, e.target.value)}
                      className="w-10 h-10 rounded-lg border border-zinc-200 cursor-pointer p-0.5"
                    />
                  </div>
                  <input
                    type="text"
                    value={form[field.key] || ''}
                    onChange={e => updateField(field.key, e.target.value)}
                    placeholder={field.default}
                    className="w-24 px-2 py-1.5 text-sm border border-zinc-200 rounded-lg font-mono"
                  />
                </div>

                {/* Preview swatch */}
                <div
                  className="flex-1 min-w-[180px] rounded-lg px-4 py-3 border border-zinc-100 flex items-center justify-between"
                  style={{ backgroundColor: bgValue, color: activeTextColor }}
                >
                  <span className="text-sm font-medium">Vorschau-Text</span>
                  <span className="text-xs opacity-80">Aa Bb Cc 123</span>
                </div>

                {/* Contrast badge */}
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                  level === 'AAA' ? 'bg-green-50 text-green-700' :
                  level === 'AA' ? 'bg-green-50 text-green-600' :
                  'bg-amber-50 text-amber-700'
                }`}>
                  {level !== 'fail' ? <Check size={12} /> : <AlertTriangle size={12} />}
                  {ratio.toFixed(1)}:1 {level}
                </div>
              </div>

              {/* Text color override */}
              <div className="mt-3 pt-3 border-t border-zinc-100">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-zinc-500 whitespace-nowrap">Textfarbe:</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateTextOverride(field.key, '')}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                        !textOverride ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                      }`}
                    >
                      Auto ({autoTextColor})
                    </button>
                    {textOverride && (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="color"
                          value={textOverride}
                          onChange={e => updateTextOverride(field.key, e.target.value)}
                          className="w-6 h-6 rounded border border-zinc-200 cursor-pointer p-0"
                        />
                        <input
                          type="text"
                          value={textOverride}
                          onChange={e => updateTextOverride(field.key, e.target.value)}
                          className="w-20 px-2 py-1 text-xs border border-zinc-200 rounded font-mono"
                        />
                      </div>
                    )}
                    {!textOverride && (
                      <button
                        type="button"
                        onClick={() => updateTextOverride(field.key, autoTextColor)}
                        className="px-2.5 py-1 rounded-md text-xs bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                      >
                        Überschreiben
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button type="submit" disabled={saving} className="px-5 py-2.5 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-800 disabled:opacity-50">
        {saving ? 'Speichern…' : 'Hintergrundfarben speichern'}
      </button>
    </form>
  );
}
