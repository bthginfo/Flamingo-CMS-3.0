'use client';

import { useState } from 'react';
import { toast } from 'sonner';

function Field({ label, value: init, multiline }: { label: string; value: string; multiline?: boolean }) {
  const [v, setV] = useState(init);
  return (
    <label className="block text-sm">
      <span className="text-zinc-500 text-xs font-medium">{label}</span>
      {multiline ? (
        <textarea value={v} onChange={(e) => setV(e.target.value)} rows={3} className="admin-input mt-1 w-full" />
      ) : (
        <input value={v} onChange={(e) => setV(e.target.value)} className="admin-input mt-1 w-full" />
      )}
    </label>
  );
}

export default function DemoSeoPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">SEO & Sichtbarkeit</h1>
      <p className="text-zinc-500 text-sm mb-8">Meta-Tags und Open-Graph-Einstellungen für bessere Auffindbarkeit.</p>
      <div className="admin-card p-6 space-y-4 mb-6">
        <h2 className="font-semibold mb-2">Meta-Tags</h2>
        <Field label="Seitentitel" value="Müller & Söhne Meisterbetrieb | Sanitär, Heizung & Bäder in Köln" />
        <Field label="Meta-Beschreibung" value="Ihr Meisterbetrieb für Sanitär, Heizung und Bäder in Köln. Seit 1987 stehen wir für Qualität, Zuverlässigkeit und persönliche Beratung." multiline />
      </div>
      <div className="admin-card p-6 space-y-4 mb-6">
        <h2 className="font-semibold mb-2">Open Graph</h2>
        <Field label="OG Titel" value="Müller & Söhne — Meisterbetrieb Köln" />
        <Field label="OG Beschreibung" value="Sanitär, Heizung und Bäder — persönlich beraten, professionell umgesetzt." multiline />
        <div>
          <span className="text-zinc-500 text-xs font-medium">OG Bild</span>
          <div className="mt-1 border border-dashed border-zinc-300 rounded-xl p-6 text-center text-sm text-zinc-400">
            Bild hochladen (1200×630px empfohlen)
          </div>
        </div>
      </div>
      <div className="admin-card p-6 space-y-4">
        <h2 className="font-semibold mb-2">Erweitert</h2>
        <Field label="Canonical URL" value="https://www.mueller-soehne.de" />
        <Field label="robots.txt Ergänzung" value="" multiline />
      </div>
      <div className="mt-6 flex justify-end">
        <button className="admin-btn-primary" onClick={() => toast.success('Demo-Modus — Änderungen werden nicht gespeichert')}>Speichern</button>
      </div>
    </div>
  );
}
