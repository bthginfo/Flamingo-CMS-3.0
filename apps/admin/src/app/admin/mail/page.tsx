'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

type SmtpConfig = { host: string; port: number; user: string; pass: string; from: string };

export default function MailPage() {
  const [config, setConfig] = useState<SmtpConfig>({ host: '', port: 587, user: '', pass: '', from: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/admin/api/smtp').then(r => r.json()).then(data => {
      if (data.smtp) setConfig(data.smtp);
    }).catch(() => {});
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/admin/api/smtp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      if (res.ok) toast.success('SMTP-Einstellungen gespeichert.');
      else toast.error('Fehler beim Speichern.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Mail-Server</h1>
      <p className="text-zinc-500 text-sm mb-8">SMTP-Konfiguration für den Versand von Kontaktformular-Nachrichten.</p>
      <form onSubmit={handleSave} className="admin-card p-6 space-y-5">
        <h2 className="font-semibold text-lg">SMTP-Einstellungen</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="admin-label">SMTP Host</label>
            <input className="admin-input" placeholder="smtp.example.de" value={config.host} onChange={e => setConfig(c => ({ ...c, host: e.target.value }))} />
          </div>
          <div>
            <label className="admin-label">Port</label>
            <input className="admin-input" type="number" placeholder="587" value={config.port} onChange={e => setConfig(c => ({ ...c, port: Number(e.target.value) }))} />
          </div>
          <div>
            <label className="admin-label">Benutzername</label>
            <input className="admin-input" placeholder="noreply@example.de" value={config.user} onChange={e => setConfig(c => ({ ...c, user: e.target.value }))} />
          </div>
          <div>
            <label className="admin-label">Passwort</label>
            <input className="admin-input" type="password" placeholder="••••••••" value={config.pass} onChange={e => setConfig(c => ({ ...c, pass: e.target.value }))} />
          </div>
        </div>
        <div>
          <label className="admin-label">Absender-Adresse</label>
          <input className="admin-input" placeholder="noreply@ihre-domain.de" value={config.from} onChange={e => setConfig(c => ({ ...c, from: e.target.value }))} />
        </div>
        <button type="submit" disabled={saving} className="admin-btn-primary">
          {saving ? 'Speichern…' : 'Speichern'}
        </button>
      </form>
    </div>
  );
}
