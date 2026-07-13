'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { CheckCircle2, ChevronRight, CircleHelp, Plus, Save, ShieldCheck, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { SiteProfile } from '@/lib/content-quality';
import { businessProfileFingerprint, getBusinessProfileCompleteness, isBusinessProfileDirty } from '@/lib/business-profile';
import { useRegisterSave, useSaveState } from '@/components/save-context';
import { saveBusinessProfileAction } from './actions';

type StringListProps = {
  id: string;
  label: string;
  values: string[];
  placeholder: string;
  help?: string;
  onChange: (values: string[]) => void;
};

function StringList({ id, label, values, placeholder, help, onChange }: StringListProps) {
  return (
    <fieldset className="space-y-2">
      <legend className="admin-label">{label}</legend>
      {help && <p className="text-xs leading-5 text-zinc-500">{help}</p>}
      {values.map((value, index) => (
        <div key={`${id}-${index}`} className="flex items-center gap-2">
          <input
            id={`${id}-${index}`}
            className="admin-input min-h-11"
            aria-label={`${label} ${index + 1}`}
            value={value}
            onChange={event => onChange(values.map((entry, entryIndex) => entryIndex === index ? event.target.value : entry))}
            placeholder={placeholder}
          />
          <button type="button" onClick={() => onChange(values.filter((_, entryIndex) => entryIndex !== index))} className="min-h-11 min-w-11 rounded-lg border border-zinc-200 text-zinc-500 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" aria-label={`${label} ${index + 1} entfernen`}>
            <Trash2 size={16} className="mx-auto" />
          </button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...values, ''])} className="admin-btn-secondary min-h-10">
        <Plus size={16} /> Eintrag hinzufügen
      </button>
    </fieldset>
  );
}

function ProfileGroup({ title, description, children, open = false }: { title: string; description: string; children: React.ReactNode; open?: boolean }) {
  return (
    <details open={open} className="group admin-card overflow-hidden">
      <summary className="flex min-h-16 cursor-pointer list-none items-center gap-4 px-5 py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500 [&::-webkit-details-marker]:hidden">
        <div className="min-w-0 flex-1"><h2 className="font-semibold text-zinc-950">{title}</h2><p className="mt-0.5 text-xs leading-5 text-zinc-500">{description}</p></div>
        <ChevronRight size={18} className="shrink-0 text-zinc-400 transition-transform group-open:rotate-90" />
      </summary>
      <div className="space-y-5 border-t border-zinc-100 px-5 py-5">{children}</div>
    </details>
  );
}

