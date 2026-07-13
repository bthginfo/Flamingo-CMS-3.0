import assert from 'node:assert/strict';
import test from 'node:test';
import { validateI18nSettings } from './i18n-admin-settings';

test('normalizes and accepts entitled i18n settings', () => {
  const result = validateI18nSettings({
    locales: ['DE', 'en', 'en'],
    defaultLocale: 'de',
    switcherStyle: 'dropdown',
    switcherPosition: 'nav-right',
  }, 3);
  assert.deepEqual(result, {
    value: {
      locales: ['de', 'en'],
      defaultLocale: 'de',
      switcherStyle: 'dropdown',
      switcherPosition: 'nav-right',
    },
  });
});

test('rejects package-limit, unsupported and inconsistent settings', () => {
  assert.match(validateI18nSettings({ locales: ['de', 'en'], defaultLocale: 'de', switcherStyle: 'text', switcherPosition: 'footer' }, 1).error || '', /höchstens 1/);
  assert.match(validateI18nSettings({ locales: ['de', 'xx'], defaultLocale: 'de', switcherStyle: 'text', switcherPosition: 'footer' }, 3).error || '', /nicht unterstützt/);
  assert.match(validateI18nSettings({ locales: ['de'], defaultLocale: 'en', switcherStyle: 'text', switcherPosition: 'footer' }, 3).error || '', /Standardsprache/);
});
