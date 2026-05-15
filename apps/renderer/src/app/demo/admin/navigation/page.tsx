'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { GripVertical, Plus, Trash2 } from 'lucide-react';

function Field({ label, value: init }: { label: string; value: string }) {
  const [v, setV] = useState(init);
  return (
    <label className="block text-sm">
      <span className="text-zinc-500 text-xs font-medium">{label}</span>
      <input value={v} onChange={(e) => setV(e.target.value)} className="admin-input mt-1 w-full" />
    </label>
  );
}

const NAV_ITEMS = [
  { label: 'Leistungen', href: '/leistungen' },
  { label: 'Über uns', href: '/ueber-uns' },
  { label: 'Projekte', href: '/projekte' },
  { label: 'Kontakt', href: '/kontakt' },
];

const FOOTER_COLS = [
  { title: 'Leistungen', links: ['Sanitär', 'Heizung', 'Bäder', 'Notdienst'] },
  { title: 'Unternehmen', links: ['Über uns', 'Team', 'Karriere', 'Partner'] },
  { title: 'Kontakt', links: ['Telefon', 'E-Mail', 'Anfahrt', 'Öffnungszeiten'] },
];

export default function DemoNavigationPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Navigation & Footer</h1>
      <p className="text-zinc-500 text-sm mb-8">Verwalten Sie die Hauptnavigation und den Footer Ihrer Website.</p>

      <div className="admin-card p-6 mb-6">
        <h2 className="font-semibold mb-4">Hauptnavigation</h2>
        <div className="space-y-2">
          {NAV_ITEMS.map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-zinc-50 rounded-lg">
              <GripVertical size={16} className="text-zinc-300" />
              <div className="grid grid-cols-2 gap-3 flex-1">
                <Field label="Label" value={item.label} />
                <Field label="Link" value={item.href} />
              </div>
              <button className="text-zinc-300 hover:text-red-500"><Trash2 size={16} /></button>
            </div>
          ))}
        </div>
        <button className="mt-3 text-sm text-zinc-400 hover:text-zinc-600 flex items-center gap-1"
          onClick={() => toast.info('Demo-Modus')}>
          <Plus size={14} /> Link hinzufügen
        </button>
        <div className="mt-4 pt-4 border-t border-zinc-100">
          <h3 className="text-sm font-semibold mb-3">CTA-Button</h3>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Label" value="Anfrage senden" />
            <Field label="Link" value="/kontakt" />
          </div>
        </div>
      </div>

      <div className="admin-card p-6">
        <h2 className="font-semibold mb-4">Footer</h2>
        <div className="grid grid-cols-3 gap-4">
          {FOOTER_COLS.map((col, i) => (
            <div key={i} className="space-y-2">
              <Field label="Spalten-Titel" value={col.title} />
              {col.links.map((link, j) => (
                <div key={j} className="flex items-center gap-2">
                  <input value={link} readOnly className="admin-input w-full text-sm" />
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-zinc-100">
          <h3 className="text-sm font-semibold mb-3">Footer-CTA</h3>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Label" value="Kostenloses Angebot" />
            <Field label="Link" value="/kontakt" />
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button className="admin-btn-primary" onClick={() => toast.success('Demo-Modus — Änderungen werden nicht gespeichert')}>Speichern</button>
      </div>
    </div>
  );
}
