const REPO_OWNER = 'anujyadav70750';
const REPO_NAME = 'skill-foundry';
const DEFAULT_BRANCH = 'main';
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }
});

const safeFilename = (name) => {
  const cleaned = String(name || 'image').normalize('NFKD').replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/^-+|-+$/g, '').toLowerCase();
  return cleaned || 'image';
};

const toBase64 = (bytes) => {
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
};

const githubHeaders = (token) => ({
  'Accept': 'application/vnd.github+json',
  'Authorization': `Bearer ${token}`,
  'X-GitHub-Api-Version': '2026-03-10',
  'User-Agent': 'Skill-Foundry-Resource-Builder',
  'Content-Type': 'application/json'
});

async function uploadImage(request, env) {
  if (!env.GITHUB_TOKEN) return json({ error: 'GitHub upload is not configured yet. Add the GITHUB_TOKEN secret in Cloudflare.' }, 503);
  const form = await request.formData();
  const file = form.get('file');
  if (!(file instanceof File)) return json({ error: 'No image file was received.' }, 400);
  if (!file.type.startsWith('image/')) return json({ error: 'Only image files are allowed.' }, 415);
  if (file.size > MAX_IMAGE_BYTES) return json({ error: 'Image is too large. Maximum size is 8 MB.' }, 413);

  const bytes = new Uint8Array(await file.arrayBuffer());
  const ext = file.name.includes('.') ? file.name.split('.').pop().toLowerCase() : (file.type.split('/')[1] || 'jpg');
  const base = safeFilename(file.name.replace(/\.[^.]+$/, ''));
  const filename = `${base}-${Date.now()}.${ext}`;
  const path = `public/images/${filename}`;
  const apiUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`;
  const response = await fetch(apiUrl, {
    method: 'PUT',
    headers: githubHeaders(env.GITHUB_TOKEN),
    body: JSON.stringify({
      message: `Add resource image ${filename}`,
      content: toBase64(bytes),
      branch: DEFAULT_BRANCH,
      committer: { name: 'Skill Foundry Resource Builder', email: '41898282+github-actions[bot]@users.noreply.github.com' }
    })
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) return json({ error: result.message || 'GitHub rejected the image upload.' }, response.status);
  return json({ path: `/images/${filename}`, name: filename });
}

async function fetchToolLogo(request) {
  const url = new URL(request.url).searchParams.get('url');
  if (!url) return json({ error: 'Tool website URL is required.' }, 400);
  let target;
  try { target = new URL(url); } catch { return json({ error: 'Invalid tool website URL.' }, 400); }
  if (!['http:', 'https:'].includes(target.protocol)) return json({ error: 'Only HTTP and HTTPS websites are supported.' }, 400);

  let resolvedOrigin = target.origin;
  try {
    const landing = await fetch(target.href, { method: 'GET', headers: { 'User-Agent': 'Mozilla/5.0 Skill-Foundry-Logo-Fetcher' }, redirect: 'follow' });
    if (landing.ok || landing.status < 400) resolvedOrigin = new URL(landing.url).origin;
  } catch {}
  const candidates = [
    `${resolvedOrigin}/favicon.ico`,
    `${resolvedOrigin}/favicon.svg`,
    `${resolvedOrigin}/apple-touch-icon.png`
  ];
  for (const candidate of candidates) {
    try {
      const response = await fetch(candidate, { headers: { 'User-Agent': 'Mozilla/5.0 Skill-Foundry-Logo-Fetcher' }, redirect: 'follow' });
      const type = response.headers.get('content-type') || '';
      if (response.ok && (type.startsWith('image/') || candidate.endsWith('.ico'))) return json({ logoUrl: response.url });
    } catch {}
  }
  return json({ logoUrl: `${resolvedOrigin}/favicon.ico` });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === 'POST' && url.pathname === '/api/upload-image') {
      try { return await uploadImage(request, env); } catch (error) { return json({ error: error?.message || 'Image upload failed.' }, 500); }
    }
    if (request.method === 'GET' && url.pathname === '/api/tool-logo') {
      try { return await fetchToolLogo(request); } catch (error) { return json({ error: error?.message || 'Logo lookup failed.' }, 500); }
    }
    const response = await env.ASSETS.fetch(request);
    const contentType = response.headers.get('content-type') || '';
    if (request.method === 'GET' && url.pathname.startsWith('/resources/') && contentType.includes('text/html')) {
      return new HTMLRewriter().on('body', { element(element) { element.append('<script src="/resource-tool-logos.js" defer></script>', { html: true }); } }).transform(response);
    }
    return response;
  }
};
