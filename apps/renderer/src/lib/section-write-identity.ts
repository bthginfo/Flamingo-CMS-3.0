import { getSectionDefinitionByKey, resolveSectionDefinition } from '@/templates';

export type SectionWriteIdentity = Readonly<{
  definitionKey: string;
  schemaVersion: number;
}>;

export type SectionWriteIdentityResult =
  | { ok: true; identity: SectionWriteIdentity }
  | { ok: false; error: string };

/** Resolve and validate the stable component identity before inserting a row. */
export function resolveSectionWriteIdentity(input: {
  type: string;
  industry?: string | null;
  definitionKey?: unknown;
  schemaVersion?: unknown;
}): SectionWriteIdentityResult {
  const explicitKey = typeof input.definitionKey === 'string' && input.definitionKey.trim()
    ? input.definitionKey.trim()
    : null;
  const definition = explicitKey
    ? getSectionDefinitionByKey(explicitKey)
    : resolveSectionDefinition({ type: input.type, industry: input.industry });

  if (!definition || definition.type !== input.type) {
    return {
      ok: false,
      error: explicitKey
        ? `definitionKey "${explicitKey}" is not registered for section type "${input.type}"`
        : `section type "${input.type}" has no renderable definition`,
    };
  }

  if (
    input.schemaVersion !== undefined
    && input.schemaVersion !== null
    && input.schemaVersion !== definition.schemaVersion
  ) {
    return {
      ok: false,
      error: `schemaVersion ${String(input.schemaVersion)} is incompatible with ${definition.key}; expected ${definition.schemaVersion}`,
    };
  }

  return {
    ok: true,
    identity: { definitionKey: definition.key, schemaVersion: definition.schemaVersion },
  };
}

export function resolveSectionWriteIdentities(
  sections: Array<{ type: string; definitionKey?: unknown; schemaVersion?: unknown }>,
  industry?: string | null,
): { ok: true; identities: SectionWriteIdentity[] } | { ok: false; error: string } {
  const identities: SectionWriteIdentity[] = [];
  for (let index = 0; index < sections.length; index++) {
    const result = resolveSectionWriteIdentity({ ...sections[index], industry });
    if (!result.ok) return { ok: false, error: `sections[${index}]: ${result.error}` };
    identities.push(result.identity);
  }
  return { ok: true, identities };
}
