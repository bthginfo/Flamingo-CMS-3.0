import assert from 'node:assert/strict';
import test from 'node:test';
import {
  DEFAULT_PAYPAL_INSTRUCTION,
  detectPaymentInstructionMode,
  paymentInstructionText,
} from './billing-payment-modes';

const seller = {
  accountHolder: 'Muster GmbH',
  iban: 'DE02120300000000202051',
  bic: 'BYLADEM1001',
  bankName: 'Musterbank',
};

test('recognizes a payment-link choice even before a URL is entered', () => {
  const text = paymentInstructionText('payment_link', seller, '');
  assert.equal(detectPaymentInstructionMode(text, '', seller), 'payment_link');
});

test('recognizes and renders PayPal instructions', () => {
  assert.equal(paymentInstructionText('paypal', seller, ''), DEFAULT_PAYPAL_INSTRUCTION);
  assert.equal(detectPaymentInstructionMode('Bitte per PayPal an rechnung@example.de zahlen.', '', seller), 'paypal');
});

test('keeps bank transfer, cash and custom modes distinguishable', () => {
  const bank = paymentInstructionText('bank_transfer', seller, '');
  assert.equal(detectPaymentInstructionMode(bank, '', seller), 'bank_transfer');
  assert.equal(detectPaymentInstructionMode('Der Rechnungsbetrag wird bar beglichen.', '', seller), 'cash');
  assert.equal(detectPaymentInstructionMode('Zahlung bei Übergabe.', '', seller), 'custom');
});
