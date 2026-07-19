import { parseSectionDefinitionKey } from '@/lib/section-definition-registry';

export type IndustryEditorCandidate = {
  industry: string;
  matches: (type: string) => boolean;
};

export function resolveIndustryEditorOwner(
  candidates: readonly IndustryEditorCandidate[],
  input: { industry: string; type: string; definitionKey?: string | null },
): string | null {
  const definition = input.definitionKey ? parseSectionDefinitionKey(input.definitionKey) : null;
  const explicitOwner = definition?.type === input.type
    ? candidates.find(candidate => candidate.industry === definition.owner && candidate.matches(input.type))
    : null;
  if (explicitOwner) return explicitOwner.industry;

  const preferredOwner = candidates.find(candidate => candidate.industry === input.industry && candidate.matches(input.type));
  if (preferredOwner) return preferredOwner.industry;

  const matchingOwners = candidates.filter(candidate => candidate.matches(input.type));
  return matchingOwners.length === 1 ? matchingOwners[0].industry : null;
}
