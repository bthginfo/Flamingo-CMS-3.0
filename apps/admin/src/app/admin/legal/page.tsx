export default function LegalPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Impressum & Datenschutz</h1>
      <p className="text-zinc-500 text-sm mb-8">Pflichtseiten verwalten – werden automatisch im Footer verlinkt.</p>
      <div className="admin-card p-6 space-y-5">
        <h2 className="font-semibold text-lg">Rechtliche Seiten</h2>
        <p className="text-sm text-zinc-500">
          Impressum und Datenschutzerklärung werden als reguläre Seiten im Seiten-Editor gepflegt.
          Stellen Sie sicher, dass die entsprechenden Seiten erstellt und im Footer verlinkt sind.
        </p>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-sm text-amber-800">
            <strong>Tipp:</strong> Erstellen Sie unter &quot;Seiten&quot; eine Seite mit dem Slug <code className="bg-amber-100 px-1 rounded">/impressum</code> und
            eine mit <code className="bg-amber-100 px-1 rounded">/datenschutz</code>. Diese werden automatisch im Footer verlinkt.
          </p>
        </div>
      </div>
    </div>
  );
}
