import type { CollectionEntry } from 'astro:content';

export const PLACEHOLDER_IMAGE = '/images/placeholder.svg';

export function resourceSlug(resource: CollectionEntry<'resources'>) {
  return resource.data.slug || resource.id.replace(/\.md$/, '');
}

function firstUsableImage(...images: Array<string | null | undefined>) {
  return images.find((image) => image && image !== PLACEHOLDER_IMAGE) || PLACEHOLDER_IMAGE;
}

export function resourceThumbnail(resource: CollectionEntry<'resources'>) {
  return firstUsableImage(
    resource.data.thumbnail,
    resource.data.heroImage,
    resource.data.inputImage,
    ...resource.data.resultImages
  );
}

export function resourceHeroImage(resource: CollectionEntry<'resources'>) {
  return firstUsableImage(
    resource.data.heroImage,
    resource.data.thumbnail,
    resource.data.resultImages[0],
    resource.data.inputImage
  );
}
