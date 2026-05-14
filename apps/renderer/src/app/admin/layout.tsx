import { getSession } from '@/lib/session';
import { Sidebar } from '@/components/sidebar';
import { cookies } from 'next/headers';
import { DemoBanner } from '@/components/demo-banner';
import { Toaster } from 'sonner';

// Disable Next.js fetch() data cache for all admin routes
// This ensures DB reads always return fresh data
export const fetchCache = 'force-no-store';

export const metadata = {
  title: 'Flamingo CMS',
  robots: 'noindex,nofollow',
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  // Login page is nested under /admin but doesn't need sidebar/auth
  if (!session) {
    return (
      <div className="bg-admin-bg text-zinc-900 antialiased font-sans min-h-screen" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        {children}
        <Toaster position="top-right" richColors closeButton />
      </div>
    );
  }

  const cookieStore = await cookies();
  const isDemo = cookieStore.get('flamingo_demo')?.value === '1';

  return (
    <div className="flex h-screen overflow-hidden bg-admin-bg text-zinc-900 antialiased" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <Sidebar tenantId={session.tenantId} />
      <main className="flex-1 overflow-y-auto bg-admin-bg">
        {isDemo && <DemoBanner />}
        <div className="mx-auto max-w-7xl px-6 py-8">
          {children}
        </div>
      </main>
      <Toaster position="top-right" richColors closeButton />
    </div>
  );
}
