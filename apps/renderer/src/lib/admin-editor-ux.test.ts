import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { resolveIndustryEditorOwner } from '../app/admin/editor/industry-editor-resolution';

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

test('page and collection items use the same document editing hierarchy', () => {
  const header = source('../app/admin/editor/editor-document-header.tsx');
  const actionBar = source('../app/admin/editor/editor-action-bar.tsx');
  const localeTabs = source('../app/admin/editor/editor-locale-tabs.tsx');
  const sectionStack = source('../app/admin/editor/section-stack-editor.tsx');
  const pageEditor = source('../app/admin/pages/[id]/page-editor.tsx');
  const itemEditor = source('../app/admin/collections/[key]/[itemId]/item-editor.tsx');

  assert.match(header, /export function EditorDocumentHeader/);
  assert.match(header, /Bereit zum Bearbeiten/);
  assert.match(header, /Noch nicht gespeichert/);
  assert.match(header, /statusActiveLabel/);
  assert.match(actionBar, /dirty \? 'Noch nicht gespeichert'/);
  assert.match(localeTabs, /role="tablist"/);
  assert.match(sectionStack, />Inhalte</);

  for (const editor of [pageEditor, itemEditor]) {
    assert.match(editor, /<EditorDocumentHeader/);
    assert.match(editor, /const \[saved, setSaved\] = useState\(true\)/);
    assert.match(editor, /dirty=\{hasDirty\}/);
  }

  assert.ok(pageEditor.indexOf('<EditorDocumentHeader') < pageEditor.indexOf('<PageSeoPanel ref'));
  assert.ok(itemEditor.indexOf('<EditorDocumentHeader') < itemEditor.indexOf('<ItemSeoPanel ref'));
  assert.match(pageEditor, /statusInactiveLabel="Nicht sichtbar"/);
  assert.match(itemEditor, /statusInactiveLabel="Entwurf"/);
  assert.match(itemEditor, /secondaryControls=/);
});

test('industry acts as a preferred preset without degrading foreign section editors', () => {
  const industryEditor = source('../app/admin/pages/[id]/industry-section-editor.tsx');
  const sectionTypes = source('../app/admin/pages/[id]/section-types.ts');
  const picker = source('../app/admin/components/section-picker-modal.tsx');

  assert.match(industryEditor, /resolveIndustryEditorOwner/);
  assert.match(industryEditor, /resolveIndustryEditorKey/);
  assert.match(source('../app/admin/editor/section-editor-card.tsx'), /definitionKey=\{section\.definitionKey\}/);
  assert.match(sectionTypes, /Collect foreign sections from other industries/);
  assert.match(sectionTypes, /withAddonLock\(\{ \.\.\.s, category: `Andere:/);
  assert.match(picker, /Deine Branche sortiert nur Empfehlungen/);
  assert.match(picker, /Inspiration:/);
  assert.match(picker, /Nur Shop- und Booking-Funktionen benötigen das passende Add-on/);
  assert.match(sectionTypes, /Shop-Addon erforderlich/);
  assert.match(sectionTypes, /Booking-Addon erforderlich/);
});

test('page and collection editors share the complete trusted preview bridge', () => {
  const bridge = source('../app/admin/editor/use-live-preview-message-bridge.ts');
  const pathHelper = source('../app/admin/editor/live-preview-path.ts');
  const pageEditor = source('../app/admin/pages/[id]/page-editor.tsx');
  const itemEditor = source('../app/admin/collections/[key]/[itemId]/item-editor.tsx');
  const itemPage = source('../app/admin/collections/[key]/[itemId]/page.tsx');

  for (const editor of [pageEditor, itemEditor]) {
    assert.match(editor, /useLivePreviewMessageBridge\(\{/);
    assert.doesNotMatch(editor, /setNested|addEventListener\('message'/);
  }
  for (const messageType of ['live-preview-ready', 'section-clicked', 'field-edit', 'rich-edit', 'image-edit', 'icon-edit', 'link-edit', 'color-edit']) {
    assert.match(bridge, new RegExp(`flamingo-${messageType}`));
  }
  assert.match(bridge, /event\.source !== previewWindow/);
  assert.match(bridge, /event\.origin !== window\.location\.origin/);
  assert.match(bridge, /patchPreviewSectionData/);
  assert.match(bridge, /resolveEditableSectionData\(pendingOrStoredData, i18n, activeLocale\)/);
  assert.match(source('../app/admin/editor/section-editor-card.tsx'), /resolveEditableSectionData\(section\.data, i18n, activeLocale\)/);
  assert.match(pathHelper, /BLOCKED_PATH_SEGMENTS/);
  assert.match(itemEditor, /collections, tenantId, previewProducts/);
  assert.match(itemPage, /collections=\{result\.collections\}/);
});

test('AI instructions and both validation modes use cross-industry catalog schemas', () => {
  const instructions = source('../app/api/v1/instructions/route.ts');
  const validate = source('../app/api/v1/content/validate/route.ts');

  assert.match(instructions, /getCatalogSectionSchemas\(auth\.tenant\.industry\)/);
  assert.equal((validate.match(/getCatalogSectionSchemas\(auth\.tenant\.industry\)/g) || []).length, 2);
  assert.match(validate, /getSectionTypesForIndustry\(auth\.tenant\.industry/);
  assert.match(validate, /entry\.requiresAddon === 'shop'/);
  assert.match(validate, /entry\.requiresAddon === 'booking'/);
});

test('industry editor ownership prefers stable identity and rejects ambiguous fallbacks', () => {
  const candidates = [
    { industry: 'hotel', matches: (type: string) => ['hero', 'roomShowcase'].includes(type) },
    { industry: 'wedding', matches: (type: string) => ['hero', 'coupleStory'].includes(type) },
  ];

  assert.equal(resolveIndustryEditorOwner(candidates, { industry: 'hotel', type: 'hero' }), 'hotel');
  assert.equal(resolveIndustryEditorOwner(candidates, { industry: 'tradesman', type: 'roomShowcase' }), 'hotel');
  assert.equal(resolveIndustryEditorOwner(candidates, { industry: 'tradesman', type: 'hero' }), null);
  assert.equal(resolveIndustryEditorOwner(candidates, { industry: 'tradesman', type: 'hero', definitionKey: 'hero.wedding.v1' }), 'wedding');
  assert.equal(resolveIndustryEditorOwner(candidates, { industry: 'tradesman', type: 'hero', definitionKey: 'faq.wedding.v1' }), null);
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
  const previewNudge = source('../components/admin/preview-nudge.tsx');
  assert.match(card, /data-section-card-id=\{section\.id\}/);
  assert.match(previewNudge, /hidden sm:block/);
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
