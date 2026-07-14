export type AllowedImageMime = 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp' | 'image/avif';

function ascii(bytes: Uint8Array, start: number, length: number) {
  return new TextDecoder('ascii').decode(bytes.slice(start, start + length));
}

export function detectImageMime(input: ArrayBuffer | Uint8Array): AllowedImageMime | null {
  const bytes = input instanceof Uint8Array ? input : new Uint8Array(input);
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'image/jpeg';
  if (bytes.length >= 8 && [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every((value, index) => bytes[index] === value)) return 'image/png';
  if (bytes.length >= 6 && ['GIF87a', 'GIF89a'].includes(ascii(bytes, 0, 6))) return 'image/gif';
  if (bytes.length >= 12 && ascii(bytes, 0, 4) === 'RIFF' && ascii(bytes, 8, 4) === 'WEBP') return 'image/webp';
  if (bytes.length >= 12 && ascii(bytes, 4, 4) === 'ftyp') {
    const brand = ascii(bytes, 8, 4);
    if (['avif', 'avis', 'mif1', 'msf1'].includes(brand)) return 'image/avif';
  }
  return null;
}
