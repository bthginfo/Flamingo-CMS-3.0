import { getDb } from '@/lib/db';
import { invoices, orders } from '@flamingo/db';
import { eq, desc } from 'drizzle-orm';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { InvoicesClient } from './invoices-client';

export const dynamic = 'force-dynamic';

export default async function InvoicesPage() {
  const session = await getSession();
  if (!session?.tenantId) redirect('/admin/login');

  const db = getDb();
  const allInvoices = await db
    .select({
      id: invoices.id,
      invoiceNumber: invoices.invoiceNumber,
      type: invoices.type,
      amountGrossCents: invoices.amountGrossCents,
      issuedAt: invoices.issuedAt,
      orderId: invoices.orderId,
      refInvoiceNumber: invoices.refInvoiceNumber,
      orderNumber: orders.orderNumber,
      customerName: orders.customerName,
      customerEmail: orders.customerEmail,
    })
    .from(invoices)
    .innerJoin(orders, eq(invoices.orderId, orders.id))
    .where(eq(invoices.tenantId, session.tenantId))
    .orderBy(desc(invoices.issuedAt))
    .limit(200);

  return <InvoicesClient invoices={allInvoices} />;
}
