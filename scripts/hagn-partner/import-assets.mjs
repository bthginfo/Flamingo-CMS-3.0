/** Import the existing firm's own public media. Never generates or substitutes people. */
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const repository = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const publicRoot = resolve(repository, 'apps/renderer/public/hagn-partner');
export const sourceMedia = [
  ['logo.png', 'logo.png', 350, 100, 'Logo der Rechtsanwälte Hagn, Deckert, Stemmer & Partner'],
  ...['niels-deckert', 'markus-stemmer', 'gabriela-radlinger', 'veronika-hagn', 'maria-haneder', 'ulrike-wagner', 'eva-huxmann'].map((name, i) => [`anwaelte/${name}.jpg`, `anwalt-ingolstadt/${name}.jpg`, 650, [600, 540, 480, 490, 520, 600, 600][i], ['Dr. iur. Niels Deckert', 'Markus Stemmer', 'Gabriele Radlinger', 'Veronika Hagn', 'Maria Haneder', 'Ulrike Wagner', 'Eva Huxmann'][i]]),
  ...['susanna-nagel', 'ilona-epstein', 'monika-kuerzinger', 'annalena-baumanis', 'aylin-durgut'].map(name => [`sekretariat/${name}.jpg`, `rechtsanwalt-ingolstadt/${name}.jpg`, 600, 400, `Porträt: ${name.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ')}`]),
  ['kanzlei/besprechung.jpg', 'ingolstadt-anwalt-5.jpg', 800, 400, 'Besprechungsraum aus dem Bildbestand der Kanzlei'],
  ['kanzlei/treppenhaus.jpg', 'ingolstadt-anwalt-3.jpg', 800, 400, 'Wendeltreppe aus dem Bildbestand der Kanzlei'],
  ['kanzlei/gespraech.jpg', 'ingolstadt-anwalt-4.jpg', 600, 400, 'Besprechung am Schreibtisch aus dem Bildbestand der Kanzlei'],
  ['kanzlei/empfang.jpg', 'ingolstadt-anwalt-2.jpg', 800, 400, 'Kanzleischild Hagn, Deckert, Stemmer & Partner'],
  ['kanzlei/bibliothek.jpg', 'ingolstadt-anwalt-1.jpg', 1200, 400, 'Juristische Fachbibliothek aus dem Bildbestand der Kanzlei'],
  ['kanzlei/akten.jpg', 'ingolstadt-anwalt-6.jpg', 800, 400, 'Stempel und Akten aus dem Bildbestand der Kanzlei'],
  ['kanzlei/telefon.jpg', 'termin-anwalt-ingolstadt.jpg', 650, 350, 'Telefon am Kanzleiarbeitsplatz'],
  ['kanzlei/unterlagen.jpg', 'kosten-anwalt-ingolstadt.jpg', 650, 350, 'Unterlagen und Kanzleistempel'],
  ...['vollmacht', 'prozessvollmacht', 'strafprozessvollmacht', 'mandatsaufnahmebogen', 'hinweise-datenverarbeitung', 'schweigepfilcht-entbindung', 'beratungshilfe', 'prozesskostenhilfe', 'musterwiderrufsformular'].map(name => [`downloads/${name}.pdf`, `downloads/${name}.pdf`, null, null, name]),
];

export async function importAssets() {
  const manifest = [];
  for (const [local, original, width, height, alt] of sourceMedia) {
    const sourceUrl = `https://www.hagn-partner.de/images/${original}`;
    const path = resolve(publicRoot, local);
    await mkdir(dirname(path), { recursive: true });
    let bytes;
    try { bytes = await readFile(path); } catch {
      const response = await fetch(sourceUrl);
      if (!response.ok) throw new Error(`Source media unavailable: ${response.status} ${sourceUrl}`);
      bytes = Buffer.from(await response.arrayBuffer());
      await writeFile(path, bytes);
    }
    const document = local.endsWith('.pdf');
    const logo = local === 'logo.png';
    manifest.push({ path: `/hagn-partner/${local}`, sourceUrl, width, height, alt, bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex'), mimeType: document ? 'application/pdf' : local.endsWith('.png') ? 'image/png' : 'image/jpeg', generated: false, creator: null, credit: document ? 'Original client document from the existing website; individual author not established.' : logo ? 'Original client logo from the existing website; designer not established.' : 'The source website credits Stefan Bösl Fotografie, Ingolstadt for firm photography and portraits; attribution is source-wide, not independently established per image.', license: 'Existing client website media; reuse authorized by the user, no new license asserted.' });
  }
  await mkdir(resolve(repository, 'docs/sites/hagn-partner'), { recursive: true });
  await writeFile(resolve(repository, 'docs/sites/hagn-partner/MEDIA-PROVENANCE.json'), `${JSON.stringify({ source: 'https://www.hagn-partner.de/', retrievedOn: '2026-10-19', assets: manifest }, null, 2)}\n`);
  return manifest;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const manifest = await importAssets();
  console.log(`Imported ${manifest.length} original client assets; no database access.`);
}
