'use server';

import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';

async function requireSession() {
  const session = await getSession();
  if (!session) redirect('/admin/login');
  return session;
}

/**
 * Translate text using DeepL API (free or pro).
 * Falls back to a simple placeholder if no API key is configured.
 */
export async function translateTextAction(text: string, targetLang: string, sourceLang?: string): Promise<string> {
  await requireSession();
  if (!text.trim()) return '';

  const apiKey = process.env.DEEPL_API_KEY;
  if (!apiKey) {
    // No API key → return original with marker
    return `[${targetLang.toUpperCase()}] ${text}`;
  }

  const baseUrl = apiKey.endsWith(':fx')
    ? 'https://api-free.deepl.com/v2/translate'
    : 'https://api.deepl.com/v2/translate';

  const body = new URLSearchParams({
    text,
    target_lang: targetLang.toUpperCase(),
    ...(sourceLang && { source_lang: sourceLang.toUpperCase() }),
  });

  const res = await fetch(baseUrl, {
    method: 'POST',
    headers: { Authorization: `DeepL-Auth-Key ${apiKey}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!res.ok) {
    console.error('[translate] DeepL error:', res.status, await res.text());
    return text; // fallback to original
  }

  const data = await res.json();
  return data.translations?.[0]?.text || text;
}

/**
 * Translate all string values in a flat section data object.
 */
export async function translateSectionDataAction(
  data: Record<string, unknown>,
  targetLang: string,
  sourceLang?: string
): Promise<Record<string, unknown>> {
  await requireSession();

  const result: Record<string, unknown> = {};
  const translationPromises: { key: string; promise: Promise<string> }[] = [];

  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string' && value.trim()) {
      translationPromises.push({ key, promise: translateTextAction(value, targetLang, sourceLang) });
    } else if (Array.isArray(value)) {
      // Translate arrays of objects (e.g. FAQ items, features list)
      result[key] = value; // Will be handled below
    } else {
      result[key] = value;
    }
  }

  // Resolve all string translations in parallel
  const resolved = await Promise.all(translationPromises.map(async ({ key, promise }) => ({ key, value: await promise })));
  for (const { key, value } of resolved) {
    result[key] = value;
  }

  // Handle arrays with translatable string properties
  for (const [key, value] of Object.entries(data)) {
    if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
      result[key] = await Promise.all(value.map(async (item: Record<string, unknown>) => {
        const translated: Record<string, unknown> = {};
        for (const [k, v] of Object.entries(item)) {
          if (typeof v === 'string' && v.trim()) {
            translated[k] = await translateTextAction(v, targetLang, sourceLang);
          } else {
            translated[k] = v;
          }
        }
        return translated;
      }));
    }
  }

  return result;
}
