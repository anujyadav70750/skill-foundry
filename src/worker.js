const REPO_OWNER = 'anujyadav70750';
const REPO_NAME = 'skill-foundry';
const DEFAULT_BRANCH = 'main';
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const MAX_RESOURCE_BYTES = 200 * 1024;
const MAX_CONTACT_NAME = 100;
const MAX_CONTACT_EMAIL = 254;
const MAX_CONTACT_SUBJECT = 160;
const MAX_CONTACT_MESSAGE = 5000;

const corsHeaders = (request) => { const origin = request.headers.get('Origin'); const allowed = origin && new URL(request.url).origin === origin ? origin : null; return allowed ? { 'Access-Control-Allow-Origin': allowed, 'Vary': 'Origin' } : {}; };
const json = (body, status = 200, request = null) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...(request ? corsHeaders(request) : {}) } });
const safeFilename = (name) => String(name || 'image').normalize('NFKD').replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/^-+|-+$/g, '').toLowerCase() || 'image';
const toBase64 = (bytes) => { let binary = ''; const chunk = 0x8000; for (let i = 0; i < bytes.length; i += chunk) binary += String.fromCharCode(...bytes.subarray(i, i + chunk)); return btoa(binary); };
const githubHeaders = (token) => ({ 'Accept': 'application/vnd.github+json', 'Authorization': `Bearer ${token}`, 'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'Skill Foundry Resource Builder', 'Content-Type': 'application/json' });


async function readBoundedStream(stream, maxBytes, message = 'Request body is too large.') {
  if (!stream) return new Uint8Array();
  const reader = stream.getReader();
  const chunks = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > maxBytes) {
      await reader.cancel().catch(() => {});
      throw Object.assign(new Error(message), { status: 413 });
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return bytes;
}

async function readJsonLimited(request, maxBytes) {
  const contentLength = Number(request.headers.get('Content-Length') || 0);
  if (contentLength > maxBytes) throw Object.assign(new Error('Request body is too large.'), { status: 413 });
  const bytes = await readBoundedStream(request.body, maxBytes);
  try {
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    throw Object.assign(new Error('Invalid JSON request.'), { status: 400 });
  }
}

export class RateLimitDO {
  constructor(ctx, env) {
    this.ctx = ctx;
    this.env = env;
  }

  async fetch(request) {
    if (request.method !== 'POST') return new Response('Method not allowed.', { status: 405 });
    let policies;
    try {
      policies = await request.json();
    } catch {
      return new Response('Invalid policy.', { status: 400 });
    }
    if (!Array.isArray(policies) || policies.length < 1 || policies.length > 4) {
      return new Response('Invalid policy.', { status: 400 });
    }

    const now = Date.now();
    const result = await this.ctx.storage.transaction(async (txn) => {
      const nextEvents = [];
      let retryAt = 0;
      for (const policy of policies) {
        const key = String(policy?.key || '');
        const limit = Number(policy?.limit);
        const windowSeconds = Number(policy?.windowSeconds);
        if (!/^[a-z0-9_-]{1,32}$/i.test(key) || !Number.isInteger(limit) || limit < 1 || limit > 1000 ||
            !Number.isInteger(windowSeconds) || windowSeconds < 1 || windowSeconds > 86400) {
          throw new Error('Invalid rate-limit policy.');
        }
        const storageKey = 'events:' + key;
        const windowMs = windowSeconds * 1000;
        const events = (await txn.get(storageKey) || []).filter((time) => Number.isFinite(time) && time > now - windowMs);
        if (events.length >= limit) {
          retryAt = Math.max(retryAt, events[events.length - limit] + windowMs);
        }
        nextEvents.push({ storageKey, events });
      }
      if (retryAt > now) return { allowed: false, retryAfter: Math.max(1, Math.ceil((retryAt - now) / 1000)) };
      for (const item of nextEvents) {
        item.events.push(now);
        await txn.put(item.storageKey, item.events);
      }
      return { allowed: true };
    });

    return Response.json(result, {
      status: result.allowed ? 200 : 429,
      headers: { 'Cache-Control': 'no-store' }
    });
  }
}

async function enforceRateLimit(request, env, scope, policies) {
  if (!env.RATE_LIMITER) return json({ error: 'Security protection is temporarily unavailable. Please try again later.' }, 503, request);
  const ip = request.headers.get('CF-Connecting-IP');
  if (!ip) return json({ error: 'The request could not be verified. Please try again.' }, 503, request);
  try {
    const id = env.RATE_LIMITER.idFromName(scope + ':' + ip);
    const stub = env.RATE_LIMITER.get(id);
    const response = await stub.fetch('https://rate-limit.internal/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(policies)
    });
    const result = await response.json();
    if (!response.ok || result?.allowed !== true) return json({ error: 'Too many requests. Please wait before trying again.' }, 429, request);
    return null;
  } catch {
    return json({ error: 'Security protection is temporarily unavailable. Please try again later.' }, 503, request);
  }
}

function detectImageType(bytes) {
  if (bytes.length >= 8 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47 &&
      bytes[4] === 0x0D && bytes[5] === 0x0A && bytes[6] === 0x1A && bytes[7] === 0x0A) return { mimeType: 'image/png', extension: 'png' };
  if (bytes.length >= 3 && bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF) return { mimeType: 'image/jpeg', extension: 'jpg' };
  if (bytes.length >= 12 && String.fromCharCode(...bytes.subarray(0, 4)) === 'RIFF' &&
      String.fromCharCode(...bytes.subarray(8, 12)) === 'WEBP') return { mimeType: 'image/webp', extension: 'webp' };
  return null;
}

function safePublicHttpUrl(raw) {
  let target;
  try { target = new URL(String(raw || '')); } catch { return null; }
  if (!['http:', 'https:'].includes(target.protocol) || target.username || target.password) return null;
  const host = target.hostname.toLowerCase().replace(/\.$/, '');
  if (!host || host.length > 253 || !host.includes('.') || host.includes(':') || /^\d+(?:\.\d+){0,3}$/.test(host)) return null;
  if (/(^|\.)(localhost|local|internal|lan|home|corp|test|invalid|example|onion|localdomain)$/.test(host)) return null;
  if (target.port && !((target.protocol === 'http:' && target.port === '80') || (target.protocol === 'https:' && target.port === '443'))) return null;
  target.hash = '';
  return target;
}

async function fetchPublicUrl(raw, options = {}, maxRedirects = 4) {
  let target = safePublicHttpUrl(raw);
  if (!target) throw new Error('Only public HTTP or HTTPS websites can be checked.');
  for (let attempt = 0; attempt <= maxRedirects; attempt++) {
    const response = await fetch(target.href, { ...options, redirect: 'manual' });
    if (![301, 302, 303, 307, 308].includes(response.status)) return { response, url: target.href };
    const location = response.headers.get('Location');
    await response.body?.cancel().catch(() => {});
    if (!location || attempt === maxRedirects) throw new Error('The external website redirected too many times.');
    const next = safePublicHttpUrl(new URL(location, target).href);
    if (!next || (target.protocol === 'https:' && next.protocol !== 'https:')) throw new Error('The external website redirected to an unsupported destination.');
    target = next;
  }
  throw new Error('The external website could not be reached safely.');
}

async function readImage(request) {
  const contentLength = Number(request.headers.get('Content-Length') || 0);
  if (contentLength > MAX_IMAGE_BYTES + 256 * 1024) throw Object.assign(new Error('Image is too large. Maximum size is 8 MB.'), { status: 413 });
  const contentType = request.headers.get('Content-Type') || '';
  const isMultipart = contentType.toLowerCase().startsWith('multipart/form-data');
  const bytes = await readBoundedStream(request.body, MAX_IMAGE_BYTES + (isMultipart ? 256 * 1024 : 0), 'Image upload is too large.');
  let fileName = decodeURIComponent(request.headers.get('X-File-Name') || 'image');
  let fileBytes = bytes;
  let declaredMime = contentType.split(';')[0].trim().toLowerCase();

  if (isMultipart) {
    const copy = new Request(request.url, { method: 'POST', headers: request.headers, body: bytes });
    const form = await copy.formData();
    const file = form.get('file');
    if (!(file instanceof File)) throw Object.assign(new Error('No image file was received.'), { status: 400 });
    if (file.size > MAX_IMAGE_BYTES) throw Object.assign(new Error('Image is too large. Maximum size is 8 MB.'), { status: 413 });
    fileName = file.name || fileName;
    declaredMime = (file.type || '').toLowerCase();
    fileBytes = new Uint8Array(await file.arrayBuffer());
  }

  const detected = detectImageType(fileBytes);
  if (!detected) throw Object.assign(new Error('Use a valid PNG, JPEG or WebP image.'), { status: 415 });
  if (declaredMime && !['multipart/form-data', detected.mimeType].includes(declaredMime) &&
      !(detected.mimeType === 'image/jpeg' && declaredMime === 'image/jpg')) {
    throw Object.assign(new Error('The image file type does not match its contents.'), { status: 415 });
  }
  if (fileBytes.byteLength > MAX_IMAGE_BYTES) throw Object.assign(new Error('Image is too large. Maximum size is 8 MB.'), { status: 413 });
  return { bytes: fileBytes, fileName, mimeType: detected.mimeType, extension: detected.extension };
}
const isSameOriginAdminRequest = (request) => { const origin = request.headers.get('Origin'); const referer = request.headers.get('Referer'); const requestOrigin = new URL(request.url).origin; if (origin !== requestOrigin || !referer) return false; try { return new URL(referer).origin === requestOrigin && new URL(referer).pathname.startsWith('/admin'); } catch { return false; } };
const hasAdminBasicAuth = (request, env) => { if (!env.ADMIN_PASSWORD) return false; const authorization = request.headers.get('Authorization') || ''; const match = authorization.match(/^Basic\s+(.+)$/i); if (!match) return false; try { const decoded = atob(match[1]); const separator = decoded.indexOf(':'); if (separator < 0) return false; const username = decoded.slice(0, separator); const password = decoded.slice(separator + 1); return username === 'admin' && password === env.ADMIN_PASSWORD; } catch { return false; } };
const adminUnauthorized = () => new Response('Admin authentication required.', { status: 401, headers: { 'WWW-Authenticate': 'Basic realm="Skill Foundry Admin", charset="UTF-8"', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow, noarchive' } });
const isAdminApiRequest = (request, env) => hasAdminBasicAuth(request, env) && isSameOriginAdminRequest(request) && request.headers.get('Sec-Fetch-Site') === 'same-origin' && request.headers.get('Sec-Fetch-Mode') === 'cors';
const isSameOriginRequest = (request) => { const origin = request.headers.get('Origin'); const requestOrigin = new URL(request.url).origin; if (origin) return origin === requestOrigin; const referer = request.headers.get('Referer'); if (!referer) return false; try { return new URL(referer).origin === requestOrigin; } catch { return false; } };
const validEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const disposableEmailDomains = new Set(['10minutemail.com','10minutemail.net','guerrillamail.com','guerrillamail.net','mailinator.com','maildrop.cc','tempmail.com','temp-mail.org','throwawaymail.com','yopmail.com','yopmail.fr','getnada.com','dispostable.com','trashmail.com','fakeinbox.com','sharklasers.com','grr.la','emailondeck.com','mohmal.com','mintemail.com','mytemp.email','33mail.com','inboxkitten.com','mailnesia.com','tempr.email','discard.email','mailcatch.com','spamgourmet.com']);
async function sendContactMessage(request, env) { if (!isSameOriginRequest(request)) return json({ error: 'Contact requests must come from the Skill Foundry website.' }, 403, request); if (!env.RESEND_API_KEY || !env.CONTACT_EMAIL || !env.CONTACT_FROM_EMAIL) return json({ error: 'Contact email delivery is not configured yet.' }, 503, request); let body; try { body = await request.json(); } catch { return json({ error: 'Invalid contact request.' }, 400, request); } const name = String(body?.name || '').trim(); const email = String(body?.email || '').trim().toLowerCase(); const subject = String(body?.subject || '').trim(); const message = String(body?.message || '').trim(); const honeypot = String(body?.website || '').trim(); if (honeypot) return json({ ok: true }, 200, request); if (!name || name.length > MAX_CONTACT_NAME) return json({ error: 'Please enter a valid name.' }, 400, request); if (!email || email.length > MAX_CONTACT_EMAIL || !validEmail(email)) return json({ error: 'Please enter a valid email address.' }, 400, request); if (disposableEmailDomains.has(email.split('@')[1])) return json({ error: 'Please use a regular email address. Temporary email services are not accepted.' }, 400, request); if (!subject || subject.length > MAX_CONTACT_SUBJECT) return json({ error: 'Please enter a subject.' }, 400, request); if (!message || message.length > MAX_CONTACT_MESSAGE) return json({ error: 'Please enter a message of up to 5,000 characters.' }, 400, request); const text = ['New message from the Skill Foundry contact form', '', `Name: ${name}`, `Email: ${email}`, `Subject: ${subject}`, '', message].join('\n'); const response = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ from: env.CONTACT_FROM_EMAIL, to: [env.CONTACT_EMAIL], reply_to: email, subject: `[Skill Foundry Contact] ${subject}`, text }) }); const result = await response.json().catch(() => ({})); if (!response.ok) return json({ error: result?.message || 'We could not send your message right now. Please try again later.' }, 502, request); return json({ ok: true }, 200, request); }
async function publishResource(request, env) { if (!env.GITHUB_TOKEN) return json({ error: 'GitHub publishing is not configured. Add the GITHUB_TOKEN secret in Cloudflare.' }, 503, request); if (!isAdminApiRequest(request, env)) return json({ error: 'Publishing is available only from the admin builder.' }, 403, request); let body; try { body = await request.json(); } catch { return json({ error: 'Invalid publish request.' }, 400, request); } const slug = String(body?.slug || '').trim(); const content = String(body?.content || ''); if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return json({ error: 'Invalid resource slug.' }, 400, request); if (!content.startsWith('---')) return json({ error: 'Resource content is missing frontmatter.' }, 400, request); if (new TextEncoder().encode(content).byteLength > MAX_RESOURCE_BYTES) return json({ error: 'Resource content is too large.' }, 413, request); const path = `src/content/resources/${slug}.md`; const endpoint = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`; const existing = await fetch(`${endpoint}?ref=${DEFAULT_BRANCH}`, { headers: githubHeaders(env.GITHUB_TOKEN) }); if (existing.ok) return json({ error: `A resource with the slug \"${slug}\" already exists. Choose a different slug.` }, 409, request); if (existing.status !== 404) { const result = await existing.json().catch(() => ({})); return json({ error: result.message || `Could not check the resource path (${existing.status}).` }, existing.status, request); } const response = await fetch(endpoint, { method: 'PUT', headers: githubHeaders(env.GITHUB_TOKEN), body: JSON.stringify({ message: `Publish resource ${slug}`, content: toBase64(new TextEncoder().encode(content)), branch: DEFAULT_BRANCH, committer: { name: 'Skill Foundry Resource Builder', email: '41898282+github-actions[bot]@users.noreply.github.com' } }) }); const result = await response.json().catch(() => ({})); if (!response.ok) return json({ error: result.message || `GitHub rejected the resource publish (${response.status}).` }, response.status, request); return json({ path, slug, url: `/resources/${slug}/` }, 201, request); }

const getToolIconUrl = async (targetUrl) => {
  let target; try { target = new URL(targetUrl); } catch { return ''; }
  if (!['http:', 'https:'].includes(target.protocol)) return '';
  const fallback = `${target.origin}/favicon.ico`;
  const iconScore = (candidate) => { const href = String(candidate.href || '').toLowerCase(); const rel = String(candidate.rel || '').toLowerCase(); const type = String(candidate.type || '').toLowerCase(); const size = Number(candidate.size || 0); let score = 0; if (rel.includes('manifest-icon')) score += 90000; if (rel.includes('apple-touch-icon')) score += 80000; if (rel.includes('icon') && type.includes('svg')) score += 70000; if (rel.includes('icon')) score += 40000; if (rel.includes('mask-icon')) score += 10000; if (type.includes('svg') || href.endsWith('.svg')) score += 5000; score += Math.min(size * size, 65536); return score; };
  const parseIconLinks = (html, baseUrl) => { const found = []; const tagRe = /<link\b[^>]*>/gi; let match; while ((match = tagRe.exec(html))) { const tag = match[0]; const rel = (tag.match(/\brel\s*=\s*[\"']([^\"']+)[\"']/i)?.[1] || '').toLowerCase(); const href = tag.match(/\bhref\s*=\s*[\"']([^\"']+)[\"']/i)?.[1]; if (!href || !/(^|\s)(icon|shortcut|apple-touch-icon|mask-icon)(\s|$)/i.test(rel)) continue; const type = tag.match(/\btype\s*=\s*[\"']([^\"']+)[\"']/i)?.[1] || ''; const sizes = tag.match(/\bsizes\s*=\s*[\"']([^\"']+)[\"']/i)?.[1] || ''; const size = Math.max(0, ...sizes.split(/\s+/).map((x) => { const m = x.match(/(\d+)x(\d+)/i); return m ? Number(m[1]) : 0; })); try { found.push({ href: new URL(href, baseUrl).href, rel, type, size }); } catch {} } return found; };
  try { const landing = await fetch(target.href, { method: 'GET', headers: { 'User-Agent': 'Mozilla/5.0 Skill Foundry Logo Fetcher' }, redirect: 'follow' }); const landingUrl = landing.url || target.href; const resolvedOrigin = new URL(landingUrl).origin; const htmlType = landing.headers.get('content-type') || ''; if (htmlType.includes('text/html')) { const html = await landing.text(); const links = parseIconLinks(html, landingUrl); const manifestHref = html.match(/<link\b[^>]*\brel\s*=\s*[\"'](?:manifest|web-app-manifest)[\"'][^>]*\bhref\s*=\s*[\"']([^\"']+)[\"']/i)?.[1] || html.match(/<link\b[^>]*\bhref\s*=\s*[\"']([^\"']+)[\"'][^>]*\brel\s*=\s*[\"'](?:manifest|web-app-manifest)[\"']/i)?.[1]; if (manifestHref) { try { const manifestUrl = new URL(manifestHref, landingUrl).href; const manifestResponse = await fetch(manifestUrl, { headers: { 'User-Agent': 'Mozilla/5.0 Skill Foundry Logo Fetcher' }, redirect: 'follow' }); if (manifestResponse.ok) { const manifest = await manifestResponse.json(); for (const icon of Array.isArray(manifest.icons) ? manifest.icons : []) { if (!icon?.src) continue; const size = Math.max(0, ...String(icon.sizes || '').split(/\s+/).map((x) => { const m = x.match(/(\d+)x(\d+)/i); return m ? Number(m[1]) : 0; })); try { links.push({ href: new URL(icon.src, manifestUrl).href, rel: 'manifest-icon', type: icon.type || '', size }); } catch {} } } } catch {} } if (links.length) { links.sort((a,b) => iconScore(b) - iconScore(a)); return links[0].href; } } return `${resolvedOrigin}/favicon.ico`; } catch { return fallback; }
};
async function fetchToolLogo(request) { const url = new URL(request.url).searchParams.get('url'); if (!url) return json({ error: 'Tool website URL is required.' }, 400, request); const logoUrl = await getToolIconUrl(url); return logoUrl ? json({ logoUrl }, 200, request) : json({ error: 'Could not resolve the tool logo.' }, 404, request); }
async function fetchToolLogoImage(request) { const url = new URL(request.url).searchParams.get('url'); if (!url) return new Response('Tool website URL is required.', { status: 400 }); const logoUrl = await getToolIconUrl(url); if (!logoUrl) return new Response('', { status: 404 }); try { const response = await fetch(logoUrl, { headers: { 'User-Agent': 'Mozilla/5.0 Skill Foundry Logo Proxy' }, redirect: 'follow' }); if (!response.ok) return new Response('', { status: 404 }); const headers = new Headers(response.headers); headers.set('Cache-Control', 'public, max-age=3600'); headers.delete('set-cookie'); return new Response(response.body, { status: 200, headers }); } catch { return new Response('', { status: 502 }); } }
const injectHeadCss = (response) => new HTMLRewriter().on('head', { element(element) { element.append('<link rel="stylesheet" href="/image-display-fixes.css?v=20260924-prod-sync">', { html: true }); element.append('<link rel="stylesheet" href="/tools-workflow-overrides.css?v=20261012-3">', { html: true }); } }).transform(response);
export default { async fetch(request, env) { const url = new URL(request.url); if (request.method === 'OPTIONS' && url.pathname.startsWith('/api/')) return new Response(null, { status: 204, headers: { ...corsHeaders(request), 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type,X-File-Name' } }); if (request.method === 'POST' && url.pathname === '/api/upload-image') { try { return await uploadImage(request, env); } catch (error) { return json({ error: error?.message || 'Image upload failed.' }, error?.status || 500, request); } } if (request.method === 'POST' && url.pathname === '/api/publish-resource') { try { return await publishResource(request, env); } catch (error) { return json({ error: error?.message || 'Resource publish failed.' }, error?.status || 500, request); } } if (request.method === 'POST' && url.pathname === '/api/contact') { try { return await sendContactMessage(request, env); } catch (error) { return json({ error: error?.message || 'Contact message failed.' }, 500, request); } } if (request.method === 'GET' && url.pathname === '/api/tool-logo') { try { return await fetchToolLogo(request); } catch (error) { return json({ error: error?.message || 'Logo lookup failed.' }, 500, request); } } if (request.method === 'GET' && url.pathname === '/api/tool-logo-image') { try { return await fetchToolLogoImage(request); } catch (error) { return new Response('', { status: 500 }); } } const isAdminPage = url.pathname === '/admin' || url.pathname.startsWith('/admin/'); if (request.method === 'GET' && isAdminPage && !hasAdminBasicAuth(request, env)) return adminUnauthorized(); let response = await env.ASSETS.fetch(request); const contentType = response.headers.get('content-type') || ''; if (request.method === 'GET' && contentType.includes('text/html')) response = injectHeadCss(response); if (request.method === 'GET' && isAdminPage && contentType.includes('text/html')) { response = injectBodyScript(response, '/admin/input-output-ratio-fallback.js?v=20261106-popup-theme-v1'); response = injectBodyScript(response, '/admin/image-ratio-ui.js?v=20260909-2'); response = injectBodyScript(response, '/admin/thumbnail-crop-ui.js?v=20260909-5'); response = injectBodyScript(response, '/admin/resource-builder.js?v=20260914-5'); response = injectBodyScript(response, '/admin/resource-publisher.js?v=20260914-8'); response = injectBodyScript(response, '/admin/resource-builder-ratio.js?v=20260909-3'); response = injectBodyScript(response, '/admin/image-ratio-publisher.js?v=20260909-2'); response = injectBodyScript(response, '/admin/admin-shell-fix.js?v=20260913-2'); } return response; } };
function injectBodyScript(response, script) { return new HTMLRewriter().on('body', { element(element) { element.append(`<script src="${script}" defer></script>`, { html: true }); } }).transform(response); }
