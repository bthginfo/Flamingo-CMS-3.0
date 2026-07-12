export const runtime = 'nodejs';

/**
 * Legacy public endpoint. CRM mail is purpose-bound under /crm/api/send-email,
 * where the scoped CRM session cookie is available and re-verified in-handler.
 */
export async function POST() {
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
