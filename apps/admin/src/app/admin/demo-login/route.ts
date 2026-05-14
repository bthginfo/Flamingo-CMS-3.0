import { NextResponse } from 'next/server';
import { createSessionToken } from '@flamingo/auth';

const DEMO_TENANT_ID = 'f50cbf53-279d-43f3-b58b-f5ae3d550ab2';

export async function GET() {
  const token = await createSessionToken(DEMO_TENANT_ID);

  const response = NextResponse.redirect(new URL('/admin/pages', process.env.NEXT_PUBLIC_ADMIN_URL || 'http://localhost:3001'));
  
  response.cookies.set('flamingo_admin_session', token, {
    path: '/admin',
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    maxAge: 60 * 60, // 1 hour for demo
  });
  
  response.cookies.set('flamingo_demo', '1', {
    path: '/admin',
    httpOnly: false,
    sameSite: 'none',
    secure: true,
    maxAge: 60 * 60,
  });

  return response;
}
