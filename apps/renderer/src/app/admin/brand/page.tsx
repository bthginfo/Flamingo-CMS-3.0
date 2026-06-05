import { getBrandSettings, getDesignSettings } from '../settings-actions';
import { BackgroundForm } from './background-form';
import { BrandForm } from './brand-form';
import { StyleSwitcher } from './style-switcher';

export default async function BrandPage() {
  const [{ brand }, design] = await Promise.all([getBrandSettings(), getDesignSettings()]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Marke & Design</h1>
      <p className="text-zinc-500 text-sm mb-8">Firmenname, Slogan, Farbschema, Schriften und globale Designwerte Ihrer Website.</p>
      <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50/80 p-4 text-sm text-blue-900">
        <p className="font-semibold">Globale Farben sind die Basis, einzelne Sektionen können gezielt abweichen.</p>
        <p className="mt-1 text-blue-800">
          Die Einstellungen hier steuern das grundsätzliche Erscheinungsbild der Website. Wenn eine bestimmte Sektion stärker hervorstechen soll, können Sie im Seiten-Editor direkt an der jeweiligen Sektion eigene Farben festlegen, etwa für Hintergrund, Überschriften, Buttons oder Akzente.
        </p>
      </div>
      <StyleSwitcher />
      <BrandForm initial={brand} />
      <BackgroundForm initial={design} />
    </div>
  );
}
