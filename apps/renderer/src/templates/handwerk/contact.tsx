type Props = { data: Record<string, unknown>; variant?: string | null };

export function ContactSection({ data }: Props) {
  const headline = (data.headline as string) || 'Kontakt';
  const introText = (data.introText as string) || '';
  const formEnabled = data.formEnabled !== false;
  const submitLabel = (data.submitLabel as string) || 'Absenden';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div>
        <h2 className="text-3xl font-bold mb-4">{headline}</h2>
        {introText && <p className="text-gray-600 mb-6">{introText}</p>}
      </div>
      {formEnabled && (
        <form className="space-y-4">
          <input type="text" placeholder="Name" required className="w-full border rounded-lg px-4 py-3" />
          <input type="email" placeholder="E-Mail" required className="w-full border rounded-lg px-4 py-3" />
          <input type="tel" placeholder="Telefon" className="w-full border rounded-lg px-4 py-3" />
          <textarea placeholder="Ihre Nachricht" rows={4} required className="w-full border rounded-lg px-4 py-3" />
          <button type="submit" className="bg-brand-primary text-white font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition">
            {submitLabel}
          </button>
        </form>
      )}
    </div>
  );
}
