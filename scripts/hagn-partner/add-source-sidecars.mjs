/** Add source provenance only; original image bytes are verified and never rewritten. */
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const repository = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const ledger = JSON.parse(await readFile(resolve(repository, 'docs/sites/hagn-partner/MEDIA-PROVENANCE.json'), 'utf8'));
let added = 0;
for (const item of ledger.assets.filter(value => value.mimeType?.startsWith('image/') && value.sourceUrl.startsWith('https://www.hagn-partner.de/images/'))) {
  const target = resolve(repository, 'apps/renderer/public', item.path.replace(/^\//, ''));
  const bytes = await readFile(target);
  assert.equal(createHash('sha256').update(bytes).digest('hex'), item.sha256, `Unexpected original source image: ${item.path}`);
  const sidecar = `${target}.json`;
  try { const existing = JSON.parse(await readFile(sidecar, 'utf8')); assert.ok(existing.prompt || existing.origin); continue; }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  const identity = item.path.endsWith('/logo.png') ? 'Pre-existing client logo; designer not established.' : 'Original client photograph. The source website credits Stefan Bösl Fotografie, Ingolstadt for firm photography and portraits; attribution is source-wide and not independently established per image.';
  const origin = `${identity} Source: ${item.sourceUrl}. Subject: ${item.alt}. Reuse of the existing client website media was authorized by the user. This is not generated imagery. Original raster bytes and source dimensions are preserved unchanged.`;
  await writeFile(sidecar, `${JSON.stringify({ prompt: origin, origin, sourceUrl: item.sourceUrl, generated: false, sha256: item.sha256, createdAt: new Date().toISOString() }, null, 2)}\n`);
  added += 1;
}
console.log(JSON.stringify({ metadataOnly: true, addedOriginalSidecars: added, originalRasterBytesPreserved: true }));
