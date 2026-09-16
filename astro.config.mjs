import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://hub.skillfoundryai.workers.dev',
  output: 'static',
  compressHTML: true,
  integrations: [sitemap()],
  server: {
    host: '0.0.0.0',
    port: 3000
  }
});
