import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function main() {
  const snaps = await sql`SELECT id, snapshot FROM published_snapshots WHERE tenant_id = 'ff2102e2-f07e-4d44-9046-12c55d78a60d' AND is_active = true`;
  for (const snap of snaps) {
    const s = snap.snapshot as any;
    let changed = false;
    for (const p of s.pages || []) {
      if (p.visible === undefined) { p.visible = true; changed = true; }
    }
    if (changed) {
      await sql`UPDATE published_snapshots SET snapshot = ${JSON.stringify(s)}::jsonb WHERE id = ${snap.id}`;
      console.log('Fixed snapshot', snap.id);
    }
  }
  console.log('Done');
}

main().catch(console.error);
