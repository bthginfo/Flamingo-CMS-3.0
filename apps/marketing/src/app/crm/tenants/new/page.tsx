'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createTenantAction } from '../actions';
import { toast } from 'sonner';
import { ArrowLeft, Rocket, Server, Cloud } from 'lucide-react';
import Link from 'next/link';

const INDUSTRIES = [
  { value: 'tradesman', label: 'Handwerk' },
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'salon', label: 'Salon' },
  { value: 'hotel', label: 'Hotel' },
  { value: 'tourism', label: 'Tourismus' },
  { value: 'consulting', label: 'Beratung' },
  { value: 'medical', label: 'Medizin / Praxis' },
  { value: 'fitness', label: 'Fitness' },
  { value: 'wedding', label: 'Hochzeit' },
  { value: 'cafe', label: 'Café' },
  { value: 'bar', label: 'Bar' },
  { value: 'photography', label: 'Fotografie' },
  { value: 'realestate', label: 'Immobilien' },
  { value: 'tattoo', label: 'Tattoo Studio' },
] as const;

export default function NewTenantPage() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState({
    name: '',
    slug: '',
    industry: 'tradesman' as string,
    domain: '',
    password: '',
    companyName: '',
    tagline: '',
    primaryColor: '#1a5276',
    secondaryColor: '#2e86c1',
    accentColor: '#f39c12',
    phone: '',
    email: '',
    address: '',
    deploymentMode: 'shared' as 'shared' | 'standalone',
  });

  function autoSlug(name: string) {
    return name
      .toLowerCase()
      .replace(/[äÄ]/g, 'ae').replace(/[öÖ]/g, 'oe').replace(/[üÜ]/g, 'ue').replace(/ß/g, 'ss')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  function handleNameChange(name: string) {
    setForm(f => ({ ...f, name, slug: autoSlug(name), companyName: f.companyName || name }));
  }

  function handleSubmit() {
    if (!form.name || !form.slug || !form.password) {
      toast.error('Name, Slug und Passwort sind erforderlich');
      return;
    }
    startTransition(async () => {
      const result = await createTenantAction({
        ...form,
        industry: form.industry as any,
        domain: form.domain || undefined,
        deploymentMode: form.deploymentMode,
      });
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      if (result.warning) toast.warning(result.warning, { duration: 10000 });
      toast.success(`Tenant "${form.name}" wurde erstellt! Erreichbar unter: ${result.rendererUrl}`);
      router.push(`/crm/tenants/${result.tenantId}`);
    });
  }

  return (
    <div className="max-w-2xl">
      <Link href="/crm/tenants" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 mb-6 transition-colors">
        <ArrowLeft size={14} /> Zurück zu Tenants
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
          <Rocket size={20} className="text-indigo-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Neuer Tenant</h1>
          <p className="text-sm text-slate-500">Tenant anlegen und automatisch provisionieren</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Basic info */}
        <div className="crm-card p-5 space-y-4">
          <h2 className="font-semibold text-slate-900 text-sm uppercase tracking-wide text-slate-500">Grunddaten</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="crm-label">Firmenname *</label>
              <input className="crm-input" value={form.name} onChange={e => handleNameChange(e.target.value)} placeholder="Müller & Söhne GmbH" />
            </div>
            <div>
              <label className="crm-label">Slug *</label>
              <input className="crm-input font-mono" value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="mueller-soehne" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="crm-label">Branche *</label>
              <select className="crm-select" value={form.industry} onChange={e => setForm(f => ({ ...f, industry: e.target.value }))}>
                {INDUSTRIES.map(i => <option key={i.value} value={i.value}>{i.label}</option>)}
              </select>
            </div>
            <div>
              <label className="crm-label">Admin-Passwort *</label>
              <input type="password" className="crm-input" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Sicheres Passwort" />
            </div>
          </div>
        </div>

        {/* Brand */}
        <div className="crm-card p-5 space-y-4">
          <h2 className="font-semibold text-sm uppercase tracking-wide text-slate-500">Marke & Design</h2>
          <div>
            <label className="crm-label">Anzeigename</label>
            <input className="crm-input" value={form.companyName} onChange={e => setForm(f => ({ ...f, companyName: e.target.value }))} />
          </div>
          <div>
            <label className="crm-label">Tagline</label>
            <input className="crm-input" value={form.tagline} onChange={e => setForm(f => ({ ...f, tagline: e.target.value }))} placeholder="Ihr Experte für..." />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="crm-label">Primärfarbe</label>
              <div className="flex items-center gap-2">
                <input type="color" value={form.primaryColor} onChange={e => setForm(f => ({ ...f, primaryColor: e.target.value }))} className="w-8 h-8 rounded border cursor-pointer" />
                <input className="crm-input font-mono text-xs" value={form.primaryColor} onChange={e => setForm(f => ({ ...f, primaryColor: e.target.value }))} />
              </div>
            </div>
            <div>
              <label className="crm-label">Sekundärfarbe</label>
              <div className="flex items-center gap-2">
                <input type="color" value={form.secondaryColor} onChange={e => setForm(f => ({ ...f, secondaryColor: e.target.value }))} className="w-8 h-8 rounded border cursor-pointer" />
                <input className="crm-input font-mono text-xs" value={form.secondaryColor} onChange={e => setForm(f => ({ ...f, secondaryColor: e.target.value }))} />
              </div>
            </div>
            <div>
              <label className="crm-label">Akzentfarbe</label>
              <div className="flex items-center gap-2">
                <input type="color" value={form.accentColor} onChange={e => setForm(f => ({ ...f, accentColor: e.target.value }))} className="w-8 h-8 rounded border cursor-pointer" />
                <input className="crm-input font-mono text-xs" value={form.accentColor} onChange={e => setForm(f => ({ ...f, accentColor: e.target.value }))} />
              </div>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="crm-card p-5 space-y-4">
          <h2 className="font-semibold text-sm uppercase tracking-wide text-slate-500">Kontakt</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="crm-label">Telefon</label>
              <input className="crm-input" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="0221 / 98 76 54 0" />
            </div>
            <div>
              <label className="crm-label">E-Mail</label>
              <input type="email" className="crm-input" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="info@firma.de" />
            </div>
          </div>
          <div>
            <label className="crm-label">Adresse</label>
            <input className="crm-input" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="Musterstraße 1, 50667 Köln" />
          </div>
        </div>

        {/* Domain */}
        <div className="crm-card p-5 space-y-4">
          <h2 className="font-semibold text-sm uppercase tracking-wide text-slate-500">Domain (optional)</h2>
          <div>
            <label className="crm-label">Custom Domain</label>
            <input className="crm-input" value={form.domain} onChange={e => setForm(f => ({ ...f, domain: e.target.value }))} placeholder="www.firma.de" />
            <p className="text-xs text-slate-400 mt-1">Wird automatisch zum Vercel-Projekt hinzugefügt. DNS-Eintrag muss manuell gesetzt werden.</p>
          </div>
        </div>

        {/* Deployment Mode */}
        <div className="crm-card p-5 space-y-4">
          <h2 className="font-semibold text-sm uppercase tracking-wide text-slate-500">Deployment</h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setForm(f => ({ ...f, deploymentMode: 'shared' }))}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                form.deploymentMode === 'shared'
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <Server size={20} className={form.deploymentMode === 'shared' ? 'text-indigo-600' : 'text-slate-400'} />
              <p className="font-semibold mt-2 text-sm">Shared Renderer</p>
              <p className="text-xs text-slate-500 mt-1">Läuft auf dem gemeinsamen Renderer-Projekt. Ideal für Demos und kleine Kunden.</p>
            </button>
            <button
              type="button"
              onClick={() => setForm(f => ({ ...f, deploymentMode: 'standalone' }))}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                form.deploymentMode === 'standalone'
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <Cloud size={20} className={form.deploymentMode === 'standalone' ? 'text-indigo-600' : 'text-slate-400'} />
              <p className="font-semibold mt-2 text-sm">Standalone Projekt</p>
              <p className="text-xs text-slate-500 mt-1">Eigenes Vercel-Projekt mit dedizierter Infrastruktur. Für produktive Kunden.</p>
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={pending}
          className="w-full crm-btn-primary py-3 text-base"
        >
          <Rocket size={18} />
          {pending ? 'Wird erstellt…' : 'Tenant erstellen & provisionieren'}
        </button>
      </div>
    </div>
  );
}
