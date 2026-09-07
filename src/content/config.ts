import { defineCollection, z } from 'astro:content';

const resources = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
    tool: z.string(),
    date: z.coerce.date(),
    thumbnail: z.string().default('/images/placeholder.svg'),
    heroImage: z.string().default('/images/placeholder.svg'),
    resultImages: z.array(z.string()).default([]),
    prompt: z.string(),
    videoEmbedUrl: z.string().nullish(),
    originalVideoUrl: z.string().nullish(),
    tags: z.array(z.string()).default([]),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    featured: z.boolean().default(false)
  })
});

export const collections = { resources };
