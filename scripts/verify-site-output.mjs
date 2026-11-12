import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const siteOrigin = 'https://hub.skillfoundry-web.workers.dev';
const requiredRoutes = [
  '/', '/resources/', '/guides/', '/faq/',
  '/about/', '/contact/', '/privacy/', '/terms/'
];

function fail(message) {
  console.error('[site-check] FAIL: ' + message);
  process.exitCode = 1;
}

function routeFile(route) {
  const clean = decodeURIComponent(route.split(/[?#]/, 1)[0] || '/');
  const relative = clean.replace(/^\/+/, '');
  const candidates = [];
  if (!relative) candidates.push(path.join(dist, 'index.html'));
  else {
    candidates.push(path.join(dist, relative, 'index.html'));
    if (/\.[a-z0-9]{1,8}$/i.test(relative)) candidates.push(path.join(dist, relative));
    else candidates.push(path.join(dist, relative + '.html'));
  }
  return candidates.find((candidate) =>
    (candidate.startsWith(dist + path.sep) || candidate === path.join(dist, 'index.html')) &&
    fs.existsSync(candidate)
  );
}

function attr(tag, name) {
  const pattern = new RegExp('(?:^|\\s)' + name + '\\s*=\\s*["]([^"]*)["]', 'i');
  return tag.match(pattern)?.[1] ?? '';
}

function decodeEntities(value) {
  return value.replace(/&amp;/g, '&').replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
}

if (!fs.existsSync(dist)) {
  fail('The built dist folder does not exist. Run npm run build first.');
  process.exit(1);
}

const sitemapPath = path.join(dist, 'sitemap.xml');
const robotsPath = path.join(dist, 'robots.txt');
if (!fs.existsSync(sitemapPath)) fail('sitemap.xml was not generated.');
if (!fs.existsSync(robotsPath)) fail('robots.txt was not generated.');

if (fs.existsSync(sitemapPath)) {
  const sitemap = fs.readFileSync(sitemapPath, 'utf8');
  const locations = [...sitemap.matchAll(/<loc>([\s\S]*?)<\/loc>/gi)]
    .map((match) => decodeEntities(match[1].trim()));
  const seen = new Set();

  for (const location of locations) {
    let parsed;
    try { parsed = new URL(location); } catch {
      fail('Sitemap contains an invalid URL: ' + location);
      continue;
    }
    if (parsed.origin !== siteOrigin) {
      fail('Sitemap URL uses an unexpected domain: ' + location);
      continue;
    }
    if (seen.has(parsed.pathname)) fail('Sitemap contains a duplicate route: ' + parsed.pathname);
    seen.add(parsed.pathname);
    if (!routeFile(parsed.pathname)) fail('Sitemap route has no generated page: ' + parsed.pathname);
  }

  for (const route of requiredRoutes) {
    if (!seen.has(route)) fail('Sitemap is missing the public page ' + route);
  }
  for (const privateRoute of ['/admin', '/admin/', '/search', '/search/']) {
    if (seen.has(privateRoute)) fail('Private or redirect route should not be in sitemap: ' + privateRoute);
  }
}

if (fs.existsSync(robotsPath)) {
  const robots = fs.readFileSync(robotsPath, 'utf8');
  if (!/^Disallow:\s*\/admin\/?$/im.test(robots)) fail('robots.txt does not disallow the admin area.');
  if (!/^Disallow:\s*\/api\//im.test(robots)) fail('robots.txt does not disallow API endpoints.');
  if (!/Sitemap:\s*https:\/\/hub\.skillfoundry-web\.workers\.dev\/sitemap\.xml/i.test(robots)) {
    fail('robots.txt does not point to the canonical sitemap.');
  }
}

const htmlFiles = [];
function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile() && entry.name.endsWith('.html')) htmlFiles.push(full);
  }
}
walk(dist);
if (!htmlFiles.length) fail('No generated HTML pages were found.');

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  const relative = path.relative(dist, file).split(path.sep).join('/');
  const isAdmin = relative === 'admin/index.html';
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? '';
  const metaTags = [...html.matchAll(/<meta\b[^>]*>/gi)].map((match) => match[0]);
  const descriptions = metaTags.filter((tag) => attr(tag, 'name').toLowerCase() === 'description');
  const canonicalTags = [...html.matchAll(/<link\b[^>]*>/gi)].map((match) => match[0])
    .filter((tag) => attr(tag, 'rel').toLowerCase() === 'canonical');
  const robotsTags = metaTags.filter((tag) => attr(tag, 'name').toLowerCase() === 'robots');

  if (!title) fail(relative + ': missing page title.');
  if (descriptions.length !== 1 || !attr(descriptions[0] || '', 'content').trim()) {
    fail(relative + ': expected exactly one non-empty meta description.');
  }
  if (canonicalTags.length !== 1) {
    fail(relative + ': expected exactly one canonical link.');
  } else {
    try {
      const canonical = new URL(attr(canonicalTags[0], 'href'));
      if (canonical.origin !== siteOrigin) fail(relative + ': canonical URL has the wrong domain.');
    } catch {
      fail(relative + ': canonical URL is invalid.');
    }
  }
  if (isAdmin && !robotsTags.some((tag) => /noindex/i.test(attr(tag, 'content')))) {
    fail('Admin page must include a noindex robots instruction.');
  }

  for (const key of ['og:title', 'og:description', 'og:url', 'og:image']) {
    const found = metaTags.some((tag) => attr(tag, 'property') === key && !!attr(tag, 'content').trim());
    if (!found) fail(relative + ': missing Open Graph ' + key + ' metadata.');
  }
  if (!metaTags.some((tag) => attr(tag, 'name').toLowerCase() === 'twitter:card' &&
      /^(summary|summary_large_image)$/.test(attr(tag, 'content')))) {
    fail(relative + ': missing Twitter card metadata.');
  }

  const pageRoute = '/' + relative.replace(/index\.html$/, '').replace(/\.html$/, '');
  const currentUrl = new URL(pageRoute === '/' ? '/' : pageRoute, siteOrigin);
  const tags = [...html.matchAll(/<(?:a|img|script|link|source)\b[^>]*>/gi)].map((match) => match[0]);
  for (const tag of tags) {
    const name = tag.match(/^<([a-z]+)/i)?.[1]?.toLowerCase();
    const attribute = name === 'a' ? 'href' :
      (name === 'img' || name === 'script' || name === 'source' ? 'src' : 'href');
    const value = attr(tag, attribute).trim();
    if (!value || value.startsWith('#') || /^(mailto:|tel:|javascript:|data:|blob:)/i.test(value)) continue;
    let target;
    try { target = new URL(value, currentUrl); } catch { continue; }
    if (target.origin !== siteOrigin) continue;
    if (target.pathname.startsWith('/media/') || target.pathname.startsWith('/api/')) continue;
    if (!routeFile(target.pathname)) fail(relative + ': broken local ' + attribute + ' target ' + target.pathname);
  }
}

if (process.exitCode) process.exit(process.exitCode);
console.log('[site-check] Passed: ' + htmlFiles.length + ' HTML pages, sitemap routes, robots rules, metadata and local links.');
