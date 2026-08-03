import { buildCustomFormPdfFilename, renderCustomFormPdf } from './custom-form-pdf';
import { customFormValueToText, type CustomFormConfig, type CustomFormValue } from './custom-form';
import type { CustomFormDeliveryKind } from './custom-form-idempotency';

export type CustomFormMail = {
  from: { name: string; address: string };
  replyTo: { name: string; address: string };
  to: { name: string; address: string };
  subject: string;
  text: string;
  html: string;
  attachments: Array<{ filename: string; content: Buffer; contentType: 'application/pdf' }>;
  headers: Record<string, string>;
};

export type CustomFormLiveContext = {
  practiceName: string;
  practiceEmail: string;
  fromAddress: string;
  sendMail: (mail: CustomFormMail) => Promise<unknown>;
};

export type CustomFormDeliveryObserver = {
  beforeSend: (kind: CustomFormDeliveryKind) => Promise<void>;
  afterSend: (kind: CustomFormDeliveryKind) => Promise<void>;
  onUncertain: (kind: CustomFormDeliveryKind) => Promise<void>;
};

export class CustomFormDeliveryUncertainError extends Error {
  constructor(public readonly kind: CustomFormDeliveryKind) {
    super(`CUSTOM_FORM_${kind.toUpperCase()}_DELIVERY_UNCERTAIN`);
    this.name = 'CustomFormDeliveryUncertainError';
  }
}

function escapeHtml(value: unknown) {
  return String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function cleanHeader(value: string) {
  return value.replace(/[\r\n]+/g, ' ').trim().slice(0, 240);
}

function template(value: string, name: string) {
  return cleanHeader(value.replace(/\{name\}/g, name));
}

function submissionRows(config: CustomFormConfig, values: Record<string, CustomFormValue>) {
  return config.groups.map(group => ({
    title: group.title,
    fields: group.fields.map(field => ({ label: field.label, value: customFormValueToText(values[field.id]) })),
  }));
}

function practiceMarkup(config: CustomFormConfig, values: Record<string, CustomFormValue>) {
  return submissionRows(config, values).map(group => `<h2 style="font-size:16px;margin:26px 0 10px;color:#163f48">${escapeHtml(group.title)}</h2><table style="width:100%;border-collapse:collapse">${group.fields.map(field => `<tr><th scope="row" style="width:38%;padding:8px 10px;text-align:left;vertical-align:top;border-bottom:1px solid #e5e7eb;font-size:13px;color:#4b5563">${escapeHtml(field.label)}</th><td style="padding:8px 10px;vertical-align:top;border-bottom:1px solid #e5e7eb;font-size:13px;color:#111827">${escapeHtml(field.value).replace(/\n/g, '<br>')}</td></tr>`).join('')}</table>`).join('');
}

export async function deliverCustomForm(input: {
  config: CustomFormConfig;
  values: Record<string, CustomFormValue>;
  email: string;
  resolveLiveContext: () => Promise<CustomFormLiveContext>;
  deliveryObserver?: CustomFormDeliveryObserver;
  createdAt?: Date;
}) {
  if (input.config.deliveryPolicy === 'dry-run') return { success: true as const, dryRun: true as const };

  const context = await input.resolveLiveContext();
  const createdAt = input.createdAt ?? new Date();
  const firstName = input.config.firstNameField ? input.values[input.config.firstNameField] : '';
  const lastName = input.config.lastNameField ? input.values[input.config.lastNameField] : '';
  const patientName = [firstName, lastName].filter(value => typeof value === 'string' && value.trim()).join(' ') || 'Patientin/Patient';
  const pdf = await renderCustomFormPdf({ config: input.config, values: input.values, practiceName: context.practiceName, createdAt });
  const filename = buildCustomFormPdfFilename(input.config, input.values, createdAt);
  const attachment = { filename, content: pdf, contentType: 'application/pdf' as const };
  const rows = submissionRows(input.config, input.values);
  const textRows = rows.flatMap(group => [`\n${group.title}`, ...group.fields.map(field => `${field.label}: ${field.value}`)]).join('\n');
  const shell = (title: string, body: string) => `<!doctype html><html lang="de"><head><meta charset="utf-8"></head><body style="margin:0;background:#f4f6f6;font-family:Arial,sans-serif"><main style="max-width:680px;margin:0 auto;padding:30px 16px"><section style="background:#fff;border:1px solid #e2e7e8;padding:28px"><h1 style="font-size:21px;margin:0 0 16px;color:#102f36">${escapeHtml(title)}</h1>${body}</section></main></body></html>`;

  const messages: Array<{ kind: CustomFormDeliveryKind; mail: CustomFormMail }> = [
    { kind: 'practice', mail: {
      from: { name: `${context.practiceName} · Website`, address: context.fromAddress },
      replyTo: { name: cleanHeader(patientName), address: input.email },
      to: { name: context.practiceName, address: context.practiceEmail },
      subject: template(input.config.practiceSubject, patientName),
      text: `${input.config.pdfTitle}\n${textRows}`,
      html: shell(input.config.pdfTitle, practiceMarkup(input.config, input.values)),
      attachments: [attachment],
      headers: { 'X-Mailer': 'Flamingo CMS Custom Form' },
    } },
    { kind: 'confirmation', mail: {
      from: { name: context.practiceName, address: context.fromAddress },
      replyTo: { name: context.practiceName, address: context.practiceEmail },
      to: { name: cleanHeader(patientName), address: input.email },
      subject: template(input.config.confirmationSubject, patientName),
      text: input.config.confirmationText,
      html: shell(input.config.confirmationSubject, `<p style="font-size:15px;line-height:1.65;color:#374151">${escapeHtml(input.config.confirmationText).replace(/\n/g, '<br>')}</p><p style="font-size:13px;line-height:1.55;color:#6b7280">Ihre PDF-Kopie finden Sie im Anhang.</p>`),
      attachments: [attachment],
      headers: { 'X-Mailer': 'Flamingo CMS Custom Form Confirmation' },
    } },
  ];

  // The two channels are deliberately sequential. Each transition is persisted
  // before and after SMTP so a retry cannot blindly send either message twice.
  for (const message of messages) {
    await input.deliveryObserver?.beforeSend(message.kind);
    try {
      await context.sendMail(message.mail);
      await input.deliveryObserver?.afterSend(message.kind);
    } catch {
      try {
        await input.deliveryObserver?.onUncertain(message.kind);
      } catch {
        // A row left in `sending` is treated as uncertain once stale. Never
        // retry an SMTP operation merely because recording its outcome failed.
      }
      throw new CustomFormDeliveryUncertainError(message.kind);
    }
  }
  return { success: true as const, dryRun: false as const };
}
