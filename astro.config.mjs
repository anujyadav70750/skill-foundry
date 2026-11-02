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
                if (fs.statSync(srcPath).isDirectory()) {
                  fs.cpSync(srcPath, destPath, { recursive: true });
                } else {
                  fs.copyFileSync(srcPath, destPath);
                }
              }
            }
          }
        }
      }
    }
  };
}

function injectFooterStyles() {
  return {
    name: 'inject-footer-styles',
    hooks: {
      'astro:build:done': () => {
        const targetDir = path.join(process.cwd(), 'dist');
        const footerStylesheet = '<link rel="stylesheet" href="/footer-overrides.css?v=20261101-footer-v2">';
        const stepNavStylesheet = '<link rel="stylesheet" href="/resource-step-nav-overrides.css?v=20261102-step-nav-v1">';
        const editorialStylesheet = '<link rel="stylesheet" href="/resource-editorial-overrides.css?v=20261102-editorial-v1">';

        const walk = (dir) => {
          if (!fs.existsSync(dir)) return;
          for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
              walk(fullPath);
            } else if (entry.isFile() && entry.name.endsWith('.html')) {
              let html = fs.readFileSync(fullPath, 'utf8');
              let updated = html;
              if (!updated.includes('/footer-overrides.css')) {
                updated = updated.replace('</head>', `    ${footerStylesheet}\n  </head>`);
              }
              if (!updated.includes('/resource-step-nav-overrides.css')) {
                updated = updated.replace('</head>', `    ${stepNavStylesheet}\n  </head>`);
              }
              if (!updated.includes('/resource-editorial-overrides.css')) {
                updated = updated.replace('</head>', `    ${editorialStylesheet}\n  </head>`);
              }
              if (updated !== html) {
                fs.writeFileSync(fullPath, updated, 'utf8');
              }
            }
          }
        };

        walk(targetDir);
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
  integrations: [sitemap(), fixDynamicRouteFilenames(), injectFooterStyles()],
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
