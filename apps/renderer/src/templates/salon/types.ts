export type SectionProps = {
  data: Record<string, unknown>;
  variant?: string | null;
  styleVariant?: string;
};

export type ButtonValue = { label?: string; href?: string };

export function asButton(value: unknown): ButtonValue {
  return (value as ButtonValue | undefined) ?? {};
}

export function asList<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}
