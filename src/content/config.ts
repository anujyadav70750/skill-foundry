import { defineCollection, z } from 'astro:content';

const workflowInput = z.object({
  type: z.enum(['image', 'video', 'audio', 'text', 'document']).default('text'),
  label: z.string().default(''),
  role: z.string().default(''),
  value: z.string().default(''),
  src: z.string().default('')
});

const workflowSetting = z.object({
  label: z.string(),
  value: z.string()
});

const workflowStep = z.object({
  title: z.string(),
  tool: z.string().default(''),
  toolPurpose: z.string().default(''),
  input: z.string().default(''),
  inputs: z.array(workflowInput).default([]),
  settings: z.array(workflowSetting).default([]),
  process: z.string().default(''),
  output: z.string().default(''),
  next: z.string().default(''),
  description: z.string().default(''),
  actionType: z.enum(['prompt','instructions']).optional(),
  outputType: z.enum(['image','video','audio','text','document']).optional(),
  outputLabel: z.string().optional(),
  outputDescription: z.string().optional(),
  outputSrc: z.string().optional()
});

const resourceTool = z.object({
  name: z.string(),
  purpose: z.string(),
  url: z.string().url().optional(),
  affiliate: z.boolean().default(false)
});

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
    thumbnailRatio: z.string().default('16:9'),
    thumbnailPositionX: z.number().min(0).max(100).default(50),
    thumbnailPositionY: z.number().min(0).max(100).default(50),
    heroImage: z.string().nullish(),
    inputImage: z.string().nullish(),
    inputImages: z.array(z.string()).default([]),
    inputImageRatios: z.array(z.string()).default([]),
    resultImages: z.array(z.string()).default([]),
    resultImageRatios: z.array(z.string()).default([]),
    imageAlt: z.string().nullish(),
    intro: z.string().optional(),
    whatItDoes: z.string().optional(),
    toolsUsed: z.array(resourceTool).default([]),
    prompt: z.string(),
    videoEmbedUrl: z.string().nullish(),
    originalVideoUrl: z.string().nullish(),
    steps: z.array(workflowStep).default([]),
    tips: z.array(z.string()).default([]),
    relatedResources: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    featured: z.boolean().default(false)
  })
});

export const collections = { resources };
