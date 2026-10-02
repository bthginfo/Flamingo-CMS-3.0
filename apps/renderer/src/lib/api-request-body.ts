export class ApiRequestBodyError extends Error {
  constructor(public readonly code: string, message: string, public readonly status = 400) {
    super(message);
  }
}

export const API_JSON_MAX_BYTES = 2 * 1024 * 1024;

/** Bound actual bytes, including chunked requests, before decoding or parsing. */
export async function readApiJsonObject(request: Request, maxBytes = API_JSON_MAX_BYTES): Promise<Record<string, any>> {
  const contentType = request.headers.get('content-type')?.split(';')[0].trim().toLowerCase();
  if (contentType && contentType !== 'application/json' && !/^application\/[a-z0-9.+-]+\+json$/.test(contentType)) {
    throw new ApiRequestBodyError('UNSUPPORTED_MEDIA_TYPE', 'Send Content-Type: application/json.', 415);
  }
  const reader = request.body?.getReader();
  if (!reader) throw new ApiRequestBodyError('INVALID_JSON', 'A JSON object body is required.');
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBytes) {
        await reader.cancel().catch(() => {});
        throw new ApiRequestBodyError('BODY_TOO_LARGE', `JSON body exceeds ${maxBytes} bytes.`, 413);
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  let body: unknown;
  try { body = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes)); }
  catch { throw new ApiRequestBodyError('INVALID_JSON', 'Send exactly one valid UTF-8 JSON object.'); }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new ApiRequestBodyError('INVALID_BODY', 'The JSON body must be an object, not null, an array or a primitive.');
  }
  return body as Record<string, any>;
}
