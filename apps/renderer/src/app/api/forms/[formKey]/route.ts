import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { globalSettings } from '@flamingo/db';
import { getDb } from '@/lib/db';
import { CustomFormDeliveryUncertainError, deliverCustomForm } from '@/lib/custom-form-delivery';
import {
  claimCustomFormDelivery,
  completeCustomFormDelivery,
  fingerprintCustomFormRequest,
  markCustomFormDeliveryRetryable,
  markCustomFormDeliverySending,
  markCustomFormDeliverySent,
  markCustomFormDeliveryUncertain,
  runCustomFormClaimedAction,
} from '@/lib/custom-form-idempotency';
import { resolveCustomFormConfigFromSnapshot, validateCustomFormValues } from '@/lib/custom-form';
import {
  consumeRendererContactRateRules,
  getRendererContactClientAddress,
  isTrustedRendererContactOrigin,
  parseRendererContactIdempotencyKey,
  readBoundedRendererContactJson,
  rendererContactRateRules,
  RendererContactBodyInvalidError,
  RendererContactBodyTooLargeError,
} from '@/lib/renderer-contact-security';
import { getActiveSnapshot, resolveTenant } from '@/lib/snapshot';
import { createHardenedRendererSmtpTransport, getEffectiveSmtp, isValidSmtpAddress } from '@/lib/smtp';

export const runtime = 'nodejs';
const MAX_CUSTOM_FORM_BYTES = 180_000;

