import { ApiRequestBodyError } from './api-request-body';

function fail(field: string, expectation: string): never {
  throw new ApiRequestBodyError('SHOP_INPUT_INVALID', `${field} ${expectation}`);
}

export function validateProductInput(body: Record<string, unknown>, creating = false): void {
  const writable = ['title', 'slug', 'categoryId', 'description', 'shortDescription', 'priceCents', 'comparePriceCents', 'images', 'stock', 'status', 'highlights'];
  if (!creating && !writable.some(field => body[field] !== undefined)) fail('product', 'must include at least one writable field.');
  for (const field of ['title', 'slug']) {
    const value = body[field];
    if ((creating || value !== undefined) && (typeof value !== 'string' || !value.trim() || value.length > 255)) fail(field, 'must be a non-empty string of at most 255 characters.');
  }
  if (body.slug !== undefined && (typeof body.slug !== 'string' || !/^[\p{L}\p{N}_-]+$/u.test(body.slug))) fail('slug', 'must be a single URL-safe path segment.');
  for (const field of ['priceCents', 'comparePriceCents', 'stock']) {
    const value = body[field];
    if (field === 'comparePriceCents' && value === null) continue;
    if ((field === 'priceCents' && creating) || value !== undefined) {
      if (!Number.isInteger(value) || (value as number) < 0 || (value as number) > 2147483647) fail(field, 'must be a non-negative 32-bit integer.');
    }
  }
  if (body.status !== undefined && !['draft', 'active', 'archived'].includes(body.status as string)) fail('status', 'must be draft, active or archived.');
  for (const field of ['images', 'highlights']) {
    if (body[field] !== undefined && (!Array.isArray(body[field]) || !(body[field] as unknown[]).every(value => typeof value === 'string'))) fail(field, 'must be an array of strings.');
  }
  if (body.categoryId !== undefined && body.categoryId !== null && (typeof body.categoryId !== 'string' || !/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(body.categoryId))) fail('categoryId', 'must be a UUID or null.');
  for (const field of ['description', 'shortDescription']) {
    if (body[field] != null && typeof body[field] !== 'string') fail(field, 'must be a string or null.');
  }
}

export function validateShippingInput(body: Record<string, unknown>): void {
  if (typeof body.name !== 'string' || !body.name.trim() || body.name.length > 255) fail('name', 'is required and must be at most 255 characters.');
  if (body.countries !== undefined && (!Array.isArray(body.countries) || !body.countries.every(value => typeof value === 'string' && /^[A-Z]{2}$/.test(value)))) fail('countries', 'must be an array of two-letter country codes.');
  if (body.methods === undefined) return;
  if (!Array.isArray(body.methods) || body.methods.length > 100) fail('methods', 'must be an array of at most 100 shipping methods.');
  for (const method of body.methods) {
    if (!method || typeof method !== 'object' || Array.isArray(method)) fail('methods', 'must contain objects.');
    if (method.name !== undefined && (typeof method.name !== 'string' || !method.name.trim() || method.name.length > 255)) fail('method.name', 'must be a non-empty string.');
    for (const field of ['priceCents', 'freeAboveCents']) {
      const value = method[field];
      if (value !== undefined && value !== null && (!Number.isInteger(value) || value < 0 || value > 2147483647)) fail(`method.${field}`, 'must be a non-negative 32-bit integer.');
    }
    if (method.estimatedDays != null && (typeof method.estimatedDays !== 'string' || method.estimatedDays.length > 50)) fail('method.estimatedDays', 'must be a string of at most 50 characters.');
  }
}

export function categoryUpdates(body: Record<string, unknown>, creating = false): Record<string, unknown> {
  const updates: Record<string, unknown> = {};
  for (const field of ['name', 'slug']) {
    const value = body[field];
    if (creating || value !== undefined) {
      if (typeof value !== 'string' || !value.trim() || value.length > 255) fail(field, 'must be a non-empty string of at most 255 characters.');
      if (field === 'slug' && !/^[\p{L}\p{N}_-]+$/u.test(value as string)) fail(field, 'must be a single URL-safe path segment.');
      updates[field] = (value as string).trim();
    }
  }
  for (const field of ['description', 'image']) {
    if (body[field] !== undefined) {
      if (body[field] !== null && typeof body[field] !== 'string') fail(field, 'must be a string or null.');
      updates[field] = body[field];
    }
  }
  if (!Object.keys(updates).length) fail('category', 'must include a writable field.');
  return updates;
}

