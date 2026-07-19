'use client';

import { FileText, Download, Search } from 'lucide-react';
import { useState } from 'react';

type Invoice = {
  id: string;
  invoiceNumber: string;
  type: 'invoice' | 'credit_note';
  amountGrossCents: number;
  issuedAt: Date;
  orderId: string;
  refInvoiceNumber: string | null;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
};

function formatPrice(cents: number) {
  return (cents / 100).toFixed(2).replace('.', ',') + ' €';
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function InvoicesClient({ invoices }: { invoices: Invoice[] }) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'invoice' | 'credit_note'>('all');

  const filtered = invoices.filter(inv => {
    if (typeFilter !== 'all' && inv.type !== typeFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return inv.invoiceNumber.toLowerCase().includes(q) || inv.orderNumber.toLowerCase().includes(q) || inv.customerName.toLowerCase().includes(q);
    }
    return true;
  });

  const totalInvoices = invoices.filter(i => i.type === 'invoice');
  const totalCreditNotes = invoices.filter(i => i.type === 'credit_note');
  const revenue = totalInvoices.reduce((s, i) => s + i.amountGrossCents, 0);
  const credits = totalCreditNotes.reduce((s, i) => s + Math.abs(i.amountGrossCents), 0);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Rechnungen & Gutschriften</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border p-4">
          <p className="text-xs text-zinc-500 uppercase">Rechnungen</p>
          <p className="text-2xl font-bold">{totalInvoices.length}</p>
          <p className="text-sm text-green-600">{formatPrice(revenue)}</p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <p className="text-xs text-zinc-500 uppercase">Stornorechnungen</p>
          <p className="text-2xl font-bold">{totalCreditNotes.length}</p>
          <p className="text-sm text-red-600">-{formatPrice(credits)}</p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <p className="text-xs text-zinc-500 uppercase">Rechnungssaldo (brutto)</p>
          <p className="text-2xl font-bold">{formatPrice(revenue - credits)}</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Suche nach Nr., Kunde, Bestellung…"
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-zinc-200 text-sm"
          />
        </div>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value as typeof typeFilter)} className="text-sm border border-zinc-200 rounded-lg px-3 py-2">
          <option value="all">Alle ({invoices.length})</option>
          <option value="invoice">Rechnungen ({totalInvoices.length})</option>
          <option value="credit_note">Storno ({totalCreditNotes.length})</option>
        </select>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-zinc-400">
          <FileText size={40} className="mx-auto mb-3 opacity-50" />
          <p>Keine Rechnungen vorhanden.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50 text-xs text-zinc-500 uppercase">
                <tr>
                  <th className="text-left px-4 py-3">Nr.</th>
                  <th className="text-left px-4 py-3">Typ</th>
                  <th className="text-left px-4 py-3">Kunde</th>
                  <th className="text-left px-4 py-3">Bestellung</th>
                  <th className="text-right px-4 py-3">Betrag</th>
                  <th className="text-left px-4 py-3">Datum</th>
                  <th className="text-right px-4 py-3">PDF</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filtered.map(inv => (
                  <tr key={inv.id} className="hover:bg-zinc-50/50">
                    <td className="px-4 py-3 font-mono text-xs">{inv.invoiceNumber}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${inv.type === 'invoice' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {inv.type === 'invoice' ? 'Rechnung' : 'Storno'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{inv.customerName}</p>
                      <p className="text-xs text-zinc-400">{inv.customerEmail}</p>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">{inv.orderNumber}</td>
                    <td className={`px-4 py-3 text-right font-medium ${inv.type === 'credit_note' ? 'text-red-600' : ''}`}>
                      {inv.type === 'credit_note' ? '-' : ''}{formatPrice(Math.abs(inv.amountGrossCents))}
                    </td>
                    <td className="px-4 py-3 text-zinc-500">{formatDate(inv.issuedAt)}</td>
                    <td className="px-4 py-3 text-right">
                      <a
                        href={inv.type === 'invoice' ? `/api/shop/invoice/${inv.orderId}` : `/api/shop/credit-note/${inv.orderId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-zinc-600 hover:text-zinc-900 transition"
                      >
                        <Download size={14} /> PDF
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
