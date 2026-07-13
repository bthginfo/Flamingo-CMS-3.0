import { AlertTriangle } from 'lucide-react';
import { getBusinessProfileState } from './actions';
import { BusinessProfileForm } from './profile-form';

export default async function BusinessProfilePage() {
  const state = await getBusinessProfileState();
  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-7">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-blue-600">Redaktionelle Grundlage</p>
        <h1 className="text-2xl font-bold text-zinc-950">Unternehmensprofil</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-600">
          Einmal bestätigte Fakten werden von KI, SEO und Sektionen wiederverwendet. Unbekanntes bleibt ausdrücklich unbekannt – so entstehen keine erfundenen Versprechen.
        </p>
      </div>
      {state.persistedProfileInvalid && (
        <div role="alert" className="mb-6 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
          <AlertTriangle size={18} className="mt-0.5 shrink-0" />
          <div><strong>Das gespeicherte Profil war nicht mehr kompatibel.</strong><p className="mt-1 text-amber-800">Es wurde sicher aus Marke und Kontakt neu vorbereitet. Prüfen und speichern Sie die Angaben.</p></div>
        </div>
      )}
      <BusinessProfileForm initialProfile={state.profile} initialPersisted={state.isPersisted} />
    </div>
  );
}
