import { ScriptsForm } from './scripts-form';

export default function ScriptsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Skripte & Tracking</h1>
      <p className="text-zinc-500 text-sm mb-8">Google Analytics, Facebook Pixel und andere Tracking-Codes verwalten.</p>
      <ScriptsForm />
    </div>
  );
}
