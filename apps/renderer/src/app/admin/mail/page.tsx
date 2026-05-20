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

      <div className="admin-card p-5 mb-6 bg-blue-50 border-blue-200 space-y-2">
        <h3 className="font-semibold text-sm text-blue-900">Wozu brauche ich das?</h3>
        <p className="text-sm text-blue-800">Wenn Besucher Ihr Kontaktformular ausfüllen, wird die Nachricht per E-Mail an Sie gesendet. Dafür benötigt Ihre Website einen Mail-Server (SMTP). Ohne diese Einstellungen funktioniert das Kontaktformular nicht.</p>
        <details className="text-sm text-blue-800">
          <summary className="cursor-pointer font-medium hover:underline">Anleitung: So finden Sie Ihre SMTP-Daten</summary>
          <ol className="list-decimal list-inside mt-2 space-y-1 text-blue-700">
            <li>Loggen Sie sich bei Ihrem E-Mail-Hoster ein (z.B. IONOS, Strato, All-Inkl, Hetzner, Google Workspace).</li>
            <li>Suchen Sie nach &quot;SMTP-Einstellungen&quot; oder &quot;E-Mail-Konfiguration&quot;.</li>
            <li>Tragen Sie <strong>SMTP-Host</strong> (z.B. <code className="bg-blue-100 px-1 rounded">smtp.ionos.de</code>), <strong>Port</strong> (meist <code className="bg-blue-100 px-1 rounded">587</code>), <strong>Benutzername</strong> (meist Ihre E-Mail-Adresse) und <strong>Passwort</strong> ein.</li>
            <li>Als <strong>Absender-Adresse</strong> verwenden Sie eine Adresse Ihrer Domain (z.B. <code className="bg-blue-100 px-1 rounded">noreply@ihre-firma.de</code>).</li>
          </ol>
          <p className="mt-2 text-xs text-blue-600">Tipp: Verwenden Sie Port 587 mit STARTTLS. Port 465 nutzt SSL direkt. Port 25 ist veraltet.</p>
        </details>
      </div>

      <form onSubmit={handleSave} className="admin-card p-6 space-y-5">
        <h2 className="font-semibold text-lg">SMTP-Einstellungen</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="admin-label">SMTP Host</label>
            <input className="admin-input" placeholder="smtp.example.de" value={config.host} onChange={e => setConfig(c => ({ ...c, host: e.target.value }))} />
            <p className="text-xs text-zinc-400 mt-1">Der Servername Ihres E-Mail-Anbieters</p>
          </div>
          <div>
            <label className="admin-label">Port</label>
            <input className="admin-input" type="number" placeholder="587" value={config.port} onChange={e => setConfig(c => ({ ...c, port: Number(e.target.value) }))} />
            <p className="text-xs text-zinc-400 mt-1">587 (STARTTLS) oder 465 (SSL)</p>
          </div>
          <div>
            <label className="admin-label">Benutzername</label>
            <input className="admin-input" placeholder="noreply@example.de" value={config.user} onChange={e => setConfig(c => ({ ...c, user: e.target.value }))} />
            <p className="text-xs text-zinc-400 mt-1">Meist identisch mit der E-Mail-Adresse</p>
          </div>
          <div>
            <label className="admin-label">Passwort</label>
            <input className="admin-input" type="password" placeholder="••••••••" value={config.pass} onChange={e => setConfig(c => ({ ...c, pass: e.target.value }))} />
            <p className="text-xs text-zinc-400 mt-1">Das Passwort des E-Mail-Kontos</p>
          </div>
        </div>
        <div>
          <label className="admin-label">Absender-Adresse</label>
          <input className="admin-input" placeholder="noreply@ihre-domain.de" value={config.from} onChange={e => setConfig(c => ({ ...c, from: e.target.value }))} />
          <p className="text-xs text-zinc-400 mt-1">Diese Adresse sehen Ihre Kunden als Absender. Sollte zu Ihrer Domain gehören.</p>
        </div>
        <button type="submit" disabled={saving} className="admin-btn-primary">
          {saving ? 'Speichern…' : 'Speichern'}
        </button>
      </form>
    </div>
  );
}
