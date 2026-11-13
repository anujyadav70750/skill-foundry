import fs from 'node:fs';

const host = 'hub.skillfoundry-web.workers.dev';
const key = '8f3a9c1d7e2b4a6f9c0d5e1b3a7f2c8d';
const keyLocation = \`https://\${host}/\${key}.txt\`;
const sitemapPath = new URL('../dist/sitemap.xml', import.meta.url);

if (!fs.existsSync(sitemapPath)) {
  throw new Error('IndexNow: dist/sitemap.xml was not found.');
}

const sitemap = fs.readFileSync(sitemapPath, 'utf8');
const urls = [...sitemap.matchAll(/<loc>([\s\S]*?)<\/loc>/gi)]
  .map((match) => match[1].trim().replaceAll('&amp;', '&'))
  .filter((value) => {
    const url = new URL(value);
    return url.hostname === host && url.protocol === 'https:';
  });

if (urls.length === 0) {
  throw new Error('IndexNow: no valid site URLs were found in the sitemap.');
}

const response = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({
    host,
    key,
    keyLocation,
    urlList: [...new Set(urls)]
  }),
  signal: AbortSignal.timeout(20000)
});

if (!response.ok) {
  const details = await response.text();
  throw new Error(\`IndexNow request failed (\${response.status}): \${details}\`);
}

console.log(\`[IndexNow] Submitted \${new Set(urls).size} Skill Foundry URLs. HTTP \${response.status}.\`);
