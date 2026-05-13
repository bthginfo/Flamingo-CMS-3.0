import { getBrandSettings } from '../settings-actions';
import { BrandForm } from './brand-form';

export default async function BrandPage() {
  const { brand } = await getBrandSettings();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Marke & Design</h1>
      <p className="text-zinc-500 text-sm mb-8">Firmenname, Slogan und Farbschema Ihrer Website.</p>
      <BrandForm initial={brand} />
    </div>
  );
}
