import { billingBankInstruction, type BillingPaymentInstructionSeller } from './billing-payment-instructions';

export type BillingPaymentInstructionMode = 'bank_transfer' | 'payment_link' | 'paypal' | 'cash' | 'custom';

export const DEFAULT_PAYPAL_INSTRUCTION = 'Bitte zahlen Sie den Rechnungsbetrag per PayPal.';

function bankInstruction(settings: BillingPaymentInstructionSeller) {
  return billingBankInstruction(settings)
    || 'Bitte überweisen Sie den Rechnungsbetrag fristgerecht unter Angabe der Rechnungsnummer. Bankverbindung bitte in den Rechnungseinstellungen ergänzen.';
}

export function paymentInstructionText(
  mode: BillingPaymentInstructionMode,
  settings: BillingPaymentInstructionSeller,
  paymentLinkUrl: string,
  customText = '',
) {
  if (mode === 'payment_link') {
    return paymentLinkUrl
      ? `Bitte begleichen Sie den Rechnungsbetrag über den Zahlungslink: ${paymentLinkUrl}`
      : 'Bitte begleichen Sie den Rechnungsbetrag über den hinterlegten Zahlungslink.';
  }
  if (mode === 'paypal') return customText.trim() || DEFAULT_PAYPAL_INSTRUCTION;
  if (mode === 'cash') return 'Der Rechnungsbetrag wird bar beglichen.';
  if (mode === 'custom') return customText;
  return bankInstruction(settings);
}

export function detectPaymentInstructionMode(
  closingText: string,
  paymentLinkUrl: string,
  settings: BillingPaymentInstructionSeller,
): BillingPaymentInstructionMode {
  const text = closingText.trim();
  if (paymentLinkUrl || /zahlungslink|payment\s*link/i.test(text)) return 'payment_link';
  if (/paypal/i.test(text)) return 'paypal';
  if (/\bbar\b|\bcash\b/i.test(text)) return 'cash';
  if (!text) return 'bank_transfer';
  if (text === bankInstruction(settings) || /überweis|ueberweis|iban|konto/i.test(text)) return 'bank_transfer';
  return 'custom';
}
