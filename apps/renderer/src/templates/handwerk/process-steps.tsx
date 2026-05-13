type Props = { data: Record<string, unknown>; variant?: string | null };

export function ProcessStepsSection({ data }: Props) {
  const headline = (data.headline as string) || '';
  const steps = (data.steps as { title: string; text: string; icon?: string }[]) || [];
  return (
    <div>
      {headline && <h2 className="text-3xl font-bold text-center mb-10">{headline}</h2>}
      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-brand-primary/20 hidden md:block" />
        <div className="space-y-8">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-6 items-start">
              <div className="shrink-0 w-12 h-12 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-lg">{i + 1}</div>
              <div>
                <h3 className="font-semibold text-lg">{step.title}</h3>
                <p className="text-gray-600 mt-1">{step.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
