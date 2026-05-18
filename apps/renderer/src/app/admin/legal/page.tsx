import Link from 'next/link';
import { Scale, FileText, ArrowRight } from 'lucide-react';

export default function LegalPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Impressum & Datenschutz</h1>
      <p className="text-zinc-500 text-sm mb-8">Pflichtseiten verwalten — werden automatisch im Footer verlinkt.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        <div className="admin-card p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
              <Scale size={20} className="text-blue-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Impressum</h3>
              <p className="text-sm text-zinc-500 mb-4">Gesetzlich vorgeschriebene Angaben zum Betreiber der Website.</p>
              <Link href="/admin/pages" className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium">
                Zur Seite &quot;Impressum&quot; <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        <div className="admin-card p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
              <FileText size={20} className="text-purple-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Datenschutz</h3>
              <p className="text-sm text-zinc-500 mb-4">Datenschutzerklärung gemäß DSGVO.</p>
              <Link href="/admin/pages" className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium">
                Zur Seite &quot;Datenschutz&quot; <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-card p-6">
        <h2 className="font-semibold mb-3">So funktioniert&apos;s</h2>
        <ol className="space-y-3 text-sm text-zinc-600">
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0">1</span>
            <span>Erstellen Sie unter <strong>Seiten</strong> zwei neue Seiten mit den Slugs <code className="bg-zinc-100 px-1.5 py-0.5 rounded text-xs">impressum</code> und <code className="bg-zinc-100 px-1.5 py-0.5 rounded text-xs">datenschutz</code>.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0">2</span>
            <span>Fügen Sie eine <strong>Rechtliche Inhalte</strong> Sektion hinzu (Typ: &quot;Rechtliche Inhalte&quot;). Tragen Sie eine Hauptüberschrift ein und fügen Sie je Thema einen Block mit Überschrift + Text hinzu.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0">3</span>
            <span>Die Seiten werden automatisch im Footer unter &quot;Impressum&quot; und &quot;Datenschutz&quot; verlinkt.</span>
          </li>
        </ol>
      </div>
    </div>
  );
}
