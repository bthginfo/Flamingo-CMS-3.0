'use server';

import { cookies } from 'next/headers';
import { buildLogoutCookie } from '@flamingo/auth';

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.set('flamingo_admin_session', '', {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 0,
  });
}
