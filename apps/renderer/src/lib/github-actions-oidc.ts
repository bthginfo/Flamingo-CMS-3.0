import { createRemoteJWKSet, jwtVerify, type JWTPayload } from 'jose';

const GITHUB_ACTIONS_ISSUER = 'https://token.actions.githubusercontent.com';
const GITHUB_ACTIONS_AUDIENCE = 'https://flamingomedia.online/revalidate';
const TRUSTED_REPOSITORY = 'bthginfo/flamingo-cms-3.0';
const TRUSTED_REF = 'refs/heads/main';
const TRUSTED_ENVIRONMENT = 'production';
const TRUSTED_EVENT = 'workflow_dispatch';
const TRUSTED_WORKFLOW_REF = `${TRUSTED_REPOSITORY}/.github/workflows/fw-targeted-content-repair.yml@${TRUSTED_REF}`;
const TRUSTED_SUBJECT = `repo:${TRUSTED_REPOSITORY}:environment:${TRUSTED_ENVIRONMENT}`;

const githubActionsJwks = createRemoteJWKSet(
  new URL(`${GITHUB_ACTIONS_ISSUER}/.well-known/jwks`),
);

export function isTrustedFwRevalidationClaims(payload: JWTPayload): boolean {
  const repository = typeof payload.repository === 'string'
    ? payload.repository.toLowerCase()
    : '';
  const workflowRef = typeof payload.workflow_ref === 'string'
    ? payload.workflow_ref.toLowerCase()
    : '';
  const subject = typeof payload.sub === 'string' ? payload.sub.toLowerCase() : '';

  return repository === TRUSTED_REPOSITORY
    && payload.ref === TRUSTED_REF
    && payload.environment === TRUSTED_ENVIRONMENT
    && payload.event_name === TRUSTED_EVENT
    && workflowRef === TRUSTED_WORKFLOW_REF
    && subject === TRUSTED_SUBJECT;
}

export async function verifyFwRevalidationOidcToken(token: string): Promise<boolean> {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, githubActionsJwks, {
      issuer: GITHUB_ACTIONS_ISSUER,
      audience: GITHUB_ACTIONS_AUDIENCE,
      algorithms: ['RS256'],
      requiredClaims: [
        'sub',
        'repository',
        'ref',
        'environment',
        'event_name',
        'workflow_ref',
      ],
    });
    return isTrustedFwRevalidationClaims(payload);
  } catch {
    return false;
  }
}
