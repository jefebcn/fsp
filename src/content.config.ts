import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

export const CATEGORY_KEYS = ['giovanili', 'nazionali', 'campionato', 'minibasket', 'federazione', 'hall-of-fame'] as const;

const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    categories: z.array(z.enum(CATEGORY_KEYS)).default(['federazione']),
    featured: z.boolean().default(false),
    cover: z.string().optional(),
    gallery: z.array(z.string()).default([]),
    videos: z.array(z.string()).default([]),
    excerpt: z.string().default(''),
    legacyId: z.number().optional(),
    legacyUrl: z.string().optional(),
  }),
});

export const collections = { news };
