import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL('sitemap-index.xml', site ?? 'https://hub.skillfoundryai.workers.dev');
  const body = `User-agent: *\nAllow: /\n\nSitemap: ${sitemap.href}\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
