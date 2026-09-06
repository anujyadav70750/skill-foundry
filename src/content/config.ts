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
    prompt: z.string(),
    videoEmbedUrl: z.string().nullable().optional(),
    originalVideoUrl: z.string().nullable().optional(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false)
  })
});

export const collections = { resources };
