import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { resourceSlug } from '../lib/resource';

const staticPaths = ['/', '/resources/', '/about/', '/privacy/', '/terms/'];

const escapeXml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&apos;');

export const GET: APIRoute = async ({ site }) => {
  const base = site ?? new URL('https://hub.skillfoundryai.workers.dev');
  const resources = await getCollection('resources');
  const urls = [
    ...staticPaths.map((path) => ({ loc: new URL(path, base).href })),
    ...resources.map((resource) => ({
      loc: new URL(`/resources/${resourceSlug(resource)}/`, base).href,
      lastmod: resource.data.date.toISOString().split('T')[0]
    }))
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(({ loc, lastmod }) => `  <url>\n    <loc>${escapeXml(loc)}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}\n  </url>`).join('\n')}\n</urlset>\n`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8'
    }
  });
};
