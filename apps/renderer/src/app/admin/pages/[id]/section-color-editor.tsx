'use client';

import { useState } from 'react';
import { Palette } from 'lucide-react';

type ColorOverrides = Record<string, string>;

const COLOR_FIELDS: { key: string; label: string; description: string }[] = [
  { key: '--style-section-bg', label: 'Hintergrund', description: 'Hintergrundfarbe der gesamten Sektion' },
  { key: '--style-card-bg', label: 'Karten-Hintergrund', description: 'Hintergrund von Karten / Containern' },
  { key: '--style-text-primary', label: 'Text (Haupt)', description: 'Headlines, Titel, primärer Text' },
  { key: '--style-text-secondary', label: 'Text (Sekundär)', description: 'Beschreibungen, Zwischentexte' },
  { key: '--style-text-muted', label: 'Text (Dezent)', description: 'Badges, Labels, dezente Elemente' },
  { key: '--brand-primary', label: 'Akzentfarbe / Icons', description: 'Icons, Buttons, Akzente' },
  { key: '--brand-btn-bg', label: 'Button Hintergrund', description: 'Primärer CTA-Button' },
  { key: '--brand-btn-text', label: 'Button Text', description: 'Textfarbe im Button' },
  { key: '--style-badge-bg', label: 'Badge Hintergrund', description: 'Hintergrund von Badges/Labels' },
  { key: '--style-badge-text', label: 'Badge Text', description: 'Textfarbe in Badges' },
];

export function SectionColorEditor({ value, onChange }: { value: ColorOverrides | null; onChange: (overrides: ColorOverrides | null) => void }) {
  const [open, setOpen] = useState(false);
  const overrides = value || {};
  const activeCount = Object.values(overrides).filter(Boolean).length;

  const handleChange = (key: string, color: string) => {
    const next = { ...overrides, [key]: color };
    // Remove empty values
    Object.keys(next).forEach(k => { if (!next[k]) delete next[k]; });
    onChange(Object.keys(next).length > 0 ? next : null);
  };

  const handleClear = (key: string) => {
    const next = { ...overrides };
    delete next[key];
    onChange(Object.keys(next).length > 0 ? next : null);
  };

  return (
    <details className="mt-4" open={open} onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}>
      <summary className="text-xs text-gray-500 cursor-pointer flex items-center gap-1">
        <Palette size={12} /> Farben anpassen
        {activeCount > 0 && <span className="ml-1 px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded-full text-[10px] font-medium">{activeCount}</span>}
      </summary>
      <div className="grid grid-cols-2 gap-3 mt-3">
        {COLOR_FIELDS.map(({ key, label, description }) => (
          <label key={key} className="block">
            <span className="text-gray-600 text-xs" title={description}>{label}</span>
            <div className="flex items-center gap-2 mt-1">
              <input
                type="color"
                className="w-8 h-8 rounded border border-gray-200 cursor-pointer p-0"
                value={overrides[key] || '#000000'}
                onChange={(e) => handleChange(key, e.target.value)}
              />
              <input
                type="text"
                className="admin-input flex-1 text-xs font-mono"
                placeholder="—"
                value={overrides[key] || ''}
                onChange={(e) => handleChange(key, e.target.value)}
              />
              {overrides[key] && (
                <button type="button" className="text-xs text-red-400 hover:text-red-600" onClick={() => handleClear(key)}>✕</button>
              )}
            </div>
          </label>
        ))}
      </div>
      {activeCount > 0 && (
        <button type="button" className="mt-3 text-xs text-red-500 hover:text-red-700" onClick={() => onChange(null)}>
          Alle Farb-Overrides entfernen
        </button>
      )}
    </details>
  );
}
