'use client';

import { useState } from 'react';
import { toast } from 'sonner';

function Field({ label, value: init }: { label: string; value: string }) {
  const [v, setV] = useState(init);
  return (
    <label className="block text-sm">
      <span className="text-zinc-500 text-xs font-medium">{label}</span>
      <input value={v} onChange={(e) => setV(e.target.value)} className="admin-input mt-1 w-full" />
    </label>
  );
}

function ColorField({ label, value: init }: { label: string; value: string }) {
  const [v, setV] = useState(init);
  return (
    <label className="block text-sm">
      <span className="text-zinc-500 text-xs font-medium">{label}</span>
      <div className="flex gap-2 mt-1">
        <input type="color" value={v} onChange={(e) => setV(e.target.value)} className="w-10 h-10 rounded-lg border border-zinc-200 cursor-pointer" />
        <input value={v} onChange={(e) => setV(e.target.value)} className="admin-input flex-1" />
      </div>
    </label>
  );
}

const STYLES = [
  { key: 'classic', label: 'Classic', desc: 'Zeitlos, warm, abgerundete Ecken' },
  { key: 'modern', label: 'Modern', desc: 'Minimalistisch, helle Layouts' },
  { key: 'bold', label: 'Bold', desc: 'Dynamisch, Uppercase, markant' },
];

export default function DemoBrandPage() {
  const [activeStyle, setActiveStyle] = useState('classic');

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Marke & Design</h1>
      <p className="text-zinc-500 text-sm mb-8">Firmenname, Slogan, Farbschema und Stil Ihrer Website.</p>

      <div className="admin-card p-6 mb-6">
        <h2 className="font-semibold mb-4">Design-Stil</h2>
        <div className="grid grid-cols-3 gap-3">
          {STYLES.map((s) => (
            <button key={s.key} onClick={() => setActiveStyle(s.key)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${activeStyle === s.key ? 'border-admin-accent bg-blue-50/50' : 'border-zinc-200 hover:border-zinc-300'}`}>
              <p className="font-semibold text-sm">{s.label}</p>
              <p className="text-xs text-zinc-500 mt-1">{s.desc}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="admin-card p-6 space-y-4 mb-6">
        <h2 className="font-semibold mb-2">Firmeninformationen</h2>
        <Field label="Firmenname" value="Müller & Söhne Meisterbetrieb" />
        <Field label="Tagline / Slogan" value="Ihr Partner für Sanitär, Heizung und Bäder" />
        <div>
          <span className="text-zinc-500 text-xs font-medium">Logo</span>
          <div className="mt-1 border border-dashed border-zinc-300 rounded-xl p-6 text-center text-sm text-zinc-400">
            Logo hochladen (SVG, PNG)
          </div>
        </div>
      </div>

      <div className="admin-card p-6 space-y-4">
        <h2 className="font-semibold mb-2">Farben</h2>
        <div className="grid grid-cols-2 gap-4">
          <ColorField label="Primärfarbe" value="#2563eb" />
          <ColorField label="Akzentfarbe" value="#f59e0b" />
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button className="admin-btn-primary" onClick={() => toast.success('Demo-Modus — Änderungen werden nicht gespeichert')}>Speichern</button>
      </div>
    </div>
  );
}
