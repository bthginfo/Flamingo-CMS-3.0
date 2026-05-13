type Props = { data: Record<string, unknown>; variant?: string | null };

export function TestimonialsSection({ data }: Props) {
  const headline = (data.headline as string) || '';
  const items = (data.items as { quote: string; name: string; context?: string; rating?: number }[]) || [];
  return (
    <div>
      {headline && <h2 className="text-3xl font-bold text-center mb-8">{headline}</h2>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, i) => (
          <div key={i} className="bg-gray-50 rounded-xl p-6">
            {item.rating && <div className="text-yellow-500 mb-2">{'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}</div>}
            <blockquote className="text-gray-700 italic mb-4">&ldquo;{item.quote}&rdquo;</blockquote>
            <div className="font-semibold">{item.name}</div>
            {item.context && <div className="text-gray-500 text-sm">{item.context}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
