import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

function source(relative: string) {
  return readFileSync(new URL(relative, import.meta.url), 'utf8');
}

test('page and collection editors reserve the shared bottom action bar', () => {
  const shell = source('../app/admin/editor/editor-workspace-shell.tsx');
  const actionBar = source('../app/admin/editor/editor-action-bar.tsx');
  const pageEditor = source('../app/admin/pages/[id]/page-editor.tsx');
  const itemEditor = source('../app/admin/collections/[key]/[itemId]/item-editor.tsx');

  assert.match(shell, /--editor-action-bar-height/);
  assert.match(shell, /paddingBottom: 'calc\(var\(--editor-action-bar-height\)/);
  assert.match(actionBar, /min-h-\[var\(--editor-action-bar-height,5rem\)\]/);
  assert.match(pageEditor, /<EditorWorkspaceShell>/);
  assert.match(itemEditor, /<EditorWorkspaceShell>/);
});

test('shared section editor controls cannot accidentally submit an outer form', () => {
  const dataEditor = source('../app/admin/pages/[id]/section-data-editor.tsx');
  const buttonLines = dataEditor.split(/\r?\n/).filter((line) => line.includes('<button'));
  assert.ok(buttonLines.length > 90);
  assert.deepEqual(buttonLines.filter((line) => !line.includes('type="button"')), []);
  const removeButtonLines = buttonLines.filter((line) => line.includes('>×</button>'));
  assert.ok(removeButtonLines.length > 0);
  assert.deepEqual(removeButtonLines.filter((line) => !line.includes('aria-label=')), []);
});

test('section focus and media dialog keyboard contracts remain wired', () => {
  const card = source('../app/admin/editor/section-editor-card.tsx');
  const media = source('../components/image-upload-field.tsx');
  assert.match(card, /data-section-card-id=\{section\.id\}/);
  assert.match(media, /event\.key === 'Escape'/);
  assert.match(media, /event\.key !== 'Tab'/);
  assert.match(media, /libraryReturnFocusRef/);
  assert.match(media, /aria-modal="true"/);
});

test('opening an embedded shop section never redirects out of the page editor', () => {
  const shopActions = source('../app/admin/shop/actions.ts');
  const dataEditor = source('../app/admin/pages/[id]/section-data-editor.tsx');
  const buttonField = source('../components/button-field.tsx');
  const actionStart = shopActions.indexOf('export async function getProductLinksAction');
  const actionEnd = shopActions.indexOf('\nexport async function getProduct(', actionStart);
  const pickerAction = shopActions.slice(actionStart, actionEnd);

  assert.ok(actionStart >= 0 && actionEnd > actionStart);
  assert.match(pickerAction, /requireAuthenticatedTenant\(\)/);
  assert.doesNotMatch(pickerAction, /requireTenant\(\)/);
  assert.match(pickerAction, /shopActive: false as const/);
  assert.match(dataEditor, /productListStatus/);
  assert.match(dataEditor, /Die Section bleibt bearbeitbar/);
  assert.match(buttonField, /setProducts\(result\.products\)/);
  assert.doesNotMatch(buttonField, /\.then\(setProducts\)/);
});

test('website check stays in the sidebar instead of competing with primary actions', () => {
  const sidebar = source('../components/sidebar.tsx');
  const publishFab = source('../components/publish-fab.tsx');
  const editorActionBar = source('../app/admin/editor/editor-action-bar.tsx');
  const dashboardActions = source('../app/admin/dashboard-actions.tsx');
  const dashboard = source('../app/admin/page.tsx');
  const healthPage = source('../app/admin/content-health/page.tsx');

  assert.match(sidebar, /label: 'Website prüfen'/);
  for (const actionSource of [publishFab, editorActionBar, dashboardActions]) {
    assert.doesNotMatch(actionSource, /Publish-Check|href="\/admin\/content-health"/);
  }
  assert.doesNotMatch(dashboard, /getContentHealthReport|Publish-Bereitschaft|Website-Health/);
  assert.match(healthPage, /Verbesserungsvorschläge/);
  assert.doesNotMatch(healthPage, /<code|font-mono|issue\.location/);
});

test('user-facing list inputs use add and remove controls instead of comma-separated text', () => {
  const listField = source('../components/string-list-field.tsx');
  const contactForm = source('../app/admin/contact-form/page.tsx');
  const shipping = source('../app/admin/shop/shipping/shipping-client.tsx');
  const sectionEditor = source('../app/admin/pages/[id]/section-data-editor.tsx');
  const hotelEditor = source('../app/admin/pages/[id]/hotel-section-data-editor.tsx');
  const medicalEditor = source('../app/admin/pages/[id]/medical-section-data-editor.tsx');
  const realestateEditor = source('../app/admin/pages/[id]/realestate-section-data-editor.tsx');
  const restaurantEditor = source('../app/admin/pages/[id]/restaurant-section-data-editor.tsx');
  const salonEditor = source('../app/admin/pages/[id]/salon-section-data-editor.tsx');
  const tattooEditor = source('../app/admin/pages/[id]/tattoo-section-data-editor.tsx');
  const tourismEditor = source('../app/admin/pages/[id]/tourism-section-data-editor.tsx');
  const weddingEditor = source('../app/admin/pages/[id]/wedding-section-data-editor.tsx');
  const seoForm = source('../app/admin/seo/seo-form.tsx');
  const bookingPage = source('../app/admin/functions/booking/page.tsx');
  const bookingQuestions = source('../app/admin/functions/booking/booking-intake-questions-field.tsx');

  assert.match(listField, /Eintrag hinzufügen/);
  assert.match(listField, /Eintrag.*entfernen/);
  assert.match(listField, /value === '' \? \[\] : value\.split\('\\n'\)/);
  assert.match(contactForm, /<StringListField/);
  assert.match(shipping, /<StringListField/);
  assert.match(sectionEditor, /<StringListField/);
  for (const editorSource of [hotelEditor, medicalEditor, realestateEditor, restaurantEditor, salonEditor, tattooEditor, tourismEditor, weddingEditor]) {
    assert.match(editorSource, /<LineListField/);
  }
  assert.match(seoForm, /<SeoServicesField/);
  assert.match(seoForm, /sameAsText: serializeStringList\(localSeo\.sameAs\)/);
  assert.match(bookingPage, /<BookingIntakeQuestionsField/);
  assert.match(bookingQuestions, /name="intakeQuestions"/);
  assert.match(bookingQuestions, /serializeQuestions\(questions\)/);
  assert.doesNotMatch(bookingPage, /<textarea[^>]+name="intakeQuestions"/);

  const userFacingEditors = [contactForm, shipping, sectionEditor, hotelEditor, medicalEditor, realestateEditor, restaurantEditor, salonEditor, tattooEditor, tourismEditor, weddingEditor, seoForm, bookingPage];
  for (const editorSource of userFacingEditors) {
    assert.doesNotMatch(editorSource, /komma.?getrennt|kommagetrennt|(?:eine|eins|je)\s+(?:zeile\s+pro|pro\s+zeile)|mit\s+\|\s+trennen/i);
  }
});

test('list builder actions have touch targets, keyboard focus, and safe draft cleanup', () => {
  const listField = source('../components/string-list-field.tsx');
  const seoForm = source('../app/admin/seo/seo-form.tsx');
  const bookingQuestions = source('../app/admin/functions/booking/booking-intake-questions-field.tsx');

  for (const builderSource of [listField, seoForm, bookingQuestions]) {
    assert.match(builderSource, /min-h-10 min-w-10/);
    assert.match(builderSource, /focus-visible:ring-2/);
  }
  assert.match(listField, /compactStringList\(value\)/);
  assert.match(listField, /relatedTarget/);
});
