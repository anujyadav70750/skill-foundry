import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import fs from 'node:fs';
import path from 'node:path';

function fixDynamicRouteFilenames() {
  return {
    name: 'fix-dynamic-route-filenames',
    hooks: {
      'astro:build:ssr': () => {
        const targetDir = path.join(process.cwd(), 'dist', 'pages', 'resources');
        if (fs.existsSync(targetDir)) {
          const files = fs.readdirSync(targetDir);
          for (const file of files) {
            if (file.includes('%5b') || file.includes('%5d') || file.includes('_slug_')) {
              const decoded = decodeURIComponent(file).replace(/_slug_/g, '[slug]');
              const srcPath = path.join(targetDir, file);
              const destPath = path.join(targetDir, decoded);
              if (srcPath !== destPath && !fs.existsSync(destPath)) {
                fs.copyFileSync(srcPath, destPath);
              }
            }
          }
        }
      }
    }
  };
}

export default defineConfig({
  site: 'https://hub.skillfoundry-web.workers.dev',
  output: 'static',
  compressHTML: true,
  devToolbar: {
    enabled: false
  },
  integrations: [sitemap(), fixDynamicRouteFilenames()],
  server: {
    host: '0.0.0.0',
    port: 3000
  },
  vite: {
    server: {
      hmr: false
    }
  }
});