function json(body: Record<string, unknown>, status = 200, headers?: Record<string, string>) {
  return NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store', ...headers } });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ formKey: string }> }) {
  if (req.headers.get('content-type')?.split(';')[0]?.trim().toLowerCase() !== 'application/json') return json({ error: 'Content-Type wird nicht unterstützt.' }, 415);
  if (!isTrustedRendererContactOrigin(req)) return json({ error: 'Ungültiger Request-Ursprung.' }, 403);

  let body: unknown;
  try {
    body = await readBoundedRendererContactJson(req, MAX_CUSTOM_FORM_BYTES);
  } catch (error) {
    if (error instanceof RendererContactBodyTooLargeError) return json({ error: 'Die Anfrage ist zu groß.' }, 413);
    if (error instanceof RendererContactBodyInvalidError) return json({ error: 'Ungültige Eingabe.' }, 400);
    return json({ error: 'Ungültige Eingabe.' }, 400);
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) return json({ error: 'Ungültige Eingabe.' }, 400);
  const record = body as Record<string, unknown>;
  if (typeof record._website === 'string' && record._website.trim()) return json({ success: true });
  const idempotencyKey = parseRendererContactIdempotencyKey(req.headers.get('idempotency-key'));
  if (!idempotencyKey) return json({ error: 'Ein gültiger Idempotency-Key ist erforderlich.' }, 400);

  try {
    const tenantId = await resolveTenant();
    if (!tenantId) return json({ error: 'Formular nicht gefunden.' }, 404);
    const { formKey } = await params;
    if (!/^[a-z][a-z0-9_-]{0,79}$/i.test(formKey)) return json({ error: 'Formular nicht gefunden.' }, 404);
    const resolved = resolveCustomFormConfigFromSnapshot(await getActiveSnapshot(tenantId), formKey);
    if (!resolved) return json({ error: 'Formular nicht gefunden.' }, 404);
    const submission = validateCustomFormValues(resolved.config, record.values);
    if (!submission.success) return json({ error: submission.error, fieldErrors: submission.fieldErrors }, 400);

    // This branch is intentionally before rate-limit consumption, SMTP lookup,
    // PDF generation, persistence and transport. Dry-run cannot emit e-mail or
    // write health data, even when the browser payload attempts to override it.
    if (resolved.config.deliveryPolicy === 'dry-run') return json({ success: true, dryRun: true });

    const requestHash = fingerprintCustomFormRequest({
      tenantId,
      formKey,
      values: submission.values,
      page: typeof record.page === 'string' ? record.page.slice(0, 200) : '',
    });
    const deliveryIdentity = { tenantId, formKey, idempotencyKey, requestHash };
    const action = await runCustomFormClaimedAction({
      claim: () => claimCustomFormDelivery(deliveryIdentity),
      execute: async () => {
        const makeRetryable = async (errorCode: 'RATE_LIMITED' | 'RATE_LIMIT_UNAVAILABLE' | 'SMTP_NOT_CONFIGURED' | 'PREPARATION_FAILED') => {
          await markCustomFormDeliveryRetryable({ ...deliveryIdentity, errorCode }).catch(error => {
            console.error('[custom-form] could not mark a pre-delivery claim retryable', error instanceof Error ? error.name : 'UnknownError');
          });
        };

        let denied;
        try {
          denied = await consumeRendererContactRateRules(rendererContactRateRules(tenantId, getRendererContactClientAddress(req.headers), submission.email));
        } catch {
          await makeRetryable('RATE_LIMIT_UNAVAILABLE');
          return json({ error: 'Das Formular ist vorübergehend nicht verfügbar.' }, 503, { 'Retry-After': '60' });
        }
        if (denied) {
          await makeRetryable('RATE_LIMITED');
          return json({ error: 'Zu viele Anfragen. Bitte versuchen Sie es später erneut.' }, 429, { 'Retry-After': String(denied.retryAfterSeconds) });
        }

        try {
          await deliverCustomForm({
            config: resolved.config,
            values: submission.values,
            email: submission.email,
            deliveryObserver: {
              beforeSend: kind => markCustomFormDeliverySending({ ...deliveryIdentity, kind }),
              afterSend: kind => markCustomFormDeliverySent({ ...deliveryIdentity, kind }),
              onUncertain: kind => markCustomFormDeliveryUncertain({ ...deliveryIdentity, kind }),
            },
            resolveLiveContext: async () => {
              const effectiveSmtp = await getEffectiveSmtp(tenantId);
              if (!effectiveSmtp) throw new Error('CUSTOM_FORM_SMTP_NOT_CONFIGURED');
              const [settings] = await getDb().select({ brand: globalSettings.brand, autoResponse: globalSettings.autoResponse }).from(globalSettings).where(eq(globalSettings.tenantId, tenantId)).limit(1);
              const brand = (settings?.brand || {}) as Record<string, unknown>;
              const autoResponse = (settings?.autoResponse || {}) as Record<string, unknown>;
              const configuredRecipient = typeof autoResponse.notificationEmail === 'string' ? autoResponse.notificationEmail.trim() : '';
              const practiceEmail = configuredRecipient && isValidSmtpAddress(configuredRecipient) ? configuredRecipient : effectiveSmtp.from;
              const practiceName = typeof brand.companyName === 'string' && brand.companyName.trim() ? brand.companyName.trim().slice(0, 180) : 'Praxis';
              const transporter = createHardenedRendererSmtpTransport(effectiveSmtp);
              return { practiceName, practiceEmail, fromAddress: effectiveSmtp.from, sendMail: mail => transporter.sendMail(mail) };
            },
          });
          await completeCustomFormDelivery(deliveryIdentity);
          return json({ success: true, dryRun: false });
        } catch (error) {
          if (error instanceof CustomFormDeliveryUncertainError) {
            const deliveryState = error.kind === 'confirmation' ? 'partial' : 'uncertain';
            return json({ success: true, dryRun: false, deliveryState, deliveryUncertain: true }, 202);
          }
          await makeRetryable(error instanceof Error && error.message === 'CUSTOM_FORM_SMTP_NOT_CONFIGURED' ? 'SMTP_NOT_CONFIGURED' : 'PREPARATION_FAILED');
          throw error;
        }
      },
    });

    if (action.state === 'executed') return action.value;
    if (action.state === 'duplicate') return json({ success: true, dryRun: false, deduplicated: true });
    if (action.state === 'conflict') return json({ error: 'Der Idempotency-Key wurde bereits für eine andere Anfrage verwendet.' }, 409);
    if (action.state === 'processing') return json({ error: 'Diese Übermittlung wird bereits verarbeitet. Bitte versuchen Sie es gleich erneut.', retryWithSameIdempotencyKey: true }, 409);
    return json({
      success: true,
      dryRun: false,
      deduplicated: true,
      deliveryState: action.state,
      deliveryUncertain: true,
    }, 202);
  } catch (error) {
    if (error instanceof Error && error.message === 'CUSTOM_FORM_SMTP_NOT_CONFIGURED') return json({ error: 'Das Formular ist vorübergehend nicht verfügbar.' }, 503);
    console.error('[custom-form] delivery failed without form values', error instanceof Error ? error.name : 'UnknownError');
    return json({ error: 'Die Übermittlung war nicht möglich. Bitte versuchen Sie es erneut.' }, 500);
  }
}
