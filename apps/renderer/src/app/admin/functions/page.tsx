import Link from 'next/link';
import { Heart, CalendarDays, Inbox, ShoppingBag } from 'lucide-react';
import { getSession } from '@/lib/session';
import { getTenantStyle } from '@/lib/tenant-data';

const FEATURES = [
  {
    id: 'rsvp',
    label: 'RSVP – Gäste',
    description: 'Zu- und Absagen Ihrer Gäste verwalten.',
    section: 'rsvp',
    industry: 'wedding',
    href: '/admin/rsvp',
    icon: Heart,
    color: 'text-rose-500',
  },
  {
    id: 'reservations',
    label: 'Reservierungen',
    description: 'Tisch-Reservierungen Ihrer Gäste einsehen und verwalten.',
    section: 'reservation',
    industry: 'restaurant',
    href: '/admin/functions/reservations',
    icon: CalendarDays,
    color: 'text-amber-500',
  },
  {
    id: 'inbox',
    label: 'Kontaktanfragen',
    description: 'Eingegangene Nachrichten aus dem Kontaktformular.',
    section: 'contact (mit formEnabled: true)',
    industry: null,
    href: '/admin/inbox',
    icon: Inbox,
    color: 'text-blue-500',
  },
  {
    id: 'shop',
    label: 'Shop-Bestellungen',
    description: 'Bestellungen aus Ihrem Online-Shop.',
    section: 'shop',
    industry: 'shop',
    href: '/admin/shop',
    icon: ShoppingBag,
    color: 'text-green-500',
  },
];

export default async function FunctionsPage() {
  const session = await getSession();
  const { industry } = await getTenantStyle(session!.tenantId);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Funktionen</h1>
      <p className="text-zinc-500 text-sm mb-8">
        Interaktive Features Ihrer Website – je nach Branche und genutzten Sections verfügbar.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {FEATURES.map((f) => {
          const available = !f.industry || f.industry === industry;
          return (
            <Link
              key={f.id}
              href={f.href}
              className={`admin-card p-5 flex items-start gap-4 transition hover:ring-2 hover:ring-zinc-300 ${
                !available ? 'opacity-40 pointer-events-none' : ''
              }`}
            >
              <f.icon className={`w-6 h-6 mt-0.5 shrink-0 ${f.color}`} />
              <div>
                <p className="font-semibold">{f.label}</p>
                <p className="text-sm text-zinc-500 mt-0.5">{f.description}</p>
                <p className="text-xs text-zinc-400 mt-2">
                  Section: <code className="bg-zinc-100 px-1 rounded">{f.section}</code>
                  {!available && ' – nicht verfügbar für Ihre Branche'}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
