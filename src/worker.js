const REPO_OWNER = 'anujyadav70750';
const REPO_NAME = 'skill-foundry';
const DEFAULT_BRANCH = 'main';
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

const corsHeaders = (request) => {
  const origin = request.headers.get('Origin');
  const allowed = origin && new URL(request.url).origin === origin ? origin : null;
  return allowed ? { 'Access-Control-Allow-Origin': allowed, 'Vary': 'Origin' } : {};
};
const json = (body, status = 200, request = null) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...(request ? corsHeaders(request) : {}) } });
const safeFilename = (name) => { const cleaned = String(name || 'image').normalize('NFKD').replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/^-+|-+$/g, '').toLowerCase(); return cleaned || 'image'; };
const toBase64 = (bytes) => { let binary = ''; const chunk = 0x8000; for (let i = 0; i < bytes.length; i += chunk) binary += String.fromCharCode(...bytes.subarray(i, i + chunk)); return btoa(binary); };
const githubHeaders = (token) => ({ 'Accept': 'application/vnd.github+json', 'Authorization': `Bearer ${token}`, 'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'Skill-Foundry-Resource-Builder', 'Content-Type': 'application/json' });

async function readImage(request) {
  const contentLength = Number(request.headers.get('Content-Length') || 0);
  if (contentLength > MAX_IMAGE_BYTES) throw Object.assign(new Error('Image is too large. Maximum size is 8 MB.'), { status: 413 });
  const type = request.headers.get('Content-Type') || '';
  let fileName = decodeURIComponent(request.headers.get('X-File-Name') || 'image'); let mimeType = type.split(';')[0].trim().toLowerCase(); let bytes;
  if (type.toLowerCase().startsWith('multipart/form-data')) {
    const form = await request.formData(); const file = form.get('file');
    if (!(file instanceof File)) throw Object.assign(new Error('No image file was received.'), { status: 400 });
    fileName = file.name || fileName; mimeType = file.type || mimeType;
    if (file.size > MAX_IMAGE_BYTES) throw Object.assign(new Error('Image is too large. Maximum size is 8 MB.'), { status: 413 });
    bytes = new Uint8Array(await file.arrayBuffer());
  } else {
    if (!mimeType.startsWith('image/')) throw Object.assign(new Error('Only image files are allowed.'), { status: 415 });
    bytes = new Uint8Array(await request.arrayBuffer()); if (bytes.byteLength > MAX_IMAGE_BYTES) throw Object.assign(new Error('Image is too large. Maximum size is 8 MB.'), { status: 413 });
  }
  if (!mimeType.startsWith('image/')) throw Object.assign(new Error('Only image files are allowed.'), { status: 415 });
  return { bytes, fileName, mimeType };
}

async function uploadImage(request, env) {
  if (!env.GITHUB_TOKEN) return json({ error: 'GitHub upload is not configured. Add the GITHUB_TOKEN secret in Cloudflare.' }, 503, request);
  const { bytes, fileName, mimeType } = await readImage(request);
  const rawExt = fileName.includes('.') ? fileName.split('.').pop().toLowerCase() : (mimeType.split('/')[1] || 'jpg');
  const ext = /^[a-z0-9]{1,8}$/.test(rawExt) ? rawExt : 'jpg'; const filename = `${safeFilename(fileName.replace(/\.[^.]+$/, ''))}-${Date.now()}.${ext}`; const path = `public/images/${filename}`;
  const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`, { method: 'PUT', headers: githubHeaders(env.GITHUB_TOKEN), body: JSON.stringify({ message: `Add resource image ${filename}`, content: toBase64(bytes), branch: DEFAULT_BRANCH, committer: { name: 'Skill Foundry Resource Builder', email: '41898282+github-actions[bot]@users.noreply.github.com' } }) });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) return json({ error: result.message || `GitHub rejected the image upload (${response.status}).` }, response.status, request);
  return json({ path: `/images/${filename}`, name: filename }, 200, request);
}

async function fetchToolLogo(request) {
  const url = new URL(request.url).searchParams.get('url'); if (!url) return json({ error: 'Tool website URL is required.' }, 400, request);
  let target; try { target = new URL(url); } catch { return json({ error: 'Invalid tool website URL.' }, 400, request); }
  if (!['http:', 'https:'].includes(target.protocol)) return json({ error: 'Only HTTP and HTTPS websites are supported.' }, 400, request);
  const requestOrigin = new URL(request.url).origin; if (target.origin === requestOrigin) return json({ logoUrl: `${target.origin}/favicon.svg` }, 200, request);
  let resolvedOrigin = target.origin;
  try {
    const landing = await fetch(target.href, { method: 'GET', headers: { 'User-Agent': 'Mozilla/5.0 Skill-Foundry-Logo-Fetcher' }, redirect: 'follow' });
    if (landing.ok || landing.status < 400) { resolvedOrigin = new URL(landing.url).origin; const htmlType = landing.headers.get('content-type') || ''; if (htmlType.includes('text/html')) { const html = await landing.text(); const match = html.match(/<link[^>]+rel=["'][^"']*icon[^"']*["'][^>]+href=["']([^"']+)["']/i) || html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["'][^"']*icon[^"']*["']/i); if (match?.[1]) { try { return json({ logoUrl: new URL(match[1], landing.url).href }, 200, request); } catch {} } } }
  } catch {}
  for (const candidate of [`${resolvedOrigin}/favicon.svg`, `${resolvedOrigin}/favicon.ico`, `${resolvedOrigin}/apple-touch-icon.png`]) { try { const response = await fetch(candidate, { headers: { 'User-Agent': 'Mozilla/5.0 Skill-Foundry-Logo-Fetcher' }, redirect: 'follow' }); const type = response.headers.get('content-type') || ''; if (response.ok && (type.startsWith('image/') || candidate.endsWith('.ico'))) return json({ logoUrl: response.url }, 200, request); } catch {} }
  return json({ logoUrl: `${resolvedOrigin}/favicon.svg` }, 200, request);
}

const injectBodyScript = (response, script) => new HTMLRewriter().on('body', { element(element) { element.append(`<script src="${script}" defer></script>`, { html: true }); } }).transform(response);
const injectHeadCss = (response) => new HTMLRewriter().on('head', { element(element) { element.append('<link rel="stylesheet" href="/image-display-fixes.css">', { html: true }); } }).transform(response);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === 'OPTIONS' && url.pathname.startsWith('/api/')) return new Response(null, { status: 204, headers: { ...corsHeaders(request), 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type,X-File-Name' } });
    if (request.method === 'POST' && url.pathname === '/api/upload-image') { try { return await uploadImage(request, env); } catch (error) { return json({ error: error?.message || 'Image upload failed.' }, error?.status || 500, request); } }
    if (request.method === 'GET' && url.pathname === '/api/tool-logo') { try { return await fetchToolLogo(request); } catch (error) { return json({ error: error?.message || 'Logo lookup failed.' }, 500, request); } }
    let response = await env.ASSETS.fetch(request);
    const contentType = response.headers.get('content-type') || '';
    if (request.method === 'GET' && contentType.includes('text/html')) response = injectHeadCss(response);
    if (request.method === 'GET' && url.pathname.startsWith('/resources/') && contentType.includes('text/html')) response = injectBodyScript(response, '/resource-tool-logos.js');
    if (request.method === 'GET' && url.pathname.startsWith('/admin/') && contentType.includes('text/html')) response = injectBodyScript(response, '/admin/image-controls.js');
    return response;
  }
};
