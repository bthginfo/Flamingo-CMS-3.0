export type BillingCountryCode = 'DE' | 'AT';

export type BillingTaxRate = {
  basisPoints: number;
  label: string;
};

export type BillingJurisdiction = {
  code: BillingCountryCode;
  name: string;
  taxIdLabel: string;
  vatIdLabel: string;
  registerCourtLabel: string;
  registerNumberLabel: string;
  taxRates: BillingTaxRate[];
  defaultTaxRateBasisPoints: number;
  smallBusinessNotice: string;
  eInvoiceLabel: string;
  eInvoiceFormat: 'XRECHNUNG-UBL' | 'UBL';
  retentionYears: number;
};

export const BILLING_JURISDICTIONS: Record<BillingCountryCode, BillingJurisdiction> = {
  DE: {
    code: 'DE',
    name: 'Deutschland',
    taxIdLabel: 'Steuernummer',
    vatIdLabel: 'USt-IdNr.',
    registerCourtLabel: 'Registergericht',
    registerNumberLabel: 'Registernummer',
    taxRates: [
      { basisPoints: 1900, label: '19 %' },
      { basisPoints: 700, label: '7 %' },
      { basisPoints: 0, label: '0 %' },
    ],
    defaultTaxRateBasisPoints: 1900,
    smallBusinessNotice: 'Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.',
    eInvoiceLabel: 'XRechnung (UBL)',
    eInvoiceFormat: 'XRECHNUNG-UBL',
    retentionYears: 8,
  },
  AT: {
    code: 'AT',
    name: 'Österreich',
    taxIdLabel: 'Steuernummer',
    vatIdLabel: 'UID-Nummer',
    registerCourtLabel: 'Firmenbuchgericht',
    registerNumberLabel: 'Firmenbuchnummer',
    taxRates: [
      { basisPoints: 2000, label: '20 %' },
      { basisPoints: 1300, label: '13 %' },
      { basisPoints: 1000, label: '10 %' },
      { basisPoints: 0, label: '0 %' },
    ],
    defaultTaxRateBasisPoints: 2000,
    smallBusinessNotice: 'Umsatzsteuerbefreit aufgrund der Kleinunternehmerregelung gemäß § 6 Abs. 1 Z 27 UStG.',
    eInvoiceLabel: 'E-Rechnung (UBL 2.1)',
    eInvoiceFormat: 'UBL',
    retentionYears: 7,
  },
};

export function normalizeBillingCountryCode(value: string | null | undefined): BillingCountryCode {
  return value?.toUpperCase() === 'AT' ? 'AT' : 'DE';
}
export function getBillingJurisdiction(value: string | null | undefined) {
  return BILLING_JURISDICTIONS[normalizeBillingCountryCode(value)];
}
