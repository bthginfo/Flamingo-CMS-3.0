export const CURRENT_SECTION_SCHEMA_VERSION = 1;

export type SectionDefinitionKey = `${string}.${string}.v${number}`;

export type SectionDefinition<T> = Readonly<{
  key: SectionDefinitionKey;
  type: string;
  owner: string;
  version: number;
  schemaVersion: number;
  component: T;
}>;

export type SectionDefinitionResolution =
  | 'explicit'
  | 'legacy-industry'
  | 'legacy-shared'
  | 'legacy-cross-industry';

export type ResolvedSectionDefinition<T> = SectionDefinition<T> & Readonly<{
  resolution: SectionDefinitionResolution;
  schemaCompatible: boolean;
}>;

export type ResolveSectionDefinitionInput = Readonly<{
  type: string;
  industry?: string | null;
  definitionKey?: string | null;
  schemaVersion?: number | null;
}>;

export type SectionDefinitionRegistry<T> = Readonly<{
  get: (key: string) => SectionDefinition<T> | null;
  list: () => readonly SectionDefinition<T>[];
  resolve: (input: ResolveSectionDefinitionInput) => ResolvedSectionDefinition<T> | null;
  resolveLegacyKey: (industry: string | null | undefined, type: string) => SectionDefinitionKey | null;
}>;

type CreateRegistryInput<T> = Readonly<{
  industryTemplates: Readonly<Record<string, Readonly<Record<string, T>>>>;
  sharedTemplates: Readonly<Record<string, T>>;
  legacyFallbackIndustryOrder: readonly string[];
  defaultIndustry: string;
  industryAliases?: Readonly<Record<string, string>>;
  version?: number;
  schemaVersion?: number;
}>;

const TYPE_SEGMENT = /^[A-Za-z][A-Za-z0-9_-]*$/;
const OWNER_SEGMENT = /^[a-z][a-z0-9-]*$/;
const DEFINITION_KEY = /^([A-Za-z][A-Za-z0-9_-]*)\.([a-z][a-z0-9-]*)\.v([1-9][0-9]*)$/;

function assertSegment(value: string, pattern: RegExp, label: string) {
  if (!pattern.test(value)) throw new Error(`Invalid section definition ${label}: ${value}`);
}

export function createSectionDefinitionKey(type: string, owner: string, version = 1): SectionDefinitionKey {
  assertSegment(type, TYPE_SEGMENT, 'type');
  assertSegment(owner, OWNER_SEGMENT, 'owner');
  if (!Number.isSafeInteger(version) || version < 1) {
    throw new Error(`Invalid section definition version: ${version}`);
  }
  return `${type}.${owner}.v${version}` as SectionDefinitionKey;
}

export function parseSectionDefinitionKey(key: string): { type: string; owner: string; version: number } | null {
  const match = DEFINITION_KEY.exec(key);
  if (!match) return null;
  return { type: match[1], owner: match[2], version: Number(match[3]) };
}

export function isSectionDefinitionKey(key: unknown): key is SectionDefinitionKey {
  return typeof key === 'string' && parseSectionDefinitionKey(key) !== null;
}

export function createSectionDefinitionRegistry<T>(input: CreateRegistryInput<T>): SectionDefinitionRegistry<T> {
  const version = input.version ?? 1;
  const schemaVersion = input.schemaVersion ?? CURRENT_SECTION_SCHEMA_VERSION;
  if (!input.industryTemplates[input.defaultIndustry]) {
    throw new Error(`Default section industry is not registered: ${input.defaultIndustry}`);
  }
  if (!Number.isSafeInteger(schemaVersion) || schemaVersion < 1) {
    throw new Error(`Invalid section schema version: ${schemaVersion}`);
  }

  const definitions = new Map<SectionDefinitionKey, SectionDefinition<T>>();
  const register = (owner: string, templates: Readonly<Record<string, T>>) => {
    for (const type of Object.keys(templates).sort()) {
      const key = createSectionDefinitionKey(type, owner, version);
      if (definitions.has(key)) throw new Error(`Duplicate section definition key: ${key}`);
      definitions.set(key, Object.freeze({
        key,
        type,
        owner,
        version,
        schemaVersion,
        component: templates[type],
      }));
    }
  };

  for (const industry of Object.keys(input.industryTemplates).sort()) {
    register(industry, input.industryTemplates[industry]);
  }
  register('shared', input.sharedTemplates);

  const orderedDefinitions = Object.freeze(
    [...definitions.values()].sort((left, right) => left.key.localeCompare(right.key)),
  );

  const normalizeIndustry = (industry: string | null | undefined) => {
    const raw = industry?.trim().toLowerCase() || input.defaultIndustry;
    const canonical = input.industryAliases?.[raw] ?? raw;
    return input.industryTemplates[canonical] ? canonical : input.defaultIndustry;
  };

  const withResolution = (
    definition: SectionDefinition<T>,
    resolution: SectionDefinitionResolution,
    storedSchemaVersion: number | null | undefined,
  ): ResolvedSectionDefinition<T> => ({
    ...definition,
    resolution,
    schemaCompatible: storedSchemaVersion == null || storedSchemaVersion === definition.schemaVersion,
  });

  const getDefinition = (type: string, owner: string) => {
    if (!TYPE_SEGMENT.test(type) || !OWNER_SEGMENT.test(owner)) return undefined;
    return definitions.get(createSectionDefinitionKey(type, owner, version));
  };

  const resolve = (request: ResolveSectionDefinitionInput): ResolvedSectionDefinition<T> | null => {
    const explicit = request.definitionKey ? definitions.get(request.definitionKey as SectionDefinitionKey) : undefined;
    // A mismatched key must not let a stored `type` inherit another section's
    // wrapper/data semantics. Invalid or stale keys safely use the legacy path.
    if (explicit?.type === request.type) {
      return withResolution(explicit, 'explicit', request.schemaVersion);
    }

    const industry = normalizeIndustry(request.industry);
    const industryDefinition = getDefinition(request.type, industry);
    if (industryDefinition) {
      return withResolution(industryDefinition, 'legacy-industry', request.schemaVersion);
    }

    const sharedDefinition = getDefinition(request.type, 'shared');
    if (sharedDefinition) {
      return withResolution(sharedDefinition, 'legacy-shared', request.schemaVersion);
    }

    // Mirrors the old ALL_TEMPLATES reduce exactly, but makes the precedence an
    // explicit contract instead of depending on object insertion order.
    let crossIndustryDefinition: SectionDefinition<T> | undefined;
    for (const fallbackIndustry of input.legacyFallbackIndustryOrder) {
      const candidate = getDefinition(request.type, fallbackIndustry);
      if (candidate) crossIndustryDefinition = candidate;
    }
    return crossIndustryDefinition
      ? withResolution(crossIndustryDefinition, 'legacy-cross-industry', request.schemaVersion)
      : null;
  };

  return Object.freeze({
    get: (key: string) => definitions.get(key as SectionDefinitionKey) ?? null,
    list: () => orderedDefinitions,
    resolve,
    resolveLegacyKey: (industry: string | null | undefined, type: string) => resolve({ industry, type })?.key ?? null,
  });
}
