/**
 * Instagram Graph API client (Business / Creator accounts).
 * Docs: https://developers.facebook.com/docs/instagram-platform/instagram-graph-api
 */

const IG_AUTHORIZE_URL = 'https://www.instagram.com/oauth/authorize';
const IG_SHORT_TOKEN_URL = 'https://api.instagram.com/oauth/access_token';
const IG_LONG_TOKEN_URL = 'https://graph.instagram.com/access_token';
const IG_REFRESH_URL = 'https://graph.instagram.com/refresh_access_token';
const IG_GRAPH = 'https://graph.instagram.com';

const SCOPES = 'instagram_business_basic';

export function buildAuthorizeUrl(state: string): string {
  const appId = process.env.META_APP_ID;
  const redirect = process.env.META_REDIRECT_URI;
  if (!appId) throw new Error('META_APP_ID not set');
  if (!redirect) throw new Error('META_REDIRECT_URI not set');
  const params = new URLSearchParams({
    client_id: appId,
    redirect_uri: redirect,
    response_type: 'code',
    scope: SCOPES,
    state,
  });
  return `${IG_AUTHORIZE_URL}?${params.toString()}`;
}

export async function exchangeCodeForShortToken(code: string): Promise<{ access_token: string; user_id: string }> {
  const appId = process.env.META_APP_ID;
  const appSecret = process.env.META_APP_SECRET;
  const redirect = process.env.META_REDIRECT_URI;
  if (!appId || !appSecret || !redirect) throw new Error('META_APP_ID / META_APP_SECRET / META_REDIRECT_URI missing');

  const body = new URLSearchParams({
    client_id: appId,
    client_secret: appSecret,
    grant_type: 'authorization_code',
    redirect_uri: redirect,
    code,
  });

  const res = await fetch(IG_SHORT_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  if (!res.ok) throw new Error(`Short token exchange failed: ${res.status} ${await res.text()}`);
  return res.json();
}

export async function exchangeShortForLongToken(shortToken: string): Promise<{ access_token: string; token_type: string; expires_in: number }> {
  const appSecret = process.env.META_APP_SECRET;
  if (!appSecret) throw new Error('META_APP_SECRET missing');
  const params = new URLSearchParams({
    grant_type: 'ig_exchange_token',
    client_secret: appSecret,
    access_token: shortToken,
  });
  const res = await fetch(`${IG_LONG_TOKEN_URL}?${params.toString()}`);
  if (!res.ok) throw new Error(`Long token exchange failed: ${res.status} ${await res.text()}`);
  return res.json();
}

export async function refreshLongToken(longToken: string): Promise<{ access_token: string; token_type: string; expires_in: number }> {
  const params = new URLSearchParams({
    grant_type: 'ig_refresh_token',
    access_token: longToken,
  });
  const res = await fetch(`${IG_REFRESH_URL}?${params.toString()}`);
  if (!res.ok) throw new Error(`Token refresh failed: ${res.status} ${await res.text()}`);
  return res.json();
}

export async function fetchUserProfile(accessToken: string): Promise<{ id: string; username: string; account_type: string }> {
  const params = new URLSearchParams({
    fields: 'id,username,account_type',
    access_token: accessToken,
  });
  const res = await fetch(`${IG_GRAPH}/me?${params.toString()}`);
  if (!res.ok) throw new Error(`Profile fetch failed: ${res.status} ${await res.text()}`);
  return res.json();
}

export type IgMedia = {
  id: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  caption?: string;
  timestamp: string;
};

export async function fetchUserMedia(accessToken: string, limit = 25): Promise<IgMedia[]> {
  const params = new URLSearchParams({
    fields: 'id,media_type,media_url,thumbnail_url,permalink,caption,timestamp',
    limit: String(limit),
    access_token: accessToken,
  });
  const res = await fetch(`${IG_GRAPH}/me/media?${params.toString()}`);
  if (!res.ok) throw new Error(`Media fetch failed: ${res.status} ${await res.text()}`);
  const json = await res.json() as { data: IgMedia[] };
  return json.data || [];
}
