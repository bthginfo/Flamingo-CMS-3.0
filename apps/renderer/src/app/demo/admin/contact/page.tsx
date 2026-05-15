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

export default function DemoContactPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Kontakt & Zeiten</h1>
      <p className="text-zinc-500 text-sm mb-8">Kontaktdaten, Adresse und Öffnungszeiten.</p>
      <div className="admin-card p-6 space-y-4 mb-6">
        <h2 className="font-semibold mb-2">Kontaktdaten</h2>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Telefon" value="+49 221 987 654" />
          <Field label="E-Mail" value="info@mueller-soehne.de" />
        </div>
        <Field label="Adresse" value="Handwerkerstraße 12, 50667 Köln" />
      </div>
      <div className="admin-card p-6 space-y-4">
        <h2 className="font-semibold mb-2">Öffnungszeiten</h2>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Montag - Freitag" value="07:00 - 18:00 Uhr" />
          <Field label="Samstag" value="08:00 - 14:00 Uhr" />
          <Field label="Sonntag" value="Geschlossen" />
          <Field label="Notdienst" value="24/7 erreichbar" />
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <button className="admin-btn-primary" onClick={() => toast.success('Demo-Modus — Änderungen werden nicht gespeichert')}>Speichern</button>
      </div>
    </div>
  );
}
