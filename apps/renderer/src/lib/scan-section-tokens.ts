// Which colour roles does a rendered section actually paint?
//
// Both editors (admin sidebar + live-preview colour modal) hide colour
// controls a section doesn't use. That detection must mirror the renderer,
// not just the template markup:
//
//  1. Literal `var(--token-X)` references in the section markup — inline
//     styles AND Tailwind arbitrary-value classes keep the literal string in
//     outerHTML. The renderer's injected <style> block is EXCLUDED from this
//     scan: it exists on every section and mentions every universal role, so
//     scanning it would mark e.g. badge tokens "used" on badge-less sections.
//  2. Roles the section-renderer force-paints on EVERY section
//     (heading / body / muted via its !important rules).
//  3. Card text roles when a card container exists ([data-card] /
//     [data-edit-collection]) — the forced card rules only target those.
//  4. Badge roles when a `.section-badge` element exists (painted by the
//     renderer's forced badge rule).
//  5. Button roles when any anchor/button carries a bg- utility class —
//     globals.css repaints those from --token-btn-bg / --token-btn-text as
//     soon as the override is set on the section.
export function scanSectionTokens(root: Element): Set<string> {
  const found = new Set<string>();
  const clone = root.cloneNode(true) as HTMLElement;
  clone.querySelectorAll('style').forEach((s) => s.remove());
  const html = clone.outerHTML;
  const re = /var\(\s*(--token-[\w-]+)\s*(?:,[^)]*)?\)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) found.add(m[1]);

  for (const t of ['--token-section-bg', '--token-heading', '--token-body', '--token-muted']) {
    found.add(t);
  }
  if (clone.querySelector('[data-card], [data-edit-collection]')) {
    found.add('--token-card-heading');
    found.add('--token-card-body');
    found.add('--token-card-muted');
  }
  if (clone.querySelector('.section-badge')) {
    found.add('--token-badge-bg');
    found.add('--token-badge-text');
    // globals.css paints every badge role from the canonical token family.
    found.add('--token-badge-border');
  }
  if (clone.querySelector('a[class*="bg-"], button[class*="bg-"]')) {
    found.add('--token-btn-bg');
    found.add('--token-btn-text');
  }
  // globals.css recolours hr/divide-*/border-b elements from
  // --style-divider-color (normalized from --token-divider) once set.
  if (clone.querySelector('hr, [class*="divide-"], [class*="divider"], [class*="border-b"], [class*="border-t"]')) {
    found.add('--token-divider');
  }
  return found;
}
