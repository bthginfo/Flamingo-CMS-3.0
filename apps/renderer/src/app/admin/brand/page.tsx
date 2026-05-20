import { getBrandSettings, getTenantInfo, getDesignSettings } from '../settings-actions';
import { BrandForm } from './brand-form';
import { StyleSwitcher } from './style-switcher';
import { BackgroundForm } from './background-form';

export default async function BrandPage() {
  const [{ brand }, tenantInfo, design] = await Promise.all([getBrandSettings(), getTenantInfo(), getDesignSettings()]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Marke & Design</h1>
      <p className="text-zinc-500 text-sm mb-8">Firmenname, Slogan, Farbschema und Stil Ihrer Website.</p>
      <StyleSwitcher industry={tenantInfo.industry} activeStyle={tenantInfo.activeStyle} />
      <BrandForm initial={brand} />
      <BackgroundForm initial={design} />
    </div>
  );
}
