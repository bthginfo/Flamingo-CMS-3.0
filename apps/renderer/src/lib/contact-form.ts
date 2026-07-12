export const CONTACT_FORM_FIELD_TYPES = ['text', 'email', 'tel', 'textarea', 'select'] as const;

export type ContactFormFieldType = (typeof CONTACT_FORM_FIELD_TYPES)[number];

export type ContactFormFieldDefinition = {
  name: string;
  label: string;
  type: ContactFormFieldType;
  placeholder?: string;
  required?: boolean;
  options?: string[];
  halfWidth?: boolean;
};

export type StoredContactPayload = {
  version: 1;
  fields: Array<{
    name: string;
    label: string;
    type: ContactFormFieldType;
    value: string;
  }>;
  context?: {
    source?: string;
    summary?: string;
  };
};

export type ContactAutoResponse = {
  enabled: boolean;
  subject: string;
  body: string;
  notificationEmail?: string;
};

export const DEFAULT_CONTACT_FORM_FIELDS: ContactFormFieldDefinition[] = [
  { name: 'name', label: 'Name', type: 'text', placeholder: 'Ihr Name', required: true, halfWidth: true },
  { name: 'email', label: 'E-Mail', type: 'email', placeholder: 'E-Mail-Adresse', required: true, halfWidth: true },
  { name: 'phone', label: 'Telefon', type: 'tel', placeholder: 'Telefon (optional)' },
  { name: 'message', label: 'Nachricht', type: 'textarea', placeholder: 'Wie können wir Ihnen helfen?', required: true },
];

const MAX_FIELDS = 20;
const MAX_FIELD_NAME_LENGTH = 64;
const MAX_LABEL_LENGTH = 100;
const MAX_OPTION_LENGTH = 200;
const MAX_OPTIONS = 50;
const MAX_VALUE_LENGTH = 5000;
const FIELD_NAME_PATTERN = /^[A-Za-z][A-Za-z0-9_]*$/;
const EMAIL_PATTERN = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;

type ValidationResult =
  | { success: true; fields: ContactFormFieldDefinition[] }
  | { success: false; errors: string[] };

type SubmissionResult =
  | {
    success: true;
    values: Record<string, string>;
    payload: StoredContactPayload;
    page: string | null;
  }
  | { success: false; error: string };

