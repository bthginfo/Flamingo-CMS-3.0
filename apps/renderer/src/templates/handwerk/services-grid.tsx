type Props = { data: Record<string, unknown>; variant?: string | null };

export function ServicesGridSection({ data }: Props) {
  const headline = (data.headline as string) || '';
  const subline = (data.subline as string) || '';
  const cards = (data.manualCards as { title: string; text?: string; icon?: string }[]) || [];
  return (
    <div>
      {headline && <h2 className="text-3xl font-bold text-center mb-2">{headline}</h2>}
      {subline && <p className="text-center text-gray-600 mb-8">{subline}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <div key={i} className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition">
            {card.icon && <div className="text-2xl mb-3">{card.icon}</div>}
            <h3 className="font-semibold text-lg mb-2">{card.title}</h3>
            {card.text && <p className="text-gray-600 text-sm">{card.text}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
