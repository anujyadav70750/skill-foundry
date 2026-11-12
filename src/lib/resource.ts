import type { CollectionEntry } from 'astro:content';

export const PLACEHOLDER_IMAGE = '/images/placeholder.svg';

export function resourceSlug(resource: CollectionEntry<'resources'>) {
  return resource.data.slug?.trim() || resource.id.replace(/\.md$/, '');
}

export function formatResourceDate(value: Date | string | null | undefined) {
  if (!value) return '';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(date);
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

export function resourceHeroImage(resource: CollectionEntry<'resources'>) {
  // One canonical image identifies this resource everywhere: hero, search, listings and related cards.
  return firstUsableImage(
    resource.data.heroImage,
    resource.data.thumbnail,
    resource.data.inputImage,
    ...resourceResultImages(resource)
  );
}

export function resourceDisplayImage(image: string | null | undefined, width: 320 | 480 | 640 | 960 | 1280 | 1600 = 640) {
  const source = image?.trim() || PLACEHOLDER_IMAGE;
  if (!source.startsWith('/images/') || source.startsWith('/media/')) return source;

  const pathname = source.split(/[?#]/, 1)[0];
  if (!/\.(?:png|jpe?g|webp)$/i.test(pathname)) return source;

  return `/media${pathname}?w=${width}`;
}

export function resourceDisplaySrcSet(image: string | null | undefined, widths: Array<320 | 480 | 640 | 960 | 1280 | 1600> = [320, 480, 640]) {
  const source = image?.trim() || PLACEHOLDER_IMAGE;
  if (!source.startsWith('/images/') || source.startsWith('/media/')) return undefined;
  const pathname = source.split(/[?#]/, 1)[0];
  if (!/\\.(?:png|jpe?g|webp)$/i.test(pathname)) return undefined;
  return [...new Set(widths)]
    .sort((a, b) => a - b)
    .map((width) => `/media${pathname}?w=${width} ${width}w`)
    .join(', ');
}

export function resourceThumbnail(resource: CollectionEntry<'resources'>) {
  // Use a cached, smaller display copy for cards while keeping the original file for downloads.
  return resourceDisplayImage(resourceHeroImage(resource), 640);
}
