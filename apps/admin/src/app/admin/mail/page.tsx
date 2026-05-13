export default function MailPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Mail-Server</h1>
      <p className="text-zinc-500 text-sm mb-8">SMTP-Konfiguration für den Versand von Kontaktformular-Nachrichten.</p>
      <div className="admin-card p-6 space-y-5">
        <h2 className="font-semibold text-lg">SMTP-Einstellungen</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="admin-label">SMTP Host</label>
            <input className="admin-input" placeholder="smtp.example.de" />
          </div>
          <div>
            <label className="admin-label">Port</label>
            <input className="admin-input" placeholder="587" />
          </div>
          <div>
            <label className="admin-label">Benutzername</label>
            <input className="admin-input" placeholder="noreply@example.de" />
          </div>
          <div>
            <label className="admin-label">Passwort</label>
            <input className="admin-input" type="password" placeholder="••••••••" />
          </div>
        </div>
        <div>
          <label className="admin-label">Absender-Adresse</label>
          <input className="admin-input" placeholder="noreply@ihre-domain.de" />
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">Mail-Versand wird in einem zukünftigen Update (M15) vollständig implementiert.</p>
        </div>
      </div>
    </div>
  );
}
