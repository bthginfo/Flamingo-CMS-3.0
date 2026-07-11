'use client';

import { useState } from 'react';
import { Package, Truck, CheckCircle, XCircle, Clock, CreditCard, ArrowRight, Search, ChevronDown, ChevronUp, FileText, Ban } from 'lucide-react';
import { updateOrderStatus, updateOrderTracking, cancelOrder } from '../actions';
import { toast } from 'sonner';

type Order = {
  id: string;
  orderNumber: string;
  status: string;
  customerEmail: string;
  customerName: string;
  customerPhone: string | null;
  shippingAddress: { street: string; city: string; zip: string; country: string; company?: string } | null;
  items: { productId: string; variantId?: string; title: string; variantName?: string; quantity: number; priceCents: number }[];
  subtotalCents: number;
  shippingCents: number;
  discountCents: number;
  taxCents: number;
  totalCents: number;
  paymentMethod: string | null;
  trackingNumber: string | null;
  trackingUrl: string | null;
  customerNotes: string | null;
  notes: string | null;
  createdAt: Date;
};

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  pending: { label: 'Ausstehend', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  paid: { label: 'Bezahlt', color: 'bg-blue-100 text-blue-800', icon: CreditCard },
  processing: { label: 'In Bearbeitung', color: 'bg-indigo-100 text-indigo-800', icon: Package },
  shipped: { label: 'Versendet', color: 'bg-purple-100 text-purple-800', icon: Truck },
  delivered: { label: 'Zugestellt', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  cancelled: { label: 'Storniert', color: 'bg-red-100 text-red-800', icon: XCircle },
  refunded: { label: 'Erstattet', color: 'bg-zinc-100 text-zinc-800', icon: XCircle },
};

const STATUS_FLOW = ['pending', 'paid', 'processing', 'shipped', 'delivered'];

function formatPrice(cents: number) {
  return (cents / 100).toFixed(2).replace('.', ',') + ' €';
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function OrdersClient({ orders: initialOrders }: { orders: Order[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const filtered = orders.filter(o => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return o.orderNumber.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q) || o.customerEmail.toLowerCase().includes(q);
    }
    return true;
  });

  async function handleStatusChange(orderId: string, newStatus: string) {
    setUpdating(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      toast.success('Bestellstatus aktualisiert');
    } catch {
      toast.error('Bestellstatus konnte nicht aktualisiert werden');
    } finally {
      setUpdating(null);
    }
  }

  async function handleTrackingSave(orderId: string, trackingNumber: string, trackingUrl: string) {
    setUpdating(orderId);
    try {
      await updateOrderTracking(orderId, trackingNumber, trackingUrl);
      setOrders(orders.map(o => o.id === orderId ? { ...o, trackingNumber, trackingUrl } : o));
      toast.success('Sendungsverfolgung gespeichert');
    } catch {
      toast.error('Sendungsverfolgung konnte nicht gespeichert werden');
    } finally {
      setUpdating(null);
    }
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Bestellung suchen (Nr., Name, E-Mail)…"
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-300"
          />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="text-sm border border-zinc-200 rounded-lg px-3 py-2 bg-white">
          <option value="all">Alle Status</option>
          {Object.entries(STATUS_CONFIG).map(([key, { label }]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {['pending', 'paid', 'processing', 'shipped'].map(status => {
          const count = initialOrders.filter(o => o.status === status).length;
          const cfg = STATUS_CONFIG[status];
          return (
            <div key={status} className="bg-white rounded-xl border border-zinc-100 p-3 text-center">
              <p className="text-2xl font-bold">{count}</p>
              <p className="text-xs text-zinc-500">{cfg.label}</p>
            </div>
          );
        })}
      </div>

      {/* Order list */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-zinc-400">
          <Package size={40} className="mx-auto mb-3 opacity-50" />
          <p>Keine Bestellungen gefunden.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(order => {
            const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
            const Icon = cfg.icon;
            const isExpanded = expandedId === order.id;

            return (
              <div key={order.id} className="bg-white rounded-xl border border-zinc-100 overflow-hidden">
                {/* Summary row */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : order.id)}
                  className="w-full flex items-center gap-4 p-4 text-left hover:bg-zinc-50 transition"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${cfg.color}`}>
                    <Icon size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{order.orderNumber}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${cfg.color}`}>{cfg.label}</span>
                    </div>
                    <p className="text-xs text-zinc-500 truncate">{order.customerName} · {order.customerEmail}</p>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="font-bold text-sm">{formatPrice(order.totalCents)}</p>
                    <p className="text-xs text-zinc-400">{formatDate(order.createdAt)}</p>
                  </div>
                  {isExpanded ? <ChevronUp size={16} className="text-zinc-400" /> : <ChevronDown size={16} className="text-zinc-400" />}
                </button>

                {/* Expanded detail */}
                {isExpanded && (
                  <div className="border-t border-zinc-100 p-4 space-y-4">
                    {/* Items */}
                    <div>
                      <h4 className="text-xs font-semibold text-zinc-500 uppercase mb-2">Artikel</h4>
                      <div className="space-y-1">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex justify-between text-sm">
                            <span>{item.quantity}× {item.title}{item.variantName ? ` (${item.variantName})` : ''}</span>
                            <span className="font-medium">{formatPrice(item.priceCents * item.quantity)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="border-t mt-2 pt-2 space-y-1 text-sm">
                        <div className="flex justify-between"><span>Zwischensumme</span><span>{formatPrice(order.subtotalCents)}</span></div>
                        {order.shippingCents > 0 && <div className="flex justify-between"><span>Versand</span><span>{formatPrice(order.shippingCents)}</span></div>}
                        {order.discountCents > 0 && <div className="flex justify-between text-green-600"><span>Rabatt</span><span>-{formatPrice(order.discountCents)}</span></div>}
                        <div className="flex justify-between font-bold"><span>Gesamt</span><span>{formatPrice(order.totalCents)}</span></div>
                      </div>
                    </div>

                    {/* Customer & Shipping */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-xs font-semibold text-zinc-500 uppercase mb-1">Kunde</h4>
                        <p className="text-sm">{order.customerName}</p>
                        <p className="text-sm text-zinc-500">{order.customerEmail}</p>
                        {order.customerPhone && <p className="text-sm text-zinc-500">{order.customerPhone}</p>}
                      </div>
                      {order.shippingAddress && (
                        <div>
                          <h4 className="text-xs font-semibold text-zinc-500 uppercase mb-1">Lieferadresse</h4>
                          <p className="text-sm">{order.shippingAddress.street}</p>
                          <p className="text-sm">{order.shippingAddress.zip} {order.shippingAddress.city}</p>
                          {order.shippingAddress.company && <p className="text-sm text-zinc-500">{order.shippingAddress.company}</p>}
                        </div>
                      )}
                    </div>

                    {/* Customer notes */}
                    {order.customerNotes && (
                      <div>
                        <h4 className="text-xs font-semibold text-zinc-500 uppercase mb-1">Kundenhinweis</h4>
                        <p className="text-sm bg-zinc-50 rounded-lg p-2">{order.customerNotes}</p>
                      </div>
                    )}

                    {/* Invoice download */}
                    <a
                      href={`/api/shop/invoice/${order.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm px-4 py-2 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition"
                    >
                      <FileText size={14} /> Rechnung herunterladen
                    </a>

                    {/* Status change */}
                    <div>
                      <h4 className="text-xs font-semibold text-zinc-500 uppercase mb-2">Status ändern</h4>
                      <div className="flex flex-wrap gap-2">
                        {STATUS_FLOW.map(s => {
                          if (s === order.status) return null;
                          const sCfg = STATUS_CONFIG[s];
                          return (
                            <button
                              key={s}
                              onClick={() => handleStatusChange(order.id, s)}
                              disabled={updating === order.id}
                              className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border transition hover:opacity-80 disabled:opacity-50 ${sCfg.color}`}
                            >
                              <ArrowRight size={10} /> {sCfg.label}
                            </button>
                          );
                        })}
                        {order.status !== 'cancelled' && order.status !== 'refunded' && (
                          <button
                            onClick={async () => {
                              if (!confirm('Bestellung wirklich stornieren? Es wird eine Stornorechnung erstellt und der Kunde per E-Mail informiert.')) return;
                              setUpdating(order.id);
                              try {
                                await cancelOrder(order.id);
                                setOrders(orders.map(o => o.id === order.id ? { ...o, status: 'cancelled' } : o));
                                toast.success('Bestellung storniert');
                              } catch (error: unknown) {
                                toast.error(error instanceof Error ? error.message : 'Fehler beim Stornieren');
                              }
                              setUpdating(null);
                            }}
                            disabled={updating === order.id}
                            className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border border-red-200 bg-red-50 text-red-700 hover:opacity-80 disabled:opacity-50"
                          >
                            <Ban size={10} /> Stornieren
                          </button>
                        )}
                        {order.status === 'cancelled' && (
                          <a
                            href={`/api/shop/credit-note/${order.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border border-red-200 bg-red-50 text-red-700 hover:opacity-80"
                          >
                            <FileText size={10} /> Stornorechnung
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Tracking */}
                    {(order.status === 'shipped' || order.status === 'processing') && (
                      <TrackingForm
                        orderId={order.id}
                        initialNumber={order.trackingNumber || ''}
                        initialUrl={order.trackingUrl || ''}
                        onSave={handleTrackingSave}
                        disabled={updating === order.id}
                      />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function TrackingForm({ orderId, initialNumber, initialUrl, onSave, disabled }: {
  orderId: string; initialNumber: string; initialUrl: string;
  onSave: (id: string, num: string, url: string) => Promise<void>; disabled: boolean;
}) {
  const [number, setNumber] = useState(initialNumber);
  const [url, setUrl] = useState(initialUrl);

  return (
    <div>
      <h4 className="text-xs font-semibold text-zinc-500 uppercase mb-2">Sendungsverfolgung</h4>
      <div className="flex flex-col sm:flex-row gap-2">
        <input value={number} onChange={e => setNumber(e.target.value)} placeholder="Sendungsnummer" className="flex-1 text-sm border border-zinc-200 rounded-lg px-3 py-2" />
        <input value={url} onChange={e => setUrl(e.target.value)} placeholder="Tracking-URL (optional)" className="flex-1 text-sm border border-zinc-200 rounded-lg px-3 py-2" />
        <button
          onClick={() => onSave(orderId, number, url)}
          disabled={disabled || !number}
          className="text-sm px-4 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 disabled:opacity-50"
        >
          Speichern
        </button>
      </div>
    </div>
  );
}
