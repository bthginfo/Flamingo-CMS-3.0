import assert from 'node:assert/strict';
import test from 'node:test';
import { resolveContactInfoCards } from './contact-info';

test('maps legacy contact fields into populated info cards', () => {
  assert.deepEqual(resolveContactInfoCards({
    phone: '+49 151 15539416',
    email: 'info@taoyin-zentrum.de',
    address: 'Bei der Schleifmühle 34b, 85049 Ingolstadt',
    hours: 'Mo–Fr 09:00–18:00',
  }), [
    { icon: 'phone', label: 'Telefon', value: '+49 151 15539416' },
    { icon: 'mail', label: 'E-Mail', value: 'info@taoyin-zentrum.de' },
    { icon: 'map-pin', label: 'Standort', value: 'Bei der Schleifmühle 34b, 85049 Ingolstadt' },
    { icon: 'clock', label: 'Öffnungszeiten', value: 'Mo–Fr 09:00–18:00' },
  ]);
});

test('does not render blank fallback cards', () => {
  assert.deepEqual(resolveContactInfoCards({ address: 'Ingolstadt' }), [
    { icon: 'map-pin', label: 'Standort', value: 'Ingolstadt' },
  ]);
});

test('prefers configured cards and removes empty rows', () => {
  assert.deepEqual(resolveContactInfoCards({
    phone: 'legacy',
    infoCards: [
      { icon: 'message-circle', label: 'WhatsApp', value: '+49 151 15539416' },
      { icon: 'clock', label: 'Termin', value: '  ' },
    ],
  }), [
    { icon: 'message-circle', label: 'WhatsApp', value: '+49 151 15539416' },
  ]);
});
