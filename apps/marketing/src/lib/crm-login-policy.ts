export const CRM_MASTER_PASSWORD_MIN_LENGTH = 12;
export const CRM_MASTER_PASSWORD_MAX_LENGTH = 1_024;

export function normalizeConfiguredCrmMasterPassword(value: string | undefined): string | null {
  const password = value?.trim();
  if (
    !password
    || password.length < CRM_MASTER_PASSWORD_MIN_LENGTH
    || password.length > CRM_MASTER_PASSWORD_MAX_LENGTH
  ) {
    return null;
  }
  return password;
}
