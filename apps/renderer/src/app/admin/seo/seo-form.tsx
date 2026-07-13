'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useSaveState, useRegisterSave } from '@/components/save-context';
import { StringListField } from '@/components/string-list-field';
import { serializeStringList } from '@/lib/string-list';
import { getLocalSeoAction, getSeoGlobalAction, saveLocalSeoAction, saveSeoGlobalAction } from './actions';

type SeoServiceDraft = { name: string; description: string; url: string };
type LocalSeoState = {
  businessType: string;
  priceRange: string;
  serviceArea: string;
  googleBusinessUrl: string;
  sameAs: string[];
  latitude: string;
  longitude: string;
  ratingValue: string;
  ratingCount: string;
  services: SeoServiceDraft[];
};
type LocalSeoScalarKey = Exclude<keyof LocalSeoState, 'sameAs' | 'services'>;

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
  const [localSeo, setLocalSeo] = useState<LocalSeoState>({
    businessType: 'LocalBusiness',
    priceRange: '',
    serviceArea: '',
    googleBusinessUrl: '',
    sameAs: [],
    latitude: '',
    longitude: '',
    ratingValue: '',
    ratingCount: '',
    services: [],
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
        sameAs: Array.isArray(row.sameAs) ? row.sameAs.filter((value): value is string => typeof value === 'string' && Boolean(value.trim())) : [],
        latitude: typeof row.latitude === 'number' ? String(row.latitude) : '',
        longitude: typeof row.longitude === 'number' ? String(row.longitude) : '',
        ratingValue: typeof row.ratingValue === 'number' ? String(row.ratingValue) : '',
        ratingCount: typeof row.ratingCount === 'number' ? String(row.ratingCount) : '',
        services: Array.isArray(row.services)
          ? (row.services as Record<string, unknown>[])
              .filter(s => s && typeof s.name === 'string')
              .map(s => ({
                name: typeof s.name === 'string' ? s.name : '',
                description: typeof s.description === 'string' ? s.description : '',
                url: typeof s.url === 'string' ? s.url : '',
              }))
          : [],
      });
    });
  }, []);

  useEffect(() => { if (mounted.current >= 2) markDirty(); else mounted.current++; }, [data, localSeo]);

  function handleSave() {
    startTransition(async () => {
      await saveSeoGlobalAction(data);
      await saveLocalSeoAction({
        businessType: localSeo.businessType,
        priceRange: localSeo.priceRange,
        serviceArea: localSeo.serviceArea,
        googleBusinessUrl: localSeo.googleBusinessUrl,
        sameAsText: serializeStringList(localSeo.sameAs),
        latitude: localSeo.latitude,
        longitude: localSeo.longitude,
        ratingValue: localSeo.ratingValue,
        ratingCount: localSeo.ratingCount,
        servicesText: localSeo.services.map(service => [service.name, service.description, service.url].map(value => value.replace(/[|\r\n]/g, ' ').trim()).join(' | ')).join('\n'),
      });
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
  const localField = (label: string, key: LocalSeoScalarKey, opts?: { placeholder?: string; hint?: string; multiline?: boolean }) => (
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
            <StringListField label="Weitere Profile" value={localSeo.sameAs} onChange={(sameAs) => setLocalSeo(d => ({ ...d, sameAs }))} placeholder="https://www.instagram.com/..." addLabel="Profil hinzufügen" emptyText="Noch keine weiteren Profile hinzugefügt." />
            <p className="mt-1 text-xs text-zinc-400">Verknüpft offizielle Unternehmensprofile mit den Suchmaschinen-Angaben.</p>
          </div>
          {localField('Breitengrad (Latitude)', 'latitude', { placeholder: 'z.B. 48.7758', hint: 'Optional. Genaue Position für Karten & KI-Assistenten. In Google Maps per Rechtsklick auf den Standort.' })}
          {localField('Längengrad (Longitude)', 'longitude', { placeholder: 'z.B. 9.1829', hint: 'Wird zusammen mit dem Breitengrad als geo-Koordinate ausgegeben.' })}
          {localField('Bewertung (Ø)', 'ratingValue', { placeholder: 'z.B. 4.8', hint: 'Optional. Durchschnittliche Bewertung von 0–5. Nur echte Werte verwenden.' })}
          {localField('Anzahl Bewertungen', 'ratingCount', { placeholder: 'z.B. 127', hint: 'Anzahl der Bewertungen. Wird zusammen mit dem Durchschnitt als aggregateRating ausgegeben.' })}
          <div className="sm:col-span-2">
            <SeoServicesField value={localSeo.services} onChange={(services) => setLocalSeo(d => ({ ...d, services }))} />
          </div>
        </div>
      </div>
    </div>
  );
}

function SeoServicesField({ value, onChange }: { value: SeoServiceDraft[]; onChange: (value: SeoServiceDraft[]) => void }) {
  function update(index: number, patch: Partial<SeoServiceDraft>) {
    onChange(value.map((service, serviceIndex) => serviceIndex === index ? { ...service, ...patch } : service));
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= value.length) return;
    const next = [...value];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <fieldset className="rounded-xl border border-zinc-200 bg-zinc-50/60 p-3">
      <legend className="px-1 text-xs font-semibold text-zinc-700">Leistungen / Angebote</legend>
      <p className="mb-3 px-1 text-xs text-zinc-400">Hilft Suchmaschinen und KI-Assistenten, dein Angebot eindeutig zu verstehen.</p>
      {value.length === 0 ? <p className="px-1 py-2 text-xs text-zinc-400">Noch keine Leistungen hinzugefügt.</p> : (
        <div className="space-y-3">
          {value.map((service, index) => (
            <div key={index} className="rounded-xl border border-zinc-200 bg-white p-3">
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="text-xs font-semibold text-zinc-500">Leistung {index + 1}</span>
                <div className="flex items-center gap-1">
                  <button type="button" onClick={() => move(index, -1)} disabled={index === 0} className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-25" aria-label={`Leistung ${index + 1} nach oben`}><ArrowUp size={14} /></button>
                  <button type="button" onClick={() => move(index, 1)} disabled={index === value.length - 1} className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-25" aria-label={`Leistung ${index + 1} nach unten`}><ArrowDown size={14} /></button>
                  <button type="button" onClick={() => onChange(value.filter((_, serviceIndex) => serviceIndex !== index))} className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-md text-red-400 hover:bg-red-50 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2" aria-label={`Leistung ${index + 1} entfernen`}><Trash2 size={14} /></button>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="sm:col-span-2"><span className="admin-label">Name</span><input className="admin-input" value={service.name} onChange={(event) => update(index, { name: event.target.value })} placeholder="z. B. Persönliche Erstberatung" /></label>
                <label><span className="admin-label">Kurzbeschreibung optional</span><input className="admin-input" value={service.description} onChange={(event) => update(index, { description: event.target.value })} placeholder="Was umfasst die Leistung?" /></label>
                <label><span className="admin-label">Link optional</span><input className="admin-input" value={service.url} onChange={(event) => update(index, { url: event.target.value })} placeholder="https://..." /></label>
              </div>
            </div>
          ))}
        </div>
      )}
      <button type="button" onClick={() => onChange([...value, { name: '', description: '', url: '' }])} className="mt-3 inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 text-xs font-semibold text-blue-700 hover:border-blue-200 hover:bg-blue-50">
        <Plus size={14} /> Leistung hinzufügen
      </button>
    </fieldset>
  );
}
