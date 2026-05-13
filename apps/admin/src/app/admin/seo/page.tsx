import { SeoForm } from './seo-form';

export default function SeoPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">SEO & Sichtbarkeit</h1>
      <p className="text-zinc-500 text-sm mb-8">Meta-Tags und Open-Graph-Einstellungen für bessere Auffindbarkeit.</p>
      <SeoForm />
    </div>
  );
}
