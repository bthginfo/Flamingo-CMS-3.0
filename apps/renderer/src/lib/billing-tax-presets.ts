import type { BillingTaxMode } from './billing-core';

export type BillingTaxSelection = BillingTaxMode | 'education_exempt';

export const EDUCATION_TAX_EXEMPTION_NOTICE = 'Umsatzsteuerfrei gemäß § 4 Nr. 21 UStG.';

export function taxSelection(taxMode: BillingTaxMode, taxExemptionReason: string): BillingTaxSelection {
  if (taxMode === 'exempt' && /§\s*4\s*(?:abs\.\s*1\s*)?nr\.\s*21\s*ustg/i.test(taxExemptionReason)) {
    return 'education_exempt';
  }
  return taxMode;
}

export function resolveTaxSelection(
  selection: BillingTaxSelection,
  currentReason = '',
): { taxMode: BillingTaxMode; taxExemptionReason: string } {
  if (selection === 'education_exempt') {
    return { taxMode: 'exempt', taxExemptionReason: EDUCATION_TAX_EXEMPTION_NOTICE };
  }
  if (selection === 'standard' || selection === 'small_business') {
    return { taxMode: selection, taxExemptionReason: '' };
  }
  return {
    taxMode: selection,
    taxExemptionReason: currentReason === EDUCATION_TAX_EXEMPTION_NOTICE ? '' : currentReason,
  };
}
