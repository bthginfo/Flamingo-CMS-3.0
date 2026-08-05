export class FinalizationClaimLostError extends Error {
  constructor() {
    super('Der Finalisierungsauftrag hat seine Sperre verloren.');
    this.name = 'FinalizationClaimLostError';
  }
}

/**
 * Runs the expensive part of finalization under a caller-owned claim token.
 * The database callbacks must include that token in their predicates. This
 * keeps a stale worker from committing or releasing a newer worker's claim.
 */
export async function runOwnedFinalization<TArtifact, TResult>(options: {
  token: string;
  build: () => Promise<TArtifact>;
  commit: (token: string, artifact: TArtifact) => Promise<TResult | null>;
  release: (token: string) => Promise<void>;
  cleanup?: (artifact: TArtifact) => Promise<void>;
}) {
  let artifact: TArtifact | undefined;
  let committed = false;
  try {
    artifact = await options.build();
    const result = await options.commit(options.token, artifact);
    if (result === null) throw new FinalizationClaimLostError();
    committed = true;
    return result;
  } finally {
    if (!committed) {
      if (artifact && options.cleanup) await options.cleanup(artifact).catch(() => undefined);
      await options.release(options.token).catch(() => undefined);
    }
  }
}
