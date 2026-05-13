'use client';

import { toast } from 'sonner';

export function SeoForm() {
  return (
    <div className="admin-card p-6 space-y-5">
      <h2 className="font-semibold text-lg">SEO-Einstellungen</h2>
      <p className="text-sm text-zinc-500">
        SEO-Metadaten werden pro Seite im Seiten-Editor konfiguriert. Hier finden Sie globale Einstellungen.
      </p>
      <div className="space-y-4">
        <div>
          <label className="admin-label">Standard-Meta-Titel (Suffix)</label>
          <input className="admin-input" placeholder="z.B. | Müller & Söhne Meisterbetrieb" />
          <p className="text-xs text-zinc-400 mt-1">Wird an jeden Seitentitel angehängt: „Leistungen | Müller & Söhne"</p>
        </div>
        <div>
          <label className="admin-label">Standard-Meta-Beschreibung</label>
          <textarea className="admin-input min-h-[80px]" placeholder="Kurze Beschreibung Ihres Unternehmens für Suchmaschinen (max. 160 Zeichen)" />
        </div>
        <div>
          <label className="admin-label">Google Site Verification</label>
          <input className="admin-input" placeholder="google-site-verification=..." />
        </div>
      </div>
      <div className="flex justify-end pt-2">
        <button type="button" onClick={() => toast.info('SEO-Engine wird in M16 implementiert')} className="admin-btn-primary">
          Speichern
        </button>
      </div>
    </div>
  );
}
