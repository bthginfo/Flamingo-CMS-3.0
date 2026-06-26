const ALLOWED_TAGS = new Set([
  'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'blockquote',
  'a', 'img', 'figure', 'figcaption', 'code', 'pre',
  // Structural tags used by rich-text / legal content (tables, generic blocks).
  // Safe: no script execution, and they keep no attributes except the few below.
  'span', 'div', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
]);

const GLOBAL_ATTRS = new Set<string>();
const TAG_ATTRS: Record<string, Set<string>> = {
  a: new Set(['href', 'title', 'target', 'rel']),
  img: new Set(['src', 'alt', 'title', 'width', 'height', 'loading']),
  th: new Set(['colspan', 'rowspan', 'scope']),
  td: new Set(['colspan', 'rowspan']),
};

function isSafeUrl(value: string) {
  const trimmed = value.trim().toLowerCase();
  return trimmed.startsWith('/')
    || trimmed.startsWith('#')
    || trimmed.startsWith('https://')
    || trimmed.startsWith('mailto:')
    || trimmed.startsWith('tel:')
    || /^data:image\/(png|jpe?g|gif|webp|avif);base64,/.test(trimmed);
}

function escapeAttrValue(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    // Critical: never let a stray `<`/`>` from a value survive into the output —
    // otherwise malformed input like href="data:text/html,<script>" leaks a raw
    // `<script` substring that a browser re-parses as a tag (an XSS vector).
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function sanitizeAttributes(tag: string, attrs: string) {
  // Rebuild from ONLY the attributes we explicitly recognise. A .replace()-based
  // approach left unmatched fragments (e.g. a `<script` that the outer tag regex
  // swallowed into the attribute region) untouched in the output; building the
  // result from matches alone discards anything we did not validate.
  let out = '';
  const re = /([a-zA-Z][a-zA-Z0-9:-]*)(?:\s*=\s*("[^"]*"|'[^']*'|[^\s"'>]+))?/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(attrs)) !== null) {
    const name = m[1].toLowerCase();
    const rawValue = m[2];
    if (name.startsWith('on')) continue;
    if (!GLOBAL_ATTRS.has(name) && !TAG_ATTRS[tag]?.has(name)) continue;
    const value = rawValue ? rawValue.replace(/^['"]|['"]$/g, '') : '';
    if ((name === 'href' || name === 'src') && !isSafeUrl(value)) continue;
    if (tag === 'a' && name === 'target' && value !== '_blank') continue;
    out += rawValue !== undefined ? ` ${name}="${escapeAttrValue(value)}"` : ` ${name}`;
  }
  return out;
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
