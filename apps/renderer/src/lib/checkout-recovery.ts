export type ExternalCheckoutLifecycle<TSession, TResult> = {
  provision: () => Promise<TSession>;
  finalizeProvisioned: (session: TSession) => Promise<TResult>;
  onProvisionFailure: (error: unknown) => Promise<TResult>;
  onProvisioningUncertain: (error: unknown) => Promise<TResult>;
  onPostProvisionFailure: (error: unknown, session: TSession) => Promise<TResult>;
};

export class ExternalProvisioningUncertainError extends Error {
  constructor(readonly originalError: unknown) {
    super('External provider provisioning may have succeeded.');
    this.name = 'ExternalProvisioningUncertainError';
  }
}

export function externalProvisioningUncertain(error: unknown): never {
  throw new ExternalProvisioningUncertainError(error);
}

/**
 * Keeps the irreversible boundary around external payment provisioning
 * explicit. Once a provider returned a usable session, every later failure is
 * reconciled as uncertain and must never run the local stock/coupon rollback.
 */
export async function runExternalCheckoutLifecycle<TSession, TResult>(
  lifecycle: ExternalCheckoutLifecycle<TSession, TResult>,
): Promise<TResult> {
  let session: TSession;
  try {
    session = await lifecycle.provision();
  } catch (error) {
    if (error instanceof ExternalProvisioningUncertainError) {
      return lifecycle.onProvisioningUncertain(error.originalError);
    }
    return lifecycle.onProvisionFailure(error);
  }

  try {
    return await lifecycle.finalizeProvisioned(session);
  } catch (error) {
    return lifecycle.onPostProvisionFailure(error, session);
  }
}
