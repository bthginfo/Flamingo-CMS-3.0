'use client';

import { toast } from 'sonner';

export function ScriptsForm() {
  return (
    <div className="space-y-6">
      <div className="admin-card p-5 bg-blue-50 border-blue-200 space-y-2">
        <h3 className="font-semibold text-sm text-blue-900">Wozu brauche ich das?</h3>
        <p className="text-sm text-blue-800">Tracking-Tools wie Google Analytics oder der Facebook Pixel helfen Ihnen zu verstehen, wie Besucher auf Ihre Website kommen und was sie dort tun. Diese Daten helfen, Ihre Werbung zu optimieren.</p>
        <details className="text-sm text-blue-800">
          <summary className="cursor-pointer font-medium hover:underline">Anleitung: IDs finden und eintragen</summary>
          <div className="mt-2 space-y-3 text-blue-700">
            <div>
              <p className="font-medium">Google Analytics / Tag Manager:</p>
              <ol className="list-decimal list-inside space-y-0.5 text-xs">
                <li>Gehen Sie zu <strong>analytics.google.com</strong> oder <strong>tagmanager.google.com</strong></li>
                <li>Erstellen Sie ein Konto/Property für Ihre Website</li>
                <li>Kopieren Sie die Mess-ID (beginnt mit <code className="bg-blue-100 px-1 rounded">G-</code>) oder Container-ID (<code className="bg-blue-100 px-1 rounded">GTM-</code>)</li>
              </ol>
            </div>
            <div>
              <p className="font-medium">Facebook Pixel:</p>
              <ol className="list-decimal list-inside space-y-0.5 text-xs">
                <li>Öffnen Sie den <strong>Meta Events Manager</strong> (business.facebook.com)</li>
                <li>Erstellen Sie einen Pixel unter &quot;Datenquellen&quot;</li>
                <li>Kopieren Sie die 15-stellige Pixel-ID</li>
              </ol>
            </div>
          </div>
          <p className="mt-2 text-xs text-blue-600">Alle Scripts werden DSGVO-konform erst nach Cookie-Einwilligung geladen.</p>
        </details>
      </div>

      <div className="admin-card p-6 space-y-5">
        <h2 className="font-semibold text-lg">Tracking & Analytics</h2>
        <p className="text-sm text-zinc-500">
          Fügen Sie Tracking-Codes hinzu. Diese werden erst nach Cookie-Consent geladen (DSGVO-konform).
        </p>
        <div className="space-y-4">
          <div>
            <label className="admin-label">Google Analytics / Tag Manager ID</label>
            <input className="admin-input" placeholder="G-XXXXXXXXXX oder GTM-XXXXXXX" />
            <p className="text-xs text-zinc-400 mt-1">Ihre Google Mess-ID oder Tag Manager Container-ID</p>
          </div>
          <div>
            <label className="admin-label">Facebook Pixel ID</label>
            <input className="admin-input" placeholder="123456789012345" />
            <p className="text-xs text-zinc-400 mt-1">15-stellige Pixel-ID aus dem Meta Events Manager</p>
          </div>
          <div>
            <label className="admin-label">Benutzerdefiniertes Head-Script</label>
            <textarea className="admin-input min-h-[100px] font-mono text-xs" placeholder="<script>...</script>" />
            <p className="text-xs text-zinc-400 mt-1">Wird im &lt;head&gt; eingefügt (nur nach Consent). Für Fortgeschrittene — z.B. Chat-Widgets oder andere Drittanbieter-Tools.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
