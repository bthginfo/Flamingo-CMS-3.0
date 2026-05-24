import Link from 'next/link';
import { Heart, CalendarDays, Inbox, ShoppingBag } from 'lucide-react';

const FEATURES = [
  {
    id: 'rsvp',
    label: 'RSVP – Gäste',
    description: 'Zu- und Absagen Ihrer Gäste verwalten.',
    requiredSection: 'rsvp',
    href: '/admin/rsvp',
    icon: Heart,
    color: 'text-rose-500',
  },
  {
    id: 'reservations',
    label: 'Reservierungen',
    description: 'Tisch-Reservierungen Ihrer Gäste einsehen und verwalten.',
    requiredSection: 'reservation',
    href: '/admin/functions/reservations',
    icon: CalendarDays,
    color: 'text-amber-500',
  },
  {
    id: 'inbox',
    label: 'Kontaktanfragen',
    description: 'Eingegangene Nachrichten aus dem Kontaktformular.',
    requiredSection: 'contact (formEnabled: true)',
    href: '/admin/inbox',
    icon: Inbox,
    color: 'text-blue-500',
  },
  {
    id: 'shop',
    label: 'Shop-Bestellungen',
    description: 'Bestellungen aus Ihrem Online-Shop.',
    requiredSection: 'shop',
    href: '/admin/shop',
    icon: ShoppingBag,
    color: 'text-green-500',
  },
];

export default function FunctionsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Funktionen</h1>
      <p className="text-zinc-500 text-sm mb-8">
        Interaktive Features Ihrer Website. Jede Funktion benötigt die passende Section auf einer Ihrer Seiten.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {FEATURES.map((f) => (
          <Link
            key={f.id}
            href={f.href}
            className="admin-card p-5 flex items-start gap-4 transition hover:ring-2 hover:ring-zinc-300"
          >
            <f.icon className={`w-6 h-6 mt-0.5 shrink-0 ${f.color}`} />
            <div>
              <p className="font-semibold">{f.label}</p>
              <p className="text-sm text-zinc-500 mt-0.5">{f.description}</p>
              <p className="text-xs text-zinc-400 mt-2">
                Benötigt Section: <code className="bg-zinc-100 px-1 rounded">{f.requiredSection}</code>
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
