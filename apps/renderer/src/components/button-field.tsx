'use client';

import { useState, useEffect } from 'react';
import { ExternalLink, FileText } from 'lucide-react';
import { getPagesAction } from '@/app/admin/pages/actions';

type ButtonValue = { label: string; href: string };

/**
 * Combined button editor: label + internal/external link selection.
 */
export function ButtonField({ label: fieldLabel, value, onChange }: { label: string; value: ButtonValue; onChange: (v: ButtonValue) => void }) {
  const isInternal = value.href.startsWith('/') || value.href.startsWith('#') || value.href === '';
  const [mode, setMode] = useState<'external' | 'internal'>(value.href && !isInternal ? 'external' : 'internal');
  const [pages, setPages] = useState<{ id: string; title: string; slug: string }[]>([]);

  useEffect(() => {
    if (mode === 'internal') {
      getPagesAction().then((p) => setPages(p.map(pg => ({ id: pg.id, title: pg.title, slug: pg.slug }))));
    }
  }, [mode]);

  return (
    <div className="text-sm border rounded p-3 bg-gray-50/50 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-gray-600 text-xs font-medium">{fieldLabel}</span>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => { setMode('internal'); if (!value.href.startsWith('/') && !value.href.startsWith('#')) onChange({ ...value, href: '/' }); }}
            className={`text-[10px] px-1.5 py-0.5 rounded ${mode === 'internal' ? 'bg-blue-100 text-blue-700' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <FileText size={10} className="inline mr-0.5" /> Intern
          </button>
          <button
            type="button"
            onClick={() => { setMode('external'); if (value.href.startsWith('/') || value.href.startsWith('#')) onChange({ ...value, href: '' }); }}
            className={`text-[10px] px-1.5 py-0.5 rounded ${mode === 'external' ? 'bg-blue-100 text-blue-700' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <ExternalLink size={10} className="inline mr-0.5" /> Extern
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <label className="block">
          <span className="text-gray-500 text-[10px]">Button-Text</span>
          <input
            className="admin-input w-full mt-0.5"
            value={value.label}
            onChange={(e) => onChange({ ...value, label: e.target.value })}
            placeholder="z.B. Mehr erfahren"
          />
        </label>
        <label className="block">
          <span className="text-gray-500 text-[10px]">Ziel</span>
          {mode === 'external' ? (
            <input
              className="admin-input w-full mt-0.5"
              value={value.href}
              onChange={(e) => onChange({ ...value, href: e.target.value })}
              placeholder="https://..."
            />
          ) : (
            <select
              className="admin-input w-full mt-0.5"
              value={value.href}
              onChange={(e) => onChange({ ...value, href: e.target.value })}
            >
              <option value="">-- Ziel --</option>
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
          )}
        </label>
      </div>
    </div>
  );
}

/**
 * Simpler link-only version: internal/external + href, no label.
 * Use for "Detail-Link" fields on items.
 */
export function DetailLinkField({ label: fieldLabel, value, onChange }: { label: string; value: string; onChange: (href: string) => void }) {
  const isInternal = value.startsWith('/') || value.startsWith('#') || value === '';
  const [mode, setMode] = useState<'external' | 'internal'>(value && !isInternal ? 'external' : 'internal');
  const [pages, setPages] = useState<{ id: string; title: string; slug: string }[]>([]);

  useEffect(() => {
    if (mode === 'internal') {
      getPagesAction().then((p) => setPages(p.map(pg => ({ id: pg.id, title: pg.title, slug: pg.slug }))));
    }
  }, [mode]);

  return (
    <div className="text-sm">
      <div className="flex items-center justify-between mb-1">
        <span className="text-gray-600 text-xs">{fieldLabel}</span>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => { setMode('internal'); if (!value.startsWith('/') && !value.startsWith('#')) onChange('/'); }}
            className={`text-[10px] px-1.5 py-0.5 rounded ${mode === 'internal' ? 'bg-blue-100 text-blue-700' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <FileText size={10} className="inline mr-0.5" /> Intern
          </button>
          <button
            type="button"
            onClick={() => { setMode('external'); if (value.startsWith('/') || value.startsWith('#')) onChange(''); }}
            className={`text-[10px] px-1.5 py-0.5 rounded ${mode === 'external' ? 'bg-blue-100 text-blue-700' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <ExternalLink size={10} className="inline mr-0.5" /> Extern
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
        <select
          className="admin-input w-full"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">-- Ziel auswählen --</option>
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
      )}
    </div>
  );
}
