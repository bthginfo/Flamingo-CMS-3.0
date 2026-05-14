import { getSession } from '@/lib/session';
import { Sidebar } from '@/components/sidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  // Login page is nested under /admin but doesn't need sidebar/auth
  if (!session) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar tenantId={session.tenantId} />
      <main className="flex-1 overflow-y-auto bg-admin-bg">
        <div className="mx-auto max-w-7xl px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