type AutoResponseValidationResult =
  | { success: true; value: ContactAutoResponse }
  | { success: false; error: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function cleanString(value: unknown, maxLength: number): string {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function isContactFormFieldType(value: unknown): value is ContactFormFieldType {
  return typeof value === 'string' && CONTACT_FORM_FIELD_TYPES.includes(value as ContactFormFieldType);
}

function humanizeFieldName(name: string): string {
  return name
    .replace(/_/g, ' ')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/^./, character => character.toUpperCase());
}

function normalizeOptions(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const seen = new Set<string>();
  const options: string[] = [];
  for (const item of value) {
    const option = cleanString(item, MAX_OPTION_LENGTH);
    const key = option.toLocaleLowerCase('de-DE');
    if (!option || seen.has(key)) continue;
    seen.add(key);
    options.push(option);
    if (options.length >= MAX_OPTIONS) break;
  }
  return options.length > 0 ? options : undefined;
}

function normalizeField(value: unknown): ContactFormFieldDefinition | null {
  if (!isRecord(value)) return null;
  const name = cleanString(value.name, MAX_FIELD_NAME_LENGTH);
  if (!FIELD_NAME_PATTERN.test(name)) return null;
  const type = isContactFormFieldType(value.type) ? value.type : 'text';
  const label = cleanString(value.label, MAX_LABEL_LENGTH) || humanizeFieldName(name);
  const placeholder = cleanString(value.placeholder, MAX_OPTION_LENGTH);
  const options = type === 'select' ? normalizeOptions(value.options) : undefined;
  return {
    name,
    label,
    type,
    ...(placeholder && { placeholder }),
    ...(value.required === true && { required: true }),
    ...(options && { options }),
    ...(value.halfWidth === true && { halfWidth: true }),
  };
}

/**
 * Repairs legacy/untrusted form configurations for rendering. The two
 * canonical identity fields always exist exactly once and remain compatible
 * with the public contact endpoint.
 */
export function normalizeContactFormFields(value: unknown): ContactFormFieldDefinition[] {
  const source = Array.isArray(value) && value.length > 0 ? value : DEFAULT_CONTACT_FORM_FIELDS;
  const result: ContactFormFieldDefinition[] = [];
  const seen = new Set<string>();

  for (const candidate of source) {
    const field = normalizeField(candidate);
    if (!field) continue;
    const semanticName = field.name.toLocaleLowerCase('en-US');
    if (seen.has(semanticName)) continue;
    seen.add(semanticName);

    if (semanticName === 'name') {
      result.push({ ...field, name: 'name', type: 'text', required: true });
    } else if (semanticName === 'email') {
      result.push({ ...field, name: 'email', type: 'email', required: true });
    } else {
      result.push(field);
    }
    if (result.length >= MAX_FIELDS) break;
  }

  const nameField = result.find(field => field.name === 'name');
  const emailField = result.find(field => field.name === 'email');
  if (!nameField) result.unshift({ ...DEFAULT_CONTACT_FORM_FIELDS[0] });
  if (!emailField) result.splice(Math.min(1, result.length), 0, { ...DEFAULT_CONTACT_FORM_FIELDS[1] });

  return result.slice(0, MAX_FIELDS);
}

export function validateContactAutoResponse(value: unknown): AutoResponseValidationResult {
  if (!isRecord(value)) return { success: false, error: 'Ungültige Auto-Antwort.' };
  const enabled = value.enabled === true;
  const subject = cleanString(value.subject, 200).replace(/[\r\n]+/g, ' ');
  const body = cleanString(value.body, 10_000);
  const notificationEmail = cleanString(value.notificationEmail, 320);

  if (enabled && (!subject || !body)) {
    return { success: false, error: 'Für die aktive Auto-Antwort werden Betreff und Nachricht benötigt.' };
  }
  if (notificationEmail && !EMAIL_PATTERN.test(notificationEmail)) {
    return { success: false, error: 'Die Benachrichtigungs-E-Mail ist ungültig.' };
  }

  return {
    success: true,
    value: {
      enabled,
      subject,
      body,
      ...(notificationEmail && { notificationEmail }),
    },
  };
}

/** Strict write validation used by both the admin and PAT APIs. */
export function validateContactFormFields(value: unknown): ValidationResult {
  if (!Array.isArray(value)) return { success: false, errors: ['Formularfelder müssen als Liste übergeben werden.'] };
  if (value.length < 2 || value.length > MAX_FIELDS) {
    return { success: false, errors: [`Es sind 2 bis ${MAX_FIELDS} Formularfelder erlaubt.`] };
  }

  const errors: string[] = [];
  const fields: ContactFormFieldDefinition[] = [];
  const seen = new Set<string>();

  value.forEach((candidate, index) => {
    if (!isRecord(candidate)) {
      errors.push(`Feld ${index + 1} ist ungültig.`);
      return;
    }
    const name = cleanString(candidate.name, MAX_FIELD_NAME_LENGTH);
    if (!FIELD_NAME_PATTERN.test(name)) {
      errors.push(`Feld ${index + 1} benötigt einen technischen Namen aus Buchstaben, Zahlen und Unterstrichen.`);
      return;
    }
    const semanticName = name.toLocaleLowerCase('en-US');
    if (seen.has(semanticName)) {
      errors.push(`Der Feldname „${name}“ kommt mehrfach vor.`);
      return;
    }
    seen.add(semanticName);
    if (!isContactFormFieldType(candidate.type)) {
      errors.push(`Feld „${name}“ hat einen ungültigen Typ.`);
      return;
    }
    const label = cleanString(candidate.label, MAX_LABEL_LENGTH);
    if (!label) errors.push(`Feld „${name}“ benötigt ein Label.`);
    const options = candidate.type === 'select' ? normalizeOptions(candidate.options) : undefined;
    if (candidate.type === 'select' && !options?.length) {
      errors.push(`Dropdown „${name}“ benötigt mindestens eine Option.`);
    }
    fields.push({
      name,
      label: label || humanizeFieldName(name),
      type: candidate.type,
      ...(cleanString(candidate.placeholder, MAX_OPTION_LENGTH) && { placeholder: cleanString(candidate.placeholder, MAX_OPTION_LENGTH) }),
      ...(candidate.required === true && { required: true }),
      ...(options && { options }),
      ...(candidate.halfWidth === true && { halfWidth: true }),
    });
  });

  const nameField = fields.find(field => field.name.toLocaleLowerCase('en-US') === 'name');
  const emailField = fields.find(field => field.name.toLocaleLowerCase('en-US') === 'email');
  if (!nameField) errors.push('Das Pflichtfeld „name“ fehlt.');
  if (!emailField) errors.push('Das Pflichtfeld „email“ fehlt.');
  if (nameField && (nameField.name !== 'name' || nameField.type !== 'text' || !nameField.required)) {
    errors.push('„name“ muss eindeutig, vom Typ Text und ein Pflichtfeld sein.');
  }
  if (emailField && (emailField.name !== 'email' || emailField.type !== 'email' || !emailField.required)) {
    errors.push('„email“ muss eindeutig, vom Typ E-Mail und ein Pflichtfeld sein.');
  }

  return errors.length > 0 ? { success: false, errors } : { success: true, fields };
}

/**
 * Combine the tenant-owned form contract with optional section fields.
 *
 * The server contract always wins for matching names, so a client cannot
 * remove a required field, downgrade its type, or replace its allowed select
 * values. Valid section contracts may still add fields that are not part of
 * the global form configuration.
 */
export function mergeContactFormFields(
  serverFields: unknown,
  sectionFields: unknown,
): ContactFormFieldDefinition[] {
  const server = normalizeContactFormFields(serverFields);
  const section = normalizeContactFormFields(sectionFields);
  const seen = new Set(server.map(field => field.name.toLocaleLowerCase('en-US')));
  const merged = [...server];

  for (const field of section) {
    const key = field.name.toLocaleLowerCase('en-US');
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(field);
    if (merged.length >= MAX_FIELDS) break;
  }

  return merged;
}

/** Validate a public submission against the tenant's current field contract. */
export function validateContactSubmission(body: unknown, configuredFields: unknown): SubmissionResult {
  if (!isRecord(body)) return { success: false, error: 'Ungültige Eingabe.' };
  const fields = normalizeContactFormFields(configuredFields);
  const values: Record<string, string> = {};
  const payloadFields: StoredContactPayload['fields'] = [];

  for (const field of fields) {
    const rawValue = body[field.name];
    if (rawValue !== undefined && typeof rawValue !== 'string') {
      return { success: false, error: `Das Feld „${field.label}“ ist ungültig.` };
    }
    const maxLength = field.name === 'name' ? 200 : field.name === 'email' ? 320 : field.name === 'phone' ? 50 : MAX_VALUE_LENGTH;
    const value = cleanString(rawValue, maxLength);
    if (field.required && !value) {
      return { success: false, error: `Bitte füllen Sie das Pflichtfeld „${field.label}“ aus.` };
    }
    if (value && field.type === 'email' && !EMAIL_PATTERN.test(value)) {
      return { success: false, error: `„${field.label}“ enthält keine gültige E-Mail-Adresse.` };
    }
    if (value && field.type === 'select' && field.options?.length && !field.options.includes(value)) {
      return { success: false, error: `Die Auswahl für „${field.label}“ ist ungültig.` };
    }
    if (!value) continue;
    values[field.name] = value;
    payloadFields.push({ name: field.name, label: field.label, type: field.type, value });
  }

  const source = cleanString(body._source, 100);
  const summary = cleanString(body._summary, 1500);
  const page = cleanString(body._page, 200) || null;
  return {
    success: true,
    values,
    page,
    payload: {
      version: 1,
      fields: payloadFields,
      ...((source || summary) && { context: { ...(source && { source }), ...(summary && { summary }) } }),
    },
  };
}

export function isHoneypotFilled(body: unknown): boolean {
  return isRecord(body) && typeof body._website === 'string' && body._website.trim().length > 0;
}
