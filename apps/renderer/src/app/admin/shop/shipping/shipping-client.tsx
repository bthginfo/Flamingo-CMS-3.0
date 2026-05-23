'use client';

import { useState } from 'react';
import { Plus, Trash2, MapPin, Truck } from 'lucide-react';
import { createShippingZone, deleteShippingZone, createShippingMethod, updateShippingMethod, deleteShippingMethod } from '../actions';

type Method = { id: string; name: string; priceCents: number; freeAboveCents: number | null; estimatedDays: string | null; active: boolean };
type Zone = { id: string; name: string; countries: string[] | null; methods: Method[] };

function formatPrice(cents: number) {
  return (cents / 100).toFixed(2).replace('.', ',') + ' €';
}

export function ShippingClient({ zones: initialZones }: { zones: Zone[] }) {
  const [zones] = useState(initialZones);
  const [showNewZone, setShowNewZone] = useState(false);
  const [newZoneName, setNewZoneName] = useState('');
  const [newZoneCountries, setNewZoneCountries] = useState('DE');
  const [addingMethodZone, setAddingMethodZone] = useState<string | null>(null);
  const [methodForm, setMethodForm] = useState({ name: '', priceCents: '', freeAboveCents: '', estimatedDays: '' });

  async function handleCreateZone() {
    if (!newZoneName.trim()) return;
    await createShippingZone({
      name: newZoneName,
      countries: newZoneCountries.split(',').map(c => c.trim().toUpperCase()).filter(Boolean),
    });
    setNewZoneName('');
    setNewZoneCountries('DE');
    setShowNewZone(false);
  }

  async function handleAddMethod(zoneId: string) {
    if (!methodForm.name || !methodForm.priceCents) return;
    await createShippingMethod({
      zoneId,
      name: methodForm.name,
      priceCents: Math.round(parseFloat(methodForm.priceCents) * 100),
      freeAboveCents: methodForm.freeAboveCents ? Math.round(parseFloat(methodForm.freeAboveCents) * 100) : undefined,
      estimatedDays: methodForm.estimatedDays || undefined,
    });
    setMethodForm({ name: '', priceCents: '', freeAboveCents: '', estimatedDays: '' });
    setAddingMethodZone(null);
  }

  return (
    <div className="space-y-6">
      {zones.length === 0 && !showNewZone && (
        <div className="text-center py-16 text-zinc-400">
          <MapPin size={40} className="mx-auto mb-3 opacity-50" />
          <p>Noch keine Versandzonen angelegt.</p>
        </div>
      )}

      {zones.map(zone => (
        <div key={zone.id} className="bg-white rounded-xl border border-zinc-100 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-zinc-50">
            <div>
              <h3 className="font-semibold">{zone.name}</h3>
              <p className="text-xs text-zinc-400">Länder: {(zone.countries || []).join(', ') || 'Alle'}</p>
            </div>
            <button onClick={() => deleteShippingZone(zone.id)} className="text-red-400 hover:text-red-600 p-1">
              <Trash2 size={16} />
            </button>
          </div>

          <div className="p-4 space-y-2">
            {zone.methods.map(method => (
              <div key={method.id} className="flex items-center justify-between py-2 px-3 bg-zinc-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Truck size={14} className="text-zinc-400" />
                  <div>
                    <p className="text-sm font-medium">{method.name}</p>
                    <p className="text-xs text-zinc-400">
                      {formatPrice(method.priceCents)}
                      {method.freeAboveCents && ` · Kostenlos ab ${formatPrice(method.freeAboveCents)}`}
                      {method.estimatedDays && ` · ${method.estimatedDays}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateShippingMethod(method.id, { active: !method.active })}
                    className={`text-xs px-2 py-0.5 rounded-full ${method.active ? 'bg-green-100 text-green-700' : 'bg-zinc-200 text-zinc-500'}`}
                  >
                    {method.active ? 'Aktiv' : 'Inaktiv'}
                  </button>
                  <button onClick={() => deleteShippingMethod(method.id)} className="text-red-400 hover:text-red-600">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}

            {addingMethodZone === zone.id ? (
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <input value={methodForm.name} onChange={e => setMethodForm(f => ({ ...f, name: e.target.value }))} placeholder="Name (z.B. DHL Paket)" className="flex-1 text-sm border border-zinc-200 rounded-lg px-3 py-2" />
                <input value={methodForm.priceCents} onChange={e => setMethodForm(f => ({ ...f, priceCents: e.target.value }))} placeholder="Preis (€)" type="number" step="0.01" className="w-24 text-sm border border-zinc-200 rounded-lg px-3 py-2" />
                <input value={methodForm.freeAboveCents} onChange={e => setMethodForm(f => ({ ...f, freeAboveCents: e.target.value }))} placeholder="Frei ab (€)" type="number" step="0.01" className="w-28 text-sm border border-zinc-200 rounded-lg px-3 py-2" />
                <input value={methodForm.estimatedDays} onChange={e => setMethodForm(f => ({ ...f, estimatedDays: e.target.value }))} placeholder="Lieferzeit" className="w-28 text-sm border border-zinc-200 rounded-lg px-3 py-2" />
                <button onClick={() => handleAddMethod(zone.id)} className="text-sm px-4 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800">Anlegen</button>
                <button onClick={() => setAddingMethodZone(null)} className="text-sm px-3 py-2 text-zinc-500 hover:text-zinc-700">Abbrechen</button>
              </div>
            ) : (
              <button onClick={() => setAddingMethodZone(zone.id)} className="flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-700 pt-1">
                <Plus size={14} /> Versandmethode hinzufügen
              </button>
            )}
          </div>
        </div>
      ))}

      {showNewZone ? (
        <div className="bg-white rounded-xl border border-zinc-100 p-4 space-y-3">
          <h3 className="font-semibold">Neue Versandzone</h3>
          <input value={newZoneName} onChange={e => setNewZoneName(e.target.value)} placeholder="Zonenname (z.B. Deutschland)" className="w-full text-sm border border-zinc-200 rounded-lg px-3 py-2" />
          <input value={newZoneCountries} onChange={e => setNewZoneCountries(e.target.value)} placeholder="Ländercodes (kommagetrennt, z.B. DE,AT,CH)" className="w-full text-sm border border-zinc-200 rounded-lg px-3 py-2" />
          <div className="flex gap-2">
            <button onClick={handleCreateZone} className="text-sm px-4 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800">Erstellen</button>
            <button onClick={() => setShowNewZone(false)} className="text-sm px-3 py-2 text-zinc-500 hover:text-zinc-700">Abbrechen</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setShowNewZone(true)} className="flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 px-4 py-3 border border-dashed border-zinc-200 rounded-xl w-full justify-center hover:border-zinc-400 transition">
          <Plus size={16} /> Neue Versandzone
        </button>
      )}
    </div>
  );
}
