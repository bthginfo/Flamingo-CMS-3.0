'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { toast } from 'sonner';
import { useSaveState, useRegisterSave } from '@/components/save-context';
import { getLocalSeoAction, getSeoGlobalAction, saveLocalSeoAction, saveSeoGlobalAction } from './actions';

export function SeoForm() {
  const [pending, startTransition] = useTransition();
  const { markDirty, markSaved } = useSaveState();
  const mounted = useRef(0);
  const [data, setData] = useState({
    defaultTitle: '',
    titleTemplate: '',
    defaultDescription: '',
    defaultOgImage: '',
    canonicalBase: '',
    locale: 'de_DE',
    robots: 'index,follow',
  });
  const [localSeo, setLocalSeo] = useState({
    businessType: 'LocalBusiness',
    priceRange: '',
    serviceArea: '',
    googleBusinessUrl: '',
    sameAsText: '',
  });

  useEffect(() => {
    getSeoGlobalAction().then(row => {
      if (row) setData({
        defaultTitle: row.defaultTitle ?? '',
        titleTemplate: row.titleTemplate ?? '',
        defaultDescription: row.defaultDescription ?? '',
        defaultOgImage: row.defaultOgImage ?? '',
        canonicalBase: row.canonicalBase ?? '',
        locale: row.locale,
        robots: row.robots,
      });
    });
    getLocalSeoAction().then(row => {
      setLocalSeo({
        businessType: typeof row.businessType === 'string' && row.businessType ? row.businessType : 'LocalBusiness',
        priceRange: typeof row.priceRange === 'string' ? row.priceRange : '',
        serviceArea: typeof row.serviceArea === 'string' ? row.serviceArea : '',
        googleBusinessUrl: typeof row.googleBusinessUrl === 'string' ? row.googleBusinessUrl : '',
        sameAsText: Array.isArray(row.sameAs) ? row.sameAs.filter(Boolean).join('\n') : '',
      });
    });
  }, []);

  useEffect(() => { if (mounted.current >= 2) markDirty(); else mounted.current++; }, [data, localSeo]);

  function handleSave() {
    startTransition(async () => {
      await saveSeoGlobalAction(data);
      await saveLocalSeoAction(localSeo);
      toast.success('SEO-Einstellungen gespeichert');
      markSaved();
    });
  }
  useRegisterSave(handleSave);

  const field = (label: string, key: keyof typeof data, opts?: { placeholder?: string; hint?: string; maxLength?: number; multiline?: boolean }) => (
    <div>
      <label className="admin-label">{label}</label>
      {opts?.multiline ? (
        <textarea
          className="admin-input min-h-[80px]"
          value={data[key]}
          onChange={e => setData(d => ({ ...d, [key]: e.target.value }))}
          placeholder={opts.placeholder}
          maxLength={opts.maxLength}
        />
      ) : (
        <input
          className="admin-input"
          value={data[key]}
          onChange={e => setData(d => ({ ...d, [key]: e.target.value }))}
          placeholder={opts?.placeholder}
          maxLength={opts?.maxLength}
        />
      )}
      {opts?.hint && <p className="text-xs text-zinc-400 mt-1">{opts.hint}</p>}
      {opts?.maxLength && <p className="text-xs text-zinc-400 mt-0.5 text-right">{data[key].length}/{opts.maxLength}</p>}
    </div>
  );
  const localField = (label: string, key: keyof typeof localSeo, opts?: { placeholder?: string; hint?: string; multiline?: boolean }) => (
    <div>
      <label className="admin-label">{label}</label>
      {opts?.multiline ? (
        <textarea
          className="admin-input min-h-[84px]"
          value={localSeo[key]}
          onChange={e => setLocalSeo(d => ({ ...d, [key]: e.target.value }))}
          placeholder={opts.placeholder}
        />
      ) : (
        <input
          className="admin-input"
          value={localSeo[key]}
          onChange={e => setLocalSeo(d => ({ ...d, [key]: e.target.value }))}
          placeholder={opts?.placeholder}
        />
      )}
      {opts?.hint && <p className="text-xs text-zinc-400 mt-1">{opts.hint}</p>}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="admin-card p-5 bg-blue-50 border-blue-200 space-y-2">
        <h3 className="font-semibold text-sm text-blue-900">Wozu brauche ich das?</h3>
        <p className="text-sm text-blue-800">SEO (Suchmaschinenoptimierung) bestimmt, wie Ihre Website bei Google & Co. angezeigt wird. Titel und Beschreibung erscheinen direkt in den Suchergebnissen und beeinflussen, ob jemand auf Ihr Ergebnis klickt.</p>
        <details className="text-sm text-blue-800">
          <summary className="cursor-pointer font-medium hover:underline">Erklärung der Felder</summary>
          <ul className="list-disc list-inside mt-2 space-y-1 text-blue-700 text-xs">
            <li><strong>Standard-Titel:</strong> Wird als Browser-Tab-Titel und bei Google angezeigt (max. 70 Zeichen)</li>
            <li><strong>Titel-Template:</strong> Schema für Unterseiten, z.B. &quot;Leistungen | Müller &amp; Söhne&quot;</li>
            <li><strong>Standard-Beschreibung:</strong> Der kurze Text unter dem Titel bei Google (max. 170 Zeichen)</li>
            <li><strong>OG-Bild:</strong> Das Vorschaubild wenn Ihre Seite auf Social Media geteilt wird</li>
            <li><strong>Canonical-URL:</strong> Ihre Hauptdomain — hilft Google, Duplikate zu vermeiden</li>
            <li><strong>Robots:</strong> &quot;index,follow&quot; = bei Google sichtbar. &quot;noindex&quot; = versteckt (z.B. für Testseiten)</li>
          </ul>
        </details>
      </div>

      <div className="admin-card p-6 space-y-5">
        <h2 className="font-semibold text-lg">Globale SEO-Einstellungen</h2>
        <div className="space-y-4">
          {field('Standard-Titel', 'defaultTitle', { placeholder: 'Müller & Söhne Meisterbetrieb', maxLength: 70, hint: 'Wird verwendet wenn eine Seite keinen eigenen Titel hat.' })}
          {field('Titel-Template', 'titleTemplate', { placeholder: '%s | Müller & Söhne', hint: '%s wird durch den Seitentitel ersetzt.' })}
          {field('Standard-Beschreibung', 'defaultDescription', { placeholder: 'Ihr Experte für Heizung, Sanitär & Bäder...', maxLength: 170, multiline: true })}
          {field('Standard OG-Bild (URL)', 'defaultOgImage', { placeholder: 'https://...' })}
          {field('Canonical-Basis-URL', 'canonicalBase', { placeholder: 'https://www.mueller-soehne.de' })}
          {field('Locale', 'locale', { placeholder: 'de_DE' })}
          {field('Robots', 'robots', { placeholder: 'index,follow', hint: 'z.B. index,follow oder noindex,nofollow' })}
        </div>
      </div>

      <div className="admin-card p-6 space-y-5">
        <div>
          <h2 className="font-semibold text-lg">Local SEO</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Diese Angaben helfen Suchmaschinen, das Unternehmen lokal besser einzuordnen. Öffnungszeiten und Adresse pflegst du weiterhin unter Kontakt & Zeiten.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="admin-label">Schema.org-Typ</label>
            <select className="admin-input" value={localSeo.businessType} onChange={e => setLocalSeo(d => ({ ...d, businessType: e.target.value }))}>
              <option value="LocalBusiness">LocalBusiness</option>
              <option value="Restaurant">Restaurant</option>
              <option value="MedicalBusiness">MedicalBusiness</option>
              <option value="Store">Store</option>
              <option value="LodgingBusiness">LodgingBusiness</option>
              <option value="HealthAndBeautyBusiness">HealthAndBeautyBusiness</option>
              <option value="HomeAndConstructionBusiness">HomeAndConstructionBusiness</option>
              <option value="ProfessionalService">ProfessionalService</option>
              <option value="Florist">Florist</option>
              <option value="EventVenue">EventVenue</option>
              <option value="SportsActivityLocation">SportsActivityLocation</option>
            </select>
            <p className="text-xs text-zinc-400 mt-1">Wenn du unsicher bist: LocalBusiness ist ein sicherer Standard.</p>
          </div>
          {localField('Preisbereich', 'priceRange', { placeholder: 'z.B. €, €€, ab 80 € oder 10-25 €', hint: 'Optional. Wird als priceRange im LocalBusiness-Schema genutzt.' })}
          {localField('Einzugsgebiet', 'serviceArea', { placeholder: 'z.B. Innsbruck, München, Ingolstadt und Umgebung', hint: 'Optional. Relevant für lokale Dienstleistungen und regionale Sichtbarkeit.' })}
          {localField('Google-Business-Link', 'googleBusinessUrl', { placeholder: 'https://g.page/...' })}
          <div className="sm:col-span-2">
            {localField('Weitere Profile', 'sameAsText', { placeholder: 'https://www.instagram.com/...\nhttps://www.linkedin.com/company/...', hint: 'Eine URL pro Zeile. Wird als sameAs im strukturierten Datenmodell ausgegeben.', multiline: true })}
          </div>
        </div>
      </div>
    </div>
  );
}
