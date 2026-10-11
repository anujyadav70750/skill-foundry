import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://hub.skillfoundry-web.workers.dev',
  output: 'static',
  compressHTML: true,
  devToolbar: {
    enabled: false
  },
  integrations: [sitemap()],
  server: {
    host: '0.0.0.0',
    port: 3000
  },
  vite: {
    server: {
      hmr: false
    },
    plugins: [
      {
        name: 'skill-foundry-mobile-workflow-css',
        transformIndexHtml() {
          return [
            {
              tag: 'link',
              attrs: {
                rel: 'stylesheet',
                href: '/workflow-mobile-fix.css?v=20261011-mobile-square-v2'
              },
              injectTo: 'head'
            }
          ];
        }
      }
    ]
  }
});
