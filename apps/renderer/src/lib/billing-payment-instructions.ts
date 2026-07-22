export type BillingPaymentInstructionSeller = {
  bankName?: string | null;
  accountHolder?: string | null;
  iban?: string | null;
  bic?: string | null;
};

export type BillingPaymentInstructionDocument = {
  closingText?: string | null;
  paymentLinkUrl?: string | null;
};

export function billingBankInstruction(seller: BillingPaymentInstructionSeller) {
  const bankParts = [
    seller.accountHolder ? `Kontoinhaber: ${seller.accountHolder}` : '',
    seller.iban ? `IBAN: ${seller.iban}` : '',
    seller.bic ? `BIC: ${seller.bic}` : '',
    seller.bankName ? `Bank: ${seller.bankName}` : '',
  ].filter(Boolean);
  return bankParts.length
    ? `Bitte überweisen Sie den Rechnungsbetrag fristgerecht unter Angabe der Rechnungsnummer auf folgendes Konto: ${bankParts.join(' · ')}.`
    : '';
}

export function billingPaymentInstruction(document: BillingPaymentInstructionDocument, seller: BillingPaymentInstructionSeller) {
  const closingText = document.closingText?.trim() || '';
  const paymentLinkUrl = document.paymentLinkUrl?.trim() || '';
  if (paymentLinkUrl) {
    return closingText.includes(paymentLinkUrl) ? '' : `Bitte begleichen Sie den Rechnungsbetrag über den Zahlungslink: ${paymentLinkUrl}`;
  }
  if (/\b(bar|cash)\b|ec[-\s]?karte|kartenzahlung|paypal|stripe|sumup/i.test(closingText)) return '';
  const bankInstruction = billingBankInstruction(seller);
  if (!bankInstruction) return '';
  if (/überweis|ueberweis|iban|bic|kontoinhaber|konto|bank/i.test(closingText)) return '';
  return bankInstruction;
}
