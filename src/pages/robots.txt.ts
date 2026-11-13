import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL('sitemap.xml', site ?? 'https://hub.skillfoundry-web.workers.dev');
  const body = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/
Disallow: /api/

User-agent: OAI-SearchBot
Allow: /
Disallow: /admin
Disallow: /admin/
Disallow: /api/

User-agent: ChatGPT-User
Allow: /
Disallow: /admin
Disallow: /admin/
Disallow: /api/

User-agent: GPTBot
Disallow: /

User-agent: Claude-SearchBot
Allow: /
Disallow: /admin
Disallow: /admin/
Disallow: /api/

User-agent: Claude-User
Allow: /
Disallow: /admin
Disallow: /admin/
Disallow: /api/

User-agent: ClaudeBot
Disallow: /

Sitemap: ${sitemap.href}
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
