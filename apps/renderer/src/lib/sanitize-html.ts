const ALLOWED_TAGS = new Set([
  'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's',
  'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'blockquote',
  'a', 'img', 'figure', 'figcaption', 'code', 'pre',
]);

const GLOBAL_ATTRS = new Set(['class']);
const TAG_ATTRS: Record<string, Set<string>> = {
  a: new Set(['href', 'title', 'target', 'rel']),
  img: new Set(['src', 'alt', 'title', 'width', 'height', 'loading']),
};

function isSafeUrl(value: string) {
  const trimmed = value.trim().toLowerCase();
  return trimmed.startsWith('/')
    || trimmed.startsWith('#')
    || trimmed.startsWith('http://')
    || trimmed.startsWith('https://')
    || trimmed.startsWith('mailto:')
    || trimmed.startsWith('tel:')
    || /^data:image\/(png|jpe?g|gif|webp|avif);base64,/.test(trimmed);
}

function sanitizeAttributes(tag: string, attrs: string) {
  return attrs.replace(/\s+([a-zA-Z:-]+)(?:\s*=\s*(".*?"|'.*?'|[^\s"'>]+))?/g, (_match, rawName: string, rawValue?: string) => {
    const name = rawName.toLowerCase();
    if (name.startsWith('on')) return '';
    if (!GLOBAL_ATTRS.has(name) && !TAG_ATTRS[tag]?.has(name)) return '';
    const value = rawValue ? rawValue.trim().replace(/^['"]|['"]$/g, '') : '';
    if ((name === 'href' || name === 'src') && !isSafeUrl(value)) return '';
    const escaped = value.replace(/"/g, '&quot;');
    if (tag === 'a' && name === 'target' && escaped !== '_blank') return '';
    return rawValue ? ` ${name}="${escaped}"` : ` ${name}`;
  });
}

export function sanitizeHtml(input: string) {
  if (!input) return '';
  return input
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<(script|style|iframe|object|embed|form|input|button|svg|math)[\s\S]*?<\/\1>/gi, '')
    .replace(/<\/?([a-zA-Z0-9-]+)([^>]*)>/g, (match, rawTag: string, attrs: string) => {
      const tag = rawTag.toLowerCase();
      if (!ALLOWED_TAGS.has(tag)) return '';
      if (match.startsWith('</')) return `</${tag}>`;
      const safeAttrs = sanitizeAttributes(tag, attrs || '');
      const suffix = match.endsWith('/>') || tag === 'br' ? ' /' : '';
      const safeTag = `<${tag}${safeAttrs}${suffix}>`;
      if (tag === 'a' && !/\srel=/.test(safeTag)) return safeTag.replace(/>$/, ' rel="noopener noreferrer">');
      if (tag === 'img' && !/\sloading=/.test(safeTag)) return safeTag.replace(/\/?>$/, ' loading="lazy" />');
      return safeTag;
    });
}
