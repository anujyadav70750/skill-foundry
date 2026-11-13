import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { resourceDisplayDate, resourceSlug } from '../lib/resource';
import { authorPath, SKILL_FOUNDRY_AUTHOR_ID } from '../lib/author';
import { AUTHOR_PROFILES } from '../data/authors';
import { authorCategorySlug } from '../lib/author';

const staticPaths = [
  '/',
  '/resources/',
  '/guides/',
  '/faq/',
  '/about/',
  '/contact/',
  '/privacy/',
  '/terms/'
];

const escapeXml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&apos;');

export const GET: APIRoute = async ({ site }) => {
  const base = site ?? new URL('https://hub.skillfoundry-web.workers.dev');
  const resources = (await getCollection('resources'))
    .filter((resource) => !('draft' in resource.data && resource.data.draft === true))
    .filter((resource) => resourceSlug(resource) !== 'testing-1');
  const authorPaths = Object.values(AUTHOR_PROFILES).flatMap((profile) => {
    const profileBase = authorPath(profile.id);
    const owned = resources.filter((resource) => resource.data.authorId === profile.id);
    const categories = [...new Set(owned.map((resource) => resource.data.category?.trim()).filter(Boolean))];
    return [
      profileBase,
      profileBase + 'resources/',
      profileBase + 'about/',
      ...categories.map((category) => profileBase + 'category/' + authorCategorySlug(category) + '/')
    ];
  });
  const urls = [
    ...staticPaths.map((path) => ({ loc: new URL(path, base).href })),
    ...authorPaths.map((path) => ({ loc: new URL(path, base).href })),
    ...resources.map((resource) => ({
      loc: new URL(`/resources/${resourceSlug(resource)}/`, base).href,
      lastmod: resourceDisplayDate(resource).toISOString().split('T')[0]
    }))
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(({ loc, lastmod }) => `  <url>\n    <loc>${escapeXml(loc)}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}\n  </url>`).join('\n')}\n</urlset>\n`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8'
    }
  });
};
