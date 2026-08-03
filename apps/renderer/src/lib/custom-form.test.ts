import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';
import { PDFDocument } from 'pdf-lib';
import { customFormConfigSchema, isCustomFormFieldVisible, parseCustomFormConfig, parseCustomFormRenderConfig, resolveCustomFormConfigFromSnapshot, validateCustomFormValues, type CustomFormConfig } from './custom-form';
import { buildCustomFormPdfFilename, renderCustomFormPdf } from './custom-form-pdf';
import { CustomFormDeliveryUncertainError, deliverCustomForm, type CustomFormMail } from './custom-form-delivery';
import { fingerprintCustomFormRequest, runCustomFormClaimedAction, type CustomFormDeliveryClaim } from './custom-form-idempotency';
import { createRendererContactActionIdentity, rendererContactRequestHeaders } from './renderer-contact-client-security';
import type { Snapshot } from './snapshot';

const formRouteSource = readFileSync(new URL('../app/api/forms/[formKey]/route.ts', import.meta.url), 'utf8');
const formClientSource = readFileSync(new URL('../templates/shared/custom-form.tsx', import.meta.url), 'utf8');
const deliveryMigrationSource = readFileSync(new URL('../../../../packages/db/drizzle/0025_custom_form_delivery_idempotency.sql', import.meta.url), 'utf8');

function config(policy: 'live' | 'dry-run' = 'dry-run'): CustomFormConfig {
  return customFormConfigSchema.parse({
    formKey: 'anamnese', title: 'Anamnese', deliveryPolicy: policy, emailField: 'email', firstNameField: 'first_name', lastNameField: 'last_name',
    groups: [
      { id: 'person', title: 'Person', fields: [
        { id: 'first_name', label: 'Vorname', type: 'text', required: true, width: 'half' },
        { id: 'last_name', label: 'Nachname', type: 'text', required: true, width: 'half' },
        { id: 'email', label: 'E-Mail', type: 'email', required: true, width: 'full' },
        { id: 'smoking', label: 'Rauchen', type: 'boolean-details', required: true, detailsRequired: true, width: 'full' },
        { id: 'per_day', label: 'Menge', type: 'number', required: true, min: 1, max: 100, condition: { field: 'smoking', equals: true }, width: 'full' },
        { id: 'consent', label: 'Einwilligung', type: 'checkbox', required: true, width: 'full' },
      ] },
    ],
  });
}

function validValues() {
  return { first_name: 'Ada', last_name: 'Lovelace', email: 'ada@example.com', smoking: { answer: true, details: '5 pro Tag' }, per_day: 5, consent: true };
}

describe('custom form contract', () => {
  it('accepts the trusted preview marker only at the rendering boundary', () => {
    assert.equal(parseCustomFormConfig({ ...config(), _isSectionPreview: true }).success, false);
    assert.equal(parseCustomFormRenderConfig({ ...config(), _isSectionPreview: true }).success, true);
  });

  it('rejects duplicate field ids, missing selection options and unknown condition targets', () => {
    const result = customFormConfigSchema.safeParse({ formKey: 'x', title: 'X', emailField: 'email', groups: [{ id: 'g', title: 'G', fields: [
      { id: 'email', label: 'E-Mail', type: 'email' }, { id: 'email', label: 'Doppelt', type: 'select', condition: { field: 'missing', equals: 'x' } },
    ] }] });
    assert.equal(result.success, false);
    if (!result.success) assert.match(result.error.issues.map(issue => issue.message).join(' '), /Optionen|mehrfach|unbekannt/);
  });

  it('evaluates boolean conditions and validates only visible configured fields', () => {
    const current = config();
    const amount = current.groups[0].fields.find(field => field.id === 'per_day')!;
    assert.equal(isCustomFormFieldVisible(amount, { smoking: { answer: false } }), false);
    assert.equal(isCustomFormFieldVisible(amount, { smoking: { answer: true } }), true);

    const hidden = validateCustomFormValues(current, { ...validValues(), smoking: { answer: false }, per_day: undefined });
    assert.equal(hidden.success, true);
    const missingDetail = validateCustomFormValues(current, { ...validValues(), smoking: { answer: true, details: '' } });
    assert.equal(missingDetail.success, false);
    const unknown = validateCustomFormValues(current, { ...validValues(), injectedRecipient: 'attacker@example.com' });
    assert.equal(unknown.success, false);
  });

  it('resolves only a visible customForm on a visible page', () => {
    const snapshot: Snapshot = { generatedAt: new Date().toISOString(), pages: [{ id: 'p', slug: 'patienteninfo', title: 'Patienteninfo', visible: true, sections: [{ id: 's', type: 'customForm', visible: true, variant: null, container: 'default', spacingTop: 'm', spacingBottom: 'm', anchorId: null, data: config() }] }] };
    assert.equal(resolveCustomFormConfigFromSnapshot(snapshot, 'anamnese')?.pageSlug, 'patienteninfo');
    snapshot.pages[0].visible = false;
    assert.equal(resolveCustomFormConfigFromSnapshot(snapshot, 'anamnese'), null);
  });
});

