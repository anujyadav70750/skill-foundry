# Skill Foundry

Skill Foundry is a practical learning library for AI prompts, workflows and tutorials.

## Project structure

- `src/pages/` — public pages and routes
- `src/content/resources/` — resource content files
- `src/content/config.ts` — resource content schema
- `src/lib/resource.ts` — shared resource image and slug helpers
- `src/styles/global.css` — shared visual system
- `public/images/` — published image assets

## Adding a resource

Resources are data-driven. Add a Markdown file under `src/content/resources/` and provide the required content fields from `src/content/config.ts`.

Required fields:

- `title`
- `description`
- `category`
- `tool`
- `date`
- `prompt`

Useful optional fields include:

- `slug`
- `thumbnail`
- `heroImage`
- `inputImage`
- `resultImages` (up to three are displayed)
- `imageAlt`
- `intro`
- `whatItDoes`
- `videoEmbedUrl`
- `originalVideoUrl`
- `steps`
- `tips`
- `relatedResources`
- `tags`
- `seoTitle`
- `seoDescription`
- `featured`

Media is optional. A resource can publish without a tutorial video or input image, and image fallbacks are handled by the shared resource helpers.

## Content and automation boundary

The website is responsible for publishing and rendering resource content. It does **not** generate AI images or prompts itself.

A future external automation workflow may create or update resource content files from a source workflow. The website should continue to treat those files as the publishing contract and should not require manual code changes for normal resource additions.

## Development

```bash
npm install
npm run dev
```

Build the static site with:

```bash
npm run build
```

The site is configured for static deployment to Cloudflare Workers using the root `wrangler.jsonc` assets configuration.
