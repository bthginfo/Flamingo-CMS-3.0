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

export default function DemoSocialPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Social Media</h1>
      <p className="text-zinc-500 text-sm mb-8">Verknüpfen Sie Ihre Social-Media-Profile.</p>
      <div className="admin-card p-6 space-y-4">
        <Field label="Instagram" value="https://instagram.com/mueller.soehne" />
        <Field label="Facebook" value="https://facebook.com/muellersoehne" />
        <Field label="Google Business" value="https://g.co/mueller-soehne-koeln" />
        <Field label="LinkedIn" value="" />
        <Field label="YouTube" value="" />
        <Field label="TikTok" value="" />
      </div>
      <div className="mt-6 flex justify-end">
        <button className="admin-btn-primary" onClick={() => toast.success('Demo-Modus — Änderungen werden nicht gespeichert')}>Speichern</button>
      </div>
    </div>
  );
}
