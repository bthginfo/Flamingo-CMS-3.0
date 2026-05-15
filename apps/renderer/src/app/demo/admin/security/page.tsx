'use client';

import { toast } from 'sonner';

export default function Page() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Passwort &amp; Zugang</h1>
      <p className="text-zinc-500 text-sm mb-8">Admin-Passwort ändern und Zugangsdaten verwalten.</p>
      <div className="admin-card p-12 text-center text-zinc-400">
        <p className="text-lg mb-2">Noch keine Einträge</p>
        <p className="text-sm">In der Vollversion können Sie hier Inhalte verwalten.</p>
        <button className="admin-btn-primary mt-4" onClick={() => toast.info('Demo-Modus — Funktion nicht verfügbar')}>+ Erstellen</button>
      </div>
    </div>
  );
}
