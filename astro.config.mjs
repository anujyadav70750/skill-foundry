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
    name: 'inject-page-styles',
    hooks: {
      'astro:build:done': () => {
        const targetDir = path.join(process.cwd(), 'dist');
        const sharedStylesheets = [
          '<link rel="stylesheet" href="/footer-overrides.css?v=20261105-footer-v7">',
          '<link rel="stylesheet" href="/site-icon-accent.css?v=20261112-neutral-icons-v4">',
          '<link rel="stylesheet" href="/site-page-consistency.css?v=20261111-filter-menu-v3">'
        ];
        const resourceDetailStylesheets = [
          '<link rel="stylesheet" href="/resource-step-nav-overrides.css?v=20261102-step-nav-v1">',
          '<link rel="stylesheet" href="/resource-instagram-overrides.css?v=20261102-instagram-v1">',
          '<link rel="stylesheet" href="/resource-step-card-final-overrides.css?v=20261103-step-card-final-v5">',
          '<link rel="stylesheet" href="/resource-tool-used-refinement.css?v=20261103-tool-used-v3">',
          '<link rel="stylesheet" href="/resource-aspect-ratio-correction.css?v=20261103-aspect-ratio-v1">'
        ];

        const walk = (dir) => {
          if (!fs.existsSync(dir)) return;
          for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
              walk(fullPath);
            } else if (entry.isFile() && entry.name.endsWith('.html')) {
              const relativePath = path.relative(targetDir, fullPath).split(path.sep).join('/');
              const isResourceDetailPage = /^resources\/[^/]+\/index\.html$/.test(relativePath);
              const stylesheets = isResourceDetailPage
                ? [
                    sharedStylesheets[0],
                    ...resourceDetailStylesheets,
                    ...sharedStylesheets.slice(1)
                  ]
                : sharedStylesheets;

              let html = fs.readFileSync(fullPath, 'utf8');
              let updated = html;
              for (const stylesheet of stylesheets) {
                const href = stylesheet.match(/href="([^"]+)"/)?.[1];
                if (href && !updated.includes(href.split('?')[0])) {
                  updated = updated.replace('</head>', `    ${stylesheet}\n  </head>`);
                }
              }
              if (updated !== html) fs.writeFileSync(fullPath, updated, 'utf8');
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
  integrations: [sitemap(), fixDynamicRouteFilenames(), injectFooterStyles()]
});
