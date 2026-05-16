'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Search, X } from 'lucide-react';
import * as icons from 'lucide-react';

// Get all icon names (filter out non-icon exports)
const ALL_ICONS = Object.keys(icons).filter(
  k => k !== 'default' && k !== 'createLucideIcon' && k !== 'icons' &&
    typeof (icons as Record<string, unknown>)[k] === 'object' && k[0] === k[0].toUpperCase()
);

/**
 * Lucide icon picker with live search and preview.
 * Uses a portal so the dropdown escapes any stacking-context / overflow clipping.
 */
export function IconPickerField({ label, value, onChange }: { label: string; value: string; onChange: (icon: string) => void }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [pos, setPos] = useState<{ top: number; left: number; width: number }>({ top: 0, left: 0, width: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Position dropdown relative to trigger button
  useEffect(() => {
    if (!open || !triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setPos({ top: rect.bottom + 4, left: rect.left, width: rect.width });
  }, [open]);

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      const target = e.target as Node;
      if (triggerRef.current?.contains(target)) return;
      if (dropdownRef.current?.contains(target)) return;
      setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const filtered = useMemo(() => {
    if (!search) return ALL_ICONS.slice(0, 60);
    const q = search.toLowerCase();
    return ALL_ICONS.filter(k => k.toLowerCase().includes(q)).slice(0, 60);
  }, [search]);

  function renderIcon(name: string, size = 18) {
    const Icon = (icons as unknown as Record<string, React.FC<{ size?: number }>>)[name];
    if (!Icon) return null;
    return <Icon size={size} />;
  }

  return (
    <div className="text-sm">
      <span className="text-gray-600 text-xs block mb-1">{label}</span>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(!open)}
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
          <span className="text-xs text-gray-400">Icon auswaehlen...</span>
        )}
      </button>

      {open && createPortal(
        <div
          ref={dropdownRef}
          className="fixed bg-white border rounded-lg shadow-xl max-h-[320px] flex flex-col"
          style={{ top: pos.top, left: pos.left, width: pos.width, zIndex: 9999 }}
        >
          <div className="p-2 border-b flex items-center gap-2">
            <Search size={14} className="text-gray-400 shrink-0" />
            <input
              autoFocus
              className="w-full text-xs outline-none"
              placeholder="Icon suchen..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="overflow-y-auto p-2 grid grid-cols-6 gap-1">
            {filtered.map(name => (
              <button
                key={name}
                type="button"
                title={name}
                onClick={() => { onChange(name); setOpen(false); setSearch(''); }}
                className={`flex flex-col items-center gap-0.5 p-2 rounded hover:bg-blue-50 transition ${value === name ? 'bg-blue-100 ring-1 ring-blue-300' : ''}`}
              >
                {renderIcon(name, 20)}
                <span className="text-[9px] text-gray-500 truncate w-full text-center">{name}</span>
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="col-span-6 text-center text-xs text-gray-400 py-4">Kein Icon gefunden</p>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
