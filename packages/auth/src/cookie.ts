// Edge-safe cookie constants — no bcrypt/jose imports. The middleware runs in
// the Edge runtime and must not pull the Node-only password-hashing code into
// its bundle just to learn the cookie name.
export const SESSION_COOKIE_NAME = 'flamingo_admin_session';

export function getSessionCookieName() {
  return SESSION_COOKIE_NAME;
}
