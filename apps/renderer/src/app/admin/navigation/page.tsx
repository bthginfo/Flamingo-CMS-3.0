import { getNavigationSettings, getFooterSettings } from '../settings-actions';
import { NavigationForm } from './navigation-form';
import { FooterForm } from './footer-form';

export default async function NavigationPage() {
  const [nav, footerData] = await Promise.all([getNavigationSettings(), getFooterSettings()]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Navigation & Footer</h1>
      <p className="text-zinc-500 text-sm mb-8">Verwalten Sie die Hauptnavigation und den Footer Ihrer Website.</p>
      <div className="space-y-10">
        <NavigationForm initial={nav.items} initialCta={nav.cta} />
        <FooterForm initial={footerData} />
      </div>
    </div>
  );
}
