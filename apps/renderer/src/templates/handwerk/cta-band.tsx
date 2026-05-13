type Props = { data: Record<string, unknown>; variant?: string | null };

export function CtaBandSection({ data }: Props) {
  const headline = (data.headline as string) || '';
  const subline = (data.subline as string) || '';
  const cta = data.ctaPrimary as { label: string; href: string } | undefined;
  return (
    <div className="bg-brand-primary text-white rounded-2xl p-12 text-center">
      <h2 className="text-3xl font-bold mb-3">{headline}</h2>
      {subline && <p className="text-lg opacity-90 mb-6">{subline}</p>}
      {cta?.label && (
        <a href={cta.href} className="inline-block bg-brand-accent text-gray-900 font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition">
          {cta.label}
        </a>
      )}
    </div>
  );
}
