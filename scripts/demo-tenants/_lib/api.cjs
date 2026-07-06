/**
 * Minimal API client for the public Flamingo content API.
 * One PAT per tenant. Retries on transient failures. No external deps.
 *
 * Usage:
 *   const Api = require('./api.cjs');
 *   const api = new Api({ pat: 'flm_pat_xxx', host: 'flamingo-renderer.vercel.app' });
 *   await api.brand({ companyName: '...' });
 *   const page = await api.createPage({ slug: 'leistungen', title: 'Leistungen', sections: [...] });
 */
const https = require('https');
const http = require('http');
const tls = require('tls');
const fs = require('fs');

const DEFAULT_HOST = 'flamingo-renderer.vercel.app';

// When running inside a sandbox whose egress is forced through an HTTP CONNECT
// proxy (HTTPS_PROXY), Node's https.request would otherwise connect directly and
// be blocked. This agent tunnels through the proxy. No-op (undefined) when no
// proxy is set, so local runs are unaffected.
function makeProxyAgent() {
  const px = process.env.HTTPS_PROXY || process.env.https_proxy;
  if (!px) return undefined;
  const u = new URL(px);
  let ca;
  try { ca = fs.readFileSync('/root/.ccr/ca-bundle.crt'); } catch { /* optional */ }
  return new (class extends https.Agent {
    createConnection(opts, cb) {
      const req = http.request({
        host: u.hostname,
        port: u.port || 80,
        method: 'CONNECT',
        path: `${opts.host}:${opts.port || 443}`,
        headers: u.username ? { 'Proxy-Authorization': 'Basic ' + Buffer.from(`${decodeURIComponent(u.username)}:${decodeURIComponent(u.password)}`).toString('base64') } : {},
      });
      req.on('connect', (res, socket) => {
        if (res.statusCode !== 200) { cb(new Error(`proxy CONNECT failed: ${res.statusCode}`)); return; }
        const tlsSock = tls.connect({ socket, servername: opts.host, ...(ca ? { ca } : {}) }, () => cb(null, tlsSock));
        tlsSock.on('error', cb);
      });
      req.on('error', cb);
      req.end();
    }
  })();
}
const PROXY_AGENT = makeProxyAgent();

class ApiError extends Error {
  constructor(msg, { status, body, endpoint } = {}) {
    super(msg);
    this.status = status;
    this.body = body;
    this.endpoint = endpoint;
  }
}

class Api {
  constructor({ pat, host = DEFAULT_HOST, verbose = true } = {}) {
    if (!pat) throw new Error('Api: pat is required');
    // The public API expects tokens prefixed with `flm_pat_`. Demo tenant
    // PATs are sometimes stored as the bare hex; auto-prefix to be robust.
    this.pat = pat.startsWith('flm_pat_') ? pat : 'flm_pat_' + pat;
    this.host = host;
    this.verbose = verbose;
  }

  _log(...a) { if (this.verbose) console.log('[api]', ...a); }

  request(method, path, body, { retries = 2, timeoutMs = 60000 } = {}) {
    return new Promise((resolve, reject) => {
      const attempt = (left) => {
        const data = body !== undefined ? JSON.stringify(body) : null;
        const req = https.request({
          hostname: this.host,
          method,
          path,
          ...(PROXY_AGENT ? { agent: PROXY_AGENT } : {}),
          headers: {
            Authorization: 'Bearer ' + this.pat,
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'User-Agent': 'flamingo-demo-filler',
            ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
          },
        }, (res) => {
          const chunks = [];
          res.on('data', (c) => chunks.push(c));
          res.on('end', () => {
            const raw = Buffer.concat(chunks).toString('utf8');
            let parsed;
            try { parsed = raw ? JSON.parse(raw) : null; } catch { parsed = raw; }
            if (res.statusCode >= 200 && res.statusCode < 300) {
              resolve(parsed);
              return;
            }
            const retriable = res.statusCode >= 500 || res.statusCode === 429;
            if (retriable && left > 0) {
              setTimeout(() => attempt(left - 1), 1200 * (3 - left));
              return;
            }
            reject(new ApiError(`HTTP ${res.statusCode} on ${method} ${path}`, {
              status: res.statusCode, body: parsed, endpoint: `${method} ${path}`,
            }));
          });
        });
        req.setTimeout(timeoutMs, () => req.destroy(new Error(`Timeout ${method} ${path}`)));
        req.on('error', (e) => {
          if (left > 0) { setTimeout(() => attempt(left - 1), 1200); return; }
          reject(e);
        });
        if (data) req.write(data);
        req.end();
      };
      attempt(retries);
    });
  }

  // ── content endpoints (one wrapper per documented operation) ──────────────
  brand(body)         { return this.request('PUT',  '/api/v1/content/brand', body); }
  contact(body)       { return this.request('PUT',  '/api/v1/content/contact', body); }
  navigation(body)    { return this.request('PUT',  '/api/v1/content/navigation', body); }
  footer(body)        { return this.request('PUT',  '/api/v1/content/footer', body); }
  design(body)        { return this.request('PUT',  '/api/v1/content/design', body); }
  style(body)         { return this.request('PUT',  '/api/v1/content/style', body); }
  socialLinks(body)   { return this.request('PUT',  '/api/v1/content/social-links', body); }
  formFields(body)    { return this.request('PUT',  '/api/v1/content/form-fields', body); }
  openingHours(body)  { return this.request('PUT',  '/api/v1/content/opening-hours', body); }
  seoGlobal(body)     { return this.request('PUT',  '/api/v1/content/seo', body); }
  seoPage(id, body)   { return this.request('PUT',  `/api/v1/content/seo/${id}`, body); }
  createPage(body)    { return this.request('POST', '/api/v1/content/pages', body); }
  updatePage(id, body){ return this.request('PUT',  `/api/v1/content/pages/${id}`, body); }
  patchPage(id, body) { return this.request('PATCH',`/api/v1/content/pages/${id}`, body); }
  deletePage(id)      { return this.request('DELETE',`/api/v1/content/pages/${id}`); }
  listCollections()   { return this.request('GET',  '/api/v1/content/collections'); }
  createCollection(b) { return this.request('POST', '/api/v1/content/collections', b); }
  createItem(key, b)  { return this.request('POST', `/api/v1/content/collections/${key}/items`, b); }
  updateItem(key, id, b){ return this.request('PUT', `/api/v1/content/collections/${key}/items/${id}`, b); }
  deleteItem(key, id) { return this.request('DELETE',`/api/v1/content/collections/${key}/items/${id}`); }
  debug()             { return this.request('GET',  '/api/v1/content/debug'); }
  validate()          { return this.request('GET',  '/api/v1/content/validate'); }
  publish(body)       { return this.request('POST', '/api/v1/content/publish', body || {}); }
  instructions()      { return this.request('GET',  '/api/v1/instructions'); }
}

module.exports = Api;
module.exports.ApiError = ApiError;
