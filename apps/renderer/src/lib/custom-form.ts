import { z } from 'zod';
import type { Snapshot } from './snapshot';

export const CUSTOM_FORM_FIELD_TYPES = [
  'text', 'email', 'tel', 'textarea', 'select', 'radio', 'checkbox', 'date', 'number', 'boolean-details',
] as const;

export type CustomFormFieldType = typeof CUSTOM_FORM_FIELD_TYPES[number];
export type CustomFormValue = string | number | boolean | string[] | { answer: boolean; details?: string };

const identifier = z.string().trim().min(1).max(80).regex(/^[a-z][a-z0-9_-]*$/i);
const safeText = (maximum: number) => z.string().trim().min(1).max(maximum);
const optionSchema = z.object({ value: safeText(120), label: safeText(180) }).strict();
const conditionSchema = z.object({
  field: identifier,
  equals: z.union([z.string().max(200), z.boolean(), z.number().finite()]).optional(),
  includes: z.string().max(200).optional(),
}).strict().refine(value => value.equals !== undefined || value.includes !== undefined, {
  message: 'Eine Bedingung benötigt equals oder includes.',
});

export const customFormFieldSchema = z.object({
  id: identifier,
  label: safeText(240),
  type: z.enum(CUSTOM_FORM_FIELD_TYPES),
  required: z.boolean().default(false),
  placeholder: z.string().max(300).optional(),
  helpText: z.string().max(600).optional(),
  options: z.array(optionSchema).max(50).optional(),
  condition: conditionSchema.optional(),
  autocomplete: z.string().max(80).optional(),
  width: z.enum(['full', 'half', 'third']).default('full'),
  maxLength: z.number().int().min(1).max(10_000).optional(),
  min: z.number().finite().optional(),
  max: z.number().finite().optional(),
  detailsLabel: z.string().max(240).optional(),
  detailsPlaceholder: z.string().max(300).optional(),
  detailsRequired: z.boolean().optional(),
}).strict().superRefine((field, context) => {
  if ((field.type === 'select' || field.type === 'radio') && !field.options?.length) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: 'Auswahlfelder benötigen Optionen.', path: ['options'] });
  }
  if (field.min !== undefined && field.max !== undefined && field.min > field.max) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: 'Der Minimalwert darf nicht größer als der Maximalwert sein.', path: ['min'] });
  }
});

export const customFormGroupSchema = z.object({
  id: identifier,
  title: safeText(240),
  description: z.string().max(1_000).optional(),
  kind: z.enum(['default', 'matrix', 'consent']).default('default'),
  fields: z.array(customFormFieldSchema).min(1).max(80),
}).strict();

export const customFormConfigSchema = z.object({
  formKey: identifier,
  eyebrow: z.string().max(160).optional(),
  title: safeText(240),
  description: z.string().max(2_000).optional(),
  submitLabel: safeText(160).default('Formular sicher übermitteln'),
  successTitle: safeText(240).default('Vielen Dank für Ihre Angaben.'),
  successMessage: safeText(1_000).default('Wir haben Ihre Angaben sicher erhalten.'),
  privacyHref: z.string().trim().min(1).max(500).default('/datenschutz'),
  privacyLabel: z.string().trim().min(1).max(160).default('Datenschutzerklärung'),
  helpText: z.string().max(600).optional(),
  deliveryPolicy: z.enum(['live', 'dry-run']).default('dry-run'),
  pdfTitle: safeText(240).default('Formular'),
  pdfFilename: safeText(160).default('formular'),
  practiceSubject: safeText(240).default('Neues Formular über die Website'),
  confirmationSubject: safeText(240).default('Bestätigung Ihrer Angaben'),
  confirmationText: safeText(2_000).default('Wir bestätigen den Eingang Ihrer Angaben. Eine Kopie finden Sie im PDF-Anhang.'),
  emailField: identifier.default('email'),
  firstNameField: identifier.optional(),
  lastNameField: identifier.optional(),
  groups: z.array(customFormGroupSchema).min(1).max(30),
}).strict().superRefine((config, context) => {
  const ids = new Set<string>();
  for (const [groupIndex, group] of config.groups.entries()) {
    for (const [fieldIndex, field] of group.fields.entries()) {
      if (ids.has(field.id)) {
        context.addIssue({ code: z.ZodIssueCode.custom, message: `Feld-ID „${field.id}“ ist mehrfach vergeben.`, path: ['groups', groupIndex, 'fields', fieldIndex, 'id'] });
      }
      ids.add(field.id);
    }
  }
  if (!ids.has(config.emailField)) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: 'Das konfigurierte E-Mail-Feld fehlt.', path: ['emailField'] });
  }
  for (const [groupIndex, group] of config.groups.entries()) {
    for (const [fieldIndex, field] of group.fields.entries()) {
      if (field.condition && !ids.has(field.condition.field)) {
        context.addIssue({ code: z.ZodIssueCode.custom, message: 'Die Bedingung verweist auf ein unbekanntes Feld.', path: ['groups', groupIndex, 'fields', fieldIndex, 'condition'] });
      }
    }
  }
});

