'use client';

import { toast } from 'sonner';

export function ScriptsForm() {
  return (
    <div className="admin-card p-6 space-y-5">
      <h2 className="font-semibold text-lg">Tracking & Analytics</h2>
      <p className="text-sm text-zinc-500">
        Fügen Sie Tracking-Codes hinzu. Diese werden erst nach Cookie-Consent geladen (DSGVO-konform).
      </p>
      <div className="space-y-4">
        <div>
          <label className="admin-label">Google Analytics / Tag Manager ID</label>
          <input className="admin-input" placeholder="G-XXXXXXXXXX oder GTM-XXXXXXX" />
        </div>
        <div>
          <label className="admin-label">Facebook Pixel ID</label>
          <input className="admin-input" placeholder="123456789012345" />
        </div>
        <div>
          <label className="admin-label">Benutzerdefiniertes Head-Script</label>
          <textarea className="admin-input min-h-[100px] font-mono text-xs" placeholder="<script>...</script>" />
          <p className="text-xs text-zinc-400 mt-1">Wird im &lt;head&gt; eingefügt (nur nach Consent).</p>
        </div>
      </div>
    </div>
  );
}