describe('custom form PDF and delivery', () => {
  it('renders a readable PDF and a safe patient-specific filename', async () => {
    const bytes = await renderCustomFormPdf({ config: config(), values: validValues(), practiceName: 'Praxis für Zahnmedizin', createdAt: new Date('2026-08-03T10:00:00Z') });
    assert.equal(bytes.subarray(0, 4).toString(), '%PDF');
    assert.ok((await PDFDocument.load(bytes)).getPageCount() >= 1);
    assert.equal(buildCustomFormPdfFilename(config(), validValues(), new Date('2026-08-03T10:00:00Z')), 'formular-ada-lovelace-2026-08-03.pdf');
  });

  it('dry-run performs no context lookup, persistence or SMTP work', async () => {
    let liveContextCalls = 0;
    let smtpCalls = 0;
    let dbWrites = 0;
    const result = await deliverCustomForm({ config: config('dry-run'), values: validValues(), email: 'ada@example.com', resolveLiveContext: async () => {
      liveContextCalls += 1; dbWrites += 1;
      return { practiceName: 'Praxis', practiceEmail: 'praxis@example.com', fromAddress: 'smtp@example.com', sendMail: async () => { smtpCalls += 1; } };
    } });
    assert.deepEqual({ result, liveContextCalls, smtpCalls, dbWrites }, { result: { success: true, dryRun: true }, liveContextCalls: 0, smtpCalls: 0, dbWrites: 0 });
    assert.ok(formRouteSource.indexOf("deliveryPolicy === 'dry-run'") < formRouteSource.indexOf('claimCustomFormDelivery(deliveryIdentity)'));
    assert.ok(formRouteSource.indexOf("deliveryPolicy === 'dry-run'") < formRouteSource.indexOf('await consumeRendererContactRateRules'));
    assert.ok(formRouteSource.indexOf("deliveryPolicy === 'dry-run'") < formRouteSource.indexOf('await getEffectiveSmtp'));
  });

  it('live mode sends exactly two fake messages with the same PDF', async () => {
    const messages: CustomFormMail[] = [];
    const result = await deliverCustomForm({ config: config('live'), values: validValues(), email: 'ada@example.com', createdAt: new Date('2026-08-03T10:00:00Z'), resolveLiveContext: async () => ({
      practiceName: 'Praxis', practiceEmail: 'praxis@example.com', fromAddress: 'smtp@example.com', sendMail: async mail => { messages.push(mail); },
    }) });
    assert.deepEqual(result, { success: true, dryRun: false });
    assert.equal(messages.length, 2);
    assert.equal(messages[0].to.address, 'praxis@example.com');
    assert.equal(messages[0].replyTo.address, 'ada@example.com');
    assert.equal(messages[1].to.address, 'ada@example.com');
    assert.equal(messages[1].replyTo.address, 'praxis@example.com');
    assert.equal(messages[0].attachments.length, 1);
    assert.deepEqual(messages[0].attachments[0].content, messages[1].attachments[0].content);
  });

  it('records a partial delivery and never retries the already-sent practice message', async () => {
    const transitions: string[] = [];
    let sendCalls = 0;
    await assert.rejects(
      () => deliverCustomForm({
        config: config('live'),
        values: validValues(),
        email: 'ada@example.com',
        resolveLiveContext: async () => ({
          practiceName: 'Praxis',
          practiceEmail: 'praxis@example.com',
          fromAddress: 'smtp@example.com',
          sendMail: async () => {
            sendCalls += 1;
            if (sendCalls === 2) throw new Error('fake SMTP uncertainty');
          },
        }),
        deliveryObserver: {
          beforeSend: async kind => { transitions.push(`sending:${kind}`); },
          afterSend: async kind => { transitions.push(`sent:${kind}`); },
          onUncertain: async kind => { transitions.push(`uncertain:${kind}`); },
        },
      }),
      (error: unknown) => error instanceof CustomFormDeliveryUncertainError && error.kind === 'confirmation',
    );
    assert.equal(sendCalls, 2);
    assert.deepEqual(transitions, [
      'sending:practice',
      'sent:practice',
      'sending:confirmation',
      'uncertain:confirmation',
    ]);
  });

  it('claims live delivery before rate-limit and mail work without persisting health payloads', () => {
    const claim = formRouteSource.indexOf('claimCustomFormDelivery(deliveryIdentity)');
    const rateLimit = formRouteSource.indexOf('await consumeRendererContactRateRules');
    const delivery = formRouteSource.indexOf('await deliverCustomForm');
    assert.ok(claim >= 0 && rateLimit > claim && delivery > rateLimit);
    assert.doesNotMatch(deliveryMigrationSource, /\b(email|payload|values|answers|pdf|message|name)\b/i);
    assert.match(deliveryMigrationSource, /"request_hash" varchar\(64\)/);
    assert.match(deliveryMigrationSource, /UNIQUE INDEX[\s\S]*"tenant_id", "idempotency_key"/i);
  });

  it('deduplicates an identical live request and rejects a key conflict before mail', async () => {
    const key = '3d10ab45-8183-4c69-9ee5-5bfb045739e3';
    const firstHash = fingerprintCustomFormRequest({ tenantId: 'tenant', formKey: 'anamnese', values: validValues() });
    const changedHash = fingerprintCustomFormRequest({ tenantId: 'tenant', formKey: 'anamnese', values: { ...validValues(), last_name: 'Byron' } });
    let stored: { key: string; hash: string; complete: boolean } | null = null;
    let mailCalls = 0;

    const attempt = async (hash: string) => runCustomFormClaimedAction({
      claim: async (): Promise<CustomFormDeliveryClaim> => {
        if (!stored) {
          stored = { key, hash, complete: false };
          return { state: 'acquired' };
        }
        if (stored.hash !== hash) return { state: 'conflict' };
        return stored.complete ? { state: 'duplicate' } : { state: 'processing' };
      },
      execute: async () => {
        mailCalls += 2;
        stored!.complete = true;
        return 'sent';
      },
    });

    assert.deepEqual(await attempt(firstHash), { state: 'executed', value: 'sent' });
    assert.deepEqual(await attempt(firstHash), { state: 'duplicate' });
    assert.deepEqual(await attempt(changedHash), { state: 'conflict' });
    assert.equal(mailCalls, 2);
  });

  it('keeps one browser header across an unchanged retry and rotates on edit or success', () => {
    const payload = { values: validValues(), _website: '', page: '/patienteninfo' };
    const first = createRendererContactActionIdentity(payload);
    const retry = createRendererContactActionIdentity(payload, first);
    const changed = createRendererContactActionIdentity({ ...payload, values: { ...validValues(), last_name: 'Byron' } }, retry);
    assert.equal(rendererContactRequestHeaders(first.idempotencyKey)['Idempotency-Key'], rendererContactRequestHeaders(retry.idempotencyKey)['Idempotency-Key']);
    assert.notEqual(changed.idempotencyKey, first.idempotencyKey);
    assert.match(formClientSource, /createRendererContactActionIdentity\(payload, actionIdentity\.current\)/);
    assert.match(formClientSource, /headers: rendererContactRequestHeaders\(actionIdentity\.current\.idempotencyKey\)/);
    assert.match(formClientSource, /body: actionIdentity\.current\.serializedPayload/);
    assert.ok(formClientSource.indexOf("setStatus('success')") < formClientSource.indexOf('actionIdentity.current = null', formClientSource.indexOf("setStatus('success')")));
  });
});
