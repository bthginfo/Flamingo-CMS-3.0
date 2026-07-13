import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(process.argv[2] || 'apps/renderer/storybook-static');
const port = Number(process.argv[3] || 6007);
const mime = {
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

function safePath(requestUrl) {
  const pathname = decodeURIComponent(new URL(requestUrl, `http://127.0.0.1:${port}`).pathname);
  const candidate = path.resolve(root, `.${pathname}`);
  if (candidate !== root && !candidate.startsWith(`${root}${path.sep}`)) return null;
  return candidate;
}

const server = http.createServer((request, response) => {
  let filename = safePath(request.url || '/');
  if (!filename) {
    response.writeHead(403).end('Forbidden');
    return;
  }
  try {
    if (fs.statSync(filename).isDirectory()) filename = path.join(filename, 'index.html');
  } catch {
    response.writeHead(404).end('Not found');
    return;
  }
  const stream = fs.createReadStream(filename);
  stream.once('error', () => response.writeHead(500).end('Read error'));
  response.writeHead(200, {
    'Cache-Control': filename.endsWith('.html') || filename.endsWith('.json') ? 'no-cache' : 'public, max-age=31536000, immutable',
    'Content-Type': mime[path.extname(filename).toLowerCase()] || 'application/octet-stream',
  });
  stream.pipe(response);
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Serving ${root} at http://127.0.0.1:${port}`);
});

process.on('SIGTERM', () => server.close(() => process.exit(0)));

if (fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  // Module body intentionally starts the server.
}
