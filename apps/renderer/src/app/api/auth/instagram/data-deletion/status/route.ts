import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Status page for an in-progress Data Deletion Request. We delete data
 * synchronously in the POST callback, so by the time the user follows this
 * URL the deletion has already completed.
 */
export async function GET(req: NextRequest) {
  const code = new URL(req.url).searchParams.get('code') || 'unknown';
  return new NextResponse(
    `<!doctype html><html lang="de"><head><meta charset="utf-8"><title>Datenlöschung</title><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{font-family:system-ui,sans-serif;max-width:640px;margin:60px auto;padding:0 24px;color:#1a1a1a;line-height:1.55}h1{margin-top:0}.code{font-family:ui-monospace,monospace;background:#f4f4f5;padding:6px 10px;border-radius:6px;display:inline-block;font-size:14px}</style></head><body><h1>Datenlöschung abgeschlossen</h1><p>Deine bei Flamingo CMS gespeicherten Instagram-Daten wurden vollständig gelöscht. Die Verarbeitung war direkt nach Eingang deiner Anfrage abgeschlossen.</p><p>Bestätigungs-Code: <span class="code">${code.replace(/[^a-zA-Z0-9_-]/g, '')}</span></p><p>Bei Fragen erreichst du uns unter <a href="mailto:hello@flamingomedia.online">hello@flamingomedia.online</a>.</p></body></html>`,
    { headers: { 'Content-Type': 'text/html; charset=utf-8' } },
  );
}
