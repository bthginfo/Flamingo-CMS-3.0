export class RequestBodyTooLargeError extends Error {
  constructor(readonly maximumBytes: number) {
    super(`Request body exceeds ${maximumBytes} bytes.`);
  }
}

export class InvalidRequestBodyError extends Error {}

export async function readRequestBodyBytes(request: Request, maximumBytes: number): Promise<Uint8Array> {
  if (!Number.isSafeInteger(maximumBytes) || maximumBytes < 1) {
    throw new Error('maximumBytes must be a positive safe integer.');
  }

  const declaredLength = Number(request.headers.get('content-length'));
  if (Number.isFinite(declaredLength) && declaredLength > maximumBytes) {
    throw new RequestBodyTooLargeError(maximumBytes);
  }

  if (!request.body) return new Uint8Array();

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.byteLength;
      if (totalBytes > maximumBytes) {
        await reader.cancel('request body too large').catch(() => undefined);
        throw new RequestBodyTooLargeError(maximumBytes);
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const body = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return body;
}

export async function readJsonRequestBody(request: Request, maximumBytes: number): Promise<unknown> {
  const bytes = await readRequestBodyBytes(request, maximumBytes);
  try {
    const text = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
    return JSON.parse(text) as unknown;
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) throw error;
    throw new InvalidRequestBodyError('Invalid JSON request body.');
  }
}

export async function readMultipartRequestBody(request: Request, maximumBytes: number): Promise<FormData> {
  const contentType = request.headers.get('content-type');
  if (!contentType) throw new InvalidRequestBodyError('Missing Content-Type header.');
  const bytes = await readRequestBodyBytes(request, maximumBytes);

  try {
    const boundedRequest = new Request(request.url, {
      method: 'POST',
      headers: { 'Content-Type': contentType },
      body: bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer,
    });
    return await boundedRequest.formData();
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) throw error;
    throw new InvalidRequestBodyError('Invalid multipart request body.');
  }
}

function parseConfiguredOrigin(value: string | undefined): string | null {
  if (!value?.trim()) return null;
  const candidate = value.trim().startsWith('http') ? value.trim() : `https://${value.trim()}`;
  try {
    return new URL(candidate).origin;
  } catch {
    return null;
  }
}

export function isTrustedRequestOrigin(
  request: Request,
  configuredOrigins: readonly (string | undefined)[] = [
    process.env.CRM_ALLOWED_ORIGIN,
  ],
) {
  const originHeader = request.headers.get('origin');
  if (!originHeader) return false;

  try {
    const requestOrigin = new URL(request.url).origin;
    const suppliedOrigin = new URL(originHeader).origin;
    const allowedOrigins = new Set<string>([requestOrigin]);
    for (const configuredOrigin of configuredOrigins) {
      const parsed = parseConfiguredOrigin(configuredOrigin);
      if (parsed) allowedOrigins.add(parsed);
    }
    return allowedOrigins.has(suppliedOrigin);
  } catch {
    return false;
  }
}

export function getClientAddress(headers: Pick<Headers, 'get'>) {
  const forwarded = headers.get('x-vercel-forwarded-for')
    || headers.get('x-forwarded-for')
    || headers.get('x-real-ip')
    || '';
  const candidate = forwarded.split(',')[0]?.trim().slice(0, 128);
  return candidate || 'unknown';
}
