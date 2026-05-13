type Props = { data: Record<string, unknown>; variant?: string | null };

const HEIGHT: Record<string, string> = { s: 'h-64', m: 'h-96', l: 'h-[500px]' };

export function MapSection({ data }: Props) {
  const headline = (data.headline as string) || '';
  const embedUrl = (data.embedUrl as string) || '';
  const height = HEIGHT[(data.height as string) || 'm'] || HEIGHT.m;

  return (
    <div>
      {headline && <h2 className="text-3xl font-bold text-center mb-6">{headline}</h2>}
      {embedUrl ? (
        <iframe
          src={embedUrl}
          className={`w-full ${height} rounded-xl border-0`}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Standort"
        />
      ) : (
        <div className={`w-full ${height} bg-gray-100 rounded-xl flex items-center justify-center text-gray-400`}>
          Karte nicht konfiguriert
        </div>
      )}
    </div>
  );
}
