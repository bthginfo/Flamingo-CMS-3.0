import Link from 'next/link';

// Root 404 — shown for any path that no tenant page, collection item or shop
// route resolves. Kept tenant-neutral (no brand tokens: outside the tenant
// [data-style] wrapper those would not resolve).
export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
      <div className="max-w-md text-center">
        <p className="text-7xl font-black tracking-tight text-gray-200">404</p>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">Seite nicht gefunden</h1>
        <p className="mt-2 text-gray-500">
          Die aufgerufene Seite existiert nicht oder wurde verschoben.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="rounded-full bg-gray-900 px-6 py-3 font-medium text-white transition-colors hover:bg-gray-700"
          >
            Zur Startseite
          </Link>
        </div>
      </div>
    </div>
  );
}
