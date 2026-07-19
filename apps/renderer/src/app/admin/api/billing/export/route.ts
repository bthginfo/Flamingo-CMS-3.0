import { and, eq, ne } from 'drizzle-orm';
import { billingDocuments, customers, tenantAddons } from '@flamingo/db';
import { BILLING_ADDON_KEY } from '@/lib/billing-constants';
import { getDb } from '@/lib/db';
import { getSession } from '@/lib/session';

export const dynamic = 'force-dynamic';

function csvCell(value: unknown) {
  let text = value == null ? '' : String(value);
  if (/^[=+\-@]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}
function iso(value: Date | null) {
  return value ? value.toISOString().slice(0, 10) : '';
}

export async function GET() {
  const session = await getSession();
  if (!session) return Response.json({ error: 'Nicht angemeldet' }, { status: 401 });
  const db = getDb();
  const [addon] = await db.select({ active: tenantAddons.active }).from(tenantAddons)
    .where(and(eq(tenantAddons.tenantId, session.tenantId), eq(tenantAddons.addonKey, BILLING_ADDON_KEY))).limit(1);
  if (!addon?.active) return Response.json({ error: 'Modul nicht aktiv' }, { status: 403 });
  const rows = await db.select({
    documentNumber: billingDocuments.documentNumber,
    documentType: billingDocuments.documentType,
    status: billingDocuments.status,
    issueDate: billingDocuments.issueDate,
    dueDate: billingDocuments.dueDate,
    customerNumber: customers.customerNumber,
    customerName: customers.name,
    subtotalNetCents: billingDocuments.subtotalNetCents,
    taxCents: billingDocuments.taxCents,
    totalGrossCents: billingDocuments.totalGrossCents,
    amountPaidCents: billingDocuments.amountPaidCents,
    currency: billingDocuments.currency,
    taxMode: billingDocuments.taxMode,
  }).from(billingDocuments)
    .leftJoin(customers, and(eq(customers.id, billingDocuments.customerId), eq(customers.tenantId, session.tenantId)))
    .where(and(eq(billingDocuments.tenantId, session.tenantId), ne(billingDocuments.status, 'draft')));
  const header = ['Belegnummer', 'Belegart', 'Status', 'Belegdatum', 'Fällig', 'Kundennummer', 'Kunde', 'Netto', 'Steuer', 'Brutto', 'Bezahlt', 'Offen', 'Währung', 'Steuerfall'];
  const lines = rows.map(row => [
    row.documentNumber, row.documentType, row.status, iso(row.issueDate), iso(row.dueDate), row.customerNumber, row.customerName,
    (row.subtotalNetCents / 100).toFixed(2), (row.taxCents / 100).toFixed(2), (row.totalGrossCents / 100).toFixed(2),
    (row.amountPaidCents / 100).toFixed(2), (Math.max(0, row.totalGrossCents - row.amountPaidCents) / 100).toFixed(2), row.currency, row.taxMode,
  ].map(csvCell).join(';'));
  const csv = `\uFEFF${header.map(csvCell).join(';')}\r\n${lines.join('\r\n')}\r\n`;
  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="flamingo-buchhaltung-${new Date().toISOString().slice(0, 10)}.csv"`,
      'Cache-Control': 'private, no-store',
    },
  });
}
