import { getSession } from '@/lib/session';
import { Sidebar } from '@/components/sidebar';
import { cookies } from 'next/headers';
import { DemoBanner } from '@/components/demo-banner';
import { PublishFab } from '@/components/publish-fab';
import { OnboardingTour } from '@/components/admin/onboarding-tour';
import { SaveProvider } from '@/components/save-context';
import { PreviewProvider } from '@/components/admin/preview-context';
import { PreviewSlot } from '@/components/admin/preview-slot';
import { Toaster } from 'sonner';
import { getTenantStyle } from '@/lib/tenant-data';

// Disable Next.js fetch() data cache for all admin routes
// This ensures DB reads always return fresh data
export const fetchCache = 'force-no-store';
export const dynamic = 'force-dynamic';

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
  const isDemo = cookieStore.get('flamingo_public_demo')?.value === session.tenantId;

  return (
    <SaveProvider>
    <PreviewProvider tenantId={session.tenantId}>
    <div className="flex h-screen overflow-hidden bg-admin-bg text-zinc-900 antialiased" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <Sidebar tenantId={session.tenantId} industry={(await getTenantStyle(session.tenantId)).industry} />
      <main className="flex-1 min-w-0 overflow-y-auto bg-admin-bg">
        {isDemo && <DemoBanner />}
        <div className="mx-auto max-w-7xl px-4 md:px-6 py-6 md:py-8 pt-16 md:pt-8">
          {children}
        </div>
      </main>
      <PreviewSlot />
      <PublishFab />
      <OnboardingTour />
      <Toaster position="top-right" richColors closeButton />
    </div>
    </PreviewProvider>
    </SaveProvider>
  );
}
