import type { CollectionEntry } from 'astro:content';

export const PLACEHOLDER_IMAGE = '/images/placeholder.svg';

export function resourceSlug(resource: CollectionEntry<'resources'>) {
  return resource.data.slug?.trim() || resource.id.replace(/\.md$/, '');
}

function usableImages(images: Array<string | null | undefined>) {
  return [...new Set(
    images
      .map((image) => image?.trim())
      .filter((image): image is string => Boolean(image) && image !== PLACEHOLDER_IMAGE)
  )];
}

function firstUsableImage(...images: Array<string | null | undefined>) {
  return usableImages(images)[0] || PLACEHOLDER_IMAGE;
}

export function resourceResultImages(resource: CollectionEntry<'resources'>) {
  return usableImages(resource.data.resultImages).slice(0, 3);
}

export function resourceImageAlt(resource: CollectionEntry<'resources'>) {
  return resource.data.imageAlt?.trim() || resource.data.title;
}

export function resourceThumbnail(resource: CollectionEntry<'resources'>) {
  return firstUsableImage(
    resource.data.thumbnail,
    resource.data.heroImage,
    resource.data.inputImage,
    ...resourceResultImages(resource)
  );
}

export function resourceHeroImage(resource: CollectionEntry<'resources'>) {
  return firstUsableImage(
    resource.data.heroImage,
    resource.data.thumbnail,
    ...resourceResultImages(resource),
    resource.data.inputImage
  );
}
