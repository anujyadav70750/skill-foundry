import { defineCollection, z } from 'astro:content';

const resources = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
    description: z.string(),
    category: z.string(),
    tool: z.string(),
    toolUrl: z.string().url().optional(),
    toolAffiliate: z.boolean().default(false),
    date: z.coerce.date(),
    thumbnail: z.string().nullish(),
    heroImage: z.string().nullish(),
    inputImage: z.string().nullish(),
    inputImages: z.array(z.string()).default([]),
    resultImages: z.array(z.string()).default([]),
    imageAlt: z.string().nullish(),
    intro: z.string().optional(),
    whatItDoes: z.string().optional(),
    toolsUsed: z.array(z.object({
      name: z.string(),
      purpose: z.string(),
      url: z.string().url().optional(),
      affiliate: z.boolean().default(false)
    })).default([]),
    prompt: z.string(),
    videoEmbedUrl: z.string().nullish(),
    originalVideoUrl: z.string().nullish(),
    steps: z.array(z.object({
      title: z.string(),
      description: z.string()
    })).default([]),
    tips: z.array(z.string()).default([]),
    relatedResources: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    featured: z.boolean().default(false)
  })
});

export const collections = { resources };
