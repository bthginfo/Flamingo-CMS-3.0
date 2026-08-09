import { del, get, put } from '@vercel/blob';
import { createHash } from 'node:crypto';

const PDF_CONTENT_TYPE = 'application/pdf';
const XML_CONTENT_TYPE = 'application/xml; charset=utf-8';
const FETCH_TIMEOUT_MS = 5000;
const MAX_ARTIFACT_BYTES = 25 * 1024 * 1024;

type ArtifactKind = 'pdf' | 'xml';

type StoreArtifactInput = {
  tenantId: string;
  documentId: string;
  documentNumber: string;
  kind: ArtifactKind;
  content: Buffer | Uint8Array | string | null;
  immutableSha256?: string;
};

type ReadArtifactInput = {
  blobUrl?: string | null;
  base64?: string | null;
  text?: string | null;
};

export function billingArtifactStorageConfigured() {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  return Boolean(token && !token.startsWith('__PLACEHOLDER'));
}

function safePathPart(value: string) {
  return value.normalize('NFKD').replace(/[^a-z0-9_.-]+/gi, '-').replace(/^-+|-+$/g, '').slice(0, 120) || 'document';
}

function artifactContentType(kind: ArtifactKind) {
  return kind === 'pdf' ? PDF_CONTENT_TYPE : XML_CONTENT_TYPE;
}

function toBody(content: StoreArtifactInput['content']) {
  if (content === null) return null;
  return typeof content === 'string' ? Buffer.from(content, 'utf8') : Buffer.from(content);
}

function isTrustedBlobUrl(url: string) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' && (
      parsed.hostname.endsWith('.public.blob.vercel-storage.com')
      || parsed.hostname.endsWith('.blob.vercel-storage.com')
    );
  } catch {
    return false;
  }
}

function isLegacyPublicBlobUrl(url: string) {
  try {
    return new URL(url).hostname.endsWith('.public.blob.vercel-storage.com');
  } catch {
    return false;
  }
}

export function billingArtifactMatchesSha256(content: Buffer | Uint8Array | string, expectedSha256: string | null | undefined) {
  if (!expectedSha256 || !/^[a-f0-9]{64}$/i.test(expectedSha256)) return false;
  const body = typeof content === 'string' ? Buffer.from(content, 'utf8') : Buffer.from(content);
  return createHash('sha256').update(body).digest('hex') === expectedSha256.toLowerCase();
}

export async function storeBillingArtifact(input: StoreArtifactInput) {
  if (!billingArtifactStorageConfigured()) return null;
  const body = toBody(input.content);
  if (!body?.byteLength) return null;
  const pathname = [
    safePathPart(input.tenantId),
    'billing',
    safePathPart(input.documentId),
    `${safePathPart(input.documentNumber)}${input.immutableSha256 ? `-${safePathPart(input.immutableSha256)}` : ''}.${input.kind}`,
  ].join('/');
  try {
    const blob = await put(pathname, body, {
      // Billing documents contain personal and financial data. Their raw Blob
      // URLs must never be usable as a second, unauthenticated download path;
      // all delivery goes through the tenant-scoped routes below /api/billing.
      access: 'private',
      token: process.env.BLOB_READ_WRITE_TOKEN,
      contentType: artifactContentType(input.kind),
      addRandomSuffix: false,
      allowOverwrite: !input.immutableSha256,
    });
    return blob.url;
  } catch (error) {
    console.error('[Billing Artifact Upload Error]', error instanceof Error ? error.message : error);
    return null;
  }
}

export async function deleteBillingArtifact(url: string | null | undefined) {
  if (!url || !billingArtifactStorageConfigured() || !isTrustedBlobUrl(url)) return;
  try { await del(url, { token: process.env.BLOB_READ_WRITE_TOKEN }); }
  catch (error) { console.error('[Billing Artifact Cleanup Error]', error instanceof Error ? error.message : error); }
}

async function readBlobUrl(url: string) {
  if (!isTrustedBlobUrl(url)) return null;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    // Keep existing finalized documents readable while old public artifacts
    // are phased out. New artifacts always use authenticated private storage.
    if (isLegacyPublicBlobUrl(url)) {
      const response = await fetch(url, { cache: 'no-store', signal: controller.signal });
      if (!response.ok) return null;
      const declaredSize = Number(response.headers.get('content-length') || 0);
      if (declaredSize > MAX_ARTIFACT_BYTES) return null;
      const bytes = Buffer.from(await response.arrayBuffer());
      return bytes.byteLength <= MAX_ARTIFACT_BYTES ? bytes : null;
    }

    if (!billingArtifactStorageConfigured()) return null;
    const result = await get(url, {
      access: 'private',
      token: process.env.BLOB_READ_WRITE_TOKEN,
      useCache: false,
      abortSignal: controller.signal,
    });
    if (!result || result.statusCode !== 200 || result.blob.size > MAX_ARTIFACT_BYTES) return null;
    const bytes = Buffer.from(await new Response(result.stream).arrayBuffer());
    return bytes.byteLength <= MAX_ARTIFACT_BYTES ? bytes : null;
  } catch (error) {
    console.error('[Billing Artifact Download Error]', error instanceof Error ? error.message : error);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export async function readBillingPdfArtifact(input: ReadArtifactInput) {
  if (input.blobUrl) {
    const blob = await readBlobUrl(input.blobUrl);
    if (blob?.byteLength) return blob;
  }
  return input.base64 ? Buffer.from(input.base64, 'base64') : null;
}

export async function readBillingXmlArtifact(input: ReadArtifactInput) {
  if (input.blobUrl) {
    const blob = await readBlobUrl(input.blobUrl);
    if (blob?.byteLength) return blob.toString('utf8');
  }
  return input.text || null;
}
