import { ShopBackLink } from '../shop-back-link';
import { ImportClient } from './import-client';

export default function ImportPage() {
  return (
    <div>
      <ShopBackLink />
      <h1 className="text-2xl font-bold mb-1">Produkte importieren</h1>
      <p className="text-zinc-500 text-sm mb-6">Importiere Produkte und Kategorien per CSV-Datei.</p>
      <ImportClient />
    </div>
  );
}
