import assert from 'node:assert/strict';
import test from 'node:test';
import {
  normalizeMobileActionDockData,
  safeDockHref,
  shouldHideActionDockForPath,
} from './mobile-action-dock';

test('normalizes at most three safe, complete actions', () => {
  const result = normalizeMobileActionDockData({
    compactLabel: '  Direkt erreichbar  ',
    revealAfterScroll: true,
    revealAfterPx: 9999,
    desktopMode: 'inline',
    actions: [
      { kind: 'call', label: 'Anrufen', href: 'tel:+4989123456' },
      { kind: 'route', label: 'Route', href: 'https://maps.example/route' },
      { kind: 'booking', label: 'Termin', href: '/termin' },
      { kind: 'internal', label: 'Mehr', href: '/mehr' },
    ],
  });

  assert.equal(result.compactLabel, 'Direkt erreichbar');
  assert.equal(result.actions.length, 3);
  assert.equal(result.actions[0].icon, 'Phone');
  assert.equal(result.revealAfterPx, 2000);
  assert.equal(result.desktopMode, 'inline');
  assert.equal(safeDockHref('tel:+49 89 123 45', 'call'), 'tel:+498912345');
});

test('drops malformed and executable links and gives cart a safe default', () => {
  const result = normalizeMobileActionDockData({
    actions: [
      { kind: 'internal', label: 'Unsicher', href: 'javascript:alert(1)' },
      { kind: 'call', label: 'Falsch', href: 'mailto:test@example.com' },
      { kind: 'cart', label: 'Warenkorb', href: '' },
    ],
  });

  assert.deepEqual(result.actions.map((action) => action.href), ['/warenkorb']);
  assert.equal(safeDockHref('data:text/html,test', 'internal'), '');
});

test('recognizes checkout paths with and without a tenant prefix', () => {
  assert.equal(shouldHideActionDockForPath('/checkout', ['/checkout']), true);
  assert.equal(shouldHideActionDockForPath('/demo/shop/checkout/', ['/checkout']), true);
  assert.equal(shouldHideActionDockForPath('/angebote', ['/checkout']), false);
});
