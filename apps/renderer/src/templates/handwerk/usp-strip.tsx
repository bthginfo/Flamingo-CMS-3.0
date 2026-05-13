type Props = { data: Record<string, unknown>; variant?: string | null };

export function UspStripSection({ data }: Props) {
  const items = (data.items as { icon?: string; title: string; text: string }[]) || [];
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {items.map((item, i) => (
        <div key={i} className="text-center p-6">
          {item.icon && <div className="text-3xl mb-2">{item.icon}</div>}
          <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
          <p className="text-gray-600 text-sm">{item.text}</p>
        </div>
      ))}
    </div>
  );
}
