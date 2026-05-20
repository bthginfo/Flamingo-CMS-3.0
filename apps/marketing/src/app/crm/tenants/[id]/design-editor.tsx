'use client';

import { useState, useTransition } from 'react';
import { updateDesignAction } from '../actions';
import { toast } from 'sonner';
import { ChevronDown, ChevronRight, Save, RotateCcw } from 'lucide-react';

type BrandData = Record<string, unknown>;
type DesignData = Record<string, unknown>;

const BASIC_COLORS = [
  { key: 'primaryColor', label: 'Primary', desc: 'Hauptfarbe, Buttons, Links' },
  { key: 'secondaryColor', label: 'Secondary', desc: 'Sekundäre Elemente' },
  { key: 'accentColor', label: 'Accent', desc: 'Akzente, Highlights' },
] as const;

const EXTENDED_COLORS = [
  { key: 'textPrimary', label: 'Text Primary', desc: 'Haupttextfarbe', cssVar: '--style-text-primary' },
  { key: 'textSecondary', label: 'Text Secondary', desc: 'Sekundärer Text', cssVar: '--style-text-secondary' },
  { key: 'sectionBg', label: 'Section BG', desc: 'Sektionshintergrund', cssVar: '--style-section-bg' },
  { key: 'sectionBgAlt', label: 'Section BG Alt', desc: 'Alternativer Hintergrund', cssVar: '--style-section-bg-alt' },
  { key: 'cardBg', label: 'Card BG', desc: 'Kartenhintergrund', cssVar: '--style-card-bg' },
  { key: 'badgeBg', label: 'Badge BG', desc: 'Badge-Hintergrund', cssVar: '--style-badge-bg' },
  { key: 'badgeText', label: 'Badge Text', desc: 'Badge-Textfarbe', cssVar: '--style-badge-text' },
  { key: 'brand', label: 'Brand', desc: 'Markenfarbe / Logo-Farbe', cssVar: '--style-brand' },
  { key: 'dividerColor', label: 'Divider', desc: 'Trennlinien', cssVar: '--style-divider-color' },
  { key: 'textMuted', label: 'Text Muted', desc: 'Gedämpfter Text (z.B. Labels)', cssVar: '--style-text-muted' },
  { key: 'bgSubtle', label: 'BG Subtle', desc: 'Dezenter Hintergrund', cssVar: '--style-bg-subtle' },
  { key: 'borderStrong', label: 'Border Strong', desc: 'Starke Rahmenfarbe', cssVar: '--style-border-strong' },
  { key: 'borderLight', label: 'Border Light', desc: 'Leichte Rahmenfarbe', cssVar: '--style-border-light' },
] as const;

function normalizeHex(v: string): string {
  if (!v || !v.startsWith('#')) return '#000000';
  const hex = v.replace('#', '');
  if (hex.length === 3) return `#${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
  if (hex.length === 6) return v;
  return '#000000';
}

function ColorField({ label, desc, value, onChange }: { label: string; desc: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-3">
      <input
        type="color"
        value={normalizeHex(value)}
        onChange={e => onChange(e.target.value)}
        className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer p-0.5"
      />
      <div className="flex-1 min-w-0">
        <label className="text-sm font-medium text-slate-700">{label}</label>
        <p className="text-xs text-slate-400">{desc}</p>
      </div>
      <input
        type="text"
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        placeholder="#000000"
        className="crm-input w-28 text-xs font-mono"
      />
      {value && (
        <button onClick={() => onChange('')} className="text-slate-300 hover:text-slate-500 transition-colors" title="Zurücksetzen">
          <RotateCcw size={14} />
        </button>
      )}
    </div>
  );
}

export function DesignEditor({ tenantId, initialBrand, initialDesign }: { tenantId: string; initialBrand: BrandData; initialDesign: DesignData }) {
  const [brand, setBrand] = useState<BrandData>({ ...initialBrand });
  const [design, setDesign] = useState<DesignData>({ ...initialDesign });
  const [showExtended, setShowExtended] = useState(false);
  const [pending, startTransition] = useTransition();

  const setBrandField = (key: string, value: string) => setBrand(prev => ({ ...prev, [key]: value }));
  const setDesignField = (key: string, value: string) => setDesign(prev => value ? { ...prev, [key]: value } : (() => { const next = { ...prev }; delete next[key]; return next; })());

  function save() {
    startTransition(async () => {
      const result = await updateDesignAction(tenantId, { brand, design });
      if (result.success) toast.success('Design gespeichert');
    });
  }

  return (
    <div className="crm-card">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <h2 className="font-semibold text-slate-900">Design & Farben</h2>
        <button onClick={save} disabled={pending} className="crm-btn text-xs bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800">
          <Save size={14} /> {pending ? 'Speichern…' : 'Speichern'}
        </button>
      </div>

      <div className="p-5 space-y-6">
        {/* Basic colors */}
        <div>
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Hauptfarben</h3>
          <div className="space-y-3">
            {BASIC_COLORS.map(c => (
              <ColorField
                key={c.key}
                label={c.label}
                desc={c.desc}
                value={(brand[c.key] as string) || ''}
                onChange={v => setBrandField(c.key, v)}
              />
            ))}
          </div>
        </div>

        {/* Extended colors toggle */}
        <button
          onClick={() => setShowExtended(!showExtended)}
          className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          {showExtended ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          Erweiterte Farben ({EXTENDED_COLORS.length} Variablen)
        </button>

        {showExtended && (
          <div className="pl-2 border-l-2 border-indigo-100 space-y-3">
            <p className="text-xs text-slate-400">
              Diese Farben überschreiben die Industrie-Standardwerte. Leer lassen = Standard wird verwendet.
            </p>
            {EXTENDED_COLORS.map(c => (
              <ColorField
                key={c.key}
                label={c.label}
                desc={`${c.desc} (${c.cssVar})`}
                value={(design[c.key] as string) || ''}
                onChange={v => setDesignField(c.key, v)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
