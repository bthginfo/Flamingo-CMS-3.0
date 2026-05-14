'use client';

import { useState, useEffect } from 'react';
import { ExternalLink, FileText } from 'lucide-react';
import { getPagesAction } from '@/app/admin/pages/actions';

type LinkValue = { href: string; type?: 'external' | 'page' | 'section' };

/**
 * Link field: choose between external URL or internal page/section target.
 */
export function LinkField({ label, value, onChange }: { label: string; value: string; onChange: (href: string) => void }) {
  const isInternal = value.startsWith('/') || value.startsWith('#');
  const [mode, setMode] = useState<'external' | 'internal'>(isInternal ? 'internal' : 'external');
  const [pages, setPages] = useState<{ id: string; title: string; slug: string }[]>([]);

  useEffect(() => {
    if (mode === 'internal') {
      getPagesAction().then((p) => setPages(p.map(pg => ({ id: pg.id, title: pg.title, slug: pg.slug }))));
    }
  }, [mode]);

  return (
    <div className="text-sm">
      <div className="flex items-center justify-between mb-1">
        <span className="text-gray-600 text-xs">{label}</span>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => { setMode('external'); if (value.startsWith('/') || value.startsWith('#')) onChange(''); }}
            className={`text-[10px] px-1.5 py-0.5 rounded ${mode === 'external' ? 'bg-blue-100 text-blue-700' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <ExternalLink size={10} className="inline mr-0.5" /> Extern
          </button>
          <button
            type="button"
            onClick={() => { setMode('internal'); if (!value.startsWith('/') && !value.startsWith('#')) onChange('/'); }}
            className={`text-[10px] px-1.5 py-0.5 rounded ${mode === 'internal' ? 'bg-blue-100 text-blue-700' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <FileText size={10} className="inline mr-0.5" /> Intern
          </button>
        </div>
      </div>

      {mode === 'external' ? (
        <input
          className="admin-input w-full"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://..."
        />
      ) : (
        <div className="space-y-1">
          <select
            className="admin-input w-full"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          >
            <option value="">-- Ziel auswaehlen --</option>
            <optgroup label="Seiten">
              {pages.map(p => (
                <option key={p.id} value={`/${p.slug}`}>{p.title} (/{p.slug})</option>
              ))}
            </optgroup>
            <optgroup label="Sektionen (Anker)">
              <option value="#hero">Hero</option>
              <option value="#leistungen">Leistungen</option>
              <option value="#kontakt">Kontakt</option>
              <option value="#faq">FAQ</option>
              <option value="#team">Team</option>
              <option value="#portfolio">Portfolio</option>
              <option value="#bewertungen">Bewertungen</option>
            </optgroup>
          </select>
        </div>
      )}
    </div>
  );
}