export type CustomFormField = z.infer<typeof customFormFieldSchema>;
export type CustomFormGroup = z.infer<typeof customFormGroupSchema>;
export type CustomFormConfig = z.infer<typeof customFormConfigSchema>;

export function parseCustomFormConfig(value: unknown) {
  return customFormConfigSchema.safeParse(value);
}

/**
 * The section preview adds renderer-only metadata to every data object. Keep
 * the persisted/server contract strict, but remove this one trusted rendering
 * marker before validating data in the React section.
 */
export function parseCustomFormRenderConfig(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return parseCustomFormConfig(value);
  const { _isSectionPreview: _previewMarker, ...config } = value as Record<string, unknown>;
  return parseCustomFormConfig(config);
}

export function resolveCustomFormConfigFromSnapshot(snapshot: Snapshot | null, formKey: string) {
  if (!snapshot) return null;
  for (const page of snapshot.pages) {
    if (!page.visible) continue;
    for (const section of page.sections) {
      if (!section.visible || section.type !== 'customForm') continue;
      const parsed = parseCustomFormConfig(section.data);
      if (parsed.success && parsed.data.formKey === formKey) return { config: parsed.data, pageSlug: page.slug, sectionId: section.id };
    }
  }
  return null;
}

export function isCustomFormFieldVisible(field: CustomFormField, values: Record<string, CustomFormValue | undefined>) {
  if (!field.condition) return true;
  const source = values[field.condition.field];
  if (field.condition.includes !== undefined) {
    return Array.isArray(source) && source.includes(field.condition.includes);
  }
  if (typeof source === 'object' && source && !Array.isArray(source) && 'answer' in source) {
    return source.answer === field.condition.equals;
  }
  return source === field.condition.equals;
}

export type CustomFormValidationResult =
  | { success: true; values: Record<string, CustomFormValue>; email: string }
  | { success: false; fieldErrors: Record<string, string>; error: string };

const emailPattern = /^[^\s@<>\r\n]+@[^\s@<>\r\n]+\.[^\s@<>\r\n]+$/;
const phonePattern = /^[+()\d\s./-]{3,80}$/;

