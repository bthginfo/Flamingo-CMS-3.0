'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

type SmtpConfig = { host: string; port: number; user: string; pass: string; from: string };

export default function MailPage() {
  const [config, setConfig] = useState<SmtpConfig>({ host: '', port: 587, user: '', pass: '', from: '' });
  const [hasPassword, setHasPassword] = useState(false);
  const [platformSmtp, setPlatformSmtp] = useState<{ ready: boolean; from: string | null }>({ ready: false, from: null });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/admin/api/smtp').then(response => response.json()).then(data => {
      if (data.smtp) setConfig(data.smtp);
      setHasPassword(Boolean(data.hasPassword));
      setPlatformSmtp({
        ready: Boolean(data.platformSmtpReady),
        from: typeof data.platformSmtpFrom === 'string' ? data.platformSmtpFrom : null,
      });
    }).catch(() => {});
  }, []);

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    try {
      const response = await fetch('/admin/api/smtp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      const result = await response.json().catch(() => null) as { error?: string } | null;
      if (response.ok) {
        toast.success('SMTP-Einstellungen gespeichert.');
        if (config.pass) {
          setHasPassword(true);
          setConfig(current => ({ ...current, pass: '' }));
        }
      } else {
        toast.error(result?.error || 'Fehler beim Speichern.');
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Mail-Server</h1>
      <p className="text-zinc-500 text-sm mb-8">SMTP-Konfiguration für den Versand von Kontaktformular-Nachrichten.</p>

      {platformSmtp.ready ? (
        <div className="admin-card p-5 mb-6 bg-green-50 border-green-200 space-y-2">
          <h3 className="font-semibold text-sm text-green-900">Standard-Versand über Flamingo Media aktiv</h3>
          <p className="text-sm text-green-800">
            Solange hier kein eigener SMTP-Server hinterlegt ist, werden Kontaktformular-Nachrichten über den Flamingo Media Mailserver
            {platformSmtp.from ? <> (<code className="bg-green-100 px-1 rounded">{platformSmtp.from}</code>)</> : null} versendet.
            Ein eigener SMTP-Server wird immer bevorzugt.
          </p>
        </div>
      ) : (
        <div className="admin-card p-5 mb-6 bg-amber-50 border-amber-200 space-y-2">
          <h3 className="font-semibold text-sm text-amber-950">Kein Standard-Mailserver auf diesem Renderer aktiv</h3>
          <p className="text-sm text-amber-900">
            Bitte tragen Sie unten einen eigenen SMTP-Server ein oder konfigurieren Sie die Plattform-SMTP-Secrets im Vercel-Projekt.
            Ohne sicheren Mailserver können Versandfunktionen nicht zuverlässig senden.
          </p>
        </div>
      )}

      <div className="admin-card p-5 mb-6 bg-blue-50 border-blue-200 space-y-2">
        <h3 className="font-semibold text-sm text-blue-900">Wozu brauche ich das?</h3>
        <p className="text-sm text-blue-800">
          Wenn Besucher Ihr Kontaktformular ausfüllen, wird die Nachricht per E-Mail an Sie gesendet.
          Dafür benötigt Ihre Website einen Mail-Server (SMTP).
        </p>
        <details className="text-sm text-blue-800">
          <summary className="cursor-pointer font-medium hover:underline">Anleitung: So finden Sie Ihre SMTP-Daten</summary>
          <ol className="list-decimal list-inside mt-2 space-y-1 text-blue-700">
            <li>Loggen Sie sich bei Ihrem E-Mail-Hoster ein, z. B. IONOS, Strato, All-Inkl, Hetzner oder Google Workspace.</li>
            <li>Suchen Sie nach „SMTP-Einstellungen“ oder „E-Mail-Konfiguration“.</li>
            <li>Tragen Sie SMTP-Host, Port, Benutzername und Passwort ein.</li>
            <li>Als Absender-Adresse verwenden Sie eine Adresse Ihrer Domain, z. B. <code className="bg-blue-100 px-1 rounded">noreply@ihre-firma.de</code>.</li>
          </ol>
          <p className="mt-2 text-xs text-blue-600">Tipp: Verwenden Sie Port 587 mit STARTTLS. Port 465 nutzt SSL direkt.</p>
        </details>
      </div>

      <form onSubmit={handleSave} className="admin-card p-6 space-y-5">
        <h2 className="font-semibold text-lg">SMTP-Einstellungen</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="admin-label">SMTP Host</label>
            <input className="admin-input" placeholder="smtp.example.de" value={config.host} onChange={event => setConfig(current => ({ ...current, host: event.target.value }))} />
            <p className="text-xs text-zinc-400 mt-1">Der Servername Ihres E-Mail-Anbieters.</p>
          </div>
          <div>
            <label className="admin-label">Port</label>
            <input className="admin-input" type="number" min={1} max={65535} placeholder="587" value={config.port} onChange={event => setConfig(current => ({ ...current, port: Number(event.target.value) || 587 }))} />
            <p className="text-xs text-zinc-400 mt-1">587 (STARTTLS) oder 465 (SSL).</p>
          </div>
          <div>
            <label className="admin-label">Benutzername</label>
            <input className="admin-input" placeholder="noreply@example.de" value={config.user} onChange={event => setConfig(current => ({ ...current, user: event.target.value }))} />
            <p className="text-xs text-zinc-400 mt-1">Meist identisch mit der E-Mail-Adresse.</p>
          </div>
          <div>
            <label className="admin-label">Passwort</label>
            <input className="admin-input" type="password" placeholder={hasPassword ? 'Passwort ist sicher gespeichert' : '••••••••'} value={config.pass} onChange={event => setConfig(current => ({ ...current, pass: event.target.value }))} />
            <p className="text-xs text-zinc-400 mt-1">{hasPassword && !config.pass ? 'Gespeichert. Leer lassen, um es unverändert zu behalten.' : 'Das Passwort des E-Mail-Kontos.'}</p>
          </div>
        </div>
        <div>
          <label className="admin-label">Absender-Adresse</label>
          <input className="admin-input" placeholder="noreply@ihre-domain.de" value={config.from} onChange={event => setConfig(current => ({ ...current, from: event.target.value }))} />
          <p className="text-xs text-zinc-400 mt-1">Diese Adresse sehen Kunden als Absender. Sie sollte zu Ihrer Domain gehören.</p>
        </div>
        <button type="submit" disabled={saving} className="admin-btn-primary">
          {saving ? 'Speichern…' : 'Speichern'}
        </button>
      </form>
    </div>
  );
}
