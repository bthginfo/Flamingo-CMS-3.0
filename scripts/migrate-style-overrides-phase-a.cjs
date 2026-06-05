/* Phase A.2 — DB migration: rename styleOverrides keys to match Phase A editor */
const { Client } = require('pg');

const CONN = process.env.DATABASE_URL || (() => { throw new Error('DATABASE_URL env required'); })();

const RENAMES = {
  '--style-section-bg':       '--token-section-bg',
  '--style-section-bg-alt':   '--token-section-bg-alt',
  '--style-card-bg':          '--token-card-bg',
  '--style-heading-color':    '--token-heading',
  '--style-subheading-color': '--token-subheading',
  '--style-body-color':       '--token-body',
  '--style-text-muted':       '--token-muted',
  '--style-icon-color':       '--token-icon',
  '--style-border-color':     '--token-card-border',
  '--style-divider-color':    '--token-divider',
  '--style-badge-bg':         '--token-badge-bg',
  '--style-badge-text':       '--token-badge-text',
  '--style-badge-border':     '--token-badge-border',
  '--brand-btn-bg':           '--token-btn-bg',
  '--brand-btn-text':         '--token-btn-text',
};
const OLD_KEYS = Object.keys(RENAMES);

(async () => {
  const c = new Client({ connectionString: CONN, ssl: { rejectUnauthorized: false } });
  await c.connect();

  // 1. count affected rows
  const { rows: [{ count }] } = await c.query(
    `SELECT count(*)::int FROM page_sections WHERE style_overrides ?| $1`,
    [OLD_KEYS]
  );
  console.log('Affected rows:', count);

  if (count === 0) {
    await c.end();
    return;
  }

  // 2. fetch and rewrite per row (safer than a giant CASE in SQL — preserves unknown keys verbatim)
  const { rows } = await c.query(
    `SELECT id, style_overrides FROM page_sections WHERE style_overrides ?| $1`,
    [OLD_KEYS]
  );

  let touched = 0;
  for (const r of rows) {
    const src = r.style_overrides || {};
    const out = {};
    let changed = false;
    for (const [k, v] of Object.entries(src)) {
      const nk = RENAMES[k] || k;
      if (nk !== k) changed = true;
      // last-writer-wins: if both old & new key exist, prefer new (already-migrated) value
      if (!(nk in out)) out[nk] = v;
    }
    if (changed) {
      await c.query(`UPDATE page_sections SET style_overrides = $1::jsonb WHERE id = $2`, [JSON.stringify(out), r.id]);
      touched++;
    }
  }
  console.log('Updated rows:', touched);

  // 3. verify
  const { rows: [{ count: leftover }] } = await c.query(
    `SELECT count(*)::int FROM page_sections WHERE style_overrides ?| $1`,
    [OLD_KEYS]
  );
  console.log('Leftover rows with old keys:', leftover);

  await c.end();
})().catch(e => { console.error(e); process.exit(1); });
