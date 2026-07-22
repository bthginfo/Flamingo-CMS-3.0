import { put } from '@vercel/blob';

const PDF_CONTENT_TYPE = 'application/pdf';
const XML_CONTENT_TYPE = 'application/xml; charset=utf-8';
const FETCH_TIMEOUT_MS = 5000;

type ArtifactKind = 'pdf' | 'xml';

type StoreArtifactInput = {
  tenantId: string;
  documentId: string;
  documentNumber: string;
  kind: ArtifactKind;
  content: Buffer | Uint8Array | string | null;
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

export async function storeBillingArtifact(input: StoreArtifactInput) {
  if (!billingArtifactStorageConfigured()) return null;
  const body = toBody(input.content);
  if (!body?.byteLength) return null;
  const pathname = [
    safePathPart(input.tenantId),
    'billing',
    safePathPart(input.documentId),
    `${safePathPart(input.documentNumber)}.${input.kind}`,
  ].join('/');
  try {
    const blob = await put(pathname, body, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
      contentType: artifactContentType(input.kind),
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    return blob.url;
  } catch (error) {
    console.error('[Billing Artifact Upload Error]', error instanceof Error ? error.message : error);
    return null;
  }
}

async function readBlobUrl(url: string) {
  if (!isTrustedBlobUrl(url)) return null;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const response = await fetch(url, { cache: 'no-store', signal: controller.signal });
    if (!response.ok) return null;
    return Buffer.from(await response.arrayBuffer());
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
