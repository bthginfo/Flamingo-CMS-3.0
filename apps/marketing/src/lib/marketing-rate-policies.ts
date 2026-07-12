import type { CrmEmailPurpose } from './crm-email';

export type MarketingRateLimitRule = {
  scope: string;
  subject: string;
  limit: number;
  windowSeconds: number;
};

export function contactRateLimitRules(clientAddress: string, email: string): MarketingRateLimitRule[] {
  return [
    { scope: 'contact_email', subject: email, limit: 3, windowSeconds: 60 * 60 },
    { scope: 'contact_ip', subject: clientAddress, limit: 5, windowSeconds: 15 * 60 },
    { scope: 'contact_global', subject: 'all', limit: 120, windowSeconds: 10 * 60 },
  ];
}

export function crmLoginRateLimitRules(clientAddress: string): MarketingRateLimitRule[] {
  return [
    { scope: 'crm_login_ip', subject: clientAddress, limit: 8, windowSeconds: 15 * 60 },
    { scope: 'crm_login_global', subject: 'master_account', limit: 50, windowSeconds: 15 * 60 },
  ];
}

export function crmEmailRateLimitRules(
  clientAddress: string,
  purpose: CrmEmailPurpose,
  entityId: string,
): MarketingRateLimitRule[] {
  return [
    { scope: 'crm_email_entity', subject: `${purpose}:${entityId}`, limit: 5, windowSeconds: 60 * 60 },
    { scope: 'crm_email_ip', subject: clientAddress, limit: 30, windowSeconds: 10 * 60 },
    { scope: 'crm_email_global', subject: 'all', limit: 100, windowSeconds: 60 * 60 },
  ];
}
