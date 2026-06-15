'use client';

import { toast } from 'sonner';

function Field({ label, value: init }: { label: string; value: string }) {
  return (
    <label className="block text-sm">
      <span className="text-zinc-500 text-xs font-medium">{label}</span>
      <input defaultValue={init} className="admin-input mt-1 w-full" />
    </label>
  );
}

function ColorField({ label, value: init }: { label: string; value: string }) {
  return (
    <label className="block text-sm">
      <span className="text-zinc-500 text-xs font-medium">{label}</span>
      <div className="flex gap-2 mt-1">
        <input type="color" defaultValue={init} className="w-10 h-10 rounded-lg border border-zinc-200 cursor-pointer" />
        <input defaultValue={init} className="admin-input flex-1" />
      </div>
    </label>
  );
}

export default function DemoBrandPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Marke & Design</h1>
      <p className="text-zinc-500 text-sm mb-8">Firmenname, Slogan, Farben und Schriften Ihrer Website.</p>

      <div className="admin-card p-6 space-y-4 mb-6">
        <h2 className="font-semibold mb-2">Firmeninformationen</h2>
        <Field label="Firmenname" value="Müller & Söhne Meisterbetrieb" />
        <Field label="Tagline / Slogan" value="Ihr Partner für Sanitär, Heizung und Bäder" />
        <div>
          <span className="text-zinc-500 text-xs font-medium">Logo</span>
          <div className="mt-1 border border-dashed border-zinc-300 rounded-xl p-6 text-center text-sm text-zinc-400">
            Logo hochladen (SVG, PNG)
          </div>
        </div>
      </div>

      <div className="admin-card p-6 space-y-4">
        <h2 className="font-semibold mb-2">Farben</h2>
        <div className="grid grid-cols-2 gap-4">
          <ColorField label="Primärfarbe" value="#2563eb" />
          <ColorField label="Akzentfarbe" value="#f59e0b" />
        </div>
      </div>

      <div className="admin-card p-6 space-y-4 mt-6">
        <h2 className="font-semibold mb-2">Schriften</h2>
        <p className="text-xs text-zinc-500">Wählen Sie Google Fonts für Überschriften und Fließtext.</p>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Überschriften-Schrift" value="" />
          <Field label="Fließtext-Schrift" value="" />
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button className="admin-btn-primary" onClick={() => toast.success('Demo-Modus: Änderungen werden nicht gespeichert')}>Speichern</button>
      </div>
    </div>
  );
}
