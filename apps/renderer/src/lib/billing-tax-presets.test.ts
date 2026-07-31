import assert from 'node:assert/strict';
import test from 'node:test';
import {
  EDUCATION_TAX_EXEMPTION_NOTICE,
  resolveTaxSelection,
  taxSelection,
} from './billing-tax-presets';

test('maps the education preset to the existing exempt tax mode', () => {
  assert.deepEqual(resolveTaxSelection('education_exempt'), {
    taxMode: 'exempt',
    taxExemptionReason: EDUCATION_TAX_EXEMPTION_NOTICE,
  });
  assert.equal(taxSelection('exempt', EDUCATION_TAX_EXEMPTION_NOTICE), 'education_exempt');
});

test('does not mislabel unrelated exemptions as education', () => {
  assert.equal(taxSelection('exempt', 'Umsatzsteuerfrei nach anderer Rechtsgrundlage.'), 'exempt');
});

test('clears the education preset when switching to a custom exemption', () => {
  assert.deepEqual(resolveTaxSelection('exempt', EDUCATION_TAX_EXEMPTION_NOTICE), {
    taxMode: 'exempt',
    taxExemptionReason: '',
  });
});
