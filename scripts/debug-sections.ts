import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function main() {
  const tid = 'ff2102e2-f07e-4d44-9046-12c55d78a60d';
  const [snap] = await sql`SELECT snapshot FROM published_snapshots WHERE tenant_id = ${tid} AND is_active = true`;
  const s = snap.snapshot as any;
  
  const startseite = s.pages.find((p: any) => p.slug === 'startseite');
  if (!startseite) { console.log('No startseite found'); return; }
  
  console.log('Startseite sections:');
  for (const sec of startseite.sections) {
    console.log(`\n--- ${sec.type} (id: ${sec.id}) ---`);
    console.log(JSON.stringify(sec.data, null, 2));
  }
}

main().catch(console.error);
