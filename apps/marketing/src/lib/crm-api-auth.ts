export function isCrmApiPath(pathname: string) {
  return pathname === '/crm/api' || pathname.startsWith('/crm/api/');
}

export function createCrmApiUnauthorizedResponse(pathname: string): Response | null {
  if (!isCrmApiPath(pathname)) return null;
  return Response.json(
    { error: 'Nicht autorisiert.' },
    {
      status: 401,
      headers: {
        'Cache-Control': 'no-store',
      },
    },
  );
}