export function validateCustomFormValues(config: CustomFormConfig, input: unknown): CustomFormValidationResult {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return { success: false, fieldErrors: {}, error: 'Ungültige Formulardaten.' };
  }
  const submitted = input as Record<string, unknown>;
  const configuredFields = config.groups.flatMap(group => group.fields);
  const configuredIds = new Set(configuredFields.map(field => field.id));
  if (Object.keys(submitted).some(key => !configuredIds.has(key))) {
    return { success: false, fieldErrors: {}, error: 'Das Formular enthält unbekannte Felder.' };
  }

  const values: Record<string, CustomFormValue> = {};
  const errors: Record<string, string> = {};
  const visibilityValues = submitted as Record<string, CustomFormValue | undefined>;
  for (const field of configuredFields) {
    if (!isCustomFormFieldVisible(field, visibilityValues)) continue;
    const raw = submitted[field.id];
    const requiredMessage = `Bitte füllen Sie „${field.label}“ aus.`;

    if (field.type === 'checkbox') {
      if (field.options?.length) {
        if (raw !== undefined && (!Array.isArray(raw) || raw.some(value => typeof value !== 'string'))) errors[field.id] = 'Bitte wählen Sie nur gültige Optionen.';
        const selection = Array.isArray(raw) ? raw.filter((value): value is string => typeof value === 'string') : [];
        const allowed = new Set(field.options.map(option => option.value));
        if (selection.some(value => !allowed.has(value))) errors[field.id] = 'Bitte wählen Sie nur gültige Optionen.';
        if (field.required && selection.length === 0) errors[field.id] = requiredMessage;
        if (!errors[field.id]) values[field.id] = selection;
      } else {
        if (raw !== undefined && typeof raw !== 'boolean') errors[field.id] = 'Ungültige Bestätigung.';
        const checked = raw === true;
        if (field.required && !checked) errors[field.id] = requiredMessage;
        if (!errors[field.id]) values[field.id] = checked;
      }
      continue;
    }

    if (field.type === 'boolean-details') {
      if (raw !== undefined && (!raw || typeof raw !== 'object' || Array.isArray(raw))) {
        errors[field.id] = 'Bitte wählen Sie Ja oder Nein.';
        continue;
      }
      const entry = (raw || {}) as { answer?: unknown; details?: unknown };
      if (typeof entry.answer !== 'boolean') {
        if (field.required) errors[field.id] = 'Bitte wählen Sie Ja oder Nein.';
        continue;
      }
      const details = typeof entry.details === 'string' ? entry.details.trim() : '';
      const maximum = field.maxLength ?? 2_000;
      if (details.length > maximum) errors[field.id] = `Die ergänzende Angabe darf höchstens ${maximum} Zeichen enthalten.`;
      if (entry.answer && field.detailsRequired && !details) errors[field.id] = `Bitte ergänzen Sie die Angabe zu „${field.label}“.`;
      if (!errors[field.id]) values[field.id] = { answer: entry.answer, ...(details && { details }) };
      continue;
    }

    if (field.type === 'number') {
      if (raw === undefined || raw === '') {
        if (field.required) errors[field.id] = requiredMessage;
        continue;
      }
      const number = typeof raw === 'number' ? raw : Number(raw);
      if (!Number.isFinite(number)) errors[field.id] = 'Bitte geben Sie eine gültige Zahl ein.';
      else if (field.min !== undefined && number < field.min) errors[field.id] = `Der Wert muss mindestens ${field.min} betragen.`;
      else if (field.max !== undefined && number > field.max) errors[field.id] = `Der Wert darf höchstens ${field.max} betragen.`;
      else values[field.id] = number;
      continue;
    }

    if (raw !== undefined && typeof raw !== 'string') {
      errors[field.id] = 'Ungültige Eingabe.';
      continue;
    }
    const value = typeof raw === 'string' ? raw.trim() : '';
    if (field.required && !value) errors[field.id] = requiredMessage;
    if (!value) continue;
    const maximum = field.maxLength ?? (field.type === 'textarea' ? 5_000 : 500);
    if (value.length > maximum) errors[field.id] = `Die Eingabe darf höchstens ${maximum} Zeichen enthalten.`;
    if (field.type === 'email' && !emailPattern.test(value)) errors[field.id] = 'Bitte geben Sie eine gültige E-Mail-Adresse ein.';
    if (field.type === 'tel' && !phonePattern.test(value)) errors[field.id] = 'Bitte geben Sie eine gültige Telefonnummer ein.';
    if ((field.type === 'select' || field.type === 'radio') && !field.options?.some(option => option.value === value)) errors[field.id] = 'Bitte wählen Sie eine gültige Option.';
    if (field.type === 'date' && !/^\d{4}-\d{2}-\d{2}$/.test(value)) errors[field.id] = 'Bitte geben Sie ein gültiges Datum ein.';
    if (!errors[field.id]) values[field.id] = value;
  }

  const email = values[config.emailField];
  if (typeof email !== 'string' || !emailPattern.test(email)) errors[config.emailField] ||= 'Bitte geben Sie eine gültige E-Mail-Adresse ein.';
  if (Object.keys(errors).length) return { success: false, fieldErrors: errors, error: 'Bitte prüfen Sie die markierten Felder.' };
  return { success: true, values, email: email as string };
}

export function customFormValueToText(value: CustomFormValue | undefined) {
  if (value === undefined || value === '') return '–';
  if (typeof value === 'boolean') return value ? 'Ja' : 'Nein';
  if (Array.isArray(value)) return value.join(', ') || '–';
  if (typeof value === 'object') return `${value.answer ? 'Ja' : 'Nein'}${value.details ? ` – ${value.details}` : ''}`;
  return String(value);
}
