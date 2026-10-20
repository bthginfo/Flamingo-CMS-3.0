'use client';

import { useState, useMemo, useRef, useEffect, useCallback, useId } from 'react';
import { createPortal } from 'react-dom';
import { Search, X } from 'lucide-react';
import * as icons from 'lucide-react';
import { resolveIcon, canonicalIconName } from './ui/icon-map';
import { useModalFocusTrap } from '@/hooks/use-modal-focus-trap';

// Build the icon list from lucide exports. Do not require function exports
// because newer bundling can represent component exports differently.
const ALL_ICONS = Object.keys(icons).filter((k) => {
  if (k === 'default' || k === 'createLucideIcon' || k === 'icons') return false;
  if (!k || k[0] !== k[0].toUpperCase()) return false;
  return resolveIcon(k) !== null;
});

function renderIcon(name: string, size = 18) {
  const Icon = resolveIcon(name);
  if (!Icon) return null;
  return <Icon size={size} />;
}

/**
 * Lucide icon picker presented as a full-screen modal with category-style grid.
 */
export function IconPickerField({ label, value, onChange }: { label: string; value: string; onChange: (icon: string) => void }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const fieldId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  useModalFocusTrap({ active: open && mounted, containerRef: dialogRef, initialFocusRef: inputRef, onEscape: () => setOpen(false) });

  // Lock body scroll when modal is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  const filtered = useMemo(() => {
    if (!search) return ALL_ICONS;
    const q = search.toLowerCase();
    return ALL_ICONS.filter(k => k.toLowerCase().includes(q));
  }, [search]);

  // Resolve legacy/kebab-case stored value to its canonical name so the
  // grid can highlight the currently-selected icon even if the saved value
  // is non-canonical.
  const canonicalValue = useMemo(() => canonicalIconName(value || ''), [value]);

  const handleSelect = useCallback((name: string) => {
    onChange(name);
    setOpen(false);
    setSearch('');
  }, [onChange]);

  return (
    <div className="text-sm">
      <span id={`${fieldId}-label`} className="text-gray-600 text-xs block mb-1">{label}</span>
      <div className="flex items-stretch gap-1.5">
      <button
        ref={openerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`${label}: Symbol auswählen`}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? `${fieldId}-dialog` : undefined}
        className="admin-input min-h-11 min-w-0 flex-1 flex items-center gap-2 text-left"
      >
        {value ? (
          <>
            {renderIcon(value, 16)}
            <span className="text-xs truncate flex-1">{value}</span>
          </>
        ) : (
          <span className="text-xs text-gray-600">Symbol auswählen…</span>
        )}
      </button>
      <button type="button" aria-label={`${label}: Symbol entfernen`} disabled={!value} onClick={() => { onChange(''); openerRef.current?.focus(); }} className="flex min-h-11 min-w-11 items-center justify-center rounded border border-gray-200 text-gray-600 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-30"><X size={16} aria-hidden="true" /></button>
      </div>

      {open && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} />

          {/* Modal */}
          <div ref={dialogRef} id={`${fieldId}-dialog`} role="dialog" aria-modal="true" aria-labelledby={`${fieldId}-title`} tabIndex={-1} className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <h3 id={`${fieldId}-title`} className="sr-only">{label}: Symbol auswählen</h3>
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
              <Search size={18} className="text-gray-400 shrink-0" />
              <input
                ref={inputRef}
                aria-label="Icons suchen"
                className="flex-1 text-sm outline-none placeholder:text-gray-400"
                placeholder="Icon suchen..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button type="button" aria-label="Symbolauswahl schließen" onClick={() => setOpen(false)} className="flex min-h-11 min-w-11 items-center justify-center rounded-lg hover:bg-gray-100 text-gray-600 transition">
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto p-4">
              {filtered.length === 0 ? (
                <p className="text-center text-sm text-gray-400 py-12">Kein Icon gefunden für &ldquo;{search}&rdquo;</p>
              ) : (
                <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-1">
                  {filtered.map(name => (
                    <button
                      key={name}
                      type="button"
                      title={name}
                      aria-label={name}
                      aria-pressed={canonicalValue === name}
                      onClick={() => handleSelect(name)}
                      className={`flex flex-col items-center gap-1 p-2.5 rounded-xl transition-all hover:bg-blue-50 hover:scale-105 ${canonicalValue === name ? 'bg-blue-100 ring-2 ring-blue-400 scale-105' : ''}`}
                    >
                      {renderIcon(name, 22)}
                      <span className="text-[8px] text-gray-500 truncate w-full text-center leading-tight">{name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer with count */}
            <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400 flex items-center justify-between">
              <span>{filtered.length} Icons{search ? ` für "${search}"` : ''}</span>
              {value && (
                <span className="flex items-center gap-1.5 text-gray-600">
                  Aktuell: {renderIcon(value, 14)} <strong>{value}</strong>
                </span>
              )}
            </div>
          </div>
        </div>, document.body
      )}
    </div>
  );
}
