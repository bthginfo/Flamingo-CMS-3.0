'use client';

import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Search, X } from 'lucide-react';
import * as icons from 'lucide-react';

// Get all icon names (filter out non-icon exports)
const ALL_ICONS = Object.keys(icons).filter(
  k => k !== 'default' && k !== 'createLucideIcon' && k !== 'icons' &&
    typeof (icons as Record<string, unknown>)[k] === 'object' && k[0] === k[0].toUpperCase()
);

function renderIcon(name: string, size = 18) {
  const Icon = (icons as unknown as Record<string, React.FC<{ size?: number }>>)[name];
  if (!Icon) return null;
  return <Icon size={size} />;
}

/**
 * Lucide icon picker presented as a full-screen modal with category-style grid.
 */
export function IconPickerField({ label, value, onChange }: { label: string; value: string; onChange: (icon: string) => void }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function handler(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  const filtered = useMemo(() => {
    if (!search) return ALL_ICONS.slice(0, 200);
    const q = search.toLowerCase();
    return ALL_ICONS.filter(k => k.toLowerCase().includes(q)).slice(0, 200);
  }, [search]);

  const handleSelect = useCallback((name: string) => {
    onChange(name);
    setOpen(false);
    setSearch('');
  }, [onChange]);

  return (
    <div className="text-sm">
      <span className="text-gray-600 text-xs block mb-1">{label}</span>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="admin-input w-full flex items-center gap-2 text-left"
      >
        {value ? (
          <>
            {renderIcon(value, 16)}
            <span className="text-xs truncate flex-1">{value}</span>
            <button type="button" onClick={(e) => { e.stopPropagation(); onChange(''); }} className="text-gray-400 hover:text-red-500">
              <X size={12} />
            </button>
          </>
        ) : (
          <span className="text-xs text-gray-400">Icon auswählen...</span>
        )}
      </button>

      {open && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
              <Search size={18} className="text-gray-400 shrink-0" />
              <input
                ref={inputRef}
                className="flex-1 text-sm outline-none placeholder:text-gray-400"
                placeholder="Icon suchen..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button type="button" onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition">
                <X size={18} />
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
                      onClick={() => handleSelect(name)}
                      className={`flex flex-col items-center gap-1 p-2.5 rounded-xl transition-all hover:bg-blue-50 hover:scale-105 ${value === name ? 'bg-blue-100 ring-2 ring-blue-400 scale-105' : ''}`}
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
              <span>{filtered.length} Icons{search ? ` für „${search}"` : ''}</span>
              {value && (
                <span className="flex items-center gap-1.5 text-gray-600">
                  Aktuell: {renderIcon(value, 14)} <strong>{value}</strong>
                </span>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