export function validateCouponInput(body: Record<string, unknown>): void {
  if (typeof body.code !== 'string' || !body.code.trim() || body.code.trim().length > 50) fail('code', 'must be a non-empty string of at most 50 characters.');
  if (!['percent', 'fixed_amount', 'free_shipping'].includes(body.type as string)) fail('type', 'must be percent, fixed_amount or free_shipping.');
  if (!Number.isInteger(body.value) || (body.value as number) < 0 || (body.value as number) > 2147483647) fail('value', 'must be a non-negative 32-bit integer.');
  if (body.type !== 'free_shipping' && (body.value as number) < 1) fail('value', 'must be positive.');
  if (body.type === 'percent' && (body.value as number) > 100) fail('value', 'must not exceed 100 percent.');
  for (const field of ['minOrderCents', 'maxUses']) {
    const value = body[field];
    if (value != null && (!Number.isInteger(value) || (value as number) < (field === 'maxUses' ? 1 : 0) || (value as number) > 2147483647)) fail(field, 'must be a valid non-negative 32-bit limit (maxUses must be positive).');
  }
  for (const field of ['validFrom', 'validUntil']) {
    if (body[field] != null && (typeof body[field] !== 'string' || !Number.isFinite(Date.parse(body[field] as string)))) fail(field, 'must be a valid date string or null.');
  }
  if (body.validFrom && body.validUntil && Date.parse(body.validFrom as string) > Date.parse(body.validUntil as string)) fail('validUntil', 'must not precede validFrom.');
  if (body.appliesTo !== undefined && !['all', 'specific_products', 'specific_categories'].includes(body.appliesTo as string)) fail('appliesTo', 'has an unsupported scope.');
  if (body.appliesToIds !== undefined && (!Array.isArray(body.appliesToIds) || !body.appliesToIds.every(id => typeof id === 'string' && /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(id)))) fail('appliesToIds', 'must be an array of UUIDs.');
  if (body.appliesTo && body.appliesTo !== 'all' && !(body.appliesToIds as unknown[] | undefined)?.length) fail('appliesToIds', 'must select at least one product or category for a restricted coupon.');
}

export function validateShopSettingsInput(body: Record<string, unknown>): void {
  const fields = ['currency', 'paymentMethods', 'pickupEnabled', 'pickupInstructions', 'notificationEmail', 'orderPrefix', 'invoicePrefix', 'lowStockThreshold', 'companyInfo', 'bankDetails'];
  if (!fields.some(field => body[field] !== undefined)) fail('settings', 'must include a writable field.');
  if (body.currency !== undefined && (typeof body.currency !== 'string' || !/^[A-Z]{3}$/.test(body.currency))) fail('currency', 'must be a three-letter uppercase currency code.');
  if (body.paymentMethods !== undefined && (!Array.isArray(body.paymentMethods) || !body.paymentMethods.every(method => typeof method === 'string' && ['stripe', 'paypal', 'sumup', 'pickup', 'prepayment'].includes(method)))) fail('paymentMethods', 'must be an array of supported payment methods.');
  if (body.pickupEnabled !== undefined && typeof body.pickupEnabled !== 'boolean') fail('pickupEnabled', 'must be a boolean.');
  if (body.lowStockThreshold !== undefined && (!Number.isInteger(body.lowStockThreshold) || (body.lowStockThreshold as number) < 0 || (body.lowStockThreshold as number) > 2147483647)) fail('lowStockThreshold', 'must be a non-negative 32-bit integer.');
  for (const field of ['pickupInstructions', 'notificationEmail', 'orderPrefix', 'invoicePrefix']) {
    const value = body[field];
    if (value === null && ['pickupInstructions', 'notificationEmail'].includes(field)) continue;
    if (value !== undefined && (typeof value !== 'string' || value.length > (field.endsWith('Prefix') ? 10 : field === 'notificationEmail' ? 255 : 10000))) fail(field, 'must be a string within the supported length.');
  }
  for (const field of ['companyInfo', 'bankDetails']) {
    if (body[field] != null && (typeof body[field] !== 'object' || Array.isArray(body[field]))) fail(field, 'must be an object or null to clear.');
  }
}
