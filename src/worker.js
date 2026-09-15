const REPO_OWNER = 'anujyadav70750';
const REPO_NAME = 'skill-foundry';
const DEFAULT_BRANCH = 'main';
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const MAX_RESOURCE_BYTES = 200 * 1024;
const MAX_CONTACT_NAME = 100;
const MAX_CONTACT_EMAIL = 254;
const MAX_CONTACT_SUBJECT = 160;
const MAX_CONTACT_MESSAGE = 5000;

const corsHeaders = (request) => {
  const origin = request.headers.get('Origin');
  const allowed = origin && new URL(request.url).origin === origin ? origin : null;
  return allowed ? { 'Access-Control-Allow-Origin': allowed, 'Vary': 'Origin' } : {};
};

const json = (body, status = 200, request = null) => new Response(JSON.stringify(body), {
  status,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    ...(request ? corsHeaders(request) : {})
  }
});

const safeFilename = (name) => String(name || 'image').normalize('NFKD').replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/^-+|-+$/g, '').toLowerCase() || 'image';

const toBase64 = (bytes) => {
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  return btoa(binary);
};

const githubHeaders = (token) => ({
  'Accept': 'application/vnd.github+json',
  'Authorization': `Bearer ${token}`,
  'X-GitHub-Api-Version': '2022-11-28',
  'User-Agent': 'Skill Foundry Resource Builder',
  'Content-Type': 'application/json'
});

const githubRequest = async (token, path, init = {}) => fetch(`https://api.github.com${path}`, {
  ...init,
  headers: { ...githubHeaders(token), ...(init.headers || {}) }
});

const parseJson = async (response) => {
  try { return await response.json(); } catch { return null; }
};

const normalizeUrl = (value, base = null) => {
  try {
    const url = base ? new URL(value, base) : new URL(value);
    if (!/^https?:$/.test(url.protocol)) return null;
    return url.href;
  } catch { return null; }
};

const isSafeHttpUrl = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch { return false; }
};

const readJsonBody = async (request) => {
  try { return await request.json(); } catch { return null; }
};

const githubGetFile = async (token, path) => {
  const response = await githubRequest(token, `/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}?ref=${encodeURIComponent(DEFAULT_BRANCH)}`);
  const body = await parseJson(response);
  return response.ok ? body : null;
};

const githubPutFile = async (token, path, content, message, sha) => {
  return githubRequest(token, `/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`, {
    method: 'PUT',
    body: JSON.stringify({ message, content: toBase64(new TextEncoder().encode(content)), branch: DEFAULT_BRANCH, sha })
  });
};

const htmlIcon = (html, pageUrl) => {
  const tags = html.match(/<link\b[^>]*>/gi) || [];
  for (const tag of tags) {
    const rel = (tag.match(/\brel\s*=\s*["']([^"']+)["']/i)?.[1] || '').toLowerCase();
    if (!/(^|\s)(icon|shortcut|apple-touch-icon)(\s|$)/.test(rel)) continue;
    const href = tag.match(/\bhref\s*=\s*["']([^"']+)["']/i)?.[1];
    const resolved = normalizeUrl(href, pageUrl);
    if (resolved) return resolved;
  }
  return null;
};

const fetchToolLogo = async (targetUrl) => {
  if (!isSafeHttpUrl(targetUrl)) return null;
  try {
    const response = await fetch(targetUrl, { redirect: 'follow', headers: { 'User-Agent': 'Mozilla/5.0 Skill Foundry' } });
    const finalUrl = response.url || targetUrl;
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html')) return null;
    const html = await response.text();
    const declared = htmlIcon(html, finalUrl);
    if (declared) return declared;
    const origin = new URL(finalUrl).origin;
    for (const candidate of ['/favicon.svg', '/favicon.png', '/favicon.ico', '/apple-touch-icon.png']) {
      try {
        const probe = await fetch(origin + candidate, { redirect: 'follow', method: 'HEAD' });
        if (probe.ok) return origin + candidate;
      } catch {}
    }
  } catch {}
  return null;
};

const injectHeadCss = (response) => {
  return response;
};

const injectBodyScript = (response, src) => {
  return new HTMLRewriter().on('body', {
    element(element) {
      element.append(`<script type="module" src="${src}"></script>`, { html: true });
    }
  }).transform(response);
};

const handleToolLogo = async (request, url) => {
  const target = url.searchParams.get('url');
  if (!target || !isSafeHttpUrl(target)) return json({ error: 'Invalid URL' }, 400, request);
  const logo = await fetchToolLogo(target);
  return logo ? json({ logo }, 200, request) : json({ error: 'Logo not found' }, 404, request);
};

const handleResourceImage = async (request, env, url) => {
  return json({ error: 'Not implemented' }, 404, request);
};

const handleContact = async (request, env) => {
  return json({ error: 'Not implemented' }, 404, request);
};

const handleAdminApi = async (request, env, url) => {
  return json({ error: 'Not implemented' }, 404, request);
};

const handleApi = async (request, env, url) => {
  if (url.pathname === '/api/tool-logo' && request.method === 'GET') return handleToolLogo(request, url);
  if (url.pathname === '/api/contact' && request.method === 'POST') return handleContact(request, env);
  if (url.pathname.startsWith('/api/admin/')) return handleAdminApi(request, env, url);
  if (url.pathname.startsWith('/api/resource-image')) return handleResourceImage(request, env, url);
  return json({ error: 'Not found' }, 404, request);
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/api/')) return handleApi(request, env, url);
    let response = await env.ASSETS.fetch(request);
    const contentType = response.headers.get('content-type') || '';
    if (request.method === 'GET' && contentType.includes('text/html')) response = injectHeadCss(response);
    if (request.method === 'GET' && url.pathname.startsWith('/resources/') && contentType.includes('text/html')) {
      response = injectBodyScript(response, '/resource-tool-logos.js?v=20260915-3');
      response = injectBodyScript(response, '/resource-prompt.js?v=20260916-2');
    }
    const isAdminPage = url.pathname === '/admin' || url.pathname.startsWith('/admin/');
    if (request.method === 'GET' && isAdminPage && contentType.includes('text/html')) {
      response = injectBodyScript(response, '/admin/resource-builder.js');
      response = injectBodyScript(response, '/admin/resource-publisher.js');
    }
    return response;
  }
};