export function BusinessProfileForm({ initialProfile, initialPersisted }: { initialProfile: SiteProfile; initialPersisted: boolean }) {
  const [profile, setProfile] = useState(initialProfile);
  const [persisted, setPersisted] = useState(initialPersisted);
  const [saving, setSaving] = useState(false);
  const mounted = useRef(false);
  const savedBaseline = useRef(businessProfileFingerprint(initialProfile));
  const { markDirty, markSaved } = useSaveState();
  const completeness = useMemo(() => getBusinessProfileCompleteness(profile), [profile]);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (isBusinessProfileDirty(profile, savedBaseline.current)) markDirty();
    else markSaved();
  }, [profile, markDirty, markSaved]);

  const save = async () => {
    setSaving(true);
    try {
      const result = await saveBusinessProfileAction(profile);
      if (!result.success) {
        toast.error('Profil konnte nicht gespeichert werden', { description: result.error });
        return;
      }
      savedBaseline.current = businessProfileFingerprint(result.profile);
      setProfile(result.profile);
      setPersisted(true);
      markSaved();
      toast.success('Unternehmensprofil gespeichert');
    } catch {
      toast.error('Profil konnte nicht gespeichert werden');
    } finally {
      setSaving(false);
    }
  };
  useRegisterSave(save);

  const inputClass = 'admin-input min-h-11';
  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
      <form onSubmit={event => { event.preventDefault(); void save(); }} className="space-y-4">
        <ProfileGroup title="Identität & Einsatzgebiet" description="Öffentlicher Name, Standorte und Regionen, in denen Sie wirklich arbeiten." open>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label htmlFor="business-name" className="admin-label">Öffentlicher Unternehmensname</label><input id="business-name" className={inputClass} value={profile.identity.businessName} onChange={event => setProfile(current => ({ ...current, identity: { ...current.identity, businessName: event.target.value } }))} /></div>
            <div><label htmlFor="legal-name" className="admin-label">Rechtlicher Name <span className="font-normal text-zinc-400">optional</span></label><input id="legal-name" className={inputClass} value={profile.identity.legalName || ''} onChange={event => setProfile(current => ({ ...current, identity: { ...current.identity, legalName: event.target.value || undefined } }))} /></div>
          </div>
          <fieldset className="space-y-3">
            <legend className="admin-label">Standorte</legend>
            {profile.identity.locations.map((location, index) => (
              <div key={`location-${index}`} className="grid gap-3 rounded-xl border border-zinc-200 bg-zinc-50/60 p-4 sm:grid-cols-2">
                {(['city', 'region', 'country', 'address'] as const).map(key => (
                  <div key={key} className={key === 'address' ? 'sm:col-span-2' : ''}>
                    <label htmlFor={`location-${index}-${key}`} className="admin-label">{{ city: 'Stadt', region: 'Region', country: 'Land', address: 'Vollständige Adresse' }[key]}</label>
                    <input id={`location-${index}-${key}`} className={inputClass} value={location[key] || ''} onChange={event => setProfile(current => ({ ...current, identity: { ...current.identity, locations: current.identity.locations.map((entry, entryIndex) => entryIndex === index ? { ...entry, [key]: event.target.value || undefined } : entry) } }))} />
                  </div>
                ))}
                <button type="button" onClick={() => setProfile(current => ({ ...current, identity: { ...current.identity, locations: current.identity.locations.filter((_, entryIndex) => entryIndex !== index) } }))} className="admin-btn-ghost justify-self-start text-red-600"><Trash2 size={16} /> Standort entfernen</button>
              </div>
            ))}
            <button type="button" onClick={() => setProfile(current => ({ ...current, identity: { ...current.identity, locations: [...current.identity.locations, { city: '' }] } }))} className="admin-btn-secondary"><Plus size={16} /> Standort hinzufügen</button>
          </fieldset>
          <StringList id="service-areas" label="Weitere Einsatzgebiete" values={profile.identity.serviceAreas || []} placeholder="z. B. Region Ingolstadt" onChange={serviceAreas => setProfile(current => ({ ...current, identity: { ...current.identity, serviceAreas } }))} />
        </ProfileGroup>

        <ProfileGroup title="Zielgruppe" description="Für wen das Angebot gedacht ist, was diese Menschen brauchen und was sie zögern lässt.">
          <div><label htmlFor="audience-primary" className="admin-label">Primäre Zielgruppe</label><textarea id="audience-primary" className="admin-input min-h-24 resize-y" value={profile.audience.primary} onChange={event => setProfile(current => ({ ...current, audience: { ...current.audience, primary: event.target.value } }))} placeholder="z. B. Eigentümer von Altbauten, die Planungssicherheit suchen" /></div>
          <div className="grid gap-5 md:grid-cols-2">
            <StringList id="needs" label="Bedürfnisse" values={profile.audience.needs} placeholder="Was muss gelöst werden?" onChange={needs => setProfile(current => ({ ...current, audience: { ...current.audience, needs } }))} />
            <StringList id="objections" label="Einwände" values={profile.audience.objections} placeholder="Was hält vom Kauf ab?" onChange={objections => setProfile(current => ({ ...current, audience: { ...current.audience, objections } }))} />
          </div>
        </ProfileGroup>

        <ProfileGroup title="Ziele & Conversions" description="Welche Hauptaufgabe die Website hat und welche konkreten Handlungen zählen.">
          <div><label htmlFor="primary-goal" className="admin-label">Primäres Website-Ziel</label><input id="primary-goal" className={inputClass} value={profile.goals.primary} onChange={event => setProfile(current => ({ ...current, goals: { ...current.goals, primary: event.target.value } }))} placeholder="z. B. Qualifizierte Beratungstermine" /></div>
          <StringList id="conversions" label="Gewünschte Handlungen" values={profile.goals.conversions} placeholder="z. B. Termin anfragen" onChange={conversions => setProfile(current => ({ ...current, goals: { ...current.goals, conversions } }))} />
        </ProfileGroup>

        <ProfileGroup title="Angebote" description="Leistung, Kundenergebnis, belegbarer Nachweis und der passende nächste Schritt.">
          {profile.offers.map((offer, index) => (
            <div key={`offer-${index}`} className="grid gap-4 rounded-xl border border-zinc-200 bg-zinc-50/60 p-4 sm:grid-cols-2">
              {([
                ['name', 'Angebot', 'z. B. Badmodernisierung'], ['outcome', 'Kundenergebnis', 'Was ist danach besser?'],
                ['proof', 'Beleg (optional)', 'Nur verifizierbare Nachweise'], ['ctaLabel', 'Button-Text', 'z. B. Projekt besprechen'],
                ['ctaHref', 'Button-Ziel', 'z. B. /kontakt'],
              ] as const).map(([key, label, placeholder]) => (
                <div key={key} className={key === 'outcome' || key === 'proof' ? 'sm:col-span-2' : ''}>
                  <label htmlFor={`offer-${index}-${key}`} className="admin-label">{label}</label>
                  <input id={`offer-${index}-${key}`} className={inputClass} placeholder={placeholder} value={offer[key] || ''} onChange={event => setProfile(current => ({ ...current, offers: current.offers.map((entry, entryIndex) => entryIndex === index ? { ...entry, [key]: event.target.value || undefined } : entry) }))} />
                </div>
              ))}
              <button type="button" onClick={() => setProfile(current => ({ ...current, offers: current.offers.filter((_, entryIndex) => entryIndex !== index) }))} className="admin-btn-ghost justify-self-start text-red-600 sm:col-span-2"><Trash2 size={16} /> Angebot entfernen</button>
            </div>
          ))}
          <button type="button" onClick={() => setProfile(current => ({ ...current, offers: [...current.offers, { name: '', outcome: '', ctaLabel: '', ctaHref: '' }] }))} className="admin-btn-secondary"><Plus size={16} /> Angebot hinzufügen</button>
        </ProfileGroup>

        <ProfileGroup title="Sprache & Ton" description="Wie die Marke klingt – und welche Formulierungen nicht zu ihr gehören.">
          <div className="grid gap-5 md:grid-cols-2">
            <StringList id="voice" label="Tonalitätsmerkmale" values={profile.voice.attributes} placeholder="z. B. ruhig, präzise" onChange={attributes => setProfile(current => ({ ...current, voice: { ...current.voice, attributes } }))} />
            <StringList id="voice-avoid" label="Vermeiden" values={profile.voice.avoid} placeholder="z. B. aggressive Superlative" onChange={avoid => setProfile(current => ({ ...current, voice: { ...current.voice, avoid } }))} />
          </div>
        </ProfileGroup>

        <ProfileGroup title="Faktenkontrolle" description="Die Schutzschicht gegen erfundene Aussagen. Unbekannt bedeutet: erst prüfen, dann verwenden.">
          <StringList id="approved" label="Bestätigte Aussagen" values={profile.facts.approvedClaims} placeholder="Nur nachweisbare Aussage" help="Diese Fakten dürfen in Website, SEO und KI-Texten verwendet werden." onChange={approvedClaims => setProfile(current => ({ ...current, facts: { ...current.facts, approvedClaims } }))} />
          <StringList id="prohibited" label="Verbotene Aussagen" values={profile.facts.prohibitedClaims} placeholder="Darf niemals behauptet werden" onChange={prohibitedClaims => setProfile(current => ({ ...current, facts: { ...current.facts, prohibitedClaims } }))} />
          <StringList id="unknowns" label="Noch unbekannt / zu prüfen" values={profile.facts.unknowns} placeholder="Offene Frage oder fehlender Nachweis" help="Ein Eintrag hier wird nicht automatisch als bestätigte Aussage verwendet." onChange={unknowns => setProfile(current => ({ ...current, facts: { ...current.facts, unknowns } }))} />
        </ProfileGroup>

        <button type="submit" disabled={saving} className="admin-btn-primary min-h-11 px-5"><Save size={16} /> {saving ? 'Speichert…' : 'Profil speichern'}</button>
      </form>

      <aside className="order-first space-y-4 lg:order-none lg:sticky lg:top-6">
        <div className="admin-card p-5">
          <div className="flex items-center justify-between gap-3"><span className="text-sm font-semibold text-zinc-950">Vollständigkeit</span><span className="text-2xl font-bold text-zinc-950">{completeness.score}%</span></div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-100" aria-label={`Profil zu ${completeness.score} Prozent vollständig`}><div className="h-full rounded-full bg-blue-600 transition-[width]" style={{ width: `${completeness.score}%` }} /></div>
          <p className="mt-3 text-xs leading-5 text-zinc-500">{completeness.completed} von {completeness.total} redaktionellen Grundlagen sind gepflegt.</p>
          <div className={`mt-4 flex items-start gap-2 rounded-lg p-3 text-xs leading-5 ${completeness.readyForAi ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-900'}`}>
            {completeness.readyForAi ? <CheckCircle2 size={16} className="mt-0.5 shrink-0" /> : <CircleHelp size={16} className="mt-0.5 shrink-0" />}
            {completeness.readyForAi ? 'Bereit als bestätigtes KI-Profil.' : 'Noch nicht vollständig genug, um die KI-Eingabe zu überspringen.'}
          </div>
        </div>
        {completeness.missing.length > 0 && <div className="admin-card p-5"><h3 className="flex items-center gap-2 text-sm font-semibold text-zinc-950"><ShieldCheck size={16} className="text-blue-600" /> Noch offen</h3><ul className="mt-3 space-y-2 text-xs leading-5 text-zinc-600">{completeness.missing.map(item => <li key={item} className="flex gap-2"><span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-zinc-400" />{item}</li>)}</ul></div>}
        <p className="px-1 text-xs leading-5 text-zinc-500">{persisted ? 'Gespeichertes Profil' : 'Aus Marke und Kontakt vorbereitet – noch nicht gespeichert'}</p>
      </aside>
    </div>
  );
}
