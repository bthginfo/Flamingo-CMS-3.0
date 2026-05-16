import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL!);
async function main() {
  await sql('UPDATE tenants SET vercel_project_id = $1 WHERE id = $2', ['prj_OuN0bYLBXzNewmV5GUcsnYK9mjur', 'b9c11f14-c20f-4863-8081-dd90b82ddb11']);
  console.log('OK: vercel_project_id set');
}
main().catch(e => { console.error(e); process.exit(1); });
