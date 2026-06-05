import { Check } from 'lucide-react';

export function StyleSwitcher() {
  return (
    <div className="admin-card p-6 mb-8">
      <h2 className="font-semibold text-lg mb-1">Website-Stil</h2>
      <p className="text-sm text-zinc-500 mb-5">
        Der Website-Stil ist auf Klassisch festgelegt. Farben, Schriften, Buttons, Abstände und einzelne Sections
        steuerst Du weiterhin über Marke & Design sowie über die Farbeinstellungen der jeweiligen Section.
      </p>
      <div className="relative rounded-xl border-2 border-blue-500 bg-blue-50/50 p-5 ring-2 ring-blue-500/20">
        <div className="absolute top-3 right-3 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
          <Check size={14} className="text-white" />
        </div>
        <div className="mb-3 flex gap-1.5">
          <div className="w-8 h-8 rounded-xl bg-zinc-200" />
          <div className="w-8 h-8 rounded-xl bg-zinc-300" />
          <div className="w-8 h-8 rounded-full bg-zinc-400" />
        </div>
        <div className="font-semibold text-sm">Klassisch</div>
        <div className="text-xs text-zinc-500 mt-1 leading-relaxed">
          Der robuste Standard für alle Templates: klare Typografie, konsistente Komponenten und volle Farbanpassung
          über das CMS.
        </div>
      </div>
    </div>
  );
}
