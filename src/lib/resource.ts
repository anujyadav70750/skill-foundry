import type { CollectionEntry } from 'astro:content';

export const PLACEHOLDER_IMAGE = '/images/placeholder.svg';

export function resourceSlug(resource: CollectionEntry<'resources'>) {
  return resource.data.slug || resource.id.replace(/\.md$/, '');
}

export function resourceThumbnail(resource: CollectionEntry<'resources'>) {
  return resource.data.thumbnail === PLACEHOLDER_IMAGE && resource.data.resultImages.length > 0
    ? resource.data.resultImages[0]
    : resource.data.thumbnail;
}

export function resourceHeroImage(resource: CollectionEntry<'resources'>) {
  return resource.data.heroImage === PLACEHOLDER_IMAGE && resource.data.resultImages.length > 0
    ? resource.data.resultImages[0]
    : resource.data.heroImage;
}
