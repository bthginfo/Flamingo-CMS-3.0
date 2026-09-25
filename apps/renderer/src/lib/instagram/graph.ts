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
  return parseUserMediaResponse(await res.json());
}

export function parseUserMediaResponse(payload: unknown): IgMedia[] {
  if (!payload || typeof payload !== 'object' || !Array.isArray((payload as { data?: unknown }).data)) {
    throw new Error('Instagram media response is invalid: expected a data array');
  }
  const seenIds = new Set<string>();
  return (payload as { data: unknown[] }).data.map((value, index) => {
    if (!value || typeof value !== 'object') throw new Error(`Instagram media response is invalid at item ${index + 1}`);
    const item = value as Record<string, unknown>;
    if (typeof item.id !== 'string' || !item.id || item.id.length > 64) throw new Error(`Instagram media response has an invalid ID at item ${index + 1}`);
    if (seenIds.has(item.id)) throw new Error(`Instagram media response contains duplicate ID ${item.id}`);
    seenIds.add(item.id);
    if (!['IMAGE', 'VIDEO', 'CAROUSEL_ALBUM'].includes(String(item.media_type))) throw new Error(`Instagram media response has an invalid media type at item ${index + 1}`);
    if (typeof item.media_url !== 'string' || !item.media_url || typeof item.permalink !== 'string' || !item.permalink) {
      throw new Error(`Instagram media response is missing a media URL or permalink at item ${index + 1}`);
    }
    if (typeof item.timestamp !== 'string' || !Number.isFinite(new Date(item.timestamp).getTime())) {
      throw new Error(`Instagram media response has an invalid timestamp at item ${index + 1}`);
    }
    if (item.caption !== undefined && item.caption !== null && typeof item.caption !== 'string') throw new Error(`Instagram media response has an invalid caption at item ${index + 1}`);
    if (item.thumbnail_url !== undefined && item.thumbnail_url !== null && typeof item.thumbnail_url !== 'string') throw new Error(`Instagram media response has an invalid thumbnail URL at item ${index + 1}`);
    return {
      id: item.id,
      media_type: item.media_type as IgMedia['media_type'],
      media_url: item.media_url,
      ...(item.thumbnail_url == null ? {} : { thumbnail_url: item.thumbnail_url as string }),
      permalink: item.permalink,
      ...(item.caption == null ? {} : { caption: item.caption as string }),
      timestamp: item.timestamp,
    };
  });
}
